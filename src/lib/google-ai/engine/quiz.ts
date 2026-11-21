/**
 * Quiz — pure logic for the specialist quiz: which questions are in scope, drawing a round without repeats,
 * shuffling answer options and scoring. No questions live here; they come from the knowledge base.
 * Randomness is injected so every function can be tested with a fixed sequence.
 */
import { addDays } from "../dates";
import type { QuizQuestion } from "../types";

export type QuizTopic = QuizQuestion["topic"];
/** "recent" = answers dated in the last RECENT_DAYS days; "all" = everything; otherwise one topic. */
export type QuizScope = "recent" | "all" | QuizTopic;

export const RECENT_DAYS = 45;
export const ROUND_LENGTHS = [5, 10, 15] as const;

export const TOPIC_LABEL: Record<QuizTopic, string> = {
  models: "Models",
  pricing: "Pricing",
  platform: "Developer platform",
  agents: "Agents",
  enterprise: "Enterprise products",
  consumer: "Consumer products",
  infrastructure: "Infrastructure",
  competitors: "Competitors",
  research: "Research",
};
const TOPIC_ORDER = Object.keys(TOPIC_LABEL) as QuizTopic[];

/** A question can be asked only if it has a real choice and its answer index points at one of its options. */
export function isUsable(q: QuizQuestion): boolean {
  return (
    typeof q.question === "string" &&
    q.question.trim().length > 0 &&
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    new Set(q.options).size === q.options.length &&
    Number.isInteger(q.answer) &&
    q.answer >= 0 &&
    q.answer < q.options.length
  );
}

/** Usable questions, one per id. */
export function usable(questions: readonly QuizQuestion[]): QuizQuestion[] {
  const seen = new Set<string>();
  return questions.filter((q) => isUsable(q) && !seen.has(q.id) && (seen.add(q.id), true));
}

/** Topics that have at least one question, in a fixed order. */
export function topicsIn(questions: readonly QuizQuestion[]): QuizTopic[] {
  const present = new Set(questions.map((q) => q.topic));
  return TOPIC_ORDER.filter((t) => present.has(t));
}

export function isRecent(q: QuizQuestion, today: string, days = RECENT_DAYS): boolean {
  return q.asOf <= today && q.asOf >= addDays(today, -days);
}

export function inScope(questions: readonly QuizQuestion[], scope: QuizScope, today: string): QuizQuestion[] {
  if (scope === "all") return questions.slice();
  if (scope === "recent") return questions.filter((q) => isRecent(q, today));
  return questions.filter((q) => q.topic === scope);
}

/** Fisher–Yates shuffle on a copy. `random` returns a number in [0, 1). */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.max(0, Math.floor(random() * (i + 1))));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** One question as it is shown: options in display order, and the correct option tracked by its text. */
export interface DrawnQuestion {
  q: QuizQuestion;
  options: string[];
  correct: string;
}

/** Draw up to `count` questions at random, without repeats, each with its options shuffled. */
export function draw(pool: readonly QuizQuestion[], count: number, random: () => number = Math.random): DrawnQuestion[] {
  return shuffle(usable(pool), random)
    .slice(0, Math.max(0, Math.floor(count)))
    .map((q) => ({ q, options: shuffle(q.options, random), correct: q.options[q.answer] }));
}

export function isCorrect(d: DrawnQuestion, chosen: string | null | undefined): boolean {
  return chosen != null && chosen === d.correct;
}

export interface Score {
  correct: number;
  total: number;
  /** Whole-number percentage; 0 for an empty round. */
  pct: number;
}

/** `answers[i]` is the option text chosen for `round[i]` (null or missing = not answered, counted as wrong). */
export function score(round: readonly DrawnQuestion[], answers: readonly (string | null | undefined)[]): Score {
  const correct = round.reduce((n, d, i) => n + (isCorrect(d, answers[i]) ? 1 : 0), 0);
  return { correct, total: round.length, pct: round.length ? Math.round((correct / round.length) * 100) : 0 };
}

/** Questions answered wrongly or not at all, in round order. */
export function missed(round: readonly DrawnQuestion[], answers: readonly (string | null | undefined)[]): DrawnQuestion[] {
  return round.filter((d, i) => !isCorrect(d, answers[i]));
}

/** A plain reading of the score. No flattery: under half is said to be under half. */
export function verdict(s: Score): string {
  if (!s.total) return "No questions were answered.";
  if (s.correct === s.total) return "Every answer was right. You are up to date on this set.";
  if (s.pct >= 80) return "Mostly up to date. The review below shows the details to refresh.";
  if (s.pct >= 50) return "About half of this has moved past you. The review below shows where.";
  return "Most of these were missed. Read the records below before your next customer conversation.";
}

/** Best result per scope, as kept in the browser. */
export type BestScores = Partial<Record<QuizScope, { correct: number; total: number }>>;

/** True when `next` beats `prev`: a higher share right, or the same share over a longer round. */
export function isBetter(next: { correct: number; total: number }, prev?: { correct: number; total: number }): boolean {
  if (!next.total) return false;
  if (!prev || !prev.total) return true;
  const a = next.correct * prev.total;
  const b = prev.correct * next.total;
  return a > b || (a === b && next.total > prev.total);
}

/** Read stored best scores defensively: anything malformed is dropped. */
export function parseBest(raw: string | null): BestScores {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return {};
    const out: BestScores = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (k !== "recent" && k !== "all" && !(k in TOPIC_LABEL)) continue;
      const row = v as { correct?: unknown; total?: unknown } | null;
      if (!row || typeof row.correct !== "number" || typeof row.total !== "number") continue;
      if (!Number.isInteger(row.correct) || !Number.isInteger(row.total) || row.total <= 0 || row.correct < 0 || row.correct > row.total) continue;
      out[k as QuizScope] = { correct: row.correct, total: row.total };
    }
    return out;
  } catch {
    return {};
  }
}
