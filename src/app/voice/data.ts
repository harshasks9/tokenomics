// Gemini Enterprise Communications — shared content model
// Category recommendation: "Agentic Communications Layer" — the intelligence and
// orchestration layer underpinning inbound + outbound enterprise communications.

export const PALETTE = {
  blue: "#1A73E8",
  blueDeep: "#174EA6",
  purple: "#7C3AED",
  green: "#188038",
  amber: "#D97706",
  red: "#DC2626",
  teal: "#00838F",
  ink: "#202124",
  muted: "#5F6368",
  border: "#E8EAED",
  surfaceAlt: "#F8F9FA",
};

// ─── Solution Packs (Level 3: Industry agent packs) ─────────────────────────

export type SolutionPack = {
  id: string;
  name: string;
  tagline: string;
  buyer: string;
  problem: string;
  trigger: string;
  journey: string[];
  systems: string[];
  handoff: string;
  metrics: string[];
  timeline: string;
  commercial: string;
  expansion: string;
};

export const SOLUTION_PACKS: SolutionPack[] = [
  {
    id: "collections",
    name: "Collections Agent",
    tagline: "Recover more, earlier, with consistent and compliant outreach",
    buyer: "Collections / Risk leader (BFSI, Telecom, Education fees)",
    problem:
      "Human dialer teams reach a fraction of delinquent accounts, scripts drift, compliance exposure grows with every uncontrolled conversation, and early-bucket accounts age into expensive late-stage recovery.",
    trigger: "Account enters DPD bucket (e.g., 1–30 days past due) or a promise-to-pay is broken.",
    journey: [
      "Outbound voice or WhatsApp contact within policy windows",
      "Identity verified against masked account data",
      "Agent explains dues, negotiates within pre-approved discount / plan matrix",
      "Payment link issued in-channel; promise-to-pay recorded in core system",
      "Broken promises re-queued; hardship signals escalate to a human specialist",
    ],
    systems: ["Core banking / billing", "Collections platform (CRM)", "Payment gateway", "Telephony / WhatsApp BSP"],
    handoff: "Disputes, hardship or vulnerability cues, and legal-stage accounts route to human collectors with full context.",
    metrics: ["Contact rate", "Kept-promise rate", "Roll-rate reduction (B1→B2)", "Cost per rupee/dollar collected", "Complaint rate"],
    timeline: "8–12 weeks to production pilot on one bucket and one language pair",
    commercial: "Platform consumption + per-completed-interaction implementation fee; expand by bucket and language",
    expansion: "Early-bucket → pre-due reminders → hardship workflows → collections analytics across the book",
  },
  {
    id: "inbound-service",
    name: "Inbound Service Agent",
    tagline: "Resolve the routine 60–80% so humans handle what humans should",
    buyer: "Customer Service / Contact Centre leader",
    problem:
      "Static IVR trees frustrate customers, 40–60% of calls are status or account queries that need enterprise data rather than empathy, and every deflection failure lands on an expensive human queue.",
    trigger: "Customer calls, messages, or emails on any serviced line or number.",
    journey: [
      "Caller identified and authenticated (OTP, registered number, voice channel policy)",
      "Intent understood in the caller's language, including code-switching",
      "Context retrieved: orders, tickets, bills, entitlements",
      "Agent acts: reschedules, updates, refunds within policy, files tickets",
      "Warm handoff to a human with a full transcript and suggested next steps when needed",
    ],
    systems: ["CRM / ticketing", "Order or policy systems", "Knowledge base", "Existing CCaaS or SIP trunk"],
    handoff: "Sentiment, complexity, or policy triggers route to human agents inside the existing contact-centre stack.",
    metrics: ["Containment rate", "First-contact resolution", "CSAT", "Average handle time on escalations", "Cost per interaction"],
    timeline: "6–10 weeks for a top-5-intents production pilot",
    commercial: "Consumption-led; price per resolved interaction as maturity grows",
    expansion: "Top-5 intents → long tail → proactive service (notify before the customer calls)",
  },
  {
    id: "outbound-lead",
    name: "Outbound Lead Agent",
    tagline: "Qualify every lead in minutes, not days",
    buyer: "Sales / Growth / Admissions leader",
    problem:
      "Leads decay in hours: most enterprises respond in days. Human tele-calling teams are expensive to scale, inconsistent in qualification, and blind after the call ends.",
    trigger: "New lead from web form, campaign, marketplace, or walk-in registration.",
    journey: [
      "Contact within minutes on voice or WhatsApp, in the lead's language",
      "Qualification against BANT-style rubric defined by the business",
      "Enriched, scored lead written to CRM with a structured summary",
      "Qualified leads booked directly into a human seller's calendar",
      "Nurture cadence for not-yet-ready leads, with suppression rules",
    ],
    systems: ["CRM", "Marketing automation", "Calendar", "Telephony / messaging"],
    handoff: "Hot leads transfer live or book meetings; complex product questions route to specialists.",
    metrics: ["Speed to first contact", "Qualification rate", "Show-up rate", "Cost per qualified lead", "Conversion uplift"],
    timeline: "6–8 weeks on a single campaign source",
    commercial: "Per-qualified-lead framing on top of platform consumption",
    expansion: "One campaign → all inbound leads → dormant-base reactivation → cross-sell motions",
  },
  {
    id: "support-agent",
    name: "Employee & Student Support Agent",
    tagline: "One front door for HR, IT, finance, and campus questions",
    buyer: "CHRO, CIO, GCC site leader, University registrar / dean of students",
    problem:
      "Employees and students bounce between portals, shared inboxes, and ticket queues for answers that exist in policy documents and enterprise systems. Shared-services teams drown in repetitive tickets.",
    trigger: "Any employee or student question via chat, voice, email, or portal.",
    journey: [
      "Identity resolved via SSO / directory; entitlements applied",
      "Question answered from governed knowledge with citations",
      "Transactions executed: leave requests, password resets, fee queries, letters",
      "Ticket auto-filed with full context when fulfilment needs a human team",
      "Recurring gaps in knowledge surfaced to content owners",
    ],
    systems: ["HRMS", "ITSM", "Student information system", "Finance / ERP", "Identity provider"],
    handoff: "Sensitive HR matters, grievances, and judgment calls route to named human owners.",
    metrics: ["Self-service resolution rate", "Ticket deflection", "Time to resolution", "Employee / student satisfaction", "Cost per ticket"],
    timeline: "6–10 weeks for two functions (e.g., HR + IT) in one geography",
    commercial: "Per-seat platform economics; strong Gemini Enterprise seat-activation motion",
    expansion: "Two functions → all shared services → proactive notifications → agentic workflows (onboarding, offboarding)",
  },
  {
    id: "agent-assist",
    name: "Agent Assist & Conversation Intelligence",
    tagline: "Make every human agent your best agent — and learn from every interaction",
    buyer: "Contact Centre / Quality / Operations leader",
    problem:
      "Human agents toggle across a dozen screens, quality teams sample 1–2% of calls, and insight from millions of conversations never reaches product, risk, or marketing teams.",
    trigger: "Live human-assisted interaction, or batch analysis of recorded interactions.",
    journey: [
      "Real-time transcription and intent detection during live calls",
      "Suggested answers, next-best-action, and policy prompts to the agent desktop",
      "Auto-generated wrap-up summaries and disposition codes",
      "100% interaction scoring against quality and compliance rubrics",
      "Trend and root-cause insight routed to owning teams",
    ],
    systems: ["Existing CCaaS / recorder", "Agent desktop", "Quality management", "BI / warehouse"],
    handoff: "Human agent stays in control throughout; the AI advises and documents.",
    metrics: ["Average handle time", "After-call work time", "Quality score coverage (1–2% → 100%)", "Compliance flag rate", "Coaching cycle time"],
    timeline: "4–8 weeks; lowest-risk entry point because no customer-facing automation",
    commercial: "Per-monitored-seat or per-analyzed-interaction consumption",
    expansion: "Assist → analytics → automating the intents the data proves are automatable",
  },
];

// ─── Verticals ──────────────────────────────────────────────────────────────

export type UseCase = {
  name: string;
  value: 1 | 2 | 3;        // business value
  feasibility: 1 | 2 | 3;  // technical feasibility today
  speed: 1 | 2 | 3;        // time to production (3 = fastest)
  tag?: "lighthouse" | "fastest" | "consumption" | "executive" | "partner";
  note: string;
};

export type Persona = {
  role: string;
  concern: string;
  outcome: string;
  objection: string;
  proof: string;
  opener: string;
};

