"use client";

import { useMemo, useRef, useState } from "react";
import {
  FRONTIER_STEP,
  GEMINI_FLAGSHIP_STEP,
  INFLECTIONS,
  LAB_COLORS,
  LAB_SHAPES,
  LABS,
  POINTS,
  X_DOMAIN,
  Y_DOMAIN_MAIN,
  type ReleasePoint,
} from "@/lib/modelcomp/data";
import {
  formatDate,
  gapSegments,
  makePlot,
  markerPath,
  monthLabel,
  monthTicks,
  stepPath,
  stepValueAt,
} from "@/lib/modelcomp/scales";
import ChartTooltip, { useChartTooltip, type TipDatum } from "./Tooltip";
import ExportMenu from "./ExportMenu";

const W = 1120;
const H = 540;
const PLOT = makePlot({
  width: W,
  height: H,
  left: 62,
  right: 236,
  top: 34,
  bottom: 46,
  xDomain: X_DOMAIN,
  yDomain: Y_DOMAIN_MAIN,
});

const Y_TICKS = [30, 35, 40, 45, 50, 55, 60, 65];
const X_TICKS = monthTicks(X_DOMAIN);
const SEGMENTS = gapSegments();

/** The band that reads "the frontier is here, Google is there". */
const BAND_HALF = 8;

const END_FRONTIER = FRONTIER_STEP[FRONTIER_STEP.length - 1][1];
const END_GEMINI = GEMINI_FLAGSHIP_STEP[GEMINI_FLAGSHIP_STEP.length - 1][1];

function toTip(p: ReleasePoint): TipDatum {
  const live = p.note ?? null;
  return {
    name: p.m,
    lab: p.lab,
    date: p.d,
    score: p.s,
    est: p.est === true,
    price: p.price ?? null,
    note: live,
  };
}

