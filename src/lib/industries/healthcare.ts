import { callCost } from "../pricing";

// ─── S1: Build (Clinical AI Platform SDLC) ──────────────────────────────
// Reference: an ISV's clinical AI platform — prior-auth automation, clinical docs,
// drug-interaction checking, and care-navigation agents.
export const HC_S1 = {
  routineTask: { inTok: 40000, outTok: 10000 },  // FHIR wrappers, form UIs, test harnesses, API scaffolding
  complexTask: { inTok: 80000, outTok: 20000 },  // clinical NLP pipelines, HIPAA audit logic, HL7/FHIR transforms
  defaultMix:  { routinePct: 0.70, complexPct: 0.30 },
  tasksPerDevPerSprint: 50,
  defaults: { devs: 10, sprints: 13 },
};

export interface HcS1Task {
  title: string;
  tier: "flash" | "opus";
  why: string;
}

export const HC_S1_TASKS: HcS1Task[] = [
  // Opus — complex clinical / compliance / architecture
  { title: "Design clinical NLP pipeline for chart review", tier: "opus", why: "Requires deep understanding of clinical terminology, negation handling, and multi-step entity extraction across unstructured notes." },
  { title: "Build prior-auth rules engine (payer-specific)", tier: "opus", why: "Complex business rules that vary by payer, CPT code, and clinical evidence — edge cases have direct revenue impact." },
  { title: "Implement HIPAA audit logging & access controls", tier: "opus", why: "Regulatory compliance with zero room for error; must reason about PHI exposure across all data flows." },
  { title: "Design HL7 FHIR R4 integration architecture", tier: "opus", why: "Mapping across EHR data models requires deep domain knowledge of clinical data standards and interop patterns." },
  { title: "Build drug-interaction severity classifier", tier: "opus", why: "Clinical safety feature requiring nuanced pharmacology reasoning — false negatives carry patient safety risk." },
  { title: "Plan care-navigation agent orchestration graph", tier: "opus", why: "Multi-step agent pipeline with clinical decision trees, escalation protocols, and HIPAA-safe tool access." },
  { title: "Design clinical trial eligibility matcher", tier: "opus", why: "Matching patient profiles against complex inclusion/exclusion criteria requires deep clinical reasoning." },
  { title: "Implement consent management engine", tier: "opus", why: "Legal and ethical complexity around patient consent workflows across jurisdictions and data types." },
  // Flash — routine CRUD, scaffolding, boilerplate
  { title: "Scaffold patient portal React components", tier: "flash", why: "Standard UI components from Figma specs — form fields, dashboards, appointment cards." },
  { title: "CRUD for patient demographics & insurance", tier: "flash", why: "Standard database operations on well-defined FHIR resource schemas." },
  { title: "Write HL7 ADT message parser", tier: "flash", why: "Mechanical parsing of well-documented message segments with clear field mappings." },
  { title: "Generate unit tests for 30 FHIR endpoints", tier: "flash", why: "Repetitive test generation from clear API specs — pattern-based, well-defined output." },
  { title: "Build appointment scheduling CRUD", tier: "flash", why: "Standard calendar/scheduling logic with clear business rules." },
  { title: "Write insurance eligibility check wrappers", tier: "flash", why: "Thin API wrappers around payer endpoints following established patterns." },
  { title: "Generate OpenAPI docs for clinical APIs", tier: "flash", why: "Extracting types and descriptions from existing handlers — pure documentation." },
  { title: "Seed fixture data for 20 patient profiles", tier: "flash", why: "Generating synthetic patient test data — creative but follows FHIR resource specs." },
  { title: "Add form validation to all clinical inputs", tier: "flash", why: "Repetitive Zod/FHIR-schema validation generation from TypeScript types." },
  { title: "Write E2E tests for referral workflow", tier: "flash", why: "Step-by-step UI interaction tests from well-defined clinical workflows." },
  { title: "Create Storybook stories for clinical UI kit", tier: "flash", why: "Boilerplate generation from existing component props — entirely mechanical." },
  { title: "Write Dockerfile for HIPAA-compliant local dev", tier: "flash", why: "Standard container config with added encryption-at-rest and audit flags." },
];

