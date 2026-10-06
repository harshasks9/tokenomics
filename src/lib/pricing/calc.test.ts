import { describe, expect, it } from "vitest";
import { blendedPricePerM, estimateCost, unmetRequirements } from "./calc";
import { CATALOG } from "./catalog";
import { WORKLOAD_PRESETS } from "./presets";
import type { Model } from "./types";

const base: Model = {
  id: "t",
  apiId: "t",
  name: "Test",
  provider: "openai",
  family: "t",
  released: "2026-01-01",
  status: "ga",
  servedBy: "test",
  pricing: { input: 2, output: 10, cachedInput: 0.2, batchDiscount: 0.5, longContext: { thresholdK: 200, input: 4, output: 15 } },
  contextK: 1000,
  maxOutputK: 128,
  modalitiesIn: ["text"],
  modalitiesOut: ["text"],
  features: { toolCalling: true, structuredOutput: true, reasoning: "optional", caching: "implicit", batch: true, fineTuning: false },
  deployment: [],
  benchmarks: {},
  tier: "balanced",
  bestFor: [],
  tradeoff: "",
  sources: [],
  lastVerified: "2026-10-06",
  verification: "official",
};

describe("estimateCost", () => {
  it("prices a plain workload: 1M req × (1000 in + 100 out)", () => {
    const c = estimateCost(base, { requestsPerMonth: 1_000_000, inputTokens: 1000, outputTokens: 100, cacheHitRate: 0, batchShare: 0 });
    // input: 1000M tokens = 1000 × $2 = $2000; output: 100M = 100 × $10 = $1000
    expect(c.monthly).toBeCloseTo(3000, 6);
    expect(c.perRequest).toBeCloseTo(0.003, 9);
    expect(c.complete).toBe(true);
  });

  it("applies cached-input pricing to the hit share", () => {
    const c = estimateCost(base, { requestsPerMonth: 1_000_000, inputTokens: 1000, outputTokens: 0, cacheHitRate: 0.5, batchShare: 0 });
    // 500M fresh × $2 = $1000; 500M cached × $0.2 = $100
    expect(c.input).toBeCloseTo(1000, 6);
    expect(c.cachedInput).toBeCloseTo(100, 6);
    expect(c.monthly).toBeCloseTo(1100, 6);
  });

  it("falls back to full price when no cached rate is published", () => {
    const m = { ...base, pricing: { ...base.pricing, cachedInput: null } };
    const c = estimateCost(m, { requestsPerMonth: 1_000_000, inputTokens: 1000, outputTokens: 0, cacheHitRate: 0.5, batchShare: 0 });
    expect(c.monthly).toBeCloseTo(2000, 6);
  });

  it("ignores cache hits for models without caching", () => {
    const m = { ...base, features: { ...base.features, caching: "none" as const } };
    const c = estimateCost(m, { requestsPerMonth: 1_000_000, inputTokens: 1000, outputTokens: 0, cacheHitRate: 0.9, batchShare: 0 });
    expect(c.monthly).toBeCloseTo(2000, 6);
  });

  it("applies the batch discount to the eligible share only", () => {
    const c = estimateCost(base, { requestsPerMonth: 1_000_000, inputTokens: 1000, outputTokens: 100, cacheHitRate: 0, batchShare: 0.5 });
    // gross 3000; 50% eligible × 50% off = 750 savings
    expect(c.batchSavings).toBeCloseTo(750, 6);
    expect(c.monthly).toBeCloseTo(2250, 6);
  });

  it("ignores batch for models without a batch tier", () => {
    const m = { ...base, features: { ...base.features, batch: false } };
    const c = estimateCost(m, { requestsPerMonth: 1_000_000, inputTokens: 1000, outputTokens: 100, cacheHitRate: 0, batchShare: 1 });
    expect(c.monthly).toBeCloseTo(3000, 6);
  });

  it("switches to the long-context tier when average input exceeds the threshold", () => {
    const c = estimateCost(base, { requestsPerMonth: 1000, inputTokens: 250_000, outputTokens: 1000, cacheHitRate: 0, batchShare: 0 });
    // 250M input × $4 = 1000; 1M output × $15 = 15
    expect(c.monthly).toBeCloseTo(1015, 6);
  });

  it("marks models without public pricing as incomplete", () => {
    const m = { ...base, pricing: { ...base.pricing, input: null } };
    expect(estimateCost(m, WORKLOAD_PRESETS[0].input).complete).toBe(false);
  });

  it("blended price equals monthly cost over total tokens", () => {
    const w = { requestsPerMonth: 1_000_000, inputTokens: 1000, outputTokens: 100, cacheHitRate: 0, batchShare: 0 };
    expect(blendedPricePerM(base, w)).toBeCloseTo(3000 / 1100, 9);
  });
});

describe("unmetRequirements", () => {
  it("flags missing context, features and modalities", () => {
    const m = { ...base, contextK: 32, modalitiesIn: ["text"] as Model["modalitiesIn"], features: { ...base.features, reasoning: "none" as const } };
    const preset = WORKLOAD_PRESETS.find((p) => p.id === "coding")!;
    const fails = unmetRequirements(m, preset);
    expect(fails).toContain("context < 200k");
    expect(fails).toContain("no reasoning mode");
  });
  it("passes a fully capable model", () => {
    expect(unmetRequirements(base, WORKLOAD_PRESETS.find((p) => p.id === "agents")!)).toEqual([]);
  });
});

describe("catalog integrity", () => {
  it("has unique ids and api ids", () => {
    const ids = CATALOG.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const api = CATALOG.map((m) => m.apiId);
    expect(new Set(api).size).toBe(api.length);
  });
  it("every model has sources and a verification level", () => {
    for (const m of CATALOG) {
      expect(m.sources.length, m.id).toBeGreaterThan(0);
      expect(["official", "indexed", "secondary"]).toContain(m.verification);
      expect(m.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("output is never cheaper than input where both are published", () => {
    for (const m of CATALOG) {
      if (m.pricing.input != null && m.pricing.output != null) expect(m.pricing.output, m.id).toBeGreaterThanOrEqual(m.pricing.input);
      if (m.pricing.cachedInput != null && m.pricing.input != null) expect(m.pricing.cachedInput, m.id).toBeLessThanOrEqual(m.pricing.input);
    }
  });
  it("benchmark ids reference known benchmarks", () => {
    const known = new Set(["aa-index", "lmarena", "gpqa", "swe-verified", "aime", "mmlu-pro"]);
    for (const m of CATALOG) for (const k of Object.keys(m.benchmarks)) expect(known.has(k), `${m.id}:${k}`).toBe(true);
  });
});