export type Vertical = {
  slug: string;
  name: string;
  short: string;
  color: string;
  heroHeadline: string;
  heroSub: string;
  thesis: string[];
  whyNow: string[];
  stats: { value: string; label: string; source: string }[];
  useCases: UseCase[];
  journey: {
    title: string;
    before: string[];
    after: string[];
  };
  personas: Persona[];
  compliance: string[];
  pilot: { scope: string; weeks: string; integrations: string[]; success: string[] };
  expansion: string[];
  faqs: { q: string; a: string }[];
  roi: {
    monthlyInteractions: number;
    avgMinutes: number;
    humanCostPerMin: number; // USD
    aiCostPerMin: number;    // USD, blended platform + telephony estimate
    containment: number;     // % handled end-to-end by agent
    revenuePerResolved?: number;
  };
  speakerNotes: string[];
  discoveryQuestions: string[];
};

export const VERTICALS: Vertical[] = [
  {
    slug: "financial-services",
    name: "Financial Services",
    short: "BFSI",
    color: "#1A73E8",
    heroHeadline: "Every customer conversation, inside your risk perimeter",
    heroSub:
      "Collections, servicing, onboarding, and verification handled by governed agents that reason over your policies and act in your core systems — with every interaction logged, auditable, and escalatable to a human.",
    thesis: [
      "Communications in banking and insurance are not a service function — they are how credit is recovered, fraud is stopped, and trust is kept. Yet most of it runs on dialer teams, static IVRs, and outsourced scripts.",
      "Regulators now expect consistent treatment, complete records, and clear human accountability. Uncontrolled human conversations at scale are a compliance liability; governed agentic conversations are a compliance asset.",
      "The economics have crossed over: an AI-led service or collections interaction costs a small fraction of a human-assisted one, and the gap widens with every language and every hour of coverage added.",
    ],
    whyNow: [
      "Early-bucket collections volumes are rising with unsecured retail credit growth, while collector attrition stays high",
      "Data-residency and outsourcing rules push banks toward in-tenant AI rather than third-party SaaS bots",
      "Voice AI quality in Indic and regional languages has reached parity for structured conversations",
      "Every uncontacted early-bucket account rolls into recovery stages that cost 5–10× more to work",
    ],
    stats: [
      { value: "$13.50 vs $1.84", label: "median cost of an assisted service contact vs self-service", source: "Gartner customer service cost benchmarks, 2024" },
      { value: "20–25%", label: "reduction in non-performing loans achieved by digital-first collections leaders", source: "McKinsey, digital-first collections research" },
      { value: "100%", label: "of agentic interactions logged, scored, and auditable — vs 1–2% call sampling today", source: "platform capability" },
    ],
    useCases: [
      { name: "Early-bucket collections & payment reminders", value: 3, feasibility: 3, speed: 3, tag: "lighthouse", note: "Measurable in weeks: kept-promise rate and roll rates" },
      { name: "Loan & credit-card servicing (balance, statements, disputes intake)", value: 3, feasibility: 3, speed: 2, tag: "consumption", note: "Highest volume; needs core banking read APIs" },
      { name: "Lead qualification for loans, cards, insurance", value: 3, feasibility: 3, speed: 3, tag: "fastest", note: "Contained scope; CRM-only integration" },
      { name: "Customer onboarding & KYC follow-up", value: 2, feasibility: 2, speed: 2, note: "Document chase-up is agent-friendly; verification stays human/system-owned" },
      { name: "Fraud-related customer verification callbacks", value: 3, feasibility: 2, speed: 2, tag: "executive", note: "High trust value; strict scripting and escalation required" },
      { name: "Claims first-notice-of-loss and status", value: 2, feasibility: 3, speed: 2, note: "Insurance entry point; structured FNOL intake" },
      { name: "Policy servicing & renewals outreach", value: 2, feasibility: 3, speed: 2, note: "Renewal persistence lift is directly measurable" },
      { name: "Relationship-manager assist", value: 2, feasibility: 2, speed: 2, tag: "partner", note: "Wealth desks: meeting prep, product Q&A with advice boundaries" },
      { name: "Branch / ATM service coordination", value: 1, feasibility: 3, speed: 3, note: "Appointment booking and issue triage" },
      { name: "Vulnerable-customer hardship workflows", value: 2, feasibility: 1, speed: 1, note: "Design for detection and escalation, not automation" },
    ],
    journey: {
      title: "Early-bucket collections, before and after",
      before: [
        "Dialer bursts during business hours; 60–70% of calls unanswered",
        "Contacted customers get a script; discounts depend on which collector answers",
        "Promise-to-pay noted in a spreadsheet or thin CRM field, rarely followed up on time",
        "Compliance reviews 1–2% of recordings after complaints arrive",
        "Accounts roll to late buckets and outsourced agencies at 5–10× cost",
      ],
      after: [
        "Agent attempts contact across voice and WhatsApp within permitted windows, in the customer's language",
        "Identity verified; dues explained from live core-banking data; offers drawn only from the approved matrix",
        "Payment link sent in-channel; promise-to-pay written to the collections system with automatic follow-up",
        "Hardship or dispute cues escalate to a human specialist with full context; every word logged and scored",
        "Roll-rate, kept-promise, and complaint dashboards update daily; scripts improve from evaluated outcomes",
      ],
    },
    personas: [
      { role: "CEO", concern: "Credit cost and reputation risk", outcome: "Lower roll rates without headlines about harassment", objection: "Will an AI damage customer relationships?", proof: "Pilot complaint-rate and CSAT vs human baseline", opener: "Your early-bucket book is growing faster than your collector bench. What if every account was contacted on day one, compliantly?" },
      { role: "CIO / CTO", concern: "Data residency, core integration risk", outcome: "AI inside the bank's cloud tenant with governed APIs", proof: "Reference architecture + security blueprint review", objection: "We can't send customer data to a third-party bot vendor", opener: "This runs on your Google Cloud tenant — models, state, and logs stay inside your perimeter." },
      { role: "Collections leader", concern: "Contact rates and kept promises", outcome: "2–3× contact attempts, consistent negotiation", objection: "Customers will just hang up on a bot", proof: "A/B pilot on one bucket with answered-call and PTP metrics", opener: "How many of your B1 accounts got zero successful contacts last month?" },
      { role: "Risk & Compliance", concern: "Fair treatment, auditability, advice boundaries", outcome: "100% logged, policy-bounded conversations", objection: "Who is accountable when the AI says something wrong?", proof: "Guardrail demo: offer matrix, blocked topics, escalation triggers, full transcripts", opener: "Today you audit 2% of collector calls. This gives you 100%, scored against your own policy." },
      { role: "Procurement", concern: "Lock-in and unit cost", outcome: "Consumption pricing tied to completed interactions", objection: "Another platform subscription?", proof: "Unit-economics model with pilot-verified costs", opener: "You pay for resolved interactions on infrastructure you already contract for." },
    ],
    compliance: [
      "Consent and calling-window rules enforced in orchestration, not left to scripts",
      "Full call recording and transcript retention in-region (data residency)",
      "Customer authentication before any account data is disclosed",
      "Hard boundaries: no financial advice, no offers outside the approved matrix",
      "Vulnerability and hardship detection routes to trained humans",
      "Complete audit trail: every prompt, retrieval, action, and escalation logged",
    ],
    pilot: {
      scope: "One collections bucket (e.g., 1–30 DPD), one product, two languages, voice + WhatsApp",
      weeks: "8–12",
      integrations: ["Collections CRM (read/write PTP)", "Payment gateway (link generation)", "Telephony/BSP via partner"],
      success: ["Contact rate vs dialer baseline", "Kept-promise rate", "Roll-rate delta on pilot cohort", "Complaint rate ≤ human baseline", "Cost per completed contact"],
    },
    expansion: ["Pre-due reminders", "All buckets and products", "Inbound servicing", "Fraud verification callbacks", "Collections intelligence across the book"],
    faqs: [
      { q: "Does customer data leave our cloud environment?", a: "No. The platform, models, conversation state, and logs run within your Google Cloud tenant under your IAM, VPC-SC, and residency controls." },
      { q: "What stops the agent from making an unapproved offer?", a: "Offers are drawn from a policy matrix your risk team owns — the agent selects from it, it cannot invent terms. Out-of-matrix requests escalate to humans." },
      { q: "How does this coexist with our contact-centre platform?", a: "It complements it. Human escalations land in your existing stack with full context. Contact-centre modernization itself is a Google Customer Engagement Suite conversation." },
    ],
    roi: { monthlyInteractions: 500000, avgMinutes: 4, humanCostPerMin: 0.5, aiCostPerMin: 0.08, containment: 60, revenuePerResolved: 2.5 },
    speakerNotes: [
      "Open on credit cost, not technology: roll rates and collector capacity are board-level topics.",
      "Position governance as the differentiator — 100% auditable vs 2% sampled.",
      "Do not promise recovery-rate numbers; anchor on the pilot measuring their own baseline.",
    ],
    discoveryQuestions: [
      "What share of early-bucket accounts get zero successful contacts in month one?",
      "What does a completed collector conversation cost you today, fully loaded?",
      "Which languages does your customer base speak vs your collector bench?",
      "Where must conversation data physically reside, and who audits it?",
    ],
  },
  {
    slug: "retail",
    name: "Retail & eCommerce",
    short: "Retail",
    color: "#188038",
    heroHeadline: "From 'where is my order?' to 'here's what you'll love next'",
    heroSub:
      "Agents that resolve order status, returns, and delivery coordination end-to-end — connected to inventory, logistics, payments, and loyalty — and that turn service moments into revenue moments.",
    thesis: [
      "Retail communications are dominated by a few high-volume, data-backed intents — order status, returns, delivery changes — that customers want answered instantly, in their language, at 10pm during a sale.",
      "Every service contact is also a revenue moment: a recovered cart, a loyalty nudge, a cross-sell. Fragmented bots and outsourced queues capture none of it.",
      "Peak-season economics break human-only models: hiring and training seasonal agents for a six-week spike is the most expensive way to answer 'where is my order?'.",
    ],
    whyNow: [
      "WISMO (where-is-my-order) and returns queries routinely exceed half of all support contacts",
      "Conversational commerce on WhatsApp and RCS is mainstream in India and emerging markets",
      "Marketplace seller ecosystems need scalable support that human teams can't economically provide",
      "Festival / holiday peaks force a choice between poor service and bloated seasonal cost",
    ],
    stats: [
      { value: "50%+", label: "of support contacts are order-status and returns queries in most e-commerce operations", source: "operator benchmarks; validate per customer" },
      { value: "~70%", label: "of shopping carts are abandoned — recoverable with timely, contextual outreach", source: "Baymard Institute meta-analysis" },
      { value: "24/7", label: "coverage in every language, at flat marginal cost during peaks", source: "platform capability" },
    ],
    useCases: [
      { name: "Order status & delivery coordination (WISMO)", value: 3, feasibility: 3, speed: 3, tag: "lighthouse", note: "Highest volume, clean OMS/logistics APIs, instant CSAT impact" },
      { name: "Returns & exchanges end-to-end", value: 3, feasibility: 3, speed: 2, tag: "consumption", note: "Policy-bounded actions: label generation, refund initiation" },
      { name: "Abandoned-cart & drop-off recovery", value: 3, feasibility: 3, speed: 3, tag: "fastest", note: "Direct revenue attribution; consent-governed outreach" },
      { name: "Product discovery & guided selling", value: 3, feasibility: 2, speed: 2, tag: "executive", note: "Catalog grounding; measurable conversion lift" },
      { name: "Delivery-failure resolution & address fixes", value: 2, feasibility: 3, speed: 3, note: "RTO reduction is pure margin in COD-heavy markets" },
      { name: "Loyalty engagement & win-back", value: 2, feasibility: 3, speed: 2, note: "Segmented outreach from CDP triggers" },
      { name: "Marketplace seller support", value: 2, feasibility: 2, speed: 2, tag: "partner", note: "B2B intents: payouts, listings, penalties" },
      { name: "Post-purchase care & setup help", value: 2, feasibility: 2, speed: 2, note: "Warranty, installation booking, how-to" },
      { name: "Store associate assist", value: 2, feasibility: 2, speed: 1, note: "Inventory lookup, endless-aisle in store" },
      { name: "Promotional & campaign outreach", value: 1, feasibility: 3, speed: 3, note: "Governed frequency caps; suppression rules" },
    ],
    journey: {
      title: "WISMO and delivery coordination, before and after",
      before: [
        "Customer digs through email for a tracking link, then calls; IVR offers no order context",
        "Agent asks for order ID, re-authenticates, toggles OMS + logistics screens",
        "Delivery change requires a ticket to another team; customer calls back twice",
        "Failed deliveries become RTO losses; nobody proactively tells the customer",
        "Peak season: 45-minute queues or an expensive seasonal bench",
      ],
      after: [
        "Customer messages on WhatsApp or calls; agent already knows their recent order",
        "Live status from OMS and the logistics partner, in the customer's language",
        "Agent reschedules delivery or fixes the address directly in the logistics system",
        "Proactive notification when a delivery is at risk — before the customer asks",
        "Peaks absorbed at flat marginal cost; humans handle disputes and exceptions",
      ],
    },
    personas: [
      { role: "CEO", concern: "NPS and cost per order", outcome: "Service cost decoupled from order growth", objection: "Bots have burned us before", proof: "Containment + CSAT on one intent in 8 weeks", opener: "What does answering 'where is my order?' cost you per order today — and at peak?" },
      { role: "CIO / CTO", concern: "Integration sprawl across OMS, WMS, logistics", outcome: "One governed action layer over existing APIs", objection: "Our stack is a patchwork", proof: "Connector inventory + reference architecture session", opener: "The agent layer sits over your existing APIs — no rip-and-replace." },
      { role: "Customer Service leader", concern: "Queue times, seasonal hiring", outcome: "60–80% containment on top intents", objection: "Escalations will just get harder", proof: "Warm-handoff demo with full context transfer", opener: "If WISMO disappeared from your queues, what would your team do with the time?" },
      { role: "CMO / Growth", concern: "Cart recovery, retention", outcome: "Conversational outreach with attribution", objection: "Outreach fatigue and unsubscribes", proof: "Frequency-capped, consent-governed campaign design", opener: "Your cart-recovery emails get 2% response. What does a two-way conversation get?" },
      { role: "Operations leader", concern: "RTO losses and delivery failure", outcome: "Proactive coordination cuts failed deliveries", objection: "Logistics partners won't integrate", proof: "Partner-built connectors to major 3PLs", opener: "Every failed COD delivery is pure margin loss. What's your RTO rate?" },
    ],
    compliance: [
      "Consent and opt-out management for proactive outreach, per channel",
      "Payment actions bounded: refunds within policy tiers only, above-tier to humans",
      "PII minimization in prompts and logs; regional data residency",
      "Marketplace regulations: seller communications and penalty disputes documented",
    ],
    pilot: {
      scope: "WISMO + delivery coordination on WhatsApp and web chat, two languages, one region",
      weeks: "6–10",
      integrations: ["Order management system (read)", "Logistics partner API (read/write reschedule)", "WhatsApp BSP via partner"],
      success: ["Containment on WISMO intents", "CSAT vs human baseline", "RTO / failed-delivery delta", "Cost per contact", "Escalation quality score"],
    },
    expansion: ["Returns automation", "Cart recovery", "Guided selling", "Seller support", "Store associate assist"],
    faqs: [
      { q: "Can it act, or just answer?", a: "It acts: reschedules deliveries, initiates policy-bounded refunds, generates return labels, updates addresses — each action gated by rules your operations team owns." },
      { q: "What happens at peak?", a: "Capacity scales elastically on Google Cloud. The marginal cost of the 100,000th conversation on sale day is the same as the first." },
      { q: "We already have a chatbot.", a: "Most retail bots deflect; this resolves. The difference is grounded access to your order, logistics, and payment systems plus governed actions — measured as end-to-end containment, not deflection." },
    ],
    roi: { monthlyInteractions: 800000, avgMinutes: 3, humanCostPerMin: 0.35, aiCostPerMin: 0.06, containment: 70, revenuePerResolved: 1.2 },
    speakerNotes: [
      "Lead with WISMO share of contacts — it's the number every service leader knows.",
      "Frame outreach (cart recovery) as the expansion, not the entry: service first builds trust.",
      "Peak-season elasticity is the CFO hook.",
    ],
    discoveryQuestions: [
      "What share of contacts are order-status or returns? What does each cost?",
      "How do you staff for festival or holiday peaks today?",
      "What's your RTO rate on COD orders, and what drives it?",
      "Which systems hold order truth — and do they have APIs?",
    ],
  },
  {
    slug: "telecom",
    name: "Telecommunications",
    short: "Telecom",
    color: "#7C3AED",
    heroHeadline: "A billion conversations, one governed layer",
    heroSub:
      "Plan support, activations, network triage, retention, and collections at telco scale — millions of interactions a day, dozens of languages, with cost per interaction that finally matches ARPU reality.",
    thesis: [
      "Telcos run the highest interaction volumes of any industry at some of the lowest revenue per user. Serving a $2-ARPU subscriber with an $8 human call is structurally broken math.",
      "The interactions are deeply data-backed — balance, plan, network status, recharge — exactly the profile agents resolve end-to-end.",
      "Churn and collections are conversation problems: the operator that reaches the right subscriber with the right offer in the right language, at scale, wins the margin war.",
    ],
    whyNow: [
      "ARPU pressure makes human-assisted service economics untenable for prepaid bases",
      "5G and fiber upsell requires proactive, personalized outreach at a scale tele-calling can't touch",
      "Network-issue calls spike in storms and outages — exactly when human capacity is worst",
      "Multilingual subscriber bases are underserved by monolingual IVR trees",
    ],
    stats: [
      { value: "7×", label: "cost gap between assisted and self-service contacts ($13.50 vs $1.84) — untenable at prepaid ARPU", source: "Gartner cost benchmarks, 2024" },
      { value: "10+", label: "languages a single agent deployment serves without staffing constraints", source: "platform capability (Gemini + Chirp speech models)" },
      { value: "30–40%", label: "of telco call volume is balance, recharge, and plan queries", source: "operator benchmarks; validate per customer" },
    ],
    useCases: [
      { name: "Plan, billing & balance support", value: 3, feasibility: 3, speed: 3, tag: "lighthouse", note: "Highest volume; clean BSS APIs; instant containment" },
      { name: "Recharge reminders & collections", value: 3, feasibility: 3, speed: 3, tag: "fastest", note: "Direct revenue; prepaid churn prevention" },
      { name: "Churn prediction outreach & retention offers", value: 3, feasibility: 2, speed: 2, tag: "executive", note: "Offer matrix governance critical" },
      { name: "Service activation & SIM/eSIM onboarding", value: 3, feasibility: 2, speed: 2, note: "KYC steps stay system-owned; agent orchestrates" },
      { name: "Network issue triage & outage communication", value: 3, feasibility: 2, speed: 2, tag: "consumption", note: "Deflects storm-driven spikes; NOC data grounding" },
      { name: "Technician scheduling & visit coordination", value: 2, feasibility: 3, speed: 2, note: "Field-service system integration; no-show reduction" },
      { name: "Upsell & cross-sell (5G, fiber, OTT bundles)", value: 3, feasibility: 2, speed: 2, note: "Propensity-triggered, consent-governed" },
      { name: "Multi-language inbound servicing", value: 2, feasibility: 3, speed: 2, note: "Long-tail languages human benches can't cover" },
      { name: "Retail & field-agent assist", value: 2, feasibility: 2, speed: 1, tag: "partner", note: "Store staff plan lookup, MNP handling" },
      { name: "Enterprise (B2B) account servicing", value: 2, feasibility: 2, speed: 1, note: "Higher-value, lower-volume expansion" },
    ],
    journey: {
      title: "Network issue triage, before and after",
      before: [
        "Outage hits; call volume spikes 5× while human queues melt down",
        "IVR knows nothing about the outage; customers wait 30 minutes to hear 'we're aware'",
        "Agents manually check NOC dashboards, give inconsistent restoration estimates",
        "No proactive communication; every affected subscriber who calls costs $5–8",
        "Post-outage, churn spikes in affected areas with no retention response",
      ],
      after: [
        "Agent correlates the caller's location with live network status before saying hello",
        "Known-outage callers get restoration estimates and SMS/WhatsApp updates — in seconds, any language",
        "Genuine device or line faults get guided triage; unresolved cases book a technician directly",
        "Proactive outage notifications suppress the call spike before it forms",
        "Affected-area subscribers get automated post-restoration check-ins and retention offers",
      ],
    },
    personas: [
      { role: "CEO", concern: "Margin per subscriber, churn", outcome: "Service cost aligned to ARPU; retention at scale", objection: "We've spent millions on IVR already", proof: "Cost-per-interaction model on their own volumes", opener: "What does it cost to serve your lowest-ARPU decile today, per contact?" },
      { role: "CTO", concern: "BSS/OSS integration, scale, latency", outcome: "Carrier-grade agent layer in their cloud", objection: "Nothing external touches our BSS", proof: "In-tenant architecture + load-tested reference deployment", opener: "This runs inside your tenant and speaks to BSS through your own governed APIs." },
      { role: "Customer Service leader", concern: "Queue SLAs across languages", outcome: "70%+ containment on top intents, 24/7", objection: "Our intents are messier than you think", proof: "Conversation-intelligence audit of their real call data first", opener: "Let's analyze a month of your calls before we automate anything." },
      { role: "CMO", concern: "Churn, upsell conversion", outcome: "Two-way retention conversations, not SMS blasts", objection: "Outbound AI calls will annoy subscribers", proof: "Consent-governed pilot with opt-out and sentiment tracking", opener: "Your win-back SMS gets 1% response. A conversation in the subscriber's language gets more." },
      { role: "Collections leader", concern: "Postpaid receivables, prepaid lapse", outcome: "Every at-risk account contacted on day one", objection: "Regulatory limits on collections calls", proof: "Policy-window enforcement built into orchestration", opener: "How many day-1 delinquents does your team actually reach?" },
    ],
    compliance: [
      "TRAI / telecom-regulator consent and DND compliance enforced in orchestration",
      "Calling windows, frequency caps, and opt-outs as platform policy, not script discipline",
      "Subscriber data stays in-tenant; lawful-intercept and retention obligations unaffected",
      "Offer governance: retention and upsell offers only from approved matrices",
    ],
    pilot: {
      scope: "Balance/plan/recharge intents on voice + WhatsApp for one circle/region, three languages",
      weeks: "8–12",
      integrations: ["BSS (read balance/plan)", "Recharge/payment gateway", "SMSC/WhatsApp BSP via partner"],
      success: ["Containment on pilot intents", "Cost per interaction vs blended human cost", "CSAT / repeat-call rate", "Recharge conversion on reminders", "P95 latency at load"],
    },
    expansion: ["All service intents", "Churn & retention outreach", "Network triage + proactive outage comms", "Collections", "B2B servicing"],
    faqs: [
      { q: "Can it handle our scale?", a: "The platform scales elastically on the same Google infrastructure that serves planet-scale consumer products. Pilots include load testing to your peak-hour profile." },
      { q: "We have an IVR and a chatbot already.", a: "Keep the phone numbers and channels. The agent layer replaces the decision logic behind them — DTMF trees become conversations, and containment becomes resolution, not deflection." },
      { q: "How do you handle 12+ languages?", a: "Gemini models with Google speech handle major Indian and world languages including code-switching. Partners tune pronunciation lexicons and dialect coverage per market." },
    ],
    roi: { monthlyInteractions: 5000000, avgMinutes: 3, humanCostPerMin: 0.3, aiCostPerMin: 0.05, containment: 65, revenuePerResolved: 0.4 },
    speakerNotes: [
      "The ARPU-vs-cost-per-call mismatch is the whole pitch — lead with it.",
      "Conversation-intelligence audit first is a low-friction entry that de-risks intent complexity.",
      "Scale credibility: emphasize Google-infrastructure elasticity and load-tested pilots.",
    ],
    discoveryQuestions: [
      "What is your blended cost per human-assisted call, and your ARPU by decile?",
      "What share of volume is balance, recharge, and plan queries?",
      "How many languages does your IVR serve vs your subscriber base speak?",
      "What happens to your queues during a network outage?",
    ],
  },
  {
    slug: "education",
    name: "Education",
    short: "Education",
    color: "#D97706",
    heroHeadline: "Every student question answered. Every applicant nurtured. Every parent informed.",
    heroSub:
      "From first admissions inquiry to alumni engagement — one governed communications layer for the institution, connected to your student systems, speaking every language your community speaks.",
    thesis: [
      "Education institutions run enterprise-scale communications on retail-scale budgets: admissions funnels of tens of thousands, fee cycles, timetables, campus services, parent updates — mostly on shared inboxes and notice boards.",
      "Enrollment is won and lost on response time. Inquiries answered in minutes convert at multiples of those answered in days — and most institutions answer in days.",
      "A standardized agentic communications layer becomes campus infrastructure: admissions, registrar, finance, IT, and student services all publish into one governed front door.",
    ],
    whyNow: [
      "Enrollment competition is intensifying while admissions teams stay flat",
      "Students expect consumer-grade, instant, mobile-first communication",
      "Fee collection and retention pressures make proactive outreach an economic necessity",
      "Institutions hold rich student data that static portals never activate",
    ],
    stats: [
      { value: "78%", label: "of students in vendor funnel studies choose an institution that responds first — speed wins enrollment", source: "admissions-funnel benchmarks (LeadSquared et al.); validate per institution" },
      { value: "20–40%", label: "of admitted students who never enroll ('summer melt') at many institutions — a nurture problem", source: "US higher-ed melt research; ranges vary by segment" },
      { value: "1 layer", label: "for admissions, registrar, fees, IT, campus services, and parent communications", source: "platform capability" },
    ],
    useCases: [
      { name: "Admissions inquiry management & lead nurturing", value: 3, feasibility: 3, speed: 3, tag: "lighthouse", note: "Direct enrollment revenue; CRM-only integration to start" },
      { name: "Application completion follow-up", value: 3, feasibility: 3, speed: 3, tag: "fastest", note: "Chase incomplete applications with document checklists" },
      { name: "Student onboarding & orientation support", value: 2, feasibility: 3, speed: 2, note: "Reduces melt; heavy question volume in a narrow window" },
      { name: "Course, timetable & registration support", value: 2, feasibility: 2, speed: 2, tag: "consumption", note: "SIS integration; daily recurring usage drives seats" },
      { name: "Fee reminders & payment support", value: 3, feasibility: 3, speed: 3, note: "Collections pack applied to education; measurable in one cycle" },
      { name: "Attendance & retention early-warning outreach", value: 3, feasibility: 2, speed: 2, tag: "executive", note: "At-risk student contact; human counselor escalation" },
      { name: "Campus services help desk (IT, library, hostel, transport)", value: 2, feasibility: 3, speed: 2, note: "Employee-support pack for students and staff" },
      { name: "Parent communications & updates", value: 2, feasibility: 3, speed: 2, note: "K-12 strength; multilingual by default" },
      { name: "Academic notifications & deadline management", value: 2, feasibility: 3, speed: 3, note: "Proactive layer; consent-governed" },
      { name: "Alumni engagement & giving campaigns", value: 1, feasibility: 2, speed: 1, tag: "partner", note: "Later expansion; advancement CRM integration" },
    ],
    journey: {
      title: "Admissions inquiry to enrollment, before and after",
      before: [
        "Prospect submits a web form; auto-reply promises a response 'within 3 business days'",
        "Counselor calls twice during work hours, reaches voicemail, marks 'unresponsive'",
        "Program questions answered from memory; fee details require a callback",
        "Application started, stalls on a missing document nobody chases",
        "Admit letter sent; the next touch is the fee deadline. The student enrolled elsewhere weeks ago.",
      ],
      after: [
        "Agent responds in minutes on WhatsApp or voice, in the family's language",
        "Program fit, eligibility, fees, scholarships answered from governed institutional knowledge",
        "Qualified prospects booked directly into counselor calendars; every conversation logged to CRM",
        "Application progress tracked; missing documents chased automatically with clear checklists",
        "Post-admit nurture through enrollment: orientation info, fee plans, roommate deadlines — melt drops",
      ],
    },
    personas: [
      { role: "Vice-Chancellor / Head of Institution", concern: "Enrollment numbers and reputation", outcome: "Funnel conversion up without headcount", objection: "AI feels impersonal for education", proof: "Response-time and conversion data from pilot cohort", opener: "Every inquiry answered in minutes, in the family's language — how would that change your yield?" },
      { role: "Admissions Director", concern: "Counselor capacity in peak season", outcome: "Counselors spend time on qualified, booked conversations", objection: "Our programs are too nuanced for a bot", proof: "Knowledge-grounding demo on their actual prospectus", opener: "What's your median first-response time in admission season?" },
      { role: "CIO / IT Director", concern: "SIS integration, student data privacy", outcome: "In-tenant deployment, FERPA/DPDP-aligned controls", objection: "We can't expose student records", proof: "Security blueprint + scoped read APIs", opener: "Student data stays in your tenant; the agent sees only what its role permits." },
      { role: "Finance / Registrar", concern: "Fee realization, admin load", outcome: "Fee reminders that convert; registration queues shrink", objection: "Families will resent automated fee calls", proof: "Tone-governed scripts + payment-plan escalation paths", opener: "What share of fee follow-ups happen on time today?" },
      { role: "Dean of Students", concern: "Retention and student wellbeing", outcome: "At-risk students contacted early, counselors focused on care", objection: "Sensitive matters need humans", proof: "Escalation design: wellbeing cues route to humans immediately", opener: "The agent handles logistics so your counselors handle people." },
    ],
    compliance: [
      "Student-data privacy (FERPA / DPDP / GDPR as applicable) with role-scoped access",
      "Minor-safeguarding rules for K-12 parent and student communications",
      "Wellbeing and distress cues escalate to trained humans immediately — never automated",
      "Consent management for proactive outreach to students, parents, and alumni",
    ],
    pilot: {
      scope: "Admissions inquiry + application follow-up for one intake cycle, WhatsApp + voice, two languages",
      weeks: "6–10",
      integrations: ["Admissions CRM (read/write)", "Prospectus / knowledge base", "Calendar booking", "WhatsApp BSP via partner"],
      success: ["First-response time", "Inquiry-to-application conversion", "Counselor hours redirected", "Applicant satisfaction", "Cost per nurtured inquiry"],
    },
    expansion: ["Fee reminders", "Onboarding & registration", "Campus help desk", "Retention outreach", "Institution-wide notification layer", "Alumni engagement"],
    faqs: [
      { q: "How does this drive Gemini Enterprise adoption beyond the agent?", a: "The same platform that answers students gives faculty, administrators, and staff governed AI across their work. Recurring workflows — registration, advising prep, grading support — draw the whole campus into daily use." },
      { q: "Is it appropriate for sensitive student situations?", a: "The agent is designed to detect distress or safeguarding cues and hand off to trained staff immediately, with context. It handles logistics; humans handle care." },
      { q: "Can smaller institutions afford this?", a: "Partner-delivered agent packs on consumption pricing scale down to single-campus deployments — you pay for interactions, not a platform license sized for a university system." },
    ],
    roi: { monthlyInteractions: 60000, avgMinutes: 5, humanCostPerMin: 0.4, aiCostPerMin: 0.07, containment: 65, revenuePerResolved: 15 },
    speakerNotes: [
      "Enrollment economics carry the meeting: one recovered student ≈ multi-year fee revenue.",
      "The 'standardized campus communications layer' vision is the executive close, not the opener.",
      "Seat activation across faculty/staff is an internal Google Cloud outcome — never pitch it as the customer's value prop.",
    ],
    discoveryQuestions: [
      "What is your median first response to an admissions inquiry in peak season?",
      "What does summer melt cost you in enrolled-student revenue?",
      "How many separate systems message students today, and who governs them?",
      "Which languages do your applicant families actually speak?",
    ],
  },
  {
    slug: "gcc",
    name: "Global Capability Centres",
    short: "GCC",
    color: "#00838F",
    heroHeadline: "The GCC that runs on agents — and builds them for the enterprise",
    heroSub:
      "Employee help desks, HR, IT, finance operations, and shared services delivered by governed agents — and a centre of excellence that designs, operates, and scales agentic communications for the global enterprise.",
    thesis: [
      "GCCs are the shared-services engine of global enterprises — and shared services are mostly structured communications: tickets, requests, approvals, status checks, escalations.",
      "The GCC has a double role: the best first customer for an agentic communications layer, and the natural global operator of it. The centre that automates its own help desks earns the mandate to build agents for the whole enterprise.",
      "GCC economics are measured relentlessly in cost per ticket and SLA. Agentic resolution moves both in the same quarter it deploys.",
    ],
    whyNow: [
      "GCC mandates are shifting from cost arbitrage to capability leadership — AI operations is the new charter",
      "Enterprise AI platform decisions are being made now; GCCs that move first own the agenda",
      "Multilingual global workforces need support coverage that follow-the-sun staffing can't economically provide",
      "Ticket volumes grow with every acquisition and system migration the GCC absorbs",
    ],
    stats: [
      { value: "$64.6B", label: "India GCC market in FY2024 — 1,700+ centres, 1.9M+ employees, heading to ~$100B by 2030", source: "NASSCOM–Zinnov India GCC Landscape Report" },
      { value: "40–60%", label: "of L1 tickets are password resets, status checks, and how-to questions", source: "ITSM benchmarks; validate per customer" },
      { value: "2 roles", label: "GCC as first customer of the platform — and as the enterprise's agent-building centre of excellence", source: "strategic construct" },
    ],
    useCases: [
      { name: "IT service desk (L0/L1 resolution)", value: 3, feasibility: 3, speed: 3, tag: "lighthouse", note: "Password resets, access requests, how-to; ITSM APIs are mature" },
      { name: "HR support (policy, leave, letters, payroll queries)", value: 3, feasibility: 3, speed: 3, tag: "fastest", note: "HRMS integration; instant employee-experience win" },
      { name: "Finance operations (invoice status, T&E, vendor queries)", value: 3, feasibility: 2, speed: 2, tag: "consumption", note: "High volume from vendors and employees alike" },
      { name: "Procurement support & intake", value: 2, feasibility: 2, speed: 2, note: "Guided intake beats form abandonment" },
      { name: "Employee onboarding & offboarding orchestration", value: 3, feasibility: 2, speed: 2, tag: "executive", note: "Cross-system agentic workflow showcase" },
      { name: "Knowledge access & policy Q&A with citations", value: 2, feasibility: 3, speed: 3, note: "Grounded enterprise search; day-one value" },
      { name: "Agent assist for retained human desks", value: 2, feasibility: 3, speed: 2, note: "Uplift for complex-queue specialists" },
      { name: "Enterprise process notifications & chase-ups", value: 2, feasibility: 3, speed: 2, note: "Approvals, timesheets, compliance training nudges" },
      { name: "Multi-language employee engagement", value: 2, feasibility: 3, speed: 2, note: "Global workforce, one support layer" },
      { name: "Agent-building CoE for business units", value: 3, feasibility: 2, speed: 1, tag: "partner", note: "GCC operates the platform and ships agents to the enterprise" },
    ],
    journey: {
      title: "Employee IT + HR support, before and after",
      before: [
        "Employee searches the intranet, gives up, raises a ticket in the wrong category",
        "L1 agent triages 4 hours later, asks for details already in the ticket",
        "Password reset — a 2-minute fix — took 6 hours of elapsed time and $18 of cost",
        "HR policy questions queue behind payroll-run spikes",
        "Quality team samples tickets; systemic knowledge gaps persist for quarters",
      ],
      after: [
        "Employee asks in chat, voice, or the portal — in their language, 24/7",
        "Identity and entitlements resolved via SSO; answers cite governed policy sources",
        "Password resets, access requests, leave applications executed immediately against ITSM/HRMS",
        "Unresolvable cases become perfectly-formed tickets routed to the right queue with context",
        "Every interaction scored; knowledge gaps and process friction surface to owners weekly",
      ],
    },
    personas: [
      { role: "GCC Site Leader / Head", concern: "Cost per ticket, charter expansion", outcome: "Lower unit costs and a new AI-operations mandate", objection: "Automation shrinks my headcount story", proof: "Charter-growth narrative: fewer L1 FTEs, new agent-ops roles", opener: "The GCCs winning new mandates are the ones running the enterprise's AI operations. Is that your charter yet?" },
      { role: "Global CIO", concern: "Standardization across regions and towers", outcome: "One governed agent layer instead of tool sprawl", objection: "Every region bought its own chatbot", proof: "Consolidation architecture + governance model", opener: "How many conversational tools does your enterprise run today, and who governs them?" },
      { role: "Shared Services / Ops leader", concern: "SLA, ticket backlogs, attrition", outcome: "L1 resolution in seconds, humans on L2/L3", objection: "Our processes are too bespoke", proof: "Process-mining audit of their real ticket data", opener: "What share of last quarter's tickets were password resets and status checks?" },
      { role: "CHRO", concern: "Employee experience scores", outcome: "Instant, consistent HR answers in every language", objection: "HR needs a human touch", proof: "Escalation design: sensitive matters route to HRBPs immediately", opener: "Your people wait two days for answers that exist in your policy documents." },
      { role: "Security & Risk", concern: "Access control, data leakage", outcome: "Role-scoped agents with full audit trails", objection: "An agent with system access is an attack surface", proof: "IAM design review: least-privilege tool permissions, logged actions", opener: "Every agent action is identity-bound, permission-scoped, and logged — unlike your shared-inbox workflows today." },
    ],
    compliance: [
      "Least-privilege agent permissions bound to the requesting employee's entitlements",
      "Cross-border employee-data handling per region (GDPR, DPDP, local labor law)",
      "Sensitive HR matters (grievances, health, performance) always route to humans",
      "Full audit trail of every automated action against ITSM/HRMS/ERP",
    ],
    pilot: {
      scope: "IT L1 + HR policy support for one business unit or region, chat + voice, English + one language",
      weeks: "6–10",
      integrations: ["ITSM (ServiceNow or equivalent)", "HRMS (read + leave actions)", "SSO / directory", "Knowledge sources"],
      success: ["L1 resolution rate", "Mean time to resolution", "Ticket deflection", "Employee satisfaction", "Cost per resolved contact"],
    },
    expansion: ["All towers (finance, procurement)", "Onboarding orchestration", "Global rollout", "Agent-building CoE serving business units", "Customer-facing agents operated by the GCC"],
    faqs: [
      { q: "Is this just another ITSM chatbot?", a: "ITSM chatbots deflect to articles. This resolves: it executes resets, requests, and applications against your systems under least-privilege permissions, and files perfect tickets when humans are needed." },
      { q: "How does the CoE model work?", a: "Phase one, the GCC deploys agents for its own shared services. Phase two, the same team — with partner enablement — designs, ships, and operates agents for business units globally, on one governed platform." },
      { q: "What about our existing automation investments?", a: "RPA bots and workflow tools become tools the agent calls. The layer orchestrates what you have; it doesn't replace it." },
    ],
    roi: { monthlyInteractions: 120000, avgMinutes: 6, humanCostPerMin: 0.55, aiCostPerMin: 0.08, containment: 55 },
    speakerNotes: [
      "Charter expansion is the emotional hook for GCC leaders — cost is table stakes.",
      "Position the GCC as builder-operator, not just consumer: that's the differentiated story.",
      "Ticket-data audit first: automate what the data proves is automatable.",
    ],
    discoveryQuestions: [
      "What is your cost per L1 ticket, and what share is resets and status checks?",
      "Which towers (IT, HR, finance) have the worst SLA pressure today?",
      "Does your GCC have an AI charter from the global CIO — or want one?",
      "How many conversational tools exist across the enterprise today?",
    ],
  },
];

