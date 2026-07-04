// Ingestion: fetch curated RSS/Atom feeds, parse to raw articles, dedupe.
// Dependency-free XML handling (regex) so no new packages are needed; feed
// failures are swallowed per-feed so one bad source can't break the run.

import { FEEDS, type FeedSource } from "./sources";

export interface RawArticle {
  title: string;
  link: string;
  source: string;
  tier: number;
  published?: string; // ISO if parseable
  summary?: string;
}

function decodeEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block: string, tag: string): string | undefined {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1] : undefined;
}

function pickLink(block: string): string | undefined {
  // RSS <link>...</link>
  const rss = block.match(/<link>([\s\S]*?)<\/link>/i);
  if (rss && rss[1].trim().startsWith("http")) return rss[1].trim();
  // Atom <link href="..."/>
  const atom = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>(?:<\/link>)?/i);
  if (atom) return atom[1];
  return rss ? decodeEntities(rss[1]) : undefined;
}

function toIso(raw?: string): string | undefined {
  if (!raw) return undefined;
  const t = Date.parse(raw.trim());
  return Number.isFinite(t) ? new Date(t).toISOString() : undefined;
}

function parseFeed(xml: string, source: FeedSource): RawArticle[] {
  const out: RawArticle[] = [];
  const blocks =
    xml.match(/<item[\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
  for (const block of blocks) {
    const titleRaw = pick(block, "title");
    if (!titleRaw) continue;
    const title = decodeEntities(titleRaw);
    if (!title) continue;
    const link = pickLink(block) ?? "";
    const published =
      toIso(pick(block, "pubDate")) ??
      toIso(pick(block, "updated")) ??
      toIso(pick(block, "published")) ??
      toIso(pick(block, "dc:date"));
    const summaryRaw = pick(block, "description") ?? pick(block, "summary") ?? pick(block, "content");
    const summary = summaryRaw ? decodeEntities(summaryRaw).slice(0, 400) : undefined;
    out.push({ title, link, source: source.name, tier: source.tier, published, summary });
  }
  return out;
}

async function fetchFeed(source: FeedSource, timeoutMs: number): Promise<RawArticle[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(source.url, {
      headers: { "user-agent": "MeridianNewsBot/1.0 (+https://news.aitokenomics.app)", accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeed(xml, source);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function normalizeTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
}

export interface IngestResult {
  articles: RawArticle[];
  feedsOk: number;
  feedsTotal: number;
}

export async function ingestArticles(opts?: {
  maxPerFeed?: number;
  maxTotal?: number;
  windowHours?: number;
  timeoutMs?: number;
}): Promise<IngestResult> {
  const maxPerFeed = opts?.maxPerFeed ?? 10;
  const maxTotal = opts?.maxTotal ?? 60;
  const windowHours = opts?.windowHours ?? 72;
  const timeoutMs = opts?.timeoutMs ?? 8000;

  const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f, timeoutMs)));
  const cutoff = Date.now() - windowHours * 3600 * 1000;

  let feedsOk = 0;
  const collected: RawArticle[] = [];
  results.forEach((r) => {
    if (r.status === "fulfilled" && r.value.length > 0) {
      feedsOk += 1;
      collected.push(...r.value.slice(0, maxPerFeed));
    }
  });

  // Keep recent items (or items with no date), newest first.
  const recent = collected.filter((a) => {
    if (!a.published) return true;
    return Date.parse(a.published) >= cutoff;
  });
  recent.sort((a, b) => (Date.parse(b.published ?? "") || 0) - (Date.parse(a.published ?? "") || 0));

  // Dedupe by normalized title.
  const seen = new Set<string>();
  const deduped: RawArticle[] = [];
  for (const a of recent) {
    const key = normalizeTitle(a.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(a);
    if (deduped.length >= maxTotal) break;
  }

  return { articles: deduped, feedsOk, feedsTotal: FEEDS.length };
}
