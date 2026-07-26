// APJ account-based experience — shared schema, packages, and flow templates.
// The account universe is a RESEARCH-BASED PRIORITY LIST assembled from public
// information — it is NOT an authoritative list of top Google Cloud customers.
// Confidence labels: "verified" (widely-reported public fact), "inference"
// (reasoned from public information), "hypothesis" (seller hypothesis to
// validate with the account team).

import type { FlowStep, FlowMetric } from "../flows";

export type Confidence = "verified" | "inference" | "hypothesis";

export type MarketId =
  | "India" | "Indonesia" | "Philippines" | "Vietnam" | "Thailand" | "Malaysia"
  | "SEA-regional" | "Japan" | "Korea" | "Taiwan" | "Hong Kong" | "ANZ";

// Qualified profile — a real, named organization in the priority universe that
// has passed screening (relevance + build-vs-buy hypothesis) but has NOT yet
// received the deep research treatment. Never used in front of a customer
// without promotion to a deep pitch first.
export type ProfileAccount = {
  slug: string;
  name: string;
  market: MarketId;
  vertical: string;
  tier: 1 | 2 | 3;
  buildVsBuy: "buy-led" | "partner-led" | "co-build";
  whyRelevant: string;    // 2-3 SPECIFIC sentences: real business model + why communications-heavy + why unlikely to build
  entryWorkflow: string;
  packageRec: "launch" | "scale" | "transform";
  languages: string[];
  priorityScore: number;  // 1-100 screening score
  validate: string;       // the single most important thing to validate
};

export type BuildVsBuy = "buy-led" | "partner-led" | "co-build" | "build-led";

export const BVB_META: Record<BuildVsBuy, { label: string; color: string; desc: string }> = {
  "buy-led": { label: "Buy-led", color: "#188038", desc: "Limited internal ability or appetite to build the core platform — strong candidate for the packaged solution" },
  "partner-led": { label: "Partner-led", color: "#1A73E8", desc: "Technically capable but needs industry workflows, integration, acceleration, or managed operations" },
  "co-build": { label: "Co-build", color: "#7C3AED", desc: "Strong internal engineering — sell infrastructure, models, governance, or selected capabilities" },
  "build-led": { label: "Build-led", color: "#B3261E", desc: "Likely to build and operate internally — pursue only for a specific gap" },
};

export type EarningsSignal = {
  signal: string;      // what management said / reported
  source: string;      // e.g. "Q2 FY26 earnings call", "FY25 annual report" — no fabricated quotes or URLs
  date: string;        // approximate, e.g. "Oct 2025"
  implication: string; // exact GTM implication
  kind: "fact" | "inference" | "hypothesis";
};

export type ExcludedAccount = {
  name: string;
  market: string;
  vertical: string;
  classification: BuildVsBuy;
  rationale: string;   // evidence for deprioritization
  evidence: string;    // public signals: internal platforms, AI teams, launched assistants, build-first statements
  pursueOnlyIf?: string;
};

export type AccountWorkflow = {
  name: string;
  why: string;        // why it matters to THIS customer
  friction: string;   // current likely friction
  outcome: string;    // business outcome
  channels: string[];
  systems: string[];
  value: 1 | 2 | 3;
  complexity: 1 | 2 | 3;
  speed: 1 | 2 | 3;   // 3 = fastest to value
};

