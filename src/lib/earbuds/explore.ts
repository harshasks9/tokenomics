import { METRICS } from "./metrics";
import { paretoFrontier } from "./pareto";
import { applyRequirements, partitionForAxes, type EligibilityResult, type Requirements } from "./requirements";
import type { Brand, MetricId, Product } from "./types";

/**
 * One pass from UI state to everything the explorer renders. Order is fixed:
 *   1. hard requirements + brand filter → eligible set
 *   2. drop eligible products missing either chart metric (with reason)
 *   3. Pareto frontier on what remains
 * Re-run on every axis, filter or requirement change.
 */

export interface ExploreState {
  x: MetricId;
  y: MetricId;
  requirements: Requirements;
  brands: Brand[];
}

export interface PlotPoint {
  id: string;
  product: Product;
  x: number;
  y: number;
  onFrontier: boolean;
  dominatedBy: string[];
}

export interface ExploreResult {
  eligibility: EligibilityResult[];
  eligible: Product[];
  /** Excluded by a requirement the product documentedly fails. */
  failed: EligibilityResult[];
  /** Excluded only because a required feature is unknown. */
  unknown: EligibilityResult[];
  /** Excluded by the brand filter (takes precedence over requirement reasons). */
  brandFiltered: EligibilityResult[];
  missing: { product: Product; metrics: MetricId[] }[];
  points: PlotPoint[];
  frontier: PlotPoint[];
}

export function explore(products: Product[], state: ExploreState): ExploreResult {
  const eligibility = applyRequirements(products, state.requirements, state.brands);
  const eligible = eligibility.filter((r) => r.eligible).map((r) => r.product);
  const excluded = eligibility.filter((r) => !r.eligible);

  // The brand filter wins: a hidden brand is not also reported as failing requirements.
  const brandFiltered = excluded.filter((r) => r.exclusions.some((e) => e.requirement === "brand"));
  const rest = excluded.filter((r) => !brandFiltered.includes(r));
  const failed = rest.filter((r) => r.exclusions.some((e) => e.requirement !== "brand" && e.kind === "fails"));
  const unknown = rest.filter((r) => !failed.includes(r));

  const { plotted, missing } = partitionForAxes(eligible, state.x, state.y);
  const objectives = [{ direction: METRICS[state.x].direction }, { direction: METRICS[state.y].direction }];
  const { frontier, dominatedBy } = paretoFrontier(
    plotted.map((p) => ({ id: p.id, values: [p.metrics[state.x].value as number, p.metrics[state.y].value as number] })),
    objectives,
  );
  const onFrontier = new Set(frontier);

  const points: PlotPoint[] = plotted.map((p) => ({
    id: p.id,
    product: p,
    x: p.metrics[state.x].value as number,
    y: p.metrics[state.y].value as number,
    onFrontier: onFrontier.has(p.id),
    dominatedBy: dominatedBy[p.id] ?? [],
  }));

  return {
    eligibility,
    eligible,
    failed,
    unknown,
    brandFiltered,
    missing,
    points,
    frontier: points.filter((p) => p.onFrontier).sort((a, b) => a.x - b.x || a.y - b.y),
  };
}

/** Where the "better" corner sits, for the chart annotation. */
export function betterCorner(x: MetricId, y: MetricId): { horizontal: "left" | "right"; vertical: "top" | "bottom" } {
  return {
    horizontal: METRICS[x].direction === "lower" ? "left" : "right",
    vertical: METRICS[y].direction === "lower" ? "bottom" : "top",
  };
}

/** Recharts curve type that draws the attainable-set staircase between frontier points (sorted by x). */
export function frontierCurve(x: MetricId): "stepAfter" | "stepBefore" {
  return METRICS[x].direction === "lower" ? "stepAfter" : "stepBefore";
}
