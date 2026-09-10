"use client";

import { useState } from "react";
import { ROUTES, ROUTE_LABEL, type Result, type Route } from "@/lib/deal-check/engine";
import { monthLabel, usd } from "@/lib/deal-check/format";

const W = 720, H = 300, PAD = { l: 52, r: 96, t: 14, b: 30 };
const cls: Record<Route, string> = { nothing: "nothing", aws: "aws", gcp: "google" };

export default function CumChart({ result }: { result: Result }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = 36;
  const series = ROUTES.map((r) => ({ r, y: result.routes[r].series.cumNet }));
  const maxY = Math.max(1e-6, ...series.flatMap((s) => s.y));
  const minY = Math.min(0, ...series.flatMap((s) => s.y));
  const x = (m: number) => PAD.l + ((m + 1) / n) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - minY) / (maxY - minY)) * (H - PAD.t - PAD.b);
  const path = (vals: number[]) => vals.map((v, m) => `${m === 0 ? "M" : "L"}${x(m).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, k) => minY + ((maxY - minY) * k) / ticks);
  const hx = result.horizon;

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const m = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * n - 1);
    setHover(m >= 0 && m < n ? m : null);
  };

  // Direct labels at line ends, nudged apart.
  const ends = series.map((s) => ({ r: s.r, yy: y(s.y[n - 1]) })).sort((a, b) => a.yy - b.yy);
  for (let i = 1; i < ends.length; i++) if (ends[i].yy - ends[i - 1].yy < 13) ends[i].yy = ends[i - 1].yy + 13;

  return (
    <div className="dc-chartwrap">
      <div className="dc-legend">
        {ROUTES.map((r) => <span key={r}><span className={`dc-swatch ${cls[r]}`} />{ROUTE_LABEL[r]}</span>)}
        <span style={{ color: "var(--muted)" }}>dashed line = horizon</span>
      </div>
      <svg className="dc-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative net cost by route" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {yTicks.map((v) => (
          <g key={v}>
            <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end">{usd(v, 0)}</text>
          </g>
        ))}
        {[6, 12, 18, 24, 30, 36].map((m) => (
          <text key={m} x={x(m - 1)} y={H - 8} textAnchor="middle">{m}</text>
        ))}
        <text x={W - PAD.r} y={H - 8} textAnchor="start" dx={8} style={{ fill: "var(--muted)" }}>month</text>
        <line className="marker" x1={x(hx - 1)} x2={x(hx - 1)} y1={PAD.t} y2={H - PAD.b} />
        {series.map((s) => <path key={s.r} className={`line ${cls[s.r]}`} d={path(s.y)} />)}
        {ends.map((e) => (
          <text key={e.r} className="label" x={W - PAD.r + 8} y={e.yy + 4}>{ROUTE_LABEL[e.r]}</text>
        ))}
        {hover !== null && (
          <g>
            <line className="cross" x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} />
            {series.map((s) => <circle key={s.r} cx={x(hover)} cy={y(s.y[hover])} r={4} className={`line ${cls[s.r]}`} style={{ fill: "var(--surface)" }} />)}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div className="dc-tip" style={{ left: `${(x(hover) / W) * 100}%`, top: 24, transform: x(hover) > W * 0.7 ? "translateX(-105%)" : "translateX(8px)" }}>
          <div style={{ fontWeight: 600 }}>Month {hover + 1} · {monthLabel(hover)}</div>
          {series.map((s) => <div key={s.r}><span className={`dc-swatch ${cls[s.r]}`} />{ROUTE_LABEL[s.r]}: {usd(s.y[hover])}</div>)}
        </div>
      )}
    </div>
  );
}