export type Account = {
  slug: string;
  name: string;
  market: MarketId;
  vertical: string;   // e.g. "Banking", "NBFC / lending", "Telecom", "eCommerce", "Airline", ...
  tier: 1 | 2 | 3;
  tierWhy: string;
  heroHeadline: string;   // must reference the customer's actual operating model
  proposition: string;    // one-sentence strategic proposition
  entryWorkflow: string;  // label of the recommended entry workflow
  outcome: string;        // expected business outcome of the entry workflow
  packageRec: "launch" | "scale" | "transform";
  packageWhy: string;
  understand: { text: string; kind: Confidence }[]; // 4-6 bullets of real account research
  gcpNote?: string;       // ONLY publicly-reported Google Cloud relevance; omit otherwise
  workflows: AccountWorkflow[]; // 2-5
  languages: string[];
  flowTemplate: FlowTemplateId;
  scenario: string;       // one-line customer-specific scenario for the animation
  volumeMonthly: number;  // benchmark-scale default (label: seller assumption)
  costPerInteraction: number; // USD default (label: benchmark/assumption)
  personas: { role: string; message: string }[]; // 6: CEO/BU, CIO/CTO, COO, functional owner, risk, CFO/procurement
  nextStep: string;       // one specific CTA
  scores: { volume: number; costSensitivity: number; language: number; ccIntensity: number; gcpRelevance: number; urgency: number; feasibility: number; speed: number; expansion: number }; // each 1-5
  validate: string[];     // requires account-team validation
  // Build-vs-buy assessment (v6)
  buildVsBuy: BuildVsBuy;
  buildVsBuyWhy: string;      // evidence-based classification rationale
  whyNotBuild: string;        // why this customer is unlikely to build the full stack — the right to win
  existing: { has: string[]; gaps: string[] }; // current customer-facing capabilities vs what customers still cannot complete
  earningsSignals: EarningsSignal[]; // 1-3, from earnings/annual reports/investor material
};

// ─── Packages ───────────────────────────────────────────────────────────────

export type PackageId = "launch" | "scale" | "transform";

export const PACKAGES: Record<PackageId, {
  id: PackageId; name: string; price: number; tagline: string;
  scope: string[]; excludes: string[]; timeline: string;
}> = {
  launch: {
    id: "launch", name: "Launch", price: 50000,
    tagline: "A focused, fast production pilot",
    scope: ["Up to 3 channels", "One priority workflow", "Limited enterprise integrations (1–2 systems)", "API credential & security setup", "Core conversational + workflow configuration", "Basic analytics", "Controlled production pilot with defined success criteria"],
    excludes: ["Usage & consumption (billed separately)", "Additional workflows", "Multi-geography rollout", "Managed operations"],
    timeline: "8–10 weeks to a live, measured pilot",
  },
  scale: {
    id: "scale", name: "Scale", price: 100000,
    tagline: "A multi-channel production deployment",
    scope: ["4–6 channels", "2–3 priority workflows", "Multiple enterprise integrations", "API credential & security setup", "Advanced orchestration", "Multilingual support", "Agent Assist / human escalation", "Production analytics", "Expansion roadmap"],
    excludes: ["Usage & consumption (billed separately)", "Enterprise-wide governance build-out", "Multi-BU rollout"],
    timeline: "10–14 weeks to production across priority workflows",
  },
  transform: {
    id: "transform", name: "Transform", price: 200000,
    tagline: "A broader enterprise deployment",
    scope: ["7–10 channels", "Multiple inbound + outbound workflows", "Complex enterprise integrations", "Multiple business units or geographies", "Advanced agent orchestration", "Enterprise grounding", "Governance & evaluation framework", "Role-based human supervision", "Custom analytics & optimization", "Production hardening + managed rollout plan"],
    excludes: ["Usage & consumption (billed separately)", "Ongoing managed operations (contracted separately)"],
    timeline: "14–20 weeks phased across units",
  },
};

export const RECURRING_NOTE =
  "Packages cover implementation and integration only. Recurring costs are billed separately: Tilicho Labs platform usage (~$0.15/call-min indicative, usage only), Google Cloud consumption, telephony/carrier charges, managed operations, and support & optimization. No package includes unlimited usage.";

// ─── Flow templates (bound per account with {C} = customer name) ────────────

export type FlowTemplateId =
  | "collections" | "inbound-service" | "order-logistics" | "lead-sales"
  | "billing-recharge" | "claims" | "admissions" | "appointments"
  | "employee-desk" | "retention" | "onboarding" | "dealer-support" | "travel-disruption";

type FlowTemplate = { conventional: FlowStep[]; agentic: FlowStep[]; metrics: FlowMetric[] };

const M = (name: string, before: string, after: string, basis: string, kind: FlowMetric["kind"]): FlowMetric => ({ name, before, after, basis, kind });

const COMMON_METRICS: FlowMetric[] = [
  M("Cost per contact", "$13.50 median assisted", "$1.84 median self-service", "Gartner customer service cost benchmarks, 2024", "benchmark"),
  M("QA coverage", "1–2% sampled", "100% scored", "Platform capability: every interaction logged and evaluated", "platform"),
];

