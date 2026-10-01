"use client";

import { METRICS } from "@/lib/earbuds/metrics";
import type { ExploreResult } from "@/lib/earbuds/explore";
import { PRODUCT_BY_ID, PRODUCTS } from "@/lib/earbuds/products";
import type { MetricId, Product } from "@/lib/earbuds/types";

interface Props {
  x: MetricId;
  y: MetricId;
  result: ExploreResult;
  pinned: string[];
  activeId: string | null;
  onTogglePin: (id: string) => void;
  onSelect: (id: string) => void;
}

type Row = { product: Product; order: number; status: string; tone: "frontier" | "dominated" | "excluded" };

/** The keyboard- and screen-reader-friendly alternative to the chart: same data, same frontier. */
export default function ProductList({ x, y, result, pinned, activeId, onTogglePin, onSelect }: Props) {
  const pointById = new Map(result.points.map((p) => [p.id, p]));
  const missingById = new Map(result.missing.map((m) => [m.product.id, m.metrics]));
  const exclusionById = new Map(result.eligibility.map((e) => [e.product.id, e]));

  const rows: Row[] = PRODUCTS.map((product) => {
    const pt = pointById.get(product.id);
    if (pt) {
      return pt.onFrontier
        ? { product, order: 0, status: "On the frontier", tone: "frontier" as const }
        : { product, order: 1, status: `Dominated by ${pt.dominatedBy.map((id) => PRODUCT_BY_ID[id].short).join(", ")}`, tone: "dominated" as const };
    }
    const miss = missingById.get(product.id);
    if (miss) return { product, order: 2, status: `Not plotted — no comparable ${miss.map((m) => METRICS[m].label.toLowerCase()).join(" or ")} data`, tone: "excluded" as const };
    const ex = exclusionById.get(product.id);
    const brand = ex?.exclusions.find((e) => e.requirement === "brand");
    const reasons = brand ? [brand.reason] : (ex?.exclusions ?? []).map((e) => (e.kind === "unknown" ? `${e.reason} (unknown)` : e.reason));
    return { product, order: 3, status: `Excluded — ${reasons.join("; ")}`, tone: "excluded" as const };
  }).sort((a, b) => a.order - b.order || (pointById.get(a.product.id)?.x ?? 0) - (pointById.get(b.product.id)?.x ?? 0));

  const full = pinned.length >= 3;

  return (
    <div className="eb-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="eb-table min-w-[720px]">
          <caption className="sr-only">
            All 14 earbuds with the two selected metrics, frontier status and comparison controls. Frontier products are listed first.
          </caption>
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col" className="!text-right">
                {METRICS[x].label}
              </th>
              <th scope="col" className="!text-right">
                {METRICS[y].label}
              </th>
              <th scope="col">Status for these axes</th>
              <th scope="col" className="!text-center">
                Compare
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, status, tone }) => {
              const xv = product.metrics[x].value;
              const yv = product.metrics[y].value;
              const isPinned = pinned.includes(product.id);
              return (
                <tr key={product.id} data-active={activeId === product.id}>
                  <th scope="row" className="!whitespace-normal !text-left !font-normal !normal-case !tracking-normal">
                    <button type="button" className="text-left text-[14px] font-semibold text-[var(--eb-ink)] underline decoration-[var(--eb-rule-2)] underline-offset-4 hover:decoration-[var(--eb-ink)]" onClick={() => onSelect(product.id)}>
                      {product.brand} {product.name}
                    </button>
                  </th>
                  <td className="eb-tabular text-right">{xv === null ? <span className="italic text-[var(--eb-muted)]">—</span> : METRICS[x].format(xv)}</td>
                  <td className="eb-tabular text-right">{yv === null ? <span className="italic text-[var(--eb-muted)]">—</span> : METRICS[y].format(yv)}</td>
                  <td className={`text-[13px] leading-snug ${tone === "frontier" ? "font-semibold text-[var(--eb-accent-ink)]" : tone === "dominated" ? "text-[var(--eb-ink-2)]" : "text-[var(--eb-muted)]"}`}>
                    <span aria-hidden>{tone === "frontier" ? "● " : tone === "dominated" ? "○ " : "– "}</span>
                    {status}
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="eb-check"
                      checked={isPinned}
                      disabled={!isPinned && full}
                      onChange={() => onTogglePin(product.id)}
                      aria-label={`Compare ${product.brand} ${product.name}`}
                      title={!isPinned && full ? "Compare holds up to three" : undefined}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
