import { callCost } from "../pricing";

// ─── S1: Build (GovTech Platform SDLC) ──────────────────────────────────────
// Reference: ISV building a multi-agency permitting + benefits platform
// (DMV modernization, SNAP/Medicaid eligibility, business licensing portal)
export const PS_S1 = {
  routineTask: { inTok: 40_000, outTok: 10_000 }, // CRUD, form handlers, legacy wrappers
  midTask:     { inTok: 50_000, outTok: 12_000 }, // API adapters, IaC templates, E2E tests
  complexTask: { inTok: 80_000, outTok: 20_000 }, // FedRAMP architecture, fraud logic, rules engines
  defaultMix:  { routinePct: 0.50, midPct: 0.30, complexPct: 0.20 },
  tasksPerDevPerSprint: 45,
  defaults: { devs: 12, sprints: 13 },
};

export interface PsS1Task {
  title: string;
  tier: "flashLite" | "flash" | "opus";
  why: string;
}

export const PS_S1_TASKS: PsS1Task[] = [
  // Opus — architecture, compliance, AI logic
  { tier: "opus", title: "Design FedRAMP-compliant identity federation (PIV/CAC)", why: "Zero-error security: mapping PIV/CAC credentials to agency roles requires deep PKI knowledge and FISMA compliance reasoning across an entire system boundary." },
  { tier: "opus", title: "Architect multi-agency data governance model", why: "Cross-agency data sharing requires PII classification, retention policies, and consent frameworks that vary by regulation and agency jurisdiction." },
  { tier: "opus", title: "Build AI-assisted fraud detection for benefits eligibility", why: "Complex rule system — false positives deny benefits; false negatives enable fraud. Multi-signal reasoning with direct human impact required." },
  { tier: "opus", title: "Design ATO documentation generation pipeline", why: "Authority to Operate packages require tracing security controls across an entire system boundary — massive context, high stakes." },
  { tier: "opus", title: "Implement multi-jurisdiction business rules engine", why: "Permitting logic varies by agency, county, and regulation — combinatorial edge cases need deep reasoning to avoid wrongful denial." },
  // Flash — mid-tier integrations and structured work
  { tier: "flash", title: "Build REST adapters for legacy COBOL benefits systems", why: "COBOL field mapping is structured but nuanced — Flash handles the documented patterns; Opus reserved for schema ambiguity." },
  { tier: "flash", title: "Generate IaC templates for GovCloud deployment", why: "CloudFormation/Terraform from architecture diagrams — structured output on well-defined cloud resource patterns." },
  { tier: "flash", title: "Write E2E tests for disability claims workflow", why: "Step-by-step test generation from documented workflow — pattern-based with clear business rules." },
  { tier: "flash", title: "Implement PII audit logging across all data access", why: "Repetitive logging instrumentation from access control specs — structured but requires correctness." },
  { tier: "flash", title: "Build form validation for 15 federal permit types", why: "Validation rules from published permit specifications — mechanical but needs field-level accuracy." },
  { tier: "flash", title: "Generate OpenAPI specs for inter-agency data exchange", why: "Extracting types and descriptions from existing handlers — pure documentation generation." },
  // Flash-Lite — CRUD, scaffolding, boilerplate
  { tier: "flashLite", title: "Scaffold CRUD for benefit recipient profiles", why: "Standard database operations on well-defined schema — no reasoning, pure generation." },
  { tier: "flashLite", title: "Generate permit status notification email templates", why: "Templated content from brand guide — entirely mechanical generation." },
  { tier: "flashLite", title: "Write DB migration scripts for contact schema updates", why: "ALTER TABLE statements from diff specs — no ambiguity, just correct SQL." },
  { tier: "flashLite", title: "Add address validation to all form inputs", why: "Repetitive USPS API call boilerplate across 30+ form fields." },
  { tier: "flashLite", title: "Seed fixture data for 50 test agency accounts", why: "Synthetic government agency data following schema specs — creative but mechanical." },
  { tier: "flashLite", title: "Write unit tests for 40 REST endpoints", why: "Test generation from controller signatures — entirely pattern-based." },
  { tier: "flashLite", title: "Generate Storybook stories for gov design system", why: "Boilerplate from component props — copy-paste with name substitution." },
  { tier: "flashLite", title: "Write Dockerfile for FIPS 140-2 compliant local dev", why: "Standard container config with encryption flags — documented recipe." },
  { tier: "flashLite", title: "Build CSV export for agency reporting dashboard", why: "Map-to-CSV from existing TypeScript data types — mechanical column alignment." },
  { tier: "flashLite", title: "Create Swagger docs for public-facing citizen API", why: "Description extraction from JSDoc comments — no new reasoning required." },
];

