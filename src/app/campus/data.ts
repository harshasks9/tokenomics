// CAMPUS FRONT OFFICE — product content model.
//
// Evidence labels appear on every quantified claim in the UI:
//   fact      — public record, regulation, filings, official statistics
//   vendor    — vendor-published benchmark, no independent counterfactual
//   inference — reasoned from cited evidence, not a measured figure
// Board and dashboard figures are illustrative sample data and are labelled
// as such in the interface.

export type Kind = "fact" | "vendor" | "inference";

export const KIND_META: Record<Kind, { label: string; color: string; note: string }> = {
  fact: { label: "Fact", color: "#047857", note: "Public record, regulation, official statistics or filings" },
  vendor: { label: "Vendor benchmark", color: "#B45309", note: "Vendor-published. No independent counterfactual. Directional only." },
  inference: { label: "Inference", color: "#6D28D9", note: "Reasoned from cited evidence — not a measured figure" },
};

export type Source = { id: string; label: string; url: string };

export const SOURCES: Record<string, Source> = {
  meritto: { id: "meritto", label: "Meritto Enrollment Index 2026 (4.3 crore inquiries)", url: "https://m.thewire.in/article/ptiprnews/ai-led-discovery-converts-6x-better-than-digital-reveals-merittos-enrollment-index-2026" },
  merittoSeam: { id: "merittoSeam", label: "Meritto — where the CRM ends and the ERP begins", url: "https://www.meritto.com/blog/crm-vs-erp-in-education-industry/" },
  merittoVoice: { id: "merittoVoice", label: "Meritto launches Mio AI Voice, Dec 2025", url: "https://www.tribuneindia.com/news/business/meritto-introduces-integrated-mio-ai-voice-agents-for-education" },
  aishe: { id: "aishe", label: "AISHE 2023-24, Ministry of Education", url: "https://www.dohe-education.gov.in/static/uploads/2026/07/8616f33dfee644ab6b87a2bd0658b18d.pdf" },
  indeed: { id: "indeed", label: "Indeed India — admission counsellor salaries (815 reported)", url: "https://in.indeed.com/career/admission-counselor/salaries" },
  connect: { id: "connect", label: "Counsellor connect rates and CPL benchmarks", url: "https://bloomagency.in/education-lead-generation-top-13-channels-for-indian-higher-education/" },
  cuet: { id: "cuet", label: "CUET-UG 2026 — 185 universities", url: "https://news.careers360.com/cuet-ug-2026-exam-date-registration-begins-nta-hold-exams-from-may-11-31-admission-central-state-universities-cbt-link" },
  nirf: { id: "nirf", label: "NIRF ranking parameters and weights", url: "https://www.edhitch.com/nirf-ranking-criteria-assessment-importance.html" },
  naacBinary: { id: "naacBinary", label: "NAAC moves to binary accreditation + maturity levels, Feb 2025", url: "https://news.careers360.com/naac-revamps-accreditation-process-will-implement-maturity-based-grading-current-grades-until-april-may-2025/amp" },
  naacC5: { id: "naacC5", label: "NAAC Criterion 5 — Student Support & Progression (100 marks)", url: "https://www.sharda.ac.in/iqac/naac/criterion-5" },
  sss: { id: "sss", label: "NAAC metric 2.7.1 — Student Satisfaction Survey", url: "https://miet.edu/naac/2.7.1/2.7.1.pdf" },
  ugcGrievance: { id: "ugcGrievance", label: "UGC Redressal of Grievances of Students Regulations 2023", url: "https://www.teamleaseregtech.com/updates/article/22961/university-grants-commission-redressal-of-grievances-of-students-regul/" },
  telangana: { id: "telangana", label: "Telangana fee-reimbursement arrears — colleges shut, exams suspended", url: "https://news.careers360.com/fee-reimbursement-dues-2000-telangana-colleges-shut-indefinitely-from-today-exams-suspended" },
  punjab: { id: "punjab", label: "Punjab to pay 40% of SC post-matric scholarship arrears", url: "https://www.tribuneindia.com/news/schools/punjab-to-pay-40-arrears-of-pvt-institutions-under-sc-post-matric-scholarship-scheme-270422/amp" },
  nsp: { id: "nsp", label: "NSP verification gates and rejection causes", url: "https://www.buddy4study.com/article/nsp-scholarship-payment-status" },
  placementEligibility: { id: "placementEligibility", label: "Per-company placement eligibility criteria", url: "https://i2it.acm.org/placement-drive/" },
  placementComms: { id: "placementComms", label: "Placement cell communications — notice boards and hard copies", url: "https://www.uasbangalore.edu.in/en/university-placement-cell/" },
  cuPlacements: { id: "cuPlacements", label: "Chandigarh University placements, batch 2024-25", url: "https://www.cuchd.in/placements/" },
  superset: { id: "superset", label: "Superset — university recruiting platform", url: "https://joinsuperset.com/" },
  nirfStay: { id: "nirfStay", label: "NIRF 2025 publication stayed by Madras High Court", url: "https://www.edhitch.com/nirf-2026-submission-intelligence.html" },
  iimOptOut: { id: "iimOptOut", label: "How '100% placement' is constructed", url: "https://the-ken.com/story/for-some-iims-100-placement-is-not-the-same-as-finding-everyone-a-job/" },
  parents: { id: "parents", label: "College Vidya Career Guidance Gap Report, June 2026", url: "https://jkmonitor.org/index.php/national-international/parents-remain-the-biggest-influence-on-degree-choices-finds-college-vidya-career-guidance-gap-report" },
  ugcPtm: { id: "ugcPtm", label: "UGC guidelines — quarterly parent-teacher meetings", url: "https://www.ugc.gov.in/pdfnews/4006064_Safety-of-Students-Guidelines.pdf" },
  dpdpChild: { id: "dpdpChild", label: "DPDP s.9(3) — children's data, tracking prohibition", url: "https://cyberpeace.org/resources/blogs/prohibition-of-behavioral-tracking-and-targeted-advertising-for-children-under-the-dpdp-act-2023" },
  dpdpSchedule: { id: "dpdpSchedule", label: "DPDP Rules 2025, Fourth Schedule — educational institutions", url: "https://www.dpdpa.com/schedule/schedule4.html" },
  dpdpPhase: { id: "dpdpPhase", label: "DPDP phased rollout — obligations from 12 May 2027", url: "https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/" },
  trai: { id: "trai", label: "TRAI TCCCPR — DLT registration, DND, time windows", url: "https://www.sigmachambers.in/post/2025-tcccpr-amendments-a-renewed-push-by-trai-for-order-in-commercial-communications-1" },
  gemIndia: { id: "gemIndia", label: "Google Cloud hosts Gemini models in-country in India", url: "https://www.ibef.org/news/google-expands-ai-infrastructure-in-india-with-local-hosting-of-gemini-models" },
  edhitch: { id: "edhitch", label: "Regulator data silos — NAAC / NIRF / AISHE", url: "https://www.edhitch.com/one-nation-one-data-naac-nba-nirf.html" },
  samarth: { id: "samarth", label: "SAMARTH eGov — MoE university ERP", url: "https://samarth.edu.in/about/" },
  mastersoft: { id: "mastersoft", label: "MasterSoft — Application CRM and SIS modules", url: "https://www.mastersoft.ai/" },
  ggsipu: { id: "ggsipu", label: "GGSIPU admission chatbot, March 2025", url: "https://ipu.admissions.nic.in/document/starting-of-ai-based-application-software_ggsipu-admission-chatbot-for-2025-2026-dated-20-03-2025/" },
  aisensy: { id: "aisensy", label: "WhatsApp Business API providers — capability ceiling", url: "https://m.aisensy.com/blog/whatsapp-api-providers/" },
};