export const FLOW_TEMPLATES: Record<FlowTemplateId, FlowTemplate> = {
  collections: {
    conventional: [
      { label: "Dialer burst", desc: "Predictive dialer attempts during work hours; most calls unanswered", actor: "system", channel: "Voice", wait: "Day 1+", pain: "Low contact rates" },
      { label: "Callback into IVR", desc: "Customer calls back into a generic IVR with no campaign context", actor: "ivr", wait: "+4 min" },
      { label: "Re-authentication", desc: "Full KYC script repeated by the human collector", actor: "human", wait: "+3 min", pain: "Repeated identity checks" },
      { label: "Manual lookups", desc: "Collector toggles core system, CRM, and discount matrix", actor: "human", pain: "5–10 screens per call" },
      { label: "Improvised offer", desc: "Terms depend on which collector answers", actor: "human", pain: "Inconsistent offers" },
      { label: "Promise on paper", desc: "PTP noted in wrap-up; no automatic follow-up", actor: "human", wait: "+2 min ACW" },
      { label: "Account rolls forward", desc: "Broken promises wait for the next dialer cycle", actor: "system", wait: "+6 days", pain: "Roll to costlier buckets" },
    ],
    agentic: [
      { label: "Policy-timed outreach", desc: "Agent contacts within permitted windows in the customer's language", actor: "agent", channel: "WhatsApp/Voice", wait: "Day 1" },
      { label: "Identity resolved once", desc: "Registered-channel match + OTP carried across the session", actor: "agent" },
      { label: "Live dues retrieved", desc: "Balance, history, and prior promises from the system of record", actor: "agent" },
      { label: "Policy-bounded negotiation", desc: "Offers only from the approved matrix; payment link in-channel", actor: "agent" },
      { label: "Hardship → human", desc: "Vulnerability cues route to a specialist with full transcript", actor: "human", approval: true },
      { label: "Outcome recorded", desc: "PTP written back with automatic follow-up; 100% logged", actor: "agent" },
      { label: "Weekly improvement", desc: "Every conversation scored; scripts and timing improve", actor: "agent" },
    ],
    metrics: [
      M("Day-1 contact coverage", "capacity-limited", "100% attempted, multi-channel", "Coverage is a platform capability; contact success measured in pilot", "platform"),
      M("Roll-rate improvement", "—", "measured in pilot", "McKinsey: 20–25% NPL reduction among digital-first collections leaders", "benchmark"),
      ...COMMON_METRICS,
    ],
  },
  "inbound-service": {
    conventional: [
      { label: "IVR maze", desc: "Static tree with no idea why the customer is calling", actor: "ivr", wait: "+3 min", pain: "Menu navigation" },
      { label: "Queue", desc: "Hold time spikes exactly when demand peaks", actor: "ivr", wait: "+15 min", pain: "Capacity lags demand" },
      { label: "Identify + explain", desc: "Agent asks for ID and the whole story — again", actor: "human", wait: "+3 min", pain: "Context lost across channels" },
      { label: "Swivel-chair lookup", desc: "Agent toggles multiple systems for one answer", actor: "human", pain: "No unified view" },
      { label: "Ticket raised", desc: "The person who answered cannot act; a queue can", actor: "human", wait: "+1–2 days", pain: "Resolution deferred" },
      { label: "Repeat contact", desc: "Customer calls again; new agent starts from zero", actor: "system", pain: "Repeat-contact volume" },
    ],
    agentic: [
      { label: "Recognized instantly", desc: "Identity and recent context resolved before hello", actor: "agent", channel: "Any channel" },
      { label: "Intent in any language", desc: "Understood including code-switching", actor: "agent" },
      { label: "Grounded answer", desc: "Live truth from systems of record, with citations", actor: "agent" },
      { label: "Action executed", desc: "Updates, bookings, refunds within policy — in the conversation", actor: "agent" },
      { label: "Complex case → human", desc: "Warm handoff with transcript and suggested next steps", actor: "human", approval: true },
      { label: "Measured + improved", desc: "Outcome recorded; every interaction evaluated", actor: "agent" },
    ],
    metrics: [
      M("First-contact resolution", "deferred via tickets", "in-conversation actions", "Process design: agent acts in systems of record", "platform"),
      ...COMMON_METRICS,
    ],
  },
  "order-logistics": {
    conventional: [
      { label: "Stale tracking page", desc: "Status hasn't updated; FAQ says 'wait 48 hours'", actor: "system", channel: "Web", pain: "The answer isn't there" },
      { label: "Bot loop", desc: "FAQ bot re-serves the same stale status", actor: "ivr", wait: "+5 min", pain: "Deflection ≠ resolution" },
      { label: "Peak-season queue", desc: "Call queue at its worst during sale events", actor: "ivr", wait: "+18 min" },
      { label: "Three systems, one agent", desc: "OMS, logistics portal, payments — manually", actor: "human", wait: "+4 min", pain: "Swivel-chair integration" },
      { label: "Ticket to logistics", desc: "Reschedule needs another team; context lost", actor: "human", wait: "+1–2 days", pain: "Handoffs" },
      { label: "Failed delivery", desc: "Return-to-origin; margin lost, churn begins", actor: "system", pain: "RTO cost" },
    ],
    agentic: [
      { label: "Proactive exception ping", desc: "Delivery risk detected; customer messaged before they ask", actor: "agent", channel: "WhatsApp" },
      { label: "Order context loaded", desc: "Recent order recognized from the registered number", actor: "agent" },
      { label: "Live 3PL truth", desc: "Real-time status from OMS and last-mile feeds", actor: "agent" },
      { label: "Reschedule executed", desc: "New slot or address fix written into the logistics system", actor: "agent" },
      { label: "Goodwill above tier → approval", desc: "One-tap human approval with full context", actor: "human", approval: true },
      { label: "RTO avoided, attributed", desc: "Outcome joined to the intervention; patterns fixed upstream", actor: "agent" },
    ],
    metrics: [
      M("Contacts per delivery incident", "3–4 across channels", "1 proactive thread", "Process design: exception detected before contact", "platform"),
      M("Cart abandonment context", "~70% average", "recoverable via consent-based outreach", "Baymard Institute meta-analysis", "benchmark"),
      ...COMMON_METRICS,
    ],
  },
  "lead-sales": {
    conventional: [
      { label: "Form into the void", desc: "Lead submitted; auto-reply promises days", actor: "system", channel: "Web", pain: "Speed-to-lead lost" },
      { label: "Spreadsheet queue", desc: "Tele-callers work a list during office hours", actor: "human", wait: "+2 days" },
      { label: "Missed calls", desc: "Two voicemail attempts; lead marked unresponsive", actor: "human", pain: "Working customers can't answer" },
      { label: "Inconsistent pitch", desc: "Qualification depends on who calls", actor: "human", pain: "Rubric in heads, not systems" },
      { label: "Thin CRM entry", desc: "Notes free-texted, if at all", actor: "human" },
      { label: "Lead decays", desc: "Competitor answered first", actor: "system", wait: "+1 week", pain: "Conversion lost to speed" },
    ],
    agentic: [
      { label: "Engaged in minutes", desc: "Agent responds on the lead's channel and language", actor: "agent", channel: "WhatsApp/Voice", wait: "Min 1" },
      { label: "Qualified on rubric", desc: "Structured scoring the business owns", actor: "agent" },
      { label: "Grounded answers", desc: "Product, pricing, eligibility from governed sources", actor: "agent" },
      { label: "Meeting booked", desc: "Qualified leads land on a human seller's calendar", actor: "agent" },
      { label: "High-value → human live", desc: "Hot leads transferred in-conversation", actor: "human", approval: true },
      { label: "Funnel instrumented", desc: "Every stage measured; nurture continues automatically", actor: "agent" },
    ],
    metrics: [
      M("Speed to first contact", "hours–days", "minutes, 24/7", "Process design; conversion lift measured in pilot", "platform"),
      ...COMMON_METRICS,
    ],
  },
  "billing-recharge": {
    conventional: [
      { label: "Balance call into IVR", desc: "DTMF tree in two languages for a multilingual base", actor: "ivr", wait: "+3 min", pain: "Language mismatch" },
      { label: "Queue at ARPU-breaking cost", desc: "Human call costs multiples of the account's monthly revenue", actor: "ivr", wait: "+12 min", pain: "Cost vs ARPU" },
      { label: "Generic script", desc: "Agent reads the same plan explanation from a screen", actor: "human" },
      { label: "Payment link by SMS later", desc: "Recharge requires another app, another step", actor: "human", pain: "Drop-off at payment" },
      { label: "No follow-up", desc: "Lapsed accounts surface in month-end reports", actor: "system", wait: "+15 days", pain: "Silent churn" },
    ],
    agentic: [
      { label: "Recognized by line", desc: "Balance and plan context loaded before hello", actor: "agent", channel: "Voice/WhatsApp" },
      { label: "Answered in their language", desc: "10+ languages from one deployment", actor: "agent" },
      { label: "Recharge in-channel", desc: "Payment link and confirmation inside the conversation", actor: "agent" },
      { label: "Proactive reminders", desc: "Policy-timed nudges before lapse, consent-governed", actor: "agent" },
      { label: "Retention offer → human rules", desc: "Offers from an approved matrix; exceptions to humans", actor: "human", approval: true },
      { label: "Lapse curve measured", desc: "Recharge conversion attributed and improved weekly", actor: "agent" },
    ],
    metrics: [
      M("Languages served", "2–3 staffed", "10+ in one deployment", "Platform capability: Gemini + Chirp speech", "platform"),
      ...COMMON_METRICS,
    ],
  },
  claims: {
    conventional: [
      { label: "FNOL by phone only", desc: "Claim intake queues behind service calls", actor: "ivr", wait: "+20 min", pain: "Worst moment, worst wait" },
      { label: "Form + documents chase", desc: "Email attachments bounce; formats rejected", actor: "human", wait: "+3 days", pain: "Document friction" },
      { label: "Status black hole", desc: "Claimant calls weekly; agent reads the same status", actor: "human", pain: "Status calls dominate volume" },
      { label: "Handoffs between teams", desc: "Surveyor, adjuster, ops — context re-explained", actor: "human", wait: "+1 week" },
      { label: "Settlement uncommunicated", desc: "Payment made; claimant learns from the bank statement", actor: "system", pain: "No closure moment" },
    ],
    agentic: [
      { label: "FNOL any channel, any hour", desc: "Structured intake with photos and documents in-chat", actor: "agent", channel: "WhatsApp/Voice" },
      { label: "Policy verified instantly", desc: "Coverage and exclusions from the policy system", actor: "agent" },
      { label: "Proactive status", desc: "Every stage change pushed to the claimant", actor: "agent" },
      { label: "Documents validated in-flow", desc: "Checklist tracked; re-uploads guided", actor: "agent" },
      { label: "Adjuster decision → human", desc: "Assessment and settlement approval stay human", actor: "human", approval: true },
      { label: "Cycle time measured", desc: "Every claim journey instrumented end-to-end", actor: "agent" },
    ],
    metrics: [
      M("Status-call volume", "dominant inbound driver", "suppressed by proactive updates", "Process design; measured in pilot", "platform"),
      ...COMMON_METRICS,
    ],
  },
  admissions: {
    conventional: [
      { label: "Inquiry into shared inbox", desc: "Web form promises a response in days", actor: "system", channel: "Web", pain: "Speed-to-lead lost" },
      { label: "Counselor backlog", desc: "Peak season: flat team, 10× inquiries", actor: "human", wait: "+2 days" },
      { label: "English-only callback", desc: "The family decides in another language", actor: "human", pain: "Language mismatch" },
      { label: "Fee answers by callback", desc: "Scholarship and hostel questions need two offices", actor: "human", wait: "+2 days" },
      { label: "Application stalls", desc: "Missing document nobody chases", actor: "system", wait: "+1 week", pain: "Silent funnel leak" },
      { label: "Admit, then silence", desc: "Next touch is the fee deadline; student enrolls elsewhere", actor: "system", pain: "Melt" },
    ],
    agentic: [
      { label: "Answered that night", desc: "Instant engagement in the family's language", actor: "agent", channel: "WhatsApp", wait: "Min 1" },
      { label: "Grounded, citable answers", desc: "Programs, fees, scholarships from official sources", actor: "agent" },
      { label: "Counselor call booked", desc: "Qualified families onto real calendars", actor: "agent" },
      { label: "Documents chased", desc: "Application checklist tracked automatically", actor: "agent" },
      { label: "Exceptions → director", desc: "Scholarship edge cases decided by humans", actor: "human", approval: true },
      { label: "Nurture to enrollment", desc: "Post-admit journey instrumented; melt drops", actor: "agent" },
    ],
    metrics: [
      M("First response time", "2–3 days", "under 2 minutes", "Process design; 78% choose the first responder (vendor funnel studies — directional)", "benchmark"),
      ...COMMON_METRICS,
    ],
  },
  appointments: {
    conventional: [
      { label: "Phone-only booking", desc: "Lines busy at opening; queues at peak", actor: "ivr", wait: "+10 min", pain: "Booking friction" },
      { label: "Manual slot lookup", desc: "Staff toggle scheduling systems while the caller waits", actor: "human" },
      { label: "No-show silence", desc: "No reminders; slots wasted daily", actor: "system", pain: "No-show cost" },
      { label: "Reschedule = repeat everything", desc: "New call, new queue, new explanation", actor: "human", wait: "+8 min" },
      { label: "Follow-up missed", desc: "Post-visit instructions lost; outcomes unmeasured", actor: "system" },
    ],
    agentic: [
      { label: "Booked in any channel", desc: "Slots offered from live schedules, any language", actor: "agent", channel: "WhatsApp/Voice" },
      { label: "Smart reminders", desc: "Confirmations with one-tap reschedule", actor: "agent" },
      { label: "Preparation guided", desc: "Documents, fasting, directions — proactively", actor: "agent" },
      { label: "Clinical questions → human", desc: "Anything medical routes to qualified staff", actor: "human", approval: true },
      { label: "Follow-up automated", desc: "Post-visit care instructions and feedback captured", actor: "agent" },
      { label: "No-show curve measured", desc: "Reminder timing optimized from outcomes", actor: "agent" },
    ],
    metrics: [
      M("No-show reduction", "—", "measured in pilot", "Reminder-driven reductions vary by specialty; baseline first", "assumption"),
      ...COMMON_METRICS,
    ],
  },
  "employee-desk": {
    conventional: [
      { label: "Portal maze", desc: "Three ticketing front doors; none obviously right", actor: "system", pain: "Findability" },
      { label: "Wrong-category ticket", desc: "Misrouted; bounced between queues", actor: "system", wait: "+4 hrs" },
      { label: "L1 info-gathering", desc: "Agent asks for details systems already know", actor: "human", pain: "$15–25 per L1 ticket" },
      { label: "Second team, second ticket", desc: "One problem, two SLAs", actor: "human", wait: "+1 day", pain: "Cross-team handoffs" },
      { label: "HR query in email", desc: "Policy answer exists; retrieval is human", actor: "human", wait: "+2 days" },
      { label: "Quarterly survey", desc: "SLA green; experience unmeasured", actor: "system" },
    ],
    agentic: [
      { label: "One front door", desc: "Ask in chat or voice, in any language", actor: "agent", channel: "Chat" },
      { label: "Identity + entitlements", desc: "SSO-resolved; context assembled in one pass", actor: "agent" },
      { label: "Root cause reasoned", desc: "Cross-system diagnosis, not queue ping-pong", actor: "agent" },
      { label: "Fixes executed", desc: "Resets, access, leave requests — least-privilege, logged", actor: "agent" },
      { label: "Manager approval in-flow", desc: "One-tap approvals with context", actor: "human", approval: true },
      { label: "Defects fixed upstream", desc: "Recurring issues clustered and reported to owners", actor: "agent" },
    ],
    metrics: [
      M("Cost per L1 ticket", "$15–25 fully loaded", "self-service economics", "HDI/ITSM benchmarks (validate per customer)", "benchmark"),
      ...COMMON_METRICS,
    ],
  },
  retention: {
    conventional: [
      { label: "Churn model runs monthly", desc: "Risk visible after the customer decided", actor: "system", pain: "Too late" },
      { label: "SMS blast", desc: "Same offer to everyone; ~1% response", actor: "system", pain: "No conversation" },
      { label: "Outbound team capacity", desc: "Callers reach a fraction of the at-risk base", actor: "human", wait: "days" },
      { label: "Uninformed offers", desc: "Agent doesn't know why this customer is leaving", actor: "human", pain: "Offer waste" },
      { label: "Port-out / cancellation", desc: "Exit interview unanswered", actor: "system" },
    ],
    agentic: [
      { label: "Risk signals in-flight", desc: "Usage, complaints, and payment signals scored live", actor: "agent" },
      { label: "Timely, personal outreach", desc: "Two-way conversation in the customer's language", actor: "agent", channel: "WhatsApp/Voice" },
      { label: "Reason understood", desc: "Actual churn driver captured conversationally", actor: "agent" },
      { label: "Offers within matrix", desc: "Retention offers bounded by approved economics", actor: "agent" },
      { label: "High-value saves → human", desc: "Specialists take ranked, contextualized queues", actor: "human", approval: true },
      { label: "Save rate attributed", desc: "Offer economics measured against actual retention", actor: "agent" },
    ],
    metrics: [
      M("At-risk base contacted", "capacity-limited fraction", "100% attempted", "Platform capability; save rate measured in pilot", "platform"),
      ...COMMON_METRICS,
    ],
  },
  onboarding: {
    conventional: [
      { label: "Application started", desc: "KYC/document steps span apps and branches", actor: "system", pain: "Drop-off at each step" },
      { label: "Document rejected silently", desc: "Customer learns days later, if at all", actor: "system", wait: "+3 days" },
      { label: "Status calls", desc: "'Where is my application?' dominates inbound", actor: "human", wait: "+10 min" },
      { label: "Branch visit anyway", desc: "Digital journey ends in a queue", actor: "human", pain: "Channel failure" },
      { label: "Abandonment unmeasured", desc: "Funnel leaks invisible until quarterly review", actor: "system" },
    ],
    agentic: [
      { label: "Guided start", desc: "Step-by-step in the customer's language and channel", actor: "agent", channel: "WhatsApp/App" },
      { label: "Documents validated live", desc: "Format and completeness checked in-flow", actor: "agent" },
      { label: "Proactive status", desc: "Every stage change pushed; no status calls", actor: "agent" },
      { label: "Stuck → human", desc: "Exceptions route to onboarding specialists with context", actor: "human", approval: true },
      { label: "Activation nudges", desc: "First-use guidance after approval", actor: "agent" },
      { label: "Funnel instrumented", desc: "Drop-off reasons captured and fixed weekly", actor: "agent" },
    ],
    metrics: [
      M("Onboarding drop-off", "unmeasured leaks", "instrumented end-to-end", "Process design; completion lift measured in pilot", "platform"),
      ...COMMON_METRICS,
    ],
  },
  "dealer-support": {
    conventional: [
      { label: "Dealer calls a hotline", desc: "Same queue as consumers; long waits", actor: "ivr", wait: "+15 min", pain: "B2B in a B2C queue" },
      { label: "Parts/status lookup manual", desc: "Rep checks ERP and emails the answer later", actor: "human", wait: "+1 day" },
      { label: "Claims paperwork", desc: "Warranty claims bounce on format errors", actor: "human", pain: "Rework cycles" },
      { label: "Regional language gap", desc: "Support in HQ language only", actor: "human", pain: "Network friction" },
      { label: "Escalation by relationship", desc: "Whoever knows someone gets served", actor: "human" },
    ],
    agentic: [
      { label: "Dealer recognized", desc: "Account, orders, and entitlements loaded at hello", actor: "agent", channel: "WhatsApp/Voice" },
      { label: "Live ERP answers", desc: "Parts availability, order status, credit position", actor: "agent" },
      { label: "Claims guided", desc: "Warranty submissions validated in-flow", actor: "agent" },
      { label: "Any regional language", desc: "The network's languages, one deployment", actor: "agent" },
      { label: "Commercial exceptions → human", desc: "Credit and goodwill decisions stay human", actor: "human", approval: true },
      { label: "Network health measured", desc: "Dealer friction patterns surfaced to sales ops", actor: "agent" },
    ],
    metrics: [
      M("Dealer query resolution", "next-day via email", "in-conversation", "Process design: live ERP grounding", "platform"),
      ...COMMON_METRICS,
    ],
  },
  "travel-disruption": {
    conventional: [
      { label: "Disruption hits", desc: "Delay/cancellation; call volume spikes 10×", actor: "system", pain: "Capacity cliff" },
      { label: "Hold music at the airport", desc: "Queues longest exactly when it matters most", actor: "ivr", wait: "+45 min" },
      { label: "Rebooking by agent only", desc: "Options read out one by one", actor: "human", wait: "+12 min" },
      { label: "Refund limbo", desc: "Status unknown for weeks; repeated calls", actor: "human", pain: "Refund-status volume" },
      { label: "Compensation confusion", desc: "Policies applied inconsistently", actor: "human", pain: "Trust erosion" },
    ],
    agentic: [
      { label: "Proactive disruption notice", desc: "Affected passengers messaged before they call", actor: "agent", channel: "App/WhatsApp/SMS" },
      { label: "Rebooking options in-channel", desc: "Live seats offered; one tap to confirm", actor: "agent" },
      { label: "Refund status live", desc: "Real-time state from the payments pipeline", actor: "agent" },
      { label: "Policy applied consistently", desc: "Compensation from the approved matrix", actor: "agent" },
      { label: "Complex itineraries → human", desc: "Multi-leg and special cases to specialists", actor: "human", approval: true },
      { label: "Spike absorbed, measured", desc: "Elastic capacity; disruption CX cost quantified", actor: "agent" },
    ],
    metrics: [
      M("Disruption call spike", "10× volume, melted queues", "suppressed by proactive rebooking", "Operator-reported pattern (assumption); suppression measured in pilot", "assumption"),
      ...COMMON_METRICS,
    ],
  },
};