// ─── GECX boundary model ────────────────────────────────────────────────────

export type GecxOwner = "GECX-led" | "Gemini Enterprise-led" | "Joint" | "Partner-led" | "Customer-owned";

export const GECX_MAP: { capability: string; owner: GecxOwner; note: string }[] = [
  { capability: "Contact-centre infrastructure (CCaaS)", owner: "GECX-led", note: "Queues, ACD, agent seats, WFM ecosystem" },
  { capability: "Omnichannel routing & agent desktop", owner: "GECX-led", note: "Human-agent workspace and routing rules" },
  { capability: "Workforce management & quality management", owner: "GECX-led", note: "Scheduling, adherence, QM workflows" },
  { capability: "IVR / customer-service telephony", owner: "GECX-led", note: "Carrier connectivity within the CC stack" },
  { capability: "CRM case management", owner: "Customer-owned", note: "Salesforce, ServiceNow, custom — integrated, never replaced" },
  { capability: "Customer-service conversational agents (CC-centric)", owner: "Joint", note: "GECX virtual agents in CC contexts; GE agents when part of broader workflows" },
  { capability: "Cross-enterprise multi-agent orchestration", owner: "Gemini Enterprise-led", note: "Agents spanning sales, ops, finance, HR, collections" },
  { capability: "Enterprise workflow actions (act in ERP/core systems)", owner: "Gemini Enterprise-led", note: "Governed tool-calling into systems of record" },
  { capability: "Employee-facing agents (HR/IT/finance)", owner: "Gemini Enterprise-led", note: "Outside the contact-centre domain entirely" },
  { capability: "Outbound engagement & proactive notifications", owner: "Gemini Enterprise-led", note: "Campaign-triggered agentic outreach beyond CC dialers" },
  { capability: "Agent governance, evaluation & observability", owner: "Gemini Enterprise-led", note: "Policies, evals, audit across all agents" },
  { capability: "Enterprise search & grounding", owner: "Gemini Enterprise-led", note: "Governed knowledge across the enterprise" },
  { capability: "Model & speech services (Gemini, STT/TTS)", owner: "Joint", note: "Shared Google Cloud foundation consumed by both" },
  { capability: "Telephony & channel integration (non-CC)", owner: "Partner-led", note: "SIP, BSP, WhatsApp, RCS wiring for agentic use cases" },
  { capability: "Industry agent packs & connectors", owner: "Partner-led", note: "Repeatable vertical IP on the platform" },
  { capability: "Data platform & analytics (BigQuery et al.)", owner: "Joint", note: "Interaction data lands in customer's warehouse" },
  { capability: "Business rules, offer matrices, policies", owner: "Customer-owned", note: "Customer defines; platform enforces" },
];

