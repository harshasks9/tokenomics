import type { CustomerProfile } from "./types";

export const CITIZENSAI_PROFILE: CustomerProfile = {
  id: "citizensai",
  name: "CitizensAI",
  country: "Singapore",
  industry: "Public Sector",
  color: "#0D9488",
  gradient: "linear-gradient(135deg, #134E4A 0%, #0D9488 100%)",
  heroGradient: "linear-gradient(160deg, #021a18 0%, #052e2c 40%, #021a18 70%, #011a18 100%)",
  tagline: "5.9 million citizens. 4 languages. Tiered AI at the cost of a civil servant.",
  savingsHeadline: "54% build savings. 79% citizen support cost reduction.",
  description:
    "Singapore’s whole-of-government AI initiative spans 16 agencies, 4 official languages (English, Malay, Mandarin, Tamil), and every citizen touchpoint from CPF enquiries to business licence renewals. Tiered routing makes AI-powered services fiscally sustainable — Flash-Lite handles 65% of structured citizen queries; Opus handles complex eligibility assessments and policy interpretation where a wrong answer has legal consequences.",
  kpis: [
    { label: "Citizens Served", value: "5.9M" },
    { label: "Gov Agencies", value: "16" },
    { label: "Languages", value: "4" },
    { label: "Digital Service Usage", value: "87%" },
  ],
  build: {
    title: "Unified Gov.sg Digital Services Platform",
    description:
      "Building the next generation of Singpass-integrated citizen services — payment orchestration, cross-agency document verification, multilingual NLP routing, and the CitizenAssist conversational AI. 55% of development is boilerplate: CRUD, migrations, test suites, and API adapters for 16 agencies.",
    defaultDevs: 18,
    defaultSprints: 13,
    mix: { flashLitePct: 0.55, flashPct: 0.30, opusPct: 0.15 },
    tasks: [
      {
        title: "Generate unit tests for 60 government API endpoints",
        tier: "flashLite",
        why: "Repetitive test scaffolding across uniform REST endpoints — pure pattern replication.",
      },
      {
        title: "Write CRUD for citizen profile and contact management",
        tier: "flashLite",
        why: "Standard create/read/update/delete operations with predictable data shapes.",
      },
      {
        title: "Generate OpenAPI docs from agency service handlers",
        tier: "flashLite",
        why: "Schema extraction and documentation generation from existing code — no reasoning required.",
      },
      {
        title: "Write SQL migrations for CPF contribution history table",
        tier: "flashLite",
        why: "Structured migration scripts with well-defined column types and constraints.",
      },
      {
        title: "Add Zod validation to all MyInfo data entry forms",
        tier: "flashLite",
        why: "Repetitive validation rule application to known MyInfo attribute schemas.",
      },
      {
        title: "Write seed data for 16 agency service catalogue configurations",
        tier: "flashLite",
        why: "Data generation following a fixed template across 16 agency entries.",
      },
      {
        title: "Generate i18n string keys for 4 languages in CitizenAssist interface",
        tier: "flashLite",
        why: "Key extraction and file scaffolding — structured output with no semantic translation needed.",
      },
      {
        title: "Create Storybook stories for gov.sg design system components",
        tier: "flashLite",
        why: "Boilerplate story files following a consistent component pattern.",
      },
      {
        title: "Build Singpass MyInfo data adapter with attribute-level consent handling",
        tier: "flash",
        why: "Requires understanding of the MyInfo API spec and consent model — moderate complexity with clear documentation.",
      },
      {
        title: "Scaffold cross-agency eligibility dashboard for scheme advisors",
        tier: "flash",
        why: "Multi-source data aggregation with conditional display logic across scheme types.",
      },
      {
        title: "Write E2E tests for multi-step benefits application flow",
        tier: "flash",
        why: "Complex user journey with branching steps, state management, and cross-agency validation.",
      },
      {
        title: "Implement PDPA-compliant audit trail for all citizen data accesses",
        tier: "flash",
        why: "Requires understanding of PDPA obligations and correct instrumentation across data layers.",
      },
      {
        title: "Design cross-agency data sharing architecture with attribute-level authorisation under PDPA",
        tier: "opus",
        why: "Requires deep reasoning about data sovereignty, PDPA obligations, and inter-agency trust boundaries — architectural decisions with long-term legal implications.",
      },
      {
        title: "Implement complex eligibility computation engine for means-tested schemes (ComCare, GST Vouchers, CDC Vouchers)",
        tier: "opus",
        why: "Interlocking eligibility rules across multiple schemes with edge cases that have direct citizen welfare consequences.",
      },
      {
        title: "Plan multi-language NLP pipeline that preserves legal precision across English, Malay, Mandarin, and Tamil",
        tier: "opus",
        why: "Requires deep understanding of legal language nuance, code-switching patterns, and the consequences of precision loss in official communications.",
      },
    ],
  },
  run: {
    title: "CitizenAssist — Multilingual Citizen Support",
    description:
      "3 million monthly citizen queries across 4 languages. 65% are routine transactional queries — CPF balances, application statuses, appointment bookings. Flash-Lite handles these instantly. Complex eligibility queries and appeals with legal implications go to Opus — where imprecise guidance has consequences for citizens.",
    defaultQueriesPerMonth: 3_000_000,
    maxQueriesPerMonth: 10_000_000,
    queriesStepSize: 500_000,
    queriesLabel: "Queries / Month",
    querySize: { inTok: 2000, outTok: 400 },
    mix: { flashLitePct: 0.65, flashPct: 0.25, opusPct: 0.10 },
    qa: [
      {
        id: "q1",
        question: "What is my CPF Ordinary Account balance? / Berapa baki CPF Akaun Biasa saya?",
        category: "routine",
        answers: {
          flashLite:
            "Your CPF Ordinary Account balance is S$184,230. Special Account: S$62,410. MediSave: S$48,900. Total CPF: S$295,540.",
          flash:
            "CPF Ordinary Account: S$184,230. Special Account: S$62,410. MediSave: S$48,900. Total: S$295,540. Your OA accrues interest at 2.5% p.a. Next quarterly interest credit: 1 July 2026 (estimated S$1,152).",
          opus:
            "CPF Ordinary Account: S$184,230 | Special Account: S$62,410 | MediSave: S$48,900 | Total CPF: S$295,540. Your OA earns 2.5% p.a. (first S$20K earns an additional 1% floor rate). Next quarterly credit on 1 July 2026 is estimated at S$1,152 for OA. Note: at your current balance and age profile, your projected retirement adequacy under the Full Retirement Sum framework looks healthy — would you like a full projection?",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
      {
        id: "q2",
        question:
          "How do I apply for the SkillsFuture Credit top-up? Saya ingin tahu cara memohon kredit SkillsFuture.",
        category: "standard",
        answers: {
          flashLite:
            "You can claim your SkillsFuture Credit at Skillsfuture.gov.sg. Log in with Singpass, select an approved course, and submit your claim. Your current credit balance: S$1,500.",
          flash:
            "Your SkillsFuture Credit balance is S$1,500 (including the 2023 top-up). To claim: (1) Visit SkillsFuture.gov.sg, (2) Log in with Singpass, (3) Search for approved courses, (4) Select and submit — claims are processed in 3 business days. Note: SkillsFuture Credit can be used for courses from SSG-approved providers only. Your credit expires 31 December 2026.",
          opus:
            "Your S$1,500 credit (balance includes 2023 top-up, expires Dec 2026) can be used for 23,000+ SSG-approved courses. Given your employment sector (Healthcare, from Singpass data), you may be eligible for additional SkillsFuture Series subsidies under the Healthcare Workforce Skills Qualifications framework — these stack on top of your credit. The two highest-take-up courses in your sector this year are Healthcare Informatics (S$580 after subsidy) and Patient Safety Management (S$420 after subsidy). Would you like me to check your eligibility for the additional sector subsidies?",
        },
        scores: { flashLite: 4, flash: 5, opus: 5 },
      },
      {
        id: "q3",
        question:
          "我今年63岁，CPF余颖18万元，被诊断出患有晩期疾病。我可以提取多少，对我的组屋贷款有什么影响？(I am 63, CPF balance S$180K, diagnosed terminal illness. How much can I withdraw and how does it affect my HDB loan?)",
        category: "complex",
        answers: {
          flashLite:
            "I am sorry to hear about your diagnosis. For CPF withdrawal under terminal illness, please contact CPF Board at 1800-227-1188 or visit my.cpf.gov.sg for guidance from a CPF specialist.",
          flash:
            "For terminal illness withdrawal under Section 15(1)(b) of the CPF Act, you may apply to withdraw your full CPF balance — this waives the Retirement Sum requirements. Contact CPF Board with your medical certification from a Singapore-registered doctor. Regarding your HDB loan: if the OA funds are withdrawn, your monthly loan deductions will cease and you will need to service the remaining balance from cash or other means. I recommend speaking to both CPF Board and HDB concurrently given the time sensitivity.",
          opus:
            "I understand this is an extremely difficult time and I want to make sure you have the right information. Under Section 15(1)(b) of the CPF Act, terminal illness (certified by a Singapore-registered doctor with prognosis of less than 12 months) allows full withdrawal of your CPF balance — all three accounts, including the portion normally locked in the Retirement Sum. For your situation: (1) Your S$180K total CPF is fully withdrawable upon medical certification; (2) Your HDB monthly deductions (currently drawing from OA) will need to transition to cash once OA is withdrawn — I can calculate your remaining loan tenure and monthly cash commitment; (3) You may also be eligible for MediFund assistance for medical expenses if your savings are depleted; (4) Your CPF Life annuity (if you have elected one) has specific withdrawal rules under terminal illness that differ from the lump sum — I need to check your scheme. I am flagging your case to a senior CPF specialist who will contact you within 24 hours. Is there family I should copy on this correspondence with your consent?",
        },
        scores: { flashLite: 1, flash: 3, opus: 5 },
        sellerNote:
          "Terminal illness CPF withdrawal is the highest-stakes citizen query — legal precision, compassion, and proactive flagging of related entitlements. Flash gives correct information. Opus gives correct information with the human context, the cross-scheme implications, and the appropriate escalation. The difference matters enormously to the citizen.",
      },
      {
        id: "q4",
        question: "What permits do I need to start a hawker stall selling char kway teow?",
        category: "standard",
        answers: {
          flashLite:
            "To start a hawker stall, you need: (1) NEA Hawker Stall Licence, (2) Food Hygiene Certificate (Basic Food Hygiene Course), (3) Singpass-verified application via GoBusiness.gov.sg. Processing takes 4–6 weeks.",
          flash:
            "For a char kway teow hawker stall: (1) Apply for a Hawker Stall Licence from NEA via GoBusiness — the new stall application (Form 7B) requires a 3-year lease from the hawker centre operator; (2) Basic Food Hygiene Certificate (half-day course, S$6.50 at SFA); (3) If you employ foreign workers, you need a Work Permit quota check from MOM; (4) Stalls handling raw pork and lard (common in char kway teow) require separate Food Stall Licence endorsement for high-risk ingredients. Total processing: 6–8 weeks. GoBusiness.gov.sg has a guided flow for first-time hawker applicants.",
          opus:
            "Full permit path for char kway teow: (1) NEA Hawker Stall Licence via GoBusiness (note: NEA-managed hawker centres have a balloting waitlist that can be 2–3 years; consider privately-run coffee shops which have shorter queues); (2) Food Hygiene Certificate; (3) If your recipe uses sambal belacan, check MOM approval for the SFA category; (4) Char kway teow involves an open flame wok — your stall may need NEA approval for the gas installation (LP gas or piped gas configurations differ). One thing many first-time hawkers miss: the NEA Incubation Stall Programme offers 15-month reduced rents for new hawkers — you may qualify. Would you like me to check current availability and guide you through the GoBusiness application?",
        },
        scores: { flashLite: 3, flash: 5, opus: 5 },
      },
    ],
  },
  agent: {
    title: "Cross-Agency Policy Compliance Agent",
    description:
      "Runs 4 times daily to monitor new policy announcements, subsidiary legislation changes, and parliamentary questions across 16 agencies — flagging cross-agency impacts and updating the CitizenAssist knowledge base. 9 data-pull steps on Flash; policy interpretation and impact assessment on Opus.",
    defaultVolume: 16,
    maxVolume: 50,
    volumeStep: 1,
    volumeLabel: "Agencies Monitored",
    runsPerDay: 4,
    executorSteps: 9,
    steps: [
      {
        id: 0,
        label: "Score policy changes by citizen impact materiality",
        role: "planner",
        inTok: 6000,
        outTok: 2000,
      },
      {
        id: 1,
        label: "Pull MOM circular and employment act updates",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 2,
        label: "Fetch CPF Board scheme parameter changes",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 3,
        label: "Check HDB policy and BTO launch announcements",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 4,
        label: "Pull IRAS tax change gazette notifications",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 5,
        label: "Fetch MOH healthcare subsidy rate updates",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 6,
        label: "Check MAS financial regulation circulars",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 7,
        label: "Pull Parliamentary Questions and answers (24h)",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 8,
        label: "Check inter-agency data sharing protocol updates",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 9,
        label: "Draft cross-agency impact assessment for each change",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 10,
        label: "Approve knowledge base updates and flag citizen advisories",
        role: "reviewer",
        inTok: 9000,
        outTok: 2000,
      },
    ],
  },
};
