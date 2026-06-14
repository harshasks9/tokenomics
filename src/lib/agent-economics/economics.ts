import { APPROACHES, APPROACH_META, ownershipFor, stackSummary } from "./approaches";
import type {
  Activity,
  Approach,
  ApproachEconomics,
  CapabilityAssessment,
  Complexity,
  CostBucket,
  CostLine,
  DecisionBrief,
  EconomicAssumptions,
  EstateProfile,
} from "./types";

const COMPLEXITY_WEIGHT: Record<Complexity, number> = { assist: 1, act: 1.8, orchestrate: 2.8 };
const CLASS_WEIGHT = { personal: 0.55, internal: 1.15, customer: 1.8 } as const;
const ACTIVITY_WEIGHT: Record<Activity, number> = { low: 0.65, moderate: 1, high: 1.65 };

export const DEFAULT_ASSUMPTIONS: EconomicAssumptions = {
  engineeringRateK: 18,
  existingToolCredit: 0.2,
  discounts: { geap: 0.1, claude: 0.1, openai: 0.1 },
};

export function weightedAgentUnits(profile: EstateProfile) {
  return (Object.keys(CLASS_WEIGHT) as (keyof typeof CLASS_WEIGHT)[]).reduce((sum, key) => {
    const item = profile[key];
    return sum + item.count * CLASS_WEIGHT[key] * COMPLEXITY_WEIGHT[item.complexity];
  }, 0);
}

const round = (value: number) => Math.round(value * 10) / 10;

function line(
  bucket: CostBucket,
  label: string,
  quantity: number,
  unit: string,
  rateK: number,
  annual: boolean,
  status: CostLine["status"],
  formula: string,
): CostLine {
  return { bucket, label, quantity: round(quantity), unit, rateK: round(rateK), annual, amountK: round(quantity * rateK), status, formula };
}

function calculateApproach(
  approach: Approach,
  profile: EstateProfile,
  capabilities: CapabilityAssessment[],
  assumptions: EconomicAssumptions,
): ApproachEconomics {
  const units = Math.max(0.5, weightedAgentUnits(profile));
  const activity = ACTIVITY_WEIGHT[profile.activity];
  const scope = capabilities.filter((capability) => capability.status === "required");
  const required = scope.length;
  const perAgent = scope.filter((capability) => capability.reuse === "per-agent").length;
  const stack = stackSummary(approach, scope);
  const externalProducts = scope.filter((capability) => ownershipFor(approach, capability.id) === "Third-party product").length;
  const discount = 1 - assumptions.discounts[approach];
  const credit = approach === "geap" ? 0 : assumptions.existingToolCredit;

  const modelRate = approach === "geap" ? 4.8 : approach === "claude" ? 5.4 : 5.1;
  const platformRate = approach === "geap" ? 5.8 : approach === "claude" ? 1.6 : 2.1;
  const cloudRate = approach === "geap" ? 0.8 : approach === "claude" ? 3.8 : 3.5;
  const externalBase = approach === "geap" ? 10 : approach === "claude" ? 48 : 44;
  const setupMonths = approach === "geap"
    ? 2.5 + stack.integrationBoundaries * 0.35 + perAgent * 0.08
    : 1 + stack.integrationBoundaries * 0.7 + perAgent * 0.14;
  const operatingFte = approach === "geap"
    ? 0.45 + required * 0.02 + units * 0.005
    : 0.25 + stack.integrationBoundaries * 0.07 + required * 0.018 + units * 0.007;

  const lines: CostLine[] = [
    line("Model inference", `${APPROACH_META[approach].shortName} model usage`, units * activity, "weighted agent-unit/year", modelRate * discount, true, "ASSUMPTION", "weighted units x activity x model usage rate x contract factor"),
    line("Agent platform & runtime", approach === "geap" ? "Integrated agent services" : "First-party agent components", units * activity, "weighted agent-unit/year", platformRate * discount, true, approach === "geap" ? "ASSUMPTION" : "QUOTE REQUIRED", "weighted units x activity x platform/runtime rate x contract factor"),
    line("Agent platform & runtime", approach === "geap" ? "Shared platform access and control plane" : "API account and shared service baseline", 1, "estate/year", (approach === "geap" ? 75 : 8) * discount, true, approach === "geap" ? "QUOTE REQUIRED" : "ASSUMPTION", "annual shared platform or account baseline x contract factor"),
    line("Hyperscaler infrastructure", approach === "geap" ? "Residual cloud services" : "Runtime, storage, logging, and network", units * activity, "weighted agent-unit/year", cloudRate * (1 - credit * 0.25), true, "ASSUMPTION", "weighted units x activity x cloud rate, adjusted for owned tooling"),
    line("External products & licenses", approach === "geap" ? "Specialist tools outside the platform" : "Data, guardrail, evaluation, and observability stack", externalProducts, "external product/year", externalBase * (1 - credit) * discount, true, approach === "geap" ? "ASSUMPTION" : "QUOTE REQUIRED", "required external products x blended license range x existing-tool credit x contract factor"),
    line("Initial build & integration", "Architecture, security integration, and onboarding", setupMonths, "engineer-month", assumptions.engineeringRateK, false, "ASSUMPTION", "estimated engineer-months x loaded engineering rate"),
    line("Ongoing governance & operations", "Platform, evaluation, FinOps, and incident ownership", operatingFte * 12, "engineer-month/year", assumptions.engineeringRateK, true, "ASSUMPTION", "operating FTE x 12 x loaded engineering rate"),
  ];

  const oneTime = lines.filter((item) => !item.annual).reduce((sum, item) => sum + item.amountK, 0);
  const recurring = lines.filter((item) => item.annual).reduce((sum, item) => sum + item.amountK, 0);
  const yearOneK = round(oneTime + recurring);
  const threeYearK = round(oneTime + recurring * 3);
  const uncertainty = approach === "geap" ? { low: 0.82, high: 1.22 } : { low: 0.75, high: 1.32 };
  const complexityDelay = profile.customer.complexity === "orchestrate" && profile.customer.count > 0 ? 4 : 0;
  const regulationDelay = profile.sensitivity === "regulated" ? 4 : profile.sensitivity === "sensitive" ? 2 : 0;
  const weeksToProduction = Math.round((approach === "geap" ? 5 : 7) + stack.integrationBoundaries * (approach === "geap" ? 0.7 : 1.8) + complexityDelay + regulationDelay);

  return {
    approach,
    lines,
    yearOneK,
    threeYearK,
    range: { lowK: round(yearOneK * uncertainty.low), baseK: yearOneK, highK: round(yearOneK * uncertainty.high) },
    weeksToProduction,
    vendors: stack.vendors,
    integrationBoundaries: stack.integrationBoundaries,
    operatingTeams: stack.operatingTeams,
  };
}

