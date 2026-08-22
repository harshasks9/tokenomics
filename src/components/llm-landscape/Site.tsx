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
import Advisor from "./Advisor";
import Detail from "./Detail";
import Families from "./Families";
import Maturity from "./Maturity";
import Timeline from "./Timeline";
import VendorDrawer from "./VendorDrawer";
import { TierTag, setGradeDefs } from "./ui";

const DATA_URL = "/llm-landscape/models.json";

type FacetKey = "vendors" | "access" | "workload" | "tiers";

function HeaderShell({
  children,
  search,
}: {
  children?: React.ReactNode;
  search?: React.ReactNode;
}) {
  return (
    <header className="hdr">
      <div className="hdr-row">
        <div className="hdr-brand">
          <span className="hdr-logo" aria-hidden />
          <h1>LLM Landscape</h1>
        </div>
        {children}
        {search}
      </div>
    </header>
  );
}

export default function Site() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  // URL is the state store (shareable views, no browser storage).
  const [state, setState] = useState<UiState>(() =>
    typeof window === "undefined" ? DEFAULT_STATE : decodeState(window.location.search),
  );
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchIdx, setSearchIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const facetsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const prevOverlay = useRef<{ sheet: boolean; vnd: string | null; view: string }>({
    sheet: false,
    vnd: null,
    view: "timeline",
  });
  const popping = useRef(false);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: Dataset) => {
        setGradeDefs(d.meta.evidence_grades);
        setData(d);
      })
      .catch((e) => setError(String(e)));
  }, []);

  // state -> URL. Opening an overlay (record sheet / vendor drawer / advisor
  // head-to-head) pushes a history entry so browser Back closes it; everything
  // else replaces.
  useEffect(() => {
    const next = `${window.location.pathname}${encodeState(state)}`;
    const cur = `${window.location.pathname}${window.location.search}`;
    if (cur !== next) {
      const sheet = Boolean(state.sel && state.view !== "advisor");
      const openedOverlay =
        (sheet && !prevOverlay.current.sheet) ||
        (state.vnd && !prevOverlay.current.vnd) ||
        (state.view === "advisor" && prevOverlay.current.view !== "advisor");
      if (!popping.current && openedOverlay) {
        window.history.pushState(null, "", next);
      } else if (!popping.current) {
        window.history.replaceState(null, "", next);
      }
    }
    popping.current = false;
    prevOverlay.current = {
      sheet: Boolean(state.sel && state.view !== "advisor"),
      vnd: state.vnd,
      view: state.view,
    };
  }, [state]);

  useEffect(() => {
    const onPop = () => {
      popping.current = true;
      setState(decodeState(window.location.search));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Global keys: "/" or Cmd/Ctrl+K focus search; Escape closes overlays.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inField = /^(INPUT|SELECT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.key === "/" && !inField) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      } else if (e.key === "Escape") {
        setOpenFacet(null);
        setSearchOpen(false);
        setState((s) =>
          s.vnd ? { ...s, vnd: null } : s.sel && s.view !== "advisor" ? { ...s, sel: null } : s,
        );
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close popovers on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (facetsRef.current && !facetsRef.current.contains(e.target as Node)) setOpenFacet(null);
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const update = useCallback((patch: Partial<UiState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const filtered = useMemo(() => (data ? applyFilters(data, state) : []), [data, state]);
  const filteredIds = useMemo(() => new Set(filtered.map((m) => m.id)), [filtered]);

  const selected: Model | null = useMemo(
    () => (data && state.sel ? (data.models.find((m) => m.id === state.sel) ?? null) : null),
    [data, state.sel],
  );

  // Sheet prev/next within the filtered, chronological order (records only).
  const sheetList = useMemo(
    () => filtered.filter((m) => m.tier < 3).sort(byReleaseAsc),
    [filtered],
  );
  const sheetIdx = selected ? sheetList.findIndex((m) => m.id === selected.id) : -1;

  // Lock body scroll while a side pane (record sheet / vendor drawer) is open.
  useEffect(() => {
    const open = Boolean((selected && state.view !== "advisor") || state.vnd);
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [selected, state.view, state.vnd]);

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
                : (m.alternatives ?? []).map((r) => r.workload);
        for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      return counts;
    },
    [data, state],
  );

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard
      ?.writeText(url)
      .then(() => setToast("Link copied — this view is shareable"))
      .catch(() => setToast(url));
    setTimeout(() => setToast(null), 2600);
  };

  /* ---------- loading / error shells ---------- */
  if (error) {
    return (
      <div className="shell">
        <HeaderShell />
        <div className="empty">Failed to load the dataset ({error}). Reload to retry.</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="shell">
        <HeaderShell>
          <nav className="seg" aria-hidden>
            {["Timeline", "Families", "Advisor", "Maturity"].map((l) => (
              <button key={l} className="seg-btn" disabled>
                {l}
              </button>
            ))}
          </nav>
        </HeaderShell>
        <div className="fbar">
          <div className="fbar-row">
            <span className="skel skel-pill" />
            <span className="skel skel-pill" />
            <span className="skel skel-pill" />
          </div>
        </div>
        <main className="main">
          <div className="tl skel-chart" aria-label="Loading">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skel skel-lane" style={{ width: `${88 - i * 9}%` }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* ---------- loaded ---------- */
  const vendorOptions = [...new Set(data.models.map((m) => vendorGroup(m.vendor)))].sort();
  const accessOptions = [...new Set(data.models.map((m) => m.access).filter(Boolean))] as string[];
  const yearsPresent = [
    ...new Set(
      data.models.map((m) => parseReleased(m.released).year).filter((y): y is number => y != null),
    ),
  ]
    .filter((y) => y >= 2022)
    .sort();

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

  const chips: { label: string; onRemove: () => void }[] = [];
  if (state.q) chips.push({ label: `“${state.q}”`, onRemove: () => update({ q: "" }) });
  for (const v of state.vendors) chips.push({ label: v, onRemove: () => toggleList("vendors", v) });
  for (const a of state.access)
    chips.push({ label: ACCESS_LABEL[a] ?? a, onRemove: () => toggleList("access", a) });
  if (state.workload)
    chips.push({ label: wlLabel(state.workload), onRemove: () => update({ workload: null }) });
  if (state.years)
    chips.push({
      label:
        state.years[0] === state.years[1] ? `${state.years[0]}` : `${state.years[0]}–${state.years[1]}`,
      onRemove: () => update({ years: null }),
    });
  for (const t of state.tiers) chips.push({ label: `Tier ${t}`, onRemove: () => toggleList("tiers", t) });

  const compareCandidates = (filtered.length && (state.q || chips.length) ? filtered : data.models)
    .filter((m) => m.tier < 3)
    .sort(byReleaseAsc)
    .reverse();
  const modelB = state.b ? (data.models.find((m) => m.id === state.b) ?? null) : null;

  // Search-jump results: records first, then stubs.
  const q = state.q.trim().toLowerCase();
  const searchResults = q
    ? data.models
        .filter((m) => `${m.name} ${m.vendor} ${m.family}`.toLowerCase().includes(q))
        .sort((a, b) => a.tier - b.tier || byReleaseAsc(b, a))
        .slice(0, 8)
    : [];

  const openSearchResult = (m: Model) => {
    setSearchOpen(false);
    if (m.tier < 3) update({ sel: m.id });
    else setToast(`${m.name} is a lineage stub — no full record. ${m.note ?? ""}`.slice(0, 140));
    if (m.tier === 3) setTimeout(() => setToast(null), 3200);
  };

  const stats = {
    total: data.models.length,
    t1: data.models.filter((m) => m.tier === 1).length,
    open: data.models.filter((m) => m.access === "open-weights").length,
    guides: data.meta.workload_guides?.length ?? 0,
    categories: data.meta.maturity?.length ?? 0,
  };

  const facetDefs: {
    key: FacetKey;
    label: string;
    caption?: string;
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
      caption: "Models with an analyst alternatives entry for this workload",
      options: data.meta.workloads.map((w) => ({ value: w.id, label: w.label })),
      active: state.workload ? 1 : 0,
      isOn: (v) => state.workload === v,
      toggle: (v) => update({ workload: state.workload === v ? null : v }),
    },
    {
      key: "tiers",
      label: "Tier",
      caption: "1 landmark · 2 compact record · 3 lineage stub",
      options: [1, 2, 3].map((t) => ({ value: String(t), label: `Tier ${t}` })),
      active: state.tiers.length,
      isOn: (v) => state.tiers.includes(Number(v)),
      toggle: (v) => toggleList("tiers", Number(v)),
    },
  ];

  return (
    <div className="shell">
      <HeaderShell
        search={
          <div className="hdr-search-box" ref={searchBoxRef}>
            <input
              ref={searchRef}
              className="hdr-search"
              type="search"
              placeholder="Search models or vendors…"
              value={state.q}
              onChange={(e) => {
                update({ q: e.target.value });
                setSearchOpen(true);
                setSearchIdx(0);
              }}
              onFocus={() => state.q && setSearchOpen(true)}
              onKeyDown={(e) => {
                if (!searchOpen || searchResults.length === 0) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSearchIdx((i) => Math.min(i + 1, searchResults.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSearchIdx((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  openSearchResult(searchResults[searchIdx]);
                }
              }}
              aria-label="Search models"
            />
            <kbd className="hdr-kbd" aria-hidden>/</kbd>
            {searchOpen && q && (
              <div className="search-pop" role="listbox" aria-label="Search results">
                {searchResults.length === 0 && <div className="search-none">No matches</div>}
                {searchResults.map((m, i) => (
                  <button
                    key={m.id}
                    className={`search-item ${i === searchIdx ? "hot" : ""}`}
                    onMouseEnter={() => setSearchIdx(i)}
                    onClick={() => openSearchResult(m)}
                    role="option"
                    aria-selected={i === searchIdx}
                  >
                    <i className="dot" style={{ background: vendorHue(m.vendor) }} aria-hidden />
                    <span className="search-name">{m.name}</span>
                    <span className="search-meta">
                      {vendorGroup(m.vendor)} · {parseReleased(m.released).display}
                    </span>
                    <TierTag tier={m.tier} />
                  </button>
                ))}
                <div className="search-hint">↑↓ to choose · Enter opens the record</div>
              </div>
            )}
          </div>
        }
      >
        <span className="hdr-snapshot" title="All facts frozen at this date; per-record last_verified shown on each card">
          snapshot {data.meta.snapshot_date}
        </span>
        <nav className="seg" aria-label="Views">
          {(
            [
              ["timeline", "Timeline"],
              ["families", "Families"],
              ["advisor", "Advisor"],
              ["maturity", "Maturity"],
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
        <button className="hdr-share" onClick={copyLink} title="Copy a shareable link to this exact view">
          Share view
        </button>
      </HeaderShell>

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
                    {f.caption && <div className="facet-caption">{f.caption}</div>}
                    {f.options.map((o) => {
                      const n = counts?.get(o.value) ?? 0;
                      return (
                        <label
                          key={o.value}
                          className={`facet-opt ${n === 0 && !f.isOn(o.value) ? "zero" : ""}`}
                        >
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

          <span className="fbar-count" aria-live="polite">
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
        {state.view === "timeline" && (
          <>
            <div className="tiles" role="group" aria-label="Dataset at a glance">
              <button className="tile" onClick={clearAll}>
                <b>{stats.total}</b>
                <span>models tracked</span>
              </button>
              <button
                className={`tile ${state.tiers.length === 1 && state.tiers[0] === 1 ? "on" : ""}`}
                onClick={() => update({ tiers: state.tiers.length === 1 && state.tiers[0] === 1 ? [] : [1] })}
              >
                <b>{stats.t1}</b>
                <span>landmark releases</span>
              </button>
              <button
                className={`tile ${state.access.length === 1 && state.access[0] === "open-weights" ? "on" : ""}`}
                onClick={() =>
                  update({
                    access:
                      state.access.length === 1 && state.access[0] === "open-weights"
                        ? []
                        : ["open-weights"],
                  })
                }
              >
                <b>{stats.open}</b>
                <span>open-weights models</span>
              </button>
              <button className="tile" onClick={() => update({ view: "advisor", sel: null, b: null })}>
                <b>{stats.guides}</b>
                <span>buyer&apos;s guides</span>
              </button>
              <button className="tile" onClick={() => update({ view: "maturity" })}>
                <b>{stats.categories}</b>
                <span>categories rated</span>
              </button>
            </div>
            {filtered.length === 0 ? (
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
                onVendor={(v) => update({ vnd: v })}
              />
            )}
          </>
        )}
        {state.view === "families" && (
          <Families
            models={filtered}
            allModels={data.models}
            filteredIds={filteredIds}
            onSelect={(id) => update({ sel: id })}
          />
        )}
        {state.view === "advisor" && (
          <Advisor
            data={data}
            a={selected}
            b={modelB}
            workload={state.cmp}
            candidates={compareCandidates}
            onChangeA={(id) => update({ sel: id })}
            onChangeB={(id) => update({ b: id })}
            onPickWorkload={(w) => update({ cmp: w })}
            onOpenRecord={(id) => update({ view: "timeline", sel: id })}
            onExitCompare={() => update({ sel: null, b: null })}
          />
        )}
        {state.view === "maturity" && <Maturity data={data} onVendor={(v) => update({ vnd: v })} />}
      </main>

      {selected && state.view !== "advisor" && (
        <>
          <div className="scrim" onClick={() => update({ sel: null })} aria-hidden />
          <Detail
            model={selected}
            data={data}
            onClose={() => update({ sel: null })}
            onHeadToHead={(bId, w) => update({ view: "advisor", b: bId, cmp: w })}
            onJump={(id) => update({ sel: id })}
            onVendor={(v) => update({ vnd: v })}
            onPrev={sheetIdx > 0 ? () => update({ sel: sheetList[sheetIdx - 1].id }) : undefined}
            onNext={
              sheetIdx >= 0 && sheetIdx < sheetList.length - 1
                ? () => update({ sel: sheetList[sheetIdx + 1].id })
                : undefined
            }
          />
        </>
      )}

      {state.vnd && (
        <>
          <div className="scrim" onClick={() => update({ vnd: null })} aria-hidden />
          <VendorDrawer
            vendor={state.vnd}
            data={data}
            onClose={() => update({ vnd: null })}
            onSelect={(id) =>
              update({
                vnd: null,
                sel: id,
                view: state.view === "advisor" ? "timeline" : state.view,
              })
            }
          />
        </>
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
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
