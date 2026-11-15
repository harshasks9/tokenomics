/**
 * Comparison helpers — pure functions shared by the Models catalog and the Compare view.
 *
 * Rules these helpers enforce so the views cannot get them wrong:
 *  - Benchmark results are only put side by side when benchmarkId AND benchmarkVersion match.
 *  - Independent and provider-reported results are never merged into one set.
 *  - Nothing is filled in: a model without a price, a date or a result is returned as
 *    "excluded" with the reason, never given a default.
 */
import { yearFrac } from "../dates";
import { SCENARIOS } from "../editorial";
import { BATTLEGROUNDS, BENCHMARK_BY_ID, ENTITIES, ENTITY_BY_ID, MODELS, PRICES, RELATIONSHIPS, RESULTS } from "../kb";
import type { BenchmarkDef, BenchmarkResult, Entity, EntityStatus, ModelSpec, PriceRecord, PriceSurface, Relationship } from "../types";
import { statusAt } from "./asof";
import { blended, estimate, headline, type CostEstimate } from "./pricing";

/** Google's provider id. Battlegrounds carry Google's position in a dedicated field, so the id is structural. */
export const GOOGLE_ID = "google";

export type Scenario = (typeof SCENARIOS)[number];

// ───────────────────────── catalog ─────────────────────────

export type StageBucket = "ga" | "preview" | "retired";
export const STAGE_BUCKETS: { id: StageBucket; label: string }[] = [
  { id: "ga", label: "GA" },
  { id: "preview", label: "Preview / pre-release" },
  { id: "retired", label: "Deprecated / retired" },
];

export type StatusToday = EntityStatus | "not-yet";

/**
 * Stage on a date. Dated lifecycle evidence wins; when there is none, the catalogue status
 * (the stage recorded when the entity was last checked) is used.
 */
export function stageToday(e: Entity, today: string): { status: StatusToday; bucket: StageBucket; evidenced: boolean } {
  const st = statusAt(e, today);
  const status: StatusToday = st.status === "unknown" ? e.status : st.status;
  const bucket: StageBucket = status === "ga" ? "ga" : status === "retired" || status === "deprecated" ? "retired" : "preview";
  return { status, bucket, evidenced: st.evidenced && st.status !== "unknown" };
}

export interface ModelRow {
  e: Entity;
  spec?: ModelSpec;
  status: StatusToday;
  bucket: StageBucket;
  /** Headline list price in effect on the date (standard tier, base context), with the surface it is quoted on. */
  price: { input?: PriceRecord; output?: PriceRecord; surface?: PriceSurface };
  /** Blended $/1M at 3 input : 1 output on the same surface. */
  blended?: number;
}

export function modelRow(e: Entity, today: string): ModelRow {
  const st = stageToday(e, today);
  const price = headline(e.id, today);
  return { e, spec: e.model, status: st.status, bucket: st.bucket, price, blended: blended(e.id, today, price.surface) };
}

export function modelRows(today: string): ModelRow[] {
  return MODELS.map((e) => modelRow(e, today));
}

/** Case-insensitive match on name, former names, aliases and exact API ids. */
export function matchesText(e: Entity, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const hay = [e.name, e.id, ...e.aliases, ...(e.formerNames ?? []).map((f) => f.name), ...(e.model?.apiIds ?? [])];
  return hay.some((h) => h.toLowerCase().includes(needle));
}

/** Source ids behind a headline price, de-duplicated. */
export function priceSourceIds(p: ModelRow["price"]): string[] {
  return [...new Set([...(p.input?.sourceIds ?? []), ...(p.output?.sourceIds ?? [])])];
}

export const PRICE_BY_ID: Record<string, PriceRecord> = Object.fromEntries(PRICES.map((p) => [p.id, p]));

/**
 * Starting selection for head-to-head: the newest flagship text model of each provider that has
 * a list price today or a benchmark result, Google first, then providers with the most tracked
 * models. Padded with the newest remaining models only when fewer than two qualify.
 */
