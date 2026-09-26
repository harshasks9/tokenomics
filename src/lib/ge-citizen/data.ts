/**
 * GE for Citizen — content model.
 *
 * Provenance: "project" items are carried over from the project's reference
 * brief (an internal national-deployment plan; commercial terms withheld).
 * "gap" items are use cases the brief does not cover that this microsite adds.
 * All scores are editorial judgements on a 1–5 scale, not measured data.
 */

export type ActionClass = "inform" | "prepare" | "act-id" | "act-pay" | "human";

export const ACTION_CLASS: Record<ActionClass, { label: string; short: string; color: string; bg: string; rule: string }> = {
  inform: {
    label: "Inform",
    short: "Inform",
    color: "#1A73E8",
    bg: "#E8F0FE",
    rule: "Explains rules, status and options from official sources. No sign-in, no action taken.",
  },
  prepare: {
    label: "Prepare",
    short: "Prepare",
    color: "#00796B",
    bg: "#E0F2F1",
    rule: "Pre-fills forms and checks eligibility with the citizen's data. Citizen reviews everything before anything is submitted.",
  },
  "act-id": {
    label: "Act — verified identity",
    short: "Act · ID",
    color: "#7B1FA2",
    bg: "#F3E5F5",
    rule: "Submits a request on the citizen's behalf after sign-in with government identity and an explicit confirm on that specific action.",
  },
  "act-pay": {
    label: "Act — payment authorization",
    short: "Act · Pay",
    color: "#B06000",
    bg: "#FEF7E0",
    rule: "Schedules or makes a payment only after the citizen authorizes that amount through the payment provider. The agent never holds funds or a standing mandate.",
  },
  human: {
    label: "Human review",
    short: "Human",
    color: "#C5221F",
    bg: "#FCE8E6",
    rule: "The agent prepares the case; a public official makes the decision. Eligibility, approvals, penalties and disputes are never decided by the agent.",
  },
};

export type Level = "municipal" | "state" | "national";

export interface UseCase {
  id: string;
  name: string;
  example: string;
  level: Level;
  source: "project" | "gap";
  classes: ActionClass[];
  /** 1–5: how often an average household needs it. */
  frequency: number;
  /** 1–5: time, money or stress saved per use. */
  value: number;
  /** 1–5: 5 = content-only or one well-documented API. */
  ease: number;
  /** 1–5: measurable benefit to the government (revenue, avoided contacts, faster resolution). */
  benefit: number;
  systems: string[];
  metric: string;
}

