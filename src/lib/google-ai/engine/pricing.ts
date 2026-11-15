/**
 * Pricing engine — effective-dated price lookup and a workload cost model.
 *
 * The calculator never fills a gap silently: when a meter has no published
 * price (no cache rate, no batch tier) it falls back to the standard rate and
 * says so in `notes`, so the reader can see which parts are assumptions.
 */
import { inEffect } from "../dates";
import { PRICES, PRICES_BY_ENTITY } from "../kb";
import type { PriceMeter, PriceRecord, PriceSurface, ServiceTier, WorkloadScenario } from "../types";

export interface PriceQuery {
  entityId: string;
  date: string;
  surface?: PriceSurface;
  tier?: ServiceTier;
  region?: "global" | "regional";
  /** Input tokens per request, to pick the long-context tier. */
  promptTokens?: number;
}

/** The record that applies for one meter, or undefined when none is published. */
export function lookup(q: PriceQuery, meter: PriceMeter, rows: PriceRecord[] = PRICES_BY_ENTITY[q.entityId] ?? []): PriceRecord | undefined {
  const tier = q.tier ?? "standard";
  const candidates = rows.filter(
    (p) =>
      p.entityId === q.entityId &&
      p.meter === meter &&
      p.tier === tier &&
      (!q.surface || p.surface === q.surface) &&
      inEffect(q.date, p.effectiveFrom, p.effectiveTo) &&
      (p.aboveContextTokens == null || (q.promptTokens ?? 0) > p.aboveContextTokens),
  );
  if (!candidates.length) return undefined;
  const wantRegion = q.region ?? "global";
  return candidates.sort((a, b) => {
    // Prefer the requested region, then the highest applicable context tier, then the most recent record.
    const ra = (a.region ?? "global") === wantRegion ? 0 : 1;
    const rb = (b.region ?? "global") === wantRegion ? 0 : 1;
    if (ra !== rb) return ra - rb;
    const ca = a.aboveContextTokens ?? -1;
    const cb = b.aboveContextTokens ?? -1;
    if (ca !== cb) return cb - ca;
    return b.effectiveFrom.localeCompare(a.effectiveFrom);
  })[0];
}

/** Surfaces a model has token prices on, on a date. */
export function surfacesFor(entityId: string, date: string): PriceSurface[] {
  const rows = (PRICES_BY_ENTITY[entityId] ?? []).filter((p) => p.meter === "input" && inEffect(date, p.effectiveFrom, p.effectiveTo));
  return [...new Set(rows.map((p) => p.surface))];
}

/** Headline input/output list price (standard tier, global, base context). */
export function headline(entityId: string, date: string, surface?: PriceSurface): { input?: PriceRecord; output?: PriceRecord; surface?: PriceSurface } {
  const s = surface ?? surfacesFor(entityId, date)[0];
  if (!s) return {};
  const q = { entityId, date, surface: s };
  return { input: lookup(q, "input"), output: lookup(q, "output"), surface: s };
}

/** Blended $/1M tokens at a 3:1 input:output ratio — a common shorthand, shown with that caveat. */
export function blended(entityId: string, date: string, surface?: PriceSurface): number | undefined {
  const h = headline(entityId, date, surface);
  if (!h.input || !h.output) return undefined;
  return (3 * h.input.price + h.output.price) / 4;
}

export interface CostLine {
  label: string;
  tokensM: number;
  rate: number;
  cost: number;
  recordId?: string;
}

export interface CostEstimate {
  ok: boolean;
  entityId: string;
  surface?: PriceSurface;
  date: string;
  monthly: number;
  perRequest: number;
  /** Cost per completed task once retries and tool loops are counted. */
  perTask: number;
  lines: CostLine[];
  notes: string[];
  recordIds: string[];
}

