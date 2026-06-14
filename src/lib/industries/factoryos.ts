import { callCost } from "../pricing";

// ─── S1: Build (Industrial IoT & PLC Platform SDLC) ──────────────────────
// Reference: OEM building a factory floor intelligence platform —
// sensor dashboards, PLC adapters, SCADA integration, and anomaly detection.
export const FACT_S1 = {
  routineTask:  { inTok: 40000, outTok: 10000 },
  midTask:      { inTok: 55000, outTok: 14000 },
  complexTask:  { inTok: 80000, outTok: 20000 },
  defaultMix:   { flashLitePct: 0.55, flashPct: 0.30, opusPct: 0.15 },
  tasksPerDevPerSprint: 45,
  defaults: { devs: 14, sprints: 13 },
};

export interface FactS1Task {
  title: string;
  tier: "flashLite" | "flash" | "opus";
  why: string;
}

export const FACT_S1_TASKS: FactS1Task[] = [
  // Opus — safety-critical / systems architecture
  { tier: "opus", title: "Design safety interlock logic for press line",          why: "Hard real-time constraints, IEC 61508 SIL-2 compliance; a logic error can cause machine damage or injury." },
  { tier: "opus", title: "Build SCADA/PLC integration layer (OPC-UA gateway)",    why: "Bridging OPC-UA, Modbus, and MQTT across heterogeneous PLCs requires deep protocol reasoning and fault tolerance." },
  { tier: "opus", title: "Implement vibration anomaly detection model",            why: "Signal processing pipeline with domain-specific thresholds; false positives cause costly unplanned downtime." },
  { tier: "opus", title: "Architect multi-site historian data replication",        why: "Consistency across edge historians and cloud time-series requires careful CAP theorem tradeoffs under network partition." },
  { tier: "opus", title: "Design ISA-95 production scheduling integration",        why: "Aligning MES scheduling APIs with ERP order data across shift boundaries is complex, stateful orchestration." },
  // Flash — IoT adapters, dashboards, test suites
  { tier: "flash", title: "Build MQTT broker adapter for Siemens S7-1500",        why: "Adapting a specific vendor protocol — well-documented but requires precise register mapping and error handling." },
  { tier: "flash", title: "Build Modbus RTU polling loop for legacy sensors",      why: "Mechanical protocol implementation from PLC documentation — pattern-based but needs accuracy." },
  { tier: "flash", title: "Create Grafana dashboard panels for OEE metrics",       why: "Translating production KPI specs into PromQL/InfluxQL queries — systematic but requires attention to aggregation." },
  { tier: "flash", title: "Write E2E tests for alarm escalation workflow",         why: "Multi-step UI interaction tests against well-defined alarm state machine." },
  { tier: "flash", title: "Generate IaC templates for edge K3s deployment",       why: "Kubernetes manifests from architecture specs — templated, pattern-driven output." },
  { tier: "flash", title: "Build REST API for shift handover notes",              why: "Standard CRUD with JSON schema validation — well-defined resource structure." },
  { tier: "flash", title: "Write OpenAPI specs for all historian endpoints",       why: "Extracting types from existing Go handlers — documentation extraction task." },
  { tier: "flash", title: "Integrate PagerDuty for critical alarm routing",       why: "Webhook configuration following established patterns in vendor docs." },
  { tier: "flash", title: "Build CSV export for production batch reports",        why: "Deterministic formatting from a defined schema — pure data transformation." },
  // Flash-Lite — boilerplate, tests, docs
  { tier: "flashLite", title: "CRUD for work-order management",                   why: "Standard database operations on well-defined entity schema." },
  { tier: "flashLite", title: "Generate unit tests for 40 sensor parsing fns",   why: "Repetitive test generation from clear function signatures." },
  { tier: "flashLite", title: "Seed fixture data for 50 machine profiles",       why: "Synthetic test data generation following defined schema." },
  { tier: "flashLite", title: "Add form validation to shift-entry screens",       why: "Repetitive Zod schema generation from TypeScript types." },
  { tier: "flashLite", title: "Write Storybook stories for factory UI kit",       why: "Boilerplate generation from existing component props." },
  { tier: "flashLite", title: "Write Dockerfile for offline edge deployment",     why: "Standard container config for air-gapped factory networks." },
  { tier: "flashLite", title: "Generate Swagger docs for SCADA REST layer",       why: "Documentation extraction — pure structural task." },
  { tier: "flashLite", title: "Create DB migration for alarm history table",      why: "Schema migration from TypeScript entity definition." },
  { tier: "flashLite", title: "Write address-validation for plant-floor assets",  why: "Field format validation logic from spec — mechanical." },
  { tier: "flashLite", title: "Generate email templates for maintenance alerts",  why: "HTML email templating from brand guidelines — pattern-driven." },
];

