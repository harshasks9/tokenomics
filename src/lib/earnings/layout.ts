/**
 * Geometry for the EARNINGS visuals.
 *
 * Everything is computed in SVG user units against a fixed viewBox, so the
 * charts scale by CSS without re-running any layout maths in the browser.
 */

import {
  MAP_NODES,
  SANKEY_LINKS,
  SANKEY_NODES,
  type MapNode,
  type SankeyNode,
} from "./data";

/* ── Radial mind map ─────────────────────────────────────────────────────── */

export type Placed = { node: MapNode; x: number; y: number; r: number };

export const MAP_W = 840;
export const MAP_H = 776;
export const MAP_CX = MAP_W / 2;
export const MAP_CY = MAP_H / 2;

/**
 * Hub bearings, degrees clockwise from 3 o'clock (SVG y grows downward).
 *
 * True diagonals, so adjacent branches sit a full 90° apart. At FAN = 36 that
 * leaves an 18° gutter between neighbouring fans — enough that no two leaves
 * from different branches can collide.
 */
const HUB_ANGLE: Record<string, number> = {
  models: 225, // upper left
  hyperscalers: 315, // upper right
  platforms: 135, // lower left
  control: 45, // lower right
};

const HUB_R = 158;
const LEAF_R = 294;
/** Half-width of the fan of leaves around each hub's outward direction. */
const FAN = 36;
/** Vertical squash — the map is wider than it is tall. */
const SQUASH = 0.92;

function polar(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: MAP_CX + Math.cos(rad) * r, y: MAP_CY + Math.sin(rad) * r * SQUASH };
}

/**
 * Place hubs on a ring around the centre and fan each hub's leaves outward
 * along the same bearing, so a branch reads as one wedge.
 */
export function placeMap(): Placed[] {
  const out: Placed[] = [];
  const hubs = MAP_NODES.filter((n) => n.kind === "hub");

  for (const hub of hubs) {
    const angle = HUB_ANGLE[hub.id];
    const p = polar(angle, HUB_R);
    out.push({ node: hub, x: p.x, y: p.y, r: 60 });

    const leaves = MAP_NODES.filter((n) => n.hub === hub.id);
    const step = leaves.length > 1 ? (FAN * 2) / (leaves.length - 1) : 0;
    leaves.forEach((leaf, i) => {
      const a = leaves.length === 1 ? angle : angle - FAN + step * i;
      const q = polar(a, LEAF_R);
      out.push({ node: leaf, x: q.x, y: q.y, r: 37 });
    });
  }

  return out;
}

/**
 * Quadratic curve between two points, bowed perpendicular by `bend`.
 *
 * `t` selects where along the curve the label sits — these four edges all cross
 * the same crowded upper band, so each one needs its own slot rather than the
 * midpoint every time.
 */
