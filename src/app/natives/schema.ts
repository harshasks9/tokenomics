// Agentic Communications Opportunity — India Digital Natives
//
// Evidence standard: `fact` = drawn from company filings, earnings commentary,
// official announcements, or reputable financial press. `inference` = a reasoned
// opportunity hypothesis built on those facts. Internal volumes, costs,
// architecture, and processes are NEVER stated as fact — where a number is
// needed it is labelled an inference and its reasoning is given.

export type Confidence = "fact" | "inference";

export type Source = { label: string; url: string };

export type Audience = "customer" | "merchant" | "partner" | "employee";
export type Lifecycle =
  | "acquire" | "convert" | "onboard" | "transact" | "service"
  | "retain" | "collect" | "upsell" | "winback";
export type EconType = "revenue" | "cost" | "both";

export const AUDIENCE_META: Record<Audience, { label: string; color: string }> = {
  customer: { label: "Customer", color: "#1A73E8" },
  merchant: { label: "Merchant / seller", color: "#188038" },
  partner: { label: "Delivery / service partner", color: "#D97706" },
  employee: { label: "Employee", color: "#7C3AED" },
};

export const ECON_META: Record<EconType, { label: string; color: string }> = {
  revenue: { label: "Revenue creation", color: "#188038" },
  cost: { label: "Cost reduction", color: "#1A73E8" },
  both: { label: "Revenue + cost", color: "#7C3AED" },
};

export const LIFECYCLE_ORDER: Lifecycle[] = [
  "acquire", "convert", "onboard", "transact", "service", "retain", "collect", "upsell", "winback",
];

export type UseCase = {
  id: string;
  rank: 1 | 2 | 3 | 4 | 5;      // 1 = hero use case
  name: string;                  // specific workflow, never "AI customer support"
  audience: Audience;
  lifecycle: Lifecycle;
  econ: EconType;
  current: string;               // what happens today + where the friction is
  agentic: string;               // what an autonomous agent actually does
  trigger: string;               // the event that starts the agent
  systems: string[];             // data / enterprise systems required
  channels: string[];            // voice, WhatsApp, chat, email, app, multimodal
  outcomes: string[];            // 2-3 metrics that could improve
  whyThisCompany: string;        // why this matters to THIS operating model
  scores: {
    economic: 1 | 2 | 3 | 4 | 5;
    volume: 1 | 2 | 3 | 4 | 5;
    suitability: 1 | 2 | 3 | 4 | 5;
    ease: 1 | 2 | 3 | 4 | 5;
    differentiation: 1 | 2 | 3 | 4 | 5;
  };
};

export type Company = {
  slug: string;
  name: string;
  shortName: string;
  category: string;              // display label, e.g. "Quick commerce & food delivery"
  group: GroupId;
  color: string;
  oneLiner: string;              // one sentence on the business model
  whyTop10: string;              // why it belongs in the top 10
  snapshot: { label: string; value: string; kind: Confidence }[]; // 4-5 scale markers
  whyItMatters: string;          // the communications thesis for this account
  context: { text: string; kind: Confidence; source?: number }[]; // researched facts + inferences
  sources: Source[];
  useCases: UseCase[];           // exactly 5, ranked
  openers: string[];             // 2-3 seller hypotheses
  discovery: string[];           // 3 discovery questions
  pilot: { workflow: string; weeks: string; why: string };
};

export type GroupId =
  | "food-quick-commerce" | "fintech" | "commerce" | "travel" | "mobility" | "services" | "investing";

export const GROUP_META: Record<GroupId, { label: string; color: string; blurb: string }> = {
  "food-quick-commerce": { label: "Food & quick commerce", color: "#E8710A", blurb: "Three-sided marketplaces where every minute of delay is a refund event" },
  fintech: { label: "Payments & fintech", color: "#1A73E8", blurb: "Transaction-failure and merchant-servicing volume at national scale" },
  commerce: { label: "Commerce & marketplaces", color: "#188038", blurb: "Discovery, returns, and seller economics across tier-2+ India" },
  travel: { label: "Travel", color: "#7C3AED", blurb: "Disruption is the product — recovery quality decides the brand" },
  mobility: { label: "Mobility", color: "#00838F", blurb: "Supply-side partner communications dominate the interaction mix" },
  services: { label: "Home services", color: "#C2185B", blurb: "Service professionals are the product; coordination is the workflow" },
  investing: { label: "Retail investing", color: "#B3261E", blurb: "Regulated conversations where advice boundaries are hard limits" },
};

// ─── Scoring ────────────────────────────────────────────────────────────────
// Weighted so that economic impact and agentic suitability matter most, and
// ease of deployment cannot alone carry a low-value idea to the top.

export const SCORE_WEIGHTS = {
  economic: 0.28,
  volume: 0.2,
  suitability: 0.22,
  ease: 0.14,
  differentiation: 0.16,
} as const;

export const SCORE_LABELS: { key: keyof UseCase["scores"]; label: string; hint: string }[] = [
  { key: "economic", label: "Economic impact", hint: "Size of the revenue created or cost removed" },
  { key: "volume", label: "Interaction volume", hint: "How many interactions this workflow touches" },
  { key: "suitability", label: "Agentic suitability", hint: "Can an agent reason and complete the outcome, not just answer?" },
  { key: "ease", label: "Ease of deployment", hint: "System access, data readiness, and risk of autonomous action" },
  { key: "differentiation", label: "Strategic differentiation", hint: "Does this change competitive position, or just trim cost?" },
];

export function opportunityScore(u: UseCase): number {
  const s = u.scores;
  const raw =
    s.economic * SCORE_WEIGHTS.economic +
    s.volume * SCORE_WEIGHTS.volume +
    s.suitability * SCORE_WEIGHTS.suitability +
    s.ease * SCORE_WEIGHTS.ease +
    s.differentiation * SCORE_WEIGHTS.differentiation;
  return Math.round((raw / 5) * 100);
}

// Impact = value + volume + differentiation. Feasibility = ease + suitability.
export function impactScore(u: UseCase): number {
  const s = u.scores;
  return (s.economic * 0.45 + s.volume * 0.3 + s.differentiation * 0.25);
}
export function feasibilityScore(u: UseCase): number {
  const s = u.scores;
  return (s.ease * 0.6 + s.suitability * 0.4);
}

export function companyScore(c: Company): number {
  return Math.round(c.useCases.reduce((a, u) => a + opportunityScore(u), 0) / c.useCases.length);
}

// ─── Archetypes (cross-company synthesis) ───────────────────────────────────

export type Applicability = "strong" | "medium" | "low";

export const APPLIC_META: Record<Applicability, { label: string; color: string; dot: number }> = {
  strong: { label: "Strong fit", color: "#188038", dot: 3 },
  medium: { label: "Partial fit", color: "#D97706", dot: 2 },
  low: { label: "Limited fit", color: "#BDC1C6", dot: 1 },
};

export type Archetype = {
  id: string;
  name: string;
  color: string;
  promise: string;             // one line — what the agent does
  trigger: string;
  workflow: string[];          // 5-6 concrete steps
  channels: string[];
  systems: string[];
  kpis: string[];
  cx: string;                  // example customer experience, written as a scene
  whyNow: string;              // why modern multimodal/agentic AI makes this possible now
  econ: EconType;
  applies: Record<string, Applicability>; // company slug -> applicability
};

export type Insight = { stat: string; label: string; detail: string };