export type FactS1Baseline = "allOpus" | "allSonnet" | "geminiTiered";

export function factS1Costs(devs: number, sprints: number, baseline: FactS1Baseline = "geminiTiered") {
  const totalTasks = devs * FACT_S1.tasksPerDevPerSprint;
  const { flashLitePct, flashPct, opusPct } = FACT_S1.defaultMix;

  const flTasks = totalTasks * flashLitePct;
  const fTasks  = totalTasks * flashPct;
  const oTasks  = totalTasks * opusPct;

  const { routineTask, midTask, complexTask } = FACT_S1;

  const allOpusPerSprint =
    flTasks * callCost("opus", routineTask.inTok, routineTask.outTok) +
    fTasks  * callCost("opus", midTask.inTok,     midTask.outTok) +
    oTasks  * callCost("opus", complexTask.inTok,  complexTask.outTok);

  const allSonnetPerSprint =
    flTasks * callCost("sonnet", routineTask.inTok, routineTask.outTok) +
    fTasks  * callCost("sonnet", midTask.inTok,     midTask.outTok) +
    oTasks  * callCost("sonnet", complexTask.inTok,  complexTask.outTok);

  const geminiTieredPerSprint =
    flTasks * callCost("flashLite", routineTask.inTok, routineTask.outTok) +
    fTasks  * callCost("flash",     midTask.inTok,     midTask.outTok) +
    oTasks  * callCost("opus",      complexTask.inTok,  complexTask.outTok);

  const chosenPerSprint =
    baseline === "allOpus"      ? allOpusPerSprint :
    baseline === "allSonnet"    ? allSonnetPerSprint :
                                  geminiTieredPerSprint;

  return {
    allOpusPerSprint,      allOpusTotal:      allOpusPerSprint      * sprints,
    allSonnetPerSprint,    allSonnetTotal:    allSonnetPerSprint    * sprints,
    geminiTieredPerSprint, geminiTieredTotal: geminiTieredPerSprint * sprints,
    chosenPerSprint,       chosenTotal:       chosenPerSprint       * sprints,
  };
}

// ─── S2: Floor Assistant (Operator Q&A) ─────────────────────────────────
// Machine operators ask: diagnostics, settings, safety overrides, maintenance guidance
export const FACT_S2 = {
  query: { inTok: 2000, outTok: 400 },
  tieredMix: { flashLitePct: 0.65, flashPct: 0.25, opusPct: 0.10 },
  defaults: { queriesPerMonth: 3_000_000 },
};

export function factS2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = FACT_S2.query;
  const { flashLitePct, flashPct, opusPct } = FACT_S2.tieredMix;

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

export interface FactS2QAPair {
  id: string;
  question: string;
  category: "routine" | "diagnostic" | "safety";
  answers: { flashLite: string; flash: string; opus: string };
  scores: { flashLite: number; flash: number; opus: number };
  sellerNote?: string;
}

