// FrontierOps — the optimization engine. Every dollar figure in the UI comes
// out of these functions: monthly cost from token math, the per-workload
// frontier configuration, gap attribution (waterfall), ranked recommendations
// and the four migration-simulator scenarios.

import { MODELS, ModelOption, modelById, blendedPrice, paretoFrontier, Cloud, cloudLabel } from "./catalog";
import { WORKLOADS, Workload, Sla, dailySeries } from "./workloads";

export const DAYS = 30;
const OPTIMAL_CACHE_HIT = 0.8;
const COMMITTED_TARGET_UTIL = 0.85;
/** monthly PayGo spend above which committed capacity is worth operating */
const COMMITTED_MIN_MONTHLY = 25_000;

const SLA_TTFT_LIMIT: Record<Sla, number> = {
  realtime: 600,
  interactive: 1_500,
  batch: Infinity,
};

export interface Levers {
  cacheHitRate: number;
  batchShare: number;
  capacity: { type: "paygo" | "committed"; utilization: number };
}

export interface Config {
  model: ModelOption;
  cloud: Cloud;
  levers: Levers;
}

export interface CostBreakdown {
  monthly: number;
  inputCost: number;
  cachedSavings: number; // vs paying full input price
  batchSavings: number;
  idleCost: number; // committed capacity paid for but not consumed
  effPerMTok: number; // effective $ per 1M total tokens
}

export function tokensPerMonth(w: Workload) {
  const inTok = w.reqPerDay * w.inTokPerReq * DAYS;
  const outTok = w.reqPerDay * w.outTokPerReq * DAYS;
  return { inTok, outTok, total: inTok + outTok };
}

export function costOf(w: Workload, model: ModelOption, levers: Levers): CostBreakdown {
  const { inTok, outTok, total } = tokensPerMonth(w);
  const cachedShare = model.supportsCaching ? w.cacheEligible * levers.cacheHitRate : 0;
  const inputCost =
    (inTok * ((1 - cachedShare) * model.inPrice + cachedShare * model.cachedInPrice)) / 1e6;
  const outputCost = (outTok * model.outPrice) / 1e6;
  const preBatch = inputCost + outputCost;
  const batchFactor = 1 - levers.batchShare * (1 - model.batchFactor);
  let monthly = preBatch * batchFactor;
  const batchSavings = preBatch - monthly;
  let idleCost = 0;
  if (levers.capacity.type === "committed") {
    const util = Math.max(0.05, levers.capacity.utilization);
    const committed = (monthly * (1 - model.committedDiscount)) / util;
    idleCost = committed * (1 - util);
    monthly = committed;
  }
  const fullInput = (inTok * model.inPrice) / 1e6;
  return {
    monthly,
    inputCost,
    cachedSavings: (fullInput - inputCost) * batchFactor,
    batchSavings,
    idleCost,
    effPerMTok: (monthly / total) * 1e6,
  };
}

export const currentLevers = (w: Workload): Levers => ({
  cacheHitRate: w.cacheHitRate,
  batchShare: w.batchShare,
  capacity: w.capacity,
});

/** Best levers for a given workload/model pair (what a diligent team would run). */
export function optimalLevers(w: Workload, model: ModelOption): Levers {
  const base: Levers = {
    cacheHitRate: model.supportsCaching ? Math.max(w.cacheHitRate, OPTIMAL_CACHE_HIT) : 0,
    batchShare: Math.max(w.batchShare, w.batchPotential),
    capacity: { type: "paygo", utilization: 1 },
  };
  const paygo = costOf(w, model, base).monthly;
  if (paygo > COMMITTED_MIN_MONTHLY) {
    const committed: Levers = {
      ...base,
      capacity: { type: "committed", utilization: COMMITTED_TARGET_UTIL },
    };
    if (costOf(w, model, committed).monthly < paygo) return committed;
  }
  return base;
}

export function candidateModels(w: Workload, opts?: { sameCloud?: boolean; floorDelta?: number }) {
  const floor = w.qualityFloor + (opts?.floorDelta ?? 0);
  return MODELS.filter(
    (m) =>
      m.quality >= floor &&
      m.ttftMs <= SLA_TTFT_LIMIT[w.sla] &&
      (!opts?.sameCloud || m.clouds.includes(w.cloud)),
  );
}

