import type { ProviderDef, ProviderId, WorkloadPreset, BenchmarkDef } from "./types";

/**
 * Provider slots follow the validated categorical palette order (dataviz
 * reference palette, light mode); color follows the entity and never its rank.
 * Each provider also carries a glyph so identity never rests on color alone.
 */
export const PROVIDERS: ProviderDef[] = [
  { id: "google", name: "Google", hue: 1, glyph: "●", pricingUrl: "https://ai.google.dev/gemini-api/docs/pricing" },
  { id: "anthropic", name: "Anthropic", hue: 2, glyph: "▲", pricingUrl: "https://claude.com/pricing#api" },
  { id: "openai", name: "OpenAI", hue: 3, glyph: "■", pricingUrl: "https://platform.openai.com/docs/pricing" },
  { id: "mistral", name: "Mistral", hue: 4, glyph: "◆", pricingUrl: "https://mistral.ai/pricing" },
  { id: "xai", name: "xAI", hue: 5, glyph: "✚", pricingUrl: "https://docs.x.ai/docs/models" },
  { id: "meta", name: "Meta", hue: 6, glyph: "⬟", pricingUrl: "https://www.llama.com/" },
  { id: "alibaba", name: "Alibaba (Qwen)", hue: 7, glyph: "✦", pricingUrl: "https://www.alibabacloud.com/help/en/model-studio/models" },
  { id: "deepseek", name: "DeepSeek", hue: 8, glyph: "✖", pricingUrl: "https://api-docs.deepseek.com/quick_start/pricing" },
];

/** Hex per slot (light surface). Mirrors the dataviz reference palette exactly. */
export const SLOT_HEX: Record<number, string> = {
  1: "#2a78d6",
  2: "#eb6834",
  3: "#1baf7a",
  4: "#eda100",
  5: "#e87ba4",
  6: "#008300",
  7: "#4a3aa7",
  8: "#e34948",
};

export const providerById = (id: ProviderId): ProviderDef => PROVIDERS.find((p) => p.id === id)!;
export const providerColor = (id: ProviderId): string => SLOT_HEX[providerById(id).hue];

/** Ordinal tier ramp (one hue, three steps) for the scatter's color channel. */
export const TIER_HEX = { frontier: "#104281", balanced: "#2a78d6", economy: "#86b6ef" } as const;
export const TIER_LABEL = { frontier: "Frontier", balanced: "Balanced", economy: "Economy" } as const;

export const BENCHMARK_IDS = ["aa-index", "lmarena", "gpqa", "swe-verified", "aime", "mmlu-pro"] as const;

/** Workload presets populate the calculator and the requirement filters (PRD §5). */
export const WORKLOAD_PRESETS: WorkloadPreset[] = [
  {
    id: "chat",
    name: "Customer chat",
    icon: "MessageSquare",
    desc: "High-volume support conversations: short turns, shared system prompt, latency-sensitive.",
    input: { requestsPerMonth: 3_000_000, inputTokens: 1_800, outputTokens: 250, cacheHitRate: 0.6, batchShare: 0 },
    requires: { toolCalling: true, minContextK: 32 },
    qualityBench: "aa-index",
  },
  {
    id: "coding",
    name: "Coding agent",
    icon: "Code2",
    desc: "Agentic coding: large repo context per turn, many tool calls, verification loops.",
    input: { requestsPerMonth: 400_000, inputTokens: 25_000, outputTokens: 1_500, cacheHitRate: 0.75, batchShare: 0 },
    requires: { toolCalling: true, structuredOutput: true, minContextK: 200, reasoning: true },
    qualityBench: "swe-verified",
  },
  {
    id: "docs",
    name: "Document analysis",
    icon: "FileText",
    desc: "Long documents in, structured extraction out; often batchable overnight.",
    input: { requestsPerMonth: 200_000, inputTokens: 40_000, outputTokens: 1_200, cacheHitRate: 0.2, batchShare: 0.7 },
    requires: { structuredOutput: true, minContextK: 128, modalitiesIn: ["pdf"] },
    qualityBench: "mmlu-pro",
  },
  {
    id: "agents",
    name: "Enterprise agents",
    icon: "Bot",
    desc: "Multi-step workflows over APIs: tool calls, reasoning, moderate context, reliability over speed.",
    input: { requestsPerMonth: 1_000_000, inputTokens: 8_000, outputTokens: 800, cacheHitRate: 0.5, batchShare: 0 },
    requires: { toolCalling: true, structuredOutput: true, reasoning: true, minContextK: 128 },
    qualityBench: "aa-index",
  },
  {
    id: "multimodal",
    name: "Multimodal (image + text)",
    icon: "Image",
    desc: "Image understanding at scale: receipts, screenshots, product photos with short text prompts.",
    input: { requestsPerMonth: 2_000_000, inputTokens: 1_500, outputTokens: 300, cacheHitRate: 0.3, batchShare: 0.4 },
    requires: { modalitiesIn: ["image"], structuredOutput: true },
    qualityBench: "aa-index",
  },
  {
    id: "research",
    name: "Deep reasoning",
    icon: "Brain",
    desc: "Hard analytical tasks where quality dominates: long outputs, reasoning on, low volume.",
    input: { requestsPerMonth: 50_000, inputTokens: 6_000, outputTokens: 4_000, cacheHitRate: 0.1, batchShare: 0.3 },
    requires: { reasoning: true, minContextK: 128 },
    qualityBench: "gpqa",
  },
  {
    id: "bulk",
    name: "Bulk classification",
    icon: "Layers",
    desc: "Millions of short classification/extraction calls; cheapest acceptable quality wins.",
    input: { requestsPerMonth: 20_000_000, inputTokens: 600, outputTokens: 40, cacheHitRate: 0.4, batchShare: 0.9 },
    requires: { structuredOutput: true },
    qualityBench: "mmlu-pro",
  },
];

export const presetById = (id: string) => WORKLOAD_PRESETS.find((p) => p.id === id);

/** Placeholder until research lands; benchmarks.ts exports the verified defs. */
export type { BenchmarkDef };
