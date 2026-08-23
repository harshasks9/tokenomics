// Per 1,000,000 tokens. Source: vendor list pricing, verified August 23, 2026.
// aaScore: Artificial Analysis Intelligence Index v4.1.1 (artificialanalysis.ai).
// Notes: Gemini 3.7 Flash (GA Aug 14, 2026) is priced at its standard list rate —
// an intro rate of $0.75/$3.75 runs through Dec 31, 2026. Gemini 3.1 Pro remains
// the top price-listed Pro (Preview; ≤200K-context tier shown). Claude Sonnet 5's
// launch rate of $2/$10 was made permanent in August 2026 per press reports.
export const MODELS = {
  // ── Google Cloud Gemini ──────────────────────────────────────────────────
  geminiPro: { name: "Gemini 3.1 Pro",        vendor: "Google", inPM: 2.00, outPM: 12.00, aaScore: 48 },
  flash:     { name: "Gemini 3.7 Flash",      vendor: "Google", inPM: 1.50, outPM:  7.50, aaScore: 56 }, // Google's current flagship workhorse
  flashLite: { name: "Gemini 3.5 Flash-Lite", vendor: "Google", inPM: 0.30, outPM:  2.50, aaScore: 36 }, // high-volume routing
  // ── Competitor (Anthropic) ───────────────────────────────────────────────
  sonnet:    { name: "Claude Sonnet 5",     vendor: "Anthropic", inPM: 2.00, outPM: 10.00, aaScore: 55 },
  opus:      { name: "Claude Opus 5",       vendor: "Anthropic", inPM: 5.00, outPM: 25.00, aaScore: 63 }, // AA Index leader
} as const;

export type ModelKey = keyof typeof MODELS;

/** Cost in USD for a single call */
export const callCost = (m: ModelKey, inTok: number, outTok: number): number =>
  (inTok / 1e6) * MODELS[m].inPM + (outTok / 1e6) * MODELS[m].outPM;

/** Format USD with appropriate precision */
export const fmtUSD = (v: number, decimals?: number): string => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(decimals ?? 0)}K`;
  if (v >= 1) return `$${v.toFixed(decimals ?? 2)}`;
  if (v >= 0.01) return `$${v.toFixed(decimals ?? 4)}`;
  return `$${v.toFixed(decimals ?? 6)}`;
};

/** Format large numbers */
export const fmtNum = (v: number): string => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toFixed(0);
};

/** Percentage savings */
export const pctSavings = (expensive: number, cheap: number): number =>
  ((expensive - cheap) / expensive) * 100;
