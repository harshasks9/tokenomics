/**
 * Usage statistics, qualification and plays. Per-user telemetry is generated
 * deterministically from each account's seed so medians are real medians over
 * real (synthetic) per-user values — not a single made-up number.
 */
import { EDITIONS, PROGRAM } from "./data";
import type { Account, Stage } from "./types";

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function normal(r: () => number) {
  const u = Math.max(r(), 1e-9);
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface UserUsage { team: string; tasksPerWeek: number }

/** Agentic tasks per user per week, one entry per seat (capped at 2,000 sampled users). */
export function usersFor(a: Account): UserUsage[] {
  const r = rng(a.usage.seed);
  const n = Math.min(a.seats, 2000);
  const boost = workshopBoost(a);
  const out: UserUsage[] = [];
  let i = 0;
  for (const team of a.teams) {
    const count = Math.round(n * team.seatShare);
    for (let k = 0; k < count && i < n; k++, i++) {
      const active = r() < Math.min(0.97, a.usage.activeShare * team.intensity * boost.share);
      const v = active ? a.usage.scale * boost.scale * team.intensity * Math.exp(0.85 * normal(r)) : 0;
      out.push({ team: team.name, tasksPerWeek: Math.round(v * 10) / 10 });
    }
  }
  while (out.length < n) out.push({ team: a.teams[0].name, tasksPerWeek: 0 });
  return out;
}

/** Modeled effect of an Agentify your Day workshop and enabled long-running use cases. */
function workshopBoost(a: Account): { share: number; scale: number } {
  const after = ["agentified", "using", "expanding"].includes(a.stage);
  const extra = Math.max(0, a.enabled.length - Object.keys(a.useCases).length);
  return after ? { share: 1.35 + 0.05 * extra, scale: 1.2 + 0.05 * extra } : { share: 1, scale: 1 };
}

export function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return Math.round((sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo)) * 10) / 10;
}

export interface UsageStats {
  median: number;
  mean: number;
  p25: number;
  p75: number;
  p90: number;
  activeShare: number;
  histogram: { bucket: string; users: number }[];
  byTeam: { team: string; seats: number; median: number; activeShare: number }[];
  /** Median monthly entitlement draw per user, USD, vs the edition's entitlement. */
  medianDraw: number;
  p90Draw: number;
  entitlement: number;
  /** Share of users who would hit the per-user entitlement. */
  atCap: number;
}

const BUCKETS: [string, number, number][] = [["0", 0, 0], ["0.1–1", 0.01, 1], ["1–2", 1, 2], ["2–5", 2, 5], ["5–10", 5, 10], ["10+", 10, Infinity]];

export function stats(a: Account): UsageStats {
  const users = usersFor(a);
  const vals = users.map((u) => u.tasksPerWeek).sort((x, y) => x - y);
  const mean = vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length);
  const ent = EDITIONS[a.edition].entitlement;
  const draw = (t: number) => Math.min(ent, t * 4.3 * PROGRAM.avgCostPerTask);
  const teams = a.teams.map((t) => {
    const tv = users.filter((u) => u.team === t.name).map((u) => u.tasksPerWeek).sort((x, y) => x - y);
    return { team: t.name, seats: Math.round(a.seats * t.seatShare), median: quantile(tv, 0.5), activeShare: tv.filter((v) => v > 0).length / Math.max(1, tv.length) };
  });
  return {
    median: quantile(vals, 0.5),
    mean: Math.round(mean * 10) / 10,
    p25: quantile(vals, 0.25),
    p75: quantile(vals, 0.75),
    p90: quantile(vals, 0.9),
    activeShare: vals.filter((v) => v > 0).length / Math.max(1, vals.length),
    histogram: BUCKETS.map(([bucket, lo, hi]) => ({ bucket, users: vals.filter((v) => (hi === 0 ? v === 0 : v >= lo && v < hi)).length })),
    byTeam: teams,
    medianDraw: Math.round(draw(quantile(vals, 0.5)) * 100) / 100,
    p90Draw: Math.round(draw(quantile(vals, 0.9)) * 100) / 100,
    entitlement: ent,
    atCap: vals.filter((v) => v * 4.3 * PROGRAM.avgCostPerTask >= ent).length / Math.max(1, vals.length),
  };
}

export type Play = "activate" | "deepen" | "expand" | "upgrade-first" | "not-now";

