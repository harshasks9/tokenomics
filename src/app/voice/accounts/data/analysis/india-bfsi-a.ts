// Deep analysis blocks for the first 50 India BFSI qualified profiles.
// Evidence discipline: no fabricated figures, quotes, dates or URLs. Where a
// claim is not a widely-reported public fact it is labelled inference or
// hypothesis. Economics are explicitly seller assumptions for discovery.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_INDIA_BFSI_A: Record<string, ProfileAnalysis> = {
  "union-bank-of-india": {
    operatingContext:
      "Union Bank of India is a Mumbai-headquartered public-sector bank that absorbed Andhra Bank and Corporation Bank in the 2020 PSU amalgamation round, leaving it with one of the largest branch networks in the country and a depositor base concentrated in Maharashtra, Andhra Pradesh, Telangana, Karnataka and the Hindi belt. Its retail franchise is deposit-led — savings, term deposits, PMJDY basic accounts, pension credits and direct-benefit-transfer inflows — layered with agriculture (Kisan Credit Card), MSME and retail housing and vehicle lending. Customers reach the bank overwhelmingly through the branch counter and a toll-free contact centre, with a unified mobile app and a WhatsApp banking service handling balance, mini-statement and cheque-status style requests for the digitally active minority. The bank runs its technology through vendor-delivered core banking and empanelled system integrators rather than an internal product-engineering organisation.",
    strategicPressure: [
      { text: "The three-bank amalgamation left overlapping legacy processes, customer-ID mappings and branch practices that still surface as inbound queries about account numbers, IFSC changes and migrated deposits.", kind: "verified" },
      { text: "Pension, PMJDY and DBT servicing concentrates enormous, low-value, highly repetitive call volume into a channel staffed for a fraction of it, with peaks around credit dates rather than a smooth daily curve.", kind: "inference" },
      { text: "PSU cost-to-income scrutiny and headcount constraints from retirements mean service capacity cannot be solved by hiring — the bank has to absorb more contacts with the same or fewer people.", kind: "inference" },
      { text: "Language reality after the merger spans Telugu, Kannada, Marathi, Tamil and Hindi in the same customer base, which a two-language IVR structurally cannot serve.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Partner-led. The bank has scale and a real technology budget, but its operating model is procurement-driven: core banking, digital channels and contact-centre infrastructure are delivered by empanelled vendors and system integrators under tender. There is no evidence of an internal conversational-AI or speech engineering team, and PSU hiring rules make assembling one implausible. The realistic path is a packaged capability delivered through an SI the bank already trusts, priced and scoped to survive a tender.",
    whyNotBuild:
      "Building would mean owning Indic ASR and TTS quality across six languages, telephony integration with a legacy contact-centre estate, orchestration against three merged core-banking lineages, and a continuous evaluation harness for regulated conversations — four distinct engineering disciplines, none of which exist inside the bank today. Even if funded, PSU compensation bands cannot attract or retain the speech and ML talent required, and the accountability model for a self-built regulated customer channel is far worse than a contracted one.",
    workflows: [
      {
        name: "Pension and DBT credit-status line",
        friction: "Around pension and scheme credit dates, branch phones and the contact centre are saturated by identical 'has my money come in' calls; elderly callers navigate an English/Hindi DTMF tree and then wait for a human who reads a balance off a screen.",
        outcome: "Credit status, amount and value date answered in the caller's language within seconds, with a proactive message on credit day suppressing the call entirely for enrolled customers.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core banking system", "Pension processing / CPPC records", "DBT and government-scheme reconciliation files", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Merger-legacy account and IFSC resolution",
        friction: "Customers of the erstwhile Andhra Bank and Corporation Bank still present old account numbers, cheque books and IFSC codes; branch staff resolve these manually from mapping references, and remittances fail in the meantime.",
        outcome: "Old identifiers resolved to current ones in-conversation, with the corrected details pushed on WhatsApp and the failed-credit path explained without a branch visit.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Legacy account-mapping reference", "Payments / NEFT-IMPS switch"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Debit-card and UPI dispute intake",
        friction: "Failed ATM withdrawals and disputed UPI debits are logged by a human agent who re-collects the same transaction details the bank already holds, then raises a ticket the customer chases weekly.",
        outcome: "Structured dispute intake with the disputed transaction identified from the statement in-conversation, chargeback reference issued immediately, and proactive status updates until resolution.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Card management system", "UPI / switch transaction logs", "Dispute and chargeback workflow", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with a multi-level DTMF IVR in a limited language set",
        "Unified mobile banking app covering accounts, deposits, payments and service requests",
        "WhatsApp banking channel for balance, mini-statement and cheque-status style queries",
        "Internet banking portal with service-request forms and a branch/ATM locator",
      ],
      gaps: [
        "No conversational channel that can confirm a pension or DBT credit with the value date and reason for non-credit",
        "No self-service path that resolves merger-legacy account or IFSC confusion end to end",
        "Card and UPI disputes cannot be raised and tracked to closure without human handling",
        "Regional languages beyond the IVR's two options are effectively unserved on the phone channel",
      ],
    },
    risks: [
      "RBI customer-service and grievance-redressal expectations require auditable turnaround tracking on disputes and complaints — any automated intake must write into the same complaint register, not a parallel one.",
      "Public-tender procurement means scope, evaluation criteria and pricing are fixed at RFP stage; a pilot outside that route may not be extensible into production.",
      "DPDP obligations around consent, purpose limitation and retention for voice recordings of vulnerable pension customers need explicit design, not a bolt-on notice.",
    ],
    economics: {
      volumeMonthly: 3200000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions only — monthly interaction volume, fully loaded cost per assisted contact and achievable automation rate must be replaced with the bank's own contact-centre MIS during discovery.",
    },
    pilotScope:
      "An eight-to-ten week pilot on the pension and DBT credit-status intent in Hindi, Telugu and Marathi, grounded on core banking and pension-credit records, with proactive credit-day messaging for an enrolled cohort in two circles.",
    expansion: [
      "Extend to merger-legacy account and IFSC resolution plus deposit-renewal servicing across all six languages",
      "Add card and UPI dispute intake with write-back into the complaint register and proactive status updates",
      "Move outbound: KCC renewal reminders, dormant-account reactivation and MSME document follow-up across circles",
    ],
    stakeholders: [
      "Executive Director with customer-service and digital banking portfolio",
      "General Manager, Digital Banking / Transaction Banking",
      "Chief Technology Officer / Head of IT Department",
      "General Manager, Operations and Customer Service (contact centre owner)",
      "Chief Compliance Officer / Principal Nodal Officer for grievances",
    ],
    discovery: [
      "What share of contact-centre volume lands in the week around pension and DBT credit dates, and what is the abandonment rate in that window?",
      "How many distinct languages are actually requested by callers versus supported in the current IVR?",
      "Which system integrator holds the contact-centre and digital-channel contracts, and when do they come up for renewal?",
      "Do merger-legacy identifier queries have a code in the call-disposition taxonomy, or are they invisible in the MIS today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A pension holder in Vijayawada calls in Telugu on credit day to ask why her pension has not arrived — the agent confirms the credit, reads the value date, and explains the one-day clearing lag without a branch visit.",
  },

  "indian-bank": {
    operatingContext:
      "Indian Bank is a Chennai-headquartered public-sector bank that amalgamated Allahabad Bank into itself, producing an unusual footprint that pairs a dense Tamil Nadu heartland with a large eastern and Hindi-belt franchise inherited from one of India's oldest banks. Its book is anchored in retail deposits, agriculture and priority-sector lending, MSME credit around Tamil Nadu's industrial clusters, and government business including pension and scheme accounts. Rural and semi-urban branches carry heavy walk-in footfall for passbook updates, KYC re-verification, scheme enquiries and small-ticket loan servicing, while the phone channel handles a narrower band of balance and card queries. Digital channels consist of a mobile banking app, internet banking and a limited WhatsApp servicing option, all delivered by external vendors on a vendor-run core banking platform.",
    strategicPressure: [
      { text: "The Allahabad Bank amalgamation joined two banks with different language mixes, product histories and customer expectations under one servicing organisation.", kind: "verified" },
      { text: "Periodic KYC re-verification and inoperative-account reactivation drive branch footfall that has no functioning remote alternative for customers who do not use the app.", kind: "inference" },
      { text: "Government-business mandates — pension, scheme accounts, tax collection — bring service obligations that scale with the mandate but not with staffed capacity.", kind: "inference" },
      { text: "Southern customers expect Tamil while the eastern book expects Bengali and Hindi, so a single national IVR script satisfies neither half of the franchise.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Indian Bank's technology organisation runs vendor-delivered core banking and channel platforms and buys through public tender; its internal teams are configured for operations and vendor management rather than product engineering. It has the budget and governance to run a serious programme, but the delivery must come through a partner with an SI wrapper that fits its procurement model.",
    whyNotBuild:
      "The bank would have to acquire Tamil, Bengali and Hindi speech quality, telephony carrier integration, orchestration against a merged core-banking estate, and an evaluation regime for regulated conversations. None of these are adjacent to anything it operates today, and PSU staffing constraints make hiring a speech-and-ML team unrealistic. Buying a governed, auditable platform is both cheaper and defensible to the board and the regulator.",
    workflows: [
      {
        name: "Periodic KYC re-verification prompting",
        friction: "Customers discover their account is restricted only when a transaction fails, then queue at a branch; outbound reminder calling is done sporadically by branch staff between counter duties.",
        outcome: "Proactive multilingual outreach ahead of the KYC due date explaining exactly which document is needed and how to submit it, with branch visits reserved for genuine exceptions.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core banking system", "KYC / customer master records", "Document management system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Tamil and Bengali account-servicing line",
        friction: "The IVR forces callers into a narrow language set and a menu tree built around product codes rather than intents, so most callers zero out to an agent for balance, statement and cheque-status requests.",
        outcome: "Intent-first conversation in the caller's own language that completes balance, statement dispatch, cheque status and standing-instruction queries without human handling.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Statement / document generation", "Cheque clearing records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Agriculture and scheme-loan servicing",
        friction: "Kisan Credit Card renewal, interest-subvention eligibility and scheme-loan status questions are answered only at the branch by an officer who checks multiple screens, and seasonal peaks overwhelm that officer.",
        outcome: "Renewal dates, sanctioned limits, subvention conditions and required documents explained conversationally in the vernacular, with renewal appointments booked at the home branch.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Agriculture loan module", "Government scheme reference data", "Branch appointment scheduling"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "National toll-free contact centre with a DTMF IVR in a limited language set",
        "Mobile banking application covering payments, deposits and service requests",
        "Internet banking portal with online service-request forms",
        "Missed-call and SMS balance-enquiry services for feature-phone customers",
      ],
      gaps: [
        "No proactive, conversational KYC re-verification journey that avoids a branch visit",
        "Tamil, Bengali and other regional languages are not served conversationally on the phone",
        "Agriculture and scheme-loan servicing has no remote self-service path at all",
        "Inoperative-account reactivation still requires physical presence for most customers",
      ],
    },
    risks: [
      "RBI KYC master-direction requirements constrain what can be completed remotely — the agent can prompt, guide and schedule, but the verification step itself has a prescribed process.",
      "Tender-driven procurement with an incumbent contact-centre vendor may block a direct pilot; the commercial route needs to be established before technical validation.",
      "TRAI commercial-communication rules govern outbound reminder calling volumes, timing and consent registration for scheme and KYC outreach.",
    ],
    economics: {
      volumeMonthly: 1800000,
      costPerInteraction: 0.95,
      automationRate: 0.5,
      basis: "All four figures are seller assumptions for modelling only and must be replaced with the bank's contact-centre and branch-footfall data during discovery.",
    },
    pilotScope:
      "A ten-week pilot on proactive KYC re-verification outreach in Tamil, Hindi and Bengali for one southern and one eastern zone, measured on branch visits avoided and accounts restored to full operation.",
    expansion: [
      "Add the inbound Tamil and Bengali account-servicing intents to deflect the current zero-out traffic",
      "Extend to agriculture and scheme-loan renewal servicing ahead of the seasonal cycle",
      "Layer inoperative-account reactivation and deposit-renewal outbound campaigns across all zones",
    ],
    stakeholders: [
      "Executive Director responsible for digital and retail banking",
      "General Manager, Information Technology",
      "General Manager, Retail Banking / Customer Service",
      "Chief Digital Officer or Head of Digital Banking Division",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How many accounts fall due for periodic KYC re-verification per quarter, and what proportion currently lapse into restricted status?",
      "What is the language distribution of contact-centre calls, and how many callers zero out of the IVR immediately?",
      "Is customer-service transformation on the current-year tender plan, and at what scope?",
      "Who owns branch-footfall reduction as a measured objective — the zone, retail banking, or IT?",
    ],
    flowTemplate: "onboarding",
    scenario: "A depositor in Coimbatore is called in Tamil three weeks before her KYC falls due, is told exactly which document to bring, and books a ten-minute branch slot instead of losing account access.",
  },

  "idbi-bank": {
    operatingContext:
      "IDBI Bank is a Mumbai-headquartered bank majority-controlled by LIC and the Government of India, in a long-running strategic divestment process that has defined its operating posture for several years. Its retail base carries a distinctive legacy: former development-finance relationships, salary accounts, and a large deposit book that skews toward older customers who service accounts by phone and branch rather than app. Product servicing concentrates on term-deposit renewals and maturity instructions, pension and salary account queries, retail loan servicing and debit-card issues. With balance-sheet repair completed and cost ratios under permanent scrutiny ahead of the stake sale, the bank runs a lean technology organisation that consumes vendor platforms rather than building them.",
    strategicPressure: [
      { text: "The bank has been in an announced strategic-divestment process for an extended period, which constrains appetite for multi-year internal build programmes.", kind: "verified" },
      { text: "Cost-to-income discipline is the metric that matters most to a prospective acquirer, making headcount-free service capacity unusually attractive right now.", kind: "inference" },
      { text: "A deposit book weighted to older, branch-loyal customers produces high per-account servicing contact that app adoption has not reduced.", kind: "inference" },
      { text: "Divestment-era governance may require any material technology commitment to be structured so it does not encumber a future owner.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A bank in an active divestment process will not stand up a speech and orchestration engineering function; it will buy a contained, measurable capability that improves cost ratios inside a single planning cycle. The lean IT organisation is oriented to vendor management, and the decision calculus favours a packaged solution with a clean exit and transferable contract.",
    whyNotBuild:
      "There is no scenario in which pre-sale governance approves hiring an ML and speech team, funding multi-year platform development, and carrying the delivery risk on a regulated customer channel. Every incentive points to a bounded, contracted capability with published unit economics that a new owner can either extend or exit.",
    workflows: [
      {
        name: "Term-deposit maturity and renewal instruction",
        friction: "Maturity notices go out by SMS and letter; customers then call to ask about rates, renewal tenure and payout options, and staff process instructions manually — deposits that get no response auto-renew on default terms and customers dispute it later.",
        outcome: "Proactive pre-maturity conversation that explains current rates, captures the renewal or payout instruction, and confirms it in writing, lifting retained-deposit share without adding callers.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core banking system", "Term-deposit module", "Rate card / product master", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Account-servicing and statement requests",
        friction: "Balance, statement, cheque-status and standing-instruction queries from older customers all route to a human because the IVR is a product-code tree they will not navigate.",
        outcome: "Routine servicing completed conversationally in Hindi, Marathi and English, with statements dispatched in-channel and no queue for the simplest requests.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Statement generation", "Cheque clearing records"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Debit-card block, reissue and dispute intake",
        friction: "Card blocks are urgent and arrive out of hours; disputes require the agent to re-collect transaction details, and reissue-status follow-ups generate repeat calls for weeks.",
        outcome: "24x7 authenticated card block, reissue request and dispute intake with proactive status updates through to card delivery.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Card management system", "Dispute workflow", "Card personalisation / dispatch tracking", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR covering a small set of self-service options",
        "Mobile banking application with payments, deposits and service requests",
        "Internet banking with online deposit booking and service forms",
        "SMS and email alerting for transactions and deposit maturity",
      ],
      gaps: [
        "No conversational pre-maturity deposit renewal journey — instructions still require a human or a branch",
        "Out-of-hours card servicing is limited to blocking; disputes and reissue tracking need staffed hours",
        "Older customers have no vernacular voice path that completes a request end to end",
        "No proactive status communication on service requests once raised",
      ],
    },
    risks: [
      "Divestment governance may freeze or require special approval for new multi-year technology commitments — contract structure matters as much as the solution.",
      "RBI grievance-redressal timelines apply to any automated dispute intake, which must feed the same complaint register and clock.",
      "TRAI DND and consent rules apply to proactive deposit-renewal outreach, which sits close to the line between service and promotional communication.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Volume, cost and automation rate are seller assumptions used to frame the business case and must be validated against the bank's own contact-centre reporting.",
    },
    pilotScope:
      "An eight-week pilot on pre-maturity term-deposit outreach and renewal-instruction capture in Hindi, Marathi and English for a defined maturity cohort, measured on deposit retention rate and calls avoided.",
    expansion: [
      "Extend to inbound account-servicing and statement intents to deflect the highest-frequency assisted calls",
      "Add 24x7 card block, reissue and dispute intake with proactive status",
      "Broaden to retail-loan servicing including foreclosure quotes and interest certificates",
    ],
    stakeholders: [
      "Deputy Managing Director with retail banking oversight",
      "Chief Technology Officer / Head of IT",
      "Head of Retail Liabilities and Deposits",
      "Head of Customer Service / Contact Centre Operations",
      "Chief Financial Officer (cost-ratio owner ahead of divestment)",
    ],
    discovery: [
      "What proportion of maturing term deposits are retained today, and how many maturity-related calls does the contact centre take per month?",
      "Does divestment-related governance require a specific approval route for technology contracts beyond a certain value or tenure?",
      "What is the age profile of the deposit base, and how does app adoption vary across it?",
      "Which cost line does contact-centre spend sit in, and who is accountable for reducing it?",
    ],
    flowTemplate: "retention",
    scenario: "A retired depositor in Nagpur is called in Marathi ten days before his fixed deposit matures, hears the current rate for a two-year renewal, and confirms the instruction on the call.",
  },

  "bank-of-india": {
    operatingContext:
      "Bank of India is a Mumbai-headquartered public-sector bank with one of the widest international branch networks among Indian PSU banks alongside a deep domestic rural and semi-urban franchise. That combination produces genuinely bimodal service demand: NRI remittance, deposit and trade-related queries from overseas time zones on one side, and vernacular scheme, pension and agriculture-loan servicing across Maharashtra, Odisha, Gujarat and the Hindi belt on the other. Domestic contact volume concentrates in debit-card disputes and failed ATM or UPI transactions, pension processing, and Kisan Credit Card and agri-loan servicing that today lands on branch staff. The bank procures technology through public tenders with system-integrator delivery, and its digital channels are vendor-built rather than internally engineered.",
    strategicPressure: [
      { text: "The international branch network means service demand arrives across time zones that Indian staffed shifts do not cover.", kind: "verified" },
      { text: "Failed ATM and UPI transactions carry regulator-defined auto-reversal and compensation timelines, so dispute intake quality has a direct financial consequence, not just a service one.", kind: "verified" },
      { text: "Agri and scheme servicing peaks are seasonal and regional, creating capacity spikes that a fixed contact-centre roster cannot absorb.", kind: "inference" },
      { text: "The domestic language mix — Marathi, Odia, Gujarati, Hindi — is wider than the phone channel supports, pushing customers into branches by default.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. The bank has scale, a defined IT department and tender machinery, but no product-engineering function and no history of building customer-facing AI. Its digital estate is assembled from vendor components under SI delivery, and a conversational channel would follow the same path — bought as a capability, integrated by a partner, governed by the bank.",
    whyNotBuild:
      "A build would require Indic speech quality across at least five languages, 24x7 telephony operations spanning international corridors, orchestration into core banking and the card switch, and an evaluation framework strong enough to defend automated dispute intake to the regulator. The bank has none of these competencies, cannot hire them under PSU terms, and would take on delivery risk on the exact workflows where regulatory timelines bite hardest.",
    workflows: [
      {
        name: "Failed-transaction and card-dispute intake",
        friction: "A customer whose ATM withdrawal failed or whose UPI debit did not reverse calls, waits, repeats the transaction details, and receives a ticket number; the auto-reversal clock runs while the case sits in a queue.",
        outcome: "Authenticated intake that identifies the disputed transaction from the statement, opens the dispute against the correct rail immediately, and pushes status until reversal or resolution.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Card management system", "ATM and UPI switch logs", "Dispute / chargeback workflow", "Complaint register"],
        value: 3,
        complexity: 3,
      },
      {
        name: "NRI remittance and deposit servicing across time zones",
        friction: "Overseas customers call during their own working hours, which fall outside Indian contact-centre shifts, and get an IVR that cannot answer remittance status or NRE/NRO deposit questions.",
        outcome: "24x7 servicing that confirms inward remittance status, explains NRE versus NRO treatment, and captures deposit instructions without waiting for the Indian working day.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Core banking system", "Inward remittance / SWIFT tracking", "NRI deposit module", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Kisan Credit Card and agri-loan seasonal servicing",
        friction: "During sowing and renewal seasons, agri borrowers crowd branches to ask about limits, renewal dates and interest subvention; a single field officer answers the same question dozens of times a day.",
        outcome: "Vernacular voice servicing for limit, renewal date, subvention eligibility and document requirements, with branch appointments booked only for cases that need one.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Agriculture loan module", "Scheme and subvention reference data", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free domestic contact centre with an IVR and limited self-service options",
        "Mobile and internet banking with service-request and card-block functions",
        "Dedicated NRI service desk and email channel operating in Indian hours",
        "SMS and missed-call balance enquiry for feature-phone customers",
      ],
      gaps: [
        "Disputes cannot be raised, evidenced and tracked to closure without human handling",
        "No round-the-clock servicing for the international and NRI corridors",
        "Regional-language voice servicing is unavailable outside a narrow IVR set",
        "Agri and scheme queries have no remote path, so branch footfall is the release valve",
      ],
    },
    risks: [
      "RBI's harmonised turnaround-time framework for failed transactions imposes reversal and compensation deadlines that automated intake must respect and evidence.",
      "Cross-border servicing touches multiple jurisdictions' data and consent regimes alongside India's DPDP obligations for recorded voice interactions.",
      "PSU tender cycles determine the commercial route; a pilot must be structured to be extensible into a tendered production award.",
    ],
    economics: {
      volumeMonthly: 2200000,
      costPerInteraction: 1.05,
      automationRate: 0.5,
      basis: "Interaction volume, unit cost and automation rate are seller assumptions to be replaced with the bank's contact-centre MIS and dispute-volume reporting in discovery.",
    },
    pilotScope:
      "A ten-week pilot on failed-transaction and debit-card dispute intake in Hindi, Marathi and English, integrated to the card switch and complaint register, measured on time-to-dispute-raised and repeat status calls.",
    expansion: [
      "Add 24x7 NRI remittance and deposit servicing covering Gulf and Southeast Asian corridors",
      "Extend to vernacular agri and scheme servicing ahead of the seasonal peak",
      "Layer proactive outbound: dispute resolution notifications and deposit-maturity outreach",
    ],
    stakeholders: [
      "Executive Director with retail and digital banking portfolio",
      "General Manager, Information Technology",
      "General Manager, Cards and Digital Payments",
      "Head of NRI Business / International Banking Operations",
      "Principal Nodal Officer for customer grievances",
    ],
    discovery: [
      "What is the monthly volume of failed-transaction and card disputes, and what share breach the prescribed turnaround?",
      "How is NRI servicing staffed outside Indian hours today — outsourced, unstaffed, or email-only?",
      "What proportion of branch footfall is accounted for by agri and scheme queries during peak season?",
      "Which SI holds the contact-centre contract and when is it next competitively tendered?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer in Pune reports a failed ATM withdrawal at 11pm; the agent identifies the transaction, raises the dispute against the switch record, and confirms the reversal deadline before hanging up.",
  },

  "central-bank-of-india": {
    operatingContext:
      "Central Bank of India is a century-old, Mumbai-headquartered public-sector bank that operated under RBI's prompt-corrective-action framework before exiting it, an experience that anchored management attention on cost discipline, asset quality and retail growth rather than platform ambition. Its branch network is weighted toward rural and semi-urban India, where it functions as a scheme-delivery bank: PMJDY basic accounts, social-security enrolments, pension credits and small agricultural loans. Customers are largely low-balance, Hindi- and Marathi-speaking, and reach the bank through the branch counter or a business correspondent rather than a mobile app. Technology is procured through tenders and delivered by vendors, with a small internal IT function focused on running rather than building.",
    strategicPressure: [
      { text: "The bank operated under RBI's prompt-corrective-action framework and subsequently exited it, leaving cost discipline as the dominant management theme.", kind: "verified" },
      { text: "A scheme-heavy, low-balance customer base means revenue per account is small while servicing contacts per account are not, inverting normal channel economics.", kind: "inference" },
      { text: "Branch and business-correspondent staff absorb servicing load that has no phone alternative, which caps how much scheme volume the network can carry.", kind: "inference" },
      { text: "Post-PCA discretionary technology budgets are likely modest and tightly justified, favouring a small, measurable first deployment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Procurement runs through public tender with SI delivery, and the internal IT function is sized for operations. The bank's realistic route to a conversational channel is a packaged capability with a tightly defined scope that survives tender evaluation and shows a cost outcome within one financial year.",
    whyNotBuild:
      "The bank has neither the engineering bench nor the budget headroom to develop Indic speech, telephony orchestration and evaluation infrastructure, and its post-PCA governance would not defend such a programme. A contracted platform with transparent unit economics is the only proposition that fits both its constraints and its cost narrative.",
    workflows: [
      {
        name: "Scheme and pension credit enquiry line",
        friction: "PMJDY and social-security scheme customers walk to a branch or a correspondent point to ask whether a credit has landed; the counter answers by looking it up, one customer at a time.",
        outcome: "Vernacular voice self-service that confirms credit, amount and date, plus proactive credit-day messaging for enrolled customers, taking the simplest queries out of the branch queue.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core banking system", "Government scheme / DBT reconciliation", "Pension records", "Business-correspondent transaction records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Basic-account status and reactivation",
        friction: "Dormant and frozen basic savings accounts are discovered when a customer tries to withdraw a benefit, and reactivation requires an in-person visit with no advance warning.",
        outcome: "Proactive outreach before dormancy and a guided reactivation path that specifies exactly what is required, reserving the branch visit for the mandatory step only.",
        channels: ["Voice", "SMS"],
        systems: ["Core banking system", "KYC / customer master", "Dormancy and inoperative-account flags"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Business-correspondent support desk",
        friction: "Correspondent agents in the field have no fast route to resolve failed AePS transactions, settlement mismatches or device issues, so they call branch staff who are already serving a counter queue.",
        outcome: "A dedicated vernacular support line for correspondents that resolves transaction and settlement questions immediately, protecting the last-mile channel's uptime.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Business-correspondent management platform", "AePS / switch transaction logs", "Settlement records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with a basic IVR and limited self-service options",
        "Mobile and internet banking used mainly by the urban salaried segment",
        "SMS and missed-call balance enquiry suited to feature phones",
        "Business-correspondent network delivering assisted banking at the last mile",
      ],
      gaps: [
        "Scheme and pension credit confirmation requires a branch or correspondent visit for most customers",
        "No proactive communication before an account becomes dormant or restricted",
        "Business correspondents have no dedicated support channel of their own",
        "Regional-language conversational servicing does not exist on the phone channel",
      ],
    },
    risks: [
      "Government-scheme servicing carries political and audit sensitivity; automated responses about benefit credits must be exactly right and fully logged.",
      "Post-PCA budget governance and tender cycles will dictate both scope and timing — the commercial path is the primary risk, not the technology.",
      "DPDP consent and retention requirements apply to voice interactions with a low-literacy, vulnerable customer base, where consent capture must be genuinely comprehensible.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 0.85,
      automationRate: 0.5,
      basis: "These are seller assumptions for indicative modelling; the bank's own branch-footfall and contact-centre data should replace every figure during discovery.",
    },
    pilotScope:
      "An eight-week pilot on the scheme and pension credit-enquiry intent in Hindi and Marathi for two rural-heavy regions, measured on branch queue reduction and enquiries resolved without human handling.",
    expansion: [
      "Add proactive dormancy prevention and guided basic-account reactivation",
      "Stand up the business-correspondent support desk to protect last-mile uptime",
      "Extend to deposit and small-loan servicing across additional languages and regions",
    ],
    stakeholders: [
      "Executive Director with retail and financial-inclusion portfolio",
      "General Manager, Information Technology",
      "General Manager, Financial Inclusion / Government Business",
      "Head of Customer Service and Contact Centre",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How much branch counter time is spent on scheme and pension credit enquiries during credit weeks?",
      "What is the current-year tender plan for customer-service and contact-centre systems?",
      "How many business correspondents are active, and how are their transaction issues resolved today?",
      "What proportion of basic savings accounts fall dormant each year, and what does reactivation cost the network?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A PMJDY customer in rural Madhya Pradesh calls in Hindi to check whether her scheme benefit has been credited, and gets the amount and date without walking to the branch.",
  },

  "uco-bank": {
    operatingContext:
      "UCO Bank is a Kolkata-headquartered public-sector bank with its franchise concentrated in eastern India — West Bengal, Bihar, Jharkhand and Odisha — alongside a distinctive role in rupee-denominated trade settlement arrangements. Its retail base is deposit-heavy and skews toward Bengali- and Hindi-speaking customers in semi-urban and rural branches, with pension accounts, small savings and scheme balances forming the bulk of relationships. Service demand is therefore high in volume but low in complexity: balance and passbook queries, pension credit confirmation, deposit renewals and cheque status. Customers reach the bank at the counter or through a limited toll-free line; the mobile app serves a minority, and technology comes from empanelled vendors rather than internal engineering.",
    strategicPressure: [
      { text: "The customer base is predominantly Bengali- and Hindi-speaking, while digital and phone channels default to English-first design.", kind: "inference" },
      { text: "Pension and deposit servicing generate repetitive, date-driven contact spikes that branch staff absorb alongside counter duties.", kind: "inference" },
      { text: "As a smaller PSU bank, cost-to-income improvement is a standing board theme with limited levers available beyond channel efficiency.", kind: "inference" },
      { text: "The bank's participation in special trade-settlement arrangements adds a corporate service load with very different expectations from the retail base.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Partner-led. UCO Bank buys from empanelled vendors through tender and has no product-engineering organisation. Its scale does not justify an internal platform, and its procurement culture means the practical route is a packaged solution delivered with an SI wrapper against a clearly defined tender scope.",
    whyNotBuild:
      "Bengali and Hindi speech quality, telephony integration with a legacy contact-centre estate, orchestration into core banking, and continuous evaluation of regulated conversations are four separate capabilities the bank does not have and cannot staff. The cost of acquiring them would exceed the entire servicing budget it is trying to optimise.",
    workflows: [
      {
        name: "Bengali and Hindi deposit-servicing line",
        friction: "Balance, passbook, cheque-status and deposit-maturity queries all reach a human because the IVR is English-first and menu-driven, and callers who cannot navigate it queue for an agent.",
        outcome: "Conversational servicing in Bengali and Hindi that completes balance, statement, cheque-status and maturity-date requests without human involvement.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Term-deposit module", "Cheque clearing records", "Statement generation"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Pension credit and life-certificate season support",
        friction: "Pensioners call or visit around credit dates and again during the annual life-certificate window; branch staff explain the same process to each of them individually.",
        outcome: "Vernacular voice guidance on credit status and the life-certificate process, with proactive reminders through the submission window and escalation only for exceptions.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core banking system", "Pension processing records", "Life-certificate tracking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Deposit-maturity retention outreach",
        friction: "Maturing deposits are notified by SMS only; customers who do not respond auto-renew or withdraw, and no conversation happens at the moment the money is actually in play.",
        outcome: "Proactive pre-maturity calls in the customer's language that present current rates and capture renewal instructions, improving deposit retention without adding telecallers.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core banking system", "Term-deposit module", "Rate card / product master"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with a basic IVR and limited language coverage",
        "Mobile banking application used mainly by urban and salaried customers",
        "Internet banking with deposit booking and service-request forms",
        "SMS alerting and missed-call balance enquiry for feature-phone users",
      ],
      gaps: [
        "No conversational Bengali servicing on the phone channel despite it being the majority spoken language of the franchise",
        "Life-certificate and pension-process guidance exists only at the branch counter",
        "Deposit-maturity moments are handled by SMS, with no two-way conversation",
        "Service requests raised by phone have no proactive status communication",
      ],
    },
    risks: [
      "Pension servicing intersects with government-department processes; automated guidance must be accurate on life-certificate rules or the bank absorbs the complaint.",
      "Deposit-renewal outreach sits close to the promotional boundary under TRAI commercial-communication rules and requires careful consent framing.",
      "Tender timing and empanelment status will govern how quickly any pilot can convert into a production contract.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.85,
      automationRate: 0.5,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for modelling only and require validation against the bank's contact-centre and branch data.",
    },
    pilotScope:
      "An eight-week pilot on Bengali and Hindi deposit-servicing intents for the West Bengal and Bihar zones, measured on containment rate and reduction in agent-handled balance and cheque-status calls.",
    expansion: [
      "Add pension credit confirmation and life-certificate season guidance with proactive reminders",
      "Layer pre-maturity deposit-retention outreach on the same deployment",
      "Extend to card and failed-transaction dispute intake as the second phase",
    ],
    stakeholders: [
      "Executive Director with retail banking oversight",
      "General Manager, Information Technology",
      "General Manager, Retail Banking and Customer Service",
      "Head of Digital Banking",
      "Zonal Head, West Bengal (pilot sponsor)",
    ],
    discovery: [
      "What share of contact-centre calls are balance, cheque-status and deposit-maturity queries?",
      "How is the annual life-certificate window handled today, and what does it cost the branch network?",
      "Is Bengali supported anywhere in the current IVR, and what was the reason it was excluded?",
      "Does customer-service transformation appear on the current-year tender plan and at what scope?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A depositor in Howrah calls in Bengali to check her fixed-deposit maturity date, hears the renewal rate, and records her instruction without visiting the branch.",
  },

  "indian-overseas-bank": {
    operatingContext:
      "Indian Overseas Bank is a Chennai-headquartered public-sector bank with a dense Tamil Nadu branch presence and a historic overseas franchise built around Indian worker corridors to Southeast Asia and the Gulf. Domestically it is a deposit and priority-sector bank: savings and term deposits, agriculture and MSME lending across Tamil Nadu, and government-scheme accounts. The overseas dimension gives it a steady flow of inward remittance, NRE/NRO deposit and account-status queries from customers in different time zones who cannot reach an Indian-hours contact centre. Servicing today is Tamil-first at the branch counter and English-first on the phone, with a mobile app and internet banking supplied by vendors and no internal engineering capability.",
    strategicPressure: [
      { text: "The bank maintains a long-standing overseas presence in Southeast Asian and Gulf corridors serving Indian-origin customers.", kind: "verified" },
      { text: "Remittance senders and NRI depositors contact the bank in their local working hours, which fall largely outside Indian staffed shifts.", kind: "inference" },
      { text: "Domestic servicing is overwhelmingly Tamil-speaking while the phone channel is designed English-first, pushing customers to the branch.", kind: "inference" },
      { text: "After a long period under regulatory restrictions and recapitalisation, management priorities centre on cost discipline and steady retail growth rather than platform investment.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. The bank consumes technology through tenders and SI delivery, has no conversational-AI capability, and would treat a voice agent as a procured service integrated with existing core and channel platforms. Its overseas requirement adds a 24x7 operational dimension that argues even more strongly for a managed platform rather than a self-run one.",
    whyNotBuild:
      "Running a 24x7 multilingual voice channel across international corridors requires speech quality in Tamil and English variants, resilient telephony, orchestration into core banking and remittance tracking, and round-the-clock operations — an operating model the bank does not have. PSU staffing rules preclude assembling one, and the failure modes of a self-built channel land directly on the customer-grievance process.",
    workflows: [
      {
        name: "Inward remittance status, 24x7",
        friction: "A worker in Singapore or the Gulf who has remitted money calls during their evening, reaches an unstaffed line or an English IVR, and cannot find out whether the credit has landed or why it is held.",
        outcome: "Round-the-clock conversational confirmation of remittance status, expected credit date and the reason for any hold, in Tamil or English, without waiting for the Indian working day.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Inward remittance / SWIFT tracking", "NRI account module", "Compliance hold / screening records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Tamil-first account and deposit servicing",
        friction: "Domestic customers who speak Tamil navigate an English-led IVR, give up, and either queue for an agent or walk into the branch for a balance or deposit query.",
        outcome: "Tamil conversational servicing that completes balance, statement, deposit-maturity and cheque-status requests, removing the most repetitive assisted volume.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Term-deposit module", "Statement generation", "Cheque clearing records"],
        value: 3,
        complexity: 1,
      },
      {
        name: "NRE/NRO deposit and documentation guidance",
        friction: "NRI customers ask repeatedly about NRE versus NRO treatment, repatriation limits, tax deduction and the documents needed to open or renew a deposit; answers come by email days later.",
        outcome: "Grounded, citable explanations of account-type rules and document requirements delivered in-conversation, with the request captured and routed to the NRI desk when a human step is genuinely required.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["NRI deposit module", "Product and policy knowledge base", "Document management system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free domestic contact centre with an IVR operating in Indian hours",
        "Mobile and internet banking with deposit booking and service requests",
        "Dedicated NRI desk reachable by email and phone during Indian business hours",
        "SMS alerting and missed-call balance enquiry",
      ],
      gaps: [
        "No servicing coverage during Gulf and Southeast Asian working evenings",
        "Remittance status cannot be self-served with the reason for a hold explained",
        "Tamil is not available as a full conversational servicing language on the phone",
        "NRI documentation and account-type questions are answered asynchronously, if at all",
      ],
    },
    risks: [
      "Cross-border remittance queries touch FEMA and screening processes — the agent can report status but must never speculate about compliance holds.",
      "Data-residency and DPDP considerations apply when servicing customers physically outside India using Indian-held records.",
      "PSU tender cycles govern the commercial route and can extend beyond a fiscal year, so pilot structure must anticipate a later competitive award.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.9,
      automationRate: 0.5,
      basis: "Monthly interactions, unit cost and automation rate are seller assumptions used for indicative modelling and must be validated against the bank's own contact-centre and NRI-desk data.",
    },
    pilotScope:
      "An eight-week pilot on 24x7 inward-remittance status in Tamil and English for the Singapore, Malaysia and Gulf corridors, measured on out-of-hours queries resolved and NRI-desk email backlog reduction.",
    expansion: [
      "Add Tamil-first domestic account and deposit servicing across the Tamil Nadu network",
      "Extend to NRE/NRO documentation guidance with request capture and routing",
      "Layer proactive remittance-credit confirmation and deposit-maturity outreach",
    ],
    stakeholders: [
      "Executive Director with retail and international banking oversight",
      "General Manager, Information Technology",
      "General Manager, International Banking / NRI Business",
      "Head of Customer Service and Contact Centre",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What share of contact attempts arrive outside Indian staffed hours, and what happens to them today?",
      "How many remittance-status queries reach the NRI desk monthly, and what is the current response time?",
      "Is Tamil available in the IVR beyond a greeting, and what blocked full coverage?",
      "Which SI holds the digital-channel relationship, and when is the contact-centre contract next tendered?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A construction worker in Dubai calls at 10pm Gulf time to ask whether his remittance to Chennai has been credited, and hears the confirmed value date in Tamil.",
  },

  "bank-of-maharashtra": {
    operatingContext:
      "Bank of Maharashtra is a Pune-headquartered public-sector bank with a Marathi-first customer base concentrated in Maharashtra and a branch network extending into central and western India. It has been among the faster-growing smaller PSU banks in recent years, expanding retail and MSME lending alongside its traditional deposit and priority-sector franchise. That growth has outpaced its servicing infrastructure: loan-servicing queries, MSME documentation follow-ups, disbursement-status calls and deposit servicing all land on branch officers who are simultaneously originating business. Customers reach the bank mainly at the counter, through a toll-free line with limited self-service, and through a vendor-supplied mobile app used by the urban salaried segment.",
    strategicPressure: [
      { text: "The bank has reported some of the stronger loan and deposit growth rates among smaller PSU banks in recent years.", kind: "verified" },
      { text: "Book growth translates directly into servicing load — every new MSME and retail loan adds documentation, disbursement and repayment queries the branch must absorb.", kind: "inference" },
      { text: "Marathi is the working language of most of the customer base, but phone self-service is designed around Hindi and English.", kind: "inference" },
      { text: "A small internal IT function means every new capability is a procurement decision rather than a development one.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. The bank buys through tender with SI delivery and has no product-engineering organisation. Its attraction to a packaged conversational channel is straightforward: it needs servicing capacity to keep pace with growth without adding headcount, and it needs it inside one budget cycle.",
    whyNotBuild:
      "Building would divert a small IT team from running core systems to developing Marathi speech, telephony orchestration and evaluation infrastructure — capabilities with no reuse elsewhere in the bank. The growth problem it is trying to solve is immediate; a build would arrive years late and carry regulatory risk the bank has no appetite for.",
    workflows: [
      {
        name: "MSME loan document and disbursement status",
        friction: "MSME borrowers call the branch officer who sourced their loan to ask which document is pending and when the disbursement will land; that officer stops selling to check three systems and call back.",
        outcome: "Borrowers get the pending-document list and disbursement status conversationally in Marathi, with document submission guided and branch officers freed to originate.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan origination system", "Document management system", "Core banking system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Marathi retail account and deposit servicing",
        friction: "Balance, statement, deposit-maturity and standing-instruction queries reach agents because the IVR does not serve the customer base's actual language.",
        outcome: "Marathi-first conversational servicing that completes the highest-frequency retail requests without human handling.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Term-deposit module", "Statement generation"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Retail EMI reminder and bounce follow-up",
        friction: "EMI reminders are sent as SMS blasts and bounce follow-ups are made by branch staff between other duties, so contact is late, inconsistent and undocumented.",
        outcome: "Policy-timed vernacular reminders before the due date and structured, logged bounce follow-up with a payment link in-channel and hardship cases routed to a human.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / UPI collect", "Core banking system", "Collections case records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR offering limited self-service",
        "Mobile banking application with payments, deposits and service requests",
        "Internet banking portal with online loan and deposit applications",
        "SMS alerting and missed-call balance enquiry",
      ],
      gaps: [
        "No self-service route for loan document or disbursement status — it always requires the sourcing officer",
        "Marathi conversational servicing is unavailable on the phone channel",
        "EMI reminders are one-way messages with no conversation, payment capture or documented outcome",
        "Service requests have no proactive status communication once raised",
      ],
    },
    risks: [
      "RBI digital-lending and fair-practices expectations require that any repayment communication is documented, respectful of permitted contact hours and free of coercive language.",
      "TRAI commercial-communication and DND rules govern reminder-call timing, frequency and consent registration.",
      "As a PSU, production procurement runs through tender; a pilot must be scoped so it can be re-competed without wasted work.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Volume, cost and automation rate are seller assumptions for framing only, to be replaced with the bank's contact-centre and collections data during discovery.",
    },
    pilotScope:
      "An eight-week pilot on MSME loan document and disbursement-status servicing in Marathi and Hindi across the Pune and Nagpur zones, measured on branch-officer time recovered and repeat status calls avoided.",
    expansion: [
      "Add Marathi retail account and deposit servicing to deflect the highest-frequency inbound intents",
      "Extend to EMI reminders and early-bucket follow-up with in-channel payment capture",
      "Broaden to deposit-maturity retention outreach and dormant-account reactivation",
    ],
    stakeholders: [
      "Executive Director with retail and MSME banking portfolio",
      "General Manager, Information Technology",
      "General Manager, MSME and Retail Assets",
      "Head of Customer Service / Contact Centre Operations",
      "Chief Risk Officer",
    ],
    discovery: [
      "How much branch-officer time per week goes to answering document and disbursement-status questions?",
      "What is the current EMI reminder process, and is contact outcome recorded anywhere systematically?",
      "Is growth-driven service strain recognised at board level as a cost problem with an owner?",
      "What language mix do contact-centre calls actually arrive in versus what the IVR supports?",
    ],
    flowTemplate: "onboarding",
    scenario: "An MSME borrower in Nashik calls in Marathi to ask why his disbursement has not come through, and is told the one property document still pending and how to submit it that day.",
  },

  "karnataka-bank": {
    operatingContext:
      "Karnataka Bank is a Mangaluru-headquartered old-generation private bank with a branch network concentrated in coastal and interior Karnataka and a growing presence in other southern and western states. Its franchise is deposit-rich and relationship-led: term deposits, savings accounts held for decades, gold loans, locker services, retail housing and vehicle loans, and MSME credit for traders and small manufacturers. The customer base is largely Kannada-speaking, branch-loyal and older, so servicing contact concentrates on deposit renewals, locker and safe-custody queries, gold-loan renewals and releases, and statement or certificate requests. The bank has publicly pursued a digital transformation agenda through fintech and technology partnerships rather than internal platform development, and its lean IT organisation is oriented to integration and vendor management.",
    strategicPressure: [
      { text: "The bank has publicly committed to a digital transformation programme executed largely through technology and fintech partnerships.", kind: "verified" },
      { text: "A deposit franchise held by long-tenured, branch-loyal customers produces service contact that app adoption has not displaced.", kind: "inference" },
      { text: "Gold-loan renewals and releases are inherently high-frequency, short-cycle interactions that scale contact volume faster than book value.", kind: "inference" },
      { text: "Competition from larger private banks for the same Karnataka deposit base makes service experience a retention lever, not just a cost line.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Karnataka Bank's stated route to digital capability is partnership and procurement, not internal engineering. Its IT organisation integrates vendor platforms; it has no speech, ML or conversational-orchestration bench, and its scale gives no economic case for building one.",
    whyNotBuild:
      "The bank would need Kannada speech quality, telephony integration, orchestration into core banking and the gold-loan module, and an evaluation regime for regulated conversations — none of which exist internally and all of which are available as a contracted capability. Its own transformation strategy explicitly favours buying, so a build would contradict its declared operating model.",
    workflows: [
      {
        name: "Gold-loan renewal and release servicing",
        friction: "Gold-loan customers call or visit the branch to check interest due, renewal eligibility and the process to release pledged ornaments; branch staff handle each enquiry individually and renewals slip past due dates.",
        outcome: "Kannada conversational servicing that states interest due, renewal options and release requirements, with proactive pre-due reminders and payment capture in-channel.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan module", "Core banking system", "Payment gateway / UPI collect", "Branch appointment scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Deposit renewal and maturity instruction",
        friction: "Maturity notices are sent by SMS and letter; customers call the branch to ask about current rates, and instructions are captured manually or default to auto-renewal that customers later dispute.",
        outcome: "Proactive pre-maturity conversation in Kannada presenting current rates and capturing renewal or payout instructions, protecting the deposit base without adding telecallers.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Term-deposit module", "Rate card / product master", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Locker, certificate and document requests",
        friction: "Locker rent, nomination changes, balance certificates and interest certificates are all branch-counter transactions requiring a visit and often a second visit to collect the document.",
        outcome: "Requests captured conversationally with identity verified, documents generated and delivered digitally where permitted, and a branch slot booked only for steps that legally require presence.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Core banking system", "Locker / safe-custody records", "Document generation", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR and limited self-service options",
        "Mobile banking application covering payments, deposits and service requests",
        "Internet banking with online deposit booking and certificate downloads",
        "WhatsApp or SMS-based balance and alert services for basic enquiries",
      ],
      gaps: [
        "Gold-loan renewal and release questions have no remote self-service path",
        "Deposit maturity is handled by one-way notification rather than a conversation at the decision moment",
        "Kannada is not available as a full conversational servicing language on the phone",
        "Certificate and locker requests still generate branch visits for routine cases",
      ],
    },
    risks: [
      "RBI gold-loan directions govern renewal, valuation and auction communication; any automated notice must be provably delivered and correctly worded.",
      "Identity verification standards for document and nomination requests limit what can be completed without a branch step.",
      "TRAI commercial-communication rules apply to renewal and maturity outreach, which must be framed as service communication with proper consent.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Interaction volume, unit cost and automation rate are seller assumptions for indicative modelling and must be validated against the bank's contact-centre and gold-loan servicing data.",
    },
    pilotScope:
      "An eight-week pilot on gold-loan renewal reminders and interest-due servicing in Kannada across the coastal Karnataka cluster, measured on on-time renewals and branch enquiries deflected.",
    expansion: [
      "Add pre-maturity deposit renewal outreach with rate presentation and instruction capture",
      "Extend to locker, certificate and nomination request handling with digital delivery",
      "Broaden languages and add retail loan servicing including foreclosure quotes and interest certificates",
    ],
    stakeholders: [
      "Chief Operating Officer or Chief General Manager, Retail Banking",
      "Chief Information Officer / Head of IT",
      "Chief Digital Officer or Head of Digital Transformation",
      "Head of Retail Assets (gold-loan portfolio owner)",
      "Head of Customer Service / Contact Centre",
    ],
    discovery: [
      "Which transformation partner currently owns the digital-channel roadmap, and where does conversational servicing sit in it?",
      "What is the monthly volume of gold-loan renewal enquiries, and what share of renewals slip past due date?",
      "How are deposit-maturity instructions captured today, and what is the retention rate on maturing deposits?",
      "What proportion of branch footfall is certificate, locker and nomination requests that carry no revenue?",
    ],
    flowTemplate: "collections",
    scenario: "A gold-loan customer in Udupi is reminded in Kannada that interest is due in five days, hears the exact amount, and pays through a link in the same WhatsApp thread.",
  },

  "karur-vysya-bank": {
    operatingContext:
      "Karur Vysya Bank is a Tamil Nadu old-generation private bank headquartered in Karur, with a franchise built around the region's textile, engineering and trading clusters and a branch network extending across the south. Its commercial identity is MSME and trader banking: working-capital limits, cash-credit accounts, bill discounting, trade documents, and gold loans against jewellery for small businesses and households, alongside a stable retail deposit base. Proprietor customers run their banking by phone and by walking into a familiar branch — they call the branch manager about limit availability, cheque clearing, LC or BG status and gold-loan renewals rather than opening an app. The bank has been consistently profitable with a management reputation for adopting technology early, but it buys and integrates platforms rather than building them.",
    strategicPressure: [
      { text: "The bank's core franchise is MSME and trader banking in Tamil Nadu's industrial clusters, where relationships are phone-first and conducted in Tamil.", kind: "verified" },
      { text: "Working-capital customers generate daily operational queries — limit availability, cheque status, trade-document progress — that consume branch-manager time meant for business development.", kind: "inference" },
      { text: "Gold loans against jewellery add a high-frequency renewal and release cycle on top of the commercial book's servicing load.", kind: "inference" },
      { text: "Sustained cost-to-income improvement is a stated priority for mid-sized private banks competing with larger peers on the same customer base.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank's scale cannot justify an internal conversational-AI programme, and its technology posture is to adopt proven platforms early rather than develop them. Decision-making is fast and metrics-driven, which favours a contained pilot with clear unit economics over a multi-year build.",
    whyNotBuild:
      "Tamil speech quality, telephony, orchestration across core banking, the trade-finance system and the gold-loan module, plus an evaluation harness for regulated conversations, are four capabilities with no internal precedent. The bank's advantage is relationship banking in a specific industrial geography; nothing about that advantage is strengthened by owning speech infrastructure.",
    workflows: [
      {
        name: "Working-capital limit and cheque-status line",
        friction: "Proprietors call the branch manager to ask whether a cheque has cleared or how much drawing power is left; the manager checks the account and answers, repeatedly, throughout the day.",
        outcome: "Authenticated Tamil conversational servicing that reports available limit, drawing power, cheque status and recent transactions instantly, returning branch managers to relationship work.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Cash-credit / working-capital module", "Cheque clearing records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Trade-document and LC/BG status servicing",
        friction: "Trade customers chase the status of letters of credit, bank guarantees and documentary collections through phone calls and emails to the trade-finance desk, which responds when it can.",
        outcome: "Status of trade instruments and pending-document requirements answered conversationally with the correct reference, and only genuine exceptions escalated to the trade desk.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Trade-finance system", "Document management system", "Core banking system", "CRM"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Gold-loan renewal and interest-due outreach",
        friction: "Renewal and interest-due reminders depend on branch staff telecalling between counter duties, so contact is inconsistent and some loans drift toward overdue status unnecessarily.",
        outcome: "Proactive Tamil reminders stating the exact amount due and renewal options with payment capture in-channel, and documented outcomes for every attempt.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan module", "Core banking system", "Payment gateway / UPI collect", "Collections case records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR and limited self-service",
        "Mobile and internet banking including a business-banking portal for corporate customers",
        "Digital lending journeys for selected retail and MSME products",
        "SMS and email alerting for transactions, limits and cheque returns",
      ],
      gaps: [
        "No authenticated conversational channel that answers limit and drawing-power questions on demand",
        "Trade-instrument status requires a human at the trade-finance desk",
        "Gold-loan renewal outreach is manual and inconsistently executed",
        "Tamil conversational servicing is unavailable on the phone despite being the franchise language",
      ],
    },
    risks: [
      "Disclosing limit, drawing power and trade-instrument details demands strong authentication and authorisation controls mapped to the mandate holder, not just the calling number.",
      "RBI gold-loan directions govern renewal and auction-related communication, requiring provable delivery and precise wording.",
      "DPDP obligations apply to recorded commercial-banking conversations that contain business-sensitive information.",
    ],
    economics: {
      volumeMonthly: 420000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "All economics shown are seller assumptions for modelling and require validation against the bank's contact-centre, branch-call and gold-loan servicing data.",
    },
    pilotScope:
      "An eight-week pilot on the authenticated working-capital limit and cheque-status intent in Tamil and English for MSME customers in the Karur and Coimbatore clusters, measured on branch-manager time recovered and call containment.",
    expansion: [
      "Add gold-loan renewal and interest-due outreach with in-channel payment capture",
      "Extend to trade-document and LC/BG status servicing integrated with the trade-finance system",
      "Broaden to retail deposit and certificate servicing across the southern network",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Chief Information Officer / Head of Technology",
      "President or Head, Commercial and MSME Banking",
      "Head of Digital Banking",
      "Head of Customer Service / Contact Centre Operations",
    ],
    discovery: [
      "How many calls a day does a typical cluster branch manager take on limit availability and cheque status?",
      "Is trade-instrument status query volume measured anywhere, and what is the current response time?",
      "Who executes gold-loan renewal reminders today, and what share of renewals go past due?",
      "How does the current digital-banking roadmap treat voice — as legacy to be replaced or a channel to be upgraded?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A textile trader in Karur calls in Tamil at 8am to check whether a supplier cheque has cleared and how much drawing power remains before he places an order.",
  },

  "city-union-bank": {
    operatingContext:
      "City Union Bank is a Kumbakonam-headquartered private bank whose franchise is built on Tamil Nadu's MSME and trading community, with a branch network concentrated in the state's temple towns and industrial belts and a reputation for conservative underwriting and consistently strong return ratios. Its lending is dominated by working-capital and cash-credit facilities for small proprietors, gold loans against jewellery, and secured MSME term loans, funded by a sticky local deposit base. Customers are shop owners, small manufacturers and rice and textile traders who call the branch for limit enhancements, gold-loan releases, payment confirmations and cheque status rather than opening an app. The bank has a long record of adopting branch and payments technology early, but it buys and integrates rather than building, and its headcount is small relative to its balance sheet.",
    strategicPressure: [
      { text: "The bank's core customer base is Tamil Nadu MSME proprietors and traders who transact through branch relationships and phone contact.", kind: "verified" },
      { text: "Its cost-efficiency reputation depends on keeping headcount flat while the book grows, which makes any linear-scaling service process a structural problem.", kind: "inference" },
      { text: "Gold-loan volume creates short-cycle renewal and release interactions that multiply contacts per rupee lent.", kind: "inference" },
      { text: "Competition from larger private banks and NBFCs for the same MSME borrowers makes responsiveness a defensible differentiator.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank is small by headcount, has no software-engineering organisation, and has historically adopted third-party technology early where it improved branch productivity. A conversational servicing channel matches that pattern exactly: bought, integrated, measured on branch time saved.",
    whyNotBuild:
      "Nothing in the bank's operating model produces speech, ML or orchestration capability, and its efficiency ratios are precisely what a build programme would damage. Its competitive edge is local underwriting judgement and relationship density, neither of which improves by owning conversational infrastructure.",
    workflows: [
      {
        name: "Gold-loan release and renewal servicing",
        friction: "Customers call or visit to ask what is owed to release pledged jewellery and whether they can renew instead; branch staff calculate interest manually and the customer often makes two trips.",
        outcome: "Exact release or renewal amount stated conversationally in Tamil, payment taken in-channel, and a collection slot booked so the customer makes one short visit.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan module", "Core banking system", "Payment gateway / UPI collect", "Branch appointment scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "MSME limit, drawing power and payment confirmation",
        friction: "Proprietors phone the branch to confirm whether a payment has been credited or how much limit remains before committing to a supplier; the branch answers one call at a time.",
        outcome: "Authenticated Tamil servicing that reports balances, credits, drawing power and cheque status instantly, protecting branch capacity for credit work.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Cash-credit / working-capital module", "Payments switch records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "MSME renewal documentation follow-up",
        friction: "Annual working-capital renewals need stock statements, financials and insurance copies; chasing them is manual, late, and creates a compliance scramble at review time.",
        outcome: "Scheduled vernacular reminders listing exactly which document is outstanding, with submission guided and receipt confirmed, so renewals complete on time.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "Document management system", "Credit review / renewal tracker", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR and a small set of self-service options",
        "Mobile and internet banking including business-banking access for MSME customers",
        "Digital account-opening and selected digital lending journeys",
        "SMS and email alerting for credits, debits and cheque returns",
      ],
      gaps: [
        "Gold-loan release and renewal amounts cannot be obtained without a branch interaction",
        "No authenticated conversational path for limit, drawing-power and credit confirmation",
        "Renewal-document chasing is entirely manual and undocumented",
        "Tamil is not served as a full conversational language on the phone channel",
      ],
    },
    risks: [
      "RBI gold-loan directions govern renewal, valuation and pre-auction communication with prescribed notice requirements.",
      "Disclosing limits and credits requires mandate-level authorisation controls, not just caller-line identification.",
      "TRAI commercial-communication and DND rules apply to reminder and documentation-chase outreach.",
    ],
    economics: {
      volumeMonthly: 380000,
      costPerInteraction: 1.15,
      automationRate: 0.55,
      basis: "Volume, unit cost and automation rate are seller assumptions for indicative modelling only and must be replaced with the bank's own branch-call and contact-centre data in discovery.",
    },
    pilotScope:
      "An eight-week pilot on gold-loan release and renewal servicing in Tamil across the Kumbakonam and Trichy clusters, measured on repeat branch visits avoided and renewals completed on time.",
    expansion: [
      "Add authenticated MSME limit, drawing-power and payment-confirmation servicing",
      "Extend to working-capital renewal documentation follow-up with receipt confirmation",
      "Broaden to deposit servicing and certificate requests across the network",
    ],
    stakeholders: [
      "Managing Director and CEO (small bank, short decision chain)",
      "Chief Operating Officer",
      "Chief Information Officer / Head of Technology",
      "Head of MSME and Gold Loan Business",
      "Head of Customer Service and Operations",
    ],
    discovery: [
      "What share of gold-loan customers make more than one branch visit to complete a release?",
      "How many calls per day does a branch take on limit availability and credit confirmation?",
      "Who chases working-capital renewal documents today, and how often do renewals run late?",
      "Does the bank's early-adopter posture extend to AI voice, and who would sponsor a pilot?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A rice trader in Kumbakonam asks in Tamil what he owes to release his pledged jewellery, pays through a link, and collects it in one twenty-minute branch visit.",
  },

  "south-indian-bank": {
    operatingContext:
      "South Indian Bank is a Thrissur-headquartered private bank whose deposit franchise leans heavily on Kerala households and on the Gulf NRI corridor built from decades of Malayali migration to the UAE, Saudi Arabia, Qatar and Oman. Its balance sheet is deposit-rich with a large NRE and NRO book, alongside retail housing and vehicle lending, gold loans and MSME credit across Kerala, Tamil Nadu and Karnataka. Servicing demand is therefore split between domestic Malayalam-speaking customers who use the branch and the phone, and overseas depositors who need remittance confirmation, deposit renewal and account-mandate help during Gulf working hours that fall outside Indian shifts. The bank runs a mobile app, internet banking and a contact centre, all delivered by external technology vendors under a lean internal IT function.",
    strategicPressure: [
      { text: "The bank's deposit base includes a substantial NRI component sourced from the Kerala-to-Gulf migration corridor.", kind: "verified" },
      { text: "Gulf working hours and weekends do not align with Indian staffed contact-centre shifts, leaving the NRI base structurally underserved at the times they actually call.", kind: "inference" },
      { text: "NRE deposit rates are rate-sensitive and portable between banks, so servicing quality at maturity is a direct deposit-retention lever.", kind: "inference" },
      { text: "Domestic servicing is Malayalam-first while phone self-service is English-led, pushing routine queries into branches.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank sources its digital stack from vendors and has no product-engineering organisation. A 24x7, multilingual, cross-border servicing capability is precisely the kind of thing it would contract rather than construct, and its scale gives it no path to building one economically.",
    whyNotBuild:
      "Delivering Malayalam and English speech quality, resilient international telephony, orchestration into core banking and remittance tracking, and continuous evaluation of regulated conversations would require an engineering function the bank has never had. The NRI corridor is a distribution and relationship advantage; owning conversational infrastructure adds nothing to it.",
    workflows: [
      {
        name: "Gulf-hours NRI deposit and remittance servicing",
        friction: "An NRI depositor calls from Dubai on a Friday evening about a maturing NRE deposit or an inward remittance and reaches an unstaffed line or an English IVR that cannot help.",
        outcome: "Round-the-clock Malayalam and English servicing that confirms remittance credit, states maturity dates and current rates, and captures renewal instructions in the customer's own hours.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "NRE/NRO deposit module", "Inward remittance / SWIFT tracking", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Malayalam domestic account servicing",
        friction: "Domestic customers calling about balances, statements, cheque status or standing instructions face an English-led IVR and zero out to agents, or simply go to the branch.",
        outcome: "Malayalam conversational servicing that completes the highest-frequency retail requests without human handling.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Statement generation", "Cheque clearing records", "Standing instruction records"],
        value: 2,
        complexity: 1,
      },
      {
        name: "NRI account documentation and mandate changes",
        friction: "Address updates, nominee changes, mandate-holder additions and re-KYC for NRI accounts are handled by email exchanges spanning days and multiple document rejections.",
        outcome: "Guided conversational capture of the request with document requirements explained precisely up front, validation before submission, and status pushed until completion.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Customer master / KYC records", "Document management system", "NRI operations workflow", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Toll-free and international contact numbers staffed in Indian business hours",
        "Mobile banking application with deposit booking, payments and service requests",
        "Internet banking with NRI-specific service forms and remittance tracking",
        "Dedicated NRI relationship desks tied to branch clusters in Kerala",
      ],
      gaps: [
        "No conversational servicing during Gulf evenings and weekends when NRI customers actually call",
        "Malayalam is not offered as a full servicing language on the phone channel",
        "NRI documentation requests are handled asynchronously with repeated rejections",
        "Deposit maturity is notified rather than discussed, losing the retention conversation",
      ],
    },
    risks: [
      "FEMA and repatriation rules constrain what can be said about NRE/NRO treatment; the agent must ground answers in bank policy and escalate anything interpretive.",
      "Cross-border servicing raises data-residency and consent questions alongside DPDP obligations for recorded interactions.",
      "TRAI rules and Gulf-market calling norms both apply to proactive outreach, and permitted contact windows differ by jurisdiction.",
    ],
    economics: {
      volumeMonthly: 750000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Monthly interactions, cost per interaction and automation rate are seller assumptions to be validated against the bank's contact-centre and NRI-desk reporting during discovery.",
    },
    pilotScope:
      "A ten-week pilot on 24x7 NRI deposit and remittance servicing in Malayalam and English for the UAE and Saudi corridors, measured on out-of-hours contacts served and NRE deposit renewal rate.",
    expansion: [
      "Add Malayalam domestic account servicing across the Kerala branch network",
      "Extend to NRI documentation and mandate-change capture with validated submissions",
      "Layer proactive pre-maturity deposit retention outreach timed to each corridor's hours",
    ],
    stakeholders: [
      "Executive Director or Chief Operating Officer",
      "Chief Information Officer / Head of Technology",
      "Head of NRI Business and Global Remittances",
      "Head of Retail Liabilities / Deposits",
      "Head of Customer Experience and Contact Centre",
    ],
    discovery: [
      "What share of NRI contact attempts land outside Indian staffed hours, and what happens to them today?",
      "What is the renewal rate on maturing NRE deposits, and how is the maturity conversation handled?",
      "Is Gulf-hours coverage currently outsourced, and to whom under what terms?",
      "How many NRI documentation requests are rejected on first submission and why?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A nurse in Abu Dhabi calls at 9pm Gulf time about her maturing NRE deposit, hears the current rate in Malayalam, and renews for two years on the call.",
  },

  "csb-bank": {
    operatingContext:
      "CSB Bank is a Thrissur-headquartered private bank, majority-owned by Fairfax-affiliated investors, that has rebuilt itself around a gold-loan-led growth strategy while retaining its historic Kerala deposit franchise and expanding branches into Tamil Nadu, Karnataka, Maharashtra and the north. Gold loans dominate the asset book, which makes its customer interaction pattern fundamentally different from a conventional bank: short-tenure loans, frequent renewals, interest-due notices, top-ups and release coordination mean the same customer is contacted many times a year. Its liability side rests on Kerala household deposits including NRI balances, serviced through branches, a contact centre and a vendor-supplied app. The transformation programme is investor-driven and executed with external technology partners rather than an internal platform team.",
    strategicPressure: [
      { text: "CSB Bank's asset strategy is concentrated in gold loans, a product whose short tenure and renewal cycle generate repeated customer contact by design.", kind: "verified" },
      { text: "Branch expansion beyond Kerala adds Tamil, Kannada, Marathi and Hindi to a servicing model built for Malayalam.", kind: "inference" },
      { text: "Gold-price movement drives top-up eligibility and margin-call style conversations that must happen quickly and be documented.", kind: "inference" },
      { text: "Investor-driven cost discipline means branch productivity per employee is a monitored metric, and renewal telecalling competes directly with origination time.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank's transformation is delivered through external technology partners under an investor-appointed management team focused on book growth and unit economics. There is no internal engineering bench and no strategic reason to create one for a servicing channel.",
    whyNotBuild:
      "A gold-loan bank wins on branch density, valuation discipline and turnaround time. None of that is advanced by owning speech models, telephony or orchestration. The bank would have to fund four unfamiliar engineering disciplines to reach a capability it can contract now and measure inside a quarter.",
    workflows: [
      {
        name: "Gold-loan interest-due and renewal outreach",
        friction: "Interest-due and renewal reminders depend on branch staff calling between customers; coverage is partial, timing is inconsistent, and accounts drift toward overdue for want of a phone call.",
        outcome: "Every due account contacted in the customer's language on schedule, with the exact amount stated, payment taken in-channel, and each attempt logged with its outcome.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan module", "Core banking system", "Payment gateway / UPI collect", "Collections case records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-auction notification and hardship routing",
        friction: "Pre-auction notices are a regulatory obligation executed through letters and inconsistent calls; customers claim non-receipt, and genuine hardship cases are not identified early.",
        outcome: "Documented, provably delivered multilingual notification with acknowledgement captured, and hardship or dispute signals routed immediately to a trained human officer.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan module", "Auction / recovery workflow", "Notice generation and delivery log", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Top-up eligibility and release coordination",
        friction: "Customers ask what additional amount they can draw against pledged ornaments or what is required to release them, and the answer depends on current valuation the branch must look up.",
        outcome: "Eligibility and release amounts explained conversationally with current policy applied, payment or drawdown initiated, and a branch slot booked for the physical handover.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Gold-loan module", "Valuation / LTV policy engine", "Core banking system", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR and limited self-service",
        "Mobile banking application covering deposits, payments and loan servicing",
        "SMS and WhatsApp alerting for interest due and account activity",
        "Branch-led gold-loan servicing with in-person valuation and release",
      ],
      gaps: [
        "Renewal and interest-due outreach is not consistently executed across every due account",
        "Pre-auction notification lacks a provable, acknowledged multilingual delivery trail",
        "Top-up eligibility cannot be self-served; it requires a branch conversation",
        "Languages beyond Malayalam are poorly served as the branch network expands north",
      ],
    },
    risks: [
      "RBI gold-loan directions prescribe notice and communication requirements before auction; automation must strengthen the evidence trail, not weaken it.",
      "Recovery-related communication is subject to fair-practices expectations on tone, timing and frequency, with reputational exposure if breached.",
      "TRAI DND and consent rules apply to high-frequency reminder outreach across a customer base contacted many times per year.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "These volume, cost and automation figures are seller assumptions for framing the case and must be replaced with the bank's own gold-loan servicing and telecalling data.",
    },
    pilotScope:
      "An eight-week pilot on gold-loan interest-due and renewal outreach in Malayalam and Tamil across two clusters, measured on contact coverage of due accounts, on-time renewals and branch hours recovered.",
    expansion: [
      "Add documented pre-auction notification with acknowledgement capture and hardship routing",
      "Extend to top-up eligibility and release coordination with appointment booking",
      "Broaden languages to Kannada, Marathi and Hindi as the northern branch network scales",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Head of Gold Loans / Retail Assets",
      "Chief Information Officer / Head of Technology",
      "Chief Operating Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What proportion of interest-due accounts actually receive a call each cycle today?",
      "How is pre-auction notification evidenced, and have disputed notices caused problems?",
      "How much branch-staff time per week goes to renewal telecalling instead of new business?",
      "Which languages will the northern branch expansion require in the next twelve months?",
    ],
    flowTemplate: "collections",
    scenario: "A gold-loan customer in Thrissur is called in Malayalam three days before interest is due, hears the exact amount, and pays through a WhatsApp link without visiting the branch.",
  },

  "tamilnad-mercantile-bank": {
    operatingContext:
      "Tamilnad Mercantile Bank is a Tuticorin-headquartered private bank with a century-old franchise rooted in the Nadar trading community of southern Tamil Nadu, and a branch network concentrated in the state with selected presence in other metros. Its business is classic old-generation private banking: a sticky retail and trader deposit base, working-capital and term lending to small businesses, gold loans, and retail housing and vehicle credit. Customer relationships are conducted in Tamil, largely by phone to a known branch and by walking in, with the mobile app and internet banking used by a younger urban minority. Since listing, cost ratios and growth have been under public scrutiny while the technology function remains small and vendor-dependent.",
    strategicPressure: [
      { text: "The bank is publicly listed, which subjects its cost-to-income and growth metrics to quarterly external scrutiny it did not face historically.", kind: "verified" },
      { text: "Its customer relationships are Tamil-language and branch-anchored, so any servicing improvement must work on the phone rather than in an app.", kind: "verified" },
      { text: "Trader customers generate daily operational queries — credit confirmation, cheque status, limit availability — that consume branch capacity.", kind: "inference" },
      { text: "A small technology team leaves IVR-era phone servicing in place with no internal path to replace it.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank is profitable and deposit-rich but small in headcount with no engineering organisation. Every capability it adds is procured, and its listed-company cost discipline argues for a contained, measurable deployment rather than a programme.",
    whyNotBuild:
      "There is no internal speech, ML or orchestration capability and no realistic route to acquiring one at this scale. The bank's moat is community trust and local credit knowledge in southern Tamil Nadu; conversational infrastructure is a commodity input it should rent, not manufacture.",
    workflows: [
      {
        name: "Tamil inbound account and deposit servicing",
        friction: "Balance, statement, deposit-maturity and cheque-status queries all end up with a branch employee or an agent because there is no Tamil conversational self-service.",
        outcome: "Tamil-first servicing that completes the highest-frequency retail requests instantly, with statements and certificates delivered in-channel.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Term-deposit module", "Statement and certificate generation", "Cheque clearing records"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Trader credit-confirmation and limit line",
        friction: "Business customers call the branch repeatedly through the day to confirm whether a payment has landed and how much limit remains before releasing goods.",
        outcome: "Authenticated conversational confirmation of credits, balances and drawing power on demand, freeing branch staff from acting as a lookup service.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Cash-credit / working-capital module", "Payments switch records"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Deposit-maturity retention outreach",
        friction: "Maturity is notified by letter and SMS; the rate conversation that decides whether the money stays never happens unless the customer initiates it.",
        outcome: "Proactive Tamil pre-maturity conversation presenting current rates and capturing instructions, defending a deposit base that is the bank's principal asset.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core banking system", "Term-deposit module", "Rate card / product master", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR and minimal self-service depth",
        "Mobile banking and internet banking with deposit booking and payments",
        "SMS alerting and missed-call balance enquiry",
        "Branch-anchored relationship servicing with named officers for trader accounts",
      ],
      gaps: [
        "No Tamil conversational servicing on the phone despite it being the language of nearly every relationship",
        "Credit confirmation and limit queries require a human every time",
        "Deposit maturity produces a notification, not a retention conversation",
        "No proactive status communication on service requests after they are raised",
      ],
    },
    risks: [
      "Post-listing governance changes and leadership transitions can slow decision authority for customer-experience technology.",
      "Disclosing balances and limits requires strong authentication tied to the mandate holder rather than the calling number.",
      "TRAI commercial-communication rules apply to deposit-maturity outreach, which must be framed and consented as service communication.",
    ],
    economics: {
      volumeMonthly: 320000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Volume, cost and automation rate are seller assumptions used only to frame the business case and must be validated with the bank's own contact and branch data.",
    },
    pilotScope:
      "An eight-week pilot on Tamil inbound account and deposit servicing across the southern Tamil Nadu branch cluster, measured on containment rate and reduction in branch-phone interruptions.",
    expansion: [
      "Add authenticated trader credit-confirmation and limit servicing",
      "Layer proactive pre-maturity deposit retention outreach",
      "Extend to retail loan servicing including interest certificates and foreclosure quotes",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Chief Information Officer / Head of IT",
      "Head of Retail Banking and Deposits",
      "Head of Customer Service and Operations",
    ],
    discovery: [
      "Who currently holds decision authority for customer-experience technology after recent leadership changes?",
      "How many inbound calls per branch per day are balance, cheque-status and credit-confirmation queries?",
      "What is the retention rate on maturing term deposits, and is the maturity conversation staffed at all?",
      "What is the split of contact volume between the central contact centre and direct branch phone lines?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A shopkeeper in Tuticorin calls in Tamil to confirm a customer payment has cleared before releasing stock, and gets the credit confirmation in fifteen seconds.",
  },

  "dcb-bank": {
    operatingContext:
      "DCB Bank is a Mumbai-headquartered small private bank whose lending is deliberately concentrated on self-employed and informal-income borrowers — mortgage loans against property, small business loans, commercial vehicle and agri-related credit — sourced through branches in tier-2 and tier-3 towns across Maharashtra, Gujarat, Rajasthan, Madhya Pradesh, Andhra Pradesh and Telangana. This niche is service-intensive by construction: borrowers with informal documentation need repeated help assembling papers, understanding disbursement tranches and managing EMI mechanics. The bank funds itself with retail deposits and runs a lean operation with public commitments to improving its cost-income ratio. Technology is vendor-supplied and integrated by a small internal team; there is no product-engineering organisation.",
    strategicPressure: [
      { text: "The bank's stated strategy targets self-employed and small-business borrowers in tier-2 and tier-3 markets rather than salaried urban customers.", kind: "verified" },
      { text: "Management has publicly emphasised improving the cost-income ratio, which directly implicates servicing and collections cost per account.", kind: "verified" },
      { text: "Informal-income borrowers require more document chasing and more repayment guidance per account than salaried mortgage customers.", kind: "inference" },
      { text: "The geographic spread means servicing must work in Hindi, Marathi, Gujarati and southern languages simultaneously at modest volume per language.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. At DCB's scale, an internal conversational-AI programme is arithmetically indefensible against the cost-income target it has publicly committed to. Its technology is bought and integrated, and a servicing agent would follow the same route with a short payback requirement.",
    whyNotBuild:
      "The bank's differentiation is underwriting informal income in small towns. Building multilingual speech, telephony and orchestration would consume the very cost headroom the strategy depends on, in service of a capability available under contract with transparent per-interaction pricing.",
    workflows: [
      {
        name: "Mortgage document chase and disbursement status",
        friction: "Property and income documents for LAP cases are chased by the sourcing officer over calls and messages; files stall for weeks and borrowers call repeatedly asking when money will arrive.",
        outcome: "Automated multilingual follow-up naming the exact pending document, guiding submission, and pushing disbursement-stage updates so borrowers stop calling to ask.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Disbursement / core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "EMI reminder and early-bucket follow-up",
        friction: "Self-employed borrowers have lumpy cash flows and bounce EMIs for timing reasons; follow-up is done by telecallers on a partial list, late in the cycle, with inconsistent records.",
        outcome: "Policy-timed vernacular reminders before the due date, structured post-bounce conversation with payment capture in-channel, and hardship signals routed to a human collector.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / NACH status", "Collections case management", "Core banking system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Repayment-mechanics guidance for first-time borrowers",
        friction: "Borrowers new to formal credit misunderstand NACH mandates, part-payment effects and prepayment charges, generating avoidable calls and avoidable defaults.",
        outcome: "Grounded conversational explanations in the borrower's language at onboarding and at the first bounce, reducing both call volume and preventable delinquency.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Product and policy knowledge base", "NACH mandate records", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Contact centre with an IVR handling balance, EMI and card queries",
        "Mobile and internet banking with loan account views and payment options",
        "SMS and email alerting for EMI due dates and bounces",
        "Branch and sourcing-officer relationship servicing for loan customers",
      ],
      gaps: [
        "Document chasing has no automated, documented follow-up path",
        "Disbursement stage is opaque to the borrower between sanction and credit",
        "EMI follow-up covers only part of the due base and leaves inconsistent records",
        "No vernacular conversational explanation of repayment mechanics for first-time borrowers",
      ],
    },
    risks: [
      "RBI digital-lending and fair-practices norms govern repayment communication — permitted hours, tone, frequency and full logging of every contact.",
      "Recovery-agent conduct rules apply to any outsourced or automated collections contact and require auditable adherence.",
      "TRAI DND and consent registration constrain outbound reminder volumes and timing.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Monthly volume, cost per interaction and automation rate are seller assumptions for modelling only, to be replaced with the bank's collections and contact-centre MIS in discovery.",
    },
    pilotScope:
      "An eight-week pilot on mortgage document chase and disbursement-status communication in Hindi, Marathi and Gujarati for two regions, measured on file turnaround time and status calls avoided.",
    expansion: [
      "Add pre-due EMI reminders and early-bucket follow-up with in-channel payment capture",
      "Extend to onboarding guidance on repayment mechanics for first-time borrowers",
      "Broaden languages to the southern geographies and add deposit servicing",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Head of Mortgages / Retail Assets",
      "Chief Technology Officer",
      "Head of Collections",
      "Chief Financial Officer (cost-income owner)",
    ],
    discovery: [
      "What is the average time from sanction to disbursement, and how much of it is document-related waiting?",
      "What share of the due base is actually contacted before the EMI date each month?",
      "Has cost-income pressure translated into a funded CX or collections-automation initiative with an owner?",
      "How are collections currently split between in-house telecallers and outsourced agencies?",
    ],
    flowTemplate: "collections",
    scenario: "A shop owner in Ahmedabad who bounced an EMI is called in Gujarati the next morning, agrees a date three days later, and pays through a link on the same conversation.",
  },

  "jammu-kashmir-bank": {
    operatingContext:
      "Jammu & Kashmir Bank is the dominant banking institution in Jammu and Kashmir and Ladakh, majority-owned by the union territory government, and functions as the de facto banking utility for the region — handling government salary and pension disbursement, scheme payments, and the credit needs of the horticulture economy that underpins Kashmir's rural incomes. Its branch network reaches valley and mountain districts where no other bank has comparable presence, serving customers who speak Kashmiri, Dogri, Urdu, Hindi and Punjabi and who overwhelmingly transact in person. Business is strongly seasonal: apple-crop financing, harvest-linked repayments and government-disbursement cycles create sharp peaks in both credit and service demand. The bank also operates branches outside the region, but its identity, and its servicing challenge, are anchored in a geography where staffing and connectivity are genuinely hard.",
    strategicPressure: [
      { text: "The bank is majority-owned by the J&K government and acts as the primary channel for salary, pension and scheme disbursement in the union territory.", kind: "verified" },
      { text: "Horticulture-linked lending ties credit and repayment cycles to the apple harvest, concentrating service demand into short seasonal windows.", kind: "verified" },
      { text: "Geography, weather and periodic connectivity disruption make consistent branch staffing and physical access unreliable in ways other banks do not face.", kind: "inference" },
      { text: "The language mix — Kashmiri, Dogri, Urdu, Hindi — has no off-the-shelf voice coverage, making language feasibility the gating question rather than commercial appetite.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. The bank is government-majority-owned with tender-based procurement and a vendor-delivered technology estate. It has neither the engineering bench nor the ability to hire one, but it does have a genuine operational problem that a partner-delivered capability addresses better than headcount ever could.",
    whyNotBuild:
      "Kashmiri and Dogri speech coverage is a research-grade problem, not a procurement one; if it is hard for a specialist platform it is impossible for a regional bank's IT department. Everything else — telephony, orchestration, evaluation — is equally outside its competency, and PSU-style hiring constraints close off the talent route entirely.",
    workflows: [
      {
        name: "Government disbursement and pension credit enquiry",
        friction: "Around salary, pension and scheme credit dates, branches in the valley are overwhelmed by customers asking whether money has arrived, in weather and travel conditions that make the visit itself costly.",
        outcome: "Credit status, amount and value date confirmed by phone in Urdu or Hindi, with proactive credit-day messaging removing most of the reason to travel to a branch.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core banking system", "Government disbursement / treasury interface", "Pension records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Horticulture crop-loan seasonal servicing",
        friction: "Apple growers need limit, renewal and repayment-schedule information exactly when they are busiest, and the branch officer who knows the file is also processing the season's disbursements.",
        outcome: "Seasonal vernacular servicing for limits, renewal dates, repayment schedules and required documents, absorbing the peak without seasonal hiring.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Agriculture / crop-loan module", "Core banking system", "Scheme and subvention reference data", "Appointment scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Branch-availability and service-continuity information",
        friction: "During weather events or disruptions, customers have no reliable way to learn which branches or ATMs are operating, so they travel and find them closed.",
        outcome: "A live, multilingual information line that reports branch and ATM availability and alternative options, with proactive messaging to affected districts.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Branch and ATM status records", "Core banking system", "Customer geography / district mapping"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR in Urdu, Hindi and English",
        "Mobile banking application with payments and account servicing",
        "Internet banking and an SMS alerting service",
        "Dense branch and business-correspondent presence acting as the primary service channel",
      ],
      gaps: [
        "No conversational servicing in Kashmiri or Dogri, the first languages of much of the customer base",
        "Credit confirmation for salary, pension and scheme payments requires a branch visit for most customers",
        "Crop-loan servicing has no remote path during the season when it is most needed",
        "No reliable channel for branch and ATM availability during disruptions",
      ],
    },
    risks: [
      "Language feasibility is the primary risk: Kashmiri and Dogri speech quality must be benchmarked honestly before any commitment, and the scope may have to start in Urdu and Hindi.",
      "Government-scheme and disbursement servicing carries political and audit sensitivity; every automated answer must be exact and fully logged.",
      "Connectivity variability in the region affects both telephony reliability and any assumption about digital fallback channels.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.9,
      automationRate: 0.45,
      basis: "Volume, unit cost and automation rate are seller assumptions only; the lower automation rate reflects language-coverage uncertainty and must be re-based after a language benchmark.",
    },
    pilotScope:
      "A ten-week pilot on government-disbursement and pension credit enquiry in Urdu and Hindi across Srinagar and Jammu districts, preceded by an explicit Kashmiri and Dogri speech-quality benchmark.",
    expansion: [
      "Add horticulture crop-loan seasonal servicing ahead of the next harvest cycle",
      "Introduce Kashmiri coverage if and only if the benchmark supports production quality",
      "Extend to branch-availability information and proactive district-level disruption messaging",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Executive President / Head of Retail Banking",
      "Chief Information Officer / Head of IT",
      "Head of Government Business and Financial Inclusion",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What are the realistic Kashmiri and Dogri coverage expectations, and would an Urdu and Hindi start be acceptable to the business?",
      "What is the peak-to-average contact ratio around disbursement dates and the harvest season?",
      "How is technology procured — through UT government tender rules or the bank's own board process?",
      "How much branch footfall during credit weeks is purely credit-confirmation enquiry?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An apple grower in Sopore calls in Urdu to check whether his scheme payment has been credited and when his crop-loan renewal falls due, without travelling to the district branch.",
  },

  "au-small-finance-bank": {
    operatingContext:
      "AU Small Finance Bank is India's largest small finance bank, Jaipur-headquartered, built from a vehicle-finance NBFC and now operating a full retail bank with deposits, credit cards, housing and MSME lending alongside its core used-vehicle and commercial-vehicle book. Its absorption of Fincare Small Finance Bank added a microfinance portfolio and a southern branch footprint on top of a franchise historically concentrated in Rajasthan, Gujarat, Madhya Pradesh, Maharashtra and Delhi. The result is a servicing organisation that must simultaneously handle vehicle-loan EMI collections from first-time-credit borrowers, microfinance group repayment cycles, credit-card servicing for an urban base, and deposit relationships — across Hindi, Marwari, Gujarati, Kannada and Tamil. AU is genuinely technology-forward, with an in-house digital bank and app, but its engineering focus sits on core banking, cards and the customer-facing app rather than conversational infrastructure.",
    strategicPressure: [
      { text: "AU completed the acquisition of Fincare Small Finance Bank, adding a microfinance book and a southern branch presence to its northern and western franchise.", kind: "verified" },
      { text: "Merger integration doubles servicing complexity in the short term: two customer bases, two sets of processes, and migration queries on top of business-as-usual volume.", kind: "inference" },
      { text: "Vehicle-finance and microfinance borrowers are collections-intensive by product design, and collections cost scales linearly with book growth unless the contact model changes.", kind: "inference" },
      { text: "As a bank pursuing universal-bank ambitions, cost-to-income and service quality are under both regulatory and investor observation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. AU has real engineering capability and a product culture, which rules out a pure buy-led framing — but that capability is committed to core banking, cards and the app. Conversational servicing and collections across five-plus languages is adjacent work it would rather integrate than originate, especially while absorbing a merger.",
    whyNotBuild:
      "Even a technology-forward bank cannot fund Indic speech quality, telephony operations, multi-language orchestration and a continuous evaluation harness while simultaneously integrating an acquisition and building a credit-card and deposit franchise. The opportunity cost is the binding constraint, not the technical ambition — and collections communication carries regulatory exposure that a contracted, auditable platform handles better than a first-generation internal build.",
    workflows: [
      {
        name: "Vehicle-loan EMI collections and bounce follow-up",
        friction: "Used-vehicle and two-wheeler borrowers bounce EMIs for cash-flow timing reasons; telecalling reaches a fraction of the due base, contact quality varies by caller, and outcomes are recorded inconsistently.",
        outcome: "Every due and bounced account contacted within permitted hours in the borrower's language, payment taken in-channel, promises recorded with automatic follow-up, and hardship routed to a human.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Collections case management", "Payment gateway / UPI collect"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Merger-migration customer servicing",
        friction: "Customers from the acquired entity face changed account identifiers, app credentials, branch mapping and product terms, and call with questions no standard script anticipated.",
        outcome: "A dedicated migration intent that resolves identifier changes, explains what has and has not changed, and completes re-registration steps conversationally in the customer's language.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Core banking system", "Legacy entity account mapping", "Digital channel registration", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Microfinance group repayment coordination",
        friction: "Group-lending repayment depends on loan officers physically coordinating meetings and chasing absentees, consuming field time that should go to sourcing and monitoring.",
        outcome: "Pre-meeting confirmations and missed-payment follow-up handled by voice in the local language, with only genuine escalations routed to the field officer.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Microfinance loan management system", "Group and centre records", "Collections case management", "Field-officer mobile application"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Full-featured mobile banking and digital-banking application with in-app servicing",
        "Contact centre with an IVR and WhatsApp servicing for balance, statement and card queries",
        "Video-KYC and digital account-opening journeys",
        "In-house and outsourced telecalling teams for collections across the loan book",
      ],
      gaps: [
        "Collections contact coverage is capacity-limited — a large share of due accounts is never actually reached",
        "Merger-migrated customers have no dedicated conversational path for identifier and access questions",
        "Microfinance group coordination remains a manual field-officer task",
        "Language coverage on the phone does not span the post-merger north-plus-south footprint",
      ],
    },
    risks: [
      "RBI recovery-agent and fair-practices norms strictly govern collections contact hours, tone, frequency and record-keeping — automation must demonstrably improve compliance evidence.",
      "Digital-lending directions require transparent disclosure and grievance routes in any repayment communication.",
      "Merger integration may freeze new vendor onboarding, or conversely accelerate it where servicing capacity is the bottleneck — the commercial window matters.",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Interaction volume, cost per contact and automation rate are seller assumptions for indicative modelling and must be replaced with AU's collections and contact-centre MIS during discovery.",
    },
    pilotScope:
      "A ten-week pilot on vehicle-loan pre-due reminders and post-bounce follow-up in Hindi, Marwari and Gujarati for two states, measured on contact coverage of the due base, promise-to-pay conversion and cost per resolved account.",
    expansion: [
      "Add merger-migration servicing for the acquired customer base with identifier resolution and re-registration",
      "Extend to microfinance group repayment coordination in Kannada and Tamil",
      "Broaden to deposit, card and inbound account servicing across the full language set",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Chief Technology Officer / Chief Digital Officer",
      "Head of Collections / Chief Credit Officer",
      "Head of Customer Experience and Contact Centre",
      "Head of Microfinance / Inclusive Banking (post-merger portfolio)",
    ],
    discovery: [
      "What share of the monthly due base is actually contacted before the EMI date, and by whom?",
      "How is collections split between in-house telecalling and outsourced agencies, and at what cost per resolved account?",
      "Has the Fincare integration frozen new vendor onboarding, or is servicing capacity an explicit integration bottleneck?",
      "Which languages does the post-merger customer base actually require, and what does the contact centre support today?",
    ],
    flowTemplate: "collections",
    scenario: "A used-tractor borrower in Bikaner whose EMI bounced is reached in Marwari the next morning, commits to pay on Friday, and receives an automatic follow-up when the date arrives.",
  },

  "equitas-small-finance-bank": {
    operatingContext:
      "Equitas Small Finance Bank is a Chennai-headquartered small finance bank that grew out of a microfinance institution and has since diversified into used commercial-vehicle finance, small-business loans against property, affordable housing and MSME lending, funded by a fast-growing retail deposit franchise. Its branch network is concentrated in Tamil Nadu with meaningful presence in Karnataka, Maharashtra and other states, serving borrowers who are drivers, small traders and self-employed households rather than salaried professionals. Servicing motions differ sharply by product: vehicle and small-business loans need individual EMI reminders and bounce follow-up, the legacy microfinance book needs group coordination, and the deposit push needs onboarding and renewal conversations. The bank already outsources significant operational functions and buys its technology from vendors rather than building platforms.",
    strategicPressure: [
      { text: "Equitas has deliberately diversified from microfinance into vehicle finance, small-business loans and housing, each with a distinct servicing motion.", kind: "verified" },
      { text: "A rapidly growing deposit franchise adds onboarding, renewal and servicing contact volume that did not exist in the microfinance-era operating model.", kind: "inference" },
      { text: "Collections across used-CV and small-business books is the dominant recurring operational cost and scales with the book unless the contact model changes.", kind: "inference" },
      { text: "Significant use of outsourced operations signals a management preference for contracted capacity over internal build.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank already sources operational capacity externally and its technology from vendors; there is no product-engineering organisation and no indication of intent to create one. A packaged conversational capability priced per interaction maps directly onto how it already thinks about outsourced telecalling.",
    whyNotBuild:
      "Equitas competes on underwriting informal-income borrowers and on deposit mobilisation. Building Tamil, Kannada and Hindi speech, telephony and orchestration would consume management attention and capital in a domain that produces no competitive advantage, while exposing regulated collections communication to first-generation build risk.",
    workflows: [
      {
        name: "Used-CV and small-business EMI collections",
        friction: "Drivers and small traders bounce EMIs on cash-flow timing; telecallers work a partial list in office hours, when many borrowers are on the road or at their shop, and outcomes are recorded unevenly.",
        outcome: "Full coverage of the due and bounced base within permitted hours in Tamil, Kannada and Hindi, with payment links in-channel, recorded promises and automatic follow-up.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Collections case management", "Payment gateway / UPI collect"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Deposit onboarding and renewal servicing",
        friction: "New deposit customers acquired through branch and digital campaigns need help completing onboarding steps and later face maturity decisions handled only by SMS.",
        outcome: "Guided onboarding completion and proactive pre-maturity conversations in the customer's language, improving both funnel completion and deposit retention.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Core banking system", "Term-deposit module", "Onboarding / KYC workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Legacy microfinance group servicing",
        friction: "Group repayment coordination and absentee follow-up still rely on field officers, whose time is more valuable on sourcing and monitoring than on chasing confirmations.",
        outcome: "Pre-meeting confirmations and missed-payment outreach automated in the local language, with escalation to the officer only where a visit is genuinely warranted.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Microfinance loan management system", "Group / centre records", "Collections case management", "Field-officer mobile application"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Mobile banking and internet banking with account and loan servicing",
        "Contact centre with an IVR covering balance, EMI and card queries",
        "SMS and WhatsApp alerting for EMI dues and transaction activity",
        "In-house and outsourced telecalling teams supporting collections",
      ],
      gaps: [
        "Collections contact coverage is limited by telecaller capacity and office hours",
        "Deposit maturity produces a notification rather than a retention conversation",
        "Group microfinance coordination has no automated layer supporting field officers",
        "No unified conversational channel across the bank's distinct product servicing motions",
      ],
    },
    risks: [
      "RBI recovery-agent and fair-practices norms govern contact hours, frequency, tone and record-keeping for all repayment communication.",
      "Microfinance-specific conduct expectations around borrower protection and hardship handling apply to the legacy book.",
      "TRAI DND and consent registration constrain reminder-call volumes across a large, frequently contacted borrower base.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions for framing only and must be validated against the bank's collections cost per resolved account during discovery.",
    },
    pilotScope:
      "An eight-to-ten week pilot on used-CV and small-business EMI reminders and post-bounce follow-up in Tamil and Kannada, measured on contact coverage, promise-to-pay conversion and cost per resolved account against the current telecalling baseline.",
    expansion: [
      "Add deposit onboarding completion and pre-maturity retention outreach",
      "Extend to legacy microfinance group coordination and absentee follow-up",
      "Broaden to inbound account and loan servicing across all operating states",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Collections / Chief Credit Officer",
      "Chief Technology Officer",
      "Head of Liabilities and Branch Banking",
    ],
    discovery: [
      "Is collections telecalling in-house or outsourced, and what is the current cost per resolved account?",
      "What share of the monthly due base is contacted before the EMI date?",
      "How many deposit onboarding journeys stall incomplete, and is anyone following them up?",
      "How much field-officer time in the legacy microfinance book goes to phone coordination rather than field work?",
    ],
    flowTemplate: "collections",
    scenario: "A used-truck owner near Salem is reached in Tamil the evening after his EMI bounces, agrees to pay from a freight payment due Thursday, and settles through a link in the chat.",
  },

  "ujjivan-small-finance-bank": {
    operatingContext:
      "Ujjivan Small Finance Bank is a Bengaluru-headquartered small finance bank with roots in urban and semi-urban microfinance, operating one of the most genuinely pan-India footprints of any bank its size — Karnataka, Tamil Nadu, West Bengal, Bihar, Maharashtra, Gujarat, Assam and the NCR all matter to its book. Its lending spans group microloans, individual microloans, affordable housing, micro and small enterprise credit and vehicle finance, while a deliberate deposit-mobilisation push has built a retail liability franchise on top. That geographic spread means its servicing must operate in more languages than almost any comparably sized institution, and its borrowers are low-income households with feature phones or basic smartphones for whom voice is the only workable channel. Engineering capacity is committed to core-banking modernisation and digital-channel delivery, with technology largely sourced from vendors.",
    strategicPressure: [
      { text: "Ujjivan operates across a genuinely pan-India footprint spanning southern, eastern, western and northern states with distinct primary languages.", kind: "verified" },
      { text: "Group and individual microloan repayment cycles generate a fixed, recurring communication load every single collection cycle regardless of book performance.", kind: "verified" },
      { text: "The deposit-mobilisation strategy adds a second, very different servicing motion on top of the microfinance operating model.", kind: "inference" },
      { text: "Serving eight or more languages through staffed telecalling is structurally more expensive per language than for a single-state lender.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank's engineering attention is on core-banking transition and digital channels, and its technology is predominantly vendor-sourced. Multilingual conversational servicing is a capability where the number of languages makes buying dramatically cheaper than building, since one platform deployment covers what would otherwise be eight separate staffing problems.",
    whyNotBuild:
      "Building would mean acquiring speech quality in Kannada, Tamil, Bengali, Hindi, Marathi, Assamese and more, plus telephony and orchestration — an undertaking no bank of this size can justify. The language breadth that makes the opportunity valuable is exactly what makes a build impossible.",
    workflows: [
      {
        name: "Microloan repayment reminders across eight-plus languages",
        friction: "Repayment reminders depend on field officers and telecallers who each cover one or two languages, so coverage varies by state and the borrowers hardest to reach get contacted least.",
        outcome: "Every borrower reached in their own language on schedule, with payment options explained, confirmations captured and every attempt logged for audit.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Microfinance loan management system", "Group / centre records", "Payment gateway / collection records", "Collections case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Group-meeting coordination and absentee follow-up",
        friction: "Centre meetings require confirmation calls and absentee chasing that consume a large share of field-officer time, reducing the customer visits that actually drive portfolio quality.",
        outcome: "Automated pre-meeting confirmation and same-day absentee follow-up, returning field-officer hours to sourcing and monitoring.",
        channels: ["Voice", "SMS"],
        systems: ["Microfinance loan management system", "Centre and meeting schedules", "Field-officer mobile application", "Collections case management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Deposit customer onboarding and servicing",
        friction: "Deposit customers acquired through branches and campaigns stall mid-onboarding or call with balance, maturity and access questions that reach an IVR built for loan servicing.",
        outcome: "Guided onboarding completion and full vernacular deposit servicing on the same platform, supporting the liability strategy without a separate contact-centre build.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Core banking system", "Term-deposit module", "Onboarding / KYC workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Mobile banking application and internet banking for deposit and loan customers",
        "Contact centre with an IVR covering a limited subset of the bank's operating languages",
        "SMS and voice-blast reminders for repayment cycles",
        "Large field-officer network conducting in-person group and individual collection",
      ],
      gaps: [
        "Most operating languages have no conversational servicing on the phone channel",
        "Reminder coverage is uneven across states because it depends on locally staffed callers",
        "Group-meeting coordination is entirely manual field work",
        "Deposit customers are served by an infrastructure designed around lending, not liabilities",
      ],
    },
    risks: [
      "Microfinance conduct norms and RBI fair-practices expectations govern borrower communication, hardship handling and contact frequency for a vulnerable customer base.",
      "Recovery-agent rules apply to any outsourced or automated repayment contact and require auditable adherence to permitted hours and language.",
      "DPDP consent and comprehension standards are harder to satisfy with low-literacy borrowers and need deliberate design in each language.",
    ],
    economics: {
      volumeMonthly: 1600000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for indicative modelling; the bank's own reminder-call economics and language mix should replace them in discovery.",
    },
    pilotScope:
      "A ten-week pilot on microloan repayment reminders in Kannada, Bengali and Hindi across three states, measured on contact coverage of the due base, on-time repayment rate and field-officer hours recovered.",
    expansion: [
      "Add group-meeting confirmation and absentee follow-up in the same languages",
      "Extend language coverage to Tamil, Marathi, Assamese and Odia across the full footprint",
      "Broaden to deposit onboarding completion and vernacular deposit servicing",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Chief Business Officer, Microfinance / Inclusive Banking",
      "Chief Technology Officer / Chief Digital Officer",
      "Head of Collections and Credit Administration",
    ],
    discovery: [
      "What is the actual language mix of the active borrower base, and how many are supported by the contact centre today?",
      "What does a reminder call cost today, and what proportion of due borrowers receive one?",
      "How many hours per week does a field officer spend on phone coordination versus field visits?",
      "Where does the deposit-servicing load sit organisationally, and is it measured separately from lending servicing?",
    ],
    flowTemplate: "collections",
    scenario: "A group borrower in Murshidabad receives a Bengali reminder two days before her centre meeting, confirms attendance, and gets a payment link when she asks to pay early.",
  },

  "jana-small-finance-bank": {
    operatingContext:
      "Jana Small Finance Bank is a Bengaluru-headquartered small finance bank, listed in recent years, that is deliberately transitioning its book from unsecured group microfinance toward secured lending — affordable housing, loans against property, gold loans and MSME credit — while building a retail deposit base. That transition changes the servicing model fundamentally: group-based field collection gives way to individual EMI schedules, document-heavy origination and long-tenure relationships that need statements, certificates and foreclosure quotes. Its operations span Karnataka, Tamil Nadu, Maharashtra, the Hindi belt and elsewhere, serving self-employed and informal-income customers who transact by phone and at branches. Listed-company scrutiny of its cost-income trajectory sharpens every operational decision, and its technology stack is vendor-assembled with no history of internal platform development.",
    strategicPressure: [
      { text: "Jana is publicly executing a shift from unsecured microfinance toward a majority-secured loan book.", kind: "verified" },
      { text: "Listing exposes its cost-income ratio and asset quality to quarterly market scrutiny, raising the value of servicing efficiency.", kind: "verified" },
      { text: "The secured transition replaces group field collection with individual EMI and document servicing, a motion its operating model was not originally built for.", kind: "inference" },
      { text: "Sector-wide microfinance stress increases the collections and hardship-conversation load on the residual unsecured book while the transition proceeds.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank has no history of internal platform builds and its stack is assembled from vendors. Mid-transition, with cost ratios under external scrutiny, it needs contracted capacity with visible unit economics rather than a development programme.",
    whyNotBuild:
      "Managing a book transition, an asset-quality cycle and a listed-company cost narrative simultaneously leaves no capacity to stand up speech, telephony and orchestration engineering. The capability is available under contract at a per-interaction price that can be compared directly to the telecalling cost it replaces.",
    workflows: [
      {
        name: "Secured-loan EMI reminders and collection",
        friction: "As the book shifts secured, individual EMI follow-up replaces group meetings, but the bank still relies on telecallers who reach a fraction of the due base within office hours.",
        outcome: "Full coverage of the due base in the borrower's language with payment capture in-channel, recorded promises and automatic follow-up on broken commitments.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Payment gateway / UPI collect", "Collections case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Secured-loan document and disbursement servicing",
        friction: "Housing and LAP borrowers need property and income documents chased and want to know where their disbursement stands; both are handled by the sourcing officer between sales activities.",
        outcome: "Automated multilingual document follow-up naming exactly what is pending, with disbursement-stage updates pushed so borrowers stop calling to ask.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Core banking / disbursement", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Microfinance hardship identification and routing",
        friction: "In a stressed unsecured book, distinguishing willful default from genuine hardship happens inconsistently and late, and vulnerable borrowers receive the same script as everyone else.",
        outcome: "Structured early conversations that surface hardship signals and route those cases immediately to trained human officers with the full transcript, protecting both the borrower and the bank's conduct record.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Microfinance loan management system", "Collections case management", "Restructuring / hardship workflow", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Mobile banking and internet banking for deposit and loan customers",
        "Contact centre with an IVR covering balance, EMI and basic servicing",
        "SMS and voice-blast repayment reminders",
        "Branch and field-officer network handling collections and customer contact",
      ],
      gaps: [
        "Individual EMI follow-up is capacity-limited and misses much of the due base",
        "Document and disbursement status has no self-service path for secured borrowers",
        "Hardship identification is inconsistent and depends on which caller makes contact",
        "Vernacular conversational servicing is unavailable beyond a narrow IVR",
      ],
    },
    risks: [
      "RBI recovery-agent and fair-practices norms apply with particular force to a microfinance-heritage book under stress; conduct evidence matters as much as recovery.",
      "Digital-lending directions require clear disclosure and accessible grievance routes in all repayment communication.",
      "Listed-company disclosure means any conduct failure in automated collections becomes a public issue quickly.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.95,
      automationRate: 0.6,
      basis: "All economics are seller assumptions used for framing; the bank's collections cost per resolved account and current contact coverage should replace them during discovery.",
    },
    pilotScope:
      "An eight-week pilot on secured-loan EMI reminders and post-bounce follow-up in Kannada, Tamil and Hindi for two states, measured on contact coverage, promise-to-pay conversion and cost per resolved account.",
    expansion: [
      "Add hardship identification and routing across the residual unsecured book",
      "Extend to secured-loan document chase and disbursement-status communication",
      "Broaden to deposit servicing and inbound account queries across the network",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Collections / Chief Credit Officer",
      "Chief Technology Officer",
      "Chief Financial Officer (cost-income owner post-listing)",
    ],
    discovery: [
      "How fast is the secured-book transition moving, and how is collections capacity being reallocated?",
      "What is the current cost per resolved account, and how much of the due base is contacted each cycle?",
      "How are hardship cases identified today, and is there a documented routing process?",
      "Where does collections and servicing cost surface in the reported cost-income ratio?",
    ],
    flowTemplate: "collections",
    scenario: "A shopkeeper in Hubli with a loan against property is reminded in Kannada two days before his EMI, pays through the link, and never becomes a collections case.",
  },

  "utkarsh-small-finance-bank": {
    operatingContext:
      "Utkarsh Small Finance Bank is headquartered in Varanasi and concentrated in Uttar Pradesh and Bihar, with additional presence in Jharkhand, Madhya Pradesh and other states — the most populous, most Hindi-speaking and least digitally banked belt in India. Its book remains weighted toward joint-liability group microfinance with a growing share of secured retail, MSME and housing credit, funded by branch-sourced retail deposits. The customer base is rural and semi-urban households whose phones are shared, often basic, and whose interaction with the bank happens through a field officer at a centre meeting or at a branch counter. Every repayment cycle generates a fixed volume of confirmation, reminder and follow-up communication, and the bank's lean technology organisation buys its platforms rather than building them.",
    strategicPressure: [
      { text: "The bank's footprint is concentrated in Uttar Pradesh and Bihar, where vernacular Hindi is the only viable service language and app adoption is minimal.", kind: "verified" },
      { text: "A microfinance-weighted book means repayment communication is a fixed operating cost tied to the number of borrowers, not the value of the book.", kind: "verified" },
      { text: "Eastern-UP and Bihar Hindi carries dialect variation that generic Hindi speech models handle unevenly, making dialect tolerance a real deployment question.", kind: "inference" },
      { text: "Post-listing cost scrutiny and sector-wide microfinance stress both push toward contact models that do not scale with headcount.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. A lean technology organisation, a recent listing and a microfinance-heavy book leave neither the capital nor the talent pipeline for internal platform development. The bank buys operational tooling and would treat a voice agent the same way — as contracted capacity measured against telecalling cost.",
    whyNotBuild:
      "Dialect-robust Hindi speech, telephony at rural connectivity quality, orchestration into the microfinance loan system and continuous evaluation of borrower conversations are four capabilities the bank has no route to. Its advantage is field density in the Hindi belt; nothing about owning speech infrastructure strengthens it.",
    workflows: [
      {
        name: "Microloan repayment reminders in Hindi-belt vernacular",
        friction: "Reminders depend on field officers and a small telecalling team; coverage is partial, calls happen when the officer has time rather than when the borrower can talk, and outcomes are recorded on paper or not at all.",
        outcome: "Every due borrower contacted on schedule in the dialect they actually speak, payment options explained, confirmations captured, and each attempt logged for audit.",
        channels: ["Voice", "SMS"],
        systems: ["Microfinance loan management system", "Group / centre records", "Collection and payment records", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Centre-meeting confirmation and absentee follow-up",
        friction: "Officers spend hours confirming meeting attendance and chasing absentees by phone, time that should go to sourcing and portfolio monitoring.",
        outcome: "Automated pre-meeting confirmation and same-day absentee outreach, escalating to the officer only when a visit is genuinely required.",
        channels: ["Voice", "SMS"],
        systems: ["Microfinance loan management system", "Centre and meeting schedules", "Collections case management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Deposit and account servicing for branch customers",
        friction: "Deposit customers call the branch for balances, maturity dates and passbook queries; the branch answers between counter transactions with no phone self-service alternative.",
        outcome: "Hindi conversational servicing for balance, maturity, statement and cheque-status requests, removing the simplest queries from branch workload.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core banking system", "Term-deposit module", "Statement generation"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Contact centre with a Hindi and English IVR covering basic enquiries",
        "Mobile banking application used mainly by urban deposit customers",
        "SMS reminders and alerts for repayment cycles and transactions",
        "Field-officer network conducting centre meetings and in-person collection",
      ],
      gaps: [
        "No conversational reminder capability that reaches every due borrower in dialect",
        "Centre-meeting coordination is entirely manual officer work",
        "Branch phone lines carry deposit queries with no self-service alternative",
        "Contact outcomes for repayment communication are not systematically captured",
      ],
    },
    risks: [
      "Microfinance conduct norms and RBI fair-practices expectations govern the tone, timing and frequency of borrower contact with a vulnerable population.",
      "Dialect performance for eastern-UP and Bihar Hindi must be benchmarked before commitment — it is the single largest technical risk in this account.",
      "DPDP consent must be obtainable and comprehensible for low-literacy borrowers, often on shared handsets.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Volume, cost and automation rate are seller assumptions for indicative modelling only, to be validated against the bank's reminder-call economics and borrower contactability data.",
    },
    pilotScope:
      "An eight-week pilot on microloan repayment reminders in eastern-UP Hindi across two regions, preceded by a dialect benchmark, measured on contact coverage of the due base and on-time repayment.",
    expansion: [
      "Add centre-meeting confirmation and absentee follow-up to free field-officer time",
      "Extend to deposit and account servicing on branch phone lines",
      "Layer hardship identification and routing across the stressed portion of the book",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Microbanking / Inclusive Finance",
      "Chief Technology Officer",
      "Head of Collections and Credit Administration",
    ],
    discovery: [
      "How does generic Hindi speech perform on recorded eastern-UP and Bihar borrower calls — can we benchmark on real audio?",
      "What proportion of due borrowers actually receive a reminder call each cycle?",
      "What share of borrowers own the handset they are reached on, and how does that affect consent and privacy design?",
      "How much field-officer time per week goes to phone coordination rather than field work?",
    ],
    flowTemplate: "collections",
    scenario: "A borrower in Ghazipur receives a Bhojpuri-inflected Hindi reminder the evening before her centre meeting, confirms she will attend, and asks how to pay two instalments together.",
  },

  "esaf-small-finance-bank": {
    operatingContext:
      "ESAF Small Finance Bank is a Thrissur-headquartered small finance bank with a social-banking heritage, serving low-income microfinance customers concentrated in Kerala and Tamil Nadu with expansion into other states, while simultaneously building an NRI-linked deposit franchise drawing on Kerala's Gulf migration. That pairing is unusual: rural, vernacular, high-frequency repayment communication on the asset side, and time-zone-spanning deposit servicing on the liability side. Its microfinance book has carried asset-quality stress in line with the broader sector, which has intensified collections and hardship-conversation workload on a field organisation already stretched. The bank's technology is vendor-sourced, its scale is modest, and its mission focus keeps management attention on borrower outcomes and cost control rather than platform investment.",
    strategicPressure: [
      { text: "ESAF's core book is microfinance lending to low-income households, primarily in Kerala and Tamil Nadu, with a stated social-banking mission.", kind: "verified" },
      { text: "Sector-wide microfinance asset-quality stress has increased collections and hardship-handling workload relative to normal cycles.", kind: "inference" },
      { text: "The NRI-linked deposit base requires servicing during Gulf hours that Indian-shift staffing does not cover.", kind: "inference" },
      { text: "A social-mission identity makes conduct quality in collections communication a reputational as well as regulatory issue.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank's scale, mission focus and vendor-sourced technology estate leave no room for internal AI development. It needs collections capacity that is documentably respectful and auditable, and that is a contracted-platform proposition.",
    whyNotBuild:
      "Malayalam and Tamil speech quality, telephony, orchestration into the microfinance system and evaluation of every borrower conversation would each be a first for the bank. Given asset-quality pressure, management attention is the scarcest resource of all, and a build would consume it for years before producing anything.",
    workflows: [
      {
        name: "Microloan collections with hardship detection",
        friction: "Stressed accounts are worked by field officers and telecallers using the same script for everyone; genuine hardship is identified late, and conduct quality varies by individual caller.",
        outcome: "Structured, respectful vernacular conversations that capture the actual repayment constraint, offer policy-bounded options, and route hardship and vulnerability signals immediately to trained human officers with full transcripts.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Microfinance loan management system", "Collections case management", "Restructuring / hardship workflow", "Payment gateway / collection records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Routine repayment reminders and confirmations",
        friction: "Pre-due reminders reach only part of the borrower base and depend on locally staffed callers, so coverage differs sharply between Kerala and expansion states.",
        outcome: "Complete, on-schedule reminder coverage in Malayalam, Tamil and Hindi with payment guidance and logged outcomes for every attempt.",
        channels: ["Voice", "SMS"],
        systems: ["Microfinance loan management system", "Group / centre records", "Payment records", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "NRI deposit servicing in Gulf hours",
        friction: "Gulf-based depositors call in their evenings about deposit maturity, remittance credit and account access, and reach an unstaffed line or an Indian-hours desk.",
        outcome: "Round-the-clock Malayalam and English deposit servicing that confirms credits, states maturity terms and captures renewal instructions in the customer's own hours.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "NRE/NRO deposit module", "Inward remittance tracking", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Contact centre with an IVR in Malayalam, Tamil, Hindi and English at limited depth",
        "Mobile banking application for deposit and loan customers",
        "SMS reminders and alerts across repayment cycles",
        "Large field-officer network conducting group meetings and in-person collection",
      ],
      gaps: [
        "No systematic hardship detection layer in collections conversations",
        "Reminder coverage varies by geography because it depends on locally staffed callers",
        "NRI deposit customers are unserved outside Indian business hours",
        "Collections contact quality and outcome are not consistently evidenced",
      ],
    },
    risks: [
      "Microfinance conduct norms and RBI fair-practices expectations are strict on tone, timing and treatment of vulnerable borrowers, and a social-mission bank carries extra reputational exposure.",
      "Recovery-agent rules apply to automated contact and require auditable adherence to permitted hours and language.",
      "Asset-quality stress may constrain discretionary spend, so the pilot must be sized to pay back within a quarter.",
    ],
    economics: {
      volumeMonthly: 550000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "These figures are seller assumptions for framing only; the bank's collections cost per resolved account and current contact coverage must replace them in discovery.",
    },
    pilotScope:
      "An eight-week pilot on microloan collections with hardship detection and routing in Malayalam and Tamil for two stressed regions, measured on contact coverage, resolution rate and documented hardship escalations.",
    expansion: [
      "Extend routine repayment reminders to the full borrower base and expansion-state languages",
      "Add NRI deposit servicing coverage for Gulf hours",
      "Layer deposit-maturity retention outreach on the same deployment",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Microfinance / Inclusive Banking",
      "Chief Technology Officer",
      "Head of Collections and Recovery",
    ],
    discovery: [
      "How is hardship identified and escalated today, and is the process documented?",
      "What share of due borrowers receive a reminder call each cycle, and how does it vary by state?",
      "Is Gulf-hours deposit servicing covered by anyone today, or does it simply go unanswered?",
      "Does asset-quality stress permit new vendor spend this cycle, and under what payback expectation?",
    ],
    flowTemplate: "collections",
    scenario: "A borrower in Palakkad whose husband lost work is called in Malayalam, describes the situation, and is routed within the same conversation to a hardship officer with the full transcript.",
  },

  "suryoday-small-finance-bank": {
    operatingContext:
      "Suryoday Small Finance Bank is a Navi Mumbai-headquartered small finance bank serving inclusive-finance customers with a book weighted toward joint-liability group microfinance, micro-mortgages, commercial-vehicle finance and small-business loans, concentrated in Maharashtra, Tamil Nadu, Odisha and other states. Its deposit franchise is retail-branch-sourced and modest relative to its lending. The customer base — low-income households and micro-entrepreneurs — is reached through field officers, centre meetings and branch counters rather than digital channels, and repayment communication is the dominant recurring operational task in the bank. With a small balance sheet, every rupee of collections cost matters directly to profitability, and staffed telecalling scales in lockstep with borrower count. Technology is assembled from vendors with no internal conversational-AI capability.",
    strategicPressure: [
      { text: "The bank's book is concentrated in inclusive-finance products — JLG microfinance, micro-mortgages and small-ticket vehicle and business loans.", kind: "verified" },
      { text: "At its balance-sheet size, collections cost per account has an unusually direct effect on reported profitability.", kind: "inference" },
      { text: "Its three core geographies require Marathi, Tamil and Odia, a combination that makes staffed multilingual telecalling structurally expensive.", kind: "verified" },
      { text: "Collections capacity may be a practical constraint on how fast the book can grow, not just a cost line.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A small bank assembling its stack from vendors, with no engineering bench, will contract communications capacity rather than develop it. The decision will be made on cost per resolved account against the current telecalling baseline.",
    whyNotBuild:
      "Marathi, Tamil and Odia speech quality alone would require capability the bank cannot buy talent for, let alone telephony and orchestration. The build cost would exceed several years of the collections budget it is trying to compress.",
    workflows: [
      {
        name: "Micro-mortgage and JLG repayment reminders",
        friction: "Reminders depend on field officers and a small telecalling team working within office hours; coverage is partial and skews toward the accounts easiest to reach rather than those most at risk.",
        outcome: "Complete pre-due coverage in Marathi, Tamil and Odia with payment options in-channel, recorded confirmations and automatic follow-up on broken promises.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Loan management system", "Microfinance / group records", "Payment gateway / collection records", "Collections case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Early-bucket delinquency conversations",
        friction: "Once an account bounces, the first meaningful conversation may be days later and conducted by whoever is available, with inconsistent quality and no structured capture of the reason.",
        outcome: "Next-day structured conversation that captures the actual repayment constraint, offers policy-bounded arrangements, and escalates hardship to a human collector with context.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Collections case management", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Vehicle and small-business loan servicing queries",
        friction: "Borrowers call branches to ask about outstanding balance, next due date, NOC after closure and part-payment effects; branch staff answer between counter duties.",
        outcome: "Vernacular self-service for balance, schedule, closure and NOC queries, freeing branch capacity and giving borrowers answers after hours.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Core banking system", "NOC / closure workflow", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Contact centre with an IVR covering basic loan and deposit enquiries",
        "Mobile banking application for deposit customers",
        "SMS reminders and alerts across repayment cycles",
        "Field-officer network conducting group meetings and in-person collection",
      ],
      gaps: [
        "Reminder coverage does not reach the whole due base in every language",
        "Post-bounce conversations are late and inconsistently structured",
        "Loan servicing queries have no after-hours or self-service path",
        "Contact outcomes are not captured in a form that supports collections analytics",
      ],
    },
    risks: [
      "RBI recovery-agent and fair-practices norms govern all repayment contact, with particular sensitivity for microfinance borrowers.",
      "TRAI DND and consent registration limit reminder frequency across a base contacted every cycle.",
      "At this balance-sheet size, the pilot must show payback quickly or it will not survive the next budget review.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for modelling only and must be validated against the bank's collections cost per resolved account.",
    },
    pilotScope:
      "An eight-week pilot on micro-mortgage and JLG pre-due reminders plus next-day bounce follow-up in Marathi and Tamil, measured on contact coverage, on-time repayment and cost per resolved account.",
    expansion: [
      "Add Odia coverage and extend to the eastern geography",
      "Layer structured early-bucket delinquency conversations with hardship routing",
      "Extend to inbound vehicle and small-business loan servicing including NOC and closure",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Technology Officer",
      "Chief Financial Officer",
    ],
    discovery: [
      "Is collections capacity currently the binding constraint on book growth, or purely a cost line?",
      "What is the present cost per resolved account, split between field and telecalling?",
      "What proportion of the due base receives a pre-due reminder in each of the three core languages?",
      "How quickly does the first conversation happen after a bounce today?",
    ],
    flowTemplate: "collections",
    scenario: "A micro-mortgage borrower in Bhubaneswar is reminded in Odia three days before her instalment, pays through a link, and avoids a field visit that would have cost the bank more than the EMI margin.",
  },

  "capital-small-finance-bank": {
    operatingContext:
      "Capital Small Finance Bank, headquartered in Jalandhar, was India's first small finance bank and behaves far more like an old-generation private bank than a microlender: its book is predominantly secured — agriculture and Kisan Credit Card lending, mortgage and trade loans — funded by a stable, low-cost retail deposit base drawn from Punjab's farming and trading households. Its branch network is concentrated in Punjab with presence in neighbouring states, and its customers are Punjabi-speaking depositors and borrowers who value branch relationships and phone contact over apps. A significant slice of its deposit franchise is linked to the Punjabi diaspora in Canada, the UK and the Gulf, who need account and deposit servicing across time zones. The bank is small, profitable and conservatively run, with technology sourced entirely from vendors.",
    strategicPressure: [
      { text: "The bank's book is predominantly secured and agriculture-linked, with Punjab's farming and trading community as its core customer base.", kind: "verified" },
      { text: "Punjabi is the working language of nearly every customer relationship, while digital and phone self-service default to Hindi and English.", kind: "inference" },
      { text: "Diaspora-linked deposits generate servicing demand from Canadian, UK and Gulf time zones that Indian staffed hours miss entirely.", kind: "inference" },
      { text: "At its size, the bank's CX budget is small enough that any proposal must be priced for a genuinely small deployment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank is far too small to build anything and sources all technology from vendors. Its decision will hinge on Punjabi voice quality and on a commercial structure that fits a bank of its size rather than on strategic platform considerations.",
    whyNotBuild:
      "There is no internal technology function capable of developing speech or orchestration, and no plausible business case at this balance-sheet size. Everything about the account argues for a clean packaged deployment with a small, well-defined scope.",
    workflows: [
      {
        name: "Punjabi deposit and account servicing",
        friction: "Depositors call the branch for balance, maturity, cheque-status and passbook queries in Punjabi and get whichever staff member is free; the IVR does not serve their language at all.",
        outcome: "Punjabi conversational servicing that completes the highest-frequency deposit and account requests instantly, with certificates and statements delivered in-channel.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Core banking system", "Term-deposit module", "Statement and certificate generation", "Cheque clearing records"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Kisan Credit Card renewal and limit servicing",
        friction: "Farmers ask about KCC renewal dates, drawing limits, interest subvention eligibility and required documents at the branch counter during the busiest agricultural windows.",
        outcome: "Seasonal vernacular servicing for renewal dates, limits, subvention conditions and documentation, with branch appointments booked only where physically necessary.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Agriculture loan / KCC module", "Core banking system", "Scheme and subvention reference data", "Appointment scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Diaspora deposit servicing across time zones",
        friction: "NRI depositors in Canada, the UK and the Gulf call outside Indian hours about maturity, remittance credit and mandate questions and reach nobody.",
        outcome: "24x7 Punjabi and English servicing that confirms credits, states maturity terms and captures instructions in the customer's own working hours.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Core banking system", "NRE/NRO deposit module", "Inward remittance tracking", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Contact centre with a small IVR in Hindi and English",
        "Mobile banking and internet banking with deposit booking and payments",
        "SMS alerting and missed-call balance enquiry",
        "Branch-anchored relationship servicing with named officers for farming and trade customers",
      ],
      gaps: [
        "Punjabi is not available anywhere in the phone self-service channel",
        "KCC and agriculture servicing requires a branch visit for routine information",
        "Diaspora depositors have no servicing coverage outside Indian business hours",
        "No proactive maturity or renewal conversation at the moment the customer decides",
      ],
    },
    risks: [
      "Punjabi speech quality must be benchmarked before commitment — it is the entire value proposition for this bank.",
      "Agriculture-scheme information such as interest subvention must be exactly right; errors create both customer and audit exposure.",
      "At this bank's size, commercial structure is a genuine risk: a standard enterprise price point will simply not be affordable.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "These volume, cost and automation figures are seller assumptions for indicative modelling and require validation against the bank's small-scale contact and branch data.",
    },
    pilotScope:
      "An eight-week pilot on Punjabi deposit and account servicing across the Jalandhar and Ludhiana clusters, preceded by a Punjabi voice-quality benchmark, measured on containment and branch calls deflected.",
    expansion: [
      "Add KCC renewal and limit servicing ahead of the agricultural season",
      "Extend to diaspora deposit servicing with 24x7 coverage",
      "Layer proactive deposit-maturity retention outreach in Punjabi",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Information Technology",
      "Head of Retail Banking and Deposits",
      "Head of Agriculture and Rural Banking",
    ],
    discovery: [
      "How does Punjabi speech quality benchmark on the bank's own recorded customer calls?",
      "What is the realistic annual CX technology budget at this balance-sheet size?",
      "What share of branch counter time is spent on routine deposit and KCC information?",
      "How large is the diaspora-linked deposit book and how is it serviced today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A farmer near Ludhiana calls in Punjabi to confirm his KCC renewal date and drawing limit before buying seed, and gets both without leaving the field.",
  },

  "airtel-payments-bank": {
    operatingContext:
      "Airtel Payments Bank is a profitable payments bank built on Bharti Airtel's distribution, offering savings accounts with deposit limits, digital payments, AePS-based cash-in and cash-out, bill payments, remittances and insurance distribution to a mass-market customer base. Its reach depends on an enormous banking-correspondent and retailer network — small shop owners across urban and rural India who perform assisted transactions for walk-in customers and who are themselves a demanding support constituency with settlement, commission, device and transaction-failure queries. Customer ticket values are tiny while transaction counts are telecom-scale, so any assisted-service contact costs a multiple of the revenue on the underlying transaction. Airtel has genuine engineering depth in its digital and telecom businesses, but the bank's correspondent-support workload is a bounded operational problem rather than a core-platform priority.",
    strategicPressure: [
      { text: "Airtel Payments Bank operates through a very large banking-correspondent and retailer network that delivers assisted banking at the last mile.", kind: "verified" },
      { text: "Tiny per-transaction economics make every human-assisted support contact structurally unprofitable relative to the transaction that triggered it.", kind: "verified" },
      { text: "Correspondent retention depends on how quickly settlement, commission and failed-transaction issues get resolved, since retailers have competing options.", kind: "inference" },
      { text: "AePS and UPI transaction failures carry regulator-defined reversal timelines, so support quality has a compliance dimension as well as a service one.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Co-build. Airtel has real engineering capability and would not accept a black-box deployment, but correspondent and customer support automation is peripheral to what its teams prioritise. The realistic shape is a jointly designed deployment where the platform provides speech, orchestration and evaluation while Airtel owns integration into its switch, correspondent platform and identity stack.",
    whyNotBuild:
      "Even with capable engineers, Airtel's digital teams are committed to consumer app, payments and telecom priorities. Indic speech quality across the languages its retailer network speaks, plus a continuously evaluated conversational layer, is not something it would build from scratch when it can integrate one — and a joint model preserves its control over the parts that matter to it.",
    workflows: [
      {
        name: "Banking-correspondent transaction and settlement support",
        friction: "A retailer whose AePS withdrawal failed or whose settlement did not land calls a support line and waits, unable to serve customers in the meantime, while his own float is stuck.",
        outcome: "Immediate authenticated resolution of transaction status, settlement timing and reversal expectations in the retailer's language, with escalation only for genuine exceptions.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Correspondent / retailer management platform", "AePS and UPI switch logs", "Settlement and float records", "Ticketing system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Customer failed-transfer and reversal enquiry",
        friction: "Mass-market customers whose transfer or withdrawal failed call repeatedly to ask where their money is; each contact costs more than the transaction earned.",
        outcome: "Instant, grounded status on the transaction and reversal timeline in the customer's language, with proactive notification when the reversal completes.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Core banking / wallet ledger", "UPI and AePS switch logs", "Dispute workflow", "Notification services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Correspondent commission and onboarding queries",
        friction: "Retailers ask how commission was calculated, why a payout differs from expectation, and what is needed to activate new services; answers come from field managers when they visit.",
        outcome: "Self-service explanation of commission computation, payout status and activation requirements, keeping the retailer network productive without field-manager dependency.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Correspondent management platform", "Commission engine / payout records", "Onboarding and KYC workflow", "Ticketing system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer app and USSD-based access for mass-market banking services",
        "Retailer and correspondent application with transaction and settlement views",
        "Contact centre and IVR for customer and retailer support",
        "SMS and in-app notification for transactions and reversals",
      ],
      gaps: [
        "Retailers cannot resolve settlement and failed-transaction questions without waiting in a support queue",
        "Reversal status is not proactively communicated as it progresses",
        "Commission disputes require human explanation every time",
        "Language coverage on support channels lags the linguistic spread of the retailer network",
      ],
    },
    risks: [
      "RBI's harmonised turnaround-time framework for failed transactions imposes reversal and compensation deadlines that automated support must respect and evidence.",
      "Payments-bank operating restrictions shape what can be offered and said, and any automated response must stay strictly within them.",
      "Airtel's internal digital teams may claim ownership of conversational servicing; the partnership boundary must be agreed before any technical work.",
    ],
    economics: {
      volumeMonthly: 6000000,
      costPerInteraction: 0.8,
      automationRate: 0.65,
      basis: "Interaction volume, unit cost and automation rate are seller assumptions used to scale the case and must be replaced with Airtel Payments Bank's own support-contact reporting.",
    },
    pilotScope:
      "A ten-week pilot on banking-correspondent transaction and settlement support in Hindi, Bengali and Tamil for a defined retailer cohort, measured on resolution without human handling and retailer downtime avoided.",
    expansion: [
      "Extend to customer failed-transfer and reversal enquiry with proactive completion notification",
      "Add commission, payout and service-activation self-service for the retailer network",
      "Broaden language coverage across the full national correspondent footprint",
    ],
    stakeholders: [
      "Chief Executive Officer, Airtel Payments Bank",
      "Chief Technology Officer / Head of Engineering",
      "Head of Distribution and Banking Correspondent Network",
      "Head of Customer Experience and Operations",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What is the monthly support-contact volume split between retailers and end customers?",
      "Do Airtel's internal digital teams claim conversational servicing, or would they welcome a partner on this specific scope?",
      "How is retailer churn measured, and is support experience an attributed driver?",
      "What is the current adherence rate to prescribed reversal turnaround times, and where does it break down?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A retailer in Patna whose AePS withdrawal failed mid-transaction calls in Hindi, learns the reversal is already in flight with a stated deadline, and reopens his counter within two minutes.",
  },

  "india-post-payments-bank": {
    operatingContext:
      "India Post Payments Bank is a government-owned payments bank that delivers banking through the Department of Posts network, using postal workers and gramin dak sevaks as doorstep banking agents across every district in the country. Its proposition is reach: Aadhaar-enabled payment services, direct-benefit-transfer credits, small savings, bill payments and doorstep cash transactions for customers who are among the least app-capable in Indian banking — elderly pensioners, rural households, first-time account holders. Service demand centres on whether a DBT or pension credit has landed, how to request a doorstep visit, and what a postal agent can and cannot do at the door. As a government entity it procures entirely through tenders with partner delivery, and its technology estate is supplied and integrated externally.",
    strategicPressure: [
      { text: "The bank delivers services through the Department of Posts network, using postal staff as doorstep banking agents nationwide.", kind: "verified" },
      { text: "Its customer base is disproportionately elderly, rural and low-literacy, for whom voice in a regional language is the only realistic self-service channel.", kind: "verified" },
      { text: "DBT and pension credit dates create synchronised nationwide contact spikes rather than a smooth service curve.", kind: "inference" },
      { text: "Doorstep-visit scheduling is a coordination problem across a very large field workforce, currently handled with minimal automation.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. As a government entity, IPPB procures through tenders and depends on partners for delivery and integration. It has no internal engineering organisation and no mechanism to create one; the question is not whether it buys but through which procurement route and with which integrator.",
    whyNotBuild:
      "Serving a dozen-plus languages with speech quality adequate for elderly rural callers, integrating with postal field systems and government payment rails, and running the whole thing 24x7 is not a capability a government payments bank builds. Every element would be procured anyway; the only choice is whether it is procured as a coherent platform or as disconnected components.",
    workflows: [
      {
        name: "DBT and pension credit-status enquiry",
        friction: "On credit dates, beneficiaries ask postal agents and post-office counters whether their money has arrived, one person at a time, across tens of thousands of locations.",
        outcome: "Regional-language voice self-service that confirms credit, amount and date, with proactive credit-day messaging for enrolled customers reducing the enquiry entirely.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Core banking system", "DBT / government payment reconciliation", "Pension records", "Customer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Doorstep-service request and scheduling",
        friction: "Requesting a doorstep visit depends on contacting a local agent or post office; requests are coordinated informally and customers have no visibility of when someone will arrive.",
        outcome: "Conversational request capture with the service type and location confirmed, routed to the right agent, and a visit window communicated and reminded.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Doorstep service / field workforce management", "Customer master", "Post-office and beat mapping", "Notification services"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Account and AePS transaction support",
        friction: "Failed AePS transactions and account questions are raised with a postal agent who may not be able to resolve them, and there is no accessible escalation path for the customer.",
        outcome: "Direct vernacular support for transaction status, reversal timelines and account queries, with escalation into the complaint register where required.",
        channels: ["Voice", "SMS"],
        systems: ["Core banking system", "AePS / switch transaction logs", "Complaint register", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Toll-free contact centre with an IVR in a subset of Indian languages",
        "Mobile banking application and SMS-based services for basic enquiries",
        "Doorstep banking delivered by postal staff and gramin dak sevaks",
        "Post-office counters acting as full-service access points",
      ],
      gaps: [
        "Most of the bank's operating languages are not served conversationally on the phone",
        "Doorstep-service requests have no self-service scheduling or visit-window communication",
        "Credit confirmation for DBT and pension requires asking a human",
        "Failed-transaction escalation is opaque to customers who cannot navigate a portal",
      ],
    },
    risks: [
      "Government procurement runs through tender processes that can extend beyond a fiscal year; commercial timing is the dominant risk, not technical feasibility.",
      "Servicing government-benefit credits carries political and audit sensitivity — accuracy and full logging are non-negotiable.",
      "DPDP consent and comprehension standards are demanding for an elderly, low-literacy customer base and must be designed into each language.",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Volume, cost per interaction and automation rate are seller assumptions used for indicative sizing only and must be replaced with IPPB's own contact and field-service data.",
    },
    pilotScope:
      "A ten-week pilot on DBT and pension credit-status enquiry in Hindi, Bengali and Telugu across three circles, measured on enquiries resolved without human contact and counter time released at post offices.",
    expansion: [
      "Add doorstep-service request capture, routing and visit-window communication",
      "Extend to AePS transaction support and complaint intake",
      "Broaden language coverage toward the full national footprint circle by circle",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Technology Officer / Head of IT",
      "Chief Operating Officer / Head of Banking Operations",
      "Head of Product and Customer Experience",
      "Senior Department of Posts liaison for field-network coordination",
    ],
    discovery: [
      "What is the procurement route and expected timeline for a customer-service technology award?",
      "What is the peak-to-average contact ratio around DBT and pension credit dates?",
      "How are doorstep-service requests captured and routed today, and is fulfilment measured?",
      "Which languages are supported in the current IVR and what blocked the remainder?",
    ],
    flowTemplate: "appointments",
    scenario: "A pensioner in rural Odisha calls in Odia to check her DBT credit and books a doorstep cash-withdrawal visit for Thursday morning without going to the post office.",
  },

  "fino-payments-bank": {
    operatingContext:
      "Fino Payments Bank is a listed, asset-light payments bank whose model is built around merchant distribution: lakhs of small retail points across India act as assisted banking outlets performing AePS withdrawals, cash deposits, remittances, account openings and bill payments for walk-in customers. Revenue comes from transaction fees shared with those merchants, which makes the merchant both the bank's distribution channel and its most demanding support constituency — every settlement delay, commission question, device issue or failed transaction stops a merchant from earning. Merchant productivity and retention are therefore direct revenue drivers, and support responsiveness is a competitive variable against other correspondent networks. Fino's technology investment concentrates on its transaction switch and merchant platform rather than on conversational channels.",
    strategicPressure: [
      { text: "Fino's business model depends on a very large network of merchant points acting as assisted banking outlets.", kind: "verified" },
      { text: "Merchants are free to work with competing correspondent networks, so support quality directly affects channel retention and throughput.", kind: "inference" },
      { text: "Failed AePS and remittance transactions block merchant float and stop earnings immediately, making resolution speed an economic issue rather than a service nicety.", kind: "verified" },
      { text: "Thin per-transaction margins mean any human-handled support contact erodes the unit economics of the transactions it relates to.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Fino's engineering effort goes into the switch, merchant application and transaction reliability. Merchant support automation is adjacent operational tooling it would contract, evaluated strictly on cost per contact and on merchant downtime avoided.",
    whyNotBuild:
      "Building multilingual speech and conversational orchestration would divert scarce engineering from transaction reliability, which is the bank's actual product. The support problem is urgent and bounded — exactly the shape of problem a packaged platform solves faster than a roadmap item.",
    workflows: [
      {
        name: "Merchant settlement and commission queries",
        friction: "Merchants call to ask why a settlement has not landed or how a commission was computed; they wait in a queue while their counter sits idle, and disputes are resolved by a field manager days later.",
        outcome: "Instant authenticated explanation of settlement status, expected timing and commission computation in the merchant's language, with disputes captured and routed only where genuinely required.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Merchant management platform", "Settlement and float ledger", "Commission engine", "Ticketing system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Failed-transaction resolution for merchant counters",
        friction: "An AePS withdrawal that debits the customer but does not dispense cash puts the merchant between an angry customer and a pending reversal, with no fast way to establish what happened.",
        outcome: "Immediate transaction-status determination with the reversal timeline stated, evidence logged, and a clear script the merchant can give the customer on the spot.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Switch and AePS transaction logs", "Dispute / reversal workflow", "Merchant management platform", "Core ledger"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Merchant onboarding and service activation",
        friction: "New merchants and those activating additional services need documents, device configuration and training; onboarding depends on field-team availability and stalls in between visits.",
        outcome: "Guided vernacular onboarding that names the pending requirement, validates submissions, and activates services faster with fewer field visits.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Merchant onboarding / KYC workflow", "Device and inventory management", "Merchant management platform", "Training content repository"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Merchant application with transaction history, settlement and commission views",
        "Merchant support helpline and ticketing process",
        "Customer-facing app and SMS notification for transactions",
        "Field-team structure supporting merchant onboarding and issue resolution",
      ],
      gaps: [
        "Settlement and commission questions require a human or a field visit to resolve",
        "Failed-transaction status is not instantly available to the merchant at the counter",
        "Onboarding and service activation stall between field visits",
        "Support language coverage lags the geographic spread of the merchant network",
      ],
    },
    risks: [
      "RBI turnaround-time rules for failed transactions impose reversal and compensation obligations that automated support must track and evidence.",
      "Payments-bank operating restrictions bound what services can be offered and described, and automated answers must not overstate them.",
      "Merchant-facing communication touches commercial terms; disclosure controls must ensure a merchant only ever hears their own commission and settlement data.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.9,
      automationRate: 0.65,
      basis: "Monthly support volume, unit cost and automation rate are seller assumptions for framing and require validation against Fino's merchant-support contact data.",
    },
    pilotScope:
      "An eight-week pilot on merchant settlement and commission queries in Hindi, Marathi and Bengali for a defined merchant cohort, measured on resolution without human handling and merchant counter-downtime avoided.",
    expansion: [
      "Add failed-transaction status and reversal-timeline resolution at the counter",
      "Extend to merchant onboarding and service-activation guidance",
      "Broaden language coverage across the national merchant footprint",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Technology Officer",
      "Chief Business Officer / Head of Merchant Distribution",
      "Head of Customer and Merchant Experience",
      "Chief Financial Officer",
    ],
    discovery: [
      "What is the monthly merchant-support contact volume and its composition by issue type?",
      "Is merchant churn attributed internally to support experience, and is that measured?",
      "How long does a merchant typically wait to get a settlement question resolved today?",
      "Which languages does the merchant network actually operate in versus what support covers?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A kirana merchant in Nagpur whose customer's AePS withdrawal failed calls in Marathi, gets the reversal timeline and a reference number, and reassures the customer without closing his counter.",
  },

  "manappuram-finance": {
    operatingContext:
      "Manappuram Finance is a Thrissur-headquartered gold-loan NBFC operating a large branch network across Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Karnataka and increasingly the northern states, with a group that also includes the Asirvad microfinance business and vehicle and MSME lending arms. Gold loans are structurally communications-heavy: tenures are short, interest accrues monthly, customers routinely renew or part-pay rather than close, and regulation requires notice before any pledged ornament can be auctioned. That produces a continuous cycle of renewal reminders, interest-due notices, top-up eligibility conversations and pre-auction notifications across a customer base that transacts at a branch counter and communicates by phone in six or more languages. The group runs a branch-led, field-heavy operating model rather than a technology-platform one.",
    strategicPressure: [
      { text: "Gold loans carry short tenures with monthly interest accrual, making renewal and interest-due communication a permanent, high-frequency operational requirement.", kind: "verified" },
      { text: "Regulation requires notice to the borrower before pledged gold is auctioned, so documented, provable communication is a compliance obligation and not merely good practice.", kind: "verified" },
      { text: "The Asirvad microfinance business adds joint-liability group servicing load with its own conduct expectations on top of the gold-loan cycle.", kind: "verified" },
      { text: "Northern-state expansion widens the language requirement well beyond the group's Malayalam and Tamil origins.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Manappuram's operating model is branch density, valuation discipline and turnaround speed, run by a field organisation. There is no technology-platform bench, and the group's investments go into branches, security and lending systems rather than software engineering.",
    whyNotBuild:
      "Speech quality in Malayalam, Tamil, Telugu, Kannada and Hindi, resilient telephony at branch scale, orchestration into the gold-loan system, and an evaluation layer strong enough to evidence regulatory notices are four separate engineering disciplines the group has never operated. Given that the compliance value comes precisely from auditability, a contracted platform with built-in logging is a better answer than an internal build.",
    workflows: [
      {
        name: "Interest-due and renewal reminder outreach",
        friction: "Branch staff telecall due customers between valuations and disbursements; coverage is partial, timing drifts, and accounts slip toward overdue simply because nobody called.",
        outcome: "Every due account contacted on schedule in the customer's language with the exact amount stated, payment taken in-channel, and every attempt and outcome logged.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan management system", "Payment gateway / UPI collect", "Branch and customer records", "Collections case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-auction notification with acknowledgement",
        friction: "Pre-auction notices go out by letter and inconsistent calls; customers later claim non-receipt, and disputes over auctioned ornaments are damaging and expensive.",
        outcome: "Multilingual notification delivered and acknowledged with a full audit trail, hardship and dispute signals routed immediately to a human, and auction proceeding only on a documented communication record.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan management system", "Auction / recovery workflow", "Notice generation and delivery log", "Compliance records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Top-up eligibility and release coordination",
        friction: "Customers ask how much more they can draw against pledged gold or what is needed to release it; the answer depends on current valuation and policy that only a branch can look up.",
        outcome: "Eligibility and release amounts explained conversationally under current policy, payment or drawdown initiated, and a branch slot booked for the physical step.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Gold-loan management system", "Valuation / LTV policy engine", "Payment gateway", "Branch appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer mobile application supporting online gold-loan payment and account view",
        "Contact centre and branch phone lines handling renewal and servicing queries",
        "SMS and WhatsApp notification for interest due and account activity",
        "Dense branch network performing valuation, disbursement and release in person",
      ],
      gaps: [
        "Renewal and interest-due outreach does not reliably reach every due account",
        "Pre-auction notification lacks a provable, acknowledged, multilingual delivery record",
        "Top-up eligibility requires a branch conversation and a valuation lookup",
        "Northern-state language coverage lags the branch expansion",
      ],
    },
    risks: [
      "RBI gold-loan directions govern valuation, notice and auction processes; automated communication must strengthen the evidentiary record, with wording reviewed by compliance.",
      "Recovery-related contact is subject to fair-practices expectations on tone, timing and frequency, with clear reputational exposure in a consumer-gold context.",
      "TRAI DND and consent rules apply to a customer base contacted many times a year, requiring careful service-versus-promotional classification.",
    ],
    economics: {
      volumeMonthly: 3500000,
      costPerInteraction: 0.9,
      automationRate: 0.65,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for indicative modelling; the company's own renewal-outreach and telecalling data must replace them in discovery.",
    },
    pilotScope:
      "A ten-week pilot on interest-due and renewal outreach in Malayalam, Tamil and Telugu across two regions, measured on contact coverage of due accounts, on-time renewals and branch hours recovered.",
    expansion: [
      "Add documented pre-auction notification with acknowledgement capture and hardship routing",
      "Extend to top-up eligibility and release coordination with branch appointment booking",
      "Broaden to Asirvad microfinance group servicing and northern-state language coverage",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer / Head of Gold Loan Business",
      "Chief Technology Officer / Head of IT",
      "Chief Compliance Officer",
      "Head of Customer Service and Collections",
    ],
    discovery: [
      "What proportion of interest-due accounts receive a call each cycle, and who makes those calls?",
      "How is pre-auction notification currently evidenced, and have disputed notices caused losses?",
      "Would compliance treat a logged, acknowledged voice notification as an improvement on the current record?",
      "Which languages will northern branch expansion require over the next twelve months?",
    ],
    flowTemplate: "collections",
    scenario: "A gold-loan customer in Coimbatore is called in Tamil a week before her pledge period ends, hears the renewal and closure amounts, and pays the interest through a link to keep her ornaments.",
  },

  "iifl-finance": {
    operatingContext:
      "IIFL Finance is a diversified non-banking financial company lending across gold loans, home loans, loans against property and MSME and microfinance credit through a wide branch network spanning both metros and smaller towns. Its gold-loan business went through an RBI supervisory restriction and a subsequent remediation and rebuild, an episode that raised the internal bar for documented, auditable, policy-compliant customer processes across the group. Each product line runs its own communication motion: gold-loan renewal and interest-due cycles, home-loan disbursement and document coordination, MSME repayment follow-up and microfinance group servicing. Customers are largely vernacular, phone-first and branch-anchored, and the company's technology is assembled from vendors with digital effort concentrated on origination journeys.",
    strategicPressure: [
      { text: "IIFL Finance's gold-loan business was subject to an RBI supervisory restriction that was subsequently lifted following remediation.", kind: "verified" },
      { text: "That episode makes demonstrable process compliance and auditable customer communication a board-level concern rather than an operational preference.", kind: "inference" },
      { text: "Running gold, housing, MSME and microfinance books means four distinct servicing cadences competing for the same telecalling and branch capacity.", kind: "inference" },
      { text: "Gold-loan renewal cycles generate the highest contact frequency per rupee lent of any product the company runs.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company's technology is vendor-assembled with internal effort focused on origination and credit. Post-remediation, the decisive attribute is auditability — full transcripts, consistent policy adherence and provable notice delivery — which a governed platform provides out of the box and an internal build would have to earn.",
    whyNotBuild:
      "Building conversational infrastructure across five languages and four product lines while under heightened supervisory attention would introduce exactly the kind of process risk the company has spent effort eliminating. Contracted capability with logging and evaluation built in is both faster and defensible to the regulator.",
    workflows: [
      {
        name: "Gold-loan renewal and compliant notification",
        friction: "Renewal reminders and pre-auction notices depend on branch telecalling of variable coverage and quality, and the evidentiary record is uneven across branches.",
        outcome: "Consistent, policy-worded multilingual outreach with every attempt, delivery and acknowledgement logged, and hardship or dispute signals routed to a human immediately.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Gold-loan management system", "Notice generation and delivery log", "Payment gateway / UPI collect", "Compliance and audit records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Home-loan and LAP document and disbursement coordination",
        friction: "Property, income and legal documents are chased by sourcing officers; files stall and borrowers call repeatedly to ask where their disbursement stands.",
        outcome: "Automated multilingual follow-up naming the exact pending item, guiding submission, and pushing disbursement-stage updates without a human in the loop.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Disbursement / loan management system", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "MSME and microfinance repayment follow-up",
        friction: "Repayment follow-up across the MSME and microfinance books is worked by telecallers and field officers with partial coverage and inconsistent conduct records.",
        outcome: "Full coverage of the due base within permitted hours, structured conversations that capture the real constraint, payment capture in-channel, and complete conduct evidence.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Collections case management", "Payment gateway", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer mobile application covering loan servicing and online payment",
        "Contact centre and branch phone lines for product servicing",
        "SMS and WhatsApp notification for dues, disbursements and account activity",
        "Digital origination journeys for gold, business and personal loans",
      ],
      gaps: [
        "Renewal and notice communication quality varies by branch with an uneven audit trail",
        "Document and disbursement status has no borrower-facing self-service path",
        "Repayment follow-up coverage is capacity-limited across the MSME and microfinance books",
        "No single evaluated conversational layer spanning the group's product lines",
      ],
    },
    risks: [
      "Heightened supervisory attention on gold-loan processes means any customer-communication change must be documented, reviewed and evidenced end to end.",
      "RBI digital-lending and fair-practices norms govern repayment communication, disclosure and grievance routing across all product lines.",
      "TRAI DND and consent rules apply to high-frequency renewal outreach, requiring careful classification of service versus promotional contact.",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "All economics are seller assumptions used to frame the case and must be replaced with the company's own servicing and collections cost data during discovery.",
    },
    pilotScope:
      "A ten-week pilot on gold-loan renewal and interest-due outreach in Hindi, Tamil and Telugu for two regions, with full transcript logging reviewed by compliance, measured on contact coverage, on-time renewals and evidence quality.",
    expansion: [
      "Add pre-auction notification with acknowledgement capture and hardship routing",
      "Extend to home-loan and LAP document chase and disbursement-status communication",
      "Broaden to MSME and microfinance repayment follow-up across the branch network",
    ],
    stakeholders: [
      "Chief Executive Officer / Joint Managing Director",
      "Chief Compliance Officer",
      "Chief Technology Officer",
      "Head of Gold Loan Business",
      "Head of Collections and Customer Service",
    ],
    discovery: [
      "Does the post-remediation compliance investment budget extend to customer-communication systems?",
      "How is renewal and pre-auction notification evidenced today, and would compliance value a logged voice record?",
      "What is the current contact coverage of due accounts across each product line?",
      "Who owns customer-communication standards across the four businesses — a single function or each product head?",
    ],
    flowTemplate: "collections",
    scenario: "A gold-loan borrower in Hyderabad is called in Telugu with the exact interest due and a renewal option, and the entire conversation is transcribed and filed against her account for audit.",
  },

  "poonawalla-fincorp": {
    operatingContext:
      "Poonawalla Fincorp is a Pune-headquartered non-banking financial company, controlled by the Cyrus Poonawalla group, rebuilt from the former Magma Fincorp into a digital-first consumer and small-business lender. Its book spans personal loans, professional and business loans, loans against property, supply-chain finance and newer product lines, originated substantially through digital channels and partnerships rather than a heavy branch network. Rapid origination growth creates proportional downstream servicing load: welcome and onboarding conversations, EMI reminders, early-bucket collections and servicing queries from a borrower base spread across Maharashtra, Gujarat, the Hindi belt and the south. Management has positioned the company around technology-led efficiency, but its engineering energy goes into credit decisioning, origination and risk rather than communications infrastructure.",
    strategicPressure: [
      { text: "The company has been rebuilt as a digital-first lender under new ownership and management following the Magma Fincorp acquisition.", kind: "verified" },
      { text: "Management has publicly positioned technology and AI-led efficiency as a differentiator in its operating model.", kind: "verified" },
      { text: "Fast origination growth mechanically creates downstream servicing and early-bucket collections load on a young operations organisation.", kind: "inference" },
      { text: "New-vintage unsecured books require intensive early-bucket contact discipline to keep credit costs within underwriting assumptions.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led, with a sophisticated buyer's expectations. The company's stated AI agenda means it will evaluate a platform on model quality, evaluation rigour and integration depth rather than on cost alone — but its own build energy is committed to credit and origination, where its competitive advantage lies.",
    whyNotBuild:
      "Credit decisioning and origination speed are where Poonawalla's engineering creates lending advantage. Speech, telephony and conversational orchestration create none, and building them would slow the origination roadmap that drives the growth story. The buyer will nonetheless demand to see evaluation methodology and integration architecture in detail.",
    workflows: [
      {
        name: "Early-bucket collections on new-vintage loans",
        friction: "Fresh unsecured and business-loan vintages bounce for cash-flow timing; telecalling reaches part of the due base in office hours, and outcomes feed back into credit models inconsistently.",
        outcome: "Complete coverage of the due and bounced base within permitted hours, structured capture of the actual repayment constraint, in-channel payment, and clean outcome data flowing back to credit.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Collections case management", "Payment gateway / UPI collect"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-disbursement welcome and mandate activation",
        friction: "Newly disbursed borrowers do not always understand their repayment date, mandate status or prepayment terms, producing first-EMI failures that were entirely avoidable.",
        outcome: "A structured welcome conversation in the borrower's language confirming schedule, mandate status and payment mechanics, measurably reducing first-EMI bounces.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "NACH mandate records", "Product and policy knowledge base", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Servicing queries: statements, foreclosure and NOC",
        friction: "Borrowers call for outstanding balance, foreclosure quotes, part-payment effects and NOC after closure; these are simple, high-volume requests that consume agent time.",
        outcome: "Self-service in vernacular languages for balances, foreclosure quotes, part-payment simulation and NOC issuance, with documents delivered in-channel.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Document generation", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Digital origination journeys and a customer mobile application for loan servicing",
        "Contact centre with an IVR covering EMI, balance and servicing queries",
        "SMS, email and WhatsApp notification for dues, disbursement and mandate events",
        "In-house and outsourced telecalling teams for collections",
      ],
      gaps: [
        "Early-bucket contact coverage is limited by telecalling capacity and hours",
        "No structured post-disbursement welcome conversation to prevent first-EMI failures",
        "Foreclosure quotes and NOC requests still require human handling",
        "Collections conversation outcomes are not captured in a form credit models can consume",
      ],
    },
    risks: [
      "RBI digital-lending directions impose disclosure, grievance-routing and communication standards on every borrower-facing interaction.",
      "Recovery-agent and fair-practices norms govern contact hours, frequency and tone, with full record-keeping required.",
      "Parts of the company's stated AI agenda may already be contracted elsewhere, so the competitive position must be established before technical engagement.",
    ],
    economics: {
      volumeMonthly: 1400000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions for framing only; the company's own collections and servicing cost data should replace them during discovery.",
    },
    pilotScope:
      "An eight-to-ten week pilot on early-bucket collections for new-vintage personal and business loans in Hindi, Marathi and Gujarati, measured on contact coverage, promise-to-pay conversion and cost per resolved account.",
    expansion: [
      "Add post-disbursement welcome and mandate-activation conversations to cut first-EMI failures",
      "Extend to inbound servicing including foreclosure quotes, part-payment and NOC issuance",
      "Broaden languages and feed structured collections outcomes into credit and risk models",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Technology Officer / Chief Digital Officer",
      "Chief Risk Officer / Head of Credit",
      "Head of Collections",
      "Head of Customer Experience",
    ],
    discovery: [
      "Which parts of the stated AI agenda are already contracted, to whom, and for what scope?",
      "What is the first-EMI bounce rate on new vintages, and is any welcome-call process in place?",
      "What share of the due base is contacted before the EMI date, and at what cost per resolved account?",
      "How do collections conversation outcomes currently feed back into credit modelling?",
    ],
    flowTemplate: "collections",
    scenario: "A newly disbursed business-loan borrower in Surat receives a Gujarati welcome call confirming his mandate and first EMI date, and never becomes a first-payment default.",
  },

  "five-star-business-finance": {
    operatingContext:
      "Five Star Business Finance is a Chennai-headquartered non-banking financial company that lends small secured loans — typically against self-occupied residential property — to shopkeepers, service providers and micro-entrepreneurs who are largely excluded from bank credit. Its model is deliberately high-touch and branch-led across Tamil Nadu, Andhra Pradesh, Telangana, Karnataka and adjacent states, with branch officers who source, underwrite, monitor and collect from customers they know personally. Borrowers repay monthly in patterns tied to daily cash businesses, so reminder and collection contact is embedded in branch staffing rather than run as a separate function. That design is the company's credit moat, but it also means routine reminder calling consumes the same officer hours that generate new business and maintain portfolio quality.",
    strategicPressure: [
      { text: "The company lends small secured loans to micro-enterprise borrowers through a branch-led, high-touch model across southern India.", kind: "verified" },
      { text: "Because collections are performed by the same branch officers who source and monitor, reminder calling directly competes with origination and field monitoring time.", kind: "verified" },
      { text: "Branch expansion multiplies reminder-calling load linearly, making officer productivity the practical constraint on growth.", kind: "inference" },
      { text: "Its borrowers are cash-business owners whose repayment timing shifts within the month, so contact timing matters more than contact volume.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company's advantage is local underwriting judgement and relationship density, not software. It has no engineering organisation, and its investment goes into branches and people. A communications capability that protects branch-officer productivity is precisely the kind of tooling it would purchase and measure on hours recovered.",
    whyNotBuild:
      "Tamil, Telugu and Kannada speech quality, telephony and orchestration are entirely outside anything the company operates. More importantly, its lending model depends on officers spending time with borrowers; a multi-year build would delay the very relief it needs and would not improve credit judgement one bit.",
    workflows: [
      {
        name: "Pre-due EMI reminders for micro-enterprise borrowers",
        friction: "Branch officers phone due customers themselves each month, in the same hours they should be sourcing or visiting; borrowers who are busy at their shop miss the call and get chased again.",
        outcome: "Every due borrower reached in their language at a time they can talk, with payment options offered in-channel and outcomes recorded, returning officer hours to field work.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / UPI collect", "Branch and officer allocation records", "Collections case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-bounce follow-up and arrangement capture",
        friction: "When a repayment misses, follow-up depends on the officer's availability and memory; the reason for the miss is rarely recorded in a way anyone else can use.",
        outcome: "Next-day structured conversation that captures why the payment missed, offers policy-bounded arrangements, and escalates to the officer only where a visit is genuinely warranted.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Collections case management", "Payment gateway", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan servicing and closure queries",
        friction: "Borrowers call the branch to ask outstanding balance, remaining tenure, foreclosure amount and what is needed to release their property documents after closure.",
        outcome: "Vernacular self-service for balance, schedule, foreclosure quotes and closure documentation, with document collection appointments booked at the branch.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Document custody records", "Document generation", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch-officer relationship servicing covering sourcing, monitoring and collection",
        "Customer application and online payment options for EMI repayment",
        "SMS reminders and alerts for due dates and receipts",
        "Central customer-support line for account queries",
      ],
      gaps: [
        "Reminder calling is performed by branch officers, consuming productive field time",
        "Post-bounce reasons are not captured systematically for portfolio analysis",
        "No after-hours or self-service route for balance, foreclosure and closure queries",
        "Property-document release after closure has no tracked, proactive communication",
      ],
    },
    risks: [
      "RBI fair-practices and recovery-agent norms govern contact hours, frequency and tone for all repayment communication.",
      "Digital-lending directions require clear disclosure and accessible grievance routes in borrower communication.",
      "Because officers own the relationship, any automation must be positioned as protecting their time rather than replacing their role, or branch adoption will fail.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions used to frame the business case and must be validated against branch-officer time studies and collections data.",
    },
    pilotScope:
      "An eight-week pilot on pre-due EMI reminders in Tamil and Telugu across two branch clusters, measured on branch-officer hours recovered, on-time repayment and contact coverage of the due base.",
    expansion: [
      "Add next-day post-bounce follow-up with structured reason capture and arrangement offers",
      "Extend to inbound servicing for balance, foreclosure and closure-document queries",
      "Broaden to Kannada and Hindi as the branch network extends beyond the southern core",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Chief Business Officer / Head of Branch Operations",
      "Head of Collections and Credit Administration",
      "Chief Technology Officer",
    ],
    discovery: [
      "How many hours per week does a typical branch officer spend on routine reminder calls versus field visits?",
      "What proportion of due borrowers are contacted before the due date each month?",
      "Is the reason for a missed repayment captured anywhere systematically today?",
      "How would branch leadership react to reminder calling moving off the officer's plate?",
    ],
    flowTemplate: "collections",
    scenario: "A provision-store owner in Vellore gets a Tamil reminder at 8pm after closing his shop, and pays his EMI through a link instead of waiting for the branch officer's visit.",
  },

  "smfg-india-credit": {
    operatingContext:
      "SMFG India Credit, formerly Fullerton India, is a non-banking financial company wholly owned by Sumitomo Mitsui Financial Group, lending across personal loans, small-business and MSME credit, commercial vehicle and two-wheeler finance, loans against property and rural group lending. Its branch network reaches metros, tier-2 towns and rural clusters, giving it three quite different servicing motions: urban unsecured borrowers who expect digital servicing, vehicle and MSME borrowers who need EMI and document coordination, and rural group-lending customers who require vernacular, cycle-based repayment communication. Japanese-parent governance favours documented processes, vendor-delivered systems and auditable controls over internal experimentation. Its technology stack is procured and integrated rather than built, with digital effort focused on origination journeys.",
    strategicPressure: [
      { text: "The company is wholly owned by Sumitomo Mitsui Financial Group following the acquisition of the former Fullerton India business.", kind: "verified" },
      { text: "Japanese-parent governance strongly favours auditable, vendor-delivered systems with documented controls over internally built customer-facing technology.", kind: "inference" },
      { text: "Rural group lending generates a fixed, recurring communication load every repayment cycle that staffed telecalling absorbs expensively.", kind: "inference" },
      { text: "Three distinct borrower segments in one servicing organisation means language, cadence and tone requirements conflict within the same contact centre.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Parent governance, a vendor-assembled stack and no product-engineering function all point the same way. The decision process will be slower and more documentation-heavy than an Indian-owned peer, and the winning proposition emphasises auditability, controls and vendor-risk maturity as much as capability.",
    whyNotBuild:
      "A Japanese parent will not authorise a subsidiary to develop regulated customer-communication infrastructure in-house when a contracted alternative with defined controls exists. The company would have to build Indic speech, telephony and orchestration and then justify the operational risk to a parent that measures exactly that.",
    workflows: [
      {
        name: "Rural group-loan repayment reminders",
        friction: "Group repayment cycles are coordinated by field officers with telecalling support; coverage varies by geography and language, and outcomes are recorded inconsistently across regions.",
        outcome: "Complete, on-schedule reminder coverage in each region's language with confirmations captured, and every attempt logged to a standard the parent's audit function accepts.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Rural / group loan management system", "Centre and group records", "Collection and payment records", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Personal-loan and MSME early-bucket collections",
        friction: "Unsecured borrowers bounce for timing reasons; telecallers work a partial list in office hours, and conduct quality depends on the individual caller with limited monitoring coverage.",
        outcome: "Full coverage of the due base within permitted hours, consistent policy-bounded conversations, payment capture in-channel, and complete transcripts for quality and audit.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Collections case management", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan servicing: statements, foreclosure and NOC",
        friction: "Borrowers call for outstanding balances, foreclosure quotes, interest certificates and NOC after closure; these routine requests occupy agents who should be handling complex cases.",
        outcome: "Vernacular self-service for statements, foreclosure quotes and NOC issuance with documents delivered in-channel and requests logged automatically.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Document generation", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer mobile application and web portal for loan servicing and payments",
        "Contact centre with an IVR covering EMI, balance and servicing queries",
        "SMS and email notification for dues, receipts and mandate events",
        "In-house and outsourced telecalling and field-collection teams",
      ],
      gaps: [
        "Reminder coverage across the rural group book varies by region and language",
        "Collections conduct quality is monitored only on a sampled basis",
        "Foreclosure quotes and NOC issuance require human handling",
        "No unified conversational layer across the three distinct borrower segments",
      ],
    },
    risks: [
      "Parent-level vendor approval and information-security review processes are demanding and can extend the sales cycle considerably.",
      "RBI recovery-agent and fair-practices norms apply across all collections contact, with the parent expecting documented adherence.",
      "Existing global CCaaS or vendor commitments at group level may constrain India-specific platform selection.",
    ],
    economics: {
      volumeMonthly: 1600000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Interaction volume, cost per contact and automation rate are seller assumptions for modelling only and must be replaced with the company's own collections and servicing MIS.",
    },
    pilotScope:
      "A ten-week pilot on rural group-loan repayment reminders in Hindi, Tamil and Marathi for two regions, with full transcript logging and quality scoring, measured on contact coverage and on-time repayment.",
    expansion: [
      "Extend to personal-loan and MSME early-bucket collections with in-channel payment",
      "Add inbound servicing for statements, foreclosure quotes and NOC issuance",
      "Broaden language coverage across the national branch footprint",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Chief Technology Officer / Head of IT",
      "Head of Collections",
      "Chief Risk and Compliance Officer",
    ],
    discovery: [
      "What is the parent-level vendor-approval and security-review process, and how long does it typically take?",
      "Are there existing group-level CCaaS or contact-technology commitments that constrain India selection?",
      "What proportion of rural group borrowers receive a reminder each cycle, and how does it vary by region?",
      "What share of collections calls is quality-monitored today, and what would 100% coverage be worth to compliance?",
    ],
    flowTemplate: "collections",
    scenario: "A rural group borrower in Vidarbha receives a Marathi reminder two days before her centre collection, confirms she will pay, and the conversation is transcribed and scored for the parent's audit file.",
  },

  "tvs-credit": {
    operatingContext:
      "TVS Credit Services is the TVS group's retail financing arm, lending predominantly at the point of vehicle sale — two-wheelers, used cars, tractors and increasingly consumer durables and small-business credit — to first-time-credit customers in semi-urban and rural India. Origination happens at dealerships across the country, which means borrowers are acquired quickly with limited relationship depth and then serviced remotely for the life of the loan. Two-wheeler and tractor finance produces the highest interaction-to-ticket-size ratio in Indian lending: EMI reminders, bounce follow-ups, settlement conversations and NOC requests all happen by phone in Tamil, Hindi, Telugu, Kannada and Marathi. TVS group engineering identity is centred on manufacturing and vehicle businesses; the lending arm assembles its technology from vendors.",
    strategicPressure: [
      { text: "The company finances two-wheelers, tractors and used vehicles for first-time-credit customers originated at dealer points across India.", kind: "verified" },
      { text: "Small-ticket vehicle finance makes the cost of a human collections call disproportionate to the instalment being recovered.", kind: "verified" },
      { text: "Dealer-point origination gives limited relationship depth, so nearly all post-sale servicing must succeed remotely by phone.", kind: "inference" },
      { text: "Expansion into consumer durables and small-business credit adds new servicing cadences on the same contact infrastructure.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. TVS group engineering serves its vehicle businesses; the lending arm procures technology. Collections and servicing communications is an operational cost line where the company will buy measurable capacity rather than fund a development programme.",
    whyNotBuild:
      "Five-language speech quality, telephony at very high call volumes, orchestration into the loan management system and continuous conduct evaluation are outside the arm's competency and outside the group's engineering identity. The economics of two-wheeler collections demand an answer this year, not a platform in three.",
    workflows: [
      {
        name: "Two-wheeler EMI reminders and bounce follow-up",
        friction: "Enormous volumes of small instalments bounce for timing reasons; telecallers and outsourced agencies reach a fraction of the base, contact quality varies, and cost per resolved account rivals the margin on the loan.",
        outcome: "Every due and bounced borrower reached in their language within permitted hours, payment taken in-channel, promises recorded with automatic follow-up, and hardship routed to a human.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Collections case management", "Payment gateway / UPI collect"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-closure NOC and hypothecation removal",
        friction: "Borrowers who have closed their loan chase the NOC needed to remove hypothecation from the registration certificate, calling repeatedly over weeks with no visibility.",
        outcome: "NOC request captured and status pushed proactively through issuance and dispatch, with the document delivered digitally where permitted.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NOC / closure workflow", "Document generation and dispatch tracking", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Dealer-point onboarding and first-EMI setup",
        friction: "Loans booked at a dealership leave the customer unclear on the EMI date, mandate status and payment method, producing avoidable first-payment failures.",
        outcome: "A structured welcome conversation in the borrower's language confirming schedule, mandate and payment mechanics, measurably reducing first-EMI bounces.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH mandate records", "Dealer origination records", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer mobile application and payment portal for EMI repayment",
        "Contact centre with an IVR covering EMI and account queries",
        "SMS and WhatsApp reminders for due dates, bounces and receipts",
        "Large in-house and outsourced collections operation including field agents",
      ],
      gaps: [
        "Reminder and follow-up coverage is capacity-limited relative to the number of live loans",
        "NOC issuance after closure has no proactive status communication",
        "First-EMI setup is not confirmed conversationally after dealer-point origination",
        "Contact outcomes are recorded inconsistently across in-house and agency channels",
      ],
    },
    risks: [
      "RBI recovery-agent norms and fair-practices expectations govern contact hours, frequency and tone, with heightened scrutiny where agencies are involved.",
      "Digital-lending directions require disclosure and grievance routing in every borrower communication.",
      "TRAI DND and consent registration constrain reminder volumes across a very large borrower base contacted monthly.",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 0.85,
      automationRate: 0.65,
      basis: "Volume, unit cost and automation rate are seller assumptions used to size the opportunity and must be replaced with the company's cost per collected EMI and contact-coverage data.",
    },
    pilotScope:
      "A ten-week pilot on two-wheeler pre-due reminders and post-bounce follow-up in Tamil, Hindi and Telugu for two states, measured on contact coverage, promise-to-pay conversion and cost per collected EMI against the agency baseline.",
    expansion: [
      "Add dealer-point welcome and first-EMI setup conversations to cut first-payment failures",
      "Extend to NOC and hypothecation-removal status communication after closure",
      "Broaden to used-car, tractor and consumer-durable books across all languages",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Technology Officer / Head of Digital",
      "Chief Risk Officer",
    ],
    discovery: [
      "What is the current cost per collected EMI in early buckets, split between in-house and agency channels?",
      "What proportion of the monthly due base is actually contacted before the due date?",
      "What is the first-EMI bounce rate on dealer-originated loans, and is any welcome process in place?",
      "Which telecalling and agency contracts are up for renewal in the next two quarters?",
    ],
    flowTemplate: "collections",
    scenario: "A two-wheeler borrower in Madurai whose EMI bounced is reached in Tamil that evening, pays half immediately through a link, and commits the balance for payday.",
  },

  "hinduja-leyland-finance": {
    operatingContext:
      "Hinduja Leyland Finance is the Hinduja group's lending arm, concentrated in commercial-vehicle and used-commercial-vehicle finance tied closely to the Ashok Leyland ecosystem, alongside tractor, two-wheeler, construction-equipment and housing-finance exposure. Its borrowers are fleet operators and, very often, single-truck owner-drivers whose income depends on freight availability and who manage their entire loan relationship by phone from the road. Commercial-vehicle lending is structurally collections-intensive: freight-cycle downturns, seasonal slowdowns and route disruptions produce irregular cash flows that require repeated, sympathetic contact and occasional restructuring rather than mechanical reminders. The company operates through branches and field officers across Tamil Nadu, the Hindi belt and the south, with a technology posture that is operational and vendor-sourced.",
    strategicPressure: [
      { text: "The company's core book is commercial-vehicle and used-CV finance connected to the Ashok Leyland ecosystem.", kind: "verified" },
      { text: "Owner-driver borrowers are mobile and reachable only by phone, often outside conventional office hours, which staffed telecalling handles badly.", kind: "verified" },
      { text: "Freight-cycle volatility means repayment capacity fluctuates month to month, so contact must diagnose the situation rather than simply demand payment.", kind: "inference" },
      { text: "Restructuring and settlement conversations require judgement and documentation that inconsistent telecalling does not reliably produce.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company's technology posture is operational — running lending systems, not building platforms. Its need is contact capacity and conversation quality in a volatile portfolio, which is a contracted capability measured against agency and telecalling cost.",
    whyNotBuild:
      "Nothing in a CV lender's operating model produces speech or conversational engineering capability. Its differentiation is dealer and manufacturer relationships and its understanding of freight economics; building communications infrastructure would add cost and risk without touching either.",
    workflows: [
      {
        name: "Commercial-vehicle EMI collections with situation capture",
        friction: "Owner-drivers on the road miss office-hours calls; when contact happens, the conversation is a demand rather than a diagnosis, and the actual cash-flow situation is not recorded.",
        outcome: "Contact at hours drivers can actually talk, in their language, capturing freight and cash-flow reality, offering policy-bounded arrangements and taking payment in-channel.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Collections case management", "Payment gateway / UPI collect", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Restructuring and settlement routing",
        friction: "Genuine distress cases are identified late and handled inconsistently; by the time a restructuring conversation happens, the account has already rolled into a costlier bucket.",
        outcome: "Early identification of distress signals with immediate routing to a trained officer, full transcript attached, so restructuring decisions happen while they still preserve value.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Restructuring / settlement workflow", "Collections case management", "Credit and risk records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Vehicle-document and NOC servicing",
        friction: "Borrowers chase insurance-renewal coordination, RC-related documentation and post-closure NOCs through repeated calls, often while parked at a checkpoint or a transport hub.",
        outcome: "Self-service status and issuance for documents and NOCs in the borrower's language, delivered digitally where permitted, with no repeat calling.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Document custody and generation", "NOC / closure workflow", "Insurance coordination records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer application and payment options for EMI repayment",
        "Contact centre and branch phone lines for loan servicing",
        "SMS reminders and alerts for due dates and receipts",
        "Field-officer and agency network conducting collections and repossession processes",
      ],
      gaps: [
        "Contact hours do not match when owner-drivers are actually reachable",
        "Cash-flow reality behind a missed payment is not captured in a usable form",
        "Distress cases are identified too late for value-preserving restructuring",
        "Document and NOC requests generate repeat calls with no status visibility",
      ],
    },
    risks: [
      "RBI recovery-agent norms and fair-practices expectations are especially sensitive in vehicle finance where repossession is a live consequence.",
      "Any automated conversation must never imply repossession or coercion; the escalation boundary has to be explicit and tested.",
      "Digital-lending disclosure and grievance-routing requirements apply to all borrower communication.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.05,
      automationRate: 0.55,
      basis: "Volume, cost and automation rate are seller assumptions for indicative modelling only and must be validated against the company's collections cost and contact-coverage data.",
    },
    pilotScope:
      "An eight-week pilot on commercial-vehicle EMI collections with situation capture and distress routing in Hindi and Tamil for two regions, measured on contact rate at borrower-convenient hours and early restructuring referrals.",
    expansion: [
      "Add structured restructuring and settlement routing across the CV portfolio",
      "Extend to vehicle-document, insurance-coordination and NOC servicing",
      "Broaden to tractor and construction-equipment books with additional languages",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Collections and Recovery",
      "Chief Technology Officer",
      "Chief Risk Officer",
    ],
    discovery: [
      "What hours are owner-driver borrowers actually contactable, and what does current contact success look like by time of day?",
      "How are distress and restructuring cases identified today, and how early in the delinquency curve?",
      "Who owns borrower communication where the loan originated through an Ashok Leyland dealer?",
      "What is the current cost per resolved account across in-house and agency collections?",
    ],
    flowTemplate: "collections",
    scenario: "A single-truck owner near Hosur is reached in Tamil at 9pm at a transport hub, explains a delayed freight payment, and is given a five-day arrangement with the reason recorded on file.",
  },

  "toyota-financial-services-india": {
    operatingContext:
      "Toyota Financial Services India is the captive financing arm for Toyota and Lexus vehicles in India, originating loans and lease products at Toyota dealerships across the country for a customer base that is comparatively affluent and urban. Because vehicle ownership is long-tenure and the customer relationship runs through the dealer, its servicing load is document-heavy rather than collections-heavy: foreclosure quotes, no-objection certificates, hypothecation removal on the registration certificate, insurance-renewal coordination, statement and interest-certificate requests and address or ownership changes. Each of those generates several contacts per loan over its life, mostly in English, Hindi, Kannada and Tamil. Global Toyota captive-finance governance standardises platforms and controls regionally, and the India entity procures technology within that framework rather than building locally.",
    strategicPressure: [
      { text: "The company is the captive financier for Toyota and Lexus vehicles in India, originating through the manufacturer's dealer network.", kind: "verified" },
      { text: "Captive-finance servicing is dominated by document workflows — NOC, hypothecation removal, foreclosure quotes — rather than by delinquency management.", kind: "inference" },
      { text: "Affluent customers have low tolerance for slow document turnaround, so servicing quality directly affects brand perception of Toyota itself.", kind: "inference" },
      { text: "Regional captive-finance governance may standardise CX platforms across Asia, constraining India-specific vendor selection.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A captive finance company inside a global manufacturer procures technology within group standards; it has no mandate or capability to develop customer-communication platforms locally. India volumes justify automation but never an internal engineering team.",
    whyNotBuild:
      "Toyota's engineering identity is vehicles, and its captive finance arm exists to support vehicle sales. Building conversational infrastructure in an India subsidiary would contradict the group operating model, and the regional governance function would not approve carrying that risk locally.",
    workflows: [
      {
        name: "NOC issuance and hypothecation removal",
        friction: "Customers who have closed their loan chase the NOC needed to remove hypothecation from the RC, calling repeatedly over weeks with no status visibility and often re-submitting details.",
        outcome: "Request captured on first contact with identity verified, status pushed proactively through issuance and dispatch, and the document delivered digitally where permitted.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "NOC / closure workflow", "Document generation and dispatch tracking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Foreclosure quote and part-payment servicing",
        friction: "Customers considering early closure ask for foreclosure amounts and charges; the calculation is done manually and quoted by callback, and the quote expires before they act.",
        outcome: "Instant, accurate foreclosure and part-payment quotes generated in-conversation with validity clearly stated and payment initiation available immediately.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Foreclosure calculation engine", "Payment gateway", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Insurance renewal and document-update coordination",
        friction: "Annual insurance renewal and address, nominee or ownership changes are handled through dealer and call-centre exchanges that require repeated document submission and follow-up.",
        outcome: "Guided request capture with document requirements stated precisely, validation before submission, and proactive status through to completion.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "Insurance coordination records", "Document management system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer portal and mobile access for loan account and payment information",
        "Contact centre handling servicing requests in business hours",
        "Dealer-based service touchpoints for loan and insurance queries",
        "Email and SMS notification for dues, receipts and account events",
      ],
      gaps: [
        "NOC and hypothecation-removal requests have no proactive status communication",
        "Foreclosure quotes require a manual calculation and a callback",
        "Document-update requests bounce on incomplete or wrongly formatted submissions",
        "No after-hours servicing for an affluent customer base that transacts in the evening",
      ],
    },
    risks: [
      "Regional or global captive-finance CX standards may preempt India-specific vendor selection, so the governance route must be established early.",
      "Foreclosure quotes and NOC statements are financially binding; accuracy and version control are non-negotiable.",
      "DPDP obligations apply to document handling and recorded conversations containing vehicle and identity data.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.4,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions for indicative modelling and must be validated against the company's servicing-request and contact-centre data.",
    },
    pilotScope:
      "An eight-week pilot on NOC issuance and foreclosure-quote servicing in English, Hindi and Kannada, measured on request-to-issuance turnaround and repeat status calls eliminated.",
    expansion: [
      "Extend to insurance renewal and document-update coordination with validated submissions",
      "Add after-hours servicing coverage and proactive milestone communication across the loan lifecycle",
      "Broaden to dealer-facing support for loan status and documentation queries",
    ],
    stakeholders: [
      "Managing Director / President, Toyota Financial Services India",
      "Chief Operating Officer / Head of Operations",
      "Head of Information Technology",
      "Head of Customer Service",
      "Regional captive-finance CX or digital lead (Asia governance)",
    ],
    discovery: [
      "Do regional captive-finance CX standards permit an India-specific platform selection, and who approves it?",
      "What is the current turnaround from NOC request to dispatch, and how many status calls does each request generate?",
      "How are foreclosure quotes produced today, and what proportion expire unused?",
      "What share of servicing contacts arrive outside staffed hours?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Toyota owner in Bengaluru who has just closed her loan requests her NOC on a Sunday evening, and receives the issuance timeline plus a status update when it dispatches.",
  },

  "kogta-financial": {
    operatingContext:
      "Kogta Financial (India) is a Jaipur-headquartered non-banking financial company lending against used commercial vehicles, cars, tractors and small-business assets across Rajasthan, Gujarat, Madhya Pradesh, Maharashtra and neighbouring states. Its borrowers are transporters, farmers and small traders in deep-vernacular geographies who expect contact in Hindi or Marwari, deal with field officers in person, and manage their loans entirely by phone. Private-equity backing has funded rapid branch and book expansion, which scales the number of live loans — and therefore the reminder and follow-up load — faster than the company can recruit and train telecallers. The technology estate is vendor-supplied and lean, with no internal engineering capability and no ambition to develop one.",
    strategicPressure: [
      { text: "The company lends against used vehicles and small-business assets across Rajasthan, Gujarat and central India through a branch and field model.", kind: "verified" },
      { text: "Private-equity-funded growth is expanding the live-loan count faster than telecalling capacity can be hired and trained.", kind: "inference" },
      { text: "Its borrower geographies require Hindi and Marwari, with dialect variation that generic voice coverage handles unevenly.", kind: "inference" },
      { text: "PE sponsors typically push operating-expense efficiency ahead of a liquidity event, making cost per resolved account a live metric.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Zero internal AI capability, a lean vendor-sourced stack and a growth-driven capacity problem make this a straightforward purchase decision judged on cost per resolved account and speed to deployment.",
    whyNotBuild:
      "The company's advantage is used-asset valuation and local recovery capability in specific geographies. Building speech and orchestration would consume capital its sponsors expect to see deployed in the book, and would arrive long after the capacity crunch it is meant to solve.",
    workflows: [
      {
        name: "Used-vehicle and tractor EMI reminders",
        friction: "Reminder calling is done by a small telecalling team and by field officers between visits; as the book grows, an increasing share of due accounts simply never gets called.",
        outcome: "Complete pre-due coverage in Hindi and Marwari with payment options in-channel, confirmations recorded, and follow-up automatic on broken promises.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / UPI collect", "Collections case management", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-bounce follow-up and field-visit triage",
        friction: "After a bounce, a field officer is dispatched without knowing whether the borrower simply needs a few days or is in genuine distress, wasting expensive field time on avoidable visits.",
        outcome: "Next-day conversation that establishes the reason and likely resolution date, so field visits are reserved for cases that actually need one.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Collections case management", "Field-officer allocation and routing", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan servicing, NOC and document queries",
        friction: "Borrowers call branches to ask outstanding balance, remaining tenure, foreclosure amount and NOC status after closure, interrupting officers who are underwriting or in the field.",
        outcome: "Vernacular self-service for balance, schedule, foreclosure quotes and NOC status, with documents delivered digitally where permitted.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "NOC / closure workflow", "Document generation", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer payment options through online and app-based channels",
        "Branch and central phone lines handling loan servicing queries",
        "SMS reminders for due dates and receipts",
        "Field-officer network conducting collection visits and relationship contact",
      ],
      gaps: [
        "A growing share of the due base receives no reminder call at all",
        "Field visits are dispatched without prior triage of the borrower's situation",
        "No self-service path for balance, foreclosure and NOC queries",
        "Contact outcomes are not captured in a form that supports collections analytics",
      ],
    },
    risks: [
      "RBI recovery-agent and fair-practices norms govern contact hours, tone and frequency, with vehicle finance under particular scrutiny given repossession consequences.",
      "Marwari and regional Hindi dialect performance must be benchmarked before commitment.",
      "TRAI DND and consent registration constrain reminder frequency across a monthly-contacted borrower base.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for framing only and must be replaced with the company's collections cost per resolved account during discovery.",
    },
    pilotScope:
      "An eight-week pilot on used-vehicle and tractor pre-due reminders plus next-day bounce triage in Hindi and Marwari for the Rajasthan cluster, measured on contact coverage, field visits avoided and on-time repayment.",
    expansion: [
      "Extend to Gujarat and Madhya Pradesh with Gujarati and regional Hindi coverage",
      "Add inbound servicing for balance, foreclosure and NOC queries",
      "Layer structured distress identification and restructuring routing",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Technology Officer / Head of IT",
      "Chief Financial Officer (sponsor-facing efficiency owner)",
    ],
    discovery: [
      "How fast is the live-loan count growing relative to telecalling headcount?",
      "What proportion of due accounts receive a reminder call today?",
      "How many field visits per month end with the borrower simply needing a few extra days?",
      "How does Marwari and regional Hindi speech perform on the company's own recorded calls?",
    ],
    flowTemplate: "collections",
    scenario: "A used-truck owner in Bhilwara is called in Marwari the day after his EMI bounces, promises payment on Friday after a freight settlement, and no field officer is dispatched.",
  },

  "arka-fincap": {
    operatingContext:
      "Arka Fincap is the Kirloskar group's non-banking financial company, built initially around corporate and structured lending and now extending into MSME loans, loans against property and personal lending. Because its retail business is young, its servicing infrastructure is being assembled now rather than inherited: contact processes, reminder cadences and customer-communication tooling are not yet locked into long-standing contact-centre contracts or headcount-based habits. Its borrowers in the retail and MSME segments are small-business owners in Maharashtra and the Hindi belt who transact by phone and expect vernacular contact. The Kirloskar group's heritage is industrial engineering, with no software-platform ambition, so technology for the finance arm is procured rather than developed.",
    strategicPressure: [
      { text: "Arka Fincap is the Kirloskar group's financial-services arm, extending from a corporate-lending base into MSME and retail credit.", kind: "verified" },
      { text: "A young retail book means servicing architecture is a greenfield decision rather than a replacement of entrenched processes.", kind: "inference" },
      { text: "Greenfield is the cheapest moment to install a conversational servicing model, before headcount-based habits and vendor contracts form.", kind: "inference" },
      { text: "Current retail scale may sit below the volume threshold at which a paid pilot is economically sensible, making timing the key question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. An industrial group's finance arm procures technology; there is no engineering organisation and no strategic interest in creating one. The proposition is architectural rather than cost-driven: install the right servicing model while the book is small and let it scale with growth.",
    whyNotBuild:
      "Nothing in the Kirloskar group or Arka's operating model produces conversational-AI capability, and at current retail scale a build would be absurd. The relevant risk is the opposite one — that scale is too small today for the platform's economics to work, which is a timing question for discovery.",
    workflows: [
      {
        name: "MSME onboarding and disbursement-status servicing",
        friction: "New MSME borrowers ask what documents remain and when disbursement will land; with a small operations team, those calls interrupt the same people who process the files.",
        outcome: "Automated vernacular follow-up naming the exact pending item and pushing disbursement-stage updates, keeping a small team productive as volumes rise.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Core lending / disbursement system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "EMI reminders and early-bucket follow-up",
        friction: "As the retail book grows, reminders are handled ad hoc; there is no established cadence, no consistent language coverage and no systematic outcome capture.",
        outcome: "A designed reminder and follow-up model from the outset — policy-timed, multilingual, payment-enabled and fully logged — that scales without proportional hiring.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Payment gateway", "Collections case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Borrower servicing: statements, schedules and closure",
        friction: "Routine requests for statements, amortisation schedules, part-payment effects and closure documentation reach a small team with no self-service alternative.",
        outcome: "Self-service in Hindi, Marathi and English for statements, schedules, quotes and closure documents delivered in-channel.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "Document generation", "Payment gateway", "CRM"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Loan origination and servicing systems supporting corporate and retail lending",
        "Central customer-support line for borrower queries",
        "Email and SMS notification for disbursement, dues and receipts",
        "Relationship-managed servicing inherited from the corporate-lending model",
      ],
      gaps: [
        "No structured reminder cadence for the growing retail book",
        "Document and disbursement status is communicated only when the borrower calls",
        "No vernacular self-service for statements, schedules or closure requests",
        "Contact outcomes are not captured systematically as retail volume builds",
      ],
    },
    risks: [
      "Current retail scale may be below the volume at which a paid pilot makes commercial sense — timing must be validated before pursuit.",
      "RBI digital-lending directions apply to all borrower communication including disclosure and grievance routing.",
      "A young operations organisation may lack the integration bandwidth for a multi-system deployment; scope must stay tight.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "These are seller assumptions at the low end of the qualifying range; actual retail-book scale must be confirmed early because it determines whether the opportunity is live now or in a year.",
    },
    pilotScope:
      "An eight-week pilot on MSME onboarding and disbursement-status communication in Hindi and Marathi for the retail book, sized deliberately small and measured on operations-team hours recovered and file turnaround.",
    expansion: [
      "Add the designed EMI reminder and early-bucket follow-up model as the book scales",
      "Extend to borrower self-service for statements, schedules and closure documentation",
      "Broaden languages and channels in step with retail-book growth",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Retail and MSME Lending",
      "Chief Technology Officer / Head of IT",
      "Chief Financial Officer",
    ],
    discovery: [
      "What is the actual live-account count in the retail and MSME book today, and the growth plan for the next year?",
      "Is servicing tooling already contracted, or is this genuinely a greenfield decision?",
      "How many people handle borrower communication today, and how does that scale in the plan?",
      "What integration bandwidth does the technology team have over the next two quarters?",
    ],
    flowTemplate: "onboarding",
    scenario: "An MSME borrower in Pune gets a Marathi update that his disbursement is scheduled for Thursday and one insurance document is still pending, without calling anyone.",
  },

  "hero-fincorp": {
    operatingContext:
      "Hero FinCorp is Hero MotoCorp's financing arm and one of India's largest two-wheeler lenders, originating at dealerships nationwide for customers who are frequently taking their first formal credit, alongside a growing book of personal loans, loans against property and SME credit. Two-wheeler finance produces the highest-frequency, lowest-ticket collections problem in Indian lending: millions of small monthly instalments, a borrower base with thin credit history and irregular income, and a cost of human contact that can rival the margin on the loan itself. Origination through dealers means the relationship is transactional from day one and all subsequent servicing happens remotely by phone in Hindi, Tamil, Telugu, Bengali and Marathi. Hero group engineering identity is manufacturing; the lending arm assembles technology from vendors and outsources significant collections capacity.",
    strategicPressure: [
      { text: "Hero FinCorp is the captive-plus financing arm of Hero MotoCorp with a very large two-wheeler loan book originated through dealerships.", kind: "verified" },
      { text: "Small-ticket, high-frequency collections make the fully loaded cost of a human call disproportionate to the instalment recovered.", kind: "verified" },
      { text: "First-time-credit borrowers require education about repayment mechanics that dealer-point origination does not deliver.", kind: "inference" },
      { text: "Heavy reliance on outsourced collections capacity creates conduct-consistency exposure that automation with full transcripts would reduce.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The lending arm procures technology and buys collections capacity from agencies; conversational automation slots into an existing purchasing pattern with a directly comparable unit cost. Hero group engineering serves vehicles, not financial-services platforms.",
    whyNotBuild:
      "Six-language speech quality, telephony at millions of contacts a month, orchestration into the loan system and continuous conduct evaluation across in-house and agency channels is a platform business, not a lending one. The economics demand deployment this year; a build would not deliver in time to matter.",
    workflows: [
      {
        name: "Two-wheeler EMI reminders and early-delinquency outreach",
        friction: "Millions of small instalments fall due monthly; in-house and agency telecalling reaches a limited share, contact quality varies widely, and cost per resolved account is high relative to the EMI.",
        outcome: "Full coverage of the due and early-delinquent base in the borrower's language within permitted hours, with payment in-channel, recorded promises and automatic follow-up.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Collections case management", "Payment gateway / UPI collect"],
        value: 3,
        complexity: 2,
      },
      {
        name: "First-time-borrower repayment education",
        friction: "Borrowers new to formal credit misunderstand mandate mechanics, bounce charges and the credit-bureau consequences of a missed EMI, producing avoidable first-payment failures.",
        outcome: "A structured welcome conversation in the borrower's language explaining the schedule, mandate and consequences, measurably reducing first-EMI bounces.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH mandate records", "Dealer origination records", "Product knowledge base"],
        value: 3,
        complexity: 2,
      },
      {
        name: "NOC, closure and hypothecation servicing",
        friction: "Closed-loan customers chase NOCs for hypothecation removal through repeated calls, and requests stall on incomplete details or dispatch uncertainty.",
        outcome: "Request captured with identity verified on first contact and status pushed proactively through issuance and delivery.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NOC / closure workflow", "Document generation and dispatch tracking", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer application and multiple digital payment options for EMI repayment",
        "Contact centre with an IVR covering EMI, balance and account queries",
        "SMS and WhatsApp reminders for due dates, bounces and receipts",
        "Large outsourced collections operation alongside in-house teams",
      ],
      gaps: [
        "Contact coverage of the due base is limited by telecalling and agency capacity",
        "No structured welcome or education conversation for first-time-credit borrowers",
        "Conduct quality across agency channels is monitored only on a sampled basis",
        "NOC and closure requests generate repeat calls with no proactive status",
      ],
    },
    risks: [
      "RBI recovery-agent norms and fair-practices expectations apply with particular force where outsourced agencies conduct contact on the lender's behalf.",
      "Digital-lending directions require disclosure and grievance routing in every borrower communication.",
      "TRAI DND and consent registration constrain reminder volumes across a very large monthly-contacted base.",
    ],
    economics: {
      volumeMonthly: 5000000,
      costPerInteraction: 0.85,
      automationRate: 0.65,
      basis: "Volume, cost per contact and automation rate are seller assumptions used to size the opportunity and must be replaced with the company's agency and in-house collections cost data.",
    },
    pilotScope:
      "A ten-week pilot on two-wheeler pre-due reminders and early-delinquency outreach in Hindi and Tamil for two states, measured on contact coverage, promise-to-pay conversion and cost per resolved account against the agency baseline.",
    expansion: [
      "Add first-time-borrower welcome and repayment-education conversations",
      "Extend to NOC, closure and hypothecation-removal servicing",
      "Broaden to personal-loan and SME books with full language coverage",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Technology Officer / Chief Digital Officer",
      "Chief Risk Officer",
    ],
    discovery: [
      "How is collections split between in-house teams and agencies, and what is the cost per resolved account in each?",
      "What proportion of the monthly due base is contacted before the EMI date?",
      "What is the first-EMI bounce rate on dealer-originated two-wheeler loans?",
      "Would replacing agency seats with automated contact be commercially and contractually feasible in the next two quarters?",
    ],
    flowTemplate: "collections",
    scenario: "A first-time two-wheeler borrower in Kanpur gets a Hindi call three days before his first EMI explaining the mandate and date, and pays on time instead of bouncing.",
  },

  "godrej-capital": {
    operatingContext:
      "Godrej Capital is the Godrej group's financial-services arm, built recently and growing quickly in home loans, loans against property and MSME lending, with a deliberately asset-light operating model in which technology is bought and integrated rather than developed in-house. Its customers are salaried and self-employed borrowers in metros and large tier-2 cities taking on decades-long mortgage relationships, plus small-business owners using property-backed credit. Housing-loan servicing is inherently long-tenure and document-heavy: disbursement in tranches tied to construction stages, document chasing during origination, interest-reset communication across the life of the loan, and closure and property-document release at the end. As a late entrant competing against established housing financiers, service experience is one of the few dimensions on which it can differentiate.",
    strategicPressure: [
      { text: "Godrej Capital is a recent entrant in home loans, LAP and MSME lending, building its book from a standing start under a group brand.", kind: "verified" },
      { text: "The company has positioned itself around an asset-light, technology-enabled operating model with capability sourced externally.", kind: "verified" },
      { text: "As a late entrant against established housing financiers, differentiated service experience is a realistic competitive lever where pricing is not.", kind: "inference" },
      { text: "Tranche-based disbursement in under-construction housing generates repeated coordination touchpoints that customers experience as friction.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led by explicit strategy. The company has stated an asset-light model in which technology capability is bought; conversational servicing is precisely the sort of capability that strategy anticipates. The competitive question is whether a platform has already been selected, not whether one will be bought.",
    whyNotBuild:
      "A new lender's scarce resources go into distribution, credit and book growth. Building speech and orchestration would contradict its declared operating model and delay the service differentiation it is trying to establish while the brand is still forming.",
    workflows: [
      {
        name: "Disbursement-tranche coordination",
        friction: "Under-construction home loans disburse in stages tied to builder milestones; customers and builders both chase status, and each tranche generates a cluster of calls and document exchanges.",
        outcome: "Proactive stage-based communication that states what is required for the next tranche, confirms receipt, and pushes disbursement status to both customer and builder contact.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan origination and management system", "Disbursement workflow", "Document management system", "Builder / project records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Origination document chase",
        friction: "Income, property and legal documents are chased by relationship managers over calls and messages; files stall, and the customer experiences silence punctuated by repeated requests.",
        outcome: "Automated follow-up naming exactly what is outstanding, validating format before submission, and keeping the customer informed of file progress without a human chaser.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Credit processing workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lifecycle servicing: resets, certificates and closure",
        friction: "Interest-reset explanations, provisional interest certificates at tax season, part-payment effects and closure with property-document release all arrive as inbound calls to a small servicing team.",
        outcome: "Self-service for resets, certificates, part-payment simulation and closure documentation, with seasonal spikes absorbed without temporary staffing.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Document generation", "Property document custody records", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Digital origination journeys and a customer application for loan servicing",
        "Relationship-managed servicing for mortgage and MSME customers",
        "Email, SMS and WhatsApp notification for disbursement and repayment events",
        "Central customer-support line for account and servicing queries",
      ],
      gaps: [
        "Tranche disbursement status is not proactively communicated to customer or builder",
        "Document chasing depends on relationship-manager availability",
        "Tax-season certificate demand has no self-service absorption",
        "Property-document release at closure has no tracked, proactive journey",
      ],
    },
    risks: [
      "Property-document custody and release is legally sensitive; any automated communication must be precise about process and never imply release has occurred.",
      "RBI fair-practices and digital-lending requirements apply to disclosure and grievance routing in borrower communication.",
      "The asset-light strategy may already have selected a CX platform, so competitive position must be established before investment.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.3,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions used to frame the case and must be validated against the company's servicing-contact and origination-funnel data.",
    },
    pilotScope:
      "An eight-week pilot on origination document chase and disbursement-tranche communication in Hindi, Marathi and English, measured on sanction-to-disbursement time and status calls avoided.",
    expansion: [
      "Extend to full lifecycle servicing including interest resets and tax-season certificates",
      "Add closure and property-document release journeys with tracked status",
      "Broaden to MSME borrower servicing and additional languages as the book spreads",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Technology Officer / Chief Digital Officer",
      "Head of Home Loans and LAP",
      "Head of Customer Experience and Operations",
      "Chief Risk Officer",
    ],
    discovery: [
      "Has the asset-light technology strategy already selected a customer-experience or conversational platform?",
      "What is the current sanction-to-disbursement time, and how much of it is document-related waiting?",
      "How many contacts does a typical under-construction tranche disbursement generate?",
      "How is service experience measured today, and is it an explicit competitive objective?",
    ],
    flowTemplate: "onboarding",
    scenario: "A home-loan customer in Mumbai awaiting a construction-stage disbursement is told proactively which builder certificate is pending and when the tranche will release.",
  },

  "ugro-capital": {
    operatingContext:
      "UGRO Capital is a listed non-banking financial company focused on MSME lending, built around sector-specific credit scorecards for a defined set of focus industries and a co-lending model that originates loans jointly with banks and other institutions. That structure multiplies communication requirements: borrowers need servicing on their loan while co-lending partners need reconciliation, status and reporting flows on the shared exposure. Its borrowers are small manufacturers, traders, healthcare providers and service businesses spread across Gujarat, Maharashtra, Tamil Nadu, Delhi NCR and other clusters, who are phone-first and vernacular. The company's data-science investment is concentrated on underwriting and scorecards rather than servicing automation, and its technology beyond credit is procured.",
    strategicPressure: [
      { text: "UGRO's model combines sector-specific MSME underwriting with co-lending partnerships that share exposure with banks and other lenders.", kind: "verified" },
      { text: "Co-lending creates parallel servicing and reconciliation obligations that a single-lender operating model does not have.", kind: "inference" },
      { text: "Its data-science capability is directed at credit scorecards, leaving servicing communication as a comparatively manual function.", kind: "inference" },
      { text: "Co-lending partner banks may impose contractual constraints on how and through what channels borrowers can be contacted.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company's engineering and analytics investment is deliberately concentrated in underwriting, which is where it claims differentiation. Servicing communications is procured operational capability, and the co-lending dimension makes auditability of every borrower contact particularly valuable.",
    whyNotBuild:
      "UGRO's thesis is that sector-specific credit scoring produces better MSME underwriting. Building conversational infrastructure would dilute that focus, and the co-lending structure means communication records must satisfy partner banks — a governed platform with complete transcripts does that better than a first-generation internal build.",
    workflows: [
      {
        name: "Co-lent MSME repayment servicing",
        friction: "Borrowers on co-lent facilities are unclear which entity they owe, receive communication from more than one party, and repayment queries require manual reconciliation between systems.",
        outcome: "A single clear borrower conversation covering the full facility with correct apportionment explained, payment captured, and a record both lenders can rely on.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Co-lending reconciliation platform", "Payment gateway", "Partner-bank interface records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "MSME EMI reminders and early-bucket follow-up",
        friction: "Reminder and follow-up calling is done by a modest telecalling team across many states and languages, so coverage and quality vary by geography.",
        outcome: "Complete coverage in the borrower's language within permitted hours, with payment options in-channel, structured reason capture and full logging for partner reporting.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "NACH / payment status", "Collections case management", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Origination document chase and disbursement status",
        friction: "MSME borrowers submit incomplete documentation and then wait; relationship managers chase manually, and disbursement timing is opaque to the borrower.",
        outcome: "Automated multilingual follow-up naming the outstanding item, validating submissions, and pushing disbursement status without human chasing.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Disbursement workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Digital MSME origination journeys with sector-specific underwriting workflows",
        "Customer portal and payment options for loan servicing",
        "Central customer-support line and email servicing",
        "SMS and email notification for dues, disbursement and receipts",
      ],
      gaps: [
        "Borrowers on co-lent facilities receive fragmented communication across lenders",
        "Reminder coverage varies by state because it depends on a small multilingual telecalling team",
        "Document chase and disbursement status are manual and opaque to the borrower",
        "Contact records are not structured for partner-bank reporting requirements",
      ],
    },
    risks: [
      "Co-lending agreements may constrain borrower-communication channels, branding and data sharing; contractual review is a prerequisite.",
      "RBI co-lending and digital-lending directions govern disclosure, grievance routing and borrower clarity about who the lender is.",
      "Recovery-agent and fair-practices norms apply to all repayment contact including on the partner's share.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for indicative modelling and must be validated against the company's servicing and collections data.",
    },
    pilotScope:
      "An eight-week pilot on MSME EMI reminders and early-bucket follow-up in Hindi, Gujarati and Tamil for a defined co-lending programme, with full transcript logging structured for partner reporting.",
    expansion: [
      "Extend to unified co-lent facility servicing with apportionment explanation",
      "Add origination document chase and disbursement-status communication",
      "Broaden languages and channels across all focus sectors and clusters",
    ],
    stakeholders: [
      "Executive Chairman / Managing Director",
      "Chief Operating Officer",
      "Chief Technology Officer / Head of Data and Analytics",
      "Head of Collections",
      "Head of Co-lending Partnerships",
    ],
    discovery: [
      "Do co-lending agreements contractually constrain borrower-communication channels or branding?",
      "What proportion of the due base is contacted before the EMI date, and how does it vary by state?",
      "What reporting do partner banks require on borrower contact, and how is it produced today?",
      "How much relationship-manager time goes to document chasing rather than sourcing?",
    ],
    flowTemplate: "collections",
    scenario: "An MSME borrower in Surat on a co-lent facility is reminded in Gujarati of a single consolidated EMI, pays through a link, and both lenders receive the same logged record.",
  },

  "sk-finance": {
    operatingContext:
      "SK Finance, formerly Ess Kay Fincorp, is a Jaipur-headquartered non-banking financial company lending against used cars, commercial vehicles, tractors and small-business assets across Rajasthan, Gujarat, Madhya Pradesh and neighbouring states. Its borrowers are drivers, farmers and small traders in semi-urban and rural markets, reached through a dense branch network and a field-officer model where the same officer sources, monitors and collects. Repayment communication is largely conducted face to face or by phone in Hindi, Marwari and Gujarati, because these borrowers do not use apps and often do not read written notices. Private-equity backing and an IPO trajectory have put cost ratios and operating leverage under scrutiny, while reminder calling continues to consume field-officer hours that should go to sourcing and monitoring.",
    strategicPressure: [
      { text: "The company lends against used vehicles and small-business assets across Rajasthan, Gujarat and central India through a branch-and-field model.", kind: "verified" },
      { text: "Field officers perform both collections and sourcing, so routine reminder calling directly reduces business-development capacity.", kind: "verified" },
      { text: "Private-equity backing and public-market ambitions put operating leverage and cost ratios under external scrutiny.", kind: "inference" },
      { text: "Borrowers in these geographies are voice-only in practice; written and app-based channels do not reach them.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. A vendor-sourced technology estate, no engineering bench and a sponsor-driven efficiency agenda make this a purchase decision judged on cost per resolved account and on field-officer hours recovered.",
    whyNotBuild:
      "The company's advantage is used-asset valuation and recovery capability in specific districts. Building Hindi, Marwari and Gujarati speech infrastructure would consume capital and management attention with no effect on either, and would arrive years after the operating-leverage question is settled.",
    workflows: [
      {
        name: "Used-vehicle EMI reminders freeing field capacity",
        friction: "Field officers spend a large share of the collection week phoning due borrowers, which competes directly with the field visits and sourcing that drive both portfolio quality and growth.",
        outcome: "Every due borrower reached in Hindi, Marwari or Gujarati on schedule with payment options in-channel, returning field-officer hours to visits and origination.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / UPI collect", "Field-officer allocation records", "Collections case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-bounce triage before a field visit",
        friction: "A missed instalment triggers a field visit without knowing whether the borrower needs three days or is genuinely distressed, so expensive visits are spent on cases a phone call would resolve.",
        outcome: "Next-day conversation establishing the reason and expected resolution date, so field visits are reserved for genuine cases and are better prepared when they happen.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Collections case management", "Field-officer routing", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loan servicing and closure documentation",
        friction: "Borrowers call branches for outstanding balance, foreclosure amounts and post-closure NOC status, interrupting officers who are underwriting or travelling.",
        outcome: "Vernacular self-service for balances, quotes and NOC status with documents delivered digitally where permitted and appointments booked where not.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "NOC / closure workflow", "Document generation", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch and field-officer network handling sourcing, monitoring and collection",
        "Customer payment options through online and app-based channels",
        "SMS reminders and alerts for due dates and receipts",
        "Central customer-support line for loan queries",
      ],
      gaps: [
        "Reminder calling consumes field-officer time that should go to visits and sourcing",
        "No triage step before dispatching a field visit after a bounce",
        "No self-service route for balance, foreclosure and NOC queries",
        "Contact outcomes are captured inconsistently across officers and branches",
      ],
    },
    risks: [
      "RBI recovery-agent and fair-practices norms govern contact hours, tone and frequency, with vehicle finance under particular scrutiny.",
      "Marwari and regional Hindi dialect performance must be benchmarked on real borrower audio before commitment.",
      "Field-officer adoption depends on the automation being positioned as protecting their earnings capacity, not replacing their role.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions for framing only and must be replaced with the company's collections cost and field-officer time data during discovery.",
    },
    pilotScope:
      "An eight-week pilot on used-vehicle EMI reminders and post-bounce triage in Hindi and Marwari across two Rajasthan clusters, measured on field-officer hours recovered, visits avoided and on-time repayment.",
    expansion: [
      "Extend to Gujarat and Madhya Pradesh with Gujarati coverage",
      "Add inbound servicing for balance, foreclosure and NOC queries",
      "Layer distress identification and restructuring routing across the portfolio",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Collections",
      "Chief Technology Officer",
      "Chief Financial Officer (sponsor-facing efficiency owner)",
    ],
    discovery: [
      "How is field-officer time split between collection visits, phone reminders and sourcing?",
      "What proportion of due borrowers receive a reminder call each month?",
      "How many field visits end with nothing more than a short payment extension?",
      "Are sponsors pushing a specific operating-leverage target this cycle, and who owns it?",
    ],
    flowTemplate: "collections",
    scenario: "A used-car borrower in Jodhpur is called in Marwari the morning his EMI is due, pays through a link, and the field officer spends that afternoon closing two new loans instead.",
  },

  "veritas-finance": {
    operatingContext:
      "Veritas Finance is a Chennai-headquartered non-banking financial company lending small secured loans to micro-enterprises — provision stores, tailoring units, small workshops and service businesses — across rural and semi-urban Tamil Nadu and increasingly the eastern states. Its borrowers are very often taking their first formal loan, having previously relied on informal credit, which means they need the entire mechanics of a loan explained: what an EMI is, when it is debited, what happens if it bounces, and how to read a repayment schedule. The company operates a branch-and-field model where officers underwrite locally and maintain the relationship, and that guidance load falls on them repeatedly. Technology is procured, the organisation is field-first, and there is no internal software capability.",
    strategicPressure: [
      { text: "The company lends to micro-enterprise borrowers who are frequently accessing formal credit for the first time.", kind: "verified" },
      { text: "First-time borrowers generate disproportionate how-do-I-pay and schedule-explanation contact throughout the loan, not just at onboarding.", kind: "inference" },
      { text: "Expansion into eastern states adds Bengali, Odia and Hindi to a servicing model built for Tamil.", kind: "inference" },
      { text: "Because guidance load falls on branch officers, it is invisible in cost reporting while directly consuming origination capacity.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A field-first organisation with procured technology and no engineering function will contract a communications capability. The proposition is unusual in that its primary value is borrower education and comprehension, not just collections efficiency.",
    whyNotBuild:
      "Nothing about lending to micro-enterprises produces conversational-AI capability, and multilingual speech across Tamil, Bengali, Odia and Hindi is well beyond anything the company could staff. Its edge is local credit judgement and repeat-borrower relationships.",
    workflows: [
      {
        name: "First-time-borrower repayment guidance",
        friction: "Borrowers new to formal credit repeatedly ask how, when and where to pay, and what a bounce means; each question goes to the branch officer who explained it at disbursement.",
        outcome: "On-demand vernacular explanation of schedule, payment methods, bounce consequences and part-payment effects, reducing both call volume and preventable defaults.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Product and policy knowledge base", "NACH mandate records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-due reminders and payment capture",
        friction: "Reminder calling is performed by branch officers and a small central team; coverage is partial and skewed toward borrowers who are easiest to reach.",
        outcome: "Complete pre-due coverage in the borrower's language with payment options offered in-channel and confirmations recorded against the account.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / UPI collect", "Collections case management", "Field-officer mobile application"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Statement, receipt and closure servicing",
        friction: "Borrowers ask for payment receipts, outstanding balances and closure documentation, often to satisfy a third party, and the branch produces each one manually.",
        outcome: "Self-service issuance of receipts, statements and closure confirmations delivered in-channel, with property-document release appointments booked where required.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Document generation", "Document custody records", "Appointment scheduling"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Branch-and-field officer model providing in-person guidance and collection",
        "Customer payment options through digital channels and branch counters",
        "SMS reminders and receipts for repayment events",
        "Central customer-support line for loan queries",
      ],
      gaps: [
        "Repayment-mechanics guidance depends entirely on branch officers repeating themselves",
        "Reminder coverage does not reach the whole due base",
        "No self-service for receipts, statements or closure confirmations",
        "Eastern-state languages are not supported as the network expands",
      ],
    },
    risks: [
      "RBI fair-practices and digital-lending norms require clear disclosure and accessible grievance routes for first-time borrowers in particular.",
      "Recovery-agent rules govern all repayment contact including automated calls.",
      "Comprehension is the real design constraint: DPDP consent and product explanations must be genuinely understandable to low-literacy borrowers in each language.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 0.95,
      automationRate: 0.55,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for indicative modelling and must be validated against branch-call volumes and collections data.",
    },
    pilotScope:
      "An eight-week pilot combining first-time-borrower repayment guidance and pre-due reminders in Tamil across two districts, measured on branch-officer time recovered, on-time repayment and first-EMI failure rate.",
    expansion: [
      "Extend to Bengali and Odia as the eastern network scales",
      "Add self-service receipts, statements and closure confirmations",
      "Layer structured post-bounce conversations with reason capture",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Branch Operations",
      "Head of Collections and Credit Administration",
      "Chief Technology Officer",
    ],
    discovery: [
      "Is first-time-borrower query load measured anywhere, or absorbed invisibly by branch officers?",
      "What is the first-EMI failure rate, and how much of it is comprehension rather than capacity?",
      "What proportion of due borrowers receive a pre-due reminder today?",
      "Which languages will the eastern expansion require in the next twelve months?",
    ],
    flowTemplate: "onboarding",
    scenario: "A tailoring-unit owner near Tiruvannamalai calls in Tamil to ask how to pay her first EMI, is walked through UPI payment step by step, and pays on the same call.",
  },

  "lic-housing-finance": {
    operatingContext:
      "LIC Housing Finance is one of India's largest housing finance companies, promoted by Life Insurance Corporation and originating substantially through LIC's agent network alongside its own marketing organisation and branch offices across the country. Its distinguishing characteristic is the sheer size and age of its back book: millions of live home loans, many originating years or decades ago, generating a continuous stream of interest-reset notices, statement and provisional-interest-certificate requests, foreclosure quotes, part-payment queries and property-document retrieval requests at closure. Because origination is agent-assisted rather than digital-native, customers expect assisted service and call rather than self-serve, and they do so in Hindi, Marathi, Tamil, Telugu, Bengali and English. The parent's conservative, process-driven culture and a thin technology bench make packaged, vendor-delivered automation the realistic route.",
    strategicPressure: [
      { text: "LIC Housing Finance is one of India's largest housing financiers with a very large, long-tenure live loan book originated substantially through LIC's agent network.", kind: "verified" },
      { text: "Long-tenure mortgages generate lifecycle servicing contacts — resets, certificates, quotes, document retrieval — that continue for decades per loan.", kind: "verified" },
      { text: "Provisional interest certificates create a sharp annual demand spike concentrated in the tax-filing window each year.", kind: "inference" },
      { text: "Agent-led origination sets an expectation of assisted service that app-based self-service has not displaced.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company's technology bench is thin relative to its balance sheet, its parent culture is conservative and process-driven, and its capability additions are procured. The volume argues loudly for automation; nothing argues for building it.",
    whyNotBuild:
      "Six-language speech quality, telephony at a scale of millions of live loans, orchestration into a long-lived loan-management estate, and evaluation of regulated conversations are four disciplines the organisation has never operated. Its distribution advantage comes from LIC's agent network, and no amount of internal engineering would strengthen that.",
    workflows: [
      {
        name: "Statement, interest-certificate and tax-season servicing",
        friction: "Provisional interest certificates and statements are requested by post, email and phone; volume spikes hard each tax season and the servicing team absorbs it with overtime and delay.",
        outcome: "Instant authenticated issuance of certificates and statements in-channel in the customer's language, absorbing the seasonal spike without temporary staffing.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "Document generation", "Customer master / KYC records", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Interest-reset and part-payment explanation",
        friction: "Rate resets change EMIs or tenures and generate confusion and complaint calls; part-payment questions require a manual calculation and a callback.",
        outcome: "Clear conversational explanation of the reset with the new EMI or tenure stated, and part-payment scenarios simulated live so the customer can decide on the call.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Rate and amortisation engine", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Foreclosure quote and property-document retrieval",
        friction: "Customers closing a loan need an accurate foreclosure figure and then chase the return of original property documents for weeks with no visibility.",
        outcome: "Instant foreclosure quotes with validity stated, and a tracked document-retrieval journey with proactive status and a collection appointment at the right office.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "Foreclosure calculation engine", "Property document custody records", "Appointment scheduling"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Customer portal and mobile application for loan account information and payments",
        "Contact centre with an IVR covering balance, EMI and certificate requests",
        "Branch and area-office network providing in-person servicing",
        "SMS and email notification for dues, receipts and reset events",
      ],
      gaps: [
        "Tax-season certificate demand overwhelms servicing capacity annually",
        "Interest-reset changes are notified rather than explained, generating complaint volume",
        "Foreclosure quotes require manual calculation and callback",
        "Property-document retrieval after closure has no tracked, proactive journey",
      ],
    },
    risks: [
      "Property-document custody and release is legally consequential; automated communication must be precise about process and never imply release has occurred.",
      "National Housing Bank and RBI conduct expectations apply to disclosure of resets, charges and foreclosure terms.",
      "Parent-influenced governance and procurement processes are conservative and may extend approval timelines materially.",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Interaction volume, cost per contact and automation rate are seller assumptions for indicative sizing and must be replaced with the company's servicing-request and contact-centre data.",
    },
    pilotScope:
      "A ten-week pilot on statement and provisional interest-certificate issuance in Hindi, Marathi and Tamil ahead of the tax season, measured on requests served without human handling and turnaround time.",
    expansion: [
      "Add interest-reset explanation and live part-payment simulation",
      "Extend to foreclosure quotes and tracked property-document retrieval",
      "Broaden language coverage and add proactive lifecycle communication across the back book",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Chief Technology Officer / Head of IT",
      "Head of Customer Service and Operations",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What is the current backlog and turnaround time for statement and document-retrieval requests?",
      "How large is the tax-season certificate spike relative to baseline volume?",
      "How many complaint contacts follow each interest-reset cycle?",
      "How long does property-document retrieval take today, and how many contacts does it generate per closure?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A home-loan customer in Nagpur requests her provisional interest certificate in Marathi in July and receives it on WhatsApp within the same conversation.",
  },

  "pnb-housing-finance": {
    operatingContext:
      "PNB Housing Finance is a large listed housing financier, promoted by Punjab National Bank, that has completed a balance-sheet turnaround and pivoted growth toward affordable housing through its dedicated Roshni business alongside its established prime and salaried retail book. That pivot changes its servicing profile substantially: affordable-housing borrowers are self-employed and informal-income, need construction-linked disbursement coordinated with small builders, require repeated document follow-up, and communicate in Hindi-belt and western regional languages rather than English. The company operates branches and outreach offices across the country with digital origination journeys, and it buys and integrates technology rather than developing platforms internally. Post-turnaround management attention is on profitable growth and asset quality, with operational capability procured to support it.",
    strategicPressure: [
      { text: "PNB Housing Finance has pivoted growth toward affordable housing through a dedicated Roshni business alongside its prime retail book.", kind: "verified" },
      { text: "Affordable-housing borrowers require materially more servicing touch per account than the salaried prime book the company was built around.", kind: "inference" },
      { text: "Construction-linked disbursement with small builders creates coordination touchpoints between borrower, builder and lender at every tranche.", kind: "inference" },
      { text: "Two distinct customer segments in one servicing organisation create conflicting language, tone and channel requirements.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company procures and integrates technology; its post-turnaround management is focused on growth and asset quality rather than platform building. Servicing capability for the affordable segment is exactly the kind of operational capacity it would contract.",
    whyNotBuild:
      "Building multilingual conversational infrastructure would compete for management attention with a growth pivot that is the company's entire equity story. The affordable-housing servicing problem is immediate; a build would deliver long after the segment's economics are set.",
    workflows: [
      {
        name: "Affordable-housing disbursement-tranche coordination",
        friction: "Construction-linked disbursements require builder certificates and site verification; borrowers and small builders both chase status by phone, and each tranche produces a cluster of calls.",
        outcome: "Proactive stage-based communication stating what is required for the next tranche, confirming receipt, and pushing disbursement status to both borrower and builder.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination and management system", "Disbursement workflow", "Document management system", "Builder / project records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Origination document chase for informal-income borrowers",
        friction: "Self-employed borrowers submit incomplete or non-standard income documentation; relationship managers chase manually and files stall for weeks with the borrower uninformed.",
        outcome: "Automated vernacular follow-up naming the exact pending item with format guidance, validation before submission, and file-progress visibility for the borrower.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Credit processing workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "EMI reminders and lifecycle servicing",
        friction: "The affordable book needs pre-due reminders and repayment guidance that the prime book never required, while both segments generate statement, reset and certificate requests.",
        outcome: "Segment-appropriate vernacular reminders and self-service for statements, resets and certificates across both books on one deployment.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Payment gateway / NACH status", "Document generation", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Digital origination journeys and a customer portal for loan servicing",
        "Contact centre with an IVR covering EMI, balance and certificate requests",
        "Branch and outreach-office network serving both prime and affordable segments",
        "SMS, email and WhatsApp notification for dues, disbursement and receipts",
      ],
      gaps: [
        "Tranche disbursement status is not proactively communicated to borrower or builder",
        "Document chasing for informal-income files is manual and slow",
        "Affordable-segment borrowers have no vernacular conversational servicing path",
        "Reminder coverage on the affordable book is not systematic",
      ],
    },
    risks: [
      "National Housing Bank and RBI conduct expectations govern disclosure, charges and grievance routing across both segments.",
      "Property-document custody and release must be communicated precisely, never implying release has occurred.",
      "Recovery-agent and fair-practices norms apply to reminder and follow-up contact on the affordable book.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions used to frame the case and must be validated against the company's servicing and origination-funnel data.",
    },
    pilotScope:
      "A ten-week pilot on affordable-housing document chase and disbursement-tranche communication in Hindi, Marathi and Gujarati within the Roshni business, measured on sanction-to-disbursement time and status calls avoided.",
    expansion: [
      "Add EMI reminders and repayment guidance across the affordable book",
      "Extend to lifecycle servicing including statements, resets and certificates for both segments",
      "Broaden language coverage as the affordable network expands geographically",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Business Head, Affordable Housing (Roshni)",
      "Chief Technology Officer / Chief Digital Officer",
      "Head of Customer Service and Operations",
      "Chief Risk Officer",
    ],
    discovery: [
      "How fast is the affordable book growing, and what is its servicing cost per account versus the prime book?",
      "What is the current sanction-to-disbursement time in the affordable segment, and how much is document waiting?",
      "How many contacts does a typical construction-linked tranche generate across borrower and builder?",
      "Is affordable-segment servicing staffed separately, or shared with the prime contact centre?",
    ],
    flowTemplate: "onboarding",
    scenario: "A self-employed borrower in Indore is told in Hindi that his builder's stage certificate is the only item pending, and receives confirmation when the next tranche releases.",
  },

  "can-fin-homes": {
    operatingContext:
      "Can Fin Homes is a housing finance company promoted by Canara Bank, with a South-India-weighted branch network and a book concentrated in salaried and professionally employed borrowers taking standard home loans. Its institutional identity is lean operations and conservative underwriting: a famously small head office, low cost ratios, and a business model that avoids complexity. Servicing volume is therefore steady-state and predictable rather than collections-driven — interest resets, provisional interest certificates concentrated in the tax-filing season, statement requests, part-payment queries and closure documentation with property-document release. Customers reach the company through branches and a contact centre, in Kannada, Telugu, Tamil, Hindi and English. Technology is procured from vendors, and the organisation has neither the size nor the inclination to build.",
    strategicPressure: [
      { text: "Can Fin Homes is a Canara Bank-promoted housing financier known for lean operations and low cost ratios with a South-India-weighted book.", kind: "verified" },
      { text: "A salaried-borrower book produces predictable lifecycle servicing rather than heavy collections load.", kind: "verified" },
      { text: "Provisional interest certificates create a concentrated annual spike that a lean servicing team absorbs with delay.", kind: "inference" },
      { text: "The company's cost-leadership identity makes headcount-free capacity uniquely attractive but also caps what it will pay.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. A company whose entire identity is lean operations will not build technology. It buys proven, low-risk solutions with clear payback, and its decision will hinge on price relative to the servicing cost it displaces.",
    whyNotBuild:
      "There is no engineering function and no cultural appetite for one. Building multilingual speech and orchestration would contradict the operating philosophy that produces the company's cost advantage in the first place.",
    workflows: [
      {
        name: "Tax-season interest-certificate and statement issuance",
        friction: "Provisional interest certificate requests spike sharply in the tax-filing window; a small servicing team handles them by email and branch counter, with multi-day turnaround at exactly the wrong moment.",
        outcome: "Instant authenticated issuance in the customer's language delivered in-channel, absorbing the annual spike with no additional staffing.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "Document generation", "Customer master / KYC records", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Interest-reset and part-payment servicing",
        friction: "Rate resets change EMIs and generate confusion calls; part-payment and tenure-reduction questions require manual calculation and a callback from the branch.",
        outcome: "Conversational explanation of the reset with the new EMI stated and live part-payment simulation so the customer decides on the call.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Rate and amortisation engine", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Closure and property-document release",
        friction: "Borrowers closing loans need an accurate foreclosure figure and then chase original property documents through branch visits and calls with no status visibility.",
        outcome: "Instant foreclosure quotes and a tracked document-release journey with proactive status and a collection appointment at the holding branch.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Loan management system", "Foreclosure calculation engine", "Property document custody records", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer portal and mobile access for loan account information and payments",
        "Contact centre and branch phone lines for servicing queries",
        "Email-based certificate and statement issuance",
        "SMS notification for dues, receipts and reset events",
      ],
      gaps: [
        "Tax-season certificate demand exceeds servicing capacity every year",
        "Interest resets are notified without conversational explanation",
        "Part-payment scenarios require a manual calculation and callback",
        "Property-document release after closure has no tracked, proactive journey",
      ],
    },
    risks: [
      "Property-document custody and release must be communicated with precision and never implied to have occurred prematurely.",
      "National Housing Bank and RBI conduct expectations govern disclosure of resets, charges and foreclosure terms.",
      "Price sensitivity is acute: a proposal that does not clearly beat the incremental cost of temporary seasonal staffing will not proceed.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Volume, cost and automation rate are seller assumptions for indicative modelling and must be validated against the company's servicing-request volumes, especially the seasonal peak.",
    },
    pilotScope:
      "An eight-week pilot on tax-season interest-certificate and statement issuance in Kannada, Telugu and Tamil, timed ahead of the filing window and measured on requests served without human handling and turnaround time.",
    expansion: [
      "Add interest-reset explanation and live part-payment simulation",
      "Extend to foreclosure quotes and tracked property-document release",
      "Broaden to general account servicing across the branch network",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief General Manager / Head of Operations",
      "Head of Information Technology",
      "Head of Customer Service",
      "Chief Financial Officer",
    ],
    discovery: [
      "How large is the tax-season certificate spike relative to baseline monthly volume?",
      "What is the current turnaround on certificate and statement requests during the peak?",
      "How many contacts follow each interest-reset cycle?",
      "What is the realistic annual servicing-technology budget given the cost-leadership mandate?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A salaried borrower in Bengaluru requests his provisional interest certificate in Kannada during filing season and receives it in the same conversation instead of waiting three days.",
  },

  "sammaan-capital": {
    operatingContext:
      "Sammaan Capital is the rebranded successor to Indiabulls Housing Finance, transitioning toward an asset-light originate-and-co-lend model while running down a large legacy loan book accumulated under the previous brand. That dual-track structure defines its servicing problem: legacy borrowers hold long-tenure mortgage and LAP relationships and need statements, resets, foreclosure quotes and property-document release, while simultaneously asking who the company now is and whether their loan terms have changed. Retention of the legacy book directly protects franchise value during the transition, and every unanswered brand-transition question is a reason for a borrower to refinance elsewhere. The company originates through digital channels and partnerships, and its technology is procured rather than internally developed, with management attention absorbed by balance-sheet transition.",
    strategicPressure: [
      { text: "The company rebranded from Indiabulls Housing Finance to Sammaan Capital while shifting toward an asset-light co-lending model.", kind: "verified" },
      { text: "Rebranding creates a distinct wave of borrower queries about identity, account continuity and whether terms have changed.", kind: "inference" },
      { text: "Legacy-book retention protects franchise value during the transition, making servicing quality a balance-sheet issue rather than a cost one.", kind: "inference" },
      { text: "Management bandwidth is consumed by the balance-sheet transition, so servicing improvements must be low-effort to adopt.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Technology is procured, management attention is on balance-sheet transition, and the servicing need is immediate and time-bound to the transition window. That combination makes a contracted deployment the only realistic option.",
    whyNotBuild:
      "A company running down a legacy book while rebuilding its origination model will not fund platform development. The brand-transition communication window is measured in quarters, and anything built internally would arrive after it closes.",
    workflows: [
      {
        name: "Brand-transition and account-continuity communication",
        friction: "Legacy borrowers receive communication under a new name, question whether their loan has been sold, and call to confirm that terms, EMI and account details are unchanged.",
        outcome: "Clear, consistent conversational reassurance in the borrower's language confirming continuity, with the account details verified live and the change explained once, properly.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Customer master records", "Communication templates and policy references", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Legacy-book lifecycle servicing",
        friction: "Statements, interest resets, part-payment queries and foreclosure quotes on a large legacy book reach a servicing organisation whose attention is on the transition.",
        outcome: "Self-service for statements, resets, part-payment simulation and foreclosure quotes, keeping legacy borrowers well served without additional headcount.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Rate and amortisation engine", "Document generation", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Retention outreach on refinance-risk accounts",
        friction: "Borrowers approaching reset dates or receiving competitor balance-transfer offers leave without any conversation, and the loss is visible only after the payoff arrives.",
        outcome: "Proactive conversations at reset and risk moments presenting policy-bounded retention options, with high-value cases routed to a human for negotiation.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Retention offer matrix", "Payoff / balance-transfer records", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer portal and mobile application for loan servicing and payments",
        "Contact centre with an IVR covering EMI, balance and statement requests",
        "Email and SMS notification for dues, receipts and rebrand communication",
        "Digital origination journeys under the co-lending model",
      ],
      gaps: [
        "Brand-transition questions are handled inconsistently across agents",
        "Interest resets and part-payment queries require human calculation and callback",
        "No proactive retention conversation before a balance transfer completes",
        "Property-document release at closure has no tracked, proactive journey",
      ],
    },
    risks: [
      "Communication about brand transition and account continuity must be legally precise about what has and has not changed.",
      "National Housing Bank and RBI conduct expectations govern disclosure of terms, charges and foreclosure conditions.",
      "Servicing budget may be squeezed by wind-down priorities, so the pilot must be small and demonstrably retention-positive.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.15,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for framing only and must be replaced with the company's servicing-contact and attrition data.",
    },
    pilotScope:
      "An eight-week pilot combining brand-transition reassurance and legacy-book statement and reset servicing in Hindi, Marathi and English, measured on call containment and legacy-book attrition in the pilot cohort.",
    expansion: [
      "Add proactive retention outreach at reset and balance-transfer risk moments",
      "Extend to foreclosure quotes and property-document release journeys",
      "Broaden to servicing on the new co-lent origination book",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Customer Service and Operations",
      "Chief Technology Officer",
      "Chief Financial Officer",
    ],
    discovery: [
      "What proportion of inbound contacts since the rebrand relate to identity or account continuity?",
      "What is the current legacy-book attrition rate, and is any retention conversation happening before payoff?",
      "Does servicing budget survive the wind-down prioritisation, and who defends it?",
      "How many contacts follow each interest-reset cycle on the legacy book?",
    ],
    flowTemplate: "retention",
    scenario: "A legacy mortgage borrower in Thane calls to ask whether his loan has been sold to a new company, and is reassured in Marathi that his terms, EMI and account are unchanged.",
  },

  "aavas-financiers": {
    operatingContext:
      "Aavas Financiers is a Jaipur-headquartered affordable-housing finance company lending to self-employed and informal-income borrowers — small traders, artisans, transport operators and daily-wage earners — in tier-2 to tier-5 towns across Rajasthan, Gujarat, Madhya Pradesh, Maharashtra and adjacent states. Its credit model relies on in-person income assessment and long-term relationship monitoring conducted through a dense branch network, and its borrowers deal with the company in Hindi and Marwari, almost never through an app. Informal-income lending is servicing-intensive: repayment mechanics must be explained repeatedly, documents chased through origination, disbursements coordinated for self-construction, and instalments reminded each month for households whose income arrives irregularly. Private-equity influence on the board keeps efficiency metrics prominent, and technology is bought and integrated rather than built.",
    strategicPressure: [
      { text: "Aavas lends to self-employed, informal-income borrowers for affordable housing in tier-2 to tier-5 towns across northern and western India.", kind: "verified" },
      { text: "Informal-income borrowers require materially more touchpoints per account than salaried mortgage customers over the life of the loan.", kind: "inference" },
      { text: "Hindi and Marwari are the practical service languages, and written or app-based channels do not reach much of the base.", kind: "inference" },
      { text: "Board-level efficiency focus makes cost per serviced account a live metric as the branch network expands.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company's technology posture is buy-and-integrate, its differentiation is in-person income assessment, and its board watches efficiency metrics. A conversational capability priced per interaction fits directly into how it evaluates operational spend.",
    whyNotBuild:
      "Hindi and Marwari speech quality, telephony to rural handsets and orchestration into the loan system are outside anything the company operates. Its credit edge is a field process that no amount of internal engineering improves.",
    workflows: [
      {
        name: "Affordable-housing EMI reminders and repayment guidance",
        friction: "Borrowers with irregular income need reminders timed to when money is actually in hand, but reminder calling is done by branch staff on a fixed cycle with partial coverage.",
        outcome: "Complete pre-due coverage in Hindi and Marwari with payment options in-channel, repayment mechanics explained on demand, and confirmations recorded.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / NACH status", "Collections case management", "Branch and officer records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Self-construction disbursement coordination",
        friction: "Loans for self-built homes disburse in stages tied to construction progress; borrowers do not know what evidence is needed for the next tranche and call the branch repeatedly.",
        outcome: "Stage-based proactive communication stating exactly what is required, confirming receipt of evidence, and pushing disbursement status without a human chaser.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination and management system", "Disbursement workflow", "Site verification records", "Document management system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Origination document chase for informal income",
        friction: "Income evidence for self-employed borrowers is non-standard and often incomplete; files stall while branch staff chase documents between field assessments.",
        outcome: "Automated vernacular follow-up naming the exact pending item with guidance, validation before submission, and visible file progress for the borrower.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Credit processing workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Dense branch network conducting in-person assessment and relationship servicing",
        "Customer application and digital payment options for EMI repayment",
        "SMS reminders and receipts for repayment events",
        "Central customer-support line for loan queries",
      ],
      gaps: [
        "Reminder coverage does not reach every due borrower, and timing is not adapted to irregular income",
        "Self-construction disbursement requirements are not proactively communicated",
        "Document chasing is manual and competes with field assessment time",
        "No vernacular self-service for statements, schedules or closure queries",
      ],
    },
    risks: [
      "National Housing Bank and RBI fair-practices expectations govern disclosure, charges and repayment communication.",
      "Recovery-agent norms apply to reminder and follow-up contact with a financially vulnerable borrower base.",
      "Comprehension is a design constraint: explanations and consent must work for low-literacy borrowers in Hindi and Marwari.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions used to frame the business case and must be validated against the company's touch-per-account and servicing-cost data.",
    },
    pilotScope:
      "An eight-week pilot on EMI reminders and repayment guidance in Hindi and Marwari across two Rajasthan clusters, measured on contact coverage, on-time repayment and branch hours recovered.",
    expansion: [
      "Add self-construction disbursement-stage coordination",
      "Extend to origination document chase with validated submissions",
      "Broaden to Gujarati and Marathi as the western network scales",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Chief Business Officer / Head of Branch Network",
      "Head of Collections",
      "Chief Technology Officer",
    ],
    discovery: [
      "How many touchpoints does an informal-income account generate per year versus a salaried benchmark?",
      "What proportion of due borrowers receive a reminder call each month, and who makes it?",
      "How many contacts does a typical self-construction disbursement stage generate?",
      "Is cost per serviced account tracked at board level, and what is the target trajectory?",
    ],
    flowTemplate: "collections",
    scenario: "A self-employed borrower in Sikar is reminded in Marwari two days before her EMI, explains her income arrives on the 8th, and is offered a payment link she uses that morning.",
  },

  "aptus-value-housing": {
    operatingContext:
      "Aptus Value Housing Finance is a Chennai-headquartered affordable-housing lender concentrated in Tamil Nadu, Andhra Pradesh, Telangana and Karnataka, lending to self-employed and informally documented households — small shopkeepers, tailors, drivers and agricultural workers — buying or building modest homes. Its operating model is branch-led with in-house sourcing and collections rather than intermediaries, and its industry-leading margins depend on keeping operating expenses tightly controlled as the branch network expands. Borrowers interact in Tamil, Telugu and Kannada, overwhelmingly by phone and in person, and require explanation of repayment mechanics and construction-linked disbursement throughout the loan. Technology is procured; the company has no engineering ambitions beyond its core lending systems.",
    strategicPressure: [
      { text: "Aptus lends to self-employed, informally documented households for affordable housing across Tamil Nadu, Andhra Pradesh, Telangana and Karnataka.", kind: "verified" },
      { text: "Its margin profile depends on holding operating expenses down while the branch network and account count grow.", kind: "verified" },
      { text: "In-house sourcing and collections mean reminder calling consumes the same staff who originate loans.", kind: "inference" },
      { text: "Three southern languages across four states make staffed multilingual telecalling structurally inefficient at its scale.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company procures technology and has no engineering organisation. Its decision criterion is straightforward: does the capability hold servicing cost flat while account count grows, and can it be proven in a quarter.",
    whyNotBuild:
      "Tamil, Telugu and Kannada speech quality plus telephony and orchestration is an engineering programme with no relationship to affordable-housing underwriting. Building it would raise exactly the opex line the company's margin story depends on suppressing.",
    workflows: [
      {
        name: "Tamil and Telugu EMI reminders",
        friction: "Branch staff call due borrowers themselves each month; as accounts grow with the branch network, coverage falls and the calling competes with sourcing time.",
        outcome: "Complete pre-due coverage in the borrower's language with payment options in-channel and outcomes recorded, holding servicing cost flat as accounts grow.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / NACH status", "Collections case management", "Branch allocation records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Statement, schedule and closure servicing",
        friction: "Borrowers call branches for outstanding balance, amortisation schedules, receipts and closure documentation including property-document release.",
        outcome: "Vernacular self-service for statements, schedules and receipts with closure journeys tracked and document-collection appointments booked.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Loan management system", "Document generation", "Property document custody records", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Construction-linked disbursement communication",
        friction: "Self-construction disbursements depend on site progress evidence; borrowers do not know what is needed next and call the branch repeatedly through the build.",
        outcome: "Stage-based proactive communication of requirements and disbursement status, reducing repeat calls and shortening the build-to-disbursement cycle.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination and management system", "Disbursement workflow", "Site verification records", "Document management system"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Branch-led in-house sourcing and collections organisation",
        "Customer application and digital payment options for EMI repayment",
        "SMS reminders and receipts for repayment events",
        "Central customer-support line for loan servicing queries",
      ],
      gaps: [
        "Reminder calling is performed by branch staff and does not scale with account growth",
        "No vernacular self-service for statements, schedules or receipts",
        "Construction-stage requirements are communicated reactively",
        "Property-document release at closure has no tracked journey",
      ],
    },
    risks: [
      "National Housing Bank and RBI fair-practices expectations govern disclosure and repayment communication.",
      "Recovery-agent norms apply to all reminder and follow-up contact with low-income borrowers.",
      "Because branch staff currently own the contact, adoption depends on positioning the automation as freeing sourcing capacity.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 0.95,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions for indicative modelling and must be validated against the company's branch-calling and servicing-cost data.",
    },
    pilotScope:
      "An eight-week pilot on EMI reminders in Tamil and Telugu across two branch clusters, measured on contact coverage, on-time repayment and branch-staff hours returned to sourcing.",
    expansion: [
      "Add self-service statements, schedules, receipts and closure journeys",
      "Extend to construction-linked disbursement communication",
      "Broaden to Kannada and additional clusters as the network expands",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Head of Branch Operations and Collections",
      "Chief Technology Officer",
      "Chief Financial Officer",
    ],
    discovery: [
      "Is reminder calling handled by branch staff or a central team, and how many hours does it consume?",
      "What proportion of due borrowers are contacted before the due date?",
      "How does servicing cost per account trend as the branch network expands?",
      "How many calls does a typical construction-linked disbursement generate?",
    ],
    flowTemplate: "collections",
    scenario: "A shopkeeper in Guntur is reminded in Telugu the day before her EMI, pays through a link, and the branch officer spends that hour completing a new site assessment instead.",
  },

  "home-first-finance": {
    operatingContext:
      "Home First Finance Company is a technology-forward affordable-housing lender that differentiates explicitly on turnaround time and process automation, serving first-time homebuyers — salaried and self-employed — in tier-2 and tier-3 markets across Gujarat, Maharashtra, Tamil Nadu, Rajasthan, Madhya Pradesh and other states. Its origination is app-and-data-driven with a lean, technology-enabled branch model, and it has genuinely higher digital adoption among its customers than typical affordable-housing peers. Even so, first-time homeowners still call: about disbursement coordination with builders and contractors, government subsidy schemes and their status, property-document requirements, and questions no app flow fully answers. Engineering capacity is real but tightly focused on origination speed and credit decisioning rather than conversational infrastructure.",
    strategicPressure: [
      { text: "Home First differentiates on technology-enabled origination and turnaround time in the affordable-housing segment.", kind: "verified" },
      { text: "Its customers are first-time homebuyers who, despite higher app adoption, still need human-grade explanation of subsidy, disbursement and documentation processes.", kind: "inference" },
      { text: "Engineering focus on origination speed means servicing conversations are the part of the journey that automation has not reached.", kind: "inference" },
      { text: "A metrics-driven culture means a buy decision would be fast if the pilot demonstrates measurable call deflection and turnaround improvement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led, but with a technically demanding buyer. The company builds where it creates lending advantage — origination and credit — and buys elsewhere. It will scrutinise model quality, latency, integration depth and evaluation methodology far more rigorously than a typical affordable-housing lender.",
    whyNotBuild:
      "Its engineering advantage is in origination speed, and every engineer diverted to speech infrastructure slows that. The company is small enough that opportunity cost is decisive, and conversational quality across five languages is not something it could match by building.",
    workflows: [
      {
        name: "Disbursement-stage coordination",
        friction: "Disbursements tied to construction stages or builder milestones require documents and confirmations; customers call to ask what is pending and when money will release, despite app status.",
        outcome: "Proactive stage-based communication that states requirements, confirms receipt and pushes disbursement timing, closing the gap the app leaves open.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan origination and management system", "Disbursement workflow", "Document management system", "Builder / project records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Subsidy-scheme eligibility and status",
        friction: "First-time buyers ask whether they qualify for government housing-subsidy support, what documents are needed and where their claim stands; answers require a person who knows the scheme rules.",
        outcome: "Grounded, citable explanation of eligibility and documentation with claim status retrieved live, in the customer's language, at any hour.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Subsidy claim tracking", "Scheme rules knowledge base", "Document management system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Residual servicing the app cannot close",
        friction: "Property-document queries, part-payment effects, closure processes and one-off exceptions still generate calls because they need explanation rather than a screen.",
        outcome: "Conversational handling of the residual intents with app-consistent answers, so the digital-first proposition holds even where a flow does not exist.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Loan management system", "Document generation", "Property document custody records", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer mobile application with genuinely high adoption for payments and account servicing",
        "Digital origination journeys with rapid sanction turnaround",
        "Contact centre supporting queries the app does not resolve",
        "Automated notification across disbursement, EMI and receipt events",
      ],
      gaps: [
        "Disbursement-stage requirements still generate calls despite app status visibility",
        "Subsidy eligibility and claim status need a knowledgeable human today",
        "Residual intents outside app flows have no conversational equivalent",
        "No after-hours conversational coverage for a customer base that transacts in the evening",
      ],
    },
    risks: [
      "Government subsidy-scheme rules change; grounded answers must be sourced from a maintained knowledge base with clear version control.",
      "National Housing Bank and RBI conduct expectations govern disclosure and communication about charges and terms.",
      "A technically demanding buyer will require evidence on latency, accuracy and evaluation methodology before committing.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.15,
      automationRate: 0.65,
      basis: "Volume, unit cost and automation rate are seller assumptions for indicative modelling; the company measures its own funnel closely and its data should replace all of these.",
    },
    pilotScope:
      "An eight-week pilot on disbursement-stage coordination and subsidy eligibility and status in Hindi, Gujarati and Tamil, measured on residual call deflection and disbursement-cycle time.",
    expansion: [
      "Extend to residual servicing intents the app cannot close, including closure and document queries",
      "Add after-hours conversational coverage across all languages",
      "Broaden to proactive lifecycle communication across the loan tenure",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Technology Officer",
      "Chief Operating Officer",
      "Head of Customer Experience",
      "Head of Credit and Operations",
    ],
    discovery: [
      "What residual call volume persists despite the app, and what are the top intents by count?",
      "How many contacts does a typical construction-linked disbursement generate today?",
      "How are subsidy eligibility questions answered now, and how current is the scheme knowledge base?",
      "What evidence on accuracy, latency and evaluation would the technology team require before a pilot?",
    ],
    flowTemplate: "onboarding",
    scenario: "A first-time buyer in Rajkot asks in Gujarati at 9pm whether her subsidy claim has been filed and what the next disbursement needs, and gets both answers without a callback.",
  },

  "aadhar-housing-finance": {
    operatingContext:
      "Aadhar Housing Finance is a Blackstone-backed, recently listed affordable-housing lender with one of the widest geographic spreads in its segment, operating deep in Uttar Pradesh, Bihar, Madhya Pradesh and Rajasthan as well as Maharashtra, Gujarat, Tamil Nadu and Andhra Pradesh. Its borrowers are low-income salaried workers and self-employed households buying small homes, frequently with government subsidy support, and they interact with the company in Hindi, Marathi, Tamil, Telugu and Gujarati almost entirely by phone and at branches. That geographic breadth means its servicing organisation must handle more languages than most peers at moderate volume in each, covering EMI reminders, subsidy status questions, document chasing during origination and lifecycle requests such as statements and closure documentation. Sponsor-driven cost discipline is explicit, and the company has no internal engineering capability.",
    strategicPressure: [
      { text: "Aadhar Housing Finance operates one of the widest state footprints in affordable housing, spanning the Hindi belt, the west and the south.", kind: "verified" },
      { text: "Recent listing and private-equity sponsorship keep cost-efficiency and operating-leverage metrics under continuous external scrutiny.", kind: "verified" },
      { text: "Serving five or more languages at moderate volume each makes staffed multilingual telecalling structurally more expensive per contact than for a single-region lender.", kind: "inference" },
      { text: "Subsidy-linked borrowers generate a distinct query stream about eligibility, claim status and credit timing that branch staff answer repeatedly.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. No internal build capability, sponsor-driven cost discipline and a language-breadth problem that a single platform deployment solves far more cheaply than staffing. The evaluation will centre on cost per contact and on language coverage evidence.",
    whyNotBuild:
      "Five-language speech quality, telephony and orchestration would be a multi-year programme in a company built around branch-level credit assessment. The breadth that makes the opportunity valuable is precisely what makes building it infeasible.",
    workflows: [
      {
        name: "EMI reminders across the Hindi belt and south",
        friction: "Reminder calling is handled by branch staff and a central team whose language coverage varies, so borrowers in some states are contacted far less reliably than others.",
        outcome: "Uniform pre-due coverage in every operating language with payment options in-channel, confirmations recorded and coverage no longer dependent on local staffing.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Payment gateway / NACH status", "Collections case management", "Branch allocation records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Subsidy eligibility, claim and credit-status servicing",
        friction: "Borrowers ask whether they qualify for housing-subsidy support, what documents are required and when the subsidy will be credited; each question goes to a branch officer who checks manually.",
        outcome: "Grounded explanation of eligibility and documentation with live claim and credit status in the borrower's language, removing a large repetitive query stream from branches.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan management system", "Subsidy claim tracking", "Scheme rules knowledge base", "Document management system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Origination document chase and disbursement status",
        friction: "Low-income salaried and self-employed borrowers submit incomplete documentation; files stall and borrowers are left uninformed until they call.",
        outcome: "Automated multilingual follow-up naming the outstanding item with format guidance, validation before submission, and proactive disbursement-stage updates.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination system", "Document management system", "Disbursement workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Wide branch network conducting in-person assessment and servicing",
        "Customer application and digital payment options for EMI repayment",
        "Contact centre with an IVR covering a subset of operating languages",
        "SMS and WhatsApp notification for dues, receipts and disbursement events",
      ],
      gaps: [
        "Reminder coverage varies by state because it depends on locally staffed language capability",
        "Subsidy eligibility and claim status require a branch officer every time",
        "Document chasing is manual and slow for informal-income files",
        "Several operating languages have no conversational servicing on the phone",
      ],
    },
    risks: [
      "Government subsidy-scheme rules and eligibility criteria change; answers must be grounded in a maintained, version-controlled knowledge base.",
      "National Housing Bank and RBI fair-practices expectations govern disclosure and repayment communication with low-income borrowers.",
      "Recovery-agent norms apply to reminder and follow-up contact, and sponsor scrutiny raises the reputational cost of any conduct failure.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Volume, cost per interaction and automation rate are seller assumptions used to frame the case and must be replaced with the company's post-listing contact-centre and collections data.",
    },
    pilotScope:
      "A ten-week pilot on EMI reminders and subsidy claim-status servicing in Hindi, Marathi and Tamil across three states, measured on contact coverage uniformity, on-time repayment and branch queries deflected.",
    expansion: [
      "Extend language coverage to Telugu and Gujarati across the remaining footprint",
      "Add origination document chase and disbursement-status communication",
      "Broaden to lifecycle servicing including statements, part-payment and closure journeys",
    ],
    stakeholders: [
      "Managing Director and CEO",
      "Chief Operating Officer",
      "Chief Technology Officer",
      "Head of Collections and Customer Service",
      "Chief Financial Officer (sponsor-facing efficiency owner)",
    ],
    discovery: [
      "How does reminder-call coverage vary state by state, and what drives the variation?",
      "How is the contact centre structured post-listing, and which languages does it actually staff?",
      "How many branch queries per month relate to subsidy eligibility and claim status?",
      "What operating-leverage target has the sponsor set, and who owns delivery of it?",
    ],
    flowTemplate: "collections",
    scenario: "A borrower in Kanpur is reminded in Hindi three days before her EMI and, in the same call, learns her housing-subsidy claim has been credited against the loan.",
  },
};
