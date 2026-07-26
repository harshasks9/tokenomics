// Deep analysis blocks for India BFSI qualified profiles (second half of the
// universe: affordable-housing tail, microfinance, life, general and health
// insurance, broking and wealth, asset management, and RTA infrastructure).
// Evidence discipline per PROFILE_DISCLAIMER — confidence labels are honest,
// no fabricated figures, quotes, dates or URLs.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_INDIA_BFSI_B: Record<string, ProfileAnalysis> = {
  "india-shelter-finance": {
    operatingContext:
      "India Shelter Finance Corporation is a Gurugram-headquartered affordable-housing finance company that writes small-ticket home loans and loans against property to self-employed, informally-documented borrowers — shopkeepers, small contractors, dairy and transport operators — who cannot produce salary slips for a mainstream bank. Its book is concentrated in Rajasthan, Madhya Pradesh, Maharashtra, Uttar Pradesh and Gujarat, sourced entirely through its own branch network rather than DSAs, with credit assessment done by field officers who physically visit the borrower's home and business. Collections are equally field-led: branch staff and tele-callers chase EMIs from customers who often repay through NACH mandates that bounce when informal cash flows dip. The company listed on the Indian exchanges and now carries public-market scrutiny of its cost-to-income ratio while it keeps opening branches in deeper districts.",
    strategicPressure: [
      { text: "Its target segment is self-employed borrowers without formal income documentation, which structurally requires more human touch per account than salaried-prime housing finance", kind: "verified" },
      { text: "Growth is delivered by adding physical branches in tier-3 and tier-4 towns, so every incremental crore of AUM adds proportional telecalling and field-collection load rather than leveraging a fixed cost base", kind: "inference" },
      { text: "As a listed affordable-housing lender it is now judged quarter to quarter on cost-to-income and early-bucket asset quality, making servicing cost a board-level metric rather than an operations detail", kind: "inference" },
      { text: "Hindi-belt and Marwari-speaking borrowers with low app literacy mean voice and WhatsApp are the only channels that actually reach the book, and staffing that in-house scales linearly with branches", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. India Shelter's differentiation is underwriting judgement on informal income and physical proximity to the borrower, not software. Its technology function runs a vendor loan-management system, a field-officer mobile app and integrations to bureaus and payment rails — a configuration-and-integration organization, not a platform-engineering one. There is no public evidence of an in-house AI or speech team, and at its scale a dedicated conversational-AI build would consume a visible share of annual technology spend for a capability available as a packaged service.",
    whyNotBuild:
      "Building this would mean owning Hindi and Marwari speech recognition tuned for noisy rural telephony, PSTN and WhatsApp Business integration with carrier-grade reliability, an orchestration layer that writes promises-to-pay back into the loan-management system, and an evaluation framework that can prove to RBI-facing auditors that every collections call stayed inside the recovery-agent code of conduct. Each of those is a specialist product line. A lender whose engineering headcount is measured in dozens will not staff four of them to reduce telecalling cost.",
    workflows: [
      {
        name: "Pre-due and bounce-recovery EMI outreach in Hindi and Marwari",
        friction: "NACH presentation fails on the due date, and the borrower only learns about it when a branch tele-caller reaches them days later — by which time bounce charges have accrued and the account has slipped a bucket",
        outcome: "Every borrower is contacted on the due date and on the bounce date in their own language with a live payment link, lifting on-time collection and shrinking the early-bucket book",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / e-mandate and payment gateway", "Collections module", "Customer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan-application status and document chase for in-flight files",
        friction: "Self-employed applicants submit property papers and income proxies in fragments; a missing document stalls the file silently and the applicant calls the branch repeatedly to ask where it stands",
        outcome: "Applicants receive proactive stage updates and a guided checklist, cutting sanction turnaround and removing status calls from branch staff",
        channels: ["WhatsApp", "Voice"],
        systems: ["Loan origination system", "Document management", "Branch workflow queue"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Post-disbursement servicing: statements, amortisation, foreclosure and NOC",
        friction: "Requests for interest certificates, part-payment impact and no-objection certificates arrive at branches and are handled manually, and closure documents take weeks to reach borrowers who have already repaid",
        outcome: "Routine account servicing completes in-conversation with documents delivered on the channel the borrower uses, freeing branch capacity for sourcing",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Document management", "Email or messaging delivery"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Branch-led servicing where the sourcing branch remains the borrower's default point of contact",
        "A customer-facing mobile app and web portal for statements and payments, used mainly by the more digitally confident slice of the book",
        "SMS and NACH-mandate notifications tied to due dates and bounces",
        "An in-house tele-calling team working collections lists during permitted hours",
      ],
      gaps: [
        "A borrower cannot resolve a bounced EMI end to end in one conversation — reason, revised amount, payment and confirmation",
        "No proactive stage-by-stage communication on an in-flight loan application in the borrower's own language",
        "Foreclosure quotes, part-payment simulations and NOC issuance still require branch involvement",
        "No consistent after-hours channel, although self-employed borrowers are most reachable in the evening",
      ],
    },
    risks: [
      "RBI recovery-agent norms and the fair-practices code restrict contact hours and prohibit any coercive or misleading language — every automated collections utterance must be scripted, logged and auditable",
      "RBI digital-lending directions require clear disclosure of who is contacting the borrower and on whose behalf, which constrains how an automated agent introduces itself",
      "TRAI commercial-communication rules and DLT registration govern templated outbound messaging, and DPDP consent obligations apply to borrower contact data shared with any processor",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.2,
      automationRate: 0.5,
      basis: "Seller assumptions only — interaction volume is estimated from an affordable-housing book serviced monthly across collections, application status and account queries, and cost per interaction reflects Indian in-house tele-calling economics; all three must be replaced with the customer's own figures in discovery.",
    },
    pilotScope:
      "An eight-week collections pilot on one state cluster: due-date and bounce-date outreach in Hindi and Marwari for a defined borrower cohort, with live payment links, promise-to-pay written back into the loan-management system, and hardship cases routed to a named branch officer.",
    expansion: [
      "Extend collections outreach across all operating states and add later delinquency buckets with policy-bounded settlement conversation",
      "Add the loan-application status and document-chase workflow so sourcing and servicing share one conversational front door",
      "Open inbound servicing for statements, foreclosure quotes and NOC requests, retiring branch-handled routine queries",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "National Head of Collections",
      "Chief Technology Officer",
      "Head of Customer Service",
      "Chief Risk and Compliance Officer",
    ],
    discovery: [
      "What share of your EMI collections is recovered through tele-calling versus a field visit, and what does each cost you per resolved account?",
      "How many borrowers per month have a NACH presentation fail, and how long is the gap between the bounce and the first contact attempt?",
      "Which languages does your tele-calling team actually cover today, and which districts are you unable to staff properly?",
      "Who signs off on collections scripts, and what evidence would your compliance team need to be comfortable with an automated agent making those calls?",
    ],
    flowTemplate: "collections",
    scenario:
      "A self-employed shop owner in Jaipur has an India Shelter EMI bounce on presentation day; the agent calls in Marwari, explains the shortfall, and takes payment on a link before the account slips a bucket.",
  },

  "repco-home-finance": {
    operatingContext:
      "Repco Home Finance is a Chennai-headquartered housing finance company promoted by Repco Bank, a body with roots in serving repatriates from Sri Lanka and Burma, and it retains a quasi-public institutional character in its governance and staffing. Its lending is heavily weighted to Tamil Nadu with adjacent presence in Karnataka, Andhra Pradesh, Telangana, Kerala and Maharashtra, and a large share of the book is self-employed non-professional borrowers rather than salaried customers. Loans are sourced and serviced through a modest branch and satellite-centre network staffed lean by design, with the branch remaining the borrower's relationship point for the full loan tenure. Borrowers overwhelmingly transact in Tamil, and phone contact with the branch is the default service channel for anything beyond an EMI debit.",
    strategicPressure: [
      { text: "The book skews to self-employed non-professional borrowers, a segment that historically demands closer monitoring and more servicing contact than salaried housing finance", kind: "verified" },
      { text: "Competition for the same Tamil Nadu self-employed housing customer has intensified from newer affordable-housing lenders and banks, putting pressure on both spread and service expectations", kind: "inference" },
      { text: "A lean, quasi-public staffing model means servicing capacity cannot flex with volume; branch officers absorb statement, reset and closure-document requests alongside sourcing targets", kind: "inference" },
      { text: "Tamil-first automated servicing would let it defend a service reputation without adding headcount, but decision cycles under a co-operative-linked promoter are likely to be slow", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Repco runs a conservative technology estate centred on a vendor core lending system, and its institutional culture is procurement-driven with an emphasis on proven, auditable systems rather than experimentation. There is no public signal of an internal data-science or conversational-AI capability, and its scale of technology spending does not support one. It will consume a packaged, contracted capability with defined service levels.",
    whyNotBuild:
      "The stack required — Tamil speech recognition and synthesis that handles code-mixed English financial vocabulary, telephony integration that survives rural mobile quality, orchestration into a legacy loan-management system, and evaluation evidence for audit and inspection — is four distinct engineering disciplines. Repco's technology organisation is sized to run and integrate systems, not to build and continuously retrain speech and language models. Buying it as a service with contractual accountability is the only path its governance would approve.",
    workflows: [
      {
        name: "Tamil-language account servicing: statements, interest certificates and amortisation",
        friction: "Borrowers call or walk into the branch for provisional interest certificates and repayment statements, especially in the tax-filing window, and branch officers produce them manually one at a time",
        outcome: "Statements and certificates are requested and delivered inside a Tamil conversation on any day of the year, removing a predictable seasonal load from branches",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Document generation", "Customer master"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Foreclosure, part-prepayment and closure-document servicing",
        friction: "A borrower closing a loan must coordinate a foreclosure quote, payment, property-document release and no-objection certificate across the branch and head office, with weeks of follow-up calls and no visibility",
        outcome: "Closure is a tracked, communicated journey with proactive status at each step, protecting goodwill at the moment a borrower is most likely to talk about the lender",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Document custody records", "Branch workflow queue"],
        value: 3,
        complexity: 2,
      },
      {
        name: "EMI reminder and early-bucket follow-up for self-employed borrowers",
        friction: "Self-employed borrowers with lumpy cash flows miss presentation dates, and follow-up depends on which branch officer has time that week, producing inconsistent contact coverage",
        outcome: "Consistent, policy-timed reminders and bounce follow-up in Tamil across the whole book, with promises recorded and chased automatically",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "NACH / e-mandate", "Collections module"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch and satellite-centre servicing with the originating branch as the borrower's relationship anchor",
        "A customer web portal and mobile app for balance and statement access",
        "SMS alerts on EMI debit, bounce and receipt",
        "A head-office customer-service line for escalations beyond branch capability",
      ],
      gaps: [
        "No Tamil-language self-service that completes a request end to end without a branch officer",
        "Foreclosure and property-document release has no borrower-visible status trail",
        "No structured after-hours or weekend servicing despite a self-employed borrower base",
        "Bounce follow-up coverage varies by branch workload rather than by policy",
      ],
    },
    risks: [
      "RBI fair-practices and recovery-agent norms apply to all borrower contact including automated calls, requiring recorded consent, permitted hours and non-coercive scripting",
      "Quasi-public promoter governance means vendor selection may follow committee and possibly tender-style processes with long approval cycles",
      "DPDP consent and data-residency expectations apply to borrower voice recordings, and property-document status is sensitive information requiring strict identity verification before disclosure",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions to validate in discovery — volume is inferred from a Tamil-Nadu-weighted housing book serviced through branch calls, statement requests and EMI follow-up, and cost per interaction reflects branch-officer time rather than a dedicated contact centre.",
    },
    pilotScope:
      "A ten-week Tamil-language inbound servicing pilot covering statements, provisional interest certificates and amortisation queries for borrowers in the Tamil Nadu branches, with authenticated document delivery on WhatsApp and clean handoff to the branch for anything outside scope.",
    expansion: [
      "Add the foreclosure, part-prepayment and closure-document journey with proactive status milestones",
      "Extend EMI reminders and early-bucket collections follow-up across the full book",
      "Roll the same deployment into Telugu, Kannada and Malayalam for the non-Tamil branches",
    ],
    stakeholders: [
      "Managing Director and Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Information Technology",
      "National Collections Head",
      "Company Secretary and Compliance Officer",
    ],
    discovery: [
      "How many statement and interest-certificate requests do your branches handle in the January-to-March window, and what does that displace?",
      "What is the current elapsed time from foreclosure request to property-document handover, and how many follow-up calls does a borrower typically make?",
      "Is EMI follow-up owned by the branch or by a central collections desk, and how is coverage measured?",
      "What is your approval path for a new customer-facing technology vendor, and does the promoter board need to be involved?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Coimbatore shop owner calls Repco in Tamil for a provisional interest certificate before filing tax; the agent verifies identity, generates it, and delivers it on WhatsApp in the same call.",
  },

  "creditaccess-grameen": {
    operatingContext:
      "CreditAccess Grameen is India's largest listed microfinance NBFC, headquartered in Bengaluru, lending predominantly to low-income women borrowers through the joint-liability group model with dominant positions in Karnataka, Maharashtra and Tamil Nadu and expanding presence across central and eastern India. Its operating rhythm is built on centre meetings where loan officers meet groups on a weekly or fortnightly cycle to collect repayments, disburse and enrol — meaning the business generates an enormous volume of structured, scheduled, repeating communication by design. Distribution runs through a large branch network of small offices staffed by field loan officers who are the borrower's only human interface with the institution. Borrowers hold basic phones as often as smartphones, transact in Kannada, Marathi, Tamil, Telugu and Hindi, and would not use an app-first servicing model even if one existed.",
    strategicPressure: [
      { text: "The joint-liability group model requires coordinated contact with every borrower on a weekly or fortnightly repayment cycle, which is a structural, non-discretionary communication workload", kind: "verified" },
      { text: "The Indian microfinance sector has been through a broad asset-quality stress cycle that pushed delinquency handling and hardship conversations on top of routine collection coordination", kind: "verified" },
      { text: "Loan-officer productivity is the core unit economic of the model; every hour spent on phone coordination, absent-member follow-up and meeting reconfirmation is an hour not spent on sourcing or credit assessment", kind: "inference" },
      { text: "Revised RBI microfinance rules place household-income assessment and borrower-protection obligations on the lender, increasing the volume of verifiable, documented borrower conversation required", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. CreditAccess Grameen's competitive advantage is field discipline, centre-level credit culture and cost control per borrower — capabilities that live in process and people, not in a software platform. Its technology investment goes into the core loan-management system, field-officer tablets and payment integration. There is no public evidence of a speech or conversational-AI engineering function, and its cost-conscious operating model would not tolerate the multi-year overhead of one.",
    whyNotBuild:
      "The capability needed is genuinely four products in one: multilingual speech recognition that works over low-bandwidth rural mobile networks in Kannada, Marathi and Tamil; carrier-grade telephony and WhatsApp orchestration at millions of contacts a month; an orchestration layer that reads and writes centre-meeting schedules and repayment status in the core system; and continuous evaluation that proves no automated call breached RBI borrower-protection norms. A lender whose cost advantage rests on minimal central overhead cannot justify building any of those, let alone all four.",
    workflows: [
      {
        name: "Pre-meeting centre confirmation and attendance reminders",
        friction: "Loan officers spend hours each week phoning group leaders to reconfirm centre meeting timing and chase likely absentees, and a poorly attended meeting means a return visit and a collection shortfall",
        outcome: "Every group leader and member receives an automated confirmation in their language ahead of the meeting, lifting attendance and returning field time to sourcing and credit work",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core loan management system", "Centre and group master", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Missed-instalment follow-up with hardship detection",
        friction: "When a member misses a centre payment the group covers it or the officer returns; either way the borrower conversation about why is inconsistent, undocumented and dependent on that officer's judgement",
        outcome: "Consistent, non-coercive follow-up in the borrower's language that captures the actual reason, surfaces genuine hardship for human handling and records every contact for audit",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core loan management system", "Collections and delinquency module", "Credit bureau reporting feed"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan-cycle renewal and eligibility outreach",
        friction: "Borrowers completing a cycle are re-engaged opportunistically at the next meeting, so eligible members drift to competing lenders in the window between closure and the officer's next visit",
        outcome: "Timely renewal outreach at closure with eligibility explained in-language and a branch appointment booked, defending customer retention in a market with heavy borrower overlap",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core loan management system", "Credit bureau enquiry", "Branch appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A dense branch network with field loan officers conducting scheduled centre meetings as the primary service channel",
        "Field-officer mobile applications for collection capture and enrolment at the centre",
        "SMS confirmations for disbursement and repayment receipt",
        "A central customer grievance and helpline function required under microfinance conduct norms",
      ],
      gaps: [
        "No scalable way for a borrower to ask about her outstanding balance, next due date or loan closure without waiting for the next meeting",
        "Meeting reconfirmation and absentee chasing remain manual loan-officer phone work",
        "Hardship and grievance conversations are captured inconsistently and are hard to evidence at inspection",
        "No proactive renewal contact between loan closure and the next centre visit",
      ],
    },
    risks: [
      "RBI microfinance directions and the sector code of conduct impose strict borrower-protection rules on recovery contact — permitted hours, prohibition of coercion, and mandatory grievance routing — all of which must be provable for automated conversations",
      "Automated outbound to low-income borrowers carries reputational and political sensitivity in microfinance; any perception of machine-driven pressure is an existential brand risk",
      "TRAI commercial-communication and DLT template rules apply to bulk messaging, and DPDP consent obligations cover borrower phone numbers held for group coordination",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions for discovery — volume is an order-of-magnitude estimate from a multi-million borrower base contacted on a weekly or fortnightly repayment cycle, and cost per interaction values loan-officer phone time rather than an outsourced contact centre.",
    },
    pilotScope:
      "A ten-week pilot across one regional cluster of branches: automated pre-meeting confirmation and absentee reminders in Kannada and Marathi for a defined set of centres, measured against attendance rate, on-time centre collection and loan-officer hours returned to field work.",
    expansion: [
      "Extend pre-meeting coordination to all operating states and add Tamil, Telugu and Hindi from the same deployment",
      "Add missed-instalment follow-up with hardship detection and mandatory human routing for vulnerability cues",
      "Open an inbound borrower line for balance, due-date and closure queries, reducing the questions loan officers field at meetings",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Chief Business Officer or Head of Operations",
      "Chief Technology Officer",
      "Head of Customer Grievance and Client Protection",
      "Chief Risk Officer",
    ],
    discovery: [
      "How many hours a week does a loan officer spend on phone coordination for centre meetings, and how is that measured today?",
      "What is your current centre-meeting attendance rate, and what does a repeat visit for a shortfall cost you?",
      "How do you evidence to an RBI inspection that recovery contact stayed within the code of conduct?",
      "Which languages and dialects are genuinely unserved by your current communication, and where does that hurt most?",
    ],
    flowTemplate: "collections",
    scenario:
      "A CreditAccess Grameen centre in rural Karnataka gets an automated Kannada confirmation the evening before its meeting, and two likely absentees are reminded and reschedule payment in the same thread.",
  },

  "spandana-sphoorty": {
    operatingContext:
      "Spandana Sphoorty Financial is a Hyderabad-headquartered NBFC-MFI lending to low-income women borrowers through joint-liability groups, with a footprint concentrated in Madhya Pradesh, Odisha, Karnataka, Maharashtra and the Telugu states. It is one of the few Indian microfinance institutions to have survived the Andhra Pradesh crisis and a subsequent restructuring, and it has more recently been working through a fresh cycle of elevated delinquency that has made collections effectiveness an existential rather than operational question. The business runs through branch offices and field loan officers who conduct group meetings, disburse and collect — the same weekly rhythm as the rest of the sector but under materially tighter management scrutiny. Borrowers are rural and semi-urban women who transact in Telugu, Odia, Hindi, Kannada and Marathi and are reachable only by voice.",
    strategicPressure: [
      { text: "The company has been through a period of elevated delinquency and management turnover that puts collections performance at the centre of its recovery plan", kind: "verified" },
      { text: "Turnaround economics mean it must lift contact coverage on stressed accounts without adding the field headcount that caused cost pressure in the first place", kind: "inference" },
      { text: "Its geographic mix across Odisha, MP and the Telugu states requires five or more languages from a single collections operation — a staffing problem that automation solves structurally", kind: "inference" },
      { text: "Budget headroom for new vendor spend is genuinely constrained during a credit-repair phase, so the commercial construct will matter as much as the capability", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Spandana has no plausible internal build path: management attention and capital are committed to credit repair and portfolio quality, and its technology function operates vendor systems for loan management and field collection. A company in turnaround does not start a multi-year speech and orchestration engineering programme; it buys capacity it can turn on inside a quarter and turn off if the plan changes.",
    whyNotBuild:
      "Delinquency outreach at scale needs Telugu and Odia speech models that perform on rural mobile audio, an outbound engine that respects permitted contact windows across state holidays, orchestration that writes outcomes into the collections module in real time, and — most critically for a company under regulatory and reputational scrutiny — an evaluation layer that can prove no call was coercive. Spandana cannot build any of those on a turnaround timeline, and the compliance evidence requirement alone argues for a vendor who carries contractual accountability.",
    workflows: [
      {
        name: "Early-bucket delinquency outreach with hardship detection and routing",
        friction: "Stressed accounts are worked by field officers whose capacity is fixed, so a large share of newly delinquent borrowers get no contact in the first critical fortnight and roll into harder buckets",
        outcome: "Full contact coverage of the newly delinquent book within days, with genuine hardship cases identified conversationally and routed to a human specialist instead of being pressed",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core loan management system", "Collections and delinquency module", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Repayment reminders and centre-meeting coordination",
        friction: "Reminder coverage depends on which officer has spare time, so on-time repayment varies by branch rather than by borrower behaviour",
        outcome: "Uniform, policy-timed reminders in five languages across every branch, making on-time collection a function of process rather than local staffing",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core loan management system", "Centre and group master", "Payment collection rails"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Restructuring and settlement conversation within an approved matrix",
        friction: "Where a borrower genuinely cannot pay the original schedule, the terms offered depend on which officer or manager is involved, creating inconsistency that is hard to defend at audit",
        outcome: "Restructuring options are presented only from the approved matrix with the borrower's understanding confirmed and the entire exchange recorded, with anything outside the matrix escalated to a human",
        channels: ["Voice"],
        systems: ["Collections module", "Approved restructuring policy matrix", "Credit bureau reporting feed"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Branch and field-officer group-meeting servicing as the primary borrower channel",
        "A field mobile application for collection capture and member records",
        "SMS confirmations on disbursement and repayment",
        "A grievance-redressal helpline as required under microfinance conduct norms",
      ],
      gaps: [
        "No mechanism to contact the entire newly delinquent cohort within days of a missed instalment",
        "No consistent, recorded capture of why a borrower missed a payment",
        "Borrowers cannot check outstanding balance or next due date outside a meeting",
        "Restructuring conversations are not evidenced in a form that survives audit scrutiny",
      ],
    },
    risks: [
      "RBI microfinance borrower-protection norms and recovery-agent conduct rules apply in full to automated contact — permitted hours, no coercion, mandatory grievance routing, all provable",
      "Sector-wide political sensitivity around microfinance recovery means any perception of automated pressure on low-income women borrowers is a severe reputational risk requiring conservative scripting and visible human escalation",
      "Budget constraints during credit repair may push the commercial model toward usage-based pricing rather than a fixed implementation commitment",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions to validate — volume estimates monthly borrower contacts across reminders and delinquency outreach for a book of this size, and cost per interaction values field and tele-calling time; both must be checked against the customer's own collections cost model.",
    },
    pilotScope:
      "An eight-week delinquency-outreach pilot on the Odisha and Madhya Pradesh clusters covering the newly-delinquent cohort in Odia and Hindi, with mandatory hardship routing to a human specialist and roll-rate measured against a matched control set of branches.",
    expansion: [
      "Extend outreach to Telugu, Kannada and Marathi geographies from the same deployment",
      "Add routine pre-due repayment reminders across the full performing book",
      "Introduce policy-bounded restructuring conversations with full recording and human escalation",
    ],
    stakeholders: [
      "Managing Director and Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What proportion of accounts that miss an instalment receive a contact attempt in the first fifteen days, and what limits that?",
      "How do you currently distinguish a genuine hardship case from a willful default, and at what point does a human get involved?",
      "What is your roll rate from the first delinquency bucket to the second, and what would a improvement of a few percentage points be worth?",
      "Given the credit-repair phase, would a usage-based commercial model be easier to approve than a fixed implementation fee?",
    ],
    flowTemplate: "collections",
    scenario:
      "A Spandana borrower in Odisha misses a group repayment; the agent calls in Odia, learns her husband's work stopped after a flood, and routes her to a hardship specialist rather than pressing for payment.",
  },

  "fusion-finance": {
    operatingContext:
      "Fusion Finance, formerly Fusion Micro Finance, is an NBFC-MFI whose book is concentrated in the northern and eastern Hindi belt — Uttar Pradesh, Bihar, Madhya Pradesh and Odisha — lending to rural women through joint-liability groups. Like its peers it operates through small branch offices with field loan officers running group meetings on a weekly or fortnightly cycle, and it has been working through a period of elevated delinquency that has made early-bucket contact intensity the operational lever management watches most closely. Its borrowers are overwhelmingly voice-only as a channel reality: basic handsets, shared phones within households, and effectively no app usage. Repayments run through the centre meeting and cash collection rather than digital rails, which makes every missed instalment a physical follow-up problem.",
    strategicPressure: [
      { text: "Fusion has been managing through an elevated-delinquency cycle in its core Hindi-belt geographies that has dominated management and investor attention", kind: "verified" },
      { text: "Early-bucket contact rate is the single lever that most directly influences roll rates in group microfinance, and field capacity caps how much of the delinquent book can be touched", kind: "inference" },
      { text: "Regional Hindi dialect variation across eastern UP, Bihar and MP is a real servicing constraint that generic Hindi call scripts handle poorly", kind: "inference" },
      { text: "With management bandwidth consumed by credit repair, any solution must be operable by the collections function without a technology programme wrapped around it", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Fusion's technology footprint is a vendor core lending system plus field applications, and its organisation has no engineering bench for speech, telephony or model evaluation. A company in the middle of a credit-quality repair does not launch a platform build; it buys contact capacity with a measurable effect on roll rates. The commercial decision will be made by the collections and operations leadership, not by a technology strategy process.",
    whyNotBuild:
      "Reaching a Bihar or eastern-UP borrower on a low-quality mobile connection in her dialect requires speech models tuned well beyond standard Hindi, an outbound engine that manages permitted-hours compliance across states, orchestration that closes the loop into the collections module, and audit-grade evaluation of every conversation for borrower-protection compliance. None of those is adjacent to what Fusion's team does today, and all four would have to work before a single roll-rate percentage point moved.",
    workflows: [
      {
        name: "Early-bucket delinquency calling in Hindi-belt dialects",
        friction: "Field officers can only revisit a fraction of newly delinquent borrowers before the next centre cycle, so the first meaningful contact often happens weeks after the miss",
        outcome: "Every newly delinquent borrower is contacted within days in a dialect she understands, with the reason captured and a payment plan or human escalation set",
        channels: ["Voice", "SMS"],
        systems: ["Core loan management system", "Collections and delinquency module", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-meeting repayment reminders and centre coordination",
        friction: "Group leaders are reminded by phone when the officer remembers, and attendance variability turns a scheduled collection into a return visit",
        outcome: "Reliable reminders to every group and member ahead of the meeting, improving attendance and cutting repeat field visits",
        channels: ["Voice", "SMS"],
        systems: ["Core loan management system", "Centre and group master", "Branch scheduling"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Borrower verification and post-disbursement confirmation calls",
        friction: "Confirming that a disbursed borrower actually received her funds, understood the terms and was not subject to intermediary leakage is a manual audit sample rather than full coverage",
        outcome: "Full-coverage recorded confirmation calls after disbursement, giving both a fraud control and documented evidence of borrower understanding for inspection",
        channels: ["Voice"],
        systems: ["Core loan management system", "Disbursement records", "Internal audit case system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch offices with field loan officers conducting scheduled group meetings as the primary channel",
        "Field mobile applications for collection and member data capture",
        "SMS notifications for disbursement and repayment receipt",
        "A grievance helpline maintained under microfinance conduct requirements",
      ],
      gaps: [
        "No way to contact the full newly-delinquent cohort within the first fortnight",
        "Reminder coverage before centre meetings depends entirely on individual officer effort",
        "Post-disbursement borrower confirmation is sampled rather than complete",
        "Borrowers have no channel to ask a simple balance or due-date question between meetings",
      ],
    },
    risks: [
      "RBI microfinance and recovery-agent conduct norms strictly bound automated collections contact — hours, tone, escalation, and full auditability of every call",
      "Dialect performance in eastern UP and Bihar is a genuine technical risk that must be proven on real recorded audio before scale-up, not assumed",
      "Reputational exposure is high in a stressed microfinance market, so human escalation on any hardship or distress cue must be visible and unconditional",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.85,
      automationRate: 0.55,
      basis: "Seller assumptions for discovery — monthly interaction volume is estimated from reminder plus delinquency contact across a Hindi-belt group-lending book, and cost per interaction reflects field-officer and tele-calling time rather than an outsourced centre.",
    },
    pilotScope:
      "An eight-week early-bucket collections pilot across a defined set of Bihar and eastern Uttar Pradesh branches, calling all borrowers within seven days of a missed instalment in regional Hindi, with roll rate measured against matched control branches.",
    expansion: [
      "Extend to Odisha and Madhya Pradesh with Odia and regional Hindi coverage from one deployment",
      "Add pre-meeting reminders and centre coordination across the performing book",
      "Introduce full-coverage post-disbursement confirmation calls as an audit and fraud control",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "National Head of Collections",
      "Head of Information Technology",
      "Head of Internal Audit and Compliance",
    ],
    discovery: [
      "In your recovery plan, is early-bucket contact rate a named metric with a target, and who owns it?",
      "How many days on average pass between a missed instalment and the first borrower contact?",
      "Have you tested any automated calling in eastern UP or Bihar dialects, and what happened?",
      "What evidence does your audit function need to accept an automated call as a valid borrower contact?",
    ],
    flowTemplate: "collections",
    scenario:
      "A Fusion borrower in Bihar misses her fortnightly instalment; within four days an agent calls in regional Hindi, records the reason and books a payment at the next centre meeting.",
  },

  "satin-creditcare": {
    operatingContext:
      "Satin Creditcare Network is a Gurugram-headquartered NBFC-MFI with one of the deepest Uttar Pradesh and Bihar footprints in Indian microfinance, lending to rural women through joint-liability groups and operating alongside subsidiaries in affordable housing finance and MSME lending. That group structure means a single borrower household can be a target for a microfinance loan, a small housing loan and a business loan — multiplying the number of legitimate communication touchpoints per household. Its field model is the sector standard: small branches, loan officers, scheduled centre meetings, cash and digital collection at the meeting. Borrower communication happens in regional Hindi dialects that differ meaningfully between western UP, eastern UP and Bihar, and phone ownership substantially exceeds app literacy across the base.",
    strategicPressure: [
      { text: "Satin operates a group structure spanning microfinance, affordable housing finance and MSME lending, so borrower households sit in more than one product funnel", kind: "verified" },
      { text: "Its concentration in Uttar Pradesh and Bihar exposes it to regional repayment-stress cycles, making contact coverage on delinquent accounts a recurring management priority", kind: "inference" },
      { text: "Cross-sell into the housing and MSME subsidiaries depends on timely, in-language outreach to graduating microfinance borrowers, which field officers cannot systematically deliver", kind: "inference" },
      { text: "As a long-listed company with lean technology spending, it evaluates operational tooling on payback rather than strategic-platform arguments", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Satin's technology organisation configures and integrates vendor lending systems and field applications; there is no public signal of internal speech, NLP or conversational-orchestration engineering. Its listed-company cost discipline and multi-entity structure favour a single procured capability that can be pointed at three lending businesses rather than three internal builds.",
    whyNotBuild:
      "The requirement spans regional Hindi dialect speech recognition, compliant multi-entity outbound telephony, orchestration across three different lending systems in the group, and evaluation evidence acceptable to RBI inspection for microfinance recovery contact. Building even one of those to production quality would exceed Satin's entire annual discretionary technology budget for a capability it can rent with contractual service levels.",
    workflows: [
      {
        name: "Centre-meeting coordination and repayment reminders in Hindi dialects",
        friction: "Loan officers manually phone group leaders to confirm meeting timing and chase members, and coverage collapses whenever a branch is short-staffed",
        outcome: "Uniform pre-meeting confirmation and reminder coverage across every branch and dialect, lifting attendance and freeing officer hours",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core loan management system", "Centre and group master", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Delinquency follow-up with hardship routing across the group book",
        friction: "A household stressed on its microfinance loan is often also behind on a subsidiary housing or MSME loan, but the three collections processes contact her separately with no shared context",
        outcome: "Coordinated, non-duplicative household-level contact with hardship identified once and routed to a human, reducing both borrower fatigue and duplicated effort",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core loan management system", "Housing finance subsidiary system", "MSME lending system", "Collections module"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Graduating-borrower cross-sell outreach into housing and MSME products",
        friction: "Borrowers completing a microfinance cycle who qualify for a small housing or business loan are only offered one if their officer happens to raise it at a meeting",
        outcome: "Systematic, consent-based outreach to eligible graduating borrowers in-language with a branch appointment booked, converting group-lending tenure into higher-ticket relationships",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core loan management system", "Credit bureau enquiry", "Subsidiary loan origination systems", "Branch appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large branch network with field loan officers conducting scheduled centre meetings",
        "Field mobile applications for collection capture and member records",
        "SMS notifications on disbursement, repayment and dues",
        "A grievance-redressal helpline as required by microfinance conduct norms",
      ],
      gaps: [
        "No shared household view across the microfinance, housing and MSME entities when contacting a stressed borrower",
        "Pre-meeting coordination is manual and coverage is uneven across branches",
        "Eligible graduating borrowers are not systematically approached for the group's other products",
        "No between-meeting channel for a borrower to check her balance or next due date",
      ],
    },
    risks: [
      "RBI microfinance directions and recovery-agent conduct rules bound the timing, tone and escalation of every automated collections contact and require full audit evidence",
      "Cross-entity contact within the group must respect DPDP purpose-limitation and consent boundaries — data collected for a microfinance loan cannot be freely repurposed for subsidiary marketing",
      "TRAI DLT registration and commercial-communication rules apply to cross-sell messaging, which is regulated differently from servicing and collections contact",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 0.85,
      automationRate: 0.55,
      basis: "Seller assumptions to validate in discovery — volume is inferred from reminder, collections and cross-sell contact across a UP and Bihar group-lending book, and cost per interaction values field-officer and tele-calling time.",
    },
    pilotScope:
      "An eight-week pilot across a Uttar Pradesh branch cluster covering pre-meeting confirmation and missed-instalment follow-up in regional Hindi, measured on centre attendance, on-time collection and loan-officer hours recovered.",
    expansion: [
      "Extend to Bihar and the eastern branches with dialect tuning validated on real recorded audio",
      "Add coordinated household-level delinquency contact spanning the housing and MSME subsidiaries",
      "Introduce consent-based cross-sell outreach for graduating microfinance borrowers",
    ],
    stakeholders: [
      "Managing Director",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Information Officer",
      "Head of Compliance and Client Protection",
    ],
    discovery: [
      "How different is your borrower conversation between western UP, eastern UP and Bihar, and has dialect ever broken a calling campaign?",
      "When a household is stressed across the microfinance and housing entities, who contacts them and in what order?",
      "What proportion of borrowers completing a cycle are offered a subsidiary product, and what limits that?",
      "What is the smallest measurable outcome that would justify extending a pilot across the network?",
    ],
    flowTemplate: "collections",
    scenario:
      "A Satin group leader in eastern Uttar Pradesh gets a dialect-accurate reminder the night before her centre meeting, and two members who were about to miss confirm they will attend.",
  },

  "annapurna-finance": {
    operatingContext:
      "Annapurna Finance is a Bhubaneswar-headquartered NBFC-MFI whose core strength is Odisha and eastern India, making it one of very few at-scale lenders operating natively in Odia-first geographies that mainstream servicing vendors and contact centres simply do not cover. It lends to rural low-income women through joint-liability groups and has diversified into micro-enterprise and small housing lending, operating through branch offices with field loan officers on the standard weekly-to-fortnightly meeting cycle. It is impact-investor-backed with a field-first institutional culture where the loan officer relationship is the product. Its service districts are cyclone- and flood-prone, which periodically converts routine repayment coordination into surge communication about moratoria, relief measures and rescheduling.",
    strategicPressure: [
      { text: "Annapurna's book is concentrated in Odisha and eastern India, geographies where Odia-language servicing is a genuine operational requirement rather than a nice-to-have", kind: "verified" },
      { text: "Its service areas experience recurring cyclone and flood events that trigger sudden, large-volume borrower communication about relief and rescheduling on top of normal cycles", kind: "verified" },
      { text: "Impact-investor governance brings client-protection reporting obligations that make documented, non-coercive borrower conversation an investor-facing metric, not just a regulatory one", kind: "inference" },
      { text: "Odia voice-model quality is effectively the entire value proposition here — if the speech performance is not convincing on real rural audio, there is no deal", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Annapurna's institutional capability is field operations and client protection in hard-to-serve geographies, not software engineering. Its technology estate is vendor-supplied loan management plus field applications, and impact-investor-backed MFIs run lean central functions by design. It will procure a capability with clear client-protection evidence rather than attempt anything internal.",
    whyNotBuild:
      "No Indian MFI has the bench to build Odia speech recognition and synthesis of production quality, and Odia is exactly the kind of language where generic models underperform without deliberate investment. Add compliant outbound telephony across a disaster-disrupted network, orchestration into the loan-management system, and evaluation evidence for both RBI inspection and impact-investor client-protection audits, and the build case disappears entirely.",
    workflows: [
      {
        name: "Odia-language repayment reminders and centre coordination",
        friction: "Reminder and meeting-confirmation calls are made personally by loan officers, and no external calling vendor can staff Odia at the quality the borrower base needs",
        outcome: "Reliable Odia-language reminders and confirmations at full coverage, restoring loan-officer time to sourcing and credit assessment",
        channels: ["Voice", "SMS"],
        systems: ["Core loan management system", "Centre and group master", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Disaster-period outreach: moratorium, relief and rescheduling notification",
        friction: "When a cyclone hits, the institution must reach tens of thousands of borrowers with relief and rescheduling information within days, and field staff are themselves affected and unreachable",
        outcome: "Surge outreach absorbed without field capacity, with every affected borrower informed of relief terms in Odia and their circumstances captured for portfolio decisions",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core loan management system", "Branch and geography master", "Collections module"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Missed-instalment follow-up with client-protection evidence",
        friction: "Follow-up on missed payments varies by officer, and the institution cannot demonstrate to investors or regulators that every recovery contact met client-protection standards",
        outcome: "Consistent, recorded, non-coercive follow-up with hardship routed to humans and a complete evidence trail for both RBI and impact-investor reporting",
        channels: ["Voice"],
        systems: ["Collections and delinquency module", "Grievance-redressal case system", "Core loan management system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch offices with field loan officers running scheduled group meetings in local languages",
        "Field mobile applications for collection and member data capture",
        "SMS notification on disbursement and repayment",
        "A grievance-redressal helpline maintained under microfinance client-protection requirements",
      ],
      gaps: [
        "No scalable Odia-language channel that works when field staff are unavailable",
        "Disaster-period mass communication depends on the same field staff who are affected by the disaster",
        "Client-protection evidence for recovery contact is sampled and manual rather than complete",
        "Borrowers have no way to ask about balances, dues or relief terms between meetings",
      ],
    },
    risks: [
      "RBI microfinance directions and the sector client-protection code govern every recovery contact and require demonstrable non-coercion, permitted hours and grievance routing",
      "Odia speech performance on genuine rural mobile audio is the single technical risk that determines the whole engagement, and must be proven on the customer's own recordings before commitment",
      "Impact-investor client-protection audits add a second evidence standard beyond regulatory compliance, which the evaluation framework must satisfy",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 0.85,
      automationRate: 0.5,
      basis: "Seller assumptions to be validated — volume estimates monthly reminder and follow-up contacts across an eastern-India group-lending book, and cost per interaction values loan-officer phone time; disaster-period surges sit outside this baseline.",
    },
    pilotScope:
      "A ten-week Odia-language pilot across the core Odisha branches covering pre-meeting confirmation and missed-instalment follow-up, with speech quality benchmarked on the customer's own recorded field audio before any scale decision.",
    expansion: [
      "Add a standing disaster-outreach capability that can be triggered by geography within hours",
      "Extend to Bengali and Hindi for the West Bengal, Bihar and Jharkhand branches",
      "Open an inbound Odia borrower line for balance, due-date and relief-term queries",
    ],
    stakeholders: [
      "Managing Director",
      "Chief Operating Officer",
      "Head of Client Protection and Social Performance",
      "Head of Information Technology",
      "Head of Collections",
    ],
    discovery: [
      "Can we test Odia speech performance on your own recorded field calls before you commit to anything?",
      "When the last cyclone hit, how long did it take to reach affected borrowers, and what did you use?",
      "What client-protection evidence do your impact investors require on recovery contact, and how is it produced today?",
      "How much of a loan officer's week goes to reminder and confirmation calls that are not credit work?",
    ],
    flowTemplate: "collections",
    scenario:
      "After a cyclone warning in coastal Odisha, Annapurna reaches every affected borrower in Odia within a day with rescheduling terms, without a single field officer leaving shelter.",
  },

  "arohan-financial-services": {
    operatingContext:
      "Arohan Financial Services is a Kolkata-headquartered NBFC-MFI in the Aavishkaar group, lending to low-income households across West Bengal, Bihar, Assam, Jharkhand and the wider underbanked east through the joint-liability group model. Its borrower base is Bengali-first in its core geography with Hindi and Assamese needed across the rest, and low smartphone literacy makes voice the only channel that reliably reaches the household. Distribution is through branch offices and field loan officers running the standard scheduled meeting cycle, with collections handled at the centre. Its eastern-India concentration is both its differentiation and its exposure: the region has seen repayment stress cycles that translate directly into collections communication load.",
    strategicPressure: [
      { text: "Arohan's book is concentrated in eastern India — West Bengal, Bihar, Assam and Jharkhand — where Bengali-first borrower communication is the operating reality", kind: "verified" },
      { text: "Eastern-India microfinance has experienced repayment stress cycles that periodically raise collections contact requirements well above field capacity", kind: "inference" },
      { text: "Being part of a group with a stated financial-inclusion mission means client-protection evidence is an investor and board-level expectation alongside RBI compliance", kind: "inference" },
      { text: "Group technology strategy is pragmatic procurement across portfolio companies rather than centralised platform building, which suits a packaged deployment", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Arohan's operating model is field-intensity and local relationships in geographies larger lenders avoid; its technology function integrates vendor systems rather than building products. The group's approach across its portfolio companies favours pragmatic procurement of proven tools with clear operating benefit, and there is no public evidence of an internal AI or speech engineering capability at Arohan.",
    whyNotBuild:
      "Bengali and Assamese speech recognition on rural mobile audio, compliant outbound telephony across multiple state holiday and permitted-hour regimes, orchestration into the core loan-management system, and audit-grade conversation evaluation for RBI and client-protection reporting are four distinct engineering products. Arohan's central technology team exists to keep the lending system running; it will never be resourced to build and maintain any of them.",
    workflows: [
      {
        name: "Bengali repayment reminders and centre-meeting confirmation",
        friction: "Loan officers make reminder calls personally, so coverage falls away exactly when branches are busiest, and no external vendor can staff Bengali and Assamese to the standard the base needs",
        outcome: "Complete, in-language reminder and confirmation coverage across every branch, lifting attendance and returning officer time to sourcing and credit work",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core loan management system", "Centre and group master", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Collections follow-up on missed instalments with hardship routing",
        friction: "The delinquent cohort exceeds field revisit capacity during stress periods, so many accounts get no meaningful conversation before they roll to a harder bucket",
        outcome: "Full contact coverage of missed instalments within days, with the reason captured, hardship escalated to a human, and every contact evidenced",
        channels: ["Voice"],
        systems: ["Collections and delinquency module", "Core loan management system", "Grievance case system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New-borrower onboarding confirmation and terms comprehension calls",
        friction: "Confirming that a new borrower understood her instalment schedule, total cost and grievance route is done by sampling, leaving both a comprehension gap and a documentation gap",
        outcome: "Every new borrower receives a recorded in-language confirmation of terms and grievance rights, improving early repayment behaviour and satisfying client-protection evidence needs",
        channels: ["Voice"],
        systems: ["Core loan management system", "Disbursement records", "Client-protection reporting"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch and field-officer group-meeting servicing across eastern-India districts",
        "Field mobile applications for collection capture and member data",
        "SMS alerts for disbursement and repayment confirmation",
        "A grievance-redressal helpline required under microfinance conduct norms",
      ],
      gaps: [
        "No scalable Bengali or Assamese channel independent of field-officer availability",
        "Delinquency contact coverage collapses precisely during regional stress periods",
        "New-borrower terms comprehension is sampled rather than universally recorded",
        "Borrowers cannot check dues or raise a grievance conveniently between meetings",
      ],
    },
    risks: [
      "RBI microfinance directions and the client-protection code govern automated recovery contact — hours, tone, grievance routing and complete auditability",
      "Bengali and Assamese speech quality on rural mobile audio must be proven on the customer's own recordings; assumed performance is the main failure mode",
      "Reputational sensitivity around automated contact with low-income women borrowers requires visible, unconditional human escalation on any distress cue",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 0.85,
      automationRate: 0.5,
      basis: "Seller assumptions for discovery — monthly volume is inferred from reminder plus collections contact on an eastern-India group-lending book, and cost per interaction values loan-officer phone time rather than an outsourced centre.",
    },
    pilotScope:
      "A ten-week Bengali-language pilot across a West Bengal branch cluster covering pre-meeting confirmation and missed-instalment follow-up, with human hardship routing and results measured on attendance, on-time collection and officer hours recovered.",
    expansion: [
      "Extend to Bihar and Jharkhand in Hindi and to Assam in Assamese from the same deployment",
      "Add new-borrower onboarding confirmation calls as a client-protection control",
      "Open an inbound borrower line for dues, balances and grievance intake",
    ],
    stakeholders: [
      "Managing Director and Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Technology Officer",
      "Head of Client Protection and Grievance Redressal",
    ],
    discovery: [
      "What repayment stress are you seeing in your core eastern geographies right now, and how is contact capacity holding up?",
      "Can we benchmark Bengali and Assamese speech performance on your own recorded field audio?",
      "How do you currently document that a new borrower understood her terms and her grievance rights?",
      "Does group technology strategy constrain vendor selection at the Arohan level, or is this your decision alone?",
    ],
    flowTemplate: "collections",
    scenario:
      "An Arohan borrower in rural West Bengal misses a centre payment; the agent calls in Bengali the next morning, records that her income was disrupted, and books a partial payment plan.",
  },

  "pnb-metlife": {
    operatingContext:
      "PNB MetLife India Insurance is a joint venture between Punjab National Bank and MetLife, and its distribution is bancassurance-led, which means a very large share of its policyholders were sold a policy across a bank counter rather than through a digital journey they chose. Those customers concentrate in PNB's northern and eastern heartland but extend nationally through the bank's branch footprint, and they expect assisted service — a phone call or a branch visit — for anything from a premium receipt to a fund-value query. The business mix spans traditional savings and protection plans alongside unit-linked products, so recurring servicing centres on premium due dates, mode changes, fund switches, revival of lapsed policies and maturity or death-claim support. Its own contact-centre capacity is modest relative to the size of the in-force book, because distribution was inherited from the bank while servicing infrastructure had to be built standalone.",
    strategicPressure: [
      { text: "The insurer distributes primarily through Punjab National Bank branches, so its policyholder base is branch-sold and assisted-service-oriented rather than digitally self-serving", kind: "verified" },
      { text: "Persistency and lapse-and-revival economics are the dominant profit lever in bancassurance life books, because acquisition cost is already sunk when a policy lapses in year two or three", kind: "verified" },
      { text: "Revival calling is manual, seasonal and expensive per reinstated policy, and coverage of the lapsed cohort is limited by outbound-team capacity rather than by the size of the opportunity", kind: "inference" },
      { text: "As a joint venture it assembles technology from both parents' approved vendor ecosystems, which lengthens procurement but rules out speculative internal builds", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. PNB MetLife runs a vendor policy-administration platform with an integration layer to bank distribution, and its technology investment is directed at digital sales journeys and regulatory reporting rather than conversational infrastructure. Joint-venture governance requires approved vendors with contractual accountability and audit evidence — precisely the opposite of an experimental internal build. Neither parent would fund an India life-insurance subsidiary to build speech technology.",
    whyNotBuild:
      "Reinstating a lapsed policy over the phone requires speech recognition across Hindi, Punjabi, Bengali and Tamil on consumer mobile lines, telephony that survives TRAI preference-registry rules for outbound, orchestration that reads the policy-administration system to compute revival quotes and writes payment outcomes back, and an evaluation framework that can prove to IRDAI that no automated conversation constituted mis-selling or misrepresentation of policy terms. Four specialist capabilities, none of them adjacent to running a life insurer.",
    workflows: [
      {
        name: "Lapsed-policy revival outreach with quote and payment in-conversation",
        friction: "Lapsed policyholders are worked from campaign lists by a limited outbound team; most are never reached, and those who are must be called back with a revival quote after a manual calculation",
        outcome: "The full lapsed cohort is contacted in-language with a live revival quote and a payment link in the same conversation, converting sunk acquisition cost back into in-force premium",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Premium collection and payment gateway", "Campaign and CRM system", "Underwriting rules for revival"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Premium-due reminders and payment-mode assistance",
        friction: "Reminders go out as generic SMS with no ability to answer a question or take a payment, and auto-debit mandate failures surface only when the grace period has already run",
        outcome: "Two-way reminders that answer the actual question, fix a failed mandate and take payment in-channel, lifting on-time collection and thirteenth-month persistency",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Auto-debit mandate registry", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy servicing: fund value, statements, nominee and contact updates",
        friction: "Branch-sold policyholders call the contact centre or return to the bank branch for routine changes, and bank staff have no mandate or system access to complete insurance servicing",
        outcome: "Routine servicing completes in-conversation with authentication and audit trail, removing load from both the contact centre and the bank branch",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Fund and NAV engine", "Customer master and KYC records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer web portal and mobile app for policy details, premium payment and fund values",
        "A contact centre handling policy servicing and premium queries",
        "SMS and email premium-due and receipt notification tied to policy anniversaries",
        "Bank-branch assisted servicing where PNB staff help policyholders raise requests",
      ],
      gaps: [
        "A lapsed policyholder cannot get a revival quote and pay in a single interaction",
        "No two-way channel that can diagnose and fix a failed auto-debit mandate before the grace period expires",
        "Regional-language servicing is thin relative to a policyholder base spread across PNB's northern and eastern footprint",
        "Claim-stage families have no guided, proactive status channel and rely on repeated calls",
      ],
    },
    risks: [
      "IRDAI policyholder-protection regulations set turnaround expectations and prohibit misrepresentation of policy terms, so every automated statement about benefits, revival cost or surrender value must be grounded in the policy system and auditable",
      "TRAI preference-registry and DLT rules constrain outbound contact, and revival calling sits uncomfortably between servicing and solicitation — the classification must be settled with compliance before launch",
      "Bancassurance data-sharing between the bank and the insurer is bounded by DPDP consent and the partnership agreement, which limits what customer context an agent may use",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions to validate in discovery — volume is an order-of-magnitude estimate of monthly inbound servicing plus outbound premium and revival contact for a bancassurance life book of this size, and cost per interaction reflects Indian contact-centre economics including outbound campaign cost.",
    },
    pilotScope:
      "A ten-week revival pilot on a defined lapsed-policy cohort in Hindi and English: outbound contact with a live revival quote computed from the policy administration system, payment taken in-channel, and reinstatement rate measured against a matched control list worked by the existing outbound team.",
    expansion: [
      "Extend revival to Punjabi, Bengali and Tamil cohorts and add pre-lapse intervention before the grace period ends",
      "Add premium-due reminders and auto-debit mandate repair across the whole in-force book",
      "Open inbound policy servicing for fund values, statements and nominee or contact updates",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Persistency and Renewals",
      "Chief Technology or Information Officer",
      "Head of Customer Service",
      "Chief Compliance Officer and Appointed Actuary contact",
    ],
    discovery: [
      "What does a reinstated policy cost you today through the outbound revival team, and what share of the lapsed cohort do you actually reach?",
      "Where does thirteenth-month and twenty-fifth-month persistency sit, and which cohorts are dragging it?",
      "How many premium-collection failures are auto-debit mandate problems rather than an inability or unwillingness to pay?",
      "Has compliance formed a view on whether revival calling counts as servicing or solicitation for TRAI purposes?",
    ],
    flowTemplate: "retention",
    scenario:
      "A PNB MetLife policyholder in Ludhiana who lapsed eighteen months ago is reached in Punjabi, hears an exact revival quote from the policy system, and pays on a link before the call ends.",
  },

  "aditya-birla-sun-life-insurance": {
    operatingContext:
      "Aditya Birla Sun Life Insurance is the life-insurance arm of the Aditya Birla Capital financial-services group in partnership with Sun Life, distributing through a combination of bancassurance tie-ups, its own agency force and digital channels across the country. Its product mix spans unit-linked plans, traditional participating savings products, term protection and retirement solutions, which creates a servicing surface far wider than a pure protection book: fund switches, premium-mode changes, partial withdrawals, top-ups, maturity settlements and annuity setup all generate recurring policyholder contact. The policyholder base spans metros and tier-2 cities with servicing needs in Hindi, Marathi, Bengali, Tamil and English, and a meaningful proportion of the book was intermediated by an advisor or bank relationship manager who has since moved on. Servicing today runs through a contact centre, a customer portal and app, and branch service points.",
    strategicPressure: [
      { text: "Its product mix includes unit-linked and traditional savings plans, which generate recurring transactional servicing — fund switches, premium modes, partial withdrawals — beyond simple protection policies", kind: "verified" },
      { text: "Persistency improvement is an explicit, industry-wide value lever for Indian life insurers and depends directly on the quality and timing of renewal outreach", kind: "verified" },
      { text: "Orphaned policies whose originating advisor has left create a servicing population with no relationship owner, and their persistency is structurally worse than advisor-serviced policies", kind: "inference" },
      { text: "The wider Aditya Birla Capital group has real digital capability, so the internal debate will be whether this is a group platform decision or an insurer-level one — that is the deal risk", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. Aditya Birla Capital has genuine digital and analytics capability at group level and runs its own customer platforms, so this is not a company with no technology ambition. But conversational servicing in five Indian languages, integrated to a life policy-administration system and evidenced for IRDAI, is an industry-workflow problem rather than a platform problem. The realistic construct is a partner-delivered capability configured to the insurer's products and compliance posture, not a group build and not a pure off-the-shelf purchase.",
    whyNotBuild:
      "Even a group with digital capability will not build multilingual speech recognition and synthesis, carrier telephony, life-insurance conversation orchestration against a policy-administration system, and an evaluation harness that proves regulatory compliance on every conversation. Group engineering is pointed at customer acquisition platforms and analytics where the differentiation is; renewal-call automation is infrastructure they would rather rent with service levels than staff and maintain.",
    workflows: [
      {
        name: "Renewal-premium and persistency outreach across payment modes",
        friction: "Renewal outreach is a mix of SMS blasts and capacity-limited outbound calling, so monthly and quarterly-mode policyholders — the worst persistency cohort — receive the least attention",
        outcome: "Every renewal is worked with a two-way in-language conversation that resolves the actual objection and takes payment, lifting thirteenth and twenty-fifth-month persistency",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway and mandate registry", "Campaign and CRM system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Orphaned-policy servicing and re-engagement",
        friction: "Policies whose originating advisor has left have no relationship owner, so the policyholder's questions about fund performance or premium options go unanswered until they lapse or surrender",
        outcome: "Orphaned policyholders receive proactive, grounded servicing on fund value and options, converting a silent lapse population into a serviced one",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Agency and advisor master", "Fund and NAV engine"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Unit-linked transaction servicing: fund switches, top-ups and partial withdrawals",
        friction: "Transactional requests on unit-linked policies require either the portal or a contact-centre agent working across the policy system and fund engine, and customers frequently abandon mid-request",
        outcome: "Policyholders complete switches, top-ups and withdrawal requests conversationally with values read live from the fund engine and every step recorded for suitability evidence",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Fund and NAV engine", "Payment and payout systems", "Suitability and audit logging"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app covering policy details, fund values, premium payment and service requests",
        "A multi-channel contact centre supporting policy servicing and renewals",
        "WhatsApp-based servicing for common queries such as premium receipts and policy statements",
        "Branch and advisor-assisted servicing for complex transactions",
      ],
      gaps: [
        "Renewal contact coverage is capacity-limited, so the highest-risk persistency cohorts get the least outreach",
        "Orphaned policies have no systematic servicing relationship",
        "A policyholder cannot complete a fund switch or partial withdrawal end to end in a voice conversation with suitability evidence captured",
        "Regional-language depth on voice does not match the geographic spread of the book",
      ],
    },
    risks: [
      "IRDAI policyholder-protection rules and mis-selling scrutiny mean any automated statement about fund performance, guarantees or benefits must be grounded, bounded and fully auditable",
      "Unit-linked transaction servicing touches suitability obligations — an automated agent must not be positioned as giving investment advice",
      "TRAI preference-registry and DLT rules govern outbound renewal contact, and DPDP consent applies to policyholder data shared with any processor",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.4,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery validation — volume is an order-of-magnitude estimate of monthly renewal, servicing and transactional contacts across the in-force book, and cost per interaction blends inbound contact-centre and outbound campaign economics in India.",
    },
    pilotScope:
      "A twelve-week persistency pilot on the monthly and quarterly premium-mode cohort in Hindi, Marathi and English: two-way renewal conversations with objection handling and in-channel payment, measured on thirteenth-month persistency against a matched control.",
    expansion: [
      "Extend renewal outreach to all premium modes and add Bengali and Tamil coverage",
      "Add orphaned-policy re-engagement as a standing servicing programme",
      "Open unit-linked transactional servicing with suitability evidence capture and human escalation for advice-adjacent requests",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Persistency and Renewals",
      "Chief Digital or Technology Officer",
      "Head of Customer Experience",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Is renewal outreach run in-house or through a BPO today, and what does it cost per renewed policy?",
      "Which premium-mode and channel cohorts have the worst thirteenth-month persistency, and what have you tried on them?",
      "How large is the orphaned-policy population, and who owns servicing it?",
      "Would a decision like this sit with the insurer or with Aditya Birla Capital group technology?",
    ],
    flowTemplate: "retention",
    scenario:
      "An Aditya Birla Sun Life policyholder in Nagpur on a quarterly premium mode is called in Marathi before the grace period ends, has her fund-value question answered, and renews on the call.",
  },

  "canara-hsbc-life": {
    operatingContext:
      "Canara HSBC Life Insurance is a bancassurance joint venture that distributes overwhelmingly through Canara Bank's branch network, giving it a policyholder base concentrated in southern India and semi-urban districts where the bank is strong. Because the policy was sold at a bank counter, the customer's mental model is that the bank services the policy — yet bank staff have neither the mandate nor the system access to complete insurance transactions, which pushes the load onto a comparatively lean insurer-side servicing function. The product mix leans to savings and protection plans bought by first-time or second-time insurance customers who need premium schedules, revival options and maturity processes explained in Kannada, Tamil, Telugu and Hindi rather than in policy language. Its own-brand infrastructure — contact centre, portal, app — is modest relative to the size of the in-force book it inherited from bank distribution.",
    strategicPressure: [
      { text: "Distribution is almost entirely through Canara Bank branches, so the policyholder base is branch-sold and expects assisted rather than self-service", kind: "verified" },
      { text: "Servicing capacity is structurally thin relative to the book because distribution scale came from the bank while service infrastructure had to be built standalone", kind: "inference" },
      { text: "Renewal-premium collection on branch-sold policies depends on reminders reaching customers who never engaged with a digital journey, making outreach quality the direct driver of persistency", kind: "inference" },
      { text: "Joint-venture governance with a conservative public-sector bank and a global bank parent means auditable, contracted vendor solutions are the only realistic route", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. The insurer operates vendor policy-administration and servicing systems and directs its own investment toward distribution enablement within the bank. Joint-venture boards with a public-sector bank shareholder require procurement discipline, documented vendor accountability and audit evidence, all of which favour a packaged solution. There is no public indication of internal AI or speech engineering.",
    whyNotBuild:
      "Serving Kannada, Tamil, Telugu and Hindi policyholders by voice needs speech models per language, telephony that complies with preference-registry rules, orchestration into the policy-administration and payment systems, and an evaluation record that satisfies both IRDAI and two conservative shareholder audit functions. A mid-sized bancassurance JV has neither the engineering headcount nor the governance appetite to build any of that.",
    workflows: [
      {
        name: "Renewal-premium reminders and in-channel collection for branch-sold policyholders",
        friction: "Reminders arrive as SMS that a branch-sold customer often ignores, and when they do call the branch, staff cannot take the premium or explain the options",
        outcome: "A two-way reminder in the policyholder's language that explains the due amount, answers the objection and takes payment without a branch visit",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway and mandate registry", "Customer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy-terms explanation and revival guidance in regional languages",
        friction: "First-time policyholders do not understand grace periods, revival windows or paid-up status, and the branch that sold the policy cannot explain them authoritatively",
        outcome: "Grounded, in-language explanation of the customer's own policy status with a revival quote where applicable, reducing avoidable lapse",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Revival and underwriting rules", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Maturity, surrender and payout status servicing",
        friction: "Customers approaching maturity or requesting surrender chase status across the insurer contact centre and the bank branch, with bank-account and KYC mismatches discovered late",
        outcome: "Proactive maturity communication with document and bank-detail validation done ahead of time, converting a friction point into a retention conversation",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payout and banking interface", "KYC and customer master"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy status and premium payment",
        "A contact centre for policy servicing and renewal queries",
        "SMS and email premium-due and receipt notifications",
        "Canara Bank branch staff informally assisting policyholders with insurance queries",
      ],
      gaps: [
        "No regional-language voice servicing that matches the bank's southern and semi-urban customer base",
        "Branch-sold customers cannot complete premium payment or revival in the channel they naturally use",
        "Maturity and surrender journeys have no proactive status communication",
        "No systematic pre-lapse intervention before the grace period expires",
      ],
    },
    risks: [
      "IRDAI policyholder-protection regulations bound turnaround times and prohibit misleading statements about benefits or surrender values in any automated conversation",
      "Joint-venture governance with a public-sector bank shareholder means longer approval cycles and possible procurement-committee involvement",
      "Bancassurance data-sharing limits what bank-held customer context can be used by the insurer's agent, under both DPDP and the partnership agreement",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions to validate — monthly volume is inferred from renewal, servicing and maturity contact on a bancassurance in-force book of this scale, and cost per interaction reflects Indian contact-centre and outbound campaign economics.",
    },
    pilotScope:
      "A ten-week renewal-reminder pilot in Kannada, Tamil and English for policyholders whose premium falls due in the pilot window, with in-conversation payment and pre-lapse intervention measured against a control cohort receiving the current SMS-only treatment.",
    expansion: [
      "Add Telugu and Hindi coverage and extend to the full renewal base",
      "Introduce policy-terms explanation and revival guidance for the lapsed and paid-up populations",
      "Add proactive maturity and payout servicing with early document and bank-detail validation",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Service and Operations",
      "Chief Technology Officer",
      "Head of Bancassurance Channel",
      "Chief Compliance Officer",
    ],
    discovery: [
      "When a Canara Bank customer has a policy question, does it land with the branch or with your contact centre, and what happens next?",
      "What is your current lapse rate in the first three policy years, and how much of it is contactability rather than affordability?",
      "Which languages does your contact centre support today, and where does the mismatch with the branch footprint hurt?",
      "Does a customer-facing vendor decision need joint-venture board approval, and on what cycle?",
    ],
    flowTemplate: "billing-recharge",
    scenario:
      "A Canara HSBC Life policyholder in Mangaluru who bought her plan at a bank counter is reminded in Kannada, has the grace period explained, and pays her renewal on a link.",
  },

  "indiafirst-life": {
    operatingContext:
      "IndiaFirst Life Insurance is a life insurer promoted by Bank of Baroda and distributing largely through public-sector bank branch networks, which puts its policies in the hands of mass-market customers across small towns and semi-urban India — many of them buying life insurance for the first time. That customer profile drives an unusually high query volume per policy in the first year: what exactly did I buy, when is my next premium, what happens if I miss it, who gets the money, how do I make a claim. Products skew toward savings and protection plans with modest ticket sizes, so the servicing cost per rupee of premium is structurally high. Servicing runs through an insurer contact centre, a portal and app, and informal help from the bank branch that made the sale.",
    strategicPressure: [
      { text: "The insurer is promoted by Bank of Baroda and reaches customers primarily through public-sector bank branch distribution", kind: "verified" },
      { text: "A first-generation policyholder base generates materially more servicing queries per policy than an experienced insurance customer base, particularly in policy year one", kind: "inference" },
      { text: "Small average ticket sizes mean every assisted interaction consumes a visible share of the policy's margin, making self-service economics decisive rather than incremental", kind: "inference" },
      { text: "Early-year persistency on mass-market bancassurance policies is highly sensitive to whether the customer understood what they bought, which is an onboarding-communication problem more than a collections problem", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. IndiaFirst's scale, joint-venture structure and public-sector-bank promoter make an internal conversational-AI build implausible on every dimension: budget, engineering headcount and governance. Its technology function runs vendor policy-administration and digital-sales systems. Any customer-facing AI capability will be procured with contractual service levels and audit evidence.",
    whyNotBuild:
      "Explaining a life-insurance policy to a first-time buyer in Hindi, Gujarati or Marathi and getting it right every time is a governed-content and evaluation problem as much as a speech problem. Building it means owning speech models, telephony, orchestration into the policy system, and a continuous evaluation regime that can prove no automated explanation misrepresented a benefit — the exact area IRDAI scrutinises. No insurer of this size builds that.",
    workflows: [
      {
        name: "First-year policyholder onboarding and terms explanation",
        friction: "A newly issued policy generates a welcome kit the customer does not read and a free-look period they do not understand, followed by confused calls months later at the first premium due date",
        outcome: "Every new policyholder receives a guided in-language explanation of their premium schedule, grace period, nominee and claim process, cutting first-year queries and early lapse",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Policy issuance and document generation", "Customer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Premium-schedule reminders and payment assistance",
        friction: "Mass-market customers miss premiums for practical reasons — a changed phone number, a failed mandate, no clarity on how to pay — and a generic SMS resolves none of them",
        outcome: "A conversation that diagnoses the actual blocker, updates contact or mandate details and takes the premium, protecting early-year persistency",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Mandate registry and payment gateway", "Customer master and KYC"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Nominee, contact and bank-detail update servicing",
        friction: "Routine data updates require a form, a branch visit or a contact-centre call, and stale nominee or bank details only become visible as a problem at claim or maturity",
        outcome: "Authenticated self-service updates completed conversationally, keeping the record clean so claims and payouts do not stall",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "KYC and customer master", "Document upload and verification"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy details and premium payment",
        "A contact centre serving policy and premium queries",
        "SMS and email notifications for issuance, premium due and receipt",
        "Bank-branch assisted servicing where the selling branch helps the customer raise requests",
      ],
      gaps: [
        "No structured onboarding conversation that confirms a first-time buyer understood their policy",
        "Failed mandates and stale contact details are not proactively diagnosed and fixed",
        "Nominee and bank-detail updates still require forms or branch involvement",
        "Vernacular voice coverage is narrower than the geographic spread of PSU-bank distribution",
      ],
    },
    risks: [
      "IRDAI policyholder-protection and mis-selling rules mean every automated explanation of benefits, grace periods or surrender values must be grounded in the policy record and fully auditable",
      "First-time buyers are the segment most exposed to mis-selling allegations, so scripting must be conservative and any advice-adjacent question must escalate to a human",
      "TRAI preference-registry and DLT rules apply to premium and servicing messaging, and DPDP consent covers policyholder data received through the bank channel",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery — monthly interaction volume estimates onboarding, premium and servicing contact across a mass-market bancassurance book, and cost per interaction reflects Indian contact-centre economics for short, high-frequency queries.",
    },
    pilotScope:
      "An eight-week onboarding pilot covering every policy issued in the pilot window: a guided Hindi and Gujarati conversation within days of issuance explaining premium schedule, grace period, nominee and claim process, measured on first-year query volume and first-renewal persistency.",
    expansion: [
      "Add premium-reminder and mandate-repair conversations across the in-force book",
      "Extend to Marathi and additional regional languages matching PSU-bank distribution",
      "Open authenticated servicing for nominee, contact and bank-detail updates",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Service",
      "Chief Technology Officer",
      "Head of Bancassurance Distribution",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How many service contacts does a typical new policy generate in its first twelve months, and what are they about?",
      "What proportion of first-premium defaults are practical failures — mandate, contact details — rather than affordability?",
      "How do you currently confirm a first-time buyer understood the policy, and would compliance value a recorded confirmation?",
      "Which languages does your contact centre cover, and which distribution geographies are underserved?",
    ],
    flowTemplate: "onboarding",
    scenario:
      "A first-time IndiaFirst Life policyholder in Vadodara gets a Gujarati call days after issuance explaining her premium schedule and nominee, and never needs to call the branch about it.",
  },

  "shriram-life": {
    operatingContext:
      "Shriram Life Insurance deliberately targets rural and mass-market customers rather than the affluent urban segment most life insurers chase, drawing many policyholders from the wider Shriram ecosystem's long-standing relationships with small transport operators, traders and chit-fund savers in southern India. That means small ticket sizes, vernacular-first customers in Telugu, Tamil, Kannada and Hindi, and a book where assisted-service economics are among the hardest in the industry because the cost of a phone call is large relative to the annual premium. Distribution runs through an agency force and ecosystem referrals rather than a large bank partner, so the servicing relationship sits with the insurer from day one. Policyholders overwhelmingly prefer phone contact and will not complete a servicing journey in an app.",
    strategicPressure: [
      { text: "The insurer positions itself around rural and mass-market customers, a deliberate segment choice that shapes its ticket sizes and servicing economics", kind: "verified" },
      { text: "Small-ticket policies make cost per assisted interaction a first-order profitability issue rather than an operational nicety", kind: "inference" },
      { text: "A south-India-weighted, vernacular-first policyholder base needs Telugu, Tamil and Kannada servicing at a depth that generic contact-centre staffing struggles to sustain", kind: "inference" },
      { text: "Rural policyholders at claim stage need guided help assembling documents, and claim-experience reputation is disproportionately important for an insurer selling on trust in this segment", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Shriram Life's cost structure is built around low-ticket rural business, which precludes the fixed overhead of an internal AI engineering function. Its technology is vendor policy administration with agency-facing tools. The purchase decision will be driven by cost per serviced policy, and the commercial construct must reflect low premium per policy.",
    whyNotBuild:
      "Telugu, Tamil and Kannada speech on rural mobile lines, compliant telephony, orchestration into a policy-administration system for premium and claim status, and IRDAI-grade evaluation of every conversation are four separate build efforts. For an insurer whose per-policy economics are the tightest in the industry, spending on any of them internally is strictly worse than buying capacity that scales with usage.",
    workflows: [
      {
        name: "Rural policyholder premium reminders and in-channel collection",
        friction: "Small-premium rural policies lapse because a reminder SMS is not acted on and no one has capacity to call a customer whose annual premium is small",
        outcome: "Every policyholder receives an in-language reminder that answers questions and takes payment, making low-ticket persistency economically defensible",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Policy administration system", "Payment gateway and mandate registry", "Agency and customer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claim intimation and document-guidance servicing for families",
        friction: "A rural family at claim stage does not know which documents are needed, submits incomplete sets, and calls repeatedly for status while the claim sits pending",
        outcome: "Guided in-language claim intimation with a tracked document checklist and proactive status updates, shortening settlement time and protecting the trust the brand sells on",
        channels: ["Voice", "WhatsApp"],
        systems: ["Claims management system", "Policy administration system", "Document upload and verification"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Policy status, paid-up and revival explanation in vernacular",
        friction: "Policyholders do not know whether their policy is in force, paid-up or lapsed, and the agent who sold it may no longer be active",
        outcome: "A simple in-language answer about the customer's own policy status with revival options quantified, reducing silent lapse in the rural book",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Revival and underwriting rules", "Agency master"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An agency force that services the policies it sold, where the agent remains active",
        "A contact centre and toll-free line for premium and policy queries",
        "A customer portal and mobile app used by the more digitally confident minority of the base",
        "SMS notifications for premium due, receipt and policy events",
      ],
      gaps: [
        "No scalable vernacular voice servicing that works when the selling agent has left",
        "Claim-stage families have no guided document journey or proactive status channel",
        "Low-ticket policies receive no economically viable renewal call today",
        "No after-hours channel despite a customer base that works during the day",
      ],
    },
    risks: [
      "IRDAI policyholder-protection regulations set claim turnaround expectations and prohibit any misrepresentation of benefits, which bounds automated claim-stage communication tightly",
      "Claim conversations with bereaved families require conservative scripting and immediate human escalation on any distress cue",
      "Decision independence from wider Shriram group relationships must be confirmed, and TRAI plus DPDP obligations apply to all outbound policyholder contact",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions for validation — volume estimates monthly premium, servicing and claim-status contact across a rural mass-market life book, and cost per interaction reflects Indian contact-centre economics; the low ticket size means the customer will test payback hard.",
    },
    pilotScope:
      "A ten-week Telugu and Tamil pilot combining premium reminders with policy-status and revival explanation for the rural book in two states, measured on renewal collection rate and lapse against a matched control cohort.",
    expansion: [
      "Add Kannada and Hindi coverage and extend to the full in-force book",
      "Introduce guided claim intimation with document checklist tracking and proactive status",
      "Open an inbound vernacular line for policy status, receipts and nominee updates",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Customer Service and Claims",
      "Head of Information Technology",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What does it cost you today to service a policy whose annual premium is at the low end of your book?",
      "What share of your in-force policies have an inactive or departed selling agent?",
      "How long does a rural death claim take from intimation to settlement, and where does the time actually go?",
      "Are technology decisions here independent of wider Shriram group vendor arrangements?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Shriram Life policyholder in rural Andhra Pradesh calls in Telugu to ask whether her lapsed policy can be revived, and gets an exact quote and a payment link without an agent visit.",
  },

  "future-generali-life": {
    operatingContext:
      "Future Generali India Life Insurance is a Generali-controlled life insurer that grew up alongside the Future Group's retail ecosystem, and the collapse of that retail business removed a distribution channel it had built around. The consequence is an in-force book containing a substantial cohort of policies sold through channels that no longer exist, with no active advisor or partner relationship attached — orphaned policies whose lapse risk is materially higher than advisor-serviced ones. The insurer is rebuilding distribution through agency and partnerships while defending the existing book, which makes retention economics unusually important relative to new business. Servicing runs through a contact centre, portal and app, with a policyholder base spread across Hindi, Marathi and English-speaking markets.",
    strategicPressure: [
      { text: "The Future Group retail business unwound through insolvency, removing a distribution ecosystem the insurer had been built around", kind: "verified" },
      { text: "Generali holds control of the India life venture and its posture across markets favours deploying group-approved vendor platforms rather than local builds", kind: "verified" },
      { text: "A large orphaned-policy cohort with no servicing relationship attached carries elevated lapse risk, making proactive outreach the highest-value retention lever available", kind: "inference" },
      { text: "With new-business distribution being rebuilt, retaining the existing book is disproportionately valuable to the insurer's embedded value this cycle", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. A mid-sized insurer rebuilding distribution has neither the capital nor the engineering bench for a conversational platform build, and Generali's global operating model standardises on procured platforms with group vendor governance rather than local product development. The India entity will select from approved solutions with clear compliance evidence.",
    whyNotBuild:
      "Retention outreach to orphaned policyholders needs multilingual speech, compliant outbound telephony, orchestration into the policy-administration system to produce accurate revival and paid-up values, and an evaluation trail that satisfies both IRDAI and a European parent's control framework. Building any single component would take longer than the retention window on the at-risk cohort.",
    workflows: [
      {
        name: "Orphaned-policy outreach and relationship re-establishment",
        friction: "Policies sold through now-defunct channels have no servicing owner, so the policyholder's first contact from the insurer is often a lapse notice",
        outcome: "Every orphaned policyholder is proactively contacted, has their policy explained and their contact details refreshed, converting an invisible lapse population into a serviced one",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Agency and channel master", "Customer master and KYC"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-lapse intervention within the grace period",
        friction: "Lapse notices are sent by SMS and email after the fact, and the outbound team can only work a fraction of policies approaching the end of grace",
        outcome: "Two-way conversations inside the grace period that resolve the actual blocker and take payment, reducing lapse and preserving embedded value",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Payment gateway and mandate registry", "Campaign management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy servicing: statements, fund values, contact and nominee updates",
        friction: "Routine servicing depends on a contact centre sized for a smaller in-force base, so wait times spike around premium anniversaries and financial year end",
        outcome: "Routine requests are completed conversationally at any hour, letting the contact centre focus on retention conversations that need a human",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Fund and NAV engine", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy details and premium payment",
        "A contact centre handling servicing, premium and claim queries",
        "SMS and email lifecycle notifications including premium due and lapse notices",
        "An agency and partner servicing layer for policies with an active intermediary",
      ],
      gaps: [
        "Orphaned policies have no servicing relationship and no systematic outreach",
        "Pre-lapse intervention is capacity-limited and reaches only a fraction of at-risk policies",
        "Contact and bank details for legacy-channel policies are stale and undetected until a payout fails",
        "Regional-language voice coverage is narrower than the geographic spread of the legacy book",
      ],
    },
    risks: [
      "IRDAI policyholder-protection rules govern lapse, revival and surrender communication and prohibit any misrepresentation of value in automated conversations",
      "Contacting orphaned policyholders raises TRAI preference-registry questions where consent records from the defunct channel are incomplete or unverifiable",
      "Generali group vendor governance and data-protection standards apply alongside DPDP, potentially adding a European approval layer to vendor selection",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions for discovery — monthly volume estimates servicing plus retention outreach on a mid-sized in-force life book, and cost per interaction reflects Indian contact-centre and outbound campaign economics.",
    },
    pilotScope:
      "A ten-week retention pilot on the orphaned-policy cohort in Hindi, Marathi and English: proactive outreach that refreshes contact details, explains policy status and intervenes before grace expiry, measured on lapse rate against a matched untouched cohort.",
    expansion: [
      "Extend pre-lapse intervention to the entire in-force book across all premium modes",
      "Add inbound servicing for statements, fund values and nominee or contact updates",
      "Introduce claim-stage guidance and proactive status communication",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Persistency and Retention",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How many in-force policies currently have no active servicing intermediary attached?",
      "What is the lapse trajectory on that cohort versus advisor-serviced policies?",
      "Do you hold verifiable contact consent for policies sold through the legacy channel?",
      "Does Generali group vendor governance need to approve a customer-facing AI supplier for India?",
    ],
    flowTemplate: "retention",
    scenario:
      "A Future Generali policyholder in Pune whose selling channel disappeared is reached in Marathi inside the grace period, has her policy status explained, and renews rather than lapsing.",
  },

  "ageas-federal-life": {
    operatingContext:
      "Ageas Federal Life Insurance is majority-owned by the Belgian insurer Ageas and distributes principally through Federal Bank's branch network, which concentrates its policyholder base in Kerala and among Malayali households with family members working in the Gulf. That produces a genuinely distinctive servicing profile: a significant share of premium-paying customers are non-resident, operating in Gulf time zones, transacting through NRE and NRO accounts, and needing Malayalam-language support at hours when an Indian day-shift contact centre is closed. Servicing spans premium collection across cross-border payment routes, policy documentation for NRI compliance, maturity and payout coordination into overseas or NRE accounts, and claim support for families split across two countries. The insurer runs a modest own-brand servicing function alongside Federal Bank branch assistance.",
    strategicPressure: [
      { text: "Distribution runs through Federal Bank, concentrating the policyholder base in Kerala and among Gulf-based non-resident Indian households", kind: "verified" },
      { text: "NRI premium collection and payout coordination involve cross-border banking steps that generate more servicing contact per policy than a domestic equivalent", kind: "inference" },
      { text: "Gulf-based customers need servicing outside Indian business hours, and staffing a Malayalam-capable night shift is uneconomic at this insurer's scale", kind: "inference" },
      { text: "Malayalam-language automated servicing across extended hours would be a genuine differentiator in the Kerala NRI segment, which several insurers court but few service well", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. This is a mid-sized joint venture with a European majority owner whose India operation is sized for distribution and underwriting, not platform engineering. Ageas group governance favours procured, contracted systems with documented control evidence. There is no realistic internal path to building Malayalam speech capability.",
    whyNotBuild:
      "The specific requirement — production-quality Malayalam speech recognition and synthesis, telephony that reaches Gulf mobile numbers compliantly, orchestration into a policy-administration system that understands NRE and NRO premium routes, and evaluation evidence for IRDAI plus a European parent's control framework — is four specialist builds for a book of this size. The economics never close.",
    workflows: [
      {
        name: "NRI premium-collection servicing across time zones in Malayalam",
        friction: "Gulf-based policyholders discover premium problems — failed cross-border transfers, mandate lapses, currency and account mismatches — when the Indian contact centre is closed, and lose a week per cycle",
        outcome: "Premium queries and payments are resolved in Malayalam at Gulf-convenient hours, removing the time-zone penalty that drives NRI policy lapse",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "NRE and NRO premium payment routes", "Mandate registry and payment gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Maturity and payout coordination for non-resident policyholders",
        friction: "Payouts to non-resident policyholders stall on bank-account validation, tax documentation and KYC refresh, discovered only after the maturity date has passed",
        outcome: "Proactive pre-maturity outreach that validates documentation and account details ahead of time, so the payout lands on schedule and the customer stays with the insurer",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payout and banking interface", "KYC and tax documentation records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Policy servicing and documentation requests in Malayalam",
        friction: "Routine requests — premium receipts, tax certificates, contact and nominee updates — require a call in Indian hours or a Federal Bank branch visit by a relative on the customer's behalf",
        outcome: "Authenticated servicing completed conversationally in Malayalam at any hour with documents delivered digitally, removing the branch-by-proxy pattern",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Document generation", "Customer master and KYC"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy details, premium payment and document downloads",
        "A contact centre operating primarily in Indian business hours",
        "Federal Bank branch assistance for policyholders and their resident family members",
        "SMS and email notification for premium due, receipt and policy events",
      ],
      gaps: [
        "No Malayalam-language servicing at Gulf-convenient hours",
        "Cross-border premium failures are not proactively diagnosed before the grace period lapses",
        "Maturity documentation and account validation for non-residents is reactive rather than pre-emptive",
        "Non-resident customers frequently rely on a resident relative visiting a branch as their real service channel",
      ],
    },
    risks: [
      "IRDAI policyholder-protection rules and NRI-specific documentation requirements bound what can be confirmed or changed in an automated conversation, particularly around bank-account and tax details",
      "Cross-border outbound contact to Gulf numbers is subject to destination-country telecom rules as well as Indian TRAI norms, and must be checked before any outbound campaign",
      "Ageas group data-protection standards apply alongside DPDP, and cross-border processing of policyholder data will need explicit approval",
    ],
    economics: {
      volumeMonthly: 100000,
      costPerInteraction: 1.4,
      automationRate: 0.5,
      basis: "Seller assumptions to validate — volume estimates monthly servicing and premium contact across a Kerala plus Gulf-NRI policy base, and cost per interaction is set above the domestic norm to reflect extended-hours and cross-border servicing complexity.",
    },
    pilotScope:
      "A ten-week Malayalam-language pilot covering premium queries, receipts and tax certificates for the non-resident policyholder cohort across extended Gulf-friendly hours, measured on first-contact resolution and premium-collection timeliness.",
    expansion: [
      "Add proactive pre-maturity documentation and bank-account validation for non-resident payouts",
      "Extend to English and Hindi for the domestic book and add pre-lapse intervention",
      "Introduce claim-stage support for families coordinating across India and the Gulf",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Customer Service",
      "Head of Bancassurance and Federal Bank Channel",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What share of your premium-paying policyholders are non-resident, and where are they concentrated?",
      "How are Gulf-hours queries handled today, and what is the typical delay before a customer gets an answer?",
      "How often do non-resident maturity payouts stall on documentation or bank-account validation?",
      "Has legal reviewed outbound calling to Gulf mobile numbers, and what constraints apply?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An Ageas Federal policyholder working in Dubai calls at 10pm Gulf time in Malayalam, resolves a failed NRE premium transfer, and pays before his grace period ends.",
  },

  "tata-aia-life": {
    operatingContext:
      "Tata AIA Life Insurance combines the Tata brand with AIA's pan-Asian life-insurance operating playbook, and it has been one of the faster-growing private life insurers in India through a mix of agency, bancassurance partnerships and direct digital channels. Its portfolio is weighted toward protection and long-tenure savings products, which creates a long tail of servicing that lasts decades per policy: premium persistency outreach, rider additions and queries, medical underwriting follow-ups, and claim-stage support for families. Growth compounds the servicing base annually, so an in-force book that is growing faster than the servicing function creates a widening capacity gap. Policyholders span metros and tier-2 cities with servicing needs in Hindi, Marathi, Bengali, Tamil and English, and the agency channel remains the customer's primary relationship for many policies.",
    strategicPressure: [
      { text: "Tata AIA has been among the faster-growing private life insurers in India, with a product mix weighted toward protection and long-tenure savings", kind: "verified" },
      { text: "AIA operates regional technology and customer-experience programmes across Asian markets, which shapes how India-level platform decisions are made", kind: "verified" },
      { text: "Rapid new-business growth compounds the in-force servicing base every year, so servicing capacity must scale faster than headcount can be hired and trained", kind: "inference" },
      { text: "Persistency on protection-heavy books depends on renewal contact quality at each anniversary, and the marginal renewal call is the one the outbound team never gets to", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. AIA runs regional technology programmes and has real platform capability, so the framing is not that Tata AIA cannot build anything. But India-specific vernacular voice servicing, integrated to an India policy-administration system and evidenced for IRDAI, is a local industry-workflow capability that regional platform programmes do not deliver. The realistic path is a partner-delivered layer configured to the insurer's products and compliance posture, subject to regional architecture review.",
    whyNotBuild:
      "A regional insurance group builds pricing, underwriting and customer platforms — not Indian-language speech recognition, PSTN and WhatsApp orchestration, and per-conversation compliance evaluation for a single market. Even where group capability exists, the language and telephony layer for India is a specialist product AIA would source rather than construct, and the time-to-value gap between buying and building is measured in years.",
    workflows: [
      {
        name: "Persistency and renewal-premium outreach across the growing in-force base",
        friction: "The outbound renewal team is sized against last year's book while the in-force base grows, so an increasing share of renewals gets only an SMS",
        outcome: "Full renewal contact coverage in the policyholder's language with objections resolved and payment taken, holding persistency flat or improving it as the book grows",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway and mandate registry", "Campaign and CRM system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Underwriting and issuance follow-up on pending proposals",
        friction: "Proposals pending medical tests, documents or clarifications stall while the advisor chases the customer manually, and a proportion never convert despite paid initial premium",
        outcome: "Automated, in-language follow-up on every pending proposal with appointment coordination and document chase, lifting issuance conversion and shortening turnaround",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Underwriting and proposal system", "Medical test-centre scheduling", "Document management", "Agency master"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Rider, premium-mode and policy-servicing queries",
        friction: "Long-tenure policies generate recurring questions about riders, premium modes, loans against policy and tax certificates, all routed to a contact centre that is also handling renewals",
        outcome: "Routine servicing completes conversationally with grounded answers from the policy record, freeing human capacity for retention and claim conversations",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Document generation", "Customer master and KYC"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A well-developed customer app and portal covering policy details, premium payment and service requests",
        "A multi-channel contact centre supporting servicing, renewals and claims",
        "WhatsApp-based servicing for common transactions such as receipts and statements",
        "An active agency force servicing the policies it sold",
      ],
      gaps: [
        "Renewal contact coverage does not scale with a rapidly growing in-force base",
        "Pending-proposal follow-up depends on individual advisor effort rather than a systematic process",
        "Vernacular voice depth lags the geographic spread of new business into tier-2 cities",
        "Claim-stage families rely on repeated status calls rather than proactive updates",
      ],
    },
    risks: [
      "IRDAI policyholder-protection and mis-selling rules require every automated statement about benefits, riders and returns to be grounded in the policy record and fully auditable",
      "AIA regional customer-experience and architecture standards may preempt or constrain local vendor selection, which is the primary qualification risk on this account",
      "TRAI preference-registry and DLT rules apply to renewal and proposal-follow-up outbound, and DPDP consent covers policyholder and proposer data",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.4,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery validation — volume is an order-of-magnitude estimate of monthly renewal, servicing and proposal-follow-up contacts on a fast-growing private life book, and cost per interaction blends inbound and outbound Indian contact-centre economics.",
    },
    pilotScope:
      "A twelve-week persistency pilot on one renewal-anniversary cohort in Hindi, Marathi and English: two-way renewal conversations with objection handling and in-channel payment, measured on thirteenth-month persistency against a matched control worked by the existing outbound team.",
    expansion: [
      "Extend renewal outreach to all anniversary cohorts and add Bengali and Tamil",
      "Add pending-proposal follow-up including medical-test scheduling and document chase",
      "Open inbound servicing for riders, premium modes, loans against policy and tax certificates",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Persistency and Renewals",
      "Chief Technology or Digital Officer",
      "Head of Customer Experience",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How does renewal-outreach capacity compare with the growth rate of your in-force book?",
      "What proportion of proposals with paid initial premium fail to convert to issued policies, and why?",
      "Do AIA regional customer-experience standards govern vendor selection for a capability like this in India?",
      "Which languages does your outbound team cover, and where is new business outrunning that coverage?",
    ],
    flowTemplate: "retention",
    scenario:
      "A Tata AIA term-plan holder in Coimbatore receives a Tamil renewal call before his anniversary, has a rider question answered from the policy record, and pays on the call.",
  },

  "star-union-daiichi-life": {
    operatingContext:
      "Star Union Dai-ichi Life Insurance is a bancassurance joint venture whose Indian shareholders are Bank of India and Union Bank of India, with Dai-ichi Life of Japan as the foreign partner. Its policies are therefore sold almost entirely across two public-sector bank counters, spreading its in-force base across those banks' semi-urban and rural branch networks in Maharashtra, the Hindi belt and southern states. Those customers bought insurance from a bank employee they trusted, and they will not migrate to an app for servicing — they either call or walk back into the branch, where staff have no insurance-system access and limited ability to help. The product mix is savings and protection weighted, with servicing centred on premium reminders, revival, contact updates, maturity and claim support. The insurer's own servicing function is small relative to the distribution reach it inherited.",
    strategicPressure: [
      { text: "The insurer is a bancassurance joint venture of Bank of India, Union Bank of India and Dai-ichi Life, distributing through two public-sector bank branch networks", kind: "verified" },
      { text: "Servicing depends heavily on partner-bank branch staff who have neither system access nor incentive to complete insurance transactions, creating a hard capacity ceiling", kind: "inference" },
      { text: "Premium-collection persistency on PSU-branch-sold policies is highly sensitive to reminder quality, because the customer has no other engagement channel with the insurer", kind: "inference" },
      { text: "Japanese-parent governance favours proven vendor systems with complete audit trails, which suits a packaged deployment but lengthens the approval path", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. A joint venture of this size with two public-sector bank shareholders and a Japanese insurer parent has no internal engineering path to conversational AI, and its governance would not sanction one. Technology is procured with documented vendor accountability, and every customer-facing system must produce audit evidence acceptable to three shareholder control functions.",
    whyNotBuild:
      "Serving Hindi, Marathi and Tamil policyholders by voice requires speech models, compliant telephony, orchestration into the policy-administration and payment systems, and evaluation evidence for IRDAI and three shareholders. A JV whose technology headcount is a small central team will procure this, and the audit-trail requirement makes a vendor with contractual accountability strictly preferable to anything home-grown.",
    workflows: [
      {
        name: "Premium-due reminders and in-channel collection for bank-sold policyholders",
        friction: "Reminders are SMS-only, and a customer who wants to pay must either navigate a portal she has never used or go back to the bank branch that sold her the policy",
        outcome: "A two-way reminder in the policyholder's language that answers the question and takes the premium immediately, lifting collection without branch dependence",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway and mandate registry", "Customer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lapse prevention and revival guidance",
        friction: "Policies drift into lapse because nobody contacts the customer inside the grace period, and revival requires a manual quote and a branch or contact-centre interaction",
        outcome: "Pre-lapse conversations with an accurate revival quote and payment in-channel, recovering premium the insurer has already paid to acquire",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Revival and underwriting rules", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy servicing and contact-detail refresh",
        friction: "Contact and bank details captured at the bank counter years ago go stale, and the insurer only discovers it when a payout or a reminder fails",
        outcome: "Authenticated refresh of contact, nominee and bank details through a conversation, keeping the book reachable and payouts clean",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "KYC and customer master", "Document upload and verification"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy details and premium payment",
        "A contact centre for policy servicing and premium queries",
        "SMS and email premium-due, receipt and lapse notifications",
        "Partner-bank branch staff informally assisting policyholders with insurance requests",
      ],
      gaps: [
        "Policyholders cannot complete a premium payment or a revival in the channel they naturally use",
        "No pre-lapse intervention inside the grace period at scale",
        "Stale contact and bank details are only detected when something fails",
        "Regional-language servicing does not match the spread of two PSU banks' branch networks",
      ],
    },
    risks: [
      "IRDAI policyholder-protection regulations govern lapse, revival and payout communication and require grounded, auditable statements about benefits and values",
      "Three-shareholder governance including two public-sector banks and a Japanese parent means long approval cycles and demanding audit-evidence requirements",
      "Ownership of the policyholder-servicing relationship between the insurer and the partner banks must be settled before any outbound programme, alongside TRAI and DPDP obligations",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 1.2,
      automationRate: 0.5,
      basis: "Seller assumptions to validate in discovery — volume estimates monthly premium-reminder and servicing contact across a bancassurance in-force book of this scale, and cost per interaction reflects Indian contact-centre and outbound campaign economics.",
    },
    pilotScope:
      "A ten-week premium-reminder pilot in Hindi and Marathi for policyholders with premiums falling due in the pilot window, taking payment in-conversation and intervening before grace expiry, measured on collection rate against the current SMS-only treatment.",
    expansion: [
      "Add Tamil and English coverage and extend to the full renewal base across both bank networks",
      "Introduce revival outreach on the lapsed cohort with accurate quotes and in-channel payment",
      "Open authenticated servicing for contact, nominee and bank-detail refresh",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Customer Service and Operations",
      "Head of Bancassurance Channel",
      "Chief Compliance Officer",
    ],
    discovery: [
      "When a policyholder has a question, does it reach your contact centre or the bank branch, and who resolves it?",
      "What share of your renewal base receives any voice contact today?",
      "How current are the contact and bank details captured at the point of sale in the branch?",
      "What approvals are needed across the three shareholders for a customer-facing vendor engagement?",
    ],
    flowTemplate: "billing-recharge",
    scenario:
      "A Star Union Dai-ichi policyholder in Nashik who bought her plan at a Bank of India counter is reminded in Marathi and pays her premium on a link without visiting the branch.",
  },

  "edelweiss-life": {
    operatingContext:
      "Edelweiss Life Insurance is the rebranded successor to Edelweiss Tokio Life following the Japanese partner's reduced involvement, and it operates as a mid-sized, agency-led private life insurer with a digitally confident marketing posture. Its distribution rests on an advisor force and partnerships rather than a large captive bank, so the advisor relationship carries much of the servicing burden and the insurer's own contact-centre capacity is modest. The product mix spans protection and long-tenure savings, meaning the in-force base generates persistent servicing demand across premium anniversaries, fund and bonus queries, and eventual claims. A brand transition creates its own communication workload: policyholders who bought from one brand need to be reassured about the entity now holding their policy, precisely at the moment competitors would like them to surrender.",
    strategicPressure: [
      { text: "The insurer rebranded from Edelweiss Tokio Life following a change in the Japanese partner's shareholding, requiring policyholder communication about the brand change", kind: "verified" },
      { text: "Brand transitions are a known persistency risk window, because uncertainty about who holds the policy is exactly the doubt a competing advisor exploits", kind: "inference" },
      { text: "Mid-sized life insurers face the same IRDAI servicing and grievance expectations as the largest players on a fraction of the operating budget, which makes packaged automation disproportionately attractive", kind: "inference" },
      { text: "Its digital-forward market positioning is not matched by an internal engineering bench for conversational AI, so the marketing ambition and the operating capability are mismatched", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. A mid-sized insurer in a brand transition is allocating capital to distribution and brand, not to platform engineering. Its technology function operates vendor policy-administration and digital-sales systems. The absence of any public signal of speech or conversational engineering, combined with budget scale, makes a procured capability the only realistic route.",
    whyNotBuild:
      "Reassuring a policyholder about a brand change, quoting an accurate revival amount, and taking a renewal payment in Hindi, Marathi or Gujarati requires speech, telephony, policy-system orchestration and compliance evaluation working together. Building that would take longer than the persistency window the rebrand has opened, and would tie up engineering capacity a mid-sized insurer does not have to spare.",
    workflows: [
      {
        name: "Brand-transition policyholder reassurance and record refresh",
        friction: "Policyholders who bought under the previous brand are unsure which entity holds their policy, and the insurer has no scalable way to reach every one of them with a clear explanation",
        outcome: "Proactive in-language contact that confirms policy continuity, refreshes contact details and answers the questions competitors would otherwise exploit",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Customer master and KYC", "Campaign management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Renewal-premium outreach and pre-lapse intervention",
        friction: "Renewal outreach is capacity-limited and depends on whether the originating advisor is still active, so the orphaned and low-premium cohorts get the least attention",
        outcome: "Complete renewal contact coverage with objections resolved and payment taken in-channel, defending persistency through the transition period",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Payment gateway and mandate registry", "Agency master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy servicing: statements, fund and bonus queries, nominee updates",
        friction: "Routine servicing requests compete with retention calls for the same small contact-centre team, and wait times spike around anniversaries and financial year end",
        outcome: "Routine requests complete conversationally at any hour with grounded answers, reserving human time for retention and claim conversations",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Fund and bonus engine", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy details, premium payment and statements",
        "A contact centre supporting servicing, renewals and claims",
        "Digital and messaging-based servicing for common transactions such as receipts",
        "An advisor force servicing policies where the originating advisor remains active",
      ],
      gaps: [
        "No scalable way to reach every policyholder with brand-transition reassurance",
        "Renewal coverage collapses for policies whose advisor has left",
        "No systematic pre-lapse intervention inside the grace period",
        "Regional-language voice servicing is thin relative to the geographic spread of the book",
      ],
    },
    risks: [
      "IRDAI policyholder-protection rules govern any statement about policy continuity, benefits and values, and brand-transition messaging must be precise and auditable",
      "TRAI preference-registry and DLT rules apply to outbound reassurance and renewal contact, and the classification of transition messaging as servicing rather than promotion must be agreed with compliance",
      "Budget scale at a mid-sized insurer means the commercial construct must show payback inside a single persistency cycle to be approvable",
    ],
    economics: {
      volumeMonthly: 110000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery — monthly volume estimates servicing plus renewal and transition outreach on a mid-sized in-force life book, and cost per interaction reflects Indian contact-centre and outbound campaign economics.",
    },
    pilotScope:
      "A ten-week pilot on the policyholder cohort acquired under the previous brand: proactive Hindi and Marathi reassurance calls combined with renewal outreach and contact-detail refresh, measured on surrender and lapse rates against a matched untouched cohort.",
    expansion: [
      "Extend renewal and pre-lapse intervention to the full in-force book with Gujarati added",
      "Add orphaned-policy servicing for advisors who have left the agency force",
      "Open inbound servicing for statements, fund and bonus queries and nominee updates",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Persistency and Renewals",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How has persistency moved since the rebrand, and are you seeing elevated surrender in any cohort?",
      "What proportion of your in-force policies no longer have an active servicing advisor?",
      "Has compliance classified brand-transition outreach as servicing or promotional for TRAI purposes?",
      "What payback period would make a customer-facing automation investment approvable at your scale?",
    ],
    flowTemplate: "retention",
    scenario:
      "An Edelweiss Life policyholder who bought under the old brand is called in Hindi, has policy continuity confirmed from the policy system, and renews instead of surrendering.",
  },

  "new-india-assurance": {
    operatingContext:
      "The New India Assurance Company is India's largest general insurer by premium and a state-owned enterprise, writing motor, health, fire, marine, engineering and liability business across the country and maintaining an international presence in several overseas markets. Its servicing estate is built around a large network of regional and divisional offices with human staff processing endorsements, renewals and claims, supported by agents, brokers, bancassurance partners and third-party administrators for health. Motor and health together generate the overwhelming share of retail interaction volume: claim intimation after an accident, surveyor coordination, garage and cashless authorisation, claim-status chasing, and renewal reminders on policies that expire on fixed anniversaries. Policyholders reach it by phone, by walking into a divisional office, or through agents, and the language mix genuinely spans Hindi, Marathi, Tamil, Bengali, Telugu and English.",
    strategicPressure: [
      { text: "New India Assurance is the largest general insurer in India by gross premium and is majority state-owned", kind: "verified" },
      { text: "Public-sector general insurers have faced sustained pressure on underwriting performance in motor and health, making operating-expense discipline a board-level priority", kind: "verified" },
      { text: "Its retail claim and renewal volumes across motor and health are larger than any private peer's, so even a modest per-interaction saving compounds into a material number", kind: "inference" },
      { text: "Modernisation happens through tenders with system-integrator delivery, so deal shape, empanelment and incumbency matter more here than product differentiation", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. As a public-sector undertaking, New India Assurance acquires technology through tender processes with system integrators delivering and often operating the solution. It has no internal product-engineering culture and would not attempt a conversational-AI build; equally it will not simply buy a packaged product without a tender-compliant delivery partner. The winning construct is a partner-led engagement where the capability is delivered inside an SI-fronted tender response with clear service levels.",
    whyNotBuild:
      "A PSU insurer's technology function manages vendors and integrations; it does not build speech models, telephony platforms or evaluation frameworks. Six-language voice servicing integrated to policy and claims systems, with audit evidence sufficient for CAG-style scrutiny and IRDAI inspection, is beyond anything a state-owned insurer has ever attempted internally, and its procurement rules effectively require an external supplier with contractual accountability anyway.",
    workflows: [
      {
        name: "Motor-claim intimation and status servicing",
        friction: "A policyholder after an accident calls a general helpline, waits, repeats policy and vehicle details, then calls back repeatedly for surveyor allocation and settlement status with no proactive updates",
        outcome: "Structured claim intimation in any language with immediate reference number, surveyor allocation communicated proactively, and status pushed at every stage — collapsing status-call volume",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Policy administration system", "Surveyor allocation", "Garage network management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Health cashless pre-authorisation status and network-hospital queries",
        friction: "Families at a hospital admission desk need cashless authorisation status urgently and are routed between the insurer, the third-party administrator and the hospital with no single answer",
        outcome: "Authenticated, real-time authorisation status and network-hospital confirmation available on demand in the caller's language, removing the worst-moment wait",
        channels: ["Voice", "WhatsApp"],
        systems: ["Health claims and TPA platform", "Network hospital directory", "Policy administration system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Renewal reminders and policy servicing across motor and health",
        friction: "Renewal depends on the agent remembering, and lapsed motor cover is both a revenue leak and a legal exposure for the customer; endorsement requests queue at divisional offices",
        outcome: "Systematic multilingual renewal outreach with payment in-channel and routine endorsements handled conversationally, reducing leakage and office footfall",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Agent and intermediary portal"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national customer-service helpline and toll-free numbers for claim intimation",
        "A customer portal and mobile app for policy purchase, renewal and claim intimation",
        "A large network of regional and divisional offices providing in-person servicing",
        "Third-party administrator arrangements handling health-claim processing and cashless coordination",
      ],
      gaps: [
        "A policyholder cannot get authenticated real-time claim status without reaching a human",
        "No proactive stage-by-stage claim communication, so status chasing dominates inbound volume",
        "Language coverage on voice does not match a genuinely national policyholder base",
        "Cashless authorisation status is fragmented between the insurer, the TPA and the hospital",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations set turnaround expectations on claims and grievances, and every automated claim statement must be grounded and auditable",
      "Public-sector procurement means multi-stage tenders, technical qualification criteria and possible incumbent-SI advantage — deal timelines are measured in quarters, not weeks",
      "Motor third-party claims are litigation-linked and must never be discussed by an automated agent beyond factual status; DPDP and TRAI obligations apply to all policyholder contact",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 1.2,
      automationRate: 0.5,
      basis: "Seller assumptions only — volume is an order-of-magnitude estimate for the largest Indian general insurer across motor and health claim, renewal and servicing contact, and cost per interaction blends helpline and divisional-office handling; both need replacement with tender-stage figures.",
    },
    pilotScope:
      "A twelve-week motor-claim servicing pilot in two regional zones: multilingual claim intimation with immediate reference generation and proactive surveyor and settlement status updates, measured on status-call suppression and claim-intimation cycle time.",
    expansion: [
      "Extend motor-claim servicing nationally across all six priority languages",
      "Add health cashless pre-authorisation status and network-hospital queries in coordination with TPAs",
      "Introduce renewal outreach and routine endorsement servicing across motor and health portfolios",
    ],
    stakeholders: [
      "Chairman and Managing Director",
      "General Manager, Information Technology",
      "General Manager, Operations or Customer Service",
      "Head of Claims",
      "Chief Compliance and Grievance Officer",
    ],
    discovery: [
      "What proportion of your inbound helpline volume is claim-status chasing rather than new intimation?",
      "Which tenders for customer-service or contact-centre modernisation are in the pipeline, and who holds the incumbent position?",
      "Where does responsibility sit between you and your TPAs for health-claim status communication?",
      "What language coverage does your helpline provide today, and where are the biggest gaps by zone?",
    ],
    flowTemplate: "claims",
    scenario:
      "A New India Assurance motor policyholder in Nagpur intimates a claim in Marathi at midnight, gets a reference number and surveyor timing immediately, and never has to call for status again.",
  },

  "national-insurance": {
    operatingContext:
      "National Insurance Company is a Kolkata-headquartered public-sector general insurer writing motor, health, fire and miscellaneous lines through a divisional-office network concentrated in eastern India but present nationally. It has operated under sustained capital and profitability pressure, which constrains discretionary spending and makes operating-cost reduction one of the few levers available to management. Its retail book generates steady claim-status and renewal contact volume, handled through helplines, divisional offices, agents and third-party administrators for health claims. The customer base skews toward older, phone-first policyholders and the language mix in its core geography is Bengali and Hindi with English for commercial lines.",
    strategicPressure: [
      { text: "National Insurance is a public-sector general insurer that has been under prolonged capital and profitability pressure", kind: "verified" },
      { text: "Constrained capital rules out large transformation programmes, making metered, incremental servicing automation one of the few approvable investments", kind: "inference" },
      { text: "Its motor and health books generate persistent claim-status and renewal contact volume that divisional offices absorb with manual effort", kind: "inference" },
      { text: "Any engagement will have to be structured to fit a tender process and a tightly scrutinised budget, so a small, provable first scope matters more than platform breadth", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. As a PSU insurer it procures through tenders with system integrators delivering, and its capital position makes an internal build unthinkable. The realistic construct is a narrowly scoped, tender-compliant engagement delivered with a partner, sized so the payback is demonstrable inside the budget cycle it is approved in.",
    whyNotBuild:
      "A capital-constrained state-owned insurer will not fund speech-model development, telephony infrastructure, orchestration engineering and an evaluation framework. Its technology group exists to keep core policy and claims systems running. Buying a metered capability with a defined scope is the only path that survives its budget approval process.",
    workflows: [
      {
        name: "Health and motor claim-status servicing",
        friction: "Claimants call divisional offices and helplines repeatedly for status, and staff read the same information from the claims system each time without any proactive update mechanism",
        outcome: "Authenticated claim status available on demand in Bengali, Hindi or English with proactive updates at each stage, removing the single largest inbound driver",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Health TPA platform", "Policy administration system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Renewal reminders and lapse prevention on motor and health policies",
        friction: "Renewal depends on agent follow-up, and policyholders with no active agent simply lapse — a direct premium leak the insurer cannot afford",
        outcome: "Systematic reminder outreach with payment taken in-channel, recovering renewal premium at a cost per contact far below agent or call-centre economics",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Agent and intermediary records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Document chase and claim-completion guidance",
        friction: "Claims stall on missing or incorrectly formatted documents, and the claimant is informed by letter or a single phone attempt, extending turnaround and generating grievances",
        outcome: "Guided, tracked document collection in-language with re-upload assistance, shortening claim turnaround and reducing ombudsman-bound grievances",
        channels: ["WhatsApp", "Voice"],
        systems: ["Claims management system", "Document management", "Grievance redressal records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A toll-free claim-intimation and customer-service helpline",
        "A customer portal and mobile app for policy documents, renewal and claim intimation",
        "A divisional-office network handling in-person servicing and claims",
        "Third-party administrator arrangements for health-claim processing",
      ],
      gaps: [
        "No authenticated self-service claim status outside office hours",
        "Renewal outreach reaches only policies with an active agent",
        "Document deficiencies are communicated slowly and without tracking",
        "Bengali-language servicing depth does not match the eastern concentration of the book",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations set claim and grievance turnaround expectations that automated communication must support, not undermine",
      "Capital constraints may prevent any new discretionary technology spend in a given cycle regardless of business case merit — this is the primary qualification question",
      "Public-sector tender processes govern vendor selection, and DPDP plus TRAI rules apply to all policyholder contact",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions to validate at tender stage — volume is an order-of-magnitude estimate of claim, renewal and servicing contact across a PSU general-insurance retail book, and cost per interaction blends helpline and divisional-office handling.",
    },
    pilotScope:
      "A ten-week claim-status servicing pilot for the eastern zone in Bengali, Hindi and English: authenticated status on demand plus proactive stage updates on motor and health claims, measured on repeat-contact rate and helpline volume.",
    expansion: [
      "Extend claim-status servicing to all zones with the full language set",
      "Add renewal reminders and lapse prevention across motor and health",
      "Introduce guided document chase to shorten claim turnaround",
    ],
    stakeholders: [
      "Chairman and Managing Director",
      "General Manager, Information Technology",
      "General Manager, Claims",
      "Head of Customer Service and Grievance Redressal",
      "Chief Financial Officer",
    ],
    discovery: [
      "Does your capital position permit discretionary technology spend this financial year, and under what approval route?",
      "What share of helpline volume is claim-status chasing, and how many times does a typical claimant call?",
      "How many motor and health policies lapse each year without any renewal contact attempt?",
      "What is the current tender pipeline for customer-service or contact-centre technology?",
    ],
    flowTemplate: "claims",
    scenario:
      "A National Insurance health claimant in Kolkata asks in Bengali for her claim status, gets an authenticated answer with the pending document named, and uploads it on WhatsApp.",
  },

  "oriental-insurance": {
    operatingContext:
      "The Oriental Insurance Company is a Delhi-headquartered public-sector general insurer with a large motor and health book and significant participation in government-sponsored insurance schemes, servicing policyholders through regional and divisional offices, agents, brokers and third-party administrators. Its retail policyholder base skews older and phone-first, concentrated across northern India where Hindi and Punjabi are the working languages of customer contact. Motor and mediclaim renewals expire on fixed dates and lapse quietly when nobody calls, which is a direct and measurable revenue leak in a portfolio already under underwriting pressure. Servicing today is manual and office-anchored, with helplines handling claim intimation and status and agents carrying most renewal responsibility.",
    strategicPressure: [
      { text: "Oriental Insurance is a public-sector general insurer with a substantial motor and health portfolio and government-scheme participation", kind: "verified" },
      { text: "Public-sector general insurers have faced sustained underwriting pressure in motor and health, making premium retention and expense control central management concerns", kind: "verified" },
      { text: "Renewal lapse in motor and mediclaim is a direct revenue leak that outbound automation addresses more cheaply than either agents or a staffed outbound desk", kind: "inference" },
      { text: "An older, phone-first policyholder base in northern India means voice in Hindi and Punjabi is the only channel that will actually convert a renewal", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. Oriental consumes technology through tender-driven procurement with system integrators delivering and operating solutions. It has no internal engineering capability for conversational AI and no cultural precedent for building one. The engagement shape is a partner-fronted, tender-compliant delivery with defined service levels and audit evidence.",
    whyNotBuild:
      "Renewal outreach at PSU scale requires multilingual speech, compliant outbound telephony under preference-registry rules, orchestration into policy and payment systems, and audit-grade conversation evidence. None of these exist inside a state-owned insurer, and its procurement framework requires an accountable external supplier regardless.",
    workflows: [
      {
        name: "Motor and mediclaim renewal-reminder outreach with in-channel payment",
        friction: "Renewals depend on whether an agent calls; policies with inactive agents lapse silently and the customer discovers it only when a claim is refused or a traffic check occurs",
        outcome: "Every expiring policy receives a timely Hindi or Punjabi reminder with a payment link, converting a silent leak into recovered premium",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Agent and intermediary records", "Vehicle and policy expiry data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claim-status and surveyor-coordination servicing",
        friction: "Claimants call divisional offices repeatedly for status on motor and health claims and are told to call back, with no proactive communication at any stage",
        outcome: "Authenticated status on demand and proactive stage updates, suppressing the largest category of inbound calls",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Surveyor allocation", "Health TPA platform"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Government-scheme beneficiary query servicing",
        friction: "Scheme beneficiaries with limited digital literacy call offices to ask about eligibility, coverage and claim procedure, and staff answer the same questions repeatedly",
        outcome: "Grounded scheme answers in the beneficiary's language at any hour, freeing office staff and improving scheme service metrics reported to sponsoring departments",
        channels: ["Voice", "SMS"],
        systems: ["Scheme beneficiary records", "Policy administration system", "Claims management system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A toll-free helpline for claim intimation and policy queries",
        "A customer portal and mobile app for policy documents and renewal payment",
        "A regional and divisional office network delivering in-person servicing",
        "Agent and broker channels carrying much of the renewal relationship",
      ],
      gaps: [
        "No systematic renewal outreach for policies without an active agent",
        "No proactive claim-status communication at any stage",
        "Scheme beneficiaries have no self-service channel matched to their literacy and language",
        "Servicing effectively stops outside office hours",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations govern claim and grievance turnaround, and automated statements about coverage must be grounded and auditable",
      "TRAI preference-registry rules constrain outbound renewal calling, and the servicing-versus-solicitation classification must be settled before launch",
      "Public-sector tender cycles determine timing and vendor eligibility, with incumbent system integrators often advantaged",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions for tender-stage validation — volume estimates renewal, claim and scheme-servicing contact across a PSU general-insurance book, and cost per interaction blends agent, helpline and office handling costs.",
    },
    pilotScope:
      "A ten-week renewal-retention pilot on the motor and mediclaim policies expiring in the northern zone during the pilot window, calling in Hindi and Punjabi with payment taken in-channel, measured on renewal rate against a matched control set.",
    expansion: [
      "Extend renewal outreach nationally across all product lines and languages",
      "Add claim-status servicing with proactive stage updates and surveyor coordination",
      "Introduce government-scheme beneficiary query servicing for sponsoring departments",
    ],
    stakeholders: [
      "Chairman and Managing Director",
      "General Manager, Information Technology",
      "General Manager, Marketing and Retail Business",
      "Head of Claims",
      "Chief Grievance Redressal Officer",
    ],
    discovery: [
      "What is your motor and mediclaim renewal-retention rate, and how much of the loss is contactability rather than price?",
      "Who owns outbound retention today — agents, a call centre, or nobody?",
      "How many policies expire each month with no active servicing agent attached?",
      "What is the tender route and timeline for a customer-service technology engagement?",
    ],
    flowTemplate: "retention",
    scenario:
      "An Oriental Insurance motor policyholder in Ludhiana whose agent retired gets a Punjabi renewal call two weeks before expiry and pays on a link rather than driving uninsured.",
  },

  "united-india-insurance": {
    operatingContext:
      "United India Insurance Company is a Chennai-headquartered public-sector general insurer with a deep southern-India presence and long-standing participation in government-sponsored health and crop schemes, alongside a conventional motor, health and commercial book. Scheme business puts it in front of beneficiaries with very low digital literacy who need eligibility, coverage and claim-procedure questions answered in Tamil, Telugu and Kannada — a workload its divisional and branch offices absorb manually today. Its servicing model is office-anchored with helplines and third-party administrators handling health claims, and agents carrying renewal responsibility on retail lines. The insurer has operated under solvency and profitability pressure common to the public-sector general insurers, which constrains discretionary spend and pushes modernisation into tender scopes with demonstrable operational payback.",
    strategicPressure: [
      { text: "United India is a public-sector general insurer with significant participation in government-sponsored health insurance schemes and a southern-India-weighted footprint", kind: "verified" },
      { text: "PSU general insurers have been under solvency and profitability pressure, which limits discretionary technology spending to items with clear operational payback", kind: "verified" },
      { text: "Scheme beneficiaries generate high query volume with near-zero digital literacy, so servicing them is inherently voice-based and inherently vernacular", kind: "inference" },
      { text: "Scheme-servicing quality is visible to sponsoring government departments, giving the insurer an external reason to fund a defensible improvement", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. Procurement runs through tenders with system integrators delivering, and there is no internal engineering capability or precedent for building conversational AI. Scheme-servicing automation is a defensible, well-bounded tender scope with an outcome the insurer can report to sponsoring departments — which is exactly how a PSU justifies a new spend.",
    whyNotBuild:
      "Tamil, Telugu and Kannada speech on low-quality mobile connections, compliant telephony, orchestration into scheme beneficiary and claims records, and audit evidence for both IRDAI and government scheme audits are four specialist capabilities. A state-owned insurer under solvency pressure will procure them with contractual accountability rather than attempt any part internally.",
    workflows: [
      {
        name: "Government health-scheme beneficiary query servicing",
        friction: "Beneficiaries call or visit offices to ask whether a procedure is covered, which hospitals are empanelled, and what documents a claim needs, and staff answer the same questions all day in person",
        outcome: "Grounded answers on eligibility, coverage and empanelled hospitals in the beneficiary's language at any hour, improving scheme service metrics and freeing office staff",
        channels: ["Voice", "SMS"],
        systems: ["Scheme beneficiary database", "Empanelled hospital directory", "Claims management system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Health-claim status and document guidance for scheme and retail claimants",
        friction: "Claim status sits between the insurer and the third-party administrator, and claimants chase both without getting a definitive answer or knowing what document is missing",
        outcome: "A single authenticated status answer with the pending requirement named and the document collected in-conversation, shortening claim turnaround",
        channels: ["Voice", "WhatsApp"],
        systems: ["Health TPA platform", "Claims management system", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Motor and health renewal reminders in southern languages",
        friction: "Retail renewals depend on agent activity, and lapse in the southern retail book is a straightforward premium leak the insurer cannot afford",
        outcome: "Timely vernacular renewal outreach with payment in-channel, recovering premium at a cost per contact well below agent economics",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Agent records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A toll-free helpline for claim intimation and policy queries",
        "A customer portal and mobile app for policy documents and renewals",
        "A branch and divisional-office network providing in-person servicing across southern India",
        "Third-party administrator arrangements for health and scheme-claim processing",
      ],
      gaps: [
        "Scheme beneficiaries have no vernacular self-service channel for eligibility and coverage questions",
        "Claim status is fragmented between the insurer and the TPA with no single authoritative answer for the claimant",
        "No systematic renewal outreach for retail policies without an active agent",
        "Servicing is effectively unavailable outside office hours",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations and scheme-specific service obligations set turnaround expectations that automated servicing must evidence",
      "Government-scheme data carries additional confidentiality and audit obligations beyond DPDP, and any processing arrangement will be scrutinised by the sponsoring department",
      "Public-sector tender cycles and solvency-driven budget constraints determine both timing and scope of any engagement",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions for tender-stage validation — volume estimates scheme, claim and renewal contact across a southern-weighted PSU general-insurance book, and cost per interaction blends office, helpline and TPA handling.",
    },
    pilotScope:
      "A twelve-week scheme-servicing pilot in Tamil and Telugu covering eligibility, empanelled-hospital and claim-procedure queries for one state scheme, measured on office footfall, query resolution rate and scheme service metrics reported to the sponsoring department.",
    expansion: [
      "Add Kannada and Hindi coverage and extend to additional state schemes",
      "Introduce health-claim status and document guidance across scheme and retail claimants",
      "Add motor and health renewal outreach for the southern retail book",
    ],
    stakeholders: [
      "Chairman and Managing Director",
      "General Manager, Information Technology",
      "General Manager, Health and Government Business",
      "Head of Claims",
      "Chief Grievance Redressal Officer",
    ],
    discovery: [
      "Which government health schemes are you currently servicing, and what contact volume does each generate?",
      "What service metrics do sponsoring departments hold you to, and how are they measured today?",
      "Where does the boundary sit between you and your TPAs for beneficiary communication?",
      "How would a scheme-servicing improvement be funded — from your own budget or from scheme administration costs?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A scheme beneficiary in rural Tamil Nadu calls United India in Tamil to ask whether a surgery is covered and which nearby hospital is empanelled, and gets both answers immediately.",
  },

  "sbi-general-insurance": {
    operatingContext:
      "SBI General Insurance is a general insurer built on State Bank of India's branch distribution, which gives it access to a customer base no private insurer can match in reach — including first-time insurance buyers in rural and semi-urban India who bought a motor, health or personal-accident policy across a bank counter. That distribution advantage has driven rapid premium growth, but the servicing infrastructure required to support those policyholders had to be built standalone rather than inherited, so capacity lags reach. Its retail book generates claim intimation, cashless pre-authorisation, document chase, status chasing and renewal contact in Hindi, Marathi, Tamil, Bengali, Telugu and English. Servicing runs through a contact centre, a customer app and portal, third-party administrators for health claims, and informal help from the SBI branch that made the sale.",
    strategicPressure: [
      { text: "SBI General distributes heavily through State Bank of India's branch network, giving it unmatched reach into rural and semi-urban customers", kind: "verified" },
      { text: "Growth through bank distribution outpaces standalone servicing capacity, because reach was inherited while service infrastructure had to be built", kind: "inference" },
      { text: "First-time insurance buyers need claim procedures and renewal obligations explained in plain vernacular, generating more contacts per policy than an experienced customer base", kind: "inference" },
      { text: "It operates its technology estate separately from SBI's own bank systems, so vendor decisions can be made at the insurer level rather than through group IT", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. SBI General assembles its stack from vendors and directs its investment toward distribution enablement and underwriting rather than platform engineering. Its growth trajectory makes buying servicing capacity far faster than building it, and there is no public evidence of internal speech or conversational-AI engineering at the insurer.",
    whyNotBuild:
      "Six-language voice servicing integrated to policy, claims and TPA systems, with compliant telephony and IRDAI-grade conversation evaluation, is four specialist products. An insurer whose bottleneck is servicing capacity right now cannot wait years for an internal build, and its engineering bench is committed to digital sales journeys where the growth is.",
    workflows: [
      {
        name: "First-time buyer claim-intimation guidance",
        friction: "A customer who bought a policy at a bank counter has no idea how to intimate a claim, calls the branch, is redirected, and starts an already stressful process by being bounced",
        outcome: "Guided claim intimation in the customer's language with immediate reference generation and a clear document checklist, converting the worst moment into a controlled one",
        channels: ["Voice", "WhatsApp"],
        systems: ["Claims management system", "Policy administration system", "Health TPA platform", "Garage and network directory"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Renewal reminders and lapse prevention on bank-sold policies",
        friction: "Bank-sold customers have no relationship with the insurer between purchase and renewal, and a generic SMS at expiry converts poorly",
        outcome: "Two-way vernacular renewal conversations that explain what the cover does and take payment, defending renewal rates on a book with no advisor relationship",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Bancassurance customer records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claim-status updates and document chase",
        friction: "Claimants call repeatedly for status while documents sit pending, and nobody proactively tells them what is missing until a rejection or a delay notice arrives",
        outcome: "Proactive stage updates with the pending requirement named and collected in-channel, cutting turnaround and status-call volume together",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Claims management system", "Document management", "Health TPA platform"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer mobile app and portal for policy documents, renewal and claim intimation",
        "A contact centre supporting claims, servicing and renewals",
        "Third-party administrator arrangements for health-claim processing and cashless coordination",
        "SBI branch staff assisting customers with insurance queries at the point of sale and afterwards",
      ],
      gaps: [
        "First-time buyers have no guided, in-language path from incident to claim intimation",
        "Renewal outreach on bank-sold policies is largely SMS-driven with no two-way capability",
        "Document deficiencies are communicated reactively rather than chased proactively",
        "Vernacular voice coverage lags the geographic spread of SBI's distribution",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations bound claim turnaround and prohibit misrepresentation of coverage, so automated statements must be grounded in policy wording",
      "Bancassurance data-sharing between SBI and the insurer is limited by DPDP consent and the distribution agreement",
      "TRAI preference-registry and DLT rules govern renewal outreach, and claim-stage conversations require conservative scripting with immediate human escalation on distress",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery validation — volume estimates claim, renewal and servicing contact for a fast-growing bancassurance general insurer, and cost per interaction blends contact-centre and TPA-handled interaction economics in India.",
    },
    pilotScope:
      "A ten-week claim-servicing pilot on the retail health and motor book in Hindi, Marathi and English: guided claim intimation plus proactive status and document chase, measured on claim turnaround and status-call suppression.",
    expansion: [
      "Extend to Tamil, Bengali and Telugu matching SBI's distribution footprint",
      "Add renewal outreach and lapse prevention across the bank-sold retail book",
      "Introduce cashless pre-authorisation status servicing in coordination with TPAs",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Claims",
      "Chief Technology Officer",
      "Head of Customer Service",
      "Head of Bancassurance Distribution",
    ],
    discovery: [
      "How much of your inbound volume comes from customers who bought at an SBI branch and have never used your app?",
      "What is your renewal-retention rate on bank-sold retail policies versus agent-sold ones?",
      "How much of your health-claim turnaround is document chase, and who owns that today — you or the TPA?",
      "Are servicing technology decisions made at SBI General level or does SBI group IT policy apply?",
    ],
    flowTemplate: "claims",
    scenario:
      "An SBI General health policyholder in rural Maharashtra calls in Marathi after a hospital admission, is guided through cashless intimation, and receives status updates without calling again.",
  },

  "niva-bupa-health": {
    operatingContext:
      "Niva Bupa Health Insurance is a standalone health insurer, recently listed, growing retail health premium rapidly in a category where servicing is not a support function but the product itself. Its customers interact with the company at the most stressful moments of their lives: an emergency admission where cashless pre-authorisation must be confirmed while the family waits at the hospital desk, a reimbursement claim where a missing document delays settlement, or a network query about whether a particular hospital is empanelled. These moments happen around the clock and cluster unpredictably, which punishes any model built on staffed shift capacity. Distribution runs through agents, brokers, bancassurance partners and a direct digital channel, and the customer base spans metros and tier-2 cities in Hindi, Marathi, Tamil and English. Claim processing is largely in-house rather than outsourced, which is a genuine differentiator and also concentrates the communication load on the insurer.",
    strategicPressure: [
      { text: "Niva Bupa is a standalone health insurer that recently listed and is growing retail health premium at a rapid pace", kind: "verified" },
      { text: "In retail health, claims experience is the primary basis of competition and renewal, because the product is invisible until a claim happens", kind: "verified" },
      { text: "Health-claim moments are unpredictable and around-the-clock, so staffed contact-centre capacity is structurally mismatched to when customers actually need answers", kind: "inference" },
      { text: "Listed-company scrutiny of the combined ratio makes servicing cost per policy a metric management now reports against, not just an operational number", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Niva Bupa's investment is directed at distribution, underwriting and in-house claims capability — the things that determine its economics. There is no public evidence of a speech or conversational-AI engineering function, and a recently listed insurer scaling distribution will not divert capital into building one. Conversational servicing is a capability it will procure with clear service levels.",
    whyNotBuild:
      "Answering a family at a hospital admission desk requires speech recognition that works in a noisy environment, telephony with genuine around-the-clock reliability, orchestration into the claims and pre-authorisation systems in real time, and an evaluation regime that proves no automated statement about coverage was wrong — a claim-denial-adjacent risk. Four specialist products, and getting any one of them wrong at the moment of a hospital admission is a brand event.",
    workflows: [
      {
        name: "Cashless pre-authorisation status at the point of admission",
        friction: "The family waits at the hospital desk while the hospital, the insurer and the claims team exchange information, and every phone call to check status adds to the wait and the anxiety",
        outcome: "Authenticated, real-time pre-authorisation status available on demand in the caller's language, with any pending requirement named and routed immediately",
        channels: ["Voice", "WhatsApp"],
        systems: ["Claims and pre-authorisation system", "Network hospital directory", "Policy administration system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Reimbursement claim document guidance and status",
        friction: "Reimbursement claims stall on document deficiencies discovered days after submission, and customers call repeatedly for status without being told what is actually missing",
        outcome: "Guided in-flow document validation with a tracked checklist and proactive stage updates, shortening settlement and eliminating the status call entirely",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Claims management system", "Document management and verification", "Policy administration system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy, network and coverage queries before treatment",
        friction: "Customers want to know before treatment whether a hospital is in network, whether a condition is within the waiting period, and what the room-rent limit is — questions that need a human today",
        outcome: "Grounded pre-treatment answers from the policy record and network directory, reducing claim disputes that originate in misunderstood coverage",
        channels: ["Voice", "WhatsApp"],
        systems: ["Policy administration system", "Network hospital directory", "Product and benefit rules"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer mobile app and portal for policy details, network hospital search and claim submission",
        "An in-house claims operation rather than full reliance on third-party administrators",
        "A contact centre supporting claims, pre-authorisation and policy queries",
        "SMS and email notification of claim registration and settlement events",
      ],
      gaps: [
        "No authenticated real-time pre-authorisation status for a family standing at an admission desk at 2am",
        "Document deficiencies are communicated after submission rather than validated in-flow",
        "Pre-treatment coverage questions require a human, so many customers simply do not ask and dispute later",
        "Vernacular voice depth lags a customer base expanding into tier-2 cities",
      ],
    },
    risks: [
      "IRDAI health-insurance regulations set cashless authorisation and claim-settlement turnaround expectations, and any automated statement about coverage or exclusions is effectively a coverage representation requiring grounding and audit",
      "Claim-stage conversations involve distressed customers, so conservative scripting and unconditional human escalation on distress cues are mandatory",
      "DPDP obligations are elevated because health-claim conversations involve sensitive personal health information, requiring strict access control and retention discipline",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.4,
      automationRate: 0.55,
      basis: "Seller assumptions to validate in discovery — volume estimates claim, pre-authorisation, coverage and renewal contact for a fast-growing retail health book, and cost per interaction reflects Indian contact-centre economics for longer, more complex health-claim interactions.",
    },
    pilotScope:
      "A ten-week pilot on cashless pre-authorisation status and network queries in Hindi and English, available around the clock with authenticated status from the pre-authorisation system and immediate human escalation on any coverage dispute, measured on repeat-call rate and time-to-answer at admission.",
    expansion: [
      "Add reimbursement claim document guidance with in-flow validation and proactive status",
      "Extend to Marathi and Tamil and add pre-treatment coverage and waiting-period queries",
      "Introduce renewal outreach with claims-history-aware conversations for the retail book",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Claims",
      "Chief Technology Officer",
      "Chief Customer Officer or Head of Service",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What share of your inbound volume is claim-status and pre-authorisation status chasing?",
      "What is your average time from pre-authorisation request to a decision the family can act on?",
      "How much of your reimbursement-claim turnaround is document deficiency, and when is the customer told?",
      "What proportion of claim disputes trace back to coverage the customer misunderstood before treatment?",
    ],
    flowTemplate: "claims",
    scenario:
      "A Niva Bupa customer standing at a hospital admission desk at 2am asks in Hindi for cashless status and gets an authenticated answer with the pending document named in under a minute.",
  },

  "care-health-insurance": {
    operatingContext:
      "Care Health Insurance is a standalone health insurer with Religare lineage, writing both a large retail health book and substantial group health business for corporate clients. That dual model produces two distinct servicing populations: retail policyholders whose interactions cluster around claims, pre-authorisation and renewals, and group-policy members whose queries spike at corporate enrolment and renewal cycles when thousands of employees simultaneously need e-cards, coverage explanations and dependant additions. Claims operations centre on pre-authorisation coordination with network hospitals, document collection for reimbursement, and settlement communication. Distribution runs through agents, brokers, bancassurance and direct channels, and the customer base needs Hindi, Marathi, Bengali and English servicing across metros and tier-2 cities.",
    strategicPressure: [
      { text: "Care Health writes both retail and group health business, giving it two servicing populations with different volume patterns and peak timing", kind: "verified" },
      { text: "Standalone health insurers compete primarily on claims experience, making document-chase friction and settlement turnaround direct competitive variables", kind: "verified" },
      { text: "Corporate group renewal cycles create predictable but severe seasonal spikes in member queries that a fixed contact-centre roster handles badly", kind: "inference" },
      { text: "Document deficiency is likely a leading contributor to reimbursement claim turnaround, and every day of delay increases both cost to serve and renewal risk", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Care Health directs investment into distribution, provider network and claims operations. Its technology estate is vendor-assembled around policy administration and claims platforms, and there is no public signal of internal speech or conversational-AI engineering. Standalone health insurers compete on claims experience, not on owning communications infrastructure.",
    whyNotBuild:
      "Health-claim servicing needs multilingual speech, reliable around-the-clock telephony, orchestration into claims, pre-authorisation and group-enrolment systems, and evaluation evidence that every coverage statement was accurate — a regulatory and litigation-adjacent requirement. Building four specialist capabilities to reduce contact-centre cost is a worse use of capital than buying them with contractual service levels.",
    workflows: [
      {
        name: "Reimbursement claim document chase with in-flow validation",
        friction: "Claims are submitted with incomplete or wrongly formatted documents, the deficiency is identified days later, and the customer is notified by a message that does not explain what to do",
        outcome: "Documents validated conversationally at submission with a tracked checklist and guided re-upload, materially shortening reimbursement turnaround",
        channels: ["WhatsApp", "Voice"],
        systems: ["Claims management system", "Document management and verification", "Policy administration system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cashless pre-authorisation status and network-hospital queries",
        friction: "Families and hospital desks chase authorisation status by phone during admission, and the same status is repeated by agents across multiple calls",
        outcome: "Authenticated real-time authorisation status with the pending requirement named, delivered on demand in the caller's language at any hour",
        channels: ["Voice", "WhatsApp"],
        systems: ["Pre-authorisation and claims system", "Network hospital directory", "Policy administration system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Group-policy member servicing at corporate enrolment and renewal peaks",
        friction: "At corporate renewal, thousands of employees simultaneously need e-cards, coverage explanations and dependant additions, and the HR team and the insurer's desk both drown",
        outcome: "Elastic member servicing that absorbs the enrolment peak, delivering e-cards and coverage answers without adding seasonal headcount",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Group policy administration", "Member enrolment records", "E-card generation", "Corporate client records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer mobile app and portal for policy details, network search and claim submission",
        "A contact centre handling claims, pre-authorisation and policy queries",
        "WhatsApp-based servicing for common transactions such as e-cards and claim status",
        "Corporate HR portals and dedicated desks for group-policy clients",
      ],
      gaps: [
        "Document validation happens after submission rather than in the moment of submission",
        "Pre-authorisation status is not available as an authenticated self-service answer",
        "Group enrolment peaks are handled by adding temporary human capacity rather than elastic automation",
        "Vernacular voice coverage is narrower than the geographic spread of the retail book",
      ],
    },
    risks: [
      "IRDAI health-insurance regulations set cashless authorisation and settlement turnaround expectations, and coverage statements made by an automated agent carry the same weight as those made by staff",
      "Health-claim conversations involve sensitive personal health data, elevating DPDP obligations around access control, processing purpose and retention",
      "Group-policy servicing involves corporate client data and HR relationships, so member-facing automation needs the corporate client's agreement as well as the member's",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery — volume estimates retail claim, pre-authorisation and group-member contact across a large standalone health book, and cost per interaction reflects Indian contact-centre economics for health-claim interactions.",
    },
    pilotScope:
      "A ten-week pilot on reimbursement claim document chase in Hindi and English: conversational checklist validation at submission with guided re-upload and proactive status, measured on document-deficiency rate and reimbursement turnaround against a control cohort.",
    expansion: [
      "Add cashless pre-authorisation status servicing around the clock with network-hospital queries",
      "Extend to Marathi and Bengali and add renewal outreach for the retail book",
      "Introduce group-member servicing timed to corporate enrolment and renewal peaks",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Claims",
      "Chief Technology Officer",
      "Head of Group and Corporate Business",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Where does document deficiency rank in your reimbursement claim turnaround breakdown?",
      "What is the peak-to-baseline volume ratio at your largest corporate group renewals?",
      "How many contacts does a typical reimbursement claim generate from submission to settlement?",
      "Which languages does your claims desk support, and where does that break down by geography?",
    ],
    flowTemplate: "claims",
    scenario:
      "A Care Health customer submits a reimbursement claim on WhatsApp, is told immediately that the discharge summary is missing a page, and re-uploads it before the claim ever enters a queue.",
  },

  "manipalcigna-health": {
    operatingContext:
      "ManipalCigna Health Insurance is a standalone health insurer formed as a joint venture between the Manipal group, with its hospital and education lineage, and Cigna, giving it unusual provider-side depth for a mid-sized insurer. It writes retail and group health business through agents, brokers, bancassurance and direct channels, with a customer base concentrated in metros and southern and western India requiring Hindi, Kannada, Marathi and English servicing. Its servicing scale trails the category leaders while its regulatory obligations are identical: the same cashless authorisation timelines, the same claim-settlement turnaround expectations, the same grievance-redressal standards. That asymmetry — full regulatory load on a thinner operating base — is what makes automation disproportionately valuable to a mid-sized health insurer.",
    strategicPressure: [
      { text: "ManipalCigna is a joint venture between the Manipal group and Cigna, operating as a mid-sized standalone health insurer in India", kind: "verified" },
      { text: "Mid-sized health insurers face the same IRDAI cashless and settlement turnaround obligations as the largest players with materially thinner servicing teams", kind: "inference" },
      { text: "Claims experience is the competitive battleground in retail health, so a service gap against larger rivals directly costs renewals", kind: "inference" },
      { text: "Cigna's global posture of deploying vendor platforms across markets reinforces a buy path but may also impose global platform standards on the India selection", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. A mid-sized joint venture with a global insurance parent procures technology under group vendor governance rather than building it. Its India investment is directed at distribution and provider network. There is no public evidence of internal conversational-AI engineering, and the scale would not support one.",
    whyNotBuild:
      "Multilingual speech, around-the-clock telephony, orchestration into claims and pre-authorisation systems, and evaluation evidence acceptable to IRDAI and a global parent's control framework are four distinct engineering products. For an insurer whose whole problem is a thin operating base, adding four engineering programmes is the opposite of the answer.",
    workflows: [
      {
        name: "Claim-status servicing and network-hospital queries",
        friction: "Claimants and hospital desks call for status and network confirmation, and a thin contact-centre team means wait times spike exactly when admissions cluster",
        outcome: "Authenticated status and network answers available on demand in the caller's language, matching a larger competitor's responsiveness without matching its headcount",
        channels: ["Voice", "WhatsApp"],
        systems: ["Claims management system", "Network hospital directory", "Policy administration system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cashless pre-authorisation coordination and document requirements",
        friction: "Authorisation requests bounce between the hospital, the insurer and the customer over missing clinical or policy documents, extending the admission wait",
        outcome: "The pending requirement is named and chased immediately in-conversation with the right party, compressing time to authorisation",
        channels: ["Voice", "WhatsApp"],
        systems: ["Pre-authorisation system", "Provider and hospital interface", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Renewal and coverage-explanation outreach for the retail book",
        friction: "Retail health renewals are price-sensitive and often lost to a competitor because nobody explained what changed in the premium or the coverage",
        outcome: "Two-way renewal conversations that explain premium changes and coverage in-language and take payment, defending retention in the segment where acquisition cost is highest",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Claims history records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and portal for policy details, network hospital search and claim tracking",
        "A contact centre supporting claims, pre-authorisation and policy queries",
        "Digital and messaging servicing for e-cards, policy documents and claim status",
        "Provider-network relationships including Manipal-group hospitals",
      ],
      gaps: [
        "Authenticated claim and authorisation status still requires reaching a human",
        "Pre-authorisation document deficiencies are resolved by phone tag between three parties",
        "Renewal outreach is capacity-limited and largely message-based rather than conversational",
        "Kannada and Marathi voice servicing depth does not match the geographic concentration of the book",
      ],
    },
    risks: [
      "IRDAI health-insurance regulations set cashless and settlement turnaround expectations that automated servicing must demonstrably support",
      "Cigna global customer-experience and vendor standards may constrain India-level selection, which is the key qualification question on this account",
      "Health-claim conversations involve sensitive personal health data with elevated DPDP obligations on access, purpose and retention",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions to validate — volume estimates claim, authorisation and renewal contact across a mid-sized standalone health book, and cost per interaction reflects Indian contact-centre economics for health interactions.",
    },
    pilotScope:
      "A ten-week claim-status and network-query pilot in Hindi, Kannada and English with authenticated status from the claims system, available beyond contact-centre hours, measured on repeat-contact rate and inbound volume displaced.",
    expansion: [
      "Add cashless pre-authorisation coordination including provider-side document chase",
      "Introduce renewal and coverage-explanation outreach for the retail book",
      "Extend to Marathi and additional languages matching distribution growth",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Claims",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Do Cigna global customer-experience platform standards govern vendor selection for India?",
      "What is your current contact-centre wait time at peak admission hours, and what does that cost you in renewals?",
      "How many parties are typically involved in resolving a pre-authorisation document deficiency?",
      "What is your retail health renewal-retention rate, and how much of the loss is service rather than price?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A ManipalCigna customer in Bengaluru calls in Kannada to confirm a hospital is in network and check her claim status, and gets both from the claims system without waiting for an agent.",
  },

  "reliance-general-insurance": {
    operatingContext:
      "Reliance General Insurance is a general insurer with a motor-and-health-weighted retail franchise that passed from Reliance Capital to IndusInd International Holdings through India's first major financial-conglomerate insolvency resolution. It emerged with a functioning underwriting and distribution business but years of constrained investment in servicing infrastructure, because capital was scarce and management attention was consumed by the resolution process. Distribution runs through agents, brokers, dealer tie-ups for motor, and digital channels, with a policyholder base spread across Hindi, Marathi and Gujarati-speaking western and northern India. New ownership needs visible operational wins to stabilise renewals and rebuild broker and customer confidence, which makes retention and claims responsiveness the natural first priorities.",
    strategicPressure: [
      { text: "The insurer changed ownership through the resolution of Reliance Capital, moving to IndusInd International Holdings", kind: "verified" },
      { text: "A prolonged insolvency process typically constrains discretionary investment in servicing infrastructure and unsettles distribution partners and renewals", kind: "inference" },
      { text: "New ownership needs early, visible operational improvement to stabilise renewal retention and rebuild intermediary confidence", kind: "inference" },
      { text: "Catch-up modernisation under a returns-focused owner favours packaged solutions with fast payback over multi-year platform programmes", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. An insurer emerging from a resolution process under a new, returns-focused owner will prioritise capability it can deploy in quarters, not years. Its technology estate is vendor-assembled and its engineering capacity was not expanded during the constrained period. Any conversational capability will be bought with clear payback and service levels.",
    whyNotBuild:
      "Rebuilding renewal retention needs multilingual speech, compliant outbound telephony, orchestration into policy and payment systems, and conversation evaluation for IRDAI compliance — four builds that would each take longer than the window the new owner has to show progress. Buying is not a preference here; it is the only option that fits the timeline.",
    workflows: [
      {
        name: "Motor-renewal retention outreach post-ownership transition",
        friction: "Motor policies expire on fixed dates and lapse when nobody calls; during the resolution period retention outreach was thin and intermediaries drifted, so leakage is now visible",
        outcome: "Every expiring motor policy receives a timely vernacular conversation with the premium explained and payment taken, rebuilding retention rates measurably",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Vehicle and policy expiry data", "Agent and dealer records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Motor-claim intimation and surveyor-coordination servicing",
        friction: "Claim intimation after an accident goes into a helpline queue, surveyor allocation is communicated inconsistently, and the customer chases status through the repair cycle",
        outcome: "Structured intimation with immediate reference, proactive surveyor and repair status, and garage coordination handled without a human on every call",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Surveyor allocation", "Garage network management", "Policy administration system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Health-claim status and document servicing",
        friction: "Health claimants call repeatedly for status while documents sit pending, adding cost and grievance risk during a period when the brand can least afford it",
        outcome: "Proactive claim status with the pending requirement named and collected in-channel, cutting turnaround and complaint volume together",
        channels: ["WhatsApp", "Voice"],
        systems: ["Health claims platform", "Document management", "Policy administration system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and portal for policy purchase, renewal and claim intimation",
        "A contact centre for claim intimation and policy servicing",
        "Motor dealer and garage network tie-ups supporting claim repair workflows",
        "Agent and broker channels holding much of the renewal relationship",
      ],
      gaps: [
        "Renewal outreach coverage is inconsistent, especially where the intermediary relationship weakened",
        "No proactive claim-stage communication through the repair or settlement cycle",
        "Document deficiencies on health claims are communicated reactively",
        "Vernacular voice servicing depth lags the geographic spread of the book",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations govern claim turnaround and coverage representations in any automated conversation",
      "New-ownership integration may impose its own technology governance and vendor approval process, adding an approval layer",
      "TRAI preference-registry rules constrain outbound renewal calling, and DPDP obligations apply to policyholder contact data across the transition",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery — volume estimates renewal, claim and servicing contact for a motor-and-health-weighted general insurance retail book, and cost per interaction blends contact-centre and outbound campaign economics in India.",
    },
    pilotScope:
      "A ten-week motor-renewal retention pilot on policies expiring in the pilot window across Maharashtra and Gujarat in Marathi, Gujarati and Hindi, with premium explained and payment taken in-conversation, measured on renewal rate against a matched control.",
    expansion: [
      "Extend renewal outreach nationally and across health and personal-lines products",
      "Add motor-claim intimation with proactive surveyor and repair-status communication",
      "Introduce health-claim status and document servicing",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Retail Business and Renewals",
      "Chief Technology Officer",
      "Head of Claims",
    ],
    discovery: [
      "How has motor-renewal retention moved through the ownership-transition period?",
      "Which distribution relationships weakened during the resolution, and where is leakage concentrated?",
      "What are the new owner's stated operational priorities and investment horizon for this business?",
      "Does the new ownership structure introduce a separate technology vendor approval process?",
    ],
    flowTemplate: "retention",
    scenario:
      "A Reliance General motor policyholder in Ahmedabad whose agent went quiet during the resolution gets a Gujarati renewal call, hears the premium explained, and renews rather than switching.",
  },

  "cholamandalam-ms-general": {
    operatingContext:
      "Cholamandalam MS General Insurance is a joint venture between the Murugappa group and Mitsui Sumitomo Insurance, with a motor-heavy portfolio distributed strongly through vehicle dealers, automotive financiers and agents, particularly across southern India. That distribution shape determines the servicing pattern: a customer who bought motor cover at a dealership calls the insurer when an accident happens, needs a surveyor allocated, wants a cashless garage confirmed, and chases the repair and settlement status through the workshop cycle. Claim volume is tied to vehicle ownership and usage cycles, and commercial-vehicle and two-wheeler segments each bring their own coordination patterns. Servicing runs through a contact centre, a customer app, surveyor and garage networks, and the dealer or financier who sold the policy, with Tamil, Telugu, Kannada, Hindi and English all in daily use.",
    strategicPressure: [
      { text: "Cholamandalam MS is a joint venture between the Murugappa group and Mitsui Sumitomo Insurance with a motor-weighted general insurance portfolio", kind: "verified" },
      { text: "Its distribution leans on vehicle-dealer and financier channels, so a large share of policyholders have no direct digital relationship with the insurer", kind: "inference" },
      { text: "Motor-claim servicing is inherently multi-party — customer, surveyor, garage, financier — and coordination failure is the main driver of both cost and dissatisfaction", kind: "inference" },
      { text: "A Japanese co-parent favours auditable, contracted vendor systems, which supports a packaged deployment but lengthens the diligence process", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. The joint venture assembles technology from vendors under governance shaped by a conservative Indian promoter group and a Japanese insurance parent, both of which prioritise proven systems with audit evidence over internal experimentation. There is no public signal of internal AI or speech engineering at the insurer.",
    whyNotBuild:
      "Motor-claim coordination needs speech in five languages, telephony that reaches customers at accident scenes, orchestration across claims, surveyor allocation and garage network systems, and evaluation evidence acceptable to IRDAI and a Japanese parent's control framework. That is four specialist products for an insurer whose competitive edge is underwriting discipline and dealer relationships.",
    workflows: [
      {
        name: "Motor-claim intimation and surveyor-appointment coordination",
        friction: "A customer at an accident scene calls a helpline, waits, repeats vehicle and policy details, and then waits again for someone to tell them which surveyor is coming and when",
        outcome: "Structured intimation in any of five languages with immediate reference, surveyor allocation confirmed and communicated, and the garage option explained on the same call",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Surveyor allocation", "Garage and workshop network", "Policy administration system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Repair-status and settlement communication through the workshop cycle",
        friction: "Once the vehicle is in the workshop the customer has no visibility, so they call the insurer, the garage and the dealer in turn to ask the same question",
        outcome: "Proactive repair and settlement status pushed to the customer at every stage, eliminating the three-way status chase",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Claims management system", "Garage and workshop network", "Payment and settlement systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Motor renewal outreach through dealer and financier channels",
        friction: "Renewals depend on whether the dealer or financier who sold the policy follows up, and customers who financed a vehicle often do not know their cover is expiring",
        outcome: "Direct vernacular renewal contact with the premium explained and payment taken, reducing leakage on a channel where the insurer has no relationship today",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Dealer and financier records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and portal for policy documents, renewal and claim intimation",
        "A contact centre and toll-free claim-intimation helpline",
        "Surveyor and cashless-garage networks supporting motor-claim repair",
        "Dealer and financier channel relationships that carry sales and some servicing",
      ],
      gaps: [
        "No proactive status communication through the surveyor and workshop cycle",
        "Dealer-sold customers have no direct servicing relationship with the insurer until a claim",
        "Vernacular voice coverage is inconsistent relative to a five-language customer base",
        "Renewal outreach depends on channel-partner effort rather than a direct insurer process",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations govern claim turnaround and coverage representations, requiring grounded and auditable automated communication",
      "Japanese co-parent governance demands strong audit evidence and thorough vendor diligence, extending the sales cycle",
      "Motor third-party claims are litigation-linked and must be restricted to factual status in any automated conversation; TRAI and DPDP rules apply to renewal outreach",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions to validate in discovery — volume estimates motor and health claim, renewal and servicing contact across the retail book, and cost per interaction blends helpline and claim-coordination handling costs in India.",
    },
    pilotScope:
      "A ten-week motor-claim pilot in Tamil, Telugu and English covering intimation and surveyor-appointment coordination plus proactive repair status for one southern zone, measured on status-call suppression and claim-cycle time.",
    expansion: [
      "Extend to Kannada, Hindi and Marathi and to all zones",
      "Add direct motor-renewal outreach for dealer and financier-sourced policies",
      "Introduce health-claim status and document servicing for the accident and health book",
    ],
    stakeholders: [
      "Managing Director",
      "Chief Operating Officer",
      "Head of Claims",
      "Chief Technology Officer",
      "Head of Retail Distribution and Dealer Channel",
    ],
    discovery: [
      "What share of your motor book is sourced through dealers and financiers, and do those customers ever contact you before a claim?",
      "When a customer calls about a claim in the workshop, who actually has the answer — you, the surveyor or the garage?",
      "What is your motor renewal-retention rate by channel, and where is leakage worst?",
      "What audit and diligence requirements does Mitsui Sumitomo impose on a customer-facing vendor?",
    ],
    flowTemplate: "claims",
    scenario:
      "A Cholamandalam MS motor policyholder in Chennai intimates an accident claim in Tamil, gets the surveyor time confirmed on the call, and receives repair status without chasing the garage.",
  },

  "royal-sundaram-general": {
    operatingContext:
      "Royal Sundaram General Insurance is a Chennai-based general insurer in the Sundaram family orbit, running a disciplined motor and health portfolio concentrated in southern India and distributed through agents, brokers, motor dealers, bancassurance and direct channels. Its market position rests on a service reputation rather than on price aggression or scale, which makes claims responsiveness and renewal experience genuinely load-bearing for the franchise. Motor claims dominate retail volume: intimation, surveyor allocation, cashless garage coordination and settlement status, followed by health claims with their own pre-authorisation and document cycles. Customers transact primarily in Tamil with Kannada, Hindi and English also in use, and the conservative Sundaram operating culture prizes proven systems over experimentation.",
    strategicPressure: [
      { text: "Royal Sundaram is a Chennai-headquartered general insurer with a motor and health portfolio concentrated in southern India", kind: "verified" },
      { text: "Its differentiation is service reputation rather than scale or price, so any degradation in claims or renewal experience directly attacks its market position", kind: "inference" },
      { text: "Tamil-first claim and renewal servicing at lower cost per contact is the specific way it can defend that reputation as volumes grow without proportional headcount", kind: "inference" },
      { text: "A conservative promoter culture will require strong references and audit evidence, but will also value a bounded, provable first deployment over a platform narrative", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. The Sundaram operating culture buys proven solutions with references and avoids speculative internal builds; its technology function integrates vendor policy and claims platforms. There is no public evidence of internal AI or speech engineering, and the insurer's scale does not support building one.",
    whyNotBuild:
      "Tamil and Kannada speech, telephony reliable enough for accident-scene calls, orchestration into claims and surveyor systems, and IRDAI-grade evaluation of every coverage statement are four separate engineering products. An insurer competing on service reputation cannot risk a home-grown system misstating coverage at a claim moment — the reputational downside dwarfs any cost saving.",
    workflows: [
      {
        name: "Tamil-language motor-claim intimation and status servicing",
        friction: "Claim intimation and status chasing dominate inbound volume, and Tamil-language capacity constrains how quickly customers get answers at peak times",
        outcome: "Structured Tamil claim intimation with immediate reference and proactive surveyor and settlement status, holding service quality as volumes grow",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Surveyor allocation", "Garage network", "Policy administration system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Renewal outreach and lapse prevention on motor and health",
        friction: "Renewals depend on agent and channel follow-up, and a service-led insurer loses customers it could have kept simply because nobody called before expiry",
        outcome: "Timely Tamil and Kannada renewal conversations with the premium explained and payment taken, defending retention as the direct proof of the service proposition",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration system", "Payment gateway", "Agent and channel records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Health-claim pre-authorisation and document servicing",
        friction: "Health claimants need authorisation status at admission and document guidance for reimbursement, and both are handled by a contact centre sized for average rather than peak load",
        outcome: "Authenticated authorisation status and guided document collection available at any hour, protecting the service reputation at the moments that matter most",
        channels: ["Voice", "WhatsApp"],
        systems: ["Health claims and pre-authorisation system", "Network hospital directory", "Document management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer app and portal for policy documents, renewal and claim intimation",
        "A contact centre and toll-free claim helpline with Tamil-language support",
        "Surveyor and cashless-garage networks for motor claims",
        "Agent, broker and dealer channels holding much of the customer relationship",
      ],
      gaps: [
        "No proactive claim-stage status communication, so status chasing persists",
        "Renewal outreach coverage depends on channel-partner effort",
        "Health authorisation status is not available as authenticated self-service outside contact-centre hours",
        "Kannada and Hindi servicing depth trails Tamil coverage",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations govern claim turnaround and coverage representations in automated conversations",
      "Any group-level technology sharing or vendor arrangements with other Sundaram entities must be mapped before scoping, to avoid conflicts with excluded accounts",
      "TRAI preference-registry rules apply to renewal outreach and DPDP obligations apply to claim and health data",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions to validate — volume estimates motor and health claim, renewal and servicing contact across a southern-weighted general insurance retail book, and cost per interaction reflects Indian contact-centre economics.",
    },
    pilotScope:
      "A ten-week Tamil-language motor-claim pilot covering intimation, surveyor coordination and proactive status for the Tamil Nadu book, measured on status-call suppression, claim-cycle time and customer-satisfaction scores against the current baseline.",
    expansion: [
      "Add Kannada, Hindi and English coverage and extend to all southern states",
      "Introduce renewal outreach and lapse prevention across motor and health",
      "Add health pre-authorisation status and reimbursement document servicing",
    ],
    stakeholders: [
      "Managing Director and Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Claims",
      "Chief Technology Officer",
      "Head of Customer Service",
    ],
    discovery: [
      "How do you measure the service reputation you compete on, and where is it under pressure?",
      "What proportion of claim-related inbound calls are status chasing rather than new information?",
      "Is any technology or vendor arrangement shared with other Sundaram group entities?",
      "What renewal-retention rate do you achieve, and how much of the loss is contactability?",
    ],
    flowTemplate: "claims",
    scenario:
      "A Royal Sundaram motor customer in Madurai intimates a claim in Tamil, has the surveyor confirmed on the call, and gets repair status pushed to WhatsApp without calling again.",
  },

  "iffco-tokio-general": {
    operatingContext:
      "IFFCO Tokio General Insurance is a joint venture between the IFFCO fertiliser cooperative and Tokio Marine, and its distinguishing asset is genuinely deep rural distribution through cooperative-society networks that reach farming households other insurers cannot access economically. That translates into a portfolio unusually weighted toward crop, cattle and rural motor cover alongside conventional lines, and a customer base that is agricultural, vernacular and seasonal. Crop-insurance claim seasons — after a failed monsoon, a hailstorm, an unseasonal rain event — create extreme, geographically concentrated communication surges where tens of thousands of farmers need intimation, survey scheduling and settlement status within days. Servicing runs through cooperative societies, agents, a contact centre and field surveyors, in Hindi, Marathi, Gujarati, Telugu and English.",
    strategicPressure: [
      { text: "IFFCO Tokio is a joint venture of the IFFCO cooperative and Tokio Marine with distribution reaching rural India through cooperative-society networks", kind: "verified" },
      { text: "Crop and rural lines produce claim events that are seasonal, weather-triggered and geographically concentrated, creating surges no fixed contact-centre roster can absorb", kind: "verified" },
      { text: "Crop-scheme servicing obligations are visible to state governments and scheme administrators, so surge performance is externally scrutinised, not just internally costed", kind: "inference" },
      { text: "Neither a fertiliser cooperative nor a Japanese insurer would build conversational AI in India; both would procure it with clear accountability", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Neither parent has any reason or capability to build conversational AI for an Indian general insurer: IFFCO is a cooperative in fertiliser and agri-inputs, Tokio Marine standardises on procured platforms with strong governance. The joint venture's technology function integrates vendor systems and would procure a surge-capable communication capability with contractual service levels.",
    whyNotBuild:
      "Absorbing a crop-claim surge means multilingual speech across agricultural vernaculars, telephony that can scale from baseline to a large multiple within hours, orchestration into crop-scheme beneficiary and claims records, and evaluation evidence for both IRDAI and scheme audits. Elastic capacity is exactly the thing an internal build cannot deliver, because the surge is precisely when a home-grown system would break.",
    workflows: [
      {
        name: "Crop-claim intimation and survey coordination during claim season",
        friction: "After a weather event tens of thousands of farmers must intimate claims within a narrow window, and cooperative societies and the contact centre are overwhelmed simultaneously",
        outcome: "Elastic intimation capacity in agricultural vernaculars with structured capture of plot, crop and event details and survey scheduling communicated back, absorbing the surge without seasonal hiring",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Crop-scheme beneficiary records", "Claims management system", "Surveyor and loss-assessor allocation", "Land and plot records interface"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Crop and rural claim-status servicing for farmers and cooperative societies",
        friction: "Farmers and society secretaries chase settlement status by phone across weeks, and the same answer is repeated hundreds of times per district",
        outcome: "Authenticated status on demand in the farmer's language with proactive updates at each stage, removing the dominant post-season inbound driver",
        channels: ["Voice", "SMS"],
        systems: ["Claims management system", "Crop-scheme beneficiary records", "Payment and settlement systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rural motor and cattle policy servicing and renewal",
        friction: "Rural motor and cattle policies renew through cooperative societies and agents, and lapse quietly when the intermediary is busy with the season",
        outcome: "Direct vernacular renewal outreach and policy servicing that does not depend on intermediary availability, protecting rural premium",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Policy administration system", "Payment gateway", "Cooperative society and agent records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Cooperative-society distribution reaching farming households across rural districts",
        "A toll-free claim-intimation helpline and customer contact centre",
        "A customer app and portal for policy documents and claim intimation",
        "Field surveyor and loss-assessor networks for crop and rural claims",
      ],
      gaps: [
        "No elastic communication capacity for weather-triggered claim surges",
        "Farmers have no self-service way to check claim or settlement status",
        "Rural motor and cattle renewals depend entirely on intermediary follow-up",
        "Vernacular voice coverage does not extend across all the agricultural geographies served",
      ],
    },
    risks: [
      "Crop-insurance scheme rules impose intimation windows, survey timelines and settlement obligations that are audited by scheme administrators as well as IRDAI",
      "Scheme beneficiary data carries confidentiality obligations beyond ordinary DPDP requirements, and processing arrangements require scheme-administrator comfort",
      "Farmer-facing automated communication after a crop loss is politically sensitive and requires conservative scripting with clear human escalation",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery — the baseline volume estimates routine rural claim, renewal and servicing contact; crop-season surges sit well above it and are the real design constraint. Cost per interaction reflects Indian helpline and cooperative-society handling.",
    },
    pilotScope:
      "A twelve-week pilot timed to one crop-claim season in a single state cluster: vernacular claim intimation with structured plot and event capture plus proactive survey and settlement status, measured on intimation completeness, surge absorption and status-call volume.",
    expansion: [
      "Extend to additional states and crop cycles with the full vernacular set",
      "Add rural motor and cattle renewal outreach independent of intermediary availability",
      "Introduce cooperative-society support servicing so society secretaries can self-serve on member queries",
    ],
    stakeholders: [
      "Managing Director",
      "Head of Rural and Agriculture Business",
      "Head of Claims",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "In your last crop-claim season, what was the peak-to-baseline call volume ratio, and how did you staff it?",
      "Which crop schemes do you participate in, and what intimation and settlement timelines are you held to?",
      "Do farmers currently have any way to check claim status without calling a society secretary?",
      "How do cooperative societies participate in servicing, and would they welcome an automated layer or resist it?",
    ],
    flowTemplate: "claims",
    scenario:
      "After hailstorm damage in Marathwada, IFFCO Tokio takes crop-claim intimations in Marathi from thousands of farmers in two days and tells each when the surveyor will arrive.",
  },

  "shriram-general-insurance": {
    operatingContext:
      "Shriram General Insurance is a motor-dominated general insurer whose book leans heavily on commercial-vehicle and used-vehicle segments adjacent to the wider Shriram ecosystem's long relationships with truck owners, small fleet operators and used-vehicle buyers. That customer profile is distinctive: the policyholder is often an owner-operator or a small fleet proprietor whose vehicle is the family's income-earning asset, so a claim is an urgent commercial problem, not merely an inconvenience. Commercial-vehicle claims involve repeated coordination among the driver at the scene, the owner who may be elsewhere, the garage doing the repair, and the surveyor assessing the loss — a multi-party choreography conducted almost entirely by phone. Customers transact in Hindi, Tamil, Telugu and English, and the insurer services them through a contact centre, branch network and surveyor and garage networks.",
    strategicPressure: [
      { text: "Shriram General Insurance's portfolio is motor-dominated with substantial commercial-vehicle and used-vehicle exposure connected to the wider Shriram customer ecosystem", kind: "verified" },
      { text: "Commercial-vehicle claims are inherently multi-party and phone-mediated, involving driver, owner, garage and surveyor with no shared status view", kind: "inference" },
      { text: "For an owner-operator whose vehicle is the income source, days of vehicle downtime are the real cost of a claim, making cycle time the metric that determines renewal", kind: "inference" },
      { text: "A focused, cost-conscious insurer will judge this on cost per claim serviced and on measurable cycle-time reduction, not on platform capability", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. A focused motor insurer with tight cost discipline has no internal engineering path to conversational AI and no reason to attempt one. Its technology estate is vendor-supplied claims and policy administration, and its investment goes into underwriting and claims-network management. It will buy capability with a demonstrable effect on claim cycle time.",
    whyNotBuild:
      "Coordinating a driver at a roadside, an owner in another city, a garage and a surveyor requires multilingual speech, reliable telephony to callers in poor-signal locations, orchestration across claims, surveyor and garage systems, and evaluation evidence for IRDAI. Four specialist builds for an insurer whose entire advantage is operating leanly.",
    workflows: [
      {
        name: "Commercial-vehicle claim intimation and multi-party coordination",
        friction: "The driver at the scene, the owner elsewhere and the garage each call separately, repeat the same details, and nobody has a shared view of what has been agreed",
        outcome: "One claim thread that recognises each party, captures details once, and keeps driver, owner and garage informed of surveyor timing and repair authorisation",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Surveyor allocation", "Garage and workshop network", "Policy and vehicle records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Repair and settlement status communication to owner-operators",
        friction: "The owner whose vehicle is off the road calls repeatedly to ask when it will be released, and gets different answers from the garage and the insurer",
        outcome: "A single authoritative status pushed proactively to the owner in his language, shortening perceived and actual downtime",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Claims management system", "Garage network", "Payment and settlement systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Commercial-vehicle renewal reminders and lapse prevention",
        friction: "Fleet and owner-operator policies renew on fixed dates, and an expired commercial-vehicle policy is both a legal and a livelihood exposure the owner often overlooks while on the road",
        outcome: "Timely vernacular renewal contact with payment in-channel, reducing lapse in a segment where lapse has severe consequences for the customer",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Policy administration system", "Payment gateway", "Vehicle and fleet records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A toll-free claim-intimation helpline and contact centre",
        "A branch network and agent channel serving vehicle owners and operators",
        "Surveyor and garage networks handling motor-claim assessment and repair",
        "A customer app and portal for policy documents and renewals",
      ],
      gaps: [
        "No shared claim thread across driver, owner, garage and surveyor",
        "No proactive repair or settlement status for the owner whose vehicle is off the road",
        "Renewal outreach depends on agent follow-up rather than a direct process",
        "Vernacular coverage is uneven across a Hindi-plus-southern-language customer base",
      ],
    },
    risks: [
      "IRDAI protection-of-policyholders regulations govern claim turnaround and coverage representations in automated conversations",
      "Motor third-party claims are litigation-linked and must be limited to factual status in any automated interaction, with liability discussion reserved for humans",
      "Decision independence from wider Shriram group relationships must be confirmed, and TRAI plus DPDP rules apply to all outbound contact",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions to validate — volume estimates motor-claim, status and renewal contact across a commercial and used-vehicle-weighted book, and cost per interaction reflects Indian helpline and claim-coordination handling.",
    },
    pilotScope:
      "A ten-week commercial-vehicle claim pilot in Hindi and Tamil covering intimation, surveyor coordination and proactive repair status for one regional cluster, measured on claim cycle time, vehicle downtime and status-call volume.",
    expansion: [
      "Extend to Telugu and additional regions across the commercial-vehicle book",
      "Add renewal outreach and lapse prevention for owner-operator and fleet policies",
      "Introduce garage-side servicing so workshops can self-serve on authorisation and payment status",
    ],
    stakeholders: [
      "Managing Director",
      "Chief Operating Officer",
      "Head of Claims",
      "Head of Information Technology",
      "Head of Retail and Commercial Vehicle Business",
    ],
    discovery: [
      "How many separate parties typically call you about a single commercial-vehicle claim?",
      "What is your average claim cycle time, and how much of it is coordination rather than assessment?",
      "What does a day of vehicle downtime cost your typical owner-operator customer, and do you measure it?",
      "Are technology decisions here independent of the wider Shriram group?",
    ],
    flowTemplate: "claims",
    scenario:
      "A Shriram General truck owner in Tamil Nadu learns in Tamil that the surveyor has cleared his claim and the garage is authorised to release the vehicle, without calling anyone.",
  },

  "go-digit-general": {
    operatingContext:
      "Go Digit General Insurance is a digital-native listed general insurer that built its own policy-issuance, underwriting and claims technology from the ground up, and its market position rests on that stack: simplified wordings, app-based claim submission with smartphone-captured evidence, and fast turnaround on straightforward motor claims. It writes a rapidly growing motor and health book distributed through digital channels, web aggregators, brokers and partnerships. But an app-first claims design underserves the specific moments where a customer cannot practically use an app — a driver at an accident scene at night, an elderly policyholder, a family at a hospital admission desk — and those are precisely the highest-emotion, highest-cost interactions. The company employs a substantial engineering organisation and has publicly positioned technology as its differentiator, which means the core platform is not a sales target.",
    strategicPressure: [
      { text: "Go Digit is a digital-native listed general insurer that built and operates its own core policy and claims technology stack", kind: "verified" },
      { text: "Its growth in motor and health continues to produce voice-heavy moments — accident-scene intimation, garage coordination, hospital admission — that an app-first design handles poorly", kind: "inference" },
      { text: "A company whose brand is built on technology will treat any external platform as a threat to its differentiation narrative, so only a bounded, API-complementary scope is viable", kind: "inference" },
      { text: "Its own engineering roadmap may already include voice agents, in which case this account is disqualified rather than contested", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified co-build, pursued narrowly. Go Digit is genuinely capable of building — it already built the harder parts of an insurance stack — so the standard packaged-platform pitch is wrong here and would damage credibility. The only defensible construct is a bounded capability that complements its APIs: voice-channel agents that feed structured data into its existing claims pipeline rather than replacing any part of it. If its roadmap already covers voice, walk away.",
    whyNotBuild:
      "The honest position is that Go Digit could build this, and the argument is about opportunity cost and specialisation rather than capability. Multilingual speech tuned to accident-scene audio, carrier telephony operations, and continuous conversation evaluation are specialist product lines that would divert its engineers from underwriting, pricing and claims automation where its differentiation actually lives. That is a real argument, but it is an argument about focus — not one that will win against an internal team that has already started.",
    workflows: [
      {
        name: "Accident-scene voice claim intimation feeding the digital claims pipeline",
        friction: "A driver at a roadside at night with a damaged phone or shaking hands cannot complete an app-based photo-and-form claim journey, so the fastest-growing claim channel fails at the worst moment",
        outcome: "Voice intimation that captures structured claim data in the customer's language and writes it directly into the existing claims pipeline, preserving the digital process with a human-speed front door",
        channels: ["Voice", "WhatsApp"],
        systems: ["In-house claims platform APIs", "Policy and vehicle records", "Garage network", "Evidence and document store"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Garage and workshop coordination on motor repairs",
        friction: "Workshops call for authorisation and payment status, and their queries are handled by humans because the app was built for customers, not for repair partners",
        outcome: "Partner-facing voice servicing that answers authorisation and payment questions from the claims system, removing a support load the digital design never addressed",
        channels: ["Voice", "WhatsApp"],
        systems: ["Claims platform APIs", "Garage and partner records", "Payment and settlement systems"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Voice fallback for customers who cannot complete a digital journey",
        friction: "Older policyholders, non-smartphone users and customers in poor-connectivity locations drop out of app journeys and end up in a call queue designed as an exception path",
        outcome: "A voice channel with the same grounding and actions as the app, so the digital-first design does not exclude a growing slice of a mass-market book",
        channels: ["Voice"],
        systems: ["Policy and claims platform APIs", "Payment gateway", "Customer records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An in-house-built policy issuance and claims platform with app-based claim submission",
        "Smartphone-based evidence capture for motor claims",
        "A digital self-service app and website covering purchase, renewal and claims",
        "A contact centre operating as an exception and escalation path rather than the primary channel",
      ],
      gaps: [
        "No voice-native claim intimation with the same structured capture as the app",
        "Repair-partner and garage queries are handled manually outside the digital design",
        "Customers who cannot complete an app journey fall back to a queue rather than an equivalent channel",
        "Regional-language voice coverage lags the geographic spread of its growing book",
      ],
    },
    risks: [
      "The primary qualification risk is that its internal engineering roadmap already includes voice agents — if so, this account should be dropped rather than contested",
      "Any proposal that implies replacing or wrapping its core platform will be rejected and will damage credibility with an engineering-led buyer",
      "IRDAI protection-of-policyholders regulations and DPDP obligations apply to all claim communication regardless of channel",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions requiring validation — volume estimates claim, servicing and partner contact across a fast-growing digital-first motor and health book, and cost per interaction reflects Indian contact-centre economics for what the company treats as an exception channel.",
    },
    pilotScope:
      "A bounded eight-week pilot on accident-scene voice claim intimation in Hindi and Kannada for one motor segment, writing structured claim data into the existing claims APIs with no change to the downstream digital process, measured on intimation completion rate versus the app journey at night.",
    expansion: [
      "Extend voice intimation to additional languages and to the health book",
      "Add garage and repair-partner voice servicing on authorisation and payment status",
      "Introduce a voice fallback path with app-equivalent grounding for customers who drop out of digital journeys",
    ],
    stakeholders: [
      "Chief Technology Officer",
      "Head of Claims",
      "Head of Product or Engineering",
      "Chief Operating Officer",
      "Head of Customer Experience",
    ],
    discovery: [
      "Does your engineering roadmap already include voice agents for claim intimation?",
      "What is your app-based claim-intimation completion rate at night and in poor-connectivity locations?",
      "How are garage and repair-partner queries handled today, and what do they cost?",
      "If we only ever wrote structured data into your existing claims APIs, would that be an architecture your team would accept?",
    ],
    flowTemplate: "claims",
    scenario:
      "A Go Digit motor customer stranded at a roadside at night speaks his claim in Kannada, and the structured intimation lands in the existing digital claims pipeline before he reaches home.",
  },

  "angel-one": {
    operatingContext:
      "Angel One is a digital-first retail broker with one of the largest client bases in India, having transitioned from a traditional sub-broker franchise model to an app-led flat-fee model and acquired clients heavily from tier-2 and tier-3 towns. That acquisition mix means a very large share of its clients are first-time investors — people opening their first demat account, encountering margin calls, KYC re-verification requirements and settlement mechanics for the first time, in Telugu, Tamil, Bengali, Marathi and Hindi rather than English. Its revenue model depends on activation and retention of those clients, so onboarding friction and unresolved service queries translate directly into dormancy. The company runs a substantial in-house engineering organisation, publicises its AI and data-science ambitions, and treats its app and trading infrastructure as core differentiation — which puts the platform firmly out of scope for any external vendor.",
    strategicPressure: [
      { text: "Angel One operates a digital-first flat-fee broking model with a very large retail client base skewed toward smaller cities", kind: "verified" },
      { text: "The company has publicly positioned technology and AI as central to its strategy and maintains significant in-house engineering capability", kind: "verified" },
      { text: "First-time investors from tier-2 and tier-3 towns generate onboarding, KYC and margin-mechanics queries in vernacular languages at a volume no support organisation can staff proportionally", kind: "inference" },
      { text: "Client activation and dormancy are the economics that matter in flat-fee broking, and unresolved early-stage queries are a leading cause of dormancy", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified co-build, and the framing must be honest. Angel One has real engineering strength and has said so publicly; proposing a packaged platform that fronts its app would be rejected immediately. The only credible opening is bounded vernacular voice servicing operating against its APIs at a language breadth and hour coverage its support organisation cannot staff — a capacity and language argument, not a capability argument.",
    whyNotBuild:
      "Angel One can build conversational interfaces and probably has. What it is less likely to build is production-grade speech recognition and synthesis across six or more Indian languages, tuned for financial vocabulary and code-switching, with the telephony operations and continuous evaluation that voice at scale requires. That is a specialist product line rather than an extension of app engineering. The argument is opportunity cost — its engineers on trading, data and product versus a speech-and-telephony programme — and it will only land if the internal team has not already claimed the territory.",
    workflows: [
      {
        name: "Vernacular onboarding and KYC re-verification support",
        friction: "A first-time investor from a smaller city stalls partway through account opening or a periodic KYC re-verification, and the English-first help path does not resolve it, so the account never activates",
        outcome: "Guided in-language completion of onboarding and re-verification steps with document issues explained specifically, converting stalled accounts into active ones",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Client onboarding and KYC systems", "CKYC and KRA interfaces", "Document verification", "Client master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Margin, settlement and fund-transfer query servicing",
        friction: "Margin shortfalls, settlement cycles and payout timing confuse new investors, and the questions cluster in bursts during volatile market sessions when support is already saturated",
        outcome: "Grounded, in-language answers about the client's own positions, margins and payouts drawn from the back-office systems, absorbing the volatility-driven query spike",
        channels: ["Voice", "Chat", "WhatsApp"],
        systems: ["Risk management and margin systems", "Back-office and settlement records", "Payment and payout systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Dormancy reactivation and account-maintenance outreach",
        friction: "Clients go dormant after an unresolved early problem, and reactivation campaigns are message-based with no ability to actually fix whatever blocked them",
        outcome: "Two-way reactivation conversations in the client's language that diagnose and resolve the original blocker, converting dormant accounts back to active",
        channels: ["Voice", "WhatsApp"],
        systems: ["Client master and activity records", "KYC status records", "CRM and campaign systems"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A sophisticated trading app and web platform with self-service account features",
        "In-app chat and ticket-based support with automated help content",
        "Digital account-opening journeys with electronic KYC",
        "A support contact centre operating primarily in English and Hindi",
      ],
      gaps: [
        "Vernacular voice support does not match the language mix of a tier-2 and tier-3 acquisition base",
        "Stalled onboarding and KYC re-verification cases are not resolved conversationally at scale",
        "Volatility-driven query spikes exceed support capacity precisely when clients most need answers",
        "Dormancy campaigns cannot resolve the underlying blocker that caused the dormancy",
      ],
    },
    risks: [
      "The dominant qualification risk is internal ownership — if Angel One's AI team has already claimed conversational support, this becomes a contested rather than an open opportunity",
      "SEBI rules prohibit unsolicited investment advice, so an automated agent must be strictly limited to account servicing and never stray into recommendations",
      "Client financial data and KYC records carry DPDP obligations and exchange audit expectations on access control and recording",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation — volume is an order-of-magnitude estimate of monthly support contacts across a very large retail broking client base, and cost per interaction reflects Indian digital-support economics for short, high-frequency queries.",
    },
    pilotScope:
      "A bounded eight-week pilot on vernacular onboarding and KYC re-verification support in Telugu and Bengali for clients whose applications stalled, operating against existing APIs with no change to the app journey, measured on activation rate versus the current English-first help path.",
    expansion: [
      "Extend to Tamil, Marathi and additional languages for onboarding and KYC support",
      "Add margin, settlement and fund-transfer query servicing for volatility-driven spikes",
      "Introduce dormancy reactivation conversations that resolve the original blocker",
    ],
    stakeholders: [
      "Chief Technology Officer",
      "Chief Operating Officer",
      "Head of Customer Experience or Client Servicing",
      "Head of Growth or Client Activation",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Has your internal AI team already scoped conversational support, and if so what is in flight?",
      "What proportion of account-opening applications stall before activation, and where exactly do they stop?",
      "Which languages does your support cover today, and how does that compare with your client acquisition mix?",
      "During a high-volatility session, what happens to your support response times and what does that cost in dormancy?",
    ],
    flowTemplate: "onboarding",
    scenario:
      "A first-time investor in Warangal stalls on Angel One KYC re-verification, gets a Telugu call explaining exactly which document failed, and completes the account the same evening.",
  },

  "motilal-oswal-financial": {
    operatingContext:
      "Motilal Oswal Financial Services is a full-service broker and wealth manager whose model is built on research, advisory and a distribution network of franchisees and sub-brokers reaching clients across hundreds of Indian cities. Unlike a discount broker whose clients live entirely in an app, its relationship-managed and franchisee-served clients transact and query by phone as a matter of course: trade confirmations, fund transfers, margin questions, corporate actions, statements and account modifications. That produces two distinct service populations — end clients, and the franchisee network itself, which needs its own support layer on brokerage, client onboarding and platform issues. The firm also distributes mutual funds and other products, adding transaction-status and payout queries to the mix. Servicing operates in Hindi, Gujarati, Marathi and English across a head-office desk and franchisee front lines.",
    strategicPressure: [
      { text: "Motilal Oswal operates a full-service broking and wealth model built on research, advisory and a franchisee and sub-broker distribution network", kind: "verified" },
      { text: "A relationship and franchisee-served client base transacts by phone far more than a discount-broker client base does, structurally raising servicing volume per client", kind: "inference" },
      { text: "The franchisee network is itself a support customer, creating a business-to-business-to-consumer servicing layer with its own cost and satisfaction dynamics", kind: "inference" },
      { text: "Competition from zero-brokerage platforms compresses the revenue that supports a high-touch servicing model, making cost per serviced interaction a live pressure", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Motilal Oswal's identity and investment sit in research, advisory and asset management; its technology function delivers trading platforms and back-office integration rather than building conversational infrastructure. Servicing tooling has historically been procured, and a multilingual voice capability integrated to its back office is exactly the kind of infrastructure it would rent with service levels.",
    whyNotBuild:
      "Servicing a franchisee network and its clients by voice requires speech across four or more languages with financial vocabulary, telephony with recording sufficient for exchange audit, orchestration into trading, back-office and depository systems, and evaluation that proves no automated response constituted investment advice under SEBI rules. Four specialist capabilities, none of which is where a research-led firm wants its engineers.",
    workflows: [
      {
        name: "Client account servicing: fund transfer, payout and statement queries",
        friction: "Clients call their franchisee or the head-office desk to ask where a payout is, why a fund transfer has not reflected, or to request a statement, and each answer requires an agent to check the back office",
        outcome: "Authenticated, grounded answers on funds, payouts and holdings delivered conversationally, freeing relationship managers for advisory conversations that generate revenue",
        channels: ["Voice", "WhatsApp"],
        systems: ["Back-office and settlement systems", "Depository interface", "Payment and payout systems", "Client master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Franchisee and sub-broker support desk",
        friction: "Franchisees call head office about brokerage computation, client onboarding status and platform issues, competing with end-client queries for the same desk capacity",
        outcome: "A dedicated partner-facing servicing layer that answers brokerage and onboarding questions from the systems of record, improving franchisee productivity and retention",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Franchisee and brokerage systems", "Client onboarding and KYC systems", "Back-office records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Corporate-action and mutual-fund transaction status servicing",
        friction: "Dividend, split, rights and mutual-fund transaction queries arrive in seasonal bursts, and clients call repeatedly because status is spread across registrar, depository and back-office sources",
        outcome: "A single grounded answer that reconciles the sources, absorbing predictable seasonal spikes without temporary staffing",
        channels: ["Voice", "WhatsApp"],
        systems: ["Corporate-action records", "Depository interface", "Mutual-fund transaction platform", "Back-office systems"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Trading applications and web platforms with self-service portfolio and statement access",
        "A head-office client-servicing desk and helpline",
        "A franchisee and sub-broker network providing local, relationship-based servicing",
        "Email and messaging-based servicing for statements and transaction confirmations",
      ],
      gaps: [
        "Clients cannot get an authenticated funds or payout answer without reaching a human",
        "Franchisees have no dedicated self-service support channel and compete with end clients for the same desk",
        "Corporate-action season spikes are handled by absorbing longer wait times",
        "Regional-language voice coverage does not match a distribution network spanning hundreds of cities",
      ],
    },
    risks: [
      "SEBI rules prohibit unsolicited investment advice, so an automated agent must be confined to account servicing with hard guardrails against recommendation-like language",
      "Exchange and SEBI record-keeping expectations apply to client communications, requiring complete recording, retention and retrievability",
      "DPDP obligations cover client financial and KYC data, and franchisee access boundaries must be enforced within the servicing layer",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.4,
      automationRate: 0.55,
      basis: "Seller assumptions to validate in discovery — volume estimates client and franchisee servicing contact across a full-service broking and distribution business, and cost per interaction reflects Indian relationship-desk economics which run above pure contact-centre rates.",
    },
    pilotScope:
      "A ten-week pilot on client account servicing — funds, payouts, holdings and statements — in Hindi, Gujarati and English for one regional cluster, with authenticated access to back-office data and clean escalation to the relationship manager for anything advisory.",
    expansion: [
      "Add a franchisee and sub-broker support desk covering brokerage and onboarding queries",
      "Extend to Marathi and additional languages across the national network",
      "Introduce corporate-action and mutual-fund transaction status servicing for seasonal spikes",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Broking Operations",
      "Chief Technology Officer",
      "Head of Franchisee and Channel Business",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How does servicing load split between head office and the franchisee front line today?",
      "What proportion of relationship-manager time goes to operational queries rather than advisory conversations?",
      "What do franchisees complain about most in their support experience, and does it affect attrition?",
      "How do you currently guarantee that a servicing conversation never crosses into investment advice?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Motilal Oswal client in Rajkot asks in Gujarati why his payout has not credited, and gets an authenticated answer from the back office without the franchisee having to call head office.",
  },

  "icici-securities": {
    operatingContext:
      "ICICI Securities operates one of India's largest full-service retail broking businesses through the ICICIdirect platform and is now delisted and wholly owned by ICICI Bank. Its client base was built largely through the bank's customer relationships over two decades, which gives it an affluent but ageing demographic that includes many investors who prefer to call rather than self-serve for anything non-routine: trade support, corporate actions, margin explanations, pledge and settlement mechanics, and account modifications. Alongside broking it distributes mutual funds, insurance and other products, adding transaction-status queries to the servicing mix. Its technology inherits bank-grade governance and control expectations, and servicing is delivered through a contact centre, digital channels and a relationship-manager layer for higher-value clients.",
    strategicPressure: [
      { text: "ICICI Securities is now delisted and operates as a wholly owned subsidiary of ICICI Bank, running the ICICIdirect retail broking franchise", kind: "verified" },
      { text: "Competition from zero and flat-brokerage platforms has compressed pricing across Indian retail broking, pressuring cost-to-serve at full-service firms", kind: "verified" },
      { text: "A long-tenured, affluent client base includes many investors who prefer assisted channels, so servicing volume per client stays high even as the industry digitises", kind: "inference" },
      { text: "Bank-grade technology governance means vetted partners and documented controls are preferred over internal experimentation for non-core servicing capability", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. As a bank-owned subsidiary, ICICI Securities inherits control frameworks that favour vetted, contracted partners with documented security and audit posture. It has meaningful platform engineering for ICICIdirect but conversational servicing across languages and channels is not where that capability is pointed. The realistic construct is a partner-delivered layer subject to group information-security review.",
    whyNotBuild:
      "Multilingual speech, recorded telephony meeting exchange and SEBI retention standards, orchestration into broking back office and depository systems, and evaluation that proves no automated response constituted advice are four distinct engineering programmes. A bank-owned broker will procure them from a vetted supplier because its control framework effectively requires demonstrable third-party accountability anyway.",
    workflows: [
      {
        name: "Corporate-action and margin-query servicing",
        friction: "Dividend, bonus, split, rights and buyback events generate predictable query surges, and margin and pledge mechanics confuse even long-tenured clients, all landing on the same contact centre",
        outcome: "Grounded, client-specific answers on corporate actions and margin positions drawn from the systems of record, absorbing seasonal surges without temporary capacity",
        channels: ["Voice", "Chat", "WhatsApp"],
        systems: ["Broking back office", "Depository and registrar interfaces", "Risk and margin systems", "Corporate-action records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Account servicing: modifications, nominee updates and statement requests",
        friction: "Routine account changes require forms, verification calls or branch involvement, and an ageing client base finds digital self-service paths hard to complete",
        outcome: "Authenticated servicing completed conversationally with a full audit trail, matching the assisted experience the client base expects at self-service cost",
        channels: ["Voice", "WhatsApp"],
        systems: ["Client master and KYC systems", "Depository interface", "Document generation and verification"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Mutual-fund and third-party product transaction-status servicing",
        friction: "Clients who bought funds or insurance through the platform chase transaction and payout status that sits with registrars and product manufacturers, and the broker's desk becomes an intermediary",
        outcome: "Reconciled status answers from the distribution platform and registrar feeds, removing an entire category of intermediated status calls",
        channels: ["Voice", "Chat"],
        systems: ["Mutual-fund transaction platform", "Registrar and transfer agent feeds", "Distribution and product records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "The ICICIdirect web and mobile platform with extensive self-service functionality",
        "A contact centre supporting trading, account and product queries",
        "Relationship-manager coverage for higher-value client segments",
        "Digital and messaging-based servicing for statements, confirmations and alerts",
      ],
      gaps: [
        "Corporate-action season surges are absorbed by longer wait times rather than elastic capacity",
        "Older clients who cannot complete digital journeys have only a human queue as an alternative",
        "Third-party product transaction status requires the broker's desk to act as an intermediary",
        "Regional-language voice servicing is limited relative to a national client base",
      ],
    },
    risks: [
      "SEBI rules on investment advice mean a servicing agent must never make or imply a recommendation, requiring hard conversational guardrails",
      "Exchange and SEBI record-keeping obligations require complete recording, retention and retrievability of client communications",
      "Group information-security and vendor-governance review from the bank parent will apply, and decision separation from group vendor policy post-delisting must be established early",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery validation — volume estimates monthly client servicing contact across a large full-service retail broking book, and cost per interaction reflects Indian contact-centre economics for financial-services support.",
    },
    pilotScope:
      "A ten-week pilot on corporate-action and margin queries in Hindi and English timed to a dividend and results season, with client-specific answers grounded in the back office and hard guardrails against any advisory content, measured on surge absorption and contact-centre volume displaced.",
    expansion: [
      "Extend to account servicing including modifications, nominee updates and statement requests",
      "Add Gujarati and Marathi coverage for the retail base outside metros",
      "Introduce mutual-fund and third-party product transaction-status servicing",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Client Servicing or Customer Experience",
      "Chief Technology Officer",
      "Chief Compliance Officer",
      "Chief Information Security Officer",
    ],
    discovery: [
      "How much does contact volume rise during a heavy corporate-action or results season, and how do you staff it?",
      "Post-delisting, does ICICI Bank group vendor policy govern your technology selection or do you decide independently?",
      "What share of your client base still prefers assisted channels for non-routine requests?",
      "What controls does compliance require to be confident an automated servicing agent cannot give advice?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An ICICIdirect client calls during dividend season to ask why a credit has not appeared; the agent reconciles the corporate-action record and answers without a queue.",
  },

  "hdfc-securities": {
    operatingContext:
      "HDFC Securities is a bank-owned full-service broker serving clients drawn largely from HDFC Bank's affluent customer base, with a servicing pattern built on call-and-trade desks, relationship support and digital platforms rather than pure app self-service. Call-and-trade is a defining part of its model: a client telephones a dealer, is verified, places an order verbally, and has it read back and confirmed — a workflow that is entirely conversational, entirely scriptable, and entirely recorded for regulatory purposes today. Beyond order placement, the desk handles fund transfers, margin queries, corporate actions, holdings and statement requests. Clients transact primarily in Hindi, Gujarati and English, and as a bank subsidiary the firm procures technology from approved vendors under group security and audit standards.",
    strategicPressure: [
      { text: "HDFC Securities operates a full-service broking model including a call-and-trade desk serving clients sourced largely from HDFC Bank relationships", kind: "verified" },
      { text: "Call-and-trade is by nature a recorded, verified, scripted conversational workflow — identity verification, order capture, read-back and confirmation", kind: "verified" },
      { text: "Industry-wide brokerage compression makes the cost of a dealer-staffed call-and-trade desk harder to justify per order, particularly for small-value trades", kind: "inference" },
      { text: "Any automation of order intake will need explicit SEBI and exchange compliance clearance, which must be established before scoping rather than after", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. As a bank subsidiary, HDFC Securities procures from approved vendors under group information-security and audit standards, and its own engineering is directed at trading platforms rather than speech or telephony infrastructure. A conversational capability with documented controls and recording is exactly the class of system it buys rather than builds.",
    whyNotBuild:
      "Order-intake conversations demand speech recognition accurate enough that a misheard quantity or scrip is not possible, telephony with recording that satisfies exchange audit, orchestration into the order-management system with strict authorisation, and evaluation that can evidence every confirmation. The accuracy and evidentiary bar here is higher than in ordinary servicing, and it is not a bar a broking subsidiary's engineering team is set up to clear.",
    workflows: [
      {
        name: "Call-and-trade order intake with verification and read-back",
        friction: "Dealer-staffed order intake is expensive per trade, capacity-constrained at market open and close, and inconsistent in how verification and read-back are performed across dealers",
        outcome: "Consistent verified order intake with mandatory read-back and confirmation, fully recorded, at a cost per order far below a staffed desk — subject to compliance clearance",
        channels: ["Voice"],
        systems: ["Order management system", "Client authentication and verification", "Risk and margin checks", "Call recording and archive"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Funds, holdings and margin query servicing",
        friction: "Clients call the same desk to check available funds, holdings and margin before placing an order, consuming dealer time on questions that require no judgement",
        outcome: "Authenticated, grounded answers on funds, holdings and margins that free dealer capacity for the trades that actually need a human",
        channels: ["Voice", "WhatsApp"],
        systems: ["Back-office and settlement systems", "Depository interface", "Risk and margin systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Corporate-action, statement and account-servicing requests",
        friction: "Seasonal corporate-action queries and routine statement and account-change requests spike unpredictably and land on the same team as trading support",
        outcome: "Routine servicing handled conversationally with audit trails, so trading support capacity is reserved for market-hours priorities",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Corporate-action records", "Client master and KYC", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Trading web and mobile platforms with self-service portfolio and order functionality",
        "A dealer-staffed call-and-trade desk with recorded lines and verification procedures",
        "A client-servicing contact centre for account and product queries",
        "Digital delivery of contract notes, statements and transaction confirmations",
      ],
      gaps: [
        "Order-intake capacity is constrained at market open and close when demand peaks",
        "Pre-trade information queries consume dealer time that should go to order handling",
        "Verification and read-back consistency depends on individual dealer discipline",
        "Regional-language coverage on the desk is limited relative to the client base",
      ],
    },
    risks: [
      "SEBI and exchange requirements on order recording, authorisation and audit apply fully to any automated order intake, and compliance clearance must precede any pilot scoping — this is the gating item",
      "An automated agent must never provide investment advice or respond in a way that could be construed as a recommendation",
      "Group information-security and vendor-governance standards from the bank parent will apply to any supplier handling client order data",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.5,
      automationRate: 0.5,
      basis: "Seller assumptions to validate — volume estimates call-and-trade plus servicing contact across a full-service bank-owned broking client base, and cost per interaction is set above the contact-centre norm because dealer-staffed order handling is a more expensive resource.",
    },
    pilotScope:
      "A ten-week pilot confined to pre-trade information servicing — funds, holdings, margins and statements — in Hindi and English, deliberately excluding order intake until compliance has cleared automated order capture in writing.",
    expansion: [
      "Subject to compliance clearance, extend to verified order intake with mandatory read-back and full recording",
      "Add corporate-action and account-servicing requests",
      "Extend to Gujarati and additional languages for the retail client base",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Broking Operations and Dealing Desk",
      "Chief Compliance Officer",
      "Chief Technology Officer",
      "Chief Information Security Officer",
    ],
    discovery: [
      "What is your compliance position on automated order intake under current SEBI and exchange requirements?",
      "What proportion of call-and-trade desk time goes to information queries rather than order placement?",
      "How does desk capacity behave at market open and close, and what do you turn away?",
      "What vendor-security standards does the HDFC group impose on a supplier handling client order data?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An HDFC Securities client calls before market open to check available margin and holdings, gets an authenticated answer instantly, and the dealer desk stays free for actual orders.",
  },

  "kotak-securities": {
    operatingContext:
      "Kotak Securities is a bank-owned broker that straddles two models simultaneously: discount-style digital plans aimed at active traders and a traditional relationship-broking business serving longer-tenured clients. That leaves it with two servicing populations with opposite needs — app-native traders who contact support only for edge cases like margin disputes, pledge mechanics and settlement anomalies, and legacy clients who phone for statements, corporate actions and account changes as a matter of habit. Corporate-action season is the predictable stress point: dividends, splits, rights issues and buybacks generate query surges that land on the same team handling everyday support. As a subsidiary of Kotak Mahindra Bank it operates under group information-security and vendor-governance standards, procuring technology from approved suppliers.",
    strategicPressure: [
      { text: "Kotak Securities operates both discount-style digital plans and traditional relationship broking, serving two very different client populations", kind: "verified" },
      { text: "Corporate-action events produce predictable, sharp query surges that a fixed support roster handles by extending wait times", kind: "inference" },
      { text: "Serving two service models with one support organisation creates a persistent staffing mismatch — edge-case complexity for traders, routine volume for legacy clients", kind: "inference" },
      { text: "Group vendor policy from the bank parent may constrain subsidiary procurement, which is the key qualification question on this account", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. The securities subsidiary procures servicing technology under group standards rather than building it; its engineering effort goes into trading platforms and digital plan products. A conversational servicing layer with documented controls, recording and audit evidence is squarely a procured capability.",
    whyNotBuild:
      "Handling a margin dispute or a rights-issue question conversationally requires speech with financial vocabulary, recorded telephony meeting exchange retention standards, orchestration across risk, back-office and registrar data, and evaluation that guarantees no advisory content. That is four specialist capabilities for a subsidiary whose differentiation is its trading products, not its support stack.",
    workflows: [
      {
        name: "Corporate-action season query surge handling",
        friction: "Dividend, split, rights and buyback events generate a sharp spike in identical questions, and the support team absorbs it by making everyone wait longer",
        outcome: "Elastic, client-specific answers on entitlements, credits and timelines drawn from registrar and depository data, flattening the seasonal spike entirely",
        channels: ["Voice", "Chat", "WhatsApp"],
        systems: ["Corporate-action records", "Depository interface", "Registrar feeds", "Back-office systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Margin, pledge and settlement edge-case servicing for active traders",
        friction: "Active traders contact support only when something is genuinely wrong — a margin shortfall, a pledge that has not reflected, a settlement anomaly — and those cases need data from three systems",
        outcome: "Grounded diagnosis across risk, depository and settlement records with clear escalation for genuine exceptions, resolving in one contact rather than three",
        channels: ["Voice", "Chat"],
        systems: ["Risk and margin systems", "Depository and pledge records", "Settlement and back-office systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Legacy-client account servicing and statement requests",
        friction: "Longer-tenured clients phone for statements, holdings, nominee changes and contact updates that the digital platform already supports but that they will not use",
        outcome: "Assisted-feeling servicing delivered conversationally at self-service cost, without forcing a client population onto an app it will not adopt",
        channels: ["Voice", "WhatsApp"],
        systems: ["Client master and KYC", "Back-office systems", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Trading web and mobile platforms with self-service functionality across digital plans",
        "A contact centre supporting trading, account and product queries",
        "Relationship-manager coverage for traditional broking clients",
        "Digital delivery of contract notes, statements and corporate-action notifications",
      ],
      gaps: [
        "Corporate-action surges are managed by longer wait times rather than elastic capacity",
        "Edge-case trader queries require an agent to reconcile three systems manually",
        "Legacy clients have no assisted channel that costs less than a human agent",
        "Regional-language voice coverage is limited relative to the client base outside metros",
      ],
    },
    risks: [
      "SEBI rules on investment advice require hard guardrails so no servicing response resembles a recommendation",
      "Exchange and SEBI record-keeping obligations require full recording, retention and retrievability of client interactions",
      "Kotak group vendor and information-security policy may govern subsidiary procurement, which must be established before investing in the pursuit",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation — volume estimates monthly servicing contact across both digital-plan and relationship-broking client populations, and cost per interaction reflects Indian financial-services contact-centre economics.",
    },
    pilotScope:
      "A ten-week pilot timed to one corporate-action season in Hindi and English, answering entitlement, credit and timeline queries with client-specific data from registrar and depository sources, measured on surge absorption and contact-centre volume displaced.",
    expansion: [
      "Add margin, pledge and settlement edge-case diagnosis for active traders",
      "Extend to legacy-client account servicing and statement requests",
      "Add Marathi and Gujarati coverage for the retail base outside metros",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Client Servicing",
      "Chief Technology Officer",
      "Chief Compliance Officer",
      "Chief Information Security Officer",
    ],
    discovery: [
      "Does Kotak group vendor policy govern your technology procurement, or do you select independently?",
      "How much does contact volume rise during a heavy corporate-action season, and what is the wait-time impact?",
      "How many systems does an agent typically touch to resolve a margin or pledge query?",
      "How do your two client populations differ in contact rate and cost to serve?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Kotak Securities client asks during rights-issue season why his entitlement has not shown, and gets a registrar-grounded answer instead of waiting in a seasonal queue.",
  },

  "sharekhan-mirae": {
    operatingContext:
      "Sharekhan is a legacy full-service Indian broker acquired by Korea's Mirae Asset, currently working through post-acquisition integration. Its franchise is built on a long-standing branch and franchisee network and a client base that skews older and phone-first — investors who have used the same broker for years and value the relationship and the local office. That is exactly the population that churns quietly to discount platforms when service degrades, and integration periods are when service most often degrades: systems change, staff turn over, and communication becomes inconsistent. Retention communication during this window therefore protects deal value directly. Servicing runs through branches, franchisees, a contact centre and digital platforms, in Hindi, Marathi, Bengali and English.",
    strategicPressure: [
      { text: "Sharekhan was acquired by Mirae Asset and is working through post-acquisition ownership and integration changes", kind: "verified" },
      { text: "Broking clients churn silently rather than complaining, so an integration period with inconsistent service produces attrition that is only visible in lagging activity data", kind: "inference" },
      { text: "Its franchisee network and older client base are phone-first by habit, meaning retention communication has to be voice to work at all", kind: "inference" },
      { text: "Korean-parent integration playbooks typically standardise on procured platforms, and local build capacity at the acquired entity is minimal", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. An acquired entity mid-integration does not launch platform builds; it adopts what the acquirer standardises on or procures narrowly against an urgent operating need. Sharekhan's own technology capacity is directed at platform migration and continuity, not at new engineering programmes. Retention communication is a bounded, urgent need best served by a procured capability.",
    whyNotBuild:
      "Reaching a phone-first client base in four languages with retention conversations requires speech, telephony with compliant recording, orchestration into broking back office and activity data, and evaluation guarding against advisory content. Building any of it during an integration would compete for exactly the engineering attention that platform migration is consuming — and the retention window closes long before a build would ship.",
    workflows: [
      {
        name: "Client-retention outreach during the ownership transition",
        friction: "Clients whose activity has dropped are identified in monthly reports, and by the time anyone calls they have already moved their trading elsewhere",
        outcome: "Timely, in-language outreach to clients showing early disengagement signals, capturing the actual reason and routing genuine issues to a human, before the account goes dormant",
        channels: ["Voice", "WhatsApp"],
        systems: ["Client activity and trading records", "CRM and campaign systems", "Back-office and holdings data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Migration and continuity communication for platform or process changes",
        friction: "Integration-driven changes to platforms, logins or processes generate confusion that clients resolve by calling branches, which are themselves adjusting to the same changes",
        outcome: "Proactive, consistent explanation of what is changing and what the client must do, in their language, suppressing the confusion-driven contact spike",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Client master", "Platform migration records", "CRM and campaign systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Routine account servicing: statements, holdings and fund queries",
        friction: "Older clients call the branch for statements, holdings and payout status, and branch capacity is stretched by integration work",
        outcome: "Authenticated routine servicing completed conversationally, protecting branch capacity for the retention conversations that need a person",
        channels: ["Voice", "WhatsApp"],
        systems: ["Back-office and settlement systems", "Depository interface", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Trading web and mobile platforms with self-service portfolio access",
        "A branch and franchisee network providing local, relationship-based servicing",
        "A contact centre for trading and account queries",
        "Digital delivery of contract notes, statements and transaction confirmations",
      ],
      gaps: [
        "Disengagement is detected in lagging reports rather than acted on in time",
        "No proactive communication about integration-driven platform and process changes",
        "Branch capacity for routine servicing is stretched during integration",
        "Regional-language voice coverage does not match a national legacy client base",
      ],
    },
    risks: [
      "Integration-phase vendor freezes are common after an acquisition, and a freeze would block procurement regardless of business case — establish this first",
      "SEBI rules on investment advice and exchange record-keeping obligations apply fully to any automated client contact",
      "TRAI preference-registry rules govern outbound retention calling, and DPDP consent applies to client contact data through the ownership change",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions to validate — volume estimates servicing plus retention contact across a legacy full-service broking client base, and cost per interaction reflects branch and contact-centre handling economics in India.",
    },
    pilotScope:
      "A ten-week retention pilot on clients showing early activity decline in Hindi, Marathi and English: outreach that captures the actual reason for disengagement and routes genuine service issues to a human, measured on reactivation and attrition against a matched control.",
    expansion: [
      "Add proactive migration and continuity communication for platform and process changes",
      "Extend to Bengali and additional languages across the branch network",
      "Introduce routine account servicing to relieve branch capacity",
    ],
    stakeholders: [
      "Chief Executive Officer or Country Head",
      "Chief Operating Officer",
      "Head of Client Retention or Business",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Is there a vendor freeze in place during the integration, and when does it lift?",
      "Who owns client-retention KPIs today, and what signals trigger an intervention?",
      "How much attrition have you seen since the ownership change, and in which client cohorts?",
      "What integration-driven changes are still ahead that clients will need explained?",
    ],
    flowTemplate: "retention",
    scenario:
      "A long-standing Sharekhan client in Pune who stopped trading after a platform change gets a Marathi call, has the change explained, and places a trade the same week.",
  },

  "iifl-securities": {
    operatingContext:
      "IIFL Capital Services, the broking and distribution arm formerly known as IIFL Securities, serves retail and high-net-worth clients through branches, a sub-broker and franchise network, and digital platforms, alongside institutional broking and investment banking activity. The retail servicing surface therefore has two faces: end clients needing trade support, mutual-fund transaction status and account modifications, and the franchise network needing its own support on brokerage computation, client onboarding status and platform issues. That partner layer multiplies the support burden well beyond the firm's own staff count. Clients transact in Hindi, Marathi, Gujarati and English across a geographically dispersed network, and group engineering attention sits primarily with lending analytics and platform businesses elsewhere in the IIFL family.",
    strategicPressure: [
      { text: "IIFL Capital Services operates retail and HNI broking plus distribution through branches and a sub-broker network alongside institutional businesses", kind: "verified" },
      { text: "A franchise and sub-broker network creates a business-to-business support layer that scales the servicing surface beyond the firm's own headcount", kind: "inference" },
      { text: "Brokerage compression across Indian retail broking pressures the economics of a branch and franchise-served model, making cost to serve a live concern", kind: "inference" },
      { text: "Group engineering focus sits with lending and platform analytics rather than broking servicing infrastructure, leaving this capability to be procured", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. The broking arm's technology investment goes into trading platforms and distribution tooling; conversational servicing across languages and channels is not a capability it has built or signalled intent to build. The group's engineering attention is elsewhere, which makes procurement the default route for a servicing layer.",
    whyNotBuild:
      "Supporting a sub-broker network and its clients by voice means speech across four languages, recorded telephony meeting exchange standards, orchestration into broking back office, mutual-fund transaction platforms and franchise brokerage systems, and evaluation guarding against advisory content. Four specialist products for a business whose engineering priority is trading and distribution platforms.",
    workflows: [
      {
        name: "Sub-broker and franchise support desk",
        friction: "Franchise partners call head office about brokerage computation, client onboarding status and platform issues, and their queries compete with end-client servicing for the same team",
        outcome: "A dedicated partner-facing servicing layer answering brokerage and onboarding questions from the systems of record, improving partner productivity and reducing partner attrition",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Franchise and brokerage systems", "Client onboarding and KYC systems", "Back-office records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Client trade-support and account servicing",
        friction: "End clients call branches or the head-office desk for holdings, funds, payout status and account modifications, each answer requiring an agent to check the back office",
        outcome: "Authenticated, grounded servicing delivered conversationally, freeing branch and desk staff for relationship and advisory work",
        channels: ["Voice", "WhatsApp"],
        systems: ["Back-office and settlement systems", "Depository interface", "Client master and KYC"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Mutual-fund and distribution transaction-status servicing",
        friction: "Clients who transacted in funds through the distribution platform chase status that sits with registrars, and the desk acts as a manual intermediary",
        outcome: "Reconciled transaction and payout status delivered directly to the client, removing an entire class of intermediated status calls",
        channels: ["Voice", "WhatsApp"],
        systems: ["Mutual-fund transaction platform", "Registrar and transfer agent feeds", "Distribution records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Trading web and mobile platforms with self-service portfolio and order functionality",
        "A branch and sub-broker network delivering local client servicing",
        "A head-office client-servicing desk and helpline",
        "Digital delivery of contract notes, statements and transaction confirmations",
      ],
      gaps: [
        "Franchise partners have no dedicated support channel and compete with end clients",
        "Clients cannot get authenticated funds, holdings or payout answers without a human",
        "Mutual-fund transaction status requires manual intermediation by the desk",
        "Regional-language voice coverage does not match a dispersed branch and franchise footprint",
      ],
    },
    risks: [
      "SEBI rules on investment advice require strict guardrails so servicing never resembles a recommendation",
      "Exchange and SEBI record-keeping obligations require complete recording and retention of client and partner communications",
      "Whether the group would bundle this with an IIFL Finance conversation or keep it separate affects deal shape and must be established early",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions requiring discovery — volume estimates client and franchise servicing contact across a branch-and-partner broking model, and cost per interaction reflects Indian financial-services desk economics.",
    },
    pilotScope:
      "A ten-week pilot on the sub-broker support desk in Hindi and English covering brokerage computation, client onboarding status and platform queries, measured on partner query resolution time and head-office desk volume displaced.",
    expansion: [
      "Extend to end-client trade support and account servicing",
      "Add Marathi and Gujarati coverage across the branch network",
      "Introduce mutual-fund and distribution transaction-status servicing",
    ],
    stakeholders: [
      "Chief Executive Officer of the broking business",
      "Chief Operating Officer",
      "Head of Franchise and Partner Network",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How many support contacts come from franchise partners versus end clients each month?",
      "What do partners most often call about, and does support quality affect partner attrition?",
      "Would the group want to bundle a servicing capability across IIFL entities or keep this to the broking business?",
      "How much desk time goes to intermediating mutual-fund transaction status?",
    ],
    flowTemplate: "dealer-support",
    scenario:
      "An IIFL sub-broker in Nashik asks in Marathi why a client onboarding is pending and what his brokerage accrual is, and gets both answered from the systems of record.",
  },

  "geojit-financial": {
    operatingContext:
      "Geojit Financial Services is a Kochi-headquartered broker and financial-services firm with a distinctive franchise built on Kerala's investor base and its Gulf diaspora, including joint ventures and arrangements serving Malayali investors across the GCC. That gives it a client population split between resident investors in Kerala and non-resident investors in the Gulf who need portfolio, KYC, remittance-linked investment and account-servicing support in Malayalam across time zones that Indian office hours simply do not cover. The firm has BNP Paribas lineage in its shareholding history and operates a branch network across southern India alongside digital platforms. Servicing runs through branches, a contact centre and relationship staff, with Malayalam, English, Hindi and Tamil all in daily use.",
    strategicPressure: [
      { text: "Geojit is headquartered in Kochi with a client franchise centred on Kerala and extending to Malayali investors in the Gulf through GCC arrangements", kind: "verified" },
      { text: "Non-resident client servicing requirements structurally exceed Indian office hours, because the client is working during Indian business hours and free when Indian offices are shut", kind: "inference" },
      { text: "NRI investment servicing involves additional KYC, remittance-route and repatriation complexity that generates more contact per client than a resident equivalent", kind: "inference" },
      { text: "Malayalam-language servicing across extended hours would be a real differentiator in a segment several firms court but few service properly", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Geojit is a mid-sized firm whose technology function delivers trading platforms and integrations rather than building speech or conversational infrastructure. Its investment goes into distribution and advisory capability. A Malayalam-capable conversational servicing layer is a procured capability with defined service levels.",
    whyNotBuild:
      "Production-quality Malayalam speech recognition and synthesis is a specialist capability that a mid-sized regional broker has no path to building. Add cross-border telephony compliance for Gulf numbers, orchestration into broking back office and KYC systems, and evaluation guarding against advisory content, and the build case never opens.",
    workflows: [
      {
        name: "Gulf-NRI portfolio and account servicing in Malayalam at extended hours",
        friction: "A non-resident client in the Gulf can only call during his evening, which is after Indian offices close, so every query takes a day-long round trip by email",
        outcome: "Malayalam servicing on portfolio, holdings, funds and account status available at Gulf-convenient hours, removing the structural time-zone penalty",
        channels: ["Voice", "WhatsApp"],
        systems: ["Back-office and settlement systems", "Depository interface", "Client master", "Portfolio records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "NRI KYC, documentation and remittance-route guidance",
        friction: "Non-resident account opening and periodic KYC refresh involve documentation, attestation and remittance-route requirements that clients get wrong repeatedly and discover only when a transaction fails",
        outcome: "Guided, in-language explanation of exactly what is required with document status tracked, cutting failed transactions and repeated submissions",
        channels: ["Voice", "WhatsApp"],
        systems: ["KYC and CKYC systems", "Document management", "Bank and remittance-route records", "Client onboarding"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Resident-client servicing across the southern branch network",
        friction: "Branch staff spend their time on statements, holdings and payout queries that require no judgement, reducing capacity for advisory conversations",
        outcome: "Routine servicing handled conversationally in Malayalam, Tamil and English, protecting branch capacity for revenue-generating work",
        channels: ["Voice", "WhatsApp"],
        systems: ["Back-office systems", "Depository interface", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Trading web and mobile platforms with portfolio and transaction self-service",
        "A southern-India branch network with relationship staff serving resident clients",
        "Arrangements and joint ventures serving Malayali investors in GCC markets",
        "A contact centre operating primarily in Indian business hours",
      ],
      gaps: [
        "No Malayalam servicing at Gulf-convenient hours",
        "NRI KYC and remittance-route requirements are explained reactively after something fails",
        "Branch capacity is consumed by routine queries the platform already supports",
        "No consistent servicing channel for non-resident clients between office hours",
      ],
    },
    risks: [
      "GCC regulatory constraints on cross-border financial servicing and marketing must be checked before any outbound contact to Gulf-resident clients",
      "SEBI rules on investment advice apply fully, and NRI-specific investment restrictions add a second layer of care in what an agent may state",
      "Cross-border processing of client data engages DPDP alongside destination-country data rules",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.4,
      automationRate: 0.55,
      basis: "Seller assumptions to validate — volume estimates resident and non-resident client servicing contact for a regional broker of this scale, and cost per interaction is set above the domestic norm to reflect extended-hours and cross-border servicing complexity.",
    },
    pilotScope:
      "A ten-week Malayalam-language pilot for the Gulf-NRI client cohort covering portfolio, holdings, funds and account-status queries at extended hours, with strict guardrails against advisory content and clean escalation to relationship staff.",
    expansion: [
      "Add NRI KYC, documentation and remittance-route guidance with document tracking",
      "Extend to resident-client servicing across the southern branch network in Tamil and English",
      "Introduce proactive outreach for KYC refresh and documentation expiry",
    ],
    stakeholders: [
      "Managing Director",
      "Chief Operating Officer",
      "Head of NRI Business",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What share of your client base and assets sits with Gulf-based non-resident investors?",
      "How are queries arriving outside Indian hours handled today, and what is the typical turnaround?",
      "How often do NRI transactions fail on documentation or remittance-route errors?",
      "What GCC regulatory constraints apply to your servicing and outbound contact with Gulf-resident clients?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Geojit client in Doha calls at 9pm Gulf time in Malayalam, checks his portfolio and resolves a pending KYC document, without waiting for the Kochi office to open.",
  },

  "nuvama-wealth": {
    operatingContext:
      "Nuvama Wealth Management, formerly the Edelweiss wealth business and now PAG-controlled and separately listed, spans ultra-high-net-worth advisory at one end and a mass-affluent wealth and broking arm at the other. The two ends have completely different service economics: UHNI clients are served by dedicated relationship teams where the human relationship is the product, while the mass-affluent business carries the volume load of statements, corporate actions, fund transfers, transaction status and account modifications. Private-equity ownership brings margin discipline that favours automating the volume tier while protecting advisor capacity for the tier that pays for it. Servicing operates through relationship managers, a central desk and digital platforms, primarily in Hindi, Gujarati and English.",
    strategicPressure: [
      { text: "Nuvama was carved out of the Edelweiss wealth business, is PAG-controlled and separately listed, spanning UHNI advisory and mass-affluent wealth", kind: "verified" },
      { text: "Private-equity ownership brings explicit margin discipline that favours automating routine servicing while preserving advisor capacity for high-value relationships", kind: "inference" },
      { text: "The mass-affluent tier carries the volume servicing load, so cost per interaction there directly affects the economics of the segment", kind: "inference" },
      { text: "Its own build energy goes into advisory and portfolio tooling where differentiation lies, not into communications infrastructure", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Nuvama's technology investment goes into advisory platforms, portfolio analytics and client-reporting tools where its differentiation with wealthy clients lives. Conversational servicing for the mass-affluent tier is infrastructure it would procure, particularly under private-equity ownership where capital allocation is scrutinised against return.",
    whyNotBuild:
      "Servicing the volume tier by voice needs speech with financial vocabulary, recorded telephony meeting exchange retention standards, orchestration into broking back office, custody and mutual-fund platforms, and evaluation guarding against advisory content — which is especially sensitive in a wealth business where advice is the paid product. Four specialist builds, none of them what a wealth manager's engineers should be doing.",
    workflows: [
      {
        name: "Mass-affluent statement, holdings and corporate-action servicing",
        friction: "Volume-tier clients call their relationship manager for statements, holdings and corporate-action questions, consuming advisor time that should be spent on portfolio conversations",
        outcome: "Authenticated, grounded servicing delivered conversationally, reclaiming advisor capacity for the conversations that generate revenue",
        channels: ["Voice", "WhatsApp"],
        systems: ["Back-office and custody systems", "Depository interface", "Corporate-action records", "Client reporting"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Fund transfer, payout and transaction-status queries",
        friction: "Clients chase transfers, payouts and fund transaction status across broking, custody and registrar sources, and the desk reconciles manually every time",
        outcome: "A single reconciled status answer delivered on demand, removing a persistent category of low-value contact",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Payment and payout systems", "Mutual-fund transaction platform", "Registrar feeds", "Back-office systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Onboarding and documentation completion for new mass-affluent clients",
        friction: "New client onboarding stalls on KYC, documentation and mandate steps, and follow-up depends on whether the relationship manager has capacity that week",
        outcome: "Systematic in-language onboarding follow-up with document status tracked, shortening time to first investment and reducing abandoned onboardings",
        channels: ["Voice", "WhatsApp"],
        systems: ["Client onboarding and KYC systems", "CKYC and KRA interfaces", "Document management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Client-facing wealth and trading platforms with portfolio and statement access",
        "Relationship-manager coverage across UHNI and mass-affluent tiers",
        "A central client-servicing desk supporting operational queries",
        "Digital delivery of contract notes, portfolio reports and transaction confirmations",
      ],
      gaps: [
        "Relationship managers absorb routine operational queries that do not need them",
        "Transaction and payout status requires manual reconciliation across systems",
        "Onboarding follow-up depends on individual advisor capacity",
        "No servicing channel that scales the mass-affluent tier independently of advisor headcount",
      ],
    },
    risks: [
      "SEBI rules on investment advice are especially sensitive in a wealth business where advice is the paid service — automated servicing must be unambiguously operational",
      "Exchange and SEBI record-keeping obligations require complete recording and retention of client communications",
      "UHNI clients must be explicitly excluded from any automated servicing, as the human relationship is the product they are paying for",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 1.6,
      automationRate: 0.5,
      basis: "Seller assumptions requiring discovery — volume estimates mass-affluent servicing contact excluding the UHNI tier, and cost per interaction is set high because relationship-manager time is the resource actually being consumed today.",
    },
    pilotScope:
      "A ten-week pilot on mass-affluent statement, holdings and corporate-action servicing in Hindi and English, with UHNI clients explicitly excluded and every advisory-adjacent question routed to the relationship manager, measured on advisor hours reclaimed.",
    expansion: [
      "Add fund transfer, payout and mutual-fund transaction-status reconciliation",
      "Introduce onboarding and documentation follow-up for new mass-affluent clients",
      "Extend to Gujarati and additional languages across the client base",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Wealth Management Operations",
      "Chief Technology Officer",
      "Head of Client Experience",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How does servicing volume and cost split between the UHNI and mass-affluent tiers?",
      "How much relationship-manager time goes to operational queries rather than portfolio conversations?",
      "Where exactly would you draw the line between clients who must always reach a human and those who need not?",
      "What return threshold does PAG apply to an operating-efficiency investment like this?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Nuvama mass-affluent client asks for a consolidated holdings statement and a corporate-action explanation, gets both instantly, and his relationship manager never sees the request.",
  },

  "anand-rathi-wealth": {
    operatingContext:
      "Anand Rathi Wealth is a listed wealth manager focused deliberately on the affluent rather than the ultra-high-net-worth segment, with a business model weighted toward structured products alongside mutual funds and other investments. Structured products create a distinctive, recurring communication rhythm: each instrument has a defined maturity, a payout event, a coupon or observation schedule, and a reinvestment decision — all of which require the client to be informed and often to act. That is a predictable, high-volume, schedule-driven communication workload that today falls on relationship managers whose client counts keep rising as the firm grows. The servicing model is relationship-manager-led with central operations support, in Hindi, Gujarati, Marathi and English, and the firm has no technology-build identity of its own.",
    strategicPressure: [
      { text: "Anand Rathi Wealth is a listed wealth manager focused on the affluent segment with a business mix weighted toward structured products", kind: "verified" },
      { text: "Structured products generate schedule-driven client communication at maturity, payout and reinvestment points that scales directly with the number of instruments outstanding", kind: "inference" },
      { text: "Relationship-manager capacity is the growth constraint in an RM-led model, and every hour spent on schedule-driven confirmations is an hour not spent acquiring or advising", kind: "inference" },
      { text: "Automation here extends RM capacity rather than replacing the relationship, which is the framing this firm will accept and any other framing will fail", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Anand Rathi Wealth has no technology-build identity; its investment goes into advisor recruitment, product structuring and distribution. A communication capability that extends RM capacity is exactly the kind of operational tooling it would procure, and the business case is straightforward: clients per RM.",
    whyNotBuild:
      "Maturity and payout communication needs speech, telephony, orchestration into product and custody records to state accurate amounts and dates, and evaluation guarding hard against anything resembling investment advice — a particularly acute risk in a structured-products business. Four builds for a firm whose entire competitive model is advisor productivity.",
    workflows: [
      {
        name: "Structured-product maturity and payout-confirmation outreach",
        friction: "Each maturity and payout event requires the RM to call the client to confirm the amount, the credit and the reinvestment discussion, and the volume of these events grows with every product sold",
        outcome: "Accurate, scheduled confirmation of maturity and payout events delivered automatically in the client's language, with the reinvestment conversation booked into the RM's calendar",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Product and instrument records", "Custody and holdings systems", "Payout and settlement records", "RM calendar and CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Portfolio statement, valuation and transaction-status servicing",
        friction: "Clients call their RM for statements, valuations and transaction status, and these operational requests crowd out advisory conversations as client counts per RM rise",
        outcome: "Authenticated operational servicing handled conversationally, so the RM relationship is spent on advice rather than administration",
        channels: ["Voice", "WhatsApp"],
        systems: ["Portfolio and custody systems", "Mutual-fund transaction platform", "Client reporting"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Documentation, KYC refresh and mandate-renewal follow-up",
        friction: "KYC refreshes, nomination updates and mandate renewals are chased by RMs manually and slip until a transaction fails",
        outcome: "Systematic follow-up with document status tracked, preventing failed transactions and removing an administrative task from advisors entirely",
        channels: ["Voice", "WhatsApp"],
        systems: ["KYC and CKYC systems", "Mandate registry", "Document management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Relationship-manager-led client servicing as the primary channel",
        "A client portal and reporting platform for portfolio and statement access",
        "Central operations support for transactions and documentation",
        "Email and messaging-based delivery of statements and transaction confirmations",
      ],
      gaps: [
        "Maturity and payout confirmations depend on RM availability rather than a schedule",
        "Operational queries consume advisory time as client counts per RM rise",
        "KYC and mandate follow-up is manual and slips until something fails",
        "No servicing channel that scales independently of advisor headcount",
      ],
    },
    risks: [
      "SEBI rules on investment advice are acute in a structured-products business — automated communication must be strictly factual about amounts and dates and never suggest a reinvestment choice",
      "Product-specific disclosure obligations mean any statement about payouts or performance must be grounded in the instrument record and auditable",
      "Client confidentiality and DPDP obligations apply, and affluent clients are particularly sensitive to how their information is handled",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 1.8,
      automationRate: 0.45,
      basis: "Seller assumptions requiring discovery — volume estimates scheduled and operational client contact for an affluent-segment wealth manager, and cost per interaction is set high because relationship-manager time, not contact-centre time, is what is being consumed.",
    },
    pilotScope:
      "A ten-week pilot on structured-product maturity and payout confirmations in Hindi and Gujarati for one RM cluster, with amounts and dates grounded in instrument records and the reinvestment conversation booked into the advisor's calendar rather than attempted by the agent.",
    expansion: [
      "Add portfolio statement, valuation and transaction-status servicing across the client base",
      "Introduce KYC refresh, nomination and mandate-renewal follow-up",
      "Extend to Marathi and additional languages as the advisor network grows",
    ],
    stakeholders: [
      "Managing Director",
      "Chief Operating Officer",
      "Head of Client Servicing and Operations",
      "Head of Products",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Is relationship-manager capacity the acknowledged constraint on your growth, and how do you measure clients per RM?",
      "How many maturity and payout events do you communicate each month, and who does it?",
      "What proportion of an RM's week is operational administration rather than client advisory?",
      "Where exactly must a human be involved in a reinvestment conversation for compliance reasons?",
    ],
    flowTemplate: "retention",
    scenario:
      "An Anand Rathi Wealth client in Surat is told in Gujarati that his structured product matured and the payout has credited, with the reinvestment meeting already in his advisor's calendar.",
  },

  "prudent-corporate": {
    operatingContext:
      "Prudent Corporate Advisory Services is an Ahmedabad-based listed mutual-fund distribution platform whose business is aggregating and enabling a very large network of independent mutual-fund distributors and financial advisors across India. Its real servicing customer is therefore the distributor, not the end investor: partners need transaction-status answers, brokerage computation and payout clarity, platform and login support, and help with client onboarding and mandate issues. Distributor productivity is the entire business case of the platform — a distributor who cannot get an answer transacts less and eventually moves to a competing platform — so support quality is directly revenue-linked rather than a cost centre. Distributors operate in Hindi, Gujarati, Marathi and English from small towns as much as metros, and the platform's own engineering is focused on transaction processing and distributor tooling.",
    strategicPressure: [
      { text: "Prudent Corporate operates a mutual-fund distribution platform aggregating a large network of independent distributors across India", kind: "verified" },
      { text: "Distributor productivity and retention are the platform's core business drivers, making distributor support directly revenue-linked rather than a back-office cost", kind: "inference" },
      { text: "Distributor query volume scales with both network size and market activity, and spikes during volatile markets and at financial year end", kind: "inference" },
      { text: "Support responsiveness likely correlates with distributor attrition, which would make a support improvement measurable in retained distribution rather than just saved cost", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Prudent's platform engineering is directed at transaction processing, distributor tooling and reporting — the product itself. Support automation is adjacent infrastructure it would procure, particularly because the value case is distributor retention rather than platform differentiation.",
    whyNotBuild:
      "Supporting thousands of distributors by voice needs speech across four languages including business vocabulary, telephony at scale, orchestration into transaction, brokerage and onboarding systems, and evaluation to keep responses factual and consistent. Four specialist capabilities for a company whose engineers should be improving the transaction platform its distributors actually pay to use.",
    workflows: [
      {
        name: "Distributor transaction-status and brokerage-query support",
        friction: "Distributors call or email the support desk to ask where a client transaction stands and how their brokerage was computed, and each answer requires a human to check two systems",
        outcome: "Authenticated, grounded answers on transaction status and brokerage computation available on demand in the distributor's language, raising distributor productivity directly",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Mutual-fund transaction platform", "Brokerage computation and payout systems", "Registrar and AMC feeds"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Client onboarding, KYC and mandate issue resolution for distributors",
        friction: "A distributor's client onboarding stalls on KYC status, a mandate registration fails, or a bank detail mismatches, and the distributor cannot proceed until support explains what went wrong",
        outcome: "Specific, in-language diagnosis of what failed and what to do next, unblocking distributors immediately rather than after a support queue",
        channels: ["Voice", "WhatsApp"],
        systems: ["Client onboarding and KYC systems", "CKYC and KRA interfaces", "Mandate registry", "Bank verification"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Platform, login and reporting support for the distributor network",
        friction: "Routine platform issues — access, reports, statement generation — generate steady ticket volume that the support team handles individually",
        outcome: "Self-service resolution of routine platform issues in-conversation, reserving human support for genuine exceptions",
        channels: ["Voice", "Chat", "WhatsApp"],
        systems: ["Distributor platform and access systems", "Reporting engine", "Ticketing system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A distributor-facing transaction and reporting platform with self-service functionality",
        "A distributor support desk handling transaction, brokerage and platform queries",
        "A mobile application for distributors to transact and track client portfolios",
        "Email and ticket-based support channels for the distributor network",
      ],
      gaps: [
        "Distributors cannot get an authenticated transaction or brokerage answer without a human",
        "Onboarding and mandate failures are diagnosed reactively through a support queue",
        "Support capacity does not flex with market-driven or year-end query spikes",
        "Regional-language support does not match a distributor network spread across small towns",
      ],
    },
    risks: [
      "SEBI distribution regulations bound what a distributor-facing platform may communicate, and no automated response may constitute investment advice to an end investor",
      "Brokerage and commission data is commercially sensitive and must be strictly scoped to the authenticated distributor",
      "DPDP obligations apply to end-investor data accessed through distributor queries, requiring careful access-boundary design",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions to validate — volume estimates distributor support contact across a large aggregation network, and cost per interaction reflects Indian business-support desk economics for partner-facing queries.",
    },
    pilotScope:
      "A ten-week pilot on distributor transaction-status and brokerage queries in Hindi, Gujarati and English with authenticated distributor-scoped access, measured on query resolution time, support-desk volume displaced and distributor satisfaction.",
    expansion: [
      "Add client onboarding, KYC and mandate failure diagnosis for distributors",
      "Extend to platform, login and reporting support across the network",
      "Add Marathi and additional languages matching distributor geography",
    ],
    stakeholders: [
      "Managing Director",
      "Chief Operating Officer",
      "Head of Distributor Relations or Channel",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How many distributor support contacts do you handle monthly, and what are the top three categories?",
      "Does support responsiveness correlate with distributor attrition in your data?",
      "How much does distributor query volume spike at financial year end or during volatile markets?",
      "What access boundaries must be enforced so a distributor only ever sees their own clients and brokerage?",
    ],
    flowTemplate: "dealer-support",
    scenario:
      "A Prudent distributor in Rajkot asks in Gujarati why a client SIP registration failed, learns the mandate bank detail mismatched, and fixes it before the next transaction date.",
  },

  "sbi-mutual-fund": {
    operatingContext:
      "SBI Funds Management runs SBI Mutual Fund, India's largest asset manager by assets under management, with an investor base swollen by the systematic-investment-plan boom and by State Bank of India's unmatched distribution reach into small towns and rural districts. That combination produces millions of small folios held by first-time investors who encounter the mechanics of investing for the first time: a SIP instalment that did not go through, a KYC status that blocks a transaction, a redemption whose credit timeline they do not understand, a nominee they need to add. Folio-servicing volume scales with the SIP base regardless of market direction, so the workload is structural rather than cyclical. Servicing responsibility is shared with its registrar and transfer agent, and reaches investors through the AMC's app and website, the RTA's channels, distributors, bank branches and an investor helpline in Hindi, Marathi, Tamil, Bengali and English.",
    strategicPressure: [
      { text: "SBI Mutual Fund is India's largest asset manager by assets under management, with distribution reach through State Bank of India", kind: "verified" },
      { text: "The systematic-investment-plan boom has added millions of small folios held by first-time investors, and that base generates servicing contact independent of market direction", kind: "verified" },
      { text: "SIP mandate failures, KYC blocks and redemption-timeline questions are the three highest-frequency query types on a mass-retail folio base, and each is fully answerable from systems of record", kind: "inference" },
      { text: "The servicing boundary with its registrar and transfer agent determines who owns the investor conversation, and getting that wrong means selling to the wrong side of the relationship", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. An asset manager's engineering is investment technology, risk systems and distribution tooling; investor-communication infrastructure has historically been delegated to the registrar and transfer agent or procured. SBI Funds Management would not build speech and telephony capability, and its servicing arrangements with the RTA make a procured, integrable capability the natural shape.",
    whyNotBuild:
      "Answering a first-time investor about a failed SIP mandate in Marathi requires speech models, telephony, orchestration into RTA folio and mandate systems that the AMC does not itself own, and evaluation that guarantees no response strays into investment advice under SEBI rules. Four specialist capabilities, and the AMC does not even control all the underlying systems — which makes buying an integrable capability the only sensible route.",
    workflows: [
      {
        name: "SIP status, mandate-failure diagnosis and repair",
        friction: "A SIP instalment fails on a bank mandate, insufficient balance or a registration issue, and the investor learns from a generic message that does not say what went wrong or how to fix it",
        outcome: "Specific in-language diagnosis of why the instalment failed with the fix guided in-conversation, protecting the SIP book that underpins the AMC's flows",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["RTA folio and transaction records", "SIP mandate and NACH registry", "Bank verification", "Payment gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "KYC-block resolution and folio-detail servicing",
        friction: "Transactions are blocked by KYC status, address or bank mismatches, and the investor bounces between the AMC, the RTA and the KYC registration agency without a clear instruction",
        outcome: "A single authoritative explanation of the block and the exact documents needed, with status tracked until the folio is transactable again",
        channels: ["Voice", "WhatsApp"],
        systems: ["KYC and KRA interfaces", "CKYC records", "RTA folio records", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Redemption, switch and payout-timeline servicing",
        friction: "Investors call to ask when a redemption will credit, why the amount differs from expectation, or how a switch settles, and the answer requires reading transaction and NAV records",
        outcome: "Grounded, folio-specific answers on timelines and amounts, removing the single most repetitive category of investor contact",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["RTA transaction records", "NAV and unit records", "Payout and banking interface"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An investor mobile app and website for transactions, folio access and statements",
        "An investor helpline and email servicing channel",
        "Registrar and transfer agent servicing channels including branches and digital tools",
        "Distributor and SBI branch assistance for investors who transact through intermediaries",
      ],
      gaps: [
        "SIP failure reasons are not explained specifically to the investor in a channel they use",
        "KYC blocks require the investor to navigate three institutions without a single authoritative answer",
        "Vernacular voice servicing does not match the small-town reach of the distribution base",
        "No proactive contact before a foreseeable SIP failure or a KYC expiry",
      ],
    },
    risks: [
      "SEBI mutual-fund regulations prohibit anything resembling investment advice from a servicing channel, requiring hard conversational guardrails",
      "The servicing boundary with the registrar and transfer agent determines system access, data ownership and who can contract for the capability — this must be settled before scoping",
      "KYC and folio data carry DPDP obligations and KYC registration agency access rules that limit what may be disclosed and to whom",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation — volume is an order-of-magnitude estimate of monthly investor servicing contact across a very large retail folio base, and cost per interaction reflects Indian investor-helpline economics; the AMC-versus-RTA split of this volume is the key unknown.",
    },
    pilotScope:
      "A ten-week pilot on SIP status and mandate-failure diagnosis in Hindi and Marathi for a defined investor cohort, with the failure reason explained specifically and the repair guided in-conversation, measured on SIP recovery rate and helpline volume displaced.",
    expansion: [
      "Add KYC-block resolution with document guidance and status tracking",
      "Extend to redemption, switch and payout-timeline servicing across the folio base",
      "Add Tamil, Bengali and further languages matching the distribution footprint",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Investor Services and Operations",
      "Chief Technology Officer",
      "Head of Distribution and Digital Business",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Where exactly does servicing responsibility sit between you and your registrar and transfer agent?",
      "How many SIP instalments fail monthly, and what proportion are recoverable if the investor is told why?",
      "What share of investor contacts are KYC-block related, and how long does resolution take today?",
      "Which languages does your investor helpline support, and where does that fall short of your investor base?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An SBI Mutual Fund investor in Nashik learns in Marathi that her SIP failed because her bank mandate expired, and re-registers it before the next instalment date.",
  },

  "hdfc-amc": {
    operatingContext:
      "HDFC Asset Management Company is one of India's largest listed asset managers, with a vast individual-investor folio base accumulated over decades of distributor-led sales through independent financial advisors, national distributors and bank channels. Because so much of the base was intermediated rather than acquired digitally, a large share of investors service their folios by phone or through their distributor rather than through the app — asking about NAV, dividend or income-distribution credits, redemption status, statement requests and nominee updates. These are commodity interactions with fully determinate answers sitting in the registrar's records. The AMC is deliberately lean operationally, delegating substantial servicing to its registrar and transfer agent, and its own technology investment goes to investment management, distribution enablement and digital acquisition rather than to contact infrastructure.",
    strategicPressure: [
      { text: "HDFC AMC is among India's largest listed asset managers with a very large individual-investor folio base built through distributor-led distribution", kind: "verified" },
      { text: "A distributor-acquired investor base services folios through phone and intermediaries far more than a digitally acquired base does", kind: "inference" },
      { text: "NAV, income-distribution and redemption-status queries are commodity interactions with determinate answers, making them the clearest automation candidates in the AMC servicing mix", kind: "inference" },
      { text: "As a listed AMC judged on operating leverage, servicing cost per folio is a metric management watches, particularly as folio counts grow faster than assets", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. HDFC AMC runs a deliberately lean operating model with heavy delegation to its registrar and transfer agent, and its technology spend targets investment and distribution systems. It has no engineering identity in communications infrastructure and would procure a servicing capability, with the practical question being whether the budget sits with the AMC or with the RTA arrangement.",
    whyNotBuild:
      "Investor servicing by voice requires speech, telephony, orchestration into registrar folio and NAV records that the AMC does not own, and evaluation guarding against advisory content under SEBI rules. An operationally lean AMC will not build four capabilities to service interactions it has already chosen to delegate.",
    workflows: [
      {
        name: "Folio servicing for redemption, income-distribution and NAV queries",
        friction: "Investors call or ask their distributor when a redemption will credit, why an income distribution differed from expectation, or what a folio is worth, and each answer requires someone to read registrar records",
        outcome: "Grounded, folio-specific answers delivered conversationally at any hour, removing the highest-frequency and lowest-judgement category of investor contact",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["RTA folio and transaction records", "NAV and unit records", "Payout and banking interface"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Statement, tax-certificate and capital-gains document servicing",
        friction: "Statement and capital-gains statement requests spike sharply in the tax-filing window and around financial year end, overwhelming a servicing function sized for average volume",
        outcome: "Authenticated document generation and delivery in-conversation, flattening a predictable seasonal spike without temporary capacity",
        channels: ["Voice", "WhatsApp"],
        systems: ["RTA folio records", "Statement and tax-document generation", "Investor master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Nominee, bank-detail and contact-update servicing",
        friction: "Routine folio updates require forms or an RTA branch visit, and stale bank or contact details surface only when a payout fails or a communication bounces",
        outcome: "Authenticated updates completed conversationally with audit trail, keeping the folio base clean and payouts reliable",
        channels: ["Voice", "WhatsApp"],
        systems: ["RTA folio records", "KYC and CKYC interfaces", "Document verification"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An investor mobile app and website for transactions, folio access and statements",
        "An investor helpline and email servicing channel",
        "Registrar and transfer agent servicing channels including branches and digital self-service",
        "A distributor network that handles much of the investor relationship and servicing",
      ],
      gaps: [
        "Investors cannot get authenticated folio, payout or NAV answers by voice without a human",
        "Seasonal statement and tax-document demand is absorbed by longer turnaround",
        "Nominee and bank-detail updates still require forms or an RTA touchpoint",
        "Regional-language voice servicing is thin relative to a nationally distributed folio base",
      ],
    },
    risks: [
      "SEBI mutual-fund regulations prohibit investment advice from a servicing channel, requiring strict guardrails on any response about performance or fund selection",
      "The in-house versus RTA-delegated servicing split determines where the budget and the system access sit — the primary commercial unknown on this account",
      "Investor folio and KYC data carry DPDP obligations, and RTA-held data adds a processing-arrangement layer to any deployment",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions to validate in discovery — volume estimates monthly investor servicing contact across a large individual-investor folio base, and cost per interaction reflects Indian investor-helpline economics; the AMC-versus-RTA split is unresolved.",
    },
    pilotScope:
      "A ten-week pilot on redemption, income-distribution and NAV servicing in Hindi, Gujarati and English for a defined investor cohort, with authenticated folio access and hard guardrails against advisory content, measured on helpline volume displaced and first-contact resolution.",
    expansion: [
      "Add statement, tax-certificate and capital-gains document servicing timed to the filing season",
      "Extend to nominee, bank-detail and contact updates",
      "Add Marathi and further languages matching distributor geography",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Investor Services",
      "Chief Technology Officer",
      "Head of Sales and Distribution",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What proportion of investor servicing is handled by you versus your registrar and transfer agent?",
      "Where would the budget for a servicing automation sit — with the AMC or inside the RTA arrangement?",
      "How much does statement and capital-gains request volume rise in the tax-filing window?",
      "How many investor contacts arrive through distributors rather than directly, and does that mask real demand?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An HDFC AMC investor in Ahmedabad asks in Gujarati when her redemption will credit and gets an exact date from the folio record, without calling her distributor.",
  },

  "icici-prudential-amc": {
    operatingContext:
      "ICICI Prudential Asset Management is among India's largest asset managers, with a particularly strong hybrid and debt fund franchise that attracts conservative investors — including many older savers who chose funds for income and stability rather than growth, and who prefer to telephone rather than tap. Its folio base is national and intermediated, distributed through banks, national distributors and independent advisors, which generates a parallel business-to-business support stream: distributors chasing commission statements, transaction status and onboarding issues alongside investors chasing redemptions, nominee updates and statements. Servicing is shared with the registrar and transfer agent and delivered through the AMC's app, website, investor helpline and RTA channels, with Hindi, Marathi, Tamil and English all in routine use.",
    strategicPressure: [
      { text: "ICICI Prudential AMC is among India's largest asset managers with a strong hybrid and debt fund franchise", kind: "verified" },
      { text: "A conservative, income-oriented investor base skews older and more assisted-channel-oriented than an equity-growth investor base", kind: "inference" },
      { text: "Its distributor network generates a parallel support stream on commissions, transaction status and onboarding that competes with investor servicing for the same capacity", kind: "inference" },
      { text: "AMC operating models keep servicing thin and delegated, so scale growth translates into contact-volume growth without proportional servicing investment", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. The AMC's engineering investment goes to investment technology, risk systems and digital acquisition; investor and distributor communication is delegated or procured. Structurally there is no path to an internal conversational build, and the joint-venture governance reinforces preference for contracted vendors with audit evidence.",
    whyNotBuild:
      "Servicing both investors and distributors by voice requires multilingual speech, telephony, orchestration into registrar folio records and commission systems, and evaluation guaranteeing no advisory content under SEBI rules. Four specialist products for an asset manager whose differentiation is fund management, not contact infrastructure.",
    workflows: [
      {
        name: "Investor redemption, nominee and folio-update servicing",
        friction: "Older, income-oriented investors call to redeem, update a nominee or ask about a payout, and each request requires a human to verify identity and read or update registrar records",
        outcome: "Authenticated, in-language servicing completed conversationally with full audit trail, matching the assisted experience this investor base expects at self-service cost",
        channels: ["Voice", "WhatsApp"],
        systems: ["RTA folio and transaction records", "KYC and CKYC interfaces", "Payout and banking interface"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Distributor commission and transaction-status support",
        friction: "Distributors call for commission statements, brokerage computation and client transaction status, and their queries compete with investor servicing for the same desk",
        outcome: "A partner-facing servicing layer answering commission and transaction questions from the systems of record, raising distributor productivity and protecting investor-servicing capacity",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Distributor and commission systems", "RTA transaction records", "ARN and empanelment records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Statement, tax-document and income-distribution servicing",
        friction: "Statement, capital-gains and income-distribution queries spike at year end and in the tax-filing window, and the answers are entirely determinate",
        outcome: "On-demand authenticated document generation and payout explanations, flattening a predictable seasonal load",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["RTA folio records", "Statement and tax-document generation", "NAV and distribution records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An investor app and website for transactions, folio access and statements",
        "An investor helpline and email servicing channel",
        "Registrar and transfer agent servicing channels including branches",
        "A distributor portal and support desk for intermediary queries",
      ],
      gaps: [
        "Older investors who will not self-serve have only a human queue as an alternative",
        "Distributor support competes with investor servicing for the same capacity",
        "Seasonal statement and tax-document demand is absorbed by slower turnaround",
        "Regional-language voice servicing is limited relative to a national folio base",
      ],
    },
    risks: [
      "SEBI mutual-fund regulations prohibit investment advice from servicing channels, which is especially sensitive with an older, income-oriented investor base",
      "Distributor commission data is commercially sensitive and must be strictly scoped to the authenticated intermediary",
      "The servicing split between the AMC and the registrar determines system access and contracting route, and joint-venture governance may add an approval layer",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions requiring discovery — volume estimates investor plus distributor servicing contact across a large folio base, and cost per interaction reflects Indian investor-helpline and partner-desk economics.",
    },
    pilotScope:
      "A ten-week pilot on investor redemption, nominee-update and payout-status servicing in Hindi, Marathi and English with authenticated folio access and strict guardrails against advisory content, measured on first-contact resolution and helpline volume displaced.",
    expansion: [
      "Add distributor commission and transaction-status support as a separate authenticated channel",
      "Extend to statement, tax-document and income-distribution servicing for seasonal peaks",
      "Add Tamil and further languages matching the distribution footprint",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Investor Services and Operations",
      "Chief Technology Officer",
      "Head of Sales and Distribution",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Do servicing decisions route through the joint-venture board or through operating management?",
      "How does contact volume split between investors and distributors, and who handles each?",
      "What proportion of your investor base still prefers phone servicing over the app?",
      "Where does the registrar's servicing responsibility end and yours begin?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An ICICI Prudential investor in Pune calls in Marathi to update her nominee and check a payout, and completes both in one authenticated conversation.",
  },

  "nippon-india-mf": {
    operatingContext:
      "Nippon Life India Asset Management runs Nippon India Mutual Fund, a Japanese-owned asset manager carrying one of the largest retail folio counts in the Indian industry, with historic strength in smaller cities inherited from its Reliance Mutual Fund lineage. That gives it a disproportionately vernacular and phone-first investor base among large AMCs, and an average folio size that makes cost per assisted interaction unusually punishing relative to the revenue each folio generates. The bulk of that base transacts through systematic investment plans with bank mandates, so mandate failures, bank changes and SIP registration problems are the most common operational friction. Servicing is shared with the registrar and transfer agent and reaches investors through the AMC's app and website, distributors, and an investor helpline in Hindi, Gujarati, Bengali, Tamil and English.",
    strategicPressure: [
      { text: "Nippon Life India Asset Management has one of the largest retail folio counts among Indian AMCs and a legacy strength in smaller cities from its Reliance Mutual Fund heritage", kind: "verified" },
      { text: "Small average folio sizes make servicing cost per rupee of assets among the least favourable in the large-AMC peer set", kind: "inference" },
      { text: "A SIP-heavy small-city base makes mandate failures and bank-detail problems the dominant operational friction, and each unresolved failure risks the SIP stopping permanently", kind: "inference" },
      { text: "Japanese-parent governance standardises on procured, auditable platforms rather than local product development", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. Nippon Life's governance favours procured, auditable systems with documented vendor accountability, and the AMC's own technology investment goes into investment and distribution platforms. Investor communication infrastructure is delegated or bought — there is no internal path to a conversational build.",
    whyNotBuild:
      "Five-language speech tuned to small-city investors, telephony at retail scale, orchestration into registrar folio and mandate systems the AMC does not own, and evaluation guarding against advisory content are four specialist capabilities. For an AMC whose problem is servicing cost per small folio, adding four engineering programmes is precisely the wrong answer.",
    workflows: [
      {
        name: "SIP mandate-failure diagnosis and re-registration",
        friction: "A SIP stops because a bank mandate lapsed, a bank account changed or a registration was rejected, and the investor receives a generic failure message that does not explain the cause",
        outcome: "Specific in-language diagnosis and guided re-registration, converting an otherwise permanently stopped SIP back into an active one",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["SIP mandate and NACH registry", "RTA folio and transaction records", "Bank verification", "Payment gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Small-city investor folio servicing in vernacular languages",
        friction: "Investors in smaller cities call to ask about folio value, redemption status, statements and nominee details, and the helpline's language coverage does not match where the folios actually are",
        outcome: "Grounded, folio-specific answers in the investor's own language at any hour, serving the base at a cost the small folio size can support",
        channels: ["Voice", "WhatsApp"],
        systems: ["RTA folio and transaction records", "NAV and unit records", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "KYC refresh and bank-detail update servicing",
        friction: "Stale KYC and bank details block transactions and cause payout failures, and the investor typically discovers the problem at the worst moment — when trying to redeem",
        outcome: "Proactive detection and guided correction of KYC and bank-detail problems before they block a transaction",
        channels: ["Voice", "WhatsApp"],
        systems: ["KYC and CKYC interfaces", "RTA folio records", "Bank verification", "Document management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "An investor mobile app and website for transactions, folio access and statements",
        "An investor helpline and email servicing channel",
        "Registrar and transfer agent servicing channels including branches and digital tools",
        "A distributor network serving investors in smaller cities",
      ],
      gaps: [
        "SIP failures are notified generically rather than diagnosed specifically",
        "Vernacular voice coverage does not match the small-city concentration of the folio base",
        "KYC and bank-detail problems are discovered reactively at transaction time",
        "Cost per assisted interaction is out of proportion to the revenue a small folio generates",
      ],
    },
    risks: [
      "SEBI mutual-fund regulations prohibit investment advice from a servicing channel, requiring strict conversational guardrails",
      "Registrar-held folio and mandate data introduces a processing-arrangement layer alongside DPDP obligations",
      "Japanese-parent governance requires auditable vendor controls and may extend the diligence timeline",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.95,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation — volume is an order-of-magnitude estimate of monthly investor servicing contact across a very large small-ticket folio base, and cost per interaction reflects Indian investor-helpline economics for short queries.",
    },
    pilotScope:
      "A ten-week pilot on SIP mandate-failure diagnosis and re-registration in Hindi and Gujarati for investors whose instalments failed in the pilot window, measured on SIP reinstatement rate against the current notification-only treatment.",
    expansion: [
      "Extend vernacular folio servicing to Bengali and Tamil for the small-city base",
      "Add proactive KYC-refresh and bank-detail correction before transactions are blocked",
      "Introduce statement and tax-document servicing for seasonal peaks",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Investor Services",
      "Chief Technology Officer",
      "Head of Sales and Distribution",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What is your folio-size distribution, and what does servicing a median folio cost you today?",
      "How many SIP instalments fail monthly, and what proportion never resume?",
      "Which languages does your helpline cover, and how does that map to where your folios are?",
      "What vendor-governance requirements does Nippon Life impose on an India customer-facing supplier?",
    ],
    flowTemplate: "billing-recharge",
    scenario:
      "A Nippon India investor in Bhavnagar hears in Gujarati that her SIP mandate expired, re-registers it in the same conversation, and the next instalment goes through.",
  },

  "uti-amc": {
    operatingContext:
      "UTI Asset Management Company is India's oldest fund house, and its distinguishing operational feature is a uniquely legacy-heavy investor base: decades-old folios, physical unit certificates, holders who have died and whose units must be transmitted to nominees or legal heirs, unclaimed dividends, dormant folios with stale addresses, and investors from an era before electronic KYC existed. None of these journeys is handled by an app flow, and each consumes specialist staff time in long, document-heavy, emotionally sensitive interactions. Alongside that legacy tail it runs a conventional retail and institutional fund business including retirement and government-linked mandates. Its shareholding includes government-linked financial institutions, giving it a quasi-institutional culture that is procurement-driven and conservative. Servicing runs through investor service centres, an RTA relationship, digital channels and a helpline.",
    strategicPressure: [
      { text: "UTI is India's oldest fund house, carrying decades of legacy folios including physical certificates, transmission cases and unclaimed dividends", kind: "verified" },
      { text: "Its shareholding includes government-linked financial institutions, producing a quasi-institutional, procurement-driven governance culture", kind: "verified" },
      { text: "Legacy servicing journeys — transmission, unclaimed dividends, dormant folio reactivation — are document-heavy, long-duration and staff-intensive, and are precisely the interactions no app flow addresses", kind: "inference" },
      { text: "These journeys are also highly codifiable: fixed document checklists, defined status stages and guided processes, which makes them unusually good automation candidates despite their apparent complexity", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified buy-led. A quasi-institutional AMC with government-linked shareholders procures technology through structured processes and has no product-engineering culture. Its technology investment is directed at investment systems and digital distribution. Legacy-servicing automation would be bought as a defined, contracted capability.",
    whyNotBuild:
      "Guiding a bereaved family through a unit-transmission case requires speech, telephony, orchestration into registrar folio and legacy-records systems, and evaluation evidence that is both regulator-acceptable and sensitive to the human situation. Four specialist capabilities for an AMC whose culture and shareholding both point to procurement.",
    workflows: [
      {
        name: "Transmission and legal-heir folio servicing with guided document collection",
        friction: "A family trying to transmit units after a death faces a document list they do not understand, submits incomplete sets repeatedly, and calls for status through a process that takes months",
        outcome: "A guided, tracked transmission journey with the exact documents explained in-language, status pushed proactively, and human specialists reserved for genuine legal complexity",
        channels: ["Voice", "WhatsApp"],
        systems: ["RTA folio and legacy records", "Transmission case management", "Document management and verification", "Nominee records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Unclaimed-dividend and dormant-folio reactivation outreach",
        friction: "Unclaimed dividends and dormant folios sit unresolved because contact details are decades old and nobody has capacity to trace and re-engage holders",
        outcome: "Systematic outreach and guided reactivation with KYC and bank details refreshed, reducing an unclaimed balance that is both a regulatory and a reputational issue",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["RTA folio records", "Unclaimed dividend registers", "KYC and CKYC interfaces", "Bank verification"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Legacy folio servicing: physical certificates, statements and consolidation",
        friction: "Holders of old physical certificates and multiple legacy folios need dematerialisation, consolidation and statement help that only experienced staff can explain",
        outcome: "Guided in-language explanation of dematerialisation and consolidation steps with documents tracked, clearing a long tail of manual casework",
        channels: ["Voice", "WhatsApp"],
        systems: ["RTA folio and legacy records", "Depository interface", "Document management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A network of investor service centres providing in-person legacy-case servicing",
        "An investor helpline and email servicing channel",
        "An investor app and website for conventional transactions and statements",
        "Registrar and transfer agent servicing channels supporting folio operations",
      ],
      gaps: [
        "Transmission and legal-heir cases have no guided journey or proactive status",
        "Unclaimed dividends and dormant folios receive no systematic outreach",
        "Physical-certificate and consolidation requests require experienced staff every time",
        "Legacy investors have no vernacular self-service channel matched to their needs",
      ],
    },
    risks: [
      "SEBI mutual-fund regulations and unclaimed-amount rules govern how dormant folios and unclaimed dividends must be handled and reported, and outreach must comply with those requirements",
      "Transmission cases involve bereaved families and legal documentation, requiring conservative scripting, sensitivity and unconditional human escalation",
      "Quasi-institutional governance with government-linked shareholders means structured procurement and longer approval cycles",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.2,
      automationRate: 0.5,
      basis: "Seller assumptions to validate — volume estimates conventional plus legacy-case servicing contact for an AMC of this scale, and cost per interaction is set above the industry norm because legacy casework consumes specialist staff time rather than routine helpline capacity.",
    },
    pilotScope:
      "A twelve-week pilot on transmission and legal-heir cases in Hindi, Marathi and English: guided document explanation, checklist tracking and proactive status, with legal complexity routed to specialists, measured on case turnaround and repeat-submission rate.",
    expansion: [
      "Add unclaimed-dividend and dormant-folio reactivation outreach with KYC and bank refresh",
      "Extend to physical-certificate dematerialisation and folio-consolidation guidance",
      "Introduce conventional folio servicing for redemption, statement and nominee requests",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Investor Services and Operations",
      "Chief Technology Officer",
      "Head of Compliance and Investor Grievance",
      "Chief Financial Officer",
    ],
    discovery: [
      "How many transmission and legal-heir cases are open at any time, and what is the average turnaround?",
      "What is the size of your unclaimed-dividend and dormant-folio population, and what are you obliged to do about it?",
      "How much specialist staff time goes into legacy casework rather than current-book servicing?",
      "What procurement route applies given your shareholding structure?",
    ],
    flowTemplate: "onboarding",
    scenario:
      "A family in Nagpur transmitting a deceased parent's decades-old UTI folio is told in Marathi exactly which three documents remain, and tracks the case to completion without visiting an office.",
  },

  "cams": {
    operatingContext:
      "Computer Age Management Services is India's dominant mutual-fund registrar and transfer agent, servicing the majority of industry assets under management on behalf of dozens of asset managers. That position makes it the operational answering machine for the industry: it processes transactions, maintains folio records, runs investor service centres, and fields investor and distributor queries on NAV, transaction status, KYC, statements and payouts across all its AMC clients simultaneously. It has diversified into adjacent services including KYC registration, insurance repository and account-aggregator infrastructure, and it operates serious transaction-processing technology at scale. But its commercial differentiation is operations execution and its client relationships, not conversational software — which creates an unusual strategic question: whether it buys a conversational layer for its own operations, or white-labels one out to its AMC clients as a new service line.",
    strategicPressure: [
      { text: "CAMS is the dominant mutual-fund registrar and transfer agent in India, servicing the majority of industry assets under management across many AMC clients", kind: "verified" },
      { text: "It has diversified into adjacent financial-infrastructure services including KYC registration and account-aggregator businesses", kind: "verified" },
      { text: "A single deployment at the registrar touches more end investors than any individual AMC engagement could, which makes this the highest-leverage account in the mutual-fund servicing chain", kind: "inference" },
      { text: "Whether CAMS wants the capability for its own operations or as a white-labelled service to AMC clients changes the deal shape entirely, and both are plausible", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. CAMS runs genuine transaction-processing technology, so this is not a company without engineering. But its differentiation is operational execution and regulated infrastructure, and conversational servicing across languages and channels is a specialist layer it would source and integrate rather than construct. The partner framing is reinforced by the resale possibility: CAMS could embed the capability into its own service offering to AMCs, which makes a partnership construct more natural than a straight purchase.",
    whyNotBuild:
      "Multilingual speech, telephony at industry scale, orchestration across folio, KYC and transaction systems for dozens of AMC clients with strict data segregation, and per-conversation evaluation for SEBI-facing evidence would divert engineering from the transaction-processing platform that is the actual business. CAMS competes on processing accuracy and service levels; it has every reason to source the conversational layer and every reason to want it fast.",
    workflows: [
      {
        name: "Investor transaction-status and folio servicing across AMC clients",
        friction: "Investors call service centres and helplines to ask about transaction status, folio value, redemption timing and statements, and every answer is looked up manually across AMC-segregated records",
        outcome: "Authenticated, AMC-scoped answers delivered conversationally at any hour in the investor's language, absorbing the industry's highest-frequency query class",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Folio and transaction records per AMC", "NAV and unit records", "Payout and banking interfaces", "Investor master"],
        value: 3,
        complexity: 3,
      },
      {
        name: "KYC status, modification and blocked-transaction resolution",
        friction: "KYC problems block transactions and investors bounce between the AMC, the registrar and KYC registration agencies with no single authoritative explanation of what is wrong",
        outcome: "One definitive answer on KYC status with the exact remediation guided and tracked, resolving the industry's most frustrating servicing failure at its source",
        channels: ["Voice", "WhatsApp"],
        systems: ["KYC registration agency systems", "CKYC records", "Folio records", "Document management and verification"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Distributor and AMC-client operational support",
        friction: "Distributors and AMC operations teams query transaction processing, rejection reasons and reconciliation issues through email and desks, and turnaround affects the registrar's service-level commitments",
        outcome: "Immediate, grounded operational answers for distributors and AMC teams, improving measured service levels that are contractual commitments",
        channels: ["Voice", "Chat", "WhatsApp"],
        systems: ["Transaction processing systems", "Rejection and exception records", "Distributor and ARN records", "Service-level reporting"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A national network of investor service centres providing in-person folio servicing",
        "Investor-facing digital platforms and mobile applications for folio access and transactions",
        "Investor and distributor helplines supporting queries across AMC clients",
        "KYC registration agency and adjacent financial-infrastructure service platforms",
      ],
      gaps: [
        "Investor queries requiring authenticated folio access still route to humans or service centres",
        "KYC blocks are not resolved with a single authoritative explanation and tracked remediation",
        "Language coverage does not match an investor population spanning every Indian market",
        "Distributor and AMC operational queries are handled through email and desks rather than instantly",
      ],
    },
    risks: [
      "As a regulated registrar, CAMS operates under SEBI oversight with strict data-segregation obligations between AMC clients — any conversational layer must enforce those boundaries absolutely",
      "AMC clients must consent to how their investors are serviced, so a deployment here has a multi-party approval structure the deal must accommodate",
      "SEBI rules prohibit investment advice, and DPDP plus KYC registration agency rules govern what may be disclosed and to whom",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation — volume is an order-of-magnitude estimate of investor and distributor contact across the registrar's full AMC client base, and cost per interaction reflects Indian service-centre and helpline economics at industry scale.",
    },
    pilotScope:
      "A twelve-week pilot on investor transaction-status and folio servicing in Hindi, Tamil and English for a defined subset of AMC clients that agree to participate, with strict per-AMC data segregation, measured on service-centre and helpline volume displaced and first-contact resolution.",
    expansion: [
      "Add KYC status and blocked-transaction resolution across the registrar's KYC infrastructure",
      "Extend to distributor and AMC-client operational support against contractual service levels",
      "Package the capability as a white-labelled investor-servicing offering to AMC clients",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Technology Officer",
      "Head of Client Servicing or AMC Relationships",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Would you want this for your own operations, or as a white-labelled service you sell on to AMC clients?",
      "What contractual service levels do your AMC clients hold you to on investor query handling?",
      "How is data segregation between AMC clients enforced today, and what would a conversational layer have to prove?",
      "What proportion of investor contact is transaction status versus KYC problems versus statements?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A mutual-fund investor in Chennai calls CAMS in Tamil to check a redemption, gets an authenticated answer scoped to the right AMC folio, and never visits a service centre.",
  },

  "kfintech": {
    operatingContext:
      "KFin Technologies is the other pillar of India's mutual-fund registrar duopoly and additionally operates as a corporate registrar and share-transfer agent, handling IPO allotments, dividend mandates, shareholder services and corporate-action processing for listed issuers. That second business gives it a distinctive workload shape: event-driven surges that spike violently and predictably around large public issues, dividend record dates and corporate actions, on top of the steady mutual-fund folio servicing base. During a heavily subscribed IPO, allotment-status queries arrive from hundreds of thousands of applicants within a two-day window — a textbook surge-communication problem where fixed contact capacity fails by definition. It positions itself as a technology-led fintech platform company serving asset managers, issuers and investors across multiple markets, with servicing in Hindi, Telugu, Tamil, Gujarati and English.",
    strategicPressure: [
      { text: "KFin Technologies operates as both a mutual-fund registrar and a corporate registrar handling IPO allotments, dividends and shareholder services", kind: "verified" },
      { text: "IPO allotment and corporate-action events produce extreme, short-duration query surges that no fixed contact-centre roster can absorb economically", kind: "verified" },
      { text: "It positions itself as a technology platform company rather than a pure service bureau, which means it will want to embed a conversational layer into its own offering rather than merely consume one", kind: "inference" },
      { text: "Surge performance during high-profile IPOs is publicly visible and reflects on both KFintech and its issuer clients, giving it a reputational reason to solve this beyond cost", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Classified partner-led. KFintech has real platform engineering and a product-company self-image, so a pure vendor-purchase framing will not fit. The credible construct is a partnership in which the conversational capability is embedded into KFintech's own investor and issuer service offerings — which also means the commercial conversation is about how the capability is packaged and resold, not only about internal cost saving.",
    whyNotBuild:
      "Elastic multilingual voice and messaging capacity that scales from baseline to many multiples within hours, with speech across five languages, telephony operations, orchestration into registrar and issuer systems, and per-conversation evaluation, is a specialist product line. KFintech's engineering is committed to transaction processing and platform products for asset managers and issuers, and surge capacity is precisely what an internal build handles worst.",
    workflows: [
      {
        name: "IPO allotment-status surge servicing for issuer clients",
        friction: "In the days after a heavily subscribed public issue, hundreds of thousands of applicants want to know their allotment status simultaneously, and helplines melt while the issuer's brand takes the reputational hit",
        outcome: "Elastic, multilingual allotment-status answering that absorbs the entire surge, protecting both KFintech's service levels and the issuer's public reputation",
        channels: ["Voice", "WhatsApp", "SMS", "Chat"],
        systems: ["IPO allotment and registrar systems", "Applicant and PAN records", "Refund and payment records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Mutual-fund investor folio and transaction-status servicing",
        friction: "Investors across dozens of AMC clients call for transaction status, folio value, statements and KYC issues, each requiring an authenticated manual lookup in segregated records",
        outcome: "Authenticated, AMC-scoped folio answers delivered conversationally at any hour, absorbing the steady baseline query load",
        channels: ["Voice", "WhatsApp", "Chat"],
        systems: ["Folio and transaction records per AMC", "NAV and unit records", "KYC and CKYC interfaces"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Shareholder services: dividend mandates, unclaimed amounts and corporate actions",
        friction: "Shareholders chase dividend credits, bank-mandate updates and unclaimed amounts across record dates, and the volume clusters around corporate-action calendars",
        outcome: "Grounded, shareholder-specific answers on entitlements and credits with mandate updates completed in-conversation, flattening corporate-action-driven spikes",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Shareholder and corporate registrar records", "Dividend mandate and bank records", "Unclaimed amount registers", "Depository interfaces"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Investor and shareholder-facing digital platforms and mobile applications for folio and holding access",
        "Investor and shareholder helplines supporting queries across AMC and issuer clients",
        "IPO allotment-status web tools and applicant lookup services",
        "Corporate registrar systems handling dividends, corporate actions and shareholder records",
      ],
      gaps: [
        "No elastic conversational capacity for IPO and corporate-action surges",
        "Authenticated folio and holding answers still require human lookup",
        "Language coverage does not match an applicant and investor population spanning the whole country",
        "Shareholder mandate and bank-detail updates are not completed conversationally",
      ],
    },
    risks: [
      "As a regulated registrar under SEBI oversight, data segregation between AMC and issuer clients must be absolute and provable in any conversational layer",
      "Issuer clients have reputational stakes in IPO-period communication and will need to approve how their applicants are serviced",
      "SEBI rules prohibit investment advice, and DPDP obligations plus KYC registration rules constrain disclosure to authenticated parties only",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation — the baseline volume estimates steady investor and shareholder contact across registrar clients; IPO and corporate-action surges sit well above it and are the real design constraint. Cost per interaction reflects Indian helpline economics at scale.",
    },
    pilotScope:
      "A pilot timed to one upcoming public issue: multilingual allotment-status servicing across voice and WhatsApp for that issuer's applicants over the allotment and refund window, measured on surge absorption, answer accuracy and helpline volume displaced.",
    expansion: [
      "Extend to mutual-fund investor folio and transaction-status servicing across AMC clients",
      "Add shareholder services covering dividend mandates, unclaimed amounts and corporate actions",
      "Package the capability as an embedded investor-servicing product KFintech offers to its AMC and issuer clients",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Technology or Product Officer",
      "Head of Corporate Registry and Issuer Services",
      "Chief Compliance Officer",
    ],
    discovery: [
      "In your largest recent IPO, what was the peak query volume and how did the helpline hold up?",
      "Would you want this embedded in your own product offering to AMC and issuer clients, or purely for internal operations?",
      "How is data segregation between AMC and issuer clients enforced, and what would a conversational layer need to prove?",
      "Does your own product roadmap already include investor-facing conversational capability?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "In the two days after a heavily subscribed IPO, KFintech answers allotment-status questions in Telugu and Hindi for hundreds of thousands of applicants without a helpline queue.",
  },
};
