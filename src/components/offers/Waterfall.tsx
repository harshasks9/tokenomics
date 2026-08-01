"use client";

import { useEffect, useRef, useState } from "react";
import type { Accent, ModelResult, Step } from "@/lib/offers/model";
import { moneyK, multiplier, percent } from "@/lib/offers/format";

const ACCENT_VAR: Record<Accent, string> = {
  gold: "var(--gold)",
  blue: "var(--blue)",
  green: "var(--green)",
  fsp: "var(--fsp)",
  teal: "var(--teal)",
};

/** Seven columns inside 330px leaves ~47px per tick — these have to be terse. */
const SHORT_LABEL: Record<string, string> = {
  reference: "Spend",
  bogo: "BOGO",
  offpeak: "Off-pk",
  deferred: "Def",
  fsp: "FSP",
  gsu: "GSU",
  q3: "Q3",
};

/**
 * A readable gridline interval near `rough`. The scale itself is *not* rounded
 * up to the next nice number — that wasted up to half the plot height — so the
 * tallest bar always fills the frame and gridlines land on round values below
 * it.
 */
function niceStep(rough: number): number {
  if (rough <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  // A fine-grained ladder: a coarse one (1/2/5/10) rounds 6.5 up to 10 and
  // leaves the plot with only two gridlines.
  const ladder = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 10];
  const step = ladder.find((rung) => normalized <= rung) ?? 10;
  return step * magnitude;
}

/** Nudge a centred text baseline so it reads as vertically centred. */
function valueLabelFontOffset(fontSize: number): number {
  return fontSize / 3;
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

export interface WaterfallProps {
  result: ModelResult;
  /** Pinned scenario A, drawn as a ghost outline behind the live bars. */
  compare?: ModelResult | null;
  present?: boolean;
}

export default function Waterfall({ result, compare, present }: WaterfallProps) {
  const { ref, width: measured } = useMeasuredWidth();
  const width = Math.max(measured, 280);
  const compact = width < 700;
  const height = present ? 560 : compact ? 380 : 470;

  const steps = result.steps;

  const margin = {
    top: compact ? 30 : 38,
    right: compact ? 6 : 12,
    bottom: compact ? 54 : 58,
    left: compact ? 42 : 60,
  };
  const plotW = Math.max(width - margin.left - margin.right, 10);
  const plotH = Math.max(height - margin.top - margin.bottom, 10);

  const peak = Math.max(
    ...steps.map((s) => s.value),
    ...(compare ? compare.steps.map((s) => s.value) : []),
    1,
  );
  const yMax = peak * 1.08;
  const y = (value: number) => margin.top + plotH - (value / yMax) * plotH;
  const baseline = margin.top + plotH;

  const colW = plotW / steps.length;
  const barW = Math.min(colW * 0.62, compact ? 44 : 84);
  const cx = (i: number) => margin.left + colW * i + colW / 2;

  const gridCount = compact ? 3 : 4;
  const step = niceStep(yMax / gridCount);
  const gridlines: number[] = [];
  for (let value = 0; value <= yMax; value += step) gridlines.push(value);

  const labelFont = compact ? 8.5 : 10;
  const valueFont = compact ? 9 : present ? 12 : 11;

  const description = `Savings waterfall in thousands of dollars per month. Incremental spend ${moneyK(result.reference)}, falling across ${steps.length - 1} placement and commitment steps to a final cost of ${moneyK(result.final)} — a ${percent(result.savingPct)} saving at a blended ${multiplier(result.blendedMultiplier)} of Standard PayGo.`;

  return (
    <div ref={ref} className="w-full">
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={description}
          style={{ display: "block", overflow: "visible" }}
          data-offers-waterfall="true"
        >
          <title>Cost waterfall</title>
          <desc>{description}</desc>

          {/* Gridlines */}
          <g aria-hidden="true">
            {gridlines.map((value) => (
              <g key={value}>
                <line
                  x1={margin.left}
                  x2={width - margin.right}
                  y1={y(value)}
                  y2={y(value)}
                  stroke="var(--line)"
                  strokeWidth={1}
                  opacity={value === 0 ? 1 : 0.55}
                />
                <text
                  x={margin.left - 8}
                  y={y(value) + 3}
                  textAnchor="end"
                  className="o-mono"
                  fontSize={labelFont}
                  fill="var(--ink-faint)"
                >
                  {value === 0 ? "0" : `${Math.round(value).toLocaleString("en-US")}`}
                </text>
              </g>
            ))}
            <text
              x={margin.left - 8}
              y={margin.top - 14}
              textAnchor="end"
              className="o-mono"
              fontSize={labelFont}
              fill="var(--ink-faint)"
            >
              $K/mo
            </text>
          </g>

          {/* Dashed connectors: each step starts from the previous level. */}
          <g aria-hidden="true">
            {steps.slice(0, -1).map((step, i) => (
              <line
                key={`connector-${step.id}`}
                x1={cx(i) + barW / 2}
                x2={cx(i + 1) - barW / 2}
                y1={y(step.value)}
                y2={y(step.value)}
                stroke="var(--ink-faint)"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.7}
              />
            ))}
          </g>

          {/* Pinned scenario A, ghost outline only. */}
          {compare ? (
            <g aria-hidden="true">
              {compare.steps.map((step, i) => (
                <rect
                  key={`compare-${step.id}`}
                  x={cx(i) - barW / 2 - 3}
                  y={y(step.value)}
                  width={barW + 6}
                  height={Math.max(baseline - y(step.value), 0)}
                  fill="none"
                  stroke="var(--ink-faint)"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                  className="o-bar"
                />
              ))}
            </g>
          ) : null}

          {/* Bars, saved-chunk ghosts, labels */}
          {steps.map((step, i) => (
            <StepColumn
              key={step.id}
              step={step}
              prev={i === 0 ? null : steps[i - 1]}
              x={cx(i)}
              barW={barW}
              baseline={baseline}
              y={y}
              compact={compact}
              valueFont={valueFont}
              labelFont={labelFont}
              colW={colW}
              // At phone width seven money labels collide into a smear, so only
              // the endpoints are labelled; the step cards below carry the rest.
              showValue={!compact || i === 0 || i === steps.length - 1}
            />
          ))}
        </svg>
      ) : (
        <div style={{ height }} />
      )}
    </div>
  );
}

