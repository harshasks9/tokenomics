// ONE DESK — content model.
//
// Evidence discipline: every claim carries a `kind`.
//   fact      — verifiable from public record / regulation / reported case
//   vendor    — vendor-published benchmark, no independent counterfactual
//   inference — reasoned from the above, labelled as such
// Nothing here states internal volumes, costs or architecture of a named
// institution as fact.

export type Kind = "fact" | "vendor" | "inference";

export const KIND_META: Record<Kind, { label: string; color: string; note: string }> = {
  fact: { label: "Fact", color: "#1D6A4F", note: "From public record, regulation, filings or reported case" },
  vendor: { label: "Vendor benchmark", color: "#9A6B12", note: "Vendor-published. No independent counterfactual. Directional only." },
  inference: { label: "Inference", color: "#6B4E9A", note: "Reasoned from the cited evidence — not a measured figure" },
};

export type Source = { id: string; label: string; url: string };

export const SOURCES: Record<string, Source> = {
  nber: { id: "nber", label: "NBER w33257 — chatbot outreach trials", url: "https://www.nber.org/papers/w33257" },
  gsu: { id: "gsu", label: "Page & Gehlbach, AERA Open 2017 — Georgia State 'Pounce'", url: "https://files.eric.ed.gov/fulltext/EJ1194134.pdf" },
  castleman: { id: "castleman", label: "Castleman — why text interventions aren't working at scale", url: "https://behavioralscientist.org/why-arent-text-message-interventions-designed-to-boost-college-success-working-at-scale/" },
  meritto: { id: "meritto", label: "Meritto Enrollment Index 2026 (4.3 crore inquiries)", url: "https://m.thewire.in/article/ptiprnews/ai-led-discovery-converts-6x-better-than-digital-reveals-merittos-enrollment-index-2026" },
  rtmnu: { id: "rtmnu", label: "RTMNU Nagpur result & marksheet errors, 2026", url: "https://news.careers360.com/rtmnu-nagpur-university-exam-results-2026-chaos-delay-marksheet-errors-absent-fail-witheld-530-colleges-bcom-bsc-b-tech-mix-up" },
  edhitch: { id: "edhitch", label: "One Nation One Data — NAAC/NIRF/AISHE silos", url: "https://www.edhitch.com/one-nation-one-data-naac-nba-nirf.html" },
  dpdpSchedule: { id: "dpdpSchedule", label: "DPDP Rules 2025, Fourth Schedule", url: "https://www.dpdpa.com/schedule/schedule4.html" },
  dpdpPhase: { id: "dpdpPhase", label: "DPDP phased rollout & compliance milestones", url: "https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/" },
  dpdpChild: { id: "dpdpChild", label: "DPDP s.9(3) — children's data, tracking prohibition", url: "https://cyberpeace.org/resources/blogs/prohibition-of-behavioral-tracking-and-targeted-advertising-for-children-under-the-dpdp-act-2023" },
  trai: { id: "trai", label: "TRAI TCCCPR 2025 amendments — DLT, DND, time windows", url: "https://www.sigmachambers.in/post/2025-tcccpr-amendments-a-renewed-push-by-trai-for-order-in-commercial-communications-1" },
  ugcGrievance: { id: "ugcGrievance", label: "UGC Redressal of Grievances Regulations 2023", url: "https://www.teamleaseregtech.com/updates/article/22961/university-grants-commission-redressal-of-grievances-of-students-regul/" },
  ugcRefund: { id: "ugcRefund", label: "UGC Fee Refund Policy", url: "https://www.ugc.gov.in/pdfnews/1654477_Fee-Refund-Policy-2024-25.pdf" },
  abc: { id: "abc", label: "UGC ABC/NAD upload mandate — window closed 30 June 2026", url: "https://www.freepressjournal.in/education/ugc-orders-heis-to-upload-examination-year-2025-academic-records-on-nad-abc-platform-by-june-30" },
  nad: { id: "nad", label: "NAD onboarding statistics", url: "https://nad.digilocker.gov.in/statistics" },
  cuet: { id: "cuet", label: "CUET-UG 2026 — 185 universities, exams 11–31 May", url: "https://news.careers360.com/cuet-ug-2026-exam-date-registration-begins-nta-hold-exams-from-may-11-31-admission-central-state-universities-cbt-link" },
  nsp: { id: "nsp", label: "NSP verification gates & rejection causes", url: "https://www.buddy4study.com/article/nsp-scholarship-payment-status" },
  rti: { id: "rti", label: "Document delays — 30-day SLA, RTI as unblocker", url: "https://filemyrti.com/issue/migration-certificate-delayed-use-rti-to-get-the-status-on-record" },
  transcripts: { id: "transcripts", label: "No-dues as the silent blocker on certificates", url: "https://worldwidetranscripts.com/how-to-resolve-delays-in-academic-transcripts-procurement-from-indian-universities/" },
  connect: { id: "connect", label: "Counsellor connect rates & CPL benchmarks", url: "https://bloomagency.in/education-lead-generation-top-13-channels-for-indian-higher-education/" },
  whatsapp: { id: "whatsapp", label: "WhatsApp per-message pricing, from July 2025", url: "https://blueticks.co/blog/whatsapp-business-api-pricing-2026" },
  fees: { id: "fees", label: "Parent fee-increase survey", url: "https://yourstory.com/2025/05/how-can-indian-parents-future-proof-education-expenses" },
  samarth: { id: "samarth", label: "SAMARTH eGov — MoE open-source university ERP", url: "https://samarth.edu.in/about/" },
  googleEdu: { id: "googleEdu", label: "Google's India education commitments, Jan 2026", url: "https://blog.google/intl/en-in/building-the-future-of-learning-our-new-commitments-to-indias-education-ecosystem/" },
  invertis: { id: "invertis", label: "Invertis — India's fifth 'Google Agentic AI University'", url: "https://aninews.in/news/business/invertis-university-announces-a-new-milestone-as-regions-first-amp-indias-fifth-google-agentic-ai-university20260730162842/" },
};