// Bind a template to an account (substitute customer name, attach scenario).
export function bindFlow(account: Account) {
  const t = FLOW_TEMPLATES[account.flowTemplate];
  return {
    slug: account.slug,
    scenario: account.scenario,
    conventional: t.conventional,
    agentic: t.agentic,
    metrics: t.metrics,
  };
}

// ─── Business case (account default model) ──────────────────────────────────

export function accountBusinessCase(a: { volumeMonthly: number; costPerInteraction: number }, automation = 0.55) {
  const vol = a.volumeMonthly;
  const currentMonthly = vol * a.costPerInteraction;
  const automated = vol * automation;
  const aiCost = automated * 0.35; // blended usage+cloud per automated interaction (assumption)
  const retainedHuman = vol * (1 - automation) * a.costPerInteraction;
  const newMonthly = aiCost + retainedHuman;
  const grossMonthly = currentMonthly - newMonthly;
  return { currentMonthly, automated, newMonthly, grossMonthly, grossAnnual: grossMonthly * 12 };
}

export const MARKET_META: Record<MarketId, { label: string; color: string }> = {
  India: { label: "India", color: "#1A73E8" },
  Indonesia: { label: "Indonesia", color: "#D97706" },
  Philippines: { label: "Philippines", color: "#188038" },
  Vietnam: { label: "Vietnam", color: "#B3261E" },
  Thailand: { label: "Thailand", color: "#7C3AED" },
  Malaysia: { label: "Malaysia", color: "#00838F" },
  "SEA-regional": { label: "SEA regional", color: "#5F6368" },
  Japan: { label: "Japan", color: "#9334E6" },
  Korea: { label: "Korea", color: "#E8710A" },
  Taiwan: { label: "Taiwan", color: "#C5221F" },
  "Hong Kong": { label: "Hong Kong", color: "#F29900" },
  ANZ: { label: "ANZ", color: "#0F9D8F" },
};

export const PROFILE_DISCLAIMER =
  "Qualified profiles are real, named organizations that passed relevance and build-vs-buy screening but have NOT yet received deep account research. Promote a profile to a deep pitch (research pass + evidence sections) before any customer-facing use.";

export const CONFIDENCE_META: Record<Confidence, { label: string; color: string }> = {
  verified: { label: "Public fact", color: "#188038" },
  inference: { label: "Reasoned inference", color: "#D97706" },
  hypothesis: { label: "Seller hypothesis — validate", color: "#7C3AED" },
};

export const UNIVERSE_DISCLAIMER =
  "Research-based priority-account universe assembled from public information, market scale, communication volume, and solution fit. This is NOT an authoritative list of top Google Cloud customers; existing Google Cloud relationships are noted only where publicly reported. Validate every account with the account team before outreach.";
