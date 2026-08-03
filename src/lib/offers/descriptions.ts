/**
 * Offers — what every attribute means.
 *
 * One source of truth for tooltip text, so the rail, the step table and the
 * playbook cannot drift apart. `anchored` marks values taken straight from the
 * commercial decks (rendered ●) versus modelled assumptions the user drives (○).
 */

export interface Info {
  label: string;
  tooltip: string;
  anchored: boolean;
}

export const SCOPE_NOTE =
  "Everything here is incremental new workload — the PT capacity and PayGo demand being added. Nothing on this page reprices or describes what the customer already runs. Start with the demand and the model; the GSU count is worked out from them.";

export const GOAL_NOTE =
  "How much of that incremental spend the programmatic options take back.";

export const LEVER_INFO = {
  tpm: {
    label: "Demand",
    tooltip:
      "Step one: what the customer is actually asking for, in tokens per minute, for the model selected below. Everything else follows from this — GSUs are worked out from it, never typed in, because the same traffic needs a different reservation on a Flash model than on a Pro one.",
    anchored: false,
  },
  ptShare: {
    label: "Share on Provisioned Throughput",
    tooltip:
      "Step two: how much of that demand is served from reserved capacity. The remainder rides PayGo tiers. This is also what sets Buy One PT Get One PayGo eligibility and the Q3 tier, since both key off the committed GSU count.",
    anchored: false,
  },
  outputShare: {
    label: "Output share of tokens",
    tooltip:
      "How much of the traffic is output rather than input. Output bills several times higher than input, so this moves the blended PayGo rate materially — a chat workload and an extraction workload on the same TPM do not cost the same.",
    anchored: false,
  },
  ptUtilization: {
    label: "PT utilization",
    tooltip:
      "How full that reserved capacity actually runs. PT only reaches 1.0x economics at 100%; anything below is capacity you bought and did not use.",
    anchored: true,
  },
  spike: {
    label: "Spike / peak-sensitive",
    tooltip:
      "PayGo traffic that needs peak-period reliability. Without Buy One PT Get One PayGo it needs Priority PayGo at 1.8x; with it, protected PayGo carries it at 1.0x.",
    anchored: false,
  },
  offPeak: {
    label: "Off-peak eligible",
    tooltip:
      "Real-time traffic falling inside the US off-peak window — weekdays 3–9 PM PT, Friday 3 PM to Sunday 9 PM PT. Half price. Global endpoint only.",
    anchored: false,
  },
  deferred: {
    label: "Deferred agents",
    tooltip:
      "Multi-step background agent jobs that can complete within 24 hours. Half price on inference tokens only — the agent harness fee stays at full rate.",
    anchored: false,
  },
  batch: {
    label: "Batch",
    tooltip:
      "High-volume asynchronous jobs — data prep, labelling, classification. Half price, generally available.",
    anchored: false,
  },
  harness: {
    label: "Harness fee share",
    tooltip:
      "The portion of a deferred-agent bill that is 1P agent premium rather than inference tokens. Deferred does not discount it, so it dilutes the 0.5x — this is why a full agent bill never lands at half price.",
    anchored: true,
  },
  tpmPerGsu: {
    label: "Tokens per minute per GSU (fallback)",
    tooltip:
      "Used ONLY for models with no published throughput-per-GSU figure. Where Google publishes one, this slider does nothing and the published rate applies. Set it to the real figure from the burndown table before quoting a GSU count for an unpublished model.",
    anchored: false,
  },
  term: {
    label: "GSU commitment term",
    tooltip:
      "How long the new PT capacity is committed for. Longer terms price lower per GSU per month.",
    anchored: false,
  },
  fspRate: {
    label: "FSP term",
    tooltip:
      "Commit to a baseline monthly spend for 10% off on a 1-year term or 20% on 3 years. Monthly enforcement, post-pay, dollar-fungible across Vertex AI 1P including PT.",
    anchored: true,
  },
  gcpCommit: {
    label: "GCP commit discount",
    tooltip:
      "An existing Google Cloud commitment discount applied to GSU pricing. It does not stack with FSP — the PT line takes whichever is larger, because the on-demand rate is the FSP ceiling.",
    anchored: true,
  },
  q3Discount: {
    label: "Q3 discount",
    tooltip:
      "Where the qualifying tier gives a band rather than a fixed rate, this is the discount actually offered within it.",
    anchored: false,
  },
  modelId: {
    label: "Model",
    tooltip:
      "Which model the token-economics comparison uses. GSU capacity pricing is the same whichever you pick — this drives the per-token view, not the PT line.",
    anchored: true,
  },
} as const satisfies Record<string, Info>;

export const OFFER_INFO = {
  bogo: {
    label: "Buy One PT Get One PayGo",
    tooltip:
      "Size PT to the baseline and get guaranteed protected PayGo for the spikes at 1.0x instead of Priority PayGo at 1.8x. Opt-in, and offered from 200 PT GSUs up.",
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
      "Half price on inference tokens for multi-step agent jobs completing within 24 hours. Gemini 3.X GA+, global endpoint only. Harness fees stay at standard rates. Public preview.",
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
      "A volume incentive on the new PT commitment. The tier is earned by PT GSUs per month, not negotiated.",
    anchored: false,
  },
} as const satisfies Record<string, Info>;

export const KPI_INFO = {
  reference: {
    label: "Incremental spend",
    tooltip:
      "What this new workload costs at standard rates with nothing elected: PT at the list GSU price, PayGo per tier, spikes on Priority PayGo. The baseline everything else is measured against.",
    anchored: true,
  },
  final: {
    label: "With programs",
    tooltip:
      "The same incremental workload once the elected programs are applied. The gap between this and incremental spend is the whole point of the page.",
    anchored: false,
  },
  saved: {
    label: "Saved",
    tooltip:
      "Monthly and annualized reduction against the incremental spend baseline. Illustrative modelling, not a quote.",
    anchored: false,
  },
  commit: {
    label: "Incremental commit",
    tooltip:
      "The new monthly PT spend being committed to, and the total across the term. Incremental — it sits on top of existing orders, which are unaffected.",
    anchored: false,
  },
  blendedMultiplier: {
    label: "Blended multiplier",
    tooltip:
      "The effective rate across all delivered volume, as a multiple of Standard PayGo. Lower is better; 1.0x is the Standard PayGo anchor.",
    anchored: false,
  },
} as const satisfies Record<string, Info>;