// ─── Personas ───────────────────────────────────────────────────────────────

export type Persona = {
  id: string;
  name: string;
  role: string;
  detail: string;
  accent: string;
};

export const PERSONAS: Persona[] = [
  { id: "ananya", name: "Ananya", role: "Applicant, 17", detail: "First-generation learner from Nagpur. Marathi at home. Under 18 on the day she applies — so the law treats her differently from every other user of this system.", accent: "#8C2F39" },
  { id: "suresh", name: "Suresh", role: "Ananya's father", detail: "Pays the fees, co-signs the loan, makes the decision with her. Speaks Marathi. No institutional channel is addressed to him.", accent: "#9A6B12" },
  { id: "ananya-final", name: "Ananya, three years on", role: "Final-year student", detail: "Same person, same institution, different system — and no shared key between the record that admitted her and the one that will graduate her.", accent: "#1D6A4F" },
  { id: "kulkarni", name: "Prof. Kulkarni", role: "Controller of Examinations", detail: "Owns the results process. Four hundred marksheet discrepancies and a physical queue outside the office.", accent: "#3E5C8A" },
  { id: "rao", name: "Dr. Rao", role: "Pro-Vice-Chancellor", detail: "Accountable for seats filled by the cut-off date, and for the evidence trail NAAC Criterion 5 will ask for.", accent: "#6B4E9A" },
];

// ─── Split-screen scenarios ─────────────────────────────────────────────────

export type Actor = "person" | "counter" | "system" | "silence" | "agent" | "human-gate";

export const ACTOR_META: Record<Actor, { label: string; color: string }> = {
  person: { label: "Student / parent", color: "#8C2F39" },
  counter: { label: "Counter / desk", color: "#A0522D" },
  system: { label: "System", color: "#6B6259" },
  silence: { label: "No one", color: "#B4413C" },
  agent: { label: "Agent", color: "#0F766E" },
  "human-gate": { label: "Human approval", color: "#9A6B12" },
};

export type Step = {
  at: number;        // 0..1 position in the loop
  clock: string;     // "Day 4", "11:42", "min 3"
  label: string;
  detail: string;
  actor: Actor;
  channel?: string;
  pain?: string;     // left lane only
  gate?: boolean;    // right lane: human approval point
  cite?: string;     // right lane: what the agent grounded on
};

