import { callCost } from "../pricing";

// ─── S1: Build (Network Automation Platform SDLC) ───────────────────────────
// Reference: a telco software team building a network automation and self-service platform —
// SIM provisioning, billing integration, network ops dashboards, anomaly detection.
export const SIG_S1 = {
  routineTask: { inTok: 40000, outTok: 10000 }, // flashLite: tests, CRUD, scaffolds, docs, templates
  midTask:     { inTok: 60000, outTok: 15000 }, // flash: billing adapters, provisioning flows, policy parsers
  complexTask: { inTok: 80000, outTok: 20000 }, // opus: 5G architecture, anomaly detection, compliance, churn prediction
  defaultMix:  { flashLitePct: 0.50, flashPct: 0.25, opusPct: 0.25 },
  tasksPerDevPerSprint: 50,
  defaults: { devs: 15, sprints: 13 },
};

export interface SigS1Task {
  title: string;
  tier: "flashLite" | "flash" | "opus";
  why: string;
}

export const SIG_S1_TASKS: SigS1Task[] = [
  // Opus — architecture, ML, regulatory, complex reasoning
  { title: "Design 5G network slicing architecture for enterprise SLAs", tier: "opus", why: "Novel architecture requiring deep 3GPP standards knowledge and reasoning about latency, bandwidth isolation, and multi-tenant guarantees." },
  { title: "Build real-time anomaly detection engine for KPI monitoring", tier: "opus", why: "Statistical modeling over streaming network metrics — threshold selection, false-positive suppression, and correlation analysis across sites." },
  { title: "Implement FCC regulatory compliance tracking engine", tier: "opus", why: "Legal and technical complexity of US telecom regulation — CALEA, net neutrality, spectrum license conditions — requires precise legal reasoning." },
  { title: "Design subscriber churn prediction model with causal inference", tier: "opus", why: "Causal ML modeling to separate correlation from intervention effects — requires statistical depth to avoid spurious policy decisions." },
  { title: "Plan AI-powered NetOps agent orchestration graph", tier: "opus", why: "Multi-step agent pipeline with real-time data access, escalation logic, and PSTN-safe tool boundaries — requires careful architectural planning." },
  // Flash — mid-complexity features requiring judgment and domain knowledge
  { title: "Build SIM provisioning workflow adapter", tier: "flash", why: "Provisioning APIs have carrier-specific quirks and retry semantics — needs judgment on error recovery and partial-success handling." },
  { title: "Write billing system integration wrappers", tier: "flash", why: "BSS/OSS integrations involve complex field mapping, currency handling, and tax jurisdiction logic across multiple billing platforms." },
  { title: "Scaffold 15 network ops dashboard components from Figma", tier: "flash", why: "Domain-specific charts (latency heatmaps, coverage grids) need judgment on data binding and responsive layout." },
  { title: "Write E2E tests for number port-out flow", tier: "flash", why: "Port-out workflows involve regulatory timing constraints and carrier API state machines — complex multi-step flows requiring strategic test coverage." },
  { title: "Build network policy rule parser for QoS configs", tier: "flash", why: "Policy DSL parsing with conflict detection and precedence resolution — requires understanding of telecom QoS concepts." },
  // Flash-Lite — pure boilerplate, generation, pattern-based output
  { title: "Generate unit tests for 35 network API endpoints", tier: "flashLite", why: "Repetitive test generation from clear API specs — pattern-based, well-defined output. No new reasoning required." },
  { title: "Write CRUD for device inventory management", tier: "flashLite", why: "Standard database operations on well-defined device registry schemas — mechanical substitution." },
  { title: "Generate OpenAPI docs from network service handlers", tier: "flashLite", why: "Extracting types and descriptions from existing handlers — pure documentation, no design decisions." },
  { title: "Add input validation to all provisioning forms", tier: "flashLite", why: "Repetitive Zod schema generation from TypeScript types — mechanical substitution." },
  { title: "Write seed data for 12 device types and plans", tier: "flashLite", why: "Generating realistic test fixture data within defined schemas — creative but bounded." },
  { title: "Create Storybook stories for network ops UI kit", tier: "flashLite", why: "Boilerplate generation from existing component props — entirely mechanical." },
  { title: "Write SQL migrations for subscriber records table", tier: "flashLite", why: "Standard DDL from a clear schema definition — no ambiguity in output." },
  { title: "Add error boundary wrappers to all portal routes", tier: "flashLite", why: "Repetitive wrapper pattern applied across known route files — copy-paste with substitution." },
  { title: "Generate i18n string keys for self-service portal", tier: "flashLite", why: "Mechanical extraction and mapping of UI strings across component files." },
  { title: "Write Docker configs for dev network simulation", tier: "flashLite", why: "Standard container configuration from established patterns — documented recipe." },
];

