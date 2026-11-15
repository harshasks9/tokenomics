/**
 * Pricing view model — pure helpers that shape price records for the pricing
 * page: table rows, option lists, upcoming-change groups, calculator inputs,
 * cost mix and the step series behind the price-history chart.
 *
 * Nothing here decides a price. Every number comes from `lookup`, `estimate`,
 * `history` or `upcomingChanges` in ./pricing; this file only arranges them.
 */
import { addDays, daysBetween, inEffect } from "../dates";
import { ENTITIES, ENTITY_BY_ID, PRICES, PRICES_BY_ENTITY, entityName, providerName } from "../kb";
import type { Claim, Entity, EvidenceLabel, PriceMeter, PriceRecord, PriceSurface, PriceUnit, ServiceTier, WorkloadScenario } from "../types";
import { pricesAt, scheduledAt } from "./asof";
import { history, lookup, surfacesFor, type CostLine, type PricePoint } from "./pricing";

// ───────────────────────── labels ─────────────────────────

/** Surfaces that sell models by the token, in display order. */
export const TOKEN_SURFACES: PriceSurface[] = ["gemini-api", "agent-platform", "first-party-api", "third-party-host"];

/** Filter labels (plural where the surface groups several sellers). */
export const SURFACE_FILTER_LABEL: Record<PriceSurface, string> = {
  "gemini-api": "Gemini Developer API",
  "agent-platform": "Google Cloud Agent Platform",
  "first-party-api": "Providers’ own APIs",
  "third-party-host": "Third-party hosts",
  subscription: "Subscriptions",
  infrastructure: "Infrastructure",
};

/** Row label: names the seller where the surface alone would not. */
export function surfaceName(surface: PriceSurface, providerId?: string): string {
  if (surface === "first-party-api" && providerId) return `${providerName(providerId)} API`;
  if (surface === "third-party-host") return "Third-party host";
  if (surface === "subscription") return "Subscription";
  if (surface === "infrastructure") return "Infrastructure";
  return SURFACE_FILTER_LABEL[surface];
}

export const TIER_ORDER: ServiceTier[] = ["standard", "batch", "priority", "flex", "provisioned"];
export const TIER_LABEL: Record<ServiceTier, string> = { standard: "Standard", batch: "Batch", priority: "Priority", flex: "Flex", provisioned: "Provisioned" };

export const METER_LABEL: Record<PriceMeter, string> = {
  input: "Input tokens",
  output: "Output tokens",
  "cache-read": "Cache read",
  "cache-write": "Cache write",
  "cache-storage-hour": "Cache storage",
  "audio-input": "Audio input",
  "audio-output": "Audio output",
  "image-output": "Image output",
  "video-output-second": "Video output",
  "per-image": "Per image",
  "seat-month": "Seat",
  "grounding-1k": "Grounding",
  "compute-hour": "Compute",
  other: "Other",
};

export const UNIT_LABEL: Record<PriceUnit, string> = {
  "usd-per-1m-tokens": "per 1M tokens",
  "usd-per-image": "per image",
  "usd-per-second": "per second",
  "usd-per-user-month": "per user per month",
  "usd-per-1k-requests": "per 1K requests",
  "usd-per-hour": "per hour",
  "usd-other": "",
};

export function isTokenRecord(p: PriceRecord): boolean {
  return p.unit === "usd-per-1m-tokens" && TOKEN_SURFACES.includes(p.surface);
}
export function isPlanRecord(p: PriceRecord): boolean {
  return p.meter === "seat-month" || p.surface === "subscription";
}
export function isInfraRecord(p: PriceRecord): boolean {
  return p.surface === "infrastructure";
}

function uniq<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
function byName(a: string, b: string): number {
  return entityName(a).localeCompare(entityName(b));
}

// ───────────────────────── hero facts ─────────────────────────

export interface PriceFacts {
  total: number;
  inEffect: number;
  scheduled: number;
  /** Most recent date any price record was checked against its source. */
  lastChecked?: string;
  entities: number;
}

