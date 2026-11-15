/**
 * The ingestion run. One pass over the source inventory:
 *
 *   1 discover sources      7 de-duplicate by URL       13 score for triage
 *   2 check robots.txt      8 cluster near-duplicates   14 queue for editorial review
 *   3 fetch                 9 resolve entities          15 persist items, hashes, alerts
 *   4 snapshot + hash      10 classify type and area    16 publish run status
 *   5 parse                11 match to canonical developments
 *   6 normalize            12 compare pricing pages with the knowledge base
 *
 * Nothing is written into the curated knowledge base automatically. Detected
 * items are shown on the site as unreviewed, and a failed run is reported as
 * failed — the status never claims a freshness the run did not achieve.
 */
import { todayISO } from "../dates";
import { ANNOUNCEMENTS, SOURCE_BY_ID } from "../kb";
import { deadlines } from "../engine/brief";
import { AI_SIGNAL, classifyAreas, classifyTypes, layersFor, resolveEntities } from "./classify";
import { cluster, itemId, jaccard, tokens } from "./cluster";
import { checkRobots, httpFetch, type Fetcher } from "./fetch";
import { canonicalUrl, contentHash, parseFeed, text } from "./parse";
import { checkPrices } from "./pricewatch";
import { FEEDS, FEED_BY_KEY } from "./registry";
import { readStored, writeStored } from "./store";
import type { Alert, DetectedItem, Feed, FeedRun, PriceCheck, RawItem, RunStatus } from "./types";

export interface RunOptions {
  fetcher?: Fetcher;
  feeds?: Feed[];
  now?: Date;
  /** Skip persistence (tests, dry runs). */
  dryRun?: boolean;
}

/** Canonical announcement an item corresponds to, by cited URL or near-identical title. */
export function matchCanonical(title: string, url: string): string | undefined {
  const target = canonicalUrl(url);
  const toks = tokens(title);
  for (const a of ANNOUNCEMENTS) {
    if (a.sourceIds.some((id) => SOURCE_BY_ID[id] && canonicalUrl(SOURCE_BY_ID[id].url) === target)) return a.id;
    if (jaccard(tokens(a.title), toks) >= 0.7) return a.id;
  }
  return undefined;
}

function triageScore(d: Pick<DetectedItem, "types" | "entityIds" | "alsoAt" | "providerId">, feed: Feed): number {
  let s = 20;
  const heavy = ["model-launch", "pricing", "deprecation", "availability", "rename", "acquisition"];
  if (d.types.some((t) => heavy.includes(t))) s += 30;
  s += Math.min(20, d.entityIds.length * 5);
  s += Math.min(10, d.alsoAt.length * 5);
  if (feed.category === "release-notes" || feed.category === "pricing-page") s += 10;
  if (d.providerId === "google") s += 10;
  return Math.min(100, s);
}

