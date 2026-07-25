// Solution Builder data model + computation engine.
// Every number here is an EDITABLE modelling default, not a price. Provenance
// labels: "customer" (verified customer input), "benchmark" (cited),
// "assumption" (seller-editable default), "estimate" (system-generated).

// ─── Channels ───────────────────────────────────────────────────────────────

export type Channel = {
  id: string;
  name: string;
  complexity: 1 | 2 | 3;
  effortWeeks: number; // partner implementation effort, per channel
  integrations: string[];
  interactionTypes: string[];
  products: string[];
  partnerDeps: string[];
  consumptionDrivers: string[];
  warning?: string;
};

export const CHANNELS: Channel[] = [
  { id: "voice", name: "Voice (telephony)", complexity: 3, effortWeeks: 6, integrations: ["SIP trunk / carrier", "Number porting", "Call recording store"], interactionTypes: ["Inbound service", "Outbound campaigns", "Verification"], products: ["Gemini Live API", "Chirp 3 STT/TTS"], partnerDeps: ["Telephony integration", "Latency tuning"], consumptionDrivers: ["Speech minutes", "Model tokens", "Telephony minutes"] },
  { id: "contact-centre", name: "Contact-centre escalation", complexity: 2, effortWeeks: 4, integrations: ["CCaaS API (GECX or incumbent)", "Agent desktop context push"], interactionTypes: ["Warm human handoff", "Agent assist"], products: ["Customer Engagement Suite / incumbent CC APIs"], partnerDeps: ["CC vendor integration"], consumptionDrivers: ["Assist sessions", "Summary tokens"], warning: "Contact-centre involvement → check the GECX decision tree; joint pursuit likely." },
  { id: "web-chat", name: "Web chat", complexity: 1, effortWeeks: 2, integrations: ["Web SDK embed", "Session identity"], interactionTypes: ["Self-service", "Guided selling"], products: ["Agent Platform chat runtime"], partnerDeps: ["Front-end embed"], consumptionDrivers: ["Model tokens"] },
  { id: "mobile-app", name: "Mobile app", complexity: 2, effortWeeks: 3, integrations: ["Mobile SDK", "Push notifications", "App identity"], interactionTypes: ["In-app support", "Proactive notices"], products: ["Agent Platform SDK"], partnerDeps: ["App-team coordination"], consumptionDrivers: ["Model tokens", "Push volume"] },
  { id: "whatsapp", name: "WhatsApp", complexity: 2, effortWeeks: 3, integrations: ["BSP account", "Template approval", "Opt-in management"], interactionTypes: ["Two-way service", "Outbound campaigns", "Payments links"], products: ["Agent Platform messaging runtime"], partnerDeps: ["BSP relationship"], consumptionDrivers: ["Per-message BSP fees", "Model tokens"] },
  { id: "rcs", name: "RCS", complexity: 2, effortWeeks: 3, integrations: ["RBM agent registration", "Carrier availability check"], interactionTypes: ["Rich outbound", "Interactive service"], products: ["RBM via partner platform"], partnerDeps: ["RBM aggregator"], consumptionDrivers: ["Per-message fees", "Model tokens"], warning: "RCS business messaging availability varies by carrier and country — verify per market." },
  { id: "sms", name: "SMS", complexity: 1, effortWeeks: 1, integrations: ["SMSC / aggregator", "Sender-ID registration"], interactionTypes: ["Notifications", "OTP", "Fallback"], products: ["Messaging gateway via partner"], partnerDeps: ["Aggregator"], consumptionDrivers: ["Per-message fees"] },
  { id: "email", name: "Email", complexity: 1, effortWeeks: 2, integrations: ["Mailbox / SMTP", "Threading model"], interactionTypes: ["Async service", "Documents"], products: ["Agent Platform email runtime"], partnerDeps: ["Deliverability setup"], consumptionDrivers: ["Model tokens"] },
  { id: "video", name: "Video", complexity: 3, effortWeeks: 5, integrations: ["Video platform", "Recording & consent"], interactionTypes: ["Assisted onboarding", "Remote verification"], products: ["Live API (multimodal)"], partnerDeps: ["Video infra"], consumptionDrivers: ["Multimodal minutes"], warning: "Video adds significant complexity — defer unless the entry use case demands it." },
  { id: "employee-desktop", name: "Employee desktop / chat", complexity: 1, effortWeeks: 2, integrations: ["SSO", "Chat platform (Google Chat / Teams / Slack)"], interactionTypes: ["Employee support", "Approvals"], products: ["Gemini Enterprise", "Agent Platform"], partnerDeps: ["IdP integration"], consumptionDrivers: ["Model tokens", "Seats"] },
  { id: "embedded", name: "Embedded product experience", complexity: 3, effortWeeks: 5, integrations: ["Product APIs", "In-product UI"], interactionTypes: ["Contextual help", "Workflow completion"], products: ["Agent Platform SDK"], partnerDeps: ["Product-team build"], consumptionDrivers: ["Model tokens"], warning: "Requires the customer's product team on the critical path — timeline risk." },
];

