import type {
  AgentRequest,
  Complexity,
  LatencySLA,
  Modality,
  Scenario,
  Sensitivity,
} from "@/lib/router/requests";
import {
  PROFILE,
  QUALITY_BAR,
  TIERS,
  tierCallCost,
  type Tier,
} from "@/lib/router/tiers";

export interface Rule {
  id: string;
  when: Partial<{
    scenario: string;
    taskType: string;
    complexity: Complexity;
    modality: Modality;
    sensitivity: Sensitivity;
    latencySLA: LatencySLA;
  }>;
  route: Tier;
  reason: string;
  locked?: boolean;
}

export interface Policy {
  name: string;
  rules: Rule[];
  fallback: Tier;
}

export type PolicyPreset = "balanced" | "costMin" | "premium";

export const POLICIES: Record<PolicyPreset, Policy> = {
  balanced: {
    name: "Balanced (recommended)",
    fallback: "flash",
    rules: [
      {
        id: "reg",
        when: { sensitivity: "regulated" },
        route: "sonnet",
        reason: "Regulated -> governed tier (audit + guardrails)",
        locked: true,
      },
      {
        id: "hi",
        when: { complexity: "high" },
        route: "opus",
        reason: "High-complexity reasoning earns the premium tier",
      },
      {
        id: "rt",
        when: { latencySLA: "realtime" },
        route: "flashLite",
        reason: "Real-time SLA -> lowest-latency tier",
      },
      {
        id: "mm",
        when: { modality: "image" },
        route: "geminiPro",
        reason: "Native multimodal, low latency",
      },
      {
        id: "voice",
        when: { modality: "audio" },
        route: "flash",
        reason: "Native audio, low latency",
      },
      {
        id: "faq",
        when: { complexity: "low" },
        route: "flashLite",
        reason: "Routine -> cheapest tier",
      },
    ],
  },
  costMin: {
    name: "Cost-min (aggressive)",
    fallback: "flashLite",
    rules: [
      {
        id: "reg",
        when: { sensitivity: "regulated" },
        route: "sonnet",
        reason: "Still governed - cannot be overridden",
        locked: true,
      },
    ],
  },
  premium: {
    name: "All-frontier (baseline)",
    fallback: "opus",
    rules: [],
  },
};

const MULTIMODAL_PRIORITY = ["reg", "mm", "voice", "hi", "rt", "faq"];

export function policyForScenario(preset: PolicyPreset, scenario: Scenario): Policy {
  const source = POLICIES[preset];
  const rules = source.rules.map((rule) => ({ ...rule, when: { ...rule.when } }));

  if (preset === "balanced" && scenario === "multimodal") {
    rules.sort(
      (a, b) => MULTIMODAL_PRIORITY.indexOf(a.id) - MULTIMODAL_PRIORITY.indexOf(b.id),
    );
  }

  return { ...source, rules };
}

function matches(req: AgentRequest, rule: Rule) {
  return Object.entries(rule.when).every(
    ([key, value]) => req[key as keyof AgentRequest] === value,
  );
}

export interface RoutingDecision {
  request: AgentRequest;
  initialTier: Tier;
  finalTier: Tier;
  matchedRuleId: string | null;
  reason: string;
  locked: boolean;
  escalated: boolean;
  tiersEscalated: number;
  initialQuality: number;
  finalQuality: number;
  initialEstimatedCost: number;
  finalRealizedCost: number;
  incrementalEscalationCost: number;
  finalLatencyMs: number;
  governed: boolean;
}

