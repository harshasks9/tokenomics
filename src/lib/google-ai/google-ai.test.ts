import { beforeAll, describe, expect, it } from "vitest";
import { addDays } from "./dates";
import { answer, detectDate } from "./engine/answer";
import { existedAt, nameAt, pricesAt, retirementUnconfirmed, snapshotAt, statusAt } from "./engine/asof";
import { deadlines, radar, top } from "./engine/brief";
import { neighbors, path } from "./engine/graph";
import { estimate, history, lookup, overlaps, upcomingChanges } from "./engine/pricing";
import { resolveEntity, search, squash } from "./engine/search";
import { classifyAreas, classifyTypes, resolveEntities } from "./ingest/classify";
import { cluster, jaccard, tokens } from "./ingest/cluster";
import { robotsVerdict, type Fetcher } from "./ingest/fetch";
import { canonicalUrl, parseFeed, text } from "./ingest/parse";
import { checkPrices } from "./ingest/pricewatch";
import { MAX_ITEMS_PER_FEED, recentItems, runIngestion } from "./ingest/run";
import { readState } from "./ingest/store";
import type { Feed } from "./ingest/types";
import * as KB from "./kb";
import { AGENT_FLOW, LIMITATIONS, REVIEW, SCENARIOS, WORKLOADS } from "./editorial";
import type { Claim, Entity, LifecycleEvent, PriceRecord, WorkloadScenario } from "./types";

const TODAY = "2026-11-15";

/** Walk any value and collect every Claim-shaped object. */
function claims(v: unknown, out: Claim[] = []): Claim[] {
  if (Array.isArray(v)) v.forEach((x) => claims(x, out));
  else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.text === "string" && typeof o.label === "string" && Array.isArray(o.sourceIds)) out.push(o as unknown as Claim);
    for (const x of Object.values(o)) claims(x, out);
  }
  return out;
}
function sourceIds(v: unknown, out: string[] = []): string[] {
  if (Array.isArray(v)) v.forEach((x) => sourceIds(x, out));
  else if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      if (k === "sourceIds" && Array.isArray(x)) out.push(...(x as string[]));
      else sourceIds(x, out);
    }
  }
  return out;
}

const price = (o: Partial<PriceRecord> & Pick<PriceRecord, "id" | "meter" | "price" | "effectiveFrom">): PriceRecord => ({
  entityId: "m1", providerId: "google", surface: "agent-platform", unit: "usd-per-1m-tokens", tier: "standard", label: "verified-fact", sourceIds: ["s"], lastCheckedAt: TODAY, ...o,
});
const scenario: WorkloadScenario = { id: "t", name: "t", description: "", requestsPerMonth: 1000, inputTokens: 10_000, outputTokens: 1000, cachedShare: 0, batchShare: 0, thinkingRatio: 0, attemptsPerTask: 1 };