export type Scenario = {
  id: string;
  personaId: string;
  moment: string;          // what the human says
  situation: string;       // one line of framing
  leftTitle: string;
  rightTitle: string;
  left: Step[];
  right: Step[];
  rightDoneAt: number;     // fraction of loop when the agentic lane completes
  leftEndClock: string;    // where the left lane is when the loop ends
  rightResolvedIn: string;
  verdict: string;         // the sentence that lands the point
  evidence: { text: string; kind: Kind; src?: string }[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "scholarship",
    personaId: "ananya",
    moment: "The scholarship portal rejected my form.",
    situation: "National Scholarship Portal. Two human verification gates, a hard deadline, and a defect nobody sees until it is too late.",
    leftTitle: "Today",
    rightTitle: "One Desk",
    rightDoneAt: 0.34,
    leftEndClock: "Day 21 — deadline passed",
    rightResolvedIn: "9 minutes, on the day it was submitted",
    verdict: "Nothing here required intelligence. It required someone to notice a name mismatch before a deadline — and nobody was watching.",
    left: [
      { at: 0.00, clock: "Day 0", label: "Ananya submits", detail: "Uploads documents to the National Scholarship Portal. Bank account is in her father's name; the Aadhaar record spells hers differently.", actor: "person", channel: "NSP portal" },
      { at: 0.10, clock: "Day 0", label: "Submitted. Silence.", detail: "The portal shows 'Submitted'. It does not validate the name against the bank record. No one is assigned to look.", actor: "system", pain: "Defect present at second zero — invisible" },
      { at: 0.24, clock: "Day 9", label: "Institute nodal officer queue", detail: "Level-1 verification. One officer, several hundred applications, no defect-detection tooling.", actor: "counter", pain: "Nine days of queue before a human eye" },
      { at: 0.42, clock: "Day 14", label: "District officer rejects", detail: "Level-2 verification returns it: Aadhaar–bank name mismatch. The rejection reason reaches the portal, not Ananya.", actor: "system", pain: "Rejection is recorded, not communicated" },
      { at: 0.60, clock: "Day 18", label: "She finds out by checking", detail: "Ananya opens the portal herself to see the status. There was no message. Her father asks what it means — the page is in English.", actor: "person", pain: "Status is pull, never push. And not in Marathi." },
      { at: 0.76, clock: "Day 20", label: "Bank, then back", detail: "Branch visit to correct the name. Two days. The correction propagates on the bank's schedule, not the portal's.", actor: "counter", pain: "Student is the courier between two institutions" },
      { at: 0.90, clock: "Day 21", label: "Window closed", detail: "The correction lands after the last date. The scholarship is gone for the year. The fee is not.", actor: "silence", pain: "One unread field. One academic year." },
    ],
    right: [
      { at: 0.00, clock: "min 0", label: "Ananya submits", detail: "Same form, same second.", actor: "person", channel: "NSP portal" },
      { at: 0.06, clock: "min 0", label: "Agent reads across three records", detail: "Aadhaar name, bank account name, admission record name. No shared key between them — the agent compares them anyway.", actor: "agent", cite: "NSP rejection-cause list: Aadhaar–bank name mismatch is a top-three cause" },
      { at: 0.12, clock: "min 1", label: "Defect found before the queue", detail: "Flags the exact field, the exact mismatch, and the exact deadline it threatens.", actor: "agent" },
      { at: 0.19, clock: "min 3", label: "Message to Suresh, in Marathi", detail: "Not to Ananya — to the person who holds the bank passbook. Approved utility template, filled variables, no free-composed copy.", actor: "agent", channel: "WhatsApp · Marathi", cite: "DLT-approved template · TRAI TCCCPR" },
      { at: 0.26, clock: "min 6", label: "Correction captured", detail: "Suresh photographs the passbook. The agent validates it against the Aadhaar record and prepares the amended submission.", actor: "person", channel: "WhatsApp" },
      { at: 0.30, clock: "min 8", label: "Nodal officer approves", detail: "One tap. The officer sees the defect, the fix and the evidence side by side — not a fresh application to read from scratch.", actor: "human-gate", gate: true },
      { at: 0.34, clock: "min 9", label: "Resubmitted, tracked", detail: "Amended application filed. Ananya and Suresh both get the status, in Marathi, at every stage change from here.", actor: "agent" },
    ],
    evidence: [
      { text: "NSP runs two sequential human verification gates — Institute Nodal Officer, then District Nodal Officer. Common rejection causes are incorrect bank details, Aadhaar–bank name mismatch, and unclear uploaded documents.", kind: "fact", src: "nsp" },
      { text: "The defect exists at submission. Every day between submission and rejection is a day the correction could have been made inside the window.", kind: "inference" },
      { text: "44% of Indian parents report fee increases of 50–80% over three years — a lost scholarship is not an inconvenience, it is a financing event for the household.", kind: "fact", src: "fees" },
    ],
  },
  {
    id: "nodues",
    personaId: "ananya-final",
    moment: "I need a no-dues certificate to get my transcript.",
    situation: "The highest-friction artifact in Indian higher education: a serialised signature chain where any node can silently stall everything downstream.",
    leftTitle: "Today",
    rightTitle: "One Desk",
    rightDoneAt: 0.40,
    leftEndClock: "Day 34 — still one signature short",
    rightResolvedIn: "2 days, with the blocker named on day one",
    verdict: "The chain did not fail. It stalled on a ₹40 library fine that nobody told her about, for twenty-six days.",
    left: [
      { at: 0.00, clock: "Day 0", label: "Applies for transcript", detail: "Told at the counter: bring a signed no-dues certificate first.", actor: "counter", channel: "Examination office" },
      { at: 0.10, clock: "Day 2", label: "Department signature", detail: "Head of department signs. One of four.", actor: "counter" },
      { at: 0.22, clock: "Day 5", label: "Hostel warden signs", detail: "Two of four. Warden available Tuesdays and Thursdays.", actor: "counter", pain: "Availability windows, not queues" },
      { at: 0.34, clock: "Day 8", label: "Mess clearance", detail: "Three of four. She now carries a paper with three signatures and no copy.", actor: "person", pain: "Student is the only courier — and the only backup" },
      { at: 0.48, clock: "Day 8", label: "Library: refused", detail: "A ₹40 fine from her second year. It has been on the ledger for twenty-six months. Nobody has ever mentioned it.", actor: "silence", pain: "The blocker was knowable on day zero" },
      { at: 0.66, clock: "Day 19", label: "Fine paid, chain restarted", detail: "Accounts counter, receipt, back to library. Two of the earlier signatures are now more than 15 days old and must be re-obtained.", actor: "counter", pain: "Staleness rules restart the chain" },
      { at: 0.84, clock: "Day 30", label: "RTI drafted", detail: "A classmate suggests filing an RTI. It is widely described as the point where a stalled file starts moving.", actor: "person", pain: "Escalation is a legal instrument or nothing" },
    ],
    right: [
      { at: 0.00, clock: "Day 0", label: "She asks, in one message", detail: "\"I need my transcript.\" No form, no counter, no knowledge of what a no-dues chain is.", actor: "person", channel: "WhatsApp · Marathi" },
      { at: 0.07, clock: "Day 0", label: "Agent opens the chain", detail: "Reads all four clearance states at once — department, hostel, mess, library — across systems that do not share an identity key.", actor: "agent", cite: "Institutional no-dues policy + ledger states" },
      { at: 0.15, clock: "Day 0", label: "Blocker named immediately", detail: "\"Three of four are clear. Library shows ₹40 outstanding from 2023. Pay here and I'll continue.\" Twenty-six days of hidden state, surfaced in ninety seconds.", actor: "agent" },
      { at: 0.22, clock: "Day 0", label: "Fine settled in-channel", detail: "Payment link, receipt written back to the library ledger. No accounts counter, no second trip.", actor: "person", channel: "WhatsApp · payment link" },
      { at: 0.29, clock: "Day 1", label: "Signatures requested in parallel", detail: "Not serial. All four approvers get a single-tap request with the evidence attached. The chain stops being a queue.", actor: "agent" },
      { at: 0.35, clock: "Day 2", label: "Registrar approves issue", detail: "A human still authorises the certificate. The agent assembled it; it did not decide it.", actor: "human-gate", gate: true },
      { at: 0.40, clock: "Day 2", label: "Transcript issued", detail: "Status was visible at every step. She never once had to ask where it was.", actor: "agent" },
    ],
    evidence: [
      { text: "No-dues clearance is required separately from hostel warden, mess, library and department before a certificate can issue — and is described as the most common silent blocker on transcripts and migration certificates.", kind: "fact", src: "transcripts" },
      { text: "Most states prescribe a 30-day SLA for educational documents, with penalty on the dealing officer for delay — implying the default experience exceeds it.", kind: "fact", src: "rti" },
      { text: "Filing an RTI is openly described as 'the point where a stalled file starts moving'. Between silent waiting and a legal instrument, there is nothing.", kind: "fact", src: "rti" },
    ],
  },
  {
    id: "marksheet",
    personaId: "kulkarni",
    moment: "Four hundred marksheets are wrong and there is a queue at my door.",
    situation: "A real 2026 case: students shown as failed in papers they passed, marked absent from exams they sat, internal marks missing.",
    leftTitle: "Today",
    rightTitle: "One Desk",
    rightDoneAt: 0.36,
    leftEndClock: "Day 12 — internships already lost",
    rightResolvedIn: "Same day, grouped by root cause",
    verdict: "Four hundred students each carrying the same defect to the same counter, one at a time, is not a support problem. It is an integration failure wearing a queue as a disguise.",
    left: [
      { at: 0.00, clock: "Day 0", label: "Results declared", detail: "Marksheets generated from the examination system. Internal marks from the department system did not all arrive.", actor: "system" },
      { at: 0.12, clock: "Day 1", label: "The queue forms", detail: "Students arrive individually. Each explains the same category of error from scratch. No triage, no grouping.", actor: "counter", pain: "400 identical conversations, held 400 times" },
      { at: 0.26, clock: "Day 3", label: "Manual verification, one file at a time", detail: "Staff pull each answer-script record by hand to confirm what the student already knows.", actor: "counter", pain: "Verification effort scales with students, not with defects" },
      { at: 0.44, clock: "Day 6", label: "Revaluation forms, paid and filed", detail: "Each student files separately. Each pays. Each waits without a status.", actor: "person", pain: "The student pays to correct the institution's error" },
      { at: 0.62, clock: "Day 9", label: "Internship offers lapse", detail: "Employers will not hold offers against an unresolved marksheet. Reported consequence of this exact case.", actor: "silence", pain: "Consequence lands outside the university's field of view" },
      { at: 0.80, clock: "Day 11", label: "Protest, then press", detail: "Students demand help centres for those from remote areas and timely revaluation results.", actor: "person", pain: "Escalation is the only status channel" },
      { at: 0.92, clock: "Day 12", label: "Corrections trickle", detail: "Fixed individually, in the order they were shouted about.", actor: "counter" },
    ],
    right: [
      { at: 0.00, clock: "Day 0", label: "Results declared", detail: "Same generation, same data gap.", actor: "system" },
      { at: 0.06, clock: "Day 0", label: "Agent reconciles before publication", detail: "Compares the examination record against the department's internal-marks record and the attendance register. Three systems, no shared key.", actor: "agent", cite: "Examination system · department internals · attendance register" },
      { at: 0.13, clock: "Day 0", label: "400 defects, 3 root causes", detail: "Not 400 tickets. One missing internal-marks upload, one subject-code mapping error, one absentee-flag import fault.", actor: "agent" },
      { at: 0.20, clock: "Day 0", label: "Kulkarni sees causes, not queue", detail: "Three decisions on his desk instead of four hundred conversations at his counter.", actor: "human-gate", gate: true },
      { at: 0.26, clock: "Day 0", label: "Students told before they ask", detail: "Each affected student gets their specific defect and its status — in their language — before they walk over.", actor: "agent", channel: "WhatsApp · Marathi / Hindi" },
      { at: 0.31, clock: "Day 0", label: "Revaluation pre-filled where needed", detail: "For cases needing formal revaluation, the form arrives complete. The student confirms; they do not compile.", actor: "agent" },
      { at: 0.36, clock: "Day 0", label: "Corrected marksheets issued", detail: "Grade changes remain a human authorisation. Every action is logged against the student record.", actor: "human-gate", gate: true },
    ],
    evidence: [
      { text: "At RTMNU Nagpur (530 colleges) in 2026, students waited around two weeks after results for marksheets that arrived with thousands of errors — shown as failed despite passing, marked absent from exams they sat, internal marks missing. Students lost internships.", kind: "fact", src: "rtmnu" },
      { text: "Student demands in that case were specifically for help centres for students from remote areas, and for timely declaration of revaluation results — both are status-visibility asks, not accuracy asks.", kind: "fact", src: "rtmnu" },
      { text: "Defect count and root-cause count are different numbers. Support capacity is sized against the first; engineering effort is sized against the second.", kind: "inference" },
    ],
  },
  {
    id: "fees",
    personaId: "suresh",
    moment: "What exactly do I owe, and by when?",
    situation: "The person who pays is not the person the institution talks to. Every channel in evidence is addressed to the student.",
    leftTitle: "Today",
    rightTitle: "One Desk",
    rightDoneAt: 0.30,
    leftEndClock: "Day 9 — paid late, penalty applied",
    rightResolvedIn: "4 minutes, in Marathi, to the person holding the passbook",
    verdict: "He was never unwilling to pay. He was never told, in a language he reads, what was owed and when.",
    left: [
      { at: 0.00, clock: "Day 0", label: "Fee circular published", detail: "PDF on the university website. English. Instalment table, penalty clause, refund cliff dates.", actor: "system", pain: "Published is not the same as delivered" },
      { at: 0.14, clock: "Day 2", label: "SMS to Ananya", detail: "DLT-templated, English, sent to the student's number. Suresh does not see it.", actor: "system", channel: "SMS", pain: "Addressed to the student, paid by the parent" },
      { at: 0.30, clock: "Day 4", label: "Suresh asks Ananya", detail: "She forwards a screenshot. Neither is certain whether the figure includes the hostel component.", actor: "person", pain: "The parent's channel is his daughter" },
      { at: 0.48, clock: "Day 6", label: "Calls the accounts office", detail: "Line busy through the morning. Reaches someone who reads from the same circular.", actor: "counter", pain: "Human middleware reading a PDF aloud" },
      { at: 0.66, clock: "Day 7", label: "Two sources of truth", detail: "The gateway dashboard and the ERP fee module disagree on what has been received. Reconciled by hand.", actor: "system", pain: "Two ledgers, one payer, no answer" },
      { at: 0.84, clock: "Day 9", label: "Paid late", detail: "Penalty applied. The delay was informational, not financial.", actor: "silence", pain: "Charged for the institution's ambiguity" },
    ],
    right: [
      { at: 0.00, clock: "min 0", label: "Suresh asks, in Marathi", detail: "\"मला किती भरायचे आहे?\" — on WhatsApp, in his own language, on his own number.", actor: "person", channel: "WhatsApp · Marathi" },
      { at: 0.07, clock: "min 1", label: "Agent verifies who he is", detail: "Registered guardian on Ananya's admission record. Entitled to fee information; not entitled to her academic record. The boundary is enforced, not assumed.", actor: "agent", cite: "Guardian relationship on admission record" },
      { at: 0.13, clock: "min 2", label: "One figure, grounded", detail: "Tuition, hostel, examination fee, less the scholarship still pending — cited line by line to the fee circular, with the clause quoted.", actor: "agent", cite: "Fee circular 2026-27, clause 4.2" },
      { at: 0.20, clock: "min 3", label: "Refund cliffs stated plainly", detail: "Full refund to 30 September; ₹1,000 deduction to 31 October. Told before the decision, not after it.", actor: "agent", cite: "UGC fee refund norms" },
      { at: 0.25, clock: "min 4", label: "Paid in-channel", detail: "Payment link, receipt, and a write-back that both the gateway and the fee ledger agree on.", actor: "person", channel: "WhatsApp · payment link" },
      { at: 0.30, clock: "min 4", label: "Instalment reminders scheduled", detail: "To Suresh. In Marathi. Inside the 9 AM–9 PM window, on approved templates.", actor: "agent", cite: "TRAI TCCCPR time window" },
    ],
    evidence: [
      { text: "Every documented institutional communication channel — placement WhatsApp groups, student portals, notice boards, counters — is addressed to the student only. No parent-facing layer appears anywhere in the research.", kind: "inference" },
      { text: "44% of Indian parents report fee increases of 50–80% over three years; 8% report over 80%.", kind: "fact", src: "fees" },
      { text: "UGC fee refund norms set hard dates: full refund on cancellation up to 30 September, up to ₹1,000 deduction until 31 October.", kind: "fact", src: "ugcRefund" },
      { text: "Where a payment gateway ships its own fee ledger alongside the ERP fee module, institutions can hold two competing sources of truth on who has paid.", kind: "inference" },
    ],
  },
  {
    id: "seats",
    personaId: "rao",
    moment: "It is 20 August. I am four hundred seats short.",
    situation: "The most valuable asset in the funnel is the enquiry pool nobody has capacity to work — and part of it cannot lawfully be scored.",
    leftTitle: "Today",
    rightTitle: "One Desk",
    rightDoneAt: 0.38,
    leftEndClock: "Cut-off — seats unfilled",
    rightResolvedIn: "The dormant pool worked in full, inside the law",
    verdict: "The counsellors were never the constraint on effort. They were the constraint on reach — and the highest-yield names were the ones they never had time to call twice.",
    left: [
      { at: 0.00, clock: "Week 1", label: "Counsellors dial the fresh list", detail: "Newest enquiries first. Job ads for this role ask for 100+ calls a day.", actor: "counter", channel: "Voice" },
      { at: 0.14, clock: "Week 1", label: "Most calls reach no one", detail: "Connect rates run 30–40%; of those, 20–30% are eligible and interested.", actor: "silence", pain: "Roughly 70% of counsellor time goes nowhere" },
      { at: 0.30, clock: "Week 2", label: "March enquiries go untouched", detail: "Five months old, no capacity, and no one believes they are worth calling.", actor: "silence", pain: "The dormant pool is the largest asset and the lowest priority" },
      { at: 0.48, clock: "Week 3", label: "Spend chases new leads", detail: "Fresh acquisition at rising cost — education CPL grew faster than any other vertical.", actor: "system", pain: "Paying again for reach already owned" },
      { at: 0.66, clock: "Week 4", label: "Parallel applications close elsewhere", detail: "CUET means the same candidate is live at several universities. Whoever answers first, wins.", actor: "silence", pain: "Speed is the moat; capacity is the ceiling" },
      { at: 0.84, clock: "Cut-off", label: "Seats unfilled", detail: "Reported as a demand problem. It was a reach problem.", actor: "silence" },
    ],
    right: [
      { at: 0.00, clock: "Week 1", label: "Agent works the dormant pool", detail: "Every enquiry from March onward — the ones no counsellor has time to call a second time.", actor: "agent" },
      { at: 0.07, clock: "Week 1", label: "Age gate first, before anything else", detail: "Ananya is 17. The agent does not score her, does not profile her, does not sequence her into a nurture flow. It routes to verifiable parental consent.", actor: "agent", cite: "DPDP s.9(3) — applies regardless of consent" },
      { at: 0.14, clock: "Week 1", label: "Reaches Suresh, not a persona", detail: "Approved template, Marathi, inside the permitted window. The agent selects a template; it does not compose copy.", actor: "agent", channel: "WhatsApp · Marathi", cite: "DLT-registered template · 9 AM–9 PM" },
      { at: 0.22, clock: "Week 2", label: "Blockers cleared, not pitched", detail: "Incomplete document, unclear fee, unanswered scholarship question. The re-engagement is a task completion, not a nudge.", actor: "agent" },
      { at: 0.29, clock: "Week 2", label: "Counsellors get the live ones", detail: "Human effort moves to the conversations where a person changes the outcome.", actor: "human-gate", gate: true },
      { at: 0.34, clock: "Week 3", label: "Every touch logged", detail: "Consent state, template used, time sent, outcome — the evidence trail NAAC Criterion 5 will ask for.", actor: "agent" },
      { at: 0.38, clock: "Cut-off", label: "Reach stops being the ceiling", detail: "The pool was worked in full. Whether that fills the seats is what a pilot measures — not what a vendor promises.", actor: "agent" },
    ],
    evidence: [
      { text: "Re-inquired leads are 14% of volume but drive 40% of enrolments, converting at 3.00% against 0.74% for first-time enquiries.", kind: "vendor", src: "meritto" },
      { text: "Same-day response converts roughly twice as well as responding a week later, in Indian education specifically.", kind: "vendor", src: "meritto" },
      { text: "Counsellor connect rates run 30–40%, of which 20–30% are eligible — roughly 70% of counsellor time goes nowhere.", kind: "fact", src: "connect" },
      { text: "CUET means one national score replaced institution-level cutoffs, so candidates apply in parallel at near-zero switching cost across a five-month decision window.", kind: "fact", src: "cuet" },
      { text: "Because most UG applicants are 17 at application and the DPDP educational-institution exemption is keyed to children enrolled with the institution, lead-scoring a prospective applicant is likely prohibited.", kind: "inference", src: "dpdpSchedule" },
    ],
  },
];