export function priceFacts(today: string, rows: PriceRecord[] = PRICES): PriceFacts {
  let lastChecked: string | undefined;
  for (const p of rows) if (p.lastCheckedAt && (!lastChecked || p.lastCheckedAt > lastChecked)) lastChecked = p.lastCheckedAt;
  return {
    total: rows.length,
    inEffect: pricesAt(today, rows).length,
    scheduled: scheduledAt(today, rows).length,
    lastChecked,
    entities: uniq(rows.map((p) => p.entityId)).length,
  };
}

// ───────────────────────── upcoming changes ─────────────────────────

export interface UpcomingChange {
  next: PriceRecord;
  current?: PriceRecord;
}
export interface UpcomingGroup {
  entityId: string;
  /** Earliest effective date in the group. */
  first: string;
  items: (UpcomingChange & { days: number })[];
}

/** Group scheduled changes by entity, soonest group first. */
export function groupUpcoming(changes: UpcomingChange[], today: string): UpcomingGroup[] {
  const groups: Record<string, UpcomingGroup> = {};
  for (const c of changes) {
    const g = (groups[c.next.entityId] ??= { entityId: c.next.entityId, first: c.next.effectiveFrom, items: [] });
    if (c.next.effectiveFrom < g.first) g.first = c.next.effectiveFrom;
    g.items.push({ ...c, days: daysBetween(today, c.next.effectiveFrom) });
  }
  const meterRank = (m: PriceMeter) => (m === "input" ? 0 : m === "output" ? 1 : m === "cache-read" ? 2 : 3);
  return Object.values(groups)
    .map((g) => ({
      ...g,
      items: g.items.sort(
        (a, b) =>
          a.next.effectiveFrom.localeCompare(b.next.effectiveFrom) ||
          a.next.surface.localeCompare(b.next.surface) ||
          TIER_ORDER.indexOf(a.next.tier) - TIER_ORDER.indexOf(b.next.tier) ||
          meterRank(a.next.meter) - meterRank(b.next.meter) ||
          (a.next.aboveContextTokens ?? 0) - (b.next.aboveContextTokens ?? 0),
      ),
    }))
    .sort((a, b) => a.first.localeCompare(b.first) || byName(a.entityId, b.entityId));
}

/** Percentage change from the current to the next price, when both exist and the current price is not zero. */
export function changePct(c: UpcomingChange): number | undefined {
  if (!c.current || !(c.current.price > 0)) return undefined;
  return (c.next.price - c.current.price) / c.current.price;
}

// ───────────────────────── token price table ─────────────────────────

export interface TableOptions {
  surfaces: PriceSurface[];
  tiers: ServiceTier[];
  /** True when at least one record is priced apart for a regional endpoint. */
  regional: boolean;
  providers: string[];
}

/** Filter options that actually have token-price data in effect on a date. */
export function tableOptions(date: string, rows: PriceRecord[] = PRICES): TableOptions {
  const live = pricesAt(date, rows).filter((p) => isTokenRecord(p) && (p.meter === "input" || p.meter === "output"));
  return {
    surfaces: TOKEN_SURFACES.filter((s) => live.some((p) => p.surface === s)),
    tiers: TIER_ORDER.filter((t) => live.some((p) => p.tier === t)),
    regional: live.some((p) => p.region === "regional"),
    providers: uniq(live.map((p) => p.providerId)).sort((a, b) => (a === "google" ? -1 : b === "google" ? 1 : providerName(a).localeCompare(providerName(b)))),
  };
}

export interface LongContext {
  threshold: number;
  input?: PriceRecord;
  output?: PriceRecord;
}
export interface BatchDiscount {
  /** Fraction off the standard rate (0.5 = half price). */
  input?: number;
  output?: number;
  records: PriceRecord[];
}
export interface PriceRow {
  key: string;
  entityId: string;
  name: string;
  providerId: string;
  surface: PriceSurface;
  input?: PriceRecord;
  output?: PriceRecord;
  cacheRead?: PriceRecord;
  long: LongContext[];
  batch?: BatchDiscount;
  /** Date the input/output pair shown has applied since (the later of the two). */
  since?: string;
  /** Every record the row draws on. */
  records: PriceRecord[];
  labels: EvidenceLabel[];
  sourceIds: string[];
  /** Oldest verification date among the row's records. */
  lastChecked?: string;
}

