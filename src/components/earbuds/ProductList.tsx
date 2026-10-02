"use client";

import { useId, useMemo, useState } from "react";
import { METRICS, priceMetric } from "@/lib/earbuds/metrics";
import type { ExploreResult } from "@/lib/earbuds/explore";
import { PRODUCT_BY_ID } from "@/lib/earbuds/products";
import type { Market, MetricId, Product } from "@/lib/earbuds/types";

interface Props {
  x: MetricId;
  y: MetricId;
  market: Market;
  result: ExploreResult;
  pinned: string[];
  activeId: string | null;
  onTogglePin: (id: string) => void;
  onSelect: (id: string) => void;
}

type Tone = "frontier" | "dominated" | "excluded";
type Row = { product: Product; order: number; status: string; tone: Tone };
type SortKey = "status" | "name" | "x" | "y" | "price";

const PAGE = 25;

/** The keyboard- and screen-reader-friendly alternative to the chart: same data, same frontier. */
export default function ProductList({ x, y, market, result, pinned, activeId, onTogglePin, onSelect }: Props) {
  const searchId = useId();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "status", dir: 1 });
  const [limit, setLimit] = useState(PAGE);
  const pm = priceMetric(market);

  const rows = useMemo(() => {
    const pointById = new Map(result.points.map((p) => [p.id, p]));
    const missingById = new Map(result.missing.map((m) => [m.product.id, m.metrics]));
    const inScope = result.eligibility.filter((e) => !result.outOfMarket.includes(e));
    const out: Row[] = inScope.map(({ product, exclusions }) => {
      const pt = pointById.get(product.id);
      if (pt) {
        return pt.onFrontier
          ? { product, order: 0, status: "On the frontier", tone: "frontier" as const }
          : { product, order: 1, status: `Dominated by ${pt.dominatedBy.slice(0, 3).map((id) => PRODUCT_BY_ID[id].short).join(", ")}${pt.dominatedBy.length > 3 ? ` +${pt.dominatedBy.length - 3}` : ""}`, tone: "dominated" as const };
      }
      const miss = missingById.get(product.id);
      if (miss) return { product, order: 2, status: `Not plotted — no ${miss.map((m) => METRICS[m].label.toLowerCase()).join(" or ")} data`, tone: "excluded" as const };
      const brand = exclusions.find((e) => e.requirement === "brand");
      const reasons = brand ? [brand.reason] : exclusions.map((e) => (e.kind === "unknown" ? `${e.reason} (unknown)` : e.reason));
      return { product, order: 3, status: `Excluded — ${reasons.join("; ")}`, tone: "excluded" as const };
    });
    const needle = q.trim().toLowerCase();
    const filtered = needle ? out.filter((r) => `${r.product.brand} ${r.product.name}`.toLowerCase().includes(needle)) : out;
    const val = (r: Row, k: SortKey): number | string | null =>
      k === "name" ? `${r.product.brand} ${r.product.name}`.toLowerCase() : k === "status" ? r.order : r.product.metrics[k === "x" ? x : k === "y" ? y : pm].value;
    return [...filtered].sort((a, b) => {
      const va = val(a, sort.key);
      const vb = val(b, sort.key);
      if (va === null && vb === null) return 0;
      if (va === null) return 1; // unknowns always last
      if (vb === null) return -1;
      const c = va < vb ? -1 : va > vb ? 1 : 0;
      return c * sort.dir || (pointById.get(a.product.id)?.x ?? 0) - (pointById.get(b.product.id)?.x ?? 0);
    });
  }, [result, q, sort, x, y, pm]);

  const full = pinned.length >= 3;
  const shown = rows.slice(0, limit);
  const header = (key: SortKey, label: string, align: "left" | "right" = "left") => {
    const active = sort.key === key;
    return (
      <th scope="col" aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={align === "right" ? "!text-right" : ""}>
        <button
          type="button"
          className="inline-flex items-center gap-1 uppercase tracking-[0.08em] hover:text-[var(--eb-ink)]"
          onClick={() => setSort((s) => ({ key, dir: s.key === key ? ((-s.dir) as 1 | -1) : 1 }))}
        >
          {label}
          <span aria-hidden className={active ? "text-[var(--eb-ink)]" : "opacity-30"}>
            {active && sort.dir === -1 ? "↓" : "↑"}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="eb-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--eb-rule)] px-4 py-3">
        <label htmlFor={searchId} className="sr-only">
          Search models
        </label>
        <input
          id={searchId}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(PAGE);
          }}
          placeholder="Search brand or model (e.g. Airdopes, Buds Air)"
          className="eb-select !bg-none !pr-3 sm:max-w-sm"
        />
        <p className="text-[12.5px] text-[var(--eb-muted)]" aria-live="polite">
          {rows.length} model{rows.length === 1 ? "" : "s"} in the {market === "in" ? "India" : "US"} view
          {result.outOfMarket.length ? ` · ${result.outOfMarket.length} not documented as sold here` : ""}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="eb-table min-w-[760px]">
          <caption className="sr-only">
            Earbuds in the selected market with the two chart metrics, launch price, frontier status and comparison controls. Column headers sort the table.
          </caption>
          <thead>
            <tr>
              {header("name", "Model")}
              {header("x", METRICS[x].label, "right")}
              {header("y", METRICS[y].label, "right")}
              {x !== pm && y !== pm ? header("price", METRICS[pm].label, "right") : null}
              {header("status", "Status for these axes")}
              <th scope="col" className="!text-center">
                Compare
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map(({ product, status, tone }) => {
              const isPinned = pinned.includes(product.id);
              const cell = (m: MetricId) => {
                const v = product.metrics[m].value;
                return <td className="eb-tabular text-right">{v === null ? <span className="italic text-[var(--eb-muted)]">—</span> : METRICS[m].format(v)}</td>;
              };
              return (
                <tr key={product.id} data-active={activeId === product.id}>
                  <th scope="row" className="!whitespace-normal !text-left !font-normal !normal-case !tracking-normal">
                    <button type="button" className="text-left text-[14px] font-semibold text-[var(--eb-ink)] underline decoration-[var(--eb-rule-2)] underline-offset-4 hover:decoration-[var(--eb-ink)]" onClick={() => onSelect(product.id)}>
                      {product.brand} {product.name}
                    </button>
                    {product.tier === "deep" ? <span className="eb-badge eb-badge-accent ml-2 align-middle">Deep dive</span> : null}
                  </th>
                  {cell(x)}
                  {cell(y)}
                  {x !== pm && y !== pm ? cell(pm) : null}
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-[14px] text-[var(--eb-muted)]">
                  No model matches “{q}” in this view.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {rows.length > limit ? (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--eb-rule)] px-4 py-3">
          <span className="text-[12.5px] text-[var(--eb-muted)]">
            Showing {shown.length} of {rows.length}
          </span>
          <button type="button" className="eb-btn !min-h-[32px]" onClick={() => setLimit((l) => l + PAGE)}>
            Show {Math.min(PAGE, rows.length - limit)} more
          </button>
          <button type="button" className="eb-btn !min-h-[32px]" onClick={() => setLimit(rows.length)}>
            Show all
          </button>
        </div>
      ) : null}
    </div>
  );
}
