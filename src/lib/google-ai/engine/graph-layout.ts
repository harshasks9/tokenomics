/**
 * Force-directed layout for the knowledge graph. Pure and deterministic: the same nodes and edges always give
 * the same picture, so a shared link shows the reader what the sender saw. No Math.random — starting positions
 * come from a hash of each id.
 *
 * Forces, per tick: springs along edges, repulsion between every pair, a soft collision so circles do not sit
 * on top of each other, a pull to the centre, and a mild pull toward the centroid of the node's group
 * (a layer or a provider) so related things settle near each other without being forced into boxes.
 */

export interface LayoutNode {
  id: string;
  /** Cluster key: nodes sharing a key are drawn gently together. */
  group?: string;
  /** Drawn radius in layout units, used to keep circles apart. */
  r?: number;
}
export interface LayoutEdge {
  from: string;
  to: string;
}
export interface Point {
  x: number;
  y: number;
}
export type Positions = Record<string, Point>;

export interface LayoutOptions {
  /** Number of ticks. The simulation cools linearly and stops exactly here. */
  iterations?: number;
  /** Resting length of an edge. */
  linkDistance?: number;
  /** Strength of the pairwise repulsion. */
  charge?: number;
  /** Pull toward the centre. */
  gravity?: number;
  /** Pull toward the centroid of the node's group. */
  cluster?: number;
  /** Width over height of the area the layout settles into. */
  aspect?: number;
}

export const LAYOUT_DEFAULTS: Required<LayoutOptions> = { iterations: 300, linkDistance: 44, charge: 50, gravity: 0.05, cluster: 0.05, aspect: 1.1 };

/** FNV-1a hash of an id, mapped to [0, 1). The salt gives independent values for the same id. */
export function hashId(id: string, salt = 0): number {
  let h = (0x811c9dc5 ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  // Final avalanche so ids that differ only in their last character still land far apart.
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

export interface Simulation {
  /** Total ticks the simulation will run. */
  readonly total: number;
  /** Ticks run so far. */
  readonly ticks: number;
  readonly done: boolean;
  /** Run up to `count` more ticks. Returns true when the simulation has finished. */
  step(count: number): boolean;
  /** Current positions, rounded to one decimal. */
  positions(): Positions;
}

const round1 = (v: number) => Math.round(v * 10) / 10 + 0;

/**
 * Build a simulation that can be advanced in chunks (to keep a page responsive).
 * Running it in one call or in many gives identical positions.
 */
export function createSimulation(nodes: readonly LayoutNode[], edges: readonly LayoutEdge[], options: LayoutOptions = {}): Simulation {
  const o = { ...LAYOUT_DEFAULTS, ...options };
  const total = Math.max(0, Math.floor(o.iterations));
  const aspect = o.aspect > 0 ? o.aspect : 1;

  const ids: string[] = [];
  const index = new Map<string, number>();
  const radius: number[] = [];
  const groupKeys = new Map<string, number>();
  const groupOf: number[] = [];
  for (const node of nodes) {
    if (index.has(node.id)) continue;
    index.set(node.id, ids.length);
    ids.push(node.id);
    radius.push(node.r != null && Number.isFinite(node.r) && node.r > 0 ? node.r : 5);
    const key = node.group ?? "";
    if (!groupKeys.has(key)) groupKeys.set(key, groupKeys.size);
    groupOf.push(groupKeys.get(key) as number);
  }
  const n = ids.length;
  const groups = groupKeys.size;

  // Edges: unknown ends and self-loops are dropped; parallel edges count once.
  const la: number[] = [];
  const lb: number[] = [];
  const degree = new Float64Array(n);
  const seen = new Set<number>();
  for (const e of edges) {
    const a = index.get(e.from);
    const b = index.get(e.to);
    if (a == null || b == null || a === b) continue;
    const key = a < b ? a * n + b : b * n + a;
    if (seen.has(key)) continue;
    seen.add(key);
    la.push(a);
    lb.push(b);
    degree[a]++;
    degree[b]++;
  }
  const links = la.length;
  const strength = new Float64Array(links);
  const bias = new Float64Array(links);
  for (let k = 0; k < links; k++) {
    strength[k] = 1 / Math.min(degree[la[k]], degree[lb[k]]);
    bias[k] = degree[la[k]] / (degree[la[k]] + degree[lb[k]]);
  }
  // Well-connected nodes push a little harder, which gives hubs room for their neighbours.
  const push = new Float64Array(n);
  for (let i = 0; i < n; i++) push[i] = 1 + 0.22 * Math.sqrt(degree[i]);

  // Seed: groups start around an ellipse (in the order they first appear), each node scattered by its hash.
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  const vx = new Float64Array(n);
  const vy = new Float64Array(n);
  const spread = o.linkDistance * Math.sqrt(Math.max(n, 1));
  const ring = groups > 1 ? spread * 0.55 : 0;
  for (let i = 0; i < n; i++) {
    const ga = (groupOf[i] / Math.max(groups, 1)) * Math.PI * 2 - Math.PI / 2;
    const a = hashId(ids[i], 1) * Math.PI * 2;
    const d = Math.sqrt(hashId(ids[i], 2)) * spread * 0.35;
    x[i] = Math.cos(ga) * ring * aspect + Math.cos(a) * d;
    y[i] = Math.sin(ga) * ring + Math.sin(a) * d;
  }

  const gx = new Float64Array(groups);
  const gy = new Float64Array(groups);
  const gn = new Float64Array(groups);
  const maxStep = o.linkDistance * 3;
  const minD2 = 16;
  let ticks = 0;

  const tick = () => {
    const alpha = 1 - ticks / total;

    for (let k = 0; k < links; k++) {
      const a = la[k];
      const b = lb[k];
      let dx = x[b] + vx[b] - x[a] - vx[a];
      let dy = y[b] + vy[b] - y[a] - vy[a];
      if (dx === 0 && dy === 0) {
        dx = 0.01 * (1 + (k % 7));
        dy = 0.01 * (1 + (k % 5));
      }
      const len = Math.sqrt(dx * dx + dy * dy);
      const f = ((len - o.linkDistance) / len) * alpha * strength[k];
      vx[b] -= dx * f * bias[k];
      vy[b] -= dy * f * bias[k];
      vx[a] += dx * f * (1 - bias[k]);
      vy[a] += dy * f * (1 - bias[k]);
    }

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = x[j] - x[i];
        let dy = y[j] - y[i];
        if (dx === 0 && dy === 0) {
          // Two nodes on the same spot: separate them along a direction fixed by their indices.
          dx = 0.01 * (1 + ((i + j) % 7));
          dy = 0.01 * (1 + ((i * 3 + j) % 5));
        }
        let d2 = dx * dx + dy * dy;
        const real = Math.sqrt(d2);
        if (d2 < minD2) d2 = Math.sqrt(minD2 * d2);
        const w = (o.charge * push[i] * push[j] * alpha) / d2;
        // Collision: overlapping circles are pushed apart regardless of how far the simulation has cooled.
        const gap = radius[i] + radius[j] + 4;
        const c = real < gap ? ((gap - real) / Math.max(real, 0.01)) * 0.35 : 0;
        const fx = dx * (w + c);
        const fy = dy * (w + c);
        vx[i] -= fx;
        vy[i] -= fy;
        vx[j] += fx;
        vy[j] += fy;
      }
    }

    gx.fill(0);
    gy.fill(0);
    gn.fill(0);
    for (let i = 0; i < n; i++) {
      gx[groupOf[i]] += x[i];
      gy[groupOf[i]] += y[i];
      gn[groupOf[i]]++;
    }
    for (let i = 0; i < n; i++) {
      const g = groupOf[i];
      vx[i] += (-x[i] * o.gravity * alpha) / aspect + (gx[g] / gn[g] - x[i]) * o.cluster * alpha;
      vy[i] += -y[i] * o.gravity * alpha * aspect + (gy[g] / gn[g] - y[i]) * o.cluster * alpha;
    }

    for (let i = 0; i < n; i++) {
      vx[i] = Number.isFinite(vx[i]) ? Math.max(-maxStep, Math.min(maxStep, vx[i] * 0.6)) : 0;
      vy[i] = Number.isFinite(vy[i]) ? Math.max(-maxStep, Math.min(maxStep, vy[i] * 0.6)) : 0;
      x[i] += vx[i];
      y[i] += vy[i];
    }
    ticks++;
  };

  return {
    total,
    get ticks() {
      return ticks;
    },
    get done() {
      return ticks >= total;
    },
    step(count: number) {
      for (let i = 0; i < count && ticks < total; i++) tick();
      return ticks >= total;
    },
    positions() {
      const out: Positions = {};
      for (let i = 0; i < n; i++) out[ids[i]] = { x: round1(x[i]), y: round1(y[i]) };
      return out;
    },
  };
}

