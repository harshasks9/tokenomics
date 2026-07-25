// Solution Builder engine — Tilicho Labs-led delivery model.
// Every number is an EDITABLE modelling default, never a quote. Provenance:
// "contracted" (indicative partner rate), "customer" (customer-provided),
// "tilicho" (Tilicho Labs estimate), "benchmark" (cited), "assumption"
// (seller default), "estimate" (system-generated).

export type Provenance = "contracted" | "customer" | "tilicho" | "benchmark" | "assumption" | "estimate";

export const PROVENANCE_META: Record<Provenance, { label: string; color: string }> = {
  contracted: { label: "Indicative contracted rate", color: "#00838F" },
  customer: { label: "Customer input", color: "#188038" },
  tilicho: { label: "Tilicho Labs estimate", color: "#0F9D8F" },
  benchmark: { label: "Industry benchmark", color: "#1A73E8" },
  assumption: { label: "Seller assumption", color: "#D97706" },
  estimate: { label: "System estimate", color: "#7C3AED" },
};

// ─── Guided inputs ──────────────────────────────────────────────────────────

export const OUTCOMES = [
  { id: "cost", label: "Reduce cost to serve", caps: ["self-service", "transactions"] },
  { id: "revenue", label: "Grow revenue / conversion", caps: ["outbound", "lead-pack", "personalization"] },
  { id: "collections", label: "Improve collections / cure rate", caps: ["outbound", "collections-pack", "transactions"] },
  { id: "cx", label: "Improve customer experience", caps: ["self-service", "personalization", "multilingual"] },
  { id: "employee", label: "Improve employee productivity", caps: ["employee-pack", "workflow", "approvals"] },
  { id: "risk", label: "Reduce compliance risk", caps: ["quality", "approvals", "consent"] },
];

export const USE_CASES_BY_INDUSTRY: Record<string, { id: string; label: string }[]> = {
  fsi: [
    { id: "collections", label: "Early-bucket collections" },
    { id: "servicing", label: "Loan & card servicing" },
    { id: "leads", label: "Lead qualification" },
    { id: "verification", label: "Fraud verification callbacks" },
  ],
  retail: [
    { id: "wismo", label: "Order status & delivery (WISMO)" },
    { id: "returns", label: "Returns & exchanges" },
    { id: "cart", label: "Abandoned-cart recovery" },
    { id: "seller", label: "Marketplace seller support" },
  ],
  telecom: [
    { id: "billing", label: "Plan / billing / balance support" },
    { id: "recharge", label: "Recharge reminders & collections" },
    { id: "retention", label: "Churn prevention outreach" },
    { id: "outage", label: "Network triage & outage comms" },
  ],
  education: [
    { id: "admissions", label: "Admissions inquiry & nurture" },
    { id: "fees", label: "Fee reminders & payment support" },
    { id: "onboarding", label: "Student onboarding" },
    { id: "campus", label: "Campus help desk" },
  ],
  gcc: [
    { id: "itdesk", label: "IT service desk (L0/L1)" },
    { id: "hr", label: "HR support" },
    { id: "finance", label: "Finance operations support" },
    { id: "onboard", label: "Employee onboarding orchestration" },
  ],
};

export const SYSTEM_OPTIONS: Record<string, string[]> = {
  fsi: ["Core banking", "Collections CRM", "Payment gateway", "LOS / LMS", "KYC system", "Data warehouse"],
  retail: ["Order management (OMS)", "Logistics / 3PL", "Payment gateway", "CRM / ticketing", "Loyalty / CDP", "Inventory"],
  telecom: ["BSS (billing)", "OSS / NOC feeds", "Recharge gateway", "CRM", "Field service", "Data warehouse"],
  education: ["Admissions CRM", "Student information system", "Fee / payment gateway", "LMS", "Calendar", "Knowledge base"],
  gcc: ["ITSM (ServiceNow etc.)", "HRMS (Workday etc.)", "Identity provider / AD", "ERP / finance", "Procurement", "Knowledge base"],
};

export const CHANNEL_OPTIONS = [
  { id: "voice", label: "Voice", complexity: 3 },
  { id: "whatsapp", label: "WhatsApp", complexity: 2 },
  { id: "web-chat", label: "Web chat", complexity: 1 },
  { id: "sms", label: "SMS", complexity: 1 },
  { id: "email", label: "Email", complexity: 1 },
  { id: "mobile-app", label: "Mobile app", complexity: 2 },
  { id: "rcs", label: "RCS", complexity: 2 },
  { id: "employee-desktop", label: "Employee chat", complexity: 1 },
  { id: "contact-centre", label: "Contact-centre escalation", complexity: 2 },
];