// ─── The middleware map ─────────────────────────────────────────────────────

export type SysNode = {
  id: string;
  label: string;
  sub: string;
  x: number;   // % of viewBox
  y: number;
  group: "front" | "core" | "money" | "outcome" | "regulator";
};

export const SYS_NODES: SysNode[] = [
  { id: "crm", label: "Admissions CRM", sub: "Meritto / LeadSquared", x: 14, y: 18, group: "front" },
  { id: "web", label: "Website & forms", sub: "Enquiry capture", x: 14, y: 44, group: "front" },
  { id: "wa", label: "WhatsApp", sub: "via a BSP", x: 14, y: 70, group: "front" },
  { id: "sms", label: "SMS", sub: "DLT-registered headers", x: 14, y: 90, group: "front" },
  { id: "erp", label: "SIS / ERP", sub: "SAMARTH · Camu · MasterSoft", x: 45, y: 30, group: "core" },
  { id: "exam", label: "Examination", sub: "Results, revaluation", x: 45, y: 60, group: "core" },
  { id: "lms", label: "LMS", sub: "Self-hosted Moodle", x: 45, y: 85, group: "core" },
  { id: "pay", label: "Payment gateway", sub: "Easebuzz · Razorpay", x: 72, y: 18, group: "money" },
  { id: "nsp", label: "Scholarships", sub: "National Scholarship Portal", x: 72, y: 42, group: "money" },
  { id: "place", label: "Placements", sub: "Superset", x: 72, y: 66, group: "outcome" },
  { id: "alum", label: "Alumni", sub: "Almabase · Vaave", x: 72, y: 88, group: "outcome" },
  { id: "abc", label: "DigiLocker / ABC", sub: "APAAR · NAD", x: 92, y: 30, group: "regulator" },
  { id: "reg", label: "AISHE · NIRF · NAAC", sub: "e-Samadhaan", x: 92, y: 62, group: "regulator" },
];