// ─── Capability modules ─────────────────────────────────────────────────────

export type Capability = {
  id: string;
  name: string;
  module: string;
  desc: string;
  effortWeeks: number;
  complexity: 1 | 2 | 3;
  products: string[];
  owner: "google" | "gecx" | "partner" | "joint";
  consumption?: string;
  core?: boolean;      // included in every solution
  deferHint?: string;  // why it might be phase 2
  benefit?: "containment" | "aht" | "conversion" | "collections" | "retention" | "productivity" | "compliance";
};

export const MODULE_ORDER = [
  "Experience channels",
  "Conversational intelligence",
  "Enterprise grounding",
  "Workflow & action",
  "Human collaboration",
  "Trust & governance",
  "Analytics & optimization",
  "Industry accelerators",
];

export const CAPABILITIES: Capability[] = [
  // Conversational intelligence
  { id: "self-service", name: "Conversational self-service", module: "Conversational intelligence", desc: "End-to-end intent resolution in natural language", effortWeeks: 3, complexity: 2, products: ["Gemini models", "Agent Platform"], owner: "google", consumption: "Model tokens per interaction", core: true, benefit: "containment" },
  { id: "outbound", name: "Outbound engagement", module: "Conversational intelligence", desc: "Policy-timed, consent-governed proactive outreach", effortWeeks: 3, complexity: 2, products: ["Agent Platform orchestration"], owner: "google", consumption: "Campaign volume", benefit: "conversion" },
  { id: "multilingual", name: "Multilingual support", module: "Conversational intelligence", desc: "Major world + Indic languages incl. code-switching", effortWeeks: 2, complexity: 2, products: ["Gemini", "Chirp 3"], owner: "joint", consumption: "Speech minutes per language mix" },
  { id: "sentiment", name: "Sentiment & intent detection", module: "Conversational intelligence", desc: "Real-time signals driving routing and escalation", effortWeeks: 1, complexity: 1, products: ["Gemini models"], owner: "google", core: true },
  { id: "summarization", name: "Summarization", module: "Conversational intelligence", desc: "Wrap-ups, handoff briefs, and case notes", effortWeeks: 1, complexity: 1, products: ["Gemini models"], owner: "google", benefit: "aht" },
  // Enterprise grounding
  { id: "knowledge", name: "Knowledge retrieval", module: "Enterprise grounding", desc: "Grounded answers with citations from governed sources", effortWeeks: 2, complexity: 2, products: ["Enterprise search & grounding"], owner: "google", core: true, benefit: "containment" },
  { id: "grounding", name: "Enterprise data grounding", module: "Enterprise grounding", desc: "Live reads from CRM, core, OMS, SIS, ITSM", effortWeeks: 4, complexity: 3, products: ["Agent Platform tools", "Partner connectors"], owner: "partner", core: true },
  { id: "personalization", name: "Personalization", module: "Enterprise grounding", desc: "Responses shaped by history, entitlements, and segment", effortWeeks: 2, complexity: 2, products: ["Agent Platform memory"], owner: "google", benefit: "conversion" },
  // Workflow & action
  { id: "workflow", name: "Workflow execution", module: "Workflow & action", desc: "Multi-step business processes across systems", effortWeeks: 4, complexity: 3, products: ["Agent Platform orchestration"], owner: "joint", benefit: "productivity" },
  { id: "transactions", name: "Transaction completion", module: "Workflow & action", desc: "Payments, bookings, updates executed in systems of record", effortWeeks: 4, complexity: 3, products: ["Partner connectors", "Agent Platform tools"], owner: "partner", benefit: "containment" },
  { id: "case-mgmt", name: "Case management integration", module: "Workflow & action", desc: "Tickets and cases created/updated with full context", effortWeeks: 2, complexity: 2, products: ["CRM/ITSM connectors"], owner: "partner", core: true },
  { id: "orchestration", name: "Multi-agent orchestration", module: "Workflow & action", desc: "Specialized agents coordinated per interaction", effortWeeks: 3, complexity: 3, products: ["Agent Platform"], owner: "google", deferHint: "Add when use cases span multiple domains" },
  { id: "state", name: "State & memory", module: "Workflow & action", desc: "Context persisted across channels and sessions", effortWeeks: 2, complexity: 2, products: ["Agent Platform state"], owner: "google", core: true },
  // Human collaboration
  { id: "escalation", name: "Human escalation", module: "Human collaboration", desc: "Warm handoff with transcript, summary, and suggested actions", effortWeeks: 2, complexity: 2, products: ["CC integration (GECX or incumbent)"], owner: "gecx", core: true },
  { id: "agent-assist", name: "Agent Assist", module: "Human collaboration", desc: "Live suggestions, knowledge, and drafting for human agents", effortWeeks: 3, complexity: 2, products: ["Customer Engagement Suite — Agent Assist"], owner: "gecx", benefit: "aht" },
  { id: "approvals", name: "Human-approval workflows", module: "Human collaboration", desc: "Above-threshold actions gated on one-tap human approval", effortWeeks: 2, complexity: 2, products: ["Agent Platform approval hooks"], owner: "google", benefit: "compliance" },
  // Trust & governance
  { id: "auth", name: "Authentication", module: "Trust & governance", desc: "OTP, registered-channel, SSO — carried across the session", effortWeeks: 2, complexity: 2, products: ["Identity provider integration"], owner: "partner", core: true },
  { id: "consent", name: "Consent management", module: "Trust & governance", desc: "Opt-ins, calling windows, DND, frequency caps as enforced policy", effortWeeks: 2, complexity: 2, products: ["Agent Platform policy engine"], owner: "joint", core: true, benefit: "compliance" },
  { id: "security", name: "Security & governance", module: "Trust & governance", desc: "IAM, VPC-SC, residency, policy matrices, full audit logging", effortWeeks: 2, complexity: 2, products: ["Google Cloud security stack"], owner: "google", core: true, benefit: "compliance" },
  { id: "evaluation", name: "Evaluation", module: "Trust & governance", desc: "Golden datasets gating every prompt/policy change", effortWeeks: 2, complexity: 2, products: ["Agent Platform evals"], owner: "google", core: true },
  // Analytics & optimization
  { id: "quality", name: "Quality monitoring", module: "Analytics & optimization", desc: "100% interaction scoring against quality/compliance rubrics", effortWeeks: 2, complexity: 2, products: ["Conversational Insights", "BigQuery"], owner: "joint", benefit: "compliance" },
  { id: "analytics", name: "Interaction analytics", module: "Analytics & optimization", desc: "Trends, root causes, and value attribution in the warehouse", effortWeeks: 2, complexity: 2, products: ["BigQuery", "Looker"], owner: "joint", consumption: "Data processing" },
  { id: "observability", name: "Observability", module: "Analytics & optimization", desc: "Latency, cost, and failure telemetry with alerting", effortWeeks: 1, complexity: 1, products: ["Cloud Observability"], owner: "google", core: true },
  // Industry accelerators
  { id: "collections-pack", name: "Collections accelerator", module: "Industry accelerators", desc: "PTP flows, offer matrices, bucket strategies, compliance windows", effortWeeks: 3, complexity: 2, products: ["Partner agent pack"], owner: "partner", benefit: "collections" },
  { id: "lead-pack", name: "Lead-qualification accelerator", module: "Industry accelerators", desc: "Qualification rubrics, booking flows, nurture cadences", effortWeeks: 2, complexity: 1, products: ["Partner agent pack"], owner: "partner", benefit: "conversion" },
  { id: "service-pack", name: "Customer-servicing accelerator", module: "Industry accelerators", desc: "Top-intent journeys, entitlement logic, refund/reschedule policies", effortWeeks: 3, complexity: 2, products: ["Partner agent pack"], owner: "partner", benefit: "containment" },
  { id: "employee-pack", name: "Employee-support accelerator", module: "Industry accelerators", desc: "HR/IT/finance journeys, entitlement catalogs, approval chains", effortWeeks: 3, complexity: 2, products: ["Partner agent pack"], owner: "partner", benefit: "productivity" },
];

