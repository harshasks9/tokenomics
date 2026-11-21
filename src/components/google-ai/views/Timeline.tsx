"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { addDays, daysBetween, fmtDate } from "@/lib/google-ai/dates";
import { surfaceLabel } from "@/lib/google-ai/engine/answer";
import { currentModelsAt, nameAt, snapshotAt, statusAt, type StatusAt } from "@/lib/google-ai/engine/asof";
import { TYPE_LABEL } from "@/lib/google-ai/engine/brief";
import { headline } from "@/lib/google-ai/engine/pricing";
import {
  TRACKS,
  TRACK_LABEL,
  buildTimeline,
  clampDate,
  coverageAt,
  density,
  diffSnapshots,
  earliestRecord,
  findEvent,
  landmarkEvents,
  pendingAt,
  placeDots,
  placeLabels,
  plotDate,
  timeTicks,
  xFrac,
  type PlacedLabel,
  type UnifiedEvent,
} from "@/lib/google-ai/engine/timeline";
import { ENTITIES, ENTITY_BY_ID, LAYERS, MODELS, providerName, fmtIntro } from "@/lib/google-ai/kb";
import type { LifecycleType, PriceRecord, TimelineTrack } from "@/lib/google-ai/types";
import { Cites, Empty, EntityLink, Ev, Imp, Sec, Seg, Status, providerColor, usd, useHub } from "../ui";
import "./timeline.css";

