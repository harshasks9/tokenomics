/**
 * Offers — playbook reference content.
 *
 * Public-construct mechanics only. Deliberately excluded, per the sensitivity
 * boundary: discount-authority figures, approval chains, deal-desk mechanics,
 * named customers, and competitor take-out framing.
 */

export interface TierRung {
  id: string;
  name: string;
  multiplier: string;
  /** Relative bar length, 0–1, proportional to the multiplier. */
  weight: number;
  colour: "gold" | "blue" | "green";
  blurb: string;
  status?: string;
}

export const TIER_LADDER: TierRung[] = [
  {
    id: "priority",
    name: "Priority PayGo",
    multiplier: "1.8x",
    weight: 1,
    colour: "gold",
    blurb: "Peak-period reliability without a reservation. Insurance pricing.",
    status: "GA",
  },
  {
    id: "standard",
    name: "Standard PayGo",
    multiplier: "1.0x",
    weight: 0.5556,
    colour: "blue",
    blurb: "The anchor. Every other price on the ladder is defined against it.",
    status: "GA",
  },
  {
    id: "pt",
    name: "Provisioned Throughput",
    multiplier: "1.0x @ 100% util",
    weight: 0.5556,
    colour: "blue",
    blurb:
      "Reserved, SLA-backed capacity. Only reaches 1.0x economics at full utilization — underutilized PT is the most expensive line on the sheet.",
    status: "GA",
  },
  {
    id: "flex",
    name: "Flex · Batch · Off-peak · Deferred",
    multiplier: "0.5x",
    weight: 0.2778,
    colour: "green",
    blurb:
      "Four doors to half price: shed priority, run in bulk, run on the US off-peak clock, or hand a multi-step agent job to the scheduler.",
    status: "Batch GA · Flex, Off-peak, Deferred preview",
  },
];

export const FSP_BRACKET = {
  label: "FSP — commit to a monthly spend",
  detail: "−10% (1Y) / −20% (3Y) · monthly enforcement · post-pay · dollar-fungible across Vertex AI 1P including PT",
};

export interface AnalogyRow {
  logistics: string;
  construct: string;
  intuition: string;
}

export const FREIGHT_ANALOGY: AnalogyRow[] = [
  {
    logistics: "Dedicated fleet on retainer",
    construct: "Provisioned Throughput",
    intuition:
      "Trucks reserved for you alone. Cheapest per mile if you keep them full; ruinous if they sit idle.",
  },
  {
    logistics: "Retainer sized to daily volume + guaranteed surge trucks",
    construct: "Buy One PT Get One PayGo",
    intuition:
      "Don't rent a fleet for Christmas week — rent for a normal Tuesday and get first call on extra trucks when you spike.",
  },
  {
    logistics: "Express courier",
    construct: "Priority PayGo (1.8x)",
    intuition: "Pay a premium; your parcel never waits, even at Christmas.",
  },
  {
    logistics: "Standard shipping",
    construct: "Standard PayGo (1.0x)",
    intuition: "The reference rate everyone knows.",
  },
  {
    logistics: "Standard shipping, booked in quiet hours",
    construct: "Off-peak PayGo (0.5x)",
    intuition:
      "Same-day service at half price because the trucks are empty anyway — and your city's rush hour happens to be the depot's quiet hours. That's JAPAC.",
  },
  {
    logistics: "Space-available freight",
    construct: "Flex (0.5x)",
    intuition: "Goes when there's room. Bumped if the truck fills.",
  },
  {
    logistics: "Overnight economy freight",
    construct: "Batch (0.5x)",
    intuition: "Pallets of non-urgent goods, delivered by morning.",
  },
  {
    logistics: "Overnight managed freight with a dispatcher",
    construct: "Deferred Agents API (0.5x)",
    intuition:
      "A dispatcher coordinates a multi-stop route over 24 hours and hands you the completed job. The dispatcher's fee — the agent harness — is still full price; only the miles are half price.",
  },
  {
    logistics: "Shipping volume agreement",
    construct: "FSP (10% / 20%)",
    intuition:
      "Commit to a monthly shipping spend, get a programmatic rebate on everything you ship, any service class. Reconciled monthly, so one slow month barely hurts.",
  },
  {
    logistics: "Master logistics contract",
    construct: "EA",
    intuition:
      "The umbrella relationship all of it sits under and draws down against.",
  },
];

