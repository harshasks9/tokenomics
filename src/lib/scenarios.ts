import { callCost } from './pricing';

// S1 — SDLC. Token cost per coding task by complexity.
export const S1 = {
  routineTask:  { inTok: 40000, outTok: 10000 }, // boilerplate, tests, docs, scaffolds
  complexTask:  { inTok: 80000, outTok: 20000 }, // architecture, compliance logic, hard bugs
  defaultMix:   { routinePct: 0.75 },             // 75% routine / 25% complex
  tasksPerDevPerSprint: 50,
  defaults:     { devs: 12, sprints: 13 },        // ~6 months
  // Gemini Tiered: routine→flash, complex→geminiPro. All-frontier (competitor): everything→Claude Opus.
};

// S2 — In-app intelligence. Routine client chat query.
export const S2 = {
  query: { inTok: 2000, outTok: 400 },
  // Gemini-only tiered mix: 60% Flash-Lite, 28% Flash, 12% Gemini Pro (no competitor models in recommended path)
  tieredMix: { flashLitePct: 0.60, flashPct: 0.28, geminiProPct: 0.12 },
  defaults: { queriesPerMonth: 5_000_000 },
};

// S3 — Multimodal & latency. "What changed on my statement?"
export const S3 = {
  visionInput: 12000, analysisOut: 1000, structuredOut: 600, structuredReInput: 3000,
  lanes: {
    pureClaude: { model: 'opus'      as const, latencyMs: 3800, quality: 5, label: "Pure Claude Opus (competitor)" },
    pureGemini: { model: 'flash'     as const, latencyMs:  900, quality: 4, label: "Pure Gemini Flash" },
    hybrid:     {                              latencyMs: 2700, quality: 5, label: "Gemini Hybrid (Flash → Gemini Pro)" },
  },
  voice: { claudeMs: 4400, geminiMs: 700, hybridMs: 1900 },
  defaults: { interactionsPerYear: 2_000_000 },
};

// S4 — Agentic orchestration. One nightly rebalancing run.
export const S4 = {
  planner:  { inTok: 5000, outTok: 2000 },
  review:   { inTok: 8000, outTok: 1500 },
  executor: { inTok: 4000, outTok: 1000 },
  steps: 16,
  defaults: { portfoliosPerNight: 50000, nightsPerYear: 365 },
  // geminiTiered: Gemini Pro orchestrates, Flash executes. allOpus: competitor Claude Opus baseline.
};

// ===== DERIVED COMPUTATIONS =====

/** S1: Cost per sprint for a given team */
export function s1Costs(devs: number, routinePct: number) {
  const totalTasks = devs * S1.tasksPerDevPerSprint;
  const routineTasks = totalTasks * routinePct;
  const complexTasks = totalTasks * (1 - routinePct);

  // Competitor baseline: all Claude Opus
  const allFrontier =
    routineTasks * callCost('opus', S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('opus', S1.complexTask.inTok, S1.complexTask.outTok);

  // Recommended: Gemini Flash for routine, Gemini Pro for complex
  const tiered =
    routineTasks * callCost('flash',     S1.routineTask.inTok, S1.routineTask.outTok) +
    complexTasks * callCost('geminiPro', S1.complexTask.inTok, S1.complexTask.outTok);

  return { allFrontier, tiered, savings: allFrontier - tiered };
}

/** S2: Monthly cost at volume */
export function s2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = S2.query;
  const { flashLitePct, flashPct, geminiProPct } = S2.tieredMix;

  // Competitor baseline: all Claude Opus
  const allFrontier = queriesPerMonth * callCost('opus', inTok, outTok);

  // Recommended: Gemini-only tiered mix
  const tiered = queriesPerMonth * (
    flashLitePct  * callCost('flashLite',  inTok, outTok) +
    flashPct      * callCost('flash',      inTok, outTok) +
    geminiProPct  * callCost('geminiPro',  inTok, outTok)
  );

  return { allFrontier, tiered, savings: allFrontier - tiered, savingsAnnual: (allFrontier - tiered) * 12 };
}

/** S3: Cost per interaction */
export function s3Costs() {
  const { visionInput, analysisOut, structuredOut, structuredReInput } = S3;

  const pureClaude = callCost('opus',  visionInput, analysisOut);  // competitor baseline
  const pureGemini = callCost('flash', visionInput, analysisOut);  // fastest Gemini
  // Gemini Hybrid: Flash ingests vision + extracts structure, Gemini Pro analyzes
  const hybrid = callCost('flash', visionInput, structuredOut) + callCost('geminiPro', structuredReInput, analysisOut);

  return { pureClaude, pureGemini, hybrid };
}

/** S4: Cost per agent run */
export function s4Costs() {
  const { planner, review, executor, steps } = S4;

  // Competitor baseline: all Claude Opus
  const plannerOpusCost  = callCost('opus', planner.inTok, planner.outTok);
  const reviewOpusCost   = callCost('opus', review.inTok,  review.outTok);
  const executorOpusCost = steps * callCost('opus',  executor.inTok, executor.outTok);

  // Recommended: Gemini Pro orchestrates, Flash executes
  const plannerGeminiCost  = callCost('geminiPro', planner.inTok, planner.outTok);
  const reviewGeminiCost   = callCost('geminiPro', review.inTok,  review.outTok);
  const executorFlashCost  = steps * callCost('flash', executor.inTok, executor.outTok);

  const allOpus       = plannerOpusCost  + executorOpusCost  + reviewOpusCost;   // competitor
  const geminiTiered  = plannerGeminiCost + executorFlashCost + reviewGeminiCost; // recommended
  const hybrid        = geminiTiered; // alias kept for backwards compat

  return {
    allOpus, geminiTiered, hybrid,
    plannerOpusCost, reviewOpusCost, executorOpusCost,
    plannerGeminiCost, reviewGeminiCost, executorFlashCost,
    savings: allOpus - geminiTiered,
  };
}

/** S4: Annual cost at scale */
export function s4Annual(portfoliosPerNight: number) {
  const { allOpus, geminiTiered } = s4Costs();
  const allOpusAnnual      = allOpus      * portfoliosPerNight * S4.defaults.nightsPerYear;
  const hybridAnnual       = geminiTiered * portfoliosPerNight * S4.defaults.nightsPerYear;
  const geminiTieredAnnual = geminiTiered * portfoliosPerNight * S4.defaults.nightsPerYear;
  return { allOpusAnnual, hybridAnnual, geminiTieredAnnual, savings: allOpusAnnual - geminiTieredAnnual };
}
