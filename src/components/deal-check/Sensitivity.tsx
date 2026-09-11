"use client";

import { useMemo, useState } from "react";
import { sensitivity, type Inputs, type NumericKey } from "@/lib/deal-check/engine";
import { INPUT_META } from "@/lib/deal-check/terms";
import { usd } from "@/lib/deal-check/format";

const PARAMS: NumericKey[] = ["geminiShare", "geminiCostRatio", "anthSpend", "growth", "migPct", "migStart", "migCost", "awsBaseline", "awsCommitRemaining", "awsOtherSpend", "mapPct", "partnerPass", "gcpAiSpend", "gcpOtherSpend", "gcpPct", "gcpForecastY1", "gcpCommitNew", "gcpCommitExisting", "awsDiscount", "gcpDiscount", "gcpSignMonth"];

const W = 720, H = 260, PAD = { l: 52, r: 20, t: 14, b: 34 };

export default function Sensitivity({ inputs }: { inputs: Inputs }) {
  const [key, setKey] = useState<NumericKey>("geminiShare");
  const [hover, setHover] = useState<number | null>(null);
  const meta = INPUT_META[key];
  const lo = "min" in meta ? meta.min : 0, hi = "max" in meta ? meta.max : 100;
  const pts = useMemo(() => sensitivity(inputs, key, lo, hi, 40), [inputs, key, lo, hi]);
  const ys = pts.map((p) => p.y);
  const rawMax = Math.max(0.5, ...ys), rawMin = Math.min(-0.5, ...ys);
  // Nice ticks: a round step that gives ~5 gridlines, with zero always on a tick.
  const span = rawMax - rawMin;
  const step = [1, 2, 2.5, 5, 10].map((k) => k * Math.pow(10, Math.floor(Math.log10(span / 5)))).find((st) => span / st <= 6) ?? span / 5;
  const maxY = Math.ceil(rawMax / step) * step, minY = Math.floor(rawMin / step) * step;
  const yTicks: number[] = [];
  for (let v = minY; v <= maxY + 1e-9; v += step) yTicks.push(v);
  const x = (v: number) => PAD.l + ((v - lo) / (hi - lo)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - minY) / (maxY - minY)) * (H - PAD.t - PAD.b);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x).toFixed(1)},${y(p.y).toFixed(1)}`).join(" ");
  const clip = (sign: 1 | -1) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.x).toFixed(1)},${y(sign > 0 ? Math.max(0, p.y) : Math.min(0, p.y)).toFixed(1)}`).join(" ") + ` L${x(hi).toFixed(1)},${y(0).toFixed(1)} L${x(lo).toFixed(1)},${y(0).toFixed(1)} Z`;
  const cur = inputs[key];
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * 40);
    setHover(i >= 0 && i <= 40 ? i : null);
  };
  const unit = "unit" in meta && meta.unit ? meta.unit : "";
  const fmtX = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1)) + (unit ? " " + unit : "");
  return (
    <div className="dc-chartwrap">
      <div className="dc-toolbar">
        <label style={{ fontSize: 13, color: "var(--ink-2)" }}>Parameter</label>
        <select className="dc-select" value={key} onChange={(e) => setKey(e.target.value as NumericKey)} aria-label="Sensitivity parameter">
          {PARAMS.map((k) => <option key={k} value={k}>{INPUT_META[k].label}</option>)}
        </select>
      </div>
      <div className="dc-legend"><span><span className="dc-swatch google" />Google cheaper (above zero)</span><span><span className="dc-swatch aws" />AWS cheaper (below zero)</span><span style={{ color: "var(--muted)" }}>y = AWS net cost − Google net cost</span></div>
      <svg className="dc-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Advantage versus ${meta.label}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <path className="above" d={clip(1)} />
        <path className="below" d={clip(-1)} />
        {yTicks.map((v) => (
          <g key={v}><line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} /><text x={PAD.l - 6} y={y(v) + 4} textAnchor="end">{usd(v, step < 1 ? 1 : 0)}</text></g>
        ))}
        <line className="zero" x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)} />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = lo + (hi - lo) * f;
          return <text key={f} x={x(v)} y={H - 12} textAnchor="middle">{Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(v % 1 ? 1 : 0)}</text>;
        })}
        <text x={W - PAD.r} y={H - 0} textAnchor="end" style={{ fill: "var(--muted)" }}>{meta.label}{unit ? ` (${unit})` : ""}</text>
        <path className="line" d={line} style={{ stroke: "var(--ink)" }} />
        {cur >= lo && cur <= hi && <line className="marker" x1={x(cur)} x2={x(cur)} y1={PAD.t} y2={H - PAD.b} />}
        {cur >= lo && cur <= hi && <text className="label" x={x(cur)} y={PAD.t + 10} textAnchor={cur > (lo + hi) / 2 ? "end" : "start"} dx={cur > (lo + hi) / 2 ? -4 : 4}>now</text>}
        {hover !== null && <g><line className="cross" x1={x(pts[hover].x)} x2={x(pts[hover].x)} y1={PAD.t} y2={H - PAD.b} /><circle cx={x(pts[hover].x)} cy={y(pts[hover].y)} r={4} style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2 }} /></g>}
      </svg>
      {hover !== null && (
        <div className="dc-tip" style={{ left: `${(x(pts[hover].x) / W) * 100}%`, top: 70, transform: x(pts[hover].x) > W * 0.7 ? "translateX(-105%)" : "translateX(8px)" }}>
          <div style={{ fontWeight: 600 }}>{meta.label}: {fmtX(pts[hover].x)}</div>
          <div>{pts[hover].y >= 0 ? "Google" : "AWS"} cheaper by {usd(Math.abs(pts[hover].y))}</div>
        </div>
      )}
    </div>
  );
}
