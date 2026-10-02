"use client";

import { useId, useMemo, useState } from "react";
import { axisLabel, axisOptionsFor } from "@/lib/earbuds/metrics";
import type { FormRequirement, OsRequirement, Requirements, WaterRequirement } from "@/lib/earbuds/requirements";
import type { AxisId, Brand, Market } from "@/lib/earbuds/types";

export const BUDGET: Record<Market, { min: number; max: number; step: number; fmt: (v: number) => string }> = {
  in: { min: 500, max: 35000, step: 500, fmt: (v) => `₹${v.toLocaleString("en-IN")}` },
  us: { min: 40, max: 340, step: 10, fmt: (v) => `$${v}` },
};

export function MarketSwitch({ market, onChange }: { market: Market; onChange: (m: Market) => void }) {
  const opts: { id: Market; label: string; hint: string }[] = [
    { id: "in", label: "India", hint: "₹ launch prices · sold in India" },
    { id: "us", label: "United States", hint: "$ launch prices · sold in the US" },
  ];
  return (
    <div role="radiogroup" aria-label="Market" className="inline-flex rounded-full border border-[var(--eb-rule-2)] bg-[var(--eb-card)] p-1">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={market === o.id}
          title={o.hint}
          onClick={() => onChange(o.id)}
          className={`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${
            market === o.id ? "bg-[var(--eb-ink)] text-[var(--eb-paper)]" : "text-[var(--eb-ink-2)] hover:text-[var(--eb-ink)]"
          }`}
        >
          {o.label}
          <span className="sr-only"> — {o.hint}</span>
        </button>
      ))}
    </div>
  );
}

export function AxisPicker({ x, y, market, onChange }: { x: AxisId; y: AxisId; market: Market; onChange: (x: AxisId, y: AxisId) => void }) {
  const xId = useId();
  const yId = useId();
  const set = (axis: "x" | "y", value: AxisId) => {
    // Picking the other axis's metric swaps them rather than plotting a metric against itself.
    if (axis === "x") onChange(value, value === y ? x : y);
    else onChange(value === x ? y : x, value);
  };
  const options = axisOptionsFor(market).map((o) => (
    <option key={o.id} value={o.id}>
      {axisLabel(o.id)}
      {o.gap ? " (evidence gap)" : ""}
    </option>
  ));
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
      <div>
        <label htmlFor={xId} className="mb-1 block text-[12px] font-semibold text-[var(--eb-ink-2)]">
          Horizontal axis
        </label>
        <select id={xId} className="eb-select" value={x} onChange={(e) => set("x", e.target.value as AxisId)}>
          {options}
        </select>
      </div>
      <div>
        <label htmlFor={yId} className="mb-1 block text-[12px] font-semibold text-[var(--eb-ink-2)]">
          Vertical axis
        </label>
        <select id={yId} className="eb-select" value={y} onChange={(e) => set("y", e.target.value as AxisId)}>
          {options}
        </select>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-1.5 text-[14px]">
      <input type="checkbox" className="eb-check mt-0.5" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="text-[var(--eb-ink)]">{label}</span>
        {hint ? <span className="block text-[12px] leading-snug text-[var(--eb-muted)]">{hint}</span> : null}
      </span>
    </label>
  );
}