export function route(req: AgentRequest, policy: Policy): RoutingDecision {
  const lockedMatch = policy.rules.find((rule) => rule.locked && matches(req, rule));
  let matchedRule = lockedMatch ?? policy.rules.find((rule) => matches(req, rule));
  let initialTier = matchedRule?.route ?? policy.fallback;
  let reason = matchedRule?.reason ?? `Fallback -> ${policy.fallback}`;
  let locked = Boolean(matchedRule?.locked);

  if (req.sensitivity === "regulated" && !PROFILE[initialTier].governed) {
    const governedFloor = TIERS.find((tier) => PROFILE[tier].governed);
    if (!governedFloor) throw new Error("No governed model tier is configured.");
    initialTier = governedFloor;
    matchedRule = undefined;
    reason = "Regulated -> enforced governed floor";
    locked = true;
  }

  const initialIndex = TIERS.indexOf(initialTier);
  const initialQuality = PROFILE[initialTier].quality[req.complexity];
  let finalTier = initialTier;

  if (initialQuality < QUALITY_BAR) {
    finalTier =
      TIERS.slice(initialIndex + 1).find(
        (tier) => PROFILE[tier].quality[req.complexity] >= QUALITY_BAR,
      ) ?? initialTier;
  }

  const finalIndex = TIERS.indexOf(finalTier);
  const initialEstimatedCost = tierCallCost(initialTier, req.inTok, req.outTok);
  const finalRealizedCost = tierCallCost(finalTier, req.inTok, req.outTok);

  return {
    request: req,
    initialTier,
    finalTier,
    matchedRuleId: matchedRule?.id ?? (locked ? "governance-floor" : null),
    reason,
    locked,
    escalated: finalTier !== initialTier,
    tiersEscalated: Math.max(0, finalIndex - initialIndex),
    initialQuality,
    finalQuality: PROFILE[finalTier].quality[req.complexity],
    initialEstimatedCost,
    finalRealizedCost,
    incrementalEscalationCost: finalRealizedCost - initialEstimatedCost,
    finalLatencyMs: PROFILE[finalTier].latencyMs,
    governed: PROFILE[finalTier].governed,
  };
}

function percentile(values: number[], percentileValue: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(percentileValue * sorted.length) - 1);
  return sorted[Math.max(0, index)];
}

export interface RoutingMetrics {
  decisions: RoutingDecision[];
  blendedCostPerRequest: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  averageFinalQuality: number;
  percentageEscalated: number;
  allFrontierCostPerRequest: number;
  costDeltaVsAllFrontier: number;
  costDeltaPctVsAllFrontier: number;
  wouldHaveShippedQualityFailures: number;
  qualityFailuresAvoided: number;
  laneShare: Record<Tier, number>;
}

export function calculateMetrics(
  requests: AgentRequest[],
  policy: Policy,
): RoutingMetrics {
  const decisions = requests.map((request) => route(request, policy));
  const premiumDecisions = requests.map((request) => route(request, POLICIES.premium));
  const costMinDecisions = requests.map((request) => route(request, POLICIES.costMin));
  const totalCost = decisions.reduce((sum, decision) => sum + decision.finalRealizedCost, 0);
  const allFrontierCost = premiumDecisions.reduce(
    (sum, decision) => sum + decision.finalRealizedCost,
    0,
  );
  const escalated = decisions.filter((decision) => decision.escalated).length;
  const blendedCostPerRequest = totalCost / requests.length;
  const allFrontierCostPerRequest = allFrontierCost / requests.length;
  const laneCounts = Object.fromEntries(TIERS.map((tier) => [tier, 0])) as Record<Tier, number>;
  decisions.forEach((decision) => {
    laneCounts[decision.finalTier] += 1;
  });

  return {
    decisions,
    blendedCostPerRequest,
    p50LatencyMs: percentile(decisions.map((decision) => decision.finalLatencyMs), 0.5),
    p95LatencyMs: percentile(decisions.map((decision) => decision.finalLatencyMs), 0.95),
    averageFinalQuality:
      decisions.reduce((sum, decision) => sum + decision.finalQuality, 0) / requests.length,
    percentageEscalated: (escalated / requests.length) * 100,
    allFrontierCostPerRequest,
    costDeltaVsAllFrontier: allFrontierCostPerRequest - blendedCostPerRequest,
    costDeltaPctVsAllFrontier:
      allFrontierCostPerRequest === 0
        ? 0
        : ((allFrontierCostPerRequest - blendedCostPerRequest) / allFrontierCostPerRequest) * 100,
    wouldHaveShippedQualityFailures: costMinDecisions.filter(
      (decision) => decision.initialQuality < QUALITY_BAR,
    ).length,
    qualityFailuresAvoided: decisions.filter(
      (decision) => decision.initialQuality < QUALITY_BAR && decision.finalQuality >= QUALITY_BAR,
    ).length,
    laneShare: Object.fromEntries(
      TIERS.map((tier) => [tier, (laneCounts[tier] / requests.length) * 100]),
    ) as Record<Tier, number>,
  };
}
