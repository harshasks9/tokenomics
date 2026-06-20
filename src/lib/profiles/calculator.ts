import { callCost } from "@/lib/pricing";
import type { CustomerProfile } from "./types";

const TASKS_PER_DEV_PER_SPRINT = 50;
const ROUTINE  = { inTok: 40_000, outTok: 10_000 };
const MID      = { inTok: 60_000, outTok: 15_000 };
const COMPLEX  = { inTok: 80_000, outTok: 20_000 };
const PLANNER  = { inTok: 6_000,  outTok: 2_000  };
const EXECUTOR = { inTok: 4_000,  outTok: 1_000  };
const REVIEWER = { inTok: 9_000,  outTok: 2_000  };

export function buildCosts(profile: CustomerProfile, devs: number, sprints: number) {
  const n = devs * TASKS_PER_DEV_PER_SPRINT;
  const { flashLitePct, flashPct, opusPct } = profile.build.mix;

  const allOpusPerSprint = n * (
    flashLitePct * callCost("opus",      ROUTINE.inTok,  ROUTINE.outTok)  +
    flashPct     * callCost("opus",      MID.inTok,      MID.outTok)      +
    opusPct      * callCost("opus",      COMPLEX.inTok,  COMPLEX.outTok)
  );

  const tieredPerSprint = n * (
    flashLitePct * callCost("flashLite", ROUTINE.inTok,  ROUTINE.outTok)  +
    flashPct     * callCost("flash",     MID.inTok,      MID.outTok)      +
    opusPct      * callCost("opus",      COMPLEX.inTok,  COMPLEX.outTok)
  );

  return {
    allOpusPerSprint, allOpusTotal: allOpusPerSprint * sprints,
    tieredPerSprint,  tieredTotal:  tieredPerSprint  * sprints,
  };
}

export function runCosts(profile: CustomerProfile, queriesPerMonth: number) {
  const { inTok, outTok } = profile.run.querySize;
  const { flashLitePct, flashPct, opusPct } = profile.run.mix;

  const perQueryOpus      = callCost("opus",      inTok, outTok);
  const perQueryFlashLite = callCost("flashLite", inTok, outTok);
  const perQueryFlash     = callCost("flash",     inTok, outTok);
  const perQueryTiered    =
    flashLitePct * perQueryFlashLite +
    flashPct     * perQueryFlash     +
    opusPct      * perQueryOpus;

  return {
    allOpus:          queriesPerMonth * perQueryOpus,
    tiered:           queriesPerMonth * perQueryTiered,
    allOpusAnnual:    queriesPerMonth * perQueryOpus   * 12,
    tieredAnnual:     queriesPerMonth * perQueryTiered * 12,
    perQueryOpus, perQueryFlashLite, perQueryFlash, perQueryTiered,
  };
}

export function agentCosts(profile: CustomerProfile) {
  const plannerCost        = callCost("opus",  PLANNER.inTok,  PLANNER.outTok);
  const reviewerCost       = callCost("opus",  REVIEWER.inTok, REVIEWER.outTok);
  const executorCostOpus   = profile.agent.executorSteps * callCost("opus",  EXECUTOR.inTok, EXECUTOR.outTok);
  const executorCostTiered = profile.agent.executorSteps * callCost("flash", EXECUTOR.inTok, EXECUTOR.outTok);

  return {
    allOpus:  plannerCost + executorCostOpus   + reviewerCost,
    tiered:   plannerCost + executorCostTiered + reviewerCost,
    plannerCost, reviewerCost, executorCostOpus, executorCostTiered,
  };
}

export function agentAnnual(profile: CustomerProfile, volume: number, cfg: "allOpus" | "tiered") {
  return agentCosts(profile)[cfg] * volume * profile.agent.runsPerDay * 365;
}