export type PsS1Baseline = "allOpus" | "allSonnet" | "geminiTiered";

export function psS1Costs(devs: number, sprints: number, baseline: PsS1Baseline = "geminiTiered") {
  const totalTasks = devs * PS_S1.tasksPerDevPerSprint;
  const { routinePct, midPct, complexPct } = PS_S1.defaultMix;

  const routine = totalTasks * routinePct;
  const mid     = totalTasks * midPct;
  const complex = totalTasks * complexPct;

  const { routineTask, midTask, complexTask } = PS_S1;

  const allOpusPerSprint =
    routine * callCost("opus", routineTask.inTok, routineTask.outTok) +
    mid     * callCost("opus", midTask.inTok,     midTask.outTok) +
    complex * callCost("opus", complexTask.inTok, complexTask.outTok);

  const allSonnetPerSprint =
    routine * callCost("sonnet", routineTask.inTok, routineTask.outTok) +
    mid     * callCost("sonnet", midTask.inTok,     midTask.outTok) +
    complex * callCost("sonnet", complexTask.inTok, complexTask.outTok);

  const geminiTieredPerSprint =
    routine * callCost("flashLite", routineTask.inTok, routineTask.outTok) +
    mid     * callCost("flash",     midTask.inTok,     midTask.outTok) +
    complex * callCost("opus",      complexTask.inTok, complexTask.outTok);

  const chosenPerSprint =
    baseline === "allOpus" ? allOpusPerSprint :
    baseline === "allSonnet" ? allSonnetPerSprint :
    geminiTieredPerSprint;

  return {
    allOpusPerSprint,      allOpusTotal:      allOpusPerSprint      * sprints,
    allSonnetPerSprint,    allSonnetTotal:    allSonnetPerSprint    * sprints,
    geminiTieredPerSprint, geminiTieredTotal: geminiTieredPerSprint * sprints,
    chosenPerSprint,       chosenTotal:       chosenPerSprint       * sprints,
  };
}

// ─── S2: Citizen Services Chatbot ───────────────────────────────────────────
// Multi-service portal: DMV, benefits, permits, FOIA
export const PS_S2 = {
  query: { inTok: 2_000, outTok: 400 },
  tieredMix: { flashLitePct: 0.65, flashPct: 0.25, opusPct: 0.10 },
  defaults: { queriesPerMonth: 5_000_000 },
};

export function psS2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = PS_S2.query;
  const { flashLitePct, flashPct, opusPct } = PS_S2.tieredMix;

  const perQueryOpus      = callCost("opus",      inTok, outTok);
  const perQueryFlash     = callCost("flash",     inTok, outTok);
  const perQueryFlashLite = callCost("flashLite", inTok, outTok);

  const perQueryTiered =
    flashLitePct * perQueryFlashLite +
    flashPct     * perQueryFlash +
    opusPct      * perQueryOpus;

  const allOpus = queriesPerMonth * perQueryOpus;
  const tiered  = queriesPerMonth * perQueryTiered;

  return {
    allOpus, tiered,
    allOpusAnnual: allOpus * 12,
    tieredAnnual:  tiered  * 12,
    perQueryOpus, perQueryFlash, perQueryFlashLite, perQueryTiered,
  };
}

export interface PsS2QAPair {
  id: string;
  question: string;
  category: "routine" | "faq" | "complex";
  answers: { flashLite: string; flash: string; opus: string };
  scores: { flashLite: number; flash: number; opus: number };
  sellerNote?: string;
}