export function estimate(s: WorkloadScenario, entityId: string, date: string, opts: { surface?: PriceSurface; region?: "global" | "regional" } = {}): CostEstimate {
  const surface = opts.surface ?? surfacesFor(entityId, date)[0];
  const base: PriceQuery = { entityId, date, surface, region: opts.region, promptTokens: s.inputTokens };
  const notes: string[] = [];
  const empty: CostEstimate = { ok: false, entityId, surface, date, monthly: 0, perRequest: 0, perTask: 0, lines: [], notes, recordIds: [] };
  const pin = lookup(base, "input");
  const pout = lookup(base, "output");
  if (!surface || !pin || !pout) {
    notes.push("No published input and output token price for this model on this surface on this date.");
    return empty;
  }
  if (pin.aboveContextTokens != null) notes.push(`Long-context rate applied: prompts above ${(pin.aboveContextTokens / 1000).toFixed(0)}K tokens.`);
  if (pin.condition) notes.push(`Input price condition: ${pin.condition}.`);

  const calls = s.requestsPerMonth * Math.max(1, s.attemptsPerTask);
  const batchShare = clamp01(s.batchShare);
  const cachedShare = clamp01(s.cachedShare);
  const lines: CostLine[] = [];
  const recordIds = new Set<string>();

  const add = (label: string, tokens: number, rec: PriceRecord, factor = 1) => {
    if (tokens <= 0) return;
    lines.push({ label, tokensM: tokens / 1e6, rate: rec.price * factor, cost: (tokens / 1e6) * rec.price * factor, recordId: rec.id });
    recordIds.add(rec.id);
  };

  for (const [share, tier] of [[1 - batchShare, "standard"], [batchShare, "batch"]] as const) {
    if (share <= 0) continue;
    const q = { ...base, tier: tier as ServiceTier };
    let tin = lookup(q, "input");
    let tout = lookup(q, "output");
    const tag = tier === "batch" ? " (batch)" : "";
    if (tier === "batch" && (!tin || !tout)) {
      notes.push("No batch price published; batch share costed at the standard rate.");
      tin = pin;
      tout = pout;
    }
    if (!tin || !tout) continue;
    const n = calls * share;
    const cacheRead = lookup(q, "cache-read") ?? (tier === "batch" ? lookup(base, "cache-read") : undefined);
    const freshIn = n * s.inputTokens * (1 - cachedShare);
    const cachedIn = n * s.inputTokens * cachedShare;
    add(`Input${tag}`, freshIn, tin);
    if (cachedIn > 0) {
      if (cacheRead) add(`Cached input${tag}`, cachedIn, cacheRead);
      else {
        add(`Cached input${tag} — no cache price published, full rate`, cachedIn, tin);
        if (!notes.some((x) => x.startsWith("No cache-read"))) notes.push("No cache-read price published; cached tokens costed at the full input rate.");
      }
    }
    add(`Output${tag}`, n * s.outputTokens, tout);
    if (s.thinkingRatio > 0) add(`Reasoning tokens${tag} (billed as output)`, n * s.outputTokens * s.thinkingRatio, tout);
  }
  if (cachedShare > 0 && lookup(base, "cache-write")) notes.push("Cache writes and cache storage are metered separately and are not included.");
  if (s.thinkingRatio > 0) notes.push("Reasoning tokens are assumed to bill at the output rate; the ratio is your assumption, not a published figure.");
  if (s.attemptsPerTask > 1) notes.push(`Each completed task is assumed to take ${s.attemptsPerTask} model calls.`);

  const monthly = lines.reduce((t, l) => t + l.cost, 0);
  const perRequest = calls ? monthly / calls : 0;
  return { ok: true, entityId, surface, date, monthly, perRequest, perTask: perRequest * Math.max(1, s.attemptsPerTask), lines, notes, recordIds: [...recordIds] };
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(x) ? x : 0));
}

export interface PricePoint {
  date: string;
  price: number;
  recordId: string;
  scheduled: boolean;
}

/** Step series of one meter's list price over time (standard tier, global, base context). */
export function history(entityId: string, meter: PriceMeter, today: string, surface?: PriceSurface): PricePoint[] {
  const rows = (PRICES_BY_ENTITY[entityId] ?? [])
    .filter((p) => p.meter === meter && p.tier === "standard" && p.aboveContextTokens == null && (p.region ?? "global") === "global" && (!surface || p.surface === surface))
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
  return rows.map((p) => ({ date: p.effectiveFrom, price: p.price, recordId: p.id, scheduled: p.effectiveFrom > today }));
}

/** Price changes that are published but not yet in effect — the "future effective date" case. */
export function upcomingChanges(today: string, rows: PriceRecord[] = PRICES): { next: PriceRecord; current?: PriceRecord }[] {
  const out: { next: PriceRecord; current?: PriceRecord }[] = [];
  for (const next of rows) {
    if (next.effectiveFrom <= today) continue;
    const current = rows.find(
      (p) =>
        p.id !== next.id &&
        p.entityId === next.entityId &&
        p.surface === next.surface &&
        p.meter === next.meter &&
        p.tier === next.tier &&
        (p.region ?? "global") === (next.region ?? "global") &&
        (p.aboveContextTokens ?? null) === (next.aboveContextTokens ?? null) &&
        inEffect(today, p.effectiveFrom, p.effectiveTo),
    );
    out.push({ next, current });
  }
  return out.sort((a, b) => a.next.effectiveFrom.localeCompare(b.next.effectiveFrom));
}

/** Integrity check used by tests: two records for the same key must not overlap in time. */
export function overlaps(rows: PriceRecord[] = PRICES): [string, string][] {
  const key = (p: PriceRecord) => [p.entityId, p.surface, p.meter, p.tier, p.region ?? "global", p.aboveContextTokens ?? "", p.condition ?? ""].join("|");
  const groups: Record<string, PriceRecord[]> = {};
  for (const p of rows) (groups[key(p)] ??= []).push(p);
  const bad: [string, string][] = [];
  for (const g of Object.values(groups)) {
    g.sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
    for (let i = 1; i < g.length; i++) {
      const prev = g[i - 1];
      if (!prev.effectiveTo || prev.effectiveTo >= g[i].effectiveFrom) bad.push([prev.id, g[i].id]);
    }
  }
  return bad;
}