export const FACT_S2_QA: FactS2QAPair[] = [
  {
    id: "q1",
    category: "routine",
    question: "What's the current shift production count for Line 3?",
    answers: {
      flashLite: "Line 3 shift production count: 1,847 units. Target: 2,000. Current OEE: 88.4%.",
      flash:     "Line 3 — Current shift: 1,847 units produced (92.4% of 2,000 unit target). OEE: 88.4%. Time remaining: 2h 14min. On track to miss target by ~42 units at current pace.",
      opus:      "Line 3 — Current shift: 1,847 units (92.4% of 2,000 target). OEE: 88.4% (Availability 94%, Performance 96%, Quality 98%). At current throughput of 8.3 units/min, you'll finish at 1,958 units — 42 short. Would you like me to flag a pace alert for the supervisor?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q2",
    category: "routine",
    question: "When is the next scheduled PM for Press 7?",
    answers: {
      flashLite: "Press 7 next PM: June 28, 2026. PM type: Level 2 (hydraulic inspection + lubrication). Estimated downtime: 4 hours.",
      flash:     "Press 7 — Next PM scheduled: June 28, 2026 (14 days away). PM Level 2: hydraulic inspection, lubrication, die alignment check. Estimated downtime: 4 hours. Current run hours: 1,842 of 2,000 hour interval.",
      opus:      "Press 7 — Next PM: June 28, 2026 (14 days). Level 2 PM: hydraulic inspection, lubrication circuit flush, die alignment check. Run hours: 1,842/2,000 (92% of interval). Estimated downtime: 4h. Note: vibration sensor on bearing #3 has been trending upward (+12% over last 30 days) — recommend adding a bearing inspection to this PM.",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q3",
    category: "diagnostic",
    question: "Press 12 is showing fault code E-4421. What does that mean and what should I do?",
    answers: {
      flashLite: "E-4421: Hydraulic pressure low. Check hydraulic fluid level and pump pressure. If pressure is below spec, notify maintenance.",
      flash:     "E-4421 — Hydraulic Pressure Low Fault on Press 12.\n\n**Likely causes**: Low fluid level, pump wear, filter blockage, or pressure relief valve sticking.\n**Immediate steps**:\n1. Check hydraulic fluid level in reservoir (should be between MIN/MAX)\n2. Check pressure gauge — operating spec is 180-220 bar\n3. If fluid OK and pressure low: notify maintenance (possible pump issue)\n4. Do NOT restart press until pressure is confirmed in spec",
      opus:      "**E-4421: Hydraulic Pressure Low — Press 12**\n\nThis fault typically has 4 root causes ranked by frequency on this press model:\n\n1. **Filter blockage** (most common, ~60%): Last filter change was 847 hours ago — your 750-hour interval is overdue. Check bypass indicator first.\n2. **Low fluid level**: Reservoir should show between MIN/MAX marks — check immediately.\n3. **Pump wear**: If fluid and filter are fine, pump delivery may be declining. Run pump pressure test (target 220 bar ±5%).\n4. **Pressure relief valve**: Sticking valve sends fluid back to tank. Requires maintenance bypass test.\n\n**Your action**: Check filter bypass indicator → check fluid level → report readings to maintenance before restart. Press 12 had this fault 3 times in the last 90 days — a recurring fault pattern. I recommend escalating to reliability engineering for root cause analysis.",
    },
    scores: { flashLite: 3, flash: 4, opus: 5 },
    sellerNote: "Fault diagnosis with machine history context is where tiered routing pays off. Flash-Lite handles status lookups; Opus handles pattern diagnosis that could prevent recurring failures and unplanned downtime.",
  },
  {
    id: "q4",
    category: "diagnostic",
    question: "Weld quality on Station 5 dropped below spec in the last 30 minutes. How do I troubleshoot?",
    answers: {
      flashLite: "Weld quality issues can be caused by wire feed problems, shielding gas pressure, contact tip wear, or base material contamination. Check each in order.",
      flash:     "Station 5 weld quality drop — troubleshoot in this order:\n1. **Wire feed**: Check tension and liner — slippage causes inconsistent deposition\n2. **Shielding gas**: Verify flow rate (target: 15-20 L/min) and check for hose leaks\n3. **Contact tip**: Inspect for wear or spatter buildup — replace if deformed\n4. **Base material**: Check for surface contamination or part variation from upstream\n\nCurrent weld parameter logs show wire feed speed dropped 8% at 14:32 — likely start point for investigation.",
      opus:      "**Station 5 Weld Quality Drop Analysis**\n\nParameter logs show two anomalies in the last 30 minutes:\n\n1. **Wire feed speed**: Dropped from 4.8 m/min to 4.4 m/min at 14:32 (-8.3%). This is your most likely root cause — correlates with the quality drop at 14:34.\n2. **Arc voltage**: Fluctuating ±2.1V vs normal ±0.5V tolerance since 14:38. This often follows wire feed instability.\n\n**Immediate actions**:\n1. Stop production — do not run more parts at current settings\n2. Check wire spool tension (brake may be over-tightened causing feed drag)\n3. Inspect drive rolls for debris or wear\n4. Check liner for kinking — especially after recent reel change at 13:55\n\n**Scope**: 47 parts were produced in the quality-drop window (14:32–15:02). Flag for 100% inspection before they move to the next station. Do you want me to generate a quality hold notification for those part serial numbers?",
    },
    scores: { flashLite: 2, flash: 4, opus: 5 },
    sellerNote: "Root cause diagnosis with live parameter data is Opus territory. The ROI here is catching defects before they reach downstream stations or customers.",
  },
  {
    id: "q5",
    category: "safety",
    question: "The emergency stop on Robot Cell 3 was triggered. Can I reset it?",
    answers: {
      flashLite: "Do NOT reset an e-stop without following proper lock-out/tag-out procedures. Contact your safety officer before proceeding.",
      flash:     "**Do not reset Robot Cell 3 e-stop without completing these steps**:\n\n1. Identify why the e-stop was triggered — check the fault log\n2. Complete lock-out/tag-out (LOTO) procedure before entering the cell\n3. Visually confirm the cause is resolved and cell is clear\n4. Only authorized personnel can reset after physical inspection\n5. Document the incident in the safety log\n\nNever bypass or reset an e-stop without understanding the root cause.",
      opus:      "**STOP — Do not reset Robot Cell 3 e-stop yet.**\n\nE-stop triggered at 14:47:23. Fault log shows: **Safety Scanner Zone 2 violation** — the area scanner detected an object in the restricted zone, not a button press. This is a more serious category than a manual e-stop.\n\n**Required procedure before reset**:\n1. **Mandatory LOTO**: Lock out all 6 energy isolation points before entering (see posted procedure FME-RC3-001)\n2. **Physical inspection**: Visually verify the robot arm is in home position and the cell is clear of personnel, tools, and parts\n3. **Scanner check**: Inspect safety scanner lens for obstruction or damage — a dirty lens can cause false zone violations\n4. **Authorized reset only**: Only the Area Safety Lead (currently on-shift: Marcus T.) or Maintenance Supervisor can authorize and perform the reset\n5. **Incident report**: A scanner zone violation requires a same-shift incident report per OSHA 1910.217\n\n**Do not allow production restart until Marcus T. or Maintenance has signed off.** I've sent an alert to the supervisor dashboard.",
    },
    scores: { flashLite: 3, flash: 4, opus: 5 },
    sellerNote: "Safety procedures are life-critical moments. Opus reads the fault type, knows the difference between a manual e-stop and a scanner zone violation, and triggers the right safety workflow. This is exactly where you want frontier reasoning.",
  },
  {
    id: "q6",
    category: "safety",
    question: "We need to do an unplanned override on the machine guard — line manager approved it verbally. How do I proceed?",
    answers: {
      flashLite: "Machine guard overrides require written authorization. A verbal approval from a line manager is not sufficient. Contact your safety officer for the bypass permit process.",
      flash:     "**Verbal approval is not sufficient for a machine guard override.**\n\nRequired steps:\n1. Written bypass permit signed by EHS manager (not line manager)\n2. Lock-out/tag-out of all affected energy sources\n3. Risk assessment documented for the specific task\n4. Secondary person must maintain visual watch during the override\n5. Time-limited override only — maximum duration must be specified\n\nDo not proceed based on verbal authorization alone. This is a safety violation that can result in disciplinary action and regulatory citations.",
      opus:      "**I cannot guide you through an unauthorized machine guard override.**\n\nA verbal line manager approval does not meet the legal or company requirements for a machine guard bypass. Here's why this matters:\n\n**Legal exposure**: OSHA 29 CFR 1910.212 requires machine guarding to be maintained. An undocumented bypass is a willful violation — penalties up to $15,625 per incident, and criminal liability if an injury occurs.\n\n**Company policy**: Machine guard bypasses require a written Safety Override Permit (Form EHS-007), signed by the EHS Manager — not the line manager. The permit requires a documented risk assessment, a second authorized observer, and a defined time limit.\n\n**What to do right now**:\n1. Do not touch the guard or attempt the override\n2. Call the EHS duty phone (ext. 4400) — available 24/7 for exactly this situation\n3. Have your line manager call EHS to get the permit process started — a properly authorized bypass can often be issued within 30 minutes\n4. If production is stopped due to this, document the reason as 'awaiting safety authorization'\n\nI've logged this request in the safety incident tracking system as a near-miss event, as required by policy. EHS will follow up.",
    },
    scores: { flashLite: 3, flash: 4, opus: 5 },
    sellerNote: "This is the highest-stakes moment in the floor assistant — an operator about to bypass a safety guard based on verbal approval. Opus knows the regulatory framework, refuses to enable the bypass, and triggers the right safety process. Flash-Lite's answer could get someone hurt.",
  },
];

// ─── S3: Visual Quality Inspection Pipeline ──────────────────────────────
// Camera captures parts at end-of-line; Flash extracts defect candidates;
// Opus categorizes severity and disposition (pass/rework/scrap).
export const FACT_S3 = {
  visionInput: 18000,
  analysisOut:  1500,
  structuredOut:  800,
  structuredReInput: 4000,
  lanes: {
    pureClaude: { model: "opus"  as const, latencyMs: 3800, quality: 5, label: "Pure Claude Opus" },
    pureGemini: { model: "flash" as const, latencyMs: 650,  quality: 3, label: "Pure Gemini Flash" },
    hybrid:     { ingest: "flash" as const, analyze: "opus" as const, latencyMs: 2100, quality: 5, label: "Hybrid — Flash scan → Opus disposition" },
  },
  defaults: { inspectionsPerYear: 5_000_000 },
};

export interface FactoryQualityCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  findings: { item: string; status: string; trend: string }[];
}

export const FACT_S3_CARDS: FactoryQualityCard[] = [
  {
    id: "part1",
    title: "Stamped Metal Housing",
    description: "End-of-line inspection — surface defects & dimensional check",
    tags: ["stamping", "surface defect", "dimensional", "burr detection"],
    findings: [
      { item: "Surface finish", status: "3 micro-scratches detected", trend: "↑ Above threshold" },
      { item: "Edge burrs", status: "2 locations, 0.3mm height", trend: "↑ Exceeds 0.2mm spec" },
      { item: "Hole diameter #1", status: "12.02mm (spec: 12.00±0.05)", trend: "→ In spec" },
      { item: "Flatness", status: "0.08mm deviation", trend: "→ Within 0.10mm spec" },
      { item: "Disposition", status: "REWORK — deburring required", trend: "↑ Flag" },
    ],
  },
  {
    id: "part2",
    title: "PCB Assembly Inspection",
    description: "Post-solder visual inspection — solder joint quality & component placement",
    tags: ["PCB", "solder joints", "component placement", "tombstoning"],
    findings: [
      { item: "Solder bridges", status: "0 detected", trend: "✓ Pass" },
      { item: "Cold solder joints", status: "2 joints on U12 (BGA)", trend: "↑ Rework required" },
      { item: "Component placement", status: "All 847 components placed", trend: "✓ Pass" },
      { item: "Tombstoning", status: "1 resistor (R44) lifted",      trend: "↑ Scrap candidate" },
      { item: "Disposition", status: "REWORK — R44 reflow + U12 reflow", trend: "↑ Flag" },
    ],
  },
  {
    id: "part3",
    title: "Weld Seam Verification",
    description: "Robotic weld bead geometry and porosity inspection",
    tags: ["weld", "porosity", "bead geometry", "undercut"],
    findings: [
      { item: "Bead width", status: "8.2mm avg (spec: 8±1mm)", trend: "✓ In spec" },
      { item: "Porosity", status: "No voids detected (>0.5mm)", trend: "✓ Pass" },
      { item: "Undercut", status: "0.15mm at joint #3", trend: "↑ At limit (0.15mm max)" },
      { item: "Weld length", status: "142.3mm (spec: 142±0.5mm)", trend: "✓ In spec" },
      { item: "Disposition", status: "PASS — monitor undercut trend", trend: "→ Accept" },
    ],
  },
];

export function factS3Costs() {
  const { visionInput, analysisOut, structuredOut, structuredReInput } = FACT_S3;
  const pureClaude = callCost("opus",  visionInput, analysisOut);
  const pureGemini = callCost("flash", visionInput, analysisOut);
  const hybrid     = callCost("flash", visionInput, structuredOut) + callCost("opus", structuredReInput, analysisOut);
  return { pureClaude, pureGemini, hybrid };
}

// ─── S4: Predictive Maintenance Agent ────────────────────────────────────
// Nightly agent sweeps all monitored machines — sensor data, vibration trends,
// thermal readings — and generates maintenance tickets and priority queue.
export const FACT_S4 = {
  planner:  { inTok: 7000, outTok: 2500 },
  review:   { inTok: 9000, outTok: 2500 },
  executor: { inTok: 4000, outTok: 1000 },
  steps: 13,
  configs: {
    allOpus: { planner: "opus" as const, executor: "opus" as const, review: "opus" as const },
    tiered:  { planner: "opus" as const, executor: "flash" as const, review: "opus" as const },
  },
  defaults: { machinesPerRun: 3000, runsPerYear: 365 },
};

export type FactS4Config = keyof typeof FACT_S4["configs"];

export interface FactAgentNode {
  id: number;
  label: string;
  role: "planner" | "executor" | "reviewer";
  inTok: number;
  outTok: number;
}

export const FACT_S4_TRACE: FactAgentNode[] = [
  { id: 0,  label: "Load machine registry & prioritize by risk score", role: "planner",  inTok: 7000,  outTok: 2500 },
  { id: 1,  label: "Pull vibration sensor readings (last 24h)",        role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 2,  label: "Pull thermal camera snapshots",                    role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 3,  label: "Pull current draw & power signatures",             role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 4,  label: "Check lubrication system pressure logs",           role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 5,  label: "Analyze vibration FFT for bearing wear patterns",  role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 6,  label: "Cross-reference with OEM degradation curves",      role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 7,  label: "Check remaining useful life estimates (RUL)",      role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 8,  label: "Verify spare parts availability in CMMS",          role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 9,  label: "Check technician schedule & shift availability",   role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 10, label: "Draft maintenance work orders",                    role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 11, label: "Calculate production impact of planned downtime",  role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 12, label: "Flag critical-risk machines for immediate action", role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 13, label: "Sort & stage priority queue for morning handover", role: "executor", inTok: 4000,  outTok: 1000 },
  { id: 14, label: "Maintenance supervisor sign-off & dispatch",       role: "reviewer", inTok: 9000,  outTok: 2500 },
];

export function factS4Costs(cfg: FactS4Config = "tiered") {
  const config = FACT_S4.configs[cfg];
  const { planner, review, executor, steps } = FACT_S4;
  const plannerCost  = callCost(config.planner,  planner.inTok,  planner.outTok);
  const reviewCost   = callCost(config.review,   review.inTok,   review.outTok);
  const executorCost = steps * callCost(config.executor, executor.inTok, executor.outTok);
  return { plannerCost, reviewCost, executorCost, total: plannerCost + executorCost + reviewCost };
}

export function factS4Annual(machinesPerRun: number, cfg: FactS4Config = "tiered") {
  return factS4Costs(cfg).total * machinesPerRun * FACT_S4.defaults.runsPerYear;
}

// ─── Seller Notes ────────────────────────────────────────────────────────
export const FACT_SELLER_NOTES = {
  s1: {
    title: "Build Phase — IoT & PLC Platform",
    assumption: "55% routine boilerplate / 30% mid-tier adapters / 15% safety-critical architecture. Factory codebases are heavily boilerplate — sensor parsers, CRUD, test suites — with a small critical core.",
    sayThis: "Factory software is 55% boilerplate — unit tests, CRUD endpoints, Docker configs. Flash-Lite handles that at a fraction of the cost. The safety interlock logic and SCADA integration? That's 15% of the code and 100% on Opus. Result: ~64% build savings without touching the critical path.",
  },
  s2: {
    title: "Run Phase — Floor Operator Assistant",
    assumption: "3M queries/month across 5 plants. 65% are production status lookups (Flash-Lite); 25% fault diagnosis and troubleshooting (Flash); 10% safety procedures and override requests (Opus).",
    sayThis: "Shift count lookups and PM schedules run on Flash-Lite. E-stop resets and guard overrides go to Opus — where the wrong answer has safety and OSHA implications. Tiered routing isn't just economics; it's the right risk architecture.",
  },
  s3: {
    title: "Run Phase — Visual Quality Inspection",
    assumption: "5M end-of-line inspections per year. Flash identifies defect candidates from high-res imagery; Opus makes the pass/rework/scrap disposition call. Pure Gemini Flash disposition accuracy is too low for this application.",
    sayThis: "Flash scans 5 million parts per year in under a second each. Opus makes the disposition call. You get Opus accuracy on part quality decisions at 45% of pure-Opus cost — and Flash-only accuracy isn't good enough when a scrap call affects a $400 casting.",
  },
  s4: {
    title: "Extend Phase — Predictive Maintenance Agent",
    assumption: "3,000 monitored machines, swept nightly. 13 data-pull steps per machine (vibration, thermal, power, lubrication) run on Flash. Only the priority triage and maintenance supervisor dispatch need Opus reasoning.",
    sayThis: "Thirteen data-pull steps per machine — sensor logs, OEM curves, spare parts availability — all on Flash. Opus writes the morning maintenance brief and decides which machines get same-day attention. Two steps of frontier reasoning, thirteen steps of efficient data work. That's the architecture.",
  },
};
