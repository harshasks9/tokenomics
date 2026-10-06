"use client";

import { useMemo, useState } from "react";
import type { Model, WorkloadInput } from "@/lib/pricing/types";
import { BENCHMARKS, benchById } from "@/lib/pricing/benchmarks";
import { PROVIDERS, TIER_HEX, TIER_LABEL, providerById } from "@/lib/pricing/presets";
import { blendedPricePerM, fmtPerM } from "@/lib/pricing/calc";
import { useTip } from "./Tooltip";

/**
 * Cost vs capability. x = blended $/1M for the user's workload (log scale);
 * y = selected benchmark. Color = editorial tier (ordinal ramp, 3 steps);
 * shape = provider; Pareto-frontier points carry direct labels, the rest
 * live in tooltip + the table twin. Models lacking a comparable score are
 * excluded and listed.
 */

const W = 860;
const H = 440;
const PAD = { l: 52, r: 24, t: 18, b: 46 };

function glyphPath(glyph: string, cx: number, cy: number, r: number): React.ReactNode {
  switch (glyph) {
    case "▲":
      return <polygon points={`${cx},${cy - r} ${cx + r},${cy + r * 0.85} ${cx - r},${cy + r * 0.85}`} />;
    case "■":
      return <rect x={cx - r * 0.85} y={cy - r * 0.85} width={r * 1.7} height={r * 1.7} />;
    case "◆":
      return <polygon points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} />;
    case "✚":
      return <path d={`M${cx - r * 0.35},${cy - r} h${r * 0.7} v${r * 0.65} h${r * 0.65} v${r * 0.7} h-${r * 0.65} v${r * 0.65} h-${r * 0.7} v-${r * 0.65} h-${r * 0.65} v-${r * 0.7} h${r * 0.65} z`} />;
    case "⬟":
      return <polygon points={`${cx},${cy - r} ${cx + r * 0.95},${cy - r * 0.31} ${cx + r * 0.59},${cy + r * 0.81} ${cx - r * 0.59},${cy + r * 0.81} ${cx - r * 0.95},${cy - r * 0.31}`} />;
    case "✦":
      return <polygon points={`${cx},${cy - r} ${cx + r * 0.3},${cy - r * 0.3} ${cx + r},${cy} ${cx + r * 0.3},${cy + r * 0.3} ${cx},${cy + r} ${cx - r * 0.3},${cy + r * 0.3} ${cx - r},${cy} ${cx - r * 0.3},${cy - r * 0.3}`} />;
    case "✖":
      return <path d={`M${cx - r},${cy - r} L${cx + r},${cy + r} M${cx + r},${cy - r} L${cx - r},${cy + r}`} strokeWidth={r * 0.7} strokeLinecap="round" fill="none" />;
    default:
      return <circle cx={cx} cy={cy} r={r} />;
  }
}