// Tilicho Labs platform scope (validate exact coverage during implementation)
export const TILICHO_CAPS = [
  "Voice-call handling & telephony integration",
  "Conversational execution (API-based)",
  "Call orchestration & routing",
  "Session & state management",
  "Channel infrastructure (WhatsApp, SMS, chat, email)",
  "Operational telemetry",
  "Deployment & integration accelerators",
  "Customer-system integration build",
  "Managed optimization (optional)",
];

export const GOOGLE_CAPS = [
  "Gemini intelligence & reasoning",
  "Enterprise grounding with citations",
  "Domain & workflow agents",
  "Multi-agent orchestration",
  "Enterprise-system actions (governed tool-calling)",
  "Security, identity & data residency",
  "Evaluation & observability",
  "Data & analytics (BigQuery, Looker)",
];

export type IndustryDefault = {
  id: string;
  name: string;
  monthlyInteractions: number;
  costPerInteraction: number;
  ahtMinutes: number;
  currentContainment: number;
  targetContainment: number;
  escalationRate: number;
  languages: number;
  valuePerResolved: number;
  stakeholders: string[];
  risks: string[];
  expansion: string[];
  defaultChannels: string[];
  defaultSystems: string[];
};

export const INDUSTRY_DEFAULTS: IndustryDefault[] = [
  { id: "fsi", name: "Financial Services", monthlyInteractions: 500000, costPerInteraction: 2.0, ahtMinutes: 4, currentContainment: 10, targetContainment: 60, escalationRate: 15, languages: 4, valuePerResolved: 2.5, stakeholders: ["Collections head", "CRO / compliance", "CIO", "Core-banking owner", "Procurement"], risks: ["Core-banking API readiness", "Regulator engagement on AI conversations", "Offer-matrix sign-off cycle"], expansion: ["Pre-due reminders", "Inbound servicing", "Fraud verification callbacks"], defaultChannels: ["voice", "whatsapp", "contact-centre"], defaultSystems: ["Core banking", "Collections CRM", "Payment gateway"] },
  { id: "retail", name: "Retail & eCommerce", monthlyInteractions: 800000, costPerInteraction: 1.2, ahtMinutes: 3, currentContainment: 20, targetContainment: 70, escalationRate: 12, languages: 3, valuePerResolved: 1.2, stakeholders: ["CX / service head", "COO / logistics", "CIO", "eCommerce head"], risks: ["3PL API variability", "Peak-season change freeze", "Refund-policy tier approvals"], expansion: ["Returns automation", "Cart recovery", "Guided selling"], defaultChannels: ["whatsapp", "web-chat", "contact-centre"], defaultSystems: ["Order management (OMS)", "Logistics / 3PL", "CRM / ticketing"] },
  { id: "telecom", name: "Telecommunications", monthlyInteractions: 5000000, costPerInteraction: 0.9, ahtMinutes: 3, currentContainment: 25, targetContainment: 65, escalationRate: 12, languages: 8, valuePerResolved: 0.4, stakeholders: ["CS head", "CTO / BSS owner", "CMO (retention)", "Collections head"], risks: ["BSS/OSS integration depth", "Peak-load latency SLOs", "TRAI/DND compliance sign-off"], expansion: ["Churn outreach", "Network triage + outage comms", "Collections"], defaultChannels: ["voice", "whatsapp", "sms", "contact-centre"], defaultSystems: ["BSS (billing)", "Recharge gateway", "CRM"] },
  { id: "education", name: "Education", monthlyInteractions: 60000, costPerInteraction: 2.0, ahtMinutes: 5, currentContainment: 5, targetContainment: 65, escalationRate: 20, languages: 3, valuePerResolved: 15, stakeholders: ["Admissions director", "VC / dean", "IT director", "Finance / registrar"], risks: ["CRM data hygiene", "Peak-intake timing", "Student-data privacy review"], expansion: ["Fee reminders", "Onboarding", "Campus help desk"], defaultChannels: ["whatsapp", "web-chat", "voice"], defaultSystems: ["Admissions CRM", "Student information system", "Calendar"] },
  { id: "gcc", name: "GCC & BPM", monthlyInteractions: 120000, costPerInteraction: 4.0, ahtMinutes: 6, currentContainment: 15, targetContainment: 55, escalationRate: 25, languages: 2, valuePerResolved: 0, stakeholders: ["GCC site leader", "Global CIO", "Shared-services head", "CISO", "HRBP lead"], risks: ["ITSM/HRMS write-access approvals", "Labor consultation where applicable", "Entitlement-catalog completeness"], expansion: ["Finance & procurement towers", "Onboarding orchestration", "Agent-building CoE"], defaultChannels: ["employee-desktop", "web-chat", "email"], defaultSystems: ["ITSM (ServiceNow etc.)", "HRMS (Workday etc.)", "Identity provider / AD"] },
];