export type SysLink = { from: string; to: string; human: string; detail?: string };

// Every one of these is a join done by a person, because the systems either side
// hold different primary keys for the same human being.
export const SYS_LINKS: SysLink[] = [
  { from: "crm", to: "erp", human: "A counsellor re-keys the admitted student into the ERP", detail: "The CRM owns the record from enquiry to fee-paid, then hands off to an ERP that does not share its data model. This is the most common re-keying point in an Indian university." },
  { from: "web", to: "crm", human: "A data-entry clerk de-duplicates the same applicant across three forms" },
  { from: "wa", to: "crm", human: "A counsellor copies the WhatsApp conversation into the CRM notes field" },
  { from: "sms", to: "erp", human: "A clerk exports a phone-number list per notification batch" },
  { from: "erp", to: "exam", human: "A department clerk uploads internal marks by spreadsheet", detail: "When that upload is incomplete or mis-mapped, the defect surfaces as a wrong marksheet — the RTMNU pattern." },
  { from: "erp", to: "lms", human: "Enrolment is synced by CSV, once a semester" },
  { from: "erp", to: "pay", human: "Accounts reconciles the gateway ledger against the fee module by hand", detail: "The gateway ships its own fee ledger. Two sources of truth on who has paid." },
  { from: "erp", to: "nsp", human: "The institute nodal officer verifies each scholarship claim manually" },
  { from: "erp", to: "place", human: "The placement cell maintains its own student database from a spreadsheet export" },
  { from: "erp", to: "alum", human: "Graduating records are exported to the alumni platform once a year" },
  { from: "exam", to: "abc", human: "Credit and marksheet data is uploaded student-by-student against APAAR IDs", detail: "The UGC upload window for Examination Year 2025 closed permanently on 30 June 2026. A mismatch caused by two systems disagreeing becomes an unfixable harm to that student's credit record." },
  { from: "erp", to: "reg", human: "Three different people file three different numbers for the same fact", detail: "The IQAC coordinator fills the NAAC SSR from one silo. The NIRF in-charge fills NIRF from another. The Registrar files AISHE from a third. A documented case: 210 faculty in the NAAC SSR, 166 in NIRF, 195 in AISHE — and nobody compares them." },
];