// ─── Hero proof ─────────────────────────────────────────────────────────────

export const HERO_STATS: { value: string; label: string; kind: Kind; src: string }[] = [
  { value: "7–10", label: "systems a university runs with no shared identity key", kind: "inference", src: "edhitch" },
  { value: "1 : 28", label: "non-teaching staff to students; 68% in clerical grades", kind: "fact", src: "aishe" },
  { value: "~70%", label: "of counsellor calling time reaches no eligible prospect", kind: "fact", src: "connect" },
];

// ─── Request board ──────────────────────────────────────────────────────────

export const STATES = ["New", "Identified", "Grounded", "Action taken", "Approval", "Closed"] as const;
export type StateName = (typeof STATES)[number];

export type Channel = "WhatsApp" | "Voice" | "Web" | "Email";

export const CHANNEL_META: Record<Channel, { color: string }> = {
  WhatsApp: { color: "#047857" },
  Voice: { color: "#2563EB" },
  Web: { color: "#6D28D9" },
  Email: { color: "#5A6270" },
};

export type BoardRow = {
  id: string;
  title: string;
  detail: string;          // what the system did — shown on the closed state
  channel: Channel;
  language: string;
  campus: string;
  systems: string[];
  category: string;
  slaMins: number;
  needsApproval: boolean;
  approver?: string;
  offset: number;          // 0..1 phase offset in the loop
  speed: number;           // cycle length multiplier
};