function cloudFor(w: Workload, m: ModelOption): Cloud {
  return m.clouds.includes(w.cloud) ? w.cloud : m.clouds[0];
}

/** Cheapest config meeting the workload's quality floor and latency SLA. */
export function frontierConfig(w: Workload, opts?: { sameCloud?: boolean; floorDelta?: number }): Config & CostBreakdown {
  const candidates = candidateModels(w, opts);
  const pool = candidates.length ? candidates : [modelById(w.modelId)];
  let best: (Config & CostBreakdown) | null = null;
  for (const m of pool) {
    const levers = optimalLevers(w, m);
    const cost = costOf(w, m, levers);
    if (!best || cost.monthly < best.monthly - 1e-6) {
      best = { model: m, cloud: cloudFor(w, m), levers, ...cost };
    }
  }
  return best!;
}

export type Tier = "frontier" | "near" | "opportunity" | "severe";

export const TIER_META: Record<Tier, { label: string; icon: string }> = {
  frontier: { label: "Frontier Efficient", icon: "●" },
  near: { label: "Near Frontier", icon: "◐" },
  opportunity: { label: "Optimization Opportunity", icon: "◔" },
  severe: { label: "Severely Inefficient", icon: "○" },
};

export interface Assessment {
  w: Workload;
  model: ModelOption;
  current: CostBreakdown;
  frontier: Config & CostBreakdown;
  gapMonthly: number;
  efficiency: number; // frontier cost / current cost, 0..1
  tier: Tier;
  spark: number[];
  costPerTask: number;
}

export function assess(w: Workload): Assessment {
  const model = modelById(w.modelId);
  const current = costOf(w, model, currentLevers(w));
  const frontier = frontierConfig(w);
  const efficiency = Math.min(1, frontier.monthly / current.monthly);
  const tier: Tier =
    efficiency >= 0.85 ? "frontier" : efficiency >= 0.65 ? "near" : efficiency >= 0.4 ? "opportunity" : "severe";
  return {
    w,
    model,
    current,
    frontier,
    gapMonthly: current.monthly - frontier.monthly,
    efficiency,
    tier,
    spark: dailySeries(w.id, current.monthly / DAYS),
    costPerTask: current.monthly / (w.reqPerDay * DAYS * w.successRate),
  };
}

export const ASSESSMENTS: Assessment[] = WORKLOADS.map(assess).sort(
  (a, b) => b.current.monthly - a.current.monthly,
);

// ---------------------------------------------------------------- portfolio

export interface Portfolio {
  monthlySpend: number;
  annualSpend: number;
  monthlyGap: number;
  annualGap: number;
  score: number; // 0-100 spend-weighted pareto efficiency
  tokens: number;
  requests: number;
  effPerMTok: number;
  deployments: number;
  clouds: number;
  tierSpend: Record<Tier, number>;
  tierCount: Record<Tier, number>;
  cacheHitBlended: number;
  batchShareBlended: number;
}

export function portfolio(items: Assessment[] = ASSESSMENTS): Portfolio {
  const monthlySpend = items.reduce((s, a) => s + a.current.monthly, 0);
  const monthlyGap = items.reduce((s, a) => s + a.gapMonthly, 0);
  const tokens = items.reduce((s, a) => s + tokensPerMonth(a.w).total, 0);
  const requests = items.reduce((s, a) => s + a.w.reqPerDay * DAYS, 0);
  const tierSpend = { frontier: 0, near: 0, opportunity: 0, severe: 0 } as Record<Tier, number>;
  const tierCount = { frontier: 0, near: 0, opportunity: 0, severe: 0 } as Record<Tier, number>;
  for (const a of items) {
    tierSpend[a.tier] += a.current.monthly;
    tierCount[a.tier] += 1;
  }
  const inTok = items.reduce((s, a) => s + tokensPerMonth(a.w).inTok, 0);
  const cachedTok = items.reduce(
    (s, a) => s + tokensPerMonth(a.w).inTok * a.w.cacheEligible * a.w.cacheHitRate,
    0,
  );
  return {
    monthlySpend,
    annualSpend: monthlySpend * 12,
    monthlyGap,
    annualGap: monthlyGap * 12,
    score: Math.round(((monthlySpend - monthlyGap) / monthlySpend) * 100),
    tokens,
    requests,
    effPerMTok: (monthlySpend / tokens) * 1e6,
    deployments: items.length,
    clouds: new Set(items.map((a) => a.w.cloud)).size,
    tierSpend,
    tierCount,
    cacheHitBlended: cachedTok / inTok,
    batchShareBlended:
      items.reduce((s, a) => s + a.w.batchShare * a.current.monthly, 0) / monthlySpend,
  };
}