export type TreeNode = {
  id: string;
  question?: string;
  options?: { label: string; next: string }[];
  result?: { verdict: string; color: string; detail: string };
};

export const GECX_TREE: TreeNode[] = [
  {
    id: "start",
    question: "What is the customer's centre of gravity for this initiative?",
    options: [
      { label: "Modernizing the contact centre (queues, IVR, agent desktops, WFM)", next: "cc" },
      { label: "Communications embedded in broader business workflows (collections, sales, HR, education, ops)", next: "workflow" },
      { label: "Both: CC modernization and enterprise agent ambitions", next: "both" },
    ],
  },
  {
    id: "cc",
    question: "Do the conversational agents need to act in enterprise systems beyond the CC/CRM stack (core banking, ERP, SIS, logistics)?",
    options: [
      { label: "No — service resolution within CC + CRM", next: "r-gecx" },
      { label: "Yes — actions span systems of record across functions", next: "r-joint" },
    ],
  },
  {
    id: "workflow",
    question: "Is there an existing contact-centre stack that human escalations must land in?",
    options: [
      { label: "Yes — escalations integrate into the existing CC platform", next: "r-ge-integrate" },
      { label: "No / minimal CC footprint (outbound-first, employee-facing, or greenfield)", next: "r-ge" },
    ],
  },
  {
    id: "both",
    question: "Which decision is the customer making first?",
    options: [
      { label: "CC platform selection is active now", next: "r-joint" },
      { label: "Agent platform / AI strategy is the active decision", next: "r-ge-lead-joint" },
    ],
  },
  { id: "r-gecx", result: { verdict: "Lead with GECX", color: "#D97706", detail: "Customer Engagement Suite is the natural fit. Introduce Gemini Enterprise later for cross-enterprise agent expansion. Route the opportunity to the GECX specialist." } },
  { id: "r-joint", result: { verdict: "Lead jointly", color: "#7C3AED", detail: "Run a joint motion: GECX owns contact-centre modernization; Gemini Enterprise owns the cross-enterprise agent layer. One account plan, explicit capability swimlanes, shared architecture workshop." } },
  { id: "r-ge", result: { verdict: "Lead with Gemini Enterprise Communications", color: "#1A73E8", detail: "This is the core motion: agentic communications embedded in enterprise workflows. Engage an implementation partner for channels/telephony. GECX not required." } },
  { id: "r-ge-integrate", result: { verdict: "Lead with Gemini Enterprise, integrate the CC stack", color: "#1A73E8", detail: "Gemini Enterprise leads; human handoff integrates into the customer's existing contact-centre platform (whoever the vendor). Do not open a CC-replacement conversation." } },
  { id: "r-ge-lead-joint", result: { verdict: "Lead with Gemini Enterprise, bring GECX in", color: "#1A73E8", detail: "Anchor on the enterprise agent platform decision. Bring the GECX team into the account plan for the CC-modernization track when it activates." } },
];

