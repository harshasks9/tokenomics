import { callCost } from "@/lib/pricing";
import { PROFILE, QUALITY_BAR, TIERS, type Tier } from "@/lib/router/tiers";
import {
  FRONTIER_STRATEGIES,
  type CapabilityState,
  type FrontierRequest,
  type FrontierStrategy,
  type FrontierWorkload,
  type GovernanceCapability,
  type WorkflowPhase,
} from "@/lib/frontier/strategies";

export interface ValueWeights {
  quality: number;
  latency: number;
  governance: number;
  cost: number;
}

export const DEFAULT_VALUE_WEIGHTS: ValueWeights = {
  quality: 35,
  latency: 20,
  governance: 30,
  cost: 15,
};

export interface GovernanceBreakdown {
  capability: GovernanceCapability;
  label: string;
  state: CapabilityState;
  score: number;
}

export interface StrategyMetrics {
  strategy: FrontierStrategy;
  cost: number;
  costByPhase: Record<WorkflowPhase, number>;
  p50Latency: number;
  p95Latency: number;
  latencyScore: number;
  quality: number;
  qualityFailures: number;
  failureRate: number;
  escalatedRate: number;
  escalationCost: number;
  governance: number;
  governanceBreakdown: GovernanceBreakdown[];
  businessValue: number;
  valueBreakdown: {
    quality: number;
    latency: number;
    governance: number;
    cost: number;
  };
  feasible: boolean;
}

export type FrontierMetricKey = "quality" | "latency" | "governance" | "businessValue";

interface RoutedRow {
  request: FrontierRequest;
  initialTier: Tier;
  finalTier: Tier;
  initialQuality: number;
  finalQuality: number;
  cost: number;
  latency: number;
  escalated: boolean;
  escalationCost: number;
}

const CAPABILITY_LABELS: Record<GovernanceCapability, string> = {
  identity: "Identity",
  audit: "Audit",
  policy: "Policy & guardrails",
  observability: "Observability",
  evals: "Evaluation",
};

const GOVERNANCE_SCORE: Record<CapabilityState, number> = {
  native: 100,
  assembled: 55,
  absent: 0,
};

function routeRow(request: FrontierRequest, strategy: FrontierStrategy): RoutedRow {
  const initialTier = strategy.route(request);
  const initialQuality = PROFILE[initialTier].quality[request.complexity];
  let finalTier = initialTier;

  if (strategy.qualityGate && initialQuality < QUALITY_BAR) {
    const start = TIERS.indexOf(initialTier);
    finalTier = TIERS.slice(start + 1).find(
      (tier) => PROFILE[tier].quality[request.complexity] >= QUALITY_BAR,
    ) ?? TIERS[TIERS.length - 1];
  }

  const escalated = finalTier !== initialTier;
  const initialCost = callCost(initialTier, request.inTok, request.outTok);
  const finalAttemptCost = callCost(finalTier, request.inTok, request.outTok);
  const cost = escalated ? initialCost + finalAttemptCost : initialCost;
  const latency = PROFILE[initialTier].latencyMs + (escalated ? PROFILE[finalTier].latencyMs : 0);

  return {
    request,
    initialTier,
    finalTier,
    initialQuality,
    finalQuality: PROFILE[finalTier].quality[request.complexity],
    cost,
    latency,
    escalated,
    escalationCost: escalated ? finalAttemptCost : 0,
  };
}

function weightedPercentile(rows: RoutedRow[], percentile: number): number {
  const sorted = [...rows].sort((a, b) => a.latency - b.latency);
  const totalWeight = sorted.reduce((sum, row) => sum + row.request.weight, 0);
  const target = totalWeight * percentile;
  let running = 0;
  for (const row of sorted) {
    running += row.request.weight;
    if (running >= target) return row.latency;
  }
  return sorted.at(-1)?.latency ?? 0;
}

function governanceBreakdown(strategy: FrontierStrategy): GovernanceBreakdown[] {
  return (Object.keys(strategy.governance) as GovernanceCapability[]).map((capability) => ({
    capability,
    label: CAPABILITY_LABELS[capability],
    state: strategy.governance[capability],
    score: GOVERNANCE_SCORE[strategy.governance[capability]],
  }));
}