export interface RowQuery {
  date: string;
  surface: PriceSurface | "all";
  tier: ServiceTier;
  region: "global" | "regional";
  /** Empty = every provider. */
  providers: string[];
}

function tokenRowsOf(entityId: string, rows?: PriceRecord[]): PriceRecord[] {
  return (rows ? rows.filter((p) => p.entityId === entityId) : PRICES_BY_ENTITY[entityId] ?? []).filter(isTokenRecord);
}

/** One row per entity and surface that has an input or output price in effect for the chosen tier. */
export function buildPriceRows(q: RowQuery, rows?: PriceRecord[]): PriceRow[] {
  const all = rows ?? PRICES;
  const live = pricesAt(q.date, all).filter(
    (p) => isTokenRecord(p) && (p.meter === "input" || p.meter === "output") && p.tier === q.tier && (q.surface === "all" || p.surface === q.surface) && (!q.providers.length || q.providers.includes(p.providerId)),
  );
  const pairs = uniq(live.map((p) => `${p.entityId}|${p.surface}`));
  const out: PriceRow[] = [];
  for (const pair of pairs) {
    const [entityId, s] = pair.split("|");
    const surface = s as PriceSurface;
    const mine = tokenRowsOf(entityId, rows);
    const base = { entityId, date: q.date, surface, tier: q.tier, region: q.region };
    const input = lookup(base, "input", mine);
    const output = lookup(base, "output", mine);
    if (!input && !output) continue;
    const cacheRead = lookup(base, "cache-read", mine);

    const thresholds = uniq(
      mine
        .filter((p) => p.surface === surface && p.tier === q.tier && p.aboveContextTokens != null && (p.meter === "input" || p.meter === "output") && inEffect(q.date, p.effectiveFrom, p.effectiveTo))
        .map((p) => p.aboveContextTokens as number),
    ).sort((a, b) => a - b);
    const long: LongContext[] = [];
    for (const threshold of thresholds) {
      const at = { ...base, promptTokens: threshold + 1 };
      const li = lookup(at, "input", mine);
      const lo = lookup(at, "output", mine);
      const entry: LongContext = { threshold, input: li?.aboveContextTokens === threshold ? li : undefined, output: lo?.aboveContextTokens === threshold ? lo : undefined };
      if (entry.input || entry.output) long.push(entry);
    }

    const batch = batchDiscount(entityId, q.date, surface, q.region, mine);
    const records = uniq([input, output, cacheRead, ...long.flatMap((l) => [l.input, l.output])].filter((r): r is PriceRecord => !!r));
    const since = [input?.effectiveFrom, output?.effectiveFrom].filter((d): d is string => !!d).sort().pop();
    const lastChecked = records.map((r) => r.lastCheckedAt).filter(Boolean).sort()[0];
    out.push({
      key: pair,
      entityId,
      name: entityName(entityId),
      providerId: (input ?? output)!.providerId,
      surface,
      input,
      output,
      cacheRead,
      long,
      batch,
      since,
      records,
      labels: uniq(records.map((r) => r.label)),
      sourceIds: uniq(records.flatMap((r) => r.sourceIds)),
      lastChecked,
    });
  }
  return out;
}