// ─── Industry defaults ──────────────────────────────────────────────────────

export type IndustryDefault = {
  id: string;
  name: string;
  entryUseCase: string;
  channels: string[];
  capabilities: string[];
  monthlyInteractions: number;
  costPerInteraction: number; // USD, "customer input" once edited
  ahtMinutes: number;
  currentContainment: number; // %
  targetContainment: number;  // %
  languages: number;
  stakeholders: string[];
  risks: string[];
  expansion: string[];
};

export const INDUSTRY_DEFAULTS: IndustryDefault[] = [
  { id: "fsi", name: "Financial Services", entryUseCase: "Early-bucket collections", channels: ["voice", "whatsapp", "contact-centre"], capabilities: ["outbound", "multilingual", "transactions", "collections-pack", "approvals"], monthlyInteractions: 500000, costPerInteraction: 2.0, ahtMinutes: 4, currentContainment: 10, targetContainment: 60, languages: 4, stakeholders: ["Collections head", "CRO / compliance", "CIO", "Core-banking owner", "Procurement"], risks: ["Core-banking API readiness", "Regulator engagement on AI conversations", "Offer-matrix sign-off cycle"], expansion: ["Pre-due reminders", "Inbound servicing", "Fraud verification callbacks"] },
  { id: "retail", name: "Retail & eCommerce", entryUseCase: "WISMO + delivery coordination", channels: ["whatsapp", "web-chat", "contact-centre"], capabilities: ["transactions", "service-pack", "outbound", "personalization"], monthlyInteractions: 800000, costPerInteraction: 1.2, ahtMinutes: 3, currentContainment: 20, targetContainment: 70, languages: 3, stakeholders: ["CX / service head", "COO / logistics", "CIO", "eCommerce head"], risks: ["3PL API variability", "Peak-season change freeze", "Refund-policy tier approvals"], expansion: ["Returns automation", "Cart recovery", "Guided selling"] },
  { id: "telecom", name: "Telecommunications", entryUseCase: "Plan / billing / balance support", channels: ["voice", "whatsapp", "sms", "contact-centre"], capabilities: ["multilingual", "service-pack", "outbound", "transactions"], monthlyInteractions: 5000000, costPerInteraction: 0.9, ahtMinutes: 3, currentContainment: 25, targetContainment: 65, languages: 8, stakeholders: ["CS head", "CTO / BSS owner", "CMO (retention)", "Collections head"], risks: ["BSS/OSS integration depth", "Peak-load latency SLOs", "TRAI/DND compliance sign-off"], expansion: ["Churn outreach", "Network triage + outage comms", "Collections"] },
  { id: "education", name: "Education", entryUseCase: "Admissions inquiry & nurture", channels: ["whatsapp", "web-chat", "voice"], capabilities: ["lead-pack", "multilingual", "outbound", "knowledge"], monthlyInteractions: 60000, costPerInteraction: 2.0, ahtMinutes: 5, currentContainment: 5, targetContainment: 65, languages: 3, stakeholders: ["Admissions director", "VC / dean", "IT director", "Finance / registrar"], risks: ["CRM data hygiene", "Peak-intake timing", "Student-data privacy review"], expansion: ["Fee reminders", "Onboarding", "Campus help desk"] },
  { id: "gcc", name: "GCC & BPM", entryUseCase: "IT + HR employee support", channels: ["employee-desktop", "web-chat", "email"], capabilities: ["employee-pack", "workflow", "approvals", "multilingual"], monthlyInteractions: 120000, costPerInteraction: 4.0, ahtMinutes: 6, currentContainment: 15, targetContainment: 55, languages: 2, stakeholders: ["GCC site leader", "Global CIO", "Shared-services head", "CISO", "HRBP lead"], risks: ["ITSM/HRMS write-access approvals", "Works-council / labor consultation where applicable", "Entitlement-catalog completeness"], expansion: ["Finance & procurement towers", "Onboarding orchestration", "Agent-building CoE"] },
];