export function calculateEconomics(
  profile: EstateProfile,
  capabilities: CapabilityAssessment[],
  assumptions: EconomicAssumptions,
) {
  return APPROACHES.map((approach) => calculateApproach(approach, profile, capabilities, assumptions));
}

export function costByBucket(economics: ApproachEconomics, horizon: "year1" | "threeYear") {
  return economics.lines.reduce<Record<CostBucket, number>>((buckets, item) => {
    const multiplier = horizon === "threeYear" && item.annual ? 3 : 1;
    buckets[item.bucket] += item.amountK * multiplier;
    return buckets;
  }, {
    "Model inference": 0,
    "Agent platform & runtime": 0,
    "Hyperscaler infrastructure": 0,
    "External products & licenses": 0,
    "Initial build & integration": 0,
    "Ongoing governance & operations": 0,
  });
}

export function buildDecisionBrief(economics: ApproachEconomics[], profile: EstateProfile): DecisionBrief {
  const simplePersonal = profile.personal.count > 0 && profile.personal.count <= 3 && profile.internal.count === 0 && profile.customer.count === 0 && profile.personal.complexity === "assist" && profile.sensitivity === "standard";
  const ranked = [...economics].sort((a, b) => {
    const timeWeight = simplePersonal ? 1 : 5;
    const boundaryWeight = simplePersonal ? 3 : 12;
    const aScore = a.yearOneK + a.weeksToProduction * timeWeight + a.integrationBoundaries * boundaryWeight;
    const bScore = b.yearOneK + b.weeksToProduction * timeWeight + b.integrationBoundaries * boundaryWeight;
    return aScore - bScore;
  });
  const winner = ranked[0];
  const runner = ranked[1];
  const isGeap = winner.approach === "geap";
  const hasCustomer = profile.customer.count > 0;
  return {
    winner: winner.approach,
    runnerUp: runner.approach,
    headline: `${APPROACH_META[winner.approach].shortName} is the best fit for this estate`,
    rationale: isGeap
      ? `The selected estate rewards shared controls and fewer integration boundaries. GEAP reaches governed production in about ${winner.weeksToProduction} weeks with ${winner.integrationBoundaries} customer-owned integration boundaries.`
      : `The selected estate is contained enough that an assembled ${APPROACH_META[winner.approach].shortName} approach avoids platform overhead while keeping Year-1 TCO competitive.`,
    economicDriver: isGeap
      ? "Lower initial integration and ongoing operating labor outweigh the platform-service premium."
      : "Low estate scale and existing-tool reuse keep assembly and operations costs below an integrated platform commitment.",
    architectureDriver: hasCustomer
      ? "Customer-facing reliability, isolation, audit, and escalation favor consistent shared controls."
      : "The estate can use a narrower capability footprint with fewer production dependencies.",
    tradeoff: APPROACH_META[winner.approach].tradeoff,
    flipConditions: [
      `Existing-tool credit above 60% makes ${APPROACH_META[runner.approach].shortName} materially more competitive.`,
      "A lower loaded engineering rate reduces the penalty for customer-owned integration and operations.",
      isGeap ? "Very low activity and fewer than three bounded agents can favor a direct assembled approach." : "More action-taking or customer-facing agents increase the value of integrated governance and runtime.",
    ],
  };
}
