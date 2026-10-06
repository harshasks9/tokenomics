import type { CostBreakdown, Model, WorkloadInput, WorkloadPreset } from "./types";

/**
 * Calculator math. All prices are USD per 1M tokens; token volumes are per
 * request × requests per month. Cached input uses the model's cached price
 * when published, otherwise falls back to full price (and the breakdown is
 * flagged as "no cache discount"). Batch applies the model's batch discount
 * to the eligible share of traffic. Cache-write fees are ignored (they are
 * amortized per cache lifetime and depend on TTL strategy; documented in
 * methodology).
 */
export function estimateCost(model: Model, w: WorkloadInput): CostBreakdown {
  const p = model.pricing;
  if (p.input == null || p.output == null) {
    return { monthly: 0, input: 0, cachedInput: 0, output: 0, batchSavings: 0, perRequest: 0, complete: false };
  }
  const reqs = Math.max(0, w.requestsPerMonth);
  const inTok = (Math.max(0, w.inputTokens) * reqs) / 1e6;
  const outTok = (Math.max(0, w.outputTokens) * reqs) / 1e6;
  const hit = Math.min(1, Math.max(0, w.cacheHitRate));
  const cachedPrice = p.cachedInput ?? p.input;
  const cachedTok = model.features.caching === "none" ? 0 : inTok * hit;
  const freshTok = inTok - cachedTok;

  // Long-context tier: if average input exceeds the threshold, the whole
  // request prices at the higher tier (vendor rule for Gemini/Claude tiers).
  let inPrice = p.input;
  let outPrice = p.output;
  if (p.longContext && w.inputTokens > p.longContext.thresholdK * 1000) {
    inPrice = p.longContext.input;
    outPrice = p.longContext.output;
  }

  const inputCost = freshTok * inPrice;
  const cachedCost = cachedTok * cachedPrice;
  const outputCost = outTok * outPrice;
  const gross = inputCost + cachedCost + outputCost;

  const batchShare = model.features.batch ? Math.min(1, Math.max(0, w.batchShare)) : 0;
  const disc = p.batchDiscount ?? 0;
  const batchSavings = gross * batchShare * disc;
  const monthly = gross - batchSavings;

  return {
    monthly,
    input: inputCost,
    cachedInput: cachedCost,
    output: outputCost,
    batchSavings,
    perRequest: reqs > 0 ? monthly / reqs : 0,
    complete: true,
  };
}

/** Blended $ per 1M tokens for the given workload mix (for the scatter x-axis). */
export function blendedPricePerM(model: Model, w: WorkloadInput): number | null {
  const c = estimateCost(model, w);
  if (!c.complete) return null;
  const totalTok = ((w.inputTokens + w.outputTokens) * w.requestsPerMonth) / 1e6;
  return totalTok > 0 ? c.monthly / totalTok : null;
}

export function fmtUsd(v: number, opts: { compact?: boolean } = {}): string {
  if (!Number.isFinite(v)) return "—";
  if (opts.compact) {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}k`;
  }
  if (v >= 1000) return `$${Math.round(v).toLocaleString("en-US")}`;
  if (v >= 100) return `$${v.toFixed(0)}`;
  if (v >= 10) return `$${v.toFixed(1)}`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  if (v >= 0.01) return `$${v.toFixed(3)}`;
  if (v === 0) return "$0";
  return `$${v.toFixed(4)}`;
}

export function fmtPerM(v: number | null | undefined): string {
  if (v == null) return "n/a";
  if (v >= 10) return `$${v.toFixed(2)}`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}`;
}

export function fmtTokens(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
  return `${n}`;
}

/** Does the model satisfy a preset's hard requirements? Returns failing reasons. */
export function unmetRequirements(model: Model, preset: WorkloadPreset): string[] {
  const r = preset.requires;
  const fails: string[] = [];
  if (r.minContextK && model.contextK < r.minContextK) fails.push(`context < ${r.minContextK}k`);
  if (r.toolCalling && !model.features.toolCalling) fails.push("no tool calling");
  if (r.structuredOutput && !model.features.structuredOutput) fails.push("no structured output");
  if (r.reasoning && model.features.reasoning === "none") fails.push("no reasoning mode");
  if (r.modalitiesIn) {
    for (const m of r.modalitiesIn) if (!model.modalitiesIn.includes(m)) fails.push(`no ${m} input`);
  }
  if (r.minBench) {
    const s = model.benchmarks[r.minBench.benchId]?.score;
    if (s == null) fails.push(`no ${r.minBench.benchId} score`);
    else if (s < r.minBench.score) fails.push(`${r.minBench.benchId} below ${r.minBench.score}`);
  }
  return fails;
}

export const DEFAULT_WORKLOAD: WorkloadInput = {
  requestsPerMonth: 1_000_000,
  inputTokens: 2_000,
  outputTokens: 500,
  cacheHitRate: 0.3,
  batchShare: 0,
};
