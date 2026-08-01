"use client";

import { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";
import type { ModelResult } from "@/lib/offers/model";
import { moneyK, percent } from "@/lib/offers/format";

/**
 * A representative day of the incremental workload: reserved PT capacity as a
 * band, demand riding over it, and everything above the band on PayGo.
 *
 * The curve shape is a fixed diurnal profile — deterministic, so server and
 * client render identically — scaled to the actual volumes. It illustrates the
 * shape of the split; the numbers beside it are the real ones.
 */

/** 24 hourly points, normalised to a mean of 1. A working day with an evening dip. */
const SHAPE = [
  0.42, 0.36, 0.33, 0.32, 0.35, 0.46, 0.68, 0.95, 1.24, 1.44, 1.52, 1.55,
  1.48, 1.51, 1.56, 1.49, 1.33, 1.14, 0.98, 0.86, 0.76, 0.66, 0.56, 0.47,
];

/**
 * The day at a given peakiness. k=0 is flat, k=1 is the base shape, higher is
 * spikier. A power transform rather than a linear one: it is mean-preserving
 * and never goes negative, so the total under the curve always equals the
 * volume being modelled.
 */
function curveAt(mean: number, k: number): number[] {
  const raw = SHAPE.map((s) => s ** k);
  const rawMean = raw.reduce((a, b) => a + b, 0) / raw.length;
  return raw.map((v) => (mean * v) / rawMean);
}

/**
 * Pick the peakiness whose area below the PT band equals the PT volume the
 * model actually reports, so the chart encodes the split rather than merely
 * suggesting one. Bisection — deterministic, so SSR and the client agree.
 */
function shapedDemand(
  mean: number,
  capacity: number,
  ptConsumed: number,
): number[] {
  if (mean <= 0) return curveAt(0, 1);
  const servedAt = (p: number) =>
    curveAt(mean, p).reduce((sum, d) => sum + Math.min(d, capacity), 0) /
    SHAPE.length;

  // served() falls as the day gets peakier; find where it hits ptConsumed.
  if (servedAt(0) <= ptConsumed) return curveAt(mean, 0);
  let lo = 0;
  let hi = 8;
  if (servedAt(hi) > ptConsumed) return curveAt(mean, hi);
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (servedAt(mid) > ptConsumed) lo = mid;
    else hi = mid;
  }
  return curveAt(mean, (lo + hi) / 2);
}

function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      setWidth((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
    });
    observer.observe(node);
    setWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

function formatTpm(tpm: number): string {
  if (tpm >= 1_000_000) return `${(tpm / 1_000_000).toFixed(1)}M`;
  if (tpm >= 1_000) return `${Math.round(tpm / 1_000)}K`;
  return String(Math.round(tpm));
}