export function defaultPicks(today: string, max = 4): string[] {
  const rows = modelRows(today).filter((r) => r.bucket !== "retired");
  const withResult = new Set(RESULTS.map((r) => r.modelId));
  const hasData = (r: ModelRow) => !!r.price.input || withResult.has(r.e.id);
  const newest = (a: ModelRow, b: ModelRow) => (b.e.introducedAt ?? "").localeCompare(a.e.introducedAt ?? "");
  const count: Record<string, number> = {};
  for (const r of rows) count[r.e.providerId] = (count[r.e.providerId] ?? 0) + 1;
  const providers = Object.keys(count).sort((a, b) => (a === GOOGLE_ID ? -1 : b === GOOGLE_ID ? 1 : count[b] - count[a] || a.localeCompare(b)));
  const picks: string[] = [];
  for (const p of providers) {
    const best = rows.filter((r) => r.e.providerId === p && r.spec?.category === "text" && r.spec.tier === "flagship" && hasData(r)).sort(newest)[0];
    if (best && picks.length < max) picks.push(best.e.id);
  }
  if (picks.length < 2) {
    const pool = [...rows.filter(hasData).sort(newest), ...rows.slice().sort(newest)];
    for (const r of pool) {
      if (picks.length >= 2) break;
      if (!picks.includes(r.e.id)) picks.push(r.e.id);
    }
  }
  return picks;
}

// ───────────────────────── benchmarks ─────────────────────────

export const setKey = (benchmarkId: string, version?: string) => `${benchmarkId}@@${version ?? ""}`;

export function benchLabel(benchmarkId: string, version?: string): string {
  return `${BENCHMARK_BY_ID[benchmarkId]?.name ?? benchmarkId}${version ? ` ${version}` : ""}`;
}

/** A benchmark that measures throughput rather than quality. */
export function isSpeedBenchmark(def: BenchmarkDef | undefined, id: string): boolean {
  return /token/i.test(def?.unit ?? "") || /speed|tps/i.test(id);
}

/** One result per model: the most recent. */
export function latestPerModel(rows: BenchmarkResult[]): BenchmarkResult[] {
  const by: Record<string, BenchmarkResult> = {};
  for (const r of rows) {
    const cur = by[r.modelId];
    if (!cur || r.date > cur.date) by[r.modelId] = r;
  }
  return Object.values(by);
}

/** Best first when the direction is known; otherwise highest first. */
export function byScore(def: BenchmarkDef | undefined) {
  const dir = def && !def.higherBetter ? 1 : -1;
  return (a: BenchmarkResult, b: BenchmarkResult) => dir * (a.score - b.score);
}

export interface IndependentSet {
  key: string;
  benchmarkId: string;
  version?: string;
  def?: BenchmarkDef;
  speed: boolean;
  /** Latest independent result per model, on this benchmark and version only. */
  points: BenchmarkResult[];
  /** Provider-reported results on the same benchmark and version — excluded from the set. */
  providerReported: number;
  /** Results (any reporter) on other versions of the same benchmark — excluded from the set. */
  otherVersions: { version?: string; count: number }[];
}

/** Every benchmark + version that has at least one independent result, largest first. */
export function independentSets(results: BenchmarkResult[] = RESULTS): IndependentSet[] {
  const groups: Record<string, BenchmarkResult[]> = {};
  for (const r of results) (groups[setKey(r.benchmarkId, r.benchmarkVersion)] ??= []).push(r);
  const out: IndependentSet[] = [];
  for (const [key, rows] of Object.entries(groups)) {
    const { benchmarkId, benchmarkVersion: version } = rows[0];
    const points = latestPerModel(rows.filter((r) => r.reporter === "independent"));
    if (!points.length) continue;
    const def = BENCHMARK_BY_ID[benchmarkId];
    const others: Record<string, number> = {};
    for (const r of results) {
      if (r.benchmarkId === benchmarkId && (r.benchmarkVersion ?? "") !== (version ?? "")) others[r.benchmarkVersion ?? ""] = (others[r.benchmarkVersion ?? ""] ?? 0) + 1;
    }
    out.push({
      key,
      benchmarkId,
      version,
      def,
      speed: isSpeedBenchmark(def, benchmarkId),
      points: points.sort(byScore(def)),
      providerReported: rows.filter((r) => r.reporter === "provider").length,
      otherVersions: Object.entries(others).map(([v, count]) => ({ version: v || undefined, count })),
    });
  }
  return out.sort((a, b) => b.points.length - a.points.length || benchLabel(a.benchmarkId, a.version).localeCompare(benchLabel(b.benchmarkId, b.version)));
}