export const BOARD_ROWS: BoardRow[] = [
  {
    id: "REQ-48213", title: "Scholarship form rejected — Aadhaar/bank name mismatch",
    detail: "Defect identified before the portal deadline. Guardian contacted in Marathi, corrected passbook captured, claim refiled.",
    channel: "WhatsApp", language: "Marathi", campus: "Main", systems: ["NSP", "ERP", "Document store"],
    category: "Scholarships", slaMins: 240, needsApproval: true, approver: "Institute Nodal Officer",
    offset: 0.0, speed: 1.0,
  },
  {
    id: "REQ-48219", title: "Need no-dues certificate for transcript",
    detail: "Four clearances checked in parallel. ₹40 library fine surfaced and settled in-channel; certificate issued.",
    channel: "Web", language: "English", campus: "Main", systems: ["ERP", "Library", "Hostel", "Accounts"],
    category: "Certificates", slaMins: 2880, needsApproval: true, approver: "Registrar",
    offset: 0.17, speed: 1.15,
  },
  {
    id: "REQ-48226", title: "Am I eligible for the Deloitte drive?",
    detail: "Eligibility computed against CGPA, backlog history, branch and prior offers. Student registered before the Friday cut-off.",
    channel: "WhatsApp", language: "English", campus: "North", systems: ["ERP", "Placements", "Exam records"],
    category: "Placements", slaMins: 60, needsApproval: false,
    offset: 0.31, speed: 0.85,
  },
  {
    id: "REQ-48231", title: "What do I owe, and by when?",
    detail: "Fee position assembled from the ledger and sent to the registered guardian in Marathi, with the instalment schedule cited to the circular.",
    channel: "Voice", language: "Marathi", campus: "Main", systems: ["ERP", "Payment gateway"],
    category: "Fees", slaMins: 30, needsApproval: false,
    offset: 0.44, speed: 0.95,
  },
  {
    id: "REQ-48238", title: "Marksheet shows fail in a paper I passed",
    detail: "Grouped with 400 similar reports into three root causes: internal-marks upload, subject-code mapping, absentee-flag import.",
    channel: "Web", language: "Hindi", campus: "City", systems: ["Exam system", "ERP", "Department records"],
    category: "Examinations", slaMins: 1440, needsApproval: true, approver: "Controller of Examinations",
    offset: 0.58, speed: 1.05,
  },
  {
    id: "REQ-48244", title: "Hostel room change request",
    detail: "Occupancy checked, eligible rooms offered, allocation prepared. Warden approval pending.",
    channel: "WhatsApp", language: "Tamil", campus: "North", systems: ["Hostel", "ERP"],
    category: "Hostel", slaMins: 720, needsApproval: true, approver: "Warden",
    offset: 0.72, speed: 1.1,
  },
  {
    id: "REQ-48251", title: "Enquiry: B.Tech CSE fees and hostel availability",
    detail: "Answered in 90 seconds from the current prospectus and fee circular, with the clause cited. Counsellor callback booked.",
    channel: "Voice", language: "Hindi", campus: "Main", systems: ["Admissions CRM", "Prospectus"],
    category: "Admissions", slaMins: 15, needsApproval: false,
    offset: 0.86, speed: 0.8,
  },
  {
    id: "REQ-48257", title: "Application incomplete — 12th marksheet not uploaded",
    detail: "Missing document identified and chased with an upload link. Application completed the same day.",
    channel: "WhatsApp", language: "English", campus: "City", systems: ["Admissions CRM", "Document store"],
    category: "Admissions", slaMins: 120, needsApproval: false,
    offset: 0.93, speed: 0.9,
  },
];