function StepColumn({
  step,
  prev,
  x,
  barW,
  baseline,
  y,
  compact,
  valueFont,
  labelFont,
  colW,
  showValue,
}: {
  step: Step;
  prev: Step | null;
  x: number;
  barW: number;
  baseline: number;
  y: (value: number) => number;
  compact: boolean;
  valueFont: number;
  labelFont: number;
  colW: number;
  showValue: boolean;
}) {
  const colour = ACCENT_VAR[step.accent];
  const top = y(step.value);
  const barH = Math.max(baseline - top, 0);

  const increased = prev !== null && step.value > prev.value + 1e-9;
  const saved = prev !== null && step.value < prev.value - 1e-9;

  // The chunk this step removed (or added), drawn as a translucent ghost.
  const ghostTop = prev ? Math.min(y(prev.value), top) : top;
  const ghostH = prev ? Math.abs(y(prev.value) - top) : 0;
  const ghostColour = increased ? "var(--red)" : colour;

  // The value label sits just above the bar, which is also where a thin ghost
  // lives — keep the delta label clear of it or the two overprint.
  const valueLabelY = top - 8;
  const ghostLabelY = Math.min(
    ghostTop + ghostH / 2 + valueLabelFontOffset(valueFont),
    valueLabelY - (compact ? 12 : 16),
  );
  const showGhostLabel =
    ghostH > (compact ? 26 : 15) && ghostLabelY > ghostTop + 4;

  const label = compact ? (SHORT_LABEL[step.id] ?? step.label) : step.label;
  const words = compact ? [label] : label.split(" ");
  // Wrap desktop labels to at most two lines.
  const lines: string[] =
    words.length <= 2
      ? [words.join(" ")]
      : [words.slice(0, 2).join(" "), words.slice(2).join(" ")];

  return (
    <g>
      {/* Saved / added chunk */}
      {ghostH > 0.5 ? (
        <rect
          x={x - barW / 2}
          y={ghostTop}
          width={barW}
          height={ghostH}
          fill={ghostColour}
          opacity={0.28}
          className="o-bar"
        />
      ) : null}

      {/* Remaining cost */}
      <rect
        x={x - barW / 2}
        y={top}
        width={barW}
        height={barH}
        fill="var(--panel-2)"
        className="o-bar"
      />
      {/* Tier-coloured 2px top rule */}
      <rect
        x={x - barW / 2}
        y={top}
        width={barW}
        height={2}
        fill={colour}
        className="o-bar"
      />

      {/* Value label above the bar */}
      {showValue ? (
        <text
          x={x}
          y={valueLabelY}
          textAnchor="middle"
          className="o-mono"
          fontSize={valueFont}
          fill="var(--ink)"
        >
          {moneyK(step.value)}
        </text>
      ) : null}

      {/* −$xxxK on the ghost */}
      {showGhostLabel && (saved || increased) ? (
        <text
          x={x}
          y={ghostLabelY}
          textAnchor="middle"
          className="o-mono"
          fontSize={compact ? 8.5 : 10}
          fill={increased ? "var(--red)" : colour}
        >
          {increased ? "+" : "−"}
          {moneyK(Math.abs(step.delta))}
        </text>
      ) : null}

      {/* Column label */}
      <g>
        {lines.map((line, index) => (
          <text
            key={line + index}
            x={x}
            y={baseline + 16 + index * (labelFont + 3)}
            textAnchor="middle"
            fontSize={labelFont}
            fill="var(--ink-dim)"
          >
            {line}
          </text>
        ))}
        {step.index > 0 && colW > 52 ? (
          <text
            x={x}
            y={baseline + 16 + lines.length * (labelFont + 3) + 2}
            textAnchor="middle"
            className="o-mono"
            fontSize={labelFont - 0.5}
            fill="var(--ink-faint)"
          >
            {percent(step.cumulativeSavingPct, 0)}
          </text>
        ) : null}
      </g>
    </g>
  );
}