export type BenchTopic = "coding" | "multimodal";
const TOPIC_WORDS: Record<BenchTopic, string[]> = {
  coding: ["swe", "terminal", "coding", "agent", "osworld", "webarena", "software engineering", "computer use"],
  multimodal: ["video", "image", "audio", "multimodal", "vision", "speech"],
};

/** Keyword match on the benchmark id, name and what it measures. */
export function inTopic(topic: BenchTopic, id: string, def?: BenchmarkDef): boolean {
  const hay = `${id} ${def?.name ?? ""} ${def?.measures ?? ""}`.toLowerCase();
  return TOPIC_WORDS[topic].some((w) => hay.includes(w));
}

export interface TopicGroup {
  benchmarkId: string;
  def?: BenchmarkDef;
  independent: BenchmarkResult[];
  provider: BenchmarkResult[];
  /** Distinct versions across both sub-tables ("" = version not stated). */
  versions: string[];
}

/** Benchmarks in a topic that have results, each split by who reported, sorted by version then score. */
export function topicGroups(topic: BenchTopic, results: BenchmarkResult[] = RESULTS): { groups: TopicGroup[]; definedWithoutResults: BenchmarkDef[] } {
  const ids = [...new Set(results.map((r) => r.benchmarkId))].filter((id) => inTopic(topic, id, BENCHMARK_BY_ID[id]));
  const groups = ids
    .map((benchmarkId) => {
      const def = BENCHMARK_BY_ID[benchmarkId];
      const rows = results.filter((r) => r.benchmarkId === benchmarkId);
      const order = (a: BenchmarkResult, b: BenchmarkResult) => (b.benchmarkVersion ?? "").localeCompare(a.benchmarkVersion ?? "") || byScore(def)(a, b);
      return {
        benchmarkId,
        def,
        independent: rows.filter((r) => r.reporter === "independent").sort(order),
        provider: rows.filter((r) => r.reporter === "provider").sort(order),
        versions: [...new Set(rows.map((r) => r.benchmarkVersion ?? ""))],
      };
    })
    .sort((a, b) => b.independent.length + b.provider.length - (a.independent.length + a.provider.length));
  const definedWithoutResults = Object.values(BENCHMARK_BY_ID).filter((d) => inTopic(topic, d.id, d) && !ids.includes(d.id));
  return { groups, definedWithoutResults };
}

export interface HeadToHeadBenchRow {
  benchmarkId: string;
  def?: BenchmarkDef;
  /** One cell per selected model, in selection order. */
  cells: (BenchmarkResult | undefined)[];
  /** True only when every shown result shares benchmark version AND reporter. */
  comparable: boolean;
  /** Why the row is not comparable, in words. */
  reason?: string;
  /** Indexes of the leading cells. Empty when not comparable or when the direction of the scale is not recorded. */
  leaders: number[];
}

/**
 * Benchmark rows for a head-to-head. A row needs at least two selected models with a result on
 * the same benchmark. For each model the result from the best-covered version + reporter is
 * used; a model that only has a result on another version or from another reporter is still
 * shown, and the row is then marked not comparable.
 */
