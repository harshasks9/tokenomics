"use client";

import { useId, useMemo } from "react";
import { METRIC_IDS, METRICS } from "@/lib/earbuds/metrics";
import { MIN_COVERAGE, preferenceEstimate, type Weights } from "@/lib/earbuds/preference";
import { PRODUCT_BY_ID } from "@/lib/earbuds/products";
import type { MetricId, Product } from "@/lib/earbuds/types";

interface Props {
  eligible: Product[];
  weights: Weights;
  onChange: (w: Weights) => void;
  onSelect: (id: string) => void;
}

const WEIGHT_WORD = ["Ignore", "A little", "Matters", "Top priority"];

export default function PreferencePanel({ eligible, weights, onChange, onSelect }: Props) {
  const baseId = useId();
  const rows = useMemo(() => preferenceEstimate(eligible, weights), [eligible, weights]);
  const active = METRIC_IDS.filter((m) => (weights[m] ?? 0) > 0);
  const ranked = rows.filter((r) => r.rank !== null);
  const unranked = rows.filter((r) => r.rank === null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="eb-card p-5">
        <p className="eb-eyebrow">Your preferences</p>
        <p className="mt-1 text-[13px] leading-snug text-[var(--eb-muted)]">Weights shape the derived estimate only. They never change the frontier or which products qualify.</p>
        <div className="mt-4 space-y-3">
          {METRIC_IDS.map((m) => {
            const w = weights[m] ?? 0;
            const id = `${baseId}-${m}`;
            return (
              <div key={m}>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={id} className="text-[13px] font-medium">
                    {METRICS[m].label}
                  </label>
                  <span className="text-[12px] text-[var(--eb-muted)]">{WEIGHT_WORD[w]}</span>
                </div>
                <input
                  id={id}
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={w}
                  className="eb-range"
                  aria-valuetext={`${WEIGHT_WORD[w]} (weight ${w} of 3)`}
                  onChange={(e) => onChange({ ...weights, [m]: Number(e.target.value) })}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="eb-card overflow-hidden">
        <div className="border-b border-[var(--eb-rule)] px-5 py-4">
          <p className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
            Preference match <span className="eb-badge">Derived estimate — not a verdict</span>
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-[var(--eb-muted)]">
            Each metric is min–max normalised within the {eligible.length} eligible products (best = 100, worst = 0; price and weight inverted), then weighted. Missing metrics are skipped and shown as reduced coverage; below {Math.round(MIN_COVERAGE * 100)}% coverage a model isn&apos;t ranked. “Rank range” is the best–worst rank when each weight moves ±50% — a wide range means the ordering is fragile.
          </p>
        </div>
        {active.length === 0 ? (
          <p className="px-5 py-8 text-center text-[14px] text-[var(--eb-muted)]">Set at least one preference above zero to see a derived estimate.</p>
        ) : eligible.length === 0 ? (
          <p className="px-5 py-8 text-center text-[14px] text-[var(--eb-muted)]">No products meet your hard requirements, so there is nothing to weigh.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="eb-table min-w-[560px]">
              <caption className="sr-only">Derived preference estimate for eligible products, with data coverage and sensitivity rank range.</caption>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Model</th>
                  <th scope="col" className="!text-right">
                    Estimate
                  </th>
                  <th scope="col" className="!text-right">
                    Coverage
                  </th>
                  <th scope="col" className="!text-right">
                    Rank range
                  </th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r) => (
                  <tr key={r.id}>
                    <td className="eb-tabular">{r.rank}</td>
                    <th scope="row" className="!whitespace-normal !text-left !font-normal !normal-case !tracking-normal">
                      <button type="button" className="text-left text-[14px] font-medium underline decoration-[var(--eb-rule-2)] underline-offset-4" onClick={() => onSelect(r.id)}>
                        {PRODUCT_BY_ID[r.id].brand} {PRODUCT_BY_ID[r.id].name}
                      </button>
                      {r.missingMetrics.length ? (
                        <span className="block text-[11.5px] text-[var(--eb-muted)]">No data: {r.missingMetrics.map((m: MetricId) => METRICS[m].label.toLowerCase()).join(", ")}</span>
                      ) : null}
                    </th>
                    <td className="eb-tabular text-right">
                      <span className="inline-flex items-center gap-2">
                        <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-[var(--eb-paper-2)] sm:inline-block" aria-hidden>
                          <span className="block h-full rounded-full bg-[var(--eb-accent)]" style={{ width: `${Math.round((r.estimate ?? 0) * 100)}%` }} />
                        </span>
                        {Math.round((r.estimate ?? 0) * 100)}
                      </span>
                    </td>
                    <td className="eb-tabular text-right">{Math.round(r.coverage * 100)}%</td>
                    <td className="eb-tabular text-right">{r.rankRange && r.rankRange[0] !== r.rankRange[1] ? `${r.rankRange[0]}–${r.rankRange[1]}` : "stable"}</td>
                  </tr>
                ))}
                {unranked.map((r) => (
                  <tr key={r.id}>
                    <td className="text-[var(--eb-muted)]">—</td>
                    <th scope="row" className="!whitespace-normal !text-left !font-normal !normal-case !tracking-normal text-[var(--eb-muted)]">
                      {PRODUCT_BY_ID[r.id].brand} {PRODUCT_BY_ID[r.id].name}
                      <span className="block text-[11.5px]">Insufficient data for these weights</span>
                    </th>
                    <td className="text-right text-[var(--eb-muted)]">—</td>
                    <td className="eb-tabular text-right text-[var(--eb-muted)]">{Math.round(r.coverage * 100)}%</td>
                    <td className="text-right text-[var(--eb-muted)]">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
