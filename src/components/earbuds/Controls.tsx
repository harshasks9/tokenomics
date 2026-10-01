"use client";

import { useId } from "react";
import { AXIS_OPTIONS, axisLabel } from "@/lib/earbuds/metrics";
import type { OsRequirement, Requirements, WaterRequirement } from "@/lib/earbuds/requirements";
import type { AxisId, Brand } from "@/lib/earbuds/types";

export const ALL_BRANDS: Brand[] = ["Apple", "Beats", "Google", "Sony", "Bose", "Samsung", "Nothing", "CMF", "Sennheiser", "Technics"];

export const BUDGET_MIN = 60;
export const BUDGET_MAX = 340;

export function AxisPicker({ x, y, onChange }: { x: AxisId; y: AxisId; onChange: (x: AxisId, y: AxisId) => void }) {
  const xId = useId();
  const yId = useId();
  const set = (axis: "x" | "y", value: AxisId) => {
    // Picking the other axis's metric swaps them rather than plotting a metric against itself.
    if (axis === "x") onChange(value, value === y ? x : y);
    else onChange(value === x ? y : x, value);
  };
  const options = AXIS_OPTIONS.map((o) => (
    <option key={o.id} value={o.id}>
      {axisLabel(o.id)}
      {o.gap ? " (evidence gap)" : ""}
    </option>
  ));
  return (
    <div className="grid grid-cols-2 gap-3">
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

export function RequirementsPanel({ req, onChange }: { req: Requirements; onChange: (r: Requirements) => void }) {
  const budgetId = useId();
  const waterId = useId();
  const budget = req.maxPrice ?? BUDGET_MAX;
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
          <label htmlFor={budgetId} className="text-[12px] font-semibold text-[var(--eb-ink-2)]">
            Budget (launch price)
          </label>
          <span className="eb-tabular text-[13px] font-semibold">{req.maxPrice === null ? "No cap" : `≤ $${req.maxPrice}`}</span>
        </div>
        <input
          id={budgetId}
          type="range"
          className="eb-range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={10}
          value={budget}
          aria-valuetext={req.maxPrice === null ? "No budget cap" : `Up to ${req.maxPrice} dollars`}
          onChange={(e) => {
            const v = Number(e.target.value);
            patch({ maxPrice: v >= BUDGET_MAX ? null : v });
          }}
        />
      </div>

      <div>
        <p className="mb-1.5 text-[12px] font-semibold text-[var(--eb-ink-2)]" id={`${budgetId}-os`}>
          Phone (needs full app support)
        </p>
        <div role="radiogroup" aria-labelledby={`${budgetId}-os`} className="flex flex-wrap gap-1.5">
          {osOptions.map((o) => (
            <button key={o.id} type="button" role="radio" aria-checked={req.os === o.id} className="eb-chip !min-h-[32px] !px-3 !text-[13px]" onClick={() => patch({ os: o.id })}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor={waterId} className="mb-1 block text-[12px] font-semibold text-[var(--eb-ink-2)]">
          Water resistance (earbuds)
        </label>
        <select
          id={waterId}
          className="eb-select"
          value={String(req.water)}
          onChange={(e) => {
            const v = e.target.value;
            patch({ water: (v === "none" || v === "documented" ? v : Number(v)) as WaterRequirement });
          }}
        >
          <option value="none">No requirement</option>
          <option value="documented">Any documented IP rating</option>
          <option value="4">IPX4 or better (splashes, sweat)</option>
          <option value="5">IPX5 or better (water jets)</option>
          <option value="7">IPX7 or better (1 m immersion)</option>
        </select>
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

export function BrandFilter({ brands, onChange }: { brands: Brand[]; onChange: (b: Brand[]) => void }) {
  const toggle = (b: Brand) => onChange(brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b]);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <p className="text-[12px] font-semibold text-[var(--eb-ink-2)]">Brands</p>
        {brands.length ? (
          <button type="button" className="text-[12px] font-medium text-[var(--eb-accent-ink)] underline underline-offset-2" onClick={() => onChange([])}>
            Show all
          </button>
        ) : (
          <span className="text-[12px] text-[var(--eb-muted)]">All shown</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by brand">
        {ALL_BRANDS.map((b) => (
          <button key={b} type="button" aria-pressed={brands.includes(b)} className="eb-chip !min-h-[30px] !px-2.5 !text-[12.5px]" onClick={() => toggle(b)}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