export const USE_CASES: UseCase[] = [
  {
    id: "bills",
    name: "Check a bill and schedule payment",
    example: "Water bill is 38% above the last six months — agent explains the likely cause, then schedules payment for the due date once the citizen approves.",
    level: "municipal",
    source: "gap",
    classes: ["inform", "act-pay"],
    frequency: 5,
    value: 4,
    ease: 4,
    benefit: 5,
    systems: ["Billing system (read)", "Payment provider", "Identity"],
    metric: "On-time payment rate; bill-query contacts avoided",
  },
  {
    id: "reports",
    name: "Report a street or utility problem and track it",
    example: "Photo of a pothole → located, categorized and filed to the city's service-request system; the citizen gets status updates until it is closed.",
    level: "municipal",
    source: "gap",
    classes: ["prepare", "act-id"],
    frequency: 4,
    value: 4,
    ease: 4,
    benefit: 5,
    systems: ["Service-request / 311 system", "Maps & geocoding", "Identity (light)"],
    metric: "Requests filed digitally; duplicate reports merged; time to resolution",
  },
  {
    id: "reminders",
    name: "Renewals, deadlines and appointment reminders",
    example: "Business licence expires in 21 days; vehicle inspection due; clinic appointment tomorrow — with a one-tap path to act.",
    level: "municipal",
    source: "gap",
    classes: ["inform", "prepare"],
    frequency: 4,
    value: 4,
    ease: 3,
    benefit: 4,
    systems: ["Licence & registry records", "Notification channel", "Consent preferences"],
    metric: "Renewals completed before deadline; late fees avoided",
  },
  {
    id: "procedures",
    name: "Front door for procedures and requirements",
    example: "‘What do I need to register a birth?’ — one grounded answer across agencies, with documents, fees, locations and the next step.",
    level: "national",
    source: "project",
    classes: ["inform"],
    frequency: 4,
    value: 4,
    ease: 5,
    benefit: 4,
    systems: ["Official content & procedure catalogue"],
    metric: "Questions resolved without a call or visit",
  },
  {
    id: "benefits",
    name: "Eligibility and applications in the citizen's language",
    example: "An older resident asks in her home language whether she qualifies for a utility subsidy; the agent checks rules, pre-fills the application and routes it to a caseworker.",
    level: "state",
    source: "gap",
    classes: ["inform", "prepare", "human"],
    frequency: 2,
    value: 5,
    ease: 2,
    benefit: 4,
    systems: ["Benefit rules engine", "Case management", "Identity", "Translation QA"],
    metric: "Complete applications on first submission; take-up among eligible residents",
  },
  {
    id: "certificates",
    name: "Certificates and document bundles",
    example: "Job seeker needs a police clearance, background record and bank validation — requested together, tracked in one place.",
    level: "national",
    source: "project",
    classes: ["prepare", "act-id"],
    frequency: 2,
    value: 5,
    ease: 3,
    benefit: 4,
    systems: ["Civil & police registries", "Identity", "Document wallet"],
    metric: "Days from request to documents in hand",
  },
  {
    id: "permits",
    name: "Permits and local licences",
    example: "Street-food stall or home renovation permit — requirements checklist, pre-filled form, inspector booking; approval stays with the city.",
    level: "municipal",
    source: "gap",
    classes: ["prepare", "act-id", "human"],
    frequency: 1,
    value: 4,
    ease: 2,
    benefit: 4,
    systems: ["Permitting system", "Inspection scheduling", "Payment provider"],
    metric: "Incomplete submissions returned; permit cycle time",
  },
  {
    id: "health",
    name: "Health access and appointment booking",
    example: "Symptom orientation that points to the right level of care (never a diagnosis), then books the clinic slot.",
    level: "state",
    source: "project",
    classes: ["inform", "act-id"],
    frequency: 3,
    value: 5,
    ease: 2,
    benefit: 4,
    systems: ["Clinic scheduling", "Health identity", "Clinical safety review"],
    metric: "Appropriate-level-of-care referrals; no-show rate",
  },
  {
    id: "family",
    name: "Schools and transport for families",
    example: "Enrolment windows, catchment, documents and the bus route for a child moving schools — in one conversation.",
    level: "municipal",
    source: "gap",
    classes: ["inform", "prepare"],
    frequency: 2,
    value: 4,
    ease: 3,
    benefit: 3,
    systems: ["School enrolment system", "Transit data"],
    metric: "Enrolment completed on time; family contacts avoided",
  },
  {
    id: "business",
    name: "Start and run a small business",
    example: "Register a company, obtain a tax number and set up e-invoicing, with bylaws checked before submission.",
    level: "national",
    source: "project",
    classes: ["prepare", "act-id", "human"],
    frequency: 1,
    value: 5,
    ease: 2,
    benefit: 5,
    systems: ["Business registry", "Tax authority", "E-signature"],
    metric: "Days to formal registration; businesses formalized",
  },
  {
    id: "tax",
    name: "Taxpayer registration and filing guidance",
    example: "Explains what a new freelancer must file and when, and prepares the registration.",
    level: "national",
    source: "project",
    classes: ["inform", "prepare"],
    frequency: 2,
    value: 3,
    ease: 3,
    benefit: 4,
    systems: ["Tax authority content & registry"],
    metric: "On-time filing among new registrants",
  },
  {
    id: "rights",
    name: "Labour and consumer rights guidance",
    example: "Estimates severance under the published rules and explains how to file a claim; never gives a binding legal opinion.",
    level: "national",
    source: "project",
    classes: ["inform"],
    frequency: 1,
    value: 4,
    ease: 4,
    benefit: 2,
    systems: ["Labour & consumer-protection content"],
    metric: "Claims filed with complete information",
  },
  {
    id: "jobs",
    name: "Jobs, CVs and interview practice",
    example: "Builds a CV from the citizen's history and matches it to public employment listings.",
    level: "national",
    source: "project",
    classes: ["inform", "prepare"],
    frequency: 2,
    value: 3,
    ease: 4,
    benefit: 3,
    systems: ["Public employment service listings"],
    metric: "Applications submitted; placements",
  },
  {
    id: "crisis",
    name: "Urgent and crisis routing",
    example: "Any sign of risk — violence, self-harm, medical emergency — overrides every other flow and connects to the emergency or hotline service.",
    level: "national",
    source: "project",
    classes: ["inform", "human"],
    frequency: 1,
    value: 5,
    ease: 4,
    benefit: 3,
    systems: ["Emergency and hotline directories", "Warm hand-off protocol"],
    metric: "Time to hand-off; zero missed escalations in review",
  },
];