// ─── Org-chart tabs ─────────────────────────────────────────────────────────

export type TabId = "admissions" | "services" | "finance" | "placements" | "management";

export type OrgTab = {
  id: TabId;
  label: string;
  owner: string;
  headline: string;
  outcome: string;
  metric: { value: string; label: string; kind: Kind; src: string };
  screen: { title: string; rows: { left: string; mid?: string; right: string; state?: "ok" | "warn" | "bad" }[] };
  notes: { text: string; kind: Kind; src?: string }[];
};

export const ORG_TABS: OrgTab[] = [
  {
    id: "admissions", label: "Admissions", owner: "Head of Admissions",
    headline: "Every enquiry answered the same day, in the language it arrived in.",
    outcome: "Counsellors stop dialling lists that go nowhere and take the conversations where a person changes the decision.",
    metric: { value: "3.00% vs 0.74%", label: "conversion for re-contacted enquiries against first-time enquiries", kind: "vendor", src: "meritto" },
    screen: {
      title: "Enquiry queue · today",
      rows: [
        { left: "Answered within 15 minutes", mid: "1,284 enquiries", right: "98.1%", state: "ok" },
        { left: "Applications completed after document chase", mid: "312 chased", right: "241", state: "ok" },
        { left: "Dormant enquiries re-contacted (March–June)", mid: "8,900 in pool", right: "1,106 today", state: "ok" },
        { left: "Routed to a counsellor as high-intent", mid: "verified interest", right: "163", state: "ok" },
        { left: "Held — applicant under 18, guardian consent pending", mid: "parental consent route", right: "47", state: "warn" },
      ],
    },
    notes: [
      { text: "CUET replaced institution-level cutoffs with one national score, so candidates apply to several universities in parallel across a five-month window. Response speed decides.", kind: "fact", src: "cuet" },
      { text: "Re-contacted enquiries are 14% of volume but drive 40% of enrolments.", kind: "vendor", src: "meritto" },
      { text: "Applicants under 18 are never scored or sequenced — they route to verifiable guardian consent.", kind: "fact", src: "dpdpChild" },
    ],
  },
  {
    id: "services", label: "Student Services", owner: "Registrar / Student Affairs",
    headline: "The request that used to sit between four desks now closes itself.",
    outcome: "Students stop carrying paper between offices, and nothing waits in a queue nobody is watching.",
    metric: { value: "100 marks", label: "NAAC Criterion 5, including 5.1.4 grievance redressal — evidenced case by case", kind: "fact", src: "naacC5" },
    screen: {
      title: "Open requests · student services",
      rows: [
        { left: "No-dues and certificate requests", mid: "avg 2 clearances outstanding", right: "184 open", state: "ok" },
        { left: "Examination corrections", mid: "grouped into 3 root causes", right: "412 students", state: "warn" },
        { left: "Grievances — statutory clock running", mid: "UGC 60-day duty", right: "23 open", state: "warn" },
        { left: "Grievances approaching day 45", mid: "escalated to committee", right: "4", state: "bad" },
        { left: "Bonafide / migration / transcript issued today", mid: "auto-assembled", right: "96", state: "ok" },
      ],
    },
    notes: [
      { text: "UGC requires student grievances to be resolved within a maximum of 60 days, with an Ombudsperson appointed.", kind: "fact", src: "ugcGrievance" },
      { text: "The Student Satisfaction Survey is answered by students directly, while other accreditation metrics pass through data validation.", kind: "fact", src: "sss" },
      { text: "Grievance outcomes are always determined by the committee, never by the platform. It runs the clock and assembles the file.", kind: "fact", src: "ugcGrievance" },
    ],
  },
  {
    id: "finance", label: "Finance", owner: "Head of Finance / CFO",
    headline: "Scholarship receivables reconciled claim by claim, before the deadline closes.",
    outcome: "The exposure that matters is state reimbursement, not student default — so that is what this works on.",
    metric: { value: "₹8,000 crore", label: "arrears sought by Telangana institutions; 2,000+ colleges shut and suspended exams", kind: "fact", src: "telangana" },
    screen: {
      title: "Scholarship & fee position",
      rows: [
        { left: "State reimbursement claims in flight", mid: "3 schemes", right: "6,412", state: "ok" },
        { left: "Claims with a correctable defect found", mid: "Aadhaar/bank mismatch, unclear upload", right: "738", state: "warn" },
        { left: "Defects corrected before the window closed", mid: "guardian contacted", right: "651", state: "ok" },
        { left: "Claims awaiting nodal officer verification", mid: "queued for approval", right: "289", state: "warn" },
        { left: "Instalment schedules confirmed with guardians", mid: "in their language", right: "2,140", state: "ok" },
      ],
    },
    notes: [
      { text: "Punjab agreed to pay 40% of ₹200 crore in SC post-matric scholarship arrears owed to private institutions.", kind: "fact", src: "punjab" },
      { text: "NSP claims pass two sequential human verification gates. Rejection causes include Aadhaar–bank name mismatch and unclear uploads — usually found after the deadline.", kind: "fact", src: "nsp" },
      { text: "Every payment, waiver or refund requires a named human approval. The platform prepares the file; it does not authorise money.", kind: "inference" },
    ],
  },
  {
    id: "placements", label: "Placements", owner: "Head of Placements",
    headline: "Every student told what they are eligible for, before registration closes.",
    outcome: "Eligibility stops being re-derived by hand for every drive, and no eligible student misses a deadline they never saw.",
    metric: { value: "40 marks", label: "placement weighting within NIRF Graduation Outcomes — one of the two levers that actually score", kind: "fact", src: "nirf" },
    screen: {
      title: "Drive readiness · this week",
      rows: [
        { left: "Drives closing in 7 days", mid: "4 recruiters", right: "4", state: "warn" },
        { left: "Students eligible across those drives", mid: "computed per drive", right: "3,908", state: "ok" },
        { left: "Eligible but not yet registered", mid: "contacted with deadline", right: "1,142", state: "warn" },
        { left: "Registered after being contacted", mid: "same day", right: "874", state: "ok" },
        { left: "Told why they are not eligible, and what would change it", mid: "backlog / CGPA / branch", right: "2,306", state: "ok" },
      ],
    },
    notes: [
      { text: "Eligibility is a per-drive intersection of CGPA, backlog history, branch, education gap and prior offers — announced in free-text notices.", kind: "fact", src: "placementEligibility" },
      { text: "Placement communication runs on notice boards and WhatsApp groups, with hard copies circulated to departments, libraries, canteens and hostels.", kind: "fact", src: "placementComms" },
      { text: "Superset and TPO Bridge are drive-centric systems of record. Neither explains eligibility to an individual student or nudges non-applicants.", kind: "inference", src: "superset" },
    ],
  },
  {
    id: "management", label: "Management", owner: "Vice Chancellor / Registrar",
    headline: "The questions an institution cannot answer today.",
    outcome: "How many people asked us something, how many got an answer, which campus is slowest, and who is stuck right now.",
    metric: { value: "210 / 166 / 195", label: "faculty counts one institution reported to NAAC, NIRF and AISHE in the same year", kind: "fact", src: "edhitch" },
    screen: { title: "", rows: [] },
    notes: [
      { text: "Three officers file three portals from three silos, and nobody compares the answers.", kind: "fact", src: "edhitch" },
      { text: "Dashboard figures shown here are illustrative sample data for a three-campus institution, not a customer deployment.", kind: "inference" },
    ],
  },
];