/** Batch discount against the standard rate, only when both are published for the same endpoint on the date. */
export function batchDiscount(entityId: string, date: string, surface: PriceSurface, region: "global" | "regional", rows: PriceRecord[]): BatchDiscount | undefined {
  const std = { entityId, date, surface, tier: "standard" as ServiceTier, region };
  const bat = { ...std, tier: "batch" as ServiceTier };
  const out: BatchDiscount = { records: [] };
  for (const meter of ["input", "output"] as const) {
    const s = lookup(std, meter, rows);
    const b = lookup(bat, meter, rows);
    if (!s || !b || !(s.price > 0)) continue;
    if ((s.region ?? "global") !== (b.region ?? "global")) continue;
    out[meter] = 1 - b.price / s.price;
    out.records.push(s, b);
  }
  return out.input == null && out.output == null ? undefined : out;
}

export type SortKey = "name" | "provider" | "input" | "output" | "cache" | "since";

export function sortPriceRows(rows: PriceRow[], key: SortKey, dir: "asc" | "desc"): PriceRow[] {
  const num = (r: PriceRow): number | undefined => (key === "input" ? r.input?.price : key === "output" ? r.output?.price : key === "cache" ? r.cacheRead?.price : undefined);
  const sign = dir === "asc" ? 1 : -1;
  const tie = (a: PriceRow, b: PriceRow) => a.name.localeCompare(b.name) || TOKEN_SURFACES.indexOf(a.surface) - TOKEN_SURFACES.indexOf(b.surface);
  return rows.slice().sort((a, b) => {
    if (key === "name") return sign * tie(a, b);
    if (key === "provider") return sign * providerName(a.providerId).localeCompare(providerName(b.providerId)) || tie(a, b);
    if (key === "since") {
      // Rows with no date sort last in either direction.
      if (!a.since || !b.since) return a.since ? -1 : b.since ? 1 : tie(a, b);
      return sign * a.since.localeCompare(b.since) || tie(a, b);
    }
    const x = num(a);
    const y = num(b);
    // Rows with no published price sort last in either direction — a blank is not a zero.
    if (x == null || y == null) return x != null ? -1 : y != null ? 1 : tie(a, b);
    return sign * (x - y) || tie(a, b);
  });
}

/** Records on token surfaces, in effect on the date, that the main table has no column for. */
export function otherMeterRecords(date: string, rows: PriceRecord[] = PRICES): PriceRecord[] {
  return pricesAt(date, rows)
    .filter((p) => TOKEN_SURFACES.includes(p.surface) && !isPlanRecord(p) && !(isTokenRecord(p) && (p.meter === "input" || p.meter === "output" || p.meter === "cache-read")))
    .sort(recordOrder);
}

export function recordOrder(a: PriceRecord, b: PriceRecord): number {
  return (
    byName(a.entityId, b.entityId) ||
    a.surface.localeCompare(b.surface) ||
    TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) ||
    a.meter.localeCompare(b.meter) ||
    (a.aboveContextTokens ?? 0) - (b.aboveContextTokens ?? 0) ||
    a.effectiveFrom.localeCompare(b.effectiveFrom)
  );
}

export interface EntityRecords {
  entityId: string;
  name: string;
  records: PriceRecord[];
}

/** Records in effect on a date that pass a test, grouped by entity (Google first, then by name). */
export function recordsByEntity(date: string, test: (p: PriceRecord) => boolean, rows: PriceRecord[] = PRICES): EntityRecords[] {
  const groups: Record<string, PriceRecord[]> = {};
  for (const p of pricesAt(date, rows)) if (test(p)) (groups[p.entityId] ??= []).push(p);
  return Object.entries(groups)
    .map(([entityId, records]) => ({ entityId, name: entityName(entityId), records: records.sort(recordOrder) }))
    .sort((a, b) => {
      const ga = a.records[0].providerId === "google" ? 0 : 1;
      const gb = b.records[0].providerId === "google" ? 0 : 1;
      return ga - gb || a.name.localeCompare(b.name);
    });
}

// ───────────────────────── infrastructure economics ─────────────────────────

const ECONOMICS = /\b(cost|costs|costly|price|prices|priced|pricing|per[- ]dollar|performance[- ]per|price[- ]performance|capex|capital expenditures?|capital spending|tco|total cost of ownership)\b|\$\s?\d/i;