// ─── Editable rate card (assumptions, not prices) ───────────────────────────

export type Rates = {
  blendedRateWeek: number;     // partner services per person-week
  aiCostPerMin: number;        // model+speech blended per handled minute
  telephonyPerMin: number;     // carrier cost per voice minute
  messagingPerMsg: number;     // BSP/aggregator per message
  managedOpsPctYr: number;     // % of one-time cost per year
  changeMgmtPct: number;       // % of implementation
  contingencyPct: number;      // % of one-time
  discountRatePct: number;     // NPV discount
  escalatedHumanShare: number; // share of human handle time still incurred on escalations (0-1)
};

export const DEFAULT_RATES: Rates = {
  blendedRateWeek: 6000,
  aiCostPerMin: 0.06,
  telephonyPerMin: 0.01,
  messagingPerMsg: 0.01,
  managedOpsPctYr: 18,
  changeMgmtPct: 15,
  contingencyPct: 10,
  discountRatePct: 10,
  escalatedHumanShare: 0.6,
};

export const RATE_LABELS: { key: keyof Rates; label: string; format: "money" | "pct" | "share" }[] = [
  { key: "blendedRateWeek", label: "Partner blended rate ($/person-week)", format: "money" },
  { key: "aiCostPerMin", label: "AI cost per handled minute (model + speech)", format: "money" },
  { key: "telephonyPerMin", label: "Telephony cost per voice minute", format: "money" },
  { key: "messagingPerMsg", label: "Messaging cost per message", format: "money" },
  { key: "managedOpsPctYr", label: "Managed operations (% of build, per year)", format: "pct" },
  { key: "changeMgmtPct", label: "Change management (% of implementation)", format: "pct" },
  { key: "contingencyPct", label: "Contingency (% of one-time)", format: "pct" },
  { key: "discountRatePct", label: "NPV discount rate (%)", format: "pct" },
  { key: "escalatedHumanShare", label: "Human handle-share retained on escalations", format: "share" },
];

