// Per 1,000,000 tokens. Source: vendor list pricing, June 2026.
export const MODELS = {
  opus:      { name: "Claude Opus 4.8",       inPM: 5.00, outPM: 25.00 }, // frontier reasoning
  sonnet:    { name: "Claude Sonnet 4.6",     inPM: 3.00, outPM: 15.00 }, // strong reasoning, ~half Opus
  geminiPro: { name: "Gemini 3.1 Pro",        inPM: 2.00, outPM: 12.00 }, // mid frontier, multimodal
  flash:     { name: "Gemini 3.5 Flash",      inPM: 1.50, outPM:  9.00 }, // fast, native multimodal
  flashLite: { name: "Gemini 3.1 Flash-Lite", inPM: 0.25, outPM:  1.50 }, // cheapest high-volume tier
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