export type HcS1Baseline = "allOpus" | "tiered";

export function hcS1Costs(devs: number, sprints: number, baseline: HcS1Baseline = "tiered") {
  const totalTasks = devs * HC_S1.tasksPerDevPerSprint;
  const { routinePct, complexPct } = HC_S1.defaultMix;
  const routineTasks = totalTasks * routinePct;
  const complexTasks = totalTasks * complexPct;

  const { routineTask, complexTask } = HC_S1;

  const allOpusPerSprint =
    routineTasks * callCost("opus", routineTask.inTok, routineTask.outTok) +
    complexTasks * callCost("opus", complexTask.inTok, complexTask.outTok);

  const tieredPerSprint =
    routineTasks * callCost("flash", routineTask.inTok, routineTask.outTok) +
    complexTasks * callCost("opus", complexTask.inTok, complexTask.outTok);

  const chosen = baseline === "allOpus" ? allOpusPerSprint : tieredPerSprint;

  return {
    allOpusPerSprint, allOpusTotal: allOpusPerSprint * sprints,
    tieredPerSprint,  tieredTotal:  tieredPerSprint  * sprints,
    chosen,           chosenTotal:  chosen           * sprints,
  };
}

// ─── S2: In-App Clinical Assistant ──────────────────────────────────────
// Patient-facing & clinician-facing: symptom triage, medication questions, appointment help
export const HC_S2 = {
  query: { inTok: 2500, outTok: 500 },
  tieredMix: { flashLitePct: 0.55, flashPct: 0.25, opusPct: 0.20 },
  defaults: { queriesPerMonth: 8_000_000 },
};

export function hcS2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = HC_S2.query;
  const { flashLitePct, flashPct, opusPct } = HC_S2.tieredMix;

  const perQueryOpus      = callCost("opus",      inTok, outTok);
  const perQueryFlash     = callCost("flash",     inTok, outTok);
  const perQueryFlashLite = callCost("flashLite", inTok, outTok);

  const perQueryTiered =
    flashLitePct * perQueryFlashLite +
    flashPct     * perQueryFlash     +
    opusPct      * perQueryOpus;

  const allOpus  = queriesPerMonth * perQueryOpus;
  const tiered   = queriesPerMonth * perQueryTiered;

  return {
    allOpus, tiered,
    allOpusAnnual: allOpus * 12,
    tieredAnnual:  tiered  * 12,
    perQueryOpus, perQueryFlash, perQueryFlashLite, perQueryTiered,
  };
}

export interface HcS2QAPair {
  id: string;
  question: string;
  category: "routine" | "faq" | "complex";
  answers: { flashLite: string; flash: string; opus: string };
  scores: { flashLite: number; flash: number; opus: number };
  sellerNote?: string;
}

