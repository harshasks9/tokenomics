"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Model } from "@/lib/llm-landscape/types";
import {
  OTHER_HUE,
  byReleaseAsc,
  parseReleased,
  vendorGroup,
  vendorHue,
} from "@/lib/llm-landscape/model";

const YEAR_MS = 365.25 * 24 * 3600 * 1000;
const LANE_ROW_H = 30;
const LANE_LABEL_H = 26;
const LANE_PAD = 8;
const AXIS_H = 34;
const AXIS_FLOOR = Date.UTC(2022, 0, 1); // the story starts in 2022; earlier stubs clamp left

type Marker = {
  m: Model;
  x: number; // px from domain start at current zoom (label-box start)
  w: number; // estimated pixel width (dot + label)
  labeled: boolean;
  row: number;
  flip?: boolean; // label drawn to the left of the dot (near right edge)
};

type Lane = { key: string; hue: string; markers: Marker[]; rows: number; top: number; h: number };

function estWidth(m: Model, labeled: boolean): number {
  if (!labeled) return m.tier === 3 ? 10 : 14;
  const px = m.tier === 1 ? 6.6 : 6.0;
  return Math.min(210, m.name.length * px + 26);
}

export default function Timeline({
  models,
  allModels,
  snapshot,
  onSelect,
  onApplyYears,
}: {
  models: Model[];
  allModels: Model[];
  snapshot: string;
  onSelect: (id: string) => void;
  onApplyYears: (range: [number, number]) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(1100);
  const [pxPerYear, setPxPerYear] = useState<number | null>(null); // null = fit
  const [viewport, setViewport] = useState<{ left: number; width: number }>({ left: 0, width: 1 });
  const [tip, setTip] = useState<{ m: Model; x: number; y: number } | null>(null);

  // Stable domain from the full dataset (floored at 2022 — pre-2022 stubs clamp).
  const domain = useMemo(() => {
    const dated = allModels.map((m) => parseReleased(m.released)).filter((r) => r.year != null);
    const min = Math.max(AXIS_FLOOR, Math.min(...dated.map((r) => r.sort)));
    const end = Date.parse(`${snapshot}T00:00:00Z`) + 45 * 24 * 3600 * 1000; // breathing room
    return { min, end, years: (end - min) / YEAR_MS };
  }, [allModels, snapshot]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    setContainerW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const fitPxPerYear = Math.max(40, (containerW - 8) / domain.years);
  const scale = pxPerYear ?? fitPxPerYear;
  const innerW = Math.ceil(domain.years * scale);
  const x = useCallback(
    (ms: number) => ((ms - domain.min) / YEAR_MS) * scale,
    [domain.min, scale],
  );

  // Vendor lanes: top 8 by Tier-1 presence in the FULL dataset, rest folds to Other.
  const laneOrder = useMemo(() => {
    const score = new Map<string, [number, number, number]>();
    for (const m of allModels) {
      const g = vendorGroup(m.vendor);
      const s = score.get(g) ?? [0, 0, 0];
      if (m.tier === 1) s[0]++;
      else if (m.tier === 2) s[1]++;
      s[2]++;
      score.set(g, s);
    }
    const ranked = [...score.entries()].sort(
      (a, b) => b[1][0] - a[1][0] || b[1][1] - a[1][1] || b[1][2] - a[1][2],
    );
    return ranked.slice(0, 8).map(([g]) => g);
  }, [allModels]);

  const { lanes, undated, totalH } = useMemo(() => {
    const byLane = new Map<string, Model[]>();
    const undated: Model[] = [];
    for (const m of [...models].sort(byReleaseAsc)) {
      if (parseReleased(m.released).year == null) {
        undated.push(m);
        continue;
      }
      const g = vendorGroup(m.vendor);
      const key = laneOrder.includes(g) ? g : "Other";
      if (!byLane.has(key)) byLane.set(key, []);
      byLane.get(key)!.push(m);
    }
    const keys = [...laneOrder.filter((k) => byLane.has(k)), ...(byLane.has("Other") ? ["Other"] : [])];
    let top = 0;
    const lanes: Lane[] = keys.map((key) => {
      const ms = byLane.get(key)!;
      const rowEnds: number[] = [];
      const markers: Marker[] = ms.map((m) => {
        const labeled = m.tier === 1 || (m.tier === 2 && scale >= 240);
        const rawX = Math.max(2, x(parseReleased(m.released).sort));
        const w = estWidth(m, labeled);
        // Labels near the right edge flip to the left of their dot.
        const flip = labeled && rawX + w > innerW - 8;
        const startX = flip ? Math.max(2, rawX - w + 16) : rawX;
        let row = rowEnds.findIndex((end) => end + 6 <= startX);
        if (row === -1) {
          row = rowEnds.length;
          rowEnds.push(startX + w);
        } else {
          rowEnds[row] = startX + w;
        }
        return { m, x: startX, w, labeled, row, flip };
      });
      const rows = Math.max(1, rowEnds.length);
      const h = LANE_LABEL_H + rows * LANE_ROW_H + LANE_PAD;
      const lane: Lane = {
        key,
        hue: key === "Other" ? OTHER_HUE : vendorHue(key),
        markers,
        rows,
        top,
        h,
      };
      top += h;
      return lane;
    });
    return { lanes, undated, totalH: top };
  }, [models, laneOrder, scale, x, innerW]);

  // Ticks.
  const ticks = useMemo(() => {
    const startYear = new Date(domain.min).getUTCFullYear();
    const endYear = new Date(domain.end).getUTCFullYear();
    const years: number[] = [];
    const quarters: number[] = [];
    for (let yy = startYear; yy <= endYear; yy++) {
      years.push(yy);
      for (let qq = 1; qq < 4; qq++) quarters.push(Date.UTC(yy, qq * 3, 1));
    }
    return { years, quarters, startYear, endYear };
  }, [domain]);

  // Scroll -> minimap viewport.
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setViewport({
      left: el.scrollLeft / innerW,
      width: Math.min(1, el.clientWidth / innerW),
    });
  }, [innerW]);
  useEffect(() => {
    onScroll();
  }, [onScroll, innerW, containerW, models]);

  const scrollToFrac = (frac: number) => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = Math.max(0, frac * innerW);
  };
  const jumpYear = (yy: number) => {
    scrollToFrac((Date.UTC(yy, 0, 1) - domain.min) / (domain.end - domain.min) - 0.02);
  };
  const zoom = (factor: number) => {
    const el = scrollRef.current;
    const centerFrac = el ? (el.scrollLeft + el.clientWidth / 2) / innerW : 0.5;
    const next = Math.min(1400, Math.max(fitPxPerYear, scale * factor));
    setPxPerYear(next === fitPxPerYear ? null : next);
    requestAnimationFrame(() => {
      const el2 = scrollRef.current;
      if (el2) el2.scrollLeft = centerFrac * domain.years * next - el2.clientWidth / 2;
    });
  };

  // Minimap drag/resize. One un-curried handler; the grabbed part comes from
  // data-handle on the event target, so no ref is touched during render.
  const miniRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    mode: "move" | "left" | "right";
    startX: number;
    moved: boolean;
    v0: { left: number; width: number };
  } | null>(null);
  const onMiniPointerDown = (e: React.PointerEvent) => {
    const mode = (e.target as HTMLElement).dataset.handle as "move" | "left" | "right" | undefined;
    if (!mode) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { mode, startX: e.clientX, moved: false, v0: viewport };
  };
  const onMiniPointerMove = (e: React.PointerEvent) => {
    const ds = dragState.current;
    const mini = miniRef.current;
    if (!ds || !mini) return;
    if (Math.abs(e.clientX - ds.startX) > 2) ds.moved = true;
    const dFrac = (e.clientX - ds.startX) / mini.clientWidth;
    if (ds.mode === "move") {
      scrollToFrac(Math.min(1 - ds.v0.width, Math.max(0, ds.v0.left + dFrac)));
    } else {
      let newWidth =
        ds.mode === "right" ? ds.v0.width + dFrac : ds.v0.width - dFrac;
      newWidth = Math.min(1, Math.max(0.04, newWidth));
      const newLeft = ds.mode === "left" ? ds.v0.left + (ds.v0.width - newWidth) : ds.v0.left;
      const next = Math.min(1400, Math.max(fitPxPerYear, (containerW - 8) / (domain.years * newWidth)));
      setPxPerYear(next <= fitPxPerYear + 0.5 ? null : next);
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollLeft = Math.max(0, newLeft * domain.years * next);
      });
    }
  };
  const suppressClick = useRef(false);
  const onMiniPointerUp = () => {
    const moved = dragState.current?.moved;
    dragState.current = null;
    if (moved) suppressClick.current = true;
  };
  const onMiniTrackClick = (e: React.MouseEvent) => {
    const mini = miniRef.current;
    if (!mini) return;
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const frac = (e.clientX - mini.getBoundingClientRect().left) / mini.clientWidth;
    scrollToFrac(frac - viewport.width / 2);
  };

  // Density for the minimap (per quarter, filtered set).
  const density = useMemo(() => {
    const buckets = new Map<number, number>();
    for (const m of models) {
      const r = parseReleased(m.released);
      if (r.year == null) continue;
      const d = new Date(r.sort);
      const key = Date.UTC(d.getUTCFullYear(), Math.floor(d.getUTCMonth() / 3) * 3, 1);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    const max = Math.max(1, ...buckets.values());
    return { buckets, max };
  }, [models]);

  const visibleYears: [number, number] = [
    new Date(domain.min + viewport.left * (domain.end - domain.min)).getUTCFullYear(),
    new Date(domain.min + Math.min(1, viewport.left + viewport.width) * (domain.end - domain.min) - 1).getUTCFullYear(),
  ];
  const zoomedIn = viewport.width < 0.995;

  const showTip = (m: Model) => (e: React.MouseEvent) =>
    setTip({ m, x: e.clientX, y: e.clientY });

  return (
    <div className="tl">
      {/* Controls row */}
      <div className="tl-controls">
        <div className="tl-years">
          {ticks.years.map((yy) => (
            <button key={yy} className="tl-yearbtn" onClick={() => jumpYear(yy)}>
              {yy}
            </button>
          ))}
        </div>
        <div className="tl-zoom">
          <button className="tl-zbtn" onClick={() => zoom(1 / 1.5)} aria-label="Zoom out">−</button>
          <button className="tl-zbtn" onClick={() => zoom(1.5)} aria-label="Zoom in">+</button>
          <button className="tl-zbtn tl-fit" onClick={() => setPxPerYear(null)}>
            Fit all
          </button>
          {zoomedIn && (
            <button className="tl-zbtn tl-apply" onClick={() => onApplyYears(visibleYears)}>
              Filter to {visibleYears[0]}–{visibleYears[1]}
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="tl-chart" id="tl-chart-scroll" ref={scrollRef} onScroll={onScroll}>
        <div className="tl-inner" style={{ width: innerW, height: totalH + AXIS_H }}>
          {/* axis */}
          <div className="tl-axis" style={{ width: innerW }}>
            {ticks.years.map((yy) => (
              <span key={yy} className="tl-axis-year" style={{ left: x(Date.UTC(yy, 0, 1)) }}>
                {yy}
              </span>
            ))}
          </div>
          {/* gridlines */}
          {ticks.years.map((yy) => (
            <span
              key={`y${yy}`}
              className="tl-grid tl-grid-year"
              style={{ left: x(Date.UTC(yy, 0, 1)), height: totalH, top: AXIS_H }}
            />
          ))}
          {scale > 90 &&
            ticks.quarters.map((q) => (
              <span
                key={`q${q}`}
                className="tl-grid"
                style={{ left: x(q), height: totalH, top: AXIS_H }}
              />
            ))}
          {/* snapshot line */}
          <span
            className="tl-snapshot"
            style={{ left: x(Date.parse(`${snapshot}T00:00:00Z`)), height: totalH + AXIS_H }}
          >
            <em>snapshot {snapshot}</em>
          </span>

          {/* lanes */}
          {lanes.map((lane) => (
            <div
              key={lane.key}
              className="tl-lane"
              style={{ top: lane.top + AXIS_H, height: lane.h, width: innerW }}
            >
              <span className="tl-lane-label">
                <i className="dot" style={{ background: lane.hue }} aria-hidden />
                {lane.key}
                <b>{lane.markers.length}</b>
              </span>
              {lane.markers.map(({ m, x: mx, row, labeled, flip }) => (
                <button
                  key={m.id}
                  className={`tl-marker tier${m.tier} ${labeled ? "labeled" : ""} ${flip ? "flip" : ""}`}
                  style={{ left: mx, top: LANE_LABEL_H + 2 + row * LANE_ROW_H, ["--hue" as string]: lane.hue }}
                  onClick={() => onSelect(m.id)}
                  onMouseEnter={showTip(m)}
                  onMouseMove={showTip(m)}
                  onMouseLeave={() => setTip(null)}
                  aria-label={`${m.name}, ${m.vendor}, ${parseReleased(m.released).display}`}
                >
                  <i aria-hidden />
                  {labeled && <span>{m.name}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Minimap brush */}
      <div
        className="tl-mini"
        ref={miniRef}
        onClick={onMiniTrackClick}
        onPointerMove={onMiniPointerMove}
        onPointerUp={onMiniPointerUp}
      >
        {[...density.buckets.entries()].map(([key, n]) => (
          <span
            key={key}
            className="tl-mini-bar"
            style={{
              left: `${(100 * (key - domain.min)) / (domain.end - domain.min)}%`,
              height: `${Math.max(12, (100 * n) / density.max)}%`,
            }}
          />
        ))}
        {ticks.years.map((yy) => (
          <span
            key={yy}
            className="tl-mini-year"
            style={{ left: `${(100 * (Date.UTC(yy, 0, 1) - domain.min)) / (domain.end - domain.min)}%` }}
          >
            {yy}
          </span>
        ))}
        <div
          className="tl-mini-window"
          style={{ left: `${viewport.left * 100}%`, width: `${viewport.width * 100}%` }}
          data-handle="move"
          onPointerDown={onMiniPointerDown}
          role="scrollbar"
          aria-label="Timeline viewport"
          aria-controls="tl-chart-scroll"
          aria-valuenow={Math.round(viewport.left * 100)}
        >
          <span className="tl-handle l" data-handle="left" />
          <span className="tl-handle r" data-handle="right" />
        </div>
      </div>

      {undated.length > 0 && (
        <div className="tl-undated">
          <span className="tl-undated-label">date not published:</span>
          {undated.map((m) =>
            m.tier === 3 ? (
              <span key={m.id} className="tl-undated-chip">{m.name}</span>
            ) : (
              <button key={m.id} className="tl-undated-chip link" onClick={() => onSelect(m.id)}>
                {m.name}
              </button>
            ),
          )}
        </div>
      )}

      {/* Tooltip */}
      {tip && (
        <div
          className="tl-tip"
          style={{
            left: Math.min(tip.x + 14, (typeof window !== "undefined" ? window.innerWidth : 1200) - 320),
            top: tip.y + 16,
          }}
        >
          <div className="tl-tip-head">
            <i className="dot" style={{ background: vendorHue(tip.m.vendor) }} aria-hidden />
            <strong>{tip.m.name}</strong>
            <span className={`tier-chip t${tip.m.tier}`}>T{tip.m.tier}</span>
          </div>
          <div className="tl-tip-meta">
            {vendorGroup(tip.m.vendor)} · {parseReleased(tip.m.released).display}
            {tip.m.status ? ` · ${tip.m.status}` : ""}
          </div>
          {tip.m.why_it_mattered && <p>{tip.m.why_it_mattered}</p>}
          {tip.m.note && !tip.m.why_it_mattered && <p>{tip.m.note}</p>}
          <div className="tl-tip-cta">{tip.m.tier < 3 ? "Click to open the record" : "Lineage stub"}</div>
        </div>
      )}
    </div>
  );
}
