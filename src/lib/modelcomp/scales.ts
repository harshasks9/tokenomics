/**
 * Chart geometry for MODELCOMP.
 *
 * Everything is computed in SVG user units against a fixed viewBox, so the two
 * charts share one x-scale and stay aligned however wide the container gets.
 */

import { FRONTIER_STEP, GEMINI_FLAGSHIP_STEP, type StepPoint } from "./data";

/** Days since the epoch — dates are plain ISO strings, parsed as UTC. */
export function day(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`) / 86_400_000;
}

export type Plot = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  x: (iso: string) => number;
  y: (value: number) => number;
  /** Inverse of x, for crosshair lookups. */
  xInvert: (px: number) => number;
  innerLeft: number;
  innerRight: number;
  innerTop: number;
  innerBottom: number;
};

export function makePlot(opts: {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  xDomain: [string, string];
  yDomain: [number, number];
}): Plot {
  const { width, height, left, right, top, bottom, xDomain, yDomain } = opts;
  const x0 = day(xDomain[0]);
  const x1 = day(xDomain[1]);
  const innerLeft = left;
  const innerRight = width - right;
  const innerTop = top;
  const innerBottom = height - bottom;
  const spanX = innerRight - innerLeft;
  const spanY = innerBottom - innerTop;

  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    innerLeft,
    innerRight,
    innerTop,
    innerBottom,
    x: (iso) => innerLeft + ((day(iso) - x0) / (x1 - x0)) * spanX,
    y: (value) =>
      innerBottom - ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * spanY,
    xInvert: (px) => x0 + ((px - innerLeft) / spanX) * (x1 - x0),
  };
}

/** First-of-month ticks across the domain, inclusive of the start month. */
export function monthTicks(xDomain: [string, string]): string[] {
  const ticks: string[] = [];
  const start = new Date(`${xDomain[0]}T00:00:00Z`);
  const end = day(xDomain[1]);
  const cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1),
  );
  while (day(isoOf(cursor)) <= end) {
    const iso = isoOf(cursor);
    if (day(iso) >= day(xDomain[0])) ticks.push(iso);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return ticks;
}

function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function monthLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return MONTHS[d.getUTCMonth()];
}

/** "Nov 18 '25" — compact enough for tick labels and tooltips alike. */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} '${String(d.getUTCFullYear()).slice(2)}`;
}

export function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** A stepAfter path: the value holds until the next breakpoint. */
export function stepPath(step: StepPoint[], plot: Plot): string {
  if (step.length === 0) return "";
  const parts: string[] = [`M ${plot.x(step[0][0])} ${plot.y(step[0][1])}`];
  for (let i = 1; i < step.length; i += 1) {
    const [iso, value] = step[i];
    parts.push(`L ${plot.x(iso)} ${plot.y(step[i - 1][1])}`);
    parts.push(`L ${plot.x(iso)} ${plot.y(value)}`);
  }
  return parts.join(" ");
}

/** Value of a stepAfter series at a given date; null before it starts. */
export function stepValueAt(step: StepPoint[], iso: string): number | null {
  const t = day(iso);
  let value: number | null = null;
  for (const [at, v] of step) {
    if (day(at) <= t) value = v;
    else break;
  }
  return value;
}

export type GapSegment = {
  from: string;
  to: string;
  frontier: number;
  gemini: number;
  /** "trail" when Gemini is below the frontier, "level" when they are equal. */
  state: "trail" | "lead" | "level";
};

/**
 * Merge the two step series onto a common breakpoint list and classify each
 * interval. Intervals where the two lines are equal produce no gap rectangle —
 * they are the co-lead windows, drawn as a highlight on the shared line.
 */
export function gapSegments(): GapSegment[] {
  const breaks = Array.from(
    new Set([
      ...FRONTIER_STEP.map(([d]) => d),
      ...GEMINI_FLAGSHIP_STEP.map(([d]) => d),
    ]),
  ).sort((a, b) => day(a) - day(b));

  const segments: GapSegment[] = [];
  for (let i = 0; i < breaks.length - 1; i += 1) {
    const from = breaks[i];
    const to = breaks[i + 1];
    const frontier = stepValueAt(FRONTIER_STEP, from);
    const gemini = stepValueAt(GEMINI_FLAGSHIP_STEP, from);
    // The frontier series starts a week after the Gemini one; nothing to
    // compare until both exist.
    if (frontier === null || gemini === null) continue;
    segments.push({
      from,
      to,
      frontier,
      gemini,
      state: gemini > frontier ? "lead" : gemini < frontier ? "trail" : "level",
    });
  }
  return segments;
}

export type MarkerShape =
  | "circle"
  | "square"
  | "diamond"
  | "triangle"
  | "hexagon"
  | "cross"
  | "wedge"
  | "pentagon";

/**
 * Marker outlines centred on the origin, so a marker is positioned purely by
 * its transform. `r` is the circumradius — shapes are area-matched by eye so
 * no lab reads as heavier than another.
 */
export function markerPath(shape: MarkerShape, r: number): string {
  switch (shape) {
    case "square": {
      const a = r * 0.86;
      return `M ${-a} ${-a} H ${a} V ${a} H ${-a} Z`;
    }
    case "diamond": {
      const a = r * 1.18;
      return `M 0 ${-a} L ${a} 0 L 0 ${a} L ${-a} 0 Z`;
    }
    case "triangle": {
      const a = r * 1.25;
      return `M 0 ${-a} L ${a * 0.87} ${a * 0.5} L ${-a * 0.87} ${a * 0.5} Z`;
    }
    case "hexagon":
      return polygon(6, r * 1.08, -Math.PI / 2);
    case "pentagon":
      return polygon(5, r * 1.14, -Math.PI / 2);
    case "wedge": {
      const a = r * 1.22;
      return `M 0 ${a} L ${a * 0.87} ${-a * 0.5} L ${-a * 0.87} ${-a * 0.5} Z`;
    }
    case "cross": {
      const a = r * 1.15;
      const t = r * 0.42;
      return [
        `M ${-t} ${-a}`,
        `H ${t} V ${-t} H ${a} V ${t} H ${t} V ${a}`,
        `H ${-t} V ${t} H ${-a} V ${-t} H ${-t} Z`,
      ].join(" ");
    }
    case "circle":
    default:
      return `M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z`;
  }
}

function polygon(sides: number, r: number, rotate: number): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i += 1) {
    const a = rotate + (i * 2 * Math.PI) / sides;
    pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}