export function arc(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend: number,
  t = 0.5,
): { d: string; mx: number; my: number } {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Perpendicular offset scaled by the chord length.
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const u = 1 - t;
  return {
    d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`,
    // Point on the quadratic Bézier at t.
    mx: u * u * x1 + 2 * u * t * cx + t * t * x2,
    my: u * u * y1 + 2 * u * t * cy + t * t * y2,
  };
}

/** Shorten a segment at both ends so it starts and stops outside the nodes. */
export function trim(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x1: x1 + (dx / len) * r1,
    y1: y1 + (dy / len) * r1,
    x2: x2 - (dx / len) * r2,
    y2: y2 - (dy / len) * r2,
  };
}

/* ── Log scale ───────────────────────────────────────────────────────────── */

export function logScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const l0 = Math.log10(d0);
  const l1 = Math.log10(d1);
  return (v: number) => r0 + ((Math.log10(v) - l0) / (l1 - l0)) * (r1 - r0);
}

/** Decade + half-decade ticks inside a log domain. */
export function logTicks(domain: [number, number]): number[] {
  const out: number[] = [];
  for (const base of [1, 2, 5]) {
    for (let e = 0; e <= 3; e += 1) {
      const v = base * 10 ** e;
      if (v >= domain[0] && v <= domain[1]) out.push(v);
    }
  }
  return out.sort((a, b) => a - b);
}

/* ── Squarified treemap ──────────────────────────────────────────────────── */

export type Rect = { x: number; y: number; w: number; h: number };
export type TreemapCell<T> = Rect & { item: T };

/**
 * Squarified treemap (Bruls, Huizing & van Wijk). Keeps tiles close to square
 * so the area comparison stays readable and labels fit inside.
 */
export function treemap<T>(
  items: T[],
  weight: (t: T) => number,
  bounds: Rect,
): TreemapCell<T>[] {
  const total = items.reduce((s, t) => s + weight(t), 0);
  if (total <= 0) return [];

  const area = bounds.w * bounds.h;
  const scaled = items
    .map((item) => ({ item, a: (weight(item) / total) * area }))
    .sort((a, b) => b.a - a.a);

  const out: TreemapCell<T>[] = [];
  let free: Rect = { ...bounds };
  let row: typeof scaled = [];

  const shortSide = (r: Rect) => Math.min(r.w, r.h);

  /** Worst aspect ratio in `candidate` laid along the short side of `r`. */
  const worst = (candidate: typeof scaled, r: Rect) => {
    const side = shortSide(r);
    const sum = candidate.reduce((s, c) => s + c.a, 0);
    if (sum <= 0) return Infinity;
    const max = Math.max(...candidate.map((c) => c.a));
    const min = Math.min(...candidate.map((c) => c.a));
    const s2 = sum * sum;
    const side2 = side * side;
    return Math.max((side2 * max) / s2, s2 / (side2 * min));
  };

  const flushRow = () => {
    if (row.length === 0) return;
    const sum = row.reduce((s, c) => s + c.a, 0);
    const horizontal = free.w >= free.h;
    const thickness = sum / (horizontal ? free.h : free.w);
    let offset = 0;
    for (const c of row) {
      const extent = c.a / thickness;
      out.push(
        horizontal
          ? { x: free.x, y: free.y + offset, w: thickness, h: extent, item: c.item }
          : { x: free.x + offset, y: free.y, w: extent, h: thickness, item: c.item },
      );
      offset += extent;
    }
    free = horizontal
      ? { x: free.x + thickness, y: free.y, w: free.w - thickness, h: free.h }
      : { x: free.x, y: free.y + thickness, w: free.w, h: free.h - thickness };
    row = [];
  };

  for (const cell of scaled) {
    const next = [...row, cell];
    if (row.length > 0 && worst(next, free) > worst(row, free)) {
      flushRow();
      row = [cell];
    } else {
      row = next;
    }
  }
  flushRow();

  return out;
}

/* ── Sankey ──────────────────────────────────────────────────────────────── */

export type SankeyBox = SankeyNode & { x: number; y: number; w: number; h: number };
export type SankeyRibbon = {
  from: string;
  to: string;
  value: number;
  note: string;
  d: string;
  /** Colour is inherited from the target model column. */
  target: string;
};

export const SANKEY_W = 1040;
export const SANKEY_H = 560;

const COL_X = [40, 430, 830];
const COL_W = [170, 190, 170];
const PAD = 14;
const TOP = 26;

/**
 * Three-column Sankey. Node heights are proportional to the larger of their
 * inbound and outbound totals, and ribbons stack in declaration order on both
 * ends so crossings stay minimal without a full sweep-and-swap pass.
 */
export function sankey(): { boxes: SankeyBox[]; ribbons: SankeyRibbon[] } {
  const inbound = new Map<string, number>();
  const outbound = new Map<string, number>();
  for (const l of SANKEY_LINKS) {
    outbound.set(l.from, (outbound.get(l.from) ?? 0) + l.value);
    inbound.set(l.to, (inbound.get(l.to) ?? 0) + l.value);
  }
  const total = (id: string) => Math.max(inbound.get(id) ?? 0, outbound.get(id) ?? 0);

  const boxes: SankeyBox[] = [];
  for (const col of [0, 1, 2] as const) {
    const nodes = SANKEY_NODES.filter((n) => n.col === col);
    const sum = nodes.reduce((s, n) => s + total(n.id), 0);
    const avail = SANKEY_H - TOP - PAD * (nodes.length - 1) - 20;
    let y = TOP;
    for (const n of nodes) {
      const h = Math.max((total(n.id) / sum) * avail, 26);
      boxes.push({ ...n, x: COL_X[col], y, w: COL_W[col], h });
      y += h + PAD;
    }
  }

  const byId = new Map(boxes.map((b) => [b.id, b]));
  const outCursor = new Map<string, number>();
  const inCursor = new Map<string, number>();

  const ribbons: SankeyRibbon[] = [];
  for (const l of SANKEY_LINKS) {
    const a = byId.get(l.from);
    const b = byId.get(l.to);
    if (!a || !b) continue;

    const aTotal = total(a.id);
    const bTotal = total(b.id);
    const ah = (l.value / aTotal) * a.h;
    const bh = (l.value / bTotal) * b.h;

    const ay = a.y + (outCursor.get(a.id) ?? 0);
    const by = b.y + (inCursor.get(b.id) ?? 0);
    outCursor.set(a.id, (outCursor.get(a.id) ?? 0) + ah);
    inCursor.set(b.id, (inCursor.get(b.id) ?? 0) + bh);

    const x1 = a.x + a.w;
    const x2 = b.x;
    const cx = (x1 + x2) / 2;

    ribbons.push({
      from: l.from,
      to: l.to,
      value: l.value,
      note: l.note,
      target: b.col === 2 ? b.id : l.to,
      d: [
        `M ${x1} ${ay}`,
        `C ${cx} ${ay} ${cx} ${by} ${x2} ${by}`,
        `L ${x2} ${by + bh}`,
        `C ${cx} ${by + bh} ${cx} ${ay + ah} ${x1} ${ay + ah}`,
        "Z",
      ].join(" "),
    });
  }

  return { boxes, ribbons };
}

/** Total path length of an SVG path, for draw-in animations without measuring. */
export function approxLength(points: Array<[number, number]>): number {
  let len = 0;
  for (let i = 1; i < points.length; i += 1) {
    len += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return len;
}
