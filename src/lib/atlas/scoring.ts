import type { Assertion, Category, Judgment, Thinker, TopicId } from "./types";

/**
 * AI Foresight Scorecard.
 *
 * Six dimensions, each normalized to 0–1, combined with user-adjustable weights
 * (defaults from the brief). Only assertions whose outcome is observable by the
 * cutoff are scored. Design choices, all visible in the Methodology panel:
 *
 *  - Evidence weight per claim = specificity/5 × confidence factor × kind factor,
 *    so vague or non-falsifiable claims count for little and strategic actions
 *    (which only imply a belief) count half.
 *  - Material errors are penalized: an incorrect claim with specificity ≥ 4
 *    scores −0.25 rather than 0.
 *  - Every dimension is Bayesian-shrunk toward a neutral prior (0.5) with
 *    strength K, which normalizes for the number of evaluable claims: a thinker
 *    with two lucky calls cannot outrank one with twelve good ones.
 *  - Uncertainty: a seeded bootstrap over each thinker's scored claims gives an
 *    80% interval; ranks whose intervals overlap are flagged as ties.
 */

export type DimensionId = "accuracy" | "originality" | "timing" | "causal" | "updating" | "breadth";
export type Weights = Record<DimensionId, number>;

export const DIMENSIONS: { id: DimensionId; name: string; desc: string; defaultWeight: number }[] = [
  { id: "accuracy", name: "Prediction accuracy", desc: "Weighted share of scored claims that came true (partial = ½, material misses penalized).", defaultWeight: 30 },
  { id: "originality", name: "Originality & contrarian insight", desc: "Correct calls that went against the consensus of their time (originality × outcome).", defaultWeight: 20 },
  { id: "timing", name: "Timing accuracy", desc: "Among correct/partial calls: early > on time > late > premature.", defaultWeight: 15 },
  { id: "causal", name: "Causal understanding", desc: "Right for the right reasons: did the stated mechanism hold?", defaultWeight: 15 },
  { id: "updating", name: "Consistency & updating", desc: "Revised views when evidence changed, without unacknowledged flip-flops (analyst judgment, audit-trailed).", defaultWeight: 10 },
  { id: "breadth", name: "Breadth across the stack", desc: "Distinct stack layers on which they made scored, at-least-partly-correct claims.", defaultWeight: 10 },
];

export const DEFAULT_WEIGHTS: Weights = Object.fromEntries(DIMENSIONS.map((d) => [d.id, d.defaultWeight])) as Weights;

/** Alternative weightings for the sensitivity table. */
export const WEIGHT_PRESETS: { id: string; name: string; weights: Weights }[] = [
  { id: "default", name: "Brief default", weights: DEFAULT_WEIGHTS },
  { id: "equal", name: "Equal weights", weights: { accuracy: 1, originality: 1, timing: 1, causal: 1, updating: 1, breadth: 1 } },
  { id: "accuracy", name: "Accuracy only", weights: { accuracy: 1, originality: 0, timing: 0, causal: 0, updating: 0, breadth: 0 } },
  { id: "no-contrarian", name: "No contrarian bonus", weights: { ...DEFAULT_WEIGHTS, originality: 0 } },
  { id: "reasons", name: "Right reasons first", weights: { accuracy: 25, originality: 10, timing: 10, causal: 35, updating: 15, breadth: 5 } },
];

export const MIN_SCORED = 3;
const K = 2; // shrinkage strength (pseudo-claims at the neutral prior)
const PRIOR = 0.5;

export const isScorable = (a: Assertion) => a.verdict !== "unresolved" && a.kind !== "aspiration";

const confFactor = { high: 1, medium: 0.75, low: 0.5 } as const;
export function claimWeight(a: Assertion): number {
  const kind = a.kind === "action" ? 0.5 : a.kind === "opinion" ? 0.75 : 1;
  return (Math.max(1, Math.min(5, a.specificity)) / 5) * confFactor[a.confidence] * kind;
}

export function claimValue(a: Assertion): number {
  if (a.verdict === "correct") return 1;
  if (a.verdict === "partial") return 0.5;
  if (a.verdict === "incorrect") return a.specificity >= 4 ? -0.25 : 0;
  return PRIOR;
}

const timingValue = { early: 1, "on-time": 0.8, late: 0.45, premature: 0.3, "n/a": 0.6 } as const;

function shrunk(sumWV: number, sumW: number) {
  return Math.max(0, Math.min(1, (sumWV + PRIOR * K) / (sumW + K)));
}

export type DimScores = Record<DimensionId, number>;

/** Dimension scores for one thinker over a set of scored claims. */
export function dimensions(claims: Assertion[], judgment: Judgment | undefined): DimScores {
  let wA = 0, vA = 0, wO = 0, vO = 0, wT = 0, vT = 0, wC = 0, vC = 0;
  const layers = new Set<string>();
  for (const a of claims) {
    const w = claimWeight(a);
    const v = claimValue(a);
    wA += w; vA += w * v;
    // Contrarian insight: originality only earns credit when the call held up.
    const orig = (Math.max(1, Math.min(5, a.originality)) - 1) / 4;
    // A correct consensus call earns ¼ credit; a correct contrarian call earns full credit; misses earn none.
    wO += w; vO += w * (v > 0 ? (0.25 + 0.75 * orig) * v : 0);
    if (a.verdict === "correct" || a.verdict === "partial") {
      wT += w; vT += w * timingValue[a.timing];
      if (v >= 0.5) for (const l of a.layers) layers.add(l);
    }
    if (a.causal != null) { wC += w; vC += w * ((Math.max(1, Math.min(5, a.causal)) - 1) / 4); }
  }
  return {
    accuracy: shrunk(vA, wA),
    originality: shrunk(vO, wO),
    timing: shrunk(vT, wT),
    causal: shrunk(vC, wC),
    updating: judgment ? (Math.max(1, Math.min(5, judgment.updating)) - 1) / 4 : PRIOR,
    breadth: Math.min(1, layers.size / 7),
  };
}

