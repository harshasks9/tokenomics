import { callCost } from './pricing';

// S1 — SDLC. Token cost per coding task by complexity.
export const S1 = {
  routineTask:  { inTok: 40000, outTok: 10000 }, // boilerplate, tests, docs, scaffolds
  complexTask:  { inTok: 80000, outTok: 20000 }, // architecture, compliance logic, hard bugs
  defaultMix:   { routinePct: 0.75 },             // 75% routine / 25% complex
  tasksPerDevPerSprint: 50,
  defaults:     { devs: 12, sprints: 13 },        // ~6 months
  // Both routes keep Opus on complex work. The comparison is Sonnet vs Flash for routine execution.
};

// S2 — In-app intelligence. Routine client chat query.
export const S2 = {
  query: { inTok: 2000, outTok: 400 },
  tieredMix: { flashLitePct: 0.60, flashPct: 0.28, opusPct: 0.12 },
  defaults: { queriesPerMonth: 5_000_000 },
};

// S3 — Multimodal & latency. "What changed on my statement?"
export const S3 = {
  visionInput: 12000, analysisOut: 1000, structuredOut: 600, structuredReInput: 3000,
  lanes: {
    allOpus:    { latencyMs: 3800, quality: 5, label: "All Opus" },
    opusSonnet: { latencyMs: 3200, quality: 5, label: "Opus + Sonnet" },
    opusFlash:  { latencyMs: 2700, quality: 5, label: "Opus + Flash" },
  },
  voice: { allOpusMs: 4400, opusSonnetMs: 3000, opusFlashMs: 1900 },
  defaults: { interactionsPerYear: 2_000_000 },
};

// S4 — Agentic orchestration. One nightly rebalancing run.
export const S4 = {
  planner:  { inTok: 5000, outTok: 2000 },
  review:   { inTok: 8000, outTok: 1500 },
  executor: { inTok: 4000, outTok: 1000 },
  steps: 16,
  defaults: { portfoliosPerNight: 50000, nightsPerYear: 365 },
  // Opus plans and reviews in both routes; only the repetitive executor model changes.
};

// ===== DERIVED COMPUTATIONS =====

/** S1: Cost per sprint for a given team */
export function s1Costs(devs: number, routinePct: number) {
  const totalTasks = devs * S1.tasksPerDevPerSprint;
  const routineTasks = totalTasks * routinePct;
  const complexTasks = totalTasks * (1 - routinePct);

  // Conventional Claude pairing: Sonnet for routine tasks, Opus for complex tasks.
  const allFrontier =
    routineTasks * callCost('sonnet', S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('opus', S1.complexTask.inTok, S1.complexTask.outTok);

  // Recommended: Flash for routine tasks, with Opus preserved for complex work.
  const tiered =
    routineTasks * callCost('flash',     S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('opus',      S1.complexTask.inTok, S1.complexTask.outTok);

  const allOpus =
    routineTasks * callCost('opus', S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('opus', S1.complexTask.inTok, S1.complexTask.outTok);
  const allSonnet =
    routineTasks * callCost('sonnet', S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('sonnet', S1.complexTask.inTok, S1.complexTask.outTok);
  const allFlash =
    routineTasks * callCost('flash', S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('flash', S1.complexTask.inTok, S1.complexTask.outTok);

  return { allFrontier, tiered, allOpus, allSonnet, allFlash, savings: allFrontier - tiered };
}

/** S2: Monthly cost at volume */
export function s2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = S2.query;
  const { flashLitePct, flashPct, opusPct } = S2.tieredMix;

  // Baseline: Sonnet handles routine traffic; Opus handles the complex tail.
  const allFrontier = queriesPerMonth * (
    (flashLitePct + flashPct) * callCost('sonnet', inTok, outTok) +
    opusPct * callCost('opus', inTok, outTok)
  );

  // Recommended: Flash-Lite and Flash absorb the routine 88%; Opus still handles the hard 12%.
  const tiered = queriesPerMonth * (
    flashLitePct  * callCost('flashLite',  inTok, outTok) +
    flashPct      * callCost('flash',      inTok, outTok) +
    opusPct       * callCost('opus',       inTok, outTok)
  );

  const allOpus = queriesPerMonth * callCost('opus', inTok, outTok);
  const allSonnet = queriesPerMonth * callCost('sonnet', inTok, outTok);
  const allFlash = queriesPerMonth * callCost('flash', inTok, outTok);
  const allFlashLite = queriesPerMonth * callCost('flashLite', inTok, outTok);

  return { allFrontier, tiered, allOpus, allSonnet, allFlash, allFlashLite, savings: allFrontier - tiered, savingsAnnual: (allFrontier - tiered) * 12 };
}

/** S3: Cost per interaction */
export function s3Costs() {
  const { visionInput, analysisOut, structuredOut, structuredReInput } = S3;

  const allOpus = callCost('opus', visionInput, analysisOut);
  const opusSonnet = callCost('sonnet', visionInput, structuredOut) + callCost('opus', structuredReInput, analysisOut);
  const opusFlash = callCost('flash', visionInput, structuredOut) + callCost('opus', structuredReInput, analysisOut);

  return { allOpus, opusSonnet, opusFlash };
}

/** S4: Cost per agent run */
export function s4Costs() {
  const { planner, review, executor, steps } = S4;

  // Single-model ceiling for comparison.
  const plannerOpusCost  = callCost('opus', planner.inTok, planner.outTok);
  const reviewOpusCost   = callCost('opus', review.inTok,  review.outTok);
  const executorOpusCost = steps * callCost('opus',  executor.inTok, executor.outTok);
  const executorSonnetCost = steps * callCost('sonnet', executor.inTok, executor.outTok);

  const executorFlashCost  = steps * callCost('flash', executor.inTok, executor.outTok);

  const allOpus = plannerOpusCost + executorOpusCost + reviewOpusCost;
  const opusSonnet = plannerOpusCost + executorSonnetCost + reviewOpusCost;
  const opusFlash = plannerOpusCost + executorFlashCost + reviewOpusCost;

  return {
    allOpus, opusSonnet, opusFlash,
    plannerOpusCost, reviewOpusCost, executorOpusCost,
    executorSonnetCost, executorFlashCost,
    savings: opusSonnet - opusFlash,
  };
}

/** S4: Annual cost at scale */
export function s4Annual(portfoliosPerNight: number) {
  const { allOpus, opusSonnet, opusFlash } = s4Costs();
  const scale = portfoliosPerNight * S4.defaults.nightsPerYear;
  const allOpusAnnual = allOpus * scale;
  const opusSonnetAnnual = opusSonnet * scale;
  const opusFlashAnnual = opusFlash * scale;
  return { allOpusAnnual, opusSonnetAnnual, opusFlashAnnual, savings: opusSonnetAnnual - opusFlashAnnual };
}
