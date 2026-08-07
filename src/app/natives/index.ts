import type { Company, UseCase } from "./schema";
import { opportunityScore, impactScore, feasibilityScore, companyScore } from "./schema";
import { COMPANIES_FOOD } from "./data/food";
import { COMPANIES_FINTECH } from "./data/fintech";
import { COMPANIES_COMMERCE } from "./data/commerce";
import { COMPANIES_TRAVEL_MOBILITY } from "./data/travel-mobility";
import { COMPANIES_INVESTING_SERVICES } from "./data/investing-services";

export const COMPANIES: Company[] = [
  ...COMPANIES_FOOD,
  ...COMPANIES_FINTECH,
  ...COMPANIES_COMMERCE,
  ...COMPANIES_TRAVEL_MOBILITY,
  ...COMPANIES_INVESTING_SERVICES,
];

export type ScoredUseCase = UseCase & {
  company: Company;
  score: number;
  impact: number;
  feasibility: number;
};

export const ALL_USE_CASES: ScoredUseCase[] = COMPANIES.flatMap((c) =>
  c.useCases.map((u) => ({
    ...u,
    company: c,
    score: opportunityScore(u),
    impact: impactScore(u),
    feasibility: feasibilityScore(u),
  })),
);

export const byScore = (a: ScoredUseCase, b: ScoredUseCase) => b.score - a.score;

// The ten most strategically interesting opportunities across all companies.
export const TOP_TEN = [...ALL_USE_CASES].sort(byScore).slice(0, 10);

// Highest-volume: where the largest number of interactions likely sit.
export const HIGHEST_VOLUME = [...ALL_USE_CASES]
  .sort((a, b) => b.scores.volume - a.scores.volume || b.score - a.score)
  .slice(0, 5);

// Highest economic value: revenue created or protected.
export const HIGHEST_VALUE = [...ALL_USE_CASES]
  .sort((a, b) => b.scores.economic - a.scores.economic || b.score - a.score)
  .slice(0, 5);

// Best near-term: high value AND genuinely deployable.
export const NEAR_TERM = [...ALL_USE_CASES]
  .filter((u) => u.scores.ease >= 3)
  .sort((a, b) => (b.scores.ease + b.scores.economic) - (a.scores.ease + a.scores.economic) || b.score - a.score)
  .slice(0, 5);

// Most transformational: changes the operating model, not just support cost.
export const TRANSFORMATIONAL = [...ALL_USE_CASES]
  .filter((u) => u.econ !== "cost")
  .sort((a, b) => (b.scores.differentiation + b.scores.economic) - (a.scores.differentiation + a.scores.economic) || b.score - a.score)
  .slice(0, 5);

export const companyBySlug = (slug: string) => COMPANIES.find((c) => c.slug === slug);
export const heroUseCase = (c: Company) => c.useCases.find((u) => u.rank === 1) ?? c.useCases[0];
export const scoreOf = companyScore;

export const RANKED_COMPANIES = [...COMPANIES].sort((a, b) => companyScore(b) - companyScore(a));

// Aggregate split of the 50 opportunities by where value comes from.
export function econSplit() {
  const out = { revenue: 0, cost: 0, both: 0 };
  for (const u of ALL_USE_CASES) out[u.econ] += 1;
  return out;
}

export function audienceSplit() {
  const out: Record<string, number> = {};
  for (const u of ALL_USE_CASES) out[u.audience] = (out[u.audience] ?? 0) + 1;
  return out;
}
