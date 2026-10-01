"use client";

import { useMemo } from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { METRICS } from "@/lib/earbuds/metrics";
import { betterCorner, frontierCurve, type PlotPoint } from "@/lib/earbuds/explore";
import { PRODUCT_BY_ID } from "@/lib/earbuds/products";
import type { MetricId } from "@/lib/earbuds/types";

interface Props {
  x: MetricId;
  y: MetricId;
  points: PlotPoint[];
  frontier: PlotPoint[];
  pinned: string[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const ACCENT = "#2350e6";
const DOMINATED = "#8c857a";
const SURFACE = "#fffdf9";
const INK = "#1c1b19";

function niceStep(range: number, count: number) {
  const raw = range / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return step * mag;
}

function niceDomain(values: number[], pad: number): { domain: [number, number]; ticks: number[] } {
  if (!values.length) return { domain: [0, 1], ticks: [0, 1] };
  let lo = Math.min(...values) - pad;
  let hi = Math.max(...values) + pad;
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const step = niceStep(hi - lo, 5);
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  if (lo < 0 && Math.min(...values) >= 0) lo = 0;
  const ticks: number[] = [];
  for (let t = lo; t <= hi + step / 1e6; t += step) ticks.push(Number(t.toFixed(6)));
  return { domain: [lo, hi], ticks };
}

const ARROW: Record<string, string> = { "left-top": "↖", "right-top": "↗", "left-bottom": "↙", "right-bottom": "↘" };

interface ShapeProps {
  cx?: number;
  cy?: number;
  payload?: PlotPoint;
}

export default function ParetoChart({ x, y, points, frontier, pinned, activeId, onSelect }: Props) {
  const mx = METRICS[x];
  const my = METRICS[y];
  const xs = useMemo(() => niceDomain(points.map((p) => p.x), mx.domainPad), [points, mx.domainPad]);
  const ys = useMemo(() => niceDomain(points.map((p) => p.y), my.domainPad), [points, my.domainPad]);
  const corner = betterCorner(x, y);
  const dominated = points.filter((p) => !p.onFrontier);
  const pinnedSet = new Set(pinned);

  const summary = `Scatterplot of ${points.length} earbuds: ${mx.label} (${mx.direction} is better) against ${my.label} (${my.direction} is better). On the frontier: ${
    frontier.map((p) => p.product.short).join(", ") || "none"
  }. Use the product list below for the same data as a table.`;

  const renderPoint = (props: ShapeProps) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || !payload) return <g />;
    const isPinned = pinnedSet.has(payload.id);
    const isActive = activeId === payload.id;
    const showLabel = payload.onFrontier || isPinned || isActive;
    const nearRight = (payload.x - xs.domain[0]) / (xs.domain[1] - xs.domain[0]) > 0.62;
    const r = payload.onFrontier ? 6.5 : 5.5;
    return (
      <g
        className="eb-point"
        onClick={() => onSelect(payload.id)}
        role="presentation"
      >
        {/* Generous invisible hit area (≥24px) around a small mark. */}
        <circle cx={cx} cy={cy} r={14} fill="transparent" />
        {isPinned || isActive ? (
          <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke={isActive ? INK : ACCENT} strokeWidth={1.5} strokeDasharray={isActive && !isPinned ? "3 2" : undefined} />
        ) : null}
        {payload.onFrontier ? (
          <circle className="eb-point-dot" cx={cx} cy={cy} r={r} fill={ACCENT} stroke={SURFACE} strokeWidth={2} />
        ) : (
          <circle className="eb-point-dot" cx={cx} cy={cy} r={r} fill={SURFACE} stroke={DOMINATED} strokeWidth={2} />
        )}
        {showLabel ? (
          <text
            className="eb-point-label"
            data-emph={isPinned || isActive ? "true" : undefined}
            x={nearRight ? cx - 12 : cx + 12}
            y={cy - 9}
            textAnchor={nearRight ? "end" : "start"}
            fontSize={12}
            fontWeight={payload.onFrontier ? 600 : 500}
            fill={payload.onFrontier ? INK : "#45413b"}
            paintOrder="stroke"
            stroke={SURFACE}
            strokeWidth={4}
            strokeLinejoin="round"
          >
            {payload.product.short}
          </text>
        ) : null}
      </g>
    );
  };