// ─── Internal GTM data ──────────────────────────────────────────────────────

export const QUALIFIER_CRITERIA = [
  { id: "volume", label: "Monthly interaction volume", weight: 20, options: [{ v: 0, l: "< 50K" }, { v: 1, l: "50K – 500K" }, { v: 2, l: "500K – 5M" }, { v: 3, l: "> 5M" }] },
  { id: "cost", label: "Current cost pressure on interactions", weight: 15, options: [{ v: 0, l: "Low / unknown" }, { v: 1, l: "Known, moderate" }, { v: 2, l: "High, measured" }, { v: 3, l: "Board-level issue" }] },
  { id: "sponsor", label: "Executive sponsorship", weight: 15, options: [{ v: 0, l: "None identified" }, { v: 1, l: "Manager-level interest" }, { v: 2, l: "CXO interested" }, { v: 3, l: "CXO mandated" }] },
  { id: "language", label: "Multi-language need", weight: 10, options: [{ v: 0, l: "Single language" }, { v: 1, l: "2–3 languages" }, { v: 3, l: "4+ / Indic languages" }] },
  { id: "residency", label: "Data-residency / in-tenant preference", weight: 10, options: [{ v: 0, l: "Indifferent" }, { v: 2, l: "Preferred" }, { v: 3, l: "Mandatory (regulated)" }] },
  { id: "integration", label: "Integration readiness (APIs to core systems)", weight: 10, options: [{ v: 0, l: "No APIs" }, { v: 1, l: "Partial" }, { v: 3, l: "Mature API layer" }] },
  { id: "outsourcing", label: "Outsourcing / BPO dependence", weight: 10, options: [{ v: 0, l: "None" }, { v: 2, l: "Significant BPO spend" }, { v: 3, l: "Strategic dependency under review" }] },
  { id: "urgency", label: "Use-case urgency (trigger event)", weight: 10, options: [{ v: 0, l: "Exploratory" }, { v: 2, l: "Budgeted initiative" }, { v: 3, l: "Burning platform" }] },
];