export const PORTFOLIO = portfolio();

// ------------------------------------------------------------ gap waterfall

export type LeverKind = "capacity" | "caching" | "batching" | "substitution";

export const LEVER_META: Record<LeverKind, { label: string; desc: string }> = {
  capacity: { label: "Capacity rightsizing", desc: "Fix idle PTU/GSU commitments or move low-util workloads to PayGo" },
  caching: { label: "Prompt caching", desc: "Cache stable system prompts, tools and RAG context prefixes" },
  batching: { label: "Batch & off-peak", desc: "Move latency-tolerant traffic to 50%-off batch/deferred pricing" },
  substitution: { label: "Model substitution", desc: "Re-place workloads on the cheapest model that clears their quality floor" },
};

/**
 * Sequential attribution of each workload's gap: capacity → caching →
 * batching → substitution. Steps sum exactly to the total monthly gap.
 */
export function gapAttribution(a: Assessment): Record<LeverKind, number> {
  const m = a.model;
  const l0 = currentLevers(a.w);
  const c0 = a.current.monthly;
  const l1: Levers = { ...l0, capacity: bestCapacity(a.w, m, l0) };
  const c1 = costOf(a.w, m, l1).monthly;
  const l2: Levers = {
    ...l1,
    cacheHitRate: m.supportsCaching ? Math.max(l1.cacheHitRate, OPTIMAL_CACHE_HIT) : l1.cacheHitRate,
  };
  const c2 = costOf(a.w, m, l2).monthly;
  const l3: Levers = { ...l2, batchShare: Math.max(l2.batchShare, a.w.batchPotential) };
  const c3 = costOf(a.w, m, l3).monthly;
  return {
    capacity: Math.max(0, c0 - c1),
    caching: Math.max(0, c1 - c2),
    batching: Math.max(0, c2 - c3),
    substitution: Math.max(0, c3 - a.frontier.monthly),
  };
}

function bestCapacity(w: Workload, m: ModelOption, levers: Levers): Levers["capacity"] {
  if (levers.capacity.type !== "committed") return levers.capacity;
  const paygo = costOf(w, m, { ...levers, capacity: { type: "paygo", utilization: 1 } }).monthly;
  const tuned = costOf(w, m, {
    ...levers,
    capacity: { type: "committed", utilization: COMMITTED_TARGET_UTIL },
  }).monthly;
  return tuned < paygo && paygo > COMMITTED_MIN_MONTHLY
    ? { type: "committed", utilization: COMMITTED_TARGET_UTIL }
    : { type: "paygo", utilization: 1 };
}

export const WATERFALL = (() => {
  const buckets: Record<LeverKind, number> = { capacity: 0, caching: 0, batching: 0, substitution: 0 };
  for (const a of ASSESSMENTS) {
    const g = gapAttribution(a);
    (Object.keys(g) as LeverKind[]).forEach((k) => (buckets[k] += g[k]));
  }
  return buckets;
})();

// ----------------------------------------------------------- recommendations

export type Effort = "Low" | "Medium" | "High";
export type Confidence = "High" | "Medium" | "Low";

export interface Recommendation {
  id: string;
  a: Assessment;
  kind: LeverKind | "routing" | "prompt";
  title: string;
  current: string;
  proposed: string;
  monthlySavings: number;
  qualityDelta: number; // index points, negative = quality drops (still ≥ floor)
  ttftDelta: number; // ms, negative = faster
  effort: Effort;
  confidence: Confidence;
  detail: string;
  /** true = savings beyond the frontier gap (app-layer work) */
  beyondFrontier?: boolean;
}

function substitutionEffort(a: Assessment, target: ModelOption): Effort {
  if (target.id === a.model.id) return "Low";
  if (target.vendor === a.model.vendor) return "Low";
  return a.w.useCase === "Agentic workflow" || a.w.qualityFloor >= 86 ? "High" : "Medium";
}