export const DECISION_TREE = `START: New or expanding GenAI workload
│
├─ Q1. Is this REAL-TIME (a human or system waits for the answer)?
│
├─ NO → ASYNC BRANCH
│   ├─ Multi-step autonomous agent task (no human in loop)?
│   │     YES → DEFERRED AGENTS API (0.5x, 24h window, Gemini 3.X GA+,
│   │            global endpoint; tokens discounted, harness at std rate)
│   ├─ High-volume independent inferences (labeling, translation,
│   │   fraud, video understanding)?
│   │     YES → BATCH (0.5x)
│   └─ Single-turn, near-sync, sheddable, rate-limit-bypassing?
│         YES → FLEX (0.5x, preview, best-effort)
│
└─ YES → REAL-TIME BRANCH
    ├─ Q2. Mission-critical with stable, predictable baseload?
    │     YES → PROVISIONED THROUGHPUT
    │            ├─ Choose coverage percentile:
    │            │    p30 (cheap/risky) ─ p50 ─ p70 (costly/safe)
    │            └─ Spiky + buying 200+ GSUs?
    │                  YES → "BUY ONE PT GET ONE PAYGO":
    │                        PT @ baseload + PROTECTED PayGo for peaks
    ├─ Q3. Spiky production traffic needing low peak-period latency,
    │      but not worth a reservation?
    │     YES → PRIORITY PAYGO (1.8x)
    ├─ Q4. Standard variable workload, no strict availability SLA?
    │     YES → STANDARD PAYGO (1.0x)
    │            └─ Does traffic fall in US off-peak windows?
    │               (Wkdy 3–9 PM PT · Fri 3 PM – Sun 9 PM PT — i.e.
    │                JAPAC weekday mornings + all Saturday)
    │                  YES → OFF-PEAK PAYGO (0.5x, Gemini 3.5+,
    │                        global endpoint)
    └─ (Experimentation / unknown usage → Standard PayGo; self-serve
       teams can use the PRE-PAID WALLET)

THEN, ACROSS THE WHOLE PORTFOLIO:
│
├─ Q5. Confident recurring monthly AI baseline?
│     YES → FSP: 1Y (−10%) or 3Y (−20%), monthly enforcement,
│            post-pay, fungible across Vertex AI 1P incl. PT
│            (non-stacking; overage at on-demand rate)
└─ Q6. Broader Google Cloud relationship?
      YES → EA umbrella; FSP and all consumption draw down the EA`;

export interface Caveat {
  title: string;
  body: string;
}

export const CAVEATS: Caveat[] = [
  {
    title: "Deferred discounts tokens, not the bill",
    body: "The Deferred Agents API discount applies to LLM inference tokens only. 1P agent premiums — harness fees — remain billed at standard rates, so the blended discount on a full agent bill is always less than 50%. The h lever in the simulator exists to make that visible rather than convenient.",
  },
  {
    title: "Global endpoint only",
    body: "Off-peak PayGo and Deferred both require the global endpoint. In-country ML processing does not apply, which puts them out of reach for residency-constrained workloads. Screen each workload's residency class before modelling it at 0.5x — the regulated preset does exactly this.",
  },
  {
    title: "FSP does not stack",
    body: "The on-demand rate is the FSP ceiling. FSP draws down the EA but does not compound with EA-level discounts, so a customer already deep on an EA rate may find FSP adds little on those SKUs. In the model, the GSU line takes the better of FSP and the GCP commit discount — never both.",
  },
  {
    title: "Preview status",
    body: "Flex, Off-peak, Deferred and the FSP MVP are preview constructs. Availability dates, terms and scope can move before GA. Model with them, but do not write preview terms into a signed contract.",
  },
  {
    title: "PT utilization is the whole case",
    body: "PT only reaches 1.0x economics at 100% utilization. The percentile framework — p30 / p50 / p70 coverage — exists to force that conversation before a commitment is signed, not after. Below roughly 70% utilization the PT value case inverts.",
  },
  {
    title: "Off-peak follows a US clock",
    body: "Weekdays 3–9 PM PT and Friday 3 PM – Sunday 9 PM PT, regardless of where the customer sits. That is the JAPAC advantage — the window lands on their business morning — and equally why it is useless for a JAPAC evening consumer peak.",
  },
];

export const PLAYBOOK_INTRO =
  "You pay for urgency and certainty. Everything else is a discount for flexibility — in time, in priority, or in commitment. These constructs unbundle those three flexibilities so every workload clears at its own price.";