function baseMetrics(workload: FrontierWorkload, strategy: FrontierStrategy): StrategyMetrics {
  const rows = workload.requests.map((request) => routeRow(request, strategy));
  const totalWeight = rows.reduce((sum, row) => sum + row.request.weight, 0);
  const weighted = (read: (row: RoutedRow) => number) =>
    rows.reduce((sum, row) => sum + read(row) * row.request.weight, 0);
  const costByPhase: Record<WorkflowPhase, number> = { build: 0, run: 0, document: 0, agent: 0 };

  for (const row of rows) {
    costByPhase[row.request.phase] += row.cost * row.request.weight;
  }

  const breakdown = governanceBreakdown(strategy);
  const governance = breakdown.reduce((sum, item) => sum + item.score, 0) / breakdown.length;
  const qualityFailures = rows
    .filter((row) => row.initialQuality < QUALITY_BAR)
    .reduce((sum, row) => sum + row.request.weight, 0);
  const finalFailures = rows
    .filter((row) => row.finalQuality < QUALITY_BAR)
    .reduce((sum, row) => sum + row.request.weight, 0);

  return {
    strategy,
    cost: Object.values(costByPhase).reduce((sum, value) => sum + value, 0),
    costByPhase,
    p50Latency: weightedPercentile(rows, 0.5),
    p95Latency: weightedPercentile(rows, 0.95),
    latencyScore: 0,
    quality: weighted((row) => row.finalQuality) / totalWeight,
    qualityFailures,
    failureRate: qualityFailures / totalWeight * 100,
    escalatedRate: weighted((row) => row.escalated ? 1 : 0) / totalWeight * 100,
    escalationCost: weighted((row) => row.escalationCost),
    governance,
    governanceBreakdown: breakdown,
    businessValue: 0,
    valueBreakdown: { quality: 0, latency: 0, governance: 0, cost: 0 },
    feasible: finalFailures === 0,
  };
}

function normalizeHigher(value: number, min: number, max: number): number {
  if (max === min) return 100;
  return (value - min) / (max - min) * 100;
}

function normalizeLower(value: number, min: number, max: number): number {
  if (max === min) return 100;
  return (max - value) / (max - min) * 100;
}

export function evaluateFrontier(
  workload: FrontierWorkload,
  weights: ValueWeights = DEFAULT_VALUE_WEIGHTS,
): StrategyMetrics[] {
  const metrics = FRONTIER_STRATEGIES.map((strategy) => baseMetrics(workload, strategy));
  const costs = metrics.map((metric) => metric.cost);
  const latencies = metrics.map((metric) => metric.p95Latency);
  const qualities = metrics.map((metric) => metric.quality);
  const totalWeight = weights.quality + weights.latency + weights.governance + weights.cost || 1;

  return metrics.map((metric) => {
    const components = {
      quality: normalizeHigher(metric.quality, Math.min(...qualities), Math.max(...qualities)),
      latency: normalizeLower(metric.p95Latency, Math.min(...latencies), Math.max(...latencies)),
      governance: metric.governance,
      cost: normalizeLower(metric.cost, Math.min(...costs), Math.max(...costs)),
    };
    const businessValue = (
      components.quality * weights.quality +
      components.latency * weights.latency +
      components.governance * weights.governance +
      components.cost * weights.cost
    ) / totalWeight;

    return {
      ...metric,
      latencyScore: components.latency,
      businessValue,
      valueBreakdown: components,
    };
  });
}

export function metricValue(metric: StrategyMetrics, key: FrontierMetricKey): number {
  if (key === "latency") return metric.latencyScore;
  if (key === "governance") return metric.governance;
  if (key === "businessValue") return metric.businessValue;
  return metric.quality;
}

export function paretoFrontier(
  metrics: StrategyMetrics[],
  key: FrontierMetricKey,
  feasibleOnly = false,
): StrategyMetrics[] {
  const candidates = feasibleOnly ? metrics.filter((metric) => metric.feasible) : metrics;
  return candidates
    .filter((candidate) => !candidates.some((other) => {
      if (other.strategy.id === candidate.strategy.id) return false;
      const noMoreCost = other.cost <= candidate.cost;
      const noLessOutcome = metricValue(other, key) >= metricValue(candidate, key);
      const strictlyBetter = other.cost < candidate.cost || metricValue(other, key) > metricValue(candidate, key);
      return noMoreCost && noLessOutcome && strictlyBetter;
    }))
    .sort((a, b) => a.cost - b.cost);
}

export function dominatedBy(
  candidate: StrategyMetrics,
  metrics: StrategyMetrics[],
  key: FrontierMetricKey,
): StrategyMetrics | undefined {
  return metrics
    .filter((other) => other.strategy.id !== candidate.strategy.id)
    .filter((other) => {
      const noMoreCost = other.cost <= candidate.cost;
      const noLessOutcome = metricValue(other, key) >= metricValue(candidate, key);
      const strictlyBetter = other.cost < candidate.cost || metricValue(other, key) > metricValue(candidate, key);
      return noMoreCost && noLessOutcome && strictlyBetter;
    })
    .sort((a, b) => a.cost - b.cost || metricValue(b, key) - metricValue(a, key))[0];
}
