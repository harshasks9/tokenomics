// Deep analysis blocks for the first 50 Indonesia / Philippines / Vietnam
// qualified profiles. Evidence discipline: "verified" = widely-reported public
// fact; "inference" = reasoned from public information; "hypothesis" = seller
// hypothesis to validate with the account team. No fabricated figures, quotes,
// dates or URLs. All economics are seller assumptions for discovery.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_ID_PH_VN_A: Record<string, ProfileAnalysis> = {
  "cimb-niaga": {
    operatingContext:
      "CIMB Niaga is the Indonesian arm of Malaysia's CIMB Group and one of the country's largest private universal banks, running consumer, SME, commercial and corporate books alongside a sharia business operated as an in-bank unit (CIMB Niaga Syariah). Its consumer franchise is unusually card- and mortgage-weighted for an Indonesian bank, anchored on payroll and affluent relationships concentrated in Greater Jakarta, Surabaya, Bandung and Medan. Over a decade the bank has rationalised branches and pushed everyday transactions onto OCTO Mobile and OCTO Clicks, which now carry the bulk of retail activity. What did not move digital is the conversation layer: card disputes, unrecognised-transaction reports, instalment conversion, limit changes and mortgage servicing still land on the phone-banking line, in-app chat and an increasingly WhatsApp-native customer base, almost entirely in Bahasa Indonesia with English for affluent and expatriate segments.",
    strategicPressure: [
      { text: "As a majority-owned subsidiary of CIMB Group, technology standards, vendor frameworks and AI governance are set with reference to Kuala Lumpur, which lengthens local procurement but also means a group-credible platform can be replicated across CIMB's other markets.", kind: "verified" },
      { text: "A card- and consumer-loan-heavy book generates disproportionate dispute, chargeback and collections conversation volume per customer compared with deposit-led peers, so contact cost scales with exactly the products the bank is growing.", kind: "inference" },
      { text: "Branch rationalisation has shifted servicing demand to remote channels faster than remote channels have gained the ability to complete actions, leaving the call centre as the de facto system of resolution.", kind: "inference" },
      { text: "OJK's push on digital-channel resilience and consumer-protection complaint handling raises the cost of unresolved and unlogged conversations, making full-coverage QA a governance asset rather than a nice-to-have.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. CIMB Niaga's technology organisation is an integration and channel-delivery function, not a platform-engineering one; its visible digital output is app releases and journey redesigns, not speech models or orchestration frameworks. Group-level vendor frameworks reinforce a purchase motion, and the bank has no public record of building conversational infrastructure in-country.",
    whyNotBuild:
      "The four hard parts are all outside a mid-large Indonesian bank's engineering perimeter: production-grade Bahasa Indonesia speech recognition and synthesis that survives code-switching and regional accents; carrier-grade telephony integration with the existing contact-centre estate; deterministic orchestration that can execute card blocks and disputes against core systems within policy; and continuous evaluation of every conversation to satisfy OJK complaint-handling scrutiny. Assembling that stack would require a speech and ML team the bank cannot recruit against fintech and group-tech competition, plus multi-year operating cost with no differentiation at the end.",
    workflows: [
      {
        name: "Card dispute and unrecognised-transaction intake",
        friction: "A customer who spots an unrecognised charge calls, re-authenticates from scratch, narrates the transaction, and then waits days with no visibility while a dispute form is keyed by an agent; status chasing produces two or three repeat calls per dispute.",
        outcome: "Structured dispute captured in the first conversation with the transaction pulled from the card system, provisional-credit rules explained consistently, and proactive status pushes that suppress the follow-up calls.",
        channels: ["Voice", "WhatsApp", "OCTO Mobile in-app chat"],
        systems: ["Card management system", "Core banking", "Dispute/chargeback case management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card servicing actions in-conversation",
        friction: "Block/replace, limit increase, instalment conversion and PIN reset each require a human agent and a different screen, so simple intents consume full-cost handling time and queue during evening and weekend peaks when no capacity exists.",
        outcome: "Identity resolved once and the action executed inside the conversation within policy limits, with anything above threshold routed to a human with the full transcript already assembled.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Card management system", "Core banking", "Authentication/OTP service", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Mortgage and consumer-loan servicing",
        friction: "Instalment amount, outstanding balance, rate-reset explanation and early-settlement quotes are asked repeatedly across a long product life, and each needs an agent to read from a loan system the customer cannot see.",
        outcome: "Grounded, citable answers from the loan system in Bahasa, with settlement quotes and payment instructions delivered in-channel and only genuine restructuring conversations reaching a human.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan servicing system", "Core banking", "Document management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "OCTO Mobile and OCTO Clicks as the primary self-service transaction channels",
        "A national phone-banking contact centre with IVR authentication",
        "In-app and website chat servicing with human agents behind it",
        "Digital account-opening journeys with electronic KYC",
      ],
      gaps: [
        "Customers cannot complete a card dispute end-to-end without a human, and cannot see its status without calling",
        "No conversational channel completes an action outside the app — chat answers, then hands to a queue",
        "Servicing outside working hours falls back to an IVR that can only take messages",
        "Conversations are sampled for QA, so systemic mis-selling or mis-advice patterns surface late",
      ],
    },
    risks: [
      "OJK consumer-protection rules on complaint handling and resolution timelines mean any automated dispute intake must produce an auditable case record with defensible timestamps.",
      "Indonesia's Personal Data Protection Law constrains where customer voice recordings and transcripts can be processed and stored, and requires a lawful basis and retention discipline for training on them.",
      "Bahasa Indonesia voice quality has to hold up against heavy Indonesian-English code-switching in affluent segments and regional accents in secondary cities, or handover rates will erase the economics.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions derived from the bank's retail scale and card-led product mix; volume, blended cost per contact and containable share must all be replaced with the bank's own contact-centre MIS during discovery.",
    },
    pilotScope:
      "One Launch-scope pilot on card servicing: block/replace, limit query and instalment conversion plus structured dispute intake, on voice and WhatsApp in Bahasa Indonesia, integrated to the card management system and CRM, measured against containment and dispute-status repeat-call volume.",
    expansion: [
      "Extend from card servicing to mortgage and personal-loan servicing on the same identity and orchestration layer",
      "Add proactive outbound: payment reminders, instalment-offer campaigns and dispute-status pushes under OJK contact-window rules",
      "Replicate the deployment pattern into CIMB Group's other ASEAN markets under the group vendor framework",
    ],
    stakeholders: [
      "Director of Consumer Banking",
      "Head of Customer Experience / Contact Centre",
      "Head of Cards and Payments",
      "Chief Information Officer / Head of IT",
      "Head of Compliance and Consumer Protection",
    ],
    discovery: [
      "Are CX platform and conversational-AI decisions made in Jakarta, or do they require CIMB Group approval in Kuala Lumpur — and what is the actual approval path?",
      "What share of contact-centre volume is card-related, and how many contacts does an average dispute generate from intake to closure?",
      "Which card and core-banking actions are already exposed as APIs to the digital channels, and which still require a human agent on a green screen?",
      "How is contact-centre QA done today, and what would OJK expect to see if a complaint arising from an automated conversation escalated?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A CIMB Niaga cardholder in Surabaya reports an unrecognised transaction on WhatsApp at 11pm and gets the dispute filed, the card blocked and a replacement dispatched without waiting for the morning shift.",
  },

  "bank-danamon": {
    operatingContext:
      "Bank Danamon is a universal bank majority-owned by Japan's MUFG, combining a mid-sized consumer and SME franchise with an unusually strong position in auto and motorcycle financing through its affiliate Adira Finance. Its distribution mixes conventional branches, a sharia unit, and the D-Bank PRO digital channel that carries everyday retail transactions. The customer base skews mass-affluent and SME in Java's major cities, with a long tail of consumer-finance customers reached through dealer and Adira channels rather than branches. Everyday servicing, loan and instalment questions, and cross-sell conversations run through the call centre, branch staff and a growing but still assisted digital chat channel, overwhelmingly in Bahasa Indonesia.",
    strategicPressure: [
      { text: "MUFG's control means capital, risk and technology governance are exercised through a Japanese parent whose subsidiaries typically procure under group vendor frameworks rather than building customer-facing AI in-country.", kind: "verified" },
      { text: "The Adira relationship gives Danamon a consumer-finance customer population far larger than its branch banking base, and those customers generate reminder and collections conversations at a frequency retail deposits never do.", kind: "verified" },
      { text: "Competing for retail deposits against much larger state banks with vastly bigger branch networks pushes Danamon toward service quality and digital convenience as its differentiator, which raises the cost of a weak conversational channel.", kind: "inference" },
      { text: "A shared CX platform across Danamon and Adira would materially improve the economics of any deployment, but only if the two entities can agree a single owner — this is the main structural risk to a large deal.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Danamon's technology function is oriented to core-banking modernisation, channel delivery and MUFG integration work. There is no public evidence of speech, NLU or agent-orchestration engineering, and MUFG-group governance favours proven vendor platforms with clear accountability over in-house experiments in customer-facing AI.",
    whyNotBuild:
      "Danamon would have to build Bahasa speech, telephony integration with a legacy contact-centre estate, orchestration that safely writes to core banking and loan systems, and an evaluation regime robust enough to satisfy both OJK and MUFG's internal audit. Each of those is a multi-year specialist capability with no competitive payoff for a bank whose scarce engineering capacity is already committed to core and channel modernisation.",
    workflows: [
      {
        name: "Everyday account and D-Bank PRO servicing",
        friction: "Balance, transaction history, card status, blocked-access and transfer-limit questions arrive by phone and chat and consume full-cost human handling even though every answer already exists in a system of record.",
        outcome: "Routine servicing contained in-conversation in Bahasa with identity resolved once, freeing agents for advisory and complaint work and extending coverage beyond office hours.",
        channels: ["Voice", "WhatsApp", "D-Bank PRO in-app chat"],
        systems: ["Core banking", "Digital channel platform", "CRM", "Authentication/OTP service"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Consumer-loan instalment and payoff servicing",
        friction: "Instalment schedules, outstanding balances and early-settlement quotes require an agent to interpret a loan system, and customers who cannot get through simply miss payments — converting a service failure into a credit cost.",
        outcome: "Live loan position and settlement quotes delivered conversationally with a payment link in-channel, so the servicing answer and the payment happen in the same interaction.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan servicing system", "Core banking", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "SME banking support desk",
        friction: "SME owners call about transaction failures, payroll transfers, trade documents and limit questions during business hours only, and are routed through the same consumer queue with no recognition of their commercial relationship.",
        outcome: "SME customers recognised at hello with facility and transaction context loaded, routine queries resolved immediately and relationship-manager escalation carrying full conversation context.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Core banking", "Cash management platform", "CRM", "Trade finance system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "D-Bank PRO mobile banking as the primary retail self-service channel",
        "A 24-hour call centre with IVR-based authentication",
        "Website and in-app chat servicing with human agents",
        "Digital onboarding with electronic KYC for retail accounts",
      ],
      gaps: [
        "No conversational channel that can execute a card block, limit change or dispute without a human",
        "Loan servicing answers are unavailable outside the loan officer relationship or a phone queue",
        "Adira-sourced consumer-finance customers experience an entirely separate servicing journey with no shared context",
        "Only a sampled fraction of conversations is quality-scored, so complaint precursors are invisible",
      ],
    },
    risks: [
      "OJK consumer-protection and complaint-handling rules require auditable records and defined resolution timelines for anything an automated agent commits to.",
      "Indonesia's Personal Data Protection Law governs cross-border processing of voice and transcript data, which interacts with MUFG group hosting preferences and must be resolved before architecture is fixed.",
      "MUFG group audit and third-party-risk standards will apply to any AI vendor, extending the diligence cycle well beyond a typical local procurement.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.0,
      automationRate: 0.5,
      basis: "Seller assumptions sized from Danamon's retail and SME scale; actual contact volume, blended agent cost and containable mix must be validated against contact-centre reporting in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot deflecting routine account and D-Bank PRO servicing on voice and WhatsApp in Bahasa Indonesia, integrated to core banking and CRM, measured on containment rate and after-hours coverage.",
    expansion: [
      "Extend to consumer-loan servicing and instalment payment collection in-channel",
      "Add the SME support desk with entitlement-aware recognition and relationship-manager handoff",
      "Open a shared servicing layer with Adira Finance so consumer-finance customers get one conversational front door",
    ],
    stakeholders: [
      "Director of Consumer Banking",
      "Head of Digital Banking",
      "Head of Contact Centre Operations",
      "Chief Information Officer",
      "Head of Operational Risk and Compliance",
    ],
    discovery: [
      "Which CX and AI decisions require MUFG group approval, and has any group-level conversational-AI vendor already been selected?",
      "What is the current monthly contact volume split between D-Bank PRO chat, the call centre and branches, and what does an average contact cost fully loaded?",
      "Is there an appetite to build a shared servicing layer with Adira Finance, and who would own it commercially?",
      "Which core-banking and loan-system actions are exposed via API today, and what is the change-window reality for adding new ones?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Danamon customer in Bandung asks on WhatsApp why a transfer failed, gets the real reason from core banking, and has the limit raised inside the same conversation.",
  },

  "bank-permata": {
    operatingContext:
      "Bank Permata is a mid-large Indonesian universal bank that became a subsidiary of Thailand's Bangkok Bank in 2020, giving it a distinctive dual identity: a domestic retail and SME franchise plus a growing role as the group's Indonesian wholesale and cross-border banking platform. Retail customers are served through PermataMobile X, a branch network concentrated in Java and the major secondary cities, and a sharia business unit. Its consumer proposition centres on payroll, savings, mortgages and cards for urban mass-affluent customers, while corporate and SME banking is increasingly tied to Bangkok Bank's regional trade and supply-chain flows. Servicing conversations run through the contact centre, in-app chat and branches, in Bahasa Indonesia with English for corporate and expatriate clients.",
    strategicPressure: [
      { text: "Since the Bangkok Bank acquisition the bank's technology agenda has been dominated by integration, core modernisation and channel consolidation — a context in which packaged, fast-to-value capabilities compete well against internal builds.", kind: "inference" },
      { text: "Bangkok Bank's ownership creates a regional replication story: a conversational deployment proven in Indonesia is directly relevant to the group's other cross-border retail operations.", kind: "inference" },
      { text: "Permata sits in the competitive middle of Indonesian banking — too small to outspend the state banks on branches, too large to survive on niche positioning — so cost-to-serve and digital completion rates are strategically decisive.", kind: "inference" },
      { text: "Digital account-opening growth without a matching conversational assist layer produces abandoned applications that nobody recovers, which is likely the single largest measurable leak in the retail funnel.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Permata's engineering capacity is committed to post-acquisition integration and channel modernisation. There is no public signal of speech or conversational-AI engineering, and a bank in an integration cycle characteristically buys capabilities that shorten time-to-value rather than opening new build fronts.",
    whyNotBuild:
      "Building would mean standing up Bahasa speech, telephony integration, orchestration into a core estate that is itself mid-modernisation, and an evaluation framework — while the same scarce engineers are absorbed by Bangkok Bank integration work. The opportunity cost is the argument: every engineer diverted to conversational infrastructure is one not delivering the integration roadmap the board is measuring.",
    workflows: [
      {
        name: "Digital onboarding assist and abandonment recovery",
        friction: "Applicants abandon digital account opening at document capture and eKYC steps, learn about rejected documents days later if at all, and receive no proactive help — the funnel leak is invisible until a monthly report.",
        outcome: "Guided, step-by-step onboarding in Bahasa with document issues explained in-flow and consent-based re-engagement of abandoned applications, turning silent drop-off into measured, recoverable pipeline.",
        channels: ["WhatsApp", "In-app chat", "Voice"],
        systems: ["Digital onboarding platform", "eKYC/Dukcapil verification", "Core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Application and request status servicing",
        friction: "Where-is-my-application and where-is-my-card contacts dominate inbound volume, and each is answered by a human reading a status screen the customer has no access to.",
        outcome: "Status pushed proactively at every stage change and answered instantly on demand, removing the largest single category of low-value inbound contact.",
        channels: ["WhatsApp", "Voice", "In-app chat"],
        systems: ["Loan origination system", "Card issuance system", "Core banking", "CRM"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Everyday retail servicing on PermataMobile X",
        friction: "Login failures, blocked access, transfer-limit and transaction-dispute queries route to the contact centre where they queue behind more complex work, with no coverage outside peak staffing.",
        outcome: "Routine servicing resolved in-conversation with identity carried once, and genuine complaints escalated to humans with full context and a case already opened.",
        channels: ["Voice", "In-app chat", "WhatsApp"],
        systems: ["Digital channel platform", "Core banking", "Authentication service", "CRM"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "PermataMobile X as the retail digital banking and self-service channel",
        "A contact centre with IVR authentication and human agents",
        "Digital account opening with electronic KYC",
        "Website and in-app chat servicing",
      ],
      gaps: [
        "Abandoned digital applications are not conversationally recovered — the customer simply disappears",
        "Application and card-issuance status must be asked for; it is never pushed",
        "No conversational channel can complete a servicing action outside the app",
        "Sharia-unit customers and conventional customers get the same generic servicing script",
      ],
    },
    risks: [
      "OJK rules on electronic banking service and consumer complaint handling require auditable trails for automated interactions and defined escalation paths.",
      "Indonesia's Personal Data Protection Law applies to eKYC data touched during onboarding assistance, constraining what an automated agent may see, store or transmit cross-border to a Thai parent.",
      "Bangkok Bank group third-party-risk and technology governance will gate vendor selection, potentially extending the sales cycle beyond a locally-decided deal.",
    ],
    economics: {
      volumeMonthly: 550000,
      costPerInteraction: 1.0,
      automationRate: 0.5,
      basis: "Seller assumptions based on Permata's retail scale and typical Indonesian mid-large bank contact ratios; replace with the bank's own onboarding funnel and contact-centre data during discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on digital onboarding assistance and application-status deflection over WhatsApp and voice in Bahasa Indonesia, integrated to the onboarding platform and CRM, measured on application completion rate and status-contact reduction.",
    expansion: [
      "Extend to everyday retail servicing across PermataMobile X and voice",
      "Add sharia-specific journeys with compliant product explanations for the sharia business unit",
      "Package the deployment for Bangkok Bank group replication in other cross-border retail markets",
    ],
    stakeholders: [
      "Director of Retail Banking",
      "Head of Digital Banking and Channels",
      "Head of Customer Care / Contact Centre",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What is the current completion rate for digital account opening, and where in the funnel does abandonment concentrate?",
      "Does Bangkok Bank group technology governance require parent approval for a customer-facing AI vendor, and what is that process?",
      "How much of inbound contact volume is application or card status, and what does each contact cost fully loaded?",
      "Which servicing actions are already API-exposed on PermataMobile X, and could an agent invoke the same endpoints?",
    ],
    flowTemplate: "onboarding",
    scenario: "A Permata applicant whose ID photo was rejected gets told why on WhatsApp within minutes and finishes account opening the same evening instead of abandoning it.",
  },

  "smbc-indonesia": {
    operatingContext:
      "SMBC Indonesia, rebranded from Bank BTPN after Sumitomo Mitsui Banking Corporation consolidated its Indonesian holdings, is genuinely two banks in one balance sheet. The BTPN heritage brings a mass-market and pension-focused franchise — retirees receiving monthly pension payments through the bank, plus a productive-poor microbanking legacy — served largely through branches, agents and voice in Bahasa and regional languages. The Jenius franchise is the opposite: a digital-native app bank for urban, young, financially literate customers who expect in-app resolution and treat a phone queue as a product failure. SMBC's ownership adds a Japanese corporate banking layer serving Japanese manufacturers in Indonesian industrial estates. The result is a single institution that has to serve a 68-year-old pension customer in Central Java and a 26-year-old Jenius user in South Jakarta with completely different channel realities.",
    strategicPressure: [
      { text: "SMBC's consolidation of its Indonesian banking assets under one brand creates an integration agenda in which duplicated servicing operations across the heritage and Jenius bases are an obvious cost target.", kind: "verified" },
      { text: "Pension customers are a high-frequency, low-value contact population — payment date, amount, card and branch questions every month — for whom human servicing cost is structurally misaligned with revenue.", kind: "inference" },
      { text: "Jenius competes directly with app-native challengers where support response time is a visible product attribute, and its lean operating model cannot staff to the expectation it has set.", kind: "inference" },
      { text: "The most valuable near-term move is a single conversational layer serving both bases with different personas, which is also the hardest to get organisationally agreed between the Jenius product org and bank operations.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Jenius has real product and engineering capability and will not accept a black-box packaged suite for its in-app experience, but neither Jenius nor bank operations will build speech infrastructure, telephony orchestration or an evaluation framework. The right motion is a platform they configure and extend, delivered with industry workflows, rather than either a pure product sale or a co-build of primitives.",
    whyNotBuild:
      "Jenius's engineering is deliberately focused on the customer-facing product surface — features, journeys, and the app itself — not on the infrastructure beneath conversations. Bahasa and regional-language speech quality, carrier telephony for the pension base, deterministic policy-bounded execution into core banking, and continuous conversation evaluation are four separate specialist disciplines. Building them would divert the product team from the roadmap that justifies Jenius's existence, and the pension side has no engineering organisation at all.",
    workflows: [
      {
        name: "Pension payment and card servicing",
        friction: "Every month a wave of pension customers calls or visits a branch to ask whether payment has landed, why the amount changed, or how to replace a blocked card — a predictable, repetitive load that peaks on payment dates and overwhelms branch and phone capacity.",
        outcome: "Payment status, amount explanation and card actions handled conversationally in Bahasa with simple voice interaction, plus proactive payment-landed notifications that suppress the monthly call spike entirely.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core banking", "Pension payment system", "Card management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Jenius in-app support automation",
        friction: "Jenius users raise transaction disputes, card and Flexi Saver questions, and login issues in-app and then wait in a queue, which is precisely the experience the product promises to eliminate.",
        outcome: "Grounded, instant in-app resolution with account context loaded, actions executed within policy, and only genuinely novel issues escalated with a full transcript to a human specialist.",
        channels: ["In-app chat", "Email", "Voice"],
        systems: ["Jenius core platform", "Card management", "Dispute case management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card dispute and fraud-report intake",
        friction: "Dispute intake is manual on both sides of the bank, with different processes, so a fraud report's speed of capture depends on which brand the customer holds and what hour it is.",
        outcome: "One structured intake path across both franchises that captures the dispute, blocks the instrument immediately where warranted, and hands a complete case to the fraud team.",
        channels: ["Voice", "In-app chat", "WhatsApp"],
        systems: ["Card management", "Fraud monitoring", "Case management", "Core banking"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "The Jenius app with in-app chat support and self-service transaction features",
        "A branch and agent network serving pension and mass-market customers",
        "A contact centre with IVR for the heritage bank customer base",
        "Digital onboarding with electronic KYC on the Jenius side",
      ],
      gaps: [
        "Pension customers have no self-service path that works for them — the app is not the answer for that demographic",
        "Jenius in-app support cannot execute most actions; it answers and then hands off",
        "Nothing proactively tells a pension customer their payment has landed, so they call to check",
        "The two customer bases have completely separate servicing operations with no shared conversational layer",
      ],
    },
    risks: [
      "OJK consumer-protection expectations are heightened for pension and elderly customers, so automated interactions must include clear vulnerability detection and human-escalation paths.",
      "Indonesia's Personal Data Protection Law applies to voice recordings and transcripts, and SMBC group hosting preferences may pull processing toward Japan — a residency question to settle early.",
      "Regional-language and elderly-speaker voice recognition quality is the operational make-or-break for the pension workflow; accent and speech-rate variation must be tested before commitment.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions combining the high-frequency pension servicing base with Jenius in-app support volume; both must be measured separately against the bank's own reporting during discovery.",
    },
    pilotScope:
      "A Scale-scope pilot running two tracks in parallel: proactive pension-payment notification plus voice servicing in Bahasa for the heritage base, and in-app support automation for Jenius, both on shared identity and orchestration, measured on monthly call-spike suppression and Jenius first-contact resolution.",
    expansion: [
      "Unify card dispute and fraud intake across both franchises on one structured path",
      "Add outbound persistency and cross-sell conversations to the pension base under OJK contact rules",
      "Extend to SME and Japanese-corporate client servicing with bilingual coverage",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Jenius Product Head / Head of Digital Banking",
      "Head of Pension Business",
      "Chief Technology Officer",
      "Head of Compliance and Consumer Protection",
    ],
    discovery: [
      "Who owns customer-experience technology decisions — the Jenius product organisation, bank operations, or a shared function under SMBC governance?",
      "What is the monthly contact volume pattern around pension payment dates, and what does the branch queue cost on those days?",
      "What in-house conversational or LLM work has the Jenius engineering team already started, and what would they want to own versus consume?",
      "Does SMBC group policy permit customer voice and transcript data to be processed on cloud infrastructure in Indonesia?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A pension customer in Central Java gets a voice call confirming this month's payment landed, and asks about a blocked card in the same conversation without visiting a branch.",
  },

  "bank-syariah-indonesia": {
    operatingContext:
      "Bank Syariah Indonesia is the country's largest Islamic bank, created by merging the sharia arms of three state-owned banks into a single institution serving a mass retail base measured in the tens of millions of customers. Its portfolio spans everyday sharia deposits and financing, gold savings and pawning, and the signature hajj and umrah savings journeys that are unique to the Indonesian market — long-horizon products where customers save for years, track queue positions, and need guidance at every stage. Distribution is branch-heavy across Java, Sumatra and beyond, complemented by the BSI Mobile app and a contact centre. Its customers skew toward religiously-motivated savers across a wide socioeconomic range, many in secondary cities and rural areas where voice in Bahasa and regional languages remains the default channel.",
    strategicPressure: [
      { text: "BSI was formed by a 2021 merger of state-owned sharia banks and remains state-linked, so technology is procured through structured processes and the institution carries national-champion expectations for Islamic finance.", kind: "verified" },
      { text: "A widely-reported 2023 cyber incident disrupted services and put resilience, service continuity and customer communications squarely on the board agenda.", kind: "verified" },
      { text: "Hajj and umrah savings create a servicing pattern no conventional bank has: multi-year relationships with queue-position, quota and eligibility questions that generate repeat contacts for years per customer.", kind: "inference" },
      { text: "Merger integration has left overlapping systems and processes, so a conversational layer that presents one coherent front door may deliver customer-visible value faster than back-end consolidation can.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. BSI's technology agenda is dominated by post-merger integration, resilience hardening and core consolidation. As a state-linked institution it acquires capability through procurement, and there is no public evidence of internal speech or conversational-AI engineering.",
    whyNotBuild:
      "Beyond the general argument — no speech team, no telephony engineering, no orchestration framework — BSI has a specific one: its scarce technical capacity is committed to integration and security hardening after a public incident. Opening a build front on conversational AI would compete directly with the resilience programme the board is watching. The sharia-compliance review layer adds a further requirement for governed, auditable, human-approvable response content that a packaged platform can express as policy but an in-house prototype cannot.",
    workflows: [
      {
        name: "Hajj and umrah savings journey servicing",
        friction: "Customers ask about queue position, remaining balance to reach the deposit threshold, quota rules and departure eligibility repeatedly over years, and every answer requires a branch visit or a phone queue that peaks around quota announcements.",
        outcome: "Grounded, sharia-appropriate answers on savings progress and queue status delivered conversationally in Bahasa, with proactive milestone nudges that keep customers saving and cut the annual announcement-driven call spike.",
        channels: ["Voice", "WhatsApp", "BSI Mobile in-app chat"],
        systems: ["Core banking (sharia)", "Hajj savings/registration integration", "CRM", "Notification platform"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Everyday account and financing servicing",
        friction: "Balance, transaction, blocked-card, transfer-limit and financing-instalment queries flood the contact centre and branches from a mass base with limited digital confidence, at a cost per contact that dwarfs the revenue of a small sharia savings account.",
        outcome: "Routine servicing resolved in-conversation in Bahasa and major regional languages, with card and access actions executed within policy and only advisory or complaint work reaching a human.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Core banking (sharia)", "Card management", "Authentication service", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Gold savings and pawning support",
        friction: "Gold savings balance, price, and pawn-redemption questions vary with daily gold prices and require branch staff to explain terms, producing avoidable footfall and inconsistent explanations of sharia-compliant structures.",
        outcome: "Consistent, policy-approved explanations of gold savings and pawn terms with live balance and pricing, so customers can act without a branch visit and every explanation is identical and auditable.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Gold savings/pawn system", "Core banking (sharia)", "Pricing feed", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "BSI Mobile as the retail digital banking and self-service app",
        "A national contact centre with IVR authentication",
        "A large branch network acting as the default servicing channel for the mass base",
        "In-app and website chat with human agents",
      ],
      gaps: [
        "Hajj savings customers cannot get queue and eligibility answers without a branch or a queue",
        "No conversational channel executes actions — customers are told to visit a branch or use the app",
        "Regional-language servicing depends on which branch staff member is available",
        "Sharia-compliance review of customer-facing explanations is manual and inconsistently applied across channels",
      ],
    },
    risks: [
      "OJK consumer-protection rules plus sharia-supervisory-board review mean automated product explanations require a documented approval and change-control process before any response goes live.",
      "Indonesia's Personal Data Protection Law and heightened post-incident security expectations constrain where voice, transcript and customer data may be processed, and demand demonstrable access controls.",
      "Voice quality in Bahasa plus Javanese and Sundanese-accented speech, with religiously-specific Arabic-derived terminology, must be validated before any voice deployment commitment.",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions reflecting BSI's very large mass-retail base and low blended cost per contact in Indonesia; volume, contact mix and containable share require validation against BSI's own contact-centre and branch-footfall data.",
    },
    pilotScope:
      "A Scale-scope pilot covering hajj and umrah savings journey servicing plus routine account queries on voice and WhatsApp in Bahasa, integrated to core banking and the hajj savings system, measured on branch-visit deflection and call-spike suppression around quota announcements.",
    expansion: [
      "Add gold savings and pawn servicing with live pricing and policy-approved explanations",
      "Extend proactive outbound: savings-milestone nudges, financing instalment reminders and dormancy reactivation under OJK contact rules",
      "Add regional-language coverage for Javanese and Sundanese-speaking secondary-city customers",
    ],
    stakeholders: [
      "Director of Retail Banking",
      "Head of Hajj and Umrah Business",
      "Head of Customer Care / Contact Centre",
      "Chief Information Officer",
      "Head of Sharia Compliance / Sharia Supervisory Board liaison",
    ],
    discovery: [
      "What is the annual contact pattern around hajj quota and departure announcements, and how much branch capacity does it consume?",
      "What is the SOE procurement route for a platform of this type, and is there an existing framework agreement it could be bought under?",
      "Does sharia-compliance review need to approve every automated response template, and who signs off on changes?",
      "Which core-banking and hajj-registration systems are API-accessible, and what is realistic for real-time grounding?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A BSI customer saving for hajj asks in Bahasa how much more she needs to deposit and where she stands in the queue, and gets both answers with a savings plan, without leaving her village.",
  },

  "ocbc-indonesia": {
    operatingContext:
      "OCBC Indonesia is the rebranded Indonesian franchise of Singapore's OCBC, built on the long-established OCBC NISP business and repositioned around the Nyala proposition for affluent and emerging-affluent customers. The bank pairs wealth management, cards and mortgages for urban professionals with a substantial SME and commercial book, and it leans on the OCBC group's regional network to serve Indonesians with Singapore and cross-border banking needs. Distribution centres on Jakarta, Surabaya, Bandung, Medan and Semarang, with the ONe Mobile app carrying transactions and a contact centre plus relationship managers handling advice and complex servicing. The customer mix produces a trilingual reality: Bahasa Indonesia as the base, English for affluent and cross-border clients, and Mandarin relevant in parts of the Chinese-Indonesian business community.",
    strategicPressure: [
      { text: "OCBC operates a regional strategy in which Indonesia is a growth market linked to Singapore wealth and cross-border flows, so group-level technology and platform decisions carry real weight in Jakarta.", kind: "verified" },
      { text: "An affluent-focused proposition sets service expectations that a queue-and-callback model cannot meet, making responsiveness a direct driver of wealth-relationship retention rather than a back-office cost line.", kind: "inference" },
      { text: "Wealth and investment servicing carries suitability and disclosure obligations, which makes an unrecorded, unevaluated advisory conversation a compliance exposure as much as a service one.", kind: "inference" },
      { text: "The strongest wedge is not deflection but relationship-manager leverage: freeing RMs from status and admin conversations so they spend time on advice, which is how the bank would frame the business case internally.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. As a country subsidiary of a Singapore group with regional platform standards, OCBC Indonesia consumes technology decided or sanctioned at group level. Its local technology function delivers channels and integration, not speech or orchestration infrastructure.",
    whyNotBuild:
      "Group governance makes a locally-built customer-facing AI stack practically unapprovable, and the bank has no in-country speech or ML platform team. Even if it did, the combination of trilingual voice quality, telephony integration, policy-bounded execution into wealth and core systems, and suitability-grade evaluation of every advisory-adjacent conversation is exactly the kind of regulated infrastructure a subsidiary is expected to procure with a vendor accountable for it.",
    workflows: [
      {
        name: "Wealth and investment account servicing",
        friction: "Affluent clients call their relationship manager for portfolio valuations, transaction confirmations, statement requests and product mechanics, consuming the RM's day with retrieval work that has no advisory value.",
        outcome: "Grounded portfolio and transaction answers delivered instantly in the client's language with strict boundaries on anything constituting advice, so RM time shifts to genuine advisory conversations.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Wealth management platform", "Core banking", "Custody/statement system", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Nyala onboarding and activation assistance",
        friction: "Nyala onboarding involves eligibility, funding thresholds, document capture and product bundling, and applicants who stall receive no proactive help, so acquisition spend leaks at the last step.",
        outcome: "Guided onboarding in the applicant's language with document issues resolved in-flow, plus post-approval activation nudges that convert opened accounts into funded, active relationships.",
        channels: ["WhatsApp", "In-app chat", "Voice"],
        systems: ["Digital onboarding platform", "eKYC verification", "Core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card and everyday banking servicing",
        friction: "Card blocks, limit changes, foreign-transaction queries and dispute intake — high for a travelling affluent base — all require a human agent, with no coverage across the time zones clients actually travel in.",
        outcome: "Around-the-clock card servicing with actions executed in-conversation within policy limits, and disputes captured as structured cases at the moment the client notices them.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Card management system", "Core banking", "Dispute case management", "Authentication service"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The ONe Mobile app for retail transactions and self-service",
        "A relationship-manager model serving affluent and Nyala customers",
        "A contact centre with IVR and priority routing for premium segments",
        "Digital onboarding with electronic KYC",
      ],
      gaps: [
        "Clients cannot get a portfolio or transaction answer outside RM working hours",
        "No conversational channel completes card or servicing actions without a human",
        "Onboarding and activation drop-off is not conversationally recovered",
        "Advisory-adjacent conversations across RM channels are not systematically recorded or evaluated for suitability",
      ],
    },
    risks: [
      "OJK conduct and suitability rules for wealth and investment products mean an automated agent must be tightly bounded away from anything constituting advice, with demonstrable guardrails.",
      "Indonesia's Personal Data Protection Law plus OCBC group data-residency standards will shape where voice, transcript and portfolio data can be processed — resolve before architecture is fixed.",
      "Trilingual voice quality including Mandarin and heavy English code-switching in the affluent segment has to be proven, or the premium segment will experience the agent as a downgrade.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.3,
      automationRate: 0.45,
      basis: "Seller assumptions reflecting a smaller but higher-value affluent contact base with above-average cost per contact; validate against the bank's contact-centre and RM time-allocation data in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on Nyala onboarding assistance plus routine account and card servicing over WhatsApp and voice in Bahasa and English, integrated to the onboarding platform and core banking, measured on onboarding completion and RM time released.",
    expansion: [
      "Add wealth and investment account servicing with strict advice guardrails and full conversation evaluation",
      "Extend to SME and commercial banking support with entitlement-aware recognition",
      "Replicate the deployment pattern across OCBC's regional franchises under group standards",
    ],
    stakeholders: [
      "Head of Consumer Financial Services",
      "Head of Wealth Management",
      "Head of Customer Experience / Contact Centre",
      "Chief Information Officer",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "How centralised is CX platform selection with OCBC Group in Singapore, and what would a Jakarta-led pilot require to proceed?",
      "How much relationship-manager time goes to retrieval and admin rather than advisory conversations?",
      "What are the Nyala onboarding completion and first-funding rates, and where does drop-off concentrate?",
      "What are the group's data-residency requirements for customer voice recordings and wealth-portfolio data?",
    ],
    flowTemplate: "onboarding",
    scenario: "A Nyala applicant in Jakarta stalls at the funding step, gets a WhatsApp walkthrough in English, and completes activation the same day instead of lapsing.",
  },

  "maybank-indonesia": {
    operatingContext:
      "Maybank Indonesia is the Indonesian subsidiary of Malaysia's Maybank Group, running a universal bank across retail, SME and corporate banking plus a sharia business unit, with the M2U ID app as its retail digital channel. Its franchise is smaller than the domestic leaders and is positioned around SME and commercial banking alongside a retail deposit and lending base concentrated in Java and the major urban centres. The bank also carries the group's cross-border proposition for customers with Malaysian and regional connections. Servicing runs through branches, the contact centre and M2U chat, in Bahasa Indonesia with English for corporate and cross-border customers, and the everyday contact mix is dominated by account access, transaction and loan-servicing questions rather than complex advisory work.",
    strategicPressure: [
      { text: "Maybank Group runs a regional technology and digital strategy across its ASEAN footprint, so the Indonesian unit's conversational-AI path is likely to follow a group-sanctioned platform decision and rollout sequence.", kind: "verified" },
      { text: "Sub-scale relative to Indonesia's largest banks, Maybank Indonesia carries a branch and contact-centre cost base that is proportionally heavier per customer, making cost-to-serve reduction structurally more urgent than for larger peers.", kind: "inference" },
      { text: "SME banking is its stated strength, and SME customers are chronically underserved by consumer-grade contact centres — an entitlement-aware conversational desk is a differentiator the bank could actually market.", kind: "inference" },
      { text: "Where Indonesia sits in Maybank Group's rollout order is the deal-defining question: first-mover pilot country versus later adopter changes the entire engagement approach.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Maybank Indonesia is a subsidiary whose technology choices sit within a group framework, and its in-country technology function is a delivery and integration organisation. There is no public evidence of speech, NLU or conversational-orchestration engineering in Jakarta.",
    whyNotBuild:
      "Group governance alone makes an independent build implausible, and the economics make it irrational: a bank of this scale cannot amortise the cost of Bahasa speech engineering, telephony integration, orchestration and evaluation across its contact volume. The right-to-win is that a packaged platform delivers all four immediately, with a vendor accountable to both OJK and Maybank Group's third-party-risk regime.",
    workflows: [
      {
        name: "Everyday retail account servicing",
        friction: "Balance, transaction history, blocked-access, transfer-limit and card queries arrive by phone and M2U chat and are handled by agents even though every answer is a lookup, with no meaningful coverage outside staffed hours.",
        outcome: "Routine servicing contained conversationally in Bahasa with identity resolved once and simple actions executed in-policy, extending coverage to all hours without adding headcount.",
        channels: ["Voice", "WhatsApp", "M2U in-app chat"],
        systems: ["Core banking", "Digital channel platform", "Card management", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "SME banking support desk",
        friction: "SME owners chase failed transfers, payroll batch issues, facility limits and trade-document status through the same queue as consumer customers, with no recognition of their relationship and no answers outside business hours.",
        outcome: "SME customers recognised at hello with facility, limit and transaction context loaded, routine operational queries resolved immediately and relationship-manager escalation arriving with full context.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Cash management platform", "Core banking", "Trade finance system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan and financing servicing including sharia products",
        friction: "Instalment amounts, outstanding balances, settlement quotes and sharia-product mechanics require an agent or branch officer, and explanations vary by who answers — a real risk for sharia product descriptions.",
        outcome: "Consistent, policy-approved product explanations with live loan positions and settlement quotes delivered in-channel, and sharia language reviewed once and applied identically everywhere.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Loan servicing system", "Sharia core banking unit", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The M2U ID mobile app for retail digital banking",
        "A contact centre with IVR authentication",
        "Website and in-app chat servicing with human agents",
        "Digital account opening with electronic KYC",
      ],
      gaps: [
        "No conversational channel executes servicing actions without a human agent",
        "SME customers get consumer-grade servicing with no entitlement awareness",
        "Sharia product explanations depend on the individual staff member answering",
        "After-hours contact reaches an IVR that can only take a message",
      ],
    },
    risks: [
      "OJK electronic-banking and consumer-protection rules require auditable records and defined complaint-resolution timelines for automated interactions.",
      "Indonesia's Personal Data Protection Law governs voice and transcript processing, and Maybank Group hosting standards may pull processing toward regional infrastructure — settle residency before design.",
      "Sharia product explanations require sharia-supervisory review and change control, which must be built into the response-governance process rather than bolted on.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 1.0,
      automationRate: 0.5,
      basis: "Seller assumptions sized from Maybank Indonesia's retail and SME base; contact volume, cost per contact and containable mix require validation against the bank's own reporting in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot deflecting routine retail account servicing on voice and WhatsApp in Bahasa Indonesia, integrated to core banking and CRM, measured on containment rate and after-hours resolution coverage.",
    expansion: [
      "Add the SME support desk with entitlement-aware recognition and RM escalation",
      "Extend to loan and sharia-financing servicing with governed product explanations",
      "Align with Maybank Group's regional rollout to replicate into other ASEAN subsidiaries",
    ],
    stakeholders: [
      "Director of Community Financial Services",
      "Head of SME Banking",
      "Head of Contact Centre / Customer Care",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What is Maybank Group's regional CX platform strategy, and where does Indonesia sit in the rollout order?",
      "What proportion of contact-centre volume is SME versus consumer, and is SME served by a distinct team today?",
      "Which core-banking and cash-management actions are API-exposed, and what is the integration lead time for new ones?",
      "How are sharia product explanations reviewed and version-controlled across channels today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Maybank Indonesia SME owner in Semarang asks on WhatsApp why a payroll batch failed, gets the exact rejection reason, and resubmits without waiting for Monday.",
  },

  "bank-mega": {
    operatingContext:
      "Bank Mega is the banking arm of CT Corp, Chairul Tanjung's conglomerate, and its strategic distinctiveness is the group ecosystem it sits inside: Transmart hypermarkets, Trans TV and Trans7 broadcasting, Trans Studio theme parks, and a large credit-card business whose value proposition is built on discounts and instalments across those group assets. That makes Bank Mega a card-led bank rather than a deposit-led one, with a mass-market cardholder base that engages constantly around promotions, instalment conversions, billing disputes and reward redemptions. Servicing runs through a contact centre, the M-Smile app, branches and increasingly WhatsApp, in Bahasa Indonesia. The promotional cadence of the ecosystem means contact volume is campaign-driven and spiky in a way most banks never experience.",
    strategicPressure: [
      { text: "Bank Mega's card business is structurally tied to CT Corp's retail and entertainment assets, so promotional calendars drive customer-contact spikes that a fixed contact-centre roster cannot absorb.", kind: "verified" },
      { text: "Card-led banking generates the highest contact-per-customer ratio in retail banking — billing, disputes, limits, instalments and rewards — so cost-to-serve pressure is concentrated exactly where the bank's revenue is.", kind: "inference" },
      { text: "Early-bucket card collections is a permanent operating cost, currently executed through dialer teams and agencies whose contact rates and consistency are both hard to improve with more headcount.", kind: "inference" },
      { text: "CT Corp's operating culture across retail, media and financial services has consistently been to acquire and integrate technology rather than to build platform engineering capability.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Bank Mega's technology posture reflects CT Corp's conglomerate style — buy proven capability, integrate it, run it lean. There is no public evidence of internal speech, NLU or conversational-orchestration engineering, and card-servicing automation is a well-defined bought capability in this segment.",
    whyNotBuild:
      "A card-led mid-sized bank has neither the engineering headcount nor the strategic reason to build Bahasa speech, dialer-replacing telephony orchestration, policy-bounded negotiation logic for collections, or a conversation evaluation regime that would survive OJK debt-collection scrutiny. The last point matters most: collections conduct is the highest-regulatory-risk conversation the bank has, and the ability to prove every interaction was compliant is a bought capability, not a weekend project.",
    workflows: [
      {
        name: "Early-bucket card collections",
        friction: "Dialer bursts during work hours reach a fraction of delinquent cardholders, offers vary by whichever collector answers, promises to pay are noted in wrap-up with no automatic follow-up, and accounts roll into costlier buckets while waiting for the next cycle.",
        outcome: "Policy-timed multi-channel outreach in Bahasa within permitted contact windows, offers drawn only from the approved matrix, payment links delivered in-channel, and every promise recorded with automatic follow-up.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Card management system", "Collections system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card billing, promo and instalment servicing",
        friction: "Campaign launches across Transmart and the Trans ecosystem generate contact spikes about promo eligibility, instalment conversion and statement charges that overwhelm a fixed agent roster, and answers about promotional terms are inconsistent.",
        outcome: "Promotion terms answered from a single governed source, instalment conversion executed in-conversation within policy, and campaign spikes absorbed with elastic capacity instead of overtime.",
        channels: ["Voice", "WhatsApp", "M-Smile in-app chat"],
        systems: ["Card management system", "Promotion/campaign engine", "Core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Dispute and unrecognised-charge intake",
        friction: "Disputes are captured manually and status is invisible to the cardholder, producing repeat status calls per case and OJK-relevant resolution-timeline exposure when cases sit unattended.",
        outcome: "Structured dispute capture at first contact with the transaction pulled automatically, provisional-credit rules explained identically every time, and proactive status pushes that eliminate chase calls.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Card management system", "Dispute/chargeback case management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The M-Smile mobile app for card and account self-service",
        "A card-focused contact centre with IVR authentication",
        "Outbound dialer and agency-supported collections operations",
        "WhatsApp and in-app chat servicing with human agents",
      ],
      gaps: [
        "Cardholders cannot convert to instalments or dispute a charge end-to-end without a human",
        "Collections outreach reaches only the fraction of the base a dialer connects with during office hours",
        "Promotional-eligibility answers are inconsistent across agents and channels",
        "Collections conversations are sampled, not fully evaluated, leaving conduct risk unmeasured",
      ],
    },
    risks: [
      "OJK rules and Indonesian debt-collection conduct expectations restrict contact timing, frequency and language, and require demonstrable evidence of compliant conduct on every collections interaction.",
      "Indonesia's Personal Data Protection Law governs the use of customer contact data for outbound campaigns, requiring a lawful basis and honoured opt-outs.",
      "Bahasa voice quality must handle mass-market speech and regional accents in secondary cities where the Transmart footprint reaches, or contact-rate gains will not materialise.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions combining card servicing volume with outbound collections attempts; the split between inbound servicing and outbound attempts, and current agency costs, must be established in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on early-bucket card collections — policy-timed voice and WhatsApp outreach in Bahasa with in-channel payment links and recorded promises to pay — measured against dialer contact rates and roll-rate on a matched control portfolio.",
    expansion: [
      "Add inbound card servicing including instalment conversion and promo eligibility",
      "Extend to structured dispute intake with proactive status suppression of chase calls",
      "Open campaign-driven outbound across the CT Corp retail ecosystem under consent rules",
    ],
    stakeholders: [
      "Head of Credit Cards",
      "Head of Collections and Recovery",
      "Head of Contact Centre Operations",
      "Chief Information Officer",
      "Head of Compliance and Consumer Protection",
    ],
    discovery: [
      "Are early-bucket collections run in-house, through agencies, or both — and what does each channel cost per resolved account?",
      "What contact-window and frequency rules does the bank apply today, and how is compliance evidenced?",
      "How much contact volume does a major Transmart or Trans ecosystem campaign generate, and how is the roster flexed for it?",
      "Which card-system actions (instalment conversion, limit change, dispute creation) are API-callable versus agent-only today?",
    ],
    flowTemplate: "collections",
    scenario: "A Bank Mega cardholder two weeks past due gets a WhatsApp conversation in Bahasa at a permitted hour, accepts an approved instalment plan, and pays through a link without a collector ever dialling.",
  },

  "panin-bank": {
    operatingContext:
      "Panin Bank is one of Indonesia's larger long-established private banks, controlled by the Gunawan family with ANZ historically holding a substantial stake, and it operates a deliberately conservative, branch-led model across retail, SME and commercial banking. Its franchise is built on deposits, mortgages, and commercial lending to established business customers, with a network concentrated in Jakarta and Java's commercial centres. Digital investment has been comparatively restrained relative to peers, which means routine servicing — balances, statements, loan instalments, card issues, branch and rate queries — still lands on branch staff and a conventional contact centre rather than being absorbed by self-service. The customer base skews older and more relationship-driven than the app-native cohorts other banks chase.",
    strategicPressure: [
      { text: "A branch-led operating model with limited digital self-service means the bank carries a cost-to-serve structure that is increasingly out of line with digitally-led competitors in the same segments.", kind: "inference" },
      { text: "Indonesian banking consolidation and the rise of digital banks put steady pressure on mid-tier private banks to demonstrate a modernisation path, whether or not they lead on it.", kind: "inference" },
      { text: "An older, relationship-driven customer base is the ideal audience for voice-first automation — they will call regardless of what app exists, so the conversational channel is where modernisation actually reaches them.", kind: "inference" },
      { text: "Executive sponsorship, not technical feasibility, is the binding constraint; without a named sponsor with a cost or service mandate, this account will not move regardless of the business case quality.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Panin has no visible platform-engineering organisation and a conservative technology posture consistent with buying proven, low-risk capability. Its restrained digital investment history is itself the strongest evidence that anything conversational will arrive as a purchase.",
    whyNotBuild:
      "There is essentially no scenario in which Panin builds. It lacks a speech or ML team, an orchestration platform, and any appetite for the operating risk of running customer-facing AI it engineered itself. The relevant sales question is not build-versus-buy but urgency — establishing why the bank should act now rather than continuing to absorb servicing cost in branches.",
    workflows: [
      {
        name: "Voice IVR replacement for routine account servicing",
        friction: "Callers navigate a static DTMF menu that cannot answer anything, then queue for an agent to read a balance or confirm a transaction — the highest-cost possible way to deliver a lookup.",
        outcome: "Natural-language voice servicing in Bahasa that resolves balance, transaction, statement and card-status queries at hello, with agents reserved for complex and relationship work.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking", "Card management", "IVR/telephony platform", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Branch and rate query deflection",
        friction: "Branch staff spend a significant share of their day answering deposit-rate, branch-hour, document-requirement and product-eligibility questions in person and by phone, displacing sales and relationship work.",
        outcome: "Consistent, governed answers on rates, requirements and branch logistics delivered conversationally, releasing branch capacity for revenue-generating activity.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Product/rate master", "Branch information system", "CRM"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Mortgage and commercial loan servicing",
        friction: "Loan customers phone their branch officer for instalment amounts, outstanding balances and settlement quotes, and the answer depends on that individual being available and reading the loan system correctly.",
        outcome: "Live loan positions and settlement quotes delivered consistently in-conversation, with restructuring and commercial negotiation escalated to the relationship officer with context prepared.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan servicing system", "Core banking", "Document management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile and internet banking channel for basic retail transactions",
        "A conventional contact centre with a DTMF IVR",
        "A branch network functioning as the primary servicing channel",
        "Basic website FAQ and product information pages",
      ],
      gaps: [
        "The IVR cannot answer any question — it only routes to a queue",
        "No conversational channel exists that can execute a servicing action",
        "Loan servicing answers depend entirely on branch-officer availability",
        "Contact-centre interactions are largely unmeasured beyond handling-time metrics",
      ],
    },
    risks: [
      "OJK consumer-protection and complaint-handling rules apply to any automated interaction, requiring auditable records and defined escalation.",
      "Indonesia's Personal Data Protection Law requires a lawful basis and retention controls for voice recordings and transcripts, which a bank with limited data-governance maturity will need help operationalising.",
      "An older customer base means voice recognition must tolerate slower, less standard speech and regional accents, and human-escalation thresholds should be conservative from day one.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.0,
      automationRate: 0.45,
      basis: "Seller assumptions for a mid-tier branch-led bank with modest digital deflection; contact volume, branch query load and cost per contact all need measurement in discovery since the bank may not track them today.",
    },
    pilotScope:
      "A Launch-scope pilot replacing the DTMF IVR with natural-language voice servicing in Bahasa for balance, transaction, statement and card-status queries, integrated to core banking, measured on containment and average handling time.",
    expansion: [
      "Add WhatsApp as a second channel for branch, rate and document-requirement queries",
      "Extend to mortgage and loan servicing with settlement quotes delivered in-channel",
      "Introduce proactive outbound for instalment reminders and dormant-account reactivation",
    ],
    stakeholders: [
      "Director of Retail Banking",
      "Head of Operations",
      "Head of Information Technology",
      "Head of Branch Network",
      "Head of Compliance",
    ],
    discovery: [
      "Is there an executive sponsor with an explicit cost-to-serve or service-quality mandate, and what is their timeline?",
      "How many calls does the contact centre handle monthly, and what proportion abandon in the IVR today?",
      "How much branch-staff time goes to answering routine questions rather than sales and relationship work?",
      "What core-banking integration options exist, and has any API layer been built for the mobile channel that could be reused?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A long-standing Panin customer calls, says in Bahasa that she wants her deposit maturity date and rate, and gets both answers in twenty seconds instead of eight minutes on hold.",
  },

  "bank-bjb": {
    operatingContext:
      "Bank BJB is the regional development bank owned by the provincial governments of West Java and Banten, serving the single most populous catchment in Indonesia with roughly 60 million residents between them. Its balance sheet is anchored by consumer lending to civil servants — payroll-deduction loans to teachers, provincial staff and pensioners — alongside provincial-government deposits, retail savings and a growing sharia unit through BJB Syariah. Distribution is branch and payroll-office based, reaching deep into secondary cities and district towns where the bank is often the primary financial institution. Customers are frequently first-generation formal-banking users who default to visiting a branch or calling, speaking Bahasa Indonesia and Sundanese, and the servicing load is dominated by loan instalment, payroll-deduction and disbursement questions rather than digital transactions.",
    strategicPressure: [
      { text: "As a regional development bank owned by provincial governments, Bank BJB procures technology through public-sector-influenced processes and budget cycles tied to regional government planning.", kind: "verified" },
      { text: "The payroll-deduction loan book concentrates credit and servicing risk in a single customer type, generating a predictable monthly cycle of deduction, balance and settlement questions that scales with the book, not with digital adoption.", kind: "verified" },
      { text: "West Java and Banten's rural and district populations have limited smartphone-banking fluency, so a mobile app cannot be the modernisation answer — voice in Bahasa and Sundanese is the only channel that reaches the actual base.", kind: "inference" },
      { text: "Regional development banks across Indonesia face consolidation and capital pressure, which raises the value of demonstrable operating-cost discipline to provincial owners and the regulator alike.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Bank BJB's technology function delivers core banking and channels under provincially-influenced governance and budget cycles. Regional development banks have no platform-engineering tradition, and everything customer-facing arrives through procurement.",
    whyNotBuild:
      "Building would require Sundanese and Bahasa speech capability that does not exist off the shelf for the bank to assemble, telephony engineering, orchestration into a core banking and payroll-deduction estate, and an evaluation framework for collections conduct — all under a public-sector budget process that funds projects, not multi-year engineering capability. The right-to-win is that regional-language voice quality is precisely the hardest part and precisely what the platform provides.",
    workflows: [
      {
        name: "Payroll-loan servicing and deduction queries",
        friction: "Civil-servant borrowers ask every month why their deduction changed, what their remaining balance is, and what an early settlement would cost — questions answered today by branch queues and payroll-office visits in district towns.",
        outcome: "Live loan position, deduction explanation and settlement quotes delivered by voice in Bahasa or Sundanese, with the branch visit eliminated for the majority of these interactions.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan servicing system", "Payroll deduction interface", "Core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Collections and arrears outreach",
        friction: "When payroll deduction fails — job change, retirement, transfer — accounts fall into arrears and are chased by branch staff and field collectors whose reach and consistency are limited and whose conduct is hard to evidence.",
        outcome: "Policy-timed outreach in the borrower's language within permitted windows, offers drawn from an approved matrix, payment links delivered in-channel, and every interaction recorded and evaluated for conduct.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Collections system", "Loan servicing system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Retail account and disbursement servicing",
        friction: "Savings customers and programme beneficiaries call or visit branches to check whether funds arrived, why a card is blocked, or what documents a product needs, with branch queues in district towns absorbing the load.",
        outcome: "Routine account and disbursement status answered conversationally in regional languages, with card and access actions executed in-policy and branch capacity released for lending work.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking", "Card management", "Disbursement/programme systems", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile and internet banking channel for retail customers",
        "A contact centre with a conventional IVR",
        "A large branch and payroll-office network across West Java and Banten",
        "SMS notification for transactions and disbursements",
      ],
      gaps: [
        "No servicing channel operates in Sundanese, the first language of much of the customer base",
        "Loan and deduction questions cannot be answered without a branch visit or a queue",
        "Arrears outreach reaches only what field collectors and branch staff can physically cover",
        "Collections conduct is not systematically recorded or evaluated, leaving conduct risk unevidenced",
      ],
    },
    risks: [
      "OJK debt-collection conduct expectations and Indonesian rules on contact timing and pressure apply directly to payroll-loan arrears outreach, requiring evidenced compliance on every interaction.",
      "Indonesia's Personal Data Protection Law governs the processing of civil-servant payroll and loan data, and regional-government ownership may add data-residency and access requirements.",
      "Sundanese voice recognition and synthesis quality is the single largest technical risk and must be validated with real district-town speakers before any deployment commitment.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.75,
      automationRate: 0.5,
      basis: "Seller assumptions reflecting a large but low-cost regional servicing base with heavy branch substitution; contact volume, branch footfall and collections cost require measurement in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on payroll-loan servicing and early-arrears outreach by voice and WhatsApp in Bahasa Indonesia and Sundanese, integrated to the loan servicing system and payment gateway, measured on branch-visit deflection and arrears cure rate.",
    expansion: [
      "Extend to retail account and disbursement servicing across the branch catchment",
      "Add BJB Syariah product journeys with sharia-reviewed response governance",
      "Introduce proactive outbound for instalment reminders and deduction-change notifications",
    ],
    stakeholders: [
      "Director of Consumer Banking",
      "Head of Collections and Recovery",
      "Head of Information Technology",
      "Head of Branch Network Operations",
      "Head of Compliance and Risk",
    ],
    discovery: [
      "How does the provincial-government budget and procurement cycle work for a platform of this type, and when does the next window open?",
      "What share of branch footfall is loan servicing and deduction queries rather than transactions?",
      "How are arrears currently worked — branch staff, field collectors, agencies — and what does each cost per cured account?",
      "Has the bank ever tested Sundanese-language voice technology, and who internally would judge quality acceptable?",
    ],
    flowTemplate: "collections",
    scenario: "A teacher in Garut whose payroll deduction failed after a transfer gets a Sundanese-language call, understands what happened, and settles the arrear through a link the same day.",
  },

  "bank-jago": {
    operatingContext:
      "Bank Jago is a digital-native Indonesian bank built around an app-first, no-branch model and distinguished by deep distribution partnerships inside the GoTo ecosystem, where accounts are opened and funded directly from Gojek and related surfaces. Its product design centres on Kantong (pockets) for goal-based saving, joint accounts, and embedded lending, with a sharia proposition alongside. The bank runs deliberately lean: a small engineering-led organisation, no branch estate, and an operating model that assumes the app absorbs almost all customer interaction. Its customers are young, urban, smartphone-native Indonesians who reach the bank through in-app chat and email rather than voice, which means support volume scales with product complexity and partner-channel growth rather than with branch footfall.",
    strategicPressure: [
      { text: "Bank Jago's distribution is materially dependent on GoTo ecosystem integration, which drives customer acquisition faster than a lean operations team can scale support alongside it.", kind: "verified" },
      { text: "A no-branch model means every unresolved question becomes an in-app support ticket — there is no physical fallback absorbing complexity, so support load is a direct function of product surface area.", kind: "inference" },
      { text: "Embedded lending and joint-account features generate disproportionately complex support conversations relative to plain savings, and those are exactly the products the bank is growing.", kind: "inference" },
      { text: "The engineering team has almost certainly experimented with LLM-based support tooling already, so the sale is about production-grade grounding, evaluation and voice identity — not about introducing the concept.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. Bank Jago is engineering-led by design and will not procure a packaged CX suite that constrains its product surface. It will, however, consume infrastructure: models, grounding, evaluation tooling and voice identity primitives on Google Cloud, integrated into support flows its own team owns. The correct motion is selling selected capabilities and the platform beneath them, not a whole-stack solution.",
    whyNotBuild:
      "Jago will build the support experience; it will not build the layers underneath. Production speech in Bahasa, voice-based identity verification, systematic evaluation of every conversation for regulatory defensibility, and telephony for the escalation path are all disproportionate investments for a bank whose engineering thesis is product velocity. The right-to-win is being the substrate its team builds on rather than a vendor that owns the customer conversation.",
    workflows: [
      {
        name: "In-app transaction and account query automation",
        friction: "In-app support queues absorb a steady flow of transaction-status, failed-transfer, Kantong-mechanics and account-limit questions that a small ops team handles individually, with resolution time degrading as acquisition accelerates.",
        outcome: "Grounded automated resolution inside the app with live account context, freeing the ops team for genuinely novel issues and holding response times flat as the base grows.",
        channels: ["In-app chat", "Email"],
        systems: ["Core banking platform", "Transaction ledger", "Support ticketing", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Dispute and failed-transaction handling",
        friction: "Failed or disputed transactions across partner ecosystem rails require the ops team to reconcile across systems manually, and the customer has no visibility while it happens.",
        outcome: "Automated reconciliation-aware responses that explain exactly where a transaction stands, capture structured disputes, and push status changes without the customer asking.",
        channels: ["In-app chat", "Push notification", "Email"],
        systems: ["Transaction ledger", "Partner payment rails", "Dispute case management", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Voice-channel escalation and identity verification",
        friction: "When an in-app path fails — locked account, suspected fraud, device loss — the customer has no reliable voice route, and identity re-verification for a no-branch bank is genuinely hard.",
        outcome: "A voice escalation path with conversational identity verification that resolves lockouts and fraud reports securely without inventing a branch network.",
        channels: ["Voice", "In-app chat"],
        systems: ["Authentication service", "Fraud monitoring", "Core banking platform", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "An app-first banking experience with in-app chat support",
        "Deep account-opening and funding integration with the GoTo ecosystem",
        "Digital onboarding with electronic KYC and no branch dependency",
        "Push-notification-based transaction alerting",
      ],
      gaps: [
        "No credible voice channel for lockouts, fraud reports or device loss",
        "In-app support answers but frequently cannot resolve cross-rail transaction issues without manual reconciliation",
        "Support quality is not systematically evaluated across every conversation",
        "Customers cannot get a dispute status without asking for it",
      ],
    },
    risks: [
      "OJK digital-bank supervision emphasises operational resilience and consumer protection, so automated resolution paths must be auditable and reversible.",
      "Indonesia's Personal Data Protection Law applies to any voice biometric or transcript processing, and voice-based identity verification carries specific consent and security obligations.",
      "As a co-build, technical dependency on the customer's own engineering roadmap means delivery timelines are outside seller control — scope must be bounded to primitives.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions for a digital-only bank with app-concentrated support; actual ticket volume, cost per ticket and current automation coverage must come from the ops team in discovery.",
    },
    pilotScope:
      "A Launch-scope co-build pilot supplying grounded automated resolution for in-app transaction and account queries, with the bank's engineering team owning the front-end integration and the platform providing grounding, orchestration and per-conversation evaluation.",
    expansion: [
      "Add dispute and failed-transaction handling with proactive status pushes",
      "Introduce a voice escalation path with conversational identity verification for lockout and fraud cases",
      "Extend automated support into partner-ecosystem surfaces where accounts are opened",
    ],
    stakeholders: [
      "Chief Technology Officer",
      "Head of Product",
      "Head of Customer Operations",
      "Head of Risk and Compliance",
      "Head of Data / Machine Learning",
    ],
    discovery: [
      "What LLM-based support tooling has the engineering team already built or prototyped, and what did they find hardest?",
      "What is the current ticket volume per thousand active customers, and how is it trending against acquisition?",
      "How are locked-out or device-lost customers recovered today without a branch or reliable voice channel?",
      "Which capabilities would the team want to own outright versus consume as managed infrastructure?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Bank Jago user whose transfer to a merchant failed gets an in-app explanation of exactly where the money is and when it returns, with no ops agent involved.",
  },

  "adira-finance": {
    operatingContext:
      "Adira Finance is one of Indonesia's largest multifinance companies, financing motorcycles, cars and consumer durables through a nationwide dealer network, and sits within the Danamon/MUFG group. Its business model is volume lending at the point of sale: contracts are originated at dealerships across the archipelago, then serviced over two to four years through instalment collection. Its operating cost is dominated by that servicing tail — installment reminders, promise-to-pay follow-ups, early-bucket collections and field visits across millions of active contracts, many of them to customers in secondary cities and rural districts whose only reliable channel is a mobile phone. Adira runs branch offices, a call centre, a mobile app for customers, and a large field collections force, with communications happening in Bahasa Indonesia and regional languages, predominantly by voice and SMS.",
    strategicPressure: [
      { text: "Multifinance economics in motorcycle and used-car lending depend directly on collections efficiency and roll rates, so contact coverage is not a service metric — it is a credit-cost driver.", kind: "verified" },
      { text: "Adira's collections are executed today through dialer teams and field collectors whose reach is capacity-limited, meaning a large share of the delinquent book is never contacted in the window when cure is cheapest.", kind: "inference" },
      { text: "OJK has tightened expectations on debt-collection conduct in Indonesian consumer finance, raising the operational and reputational cost of field-collector behaviour that cannot be evidenced.", kind: "verified" },
      { text: "Dealer-sourced origination means Adira rarely owns a digital relationship with the customer at contract start, so the reminder and collection conversation is often the only ongoing touchpoint it has.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Adira is an origination-and-collections operations company, not a technology company. Its systems investment goes into contract management, credit scoring and dealer integration. There is no evidence of speech or conversational-orchestration engineering, and MUFG-group governance reinforces vendor procurement for customer-facing AI.",
    whyNotBuild:
      "Adira's competitive advantage is dealer relationships and credit underwriting, neither of which improves by owning speech infrastructure. Building would mean Bahasa and regional-language voice engineering, telephony at dialer scale, policy-bounded negotiation logic constrained by an approved offer matrix, and evaluation of every collections conversation for OJK conduct defensibility — four specialist capabilities with no return beyond what a platform already provides, and with regulatory downside if built badly.",
    workflows: [
      {
        name: "Policy-timed instalment reminder and pre-due outreach",
        friction: "Reminders go out as generic SMS blasts that customers ignore, and the first real conversation happens only after the account is already delinquent and more expensive to cure.",
        outcome: "Two-way conversational reminders in the customer's language before the due date, with the payment link in-channel, converting a broadcast into a completed payment.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Contract management system", "Payment gateway", "Collections system", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Early-bucket collections with recorded promises to pay",
        friction: "Dialer bursts reach a fraction of the delinquent book during work hours, offers depend on which collector answers, and promises to pay are noted in wrap-up with no automatic follow-up before the account rolls forward.",
        outcome: "Full attempted coverage of the early-bucket population within permitted contact windows, offers bounded by the approved matrix, promises recorded with automatic follow-up, and 100% of conversations evidenced for conduct review.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Collections system", "Contract management system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Contract servicing and settlement quotes",
        friction: "Customers asking for remaining balance, early-settlement quotes, insurance or document status must call a branch or the contact centre, and inconsistent answers on settlement figures create disputes.",
        outcome: "Live contract position and settlement quotes delivered conversationally and identically every time, with documentation handled in-channel and field or branch visits avoided.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Contract management system", "Insurance/asset registry", "Document management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer mobile app for contract information and payments",
        "A contact centre with IVR and outbound dialer operations",
        "A nationwide branch and field-collections network",
        "SMS-based instalment reminders",
      ],
      gaps: [
        "Reminders are one-way broadcasts — the customer cannot reply, negotiate or pay in the same thread",
        "Only a fraction of the delinquent book is contacted before it rolls to costlier buckets",
        "Field-collector conduct is not systematically recorded or evaluable against OJK expectations",
        "Settlement quotes and contract answers vary by who answers, generating disputes",
      ],
    },
    risks: [
      "OJK rules and Indonesian debt-collection conduct expectations govern contact hours, frequency, language and third-party involvement, and demand evidence of compliant conduct on every interaction.",
      "Indonesia's Personal Data Protection Law requires a lawful basis for outbound contact using customer data, honoured opt-outs, and controlled retention of voice recordings.",
      "Voice quality across Bahasa plus Javanese and Sundanese-accented speech in secondary cities is decisive — contact-rate gains disappear if customers cannot be understood or understand the agent.",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 0.6,
      automationRate: 0.65,
      basis: "Seller assumptions reflecting very high outbound attempt volume across a large active-contract base at low per-attempt cost; actual attempt volume, connect rates and per-cure cost must be validated against Adira's collections MIS.",
    },
    pilotScope:
      "A Scale-scope pilot on policy-timed pre-due reminders and early-bucket collections in Bahasa by voice and WhatsApp, with in-channel payment links and recorded promises to pay, measured against dialer contact rates and roll rates on a matched control portfolio.",
    expansion: [
      "Extend to contract servicing, settlement quotes and document handling to displace branch and call-centre volume",
      "Add regional-language coverage for Javanese and Sundanese collection populations",
      "Open a shared conversational layer with Bank Danamon so group customers get one servicing front door",
    ],
    stakeholders: [
      "Director of Collections and Recovery",
      "Head of Customer Care / Contact Centre",
      "Head of Credit Risk",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What share of the early-bucket delinquent population is actually contacted within the first seven days, and what does the dialer connect rate look like?",
      "What are the approved offer and restructuring parameters a collections agent may apply without human approval?",
      "How is collections conduct evidenced today, and what would OJK expect to see for an automated channel?",
      "What does a field-collector visit cost per account, and how many could a conversational channel displace?",
    ],
    flowTemplate: "collections",
    scenario: "An Adira motorcycle borrower in Bekasi gets a Bahasa voice call three days before his due date, agrees a payment date, and pays through a WhatsApp link before the account ever goes delinquent.",
  },

  "bfi-finance": {
    operatingContext:
      "BFI Finance is Indonesia's largest independent multifinance company, lending against vehicle and property collateral through a branch network spanning more than two hundred locations nationwide, without the captive dealer relationship that anchors bank-owned finance companies. Its customers are small business owners, traders and salaried individuals who pledge a motorcycle, car or property certificate for working capital — a segment that shops actively on speed and terms, which makes response time to an inbound enquiry commercially decisive. Origination comes from branch walk-ins, agents, referral partners and increasingly digital leads, all of which are worked by tele-teams and branch staff during office hours. Servicing and collections then run across the same branch footprint by voice, SMS and field visits in Bahasa Indonesia and regional languages.",
    strategicPressure: [
      { text: "As an independent multifinance company without captive dealer flow, BFI competes for every loan on speed and terms, so the interval between enquiry and first meaningful contact directly determines conversion.", kind: "verified" },
      { text: "A collateral-lending book concentrated in small-business and salaried borrowers produces a permanent collections workload whose efficiency sets the company's cost of risk.", kind: "inference" },
      { text: "Digital lead generation has grown across Indonesian lending while lead handling has stayed manual and office-hours-bound, meaning a measurable share of paid-acquisition spend is wasted on leads that go cold overnight.", kind: "inference" },
      { text: "BFI's mid-cap scale means a packaged platform with fast payback is far more fundable than a multi-year internal programme, and the speed-to-lead case is the easiest one to prove in a pilot.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. BFI's technology investment goes into credit scoring, contract systems and branch operations. It has no platform-engineering organisation and no realistic path to building conversational infrastructure, and a mid-cap independent lender is exactly the profile that buys packaged capability with a demonstrable payback period.",
    whyNotBuild:
      "The company's advantage is underwriting collateral and running a branch network efficiently, neither of which is improved by owning speech or orchestration technology. Bahasa and regional-language voice, telephony, policy-bounded qualification and negotiation logic, and conduct-grade evaluation of collections conversations are four separate specialist builds — a distraction for an organisation whose scarce management attention should be on credit quality and branch productivity.",
    workflows: [
      {
        name: "Speed-to-lead qualification for collateral loans",
        friction: "A digital enquiry submitted in the evening waits until the next working day for a tele-caller, who tries twice and marks the lead unresponsive; the borrower has already been contacted by a competitor.",
        outcome: "Conversational engagement within minutes in the borrower's language and channel, structured qualification against the credit rubric, and a branch appointment booked before the lead cools.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Lead management/CRM", "Loan origination system", "Credit scoring engine", "Branch appointment calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Document chase and application completion",
        friction: "Applications stall waiting for collateral documents, income proof or photographs, and nobody systematically chases them — the application simply ages out and the acquisition cost is written off.",
        outcome: "Automated, guided document collection in-channel with format validation, so incomplete applications are recovered rather than abandoned and approval cycle time shortens.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Loan origination system", "Document management", "Credit scoring engine", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Instalment reminders and early-bucket collections",
        friction: "Reminders are broadcast SMS; delinquency is worked by branch staff and field collectors whose coverage is limited by geography and headcount, and whose conduct is not evidenced.",
        outcome: "Two-way policy-timed outreach with in-channel payment, promises recorded and followed up automatically, and every conversation evaluated for conduct compliance.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Collections system", "Contract management system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer mobile app and website for contract information and payments",
        "A tele-sales and tele-collections operation working lead and delinquency lists",
        "A nationwide branch network handling origination and servicing",
        "SMS-based instalment reminders and campaign messaging",
      ],
      gaps: [
        "Leads arriving outside office hours receive no response until the next working day",
        "Incomplete applications are not systematically chased to completion",
        "Reminder messages are one-way — the borrower cannot ask a question or pay in the same thread",
        "Field and tele-collections conduct is not recorded or evaluated at scale",
      ],
    },
    risks: [
      "OJK conduct rules for multifinance debt collection restrict contact windows, frequency and pressure tactics, and require evidence of compliant conduct on every interaction.",
      "Indonesia's Personal Data Protection Law requires a lawful basis for outbound contact and constrains the use of lead data acquired through third-party channels.",
      "Regional-accent Bahasa voice quality across secondary-city and rural branch catchments must be validated, or both the lead and collections cases will underperform their projections.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.7,
      automationRate: 0.6,
      basis: "Seller assumptions combining lead-handling attempts with reminder and collections outreach across the active book; lead volume, current speed-to-contact and collections cost per cure must be measured in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on speed-to-lead qualification for collateral loan enquiries over WhatsApp and voice in Bahasa, integrated to lead management and the origination system, measured on time-to-first-contact, qualified-lead rate and branch appointment conversion.",
    expansion: [
      "Add document chase and application-completion recovery on the same channel",
      "Extend to instalment reminders and early-bucket collections with in-channel payment",
      "Add regional-language coverage across the secondary-city branch network",
    ],
    stakeholders: [
      "Director of Sales and Distribution",
      "Head of Collections and Recovery",
      "Head of Digital Business / Lead Generation",
      "Chief Information Officer",
      "Head of Compliance and Risk",
    ],
    discovery: [
      "What is the current split of origination between branch walk-in, agent referral and digital leads, and how fast is each contacted?",
      "What proportion of started applications never complete because of missing documents?",
      "What are the approved qualification criteria a conversational agent could apply before booking a branch appointment?",
      "How is collections conduct monitored today, and what would need to change for an automated channel to satisfy OJK scrutiny?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A trader in Tangerang enquires about a loan against his car at 9pm, is qualified on WhatsApp in Bahasa within four minutes, and walks into the branch the next morning with the right documents.",
  },

  "mandiri-tunas-finance": {
    operatingContext:
      "Mandiri Tunas Finance is the car-financing joint venture of Bank Mandiri and the Tunas Ridean automotive group, originating consumer and commercial vehicle loans through dealer showrooms rather than its own branded acquisition channels. Its book is dominated by new and used car financing for salaried and small-business buyers, sourced across dealer partners nationwide and concentrated in Java's major urban markets. Because origination sits with dealers, the company's direct customer relationship effectively begins at contract activation and consists almost entirely of servicing and collections: instalment reminders, balance and settlement queries, insurance and vehicle-document questions, and delinquency management across a multi-year contract life. Communications run through a call centre, SMS, a customer app and field collectors, in Bahasa Indonesia.",
    strategicPressure: [
      { text: "As a captive finance joint venture between Bank Mandiri and Tunas Ridean, technology standards and vendor selection are influenced by parent governance rather than decided independently.", kind: "verified" },
      { text: "Dealer-sourced origination means the company has little brand-level digital relationship with borrowers, so the reminder and collection conversation is effectively the entire customer experience.", kind: "inference" },
      { text: "Car financing has longer tenors and higher ticket sizes than motorcycle lending, so each avoided roll or repossession is worth materially more, strengthening the collections business case per contact.", kind: "inference" },
      { text: "Vehicle-document servicing — BPKB status, insurance renewal, transfer of ownership — is an underrated contact driver that generates repeat calls and is fully automatable from systems of record.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A captive finance subsidiary of this scale runs contract-management and collections systems, not platform engineering. Its parents impose procurement discipline and vendor-risk standards, which points decisively to buying a proven platform rather than funding an internal build.",
    whyNotBuild:
      "There is no engineering organisation to build with and no strategic reason to create one — the company's value comes from dealer relationships and credit discipline. Bahasa voice, telephony at outbound scale, offer-matrix-bounded negotiation, and conduct-grade evaluation for OJK scrutiny are all outside its perimeter, and any in-house attempt would inherit compliance risk that its bank parent's audit function would not tolerate.",
    workflows: [
      {
        name: "Instalment reminder and pre-due engagement",
        friction: "Reminders are one-way SMS that borrowers ignore, and the first real conversation happens after the account is delinquent — the most expensive possible moment to start talking.",
        outcome: "Conversational pre-due reminders in Bahasa with the payment link in-channel and the option to reschedule within policy, converting notification into completed payment.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Contract management system", "Payment gateway", "Collections system", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Early-delinquency outreach with policy-bounded arrangements",
        friction: "Delinquent accounts are worked by dialer and field collectors whose coverage is limited, whose offers are improvised, and whose conduct cannot be evidenced if a borrower complains.",
        outcome: "Full attempted coverage within permitted windows, arrangements offered only from the approved matrix, promises recorded with automatic follow-up, and every conversation available for conduct review.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Collections system", "Contract management system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Vehicle-document and insurance servicing",
        friction: "Borrowers call repeatedly about BPKB ownership-document status, insurance renewal and claim coordination, and each answer requires an agent to check a separate system, generating chase calls when nothing has changed.",
        outcome: "Document and insurance status answered instantly from systems of record, with renewal reminders and collection appointments handled conversationally, removing an entire category of repeat calls.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Document/BPKB tracking system", "Insurance partner integration", "Contract management system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and website for contract details and payment",
        "A call centre with IVR handling servicing and outbound collections",
        "SMS instalment reminders across the active book",
        "A field-collections operation for later-bucket accounts",
      ],
      gaps: [
        "Borrowers cannot negotiate a payment date or pay inside the reminder thread",
        "BPKB and insurance status requires a human lookup, driving repeat calls",
        "A large share of the early-delinquent book is never contacted before it rolls",
        "Collections conduct is unevidenced beyond sampled call recordings",
      ],
    },
    risks: [
      "OJK multifinance conduct rules restrict collection contact timing, frequency and third-party involvement, and require demonstrable compliance for every interaction.",
      "Indonesia's Personal Data Protection Law governs outbound contact using borrower data and the retention of voice recordings and transcripts.",
      "Bank Mandiri group vendor-risk standards will apply to any platform selection, extending diligence beyond a standalone multifinance procurement.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.7,
      automationRate: 0.6,
      basis: "Seller assumptions based on reminder and collections attempt volume across an active car-finance book; validate attempt counts, connect rates and cost per cured account against the company's collections reporting.",
    },
    pilotScope:
      "A Launch-scope pilot on pre-due instalment reminders and early-delinquency outreach in Bahasa by voice and WhatsApp with in-channel payment, measured on payment-before-due-date rate and first-bucket roll rate against a control portfolio.",
    expansion: [
      "Add vehicle-document and insurance servicing to remove repeat status calls",
      "Extend to inbound contract servicing and settlement quotes",
      "Align the deployment with Bank Mandiri group standards for reuse across affiliated finance entities",
    ],
    stakeholders: [
      "Director of Operations",
      "Head of Collections",
      "Head of Customer Service",
      "Head of Information Technology",
      "Head of Compliance",
    ],
    discovery: [
      "Do Bank Mandiri's technology standards dictate the vendor shortlist, and who signs off on a customer-facing AI platform?",
      "What proportion of instalments are paid before the due date today, and what does a delinquent account cost to cure?",
      "How many monthly contacts relate to BPKB, insurance or document status rather than payment?",
      "What arrangement and restructuring options may a collector offer without escalation?",
    ],
    flowTemplate: "collections",
    scenario: "A Mandiri Tunas Finance borrower in Depok gets a Bahasa voice reminder two days before his car instalment falls due, reschedules to payday within policy, and pays via a link the same week.",
  },

  "home-credit-indonesia": {
    operatingContext:
      "Home Credit Indonesia is a point-of-sale consumer financier that approves instalment loans for phones, electronics and household goods inside retail stores in minutes, using in-store agents and its own scoring rather than bank branch relationships. Its customer base skews toward younger, thinner-file, mass-market borrowers who often have no prior formal credit history — a population that requires verification at origination and produces high-frequency collections activity across short-tenor contracts. The company has moved to broaden into a wider consumer-finance app with cards and cash loans, and now sits under new ownership following the sale of the Home Credit group's Asian businesses to an MUFG-led consortium. Communications are voice-and-messaging heavy in Bahasa Indonesia, running through call centres, dialers, an app and field agents.",
    strategicPressure: [
      { text: "Home Credit's Asian operations changed ownership in a transaction involving an MUFG-led consortium, which reframes technology governance around a Japanese banking group's vendor and risk standards.", kind: "verified" },
      { text: "Point-of-sale lending to thin-file borrowers generates verification calls at origination and short-cycle collections afterwards, making the company one of the most contact-intensive lenders per unit of book in the market.", kind: "verified" },
      { text: "Short-tenor, small-ticket contracts mean each collection conversation must be extremely cheap to be economic — human dialer collections on a small consumer-durables loan barely pays for itself.", kind: "inference" },
      { text: "How much of the legacy group technology stack survived the ownership transition determines whether this is a replacement sale or an addition to an existing platform, and is the first thing to establish.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Whatever engineering the legacy Home Credit group operated centrally, the Indonesian entity under new consortium ownership will procure customer-facing AI under group vendor frameworks rather than rebuilding platform capability locally. Ownership transitions characteristically favour buying proven capability over funding new internal programmes.",
    whyNotBuild:
      "A consumer financier in the middle of an ownership transition has neither the stability nor the engineering headcount to build Bahasa speech, telephony orchestration at dialer scale, policy-bounded collections negotiation, and per-conversation conduct evaluation. Its scarce technical capacity is committed to disentangling from legacy group systems. The right-to-win is delivering all four immediately with a vendor accountable to both OJK and the new owners' risk standards.",
    workflows: [
      {
        name: "Origination verification calls",
        friction: "Every approved point-of-sale application triggers verification calls to the applicant and references, executed by human agents on a script during working hours, delaying disbursement and losing applicants who cannot be reached.",
        outcome: "Automated, consistent verification conversations completed within minutes of approval at any hour, with structured outcomes written back and exceptions routed to human verifiers.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan origination system", "Credit scoring engine", "Fraud/verification workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Early-bucket collections on short-tenor contracts",
        friction: "Small-ticket, short-tenor loans make human dialer collections barely economic, so coverage is rationed and accounts that could have been cured with a single conversation roll forward.",
        outcome: "Full attempted coverage at a cost per attempt low enough to make early contact economic on every account, with payment links in-channel and promises recorded and followed up.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Collections system", "Contract management system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Product, eligibility and application-status queries",
        friction: "Prospective and existing customers ask about eligibility, remaining balance, next due date and application status through the app and call centre, consuming agent time on questions that are pure lookups.",
        outcome: "Instant grounded answers on eligibility and account position in Bahasa, with application status pushed proactively so status-chasing contacts disappear.",
        channels: ["Voice", "WhatsApp", "In-app chat"],
        systems: ["Loan origination system", "Contract management system", "Product/eligibility rules", "CRM"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A consumer app for contract management, payment and product applications",
        "In-store point-of-sale agents originating loans directly at retail counters",
        "A call centre with outbound dialer capability for verification and collections",
        "SMS reminders and campaign messaging to the active book",
      ],
      gaps: [
        "Verification calls only happen during staffed hours, delaying disbursement",
        "Collections coverage is rationed because human contact cost is high relative to ticket size",
        "Application-status information is pull-only — customers must call to find out",
        "Collections and verification conversations are sampled rather than fully evaluated",
      ],
    },
    risks: [
      "OJK conduct rules for consumer-finance collections restrict contact timing and pressure and require evidence of compliant conduct, with heightened scrutiny for mass-market borrowers.",
      "Indonesia's Personal Data Protection Law governs the processing of applicant and reference contact data used in verification calls, which requires a clear lawful basis.",
      "Ownership-transition uncertainty may mean legacy group platforms remain contractually in place; scope must be defined against whatever actually survives.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.6,
      automationRate: 0.65,
      basis: "Seller assumptions combining origination verification calls with high-frequency short-tenor collections attempts; volumes and per-contact cost require validation against the company's operations reporting.",
    },
    pilotScope:
      "A Launch-scope pilot automating origination verification calls in Bahasa by voice and WhatsApp, integrated to the origination system, measured on time-from-approval-to-verified and verification completion rate.",
    expansion: [
      "Extend to early-bucket collections with in-channel payment on short-tenor contracts",
      "Add inbound product, eligibility and application-status servicing to deflect call-centre volume",
      "Introduce proactive application-status pushes to remove status-chasing contacts entirely",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Collections",
      "Head of Risk / Underwriting Operations",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "Which parts of the legacy Home Credit group technology stack remain in place after the ownership change, and what is contracted forward?",
      "How many verification calls are made per thousand approvals, and what is the current completion rate and elapsed time?",
      "At what ticket size does human collections contact stop being economic today?",
      "What conduct evidence does the compliance function need to approve an automated collections channel?",
    ],
    flowTemplate: "collections",
    scenario: "A Home Credit customer who financed a phone in a Bekasi electronics store completes verification by voice in Bahasa twenty minutes after approval, on a Sunday evening.",
  },

  "prudential-indonesia": {
    operatingContext:
      "Prudential Indonesia is among the country's largest life insurers, distributing predominantly through a very large tied-agency force alongside bancassurance partnerships, and it operates a separately licensed sharia entity to serve Indonesia's substantial Islamic-insurance demand. Its product mix leans toward unit-linked and health-rider protection sold face-to-face by agents, which means the customer's primary relationship is with an individual agent rather than the company — until the agent leaves, at which point orphaned policyholders fall back on the contact centre. Servicing load is dominated by premium payment and lapse questions, policy changes, health-claim submission and status chasing, and regulator-driven welcome and verification calls. Communications are overwhelmingly Bahasa Indonesia across voice, WhatsApp, the customer portal and app.",
    strategicPressure: [
      { text: "Prudential plc runs its Asian life businesses with regional technology and digital standards, so the Indonesian unit's conversational-AI path likely runs through group-selected platforms and governance.", kind: "verified" },
      { text: "Indonesian regulators have tightened conduct and disclosure expectations around unit-linked products, increasing the importance of documented, consistent, auditable customer communications at sale and servicing.", kind: "verified" },
      { text: "An agency-led distribution model produces a large orphan-policy population whose servicing falls entirely on the contact centre, and whose persistency suffers without a systematic conversational touchpoint.", kind: "inference" },
      { text: "Health-rider claims generate far higher servicing frequency than pure life policies, so claims status and document chase are probably the largest single contact category rather than sales support.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. As a country unit of a global insurer with regional platform standards, Prudential Indonesia adopts group-selected technology. Its local technology organisation is a delivery and integration function; there is no evidence of local speech or conversational-orchestration engineering.",
    whyNotBuild:
      "Group governance makes a locally-built customer-facing AI stack effectively unapprovable, and the technical requirements compound the point: Bahasa speech that handles claims distress, telephony integration, deterministic execution against policy administration systems, and evaluation robust enough to defend conduct on unit-linked and claims conversations under OJK scrutiny. Insurers procure this class of infrastructure with a vendor carrying accountability, because the conduct exposure of getting it wrong is existential.",
    workflows: [
      {
        name: "Claims FNOL intake and document collection",
        friction: "A claimant must call during working hours, describe the event to an agent, then email documents that bounce on format or completeness, learning of rejections days later — at the worst possible moment in the customer relationship.",
        outcome: "Structured claim intake at any hour in Bahasa with documents captured and validated in-conversation, coverage checked against the policy, and the case opened complete rather than incomplete.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Policy administration system", "Claims management system", "Document management", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Proactive claims-status communication",
        friction: "Claimants call weekly to ask where their claim stands, and an agent reads them the same status — status chasing is a dominant driver of inbound volume and of dissatisfaction.",
        outcome: "Every stage change pushed proactively to the claimant with an explanation of what happens next, suppressing chase calls and converting a black box into a visible process.",
        channels: ["WhatsApp", "SMS", "App push"],
        systems: ["Claims management system", "Notification platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Premium-lapse prevention and orphan-policy servicing",
        friction: "Policyholders whose agent has left receive no personal follow-up, miss premiums, and lapse silently; a generic SMS reminder is the only intervention and it does not convert.",
        outcome: "Two-way conversational reminders in Bahasa with payment in-channel, reasons for non-payment captured, and genuine hardship or surrender intent routed to a retention specialist with context.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Persistency/retention workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy information and premium payment",
        "A contact centre with IVR and human agents handling policy and claims queries",
        "A very large tied-agency force acting as the primary servicing relationship",
        "WhatsApp and chat-based servicing channels with human agents behind them",
      ],
      gaps: [
        "Claims cannot be filed end-to-end conversationally — documents still bounce between email and portal",
        "Claim status is pull-only, generating repeated chase calls per claim",
        "Orphaned policyholders have no systematic conversational relationship after their agent leaves",
        "Only sampled conversations are evaluated, so conduct risk on unit-linked discussions is unmeasured",
      ],
    },
    risks: [
      "OJK conduct and disclosure rules for unit-linked and health products require documented, consistent explanations and clear boundaries on what an automated agent may say about product suitability.",
      "Indonesia's Personal Data Protection Law plus health-data sensitivity constrain how claim documents, medical information and transcripts may be processed and retained.",
      "Prudential group AI governance and third-party-risk standards will gate vendor selection and may impose regional hosting requirements — establish these before architecture.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.0,
      automationRate: 0.5,
      basis: "Seller assumptions combining policy servicing, claims status and premium-reminder volume across a large in-force book; validate against the insurer's contact-centre and claims-operations reporting.",
    },
    pilotScope:
      "A Scale-scope pilot covering health-claim FNOL intake with in-conversation document capture plus proactive claims-status pushes over WhatsApp and voice in Bahasa, integrated to claims management and policy administration, measured on first-time-complete claim submissions and status-call suppression.",
    expansion: [
      "Add premium-lapse prevention and orphan-policy servicing with in-channel payment",
      "Extend to policy-change servicing (beneficiary, address, fund switch) with policy-bounded execution",
      "Add sharia-entity journeys with separately governed product explanations",
    ],
    stakeholders: [
      "Chief Customer Officer",
      "Head of Claims Operations",
      "Head of Customer Service / Contact Centre",
      "Chief Information Officer",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "What proportion of inbound contacts are claim-status chases, and how many contacts does an average health claim generate?",
      "How large is the orphaned-policy population, and what is its persistency relative to agent-serviced policies?",
      "Does Prudential group governance require regional approval for a customer-facing AI vendor, and has one been selected?",
      "What are the hard boundaries on what an automated agent may say about product features under OJK conduct rules?",
    ],
    flowTemplate: "claims",
    scenario: "A Prudential Indonesia policyholder submits a hospital claim on WhatsApp on a Saturday with photographed documents validated in-flow, and is told each stage as it happens without calling once.",
  },

  "allianz-life-indonesia": {
    operatingContext:
      "Allianz Life Indonesia is one of the country's larger foreign-owned life and health insurers, distributing through a tied-agency force, bancassurance partnerships and corporate employee-benefit schemes. Its health portfolio is the distinguishing feature: employer group health and individual health riders generate claim events at a frequency life-only insurers never see, which converts the servicing operation into a claims-processing and document-chasing machine. Customers interact through a policy app and portal, a contact centre, WhatsApp and their agents, in Bahasa Indonesia with English for corporate clients. Group health administration adds a second customer type — HR teams at corporate clients who need eligibility confirmations, member additions and claim escalations handled quickly.",
    strategicPressure: [
      { text: "Allianz operates global technology and AI governance standards across its country units, so any customer-facing automation must satisfy group frameworks before local deployment.", kind: "verified" },
      { text: "Health insurance claim frequency in Indonesia has risen with medical inflation and utilisation, increasing claims-servicing load and status-chase volume disproportionately to premium growth.", kind: "inference" },
      { text: "Corporate group-health clients are serviced by a small account team handling high-frequency administrative requests, which is a service-quality risk in renewal negotiations.", kind: "inference" },
      { text: "Document chase — incomplete or wrongly formatted claim submissions — is likely the single largest source of claim cycle time and repeat contact, and is the fastest thing to fix conversationally.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Allianz country units implement group-approved or vendor-supplied platforms. The Indonesian technology organisation is a delivery and integration function; conversational infrastructure is not something it builds, and Allianz group AI governance explicitly channels such capability through controlled vendor arrangements.",
    whyNotBuild:
      "Health insurance automation demands accuracy on coverage, exclusions and medical documentation where errors have both financial and regulatory consequences. Building would require Bahasa speech tuned to distressed claimants, telephony integration, deterministic grounding against policy and claims systems, and evaluation of every conversation sufficient to satisfy both OJK and Allianz group audit. No country insurance unit builds this; they buy it with accountability attached.",
    workflows: [
      {
        name: "Health-claim document intake and validation",
        friction: "Claimants submit receipts, discharge summaries and forms by email or app upload, get rejected days later for format or missing items, and resubmit — each cycle adding a week and multiple contacts to a single claim.",
        outcome: "Documents captured and checked for completeness inside the conversation with guided re-capture, so claims arrive complete on first submission and cycle time collapses.",
        channels: ["WhatsApp", "App", "Voice"],
        systems: ["Claims management system", "Policy administration", "Document management/OCR", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Proactive claim-status and reimbursement updates",
        friction: "Claim status is invisible between submission and payment, so claimants call repeatedly and agents read the same screen; the claimant often learns of settlement from their bank statement.",
        outcome: "Stage-change notifications pushed automatically with clear explanation and expected timing, eliminating the status-chase contact category and creating a closure moment at settlement.",
        channels: ["WhatsApp", "SMS", "App push"],
        systems: ["Claims management system", "Payment/reimbursement pipeline", "Notification platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Corporate group-health HR support desk",
        friction: "HR administrators at corporate clients email or call the account team for member additions, eligibility confirmations, card reissues and claim escalations, and responses depend on individual availability.",
        outcome: "An entitlement-aware conversational desk that answers eligibility and membership questions instantly and executes routine administration, with the account team escalated only for commercial matters.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Group policy administration", "Membership/eligibility database", "Claims management system", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A policyholder app and portal for policy details, e-cards and claim submission",
        "A contact centre handling policy, claims and provider network queries",
        "Cashless provider network arrangements with hospital admission verification",
        "WhatsApp and chat servicing channels with human agents",
      ],
      gaps: [
        "Claim submissions are not validated at the moment of capture, causing rejection cycles",
        "Claim status must be requested; it is not pushed",
        "Corporate HR administrators have no self-service path for routine membership changes",
        "Conversations are sampled for quality, so systemic explanation errors surface only in complaints",
      ],
    },
    risks: [
      "OJK insurance conduct rules and Indonesian health-data sensitivity constrain how medical documents and claim information may be processed, stored and used.",
      "Indonesia's Personal Data Protection Law requires explicit handling controls for health data and cross-border transfer, which interacts with Allianz group hosting standards.",
      "Allianz group AI governance requires documented model risk management and human oversight for customer-facing automation, which lengthens approval and must be planned into the timeline.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions reflecting a health-weighted claims servicing load with above-average handling complexity; validate claim volumes, contacts per claim and cost per contact against operations reporting.",
    },
    pilotScope:
      "A Launch-scope pilot on health-claim document intake with in-conversation validation plus proactive claim-status pushes over WhatsApp in Bahasa, integrated to claims management and document processing, measured on first-time-complete submission rate and status-contact reduction.",
    expansion: [
      "Add the corporate group-health HR support desk with entitlement-aware recognition",
      "Extend to policy servicing and renewal conversations for individual health and life products",
      "Introduce provider-network and cashless-admission support conversations",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Claims",
      "Head of Customer Care",
      "Head of Employee Benefits / Group Health",
      "Head of Compliance and Data Privacy",
    ],
    discovery: [
      "What proportion of health claims are rejected on first submission for document or format reasons, and what does that add to cycle time?",
      "How many contacts does an average claim generate between submission and settlement?",
      "What does Allianz group AI governance require before a customer-facing automated agent can go live in Indonesia?",
      "Would corporate HR administrators accept a conversational desk, and which membership actions could be automated within policy?",
    ],
    flowTemplate: "claims",
    scenario: "An Allianz Life Indonesia member photographs hospital receipts on WhatsApp, is told immediately that one document is missing, supplies it, and never has to call about status again.",
  },

  "axa-mandiri": {
    operatingContext:
      "AXA Mandiri is the bancassurance joint venture between Bank Mandiri and AXA, selling life, health and savings-linked insurance almost entirely through Mandiri's branch network and digital channels rather than an independent agency force. That distribution model defines its operating reality: policies are sold by bank staff and in-branch financial advisers to customers who came in for banking, which makes regulator-driven welcome and verification calls a compliance necessity rather than a courtesy. Its in-force book generates continuous premium-payment, lapse-prevention, policy-change and claims servicing across a mass and mass-affluent base spread nationwide through Mandiri's footprint. Communications are Bahasa Indonesia by voice, SMS and WhatsApp, run through a contact centre that must coordinate with the bank's own servicing channels.",
    strategicPressure: [
      { text: "Bancassurance sales through bank branches attract heightened OJK conduct scrutiny around disclosure and suitability, which makes documented, consistent welcome and verification calls a regulatory control, not an option.", kind: "verified" },
      { text: "Because the customer relationship is owned by the bank, AXA Mandiri's own conversational touchpoints are few and disproportionately important for persistency — a lapsed premium is often the first sign anything is wrong.", kind: "inference" },
      { text: "Welcome-call and verification volume scales directly with sales volume through Mandiri's very large branch network, creating a fixed, growing, entirely scripted contact workload.", kind: "inference" },
      { text: "The JV structure means the CX technology decision may sit with either parent, and identifying which is the single highest-value discovery outcome for this account.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A bancassurance joint venture has no independent platform-engineering function; its technology comes from parent standards and vendor procurement. Both parents — a state-linked bank and a global insurer — apply vendor-risk frameworks that channel customer-facing AI through controlled purchases.",
    whyNotBuild:
      "The JV's operating model is distribution and administration, not engineering. Every hard component — Bahasa speech, telephony, policy-bounded execution against policy administration, and conduct-grade evaluation of welcome and suitability conversations — sits outside its capability and inside the risk perimeter that both parents audit. The strongest right-to-win here is evaluation: welcome and verification calls exist precisely to evidence conduct, and a platform that scores 100% of them is directly better than sampling.",
    workflows: [
      {
        name: "Regulatory welcome and verification calls",
        friction: "Every new policy requires a scripted confirmation call executed by agents during working hours; customers are hard to reach, calls are re-attempted repeatedly, and only a sample is quality-reviewed despite the whole point being conduct evidence.",
        outcome: "Consistent, fully-scripted welcome and verification conversations completed at times customers actually answer, with every interaction recorded, scored and retrievable as conduct evidence.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Sales/distribution records", "Quality and compliance repository", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Premium-lapse prevention and persistency outreach",
        friction: "Missed premiums trigger generic SMS reminders that convert poorly, and by the time a human calls the policy is close to lapse — losing years of expected value on a policy that cost money to acquire.",
        outcome: "Two-way conversational reminders in Bahasa with payment executed in-channel, non-payment reasons captured, and hardship or surrender intent escalated to retention specialists with full context.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Retention workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy servicing and claims-status handling",
        friction: "Beneficiary changes, address updates, fund switches and claim-status questions require a call to an agent who must coordinate between AXA Mandiri systems and the bank, and status chasing repeats until settlement.",
        outcome: "Routine policy changes executed conversationally within policy, and claim status pushed proactively so the chase-call category disappears.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Claims management", "Bank channel integration", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A policyholder portal and app for policy details and premium payment",
        "A contact centre performing welcome calls, servicing and claims queries",
        "Distribution and servicing touchpoints through Bank Mandiri branches and digital channels",
        "SMS premium reminders across the in-force book",
      ],
      gaps: [
        "Welcome and verification calls are capacity-limited and only sample-reviewed for conduct",
        "Premium reminders are one-way, so a customer cannot pay or explain in the same thread",
        "Claim and request status must be chased by the customer",
        "Policyholders serviced through bank channels experience inconsistent handoffs between bank and insurer",
      ],
    },
    risks: [
      "OJK bancassurance conduct and disclosure rules make the content and evidencing of welcome and verification calls a supervised control, so response scripts require formal approval and change management.",
      "Indonesia's Personal Data Protection Law governs the sharing of customer data between the bank and the insurer for outbound contact, requiring a clear lawful basis in the JV context.",
      "Dual-parent governance means both Bank Mandiri and AXA vendor-risk standards may apply, materially extending diligence timelines.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions combining welcome-call volume tied to bancassurance sales with premium-reminder and servicing contacts; validate against the JV's contact-centre and new-business reporting.",
    },
    pilotScope:
      "A Launch-scope pilot automating regulatory welcome and verification calls in Bahasa by voice and WhatsApp, integrated to policy administration and the compliance repository, measured on completion rate, contacts-per-completion and 100% conduct scoring coverage.",
    expansion: [
      "Add premium-lapse prevention outreach with in-channel payment and reason capture",
      "Extend to routine policy servicing and proactive claim-status communication",
      "Coordinate a joint servicing layer with Bank Mandiri so bancassurance customers see one experience",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Service / Contact Centre",
      "Head of Bancassurance Distribution",
      "Head of Compliance and Conduct Risk",
      "Chief Information Officer",
    ],
    discovery: [
      "Which parent owns the CX technology decision in the joint venture, and whose vendor-risk process applies?",
      "How many welcome and verification calls are attempted monthly, and what is the completion rate per policy sold?",
      "How is conduct evidence from welcome calls currently sampled and retained for OJK review?",
      "What premium-reminder conversion rate does SMS achieve today, and what is the lapse rate it fails to prevent?",
    ],
    flowTemplate: "retention",
    scenario: "An AXA Mandiri policyholder who bought through a Mandiri branch answers a Bahasa verification call in the evening, confirms she understood the product, and the whole exchange is scored and filed as conduct evidence.",
  },

  "manulife-indonesia": {
    operatingContext:
      "Manulife Indonesia is the long-established Indonesian arm of the Canadian insurer, operating life, health and employee-benefit insurance alongside a meaningful pensions and asset-management business through its Indonesian investment-management affiliate. Distribution mixes a tied-agency force with bancassurance partnerships and corporate employee-benefit and pension mandates, giving it three distinct customer populations: individual policyholders, corporate HR and pension administrators, and retail investment customers. Its in-force servicing load covers premium payment and lapse management, policy changes, claims and, on the pension side, member enquiries about balances, contributions and withdrawals. Communications run in Bahasa Indonesia and English through a contact centre, portal, app and agent relationships.",
    strategicPressure: [
      { text: "Manulife runs regional technology and digital standards across its Asian markets, so the Indonesian unit's customer-facing AI path is shaped by regional decision rights rather than local autonomy.", kind: "verified" },
      { text: "The pension and employee-benefits business creates a member-servicing workload — balance, contribution and withdrawal queries — that behaves more like retail banking than insurance and is highly automatable.", kind: "inference" },
      { text: "Steady rather than explosive contact volume means the business case must lean on service quality and conduct evidencing as much as on pure cost deflection.", kind: "inference" },
      { text: "The clearest near-term wedge is pension-member servicing, which is high-frequency, low-risk, and organisationally separable from the more heavily regulated life-product conversations.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. As a country unit within Manulife Asia's regional structure, the Indonesian business consumes regionally standardised technology. There is no local speech, NLU or orchestration engineering, and regional governance channels customer-facing AI through approved vendor arrangements.",
    whyNotBuild:
      "The decision is not made in Jakarta, and even if it were, the required components — Bahasa and English speech, telephony, deterministic grounding against policy administration and pension record-keeping systems, and evaluation of every conversation for conduct — are four specialist builds with no strategic return for a country insurance unit. Regional standardisation makes a proven, replicable platform far more attractive than an Indonesian-only build that could never be reused.",
    workflows: [
      {
        name: "Pension and employee-benefit member servicing",
        friction: "Members call to ask their accumulated balance, contribution history, vesting position and withdrawal eligibility, and each answer requires an agent to interpret a record-keeping system the member cannot see.",
        outcome: "Instant grounded balance, contribution and eligibility answers in Bahasa or English with withdrawal-process guidance, removing the largest repetitive contact category from the pension operation.",
        channels: ["Voice", "WhatsApp", "Portal chat"],
        systems: ["Pension record-keeping system", "Investment administration", "Employer/member database", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy servicing and claims-status deflection",
        friction: "Policy changes, premium queries and claim-status chasing consume contact-centre capacity, and claim status is invisible to the policyholder between submission and settlement.",
        outcome: "Routine policy changes executed conversationally within policy limits and claim status pushed proactively at every stage, cutting both handling volume and complaint precursors.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Policy administration system", "Claims management", "Document management", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Premium-lapse prevention outreach",
        friction: "Missed premiums are chased with generic reminders and, for agency-sold policies, whatever attention an individual agent chooses to give — so persistency varies with agent behaviour rather than with process.",
        outcome: "Consistent two-way reminder conversations with in-channel payment and captured reasons for non-payment, making persistency a managed process rather than an agent-dependent outcome.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Retention workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A policyholder portal and app for policy details, statements and payment",
        "A contact centre handling policy, claims and pension member queries",
        "Employer-facing pension and employee-benefit administration channels",
        "Agent and bancassurance servicing relationships",
      ],
      gaps: [
        "Pension members cannot get balance or withdrawal-eligibility answers without a human",
        "Claim status is pull-only and requires the customer to chase",
        "Persistency outreach depends on agent behaviour rather than a consistent process",
        "Conversations are sampled rather than fully evaluated for conduct and accuracy",
      ],
    },
    risks: [
      "OJK conduct rules for life and investment-linked products limit what an automated agent may say about suitability and returns, requiring hard guardrails and human escalation.",
      "Indonesia's Personal Data Protection Law applies to pension member data and health-related claim information, and Manulife regional hosting standards may add residency constraints.",
      "Regional decision rights mean local sponsorship alone cannot close a deal; the engagement must be structured for regional approval from the outset.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.0,
      automationRate: 0.5,
      basis: "Seller assumptions covering combined life-policy and pension-member servicing volume; validate against the unit's contact-centre reporting and pension member-enquiry statistics in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on pension and employee-benefit member servicing — balance, contribution and withdrawal-eligibility queries — over voice and WhatsApp in Bahasa and English, integrated to the record-keeping system, measured on containment and average handling time.",
    expansion: [
      "Extend to life-policy servicing and proactive claim-status communication",
      "Add premium-lapse prevention outreach with in-channel payment",
      "Package the deployment for replication across Manulife's other Asian country units",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Employee Benefits and Pensions",
      "Head of Customer Service / Contact Centre",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "Where do decision rights sit between the Indonesian unit and Manulife Asia's regional digital organisation?",
      "What is the monthly pension member-enquiry volume, and what proportion are balance or eligibility questions?",
      "What is the current lapse rate, and how much of persistency outreach depends on individual agents today?",
      "What are the regional data-residency requirements for member and health data?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Manulife pension member in Jakarta asks in Bahasa what her accumulated balance is and whether she can withdraw, and gets both answers with the process explained, without waiting in a queue.",
  },

  "fwd-insurance-indonesia": {
    operatingContext:
      "FWD Insurance Indonesia is the local life insurer of FWD Group, a pan-Asian insurer that has deliberately positioned itself as digital-first and built around simpler products, e-commerce distribution and bancassurance partnerships rather than a legacy agency estate. In Indonesia that means selling protection and savings products through digital journeys, partner platforms and bank channels to a younger, urban customer who was acquired online and expects to be serviced online. The gap that creates is structural: digital acquisition sets an expectation of instant, chat-native service, but the local servicing operation is small and cannot staff to that promise across evenings, weekends and claim events. Communications happen in Bahasa Indonesia across WhatsApp, in-app chat, and a contact centre, with English for a minority of customers.",
    strategicPressure: [
      { text: "FWD Group's stated strategy is digital-first insurance built around partner and online distribution, which sets a customer service expectation the local operation is structurally under-resourced to meet.", kind: "verified" },
      { text: "A regional operating model that relies on shared platforms and technology partners means Indonesia is unlikely to build locally and will adopt whatever the group can deliver or procure.", kind: "inference" },
      { text: "Digitally-acquired customers have weaker relationship anchors than agency-sold policyholders, so lapse and early-surrender risk is higher and conversational persistency intervention matters more.", kind: "inference" },
      { text: "The most credible entry is chat-native claims intake and status, because it is the moment where a digital-first brand promise is most visibly tested and most often fails.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. FWD has genuine digital product capability at group level and will not accept an opaque packaged suite, but the Indonesian unit has neither the scale nor the mandate to build conversational infrastructure. The right motion is a platform delivered with industry workflows that FWD's digital team configures and extends, under group technology governance.",
    whyNotBuild:
      "FWD's digital investment goes into distribution journeys, product simplification and partner integration — the things that differentiate it. Speech, telephony, orchestration into policy administration, and conduct-grade evaluation are undifferentiated infrastructure. Building them in a mid-sized country unit would consume the digital team's entire capacity while delivering nothing a customer would notice as FWD-specific.",
    workflows: [
      {
        name: "Chat-native claims intake and document capture",
        friction: "A digitally-acquired customer expects to file a claim in chat and instead is directed to forms and email attachments, then waits for rejection notices — the exact experience the brand promises to eliminate.",
        outcome: "Structured claim intake inside chat with documents captured and validated in-flow, coverage checked against the policy, and a complete case opened at first contact at any hour.",
        channels: ["WhatsApp", "In-app chat", "Voice"],
        systems: ["Claims management system", "Policy administration", "Document management/OCR", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Policy servicing and status automation",
        friction: "Policy details, premium due dates, beneficiary changes and claim status all require a human in a small servicing team, so response times stretch precisely when the customer is judging the brand.",
        outcome: "Instant grounded policy answers and in-policy changes executed conversationally, with claim and request status pushed proactively rather than requested.",
        channels: ["WhatsApp", "In-app chat"],
        systems: ["Policy administration system", "Claims management", "Notification platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Premium-lapse prevention for digitally-acquired policies",
        friction: "Online-acquired policyholders have no agent watching their premium, so missed payments become lapses with no intervention beyond an automated reminder that nobody reads.",
        outcome: "Conversational reminders with payment in-channel and reasons captured, plus a retention path for genuine affordability issues, protecting the value of expensive digital acquisition.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Retention workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Digital purchase journeys for protection and savings products",
        "A customer app and portal for policy details and premium payment",
        "WhatsApp and in-app chat servicing with a small human team behind it",
        "Bancassurance and partner-platform distribution integrations",
      ],
      gaps: [
        "Claims cannot be filed and completed inside chat despite a chat-first brand promise",
        "Servicing response times degrade outside staffed hours, which is when digital customers engage",
        "Lapse intervention is limited to automated reminders with no conversation",
        "There is no systematic evaluation of servicing conversations for accuracy or conduct",
      ],
    },
    risks: [
      "OJK conduct and disclosure requirements apply equally to digital and chat channels, so automated product explanations require documented approval and change control.",
      "Indonesia's Personal Data Protection Law governs claim documents and health information handled in chat, requiring explicit consent handling and controlled retention.",
      "FWD Group regional technology governance and any existing regional CX vendor commitments could pre-empt a local decision — establish these before investing in the pursuit.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions for a smaller, digitally-acquired in-force base with chat-concentrated servicing; validate contact volume, channel mix and cost per contact against the unit's own reporting.",
    },
    pilotScope:
      "A Launch-scope pilot delivering chat-native claims intake with in-conversation document validation and proactive status pushes over WhatsApp in Bahasa, integrated to claims management and policy administration, measured on first-time-complete claim submissions and after-hours resolution coverage.",
    expansion: [
      "Extend to full policy servicing with in-policy changes executed conversationally",
      "Add premium-lapse prevention outreach for digitally-acquired policies",
      "Integrate servicing into partner-platform surfaces where policies are sold",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Experience / Digital",
      "Head of Claims",
      "Chief Technology Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What regional CX or conversational-AI vendor commitments does FWD Group already hold, and do they cover Indonesia?",
      "What proportion of servicing contacts arrive outside staffed hours, and what is the resulting response time?",
      "How many claims are submitted incomplete on first attempt, and what does that add to cycle time?",
      "What is the lapse rate for digitally-acquired policies compared with bancassurance-sold ones?",
    ],
    flowTemplate: "claims",
    scenario: "An FWD Indonesia customer files a claim entirely on WhatsApp on a Sunday, has her documents checked as she sends them, and is told each stage without ever opening a form.",
  },

  "mnc-group": {
    operatingContext:
      "MNC Group is one of Indonesia's largest media conglomerates, built on free-to-air broadcasting through RCTI, MNCTV, GTV and iNews, and extended into subscription businesses via MNC Vision satellite pay-TV, MNC Play fixed broadband and cable, and the Vision+ streaming service. Alongside the media assets sits a financial-services arm including a bank and multifinance operations. The subscription businesses are what make the group communications-intensive: pay-TV and broadband subscribers generate billing disputes, signal and outage complaints, package-change requests, installation scheduling and cancellation attempts at a frequency broadcast audiences never do. Those conversations arrive by voice and WhatsApp in Bahasa Indonesia, handled by call centres and field technicians across a subscriber base spread well beyond Jakarta.",
    strategicPressure: [
      { text: "Traditional pay-TV subscriber bases across Southeast Asia have been under structural pressure from streaming, making retention and save-desk performance a direct determinant of the subscription business's value.", kind: "verified" },
      { text: "Fixed broadband competition in Indonesia is intense and price-led, so churn management and installation experience — both conversational — decide whether MNC Play grows or leaks subscribers.", kind: "inference" },
      { text: "Outage and signal complaints spike geographically and unpredictably, producing call-volume peaks a fixed contact-centre roster cannot absorb without either long queues or idle capacity.", kind: "inference" },
      { text: "A media conglomerate's operating culture and capital allocation favour content and distribution rights over software engineering, so any conversational capability will be acquired rather than built.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. MNC's technology spend follows broadcast and distribution infrastructure, not platform engineering. There is no evidence of speech, NLU or conversational-orchestration capability in the group, and subscription-CX automation in this sector is an established bought capability.",
    whyNotBuild:
      "A media group's scarce capital goes to content rights and network build; diverting it into Bahasa speech engineering, telephony integration with legacy contact-centre and field-dispatch systems, retention-offer orchestration and per-conversation evaluation would be a strategic error with no audience-facing payoff. The right-to-win is that all four arrive as a configured deployment tied to the subscriber systems the group already runs.",
    workflows: [
      {
        name: "Subscriber billing and package servicing",
        friction: "Subscribers call about invoice amounts, promotional expiry, package changes and payment status, and each is handled by an agent reading a billing system, with volume spiking around billing cycles.",
        outcome: "Billing explanations, package changes and payment handled conversationally in Bahasa with the live account position, absorbing billing-cycle peaks without roster changes.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Subscriber billing system", "Product/package catalogue", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Outage and service-fault triage with technician dispatch",
        friction: "Signal loss and broadband faults produce clustered call spikes; subscribers queue to report a problem the network operations centre may already know about, and technician appointments are scheduled by a human callback.",
        outcome: "Known-outage recognition at hello, guided self-diagnosis for line faults, and technician appointments booked conversationally against live dispatch slots — with proactive notification to affected subscribers before they call.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Network operations/outage system", "Field dispatch scheduling", "Subscriber management", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Retention and win-back conversations",
        friction: "Cancellation requests go to whichever agent answers, offers are improvised, and subscribers who simply stop paying are never engaged in a real conversation about why.",
        outcome: "Churn signals triggering timely two-way outreach, reasons captured conversationally, and retention offers drawn strictly from the approved economics matrix with high-value saves routed to specialists.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Subscriber management", "Billing system", "Offer/retention matrix", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A subscriber call centre handling pay-TV and broadband service and billing",
        "A customer app and web portal for account and package management",
        "WhatsApp-based customer service for subscription queries",
        "Field technician dispatch for installation and fault resolution",
      ],
      gaps: [
        "Subscribers cannot change a package or resolve a billing dispute end-to-end without an agent",
        "Nothing proactively tells subscribers about a known outage in their area before they call",
        "Technician appointments require a human callback rather than in-conversation booking",
        "Cancellation conversations are unstructured, so churn reasons are never systematically captured",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs subscriber contact data used for retention and win-back outreach, requiring lawful basis and honoured opt-outs.",
      "Consumer-protection expectations for subscription services cover clear disclosure of contract terms and cancellation rights, which automated retention conversations must respect explicitly.",
      "Bahasa voice quality across a geographically dispersed, non-metropolitan subscriber base with varied accents is a real operational risk for a voice-first deployment.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.7,
      automationRate: 0.55,
      basis: "Seller assumptions based on typical pay-TV and broadband contact ratios applied to the group's subscription base; subscriber counts, contact rates and cost per contact require validation in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on subscriber billing and package servicing over voice and WhatsApp in Bahasa, integrated to the billing system and CRM, measured on containment rate and billing-cycle peak absorption.",
    expansion: [
      "Add outage triage with proactive notification and in-conversation technician booking",
      "Extend to retention and win-back conversations with an approved offer matrix",
      "Open the same layer to Vision+ streaming subscription support",
    ],
    stakeholders: [
      "Head of Subscription Business (MNC Vision / MNC Play)",
      "Head of Customer Care",
      "Head of Network Operations",
      "Chief Information Officer",
      "Head of Finance / Billing Operations",
    ],
    discovery: [
      "What is the current subscriber trajectory for MNC Vision and MNC Play, and does it support a multi-year platform commitment?",
      "How much contact volume is outage-related, and is there a network system that could feed known-outage recognition?",
      "How are retention offers governed today — is there an approved matrix, or does it depend on the agent?",
      "Where does customer care sit organisationally across pay-TV, broadband and streaming?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "An MNC Play subscriber in Surabaya calls about a broadband outage, is told immediately it is a known area fault with an ETA, and books a technician slot without ever reaching an agent.",
  },

  "emtek": {
    operatingContext:
      "Emtek is an Indonesian media and digital group whose broadcast assets — SCTV and Indosiar — sit alongside Vidio, one of the country's largest homegrown streaming platforms, plus digital-health and technology investments. Vidio is the communications-relevant asset: a subscription streaming service whose growth has been driven substantially by live sports rights, which produce enormous, concentrated demand around match schedules and a subscriber base that spikes and churns with the sporting calendar. Its support load is characteristically streaming-shaped: payment and subscription failures, login and device-limit issues, playback and buffering complaints during live events, and cancellation attempts after a season ends. Contact arrives through in-app support, social channels, WhatsApp and email, overwhelmingly in Bahasa Indonesia from a young, mobile-first audience.",
    strategicPressure: [
      { text: "Vidio's subscription growth has been closely tied to live sports rights, which creates predictable acquisition spikes around major football seasons and equally predictable churn afterwards.", kind: "verified" },
      { text: "Live-event streaming concentrates support demand into narrow windows — a playback failure during a match generates contacts that are worthless to answer an hour later — which no fixed support roster can serve.", kind: "inference" },
      { text: "Streaming subscription economics are thin per user, so support cost per subscriber must stay very low, ruling out human-first servicing at scale.", kind: "inference" },
      { text: "Emtek has digital product teams that will own the customer-facing experience, so the sale is subscription-CX automation as a capability layer rather than an end-to-end managed suite.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Emtek's digital businesses have real product and engineering capability and will insist on owning the customer experience surface, but they will not build speech, orchestration and evaluation infrastructure. The right motion is a configurable platform integrated behind Vidio's own support surfaces, delivered with subscription-CX workflows.",
    whyNotBuild:
      "Vidio's engineering priority is streaming delivery, content rights integration and app performance under live-event load — the things that determine whether the product works at all. Support automation infrastructure is undifferentiated by comparison. Building Bahasa speech and conversation evaluation would consume product engineering capacity at precisely the moments (season launches) when it is most needed on the streaming stack itself.",
    workflows: [
      {
        name: "Subscription, payment and renewal support",
        friction: "Failed payments, unclear renewal charges, promo-code problems and plan changes generate contacts that a small support team answers individually, with volume concentrated around season launches.",
        outcome: "Instant grounded answers on subscription state and payment failures, with plan changes and retries executed in-conversation, absorbing launch-window spikes without seasonal hiring.",
        channels: ["In-app chat", "WhatsApp", "Email"],
        systems: ["Subscription management platform", "Payment gateway", "Entitlement service", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Playback, login and device-limit troubleshooting during live events",
        friction: "During a live match a buffering or device-limit problem must be solved within minutes or the subscriber's value from that subscription is lost entirely, yet support queues are longest at exactly that moment.",
        outcome: "Guided, context-aware troubleshooting that resolves device, entitlement and playback issues in seconds at any concurrency, with genuine platform incidents escalated and communicated proactively.",
        channels: ["In-app chat", "WhatsApp", "Social"],
        systems: ["Entitlement/device management", "Streaming platform telemetry", "Account service", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Churn-save and win-back at season end",
        friction: "Subscribers cancel silently in the app after a season ends, with no conversation, no captured reason and no offer — a predictable, unmanaged annual leak.",
        outcome: "Timely two-way outreach in the subscriber's channel capturing the real cancellation reason and presenting offers from an approved matrix, with save rates measured against offer cost.",
        channels: ["WhatsApp", "In-app", "Email"],
        systems: ["Subscription management platform", "Offer/retention matrix", "Content catalogue", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "In-app help and support flows within the Vidio application",
        "Social-channel and WhatsApp customer support in Bahasa Indonesia",
        "Self-service subscription and plan management in the app",
        "Email support for payment and account issues",
      ],
      gaps: [
        "Support cannot resolve entitlement or device-limit issues in real time during live events",
        "Failed-payment recovery is automated messaging only, not a conversation",
        "Cancellation reasons are not captured, so churn drivers are inferred rather than known",
        "Support quality across channels is not systematically evaluated at scale",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs subscriber and viewing data used for retention outreach, requiring lawful basis and honoured consent.",
      "Content-rights and territorial-licensing rules limit what an automated agent may say about availability, so responses must be grounded strictly in the licensed catalogue.",
      "Extreme concurrency during live events means the deployment must be architected for burst load, not average load — a design constraint that must be proven before a season launch.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.5,
      automationRate: 0.65,
      basis: "Seller assumptions for a streaming subscription base with low cost per contact and highly peaked demand; actual contact volume, peak concurrency and cost per contact must be validated with the Vidio support team.",
    },
    pilotScope:
      "A Launch-scope pilot on Vidio subscription and payment support inside in-app chat and WhatsApp in Bahasa, integrated to subscription management and the payment gateway, measured on containment rate and resolution time during a live-event peak.",
    expansion: [
      "Add real-time playback, login and device-limit troubleshooting with streaming telemetry grounding",
      "Extend to churn-save and win-back outreach at season boundaries with an approved offer matrix",
      "Open the same capability to other Emtek digital properties",
    ],
    stakeholders: [
      "Head of Vidio Product",
      "Head of Customer Experience / Support Operations",
      "Head of Subscription and Growth",
      "Chief Technology Officer",
      "Head of Legal and Data Privacy",
    ],
    discovery: [
      "What is Vidio's paying-subscriber scale, and how much does support volume spike at a major season launch?",
      "What support tooling and automation has the team already built, and what would they want to own versus consume?",
      "What proportion of cancellations happen silently in-app with no support contact at all?",
      "Can entitlement and device-management systems be queried in real time during peak concurrency?",
    ],
    flowTemplate: "retention",
    scenario: "A Vidio subscriber hits a device limit ten minutes into a live match, gets it resolved in chat in under a minute, and watches the rest of the game.",
  },

  "matahari-department-store": {
    operatingContext:
      "Matahari Department Store is Indonesia's largest department-store chain, operating roughly 140 stores across the archipelago with a value-to-mid-market fashion, beauty and homeware assortment that reaches deep into secondary cities as well as Jakarta and Surabaya malls. Its business is overwhelmingly physical retail, supported by a loyalty programme with a very large enrolled base and a comparatively small but growing online and omnichannel channel. Customer conversations cluster around loyalty points and membership, promotional and store-event questions, product availability at specific stores, and — for the online channel — order status, delivery and returns. The audience is mass-market Indonesian shoppers who reach the brand through WhatsApp, social channels and store staff far more than through a contact centre.",
    strategicPressure: [
      { text: "Indonesian department-store retail has been under sustained pressure from e-commerce and specialty formats, making footfall conversion and loyalty engagement central to the operating model rather than incidental.", kind: "verified" },
      { text: "A very large loyalty membership base is the chain's most valuable asset, yet engagement with it is largely one-way broadcast promotion rather than conversation, leaving personalisation and reactivation untapped.", kind: "inference" },
      { text: "Margin pressure in traditional retail makes packaged automation with rapid payback far more fundable than any internal technology programme.", kind: "inference" },
      { text: "The online channel is likely small enough that the real volume case rests on loyalty and store-related conversations rather than on order servicing alone.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Matahari is a merchandising and store-operations business whose technology function runs POS, merchandising and loyalty systems. There is no platform-engineering capability, and retailers of this profile consistently acquire customer-engagement technology as a service.",
    whyNotBuild:
      "A department-store chain under margin pressure has neither the capital nor the talent to build Bahasa conversational infrastructure, and doing so would deliver nothing a shopper values that a bought platform would not. The right-to-win is speed and payback: a configured deployment against existing loyalty and order systems produces measurable engagement within a quarter, which is the only timeframe this kind of retailer will fund.",
    workflows: [
      {
        name: "Loyalty membership servicing and reactivation",
        friction: "Members ask about point balances, expiry, tier status and voucher redemption through social channels and store staff, and lapsed members receive only untargeted broadcast promotions that produce minimal response.",
        outcome: "Instant loyalty balance, tier and voucher answers in Bahasa plus consent-based two-way reactivation conversations tied to actual purchase history, turning a broadcast list into an engaged base.",
        channels: ["WhatsApp", "Social messaging", "SMS"],
        systems: ["Loyalty platform", "POS/transaction history", "Promotion engine", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Online order, delivery and returns servicing",
        friction: "Online shoppers chase order status, delivery timing and return eligibility across a small support team, and returns for a store-and-online business involve rules that customers cannot easily find.",
        outcome: "Order status answered from live systems, returns initiated conversationally with store or courier options explained, and proactive updates when a delivery slips.",
        channels: ["WhatsApp", "Web chat"],
        systems: ["Order management system", "Courier/3PL tracking", "Returns workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Store, stock and promotion enquiries",
        friction: "Shoppers phone stores or message social accounts asking whether a size or item is available, what a promotion covers and what hours a store keeps, consuming store-staff time that should be on the floor.",
        outcome: "Consistent, governed answers on promotions, store logistics and item availability, freeing store staff and converting enquiries into visits.",
        channels: ["WhatsApp", "Social messaging"],
        systems: ["Store inventory system", "Promotion engine", "Store master data", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A loyalty programme with a large enrolled membership and a member app",
        "Social-media and WhatsApp customer engagement channels",
        "An online store with order tracking",
        "Store-level customer service handled by floor and service-desk staff",
      ],
      gaps: [
        "Members cannot check points, tier or voucher eligibility without asking a person",
        "Promotional communication is one-way broadcast with no conversational response path",
        "Item availability at a specific store cannot be confirmed remotely",
        "Returns and exchange rules are explained inconsistently across stores and channels",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs the use of loyalty and purchase data for personalised outreach, requiring consent and honoured opt-outs.",
      "Consumer-protection rules on advertised promotions mean automated responses about pricing and offers must be grounded in an authoritative, version-controlled source.",
      "Bahasa voice and messaging quality must work for mass-market shoppers in secondary cities, where regional accents and informal language dominate.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 0.5,
      automationRate: 0.6,
      basis: "Seller assumptions covering loyalty, promotion and order-related conversations across a mass retail base; actual message volume and support cost must be established with the customer-care and loyalty teams.",
    },
    pilotScope:
      "A Launch-scope pilot on loyalty membership servicing and consent-based reactivation over WhatsApp in Bahasa, integrated to the loyalty platform and promotion engine, measured on containment of loyalty queries and reactivation response rate versus broadcast.",
    expansion: [
      "Add online order, delivery and returns servicing with live order-management grounding",
      "Extend to store, stock and promotion enquiries to release store-staff time",
      "Introduce personalised, consent-based campaign conversations tied to purchase history",
    ],
    stakeholders: [
      "Chief Marketing Officer",
      "Head of Loyalty / CRM",
      "Head of E-commerce and Omnichannel",
      "Head of Store Operations",
      "Head of Information Technology",
    ],
    discovery: [
      "How large is the active loyalty base versus enrolled, and what does current campaign response look like?",
      "What share of revenue comes through online and omnichannel versus stores, and how is that support handled?",
      "Which systems hold point balances and promotion rules, and are they queryable in real time?",
      "How much store-staff time is currently spent answering phone and social enquiries?",
    ],
    flowTemplate: "retention",
    scenario: "A Matahari loyalty member in Makassar asks on WhatsApp what her points are worth, learns a voucher expires this week, and is directed to the nearest store carrying the item she wants.",
  },

  "ramayana-lestari-sentosa": {
    operatingContext:
      "Ramayana Lestari Sentosa is a mass-market department-store and supermarket retailer serving value-conscious Indonesian shoppers, with a store footprint deliberately weighted toward secondary cities, district towns and lower-income urban districts rather than premium Jakarta malls. Its assortment centres on apparel, basics and household goods at low price points, and its trading year is intensely seasonal: the Ramadan and Lebaran period concentrates a very large share of annual sales into a few weeks. Customer communication is correspondingly campaign-shaped — promotional messaging, store-event announcements, opening hours and location queries — reaching an audience for whom WhatsApp is the default digital channel and for whom Bahasa Indonesia and Javanese are everyday languages. There is essentially no in-house software organisation.",
    strategicPressure: [
      { text: "Ramayana's sales are heavily concentrated around the Ramadan and Lebaran trading season, making campaign execution in that window disproportionately important to the year's result.", kind: "verified" },
      { text: "A value-retail customer base in secondary cities is reachable far more reliably by WhatsApp and voice than by app, so conversational channels are the practical route to customer engagement.", kind: "inference" },
      { text: "Thin retail margins mean any customer-engagement investment must show a direct sales or cost return within a season, not over a multi-year horizon.", kind: "inference" },
      { text: "The absence of a centralised customer-care function may be the real obstacle — without an owner, even a well-priced deployment has nobody to run it.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Ramayana is a merchandising and store-operations retailer with no software-engineering organisation of any consequence. Any conversational capability will be procured as a service, and the decision will be made on cost and simplicity rather than on architecture.",
    whyNotBuild:
      "There is nothing to build with — no engineering team, no platform, no appetite for operating technology risk. The relevant sales challenge is not displacing a build but establishing an internal owner and a payback story that survives a value retailer's capital-allocation discipline. The right-to-win is a low-touch deployment that a marketing team can operate without technical staff.",
    workflows: [
      {
        name: "Seasonal campaign engagement on WhatsApp",
        friction: "Lebaran promotions are pushed as broadcast messages with no reply path, so a shopper who wants to ask about sizes, stock or store hours has nowhere to go and the campaign generates no measurable conversation.",
        outcome: "Two-way campaign conversations in Bahasa and Javanese where shoppers can ask, get grounded answers on offers and stores, and be guided to a specific store — converting broadcast spend into attributable footfall.",
        channels: ["WhatsApp", "SMS"],
        systems: ["Promotion/campaign engine", "Store master data", "Loyalty/customer database", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Store, hours and promotion enquiries",
        friction: "Shoppers call individual stores to ask about opening hours, promotion terms and whether an item is stocked, and store staff answer inconsistently while serving customers on the floor.",
        outcome: "Consistent governed answers on store logistics and promotion terms delivered conversationally at any hour, removing an entire category of store-phone interruptions.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Store master data", "Promotion engine", "Inventory system"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Member and voucher servicing",
        friction: "Loyalty or member customers cannot check voucher validity or membership status without asking at a store counter, and vouchers expire unredeemed with no reminder conversation.",
        outcome: "Instant voucher and membership answers with expiry reminders delivered conversationally, lifting redemption rates on promotions already paid for.",
        channels: ["WhatsApp", "SMS"],
        systems: ["Loyalty/member database", "Promotion engine", "POS transaction history"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Broadcast promotional messaging to a customer contact list",
        "Social-media presence used for campaign announcements",
        "Store-level customer service by floor and service-desk staff",
        "A basic loyalty or membership scheme tied to POS",
      ],
      gaps: [
        "Promotional messages cannot be replied to, so shopper intent is lost at the moment of highest interest",
        "No channel confirms whether an item or size is available at a specific store",
        "Voucher expiry is never proactively communicated, so promotional spend goes unredeemed",
        "No centralised record of what customers actually ask across stores and channels",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law requires a lawful basis for promotional messaging and honoured opt-outs, which a broadcast-first retailer may not currently operate rigorously.",
      "Consumer-protection rules on advertised prices and promotion terms mean automated answers must be grounded in an authoritative campaign source, not free-generated.",
      "Javanese and regional-accent Bahasa quality in district-town markets is essential; a Jakarta-tuned voice will not serve this customer base.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 0.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a campaign-driven value retailer with highly seasonal peaks; validate list size, campaign response and any current customer-service cost with the marketing team in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot converting one seasonal WhatsApp campaign into a two-way conversation in Bahasa with grounded promotion and store answers, measured on reply rate, store-visit intent captured and redemption versus a broadcast control.",
    expansion: [
      "Add always-on store, hours and stock enquiry handling to relieve store phones",
      "Extend to member and voucher servicing with expiry reminders",
      "Add Javanese-language coverage across the secondary-city store footprint",
    ],
    stakeholders: [
      "Chief Marketing Officer",
      "Head of Store Operations",
      "Head of Merchandising",
      "Head of Information Technology",
      "Head of Finance",
    ],
    discovery: [
      "Is there a centralised customer-care function, and who would own a conversational channel day to day?",
      "How large is the addressable WhatsApp or SMS contact list, and what consent basis was it collected under?",
      "What does a Lebaran campaign cost, and how is its impact measured today?",
      "Can store-level inventory be queried, even at a coarse level, to answer availability questions?",
    ],
    flowTemplate: "retention",
    scenario: "A Ramayana shopper in a Central Java district town replies to a Lebaran promo on WhatsApp in Javanese, asks whether her size is in stock nearby, and is sent to the right store.",
  },

  "mitra-adiperkasa": {
    operatingContext:
      "Mitra Adiperkasa is Indonesia's dominant brand-retail operator, running thousands of stores as the local licensee or franchisee for a very large portfolio of international brands across fashion, sportswear, footwear, department stores and food and beverage — including Starbucks in Indonesia — alongside its own MAPCLUB loyalty programme and MAP-operated e-commerce channels. Its structure is the defining operating fact: each brand has its own storefront, social presence, pricing, promotion calendar and return policy, but they share a customer base, a loyalty programme and back-office logistics. A shopper who holds MAPCLUB points, buys sportswear from one brand, coffee from another and fashion from a third experiences several disconnected service front doors. Customer conversations run through WhatsApp, brand social accounts, marketplace channels and store staff, in Bahasa Indonesia with English in premium segments.",
    strategicPressure: [
      { text: "MAP operates as a multi-brand licensee and franchisee across a very large store portfolio, so customer service is structurally fragmented by brand even though the customer and loyalty relationship is shared.", kind: "verified" },
      { text: "MAPCLUB is the one asset that spans the portfolio, which makes loyalty-led conversational servicing the natural unifying layer and the highest-leverage place to start.", kind: "inference" },
      { text: "Brand principals impose their own service standards and communication guidelines, so any conversational deployment must be configurable per brand rather than uniform — a genuine platform requirement.", kind: "inference" },
      { text: "Whether customer care is centralised at group level or delegated to each brand determines whether this is one enterprise deal or dozens of small ones, and is the single most important thing to establish.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. MAP's core competence is retail operations, brand licensing and supply chain. Its technology function runs merchandising, loyalty and omnichannel commerce systems rather than platform engineering, and a multi-brand operator gains no advantage from owning conversational infrastructure.",
    whyNotBuild:
      "Building would mean creating one conversational stack that must satisfy dozens of brand principals' service standards while handling Bahasa speech, orchestration across separate order and loyalty systems, and evaluation per brand. That is a platform product, not a retail capability. MAP's engineering capacity is committed to omnichannel commerce, and the multi-brand configurability requirement is exactly what a platform provides and an in-house build would struggle to generalise.",
    workflows: [
      {
        name: "Cross-brand order status and returns",
        friction: "A customer who ordered from two MAP brands must find two different service channels, and returns rules differ by brand with no single place to ask — so a simple return becomes several interactions and often a store visit.",
        outcome: "One conversational front door that recognises the customer, retrieves orders across brands, explains the correct brand-specific return policy and initiates the return in the right system.",
        channels: ["WhatsApp", "Web chat", "Social messaging"],
        systems: ["Order management systems (multi-brand)", "Returns workflow", "Courier/3PL tracking", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "MAPCLUB loyalty servicing across the portfolio",
        friction: "Members ask about points, tiers, expiry and which brands accrue or redeem, and answers depend on whichever brand's staff or channel they happen to reach, producing inconsistent and often wrong information.",
        outcome: "Authoritative, instant loyalty answers spanning the whole portfolio with redemption guidance, plus consent-based reactivation of dormant members using cross-brand purchase history.",
        channels: ["WhatsApp", "App chat", "Social messaging"],
        systems: ["MAPCLUB loyalty platform", "POS transaction history", "Promotion engine", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Product availability and size/stock enquiries",
        friction: "Pre-purchase questions about size, colour and store availability arrive across brand social channels and are answered manually by small teams, with no reliable link to inventory — so answers are slow and often wrong.",
        outcome: "Grounded availability answers per brand and store, with reservation or click-and-collect where supported, converting enquiries into sales instead of abandonment.",
        channels: ["WhatsApp", "Social messaging", "Web chat"],
        systems: ["Inventory management (multi-brand)", "Store master data", "E-commerce platform", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "MAPCLUB loyalty programme spanning the brand portfolio with a member app",
        "Brand-level e-commerce sites and marketplace storefronts with order tracking",
        "Social-media and WhatsApp customer service run per brand",
        "Store-level service desks handling returns and exchanges",
      ],
      gaps: [
        "No single front door recognises a customer across brands — each brand starts from zero",
        "Return policies and processes are explained inconsistently between brands and channels",
        "Members cannot get an authoritative cross-portfolio loyalty answer without a store visit",
        "Pre-purchase availability questions are answered manually and often inaccurately",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs cross-brand use of loyalty and purchase data, which is precisely what makes a unified layer valuable and legally sensitive — consent scope must be verified.",
      "Brand principals impose communication and service standards that constrain tone, claims and promotional statements, requiring per-brand governance of automated responses.",
      "Consumer-protection rules on advertised pricing and returns mean automated answers must be grounded in authoritative, brand-specific policy sources.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.6,
      automationRate: 0.6,
      basis: "Seller assumptions aggregating conversation volume across the brand portfolio and loyalty base; per-brand volumes and current service costs must be collected in discovery, since they are likely tracked separately.",
    },
    pilotScope:
      "A Scale-scope pilot delivering a unified MAPCLUB loyalty and cross-brand order-status front door on WhatsApp in Bahasa and English for a selected set of brands, integrated to the loyalty platform and those brands' order systems, measured on containment and cross-brand recognition rate.",
    expansion: [
      "Extend the unified front door to returns initiation across additional brands",
      "Add product availability and click-and-collect enquiries with inventory grounding",
      "Introduce consent-based cross-brand reactivation campaigns using loyalty history",
    ],
    stakeholders: [
      "Chief Digital Officer / Head of Omnichannel",
      "Head of MAPCLUB Loyalty and CRM",
      "Head of Customer Service",
      "Brand General Managers (for pilot brands)",
      "Chief Information Officer",
    ],
    discovery: [
      "Is customer care centralised at MAP or delegated per brand, and who could sign a portfolio-wide agreement?",
      "What consent basis exists for using MAPCLUB data across brands for service and outreach?",
      "How many separate order-management and inventory systems would a unified front door need to reach?",
      "What service and communication constraints do brand principals impose that would apply to an automated agent?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A MAPCLUB member in Jakarta asks on WhatsApp where two orders from different MAP brands are, gets both answers and her point balance, and starts a return in the same thread.",
  },

  "erajaya": {
    operatingContext:
      "Erajaya is Indonesia's largest mobile-phone and consumer-electronics retailer and distributor, operating multi-brand chains such as Erafone alongside authorised brand stores including iBox for Apple and Samsung-branded outlets, plus a wholesale distribution arm supplying independent retailers nationwide. Its economics turn on high-ticket, considered purchases: a customer researching a flagship phone asks about price, trade-in value, instalment plans, bundled data offers and warranty terms before buying, and returns later for warranty service or repair. Product launches — a new iPhone or flagship Android — create extreme demand concentration where pre-order and availability questions arrive in volumes no fixed team can serve. Conversations run through WhatsApp, marketplace chat, brand social channels and store staff, in Bahasa Indonesia.",
    strategicPressure: [
      { text: "Erajaya operates both authorised brand stores and multi-brand retail alongside distribution, so it carries the customer-service obligation for high-value products under brand-principal service standards.", kind: "verified" },
      { text: "Flagship device launches concentrate enormous pre-sales and availability demand into days, and every unanswered question at that moment is a sale lost to a competing retailer or marketplace.", kind: "inference" },
      { text: "Trade-in and instalment financing have become central to phone retail economics in Indonesia, and both are conversation-heavy processes with eligibility rules customers cannot self-assess.", kind: "inference" },
      { text: "Marketplace channels take a large share of transactions but hand back limited customer relationship, so own-channel conversational engagement is where Erajaya can actually own the customer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Erajaya is a distribution and retail-operations business whose technology investment goes into inventory, POS and omnichannel commerce. It has no platform-engineering function, and conversational capability for retail pre-sales and warranty servicing is a standard bought capability.",
    whyNotBuild:
      "Building would require Bahasa conversational infrastructure, real-time inventory and pricing grounding across hundreds of stores, and warranty-workflow integration with multiple brand principals' systems — while retail margins in phone distribution are thin and volatile. No competitive advantage arises from owning that stack; the advantage comes from answering a pre-purchase question faster than the marketplace competitor does, which a bought platform delivers immediately.",
    workflows: [
      {
        name: "Pre-sales product, price and availability enquiries",
        friction: "Customers asking about model variants, prices, colour availability and which store has stock get slow manual replies on social and WhatsApp, and at launch moments those queues collapse entirely.",
        outcome: "Instant grounded answers on specification, price, promotion and store-level availability at any volume, with the customer directed to a store or checkout while intent is still live.",
        channels: ["WhatsApp", "Social messaging", "Web chat"],
        systems: ["Inventory management", "Pricing/promotion engine", "Product catalogue", "E-commerce platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Trade-in valuation and instalment eligibility guidance",
        friction: "Trade-in value and instalment eligibility depend on device condition, partner finance rules and current promotions, so customers must visit a store to find out — and many simply do not.",
        outcome: "Guided trade-in assessment and instalment eligibility explained conversationally with indicative outcomes, so customers arrive at the store ready to transact rather than to enquire.",
        channels: ["WhatsApp", "Web chat"],
        systems: ["Trade-in valuation system", "Finance partner integration", "Promotion engine", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Warranty claim intake and repair-status tracking",
        friction: "A customer with a faulty device must visit a service point, then calls repeatedly to ask whether the repair is done, with status held in a system only staff can see.",
        outcome: "Warranty eligibility checked and claims logged conversationally with service-point booking, and repair status pushed proactively at each stage so chase calls disappear.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Service/repair management system", "Warranty registry", "Store/service-point scheduling", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "E-commerce and marketplace storefronts with order tracking",
        "WhatsApp and social-channel customer engagement per retail brand",
        "Authorised service points for warranty and repair handling",
        "Store-level pre-sales advice from trained retail staff",
      ],
      gaps: [
        "Store-level stock availability cannot be confirmed remotely before travelling to a store",
        "Trade-in value and instalment eligibility require a physical visit to establish",
        "Repair status must be chased by phone; nothing is pushed to the customer",
        "Launch-day enquiry volume simply exceeds what human channels can answer",
      ],
    },
    risks: [
      "Consumer-protection rules on advertised pricing and warranty terms mean automated answers must be grounded in authoritative, version-controlled sources, particularly for brand-principal products.",
      "Indonesia's Personal Data Protection Law governs customer contact and device data used for outreach and trade-in assessment.",
      "Brand principals impose strict communication standards for their authorised channels, requiring per-brand governance of what an automated agent may claim about products.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a high-consideration retail category with heavy pre-sales enquiry volume and launch peaks; actual message volume, launch-period spikes and service costs need validation in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on pre-sales product, price and store-availability enquiries over WhatsApp in Bahasa for one retail brand, integrated to inventory and the promotion engine, measured on response time, containment and store-visit conversion through a launch window.",
    expansion: [
      "Add trade-in valuation and instalment eligibility guidance with finance-partner integration",
      "Extend to warranty claim intake and proactive repair-status tracking",
      "Roll the same layer across the remaining retail brands and the distribution channel",
    ],
    stakeholders: [
      "Chief Marketing Officer",
      "Head of Omnichannel / E-commerce",
      "Head of Retail Operations",
      "Head of After-Sales Service",
      "Chief Information Officer",
    ],
    discovery: [
      "What share of sales runs through marketplaces versus own channels, and where does Erajaya own the customer conversation?",
      "How does enquiry volume behave in the week of a flagship device launch compared with a normal week?",
      "Can store-level inventory be queried in near real time, and at what granularity?",
      "How many warranty and repair status contacts does the service network receive monthly?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A customer in Medan asks on WhatsApp which nearby Erafone store has the new flagship in the colour she wants and what her old phone is worth as trade-in, and walks in ready to buy.",
  },

  "indomaret": {
    operatingContext:
      "Indomaret, operated by Indomarco Prismatama within the Salim Group, runs Indonesia's largest convenience-store network with well over twenty thousand outlets reaching from Jakarta neighbourhoods to district towns across the archipelago. Its strategic significance is that the stores have become a national services layer, not just a retail one: bill payment and top-ups, parcel pickup and drop-off points for e-commerce couriers, ticketing, and the Klik Indomaret online grocery and delivery channel all run through the same counters. That layered model multiplies failure modes — a failed electricity token purchase, an undelivered Klik order, a parcel that cannot be found at a pickup point, a loyalty or voucher problem — each of which produces a customer conversation at a volume proportional to an enormous daily transaction count. Contact arrives by WhatsApp, app chat, social channels and a call centre, in Bahasa Indonesia.",
    strategicPressure: [
      { text: "Indomaret's store network doubles as a national payments, parcel and services layer, so transaction-failure conversations scale with total national digital-services volume rather than with grocery sales.", kind: "verified" },
      { text: "Convenience retail runs on extremely thin per-transaction margins, so any human handling of a failed bill payment or small order issue can cost more than the transaction earned.", kind: "inference" },
      { text: "Klik Indomaret competes against much larger quick-commerce players whose service expectations it must match without their technology budgets.", kind: "inference" },
      { text: "Because a franchise-heavy network means service issues surface at store level first, a conversational layer would need to serve both customers and store operators to be fully effective.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Indomarco's operating culture is disciplined, cost-focused retail execution at extreme scale, and its technology investment sits in store systems, supply chain and payments integration. There is no platform-engineering organisation, and customer-conversation automation is a bought capability in this segment.",
    whyNotBuild:
      "The company's advantage is store density and operational execution, not software. Building conversational infrastructure would require Bahasa speech, orchestration across payment-partner, parcel-partner and e-commerce systems, and evaluation at a volume few Indonesian organisations handle — none of which makes a single store more profitable. A bought platform that resolves a failed token purchase without a human is directly accretive on day one.",
    workflows: [
      {
        name: "Failed bill-payment and top-up resolution",
        friction: "A customer whose electricity token, phone top-up or bill payment failed at the counter has money debited and no product, and must escalate through store staff to a call centre that reconciles manually across payment partners over days.",
        outcome: "Automated reconciliation-aware resolution that identifies the transaction, confirms its true state with the payment partner, and either completes or refunds it inside the conversation.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Payment/biller integration platform", "POS transaction ledger", "Refund workflow", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Klik Indomaret order and delivery servicing",
        friction: "Online grocery orders arrive incomplete, substituted or late, and customers chase status through chat where a human must check the order system and courier separately.",
        outcome: "Live order and delivery status with substitution explanations, refund or redelivery executed in-conversation, and proactive notification when an order is at risk.",
        channels: ["App chat", "WhatsApp"],
        systems: ["Order management system", "Delivery/courier tracking", "Payment/refund workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Parcel pickup-point and loyalty enquiries",
        friction: "Customers ask whether a parcel has arrived at a specific store, how long it will be held, and about loyalty points and vouchers — questions currently answered by store staff at the counter while a queue waits.",
        outcome: "Instant parcel-arrival and hold-period answers plus loyalty servicing delivered conversationally, removing counter interruptions across twenty thousand stores.",
        channels: ["WhatsApp", "App chat"],
        systems: ["Parcel/pickup-point system", "Courier partner integration", "Loyalty platform", "Store master data"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The Klik Indomaret app and website for online ordering and account management",
        "A customer call centre and social-media service channels",
        "Store counters acting as the first line of customer service for transaction issues",
        "A loyalty and voucher programme tied to POS",
      ],
      gaps: [
        "Failed payment transactions require manual reconciliation across partners, taking days",
        "Customers cannot confirm parcel arrival at a pickup store without asking staff",
        "Order issues on Klik require a human to check two systems before answering",
        "Store staff absorb service load that has no automated channel behind it",
      ],
    },
    risks: [
      "Bank Indonesia payment-system rules and consumer-protection expectations govern the handling and refund timelines for failed payment transactions, which an automated flow must satisfy verifiably.",
      "Indonesia's Personal Data Protection Law applies to transaction and parcel data shared across partner systems, requiring controlled access and purpose limitation.",
      "Bahasa voice and messaging quality must serve a genuinely national mass-market base including district towns, where regional accents and informal language are the norm.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.5,
      automationRate: 0.65,
      basis: "Seller assumptions reflecting very high national transaction volume converting to service contacts at a low rate but enormous absolute count; validate contact volume and cost with the customer-care and digital-services teams.",
    },
    pilotScope:
      "A Scale-scope pilot resolving failed bill-payment and top-up transactions plus Klik Indomaret order issues over WhatsApp and app chat in Bahasa, integrated to the payment platform and order management, measured on automated resolution rate and time-to-refund.",
    expansion: [
      "Add parcel pickup-point and loyalty enquiry handling to relieve store counters",
      "Introduce proactive notification for at-risk orders and failed transactions before customers contact",
      "Extend a store-operator support desk so franchise staff can resolve issues conversationally",
    ],
    stakeholders: [
      "Director of Digital Business",
      "Head of Customer Care",
      "Head of Klik Indomaret / E-commerce",
      "Head of Payment and Digital Services",
      "Chief Information Officer",
    ],
    discovery: [
      "Where does customer care for digital services sit organisationally, and what does it cost today?",
      "What is the monthly volume of failed payment transactions requiring manual reconciliation, and what is the current resolution time?",
      "Can payment-partner and parcel-partner systems be queried in real time to establish true transaction state?",
      "Would store operators be in scope for a support channel, and who owns that relationship?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An Indomaret customer whose electricity token failed at the counter messages on WhatsApp, has the transaction traced to the biller, and gets the token delivered within minutes instead of a three-day refund.",
  },

  "azko-aspirasi-hidup": {
    operatingContext:
      "AZKO, operated by Aspirasi Hidup Indonesia within the Kawan Lama group, is Indonesia's leading home-improvement and lifestyle retail chain, rebranded from ACE Hardware Indonesia after the international licence arrangement ended. It runs large-format stores in malls and standalone locations nationwide selling tools, home improvement products, furniture and lifestyle goods, supported by a substantial loyalty membership base and an omnichannel ordering capability. The rebrand itself created an unusual communications obligation: explaining to a large, loyal customer base that the store, the loyalty programme and the product range continue under a new name. Beyond that, the category drives naturally conversational service — bulky-item delivery scheduling, product availability across stores, assembly and installation follow-up, and warranty questions on tools and appliances — reaching customers in Bahasa Indonesia through WhatsApp, app and store channels.",
    strategicPressure: [
      { text: "The 2025 rebrand from ACE Hardware to AZKO required communicating brand, loyalty and product continuity to a large existing customer base — a one-off but substantial conversational obligation.", kind: "verified" },
      { text: "Home-improvement retail is delivery- and installation-heavy for bulky goods, so scheduling and follow-up conversations are intrinsic to the category rather than incidental service overhead.", kind: "inference" },
      { text: "Rebrand spend may have consumed the discretionary budget that would otherwise fund customer-experience investment, making timing the key qualification question.", kind: "inference" },
      { text: "Loyalty membership continuity through the rebrand is probably the most sensitive customer question and the most valuable thing to handle conversationally at scale.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. AZKO is a merchandising and store-operations retailer within a family-owned industrial and retail group. Its technology function delivers commerce and store systems, not platform engineering, and conversational capability in this segment is procured as a service.",
    whyNotBuild:
      "A home-improvement retailer gains nothing from owning speech or orchestration technology, and has no team capable of building it. The specific requirements — bulky-item delivery scheduling against logistics slots, warranty grounding across supplier terms, loyalty continuity messaging — are configuration problems on a platform, not engineering problems worth solving internally.",
    workflows: [
      {
        name: "Delivery scheduling and rescheduling for bulky items",
        friction: "Furniture and large appliance deliveries are scheduled by callback, missed deliveries require a new call, and customers who need to change a slot cannot do so without reaching a person during office hours.",
        outcome: "Delivery slots offered, confirmed and rescheduled conversationally against live logistics availability, with proactive notification when a delivery is at risk — cutting failed deliveries and redelivery cost.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Order management system", "Delivery/logistics scheduling", "Store inventory", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Product availability and store enquiries",
        friction: "Customers phone stores to ask whether a specific tool, size or model is stocked, and staff must physically check while other customers wait; wrong answers cause wasted journeys.",
        outcome: "Grounded store-level availability answers with alternatives and reservation where supported, converting enquiries into visits and freeing store staff from the phone.",
        channels: ["WhatsApp", "Web chat"],
        systems: ["Inventory management", "Product catalogue", "Store master data", "E-commerce platform"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Loyalty continuity and membership servicing",
        friction: "After the rebrand, members are unsure whether points, tiers and benefits carried over, and each question is answered manually by store staff or social-media agents with inconsistent detail.",
        outcome: "Authoritative, identical answers on membership continuity, points and benefits delivered conversationally at scale, protecting the loyalty base through the transition.",
        channels: ["WhatsApp", "App chat", "Social messaging"],
        systems: ["Loyalty platform", "POS transaction history", "Promotion engine", "CRM"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A loyalty membership programme with an app and member benefits",
        "An e-commerce and omnichannel ordering channel with delivery",
        "Social-media and WhatsApp customer engagement",
        "Store service desks handling returns, warranty intake and enquiries",
      ],
      gaps: [
        "Delivery slots cannot be booked or changed without reaching a human",
        "Store-level stock cannot be confirmed remotely before travelling",
        "Installation and assembly follow-up is not systematically communicated",
        "Rebrand-related loyalty questions are answered inconsistently across channels",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs loyalty and purchase data used for personalised outreach, requiring consent and honoured opt-outs.",
      "Consumer-protection rules on advertised pricing, warranty terms and delivery commitments mean automated answers must be grounded in authoritative sources rather than generated.",
      "Post-rebrand budget constraints are a commercial risk to timing rather than to fit; the deployment must be scoped to a payback the finance function will fund.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 0.6,
      automationRate: 0.55,
      basis: "Seller assumptions covering delivery scheduling, availability and loyalty conversations across the store network; validate contact volume and current customer-service cost with the customer-care team.",
    },
    pilotScope:
      "A Launch-scope pilot on bulky-item delivery scheduling and rescheduling over WhatsApp in Bahasa, integrated to order management and logistics scheduling, measured on failed-delivery rate and scheduling contacts handled without a human.",
    expansion: [
      "Add store-level product availability and reservation enquiries",
      "Extend to loyalty membership servicing and post-rebrand continuity messaging",
      "Introduce installation and assembly follow-up with feedback capture",
    ],
    stakeholders: [
      "Chief Marketing Officer",
      "Head of Customer Experience",
      "Head of Supply Chain and Logistics",
      "Head of Store Operations",
      "Head of Information Technology",
    ],
    discovery: [
      "Did the rebrand transition consume the CX budget, and when does the next investment window open?",
      "What proportion of deliveries fail on first attempt, and what does a redelivery cost?",
      "Can store-level inventory be queried in near real time for availability answers?",
      "How many loyalty-continuity questions has the rebrand generated, and how are they being answered?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An AZKO customer in Bekasi reschedules a wardrobe delivery on WhatsApp the night before, picks a Saturday slot from live availability, and the truck arrives when she is home.",
  },

  "tiket-com": {
    operatingContext:
      "tiket.com is one of Indonesia's largest online travel agencies, part of the Blibli Tiket group within the Djarum-affiliated ecosystem, selling domestic and international flights, hotels, attractions, car rental and event tickets to a predominantly Indonesian customer base. Its operating reality is defined by dependency: it sells inventory it does not control, so when an airline reschedules or cancels, or a hotel booking fails at check-in, tiket.com owns the customer conversation while the resolution sits with a supplier. That produces intense, unpredictable contact spikes around weather disruption, airline schedule changes and peak holiday periods, layered on a steady base of booking-change, refund-status and voucher enquiries. Support runs through in-app chat, WhatsApp, a call centre and social channels, in Bahasa Indonesia with English for international bookings.",
    strategicPressure: [
      { text: "As part of the Blibli Tiket group, tiket.com sits inside an organisation with real product and platform engineering capability, which rules out a packaged CX suite and points to selective co-build.", kind: "verified" },
      { text: "Refund cycle times in Indonesian online travel became a well-publicised customer pain point after pandemic-era disruption, making refund-status transparency a durable brand issue rather than a passing one.", kind: "verified" },
      { text: "Because inventory and refunds are controlled by suppliers, the OTA's only lever on customer experience is the quality and speed of the conversation about status — which is precisely what automation can transform.", kind: "inference" },
      { text: "Disruption spikes are the highest-value automation target because human capacity is fixed and the spike is exactly when brand damage happens.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. tiket.com's engineering organisation will own the customer-facing experience and its integrations with airline and hotel systems, and will not buy a packaged suite. The opportunity is selling infrastructure and selected capabilities — grounding against live supplier feeds, orchestration, voice, and per-conversation evaluation — on Google Cloud, with the OTA's team building the experience on top.",
    whyNotBuild:
      "tiket.com will build most of the experience, and should. What it will not economically build is production speech in Bahasa and English, telephony for voice escalation during disruption, and a rigorous evaluation layer that scores every conversation — three things that only pay off at platform scale. Its engineering priority is supplier integration and booking-funnel conversion, and disruption automation competes for the same team.",
    workflows: [
      {
        name: "Flight-disruption rebooking assistance",
        friction: "When an airline reschedules or cancels, affected customers all contact at once; agents read options one by one from supplier systems while queues build, and customers at airports wait longest when it matters most.",
        outcome: "Proactive notification to affected bookings before customers call, with live rebooking options presented in-channel and confirmed in one step, and complex multi-leg cases escalated with full context.",
        channels: ["App push", "WhatsApp", "Voice", "In-app chat"],
        systems: ["Booking platform", "Airline GDS/supplier feeds", "Notification platform", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refund status and processing transparency",
        friction: "Refunds depend on supplier processing that the OTA cannot accelerate, so customers call repeatedly for weeks and agents can only restate an unchanged status — the single most corrosive contact category the business has.",
        outcome: "Live refund state from the payments and supplier pipeline explained clearly with realistic timing, and proactive updates at every state change so the customer stops needing to ask.",
        channels: ["In-app chat", "WhatsApp", "Email"],
        systems: ["Refund/payments pipeline", "Supplier settlement systems", "Booking platform", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Booking change and hotel check-in issue resolution",
        friction: "Date changes, name corrections and hotels denying a valid booking at check-in require an agent to negotiate with a supplier while the customer stands at a reception desk.",
        outcome: "Booking changes executed within fare and property rules conversationally, and check-in failures escalated instantly with the booking evidence assembled and a supplier contact path already open.",
        channels: ["WhatsApp", "In-app chat", "Voice"],
        systems: ["Booking platform", "Hotel supplier connectivity", "Payment gateway", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "In-app chat support with self-service booking management",
        "A 24-hour call centre for booking and disruption issues",
        "Push and email notification for booking confirmations and schedule changes",
        "Self-service cancellation and refund request flows in the app",
      ],
      gaps: [
        "Disruption notification is not consistently proactive enough to prevent the call spike",
        "Refund status is opaque between request and settlement, driving repeat contacts",
        "Rebooking options cannot be selected and confirmed inside a conversation",
        "Voice escalation during disruption has no capacity elasticity at all",
      ],
    },
    risks: [
      "Indonesian consumer-protection expectations for travel refunds and disclosure mean automated statements about timing and entitlement must be conservative, accurate and auditable.",
      "Indonesia's Personal Data Protection Law governs traveller identity and payment data handled in conversations, requiring strict access control and retention limits.",
      "Supplier system reliability determines grounding quality — an agent confidently reporting stale airline data is worse than no automation, so degradation behaviour must be designed explicitly.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Seller assumptions covering steady booking-servicing contacts plus disruption spikes; the OTA will have precise figures, so these should be replaced with its own support analytics immediately.",
    },
    pilotScope:
      "A Launch-scope co-build pilot on flight-disruption handling — proactive notification plus in-channel rebooking options for a defined set of airline partners — with tiket.com owning the experience layer and the platform providing grounding, orchestration and evaluation.",
    expansion: [
      "Extend to refund-status transparency with live payments and supplier-pipeline grounding",
      "Add booking-change execution and hotel check-in escalation handling",
      "Add elastic voice capacity for disruption peaks in Bahasa and English",
    ],
    stakeholders: [
      "Chief Technology Officer",
      "Head of Customer Experience / Support Operations",
      "Head of Air and Hotel Product",
      "Head of Data / Machine Learning",
      "Head of Legal and Consumer Compliance",
    ],
    discovery: [
      "How much conversational automation has the Blibli Tiket group already built in-house, and what remains manual?",
      "What does contact volume look like on a major disruption day versus a normal day, and how is capacity flexed?",
      "How many contacts does a single refund case generate on average from request to settlement?",
      "Which supplier feeds can be queried in real time reliably enough to ground a customer-facing answer?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A tiket.com customer whose Jakarta-Denpasar flight is cancelled gets a WhatsApp message with three rebooking options before she reaches the airport, and confirms one in a single tap.",
  },

  "citilink": {
    operatingContext:
      "Citilink is the low-cost subsidiary of Garuda Indonesia, flying a dense domestic network across the Indonesian archipelago along with selected regional international routes, on an LCC cost model that keeps ground and support staffing deliberately lean. Domestic Indonesian aviation is structurally disruption-prone — weather, volcanic activity, congested airports and tight aircraft rotations mean delays cascade across a day's schedule — and every cascade converts directly into contact volume the LCC staffing model cannot absorb. Its passengers are predominantly domestic leisure and price-sensitive business travellers booking through the app, website, OTAs and travel agents, communicating in Bahasa Indonesia. Contact drivers are dominated by schedule changes, rebooking, refund status, baggage issues and ancillary purchases, arriving through a call centre, WhatsApp, social channels and airport counters.",
    strategicPressure: [
      { text: "Citilink operates as Garuda Indonesia's LCC subsidiary and has been shaped by the group's financial restructuring, which constrains capital spending and favours operating-expense solutions with clear returns.", kind: "verified" },
      { text: "Indonesian domestic aviation faces recurrent weather and infrastructure disruption, so 10x contact spikes are a routine operating condition rather than an exceptional event.", kind: "verified" },
      { text: "LCC economics leave no margin for staffing to peak demand, meaning disruption days are served by long queues that damage the brand precisely when passengers are most stressed.", kind: "inference" },
      { text: "Ancillary revenue — baggage, seats, meals — is under-monetised when passengers cannot easily ask questions and buy conversationally, making the automation case revenue-positive as well as cost-negative.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Citilink has airline IT capability for operations and reservations but no conversational-platform engineering, and as a restructured LCC subsidiary it needs a partner-delivered solution with predictable operating cost rather than an internal platform programme. Group constraints reinforce a delivered-solution motion over a capital build.",
    whyNotBuild:
      "An LCC's engineering and capital go into fleet, network and revenue systems. Building would mean Bahasa speech, telephony that can absorb a 10x spike, orchestration against the passenger service system for actual rebooking, and evaluation across every disruption conversation — an infrastructure programme entirely outside airline competence, funded from capital the group restructuring does not permit.",
    workflows: [
      {
        name: "Proactive disruption notification and in-channel rebooking",
        friction: "When a flight is delayed or cancelled, passengers discover it at the airport or from an SMS with no options, then queue on the phone or at a counter while agents read alternatives one at a time.",
        outcome: "Affected passengers messaged before they ask, with live alternative flights offered and confirmed in-channel, converting a 10x call spike into a handled notification event.",
        channels: ["WhatsApp", "App push", "SMS", "Voice"],
        systems: ["Passenger service system / reservations", "Flight operations and schedule feed", "Notification platform", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refund and compensation status handling",
        friction: "Refund requests disappear into a processing pipeline the passenger cannot see, generating weeks of repeat calls, and compensation entitlement is explained inconsistently depending on which agent answers.",
        outcome: "Live refund state with realistic timing communicated proactively, and compensation rules applied identically from an approved policy source every time.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Refund/payments pipeline", "Reservations system", "Policy/compensation matrix", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Baggage, ancillary and booking servicing",
        friction: "Baggage allowance questions, excess-baggage purchase, seat and meal selection and name corrections require an agent or an app flow passengers struggle with, so ancillary revenue is lost and calls are consumed on simple tasks.",
        outcome: "Ancillary purchase and booking servicing completed conversationally in Bahasa with payment in-channel, turning a cost contact into a revenue one.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Reservations/ancillary system", "Payment gateway", "Baggage policy source", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile app and website for booking, check-in and booking management",
        "A call centre and WhatsApp customer-service channel",
        "SMS and email notification for schedule changes",
        "Airport service counters handling disruption and baggage in person",
      ],
      gaps: [
        "Disruption notification does not carry actionable rebooking options",
        "Passengers cannot rebook a disrupted flight conversationally — they must queue",
        "Refund status is invisible between request and payment",
        "Contact capacity is fixed while disruption demand is not, guaranteeing failure on bad days",
      ],
    },
    risks: [
      "Indonesian civil-aviation consumer-protection rules on delay and cancellation compensation define entitlements precisely, so automated statements must derive from an approved policy source and be auditable.",
      "Indonesia's Personal Data Protection Law governs passenger identity and payment data handled conversationally, requiring strict access control.",
      "Passenger service system integration depth determines whether the agent can actually rebook or merely inform — a constraint that must be established before the business case is fixed.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions covering baseline servicing contacts plus disruption-driven spikes across a domestic LCC network; validate against the airline's contact-centre and irregular-operations reporting.",
    },
    pilotScope:
      "A Scale-scope pilot on proactive disruption notification with in-channel rebooking for selected domestic routes over WhatsApp and voice in Bahasa, integrated to the reservations system and schedule feed, measured on call-spike suppression and rebookings completed without an agent.",
    expansion: [
      "Add refund and compensation status handling with policy-consistent entitlement explanations",
      "Extend to baggage and ancillary purchase conversations to convert service contacts into revenue",
      "Coordinate with Garuda Indonesia for a group-wide disruption communications layer",
    ],
    stakeholders: [
      "Director of Commercial",
      "Head of Customer Care / Contact Centre",
      "Head of Ground Operations",
      "Head of Information Technology",
      "Head of Revenue Management and Ancillary",
    ],
    discovery: [
      "What does contact volume look like on a major disruption day compared with a normal day, and how is the roster flexed?",
      "Can the passenger service system accept rebooking transactions via API, or is rebooking agent-only today?",
      "What is the current refund cycle time, and how many contacts does one refund case generate?",
      "What financial capacity exists post-restructuring, and does the group need to approve an operating-expense platform commitment?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A Citilink passenger whose Surabaya flight is cancelled by weather receives three alternative flights on WhatsApp in Bahasa and confirms a seat before reaching the airport counter.",
  },

  "siloam-hospitals": {
    operatingContext:
      "Siloam Hospitals is Indonesia's largest private hospital group, affiliated with the Lippo group and operating around forty hospitals spanning tertiary referral centres in Jakarta and Surabaya through to secondary-city hospitals across Java, Sumatra, Sulawesi and beyond. It handles millions of outpatient visits annually across a payer mix that combines self-pay patients, private insurance and corporate schemes, and BPJS Kesehatan national health-insurance patients whose eligibility and referral rules differ entirely from private ones. That mix is what makes its contact load distinctive: every booking conversation carries an implicit eligibility and payment question. Patients reach the group through hospital call centres, a patient app, WhatsApp and physical registration counters, in Bahasa Indonesia with English at the international-facing hospitals, and the dominant contact drivers are appointment booking, doctor-schedule enquiries, queue status and insurance verification.",
    strategicPressure: [
      { text: "Siloam operates a large multi-hospital network across many Indonesian cities, which means scheduling systems, call centres and patient-communication practices vary by site unless deliberately centralised.", kind: "verified" },
      { text: "The BPJS Kesehatan payer environment imposes referral, eligibility and coverage rules that patients cannot self-assess, converting a large share of booking enquiries into verification conversations.", kind: "verified" },
      { text: "Specialist doctor schedules change frequently and are the single highest-frequency enquiry in Indonesian private hospitals, and phone-only access to that information wastes both patient and staff time.", kind: "inference" },
      { text: "No-show rates on outpatient appointments are likely material and largely unmanaged beyond ad-hoc reminders, representing recoverable capacity that funds the deployment on its own.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Hospital groups invest in clinical systems, medical equipment and facilities; their IT functions run hospital information systems and integrations rather than building conversational platforms. Siloam has no platform-engineering organisation and, like hospital operators everywhere, acquires patient-communication technology from vendors.",
    whyNotBuild:
      "Clinical-adjacent conversation carries real safety obligations — an agent that answers a medical question it should have escalated is a patient-safety incident, not a service failure. Building would require Bahasa speech, scheduling orchestration across multiple hospital systems, strict clinical-boundary enforcement, and evaluation of every conversation for safety and privacy. Hospital groups universally buy this class of capability precisely because the accountability needs to sit with a vendor that specialises in it.",
    workflows: [
      {
        name: "Appointment booking and doctor-schedule enquiries",
        friction: "Patients call a hospital switchboard to ask which specialist is available when, are put on hold while staff check a schedule, and often cannot book at all outside office hours — lines are busiest at opening.",
        outcome: "Live specialist schedules offered and appointments booked conversationally in Bahasa at any hour across hospitals, with the right site and doctor matched to the patient's need and location.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Hospital information system", "Appointment scheduling", "Doctor roster system", "Patient master index"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Appointment reminders and no-show reduction",
        friction: "Booked slots are lost to no-shows with only inconsistent reminder practices, and patients who cannot attend have no easy way to release a slot that another patient needs.",
        outcome: "Confirmation and reminder conversations with one-tap reschedule that both reduce no-shows and recycle released slots to waiting patients, recovering clinical capacity already paid for.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Appointment scheduling", "Notification platform", "Patient master index", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Insurance and BPJS eligibility pre-verification",
        friction: "Patients arrive without the right referral or with coverage assumptions that prove wrong, causing registration-desk disputes, delayed treatment and administrative rework at the point of care.",
        outcome: "Coverage, referral requirements and expected out-of-pocket explained conversationally before the visit, with documentation requirements confirmed so patients arrive prepared.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Hospital information system", "Payer/insurance eligibility integration", "BPJS referral data", "Patient master index"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A patient app and website with appointment booking for participating hospitals",
        "Hospital-level call centres handling booking and enquiries",
        "WhatsApp customer-service channels at some hospitals",
        "SMS appointment confirmations and reminders",
      ],
      gaps: [
        "Patients cannot book or reschedule outside call-centre hours in most cases",
        "Doctor schedule changes are not proactively communicated to affected patients",
        "Insurance and BPJS eligibility cannot be verified before arriving at the hospital",
        "Booking experience and information quality vary by hospital rather than being uniform",
      ],
    },
    risks: [
      "Indonesian health-information confidentiality rules and the Personal Data Protection Law impose strict controls on patient data, requiring that transcripts and health information be tightly access-controlled and retained lawfully.",
      "Clinical-boundary enforcement is mandatory: any symptom, triage or medication question must route to qualified staff, and the guardrail must be demonstrable, not aspirational.",
      "BPJS referral and eligibility rules change and vary by region, so grounding sources must be authoritative and version-controlled or the agent will give wrong coverage answers.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Seller assumptions derived from outpatient visit volume across a large hospital network and typical booking-contact ratios; actual call volumes, no-show rates and cost per contact must come from hospital operations data.",
    },
    pilotScope:
      "A Scale-scope pilot on appointment booking, doctor-schedule enquiries and reminder-driven no-show reduction across a selected group of hospitals over WhatsApp and voice in Bahasa, integrated to the scheduling system, measured on bookings completed without staff and no-show rate change.",
    expansion: [
      "Add insurance and BPJS eligibility pre-verification before the visit",
      "Extend across the full hospital network with site-specific scheduling and roster grounding",
      "Introduce post-visit follow-up, care-instruction delivery and feedback capture",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Patient Experience",
      "Head of Hospital Operations / Network Director",
      "Chief Information Officer",
      "Head of Revenue Cycle / Payer Relations",
    ],
    discovery: [
      "Are scheduling systems and call centres centralised at group level or run per hospital?",
      "What is the current outpatient no-show rate, and what would a percentage-point reduction be worth in recovered capacity?",
      "How is BPJS and insurance eligibility checked today, and could that be queried before a visit?",
      "What clinical-safety boundaries would the medical committee require before approving an automated patient-facing agent?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Palembang books a cardiology appointment on WhatsApp at 10pm, learns exactly which BPJS referral document she needs, and arrives with it in hand.",
  },

  "mitra-keluarga": {
    operatingContext:
      "Mitra Keluarga is a listed Indonesian private hospital operator running roughly thirty hospitals concentrated in Greater Jakarta, West Java and Surabaya, and it is known among Indonesian healthcare investors for disciplined cost control and high occupancy rather than aggressive geographic expansion. Its model is a community and family hospital positioning — outpatient-heavy, with strong repeat relationships and a payer mix spanning self-pay, private insurance, corporate schemes and BPJS. Its contact load is therefore dominated by outpatient scheduling: which doctor practises when, how long the queue is today, whether a referral is needed, and what a visit will cost. Patients reach the hospitals through hospital phone lines, a patient app, WhatsApp and registration counters, almost entirely in Bahasa Indonesia.",
    strategicPressure: [
      { text: "Mitra Keluarga's investor reputation rests on operating discipline and margin, so any customer-experience investment must present as a cost and capacity story rather than a service aspiration.", kind: "verified" },
      { text: "Outpatient-heavy hospital economics make clinic-slot utilisation the primary throughput lever, which makes no-show reduction a direct revenue mechanism rather than a soft benefit.", kind: "inference" },
      { text: "Concentration in Greater Jakarta means competition for outpatient volume against other private groups is intense, and booking convenience is a genuine choice factor for repeat patients.", kind: "inference" },
      { text: "Queue-status enquiries — how long until my turn — are probably a large, entirely automatable contact category unique to the Indonesian outpatient model.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A cost-disciplined hospital operator invests in clinical capability and facility productivity, not software engineering. Its IT function runs hospital information and scheduling systems; conversational capability will be procured with a clearly modelled payback.",
    whyNotBuild:
      "There is no engineering organisation, and building would require Bahasa speech, scheduling orchestration, clinical-boundary enforcement and privacy-grade evaluation — four specialist capabilities that a lean operator would never fund. The right-to-win is a payback case the CFO can verify: recovered clinic slots from lower no-shows plus released registration-desk labour, measurable within a single quarter.",
    workflows: [
      {
        name: "Outpatient appointment booking and rescheduling",
        friction: "Booking lines are busiest at opening, staff check doctor schedules manually while callers wait, and patients who need to move an appointment call again and requeue.",
        outcome: "Appointments booked and rescheduled conversationally against live schedules at any hour, freeing registration and phone staff and capturing bookings that currently abandon in a busy signal.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Hospital information system", "Appointment scheduling", "Doctor roster", "Patient master index"],
        value: 3,
        complexity: 2,
      },
      {
        name: "No-show reduction through reminder sequences",
        friction: "Clinic slots are lost daily to patients who do not arrive and do not cancel, with reminders inconsistent and no mechanism to offer the released slot to someone else.",
        outcome: "Timed reminder conversations with one-tap confirm or reschedule, and released slots recycled to waiting patients — turning lost capacity into billed visits.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Appointment scheduling", "Notification platform", "Patient master index", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Queue status and visit-preparation guidance",
        friction: "Patients call the hospital to ask how far the queue has progressed and what documents or fasting requirements apply, tying up phone lines with questions that repeat identically all day.",
        outcome: "Live queue position and preparation instructions delivered conversationally, so patients arrive at the right time prepared, smoothing clinic flow and cutting waiting-area crowding.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Queue management system", "Appointment scheduling", "Clinical preparation protocols", "Patient master index"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A patient app and website with appointment booking",
        "Hospital call centres handling booking and general enquiries",
        "SMS appointment confirmation and reminder messaging",
        "Registration counters handling walk-in and insurance verification",
      ],
      gaps: [
        "Booking outside call-centre hours depends entirely on the app, which many patients do not use",
        "No-shows are not systematically prevented or recycled into other bookings",
        "Queue status requires a phone call to the hospital",
        "Visit-preparation instructions are given verbally at booking and frequently forgotten",
      ],
    },
    risks: [
      "Indonesian patient-confidentiality rules and the Personal Data Protection Law require strict handling of appointment and health data in any conversational channel.",
      "Clinical-boundary enforcement is mandatory — symptom and medication questions must route to qualified staff with a demonstrable guardrail.",
      "Scheduling and queue systems must expose real-time state; if the agent quotes stale queue positions it will create more contact volume than it removes.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.7,
      automationRate: 0.55,
      basis: "Seller assumptions based on outpatient visit volume across the hospital network and typical booking-contact ratios; validate call volumes, no-show rate and registration staffing cost in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on outpatient appointment booking plus reminder-driven no-show reduction at a selected group of hospitals over WhatsApp and voice in Bahasa, integrated to the scheduling system, measured on no-show rate and bookings handled without staff.",
    expansion: [
      "Add queue-status and visit-preparation guidance to smooth clinic flow",
      "Extend across the full hospital network with per-site roster grounding",
      "Introduce post-visit follow-up and feedback capture tied to clinical protocols",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Hospital Operations",
      "Head of Patient Relations",
      "Head of Information Technology",
      "Chief Financial Officer",
    ],
    discovery: [
      "What is the current outpatient no-show rate, and what is the marginal revenue of a recovered clinic slot?",
      "How many booking calls does the network handle monthly, and what proportion abandon at peak?",
      "Are the hospital information and scheduling systems capable of real-time API access to slots and queue state?",
      "What clinical governance approval would a patient-facing automated agent require?",
    ],
    flowTemplate: "appointments",
    scenario: "A Mitra Keluarga patient in Bekasi confirms tomorrow's paediatric appointment on WhatsApp, is told to bring the immunisation record, and her cancelled slot goes to another family that afternoon.",
  },

  "kimia-farma": {
    operatingContext:
      "Kimia Farma is Indonesia's state-owned pharmaceutical company, spanning drug manufacturing, distribution, and one of the country's largest retail pharmacy networks with a thousand-plus outlets, complemented by clinics and diagnostic laboratories. That vertical integration makes it a rare organisation that touches patients at manufacture, distribution and point of dispensing. Its customer-facing conversations are correspondingly varied: prescription readiness and stock availability at specific pharmacies, product and dosage enquiries that must be handled within pharmacovigilance constraints, clinic and laboratory appointment booking, and test-result availability. Its customers are mass-market Indonesian patients reaching outlets by phone, walk-in, WhatsApp and an online pharmacy channel, in Bahasa Indonesia. As a state-owned enterprise it has been working through financial restructuring, which shapes both budget availability and procurement behaviour.",
    strategicPressure: [
      { text: "As a state-owned enterprise Kimia Farma procures technology through structured processes tied to SOE governance and budget cycles rather than discretionary purchasing.", kind: "verified" },
      { text: "The company has been under financial repair pressure, which makes any investment case dependent on demonstrable near-term cost reduction rather than strategic positioning.", kind: "verified" },
      { text: "A thousand-plus outlet network means stock and prescription enquiries are answered locally by pharmacy staff with no central visibility, so the same question is answered inconsistently thousands of times a day.", kind: "inference" },
      { text: "Laboratory result availability and clinic booking are probably the most automatable high-frequency contacts, and are organisationally separable from the more regulated medicine-information conversations.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Kimia Farma is a manufacturing, distribution and retail pharmacy operator under SOE governance, with technology procured through tender processes. It has no platform-engineering function and, under financial restructuring, no capacity to fund one.",
    whyNotBuild:
      "Pharmaceutical customer conversation is regulated territory: medicine information, adverse-event reporting and dispensing rules all carry compliance obligations. Building would require Bahasa speech, orchestration across pharmacy, clinic and lab systems, hard clinical and pharmacovigilance boundaries, and full conversation evaluation — an infrastructure programme an SOE under financial repair cannot fund or staff. The right-to-win is delivering the guardrails as configured policy with evidence, not as something the customer must invent.",
    workflows: [
      {
        name: "Prescription readiness and pharmacy stock enquiries",
        friction: "Patients phone individual pharmacies to ask whether a medicine is in stock or whether a prescription is ready, and staff leave the dispensing counter to check while other customers wait.",
        outcome: "Stock and prescription-readiness answers delivered conversationally from central systems with nearest-alternative-outlet suggestions, removing counter interruptions across the entire network.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Pharmacy inventory system", "Prescription management", "Outlet master data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Clinic and laboratory appointment booking with result notification",
        friction: "Clinic and lab appointments are booked by phone during office hours, and patients call repeatedly to ask whether test results are ready — a purely status-driven contact category.",
        outcome: "Appointments booked conversationally against live slots and result-ready notifications pushed automatically, with results themselves delivered only through appropriately secured channels.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Clinic scheduling system", "Laboratory information system", "Patient records", "Notification platform"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Product information with pharmacovigilance-compliant escalation",
        friction: "Consumers ask about dosage, interactions and side effects wherever they can reach the company, and answers depend on individual staff knowledge with no reliable capture of adverse-event reports.",
        outcome: "Strictly bounded, approved product information with any symptom, dosage-judgement or adverse-event signal routed immediately to a qualified pharmacist and captured as a structured pharmacovigilance record.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Approved product information repository", "Pharmacovigilance case system", "Pharmacist escalation queue", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A retail pharmacy network with in-store pharmacist consultation",
        "An online pharmacy and e-commerce ordering channel",
        "Clinic and laboratory services with phone-based appointment booking",
        "Social-media and WhatsApp customer enquiry channels",
      ],
      gaps: [
        "Stock availability at a specific outlet cannot be confirmed remotely",
        "Patients must call repeatedly to learn whether lab results are ready",
        "Adverse-event and product-safety signals arriving through customer channels are not systematically captured",
        "Product information answers vary by whoever responds, with no governed source",
      ],
    },
    risks: [
      "Indonesian pharmaceutical regulation and pharmacovigilance obligations require that adverse-event signals be captured and reported, so escalation and record-keeping are compliance requirements rather than features.",
      "Health-data handling under the Personal Data Protection Law constrains how prescription, laboratory and patient information may be processed and delivered in conversational channels.",
      "SOE procurement and financial-restructuring constraints mean the commercial structure matters as much as the solution; an operating-expense model with staged scope is more fundable than a capital programme.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.6,
      automationRate: 0.55,
      basis: "Seller assumptions covering pharmacy, clinic and laboratory enquiry volume across a large outlet network; validate against the company's customer-contact and outlet-call reporting in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on pharmacy stock and prescription-readiness enquiries plus clinic appointment booking over WhatsApp in Bahasa for a selected region, integrated to inventory and scheduling systems, measured on outlet-call deflection and bookings handled without staff.",
    expansion: [
      "Add laboratory result-ready notification and secure result delivery",
      "Extend to governed product-information handling with pharmacovigilance escalation",
      "Scale across the full outlet, clinic and laboratory network nationally",
    ],
    stakeholders: [
      "Director of Retail and Distribution",
      "Head of Pharmacy Operations",
      "Head of Clinics and Laboratories",
      "Head of Information Technology",
      "Head of Regulatory Affairs and Pharmacovigilance",
    ],
    discovery: [
      "What is the SOE procurement route for this class of platform, and is there an existing framework it could be bought under?",
      "How many enquiry calls do outlets receive daily, and how much dispensing-counter time do they consume?",
      "How are adverse-event reports captured today when they arrive through customer channels?",
      "Are pharmacy inventory and laboratory systems centrally queryable in real time?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Bandung asks on WhatsApp which nearby Kimia Farma outlet stocks her prescription, reserves it, and is told when her lab result is ready without calling once.",
  },

  "pln": {
    operatingContext:
      "PLN is Indonesia's state electricity utility and effectively a national monopoly on distribution, serving a customer base measured in the tens of millions of connections across the entire archipelago — from Jakarta apartment blocks to village households on prepaid meters. Its customer interface is unusually concentrated: the 123 contact centre and the PLN Mobile app carry an enormous national volume of outage reports, billing disputes, new-connection and capacity-upgrade requests, and prepaid token purchase problems. Prepaid metering is the distinguishing operational fact, since a failed token purchase leaves a household without electricity immediately, making it an urgent contact rather than a billing query. PLN operates through regional distribution units with local field crews, and communications run in Bahasa Indonesia with strong regional-language demand across Java and beyond. Its IT subsidiary ICON+ acts as an internal technology and network provider.",
    strategicPressure: [
      { text: "PLN operates the PLN Mobile app and the 123 contact centre as national customer channels serving tens of millions of connections, making it one of the highest-volume customer-communication operations in Indonesia.", kind: "verified" },
      { text: "Prepaid token failures create immediate loss of electricity supply, so a slow or failed resolution is a service emergency rather than a service inconvenience — and the volume is nationwide.", kind: "verified" },
      { text: "Outage events generate clustered contact spikes in affected regions where thousands of customers report the same fault, and field-crew dispatch information is what they actually want.", kind: "inference" },
      { text: "ICON+ will likely be positioned as the internal integrator on any deployment, which shapes the commercial structure more than it changes the technical requirement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. PLN is an electricity utility whose engineering is in generation, transmission and distribution. ICON+ provides network and IT services but is a telecommunications and systems-integration business, not a conversational-AI platform developer. National-scale customer-facing AI will be procured through SOE tender processes.",
    whyNotBuild:
      "Nothing in PLN's mission is served by owning speech models or conversational orchestration. The requirements — Bahasa plus Javanese and Sundanese voice at national scale, telephony absorbing regional outage spikes, orchestration across billing, metering, outage and dispatch systems, and evaluation of every interaction for a state utility's public accountability — constitute a platform business. PLN buys platforms and integrates them, often with ICON+ as the delivery partner, and that is the realistic route.",
    workflows: [
      {
        name: "Outage reporting and status communication",
        friction: "An area fault generates thousands of near-identical reports into the 123 line and the app; each caller queues to report something already known, and nobody receives a restoration estimate unless they call again.",
        outcome: "Known-outage recognition at hello with restoration estimates given immediately, new fault reports captured with location precision for dispatch, and proactive restoration updates that stop the repeat-call cycle entirely.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Outage management system", "Field dispatch", "Customer/connection master data", "Notification platform"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Prepaid token and billing-dispute resolution",
        friction: "A failed token purchase leaves a household without power, and resolution requires reconciling between PLN, a payment channel and the meter — currently a manual process that can take hours or days while the customer sits in the dark.",
        outcome: "Automated reconciliation-aware resolution that traces the transaction, reissues the token where valid, and explains billing calculations clearly in the customer's language, in minutes rather than days.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Prepaid token/vending system", "Billing system", "Payment channel integration", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "New connection and capacity-upgrade requests",
        friction: "Applications for new connections or capacity changes involve documentation, survey scheduling, payment and installation, with the applicant chasing status through the call centre at each stage.",
        outcome: "Guided application intake with document requirements explained, survey appointments booked conversationally, and proactive status updates at every stage so status-chasing contacts disappear.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Connection application workflow", "Field survey scheduling", "Payment gateway", "Customer master data"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "The PLN Mobile app for outage reporting, token purchase, billing and complaint logging",
        "The 123 national contact centre with IVR and human agents",
        "SMS and app notification for billing and service messages",
        "Regional distribution unit offices and field crews handling faults and connections",
      ],
      gaps: [
        "Outage callers cannot learn whether their fault is already known or when power returns without waiting for an agent",
        "Failed prepaid token transactions require manual reconciliation, leaving households without electricity meanwhile",
        "Connection and upgrade applications require repeated status chasing",
        "Regional-language servicing depends on which agent answers rather than being a channel capability",
      ],
    },
    risks: [
      "SOE procurement rules require formal tender processes with defined evaluation criteria, so commercial structuring and partner positioning matter as much as capability.",
      "Indonesia's Personal Data Protection Law and public-sector data-governance expectations constrain where customer, connection and voice data may be processed, likely requiring in-country hosting.",
      "Bahasa plus Javanese and Sundanese voice quality across a genuinely national and largely non-metropolitan customer base is the decisive technical risk and must be validated with real regional speakers.",
    ],
    economics: {
      volumeMonthly: 8000000,
      costPerInteraction: 0.5,
      automationRate: 0.65,
      basis: "Seller assumptions reflecting national-monopoly scale across tens of millions of connections at low unit cost; PLN's own 123 and app contact statistics must replace these before any business case is presented.",
    },
    pilotScope:
      "A Transform-scope initial deployment focused on outage reporting with known-fault recognition and restoration updates, plus prepaid token failure resolution, on voice and WhatsApp in Bahasa for selected regional distribution units, measured on repeat-call suppression and token-issue resolution time.",
    expansion: [
      "Extend to billing-dispute handling and tariff explanation across all regions",
      "Add new-connection and capacity-upgrade application intake with survey scheduling",
      "Add Javanese and Sundanese language coverage and scale nationally across all distribution units",
    ],
    stakeholders: [
      "Director of Retail and Customer Service",
      "Head of Contact Centre 123 Operations",
      "Head of Distribution Operations",
      "Chief Information Officer / ICON+ leadership",
      "Head of Procurement",
    ],
    discovery: [
      "What is the SOE tender route for a platform of this scale, and would ICON+ be the contracting integrator?",
      "What is the monthly contact volume on 123 and PLN Mobile, and what proportion is outage-related versus billing?",
      "How long does a failed prepaid token transaction currently take to resolve end to end?",
      "What are the data-residency requirements for customer and voice data at a state utility?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A household in rural East Java reports a power cut by voice in Javanese, is told the fault is already known with a restoration estimate, and gets a message when the lights come back.",
  },

  "pgn": {
    operatingContext:
      "PGN is Indonesia's state gas distribution company, operating as a subholding within Pertamina and supplying natural gas through pipeline networks to industrial and commercial customers as well as a growing household connection base concentrated in cities with distribution infrastructure. Its customer profile is unusual for a utility: a relatively small number of large industrial and commercial accounts that generate substantial revenue and contract-level relationships, alongside an expanding household segment where the government's household gas connection programme adds retail-style servicing at scale. Household customers generate billing queries, new-connection requests, meter and payment issues, and — critically — leak and safety reports that must be triaged and dispatched immediately. Communications run through a contact centre, field offices and increasingly WhatsApp, in Bahasa Indonesia.",
    strategicPressure: [
      { text: "PGN operates as a gas subholding within Pertamina, so technology procurement follows state-owned-enterprise governance and group tender processes rather than independent purchasing.", kind: "verified" },
      { text: "Household gas connection expansion converts PGN from a predominantly industrial supplier into a mass-market utility with retail servicing obligations it was not originally built for.", kind: "verified" },
      { text: "Gas leak and safety reports impose an absolute routing requirement — any automated channel must recognise and escalate them instantly, which raises the design bar above ordinary utility servicing.", kind: "inference" },
      { text: "Industrial and commercial accounts probably represent an under-served conversational opportunity, since they interact through account managers whose availability limits routine operational queries.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. PGN is a gas transmission and distribution operator within a state energy group. Its engineering is pipeline and network engineering; customer-facing technology is procured through structured tenders under Pertamina group governance.",
    whyNotBuild:
      "A gas utility has no reason and no capability to build conversational infrastructure. The specific requirement that makes buying decisive is safety routing: an agent that fails to escalate a leak report correctly creates physical risk, and that guardrail must be a proven, evidenced platform capability with a vendor accountable for it — not something an internal team assembles.",
    workflows: [
      {
        name: "Billing enquiries and payment servicing",
        friction: "Household customers call about bill amounts, meter readings, tariff changes and payment confirmation, and each is answered by an agent reading a billing system with volume concentrated around billing cycles.",
        outcome: "Billing calculations explained clearly and payment status confirmed conversationally in Bahasa, absorbing billing-cycle peaks without additional staffing.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Billing system", "Meter reading data", "Payment gateway", "Customer master data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New-connection request intake and status",
        friction: "Households and businesses applying for a gas connection navigate documentation, survey, payment and installation stages with no visibility, chasing status through the contact centre at each step.",
        outcome: "Guided application intake with documentation explained, survey appointments booked conversationally, and proactive stage notifications that eliminate status-chasing contacts.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Connection application workflow", "Field survey scheduling", "Payment gateway", "Customer master data"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Leak and safety report triage with emergency escalation",
        friction: "Safety reports arrive through the same queue as billing calls, so a gas leak report can sit behind routine enquiries at the worst possible moment.",
        outcome: "Safety intent recognised instantly and escalated to emergency dispatch ahead of all other traffic, with location captured precisely and the caller given immediate safety instructions from approved protocol.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Emergency dispatch system", "Network/asset location data", "Approved safety protocol source", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer contact centre handling billing, connection and service enquiries",
        "A customer app and web portal for billing and payment",
        "Field offices and technician crews for installation and fault response",
        "SMS billing notification to household customers",
      ],
      gaps: [
        "Connection application status must be chased rather than being pushed",
        "Safety reports share a queue with routine billing enquiries",
        "Industrial and commercial customers have no self-service path for routine operational queries",
        "Contact volume peaks around billing cycles with no elastic capacity",
      ],
    },
    risks: [
      "Gas safety obligations make emergency-intent recognition and escalation a hard safety requirement with regulatory consequence if it fails, requiring demonstrable and tested guardrails.",
      "SOE and Pertamina group procurement rules govern vendor selection through formal tender processes with defined evaluation criteria.",
      "Indonesia's Personal Data Protection Law and public-sector data-governance expectations constrain the processing and hosting of customer and voice data.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.7,
      automationRate: 0.5,
      basis: "Seller assumptions based on a growing household connection base plus industrial account servicing; validate against PGN's contact-centre reporting and household connection growth plans in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot on household billing enquiries and new-connection request intake over voice and WhatsApp in Bahasa, with mandatory safety-intent recognition and priority escalation built in from day one, measured on containment and connection-status contact reduction.",
    expansion: [
      "Extend safety triage to full emergency-dispatch integration with location capture",
      "Add an industrial and commercial account desk for routine operational queries",
      "Scale across all regional distribution areas as household connections grow",
    ],
    stakeholders: [
      "Director of Commercial / Retail Gas",
      "Head of Customer Service",
      "Head of Distribution Operations and Safety",
      "Head of Information Technology",
      "Head of Procurement",
    ],
    discovery: [
      "What is the household connection growth plan, and how does it translate into projected contact volume?",
      "How are gas safety reports currently identified and prioritised within the contact centre?",
      "What is the Pertamina group tender route for a customer-facing platform, and what is the timeline?",
      "Do industrial and commercial customers have any self-service channel, or is everything through account managers?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A PGN household customer in Surabaya queries an unexpectedly high gas bill on WhatsApp, gets the meter reading and calculation explained, and pays in the same thread.",
  },

  "jne": {
    operatingContext:
      "JNE is Indonesia's largest homegrown courier and logistics company, built over decades from a domestic express business into the backbone carrier for a very large share of Indonesian e-commerce and social-commerce parcels, operating through a franchise-heavy agent network with thousands of drop-off and pickup points across the archipelago. Its service model spans regular, express and cargo tiers, plus cash-on-delivery handling that remains central to Indonesian e-commerce and creates settlement and reconciliation conversations no card-based market experiences. Volume peaks brutally around Harbolnas and other national sale events, and its contact load is dominated by where-is-my-order enquiries from recipients, failed-delivery rescheduling, claims for damaged or lost parcels, and COD remittance questions from shippers — all in Bahasa Indonesia across WhatsApp, a call centre, agent counters and social channels.",
    strategicPressure: [
      { text: "JNE is one of Indonesia's largest domestic couriers with a nationwide agent network, and its parcel volumes are tied directly to e-commerce sale events that produce extreme seasonal peaks.", kind: "verified" },
      { text: "Cash-on-delivery remains a significant payment method in Indonesian e-commerce, generating remittance and reconciliation conversations with shippers that pure-tracking couriers in card markets never face.", kind: "verified" },
      { text: "Courier price competition in Indonesia has compressed margins severely, so per-contact servicing cost is a direct profitability lever rather than a service-quality question.", kind: "inference" },
      { text: "A franchise agent network means service quality and information consistency vary by counter, and a central conversational layer is the only practical way to standardise the customer answer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. JNE is a logistics operator whose technology investment goes into sortation, routing and tracking systems. It has no conversational-platform engineering capability, and a family-built logistics business under margin pressure buys operational technology rather than developing it.",
    whyNotBuild:
      "Building would require Bahasa speech across a national and largely non-metropolitan recipient base, telephony and messaging capacity that survives a Harbolnas spike, orchestration across tracking, last-mile and COD settlement systems, and evaluation at very high volume. None of that improves a parcel's journey. The right-to-win is absorbing peak volume elastically — the one thing a headcount-based service model structurally cannot do.",
    workflows: [
      {
        name: "Where-is-my-order deflection with live tracking grounding",
        friction: "Recipients see a tracking page that has not updated and immediately contact by WhatsApp or phone; agents read the same stale status, and at sale-event peaks queues collapse entirely.",
        outcome: "Live status from tracking and last-mile feeds explained in plain Bahasa with a realistic delivery expectation, absorbing peak volume without a queue and removing the largest contact category outright.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Tracking system", "Last-mile/courier scan feed", "Shipment master data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Failed-delivery rescheduling and address correction",
        friction: "A missed delivery becomes a second attempt and often a return-to-origin, because the recipient has no way to fix an address or pick a time without reaching an agent who then emails the branch.",
        outcome: "Recipients messaged proactively when delivery is at risk, with rescheduling, address correction or agent-point redirection executed directly into the operational system — cutting return-to-origin cost.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Delivery operations system", "Courier routing", "Agent-point network data", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Shipper claims intake and COD remittance queries",
        friction: "Sellers chase COD remittance amounts and file damage or loss claims through email and counters, with documentation requirements explained inconsistently and claim status invisible until settlement.",
        outcome: "Structured claims intake with documentation validated in-conversation and COD remittance positions answered from settlement systems, with proactive status updates replacing chase contacts.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Claims management", "COD settlement/reconciliation", "Shipper account system", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online and app-based parcel tracking for recipients and shippers",
        "A national call centre plus WhatsApp and social customer service",
        "A large franchise agent network acting as physical service points",
        "SMS and app notifications for delivery events",
      ],
      gaps: [
        "Tracking pages show scan events but do not answer the actual question of when a parcel arrives",
        "Recipients cannot reschedule a delivery or correct an address without an agent",
        "Claim documentation requirements are explained inconsistently, causing rejection cycles",
        "COD remittance queries require manual reconciliation before a shipper gets an answer",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs recipient contact and address data used in proactive delivery communications, requiring lawful basis and controlled sharing with the shipper.",
      "COD settlement involves funds handling, so automated statements about remittance amounts and timing must be grounded in authoritative settlement records and be auditable.",
      "Bahasa voice and messaging quality across a national recipient base including remote districts is decisive; a Jakarta-tuned agent will fail on the parcels that most need rescheduling.",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 0.5,
      automationRate: 0.65,
      basis: "Seller assumptions reflecting very high parcel volumes converting to contacts at a low rate but enormous absolute count with sale-event peaks; validate against JNE's own contact and parcel statistics in discovery.",
    },
    pilotScope:
      "A Scale-scope pilot on where-is-my-order deflection and failed-delivery rescheduling over WhatsApp in Bahasa, integrated to the tracking and delivery operations systems, measured through a sale-event peak on contact deflection and return-to-origin rate.",
    expansion: [
      "Add proactive exception notification before recipients contact at all",
      "Extend to shipper claims intake with in-conversation documentation validation",
      "Add COD remittance query handling grounded in settlement records",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Service",
      "Head of Last-Mile Operations",
      "Head of Information Technology",
      "Head of Sales / Key Shipper Accounts",
    ],
    discovery: [
      "How mature are the tracking system APIs, and can they be queried in real time at peak volume?",
      "What is the current return-to-origin rate, and what does an RTO parcel cost?",
      "How does contact volume behave during Harbolnas compared with a normal week?",
      "How are COD remittance queries handled today, and how long do they take to answer?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A JNE recipient in Yogyakarta whose parcel missed its first delivery attempt reschedules on WhatsApp for Saturday morning, and the courier arrives instead of the parcel going back to origin.",
  },

  "jt-express-indonesia": {
    operatingContext:
      "J&T Express is a Hong Kong-listed express delivery group whose Indonesian operation is one of the country's highest-volume parcel networks, grown on the back of deep integration with e-commerce and social-commerce platforms rather than a legacy courier heritage. Its operating model is technology-forward by courier standards — automated sortation, network optimisation and platform API integration are core investments — and its regional and China-based technology organisation drives system standards across markets. In Indonesia it moves enormous daily parcel volumes across an archipelago network with cash-on-delivery still material. The gap that persists despite the technology investment is on the recipient side: rescheduling, where-is-my-order and COD conversations in local language remain human-served or handled by generic messaging that does not resolve anything.",
    strategicPressure: [
      { text: "J&T Express is a listed express-delivery group with substantial technology investment and centralised regional systems, which shapes what an Indonesian country deployment can decide locally.", kind: "verified" },
      { text: "Parcel volume driven by e-commerce platform partnerships makes contact volume a function of platform sale calendars, producing extreme and predictable peaks.", kind: "verified" },
      { text: "Automation strength in sortation and routing has not translated into recipient-side conversational capability, because the latter requires local-language speech and messaging rather than network engineering.", kind: "inference" },
      { text: "The commercial question is whether Indonesia can select a local capability at all, or whether recipient CX tooling is mandated by the regional technology organisation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. J&T automates aggressively in-house and will not accept a packaged CX suite that duplicates systems it already owns. The realistic motion is co-building recipient-side conversational capability — Bahasa speech and messaging, grounding against its own tracking and delivery systems, and evaluation — on Google Cloud infrastructure, with J&T's technology organisation owning integration.",
    whyNotBuild:
      "J&T will build the integration and probably the orchestration. What it has not built and is unlikely to build is production Bahasa speech tuned to Indonesian recipients across regional accents, plus a rigorous per-conversation evaluation layer. Its engineering priority is network throughput and platform integration, and local-language conversational quality is a specialist capability its regional technology organisation has little incentive to develop for one market.",
    workflows: [
      {
        name: "Recipient delivery-exception conversations",
        friction: "When delivery fails or an address is wrong, the recipient receives an SMS or app notification with no way to respond usefully, so the parcel is re-attempted blindly or returned.",
        outcome: "Two-way conversation in Bahasa at the moment of exception, with rescheduling, address correction or drop-point redirection executed directly into the delivery system, cutting failed attempts and returns.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Delivery operations system", "Courier routing", "Drop-point network data", "Tracking system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Where-is-my-order handling in local language",
        friction: "Recipients contact through app chat and social channels asking when a parcel arrives; automated replies restate scan events rather than answering the question, so a human ends up answering anyway.",
        outcome: "Grounded, plain-language delivery expectations in Bahasa that actually answer the question, absorbing platform-sale peaks without human queues.",
        channels: ["App chat", "WhatsApp", "Social messaging"],
        systems: ["Tracking system", "Last-mile scan feed", "Shipment master data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "COD reconciliation and seller support",
        friction: "Sellers query COD remittance amounts and parcel-level settlement discrepancies, requiring manual reconciliation between delivery records and finance systems before anyone can answer.",
        outcome: "Settlement-grounded answers on COD positions and discrepancies delivered conversationally to sellers, with genuine disputes escalated as structured cases.",
        channels: ["WhatsApp", "Seller portal chat", "Email"],
        systems: ["COD settlement/reconciliation", "Seller account system", "Delivery records", "Finance systems"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "App and web parcel tracking with scan-event history",
        "Automated delivery notifications by SMS and app push",
        "In-app and social-channel customer support",
        "Deep API integration with e-commerce platform partners",
      ],
      gaps: [
        "Recipients cannot reschedule or redirect a delivery conversationally",
        "Automated notifications restate scan events rather than answering when a parcel will arrive",
        "COD settlement discrepancies require manual reconciliation before a seller gets an answer",
        "There is no local-language voice channel for recipients without smartphone access",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs recipient contact data shared between platform, courier and seller, requiring purpose limitation and controlled access.",
      "Regional technology-organisation mandates may constrain what the Indonesian entity can select independently, so decision rights must be established before pursuit investment.",
      "As a co-build, delivery depends on the customer's own engineering priorities and peak-season freeze windows, so scope must be tightly bounded to primitives.",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 0.4,
      automationRate: 0.65,
      basis: "Seller assumptions reflecting very high parcel volumes with a low contact rate and aggressive existing automation; actual contact volume, current automation coverage and cost per contact must come from J&T's operations data.",
    },
    pilotScope:
      "A Launch-scope co-build pilot on recipient delivery-exception conversations in Bahasa over WhatsApp for a defined city cluster, with J&T owning delivery-system integration and the platform providing speech, conversational grounding and evaluation.",
    expansion: [
      "Extend where-is-my-order handling in local language across app and social channels",
      "Add a Bahasa voice channel for recipients without reliable messaging access",
      "Introduce COD reconciliation and seller-support conversations grounded in settlement data",
    ],
    stakeholders: [
      "Country Chief Executive / Country Operations Head",
      "Head of Customer Experience",
      "Head of Technology (Indonesia)",
      "Head of Last-Mile Operations",
      "Regional Technology Organisation counterpart",
    ],
    discovery: [
      "How much CX automation is mandated by the regional or China technology organisation versus decided in Indonesia?",
      "What is the current failed-first-attempt rate, and what does a re-attempt or return cost?",
      "What proportion of recipient contacts are answered by existing automation versus a human today?",
      "Which delivery-system actions can an external agent invoke, and what are the API constraints at peak volume?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A J&T recipient in Bandung tells the agent on WhatsApp in Bahasa to leave tomorrow's parcel at a nearby drop point, and the routing changes before the courier sets out.",
  },

  "sicepat": {
    operatingContext:
      "SiCepat Ekspres is an Indonesian courier that grew rapidly with the country's e-commerce and social-commerce boom, positioning on delivery speed and competitive pricing to win volume from online sellers and marketplace platforms. Its network spans agent points and delivery hubs across Java and the wider archipelago, serving a shipper base that skews heavily toward small and medium online sellers rather than large enterprise accounts — a customer type that is highly price-sensitive, contacts frequently, and switches couriers readily. Cash-on-delivery volume adds remittance and reconciliation conversations to the standard courier contact mix. Its service load therefore has two distinct populations: sellers chasing COD settlements and filing claims, and recipients asking where parcels are and rescheduling deliveries, all in Bahasa Indonesia through WhatsApp, a call centre and agent counters.",
    strategicPressure: [
      { text: "Indonesian courier price competition has compressed margins severely across the sector, making per-contact service cost a direct determinant of whether volume is profitable.", kind: "verified" },
      { text: "A shipper base of small online sellers contacts far more frequently per parcel than enterprise shippers do, and is also the most likely to switch on a bad service experience.", kind: "inference" },
      { text: "COD remittance disputes are a structural cost and trust issue for couriers serving small sellers, since the seller's cash flow depends on settlement accuracy and speed.", kind: "inference" },
      { text: "Financial capacity to fund a platform subscription is the primary qualification risk, so the commercial model must be usage-linked and payback-provable within a quarter.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. SiCepat is an operations-led courier competing on price and speed, without platform-engineering capability. Under margin pressure it will buy a capability with a demonstrable per-contact cost reduction rather than fund internal development.",
    whyNotBuild:
      "A price-competing courier cannot afford to divert capital into Bahasa speech engineering, telephony, orchestration and evaluation, and would gain nothing competitive from owning them. The right-to-win is a cost-per-contact reduction that flows straight to margin in a business where margin is the entire strategic problem.",
    workflows: [
      {
        name: "Seller claims intake for damaged and lost parcels",
        friction: "Small sellers file claims through WhatsApp and email with inconsistent documentation, get rejected for missing evidence, and resubmit — each cycle burning goodwill in a relationship that is already price-fragile.",
        outcome: "Structured claim intake with evidence requirements explained and validated in-conversation, so claims arrive complete, are settled faster, and stop consuming repeat contacts.",
        channels: ["WhatsApp", "Voice", "Seller portal chat"],
        systems: ["Claims management", "Shipment records", "Shipper account system", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Recipient where-is-my-order and rescheduling",
        friction: "Recipients contact for status when tracking is stale and have no way to reschedule a missed delivery, so parcels are re-attempted blindly or returned at the courier's cost.",
        outcome: "Live status explained in plain Bahasa with rescheduling and drop-point redirection executed directly, cutting re-attempts and returns that destroy the economics of a low-price delivery.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Tracking system", "Delivery operations", "Agent-point network data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "COD remittance query handling for sellers",
        friction: "Sellers ask when COD funds will land and why an amount differs from expected, requiring manual reconciliation across delivery and finance records before anyone can respond.",
        outcome: "Settlement-grounded remittance answers delivered instantly with discrepancies explained parcel by parcel, and genuine disputes escalated as structured cases with evidence attached.",
        channels: ["WhatsApp", "Seller portal chat", "Voice"],
        systems: ["COD settlement/reconciliation", "Finance systems", "Shipment records", "Shipper account system"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online and app parcel tracking for shippers and recipients",
        "WhatsApp and call-centre customer service",
        "A seller-facing portal for shipment booking and account management",
        "An agent-point network serving as physical drop and pickup locations",
      ],
      gaps: [
        "Claim documentation requirements are explained inconsistently, causing rejection cycles",
        "Recipients cannot reschedule a delivery conversationally",
        "COD remittance questions require manual reconciliation before an answer",
        "No proactive communication when a delivery is at risk of failing",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law governs recipient and seller data used in service and proactive communications, requiring lawful basis and controlled sharing.",
      "COD settlement statements involve funds, so automated answers must be grounded in authoritative reconciliation records and fully auditable.",
      "Financial capacity is a genuine commercial risk — the pricing model must be usage-linked so cost scales with the volume it serves rather than being a fixed commitment.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.5,
      automationRate: 0.6,
      basis: "Seller assumptions covering combined seller and recipient contact volume across the parcel network; validate contact rates per parcel and current service cost against SiCepat's operations reporting.",
    },
    pilotScope:
      "A Launch-scope pilot on recipient where-is-my-order deflection and delivery rescheduling over WhatsApp in Bahasa, integrated to tracking and delivery operations, measured on contact deflection and failed-delivery reduction with a per-contact cost comparison.",
    expansion: [
      "Add seller claims intake with in-conversation evidence validation",
      "Extend to COD remittance query handling grounded in settlement records",
      "Introduce proactive at-risk delivery notification before recipients contact",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Service",
      "Head of Seller Relations / Commercial",
      "Head of Information Technology",
      "Chief Financial Officer",
    ],
    discovery: [
      "What is the current contact rate per parcel, and how does it split between sellers and recipients?",
      "What proportion of claims are rejected on first submission for documentation reasons?",
      "What does a failed first delivery attempt cost, and what is the current re-attempt rate?",
      "What commercial model would fit the company's current financial position — fixed subscription or usage-linked?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A SiCepat seller in Solo files a damaged-parcel claim on WhatsApp, is told exactly which photos are needed as she sends them, and the claim is accepted first time.",
  },

  "pos-indonesia": {
    operatingContext:
      "Pos Indonesia is the state postal operator, reinventing a legacy letter-and-remittance business around e-commerce parcels, government social-benefit distribution, and the Pospay digital financial application. Its outlet and agent network reaches into districts and villages where private couriers and banks have limited presence, which is precisely why the government uses it to disburse social-assistance programmes to millions of beneficiaries. That role defines its most distinctive contact load: beneficiaries asking whether and when their assistance payment is available, where to collect it, and what documents they need — from a population that is frequently older, rural, less digitally confident, and speaking Bahasa Indonesia alongside Javanese and other regional languages. Parcel tracking and Pospay support layer on top, reaching customers through outlets, a call centre, WhatsApp and SMS.",
    strategicPressure: [
      { text: "Pos Indonesia's role in distributing government social-assistance payments gives it a beneficiary-servicing obligation to a mass, largely rural population that no app-based channel can serve.", kind: "verified" },
      { text: "As a state-owned enterprise it procures technology through structured processes and carries public-service obligations that shape service-level expectations independent of commercial return.", kind: "verified" },
      { text: "Benefit disbursement follows a payout calendar, producing extreme, predictable contact spikes at outlets and on phone lines in the days around each distribution cycle.", kind: "inference" },
      { text: "Voice in regional languages is the only channel that genuinely reaches the beneficiary population, which makes speech quality the entire feasibility question for this account.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A state postal operator is definitionally a platform buyer: its technology comes through SOE procurement, its engineering capability is logistics and outlet systems, and it has no conversational-AI development capacity.",
    whyNotBuild:
      "Pos Indonesia's transformation agenda is about making parcels and financial services work operationally, not about building AI infrastructure. Regional-language speech at the quality required by an elderly rural beneficiary population is a specialist capability that even large technology companies find difficult, and an SOE assembling it internally would fail expensively and publicly.",
    workflows: [
      {
        name: "Social-benefit disbursement status and collection guidance",
        friction: "Beneficiaries queue at outlets or call to ask whether their payment has been released, where to collect it and what identity documents are needed, with volume spiking around every payout cycle and outlets overwhelmed.",
        outcome: "Payment availability, collection location and document requirements answered by voice in Bahasa or the beneficiary's regional language, plus proactive payment-ready notification that flattens the outlet queue.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Benefit disbursement system", "Beneficiary registry", "Outlet master data", "Notification platform"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Parcel tracking and delivery enquiries",
        friction: "Recipients in areas served mainly by the postal network have limited digital tracking habits and phone outlets or the call centre for status, with answers depending on which staff member checks.",
        outcome: "Live parcel status and delivery expectations delivered conversationally in local language, with rescheduling or outlet-collection arrangements made in the same conversation.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Parcel tracking system", "Delivery operations", "Outlet master data", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Pospay account and transaction support",
        friction: "Pospay users encounter failed transfers, blocked access and top-up issues and must visit an outlet or call, since the app's self-service is not usable for the demographic most likely to have problems.",
        outcome: "Account and transaction support delivered by voice in local languages with identity verified conversationally, resolving issues without an outlet visit for customers who may live hours away.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Pospay platform", "Transaction ledger", "Authentication service", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A nationwide outlet and agent network reaching rural districts",
        "Parcel tracking through web and app channels",
        "The Pospay application for digital financial services",
        "A call centre and SMS notification for service messages",
      ],
      gaps: [
        "Beneficiaries have no way to check payment availability without visiting or calling an outlet",
        "No servicing channel operates in the regional languages the beneficiary population actually speaks",
        "Nothing proactively notifies beneficiaries when a payment is ready for collection",
        "Pospay support for less digitally confident users effectively requires a physical visit",
      ],
    },
    risks: [
      "Indonesia's Personal Data Protection Law and public-sector data-governance rules apply to beneficiary data, which is both sensitive and politically visible, likely requiring in-country hosting and strict access control.",
      "SOE procurement rules require formal tender processes, and the multi-directorate structure means the customer-experience owner must be identified before a deal can be shaped.",
      "Regional-language voice quality for elderly and rural speakers is the decisive technical risk and must be validated with real beneficiaries before any commitment is made.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.5,
      automationRate: 0.55,
      basis: "Seller assumptions covering benefit-cycle enquiry spikes plus parcel and Pospay contacts; validate against Pos Indonesia's outlet footfall and contact-centre data, which may currently be measured only at outlet level.",
    },
    pilotScope:
      "A Launch-scope pilot on benefit-disbursement status and collection guidance by voice in Bahasa and one regional language for a selected province, integrated to the disbursement system, measured on outlet-queue reduction through a payout cycle.",
    expansion: [
      "Add proactive payment-ready notification ahead of each disbursement cycle",
      "Extend to parcel tracking and delivery enquiries in the same language coverage",
      "Add Pospay account and transaction support with conversational identity verification",
    ],
    stakeholders: [
      "Director of Retail and Government Services",
      "Head of Customer Care",
      "Head of Pospay / Financial Services",
      "Head of Information Technology",
      "Head of Procurement",
    ],
    discovery: [
      "Which directorate owns customer experience across postal, logistics and Pospay, and who could sponsor a cross-cutting deployment?",
      "How does outlet footfall and call volume behave in the week of a social-assistance payout?",
      "What regional languages does the beneficiary population actually use, and where are the highest concentrations?",
      "What are the data-residency and access requirements for government beneficiary data?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A social-assistance beneficiary in rural Central Java calls and is told in Javanese that her payment is ready, which outlet to visit and what ID to bring, instead of queueing twice.",
  },

  "kalbe-farma": {
    operatingContext:
      "Kalbe Farma is Indonesia's largest pharmaceutical company, spanning prescription medicines, consumer health and over-the-counter brands, nutritional and dairy products, and a distribution business, with digital-health interests including the KlikDokter platform. Its consumer-health and nutrition brands reach mass Indonesian households through pharmacies, supermarkets and e-commerce, generating a continuous stream of consumer conversations about product usage, dosage, ingredients, availability and — critically — side effects and adverse reactions that carry pharmacovigilance reporting obligations. On the digital-health side, KlikDokter provides health content and consultation-adjacent services that sit close to clinical territory. Consumer interaction runs through brand social channels, WhatsApp, care lines and e-commerce storefronts, in Bahasa Indonesia, and is currently handled by brand-level teams rather than one governed capability.",
    strategicPressure: [
      { text: "Kalbe operates across prescription, consumer health and nutrition with a portfolio of consumer brands, so consumer-facing product conversations arrive across many separate brand channels rather than one front door.", kind: "verified" },
      { text: "Pharmacovigilance obligations mean any consumer report of a side effect received through any channel must be captured and processed, which is difficult to guarantee when handling is distributed across brand social teams.", kind: "verified" },
      { text: "Digital-health assets like KlikDokter operate adjacent to clinical advice, requiring far stricter conversational boundaries than a consumer brand channel would normally need.", kind: "inference" },
      { text: "Kalbe's digital arm is more likely to want a partner that accelerates a governed capability than to build conversational infrastructure itself, making this a partner-led rather than packaged sale.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Kalbe has digital-health product capability and will own the customer-facing experience on its own platforms, but it will not build speech, orchestration and pharmacovigilance-grade evaluation infrastructure. The right motion is a platform delivered with regulated-industry workflows that Kalbe's digital team configures and governs.",
    whyNotBuild:
      "Kalbe's digital investment is directed at health services and product platforms, not at conversational infrastructure. The specific requirement that decides it is auditability: pharmacovigilance capture and clinical-boundary enforcement must be demonstrable to regulators, which means the evaluation and governance layer needs to be a proven product with a vendor accountable for it rather than an internal build the regulatory affairs team must defend.",
    workflows: [
      {
        name: "Consumer product and usage enquiries with governed answers",
        friction: "Consumers ask about dosage, ingredients, storage and suitability across many brand social channels, and answers depend on individual brand-team staff with no governed source or consistency.",
        outcome: "Strictly bounded, approved product-information answers delivered identically across every brand channel, with anything requiring clinical judgement routed to a qualified professional.",
        channels: ["WhatsApp", "Social messaging", "Voice"],
        systems: ["Approved product information repository", "Brand content management", "Escalation queue", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Adverse-event detection and pharmacovigilance intake",
        friction: "A consumer describing a side effect on a brand social channel may or may not be recognised as a reportable event, so pharmacovigilance capture depends on whether a social-media agent notices — a genuine regulatory exposure.",
        outcome: "Systematic detection of adverse-event language across every channel with structured intake and immediate routing into the pharmacovigilance case system, making capture reliable rather than accidental.",
        channels: ["WhatsApp", "Social messaging", "Voice", "Email"],
        systems: ["Pharmacovigilance case system", "Approved product repository", "Regulatory reporting workflow", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "KlikDokter support and appointment-adjacent servicing",
        friction: "Users of the digital-health platform ask about services, consultation availability and account issues, and support must be careful not to stray into medical advice — a boundary that is hard to enforce with human agents at scale.",
        outcome: "Non-clinical support handled conversationally with hard, demonstrable boundaries, and any clinical question routed to a qualified practitioner within the platform.",
        channels: ["In-app chat", "WhatsApp"],
        systems: ["KlikDokter platform", "Practitioner scheduling", "Account/subscription system", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Brand-level consumer care lines and social-media response teams",
        "Product information websites and e-commerce storefronts for consumer brands",
        "The KlikDokter digital-health platform with in-app support",
        "A pharmacovigilance function receiving adverse-event reports through formal channels",
      ],
      gaps: [
        "Product answers vary by brand channel and by individual responder with no governed source",
        "Adverse-event signals arriving through social channels may never reach pharmacovigilance",
        "There is no single governed front door across the consumer brand portfolio",
        "Consumer conversations are not systematically evaluated for regulatory or accuracy risk",
      ],
    },
    risks: [
      "Indonesian pharmaceutical regulation and pharmacovigilance obligations require reliable detection, capture and reporting of adverse events from any channel, making escalation design a compliance control.",
      "Health-related conversations touch sensitive data under the Personal Data Protection Law, requiring explicit consent handling and controlled retention.",
      "Clinical-boundary enforcement on digital-health surfaces must be demonstrable and tested, since a medical answer given by an automated agent is a regulatory and safety incident.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.6,
      automationRate: 0.5,
      basis: "Seller assumptions aggregating consumer enquiry volume across brand channels and digital-health support; actual volumes are likely fragmented across brand teams and must be collected in discovery.",
    },
    pilotScope:
      "A Launch-scope pilot delivering governed consumer product Q&A for a selected consumer-health brand on WhatsApp in Bahasa, with systematic adverse-event detection and pharmacovigilance routing built in, measured on answer consistency and adverse-event capture rate versus the current baseline.",
    expansion: [
      "Extend the governed front door across additional consumer-health and nutrition brands",
      "Add full pharmacovigilance intake with structured regulatory reporting workflow",
      "Introduce KlikDokter non-clinical support with enforced clinical boundaries",
    ],
    stakeholders: [
      "Head of Consumer Health Division",
      "Head of Digital / KlikDokter leadership",
      "Head of Regulatory Affairs and Pharmacovigilance",
      "Head of Consumer Care / Marketing",
      "Chief Information Officer",
    ],
    discovery: [
      "How are adverse-event reports currently captured when they arrive through brand social or WhatsApp channels?",
      "What is the regulatory position on AI handling of consumer health conversations, and who signs off internally?",
      "How many consumer enquiries do the brand channels handle monthly, and who staffs them?",
      "Which product information sources are authoritative and version-controlled enough to ground automated answers?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A consumer messages a Kalbe brand on WhatsApp describing a reaction after taking a product, and the conversation is routed to a pharmacist and logged as a pharmacovigilance case within minutes.",
  },

  "rcbc": {
    operatingContext:
      "RCBC is a universal bank within the Yuchengco group, running corporate and commercial banking alongside a consumer franchise that is unusually credit-card and consumer-loan weighted for a Philippine bank of its size, plus a microfinance and rural-banking presence through group entities. It has pursued visible digital-inclusion positioning, pushing app-based banking and agent-assisted account opening to reach customers outside the traditional branch footprint. Its customers are urban and provincial Filipinos who communicate in Taglish and regional languages, and whose default digital channels are Facebook Messenger, Viber and SMS far more than any bank app. Servicing runs through a contact centre, branch network, in-app chat and social channels, with card disputes, transaction queries, loan servicing and collections dominating the contact mix.",
    strategicPressure: [
      { text: "RCBC has publicly positioned itself around digital banking and financial inclusion, which sets service expectations across a customer base far broader than its branch network can reach.", kind: "verified" },
      { text: "The Philippine banking sector operates under heightened BSP attention to fraud, account takeover and consumer redress following high-profile incidents, raising the compliance value of complete, auditable dispute handling.", kind: "verified" },
      { text: "A card and consumer-loan weighted book produces disproportionate dispute and collections conversation volume, concentrating cost exactly where the bank is growing.", kind: "inference" },
      { text: "RCBC's delivery pattern favours fintech and platform partnerships over large internal engineering programmes, so a partner-delivered conversational capability fits how it already operates.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. RCBC has genuine digital ambition and product capability but delivers through partners rather than large in-house engineering. It will want to shape the experience and integrate deeply, while consuming speech, orchestration and evaluation as partner-provided capability.",
    whyNotBuild:
      "The bank's digital agenda is about reach and product, not infrastructure. Building Taglish and regional-language speech, telephony integration with the existing contact-centre estate, deterministic execution against card and core systems, and dispute-grade evaluation would absorb the entire digital team for years. Under BSP's consumer-protection framework, the evaluation and audit trail is not optional, and a bought platform delivers it as evidence rather than as a project.",
    workflows: [
      {
        name: "Card dispute and unauthorised-transaction intake",
        friction: "A cardholder reporting an unrecognised charge must call, re-authenticate, narrate the transaction, and then chase status for weeks with no visibility — generating multiple contacts per dispute and BSP-relevant resolution-timeline exposure.",
        outcome: "Structured dispute captured at first contact in Taglish with the transaction retrieved automatically, provisional-credit rules explained consistently, and proactive status updates that eliminate chase calls.",
        channels: ["Voice", "Messenger", "Viber", "In-app chat"],
        systems: ["Card management system", "Core banking", "Dispute/chargeback case management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card and account servicing actions",
        friction: "Card blocks, replacements, limit changes and PIN resets require a human agent, so simple intents consume full-cost handling and queue in the evenings and weekends when working customers actually call.",
        outcome: "Identity resolved once and servicing actions executed in-conversation within policy, with above-threshold cases routed to a human carrying full context.",
        channels: ["Voice", "Messenger", "Viber", "In-app chat"],
        systems: ["Card management system", "Core banking", "Authentication/OTP service", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Consumer-loan collections and payment arrangements",
        friction: "Collections runs through dialer teams and agencies whose contact rates are limited to office hours, whose offers vary by collector, and whose conduct is difficult to evidence under BSP fair-collection expectations.",
        outcome: "Policy-timed multi-channel outreach in Taglish within permitted windows, arrangements drawn only from the approved matrix, payment executed in-channel, and every interaction recorded and scored for conduct.",
        channels: ["Voice", "SMS", "Viber"],
        systems: ["Collections system", "Loan servicing system", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile banking app with self-service transactions and card controls",
        "A contact centre with IVR authentication and human agents",
        "Facebook Messenger and Viber customer-service channels",
        "Digital account opening with electronic KYC and agent-assisted onboarding",
      ],
      gaps: [
        "Disputes cannot be filed and tracked end-to-end without a human",
        "Social-channel servicing answers but cannot execute account actions",
        "After-hours contact reaches an IVR that only takes messages",
        "Collections conduct is sampled rather than fully evidenced against BSP expectations",
      ],
    },
    risks: [
      "BSP consumer-protection rules and the Financial Products and Services Consumer Protection Act impose complaint-handling and redress timelines that automated dispute intake must satisfy with an auditable record.",
      "The Philippine Data Privacy Act and NPC requirements govern the processing of customer voice recordings and transcripts, including consent, retention and any cross-border processing.",
      "BSP fair-debt-collection expectations restrict contact timing, frequency and language in collections, requiring demonstrable evidence of compliant conduct on every interaction.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions based on the bank's consumer and card scale with Philippine contact-centre cost levels; validate volume, blended cost per contact and containable mix against the bank's own MIS.",
    },
    pilotScope:
      "A Scale-scope pilot on card servicing and dispute intake across voice, Messenger and Viber in Taglish, integrated to the card management system and dispute case management, measured on containment and dispute-status repeat-contact reduction.",
    expansion: [
      "Extend to consumer-loan collections with policy-bounded arrangements and in-channel payment",
      "Add proactive status and fraud-alert conversations across the card portfolio",
      "Open the same layer to microfinance and rural-banking customers in regional languages",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Cards and Consumer Lending",
      "Head of Customer Experience / Contact Centre",
      "Chief Information Officer",
      "Head of Consumer Protection and Compliance",
    ],
    discovery: [
      "Which conversational-AI or chatbot vendors are already deployed, and is there appetite to consolidate onto one platform?",
      "How many contacts does an average card dispute generate from intake to resolution?",
      "How is BSP consumer-protection complaint handling evidenced today across channels?",
      "Which card and core-banking actions are API-exposed to the app and could be reused by an agent?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An RCBC cardholder in Cebu reports an unrecognised charge on Viber at midnight, has the card blocked and the dispute filed, and is told each stage without calling again.",
  },

  "pnb": {
    operatingContext:
      "Philippine National Bank, part of the Lucio Tan group, is a universal bank with a distinctive international dimension: one of the largest overseas branch and representative-office footprints of any Philippine bank, built to serve overseas Filipino workers and the Filipino diaspora across North America, Europe, the Middle East and Asia. Domestically it runs a branch-heavy retail and commercial franchise. That combination creates a servicing problem few Philippine banks share: customers spread across every time zone, sending remittances home, holding accounts they cannot visit, and needing answers at hours when Manila is asleep. Contact drivers include remittance status and recipient issues, account servicing for overseas customers, card and loan queries, and domestic branch-based servicing, communicated in Taglish, English and regional languages including Ilocano and Cebuano across voice, Messenger, Viber and email.",
    strategicPressure: [
      { text: "PNB operates one of the most extensive overseas networks among Philippine banks, serving OFW remittance and deposit customers across multiple time zones.", kind: "verified" },
      { text: "Overseas Filipino remittances are a structurally large and stable flow into the Philippine economy, making remittance servicing a permanent, high-frequency conversational workload rather than a cyclical one.", kind: "verified" },
      { text: "Time-zone spread means a Manila-hours contact centre systematically fails a large part of the customer base, and hiring overseas coverage is prohibitively expensive for the margins involved.", kind: "inference" },
      { text: "Remittance status enquiries are almost entirely lookups, which makes them the cheapest large contact category to automate and the fastest to prove value on.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. PNB's technology posture is modernisation through vendor platforms — core, channels and payments — rather than internal platform engineering. There is no evidence of speech or conversational-orchestration development, and a branch-heavy universal bank of this profile buys customer-facing capability.",
    whyNotBuild:
      "Multilingual, multi-time-zone servicing is exactly the case where a platform's marginal cost advantage is decisive: building Taglish, English, Ilocano and Cebuano speech, telephony reachable from a dozen countries, orchestration into core and remittance systems, and BSP-grade evaluation would cost more than the entire overseas servicing operation. Buying converts a staffing problem the bank cannot solve into a configuration problem it can.",
    workflows: [
      {
        name: "Remittance status and recipient issue resolution",
        friction: "A sender abroad and a recipient at home both call about the same transfer at different hours, and each gets a human who must look up the same status — with the overseas caller often finding the line closed.",
        outcome: "Remittance status, expected credit timing and recipient-side issues answered instantly in the caller's language at any hour, with genuine exceptions escalated with the transaction already identified.",
        channels: ["Voice", "Messenger", "Viber", "SMS"],
        systems: ["Remittance platform", "Core banking", "Correspondent/partner network data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Overseas customer account servicing",
        friction: "Customers abroad need balance and transaction information, card blocks, document requests and account maintenance, but cannot visit a branch and frequently cannot reach a person in Philippine hours.",
        outcome: "Round-the-clock account servicing with identity resolved conversationally and in-policy actions executed, so an overseas customer is served as well as a Manila branch walk-in.",
        channels: ["Voice", "Messenger", "Viber", "Email"],
        systems: ["Core banking", "Card management", "Authentication service", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Domestic branch-query and loan servicing deflection",
        friction: "Domestic customers phone branches for balances, loan instalments, document requirements and branch logistics, tying up branch staff who should be selling and servicing in person.",
        outcome: "Consistent answers on account, loan and branch questions in Taglish and regional languages, releasing branch capacity and giving customers an answer without travelling.",
        channels: ["Voice", "Messenger", "SMS"],
        systems: ["Core banking", "Loan servicing system", "Branch master data", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile and internet banking platform for retail customers",
        "A contact centre with IVR serving domestic and overseas callers",
        "Overseas branches and representative offices serving OFW customers in person",
        "Messenger and Viber customer-service channels",
      ],
      gaps: [
        "Overseas customers cannot get service in their local time zone reliably",
        "Remittance status must be asked for rather than being pushed to sender and recipient",
        "No conversational channel executes account actions without a human",
        "Regional-language servicing depends on which agent answers rather than being a channel capability",
      ],
    },
    risks: [
      "BSP rules on remittance services and consumer redress require accurate disclosure of timing and fees, so automated statements must be grounded in authoritative sources and auditable.",
      "The Philippine Data Privacy Act governs customer voice and transaction data, and cross-border processing for overseas customers adds jurisdictional considerations that must be resolved in design.",
      "Anti-money-laundering obligations mean any conversational identity verification for overseas customers must satisfy the bank's KYC control framework, not merely be convenient.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions combining domestic retail servicing with overseas customer and remittance contacts; validate volumes, time-zone distribution and cost per contact against the bank's contact-centre reporting.",
    },
    pilotScope:
      "A Launch-scope pilot on remittance status and overseas account servicing across voice and Viber in English and Taglish with 24-hour coverage, integrated to the remittance platform and core banking, measured on after-hours resolution and containment.",
    expansion: [
      "Add proactive remittance notifications to both sender and recipient",
      "Extend to domestic branch-query and loan servicing deflection in regional languages",
      "Add Ilocano and Cebuano coverage for provincial and diaspora populations",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Overseas Banking / Remittance Business",
      "Head of Customer Care / Contact Centre",
      "Chief Information Officer",
      "Head of Compliance and AML",
    ],
    discovery: [
      "Where does overseas customer servicing sit organisationally, and what does it cost across the branch and representative-office network?",
      "What proportion of contacts arrive outside Philippine business hours, and what happens to them today?",
      "How many contacts does a typical remittance transaction generate between sender and recipient?",
      "What identity-verification standard would compliance require for conversational servicing of overseas customers?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An OFW in Dubai checks at 2am Manila time whether her remittance reached her mother in Ilocos, gets the exact credit time, and fixes a recipient detail in the same conversation.",
  },

  "landbank": {
    operatingContext:
      "Land Bank of the Philippines is a government financial institution and one of the country's largest banks, with a mandate centred on agricultural and countryside development that has made it the primary conduit for government disbursements — farmer support programmes, pensions, social-assistance transfers and various conditional-cash schemes reaching millions of beneficiaries. Alongside that it operates a full commercial bank serving local government units, cooperatives, and retail depositors through a branch network that extends into provinces where private banks are thin. Its beneficiary population is largely rural, frequently older, often first-generation formal-banking users, and speaks Tagalog alongside Cebuano, Ilocano and other regional languages. Contact volume is calendar-driven: it surges around every payout cycle with disbursement-status, cash-card and eligibility questions arriving through branches, a call centre, SMS and Messenger.",
    strategicPressure: [
      { text: "Landbank is the state's principal disbursement channel for government programmes reaching millions of beneficiaries, giving it a servicing obligation defined by public policy rather than commercial return.", kind: "verified" },
      { text: "As a government financial institution it procures technology through public procurement processes with defined tender rules and evaluation criteria.", kind: "verified" },
      { text: "Payout calendars concentrate contact and branch footfall into narrow windows, producing queues in provincial branches that no permanent staffing level can absorb economically.", kind: "inference" },
      { text: "Regional-language voice is the only channel that genuinely serves the beneficiary population, so speech quality in Cebuano and Ilocano is the technical question the whole opportunity turns on.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A government financial institution acquires technology through public procurement and operates an IT function focused on core banking, channels and government-programme integration. It has no platform-engineering capability and no mechanism to fund one.",
    whyNotBuild:
      "Beyond the absence of capability, the language requirement decides it: usable Tagalog, Cebuano and Ilocano speech for elderly rural speakers is a specialist engineering problem that a government bank could not solve internally at any realistic budget. Add telephony reaching provincial callers, orchestration into disbursement and card systems, and a public-accountability-grade audit trail, and the case for procurement is complete.",
    workflows: [
      {
        name: "Disbursement status and eligibility enquiries",
        friction: "Around every payout, beneficiaries queue at provincial branches or call to ask whether funds have been released, how much, and whether they qualify — questions that repeat identically thousands of times and swamp branch capacity.",
        outcome: "Disbursement status, amount and programme eligibility answered by voice in the beneficiary's regional language, plus proactive payment-released notification that flattens the branch queue before it forms.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Government programme disbursement system", "Beneficiary registry", "Core banking", "Notification platform"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Cash-card issue resolution",
        friction: "Beneficiaries with blocked, lost or non-functioning cash cards must travel to a branch, often at real cost and distance, to resolve something that is frequently a PIN, activation or status issue.",
        outcome: "Card status, PIN and activation issues diagnosed and resolved conversationally with identity verified appropriately, and only genuine replacements requiring a branch visit.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Card management system", "Core banking", "Authentication service", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Retail account and branch-service deflection",
        friction: "Provincial branches absorb routine balance, transaction, requirement and branch-hours questions in person because customers have no reliable remote alternative in their language.",
        outcome: "Routine account and branch questions answered in regional languages remotely, releasing branch capacity for lending and programme work that genuinely requires a person.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Core banking", "Branch master data", "Product/requirement information", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile banking application and ATM and cash-card infrastructure",
        "A contact centre with IVR serving retail and beneficiary customers",
        "A nationwide branch network extending into provincial areas",
        "SMS notification for account and programme transactions",
      ],
      gaps: [
        "No servicing channel operates in Cebuano, Ilocano or other regional languages",
        "Beneficiaries cannot confirm disbursement status without visiting or calling a branch",
        "Cash-card problems generally require physical travel to resolve",
        "Nothing proactively notifies beneficiaries when a payment has been released",
      ],
    },
    risks: [
      "Government procurement rules require formal tender processes with defined evaluation and timelines, so commercial structuring and compliance documentation matter as much as capability.",
      "The Philippine Data Privacy Act and NPC guidance apply to beneficiary data, which is sensitive and politically visible, likely requiring in-country hosting and strict access controls.",
      "Regional-language voice quality for elderly rural speakers is the decisive technical risk and must be validated with real beneficiaries in the target provinces before commitment.",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions reflecting very large beneficiary populations with calendar-driven contact spikes; Landbank's own branch footfall and contact-centre statistics must replace these before any business case is presented.",
    },
    pilotScope:
      "A Scale-scope pilot on disbursement status and cash-card issue resolution by voice in Tagalog and one regional language for selected provinces, integrated to the disbursement system and card management, measured on branch-queue reduction through a payout cycle.",
    expansion: [
      "Add proactive payment-released notification ahead of each disbursement cycle",
      "Extend to retail account and branch-service deflection across the provincial network",
      "Add further regional-language coverage aligned to programme beneficiary concentrations",
    ],
    stakeholders: [
      "Head of Retail and Government Banking",
      "Head of Customer Care / Contact Centre",
      "Head of Programme Disbursement Operations",
      "Chief Information Officer",
      "Head of Procurement and Compliance",
    ],
    discovery: [
      "What is the government procurement route and timeline for a platform of this type?",
      "How does branch footfall and call volume behave in the week of a major programme payout?",
      "What are the data-residency and access requirements for government beneficiary data?",
      "Which regional languages have the highest beneficiary concentrations, and who would judge voice quality acceptable?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A farmer-beneficiary in Leyte calls and is told in Cebuano that his subsidy has been credited, how much, and that his cash card just needs activation — without a trip to the branch.",
  },

  "chinabank": {
    operatingContext:
      "China Banking Corporation is a universal bank affiliated with the SM group, historically built on relationship banking with the Chinese-Filipino business community and now expanding a consumer franchise across credit cards, auto loans, home loans and deposits, alongside a savings-bank subsidiary serving a broader retail segment. Its heritage strength is commercial and SME lending where the relationship is managed by an officer, but its growth strategy has been adding consumer products that generate a fundamentally different servicing pattern — high-frequency, low-value, and impossible to serve through relationship officers. Its customers are urban Filipinos in Metro Manila and provincial commercial centres, communicating in Taglish and English with Hokkien relevant in parts of the traditional business-banking base, reaching the bank through a contact centre, branches, app and Messenger.",
    strategicPressure: [
      { text: "Chinabank's growth has shifted toward consumer banking products — cards, auto and home loans — which generate servicing volume its relationship-led operating model was not designed to absorb.", kind: "verified" },
      { text: "SM group affiliation gives it distribution proximity to a very large retail ecosystem, which raises consumer acquisition potential and therefore servicing volume faster than headcount can follow.", kind: "inference" },
      { text: "BSP consumer-protection requirements apply with full force to consumer products, so a bank scaling into cards and consumer loans inherits complaint-handling obligations it previously had little exposure to.", kind: "inference" },
      { text: "The business case rests on whether consumer-banking growth targets are aggressive enough to make the current servicing model visibly untenable — without that, urgency is the binding constraint.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Chinabank has consistently modernised through vendor platforms across core, channels and cards. Its technology function delivers and integrates rather than engineering platforms, and there is no evidence of speech or conversational-AI development.",
    whyNotBuild:
      "A relationship-heritage bank scaling into consumer products needs servicing capacity quickly, and building conversational infrastructure delivers it slowly at best. Taglish speech, telephony integration, card and loan-system orchestration, and BSP-grade complaint evidencing are four specialist builds with no differentiation, competing against a growth roadmap the board is actually measuring.",
    workflows: [
      {
        name: "Card activation, servicing and dispute intake",
        friction: "New cardholders call to activate, set PINs and query charges, and disputes are captured manually with no status visibility — a growing volume the contact centre absorbs with headcount.",
        outcome: "Activation and servicing actions executed conversationally within policy and disputes captured as structured cases at first contact, with proactive status suppressing follow-up calls.",
        channels: ["Voice", "Messenger", "Viber", "In-app chat"],
        systems: ["Card management system", "Core banking", "Dispute case management", "Authentication service"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Auto and home loan servicing",
        friction: "Borrowers ask for amortisation amounts, outstanding balances, payoff quotes and insurance or title-document status, and each requires an officer or agent to interpret a loan system.",
        outcome: "Live loan positions, payoff quotes and document status delivered consistently in-conversation, with restructuring and commercial matters escalated to an officer with context prepared.",
        channels: ["Voice", "Messenger", "Email"],
        systems: ["Loan servicing system", "Core banking", "Document/title tracking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "SME and business-banking operational support",
        friction: "Business customers chase failed transfers, payroll batches, facility limits and trade documents through relationship officers whose availability limits routine operational answers.",
        outcome: "Entitlement-aware recognition with facility and transaction context loaded, routine operational queries resolved immediately, and relationship officers reserved for commercial conversations.",
        channels: ["Voice", "Email", "Viber"],
        systems: ["Cash management platform", "Core banking", "Trade finance system", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A mobile banking app with card controls and self-service transactions",
        "A contact centre with IVR and human agents",
        "Messenger and Viber customer-service channels",
        "Relationship-officer coverage for business and commercial customers",
      ],
      gaps: [
        "Card and loan servicing actions cannot be completed without a human agent",
        "Dispute status is invisible to the customer between filing and resolution",
        "Business customers have no self-service path for routine operational queries",
        "After-hours consumer servicing falls back to an IVR that cannot resolve anything",
      ],
    },
    risks: [
      "BSP consumer-protection rules and the Financial Products and Services Consumer Protection Act impose complaint-handling and redress obligations that automated interactions must satisfy with auditable records.",
      "The Philippine Data Privacy Act governs voice recordings and transcripts, requiring consent, retention discipline and controls on any cross-border processing.",
      "Business-banking servicing requires entitlement awareness; an agent that discloses facility information to an unauthorised caller is a serious control failure, so authentication design is critical.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.2,
      automationRate: 0.5,
      basis: "Seller assumptions reflecting a growing but still moderate consumer contact base at Philippine cost levels; validate volume, growth trajectory and cost per contact against the bank's reporting.",
    },
    pilotScope:
      "A Launch-scope pilot on card activation, servicing and dispute intake over voice and Messenger in Taglish, integrated to the card management system, measured on containment and dispute-status contact reduction.",
    expansion: [
      "Extend to auto and home loan servicing with payoff quotes and document status",
      "Add an SME and business-banking operational support desk with entitlement awareness",
      "Introduce proactive collections and payment-reminder conversations for consumer loans",
    ],
    stakeholders: [
      "Head of Consumer Banking",
      "Head of Cards and Consumer Lending",
      "Head of Customer Experience / Contact Centre",
      "Chief Information Officer",
      "Head of Compliance and Consumer Protection",
    ],
    discovery: [
      "What are the consumer-banking growth targets, and what servicing volume do they imply over three years?",
      "How is card dispute handling evidenced today against BSP complaint-resolution timelines?",
      "Which card and loan-system actions are API-exposed to digital channels?",
      "Would business-banking customers accept a conversational desk, and what authentication would compliance require?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Chinabank cardholder in Quezon City activates a new card and sets a PIN over Messenger in Taglish on a Sunday, then queries a charge and files a dispute in the same thread.",
  },

  "eastwest-bank": {
    operatingContext:
      "EastWest Bank, part of the Filinvest group, is deliberately positioned as a consumer-lending-led bank in the Philippines, with a portfolio weighted toward credit cards, auto loans and personal loans rather than the corporate and deposit franchises that anchor most universal banks. That choice makes it structurally one of the most communications-intensive banks in the market: consumer lending generates the highest contact frequency per customer in banking, and delinquency management is a permanent operating function rather than an occasional one. Its customers are mass-market and emerging-middle-class Filipinos in Metro Manila and provincial cities who speak Taglish and regional languages and reach the bank through a contact centre, dialers, branches, Messenger and Viber. Collections, card disputes, payment arrangements and loan servicing dominate its cost base.",
    strategicPressure: [
      { text: "EastWest's strategy concentrates deliberately on consumer lending — cards, auto and personal loans — which are the highest contact-frequency and highest collections-intensity products in retail banking.", kind: "verified" },
      { text: "BSP has reinforced fair-debt-collection expectations for Philippine lenders, making evidenced conduct on every collections interaction a supervisory requirement rather than a best practice.", kind: "verified" },
      { text: "Collections executed through dialer teams and agencies reaches only a fraction of the delinquent base during office hours, so accounts roll into costlier buckets for lack of contact rather than lack of willingness to pay.", kind: "inference" },
      { text: "Because collections cost is such a large share of the bank's operating expense, a proven per-account cure improvement translates into a board-level number faster here than at any deposit-led peer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. EastWest's technology investment goes into cards, lending and channel systems. It has no platform-engineering capability, and its scale argues decisively for buying a packaged agentic solution whose cost is proportional to the collections volume it serves.",
    whyNotBuild:
      "Collections is the highest-regulatory-risk conversation a Philippine lender has, and the ability to prove every interaction was compliant is the capability that matters most. Building Taglish and regional-language speech, dialer-replacing telephony, offer-matrix-bounded negotiation and full conduct evaluation would take years and would leave the bank owning the compliance risk of its own engineering. A bought platform delivers the evidence trail as a product feature.",
    workflows: [
      {
        name: "Card and consumer-loan collections with in-channel payment",
        friction: "Dialer bursts during office hours reach a fraction of delinquent borrowers, arrangements vary by collector, promises to pay are noted in wrap-up with no follow-up, and accounts roll while waiting for the next cycle.",
        outcome: "Full attempted coverage within BSP-permitted contact windows in Taglish, arrangements drawn only from the approved matrix, payment links delivered in-channel, promises recorded with automatic follow-up, and every conversation scored for conduct.",
        channels: ["Voice", "SMS", "Viber", "Messenger"],
        systems: ["Collections system", "Card management system", "Loan servicing system", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card dispute and unauthorised-transaction handling",
        friction: "Disputes are captured manually by agents, status is invisible to the cardholder, and repeat chase calls consume capacity while BSP resolution timelines run.",
        outcome: "Structured dispute intake at first contact with the transaction retrieved automatically, consistent explanation of provisional-credit rules, and proactive status updates that eliminate chase contacts.",
        channels: ["Voice", "Messenger", "Viber", "In-app chat"],
        systems: ["Card management system", "Dispute/chargeback case management", "Core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan servicing and payment arrangement enquiries",
        friction: "Borrowers ask for amortisation amounts, payoff quotes and restructuring options, and answers vary by agent — inconsistency that generates disputes and complaints in a segment already under financial stress.",
        outcome: "Consistent live loan positions and payoff quotes delivered conversationally with approved arrangement options explained identically, and hardship cases routed to specialists with full context.",
        channels: ["Voice", "Messenger", "Viber"],
        systems: ["Loan servicing system", "Collections system", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile banking app with card controls and payment features",
        "A contact centre with IVR plus outbound dialer collections operations",
        "Messenger and Viber customer-service channels",
        "Third-party collection agency arrangements for later-bucket accounts",
      ],
      gaps: [
        "Only a fraction of the early-delinquent base is contacted before it rolls forward",
        "Payment arrangements are improvised by collectors rather than drawn from a governed matrix",
        "Dispute status must be chased by the cardholder",
        "Agency collections conduct is difficult to evidence to BSP standards",
      ],
    },
    risks: [
      "BSP fair-debt-collection expectations restrict contact timing, frequency, language and third-party conduct, and require demonstrable evidence of compliant behaviour on every interaction.",
      "The Philippine Data Privacy Act governs the use of borrower contact data for outbound collections, requiring lawful basis, honoured opt-outs and controlled retention of recordings.",
      "Regional-language and Taglish voice quality across provincial borrowers is decisive for contact-rate improvement; a Manila-only voice will underperform the business case.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions combining inbound consumer servicing with heavy outbound collections attempt volume; validate attempt counts, connect rates, agency costs and cost per cured account in discovery.",
    },
    pilotScope:
      "A Scale-scope pilot on early-bucket card and consumer-loan collections in Taglish across voice, SMS and Viber with in-channel payment and recorded arrangements, measured against dialer contact rates and roll rate on a matched control portfolio.",
    expansion: [
      "Extend to card dispute intake with proactive status suppression of chase contacts",
      "Add inbound loan servicing and payment-arrangement enquiries",
      "Add regional-language coverage across provincial borrower populations",
    ],
    stakeholders: [
      "Head of Consumer Lending",
      "Head of Collections and Recovery",
      "Head of Cards",
      "Head of Customer Experience / Contact Centre",
      "Head of Compliance and Consumer Protection",
    ],
    discovery: [
      "Is early-bucket collections run in-house, through agencies, or both, and what does each cost per cured account?",
      "What share of the early-delinquent population is contacted within the first seven days?",
      "What contact-window and frequency rules are applied, and how is BSP compliance evidenced today?",
      "What arrangement and restructuring options may a collector offer without escalation?",
    ],
    flowTemplate: "collections",
    scenario: "An EastWest cardholder in Davao two weeks past due gets a Taglish call within permitted hours, agrees an approved payment plan, and settles through a link the same evening.",
  },

  "maya": {
    operatingContext:
      "Maya combines a licensed digital bank with one of the Philippines' largest e-wallets in a single application, backed by PLDT and international investors including KKR, and serves millions of users with payments, savings, credit and merchant acceptance. Its operating model is engineering-led and app-native by design: there are no branches, acquisition happens through the app and merchant network, and product velocity is the core competitive weapon in a market where it competes against another very large wallet plus the incumbent banks' digital offerings. Support arrives entirely through in-app channels, social and email from a young, mobile-first Filipino user base communicating in Taglish. Its contact drivers are transaction disputes, failed transfers and cash-in problems, KYC and account-verification issues, and credit servicing — all growing faster than an operations team can hire against.",
    strategicPressure: [
      { text: "Maya operates both a digital bank licence and a large e-wallet in one app under BSP supervision, which subjects it to bank-grade consumer-protection and complaint-handling obligations at wallet-scale volumes.", kind: "verified" },
      { text: "Digital-wallet competition in the Philippines is intense and switching costs are low, so support failures translate directly into user attrition rather than complaints.", kind: "verified" },
      { text: "KYC and account-verification friction is a structural support driver for digital banks with no branch fallback, and it hits at the worst moment — when a user is trying to start using the product.", kind: "inference" },
      { text: "The engineering team has almost certainly built LLM-based support tooling already, so the opportunity is production-grade grounding, voice identity and evaluation rather than the concept itself.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. Maya's engineering-led culture and product velocity rule out a packaged CX suite that would constrain its app experience. The realistic motion is supplying infrastructure — grounded automated resolution, conversational identity verification, and per-conversation evaluation — on Google Cloud, with Maya's own team owning the support surface.",
    whyNotBuild:
      "Maya will build the experience, and its engineers would resent anything that took that from them. What it will not build economically is production Taglish speech, voice-based identity verification meeting BSP KYC standards, and a rigorous evaluation layer that scores every conversation for consumer-protection defensibility. Those pay off only at platform scale, and Maya's engineering priority is payments, credit and merchant products.",
    workflows: [
      {
        name: "Transaction dispute and failed-transfer resolution",
        friction: "Failed cash-ins, stuck transfers and disputed merchant transactions require operations staff to reconcile across payment rails manually, while the user sees only that their money is missing.",
        outcome: "Reconciliation-aware automated resolution that establishes the true transaction state across rails, explains it plainly, and either completes, reverses or opens a structured dispute in the same conversation.",
        channels: ["In-app chat", "Email", "Social messaging"],
        systems: ["Transaction ledger", "Payment rail integrations", "Dispute case management", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "KYC and account-verification support",
        friction: "Users blocked at identity verification cannot proceed and cannot visit a branch, so a rejected document or a failed liveness check becomes a support ticket at the moment of highest abandonment risk.",
        outcome: "Guided verification with the specific rejection reason explained and re-capture coached in-flow, converting stalled verifications into activated accounts.",
        channels: ["In-app chat", "Email"],
        systems: ["KYC/identity verification platform", "Onboarding workflow", "Document processing", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Credit servicing and account-lockout recovery",
        friction: "Credit users ask about limits, due dates and repayment, and locked-out users with a lost device have no reliable recovery path in an organisation with no branches and no voice channel.",
        outcome: "Credit position and repayment answers delivered instantly, and a voice recovery path with conversational identity verification that restores access securely without a physical presence.",
        channels: ["In-app chat", "Voice", "Email"],
        systems: ["Credit/lending platform", "Authentication service", "Fraud monitoring", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "An app-native banking and wallet experience with in-app chat support",
        "Self-service transaction history, limits and card controls in the app",
        "Digital onboarding with electronic KYC and liveness verification",
        "Social-channel and email support for account issues",
      ],
      gaps: [
        "Cross-rail transaction issues require manual reconciliation before a user gets an answer",
        "Users blocked at KYC are told they failed but not precisely why or how to fix it",
        "There is no reliable voice recovery path for lockouts or device loss",
        "Support conversations are not systematically evaluated for consumer-protection defensibility",
      ],
    },
    risks: [
      "BSP digital-bank supervision and the Financial Products and Services Consumer Protection Act impose complaint-handling and redress timelines that automated resolution must satisfy with auditable records.",
      "The Philippine Data Privacy Act governs identity documents, biometric and voice data used in verification, requiring explicit consent, security controls and lawful retention.",
      "As a co-build, delivery depends on Maya's own engineering roadmap, so scope must be bounded to infrastructure primitives rather than end-to-end experience.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.6,
      automationRate: 0.65,
      basis: "Seller assumptions for a large digital wallet and bank with app-concentrated support; actual ticket volume, current automation coverage and cost per ticket must come from Maya's operations team.",
    },
    pilotScope:
      "A Launch-scope co-build pilot supplying grounded automated resolution for transaction disputes and failed transfers inside Maya's existing in-app support surface, with the platform providing grounding, orchestration and per-conversation evaluation.",
    expansion: [
      "Extend to KYC and account-verification support with guided re-capture",
      "Add a voice recovery path with conversational identity verification for lockout and device-loss cases",
      "Introduce credit servicing conversations grounded in the lending platform",
    ],
    stakeholders: [
      "Chief Technology Officer",
      "Head of Customer Operations",
      "Head of Product",
      "Head of Risk and Compliance",
      "Head of Data / Machine Learning",
    ],
    discovery: [
      "What in-house LLM support tooling has the team already built, and where did it hit limits?",
      "What proportion of tickets are cross-rail transaction issues requiring manual reconciliation?",
      "What is the KYC rejection rate, and how many rejected users never complete onboarding?",
      "How are locked-out users recovered today without branches or a voice channel, and does PLDT-group vendor influence shape platform choices?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Maya user whose cash-in did not reflect gets told in-app exactly where the money sits across the payment rail and when it lands, without an operations agent ever touching it.",
  },

  "cebuana-lhuillier": {
    operatingContext:
      "Cebuana Lhuillier is the Philippines' largest micro-financial-services network, operating thousands of branches nationwide that provide pawn loans against jewellery, domestic and international remittance payout, microinsurance, micro-savings and bills payment to a mass-market population that formal banking has historically underserved. Its scale is branch-based and provincial: it is present in municipalities where banks are not, and its customers are frequently cash-based, older, and reliant on face-to-face service. That produces an enormous aggregate conversation volume — remittance status checks, pawn renewal and redemption reminders, microinsurance claim questions, branch and rate enquiries — almost all of it handled today by branch staff and phone lines. Customers communicate in Tagalog, Cebuano and other regional languages by voice, SMS and increasingly Messenger.",
    strategicPressure: [
      { text: "Cebuana Lhuillier operates one of the largest branch networks of any financial-services provider in the Philippines, serving a mass-market population across pawning, remittance and microinsurance.", kind: "verified" },
      { text: "Pawn loans carry renewal and redemption deadlines that customers must be reminded about or they lose collateral — a conversational obligation with direct customer-harm consequences if it fails.", kind: "verified" },
      { text: "Remittance status checks are almost entirely lookups performed by branch staff, meaning highly trained counter capacity is consumed by questions requiring no judgement at all.", kind: "inference" },
      { text: "Because the customer base is regional-language and often not smartphone-first, voice in Cebuano and other regional languages is the channel that actually determines whether automation reaches anyone.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. This is an operations empire built on branch density and cash handling, not a technology company. Its systems investment is in core pawn, remittance and branch platforms, and any conversational capability will be acquired as a service.",
    whyNotBuild:
      "There is no engineering organisation capable of building speech and orchestration, and the language requirement makes it harder still — usable Cebuano and Tagalog voice for older, provincial customers is a specialist problem. Add BSP-supervised remittance and microinsurance conduct obligations and per-conversation evidencing, and buying with vendor accountability is the only realistic path.",
    workflows: [
      {
        name: "Remittance status and payout enquiries",
        friction: "Senders and recipients call or visit branches to ask whether a remittance has arrived and which branch can pay it out, consuming counter capacity that should be transacting.",
        outcome: "Remittance status, payout availability and nearest-branch guidance answered by voice in the customer's regional language at any hour, freeing counters for transactions.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Remittance platform", "Branch network data", "Partner payout integrations", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pawn renewal and redemption reminders",
        friction: "Customers who miss renewal deadlines lose jewellery of real personal and financial value, and reminders today are limited to SMS blasts that many customers never act on.",
        outcome: "Two-way conversational reminders in the customer's language ahead of each deadline with renewal options and payment explained, protecting customers from collateral loss and protecting the company's renewal revenue.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Pawn loan system", "Payment gateway", "Branch network data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Microinsurance claim intake and status",
        friction: "Microinsurance claimants must visit a branch to file, submit documents that frequently bounce, and then return or call repeatedly for status on small-value claims where the travel cost is significant relative to the payout.",
        outcome: "Claims filed conversationally with documents captured and validated in-flow, and status pushed proactively so claimants never travel to a branch just to ask a question.",
        channels: ["Voice", "Messenger", "SMS"],
        systems: ["Microinsurance policy and claims system", "Document management", "Payout/disbursement", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A nationwide branch network providing counter-based service across all product lines",
        "SMS notification for remittance and pawn transactions",
        "A customer app and online channels for selected services",
        "A phone-based customer service line and Messenger presence",
      ],
      gaps: [
        "Remittance status requires a call or branch visit rather than being self-serviceable",
        "Pawn deadline reminders are one-way SMS with no ability to renew or pay in the same thread",
        "Microinsurance claims cannot be filed without visiting a branch",
        "No servicing channel operates in Cebuano or other regional languages by voice",
      ],
    },
    risks: [
      "BSP rules governing pawnshops, remittance and money-service businesses impose disclosure and conduct obligations that automated conversations must satisfy verifiably.",
      "The Philippine Data Privacy Act governs customer identity, transaction and voice data across a mass-market base with limited digital literacy, raising the bar on consent clarity.",
      "Regional-language voice quality for older provincial customers is the decisive technical risk and must be validated in the actual target provinces before commitment.",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 0.6,
      automationRate: 0.6,
      basis: "Seller assumptions reflecting very high aggregate transaction and enquiry volume across thousands of branches; branch-level enquiry load and phone volume must be measured in discovery since they are likely untracked centrally.",
    },
    pilotScope:
      "A Scale-scope pilot on remittance status enquiries and pawn renewal reminders by voice and SMS in Tagalog and Cebuano for selected regions, integrated to the remittance and pawn systems, measured on branch-counter enquiry deflection and renewal conversion.",
    expansion: [
      "Add microinsurance claim intake with in-conversation document validation",
      "Extend proactive outreach to micro-savings and bills-payment customers",
      "Add further regional-language coverage aligned to branch-network concentrations",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Pawning Business",
      "Head of Remittance and Payments",
      "Head of Microinsurance",
      "Head of Information Technology",
    ],
    discovery: [
      "How API-ready are the core pawn, remittance and microinsurance systems for real-time grounding?",
      "How much branch-counter time is consumed by enquiries rather than transactions?",
      "What proportion of pawn loans lapse to collateral forfeiture, and how are reminders handled today?",
      "Which regional languages matter most by branch concentration, and who internally would judge voice quality?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer in Iloilo hears in Cebuano that her padala is ready at the nearest branch and that her pawn ticket expires Friday, and renews it by phone before losing the jewellery.",
  },

  "palawan-group": {
    operatingContext:
      "The Palawan Group operates one of the Philippines' largest pawnshop and domestic remittance networks through Palawan Pawnshop and the Palawan Express Padala service, with thousands of outlets concentrated heavily in the Visayas and Mindanao alongside Luzon coverage. Its business is cash-in, cash-out and collateral lending for a mass-market, largely provincial customer base — domestic workers sending money home, families receiving allowances, small traders pawning jewellery for working capital. The service model is over-the-counter and relationship-based at the branch level, with a family-owned holding structure that keeps decision-making centralised but technology investment modest. Customers speak Cebuano, Tagalog, Hiligaynon and other regional languages and reach the company by walking in, calling a branch, or using SMS and Messenger.",
    strategicPressure: [
      { text: "Palawan operates one of the country's largest padala and pawnshop networks, weighted toward the Visayas and Mindanao where regional languages rather than Tagalog dominate everyday communication.", kind: "verified" },
      { text: "Domestic remittance competition in the Philippines now includes wallets and bank transfer rails that are cheaper and faster, pressing over-the-counter networks to compete on service and reach.", kind: "inference" },
      { text: "Send and receive status checks are the highest-frequency conversation the network has and require no judgement, making them the clearest automation target in the business.", kind: "inference" },
      { text: "Centralisation of customer care and technology decision-making within the family holding is the practical gating question — without a central owner there is no counterpart to sell to.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A family-owned branch-network business with modest technology investment will procure conversational capability, not build it. There is no engineering organisation and no cultural precedent for developing customer-facing software.",
    whyNotBuild:
      "Building is not a consideration here in any realistic sense. The relevant sale is a simple, low-operational-burden deployment that a small central team can run, with regional-language voice as the capability the company could never obtain any other way. Cebuano and Hiligaynon speech quality is precisely what a platform provides and what no in-house effort would achieve.",
    workflows: [
      {
        name: "Padala send and receive status enquiries",
        friction: "Senders and recipients call branches or walk in to ask whether money has arrived and which outlet can pay it, occupying counter staff who are simultaneously handling cash transactions.",
        outcome: "Transfer status, payout readiness and nearest-outlet guidance answered by voice in the caller's regional language at any hour, removing the highest-volume enquiry from the counter entirely.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Remittance platform", "Outlet network data", "Transaction records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rate, fee and outlet-location enquiries",
        friction: "Customers call to ask sending fees, exchange or service rates, outlet hours and which branches are open, and answers depend on which staff member picks up, sometimes inconsistently.",
        outcome: "Consistent, governed answers on fees, rates and outlet logistics delivered conversationally, removing an entire category of branch-phone interruptions.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Fee/rate master", "Outlet master data", "Operating hours system"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Pawn ticket servicing and renewal reminders",
        friction: "Pawn customers must visit a branch to check the amount due for renewal or redemption, and those who miss deadlines lose jewellery — with reminders limited to whatever SMS the branch sends.",
        outcome: "Pawn ticket position and renewal amounts answered conversationally with deadline reminders ahead of forfeiture, protecting customers from collateral loss and preserving renewal income.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Pawn loan system", "Outlet network data", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large outlet network providing over-the-counter remittance and pawn services",
        "SMS transaction notifications to senders and recipients",
        "A Messenger and social-media presence for customer enquiries",
        "Branch-level phone lines answered by counter staff",
      ],
      gaps: [
        "No self-service channel confirms whether a padala is ready for pickup",
        "Fee and rate answers vary by branch and by whoever answers the phone",
        "Pawn renewal deadlines are communicated inconsistently, risking collateral forfeiture",
        "Nothing operates by voice in Cebuano or Hiligaynon despite that being the customer base's first language",
      ],
    },
    risks: [
      "BSP rules for pawnshops and money-service businesses impose disclosure obligations on fees and terms, so automated answers must be grounded in an authoritative, version-controlled source.",
      "The Philippine Data Privacy Act governs remittance and customer identity data, with heightened care needed for a base that may not read consent notices carefully.",
      "Regional-language voice quality in Cebuano and Hiligaynon is the entire feasibility question for this account and must be validated with real Visayas and Mindanao speakers.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.5,
      automationRate: 0.6,
      basis: "Seller assumptions covering high aggregate enquiry volume across thousands of outlets; branch-level phone and walk-in enquiry load must be measured in discovery as it is unlikely to be centrally tracked.",
    },
    pilotScope:
      "A Launch-scope pilot on padala send and receive status plus fee and outlet enquiries by voice and SMS in Cebuano and Tagalog for a Visayas region, integrated to the remittance platform and outlet data, measured on branch-phone enquiry deflection.",
    expansion: [
      "Add pawn ticket servicing and renewal deadline reminders",
      "Extend voice coverage to Hiligaynon and other regional languages across Mindanao",
      "Introduce proactive notification to recipients when a transfer is ready for pickup",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Remittance Operations",
      "Head of Pawnshop Operations",
      "Head of Information Technology",
      "Head of Marketing / Customer Engagement",
    ],
    discovery: [
      "Is customer care centralised in the family holding, or handled outlet by outlet — and who would own a conversational channel?",
      "What is the estimated daily phone and walk-in enquiry volume per outlet across the network?",
      "Can the remittance platform be queried in real time to confirm payout readiness?",
      "What proportion of pawn tickets lapse to forfeiture, and how are reminders handled today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A mother in Bohol calls and is told in Cebuano that her son's padala is ready at the outlet two streets away and exactly what ID to bring.",
  },

  "m-lhuillier": {
    operatingContext:
      "M Lhuillier operates the ML Kwarta Padala domestic remittance network across roughly three thousand branches nationwide, alongside pawnshop lending, foreign exchange, insurance products and the ML Wallet digital application. Its heritage is Cebu-based and its network strength runs deep through the Visayas and Mindanao as well as Luzon, serving a mass-market customer base for whom the branch counter has been the primary financial touchpoint for decades. The ML Wallet represents an attempt to bring that base into digital transacting, which creates a two-population servicing reality: long-standing over-the-counter customers who call or walk in with padala tracking and pawn questions, and wallet users who encounter digital transaction failures and account issues. Customers speak Cebuano, Tagalog and other regional languages, reaching the company by voice, SMS, Messenger and increasingly in-app.",
    strategicPressure: [
      { text: "M Lhuillier operates the ML Kwarta Padala network across roughly three thousand branches alongside a wallet application, giving it both over-the-counter and digital servicing obligations simultaneously.", kind: "verified" },
      { text: "Domestic remittance is increasingly contested by wallets and instant bank transfer rails, so over-the-counter networks must compete on service quality and convenience rather than on reach alone.", kind: "inference" },
      { text: "Wallet adoption creates a new support category — failed top-ups, transfers and account issues — from a customer base with lower digital confidence than typical fintech users.", kind: "inference" },
      { text: "The pace of ML Wallet adoption relative to over-the-counter volume determines whether the servicing case is voice-first or increasingly digital, and should shape channel priority in the pilot.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. M Lhuillier is a branch-network financial-services operator whose technology investment goes into transaction and wallet platforms, not conversational infrastructure. Its branch-first heritage and organisational profile point clearly to procurement.",
    whyNotBuild:
      "The company has no capability to build speech, telephony or orchestration, and the regional-language requirement makes an internal effort even less plausible. What it needs is Cebuano and Tagalog voice that works for a mass-market base, grounded against its remittance, pawn and wallet systems, with BSP-grade conduct evidencing — all of which arrive as configuration on a platform and none of which it could assemble.",
    workflows: [
      {
        name: "Kwarta Padala tracking and payout guidance",
        friction: "Senders and recipients call branches or the customer line to ask whether a transfer is ready and where it can be collected, tying up counter and phone staff with pure lookups.",
        outcome: "Transfer status, payout readiness and nearest-branch guidance answered by voice in the customer's regional language at any hour, plus proactive ready-for-pickup notification to recipients.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Remittance platform", "Branch network data", "Transaction records", "Notification platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "ML Wallet transaction and account support",
        friction: "Wallet users experience failed top-ups, stuck transfers and blocked accounts, and the small support team must reconcile across systems while the user — often not digitally confident — assumes the money is gone.",
        outcome: "Reconciliation-aware automated resolution that establishes true transaction state and explains it plainly in the user's language, with account issues resolved conversationally rather than at a branch.",
        channels: ["In-app chat", "Voice", "Messenger"],
        systems: ["ML Wallet platform", "Transaction ledger", "Payment rail integrations", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Branch, rate and pawn-ticket enquiries",
        friction: "Customers phone branches for opening hours, fees, foreign-exchange rates and pawn renewal amounts, with answers depending on which staff member responds and interrupting counter service.",
        outcome: "Consistent governed answers on fees, rates, branch logistics and pawn positions delivered conversationally, removing routine interruptions across three thousand branches.",
        channels: ["Voice", "SMS", "Messenger"],
        systems: ["Fee/rate master", "Branch master data", "Pawn loan system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A nationwide branch network for over-the-counter remittance, pawn and forex services",
        "The ML Wallet application with in-app transaction features and support",
        "SMS notifications for remittance transactions",
        "Messenger and phone-based customer service",
      ],
      gaps: [
        "Recipients are not proactively told when a transfer is ready for pickup",
        "Wallet transaction failures require manual reconciliation before the user gets an answer",
        "Fee, rate and branch answers vary by whoever answers the phone",
        "No voice servicing operates in Cebuano despite the network's Visayas heartland",
      ],
    },
    risks: [
      "BSP rules for money-service businesses and electronic money issuers impose disclosure, complaint-handling and redress obligations that automated conversations must satisfy with auditable records.",
      "The Philippine Data Privacy Act governs remittance, wallet and identity data, requiring clear consent and controlled retention especially for a base with lower digital literacy.",
      "Cebuano and Tagalog voice quality for a mass-market provincial base is the decisive technical risk and must be validated in the Visayas before commitment.",
    ],
    economics: {
      volumeMonthly: 1800000,
      costPerInteraction: 0.5,
      automationRate: 0.6,
      basis: "Seller assumptions covering combined branch enquiry and wallet support volume across a three-thousand-branch network; branch-level enquiry load must be measured in discovery as it is unlikely to be tracked centrally.",
    },
    pilotScope:
      "A Launch-scope pilot on Kwarta Padala tracking with proactive ready-for-pickup notification by voice and SMS in Cebuano and Tagalog for a Visayas region, integrated to the remittance platform, measured on branch-phone deflection and pickup speed.",
    expansion: [
      "Add ML Wallet transaction and account support with reconciliation-aware resolution",
      "Extend to branch, rate and pawn-ticket enquiries across the national network",
      "Add further regional-language coverage aligned to branch concentrations",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Remittance Operations",
      "Head of ML Wallet / Digital Business",
      "Head of Branch Operations",
      "Head of Information Technology",
    ],
    discovery: [
      "How is ML Wallet adoption trending relative to over-the-counter transaction volume?",
      "What is the estimated phone enquiry volume per branch, and how much counter time does it consume?",
      "Can the remittance platform confirm payout readiness in real time for proactive notification?",
      "What wallet support volume does the team handle monthly, and what proportion involves cross-rail reconciliation?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A recipient in Cebu gets a voice call in Cebuano the moment her ML Kwarta Padala is ready, is told the nearest branch and the ID required, and collects it the same morning.",
  },

  "sun-life-philippines": {
    operatingContext:
      "Sun Life Philippines is consistently among the country's leading life insurers by premium income, operating through a large tied-advisor force alongside growing bancassurance distribution and a substantial mutual-fund and investment business. Its customer base spans middle-class and affluent Filipinos who bought protection or investment-linked products through an advisor relationship, plus a growing digitally-acquired cohort. The advisor model shapes its servicing reality: customers default to contacting their advisor, and when that advisor becomes unavailable or leaves, the policyholder falls back on a contact centre that must handle policy servicing, premium payment and persistency, fund and investment queries, and claims — all in Taglish and English across voice, Messenger, Viber, email and the customer portal. Premium persistency and claims experience are the two moments that determine whether the relationship survives.",
    strategicPressure: [
      { text: "Sun Life operates as a global insurer with regional and global technology standards, so the Philippine unit's customer-facing AI path is shaped by group platform decisions rather than purely local choice.", kind: "verified" },
      { text: "Insurance Commission conduct requirements in the Philippines govern disclosure and suitability for investment-linked products, making consistent, auditable customer communication a compliance asset.", kind: "verified" },
      { text: "An advisor-led model creates an orphaned-policyholder population whose persistency depends entirely on the contact centre, and whose lapse behaviour is a measurable, addressable revenue leak.", kind: "inference" },
      { text: "Advisor support itself is an under-considered opportunity: advisors spend significant time on administrative queries that a conversational desk could absorb, freeing selling time.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Sun Life country units deploy regionally or globally selected platforms; the Philippine technology organisation delivers and integrates rather than building conversational infrastructure. There is no evidence of local speech or orchestration engineering.",
    whyNotBuild:
      "Group governance makes a locally-built customer-facing AI stack effectively unapprovable, and the requirements confirm the logic: Taglish and English speech, telephony integration, deterministic execution against policy administration and fund systems, and evaluation strict enough to defend suitability conversations to the Insurance Commission. Insurers procure this with vendor accountability because the conduct exposure of an unsupervised automated conversation about an investment-linked product is severe.",
    workflows: [
      {
        name: "Policy servicing and fund-value enquiries",
        friction: "Policyholders call their advisor or the contact centre for fund values, premium due dates, statement requests and policy details, and each is a retrieval task consuming either advisor selling time or agent capacity.",
        outcome: "Instant grounded policy and fund-value answers in Taglish or English with strict boundaries away from advice, releasing advisor time and giving policyholders answers at any hour.",
        channels: ["Voice", "Messenger", "Viber", "Portal chat"],
        systems: ["Policy administration system", "Investment/fund platform", "Statement generation", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Premium persistency and lapse-prevention outreach",
        friction: "Missed premiums are chased with generic reminders and, for orphaned policies, with nothing at all, so policies lapse silently and years of expected value are lost on customers who cost money to acquire.",
        outcome: "Two-way reminder conversations in Taglish with payment executed in-channel, non-payment reasons captured, and affordability or surrender intent escalated to retention specialists with context.",
        channels: ["Voice", "Viber", "SMS", "Messenger"],
        systems: ["Policy administration system", "Payment gateway", "Retention workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims intake and proactive status communication",
        friction: "Claimants file through advisors or the contact centre, submit documents that bounce on completeness, and then chase status repeatedly during a period of genuine personal difficulty.",
        outcome: "Structured claim intake with documents validated in-conversation and stage changes pushed proactively, so the claim experience becomes the moment that confirms the relationship rather than damaging it.",
        channels: ["Messenger", "Viber", "Voice", "Email"],
        systems: ["Claims management system", "Policy administration", "Document management", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile application for policy details, fund values and premium payment",
        "A contact centre with IVR handling policy, fund and claims queries",
        "A large tied-advisor force serving as the primary customer relationship",
        "Messenger, Viber and email servicing channels with human agents",
      ],
      gaps: [
        "Policyholders cannot get fund values or policy answers outside advisor and contact-centre hours",
        "Orphaned policyholders receive no systematic persistency conversation",
        "Claim status is pull-only, generating repeated chase contacts during a difficult period",
        "Advisors spend selling time on administrative queries with no self-service alternative",
      ],
    },
    risks: [
      "Insurance Commission conduct and disclosure rules for investment-linked products limit what an automated agent may say about returns and suitability, requiring hard guardrails and demonstrable escalation.",
      "The Philippine Data Privacy Act governs policyholder, health and financial data handled in conversations, requiring consent, controlled retention and care over any cross-border processing.",
      "Sun Life group AI governance and third-party-risk standards will gate vendor selection and may impose regional hosting requirements — establish these before architecture is fixed.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions covering policy servicing, fund enquiries, premium reminders and claims contacts across a large in-force book; validate against the insurer's contact-centre and persistency reporting.",
    },
    pilotScope:
      "A Launch-scope pilot on policy servicing and fund-value enquiries plus premium-persistency outreach over voice and Viber in Taglish and English, integrated to policy administration and the payment gateway, measured on containment, advisor time released and lapse-rate change.",
    expansion: [
      "Add claims intake with in-conversation document validation and proactive status pushes",
      "Extend to an advisor support desk absorbing administrative queries to free selling time",
      "Package the deployment for replication across Sun Life's other Asian country units",
    ],
    stakeholders: [
      "Chief Client Officer / Head of Client Experience",
      "Head of Distribution / Advisor Force",
      "Head of Client Services and Contact Centre",
      "Chief Information Officer",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "What decision latitude does the Philippine unit have relative to Sun Life Asia's regional digital strategy?",
      "How large is the orphaned-policy population, and how does its persistency compare with advisor-serviced policies?",
      "How much advisor time is consumed by administrative and retrieval queries rather than selling?",
      "What are the Insurance Commission boundaries on what an automated agent may say about fund performance and suitability?",
    ],
    flowTemplate: "retention",
    scenario: "A Sun Life policyholder in Manila whose advisor has left gets a Taglish reminder on Viber before her premium lapses, pays in the same thread, and keeps a policy she nearly lost by accident.",
  },
};