// ─── Evidence panel ─────────────────────────────────────────────────────────

export const EVIDENCE_PANEL = {
  against: {
    title: "What did not work",
    finding: "General AI outreach fails at scale.",
    body: "Two large trials — 13,657 students exploratory, 11,561 pre-registered confirmatory — found chatbot outreach moves outcomes only for discrete, time-sensitive administrative tasks aimed at the students who actually face them. Broad 'support and nudge' availability did not replicate.",
    kicker: "Ben Castleman, who helped create this field, has publicly asked why these interventions aren't working at scale.",
    src: "nber",
    src2: "castleman",
  },
  forIt: {
    title: "What did work",
    finding: "Clearing specific tasks before a deadline.",
    body: "Georgia State's 'Pounce' produced a 3.3 percentage-point enrolment lift — a 21% reduction in summer melt — in a randomised trial. It worked because it cleared named pre-enrolment tasks with dates attached: forms, holds, confirmations.",
    kicker: "Nine years on, this is still the strongest proof point the entire category has.",
    src: "gsu",
  },
  principle: {
    title: "So the product is an actuator, not a companion",
    body: "A pitch built on a 24/7 AI counsellor argues against the best available science. A pitch built on clearing the specific administrative blocker, in the parent's language, before the deadline — argues with it. Every scenario on this page is a blocked task with a date on it. That is not a design preference. It is what the evidence supports.",
  },
};