export async function runIngestion(opts: RunOptions = {}): Promise<RunStatus> {
  const fetcher = opts.fetcher ?? httpFetch;
  const feeds = opts.feeds ?? FEEDS;
  const now = opts.now ?? new Date();
  const startedAt = now.toISOString();
  const today = todayISO(now);
  const stored = await readStored();
  const robots = new Map<string, string | null>();
  const feedRuns: FeedRun[] = [];
  const raw: RawItem[] = [];
  const alerts: Alert[] = [];
  let priceChecks: PriceCheck[] = [];

  for (const feed of feeds) {
    const run: FeedRun = { sourceKey: feed.key, url: feed.url, fetchedAt: new Date().toISOString(), ok: false, items: 0, robots: "unknown" };
    feedRuns.push(run);
    try {
      run.robots = await checkRobots(feed.url, fetcher, robots);
      if (run.robots === "disallowed") {
        run.error = "Disallowed by robots.txt — not fetched";
        continue;
      }
      const res = await fetcher(feed.url);
      run.httpStatus = res.status;
      if (!res.ok || !res.body) {
        run.error = res.error ?? "Empty response";
        continue;
      }
      run.ok = true;
      run.bytes = res.body.length;
      run.contentHash = await contentHash(res.body);
      const previous = stored.hashes[feed.key];
      run.changed = previous != null && previous !== run.contentHash;
      stored.hashes[feed.key] = run.contentHash;

      if (feed.format === "html-page") {
        if (run.changed) {
          alerts.push({ id: `chg-${feed.key}-${run.contentHash.slice(0, 8)}`, at: startedAt, kind: "page-changed", title: `${feed.name} changed`, detail: "The page's text differs from the last successful check. An editor should review it before the knowledge base is updated.", url: feed.url });
        }
        if (feed.watch === "prices") {
          priceChecks = checkPrices(text(res.body), "agent-platform", today);
          for (const c of priceChecks.filter((x) => x.status === "changed")) {
            alerts.push({ id: `price-${c.entityId}-${c.meter}-${c.found}`, at: startedAt, kind: "price-change", title: `${c.name}: ${c.meter} price on the page is $${c.found}, knowledge base has $${c.expected}`, detail: "Detected automatically from the official pricing page. Unreviewed: the page may be showing an introductory, regional or scheduled price.", url: feed.url });
          }
        }
        continue;
      }
      let items = parseFeed(res.body, feed.key);
      if (feed.aiFilter) items = items.filter((i) => AI_SIGNAL.test(`${i.title} ${i.summary}`));
      run.items = items.length;
      raw.push(...items);
    } catch (e) {
      run.ok = false;
      run.error = e instanceof Error ? e.message : String(e);
    }
  }

  // Cluster, classify, resolve and merge with what is already known.
  const known = new Map(stored.items.map((d) => [d.id, d]));
  let newItems = 0;
  for (const c of cluster(raw)) {
    const id = itemId(c.lead.url);
    if (known.has(id)) continue;
    const feed = FEED_BY_KEY[c.lead.feedKey] ?? feeds.find((f) => f.key === c.lead.feedKey);
    if (!feed) continue;
    const body = `${c.lead.title}. ${c.lead.summary}`;
    const areas = classifyAreas(body);
    const item: DetectedItem = {
      id,
      title: c.lead.title,
      url: c.lead.url,
      published: c.lead.published,
      firstSeenAt: startedAt,
      feedKeys: [...new Set(c.members.map((m) => m.feedKey))],
      publisher: feed.publisher,
      providerId: feed.providerId,
      excerpt: c.lead.summary,
      types: classifyTypes(body),
      areas,
      layers: layersFor(areas, feed.layers),
      entityIds: resolveEntities(body),
      alsoAt: c.members.slice(1).map((m) => m.url),
      knownAs: matchCanonical(c.lead.title, c.lead.url),
      score: 0,
      review: { itemId: id, state: "detected" },
    };
    item.score = triageScore(item, feed);
    if (item.knownAs) item.review = { itemId: id, state: "published", reason: "Matches a development already in the curated knowledge base." };
    else if (item.score >= 60) item.review = { itemId: id, state: "needs-review", reason: "High triage score: pricing, lifecycle or model change." };
    known.set(id, item);
    newItems++;
  }

  // Deadlines inside 30 days become alerts once.
  for (const d of deadlines(today).filter((x) => x.days <= 30)) {
    alerts.push({ id: `deadline-${d.event.id}`, at: startedAt, kind: "deadline", title: `${d.name}: ${d.event.type.replace(/-/g, " ")} takes effect ${d.on}`, detail: d.event.detail });
  }

  const fetched = feedRuns.filter((f) => f.ok).length;
  const failed = feedRuns.length - fetched;
  if (fetched === 0) alerts.push({ id: `fail-${today}`, at: startedAt, kind: "source-failing", title: "No source could be fetched in the last run", detail: feedRuns.map((f) => `${f.sourceKey}: ${f.error ?? "failed"}`).slice(0, 6).join("; ") });

  const seenAlerts = new Set(stored.alerts.map((a) => a.id));
  const freshAlerts = alerts.filter((a) => !seenAlerts.has(a.id));
  const status: RunStatus = {
    startedAt,
    finishedAt: new Date().toISOString(),
    ok: fetched > 0,
    feeds: feedRuns,
    fetched,
    failed,
    newItems,
    priceChecks,
    alerts: freshAlerts.length,
  };

  if (!opts.dryRun) {
    const items = [...known.values()].sort((a, b) => (b.published ?? b.firstSeenAt).localeCompare(a.published ?? a.firstSeenAt));
    await writeStored({
      lastRun: status,
      // Freshness is only advanced by a run that actually read something.
      lastSuccessAt: status.ok ? status.finishedAt : stored.lastSuccessAt,
      items,
      alerts: [...freshAlerts, ...stored.alerts],
      hashes: stored.hashes,
    });
  }
  return status;
}