export const HC_S2_QA: HcS2QAPair[] = [
  {
    id: "q1",
    category: "routine",
    question: "When is my next appointment?",
    answers: {
      flashLite: "Your next appointment is on July 15, 2026 at 10:30 AM with Dr. Patel (Internal Medicine) at City Medical Center.",
      flash:     "Your next appointment is scheduled for July 15, 2026 at 10:30 AM with Dr. Patel (Internal Medicine), City Medical Center, Room 204. Would you like to reschedule?",
      opus:      "Your next appointment is on July 15, 2026 at 10:30 AM with Dr. Patel (Internal Medicine), City Medical Center, Room 204. Would you like to reschedule, or do you need directions to the clinic?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q2",
    category: "routine",
    question: "Can I get a refill on my metformin?",
    answers: {
      flashLite: "Your metformin prescription (500mg, 2x daily) has 2 refills remaining. I can send a refill request to your pharmacy (CVS on 5th St). Shall I proceed?",
      flash:     "Your metformin (Metformin HCl 500mg, twice daily) has 2 refills remaining, valid through December 2026. I can request a refill at CVS Pharmacy, 5th Street. Want me to send the request?",
      opus:      "Your metformin prescription (Metformin HCl 500mg, twice daily) has 2 refills remaining, valid through December 2026. I can send a refill to CVS on 5th Street. Would you like me to proceed, or would you prefer a different pharmacy?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q3",
    category: "faq",
    question: "What does my copay cover for specialist visits?",
    answers: {
      flashLite: "Your Blue Cross PPO plan has a $40 copay for in-network specialists. Out-of-network specialists require a $75 copay plus 30% coinsurance after deductible.",
      flash:     "With your Blue Cross PPO plan:\n• **In-network specialists**: $40 copay per visit\n• **Out-of-network**: $75 copay + 30% coinsurance after your $1,500 deductible\n\nYour deductible has $820 remaining this year.",
      opus:      "With your Blue Cross PPO plan:\n\n• **In-network specialists**: $40 copay per visit (no deductible required)\n• **Out-of-network**: $75 copay + 30% coinsurance after your $1,500 deductible\n\nYour deductible status: $680 met of $1,500 ($820 remaining). Note: preventive specialist visits (e.g., annual dermatology screening) may be covered at $0 under ACA preventive care rules.",
    },
    scores: { flashLite: 4, flash: 5, opus: 5 },
  },
  {
    id: "q4",
    category: "faq",
    question: "Is my procedure covered under prior authorization?",
    answers: {
      flashLite: "MRI procedures typically require prior authorization under your plan. Contact your provider's office to submit a prior-auth request.",
      flash:     "MRI of the knee (CPT 73721) requires prior authorization under your Blue Cross PPO plan. Your provider can submit this electronically. Typical approval time: 3–5 business days.",
      opus:      "MRI of the knee (CPT 73721) requires prior authorization under your Blue Cross PPO plan.\n\n**Current status**: No prior-auth request on file.\n**Process**: Your provider submits the request with clinical notes — approval typically takes 3–5 business days.\n**Your cost if approved**: $40 copay (in-network) + $0 coinsurance (diagnostic imaging is covered at 100% after copay under your plan).\n\nWould you like me to notify Dr. Patel's office to initiate the prior-auth request?",
    },
    scores: { flashLite: 3, flash: 4, opus: 5 },
  },
  {
    id: "q5",
    category: "complex",
    question: "I'm on warfarin and was prescribed amoxicillin — is that safe together?",
    answers: {
      flashLite: "Warfarin and amoxicillin can interact. The antibiotic may increase the blood-thinning effect of warfarin. Consult your doctor about monitoring your INR levels.",
      flash:     "**Moderate interaction detected**: Amoxicillin can increase the anticoagulant effect of warfarin by disrupting gut flora that produce vitamin K.\n\n• Risk: Elevated INR → increased bleeding risk\n• Recommendation: Your doctor should monitor INR more frequently during the antibiotic course\n• Typical adjustment: INR check 3–5 days after starting amoxicillin\n\nThis doesn't mean you can't take both — but monitoring is important.",
      opus:      "**⚠️ Moderate Drug Interaction: Warfarin + Amoxicillin**\n\n**Mechanism**: Amoxicillin disrupts intestinal flora that synthesize vitamin K, potentiating warfarin's anticoagulant effect. Additionally, amoxicillin may inhibit CYP enzymes involved in warfarin metabolism.\n\n**Clinical significance**: Your INR may rise 0.5–1.5 points above baseline during the antibiotic course, increasing bleeding risk.\n\n**Recommended action plan**:\n1. **Do NOT stop either medication** without speaking to your prescriber\n2. **Get an INR check** 3–5 days after starting amoxicillin\n3. **Watch for signs**: unusual bruising, blood in urine/stool, prolonged bleeding from cuts, nosebleeds\n4. **Dietary note**: Maintain consistent vitamin K intake (green leafy vegetables) — don't suddenly increase or decrease\n\n**Your current INR history**: Last reading was 2.4 (therapeutic range 2.0–3.0) on June 1st. A rise to 3.5+ would warrant dose adjustment.\n\nI've flagged this interaction in your chart. Would you like me to send a message to Dr. Patel to request an early INR check?",
    },
    scores: { flashLite: 2, flash: 3, opus: 5 },
    sellerNote: "Drug interactions are patient-safety moments. Opus provides mechanism, actionable steps, and proactive chart integration. This is where frontier reasoning isn't optional — it's clinical risk management.",
  },
  {
    id: "q6",
    category: "complex",
    question: "My mom has early-stage Alzheimer's. What care options and support programs are available?",
    answers: {
      flashLite: "For early-stage Alzheimer's:\n• Memory care programs\n• Support groups (Alzheimer's Association)\n• Medication options (donepezil, memantine)\n• Consider a care plan with her neurologist",
      flash:     "For early-stage Alzheimer's care, here are key options:\n\n• **Medications**: Cholinesterase inhibitors (donepezil/Aricept) — talk to her neurologist\n• **Cognitive programs**: Memory-focused therapy and cognitive stimulation programs\n• **Support**: Alzheimer's Association 24/7 helpline (800-272-3900), local caregiver support groups\n• **Planning**: Advance directives, power of attorney, and long-term care planning\n• **In-home**: Home health aides, adult day programs for daytime supervision\n\nWould you like me to find programs near her location?",
      opus:      "I understand this is a difficult time. Let me provide a comprehensive care roadmap for your mother's early-stage Alzheimer's:\n\n**1. Medical Management**\n• **Current medications to discuss with her neurologist**: Donepezil (Aricept) 5–10mg is first-line; Memantine may be added later\n• **Clinical trials**: Based on her profile, she may qualify for early-intervention trials — I can search ClinicalTrials.gov for her area\n• **Monitoring**: Regular cognitive assessments (MMSE/MoCA) every 6 months to track progression\n\n**2. Support Programs (covered under your family plan)**\n• **Cognitive stimulation therapy (CST)**: Evidence-based group program — your plan covers 12 sessions/year under behavioral health\n• **Caregiver support**: Your EAP benefit includes 8 free counseling sessions for family caregivers\n• **Respite care**: 40 hours/year of in-home respite is covered under your long-term care rider\n\n**3. Legal & Financial Planning (time-sensitive)**\n• Establish **durable power of attorney** and **healthcare proxy** while she can still participate in decisions\n• Review **long-term care insurance** options — premiums increase significantly after diagnosis\n• Contact your **employer's FMLA coordinator** if you'll need caregiving leave\n\n**4. Community Resources**\n• Alzheimer's Association 24/7 Helpline: **800-272-3900**\n• Local memory café program (social connection in a safe environment)\n• MedicAlert + Safe Return enrollment (wandering prevention)\n\n**5. Home Safety Assessment**\n• Request an occupational therapy home evaluation (covered under your plan, 1x/year)\n• Key modifications: remove tripping hazards, install nightlights, consider a medical alert system\n\nWould you like me to:\n1. Find clinical trials in her area?\n2. Schedule a care-planning appointment with her neurologist?\n3. Connect you with your EAP's caregiver counseling program?",
    },
    scores: { flashLite: 2, flash: 3, opus: 5 },
    sellerNote: "Care navigation is where AI becomes a lifeline. Opus connects insurance benefits, clinical options, legal planning, and community resources into a single actionable plan. These are the moments that justify premium model costs — they drive patient loyalty and health outcomes.",
  },
];

// ─── S3: Medical Imaging / Document Analysis ────────────────────────────
// "Upload a lab report or radiology image and ask: what changed?"
export const HC_S3 = {
  visionInput: 15000, analysisOut: 1200, structuredOut: 600, structuredReInput: 3000,
  lanes: {
    pureClaude: { model: "opus" as const,  latencyMs: 4200, quality: 5, label: "Pure Claude (Opus vision)" },
    pureGemini: { model: "flash" as const, latencyMs: 800,  quality: 4, label: "Pure Gemini (3.5 Flash, native)" },
    hybrid:     { ingest: "flash" as const, analyze: "opus" as const, latencyMs: 2800, quality: 5, label: "Hybrid (Flash extract → Opus interpret)" },
  },
  defaults: { interactionsPerYear: 3_000_000 },
};

export interface ClinicalDocCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  findings: { item: string; status: string; trend: string }[];
}

export const HC_S3_CARDS: ClinicalDocCard[] = [
  {
    id: "doc1",
    title: "Comprehensive Metabolic Panel",
    description: "Lab results comparison — Jan 2026 vs Jun 2026",
    tags: ["blood work", "metabolic panel", "glucose", "kidney function", "liver enzymes"],
    findings: [
      { item: "Glucose (fasting)", status: "112 mg/dL (H)", trend: "↑ from 98" },
      { item: "HbA1c", status: "6.1% (borderline)", trend: "↑ from 5.7%" },
      { item: "Creatinine", status: "1.1 mg/dL (normal)", trend: "→ stable" },
      { item: "ALT", status: "42 U/L (H)", trend: "↑ from 28" },
      { item: "eGFR", status: "82 mL/min (mild ↓)", trend: "↓ from 90" },
    ],
  },
  {
    id: "doc2",
    title: "Chest X-Ray Report",
    description: "Radiology report — PA and lateral views, Jun 2026",
    tags: ["radiology", "chest x-ray", "pulmonary", "cardiac silhouette"],
    findings: [
      { item: "Cardiac silhouette", status: "Normal size", trend: "→ stable" },
      { item: "Lung fields", status: "Clear bilaterally", trend: "→ no change" },
      { item: "Costophrenic angles", status: "Sharp", trend: "→ normal" },
      { item: "Mediastinum", status: "Unremarkable", trend: "→ stable" },
    ],
  },
  {
    id: "doc3",
    title: "Prior Authorization — Knee MRI",
    description: "Insurance prior-auth decision document",
    tags: ["prior-auth", "MRI", "insurance", "approval status", "clinical criteria"],
    findings: [
      { item: "Procedure", status: "MRI Knee w/o contrast (73721)", trend: "Requested" },
      { item: "Clinical indication", status: "Persistent knee pain >6wk", trend: "Documented" },
      { item: "Conservative tx", status: "PT x6 weeks completed", trend: "Met" },
      { item: "Decision", status: "APPROVED", trend: "✓ Criteria met" },
    ],
  },
];

export function hcS3Costs() {
  const { visionInput, analysisOut, structuredOut, structuredReInput } = HC_S3;

  const pureClaude = callCost("opus", visionInput, analysisOut);
  const pureGemini = callCost("flash", visionInput, analysisOut);
  const hybrid = callCost("flash", visionInput, structuredOut) + callCost("opus", structuredReInput, analysisOut);

  return { pureClaude, pureGemini, hybrid };
}

// ─── S4: Nightly Care-Coordination Agent ────────────────────────────────
// Agent runs nightly across patient panels: identifies gaps in care, overdue screenings,
// medication reconciliation, and care plan updates.
export const HC_S4 = {
  planner:  { inTok: 6000, outTok: 2000 },
  review:   { inTok: 10000, outTok: 2000 },   // clinical review + compliance sign-off
  executor: { inTok: 4000, outTok: 1000 },
  steps: 14,
  configs: {
    allOpus: { planner: "opus" as const, executor: "opus" as const, review: "opus" as const },
    tiered:  { planner: "opus" as const, executor: "flash" as const, review: "opus" as const },
  },
  defaults: { patientsPerNight: 25000, nightsPerYear: 365 },
};

export type HcS4Config = keyof typeof HC_S4["configs"];

export interface HcAgentNode {
  id: number;
  label: string;
  role: "planner" | "executor" | "reviewer";
  inTok: number;
  outTok: number;
}

export const HC_S4_TRACE: HcAgentNode[] = [
  { id: 0,  label: "Triage patient panel & prioritize",    role: "planner",  inTok: 6000, outTok: 2000 },
  { id: 1,  label: "Pull latest lab results",              role: "executor", inTok: 4000, outTok: 1000 },
  { id: 2,  label: "Check medication adherence signals",   role: "executor", inTok: 4000, outTok: 1000 },
  { id: 3,  label: "Identify overdue screenings",          role: "executor", inTok: 4000, outTok: 1000 },
  { id: 4,  label: "Flag abnormal lab trends",             role: "executor", inTok: 4000, outTok: 1000 },
  { id: 5,  label: "Check drug interaction alerts",        role: "executor", inTok: 4000, outTok: 1000 },
  { id: 6,  label: "Verify prior-auth status",             role: "executor", inTok: 4000, outTok: 1000 },
  { id: 7,  label: "Reconcile medication lists",           role: "executor", inTok: 4000, outTok: 1000 },
  { id: 8,  label: "Generate care gap summary",            role: "executor", inTok: 4000, outTok: 1000 },
  { id: 9,  label: "Draft patient outreach messages",      role: "executor", inTok: 4000, outTok: 1000 },
  { id: 10, label: "Update care plan recommendations",     role: "executor", inTok: 4000, outTok: 1000 },
  { id: 11, label: "Compile quality metric scores",        role: "executor", inTok: 4000, outTok: 1000 },
  { id: 12, label: "Prepare referral recommendations",     role: "executor", inTok: 4000, outTok: 1000 },
  { id: 13, label: "Stage appointment suggestions",        role: "executor", inTok: 4000, outTok: 1000 },
  { id: 14, label: "Format audit trail entries",           role: "executor", inTok: 4000, outTok: 1000 },
  { id: 15, label: "Clinical review & compliance sign-off", role: "reviewer", inTok: 10000, outTok: 2000 },
];

export function hcS4Costs(cfg: HcS4Config = "tiered") {
  const config = HC_S4.configs[cfg];
  const { planner, review, executor, steps } = HC_S4;

  const plannerCost  = callCost(config.planner,  planner.inTok,  planner.outTok);
  const reviewCost   = callCost(config.review,   review.inTok,   review.outTok);
  const executorCost = steps * callCost(config.executor, executor.inTok, executor.outTok);

  return { plannerCost, reviewCost, executorCost, total: plannerCost + executorCost + reviewCost };
}

export function hcS4Annual(patientsPerNight: number, cfg: HcS4Config = "tiered") {
  return hcS4Costs(cfg).total * patientsPerNight * HC_S4.defaults.nightsPerYear;
}

// ─── Seller Notes ────────────────────────────────────────────────────────
export const HC_SELLER_NOTES = {
  s1: {
    title: "Build Phase — Clinical AI Platform",
    assumption: "70% routine / 30% complex split. Complex tasks include clinical NLP, HIPAA compliance, and HL7/FHIR integration — areas where reasoning quality is non-negotiable.",
    sayThis: "FHIR wrappers and test harnesses don't need frontier reasoning. Reserve Opus for the clinical safety and compliance logic where mistakes cost lives and licenses.",
  },
  s2: {
    title: "Run Phase — Clinical Assistant",
    assumption: "8M queries/mo across patient portal and clinician-facing tools. 55% are simple lookups (appointments, refills), 25% standard clinical info, 20% complex (drug interactions, care navigation).",
    sayThis: "Appointment checks and refill requests run on Flash-Lite at pennies. Opus handles the drug interaction checks and care planning — where clinical accuracy is a patient safety issue.",
  },
  s3: {
    title: "Run Phase — Clinical Document Analysis",
    assumption: "3M document interactions/year for a mid-size health system. Includes lab report interpretation, radiology report analysis, and prior-auth document review.",
    sayThis: "Flash reads the document fast; Opus interprets the clinical significance. You get sub-second extraction with frontier-quality clinical reasoning.",
  },
  s4: {
    title: "Extend Phase — Care Coordination Agent",
    assumption: "Agent reviews 25K patient charts nightly — checking care gaps, medication adherence, overdue screenings, and lab trends. Only the triage plan and clinical sign-off need frontier reasoning.",
    sayThis: "Fourteen data-pull steps per patient run on Flash. The clinical review that signs off on care gap alerts — that's the 2 of 16 steps that justify Opus. The math is overwhelming.",
  },
};
