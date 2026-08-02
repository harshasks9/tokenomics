"use client";

import { useRef } from "react";
import {
  FLASH,
  FLASH_CHIPS,
  FLASH_LITE,
  GEMINI_FLAGSHIP_STEP,
  LAB_COLORS,
  LAB_SHAPES,
  LABELLED_RIVALS,
  RIVAL_VALUE_TIER,
  X_DOMAIN,
  Y_DOMAIN_FLASH,
  type StepPoint,
} from "@/lib/modelcomp/data";
import {
  formatDate,
  makePlot,
  markerPath,
  monthLabel,
  monthTicks,
  stepPath,
} from "@/lib/modelcomp/scales";
import ChartTooltip, { useChartTooltip, type TipDatum } from "./Tooltip";
import ExportMenu from "./ExportMenu";

const W = 1120;
const H = 420;

/**
 * Identical left/right insets to the main chart, so the two x-axes line up
 * column for column when the sections are read one under the other.
 */
const PLOT = makePlot({
  width: W,
  height: H,
  left: 62,
  right: 236,
  top: 34,
  bottom: 46,
  xDomain: X_DOMAIN,
  yDomain: Y_DOMAIN_FLASH,
});

const Y_TICKS = [25, 30, 35, 40, 45, 50, 55, 60];
const X_TICKS = monthTicks(X_DOMAIN);

/** Flash releases as a stepAfter series, held flat to the right edge. */
const FLASH_STEP: StepPoint[] = [
  ...FLASH.filter((f) => f.s !== null).map((f) => [f.d, f.s as number] as StepPoint),
  ["2026-08-06", FLASH[FLASH.length - 1].s as number],
];

type Placement = { dx: number; dy: number; anchor: "start" | "end" | "middle" };

/**
 * Label placement is hand-set, not derived.
 *
 * Eight of the eleven marks land in the final six weeks at scores 50–57, so
 * every offset formula collides somewhere. These give each label its own lane:
 * Kimi highest, then Grok, then Sonnet, with the two Google marks at 50 taking
 * the row below and the far-right gutter.
 */
const RIVAL_LABELS: Record<string, Placement> = {
  "Kimi K3": { dx: 0, dy: -14, anchor: "middle" },
  "Grok 4.5": { dx: -11, dy: -13, anchor: "end" },
  "Claude Sonnet 5": { dx: -11, dy: -6, anchor: "end" },
  "DeepSeek V4 Flash": { dx: 36, dy: 37, anchor: "start" },
};

/** Flash release name + price placement, keyed by release date. */
const FLASH_LABELS: Record<string, { name: Placement; price: Placement }> = {
  // Above the dot; the dashed flagship reference sits well below at 30.
  "2025-09-25": {
    name: { dx: 0, dy: -15, anchor: "middle" },
    price: { dx: 0, dy: 20, anchor: "middle" },
  },
  // Below and to the right: the flagship reference runs through this dot's
  // usual label slot at 40, and its own riser runs through the slot below.
  "2025-12-17": {
    name: { dx: 12, dy: 18, anchor: "start" },
    price: { dx: 12, dy: 32, anchor: "start" },
  },
  // Price pulled left so it clears the "Flash > flagship" caption inside the
  // band it would otherwise sit in the middle of.
  "2026-05-19": {
    name: { dx: 0, dy: -15, anchor: "middle" },
    price: { dx: -10, dy: 20, anchor: "end" },
  },
  // No launch price published; name lifted clear of the value-tier cluster.
  "2026-07-21": {
    name: { dx: 0, dy: -19, anchor: "middle" },
    price: { dx: 0, dy: 20, anchor: "middle" },
  },
};

