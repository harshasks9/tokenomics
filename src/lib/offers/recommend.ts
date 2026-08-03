/**
 * Offers — the opinion.
 *
 * A calculator that only computes makes the seller do the thinking. This picks
 * a position: which term, which concessions, and what to say out loud. The
 * seller can overrule any of it, but they should never face a blank form.
 *
 * Every rule here is a commercial judgement, not a published policy. They are
 * in one file, named, so they can be argued with and changed.
 */

import {
  BOGO_MIN_GSUS,
  type Levers,
  type ModelResult,
  Q3_TIERS,
  computeModel,
} from "./model";
import { findWorkload } from "./workloads";

export interface Recommendation {
  /** The levers this recommends, ready to apply. */
  levers: Levers;
  /** One sentence a seller can say in the meeting. */
  headline: string;
  /** Why each part of the shape was chosen. */
  reasons: string[];
  /** Things to check before this goes in front of a customer. */
  watchOuts: string[];
}

/**
 * The house position on a scenario.
 *
 * Term: a year, unless the customer is too small to clear the Q3 floor — a
 * long commitment on a volume that earns nothing is a hard sell.
 * Concessions: everything the volume qualifies for. The point of the tool is to
 * show the whole ceiling; the seller decides what to actually put on the table.
 */
export function recommend(base: Levers, workloadId: string): Recommendation {
  const workload = findWorkload(workloadId);

  const shaped: Levers = {
    ...base,
    outputShare: workload.outputShare,
    paygoMix: workload.paygoMix,
    harness: workload.harness,
    ptShare: workload.suggestedPtShare,
  };

  // Size it once on the workload's suggested split to see which tier it lands
  // in, then choose the commercial shape from that.
  const probe = computeModel({ ...shaped, term: "1y" });
  const ptGsus = probe.traffic.ptGsus;
  const floor = Q3_TIERS[Q3_TIERS.length - 1].minGsus;
  const clearsQ3 = ptGsus >= floor;

  const levers: Levers = {
    ...shaped,
    term: clearsQ3 ? "1y" : "3m",
    fspRate: 0.2,
    offers: {
      bogo: ptGsus >= BOGO_MIN_GSUS && workload.paygoMix.spike > 0,
      offPeak: workload.paygoMix.offPeak > 0,
      deferred: workload.paygoMix.deferred > 0,
      batch: workload.paygoMix.batch > 0,
      fsp: true,
      q3: clearsQ3,
    },
  };

  const result = computeModel(levers);
  const reasons: string[] = [workload.rationale];
  const watchOuts: string[] = [];

  if (clearsQ3) {
    reasons.push(
      `${ptGsus.toLocaleString("en-US")} GSUs clears the ${result.q3Tier?.label ?? "Q3"} tier, so the Q3 discount and credits are on the table. A 1-year term prices the GSU lower again.`,
    );
  } else {
    const short = floor - ptGsus;
    reasons.push(
      `At ${ptGsus.toLocaleString("en-US")} GSUs this is ${short.toLocaleString("en-US")} short of the ${floor} GSU Q3 floor, so a 3-month term keeps the customer flexible rather than locking them into a year that earns no volume incentive.`,
    );
    watchOuts.push(
      `${short.toLocaleString("en-US")} more ${short === 1 ? "GSU" : "GSUs"} on PT would unlock the Q3 offer — worth testing whether more of the workload can be committed.`,
    );
  }

  if (!levers.offers.bogo && ptGsus >= BOGO_MIN_GSUS) {
    reasons.push(
      "No spike traffic in this profile, so Buy One PT Get One PayGo has nothing to protect and is left off.",
    );
  }
  if (ptGsus > 0 && ptGsus < BOGO_MIN_GSUS) {
    watchOuts.push(
      `Below ${BOGO_MIN_GSUS} PT GSUs, so Buy One PT Get One PayGo does not apply.`,
    );
  }
  if (!result.sizing.throughputIsPublished) {
    watchOuts.push(
      `Throughput per GSU for ${result.sizing.modelName} is a modelled assumption, not a published rate — confirm the GSU count before quoting it.`,
    );
  }
  // Only worth raising when the slack is both proportionally and absolutely
  // material — "you will waste 1 GSU" is noise, not advice.
  const idle = Math.round(result.traffic.idleGsus);
  if (idle >= 10 && result.traffic.idleGsus > result.sizing.ptDemandGsus * 0.15) {
    watchOuts.push(
      `At ${Math.round(base.ptUtilization * 100)}% utilization the customer buys ${idle.toLocaleString("en-US")} GSUs they will not use. Right-sizing is worth more than most concessions.`,
    );
  }

  const headline =
    result.reference > 0
      ? `Commit ${ptGsus.toLocaleString("en-US")} ${ptGsus === 1 ? "GSU" : "GSUs"} on a ${levers.term === "1y" ? "1-year" : levers.term === "3m" ? "3-month" : "1-month"} term and this lands at $${Math.round(result.final).toLocaleString("en-US")}K a month — ${Math.round(result.savingPct * 100)}% below the $${Math.round(result.reference).toLocaleString("en-US")}K it would cost at standard rates.`
      : "Enter what the customer expects to spend and this will size the offer.";

  return { levers, headline, reasons, watchOuts };
}

/** Compact talking points for the customer conversation. */
export function talkingPoints(result: ModelResult): string[] {
  const points: string[] = [];
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const k = (n: number) => `$${Math.round(n).toLocaleString("en-US")}K`;

  const placement = result.attribution.placement + result.attribution.bogo;
  if (placement > 0.5) {
    points.push(
      `${k(placement)}/mo of the saving comes from putting work on the right tier — before a single discount is negotiated.`,
    );
  }
  if (result.attribution.fsp > 0.5) {
    points.push(
      `The Flexible Savings Plan takes another ${k(result.attribution.fsp)}/mo. It is dollar-denominated, so it follows them across models.`,
    );
  }
  if (result.attribution.q3 > 0.5) {
    points.push(
      `The Q3 offer adds ${k(result.attribution.q3)}/mo in discount and credits on the committed line.`,
    );
  }
  points.push(
    `Blended, they end up at ${result.blendedMultiplier.toFixed(2)}x of standard PayGo — ${pct(result.savingPct)} off, or ${`$${(result.annualSave / 1000).toFixed(2)}M`} across the year.`,
  );
  return points;
}