export const SALES_STAGES = [
  { stage: "1. Account selection", activity: "Score accounts with the qualifier; prioritize regulated, high-volume, multilingual", gate: "Score ≥ 60 or named strategic account" },
  { stage: "2. Executive hypothesis", activity: "One-page hypothesis: use case, value lever, sponsor. Vertical microsite as the opener", gate: "Sponsor meeting secured" },
  { stage: "3. Discovery", activity: "Discovery guide by persona; collect volumes, costs, languages, systems", gate: "Baseline metrics documented" },
  { stage: "4. Value assessment", activity: "ROI calculator with customer's own numbers; agree the formula, not the outcome", gate: "Customer accepts the model's assumptions" },
  { stage: "5. Use-case prioritization", activity: "Score use cases on value × feasibility × speed; pick ONE for pilot", gate: "Single lighthouse use case signed off" },
  { stage: "6. Architecture workshop", activity: "Joint session: reference architecture, integration boundaries, security blueprint; GECX decision-tree check", gate: "Architecture agreed; GECX lane assigned" },
  { stage: "7. Demo", activity: "Industry agent pack demo on customer-like data; partner presents delivery model", gate: "Technical validation complete" },
  { stage: "8. Pilot", activity: "8–12 week pilot per the pilot factory; weekly metric reviews", gate: "Success thresholds met" },
  { stage: "9. Production", activity: "Production-readiness checklist; support model; consumption ramp plan", gate: "Live traffic, agreed SLOs" },
  { stage: "10. Expansion", activity: "Next use cases from the vertical roadmap; quarterly value reviews", gate: "Second use case in flight" },
  { stage: "11. Standardization", activity: "Enterprise agent-platform agreement; CoE model; committed consumption", gate: "Multi-year platform commitment" },
];

