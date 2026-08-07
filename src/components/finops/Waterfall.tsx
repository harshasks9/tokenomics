"use client";

import { LEVER_META, LeverKind, WATERFALL } from "@/lib/finops/engine";
import { money } from "@/lib/finops/format";
import { TipRows, useChartTip, useMeasure } from "./primitives";

const H = 260;
const PAD = { top: 18, right: 12, bottom: 46, left: 46 };
const ORDER: LeverKind[] = ["substitution", "caching", "batching", "capacity"];

/** Split an axis label into at most two balanced lines. */
function splitLabel(label: string): string[] {
  const words = label.split(" ");
  if (words.length < 2) return [label];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    if (Math.abs(a - b) < bestDiff) {
      bestDiff = Math.abs(a - b);
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/** Where the savings are trapped: current spend → four levers → frontier spend. */
export default function Waterfall({ monthlySpend, frontierSpend }: { monthlySpend: number; frontierSpend: number }) {
  const [hostRef, width] = useMeasure<HTMLDivElement>();
  const { hostRef: tipHost, show, hide, tipNode } = useChartTip();

  const steps: { key: string; label: string; from: number; to: number; kind: "total" | "drop" }[] = [];
  let run = monthlySpend;
  steps.push({ key: "current", label: "Current spend", from: 0, to: monthlySpend, kind: "total" });
  for (const k of ORDER) {
    const v = WATERFALL[k];
    steps.push({ key: k, label: LEVER_META[k].label, from: run - v, to: run, kind: "drop" });
    run -= v;
  }
  steps.push({ key: "frontier", label: "Frontier spend", from: 0, to: frontierSpend, kind: "total" });

  const W = Math.max(340, width);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / steps.length;
  const barW = Math.min(58, band - 14);
  const yMax = Math.ceil(monthlySpend / 100_000) * 100_000;
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH;

  return (
    <div className="fo-card">
      <div className="fo-card-head">
        <span className="fo-card-title">Where the savings are trapped</span>
        <span className="fo-card-sub">Monthly gap decomposed by lever · sums exactly to the frontier</span>
      </div>
      <div ref={hostRef}>
        <div ref={tipHost} style={{ position: "relative" }}>
          {width > 0 && (
            <svg width={W} height={H} role="img" aria-label="Waterfall of monthly savings by optimization lever">
              {[0, 0.5, 1].map((f) => (
                <g key={f}>
                  <line x1={PAD.left} x2={W - PAD.right} y1={y(yMax * f)} y2={y(yMax * f)} stroke={f === 0 ? "var(--baseline)" : "var(--grid)"} strokeWidth={1} />
                  <text x={PAD.left - 8} y={y(yMax * f) + 3.5} textAnchor="end" fontSize={10} fill="var(--muted)">{money(yMax * f)}</text>
                </g>
              ))}
              {steps.map((s, i) => {
                const cx = PAD.left + i * band + band / 2;
                const top = y(s.to);
                const h = Math.max(2, y(s.from) - top);
                const fill = s.kind === "total" ? "var(--seq-550)" : "var(--seq-350)";
                const v = s.to - s.from;
                return (
                  <g key={s.key}>
                    {s.kind === "drop" && (
                      <line x1={cx - band / 2 + 6} x2={cx - barW / 2} y1={y(s.to)} y2={y(s.to)} stroke="var(--baseline)" strokeWidth={1} />
                    )}
                    <rect
                      x={cx - barW / 2} y={top} width={barW} height={h} rx={3}
                      fill={fill}
                      tabIndex={0}
                      className="fo-focusable"
                      aria-label={`${s.label}: ${money(v)} per month`}
                      onMouseMove={(e) => show(e, <TipRows title={s.label} rows={[
                        [s.kind === "drop" ? "Monthly savings" : "Monthly spend", money(v)],
                        ["Annualized", money(v * 12)],
                        ...(s.kind === "drop" ? [[LEVER_META[s.key as LeverKind].desc, ""] as [string, string]] : []),
                      ]} />)}
                      onFocus={(e) => { const r = e.currentTarget.getBoundingClientRect(); show({ clientX: r.left, clientY: r.top }, <TipRows title={s.label} rows={[["Monthly", money(v)]]} />); }}
                      onMouseLeave={hide}
                      onBlur={hide}
                    />
                    <text x={cx} y={top - 6} textAnchor="middle" fontSize={11} fontWeight={650} fill="var(--ink)">
                      {s.kind === "drop" ? `−${money(v)}` : money(v)}
                    </text>
                    {splitLabel(s.label).map((line, li) => (
                      <text key={li} x={cx} y={H - 30 + li * 12} textAnchor="middle" fontSize={9.5} fill="var(--muted)">
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}
            </svg>
          )}
          {tipNode}
        </div>
        <p className="fo-note" style={{ marginTop: 8 }}>
          Sequential attribution per workload: capacity → caching → batching → model substitution.
          Routing and prompt-reduction upside (app-layer work) is listed separately under Opportunities.
        </p>
      </div>
    </div>
  );
}