export interface EconomicsClaims {
  entity: Entity;
  claims: Claim[];
}

/** Dossier claims of infrastructure-layer entities that talk about cost, price, performance per dollar or capex. */
export function infrastructureEconomics(entities: Entity[] = ENTITIES): EconomicsClaims[] {
  const out: EconomicsClaims[] = [];
  for (const entity of entities) {
    if (entity.layer !== "infrastructure") continue;
    const claims = Object.values(entity.dossier ?? {})
      .flatMap((c) => c ?? [])
      .filter((c) => ECONOMICS.test(c.text));
    if (claims.length) out.push({ entity, claims });
  }
  return out.sort((a, b) => a.entity.name.localeCompare(b.entity.name));
}

// ───────────────────────── calculator ─────────────────────────

/** Token surfaces a model is priced on, on a date, in display order. */
export function tokenSurfacesFor(entityId: string, date: string): PriceSurface[] {
  const have = surfacesFor(entityId, date);
  return TOKEN_SURFACES.filter((s) => have.includes(s));
}

export interface PricedEntity {
  id: string;
  name: string;
  providerId: string;
  surfaces: PriceSurface[];
}

/** Everything with a per-token input price in effect on a date. Google first, newest first. */
export function pricedEntities(date: string, rows: PriceRecord[] = PRICES): PricedEntity[] {
  const ids = uniq(pricesAt(date, rows).filter((p) => isTokenRecord(p) && p.meter === "input").map((p) => p.entityId));
  return ids
    .map((id) => ({ id, name: entityName(id), providerId: ENTITY_BY_ID[id]?.providerId ?? rows.find((p) => p.entityId === id)?.providerId ?? "", surfaces: tokenSurfacesFor(id, date) }))
    .filter((e) => e.surfaces.length > 0)
    .sort((a, b) => {
      const ga = a.providerId === "google" ? 0 : 1;
      const gb = b.providerId === "google" ? 0 : 1;
      if (ga !== gb) return ga - gb;
      if (a.providerId !== b.providerId) return providerName(a.providerId).localeCompare(providerName(b.providerId));
      return (ENTITY_BY_ID[b.id]?.introducedAt ?? "").localeCompare(ENTITY_BY_ID[a.id]?.introducedAt ?? "") || a.name.localeCompare(b.name);
    });
}

/** The calculator's raw form values (strings, as typed). */
export interface WorkloadForm {
  requestsPerMonth: string;
  inputTokens: string;
  outputTokens: string;
  /** Percent, 0–100. */
  cachedPct: string;
  /** Percent, 0–100. */
  batchPct: string;
  thinkingRatio: string;
  attemptsPerTask: string;
}

