/**
 * Section 10 — Harness economics lab.
 * Cost per successful task = all-in spend across attempts ÷ successful tasks.
 * Presets are illustrative profiles, not vendor measurements; the point is the
 * shape of the math, which users can verify with their own numbers.
 */

export type EconProfile = {
  id: string;
  name: string;
  desc: string;
  /** $ per 1M input tokens (blended list price). */
  priceIn: number;
  /** $ per 1M output tokens. */
  priceOut: number;
  /** Tokens sent per turn (context+prompt), thousands. */
  ctxPerTurnK: number;
  /** Output tokens per turn, thousands. */
  outPerTurnK: number;
  /** Turns (model calls) per attempt. */
  turns: number;
  /** Cache hit rate on input tokens, 0..1. */
  cacheHit: number;
  /** Cached-read discount, 0..1 (0.9 = 90% off). */
  cacheDiscount: number;
  /** Task success rate per attempt, 0..1. */
  success: number;
  /** Retries allowed on failure (whole-task re-attempts). */
  retries: number;
};

/**
 * Two contrasting harness profiles around the same class of model, plus a
 * "cheap model, weak harness" trap profile. Values are round, defensible
 * illustrations consistent with the research (cache-hit dominance, retry
 * costs, 40× token spreads across harnesses).
 */
export const ECON_PRESETS: EconProfile[] = [
  {
    id: "disciplined",
    name: "Efficient harness · frontier model",
    desc: "Cache-friendly context layout, compaction, verification before done",
    priceIn: 2.0,
    priceOut: 12.0,
    ctxPerTurnK: 60,
    outPerTurnK: 1.2,
    turns: 18,
    cacheHit: 0.9,
    cacheDiscount: 0.9,
    success: 0.9,
    retries: 1,
  },
  {
    id: "naive",
    name: "Naive harness · frontier model",
    desc: "Re-sends bloated context, no caching discipline, no verification",
    priceIn: 2.0,
    priceOut: 12.0,
    ctxPerTurnK: 45,
    outPerTurnK: 1.5,
    turns: 30,
    cacheHit: 0.25,
    cacheDiscount: 0.9,
    success: 0.62,
    retries: 2,
  },
  {
    id: "cheap-trap",
    name: "Naive harness · budget model",
    desc: "The cheapest tokens on the invoice — and the retries to match",
    priceIn: 0.5,
    priceOut: 2.5,
    ctxPerTurnK: 45,
    outPerTurnK: 1.8,
    turns: 38,
    cacheHit: 0.25,
    cacheDiscount: 0.9,
    success: 0.45,
    retries: 3,
  },
];

export type EconResult = {
  costPerAttempt: number;
  expectedAttempts: number;
  effectiveSuccess: number;
  costPerSuccess: number;
  tokensPerAttemptM: number;
};

/** Expected attempts under up to `retries` re-attempts; failures beyond that count against success. */
export function computeEconomics(p: EconProfile): EconResult {
  const inTokensM = (p.ctxPerTurnK * 1000 * p.turns) / 1e6;
  const outTokensM = (p.outPerTurnK * 1000 * p.turns) / 1e6;
  const effInPrice = p.priceIn * (1 - p.cacheHit * p.cacheDiscount);
  const costPerAttempt = inTokensM * effInPrice + outTokensM * p.priceOut;

  // Geometric attempts, truncated at 1 + retries.
  const maxAttempts = 1 + p.retries;
  let expectedAttempts = 0;
  let pReach = 1; // probability we reach attempt i
  let effectiveSuccess = 0;
  for (let i = 0; i < maxAttempts; i++) {
    expectedAttempts += pReach;
    effectiveSuccess += pReach * p.success;
    pReach *= 1 - p.success;
  }

  const totalCost = costPerAttempt * expectedAttempts;
  const costPerSuccess = effectiveSuccess > 0 ? totalCost / effectiveSuccess : Infinity;

  return {
    costPerAttempt,
    expectedAttempts,
    effectiveSuccess,
    costPerSuccess,
    tokensPerAttemptM: inTokensM + outTokensM,
  };
}
