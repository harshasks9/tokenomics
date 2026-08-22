"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dataset, Model } from "@/lib/llm-landscape/types";
import {
  ACCESS_LABEL,
  DEFAULT_STATE,
  type UiState,
  applyFilters,
  byReleaseAsc,
  decodeState,
  encodeState,
  parseReleased,
  vendorGroup,
  vendorHue,
} from "@/lib/llm-landscape/model";
import Compare from "./Compare";
import Detail from "./Detail";
import Families from "./Families";
import Timeline from "./Timeline";
import { Released, TierTag, VendorDot } from "./ui";

const DATA_URL = "/llm-landscape/models.json";

type FacetKey = "vendors" | "access" | "workload" | "tiers";

export default function Site() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  // URL is the state store (shareable views, no browser storage). Safe to read
  // lazily: until the dataset fetch resolves, every render is the loading
  // screen, so server HTML and first client render always match.
  const [state, setState] = useState<UiState>(() =>
    typeof window === "undefined" ? DEFAULT_STATE : decodeState(window.location.search),
  );
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null);
  const facetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: Dataset) => setData(d))
      .catch((e) => setError(String(e)));
  }, []);

  // state -> URL (external system sync; a no-op when nothing changed).
  useEffect(() => {
    const next = `${window.location.pathname}${encodeState(state)}`;
    if (`${window.location.pathname}${window.location.search}` !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [state]);

  // Close facet popovers on outside click / Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (facetsRef.current && !facetsRef.current.contains(e.target as Node)) setOpenFacet(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFacet(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const update = useCallback((patch: Partial<UiState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const filtered = useMemo(() => (data ? applyFilters(data, state) : []), [data, state]);

  const selected: Model | null = useMemo(
    () => (data && state.sel ? (data.models.find((m) => m.id === state.sel) ?? null) : null),
    [data, state.sel],
  );

  // Faceted counts: count options against every filter EXCEPT the facet itself.
  const countsFor = useCallback(
    (facet: FacetKey): Map<string, number> => {
      const counts = new Map<string, number>();
      if (!data) return counts;
      const probe: UiState = { ...state };
      if (facet === "vendors") probe.vendors = [];
      if (facet === "access") probe.access = [];
      if (facet === "workload") probe.workload = null;
      if (facet === "tiers") probe.tiers = [];
      for (const m of applyFilters(data, probe)) {
        const keys: string[] =
          facet === "vendors"
            ? [vendorGroup(m.vendor)]
            : facet === "access"
              ? m.access
                ? [m.access]
                : []
              : facet === "tiers"
                ? [String(m.tier)]
                : (m.google_equivalents ?? []).map((r) => r.workload);
        for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      return counts;
    },
    [data, state],
  );

  if (error) {
    return (
      <div className="shell">
        <div className="empty">Failed to load the dataset ({error}). Reload to retry.</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="shell">
        <div className="empty">Loading the landscape…</div>
      </div>
    );
  }

  const vendorOptions = [...new Set(data.models.map((m) => vendorGroup(m.vendor)))].sort();
  const accessOptions = [...new Set(data.models.map((m) => m.access).filter(Boolean))] as string[];
  const yearsPresent = [
    ...new Set(
      data.models.map((m) => parseReleased(m.released).year).filter((y): y is number => y != null),
    ),
  ].sort();

  const toggleList = (key: "vendors" | "access" | "tiers", value: string | number) =>
    setState((s) => {
      const list = s[key] as (string | number)[];
      const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
      return { ...s, [key]: next } as UiState;
    });

  const clickYear = (y: number) =>
    setState((s) => {
      if (!s.years) return { ...s, years: [y, y] };
      const [a, b] = s.years;
      if (y >= a && y <= b) return { ...s, years: null };
      return { ...s, years: [Math.min(a, y), Math.max(b, y)] };
    });

  const clearAll = () =>
    update({ q: "", vendors: [], access: [], modality: null, workload: null, years: null, tiers: [] });

  const wlLabel = (id: string) => data.meta.workloads.find((w) => w.id === id)?.label ?? id;

  // Active chips.
  const chips: { label: string; onRemove: () => void }[] = [];
  if (state.q) chips.push({ label: `“${state.q}”`, onRemove: () => update({ q: "" }) });
  for (const v of state.vendors)
    chips.push({ label: v, onRemove: () => toggleList("vendors", v) });
  for (const a of state.access)
    chips.push({ label: ACCESS_LABEL[a] ?? a, onRemove: () => toggleList("access", a) });
  if (state.workload)
    chips.push({ label: wlLabel(state.workload), onRemove: () => update({ workload: null }) });
  if (state.years)
    chips.push({
      label: state.years[0] === state.years[1] ? `${state.years[0]}` : `${state.years[0]}–${state.years[1]}`,
      onRemove: () => update({ years: null }),
    });
  for (const t of state.tiers)
    chips.push({ label: `Tier ${t}`, onRemove: () => toggleList("tiers", t) });

  const compareCandidates = data.models
    .filter((m) => (m.google_equivalents?.length ?? 0) > 0)
    .sort(byReleaseAsc)
    .reverse();

  const facetDefs: {
    key: FacetKey;
    label: string;
    options: { value: string; label: string }[];
    active: number;
    isOn: (v: string) => boolean;
    toggle: (v: string) => void;
  }[] = [
    {
      key: "vendors",
      label: "Vendor",
      options: vendorOptions.map((v) => ({ value: v, label: v })),
      active: state.vendors.length,
      isOn: (v) => state.vendors.includes(v),
      toggle: (v) => toggleList("vendors", v),
    },
    {
      key: "access",
      label: "Access",
      options: accessOptions.map((a) => ({ value: a, label: ACCESS_LABEL[a] ?? a })),
      active: state.access.length,
      isOn: (v) => state.access.includes(v),
      toggle: (v) => toggleList("access", v),
    },
    {
      key: "workload",
      label: "Workload",
      options: data.meta.workloads.map((w) => ({ value: w.id, label: w.label })),
      active: state.workload ? 1 : 0,
      isOn: (v) => state.workload === v,
      toggle: (v) => update({ workload: state.workload === v ? null : v }),
    },
    {
      key: "tiers",
      label: "Tier",
      options: [1, 2, 3].map((t) => ({ value: String(t), label: `Tier ${t}` })),
      active: state.tiers.length,
      isOn: (v) => state.tiers.includes(Number(v)),
      toggle: (v) => toggleList("tiers", Number(v)),
    },
  ];

  return (
    <div className="shell">
      <header className="hdr">
        <div className="hdr-row">
          <div className="hdr-brand">
            <span className="hdr-logo" aria-hidden />
            <h1>LLM Landscape</h1>
            <span className="hdr-snapshot">snapshot {data.meta.snapshot_date}</span>
          </div>
          <nav className="seg" aria-label="Views">
            {(
              [
                ["timeline", "Timeline"],
                ["families", "Families"],
                ["compare", "Compare"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                className={`seg-btn ${state.view === id ? "on" : ""}`}
                onClick={() => update({ view: id })}
                aria-pressed={state.view === id}
              >
                {label}
              </button>
            ))}
          </nav>
          <input
            className="hdr-search"
            type="search"
            placeholder="Search models or vendors…"
            value={state.q}
            onChange={(e) => update({ q: e.target.value })}
            aria-label="Search models"
          />
        </div>
      </header>

      <div className="fbar">
        <div className="fbar-row" ref={facetsRef}>
          {facetDefs.map((f) => {
            const counts = openFacet === f.key ? countsFor(f.key) : null;
            return (
              <div key={f.key} className="facet">
                <button
                  className={`facet-btn ${f.active ? "active" : ""}`}
                  onClick={() => setOpenFacet(openFacet === f.key ? null : f.key)}
                  aria-expanded={openFacet === f.key}
                >
                  {f.label}
                  {f.active > 0 && <b>{f.active}</b>}
                  <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden>
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                {openFacet === f.key && (
                  <div className="facet-pop" role="listbox" aria-label={f.label}>
                    {f.options.map((o) => {
                      const n = counts?.get(o.value) ?? 0;
                      return (
                        <label key={o.value} className={`facet-opt ${n === 0 && !f.isOn(o.value) ? "zero" : ""}`}>
                          <input
                            type="checkbox"
                            checked={f.isOn(o.value)}
                            onChange={() => f.toggle(o.value)}
                          />
                          {f.key === "vendors" && (
                            <i className="dot" style={{ background: vendorHue(o.value) }} aria-hidden />
                          )}
                          <span>{o.label}</span>
                          <em>{n}</em>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="facet-years" role="group" aria-label="Year range">
            {yearsPresent.map((y) => {
              const on = state.years != null && y >= state.years[0] && y <= state.years[1];
              return (
                <button
                  key={y}
                  className={`yr ${on ? "on" : ""}`}
                  onClick={() => clickYear(y)}
                  title="Click a year to filter; click a second year to extend the range; click inside the range to clear"
                >
                  {y}
                </button>
              );
            })}
          </div>

          <span className="fbar-count">
            <b>{filtered.length}</b> of {data.models.length} models
          </span>
        </div>

        {chips.length > 0 && (
          <div className="chips-row">
            {chips.map((c, i) => (
              <button key={i} className="chip-x" onClick={c.onRemove}>
                {c.label} <span aria-hidden>×</span>
              </button>
            ))}
            <button className="chip-clear" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}
      </div>

      <main className="main">
        {state.view === "timeline" &&
          (filtered.length === 0 ? (
            <div className="empty">
              No models match. Loosen a filter — the chips above remove with one click.
            </div>
          ) : (
            <Timeline
              models={filtered}
              allModels={data.models}
              snapshot={data.meta.snapshot_date}
              onSelect={(id) => update({ sel: id })}
              onApplyYears={(range) => update({ years: range })}
            />
          ))}
        {state.view === "families" && (
          <Families models={filtered} allModels={data.models} onSelect={(id) => update({ sel: id })} />
        )}
        {state.view === "compare" &&
          (selected ? (
            <Compare
              model={selected}
              workload={state.cmp}
              data={data}
              onChangeWorkload={(w) => update({ cmp: w })}
              onOpenRecord={(id) => update({ view: "timeline", sel: id })}
            />
          ) : (
            <div className="picker">
              <h3>Pick the model you run today</h3>
              <p className="picker-sub">
                Each opens a side-by-side against its honest Google equivalent, per workload.
              </p>
              <div className="picker-grid">
                {compareCandidates.map((m) => (
                  <button
                    key={m.id}
                    className="picker-card"
                    onClick={() => update({ sel: m.id, cmp: m.google_equivalents![0].workload })}
                  >
                    <VendorDot vendor={m.vendor} />
                    <span className="picker-name">{m.name}</span>
                    <span className="picker-meta">
                      <TierTag tier={m.tier} /> <Released model={m} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
      </main>

      {selected && state.view !== "compare" && (
        <>
          <div className="scrim" onClick={() => update({ sel: null })} aria-hidden />
          <Detail
            model={selected}
            data={data}
            onClose={() => update({ sel: null })}
            onCompare={(w) => update({ view: "compare", cmp: w })}
            onJump={(id) => update({ sel: id })}
          />
        </>
      )}

      <footer className="foot">
        <p>{data.meta.disclaimer}</p>
        <div className="legend">
          {Object.entries(data.meta.evidence_grades).map(([k, v]) => (
            <span key={k} className="legend-item">
              <strong>{k}</strong> — {v}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