// ─── Management dashboard (illustrative sample data) ─────────────────────────

export const DASH = {
  received: [820, 910, 1180, 1040, 1320, 1290, 1410],
  resolved: [710, 845, 1090, 1002, 1240, 1235, 1361],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  campuses: [
    { name: "Main campus", minutes: 4, volume: 8420, trend: "steady" },
    { name: "North campus", minutes: 11, volume: 3110, trend: "improving" },
    { name: "City campus", minutes: 26, volume: 1980, trend: "slipping" },
  ],
  categories: [
    { name: "Fees & scholarships", open: 412, share: 31 },
    { name: "Examinations", open: 388, share: 29 },
    { name: "Certificates & no-dues", open: 224, share: 17 },
    { name: "Placements", open: 168, share: 13 },
    { name: "Hostel & campus", open: 132, share: 10 },
  ],
  languages: [
    { name: "Hindi", share: 34, color: "#2563EB" },
    { name: "English", share: 28, color: "#6D28D9" },
    { name: "Marathi", share: 21, color: "#047857" },
    { name: "Tamil", share: 11, color: "#B45309" },
    { name: "Other", share: 6, color: "#94A3B8" },
  ],
  breaches: [
    { ref: "GRV-2211", what: "Grievance — fee refund dispute", days: 51, limit: 60 },
    { ref: "GRV-2247", what: "Grievance — hostel allocation", days: 48, limit: 60 },
    { ref: "GRV-2263", what: "Grievance — examination revaluation", days: 44, limit: 60 },
    { ref: "GRV-2288", what: "Grievance — scholarship disbursal", days: 41, limit: 60 },
  ],
  sentiment: [62, 64, 61, 68, 71, 70, 74],
};