export function composite(d: DimScores, w: Weights): number {
  const total = DIMENSIONS.reduce((s, x) => s + Math.max(0, w[x.id]), 0) || 1;
  return DIMENSIONS.reduce((s, x) => s + (Math.max(0, w[x.id]) / total) * d[x.id], 0);
}

/** Deterministic PRNG so bootstrap intervals are stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }

export type ClaimFilter = {
  categories?: Category[];
  topics?: TopicId[];
};

export type ScoreRow = {
  thinkerId: string;
  scored: Assertion[];
  unresolved: number;
  dims: DimScores;
  score: number;
  lo: number;
  hi: number;
  rank: number;
  /** True when n < MIN_SCORED — shown but not ranked. */
  insufficient: boolean;
  /** True when this row's interval overlaps the row ranked directly above it. */
  tieAbove: boolean;
};

export function filterClaims(all: Assertion[], f: ClaimFilter): Assertion[] {
  return all.filter((a) =>
    (!f.categories?.length || f.categories.includes(a.category)) &&
    (!f.topics?.length || a.topics.some((t) => f.topics!.includes(t))));
}

export function scoreAll(
  thinkers: Thinker[],
  assertions: Assertion[],
  judgments: Judgment[],
  weights: Weights,
  filter: ClaimFilter = {},
  iterations = 300,
): ScoreRow[] {
  const jBy = new Map(judgments.map((j) => [j.thinkerId, j]));
  const rows: ScoreRow[] = thinkers.map((t) => {
    const mine = assertions.filter((a) => a.thinkerId === t.id);
    const scored = filterClaims(mine, filter).filter(isScorable);
    const j = jBy.get(t.id);
    const dims = dimensions(scored, j);
    const score = composite(dims, weights);
    // Bootstrap 80% interval over scored claims.
    let lo = score, hi = score;
    if (scored.length > 0) {
      const rnd = mulberry32(hash(t.id + JSON.stringify(filter)));
      const samples: number[] = [];
      for (let i = 0; i < iterations; i++) {
        const s: Assertion[] = [];
        for (let k = 0; k < scored.length; k++) s.push(scored[Math.floor(rnd() * scored.length)]);
        samples.push(composite(dimensions(s, j), weights));
      }
      if (samples.length) {
        samples.sort((a, b) => a - b);
        lo = samples[Math.floor(iterations * 0.1)];
        hi = samples[Math.floor(iterations * 0.9)];
      }
      // A bootstrap of 3–7 claims understates uncertainty (identical resamples look certain), so the
      // interval is widened by a small-sample term from the effective number of weighted claims.
      const nEff = scored.reduce((s, a) => s + claimWeight(a), 0);
      const extra = 1.28 * Math.sqrt((score * (1 - score)) / (nEff + K + 1)) * 0.6;
      lo = Math.max(0, Math.min(lo, score - extra));
      hi = Math.min(1, Math.max(hi, score + extra));
    }
    return {
      thinkerId: t.id, scored, unresolved: filterClaims(mine, filter).filter((a) => a.verdict === "unresolved").length,
      dims, score, lo, hi, rank: 0, insufficient: scored.length < MIN_SCORED, tieAbove: false,
    };
  });
  const ranked = rows.filter((r) => !r.insufficient).sort((a, b) => b.score - a.score);
  ranked.forEach((r, i) => {
    r.rank = i + 1;
    if (i > 0) r.tieAbove = r.hi >= ranked[i - 1].lo;
  });
  const rest = rows.filter((r) => r.insufficient).sort((a, b) => b.scored.length - a.scored.length);
  return [...ranked, ...rest];
}

/** Rank of each thinker under each weight preset (sensitivity table). */
export function sensitivity(thinkers: Thinker[], assertions: Assertion[], judgments: Judgment[]) {
  const out: Record<string, Record<string, number>> = {};
  for (const p of WEIGHT_PRESETS) {
    for (const r of scoreAll(thinkers, assertions, judgments, p.weights, {}, 0)) {
      (out[r.thinkerId] ??= {})[p.id] = r.rank;
    }
  }
  return out;
}

/** Share of a thinker's claims (dated on/after `since`) scored correct-or-partial, for the "most improved" lens. */
export function accuracyBetween(claims: Assertion[], from: number, to: number) {
  const s = claims.filter((a) => isScorable(a) && Number(a.date.slice(0, 4)) >= from && Number(a.date.slice(0, 4)) <= to);
  if (!s.length) return null;
  let w = 0, v = 0;
  for (const a of s) { const cw = claimWeight(a); w += cw; v += cw * Math.max(0, claimValue(a)); }
  return { n: s.length, value: v / w };
}