export interface Qualification {
  score: number; // 0..100
  play: Play;
  reasons: string[];
  headroomUsers: number; // seats whose median-or-below usage is the activation upside
}

/** “Is it worth our while?” — edition, median usage, use cases. */
export function qualify(a: Account, s: UsageStats): Qualification {
  const ed = EDITIONS[a.edition];
  const reasons: string[] = [];
  let score = 0;
  if (a.sovereign) return { score: 5, play: "not-now", reasons: ["Sovereign Controls — out of scope for the initial beta"], headroomUsers: 0 };
  if (ed.entitlement >= 6) { score += 30; reasons.push(`${ed.name}: $${ed.entitlement}/user/month entitlement`); }
  else { score += 8; reasons.push(`${ed.name}: only $${ed.entitlement}/user/month — low ceiling`); }
  if (ed.betaFirstWave) { score += a.geminiBeta ? 15 : 10; reasons.push(a.geminiBeta ? "Beta first wave, setting on" : "Beta first wave — switch the setting on"); }
  const idle = 1 - s.activeShare;
  const headroomUsers = Math.round(a.seats * idle);
  score += Math.min(30, Math.round((headroomUsers / 1000) * 12)); // bigger idle population = bigger activation prize
  if (s.median < PROGRAM.activation.medianTasksPerWeek) reasons.push(`Median user: ${s.median} agentic tasks/week (mean ${s.mean}) — most seats idle`);
  else reasons.push(`Median user: ${s.median} tasks/week — activation is real`);
  const ucs = Object.keys(a.useCases).length;
  score += Math.min(15, ucs * 5);
  reasons.push(ucs ? `${ucs} use case${ucs > 1 ? "s" : ""} in use today` : "No long-running use cases yet");
  let play: Play;
  if (ed.entitlement < 6) play = "upgrade-first";
  else if (s.median < PROGRAM.activation.medianTasksPerWeek) play = "activate";
  else if (s.median < PROGRAM.using.medianTasksPerWeek || ucs < PROGRAM.using.useCases) play = "deepen";
  else play = "expand";
  if (play === "expand") { score += 10; reasons.push(`${Math.round(s.atCap * 100)}% of users at the entitlement cap — seats/edition conversation`); }
  return { score: Math.min(100, score), play, reasons, headroomUsers };
}

export const PLAY_LABEL: Record<Play, { label: string; next: string }> = {
  activate: { label: "Activate", next: "Run Agentify your Day; target median ≥ 2 tasks/week by week 4." },
  deepen: { label: "Deepen", next: "Add long-running use cases until 3+ are live; target median ≥ 5." },
  expand: { label: "Expand", next: "Usage is proven — open the new-seats / edition conversation; use POC credits for new users." },
  "upgrade-first": { label: "Upgrade first", next: "$2 entitlement caps the value; lead with an edition conversation before a workshop." },
  "not-now": { label: "Not now", next: "Out of scope for this quarter." },
};

/** Stage the telemetry supports (the program's definitions). */
export function earnedStage(a: Account, s: UsageStats): Stage {
  if (a.stage === "qualified" || a.stage === "scheduled") return a.stage;
  const ucs = new Set([...Object.keys(a.useCases), ...a.enabled]).size;
  if (s.median >= PROGRAM.using.medianTasksPerWeek && ucs >= PROGRAM.using.useCases) return a.newUsers > 0 || s.atCap > 0.15 ? "expanding" : "using";
  return "agentified";
}

export const STAGES: { id: Stage; label: string; rule: string }[] = [
  { id: "qualified", label: "Qualified", rule: "Edition, median usage and use cases known; worth a workshop" },
  { id: "scheduled", label: "Workshop booked", rule: "Agentify your Day on the calendar" },
  { id: "agentified", label: "Agentified", rule: "Workshop done; champions running long-running agents" },
  { id: "using", label: "Using", rule: `Median user ≥ ${PROGRAM.using.medianTasksPerWeek} tasks/week and ≥ ${PROGRAM.using.useCases} use cases` },
  { id: "expanding", label: "Expanding", rule: "New users on POC credits or users at the entitlement cap — seats / edition conversation open" },
];

export function seatCost(a: Account): number {
  return EDITIONS[a.edition].pupm;
}

/** POC credits to cover `users` new seats for the POC period. */
export function creditsFor(a: Account, users: number): number {
  return users * seatCost(a) * PROGRAM.pocMonths;
}