// ─── Before / after workflow ────────────────────────────────────────────────

export const FLOW = {
  request: "Final-year student requests a transcript",
  before: {
    label: "Today",
    steps: ["Examination office counter", "Department signature", "Hostel warden", "Mess clearance", "Library — blocked on ₹40 fine", "Accounts counter", "Re-collect expired signatures", "Certificate issued"],
    stepCount: 8,
    elapsed: "26–34 days",
    desks: "5 physical desks · student carries the file",
  },
  after: {
    label: "Campus Front Office",
    steps: ["Request received on WhatsApp", "All four clearances checked at once", "₹40 fine surfaced and paid in-channel", "Registrar approves issue", "Certificate issued, status visible throughout"],
    stepCount: 5,
    elapsed: "2 days",
    desks: "1 approval · no counter visit",
  },
};

// ─── Integrations ───────────────────────────────────────────────────────────

export const INTEGRATIONS = [
  { group: "Student information & ERP", items: ["SAMARTH", "Camu", "MasterSoft", "Serosoft Academia"] },
  { group: "Admissions CRM", items: ["Meritto", "LeadSquared", "ExtraaEdge"] },
  { group: "Payments & fees", items: ["Easebuzz", "Razorpay", "PayU"] },
  { group: "National systems", items: ["DigiLocker / NAD", "ABC / APAAR", "National Scholarship Portal"] },
  { group: "Channels", items: ["WhatsApp Business", "Telephony / IVR", "DLT-registered SMS", "Email", "Web"] },
  { group: "Placements & alumni", items: ["Superset", "TPO Bridge", "Almabase", "Vaave"] },
];

