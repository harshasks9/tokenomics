"use client";

import type { Modality, Model, ProviderId } from "@/lib/pricing/types";
import { PROVIDERS, providerColor } from "@/lib/pricing/presets";

/** Shared filter state — one row above everything it scopes. */
export type Filters = {
  providers: Set<ProviderId>;
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

export const DEFAULT_FILTERS: Filters = {
  providers: new Set(PROVIDERS.map((p) => p.id)),
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
  const toggleProvider = (id: ProviderId) => {
    const next = new Set(filters.providers);
    if (next.has(id)) {
      if (next.size === 1) {
        // last one off → reset to all (never an empty chart)
        PROVIDERS.forEach((p) => next.add(p.id));
      } else next.delete(id);
    } else next.add(id);
    onChange({ ...filters, providers: next });
  };
  const soloProvider = (id: ProviderId) => onChange({ ...filters, providers: new Set([id]) });
  const toggleMod = (m: Modality) => {
    const next = new Set(filters.modalities);
    if (next.has(m)) next.delete(m);
    else next.add(m);
    onChange({ ...filters, modalities: next });
  };
  const allOn = filters.providers.size === PROVIDERS.length;

  return (
    <div className="px-card px-filters" role="group" aria-label="Filters">
      <span className="lbl">Provider</span>
      <button className={`px-chip ${allOn ? "on" : ""}`} onClick={() => onChange({ ...filters, providers: new Set(PROVIDERS.map((p) => p.id)) })}>
        All
      </button>
      {PROVIDERS.map((p) => {
        const on = filters.providers.has(p.id);
        return (
          <button
            key={p.id}
            className={`px-chip ${on && !allOn ? "on" : ""}`}
            style={on ? undefined : { opacity: 0.45 }}
            onClick={() => toggleProvider(p.id)}
            onDoubleClick={() => soloProvider(p.id)}
            title={`${p.name} — click to toggle, double-click to solo`}
            aria-pressed={on}
          >
            <span className="sw" style={{ background: providerColor(p.id) }} aria-hidden />
            <span className="gl" aria-hidden>{p.glyph}</span>
            {p.name}
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
      <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-3)", fontWeight: 600 }}>
        {count} of {total} models
      </span>
    </div>
  );
}
