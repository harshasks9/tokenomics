// FrontierOps — model catalog: every model/config the optimizer can place a
// workload on, with list pricing ($ per 1M tokens), a workload-blended quality
// index (0–100), and serving characteristics. All figures are realistic
// synthetic demo data as of Aug 2026 — not live price sheets.

export type Cloud = "google" | "aws" | "azure" | "openai" | "anthropic";

export const CLOUDS: { id: Cloud; label: string; short: string }[] = [
  { id: "google", label: "Google Cloud · Vertex AI", short: "Google Cloud" },
  { id: "aws", label: "AWS · Bedrock", short: "AWS" },
  { id: "azure", label: "Azure · AI Foundry", short: "Azure" },
  { id: "openai", label: "OpenAI · API", short: "OpenAI" },
  { id: "anthropic", label: "Anthropic · API", short: "Anthropic" },
];

export const cloudLabel = (c: Cloud) => CLOUDS.find((x) => x.id === c)!.short;

export type Vendor =
  | "Google"
  | "OpenAI"
  | "Anthropic"
  | "Meta"
  | "Amazon"
  | "DeepSeek"
  | "Mistral";

export interface ModelOption {
  id: string;
  name: string;
  vendor: Vendor;
  /** clouds where this model can be deployed */
  clouds: Cloud[];
  /** $ per 1M input tokens (PayGo list) */
  inPrice: number;
  /** $ per 1M output tokens */
  outPrice: number;
  /** $ per 1M cached input tokens (== inPrice when caching unsupported) */
  cachedInPrice: number;
  /** workload-blended quality index 0–100 (reasoning, instruction, grounding) */
  quality: number;
  /** p50 time-to-first-token, ms */
  ttftMs: number;
  /** output tokens / sec */
  tps: number;
  /** context window, K tokens */
  contextK: number;
  /** batch/deferred price factor (0.5 = 50% off) */
  batchFactor: number;
  supportsCaching: boolean;
  /** committed capacity (PTU/GSU) discount vs PayGo at 100% utilization */
  committedDiscount: number;
  /** legacy models are flagged in the UI as substitution targets */
  legacy?: boolean;
}

