"use client";

import type { Modality, Model, ProviderId, Rung } from "@/lib/pricing/types";
import { PROVIDERS, RUNGS, providerColor } from "@/lib/pricing/presets";

/** Shared filter state — one row above everything it scopes. */
export type Filters = {
  providers: Set<ProviderId>;
  rungs: Set<Rung>;
  maxInput: number | null; // $/1M input ceiling
  minContextK: number;
  modalities: Set<Modality>;
  toolCalling: boolean;
  structuredOutput: boolean;
  reasoning: boolean;
  openWeights: boolean;
  includeLegacy: boolean;
  includeThirdParty: boolean;
};

const ALL_PROVIDERS = () => new Set(PROVIDERS.map((p) => p.id));
const ALL_RUNGS = () => new Set(RUNGS.map((r) => r.id));

export const DEFAULT_FILTERS: Filters = {
  providers: ALL_PROVIDERS(),
  rungs: ALL_RUNGS(),
  maxInput: null,
  minContextK: 0,
  modalities: new Set(),
  toolCalling: false,
  structuredOutput: false,
  reasoning: false,
  openWeights: false,
  includeLegacy: false,
  includeThirdParty: true,
};

export function applyFilters(models: Model[], f: Filters): Model[] {
  return models.filter((m) => {
    if (!f.providers.has(m.provider)) return false;
    if (!f.rungs.has(m.series.rung)) return false;
    if (!f.includeLegacy && m.status === "legacy") return false;
    if (!f.includeThirdParty && m.thirdPartyPricing) return false;
    if (f.maxInput != null && (m.pricing.input == null || m.pricing.input > f.maxInput)) return false;
    if (m.contextK < f.minContextK) return false;
    for (const mod of f.modalities) if (!m.modalitiesIn.includes(mod)) return false;
    if (f.toolCalling && !m.features.toolCalling) return false;
    if (f.structuredOutput && !m.features.structuredOutput) return false;
    if (f.reasoning && m.features.reasoning === "none") return false;
    if (f.openWeights && !m.license) return false;
    return true;
  });
}

/**
 * Focus-style selection: when everything is selected, clicking one item
 * focuses on it alone; clicking more adds them; clicking a selected item
 * removes it; emptying the set snaps back to "all". Same rule for
 * providers and tiers, so "OpenAI vs Google" is two clicks.
 */
function focusToggle<T>(set: Set<T>, item: T, all: () => Set<T>): Set<T> {
  const full = set.size === all().size;
  if (full) return new Set([item]);
  const next = new Set(set);
  if (next.has(item)) {
    next.delete(item);
    return next.size === 0 ? all() : next;
  }
  next.add(item);
  return next;
}

const PRICE_CEILINGS: { label: string; v: number | null }[] = [
  { label: "Any price", v: null },
  { label: "≤ $0.50", v: 0.5 },
  { label: "≤ $1", v: 1 },
  { label: "≤ $2", v: 2 },
  { label: "≤ $5", v: 5 },
];

const CONTEXTS: { label: string; v: number }[] = [
  { label: "Any context", v: 0 },
  { label: "≥ 128k", v: 128 },
  { label: "≥ 200k", v: 200 },
  { label: "≥ 1M", v: 1000 },
];

