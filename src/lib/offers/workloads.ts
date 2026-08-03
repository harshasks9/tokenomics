/**
 * Offers — workload archetypes.
 *
 * A seller knows what the customer is building. They do not know the customer's
 * output-token ratio, off-peak eligibility or deferred share — and asking is a
 * good way to end a conversation. So the calculator asks the question they can
 * answer, and derives the eight it needs from the answer.
 *
 * Every number here is a MODELLED DEFAULT, not a rate. They are starting points
 * chosen to be defensible for the archetype, and every one is editable in Pro.
 * They set the shape of the traffic, never the price of it.
 */

import type { PayGoMix } from "./model";

export interface Workload {
  id: string;
  label: string;
  /** One line the seller can say out loud. */
  blurb: string;
  /** Share of tokens that are output. Drives the PayGo rate and GSU sizing. */
  outputShare: number;
  /** How the PayGo remainder lands across tiers. */
  paygoMix: PayGoMix;
  /**
   * Opinionated starting point for how much belongs on reserved capacity.
   * Steady, latency-sensitive traffic earns a reservation; bursty or batch
   * traffic mostly does not.
   */
  suggestedPtShare: number;
  /** Agent-harness share within Deferred, billed at full rate. */
  harness: number;
  /** Why the split is what it is — shown under the recommendation. */
  rationale: string;
}

export const WORKLOADS: Workload[] = [
  {
    id: "assistant",
    label: "Chat / assistant",
    blurb: "Interactive, latency-sensitive, business-hours peaked.",
    outputShare: 0.3,
    paygoMix: { spike: 0.25, offPeak: 0.2, deferred: 0, batch: 0 },
    suggestedPtShare: 0.6,
    harness: 0,
    rationale:
      "Interactive traffic is steady enough to reserve and too latency-sensitive to defer, so most of it belongs on PT. The peak-hour tail is what Buy One PT Get One PayGo protects.",
  },
  {
    id: "agents",
    label: "Agentic workflows",
    blurb: "Multi-step background jobs that can finish within the day.",
    outputShare: 0.2,
    paygoMix: { spike: 0.1, offPeak: 0.15, deferred: 0.45, batch: 0.05 },
    suggestedPtShare: 0.5,
    harness: 0.15,
    rationale:
      "Agent runs tolerate latency, so a large share qualifies for Deferred at 0.5x. Watch the harness fee — it stays at full rate, so a whole agent bill never halves.",
  },
  {
    id: "batch",
    label: "Batch / async",
    blurb: "Data prep, labelling, classification — no one is waiting.",
    outputShare: 0.15,
    paygoMix: { spike: 0, offPeak: 0.1, deferred: 0.05, batch: 0.7 },
    suggestedPtShare: 0.2,
    harness: 0,
    rationale:
      "Almost none of this needs reserved capacity. Batch is already half price on demand, so a big commitment here buys very little the customer would not get anyway.",
  },
  {
    id: "coding",
    label: "Coding / developer tools",
    blurb: "High output volume, bursty, follows the working day.",
    outputShare: 0.35,
    paygoMix: { spike: 0.15, offPeak: 0.2, deferred: 0.25, batch: 0.05 },
    suggestedPtShare: 0.55,
    harness: 0.1,
    rationale:
      "Code generation is output-heavy, and output burns capacity several times faster than input — so this needs materially more GSUs per token than a chat workload.",
  },
  {
    id: "mixed",
    label: "Mixed estate",
    blurb: "A platform team fronting several use cases at once.",
    outputShare: 0.2,
    paygoMix: { spike: 0.15, offPeak: 0.3, deferred: 0.2, batch: 0.1 },
    suggestedPtShare: 0.5,
    harness: 0.15,
    rationale:
      "A blended profile. Useful for a first pass, but the placement mix is where a mixed estate really differs — open Pro once the customer can break it down.",
  },
];

export const DEFAULT_WORKLOAD_ID = "mixed";

export function findWorkload(id: string): Workload {
  return WORKLOADS.find((w) => w.id === id) ?? WORKLOADS[WORKLOADS.length - 1];
}

/** Which archetype a lever set currently looks like, if any. */
export function matchWorkload(levers: {
  outputShare: number;
  paygoMix: PayGoMix;
  harness: number;
}): Workload | null {
  const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  return (
    WORKLOADS.find(
      (w) =>
        close(w.outputShare, levers.outputShare) &&
        close(w.harness, levers.harness) &&
        close(w.paygoMix.spike, levers.paygoMix.spike) &&
        close(w.paygoMix.offPeak, levers.paygoMix.offPeak) &&
        close(w.paygoMix.deferred, levers.paygoMix.deferred) &&
        close(w.paygoMix.batch, levers.paygoMix.batch),
    ) ?? null
  );
}