export type SigS1Baseline = "allOpus" | "opusSonnet" | "opusGemini";

export function sigS1Costs(devs: number, sprints: number, baseline: SigS1Baseline = "opusGemini") {
  const totalTasks = devs * SIG_S1.tasksPerDevPerSprint;
  const { flashLitePct, flashPct, opusPct } = SIG_S1.defaultMix;
  const flTasks = totalTasks * flashLitePct;
  const fTasks  = totalTasks * flashPct;
  const oTasks  = totalTasks * opusPct;

  const { routineTask, midTask, complexTask } = SIG_S1;

  const allOpusPerSprint =
    flTasks * callCost("opus",      routineTask.inTok, routineTask.outTok) +
    fTasks  * callCost("opus",      midTask.inTok,     midTask.outTok)     +
    oTasks  * callCost("opus",      complexTask.inTok, complexTask.outTok);

  const opusSonnetPerSprint =
    flTasks * callCost("sonnet",    routineTask.inTok, routineTask.outTok) +
    fTasks  * callCost("sonnet",    midTask.inTok,     midTask.outTok)     +
    oTasks  * callCost("opus",      complexTask.inTok, complexTask.outTok);

  const opusGeminiPerSprint =
    flTasks * callCost("flashLite", routineTask.inTok, routineTask.outTok) +
    fTasks  * callCost("flash",     midTask.inTok,     midTask.outTok)     +
    oTasks  * callCost("opus",      complexTask.inTok, complexTask.outTok);

  const chosenPerSprint =
    baseline === "allOpus"    ? allOpusPerSprint    :
    baseline === "opusSonnet" ? opusSonnetPerSprint :
                                 opusGeminiPerSprint;

  return {
    allOpusPerSprint,    allOpusTotal:    allOpusPerSprint    * sprints,
    opusSonnetPerSprint, opusSonnetTotal: opusSonnetPerSprint * sprints,
    opusGeminiPerSprint, opusGeminiTotal: opusGeminiPerSprint * sprints,
    chosen: chosenPerSprint, chosenTotal: chosenPerSprint * sprints,
  };
}

// ─── S2: Customer Support AI ────────────────────────────────────────────────
export const SIG_S2 = {
  query: { inTok: 2000, outTok: 400 },
  tieredMix: { flashLitePct: 0.60, flashPct: 0.28, opusPct: 0.12 },
  defaults: { queriesPerMonth: 6_000_000 },
};

export function sigS2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = SIG_S2.query;
  const { flashLitePct, flashPct, opusPct } = SIG_S2.tieredMix;

  const perQueryOpus      = callCost("opus",      inTok, outTok);
  const perQuerySonnet    = callCost("sonnet",    inTok, outTok);
  const perQueryFlash     = callCost("flash",     inTok, outTok);
  const perQueryFlashLite = callCost("flashLite", inTok, outTok);

  const perQueryTiered =
    flashLitePct * perQueryFlashLite +
    flashPct     * perQueryFlash     +
    opusPct      * perQueryOpus;

  const allOpus   = queriesPerMonth * perQueryOpus;
  const allSonnet = queriesPerMonth * perQuerySonnet;
  const tiered    = queriesPerMonth * perQueryTiered;

  return {
    allOpus, allSonnet, tiered,
    allOpusAnnual:   allOpus   * 12,
    allSonnetAnnual: allSonnet * 12,
    tieredAnnual:    tiered    * 12,
    perQueryOpus, perQuerySonnet, perQueryFlash, perQueryFlashLite, perQueryTiered,
    savingsVsSonnet: allSonnet - tiered,
    pctSavingsVsSonnet: (allSonnet - tiered) / allSonnet * 100,
  };
}

export interface SigS2QAPair {
  id: string;
  question: string;
  category: "routine" | "faq" | "complex";
  answers: { flashLite: string; flash: string; opus: string };
  scores: { flashLite: number; flash: number; opus: number };
  sellerNote?: string;
}