export default function MainChart({
  activeInflection,
  onHoverInflection,
}: {
  activeInflection: number | null;
  onHoverInflection: (n: number | null) => void;
}) {
  const [showInflections, setShowInflections] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { tip, show, hide } = useChartTooltip(frame);

  const visible = useMemo(
    () => POINTS.filter((p) => showAll || p.frontier || p.lab === "Google"),
    [showAll],
  );

  const activeLabs = useMemo(
    () => LABS.filter((lab) => visible.some((p) => p.lab === lab)),
    [visible],
  );

  const bracketTop = PLOT.y(END_FRONTIER);
  const bracketBottom = PLOT.y(END_GEMINI);
  const bracketX = 896;
  const gutterX = 912;

  return (
    <>
      <div className="mc-chart-head">
        <div>
          <p className="mc-eyebrow">S1 · The gap</p>
          <h2 className="mc-h2" style={{ marginTop: 6 }}>
            Twelve months of frontier, one Google flagship
          </h2>
        </div>
        <div className="mc-controls">
          <button
            type="button"
            className="mc-pill"
            aria-pressed={showInflections}
            onClick={() => setShowInflections((v) => !v)}
          >
            <span className="mc-pill-dot" aria-hidden="true" />
            Inflection points
          </button>
          <button
            type="button"
            className="mc-pill"
            aria-pressed={showAll}
            onClick={() => setShowAll((v) => !v)}
          >
            <span className="mc-pill-dot" aria-hidden="true" />
            All notable releases
          </button>
          <ExportMenu target={svgRef} basename="modelcomp-the-gap" />
        </div>
      </div>

      <div className="mc-chart-frame" ref={frame}>
        <div className="mc-chart-scroll">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-labelledby="mc-main-title mc-main-desc"
          >
            <title id="mc-main-title">
              Capability frontier versus the Google Gemini flagship, August 2025 to August 2026
            </title>
            <desc id="mc-main-desc">
              The capability frontier rises from 35 to 61 on the Artificial Analysis Intelligence
              Index while the Gemini flagship rises from 30 to 46 and then holds flat from February
              19, 2026. Google leads or shares the frontier only between November 18 and 24, 2025 and
              between February 19 and April 16, 2026. Full figures are in the release ledger below.
            </desc>

            {/* ── Grid ───────────────────────────────────────────────── */}
            <g aria-hidden="true">
              {Y_TICKS.map((value) => (
                <line
                  key={value}
                  className="mc-grid-line"
                  x1={PLOT.innerLeft}
                  x2={PLOT.innerRight}
                  y1={PLOT.y(value)}
                  y2={PLOT.y(value)}
                />
              ))}
            </g>

            {/* ── Gap band ───────────────────────────────────────────── */}
            <g aria-hidden="true">
              {SEGMENTS.map((seg) => {
                const x1 = PLOT.x(seg.from);
                const x2 = PLOT.x(seg.to);
                if (seg.state === "level") {
                  // The lines coincide — a rectangle between them would have no
                  // height, so the co-lead reads as a green band on the shared
                  // line instead.
                  const y = PLOT.y(seg.frontier);
                  return (
                    <rect
                      key={`${seg.from}-level`}
                      x={x1}
                      y={y - BAND_HALF}
                      width={Math.max(x2 - x1, 2)}
                      height={BAND_HALF * 2}
                      fill="var(--lead)"
                      opacity={0.18}
                    />
                  );
                }
                const yTop = PLOT.y(Math.max(seg.frontier, seg.gemini));
                const yBottom = PLOT.y(Math.min(seg.frontier, seg.gemini));
                return (
                  <rect
                    key={`${seg.from}-${seg.state}`}
                    x={x1}
                    y={yTop}
                    width={Math.max(x2 - x1, 1)}
                    height={yBottom - yTop}
                    fill={seg.state === "lead" ? "var(--lead)" : "var(--trail)"}
                    opacity={0.1}
                  />
                );
              })}
            </g>

            {/* ── Step lines ─────────────────────────────────────────── */}
            <path
              d={stepPath(GEMINI_FLAGSHIP_STEP, PLOT)}
              fill="none"
              stroke="var(--lab-google)"
              strokeWidth={2.25}
              strokeLinejoin="round"
              aria-hidden="true"
            />
            <path
              d={stepPath(FRONTIER_STEP, PLOT)}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={2}
              strokeLinejoin="round"
              aria-hidden="true"
            />

            {/* Green stroke where the two lines are one line. */}
            <g aria-hidden="true">
              {SEGMENTS.filter((s) => s.state === "level").map((seg) => (
                <line
                  key={`${seg.from}-shared`}
                  x1={PLOT.x(seg.from)}
                  x2={PLOT.x(seg.to)}
                  y1={PLOT.y(seg.frontier)}
                  y2={PLOT.y(seg.frontier)}
                  stroke="var(--lead)"
                  strokeWidth={3.25}
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* ── Captions ───────────────────────────────────────────── */}
            <g aria-hidden="true">
              {/* Sits under the wide co-lead window and clears the Feb 19
                  flagship ring, which the window's own midpoint would not. */}
              <text
                className="mc-caption"
                x={(PLOT.x("2026-03-01") + PLOT.x("2026-04-16")) / 2}
                y={PLOT.y(46) + 30}
                textAnchor="middle"
                fill="var(--lead)"
              >
                Google leads, then co-leads
              </text>
              <text
                className="mc-caption"
                x={(PLOT.x("2026-04-23") + PLOT.x("2026-08-06")) / 2}
                y={PLOT.y(51)}
                textAnchor="middle"
                fill="var(--trail)"
              >
                The gap widens
              </text>

              <text className="mc-series-label" x={104} y={PLOT.y(35) - 12} fill="var(--ink)">
                Capability frontier
              </text>
              <text
                className="mc-series-label"
                x={104}
                y={PLOT.y(30) + 20}
                fill="var(--lab-google)"
              >
                Gemini flagship
              </text>
            </g>

            {/* ── Release points ─────────────────────────────────────── */}
            <g>
              {visible.map((p) => {
                const cx = PLOT.x(p.d);
                const cy = PLOT.y(p.s);
                const color = LAB_COLORS[p.lab];
                const hollow = p.est === true;
                const datum = toTip(p);
                return (
                  <g
                    key={`${p.d}-${p.m}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`${p.m}, ${p.lab}, ${formatDate(p.d)}, index ${hollow ? "about " : ""}${p.s}`}
                    onPointerEnter={(e) => show(e, datum)}
                    onPointerDown={(e) => show(e, datum)}
                    onPointerLeave={hide}
                    onFocus={(e) => show(e, datum)}
                    onBlur={hide}
                    style={{ outlineOffset: 2 }}
                  >
                    {p.flagship ? (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={9.5}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.25}
                        opacity={0.85}
                      />
                    ) : null}
                    <path
                      className="mc-marker"
                      d={markerPath(LAB_SHAPES[p.lab], 5)}
                      transform={`translate(${cx} ${cy})`}
                      fill={hollow ? "var(--card)" : color}
                      stroke={hollow ? color : "var(--card)"}
                      strokeWidth={hollow ? 1.75 : 1.5}
                    />
                    <circle className="mc-hit" cx={cx} cy={cy} r={13} />
                  </g>
                );
              })}
            </g>

            {/* ── Right-edge bracket ─────────────────────────────────── */}
            <g aria-hidden="true">
              <line
                x1={PLOT.innerRight}
                x2={bracketX}
                y1={bracketTop}
                y2={bracketTop}
                stroke="var(--hairline)"
              />
              <line
                x1={PLOT.innerRight}
                x2={bracketX}
                y1={bracketBottom}
                y2={bracketBottom}
                stroke="var(--hairline)"
              />
              <path
                d={`M ${bracketX + 6} ${bracketTop} H ${bracketX} V ${bracketBottom} H ${bracketX + 6}`}
                fill="none"
                stroke="var(--trail)"
                strokeWidth={1.5}
              />
              <text
                className="mc-figure"
                x={gutterX}
                y={(bracketTop + bracketBottom) / 2 - 2}
                fill="var(--trail)"
                fontSize={21}
              >
                −15 pts
              </text>
              <text x={gutterX} y={(bracketTop + bracketBottom) / 2 + 16} fill="var(--muted)">
                and 24 weeks of silence
              </text>

              <text className="mc-end-label" x={gutterX} y={bracketTop + 4} fill="var(--ink)">
                61 · frontier (Opus 5)
              </text>
              <text
                className="mc-end-label"
                x={gutterX}
                y={bracketBottom + 4}
                fill="var(--lab-google)"
              >
                46 · Gemini 3.1 Pro
              </text>
            </g>

            {/* ── Inflection markers ─────────────────────────────────── */}
            {showInflections ? (
              <g>
                {INFLECTIONS.map((inf) => {
                  const step = inf.on === "frontier" ? FRONTIER_STEP : GEMINI_FLAGSHIP_STEP;
                  const value = stepValueAt(step, inf.d);
                  if (value === null) return null;
                  const ax = PLOT.x(inf.d);
                  const ay = PLOT.y(value);
                  const bx = ax + inf.dx;
                  const by = ay + inf.dy;
                  const active = activeInflection === inf.n;
                  return (
                    <g
                      key={inf.n}
                      tabIndex={0}
                      role="button"
                      aria-label={`Inflection ${inf.n}: ${inf.title}, ${inf.when}`}
                      onPointerEnter={() => onHoverInflection(inf.n)}
                      onPointerLeave={() => onHoverInflection(null)}
                      onFocus={() => onHoverInflection(inf.n)}
                      onBlur={() => onHoverInflection(null)}
                    >
                      {/* The leader and its anchor are drawn over the release
                          markers — several sit on the very same coordinate — so
                          they must never intercept a marker's own hover. */}
                      <line
                        x1={ax}
                        y1={ay}
                        x2={bx}
                        y2={by + (inf.dy < 0 ? 11 : -11)}
                        stroke="var(--prussian)"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        opacity={active ? 0.9 : 0.5}
                        style={{ pointerEvents: "none" }}
                      />
                      <circle
                        cx={ax}
                        cy={ay}
                        r={3}
                        fill="var(--prussian)"
                        style={{ pointerEvents: "none" }}
                      />
                      <circle
                        cx={bx}
                        cy={by}
                        r={active ? 12 : 10}
                        fill="var(--prussian)"
                        stroke="var(--card)"
                        strokeWidth={2}
                      />
                      <text
                        className="mc-inflection-badge"
                        x={bx}
                        y={by + 4}
                        textAnchor="middle"
                      >
                        {inf.n}
                      </text>
                    </g>
                  );
                })}
              </g>
            ) : null}

            {/* ── Axes ───────────────────────────────────────────────── */}
            <g aria-hidden="true">
              <line
                className="mc-axis-line"
                x1={PLOT.innerLeft}
                x2={PLOT.innerRight}
                y1={PLOT.innerBottom}
                y2={PLOT.innerBottom}
              />
              {X_TICKS.map((iso) => {
                const x = PLOT.x(iso);
                const month = monthLabel(iso);
                const year = iso.slice(0, 4);
                const showYear = month === "Aug" || month === "Jan";
                return (
                  <g key={iso}>
                    <line
                      className="mc-axis-line"
                      x1={x}
                      x2={x}
                      y1={PLOT.innerBottom}
                      y2={PLOT.innerBottom + 5}
                    />
                    <text className="mc-tick" x={x} y={PLOT.innerBottom + 18} textAnchor="middle">
                      {month}
                    </text>
                    {showYear ? (
                      <text
                        className="mc-tick"
                        x={x}
                        y={PLOT.innerBottom + 32}
                        textAnchor="middle"
                        opacity={0.72}
                      >
                        ’{year.slice(2)}
                      </text>
                    ) : null}
                  </g>
                );
              })}

              {Y_TICKS.map((value) => (
                <text
                  key={value}
                  className="mc-tick"
                  x={PLOT.innerLeft - 10}
                  y={PLOT.y(value) + 3.5}
                  textAnchor="end"
                >
                  {value}
                </text>
              ))}
              <text
                className="mc-axis-title"
                transform={`translate(17 ${(PLOT.innerTop + PLOT.innerBottom) / 2}) rotate(-90)`}
                textAnchor="middle"
              >
                Artificial Analysis Intelligence Index (v4.1 basis)
              </text>
            </g>
          </svg>
        </div>

        <p className="mc-scroll-hint">Scroll the chart sideways →</p>
        <ChartTooltip tip={tip} />
      </div>

      {/* ── Legend ─────────────────────────────────────────────────── */}
      <div className="mc-legend">
        <span className="mc-legend-item">
          <svg width="22" height="10" aria-hidden="true">
            <path d="M0 7 H10 V3 H22" fill="none" stroke="var(--ink)" strokeWidth={2} />
          </svg>
          Capability frontier (running max)
        </span>
        <span className="mc-legend-item">
          <svg width="22" height="10" aria-hidden="true">
            <path d="M0 7 H10 V3 H22" fill="none" stroke="var(--lab-google)" strokeWidth={2.25} />
          </svg>
          Gemini flagship
        </span>
        <span className="mc-legend-item">
          <span
            aria-hidden="true"
            style={{ width: 18, height: 10, background: "var(--trail)", opacity: 0.28 }}
          />
          Gemini trailing
        </span>
        <span className="mc-legend-item">
          <span
            aria-hidden="true"
            style={{ width: 18, height: 10, background: "var(--lead)", opacity: 0.35 }}
          />
          Gemini leading or level
        </span>
      </div>

      <div className="mc-legend" style={{ paddingTop: 2 }}>
        {activeLabs.map((lab) => (
          <span className="mc-legend-item" key={lab}>
            <svg width="14" height="14" aria-hidden="true">
              <path
                d={markerPath(LAB_SHAPES[lab], 5)}
                transform="translate(7 7)"
                fill={LAB_COLORS[lab]}
                stroke="var(--card)"
                strokeWidth={1.5}
              />
            </svg>
            {lab}
          </span>
        ))}
      </div>

      <p className="mc-legend-note">
        Solid = published v4.1 score · hollow = v4.1-equivalent estimate. A ring marks a Google
        Pro-line flagship. Each lab also carries its own marker shape, so identity never rests on
        colour alone.
      </p>
    </>
  );
}