export interface Weights {
  frequency: number;
  value: number;
  ease: number;
  benefit: number;
}

export const DEFAULT_WEIGHTS: Weights = { frequency: 3, value: 2, ease: 3, benefit: 2 };

export function score(u: UseCase, w: Weights): number {
  const total = w.frequency + w.value + w.ease + w.benefit;
  if (total === 0) return 0;
  return (u.frequency * w.frequency + u.value * w.value + u.ease * w.ease + u.benefit * w.benefit) / total;
}

/* ─── Market segments ─────────────────────────────────────────────────── */

export interface Segment {
  id: string;
  name: string;
  /** 0–100 ease of deployment (digital readiness, integration complexity). */
  ease: number;
  /** 0–100 potential citizen impact (population reached, frequency, unmet need). */
  impact: number;
  /** Illustrative covered-population band. */
  popLow: number;
  popHigh: number;
  why: string;
  firstUseCases: string[];
  buyer: string;
  rollout: string;
  barriers: string[];
  wedge?: boolean;
}

export const SEGMENTS: Segment[] = [
  {
    id: "midcity",
    name: "Digitally mature mid-size cities",
    ease: 76,
    impact: 70,
    popLow: 500_000,
    popHigh: 3_000_000,
    wedge: true,
    why: "Already run online bill payment, a service-request line and a resident portal, so the highest-frequency journeys need 3–5 integrations, not a rebuild. One mayor or CIO can decide, and results show up within a budget cycle.",
    firstUseCases: ["bills", "reports", "reminders", "procedures"],
    buyer: "Mayor's office with the city CIO / digital services director; finance department co-sponsors bill payment",
    rollout: "90-day pilot on 3–4 services for an invited cohort, then city-wide; replicate to peer cities on the same service systems",
    barriers: ["Legacy billing systems without APIs", "Local procurement thresholds", "Political calendar around elections"],
  },
  {
    id: "dpi-national",
    name: "National governments with digital ID and payment rails",
    ease: 58,
    impact: 92,
    popLow: 5_000_000,
    popHigh: 60_000_000,
    why: "The project's reference deployment is this segment: a national, single-entry agent across ministries. Existing identity and payment rails remove the hardest dependencies, and one contract reaches millions. Procurement and political exposure are high.",
    firstUseCases: ["procedures", "certificates", "business", "crisis"],
    buyer: "Digital-government agency or presidency office, with the finance ministry",
    rollout: "Invite-only test cohort, then national availability; ministries onboard as sub-agents over time",
    barriers: ["Long procurement and legal review", "Cross-ministry data agreements", "High visibility of any early error"],
  },
  {
    id: "megacity",
    name: "Capital cities and megacities",
    ease: 34,
    impact: 86,
    popLow: 5_000_000,
    popHigh: 20_000_000,
    why: "Huge service volume and multilingual populations, but many departments, legacy systems and unions; integration and procurement take longer.",
    firstUseCases: ["reports", "bills", "family", "benefits"],
    buyer: "Chief digital officer, with department heads for each service",
    rollout: "Start in one district or one department, prove it, then extend",
    barriers: ["Dozens of back-office systems", "Complex procurement", "Labour-relations sensitivity around contact centres"],
  },
  {
    id: "state",
    name: "State and provincial governments",
    ease: 44,
    impact: 78,
    popLow: 3_000_000,
    popHigh: 50_000_000,
    why: "Own high-value services — health access, driver and vehicle services, benefits — but systems are fragmented and eligibility journeys need human review.",
    firstUseCases: ["benefits", "health", "reminders", "procedures"],
    buyer: "State CIO or department of human services",
    rollout: "One agency first (e.g., vehicle services), then a shared state front door",
    barriers: ["Case-management integration", "Eligibility decisions require human review", "Federal/state data rules"],
  },
  {
    id: "utility",
    name: "Municipal utility and city-services bundles",
    ease: 82,
    impact: 48,
    popLow: 200_000,
    popHigh: 2_000_000,
    why: "Water, waste and power billing is frequent and already digital, so it is easy to integrate — but the scope is narrow, so impact stays medium unless bundled with city services.",
    firstUseCases: ["bills", "reports", "reminders"],
    buyer: "Utility commercial director with the city",
    rollout: "Bill check and outage reporting first; extend into city services under the same tenant",
    barriers: ["Utility is often a separate legal entity", "Narrow mandate limits scope"],
  },
  {
    id: "consortium",
    name: "Municipal associations and shared-service consortia",
    ease: 56,
    impact: 60,
    popLow: 1_000_000,
    popHigh: 10_000_000,
    why: "Pools many towns into one procurement and one integration pattern — the route to small municipalities that cannot justify fixed costs alone.",
    firstUseCases: ["procedures", "reports", "reminders"],
    buyer: "Association executive board or shared-services agency",
    rollout: "Template deployment for member towns on common systems",
    barriers: ["Member towns run different back-office systems", "Governance across many councils"],
  },
  {
    id: "town",
    name: "Small municipalities on their own",
    ease: 50,
    impact: 24,
    popLow: 20_000,
    popHigh: 200_000,
    why: "Simple procurement but thin IT capacity and too few residents for a per-citizen price to cover fixed costs (see the calculator's small-town preset).",
    firstUseCases: ["procedures", "reports"],
    buyer: "Town manager or council",
    rollout: "Join through a consortium rather than contracting directly",
    barriers: ["Fixed costs exceed $2 × residents", "Limited integration staff"],
  },
  {
    id: "national-nodpi",
    name: "National governments without digital ID or payment rails",
    ease: 16,
    impact: 82,
    popLow: 5_000_000,
    popHigh: 100_000_000,
    why: "High unmet need, but without identity and payment rails the agent is limited to information — the ‘act’ journeys that justify funding cannot run yet.",
    firstUseCases: ["procedures", "crisis", "jobs"],
    buyer: "Digital-transformation ministry, often with development-bank funding",
    rollout: "Information-only launch alongside the country's digital-ID programme",
    barriers: ["No verified identity", "No payment rail", "Connectivity and device access"],
  },
];