const TABS = [
  { id: "timeline", label: "Timeline" },
  { id: "machine", label: "Time machine" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const PRESETS = [
  { id: "all", label: "All" },
  { id: "2023", label: "Since 2023" },
  { id: "24m", label: "Last 24 months" },
  { id: "12m", label: "Last 12 months" },
  { id: "90d", label: "Last 90 days" },
] as const;
type PresetId = (typeof PRESETS)[number]["id"] | "custom";
const PRESET_DAYS: Record<"24m" | "12m" | "90d", number> = { "24m": 730, "12m": 365, "90d": 90 };

const SIG_OPTS = [
  { id: "1", label: "All events" },
  { id: "2", label: "Notable and above" },
  { id: "3", label: "Major only" },
] as const;
const SIG_WORD: Record<number, string> = { 1: "standard", 2: "notable", 3: "major" };
const ORIGIN_LABEL: Record<UnifiedEvent["origin"], string> = { timeline: "Curated milestone", announcement: "Development", lifecycle: "Lifecycle record" };
const SHORT_TRACK: Record<TimelineTrack, string> = { macro: "Macro", model: "Models", platform: "Platform", infrastructure: "Infra", research: "Research", pricing: "Pricing", competitive: "Rivals" };
const LIFE_LABEL: Record<LifecycleType, string> = {
  announced: "Announcement",
  preview: "Preview",
  ga: "General availability",
  updated: "Update",
  renamed: "Rename",
  "price-change": "Price change",
  deprecated: "Deprecation",
  "retirement-scheduled": "Retirement",
  retired: "Retirement",
};
const UNIT: Record<string, string> = { "usd-per-1m-tokens": "/ 1M tokens", "usd-per-image": "/ image", "usd-per-second": "/ second", "usd-per-user-month": "/ user / month", "usd-per-1k-requests": "/ 1K requests", "usd-per-hour": "/ hour", "usd-other": "" };
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Local state seeded from a URL parameter, and re-seeded whenever that parameter changes (in-app navigation). */
function useParam<T>(raw: string | null, parse: (raw: string | null) => T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => parse(raw));
  const [seen, setSeen] = useState(raw);
  if (raw !== seen) {
    setSeen(raw);
    setValue(parse(raw));
  }
  return [value, setValue];
}

/** Where an event is drawn. A month- or year-only date sits mid-period, but never on the far side of today unless it is scheduled. */
function at(e: UnifiedEvent, today: string): string {
  const d = plotDate(e);
  return !e.scheduled && d > today ? today : d;
}
function clip(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
function nameOn(id: string, date: string): string {
  const e = ENTITY_BY_ID[id];
  return e ? nameAt(e, date) : id;
}

export default function Timeline() {
  const { today } = useHub();
  const sp = useSearchParams();
  const events = useMemo(() => buildTimeline(today), [today]);
  const minDate = useMemo(() => earliestRecord(today), [today]);

  const [tab, setTab] = useParam<Tab>(sp.get("tab"), (r) => (r === "machine" ? "machine" : "timeline"));
  const [date, setDate] = useParam<string>(sp.get("date"), (r) => clampDate(r, minDate, today));
  const [vs, setVs] = useParam<string>(sp.get("vs"), (r) => (r ? clampDate(r, minDate, today, "") : ""));
  const [selected, setSelected] = useParam<string | null>(sp.get("focus"), (r) => findEvent(events, r)?.id ?? null);

  // Keep the address shareable. Written after a short pause so dragging the slider does not flood the history API.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        const put = (k: string, v: string | null) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
        put("tab", tab === "machine" ? "machine" : null);
        put("date", date !== today ? date : null);
        put("vs", vs || null);
        put("focus", selected);
        const next = url.pathname + url.search + url.hash;
        if (next !== window.location.pathname + window.location.search + window.location.hash) window.history.replaceState(null, "", next);
      } catch {
        /* history API unavailable: the view still works, the address just is not updated */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [tab, date, vs, selected, today]);

  return (
    <>
      <header className="gai-hero">
        <div className="gai-page-ico" aria-hidden>🕰️</div>
        <h1 className="gai-h1">Timeline</h1>
        <p className="gai-lede">Everything dated on one axis, and a time machine that shows the ecosystem as it stood on any past date.</p>
      </header>
      <Seg value={tab} onChange={setTab} options={TABS} label="View" />
      {tab === "timeline" ? (
        <TimelineTab
          events={events}
          today={today}
          selected={selected}
          onSelect={setSelected}
          onTimeMachine={(d) => {
            setDate(clampDate(d, minDate, today));
            setTab("machine");
            window.scrollTo({ top: 0 });
          }}
        />
      ) : (
        <TimeMachine events={events} today={today} minDate={minDate} date={date} setDate={setDate} vs={vs} setVs={setVs} />
      )}
    </>
  );
}

// ───────────────────────── A. timeline ─────────────────────────

function TimelineTab({ events, today, selected, onSelect, onTimeMachine }: { events: UnifiedEvent[]; today: string; selected: string | null; onSelect: (id: string | null) => void; onTimeMachine: (date: string) => void }) {
  const { mode } = useHub();
  const span = useMemo(() => {
    if (!events.length) return null;
    let min = at(events[0], today);
    let max = min;
    for (const e of events) {
      const d = at(e, today);
      if (d < min) min = d;
      if (d > max) max = d;
    }
    return { min, max };
  }, [events, today]);

  const [preset, setPreset] = useState<PresetId>(() => {
    const sel = events.find((e) => e.id === selected);
    const from = addDays(today, -PRESET_DAYS["24m"]);
    const recent = events.some((e) => at(e, today) >= from && at(e, today) <= today);
    return (sel && (at(sel, today) < from || at(sel, today) > today)) || !recent ? "all" : "24m";
  });
  const [custom, setCustom] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [hiddenTracks, setHiddenTracks] = useState<TimelineTrack[]>([]);
  const [hiddenProviders, setHiddenProviders] = useState<string[]>([]);
  const [minSig, setMinSig] = useState<"1" | "2" | "3">(mode === "executive" ? "2" : "1");
  const [compare, setCompare] = useState(false);
  const [shown, setShown] = useState(40);

  const customOk = ISO.test(custom.from) && ISO.test(custom.to) && custom.from < custom.to;
  const range = useMemo(() => {
    if (preset === "custom" && customOk) return { from: custom.from, to: custom.to };
    if (preset === "all" || preset === "custom") {
      const hi = span && span.max > today ? span.max : today;
      const lo = span && span.min < hi ? span.min : addDays(hi, -30);
      return { from: lo, to: hi };
    }
    return { from: preset === "2023" ? "2023-01-01" : addDays(today, -PRESET_DAYS[preset]), to: today };
  }, [preset, customOk, custom.from, custom.to, span, today]);

  const providers = useMemo(() => {
    const count: Record<string, number> = {};
    for (const e of events) count[e.providerId] = (count[e.providerId] ?? 0) + 1;
    return Object.keys(count).sort((a, b) => Number(b === "google") - Number(a === "google") || count[b] - count[a] || a.localeCompare(b));
  }, [events]);

  const filtered = useMemo(
    () => events.filter((e) => !hiddenTracks.includes(e.track) && !hiddenProviders.includes(e.providerId) && e.significance >= Number(minSig)),
    [events, hiddenTracks, hiddenProviders, minSig],
  );
  const visible = useMemo(
    () =>
      filtered.filter((e) => {
        const d = at(e, today);
        return d >= range.from && d <= range.to;
      }),
    [filtered, range.from, range.to, today],
  );
  const later = useMemo(() => filtered.filter((e) => e.scheduled && at(e, today) > range.to), [filtered, range.to, today]);
  const listed = useMemo(() => visible.slice().sort((a, b) => b.date.localeCompare(a.date) || b.significance - a.significance), [visible]);
  const groups = useMemo(() => {
    const years: { year: string; months: { key: string; label: string; rows: UnifiedEvent[] }[] }[] = [];
    for (const e of listed.slice(0, shown)) {
      const year = e.date.slice(0, 4);
      const key = e.precision === "year" ? `${year}-year` : e.date.slice(0, 7);
      let y = years[years.length - 1];
      if (!y || y.year !== year) years.push((y = { year, months: [] }));
      let m = y.months.find((x) => x.key === key);
      if (!m) y.months.push((m = { key, label: e.precision === "year" ? "Year only" : fmtDate(e.date, "month"), rows: [] }));
      m.rows.push(e);
    }
    return years;
  }, [listed, shown]);

  const sel = events.find((e) => e.id === selected);
  const tracks = TRACKS.filter((t) => !hiddenTracks.includes(t.id));
  const filtersOn = hiddenTracks.length > 0 || hiddenProviders.length > 0 || minSig !== "1";
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const setEdge = (edge: "from" | "to", value: string) => {
    setCustom({ ...range, [edge]: value });
    setPreset("custom");
  };

  if (!events.length) {
    return (
      <div style={{ marginTop: 12 }}>
        <Empty title="No dated events recorded">The knowledge base holds no timeline milestone, development, price change or retirement with a date yet, so there is nothing to draw.</Empty>
      </div>
    );
  }

  return (
    <>
      <div className="gai-card gai-tl-controls">
        <div className="gai-row">
          <Seg<PresetId> value={preset} onChange={setPreset} options={PRESETS} label="Time window" />
          <label className="gai-tl-field">
            From
            <input type="date" className="gai-input" value={range.from} max={range.to} onChange={(e) => setEdge("from", e.target.value)} />
          </label>
          <label className="gai-tl-field">
            To
            <input type="date" className="gai-input" value={range.to} min={range.from} onChange={(e) => setEdge("to", e.target.value)} />
          </label>
        </div>
        {preset === "custom" && !customOk && <p className="gai-small gai-muted">The start date must be before the end date. Showing the full range until it is.</p>}
        <div className="gai-chipset" role="group" aria-label="Tracks shown">
          <span className="gai-tl-grouplabel">Tracks</span>
          {TRACKS.map((t) => (
            <button key={t.id} type="button" className="gai-chip" title={t.blurb} aria-pressed={!hiddenTracks.includes(t.id)} onClick={() => setHiddenTracks(toggle(hiddenTracks, t.id))}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="gai-chipset" role="group" aria-label="Providers shown">
          <span className="gai-tl-grouplabel">Providers</span>
          {providers.map((p) => (
            <button key={p} type="button" className="gai-chip" aria-pressed={!hiddenProviders.includes(p)} onClick={() => setHiddenProviders(toggle(hiddenProviders, p))}>
              <i className="gai-tl-swatch" style={{ background: providerColor(p) }} aria-hidden />
              {providerName(p)}
            </button>
          ))}
        </div>
        <div className="gai-row">
          <Seg value={minSig} onChange={setMinSig} options={SIG_OPTS} label="Minimum significance" />
          <label className="gai-tl-check">
            <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
            Compare with rivals
          </label>
          {filtersOn && (
            <button
              type="button"
              className="gai-tl-more"
              style={{ marginTop: 0 }}
              onClick={() => {
                setHiddenTracks([]);
                setHiddenProviders([]);
                setMinSig("1");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {compare && (
        <div className="gai-warn" style={{ marginTop: 12 }}>
          Google events are drawn above the axis and other providers&apos; events below it, for the same window. Events close in time are shown together for context; closeness in time is not evidence that one caused the other.
        </div>
      )}

      <p className="gai-small gai-muted" style={{ margin: "10px 0 0" }}>
        {visible.length} of {events.length} events · {fmtDate(range.from)} to {fmtDate(range.to)}
        {later.length > 0 && (
          <>
            {" · "}
            <button type="button" className="gai-tl-more" style={{ marginTop: 0 }} onClick={() => setEdge("to", later.reduce((m, e) => (at(e, today) > m ? at(e, today) : m), range.to))}>
              Include {later.length} scheduled {later.length === 1 ? "event" : "events"} after this window
            </button>
          </>
        )}
      </p>

      {visible.length === 0 ? (
        <div style={{ marginTop: 12 }}>
          <Empty title="No event in this window matches the filters">
            {filtered.length > 0 ? "Events exist outside this window. " : "The filters exclude every recorded event. "}
            <button
              type="button"
              className="gai-tl-more"
              onClick={() => {
                setPreset("all");
                setHiddenTracks([]);
                setHiddenProviders([]);
                setMinSig("1");
              }}
            >
              Show everything
            </button>
          </Empty>
        </div>
      ) : (
        <SwimChart events={visible} from={range.from} to={range.to} today={today} compare={compare} tracks={tracks} selected={selected} onSelect={onSelect} />
      )}

      {sel ? (
        <EventCard e={sel} today={today} onClose={() => onSelect(null)} onTimeMachine={onTimeMachine} />
      ) : (
        visible.length > 0 && <p className="gai-small gai-muted gai-tl-hint">Select an event on the chart, or use &ldquo;Show on chart&rdquo; in the list, to read its detail, evidence and sources here.</p>
      )}

      <Sec id="events" title="The same events as a list" sub="Newest first, grouped by year and month. This list carries everything the chart shows, with the same window and filters applied.">
        {listed.length === 0 ? (
          <Empty title="No event to list">Nothing recorded in this window passes the filters.</Empty>
        ) : (
          <div className="gai-card">
            {groups.map((y, yi) => (
              <section key={y.year} aria-label={y.year}>
                <h3 className="gai-tl-year" style={yi === 0 ? { marginTop: 0 } : undefined}>{y.year}</h3>
                {y.months.map((m) => (
                  <div key={m.key} className="gai-tl-month">
                    <h4>{m.label}</h4>
                    <ul>
                      {m.rows.map((e) => (
                        <li key={e.id} className="gai-tl-row" data-on={selected === e.id ? 1 : 0}>
                          <time dateTime={e.date}>{fmtDate(e.date, e.precision)}</time>
                          <h5>
                            <i className="gai-tl-swatch" style={{ background: providerColor(e.providerId) }} aria-hidden />
                            {e.href ? <Link href={e.href}>{e.title}</Link> : e.title}
                          </h5>
                          {e.detail && <p>{e.detail}</p>}
                          <div className="gai-claim-meta">
                            <span className="gai-tag">{TRACK_LABEL[e.track]}</span>
                            <span className="gai-tag">{providerName(e.providerId)}</span>
                            {e.scheduled && <span className="gai-pill announced">Scheduled{e.effectiveDate ? ` · ${fmtDate(e.effectiveDate)}` : ""}</span>}
                            {e.label ? <Ev label={e.label} short /> : <span className="gai-tag">no evidence label</span>}
                            <Cites ids={e.sourceIds} />
                            <button
                              type="button"
                              className="gai-tl-more"
                              style={{ marginTop: 0 }}
                              aria-pressed={selected === e.id}
                              onClick={() => {
                                onSelect(e.id);
                                document.getElementById("gai-tl-chart")?.scrollIntoView({ block: "start" });
                              }}
                            >
                              Show on chart
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
            {listed.length > shown && (
              <button type="button" className="gai-tl-more" onClick={() => setShown(shown + 40)}>
                Show {Math.min(40, listed.length - shown)} more ({listed.length - shown} not shown)
              </button>
            )}
          </div>
        )}
      </Sec>
    </>
  );
}

const DOT_R: Record<1 | 2 | 3, number> = { 1: 4, 2: 5.5, 3: 7 };
const GUTTER = 104;
const MIN_W = 820;
const PAD_L = 20;
const PAD_R = 46;
const TOP = 20;
const LANE_H = 74;
const BAND_H = 170;
const AXIS_H = 30;

interface Band {
  key: string;
  name: string;
  short: string;
  top: number;
  height: number;
  rows: number;
  /** y of the first row of dots. */
  base: number;
  /** +1 stacks downward, −1 upward (the mirrored half of the compare view). */
  dir: 1 | -1;
  step: number;
  labelY: number;
  alt: boolean;
  events: UnifiedEvent[];
}
interface Dot {
  e: UnifiedEvent;
  x: number;
  y: number;
  r: number;
}

function SwimChart({ events, from, to, today, compare, tracks, selected, onSelect }: { events: UnifiedEvent[]; from: string; to: string; today: string; compare: boolean; tracks: { id: TimelineTrack; label: string }[]; selected: string | null; onSelect: (id: string | null) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(1180);
  const [hover, setHover] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => setBoxW(Math.round(entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const W = Math.max(boxW - GUTTER, MIN_W);

  const layout = useMemo(() => {
    const x = (d: string) => PAD_L + xFrac(d, from, to) * (W - PAD_L - PAD_R);
    const bands: Band[] = compare
      ? [
          { key: "google", name: "Google", short: "Google", top: TOP, height: BAND_H, rows: 7, base: TOP + BAND_H - 14, dir: -1, step: 17, labelY: TOP + 15, alt: false, events: events.filter((e) => e.providerId === "google") },
          { key: "rivals", name: "Other providers", short: "Rivals", top: TOP + BAND_H + AXIS_H, height: BAND_H, rows: 7, base: TOP + BAND_H + AXIS_H + 14, dir: 1, step: 17, labelY: TOP + 2 * BAND_H + AXIS_H - 7, alt: false, events: events.filter((e) => e.providerId !== "google") },
        ]
      : tracks.map((t, i) => ({ key: t.id, name: t.label, short: SHORT_TRACK[t.id], top: TOP + i * LANE_H, height: LANE_H, rows: 3, base: TOP + i * LANE_H + 34, dir: 1 as const, step: 14, labelY: TOP + i * LANE_H + 15, alt: i % 2 === 1, events: events.filter((e) => e.track === t.id) }));
    const bottom = bands.length ? bands[bands.length - 1].top + bands[bands.length - 1].height : TOP;
    const axisY = compare ? TOP + BAND_H : bottom;
    const height = compare ? bottom + 6 : bottom + 26;
    const dots: Dot[] = [];
    const labels: { band: Band; l: PlacedLabel<Dot> }[] = [];
    for (const b of bands) {
      const placed = placeDots(
        b.events.map((e) => ({ item: e, x: x(at(e, today)), r: DOT_R[e.significance] })),
        b.rows,
      ).map((p) => ({ e: p.item, x: p.x, r: p.r, y: b.base + b.dir * p.row * b.step }));
      dots.push(...placed);
      const chosen = placeLabels(
        placed.map((d) => ({ item: d, x: d.x, text: d.e.title, priority: d.e.id === selected ? 9 : d.e.significance })),
        { min: 4, max: W - 4 },
        { maxLabels: Math.max(2, Math.floor(W / 130)) },
      );
      for (const l of chosen) labels.push({ band: b, l });
    }
    const order = dots.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    const { unit, ticks } = timeTicks(from, to, Math.max(4, Math.floor(W / 90)));
    return { bands, bottom, axisY, height, dots, labels, order, unit, ticks: ticks.map((t) => ({ ...t, x: x(t.date) })), todayX: today >= from && today <= to ? x(today) : null };
  }, [events, from, to, today, compare, tracks, selected, W]);

  // After the window or the width changes, bring the selected event (or today) into view inside the scroller.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const target = el.querySelector<SVGElement>('[data-sel="1"]') ?? el.querySelector<SVGElement>("[data-today]");
    const tx = target ? Number(target.getAttribute("data-x")) : NaN;
    el.scrollLeft = Number.isFinite(tx) ? Math.max(0, tx + GUTTER - el.clientWidth * (target?.hasAttribute("data-today") ? 0.85 : 0.5)) : el.scrollWidth;
  }, [from, to, W, compare]);

  const { bands, dots, order } = layout;
  const tip = hover ? dots.find((d) => d.e.id === hover) : undefined;
  const stopId = (cursor && order.some((d) => d.e.id === cursor) ? cursor : null) ?? (selected && order.some((d) => d.e.id === selected) ? selected : null) ?? order.filter((d) => !d.e.scheduled).pop()?.e.id ?? order[order.length - 1]?.e.id;
  const draw = dots.slice().sort((a, b) => b.r - a.r);

  const onKey = (ev: KeyboardEvent<SVGGElement>, id: string) => {
    const i = order.findIndex((d) => d.e.id === id);
    let j = i;
    if (ev.key === "ArrowRight") j = Math.min(order.length - 1, i + 1);
    else if (ev.key === "ArrowLeft") j = Math.max(0, i - 1);
    else if (ev.key === "Home") j = 0;
    else if (ev.key === "End") j = order.length - 1;
    else if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      onSelect(selected === id ? null : id);
      return;
    } else return;
    ev.preventDefault();
    const next = ev.currentTarget.ownerSVGElement?.querySelector<SVGGElement>(`[data-i="${j}"]`);
    next?.focus();
  };

  return (
    <>
      <div className="gai-tl-scroll" id="gai-tl-chart" ref={box}>
        <div className="gai-tl-inner" style={{ width: GUTTER + W }}>
          <div className="gai-tl-gutter" aria-hidden>
            <div style={{ height: TOP, padding: 0 }} />
            {bands.map((b, i) => (
              <div key={b.key} data-alt={b.alt ? 1 : 0} style={{ height: b.height, marginTop: compare && i === 1 ? AXIS_H : 0 }}>
                <span className="gai-tl-long">{b.name}</span>
                <span className="gai-tl-short">{b.short}</span>
              </div>
            ))}
          </div>
          <div className="gai-tl-plot" style={{ width: W }}>
            <svg
              className="gai-chart gai-tl-svg"
              viewBox={`0 0 ${W} ${layout.height}`}
              style={{ width: W, height: layout.height }}
              role="group"
              aria-label={`${compare ? "Google events above the axis and other providers' events below it" : `Swim-lane timeline with ${bands.length} ${bands.length === 1 ? "lane" : "lanes"}`}: ${events.length} events from ${fmtDate(from)} to ${fmtDate(to)}. Dot size shows significance; hollow dots are scheduled and not yet in effect. The list below the chart gives every event in words.`}
            >
              {bands.map((b) => (b.alt ? <rect key={b.key} className="gai-tl-lanebg" x={0} y={b.top} width={W} height={b.height} /> : null))}
              {layout.ticks.map((t) => (
                <g key={t.date} className={t.major ? "axis" : "grid"}>
                  <line x1={t.x} x2={t.x} y1={TOP} y2={compare ? layout.axisY : layout.bottom} />
                  {compare && <line x1={t.x} x2={t.x} y1={layout.axisY + AXIS_H} y2={layout.bottom} />}
                </g>
              ))}
              {bands.map((b) => (
                <line key={b.key} className="grid" x1={0} x2={W} y1={b.top} y2={b.top} />
              ))}
              <line className="axis" x1={0} x2={W} y1={layout.axisY} y2={layout.axisY} />
              {compare && <line className="axis" x1={0} x2={W} y1={layout.axisY + AXIS_H} y2={layout.axisY + AXIS_H} />}
              {!compare && <line className="axis" x1={0} x2={W} y1={layout.bottom} y2={layout.bottom} />}
              {layout.ticks.map((t) =>
                t.label ? (
                  <text key={t.date} x={t.x} y={layout.axisY + (compare ? 19 : 17)} textAnchor="middle" className={t.major ? "lbl" : undefined}>
                    {t.label}
                  </text>
                ) : null,
              )}
              {bands.map((b) =>
                b.events.length === 0 ? (
                  <text key={b.key} x={PAD_L} y={b.top + b.height / 2 + 4}>
                    {compare ? `No ${b.key === "google" ? "Google" : "rival"} event in this window` : "No event in this window"}
                  </text>
                ) : null,
              )}
              {layout.todayX != null && (
                <g data-today data-x={layout.todayX}>
                  <line className="gai-tl-today" x1={layout.todayX} x2={layout.todayX} y1={TOP - 4} y2={layout.bottom} />
                  <text className="gai-tl-todaylbl" x={layout.todayX} y={TOP - 8} textAnchor={layout.todayX > W - 30 ? "end" : "middle"}>
                    today
                  </text>
                </g>
              )}
              {layout.labels.map(({ band, l }) => {
                const d = l.item;
                const above = band.labelY < d.y;
                const y1 = above ? band.labelY + 4 : band.labelY - 12;
                const y2 = above ? d.y - d.r - 2 : d.y + d.r + 2;
                return (
                  <g key={d.e.id}>
                    {Math.abs(y2 - y1) > 3 && <line className="gai-tl-lead" x1={d.x} x2={d.x} y1={y1} y2={y2} />}
                    <text className={`gai-tl-evlabel${d.e.id === selected || d.e.id === hover ? " on" : ""}`} x={l.x} y={band.labelY} textAnchor={l.anchor}>
                      {l.text}
                    </text>
                  </g>
                );
              })}
              {draw.map((d) => {
                const e = d.e;
                const color = providerColor(e.providerId);
                const on = selected === e.id;
                return (
                  <g
                    key={e.id}
                    className="gai-tl-dot"
                    role="button"
                    tabIndex={stopId === e.id ? 0 : -1}
                    aria-pressed={on}
                    aria-label={`${fmtDate(e.date, e.precision)}: ${e.title}. ${TRACK_LABEL[e.track]}, ${providerName(e.providerId)}, ${SIG_WORD[e.significance]} significance${e.scheduled ? ", scheduled, not yet in effect" : ""}.`}
                    data-i={order.indexOf(d)}
                    data-sel={on ? 1 : 0}
                    data-x={d.x}
                    transform={`translate(${d.x} ${d.y})`}
                    onClick={() => onSelect(on ? null : e.id)}
                    onKeyDown={(ev) => onKey(ev, e.id)}
                    onMouseEnter={() => setHover(e.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => {
                      setHover(e.id);
                      setCursor(e.id);
                    }}
                    onBlur={() => setHover(null)}
                  >
                    <circle r={12} fill="transparent" />
                    {(on || hover === e.id) && <circle r={d.r + 4} fill="none" stroke={on ? "var(--ink)" : "var(--accent)"} strokeWidth={2} />}
                    {e.scheduled ? <circle r={d.r - 1} fill="var(--surface)" stroke={color} strokeWidth={2} /> : <circle r={d.r} fill={color} stroke="var(--surface)" strokeWidth={2} />}
                  </g>
                );
              })}
            </svg>
            {tip && (
              <div
                className="gai-tip gai-tl-tip"
                role="tooltip"
                style={{ left: Math.min(W - 136, Math.max(136, tip.x)), top: tip.y, transform: tip.y < 96 ? "translate(-50%, 16px)" : "translate(-50%, calc(-100% - 16px))" }}
              >
                <b>{tip.e.title}</b>
                {fmtDate(tip.e.date, tip.e.precision)} · {TRACK_LABEL[tip.e.track]} · {providerName(tip.e.providerId)}
                {tip.e.scheduled ? " · scheduled, not yet in effect" : ""}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="gai-legend gai-tl-legend">
        {[...new Set(events.map((e) => e.providerId))]
          .sort((a, b) => Number(b === "google") - Number(a === "google") || a.localeCompare(b))
          .map((p) => (
            <span key={p}>
              <i style={{ background: providerColor(p), borderRadius: "50%" }} />
              {providerName(p)}
            </span>
          ))}
        <span>
          <svg width="40" height="16" viewBox="0 0 40 16" aria-hidden>
            <circle cx="5" cy="8" r="4" fill="var(--s0)" />
            <circle cx="18" cy="8" r="5.5" fill="var(--s0)" />
            <circle cx="33" cy="8" r="7" fill="var(--s0)" />
          </svg>
          size = significance (an editorial judgment)
        </span>
        <span>
          <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden>
            <circle cx="7" cy="8" r="4.5" fill="var(--surface)" stroke="var(--s0)" strokeWidth="2" />
          </svg>
          hollow = announced, not yet in effect
        </span>
      </div>
      <p className="gai-small gai-muted gai-tl-hint">
        Hover or focus a dot to read it; click or press Enter to open it. With the keyboard, Tab into the chart and use the left and right arrow keys to move through events in date order.
        {layout.unit === "year" ? " Ticks are years." : layout.unit === "quarter" ? " Ticks are quarters." : " Ticks are months."} Dates known only to the month or year are drawn mid-period.
      </p>
    </>
  );
}

function Sig({ e }: { e: UnifiedEvent }) {
  if (e.origin === "lifecycle") return <span className="gai-small gai-muted">no editorial weight recorded</span>;
  return (
    <span className="gai-imp" title={`Significance ${e.significance} of 3 — an editorial judgment`} aria-label={`Significance ${e.significance} of 3, an editorial judgment`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= e.significance ? "on" : ""} />
      ))}
    </span>
  );
}

function EventCard({ e, today, onClose, onTimeMachine }: { e: UnifiedEvent; today: string; onClose: () => void; onTimeMachine: (date: string) => void }) {
  return (
    <section className="gai-card gai-tl-detail" aria-live="polite" aria-label="Selected event">
      <div className="gai-row">
        <span className="gai-tag">{TRACK_LABEL[e.track]}</span>
        <span className="gai-tag">
          <i className="gai-tl-swatch" style={{ background: providerColor(e.providerId) }} aria-hidden />
          {providerName(e.providerId)}
        </span>
        <span className="gai-tag">{ORIGIN_LABEL[e.origin]}</span>
        {e.scheduled && <span className="gai-pill announced">Scheduled · not yet in effect</span>}
        <Sig e={e} />
      </div>
      <h3 className="gai-h2">{e.title}</h3>
      <p className="gai-small gai-muted">
        <time dateTime={e.date}>{fmtDate(e.date, e.precision)}</time>
        {e.precision !== "day" ? ` (date known to the ${e.precision} only)` : ""}
        {e.announcedAt ? ` · announced ${fmtDate(e.announcedAt)}, effective on the date shown` : ""}
        {e.effectiveDate ? ` · takes effect ${fmtDate(e.effectiveDate)}` : ""}
      </p>
      {e.detail ? <p>{e.detail}</p> : <p className="gai-muted">No description is recorded for this event.</p>}
      <div className="gai-claim-meta">
        {e.label ? <Ev label={e.label} /> : <span className="gai-tag">no evidence label recorded</span>}
        <Cites ids={e.sourceIds} />
      </div>
      {e.entityIds.length > 0 && (
        <div className="gai-chipset">
          <span className="gai-small gai-muted">Related:</span>
          {e.entityIds.map((id) => (
            <EntityLink key={id} id={id} />
          ))}
        </div>
      )}
      <div className="gai-row">
        {e.href && (
          <Link className="gai-link" href={e.href}>
            {e.href.startsWith("/google-ai/latest/") ? "Full development →" : "Dossier →"}
          </Link>
        )}
        {e.date <= today && (
          <button type="button" className="gai-btn" onClick={() => onTimeMachine(e.date)}>
            See the ecosystem on this date
          </button>
        )}
        <button type="button" className="gai-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </section>
  );
}

// ───────────────────────── B. time machine ─────────────────────────

function Capped<T>({ rows, cap = 8, children }: { rows: T[]; cap?: number; children: (row: T) => ReactNode }) {
  const [all, setAll] = useState(false);
  return (
    <>
      <ul className="gai-claims">{(all ? rows : rows.slice(0, cap)).map(children)}</ul>
      {rows.length > cap && (
        <button type="button" className="gai-tl-more" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? "Show fewer" : `Show all ${rows.length}`}
        </button>
      )}
    </>
  );
}

function StageThen({ status }: { status: StatusAt }) {
  if (!status.evidenced) return <Status status="unknown" />;
  return (
    <span title={status.since ? `Since ${fmtDate(status.since)}` : undefined}>
      <Status status={status.status} short />
    </span>
  );
}

function priceText(p: PriceRecord | undefined): ReactNode {
  if (!p) return <span className="gai-muted">not recorded</span>;
  return (
    <>
      {usd(p.price)}
      {p.unit !== "usd-per-1m-tokens" ? <span className="gai-muted"> {UNIT[p.unit] ?? p.unit}</span> : null}
    </>
  );
}

function TimeMachine({ events, today, minDate, date, setDate, vs, setVs }: { events: UnifiedEvent[]; today: string; minDate: string; date: string; setDate: (d: string) => void; vs: string; setVs: (d: string) => void }) {
  const total = Math.max(0, daysBetween(minDate, today));
  const snap = useMemo(() => snapshotAt(date, { providerId: "google" }), [date]);
  const items = useMemo(() => snap.entities.filter((x) => x.entity.kind !== "provider"), [snap]);
  const pending = useMemo(() => pendingAt(date), [date]);
  const bins = useMemo(() => density(events, minDate, today, 72), [events, minDate, today]);
  const picks = useMemo(() => {
    // Google's own landmarks first; fall back to every provider only when Google has too few dated events.
    const own = events.filter((e) => e.providerId === "google");
    return landmarkEvents(own.length >= 6 ? own : events, today, 6);
  }, [events, today]);
  const diff = useMemo(() => (vs && vs !== date ? diffSnapshots(snapshotAt(vs, { providerId: "google" }), snap) : null), [vs, date, snap]);
  const coverage = useMemo(
    () => ({
      google: coverageAt(
        date,
        ENTITIES.filter((e) => e.providerId === "google"),
      ),
      others: coverageAt(
        date,
        ENTITIES.filter((e) => e.providerId !== "google"),
      ),
    }),
    [date],
  );
  const modelRows = useMemo(() => {
    const ids = [...new Set(MODELS.map((m) => m.providerId))].sort((a, b) => Number(b === "google") - Number(a === "google") || providerName(a).localeCompare(providerName(b)));
    return ids.flatMap((pid) =>
      currentModelsAt(date, pid)
        .slice(0, 3)
        .map((m) => ({ pid, m, name: nameAt(m, date), status: statusAt(m, date), price: headline(m.id, date) })),
    );
  }, [date]);

  const models = items.filter((x) => x.entity.kind === "model").length;
  const googleDevs = snap.announcements.filter((a) => a.providerId === "google").length;
  const maxBin = Math.max(1, ...bins);
  const dayIndex = Math.min(total, Math.max(0, daysBetween(minDate, date)));
  const yearAgo = addDays(today, -365);
  const pick = (d: string) => setDate(clampDate(d, minDate, today, date));
  const unassigned = items.filter((x) => !x.entity.layer);
  const earlier = [90, 365, 730].filter((n) => addDays(date, -n) >= minDate);
  const nothingPending = pending.prices.length === 0 && pending.lifecycle.length === 0 && pending.announcements.length === 0;

  return (
    <>
      <div className="gai-card gai-tl-controls">
        <h2 className="gai-h3">What did Google&apos;s AI ecosystem look like on this date?</h2>
        <div className="gai-row">
          <label className="gai-tl-field">
            Date
            <input type="date" className="gai-input" value={date} min={minDate} max={today} onChange={(e) => pick(e.target.value)} />
          </label>
          <label className="gai-tl-field">
            Compare with (optional)
            <input type="date" className="gai-input" value={vs} min={minDate} max={today} onChange={(e) => setVs(e.target.value ? clampDate(e.target.value, minDate, today, vs) : "")} />
          </label>
          {vs && (
            <button type="button" className="gai-tl-more" style={{ marginTop: 0 }} onClick={() => setVs("")}>
              Clear comparison
            </button>
          )}
        </div>
        <div className="gai-tl-scrub">
          <svg className="gai-tl-density" viewBox={`0 0 ${bins.length} 10`} preserveAspectRatio="none" aria-hidden>
            {bins.map((n, i) =>
              n > 0 ? <rect key={i} x={i + 0.12} width={0.76} y={10 - Math.max(0.8, (n / maxBin) * 10)} height={Math.max(0.8, (n / maxBin) * 10)} data-later={total > 0 && i / bins.length >= dayIndex / total ? 1 : 0} /> : null,
            )}
          </svg>
          <input
            type="range"
            className="gai-tl-range"
            min={0}
            max={total}
            step={1}
            value={dayIndex}
            disabled={total === 0}
            aria-label={`Date, from ${fmtDate(minDate)} to today`}
            aria-valuetext={fmtDate(date)}
            onChange={(e) => pick(addDays(minDate, Number(e.target.value)))}
          />
          <div className="gai-tl-ends">
            <span>{fmtDate(minDate)}</span>
            <span>today · {fmtDate(today)}</span>
          </div>
        </div>
        <p className="gai-small gai-muted">
          {total === 0
            ? "No record in the knowledge base is dated before today, so there is no earlier date to travel to."
            : `The slider runs from the earliest dated record to today; dates after today cannot be chosen. Bars show where dated events fall; lighter bars are later than the chosen date and are not used.`}
        </p>
        <div className="gai-chipset" role="group" aria-label="Quick dates">
          <button type="button" className="gai-chip" aria-pressed={date === today} onClick={() => pick(today)}>
            Today
          </button>
          {yearAgo >= minDate && (
            <button type="button" className="gai-chip" aria-pressed={date === yearAgo} onClick={() => pick(yearAgo)}>
              1 year ago
            </button>
          )}
          {picks.map((e) => (
            // A landmark later than the chosen date is offered as a bare date: naming it would leak the future into this view.
            <button key={e.id} type="button" className="gai-chip" aria-pressed={date === e.date} title={e.date <= date ? e.title : undefined} onClick={() => pick(e.date)}>
              {fmtDate(e.date, e.precision)}{e.date <= date ? ` · ${clip(e.title, 30)}` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="gai-tl-banner" role="status">
        Showing the ecosystem as of <b>{fmtDate(date)}</b>. Nothing dated later is used.
      </div>

      <div className="gai-grid gai-g4 keep2" style={{ marginTop: 12 }}>
        <div className="gai-card gai-stat">
          <span className="v">{items.length - models}</span>
          <span className="l">Google products and components that existed</span>
          <span className="gai-tl-statsub">everything tracked except individual models</span>
        </div>
        <div className="gai-card gai-stat">
          <span className="v">{models}</span>
          <span className="l">Google models introduced and not yet retired</span>
        </div>
        <div className="gai-card gai-stat">
          <span className="v">{snap.announcements.length}</span>
          <span className="l">developments recorded up to then</span>
          <span className="gai-tl-statsub">{googleDevs} by Google</span>
        </div>
        <div className="gai-card gai-stat">
          <span className="v">{snap.prices.length}</span>
          <span className="l">list-price records in effect</span>
          <span className="gai-tl-statsub">all providers</span>
        </div>
      </div>

      <Sec id="diff" title="Compare two dates" sub="What was added, retired, renamed and repriced between the chosen date and a second one. The earlier date is always the &ldquo;before&rdquo;.">
        {!vs ? (
          <div className="gai-empty">
            <b>No second date chosen</b>
            Pick one in the controls above{earlier.length > 0 || date !== today ? ", or compare with:" : "."}
            <span className="gai-chipset" style={{ marginTop: 6 }}>
              {earlier.map((n) => (
                <button key={n} type="button" className="gai-chip" onClick={() => setVs(addDays(date, -n))}>
                  {n === 90 ? "90 days earlier" : n === 365 ? "1 year earlier" : "2 years earlier"}
                </button>
              ))}
              {date !== today && (
                <button type="button" className="gai-chip" onClick={() => setVs(today)}>
                  today
                </button>
              )}
            </span>
          </div>
        ) : !diff ? (
          <Empty title="Both dates are the same">Choose a different second date to see a difference.</Empty>
        ) : (
          <>
            <p className="gai-small gai-muted" style={{ marginBottom: 10 }}>
              From <b>{fmtDate(diff.from)}</b> to <b>{fmtDate(diff.to)}</b> ({daysBetween(diff.from, diff.to)} days). Google entities only, except list prices, which cover every provider with a record on both dates.
            </p>
            <div className="gai-grid gai-g2">
              <section className="gai-card">
                <h3 className="gai-h3">Added ({diff.added.length})</h3>
                <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Introduced after the earlier date and present on the later one, under the name used then.</p>
                {diff.added.length === 0 ? (
                  <p className="gai-muted gai-small">No Google entity with an introduction date falls between these dates.</p>
                ) : (
                  <Capped rows={diff.added}>
                    {(x) => (
                      <li key={x.entity.id}>
                        <span className="gai-tl-ent">
                          <EntityLink id={x.entity.id}>{x.name}</EntityLink>
                          <span className="gai-small gai-muted">introduced {fmtIntro(x.entity)}</span>
                          <Cites ids={x.entity.sourceIds} />
                        </span>
                      </li>
                    )}
                  </Capped>
                )}
              </section>
              <section className="gai-card">
                <h3 className="gai-h3">Retired ({diff.retired.length})</h3>
                <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>In service on the earlier date, retired by the later one.</p>
                {diff.retired.length === 0 ? (
                  <p className="gai-muted gai-small">No retirement is recorded between these dates.</p>
                ) : (
                  <Capped rows={diff.retired}>
                    {(x) => (
                      <li key={x.entity.id}>
                        <span className="gai-tl-ent">
                          <EntityLink id={x.entity.id}>{x.name}</EntityLink>
                          <span className="gai-small gai-muted">{x.on ? `retired ${fmtDate(x.on)}` : "retirement date not recorded"}</span>
                          <Cites ids={x.entity.sourceIds} />
                        </span>
                      </li>
                    )}
                  </Capped>
                )}
              </section>
              <section className="gai-card">
                <h3 className="gai-h3">Renamed ({diff.renamed.length})</h3>
                <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Present on both dates under different names.</p>
                {diff.renamed.length === 0 ? (
                  <p className="gai-muted gai-small">No rename is recorded between these dates.</p>
                ) : (
                  <Capped rows={diff.renamed}>
                    {(x) => (
                      <li key={x.entity.id}>
                        <span className="gai-tl-ent">
                          <span>
                            {x.before} → <EntityLink id={x.entity.id}>{x.after}</EntityLink>
                          </span>
                          <Cites ids={x.entity.formerNames?.find((f) => f.name === x.before || f.name === x.after)?.sourceIds ?? x.entity.sourceIds} />
                        </span>
                      </li>
                    )}
                  </Capped>
                )}
              </section>
              <section className="gai-card">
                <h3 className="gai-h3">List price changes ({diff.priceChanges.length})</h3>
                <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Same product, surface and meter; standard tier, global endpoint, base context window. Price in effect on each date.</p>
                {diff.priceChanges.length === 0 ? (
                  <p className="gai-muted gai-small">No headline list price differs between these dates among lines priced on both.</p>
                ) : (
                  <Capped rows={diff.priceChanges}>
                    {(c) => (
                      <li key={c.before.id + c.after.id}>
                        <span>
                          <EntityLink id={c.entityId}>{nameOn(c.entityId, diff.to)}</EntityLink> {c.meter.replace(/-/g, " ")} · {surfaceLabel(c.surface, diff.to)}: <b>{usd(c.before.price)} → {usd(c.after.price)}</b>{" "}
                          <span className="gai-muted">{UNIT[c.unit] ?? c.unit}</span>
                          {c.pct != null ? ` (${c.pct > 0 ? "+" : "−"}${Math.abs(c.pct * 100).toFixed(Math.abs(c.pct) < 0.1 ? 1 : 0)}%)` : ""}
                          {c.condition ? ` — ${c.condition}` : ""}
                        </span>
                        <span className="gai-claim-meta">
                          <Ev label={c.after.label} short />
                          <Cites ids={[...new Set([...c.before.sourceIds, ...c.after.sourceIds])]} />
                          <span className="gai-small gai-muted">new price effective {fmtDate(c.after.effectiveFrom)}</span>
                        </span>
                      </li>
                    )}
                  </Capped>
                )}
              </section>
            </div>
          </>
        )}
      </Sec>

      <Sec id="layers" title={`The eight layers on ${fmtDate(date)}`} sub="Google entities that existed on the date, under the name they had then. The stage is shown only where a dated record supports it.">
        {items.length === 0 ? (
          <Empty title="No Google entity is recorded as existing on this date">Either nothing in the knowledge base had been introduced yet, or the entities that had been carry no introduction date and are left out (see the transparency note below).</Empty>
        ) : (
          <div className="gai-grid gai-g2">
            {[...LAYERS.map((l) => ({ key: l.id as string, n: `Layer ${l.n}`, name: l.name, rows: items.filter((x) => x.entity.layer === l.id) })), ...(unassigned.length ? [{ key: "none", n: "No layer", name: "Not assigned to a layer", rows: unassigned }] : [])].map((l) => (
              <section key={l.key} className="gai-card">
                <div className="gai-tl-layerhead">
                  <div>
                    <span className="gai-layer-n">{l.n}</span>
                    <h3 className="gai-h3">{l.name}</h3>
                  </div>
                  <span className="gai-small gai-muted">{l.rows.length} on this date</span>
                </div>
                {l.rows.length === 0 ? (
                  <p className="gai-muted gai-small">Nothing recorded in this layer on this date.</p>
                ) : (
                  <Capped rows={l.rows} cap={10}>
                    {(x) => (
                      <li key={x.entity.id}>
                        <span className="gai-tl-ent">
                          <EntityLink id={x.entity.id}>{x.name}</EntityLink>
                          <StageThen status={x.status} />
                          <Cites ids={x.entity.sourceIds} />
                        </span>
                      </li>
                    )}
                  </Capped>
                )}
              </section>
            ))}
          </div>
        )}
      </Sec>

      <Sec id="models" title="Newest models on that date" sub="Up to three per provider, newest first, Google first. List price is the one in effect on the date: standard tier, global endpoint, base context window, per 1M tokens unless stated.">
        {modelRows.length === 0 ? (
          <Empty title="No model is recorded as existing on this date">No provider has a model with an introduction date on or before {fmtDate(date)}.</Empty>
        ) : (
          <>
            {!modelRows.some((r) => r.pid === "google") && <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>No Google model with an introduction date existed on this date; other providers are listed.</p>}
            <div className="gai-tablewrap">
              <table className="gai-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Model (name then)</th>
                    <th>Introduced</th>
                    <th>Stage then</th>
                    <th className="num">Input</th>
                    <th className="num">Output</th>
                    <th>Priced on</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {modelRows.map(({ pid, m, name, status, price }) => {
                    const rec = price.input ?? price.output;
                    return (
                      <tr key={m.id}>
                        <td>
                          <i className="gai-tl-swatch" style={{ background: providerColor(pid) }} aria-hidden />
                          {providerName(pid)}
                        </td>
                        <td>
                          <Link className="gai-link" href={`/google-ai/entity/${m.id}`}>{name}</Link>
                        </td>
                        <td>{fmtIntro(m)}</td>
                        <td><StageThen status={status} /></td>
                        <td className="num">{rec ? priceText(price.input) : "—"}</td>
                        <td className="num">{rec ? priceText(price.output) : "—"}</td>
                        <td>{rec && price.surface ? surfaceLabel(price.surface, date) : <span className="gai-muted">no list price recorded for this date</span>}</td>
                        <td>
                          {rec ? (
                            <span className="gai-claim-meta">
                              <Ev label={rec.label} short />
                              <Cites ids={[...new Set([...(price.input?.sourceIds ?? []), ...(price.output?.sourceIds ?? [])])]} align="right" />
                            </span>
                          ) : (
                            <Cites ids={m.sourceIds} align="right" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Sec>

      <div className="gai-grid gai-g2" style={{ marginTop: 30 }}>
        <section className="gai-card">
          <h2 className="gai-h3">What had just happened</h2>
          <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Developments from the 90 days up to {fmtDate(date)}, all providers.</p>
          {snap.recent.length === 0 ? (
            <p className="gai-muted gai-small">No development is recorded in the 90 days before this date.</p>
          ) : (
            <Capped rows={snap.recent} cap={6}>
              {(a) => (
                <li key={a.id}>
                  <span>
                    <b>{fmtDate(a.date)}</b> · <Link className="gai-link" href={`/google-ai/latest/${a.id}`}>{a.title}</Link> <Imp n={a.importance} />
                  </span>
                  {a.summary[0] && <span className="gai-small">{a.summary[0].text}</span>}
                  <span className="gai-claim-meta">
                    {a.providerId !== "google" && <span className="gai-tag">{providerName(a.providerId)}</span>}
                    {a.types.slice(0, 2).map((t) => (
                      <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>
                    ))}
                    {a.summary[0] && <Ev label={a.summary[0].label} short />}
                    <Cites ids={a.summary[0]?.sourceIds ?? a.sourceIds} />
                  </span>
                </li>
              )}
            </Capped>
          )}
        </section>

        <section className="gai-card">
          <h2 className="gai-h3">Already announced, not yet in effect</h2>
          <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Made public on or before {fmtDate(date)} with an effective date after it.</p>
          {nothingPending ? (
            <p className="gai-muted gai-small">Nothing on record had been announced by this date with a later effective date.</p>
          ) : (
            <div className="gai-stack">
              {pending.prices.length > 0 && (
                <div>
                  <h3 className="gai-group-name">Prices ({pending.prices.length})</h3>
                  <Capped rows={pending.prices} cap={5}>
                    {({ next, current, known }) => (
                      <li key={next.id}>
                        <span>
                          <b>{fmtDate(next.effectiveFrom)}</b> · <EntityLink id={next.entityId}>{nameOn(next.entityId, date)}</EntityLink> {next.meter.replace(/-/g, " ")} · {surfaceLabel(next.surface, date)}: {current ? `${usd(current.price)} → ` : ""}
                          {usd(next.price)} <span className="gai-muted">{UNIT[next.unit] ?? next.unit}</span>
                          {next.tier !== "standard" ? ` (${next.tier})` : ""}
                          {next.region === "regional" ? " (regional)" : ""}
                        </span>
                        <span className="gai-claim-meta">
                          <Ev label={next.label} short />
                          <Cites ids={next.sourceIds} />
                          <span className="gai-small gai-muted">
                            {known.basis === "published" ? `published ${fmtDate(known.on)}` : known.basis === "lifecycle" ? `change announced ${fmtDate(known.on)}` : `on the source when read ${fmtDate(known.on)}`}
                          </span>
                        </span>
                      </li>
                    )}
                  </Capped>
                </div>
              )}
              {pending.lifecycle.length > 0 && (
                <div>
                  <h3 className="gai-group-name">Retirements and other dated changes ({pending.lifecycle.length})</h3>
                  <Capped rows={pending.lifecycle} cap={5}>
                    {(l) => (
                      <li key={l.id}>
                        <span>
                          <b>{fmtDate(l.effectiveDate)}</b> · <EntityLink id={l.entityId}>{nameOn(l.entityId, date)}</EntityLink> — {LIFE_LABEL[l.type].toLowerCase()}
                        </span>
                        {l.detail && <span className="gai-small">{l.detail}</span>}
                        <span className="gai-claim-meta">
                          <Ev label={l.label} short />
                          <Cites ids={l.sourceIds} />
                          <span className="gai-small gai-muted">announced {fmtDate(l.date)}</span>
                        </span>
                      </li>
                    )}
                  </Capped>
                </div>
              )}
              {pending.announcements.length > 0 && (
                <div>
                  <h3 className="gai-group-name">Developments ({pending.announcements.length})</h3>
                  <Capped rows={pending.announcements} cap={5}>
                    {(a) => (
                      <li key={a.id}>
                        <span>
                          <b>{fmtDate(a.effectiveDate)}</b> · <Link className="gai-link" href={`/google-ai/latest/${a.id}`}>{a.title}</Link>
                        </span>
                        <span className="gai-claim-meta">
                          {a.summary[0] && <Ev label={a.summary[0].label} short />}
                          <Cites ids={a.summary[0]?.sourceIds ?? a.sourceIds} />
                          <span className="gai-small gai-muted">announced {fmtDate(a.date)}</span>
                        </span>
                      </li>
                    )}
                  </Capped>
                </div>
              )}
            </div>
          )}
          {pending.undatedPrices > 0 && (
            <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
              {pending.undatedPrices} later price {pending.undatedPrices === 1 ? "record carries" : "records carry"} no publication date and nothing dated shows {pending.undatedPrices === 1 ? "it was" : "they were"} public by {fmtDate(date)}. {pending.undatedPrices === 1 ? "It is" : "They are"} counted here and not listed.
            </p>
          )}
        </section>
      </div>

      <Sec id="transparency" title="What this view leaves out" sub="Counts only. Entities introduced after the date are not named here, because naming them would bring later information into an as-of view.">
        <div className="gai-tablewrap">
          <table className="gai-table">
            <thead>
              <tr>
                <th>In today&apos;s knowledge base</th>
                <th className="num">Existed on {fmtDate(date)}</th>
                <th className="num">Not yet introduced</th>
                <th className="num">Already retired</th>
                <th className="num">No introduction date</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Google entities", coverage.google],
                  ["Other providers' entities", coverage.others],
                ] as const
              ).map(([label, c]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className="num">{c.existed}</td>
                  <td className="num">{c.notYet}</td>
                  <td className="num">{c.retired}</td>
                  <td className="num">{c.undated}</td>
                  <td className="num">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
          {coverage.google.total + coverage.others.total === 0
            ? "The knowledge base holds no entity yet."
            : `Entities without an introduction date (${coverage.google.undated + coverage.others.undated}) are never placed in the past by guesswork, so they appear in no as-of view, including this one. Provider entries themselves are not counted.`}
        </p>
      </Sec>
    </>
  );
}