export const OBJECTIONS = [
  { q: "“We already have a chatbot / IVR vendor.”", a: "Those deflect within one channel. This is the layer that reasons and acts across all channels and systems — keep the channels, upgrade the intelligence behind them. Offer a conversation-intelligence audit of real traffic as a no-risk first step." },
  { q: "“Isn't this what your Customer Engagement Suite does?”", a: "Customer Engagement Suite modernizes the contact centre. This is for communications embedded in wider workflows — collections, sales, HR, education. Where the customer needs both, we run a joint motion with explicit swimlanes. Use the decision tree; never improvise the boundary." },
  { q: "“Voice AI startups demo better.”", a: "Demos aren't deployments. The gap is telephony, compliance, state, observability, and integration at enterprise scale — inside the customer's tenant. Startups are potential partners on our platform, not necessarily competitors." },
  { q: "“Customers will reject AI calls.”", a: "Design decides this: disclosure, language, latency, and instant human escape hatches. Pilot metrics include CSAT and complaint rate against the human baseline — we measure it rather than argue it." },
  { q: "“The ROI numbers feel inflated.”", a: "We never present outcome claims — the calculator uses the customer's own volumes and costs, shows every formula, and pilots establish the real containment rate before any scale decision." },
  { q: "“What about hallucination and compliance risk?”", a: "Agents are grounded in governed sources, act only through permissioned tools, follow policy matrices they cannot override, and log everything. Compare against today's baseline: sampled QA on 2% of human calls." },
  { q: "“Why not build it ourselves on raw models?”", a: "Many try; the platform is the hard part — orchestration, state, evals, governance, channel infrastructure. Internal teams that start from raw APIs rebuild all of it. Offer the reference architecture as the accelerant either way." },
];