/* ─── Day in the life ─────────────────────────────────────────────────── */

export interface JourneyStep {
  time: string;
  title: string;
  trigger: string;
  citizen: string;
  agent: string;
  permission: string;
  classes: ActionClass[];
  systems: string[];
  outcome: string;
}

export const PERSONA = {
  name: "Maria",
  sketch: "44, runs a small bakery, two school-age children, cares for her mother who prefers to speak her home language",
};

export const JOURNEY: JourneyStep[] = [
  {
    time: "07:40",
    title: "The water bill looks wrong",
    trigger: "Bill notification from the city utility",
    citizen: "Why is this bill so high?",
    agent: "This bill is 38% above your six-month average. Consumption, not the tariff, went up — that pattern often means a leak. I can book a free leak check, and schedule payment of $64.20 for the due date, 14 May. Shall I schedule it?",
    permission: "Maria approves the amount and date in her payment provider's own screen. The agent receives a confirmation, not her card details.",
    classes: ["inform", "act-pay"],
    systems: ["Utility billing (read)", "Payment provider", "Identity"],
    outcome: "Payment scheduled, leak inspection requested, one call to the utility avoided",
  },
  {
    time: "09:15",
    title: "A pothole outside the bakery",
    trigger: "Maria sends a photo",
    citizen: "This is getting dangerous for the delivery bikes.",
    agent: "I've filed this as a road-surface defect at 12 Calle Norte. Two neighbours reported the same spot yesterday, so I've added your photo to that report instead of opening a new one. Reference RD-20418. I'll tell you when a crew is scheduled.",
    permission: "Filing uses Maria's verified account so the city can reply. She confirms location and category before submission.",
    classes: ["prepare", "act-id"],
    systems: ["Service-request system", "Maps", "Identity"],
    outcome: "Duplicate merged, report tracked to closure",
  },
  {
    time: "12:30",
    title: "Food-business licence renewal",
    trigger: "Proactive reminder 21 days before expiry",
    citizen: "Can you renew it?",
    agent: "I've pre-filled the renewal from last year's licence. Two things changed: the fee is now $85, and the city needs a new fire-safety certificate. Here's the checklist. When you have the certificate, review the form and I'll submit it.",
    permission: "Submission requires sign-in with national ID and an explicit confirm. Approval stays with the licensing officer.",
    classes: ["inform", "prepare", "human"],
    systems: ["Licensing system", "Identity", "Payment provider"],
    outcome: "Renewal ready, no late fee, complete on first submission",
  },
  {
    time: "16:10",
    title: "Her son changes school",
    trigger: "Maria asks",
    citizen: "What do I need to move Lucas to the school near our new flat, and how does he get there?",
    agent: "Enrolment for mid-year transfers closes on 30 May. You'll need proof of address and his last report card — you already have both in your document wallet. Route 14 stops two blocks from the school; the student pass is free with enrolment.",
    permission: "Information only. Enrolment itself happens in the school system with Maria's confirmation.",
    classes: ["inform", "prepare"],
    systems: ["School enrolment", "Transit data", "Document wallet"],
    outcome: "Family knows the deadline and documents; no visit to the district office",
  },
  {
    time: "19:00",
    title: "Her mother's utility subsidy",
    trigger: "Her mother asks by voice, in her home language",
    citizen: "¿Puedo recibir ayuda con la factura de la luz?",
    agent: "(In her language) Based on what you've told me, you may qualify for the senior utility subsidy. I've prepared the application with your details. A caseworker makes the final decision — usually within 10 working days. Shall I send it?",
    permission: "The agent does not decide eligibility. A caseworker reviews and decides; the citizen can ask for a human at any point.",
    classes: ["inform", "prepare", "human"],
    systems: ["Benefit rules", "Case management", "Identity", "Translation"],
    outcome: "Complete application routed to a caseworker",
  },
  {
    time: "21:05",
    title: "Status update",
    trigger: "City system closes the loop",
    citizen: "—",
    agent: "Update on RD-20418: a crew is scheduled for Thursday morning. Your water payment is set for 14 May. Your licence renewal is waiting for the fire-safety certificate.",
    permission: "Notifications follow the channels and quiet hours Maria chose.",
    classes: ["inform"],
    systems: ["Service-request system", "Notification service"],
    outcome: "Five government tasks handled in one day without a queue or a call",
  },
];
