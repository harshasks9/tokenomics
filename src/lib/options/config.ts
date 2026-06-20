export const SCREEN_CONFIG = {
  allowedSectors: ["Technology", "Communication Services"],
  marketCapMoreThan: 10_000_000_000,
  minPctBelowHigh: 0.30,
  representativePut: {
    minDte: 30,
    maxDte: 45,
    minAbsDelta: 0.10,
    maxAbsDelta: 0.30,
    targetAbsDelta: 0.20,
    minOpenInterest: 1000,
    minVolume: 500,
    maxSpreadPct: 0.05,
  },
  manualRefreshWindowMs: 15 * 60 * 1000,
  cacheKey: "options:screener:latest",
  manualRefreshKey: "options:screener:last-manual-refresh",
  weights: {
    moat: 14,
    competitive_vs_ai: 10,
    p_drawdown_temporary: 10,
    downside_event_risk: 6,
    balance_sheet: 12,
    fcf_durability: 12,
    valuation: 12,
    revenue_trajectory: 10,
    option_liquidity: 8,
    iv_attractiveness: 6,
  },
} as const;

export const QUANT_FACTORS = [
  "balance_sheet",
  "fcf_durability",
  "valuation",
  "revenue_trajectory",
  "option_liquidity",
  "iv_attractiveness",
] as const;

export const JUDGMENT_FACTORS = [
  "moat",
  "competitive_vs_ai",
  "p_drawdown_temporary",
  "downside_event_risk",
] as const;

export const FIXTURE_AS_OF = "2026-06-21T12:00:00.000Z";
