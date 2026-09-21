"use client";

import { useState } from "react";
import { COMMITMENT, TERM_MONTHS, type Result } from "@/lib/mdes/engine";
import { exactUsd, usd } from "@/lib/mdes/format";

const W = 760, H = 290, PAD = { l: 58, r: 16, t: 18, b: 34 };

export default function SpendChart({ result }: { result: Result }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = result.window;
  const rows = result.months;
  const maxV = Math.max(COMMITMENT, ...rows.map((r) => Math.max(r.cumConsumption, r.cumContractedFees))) * 1.08;
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b;
  const x = (m: number) => PAD.l + (m / n) * innerW;
  const y = (v: number) => PAD.t + (1 - v / maxV) * innerH;
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, k) => (maxV * k) / ticks);

  const line = (get: (r: Result["months"][number]) => number) =>
    `M${x(0).toFixed(1)},${y(0).toFixed(1)} ` + rows.map((r) => `L${x(r.m).toFixed(1)},${y(get(r)).toFixed(1)}`).join(" ");
  const area = (top: (r: Result["months"][number]) => number, bottom: (r: Result["months"][number]) => number) =>
    `M${x(0).toFixed(1)},${y(0).toFixed(1)} ` + rows.map((r) => `L${x(r.m).toFixed(1)},${y(top(r)).toFixed(1)}`).join(" ") +
    ` ` + rows.slice().reverse().map((r) => `L${x(r.m).toFixed(1)},${y(bottom(r)).toFixed(1)}`).join(" ") + ` L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;

  const hasGcp = result.total.gcpCounted > 0;
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const m = Math.round(((px - PAD.l) / innerW) * n);
    setHover(m >= 1 && m <= n ? m : null);
  };
  const hr = hover !== null ? rows[hover - 1] : null;

  return (
    <div className="mg-chartwrap">
      <div className="mg-legend">
        <span><i className="sw ge" />Cumulative GE spend</span>
        {hasGcp && <span><i className="sw gcp" />GCP counted (proposed)</span>}
        <span><i className="sw contracted" />Contracted fees (invoiced)</span>
        <span><i className="sw commit" />$10.8M commitment</span>
      </div>
      <svg className="mg-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative consumption against the commitment" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {n > TERM_MONTHS && <rect className="ext" x={x(TERM_MONTHS)} y={PAD.t} width={x(n) - x(TERM_MONTHS)} height={innerH} />}
        {yTicks.map((v) => (
          <g key={v}>
            <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end">{usd(v, 1)}</text>
          </g>
        ))}
        <path className="area ge" d={area((r) => r.cumGe, () => 0)} />
        {hasGcp && <path className="area gcp" d={area((r) => r.cumConsumption, (r) => r.cumGe)} />}
        <path className="line ge" d={line((r) => r.cumConsumption)} />
        <path className="line contracted" d={line((r) => r.cumContractedFees)} />
        <line className="commit" x1={PAD.l} x2={W - PAD.r} y1={y(COMMITMENT)} y2={y(COMMITMENT)} />
        <text x={PAD.l + 6} y={y(COMMITMENT) - 5} textAnchor="start" className="lbl">$10.8M commitment</text>
        <line className="marker" x1={x(TERM_MONTHS)} x2={x(TERM_MONTHS)} y1={PAD.t} y2={PAD.t + innerH} />
        <text x={x(TERM_MONTHS) - 4} y={PAD.t + innerH - 6} textAnchor="end" className="lbl">Month 12</text>
        {result.completionMonth !== null && (
          <g>
            <circle cx={x(result.completionMonth)} cy={y(rows[result.completionMonth - 1].cumConsumption)} r={5} className="dot" />
            <text x={x(result.completionMonth) - 9} y={y(rows[result.completionMonth - 1].cumConsumption) + 16} textAnchor="end" className="lbl">consumed M{result.completionMonth}</text>
          </g>
        )}
        {Array.from({ length: n }, (_, i) => i + 1).filter((m) => n <= 18 || m % 2 === 0).map((m) => (
          <text key={m} x={x(m)} y={H - 12} textAnchor="middle">M{m}</text>
        ))}
        {hr && (
          <g>
            <line className="cross" x1={x(hr.m)} x2={x(hr.m)} y1={PAD.t} y2={PAD.t + innerH} />
            <g className="tip" transform={`translate(${Math.min(W - 196, Math.max(PAD.l, x(hr.m) - 90))},${PAD.t + 2})`}>
              <rect width={186} height={hasGcp ? 70 : 56} rx={6} />
              <text x={8} y={15} className="t1">M{hr.m} · {hr.label.split(" · ")[1]}{hr.isExtension ? " · ext" : ""}</text>
              <text x={8} y={31} className="t2">Consumed {usd(hr.cumConsumption)} · remaining {usd(hr.remaining)}</text>
              <text x={8} y={46} className="t2">Invoiced (contract) {usd(hr.cumContractedFees)}</text>
              {hasGcp && <text x={8} y={61} className="t2">GE {usd(hr.cumGe)} · GCP {usd(hr.cumGcp)}</text>}
              <title>{exactUsd(hr.cumConsumption)}</title>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
