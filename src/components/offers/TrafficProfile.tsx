"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "./Tooltip";
import type { ModelResult } from "@/lib/offers/model";
import { inUnit, moneyK, niceStep, percent, pickUnit } from "@/lib/offers/format";

/**
 * A day of the incremental workload at 5-minute resolution — jagged, the way
 * real TPM traces are, not a smooth hill. The reserved PT band sits under it;
 * everything above rides PayGo.
 *
 * The trace is deterministic (a fixed hash, no Math.random) so server and
 * client render the same pixels, and it is shaped so the area under the PT band
 * really equals the PT share the model reports.
 */

/** 5-minute samples across 24 hours. */
const SAMPLES = 288;
const PER_HOUR = SAMPLES / 24;

/** Hourly anchors for the diurnal envelope, mean ≈ 1. */
const ENVELOPE = [
  0.42, 0.36, 0.33, 0.32, 0.35, 0.46, 0.68, 0.95, 1.24, 1.44, 1.52, 1.55,
  1.48, 1.51, 1.56, 1.49, 1.33, 1.14, 0.98, 0.86, 0.76, 0.66, 0.56, 0.47,
];

/** Deterministic pseudo-noise in [0,1). Stable across server and client. */
function hash(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

/**
 * Minute-to-minute texture, independent of the diurnal shape: fast jitter, a
 * slow ripple, and sparse bursts. Held at fixed amplitude so that flexing the
 * envelope below never turns noise into implausible spikes.
 */
const TEXTURE: number[] = Array.from({ length: SAMPLES }, (_, i) => {
  const jitter = 0.74 + hash(i) * 0.52;
  const ripple = 1 + 0.09 * Math.sin(i * 0.9) + 0.05 * Math.sin(i * 2.7);
  const burst = hash(i * 7.3) > 0.972 ? 1.3 + hash(i * 3.1) * 0.45 : 1;
  return jitter * ripple * burst;
});

/** The diurnal envelope at 5-minute resolution, linearly interpolated. */
const ENVELOPE_FINE: number[] = Array.from({ length: SAMPLES }, (_, i) => {
  const h = i / PER_HOUR;
  const lo = ENVELOPE[Math.floor(h) % 24];
  const hi = ENVELOPE[(Math.floor(h) + 1) % 24];
  return lo + (hi - lo) * (h - Math.floor(h));
});

/**
 * The trace at a given peakiness. k flexes the diurnal envelope only — k=0 is a
 * flat day, k=1 the base profile, higher more peaked — while the texture stays
 * put. Mean-preserving, so the area always equals the volume being modelled.
 */
function traceAt(mean: number, k: number): number[] {
  const raw = ENVELOPE_FINE.map((e, i) => Math.max(0.02, e ** k * TEXTURE[i]));
  const rawMean = raw.reduce((a, b) => a + b, 0) / raw.length;
  return raw.map((v) => (mean * v) / rawMean);
}

/**
 * Pick the peakiness whose area below the PT band equals the PT volume the
 * model reports, so the picture and the numbers agree.
 */
function shapedTrace(mean: number, capacity: number, ptConsumed: number): number[] {
  if (mean <= 0) return traceAt(0, 1);
  const servedAt = (k: number) =>
    traceAt(mean, k).reduce((sum, d) => sum + Math.min(d, capacity), 0) / SAMPLES;

  if (servedAt(0) <= ptConsumed) return traceAt(mean, 0);
  let lo = 0;
  let hi = 5;
  if (servedAt(hi) > ptConsumed) return traceAt(mean, hi);
  for (let i = 0; i < 36; i += 1) {
    const mid = (lo + hi) / 2;
    if (servedAt(mid) > ptConsumed) lo = mid;
    else hi = mid;
  }
  return traceAt(mean, (lo + hi) / 2);
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

export default function TrafficProfile({ result }: { result: ModelResult }) {
  const { ref, width: measured } = useMeasuredWidth();
  const width = Math.max(measured, 280);
  const compact = width < 620;
  const height = compact ? 200 : 250;

  const { traffic, levers } = result;
  const { tpmPerGsu } = result.sizing;

  const ptCapacity = traffic.ptGsus;
  const trace = useMemo(
    () => shapedTrace(traffic.totalConsumed, ptCapacity, traffic.ptConsumed),
    [traffic.totalConsumed, ptCapacity, traffic.ptConsumed],
  );

  // Everything on the y-axis is TPM, in one unit, with round gridlines.
  const peakTpm = Math.max(...trace, ptCapacity, 1) * tpmPerGsu;
  const yMax = peakTpm * 1.08;
  const unit = pickUnit(yMax);
  const step = niceStep(yMax / 3);
  const gridlines: number[] = [];
  for (let v = 0; v <= yMax; v += step) gridlines.push(v);

  const margin = {
    top: 16,
    right: compact ? 8 : 12,
    bottom: 28,
    left: compact ? 44 : 58,
  };
  const plotW = Math.max(width - margin.left - margin.right, 10);
  const plotH = Math.max(height - margin.top - margin.bottom, 10);

  const x = (i: number) => margin.left + (i / (SAMPLES - 1)) * plotW;
  const y = (tpm: number) => margin.top + plotH - (tpm / yMax) * plotH;
  const baseline = margin.top + plotH;

  const demandTpm = trace.map((v) => v * tpmPerGsu);
  const capacityTpm = ptCapacity * tpmPerGsu;
  const servedTpm = demandTpm.map((d) => Math.min(d, capacityTpm));

  const areaPath = (values: number[], floor: number[] | null) => {
    const up = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("");
    const down = floor
      ? floor
          .map((_, i) => {
            const j = floor.length - 1 - i;
            return `L${x(j)},${y(floor[j])}`;
          })
          .join("")
      : `L${x(values.length - 1)},${baseline}L${x(0)},${baseline}`;
    return `${up}${down}Z`;
  };

  const description = `A day of the incremental workload at five-minute resolution. Reserved PT capacity ${inUnit(capacityTpm, unit)} tokens per minute carries ${percent(traffic.ptShareOfVolume)} of delivered volume; PayGo carries the remaining ${percent(traffic.paygoShareOfVolume)}, and is ${percent(traffic.paygoShareOfSpend)} of the incremental spend.`;

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
          What the traffic looks like
          <Tooltip
            label="the traffic shape"
            text="A day of the new workload at five-minute resolution. The blue band is what the reserved PT capacity absorbs; every spike above the dashed line rides PayGo. The trace is shaped so the two areas match the split reported beside it. The minute-to-minute pattern is illustrative; the split is computed from your inputs."
          />
        </h2>
        <p className="o-mono o-faint text-[10.5px]">
          peak {inUnit(peakTpm, unit)} TPM · {inUnit(tpmPerGsu, pickUnit(tpmPerGsu))} TPM
          per GSU
        </p>
      </div>

      <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_236px]">
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
              <title>Incremental traffic, one day</title>
              <desc>{description}</desc>

              <g aria-hidden="true">
                {gridlines.map((v) => (
                  <g key={v}>
                    <line
                      x1={margin.left}
                      x2={width - margin.right}
                      y1={y(v)}
                      y2={y(v)}
                      stroke="var(--line)"
                      strokeWidth={1}
                      opacity={v === 0 ? 1 : 0.45}
                    />
                    <text
                      x={margin.left - 7}
                      y={y(v) + 3}
                      textAnchor="end"
                      className="o-mono"
                      fontSize={9}
                      fill="var(--ink-faint)"
                    >
                      {inUnit(v, unit)}
                    </text>
                  </g>
                ))}
                <text
                  x={margin.left - 7}
                  y={margin.top - 5}
                  textAnchor="end"
                  className="o-mono"
                  fontSize={8.5}
                  fill="var(--ink-faint)"
                >
                  TPM
                </text>
              </g>

              {/* PayGo — every spike above the reserved band */}
              <path d={areaPath(demandTpm, servedTpm)} fill="var(--green)" opacity={0.4} />
              {/* PT — what the reserved capacity absorbs */}
              <path d={areaPath(servedTpm, null)} fill="var(--blue)" opacity={0.4} />

              {/* Reserved capacity — what is actually billed */}
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y(capacityTpm)}
                y2={y(capacityTpm)}
                stroke="var(--blue)"
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />
              <text
                x={margin.left + 5}
                y={y(capacityTpm) - 5}
                className="o-mono"
                fontSize={9.5}
                fill="var(--blue)"
              >
                PT reserved · {inUnit(capacityTpm, unit)}
              </text>

              {/* The trace itself */}
              <path
                d={demandTpm.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("")}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={0.8}
                strokeLinejoin="round"
                opacity={0.85}
              />

              <g aria-hidden="true">
                {[0, 6, 12, 18, 24].map((hour) => (
                  <text
                    key={hour}
                    x={x(Math.min(hour * PER_HOUR, SAMPLES - 1))}
                    y={baseline + 16}
                    textAnchor={hour === 0 ? "start" : hour === 24 ? "end" : "middle"}
                    className="o-mono"
                    fontSize={9}
                    fill="var(--ink-faint)"
                  >
                    {String(hour % 24).padStart(2, "0")}:00
                  </text>
                ))}
              </g>
            </svg>
          ) : (
            <div style={{ height }} />
          )}
        </div>

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
                  <span style={{ color: split.colour }}>{percent(split.spend, 0)}</span>
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
              GSUs reserved but unused at {percent(levers.ptUtilization, 0)} — billed
              all the same.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