// ─── Comparison ─────────────────────────────────────────────────────────────

export const COMPARISON = {
  intro: "Most of what a university already owns works well inside its own boundary. The gap is what happens when a request crosses one.",
  rows: [
    { capability: "Answer an admissions enquiry", within: true, across: true, note: "Admissions CRMs do this well. Meritto shipped a genuine autonomous multilingual voice agent in December 2025.", src: "merittoVoice" },
    { capability: "Update the record it owns", within: true, across: true, note: "A CRM agent updates CRM stages and schedules follow-ups — inside the CRM.", src: "merittoVoice" },
    { capability: "Predict which students may drop out", within: true, across: true, note: "ERP vendors ship predictive analytics of this kind.", src: "mastersoft" },
    { capability: "Reach students on WhatsApp at low cost", within: true, across: true, note: "Business API providers deliver real reach from around ₹1,500/month.", src: "aisensy" },
    { capability: "Answer a student who is already enrolled", within: false, across: true, note: "The admissions CRM hands off at enrolment — its own documentation says the ERP takes over when the CRM's role ends.", src: "merittoSeam" },
    { capability: "Resolve a request that spans admissions, fees and examinations", within: false, across: true, note: "No vendor in this category publishes cross-system task completion.", src: "merittoSeam" },
    { capability: "Act in a system it does not own", within: false, across: true, note: "Every verifiable Indian deployment to date answers questions rather than completing tasks.", src: "ggsipu" },
    { capability: "Show management one view across every channel and campus", within: false, across: true, note: "Each system reports its own slice; nobody joins them.", src: "edhitch" },
  ],
};

// ─── Trust ──────────────────────────────────────────────────────────────────

export const TRUST = [
  {
    title: "Applicants under 18",
    body: "Most undergraduate applicants in India are 17 when they apply. The platform does not score, profile or sequence them. It verifies age at first contact and routes to verifiable guardian consent.",
    detail: "DPDP s.9(3) prohibits tracking, behavioural monitoring and targeted advertising directed at children regardless of consent given. The educational-institution exemption applies to children enrolled with the institution — not to applicants.",
    kind: "fact" as Kind, src: "dpdpSchedule", extra: "dpdpPhase",
  },
  {
    title: "Outbound messaging",
    body: "The platform selects a DLT-registered template and fills approved variables. It never composes outbound copy freely.",
    detail: "TRAI requires three-layer DLT registration — entity, header and content template. Promotional traffic is DND-scrubbed and restricted to 9 AM–9 PM.",
    kind: "fact" as Kind, src: "trai",
  },
  {
    title: "Money, seats and grades",
    body: "Every action with financial or academic consequence stops at a named human approver, with the evidence already assembled.",
    detail: "Fee waivers, refunds, seat confirmations and grade changes are prepared, never authorised, by the platform.",
    kind: "inference" as Kind,
  },
  {
    title: "Grievance determination",
    body: "Grievances are acknowledged, classified, routed and tracked against the statutory clock. The outcome is always decided by the committee.",
    detail: "UGC's 2023 regulations reserve determination for the Student Grievance Redressal Committee and Ombudsperson, within a maximum of 60 days.",
    kind: "fact" as Kind, src: "ugcGrievance",
  },
  {
    title: "Placement reporting",
    body: "Placement data is reported as recorded. The platform will not construct a placement claim.",
    detail: "NIRF 2025 publication was stayed by the Madras High Court following allegations of inflated submissions, and '100% placement' has been documented as constructed via student opt-out forms.",
    kind: "fact" as Kind, src: "nirfStay", extra: "iimOptOut",
  },
  {
    title: "Where the data sits",
    body: "Institutional data stays in the university's own cloud environment, in India, with a full audit trail of every interaction and action.",
    detail: "Google Cloud hosts Gemini models and Gemini Enterprise in-country in India.",
    kind: "fact" as Kind, src: "gemIndia",
  },
];