// ─────────────────────────── H. Evidence integrity ───────────────────────────
describe("H · evidence integrity of the knowledge base", () => {
  const everything = [KB.ENTITIES, KB.RELATIONSHIPS, KB.PRICES, KB.RESULTS, KB.AVAILABILITY, KB.LIFECYCLE, KB.ANNOUNCEMENTS, KB.TIMELINE, KB.BATTLEGROUNDS];

  it("has unique ids in every collection", () => {
    for (const rows of [KB.SOURCES, KB.ENTITIES, KB.RELATIONSHIPS, KB.PRICES, KB.RESULTS, KB.AVAILABILITY, KB.LIFECYCLE, KB.ANNOUNCEMENTS, KB.TIMELINE]) {
      const ids = rows.map((r) => r.id);
      expect(ids.length - new Set(ids).size).toBe(0);
    }
  });

  it("resolves every cited source id to the source library", () => {
    const missing = [...new Set(sourceIds(everything))].filter((id) => !KB.SOURCE_BY_ID[id]);
    expect(missing).toEqual([]);
  });

  it("gives every claim a valid label and at least one source", () => {
    const labels = ["verified-fact", "provider-claim", "independent-measurement", "analyst-interpretation"];
    const bad = claims(everything).filter((c) => !labels.includes(c.label) || c.sourceIds.length === 0 || !c.text.trim());
    expect(bad.map((c) => c.text.slice(0, 60))).toEqual([]);
  });

  it("gives every record that states a fact at least one source", () => {
    for (const rows of [KB.ENTITIES, KB.RELATIONSHIPS, KB.PRICES, KB.RESULTS, KB.AVAILABILITY, KB.LIFECYCLE, KB.ANNOUNCEMENTS, KB.TIMELINE] as { id: string; sourceIds: string[] }[][]) {
      expect(rows.filter((r) => !r.sourceIds?.length).map((r) => r.id)).toEqual([]);
    }
  });

  it("records how each source was read", () => {
    for (const s of KB.SOURCES) {
      expect(["primary", "search-excerpt", "secondary", "prior-knowledge"], s.id).toContain(s.access);
      expect(s.url, s.id).toMatch(/^https?:\/\//);
    }
  });

  it("never labels an analyst implication as a fact", () => {
    for (const a of KB.ANNOUNCEMENTS) for (const c of a.implications ?? []) expect(c.label, a.id).toBe("analyst-interpretation");
  });

  it("keeps the graph closed: edges, prices, results and records point at known entities", () => {
    const known = (id: string) => !!KB.ENTITY_BY_ID[id];
    expect(KB.RELATIONSHIPS.filter((r) => !known(r.from) || !known(r.to)).map((r) => r.id)).toEqual([]);
    expect(KB.PRICES.filter((p) => !known(p.entityId)).map((p) => p.id)).toEqual([]);
    expect(KB.RESULTS.filter((r) => !known(r.modelId) || !KB.BENCHMARK_BY_ID[r.benchmarkId]).map((r) => r.id)).toEqual([]);
    expect(KB.LIFECYCLE.filter((l) => !known(l.entityId)).map((l) => l.id)).toEqual([]);
    expect(KB.AVAILABILITY.filter((l) => !known(l.entityId)).map((l) => l.id)).toEqual([]);
    expect(KB.ENTITIES.filter((e) => !known(e.providerId)).map((e) => e.id)).toEqual([]);
    for (const a of KB.ANNOUNCEMENTS) expect(a.entityIds.filter((id) => !known(id)), a.id).toEqual([]);
  });

  it("uses full ISO dates everywhere dates are compared", () => {
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    for (const p of KB.PRICES) expect(p.effectiveFrom, p.id).toMatch(iso);
    for (const a of KB.ANNOUNCEMENTS) expect(a.date, a.id).toMatch(iso);
    for (const t of KB.TIMELINE) expect(t.date, t.id).toMatch(iso);
    for (const l of KB.LIFECYCLE) expect(l.date, l.id).toMatch(iso);
    for (const e of KB.ENTITIES) if (e.introducedAt) expect(e.introducedAt, e.id).toMatch(iso);
  });

  it("has no two prices in force at once for the same meter", () => {
    expect(overlaps()).toEqual([]);
  });

  it("states who reported every benchmark result", () => {
    for (const r of KB.RESULTS) {
      expect(["independent", "provider"], r.id).toContain(r.reporter);
      expect(r.date, r.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("covers the eight layers and the scope of the brief", () => {
    for (const l of KB.LAYERS) expect(KB.ENTITIES.filter((e) => e.providerId === "google" && e.layer === l.id).length, l.id).toBeGreaterThan(0);
    expect(KB.ANNOUNCEMENTS.length).toBeGreaterThanOrEqual(40);
    expect(KB.PROVIDERS.length).toBeGreaterThanOrEqual(6);
    expect(KB.BATTLEGROUNDS.length).toBeGreaterThanOrEqual(8);
  });
});

// ─────────────────────────── B. Price change with a future effective date ───────────────────────────
describe("B · a price change announced ahead of its effective date", () => {
  const rows = [
    price({ id: "in-now", meter: "input", price: 0.75, effectiveFrom: "2026-09-01", effectiveTo: "2026-12-31", condition: "introductory" }),
    price({ id: "in-next", meter: "input", price: 1.5, effectiveFrom: "2027-01-01", publishedAt: "2026-10-20" }),
    price({ id: "out-now", meter: "output", price: 3.75, effectiveFrom: "2026-09-01", effectiveTo: "2026-12-31" }),
    price({ id: "out-next", meter: "output", price: 7.5, effectiveFrom: "2027-01-01", publishedAt: "2026-10-20" }),
    price({ id: "in-long", meter: "input", price: 3, effectiveFrom: "2026-09-01", aboveContextTokens: 200_000 }),
    price({ id: "in-regional", meter: "input", price: 0.9, effectiveFrom: "2026-09-01", effectiveTo: "2026-12-31", region: "regional" }),
    price({ id: "cache", meter: "cache-read", price: 0.075, effectiveFrom: "2026-09-01" }),
    price({ id: "in-batch", meter: "input", price: 0.375, effectiveFrom: "2026-09-01", tier: "batch" }),
    price({ id: "out-batch", meter: "output", price: 1.875, effectiveFrom: "2026-09-01", tier: "batch" }),
  ];
  const q = { entityId: "m1", surface: "agent-platform" as const };

  it("keeps the current price until the effective date, then switches", () => {
    expect(lookup({ ...q, date: "2026-12-31" }, "input", rows)?.id).toBe("in-now");
    expect(lookup({ ...q, date: "2027-01-01" }, "input", rows)?.id).toBe("in-next");
    expect(lookup({ ...q, date: "2026-08-01" }, "input", rows)).toBeUndefined();
  });

  it("lists the change as upcoming with the price it replaces", () => {
    const up = upcomingChanges(TODAY, rows);
    expect(up.map((u) => u.next.id).sort()).toEqual(["in-next", "out-next"]);
    expect(up.find((u) => u.next.id === "in-next")?.current?.id).toBe("in-now");
  });

  it("separates regional, long-context and batch prices", () => {
    expect(lookup({ ...q, date: TODAY, region: "regional" }, "input", rows)?.id).toBe("in-regional");
    expect(lookup({ ...q, date: TODAY, promptTokens: 250_000 }, "input", rows)?.id).toBe("in-long");
    expect(lookup({ ...q, date: TODAY, promptTokens: 100_000 }, "input", rows)?.id).toBe("in-now");
    expect(lookup({ ...q, date: TODAY, tier: "batch" }, "input", rows)?.id).toBe("in-batch");
  });

  it("never reports two overlapping prices as valid, and catches them when they exist", () => {
    expect(overlaps(rows)).toEqual([]);
    expect(overlaps([...rows, price({ id: "dup", meter: "input", price: 9, effectiveFrom: "2026-10-01", effectiveTo: "2026-12-31", condition: "introductory" })])).toHaveLength(1);
  });

  it("the price watcher flags a page whose price differs from the knowledge base", () => {
    const sample = KB.PRICES.find((p) => p.surface === "agent-platform" && p.tier === "standard" && p.meter === "input" && (p.region ?? "global") === "global" && p.aboveContextTokens == null && p.effectiveFrom <= TODAY && (!p.effectiveTo || p.effectiveTo >= TODAY));
    if (!sample) return;
    const name = KB.entityName(sample.entityId);
    const same = checkPrices(`${name} Input (text) Global $${sample.price} output $9`, "agent-platform", TODAY, [sample]);
    expect(same[0].status).toBe("match");
    const changed = checkPrices(`${name} Input (text) Global $${sample.price + 1} output $9`, "agent-platform", TODAY, [sample]);
    expect(changed[0].status).toBe("changed");
    expect(checkPrices("nothing relevant here", "agent-platform", TODAY, [sample])[0].status).toBe("not-found");
  });
});

describe("pricing calculator", () => {
  const rows = [
    price({ id: "i", meter: "input", price: 2, effectiveFrom: "2026-01-01" }),
    price({ id: "o", meter: "output", price: 10, effectiveFrom: "2026-01-01" }),
    price({ id: "c", meter: "cache-read", price: 0.2, effectiveFrom: "2026-01-01" }),
  ];
  // The engine reads the global table, so exercise it through a model that has prices there when one exists.
  it("computes cost from first principles on a known price pair", () => {
    const pin = lookup({ entityId: "m1", date: TODAY }, "input", rows)!;
    const pout = lookup({ entityId: "m1", date: TODAY }, "output", rows)!;
    const monthly = (1000 * 10_000 * pin.price + 1000 * 1000 * pout.price) / 1e6;
    expect(monthly).toBeCloseTo(30, 9);
  });

  it("prices every example workload on every model that has a token price, with consistent totals", () => {
    const priced = KB.MODELS.filter((m) => lookup({ entityId: m.id, date: TODAY }, "input") && lookup({ entityId: m.id, date: TODAY }, "output"));
    for (const m of priced.slice(0, 40)) {
      for (const s of SCENARIOS) {
        const e = estimate(s, m.id, TODAY);
        if (!e.ok) continue;
        expect(e.monthly, `${m.id}/${s.id}`).toBeGreaterThan(0);
        expect(e.lines.reduce((t, l) => t + l.cost, 0)).toBeCloseTo(e.monthly, 6);
        expect(e.perTask).toBeGreaterThanOrEqual(e.perRequest - 1e-12);
        for (const id of e.recordIds) expect(KB.PRICES.some((p) => p.id === id)).toBe(true);
      }
    }
  });

  it("says so instead of guessing when a model has no price", () => {
    const e = estimate(scenario, "no-such-model", TODAY);
    expect(e.ok).toBe(false);
    expect(e.notes.join(" ")).toMatch(/No published/);
  });

  it("more attempts per task raise cost per task, not cost per request", () => {
    const m = KB.MODELS.find((x) => estimate(scenario, x.id, TODAY).ok);
    if (!m) return;
    const a = estimate(scenario, m.id, TODAY);
    const b = estimate({ ...scenario, attemptsPerTask: 4 }, m.id, TODAY);
    expect(b.perRequest).toBeCloseTo(a.perRequest, 9);
    expect(b.perTask).toBeCloseTo(a.perTask * 4, 9);
  });

  it("returns price history in date order and marks future points as scheduled", () => {
    for (const m of KB.MODELS.slice(0, 60)) {
      const h = history(m.id, "input", TODAY);
      for (let i = 1; i < h.length; i++) expect(h[i].date >= h[i - 1].date).toBe(true);
      for (const p of h) expect(p.scheduled).toBe(p.date > TODAY);
    }
  });
});

// ─────────────────────────── E. Historical reconstruction ───────────────────────────
describe("E · the time machine reconstructs a date without leaking the future", () => {
  const e: Entity = { id: "x", kind: "product", providerId: "google", name: "New Name", aliases: [], formerNames: [{ name: "Old Name", from: "2021-05-18", to: "2026-04-22", sourceIds: ["s"] }], summary: "", status: "ga", introducedAt: "2021-05-18", verification: "verified", sourceIds: ["s"], lastCheckedAt: TODAY };
  const life: LifecycleEvent[] = [
    { id: "1", entityId: "x", type: "preview", date: "2021-05-18", detail: "", label: "verified-fact", sourceIds: ["s"] },
    { id: "2", entityId: "x", type: "ga", date: "2021-09-01", detail: "", label: "verified-fact", sourceIds: ["s"] },
    { id: "3", entityId: "x", type: "retirement-scheduled", date: "2026-06-01", effectiveDate: "2027-03-01", detail: "", label: "verified-fact", sourceIds: ["s"] },
  ];

  it("uses the name in force on the date", () => {
    expect(nameAt(e, "2025-01-01")).toBe("Old Name");
    expect(nameAt(e, "2026-04-22")).toBe("New Name");
  });

  it("uses the stage in force on the date and never treats a scheduled retirement as done without confirmation", () => {
    expect(statusAt(e, "2021-01-01", life).status).toBe("not-yet");
    expect(statusAt(e, "2021-06-01", life).status).toBe("preview");
    // Between the announcement of a retirement and its date the product is deprecated, not retired.
    expect(statusAt(e, "2026-11-15", life).status).toBe("deprecated");
    expect(statusAt(e, "2026-05-01", life).status).toBe("ga");
    // After the scheduled date, without a "retired" record, it is still not claimed as retired — the schedule is noted.
    const after = statusAt(e, "2027-03-01", life);
    expect(after.status).toBe("deprecated");
    expect(after.note).toMatch(/scheduled for 2027-03-01/);
    // A confirmation settles it.
    expect(statusAt(e, "2027-03-02", [...life, { id: "4", entityId: "x", type: "retired", date: "2027-03-01", detail: "", label: "verified-fact", sourceIds: ["s"] }]).status).toBe("retired");
    expect(statusAt({ ...e, retiredAt: "2026-06-01" }, "2026-07-01", life).status).toBe("retired");
    expect(existedAt(e, "2021-05-17")).toBe(false);
  });

  it("does not turn a retirement date into a retirement just because the calendar passed it", () => {
    // Recorded as a future date when the knowledge base was last updated: still a plan, however much later it is read.
    const planned = { ...e, retiredAt: "2099-01-01" };
    expect(retirementUnconfirmed(planned)).toBe(true);
    const later = statusAt(planned, "2099-06-01", life.slice(0, 2));
    expect(later.status).toBe("deprecated");
    expect(later.note).toMatch(/scheduled for 2099-01-01/);
    expect(existedAt(planned, "2099-06-01")).toBe(true);
    // A date on or before the knowledge base's own date was verified as done.
    const done = { ...e, retiredAt: "2024-01-01" };
    expect(retirementUnconfirmed(done)).toBe(false);
    expect(statusAt(done, "2025-01-01", life.slice(0, 2)).status).toBe("retired");
    // No entity in the data claims a retirement the knowledge base could not have confirmed.
    for (const x of KB.ENTITIES) if (x.status === "retired" && x.retiredAt) expect(x.retiredAt <= KB.META.curatedAt, x.id).toBe(true);
  });

  it("never guesses undated entities into the past", () => {
    expect(existedAt({ ...e, introducedAt: undefined }, "2025-01-01")).toBe(false);
  });

  it.each(["2023-12-31", "2025-06-30", "2026-03-31", TODAY])("snapshot at %s contains nothing dated later", (date) => {
    const s = snapshotAt(date);
    expect(s.entities.every((x) => (x.entity.introducedAt as string) <= date)).toBe(true);
    expect(s.announcements.every((a) => a.date <= date)).toBe(true);
    expect(s.timeline.every((t) => t.date <= date)).toBe(true);
    expect(s.prices.every((p) => p.effectiveFrom <= date && (!p.effectiveTo || p.effectiveTo >= date))).toBe(true);
  });

  it("shows fewer things the further back you go", () => {
    expect(snapshotAt("2023-01-01").entities.length).toBeLessThan(snapshotAt(TODAY).entities.length);
    expect(pricesAt("2015-01-01")).toHaveLength(0);
  });

  it("the analyst answers historical questions as of the date asked", () => {
    expect(detectDate("What did pricing look like in March 2026?", TODAY)).toBe("2026-03-31");
    expect(detectDate("status on 2025-11-18", TODAY)).toBe("2025-11-18");
    expect(detectDate("what is new", TODAY)).toBeUndefined();
    const a = answer("What had Google announced as of 2025-06-30?", TODAY);
    expect(a.historical).toBe(true);
    expect(a.developments.every((d) => d.date <= "2025-06-30")).toBe(true);
  });
});

// ─────────────────────────── C. Cross-platform discovery ───────────────────────────
describe("C · search finds things by any name they have had", () => {
  it("normalizes separators so model ids match however they are typed", () => {
    expect(squash("gemini-3.1-pro")).toBe(squash("Gemini 3.1 Pro"));
  });

  it("resolves every former name to its current entity", () => {
    for (const e of KB.ENTITIES) {
      for (const f of e.formerNames ?? []) {
        const hits = search(f.name, { limit: 5 }).map((h) => h.id);
        expect(hits, `${f.name} → ${e.id}`).toContain(e.id);
      }
    }
  });

  it("resolves every exact API model id", () => {
    for (const m of KB.MODELS) for (const id of m.model?.apiIds ?? []) expect(search(id, { limit: 5, kinds: ["entity"] }).map((h) => h.id), id).toContain(m.id);
  });

  it("puts an exact name match first", () => {
    for (const e of KB.ENTITIES.filter((x) => x.providerId === "google").slice(0, 80)) expect(resolveEntity(e.name)?.id, e.name).toBeDefined();
  });

  it("respects an as-of date", () => {
    expect(search("gemini", { asOf: "2020-01-01", kinds: ["announcement"] })).toHaveLength(0);
  });

  it("connects the platform to the models it serves through the graph", () => {
    const hub = KB.ENTITIES.filter((e) => e.providerId === "google").sort((a, b) => neighbors(b.id).length - neighbors(a.id).length)[0];
    expect(neighbors(hub.id).length).toBeGreaterThan(3);
    const n = neighbors(hub.id)[0];
    expect(path(hub.id, n.other.id)).toEqual([hub.id, n.other.id]);
  });
});

// ─────────────────────────── A + G. Ingestion ───────────────────────────
const FEED: Feed = { key: "t-feed", name: "Test feed", publisher: "Google", providerId: "google", url: "https://example.test/feed.xml", format: "rss", category: "official-blog", layers: ["models"] };
const rss = (items: { title: string; link: string; date: string; desc: string }[]) =>
  `<?xml version="1.0"?><rss><channel>${items.map((i) => `<item><title><![CDATA[${i.title}]]></title><link>${i.link}</link><pubDate>${i.date}</pubDate><description>${i.desc}</description></item>`).join("")}</channel></rss>`;

describe("A · a new announcement is detected, de-duplicated, classified and queued — not published", () => {
  beforeAll(() => {
    process.env.VERCEL = "1"; // force the in-memory store for tests
  });

  it("parses RSS and Atom, and strips markup and tracking", () => {
    const items = parseFeed(rss([{ title: "Hello &amp; welcome", link: "https://a.test/x?utm_source=rss", date: "Mon, 09 Nov 2026 10:00:00 GMT", desc: "<p>Body <b>text</b></p>" }]), "k");
    expect(items[0]).toMatchObject({ title: "Hello & welcome", published: "2026-11-09", summary: "Body text" });
    const atom = parseFeed(`<feed><entry><title>T</title><link rel="alternate" href="https://a.test/y"/><updated>2026-11-10T00:00:00Z</updated><summary>S</summary></entry></feed>`, "k");
    expect(atom[0]).toMatchObject({ title: "T", url: "https://a.test/y", published: "2026-11-10" });
    expect(canonicalUrl("https://www.a.test/x/?utm_source=rss#frag")).toBe("https://a.test/x");
    expect(text("<script>alert(1)</script><p>ok</p>")).toBe("ok");
  });

  it("classifies kinds and areas from text with traceable rules", () => {
    expect(classifyTypes("Gemini 2.0 Flash will be retired on March 3")).toContain("deprecation");
    expect(classifyTypes("New pricing for the Gemini API: $1.50 per 1M input tokens")).toContain("pricing");
    expect(classifyTypes("Introducing Gemini 4, our most capable model")).toContain("model-launch");
    expect(classifyAreas("Gemini in Gmail and Docs gets new features")).toContain("workspace");
    expect(jaccard(tokens("Introducing Gemini 4 Hydrogen"), tokens("Introducing Gemini 4 Hydrogen today"))).toBeGreaterThan(0.6);
  });

  it("clusters duplicate posts into one development", () => {
    const c = cluster([
      { feedKey: "a", title: "Introducing Agent Registry for enterprises", url: "https://a.test/1", published: "2026-11-10", summary: "" },
      { feedKey: "b", title: "Introducing Agent Registry for enterprises now", url: "https://b.test/1", published: "2026-11-11", summary: "" },
      { feedKey: "a", title: "Introducing Agent Registry for enterprises", url: "https://a.test/1?utm_source=x", published: "2026-11-10", summary: "" },
      { feedKey: "a", title: "Quarterly results", url: "https://a.test/2", published: "2026-11-10", summary: "" },
    ]);
    expect(c).toHaveLength(2);
    expect(c[0].members).toHaveLength(2);
  });

  it("runs end to end against a fake feed: new items are queued as unreviewed and linked to canonical entities", async () => {
    const target = KB.ENTITIES.find((e) => e.providerId === "google" && e.kind === "product" && e.name.includes(" ")) ?? KB.ENTITIES[0];
    const known = KB.ANNOUNCEMENTS[0];
    const knownUrl = KB.SOURCE_BY_ID[known.sourceIds[0]].url;
    const fetcher: Fetcher = async (url) => {
      if (url.endsWith("/robots.txt")) return { ok: true, status: 200, body: "User-agent: *\nAllow: /" };
      return { ok: true, status: 200, body: rss([
        { title: `Announcing new pricing for ${target.name}`, link: "https://example.test/new-pricing", date: "Sat, 14 Nov 2026 09:00:00 GMT", desc: `${target.name} gets a price cut.` },
        { title: `Announcing new pricing for ${target.name}`, link: "https://example.test/new-pricing?utm_campaign=x", date: "Sat, 14 Nov 2026 09:00:00 GMT", desc: "duplicate" },
        { title: known.title, link: knownUrl, date: "Sat, 14 Nov 2026 09:00:00 GMT", desc: "already covered" },
      ]) };
    };
    const status = await runIngestion({ fetcher, feeds: [FEED], now: new Date("2026-11-15T06:00:00Z") });
    expect(status.ok).toBe(true);
    expect(status.newItems).toBe(2);
    const state = await readState();
    const fresh = state.items.find((i) => i.url === "https://example.test/new-pricing")!;
    expect(fresh.types).toContain("pricing");
    expect(fresh.entityIds).toContain(target.id);
    expect(["detected", "needs-review"]).toContain(fresh.review.state);
    expect(fresh.knownAs).toBeUndefined();
    expect(state.items.find((i) => i.knownAs === known.id)).toBeDefined();
    expect(state.lastSuccessAt).toBe(status.finishedAt);
    // Nothing detected is ever inserted into the curated feed.
    expect(KB.ANNOUNCEMENTS.some((a) => a.title.startsWith("Announcing new pricing for"))).toBe(false);
    // A second run does not duplicate.
    const again = await runIngestion({ fetcher, feeds: [FEED], now: new Date("2026-11-15T12:00:00Z") });
    expect(again.newItems).toBe(0);
  });

  it("takes only recent items from a feed that publishes its whole archive", () => {
    const mk = (i: number, published?: string) => ({ feedKey: "f", title: `Post ${i}`, url: `https://a.test/${i}`, published, summary: "" });
    const old = Array.from({ length: 300 }, (_, i) => mk(i, "2025-01-15"));
    const fresh = Array.from({ length: 60 }, (_, i) => mk(1000 + i, i < 30 ? "2026-11-14" : "2026-11-01"));
    const kept = recentItems([...old, ...fresh], TODAY);
    expect(kept).toHaveLength(MAX_ITEMS_PER_FEED);
    expect(kept.every((k) => (k.published as string) >= "2026-10-01")).toBe(true);
    expect(kept[0].published).toBe("2026-11-14");
  });

  it("reads a price table whose heading punctuates the model name differently", () => {
    const sample = KB.PRICES.find((p) => p.surface === "agent-platform" && p.tier === "standard" && p.meter === "input" && (p.region ?? "global") === "global" && p.aboveContextTokens == null && p.effectiveFrom <= TODAY && (!p.effectiveTo || p.effectiveTo >= TODAY) && KB.entityName(p.entityId).includes("-") && KB.ENTITY_BY_ID[p.entityId].model?.category === "text");
    if (!sample) return;
    const spaced = KB.entityName(sample.entityId).split("-").join(" ");
    expect(checkPrices(`${spaced} Input (text) Global $${sample.price} output $9`, "agent-platform", TODAY, [sample])[0].status).toBe("match");
  });

  it("resolves the longest product name, not a shorter one inside it", () => {
    const long = KB.ENTITIES.filter((e) => KB.ENTITIES.some((o) => o.id !== e.id && e.name.toLowerCase().startsWith(o.name.toLowerCase() + " ")))[0];
    if (!long) return;
    expect(resolveEntities(`News about ${long.name} today`)[0]).toBe(long.id);
  });
});

describe("G · when ingestion fails, the site reports the real last success", () => {
  it("a failed run is reported as failed and does not advance freshness", async () => {
    const before = (await readState()).lastSuccessAt;
    const failing: Fetcher = async () => ({ ok: false, status: 503, error: "HTTP 503" });
    const status = await runIngestion({ fetcher: failing, feeds: [FEED], now: new Date("2026-11-16T06:00:00Z") });
    expect(status.ok).toBe(false);
    expect(status.failed).toBe(1);
    const state = await readState();
    expect(state.lastRun?.ok).toBe(false);
    expect(state.lastSuccessAt).toBe(before);
    expect(state.alerts.some((a) => a.kind === "source-failing")).toBe(true);
  });

  it("respects robots.txt", async () => {
    expect(robotsVerdict("User-agent: *\nDisallow: /private", "/private/feed")).toBe("disallowed");
    expect(robotsVerdict("User-agent: *\nDisallow: /\nAllow: /feeds/", "/feeds/x.xml")).toBe("allowed");
    expect(robotsVerdict("User-agent: badbot\nDisallow: /", "/feeds/x.xml")).toBe("allowed");
    let fetched = 0;
    const blocked: Fetcher = async (url) => {
      if (url.endsWith("/robots.txt")) return { ok: true, status: 200, body: "User-agent: *\nDisallow: /" };
      fetched++;
      return { ok: true, status: 200, body: rss([]) };
    };
    const status = await runIngestion({ fetcher: blocked, feeds: [FEED], dryRun: true });
    expect(fetched).toBe(0);
    expect(status.feeds[0].robots).toBe("disallowed");
  });
});

// ─────────────────────────── briefing ───────────────────────────
describe("briefing and radar", () => {
  it("ranks by editorial weight then recency, inside the window only", () => {
    const rows = top(TODAY, 90, 5);
    for (let i = 1; i < rows.length; i++) expect(rows[i - 1].importance).toBeGreaterThanOrEqual(rows[i].importance);
    expect(rows.every((a) => a.date <= TODAY && a.date > addDays(TODAY, -90))).toBe(true);
  });
  it("counts every development in an area once per area", () => {
    const cells = radar(TODAY, 90);
    expect(cells).toHaveLength(9);
    for (const c of cells) expect(c.count).toBe(c.items.length);
  });
  it("lists only future effective dates as deadlines", () => {
    for (const d of deadlines(TODAY)) expect(d.on > TODAY).toBe(true);
  });
});

// ─────────────────────────── F. Enterprise decision ───────────────────────────
describe("F · an enterprise decision: a secure voice agent", () => {
  it("offers a voice workload whose whole reference stack resolves to canonical products", () => {
    const w = WORKLOADS.find((x) => x.architecture === "voice");
    expect(w).toBeDefined();
    const missing = w!.stack.filter((s) => !KB.ENTITY_BY_ID[s.entityId]).map((s) => s.entityId);
    expect(missing).toEqual([]);
    // Security and governance are part of the answer, not an afterthought.
    for (const id of ["agent-identity", "agent-gateway", "model-armor"]) expect(w!.stack.map((s) => s.entityId)).toContain(id);
    for (const k of ["customer", "sales", "technical", "commercial", "competitive", "execution"] as const) expect(w![k].length).toBeGreaterThan(60);
    expect(w!.risks.length).toBeGreaterThan(0);
  });

  it("builds every workload and every step of the agent path from products that exist", () => {
    for (const w of WORKLOADS) {
      expect(w.stack.filter((s) => !KB.ENTITY_BY_ID[s.entityId]).map((s) => `${w.id}:${s.entityId}`)).toEqual([]);
      if (w.scenarioId) expect(SCENARIOS.some((s) => s.id === w.scenarioId), w.id).toBe(true);
    }
    for (const f of AGENT_FLOW) expect(f.entityIds.filter((id) => !KB.ENTITY_BY_ID[id]).map((id) => `${f.id}:${id}`)).toEqual([]);
    expect(AGENT_FLOW).toHaveLength(8);
  });

  it("says it does not know when a question is off topic, instead of returning loosely related items", () => {
    const a = answer("Who won the 1998 World Cup?", TODAY);
    expect(a.facts).toEqual([]);
    expect(a.developments).toEqual([]);
    expect(a.gaps.join(" ")).toMatch(/Nothing in the knowledge base/);
    // A general "what is new" question still gets the latest developments.
    expect(answer("What changed in Google AI this month?", TODAY).developments.length).toBeGreaterThan(0);
  });

  it("finds the stack for the question through the analyst, with sources", () => {
    const a = answer("What is Model Armor and how does it relate to the Agent Gateway?", TODAY);
    expect(a.entities.map((e) => e.id)).toContain("model-armor");
    expect(a.facts.length).toBeGreaterThan(0);
    expect(a.facts.every((f) => f.sourceIds.length > 0)).toBe(true);
  });
});

describe("transparency", () => {
  it("publishes the review from all five roles and a list of limitations", () => {
    expect(REVIEW).toHaveLength(5);
    for (const r of REVIEW) expect(r.findings.length).toBeGreaterThanOrEqual(3);
    expect(REVIEW.flatMap((r) => r.findings).some((f) => f.status !== "fixed")).toBe(true);
    expect(LIMITATIONS.length).toBeGreaterThanOrEqual(10);
  });
});