export function headToHeadBenchmarks(ids: string[], results: BenchmarkResult[] = RESULTS): { rows: HeadToHeadBenchRow[]; singles: number } {
  const mine = results.filter((r) => ids.includes(r.modelId));
  const rows: HeadToHeadBenchRow[] = [];
  let singles = 0;
  for (const benchmarkId of [...new Set(mine.map((r) => r.benchmarkId))]) {
    const all = mine.filter((r) => r.benchmarkId === benchmarkId);
    const models = new Set(all.map((r) => r.modelId));
    if (models.size < 2) {
      singles++;
      continue;
    }
    const groups: Record<string, BenchmarkResult[]> = {};
    for (const r of all) (groups[`${r.benchmarkVersion ?? ""}|${r.reporter}`] ??= []).push(r);
    const rank = (g: BenchmarkResult[]) => ({ n: new Set(g.map((r) => r.modelId)).size, indep: g[0].reporter === "independent" ? 1 : 0, latest: g.reduce((m, r) => (r.date > m ? r.date : m), "") });
    const best = Object.values(groups).sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      return rb.n - ra.n || rb.indep - ra.indep || rb.latest.localeCompare(ra.latest);
    })[0];
    const cells = ids.map((id) => {
      const inBest = latestPerModel(best.filter((r) => r.modelId === id))[0];
      if (inBest) return inBest;
      const other = all.filter((r) => r.modelId === id);
      const sameVersion = other.filter((r) => (r.benchmarkVersion ?? "") === (best[0].benchmarkVersion ?? ""));
      return latestPerModel(sameVersion.length ? sameVersion : other)[0];
    });
    const shown = cells.filter((c): c is BenchmarkResult => !!c);
    const versions = new Set(shown.map((c) => c.benchmarkVersion ?? ""));
    const reporters = new Set(shown.map((c) => c.reporter));
    const comparable = versions.size === 1 && reporters.size === 1;
    const def = BENCHMARK_BY_ID[benchmarkId];
    let leaders: number[] = [];
    if (comparable && def) {
      const top = shown.slice().sort(byScore(def))[0].score;
      leaders = cells.flatMap((c, i) => (c && c.score === top ? [i] : []));
      if (leaders.length === shown.length) leaders = [];
    }
    const reason = comparable ? undefined : [versions.size > 1 ? "benchmark versions differ" : "", reporters.size > 1 ? "independent and provider-reported results are mixed" : ""].filter(Boolean).join("; ");
    rows.push({ benchmarkId, def, cells, comparable, reason, leaders });
  }
  rows.sort((a, b) => Number(b.comparable) - Number(a.comparable) || (a.def?.name ?? a.benchmarkId).localeCompare(b.def?.name ?? b.benchmarkId));
  return { rows, singles };
}

// ───────────────────────── family tree ─────────────────────────

export interface TreeNode {
  e: Entity;
  /** Fractional year of introducedAt. */
  t: number;
  status: StatusToday;
  bucket: StageBucket;
}
export interface TreeLane {
  id: string;
  name: string;
  /** Canonical entity behind the lane, when the lane is a recorded family. */
  entityId?: string;
  nodes: TreeNode[];
}
export interface TreeEdge {
  /** Newer model. */
  from: string;
  /** The model it succeeds. */
  to: string;
  rel: Relationship;
}
export interface FamilyTree {
  lanes: TreeLane[];
  /** Models with no introducedAt — never placed on the time axis. */
  undated: Entity[];
  edges: TreeEdge[];
  /** `succeeds` relationships that could not be drawn because one end is undated. */
  undrawn: TreeEdge[];
  /** Recorded families with no dated model. */
  emptyFamilies: Entity[];
  models: number;
}

const NO_FAMILY = "__none";

/**
 * Models of one provider laid out for a timeline: one lane per family (the model's parentId),
 * plus a lane for models with no recorded family. Lanes are ordered by their earliest model.
 */