export const SIG_S2_QA: SigS2QAPair[] = [
  {
    id: "q1",
    category: "routine",
    question: "What's my current data usage this month?",
    answers: {
      flashLite: "You've used 14.2 GB of your 50 GB plan this month. Your billing cycle resets on July 18.",
      flash:     "You've used 14.2 GB of your 50 GB plan (28% used). Your cycle resets July 18. At this pace, you'll stay well within your limit.",
      opus:      "You've used 14.2 GB of your 50 GB Unlimited Plus plan (28%). Billing cycle resets July 18. Based on your usage history, you're on track to use about 32 GB this month — well within your plan.",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q2",
    category: "routine",
    question: "When is my next bill due?",
    answers: {
      flashLite: "Your next bill of $89.99 is due on July 22, 2026.",
      flash:     "Your next bill of $89.99 is due July 22, 2026. AutoPay is enabled — it'll be charged to your Visa ending in 4821.",
      opus:      "Your next bill of $89.99 is due July 22, 2026. AutoPay is enabled on your Visa ending in 4821. Would you like to review the charges or update your payment method?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q3",
    category: "faq",
    question: "Why is my 5G connection slower than usual?",
    answers: {
      flashLite: "5G speeds can vary due to network congestion, distance from towers, or building interference. Try restarting your device or moving to a different location.",
      flash:     "A few things could be affecting your 5G speed: (1) **Network congestion** — busy hours (5–9 PM) in dense areas often reduce speeds. (2) **Coverage edge** — you may be at the edge of a 5G zone and falling back to LTE. (3) **Device setting** — check that 5G is enabled in Settings > Mobile > Network Mode. Your current signal type shows as 5G NSA at moderate signal strength (-95 dBm).",
      opus:      "Your 5G experience has been slower than your plan's typical speeds (300+ Mbps) lately. Here's what the data shows:\n\n**Your current signal**: 5G NSA at -95 dBm (moderate). The nearest 5G SA site is 1.2 km away.\n\n**Likely causes**:\n1. **Network load**: Your area (zip 94103) is in our top-10 congested zones during peak hours. Sub-6GHz 5G capacity is being expanded there — new small cells scheduled for Q3 2026.\n2. **Deprioritization**: On your Unlimited Plus plan, during congestion your data may be deprioritized after 50 GB/month (you're at 14.2 GB, so not a current factor).\n\n**What might help**: Enabling Wi-Fi 6 at home and using 5G only in low-congestion areas. I can also check if upgrading to our Business Priority plan would benefit your usage pattern.",
    },
    scores: { flashLite: 3, flash: 4, opus: 5 },
    sellerNote: "Network troubleshooting is where Opus earns its place — it explains the why, not just the what. Flash gives you a checklist. Opus reads your signal data, identifies your specific congestion zone, and proactively surfaces an upgrade path.",
  },
  {
    id: "q4",
    category: "faq",
    question: "How do I port my number to another carrier?",
    answers: {
      flashLite: "To port your number, contact your new carrier and provide your account number and PIN. Don't cancel your SignalOS service — the port will complete automatically, usually within 1–3 business days.",
      flash:     "To port your number away from SignalOS:\n1. **Get your account number and PIN** from My Account > Settings > Account Info\n2. **Contact your new carrier** and initiate the port request — they'll need your account number, PIN, and current address\n3. **Don't cancel SignalOS** — your service will automatically close when the port completes (1–3 business days)\n\nNote: If you have an installment plan balance, it becomes due in full upon porting out.",
      opus:      "Here's everything you need to port your number away from SignalOS:\n\n**Your account info for the port**:\n- Account number: 7841-2293-xx (tap to reveal)\n- Port PIN: [set in My Account > Security > Port PIN]\n\n**Steps**:\n1. Provide your new carrier with your number, account number, PIN, and billing zip code\n2. Do NOT cancel SignalOS — the port request triggers automatic termination\n3. Timeline: Simple ports complete in 1–3 hours; landline ports take 1–5 business days\n\n**Before you go — things to know**:\n- **Device unlock**: Your device is already unlocked (since Nov 2025)\n- **Installment balance**: You have $0 remaining on your device installment (paid off)\n- **Early termination**: Your plan has no ETF — month-to-month since Feb 2025\n- **Autopay**: Will cancel automatically when port completes\n\nIs there something we can do to keep you? I can check current retention offers on your account.",
    },
    scores: { flashLite: 4, flash: 5, opus: 5 },
  },
  {
    id: "q5",
    category: "complex",
    question: "I've been charged for international roaming I never enabled — this has happened three months in a row and I want this fixed or I'm canceling.",
    answers: {
      flashLite: "I'm sorry for the roaming charges. I'll escalate this to our billing team to investigate. Would you like a callback or email follow-up?",
      flash:     "I can see three months of international roaming charges that shouldn't have been applied to your account. Let me investigate:\n\n**Findings**: Roaming was triggered on March 14, April 11, and May 9 — each for less than 2MB of data, suggesting a background app.\n\n**Immediate actions**: I'll credit all three months ($29.97 × 3 = $89.91) to your account. I'll also flag your account to block international data roaming without explicit opt-in.\n\nCredit will appear in 1–2 billing cycles. Is there anything else I can do?",
      opus:      "I've pulled your account history and can see exactly what happened — and I'm going to make this right.\n\n**Root cause**: Your iPhone's iCloud sync was triggering brief data sessions while traveling in border areas near Mexico (San Diego, March/April) and Canada (Detroit, May). These sub-2MB sessions automatically enabled pay-per-use international data at $10/session.\n\n**Charges**: 3 months × $29.97 = **$89.91 total** in unauthorized roaming fees.\n\n**What I'm doing right now**:\n1. **Full credit of $89.91** applied to your account — you'll see it on your next statement\n2. **Hard block on international data roaming** added to your account (won't activate without calling us)\n3. **Documented as billing error** in your account notes for dispute purposes\n\n**Why this happened**: Your plan's international roaming defaults to opt-in when traveling near borders — a known issue we're fixing in our July app update. I've added you to our affected-customer notification list.\n\n**To prevent recurrence**: In iPhone Settings > Cellular > Cellular Data Options, disable 'Data Roaming.' Want me to send a push notification reminder?\n\nYou have my direct case reference: #SIG-2026-84821. Is there anything else I can resolve today?",
    },
    scores: { flashLite: 1, flash: 3, opus: 5 },
    sellerNote: "Billing disputes with churn risk are existential for telco. Flash can credit and block. Opus explains the root cause, proactively fixes the systemic issue, and turns a cancellation into retention. That's the difference between a transactional response and a loyalty-driving one.",
  },
  {
    id: "q6",
    category: "complex",
    question: "Our enterprise SLA specifies 99.95% uptime and we've experienced 3 outages in Q2. What credit are we owed?",
    answers: {
      flashLite: "I'll connect you with our enterprise support team to review your SLA terms and calculate any applicable credits.",
      flash:     "Based on your Master Service Agreement, here's the credit calculation for your Q2 outages:\n\n- Outage 1 (April 3, 4h 12m): 0.58% downtime\n- Outage 2 (May 17, 2h 45m): 0.38% downtime  \n- Outage 3 (June 22, 1h 30m): 0.21% downtime\n- **Total downtime**: 1.17% → exceeds your 0.05% allowance\n\nUnder your SLA terms, excess downtime credits 5% of monthly recurring charges per 0.1% overage. I'll escalate this to your account team for formal credit issuance.",
      opus:      "I've pulled your Enterprise MSA (signed Jan 2025) and incident records. Here's a precise credit analysis:\n\n**Your SLA**: 99.95% uptime monthly = max 21.6 minutes of allowed downtime/month\n\n**Q2 Incident Log**:\n| Date | Duration | Affected services | Classification |\n|---|---|---|---|\n| Apr 3 | 4h 12m | Primary data circuit | Class A — full credit |\n| May 17 | 2h 45m | Backup circuit failover | Class B — 50% credit |\n| Jun 22 | 1h 30m | Voice routing | Class A — full credit |\n\n**Credit Calculation under Section 8.2(b) of your MSA**:\n- April excess: 4h 12m - 21.6m = 3h 50.4m excess → 5% of MRC per hour = **$1,847.50**\n- May (Class B at 50%): 2h 23.4m excess → **$576.25**\n- June excess: 1h 8.4m excess → **$818.75**\n- **Total credit owed: $3,242.50**\n\n**Dispute note**: The May outage is currently classified as 'scheduled maintenance' in our system, which your contract exempts. I disagree with that classification based on your incident description — I'm flagging it for review.\n\n**Next steps**: I'm generating a formal SLA breach report (SLA-Q226-ENT-0042) and routing it to your account manager (Jennifer Zhao, j.zhao@signal.com) for executive sign-off within 48 hours. Do you want me to also review your Q1 uptime for potential credits you may have missed?",
    },
    scores: { flashLite: 1, flash: 3, opus: 5 },
    sellerNote: "Enterprise SLA disputes involve contract language, data accuracy, and classification judgment — exactly where Opus earns its cost. Flash can compute numbers. Opus finds the dispute, flags the misclassification, and turns the interaction into a proactive customer advocate moment.",
  },
];

// ─── S4: Network Operations Agent ───────────────────────────────────────────
export const SIG_S4 = {
  planner:  { inTok: 6000, outTok: 2000 },
  review:   { inTok: 9000, outTok: 2000 },
  executor: { inTok: 4000, outTok: 1000 },
  steps: 14,
  configs: {
    allOpus: { planner: "opus" as const, executor: "opus" as const, review: "opus" as const },
    tiered:  { planner: "opus" as const, executor: "flash" as const, review: "opus" as const },
  },
  defaults: { sitesPerRun: 50000, runsPerDay: 4, daysPerYear: 365 },
};

export type SigS4Config = keyof typeof SIG_S4["configs"];

export interface SigAgentNode {
  id: number;
  label: string;
  role: "planner" | "executor" | "reviewer";
  inTok: number;
  outTok: number;
}

export const SIG_S4_TRACE: SigAgentNode[] = [
  { id: 0,  label: "Prioritize sites by risk score",          role: "planner",  inTok: 6000, outTok: 2000 },
  { id: 1,  label: "Pull current KPI metrics (CQI, RSRP, PRB)", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 2,  label: "Fetch throughput degradation alerts",      role: "executor", inTok: 4000, outTok: 1000 },
  { id: 3,  label: "Check packet loss vs baseline",           role: "executor", inTok: 4000, outTok: 1000 },
  { id: 4,  label: "Query active incident tickets",           role: "executor", inTok: 4000, outTok: 1000 },
  { id: 5,  label: "Pull recent configuration changes",       role: "executor", inTok: 4000, outTok: 1000 },
  { id: 6,  label: "Check weather and physical event alerts", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 7,  label: "Evaluate adjacent cell load spill",       role: "executor", inTok: 4000, outTok: 1000 },
  { id: 8,  label: "Correlate power and backhaul status",     role: "executor", inTok: 4000, outTok: 1000 },
  { id: 9,  label: "Score anomaly severity (1–5)",            role: "executor", inTok: 4000, outTok: 1000 },
  { id: 10, label: "Lookup SLA-covered enterprise cells",     role: "executor", inTok: 4000, outTok: 1000 },
  { id: 11, label: "Draft recommended remediation",          role: "executor", inTok: 4000, outTok: 1000 },
  { id: 12, label: "Generate field technician work order",    role: "executor", inTok: 4000, outTok: 1000 },
  { id: 13, label: "Stage NOC alert with context",            role: "executor", inTok: 4000, outTok: 1000 },
  { id: 14, label: "Format audit and compliance log entry",   role: "executor", inTok: 4000, outTok: 1000 },
  { id: 15, label: "Escalation review — dispatch or defer",  role: "reviewer", inTok: 9000, outTok: 2000 },
];

export function sigS4Costs(cfg: SigS4Config = "tiered") {
  const config = SIG_S4.configs[cfg];
  const { planner, review, executor, steps } = SIG_S4;

  const plannerCost  = callCost(config.planner,  planner.inTok,  planner.outTok);
  const reviewCost   = callCost(config.review,   review.inTok,   review.outTok);
  const executorCost = steps * callCost(config.executor, executor.inTok, executor.outTok);

  return { plannerCost, reviewCost, executorCost, total: plannerCost + executorCost + reviewCost };
}

export function sigS4Annual(sitesPerRun: number, cfg: SigS4Config = "tiered") {
  const { runsPerDay, daysPerYear } = SIG_S4.defaults;
  return sigS4Costs(cfg).total * sitesPerRun * runsPerDay * daysPerYear;
}