export default function TrafficProfile({ result }: { result: ModelResult }) {
  const { ref, width: measured } = useMeasuredWidth();
  const width = Math.max(measured, 280);
  const compact = width < 620;
  const height = compact ? 190 : 230;

  const { traffic, levers } = result;
  const { tpmPerGsu } = levers;

  const meanDemand = traffic.totalConsumed;
  const ptCapacity = levers.ptGsus;
  // Shape the day so the area under the PT band really is the PT share of
  // volume. Without this the picture and the numbers beside it disagree.
  const demand = shapedDemand(meanDemand, ptCapacity, traffic.ptConsumed);
  const peak = Math.max(...demand, ptCapacity, 1);
  const yMax = peak * 1.12;

  const margin = { top: 14, right: compact ? 8 : 12, bottom: 26, left: compact ? 40 : 52 };
  const plotW = Math.max(width - margin.left - margin.right, 10);
  const plotH = Math.max(height - margin.top - margin.bottom, 10);

  const x = (i: number) => margin.left + (i / (SHAPE.length - 1)) * plotW;
  const y = (v: number) => margin.top + plotH - (v / yMax) * plotH;
  const baseline = margin.top + plotH;

  // Area served by PT (demand clipped at capacity) and the PayGo overflow.
  const served = demand.map((d) => Math.min(d, ptCapacity));
  const areaPath = (values: number[], floor: number[] | null) => {
    const up = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("");
    const down = floor
      ? floor
          .map((v, i) => `L${x(floor.length - 1 - i)},${y(floor[floor.length - 1 - i])}`)
          .join("")
      : `L${x(values.length - 1)},${baseline}L${x(0)},${baseline}`;
    return `${up}${down}Z`;
  };

  const description = `Representative day of the incremental workload. Reserved PT capacity ${traffic.ptCapacityTpm.toLocaleString("en-US")} tokens per minute, carrying ${percent(traffic.ptShareOfVolume)} of delivered volume; PayGo carries the remaining ${percent(traffic.paygoShareOfVolume)}. PT is ${percent(traffic.ptShareOfSpend)} of the incremental spend.`;

  const splits = [
    {
      label: "Provisioned Throughput",
      volume: traffic.ptShareOfVolume,
      spend: traffic.ptShareOfSpend,
      money: result.ptReference,
      colour: "var(--blue)",
    },
    {
      label: "PayGo",
      volume: traffic.paygoShareOfVolume,
      spend: traffic.paygoShareOfSpend,
      money: result.paygoReference,
      colour: "var(--green)",
    },
  ];

  return (
    <section className="o-panel p-4 sm:p-5" aria-labelledby="traffic-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="traffic-heading" className="o-eyebrow flex items-center gap-1.5">
          Incremental traffic shape
          <Tooltip
            label="the traffic shape"
            text="A representative day of the new workload. The blue area is what the reserved PT capacity absorbs; everything above the dashed line rides PayGo. The curve is shaped so the two areas match the split reported beside it, so the picture and the numbers agree. The time-of-day pattern itself is illustrative."
          />
        </h2>
        <p className="o-mono o-faint text-[10.5px]">
          {formatTpm(traffic.totalTpm)} TPM total · {formatTpm(tpmPerGsu)} TPM per GSU
        </p>
      </div>

      <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div ref={ref} className="w-full">
          {width > 0 ? (
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={description}
              style={{ display: "block", overflow: "visible" }}
            >
              <title>Incremental traffic shape</title>
              <desc>{description}</desc>

              {/* y gridlines */}
              <g aria-hidden="true">
                {[0, 0.5, 1].map((f) => (
                  <g key={f}>
                    <line
                      x1={margin.left}
                      x2={width - margin.right}
                      y1={y(yMax * f)}
                      y2={y(yMax * f)}
                      stroke="var(--line)"
                      strokeWidth={1}
                      opacity={f === 0 ? 1 : 0.5}
                    />
                    <text
                      x={margin.left - 7}
                      y={y(yMax * f) + 3}
                      textAnchor="end"
                      className="o-mono"
                      fontSize={9}
                      fill="var(--ink-faint)"
                    >
                      {formatTpm(yMax * f * tpmPerGsu)}
                    </text>
                  </g>
                ))}
              </g>

              {/* PayGo overflow — demand above the PT band */}
              <path
                d={areaPath(demand, served)}
                fill="var(--green)"
                opacity={0.32}
              />
              {/* PT-served volume */}
              <path d={areaPath(served, null)} fill="var(--blue)" opacity={0.34} />

              {/* Reserved capacity line — what is actually billed */}
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y(ptCapacity)}
                y2={y(ptCapacity)}
                stroke="var(--blue)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <text
                x={margin.left + 4}
                y={y(ptCapacity) - 5}
                className="o-mono"
                fontSize={9.5}
                fill="var(--blue)"
              >
                PT capacity ordered
              </text>

              {/* Demand outline */}
              <path
                d={demand.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("")}
                fill="none"
                stroke="var(--ink-dim)"
                strokeWidth={1.25}
              />

              {/* x labels */}
              <g aria-hidden="true">
                {[0, 6, 12, 18, 23].map((i) => (
                  <text
                    key={i}
                    x={x(i)}
                    y={baseline + 15}
                    textAnchor={i === 0 ? "start" : i === 23 ? "end" : "middle"}
                    className="o-mono"
                    fontSize={9}
                    fill="var(--ink-faint)"
                  >
                    {String(i).padStart(2, "0")}:00
                  </text>
                ))}
              </g>
            </svg>
          ) : (
            <div style={{ height }} />
          )}
        </div>

        {/* Split readout */}
        <div className="flex flex-col justify-center gap-3">
          {splits.map((split) => (
            <div key={split.label}>
              <p className="flex items-center gap-2 text-[12px]">
                <span
                  aria-hidden="true"
                  style={{
                    width: 9,
                    height: 9,
                    background: split.colour,
                    display: "inline-block",
                  }}
                />
                {split.label}
              </p>
              <div className="o-mono mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 pl-[17px] text-[10.5px]">
                <span className="o-faint">
                  volume{" "}
                  <span style={{ color: "var(--ink-dim)" }}>
                    {percent(split.volume, 0)}
                  </span>
                </span>
                <span className="o-faint">
                  spend{" "}
                  <span style={{ color: split.colour }}>
                    {percent(split.spend, 0)}
                  </span>
                </span>
                <span className="o-faint">{moneyK(split.money)}/mo</span>
              </div>
            </div>
          ))}

          {traffic.idleGsus > 0.5 ? (
            <p
              className="o-mono mt-1 text-[10px] leading-[1.6]"
              style={{ color: "var(--gold)" }}
            >
              {traffic.idleGsus.toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
              GSUs of PT ordered but unused at {percent(levers.ptUtilization, 0)}{" "}
              utilization — billed all the same.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