// ─── Editable rate card ─────────────────────────────────────────────────────

export type Rates = {
  tilichoUsagePerMin: number;   // contracted-indicative
  carrierPerMin: number;        // NOT included in usage rate
  messagingPerInteraction: number;
  gcpPerInteraction: number;    // Gemini + grounding + analytics
  tilichoIntegrationBase: number; // one-time platform integration & deployment
  perSystemIntegration: number; // per connected enterprise system
  perChannelSetup: number;
  workflowConfigBase: number;
  securityComplianceSetup: number;
  testingEvaluation: number;
  productionReadiness: number;
  changeMgmtPct: number;
  managedServicePct: number;    // % of monthly usage, floor applies
  managedServiceFloor: number;
  discountRatePct: number;
};

export const DEFAULT_RATES: Rates = {
  tilichoUsagePerMin: 0.15,
  carrierPerMin: 0.01,
  messagingPerInteraction: 0.03,
  gcpPerInteraction: 0.02,
  tilichoIntegrationBase: 60000,
  perSystemIntegration: 15000,
  perChannelSetup: 8000,
  workflowConfigBase: 25000,
  securityComplianceSetup: 15000,
  testingEvaluation: 12000,
  productionReadiness: 10000,
  changeMgmtPct: 12,
  managedServicePct: 12,
  managedServiceFloor: 4000,
  discountRatePct: 10,
};

export const RATE_LABELS: { key: keyof Rates; label: string; prov: Provenance }[] = [
  { key: "tilichoUsagePerMin", label: "Tilicho usage rate ($/call-min) — usage only, not fully loaded", prov: "contracted" },
  { key: "carrierPerMin", label: "Carrier / telephony ($/min, billed separately)", prov: "assumption" },
  { key: "messagingPerInteraction", label: "Messaging cost per interaction ($)", prov: "assumption" },
  { key: "gcpPerInteraction", label: "Google Cloud consumption per interaction ($)", prov: "estimate" },
  { key: "tilichoIntegrationBase", label: "Tilicho integration & deployment fee (base, $)", prov: "tilicho" },
  { key: "perSystemIntegration", label: "Per enterprise-system integration ($)", prov: "tilicho" },
  { key: "perChannelSetup", label: "Per channel setup ($)", prov: "tilicho" },
  { key: "workflowConfigBase", label: "Industry workflow configuration ($)", prov: "tilicho" },
  { key: "securityComplianceSetup", label: "Security & compliance setup ($)", prov: "assumption" },
  { key: "testingEvaluation", label: "Testing & evaluation ($)", prov: "assumption" },
  { key: "productionReadiness", label: "Production-readiness support ($)", prov: "assumption" },
  { key: "changeMgmtPct", label: "Change management (% of build)", prov: "assumption" },
  { key: "managedServicePct", label: "Managed service (% of monthly usage)", prov: "tilicho" },
  { key: "managedServiceFloor", label: "Managed service monthly floor ($)", prov: "tilicho" },
  { key: "discountRatePct", label: "NPV discount rate (%)", prov: "assumption" },
];

// ─── State ──────────────────────────────────────────────────────────────────

export type BuilderState = {
  industry: string;
  customerName: string;
  outcome: string;
  useCase: string;
  channels: string[];
  systems: string[];
  monthlyInteractions: number;
  // advanced
  costPerInteraction: number;
  ahtMinutes: number;
  currentContainment: number;
  targetContainment: number;
  escalationRate: number;
  languages: number;
  managed: boolean;
  rates: Rates;
};

export function defaultBuilderState(industry = "fsi"): BuilderState {
  const ind = INDUSTRY_DEFAULTS.find((i) => i.id === industry)!;
  return {
    industry: ind.id,
    customerName: "",
    outcome: industry === "gcc" ? "employee" : "cost",
    useCase: USE_CASES_BY_INDUSTRY[ind.id][0].id,
    channels: [...ind.defaultChannels],
    systems: [...ind.defaultSystems],
    monthlyInteractions: ind.monthlyInteractions,
    costPerInteraction: ind.costPerInteraction,
    ahtMinutes: ind.ahtMinutes,
    currentContainment: ind.currentContainment,
    targetContainment: ind.targetContainment,
    escalationRate: ind.escalationRate,
    languages: ind.languages,
    managed: true,
    rates: { ...DEFAULT_RATES },
  };
}

