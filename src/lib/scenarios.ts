import { callCost } from './pricing';

// S1 — SDLC. Token cost per coding task by complexity.
export const S1 = {
  routineTask:  { inTok: 40000, outTok: 10000 }, // boilerplate, tests, docs, scaffolds
  complexTask:  { inTok: 80000, outTok: 20000 }, // architecture, compliance logic, hard bugs
  defaultMix:   { routinePct: 0.75 },             // 75% routine / 25% complex
  tasksPerDevPerSprint: 50,
  defaults:     { devs: 12, sprints: 13 },        // ~6 months
  // Tiered: routine->flash, complex->opus.  All-frontier: everything->opus.
};

// S2 — In-app intelligence. Routine client chat query.
export const S2 = {
  query: { inTok: 2000, outTok: 400 },
  // Honest routing mix for tiered:
  tieredMix: { flashLitePct: 0.60, flashPct: 0.20, opusPct: 0.20 },
  defaults: { queriesPerMonth: 5_000_000 },
  // All-frontier: 100% opus.
};

// S3 — Multimodal & latency. "What changed on my statement?"
export const S3 = {
  // tokens
  visionInput: 12000, analysisOut: 1000, structuredOut: 600, structuredReInput: 3000,
  lanes: {
    pureClaude: { model: 'opus' as const,  latencyMs: 3800, quality: 5, label: "Pure Claude (Opus vision)" },
    pureGemini: { model: 'flash' as const, latencyMs:  900, quality: 4, label: "Pure Gemini (3.5 Flash, native)" },
    hybrid:     {                           latencyMs: 2700, quality: 5, label: "Hybrid (Flash ingest → Opus analyze)" },
  },
  // Voice variant
  voice: { claudeMs: 4400, geminiMs: 700, hybridMs: 1900 },
  defaults: { interactionsPerYear: 2_000_000 },
};

// S4 — Agentic orchestration. One nightly rebalancing run.
export const S4 = {
  planner:  { model: 'opus' as const,  inTok: 5000, outTok: 2000 },
  review:   { model: 'opus' as const,  inTok: 8000, outTok: 1500 },
  executor: { inTok: 4000, outTok: 1000 },
  steps: 16,
  defaults: { portfoliosPerNight: 50000, nightsPerYear: 365 },
  // Tiered: executors->flash. All-opus: executors->opus.
};

// ===== DERIVED COMPUTATIONS =====

/** S1: Cost per sprint for a given team */
export function s1Costs(devs: number, routinePct: number) {
  const totalTasks = devs * S1.tasksPerDevPerSprint;
  const routineTasks = totalTasks * routinePct;
  const complexTasks = totalTasks * (1 - routinePct);

  const allFrontier =
    routineTasks * callCost('opus', S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('opus', S1.complexTask.inTok, S1.complexTask.outTok);

  const tiered =
    routineTasks * callCost('flash', S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('opus', S1.complexTask.inTok, S1.complexTask.outTok);

  return { allFrontier, tiered, savings: allFrontier - tiered };
}

/** S2: Monthly cost at volume */
export function s2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = S2.query;
  const { flashLitePct, flashPct, opusPct } = S2.tieredMix;

  const allFrontier = queriesPerMonth * callCost('opus', inTok, outTok);
  const tiered = queriesPerMonth * (
    flashLitePct * callCost('flashLite', inTok, outTok) +
    flashPct * callCost('flash', inTok, outTok) +
    opusPct * callCost('opus', inTok, outTok)
  );

  return { allFrontier, tiered, savings: allFrontier - tiered, savingsAnnual: (allFrontier - tiered) * 12 };
}

/** S3: Cost per interaction */
export function s3Costs() {
  const { visionInput, analysisOut, structuredOut, structuredReInput } = S3;

  // Pure approaches: single model handles everything in one call
  const pureClaude = callCost('opus', visionInput, analysisOut);  // $0.085
  const pureGemini = callCost('flash', visionInput, analysisOut); // $0.027
  // Hybrid: Flash ingests vision + extracts structure, Opus analyzes
  const hybrid = callCost('flash', visionInput, structuredOut) + callCost('opus', structuredReInput, analysisOut);

  return { pureClaude, pureGemini, hybrid };
}

/** S4: Cost per agent run */
export function s4Costs() {
  const { planner, review, executor, steps } = S4;

  const plannerCost = callCost('opus', planner.inTok, planner.outTok);
  const reviewCost = callCost('opus', review.inTok, review.outTok);
  const executorOpusCost = steps * callCost('opus', executor.inTok, executor.outTok);
  const executorFlashCost = steps * callCost('flash', executor.inTok, executor.outTok);

  const allOpus = plannerCost + executorOpusCost + reviewCost;
  const hybrid = plannerCost + executorFlashCost + reviewCost;

  return { allOpus, hybrid, plannerCost, reviewCost, executorOpusCost, executorFlashCost, savings: allOpus - hybrid };
}

/** S4: Annual cost at scale */
export function s4Annual(portfoliosPerNight: number) {
  const { allOpus, hybrid } = s4Costs();
  const allOpusAnnual = allOpus * portfoliosPerNight * S4.defaults.nightsPerYear;
  const hybridAnnual = hybrid * portfoliosPerNight * S4.defaults.nightsPerYear;
  return { allOpusAnnual, hybridAnnual, savings: allOpusAnnual - hybridAnnual };
}