export const PARTNER_MODEL = {
  google: ["Gemini Enterprise Agent Platform & models", "Speech (STT/TTS) & real-time voice", "Enterprise search & grounding", "Security, identity, observability foundation", "Reference architectures & security blueprints", "Pilot funding framework & seller motion"],
  partner: ["Telephony & channel integration (SIP, BSP, WhatsApp, RCS)", "Indic & regional-language tuning", "Industry agent packs & connectors (CRM, core banking, SIS, ITSM)", "Routing, escalation & session state implementation", "Compliance workflow configuration", "Production operations & managed service"],
  customer: ["Business rules, offer matrices & policies", "Systems of record & their APIs", "Data, consent & brand voice", "Human escalation teams & ownership", "Success metrics & governance board"],
};

export const PILOT_PHASES = [
  { phase: "Weeks 1–2 · Frame", items: ["Baseline metrics captured", "One use case, tightly scoped", "Security review started", "Evaluation dataset drafted from real interactions"] },
  { phase: "Weeks 3–6 · Build", items: ["Partner wires channels + integrations", "Agent instructions & policy matrices configured", "Grounding sources connected", "Eval harness passing on golden set"] },
  { phase: "Weeks 7–10 · Prove", items: ["Production-like traffic (shadow, then live slice)", "Weekly metric reviews vs thresholds", "Human-fallback drills", "Cost guardrails monitored"] },
  { phase: "Weeks 11–12 · Decide", items: ["Results vs success thresholds", "Production-readiness checklist", "Consumption ramp forecast", "Go/no-go with sponsor; ownership handover"] },
];

// ─── ROI model ──────────────────────────────────────────────────────────────

export function computeRoi(i: {
  monthlyInteractions: number;
  avgMinutes: number;
  humanCostPerMin: number;
  aiCostPerMin: number;
  containment: number; // 0-100
  implementationCost: number;
  revenuePerResolved: number;
}) {
  const contained = i.monthlyInteractions * (i.containment / 100);
  const escalated = i.monthlyInteractions - contained;
  const baselineCost = i.monthlyInteractions * i.avgMinutes * i.humanCostPerMin;
  // Escalated interactions still incur ~60% of human handle time after AI triage
  const newCost =
    contained * i.avgMinutes * i.aiCostPerMin +
    escalated * i.avgMinutes * (i.aiCostPerMin + 0.6 * i.humanCostPerMin);
  const monthlySavings = baselineCost - newCost;
  const monthlyRevenue = contained * i.revenuePerResolved * 0.02; // 2% incremental outcome lift on contained volume — conservative default
  const monthlyValue = monthlySavings + monthlyRevenue;
  const paybackMonths = monthlyValue > 0 ? i.implementationCost / monthlyValue : Infinity;
  const threeYear = monthlyValue * 36 - i.implementationCost;
  return { contained, escalated, baselineCost, newCost, monthlySavings, monthlyRevenue, monthlyValue, paybackMonths, threeYear };
}

export const fmtMoney = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

export const fmtNum = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${n.toFixed(0)}`;
};

// ─── Market evidence (verified July 2026) ───────────────────────────────────

export const MARKET_STATS: { value: string; label: string; source: string; confidence: "Verified" | "Estimate" }[] = [
  { value: "80%", label: "of common customer-service issues will be resolved autonomously by agentic AI by 2029, cutting operational costs ~30%", source: "Gartner press release, Mar 2025", confidence: "Verified" },
  { value: "$80B", label: "reduction in contact-centre agent labor costs from conversational AI in 2026", source: "Gartner press release, Aug 2022", confidence: "Verified" },
  { value: "$13.50 vs $1.84", label: "median cost per assisted contact vs self-service contact — a 7× gap", source: "Gartner customer service cost benchmarks, 2024", confidence: "Verified" },
  { value: "$11.6B → $41.4B", label: "conversational AI market, 2024 → 2030 (23.7% CAGR)", source: "Grand View Research, 2025", confidence: "Verified" },
  { value: "~$165B", label: "combined global contact-centre software (~$48B) and outsourcing (~$117B) spend", source: "Emergen Research + Market Data Forecast, 2025 (derived)", confidence: "Estimate" },
  { value: "900M+", label: "Indian internet users in 2025; 98% consume content in Indic languages", source: "IAMAI–Kantar via IBEF, Jan 2025", confidence: "Verified" },
  { value: "up to 40%", label: "opex reduction and ~10% recovery improvement from gen-AI-enabled collections", source: "McKinsey digital-first collections research", confidence: "Verified" },
  { value: "$3.6B → $9.8B", label: "OTT business messaging revenue (WhatsApp-led), 2025 → 2029", source: "Juniper Research", confidence: "Verified" },
];

// ─── Architecture layers ────────────────────────────────────────────────────

export const ARCH_LAYERS = [
  {
    name: "Channels",
    owner: "Partner-integrated",
    color: "#00838F",
    items: ["Voice / telephony (SIP)", "WhatsApp & messaging", "Email", "Web & in-app chat", "IVR replacement", "Notifications"],
    detail: "Partners wire carrier trunks, BSPs, and channel SDKs into the platform. Existing phone numbers and channels are kept — the intelligence behind them changes.",
  },
  {
    name: "Agentic Communications Layer",
    owner: "Gemini Enterprise Agent Platform",
    color: "#1A73E8",
    items: ["Intent & language understanding", "Multi-agent orchestration", "Session state & memory", "Policy enforcement", "Model routing & cost controls", "Human-handoff logic"],
    detail: "The core: agents that understand, reason over policies and history, decide, and orchestrate. Runs in the customer's Google Cloud tenant.",
  },
  {
    name: "Intelligence Foundation",
    owner: "Google Cloud",
    color: "#7C3AED",
    items: ["Gemini models", "Speech-to-text / text-to-speech", "Real-time voice (live API)", "Enterprise search & grounding", "Evaluation services", "Translation"],
    detail: "Google's models and speech stack, consumed as governed services with data-residency controls.",
  },
  {
    name: "Enterprise Systems & Actions",
    owner: "Customer-owned, partner-connected",
    color: "#188038",
    items: ["CRM / ticketing", "Core banking / billing / OMS / SIS / ITSM", "Payment gateways", "Knowledge sources", "Data warehouse", "Identity provider"],
    detail: "Systems of record stay where they are. Agents act through permissioned, logged tool calls into existing APIs.",
  },
  {
    name: "Trust & Operations",
    owner: "Google Cloud + customer governance",
    color: "#D97706",
    items: ["Identity & access (IAM)", "Data residency (regions, VPC-SC)", "Audit logging — 100% of interactions", "Continuous evaluation", "Observability & alerting", "Human escalation paths"],
    detail: "Every conversation is identity-bound, policy-checked, logged, and scoreable. Humans stay in the loop by design.",
  },
];

export const LIFECYCLE = [
  { step: "Contact", desc: "Interaction arrives on any channel — or the enterprise initiates outreach" },
  { step: "Identify", desc: "Identity and permissions resolved; consent and policy windows checked" },
  { step: "Understand", desc: "Intent understood in the customer's language, with full context retrieved" },
  { step: "Reason", desc: "Agent reasons over policies, history, and enterprise data" },
  { step: "Act", desc: "Governed actions executed in systems of record — payments, bookings, tickets, updates" },
  { step: "Escalate", desc: "Humans brought in on sentiment, complexity, or policy triggers — with full context" },
  { step: "Record", desc: "Outcome written back; 100% of the interaction logged and auditable" },
  { step: "Improve", desc: "Every interaction evaluated; policies, prompts, and workflows refined" },
];