// ─── TCO ────────────────────────────────────────────────────────────────────

export type Tco = {
  oneTime: {
    discovery: number; tilichoIntegration: number; systemIntegrations: number;
    workflowConfig: number; security: number; testing: number; changeMgmt: number; prodReadiness: number; total: number;
  };
  monthly: {
    tilichoUsage: number; carrier: number; messaging: number; gcp: number;
    managed: number; retainedHuman: number; total: number;
  };
  annualRunRate: number;
  threeYearTco: number;
  costPerInteraction: number;
  costPerResolved: number;
};

export function computeTco(s: BuilderState): Tco {
  const r = s.rates;
  const discovery = 25000;
  const tilichoIntegration = r.tilichoIntegrationBase + s.channels.length * r.perChannelSetup;
  const systemIntegrations = s.systems.length * r.perSystemIntegration;
  const workflowConfig = r.workflowConfigBase + Math.max(0, s.languages - 2) * 4000;
  const security = r.securityComplianceSetup;
  const testing = r.testingEvaluation;
  const prodReadiness = r.productionReadiness;
  const buildSubtotal = discovery + tilichoIntegration + systemIntegrations + workflowConfig + security + testing + prodReadiness;
  const changeMgmt = buildSubtotal * (r.changeMgmtPct / 100);
  const oneTimeTotal = buildSubtotal + changeMgmt;

  const automatedVol = s.monthlyInteractions * (s.targetContainment / 100);
  const hasVoice = s.channels.includes("voice");
  const msgChannels = s.channels.filter((c) => ["whatsapp", "sms", "rcs", "web-chat", "email", "employee-desktop", "mobile-app"].includes(c)).length;
  const voiceShare = hasVoice ? (msgChannels > 0 ? 0.5 : 0.95) : 0;
  const voiceMinutes = automatedVol * voiceShare * s.ahtMinutes;

  const tilichoUsage = voiceMinutes * r.tilichoUsagePerMin + automatedVol * (1 - voiceShare) * r.messagingPerInteraction;
  const carrier = voiceMinutes * r.carrierPerMin;
  const messaging = 0; // folded into tilichoUsage message-side term
  const gcp = automatedVol * r.gcpPerInteraction;
  const managed = s.managed ? Math.max(r.managedServiceFloor, (tilichoUsage + gcp) * (r.managedServicePct / 100)) : 0;
  const humanCostPerMin = s.ahtMinutes > 0 ? s.costPerInteraction / s.ahtMinutes : 0.4;
  const retainedHuman = s.monthlyInteractions * (s.escalationRate / 100) * s.ahtMinutes * 0.6 * humanCostPerMin;
  const monthlyTotal = tilichoUsage + carrier + messaging + gcp + managed + retainedHuman;

  const annualRunRate = monthlyTotal * 12;
  const threeYearTco = oneTimeTotal + annualRunRate * 3;
  const costPerInteraction = s.monthlyInteractions > 0 ? monthlyTotal / s.monthlyInteractions : 0;
  const costPerResolved = automatedVol > 0 ? monthlyTotal / automatedVol : 0;

  return {
    oneTime: { discovery, tilichoIntegration, systemIntegrations, workflowConfig, security, testing, changeMgmt, prodReadiness, total: oneTimeTotal },
    monthly: { tilichoUsage, carrier, messaging, gcp, managed, retainedHuman, total: monthlyTotal },
    annualRunRate, threeYearTco, costPerInteraction, costPerResolved,
  };
}

// ─── ROI ────────────────────────────────────────────────────────────────────

export type Roi = {
  grossBenefitYr: number;
  netBenefitYr: number;
  paybackMonths: number;
  threeYearRoi: number;
  npv: number;
  byLever: { name: string; value: number; prov: Provenance }[];
};

