import type { Direction } from "./types";

/**
 * Pareto dominance on two objectives with per-objective optimisation direction.
 *
 * A dominates B when A is at least as good as B on every objective and strictly
 * better on at least one. Points identical on both objectives do not dominate
 * each other, so exact ties are all kept on the frontier.
 */

export interface Objective {
  direction: Direction;
}

export interface Candidate {
  id: string;
  values: number[];
}

/** Returns +1 if a is better than b, 0 if equal, −1 if worse, for one objective. */
export function compare(a: number, b: number, direction: Direction): number {
  if (a === b) return 0;
  const better = direction === "lower" ? a < b : a > b;
  return better ? 1 : -1;
}

export function dominates(a: number[], b: number[], objectives: Objective[]): boolean {
  let strictlyBetter = false;
  for (let i = 0; i < objectives.length; i++) {
    const c = compare(a[i], b[i], objectives[i].direction);
    if (c < 0) return false;
    if (c > 0) strictlyBetter = true;
  }
  return strictlyBetter;
}

export interface FrontierResult {
  frontier: string[];
  /** dominated id → ids of the frontier-or-not candidates that dominate it. */
  dominatedBy: Record<string, string[]>;
}

/** O(n²) — fine for the handful of products on screen. */
export function paretoFrontier(candidates: Candidate[], objectives: Objective[]): FrontierResult {
  for (const c of candidates) {
    if (c.values.length !== objectives.length || c.values.some((v) => !Number.isFinite(v))) {
      throw new Error(`Candidate ${c.id} must have a finite value for every objective`);
    }
  }
  const dominatedBy: Record<string, string[]> = {};
  const frontier: string[] = [];
  for (const b of candidates) {
    const by = candidates.filter((a) => a.id !== b.id && dominates(a.values, b.values, objectives)).map((a) => a.id);
    if (by.length) dominatedBy[b.id] = by;
    else frontier.push(b.id);
  }
  return { frontier, dominatedBy };
}

/** Frontier points ordered along the x objective, for drawing the staircase. */
export function orderFrontier<T extends { x: number }>(points: T[]): T[] {
  return [...points].sort((a, b) => a.x - b.x);
}