export default function FlashChart() {
  const frame = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { tip, show, hide } = useChartTooltip(frame);

  const overtakeX = PLOT.x("2026-05-19");
  const rightX = PLOT.x("2026-08-06");
  const flashY = PLOT.y(50);
  const flagshipY = PLOT.y(46);

  const tipFor = (
    name: string,
    date: string,
    score: number | null,
    est: boolean,
    price: string | null,
    note: string | null,
  ): TipDatum => ({ name, lab: "Google", date, score, est, price, note });

  return (
    <>
      <div className="mc-chart-head">
        <div>
          <p className="mc-eyebrow">S3 · The other lane</p>
          <h2 className="mc-h2" style={{ marginTop: 6, maxWidth: "22ch" }}>
            Flash kept shipping — and overtook Google&rsquo;s own flagship.
          </h2>
        </div>
        <div className="mc-controls">
          <ExportMenu target={svgRef} basename="modelcomp-the-other-lane" />
        </div>
      </div>

      <div className="mc-chart-frame" ref={frame}>
        <div className="mc-chart-scroll">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-labelledby="mc-flash-title mc-flash-desc"
          >
            <title id="mc-flash-title">
              Gemini Flash releases against the Gemini flagship and the rival value tier
            </title>
            <desc id="mc-flash-desc">
              Four scored Flash releases lift the Flash line from 27 to 50 while the Pro-line
              flagship holds at 46 from February 2026, so Flash overtakes the flagship by 4 points
              from May 19, 2026. Rival value-tier models score between 51 and 57 over the same
              period. Full figures are in the release ledger below.
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

            {/* ── Flash > flagship band ──────────────────────────────── */}
            <g aria-hidden="true">
              <rect
                x={overtakeX}
                y={flashY}
                width={rightX - overtakeX}
                height={flagshipY - flashY}
                fill="var(--lab-google)"
                opacity={0.14}
              />
              {/* Right-aligned in the band so the 3.5 Flash launch price can
                  sit at the band's left edge without overlapping it. */}
              <text
                className="mc-caption"
                x={rightX - 9}
                y={(flashY + flagshipY) / 2 + 4}
                textAnchor="end"
                fill="var(--lab-google)"
              >
                Flash &gt; flagship (+4)
              </text>
            </g>

            {/* ── Rival value-tier bracket ───────────────────────────── */}
            <g aria-hidden="true">
              <path
                d={`M ${PLOT.innerRight + 20} ${PLOT.y(57)} H ${PLOT.innerRight + 14} V ${PLOT.y(51)} H ${PLOT.innerRight + 20}`}
                fill="none"
                stroke="var(--muted)"
                strokeWidth={1}
                opacity={0.7}
              />
              <text className="mc-caption" x={PLOT.innerRight + 28} y={PLOT.y(57) - 8} fill="var(--muted)">
                Rival value tier
              </text>
              <text x={PLOT.innerRight + 28} y={PLOT.y(57) + 8} fill="var(--muted)">
                51–57 on the v4.1 index —
              </text>
              <text x={PLOT.innerRight + 28} y={PLOT.y(57) + 23} fill="var(--muted)">
                all of it above Flash&rsquo;s 50.
              </text>
            </g>

            {/* ── Flagship reference (dashed) ────────────────────────── */}
            <path
              d={stepPath(GEMINI_FLAGSHIP_STEP, PLOT)}
              fill="none"
              stroke="var(--lab-google)"
              strokeWidth={1.75}
              strokeDasharray="7 5"
              strokeLinejoin="round"
              opacity={0.85}
              aria-hidden="true"
            />
            {/* Parked under the flat 46 segment, right of the Feb 19 riser —
                the only stretch of this chart with nothing plotted in it. */}
            <text
              className="mc-series-label"
              x={PLOT.x("2026-03-01")}
              y={PLOT.y(46) + 17}
              fill="var(--lab-google)"
              opacity={0.85}
              aria-hidden="true"
            >
              Gemini flagship (Pro line) · dashed
            </text>

            {/* ── Flash line ─────────────────────────────────────────── */}
            <path
              d={stepPath(FLASH_STEP, PLOT)}
              fill="none"
              stroke="var(--lab-google)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              aria-hidden="true"
            />

            {/* ── Flash releases ─────────────────────────────────────── */}
            <g>
              {FLASH.map((f) => {
                if (f.s === null) return null;
                const cx = PLOT.x(f.d);
                const cy = PLOT.y(f.s);
                const hollow = f.est === true;
                const place = FLASH_LABELS[f.d];
                return (
                  <g
                    key={f.d}
                    tabIndex={0}
                    role="button"
                    aria-label={`${f.m}, ${formatDate(f.d)}, index ${hollow ? "about " : ""}${f.s}`}
                    onPointerEnter={(e) =>
                      show(e, tipFor(f.m, f.d, f.s, hollow, f.price ?? null, f.note ?? null))
                    }
                    onPointerDown={(e) =>
                      show(e, tipFor(f.m, f.d, f.s, hollow, f.price ?? null, f.note ?? null))
                    }
                    onPointerLeave={hide}
                    onFocus={(e) =>
                      show(e, tipFor(f.m, f.d, f.s, hollow, f.price ?? null, f.note ?? null))
                    }
                    onBlur={hide}
                  >
                    <text
                      className="mc-point-label"
                      x={cx + place.name.dx}
                      y={cy + place.name.dy}
                      textAnchor={place.name.anchor}
                      fill="var(--ink)"
                    >
                      {f.m}
                    </text>
                    <path
                      d={markerPath("circle", 5.5)}
                      transform={`translate(${cx} ${cy})`}
                      fill={hollow ? "var(--card)" : "var(--lab-google)"}
                      stroke={hollow ? "var(--lab-google)" : "var(--card)"}
                      strokeWidth={hollow ? 1.75 : 1.5}
                    />
                    {f.price ? (
                      <text
                        className="mc-price-label"
                        x={cx + place.price.dx}
                        y={cy + place.price.dy}
                        textAnchor={place.price.anchor}
                        fill="var(--muted)"
                      >
                        {f.price}
                      </text>
                    ) : null}
                    <circle className="mc-hit" cx={cx} cy={cy} r={14} />
                  </g>
                );
              })}
            </g>

            {/* ── Flash-Lite ─────────────────────────────────────────── */}
            <g>
              {FLASH_LITE.map((f) => {
                const cx = PLOT.x(f.d);
                const scored = f.s !== null;
                const cy = scored ? PLOT.y(f.s as number) : PLOT.innerBottom;
                return (
                  <g
                    key={f.d + f.m}
                    tabIndex={0}
                    role="button"
                    aria-label={`${f.m}, ${formatDate(f.d)}, ${scored ? `index ${f.s}` : "no published index score"}`}
                    onPointerEnter={(e) =>
                      show(e, tipFor(f.m, f.d, f.s, f.est === true, f.price ?? null, f.note ?? null))
                    }
                    onPointerDown={(e) =>
                      show(e, tipFor(f.m, f.d, f.s, f.est === true, f.price ?? null, f.note ?? null))
                    }
                    onPointerLeave={hide}
                    onFocus={(e) =>
                      show(e, tipFor(f.m, f.d, f.s, f.est === true, f.price ?? null, f.note ?? null))
                    }
                    onBlur={hide}
                  >
                    {scored ? (
                      <>
                        <path
                          d={markerPath("circle", 4.5)}
                          transform={`translate(${cx} ${cy})`}
                          fill="var(--card)"
                          stroke="var(--lab-google)"
                          strokeWidth={1.5}
                          strokeDasharray="2.6 2.2"
                        />
                        <text className="mc-point-label" x={cx + 10} y={cy + 4} fill="var(--muted)">
                          3.5 Flash-Lite
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Shipped without a score — parked on the bottom rail
                            so it is present without implying a value. */}
                        <line
                          x1={cx}
                          x2={cx}
                          y1={cy - 7}
                          y2={cy + 7}
                          stroke="var(--lab-google)"
                          strokeWidth={1.5}
                          strokeDasharray="2.6 2.2"
                        />
                        <text
                          className="mc-price-label"
                          x={cx + 8}
                          y={cy - 2}
                          fill="var(--muted)"
                        >
                          3.1 Flash-Lite · no published score
                        </text>
                      </>
                    )}
                    <circle className="mc-hit" cx={cx} cy={cy} r={13} />
                  </g>
                );
              })}
            </g>

            {/* ── Rival value tier ───────────────────────────────────── */}
            <g>
              {RIVAL_VALUE_TIER.map((r) => {
                const cx = PLOT.x(r.d);
                const cy = PLOT.y(r.s);
                const color = LAB_COLORS[r.lab];
                const hollow = r.est === true;
                const label = LABELLED_RIVALS.has(r.m) ? RIVAL_LABELS[r.m] : null;
                return (
                  <g
                    key={`${r.d}-${r.m}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`${r.m}, ${r.lab}, ${formatDate(r.d)}, index ${hollow ? "about " : ""}${r.s}`}
                    onPointerEnter={(e) =>
                      show(e, {
                        name: r.m,
                        lab: r.lab,
                        date: r.d,
                        score: r.s,
                        est: hollow,
                        price: r.price ?? null,
                        note: r.note ?? null,
                      })
                    }
                    onPointerDown={(e) =>
                      show(e, {
                        name: r.m,
                        lab: r.lab,
                        date: r.d,
                        score: r.s,
                        est: hollow,
                        price: r.price ?? null,
                        note: r.note ?? null,
                      })
                    }
                    onPointerLeave={hide}
                    onFocus={(e) =>
                      show(e, {
                        name: r.m,
                        lab: r.lab,
                        date: r.d,
                        score: r.s,
                        est: hollow,
                        price: r.price ?? null,
                        note: r.note ?? null,
                      })
                    }
                    onBlur={hide}
                  >
                    <path
                      d={markerPath(LAB_SHAPES[r.lab], 4.5)}
                      transform={`translate(${cx} ${cy})`}
                      fill={hollow ? "var(--card)" : color}
                      stroke={hollow ? color : "var(--card)"}
                      strokeWidth={1.5}
                    />
                    {label ? (
                      <>
                        {Math.abs(label.dx) > 20 || Math.abs(label.dy) > 20 ? (
                          <line
                            x1={cx + 5}
                            y1={cy + 4}
                            x2={cx + label.dx - 4}
                            y2={cy + label.dy - 3}
                            stroke="var(--muted)"
                            strokeWidth={0.75}
                            opacity={0.55}
                          />
                        ) : null}
                        <text
                          className="mc-point-label"
                          x={cx + label.dx}
                          y={cy + label.dy}
                          textAnchor={label.anchor}
                          fill="var(--ink)"
                        >
                          {r.m}
                        </text>
                      </>
                    ) : null}
                    <circle className="mc-hit" cx={cx} cy={cy} r={11} />
                  </g>
                );
              })}
            </g>

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
                        ’{iso.slice(2, 4)}
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
                Intelligence Index (v4.1 basis)
              </text>
            </g>
          </svg>
        </div>

        <p className="mc-scroll-hint">Scroll the chart sideways →</p>
        <ChartTooltip tip={tip} />
      </div>

      <div className="mc-legend">
        <span className="mc-legend-item">
          <svg width="22" height="10" aria-hidden="true">
            <path d="M0 5 H22" fill="none" stroke="var(--lab-google)" strokeWidth={2.5} />
          </svg>
          Gemini Flash
        </span>
        <span className="mc-legend-item">
          <svg width="22" height="10" aria-hidden="true">
            <path
              d="M0 5 H22"
              fill="none"
              stroke="var(--lab-google)"
              strokeWidth={1.75}
              strokeDasharray="7 5"
            />
          </svg>
          Gemini flagship (Pro line)
        </span>
        <span className="mc-legend-item">
          <svg width="14" height="14" aria-hidden="true">
            <circle
              cx="7"
              cy="7"
              r="4.5"
              fill="var(--card)"
              stroke="var(--lab-google)"
              strokeWidth={1.5}
              strokeDasharray="2.6 2.2"
            />
          </svg>
          Flash-Lite tier
        </span>
        {(["Anthropic", "OpenAI", "xAI", "Moonshot", "DeepSeek", "Z.ai", "Meta"] as const).map(
          (lab) => (
            <span className="mc-legend-item" key={lab}>
              <svg width="14" height="14" aria-hidden="true">
                <path
                  d={markerPath(LAB_SHAPES[lab], 4.5)}
                  transform="translate(7 7)"
                  fill={LAB_COLORS[lab]}
                  stroke="var(--card)"
                  strokeWidth={1.5}
                />
              </svg>
              {lab}
            </span>
          ),
        )}
      </div>

      <div className="mc-chiprow" style={{ marginTop: 24 }}>
        {FLASH_CHIPS.map((chip) => (
          <div className="mc-chipcard" key={chip.figure}>
            <p className="mc-chipcard-figure">{chip.figure}</p>
            <p className="mc-chipcard-text">{chip.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