export function recommendationsFor(a: Assessment): Recommendation[] {
  const recs: Recommendation[] = [];
  const g = gapAttribution(a);
  const w = a.w;
  const f = a.frontier;

  if (g.capacity > 100) {
    const to = f.levers.capacity.type === "committed"
      ? `Committed capacity at ${Math.round(COMMITTED_TARGET_UTIL * 100)}% utilization`
      : "PayGo (on-demand)";
    recs.push({
      id: `${w.id}-capacity`, a, kind: "capacity",
      title: "Rightsize committed capacity",
      current: `Committed (PTU/GSU) at ${Math.round(w.capacity.utilization * 100)}% utilization`,
      proposed: to,
      monthlySavings: g.capacity, qualityDelta: 0, ttftDelta: 0,
      effort: "Low", confidence: "High",
      detail: `${Math.round((1 - w.capacity.utilization) * 100)}% of the provisioned throughput is paid for but idle. Resize the reservation or fall back to on-demand.`,
    });
  }
  if (g.caching > 100) {
    recs.push({
      id: `${w.id}-caching`, a, kind: "caching",
      title: "Enable / extend prompt caching",
      current: `${Math.round(w.cacheEligible * w.cacheHitRate * 100)}% of input tokens served from cache`,
      proposed: `~${Math.round(w.cacheEligible * OPTIMAL_CACHE_HIT * 100)}% cached (structure prompts, pin stable prefix)`,
      monthlySavings: g.caching, qualityDelta: 0, ttftDelta: -80,
      effort: "Low", confidence: "High",
      detail: `${Math.round(w.cacheEligible * 100)}% of this workload's context is a stable prefix (system prompt, tools, corpus). Cached input is ~${Math.round((1 - a.model.cachedInPrice / a.model.inPrice) * 100)}% cheaper on ${a.model.name}.`,
    });
  }
  if (g.batching > 100) {
    recs.push({
      id: `${w.id}-batching`, a, kind: "batching",
      title: "Move deferred traffic to batch pricing",
      current: `${Math.round(w.batchShare * 100)}% on batch tier`,
      proposed: `${Math.round(w.batchPotential * 100)}% on batch tier (50% off)`,
      monthlySavings: g.batching, qualityDelta: 0, ttftDelta: 0,
      effort: w.batchPotential - w.batchShare > 0.5 ? "Medium" : "Low", confidence: "High",
      detail: "Latency-tolerant traffic (nightly runs, digests, enrichment) qualifies for the 50%-off batch/deferred tier with a queue-based pipeline.",
    });
  }
  if (g.substitution > 100 && f.model.id !== a.model.id) {
    recs.push({
      id: `${w.id}-substitution`, a, kind: "substitution",
      title: `Migrate to ${f.model.name}`,
      current: `${a.model.name} · ${cloudLabel(w.cloud)}`,
      proposed: `${f.model.name} · ${cloudLabel(f.cloud)}`,
      monthlySavings: g.substitution,
      qualityDelta: f.model.quality - a.model.quality,
      ttftDelta: f.model.ttftMs - a.model.ttftMs,
      effort: substitutionEffort(a, f.model),
      confidence: f.model.quality - w.qualityFloor >= 4 ? "High" : "Medium",
      detail: `${f.model.name} clears this workload's quality floor (${w.qualityFloor}) at ${f.model.quality} on the blended eval, at ${Math.round((1 - blendedPrice(f.model) / blendedPrice(a.model)) * 100)}% lower list price. Re-run the workload's eval suite before cutover.`,
    });
  }
  // Beyond-frontier: difficulty-aware routing when quality headroom is large.
  const headroom = f.model.quality - w.qualityFloor;
  if (headroom >= 6) {
    const cheap = candidateModels(w, { floorDelta: -6 })
      .filter((m) => blendedPrice(m) < blendedPrice(f.model) * 0.8)
      .sort((x, y) => blendedPrice(x) - blendedPrice(y))[0];
    if (cheap) {
      const routedShare = 0.6;
      const cheapCost = costOf(w, cheap, optimalLevers(w, cheap)).monthly;
      const savings = routedShare * (f.monthly - cheapCost);
      if (savings > 200) {
        recs.push({
          id: `${w.id}-routing`, a, kind: "routing",
          title: `Route easy traffic to ${cheap.name}`,
          current: `100% of requests on ${f.model.name}`,
          proposed: `~${routedShare * 100}% routed to ${cheap.name}, escalation on low confidence`,
          monthlySavings: savings, qualityDelta: -1, ttftDelta: Math.min(0, cheap.ttftMs - f.model.ttftMs),
          effort: "Medium", confidence: "Medium", beyondFrontier: true,
          detail: "A difficulty classifier + confidence-based escalation keeps hard requests on the frontier model while the long tail runs on the efficient tier.",
        });
      }
    }
  }
  if (w.verbosePrompts) {
    const trim = 0.22;
    const savings = a.current.inputCost * trim * (1 - w.batchShare * 0.5);
    if (savings > 200) {
      recs.push({
        id: `${w.id}-prompt`, a, kind: "prompt",
        title: "Trim prompt & retrieved context",
        current: `${(w.inTokPerReq / 1000).toFixed(1)}K input tokens/request, ${Math.round(w.contextUtil * 100)}% context utilization`,
        proposed: `~${((w.inTokPerReq * (1 - trim)) / 1000).toFixed(1)}K tokens/request (dedupe boilerplate, rerank retrieval)`,
        monthlySavings: savings, qualityDelta: 0, ttftDelta: -60,
        effort: "Medium", confidence: "Medium", beyondFrontier: true,
        detail: "Prompt audit found repeated boilerplate and low-relevance retrieved chunks; reranking + prompt compression cuts ~22% of input tokens with flat eval scores.",
      });
    }
  }
  return recs.sort((x, y) => y.monthlySavings - x.monthlySavings);
}