export function familyTree(providerId: string, today: string): FamilyTree {
  const models = MODELS.filter((e) => e.providerId === providerId);
  const families = ENTITIES.filter((e) => e.kind === "model-family" && e.providerId === providerId);
  const lanes: Record<string, TreeLane> = {};
  const undated: Entity[] = [];
  for (const e of models) {
    if (!e.introducedAt) {
      undated.push(e);
      continue;
    }
    const laneId = e.parentId ?? NO_FAMILY;
    const lane = (lanes[laneId] ??= { id: laneId, name: laneId === NO_FAMILY ? "No family recorded" : ENTITY_BY_ID[laneId]?.name ?? laneId, entityId: ENTITY_BY_ID[laneId] ? laneId : undefined, nodes: [] });
    const st = stageToday(e, today);
    lane.nodes.push({ e, t: yearFrac(e.introducedAt), status: st.status, bucket: st.bucket });
  }
  const ordered = Object.values(lanes);
  for (const l of ordered) l.nodes.sort((a, b) => a.t - b.t);
  ordered.sort((a, b) => (a.id === NO_FAMILY ? 1 : b.id === NO_FAMILY ? -1 : a.nodes[0].t - b.nodes[0].t));
  const placed = new Set(ordered.flatMap((l) => l.nodes.map((n) => n.e.id)));
  const ids = new Set(models.map((e) => e.id));
  const all = RELATIONSHIPS.filter((r) => r.type === "succeeds" && ids.has(r.from) && ids.has(r.to)).map((rel) => ({ from: rel.from, to: rel.to, rel }));
  return {
    lanes: ordered,
    undated,
    edges: all.filter((x) => placed.has(x.from) && placed.has(x.to)),
    undrawn: all.filter((x) => !placed.has(x.from) || !placed.has(x.to)),
    emptyFamilies: families.filter((f) => !lanes[f.id]),
    models: models.length,
  };
}

// ───────────────────────── workload fit ─────────────────────────

export interface ScenarioFit {
  /** Models that accept every required input and have a published token price, cheapest monthly cost first. */
  ranked: { row: ModelRow; est: CostEstimate }[];
  /** Accept every required input but have no published token price today. */
  unpriced: ModelRow[];
  /** Recorded input modalities do not cover the scenario. */
  uncovered: ModelRow[];
  /** Deprecated or retired models, left out. */
  retired: number;
}

export function scenarioFit(s: Scenario, today: string): ScenarioFit {
  const out: ScenarioFit = { ranked: [], unpriced: [], uncovered: [], retired: 0 };
  for (const row of modelRows(today)) {
    if (row.bucket === "retired") {
      out.retired++;
      continue;
    }
    const accepts = row.spec?.modalitiesIn ?? [];
    if (!s.needs.every((n) => accepts.includes(n))) {
      out.uncovered.push(row);
      continue;
    }
    const est = estimate(s, row.e.id, today);
    if (est.ok) out.ranked.push({ row, est });
    else out.unpriced.push(row);
  }
  out.ranked.sort((a, b) => a.est.monthly - b.est.monthly);
  return out;
}

// ───────────────────────── battlegrounds ─────────────────────────

/** Rival providers that hold a recorded position in any battleground, most frequent first. */
export function battlegroundRivals(): string[] {
  const count: Record<string, number> = {};
  for (const b of BATTLEGROUNDS) for (const r of b.rivals) if (r.providerId !== GOOGLE_ID) count[r.providerId] = (count[r.providerId] ?? 0) + 1;
  return Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b));
}

// ───────────────────────── chart scales ─────────────────────────

export interface Scale {
  lo: number;
  hi: number;
  ticks: number[];
}

const clean = (n: number) => Number(n.toPrecision(12));

/** Padded linear domain with round-number ticks. Does not force zero: scores are positions, not lengths. */
export function linearScale(values: number[], target = 5): Scale {
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { lo: 0, hi: 1, ticks: [0, 1] };
  const pad = max > min ? (max - min) * 0.1 : Math.abs(max) * 0.1 || 1;
  min -= pad;
  max += pad;
  const raw = (max - min) / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  const step = (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) ticks.push(clean(v));
  return { lo: min, hi: max, ticks };
}

/** Padded log domain with 1-2-5 ticks. Values must be positive. */
export function logScale(values: number[]): Scale {
  const pos = values.filter((v) => v > 0);
  if (!pos.length) return { lo: 0.1, hi: 10, ticks: [0.1, 1, 10] };
  const lo = Math.min(...pos) / 1.6;
  const hi = Math.max(...pos) * 1.6;
  const ticks: number[] = [];
  for (let k = Math.floor(Math.log10(lo)); k <= Math.ceil(Math.log10(hi)); k++) {
    for (const m of [1, 2, 5]) {
      const v = clean(m * 10 ** k);
      if (v >= lo && v <= hi) ticks.push(v);
    }
  }
  return { lo, hi, ticks };
}