// ─── Computation ────────────────────────────────────────────────────────────

export type BuilderProfile = {
  industry: string;
  customerName: string;
  geography: string;
  size: string;
  monthlyInteractions: number;
  costPerInteraction: number;
  ahtMinutes: number;
  currentContainment: number;
  targetContainment: number;
  languages: number;
  residency: "none" | "preferred" | "mandatory";
  ccPlatform: "none" | "gecx" | "incumbent";
  cloud: "gcp" | "multi" | "other";
  timelineWeeks: number;
  outcomes: string[];
};

export type BuilderState = {
  profile: BuilderProfile;
  channels: string[];
  capabilities: string[];
  rates: Rates;
};

export function coreCapabilityIds() {
  return CAPABILITIES.filter((c) => c.core).map((c) => c.id);
}

export function computeEffort(state: BuilderState) {
  const chWeeks = CHANNELS.filter((c) => state.channels.includes(c.id)).reduce((s, c) => s + c.effortWeeks, 0);
  const capWeeks = CAPABILITIES.filter((c) => state.capabilities.includes(c.id)).reduce((s, c) => s + c.effortWeeks, 0);
  const discovery = 4;
  const langFactor = 1 + Math.max(0, state.profile.languages - 2) * 0.05; // +5% per language beyond 2
  const residencyFactor = state.profile.residency === "mandatory" ? 1.1 : 1;
  const total = Math.round((discovery + chWeeks + capWeeks) * langFactor * residencyFactor);
  return { discovery, chWeeks, capWeeks, total };
}

