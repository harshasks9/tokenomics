/**
 * Offers — what every attribute means.
 *
 * One source of truth for the tooltip text, so the rail, the step table and the
 * playbook cannot drift apart. `anchored` marks values taken straight from the
 * commercial decks (rendered ●) versus modelled assumptions the user drives (○).
 */

export interface Info {
  label: string;
  /** One line, shown in the tooltip. */
  tooltip: string;
  anchored: boolean;
}

export const SCOPE_NOTE =
  "This models new GSU / PT capacity being ordered on an incremental commit. Existing orders are not repriced and are not represented here.";

export const LEVER_INFO = {
  gsus: {
    label: "New capacity (peak-sized GSUs)",
    tooltip:
      "How many GSUs the new order would need if sized to peak demand. This is the reference point everything else is measured against — not an existing commitment.",
    anchored: false,
  },
  uPeak: {
    label: "Utilization if peak-sized",
    tooltip:
      "How much of a peak-sized order would actually get used. Buying for the peak means paying for the troughs: at 55% utilization every consumed GSU effectively costs 1.8x list.",
    anchored: false,
  },
  uPt: {
    label: "Right-sized PT utilization",
    tooltip:
      "Utilization once PT is sized to steady state rather than peak — typically p50 coverage with protected PayGo carrying the spikes. PT only reaches 1.0x economics at 100% utilization.",
    anchored: false,
  },
  pt: {
    label: "Workload on PT",
    tooltip:
      "The share of the new workload actually placed on Provisioned Throughput. Customers rarely put everything on PT — whatever is left rides PayGo tiers at the rates below.",
    anchored: false,
  },
  spike: {
    label: "Spike traffic",
    tooltip:
      "Bursty traffic above the PT baseline. With Buy One PT Get One PayGo elected it rides protected PayGo at 1.0x; without it, it needs Priority PayGo at 1.8x.",
    anchored: false,
  },
  offPeak: {
    label: "Off-peak eligible",
    tooltip:
      "Real-time traffic that falls inside the US off-peak window — weekdays 3–9 PM PT and Friday 3 PM to Sunday 9 PM PT. Half price. Global endpoint only.",
    anchored: false,
  },
  deferred: {
    label: "Deferred agents",
    tooltip:
      "Multi-step background agent jobs that can complete within a 24-hour window. Half price on inference tokens only — the harness fee stays at full rate.",
    anchored: false,
  },
  batch: {
    label: "Batch",
    tooltip:
      "High-volume asynchronous jobs — data prep, labelling, classification. Half price, generally available, no preview caveat.",
    anchored: false,
  },
  harness: {
    label: "Harness fee share",
    tooltip:
      "The portion of the deferred-agent bill that is 1P agent premium rather than inference tokens. Deferred does not discount it, so it dilutes the 0.5x — this is why a full agent bill never lands at half price.",
    anchored: true,
  },
  term: {
    label: "GSU commitment term",
    tooltip:
      "How long the new GSU capacity is committed for. Longer terms price lower per GSU per month.",
    anchored: false,
  },
  fspRate: {
    label: "FSP term",
    tooltip:
      "Flexible Savings Plan: commit to a baseline monthly spend for 10% off on a 1-year term or 20% on 3 years. Monthly enforcement, post-pay, dollar-fungible across Vertex AI 1P including PT.",
    anchored: true,
  },
  gcpCommit: {
    label: "GCP commit discount",
    tooltip:
      "An existing Google Cloud commitment discount applied to GSU pricing. It does not stack with FSP — the GSU line takes whichever is larger, because the on-demand rate is the FSP ceiling.",
    anchored: true,
  },
  q3Discount: {
    label: "Q3 discount",
    tooltip:
      "Where the qualifying tier gives a band rather than a fixed rate, this is the discount actually offered within it.",
    anchored: false,
  },
} as const satisfies Record<string, Info>;

export const OFFER_INFO = {
  bogo: {
    label: "Buy One PT Get One PayGo",
    tooltip:
      "Size PT to the baseline and get guaranteed protected PayGo for the spikes at 1.0x, instead of a peak-sized reservation. Opt-in, and offered from 200 committed GSUs up.",
    anchored: true,
  },
  offPeak: {
    label: "Off-peak PayGo",
    tooltip:
      "Half-price real-time inference during the US off-peak window. Gemini 3.5+, global endpoint only, tokens only. Public preview.",
    anchored: true,
  },
  deferred: {
    label: "Deferred Agents API",
    tooltip:
      "Half price on inference tokens for multi-step agent jobs completing within 24 hours. Gemini 3.X GA+, global endpoint only. Agent harness fees stay at standard rates. Public preview.",
    anchored: true,
  },
  batch: {
    label: "Batch",
    tooltip:
      "Half price for non-urgent, high-volume asynchronous jobs. Generally available.",
    anchored: true,
  },
  fsp: {
    label: "Flexible Savings Plan",
    tooltip:
      "A dollar-denominated monthly spend commitment earning 10% (1Y) or 20% (3Y) off in-scope spend. Non-stacking — the on-demand rate is the ceiling — and it draws down the EA.",
    anchored: true,
  },
  q3: {
    label: "GSU Q3 offer",
    tooltip:
      "A volume incentive on the new GSU commitment. The tier is earned by committed GSU count per month, not negotiated.",
    anchored: false,
  },
} as const satisfies Record<string, Info>;

export const KPI_INFO = {
  atList: {
    label: "At list",
    tooltip:
      "What the new capacity costs if bought peak-sized at the $2,400 list rate. The reference point, not a bill anyone is paying today.",
    anchored: true,
  },
  final: {
    label: "Placed & committed",
    tooltip:
      "Monthly cost of the same new capacity once workload is placed on the right tiers and the elected commitments are applied.",
    anchored: false,
  },
  annualSave: {
    label: "Annualized saving",
    tooltip:
      "The monthly difference between the two figures above, times twelve. Illustrative modelling, not a quote.",
    anchored: false,
  },
  blendedMultiplier: {
    label: "Blended multiplier",
    tooltip:
      "The effective rate across the whole placed portfolio, as a multiple of Standard PayGo on consumed volume. Lower is better; 1.0x is the Standard PayGo anchor.",
    anchored: false,
  },
  commit: {
    label: "Incremental commit",
    tooltip:
      "The new monthly GSU spend the customer is committing to, and the total across the term. This is incremental — it sits on top of existing orders, which are unaffected.",
    anchored: false,
  },
} as const satisfies Record<string, Info>;
