import type { Category, Cohort, LayerId, PeriodId, ThesisStatus, TopicId, Verdict } from "./types";

/** The unified 14-layer AI stack every claim is mapped against (bottom → top). */
export const LAYERS: { id: LayerId; n: number; name: string; short: string; scope: string }[] = [
  { id: "energy", n: 1, name: "Energy & physical infrastructure", short: "Energy", scope: "Power, cooling, data centers, grid and siting constraints" },
  { id: "semis", n: 2, name: "Semiconductors", short: "Chips", scope: "GPUs, TPUs, ASICs, HBM memory, interconnect, packaging" },
  { id: "cloud", n: 3, name: "Cloud & compute", short: "Cloud", scope: "Hyperscalers, neoclouds, training and inference clusters" },
  { id: "data", n: 4, name: "Data", short: "Data", scope: "Public web, synthetic, proprietary and RL-environment data; quality" },
  { id: "architecture", n: 5, name: "Model architecture", short: "Architecture", scope: "Transformers, diffusion, MoE, world models, alternatives" },
  { id: "training", n: 6, name: "Training & learning", short: "Training", scope: "Pretraining, scaling laws, RL, post-training, continual learning" },
  { id: "inference", n: 7, name: "Inference & economics", short: "Inference", scope: "Cost per token, efficiency, latency, test-time compute" },
  { id: "models", n: 8, name: "Foundation models", short: "Models", scope: "Frontier, open-weight, multimodal and specialized models" },
  { id: "platforms", n: 9, name: "Platforms & tooling", short: "Platforms", scope: "APIs, orchestration, evaluation, security, governance tooling" },
  { id: "agents", n: 10, name: "Agents & reasoning", short: "Agents", scope: "Tool use, memory, autonomy, planning, agentic workflows" },
  { id: "apps", n: 11, name: "Applications", short: "Apps", scope: "Coding, productivity, search, creative and vertical AI" },
  { id: "distribution", n: 12, name: "Distribution", short: "Distribution", scope: "OS, browsers, productivity suites, developer ecosystems" },
  { id: "economics", n: 13, name: "Economics & moats", short: "Moats", scope: "Pricing, commoditization, differentiation, value capture" },
  { id: "society", n: 14, name: "Society & governance", short: "Society", scope: "Labor, safety, regulation, geopolitics, AGI" },
];
export const layerById = (id: LayerId) => LAYERS.find((l) => l.id === id)!;

export const TOPICS: { id: TopicId; name: string }[] = [
  { id: "scaling", name: "Scaling laws & sufficiency" },
  { id: "architecture", name: "Transformers vs alternatives" },
  { id: "post-training", name: "Pretraining vs post-training" },
  { id: "reasoning", name: "Reasoning & inference-time compute" },
  { id: "data", name: "Synthetic data & data scarcity" },
  { id: "open-weights", name: "Open vs proprietary models" },
  { id: "infra-cycle", name: "GPU demand & infra cycles" },
  { id: "commoditization", name: "Model commoditization" },
  { id: "hyperscalers", name: "Hyperscaler advantage" },
  { id: "agents", name: "Agent autonomy & reliability" },
  { id: "coding", name: "Software development automation" },
  { id: "app-moats", name: "Application-layer moats" },
  { id: "enterprise-roi", name: "Enterprise adoption & ROI" },
  { id: "labor", name: "Labor & productivity" },
  { id: "agi-timelines", name: "AGI timelines" },
  { id: "safety", name: "Alignment, safety & governance" },
  { id: "value-accrual", name: "Where value accrues" },
];
export const topicName = (id: TopicId) => TOPICS.find((t) => t.id === id)?.name ?? id;

export const PERIOD_ORDER: PeriodId[] = ["p2012", "p2017", "p2020", "p2022", "p2024", "p2025", "p2026"];
/** Default year span for each period (used when a period's research record is missing). */
export const PERIOD_YEARS: Record<PeriodId, [number, number]> = {
  p2012: [2012, 2016],
  p2017: [2017, 2019],
  p2020: [2020, 2021],
  p2022: [2022, 2023],
  p2024: [2024, 2024],
  p2025: [2025, 2025],
  p2026: [2026, 2026],
};
export const periodForYear = (y: number): PeriodId =>
  PERIOD_ORDER.find((p) => y >= PERIOD_YEARS[p][0] && y <= PERIOD_YEARS[p][1]) ?? (y < 2012 ? "p2012" : "p2026");

export const CUTOFF = "2026-10-11";
export const YEAR_MIN = 2012;
export const YEAR_MAX = 2026;

export const COHORTS: { id: Cohort; name: string; short: string; color: string; shape: "square" | "circle" | "diamond" }[] = [
  { id: "builders", name: "CEOs & builders", short: "Builders", color: "#4a3aa7", shape: "square" },
  { id: "researchers", name: "Researchers", short: "Researchers", color: "#c0397a", shape: "circle" },
  { id: "investors", name: "Investors", short: "Investors", color: "#0e7490", shape: "diamond" },
];
export const cohortById = (id: Cohort) => COHORTS.find((c) => c.id === id)!;

export const CATEGORIES: { id: Category; name: string; lens: "technical" | "commercial" }[] = [
  { id: "technical", name: "Technical", lens: "technical" },
  { id: "economic", name: "Economic", lens: "commercial" },
  { id: "market", name: "Market", lens: "commercial" },
  { id: "adoption", name: "Adoption", lens: "commercial" },
  { id: "governance", name: "Governance", lens: "technical" },
];

/**
 * Edge & verdict grammar (from the brief): green = agreement/validation,
 * red = disagreement/falsification, blue = influence/dependency,
 * amber = unresolved; dashed = inferred. Text labels always accompany color.
 */
export const GRAMMAR = {
  agree: "#15803d",
  disagree: "#c62828",
  influence: "#2563eb",
  unresolved: "#d08700",
  neutral: "#8a94a6",
} as const;

export const VERDICT_META: Record<Verdict, { label: string; color: string; glyph: string }> = {
  correct: { label: "Correct", color: GRAMMAR.agree, glyph: "✓" },
  partial: { label: "Partially correct", color: "#5f8f1f", glyph: "◐" },
  incorrect: { label: "Incorrect", color: GRAMMAR.disagree, glyph: "✕" },
  unresolved: { label: "Unresolved", color: GRAMMAR.unresolved, glyph: "?" },
};

export const THESIS_STATUS_META: Record<ThesisStatus, { label: string; color: string; glyph: string }> = {
  validated: { label: "Validated", color: GRAMMAR.agree, glyph: "✓" },
  partial: { label: "Partially validated", color: "#5f8f1f", glyph: "◐" },
  falsified: { label: "Falsified", color: GRAMMAR.disagree, glyph: "✕" },
  unresolved: { label: "Unresolved", color: GRAMMAR.unresolved, glyph: "?" },
  contested: { label: "Contested", color: "#7c5cbf", glyph: "⇄" },
};

/** Parse "YYYY", "YYYY-MM" or "YYYY-MM-DD" to a fractional year for time filtering. */
export function yearOf(date: string): number {
  const [y, m = "1", d = "1"] = date.split("-");
  return Number(y) + (Number(m) - 1) / 12 + (Number(d) - 1) / 365;
}