/** Run the whole simulation in one call. */
export function layout(nodes: readonly LayoutNode[], edges: readonly LayoutEdge[], options: LayoutOptions = {}): Positions {
  const sim = createSimulation(nodes, edges, options);
  sim.step(sim.total);
  return sim.positions();
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Bounding box of the given ids (all positions when omitted). Null when there is nothing to bound. */
export function bounds(positions: Positions, ids?: Iterable<string>): Bounds | null {
  let b: Bounds | null = null;
  for (const id of ids ?? Object.keys(positions)) {
    const p = positions[id];
    if (!p) continue;
    if (!b) b = { minX: p.x, minY: p.y, maxX: p.x, maxY: p.y };
    else {
      if (p.x < b.minX) b.minX = p.x;
      if (p.y < b.minY) b.minY = p.y;
      if (p.x > b.maxX) b.maxX = p.x;
      if (p.y > b.maxY) b.maxY = p.y;
    }
  }
  return b;
}

/** A pan-and-zoom state: screen = layout × k + (x, y). */
export interface View {
  k: number;
  x: number;
  y: number;
}

/** The view that shows a bounding box inside a width × height area with some padding. */
export function fitView(b: Bounds | null, width: number, height: number, pad = 36, maxK = 1.6): View {
  if (!b || width <= 0 || height <= 0) return { k: 1, x: width / 2, y: height / 2 };
  const w = Math.max(b.maxX - b.minX, 1);
  const h = Math.max(b.maxY - b.minY, 1);
  const k = Math.min(maxK, Math.max(0.05, Math.min((width - pad * 2) / w, (height - pad * 2) / h)));
  return { k, x: width / 2 - ((b.minX + b.maxX) / 2) * k, y: height / 2 - ((b.minY + b.maxY) / 2) * k };
}

/** Zoom by a factor while keeping the layout point under (sx, sy) on screen fixed. */
export function zoomAt(v: View, factor: number, sx: number, sy: number, minK: number, maxK: number): View {
  const k = Math.max(minK, Math.min(maxK, v.k * factor));
  const f = k / v.k;
  return { k, x: sx - (sx - v.x) * f, y: sy - (sy - v.y) * f };
}
