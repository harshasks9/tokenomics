// Deep analysis blocks for the first 50 Hong Kong + ANZ qualified profiles.
// Evidence discipline: confidence-labelled pressure bullets, no fabricated
// figures, quotes, dates or URLs. Economics are seller assumptions to validate.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_HK_ANZ_A: Record<string, ProfileAnalysis> = {
  "standard-chartered-hk": {
    operatingContext:
      "Standard Chartered Hong Kong is one of the territory's three note-issuing banks and the single largest market in the group, spanning retail deposits and mortgages, a large credit-card book, Priority and Priority Private wealth tiers, and a deep corporate and financial-institutions franchise. Retail customers reach the bank through a branch and wealth-centre network across Hong Kong Island, Kowloon and the New Territories, the SC Mobile app, a Cantonese-first phone-banking hotline, and messaging notifications. The bank also anchors Mox, its virtual-bank venture, which absorbs the digitally native segment while the legacy franchise retains an older, phone-dependent customer base. Servicing therefore splits between an app cohort that self-serves and a hotline cohort that expects a Cantonese-speaking human for anything beyond a balance check.",
    strategicPressure: [
      { text: "Standard Chartered is a note-issuing bank in Hong Kong and treats the territory as a core market rather than a branch operation, so local servicing quality carries group-level visibility.", kind: "verified" },
      { text: "Wealth and Priority-tier growth is the group's stated engine in Hong Kong, and relationship managers are consumed by servicing tasks — balance, statement, remittance and card queries — that do not require a licensed adviser.", kind: "inference" },
      { text: "Card disputes and unauthorised-transaction claims are a structurally growing driver of hotline minutes as e-commerce and cross-border spend rise, and each dispute is a multi-contact journey rather than one call.", kind: "inference" },
      { text: "HKMA supervisory expectations on complaint handling, record-keeping and outsourcing mean any conversational layer must be auditable per interaction, which favours a governed platform over a chatbot bolt-on.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Standard Chartered runs substantial in-house engineering at group level, including a Hong Kong technology presence, but its pattern in customer-contact technology has been to deploy vendor contact-centre and conversational platforms configured locally rather than to build speech and telephony stacks per market. Hong Kong servicing sits under a market CX owner who consumes group-approved technology, so the sale is a configured deployment inside an approved architecture rather than a greenfield platform decision.",
    whyNotBuild:
      "Even a bank with real engineering capacity will not build Cantonese-accurate speech recognition with English and Mandarin code-switching, carrier-grade telephony integration into an existing Hong Kong hotline estate, policy-bounded action execution against core banking and cards, and per-interaction evaluation against HKMA complaint-handling expectations. Those four things together are a product, not a project, and the bank's own engineers are committed to payments, wealth platforms and regulatory programmes.",
    workflows: [
      {
        name: "Card dispute and unauthorised-transaction intake",
        friction: "Cardholders queue on the hotline, repeat the transaction list to an agent, then wait days with no status visibility, generating two to three follow-up calls per dispute.",
        outcome: "Structured dispute intake in-conversation with evidence capture, provisional-credit rules applied consistently, and proactive status pushed at each stage.",
        channels: ["Voice", "WhatsApp", "Mobile app"],
        systems: ["Cards management system", "Dispute case management", "CRM", "Core banking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Trilingual retail servicing deflection",
        friction: "One IVR tree serves Cantonese, English and Mandarin callers who routinely code-switch mid-sentence, so misrouting and re-authentication consume the first minutes of most calls.",
        outcome: "Identity resolved once, intent understood in mixed language, and balance, statement, limit and remittance-status requests completed without an agent.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Core banking", "IVR / contact centre platform", "CRM", "Authentication and OTP services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Priority-banking service triage ahead of the relationship manager",
        friction: "Relationship managers absorb routine servicing calls from Priority clients because those clients expect a named contact, crowding out advisory time.",
        outcome: "Routine requests handled by the agent with the client's full context, and only advisory or complaint conversations routed to the RM with a transcript.",
        channels: ["Voice", "WhatsApp"],
        systems: ["CRM", "Wealth platform", "Core banking", "Case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A full-featured retail mobile banking app with self-service for payments, cards and statements",
        "A trilingual phone-banking hotline with tiered routing between retail and Priority segments",
        "A web and in-app chat assistant for common retail queries",
        "A separately branded virtual bank in the same market that sets a digital-service benchmark",
      ],
      gaps: [
        "Card disputes cannot be lodged and tracked end-to-end without a human touch",
        "Cantonese voice servicing still terminates in a queue for anything requiring an action in core systems",
        "Context does not survive the jump from app chat to hotline, so customers re-explain",
        "No proactive outbound status on disputes, remittances or application progress",
      ],
    },
    risks: [
      "HKMA expectations on complaint handling, customer-facing outsourcing and operational resilience require documented controls, retention and per-interaction auditability.",
      "PDPO consent and data-minimisation obligations govern how conversation transcripts and voice recordings are stored and used for model tuning.",
      "Group technology governance may restrict vendor selection to an approved architecture, lengthening the path from local sponsorship to contract.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 6,
      automationRate: 0.5,
      basis: "Seller assumptions only — hotline, chat and messaging volume and fully loaded cost per assisted contact must be validated with the Hong Kong CX and contact-centre operations team in discovery.",
    },
    pilotScope:
      "Automate credit-card dispute intake and status for the Hong Kong retail card portfolio across voice and WhatsApp in Cantonese, English and Mandarin, integrated to the cards and dispute case systems, with human handoff for any fraud or vulnerability signal.",
    expansion: [
      "Extend to full retail inbound servicing — balances, statements, limits, remittance status — on the same identity and orchestration layer",
      "Add Priority-tier triage that protects relationship-manager time and routes advisory conversations with full context",
      "Extend outbound: card-renewal, application-status and regulatory notification journeys with consent tracking",
    ],
    stakeholders: [
      "Head of Consumer, Private and Business Banking, Hong Kong",
      "Head of Client Experience / Customer Care, Hong Kong",
      "Chief Information Officer, Hong Kong",
      "Head of Cards and Unsecured Lending",
      "Head of Operational Risk and Compliance, Hong Kong",
    ],
    discovery: [
      "How many hotline minutes are consumed by card disputes and their follow-up status calls each month, and what is the fully loaded cost per minute?",
      "Is the conversational and contact-centre platform decision made in Hong Kong, or must it come from the group architecture panel in Singapore or London?",
      "What proportion of callers code-switch between Cantonese, English and Mandarin, and how does the current IVR handle it?",
      "Which actions can an assistant execute directly in core banking and cards today, and which require a human under current HKMA-aligned control design?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Priority client disputes three cross-border card transactions on WhatsApp at midnight and receives a provisional credit decision and case number before the branch opens.",
  },

  "bank-of-east-asia": {
    operatingContext:
      "Bank of East Asia is the largest independent local bank in Hong Kong, family-influenced and long-established, running a broad branch network alongside a mainland China subsidiary that serves cross-border personal and commercial customers. Its retail base skews older and more branch- and phone-loyal than the virtual banks or the global players, with deposits, mortgages, cards and cross-border account services forming the core. Customers reach it through branches, the SupremeGold and general retail hotlines, an internet and mobile banking channel, and increasingly WeChat for mainland-facing communication. The bank has been simplifying and refocusing on Hong Kong and Greater Bay Area customers rather than pursuing scale everywhere.",
    strategicPressure: [
      { text: "Bank of East Asia is the largest independent local Hong Kong bank and operates a mainland China subsidiary, making cross-border retail servicing a defining part of its proposition rather than an edge case.", kind: "verified" },
      { text: "An older, branch-loyal customer base means phone remains the dominant servicing channel, so cost-to-serve per customer is structurally higher than at digital-first competitors.", kind: "inference" },
      { text: "Cost-to-income discipline has been a persistent theme for mid-scale Hong Kong incumbents facing margin pressure and competition from virtual banks, making servicing cost a board-level line item.", kind: "inference" },
      { text: "Greater Bay Area account-opening, remittance and cross-boundary wealth schemes generate mixed Cantonese and Mandarin conversations with regulatory nuance on both sides of the boundary.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank does not maintain a large internal AI or conversational engineering organisation and has historically procured customer-facing systems from vendors and systems integrators. Its scale supports strong deployment budgets but not a platform build, and its priority is modernising a phone-heavy servicing model quickly rather than owning speech infrastructure.",
    whyNotBuild:
      "Building would require Cantonese speech models tuned to an older demographic with accent and hearing variance, telephony integration into a legacy hotline estate, orchestration across core banking and a separate mainland subsidiary stack, and an evaluation regime that satisfies HKMA complaint-handling review. A bank of this size will not staff four specialist disciplines to reproduce a product it can configure.",
    workflows: [
      {
        name: "Cantonese-first retail phone-banking servicing",
        friction: "Older callers navigate a DTMF menu they find hard to hear and understand, abandon into the agent queue, and then repeat identity checks in full.",
        outcome: "Natural Cantonese conversation from the first second, identity resolved once, and balance, transaction, statement and card-activation requests completed in-call.",
        channels: ["Voice", "SMS"],
        systems: ["Core banking", "Cards system", "IVR / contact centre platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cross-border account and remittance status",
        friction: "Customers moving funds between the Hong Kong bank and the mainland subsidiary call both sides to find out where a transfer sits, and neither agent sees the whole chain.",
        outcome: "A single conversation that reads the remittance state, explains the holdup in the customer's language, and sets an expectation with a proactive update when it clears.",
        channels: ["Voice", "WeChat", "WhatsApp"],
        systems: ["Payments and remittance systems", "Core banking", "Mainland subsidiary interface", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Branch appointment and document pre-check",
        friction: "Customers travel to a branch for cross-border or wealth transactions and are turned away for a missing document, then queue again on another day.",
        outcome: "Appointment booked conversationally with a document checklist confirmed in advance, cutting failed branch visits and repeat calls.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Branch appointment scheduling", "CRM", "Document management", "Core banking"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Internet and mobile banking with self-service transfers, statements and card controls",
        "Segmented retail and priority-banking hotlines with a Cantonese-first agent pool",
        "A branch appointment booking capability for selected transaction types",
        "Mainland-facing communication channels including messaging for cross-border customers",
      ],
      gaps: [
        "Phone servicing still requires a human for almost any action beyond a balance read",
        "Cross-border remittance status cannot be traced end-to-end in one conversation",
        "No proactive outbound on application, card or remittance progress",
        "Branch appointments are not linked to a document readiness check, so failed visits repeat",
      ],
    },
    risks: [
      "HKMA guidance on complaint handling, outsourcing and operational resilience applies to any customer-facing automation, including retention and audit of conversations.",
      "PDPO restricts cross-boundary transfer and use of personal data, which constrains how conversations involving the mainland subsidiary are processed and stored.",
      "An older customer base raises fair-treatment and vulnerable-customer expectations — automation must fail safe to a human quickly and visibly.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions only — hotline volume, channel mix and fully loaded cost per contact require validation with the bank's customer-service and operations leadership.",
    },
    pilotScope:
      "Replace the retail hotline front door with a Cantonese-first conversational layer handling balance, transaction, statement, card-activation and branch-appointment requests, with clean escalation to agents and full transcript handover.",
    expansion: [
      "Add cross-border remittance and account-status tracing spanning the Hong Kong and mainland entities",
      "Extend to card servicing and early payment reminders on the unsecured book",
      "Add outbound proactive notifications for applications, renewals and document chasing",
    ],
    stakeholders: [
      "Head of Personal Banking, Hong Kong",
      "Head of Customer Service / Contact Centre Operations",
      "Chief Operating Officer",
      "Head of Information Technology",
      "Head of Compliance and Operational Risk",
    ],
    discovery: [
      "What share of hotline calls are balance, transaction and statement requests that never needed an agent?",
      "How are cross-border remittance queries handled today between the Hong Kong bank and the mainland subsidiary?",
      "What is the current contact-centre platform, and when does the contract or refresh cycle land?",
      "What is the bank's control position on an automated agent executing transactions versus reading information only?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A retiree calls in Cantonese to check whether her mainland remittance has cleared and books a branch appointment with the right documents listed, without reaching an agent.",
  },

  "dbs-hk": {
    operatingContext:
      "DBS Bank (Hong Kong) is the group's second home market, running retail, SME and wealth franchises with a branch and business-centre network plus a strong digital channel inherited from the group's Singapore-built platforms. Its SME franchise is unusually important — DBS positions itself as a leading bank for Hong Kong small businesses on trade, payments and lending — and SME servicing generates dense operational conversations about payment status, trade documents and account maintenance. Retail customers self-serve heavily in the app, but Cantonese phone servicing remains the fallback for anything the app cannot complete. Group technology is built in Singapore and rolled into Hong Kong, so local teams consume rather than commission platforms.",
    strategicPressure: [
      { text: "DBS is one of Asia's most technology-forward banks with a large internal engineering organisation and its own AI programmes, so any proposal competes with an internal build option.", kind: "verified" },
      { text: "Hong Kong is DBS's second home market with a meaningful SME franchise, giving the local unit real P&L accountability for servicing cost and quality.", kind: "verified" },
      { text: "Group-built conversational assets are engineered primarily for English and Singapore workflows, leaving Cantonese voice servicing and Hong Kong-specific processes as a genuine coverage gap.", kind: "inference" },
      { text: "Regulatory attention to service resilience in Hong Kong after industry-wide digital-banking disruptions raises the bar on fallback channels, which favours a robust voice layer rather than app-only servicing.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. DBS has the engineering depth to build conversational experiences and has done so, so selling a full platform is unrealistic. The credible commercial shape is components and configured workflows the group has not prioritised: Cantonese voice, Hong Kong telephony orchestration, and SME-specific servicing flows that sit below the group roadmap.",
    whyNotBuild:
      "DBS will build what differentiates it and buy what does not. Cantonese-first voice with code-switching, Hong Kong carrier telephony integration, and per-market evaluation harnesses are cost centres to the group's engineering roadmap, not differentiators. The right to win is delivering a market-specific voice and orchestration layer that plugs into the group's existing assistant and identity plumbing rather than replacing it.",
    workflows: [
      {
        name: "SME payment and trade-document status desk",
        friction: "Small business owners call the business hotline to ask where a payment or trade document sits, and relationship staff hand-check multiple systems before calling back.",
        outcome: "Status answered live from the payments and trade systems in Cantonese or English, with document requirements explained and exceptions routed to a named specialist.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Payments platform", "Trade finance system", "CRM", "Business banking core"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Cantonese voice layer over existing digital servicing",
        friction: "Customers who fail in the app fall back to a hotline that does not know what they were just attempting, so the conversation starts from zero.",
        outcome: "Voice sessions inherit app context and complete the same actions, in Cantonese, without re-authentication.",
        channels: ["Voice", "Mobile app"],
        systems: ["Core banking", "Digital channel platform", "Identity and authentication", "Contact centre platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Wealth servicing triage",
        friction: "Treasures relationship managers absorb routine account and transaction queries that crowd out advisory conversations, especially around market-moving days.",
        outcome: "Routine queries handled conversationally with full portfolio context; advisory and suitability conversations reserved for licensed humans.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Wealth platform", "CRM", "Core banking", "Market data services"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A mature retail mobile and internet banking channel with deep self-service",
        "Group-built digital assistant capability deployed across markets",
        "Dedicated business banking hotline and relationship coverage for SMEs",
        "Wealth servicing tiers with named relationship managers",
      ],
      gaps: [
        "Cantonese voice servicing that can execute actions rather than route to a queue",
        "SME trade and payment status resolvable in one conversation instead of a callback",
        "Continuity of context between the app, chat and phone channels",
        "Proactive outbound on document chasing and application progress for business customers",
      ],
    },
    risks: [
      "HKMA expectations on operational resilience and complaint handling apply, and DBS has heightened sensitivity to service-availability scrutiny in the region.",
      "Group architecture governance in Singapore is likely to gate vendor selection, so a Hong Kong sponsor alone cannot close a platform decision.",
      "PDPO obligations plus cross-entity data-sharing constraints limit how Hong Kong conversation data can be pooled with group models.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 6,
      automationRate: 0.45,
      basis: "Seller assumptions only — DBS Hong Kong contact volumes and cost per assisted contact must be validated with the local CX and business banking teams before any business case is presented.",
    },
    pilotScope:
      "Deploy a Cantonese-first voice layer for SME payment and trade-document status on the Hong Kong business hotline, integrated to the payments and trade systems, running alongside rather than replacing group digital assets.",
    expansion: [
      "Extend the same voice layer to retail Cantonese servicing with app-to-voice context continuity",
      "Add outbound document chasing and application-status journeys for SME onboarding and lending",
      "Add wealth servicing triage that protects relationship-manager advisory time",
    ],
    stakeholders: [
      "Head of Consumer Banking Group, Hong Kong",
      "Head of Institutional / SME Banking, Hong Kong",
      "Chief Information Officer, Hong Kong",
      "Head of Customer Experience and Contact Centre",
      "Group technology architecture representative for Hong Kong",
    ],
    discovery: [
      "Which parts of the group's Singapore-built conversational stack are already committed to Hong Kong, and on what timeline?",
      "How much of the SME hotline is status-checking that could be answered from systems of record?",
      "Does Hong Kong hold budget and vendor-selection authority for voice channel technology, or is that a group decision?",
      "What is the current Cantonese coverage of the existing assistant, and where does it hand off to humans?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An SME owner asks in Cantonese why a supplier payment has not landed and gets the live payments-system reason plus a fix, without waiting for a relationship manager callback.",
  },

  "dah-sing-bank": {
    operatingContext:
      "Dah Sing Bank is a mid-size Hong Kong retail and commercial bank with a meaningful credit-card and personal-lending business relative to its balance-sheet size, plus SME banking and an insurance arm within the wider Dah Sing group. Its card portfolio includes co-brand partnerships that bring in customers with high transaction frequency and correspondingly high servicing contact. Customers reach it through a modest branch network, a Cantonese-first hotline, internet and mobile banking, and card-specific service lines. As a mid-tier player it competes on product niches and service responsiveness rather than scale or technology spend.",
    strategicPressure: [
      { text: "Dah Sing runs a credit-card and personal-lending book that is large relative to the bank's overall size, concentrating servicing and collections workload in unsecured products.", kind: "inference" },
      { text: "Unsecured consumer credit in Hong Kong is sensitive to the interest-rate cycle and to weakness in retail and SME employment, making early-stage delinquency management a live operational concern.", kind: "inference" },
      { text: "Mid-tier Hong Kong banks face cost-to-income pressure from both the majors and the virtual banks, and servicing headcount is one of the few controllable lines.", kind: "inference" },
      { text: "Collections contact in Hong Kong is governed by conduct expectations on contact times, frequency and treatment of customers in difficulty, so any automated outreach must be policy-bounded from day one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Dah Sing has no publicly evident conversational-AI engineering capability and operates at a scale where a platform build could never be amortised. Its technology posture is to procure and configure, and its decision cycle is short enough that a packaged deployment with a defined pilot can be sponsored by a single business head.",
    whyNotBuild:
      "A bank of this size would need to hire speech, telephony, orchestration and evaluation specialists it does not have, to serve a customer base measured in the hundreds of thousands rather than millions. The economics never close. Buying a governed platform lets it match the majors' servicing experience on cards without a technology organisation.",
    workflows: [
      {
        name: "Pre-delinquency and early-bucket payment reminders",
        friction: "Reminder calls are made by a small team in working hours, reach a fraction of cardholders, and the offer made depends on which collector connects.",
        outcome: "Every at-risk account contacted within policy windows in Cantonese, with payment links in-channel and promises written back with automatic follow-up.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Cards management system", "Collections system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card servicing and transaction queries",
        friction: "Cardholders call for statement, limit, instalment-conversion and reward questions and wait in the same queue as complex cases.",
        outcome: "Routine card requests completed conversationally, including instalment-plan conversion within approved parameters.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Cards management system", "Core banking", "Rewards platform", "CRM"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Hardship and dispute triage to specialists",
        friction: "Customers in genuine difficulty are handled by whichever collector answers, with inconsistent documentation and no reliable audit trail.",
        outcome: "Vulnerability and dispute cues detected and routed to trained specialists with a full transcript, while routine cases stay automated.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Collections system", "Case management", "CRM", "Complaints register"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Internet and mobile banking with card statement and transaction self-service",
        "A Cantonese-first hotline with separate card and account service lines",
        "SMS and email reminder programmes for payment due dates",
        "A rewards and co-brand card programme with member-facing servicing",
      ],
      gaps: [
        "Payment reminders are one-way notifications, not conversations that can take a payment",
        "Instalment-plan conversion and limit requests still require an agent",
        "No consistent, auditable capture of hardship conversations",
        "No follow-up automation when a promise to pay is broken",
      ],
    },
    risks: [
      "Collections conduct expectations govern permitted contact windows, contact frequency and treatment of customers in financial difficulty; automated outreach must be provably bounded.",
      "PDPO consent rules constrain use of customer contact details for outbound messaging channels, especially WhatsApp.",
      "HKMA complaint-handling and record-keeping expectations require every automated collections conversation to be logged, retained and reviewable.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 5,
      automationRate: 0.55,
      basis: "Seller assumptions only — card servicing and collections contact volumes and fully loaded cost per contact require validation with the cards and collections leadership.",
    },
    pilotScope:
      "Automate pre-delinquency and early-bucket payment reminder conversations for the credit-card portfolio across voice and WhatsApp in Cantonese, with in-channel payment links, policy-bounded arrangements and immediate handoff on any hardship signal.",
    expansion: [
      "Extend into card servicing — statements, limits, instalment conversion, rewards — on the same identity layer",
      "Add personal-loan arrears outreach and hardship intake with specialist routing",
      "Add inbound retail banking deflection for balance, transaction and branch-appointment requests",
    ],
    stakeholders: [
      "Head of Personal Banking / Cards",
      "Head of Collections and Recoveries",
      "Head of Customer Service Operations",
      "Chief Information Officer",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "What are the current right-party-contact and promise-kept rates in early buckets, and how many accounts go uncontacted each cycle?",
      "Which arrangement options can be offered without a human credit decision, and where is the approval boundary?",
      "What contact-window and frequency rules does compliance apply to collections outreach today?",
      "How large is the card servicing hotline relative to collections, and who owns each budget?",
    ],
    flowTemplate: "collections",
    scenario: "A cardholder two days past due is reached on WhatsApp in Cantonese, converts the balance to an approved instalment plan, and pays in-channel without a collector ever dialling.",
  },

  "cmb-wing-lung": {
    operatingContext:
      "CMB Wing Lung Bank is the Hong Kong subsidiary of China Merchants Bank, combining a long-standing local retail franchise with a strategic role as the group's cross-boundary gateway for mainland customers moving money, opening accounts and holding wealth offshore. Its customer mix therefore spans Cantonese-speaking Hong Kong residents and Mandarin-speaking mainland clients who bank remotely and travel to Hong Kong for account opening and wealth transactions. Servicing runs through a branch network, a hotline, internet and mobile banking, and mainland-oriented messaging channels including WeChat. Cross-boundary products such as Wealth Management Connect and offshore account opening drive disproportionate query volume relative to account numbers.",
    strategicPressure: [
      { text: "CMB Wing Lung is China Merchants Bank's Hong Kong subsidiary and serves cross-boundary retail and wealth customers as a core part of its role in the group.", kind: "verified" },
      { text: "Cross-boundary schemes such as Wealth Management Connect create high-touch, rules-heavy conversations where eligibility, documentation and remittance limits differ on each side of the boundary.", kind: "inference" },
      { text: "The customer base is language-mixed by design, so a Cantonese-only or Mandarin-only servicing model structurally misfits a meaningful share of contacts.", kind: "inference" },
      { text: "Group-level technology direction from the mainland parent may not translate to Hong Kong regulatory and language requirements, creating a local procurement opening.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The Hong Kong subsidiary is small relative to the parent and does not run its own conversational-AI engineering. Where the parent has built mainland-facing service technology, that stack carries assumptions about regulation, language and channel mix that do not transfer to a Hong Kong-licensed entity, so the local unit is a credible independent buyer for Hong Kong-facing servicing.",
    whyNotBuild:
      "The subsidiary would have to build Cantonese and Mandarin speech, Hong Kong telephony integration, orchestration across a locally licensed core, and an evaluation regime aligned to HKMA supervision — none of which the mainland parent's platforms provide out of the box. Rebuilding all four for a single subsidiary is indefensible when a governed platform can be configured to the same controls.",
    workflows: [
      {
        name: "Cross-boundary account opening and eligibility guidance",
        friction: "Mainland clients call or message repeatedly to confirm document requirements, appointment availability and eligibility before travelling to Hong Kong, and get inconsistent answers.",
        outcome: "Grounded eligibility and document guidance in Mandarin or Cantonese, with a booked appointment and a confirmed checklist before the trip.",
        channels: ["Voice", "WeChat", "WhatsApp"],
        systems: ["Branch appointment scheduling", "KYC and onboarding platform", "CRM", "Product and policy knowledge base"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Remittance and cross-boundary transfer status",
        friction: "Customers cannot see where a cross-boundary transfer sits and call both the Hong Kong and mainland sides, each of which sees only its own leg.",
        outcome: "One conversation reads the Hong Kong-side state, explains the reason for delay, and pushes a proactive update on clearance.",
        channels: ["Voice", "WeChat"],
        systems: ["Payments and remittance systems", "Core banking", "CRM", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Wealth and deposit product servicing",
        friction: "Time-deposit rollovers, FX conversions and product maturity questions arrive by phone and consume relationship staff who should be advising.",
        outcome: "Rollover, rate and maturity queries resolved conversationally with execution inside approved parameters; suitability conversations reserved for licensed staff.",
        channels: ["Voice", "WeChat", "Mobile app"],
        systems: ["Core banking", "Wealth platform", "Treasury and FX rates", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Internet and mobile banking with cross-boundary remittance and deposit self-service",
        "A bilingual hotline covering Cantonese, Mandarin and English",
        "Mainland-facing messaging presence for customer communication",
        "Branch appointment booking for account opening and wealth transactions",
      ],
      gaps: [
        "Pre-travel eligibility and document guidance is not reliably self-service",
        "Cross-boundary transfer status cannot be traced conversationally",
        "No proactive updates on account-opening or remittance progress",
        "Language handling depends on which agent picks up rather than the system",
      ],
    },
    risks: [
      "Cross-boundary data-transfer restrictions under PDPO and mainland regulation constrain where conversation and customer data can be processed and stored.",
      "HKMA requirements on account opening, KYC and complaint handling apply to any automated guidance that could be construed as advice or eligibility determination.",
      "Parent-group technology mandates may override local procurement, so sponsorship must be validated early against Shenzhen or Beijing architecture direction.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions only — hotline and messaging volumes, cross-boundary query share and cost per contact must be validated with the Hong Kong retail banking team.",
    },
    pilotScope:
      "Automate cross-boundary account-opening guidance and appointment booking in Mandarin and Cantonese across voice and messaging, with document checklists confirmed pre-travel and escalation to branch staff for eligibility exceptions.",
    expansion: [
      "Add remittance and cross-boundary transfer status tracing with proactive clearance updates",
      "Extend to deposit and wealth product servicing including rollovers and rate queries",
      "Add general retail inbound deflection across the Hong Kong hotline",
    ],
    stakeholders: [
      "Head of Retail Banking, Hong Kong",
      "Head of Cross-boundary / Greater Bay Area Business",
      "Head of Customer Service and Contact Centre",
      "Chief Information Officer, Hong Kong",
      "Head of Compliance and Data Privacy",
    ],
    discovery: [
      "What share of inbound contacts relate to cross-boundary account opening, eligibility and document requirements?",
      "Can the Hong Kong entity select and contract customer-facing technology independently of the mainland parent?",
      "Where is conversation data permitted to be processed and stored given cross-boundary data rules?",
      "How many pre-booked branch appointments fail because the customer arrives without the right documents?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Shenzhen client asks on WeChat in Mandarin what she needs to open a Hong Kong account, receives a grounded checklist, and books a branch slot for her next crossing.",
  },

  "icbc-asia": {
    operatingContext:
      "ICBC (Asia) is the Hong Kong-incorporated flagship of Industrial and Commercial Bank of China, licensed and supervised locally, combining a retail and wealth franchise with corporate, syndicated-lending and cross-border corporate banking. Its retail customers include Hong Kong residents, mainland-linked individuals and cross-boundary business owners, so servicing spans Cantonese, Mandarin and English. Distribution runs through a branch network, a hotline, internet and mobile banking, and mainland-oriented messaging. Because it is a locally licensed entity, its customer-facing systems must satisfy HKMA requirements rather than simply inheriting parent-group platforms.",
    strategicPressure: [
      { text: "ICBC (Asia) is a Hong Kong-incorporated licensed bank subject to HKMA supervision, not a branch of the mainland parent, so customer-facing systems must meet local regulatory requirements.", kind: "verified" },
      { text: "Cantonese servicing is a persistent weak point for mainland-parented banks whose group platforms are built Mandarin-first, creating a language-quality gap against local incumbents.", kind: "inference" },
      { text: "Cross-border corporate and retail flows generate operational conversations — remittance status, documentation, account maintenance — that are high-frequency and low-value per contact.", kind: "inference" },
      { text: "Local procurement autonomy for customer-facing systems is likely but not certain, and group technology mandates could constrain vendor choice.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The parent group has enormous internal technology capacity, but the Hong Kong entity operates under a different regulator, a different language mix and a different channel estate. The realistic shape is a partner-delivered, locally deployed servicing layer that satisfies HKMA requirements and Cantonese quality expectations, integrated to local systems rather than the parent's.",
    whyNotBuild:
      "The Hong Kong entity has neither the mandate nor the engineering headcount to build speech, telephony, orchestration and evaluation locally, and the parent's platforms are not designed for Cantonese-first, HKMA-supervised servicing. Adapting a mainland stack would cost more in compliance and localisation work than deploying a governed platform configured for Hong Kong.",
    workflows: [
      {
        name: "Trilingual retail servicing on the Hong Kong hotline",
        friction: "Callers pick a language at the IVR then code-switch, and Cantonese quality varies with agent availability, producing long handle times and repeat calls.",
        outcome: "Natural trilingual handling with identity resolved once and balance, statement, card and transaction requests completed in-conversation.",
        channels: ["Voice", "WeChat", "Mobile app"],
        systems: ["Core banking", "Cards system", "IVR / contact centre platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cross-border remittance and documentation status",
        friction: "Corporate and retail customers chase remittance and documentation status by phone and email, and staff manually check payment and trade systems before replying.",
        outcome: "Live status answered in the conversation with the specific documentation gap named, and exceptions routed to the operations team with context.",
        channels: ["Voice", "Email", "WeChat"],
        systems: ["Payments and remittance systems", "Trade finance system", "CRM", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Wealth and deposit maturity servicing",
        friction: "Time-deposit maturities and rate queries cluster at month-end and overwhelm a small servicing team, with customers unable to renew outside branch hours.",
        outcome: "Maturity notifications and rollover execution handled conversationally within approved rate parameters, twenty-four hours a day.",
        channels: ["Voice", "Mobile app", "SMS"],
        systems: ["Core banking", "Treasury rate systems", "Wealth platform", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Internet and mobile banking for retail and corporate customers",
        "A multilingual hotline covering Cantonese, Mandarin and English",
        "Corporate banking relationship coverage with dedicated operations support",
        "Messaging presence oriented to mainland-linked customers",
      ],
      gaps: [
        "Consistent Cantonese-quality servicing independent of which agent answers",
        "Self-service remittance and trade documentation status",
        "Out-of-hours deposit rollover and rate servicing",
        "Unified context across phone, messaging and digital channels",
      ],
    },
    risks: [
      "HKMA outsourcing, operational-resilience and complaint-handling requirements apply to the locally incorporated entity regardless of parent-group arrangements.",
      "Cross-boundary data-transfer rules limit where Hong Kong customer conversation data may be processed, especially if any component sits in mainland infrastructure.",
      "Parent-group technology mandates may constrain vendor selection and lengthen the approval path.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 5,
      automationRate: 0.45,
      basis: "Seller assumptions only — contact volumes across retail and corporate servicing and cost per contact require validation with the Hong Kong operations team.",
    },
    pilotScope:
      "Deploy trilingual inbound servicing on the Hong Kong retail hotline covering balance, transaction, statement and card queries, with Cantonese quality as the explicit success criterion and escalation to agents for anything transactional beyond agreed limits.",
    expansion: [
      "Add cross-border remittance and documentation status for corporate and retail customers",
      "Add deposit maturity and rollover servicing with outbound notification",
      "Extend to corporate operations support with trade-document guidance",
    ],
    stakeholders: [
      "Head of Personal Banking and Wealth Management, ICBC (Asia)",
      "Head of Operations / Contact Centre",
      "Chief Information Officer, Hong Kong",
      "Head of Corporate Banking Operations",
      "Head of Compliance and Legal, Hong Kong",
    ],
    discovery: [
      "Does the Hong Kong entity have independent authority to select and contract customer-facing technology?",
      "How is Cantonese service quality measured today, and what is the current complaint pattern around language handling?",
      "What proportion of inbound contact is remittance and documentation status chasing?",
      "Where must customer conversation data reside to satisfy both HKMA and cross-boundary data requirements?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Hong Kong business owner asks in Cantonese why a cross-border payment is held, learns the exact missing document, and has it chased with operations before hanging up.",
  },

  "za-bank": {
    operatingContext:
      "ZA Bank is Hong Kong's largest virtual bank by customer numbers, licensed under the HKMA virtual-banking regime and majority-backed by ZhongAn, the mainland insurtech. It is app-only by design, with deposits, unsecured lending, insurance distribution, and a stated push into serving Web3 and startup clients alongside mass-market retail. Its service model is chat-first inside the app, with a small human team behind it and no branch network at all. Because every customer relationship is digital, the bank has unusually complete data on customer behaviour, but also no physical fallback when a customer needs to be talked through something.",
    strategicPressure: [
      { text: "ZA Bank operates under Hong Kong's virtual-banking licence regime as an app-only bank with no branches, so digital and remote channels are the entire service estate.", kind: "verified" },
      { text: "It is backed by ZhongAn, giving it inherited engineering capability and a strong internal bias toward building its own product surfaces.", kind: "verified" },
      { text: "Virtual banks in Hong Kong have faced sustained pressure to reach profitability, which puts cost-to-serve per account under permanent scrutiny as the customer base grows.", kind: "inference" },
      { text: "Regulatory expectations on complaint handling and fair treatment do not scale down for digital banks, so a chat-only service model creates exposure when customers need a voice conversation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. ZA Bank will build its in-app conversational experience itself and has the engineering culture to do it. The defensible opening is the capability it has deliberately never built: regulated voice servicing, complaint intake by phone, and outbound conversations for collections and verification, where a chat-native bank has neither telephony infrastructure nor a trained voice operation.",
    whyNotBuild:
      "Voice is a different discipline from chat: carrier integration, latency-tolerant speech in Cantonese with English code-switching, call recording and retention aligned to HKMA expectations, and voice-specific evaluation. A bank that has intentionally avoided phone channels will not stand up that stack for a volume it considers marginal, but it also cannot leave complaint and vulnerable-customer calls unhandled.",
    workflows: [
      {
        name: "Regulated voice and complaint intake line",
        friction: "Customers who cannot resolve an issue in app chat, or who need to complain formally, have no satisfactory voice route, and complaints escalate in tone before they are captured.",
        outcome: "A Cantonese-first voice line that takes structured complaint intake, resolves what it can, and routes the rest to the small human team with a complete record.",
        channels: ["Voice", "In-app chat"],
        systems: ["Core banking", "Complaints register", "CRM", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Unsecured lending payment reminders and arrears outreach",
        friction: "Push notifications and in-app messages are easy to ignore, and the bank has no scaled outbound conversation capability to reach borrowers who go quiet.",
        outcome: "Policy-bounded outbound conversations on voice and messaging that take payment in-channel and record arrangements with automatic follow-up.",
        channels: ["Voice", "WhatsApp", "Push"],
        systems: ["Lending system", "Collections", "Payment services", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Onboarding and verification recovery",
        friction: "Remote onboarding drop-off is invisible: a customer who fails identity verification simply disappears, with no conversation to recover them.",
        outcome: "Proactive outreach that diagnoses the specific verification failure and guides the customer through it, converting abandoned applications.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["eKYC and onboarding platform", "Identity verification services", "CRM", "Core banking"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An app-only banking experience with in-app chat as the primary service channel",
        "Digital account opening with remote identity verification",
        "Unsecured lending and deposit products serviced entirely in-app",
        "A small human support team behind the chat channel",
      ],
      gaps: [
        "No scaled voice channel for customers who need to talk to someone",
        "No outbound conversational capability for arrears or verification recovery",
        "Complaint intake outside the app is thin relative to regulatory expectations",
        "Customers who fail onboarding are rarely recovered through conversation",
      ],
    },
    risks: [
      "HKMA complaint-handling and fair-treatment expectations apply fully to virtual banks, including accessible channels for customers who cannot use the app.",
      "Collections conduct rules on contact windows and frequency apply to outbound lending outreach and must be enforced by the platform, not by policy documents.",
      "The bank's internal build bias means any proposal must be scoped narrowly to voice and outbound, not positioned as replacing its in-app assistant.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 4,
      automationRate: 0.5,
      basis: "Seller assumptions only — ZA Bank does not publish service volumes; chat, voice and outbound contact counts and cost per contact must be established in discovery.",
    },
    pilotScope:
      "Stand up a Cantonese-first voice and complaint intake line for customers who cannot resolve issues in app chat, integrated to the complaints register and core banking, with a defined handoff to the human support team.",
    expansion: [
      "Add outbound payment-reminder and arrears conversations for the unsecured lending book",
      "Add onboarding and verification recovery outreach for abandoned applications",
      "Extend to proactive servicing notifications with two-way conversation on the same channels",
    ],
    stakeholders: [
      "Chief Executive / Head of Retail Banking",
      "Head of Customer Experience and Operations",
      "Chief Technology Officer",
      "Head of Credit and Collections",
      "Head of Compliance and Regulatory Affairs",
    ],
    discovery: [
      "How do customers reach the bank today when in-app chat cannot resolve their issue?",
      "What is the current complaint volume and how is it captured outside the app?",
      "What outbound capability exists for arrears, and what share of the lending book goes uncontacted?",
      "Would the bank consider voice a channel to buy given its clear intent to build chat itself?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer locked out of the app after a failed verification calls a Cantonese voice line, gets the block explained and cleared, and never files the complaint she was about to make.",
  },

  "prudential-hk": {
    operatingContext:
      "Prudential Hong Kong is one of the territory's largest life insurers, distributing through a very large tied-agency force alongside bancassurance partnerships, with a product mix spanning savings and participating life, critical illness, medical and MPF-adjacent retirement products. A significant share of new business historically comes from mainland Chinese visitors buying Hong Kong-issued policies, which makes Mandarin servicing and cross-boundary contactability central rather than incidental. Policyholders reach the company through their agent first, then a customer hotline, a policyholder portal and app, and increasingly WeChat for mainland-based customers. The agency force itself is a second, equally demanding audience, generating constant queries about policy status, commission, underwriting progress and product rules.",
    strategicPressure: [
      { text: "Prudential is one of the largest life insurers in Hong Kong and distributes primarily through a very large tied-agency force plus bancassurance partnerships.", kind: "verified" },
      { text: "Mainland Chinese visitor business is a material driver of Hong Kong life new business, making Mandarin-language servicing and cross-boundary contactability a structural requirement.", kind: "verified" },
      { text: "Agent support consumes head-office servicing capacity that competes directly with policyholder servicing, so both queues degrade at the same time during peak sales periods.", kind: "inference" },
      { text: "Regional CX modernisation in the group is likely to be run as a partner-delivered programme rather than an in-house build, but Hong Kong BU autonomy over servicing platforms needs validating.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Prudential runs regional technology programmes and has digital capability, but life insurers of this shape consistently deliver customer-servicing platforms through partners and systems integrators rather than building speech and orchestration internally. The Hong Kong business unit is large enough to sponsor a market deployment inside a regional architecture.",
    whyNotBuild:
      "An insurer's engineering priorities are policy administration, underwriting and distribution technology. Building Cantonese and Mandarin speech, telephony integration into an existing hotline estate, orchestration across policy admin and agency systems, and conduct-grade conversation evaluation would divert scarce capacity from the platforms that actually differentiate the business.",
    workflows: [
      {
        name: "Policyholder servicing and premium reminders",
        friction: "Policyholders call the hotline or chase their agent for premium due dates, payment methods, policy values and beneficiary changes, and agents relay questions to head office.",
        outcome: "Routine policy servicing completed conversationally in three languages, with premium payment links in-channel and lapse-risk outreach before the grace period ends.",
        channels: ["Voice", "WhatsApp", "WeChat"],
        systems: ["Policy administration system", "Payment services", "CRM", "Customer portal"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Agency-force support desk",
        friction: "Agents call head office for underwriting status, commission queries, product rules and submission requirements, creating an internal queue that peaks exactly when sales peak.",
        outcome: "Agents get grounded, instant answers on submission status and product rules through a conversational desk, with exceptions routed to specialists.",
        channels: ["Voice", "WhatsApp", "Agent portal"],
        systems: ["Underwriting system", "Agency and commission platform", "Product knowledge base", "Policy administration"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Mainland-visitor policy servicing in Mandarin",
        friction: "Policyholders based across the boundary struggle to reach Hong Kong servicing during local hours and cannot easily complete changes remotely.",
        outcome: "Mandarin servicing on messaging channels the customer already uses, handling premium, contact-detail and document requests with clear escalation for regulated changes.",
        channels: ["WeChat", "Voice", "WhatsApp"],
        systems: ["Policy administration system", "Document management", "CRM", "Payment services"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A policyholder portal and mobile app for policy details, statements and selected changes",
        "A trilingual customer hotline supporting Cantonese, Mandarin and English",
        "An agent portal and agency support function for submissions and commission",
        "Digital claims submission for medical and selected benefit types",
      ],
      gaps: [
        "Premium reminders are notifications rather than conversations that can take payment",
        "Agents cannot get underwriting and submission status without a call to head office",
        "Mainland-based policyholders have no reliable remote servicing route outside business hours",
        "Beneficiary and contact changes still require paper or branch-equivalent processes",
      ],
    },
    risks: [
      "Insurance Authority conduct rules govern what constitutes advice; an automated agent must handle servicing without straying into product recommendation.",
      "PDPO and cross-boundary data rules constrain how mainland-based policyholder conversations are processed, especially over WeChat.",
      "Agency-channel politics: agents may resist any capability perceived as disintermediating their client relationship, so positioning must be agent-supporting.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions only — combined policyholder and agency-support contact volume and fully loaded cost per contact require validation with Hong Kong operations and distribution leadership.",
    },
    pilotScope:
      "Automate policyholder premium and policy-servicing conversations across voice, WhatsApp and WeChat in Cantonese, Mandarin and English, integrated to policy administration and payments, with strict escalation on anything that could constitute advice.",
    expansion: [
      "Add the agency support desk covering underwriting status, submission requirements and commission queries",
      "Extend to claims-status communication and document chasing for medical and critical-illness claims",
      "Add proactive lapse-prevention outreach ahead of grace-period expiry",
    ],
    stakeholders: [
      "Chief Executive Officer, Hong Kong",
      "Chief Customer / Operations Officer, Hong Kong",
      "Chief Agency Officer / Head of Distribution",
      "Chief Information Officer, Hong Kong",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "What is the split of head-office contact volume between policyholders and the agency force?",
      "Does the Hong Kong business unit control servicing-platform selection, or does the regional hub?",
      "How are mainland-based policyholders served today, and on which channels?",
      "Where exactly is the conduct boundary between servicing and advice for an automated agent?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A policyholder in Shenzhen asks on WeChat in Mandarin about a premium due date, pays in-channel, and updates her contact details without waiting for her Hong Kong agent.",
  },

  "fwd-group": {
    operatingContext:
      "FWD Group is a Hong Kong-headquartered pan-Asian insurer, backed by Richard Li's Pacific Century group, operating across roughly ten Asian markets with life, medical and general insurance products and an explicitly digital-first brand positioning built around changing how people feel about insurance. Its Hong Kong business is a core market, distributing through agency, bancassurance, brokers and direct digital channels, with medical and critical-illness products that generate frequent claims contact. FWD has grown substantially by acquisition across Asia, which leaves it with heterogeneous policy-administration and servicing estates by market rather than one global platform. Its brand promise sets a service expectation that a conventional insurer contact centre struggles to meet.",
    strategicPressure: [
      { text: "FWD is headquartered in Hong Kong, operates across roughly ten Asian markets, and positions itself publicly as a digital-first insurer aiming to change how people feel about insurance.", kind: "verified" },
      { text: "The group grew substantially through acquisition, leaving market-by-market policy and servicing systems that make a single, uniform claims experience hard to deliver without an orchestration layer.", kind: "inference" },
      { text: "A brand built on customer experience creates asymmetric downside when claims servicing feels ordinary, so claims communications carry brand risk beyond their cost.", kind: "inference" },
      { text: "Post-listing scrutiny of expense ratios and growth quality increases pressure to show servicing cost leverage as the in-force book grows across markets.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. FWD invests in digital product and distribution, but its consistent pattern is to partner with technology vendors for platform capability rather than to build core infrastructure. A multi-market group with heterogeneous back ends needs an orchestration and conversation layer that can front different policy systems — precisely what a partner delivers and an internal team would struggle to standardise.",
    whyNotBuild:
      "Building would mean speech models per market language, telephony integration per country carrier estate, orchestration across acquired policy-administration systems, and an evaluation regime that satisfies ten regulators. FWD's engineering is rightly focused on distribution and product; reproducing a communications platform ten times over is the definition of undifferentiated heavy lifting.",
    workflows: [
      {
        name: "Claims FNOL intake with in-conversation document capture",
        friction: "First notification of loss arrives by phone or email, documents bounce on format, and claimants discover requirements only after a rejection days later.",
        outcome: "Structured FNOL in any channel with photos and documents validated in-flow, coverage checked against the policy, and a case opened with a complete file.",
        channels: ["WhatsApp", "Voice", "Mobile app"],
        systems: ["Claims management system", "Policy administration", "Document management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Proactive claims-status communication",
        friction: "Status calls dominate inbound claims volume because claimants have no visibility between lodgement and settlement.",
        outcome: "Every stage change pushed to the claimant in their language and channel, suppressing status calls and improving the brand moment that matters most.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Claims management system", "Notification services", "CRM", "Payments"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Medical pre-authorisation and network guidance",
        friction: "Members call before hospital admission to confirm coverage, network status and pre-authorisation, and the answer depends on which agent picks up.",
        outcome: "Consistent, grounded coverage and network answers with pre-authorisation initiated conversationally and clinical decisions retained by humans.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration", "Provider network database", "Pre-authorisation workflow", "Claims system"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer mobile app and portal for policy details and claims submission",
        "Digital claims lodgement for selected medical and personal-accident benefits",
        "Multi-channel contact centres per market including Hong Kong",
        "Agency, bancassurance and direct digital distribution with supporting service teams",
      ],
      gaps: [
        "Claims status is pull-based rather than proactively pushed to claimants",
        "Document requirements are discovered after rejection rather than validated at intake",
        "Pre-authorisation and network coverage answers vary by agent",
        "No single conversational layer spanning markets with different back-end systems",
      ],
    },
    risks: [
      "Insurance Authority conduct rules in Hong Kong constrain what an automated agent may say about coverage without straying into advice or a coverage determination.",
      "Multi-market operation means each deployment must satisfy a different privacy and insurance regulator, so the platform's governance and data-residency model is a selection criterion, not a detail.",
      "Claims are emotionally sensitive and brand-defining; a poor automated interaction at FNOL causes disproportionate reputational damage for a CX-positioned insurer.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 5,
      automationRate: 0.55,
      basis: "Seller assumptions only — group and Hong Kong claims and servicing contact volumes and cost per contact must be validated with FWD operations before any business case is used externally.",
    },
    pilotScope:
      "Deploy claims FNOL intake and proactive claims-status communication for the Hong Kong medical and personal-accident book across WhatsApp and voice in Cantonese, English and Mandarin, with document validation in-flow and all assessment decisions retained by human adjusters.",
    expansion: [
      "Add medical pre-authorisation and provider-network guidance on the same conversational layer",
      "Extend the claims pattern to a second market with a different policy-administration back end",
      "Add policy servicing and premium-payment conversations for the in-force Hong Kong book",
    ],
    stakeholders: [
      "Group Chief Operations Officer",
      "Chief Executive Officer, FWD Hong Kong",
      "Group Head of Claims",
      "Group Chief Technology / Digital Officer",
      "Head of Compliance and Conduct, Hong Kong",
    ],
    discovery: [
      "What share of claims inbound volume is status chasing rather than new information?",
      "How many claims are delayed by document rework that could have been caught at intake?",
      "Which market's policy-administration system would be the reference integration for a multi-market rollout?",
      "Which digital-claims vendors are already incumbent, and what are their contract horizons?",
    ],
    flowTemplate: "claims",
    scenario: "A member lodges a hospital claim on WhatsApp with photos validated in-chat, then receives a status update at every stage until the settlement lands.",
  },

  "sun-life-hk": {
    operatingContext:
      "Sun Life Hong Kong is a life insurer and one of the market's Mandatory Provident Fund scheme providers, serving both individual policyholders and a large base of MPF members whose accounts follow them across employers. MPF membership means the servicing relationship is compulsory and lifelong, generating account-balance, contribution, employer-change and scheme-transfer queries at a frequency unrelated to policy sales. The industry-wide eMPF Platform transition is restructuring how scheme administration works across all providers, which changes member expectations and query patterns during the migration. Members reach the company through a hotline, a member portal, and paper-based forms that still underpin many transfer processes.",
    strategicPressure: [
      { text: "Sun Life is an MPF scheme provider in Hong Kong, so it carries a compulsory, lifelong servicing relationship with members independent of insurance sales.", kind: "verified" },
      { text: "The industry-wide eMPF Platform is consolidating MPF scheme administration across providers, which changes member servicing volumes and ownership during and after migration.", kind: "verified" },
      { text: "MPF queries cluster around employment changes and consolidation of dormant accounts, producing repetitive, rules-based conversations ideal for automation but currently absorbed by human agents.", kind: "inference" },
      { text: "As administration migrates to a central platform, providers will compete on member experience and advice rather than administration, raising the value of a strong servicing conversation layer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The Hong Kong unit does not run a conversational-AI engineering function, and MPF member servicing is commodity contact-centre work where no advantage accrues from owning the technology. With administration itself migrating to a central industry platform, investing engineering capital in a servicing build would be doubly hard to justify.",
    whyNotBuild:
      "The unit would have to assemble Cantonese speech, telephony, orchestration across policy and MPF administration, and conduct-grade evaluation for a member base it services under compulsion rather than competition. Every one of those is available as a configured product, and the eMPF transition makes internal build timing worse, not better.",
    workflows: [
      {
        name: "MPF member account and contribution servicing",
        friction: "Members call to ask about balances, contribution records and employer changes, and agents read the same answers from the administration system all day.",
        outcome: "Balance, contribution history and employer-change queries answered conversationally in Cantonese with identity resolved once.",
        channels: ["Voice", "WhatsApp", "Member portal"],
        systems: ["MPF scheme administration", "Member records", "CRM", "Authentication services"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Scheme transfer and eMPF migration guidance",
        friction: "Transfers and consolidations involve forms, employer confirmation and long waits, and members call repeatedly for status during the migration period.",
        outcome: "Guided transfer initiation with document requirements confirmed up front and proactive status pushed at each stage, suppressing repeat calls.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["MPF scheme administration", "Document management", "Case management", "eMPF interface"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Life policy servicing and premium reminders",
        friction: "Policyholders chase premium due dates, payment methods and policy values by phone, in the same queue as MPF members with entirely different needs.",
        outcome: "Policy servicing separated and automated with payment in-channel, freeing agents for MPF transfer complexity and retirement conversations.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Payment services", "CRM", "Customer portal"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An MPF member portal with balance and contribution self-service",
        "A Cantonese-first member and policyholder hotline",
        "Employer-facing scheme administration channels for contribution submission",
        "A life-insurance policyholder servicing function with digital forms for selected changes",
      ],
      gaps: [
        "Scheme transfers and consolidations cannot be initiated and tracked conversationally",
        "No proactive status updates during multi-week transfer processes",
        "Members and policyholders share one queue despite entirely different needs",
        "Dormant-account consolidation outreach is not conversational",
      ],
    },
    risks: [
      "MPFA rules govern member communications, scheme transfers and what constitutes investment advice; an automated agent must stay strictly on administration.",
      "The eMPF Platform migration reassigns administration responsibilities and data flows, so integration design must anticipate a moving target.",
      "PDPO obligations apply to member data used in conversation logging and model tuning, with additional sensitivity for employment-linked records.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions only — MPF member and policyholder contact volumes and cost per contact must be validated with the Hong Kong operations team, including eMPF transition effects.",
    },
    pilotScope:
      "Automate MPF member balance, contribution and employer-change queries on the Cantonese hotline and WhatsApp, with identity resolved once and full escalation for any question touching investment choice or advice.",
    expansion: [
      "Add scheme-transfer initiation and proactive status during the eMPF migration window",
      "Extend to life policy servicing and premium payment conversations",
      "Add outbound dormant-account consolidation and retirement-readiness outreach",
    ],
    stakeholders: [
      "Chief Executive Officer, Sun Life Hong Kong",
      "Head of Pensions / MPF Business",
      "Head of Customer Service Operations",
      "Chief Information Officer, Hong Kong",
      "Head of Compliance and Regulatory Affairs",
    ],
    discovery: [
      "What share of hotline volume is MPF balance and contribution queries versus transfers and complex cases?",
      "How will the eMPF migration change which queries members bring to Sun Life versus the central platform?",
      "How long does a scheme transfer take end-to-end today, and how many status calls does each generate?",
      "Where is the line between MPF administration answers and regulated investment advice for an automated agent?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A member who changed jobs asks in Cantonese where her old MPF account sits, starts a consolidation, and gets pushed updates until it completes.",
  },

  "axa-hk": {
    operatingContext:
      "AXA Hong Kong is a composite insurer spanning life and savings, medical and health, and general lines including motor, home and employees' compensation, distributed through tied agents, brokers, bancassurance and direct channels. Its medical portfolio makes it a heavy transactor with hospitals and clinics, generating pre-authorisation requests, claims submissions and network-coverage questions that recur monthly for the same members. The general-insurance side adds motor claims with third-party coordination, repairer scheduling and total-loss conversations. Members contact the company through a hotline, an app and portal, and their agent or broker, with document-heavy processes still underpinning many claims.",
    strategicPressure: [
      { text: "AXA Hong Kong is a composite insurer operating across life, health and general lines, which means it runs several structurally different claims and servicing operations in one market.", kind: "verified" },
      { text: "Medical inflation and rising claims frequency in Hong Kong private healthcare increase both claims volume and the number of pre-authorisation conversations per member per year.", kind: "inference" },
      { text: "Voluntary Health Insurance Scheme products have standardised parts of the medical market, raising member expectations for clear, consistent coverage answers across insurers.", kind: "inference" },
      { text: "AXA group operates global vendor governance for customer technology, so local deployment likely requires alignment to an approved panel or architecture.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. AXA has group-level digital and data capability but procures customer-contact platforms through global vendor arrangements delivered locally. The Hong Kong entity is large enough to sponsor a market deployment and owns the claims and servicing operation, but vendor selection will be shaped by group panel requirements rather than a local greenfield choice.",
    whyNotBuild:
      "Building would require trilingual speech tuned for medical terminology, telephony integration into an existing hotline estate, orchestration across separate life, health and general claims systems, and evaluation that satisfies Insurance Authority conduct expectations. AXA's own technology investment is directed at underwriting, pricing and health-services capability, not at reproducing a conversation platform for one market.",
    workflows: [
      {
        name: "Medical pre-authorisation and coverage confirmation",
        friction: "Members and hospital admissions staff call before procedures to confirm coverage and get pre-authorisation, and answers vary with the agent and the time of day.",
        outcome: "Consistent, grounded coverage and network answers with pre-authorisation initiated in-conversation and clinical judgement retained by medical staff.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Health policy administration", "Pre-authorisation workflow", "Provider network database", "Claims system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Claims-status and document chasing across lines",
        friction: "Claimants call weekly for status across medical, motor and life claims, and each line has a different system so agents answer at different levels of detail.",
        outcome: "Proactive status pushed per stage across all lines from one conversational layer, with missing documents named and collected in-channel.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Claims management systems", "Document management", "CRM", "Notification services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Motor claims first notification and repairer coordination",
        friction: "Motor FNOL is taken by phone with variable detail capture, then repairer booking and assessment scheduling generate multiple further calls.",
        outcome: "Structured FNOL with photos captured in-chat, repairer options offered from the approved network, and appointments booked in the same conversation.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Motor claims system", "Repairer network platform", "Policy administration", "Assessment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and portal covering policy details and claims submission across lines",
        "A trilingual customer hotline with separate health, life and general service lines",
        "Digital medical-claims submission with photo upload for eligible benefits",
        "An agent and broker servicing function supporting intermediated distribution",
      ],
      gaps: [
        "Pre-authorisation answers are not consistent or available outside business hours",
        "Claims status is pull-based, so status calls remain the dominant inbound driver",
        "Document requirements are discovered after submission failure rather than at intake",
        "Members with policies across lines are treated as separate customers by each queue",
      ],
    },
    risks: [
      "Insurance Authority conduct rules limit what an automated agent may state about coverage; a coverage confirmation is materially different from a coverage opinion.",
      "Medical conversations involve sensitive personal data under PDPO, requiring strict retention, access control and purpose limitation on transcripts.",
      "Group vendor governance may constrain platform choice and extend the approval timeline beyond a local sponsor's control.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions only — contact volumes across health, life and general servicing and cost per contact must be validated with AXA Hong Kong operations.",
    },
    pilotScope:
      "Automate medical claims-status communication and document chasing for the Hong Kong health book across WhatsApp and voice in three languages, with proactive stage updates and human retention of all assessment decisions.",
    expansion: [
      "Add pre-authorisation initiation and provider-network guidance for medical members",
      "Extend to motor FNOL with in-chat photo capture and repairer booking",
      "Add life and savings policy servicing including premium and beneficiary requests",
    ],
    stakeholders: [
      "Chief Executive Officer, AXA Hong Kong",
      "Chief Operations Officer / Head of Claims",
      "Head of Health Business",
      "Chief Information / Digital Officer, Hong Kong",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "What share of health-line inbound volume is claims-status chasing versus new claims and pre-authorisation?",
      "How consistent are pre-authorisation answers today, and is that measured?",
      "Does AXA group vendor governance require selection from an approved panel for conversational AI?",
      "Are members with policies across life, health and general lines served by one team or three?",
    ],
    flowTemplate: "claims",
    scenario: "A member books a day surgery, gets pre-authorisation confirmed on WhatsApp in Cantonese, and receives claim updates through to settlement without calling once.",
  },

  "bupa-hk": {
    operatingContext:
      "Bupa Hong Kong is a leading health insurer serving individual members and a large corporate-scheme book, closely coupled to its sister primary-care network Quality HealthCare, which gives the group both the payer and a substantial provider footprint in the same market. Members generate constant contact about scheme eligibility, network clinic access, pre-authorisation for procedures, and claims reimbursement status, and corporate HR administrators generate a parallel stream about scheme rules and member enrolment. Contact runs through a member hotline, a member app and portal, and email, with clinic bookings often flowing through the provider network's own channels. Because health servicing is protocol-driven and repetitive, the same handful of questions recur across a very large member base.",
    strategicPressure: [
      { text: "Bupa Hong Kong operates as a health insurer alongside the Quality HealthCare clinic network, giving the group both payer and provider roles in the same market.", kind: "verified" },
      { text: "Corporate health schemes mean two distinct audiences — members and HR administrators — with different questions hitting the same servicing operation.", kind: "inference" },
      { text: "Medical cost inflation in Hong Kong private healthcare raises both claims volume and the intensity of eligibility and pre-authorisation checking per episode of care.", kind: "inference" },
      { text: "Global Bupa digital-health commitments may overlap with local servicing plans, so local platform latitude needs validating before a deployment is scoped.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The Hong Kong business runs an operations-led servicing model without an in-house conversational engineering team, and health servicing is protocol-driven work where the value is in configuration and integration, not in owning the technology. The payer-provider adjacency makes a single conversational layer unusually valuable, which strengthens the buy case rather than the build case.",
    whyNotBuild:
      "Bupa Hong Kong would have to build trilingual speech with medical vocabulary, telephony into an existing hotline, orchestration across policy, claims, provider-network and clinic-scheduling systems, and per-interaction evaluation for a regulated health context. That is four specialist capabilities for a single market business whose competitive edge is its network and its clinical proposition.",
    workflows: [
      {
        name: "Member eligibility and pre-authorisation checks",
        friction: "Members call before appointments to confirm what their scheme covers, and agents look up scheme documents manually, giving answers that vary by agent.",
        outcome: "Grounded, scheme-specific eligibility answers with pre-authorisation started in-conversation and clinical decisions escalated to medical staff.",
        channels: ["Voice", "WhatsApp", "Member app"],
        systems: ["Policy and scheme administration", "Pre-authorisation workflow", "Provider network database", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Claims reimbursement status and document collection",
        friction: "Reimbursement claims stall on missing or unreadable receipts and members only learn after a rejection, then call for status weekly.",
        outcome: "Documents validated at intake, gaps named specifically, and status pushed proactively at each stage until payment.",
        channels: ["WhatsApp", "Voice", "Member app"],
        systems: ["Claims management system", "Document management", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Corporate scheme administrator support",
        friction: "HR administrators email or call about enrolment, member changes and scheme rules, and responses take days during renewal season.",
        outcome: "Administrator queries answered conversationally with grounded scheme rules and enrolment changes actioned within permission limits.",
        channels: ["Voice", "Email", "Web chat"],
        systems: ["Scheme administration", "Member enrolment", "CRM", "Document management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A member app and portal with policy, claims-submission and network-clinic lookup",
        "A trilingual member hotline covering individual and corporate scheme members",
        "Digital claims submission with receipt upload for outpatient reimbursement",
        "An affiliated clinic network with its own booking and patient channels",
      ],
      gaps: [
        "Eligibility answers depend on which agent reads which scheme document",
        "Reimbursement rejections are discovered after submission rather than prevented at intake",
        "Corporate HR administrators have no fast, self-service route for scheme queries",
        "Insurance servicing and clinic booking remain separate journeys for the same member",
      ],
    },
    risks: [
      "Health conversations carry sensitive personal data under PDPO, with strict expectations on consent, retention and access to transcripts.",
      "An automated agent must confirm coverage from scheme documents without offering clinical guidance or an assessment decision.",
      "Bupa global digital-health programmes may already commit the local unit to a platform direction that constrains procurement.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 5,
      automationRate: 0.55,
      basis: "Seller assumptions only — member and corporate-administrator contact volumes and cost per contact require validation with Bupa Hong Kong operations leadership.",
    },
    pilotScope:
      "Automate member eligibility and claims-status conversations for the individual health book across voice and WhatsApp in three languages, with document validation at intake and escalation to clinical staff for any medical judgement.",
    expansion: [
      "Add pre-authorisation initiation and provider-network guidance for procedures",
      "Add corporate scheme administrator support covering enrolment and scheme rules",
      "Link to the affiliated clinic network so eligibility and appointment booking happen in one conversation",
    ],
    stakeholders: [
      "Chief Executive Officer, Bupa Hong Kong",
      "Chief Operations Officer / Head of Customer Service",
      "Head of Corporate Business",
      "Chief Information Officer, Hong Kong",
      "Head of Clinical Governance and Compliance",
    ],
    discovery: [
      "What proportion of member calls are eligibility questions answerable from scheme documents?",
      "How many reimbursement claims are rejected or delayed for document reasons, and what does the rework cost?",
      "Does Bupa global already commit Hong Kong to a conversational or digital-health platform?",
      "Could a single conversation span insurance eligibility and a Quality HealthCare booking, or are the data boundaries hard?",
    ],
    flowTemplate: "claims",
    scenario: "A member checks on WhatsApp whether her scheme covers a specialist consultation, gets pre-authorisation started, and later receives reimbursement updates without a single call.",
  },

  "blue-cross-hk": {
    operatingContext:
      "Blue Cross (Asia-Pacific) Insurance is a Hong Kong general insurer best known for medical, travel and personal-accident products, distributed heavily through bancassurance, brokers and direct digital channels, and now under AIA ownership. Travel insurance gives it a strongly seasonal claims profile that spikes around holiday periods, typhoon disruptions and airline events, while medical products generate steady outpatient reimbursement volume. Claims are document-heavy — receipts, medical certificates, boarding passes, police reports — and intake quality determines whether a claim settles in days or weeks. Customers contact it through a hotline, a claims portal and email, with a lean service organisation relative to claim volumes at peak.",
    strategicPressure: [
      { text: "Blue Cross is a Hong Kong medical and travel insurer that came under AIA ownership, which may progressively align its platforms to group standards.", kind: "verified" },
      { text: "Travel claims are highly seasonal and event-driven — typhoon season, holiday peaks and airline disruptions produce claim surges a lean team cannot staff for.", kind: "inference" },
      { text: "Travel and outpatient claims are low-value and document-heavy, so cost per claim handled is the decisive economics, not claim size.", kind: "inference" },
      { text: "AIA group integration could either accelerate a servicing investment or freeze local procurement pending group platform decisions.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A compact general insurer with a lean operations team has no realistic path to building conversational infrastructure, and its claim economics reward automation of intake and status above all. The complicating factor is ownership: group alignment may route the decision upward, which is the primary qualification question.",
    whyNotBuild:
      "The company's entire technology function is smaller than the team required to build and maintain speech, telephony, orchestration and evaluation. Its claims are high-volume and low-value, so any build cost is amortised across small premiums — the arithmetic never supports it.",
    workflows: [
      {
        name: "Travel claims FNOL with in-chat document collection",
        friction: "Travel claimants submit partial documentation by email, get rejected on format or missing items, and resubmit repeatedly over weeks.",
        outcome: "Guided intake that names every required document, validates uploads in-chat, and opens a complete claim file at first contact.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Claims management system", "Document management", "Policy administration", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Event-driven claims surge handling",
        friction: "A typhoon or airline disruption produces a claim spike that melts the hotline for days, and the same explanation is given hundreds of times.",
        outcome: "Elastic conversational capacity absorbs the surge, with event-specific guidance delivered consistently and complex cases queued for humans.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Policy administration", "Notification services", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Medical reimbursement status and payment confirmation",
        friction: "Outpatient claimants call for status because they cannot see where their reimbursement sits, and payment arrives with no notification.",
        outcome: "Stage-by-stage proactive updates through to payment confirmation, removing the dominant driver of routine inbound calls.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Claims management system", "Payments", "CRM", "Notification services"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "An online claims submission portal with document upload",
        "A Cantonese-first customer and claims hotline",
        "Bancassurance and broker distribution with supporting service processes",
        "Email-based claims correspondence and document exchange",
      ],
      gaps: [
        "Document requirements are not validated at intake, so rework dominates cycle time",
        "No elastic capacity when a weather or airline event spikes claim volume",
        "Claim status is not pushed, so claimants call repeatedly",
        "No conversational channel on the messaging apps customers actually use while travelling",
      ],
    },
    risks: [
      "Insurance Authority conduct expectations apply to claims communications, including clarity on what is and is not covered.",
      "PDPO obligations govern medical documents and travel records collected in conversation, requiring strict retention and access controls.",
      "AIA group ownership may relocate the platform decision to group level, so local sponsorship alone will not close a deal.",
    ],
    economics: {
      volumeMonthly: 70000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions only — claims and servicing contact volumes, seasonal peaks and cost per contact must be validated with Blue Cross operations.",
    },
    pilotScope:
      "Automate travel-claims FNOL and document collection on WhatsApp and voice in Cantonese and English, validating every required document at intake and pushing status through to settlement.",
    expansion: [
      "Add medical reimbursement status and payment confirmation on the same layer",
      "Add event-driven surge playbooks for typhoon and airline-disruption claim spikes",
      "Extend to policy servicing and renewal conversations for the direct book",
    ],
    stakeholders: [
      "Chief Executive Officer / General Manager",
      "Head of Claims Operations",
      "Head of Customer Service",
      "Head of Information Technology",
      "Head of Compliance",
    ],
    discovery: [
      "What share of travel claims require at least one document resubmission, and what does that add to cycle time?",
      "What does hotline volume look like during a typhoon week versus a normal week?",
      "Has AIA group ownership changed who approves customer-technology procurement?",
      "Which claim types could be settled straight-through if intake were complete and validated?",
    ],
    flowTemplate: "claims",
    scenario: "A traveller stranded by a cancelled flight lodges a claim on WhatsApp from the airport, uploads the boarding pass and airline notice in-chat, and gets a complete file opened immediately.",
  },

  "as-watson": {
    operatingContext:
      "AS Watson Group, part of CK Hutchison and headquartered in Hong Kong, is the world's largest international health-and-beauty retailer, operating the Watsons banner across Asia and Europe alongside other retail formats, with a very large loyalty membership base and a publicly stated O+O — offline plus online — strategy that treats stores and digital as one channel. In Hong Kong the Watsons banner combines high-street pharmacy and beauty retail with e-commerce, click-and-collect and a members programme that drives repeat purchase. Customer contact is dominated by order and delivery questions, loyalty points and voucher problems, product availability, and pharmacy-adjacent enquiries. The group's technology posture is built around a central digital and eLab capability that partners with vendors rather than building retail platforms from scratch.",
    strategicPressure: [
      { text: "AS Watson is the world's largest international health-and-beauty retailer, headquartered in Hong Kong under CK Hutchison, and publicly promotes an O+O offline-plus-online strategy.", kind: "verified" },
      { text: "The group operates a very large loyalty membership base across markets, making points, vouchers and member benefits a top driver of customer contact.", kind: "verified" },
      { text: "O+O means every promotion and voucher works across store and online, which multiplies the edge cases customers cannot resolve themselves and pushes them to contact channels.", kind: "inference" },
      { text: "A multi-market group structure means CX platform decisions may sit with group digital rather than the Hong Kong banner, changing who the buyer is.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. AS Watson invests in group digital capability and runs its own e-commerce and loyalty platforms, but its pattern is to select and configure vendor technology through a central digital function rather than to build conversational infrastructure. The group scale supports a serious deployment and a multi-market expansion path, but selection will run through group digital governance.",
    whyNotBuild:
      "Retail engineering capacity goes to commerce, supply chain and loyalty personalisation, which are the actual competitive levers. Speech in Cantonese, Mandarin and English, telephony and messaging orchestration, live integration into order-management and loyalty systems, and conversation evaluation are a permanent maintenance burden with no retail differentiation attached.",
    workflows: [
      {
        name: "Order, delivery and click-and-collect exceptions",
        friction: "Customers chase late or partial orders through a chatbot that repeats the tracking page, then queue for an agent who checks the order and courier systems by hand.",
        outcome: "Live order and courier truth in-conversation, with redelivery, address correction or refund executed inside policy and proactive alerts before the customer asks.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Order management system", "Courier and last-mile tracking", "Payments and refunds", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loyalty points, vouchers and member benefits",
        friction: "Points not credited, vouchers rejected at the till, and tier-benefit confusion generate high-volume, low-value contacts that agents resolve one at a time.",
        outcome: "Member identity resolved instantly, points and voucher state read live, and corrections applied within approved limits in the conversation.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Loyalty platform", "POS and transaction records", "Promotions engine", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Product availability and store enquiry deflection",
        friction: "Customers call individual stores to ask whether an item is in stock, interrupting store staff during trading hours with no record of the demand.",
        outcome: "Stock and store enquiries answered centrally from inventory data, with click-and-collect reservation offered in the same conversation.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Inventory management", "Store systems", "E-commerce platform", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large multi-market loyalty membership programme with member pricing and vouchers",
        "E-commerce and app channels with click-and-collect fulfilment",
        "Web and app chat support with automated FAQ handling",
        "Store-level customer service across a dense Hong Kong retail network",
      ],
      gaps: [
        "Order and courier exceptions cannot be fixed in the conversation where they are raised",
        "Loyalty point and voucher corrections require an agent with system access",
        "No proactive notification when a delivery is at risk",
        "Store stock questions land on store staff rather than a central channel",
      ],
    },
    risks: [
      "PDPO obligations govern loyalty data and marketing consent, and any outbound conversation must respect the opt-in basis on which member contact details were collected.",
      "Pharmacy-adjacent enquiries must never be answered as clinical or medicine advice; the boundary needs explicit design and escalation.",
      "Group versus banner decision rights could stall a Hong Kong-sponsored deployment, so the contracting vehicle must be established early.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 4,
      automationRate: 0.65,
      basis: "Seller assumptions only — Hong Kong banner contact volumes across chat, phone and messaging and cost per contact must be validated with the group digital and market CX teams.",
    },
    pilotScope:
      "Automate Watsons Hong Kong order, delivery and click-and-collect exception handling plus loyalty points and voucher queries across WhatsApp, web chat and voice in three languages, with refunds and goodwill bounded by an approved matrix.",
    expansion: [
      "Add proactive delivery-exception outreach before customers make contact",
      "Add product availability and store reservation to remove enquiry load from stores",
      "Replicate the deployment in a second AS Watson market on the same orchestration layer",
    ],
    stakeholders: [
      "Group Chief Digital / eCommerce Officer",
      "Managing Director, Watsons Hong Kong",
      "Head of Customer Experience / Customer Service",
      "Head of Loyalty and CRM",
      "Group Head of IT Architecture and Procurement",
    ],
    discovery: [
      "Do CX platform decisions sit with group digital or with the Hong Kong banner, and who holds the budget?",
      "What share of contacts are delivery exceptions versus loyalty and voucher issues?",
      "What refund and goodwill authority can be delegated to an automated agent without a human approval?",
      "How many store-level calls are stock enquiries that could be answered centrally?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Watsons member messages in Cantonese about a missing item and a voucher that failed at the till, and both are resolved and credited in one WhatsApp thread.",
  },

  "parknshop": {
    operatingContext:
      "ParknShop is one of Hong Kong's two dominant supermarket chains, part of AS Watson under CK Hutchison, operating store formats from neighbourhood supermarkets to large-format and premium banners, alongside a substantial online grocery business with scheduled home delivery. Online grocery is structurally exception-prone: substitutions, out-of-stock items, chilled and frozen handling, narrow delivery windows and building-access issues in dense residential estates all generate contact. Customers reach the chain through a hotline, app and web chat, and increasingly messaging. Because grocery baskets are low-margin, every service contact and every refund materially affects the economics of an online order.",
    strategicPressure: [
      { text: "ParknShop is one of the two dominant Hong Kong supermarket chains and sits within AS Watson under CK Hutchison, so procurement may run through group channels.", kind: "verified" },
      { text: "Online grocery in Hong Kong operates on narrow delivery windows into high-density residential buildings, making delivery exceptions frequent and time-critical.", kind: "inference" },
      { text: "Substitutions and missing items are the single largest source of grocery service contact, and each is resolved with a manual refund or credit today.", kind: "inference" },
      { text: "Grocery margins mean the cost of servicing an online order is a direct determinant of whether the online channel is profitable at all.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The banner runs commerce and fulfilment technology through group and vendor platforms and has no conversational engineering function. Grocery exception handling is a well-understood, packaged workflow, and the value is entirely in integration to order management, delivery scheduling and refunds.",
    whyNotBuild:
      "A supermarket chain's technology priorities are fulfilment, pricing and supply chain. Building Cantonese-first conversational infrastructure, telephony and messaging orchestration, and evaluation for a service function would consume engineering capacity that should be spent on getting the groceries to the door.",
    workflows: [
      {
        name: "Delivery-slot change and access exception handling",
        friction: "Customers call to change a slot or explain a building-access problem, and the agent must reach the fulfilment team before anything changes, often too late.",
        outcome: "Slot changes and delivery instructions written directly into the fulfilment system in the conversation, with confirmation back to the customer.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Order management system", "Delivery scheduling", "Last-mile routing", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Missing item and substitution resolution",
        friction: "A missing or substituted item triggers a call, a manual check of the picking record, and a refund processed by an agent with discretion that varies.",
        outcome: "Order and picking record read live, refund or credit applied within an approved matrix, and the customer told exactly what happened.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Order management system", "Picking and fulfilment records", "Payments and refunds", "Loyalty platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Proactive delivery-risk notification",
        friction: "Customers discover a late or failed delivery only when it does not arrive, then call an already-busy hotline during peak evening hours.",
        outcome: "At-risk deliveries detected and the customer contacted first with options, converting a complaint into a managed exception.",
        channels: ["WhatsApp", "SMS", "App push"],
        systems: ["Last-mile routing", "Order management system", "Notification services", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An online grocery platform with app and web ordering and scheduled delivery",
        "A customer service hotline covering store and online enquiries",
        "Loyalty and member pricing linked to the group programme",
        "Automated order confirmation and delivery notification messaging",
      ],
      gaps: [
        "Delivery-slot changes cannot be made by the customer in a conversation",
        "Missing-item refunds require agent discretion and manual processing",
        "No proactive outreach when a delivery is running late or will fail",
        "Store and online service are separate experiences for the same shopper",
      ],
    },
    risks: [
      "PDPO consent governs outbound messaging to shoppers, particularly on WhatsApp, and must be respected per contact.",
      "Refund and goodwill authority delegated to an automated agent needs a hard financial ceiling and full audit trail to satisfy finance and internal audit.",
      "Contracting may need to run through AS Watson group procurement rather than the banner, affecting deal shape and timeline.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 3.5,
      automationRate: 0.65,
      basis: "Seller assumptions only — online-order contact rates, exception frequency and cost per contact must be validated with ParknShop e-commerce and customer-service leadership.",
    },
    pilotScope:
      "Automate online-grocery delivery exception handling — slot changes, access instructions, missing items and substitution refunds — across WhatsApp and voice in Cantonese and English, with refunds bounded by an approved value matrix.",
    expansion: [
      "Add proactive delivery-risk outreach ahead of failed or late deliveries",
      "Extend to store-level enquiries including stock and promotion questions",
      "Link loyalty and voucher servicing into the same conversational layer",
    ],
    stakeholders: [
      "Head of eCommerce, ParknShop",
      "Head of Customer Service",
      "Head of Supply Chain and Last-Mile Operations",
      "IT Director / Group IT representative",
      "Finance controller for refunds and goodwill authority",
    ],
    discovery: [
      "What percentage of online orders generate a service contact, and what does each contact cost?",
      "How are missing-item refunds authorised today, and what is the average value?",
      "Can delivery-slot changes be written into fulfilment systems by an external agent, or only by staff?",
      "Is the contracting vehicle the banner or AS Watson group procurement?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A shopper messages that no one can reach her flat during the evening slot, and the delivery is rescheduled and confirmed before the driver leaves the depot.",
  },

  "circle-k-hk": {
    operatingContext:
      "Circle K Hong Kong, operated by Convenience Retail Asia within the Fung group orbit, is the territory's second-largest convenience-store chain, running several hundred stores in high-footfall locations across the MTR network, residential estates and commercial districts. Its customer relationship is built on frequency rather than basket size, supported by a stamp-and-reward loyalty programme and heavy promotional activity including e-vouchers and app-based offers. Customer contact clusters around promotion mechanics, stamp and reward redemption, e-voucher failures at the till, and store-level complaints. Volumes are modest by retail standards but spike sharply whenever a promotion launches or a redemption window closes.",
    strategicPressure: [
      { text: "Circle K Hong Kong is the territory's second-largest convenience chain, operated by Convenience Retail Asia across several hundred high-footfall stores.", kind: "verified" },
      { text: "Convenience retail competes on promotion mechanics and loyalty rather than price or assortment, so campaign complexity directly drives customer confusion and contact.", kind: "inference" },
      { text: "Contact volume is bursty rather than steady — a promotion launch or redemption deadline creates a spike that a small service team cannot staff for.", kind: "inference" },
      { text: "Deal size may be constrained by absolute contact volume, so the commercial case likely depends on bundling loyalty servicing with campaign operations value.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A convenience-retail operator of this scale has a small IT function focused on store systems, POS and loyalty, and no capacity or reason to build conversational technology. The purchase decision is straightforward and can be sponsored by a single marketing or operations head.",
    whyNotBuild:
      "There is no version of this business where building speech, telephony, orchestration and evaluation makes sense. The chain's entire technology budget would be consumed by a capability that adds nothing to its competitive position, when a configured deployment delivers the same customer outcome in weeks.",
    workflows: [
      {
        name: "Loyalty stamp and reward redemption support",
        friction: "Customers whose stamps or rewards do not appear must call or visit a store, and staff cannot see the loyalty record from the till.",
        outcome: "Loyalty record read live in the conversation, missing stamps credited within approved limits, and redemption steps explained clearly.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Loyalty platform", "POS transaction records", "Promotions engine", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Promotion and e-voucher failure resolution",
        friction: "An e-voucher rejected at the till creates a queue behind the customer and a complaint later, with no consistent resolution path.",
        outcome: "Voucher state checked instantly, the failure reason explained, and a replacement issued in-conversation within policy.",
        channels: ["WhatsApp", "Web chat"],
        systems: ["Promotions engine", "Voucher platform", "POS records", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Store feedback and complaint intake",
        friction: "Store-level complaints arrive by phone or social media, are logged inconsistently, and rarely reach the responsible district manager with enough detail to act.",
        outcome: "Structured complaint capture with store, time and issue category recorded, routed automatically to the district owner with a customer follow-up.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["CRM", "Case management", "Store operations reporting", "Loyalty platform"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A stamp-and-reward loyalty programme with app and card participation",
        "E-voucher and promotional campaign mechanics across the store network",
        "A customer service phone and email channel for enquiries and complaints",
        "Store-level service staff handling in-person issues at the till",
      ],
      gaps: [
        "Loyalty and voucher problems cannot be fixed at the point they occur",
        "No conversational channel on the messaging apps customers already use",
        "Complaint data is not structured well enough to drive store-level action",
        "Promotion-launch spikes overwhelm a small service team",
      ],
    },
    risks: [
      "PDPO consent constraints apply to loyalty member contact details used for conversational or outbound messaging.",
      "Any authority to credit stamps or reissue vouchers needs a hard value ceiling and audit trail to prevent abuse.",
      "Absolute contact volume may be too small to clear a minimum viable deal size without bundling additional workflows.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 3,
      automationRate: 0.65,
      basis: "Seller assumptions only — loyalty and promotion-related contact volumes and cost per contact must be validated with the marketing and customer-service owners.",
    },
    pilotScope:
      "Automate loyalty stamp, reward and e-voucher query handling across WhatsApp and web chat in Cantonese and English, with credit and reissue authority bounded by an approved value ceiling.",
    expansion: [
      "Add structured store feedback and complaint intake routed to district managers",
      "Add campaign-launch surge handling with promotion-specific grounded answers",
      "Extend to outbound promotional reminders with consent-managed opt-in",
    ],
    stakeholders: [
      "General Manager / Managing Director, Circle K Hong Kong",
      "Head of Marketing and Loyalty",
      "Head of Store Operations",
      "IT Manager",
      "Customer Service Manager",
    ],
    discovery: [
      "What is the monthly contact volume across phone, email and social, and how does it spike at campaign launch?",
      "How are missing stamps and failed vouchers resolved today, and who authorises a credit?",
      "How many loyalty members have consented to messaging contact?",
      "Would loyalty servicing alone justify a deployment, or should complaint intake be bundled in?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A member whose e-voucher failed at a Kowloon store messages in Cantonese and has a replacement voucher issued before she leaves the shop.",
  },

  "sa-sa": {
    operatingContext:
      "Sa Sa International is a Hong Kong-listed cosmetics retailer operating a chain of stores across Hong Kong and Macau plus cross-border e-commerce and mainland channels, with a business model historically dependent on mainland Chinese visitor spending. Its assortment spans imported and exclusive-agency beauty brands, which makes product authenticity, expiry, and parallel-import questions a recurring source of customer contact. Post-pandemic, the company has rebalanced toward online and mainland-facing channels, meaning a growing share of interactions arrive on messaging platforms in Mandarin rather than in-store in Cantonese. Service contact clusters around order status, cross-border shipping and customs, membership points, and product authenticity assurance.",
    strategicPressure: [
      { text: "Sa Sa is a listed Hong Kong cosmetics retailer with stores in Hong Kong and Macau and significant exposure to mainland Chinese consumer demand.", kind: "verified" },
      { text: "The company has shifted weight toward online and mainland-facing channels as visitor patterns changed, moving customer contact from stores to messaging.", kind: "inference" },
      { text: "Beauty retail in Hong Kong carries persistent authenticity and parallel-import concerns, so trust-related questions are a distinctive and repeated contact driver.", kind: "inference" },
      { text: "Margin pressure in a competitive beauty market makes service headcount an obvious cost target, favouring automation over hiring.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A specialty retailer under margin pressure with a small technology team will procure a configured solution. Its needs — order status, cross-border shipping, membership and authenticity assurance — are standard retail workflows requiring integration, not invention.",
    whyNotBuild:
      "Sa Sa's competitive assets are brand agencies, store locations and merchandising. Building bilingual speech and messaging infrastructure, order-system orchestration and conversation evaluation would consume more than its entire technology capacity for no commercial return.",
    workflows: [
      {
        name: "Cross-border order and shipping status",
        friction: "Mainland customers message about orders held in customs or slow cross-border shipping, and staff check courier portals manually before replying hours later.",
        outcome: "Live order and shipment status answered in Mandarin in the customer's channel, with customs documentation requirements explained clearly.",
        channels: ["WeChat", "WhatsApp", "Web chat"],
        systems: ["E-commerce order management", "Cross-border logistics portals", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Membership points and member-price queries",
        friction: "Members ask why points did not credit or why a member price did not apply, and resolution requires an agent with POS and loyalty access.",
        outcome: "Member record and transaction read live, corrections applied within limits, and member benefits explained consistently across store and online.",
        channels: ["WhatsApp", "WeChat", "Voice"],
        systems: ["Loyalty platform", "POS records", "E-commerce platform", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Product authenticity and provenance assurance",
        friction: "Customers question whether a product is genuine or how to verify batch and expiry, and answers vary by staff member, damaging trust when inconsistent.",
        outcome: "Consistent, grounded provenance and verification guidance drawn from approved sources, with escalation to a specialist for genuine disputes.",
        channels: ["WhatsApp", "WeChat", "Web chat"],
        systems: ["Product master data", "Batch and expiry records", "Knowledge base", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An e-commerce platform serving Hong Kong and cross-border customers",
        "A membership programme linking store and online purchases",
        "Mainland-facing social and messaging presence for customer engagement",
        "In-store beauty advisers acting as the primary service channel for walk-in customers",
      ],
      gaps: [
        "Cross-border shipment and customs status is not self-serviceable",
        "Membership point corrections require an agent",
        "Authenticity and provenance answers are inconsistent across staff and channels",
        "No unified view of a customer who shops both in store and online",
      ],
    },
    risks: [
      "PDPO and mainland data rules both apply when serving cross-boundary customers, constraining where conversation data can be processed.",
      "Product claims about cosmetics must avoid regulated health or efficacy statements, requiring tight grounding and guardrails.",
      "Small absolute contact volume means the business case depends on cost avoidance and conversion, not headcount reduction alone.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 3.5,
      automationRate: 0.6,
      basis: "Seller assumptions only — contact volumes across store, online and cross-border channels and cost per contact must be validated with Sa Sa's e-commerce and customer-service owners.",
    },
    pilotScope:
      "Automate cross-border order and shipping status plus membership queries on WeChat and WhatsApp in Mandarin, Cantonese and English, integrated to order management and the loyalty platform.",
    expansion: [
      "Add product authenticity and provenance guidance with grounded, approved sources",
      "Add proactive shipment-exception outreach for cross-border orders",
      "Extend to post-purchase care and replenishment conversations for members",
    ],
    stakeholders: [
      "Chief Executive Officer / Executive Director",
      "Head of eCommerce and Digital",
      "Head of Customer Service",
      "Head of Marketing and CRM",
      "IT Manager",
    ],
    discovery: [
      "What is the split of service contacts between Hong Kong retail customers and cross-border online customers?",
      "How long does a cross-border shipping status enquiry take to answer today?",
      "Which messaging channels do mainland customers actually use to reach the brand?",
      "What loyalty correction authority can be delegated without a supervisor?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Guangzhou customer asks on WeChat in Mandarin why her order is held at customs and receives the exact document needed plus a revised delivery date.",
  },

  "chow-tai-fook": {
    operatingContext:
      "Chow Tai Fook Jewellery is one of the world's largest jewellery retailers, Hong Kong-listed and operating thousands of points of sale across mainland China, Hong Kong and Macau, with a mix of directly operated stores and franchised partners. Its products combine gold — where the price moves daily and customers track it closely — with diamond and branded jewellery carrying certification, and its membership programme spans a very large customer base. Because purchases are high value and often gifted or held as a store of value, contact centres on certification and authentication, repair and resizing status, gold-price and buyback questions, and order or delivery status for online purchases. Service quality on a high-ticket purchase directly affects both repeat business and brand equity, in Cantonese and Mandarin.",
    strategicPressure: [
      { text: "Chow Tai Fook is one of the world's largest jewellery retailers, listed in Hong Kong, operating thousands of points of sale across Greater China with a large membership programme.", kind: "verified" },
      { text: "Gold pricing moves daily and customers actively track it, creating a recurring, time-sensitive enquiry pattern unlike most retail categories.", kind: "verified" },
      { text: "High-ticket purchases generate long post-purchase service tails — certification, repair, resizing, buyback — where status opacity damages a premium brand disproportionately.", kind: "inference" },
      { text: "A large franchised network means service consistency varies by store, which a central conversational layer could standardise.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The group has scale and a real digital function but is a retailer and manufacturer at its core, not a technology builder. A deployment of this size across Hong Kong and potentially mainland operations needs an integration partner and a governed platform rather than an internal build, with the buying decision likely shared between Hong Kong and mainland CX ownership.",
    whyNotBuild:
      "The group's engineering focus is commerce, supply chain, and store systems across thousands of outlets. Building Cantonese and Mandarin speech, messaging and telephony orchestration, live integration to repair, certification and pricing systems, and per-conversation evaluation would divert capability from a retail network that is the actual business.",
    workflows: [
      {
        name: "Repair, resizing and certification status",
        friction: "Customers who leave an item for repair or resizing must call the store or wait for a call back, and the store cannot see workshop progress.",
        outcome: "Workshop status read live and pushed proactively, with collection appointments booked in the conversation.",
        channels: ["WhatsApp", "WeChat", "Voice"],
        systems: ["Service and repair workflow", "Store systems", "CRM", "Appointment scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Membership, points and high-value order servicing",
        friction: "Members ask about points, tier benefits and the status of high-value or customised orders, and answers depend on whether the original store is reachable.",
        outcome: "Member and order context available centrally in any channel, with grounded answers on points, benefits and order progress independent of the selling store.",
        channels: ["WhatsApp", "WeChat", "Voice"],
        systems: ["Loyalty platform", "Order management", "POS records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Gold price, buyback and trade-in enquiries",
        friction: "Price-tracking customers call stores repeatedly for the day's gold price and buyback terms, consuming sales-floor time during trading hours.",
        outcome: "Live pricing and clearly explained buyback and trade-in terms delivered conversationally, with appointment booking for transactions.",
        channels: ["WhatsApp", "WeChat", "Voice"],
        systems: ["Pricing systems", "Product master data", "Appointment scheduling", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large membership programme spanning Hong Kong, Macau and mainland stores",
        "E-commerce and social-commerce channels alongside the physical network",
        "Store-level customer service and after-sales handling for repairs and certification",
        "Messaging presence on the platforms mainland and Hong Kong customers use",
      ],
      gaps: [
        "Repair and certification status is not visible to the customer or the store",
        "Membership and order servicing depends on reaching the original selling store",
        "Gold-price and buyback enquiries consume sales-floor time",
        "Service consistency varies between directly operated and franchised outlets",
      ],
    },
    risks: [
      "Cross-boundary data rules constrain how Hong Kong and mainland customer conversations can be pooled or processed together.",
      "High-value transactions carry anti-money-laundering and identity-verification obligations that must remain human-controlled.",
      "Decision rights may sit with the mainland operation rather than Hong Kong, changing both the buyer and the required language emphasis.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 4,
      automationRate: 0.55,
      basis: "Seller assumptions only — contact volumes across Hong Kong stores, e-commerce and after-sales and cost per contact must be validated with the group's CX leadership.",
    },
    pilotScope:
      "Automate repair, resizing and certification status plus collection booking for the Hong Kong network across WhatsApp and voice in Cantonese, Mandarin and English, integrated to the service workflow and store systems.",
    expansion: [
      "Add membership, points and high-value order servicing decoupled from the selling store",
      "Add gold price, buyback and trade-in enquiry handling with appointment booking",
      "Extend the same layer to Macau and selected mainland operations",
    ],
    stakeholders: [
      "Head of Retail Operations, Hong Kong and Macau",
      "Head of Customer Experience / After-Sales Service",
      "Head of Digital and E-commerce",
      "Chief Information Officer",
      "Head of Membership and CRM",
    ],
    discovery: [
      "How many after-sales service cases are open at any time, and how many status calls does each generate?",
      "Are CX and service platform decisions made in Hong Kong or from the mainland operation?",
      "How much sales-floor time is consumed by gold-price and buyback enquiries?",
      "What service data can be shared across the Hong Kong and mainland entities given data rules?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer asks on WhatsApp whether her resized ring is ready, gets the live workshop status, and books a collection slot at a Tsim Sha Tsui store.",
  },

  "fortress-hk": {
    operatingContext:
      "Fortress is Hong Kong's leading consumer-electronics and home-appliance chain, part of AS Watson under CK Hutchison, operating stores across the territory alongside an online channel. Its category mix — televisions, large appliances, air conditioners, computing — means a large share of sales require scheduled delivery, in-home installation, and old-appliance removal, all of which must be coordinated into narrow windows in dense residential buildings. Post-purchase contact is therefore dominated by delivery and installation scheduling, installation-day exceptions, warranty registration and repair status. Seasonal peaks around air-conditioner demand in summer and gift periods sharpen the scheduling load.",
    strategicPressure: [
      { text: "Fortress is a leading Hong Kong consumer-electronics retailer operating within the AS Watson group under CK Hutchison.", kind: "verified" },
      { text: "Large-appliance retail requires delivery plus installation coordination into narrow windows in high-density buildings, making scheduling the dominant post-purchase contact driver.", kind: "inference" },
      { text: "Air-conditioner demand concentrates installation load into a short summer window when the service team is least able to absorb it.", kind: "inference" },
      { text: "Warranty and repair status enquiries persist long after purchase, extending the service tail well beyond the transaction.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The chain uses group and vendor retail technology, has no conversational engineering capability, and faces a well-defined scheduling and status problem. The deployment is a configuration and integration exercise against delivery, installation and service systems.",
    whyNotBuild:
      "An electronics retailer competes on assortment, price and installation service quality. Building speech, telephony, scheduling orchestration and evaluation infrastructure adds nothing to that and would take years to reach the reliability a configured platform delivers immediately.",
    workflows: [
      {
        name: "Delivery and installation scheduling and rescheduling",
        friction: "Customers phone to book or move an installation slot and staff manually check technician availability, often calling back later with a confirmation.",
        outcome: "Live slot availability offered and booked in the conversation, with reschedules and building-access details written straight into the scheduling system.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Delivery and installation scheduling", "Order management", "Technician dispatch", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Installation-day exception handling",
        friction: "Technicians arrive to find access blocked, the wrong bracket, or an unsuitable site, and the resulting reschedule is handled by phone tag between customer, store and dispatcher.",
        outcome: "Exceptions captured and rebooked immediately with the customer, and preparation requirements confirmed before the technician is dispatched.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Technician dispatch", "Scheduling", "Order management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Warranty registration and repair status",
        friction: "Customers call to register warranties or chase repair progress, and the answer requires checking a service partner's system before a callback.",
        outcome: "Warranty registered conversationally and repair status read live from the service workflow, with proactive updates until collection.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Warranty registry", "Service and repair workflow", "Order management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An online store with delivery and installation booking at checkout",
        "A customer service hotline covering orders, delivery and after-sales",
        "A delivery and installation operation with technician scheduling",
        "Warranty and repair handling in partnership with brand service centres",
      ],
      gaps: [
        "Slot rescheduling requires a phone call and a manual dispatcher check",
        "Site-readiness requirements are not confirmed before technician dispatch",
        "Repair status is not visible to the customer without an agent lookup",
        "No proactive notification when an installation slot is at risk",
      ],
    },
    risks: [
      "PDPO consent applies to outbound messaging about deliveries and installations, requiring consent capture at point of sale.",
      "Installation involves in-home visits and safety obligations, so an automated agent must never give technical or electrical guidance beyond approved scripts.",
      "Group procurement through AS Watson may determine the contracting vehicle and timeline.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — delivery, installation and after-sales contact volumes and cost per contact must be validated with Fortress operations.",
    },
    pilotScope:
      "Automate delivery and installation scheduling and rescheduling across WhatsApp and voice in Cantonese and English, integrated to the scheduling and dispatch systems, with site-readiness confirmation before dispatch.",
    expansion: [
      "Add installation-day exception handling with immediate rebooking",
      "Add warranty registration and repair-status tracking with proactive updates",
      "Add proactive slot-risk notification during summer installation peaks",
    ],
    stakeholders: [
      "Managing Director / General Manager, Fortress",
      "Head of Customer Service",
      "Head of Delivery and Installation Operations",
      "Head of eCommerce",
      "Group IT / procurement representative",
    ],
    discovery: [
      "How many installations are rescheduled or fail on the day, and what does each failure cost?",
      "What share of hotline volume is scheduling versus after-sales repair status?",
      "Can an external agent write slot changes into the dispatch system directly?",
      "How do summer air-conditioner peaks change contact volume and technician availability?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer moves an air-conditioner installation to Saturday on WhatsApp, confirms window access details, and the technician arrives prepared.",
  },

  "sun-hung-kai-properties": {
    operatingContext:
      "Sun Hung Kai Properties is Hong Kong's largest property developer by market position, with a portfolio spanning premium residential developments, major shopping malls, office towers and hotels, and property-management arms Hong Yip and Kai Shing that manage a very large number of residential estates and commercial buildings. Its mall business runs The Point loyalty programme, linking shoppers across its retail portfolio. This creates three distinct communications populations: residents and owners raising estate-management requests, shoppers and members with loyalty and mall queries, and new-flat purchasers going through handover, defect reporting and rectification. Contact today runs through estate management offices, mall concierges, hotlines and apps, with service quality varying estate by estate.",
    strategicPressure: [
      { text: "Sun Hung Kai Properties is Hong Kong's leading developer with major mall, office and residential portfolios, and manages properties through subsidiaries Hong Yip and Kai Shing.", kind: "verified" },
      { text: "The group operates The Point loyalty programme across its shopping malls, linking shopper engagement across the retail portfolio.", kind: "verified" },
      { text: "New-flat handover generates an intense, time-boxed burst of defect reports and rectification scheduling per project, which estate teams absorb manually.", kind: "inference" },
      { text: "Service consistency across hundreds of managed estates is structurally hard without a central layer, and management-fee scrutiny from owners raises the stakes.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The group has scale and a digital function around its mall and loyalty assets, but property companies procure operational service technology rather than build it. A deployment spanning property management and mall loyalty requires integration across several subsidiary systems, which points to a partner-delivered programme with a group sponsor.",
    whyNotBuild:
      "Property development and management is a capital and operations business. Building trilingual speech, telephony across dozens of estate hotlines, orchestration into facilities and work-order systems, and per-conversation evaluation would require a software organisation the group has no reason to create.",
    workflows: [
      {
        name: "Estate-management service requests and work orders",
        friction: "Residents call or visit the estate office to report faults, requests are written on paper or in local systems, and follow-up depends on the individual officer.",
        outcome: "Requests captured conversationally with location and category, raised as work orders automatically, and status pushed to the resident until closure.",
        channels: ["Voice", "WhatsApp", "Resident app"],
        systems: ["Facilities and work-order management", "Estate management records", "Contractor dispatch", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New-flat handover defect reporting and rectification booking",
        friction: "Handover produces a surge of defect reports per project, tracked in spreadsheets, with owners chasing rectification appointments by phone.",
        outcome: "Structured defect capture with photos, rectification appointments booked against contractor availability, and every item tracked to sign-off.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Defect management", "Contractor scheduling", "Sales and handover records", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Mall loyalty and member servicing",
        friction: "Shoppers with points, parking-redemption and promotion questions queue at mall concierge desks or call a hotline during trading hours only.",
        outcome: "Member points, parking privileges and promotion mechanics handled conversationally in any language, freeing concierge staff for in-person hospitality.",
        channels: ["WhatsApp", "App", "Voice"],
        systems: ["Loyalty platform", "Car park systems", "Promotions engine", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mall loyalty programme spanning the group's retail portfolio with an accompanying app",
        "Estate management offices and hotlines across a large managed portfolio",
        "Resident-facing apps or portals for selected estates and buildings",
        "Sales offices and handover teams handling new-development purchaser contact",
      ],
      gaps: [
        "Estate service requests are not consistently captured or tracked to closure",
        "Handover defect reporting is spreadsheet-driven with no owner-facing status",
        "Loyalty and parking servicing is limited to concierge hours",
        "Residents get different service quality depending on which estate they live in",
      ],
    },
    risks: [
      "PDPO obligations apply to resident and member data, and property-management data is often held by subsidiaries with separate consent bases.",
      "Building management ordinance obligations and owners' committee scrutiny mean service records must be auditable and defensible.",
      "Budget ownership is split between Hong Yip, Kai Shing and the mall business, so the sponsor and contracting entity must be established before scoping.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 4,
      automationRate: 0.55,
      basis: "Seller assumptions only — estate, handover and mall contact volumes and cost per contact must be validated with the property-management subsidiaries and mall operations.",
    },
    pilotScope:
      "Automate estate-management service request intake and work-order status for a defined cluster of managed estates across voice and WhatsApp in three languages, with automatic work-order creation and closure notification.",
    expansion: [
      "Add new-flat handover defect reporting and rectification appointment booking for an active project",
      "Add mall loyalty and car-park servicing on The Point membership base",
      "Roll the estate model across the wider Hong Yip and Kai Shing portfolio",
    ],
    stakeholders: [
      "Executive Director responsible for property management",
      "General Manager, Hong Yip or Kai Shing Property Management",
      "Head of Shopping Mall Operations / Loyalty",
      "Group Head of Information Technology",
      "Head of Customer Experience for residential sales and handover",
    ],
    discovery: [
      "Which entity owns the service-experience budget — the property-management subsidiaries or the group?",
      "How are estate service requests logged today, and is closure tracked centrally?",
      "How many defect items does a typical new-development handover generate, and how are they managed?",
      "Can work orders be created by an external agent in the facilities system, or only by estate staff?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A resident reports a leaking pipe on WhatsApp in Cantonese, a work order is raised with photos attached, and she is told when the contractor will arrive.",
  },

  "henderson-land": {
    operatingContext:
      "Henderson Land Development is one of Hong Kong's largest developers, with a residential development pipeline, a substantial investment-property portfolio of malls and offices, an agricultural land bank in the New Territories, and interests in utilities through associated companies. Its residential business runs in bursts: a project launch concentrates enormous inquiry volume into a few weeks, handled by sales offices and appointed agencies working extended hours. Between launches, the property-management arm handles estate service requests and the leasing business handles tenant queries. Buyers and prospects reach the company through sales-office hotlines, agency intermediaries, WhatsApp and increasingly WeChat for mainland buyers.",
    strategicPressure: [
      { text: "Henderson Land is a top-tier Hong Kong developer with both a residential development pipeline and a significant investment-property portfolio.", kind: "verified" },
      { text: "Residential launches concentrate inquiry volume into short windows, so staffing for peak is impossible and prospects go unanswered exactly when intent is highest.", kind: "inference" },
      { text: "A softer Hong Kong residential market raises the value of every genuine buyer inquiry and makes speed-to-response a direct sales lever.", kind: "inference" },
      { text: "Mainland buyer interest arrives on different channels and in Mandarin, which launch teams staffed for Cantonese handle unevenly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Developers procure sales and service technology through marketing and property-management functions; there is no internal software organisation to build a conversational layer. The purchase is naturally sponsored by a sales and marketing head with a launch-specific business case.",
    whyNotBuild:
      "The company's competitive assets are land, capital and project execution. Building trilingual speech, telephony, orchestration into sales and CRM systems, and conversation evaluation would be a multi-year distraction for a capability needed most acutely in three-week launch windows.",
    workflows: [
      {
        name: "Launch-window inquiry capture and qualification",
        friction: "Launch inquiries arrive faster than the sales office can answer, and prospects who do not get a fast reply move to a competing project.",
        outcome: "Every inquiry engaged within minutes in the prospect's language, qualified against a structured rubric, and booked into a sales-office appointment.",
        channels: ["WhatsApp", "Voice", "WeChat", "Web"],
        systems: ["Sales CRM", "Project and pricing information", "Appointment scheduling", "Marketing automation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Handover appointment booking and document coordination",
        friction: "Completion and handover generate a burst of appointment and document coordination handled by phone and email across solicitors, buyers and the handover team.",
        outcome: "Handover appointments booked conversationally with document checklists confirmed in advance, reducing failed appointments and chasing calls.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Sales and completion records", "Appointment scheduling", "Document management", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Estate and tenant service request intake",
        friction: "Residents and commercial tenants call estate offices for faults and requests, logged inconsistently with no status visible to the requester.",
        outcome: "Requests captured with location and category, raised as work orders, and status pushed to the requester until closure.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Facilities and work-order management", "Estate records", "Contractor dispatch", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Project sales offices with dedicated launch hotlines and agency partners",
        "Property-management operations handling estate service requests",
        "Leasing and tenant-service teams for the investment portfolio",
        "Project websites and digital marketing capturing registrations of interest",
      ],
      gaps: [
        "Launch inquiries are not answered fast enough during peak windows",
        "No structured qualification, so sales staff spend time on unqualified prospects",
        "Handover coordination remains manual and phone-based",
        "Estate service requests are not tracked to closure for the resident",
      ],
    },
    risks: [
      "Property sales communications are regulated in Hong Kong, including rules on how price and property information may be presented, so grounded content control is mandatory.",
      "PDPO consent governs use of registration and inquiry data for follow-up messaging.",
      "Agency intermediaries own many buyer relationships and may resist direct conversational engagement, so channel design must respect the distribution model.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 4.5,
      automationRate: 0.5,
      basis: "Seller assumptions only — launch-window inquiry volumes, estate service contact and cost per contact must be validated with sales, marketing and property-management leadership.",
    },
    pilotScope:
      "Deploy launch-window inquiry capture and qualification for one residential project across WhatsApp, WeChat and voice in three languages, with grounded project information and sales-office appointment booking.",
    expansion: [
      "Extend to handover appointment booking and document coordination for completing projects",
      "Add estate and tenant service request intake across the managed portfolio",
      "Add post-launch nurture for registered prospects who did not transact",
    ],
    stakeholders: [
      "General Manager, Sales and Marketing (Residential)",
      "Head of Property Management",
      "Head of Leasing / Investment Properties",
      "Head of Information Technology",
      "Head of Customer Service for handover and after-sales",
    ],
    discovery: [
      "How many inquiries does a typical launch generate in the first week, and what share receive a same-day response?",
      "What information may be shared about a project before formal sales documents are issued?",
      "How are agency-sourced and direct inquiries handled differently today?",
      "Who owns the budget for launch marketing technology versus property-management service technology?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A launch-weekend prospect messages in Mandarin at midnight, gets grounded unit and price-list answers, and holds a sales-office appointment before the office opens.",
  },

  "link-reit": {
    operatingContext:
      "Link REIT is Asia's largest listed real-estate investment trust, built on a portfolio of Hong Kong community shopping centres, fresh markets and one of the territory's largest car-park estates, with additional assets in mainland China and overseas. Its Hong Kong properties sit in the middle of public-housing and mass residential districts, serving daily shoppers rather than tourists, and its tenant base is dominated by small and medium businesses running food, fresh produce and everyday retail. That produces two continuous streams of contact: consumers with car-park, monthly-parking, membership and mall queries, and SME tenants with leasing, billing, fit-out and facilities requests. The Park and Dine app and loyalty mechanics link shoppers across the portfolio.",
    strategicPressure: [
      { text: "Link REIT is Asia's largest REIT, operating a large portfolio of Hong Kong community retail properties, fresh markets and car parks.", kind: "verified" },
      { text: "Its car-park estate is one of the largest in Hong Kong, generating continuous monthly-parking, access and payment queries that are operationally distinct from mall retail.", kind: "verified" },
      { text: "An SME-heavy tenant base needs frequent, low-value operational support — billing, fit-out, facilities, promotions — that a lean asset-management team handles by exception.", kind: "inference" },
      { text: "As a REIT judged on net property income, servicing cost and tenant retention both flow directly to distributions, sharpening the case for automation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Link runs a real asset-management technology function and consumer app but is not a software builder. A deployment spanning car parks, malls and tenant servicing needs integration across property management, car-park and leasing systems, which favours a partner-delivered programme with a group technology sponsor.",
    whyNotBuild:
      "Link's technology investment is directed at asset performance, tenant analytics and its consumer app. Building trilingual speech, telephony across dozens of property hotlines, orchestration into car-park and lease systems, and conversation evaluation would be an entirely new competency with no return in property returns.",
    workflows: [
      {
        name: "Car-park and monthly-parking servicing",
        friction: "Monthly-parking applications, renewals, access-card problems and payment queries are handled by individual car-park offices with inconsistent hours and no shared record.",
        outcome: "Applications, renewals and access issues handled conversationally across the whole estate, with payments taken in-channel and access reinstated automatically.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Car-park management system", "Access control", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "SME tenant request and billing desk",
        friction: "Tenants call or email property managers about billing, fit-out approvals, facilities faults and promotion participation, and responses depend on one person's availability.",
        outcome: "Tenant requests captured, routed and answered from lease and billing systems, with facilities issues raised as work orders and tracked to closure.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Lease management", "Billing and accounts receivable", "Facilities work orders", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Shopper membership and mall enquiry handling",
        friction: "Shoppers ask about parking privileges, promotions, membership points and mall services at customer-service counters with limited hours.",
        outcome: "Membership, parking-privilege and promotion questions answered in any language at any hour, freeing counters for in-person hospitality.",
        channels: ["WhatsApp", "App", "Voice"],
        systems: ["Loyalty and membership platform", "Promotions engine", "Car-park system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer app linking shoppers across the Hong Kong retail portfolio with membership mechanics",
        "Property-level customer service counters and car-park offices",
        "Tenant-facing property management teams handling leasing and operations",
        "Digital parking payment and access systems across the car-park estate",
      ],
      gaps: [
        "Monthly-parking servicing is fragmented across individual car-park offices",
        "Tenants have no fast, consistent route for billing and facilities requests",
        "Membership and promotion queries are limited to counter hours",
        "No unified service record across a shopper's mall, market and parking interactions",
      ],
    },
    risks: [
      "PDPO obligations apply to shopper membership data and to vehicle and access records held by car-park systems.",
      "Tenant billing conversations touch contractual matters, so an automated agent must be strictly bounded to factual account status and escalate disputes.",
      "Community-retail customers include elderly and less digitally confident shoppers, so voice and human fallback must remain prominent.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — car-park, tenant and shopper contact volumes and cost per contact must be validated with Link's property operations and technology teams.",
    },
    pilotScope:
      "Automate monthly-parking application, renewal, access and payment servicing across a defined cluster of car parks on WhatsApp and voice in three languages, with payments taken in-channel and access reinstatement automated.",
    expansion: [
      "Add SME tenant billing and facilities request handling across the retail portfolio",
      "Add shopper membership and promotion servicing linked to the consumer app",
      "Extend the car-park model across the full Hong Kong estate and into mainland assets",
    ],
    stakeholders: [
      "Head of Property Management, Hong Kong",
      "Head of Car Park and Ancillary Business",
      "Head of Leasing / Tenant Relations",
      "Chief Technology / Digital Officer",
      "Head of Customer Experience and Loyalty",
    ],
    discovery: [
      "How many monthly-parking accounts are serviced, and how is renewal handled today?",
      "What is the tenant contact volume per property manager, and how much is billing versus facilities?",
      "Can an external agent write into the car-park access and payment systems?",
      "Does the consumer app team or property operations own the customer-service budget?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A monthly parker whose access card stops working messages in Cantonese at 7am, pays the outstanding fee in-channel, and drives in ten minutes later.",
  },

  "swire-properties": {
    operatingContext:
      "Swire Properties is a premium Hong Kong landlord and developer, best known for Pacific Place, Taikoo Place and Cityplaza, with mixed-use estates combining grade-A offices, luxury retail, hotels and residential, plus a growing mainland China portfolio in cities including Beijing, Shanghai, Guangzhou and Chengdu. Its Hong Kong customer base is therefore split between corporate office tenants with facilities and building-services needs, luxury retail tenants, and affluent shoppers who expect concierge-grade service. Contact runs through building management offices, tenant portals, concierge desks and hotlines, with the service promise deliberately human and high-touch. The commercial question is not whether to automate the relationship but which routine interactions are stealing time from genuine hospitality.",
    strategicPressure: [
      { text: "Swire Properties operates premium mixed-use estates in Hong Kong including Pacific Place and Taikoo Place, alongside a mainland China portfolio.", kind: "verified" },
      { text: "Grade-A office tenants generate continuous facilities, access, and building-services requests that are routine in nature but high in expectation.", kind: "inference" },
      { text: "A premium positioning means automation must augment rather than replace human service, which changes the shape of a viable deployment.", kind: "inference" },
      { text: "Sustainability and building-performance commitments add tenant communications — energy, works notifications, certification data — that are currently manual.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The group has a capable technology function and invests in smart-building and tenant-app capability, but it procures and integrates rather than building conversational infrastructure. A premium landlord needs a highly configurable, brand-safe platform delivered with a partner who will tune tone as carefully as function.",
    whyNotBuild:
      "Swire's engineering effort belongs in building systems, sustainability performance and tenant experience platforms. Speech, telephony, orchestration and conversation evaluation are commodity infrastructure whose only differentiation for a premium landlord is how well they are configured, which is a partner's job.",
    workflows: [
      {
        name: "Office tenant facilities and building-services requests",
        friction: "Tenant contacts email or call building management for air conditioning, access, works permits and maintenance, and requests are triaged manually across teams.",
        outcome: "Requests captured and categorised conversationally, raised as work orders with the right team, and status pushed back to the tenant contact.",
        channels: ["Voice", "Email", "Tenant app", "WhatsApp"],
        systems: ["Facilities and work-order management", "Access control", "Tenant records", "Contractor dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Concierge overflow and shopper enquiry handling",
        friction: "Concierge desks handle high volumes of routine questions — parking, opening hours, store locations, membership — that crowd out genuine hospitality moments.",
        outcome: "Routine enquiries answered in any language on messaging and voice, leaving concierge staff free for the interactions that justify the premium positioning.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Mall and tenant directory", "Car-park system", "Membership platform", "Events calendar"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Works, access and event notification with two-way response",
        friction: "Planned works, access changes and events are announced by circular or email, and the resulting questions arrive scattered across building teams.",
        outcome: "Notifications delivered conversationally with the ability to answer follow-up questions and capture tenant objections or scheduling constraints.",
        channels: ["Email", "Tenant app", "WhatsApp", "Voice"],
        systems: ["Tenant records", "Works scheduling", "Notification services", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Tenant portals or apps for office occupiers covering building services and access",
        "Concierge and customer-service desks across premium retail estates",
        "Building management offices handling facilities requests per property",
        "Shopper membership and privilege programmes at flagship malls",
      ],
      gaps: [
        "Tenant requests are triaged manually and status is not visible to the requester",
        "Concierge desks absorb routine enquiries that need no human",
        "Notifications are one-way with responses scattered across channels",
        "No consistent multilingual coverage outside business hours",
      ],
    },
    risks: [
      "Premium brand positioning means a poor automated interaction carries outsized reputational cost, so tone, escalation speed and human fallback are selection criteria.",
      "PDPO obligations apply to tenant contact and shopper membership data, with corporate tenant data carrying additional contractual confidentiality expectations.",
      "Mainland portfolio expansion introduces different data and platform constraints if the deployment is later extended across the border.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 5,
      automationRate: 0.45,
      basis: "Seller assumptions only — tenant and shopper contact volumes across the Hong Kong portfolio and cost per contact must be validated with Swire Properties operations.",
    },
    pilotScope:
      "Automate office tenant facilities and building-services request intake for one Hong Kong estate across voice, email and the tenant app, with automatic work-order creation and status updates to the tenant contact.",
    expansion: [
      "Add concierge overflow handling for routine shopper enquiries at flagship retail estates",
      "Add two-way works and event notification for office and retail tenants",
      "Extend the tenant service model to additional Hong Kong estates and selected mainland assets",
    ],
    stakeholders: [
      "Director of Portfolio Management / Head of Office Portfolio",
      "Head of Property Management Operations",
      "Head of Retail Portfolio and Customer Experience",
      "Head of Technology and Digital",
      "Head of Sustainable Development for tenant communications",
    ],
    discovery: [
      "How many tenant service requests are raised per building per month, and how are they currently triaged?",
      "What proportion of concierge interactions are routine information requests?",
      "What is the tone and escalation standard a premium brand would require of an automated agent?",
      "Would a Hong Kong deployment be expected to extend to the mainland portfolio, and under what data constraints?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An office manager at Taikoo Place reports an air-conditioning fault by voice, a work order is raised automatically, and she is told when the engineer is attending.",
  },

  "sino-land": {
    operatingContext:
      "Sino Land is a major Hong Kong developer within the Sino Group, combining residential development with an investment portfolio of malls and offices, a sizeable property-management arm, and hotel interests including Fullerton-branded properties. Its property-management business serves a large number of residential estates and commercial buildings, where clubhouse facilities, estate service requests and management-fee queries generate steady daily contact. Residential launches add episodic surges of sales inquiries. Contact today is handled by estate management offices, clubhouse counters and hotlines, largely in Cantonese, with limited digital self-service beyond selected estate apps.",
    strategicPressure: [
      { text: "Sino Land is a major Hong Kong developer within Sino Group, with residential development, investment properties, a property-management arm and hotel interests.", kind: "verified" },
      { text: "Clubhouse and facility bookings in Hong Kong residential estates are a daily, time-sensitive workload handled largely by counter staff and phone.", kind: "inference" },
      { text: "Management-fee and estate-service queries recur monthly and are handled inconsistently across estates by different site teams.", kind: "inference" },
      { text: "Sustainability and community-programme initiatives add resident engagement activity that currently has no scalable conversational channel.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The property-management arm operates as a service business with conventional IT support and no software engineering capability. Facility booking and service request handling are standard workflows requiring integration into scheduling and work-order systems, exactly the shape of a packaged deployment.",
    whyNotBuild:
      "There is no case for a property group to build speech, telephony, scheduling orchestration and conversation evaluation for estate services. The value is in booking a clubhouse court reliably at 7am, not in owning the technology that takes the request.",
    workflows: [
      {
        name: "Clubhouse and facility booking",
        friction: "Residents queue at the clubhouse counter or phone at opening time to book courts, function rooms and facilities, and availability is checked manually.",
        outcome: "Live availability offered and booked conversationally at any hour, with reminders and one-tap cancellation freeing slots for other residents.",
        channels: ["WhatsApp", "Voice", "Resident app"],
        systems: ["Facility booking system", "Resident records", "Payments", "Access control"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Estate service requests and management-fee queries",
        friction: "Residents call the estate office for faults, moving-in arrangements and fee questions, and records are kept locally with no status back to the resident.",
        outcome: "Requests captured with category and location, raised as work orders, fee balances read live, and closure confirmed to the resident.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Facilities and work-order management", "Management-fee accounting", "Estate records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Sales-launch inquiry and viewing appointment handling",
        friction: "Launch inquiries surge beyond sales-office capacity, and prospects who cannot get through move on to another development.",
        outcome: "Inquiries engaged immediately in the prospect's language, qualified, and booked into sales-office or show-flat appointments.",
        channels: ["WhatsApp", "Voice", "WeChat"],
        systems: ["Sales CRM", "Project information", "Appointment scheduling", "Marketing automation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Estate management offices and clubhouse counters across a large managed portfolio",
        "Resident apps or portals at selected estates covering notices and some bookings",
        "Sales offices and show flats supporting residential launches",
        "Mall and office tenant service teams for the investment portfolio",
      ],
      gaps: [
        "Facility bookings depend on counter hours and manual availability checks",
        "Service requests are not tracked to closure with the resident informed",
        "Management-fee balances and payment options are not self-serviceable",
        "Launch inquiry handling has no elastic capacity",
      ],
    },
    risks: [
      "PDPO applies to resident and owner data held by the property-management arm, with consent bases often estate-specific.",
      "Building management ordinance and owners' committee scrutiny require auditable service records and fair, documented handling of complaints.",
      "Property sales communication rules constrain what an automated agent may say about pricing and availability during a launch.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — estate, clubhouse and sales contact volumes and cost per contact must be validated with Sino Group property-management leadership.",
    },
    pilotScope:
      "Automate clubhouse and facility booking across a defined cluster of managed estates on WhatsApp and voice in Cantonese and English, with live availability, reminders and cancellation handling.",
    expansion: [
      "Add estate service request intake and management-fee balance queries",
      "Add residential launch inquiry capture and show-flat appointment booking",
      "Extend to commercial tenant service requests in the investment portfolio",
    ],
    stakeholders: [
      "General Manager, Property Management",
      "Head of Customer Service / Estate Operations",
      "Head of Sales and Marketing (Residential)",
      "Head of Information Technology, Sino Group",
      "Head of Clubhouse and Facilities Operations",
    ],
    discovery: [
      "How many facility bookings are handled per estate per month, and how are they taken today?",
      "Is there a central work-order system across estates, or does each site keep its own records?",
      "What proportion of estate-office calls are management-fee and payment questions?",
      "Who owns the budget: the property-management company or the developer?",
    ],
    flowTemplate: "appointments",
    scenario: "A resident books the estate badminton court for Saturday morning on WhatsApp at midnight, gets a reminder, and cancels with one tap when plans change.",
  },

  "hk-express": {
    operatingContext:
      "HK Express is Hong Kong's only low-cost carrier, a wholly owned subsidiary of Cathay Pacific Group, operating a single-type narrowbody fleet on dense short-haul routes across Japan, Korea, Southeast Asia and mainland China. Its business model depends on high aircraft utilisation and minimal service overhead: bookings are made online, ancillaries are sold digitally, and the service organisation is deliberately lean relative to passengers carried. That model breaks during disruption — typhoon season, airport congestion and aircraft issues create rebooking and refund surges that arrive all at once, in Cantonese, Mandarin, English, Japanese and Korean, from passengers who are frequently already at an airport. Contact runs through a hotline, web forms, app and social channels.",
    strategicPressure: [
      { text: "HK Express is Hong Kong's only low-cost carrier and a wholly owned subsidiary of Cathay Pacific Group, operating short-haul routes across Asia.", kind: "verified" },
      { text: "Hong Kong's typhoon season reliably produces multi-day disruption events that generate rebooking and refund volume far beyond any staffed capacity.", kind: "verified" },
      { text: "LCC unit economics mean service cost per passenger must stay far below a full-service carrier's, so headcount cannot scale with disruption volume.", kind: "inference" },
      { text: "Passengers span at least five language groups across the network, which a small Hong Kong-based service team cannot cover around the clock.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. HK Express buys its core airline systems — reservations, departure control, digital retailing — from airline technology vendors and has no capacity to build conversational infrastructure. Cathay group ownership means platform decisions may be influenced or shared, which shapes the deal but not the buy-versus-build logic.",
    whyNotBuild:
      "An LCC's entire premise is not spending money on things that do not fly aircraft. Building multilingual speech, telephony across markets, orchestration into reservations and payments, and conversation evaluation would be the most un-LCC decision available, especially for a capability needed hardest a few weeks a year.",
    workflows: [
      {
        name: "Disruption rebooking during typhoon and irregular operations",
        friction: "A disruption event floods the hotline and social channels simultaneously; passengers wait hours while agents rebook one itinerary at a time.",
        outcome: "Affected passengers contacted proactively with live rebooking options they can confirm in-channel, absorbing the spike without adding headcount.",
        channels: ["WhatsApp", "Voice", "App push", "SMS"],
        systems: ["Reservation system", "Departure control", "Disruption management", "Notification services"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refund status and processing enquiries",
        friction: "Refund requests sit in a queue with no visible status, so passengers call repeatedly and escalate to social media, multiplying the workload.",
        outcome: "Live refund state read from the payments pipeline and pushed proactively at each stage, removing the largest source of repeat contact.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Reservation system", "Refund and payments pipeline", "Case management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Booking servicing and ancillary sales",
        friction: "Name corrections, baggage additions and seat changes generate calls that a lean team handles slowly, and ancillary upsell opportunities are missed entirely.",
        outcome: "Self-service booking changes and ancillary purchases completed conversationally in five languages, converting service contacts into revenue.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Reservation system", "Ancillary retailing", "Payments", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online booking and an app with self-service check-in and booking management",
        "A customer hotline and web contact forms for service requests",
        "Digital ancillary retailing for baggage, seats and meals",
        "Social media channels used heavily by passengers during disruption",
      ],
      gaps: [
        "No elastic conversational capacity during disruption events",
        "Refund status is invisible to passengers, driving repeat contact",
        "Language coverage does not match the network footprint around the clock",
        "Proactive disruption communication does not include actionable rebooking",
      ],
    },
    risks: [
      "Consumer protection and air passenger rights regimes differ across the network's destination markets, so disruption entitlements must be applied per jurisdiction.",
      "PDPO consent governs passenger contact data used for proactive messaging channels.",
      "Cathay group technology governance may constrain vendor selection or require alignment with group platforms.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions only — baseline and disruption-peak contact volumes, refund enquiry share and cost per contact must be validated with HK Express customer operations.",
    },
    pilotScope:
      "Deploy disruption rebooking and refund-status automation across WhatsApp, voice and app push in Cantonese, English and Mandarin, with proactive outreach to affected passengers and live rebooking options confirmable in-channel.",
    expansion: [
      "Add Japanese and Korean coverage to match the network's largest outstation markets",
      "Add booking servicing and ancillary sales to convert service contacts into revenue",
      "Extend disruption playbooks to airport ground operations and standby management",
    ],
    stakeholders: [
      "Chief Executive Officer / Chief Commercial Officer",
      "Head of Customer Experience and Contact Centre",
      "Head of Digital and E-commerce",
      "Head of Operations Control / Disruption Management",
      "Cathay group technology representative",
    ],
    discovery: [
      "What is the ratio between normal-day and typhoon-day contact volume, and how long does the backlog take to clear?",
      "How many contacts per refund request are generated because status is invisible?",
      "Can rebooking be executed in the reservation system by an automated agent, and within what fare rules?",
      "How much technology autonomy does HK Express retain from the Cathay group?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A typhoon signal is raised and affected passengers receive rebooking options on WhatsApp within minutes, confirming new flights before the hotline queue forms.",
  },

  "hong-kong-airlines": {
    operatingContext:
      "Hong Kong Airlines is a full-service Hong Kong carrier that has rebuilt its network after a period of financial restructuring, operating regional routes across Asia with a smaller fleet and service organisation than at its peak. Its passenger mix spans leisure travellers, mainland-connecting traffic and Fortune Wings Club members, served in Cantonese, Mandarin and English. Because the restructuring involved refund backlogs and schedule changes, the airline carries a heavier-than-normal load of status enquiries and legacy service cases alongside normal operations. Contact runs through a hotline, web forms, app and travel-agency intermediaries, with a service team sized for a leaner network than the one it is rebuilding.",
    strategicPressure: [
      { text: "Hong Kong Airlines is a full-service Hong Kong carrier that went through financial restructuring and has been rebuilding its route network since.", kind: "verified" },
      { text: "A rebuilding carrier faces rising contact volume as the network grows while its service organisation remains sized for the restructuring period.", kind: "inference" },
      { text: "Refund and legacy-case backlogs from the restructuring period generate repeat status enquiries that add no revenue and consume scarce agent time.", kind: "inference" },
      { text: "Funding capacity for a technology deployment is the binding constraint and must be established before scoping anything beyond a minimal pilot.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The airline has no capacity to build and every incentive to reduce service cost quickly. Its systems are vendor-supplied airline platforms, and a conversational layer would be a configured deployment integrated to reservations and refunds.",
    whyNotBuild:
      "A carrier in recovery cannot justify a technology build of any kind against fleet, network and working-capital priorities. The only viable path is a bought capability with a payback period measured in months, not a platform programme.",
    workflows: [
      {
        name: "Refund status and legacy case enquiries",
        friction: "Passengers with outstanding refunds or legacy cases call repeatedly because no status is visible, and each call re-explains the same history.",
        outcome: "Case and refund state read live and pushed proactively, ending the repeat-contact cycle and freeing agents for revenue-generating service.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Reservation system", "Refund and payments pipeline", "Case management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Schedule-change and rebooking handling",
        friction: "Network rebuilding means frequent schedule changes, and every affected passenger must be reached and rebooked by an agent.",
        outcome: "Affected passengers contacted proactively with rebooking options confirmable in-channel, in three languages, without adding headcount.",
        channels: ["WhatsApp", "Voice", "SMS", "Email"],
        systems: ["Reservation system", "Schedule change management", "Notification services", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Loyalty and booking servicing",
        friction: "Fortune Wings members and general passengers call for mileage, baggage, seat and booking-change help, all queued together regardless of complexity.",
        outcome: "Routine booking and loyalty requests handled conversationally, with only complex or commercial cases reaching agents.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loyalty platform", "Reservation system", "Payments", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online booking and a passenger app with basic booking management",
        "A multilingual customer hotline covering Cantonese, Mandarin and English",
        "A frequent-flyer programme with member servicing",
        "Travel-agency and intermediary distribution with supporting service processes",
      ],
      gaps: [
        "Refund and case status is invisible to passengers, driving repeat calls",
        "Schedule-change rebooking is agent-driven and slow",
        "No conversational channel on messaging platforms passengers already use",
        "Loyalty and general servicing share one queue regardless of complexity",
      ],
    },
    risks: [
      "Financial capacity is the primary qualification risk; procurement may be constrained regardless of business-case strength.",
      "Air passenger rights and consumer protection rules across destination markets govern entitlements communicated during schedule changes.",
      "Legacy refund cases may involve unresolved commercial disputes that must never be handled by an automated agent.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions only — contact volume, refund enquiry share and cost per contact must be validated with Hong Kong Airlines customer service leadership, alongside funding capacity.",
    },
    pilotScope:
      "Automate refund and case status enquiries across voice and WhatsApp in three languages, with live status from the refund pipeline and proactive updates that end repeat calls.",
    expansion: [
      "Add schedule-change notification and in-channel rebooking as the network rebuilds",
      "Add loyalty and general booking servicing to deflect routine queue volume",
      "Add disruption-day playbooks for weather and operational events",
    ],
    stakeholders: [
      "Chief Commercial Officer",
      "Head of Customer Service and Contact Centre",
      "Head of Digital / E-commerce",
      "Head of Revenue Accounting and Refunds",
      "Chief Financial Officer for investment approval",
    ],
    discovery: [
      "How many outstanding refund and legacy cases remain open, and how many contacts does each generate?",
      "What is the current monthly contact volume and average handle time by contact type?",
      "Is there funding approved for customer-service technology in the current cycle?",
      "Can refund and case status be read by an external agent from the current systems?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A passenger waiting on a refund asks on WhatsApp where it stands, gets the exact processing stage and date, and stops calling the hotline weekly.",
  },

  "kmb": {
    operatingContext:
      "Kowloon Motor Bus is Hong Kong's largest franchised bus operator, carrying millions of passenger journeys daily across hundreds of routes in Kowloon and the New Territories, under a franchise granted by the Transport Department. Its passenger relationship is anonymous and high-frequency: people do not have accounts, they have questions about routes, fares, timetables and lost property, plus complaints about specific journeys and drivers. Contact runs through a customer hotline, the App1933 mobile app, email and social media, in Cantonese overwhelmingly, with English and Mandarin for visitors. Franchise conditions make complaint handling and response time a regulatory matter, not just a service preference.",
    strategicPressure: [
      { text: "KMB is Hong Kong's largest franchised bus operator, running hundreds of routes under a Transport Department franchise and operating the App1933 passenger app.", kind: "verified" },
      { text: "Franchise conditions in Hong Kong subject bus operators to scrutiny on complaint handling and service standards, making complaint capture and response a regulatory obligation.", kind: "inference" },
      { text: "Route reorganisations and fare changes trigger predictable spikes in passenger enquiries that a fixed hotline team cannot absorb.", kind: "inference" },
      { text: "Lost property is a high-volume, low-value workflow that consumes disproportionate hotline time relative to its operational importance.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A transport operator's technology function is focused on fleet, scheduling, telematics and the passenger app. Hotline handling for routes, fares and lost property is commodity servicing that will be bought and integrated, not built.",
    whyNotBuild:
      "KMB would have to build Cantonese speech tuned for place names and route numbers, telephony, orchestration into route, timetable and lost-property systems, and complaint-grade evaluation — four capabilities with zero relevance to running buses. The operator buys this the way it buys fare-collection technology.",
    workflows: [
      {
        name: "Route, fare and timetable enquiry deflection",
        friction: "Passengers call the hotline to ask which bus goes where, what it costs and when it runs, and agents read from the same route information the caller could not navigate online.",
        outcome: "Route, fare and timetable questions answered instantly in Cantonese, English or Mandarin from live route data, including real-time arrival where available.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Route and timetable database", "Real-time arrival systems", "Fare tables", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Lost property intake and matching",
        friction: "Lost-property reports are taken by phone, written into a register, and matched manually against items handed in at depots, with the passenger calling back repeatedly.",
        outcome: "Structured lost-property intake with route, time and item description captured, automatic matching against found items, and proactive notification when matched.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Lost property register", "Depot records", "Route and schedule data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Complaint and Octopus fare-dispute intake",
        friction: "Complaints and fare disputes arrive across phone, email and social with inconsistent detail, making investigation slow and franchise reporting laborious.",
        outcome: "Structured complaint capture with route, vehicle, time and issue category, routed automatically for investigation with the passenger kept informed.",
        channels: ["Voice", "WhatsApp", "Email", "Web"],
        systems: ["Complaint case management", "Fleet and duty records", "Fare and Octopus transaction data", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A passenger mobile app with route search and real-time arrival information",
        "A customer service hotline handling routes, complaints and lost property",
        "Email and social media channels used heavily by passengers",
        "Depot-level lost property handling and complaint investigation processes",
      ],
      gaps: [
        "Route and fare enquiries still reach human agents in volume",
        "Lost property matching is manual and requires the passenger to chase",
        "Complaint detail is captured inconsistently across channels",
        "No proactive communication during route changes or major service disruptions",
      ],
    },
    risks: [
      "Franchise conditions and Transport Department oversight require documented complaint handling with defensible response times and records.",
      "PDPO obligations apply to lost-property reports and complaint records containing personal details and journey data.",
      "Passengers include elderly and less digitally confident users, so voice must remain a first-class channel with fast human fallback.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 3.5,
      automationRate: 0.65,
      basis: "Seller assumptions only — hotline, app and social contact volumes and cost per contact must be validated with KMB customer service and operations.",
    },
    pilotScope:
      "Automate route, fare and timetable enquiries plus lost-property intake on the customer hotline and WhatsApp in Cantonese, English and Mandarin, with structured capture and automatic matching for lost items.",
    expansion: [
      "Add structured complaint and fare-dispute intake with automatic routing for investigation",
      "Add proactive service-disruption and route-change communication",
      "Extend to school and residential coach service enquiries and other group business lines",
    ],
    stakeholders: [
      "Head of Customer Service",
      "Operations Director / Head of Bus Operations",
      "Head of Information Technology",
      "Head of Corporate Affairs and regulatory reporting",
      "Head of Depot Operations for lost property and investigations",
    ],
    discovery: [
      "What is the hotline volume split between route enquiries, lost property and complaints?",
      "How is lost property matched today, and what proportion of items are reunited with owners?",
      "What response-time standards does the franchise impose on complaint handling?",
      "Can an automated agent read live route and arrival data from existing systems?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A passenger who left a bag on a Tuen Mun route reports it in Cantonese by phone, and is messaged the moment the depot logs a matching item.",
  },

  "citybus-hk": {
    operatingContext:
      "Citybus is Hong Kong's second major franchised bus operator, under Bravo Transport ownership, running Hong Kong Island routes, cross-harbour services and the airport Cityflyer network, which gives it an unusual mix of daily commuters and international travellers with luggage. Its passenger contact profile mirrors KMB's — routes, fares, timetables, lost property and journey complaints — but with a higher share of English-language and visitor enquiries because of the airport routes. Contact runs through a hotline, app, email and social channels. As a franchised operator it is subject to the same Transport Department service and complaint-handling scrutiny.",
    strategicPressure: [
      { text: "Citybus is a Hong Kong franchised bus operator under Bravo Transport, running Hong Kong Island, cross-harbour and airport Cityflyer routes.", kind: "verified" },
      { text: "Airport route operation raises the share of English-speaking and visitor enquiries, and adds luggage-related lost property that is higher value and more urgent.", kind: "inference" },
      { text: "Franchise oversight makes complaint capture, response time and record-keeping regulatory obligations rather than service preferences.", kind: "inference" },
      { text: "Ownership-level decisions at Bravo Transport may bundle service technology across the group's operating brands.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A bus operator of this scale procures its passenger information, ticketing and service technology. A conversational layer for hotline deflection is a configured deployment against route, timetable and lost-property systems, sponsored by a customer service or operations head.",
    whyNotBuild:
      "Building speech, telephony, orchestration and evaluation to answer route questions would be a category error for a transport operator. Every component is available as a configured product, and none of them makes buses run better.",
    workflows: [
      {
        name: "Route, fare and airport-service enquiry handling",
        friction: "Visitors and commuters call to ask which bus serves which destination and what it costs, and English-language coverage depends on which agent answers.",
        outcome: "Instant multilingual answers from live route and fare data, with airport route guidance including luggage and journey-time information.",
        channels: ["Voice", "WhatsApp", "App", "Web"],
        systems: ["Route and timetable database", "Real-time arrival systems", "Fare tables", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Lost property intake and matching, including airport routes",
        friction: "Items left on airport routes are urgent because the owner is often flying out, but reports are taken by phone and matched manually at depots.",
        outcome: "Structured intake with route and journey time captured, automatic matching against depot records, and immediate notification with collection or forwarding options.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Lost property register", "Depot records", "Route and schedule data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Complaint and fare-dispute intake",
        friction: "Complaints arrive across phone, email and social media with inconsistent detail, slowing investigation and franchise reporting.",
        outcome: "Structured complaint capture routed automatically for investigation, with the passenger updated through to resolution.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Complaint case management", "Fleet and duty records", "Octopus fare data", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A passenger app with route search and real-time arrival information",
        "A customer hotline handling route, complaint and lost-property enquiries",
        "Airport route information channels aimed at visitors",
        "Depot-based lost property and complaint investigation processes",
      ],
      gaps: [
        "English and Mandarin coverage on the hotline is inconsistent",
        "Lost property from airport routes is not handled with the urgency the situation demands",
        "Complaint capture varies by channel, complicating franchise reporting",
        "No proactive communication for route diversions or service disruptions",
      ],
    },
    risks: [
      "Transport Department franchise conditions govern complaint handling standards and record-keeping.",
      "PDPO obligations apply to lost-property and complaint records containing personal and journey data.",
      "Group-level decisions at Bravo Transport may determine whether service technology is procured per brand or across the group.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 3.5,
      automationRate: 0.65,
      basis: "Seller assumptions only — hotline and digital contact volumes and cost per contact must be validated with Citybus customer service leadership.",
    },
    pilotScope:
      "Automate route, fare and airport-service enquiries plus lost-property intake across voice and WhatsApp in Cantonese, English and Mandarin, with automatic matching and notification for found items.",
    expansion: [
      "Add structured complaint and fare-dispute intake with automated routing",
      "Add proactive diversion and disruption communication for affected routes",
      "Extend the deployment across other Bravo Transport operating brands",
    ],
    stakeholders: [
      "Head of Customer Service",
      "Operations Director",
      "Head of Information Technology",
      "Head of Airport and Cross-harbour Services",
      "Group representative from Bravo Transport",
    ],
    discovery: [
      "What share of hotline calls are in English or Mandarin, and how is that staffed today?",
      "How many lost-property reports come from airport routes, and what is the reunification rate?",
      "Are service technology decisions made at Citybus or at Bravo Transport group level?",
      "What complaint response times does the franchise require, and are they currently met?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A departing traveller who left a laptop on a Cityflyer bus reports it in English and is told within the hour which depot has it and how to collect before check-in.",
  },

  "hk-disneyland": {
    operatingContext:
      "Hong Kong Disneyland Resort combines a theme park with multiple themed hotels, dining and retail, operating as a joint venture in which the Hong Kong Government holds a majority stake alongside The Walt Disney Company. Its guest mix is strongly seasonal and cross-border, drawing local families, mainland Chinese visitors and regional tourists, which makes Cantonese, Mandarin and English all first-class service languages. The Magic Access annual membership programme creates a recurring relationship with local guests, generating renewal, blockout-date and benefit enquiries alongside ticket, hotel and dining reservations. Contact runs through a reservations hotline, the resort app, web channels and guest-relations desks in park.",
    strategicPressure: [
      { text: "Hong Kong Disneyland Resort is a joint venture between The Walt Disney Company and the Hong Kong Government, operating a theme park with multiple hotels and a Magic Access membership programme.", kind: "verified" },
      { text: "Attendance is strongly seasonal and cross-border, so contact volume swings sharply with mainland holiday periods and event seasons.", kind: "inference" },
      { text: "Membership renewal, blockout dates and benefit mechanics generate recurring enquiry volume unrelated to ticket sales.", kind: "inference" },
      { text: "Disney global technology standards likely constrain local platform choice, so the deployment must fit an approved architecture.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The resort operates within global Disney technology standards and does not build local customer platforms, but it owns its guest-service operation and can sponsor a market deployment. The realistic shape is a partner-delivered layer that satisfies global standards while serving Hong Kong's specific language and cross-border requirements.",
    whyNotBuild:
      "The resort's operating focus is guest experience delivery, not software. Even Disney's global technology organisation builds for scale across resorts rather than for one market's Cantonese and Mandarin hotline; a local build would satisfy nobody and duplicate a capability available as a configured product.",
    workflows: [
      {
        name: "Ticket, hotel and dining reservation servicing",
        friction: "Guests call to book, change or clarify tickets, hotel stays and dining reservations, and peak-season queues form exactly when booking intent is highest.",
        outcome: "Reservations created and modified conversationally in three languages with live availability, freeing agents for complex itineraries and service recovery.",
        channels: ["Voice", "WhatsApp", "WeChat", "App"],
        systems: ["Ticketing system", "Hotel property management", "Dining reservations", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Magic Access membership servicing",
        friction: "Members ask about renewals, blockout dates, parking and dining benefits, and answers require checking membership tier rules that agents interpret differently.",
        outcome: "Membership status, tier benefits and blockout dates answered consistently from grounded rules, with renewals processed in-channel.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Membership platform", "Ticketing system", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Visit-day guest information and service recovery",
        friction: "In-park questions about wait times, show schedules, accessibility and lost items queue at guest-relations desks, and cross-border visitors face language barriers.",
        outcome: "Visit-day questions answered instantly in the guest's language on their phone, with service-recovery cases escalated to cast members with full context.",
        channels: ["App", "WhatsApp", "WeChat"],
        systems: ["Park operations data", "Show and attraction schedules", "Guest relations case management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A resort mobile app with tickets, park information and wait times",
        "A reservations hotline covering tickets, hotels and dining",
        "The Magic Access annual membership programme with member-facing servicing",
        "In-park guest relations desks handling service recovery and enquiries",
      ],
      gaps: [
        "Peak-season reservation demand exceeds hotline capacity",
        "Membership benefit and blockout answers vary by agent",
        "Cross-border guests lack a servicing channel on the messaging platforms they use",
        "Visit-day questions still require queueing at a physical guest-relations desk",
      ],
    },
    risks: [
      "Disney global technology and brand standards will govern tone, data handling and vendor approval, extending the qualification path.",
      "PDPO applies to guest and member data, with additional complexity for mainland visitors' data handled on cross-border channels.",
      "Guest-facing brand tone is tightly controlled, so any automated conversation must meet a very high consistency bar before launch.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 5,
      automationRate: 0.5,
      basis: "Seller assumptions only — reservations, membership and guest-services contact volumes and cost per contact must be validated with resort guest experience leadership.",
    },
    pilotScope:
      "Automate Magic Access membership servicing — status, benefits, blockout dates and renewals — across WhatsApp, WeChat and voice in three languages, with payments in-channel and escalation to member services for exceptions.",
    expansion: [
      "Add ticket, hotel and dining reservation servicing with live availability",
      "Add visit-day guest information and service-recovery routing",
      "Extend to proactive pre-arrival communication and itinerary preparation",
    ],
    stakeholders: [
      "Vice President, Guest Experience / Operations",
      "Head of Sales and Reservations",
      "Head of Membership and Loyalty",
      "Director of Technology, Hong Kong Disneyland",
      "Regional Disney technology governance representative",
    ],
    discovery: [
      "What is the seasonal swing in reservation and membership contact volume?",
      "How much latitude does the resort have under Disney global technology standards for a local conversational deployment?",
      "How are mainland guests served today, and on which channels?",
      "What share of guest-relations contacts are information requests rather than service recovery?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Magic Access member asks on WeChat in Mandarin whether her tier covers a Lunar New Year visit date, gets a grounded answer, and renews her membership in the same thread.",
  },

  "ocean-park": {
    operatingContext:
      "Ocean Park Hong Kong is the territory's home-grown marine-life theme park on the southern side of Hong Kong Island, operating the main park alongside the Water World waterpark, with hotels on site and a SmartFun annual pass programme that anchors repeat local visitation. It operates under a statutory corporation structure with government support and has been through a sustained repositioning toward conservation, education and event-driven programming. Contact volume is driven by ticket and pass enquiries, event-day operations, Water World seasonal demand, school and group bookings, and membership questions. Its service organisation is modest, and event peaks and weather closures create sharp surges it cannot staff for.",
    strategicPressure: [
      { text: "Ocean Park operates the main marine-life park plus the Water World waterpark and a SmartFun annual pass programme, under a structure with Hong Kong Government support.", kind: "verified" },
      { text: "Event-driven programming and seasonal waterpark demand concentrate enquiry volume into short, predictable peaks the service team cannot staff for.", kind: "inference" },
      { text: "Sustained cost pressure and public accountability make headcount growth difficult, which favours automation of routine ticketing and membership contact.", kind: "inference" },
      { text: "Weather closures and typhoon signals create sudden refund, rebooking and information surges with no elastic capacity behind them.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The park runs vendor ticketing and membership systems with a small IT function, and its financial position rules out any technology build. A configured conversational deployment against ticketing and membership systems is the only realistic shape.",
    whyNotBuild:
      "A publicly supported attraction under cost scrutiny cannot justify hiring speech, telephony, orchestration and evaluation specialists. Its capital priorities are attractions, animal welfare and facilities, and every dollar spent on a service platform build would need to be defended publicly.",
    workflows: [
      {
        name: "Ticket and annual-pass servicing",
        friction: "Guests call about ticket validity, date changes, pass upgrades and blockout rules, and agents interpret pass terms differently.",
        outcome: "Ticket and pass questions answered consistently from grounded terms, with date changes and renewals processed conversationally.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Ticketing system", "Membership platform", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Event-day and weather-closure information surges",
        friction: "A typhoon signal or event day produces a flood of identical questions about opening, refunds and rescheduling that melts the hotline.",
        outcome: "Elastic conversational capacity delivers consistent event and closure information with refund or reschedule options offered in-channel.",
        channels: ["WhatsApp", "Voice", "SMS", "Web"],
        systems: ["Ticketing system", "Park operations status", "Payments and refunds", "Notification services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "School, group and Water World booking enquiries",
        friction: "Group and school bookings involve back-and-forth on dates, pricing, catering and educational programmes, handled by email over days.",
        outcome: "Group enquiries qualified and scheduled conversationally with grounded pricing and programme information, and complex itineraries passed to sales with full context.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Group booking system", "Education programme records", "Ticketing", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online ticketing and an annual pass programme with member benefits",
        "A customer enquiry hotline and email channel",
        "A park website and app carrying opening hours, show times and event information",
        "Group and school booking processes handled by a sales team",
      ],
      gaps: [
        "Pass terms and blockout rules are interpreted inconsistently across agents",
        "No elastic capacity during weather closures and event peaks",
        "Group and school enquiries take days of email exchange",
        "No proactive communication when park operations change on the day",
      ],
    },
    risks: [
      "Public accountability and government stakeholder scrutiny mean procurement must be visibly justified and cost-effective.",
      "PDPO applies to pass member data and to any outbound messaging about events and closures.",
      "Weather closure communications carry safety implications and must be grounded strictly in official park operational status.",
    ],
    economics: {
      volumeMonthly: 80000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — ticketing, membership and group enquiry volumes and cost per contact must be validated with Ocean Park commercial and guest services leadership.",
    },
    pilotScope:
      "Automate ticket and SmartFun annual-pass servicing across WhatsApp, web and voice in three languages, with grounded pass terms, date changes and renewals processed in-channel.",
    expansion: [
      "Add event-day and weather-closure surge handling with refund and reschedule options",
      "Add school, group and Water World booking enquiry qualification",
      "Add proactive pre-visit communication and on-the-day operational updates",
    ],
    stakeholders: [
      "Executive Director, Commercial / Sales and Marketing",
      "Head of Guest Services",
      "Head of Membership and Ticketing",
      "Head of Information Technology",
      "Chief Financial Officer for investment approval",
    ],
    discovery: [
      "What is the enquiry volume difference between a normal week and an event or closure week?",
      "How are SmartFun blockout and benefit questions answered today, and how consistent are the answers?",
      "What refund and reschedule authority could be delegated during a weather closure?",
      "How long does a school or group booking enquiry take from first contact to confirmation?",
    ],
    flowTemplate: "appointments",
    scenario: "A typhoon signal goes up and pass holders asking about opening get a grounded answer plus a one-tap date change for their booked Water World session.",
  },

  "towngas": {
    operatingContext:
      "Towngas, the trading name of The Hong Kong and China Gas Company, supplies piped town gas to the large majority of Hong Kong households and commercial customers, and also operates an extensive mainland China utility business. In Hong Kong its customer relationship is unusually operational: beyond billing and account moves, it must schedule mandatory periodic safety inspections of household gas installations, appliance maintenance visits, and emergency response, all requiring an engineer to enter a home at an agreed time. It also retails gas appliances and service plans, adding a commercial layer to the utility relationship. Customers reach it through a customer hotline, service centres, an app and website, overwhelmingly in Cantonese, with a customer base that skews toward long-tenured households.",
    strategicPressure: [
      { text: "Towngas supplies piped gas to the large majority of Hong Kong households and operates a substantial mainland China utility business alongside the Hong Kong franchise.", kind: "verified" },
      { text: "Periodic safety inspection of household gas installations is a standing operational obligation, making appointment scheduling a permanent, non-discretionary workload rather than a seasonal one.", kind: "verified" },
      { text: "Hong Kong's high residential turnover means account move-in and move-out volume is continuous, and each move generates both an account transaction and often a site visit.", kind: "inference" },
      { text: "Failed and rescheduled appointments waste engineer capacity, and each wasted visit costs more than the entire contact chain that produced it.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. A regulated utility procures its customer-service technology and directs internal capability to network, safety and asset systems. Appointment scheduling and billing servicing are commodity workflows where the value is integration into the scheduling, billing and work-order estate.",
    whyNotBuild:
      "Towngas would gain nothing from owning Cantonese speech, telephony and orchestration infrastructure. Its engineering priorities are network integrity and safety compliance, and a service-platform build would compete with those for scarce capital while delivering a capability available off the shelf.",
    workflows: [
      {
        name: "Safety inspection and maintenance appointment scheduling",
        friction: "Inspection appointments are booked by phone during office hours, no-shows and access failures waste engineer visits, and rescheduling requires another call.",
        outcome: "Appointments offered from live engineer availability, confirmed conversationally, reminded ahead of the visit, and rescheduled with one tap when plans change.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Field service scheduling", "Work-order management", "Customer account records", "Notification services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Account move-in and move-out",
        friction: "Tenants moving in or out call to open or close accounts, provide meter readings and settle final bills, with each step handled sequentially by an agent.",
        outcome: "Move transactions completed conversationally including meter reading capture, final bill explanation and deposit handling, with a service visit booked where needed.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Billing system", "Customer account records", "Meter data", "Field service scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing enquiry and payment servicing",
        friction: "Bill queries — unexpectedly high usage, tariff questions, payment arrangements — arrive by phone and consume agent time explaining the same billing mechanics.",
        outcome: "Bill breakdown explained conversationally against actual usage data, payment taken in-channel, and arrangements offered inside approved policy.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Billing system", "Meter and usage data", "Payment services", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer hotline handling accounts, billing, appointments and emergencies",
        "A customer app and website with account and billing self-service",
        "Field engineering operations for safety inspections, maintenance and emergency response",
        "Customer service centres and appliance retail with service plan offerings",
      ],
      gaps: [
        "Appointment booking and rescheduling depend on reaching an agent in office hours",
        "No proactive reminder-and-reschedule flow that protects engineer capacity",
        "Move-in and move-out still requires a sequential agent-handled conversation",
        "Bill explanation is agent-delivered rather than generated from the customer's own usage",
      ],
    },
    risks: [
      "Gas safety obligations mean an automated agent must never give technical or safety guidance, and any suspected leak or emergency must route instantly to the emergency channel.",
      "PDPO governs customer account, address and usage data used in conversations and outbound reminders.",
      "Utility customers include elderly households, so voice-first design and rapid human fallback are essential, not optional.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — hotline volume across appointments, moves and billing plus cost per contact must be validated with Towngas customer service and field operations.",
    },
    pilotScope:
      "Automate safety inspection and maintenance appointment scheduling, reminders and rescheduling across voice and WhatsApp in Cantonese and English, integrated to field service scheduling, with any safety or emergency cue routed immediately to the emergency line.",
    expansion: [
      "Add account move-in and move-out including meter reading capture and final billing",
      "Add billing enquiry, payment and arrangement handling grounded in usage data",
      "Add proactive outbound for inspection due dates and appliance service plan renewals",
    ],
    stakeholders: [
      "General Manager, Customer Services",
      "Head of Field Operations / Engineering Services",
      "Head of Billing and Revenue Management",
      "Chief Information Officer",
      "Head of Safety and Regulatory Compliance",
    ],
    discovery: [
      "What is the current no-show and reschedule rate on safety inspection appointments, and what does a wasted visit cost?",
      "How many hotline calls per month are appointment booking versus billing versus moves?",
      "Can an automated agent write bookings directly into the field scheduling system?",
      "What is the required escalation path for any conversation that touches a suspected gas safety issue?",
    ],
    flowTemplate: "appointments",
    scenario: "A tenant books her mandatory gas safety inspection on WhatsApp for Saturday morning, gets a reminder the night before, and reschedules in one tap when work intervenes.",
  },

  "hk-electric": {
    operatingContext:
      "HK Electric supplies electricity to Hong Kong Island, Ap Lei Chau and Lamma Island under a Scheme of Control arrangement with the Government, operating as one of the territory's two vertically integrated electricity suppliers. Its service relationship is account-centric rather than product-centric: customers contact it to open and close accounts as they move, to query bills and tariffs, to arrange payment, and to report supply issues. Hong Kong Island's dense rental market produces continuous account churn, with move-in and move-out transactions clustering at month ends. Contact runs through a customer hotline, customer centres, an app and website, predominantly in Cantonese, with a growing English-speaking expatriate segment on the Island.",
    strategicPressure: [
      { text: "HK Electric supplies electricity to Hong Kong Island, Ap Lei Chau and Lamma under a Scheme of Control arrangement with the Hong Kong Government.", kind: "verified" },
      { text: "Hong Kong Island's high rental turnover generates continuous account move-in and move-out volume that clusters around month ends and lease cycles.", kind: "inference" },
      { text: "Scheme of Control arrangements tie returns to permitted asset investment, so operating cost discipline in customer service is a direct earnings lever.", kind: "inference" },
      { text: "Tariff adjustments and fuel-cost pass-through changes trigger predictable spikes in billing enquiries across the customer base.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A regulated electricity supplier concentrates engineering on generation, network and metering assets and procures customer service technology. Account move handling and billing enquiry are commodity workflows requiring integration to billing and meter systems, not invention.",
    whyNotBuild:
      "There is no strategic reason for a utility to own conversational infrastructure. Every component — Cantonese speech, telephony, billing orchestration, evaluation — is undifferentiated for an electricity supplier whose competitive position derives from its regulated franchise, not its contact centre.",
    workflows: [
      {
        name: "Account move-in and move-out",
        friction: "Movers call to open or close accounts, supply meter readings and settle final bills, and each transaction takes an agent through a sequential script.",
        outcome: "Move transactions completed conversationally with meter reading capture, deposit handling, final bill explanation and confirmation, at any hour.",
        channels: ["Voice", "WhatsApp", "Web", "App"],
        systems: ["Billing system", "Customer account records", "Meter data management", "Payment services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing and tariff enquiry handling",
        friction: "Customers query high bills and tariff changes, and agents explain the same billing mechanics repeatedly without showing the customer's own consumption pattern.",
        outcome: "Bill explained against the customer's actual usage and tariff, with payment taken in-channel and arrangements offered within policy.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Billing system", "Meter and consumption data", "Tariff tables", "Payment services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Supply enquiry triage and outage information",
        friction: "Supply interruptions produce simultaneous calls asking the same questions, and the hotline cannot distinguish a premises fault from a network outage without an agent.",
        outcome: "Outage status delivered instantly from network systems, premises-specific faults triaged and dispatched, and restoration updates pushed proactively.",
        channels: ["Voice", "SMS", "App"],
        systems: ["Outage management system", "Network operations data", "Work-order dispatch", "Notification services"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer hotline covering accounts, billing and supply enquiries",
        "A customer app and website with account, billing and consumption self-service",
        "Customer service centres for in-person account transactions",
        "Emergency and supply-fault reporting channels with field dispatch",
      ],
      gaps: [
        "Account moves cannot be completed end-to-end outside office hours",
        "Bill explanations are agent-delivered rather than grounded in the customer's own usage",
        "Outage enquiries reach agents rather than being answered from network status",
        "No proactive restoration or tariff-change communication with two-way response",
      ],
    },
    risks: [
      "Scheme of Control and government oversight require documented, fair customer treatment and defensible complaint handling.",
      "Electricity supply issues carry safety implications, so any fault or hazard cue must route immediately to the emergency channel and never be handled conversationally.",
      "PDPO governs consumption data, which is personally revealing, and constrains its use in conversation and outbound messaging.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — hotline volume across moves, billing and supply enquiries plus cost per contact must be validated with HK Electric customer services.",
    },
    pilotScope:
      "Automate account move-in and move-out end to end across voice and WhatsApp in Cantonese and English, including meter reading capture, deposit handling and final bill explanation, with escalation for disputes.",
    expansion: [
      "Add billing and tariff enquiry handling grounded in the customer's own consumption data",
      "Add outage status and premises-fault triage with proactive restoration updates",
      "Add proactive tariff-change and payment-arrangement outreach",
    ],
    stakeholders: [
      "Head of Customer Services",
      "Head of Billing and Revenue",
      "Head of Information Technology",
      "Head of Network Operations for outage communication",
      "Head of Regulatory Affairs and Compliance",
    ],
    discovery: [
      "How many move-in and move-out transactions are processed monthly, and what proportion arrive by phone?",
      "What is the contact-volume split between account moves, billing and supply enquiries?",
      "Can an automated agent write account transactions directly into the billing system?",
      "What is the mandated escalation path for any conversation touching an electrical safety issue?",
    ],
    flowTemplate: "onboarding",
    scenario: "A tenant moving into a Sai Ying Pun flat opens an account on WhatsApp at 10pm, submits a meter photo, and has power in her name the next morning.",
  },

  "smartone": {
    operatingContext:
      "SmarTone is a Hong Kong mobile operator backed by Sun Hung Kai Properties, competing in a saturated four-player market where it has consistently positioned on network quality and customer service rather than price. Its business spans consumer mobile with handset-bundled plans, home broadband, roaming and IoT and enterprise services. The handset-plan cycle drives a rhythm of contract expiries, retention conversations and upgrade offers that dominate outbound activity, while inbound is driven by billing queries, roaming activation and data-usage questions. Customers reach it through retail shops, a hotline, an app and messaging, in Cantonese primarily with English and Mandarin for expatriate and mainland customers.",
    strategicPressure: [
      { text: "SmarTone is one of four mobile network operators in a saturated Hong Kong market, backed by Sun Hung Kai Properties and positioned on network quality and service.", kind: "verified" },
      { text: "Handset-bundled contract cycles create predictable expiry waves where retention conversations must happen within a narrow window or the customer ports out.", kind: "inference" },
      { text: "In a saturated market with negligible subscriber growth, retention economics dominate: the cost of a save conversation is trivially small against the lifetime value at risk.", kind: "inference" },
      { text: "Roaming and travel-related servicing has rebounded with outbound travel from Hong Kong, adding time-sensitive activation and billing queries.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. SmarTone is sub-scale relative to global telcos and procures its BSS, CRM and contact-centre technology from vendors. Retention and servicing conversations are configured workflows against billing and CRM systems, and the operator's decision cycle can be driven by a consumer business head with a clear retention business case.",
    whyNotBuild:
      "Building speech, telephony, orchestration and evaluation would require an engineering organisation the operator does not have and could not justify against a subscriber base of Hong Kong scale. Its differentiation is network quality and shop service, neither of which improves by owning a conversation platform.",
    workflows: [
      {
        name: "Contract-expiry retention conversations",
        friction: "Retention calls are made by a limited outbound team, reach only part of the expiring base, and the offer made varies with the agent.",
        outcome: "Every expiring customer engaged in their preferred channel with offers drawn from an approved matrix, and high-value saves routed to human specialists.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["CRM", "Billing and subscription management", "Offer and pricing matrix", "Retention analytics"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Roaming activation and travel billing queries",
        friction: "Customers activate roaming or query travel charges at the airport or abroad, when hotline access is hardest and the answer is most urgent.",
        outcome: "Roaming packs activated and travel charges explained conversationally at any hour, in-channel, from live billing data.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Billing system", "Roaming provisioning", "Product catalogue", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing enquiry and plan-change servicing",
        friction: "Bill shocks and plan questions produce hotline volume where agents explain charges line by line and process plan changes manually.",
        outcome: "Charges explained against actual usage, plan changes executed within policy, and add-ons purchased in the conversation.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Billing system", "Usage data", "Subscription management", "Payment services"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app with billing, usage and plan self-service",
        "A retail shop network handling upgrades, handsets and service",
        "A multilingual customer hotline with segmented service tiers",
        "SMS and app notification programmes for billing and contract reminders",
      ],
      gaps: [
        "Retention outreach reaches only part of the expiring base within the decision window",
        "Roaming activation is not conversational at the moment of travel",
        "Bill explanations require an agent rather than being generated from usage",
        "Offer consistency depends on which agent handles the save conversation",
      ],
    },
    risks: [
      "PDPO consent governs outbound retention contact, especially on messaging channels, and Hong Kong's do-not-call arrangements constrain unsolicited marketing calls.",
      "Telecom regulatory expectations on transparent charging and contract terms require any automated offer to be presented accurately and recorded.",
      "Offer authority delegated to an automated agent must be bounded by an approved matrix with margin controls and full audit.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — inbound and outbound contact volumes, expiring-base size and cost per contact must be validated with SmarTone consumer business leadership.",
    },
    pilotScope:
      "Automate contract-expiry retention conversations across voice and WhatsApp in three languages, with offers drawn strictly from an approved matrix, in-channel acceptance, and high-value saves routed to human specialists.",
    expansion: [
      "Add roaming activation and travel billing servicing at the moment of travel",
      "Add billing enquiry and plan-change servicing grounded in usage data",
      "Add proactive usage and bill-shock prevention outreach ahead of billing cycles",
    ],
    stakeholders: [
      "Chief Executive Officer / Head of Consumer Business",
      "Head of Customer Retention and Loyalty",
      "Head of Customer Service Operations",
      "Chief Technology / Information Officer",
      "Head of Regulatory and Compliance",
    ],
    discovery: [
      "How many contracts expire each month, and what share are contacted before expiry?",
      "What is the current save rate, and how much does offer variance cost in margin?",
      "What consent basis exists for WhatsApp and voice outreach to the customer base?",
      "Can plan changes and roaming packs be provisioned by an automated agent within policy?",
    ],
    flowTemplate: "retention",
    scenario: "A customer three weeks from contract expiry is engaged on WhatsApp in Cantonese, compares two approved offers, and renews without ever visiting a shop.",
  },

  "china-mobile-hk": {
    operatingContext:
      "China Mobile Hong Kong is the Hong Kong operating subsidiary of China Mobile, one of the territory's larger mobile operators by subscribers, with a proposition built heavily around cross-boundary connectivity — combined Hong Kong and mainland plans, Greater Bay Area data products and roaming for frequent border crossers. Its subscriber mix therefore skews toward customers with mainland connections, making Mandarin as important as Cantonese in servicing, and WeChat as important as WhatsApp as a contact channel. Contact volume is driven by billing and plan questions, cross-boundary data and roaming activation, port-in and port-out processes, and prepaid top-ups. Retail shops, a hotline and digital channels carry the service load.",
    strategicPressure: [
      { text: "China Mobile Hong Kong is the Hong Kong subsidiary of China Mobile and competes as one of the territory's larger mobile operators with a strong cross-boundary proposition.", kind: "verified" },
      { text: "Greater Bay Area integration policy has made cross-boundary mobile and data products a growth area, generating servicing questions that span two regulatory and network environments.", kind: "inference" },
      { text: "A subscriber base with heavy mainland linkage makes Mandarin-language and WeChat-channel servicing a structural requirement, not an add-on.", kind: "inference" },
      { text: "Parent-group technology direction may constrain local platform choice, so procurement autonomy is the key qualification question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The parent group has vast internal technology capability, but the Hong Kong unit operates under a separate licence, serves a Cantonese and Mandarin mix, and runs a distinct contact estate. The realistic shape is a partner-delivered local deployment integrated to Hong Kong BSS and CRM, subject to group architecture alignment.",
    whyNotBuild:
      "The Hong Kong unit does not have the engineering headcount to build speech, telephony, orchestration and evaluation, and the parent's mainland platforms are not designed for a Hong Kong-licensed operator's language mix, regulatory obligations or channel estate. Localising a mainland stack would cost more than deploying a governed platform configured locally.",
    workflows: [
      {
        name: "Cross-boundary plan and roaming servicing",
        friction: "Customers ask which plan covers mainland usage, how to activate cross-boundary data, and why charges appeared, and answers require checking product rules that differ per plan.",
        outcome: "Grounded, plan-specific answers in Mandarin or Cantonese with activation executed in-channel and charges explained against actual usage.",
        channels: ["WeChat", "WhatsApp", "Voice", "App"],
        systems: ["Billing system", "Product catalogue", "Roaming and provisioning", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing enquiry and prepaid top-up",
        friction: "Billing questions and prepaid top-ups drive high-volume, low-value contacts that agents handle one at a time, disproportionately expensive against prepaid revenue.",
        outcome: "Balance, charge and top-up requests handled conversationally with payment in-channel, twenty-four hours a day, in both languages.",
        channels: ["WeChat", "Voice", "WhatsApp", "App"],
        systems: ["Billing system", "Prepaid platform", "Payment services", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Port-in and number-transfer support",
        friction: "Port-in customers need guidance on documentation, timing and SIM activation, and a failed port generates several frustrated contacts during the switch.",
        outcome: "Port-in guided step by step with status pushed proactively and exceptions routed to a specialist before the customer loses service.",
        channels: ["WeChat", "WhatsApp", "Voice"],
        systems: ["Number portability workflow", "Provisioning", "CRM", "Retail order systems"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app with billing, usage and plan management",
        "A retail shop network handling SIM, plan and device transactions",
        "A bilingual hotline covering Cantonese, Mandarin and English",
        "Messaging presence on the platforms mainland-linked customers use",
      ],
      gaps: [
        "Cross-boundary product rules are not consistently explained across channels",
        "Prepaid top-up and balance queries still consume agent time",
        "Port-in progress is invisible to the customer during the switch",
        "No unified conversational context between WeChat, hotline and shop interactions",
      ],
    },
    risks: [
      "Cross-boundary data-transfer rules constrain where Hong Kong subscriber conversation data can be processed, particularly if any component sits in mainland infrastructure.",
      "Communications Authority expectations on transparent charging and contract terms apply to any automated offer or explanation.",
      "Parent-group technology mandates may limit vendor selection, so local procurement autonomy must be confirmed early.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 3.5,
      automationRate: 0.65,
      basis: "Seller assumptions only — inbound contact volumes across billing, roaming and prepaid plus cost per contact must be validated with the Hong Kong unit's customer service leadership.",
    },
    pilotScope:
      "Automate cross-boundary plan, roaming and billing servicing on WeChat, WhatsApp and voice in Mandarin and Cantonese, with activation and top-up executed in-channel from live billing data.",
    expansion: [
      "Add port-in guidance and proactive status during number transfers",
      "Add retention conversations for contract-expiry and plan-upgrade cycles",
      "Extend to enterprise and IoT customer servicing for business accounts",
    ],
    stakeholders: [
      "Chief Executive / Head of Consumer Business, Hong Kong",
      "Head of Customer Service and Contact Centre",
      "Head of Product and Cross-boundary Business",
      "Chief Technology Officer, Hong Kong",
      "Head of Compliance and Data Privacy",
    ],
    discovery: [
      "Does the Hong Kong unit select and contract customer-facing technology independently of the mainland parent?",
      "What share of contacts relate to cross-boundary plans and roaming versus domestic billing?",
      "Where must Hong Kong subscriber conversation data be processed and stored?",
      "How much of the contact base uses WeChat rather than WhatsApp or voice?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A frequent border crosser asks on WeChat in Mandarin why mainland data charged extra, gets the plan rule explained, and activates the right cross-boundary pack instantly.",
  },

  "three-hk": {
    operatingContext:
      "3 Hong Kong is CK Hutchison's Hong Kong mobile operator, competing aggressively on price in a saturated four-player market with a product mix weighted toward prepaid, value postpaid plans, roaming products and home broadband. Price-led positioning means a large base of low-ARPU customers whose servicing cost must be kept far below what a premium operator can absorb, and prepaid customers in particular generate frequent, low-value top-up and balance contacts. The operator also serves a significant segment of domestic helpers and visitors whose language needs extend beyond Cantonese and English. Contact runs through retail shops, a hotline, the app and messaging channels.",
    strategicPressure: [
      { text: "3 Hong Kong is CK Hutchison's Hong Kong mobile brand competing in a saturated four-operator market with a price-led, prepaid-heavy proposition.", kind: "verified" },
      { text: "Prepaid and low-ARPU customers generate frequent, low-value contacts whose handling cost can approach or exceed the monthly revenue of the account.", kind: "inference" },
      { text: "Roaming and travel products drive time-sensitive service contacts concentrated around travel dates rather than billing cycles.", kind: "inference" },
      { text: "CK Hutchison group telecom procurement may bundle Hong Kong with other markets, changing the deal shape and decision path.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Group telecom units are established buyers of vendor CX and BSS platforms, and a price-led operator has every incentive to cut cost-to-serve quickly rather than fund a build. The deployment is a configured integration against billing, prepaid and CRM systems.",
    whyNotBuild:
      "A discount operator's entire strategy is structural cost advantage. Hiring speech, telephony, orchestration and evaluation engineers to build what can be configured would invert that logic, and the group's technology governance would not sanction a single-market platform build.",
    workflows: [
      {
        name: "Prepaid top-up, balance and validity servicing",
        friction: "Prepaid customers call or visit shops to check balance, extend validity and top up, generating high contact volume against very low revenue per account.",
        outcome: "Balance, validity and top-up handled conversationally with payment in-channel in multiple languages, at a fraction of assisted cost.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Prepaid platform", "Payment services", "Product catalogue", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Roaming pack purchase and travel servicing",
        friction: "Travellers buy roaming packs at the last minute and query charges while abroad, when shop and hotline access is least convenient.",
        outcome: "Roaming packs offered and activated conversationally before and during travel, with charges explained from live usage.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Roaming provisioning", "Billing system", "Product catalogue", "Payment services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing enquiry and plan-change deflection",
        friction: "Postpaid billing questions and plan changes queue on a hotline sized for cost rather than demand, producing long waits and shop overflow.",
        outcome: "Charges explained against usage and plan changes executed within policy, deflecting volume from both hotline and retail shops.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Billing system", "Subscription management", "Usage data", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app with balance, top-up and plan self-service",
        "A retail shop network including outlets serving prepaid and visitor segments",
        "A customer hotline covering prepaid and postpaid service",
        "Online and third-party top-up channels for prepaid customers",
      ],
      gaps: [
        "Prepaid servicing still generates shop and hotline traffic that self-service has not absorbed",
        "Language coverage does not extend to all significant customer segments",
        "Roaming purchase is not conversational at the moment of travel",
        "Billing explanations require an agent rather than being generated from usage data",
      ],
    },
    risks: [
      "Communications Authority expectations on transparent charging and contract terms apply to automated explanations and offers.",
      "PDPO consent governs outbound messaging to prepaid customers, many of whom have minimal registered contact data.",
      "CK Hutchison group procurement may require a multi-market framework rather than a Hong Kong-only contract.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 3,
      automationRate: 0.7,
      basis: "Seller assumptions only — prepaid and postpaid contact volumes and cost per contact must be validated with the Hong Kong consumer business team.",
    },
    pilotScope:
      "Automate prepaid top-up, balance, validity and roaming pack servicing across WhatsApp and voice in Cantonese, English and at least one additional customer-segment language, with payment executed in-channel.",
    expansion: [
      "Add postpaid billing enquiry and plan-change deflection",
      "Add proactive validity-expiry and roaming pre-travel outreach",
      "Extend to home broadband servicing and installation scheduling",
    ],
    stakeholders: [
      "Head of Consumer Business, 3 Hong Kong",
      "Head of Customer Service Operations",
      "Head of Prepaid and Roaming Products",
      "Chief Information Officer",
      "CK Hutchison group telecom procurement representative",
    ],
    discovery: [
      "What is the cost to serve a prepaid contact today relative to the account's monthly revenue?",
      "How much prepaid servicing still lands in retail shops rather than digital channels?",
      "Which customer-segment languages beyond Cantonese and English are material?",
      "Would this be contracted in Hong Kong or through a CK Hutchison group framework?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A prepaid customer checks her validity on WhatsApp, tops up in-channel, and buys a Japan roaming pack the night before flying, without visiting a shop.",
  },

  "gleneagles-hk": {
    operatingContext:
      "Gleneagles Hospital Hong Kong is a private tertiary hospital in Wong Chuk Hang, developed as a partnership involving IHH Healthcare and The University of Hong Kong, offering multi-specialty inpatient and outpatient care with a strong emphasis on transparent, packaged pricing for common procedures. Its patient mix spans local privately insured patients, self-pay patients and a mainland-visitor segment seeking Hong Kong medical care, which makes trilingual servicing essential. Contact volume is driven by specialist appointment booking, package price and inclusion enquiries, insurer pre-authorisation coordination, and admission preparation. Bookings run through a call centre, specialist clinic desks, a website and increasingly messaging, with insurer coordination handled by administrative staff.",
    strategicPressure: [
      { text: "Gleneagles Hospital Hong Kong is a private tertiary hospital in Wong Chuk Hang developed with IHH Healthcare and The University of Hong Kong, offering packaged-price procedures.", kind: "verified" },
      { text: "Packaged pricing invites detailed enquiries about inclusions, exclusions and insurer coverage, which are administrative rather than clinical but consume trained staff time.", kind: "inference" },
      { text: "A mainland-visitor patient segment requires Mandarin servicing and remote pre-arrival coordination that a locally staffed call centre covers unevenly.", kind: "inference" },
      { text: "IHH regional digital programmes may already cover appointment automation, which would change the scope of a Hong Kong deployment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. IHH runs regional technology programmes and vendor selections, and the Hong Kong hospital operates within that framework rather than building its own systems. A deployment would be partner-delivered against the hospital's scheduling, patient administration and insurer coordination systems, aligned to regional standards.",
    whyNotBuild:
      "A hospital's technology capability goes to clinical systems, patient records and safety. Building trilingual speech with medical vocabulary, telephony, scheduling orchestration and clinical-grade evaluation is neither feasible nor desirable for a single hospital, and the clinical risk of getting it wrong internally is far higher than the cost of buying it governed.",
    workflows: [
      {
        name: "Specialist appointment booking and rescheduling",
        friction: "Patients call clinic desks during office hours to book or move specialist appointments, and staff check consultant availability manually while the caller waits.",
        outcome: "Live consultant availability offered and booked conversationally in three languages, with reminders and one-tap rescheduling reducing wasted slots.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Appointment scheduling", "Consultant rosters", "Patient administration system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Package price and inclusion enquiries",
        friction: "Prospective patients ask what a procedure package covers and what it will actually cost with their insurance, and answers require staff to check package definitions and insurer terms.",
        outcome: "Grounded package inclusion and pricing answers delivered consistently, with insurer pre-authorisation initiated and clinical questions routed to medical staff.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Package pricing catalogue", "Insurer coordination workflow", "Patient administration", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Admission preparation and pre-arrival coordination",
        friction: "Patients arrive for admission without required documents, fasting instructions followed, or insurer paperwork complete, causing delays and rescheduled procedures.",
        outcome: "Pre-admission checklists delivered and confirmed conversationally, with documents collected in-channel and gaps escalated before the admission date.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Patient administration system", "Document management", "Insurer coordination", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A hospital call centre handling appointment booking and general enquiries",
        "Specialist outpatient clinic desks with their own scheduling processes",
        "A website publishing packaged procedure pricing and specialist information",
        "Administrative teams coordinating insurer pre-authorisation and billing",
      ],
      gaps: [
        "Appointments cannot be booked or changed outside call-centre hours",
        "Package pricing and insurer coverage answers vary by staff member",
        "Pre-admission preparation is not systematically confirmed with the patient",
        "Mainland patients have no reliable remote coordination channel before travelling",
      ],
    },
    risks: [
      "An automated agent must never provide clinical advice or triage; the boundary between administrative and clinical conversation must be enforced by design.",
      "Patient data is highly sensitive under PDPO, requiring strict retention, access control and purpose limitation on transcripts and documents.",
      "IHH regional governance may already commit the hospital to a platform direction, changing the scope of what can be procured locally.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 5,
      automationRate: 0.5,
      basis: "Seller assumptions only — call-centre and clinic contact volumes and cost per contact must be validated with hospital operations leadership.",
    },
    pilotScope:
      "Automate specialist appointment booking, reminders and rescheduling across voice and WhatsApp in Cantonese, English and Mandarin, with all clinical questions routed immediately to qualified staff.",
    expansion: [
      "Add package price and inclusion enquiries with insurer pre-authorisation initiation",
      "Add pre-admission preparation and document collection ahead of procedures",
      "Add mainland-patient pre-arrival coordination on messaging channels",
    ],
    stakeholders: [
      "Chief Executive Officer / Hospital Director",
      "Head of Patient Services / Operations",
      "Head of Business Development and International Patients",
      "Head of Information Technology",
      "Medical Director for clinical boundary governance",
    ],
    discovery: [
      "How many appointment bookings and changes are handled by phone each month, and what is the no-show rate?",
      "How are package price and insurer coverage questions answered today, and how consistent are those answers?",
      "Does IHH regional digital programme already cover appointment automation for Hong Kong?",
      "What is the mandated escalation path for any conversation that touches clinical symptoms?",
    ],
    flowTemplate: "appointments",
    scenario: "A mainland patient books a specialist consultation on WhatsApp in Mandarin, receives the pre-visit document list, and arrives with insurer pre-authorisation already in progress.",
  },

  "hk-sanatorium": {
    operatingContext:
      "Hong Kong Sanatorium and Hospital is one of the territory's oldest and most established private hospitals, in Happy Valley, offering a broad range of inpatient, outpatient, specialist and diagnostic services, and known particularly for its high-volume health assessment or body-check business alongside oncology and other specialist strengths. It operates independently rather than as part of a hospital group, which means technology decisions are made in-house without a regional parent's roadmap. Its patient base includes long-standing local families, corporate health-scheme members and a mainland patient segment attracted by its reputation. Booking and enquiry volume flows through a call centre, clinic desks, a website and a patient portal.",
    strategicPressure: [
      { text: "Hong Kong Sanatorium and Hospital is a long-established independent private hospital in Happy Valley with a broad specialist and diagnostic offering.", kind: "verified" },
      { text: "Health assessment packages are a high-volume, appointment-driven business line that generates booking and preparation contact disproportionate to its revenue share.", kind: "inference" },
      { text: "Independence from a hospital group means no regional technology roadmap to inherit, making the hospital a genuine local buyer.", kind: "inference" },
      { text: "Mainland patient demand adds Mandarin-language and pre-arrival coordination requirements the call centre handles unevenly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. An independent hospital with an internal IT function focused on clinical systems will procure a conversational layer rather than build one. Appointment and preparation workflows are well-defined and integrate to scheduling and patient administration systems the hospital already runs.",
    whyNotBuild:
      "Clinical safety, patient records and diagnostic systems consume the hospital's technology capacity. Building speech, telephony, scheduling orchestration and evaluation for administrative conversations would be an irresponsible allocation of an IT team whose primary duty is clinical system reliability.",
    workflows: [
      {
        name: "Health assessment package booking and preparation",
        friction: "Body-check bookings are taken by phone with staff explaining package options and fasting or preparation requirements verbally, and patients arrive unprepared.",
        outcome: "Package options explained from grounded content, appointments booked against live capacity, and preparation instructions delivered and confirmed before the visit.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Appointment scheduling", "Health assessment package catalogue", "Patient administration", "Notification services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Specialist appointment scheduling and rescheduling",
        friction: "Specialist bookings require checking consultant availability across clinics, and rescheduling means another call during office hours.",
        outcome: "Live availability offered across consultants, bookings and changes made conversationally, and reminders reduce wasted specialist slots.",
        channels: ["Voice", "WhatsApp", "Patient portal"],
        systems: ["Appointment scheduling", "Consultant rosters", "Patient administration", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Results and report enquiry triage",
        friction: "Patients call to ask whether reports are ready and when they can collect them, occupying clinical and administrative staff with pure status questions.",
        outcome: "Report readiness and collection logistics answered administratively, with any clinical content strictly reserved for qualified staff.",
        channels: ["Voice", "WhatsApp", "Patient portal"],
        systems: ["Laboratory and diagnostic systems", "Patient administration", "Appointment scheduling", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A hospital call centre handling appointments and general enquiries",
        "A patient portal with selected appointment and record access",
        "Health assessment package booking operations with dedicated coordination staff",
        "Specialist clinic desks managing consultant schedules",
      ],
      gaps: [
        "Bookings and changes are constrained to call-centre and clinic hours",
        "Preparation instructions are delivered verbally and not confirmed",
        "Report readiness questions consume staff who should be handling clinical work",
        "Mainland patients lack a structured pre-arrival coordination channel",
      ],
    },
    risks: [
      "Any conversation touching symptoms, results interpretation or clinical advice must escalate immediately to qualified staff — the boundary must be enforced technically.",
      "Patient and diagnostic data is highly sensitive under PDPO, with strict controls needed on transcripts, storage and access.",
      "An independent hospital's procurement is cautious and clinically governed, so a pilot must be scoped conservatively with clear clinical sign-off.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 5,
      automationRate: 0.55,
      basis: "Seller assumptions only — call-centre and clinic contact volumes and cost per contact must be validated with hospital administration.",
    },
    pilotScope:
      "Automate health assessment package booking and pre-visit preparation across voice and WhatsApp in three languages, with grounded package content, live capacity and confirmed preparation instructions, escalating any clinical question.",
    expansion: [
      "Add specialist appointment scheduling and rescheduling across consultant clinics",
      "Add report readiness and collection logistics as an administrative-only workflow",
      "Add mainland-patient pre-arrival coordination and document preparation",
    ],
    stakeholders: [
      "Hospital Chief Executive / General Manager",
      "Head of Patient Services and Admissions",
      "Head of Health Assessment Centre",
      "Head of Information Technology",
      "Medical Director for clinical governance",
    ],
    discovery: [
      "How many health assessment bookings are taken monthly, and what proportion arrive unprepared?",
      "What is the no-show rate for specialist appointments, and is it measured?",
      "How many calls are report-readiness enquiries that never needed clinical staff?",
      "What clinical governance sign-off would a patient-facing automated agent require?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient books a body-check package on WhatsApp, receives the fasting instructions the night before, and arrives correctly prepared without a single phone call.",
  },

  "quality-healthcare": {
    operatingContext:
      "Quality HealthCare Medical Services is Hong Kong's largest private primary-care network, owned by Bupa, operating a large number of general practice, specialist, dental, physiotherapy and diagnostic centres across the territory, alongside corporate health schemes that give employees direct access to the network. Its volume model is fundamentally different from a hospital's: very large numbers of short, same-day or next-day appointments across many locations, with eligibility depending on which corporate or insurance scheme the patient belongs to. Contact is driven by appointment booking and changes, scheme eligibility and coverage confirmation, clinic location and hours, and results enquiries. Booking runs through a central hotline, individual clinic reception desks, an app and web channels.",
    strategicPressure: [
      { text: "Quality HealthCare is Hong Kong's largest private primary-care network, owned by Bupa, spanning general practice, specialist, dental and physiotherapy centres.", kind: "verified" },
      { text: "Corporate health schemes mean eligibility varies by employer and plan, so a large share of contacts are coverage confirmations rather than clinical bookings.", kind: "verified" },
      { text: "Same-day primary-care demand concentrates calls into early-morning peaks that clinic reception and the hotline cannot absorb without long waits.", kind: "inference" },
      { text: "Bupa group ownership creates an adjacency where insurance eligibility and clinic booking could be handled in one conversation, which no competitor can match.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A care-delivery network procures its scheduling and patient systems and has no software engineering function. Distributed appointment booking with scheme eligibility checks is a classic packaged workflow, and the Bupa adjacency strengthens rather than weakens the buy case by widening the integration surface.",
    whyNotBuild:
      "Clinic networks compete on access, location and clinical quality. Building trilingual speech, telephony across dozens of clinic lines, scheduling orchestration and evaluation would consume the entire IT budget for a capability that adds nothing clinically and is available configured.",
    workflows: [
      {
        name: "Same-day GP and specialist appointment booking",
        friction: "Early-morning demand for same-day slots overwhelms the hotline and clinic reception, and patients call multiple clinics to find availability.",
        outcome: "Live availability across the whole network offered conversationally, with the nearest available slot booked and confirmed instantly.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Central appointment scheduling", "Clinic rosters", "Patient records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Corporate scheme eligibility and coverage confirmation",
        friction: "Patients ask whether their employer scheme covers a visit, a specialist referral or a dental procedure, and reception staff check scheme documents manually.",
        outcome: "Scheme-specific eligibility answered from grounded scheme data at the point of booking, preventing surprise charges and reception disputes.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Scheme eligibility database", "Corporate contract records", "Billing", "Appointment scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Appointment reminders and no-show recovery",
        friction: "No-shows waste clinician time across a large network, and cancellations arriving late leave slots unfilled.",
        outcome: "Reminders with one-tap reschedule reduce no-shows, and released slots are offered proactively to waiting patients.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Appointment scheduling", "Notification services", "Patient records", "CRM"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A central appointment booking hotline serving the clinic network",
        "Clinic reception desks handling walk-ins and local bookings",
        "A patient app and web booking channel for selected services",
        "Corporate scheme administration linking employer plans to clinic access",
      ],
      gaps: [
        "Same-day availability across the network is not visible in one conversation",
        "Scheme eligibility is confirmed manually and inconsistently",
        "No-show reduction depends on basic reminders without easy rescheduling",
        "Insurance eligibility and clinic booking remain separate journeys despite common ownership",
      ],
    },
    risks: [
      "Clinical boundaries must be enforced: an automated agent may book and confirm coverage but must never triage symptoms or offer medical guidance.",
      "PDPO obligations on health data are strict, and corporate scheme data carries additional employer-contract confidentiality expectations.",
      "Bupa group procurement may link this to a Bupa Hong Kong insurance deployment, changing the buying centre and contract shape.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions only — network-wide booking and enquiry volumes and cost per contact must be validated with Quality HealthCare operations leadership.",
    },
    pilotScope:
      "Automate same-day GP appointment booking with corporate scheme eligibility confirmation across voice and WhatsApp in three languages, offering live network-wide availability and escalating any clinical question.",
    expansion: [
      "Add specialist, dental and physiotherapy booking across the full network",
      "Add reminder and no-show recovery with proactive reoffering of released slots",
      "Link Bupa insurance eligibility and clinic booking into a single member conversation",
    ],
    stakeholders: [
      "Chief Executive Officer, Quality HealthCare",
      "Head of Clinic Operations",
      "Head of Corporate Business and Scheme Management",
      "Head of Information Technology",
      "Bupa Hong Kong representative for group alignment",
    ],
    discovery: [
      "What is the morning peak call volume for same-day appointments, and what share go unanswered?",
      "How is corporate scheme eligibility confirmed today, and how often is it wrong?",
      "What is the network-wide no-show rate, and what does an unfilled slot cost?",
      "Would Bupa group procurement bundle this with a Bupa Hong Kong insurance deployment?",
    ],
    flowTemplate: "appointments",
    scenario: "A corporate scheme member asks on WhatsApp for a same-day GP slot near Central, gets coverage confirmed and a clinic booked in ninety seconds.",
  },

  "kerry-logistics": {
    operatingContext:
      "Kerry Logistics Network is a Hong Kong-listed third-party logistics group with international freight forwarding, integrated logistics and warehousing, and express operations across Asia and beyond, now majority-owned by SF Holding. Its customers are businesses rather than consumers: shippers, manufacturers, retailers and freight partners who need shipment status, booking amendments, customs documentation and exception resolution, often urgently and often outside Hong Kong office hours. Those enquiries land on customer-service and operations teams by email and phone, where each answer requires checking transport management and warehouse systems. Multi-country operations mean the same customer may raise enquiries across several jurisdictions and languages.",
    strategicPressure: [
      { text: "Kerry Logistics is a Hong Kong-listed global third-party logistics provider spanning freight forwarding, integrated logistics and express, majority-owned by SF Holding.", kind: "verified" },
      { text: "B2B logistics servicing is email- and phone-driven, with each status enquiry requiring manual lookups across transport management and warehouse systems.", kind: "inference" },
      { text: "Freight customers operate across time zones, so out-of-hours status enquiries either wait until Hong Kong morning or escalate to account managers personally.", kind: "inference" },
      { text: "SF Holding ownership may progressively impose group technology on customer-facing operations, which is the primary qualification risk.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Kerry runs substantial operational technology but its customer-service function is process- and people-driven, and group ownership complicates any in-house platform investment. A partner-delivered conversational layer over existing transport management systems addresses the B2B service gap without competing with SF's internal roadmap.",
    whyNotBuild:
      "Logistics engineering capacity belongs in network optimisation, warehouse automation and transport management. Building multilingual speech, telephony across countries, orchestration into freight systems and conversation evaluation is a software product, and the ownership structure makes a Kerry-specific build even harder to justify.",
    workflows: [
      {
        name: "B2B shipment status and milestone enquiries",
        friction: "Customers email or call for shipment status, and coordinators check transport management, carrier portals and warehouse systems before replying hours later.",
        outcome: "Live shipment status and milestone detail answered instantly in the customer's language and channel, with exceptions flagged before the customer asks.",
        channels: ["Email", "WhatsApp", "Voice", "Web"],
        systems: ["Transport management system", "Warehouse management", "Carrier and airline portals", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Booking amendment and documentation chasing",
        friction: "Booking changes and missing customs documents are chased by email threads across several parties, and delays surface only when a shipment is held.",
        outcome: "Amendments captured and actioned conversationally, with document requirements named specifically and chased automatically until complete.",
        channels: ["Email", "WhatsApp", "Voice"],
        systems: ["Booking and order management", "Customs documentation", "Document management", "Transport management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Exception notification and resolution",
        friction: "Delays, customs holds and damage events are discovered by the customer rather than communicated, damaging trust in a service business built on reliability.",
        outcome: "Exceptions detected and communicated proactively with options offered, converting a service failure into a managed conversation.",
        channels: ["Email", "WhatsApp", "Voice"],
        systems: ["Transport management system", "Exception and claims workflow", "Notification services", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer-facing track-and-trace portals for shipment visibility",
        "Account management and customer-service teams handling B2B enquiries",
        "Electronic data interchange integrations with large enterprise customers",
        "Warehouse and transport management systems holding operational truth",
      ],
      gaps: [
        "Status enquiries still require human lookups despite portal availability",
        "No out-of-hours coverage for customers in other time zones",
        "Documentation gaps surface late rather than being chased proactively",
        "Exceptions are discovered by customers rather than communicated first",
      ],
    },
    risks: [
      "SF Holding technology direction may supersede local procurement, so decision rights must be confirmed before scoping.",
      "Customs and trade documentation carry legal consequences, so an automated agent must present requirements without making declarations or classifications.",
      "Multi-country operation means data residency and privacy obligations differ per jurisdiction served.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 5,
      automationRate: 0.5,
      basis: "Seller assumptions only — B2B enquiry volumes across email, phone and portal and cost per enquiry must be validated with Kerry's customer service and operations leadership.",
    },
    pilotScope:
      "Automate B2B shipment status and milestone enquiries for a defined business line across email, WhatsApp and voice, reading live from the transport management system with out-of-hours coverage.",
    expansion: [
      "Add booking amendment handling and proactive customs documentation chasing",
      "Add exception detection and proactive customer notification",
      "Extend the deployment to additional countries and business lines in the network",
    ],
    stakeholders: [
      "Managing Director, Hong Kong / Regional Head",
      "Head of Customer Service and Operations",
      "Head of Freight Forwarding or Integrated Logistics business line",
      "Chief Information Officer",
      "SF Holding group technology representative",
    ],
    discovery: [
      "How many status enquiries are handled per month, and what is the average response time?",
      "How far has SF Holding's technology stack been imposed on Kerry's customer-service operations?",
      "Which business lines have transport management data accessible enough for live status answering?",
      "What share of enquiries arrive outside Hong Kong office hours?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A European shipper emails at 3am Hong Kong time asking where a consignment sits, and gets live milestone detail plus the exact customs document still outstanding.",
  },

  "sf-express-hk": {
    operatingContext:
      "SF Express is the dominant cross-boundary express carrier between mainland China and Hong Kong, operating a dense Hong Kong network of service points, lockers and courier routes alongside its mainland operation, and serving both consumer senders and e-commerce shippers. Its Hong Kong consumer contact profile is driven by delivery attempts and redelivery arrangements, locker collection issues, cross-boundary customs questions and restricted-item queries, and pickup booking. The parent's technology arm builds extensively in-house and supplies the group's operational systems, so the Hong Kong unit consumes group platforms. The gap sits in Cantonese-language servicing and Hong Kong-specific workflows the mainland-designed stack handles generically.",
    strategicPressure: [
      { text: "SF Express is the leading cross-boundary express carrier between mainland China and Hong Kong, with a dense Hong Kong network of service points and lockers.", kind: "verified" },
      { text: "SF's group technology function builds extensively in-house, so any Hong Kong deployment must fit alongside rather than replace group platforms.", kind: "verified" },
      { text: "Cross-boundary shipments raise customs, restricted-item and duty questions that are Hong Kong-specific and poorly served by a mainland-designed service flow.", kind: "inference" },
      { text: "Cantonese-language servicing quality is a persistent differentiator in Hong Kong that mainland-built voice systems tend to underdeliver.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. SF Technology builds the group's platforms, so a full conversational platform sale is unrealistic. The narrow, defensible opening is a Hong Kong-localised Cantonese voice and messaging layer for redelivery, locker and customs workflows, integrated to group systems rather than replacing them.",
    whyNotBuild:
      "SF will build what serves the whole group. A Cantonese-first Hong Kong voice layer with local telephony, local customs content and Hong Kong-specific evaluation is a market-sized problem the group roadmap will always deprioritise against mainland volume, which is exactly why it stays unbuilt.",
    workflows: [
      {
        name: "Redelivery and delivery-instruction handling",
        friction: "Missed deliveries generate calls and app messages to arrange redelivery, and the customer often cannot reach a Cantonese-speaking agent quickly.",
        outcome: "Redelivery time, address or locker diversion arranged conversationally in Cantonese and written straight into the delivery system.",
        channels: ["Voice", "WhatsApp", "WeChat", "App"],
        systems: ["Delivery and routing system", "Locker network management", "Customer records", "Notification services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Locker collection and access issues",
        friction: "Collection codes fail, lockers are full, or parcels are placed at inconvenient locations, and there is no fast resolution path outside the app.",
        outcome: "Locker state checked live, codes reissued, and alternative collection or redelivery arranged in the conversation.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Locker network management", "Delivery system", "Customer records", "Notification services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cross-boundary customs and restricted-item guidance",
        friction: "Senders ask what can cross the boundary, what duties apply and why a parcel is held, and answers require local knowledge that varies by agent.",
        outcome: "Grounded, Hong Kong-specific customs and restricted-item guidance delivered consistently, with held-parcel reasons explained and next steps named.",
        channels: ["Voice", "WhatsApp", "WeChat"],
        systems: ["Customs and compliance knowledge base", "Shipment tracking", "Held-parcel workflow", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A consumer app with tracking, redelivery requests and locker collection codes",
        "A dense Hong Kong network of service points and parcel lockers",
        "A Hong Kong customer hotline alongside group digital channels",
        "Group-built tracking and delivery systems supplying operational truth",
      ],
      gaps: [
        "Cantonese voice servicing is thin relative to Hong Kong customer expectation",
        "Locker and collection failures have no fast resolution outside the app",
        "Customs and restricted-item answers vary by agent",
        "Hong Kong-specific workflows are handled generically by mainland-designed flows",
      ],
    },
    risks: [
      "Group technology ownership means the Hong Kong unit may lack authority to procure independently — this is the primary qualification question.",
      "Cross-boundary data rules constrain where Hong Kong customer conversation data can be processed relative to mainland infrastructure.",
      "Customs guidance carries legal consequences, so the agent must present requirements without making declarations or classification decisions.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 3,
      automationRate: 0.6,
      basis: "Seller assumptions only — Hong Kong hotline and app-message volumes and cost per contact must be validated with the local unit, alongside procurement autonomy from SF Technology.",
    },
    pilotScope:
      "Deploy a Cantonese-first redelivery and locker-collection servicing layer on the Hong Kong hotline and WhatsApp, integrated to delivery and locker systems, running alongside group digital channels.",
    expansion: [
      "Add cross-boundary customs and restricted-item guidance grounded in Hong Kong content",
      "Add proactive delivery-exception outreach before customers make contact",
      "Extend to e-commerce shipper support for Hong Kong merchant accounts",
    ],
    stakeholders: [
      "General Manager, SF Express Hong Kong",
      "Head of Customer Service, Hong Kong",
      "Head of Operations and Last-Mile Network",
      "SF Technology representative for group system integration",
      "Head of Compliance and Customs Affairs",
    ],
    discovery: [
      "Can the Hong Kong unit procure customer-facing technology independently of SF Technology?",
      "What is the Hong Kong hotline volume, and what share is redelivery and locker issues?",
      "How is Cantonese service quality measured today, and how does it compare with local competitors?",
      "Where can Hong Kong customer conversation data be processed given cross-boundary rules?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A recipient whose locker code failed messages in Cantonese, gets a new code issued instantly, and collects the parcel before the store closes.",
  },

  "bendigo-adelaide-bank": {
    operatingContext:
      "Bendigo and Adelaide Bank is Australia's leading regional bank, built on a distinctive Community Bank model in which local branches operate under franchise-style arrangements that return a share of profits to the communities that host them, alongside Adelaide Bank's broker-originated mortgage business and agribusiness lending through Rural Bank heritage. It has spent recent years consolidating a long tail of legacy brands and core systems onto a smaller platform footprint while reducing its cost-to-income ratio, which remains high relative to the majors. Customers reach it through community branches, a national contact centre, internet and mobile banking, and brokers for home loans. Its brand promise is relationship banking and community connection, which makes onshore, human-feeling service central to its identity.",
    strategicPressure: [
      { text: "Bendigo and Adelaide Bank operates Australia's Community Bank model alongside broker-originated mortgage and agribusiness lending, and has been consolidating legacy brands and systems.", kind: "verified" },
      { text: "Cost-to-income is structurally higher for regional banks than for the majors, making service-delivery cost a stated strategic priority rather than an operational detail.", kind: "verified" },
      { text: "Australian service labour costs are among the highest in the region, so every avoidable assisted contact carries a materially larger saving than in Asian markets.", kind: "inference" },
      { text: "A community-banking brand makes offshoring politically impossible, which makes onshore AI the only viable route to lower cost-to-serve without reputational damage.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Regional Australian banks do not maintain the AI engineering organisations the majors have built, and Bendigo's technology capacity is committed to core system consolidation and digital banking delivery. A conversational layer would be procured and integrated to the consolidated core and CRM, sponsored by a consumer banking or customer-experience executive with a cost-to-income business case.",
    whyNotBuild:
      "The bank is mid-way through simplifying platforms, not adding new ones to maintain. Building Australian-accent speech, telephony into a national contact centre estate, orchestration across a consolidating core, and evaluation aligned to complaints and hardship obligations would require four teams it does not have, during the exact period its engineering capacity is fully committed.",
    workflows: [
      {
        name: "Everyday banking inbound servicing",
        friction: "Card blocks, transaction disputes, payee setup and account queries queue in a national contact centre where Australian labour cost makes every minute expensive.",
        outcome: "Routine everyday banking requests completed conversationally with identity resolved once, protecting branch and contact-centre staff for relationship conversations.",
        channels: ["Voice", "App", "Web chat"],
        systems: ["Core banking", "Cards platform", "Digital banking channel", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Home-loan application status and document chasing",
        friction: "Borrowers and brokers call for application progress and outstanding-document lists, and lending staff interrupt assessment work to answer status questions.",
        outcome: "Live application status and specific document requirements delivered proactively, cutting status calls and shortening time to unconditional approval.",
        channels: ["Voice", "SMS", "Email", "Broker portal"],
        systems: ["Loan origination system", "Document management", "Broker platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Hardship and financial-difficulty triage",
        friction: "Customers in difficulty reach a general queue, disclose their situation to whoever answers, and the quality of the hardship conversation varies by agent.",
        outcome: "Hardship signals detected early and routed to trained specialists with a complete, auditable record, while routine collections stay automated within policy.",
        channels: ["Voice", "SMS", "Web"],
        systems: ["Collections and hardship system", "Core banking", "Case management", "Complaints register"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Internet and mobile banking with everyday transaction and card self-service",
        "A national contact centre supporting community branches and direct customers",
        "A broker channel and portal supporting home-loan origination",
        "Community Bank branches providing in-person relationship service",
      ],
      gaps: [
        "Routine servicing still consumes high-cost onshore agent time",
        "Home-loan applicants and brokers cannot see status without calling",
        "Hardship conversations are handled inconsistently at first contact",
        "No proactive outbound on document chasing or application progress",
      ],
    },
    risks: [
      "Australian Privacy Act obligations, and Consumer Data Right rules for banking data, govern how customer information is used and shared in automated conversations.",
      "ASIC internal dispute resolution requirements and Banking Code of Practice obligations demand documented complaint handling and defensible hardship treatment.",
      "The Community Bank brand makes any perception of replacing local jobs a live reputational risk — positioning must be capacity relief, not headcount removal.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 7,
      automationRate: 0.5,
      basis: "Seller assumptions only — contact-centre volume and fully loaded Australian cost per assisted contact must be validated with the bank's customer-experience and operations leadership.",
    },
    pilotScope:
      "Automate everyday banking inbound servicing — card blocks, transaction queries, payee and account requests — across voice and app channels, with identity resolved once and immediate escalation on any hardship or complaint signal.",
    expansion: [
      "Add home-loan application status and document chasing for both direct and broker channels",
      "Add hardship detection and specialist routing with full auditable records",
      "Add proactive outbound for card renewals, maturities and regulatory notifications",
    ],
    stakeholders: [
      "Chief Customer Officer / Head of Consumer Banking",
      "Head of Customer Contact Centre Operations",
      "Chief Information Officer",
      "Head of Home Lending / Broker Distribution",
      "Head of Compliance and Customer Advocacy",
    ],
    discovery: [
      "What is the fully loaded cost per assisted contact, and how many contacts are routine everyday banking requests?",
      "Where has core-system consolidation landed, and which systems can an automated agent act in today?",
      "How are hardship conversations identified and routed at first contact?",
      "What is the bank's public position on automation given the Community Bank brand promise?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer blocks a lost card and disputes two transactions by voice at 11pm, with a hardship cue in the conversation routed to a specialist the next morning.",
  },

  "bank-of-queensland": {
    operatingContext:
      "Bank of Queensland Group runs three consumer-facing brands — BOQ, ME Bank and Virgin Money Australia — on a multi-year digital transformation that has been converting its historic owner-managed branch model to corporate branches and consolidating customers onto a common cloud-based digital banking platform. That conversion pushes servicing that used to happen in owner-managed branches into central phone and digital channels, raising contact-centre volume exactly as the group is trying to reduce cost-to-income. Its customer base spans everyday banking, home lending originated heavily through brokers, and business banking with a strong niche in specialist commercial lending. Three brands with distinct customer expectations currently require parallel service handling.",
    strategicPressure: [
      { text: "BOQ Group operates the BOQ, ME Bank and Virgin Money Australia brands and has been running a multi-year digital transformation onto a common digital banking platform.", kind: "verified" },
      { text: "The conversion of owner-managed branches to corporate branches shifts servicing volume from local branch operators into central contact channels.", kind: "verified" },
      { text: "Running three consumer brands multiplies the servicing configurations required, which a single conversational layer with brand-specific personas can consolidate.", kind: "inference" },
      { text: "Vendor appetite mid-transformation is uncertain — the group may prefer to complete migration before adding new customer-facing technology.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. BOQ's technology investment is committed to the digital-bank migration itself, delivered with platform partners rather than built from scratch. A conversational layer is a natural adjacent purchase that rides the same consolidated platform, and three brands on one stack is precisely the case for one bought layer rather than three staffed operations.",
    whyNotBuild:
      "A mid-tier bank in the middle of a core migration has no spare engineering capacity, and adding a speech, telephony, orchestration and evaluation build would compete directly with the transformation it has already committed to shareholders. The migration is the argument for buying, not building.",
    workflows: [
      {
        name: "Multi-brand everyday banking servicing",
        friction: "BOQ, ME and Virgin Money customers reach differently branded queues for identical requests, multiplying staffing and training while producing inconsistent quality.",
        outcome: "One conversational layer with brand-specific voice and content handles routine servicing across all three brands on the consolidated platform.",
        channels: ["Voice", "App", "Web chat"],
        systems: ["Consolidated digital banking platform", "Core banking", "Cards platform", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Migration and platform-change support",
        friction: "Customers moved onto new platforms call with login, feature and account-change questions, creating a migration-driven contact spike on top of normal volume.",
        outcome: "Migration questions handled conversationally with step-by-step guidance, absorbing the spike without temporary contact-centre hiring.",
        channels: ["Voice", "App", "SMS", "Email"],
        systems: ["Digital banking platform", "Identity and authentication", "Core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Home-loan and broker status servicing",
        friction: "Brokers and borrowers chase application progress by phone, interrupting assessors and lengthening turnaround at the moment competitiveness is decided.",
        outcome: "Application status and outstanding requirements answered live and pushed proactively to brokers and borrowers.",
        channels: ["Voice", "Broker portal", "SMS", "Email"],
        systems: ["Loan origination system", "Broker platform", "Document management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A cloud-based digital banking platform being rolled out across brands",
        "Mobile and internet banking across BOQ, ME Bank and Virgin Money",
        "A national contact centre and converting corporate branch network",
        "A broker distribution channel with portal-based application tracking",
      ],
      gaps: [
        "Servicing is duplicated across three brand queues for identical requests",
        "Migration-driven contact spikes are absorbed by temporary staffing",
        "Application status requires a call for both brokers and borrowers",
        "Hardship and complaint signals are not consistently detected at first contact",
      ],
    },
    risks: [
      "Privacy Act and Consumer Data Right obligations govern customer data use across three brands with potentially different consent histories.",
      "ASIC internal dispute resolution and Banking Code obligations require documented complaint and hardship handling regardless of channel.",
      "Transformation fatigue may make the group reluctant to introduce new customer-facing technology before migration completes.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 7,
      automationRate: 0.5,
      basis: "Seller assumptions only — combined three-brand contact volume and fully loaded Australian cost per assisted contact must be validated with BOQ Group operations.",
    },
    pilotScope:
      "Automate everyday banking servicing for one brand on the consolidated digital platform across voice and app, with a brand-specific persona and a design that extends to the other two brands without re-integration.",
    expansion: [
      "Extend the same layer to the remaining two consumer brands with brand-specific personas",
      "Add migration and platform-change support to absorb conversion contact spikes",
      "Add home-loan and broker status servicing with proactive requirement chasing",
    ],
    stakeholders: [
      "Group Executive, Retail Banking",
      "Chief Customer / Operating Officer",
      "Chief Information Officer / Transformation lead",
      "Head of Contact Centre Operations",
      "Head of Compliance and Customer Remediation",
    ],
    discovery: [
      "Where is the digital-bank migration up to, and which brands are already on the common platform?",
      "What is the combined contact volume across the three brands, and how much is duplicated effort?",
      "Is there appetite for a new customer-facing vendor before migration completes?",
      "What contact spike does each migration wave generate, and how is it currently staffed?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Virgin Money customer migrated to the new platform calls about a failed login, is guided through re-registration, and completes a payee setup in the same call.",
  },

  "macquarie-bank-retail": {
    operatingContext:
      "Macquarie Bank's Banking and Financial Services division has grown into a top-tier Australian home-loan and deposit provider with a digital-first, broker-distributed model and almost no physical branch footprint, deliberately concentrating customer interaction in its app, digital channels and a phone operation. It has taken deliberate positions on simplifying its product set — exiting certain legacy products and channels — to keep the servicing model narrow and highly automated. Its customer base skews toward affluent, digitally confident borrowers and depositors who expect app-first service, while brokers form a critical second audience whose experience determines origination volume. Servicing therefore splits between consumer digital support and broker-channel support.",
    strategicPressure: [
      { text: "Macquarie's Banking and Financial Services division has grown home loans and deposits rapidly through a digital-first, broker-distributed model with minimal branch presence.", kind: "verified" },
      { text: "The division has simplified its product and channel set deliberately, which signals a strategy of keeping servicing narrow and automatable rather than broad and staffed.", kind: "verified" },
      { text: "Broker experience is a direct origination lever, so broker-channel service speed converts into settlement volume in a way consumer servicing does not.", kind: "inference" },
      { text: "Macquarie has real internal engineering capability, so any conversational proposal must be positioned against a credible internal build alternative.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Macquarie is technically capable and has built distinctive digital banking experiences, but its engineering focus is on the core platform and app rather than on speech and telephony infrastructure. The realistic shape is a partner-delivered conversational layer for voice and broker channels that complements the app rather than duplicating it.",
    whyNotBuild:
      "Macquarie will build what its customers see in the app because that is its differentiator. Voice infrastructure, telephony orchestration, and per-conversation evaluation for a phone channel it is deliberately de-emphasising are exactly the components a capable engineering organisation chooses to buy rather than staff.",
    workflows: [
      {
        name: "Home-loan servicing and settlement coordination",
        friction: "Borrowers call about rates, redraw, offset mechanics and settlement timing, and the phone channel is the fallback for anything the app cannot complete.",
        outcome: "Servicing requests completed conversationally with app-level context carried into voice, and settlement questions answered from the origination system.",
        channels: ["Voice", "App", "Secure message"],
        systems: ["Core banking", "Loan servicing platform", "Digital channel", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Broker support and application status desk",
        friction: "Brokers call or email for application status, policy questions and outstanding requirements, and response speed determines whether they lodge the next deal here.",
        outcome: "Brokers get instant, grounded answers on status and credit policy, with complex scenarios routed to a named credit specialist.",
        channels: ["Voice", "Broker portal", "Email"],
        systems: ["Loan origination system", "Credit policy knowledge base", "Broker platform", "Document management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Deposit and everyday banking servicing",
        friction: "Deposit customers call about rates, maturities, transfers and access issues, generating volume that is routine but must be handled at a premium service standard.",
        outcome: "Deposit and transaction requests handled conversationally within policy, preserving the premium service feel without premium staffing cost.",
        channels: ["Voice", "App", "Secure message"],
        systems: ["Core banking", "Deposit product systems", "Payments", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A highly regarded mobile banking app with deep self-service",
        "A broker channel with portal-based application lodgement and tracking",
        "A phone servicing operation supporting digital-first customers",
        "Secure messaging within digital channels for customer correspondence",
      ],
      gaps: [
        "Voice servicing does not inherit the context of what the customer was doing in the app",
        "Broker status questions still require a human despite portal availability",
        "Credit-policy answers for brokers vary depending on who responds",
        "No proactive outbound on outstanding application requirements",
      ],
    },
    risks: [
      "Privacy Act and Consumer Data Right obligations apply to banking data used in conversations and to any third-party broker access.",
      "Responsible lending and credit-policy communications must be accurate and grounded, since broker reliance on a wrong answer has commercial and regulatory consequences.",
      "A capable internal engineering organisation may prefer to build, so scoping must target components Macquarie has visibly chosen not to own.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 7.5,
      automationRate: 0.55,
      basis: "Seller assumptions only — consumer and broker contact volumes and fully loaded Australian cost per contact must be validated with BFS operations leadership.",
    },
    pilotScope:
      "Automate the broker application-status and credit-policy desk across voice and broker channels, grounded in the origination system and approved policy content, with complex scenarios routed to credit specialists.",
    expansion: [
      "Add home-loan servicing with app-to-voice context continuity",
      "Add proactive outbound chasing of outstanding application requirements",
      "Extend to deposit and everyday banking servicing on the same layer",
    ],
    stakeholders: [
      "Head of Banking and Financial Services / Personal Banking",
      "Head of Broker Distribution",
      "Head of Customer Service Operations",
      "Chief Technology Officer, BFS",
      "Head of Compliance and Conduct",
    ],
    discovery: [
      "How many broker contacts per month are application status versus credit policy questions?",
      "Does BFS intend to build conversational capability internally, and for which channels?",
      "What is the fully loaded cost per phone contact, and how has it trended as volume grew?",
      "Can an automated agent read live origination status and act in servicing systems?",
    ],
    flowTemplate: "onboarding",
    scenario: "A broker asks by voice why a file is stalled, learns the exact outstanding valuation condition, and uploads the missing document before the client calls him.",
  },

  "amp": {
    operatingContext:
      "AMP is an Australian wealth and banking group that has spent years simplifying — divesting businesses, reducing its adviser footprint and shrinking its cost base — while retaining a superannuation and retirement business serving a large member base, a platforms business for advisers, and a digitally oriented bank concentrated in home loans and deposits. Its member relationships are long-dated and largely passive until a life event triggers contact: changing jobs, consolidating accounts, approaching retirement, or making a claim on insurance held inside super. Contact runs through member and banking contact centres, adviser channels, and digital portals. The strategic thread is delivering acceptable service on a materially smaller cost base than the organisation once carried.",
    strategicPressure: [
      { text: "AMP has undergone sustained restructuring and simplification, reducing its business footprint and cost base while retaining superannuation, platforms and a digital bank.", kind: "verified" },
      { text: "Superannuation members contact the fund episodically around life events, so volume is driven by employment change and retirement transitions rather than by product usage.", kind: "inference" },
      { text: "A shrinking cost base means service capacity cannot grow with regulatory or market-driven contact spikes, making elastic capacity structurally valuable.", kind: "inference" },
      { text: "Budget ownership is likely split between the superannuation business and the bank, so the entry point must be chosen deliberately.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. An organisation in simplification mode does not expand internal build teams; it buys capability that reduces run cost. AMP's technology effort is directed at platform consolidation and regulatory delivery, and a conversational layer would be procured and integrated to administration and banking systems.",
    whyNotBuild:
      "AMP is actively reducing complexity. Adding a speech, telephony, orchestration and evaluation build would run directly against the strategy it has committed to publicly, and the capability offers no differentiation for a fund competing on investment performance, fees and adviser relationships.",
    workflows: [
      {
        name: "Superannuation member account servicing",
        friction: "Members call about balances, contributions, employer changes and consolidation, and agents read the same administration screens all day at Australian labour cost.",
        outcome: "Account, contribution and consolidation queries handled conversationally with identity resolved once and advice boundaries strictly enforced.",
        channels: ["Voice", "Member portal", "SMS"],
        systems: ["Superannuation administration", "Member records", "Identity and authentication", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Retirement transition and life-event guidance",
        friction: "Members approaching retirement need process guidance, generate long calls, and often reach an agent who cannot give advice but must explain complex options.",
        outcome: "Process and factual information delivered consistently with clear advice boundaries, and members who need advice booked with a qualified adviser.",
        channels: ["Voice", "Member portal", "Email"],
        systems: ["Superannuation administration", "Advice booking", "Product and rules knowledge base", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Bank home-loan and deposit servicing",
        friction: "Banking customers call about loan status, rates, redraw and deposit maturities into a separate contact operation from the super business.",
        outcome: "Banking servicing automated on the same layer, with application status and document requirements pushed proactively.",
        channels: ["Voice", "App", "Email"],
        systems: ["Core banking", "Loan origination", "Deposit systems", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Member portals and apps for superannuation account access",
        "Member and banking contact centres operating as separate functions",
        "An adviser-facing platform business with its own service channels",
        "Digital banking channels for home-loan and deposit customers",
      ],
      gaps: [
        "Routine member queries consume high-cost onshore agent time",
        "Retirement-transition conversations are long and inconsistently delivered",
        "Member and banking servicing are separate experiences for the same customer",
        "No proactive outreach at the life events that actually drive member value",
      ],
    },
    risks: [
      "The line between factual information and personal financial advice is regulated and consequential; an automated agent must be provably confined to factual and process information.",
      "Privacy Act obligations apply to member and banking data, with superannuation records carrying employment and beneficiary details of particular sensitivity.",
      "AMP's remediation history means conduct scrutiny is elevated, so every automated conversation must be logged, retained and reviewable.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 7,
      automationRate: 0.5,
      basis: "Seller assumptions only — member and banking contact volumes and fully loaded Australian cost per contact must be validated with AMP operations leadership.",
    },
    pilotScope:
      "Automate superannuation member account servicing — balances, contributions, employer changes and consolidation — across voice and the member portal, with hard advice boundaries and immediate routing to advisers where guidance is needed.",
    expansion: [
      "Add retirement-transition process guidance with adviser booking for advice needs",
      "Add banking servicing for home-loan and deposit customers on the same layer",
      "Add proactive life-event outreach at job change and pre-retirement milestones",
    ],
    stakeholders: [
      "Group Executive, Superannuation and Investments",
      "Managing Director, AMP Bank",
      "Chief Operating Officer / Head of Customer Operations",
      "Chief Information Officer",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "What is the split of contact volume between the superannuation business and AMP Bank?",
      "Which member queries are pure administration and could be handled without advice risk?",
      "How is the advice boundary policed in the contact centre today?",
      "Which business unit would fund and sponsor a servicing deployment?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A member who changed employers checks contributions by voice, starts a consolidation of two old accounts, and is booked with an adviser only when the conversation turns to strategy.",
  },

  "latitude-financial": {
    operatingContext:
      "Latitude Financial Services is a major Australian and New Zealand consumer lender offering credit cards, personal loans, and interest-free point-of-sale finance distributed through large retail partners, meaning a substantial portion of its customer base is acquired at a merchant checkout rather than through its own brand. Its operational core is collections and account servicing across a large unsecured book, with hardship handling a permanent, regulated workload rather than a cyclical one. The 2023 cyber incident, in which a very large volume of customer records was compromised, left a lasting elevation in identity, security and account-verification contact. Customers reach it through contact centres, an app and portal, and merchant partners.",
    strategicPressure: [
      { text: "Latitude is a major Australian and New Zealand consumer lender across cards, personal loans and retail point-of-sale interest-free finance.", kind: "verified" },
      { text: "Latitude suffered a large-scale cyber incident in 2023 affecting a very substantial number of customer records, which elevated identity and security-related customer contact.", kind: "verified" },
      { text: "Unsecured consumer lending under cost-of-living pressure raises hardship volumes, and hardship handling in Australia carries specific notice, assessment and record-keeping obligations.", kind: "inference" },
      { text: "Regulatory attention to collections conduct in consumer finance makes policy-bounded, fully logged automated contact more defensible than a variable human script.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Latitude is a lender, not a technology company, and post-incident its technology capital is committed to security and remediation rather than new platform builds. Collections and hardship conversations are exactly the workflows where a governed, policy-bounded platform is more defensible than a staffed operation.",
    whyNotBuild:
      "Building speech, telephony, orchestration and conduct-grade evaluation would be a multi-year programme for a lender whose board priorities are security, funding cost and arrears management. A bought platform delivers the auditable, bounded conversations regulators expect without adding engineering risk to an organisation already carrying remediation load.",
    workflows: [
      {
        name: "Early-bucket collections outreach",
        friction: "Dialler campaigns reach a fraction of accounts in permitted hours, arrangements vary by collector, and broken promises wait for the next campaign cycle.",
        outcome: "Every early-bucket account contacted within permitted windows on the customer's preferred channel, arrangements drawn from an approved matrix, payment taken in-channel and promises tracked automatically.",
        channels: ["Voice", "SMS", "Email", "App"],
        systems: ["Collections system", "Cards and loan platforms", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Hardship triage and assessment intake",
        friction: "Customers disclosing financial difficulty reach a general collections queue, and the quality and documentation of the hardship conversation depends on the individual collector.",
        outcome: "Hardship cues detected reliably, structured intake completed, statutory notice obligations met on time, and cases routed to trained specialists with a complete record.",
        channels: ["Voice", "Web", "SMS"],
        systems: ["Hardship case management", "Collections system", "Document management", "Complaints register"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Identity, security and account-verification servicing",
        friction: "Post-incident identity and security queries remain elevated, and each requires careful verification that consumes long agent handle times.",
        outcome: "Verification and security questions handled consistently with strong authentication, and genuine fraud cases escalated immediately with full context.",
        channels: ["Voice", "App", "Email"],
        systems: ["Identity and authentication services", "Fraud case management", "Cards platform", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer app and portal for card and loan account management",
        "Collections and hardship teams operating across Australia and New Zealand",
        "Merchant partner channels supporting point-of-sale finance customers",
        "Payment arrangement and direct debit facilities for repayment management",
      ],
      gaps: [
        "Outbound collections reaches only part of the at-risk book each cycle",
        "Hardship identification depends on the individual collector's judgement",
        "Arrangement consistency and documentation vary across the operation",
        "No automatic follow-up when an arrangement is broken",
      ],
    },
    risks: [
      "National Credit Code hardship obligations impose specific notice and assessment timeframes that an automated process must meet provably.",
      "ASIC expectations on collections conduct and vulnerable-customer treatment require documented, auditable handling of every difficult conversation.",
      "Post-incident privacy sensitivity is acute — data handling, retention and access controls for conversation transcripts will face unusual scrutiny.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 6,
      automationRate: 0.6,
      basis: "Seller assumptions only — collections, servicing and security contact volumes and fully loaded cost per contact must be validated with Latitude collections and operations leadership.",
    },
    pilotScope:
      "Automate early-bucket collections outreach across voice and SMS with arrangements strictly from an approved matrix, payments taken in-channel, and any hardship or vulnerability cue routed immediately to a trained specialist with a full transcript.",
    expansion: [
      "Add structured hardship intake with statutory notice tracking and specialist routing",
      "Add identity, security and account-verification servicing to reduce post-incident handle times",
      "Extend to New Zealand with jurisdiction-specific conduct rules applied",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Collections and Hardship",
      "Head of Customer Service Operations",
      "Chief Risk Officer / Head of Compliance",
      "Chief Information Security Officer",
    ],
    discovery: [
      "What proportion of the early-bucket book is contacted in a cycle, and what is the right-party-contact rate?",
      "How are hardship cues identified today, and what proportion of hardship cases are captured at first disclosure?",
      "Which arrangement options can be offered without a human credit decision?",
      "What data-handling controls would security require for conversation transcripts post-incident?",
    ],
    flowTemplate: "collections",
    scenario: "A cardholder five days past due is reached by voice within permitted hours, sets up an approved payment arrangement, and is routed to a hardship specialist when she mentions losing shifts.",
  },

  "humm-group": {
    operatingContext:
      "humm group is an Australian and New Zealand consumer and commercial finance provider best known for buy-now-pay-later and instalment products distributed through retail and healthcare merchants, alongside a commercial and equipment finance business lending to small businesses and brokers. Its consumer book generates continuous payment-reminder, plan-change and arrears conversations across a large number of small-balance accounts, where the cost of each collections contact is significant relative to the account's revenue. The merchant side generates a parallel stream of settlement, onboarding and dispute queries. Funding costs and credit performance have been persistent themes for the sector, sharpening the focus on collections efficiency.",
    strategicPressure: [
      { text: "humm group provides instalment and buy-now-pay-later consumer finance alongside a commercial and equipment finance business across Australia and New Zealand.", kind: "verified" },
      { text: "Small-balance instalment accounts make the cost of each collections contact large relative to account revenue, so contact efficiency directly determines unit economics.", kind: "inference" },
      { text: "Rising funding costs and regulatory tightening around buy-now-pay-later credit have pressured sector margins and increased compliance obligations on consumer contact.", kind: "inference" },
      { text: "Merchant support volume may rival consumer collections, and the relative sizes need establishing before the entry workflow is chosen.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A sub-scale lender under funding-cost pressure has no capacity to build conversational infrastructure and every reason to reduce cost-to-collect quickly. The deployment is a configured integration to the lending, collections and payment systems.",
    whyNotBuild:
      "The company's engineering capacity goes to merchant integrations and credit decisioning, which drive origination. Building four specialist capabilities to run reminder conversations would be an obvious misallocation for a lender whose margin depends on operating leanly.",
    workflows: [
      {
        name: "Payment reminders and missed-payment recovery",
        friction: "Automated SMS reminders are one-way and easy to ignore, and follow-up calls reach only a fraction of accounts at a cost that erodes small-balance economics.",
        outcome: "Two-way reminder conversations that take payment in-channel, offer approved plan changes, and follow up automatically when a promise is broken.",
        channels: ["SMS", "Voice", "App", "Email"],
        systems: ["Lending and instalment platform", "Collections system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Plan change and account servicing",
        friction: "Customers wanting to change payment dates, amounts or plans call a contact centre for what should be a self-service change.",
        outcome: "Plan and payment-date changes executed conversationally within policy, reducing both contact volume and avoidable arrears.",
        channels: ["App", "SMS", "Voice"],
        systems: ["Instalment platform", "Payment scheduling", "Payment gateway", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Merchant settlement and dispute support",
        friction: "Merchants query settlement timing, transaction disputes and onboarding steps by phone and email, handled by a small partner-support team.",
        outcome: "Merchant queries answered from live settlement and transaction data, with disputes captured in structured form and escalated appropriately.",
        channels: ["Voice", "Email", "Merchant portal"],
        systems: ["Merchant settlement platform", "Transaction records", "Dispute workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer app and portal for instalment plan management and payments",
        "Automated SMS and email payment reminder programmes",
        "A collections operation covering consumer arrears across Australia and New Zealand",
        "Merchant portals and partner support for retail and healthcare providers",
      ],
      gaps: [
        "Reminders are one-way notifications that cannot take a payment or change a plan",
        "Plan changes still generate contact-centre volume",
        "Hardship disclosure is not consistently captured or documented",
        "Merchant settlement queries require a human lookup",
      ],
    },
    risks: [
      "Consumer credit regulation now extends more fully to buy-now-pay-later products, bringing hardship, disclosure and responsible-lending obligations into collections conversations.",
      "Privacy Act obligations govern customer contact data used for outbound messaging, with consent captured largely at merchant checkout.",
      "New Zealand operations sit under a different consumer credit regime, so a trans-Tasman deployment must apply jurisdiction-specific rules.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5,
      automationRate: 0.65,
      basis: "Seller assumptions only — consumer collections and merchant support volumes and cost per contact must be validated with humm group operations leadership.",
    },
    pilotScope:
      "Automate payment reminder and missed-payment recovery conversations across SMS and voice for the Australian instalment book, taking payment in-channel with approved plan changes and immediate hardship escalation.",
    expansion: [
      "Add self-service plan and payment-date changes to reduce avoidable arrears",
      "Add merchant settlement and dispute support on the same layer",
      "Extend to New Zealand with jurisdiction-specific credit conduct rules",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Collections and Credit Operations",
      "Head of Merchant / Partner Support",
      "Chief Information Officer",
      "Head of Compliance and Responsible Lending",
    ],
    discovery: [
      "What is the cost to collect per account, and how does it compare with account revenue?",
      "What share of arrears accounts are contacted successfully in a cycle?",
      "How is hardship disclosure captured and documented today?",
      "Which is larger by contact volume: consumer collections or merchant support?",
    ],
    flowTemplate: "collections",
    scenario: "A customer who missed an instalment replies to an SMS, moves her payment date to align with payday, and clears the arrears without a collector ever calling.",
  },

  "pepper-money": {
    operatingContext:
      "Pepper Money is an Australian non-bank lender specialising in residential mortgages and asset finance for borrowers who fall outside major-bank credit criteria, distributed almost entirely through mortgage brokers and asset finance introducers rather than a branch network. Its near-prime and specialist lending focus means a higher-than-average proportion of borrowers experience payment stress during rate cycles, making arrears management and hardship handling a core operational discipline rather than an edge case. Because it funds through securitisation and warehouse facilities, arrears performance directly affects funding costs, giving collections outcomes a financial significance beyond the individual account. Servicing runs through a lean contact operation supporting both borrowers and the broker network.",
    strategicPressure: [
      { text: "Pepper Money is an Australian non-bank lender focused on residential mortgages and asset finance for near-prime and specialist borrowers, distributed through brokers.", kind: "verified" },
      { text: "Near-prime borrowers are more sensitive to interest-rate and cost-of-living pressure, so arrears and hardship volumes rise faster than for prime lenders in a tightening cycle.", kind: "inference" },
      { text: "Securitisation funding makes arrears performance a direct input to funding cost, so effective early-stage collections has a balance-sheet effect beyond recovery value.", kind: "inference" },
      { text: "A lean non-bank operating model means collections capacity cannot flex with arrears cycles without either hiring or automating.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Non-bank lenders run deliberately lean operations with no internal AI engineering, and their technology spend goes to origination and servicing platforms sourced from vendors. Arrears and hardship conversations are the highest-value automation target and require configuration rather than invention.",
    whyNotBuild:
      "A lender whose competitive advantage is credit judgement and broker relationships gains nothing from owning speech and telephony infrastructure. Building it would add fixed cost to a model designed around variable, scalable operations.",
    workflows: [
      {
        name: "Early-arrears outreach for mortgage and asset finance books",
        friction: "Collections staff work a list by phone in business hours, reaching borrowers who are at work, and arrangements depend on the individual collector's discretion.",
        outcome: "Every early-arrears borrower contacted on their preferred channel within permitted hours, with approved arrangements offered and payments taken in-channel.",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Loan servicing platform", "Collections system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Hardship assessment intake and documentation",
        friction: "Hardship applications require income, expense and circumstance information collected across phone calls and emails, with statutory response timeframes met manually.",
        outcome: "Structured hardship intake completed conversationally with documents collected in-channel, notice obligations tracked, and assessment decisions retained by humans.",
        channels: ["Voice", "SMS", "Email", "Web"],
        systems: ["Hardship case management", "Document management", "Loan servicing platform", "Complaints register"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Broker status and settlement support",
        friction: "Brokers chase application progress and settlement timing by phone, and their experience determines whether the next deal is lodged with Pepper or a competitor.",
        outcome: "Instant, grounded application status and outstanding-condition answers for brokers, with credit scenarios routed to a specialist.",
        channels: ["Voice", "Email", "Broker portal"],
        systems: ["Loan origination system", "Credit policy knowledge base", "Document management", "Broker platform"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A borrower servicing portal for account and payment management",
        "A collections and hardship function covering mortgage and asset finance books",
        "A broker channel with application lodgement and status tracking",
        "Automated payment reminder and direct debit facilities",
      ],
      gaps: [
        "Arrears outreach is capacity-limited and confined to business hours",
        "Hardship intake is manual, with statutory timeframes tracked by people",
        "Broker status questions still require a human response",
        "No automatic follow-up when an arrangement is broken",
      ],
    },
    risks: [
      "National Credit Code hardship notice and assessment timeframes must be met provably, and failure is both a regulatory and an AFCA complaint exposure.",
      "ASIC scrutiny of collections conduct and vulnerable-customer treatment requires every conversation to be logged, retained and reviewable.",
      "Privacy Act obligations apply to borrower financial information collected during hardship intake, which is unusually sensitive.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions only — arrears, hardship and broker contact volumes and fully loaded cost per contact must be validated with Pepper Money operations leadership.",
    },
    pilotScope:
      "Automate early-arrears outreach for the residential mortgage book across voice and SMS, with approved arrangements, in-channel payment, and immediate routing of any hardship disclosure to a trained assessor with a complete record.",
    expansion: [
      "Add structured hardship intake with document collection and statutory timeframe tracking",
      "Extend arrears outreach to the asset finance book",
      "Add broker status and settlement support to protect origination volume",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Collections and Customer Assistance",
      "Head of Broker Distribution",
      "Chief Information Officer",
      "Head of Compliance and Credit Risk",
    ],
    discovery: [
      "What proportion of early-arrears accounts are contacted successfully each cycle, and in what timeframe?",
      "How are hardship notice and assessment timeframes tracked today?",
      "Which arrangement options can be offered without a human credit decision?",
      "How much broker contact volume is pure status chasing?",
    ],
    flowTemplate: "collections",
    scenario: "A near-prime borrower who missed a repayment is reached by SMS after work, agrees an approved catch-up plan, and is escalated to an assessor the moment she mentions reduced income.",
  },

  "liberty-financial": {
    operatingContext:
      "Liberty Financial is an Australian non-bank lender operating across residential mortgages, motor and asset finance, commercial lending and personal loans, distributed through an extensive network of mortgage brokers and finance introducers under a brand that emphasises flexible, case-by-case credit assessment. That flexibility is a commercial advantage but an operational burden: non-standard loans generate more servicing conversations per account, and brokers need more back-and-forth to understand where a given scenario will land. The broker relationship is the origination engine, so responsiveness to broker enquiries is a direct revenue lever. Borrower servicing spans payment queries, statements, variations and arrears across several product lines with different systems behind them.",
    strategicPressure: [
      { text: "Liberty Financial is a broker-distributed Australian non-bank lender operating across residential mortgages, motor and asset finance, commercial and personal lending.", kind: "verified" },
      { text: "Flexible, case-by-case credit assessment generates more broker enquiries per application than a rules-based lender, because outcomes are less predictable in advance.", kind: "inference" },
      { text: "Broker responsiveness is a direct origination lever for a lender with no proprietary distribution, so speed of answer converts to settlement volume.", kind: "inference" },
      { text: "Multiple product lines on different servicing systems fragment the borrower experience and multiply the integration surface for any conversational layer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A non-bank lender with a broker-first model concentrates investment in credit capability and distribution relationships, procuring servicing technology from vendors. A conversational layer serving both brokers and borrowers is a configured deployment across origination and servicing systems.",
    whyNotBuild:
      "Liberty's advantage is credit judgement and broker trust. Building speech, telephony, multi-system orchestration and conversation evaluation would add substantial fixed cost and engineering risk to a lender whose model depends on operating leanly across several product lines.",
    workflows: [
      {
        name: "Broker status and scenario support desk",
        friction: "Brokers call and email for application status, outstanding conditions and credit-scenario guidance, and slow answers push their next deal to a competitor.",
        outcome: "Instant, grounded status and condition answers with scenario questions routed to the right credit specialist, protecting broker loyalty and settlement volume.",
        channels: ["Voice", "Email", "Broker portal"],
        systems: ["Loan origination system", "Credit policy knowledge base", "Document management", "Broker platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Borrower payment and account servicing across product lines",
        friction: "Borrowers with mortgages, motor loans or personal loans call different teams for statements, payment changes and payout figures, each on a separate system.",
        outcome: "One conversational front door that identifies the customer and answers across product lines, executing payment changes and issuing payout figures within policy.",
        channels: ["Voice", "SMS", "Email", "Portal"],
        systems: ["Loan servicing platforms", "Payment scheduling", "Document generation", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Arrears outreach and hardship routing",
        friction: "Arrears outreach is phone-based and capacity-limited, and hardship disclosures are handled with variable documentation across product lines.",
        outcome: "Consistent early-arrears contact with approved arrangements, and hardship cues routed to trained assessors with statutory timeframes tracked.",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Collections system", "Hardship case management", "Loan servicing platforms", "Payment gateway"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A broker portal with application lodgement and status tracking",
        "Borrower servicing teams across mortgage, motor and personal lending",
        "Automated payment and direct debit facilities with statement generation",
        "A collections and hardship function covering the lending book",
      ],
      gaps: [
        "Broker status and scenario answers depend on reaching the right person",
        "Borrowers face different teams and systems depending on product",
        "Payout figures and statement requests still require manual handling",
        "Arrears outreach cannot flex with the credit cycle",
      ],
    },
    risks: [
      "National Credit Code hardship obligations and ASIC conduct expectations apply across consumer product lines, requiring auditable handling.",
      "Credit-policy answers given to brokers carry commercial consequences if wrong, so grounding and version control of policy content is critical.",
      "Privacy Act obligations govern borrower and broker data, with third-party broker access requiring careful permissioning.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions only — broker and borrower contact volumes across product lines and cost per contact must be validated with Liberty Financial operations leadership.",
    },
    pilotScope:
      "Deploy a broker status and condition desk across voice, email and the broker portal, grounded in the origination system and approved credit policy, with scenario questions routed to named credit specialists.",
    expansion: [
      "Add borrower payment and account servicing across mortgage, motor and personal loan books",
      "Add arrears outreach with approved arrangements and hardship routing",
      "Add proactive condition-chasing to shorten time to settlement",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Broker Distribution / Group Sales",
      "Head of Customer Service and Loan Servicing",
      "Chief Information Officer",
      "Head of Compliance and Credit Risk",
    ],
    discovery: [
      "How many broker contacts per month are status chasing versus genuine credit scenarios?",
      "How many separate servicing systems would a borrower-facing agent need to read?",
      "What is the average time to answer a broker enquiry today, and how does it affect lodgement share?",
      "Which product line has the largest addressable servicing volume?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A broker calls at 7pm to ask what is holding a motor finance approval, gets the exact outstanding condition, and has the client's payslip uploaded before morning.",
  },

  "great-southern-bank": {
    operatingContext:
      "Great Southern Bank, formerly CUA, is Australia's largest customer-owned bank, serving members with home loans, everyday banking and savings under a mutual structure that returns value to members rather than shareholders. Its strategic focus has been on helping Australians into home ownership, which concentrates its lending in owner-occupier mortgages originated through both direct and broker channels. Without shareholder capital or a major's technology budget, it competes on service, rate and member alignment, and its contact centre is a defining brand touchpoint. Members reach it through a contact centre, digital banking, a small branch presence and brokers, with all servicing performed onshore.",
    strategicPressure: [
      { text: "Great Southern Bank is Australia's largest customer-owned bank, formerly CUA, focused on home lending and everyday banking for members.", kind: "verified" },
      { text: "Mutuals lack shareholder capital for large technology programmes, so they consistently buy digital capability rather than building it.", kind: "inference" },
      { text: "Onshore service is central to a mutual's member proposition, making offshoring untenable and onshore automation the only lever on cost-to-serve.", kind: "inference" },
      { text: "Home-loan competition on rate and turnaround makes application-status transparency a competitive factor as much as a service one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Customer-owned banks source core banking, digital channels and CX technology from vendors and consortium arrangements. A conversational layer would be procured and integrated to the existing core and digital banking platforms, sponsored by a member-experience executive with a cost-to-serve business case.",
    whyNotBuild:
      "A mutual's capital belongs to its members and is deployed into lending, not into building speech and telephony infrastructure. Every component required is available configured, and a build would be impossible to justify to a member-elected board.",
    workflows: [
      {
        name: "Everyday banking member servicing",
        friction: "Card, payment, statement and account queries queue in an onshore contact centre where every minute carries Australian labour cost.",
        outcome: "Routine member requests handled conversationally with identity resolved once, protecting agent capacity for lending and advice conversations.",
        channels: ["Voice", "App", "Web chat"],
        systems: ["Core banking", "Cards platform", "Digital banking channel", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Home-loan application status and document chasing",
        friction: "Members and brokers call for application progress, and lending staff interrupt assessment work to answer status questions, lengthening turnaround.",
        outcome: "Live status and specific outstanding requirements pushed proactively, shortening approval turnaround and cutting status calls.",
        channels: ["Voice", "SMS", "Email", "Broker portal"],
        systems: ["Loan origination system", "Document management", "Broker platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Digital banking access and payment issue resolution",
        friction: "Login failures, payment limits and scam-related payment holds generate urgent calls that must be handled carefully and quickly.",
        outcome: "Access and payment issues diagnosed and resolved conversationally with strong authentication, and suspected scams escalated instantly to specialists.",
        channels: ["Voice", "App", "Web chat"],
        systems: ["Identity and authentication", "Payments platform", "Fraud case management", "Core banking"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Digital and mobile banking with everyday transaction self-service",
        "An onshore member contact centre as the primary service channel",
        "A broker channel supporting home-loan origination",
        "A small branch presence for in-person member service",
      ],
      gaps: [
        "Routine servicing consumes high-cost onshore agent capacity",
        "Application status requires a call for both members and brokers",
        "No proactive document chasing during loan assessment",
        "Out-of-hours servicing is limited to app self-service only",
      ],
    },
    risks: [
      "Privacy Act and Consumer Data Right obligations govern member data used in conversations and shared with accredited third parties.",
      "ASIC internal dispute resolution and Banking Code obligations require documented complaint and hardship handling.",
      "A member-owned structure means any automation must be positioned to a member-elected board as improving service, not cutting member-facing jobs.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 7,
      automationRate: 0.55,
      basis: "Seller assumptions only — contact-centre volume and fully loaded Australian cost per assisted contact must be validated with Great Southern Bank member experience leadership.",
    },
    pilotScope:
      "Automate everyday banking member servicing across voice and app channels with identity resolved once, extending service to out-of-hours, with immediate escalation for hardship, complaint and suspected-scam signals.",
    expansion: [
      "Add home-loan application status and proactive document chasing for members and brokers",
      "Add digital banking access and payment issue resolution with strong authentication",
      "Add proactive outbound for maturities, renewals and rate-change notifications",
    ],
    stakeholders: [
      "Chief Customer Officer / Head of Member Experience",
      "Head of Contact Centre Operations",
      "Head of Home Lending",
      "Chief Information Officer",
      "Head of Risk and Compliance",
    ],
    discovery: [
      "What is the fully loaded cost per contact, and what share of contacts are routine servicing?",
      "How long is the home-loan assessment turnaround, and how much of it is status-call interruption?",
      "What is the board's position on automation given the member-owned structure?",
      "Which incumbent digital-banking vendor relationships could bundle a competing conversational offer?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A member calls after hours about a declined payment, gets the limit explained and raised within policy, and completes the transfer before the call ends.",
  },

  "people-first-bank": {
    operatingContext:
      "People First Bank is the merged entity formed from Heritage Bank and People's Choice, Australia's largest customer-owned banking group by some measures, serving members across Queensland, South Australia, the Northern Territory and beyond with home loans, everyday banking and insurance distribution. The merger brought together two member bases, two brand histories, two contact centres and two sets of core systems, and the integration programme is progressively unifying them under a single brand and platform. That transition creates both a service challenge — members calling about changing products, brands and access — and a rare decision window, because contact-centre consolidation is being designed rather than inherited. Servicing is entirely onshore, consistent with the mutual model.",
    strategicPressure: [
      { text: "People First Bank was formed by the merger of Heritage Bank and People's Choice and is progressively integrating two member bases, brands and systems.", kind: "verified" },
      { text: "Merger integration creates a decision window in which contact-centre technology is being chosen rather than inherited, which is the single best moment to introduce a conversational layer.", kind: "inference" },
      { text: "Integration itself generates member contact — questions about brand changes, account access, product mapping and communications — on top of normal volume.", kind: "inference" },
      { text: "Realising merger cost synergies without cutting onshore member-facing roles requires automation of routine servicing rather than headcount reduction.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Customer-owned banks buy their technology, and a merged mutual mid-integration has neither the capacity nor the appetite for a platform build. The integration programme itself is the buying trigger: one conversational layer across two consolidating operations is materially cheaper than harmonising two staffed contact centres.",
    whyNotBuild:
      "Integration is consuming every available engineering and change-management resource. Adding a speech, telephony, orchestration and evaluation build during a core systems merger would be the highest-risk decision available, and the capability is procurable in a fraction of the time.",
    workflows: [
      {
        name: "Unified member servicing across merged brands",
        friction: "Two contact centres serve two member bases with different systems and scripts for identical requests, doubling training and producing inconsistent experience.",
        outcome: "One conversational layer resolves member identity across both legacy bases and handles routine servicing consistently, regardless of legacy brand.",
        channels: ["Voice", "App", "Web chat"],
        systems: ["Both legacy core banking platforms", "Digital banking channels", "Identity and authentication", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Integration and migration support",
        friction: "Every migration wave generates member questions about access, product changes and communications, absorbed by temporary staffing at high cost.",
        outcome: "Migration questions handled conversationally with grounded, wave-specific guidance, absorbing the spike without temporary hiring.",
        channels: ["Voice", "SMS", "Email", "App"],
        systems: ["Migration tracking", "Digital banking platform", "Identity services", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Home-loan servicing and application status",
        friction: "Members and brokers call for application progress and loan servicing across two lending operations with different processes and turnaround expectations.",
        outcome: "Consistent status and servicing answers across both legacy books, with proactive chasing of outstanding requirements.",
        channels: ["Voice", "SMS", "Email", "Broker portal"],
        systems: ["Loan origination systems", "Loan servicing platforms", "Document management", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Digital and mobile banking across the legacy Heritage and People's Choice member bases",
        "Two onshore contact centres progressively consolidating under one brand",
        "Branch networks across Queensland, South Australia and the Northern Territory",
        "A broker channel supporting home-loan origination",
      ],
      gaps: [
        "Member servicing is duplicated across two systems and two sets of processes",
        "Migration waves generate contact spikes absorbed by temporary staffing",
        "Member identity is not resolved consistently across the merged base",
        "Loan servicing and status answers differ depending on the legacy institution",
      ],
    },
    risks: [
      "Privacy Act and Consumer Data Right obligations apply across two member bases whose consent and data histories differ.",
      "ASIC internal dispute resolution and Banking Code obligations require consistent complaint and hardship handling during an integration when processes are in flux.",
      "Integration timing is the key commercial risk: too early and systems are unstable, too late and the contact-centre decision has already been made.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 7,
      automationRate: 0.5,
      basis: "Seller assumptions only — combined contact volume across both legacy operations and fully loaded Australian cost per contact must be validated with People First Bank operations leadership.",
    },
    pilotScope:
      "Deploy one conversational servicing layer that resolves member identity across both legacy bases and handles routine everyday banking requests consistently on voice and app, designed to survive the core-system consolidation.",
    expansion: [
      "Add integration and migration support to absorb each conversion wave's contact spike",
      "Add home-loan servicing and application status across both legacy lending books",
      "Add proactive outbound for brand transition, product mapping and regulatory notifications",
    ],
    stakeholders: [
      "Chief Customer Officer / Head of Member Experience",
      "Chief Operating Officer / Integration Programme lead",
      "Head of Contact Centre Operations",
      "Chief Information Officer",
      "Head of Risk and Compliance",
    ],
    discovery: [
      "When does the contact-centre consolidation decision land in the integration plan?",
      "What is the combined contact volume across both legacy operations, and how much is duplicated?",
      "Can a conversational layer read both legacy cores during the transition period?",
      "What contact spike does each migration wave generate, and how is it staffed today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A former Heritage member calls about a card that stopped working mid-migration, is identified across both legacy systems, and has a replacement ordered in one conversation.",
  },
};