// ─── Compliance console ─────────────────────────────────────────────────────

export type Constraint = {
  id: string;
  trigger: string;
  naive: string;
  refusal: string;
  instead: string;
  rule: string;
  src: string;
  why: string;
};

export const CONSTRAINTS: Constraint[] = [
  {
    id: "minor",
    trigger: "Score this 17-year-old applicant's likelihood to convert and put her in a nurture sequence.",
    naive: "Assign propensity score · add to 6-touch drip · retarget on social",
    refusal: "Declined. Ananya is under 18.",
    instead: "Route to verifiable parental consent. Communicate with the registered guardian. No profiling, no behavioural sequencing, no retargeting.",
    rule: "DPDP s.9(3) prohibits tracking, behavioural monitoring and targeted advertising directed at children — regardless of whether parental consent was obtained. The Fourth Schedule exemption for educational institutions is keyed to children enrolled with the institution; a prospective applicant is not yet enrolled.",
    src: "dpdpChild",
    why: "Most UG applicants in India are 17 when they apply. This is not an edge case — it is the default path. Any competitor whose core loop is lead-scoring has a problem dated 12 May 2027.",
  },
  {
    id: "template",
    trigger: "Write a persuasive follow-up message to this applicant and send it.",
    naive: "Generate copy · send from a 10-digit number",
    refusal: "Declined. The agent does not author outbound copy.",
    instead: "Select a DLT-registered template, fill only the approved variables, send on a 140/1600-series route.",
    rule: "TRAI TCCCPR requires three-layer DLT registration — entity, header, and content template. Free-composed commercial messaging cannot be delivered lawfully; penalties escalate to a one-year disconnection and cross-operator blacklisting.",
    src: "trai",
    why: "This constrains the agent in exactly the place where a generative system would otherwise be most impressive — and it is why generative messaging cannot be the differentiator. The differentiator is what happens in the systems, not in the sentence.",
  },
  {
    id: "window",
    trigger: "It is 7:40 AM. Send the fee reminder now.",
    naive: "Send immediately",
    refusal: "Held. Outside the permitted window.",
    instead: "Queued for 9:00 AM. DND status checked. If the recipient replies first, the response is free-form inside the 24-hour service window.",
    rule: "Promotional communication is DND-scrubbed and restricted to 9 AM–9 PM. Since July 2025 WhatsApp bills per message, with utility messages inside the 24-hour customer-service window free — the economics reward answering over broadcasting.",
    src: "trai",
    why: "The regulation and the pricing point the same way: be reactive and be useful. A system built to broadcast is both more expensive and more legally exposed than one built to answer.",
  },
  {
    id: "grievance",
    trigger: "This student has filed a grievance. Resolve it.",
    naive: "Determine outcome · close ticket",
    refusal: "Declined. The agent does not determine grievances.",
    instead: "Acknowledge, classify, route to the Student Grievance Redressal Committee, track the statutory clock, escalate before day 60, and assemble the evidence trail.",
    rule: "UGC's 2023 regulations reserve determination for the SGRC and Ombudsperson, with resolution required within a maximum of 60 days.",
    src: "ugcGrievance",
    why: "The agent's value here is the clock and the paper trail, not the judgement. Institutions breach the 60-day duty because nobody is watching the clock — not because nobody can decide.",
  },
];