export const MODELS: ModelOption[] = [
  // ---- Google ----
  { id: "gemini-3-pro", name: "Gemini 3 Pro", vendor: "Google", clouds: ["google"],
    inPrice: 2.0, outPrice: 12.0, cachedInPrice: 0.5, quality: 93, ttftMs: 720, tps: 95,
    contextK: 2048, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "gemini-25-pro", name: "Gemini 2.5 Pro", vendor: "Google", clouds: ["google"],
    inPrice: 1.25, outPrice: 10.0, cachedInPrice: 0.31, quality: 86, ttftMs: 680, tps: 90,
    contextK: 1024, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "gemini-25-flash", name: "Gemini 2.5 Flash", vendor: "Google", clouds: ["google"],
    inPrice: 0.30, outPrice: 2.50, cachedInPrice: 0.075, quality: 77, ttftMs: 340, tps: 170,
    contextK: 1024, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "gemini-25-flash-lite", name: "Gemini 2.5 Flash-Lite", vendor: "Google", clouds: ["google"],
    inPrice: 0.10, outPrice: 0.40, cachedInPrice: 0.025, quality: 67, ttftMs: 250, tps: 210,
    contextK: 1024, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  // ---- OpenAI (also deployable on Azure AI Foundry) ----
  { id: "gpt-51", name: "GPT-5.1", vendor: "OpenAI", clouds: ["openai", "azure"],
    inPrice: 1.25, outPrice: 10.0, cachedInPrice: 0.125, quality: 90, ttftMs: 560, tps: 110,
    contextK: 400, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "gpt-5-mini", name: "GPT-5 mini", vendor: "OpenAI", clouds: ["openai", "azure"],
    inPrice: 0.25, outPrice: 2.0, cachedInPrice: 0.025, quality: 79, ttftMs: 420, tps: 160,
    contextK: 400, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "gpt-5-nano", name: "GPT-5 nano", vendor: "OpenAI", clouds: ["openai", "azure"],
    inPrice: 0.05, outPrice: 0.40, cachedInPrice: 0.005, quality: 64, ttftMs: 290, tps: 220,
    contextK: 400, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "o3", name: "o3", vendor: "OpenAI", clouds: ["openai", "azure"],
    inPrice: 2.0, outPrice: 8.0, cachedInPrice: 0.5, quality: 88, ttftMs: 1900, tps: 85,
    contextK: 200, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "gpt-4o", name: "GPT-4o", vendor: "OpenAI", clouds: ["openai", "azure"],
    inPrice: 2.5, outPrice: 10.0, cachedInPrice: 1.25, quality: 76, ttftMs: 460, tps: 105,
    contextK: 128, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3, legacy: true },
  { id: "gpt-4o-mini", name: "GPT-4o mini", vendor: "OpenAI", clouds: ["openai", "azure"],
    inPrice: 0.15, outPrice: 0.60, cachedInPrice: 0.075, quality: 63, ttftMs: 330, tps: 180,
    contextK: 128, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3, legacy: true },
  // ---- Anthropic (also on Bedrock / Vertex) ----
  { id: "claude-opus-45", name: "Claude Opus 4.5", vendor: "Anthropic", clouds: ["anthropic", "aws", "google"],
    inPrice: 5.0, outPrice: 25.0, cachedInPrice: 0.5, quality: 95, ttftMs: 980, tps: 70,
    contextK: 200, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.25 },
  { id: "claude-sonnet-45", name: "Claude Sonnet 4.5", vendor: "Anthropic", clouds: ["anthropic", "aws", "google"],
    inPrice: 3.0, outPrice: 15.0, cachedInPrice: 0.30, quality: 89, ttftMs: 640, tps: 100,
    contextK: 200, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.25 },
  { id: "claude-haiku-45", name: "Claude Haiku 4.5", vendor: "Anthropic", clouds: ["anthropic", "aws", "google"],
    inPrice: 1.0, outPrice: 5.0, cachedInPrice: 0.10, quality: 80, ttftMs: 360, tps: 165,
    contextK: 200, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.25 },
  // ---- AWS-hosted open / house models ----
  { id: "nova-premier", name: "Nova Premier", vendor: "Amazon", clouds: ["aws"],
    inPrice: 2.5, outPrice: 12.5, cachedInPrice: 0.625, quality: 83, ttftMs: 750, tps: 90,
    contextK: 1000, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "nova-pro", name: "Nova Pro", vendor: "Amazon", clouds: ["aws"],
    inPrice: 0.80, outPrice: 3.20, cachedInPrice: 0.20, quality: 75, ttftMs: 420, tps: 130,
    contextK: 300, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "nova-lite", name: "Nova Lite", vendor: "Amazon", clouds: ["aws"],
    inPrice: 0.06, outPrice: 0.24, cachedInPrice: 0.015, quality: 58, ttftMs: 280, tps: 210,
    contextK: 300, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "llama-4-maverick", name: "Llama 4 Maverick", vendor: "Meta", clouds: ["aws", "azure"],
    inPrice: 0.24, outPrice: 0.97, cachedInPrice: 0.24, quality: 72, ttftMs: 380, tps: 150,
    contextK: 1000, batchFactor: 0.5, supportsCaching: false, committedDiscount: 0.3 },
  { id: "deepseek-v32", name: "DeepSeek V3.2", vendor: "DeepSeek", clouds: ["aws", "azure"],
    inPrice: 0.27, outPrice: 1.10, cachedInPrice: 0.07, quality: 76, ttftMs: 900, tps: 95,
    contextK: 128, batchFactor: 0.5, supportsCaching: true, committedDiscount: 0.3 },
  { id: "mistral-large-3", name: "Mistral Large 3", vendor: "Mistral", clouds: ["aws", "azure", "google"],
    inPrice: 2.0, outPrice: 6.0, cachedInPrice: 2.0, quality: 80, ttftMs: 520, tps: 115,
    contextK: 128, batchFactor: 0.5, supportsCaching: false, committedDiscount: 0.3, legacy: true },
];

export const modelById = (id: string): ModelOption => {
  const m = MODELS.find((x) => x.id === id);
  if (!m) throw new Error(`unknown model ${id}`);
  return m;
};

/** Reference blend used for the frontier chart axis: 75% input / 25% output. */
export const blendedPrice = (m: ModelOption) => 0.75 * m.inPrice + 0.25 * m.outPrice;

/** Models no other model beats on both cost (reference blend) and quality. */
export function paretoFrontier(models: ModelOption[] = MODELS): ModelOption[] {
  return models
    .filter((m) =>
      !models.some(
        (o) =>
          o !== m &&
          o.quality >= m.quality &&
          blendedPrice(o) < blendedPrice(m) - 1e-9,
      ),
    )
    .sort((a, b) => a.quality - b.quality);
}