export const PS_S2_QA: PsS2QAPair[] = [
  {
    id: "q1",
    category: "routine",
    question: "What documents do I need to renew my driver's license?",
    answers: {
      flashLite: "To renew your driver's license, bring: (1) Your current license, (2) Proof of Social Security number, (3) Two proofs of state residency (utility bill, bank statement dated within 60 days), (4) $32 renewal fee. Appointments available at DMV.gov.",
      flash:     "To renew your license, you'll need:\n• **Current license** (or expired within 1 year)\n• **SSN verification** (card, W-2, or SSA letter)\n• **Two residency docs** dated within 60 days (utility bill, bank statement, or mortgage)\n• **$32 fee** (cash or card)\n\nNote: If you need a REAL ID for domestic flights, also bring your birth certificate or passport.\n\nBook an appointment at DMV.gov to skip the walk-in queue.",
      opus:      "Here's your complete renewal checklist:\n\n**Required Documents**\n• Current license or expired license (up to 1 year)\n• SSN verification (card, W-2, or SSA letter)\n• Two proof-of-residency docs dated within 60 days: utility bill, bank statement, mortgage, or lease\n• $32 fee (cash, card, or money order)\n\n**Your situation**: Your current license expires in 47 days — schedule within the next 2 weeks.\n\n**REAL ID upgrade** (if needed for domestic flights after May 2025):\nAlso bring birth certificate or passport + all name-change documents.\n\nShall I book a DMV appointment for you at the closest location to your address?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q2",
    category: "routine",
    question: "Where's my state tax refund?",
    answers: {
      flashLite: "Your 2025 state tax refund of $1,240 is processing. Expected deposit to your Bank of America account ending in 4821 by June 20, 2026.",
      flash:     "Your 2025 state tax return status:\n• **Status**: Processing (Day 8 of 14–21)\n• **Refund**: $1,240 → direct deposit to Bank of America ····4821\n• **Expected arrival**: June 20, 2026\n\nNo action needed — your return is on track.",
      opus:      "Your 2025 state tax refund:\n\n• **Return accepted**: June 1, 2026 ✓\n• **Status**: Processing (Day 8 of typically 14–21 days)\n• **Amount**: $1,240 → Bank of America ····4821\n• **Estimated arrival**: June 20–21, 2026\n\nYour return is on track. If not received by June 28, that would warrant a follow-up. Is there anything else about your state taxes I can help with?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q3",
    category: "faq",
    question: "What benefits is my family eligible for as a military veteran household?",
    answers: {
      flashLite: "As a veteran household you may qualify for: VA healthcare, disability compensation, GI Bill education benefits, VA home loans, SNAP/food assistance, and state property tax exemptions. Contact your local VA office for eligibility.",
      flash:     "As a veteran household, you may qualify for:\n\n**Federal**\n• **VA Healthcare**: Free or low-cost care at VA facilities\n• **Disability Compensation**: If service-connected disability rated ≥10%\n• **GI Bill (Ch. 33)**: Education benefits for you or dependents\n• **VA Home Loan**: No down payment, no PMI mortgage guarantee\n\n**State**\n• Property tax exemption (varies by disability rating)\n• State veterans bonus/pension programs\n• Means-tested: SNAP/EBT, Medicaid/CHIP for dependents\n\nTo determine exact eligibility, I'll need your discharge status and disability rating.",
      opus:      "Based on your veteran household profile, here's a personalized benefits analysis:\n\n**VA Benefits**\n• **VA Healthcare**: Your service dates and honorable discharge qualify you for Priority Group 5 care\n• **Disability Compensation**: Service-connected conditions range from $171/mo (10%) to $3,737/mo (100% + dependents)\n• **GI Bill (Ch. 33)**: 8 years of service = 100% benefit — full tuition + $1,050/mo housing allowance for 36 months\n\n**Financial**\n• **VA Home Loan**: COE entitlement confirmed — no down payment, no PMI. Current VA rate ~6.2%\n• **SNAP**: Family of 4 under $3,300/mo income → ~$766/mo in SNAP benefits\n• **EITC**: Estimated $2,400–$3,600 credit depending on final income\n\n**State-Specific**\n• Property tax: 50% reduction if VA rating ≥50%\n• State veterans education grant: $2,500/semester at state universities\n\n**Immediate actions:**\n1. File VA disability claim if not yet filed (avg recovery: +$800/mo)\n2. Apply for SNAP — I can pre-fill your application\n3. Request GI Bill Certificate of Eligibility\n\nWant me to start any of these?",
    },
    scores: { flashLite: 3, flash: 4, opus: 5 },
    sellerNote: "Benefits eligibility is AI's highest-value moment in government. Opus connects veteran profile to federal, state, and means-tested programs with personalized dollar amounts. Flash-Lite gives a list; Opus creates an action plan with $800+/mo difference.",
  },
  {
    id: "q4",
    category: "faq",
    question: "I want to open a food truck business — what permits do I need?",
    answers: {
      flashLite: "Food truck permits typically include: business license, mobile food vendor permit, health department permit, fire safety inspection, and parking/vending permits. Requirements vary by city. Contact your local permitting office.",
      flash:     "To open a food truck in your city, you'll need:\n\n• **Business license** — Register LLC/sole prop with the state ($50–100)\n• **Mobile Food Facility Permit** — County Health Dept inspection ($150–300/yr)\n• **Food Handler Certification** — All staff must be certified\n• **Fire Safety Inspection** — Ansul system + suppression certification\n• **Commissary Agreement** — Licensed kitchen for prep/storage\n• **Vending location permits** — Per-location or zone permit\n\nEstimated time to open: 6–10 weeks if applications run in parallel.",
      opus:      "Here's your complete food truck permitting roadmap:\n\n**Phase 1 — Business Formation (Week 1–2)**\n• Register your LLC with Secretary of State ($75, 3–5 days online)\n• Get EIN from IRS.gov (free, instant)\n• Open business bank account\n\n**Phase 2 — Health & Safety (Week 2–6)** ← longest lead time\n• **Mobile Food Facility Permit** (County Health): $285/yr — schedule inspection early; slots book 3–4 weeks out\n• **Commissary Agreement**: Licensed kitchen required before health dept inspection (~$15–25/hr)\n• **Food Manager Certification**: ServSafe exam ($150) — required on staff\n• **Fire Safety**: LP gas + Ansul suppression system ($200–400)\n\n**Phase 3 — Vending Locations (Ongoing)**\n• **Vending Zone Permit**: $150/zone/year; your city has 12 approved zones\n• **Special Event Permits**: $25–75 per farmers market or festival\n\n**Total first-year estimate: $1,200–1,800** in permits and fees\n**Realistic timeline: 8–10 weeks** — health dept is the bottleneck\n\nShall I submit your pre-application to County Health and show you commissaries within 5 miles?",
    },
    scores: { flashLite: 3, flash: 4, opus: 5 },
  },
  {
    id: "q5",
    category: "complex",
    question: "My SNAP benefits were terminated last month. How do I appeal and what are my rights?",
    answers: {
      flashLite: "You have the right to appeal a SNAP termination. File a fair hearing request within 90 days of your notice. You may request continued benefits during the appeal. Contact your local SNAP office.",
      flash:     "**Time-sensitive — act within 10 days:**\n\n• If you appeal within **10 days** of your termination notice, benefits can continue during the appeal (\"aid paid pending\")\n• Request a **fair hearing** within 90 days of the notice\n• Hearing scheduled within 30 days of your request\n• Decision within 60 days of hearing\n\n**Common grounds for reversal**: Failure to give adequate notice, income calculation errors, missing verification sent to wrong address.\n\nCall 1-800-XXX-XXXX to file immediately. I can help draft your appeal letter.",
      opus:      "This is time-sensitive. Your termination notice was dated May 15.\n\n**Most Important — Aid Paid Pending:**\nIf you appeal within **10 days of the notice date**, your benefits must continue at the previous level while the appeal is pending. Today is June 14, so you are within the window if you received the notice on or after June 4.\n\n→ **Call 1-866-XXX-XXXX now** and say: \"I want to request a fair hearing AND aid paid pending for case #[your number].\"\n\n**Your Legal Rights**\n• Fair hearing must be scheduled within **30 days** of your request\n• You can bring a free representative — your county has 3 legal aid organizations specializing in benefits appeals\n• Written decision within **60 days** of the hearing\n\n**Strongest Arguments for Your Case**\nYour household income of $2,100/mo (family of 3) is below the 130% FPL gross limit of $2,311 — this is strong factual grounds.\n\nAlso check your notice for:\n• **Procedural violation**: Was 10-day advance notice given? If not → automatic reinstatement\n• **Income error**: Were deductions (childcare, shelter) applied correctly?\n• **Wrong address**: Was verification sent to your current address?\n\n**Your next steps — today:**\n1. Call the hearing line (open until 5 PM)\n2. Request both fair hearing AND aid paid pending\n3. Confirm they log your request date\n\nWould you like me to draft your appeal letter with these arguments pre-filled?",
    },
    scores: { flashLite: 2, flash: 3, opus: 5 },
    sellerNote: "Benefits appeals are life-critical. Opus identifies the 10-day aid-paid-pending window that keeps a family fed during the appeal process. Flash-Lite just points to a phone number. This is where frontier reasoning delivers genuine public service value — and where agencies see the highest citizen satisfaction impact.",
  },
  {
    id: "q6",
    category: "complex",
    question: "Our federal contract was terminated for convenience — what are our rights and how do we recover costs?",
    answers: {
      flashLite: "Federal contracts can be terminated for convenience. You may be entitled to compensation for costs incurred plus reasonable profit. File a settlement proposal with the contracting officer. Consult a contracts attorney.",
      flash:     "A Termination for Convenience (T4C) entitles you to recover actual costs:\n\n**What you can claim**: Costs incurred before notice, settlement expenses, reasonable profit on completed work, demobilization costs\n\n**Process**:\n1. Submit settlement proposal within 1 year (FAR 49.206-3)\n2. Negotiate with the Termination Contracting Officer (TCO)\n3. If no agreement: Contract Disputes Act claim (6-year window)\n\n**Key deadlines**: 12 months for settlement proposal; 6 years for CDA claim.\n\nConsider a government contracts attorney — T4C settlements are negotiable and attorneys often recover 30–50% more.",
      opus:      "Under FAR Part 49, a T4C does not mean you absorb losses. Here's your full recovery roadmap:\n\n**Recoverable Costs (document all of these now)**\n• Direct costs: Labor, materials, subcontractor costs before termination notice\n• Indirect costs: Proportionate overhead + G&A applied to terminated work\n• Profit: Typically 6–12% on direct costs — negotiated\n• Settlement expenses: Legal and accounting costs to prepare your claim (fully recoverable, uncapped)\n• Subcontractor termination costs: You're liable to subs; recover from the government\n• Note: Anticipatory profits on unperformed work are NOT recoverable under T4C\n\n**Critical Timeline**\n• **Immediately**: Stop work on terminated items; preserve all cost records\n• **Within 30 days**: File Notice of Intent to submit settlement proposal with TCO\n• **Within 12 months**: Submit formal settlement proposal (FAR 49.206-3) — hard deadline\n• **Within 6 years**: File CDA claim if settlement negotiation fails\n\n**Your Recovery Range**\nBased on your contract ($485K, ~62% complete):\n• Minimum (bare costs): ~$185,000\n• Negotiated (with profit + overhead + settlement expenses): ~$225,000–260,000\n\n**Practical Next Steps**\n1. Request the contract file and termination documents from the TCO\n2. Engage a government contracts attorney (contingency arrangements at 20–25% are common)\n3. File Notice of Intent this week\n4. Pull your cost accounting records for the contract period\n\nWould you like help identifying certified government contracts attorneys or building your settlement proposal structure?",
    },
    scores: { flashLite: 2, flash: 3, opus: 5 },
    sellerNote: "Federal contract disputes require regulatory precision. Opus cites FAR 49.206-3, calculates recovery range, and identifies the 12-month hard deadline. The difference between Flash-Lite ('consult an attorney') and Opus (a structured legal roadmap) is measurable in dollars recovered.",
  },
];

// ─── S3: Government Document Processing ─────────────────────────────────────
// RFP analysis, FOIA redaction review, compliance audit processing
export const PS_S3 = {
  visionInput: 15_000, analysisOut: 1_200, structuredOut: 600, structuredReInput: 3_000,
  lanes: {
    pureClaude: { model: "opus" as const,  latencyMs: 3600, quality: 5, label: "Pure Claude Opus" },
    pureGemini: { model: "flash" as const, latencyMs: 700,  quality: 4, label: "Pure Gemini Flash" },
    hybrid:     { ingest: "flash" as const, analyze: "opus" as const, latencyMs: 2400, quality: 5, label: "Hybrid (Flash extract → Opus analyze)" },
  },
  defaults: { documentsPerYear: 1_000_000 },
};

export interface GovDocCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  findings: { item: string; status: string; trend: string }[];
}

export const PS_S3_CARDS: GovDocCard[] = [
  {
    id: "doc1",
    title: "Federal RFP — IT Modernization (SOW)",
    description: "Statement of Work for a $24M multi-year agency modernization contract",
    tags: ["rfp", "federal contract", "IT modernization", "FISMA", "evaluation criteria"],
    findings: [
      { item: "Technical requirements",  status: "42 items extracted",      trend: "↑ 8 flagged ambiguous" },
      { item: "Compliance mandates",     status: "FedRAMP Moderate + FISMA High", trend: "→ confirms scope" },
      { item: "Evaluation criteria",     status: "Price 30% / Technical 70%", trend: "→ T&E weighted" },
      { item: "Small business set-aside",status: "8(a) sole-source eligible", trend: "✓ Opportunity flag" },
      { item: "Submission deadline",     status: "July 31, 2026 @ 4:00 PM ET", trend: "→ 47 days remaining" },
    ],
  },
  {
    id: "doc2",
    title: "FOIA Request — Agency Communications",
    description: "Freedom of Information Act request for inter-agency emails on infrastructure project",
    tags: ["FOIA", "redaction", "PII", "privilege review", "disclosure", "20-day deadline"],
    findings: [
      { item: "Documents in scope",       status: "1,842 pages",          trend: "→ initial estimate" },
      { item: "PII instances detected",   status: "234 redaction candidates", trend: "↑ auto-flagged" },
      { item: "Atty-client privilege",    status: "12 pages potentially privileged", trend: "→ legal review required" },
      { item: "Exemption 5 candidates",   status: "38 deliberative process docs", trend: "→ withhold review" },
      { item: "20-day response deadline", status: "July 4, 2026 (holiday adj.)", trend: "↑ at risk" },
    ],
  },
  {
    id: "doc3",
    title: "Annual Compliance Audit — Data Privacy",
    description: "Inspector General data privacy assessment for a federal benefits system",
    tags: ["audit", "FISMA", "PII", "data privacy", "remediation", "Inspector General"],
    findings: [
      { item: "Overall risk rating",       status: "Moderate (improving)",   trend: "↑ from High last cycle" },
      { item: "Prior audit findings",      status: "7 of 12 closed",         trend: "↑ progress" },
      { item: "New critical findings",     status: "2 — encryption at rest", trend: "↑ 90-day remediation" },
      { item: "PII inventory accuracy",   status: "83% (below 95% target)",  trend: "→ action required" },
      { item: "Est. remediation cost",    status: "$340,000–$520,000",       trend: "→ budget planning" },
    ],
  },
];

export function psS3Costs() {
  const { visionInput, analysisOut, structuredOut, structuredReInput } = PS_S3;
  const pureClaude = callCost("opus",  visionInput, analysisOut);
  const pureGemini = callCost("flash", visionInput, analysisOut);
  const hybrid =
    callCost("flash", visionInput, structuredOut) +
    callCost("opus",  structuredReInput, analysisOut);
  return { pureClaude, pureGemini, hybrid };
}

// ─── S4: Nightly Procurement Compliance Agent ────────────────────────────────
// Reviews active contract portfolio: milestone tracking, compliance gaps,
// vendor performance (CPARS), procurement irregularities
export const PS_S4 = {
  planner:  { inTok: 8_000,  outTok: 2_500 },
  review:   { inTok: 10_000, outTok: 2_500 },
  executor: { inTok: 4_000,  outTok: 1_000 },
  steps: 14,
  configs: {
    allOpus: { planner: "opus" as const, executor: "opus" as const, review: "opus" as const },
    tiered:  { planner: "opus" as const, executor: "flash" as const, review: "opus" as const },
  },
  defaults: { contractsPerRun: 5_000, runsPerYear: 365 },
};

export type PsS4Config = keyof typeof PS_S4["configs"];

export interface PsAgentNode {
  id: number;
  label: string;
  role: "planner" | "executor" | "reviewer";
  inTok: number;
  outTok: number;
}

export const PS_S4_TRACE: PsAgentNode[] = [
  { id: 0,  label: "Prioritize contract review queue",              role: "planner",  inTok: 8_000,  outTok: 2_500 },
  { id: 1,  label: "Pull contract status from SAM.gov",             role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 2,  label: "Check milestone completion dates",              role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 3,  label: "Verify deliverable acceptance status",          role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 4,  label: "Pull vendor performance ratings (CPARS)",       role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 5,  label: "Check modification and amendment log",          role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 6,  label: "Verify subcontractor reporting (FSRS)",         role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 7,  label: "Flag obligation vs expenditure mismatches",     role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 8,  label: "Check small business compliance targets",       role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 9,  label: "Identify upcoming option year decisions",       role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 10, label: "Detect scope creep vs authorized work",         role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 11, label: "Verify invoice approval status",                role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 12, label: "Flag expired bonds and insurance certs",        role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 13, label: "Generate compliance exception report",          role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 14, label: "Stage recommended contracting officer actions", role: "executor", inTok: 4_000,  outTok: 1_000 },
  { id: 15, label: "Compliance review & risk sign-off",             role: "reviewer", inTok: 10_000, outTok: 2_500 },
];

export function psS4Costs(cfg: PsS4Config = "tiered") {
  const config = PS_S4.configs[cfg];
  const { planner, review, executor, steps } = PS_S4;

  const plannerCost  = callCost(config.planner,  planner.inTok,  planner.outTok);
  const reviewCost   = callCost(config.review,   review.inTok,   review.outTok);
  const executorCost = steps * callCost(config.executor, executor.inTok, executor.outTok);

  return { plannerCost, reviewCost, executorCost, total: plannerCost + executorCost + reviewCost };
}

export function psS4Annual(contractsPerRun: number, cfg: PsS4Config = "tiered") {
  return psS4Costs(cfg).total * contractsPerRun * PS_S4.defaults.runsPerYear;
}

// ─── Seller Notes ────────────────────────────────────────────────────────────
export const PS_SELLER_NOTES = {
  s1: {
    title: "Build Phase — Government Platform SDLC",
    assumption: "50% routine CRUD + legacy wrappers (Flash-Lite), 30% API adapters + IaC (Flash), 20% FedRAMP architecture + fraud logic + rules engines (Opus). Government codebases skew more routine than private sector — more CRUD, more legacy wrapping, less creative architecture.",
    sayThis: "Legacy COBOL wrappers and notification templates don't need frontier reasoning. Opus stays on FedRAMP identity federation and fraud detection. That split creates 56% savings on your dev budget — the highest of any vertical we model.",
  },
  s2: {
    title: "Run Phase — Citizen Services Portal",
    assumption: "5M queries/month across DMV, benefits, permits, FOIA. 65% are simple status lookups (Flash-Lite), 25% policy FAQ (Flash), 10% complex appeals and contract disputes (Opus).",
    sayThis: "'Where's my refund?' runs on Flash-Lite at $0.0011/query. 'My SNAP appeal rights' runs on Opus because the 10-day aid-paid-pending window could keep a family fed during the process. This is model routing at the moment of highest public impact.",
  },
  s3: {
    title: "Run Phase — Document Processing",
    assumption: "1M government documents/year — RFP analysis, FOIA redaction review, compliance audits. Flash extracts structure in 700ms; Opus reasons about compliance implications, legal privilege, and contract risk.",
    sayThis: "Gemini Flash reads 1,842 FOIA pages in 0.7 seconds and flags redaction candidates automatically. Opus interprets attorney-client privilege and deliberative process exemptions. You can't afford Opus for bulk extraction — and you can't afford to get the privilege review wrong.",
  },
  s4: {
    title: "Extend Phase — Procurement Compliance Agent",
    assumption: "Agent reviews 5,000 active contracts nightly — checking CPARS ratings, milestone dates, obligation accuracy, and small business compliance. 14 data-pull steps run on Flash; only queue prioritization and risk sign-off need Opus.",
    sayThis: "Checking SAM.gov status and pulling CPARS scores doesn't need frontier reasoning. The risk analysis that decides which contracts go to the Contracting Officer — that's the 2 of 16 steps that justify Opus. The math is $767K/yr in savings.",
  },
};