export const RECOMMENDATIONS: Recommendation[] = ASSESSMENTS.flatMap(recommendationsFor).sort(
  (x, y) => y.monthlySavings - x.monthlySavings,
);

// ----------------------------------------------------------------- simulator

export type ScenarioId = "in-place" | "economics" | "performance" | "balanced";

export const SCENARIOS: { id: ScenarioId; label: string; desc: string }[] = [
  { id: "in-place", label: "Optimize in Place", desc: "Keep every workload on its current cloud; apply caching, batching, capacity and same-cloud model swaps only." },
  { id: "economics", label: "Best Economics", desc: "Cheapest model/cloud/config that still clears each workload's quality floor and latency SLA." },
  { id: "performance", label: "Best Performance", desc: "Highest quality attainable without exceeding today's cost, using optimized levers." },
  { id: "balanced", label: "Balanced Pareto", desc: "Cheapest config that clears the floor with a +3 quality margin — savings with headroom." },
];

export interface Move {
  a: Assessment;
  to: Config & CostBreakdown;
  effort: Effort;
  risks: string[];
}

export interface ScenarioResult {
  id: ScenarioId;
  moves: Move[];
  costNow: number;
  costAfter: number;
  qualityNow: number; // spend-weighted
  qualityAfter: number;
  ttftNow: number; // request-weighted
  ttftAfter: number;
  oneTimeCost: number;
  paybackMonths: number;
  roiPct: number; // year-1
}

const EFFORT_COST: Record<Effort, number> = { Low: 8_000, Medium: 30_000, High: 75_000 };

/** Keep the current model (with optimized levers) unless a swap saves ≥ 3%. */
function preferStay(a: Assessment, target: Config & CostBreakdown): Config & CostBreakdown {
  if (target.model.id === a.model.id) return target;
  const stayLevers = optimalLevers(a.w, a.model);
  const stay = costOf(a.w, a.model, stayLevers);
  if (target.monthly > stay.monthly * 0.97) {
    return { model: a.model, cloud: a.w.cloud, levers: stayLevers, ...stay };
  }
  return target;
}