// ─── Architecture ───────────────────────────────────────────────────────────

export const ARCH = [
  {
    id: "ground",
    name: "Ground",
    owner: "Gemini Enterprise Agent Platform",
    body: "Institutional knowledge as it actually exists: fee circulars, examination ordinances, hostel rules, the prospectus, UGC notifications. Every answer cites the clause it came from. If the circular does not say it, the agent does not say it.",
    items: ["Circulars & ordinances", "Prospectus", "Fee policy", "Grievance regulations", "Citation on every answer"],
  },
  {
    id: "identity",
    name: "Hold identity",
    owner: "The part nothing else does",
    body: "One human being is a lead in the CRM, a roll number in the ERP, a candidate in the examination system, an APAAR ID at ABC and a profile in the placement platform — with no shared key. The agent carries the person across all of them. This is the architectural advantage; everything else is a feature.",
    items: ["Lead ↔ roll number ↔ APAAR", "Guardian relationships", "Consent state per person", "Lifecycle continuity"],
  },
  {
    id: "act",
    name: "Act",
    owner: "Connectors, governed",
    body: "Read and write into the systems that hold the truth — SAMARTH, Camu, MasterSoft, Meritto, Easebuzz, DigiLocker/ABC, NSP. Specialist agents per domain: admissions, examination, finance, hostel, placement. Actions are proposed by the agent and committed through the system of record.",
    items: ["SIS / ERP", "Admissions CRM", "Payment gateway", "DigiLocker · ABC · NSP", "Examination system"],
  },
  {
    id: "gate",
    name: "Gate",
    owner: "Human authority, kept",
    body: "Money, seats and grades never move on the agent's authority alone. A named human approves, with the evidence assembled in front of them. The agent removes the assembly work, not the accountability.",
    items: ["Fee waivers & refunds", "Seat confirmation", "Grade changes", "Grievance determination"],
  },
  {
    id: "prove",
    name: "Prove",
    owner: "Audit & evidence",
    body: "Consent state, template used, time sent, systems touched, human who approved, outcome. This is what an accreditation panel asks for and what today's institution reconstructs by hand from three silos.",
    items: ["Full interaction log", "Consent ledger", "NAAC Criterion 5 evidence", "India-region hosting", "Swappable model layer"],
  },
];

export const GOOGLE_NOTE = {
  body: "Gemini Enterprise is already landing on Indian campuses — Invertis in Bareilly was announced as India's fifth 'Google Agentic AI University'. But every Google India education announcement to date is teaching, tutoring or skilling: AI tutors, teacher training, exam preparation, centres of excellence. None of it is student administration.",
  point: "The front office is whitespace inside Google's own motion.",
  srcs: ["googleEdu", "invertis"],
};

// ─── Economics ──────────────────────────────────────────────────────────────

export const ECON_DEFAULTS = {
  enquiries: 500000,
  baseline: 1.06,
  reInquiry: 3.0,
  poolWorked: 10,
  tuition: 200000,
  minorShare: 45,
};

export const ECON_NOTES = [
  { text: "National conversion of 1.06% lead→enrolled, and re-inquired leads converting at 3.00% against 0.74% for first-time enquiries, come from a vendor-published index of 4.3 crore inquiries. There is no independent counterfactual.", kind: "vendor" as Kind, src: "meritto" },
  { text: "The share of the dormant pool that can lawfully be worked depends on how many enquirers are under 18 — for those, no behavioural scoring or nurture sequencing, and a verifiable parental-consent route instead.", kind: "inference" as Kind, src: "dpdpSchedule" },
  { text: "This is arithmetic on published sector rates applied to your own pool. It is a hypothesis for a pilot to test, not a projection to sign.", kind: "inference" as Kind },
];