export default function Scatter({ models, workload, benchId, onBench }: { models: Model[]; workload: WorkloadInput; benchId: string; onBench: (id: string) => void }) {
  const tip = useTip();
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const bench = benchById(benchId)!;

  const { pts, excluded, xDom, yDom, frontier } = useMemo(() => {
    const pts: { m: Model; x: number; y: number; selfReported: boolean }[] = [];
    const excluded: { m: Model; why: string }[] = [];
    for (const m of models) {
      const s = m.benchmarks[benchId];
      const x = blendedPricePerM(m, workload);
      if (!s) excluded.push({ m, why: `no comparable ${bench.short} score` });
      else if (x == null) excluded.push({ m, why: "no public token pricing" });
      else pts.push({ m, x, y: s.score, selfReported: !!s.selfReported });
    }
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const xDom: [number, number] = xs.length ? [Math.min(...xs) / 1.6, Math.max(...xs) * 1.6] : [0.05, 50];
    const ySpan = ys.length ? Math.max(1, Math.max(...ys) - Math.min(...ys)) : 10;
    const yDom: [number, number] = ys.length ? [Math.min(...ys) - ySpan * 0.12, Math.max(...ys) + ySpan * 0.12] : [0, 100];
    // Pareto frontier: no other point is both cheaper and higher-scoring.
    const frontier = new Set(
      pts.filter((p) => !pts.some((q) => q !== p && q.x <= p.x && q.y >= p.y && (q.x < p.x || q.y > p.y))).map((p) => p.m.id),
    );
    return { pts, excluded, xDom, yDom, frontier };
  }, [models, workload, benchId, bench.short]);

  const sx = (x: number) => PAD.l + ((Math.log10(x) - Math.log10(xDom[0])) / (Math.log10(xDom[1]) - Math.log10(xDom[0]))) * (W - PAD.l - PAD.r);
  const sy = (y: number) => H - PAD.b - ((y - yDom[0]) / (yDom[1] - yDom[0])) * (H - PAD.t - PAD.b);

  const xTicks = [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100].filter((t) => t >= xDom[0] && t <= xDom[1]);
  // "Nice" y ticks: 1/2/5 × 10^k chosen to yield roughly 5–7 ticks.
  const rawStep = (yDom[1] - yDom[0]) / 6;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const yStep = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= rawStep) ?? mag * 10;
  const yTicks: number[] = [];
  for (let v = Math.ceil(yDom[0] / yStep) * yStep; v <= yDom[1] + 1e-9; v += yStep) yTicks.push(Number(v.toFixed(6)));
  const labelAll = pts.length <= 8;
  // Frontier polyline (cheapest → best): step down in price as score rises.
  const frontierPts = pts.filter((p) => frontier.has(p.m.id)).sort((a, b) => a.x - b.x);
  const frontierPath = frontierPts.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");
  const washPath = frontierPts.length > 1
    ? `${frontierPath} L${sx(frontierPts[frontierPts.length - 1].x).toFixed(1)},${(H - PAD.b).toFixed(1)} L${sx(frontierPts[0].x).toFixed(1)},${(H - PAD.b).toFixed(1)} Z`
    : "";

  const providersShown = PROVIDERS.filter((p) => pts.some((q) => q.m.provider === p.id));

  return (
    <div className="px-card px-scatter">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Capability axis</span>
          {BENCHMARKS.map((b) => (
            <button key={b.id} className={`px-chip ${benchId === b.id ? "on" : ""}`} onClick={() => onBench(b.id)} title={b.name}>
              {b.short}
            </button>
          ))}
        </div>
        <button className={`px-table-toggle ${table ? "on" : ""}`} onClick={() => setTable((t) => !t)} aria-pressed={table}>
          table
        </button>
      </div>

      {table ? (
        <table className="px-plain" aria-label="Cost vs capability table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Tier</th>
              <th style={{ textAlign: "right" }}>Blended $/1M (your mix)</th>
              <th style={{ textAlign: "right" }}>{bench.short}</th>
              <th>On frontier</th>
            </tr>
          </thead>
          <tbody>
            {[...pts].sort((a, b) => a.x - b.x).map((p) => (
              <tr key={p.m.id}>
                <td>{p.m.name}</td>
                <td>{TIER_LABEL[p.m.tier]}</td>
                <td className="n">{fmtPerM(p.x)}</td>
                <td className="n">
                  {p.y}
                  {p.selfReported ? " (vendor)" : ""}
                </td>
                <td>{frontier.has(p.m.id) ? "yes" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Scatter of blended price versus ${bench.name}`}>
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line className="gd" x1={PAD.l} x2={W - PAD.r} y1={sy(t)} y2={sy(t)} />
              <text x={PAD.l - 8} y={sy(t) + 3.5} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line className="gd" y1={PAD.t} y2={H - PAD.b} x1={sx(t)} x2={sx(t)} />
              <text x={sx(t)} y={H - PAD.b + 16} textAnchor="middle">
                ${t}
              </text>
            </g>
          ))}
          <line className="ax" x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} />
          <line className="ax" x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} />
          <text className="axl" x={(PAD.l + W - PAD.r) / 2} y={H - 8} textAnchor="middle">
            Blended $ per 1M tokens for your workload mix (log scale) → cheaper is left
          </text>
          <text className="axl" transform={`translate(14 ${(PAD.t + H - PAD.b) / 2}) rotate(-90)`} textAnchor="middle">
            {bench.short} ({bench.unit}) → better is up
          </text>

          {washPath && <path className="frontier-wash" d={washPath} />}
          {frontierPts.length > 1 && <path className="frontier" d={frontierPath} />}
          {pts.map((p) => {
            const cx = sx(p.x);
            const cy = sy(p.y);
            const col = TIER_HEX[p.m.tier];
            const glyph = providerById(p.m.provider).glyph;
            const dim = hover && hover !== p.m.id;
            const labeled = labelAll || frontier.has(p.m.id) || hover === p.m.id;
            return (
              <g
                key={p.m.id}
                className={`pt ${dim ? "dim" : ""}`}
                tabIndex={0}
                onMouseEnter={(e) => {
                  setHover(p.m.id);
                  tip.show(
                    {
                      title: p.m.name,
                      rows: [
                        { label: "Blended $/1M (your mix)", value: fmtPerM(p.x) },
                        { label: bench.short, value: `${p.y}${p.selfReported ? " (vendor-reported)" : ""}` },
                        { label: "Tier", value: TIER_LABEL[p.m.tier] },
                        { label: "Provider", value: providerById(p.m.provider).name },
                      ],
                      note: frontier.has(p.m.id) ? "On the cost-capability frontier: nothing visible is both cheaper and higher-scoring." : undefined,
                    },
                    e.clientX,
                    e.clientY,
                  );
                }}
                onMouseMove={(e) => tip.move(e.clientX, e.clientY)}
                onMouseLeave={() => {
                  setHover(null);
                  tip.hide();
                }}
                onFocus={(e) => {
                  setHover(p.m.id);
                  const r = (e.target as SVGGElement).getBoundingClientRect();
                  tip.show({ title: p.m.name, rows: [{ label: "Blended $/1M", value: fmtPerM(p.x) }, { label: bench.short, value: `${p.y}` }] }, r.left, r.top);
                }}
                onBlur={() => {
                  setHover(null);
                  tip.hide();
                }}
              >
                <circle className="hit" cx={cx} cy={cy} r={14} />
                <circle className="ring" cx={cx} cy={cy} r={7.5} />
                <g className="mk" fill={col} stroke={col}>
                  {glyphPath(glyph, cx, cy, 5.5)}
                </g>
                {labeled && (
                  <text className="lbl" x={cx + 10} y={cy + 3.5}>
                    {p.m.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}

      <div className="px-axis-note">
        <div>
          <strong>Horizontal axis.</strong> Blended $/1M = (fresh input + cached input + output cost for your calculator workload) ÷ total tokens — so it moves with the
          cache-hit and batch sliders. Log scale; {labelAll ? "all points are labeled" : "labels mark the Pareto frontier (hover or use the table for the rest)"}.
        </div>
        <div>
          <strong>Vertical axis.</strong> {bench.name}: {bench.measures} Snapshot {bench.snapshot}. {bench.caveat}
        </div>
      </div>
      <div className="px-legend">
        {(["frontier", "balanced", "economy"] as const).map((t) => (
          <span key={t} className="k">
            <span className="sw" style={{ background: TIER_HEX[t] }} /> {TIER_LABEL[t]} tier
          </span>
        ))}
        <span className="k"><span style={{ width: 16, height: 0, borderTop: "1.5px solid var(--ink-3)", display: "inline-block" }} /> cost–capability frontier</span>
        <span className="px-sep" />
        {providersShown.map((p) => (
          <span key={p.id} className="k">
            <span aria-hidden style={{ width: 14, textAlign: "center" }}>{p.glyph}</span> {p.name}
          </span>
        ))}
      </div>
      {excluded.length > 0 && (
        <div className="px-excluded">
          Excluded ({excluded.length}): {excluded.map((e) => `${e.m.name} — ${e.why}`).join("; ")}.
        </div>
      )}
    </div>
  );
}