  return (
    <figure className="relative m-0">
      <figcaption className="sr-only">{summary}</figcaption>
      <p className="mb-1 pl-1 text-[12px] font-medium text-[var(--eb-muted)]">
        ↑ {my.axis} · <span className="text-[var(--eb-ink-2)]">{my.direction === "higher" ? "higher is better" : "lower is better"}</span>
      </p>
      <div className="eb-chart relative h-[360px] w-full sm:h-[440px]" role="img" aria-label={summary}>
        <span
          className={`pointer-events-none absolute z-10 rounded-full bg-[var(--eb-accent-wash)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--eb-accent-ink)] ${
            corner.vertical === "top" ? "top-2" : "bottom-12"
          } ${corner.horizontal === "left" ? "left-16" : "right-4"}`}
          aria-hidden
        >
          {ARROW[`${corner.horizontal}-${corner.vertical}`]} Better
        </span>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 28, bottom: 8, left: 4 }}>
            <CartesianGrid strokeWidth={1} />
            <XAxis
              type="number"
              dataKey="x"
              domain={xs.domain}
              ticks={xs.ticks}
              tickFormatter={(v: number) => mx.format(v)}
              tickLine={false}
              axisLine={{ stroke: "#cfc7b9" }}
              allowDataOverflow
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={ys.domain}
              ticks={ys.ticks}
              tickFormatter={(v: number) => my.format(v)}
              tickLine={false}
              axisLine={{ stroke: "#cfc7b9" }}
              width={56}
              allowDataOverflow
            />
            <Tooltip
              cursor={false}
              isAnimationActive={false}
              content={({ active, payload }) => {
                const p = active && payload && payload.length ? (payload[0].payload as PlotPoint) : null;
                if (!p || !p.product) return null;
                return <PointTooltip point={p} x={x} y={y} />;
              }}
            />
            {frontier.length > 1 ? (
              <Scatter
                data={frontier}
                line={{ stroke: ACCENT, strokeWidth: 2, strokeOpacity: 0.55 }}
                lineType="joint"
                lineJointType={frontierCurve(x)}
                shape={() => <g />}
                legendType="none"
                isAnimationActive={false}
                tooltipType="none"
              />
            ) : null}
            <Scatter data={dominated} shape={renderPoint} isAnimationActive animationDuration={350} />
            <Scatter data={frontier} shape={renderPoint} isAnimationActive animationDuration={350} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 pr-2 text-right text-[12px] font-medium text-[var(--eb-muted)]">
        {mx.axis} · <span className="text-[var(--eb-ink-2)]">{mx.direction === "higher" ? "higher is better" : "lower is better"}</span> →
      </p>
    </figure>
  );
}

function PointTooltip({ point, x, y }: { point: PlotPoint; x: MetricId; y: MetricId }) {
  const p = point.product;
  return (
    <div className="max-w-[260px] rounded-xl border border-[var(--eb-rule)] bg-[var(--eb-card)] px-3.5 py-3 text-[13px] shadow-lg">
      <p className="font-semibold leading-tight text-[var(--eb-ink)]">
        {p.brand} {p.name}
      </p>
      <dl className="eb-tabular mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-[var(--eb-muted)]">{METRICS[x].label}</dt>
        <dd className="text-right font-medium">{METRICS[x].format(point.x)}</dd>
        <dt className="text-[var(--eb-muted)]">{METRICS[y].label}</dt>
        <dd className="text-right font-medium">{METRICS[y].format(point.y)}</dd>
      </dl>
      <p className="mt-2 border-t border-[var(--eb-rule)] pt-2 text-[12px] leading-snug text-[var(--eb-ink-2)]">
        {point.onFrontier ? (
          <span className="font-semibold text-[var(--eb-accent-ink)]">● On the frontier for these two metrics</span>
        ) : (
          <>
            <span className="font-semibold">○ Dominated</span> — {point.dominatedBy.map((id) => PRODUCT_BY_ID[id]?.short).join(", ")}{" "}
            {point.dominatedBy.length === 1 ? "is" : "are"} at least as good on both and better on one.
          </>
        )}
      </p>
      <p className="mt-1.5 text-[11px] text-[var(--eb-muted)]">Click or tap for details</p>
    </div>
  );
}
