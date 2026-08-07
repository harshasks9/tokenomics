"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Tier, TIER_META } from "@/lib/finops/engine";
import type { Cloud } from "@/lib/finops/catalog";

/** Categorical slot per cloud — fixed entity order, never re-ranked. */
export const CLOUD_VAR: Record<Cloud, string> = {
  google: "var(--s1)",
  aws: "var(--s2)",
  azure: "var(--s3)",
  openai: "var(--s4)",
  anthropic: "var(--s5)",
};

/** Measure a container's width for pixel-true SVG charts. */
export function useMeasure<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width);
    });
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// ---------------------------------------------------------------- sparkline

export function Sparkline({
  data,
  width = 96,
  height = 26,
  accent = false,
}: {
  data: number[];
  width?: number;
  height?: number;
  accent?: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map(
      (v, i) =>
        `${((i / (data.length - 1)) * (width - 4) + 2).toFixed(1)},${(
          height - 3 - ((v - min) / span) * (height - 6)
        ).toFixed(1)}`,
    )
    .join(" ");
  const last = data[data.length - 1];
  const lx = width - 2;
  const ly = height - 3 - ((last - min) / span) * (height - 6);
  return (
    <svg width={width} height={height} aria-hidden="true" style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={accent ? "var(--seq-450)" : "var(--baseline)"}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lx} cy={ly} r={2.5} fill="var(--seq-450)" stroke="var(--surface)" strokeWidth={1.5} />
    </svg>
  );
}

// ---------------------------------------------------------------- stat tile

export function StatTile({
  label,
  value,
  delta,
  deltaTone = "flat",
  note,
  spark,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up-bad" | "down-good" | "flat";
  note?: string;
  spark?: number[];
}) {
  return (
    <div className="fo-card fo-tile">
      <div className="fo-tile-label">{label}</div>
      <div className="fo-tile-value">{value}</div>
      <div className="fo-tile-meta">
        {delta ? <span className={`fo-tile-delta ${deltaTone}`}>{delta}</span> : null}
        {note ? <span className="fo-tile-note">{note}</span> : null}
        {spark ? (
          <span style={{ marginLeft: "auto" }}>
            <Sparkline data={spark} />
          </span>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- tier chip

export function TierChip({ tier }: { tier: Tier }) {
  return (
    <span className={`fo-tier ${tier}`}>
      <i aria-hidden="true">{TIER_META[tier].icon}</i>
      {TIER_META[tier].label}
    </span>
  );
}

// ---------------------------------------------------------------- tooltip

export interface TipState {
  x: number;
  y: number;
  body: ReactNode;
}

/** Hover/focus tooltip layer for SVG charts, positioned inside a card. */
export function useChartTip() {
  const [tip, setTip] = useState<TipState | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const show = useCallback((e: { clientX: number; clientY: number }, body: ReactNode) => {
    const host = hostRef.current;
    if (!host) return;
    const r = host.getBoundingClientRect();
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, body });
  }, []);
  const showAt = useCallback((x: number, y: number, body: ReactNode) => {
    setTip({ x, y, body });
  }, []);
  const hide = useCallback(() => setTip(null), []);
  const tipNode = tip ? (
    <div
      className="fo-tip"
      style={{
        left: Math.min(tip.x + 14, (hostRef.current?.clientWidth ?? 400) - 180),
        top: Math.max(4, tip.y - 10),
      }}
    >
      {tip.body}
    </div>
  ) : null;
  return { hostRef, show, showAt, hide, tipNode };
}

export function TipRows({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <>
      <div className="fo-tip-title">{title}</div>
      {rows.map(([k, v]) => (
        <div className="fo-tip-row" key={k}>
          <span>{k}</span>
          <b>{v}</b>
        </div>
      ))}
    </>
  );
}