function num(s: string, min: number, max: number, fallback: number): number {
  const n = Number(String(s).replace(/[,\s_]/g, ""));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

const trim = (n: number) => String(Math.round(n * 1000) / 1000);

export function formFromScenario(s: WorkloadScenario): WorkloadForm {
  return {
    requestsPerMonth: trim(s.requestsPerMonth),
    inputTokens: trim(s.inputTokens),
    outputTokens: trim(s.outputTokens),
    cachedPct: trim(s.cachedShare * 100),
    batchPct: trim(s.batchShare * 100),
    thinkingRatio: trim(s.thinkingRatio),
    attemptsPerTask: trim(s.attemptsPerTask),
  };
}

/** Parse the form into the engine's scenario shape. Unreadable values become 0 (or 1 call per task). */
export function scenarioFromForm(f: WorkloadForm, id = "custom", name = "Custom workload"): WorkloadScenario {
  return {
    id,
    name,
    description: "",
    requestsPerMonth: num(f.requestsPerMonth, 0, 1e12, 0),
    inputTokens: num(f.inputTokens, 0, 1e9, 0),
    outputTokens: num(f.outputTokens, 0, 1e9, 0),
    cachedShare: num(f.cachedPct, 0, 100, 0) / 100,
    batchShare: num(f.batchPct, 0, 100, 0) / 100,
    thinkingRatio: num(f.thinkingRatio, 0, 1000, 0),
    attemptsPerTask: num(f.attemptsPerTask, 1, 100000, 1),
  };
}

export type LineKind = "input" | "cached" | "output" | "reasoning";
export const LINE_KINDS: LineKind[] = ["input", "cached", "output", "reasoning"];
export const LINE_KIND_LABEL: Record<LineKind, string> = { input: "Input", cached: "Cached input", output: "Output", reasoning: "Reasoning" };

/** Which of the four cost families an engine cost line belongs to. */
export function lineKind(line: CostLine): LineKind {
  const l = line.label.toLowerCase();
  if (l.startsWith("cached")) return "cached";
  if (l.startsWith("reasoning")) return "reasoning";
  if (l.startsWith("output")) return "output";
  return "input";
}

export interface MixPart {
  kind: LineKind;
  label: string;
  cost: number;
  /** Share of the total, 0–1. */
  share: number;
  /** Start of the part along the bar, 0–1. */
  start: number;
}

/** The four cost families of an estimate, in fixed order, with their share of the total. Empty families are dropped. */
export function costMix(lines: CostLine[]): MixPart[] {
  const total = lines.reduce((t, l) => t + l.cost, 0);
  if (!(total > 0)) return [];
  let start = 0;
  const out: MixPart[] = [];
  for (const kind of LINE_KINDS) {
    const cost = lines.filter((l) => lineKind(l) === kind).reduce((t, l) => t + l.cost, 0);
    if (!(cost > 0)) continue;
    const share = cost / total;
    out.push({ kind, label: LINE_KIND_LABEL[kind], cost, share, start });
    start += share;
  }
  return out;
}

// ───────────────────────── price history ─────────────────────────

export type HistoryMeter = "input" | "output";

/** Step series of one model on one surface. */
export interface HistoryOnSurface {
  surface: PriceSurface;
  points: PricePoint[];
}

/** The surface with the longest dated record for a model and meter (ties go to display order). */
export function bestHistory(entityId: string, meter: HistoryMeter, today: string): HistoryOnSurface | undefined {
  let best: HistoryOnSurface | undefined;
  for (const surface of TOKEN_SURFACES) {
    const points = tokenPoints(entityId, meter, today, surface);
    if (points.length && (!best || points.length > best.points.length)) best = { surface, points };
  }
  return best;
}

/** `history()` restricted to per-token records, so a differently metered record never joins a token series. */
export function tokenPoints(entityId: string, meter: HistoryMeter, today: string, surface: PriceSurface): PricePoint[] {
  const ok = new Set((PRICES_BY_ENTITY[entityId] ?? []).filter(isTokenRecord).map((p) => p.id));
  return history(entityId, meter, today, surface).filter((p) => ok.has(p.recordId));
}

export interface HistoryCandidate {
  entityId: string;
  name: string;
  providerId: string;
  inputPoints: number;
  outputPoints: number;
  surfaces: PriceSurface[];
}

/** Every model with at least one dated standard-tier token price. */
export function historyCandidates(today: string): HistoryCandidate[] {
  const out: HistoryCandidate[] = [];
  for (const entityId of Object.keys(PRICES_BY_ENTITY)) {
    const i = bestHistory(entityId, "input", today);
    const o = bestHistory(entityId, "output", today);
    if (!i && !o) continue;
    const surfaces = TOKEN_SURFACES.filter((s) => tokenPoints(entityId, "input", today, s).length || tokenPoints(entityId, "output", today, s).length);
    out.push({ entityId, name: entityName(entityId), providerId: ENTITY_BY_ID[entityId]?.providerId ?? PRICES_BY_ENTITY[entityId][0].providerId, inputPoints: i?.points.length ?? 0, outputPoints: o?.points.length ?? 0, surfaces });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** Default chart selection: Google models with two or more input-price records; failing that, the models with the most records. */
export function defaultHistoryModels(candidates: HistoryCandidate[], max = 5): string[] {
  const rank = (a: HistoryCandidate, b: HistoryCandidate) => b.inputPoints - a.inputPoints || b.outputPoints - a.outputPoints || a.name.localeCompare(b.name);
  const google = candidates.filter((c) => c.providerId === "google" && c.inputPoints >= 2).sort(rank);
  const pick = google.length ? google : candidates.slice().sort(rank);
  return pick.slice(0, max).map((c) => c.entityId);
}

export interface StepSegment {
  /** First day the price applies. */
  from: string;
  /** Day the segment is drawn to (the next change, the day after a recorded end date, today, or the chart horizon). */
  to: string;
  price: number;
  /** True when the price is published but not yet in effect. */
  scheduled: boolean;
  recordId: string;
  /** True when the next segment starts exactly where this one ends. */
  joins: boolean;
}

/**
 * Turn dated points into step-after segments.
 * A price in effect is drawn to the next change or, when none is published, to today — never into an unpublished future.
 * A scheduled price is drawn to the chart horizon. A recorded end date with no successor leaves a visible gap.
 */
export function stepSegments(points: PricePoint[], today: string, horizon: string, records: Record<string, PriceRecord>): StepSegment[] {
  const out: StepSegment[] = [];
  points.forEach((p, i) => {
    const next = points[i + 1]?.date;
    const end = records[p.recordId]?.effectiveTo;
    const endNext = end ? addDays(end, 1) : undefined;
    let to = p.scheduled ? horizon : today;
    if (next && endNext) to = next < endNext ? next : endNext;
    else if (next) to = next;
    else if (endNext) to = endNext;
    if (to > horizon) to = horizon;
    if (to < p.date) to = p.date;
    out.push({ from: p.date, to, price: p.price, scheduled: p.scheduled, recordId: p.recordId, joins: !!next && to === next });
  });
  return out;
}

/** The segment covering a date, if any. */
export function segmentOn(segments: StepSegment[], date: string): StepSegment | undefined {
  let hit: StepSegment | undefined;
  for (const s of segments) if (s.from <= date && (date < s.to || (date === s.to && !s.joins))) hit = s;
  return hit;
}

/** Round axis ticks for a linear scale starting at zero. */
export function linearTicks(max: number, count = 4): number[] {
  if (!(max > 0)) return [0, 1];
  const raw = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const out: number[] = [];
  for (let v = 0; v < max + step * 0.999; v += step) out.push(Number(v.toPrecision(12)));
  return out;
}

/** 1–2–5 ticks covering [min, max] on a log scale. */
export function logTicks(min: number, max: number): number[] {
  if (!(min > 0) || !(max > 0)) return [];
  const out: number[] = [];
  const lo = Math.floor(Math.log10(min));
  const hi = Math.ceil(Math.log10(max));
  for (let e = lo; e <= hi; e++) for (const m of [1, 2, 5]) out.push(Number((m * Math.pow(10, e)).toPrecision(12)));
  let a = 0;
  while (a + 1 < out.length && out[a + 1] <= min) a++;
  let b = out.length - 1;
  while (b - 1 >= 0 && out[b - 1] >= max) b--;
  const ticks = out.slice(a, b + 1);
  // Keep the axis readable: past seven ticks, keep whole decades only.
  return ticks.length > 7 ? ticks.filter((t) => Number.isInteger(Math.log10(t) + 1e-9) || Math.abs(Math.log10(t) - Math.round(Math.log10(t))) < 1e-9) : ticks;
}

/** Month-start tick dates across a range, thinned to roughly `target` ticks. */
export function dateTicks(from: string, to: string, target = 6): { date: string; precision: "month" | "year" }[] {
  const span = daysBetween(from, to);
  const months = Math.max(1, Math.round(span / 30.44));
  const steps = [1, 2, 3, 6, 12, 24, 60];
  const step = steps.find((s) => months / s <= target) ?? 120;
  const out: { date: string; precision: "month" | "year" }[] = [];
  let y = Number(from.slice(0, 4));
  let m = Number(from.slice(5, 7));
  // Align to the step so yearly ticks land on January.
  m = Math.floor((m - 1) / Math.min(step, 12)) * Math.min(step, 12) + 1;
  if (step >= 12) y = Math.floor(y / (step / 12)) * (step / 12);
  for (let guard = 0; guard < 400; guard++) {
    const date = `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-01`;
    if (date > to) break;
    if (date >= from) out.push({ date, precision: step >= 12 ? "year" : "month" });
    m += step;
    while (m > 12) {
      m -= 12;
      y += 1;
    }
  }
  return out;
}

/** Spread label positions so neighbours sit at least `gap` apart, staying inside [min, max] where possible. */
export function spreadLabels(ys: number[], gap: number, min: number, max: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  const pos = order.map((o) => o.y);
  for (let k = 1; k < pos.length; k++) if (pos[k] - pos[k - 1] < gap) pos[k] = pos[k - 1] + gap;
  const over = pos.length ? pos[pos.length - 1] - max : 0;
  if (over > 0) {
    pos[pos.length - 1] -= over;
    for (let k = pos.length - 2; k >= 0; k--) if (pos[k + 1] - pos[k] < gap) pos[k] = pos[k + 1] - gap;
  }
  if (pos.length && pos[0] < min) {
    const shift = min - pos[0];
    for (let k = 0; k < pos.length; k++) pos[k] += shift;
  }
  const out: number[] = new Array(ys.length);
  order.forEach((o, k) => (out[o.i] = pos[k]));
  return out;
}

// ───────────────────────── saved calculator runs ─────────────────────────

export interface SavedResult {
  entityId: string;
  name: string;
  surface?: PriceSurface;
  ok: boolean;
  monthly: number;
  perRequest: number;
  perTask: number;
  notes: string[];
}
export interface SavedRun {
  id: string;
  label: string;
  /** Date the run was saved (the site's "today" at the time). */
  savedOn: string;
  /** Price date the run was costed on. */
  priceDate: string;
  form: WorkloadForm;
  results: SavedResult[];
}

/** Validate whatever came back from storage. Anything malformed is dropped rather than rendered. */
export function parseSavedRuns(raw: unknown): SavedRun[] {
  if (!Array.isArray(raw)) return [];
  const str = (v: unknown): v is string => typeof v === "string";
  const fin = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
  const out: SavedRun[] = [];
  for (const r of raw as Record<string, unknown>[]) {
    if (!r || typeof r !== "object" || !str(r.id) || !str(r.label) || !str(r.savedOn) || !str(r.priceDate)) continue;
    const f = r.form as Record<string, unknown> | undefined;
    if (!f || typeof f !== "object") continue;
    const keys: (keyof WorkloadForm)[] = ["requestsPerMonth", "inputTokens", "outputTokens", "cachedPct", "batchPct", "thinkingRatio", "attemptsPerTask"];
    if (!keys.every((k) => str(f[k]))) continue;
    if (!Array.isArray(r.results)) continue;
    const results: SavedResult[] = [];
    for (const x of r.results as Record<string, unknown>[]) {
      if (!x || typeof x !== "object" || !str(x.entityId) || !str(x.name) || typeof x.ok !== "boolean" || !fin(x.monthly) || !fin(x.perRequest) || !fin(x.perTask)) continue;
      results.push({
        entityId: x.entityId,
        name: x.name,
        surface: str(x.surface) ? (x.surface as PriceSurface) : undefined,
        ok: x.ok,
        monthly: x.monthly,
        perRequest: x.perRequest,
        perTask: x.perTask,
        notes: Array.isArray(x.notes) ? (x.notes as unknown[]).filter(str) : [],
      });
    }
    out.push({ id: r.id, label: r.label, savedOn: r.savedOn, priceDate: r.priceDate, form: keys.reduce((acc, k) => ({ ...acc, [k]: f[k] as string }), {} as WorkloadForm), results });
  }
  return out;
}