function scenarioTarget(a: Assessment, id: ScenarioId): Config & CostBreakdown {
  const w = a.w;
  if (id === "in-place") return preferStay(a, frontierConfig(w, { sameCloud: true }));
  if (id === "economics") return preferStay(a, a.frontier);
  if (id === "balanced") {
    const withMargin = frontierConfig(w, { floorDelta: 3 });
    return preferStay(a, withMargin.model.quality >= w.qualityFloor ? withMargin : a.frontier);
  }
  // performance: max quality with monthly cost ≤ current
  let best: (Config & CostBreakdown) | null = null;
  for (const m of candidateModels(w)) {
    const levers = optimalLevers(w, m);
    const cost = costOf(w, m, levers);
    if (cost.monthly <= a.current.monthly * 1.001) {
      if (!best || m.quality > best.model.quality ||
          (m.quality === best.model.quality && cost.monthly < best.monthly)) {
        best = { model: m, cloud: m.clouds.includes(w.cloud) ? w.cloud : m.clouds[0], levers, ...cost };
      }
    }
  }
  return best ?? a.frontier;
}

function moveRisks(a: Assessment, to: Config): string[] {
  const risks: string[] = [];
  if (to.model.vendor !== a.model.vendor) risks.push("Cross-vendor prompt & tool-call porting; re-run eval suite");
  if (to.cloud !== a.w.cloud) risks.push(`Data egress & IAM review for ${cloudLabel(a.w.cloud)} → ${cloudLabel(to.cloud)}`);
  if (to.model.quality < a.model.quality) risks.push(`Quality index ${a.model.quality} → ${to.model.quality} (floor ${a.w.qualityFloor}) — canary 10% first`);
  if (to.levers.capacity.type === "committed") risks.push("Committed capacity: right-size reservation after 2 weeks of live traffic");
  if (a.w.sla === "realtime") risks.push("Real-time SLA: load-test TTFT p95 before cutover");
  return risks;
}

export function runScenario(id: ScenarioId, items: Assessment[]): ScenarioResult {
  const moves: Move[] = items.map((a) => {
    const to = scenarioTarget(a, id);
    return { a, to, effort: substitutionEffort(a, to.model), risks: moveRisks(a, to) };
  });
  const costNow = items.reduce((s, a) => s + a.current.monthly, 0);
  const costAfter = moves.reduce((s, m) => s + m.to.monthly, 0);
  const spendW = (f: (m: Move) => number) =>
    moves.reduce((s, m) => s + f(m) * m.a.current.monthly, 0) / Math.max(1, costNow);
  const reqTotal = items.reduce((s, a) => s + a.w.reqPerDay, 0);
  const reqW = (f: (m: Move) => number) =>
    moves.reduce((s, m) => s + f(m) * m.a.w.reqPerDay, 0) / Math.max(1, reqTotal);
  const changed = moves.filter((m) => m.to.model.id !== m.a.model.id);
  const oneTime =
    changed.reduce((s, m) => s + EFFORT_COST[m.effort], 0) +
    moves.filter((m) => m.to.model.id === m.a.model.id && m.to.monthly < m.a.current.monthly - 100).length * 4_000;
  const monthlySavings = costNow - costAfter;
  return {
    id,
    moves: moves.sort((x, y) => (y.a.current.monthly - y.to.monthly) - (x.a.current.monthly - x.to.monthly)),
    costNow,
    costAfter,
    qualityNow: spendW((m) => m.a.model.quality),
    qualityAfter: spendW((m) => m.to.model.quality),
    ttftNow: reqW((m) => m.a.model.ttftMs),
    ttftAfter: reqW((m) => m.to.model.ttftMs),
    oneTimeCost: oneTime,
    paybackMonths: monthlySavings > 0 ? oneTime / monthlySavings : Infinity,
    roiPct: oneTime > 0 ? ((monthlySavings * 12 - oneTime) / oneTime) * 100 : 0,
  };
}

// ------------------------------------------------------------ chart helpers

export const FRONTIER_MODELS = paretoFrontier();
/** every catalog model, plotted as context marks on the frontier chart */
export const MODEL_POINTS = MODELS;

/** Daily spend by cloud for the stacked trend chart (30 days). */
export const DAILY_BY_CLOUD: { cloud: Cloud; days: number[] }[] = (() => {
  const byCloud = new Map<Cloud, number[]>();
  for (const a of ASSESSMENTS) {
    const days = dailySeries(a.w.id, a.current.monthly / DAYS);
    const acc = byCloud.get(a.w.cloud) ?? new Array(DAYS).fill(0);
    days.forEach((v, i) => (acc[i] += v));
    byCloud.set(a.w.cloud, acc);
  }
  return [...byCloud.entries()].map(([cloud, days]) => ({ cloud, days }));
})();