export function computeRoi(s: BuilderState, tco: Tco): Roi {
  const ind = INDUSTRY_DEFAULTS.find((i) => i.id === s.industry)!;
  const upliftShare = Math.max(0, (s.targetContainment - s.currentContainment) / 100);
  const containment = s.monthlyInteractions * upliftShare * s.costPerInteraction * 12;
  const outcomeLever = ["revenue", "collections"].includes(s.outcome)
    ? s.monthlyInteractions * (s.targetContainment / 100) * 0.02 * ind.valuePerResolved * 12
    : 0;
  const grossBenefitYr = containment + outcomeLever;
  const netBenefitYr = grossBenefitYr - tco.annualRunRate;
  const monthlyNet = netBenefitYr / 12;
  const paybackMonths = monthlyNet > 0 ? tco.oneTime.total / monthlyNet : Infinity;
  const threeYearRoi = tco.threeYearTco > 0 ? ((grossBenefitYr * 3 - tco.threeYearTco) / tco.threeYearTco) * 100 : 0;
  const d = s.rates.discountRatePct / 100;
  const npv = -tco.oneTime.total + [1, 2, 3].reduce((acc, y) => acc + netBenefitYr / Math.pow(1 + d, y), 0);
  return {
    grossBenefitYr, netBenefitYr, paybackMonths, threeYearRoi, npv,
    byLever: [
      { name: `Containment uplift ${s.currentContainment}% → ${s.targetContainment}% at your cost per interaction`, value: containment, prov: "estimate" },
      ...(outcomeLever > 0 ? [{ name: "Outcome uplift (2% of automated volume × industry value per resolved — conservative)", value: outcomeLever, prov: "assumption" as Provenance }] : []),
    ],
  };
}

export function applyScenario(s: BuilderState, scenario: "conservative" | "expected" | "upside"): BuilderState {
  if (scenario === "expected") return s;
  const rates = { ...s.rates };
  const next = { ...s, rates };
  if (scenario === "conservative") {
    next.targetContainment = Math.max(s.currentContainment + 5, s.targetContainment - 15);
    rates.tilichoIntegrationBase *= 1.25;
    rates.tilichoUsagePerMin *= 1.15;
    rates.gcpPerInteraction *= 1.25;
  } else {
    next.targetContainment = Math.min(90, s.targetContainment + 10);
    rates.tilichoIntegrationBase *= 0.9;
    rates.tilichoUsagePerMin *= 0.9;
    rates.gcpPerInteraction *= 0.85;
  }
  return next;
}

// ─── Recommendation ─────────────────────────────────────────────────────────

export type Recommendation = {
  pursuit: string;
  pursuitDetail: string;
  pilotScope: string;
  timeToValueWeeks: number;
  warnings: string[];
  stakeholders: string[];
  risks: string[];
  expansion: string[];
  deferredChannels: string[];
};

export function computeRecommendation(s: BuilderState): Recommendation {
  const ind = INDUSTRY_DEFAULTS.find((i) => i.id === s.industry)!;
  const uc = USE_CASES_BY_INDUSTRY[s.industry].find((u) => u.id === s.useCase)!;
  const hasCC = s.channels.includes("contact-centre");
  const pursuit = hasCC ? "Agent Platform-led, integrate the contact-centre stack" : "Agent Platform-led";
  const pursuitDetail = hasCC
    ? "Human escalations land in the customer's existing contact-centre platform with full context. If a CC-platform decision is active, check the GECX decision tree and consider a joint pursuit."
    : "Clean Agent Platform pursuit; Tilicho Labs delivers channels and integration.";
  const warnings: string[] = [];
  if (s.channels.includes("rcs")) warnings.push("RCS availability varies by carrier and market — verify before proposing.");
  if (s.channels.length > 4) warnings.push("More than 4 channels in phase 1 stretches the pilot — consider deferring the least-used.");
  if (s.systems.length > 4) warnings.push("More than 4 system integrations in phase 1 extends timeline materially — sequence them.");
  if (!s.channels.includes("contact-centre") && s.escalationRate > 20) warnings.push("High escalation rate with no contact-centre channel — confirm where humans pick up.");
  warnings.push("Tilicho Labs capability coverage is validated during implementation — do not present unconfirmed capabilities as production-ready.");
  const complexity = s.channels.length + s.systems.length;
  const timeToValueWeeks = Math.min(14, Math.max(8, 6 + Math.round(complexity * 0.8)));
  return {
    pursuit, pursuitDetail,
    pilotScope: `${uc.label} on ${s.channels.slice(0, 2).map((c) => CHANNEL_OPTIONS.find((x) => x.id === c)?.label).join(" + ")}, ${Math.min(s.languages, 3)} language(s), ${timeToValueWeeks} weeks, connected to ${s.systems.slice(0, 2).join(" and ")}, explicit success thresholds and human fallback throughout`,
    timeToValueWeeks,
    warnings,
    stakeholders: ind.stakeholders,
    risks: ind.risks,
    expansion: ind.expansion,
    deferredChannels: s.channels.length > 3 ? s.channels.slice(3).map((c) => CHANNEL_OPTIONS.find((x) => x.id === c)?.label ?? c) : [],
  };
}