export type Tco = {
  oneTime: { discovery: number; implementation: number; integrationShare: number; changeMgmt: number; contingency: number; total: number };
  recurringYr: { managedOps: number; securityObs: number; total: number };
  variableYr: { model: number; telephony: number; messaging: number; total: number };
  threeYearTotal: number;
  costPerInteraction: number;
  costPerResolved: number;
  byChannel: { name: string; oneTime: number; variableYr: number }[];
  byCapability: { name: string; oneTime: number }[];
};

export function computeTco(state: BuilderState): Tco {
  const { profile, rates } = state;
  const effort = computeEffort(state);
  const discovery = effort.discovery * rates.blendedRateWeek;
  const implementation = (effort.chWeeks + effort.capWeeks) * rates.blendedRateWeek;
  const changeMgmt = implementation * (rates.changeMgmtPct / 100);
  const preContingency = discovery + implementation + changeMgmt;
  const contingency = preContingency * (rates.contingencyPct / 100);
  const oneTimeTotal = preContingency + contingency;

  const managedOps = oneTimeTotal * (rates.managedOpsPctYr / 100);
  const securityObs = 12000; // observability/eval tooling baseline (assumption)
  const recurringTotal = managedOps + securityObs;

  const vol = profile.monthlyInteractions;
  const containedShare = profile.targetContainment / 100;
  const handledMin = vol * profile.ahtMinutes;
  const hasVoice = state.channels.includes("voice");
  const msgChannels = ["whatsapp", "rcs", "sms"].filter((c) => state.channels.includes(c)).length;
  const voiceShare = hasVoice ? (msgChannels > 0 ? 0.5 : 0.9) : 0;
  const model = handledMin * rates.aiCostPerMin * 12;
  const telephony = handledMin * voiceShare * rates.telephonyPerMin * 12;
  const messaging = vol * (msgChannels > 0 ? 2.5 : 0) * rates.messagingPerMsg * 12; // ~2.5 messages per interaction
  const variableTotal = model + telephony + messaging;

  const threeYearTotal = oneTimeTotal + 3 * (recurringTotal + variableTotal);
  const annualInteractions = vol * 12;
  const costPerInteraction = (recurringTotal + variableTotal + oneTimeTotal / 3) / annualInteractions;
  const costPerResolved = costPerInteraction / Math.max(0.05, containedShare);

  const selCh = CHANNELS.filter((c) => state.channels.includes(c.id));
  const chWeekTotal = Math.max(1, selCh.reduce((s, c) => s + c.effortWeeks, 0));
  const byChannel = selCh.map((c) => ({
    name: c.name,
    oneTime: (c.effortWeeks / chWeekTotal) * (effort.chWeeks * rates.blendedRateWeek),
    variableYr:
      (c.id === "voice" ? telephony + model * voiceShare : 0) +
      (["whatsapp", "rcs", "sms"].includes(c.id) && msgChannels > 0 ? messaging / msgChannels : 0),
  }));
  const selCaps = CAPABILITIES.filter((c) => state.capabilities.includes(c.id));
  const byCapability = selCaps.map((c) => ({ name: c.name, oneTime: c.effortWeeks * rates.blendedRateWeek }));

  return {
    oneTime: { discovery, implementation, integrationShare: implementation * 0.4, changeMgmt, contingency, total: oneTimeTotal },
    recurringYr: { managedOps, securityObs, total: recurringTotal },
    variableYr: { model, telephony, messaging, total: variableTotal },
    threeYearTotal, costPerInteraction, costPerResolved, byChannel, byCapability,
  };
}

export type Roi = {
  containmentSavingYr: number;
  ahtSavingYr: number;
  outcomeValueYr: number;
  grossBenefitYr: number;
  netBenefitYr: number;
  paybackMonths: number;
  threeYearRoi: number; // %
  npv: number;
  breakEvenMonthlyVolume: number;
  byLever: { name: string; value: number; provenance: "benchmark" | "assumption" | "estimate" }[];
};

