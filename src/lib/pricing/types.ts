/**
 * PRICING — content model.
 *
 * Everything the site renders comes from typed data in this directory plus a
 * small live overlay served by /api/pricing (daily cron refresh). Prices are
 * USD per 1M tokens. Every model carries sources and a lastVerified date;
 * anything we could not verify is listed in `unverified` and rendered as
 * such — never invented.
 */

export type ProviderId =
  | "google"
  | "openai"
  | "anthropic"
  | "deepseek"
  | "meta"
  | "alibaba"
  | "mistral"
  | "xai";

export type SourceLink = { label: string; url: string };

/** Normalized position in a provider's lineup: top model, middle tier, fast/cheap tier. */
export type Rung = "flagship" | "mid" | "light";

export type Modality = "text" | "image" | "audio" | "video" | "pdf";

export type ModelPricing = {
  /** USD per 1M input tokens (null = not publicly priced / unverified). */
  input: number | null;
  /** USD per 1M output tokens. */
  output: number | null;
  /** USD per 1M cached input tokens read from cache. */
  cachedInput?: number | null;
  /** USD per 1M tokens to write cache, where metered separately. */
  cacheWrite?: number | null;
  /** One-line note on caching mechanics (implicit/explicit, TTL, storage fees). */
  cacheNote?: string;
  /** Batch discount as fraction off (0.5 = 50% off both input and output). */
  batchDiscount?: number | null;
  /** Long-context tier: price above thresholdK (thousands of tokens). */
  longContext?: { thresholdK: number; input: number; output: number } | null;
  /** Per-modality surcharges that token prices alone don't capture. */
  modalityNotes?: string[];
  /** Other pricing notes (off-peak discounts, tiers, minimums). */
  notes?: string[];
};

export type FeatureSupport = {
  toolCalling: boolean;
  structuredOutput: boolean;
  /** "always" = reasoning can't be disabled; "optional" = togglable/budgeted. */
  reasoning: "always" | "optional" | "none";
  caching: "implicit" | "explicit" | "both" | "none";
  batch: boolean;
  fineTuning: boolean;
};

export type BenchScore = {
  /** Score in the benchmark's native unit. */
  score: number;
  /** True when vendor-reported rather than from an independent leaderboard. */
  selfReported?: boolean;
  note?: string;
};

export type Model = {
  /** Site slug. */
  id: string;
  /** Exact API model identifier as served. */
  apiId: string;
  name: string;
  provider: ProviderId;
  family: string;
  /** ISO date of release/GA. */
  released: string;
  status: "ga" | "preview" | "legacy";
  /** Who serves the price shown: "first-party" API or a named third-party host. */
  servedBy: string;
  /** True when the price shown is third-party hosting, not the model owner's API. */
  thirdPartyPricing?: boolean;
  /** Open-weight license when applicable (null/undefined = proprietary). */
  license?: string;
  pricing: ModelPricing;
  /** Context window in K tokens. */
  contextK: number;
  /** Max output in K tokens (null = not published / unverified). */
  maxOutputK: number | null;
  modalitiesIn: Modality[];
  modalitiesOut: Modality[];
  features: FeatureSupport;
  /** Where it can be deployed (first-party API, clouds, self-host). */
  deployment: string[];
  /** benchmarkId → score. Missing = n/a (never estimated). */
  benchmarks: Record<string, BenchScore>;
  /** Editorial tier used for grouping: frontier / balanced / economy. */
  tier: "frontier" | "balanced" | "economy";
  /**
   * The provider's own product tier (Pro / Flash / Flash-Lite, Astra / Sol / Luna,
   * Fable / Opus / Sonnet / Haiku…), normalized to a rung so lineups can be
   * compared rung-for-rung across providers.
   */
  series: { name: string; rung: Rung };
  /** Workload strengths, keyed to WORKLOAD_PRESETS ids where possible. */
  bestFor: string[];
  /** One-sentence honest trade-off. */
  tradeoff: string;
  sources: SourceLink[];
  /** ISO date the facts above were last checked against the sources. */
  lastVerified: string;
  /**
   * How the facts were verified: "official" = official page fetched directly;
   * "indexed" = official page via search-index extracts, cross-checked with
   * ≥2 independent trackers (official domain unreachable at verification);
   * "secondary" = third-party sources only.
   */
  verification: "official" | "indexed" | "secondary";
  /** Facts we could not verify from official sources. */
  unverified?: string[];
};

export type BenchmarkDef = {
  id: string;
  name: string;
  short: string;
  unit: string;
  higherBetter: boolean;
  /** What it measures, one line. */
  measures: string;
  source: SourceLink;
  /** ISO date of the leaderboard snapshot. */
  snapshot: string;
  caveat?: string;
};

export type ProviderDef = {
  id: ProviderId;
  name: string;
  /** Brand-adjacent hue for consistent coloring (HSL hue 0-360). */
  hue: number;
  /** Shape/glyph so lines are distinguishable without color alone. */
  glyph: string;
  pricingUrl: string;
};

/** Calculator inputs. */
export type WorkloadInput = {
  /** Requests per month. */
  requestsPerMonth: number;
  /** Average input tokens per request (incl. system/context). */
  inputTokens: number;
  /** Average output tokens per request. */
  outputTokens: number;
  /** Fraction of input tokens served from cache, 0..1. */
  cacheHitRate: number;
  /** Fraction of traffic eligible for batch pricing, 0..1. */
  batchShare: number;
};

export type WorkloadPreset = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  input: WorkloadInput;
  /** Feature requirements this workload implies (model must satisfy all). */
  requires: {
    minContextK?: number;
    toolCalling?: boolean;
    structuredOutput?: boolean;
    reasoning?: boolean;
    modalitiesIn?: Modality[];
    /** Minimum score on a benchmark to be considered fit. */
    minBench?: { benchId: string; score: number };
  };
  /** Which benchmark best proxies quality for this workload (scatter default). */
  qualityBench: string;
};

export type CostBreakdown = {
  monthly: number;
  input: number;
  cachedInput: number;
  output: number;
  batchSavings: number;
  perRequest: number;
  /** Null when the model lacks public token pricing. */
  complete: boolean;
};

/** News item about a pricing/catalog change. */
export type NewsItem = {
  /** ISO date. */
  date: string;
  title: string;
  body: string;
  provider: ProviderId | "industry";
  kind: "price-cut" | "price-increase" | "new-model" | "deprecation" | "pricing-change" | "note";
  source?: SourceLink;
  /** Set on cron-generated items so seeded and live items are distinguishable. */
  generated?: boolean;
};

/** Live overlay stored by the daily cron and served by /api/pricing. */
export type LiveSnapshot = {
  updatedAt: string; // ISO datetime
  /** Price overrides keyed by model id; only fields that changed. */
  overrides: Record<string, Partial<ModelPricing> & { lastVerified?: string }>;
  news: NewsItem[];
  /** Model ids the refresh checked and confirmed unchanged. */
  confirmed: string[];
  note?: string;
};
