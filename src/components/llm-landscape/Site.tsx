"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/lib/llm-landscape/model";
import Compare from "./Compare";
import Detail from "./Detail";
import Families from "./Families";
import Timeline from "./Timeline";
import { Released, TierTag, VendorDot } from "./ui";

const DATA_URL = "/llm-landscape/models.json";

export default function Site() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  // URL is the state store (shareable views, no browser storage). Safe to read
  // lazily: until the dataset fetch resolves, every render is the loading
  // screen, so server HTML and first client render always match.
  const [state, setState] = useState<UiState>(() =>
    typeof window === "undefined" ? DEFAULT_STATE : decodeState(window.location.search),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const update = useCallback((patch: Partial<UiState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const filtered = useMemo(() => (data ? applyFilters(data, state) : []), [data, state]);

  const selected: Model | null = useMemo(
    () => (data && state.sel ? (data.models.find((m) => m.id === state.sel) ?? null) : null),
    [data, state.sel],
  );

  const toggle = (key: "vendors" | "access" | "tiers", value: string | number) =>
    setState((s) => {
      const list = s[key] as (string | number)[];
      const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
      return { ...s, [key]: next } as UiState;
    });

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

  const vendors = [...new Set(data.models.map((m) => vendorGroup(m.vendor)))].sort();
  const accesses = [...new Set(data.models.map((m) => m.access).filter(Boolean))] as string[];
  const modalities = [
    ...new Set(data.models.flatMap((m) => [...(m.modalities_in ?? []), ...(m.modalities_out ?? [])])),
  ].sort();
  const years = data.models
    .map((m) => parseReleased(m.released).year)
    .filter((y): y is number => y != null);
  const [minYear, maxYear] = [Math.min(...years), Math.max(...years)];
  const activeFilterCount =
    state.vendors.length +
    state.access.length +
    (state.modality ? 1 : 0) +
    (state.workload ? 1 : 0) +
    (state.years ? 1 : 0) +
    state.tiers.length;

  const compareCandidates = data.models
    .filter((m) => (m.google_equivalents?.length ?? 0) > 0)
    .sort(byReleaseAsc)
    .reverse();

  return (
    <div className="shell">
      <header className="masthead">
        <div className="masthead-row">
          <h1>
            LLM LANDSCAPE<span className="cursor">_</span>
          </h1>
          <div className="snapshot">
            snapshot <strong>{data.meta.snapshot_date}</strong>
            <span className="snapshot-note">every claim carries an evidence grade</span>
          </div>
        </div>
        <p className="tagline">{data.meta.purpose}</p>

        <nav className="tabs" aria-label="Views">
          {(
            [
              ["timeline", "Timeline"],
              ["families", "Families"],
              ["compare", "Compare"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={`tab ${state.view === id ? "tab-on" : ""}`}
              onClick={() => update({ view: id })}
              aria-pressed={state.view === id}
            >
              {label}
            </button>
          ))}
          <button
            className={`tab tab-filters ${activeFilterCount ? "tab-on" : ""}`}
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            Filters{activeFilterCount ? ` (${activeFilterCount})` : ""} {filtersOpen ? "▾" : "▸"}
          </button>
          {activeFilterCount > 0 && (
            <button
              className="tab tab-clear"
              onClick={() =>
                update({
                  vendors: [],
                  access: [],
                  modality: null,
                  workload: null,
                  years: null,
                  tiers: [],
                })
              }
            >
              clear
            </button>
          )}
        </nav>

        {filtersOpen && (
          <div className="filterbar">
            <div className="fgroup">
              <span className="flabel">vendor</span>
              {vendors.map((v) => (
                <button
                  key={v}
                  className={`chip ${state.vendors.includes(v) ? "chip-on" : ""}`}
                  onClick={() => toggle("vendors", v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="fgroup">
              <span className="flabel">access</span>
              {accesses.map((a) => (
                <button
                  key={a}
                  className={`chip ${state.access.includes(a) ? "chip-on" : ""}`}
                  onClick={() => toggle("access", a)}
                >
                  {ACCESS_LABEL[a] ?? a}
                </button>
              ))}
            </div>
            <div className="fgroup">
              <span className="flabel">modality</span>
              {modalities.map((m) => (
                <button
                  key={m}
                  className={`chip ${state.modality === m ? "chip-on" : ""}`}
                  onClick={() => update({ modality: state.modality === m ? null : m })}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="fgroup">
              <span className="flabel">workload</span>
              {data.meta.workloads.map((w) => (
                <button
                  key={w.id}
                  className={`chip ${state.workload === w.id ? "chip-on" : ""}`}
                  onClick={() => update({ workload: state.workload === w.id ? null : w.id })}
                  title={w.definition}
                >
                  {w.label}
                </button>
              ))}
            </div>
            <div className="fgroup">
              <span className="flabel">year</span>
              {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((y) => {
                const on = state.years != null && y >= state.years[0] && y <= state.years[1];
                return (
                  <button
                    key={y}
                    className={`chip ${on ? "chip-on" : ""}`}
                    onClick={() =>
                      update({
                        years:
                          state.years && state.years[0] === y && state.years[1] === y
                            ? null
                            : [y, y],
                      })
                    }
                    title="Click selects a single year; use two clicks on the same year to clear"
                  >
                    {y}
                  </button>
                );
              })}
              {state.years && (
                <span className="flabel">
                  {state.years[0]}–{state.years[1]}
                </span>
              )}
            </div>
            <div className="fgroup">
              <span className="flabel">tier</span>
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  className={`chip ${state.tiers.includes(t) ? "chip-on" : ""}`}
                  onClick={() => toggle("tiers", t)}
                  title={data.meta.tier_definitions[String(t)]}
                >
                  Tier {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="main">
        {state.view === "timeline" && (
          <Timeline models={filtered} onSelect={(id) => update({ sel: id })} />
        )}
        {state.view === "families" && (
          <Families
            models={filtered}
            allModels={data.models}
            onSelect={(id) => update({ sel: id })}
          />
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