export function computeRoiModel(state: BuilderState, tco: Tco): Roi {
  const p = state.profile;
  const vol = p.monthlyInteractions;
  const humanCostPerMin = p.ahtMinutes > 0 ? p.costPerInteraction / p.ahtMinutes : 0.4;
  const upliftShare = Math.max(0, (p.targetContainment - p.currentContainment) / 100);

  // Containment: newly contained interactions avoid (1 - escalatedHumanShare... fully) human cost, keep AI cost
  const containmentSavingYr = vol * upliftShare * (p.costPerInteraction - p.ahtMinutes * state.rates.aiCostPerMin) * 12;

  // AHT: agent-assist/summarization reduce human handle time on remaining human volume by 15% (benchmark-flavored assumption)
  const hasAssist = state.capabilities.includes("agent-assist") || state.capabilities.includes("summarization");
  const humanVol = vol * (1 - p.targetContainment / 100);
  const ahtSavingYr = hasAssist ? humanVol * p.ahtMinutes * 0.15 * humanCostPerMin * 12 : 0;

  // Outcome value: conversion/collections levers at 2% of contained volume × modest per-outcome value (editable assumption)
  const hasOutcomeLever = ["outbound", "lead-pack", "collections-pack"].some((c) => state.capabilities.includes(c));
  const outcomeValueYr = hasOutcomeLever ? vol * (p.targetContainment / 100) * 0.02 * 2.0 * 12 : 0;

  const grossBenefitYr = containmentSavingYr + ahtSavingYr + outcomeValueYr;
  const annualCost = tco.recurringYr.total + tco.variableYr.total;
  const netBenefitYr = grossBenefitYr - annualCost;
  const monthlyNet = netBenefitYr / 12;
  const paybackMonths = monthlyNet > 0 ? tco.oneTime.total / monthlyNet : Infinity;
  const threeYearRoi = tco.threeYearTotal > 0 ? ((grossBenefitYr * 3 - tco.threeYearTotal) / tco.threeYearTotal) * 100 : 0;

  const r = state.rates.discountRatePct / 100;
  const npv = -tco.oneTime.total + [1, 2, 3].reduce((s, y) => s + netBenefitYr / Math.pow(1 + r, y), 0);

  const perInteractionNet = vol > 0 ? grossBenefitYr / 12 / vol : 0;
  const fixedMonthly = tco.oneTime.total / 36 + tco.recurringYr.total / 12;
  const breakEvenMonthlyVolume = perInteractionNet > 0 ? Math.round(fixedMonthly / perInteractionNet) : 0;

  return {
    containmentSavingYr, ahtSavingYr, outcomeValueYr, grossBenefitYr, netBenefitYr,
    paybackMonths, threeYearRoi, npv, breakEvenMonthlyVolume,
    byLever: [
      { name: `Containment uplift ${p.currentContainment}% → ${p.targetContainment}% (customer inputs × Gartner-shaped cost gap)`, value: containmentSavingYr, provenance: "estimate" },
      { name: "Handle-time reduction on human volume (15% with Assist — assumption)", value: ahtSavingYr, provenance: "assumption" },
      { name: "Outcome uplift (conversion / collections, 2% × $2 — conservative assumption)", value: outcomeValueYr, provenance: "assumption" },
    ],
  };
}

export function applyScenario(state: BuilderState, scenario: "conservative" | "expected" | "upside"): BuilderState {
  if (scenario === "expected") return state;
  const p = { ...state.profile };
  const rates = { ...state.rates };
  if (scenario === "conservative") {
    p.targetContainment = Math.max(p.currentContainment + 5, p.targetContainment - 15);
    rates.blendedRateWeek *= 1.2;
    rates.aiCostPerMin *= 1.25;
  } else {
    p.targetContainment = Math.min(90, p.targetContainment + 10);
    rates.blendedRateWeek *= 0.9;
    rates.aiCostPerMin *= 0.85;
  }
  return { ...state, profile: p, rates };
}

// ─── Recommendation engine ──────────────────────────────────────────────────

export type Recommendation = {
  pursuit: string;
  pursuitDetail: string;
  entryUseCase: string;
  pilotScope: string;
  firstChannels: string[];
  deferred: { name: string; reason: string }[];
  partnerProfile: string;
  timeToValueWeeks: number;
  risks: string[];
  stakeholders: string[];
  expansion: string[];
  warnings: string[];
};