export default function FilterBar({
  filters,
  onChange,
  count,
  total,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  count: number;
  total: number;
}) {
  const allProv = filters.providers.size === PROVIDERS.length;
  const allRungs = filters.rungs.size === RUNGS.length;
  const toggleMod = (m: Modality) => {
    const next = new Set(filters.modalities);
    if (next.has(m)) next.delete(m);
    else next.add(m);
    onChange({ ...filters, modalities: next });
  };
  const selectedNames = allProv ? "all providers" : PROVIDERS.filter((p) => filters.providers.has(p.id)).map((p) => p.name).join(" vs ");

  return (
    <div className="px-card px-filters" role="group" aria-label="Filters">
      <div className="px-frow">
        <span className="lbl">Providers</span>
        <button className={`px-chip ${allProv ? "on" : ""}`} onClick={() => onChange({ ...filters, providers: ALL_PROVIDERS() })} aria-pressed={allProv}>
          All
        </button>
        {PROVIDERS.map((p) => {
          const on = filters.providers.has(p.id);
          return (
            <button
              key={p.id}
              className={`px-chip prov ${on && !allProv ? "on" : ""} ${!on ? "off" : ""}`}
              style={{ ["--pc" as string]: providerColor(p.id) }}
              onClick={() => onChange({ ...filters, providers: focusToggle(filters.providers, p.id, ALL_PROVIDERS) })}
              title={allProv ? `Focus on ${p.name} only` : on ? `Remove ${p.name}` : `Add ${p.name}`}
              aria-pressed={on && !allProv}
            >
              <span className="sw" aria-hidden />
              <span className="gl" aria-hidden>{p.glyph}</span>
              {p.name}
            </button>
          );
        })}
        <span className="px-focus-hint">
          {allProv ? "Click a provider to focus on it; click more to add." : `Showing ${selectedNames}${filters.providers.size === 2 ? " — head-to-head below" : ""}.`}
        </span>
      </div>

      <div className="px-frow">
        <span className="lbl">Tier</span>
        <button className={`px-chip ${allRungs ? "on" : ""}`} onClick={() => onChange({ ...filters, rungs: ALL_RUNGS() })} aria-pressed={allRungs}>
          All tiers
        </button>
        {RUNGS.map((r) => {
          const on = filters.rungs.has(r.id);
          return (
            <button
              key={r.id}
              className={`px-chip rung-${r.id} ${on && !allRungs ? "on" : ""} ${!on ? "off" : ""}`}
              onClick={() => onChange({ ...filters, rungs: focusToggle(filters.rungs, r.id, ALL_RUNGS) })}
              title={r.desc}
              aria-pressed={on && !allRungs}
            >
              {r.label}
            </button>
          );
        })}
        <span className="px-sep" />
        <select
          className="px-select"
          value={String(filters.maxInput)}
          onChange={(e) => onChange({ ...filters, maxInput: e.target.value === "null" ? null : Number(e.target.value) })}
          aria-label="Input price ceiling per 1M tokens"
        >
          {PRICE_CEILINGS.map((c) => (
            <option key={c.label} value={String(c.v)}>
              {c.label} /1M in
            </option>
          ))}
        </select>
        <select
          className="px-select"
          value={filters.minContextK}
          onChange={(e) => onChange({ ...filters, minContextK: Number(e.target.value) })}
          aria-label="Minimum context window"
        >
          {CONTEXTS.map((c) => (
            <option key={c.label} value={c.v}>
              {c.label}
            </option>
          ))}
        </select>
        <span className="px-sep" />
        {(["image", "audio", "video", "pdf"] as Modality[]).map((m) => (
          <button key={m} className={`px-chip ${filters.modalities.has(m) ? "on" : ""}`} onClick={() => toggleMod(m)} aria-pressed={filters.modalities.has(m)}>
            {m} in
          </button>
        ))}
        <span className="px-sep" />
        <button className={`px-chip ${filters.toolCalling ? "on" : ""}`} onClick={() => onChange({ ...filters, toolCalling: !filters.toolCalling })} aria-pressed={filters.toolCalling}>
          tool calling
        </button>
        <button className={`px-chip ${filters.structuredOutput ? "on" : ""}`} onClick={() => onChange({ ...filters, structuredOutput: !filters.structuredOutput })} aria-pressed={filters.structuredOutput}>
          structured output
        </button>
        <button className={`px-chip ${filters.reasoning ? "on" : ""}`} onClick={() => onChange({ ...filters, reasoning: !filters.reasoning })} aria-pressed={filters.reasoning}>
          reasoning
        </button>
        <button className={`px-chip ${filters.openWeights ? "on" : ""}`} onClick={() => onChange({ ...filters, openWeights: !filters.openWeights })} aria-pressed={filters.openWeights}>
          open weights
        </button>
        <span className="px-sep" />
        <button className={`px-chip ${filters.includeLegacy ? "on" : ""}`} onClick={() => onChange({ ...filters, includeLegacy: !filters.includeLegacy })} aria-pressed={filters.includeLegacy}>
          show legacy
        </button>
        <button className={`px-chip ${filters.includeThirdParty ? "on" : ""}`} onClick={() => onChange({ ...filters, includeThirdParty: !filters.includeThirdParty })} aria-pressed={filters.includeThirdParty}>
          3rd-party hosted
        </button>
        <span className="px-count">
          {count} of {total} models
          {(!allProv || !allRungs || filters.maxInput != null || filters.minContextK > 0 || filters.modalities.size > 0 || filters.toolCalling || filters.structuredOutput || filters.reasoning || filters.openWeights) && (
            <button className="px-reset" onClick={() => onChange({ ...DEFAULT_FILTERS, providers: ALL_PROVIDERS(), rungs: ALL_RUNGS(), modalities: new Set() })}>
              reset
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
