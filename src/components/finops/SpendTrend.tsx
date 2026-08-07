"use client";

import { useState } from "react";
import { CLOUDS, Cloud, cloudLabel } from "@/lib/finops/catalog";
import { DAILY_BY_CLOUD, DAYS } from "@/lib/finops/engine";
import { money, moneyFull } from "@/lib/finops/format";
import { CLOUD_VAR, TipRows, useChartTip, useMeasure } from "./primitives";

const H = 240;
const PAD = { top: 12, right: 8, bottom: 26, left: 46 };

/** Day labels: last 30 days of the demo period (Jul 8 – Aug 6, 2026). */
function dayLabel(i: number): string {
  const day = 8 + i;
  return day <= 31 ? `Jul ${day}` : `Aug ${day - 31}`;
}

export default function SpendTrend({ clouds }: { clouds: Cloud[] }) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hostRef, width] = useMeasure<HTMLDivElement>();
  const { hostRef: tipHost, show, hide, tipNode } = useChartTip();

  const series = CLOUDS.filter((c) => clouds.includes(c.id))
    .map((c) => DAILY_BY_CLOUD.find((d) => d.cloud === c.id))
    .filter((d): d is (typeof DAILY_BY_CLOUD)[number] => !!d);
  const totals = new Array(DAYS).fill(0);
  series.forEach((s) => s.days.forEach((v, i) => (totals[i] += v)));
  const maxDay = Math.max(...totals, 1);
  const yMax = Math.ceil(maxDay / 5000) * 5000;

  const innerW = Math.max(320, width) - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / DAYS;
  const barW = Math.min(24, Math.max(6, band - 4));
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH;

  const monthTotals = series.map((s) => ({
    cloud: s.cloud,
    total: s.days.reduce((a, b) => a + b, 0),
  }));

  return (
    <div className="fo-card">
      <div className="fo-card-head">
        <span className="fo-card-title">Daily AI spend by cloud</span>
        <span className="fo-card-sub">Last 30 days · all deployments</span>
        <span className="fo-card-right">
          <span className="fo-toggle" role="group" aria-label="View as chart or table">
            <button aria-pressed={view === "chart"} onClick={() => setView("chart")}>Chart</button>
            <button aria-pressed={view === "table"} onClick={() => setView("table")}>Table</button>
          </span>
        </span>
      </div>
      {view === "chart" ? (
        <div ref={hostRef}>
          <div ref={tipHost} style={{ position: "relative" }}>
            {width > 0 && (
              <svg width={width} height={H} role="img" aria-label="Stacked daily AI spend by cloud provider">
                {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                  <g key={f}>
                    <line
                      x1={PAD.left} x2={width - PAD.right}
                      y1={y(yMax * f)} y2={y(yMax * f)}
                      stroke={f === 0 ? "var(--baseline)" : "var(--grid)"} strokeWidth={1}
                    />
                    <text x={PAD.left - 8} y={y(yMax * f) + 3.5} textAnchor="end" fontSize={10} fill="var(--muted)">
                      {money(yMax * f)}
                    </text>
                  </g>
                ))}
                {totals.map((_, i) => {
                  const x = PAD.left + i * band + (band - barW) / 2;
                  let acc = 0;
                  return (
                    <g key={i}>
                      {series.map((s) => {
                        const v = s.days[i];
                        const y1 = y(acc + v);
                        const h = Math.max(0, y(acc) - y1 - 2); // 2px surface gap
                        acc += v;
                        if (h <= 0) return null;
                        return (
                          <rect
                            key={s.cloud} x={x} y={y1} width={barW} height={h} rx={2}
                            fill={CLOUD_VAR[s.cloud]}
                          />
                        );
                      })}
                      <rect
                        x={PAD.left + i * band} y={PAD.top} width={band} height={innerH}
                        fill="transparent"
                        tabIndex={0}
                        className="fo-focusable"
                        aria-label={`${dayLabel(i)}: ${moneyFull(totals[i])} total`}
                        onMouseMove={(e) =>
                          show(e, <TipRows title={dayLabel(i)} rows={[
                            ...series.map((s) => [cloudLabel(s.cloud), money(s.days[i])] as [string, string]),
                            ["Total", moneyFull(totals[i])],
                          ]} />)
                        }
                        onFocus={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          show({ clientX: r.left + r.width / 2, clientY: r.top }, <TipRows title={dayLabel(i)} rows={[["Total", moneyFull(totals[i])]]} />);
                        }}
                        onMouseLeave={hide}
                        onBlur={hide}
                      />
                      {i % 5 === 0 && (
                        <text x={PAD.left + i * band + band / 2} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--muted)">
                          {dayLabel(i)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
            {tipNode}
          </div>
          <div className="fo-legend">
            {monthTotals.map((m) => (
              <span className="fo-legend-item" key={m.cloud}>
                <span className="fo-dot" style={{ background: CLOUD_VAR[m.cloud] }} />
                {cloudLabel(m.cloud)} <b>{money(m.total)}/mo</b>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="fo-tablewrap">
          <table className="fo-table">
            <thead>
              <tr>
                <th>Cloud</th>
                {[0, 5, 10, 15, 20, 25, 29].map((i) => (
                  <th className="num" key={i}>{dayLabel(i)}</th>
                ))}
                <th className="num">30-day total</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.cloud}>
                  <td className="fo-cell-main">{cloudLabel(s.cloud)}</td>
                  {[0, 5, 10, 15, 20, 25, 29].map((i) => (
                    <td className="num" key={i}>{money(s.days[i])}</td>
                  ))}
                  <td className="num"><b>{moneyFull(s.days.reduce((a, b) => a + b, 0))}</b></td>
                </tr>
              ))}
              <tr>
                <td className="fo-cell-main">Total</td>
                {[0, 5, 10, 15, 20, 25, 29].map((i) => (
                  <td className="num" key={i}><b>{money(totals[i])}</b></td>
                ))}
                <td className="num"><b>{moneyFull(totals.reduce((a, b) => a + b, 0))}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