export function computeRecommendation(state: BuilderState): Recommendation {
  const ind = INDUSTRY_DEFAULTS.find((i) => i.id === state.profile.industry) ?? INDUSTRY_DEFAULTS[0];
  const hasCC = state.channels.includes("contact-centre");
  const ccIsGecx = state.profile.ccPlatform === "gecx";
  const pursuit = hasCC
    ? (ccIsGecx ? "Joint: Agent Platform + GECX" : "Agent Platform-led, integrate incumbent CC")
    : "Agent Platform-led";
  const pursuitDetail = hasCC
    ? ccIsGecx
      ? "The customer runs Customer Engagement Suite: run one account plan with explicit swimlanes — GECX owns human-agent experience and CC modernization; Agent Platform owns the cross-enterprise agent layer."
      : "Escalations integrate into the incumbent CC platform with full context. Do not open a CC-replacement conversation; revisit GECX if a CC-platform decision activates."
    : "No contact-centre channel in scope — a clean Agent Platform pursuit with partner-delivered channels.";

  const effort = computeEffort(state);
  const deferred: { name: string; reason: string }[] = [];
  const selected = CAPABILITIES.filter((c) => state.capabilities.includes(c.id));
  for (const c of selected) {
    if (c.deferHint) deferred.push({ name: c.name, reason: c.deferHint });
    else if (c.complexity === 3 && !ind.capabilities.includes(c.id) && !c.core) deferred.push({ name: c.name, reason: "High complexity and not core to the entry use case — phase 2 candidate" });
  }
  for (const chId of state.channels) {
    const ch = CHANNELS.find((x) => x.id === chId)!;
    if (ch.complexity === 3 && !ind.channels.includes(chId)) deferred.push({ name: ch.name, reason: "Complex channel outside the entry use case — defer to expansion" });
  }

  const warnings: string[] = [];
  if (state.profile.residency === "mandatory") warnings.push("Mandatory data residency: confirm region availability for all selected models and speech services before proposal.");
  if (state.channels.includes("rcs")) warnings.push("RCS availability varies by carrier and country — verify per target market.");
  if (state.channels.includes("video")) warnings.push("Video raises complexity and cost materially — confirm it is essential to the entry use case.");
  if (state.profile.timelineWeeks < effort.total) warnings.push(`Selected scope needs ~${effort.total} person-weeks vs a ${state.profile.timelineWeeks}-week timeline — cut scope or extend the timeline.`);
  if (state.profile.cloud === "other") warnings.push("Customer's primary cloud is not Google Cloud — plan the landing-zone and data-access pattern early.");
  if (!state.capabilities.includes("escalation")) warnings.push("No human-escalation capability selected — every deployment requires a human fallback path.");

  return {
    pursuit, pursuitDetail,
    entryUseCase: ind.entryUseCase,
    pilotScope: `${ind.entryUseCase} on ${state.channels.slice(0, 2).map((c) => CHANNELS.find((x) => x.id === c)?.name).join(" + ")}, ${Math.min(state.profile.languages, 3)} language(s), 8–12 weeks, explicit success thresholds`,
    firstChannels: ind.channels.filter((c) => state.channels.includes(c)).slice(0, 3),
    deferred: deferred.slice(0, 6),
    partnerProfile: ind.id === "gcc"
      ? "GSI or specialist with ITSM/HRMS depth, IdP expertise, and managed-operations capability"
      : `Voice/channel specialist with ${ind.name} connector experience, ${state.profile.languages > 3 ? "strong Indic/regional language coverage, " : ""}and production-operations track record`,
    timeToValueWeeks: Math.min(12, Math.max(8, Math.round(effort.total / 3))),
    risks: ind.risks,
    stakeholders: ind.stakeholders,
    expansion: ind.expansion,
    warnings,
  };
}

export const OUTCOME_OPTIONS = [
  "Reduce cost per interaction", "Increase containment", "Improve collections / cure rate",
  "Increase conversion", "Reduce churn", "Improve CSAT / NPS", "Reduce compliance risk",
  "Improve employee productivity", "Expand language coverage", "24/7 availability",
];