export function RequirementsPanel({ req, market, onChange }: { req: Requirements; market: Market; onChange: (r: Requirements) => void }) {
  const base = useId();
  const b = BUDGET[market];
  const budget = req.maxPrice ?? b.max;
  const patch = (p: Partial<Requirements>) => onChange({ ...req, ...p });
  const osOptions: { id: OsRequirement; label: string }[] = [
    { id: "any", label: "Any" },
    { id: "ios", label: "iPhone" },
    { id: "android", label: "Android" },
  ];
  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">Hard requirements</legend>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor={`${base}-budget`} className="text-[12px] font-semibold text-[var(--eb-ink-2)]">
            Budget (launch price)
          </label>
          <span className="eb-tabular text-[13px] font-semibold">{req.maxPrice === null ? "No cap" : `≤ ${b.fmt(req.maxPrice)}`}</span>
        </div>
        <input
          id={`${base}-budget`}
          type="range"
          className="eb-range"
          min={b.min}
          max={b.max}
          step={b.step}
          value={Math.min(budget, b.max)}
          aria-valuetext={req.maxPrice === null ? "No budget cap" : `Up to ${b.fmt(req.maxPrice)}`}
          onChange={(e) => {
            const v = Number(e.target.value);
            patch({ maxPrice: v >= b.max ? null : v });
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${base}-anc`} className="mb-1 block text-[12px] font-semibold text-[var(--eb-ink-2)]">
            Noise cancelling
          </label>
          <select id={`${base}-anc`} className="eb-select" value={req.anc ? "yes" : "any"} onChange={(e) => patch({ anc: e.target.value === "yes" })}>
            <option value="any">Any</option>
            <option value="yes">Must have ANC</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${base}-form`} className="mb-1 block text-[12px] font-semibold text-[var(--eb-ink-2)]">
            Fit style
          </label>
          <select id={`${base}-form`} className="eb-select" value={req.form} onChange={(e) => patch({ form: e.target.value as FormRequirement })}>
            <option value="any">Any</option>
            <option value="sealed">Sealed in-ear</option>
            <option value="open">Open / unsealed</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${base}-year`} className="mb-1 block text-[12px] font-semibold text-[var(--eb-ink-2)]">
            Released
          </label>
          <select id={`${base}-year`} className="eb-select" value={req.releasedSince ?? "any"} onChange={(e) => patch({ releasedSince: e.target.value === "any" ? null : Number(e.target.value) })}>
            <option value="any">Any year</option>
            <option value="2024">2024 or later</option>
            <option value="2025">2025 or later</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${base}-water`} className="mb-1 block text-[12px] font-semibold text-[var(--eb-ink-2)]">
            Water rating
          </label>
          <select
            id={`${base}-water`}
            className="eb-select"
            value={String(req.water)}
            onChange={(e) => {
              const v = e.target.value;
              patch({ water: (v === "none" || v === "documented" ? v : Number(v)) as WaterRequirement });
            }}
          >
            <option value="none">Any</option>
            <option value="documented">Any IP rating</option>
            <option value="4">IPX4+ (sweat)</option>
            <option value="5">IPX5+ (jets)</option>
            <option value="7">IPX7+ (immersion)</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[12px] font-semibold text-[var(--eb-ink-2)]" id={`${base}-os`}>
          Phone (needs full app support)
        </p>
        <div role="radiogroup" aria-labelledby={`${base}-os`} className="flex flex-wrap gap-1.5">
          {osOptions.map((o) => (
            <button key={o.id} type="button" role="radio" aria-checked={req.os === o.id} className="eb-chip !min-h-[32px] !px-3 !text-[13px]" onClick={() => patch({ os: o.id })}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--eb-rule)] pt-2">
        <Toggle checked={req.multipoint} onChange={(v) => patch({ multipoint: v })} label="Multipoint" hint="Two source devices connected at once. Ecosystem auto-switching doesn't count." />
        <Toggle checked={req.secureFit} onChange={(v) => patch({ secureFit: v })} label="Secure-fit design" hint="Ear hook, wing/fin or stability band." />
        <Toggle checked={req.wirelessCharging} onChange={(v) => patch({ wirelessCharging: v })} label="Wireless charging case" />
      </div>
      <p className="text-[12px] leading-snug text-[var(--eb-muted)]">Unknown features never pass a requirement — those products are listed as “unknown”, not hidden silently.</p>
    </fieldset>
  );
}

export function BrandFilter({ brands, counts, onChange }: { brands: Brand[]; counts: [Brand, number][]; onChange: (b: Brand[]) => void }) {
  const [q, setQ] = useState("");
  const id = useId();
  const toggle = (b: Brand) => onChange(brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b]);
  const shown = useMemo(() => counts.filter(([b]) => b.toLowerCase().includes(q.trim().toLowerCase()) || brands.includes(b)), [counts, q, brands]);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[12px] font-semibold text-[var(--eb-ink-2)]">
          Brands ({counts.length})
        </label>
        {brands.length ? (
          <button type="button" className="text-[12px] font-medium text-[var(--eb-accent-ink)] underline underline-offset-2" onClick={() => onChange([])}>
            Show all
          </button>
        ) : (
          <span className="text-[12px] text-[var(--eb-muted)]">All shown</span>
        )}
      </div>
      <input id={id} type="search" placeholder="Find a brand" value={q} onChange={(e) => setQ(e.target.value)} className="eb-select mb-2 !bg-none !pr-3" />
      <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto pr-1" role="group" aria-label="Filter by brand">
        {shown.map(([b, n]) => (
          <button key={b} type="button" aria-pressed={brands.includes(b)} className="eb-chip !min-h-[30px] !px-2.5 !text-[12.5px]" onClick={() => toggle(b)}>
            {b}
            <span className="text-[11px] opacity-60">{n}</span>
          </button>
        ))}
        {shown.length === 0 ? <p className="text-[12px] text-[var(--eb-muted)]">No brand matches “{q}”.</p> : null}
      </div>
    </div>
  );
}
