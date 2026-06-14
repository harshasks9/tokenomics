// Enterprise Agent Platform Economics — Year-1 TCO model
// All figures in $K (thousands). Base engineering rate: $18K/engineer-month.
// [ASSUMPTION] unless noted.

export type Approach = "directApi" | "internalPlatform" | "bestOfBreed" | "integratedPlatform";

export interface ApproachInputs {
  label: string;
  color: string;
  /** One-time build + setup cost ($K) — labor-priced, scales with eng rate */
  buildFixed: number;
  /** Annual license / seat / platform-team cost ($K) — NOT labor-scaled */
  licenseYr: number;
  /** Integration cost per agent ($K) — labor-priced, scales with eng rate */
  integPerAgent: number;
  /** Annual run cost per agent ($K) — infra + metered services + model tokens */
  runPerAgentYr: number;
  /** Weeks from decision to first production agent */
  weeksToFirstProd: number;
  /** One-line honest note */
  note: string;
}

// Base rate = $18K/eng-mo. Crossovers verified at N=10/50/200 with base rate.
export const INPUTS: Record<Approach, ApproachInputs> = {
  directApi: {
    label: "Direct model APIs",
    color: "#E37400",
    buildFixed: 80,
    licenseYr: 30,
    integPerAgent: 36,
    runPerAgentYr: 16,
    weeksToFirstProd: 10,
    note: "Little reuse; integration repeats per agent. Rational for 1–3 simple, low-governance agents.",
  },
  internalPlatform: {
    label: "Reusable internal platform",
    color: "#7C3AED",
    buildFixed: 1080,
    licenseYr: 1320,
    integPerAgent: 9,
    runPerAgentYr: 6,
    weeksToFirstProd: 40,
    note: "High build + ongoing platform team cost; low marginal per agent. Wins at N>150 with strong platform engineering.",
  },
  bestOfBreed: {
    label: "Best-of-breed assembly",
    color: "#1A73E8",
    buildFixed: 200,
    licenseYr: 290,
    integPerAgent: 27,
    runPerAgentYr: 8,
    weeksToFirstProd: 20,
    note: "Commercial + OSS licenses, integration tax to wire consistent identity/audit, multi-vendor ops.",
  },
  integratedPlatform: {
    label: "Integrated platform",
    color: "#188038",
    buildFixed: 80,
    licenseYr: 60,
    integPerAgent: 7,
    runPerAgentYr: 18,
    weeksToFirstProd: 6,
    note: "Pre-integrated; metered consumption + seats. Fastest time-to-value. Note: metered costs grow with usage; equivalent AWS/Azure platforms exist; switching cost is real.",
  },
};

const BASE_ENG_RATE = 18; // $K/engineer-month

/**
 * Year-1 TCO in $K for N agents.
 * Labor-priced components (buildFixed, integPerAgent) scale with eng rate.
 * licenseYr and runPerAgentYr are not labor-driven.
 */
export function tco(
  approach: Approach,
  n: number,
  engRateK: number = BASE_ENG_RATE
): number {
  const m = INPUTS[approach];
  const labScale = engRateK / BASE_ENG_RATE;
  return (
    m.buildFixed * labScale +
    m.licenseYr +
    n * (m.integPerAgent * labScale + m.runPerAgentYr)
  );
}

/** Model/token cost per agent per year — same for all approaches */
export function modelCostPerAgent(modelCostK: number): number {
  return modelCostK;
}

/** Rank all approaches by TCO at given N and eng rate */
export function rankByTCO(
  n: number,
  engRateK: number = BASE_ENG_RATE
): { approach: Approach; tcoK: number }[] {
  const approaches: Approach[] = [
    "directApi",
    "internalPlatform",
    "bestOfBreed",
    "integratedPlatform",
  ];
  return approaches
    .map((a) => ({ approach: a, tcoK: tco(a, n, engRateK) }))
    .sort((a, b) => a.tcoK - b.tcoK);
}

/** Pre-verified crossover benchmarks at base eng rate ($18K/mo) */
export const CROSSOVERS = [
  {
    n: 10,
    ranking: [
      { approach: "integratedPlatform" as Approach, approxK: 390 },
      { approach: "directApi"          as Approach, approxK: 630 },
      { approach: "bestOfBreed"        as Approach, approxK: 840 },
      { approach: "internalPlatform"   as Approach, approxK: 2550 },
    ],
    insight: "Small estate: integrated or direct APIs win; internal platform is over-built.",
  },
  {
    n: 50,
    ranking: [
      { approach: "integratedPlatform" as Approach, approxK: 1390 },
      { approach: "bestOfBreed"        as Approach, approxK: 2240 },
      { approach: "directApi"          as Approach, approxK: 2710 },
      { approach: "internalPlatform"   as Approach, approxK: 3150 },
    ],
    insight: "Mid estate: integrated platform leads; direct APIs lose their simplicity advantage.",
  },
  {
    n: 200,
    ranking: [
      { approach: "integratedPlatform" as Approach, approxK: 5140 },
      { approach: "internalPlatform"   as Approach, approxK: 5400 },
      { approach: "bestOfBreed"        as Approach, approxK: 7490 },
      { approach: "directApi"          as Approach, approxK: 10510 },
    ],
    insight: "Large estate: internal platform closes the gap with integrated. Strong platform eng makes it competitive.",
  },
] as const;
