import { METRICS } from "./metrics";
import type { MetricId, Product } from "./types";

/**
 * Derived "preference match" estimate — NOT a score of record.
 *
 * - Inputs: plottable metrics with weight > 0.
 * - Normalisation: min–max within the eligible set, inverted for
 *   lower-is-better metrics, so 1 = best in set and 0 = worst. A metric where
 *   every eligible product ties normalises to 1 for all of them.
 * - Missing data: weighted mean over the metrics a product has; coverage is
 *   the share of total weight backed by data. Below MIN_COVERAGE the product is
 *   reported as insufficient data and not ranked.
 * - Sensitivity: each weight is scaled ×0.5 and ×1.5 one at a time; the
 *   resulting min–max rank is reported.
 */

export type Weights = Partial<Record<MetricId, number>>;

export const MIN_COVERAGE = 0.6;

export interface PreferenceRow {
  id: string;
  estimate: number | null;
  coverage: number;
  rank: number | null;
  rankRange: [number, number] | null;
  usedMetrics: MetricId[];
  missingMetrics: MetricId[];
}

function normalisers(products: Product[], metrics: MetricId[]) {
  const out = {} as Record<MetricId, (v: number) => number>;
  for (const m of metrics) {
    const vals = products.map((p) => p.metrics[m].value).filter((v): v is number => v !== null);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const lower = METRICS[m].direction === "lower";
    out[m] = (v: number) => {
      if (!vals.length || max === min) return 1;
      const t = (v - min) / (max - min);
      return lower ? 1 - t : t;
    };
  }
  return out;
}

function score(products: Product[], weights: Weights) {
  const metrics = (Object.keys(weights) as MetricId[]).filter((m) => (weights[m] ?? 0) > 0);
  const norm = normalisers(products, metrics);
  const total = metrics.reduce((s, m) => s + (weights[m] ?? 0), 0);
  return products.map((p) => {
    let sum = 0;
    let w = 0;
    const used: MetricId[] = [];
    const missing: MetricId[] = [];
    for (const m of metrics) {
      const v = p.metrics[m].value;
      const wm = weights[m] ?? 0;
      if (v === null) {
        missing.push(m);
        continue;
      }
      used.push(m);
      sum += wm * norm[m](v);
      w += wm;
    }
    const coverage = total > 0 ? w / total : 0;
    const estimate = coverage >= MIN_COVERAGE && w > 0 ? sum / w : null;
    return { id: p.id, estimate, coverage, used, missing };
  });
}

function ranks(rows: { id: string; estimate: number | null }[]): Map<string, number> {
  const ranked = rows.filter((r) => r.estimate !== null).sort((a, b) => (b.estimate as number) - (a.estimate as number));
  const out = new Map<string, number>();
  // Competition ranking: equal estimates share a rank.
  ranked.forEach((r, i) => {
    const prev = ranked[i - 1];
    const rank = prev && Math.abs((prev.estimate as number) - (r.estimate as number)) < 1e-9 ? (out.get(prev.id) as number) : i + 1;
    out.set(r.id, rank);
  });
  return out;
}

export function preferenceEstimate(products: Product[], weights: Weights): PreferenceRow[] {
  const base = score(products, weights);
  const baseRanks = ranks(base);
  const ranges = new Map<string, [number, number]>();
  for (const [id, r] of baseRanks) ranges.set(id, [r, r]);

  const active = (Object.keys(weights) as MetricId[]).filter((m) => (weights[m] ?? 0) > 0);
  for (const m of active) {
    for (const factor of [0.5, 1.5]) {
      const perturbed = { ...weights, [m]: (weights[m] ?? 0) * factor };
      const r = ranks(score(products, perturbed));
      for (const [id, rank] of r) {
        const cur = ranges.get(id);
        if (cur) ranges.set(id, [Math.min(cur[0], rank), Math.max(cur[1], rank)]);
      }
    }
  }

  return base
    .map((b) => ({
      id: b.id,
      estimate: b.estimate,
      coverage: b.coverage,
      rank: baseRanks.get(b.id) ?? null,
      rankRange: ranges.get(b.id) ?? null,
      usedMetrics: b.used,
      missingMetrics: b.missing,
    }))
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
}