// ─── ROI ────────────────────────────────────────────────────────────────────

export const ROI_DEFAULTS = {
  enquiries: 400000,
  baseline: 1.06,
  reInquiry: 3.0,
  poolWorked: 12,
  tuition: 180000,
  counsellors: 90,
  salary: 21463,
  deflected: 45,
  callingTime: 30,
  students: 30000,
  requestsPerStudent: 6,
  costPerRequest: 45,
};

export const ROI_NOTES = [
  { text: "Conversion of 1.06% and re-contacted conversion of 3.00% come from a vendor-published index of 4.3 crore inquiries. There is no independent counterfactual.", kind: "vendor" as Kind, src: "meritto" },
  { text: "Admission counsellor pay of ₹21,463/month is the reported average across 815 salaries on a job-listing aggregator.", kind: "fact" as Kind, src: "indeed" },
  { text: "No Indian university has published a measured reduction in admissions cost or headcount from technology of this kind. Treat every figure here as a hypothesis for a pilot to test.", kind: "inference" as Kind },
];

// ─── Deployment ─────────────────────────────────────────────────────────────

export const DEPLOY = [
  {
    phase: "Weeks 1–2", title: "Choose one workflow and baseline it",
    body: "One workflow with a deadline attached — scholarship defect correction, document completion, or placement eligibility. Current volumes, response times and outcomes recorded before anything is built.",
    needs: ["Named workflow owner", "Read access to the relevant system", "Current-state metrics"],
  },
  {
    phase: "Weeks 3–6", title: "Connect and configure",
    body: "Read access first, then scoped write access. Institutional knowledge loaded from circulars and the prospectus. Approved message templates registered. Approval chains defined.",
    needs: ["API or database access", "DLT template registration", "Named approvers per action"],
  },
  {
    phase: "Weeks 7–10", title: "Run against live traffic with a holdout",
    body: "A share of real requests handled by the platform, the rest handled as today. Both measured on the same terms. Human fallback available throughout.",
    needs: ["Agreed success thresholds", "Holdout group", "Weekly review"],
  },
  {
    phase: "Weeks 11–12", title: "Decide on evidence",
    body: "Results against the baseline, cost per resolved request, and a documented decision on whether to extend. If the thresholds are not met, the pilot ends there.",
    needs: ["Go / no-go with the sponsor", "Production readiness review"],
  },
];

// ─── CIO section ────────────────────────────────────────────────────────────

export const CIO = {
  layers: [
    { name: "Institutional knowledge", body: "Fee circulars, examination ordinances, hostel rules, the prospectus and UGC notifications are indexed as the source of truth. Every answer cites the clause it came from; where the circular is silent, the request routes to a person." },
    { name: "One identity across systems", body: "A person is a lead in the CRM, a roll number in the ERP, a candidate in the examination system and an APAAR ID at ABC — with no shared key. The platform resolves them to one person and carries that context across channels and across the enrolment boundary." },
    { name: "Specialist agents per domain", body: "Admissions, examinations, finance, hostel and placements each run as a bounded specialist with its own permissions and its own approved actions, coordinated per request." },
    { name: "Governed actions through connectors", body: "Read and write through the institution's existing APIs into SIS/ERP, CRM, payment gateway, examination system, DigiLocker/ABC and NSP. Actions are prepared by the platform and committed through the system of record." },
    { name: "Approval, audit and evaluation", body: "Named human approval on money, seats and grades. Every prompt, retrieval, action and approval logged. Continuous evaluation against golden sets gates any change to institutional answers." },
  ],
  note: "Built on the Gemini Enterprise Agent Platform, running in the institution's own Google Cloud environment. Google's India education announcements to date have concerned teaching, tutoring and skilling — student administration is open ground.",
  noteSrc: "gemIndia",
};
