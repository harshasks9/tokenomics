// Deep analysis blocks for the first 50 qualified profiles in
// profiles-gov-edu-bpm.ts — government-linked enterprises and public services,
// plus universities and education networks.
// Evidence discipline: confidence-labeled pressure bullets, no fabricated
// figures, quotes, dates or URLs. Economics are seller assumptions to validate.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_GOV_EDU_BPM_A: Record<string, ProfileAnalysis> = {
  irctc: {
    operatingContext:
      "IRCTC is the Indian Railways subsidiary that holds the mandate for internet passenger ticketing, on-board and station catering, packaged rail tourism, and Rail Neer packaged water. Its ticketing platform is one of the highest-throughput booking systems in the world, with the Tatkal opening windows each morning concentrating enormous demand into a few minutes; the underlying passenger reservation host is operated by CRIS, not by IRCTC itself. Passenger contact arrives through the Rail Connect app and website, the 139 rail helpline and its SMS/IVR tree, the RailMadad grievance portal, e-catering order lines, and social media. The customer base is the entire travelling Indian public, which means the servicing language mix is genuinely national rather than Hindi-English only.",
    strategicPressure: [
      { text: "IRCTC operates as a listed PSU whose ticketing convenience fees and catering revenue are watched quarterly, so servicing cost per booking is a visible margin line rather than an abstract efficiency target.", kind: "inference" },
      { text: "Ticket cancellation and TDR refund handling is a recurring source of public complaint and parliamentary-question style scrutiny, making refund transparency a reputational as well as operational issue.", kind: "inference" },
      { text: "Payment-failure cases where money debits but no ticket issues generate a distinctive, high-anxiety contact type that no static IVR resolves, and that repeats across every festival and Tatkal peak.", kind: "verified" },
      { text: "Passenger-facing digital modernization at IRCTC has historically been delivered by external system integrators under tender, which means an agent platform enters as a procurement item and not as an internal engineering decision.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "IRCTC's internal technology capability is concentrated on keeping an extreme-concurrency booking front end available during Tatkal peaks and on integrating with CRIS-owned reservation systems. There is no public evidence of an in-house speech, NLU, or conversational-orchestration engineering group, and customer-facing channels including the helpline are contracted out. That combination — heavy transaction engineering, outsourced conversation layer, tender-based buying — is a clean buy-led classification.",
    whyNotBuild:
      "Building this would mean owning Indian-language ASR and TTS across at least eight languages with railway-specific vocabulary (station names, train numbers, quota codes), telephony at helpline scale that survives festival surges, an orchestration layer with write-back into PRS and payment reconciliation, and an evaluation regime that a PSU auditor would accept. IRCTC has neither the engineering headcount nor the hiring model for that, and every quarter spent building is a quarter of unresolved refund complaints. Buying a governed platform with railway workflows configured is faster and defensible in an audit.",
    workflows: [
      {
        name: "Failed-booking payment reversal servicing",
        friction: "When a booking fails after debit, the passenger has no way to learn whether the amount is with the payment gateway, the bank, or IRCTC; they call 139, email customer care, and post on social media in parallel, and each channel restarts the investigation.",
        outcome: "Single conversational thread that resolves the reversal state from the payment ledger, sets an accurate expectation, and proactively closes the loop when the credit lands — collapsing three-to-four contacts per incident into one.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Ticketing/booking platform", "Payment gateway reconciliation", "CRM/grievance system", "SMS gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "TDR and cancellation refund lifecycle",
        friction: "TDR filing rules vary by cancellation reason and ticket type, and once filed the passenger sees a status with no explanation or timeline, so they re-contact weekly until the money appears.",
        outcome: "Grounded eligibility guidance at filing time, guided document capture, and proactive status pushes at every stage change, suppressing repeat status contacts and reducing rejected filings.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["TDR/refund workflow system", "Ticketing platform", "Payment reconciliation", "Grievance portal"],
        value: 3,
        complexity: 3,
      },
      {
        name: "PNR, waitlist and journey-disruption updates",
        friction: "Waitlisted passengers repeatedly check PNR status manually and call 139 for chart-preparation outcomes; when trains are cancelled or diverted, the helpline saturates exactly when passengers most need an answer.",
        outcome: "Proactive multilingual updates on chart preparation, confirmation, platform changes, and cancellations, with alternative-train guidance offered in-conversation instead of a queue.",
        channels: ["WhatsApp", "SMS", "Voice", "App push"],
        systems: ["PNR/reservation feed", "Train-running information", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Rail Connect mobile app and ticketing website with PNR and booking self-service",
        "139 rail helpline with an IVR and SMS-based status service",
        "RailMadad grievance intake portal shared with Indian Railways",
        "E-catering ordering channel with its own support line",
      ],
      gaps: [
        "No conversational path that resolves a debited-but-unticketed payment end to end",
        "No explanation of why a TDR was rejected or when a refund will actually credit",
        "Voice servicing does not cover the regional-language mix of the passenger base",
        "Disruption information is broadcast, not conversational — passengers cannot ask what it means for their specific PNR",
      ],
    },
    risks: [
      "PSU procurement discipline: engagement almost certainly runs through GeM or a limited tender with CVC-compliant evaluation, so an unsolicited pilot needs a legitimate contracting vehicle.",
      "Passenger identity, travel and payment data is sensitive personal data under India's DPDP framework, and railway travel data carries additional security sensitivity.",
      "Write-access to the reservation host is controlled by CRIS, not IRCTC — the first release may be read-and-notify only, with transactional actions phased in.",
    ],
    economics: {
      volumeMonthly: 6000000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions derived from IRCTC's public booking scale and Indian outsourced contact-centre economics — all three must be replaced with actual helpline and grievance-channel data in discovery.",
    },
    pilotScope:
      "Automate failed-booking payment-reversal and TDR refund-status servicing on WhatsApp and voice in Hindi, English and two regional languages, with proactive status pushes and human handoff for grievance escalation.",
    expansion: [
      "Add PNR, waitlist and chart-preparation servicing with proactive disruption notifications across the full language set",
      "Extend to e-catering order support and IRCTC Tourism package pre-sales and itinerary servicing",
      "Federate the same agent into the RailMadad grievance flow so complaint intake, triage and status share one conversational surface",
    ],
    stakeholders: [
      "Director (Tourism & Marketing), IRCTC",
      "Group General Manager, Internet Ticketing",
      "Chief Information Technology Officer / GM (IT)",
      "General Manager, Customer Care and Public Grievance",
      "GM (Materials Management) for tender and contracting",
    ],
    discovery: [
      "What share of 139 and customer-care contacts are refund or failed-payment related, and what is the current average time from TDR filing to credit?",
      "Which systems can a vendor write to today — TDR workflow, grievance system, notification gateway — and which are read-only because CRIS owns them?",
      "Is the current contact-centre operated by an outsourcing partner under contract, and when does that contract come up for renewal?",
      "What is the accepted procurement route for an AI servicing platform: GeM catalogue, open tender, or an existing SI framework agreement?",
    ],
    flowTemplate: "claims",
    scenario: "A passenger whose Tatkal booking failed after the amount debited asks IRCTC in Hindi where the money is, and is told the exact reversal stage with a proactive confirmation when it credits.",
  },

  "india-post": {
    operatingContext:
      "India Post is a government department operating the largest postal network in the world, with roughly 150,000 post offices weighted heavily toward rural India. Beyond mail and Speed Post parcels it runs Post Office Savings Bank accounts, small-savings schemes, postal life insurance, and — through India Post Payments Bank — doorstep banking delivered by postmen. Citizens reach it through a national customer-care number, individual post-office phone lines, the tracking website and app, and a public grievance portal, with the bulk of real interaction still happening at the counter. The served population is effectively everyone, including customers with low digital literacy for whom voice in their own language is the only workable channel.",
    strategicPressure: [
      { text: "Private express and e-commerce logistics operators have taken parcel share while setting customer expectations for real-time tracking that a counter-and-hotline model cannot match.", kind: "verified" },
      { text: "The department carries a universal-service obligation to serve remote and rural areas, so it cannot solve service load by closing channels or pushing everyone to an app.", kind: "verified" },
      { text: "Small-savings and IPPB account servicing generates a distinct, recurring query load (interest, maturity, KYC, doorstep-banking scheduling) that sits on top of parcel tracking and is far more sensitive.", kind: "inference" },
      { text: "IT delivery at India Post has run through large SI-led programmes rather than internal product engineering, so a conversational layer would be procured as a programme component.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "India Post is a service department, not a technology organization; its major systems modernization has been delivered by external integrators under multi-year contracts. There is no in-house speech or conversational engineering function, and staffing a national multilingual helpline internally has never been the operating model. The buy-led classification is straightforward — the real question is which contracting vehicle, not whether they would build.",
    whyNotBuild:
      "A credible solution here needs speech recognition across a dozen-plus Indian languages including heavily accented rural speech, telephony that terminates calls from every district, grounding into tracking, savings and IPPB systems that were built at different times by different vendors, and audit-grade logging for a government department. That is a multi-year platform programme India Post has no mandate or headcount to run. Buying it as a configured capability is the only route that delivers inside a budget cycle.",
    workflows: [
      {
        name: "Speed Post and parcel tracking with delivery exceptions",
        friction: "Tracking pages show a scan event with no interpretation, so the customer calls the destination post office or the national number; delivery failures, address problems and undelivered-item returns are discovered only after the article is already going back.",
        outcome: "Conversational tracking in the customer's language that explains the actual state, captures a corrected address or redelivery preference, and pushes exception alerts before an article returns to origin.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Track-and-trace/parcel system", "Delivery post-office routing", "Grievance system", "SMS gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Small-savings and post-office account servicing",
        friction: "Depositors visit a counter to ask basic questions about interest credits, maturity dates, scheme rules and KYC status, consuming counter time that should go to transactions and forcing rural customers into avoidable travel.",
        outcome: "Voice-first account and scheme servicing in regional languages that answers balance, maturity, interest and document questions and books a counter or doorstep visit only when one is genuinely required.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Post Office Savings Bank core", "Scheme rules repository", "Appointment/doorstep scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Grievance intake and status",
        friction: "Complaints filed on the public grievance portal or at a counter disappear into a queue with no meaningful status, generating repeat complaints and escalations that duplicate the original case.",
        outcome: "Structured conversational intake that captures the right article and scheme details up front, deduplicates against open cases, and proactively reports each status change until closure.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Public grievance system", "Track-and-trace", "Savings bank core", "Case management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "National track-and-trace website and mobile app for Speed Post and parcels",
        "Central customer-care number plus post-office-level phone lines",
        "Online public grievance registration for postal services",
        "India Post Payments Bank doorstep banking requested through postmen and a bank helpline",
      ],
      gaps: [
        "No conversational explanation of what a tracking scan actually means or when delivery will be reattempted",
        "Address correction and redelivery cannot be completed without reaching the delivery post office",
        "Savings-scheme and maturity questions still require a counter visit for most rural depositors",
        "Grievance status is opaque between filing and closure, driving duplicate complaints",
      ],
    },
    risks: [
      "Departmental procurement runs through government tendering with SI framework contracts already in place — the platform likely enters as a subcontracted component rather than a direct award.",
      "Post Office Savings Bank and IPPB data is financial data subject to banking-grade controls and Indian data-residency expectations, which constrains where inference and logs may run.",
      "Universal-service obligation means no workflow may become digital-only; every automated path needs a voice and assisted fallback for low-literacy users.",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 0.7,
      automationRate: 0.55,
      basis: "Seller assumptions built from India Post's public network scale and typical Indian public-sector contact-centre unit costs; actual helpline, post-office call and grievance volumes must be sourced from the department in discovery.",
    },
    pilotScope:
      "Deploy Speed Post tracking and delivery-exception servicing on voice and WhatsApp in Hindi, English and three regional languages for two postal circles, with address correction and redelivery write-back to the delivery post office.",
    expansion: [
      "Extend to small-savings and Post Office Savings Bank account servicing in the same circles",
      "Add grievance intake, deduplication and proactive status to the public grievance flow",
      "Scale to all circles with IPPB doorstep-banking scheduling as an additional transactional workflow",
    ],
    stakeholders: [
      "Deputy Director General (Business Development), Department of Posts",
      "Chief Postmaster General of the pilot circle",
      "Deputy Director General (Technology) / CTO office",
      "Head of Customer Care and Public Grievance",
      "IPPB Head of Customer Experience",
    ],
    discovery: [
      "What is the split of contact volume between parcel tracking, savings-scheme queries and grievances, and where is it landing today — national number, circle offices or counters?",
      "Which incumbent system integrator holds the current IT programme, and can a conversational platform be added as a component under it?",
      "Can the delivery post office accept a redelivery or address correction generated by an external agent, and through which system?",
      "What language coverage would the department consider a minimum for a national rollout, and is there a formal accessibility standard to meet?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A rural customer asks India Post in Marathi why a Speed Post article has not arrived, corrects the delivery address in the same call, and gets a redelivery confirmation.",
  },

  bsnl: {
    operatingContext:
      "BSNL is the state-owned telecom operator serving landline, broadband, FTTH and mobile customers across every state except Delhi and Mumbai, with a subscriber base concentrated in rural and semi-urban India and a large government and enterprise leased-line business. It has been executing an indigenous 4G rollout while simultaneously trying to arrest subscriber decline, which makes retention and activation communications commercially critical rather than cosmetic. Customers reach it through the 1500 and 1503 helplines, the Selfcare portal and app, and circle-level customer service centres, with contact-centre operations largely outsourced. Average revenue per user is among the lowest in the market, so any human-handled call is expensive relative to the account it serves.",
    strategicPressure: [
      { text: "BSNL's 4G and 5G rollout creates a large activation, SIM-upgrade and coverage-expectation query load in exactly the districts where its call-centre coverage is thinnest.", kind: "verified" },
      { text: "With ARPU well below private operators, the cost of an assisted call is a meaningful fraction of monthly revenue per subscriber, making automation an economics question rather than an experience one.", kind: "inference" },
      { text: "FTTH broadband is the segment where BSNL competes best on price, and fault-report handling quality is the main reason customers churn from it.", kind: "hypothesis" },
      { text: "As a PSU under continuing financial scrutiny, new customer-experience spend must be justified against measurable cost reduction, not brand improvement.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "BSNL has no history of building customer-facing software products; its self-care portals and IVR are vendor-delivered and its contact centres are outsourced to BPO partners. Internal engineering effort is committed to network rollout. Every signal points to a bought, tender-procured capability, with the practical constraint being budget rather than appetite.",
    whyNotBuild:
      "The stack required — Indian-language speech tuned for rural callers, carrier-grade telephony integration with its own switches, orchestration across billing, provisioning and fault-management systems inherited from multiple vendors, plus continuous evaluation — is a product company's roadmap, not a network operator's. BSNL cannot recruit that team at PSU pay scales, and a self-build would compete for capital with the 4G rollout it cannot afford to slow.",
    workflows: [
      {
        name: "Prepaid recharge and plan servicing",
        friction: "Recharge and plan questions land in a two-language DTMF tree serving a base that speaks a dozen languages; when a subscriber does reach an agent, the cost of that call can exceed a month of that subscriber's revenue.",
        outcome: "Voice and WhatsApp recharge servicing in the caller's language with plan comparison, in-conversation payment links and proactive pre-expiry reminders, moving a high-frequency low-value contact off assisted channels.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Prepaid billing/charging", "Recharge and payment gateway", "CRM", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "FTTH and broadband fault reporting",
        friction: "A broadband outage report requires reaching a helpline, describing the symptom to an agent who cannot see line state, and then waiting for a field visit with no visibility of the ticket after that.",
        outcome: "Conversational fault intake that reads live line and provisioning status, resolves the self-fixable cases in-conversation, books the field visit with a real slot, and pushes status until closure.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Fault-management/NMS", "Provisioning system", "Field-force scheduling", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Postpaid billing and new-connection follow-up",
        friction: "Bill disputes and new-connection applications stall in manual handoffs between the helpline, the circle office and the installation team, and the customer chases each one by phone.",
        outcome: "Grounded bill explanation and dispute intake plus proactive new-connection milestone updates, cutting chase calls and reducing abandonment between application and installation.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Postpaid billing", "Order-management/provisioning", "CRM", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "1500 and 1503 customer-care helplines with a DTMF IVR",
        "Selfcare portal and mobile app for recharge and bill payment",
        "Circle-level customer service centres for in-person servicing",
        "SMS-based balance and validity notifications",
      ],
      gaps: [
        "Helpline language coverage does not match the linguistic spread of the subscriber base",
        "Broadband fault status is not visible to the customer between report and resolution",
        "No proactive pre-expiry or lapse-risk outreach that can transact in the conversation",
        "New-connection applications have no self-service status path",
      ],
    },
    risks: [
      "PSU capital constraints mean the business case must show cash cost reduction against the existing outsourced contact-centre spend, not incremental experience benefits.",
      "Telecom subscriber data is regulated under licence conditions and Indian data-localisation expectations, restricting where conversation data may be processed and stored.",
      "The incumbent BPO contract may need to run its term; the platform may have to be positioned to that partner rather than around them.",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 0.6,
      automationRate: 0.6,
      basis: "Order-of-magnitude seller assumptions based on BSNL's public subscriber scale and Indian outsourced contact-centre pricing; validate against the actual helpline volumes and the current per-contact price paid to the BPO partner.",
    },
    pilotScope:
      "Automate prepaid recharge and validity servicing on voice and WhatsApp in five languages for two telecom circles, with in-conversation payment and proactive pre-expiry reminders measured against recharge conversion.",
    expansion: [
      "Add FTTH and broadband fault intake with live line-status grounding and field-visit booking",
      "Extend to postpaid billing explanation, dispute intake and new-connection milestone updates",
      "Scale across all circles with retention outreach for lapse-risk prepaid and churn-risk FTTH accounts",
    ],
    stakeholders: [
      "Director (Consumer Mobility), BSNL Board",
      "Director (Consumer Fixed Access)",
      "Chief General Manager of the pilot circle",
      "General Manager (IT) / CIO office",
      "General Manager, Customer Care and Call Centre Operations",
    ],
    discovery: [
      "What is BSNL currently paying per contact under the outsourced contact-centre contract, and what volume does that cover?",
      "Which systems expose APIs today — charging, provisioning, fault management — and which would need an integrator to open up?",
      "Is the buying decision at corporate office or delegated to circle CGMs for a pilot-scale engagement?",
      "How much of the current call volume is recharge and validity versus fault reporting, and how does that shift during 4G migration campaigns?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A BSNL prepaid subscriber in a Tamil-speaking district asks about validity and completes a recharge inside the same conversation instead of navigating an English IVR.",
  },

  msedcl: {
    operatingContext:
      "MSEDCL, trading as Mahavitaran, is the distribution utility for the whole of Maharashtra outside the Mumbai licensee areas, serving roughly thirty million consumers spanning urban households, rural agricultural pumpsets, and industrial connections. Its consumer interaction is dominated by four recurring events: monthly billing, supply interruptions, new-connection and load-change applications, and disconnection or arrears notices. Consumers reach it through the 1912 and 1800-series complaint numbers, the Mahavitaran mobile app and consumer portal, and division and sub-division offices, with the helpline operated as an outsourced centre. The dominant servicing language is Marathi, with Hindi and English needed in industrial belts and metro-adjacent districts.",
    strategicPressure: [
      { text: "Monsoon storms and heat-wave load events produce concentrated outage-call surges where the helpline saturates precisely when consumer anxiety and political attention are highest.", kind: "verified" },
      { text: "Agricultural and residential arrears are a structural financial problem for Indian discoms, making arrears communication and payment-arrangement conversations a board-level topic rather than a service nicety.", kind: "verified" },
      { text: "Rooftop solar and net-metering growth is adding a new, technically complex query category that frontline agents are not equipped to answer consistently.", kind: "inference" },
      { text: "Regulatory service standards set by the state electricity regulatory commission make response and restoration timelines publicly accountable, so measurable call handling has compliance value.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "MSEDCL is an engineering-and-operations utility whose technology is delivered through state tenders and system integrators; consumer-facing IT such as the app and portal is vendor-built and the complaint helpline is outsourced. There is no internal software product organization and no evidence of AI engineering capability. This is a buy-led account where the decisive question is the tender route and the outsourcing contract cycle.",
    whyNotBuild:
      "Handling a monsoon outage surge needs elastic voice capacity, Marathi speech that copes with rural dialects and noisy conditions, grounding into the outage-management and billing systems so answers are true rather than generic, and consistent policy application on arrears conversations that a regulator could inspect. A discom cannot assemble or retain that engineering. Buying a governed platform lets MSEDCL point to configured, auditable behaviour rather than an internal build it would have to defend.",
    workflows: [
      {
        name: "Outage reporting and restoration updates",
        friction: "During a storm every affected consumer in a feeder area calls 1912 separately, the helpline melts, and nobody receives a restoration estimate — so they call again, amplifying the surge they are stuck in.",
        outcome: "Elastic intake that recognises the consumer, correlates their complaint to a known feeder fault, gives a grounded restoration expectation, and pushes a restoration confirmation — converting repeat calls into one proactive thread.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Outage/fault management", "Consumer indexing and billing", "Field-crew dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Billing dispute and arrears conversations",
        friction: "High-bill complaints are handled by agents reading the same bill the consumer already has, without meter-reading history or slab explanation, and arrears outreach is generic SMS that produces neither payment nor a conversation.",
        outcome: "Grounded bill explanation using consumption and reading history in Marathi, plus policy-bounded instalment and payment-arrangement conversations that record commitments and follow them up automatically.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Billing and consumer indexing", "Meter reading history", "Payment gateway", "CRM/complaint system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New connection and load-change application status",
        friction: "Applications move through site inspection, estimate payment, and metering steps handled by different sub-division staff, and applicants chase each stage by visiting the office because there is no status channel.",
        outcome: "Guided application intake with document checks and proactive milestone updates through to meter installation, reducing office footfall and improving compliance against regulated connection timelines.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["New-connection workflow", "Consumer indexing", "Payment gateway", "Field inspection scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "1912 and toll-free complaint helplines operated as an outsourced contact centre",
        "Mahavitaran consumer mobile app and web portal for bill view and payment",
        "SMS billing and disconnection notifications to registered numbers",
        "Division and sub-division consumer facilitation offices",
      ],
      gaps: [
        "No capacity to absorb a storm-driven outage call surge without abandoning calls",
        "Consumers cannot get a restoration estimate specific to their supply point",
        "No conversational explanation of why a bill is higher than the previous month",
        "New-connection applicants have no self-service view of which stage they are stuck at",
      ],
    },
    risks: [
      "Maharashtra state e-procurement rules govern the engagement, and a discom purchase of this size will require a competitive tender with technical qualification criteria.",
      "Consumer data including connection, consumption and payment history is subject to Indian data-protection obligations and utility confidentiality expectations.",
      "Arrears and disconnection conversations are politically sensitive in agricultural districts — tone, timing and escalation rules must be approved and auditable before any outbound campaign runs.",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 0.7,
      automationRate: 0.6,
      basis: "Seller assumptions from MSEDCL's published consumer scale and Indian outsourced helpline pricing; the real baseline is the 1912 centre's monthly offered-call count and the per-seat or per-call price in the incumbent contract.",
    },
    pilotScope:
      "Deploy Marathi-first outage reporting and restoration-update servicing on voice and WhatsApp for three MSEDCL circles, with fault correlation against the outage-management system and proactive restoration confirmations.",
    expansion: [
      "Add bill explanation and policy-bounded arrears and instalment conversations",
      "Extend to new-connection and load-change application intake with milestone updates",
      "Scale statewide and add rooftop-solar and net-metering query handling as a specialist skill",
    ],
    stakeholders: [
      "Director (Operations), MSEDCL",
      "Chief Engineer of the pilot zone",
      "Chief General Manager (IT)",
      "Head of Consumer Grievance and Call Centre",
      "Director (Finance) for arrears and recovery outcomes",
    ],
    discovery: [
      "What is the offered-versus-answered call ratio on 1912 during a monsoon event, and how many of those are duplicate reports of the same feeder fault?",
      "Can the outage-management system expose fault and restoration-estimate data to an external agent in near real time?",
      "What arrears-outreach practices has the regulator or state government constrained, and what tone and timing rules must an outbound agent respect?",
      "Which tender vehicle would MSEDCL use, and is there an existing SI contract this could attach to for a pilot?",
    ],
    flowTemplate: "inbound-service",
    scenario: "During a monsoon outage a Mahavitaran consumer reports loss of supply in Marathi, learns the fault is already known with a restoration estimate, and receives a confirmation when power returns.",
  },

  tangedco: {
    operatingContext:
      "TANGEDCO and its distribution successor TNPDCL supply electricity across Tamil Nadu to more than thirty million service connections, including a very large free-agricultural-supply category and a dense industrial base around Chennai, Coimbatore and Tiruppur. Consumer contact is overwhelmingly Tamil-language and concentrated on supply interruptions, bimonthly bill queries, new-connection and name-transfer applications, and meter faults. The Minnagam consumer grievance centre and its toll-free number are the main remote channel, backed by section offices where most consumers still walk in. Digital adoption exists in the metro but a large share of the base is rural and voice-only.",
    strategicPressure: [
      { text: "Cyclone and monsoon events on the Tamil Nadu coast cause mass outages with sustained call surges that a fixed-capacity grievance centre cannot absorb.", kind: "verified" },
      { text: "Distribution restructuring into TNPDCL puts consumer-service performance under fresh organizational focus and creates a natural window for a new servicing contract.", kind: "inference" },
      { text: "The utility's financial position constrains discretionary spend, so a proposal must be framed as substitution for existing grievance-centre cost rather than net-new expenditure.", kind: "inference" },
      { text: "A near-monolingual Tamil consumer base makes a single-language voice deployment unusually cheap to reach quality on, which is a genuine advantage for a first public-sector reference in the state.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "This is a distribution utility with an engineering workforce and vendor-delivered IT; the consumer portal, billing systems and grievance centre are all externally supplied or operated. There is no internal software product team, no AI capability, and no precedent for building customer-facing technology. Buy-led is unambiguous.",
    whyNotBuild:
      "The hard parts here are Tamil speech quality across rural accents and noisy call conditions, telephony capacity that scales tenfold during a cyclone, and live grounding into billing and fault systems so the agent tells consumers the truth about their own service connection. None of that is buildable by a discom, and a failed self-build during a cyclone season is a public accountability event. A configured platform with Tamil-first voice is the only realistic path.",
    workflows: [
      {
        name: "Tamil-language outage reporting and restoration status",
        friction: "During cyclone-driven outages the Minnagam number is engaged for hours, consumers cannot report a fault or learn a restoration timeline, and section offices receive walk-ins during unsafe conditions.",
        outcome: "Unlimited-capacity Tamil voice intake that identifies the service connection, correlates to known faults, gives restoration expectations, and confirms restoration — protecting both consumers and field staff during storm events.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Fault/outage management", "Consumer service-connection database", "Field-crew dispatch", "SMS gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Bill explanation and payment servicing",
        friction: "Bimonthly billing produces spikes of high-bill complaints where consumers cannot get slab, reading or arrears explanations without a section-office visit, and payment reminders are generic.",
        outcome: "Tamil conversational bill explanation grounded in reading history and tariff slabs, with in-conversation payment and reminders that reduce both walk-ins and late payment.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Billing system", "Meter reading history", "Payment gateway", "Grievance system"],
        value: 2,
        complexity: 2,
      },
      {
        name: "New connection, name transfer and meter-fault applications",
        friction: "Service applications require repeated section-office visits to check whether an inspection happened, an estimate is payable, or a meter has been allotted, with no remote status channel.",
        outcome: "Guided application intake with document validation and proactive stage updates through to energisation, cutting office footfall and improving adherence to regulated service timelines.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Service application workflow", "Consumer database", "Payment gateway", "Inspection scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Minnagam consumer grievance centre with a toll-free complaint number",
        "Consumer web portal and mobile app for bill view and online payment",
        "SMS bill and disconnection notices to registered consumers",
        "Section and division offices as the primary walk-in service points",
      ],
      gaps: [
        "No surge capacity when a cyclone puts an entire region into outage at once",
        "Consumers cannot obtain a restoration estimate specific to their connection",
        "High-bill disputes require a physical visit to resolve",
        "Application status between filing and energisation is invisible to the applicant",
      ],
    },
    risks: [
      "Tamil Nadu state e-procurement and utility tendering rules govern the engagement, with technical qualification criteria that must be satisfied before any commercial conversation.",
      "The ongoing restructuring between generation and distribution entities creates ambiguity about which entity contracts for consumer servicing.",
      "Free-supply agricultural consumers and subsidised categories carry political sensitivity — automated outreach on arrears or disconnection must have explicit approval and human escalation paths.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.6,
      automationRate: 0.6,
      basis: "Order-of-magnitude seller assumptions from the published service-connection base and Indian public-sector helpline economics; replace with Minnagam offered-call data and the current grievance-centre operating cost in discovery.",
    },
    pilotScope:
      "Deploy a Tamil-first outage-reporting and restoration-status voice agent for two distribution regions with fault correlation, restoration notifications and human escalation for safety-critical reports.",
    expansion: [
      "Add bill explanation, tariff-slab guidance and in-conversation payment",
      "Extend to new-connection, name-transfer and meter-fault application intake with stage updates",
      "Scale statewide with proactive cyclone-season notification campaigns to affected feeder areas",
    ],
    stakeholders: [
      "Chairman and Managing Director, TNPDCL",
      "Director (Distribution)",
      "Chief Engineer (IT) / General Manager, Information Technology",
      "Superintending Engineer responsible for Minnagam grievance operations",
      "Chief Financial Controller for procurement and budget approval",
    ],
    discovery: [
      "What is the peak-day offered call volume at Minnagam during a cyclone event versus a normal day, and what proportion is abandoned?",
      "Which entity — TANGEDCO or TNPDCL — now contracts for consumer-service technology after the restructuring?",
      "Can the fault-management system provide connection-level outage and restoration data through an interface?",
      "Is there an existing grievance-centre outsourcing contract, what does it cost, and when does it come up for renewal?",
    ],
    flowTemplate: "inbound-service",
    scenario: "After a cyclone knocks out supply in a Tamil Nadu district, a consumer reports the fault in Tamil, hears that crews are already dispatched to their feeder, and gets a restoration alert.",
  },

  bescom: {
    operatingContext:
      "BESCOM distributes electricity to the Bengaluru metropolitan region and seven surrounding districts, covering on the order of a crore installations that range from dense urban apartments to peri-urban and rural feeders. Its consumer profile is unusually digital for an Indian discom — a large share of consumers pay online, use the mobile app, and complain through social media — while still generating heavy call volume on the 1912 complaint line for outages, high bills, and transformer failures. Bengaluru's rooftop-solar and net-metering base and its electric-vehicle charging growth add technically complex query types. Servicing runs in Kannada, English and Hindi, reflecting the city's migrant population.",
    strategicPressure: [
      { text: "Bengaluru consumers escalate outages publicly on social media within minutes, so slow or inconsistent complaint handling becomes a visible reputational event for the utility.", kind: "verified" },
      { text: "Pre-monsoon and monsoon tree-fall outages produce concentrated complaint bursts in specific divisions that a fixed-capacity 1912 centre cannot absorb.", kind: "inference" },
      { text: "Rooftop-solar, net-metering and EV-charging connection queries are growing faster than frontline capability to answer them accurately.", kind: "inference" },
      { text: "As Karnataka's flagship urban discom, BESCOM is a credible first public-sector reference whose success would travel to peer discoms in the state.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "BESCOM procures its consumer app, billing systems and complaint-centre operations from vendors under Karnataka state e-procurement, and its internal IT function is an operations and vendor-management group rather than a build organization. There is no AI engineering capability. The account is buy-led, and its digital-forward consumer base makes it an unusually receptive one.",
    whyNotBuild:
      "Even a digitally progressive discom cannot own trilingual speech, elastic telephony for storm bursts, and live orchestration across billing, outage management and complaint systems — plus the evaluation evidence a state regulator and an urban public would expect. BESCOM's advantage is that it does not have to: it can buy a configured capability, keep the accountability, and point at measurable complaint-handling metrics.",
    workflows: [
      {
        name: "Outage complaint intake with fault correlation",
        friction: "Every household on a failed transformer calls 1912 independently; the centre logs duplicate complaints, gives no restoration estimate, and the same consumers then escalate on social media.",
        outcome: "Instant multilingual intake that maps the caller to their installation and feeder, deduplicates against known faults, sets a grounded restoration expectation and confirms restoration proactively.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Outage/fault management", "Consumer installation database", "Field crew dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "High-bill dispute and payment servicing",
        friction: "High-bill complaints require the consumer to reach an agent who reads back the same bill without consumption history or slab reasoning, and disputes escalate to division-office visits.",
        outcome: "Grounded bill explanation using reading history, seasonality and tariff slabs in the consumer's language, with dispute intake and inspection booking only where genuinely warranted.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Billing system", "Meter reading history", "Payment gateway", "Complaint management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "New connection, solar and net-metering applications",
        friction: "Rooftop-solar and net-metering applicants get inconsistent answers about eligibility, documentation and inspection sequencing, and then chase division offices for status.",
        outcome: "Grounded, citable guidance on connection and net-metering rules with document validation and proactive stage updates through to meter installation and commissioning.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Connection/net-metering workflow", "Consumer database", "Inspection scheduling", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "1912 complaint helpline covering the BESCOM supply area",
        "Consumer mobile app and web portal with bill view, payment and complaint registration",
        "SMS and app notifications for bills and planned outages",
        "Division and sub-division offices plus active social-media complaint handling",
      ],
      gaps: [
        "No connection-level restoration estimate for an unplanned outage",
        "Duplicate complaints from the same fault are not collapsed into one incident view",
        "Net-metering and EV-connection queries have no consistent grounded answer",
        "Complaint status is not proactively pushed, so consumers re-contact and then escalate publicly",
      ],
    },
    risks: [
      "Karnataka e-procurement rules require a competitive process; an unsolicited approach needs an empanelment or tender route to be actionable.",
      "Existing chatbot or IVR vendor arrangements may create contractual lock-in on the consumer app and complaint channels.",
      "Consumer consumption and payment data is personal data under Indian law and must remain within agreed residency and retention boundaries.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions scaled from BESCOM's published installation base and urban Indian contact-centre unit costs; the real figures are the 1912 monthly offered-call count and the current complaint-centre contract price.",
    },
    pilotScope:
      "Deploy trilingual outage-complaint intake with fault correlation and proactive restoration updates across three BESCOM divisions, measured on duplicate-complaint suppression and abandonment during storm events.",
    expansion: [
      "Add high-bill explanation and dispute intake grounded in consumption history",
      "Extend to new-connection, rooftop-solar and net-metering application guidance and status",
      "Scale across all BESCOM divisions and package the deployment as a template for peer Karnataka discoms",
    ],
    stakeholders: [
      "Managing Director, BESCOM",
      "Director (Technical)",
      "General Manager (IT) / Chief Information Officer",
      "Executive Engineer responsible for the 1912 complaint centre",
      "Director (Finance) for procurement approval",
    ],
    discovery: [
      "How many 1912 complaints in a monsoon month are duplicates of the same transformer or feeder fault?",
      "Does the outage-management system expose feeder-level fault and restoration data through an API today?",
      "What is the current complaint-centre contract structure and its renewal date?",
      "Would BESCOM accept a Karnataka empanelment route, and is there an existing GeM or state catalogue entry that fits?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Bengaluru consumer reports a transformer failure in Kannada, is told the fault is already logged with crews en route, and receives a restoration confirmation instead of escalating on social media.",
  },

  pln: {
    operatingContext:
      "PLN is Indonesia's state electricity company and effectively the sole distributor to more than eighty million customer connections spread across an archipelago of thousands of inhabited islands. A very large share of its residential base is on prepaid meters that require token purchases, which creates a high-frequency, low-value transaction relationship rather than a monthly billing one. Customers interact through the PLN Mobile super-app, the PLN 123 contact centre, area offices, and an extensive network of payment agents and retail token sellers. Servicing is Bahasa Indonesia first, with regional-language expectation in parts of Java, Sumatra and eastern Indonesia, and volume concentrates around outages, token and payment problems, new connections, and power-upgrade requests.",
    strategicPressure: [
      { text: "PLN Mobile has been pushed as the single customer front door for outage reporting and token purchase, which concentrates expectation on digital channels the contact centre must still backstop.", kind: "verified" },
      { text: "Archipelagic distribution means outage events are frequent, geographically fragmented and weather-driven, producing localised call surges that a centralised contact centre absorbs poorly.", kind: "inference" },
      { text: "Prepaid token failures — where payment succeeds but the token does not arrive or does not accept — are a structurally recurring, high-emotion contact type with a direct payment-reconciliation dependency.", kind: "verified" },
      { text: "As a state-owned enterprise under public tariff and service-quality scrutiny, PLN's response times on outage and connection requests are politically visible, giving surge capacity a governance value beyond cost.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "PLN's digital delivery runs largely through its ICT subsidiary and external vendors under SOE procurement, and the PLN Mobile app itself was built that way. Its internal capability is systems integration and operations, not speech, NLU or conversational orchestration engineering. The classification is buy-led with a genuine caveat: the subsidiary may claim scope, so the deal must be shaped as capability supplied into their programme rather than around it.",
    whyNotBuild:
      "Serving eighty million connections conversationally requires Bahasa speech tuned to regional accents, telephony and messaging capacity that absorbs island-scale outage bursts, orchestration across the prepaid token engine, payment reconciliation, outage management and the app's identity layer, and continuous evaluation across every conversation. That is a platform product, and building it competes directly with PLN's grid and electrification capital priorities. Buying it lets ICON+ or the internal team own integration and governance while the hard conversational stack is supplied.",
    workflows: [
      {
        name: "Prepaid token purchase and failed-token resolution",
        friction: "A customer pays for a token through an agent or the app, the token does not arrive or is rejected by the meter, and they must call PLN 123 with a payment reference while the household has no electricity.",
        outcome: "Conversational token reissue that verifies payment against the reconciliation record, regenerates or re-sends the token in-conversation, and escalates only genuine meter faults — turning a household emergency into a minutes-long fix.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Prepaid token/vending engine", "Payment reconciliation", "Customer master data", "Meter management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Outage reporting and restoration updates",
        friction: "Weather-driven outages generate simultaneous reports from an entire area into PLN 123 and PLN Mobile; duplicates are logged separately and customers get no area-specific restoration expectation.",
        outcome: "Location-aware intake that correlates reports to known faults, provides a grounded restoration expectation in Bahasa, and pushes restoration confirmation, suppressing repeat contacts during exactly the peaks that break the centre.",
        channels: ["Voice", "WhatsApp", "App push", "SMS"],
        systems: ["Outage/distribution management", "Customer master data", "Field dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "New connection and power-upgrade requests",
        friction: "Connection and capacity-upgrade applications involve survey, quotation, payment and installation stages handled by area offices, and applicants call repeatedly because there is no status visibility.",
        outcome: "Guided application intake with grounded tariff and capacity guidance, in-conversation payment, and proactive stage updates through to energisation, reducing both call volume and application abandonment.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Connection/order management", "Tariff and product catalogue", "Payment gateway", "Field scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "PLN Mobile super-app with outage reporting, token purchase and complaint tracking",
        "PLN 123 national contact centre across voice and messaging channels",
        "Extensive third-party payment and token-vending agent network",
        "Area and rayon offices for in-person servicing and connection applications",
      ],
      gaps: [
        "Failed prepaid-token cases still need an agent and a payment reference to resolve",
        "No area-specific restoration estimate returned to the customer who reported an outage",
        "Regional-language voice servicing beyond standard Bahasa is not consistently available",
        "Connection and upgrade applications lack a proactive milestone channel",
      ],
    },
    risks: [
      "SOE procurement rules and the role of PLN's ICT subsidiary mean the commercial path may require partnering with, rather than displacing, an internal delivery entity.",
      "Indonesian personal-data protection law and SOE data-governance policy constrain where customer and payment data may be processed.",
      "Universal-service expectations across the archipelago mean any automation must degrade gracefully on low-bandwidth and voice-only channels in remote areas.",
    ],
    economics: {
      volumeMonthly: 8000000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Order-of-magnitude seller assumptions derived from PLN's published connection base, prepaid-meter penetration and Indonesian contact-centre pricing; validate against PLN 123 offered volumes and app-channel contact data in discovery.",
    },
    pilotScope:
      "Automate failed-prepaid-token resolution and outage reporting on voice and WhatsApp in Bahasa Indonesia for two distribution regions, with payment-reconciliation grounding and proactive restoration notifications.",
    expansion: [
      "Extend to new-connection and power-upgrade applications with in-conversation payment and milestone updates",
      "Add regional-language voice coverage for priority distribution regions outside Java",
      "Embed the agent as the conversational layer inside PLN Mobile alongside the PLN 123 voice channel nationally",
    ],
    stakeholders: [
      "Director of Retail and Customer Commerce, PLN",
      "Executive Vice President, Customer Experience / PLN 123",
      "Chief Information Officer or Head of Digital Transformation",
      "Managing Director of the ICT subsidiary responsible for PLN Mobile",
      "Head of Procurement for SOE tendering",
    ],
    discovery: [
      "What share of PLN 123 contacts are prepaid-token failures, and what is the current average resolution time for a reissue?",
      "Can the token vending engine and payment reconciliation be called by an agent to verify and regenerate a token in real time?",
      "How is scope divided between PLN's internal digital team, the ICT subsidiary, and external vendors for PLN Mobile features?",
      "What SOE procurement vehicle would be used, and does an existing framework agreement cover conversational-AI capability?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Jakarta household whose prepaid electricity token failed after payment gets it verified and reissued in a Bahasa WhatsApp conversation before the lights stay off another hour.",
  },

  "pertamina-lpg": {
    operatingContext:
      "Pertamina, through its commercial and trading subholding, distributes subsidised three-kilogram LPG cylinders to tens of millions of Indonesian households alongside its fuel retail network, and operates the Call Center 135 line for customer and agent contact. The subsidised-LPG programme runs on eligibility registration through MyPertamina and registered base and agent outlets, which means the customer relationship is part retail, part entitlement administration. Contacts cluster around registration and eligibility verification, cylinder availability and pricing complaints, agent and base disputes, and fuel-quality or dispensing issues at stations. The audience is overwhelmingly Bahasa Indonesia speaking, price-sensitive, and reaches Pertamina by phone and increasingly by messaging and social media.",
    strategicPressure: [
      { text: "Subsidy targeting reform requires households to be registered and verified before purchasing subsidised LPG, generating a large, rules-heavy verification and dispute query load.", kind: "verified" },
      { text: "Cylinder scarcity episodes and price complaints in specific districts attract immediate media and political attention, making responsive complaint handling a governance requirement.", kind: "verified" },
      { text: "The agent and base network is itself a contact population — outlet operators need allocation, quota and settlement answers that today compete with consumer calls on the same line.", kind: "inference" },
      { text: "As a state energy company under subsidy-accountability scrutiny, Pertamina benefits from auditable, consistent handling of every entitlement conversation rather than agent discretion.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Pertamina's technology investment is concentrated on upstream, refining and retail digitalisation delivered through vendors and its own IT subholding; the customer contact centre is an operated service rather than an engineering product. There is no evidence of internal conversational-AI capability at the distribution-services layer. Buy-led, with the practical work being to identify which subholding actually owns Call Center 135 and its vendor contract.",
    whyNotBuild:
      "Verifying subsidy eligibility conversationally requires grounding in registration data, applying entitlement rules consistently enough to withstand audit, handling both consumer and agent populations on the same channel, and doing it in Bahasa at national voice scale. Pertamina has no reason to build that stack when its capital priorities are energy infrastructure, and an inconsistent self-built assistant on a subsidy programme is a political liability rather than an efficiency gain.",
    workflows: [
      {
        name: "Subsidised-LPG eligibility and registration servicing",
        friction: "Households are refused at the outlet because their registration or identity data does not match, then call 135 or visit a base with no way to see what specifically failed, and the outlet cannot fix it either.",
        outcome: "Conversational eligibility check that names the exact mismatch, guides the correction, and confirms when the registration is usable — removing repeat refusals and outlet-level arguments.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Subsidy registration database", "Customer identity verification", "Outlet/agent master data", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Cylinder availability and distribution complaints",
        friction: "Scarcity or over-pricing complaints arrive by phone and social media, are logged as free text, and are not aggregated fast enough to show distribution managers where a district-level supply problem is forming.",
        outcome: "Structured complaint intake that captures location, outlet and price data consistently, clusters emerging district-level issues, and gives complainants a real status instead of silence.",
        channels: ["Voice", "WhatsApp", "Social messaging"],
        systems: ["Complaint/case management", "Outlet master data", "Distribution planning", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Agent and base outlet support",
        friction: "Outlet operators call the same consumer line about allocation, quota, delivery timing and settlement, wait in a consumer queue, and get answers that require a distribution officer to call back.",
        outcome: "A recognised-partner conversational channel that returns allocation, delivery and settlement status from the source systems and escalates commercial exceptions to the right distribution officer.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Distribution/allocation system", "Agent master data", "Settlement and invoicing", "Field distribution ops"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Call Center 135 for consumer and partner contact across voice and messaging",
        "MyPertamina application used for subsidy registration and transactions",
        "Registered agent and base outlet network as the physical service front line",
        "Social-media complaint handling for fuel and LPG distribution issues",
      ],
      gaps: [
        "A household refused at an outlet cannot self-diagnose why their registration failed",
        "Distribution complaints are not captured in a structure that supports district-level pattern detection",
        "Outlet operators have no dedicated channel separate from the consumer queue",
        "No proactive communication when a district-level supply disruption is known",
      ],
    },
    risks: [
      "Subsidy eligibility is a government-programme rule set — automated statements about entitlement must be grounded, versioned and auditable, with human escalation for any denial.",
      "SOE procurement through the relevant subholding governs contracting, and ownership of Call Center 135 must be established before commercial discussion.",
      "Household registration data includes national identity information subject to Indonesian personal-data protection obligations and government data-sharing constraints.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions from the published scale of the subsidised-LPG household programme and Indonesian contact-centre pricing; the actual baseline is Call Center 135 offered volume by contact reason and its current outsourced cost.",
    },
    pilotScope:
      "Deploy Bahasa Indonesia subsidised-LPG eligibility and registration servicing on voice and WhatsApp for three provinces, grounded in the registration database with human escalation for any entitlement denial.",
    expansion: [
      "Add structured distribution-complaint intake with district-level clustering for distribution managers",
      "Open a recognised-partner channel for agent and base outlet allocation and settlement queries",
      "Extend to fuel-retail complaint handling and MyPertamina transaction support nationally",
    ],
    stakeholders: [
      "Director of Commercial, Pertamina Patra Niaga",
      "Vice President, Retail Sales / LPG Domestic",
      "Head of Customer Care and Call Center 135 operations",
      "Chief Information Officer or Head of Digital, commercial subholding",
      "Head of Procurement for SOE tendering",
    ],
    discovery: [
      "Which entity operates Call Center 135 today, under what contract, and what is the monthly offered volume by contact reason?",
      "Can the subsidy registration system return a specific reason-for-failure that an agent could safely read back to a household?",
      "Is agent and outlet support in scope for the same channel, or does distribution ops want it separated?",
      "What approval is needed from the relevant ministry programme owners before automating any entitlement statement?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An Indonesian household refused subsidised LPG at their local base learns in a Bahasa call exactly which registration detail mismatched and how to fix it that day.",
  },

  kai: {
    operatingContext:
      "KAI operates Indonesia's national railway — intercity long-distance services, the Jakarta-area commuter network through its KCI subsidiary, airport rail links, and the Whoosh high-speed service through a joint venture. Ticketing is concentrated in the Access by KAI app plus authorised agents and station counters, and customer contact runs through the 121 contact centre, station service desks, and social channels. Demand is extraordinarily peaked: the annual Lebaran homecoming turns booking-opening days and travel weeks into national events with ticket-release rushes, sold-out routes, and mass reschedule requests. Servicing is Bahasa Indonesia first with English needed for airport-rail and tourist traffic.",
    strategicPressure: [
      { text: "The Lebaran homecoming period concentrates a large share of annual intercity demand into a few weeks, producing booking-day and disruption-day contact surges no fixed contact-centre capacity can meet.", kind: "verified" },
      { text: "Refund and reschedule rules differ by fare class and channel, and inconsistent explanation at the counter versus the contact centre is a recurring source of passenger complaint.", kind: "inference" },
      { text: "Commuter-line disruptions in the Jakarta area affect very large passenger numbers simultaneously and are communicated primarily by broadcast rather than by conversation.", kind: "inference" },
      { text: "KAI has invested visibly in the Access by KAI app as its digital front door, which creates a natural attachment point for conversational servicing rather than a competing build.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "KAI is a transport operator whose digital products are delivered by its internal digital unit working with external vendors, and whose contact-centre operations are outsourced. There is no public evidence of speech or conversational-platform engineering. Buy-led, with the caveat that the internal digital team will want ownership of how the agent appears inside the app — which is a partnership shape rather than a blocker.",
    whyNotBuild:
      "Absorbing a Lebaran booking-day surge requires elastic voice and messaging capacity, Bahasa speech that works over mobile connections in crowded stations, and live grounding into inventory, ticketing and refund systems so answers are accurate under load. Building that for a demand curve that peaks a few weeks a year is exactly the wrong capital decision; renting elastic capacity that idles the rest of the year is the right one.",
    workflows: [
      {
        name: "Booking, refund and reschedule servicing",
        friction: "Passengers who need to change or cancel face rules that vary by fare class and purchase channel, get different answers from the app, the counter and 121, and then queue again to complete the transaction.",
        outcome: "One conversational path that applies the correct refund and reschedule rules from the ticketing system, executes the change or refund in-conversation, and states the timeline for money back.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Ticketing and reservation", "Refund workflow", "Payment gateway", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Peak-season booking surge absorption",
        friction: "On Lebaran ticket-release days the app strains, agents and counters saturate, and 121 cannot answer availability, quota or payment-failure questions fast enough for a time-critical rush.",
        outcome: "Elastic conversational capacity that answers availability and quota questions, resolves payment failures against the reconciliation record, and books remaining inventory without a queue.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Reservation inventory", "Payment reconciliation", "Customer identity", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Disruption and commuter-service communication",
        friction: "Commuter-line delays and intercity disruptions are broadcast generically, so affected passengers still call to ask what it means for their specific train, seat and connection.",
        outcome: "Proactive, ticket-specific disruption messaging with rebooking or refund options offered in-channel, suppressing the disruption call spike rather than absorbing it.",
        channels: ["App push", "WhatsApp", "SMS", "Voice"],
        systems: ["Train operations and delay feed", "Reservation system", "Notification gateway", "Refund workflow"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Access by KAI app for booking, e-ticketing and schedule information",
        "121 contact centre across voice, email and social messaging",
        "Station customer-service desks and authorised ticketing agents",
        "SMS and app notifications for booking confirmation and schedule changes",
      ],
      gaps: [
        "Refund timelines and rule differences by fare class are not explained consistently across channels",
        "No elastic capacity on booking-release days when demand is most concentrated",
        "Disruption messaging is not personalised to the passenger's specific booking",
        "Payment-failed bookings require an agent and a manual reconciliation check",
      ],
    },
    risks: [
      "SOE procurement governs contracting and KAI's internal digital unit will expect to own the in-app surface, so the engagement must be shaped as supplied capability.",
      "Passenger identity and payment data falls under Indonesian personal-data protection obligations with transport-sector security expectations.",
      "Peak-season performance is publicly scrutinised — a pilot must be hardened and load-tested well before a Lebaran cycle, or deliberately scheduled outside one.",
    ],
    economics: {
      volumeMonthly: 1800000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions derived from KAI's published passenger volumes and Indonesian outsourced contact-centre pricing; the true baseline is 121 offered volume by reason and the peak-to-average ratio across a Lebaran cycle.",
    },
    pilotScope:
      "Automate refund and reschedule servicing on WhatsApp and voice in Bahasa Indonesia with in-conversation execution and refund-timeline transparency, measured against 121 deflection and refund-status repeat contacts.",
    expansion: [
      "Add booking-day surge absorption with availability, quota and payment-failure resolution",
      "Extend to ticket-specific proactive disruption messaging across intercity and commuter services",
      "Embed the agent inside Access by KAI with English coverage for airport-rail and tourist traffic",
    ],
    stakeholders: [
      "Director of Commercial, KAI",
      "Vice President, Customer Care / Contact Center 121",
      "Director or EVP of Digital and Information Technology",
      "Head of Passenger Service Operations",
      "Head of Procurement for SOE tendering",
    ],
    discovery: [
      "What is the peak-day to average-day contact ratio at 121 across a Lebaran cycle, and what is the abandonment rate at peak?",
      "Can refunds and reschedules be executed through an API against the ticketing system, or do they require an agent workstation today?",
      "Who owns the conversational surface inside Access by KAI, and would they host a supplied agent?",
      "What proportion of contacts are refund-status chases that a proactive update would eliminate entirely?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A traveller whose Lebaran train is cancelled receives a Bahasa message with rebooking options for their exact seat class and confirms a new departure without calling 121.",
  },

  "pag-ibig": {
    operatingContext:
      "Pag-IBIG Fund is the Philippine government's savings and housing-finance institution, collecting mandatory member savings from private and public sector workers and self-employed members, and lending those savings back as housing loans, multi-purpose loans and calamity loans. Its membership runs into the tens of millions and includes a very large overseas Filipino worker cohort contributing and transacting from every time zone. Members reach it through a hotline, the online member portal and Virtual Pag-IBIG, branch offices, and employer remittance channels, with branch queues and hotline waits being a persistent, publicly discussed pain point. Servicing is Filipino and English, with strong regional-language expectation across the provinces.",
    strategicPressure: [
      { text: "A large overseas-worker membership means demand arrives around the clock from time zones the Philippine business-hours hotline does not cover.", kind: "verified" },
      { text: "Multi-purpose and calamity loan windows create sharp, predictable application and status-query surges, particularly after typhoons and other disaster declarations.", kind: "verified" },
      { text: "Contribution posting discrepancies — where an employer remittance has not reflected against a member record — are a recurring, emotionally charged contact type that blocks loan eligibility.", kind: "inference" },
      { text: "Government service-quality mandates on transaction turnaround give the fund a compliance interest in demonstrably faster, measurable member servicing.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Pag-IBIG is a government financial institution whose IT is delivered under public bidding with external suppliers; Virtual Pag-IBIG and the member portal were procured, not engineered internally. There is no in-house AI or speech capability and no realistic hiring path to one under government pay scales. This is buy-led, with the practical constraint being the public-bidding timetable rather than the technical decision.",
    whyNotBuild:
      "The requirement spans Filipino and English speech at hotline scale, twenty-four-hour coverage for overseas members, grounding into member savings and loan systems with strict correctness on financial statements, and audit-grade logging suitable for a government financial institution. Building that internally would take years the fund does not have against a member base already queueing at branches. Buying a governed platform gives it measurable service improvement within one budget cycle.",
    workflows: [
      {
        name: "Housing-loan application and status servicing",
        friction: "Applicants cannot see which document or valuation step is holding their loan, so they call the hotline or visit a branch repeatedly, and each contact restarts the explanation from the beginning.",
        outcome: "Grounded, stage-specific status with named outstanding requirements, guided document submission, and proactive updates at each stage change — replacing chase calls and branch visits.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Loan origination and servicing", "Document management", "Member master data", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Contribution posting and membership-record queries",
        friction: "Members discover unposted employer remittances only when a loan application fails, and resolving it means calling during Philippine business hours from wherever in the world they are working.",
        outcome: "Round-the-clock contribution verification that shows posting history, identifies the gap and the responsible employer remittance, and files the correction case with a tracked status.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Member savings/contribution ledger", "Employer remittance records", "Identity verification", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Multi-purpose and calamity loan surge handling",
        friction: "After a disaster declaration, calamity-loan demand spikes immediately in the affected regions while the hotline and nearby branches are themselves disrupted, leaving eligible members without a way to apply or check status.",
        outcome: "Elastic conversational intake and eligibility guidance during declared calamity windows, with application submission and status tracking that does not depend on a physical branch being open.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Loan origination", "Member savings ledger", "Eligibility rules engine", "Disbursement/payment records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Member hotline with business-hours coverage",
        "Virtual Pag-IBIG online member portal for balance, contributions and loan applications",
        "Nationwide branch network plus overseas posts serving OFW members",
        "Employer remittance channels and accredited collection partners",
      ],
      gaps: [
        "No round-the-clock servicing for members contributing from overseas time zones",
        "Loan applicants cannot identify the specific requirement blocking their application",
        "Contribution posting discrepancies require a branch or hotline interaction to diagnose",
        "Calamity-window demand cannot be absorbed when local branches are themselves affected",
      ],
    },
    risks: [
      "Government procurement under the Philippine public-bidding framework sets the pace and the eligibility requirements for any award.",
      "Member savings and loan data is regulated financial and personal information under the Philippine Data Privacy Act, with residency and processing constraints to establish early.",
      "Any statement about loan eligibility or entitlement must be grounded and auditable, with human escalation on denials — a wrong automated answer on a housing loan is a formal complaint.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from Pag-IBIG's published membership scale and Philippine contact-centre pricing; the real baseline is the hotline's offered volume by reason plus branch-queue transaction counts, which must come from the fund.",
    },
    pilotScope:
      "Deploy round-the-clock Filipino and English housing-loan status and contribution-verification servicing on voice and WhatsApp, grounded in the member ledger, with human escalation for any eligibility denial.",
    expansion: [
      "Add guided housing-loan application intake with document validation and proactive stage updates",
      "Extend to multi-purpose and calamity loan surge handling with declared-window eligibility guidance",
      "Add employer-side remittance and reconciliation servicing as a separate recognised-partner channel",
    ],
    stakeholders: [
      "Chief Executive Officer, Pag-IBIG Fund",
      "Senior Vice President, Member Services",
      "Chief Information Officer / Head of Management Information Systems",
      "Head of Customer Contact and Hotline Operations",
      "Head of Procurement and Bids and Awards Committee chair",
    ],
    discovery: [
      "What proportion of hotline and branch contacts are loan-status or contribution-posting queries, and what is the current average handling time?",
      "How many member interactions originate outside Philippine business hours, and what is the current abandonment on those?",
      "Can the member ledger and loan origination systems be queried in real time by an external agent, and under what security model?",
      "What is the expected public-bidding timeline, and are there existing government framework agreements this could ride?",
    ],
    flowTemplate: "onboarding",
    scenario: "An overseas Filipino worker in the Gulf checks at midnight Manila time why a housing-loan application stalled, learns the exact missing document, and submits it in the same conversation.",
  },

  "sss-philippines": {
    operatingContext:
      "The Social Security System is the Philippines' mandatory social-insurance institution for private-sector, self-employed, voluntary and land-based overseas members, covering on the order of forty million members and administering pensions, sickness, maternity, disability, unemployment, funeral and salary-loan benefits. Its servicing load is dominated by three things: contribution posting, benefit claim status, and salary-loan applications and balances — all of which depend on employer remittance data being correct. Members reach it through a national hotline, the My.SSS member portal and mobile app, a large branch network, and employer channels, with branch queues that form before opening hours a recurring public image. Language is Filipino and English with regional-language expectation across the Visayas and Mindanao.",
    strategicPressure: [
      { text: "Benefit claim status and contribution posting queries dominate contact volume and are structurally repetitive, which is exactly the profile automation addresses without touching adjudication.", kind: "inference" },
      { text: "Long branch queues and hotline waits at SSS are a recurring subject of public and legislative criticism, giving service throughput political as well as operational weight.", kind: "verified" },
      { text: "The expansion of benefit programmes including unemployment benefits has broadened the range of rules members ask about while frontline capacity has not grown proportionally.", kind: "inference" },
      { text: "Overseas members contribute and claim from time zones outside Philippine business hours, so a business-hours-only hotline structurally underserves a paying segment.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "SSS is a government social-insurance agency whose core and member-facing systems are delivered through public bidding with external suppliers. Its IT organization runs and integrates those systems; it does not build speech or conversational platforms and has no realistic path to hiring that capability under government terms. Buy-led, with the procurement route being the main sequencing question.",
    whyNotBuild:
      "The requirement is bilingual speech at national hotline scale, correctness on financial and benefit statements that members act on, integration into a core member system that predates modern APIs, and audit-grade evidence for every automated statement. Building that would consume the agency's entire modernization capacity while queues continue forming outside branches. Buying a governed platform delivers measurable queue reduction inside a budget cycle and keeps adjudication firmly human.",
    workflows: [
      {
        name: "Benefit claim status servicing",
        friction: "A member who filed a sickness, maternity or funeral benefit claim has no visibility of where it sits, so they call the hotline weekly and visit a branch, and each contact consumes an agent for a status lookup that adds nothing.",
        outcome: "Grounded claim-status answers with the specific outstanding requirement named, plus proactive updates at each stage change, removing the dominant repeat-contact driver from the hotline and branch queue.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Benefit claims system", "Member master data", "Document management", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Contribution posting verification and correction",
        friction: "Members find out contributions are unposted only when a benefit or loan is refused, and diagnosing whether the employer remitted, mis-keyed the member number, or filed late requires a branch visit.",
        outcome: "Round-the-clock contribution history verification that identifies the specific gap and the responsible remittance, files a correction case, and tracks it to resolution.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Contribution ledger", "Employer remittance records", "Identity verification", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Salary-loan application, balance and My.SSS access support",
        friction: "Salary-loan eligibility, balance and amortisation questions plus My.SSS registration and password problems consume large volumes of hotline time on issues that are entirely rules-based or self-service failures.",
        outcome: "Self-service loan eligibility and balance answers plus guided portal-access recovery with identity verification, converting the highest-frequency low-value contacts into automated resolutions.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Loan servicing", "Member portal identity", "Contribution ledger", "Payment records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "National member hotline with business-hours coverage",
        "My.SSS member portal and mobile app for contributions, loans and claim filing",
        "Nationwide branch network plus foreign representative offices",
        "Employer remittance and collection-partner channels",
      ],
      gaps: [
        "Claim status between filing and payment is opaque, driving weekly repeat contacts",
        "Members cannot diagnose an unposted contribution without a branch visit",
        "My.SSS access failures have no verified self-service recovery path",
        "No servicing coverage for members contacting from outside Philippine business hours",
      ],
    },
    risks: [
      "Public bidding under the Philippine procurement framework governs award, timing and eligibility criteria.",
      "Member contribution, benefit and health-related claim data is sensitive personal information under the Data Privacy Act, requiring strict processing and residency controls.",
      "Benefit adjudication must remain human — the agent may report status and requirements but may never state or imply an approval, denial or benefit amount decision.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from the published membership base and Philippine contact-centre pricing; validate against the hotline's offered volume by contact reason and branch transaction counts before any business case is presented.",
    },
    pilotScope:
      "Automate benefit claim-status and contribution-verification servicing on voice and WhatsApp in Filipino and English with round-the-clock coverage, grounded in the member ledger and claims system, with adjudication questions routed to humans.",
    expansion: [
      "Add salary-loan eligibility, balance and amortisation servicing plus My.SSS access recovery",
      "Extend to guided benefit-claim filing with document validation and requirement checking",
      "Open an employer-facing channel for remittance reconciliation and posting corrections",
    ],
    stakeholders: [
      "President and Chief Executive Officer, SSS",
      "Executive Vice President, Member Services",
      "Chief Information Officer / Head of Information Technology Management Group",
      "Head of Contact Center and Member Assistance",
      "Bids and Awards Committee chair",
    ],
    discovery: [
      "What is the hotline's monthly offered volume split between claim status, contribution posting and loan queries?",
      "How long does the average member wait at a branch, and what proportion of those transactions are pure status lookups?",
      "Can the claims and contribution systems be queried in real time by an external agent, or is a middleware layer required first?",
      "What guardrails would the agency require before an automated channel makes any statement about benefit entitlement?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An SSS member checks the status of a maternity benefit claim in Filipino at 10pm and learns the one document still outstanding instead of queueing at a branch.",
  },

  philhealth: {
    operatingContext:
      "PhilHealth is the Philippines' national health insurer, mandated toward universal coverage of the population and paying benefit claims to accredited hospitals, clinics and health facilities rather than mostly to members directly. That gives it two distinct customer populations: members and dependents asking about eligibility, contributions and benefit coverage, and accredited providers asking about claim submission, denials, reimbursement timing and accreditation status. Contact arrives through the Action Center hotline, regional offices, the member portal, and provider liaison channels, with hospital billing desks a heavy source of repeat contact. Servicing is Filipino and English with regional-language expectation, and the query mix is rules-heavy and highly repetitive.",
    strategicPressure: [
      { text: "Provider reimbursement timing and claim denials are a chronic point of friction between PhilHealth and accredited hospitals, generating persistent, high-volume status contact from billing desks.", kind: "verified" },
      { text: "Universal health coverage policy expands the population entitled to benefits, widening the eligibility-query base faster than contact capacity grows.", kind: "verified" },
      { text: "Governance and fund-utilisation controversies have raised public scrutiny of the agency, making transparent, auditable member and provider communication a reputational priority.", kind: "inference" },
      { text: "Members frequently discover coverage rules only at the point of hospital admission, which is the worst possible moment and the most expensive place to answer the question.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "PhilHealth is an insurance and claims administration agency that procures all technology through public bidding; it has no in-house AI or conversational engineering capability and its IT function is occupied with core claims and membership systems. Buy-led, though the political environment means procurement timing and reputational risk management matter as much as the technical case.",
    whyNotBuild:
      "Serving both members and provider billing desks conversationally requires bilingual speech at national scale, accurate grounding in benefit-package rules and claim status, strict boundaries so no agent ever gives clinical or coverage-decision advice, and audit evidence acceptable to an agency under scrutiny. That is not buildable inside PhilHealth, and a poorly governed self-build on benefit statements would create precisely the kind of incident the agency cannot afford.",
    workflows: [
      {
        name: "Member eligibility and benefit-coverage queries",
        friction: "Members and their families ask what is covered and whether their contributions make them eligible, usually at hospital admission, and get inconsistent answers from hotline agents and hospital staff.",
        outcome: "Grounded, citable eligibility and benefit-package answers in Filipino and English available before and during admission, with human escalation for anything requiring a coverage determination.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Membership and contribution database", "Benefit package rules repository", "Identity verification"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Provider claim-status and reimbursement servicing",
        friction: "Hospital billing desks call repeatedly to ask where batches of claims sit, why specific claims were returned, and when reimbursement will be released, consuming disproportionate agent time on lookups.",
        outcome: "A recognised-provider channel that returns claim and batch status with the specific return or denial reason, and pushes status changes proactively, cutting the largest single repeat-contact driver.",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Claims processing", "Provider accreditation records", "Reimbursement/payment records", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Contribution posting and membership-record servicing",
        friction: "Members whose contributions are unposted or whose dependent records are incorrect discover the problem at claim time and must visit a regional office to correct it.",
        outcome: "Conversational verification of contribution history and dependent records with guided correction filing and tracked case status, removing avoidable office visits.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Membership database", "Contribution ledger", "Employer remittance records", "Case management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Action Center hotline for member and provider inquiries",
        "Member portal for contribution and membership record access",
        "Regional and local health insurance offices for in-person servicing",
        "Provider liaison and accreditation channels for hospitals and clinics",
      ],
      gaps: [
        "Members cannot get a grounded coverage answer before admission, only at the billing desk",
        "Provider billing teams have no self-service view of claim batch status or denial reasons",
        "Contribution and dependent-record corrections require an office visit",
        "No proactive notification when a claim is returned or reimbursement is released",
      ],
    },
    risks: [
      "The agent must never provide clinical advice or make a coverage determination — it may report rules, status and requirements, with every decision remaining with PhilHealth staff.",
      "Health-related member and claim data is sensitive personal information under the Data Privacy Act with strict processing, retention and residency obligations.",
      "Public-bidding procurement plus heightened governance scrutiny means the engagement must be structured with unusual documentation and audit discipline.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from the agency's coverage mandate and Philippine contact-centre pricing; the real baseline is Action Center offered volume split between member and provider contacts, which must be requested in discovery.",
    },
    pilotScope:
      "Deploy a provider-facing claim-status and denial-reason channel for accredited hospitals in two regions, with proactive status notifications and strict escalation of any determination question to PhilHealth staff.",
    expansion: [
      "Add member eligibility and benefit-coverage servicing in Filipino and English on voice and messaging",
      "Extend to contribution posting verification and dependent-record correction filing",
      "Scale nationally with regional-language voice coverage and proactive reimbursement notifications",
    ],
    stakeholders: [
      "President and Chief Executive Officer, PhilHealth",
      "Senior Vice President, Health Finance Policy / Claims",
      "Chief Information Officer / Head of Information Management",
      "Head of Member Management and Action Center operations",
      "Bids and Awards Committee chair",
    ],
    discovery: [
      "What proportion of Action Center contacts come from provider billing desks versus members, and what are the top three reasons for each?",
      "Can claim and batch status including return reasons be exposed to an authenticated provider channel in real time?",
      "What is the agency's position on automated statements about benefit coverage, and what escalation rules would be mandated?",
      "What is the realistic public-bidding timeline, and is there an existing framework or government shared-service vehicle available?",
    ],
    flowTemplate: "claims",
    scenario: "A hospital billing officer asks PhilHealth why a batch of claims was returned and gets the specific deficiency per claim instead of a hotline queue.",
  },

  evn: {
    operatingContext:
      "EVN is Vietnam's state electricity group, delivering power to close to thirty million customers through five regional distribution corporations that each run their own customer-care centre, alongside the northern and southern power corporations serving Hanoi and Ho Chi Minh City. Customer interaction concentrates on outage notification and reporting, monthly billing and payment, new-connection and capacity applications, and meter or reading disputes, with a strong shift in recent years toward app and messaging channels and cashless payment. Each regional corporation operates its own hotline and customer-care organization, which means the buying entity is regional rather than group-level. Servicing is Vietnamese-only for the overwhelming majority of contacts.",
    strategicPressure: [
      { text: "Vietnam's electricity demand growth and summer peak-load stress produce load-shedding and outage episodes that drive concentrated customer contact and public frustration.", kind: "verified" },
      { text: "EVN has pushed customers toward digital payment and app channels, which raises expectations for real-time answers that a traditional call centre cannot meet.", kind: "verified" },
      { text: "Tariff adjustments are politically visible events in Vietnam and reliably generate bill-explanation contact spikes across every regional corporation at once.", kind: "inference" },
      { text: "Because each regional power corporation runs its own care centre, a successful deployment at one is directly replicable to the others — a strong land-and-expand shape.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "EVN's distribution corporations are operations organizations that procure customer-care systems and outsource or staff their own centres; their IT capability is integration and operations, and there is no evidence of Vietnamese speech or conversational-platform engineering inside the group. As a state-owned enterprise, technology arrives through vendor procurement. Buy-led, with entity selection being the main commercial question.",
    whyNotBuild:
      "The work is Vietnamese speech quality across northern, central and southern accents, telephony that absorbs outage surges, live grounding into billing and outage systems per corporation, and evaluation evidence for a state enterprise. No distribution corporation has the engineering base for that, and building five variants across five corporations would be the worst possible use of their capital. A bought platform configured once and replicated is the natural shape.",
    workflows: [
      {
        name: "Outage reporting and restoration updates",
        friction: "During summer peak-load events and storms, customers across a district call the care centre simultaneously, get engaged tones, and receive no restoration estimate specific to their supply point.",
        outcome: "Elastic Vietnamese-language intake that correlates reports to known faults, gives grounded restoration expectations, and confirms restoration proactively — collapsing duplicate reports into one incident.",
        channels: ["Voice", "Zalo", "SMS", "App"],
        systems: ["Outage/distribution management", "Customer master data", "Field dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Bill explanation and payment servicing",
        friction: "After tariff adjustments and in peak summer months, bill-shock contacts surge; agents read the bill back without consumption history or tariff-tier reasoning, and payment issues are handled separately.",
        outcome: "Grounded bill explanation using reading history and tariff tiers in Vietnamese, with in-conversation payment and dispute intake, absorbing predictable seasonal and tariff-event spikes.",
        channels: ["Voice", "Zalo", "App chat"],
        systems: ["Billing system", "Meter reading data", "Payment gateway", "Complaint management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New connection and capacity-change applications",
        friction: "Connection and capacity applications move through survey, quotation and installation steps handled at branch level, and applicants call the care centre repeatedly because status is not visible.",
        outcome: "Guided application intake with document validation and proactive milestone updates through to energisation, improving adherence to published connection-time commitments.",
        channels: ["Zalo", "Voice", "Web chat"],
        systems: ["Connection/order management", "Customer master data", "Payment gateway", "Field scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Regional customer-care hotlines operated by each power corporation",
        "Customer web portals and mobile apps for bill view and online payment",
        "Zalo and SMS notification channels for outage and billing alerts",
        "Branch and district customer transaction offices",
      ],
      gaps: [
        "No supply-point-specific restoration estimate during unplanned outages",
        "Bill-shock queries after tariff changes have no grounded self-service explanation",
        "Application status between survey and energisation is not visible to the applicant",
        "Duplicate outage reports from one fault are not consolidated into a single incident view",
      ],
    },
    risks: [
      "State-owned-enterprise procurement rules govern contracting, and the correct contracting entity is a regional power corporation rather than EVN group.",
      "Vietnamese data-protection and cybersecurity regulations impose data-localisation expectations on customer data processing and storage.",
      "Outage and load-shedding communication is politically sensitive during supply-constrained periods; messaging content and tone will require corporation-level approval.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.7,
      automationRate: 0.6,
      basis: "Seller assumptions from EVN's published customer base and Vietnamese contact-centre pricing; the operative baseline is a single regional corporation's care-centre offered volume and current operating cost.",
    },
    pilotScope:
      "Deploy Vietnamese-language outage reporting and restoration-status servicing on voice and Zalo for one regional power corporation, with fault correlation and proactive restoration confirmations.",
    expansion: [
      "Add bill explanation, tariff-tier guidance and in-conversation payment for the same corporation",
      "Extend to new-connection and capacity-change application intake with milestone updates",
      "Replicate the configured deployment across the remaining regional power corporations",
    ],
    stakeholders: [
      "General Director of the target regional power corporation",
      "Deputy General Director responsible for Business and Customer Service",
      "Head of Information Technology at the corporation",
      "Head of the Customer Care Centre",
      "Head of Procurement / Bidding Department",
    ],
    discovery: [
      "Which regional corporation has the highest care-centre volume and the strongest mandate to modernise it?",
      "What is the peak-to-average call ratio during summer load events, and what is the abandonment rate at peak?",
      "Can the outage-management and billing systems expose customer-level data to an external agent under EVN security policy?",
      "Are Vietnamese data-localisation requirements satisfied by an in-country deployment, and what evidence would the corporation require?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Ho Chi Minh City household reports a power cut in Vietnamese, learns crews are already working the same fault with a restoration window, and gets a confirmation when supply returns.",
  },

  vnpost: {
    operatingContext:
      "VNPost is Vietnam's national postal operator, running mail and parcel delivery across every province alongside a distinctive public-administrative role: delivering government documents, licences and administrative-procedure results to citizens on behalf of state agencies. It competes directly with fast-growing private e-commerce logistics players on parcel service levels while carrying universal-service obligations they do not. Customer contact concentrates on tracking, delivery exceptions and failed attempts, cash-on-delivery reconciliation for e-commerce sellers, and status of administrative documents being delivered. Contact runs through a hotline, the tracking site and app, Zalo, and thousands of post offices, and is Vietnamese-language almost exclusively.",
    strategicPressure: [
      { text: "Private e-commerce logistics competitors have set customer expectations for real-time tracking and instant rescheduling that a traditional postal service model does not meet.", kind: "verified" },
      { text: "The public-administrative delivery mandate makes VNPost the visible last mile for citizens waiting on licences and official documents, where a delivery failure is a civic problem rather than a retail one.", kind: "verified" },
      { text: "Cash-on-delivery e-commerce volumes create a distinct seller-facing reconciliation and remittance query load that competes with consumer tracking contacts on the same channels.", kind: "inference" },
      { text: "Margin pressure from competing on parcel price while carrying universal-service costs makes servicing cost per parcel a real commercial constraint, not a theoretical one.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "VNPost is a state-owned logistics and postal operator whose technology is procured from vendors; its internal capability is operations and systems integration. There is no conversational-AI engineering function and no realistic case for creating one while it is fighting a price and service-level battle with private logistics operators. Buy-led.",
    whyNotBuild:
      "The requirement is Vietnamese speech and messaging at parcel-network scale, live grounding into tracking and delivery-route data so answers are specific rather than generic, write-back for address corrections and redelivery, and a seller-facing reconciliation channel. Building that would divert scarce capital from network and delivery economics where VNPost is actually losing ground. A configured platform delivers the customer-experience parity it needs to defend share.",
    workflows: [
      {
        name: "Parcel tracking and delivery-exception resolution",
        friction: "Tracking shows a scan with no interpretation, failed delivery attempts are discovered after the fact, and correcting an address or arranging redelivery requires reaching the destination post office by phone.",
        outcome: "Conversational tracking that explains actual state, captures address corrections and redelivery preferences with write-back to the delivery route, and pushes exception alerts before return-to-origin.",
        channels: ["Voice", "Zalo", "SMS", "App chat"],
        systems: ["Track-and-trace", "Delivery route management", "Customer/consignee records", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Administrative-document delivery status",
        friction: "Citizens waiting on a licence, permit or official result have no way to distinguish whether the issuing agency has released it or VNPost has it in transit, so they call both and get contradictory answers.",
        outcome: "A single conversational status view across handover from the issuing agency to delivery, with proactive notification at dispatch and a scheduled delivery window citizens can adjust.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Administrative-delivery tracking", "Agency handover records", "Delivery route management", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "E-commerce seller COD and remittance servicing",
        friction: "Sellers chase cash-on-delivery remittance status, disputed collections and returned-parcel settlements through the same channels as consumers, waiting in a consumer queue for a commercial answer.",
        outcome: "A recognised-seller channel returning COD collection, remittance and return-settlement status from the financial records, with disputes filed and tracked automatically.",
        channels: ["Zalo", "Voice", "Web chat"],
        systems: ["COD/remittance ledger", "Seller account records", "Track-and-trace", "Case management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "National tracking website and mobile app for mail and parcels",
        "Customer hotline plus Zalo and social messaging channels",
        "Nationwide post-office network handling counter service and administrative-document delivery",
        "Seller-facing e-commerce shipping accounts with COD collection services",
      ],
      gaps: [
        "Address correction and redelivery still require contacting the destination post office",
        "No unified status across the handover between issuing agency and postal delivery for official documents",
        "Sellers have no dedicated channel for COD remittance and settlement questions",
        "Delivery-exception alerts are not proactive, so returns happen before the customer knows",
      ],
    },
    risks: [
      "Administrative-document delivery involves citizen data handled on behalf of state agencies, which constrains what an external platform may see or log.",
      "Vietnamese data-localisation and cybersecurity rules apply to customer data processing and storage.",
      "SOE procurement and budget constraints in a price-competitive logistics business mean the business case must be framed against measurable servicing cost per parcel.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 0.6,
      automationRate: 0.6,
      basis: "Seller assumptions from VNPost's public parcel and network scale and Vietnamese contact-centre pricing; validate against hotline and Zalo contact volumes per parcel shipped in discovery.",
    },
    pilotScope:
      "Deploy Vietnamese parcel tracking and delivery-exception servicing on Zalo and voice with address correction and redelivery write-back for two provinces, measured on return-to-origin reduction.",
    expansion: [
      "Add administrative-document delivery status with agency-handover visibility and delivery-window selection",
      "Open a seller channel for COD remittance, disputes and return settlements",
      "Scale nationally with proactive exception alerting across the full parcel network",
    ],
    stakeholders: [
      "General Director, Vietnam Post",
      "Deputy General Director responsible for Postal Services and Logistics",
      "Head of Information Technology",
      "Head of Customer Service Centre",
      "Head of the E-commerce and Logistics business unit",
    ],
    discovery: [
      "What is the current return-to-origin rate on parcels, and how many of those had a correctable address or availability problem?",
      "Can the delivery route system accept an address correction or redelivery instruction generated by an external agent?",
      "What data may be exposed on administrative-document deliveries, given the issuing agencies own the underlying case?",
      "What proportion of hotline contacts come from e-commerce sellers rather than consignees?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Hanoi resident asks VNPost in Vietnamese why a parcel was not delivered, corrects the address in the same chat, and gets a confirmed redelivery window.",
  },

  "pea-thailand": {
    operatingContext:
      "PEA is the state enterprise that distributes electricity to every Thai province outside greater Bangkok, serving roughly twenty million customers across a footprint that spans dense provincial cities, agricultural districts and tourist regions. Its customer interaction is concentrated on outage reporting and restoration, monthly billing and payment, new-connection and capacity requests, and meter or reading disputes, with the 1129 PEA Contact Center and the PEA Smart Plus app as the main remote channels alongside district offices. Thailand's flood and storm seasons produce region-scale outage events where contact volume and public expectation both spike. Servicing is Thai-language almost entirely, with modest English need in tourist provinces.",
    strategicPressure: [
      { text: "Seasonal flooding and storms in Thai provinces cause large-scale, geographically clustered outages that overwhelm a fixed-capacity contact centre exactly when restoration information matters most.", kind: "verified" },
      { text: "PEA has invested in the Smart Plus app as a digital front door, which raises customer expectations for real-time, specific answers the contact centre must still deliver.", kind: "verified" },
      { text: "Government electricity subsidy and tariff-relief measures periodically change what customers pay, generating synchronised nationwide bill-explanation contact surges.", kind: "inference" },
      { text: "As a state enterprise with published service-quality commitments, PEA has a governance interest in demonstrably measurable outage response and connection turnaround.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "PEA is an engineering and distribution organization whose customer-facing IT, including the app and contact-centre platform, is delivered by vendors under state-enterprise procurement. It has no Thai speech or conversational-orchestration engineering capability and no precedent for building customer-facing AI. Buy-led, with the incumbent contact-centre outsourcing arrangement being the main commercial dependency.",
    whyNotBuild:
      "Thai speech quality across provincial accents, elastic telephony that survives a flood-season surge, and live grounding into outage-management and billing systems is a specialist platform problem. PEA's capital is committed to grid modernisation and rural electrification. Buying a configured, evaluated capability lets it publish measurable outage-response improvement without owning an AI engineering function.",
    workflows: [
      {
        name: "Outage reporting and restoration status",
        friction: "In a flood or storm event, thousands of customers in the same province call 1129 at once, duplicate reports are logged individually, and no customer receives a restoration expectation for their own supply point.",
        outcome: "Elastic Thai-language intake that correlates reports to known faults, gives a grounded restoration window, and confirms restoration proactively — protecting both the centre and the customer during the peak.",
        channels: ["Voice", "LINE", "App", "SMS"],
        systems: ["Outage/distribution management", "Customer master data", "Field crew dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Billing explanation and payment servicing",
        friction: "Tariff and subsidy changes produce simultaneous bill-shock contacts nationwide; agents read back the bill without consumption history or tariff-step reasoning, and payment problems are handled in a separate flow.",
        outcome: "Grounded Thai bill explanation using reading history and tariff steps, with in-conversation payment and dispute intake, absorbing predictable policy-driven spikes.",
        channels: ["Voice", "LINE", "App chat"],
        systems: ["Billing system", "Meter reading data", "Payment gateway", "Complaint management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "New connection and capacity-change applications",
        friction: "Connection applications for homes, farms and small businesses pass through survey, estimate and installation stages at district offices, and applicants call or visit repeatedly to learn where their application sits.",
        outcome: "Guided intake with document validation and proactive stage notifications through to energisation, reducing district-office footfall and improving connection-time compliance.",
        channels: ["LINE", "Voice", "Web chat"],
        systems: ["Connection/order management", "Customer master data", "Payment gateway", "Field survey scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "1129 PEA Contact Center across voice and messaging channels",
        "PEA Smart Plus mobile app for bill view, payment and outage reporting",
        "District and area offices for connection applications and in-person servicing",
        "SMS and app notifications for planned outages and billing",
      ],
      gaps: [
        "No supply-point-specific restoration estimate during unplanned outages",
        "Duplicate reports from a single fault are not consolidated into one incident",
        "Bill changes driven by tariff or subsidy policy have no grounded self-service explanation",
        "Connection applicants cannot see which stage is holding their application",
      ],
    },
    risks: [
      "State-enterprise procurement rules require a formal process with technical qualification, and an incumbent contact-centre outsourcing contract may need to run its term.",
      "Thai personal-data protection law governs customer consumption and payment data processing, with residency expectations to confirm.",
      "Outage communication during disaster events is coordinated with provincial authorities, so proactive messaging content needs pre-approved templates and escalation rules.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Seller assumptions from PEA's published customer base and Thai contact-centre pricing; the real baseline is the 1129 centre's offered volume by reason and the current outsourcing contract price per contact.",
    },
    pilotScope:
      "Deploy Thai-language outage reporting and restoration-status servicing on voice and LINE for three PEA regions, with fault correlation, restoration notifications and disaster-event surge capacity.",
    expansion: [
      "Add bill explanation, tariff-step guidance and in-conversation payment",
      "Extend to new-connection and capacity-change applications with stage notifications",
      "Scale nationally and add English coverage for tourist provinces",
    ],
    stakeholders: [
      "Deputy Governor, Customer Service, PEA",
      "Assistant Governor responsible for regional distribution operations",
      "Deputy Governor, Digital and Information Technology",
      "Head of the 1129 Contact Center",
      "Head of Procurement for state-enterprise tendering",
    ],
    discovery: [
      "What is the 1129 centre's peak-day offered volume during a flood event versus a normal day, and what is abandonment at peak?",
      "Can the outage-management system return a restoration estimate at the customer supply-point level?",
      "What is the current contact-centre outsourcing arrangement, its cost basis, and its renewal date?",
      "Which state-enterprise procurement vehicle would PEA use, and what technical qualification criteria apply?",
    ],
    flowTemplate: "inbound-service",
    scenario: "During provincial flooding a PEA customer reports an outage in Thai, hears the fault is known with crews assigned, and receives a restoration confirmation without a second call.",
  },

  "mea-thailand": {
    operatingContext:
      "MEA distributes electricity to Bangkok, Nonthaburi and Samut Prakan — a dense metropolitan footprint of roughly four million accounts spanning high-rise residential, commercial towers, and a substantial industrial and hospitality base. Compared with PEA it serves fewer customers on a far smaller geography with higher digital adoption, using the MEA Smart Life app, the 1130 hotline, LINE, and service branches. Contact concentrates on outages including in-building supply faults, billing and payment, new connections and capacity upgrades for commercial premises, and electric-vehicle charging installation queries. Servicing is Thai-first, with genuine English demand from expatriate residents and commercial tenants.",
    strategicPressure: [
      { text: "A dense urban base means a single distribution fault affects large numbers of customers simultaneously and generates an immediate, concentrated contact burst.", kind: "inference" },
      { text: "Commercial and hospitality customers in central Bangkok have low tolerance for supply interruption and expect account-managed responsiveness rather than a consumer hotline.", kind: "inference" },
      { text: "Electric-vehicle charging installation and capacity-upgrade queries are a growing, technically specific category that generic frontline agents answer inconsistently.", kind: "hypothesis" },
      { text: "MEA has positioned itself as a digitally progressive metropolitan utility, which makes it a receptive and contained first Thai public-sector reference before a larger PEA pursuit.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "MEA procures its customer app, billing platform and contact-centre systems from vendors under state-enterprise procurement, with internal IT running integration and operations. There is no speech or conversational engineering capability. Buy-led, and its smaller scale makes it a fast, low-risk deployment rather than a multi-year programme.",
    whyNotBuild:
      "Even a compact metropolitan utility cannot justify owning Thai and English speech, telephony surge capacity, and orchestration into outage and billing systems. MEA's advantage is that a bought capability can be configured for one grid, one language pair and a contained customer base — reaching measurable quality far faster than any internal attempt, and providing a reference the larger Thai utilities will recognise.",
    workflows: [
      {
        name: "Metropolitan outage reporting and restoration status",
        friction: "When a feeder or building supply fault occurs, every affected household and tenant calls 1130 separately; duplicates are logged individually and no one is told which fault they are affected by or when it will clear.",
        outcome: "Instant Thai and English intake that maps the caller to their supply point, correlates to the known fault, sets a restoration expectation and confirms restoration proactively.",
        channels: ["Voice", "LINE", "App", "SMS"],
        systems: ["Outage/distribution management", "Customer account data", "Field dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Billing explanation and commercial account servicing",
        friction: "Commercial tenants and building managers query demand charges, power-factor penalties and tariff structures that consumer-oriented agents cannot explain, escalating to account engineers for routine questions.",
        outcome: "Grounded explanation of consumption, demand and tariff components for both residential and commercial accounts, with escalation reserved for genuine engineering matters.",
        channels: ["Voice", "LINE", "Web chat", "Email"],
        systems: ["Billing system", "Metering and demand data", "Payment gateway", "Account management records"],
        value: 2,
        complexity: 2,
      },
      {
        name: "New connection, capacity upgrade and EV-charging installation",
        friction: "Capacity upgrades and EV-charger installations require load assessment, quotation and inspection steps, and applicants get inconsistent guidance about requirements and then chase status by phone.",
        outcome: "Grounded requirement guidance and guided application intake with proactive stage updates through inspection and energisation, shortening a growth-driving application funnel.",
        channels: ["LINE", "Web chat", "Voice"],
        systems: ["Connection/order management", "Load assessment records", "Inspection scheduling", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "1130 hotline for outage, billing and general customer inquiries",
        "MEA Smart Life app and web portal for bill view, payment and service requests",
        "LINE official account for notifications and basic customer messaging",
        "Metropolitan service branches for applications and in-person servicing",
      ],
      gaps: [
        "No customer-specific restoration estimate during an unplanned metropolitan outage",
        "Commercial demand-charge and power-factor questions have no grounded self-service answer",
        "EV-charging and capacity-upgrade requirements are explained inconsistently",
        "English-language servicing for expatriate and commercial customers is limited",
      ],
    },
    risks: [
      "State-enterprise procurement requires a formal competitive process even for a contained metropolitan pilot.",
      "Thai personal-data protection law applies to consumption, account and payment data, with processing-location commitments required.",
      "Overlap with a PEA pursuit needs deliberate sequencing so the two Thai utilities do not stall each other waiting for the other to go first.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.3,
      automationRate: 0.6,
      basis: "Seller assumptions from MEA's published account base and Thai contact-centre pricing; validate against the 1130 hotline's offered volume by reason and the current contact-centre operating cost.",
    },
    pilotScope:
      "Deploy Thai and English outage reporting with fault correlation and proactive restoration updates across the MEA service area on voice, LINE and the Smart Life app.",
    expansion: [
      "Add residential and commercial bill explanation including demand-charge and power-factor components",
      "Extend to connection, capacity-upgrade and EV-charging installation guidance and status",
      "Use the completed deployment as the Thai public-sector reference for a PEA national engagement",
    ],
    stakeholders: [
      "Deputy Governor, Customer Service, MEA",
      "Assistant Governor, Distribution Operations",
      "Deputy Governor, Digital Technology",
      "Head of the 1130 Contact Center",
      "Head of Procurement for state-enterprise tendering",
    ],
    discovery: [
      "How many 1130 contacts during a metropolitan fault are duplicate reports of the same incident?",
      "Can the outage-management system provide a restoration estimate at supply-point granularity today?",
      "What share of contacts come from commercial and building-management customers versus residential?",
      "How should the MEA and PEA pursuits be sequenced so one becomes the reference for the other?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Bangkok condominium resident reports a supply fault in English, is matched to the known feeder incident with a restoration window, and gets confirmation when power returns.",
  },

  "srt-thailand": {
    operatingContext:
      "The State Railway of Thailand operates the national rail network — long-distance intercity services, provincial commuter lines, the Airport Rail Link corridor, and the newer Bangkok commuter services around Krung Thep Aphiwat — carrying a mix of price-sensitive domestic travellers and international tourists. Ticketing runs through the D-Ticket online channel, station counters, and authorised agents, with the 1690 hotline as the main remote service channel for schedules, availability, refunds and disruption information. Demand peaks sharply around Songkran and other national holidays, when long-distance seats sell out and schedule changes cascade. Servicing is Thai-first with meaningful English need from tourist traffic on popular routes.",
    strategicPressure: [
      { text: "Holiday travel periods such as Songkran concentrate long-distance demand into a few days, producing booking and disruption contact surges a fixed hotline cannot absorb.", kind: "verified" },
      { text: "Ongoing double-tracking and network construction programmes cause recurring schedule changes and temporary service alterations that travellers must be told about individually, not generically.", kind: "verified" },
      { text: "SRT's well-documented financial constraints mean any spend must be justified as substitution for existing servicing cost or as revenue protection through better booking conversion.", kind: "verified" },
      { text: "Tourist passengers arriving without Thai language face a booking and service channel that is effectively closed to them outside station counters.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "SRT is a legacy state enterprise with no software product capability; its online ticketing and hotline were delivered and are operated by external providers. Internal IT is a small operations function. Buy-led beyond question — the genuine risk is not build competition but budget availability and organizational bandwidth.",
    whyNotBuild:
      "Any credible capability needs Thai and English speech, elastic capacity for holiday peaks, and grounding into inventory and refund systems. SRT has neither the capital nor the engineering base for that, and its priorities are track and rolling stock. A bought, contained deployment focused on booking and disruption servicing is the only realistic path, and it must be sized to a budget SRT can actually approve.",
    workflows: [
      {
        name: "Schedule, availability and booking servicing",
        friction: "Travellers call 1690 for train times, seat availability and fare questions that the hotline handles one at a time in Thai only, and tourists have almost no remote channel at all.",
        outcome: "Bilingual conversational schedule and availability answers with booking guidance and links, opening a channel to tourist travellers and removing the highest-frequency hotline contact type.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Reservation and inventory system", "Timetable data", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Refund and reschedule servicing",
        friction: "Refund rules vary by ticket type and purchase channel, refunds are processed manually, and passengers call repeatedly to learn whether money has been returned with no status visibility.",
        outcome: "Correct rule application at request time, refund or reschedule execution where policy allows, and proactive status through to credit — eliminating chase contacts.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Reservation system", "Refund workflow", "Payment gateway", "Case management"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Disruption and schedule-change notification",
        friction: "Construction-driven schedule changes and service disruptions are announced generically at stations and online, so affected passengers still call to ask what happens to their specific booking.",
        outcome: "Booking-specific proactive notification with alternative-service options offered in-channel, suppressing the disruption call spike and protecting holiday-period reputation.",
        channels: ["SMS", "LINE", "Voice"],
        systems: ["Train operations and timetable feed", "Reservation system", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "D-Ticket online booking channel plus station counters and authorised agents",
        "1690 hotline for schedules, availability and general inquiries",
        "Station announcement and information boards for disruption communication",
        "SMS confirmations for online bookings",
      ],
      gaps: [
        "No English-language remote servicing for international travellers",
        "Refund status between request and credit is invisible to the passenger",
        "Disruption notices are generic rather than tied to a specific booking",
        "No capacity to absorb holiday-period booking and enquiry surges",
      ],
    },
    risks: [
      "SRT's financial position is the binding constraint — the proposal must be scoped to a budget the enterprise can approve and defended as cost substitution.",
      "State-enterprise procurement rules require a formal process, and organizational bandwidth for a technology programme is limited.",
      "Reservation and refund systems may be operated by external providers, so integration rights need to be established with those providers before any commitment.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Seller assumptions from SRT's published ridership and Thai contact-centre pricing; the actual baseline is 1690 offered volume by reason and the holiday peak-to-average ratio, both of which must come from SRT.",
    },
    pilotScope:
      "Deploy a Thai and English schedule, availability and booking-guidance agent on voice and LINE covering long-distance routes, with proactive booking-specific disruption notifications.",
    expansion: [
      "Add refund and reschedule execution with proactive status through to credit",
      "Extend to commuter and Airport Rail Link services with real-time delay notifications",
      "Add tourist-oriented journey planning and station-service information in additional languages",
    ],
    stakeholders: [
      "Governor, State Railway of Thailand",
      "Deputy Governor responsible for Commercial and Passenger Services",
      "Director of Information Technology",
      "Head of Passenger Service and the 1690 Contact Centre",
      "Head of Procurement and Contracts",
    ],
    discovery: [
      "What is the 1690 hotline's monthly offered volume, and how does it change across a Songkran cycle?",
      "Who operates the D-Ticket reservation platform, and what integration rights does SRT hold?",
      "What budget envelope could realistically be approved for a passenger-servicing pilot in the current financial position?",
      "What proportion of enquiries come from international travellers unable to use Thai-language channels?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A tourist asks the State Railway in English about seat availability to Chiang Mai over Songkran and is told the real position with booking guidance instead of reaching a Thai-only hotline.",
  },

  "aot-thailand": {
    operatingContext:
      "Airports of Thailand operates six airports including Suvarnabhumi and Don Mueang, together handling a passenger throughput measured in the high tens of millions annually with a heavy international mix — Chinese, Indian, European, Korean and regional ASEAN travellers alongside domestic traffic. AOT is an infrastructure and concession business rather than an airline: its direct passenger contact concerns terminal wayfinding, flight information across dozens of carriers, ground transport, immigration and check-in queue conditions, lost property, and accessibility assistance. Passengers reach it through airport information counters, a call centre, airport websites and the SAWASDEE by AOT app, plus very heavy social-media enquiry traffic. The language requirement is genuinely multilingual and is the single hardest part of the operation.",
    strategicPressure: [
      { text: "Passenger recovery to and beyond pre-pandemic levels has restored terminal congestion and information demand at Thailand's main gateways, with immigration and check-in queue conditions a recurring public complaint.", kind: "verified" },
      { text: "The inbound mix is dominated by travellers who do not speak Thai or fluent English, making language coverage a service-quality issue rather than a convenience.", kind: "verified" },
      { text: "Disruption events — weather, air-traffic restrictions, airline system outages — create simultaneous multilingual information demand that counter staffing cannot scale to meet.", kind: "inference" },
      { text: "As a listed state-controlled operator, AOT's passenger-experience metrics are reported and compared internationally, giving measurable service improvement commercial as well as reputational value.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "AOT is an airport operator whose passenger-facing digital products are vendor-delivered and whose information counters are staffed operations. It has no speech or conversational-AI engineering function, and its capital programme is dominated by terminal expansion. Buy-led, with the key question being whether the buying centre is corporate or per-airport operations.",
    whyNotBuild:
      "Multilingual passenger information at gateway scale requires speech and understanding across at least six languages, live grounding into flight-information feeds shared with dozens of airlines, wayfinding knowledge that changes with every terminal works programme, and disruption-time surge capacity. AOT cannot build or staff that. A bought platform lets it deliver a consistent multilingual answer at every touchpoint without hiring linguists for every shift.",
    workflows: [
      {
        name: "Multilingual flight information and wayfinding",
        friction: "Passengers queue at information counters to ask which terminal, which gate, where to check in and how to reach ground transport, and counter staff cannot cover the language mix arriving at Suvarnabhumi.",
        outcome: "Instant answers in the passenger's language across voice and messaging, grounded in live flight information and current terminal layout, removing the routine load from counters entirely.",
        channels: ["Voice", "App chat", "WhatsApp", "WeChat", "LINE"],
        systems: ["Flight information display system feed", "Terminal wayfinding data", "Ground transport schedules"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lost property intake and matching",
        friction: "Lost-item reports are taken manually at counters or by phone, often after the passenger has left the country, and matching against found items is a slow manual process with poor communication back to the traveller.",
        outcome: "Structured multilingual lost-property intake with automated matching against found-item records and proactive notification when a match occurs, including from overseas after departure.",
        channels: ["Web chat", "WhatsApp", "Voice", "Email"],
        systems: ["Lost property register", "Found-item records", "Case management", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Disruption-period passenger information",
        friction: "During weather or system disruptions, thousands of passengers seek the same information simultaneously in multiple languages while counter and phone capacity is fixed, and misinformation spreads on social media.",
        outcome: "Elastic multilingual information capacity with consistent, grounded messaging across every channel, plus proactive guidance on rebooking and airline contact routes.",
        channels: ["App push", "Voice", "Social messaging", "Web chat"],
        systems: ["Flight information feed", "Airline contact directory", "Airport operations notices", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Airport information counters and a passenger call centre",
        "SAWASDEE by AOT passenger app and airport websites with flight information",
        "Flight information display systems across terminals",
        "Social-media channels handling a large share of passenger enquiries",
      ],
      gaps: [
        "Language coverage at counters and on the phone does not match the inbound passenger mix",
        "Lost-property reporting and follow-up is manual and poorly communicated after departure",
        "No elastic information capacity during disruption events",
        "Wayfinding answers are static and do not reflect live terminal works or gate changes",
      ],
    },
    risks: [
      "State-enterprise procurement rules apply, and the buying centre may be corporate headquarters or individual airport operations — this must be established before pursuit.",
      "Flight information is sourced from airlines and air-traffic systems; the agent must ground in authoritative feeds and never speculate about delays or cancellations that belong to the airline to communicate.",
      "Passenger personal data captured in lost-property and assistance requests falls under Thai data-protection law with cross-border transfer implications for international travellers.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.4,
      automationRate: 0.65,
      basis: "Seller assumptions derived from AOT's published passenger throughput and Thai contact-centre pricing; validate against information-counter transaction counts, call-centre volume and social-media enquiry volume in discovery.",
    },
    pilotScope:
      "Deploy multilingual flight-information and wayfinding servicing at Suvarnabhumi across voice, the AOT app and messaging channels in Thai, English, Mandarin and two additional inbound languages.",
    expansion: [
      "Add lost-property intake with automated matching and post-departure notification",
      "Extend disruption-period information capacity across all six AOT airports",
      "Add accessibility-assistance booking and ground-transport coordination as transactional workflows",
    ],
    stakeholders: [
      "President, Airports of Thailand",
      "Senior Executive Vice President, Airport Business",
      "General Manager, Suvarnabhumi Airport",
      "Head of Digital and Information Technology",
      "Head of Passenger Services and Customer Experience",
    ],
    discovery: [
      "What is the monthly transaction volume at information counters, and what is the language breakdown of passengers using them?",
      "Which flight-information feeds can be exposed to an external agent, and what accuracy guarantees do the airlines require?",
      "Is the buying decision made at AOT corporate or by individual airport general managers?",
      "What is currently on the SAWASDEE app roadmap, and would conversational servicing be embedded there or run alongside it?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Mandarin-speaking transit passenger at Suvarnabhumi asks which terminal their connecting flight departs from and gets a live, grounded answer without finding an information counter.",
  },

  ptptn: {
    operatingContext:
      "PTPTN is Malaysia's national higher-education loan fund, financing study for a very large share of Malaysian tertiary students and then collecting repayment from them across their working lives. Its borrower population spans fresh graduates, mid-career professionals, borrowers working overseas, and a long tail of defaulted accounts stretching back years. Interaction concentrates on repayment status and balances, restructuring and rescheduling requests, salary-deduction arrangements, discount and incentive campaigns, and disbursement queries for current students. Contact arrives through a careline, the myPTPTN portal and app, branch counters, and campus-based channels, in Bahasa Malaysia, English, Mandarin and Tamil depending on borrower background.",
    strategicPressure: [
      { text: "Repayment shortfall against outstanding loans is a recurring national policy topic in Malaysia, keeping collection performance under sustained public and ministerial attention.", kind: "verified" },
      { text: "Periodic government-announced discount and incentive campaigns produce sharp, time-boxed surges in borrower contact that a fixed careline cannot absorb.", kind: "verified" },
      { text: "A large share of borrowers who stop repaying are not refusing but disengaged — unreached by letters and unanswered outbound calls in office hours.", kind: "inference" },
      { text: "Collections tone toward young graduates is politically sensitive in Malaysia, so any outreach must be demonstrably policy-bounded and auditable rather than aggressive.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "PTPTN is a statutory fund administering loans; its systems are procured and its careline operated as a service. There is no software product engineering and no AI capability internally. Buy-led, and the collections workflow is one of the most directly measurable use cases in the entire portfolio because recovery is quantifiable within a pilot window.",
    whyNotBuild:
      "Policy-bounded collections conversations at national scale require multilingual speech, contact-timing rules that respect regulatory and political constraints, in-conversation payment and restructuring within an approved matrix, hardship detection that routes to humans, and complete logging so every conversation can be reviewed. PTPTN cannot build that and would not survive the scrutiny of an unaudited self-built collections bot. Buying a governed platform makes the guardrails the product rather than an afterthought.",
    workflows: [
      {
        name: "Repayment outreach and payment arrangement",
        friction: "Disengaged borrowers are pursued with letters and office-hours outbound calls they never answer; when one does answer, the arrangement offered depends on which officer takes the call.",
        outcome: "Multilingual, policy-timed outreach that reaches borrowers on the channels they use, applies only approved restructuring terms, takes payment in-conversation, and records commitments with automatic follow-up.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Loan servicing/ledger", "Restructuring rules matrix", "Payment gateway", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Balance, statement and salary-deduction servicing",
        friction: "Borrowers call the careline for balances, statements, and to sort out salary-deduction discrepancies with employers, and each of these is a manual lookup that consumes an officer for a routine answer.",
        outcome: "Self-service balance, statement and deduction-history answers with discrepancy cases filed and tracked automatically, freeing careline capacity for genuine restructuring conversations.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Loan servicing/ledger", "Employer deduction records", "Identity verification", "Case management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Campaign and incentive-window handling",
        friction: "When a government discount or settlement window is announced, borrower contact spikes immediately and the careline saturates, so borrowers who wanted to pay during the window cannot get through.",
        outcome: "Elastic multilingual capacity during campaign windows that explains eligibility, computes the borrower's specific settlement position and takes payment, converting policy announcements into actual recovery.",
        channels: ["WhatsApp", "Voice", "Web chat", "SMS"],
        systems: ["Loan ledger", "Campaign rules engine", "Payment gateway", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "National careline for borrower and student inquiries",
        "myPTPTN portal and mobile app for balance, statements and payment",
        "Branch counters and campus presence for disbursement and repayment servicing",
        "Salary-deduction arrangements administered through employers",
      ],
      gaps: [
        "No scalable way to reach disengaged borrowers outside office hours on channels they use",
        "Restructuring terms are not applied consistently across officers and channels",
        "Campaign windows cannot be serviced at the volume the announcement generates",
        "Salary-deduction discrepancies require manual investigation with no borrower-visible status",
      ],
    },
    risks: [
      "Government procurement rules govern the engagement, and a statutory body award will require a formal process with ministry visibility.",
      "Collections outreach to graduates is politically scrutinised in Malaysia — tone, contact frequency and hardship handling need documented, approved policy and full conversation logging.",
      "Borrower financial and employment data is personal data under Malaysia's PDPA, with processing-location and retention commitments required.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.4,
      automationRate: 0.6,
      basis: "Seller assumptions from PTPTN's published borrower scale and Malaysian contact-centre pricing; the meaningful baseline is careline offered volume plus current outbound-collections contact attempts and cost, which PTPTN must supply.",
    },
    pilotScope:
      "Run a policy-bounded multilingual repayment-outreach and payment-arrangement pilot on WhatsApp and voice for a defined delinquency segment, with approved-matrix restructuring, in-conversation payment and hardship routing to human officers.",
    expansion: [
      "Add self-service balance, statement and salary-deduction discrepancy servicing on the careline",
      "Extend to campaign and settlement-window handling with eligibility computation and payment",
      "Add current-student disbursement and application servicing across campus channels",
    ],
    stakeholders: [
      "Chief Executive Officer, PTPTN",
      "Chief Operating Officer / Deputy CEO (Operations)",
      "Head of Loan Repayment and Recovery",
      "Chief Information Officer / Head of Information Technology",
      "Head of Corporate Communications for outreach-tone governance",
    ],
    discovery: [
      "What is the current contact rate and recovery rate on the delinquent portfolio, and by which channels are attempts made today?",
      "What restructuring and settlement terms may be offered without officer discretion, and who approves that matrix?",
      "What contact-timing, frequency and tone constraints apply to borrower outreach, and are they policy or statute?",
      "Can the loan ledger accept a payment arrangement and payment written back by an external agent in real time?",
    ],
    flowTemplate: "collections",
    scenario: "A PTPTN borrower who has ignored letters for two years replies to a WhatsApp message in Bahasa Malaysia and sets up an approved repayment plan with the first payment made in-conversation.",
  },

  "kwsp-epf": {
    operatingContext:
      "KWSP, the Employees Provident Fund, is Malaysia's mandatory retirement savings institution, holding accounts for well over fifteen million members and administering employer and employee contributions plus a set of permitted withdrawal categories covering retirement, housing, education, health and the newer flexible-account arrangements. Member interaction is dominated by i-Akaun portal and app access, contribution statement queries, withdrawal applications and their status, nominee and beneficiary updates, and employer-side contribution submission. Members reach it through a contact centre, i-Akaun self-service, branch counters, and kiosk channels, in Bahasa Malaysia, English, Mandarin and Tamil. Policy changes to withdrawal rules reliably produce nationwide surges that fill branches and saturate the contact centre.",
    strategicPressure: [
      { text: "Changes to withdrawal rules and account structures in Malaysia have repeatedly produced immediate, nationwide member contact surges with branch queues forming on announcement day.", kind: "verified" },
      { text: "Retirement-adequacy concerns keep EPF under public policy attention, making member understanding of balances and withdrawal consequences a mandate issue rather than a service metric.", kind: "verified" },
      { text: "A meaningful share of contact volume is i-Akaun access failure and password recovery — pure self-service breakdown that consumes agent capacity for zero member value.", kind: "inference" },
      { text: "EPF is more digitally capable than most Malaysian statutory bodies, so the engagement must be positioned as supplied capability into their roadmap rather than as a replacement for it.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "EPF has a genuine internal digital function and has shipped member-facing digital services, which makes this the most build-capable account in the government-linked group. But its capability is application development and integration, not speech, multilingual NLU, or conversational orchestration and evaluation. The realistic classification is buy-led on the conversational stack with partner-led delivery — EPF will want to own the member experience and integration while the agent platform is supplied.",
    whyNotBuild:
      "Even with a capable digital team, EPF would need four-language speech at contact-centre scale, telephony that absorbs a policy-announcement surge, an evaluation regime for financial statements members act on, and continuous model operations — all while its own team is committed to core member-services delivery. The opportunity cost is the decisive argument: buying the conversational layer lets EPF's engineers spend their time on i-Akaun and withdrawal journeys rather than on speech infrastructure.",
    workflows: [
      {
        name: "Withdrawal application and status servicing",
        friction: "Members applying for housing, education or flexible withdrawals cannot see which document or eligibility condition is holding the application, so they call the contact centre and visit branches repeatedly.",
        outcome: "Grounded eligibility guidance at application time, named outstanding requirements, and proactive status updates through to payment — cutting the dominant branch and contact-centre driver.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Withdrawal processing system", "Member account ledger", "Document management", "Payment records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "i-Akaun access recovery and account servicing",
        friction: "Members locked out of i-Akaun, or unable to complete registration and verification, call the contact centre or queue at a branch for what is fundamentally a self-service failure.",
        outcome: "Guided, identity-verified access recovery and registration completion in the member's language across voice and messaging, removing a large block of zero-value assisted contacts.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Member identity and authentication", "i-Akaun registration records", "Member master data"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Policy-change surge handling",
        friction: "When withdrawal rules or account structures change, every member wants to know what it means for their specific balance, and the announcement-day surge overwhelms both branches and the contact centre.",
        outcome: "Elastic multilingual capacity that explains the change against the member's own account position with grounded, citable rules, converting a queue-forming event into a self-service moment.",
        channels: ["Voice", "WhatsApp", "App chat", "Web chat"],
        systems: ["Member account ledger", "Policy and rules repository", "Withdrawal eligibility engine", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "i-Akaun member portal and mobile app for balances, statements and withdrawal applications",
        "National contact centre across voice and messaging channels",
        "Branch counters and self-service kiosks nationwide",
        "Employer portal for contribution submission and reconciliation",
      ],
      gaps: [
        "Withdrawal applicants cannot identify the specific condition blocking their application",
        "i-Akaun lockouts and registration failures still require assisted service",
        "No capacity to absorb an announcement-day surge without branch queues",
        "Members cannot get a personalised explanation of what a policy change means for their own balance",
      ],
    },
    risks: [
      "Member retirement savings data is highly sensitive financial data with strict PDPA and statutory confidentiality obligations, including processing-location constraints.",
      "Any statement about withdrawal eligibility or amounts must be grounded and auditable; entitlement decisions remain with EPF officers with human escalation on refusals.",
      "EPF's internal digital team will define the integration and experience boundary — commercial framing must avoid appearing to displace their roadmap.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 1.5,
      automationRate: 0.6,
      basis: "Seller assumptions from EPF's published membership and Malaysian contact-centre pricing; the operative baseline is contact-centre offered volume by reason plus branch transaction counts on a policy-announcement month versus a normal month.",
    },
    pilotScope:
      "Automate withdrawal application status and i-Akaun access recovery in four languages on voice and WhatsApp, grounded in the member ledger, with eligibility decisions and refusals routed to EPF officers.",
    expansion: [
      "Add guided withdrawal application intake with eligibility guidance and document validation",
      "Extend to policy-change surge handling with personalised balance-impact explanation",
      "Open an employer channel for contribution submission, reconciliation and late-payment servicing",
    ],
    stakeholders: [
      "Chief Executive Officer, KWSP/EPF",
      "Deputy Chief Executive Officer, Operations",
      "Chief Information Officer / Head of Digital",
      "Head of Member Services and Contact Centre",
      "Head of Procurement and statutory-body tendering",
    ],
    discovery: [
      "What is the contact-centre and branch volume split between withdrawal status, i-Akaun access and general account queries?",
      "What happened to contact and branch volume on the last withdrawal-policy announcement, and how long did the elevated volume persist?",
      "Where does EPF's internal digital team draw the line between what they build and what they buy for member-facing conversation?",
      "Can withdrawal status including the specific blocking requirement be exposed to an authenticated agent in real time?",
    ],
    flowTemplate: "onboarding",
    scenario: "A KWSP member checks in Bahasa Malaysia why an education withdrawal is still pending and learns the exact document outstanding instead of queueing at a branch on announcement week.",
  },

  prasarana: {
    operatingContext:
      "Prasarana is the government-owned operator of Kuala Lumpur's urban public transport — the Kelana Jaya and Ampang/Sri Petaling LRT lines, the KL Monorail, the MRT lines it operates on behalf of MRT Corp, the Rapid bus networks in the Klang Valley, Penang and Pahang, and BRT Sunway. It moves a very large daily ridership of commuters who are time-critical and highly vocal on social media when service falters. Passenger contact concentrates on service disruptions and delays, journey planning across an interlocking multi-line network, concession-card and fare-product queries, lost property, and accessibility assistance. Contact runs through a customer careline, station staff, social channels, and app-based information, in Bahasa Malaysia and English with Mandarin and Tamil expectation from the Klang Valley commuter population.",
    strategicPressure: [
      { text: "Rail service disruptions in the Klang Valley become national news within minutes, so the speed and specificity of passenger communication during an incident is a public accountability issue.", kind: "verified" },
      { text: "Operating multiple rail lines plus bus networks under one operator means a single journey commonly spans modes, and passengers cannot get one answer about an interrupted end-to-end trip.", kind: "inference" },
      { text: "Concession-card administration for students, senior citizens and disabled passengers is an entitlement process with documentation rules that generate persistent, repetitive contact.", kind: "inference" },
      { text: "Prasarana's funding position and its relationship with the Ministry of Finance mean discretionary technology spend must be tied to a demonstrable operational outcome.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Prasarana is a transit operating company; its technology is procured from vendors and its customer careline is a staffed operation. There is no software product or AI engineering function, and its investment focus is rolling stock, signalling and network availability. Buy-led, with the practical constraint being budget authority and the split of responsibility with MRT Corp on the lines it operates for others.",
    whyNotBuild:
      "Disruption communication that is specific to a passenger's journey requires live grounding into service-status feeds across several rail lines and bus networks, multilingual conversation, and elastic capacity precisely at the moment when the operator is least able to attend to it. Prasarana cannot build or staff that. Buying a configured capability makes disruption communication a repeatable, measurable process rather than a scramble.",
    workflows: [
      {
        name: "Service disruption communication and journey re-planning",
        friction: "When a line goes down, announcements are generic, the careline and social channels flood simultaneously, and commuters cannot find out which alternative bus bridging or route actually serves their journey.",
        outcome: "Instant journey-specific disruption answers with live alternative routing across rail and bus, delivered at unlimited concurrency in the passenger's language during exactly the incident peak.",
        channels: ["WhatsApp", "Voice", "App push", "Social messaging"],
        systems: ["Service status and operations feed", "Network route and timetable data", "Bus bridging dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Concession card and fare-product servicing",
        friction: "Students, seniors and disabled passengers applying for or renewing concession entitlements face documentation rules explained inconsistently, and then chase application status at counters.",
        outcome: "Grounded eligibility and documentation guidance with guided application intake and proactive status through to card issue, removing counter queues for a purely administrative process.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Concession/fare card management", "Eligibility rules repository", "Application workflow", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Lost property and station-assistance requests",
        friction: "Lost-item reports and accessibility assistance requests are handled by station staff and the careline manually, with poor follow-up and no way for a passenger to check status after leaving the network.",
        outcome: "Structured multilingual intake with automated matching for lost property and pre-booked assistance requests routed to the correct station, with proactive notification on both.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Lost property register", "Station operations rostering", "Case management", "Notification gateway"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Customer careline and station customer-service counters across the network",
        "Journey-planning and service-status information through app and web channels",
        "Active social-media channels used heavily for disruption enquiries",
        "Concession card administration through counters and an application process",
      ],
      gaps: [
        "No journey-specific answer during a disruption — only generic line-level announcements",
        "Alternative bus bridging information is not matched to the individual commuter's route",
        "Concession applications have no self-service status path",
        "Lost property and assistance requests have no proactive follow-up channel",
      ],
    },
    risks: [
      "Budget authority sits with the Ministry of Finance as owner, so a business case must survive government-level scrutiny even for an operator-level pilot.",
      "Responsibility for MRT lines is shared with MRT Corp, which may constrain what service data Prasarana can expose for those lines.",
      "Passenger personal data in concession applications includes identity and disability information subject to PDPA sensitivity and handling constraints.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.3,
      automationRate: 0.6,
      basis: "Seller assumptions from Prasarana's published ridership and Malaysian contact-centre pricing; validate against careline and social-channel enquiry volumes plus disruption-day spikes in discovery.",
    },
    pilotScope:
      "Deploy journey-specific disruption communication with live alternative routing across the LRT and Rapid bus network on WhatsApp and voice in Bahasa Malaysia and English, measured on disruption-day contact deflection.",
    expansion: [
      "Add concession-card eligibility guidance, application intake and status",
      "Extend to lost property matching and pre-booked station assistance requests",
      "Add Mandarin and Tamil coverage and extend to the Penang and Pahang bus networks",
    ],
    stakeholders: [
      "President and Group Chief Executive Officer, Prasarana",
      "Chief Executive Officer, Rapid Rail",
      "Chief Operating Officer responsible for network operations",
      "Head of Customer Experience and the careline",
      "Chief Information Officer / Head of Digital",
    ],
    discovery: [
      "What is the contact volume on a normal day versus a major disruption day, and across which channels does it arrive?",
      "Can live service status and bus bridging deployment data be exposed to an external agent in real time?",
      "What data may be published about MRT lines operated on behalf of MRT Corp?",
      "Who approves discretionary technology spend at Prasarana, and what outcome measure would justify it?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "During an LRT line failure a Klang Valley commuter asks how to reach their station and gets the specific bus bridging route for their journey instead of a generic delay announcement.",
  },

  "nexco-central": {
    operatingContext:
      "NEXCO Central operates the expressway network across central Japan, including the Tomei and Shin-Tomei corridors linking the Tokyo, Nagoya and Osaka metropolitan regions — some of the most heavily used road infrastructure in the country. Its customer relationship covers toll collection through the ETC electronic system, route and closure information, service-area and parking-area facilities, and roadside assistance coordination. Contact arrives through a customer centre phone line, the website and route-planning tools, ETC card administration channels, and service-area staff, almost entirely in Japanese with limited foreign-driver need. Demand is highly seasonal: Golden Week, Obon and New Year travel plus winter snow closures produce predictable, concentrated inquiry surges.",
    strategicPressure: [
      { text: "Holiday travel periods in Japan concentrate expressway demand into specific days, producing congestion-information and route-planning inquiry surges that a fixed customer centre absorbs poorly.", kind: "verified" },
      { text: "Winter weather closures and chain regulations on mountain sections generate urgent, safety-relevant inquiries where a delayed or generic answer has real consequences for drivers.", kind: "verified" },
      { text: "ETC card and toll-discount administration is rules-heavy — discount schemes vary by time, vehicle class and route — and produces persistent, repetitive contact that frontline staff answer inconsistently.", kind: "inference" },
      { text: "Japanese infrastructure operators of this type standardise on vendor-supplied contact-centre platforms rather than internal development, so the entry is a procurement conversation with an established integrator relationship.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "NEXCO Central is a road infrastructure operator whose IT is delivered by system integrators under long-standing vendor relationships, and whose customer centre is an operated service. There is no internal speech or conversational-AI engineering. Buy-led, with the specific Japanese-market caveat that the incumbent integrator will likely be the contracting path rather than a direct award.",
    whyNotBuild:
      "The requirement is high-quality Japanese speech with road, interchange and route vocabulary, live grounding into traffic and closure information, correct application of complex toll-discount rules, and surge capacity for a handful of predictable holiday peaks each year. Building that for a road operator would be an unjustifiable use of capital against a demand curve that is spiky and seasonal. A bought capability sized to peak and idle otherwise is the correct economic shape.",
    workflows: [
      {
        name: "Route, congestion and closure information",
        friction: "During holiday peaks and snow events drivers call the customer centre for route and closure guidance, wait in a queue, and receive information that was already stale by the time they reached an agent.",
        outcome: "Instant Japanese-language route and closure answers grounded in live traffic and restriction data, including chain-regulation status, at unlimited concurrency during exactly the seasonal peaks.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Traffic information and closure feed", "Route and interchange data", "Weather and restriction notices"],
        value: 3,
        complexity: 2,
      },
      {
        name: "ETC card and toll-discount servicing",
        friction: "Toll discount schemes differ by time of day, vehicle class, route and card type, and drivers who believe they were charged incorrectly must call and describe a trip an agent then reconstructs manually.",
        outcome: "Grounded discount-rule explanation against the driver's actual trip record with dispute intake and tracked resolution, replacing manual reconstruction with a consistent, auditable answer.",
        channels: ["Voice", "Web chat"],
        systems: ["ETC transaction records", "Toll and discount rules repository", "Customer account data", "Case management"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Service-area facilities and roadside assistance coordination",
        friction: "Drivers call about service-area facilities, opening hours, EV charging availability and breakdown assistance, and each is a manual lookup or a transfer to a separate assistance provider.",
        outcome: "Grounded facility and charging-availability answers plus structured assistance intake with location capture and warm transfer to the assistance operator with full context.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Service-area facility data", "EV charger status feed", "Roadside assistance dispatch", "Location services"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer centre telephone line for road and toll inquiries",
        "Website and route-planning tools with traffic and closure information",
        "ETC card administration and toll transaction records for account holders",
        "Service-area and parking-area staffed facilities across the network",
      ],
      gaps: [
        "No conversational access to live closure and chain-regulation status for a specific planned route",
        "Toll-discount disputes require manual trip reconstruction by an agent",
        "EV charger and facility availability is not answerable in real time",
        "No surge capacity for holiday-period and snow-event inquiry peaks",
      ],
    },
    risks: [
      "Japanese public-infrastructure procurement is typically routed through an incumbent system integrator, so a direct commercial relationship may not be available.",
      "Road closure and chain-regulation information is safety-relevant — the agent must ground strictly in authoritative feeds and never infer or extrapolate road conditions.",
      "Driver and ETC transaction data is personal information under Japanese law with domestic-processing expectations for a public-infrastructure operator.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions from NEXCO Central's network scale and Japanese contact-centre labour economics; the real baseline is the customer centre's offered volume by reason and its seasonal peak ratio, which must be requested in discovery.",
    },
    pilotScope:
      "Deploy a Japanese-language route, congestion and closure information agent on voice and LINE grounded in live traffic and restriction feeds, sized for Golden Week and winter closure peaks.",
    expansion: [
      "Add ETC toll and discount-rule explanation with dispute intake against actual trip records",
      "Extend to service-area facility, EV charging availability and roadside assistance coordination",
      "Add limited English and Mandarin coverage for inbound rental-car drivers",
    ],
    stakeholders: [
      "Executive Officer responsible for Customer Service, NEXCO Central",
      "General Manager, Traffic Management and Operations",
      "General Manager, Information Systems",
      "Head of the Customer Centre",
      "Procurement lead and the incumbent system integrator account team",
    ],
    discovery: [
      "What is the customer centre's offered volume on a Golden Week or snow-closure day versus an average day?",
      "Which traffic, closure and chain-regulation feeds could be exposed to an agent, and with what latency guarantee?",
      "Is ETC customer service centralised across the three NEXCO companies, or handled independently by each?",
      "Which system integrator holds the current contact-centre platform contract, and is a subcontracted route the expected path?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A driver planning a Golden Week trip on the Tomei asks NEXCO Central in Japanese about closures and chain regulations and gets a live, route-specific answer without queueing.",
  },

  "nexco-east": {
    operatingContext:
      "NEXCO East operates the expressway network across eastern and northern Japan, from the Tokyo metropolitan area through Tohoku and into Hokkaido — a footprint where winter conditions dominate operations for several months a year. Snow closures, chain regulations, and winter-tyre requirements on mountain and northern sections make road-condition information a safety function rather than a convenience. Like its sibling companies it manages ETC toll collection, route information, service areas, and roadside assistance coordination, with contact arriving through a customer centre, the website, and ETC administration channels, almost entirely in Japanese. Seasonal asymmetry is extreme: winter drives a distinct and heavier inquiry pattern than the summer holiday peaks.",
    strategicPressure: [
      { text: "Winter closures and chain regulations across Tohoku and Hokkaido routes generate urgent, safety-relevant inquiry surges concentrated in specific weather windows.", kind: "verified" },
      { text: "Obon and New Year travel produce holiday congestion peaks on top of the winter pattern, giving the network two distinct annual surge shapes rather than one.", kind: "verified" },
      { text: "Toll-discount and ETC administration rules are identical in complexity to the sibling NEXCO companies, so a capability configured once has direct replication value across all three.", kind: "inference" },
      { text: "Japanese road operators are conservative buyers who will want a working reference before committing, which makes sequencing behind or alongside a sibling deployment strategically important.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "NEXCO East procures its customer-facing systems through system integrators and operates its customer centre as a service; there is no internal conversational-AI capability. Buy-led, with the same Japanese-market characteristic that the contracting route likely runs through an established integrator.",
    whyNotBuild:
      "Safety-relevant winter road information demands grounding in authoritative feeds with strict no-extrapolation behaviour, high-quality Japanese speech, and elastic capacity concentrated into weather windows nobody can schedule. A road operator has no reason to build speech infrastructure for that; it needs a governed capability it can point at when asked how driver information was produced.",
    workflows: [
      {
        name: "Winter road condition, closure and chain-regulation information",
        friction: "During a snow event drivers call the customer centre for closure and chain-regulation status on specific sections, queue while conditions change, and act on information that is already out of date.",
        outcome: "Live, section-specific Japanese-language answers on closures, chain regulations and winter-tyre requirements at unlimited concurrency, delivered during the weather window rather than after it.",
        channels: ["Voice", "LINE", "Web chat", "SMS"],
        systems: ["Traffic and closure feed", "Weather and restriction notices", "Route and section data", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Holiday congestion and route planning",
        friction: "Obon and New Year travellers seek route and congestion guidance simultaneously, the customer centre saturates, and drivers plan on generic published forecasts rather than live conditions.",
        outcome: "Route-specific congestion and travel-time guidance grounded in live traffic data, absorbing predictable holiday peaks without additional seasonal staffing.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Traffic information feed", "Route and interchange data", "Congestion forecast data"],
        value: 2,
        complexity: 2,
      },
      {
        name: "ETC toll and discount inquiry handling",
        friction: "Drivers questioning a toll charge or a missing discount require an agent to reconstruct the trip against a complex rule set, producing slow and sometimes inconsistent answers.",
        outcome: "Grounded explanation against the actual ETC trip record with consistent rule application and tracked dispute intake, removing manual reconstruction from the agent workload.",
        channels: ["Voice", "Web chat"],
        systems: ["ETC transaction records", "Toll and discount rules repository", "Customer account data", "Case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Customer centre telephone line for road, toll and ETC inquiries",
        "Website and route-planning tools carrying traffic and closure information",
        "ETC card administration with per-trip toll transaction records",
        "Service-area facilities and roadside assistance coordination across the network",
      ],
      gaps: [
        "Section-specific winter closure and chain-regulation status is not conversationally accessible",
        "No surge capacity during weather windows when driver demand is highest and most urgent",
        "Toll-discount questions require manual trip reconstruction",
        "Foreign drivers on northern tourist routes have effectively no language coverage",
      ],
    },
    risks: [
      "Winter road information is safety-critical; the agent must never state or infer a road condition not present in an authoritative feed, with clear fallback to official notices.",
      "Procurement is expected to run through an incumbent system integrator under Japanese public-infrastructure contracting norms.",
      "Driver and ETC data is personal information under Japanese law with domestic-processing expectations.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions from NEXCO East's network scale and Japanese contact-centre labour economics; the real baseline is customer-centre offered volume across a winter month versus a summer month.",
    },
    pilotScope:
      "Deploy a Japanese-language winter road condition, closure and chain-regulation information agent on voice and LINE for the Tohoku and Hokkaido sections, grounded strictly in authoritative closure feeds.",
    expansion: [
      "Add holiday congestion and route-planning guidance across the full network",
      "Extend to ETC toll and discount explanation with dispute intake",
      "Replicate the configured deployment to the sibling NEXCO companies as a shared capability",
    ],
    stakeholders: [
      "Executive Officer responsible for Customer Service, NEXCO East",
      "General Manager, Traffic Management and Road Operations",
      "General Manager, Information Systems",
      "Head of the Customer Centre",
      "Procurement lead and incumbent system integrator account team",
    ],
    discovery: [
      "What is the customer centre's offered volume during a major snow event compared with an average winter day?",
      "Which closure and chain-regulation feeds are authoritative, and what latency do they carry?",
      "Would NEXCO East prefer to follow a sibling company's deployment as a reference, or lead?",
      "What proportion of winter inquiries are safety-relevant enough to require a strict no-inference policy?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A driver heading into Tohoku during a snowfall asks NEXCO East in Japanese whether chain regulations apply to their route and gets the live, section-level answer immediately.",
  },

  "korea-post": {
    operatingContext:
      "Korea Post is the government postal operator under the Ministry of Science and ICT, running three distinct businesses from one network: mail and parcel delivery, a deposit-taking postal savings bank, and a postal insurance business. That combination makes its customer contact unusually varied — parcel and EMS tracking sits alongside savings-account, deposit-product, and insurance-claim inquiries from the same national call centres and the same post-office counters. Its customer base skews toward older and rural Koreans who use post-office financial services precisely because they prefer a counter and a phone line to an app. Servicing is Korean-language, with a strong cultural expectation of polite, formal, correct handling.",
    strategicPressure: [
      { text: "Running postal, banking and insurance servicing through a shared call-centre and counter network means very different query types compete for the same finite agent capacity.", kind: "inference" },
      { text: "Korea's private parcel operators set an extremely high delivery-service benchmark, which raises expectations on tracking and delivery-exception handling that a government operator must match.", kind: "verified" },
      { text: "An older and rural customer skew in postal financial services means voice remains the primary channel and cannot be deprecated in favour of app self-service.", kind: "inference" },
      { text: "Korean public-sector AI procurement carries strong domestic-vendor and data-sovereignty expectations, which shapes both the partner structure and the deployment architecture.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Korea Post is a government agency whose systems are procured under public tender with domestic integrators; it operates rather than engineers its customer channels, and there is no internal conversational-AI capability. Buy-led, with the important nuance that Korean public-sector procurement will likely require a domestic prime contractor and in-country deployment, making partner structure part of the deal design.",
    whyNotBuild:
      "Serving three regulated business lines conversationally requires Korean speech at national call-centre quality, grounding across parcel tracking, banking core and insurance claims systems, strict correctness on financial and insurance statements, and audit evidence acceptable to a government agency and financial regulators. Korea Post has no path to building that, and the domestic-vendor procurement norm means the practical choice is which supplied platform, not whether to build.",
    workflows: [
      {
        name: "Parcel and EMS tracking with delivery exceptions",
        friction: "Tracking updates are terse status codes, failed deliveries and customs holds on EMS shipments are discovered late, and resolving an address or redelivery requires reaching the delivery post office by phone.",
        outcome: "Conversational Korean tracking that explains actual status including customs stages, captures redelivery and address changes with write-back, and pushes exception alerts before an item returns.",
        channels: ["Voice", "KakaoTalk", "SMS", "App chat"],
        systems: ["Track-and-trace", "EMS and customs status", "Delivery route management", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Postal savings account and deposit-product servicing",
        friction: "Older customers call or visit counters for balances, deposit maturities, interest terms and product comparisons, consuming counter capacity for questions that are entirely rules-based.",
        outcome: "Voice-first Korean account servicing with balance, maturity and interest answers plus product-term explanation, reserving counters for transactions that genuinely require them.",
        channels: ["Voice", "KakaoTalk"],
        systems: ["Postal banking core", "Deposit product catalogue", "Identity verification", "Branch appointment scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Postal insurance policy and claim-status servicing",
        friction: "Policyholders and beneficiaries chase claim status by phone, are asked to re-explain the case each time, and cannot see which document is outstanding on a claim already filed.",
        outcome: "Grounded policy and claim-status answers with named outstanding requirements and proactive status pushes, with all assessment and payment decisions retained by insurance staff.",
        channels: ["Voice", "KakaoTalk", "Web chat"],
        systems: ["Insurance policy administration", "Claims processing", "Document management", "Case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "National postal customer call centres covering delivery, banking and insurance",
        "Tracking website and mobile app for domestic parcels and EMS",
        "Nationwide post-office counters providing postal, banking and insurance services",
        "SMS and messaging notifications for delivery and financial transactions",
      ],
      gaps: [
        "Tracking status codes are not explained in a way customers can act on, particularly for EMS customs stages",
        "Banking and insurance queries queue behind parcel queries on the same lines",
        "Redelivery and address changes still require contacting the delivery post office",
        "Claim status between filing and payment is not proactively communicated",
      ],
    },
    risks: [
      "Korean public-sector procurement carries domestic-vendor preference and in-country data-processing expectations that shape both partner structure and architecture.",
      "Postal banking and insurance data is regulated financial data under Korean financial supervision, requiring bank-grade controls and strict statement correctness.",
      "Insurance claim assessment and any statement about payout must remain with qualified staff; the agent reports status and requirements only.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 3.5,
      automationRate: 0.55,
      basis: "Seller assumptions from Korea Post's national network scale and Korean contact-centre labour economics; the real baseline is call-centre offered volume split across postal, banking and insurance lines.",
    },
    pilotScope:
      "Deploy Korean-language parcel and EMS tracking with delivery-exception handling and redelivery write-back on voice and KakaoTalk, measured on delivery-post-office call deflection and return reduction.",
    expansion: [
      "Add postal savings account and deposit-product servicing with identity-verified balance and maturity answers",
      "Extend to postal insurance policy and claim-status servicing with human-retained assessment",
      "Add proactive delivery, maturity and claim-stage notifications across all three business lines",
    ],
    stakeholders: [
      "Commissioner, Korea Post",
      "Director General, Postal Business Bureau",
      "Director General, Postal Financial Business (savings and insurance)",
      "Head of Customer Service and Call Centre Operations",
      "Head of Information Planning and public-tender procurement",
    ],
    discovery: [
      "How is call-centre volume split between parcel, banking and insurance inquiries, and are the queues shared or separated?",
      "What domestic-vendor and data-residency requirements apply to an AI system procured by a government agency?",
      "Can the delivery route system accept a redelivery or address instruction generated by an external agent?",
      "What controls would the financial supervisory framework require before automated statements about deposit or insurance products?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Korean customer asks Korea Post in Korean why an EMS parcel has stalled, learns it is held at customs with the specific document needed, and schedules redelivery in the same conversation.",
  },

  "hk-hospital-authority": {
    operatingContext:
      "The Hospital Authority manages Hong Kong's public hospital system — over forty public hospitals plus specialist and general outpatient clinics organised into geographic clusters — and provides the large majority of inpatient care in the territory. Its patient interaction is dominated by appointment booking and rescheduling for general and specialist outpatient clinics, pre-visit instructions, medication refill collection, test-result follow-up scheduling, and general service inquiries, alongside the HA Go patient app. Specialist outpatient waiting times for stable new cases run long enough to be a standing public issue, which makes every appointment change and status query emotionally loaded. Servicing is Cantonese-first with English and increasing Mandarin need, and the patient population skews older with lower app adoption.",
    strategicPressure: [
      { text: "Hong Kong's rapidly ageing population is increasing outpatient and chronic-disease appointment volume faster than clinic and administrative capacity can grow.", kind: "verified" },
      { text: "Long specialist outpatient waiting times are a persistent public and legislative issue, making appointment administration a visible measure of system performance.", kind: "verified" },
      { text: "The HA Go app has moved some booking and payment online, but an older patient base still relies on telephone booking lines that saturate at clinic opening hours.", kind: "inference" },
      { text: "Missed appointments waste scarce specialist capacity in a system that cannot afford it, giving reminder and reschedule automation direct clinical-capacity value.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "The Hospital Authority procures clinical and administrative systems from vendors under structured public procurement, with its internal IT division focused on the clinical management system and its integrations. There is no in-house speech or conversational-AI engineering function, and healthcare governance makes an unvalidated internal build particularly unattractive. Buy-led, with strict clinical-safety boundaries defining the scope of what may be automated.",
    whyNotBuild:
      "This needs Cantonese speech quality with medical and clinic vocabulary, integration into appointment scheduling across clusters, absolute reliability of the boundary that no agent ever offers clinical advice, and evaluation evidence a health system can defend publicly. The HA cannot build that, and the reputational cost of a self-built assistant giving a patient a wrong instruction would far exceed any efficiency gained. Buying a governed platform with explicit clinical-safety guardrails is the only defensible route.",
    workflows: [
      {
        name: "Outpatient appointment booking and rescheduling",
        friction: "Booking lines saturate at opening hours, patients wait on hold to change an appointment, and elderly patients who cannot use the app have no alternative but the phone queue.",
        outcome: "Cantonese voice and messaging booking and rescheduling against live clinic schedules with confirmation, removing the opening-hour queue and giving non-app patients a working channel.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Appointment scheduling system", "Patient master index", "Clinic capacity data", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Appointment reminders, preparation and no-show reduction",
        friction: "Patients arrive unprepared for procedures requiring fasting or specific documentation, or simply do not attend, wasting specialist slots that others waited months for.",
        outcome: "Proactive reminders with clear preparation instructions and one-tap reschedule, recovering wasted specialist capacity and improving preparation compliance without clinical advice.",
        channels: ["SMS", "WhatsApp", "Voice", "App push"],
        systems: ["Appointment scheduling", "Procedure preparation content", "Patient contact records", "Notification gateway"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Medication refill and general service inquiries",
        friction: "Patients call clinics for refill collection arrangements, opening hours, fee and waiver questions, and directions, occupying clinic staff who should be handling patients in front of them.",
        outcome: "Grounded answers on refill collection, clinic logistics, fees and waivers in Cantonese, English and Mandarin, with anything clinical routed immediately to qualified staff.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Pharmacy refill records", "Clinic service directory", "Fee and waiver rules", "Patient master index"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "HA Go patient app with appointment, payment and record-access functions",
        "Telephone booking lines for general and specialist outpatient clinics",
        "Cluster and hospital general-inquiry hotlines",
        "SMS appointment reminders to registered patients",
      ],
      gaps: [
        "Telephone booking capacity does not meet demand at clinic opening hours",
        "Elderly patients without app access have no self-service booking alternative",
        "Preparation instructions are not delivered conversationally or confirmed as understood",
        "Refill and clinic-logistics questions still occupy clinical and clerical staff",
      ],
    },
    risks: [
      "Clinical safety is absolute: the agent must never provide diagnosis, triage, medication or treatment advice, and any clinical cue must route immediately to qualified staff with the transcript.",
      "Patient data is highly sensitive personal data under Hong Kong privacy law with health-system confidentiality obligations and strict processing-location constraints.",
      "Public procurement through the HA's structured framework governs award, and clinical-governance sign-off will be required in addition to IT approval.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions from the HA's published attendance volumes and Hong Kong contact-centre labour economics; the real baseline is booking-line offered volume, hospital hotline volume and current no-show rates by specialty.",
    },
    pilotScope:
      "Deploy Cantonese appointment rescheduling and reminder servicing with preparation instructions for general outpatient clinics in one hospital cluster, with hard routing of any clinical question to qualified staff.",
    expansion: [
      "Add live specialist outpatient booking and rescheduling across additional clusters",
      "Extend to medication refill, fee and waiver, and clinic-logistics inquiries",
      "Add Mandarin and English coverage and proactive test-result follow-up scheduling",
    ],
    stakeholders: [
      "Director of Cluster Services, Hospital Authority",
      "Chief Manager, Patient Experience and Community Relations",
      "Head of Information Technology and Health Informatics",
      "Cluster Chief Executive of the pilot cluster",
      "Head of Procurement and clinical-governance committee chair",
    ],
    discovery: [
      "What is the offered-versus-answered call volume on outpatient booking lines at opening hours, and what is the current no-show rate by specialty?",
      "Can the appointment scheduling system accept a booking or reschedule written by an external agent, and under what authentication model?",
      "What clinical-governance approval process applies to a patient-facing conversational system, and who chairs it?",
      "What proportion of hospital hotline calls are non-clinical logistics that could be fully automated today?",
    ],
    flowTemplate: "appointments",
    scenario: "An elderly Hong Kong patient reschedules a specialist outpatient appointment in Cantonese by phone at 8am without waiting in the booking-line queue.",
  },

  "hk-housing-authority": {
    operatingContext:
      "The Hong Kong Housing Authority plans, builds and manages the territory's public rental housing, which accommodates a very large share of Hong Kong's population, and also administers subsidised home-ownership schemes. Its resident and applicant interaction covers public-rental-housing application status and the waiting-list position that dominates public debate, tenancy matters including rent payment and household changes, estate maintenance requests, and periodic subsidised-sale scheme applications and ballots. Contact arrives through hotlines, estate management offices, and the Housing Authority website and app, in Cantonese with English and some South Asian language need among ethnic-minority applicants. Waiting-list applicants are the single most repetitive contact population, calling for a status that changes slowly.",
    strategicPressure: [
      { text: "Public rental housing waiting time is one of Hong Kong's most politically scrutinised statistics, which makes applicant communication a visible governance matter rather than routine service.", kind: "verified" },
      { text: "Subsidised-sale scheme launches produce concentrated application and ballot-result inquiry surges within short, fixed windows.", kind: "verified" },
      { text: "Ethnic-minority applicants face a language barrier in a service where misunderstanding an application requirement can cost years of waiting-list position.", kind: "inference" },
      { text: "Estate maintenance requests from an ageing public housing stock generate steady, repetitive contact that estate offices handle manually.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "The Housing Authority is a public body that procures IT under government tendering; its systems are vendor-delivered and its hotlines are operated services. There is no internal conversational-AI capability. Buy-led, with the caveat that waiting-list communication carries political sensitivity that requires carefully bounded, approved messaging.",
    whyNotBuild:
      "Automating applicant and tenant servicing needs Cantonese speech, additional language coverage for ethnic-minority applicants, grounding in application and tenancy records, and messaging discipline strict enough that no automated statement can be read as a promise about waiting time. A government body cannot assemble that capability, and the political exposure of getting waiting-list communication wrong makes a governed, auditable bought platform the safer route.",
    workflows: [
      {
        name: "Public rental housing application status servicing",
        friction: "Applicants call repeatedly to ask where they sit on the waiting list and what happens next, and hotline agents read back a status with no explanation of the process stage or the documents that will be needed.",
        outcome: "Grounded application-stage answers with clear explanation of the next step and required documents, plus proactive notification at each stage change, replacing repetitive status calls.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Housing application system", "Applicant records", "Document management", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Tenancy and rent servicing",
        friction: "Tenants contact estate offices about rent payment, household member changes, transfer applications and rent-assistance eligibility, and each requires an officer to check records and explain rules manually.",
        outcome: "Conversational tenancy servicing that answers rent, payment and household-change questions from the tenancy record and files change applications with tracked status.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Tenancy management system", "Rent and payment records", "Application workflow", "Case management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Estate maintenance request intake and status",
        friction: "Residents report maintenance faults to estate offices by phone or in person, receive no reference or timeline, and call again to ask whether anyone is coming.",
        outcome: "Structured maintenance intake with location and fault classification, appointment scheduling where required, and proactive status through to completion.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Maintenance work-order system", "Estate and unit records", "Contractor scheduling", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Housing Authority hotlines for applicants and tenants",
        "Estate management offices providing in-person tenancy and maintenance services",
        "Housing Authority website and app with application and scheme information",
        "Written notification by mail for application stage changes and scheme results",
      ],
      gaps: [
        "Applicants cannot get an explanation of what their application stage means or what comes next",
        "No proactive notification at application stage changes beyond periodic mail",
        "Maintenance requests carry no reference, timeline or status visibility",
        "Language coverage for ethnic-minority applicants is limited on remote channels",
      ],
    },
    risks: [
      "Waiting-list communication is politically sensitive — no automated statement may imply a waiting-time commitment, and messaging must be pre-approved and auditable.",
      "Applicant and tenant data includes household income and composition, which is sensitive personal data under Hong Kong privacy law.",
      "Government tendering governs procurement, and estate-level operations may be delivered by contracted property management companies with their own systems.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4.0,
      automationRate: 0.55,
      basis: "Seller assumptions from the Authority's published tenant and applicant population and Hong Kong contact-centre labour economics; validate against hotline offered volume and estate-office contact counts in discovery.",
    },
    pilotScope:
      "Deploy Cantonese and English public-rental-housing application-status servicing on voice and WhatsApp with next-step explanation and proactive stage notifications, using approved messaging that makes no waiting-time commitment.",
    expansion: [
      "Add tenancy, rent and household-change servicing with application filing and tracked status",
      "Extend to estate maintenance request intake, scheduling and completion notification",
      "Add South Asian language coverage for ethnic-minority applicants across all workflows",
    ],
    stakeholders: [
      "Director of Housing / Deputy Director (Housing Management)",
      "Assistant Director responsible for Applications and Home Ownership",
      "Chief Systems Manager / Head of Information Technology",
      "Head of Customer Service and hotline operations",
      "Head of Procurement and Supplies",
    ],
    discovery: [
      "What proportion of hotline volume is waiting-list status enquiry, and how often does the same applicant call in a year?",
      "What language can be used about application stages without implying a waiting-time commitment, and who approves that wording?",
      "Can the application and tenancy systems expose stage and record data to an authenticated external agent?",
      "Are estate maintenance operations run in-house or by contracted property managers with separate work-order systems?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Hong Kong public housing applicant asks in Cantonese what their current application stage means and which documents will be needed next, instead of calling the hotline again for the same status.",
  },

  "transport-for-nsw": {
    operatingContext:
      "Transport for NSW is the state transport authority responsible for Sydney's and regional New South Wales's multimodal network — metro, suburban trains, buses, light rail and ferries — together with the Opal ticketing system and the 131 500 transport information line. It does not operate every service itself but is the accountable customer-facing authority for journey planning, service disruption information, Opal card balances, refunds and concession entitlements, and accessibility travel assistance. Its customer base is one of Australia's most linguistically diverse, with large Mandarin, Arabic, Vietnamese and Korean speaking communities in Sydney. Contact concentrates sharply around disruption events, timetable changes, and Opal account and refund issues.",
    strategicPressure: [
      { text: "Rail disruptions and industrial action in Sydney produce mass simultaneous demand for journey-specific information across a network where a single incident affects hundreds of thousands of trips.", kind: "verified" },
      { text: "NSW government digital-service policy has driven a decade of customer-experience modernisation with an expectation of measurable service standards.", kind: "verified" },
      { text: "Sydney's linguistic diversity makes English-only phone information a genuine equity gap for communities that depend most heavily on public transport.", kind: "inference" },
      { text: "Opal card refunds, balance transfers and concession entitlement disputes generate persistent transactional contact that is entirely rules-based.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Transport for NSW procures customer-facing technology through established government panels and delivers through partners; the 131 500 line is operated under contract. It has strong digital policy capability but is not a builder of speech or conversational platforms. Buy-led with partner-led delivery — the agency will define standards and integration while the platform is supplied through a panel arrangement.",
    whyNotBuild:
      "Journey-specific disruption information requires live grounding across multiple operators' service feeds, multilingual speech, and capacity that scales instantly during an incident. Building that in-house would duplicate what an agency-supplied platform provides, at a cost that a government auditor would question. Buying through a panel keeps accountability with the agency and puts the speech, orchestration and evaluation burden on the supplier.",
    workflows: [
      {
        name: "Disruption and journey-specific information",
        friction: "When a rail line is disrupted, 131 500 and digital channels flood simultaneously; customers get network-level alerts rather than an answer about their own trip and replacement-bus arrangements.",
        outcome: "Journey-specific multilingual answers grounded in live service and replacement-transport data at unlimited concurrency, delivered during the incident rather than after it.",
        channels: ["Voice", "WhatsApp", "App push", "SMS"],
        systems: ["Real-time service status feed", "Journey planning engine", "Replacement transport dispatch", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Opal account, refund and concession servicing",
        friction: "Opal balance transfers, refunds on incorrect taps, card replacement and concession entitlement checks require phone contact and manual case handling for rules-based decisions.",
        outcome: "Self-service Opal transaction review, rules-based refund processing within an approved matrix, and concession eligibility guidance with application filing and tracked status.",
        channels: ["Voice", "Web chat", "WhatsApp"],
        systems: ["Opal ticketing and transaction records", "Refund workflow", "Concession eligibility rules", "Payment systems"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Accessibility and assisted-travel coordination",
        friction: "Passengers requiring station assistance or accessible travel arrangements must book through phone channels with limited hours, and arrangements are not confirmed back reliably.",
        outcome: "Conversational assisted-travel booking with confirmation to the passenger and the station or operator, plus proactive notification when a disruption affects an assisted journey.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Assisted travel booking", "Station staffing rosters", "Service status feed", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "131 500 transport information line operated under contract",
        "Opal ticketing system with online account management and travel history",
        "Trip Planner and real-time apps plus third-party transport apps using open data",
        "Service alert notifications through app, web and social channels",
      ],
      gaps: [
        "Disruption information is network-level rather than specific to the customer's journey",
        "Language coverage on the information line does not match Sydney's community mix",
        "Opal refund and concession decisions require manual case handling",
        "Assisted-travel arrangements are not reliably confirmed or updated during disruptions",
      ],
    },
    risks: [
      "NSW government procurement panels govern the commercial route, and an existing supplier may already hold the customer-channel contract.",
      "Opal travel history is sensitive location data under NSW privacy legislation, with strict handling, retention and access controls.",
      "Accessibility obligations mean any automated channel must meet government accessibility standards and retain a fully assisted alternative.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 6.0,
      automationRate: 0.6,
      basis: "Seller assumptions from published patronage and Australian contact-centre labour economics; the operative baseline is 131 500 offered volume, disruption-day spikes and Opal case volumes, which must come from the agency.",
    },
    pilotScope:
      "Deploy multilingual journey-specific disruption information on voice and messaging for the Sydney Trains network, grounded in live service and replacement-transport data, measured on disruption-day contact deflection.",
    expansion: [
      "Add Opal account, refund and concession servicing with rules-based processing",
      "Extend to assisted-travel booking with disruption-aware notification",
      "Scale to regional NSW services and add further community languages",
    ],
    stakeholders: [
      "Deputy Secretary, Customer Strategy and Technology, Transport for NSW",
      "Executive Director, Customer Experience",
      "Executive Director, Opal and Ticketing",
      "Head of the 131 500 contact-centre contract",
      "Head of Procurement / panel management",
    ],
    discovery: [
      "What is the 131 500 offered volume on a major disruption day compared with an average day, and what is abandonment at peak?",
      "Which real-time service and replacement-transport feeds can be exposed to an external agent, and at what latency?",
      "Which supplier currently operates 131 500, and when does that contract come up for renewal?",
      "What language coverage would satisfy the agency's equity and accessibility obligations?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "During a Sydney Trains disruption a Mandarin-speaking commuter asks how to get to Parramatta and receives the specific replacement-bus route for their journey.",
  },

  "service-nsw": {
    operatingContext:
      "Service NSW is the single front door for New South Wales government transactions — driver licences and vehicle registration, births deaths and marriages certificates, working with children checks, business licensing, voucher and rebate programmes, and disaster support payments. It delivers through the 13 77 88 contact centre, a network of service centres, and a mobile app and website widely regarded as among the better government digital services in Australia. Its volume profile is bimodal: a steady base of licence and registration transactions plus enormous, unpredictable surges when a voucher programme launches or a flood or bushfire triggers disaster support. Its customer base spans the whole state, including communities where English is a second language and regional areas with limited service-centre access.",
    strategicPressure: [
      { text: "Voucher and rebate programme launches have repeatedly produced contact and digital-channel surges that exceeded planned capacity within hours of announcement.", kind: "verified" },
      { text: "Natural-disaster events require Service NSW to stand up support servicing rapidly for affected communities at precisely the moment those communities are least able to wait in queues.", kind: "verified" },
      { text: "The agency's public reputation for digital service quality raises the expected standard for any new channel — a poor conversational experience would be more damaging here than at a less visible agency.", kind: "inference" },
      { text: "A high proportion of contact-centre volume is routine licence and registration transactions that are entirely rules-based and already digitised in the app.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Service NSW is a digitally sophisticated agency that nonetheless delivers through vendors and government panels rather than building platforms; its internal strength is service design, digital identity and integration. There is a real possibility that a conversational platform is already embedded through an incumbent vendor, which must be established early. Buy-led with partner-led delivery, and the agency will insist on owning the service design.",
    whyNotBuild:
      "Even a strong digital agency does not build multilingual speech, telephony surge infrastructure and conversational evaluation. What Service NSW would build is the service design and the integration into NSW systems and digital identity — which is exactly the right division of labour. The decisive argument is surge: a voucher launch or a flood requires capacity in hours, which only a supplied elastic platform delivers.",
    workflows: [
      {
        name: "Licence and registration transaction servicing",
        friction: "Routine renewals, address changes, demerit-point queries and registration transactions still drive large contact-centre volume from customers who could not complete them digitally or did not know they could.",
        outcome: "Conversational completion of routine licence and registration transactions with digital-identity verification in the customer's language, converting assisted contacts into completed self-service.",
        channels: ["Voice", "WhatsApp", "Web chat", "App chat"],
        systems: ["Licensing and registration systems", "Digital identity verification", "Payment systems", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Programme launch and surge absorption",
        friction: "When a voucher, rebate or support programme is announced, eligibility questions arrive faster than the contact centre and service centres can answer, and customers who qualify give up.",
        outcome: "Elastic multilingual eligibility guidance and application intake from the first hour of a programme, grounded in the programme rules, so uptake is limited by eligibility rather than queue capacity.",
        channels: ["Voice", "WhatsApp", "Web chat", "SMS"],
        systems: ["Programme rules and eligibility engine", "Application workflow", "Digital identity", "Payment systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Disaster support servicing",
        friction: "After a flood or bushfire, affected residents need support-payment and replacement-document help while service centres in the affected region may themselves be closed and phone capacity is overwhelmed.",
        outcome: "Rapidly configurable multilingual disaster-support servicing that guides eligibility, captures applications and replaces critical documents without depending on a local service centre being open.",
        channels: ["Voice", "SMS", "WhatsApp", "Web chat"],
        systems: ["Disaster support programme rules", "Identity and record systems", "Application workflow", "Payment systems"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "13 77 88 contact centre with extended-hours coverage",
        "Service NSW app and website supporting a wide range of digital transactions",
        "State-wide service centre network including regional locations",
        "Digital identity and digital licence infrastructure",
      ],
      gaps: [
        "No elastic capacity when a programme launch or disaster event spikes demand within hours",
        "Language coverage on assisted channels does not match the state's community mix",
        "Customers who cannot complete a digital transaction fall back to a queue rather than a guided conversation",
        "Eligibility questions on new programmes have no grounded conversational answer at launch",
      ],
    },
    risks: [
      "An incumbent vendor may already hold a conversational or contact-centre platform contract, which must be established before pursuit.",
      "NSW privacy legislation and the sensitivity of identity, licence and disaster-support data impose strict handling and residency requirements.",
      "Government accessibility standards apply to every channel, and an assisted alternative must always remain available for customers who cannot use automation.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 6.5,
      automationRate: 0.6,
      basis: "Seller assumptions from Service NSW's published transaction scale and Australian contact-centre labour economics; the real baseline is 13 77 88 offered volume by transaction type plus surge-event volumes from recent programme launches.",
    },
    pilotScope:
      "Automate routine licence and registration transaction servicing on voice and messaging in English plus three community languages with digital-identity verification, measured on assisted-contact deflection and completion rate.",
    expansion: [
      "Add programme-launch eligibility guidance and application intake with elastic surge capacity",
      "Extend to disaster-support servicing with rapidly configurable programme rules",
      "Add further community languages and embed the agent inside the Service NSW app",
    ],
    stakeholders: [
      "Chief Executive Officer, Service NSW",
      "Executive Director, Customer Service Delivery",
      "Executive Director, Digital Channels and Product",
      "Head of Contact Centre Operations",
      "Head of Procurement and panel management",
    ],
    discovery: [
      "What is the contact-centre volume split by transaction type, and how much of it duplicates a transaction already available in the app?",
      "What happened to offered volume in the first 48 hours of the last major voucher programme launch?",
      "Is a conversational-AI platform already contracted through an incumbent vendor, and what does that cover?",
      "How would digital identity verification be extended to a voice channel under the agency's security standards?",
    ],
    flowTemplate: "inbound-service",
    scenario: "In the first hour of a new NSW rebate programme an applicant asks in Arabic whether they qualify and completes the application without joining the 13 77 88 queue.",
  },

  "acc-nz": {
    operatingContext:
      "ACC is New Zealand's universal no-fault accident insurance scheme, covering every resident and visitor for injury regardless of fault, funded through levies on earners, employers, motor vehicles and general taxation. It handles claims in the order of two million a year, most lodged by health providers at the point of treatment, and then manages entitlements including treatment costs, weekly compensation for lost earnings, rehabilitation support and independence allowances. Its contact populations are threefold: injured claimants asking about entitlements and payments, health providers lodging and querying claims and invoices, and levy-paying businesses. Contact runs through contact centres, an online claimant portal, provider channels and case managers, in English with Te Reo Maori and Pacific-language expectation.",
    strategicPressure: [
      { text: "ACC has faced sustained public and media scrutiny over claim-handling timeframes and decision communication, making claimant transparency a governance priority.", kind: "verified" },
      { text: "Weekly compensation payment queries are inherently urgent — a claimant not working depends on the payment, so a delay generates immediate, high-emotion contact.", kind: "inference" },
      { text: "Health providers generate a large, distinct volume of claim-lodgement and invoice-status contact that competes with claimants on the same service organisation.", kind: "inference" },
      { text: "Levy-payer contact peaks around invoicing cycles, adding a third seasonal demand pattern on top of claimant and provider volumes.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "ACC procures technology openly and has run large transformation programmes with external delivery partners; its internal capability is claims systems and integration rather than speech or conversational platforms. Buy-led, with the practical constraint that existing transformation-programme vendor commitments may already occupy the customer-channel roadmap.",
    whyNotBuild:
      "Claimant-facing automation on an entitlement scheme requires absolute correctness on payment and entitlement statements, clear boundaries so no automated channel makes or implies a claim decision, provider-side integration into invoicing, and evaluation evidence an auditor and a select committee would accept. ACC cannot build the underlying conversational stack, and the reputational stakes of a wrong automated statement to an injured claimant make a governed, evaluated bought platform the defensible choice.",
    workflows: [
      {
        name: "Claim status and entitlement servicing",
        friction: "Claimants call to ask where their claim sits, whether a treatment request was approved, and what their entitlement covers, and each contact requires a person to interpret the claim record and explain it again.",
        outcome: "Grounded claim-stage and entitlement answers with named outstanding requirements and proactive updates at each decision point, with all decisions themselves retained by ACC staff.",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Claims management system", "Entitlement records", "Document management", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Weekly compensation payment queries",
        friction: "A claimant whose payment has not arrived calls urgently, waits in a queue, and the agent must reconstruct whether a medical certificate lapsed, an employer declaration is missing, or the payment is simply in transit.",
        outcome: "Immediate grounded explanation of payment status and the specific blocker, with certificate and declaration reminders sent proactively before a payment lapses at all.",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Payment and compensation records", "Medical certificate register", "Employer declaration records", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Provider claim lodgement and invoice status",
        friction: "Physiotherapy, general practice and specialist providers contact ACC about lodgement errors, approval requirements and invoice payment status, occupying service capacity intended for claimants.",
        outcome: "A recognised-provider channel returning lodgement, approval and invoice-payment status with the specific error or requirement named, and disputes filed with tracked status.",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Provider claim lodgement", "Invoice and payment records", "Provider registration data", "Case management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Contact centres serving claimants, providers and levy payers",
        "Online claimant portal for claim and payment information",
        "Provider lodgement and invoicing channels for health professionals",
        "Case-manager relationships for complex and long-duration claims",
      ],
      gaps: [
        "Claimants cannot see what specific requirement is holding a treatment approval or payment",
        "No proactive reminder before a medical certificate lapse stops a weekly compensation payment",
        "Providers share service capacity with claimants for routine invoice-status questions",
        "Te Reo Maori and Pacific-language coverage on assisted channels is limited",
      ],
    },
    risks: [
      "The agent must never make, state or imply a claim or entitlement decision — it reports status and requirements, with all decisions and any clinical matters routed to ACC staff.",
      "Claimant health and injury information is sensitive personal information under New Zealand privacy law with strict handling and residency expectations.",
      "Existing transformation-programme vendor commitments may already claim the customer-channel roadmap, so scope must be positioned carefully.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 6.5,
      automationRate: 0.55,
      basis: "Seller assumptions from ACC's published claim volumes and New Zealand contact-centre labour economics; the operative baseline is contact-centre offered volume split between claimant, provider and levy-payer contacts.",
    },
    pilotScope:
      "Deploy claim-status and weekly-compensation payment servicing on voice and web chat with proactive medical-certificate lapse reminders, with every entitlement decision routed to ACC staff.",
    expansion: [
      "Add a recognised-provider channel for lodgement error and invoice-payment status",
      "Extend to levy-payer invoicing and account servicing across the annual cycle",
      "Add Te Reo Maori and Pacific-language coverage across claimant workflows",
    ],
    stakeholders: [
      "Chief Executive, ACC",
      "Deputy Chief Executive, Service Delivery",
      "Chief Information Officer / Head of Technology",
      "Head of Contact Centre and Customer Channels",
      "Head of Provider Relationships",
    ],
    discovery: [
      "What proportion of contact-centre volume is claim status, payment queries and provider invoice status respectively?",
      "How many weekly compensation payment failures are caused by a lapsed medical certificate that a proactive reminder would prevent?",
      "What existing transformation-programme commitments cover customer channels, and where is there room?",
      "What governance approval would be required before any automated statement about entitlement is made to a claimant?",
    ],
    flowTemplate: "claims",
    scenario: "An injured New Zealander whose weekly compensation has not arrived learns immediately that a medical certificate lapsed and what to do, instead of waiting in a queue.",
  },

  "services-australia": {
    operatingContext:
      "Services Australia delivers Centrelink income support, Medicare benefits and Child Support on behalf of the Commonwealth, making it the operational front line for a substantial share of the Australian population. Its contact volumes are among the largest of any Australian organisation, arriving through Centrelink and Medicare phone lines, myGov digital services, service centres, and mobile service teams reaching remote communities. Demand is both structurally high and event-driven: reporting periods, payment cycles, policy changes, and disaster-relief payment activations each produce their own surge shape. Call wait times have been a sustained subject of public and parliamentary criticism, and the agency has an explicit mandate to reduce congestion while operating under strict post-robodebt sensitivity about automated decision-making.",
    strategicPressure: [
      { text: "Centrelink call wait times and unanswered-call volumes have been repeatedly criticised in public reporting and parliamentary scrutiny, giving congestion reduction an explicit political mandate.", kind: "verified" },
      { text: "The robodebt experience has made the agency and the public acutely sensitive to automated decision-making, which sharply separates permissible servicing automation from impermissible determination automation.", kind: "verified" },
      { text: "Disaster-relief payment activations require the agency to stand up high-volume servicing in days for affected regions, a capacity shape that permanent staffing cannot economically hold.", kind: "verified" },
      { text: "A very large share of contact volume is status, eligibility explanation and document-submission support rather than decision-making, which is exactly the automatable band.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Services Australia procures contact-centre and digital capability at very large scale through federal panels and delivery partners; its internal capability is payment systems, myGov integration and service design. It does not build conversational platforms. Buy-led with partner-led delivery, and the scale means the engagement is a programme rather than a project.",
    whyNotBuild:
      "The agency needs multilingual speech at a volume few organisations in the world handle, elastic surge capacity for disaster activations, integration into payment and myGov systems, and — most importantly — a governance and evaluation regime that can demonstrate, conversation by conversation, that no automated decision was made. That last requirement is precisely what a governed platform with full logging and evaluation provides and what an internal build would struggle to evidence.",
    workflows: [
      {
        name: "Payment and claim status servicing",
        friction: "Customers call to ask when a payment will arrive, why an amount changed, or where a claim sits, and wait extended periods for a status answer that requires no judgement at all.",
        outcome: "Grounded, identity-verified payment and claim-status answers with the specific outstanding requirement named and proactive updates at each stage, removing the largest congestion driver from the phone lines.",
        channels: ["Voice", "SMS", "Web chat", "App chat"],
        systems: ["Payment systems", "Claim processing", "myGov identity", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Reporting, document submission and requirement chasing",
        friction: "Income reporting obligations and document requests are communicated by letter and digital message, and customers who miss or misunderstand them have payments suspended before anyone speaks to them.",
        outcome: "Proactive conversational reminders with guided reporting and document submission in the customer's language, preventing suspensions rather than servicing them after the fact.",
        channels: ["SMS", "Voice", "App chat", "Web chat"],
        systems: ["Reporting systems", "Document management", "Payment systems", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Disaster-relief payment activation servicing",
        friction: "When a disaster payment is activated, affected residents flood the phone lines with eligibility questions while local service centres may be closed and the region's connectivity is degraded.",
        outcome: "Rapidly configurable multilingual eligibility guidance and claim intake with elastic capacity from activation day, so relief reaches affected people at the speed the policy intended.",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Disaster payment rules", "Identity verification", "Claim intake", "Payment systems"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Centrelink, Medicare and Child Support phone lines with large contracted and in-house workforces",
        "myGov digital services with linked agency accounts and digital identity",
        "National service centre network plus mobile service teams for remote communities",
        "Digital messaging and letter-based customer notification",
      ],
      gaps: [
        "Phone capacity does not meet demand, producing sustained wait times and unanswered calls",
        "Customers are not proactively guided through reporting and document obligations before a suspension occurs",
        "No elastic capacity for disaster-payment activation surges",
        "Language coverage on assisted channels does not match the diversity of the customer base",
      ],
    },
    risks: [
      "Post-robodebt governance is the defining constraint: the agent may explain rules, report status and collect documents, but must never make, recommend or imply a determination about eligibility, debt or entitlement.",
      "Federal procurement panels and Commonwealth security and data-sovereignty requirements govern architecture and contracting.",
      "Accessibility and equity obligations require a fully assisted alternative for every automated path, including for remote and low-connectivity communities.",
    ],
    economics: {
      volumeMonthly: 5000000,
      costPerInteraction: 6.5,
      automationRate: 0.55,
      basis: "Seller assumptions from publicly reported Services Australia call volumes and Australian contact-centre labour economics; the agency's own offered-call, unanswered-call and average-wait data must replace these before any business case.",
    },
    pilotScope:
      "Automate payment and claim status servicing on voice and SMS with myGov identity verification for one Centrelink payment type, with hard governance boundaries preventing any determination or debt statement.",
    expansion: [
      "Add proactive reporting and document-submission guidance to prevent payment suspensions",
      "Extend to disaster-relief payment activation servicing with rapidly configurable eligibility rules",
      "Scale across Centrelink, Medicare and Child Support with expanded community-language coverage",
    ],
    stakeholders: [
      "Deputy Chief Executive Officer, Customer Service Delivery, Services Australia",
      "General Manager, Smart Centres and telephony operations",
      "Chief Information Officer / Chief Digital Officer",
      "General Manager, Customer Experience and Service Design",
      "Chief Operating Officer for procurement and panel arrangements",
    ],
    discovery: [
      "What are the current offered-call, answered-call and average-wait figures by payment line, and what is the agency's stated congestion-reduction target?",
      "What governance framework applies to automated customer interaction post-robodebt, and who must approve the boundary definition?",
      "What happened to call volume in the first week of the most recent disaster payment activation?",
      "Which federal panel would be used, and what Commonwealth data-sovereignty requirements apply to conversation processing and storage?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Centrelink customer asks in Vietnamese why their payment amount changed and which document is outstanding, and is answered in under a minute instead of waiting on hold.",
  },

  "chandigarh-university": {
    operatingContext:
      "Chandigarh University is a large private university near Mohali that recruits nationally rather than regionally, marketing aggressively across northern, eastern and southern India and running its own CUCET scholarship entrance test as the primary top-of-funnel instrument. Its economics are admissions-driven: seat fill across engineering, management, pharmacy, law and allied programmes determines the year's revenue, and a growing online-degree arm adds a second, year-round funnel. Inquiries arrive through digital lead forms, education portals, the CUCET registration flow, walk-ins and a large tele-counselling operation working phone and WhatsApp. Families making the decision typically speak Hindi or Punjabi at home even when the applicant corresponds in English, and the decision window is short and competitive.",
    strategicPressure: [
      { text: "The university competes directly against other large private institutions for the same national applicant pool, where the first institution to respond substantively holds a decisive conversion advantage.", kind: "inference" },
      { text: "CUCET scholarship-test cycles concentrate registration, admit-card, result and counselling queries into narrow windows that a fixed counsellor team cannot absorb.", kind: "verified" },
      { text: "A growing online-degree arm generates continuous enrolment and learner-support contact that does not follow the campus admissions calendar.", kind: "inference" },
      { text: "Tele-counselling cost per enrolled student is a real and rising expense line as digital lead costs increase across Indian higher education.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Chandigarh University is an education operator, not a technology company; its admissions technology consists of a purchased CRM, dialer and marketing automation stack operated by an admissions team. There is no product engineering group and no reason for one. This is a buy-led account where the practical question is which incumbent CRM the agent must attach to and whether counselling is run in-house or through agencies.",
    whyNotBuild:
      "Speed-to-lead at scale requires multilingual voice and WhatsApp engagement within minutes of an inquiry, grounded answers about programmes, fees, scholarships and hostel arrangements that never invent a number, calendar integration to book real counsellor slots, and continuous measurement of funnel stages. An admissions department cannot build or run that stack, and every cycle spent trying is a cohort lost to a faster competitor. Buying a configured engagement layer that plugs into the existing CRM is the only route that pays back inside one admissions cycle.",
    workflows: [
      {
        name: "Inquiry-to-application engagement",
        friction: "Leads arrive around the clock from portals and campaigns but are worked by counsellors during office hours from a list, so the first substantive contact comes a day or two later, by which time a competitor has already spoken to the family.",
        outcome: "Engagement within minutes on WhatsApp or voice in the family's language, grounded answers on programmes and fees, structured qualification, and a booked counsellor slot for genuinely interested applicants.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Admissions CRM", "Programme and fee catalogue", "Counsellor calendar", "Lead source integrations"],
        value: 3,
        complexity: 2,
      },
      {
        name: "CUCET registration, admit-card and result servicing",
        friction: "Around each test cycle, registration problems, admit-card downloads, slot changes and result queries flood the counselling team with operational questions that displace actual admissions conversations.",
        outcome: "Automated handling of the entire test-operations query set in Hindi, English and Punjabi, protecting counsellor capacity for conversion conversations during the highest-value weeks of the year.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Entrance test platform", "Admissions CRM", "Payment gateway", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Application completion and fee-deadline follow-up",
        friction: "Applications stall on a missing document or an unpaid fee instalment, nobody chases them systematically, and admitted students melt away to other institutions between offer and enrolment.",
        outcome: "Automated document chasing, deadline reminders and post-admit nurture in the family's language with payment links in-channel, reducing both incomplete applications and post-offer melt.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Admissions CRM", "Document management", "Fee/payment system", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Admissions website with programme pages, lead forms and online application",
        "CUCET entrance-test registration and result platform",
        "Tele-counselling team working phone and WhatsApp during admissions season",
        "Student portal and learning platform for enrolled and online-degree learners",
      ],
      gaps: [
        "No engagement in the first minutes after an inquiry arrives outside office hours",
        "Scholarship, hostel and fee questions get inconsistent answers depending on the counsellor",
        "Incomplete applications are not chased systematically to closure",
        "Regional-language conversation is limited to whichever counsellors happen to speak the language",
      ],
    },
    risks: [
      "Fee, scholarship and placement claims must be grounded in official approved sources — an automated channel making an unsupported claim about outcomes creates a regulatory and reputational exposure under UGC and advertising norms.",
      "Applicant and parent personal data collected during counselling is personal data under India's DPDP framework, with consent and retention obligations for marketing outreach.",
      "Any student expressing distress, exam anxiety or personal crisis must be routed immediately to a human counsellor — wellbeing conversations are never automated.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.4,
      automationRate: 0.6,
      basis: "Seller assumptions from the university's national admissions marketing footprint and Indian tele-counselling cost norms; the real baseline is the CRM's monthly inquiry count, current speed-to-first-contact and the loaded cost of the counselling team.",
    },
    pilotScope:
      "Deploy a Hindi, English and Punjabi inquiry-engagement agent on WhatsApp and voice that responds within minutes, qualifies on the university's rubric and books counsellor slots, measured on speed-to-first-contact and application conversion.",
    expansion: [
      "Add CUCET registration, admit-card and result servicing during test cycles",
      "Extend to application-completion chasing, fee-deadline reminders and post-offer melt reduction",
      "Add year-round enrolment and learner support for the online-degree arm with Telugu and Bengali coverage",
    ],
    stakeholders: [
      "Pro Vice-Chancellor / Director of Admissions",
      "Head of Admissions Operations and tele-counselling",
      "Chief Marketing Officer / Head of Digital Marketing",
      "Head of Information Technology",
      "Director of the online-education division",
    ],
    discovery: [
      "How many inquiries arrive monthly at peak, and what is the current median time to first substantive contact?",
      "Which admissions CRM and dialer are incumbent, and can an agent read and write leads and activities to them?",
      "Is tele-counselling run in-house or through outsourced agencies, and how is it paid for?",
      "Which fee, scholarship and placement statements are approved for external communication, and who owns that source of truth?",
    ],
    flowTemplate: "admissions",
    scenario: "A parent in Bihar messages Chandigarh University at 11pm about engineering fees and scholarships, gets grounded answers in Hindi, and has a counsellor call booked for the next morning.",
  },

  lpu: {
    operatingContext:
      "Lovely Professional University operates one of India's largest single campuses in Punjab, with tens of thousands of on-campus students drawn from across the country and abroad, alongside a substantial distance and online education division. Its admissions engine is the LPUNEST entrance and scholarship test, which the university markets nationally to generate an applicant pool spanning the Hindi belt, the north-east, the southern states and neighbouring countries. Admissions operations run through digital lead capture, education portals, a large tele-counselling floor, regional information centres, and an agent network for international recruitment. Because the campus is residential, families weigh hostel, safety, food and placement questions as heavily as academics, and those conversations happen in the family's language, not the applicant's English.",
    strategicPressure: [
      { text: "LPUNEST cycles concentrate registration, slot-booking, result and scholarship-band queries into short windows that determine the entire year's intake.", kind: "verified" },
      { text: "National recruitment means the applicant base speaks a dozen languages while counselling capacity in any given language is limited to whoever is on the floor.", kind: "verified" },
      { text: "As a residential university, post-offer melt is heavily influenced by unanswered hostel, safety and logistics questions from parents in the weeks between admission and arrival.", kind: "inference" },
      { text: "The distance and online division generates continuous learner-support volume — re-registration, assignment, exam-form and result queries — that is structurally separate from the campus admissions peak.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "LPU spends heavily on admissions operations but buys its technology: CRM, dialers, marketing automation and test platforms are all vendor products operated by an internal admissions and IT team. There is no software engineering organization building conversational systems. Buy-led, and the scale of the tele-counselling operation makes the economic case unusually concrete.",
    whyNotBuild:
      "The requirement spans multilingual voice and messaging engagement at national scale within minutes of an inquiry, grounded and citable answers on fees, scholarship bands and hostel arrangements, live counsellor calendar booking, and a distinct year-round learner-support workload for the online division. That is a product, not an admissions project. LPU's advantage is that it can deploy a bought capability across an already-large funnel and measure the conversion lift within a single cycle.",
    workflows: [
      {
        name: "LPUNEST funnel engagement and counsellor scheduling",
        friction: "Inquiries generated by national campaigns are worked from a list during office hours, so families in different time zones and languages wait days for a first call while competitors reach them first.",
        outcome: "Immediate multilingual engagement that answers programme, eligibility and scholarship questions from approved sources, qualifies against the university's rubric, and books real counsellor slots.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Admissions CRM", "LPUNEST test platform", "Programme and scholarship catalogue", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-admit hostel, fee and arrival support",
        friction: "Between offer and arrival, parents ask about hostel allocation, fee instalments, travel, documents and campus logistics, and these questions are answered inconsistently or not at all, which is when melt happens.",
        outcome: "Structured post-admit nurture in the family's language covering hostel, fee, document and arrival logistics with proactive reminders, directly reducing melt on an already-admitted cohort.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Admissions CRM", "Hostel allocation system", "Fee/payment system", "Document management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Distance and online learner servicing",
        friction: "The online and distance division fields continuous re-registration, assignment submission, exam-form and result queries by phone and email, with the same team also absorbing admissions-season load.",
        outcome: "Year-round automated learner servicing on the routine administrative query set, separating online-division support from campus admissions capacity entirely.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Student information system", "Learning management system", "Examination system", "Fee/payment system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Admissions website with online application and LPUNEST registration",
        "Large in-house tele-counselling operation on phone and WhatsApp",
        "Regional information centres and an international agent network",
        "Student portal and learning platform for campus and online learners",
      ],
      gaps: [
        "First substantive response to an inquiry depends on counsellor availability rather than applicant readiness",
        "Language coverage on counselling is limited to the languages of staff on shift",
        "Post-admit questions from parents are not systematically handled, which is where melt originates",
        "Online-division learner queries compete with campus admissions for the same support capacity",
      ],
    },
    risks: [
      "Scholarship-band, fee and placement statements must come from approved sources only — unsupported claims create UGC and consumer-protection exposure.",
      "Applicant and parent data collected across a national funnel is personal data under India's DPDP framework, with consent requirements for outbound marketing contact.",
      "Student distress, mental-health or safety disclosures must route immediately to trained human staff with the transcript; these conversations are never automated.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.3,
      automationRate: 0.6,
      basis: "Seller assumptions from LPU's published enrolment scale and Indian tele-counselling economics; the real baseline is CRM inquiry volume across a full LPUNEST cycle plus the loaded cost per counsellor seat.",
    },
    pilotScope:
      "Deploy a multilingual LPUNEST inquiry-engagement agent on WhatsApp and voice covering Hindi, English, Punjabi and Telugu with grounded scholarship and fee answers and live counsellor booking.",
    expansion: [
      "Add post-admit hostel, fee and arrival nurture aimed specifically at melt reduction",
      "Extend to distance and online division learner servicing across the academic year",
      "Add further regional languages and an international-applicant channel across time zones",
    ],
    stakeholders: [
      "Pro Chancellor / Director of Admissions",
      "Head of Admissions Operations and tele-counselling floor",
      "Head of Marketing and Digital Acquisition",
      "Chief Information Officer / Head of IT",
      "Director of the Online and Distance Education division",
    ],
    discovery: [
      "What is the monthly inquiry volume across an LPUNEST cycle, and what is median time to first substantive contact by language?",
      "How large is the tele-counselling operation in seats, and what is the fully loaded cost per seat?",
      "What is the current melt rate between admission and enrolment, and what questions dominate that window?",
      "Which CRM and test platform are incumbent, and what read and write access can an agent be granted?",
    ],
    flowTemplate: "admissions",
    scenario: "A Telugu-speaking family exploring LPU asks about hostel facilities and scholarship eligibility on WhatsApp at night and has a counsellor call scheduled before the competitor calls back.",
  },

  "srm-institute": {
    operatingContext:
      "SRM Institute of Science and Technology is a multi-campus deemed university headquartered at Kattankulathur near Chennai with additional campuses in Tamil Nadu, Andhra Pradesh, Delhi NCR and Haryana. Its admissions funnel is anchored by the SRMJEEE engineering entrance examination, supplemented by management, medical, law and health-sciences programmes, and it draws applicants heavily from Tamil Nadu, Andhra Pradesh, Telangana and the northern states. The critical operational reality is compression: entrance results, counselling rounds, seat allotment, fee payment deadlines and hostel allocation all occur within a few weeks, generating a query volume that a permanent counselling team cannot be sized for. Families ask in Tamil, Telugu and Hindi even when the application is completed in English.",
    strategicPressure: [
      { text: "SRMJEEE counselling and seat-allotment rounds compress the entire conversion window into a few weeks, during which query volume is many multiples of the annual average.", kind: "verified" },
      { text: "Multi-campus structure means applicants must be advised on campus-specific programmes, fees and hostel arrangements, which counsellors frequently get wrong or defer.", kind: "inference" },
      { text: "Competition for the same engineering applicant pool with other large private universities makes response speed a direct determinant of seat fill.", kind: "inference" },
      { text: "Seat-allotment and fee-deadline mechanics generate a distinct, high-anxiety query type where a wrong answer costs the family a seat and the university a student.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "SRM operates a purchased admissions technology stack — CRM, entrance-test platform, payment and counselling tooling — run by an admissions operations team. There is no internal engineering group building conversational systems, and the institution's investment focus is academic and campus infrastructure. Buy-led, with the sequencing question being whether admissions operations are centralised across campuses.",
    whyNotBuild:
      "The peak problem is the whole problem: for a few weeks each year SRM needs ten times its normal counselling capacity, in three languages, with correct campus-specific answers about seats, fees and hostels. Nobody builds a platform for a demand curve like that. A bought agent that scales to the peak and idles the rest of the year is exactly the right economic instrument, and the conversion lift is measurable within one cycle.",
    workflows: [
      {
        name: "Entrance-exam and counselling-round servicing",
        friction: "During SRMJEEE result and counselling weeks, applicants and parents flood phone lines with questions about slots, ranks, choice filling and rounds, and counsellors spend the highest-value weeks answering process mechanics.",
        outcome: "Automated multilingual handling of the entire counselling-process query set, grounded in the official round schedule and rules, freeing counsellors for genuine conversion conversations.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Entrance test and counselling platform", "Admissions CRM", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Seat allotment, fee-deadline and acceptance follow-up",
        friction: "Allotted candidates must accept and pay within tight deadlines; families who are unsure or miss a message lose the seat, and the university loses a converted applicant it had already won.",
        outcome: "Proactive multilingual deadline communication with grounded explanation of the acceptance mechanics and in-channel payment, converting allotments into paid acceptances rather than lapses.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Seat allotment system", "Fee/payment gateway", "Admissions CRM", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Campus-specific programme, fee and hostel guidance",
        friction: "Applicants comparing campuses get inconsistent answers about which programmes run where, what the fee differences are, and what hostel arrangements apply, and defer decisions as a result.",
        outcome: "Grounded, citable campus-by-campus answers on programmes, fees, hostels and eligibility, removing the deferral caused by uncertainty during the decision window.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Programme and fee catalogue", "Hostel allocation data", "Admissions CRM"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "SRMJEEE entrance test registration and counselling platform",
        "Admissions website with online application and campus programme pages",
        "Admissions counselling team on phone and WhatsApp during season",
        "Student portal and fee payment channels for enrolled students",
      ],
      gaps: [
        "No capacity to absorb the counselling-round query peak without deferring conversion conversations",
        "Campus-specific fee and hostel answers are inconsistent across counsellors",
        "Seat-allotment deadline follow-up is broadcast rather than conversational",
        "Regional-language depth depends on which counsellors are on shift",
      ],
    },
    risks: [
      "Fee, seat-matrix and placement claims must be grounded in approved published sources under UGC and consumer-protection norms.",
      "Applicant and parent data is personal data under India's DPDP framework, requiring consent for marketing contact and defined retention.",
      "Any applicant or parent expressing distress during a high-stakes admissions moment must be escalated to a human counsellor immediately; wellbeing conversations are never automated.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 1.3,
      automationRate: 0.6,
      basis: "Seller assumptions from SRM's published applicant scale and Indian tele-counselling economics; the real baseline is the CRM inquiry count across a full SRMJEEE cycle and the peak-week to average-week ratio.",
    },
    pilotScope:
      "Deploy a Tamil, Telugu, Hindi and English counselling-round and seat-allotment servicing agent on WhatsApp and voice for the SRMJEEE cycle, with grounded round mechanics and in-channel fee payment.",
    expansion: [
      "Add year-round inquiry engagement with qualification and counsellor booking",
      "Extend to campus-specific programme, fee and hostel guidance across all campuses",
      "Add enrolled-student servicing for fee instalments, examination and hostel queries",
    ],
    stakeholders: [
      "Director of Admissions, SRMIST",
      "Registrar / Head of Academic Administration",
      "Head of Admissions Operations and counselling",
      "Chief Information Officer / Head of IT",
      "Head of Marketing and Outreach",
    ],
    discovery: [
      "What is the peak-week to average-week inquiry ratio across an SRMJEEE counselling cycle?",
      "Are admissions operations centralised across campuses, or does each campus run its own counselling team?",
      "What proportion of allotted seats lapse at the acceptance-and-payment deadline, and why?",
      "Can the counselling and seat-allotment platform expose candidate status to an external agent in real time?",
    ],
    flowTemplate: "admissions",
    scenario: "During SRMJEEE counselling a Telugu-speaking family asks what their allotment means and completes the acceptance fee payment inside the same WhatsApp conversation.",
  },

  vit: {
    operatingContext:
      "VIT runs campuses at Vellore, Chennai, Amaravati and Bhopal and conducts VITEEE, which draws one of the largest applicant pools of any private engineering entrance examination in India. That scale creates an admissions operation defined by extremes: registration in the hundreds of thousands, a test-slot booking process, a ranked counselling process with multiple rounds, and campus and branch choice decisions that families make under intense time pressure. Applicants come predominantly from Tamil Nadu, Andhra Pradesh, Telangana, Kerala and the northern states, and the deciding conversation happens with parents in a regional language. Outside the admissions window the institution also services enrolled students on fees, hostels and examinations across four campuses.",
    strategicPressure: [
      { text: "VITEEE's very large applicant pool means even routine process queries — slot booking, admit cards, rank interpretation — arrive in volumes no counselling team can be staffed for.", kind: "verified" },
      { text: "Multi-round counselling with campus and branch choices creates a decision process families find genuinely confusing, and confusion at that moment converts directly into lost seats.", kind: "inference" },
      { text: "Because admissions scale is the institution's core monetisation, small percentage improvements in counselling-round conversion translate into material revenue.", kind: "inference" },
      { text: "The institution runs conventional call-centre-style counselling rather than any conversational automation, leaving an obvious and measurable capacity gap.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "VIT buys its admissions and examination technology and operates it with an in-house admissions team; it has no software product organization and no history of building customer-facing AI. Buy-led, with an unusually clean measurement story because VITEEE volumes are large enough that pilot results are statistically meaningful within one cycle.",
    whyNotBuild:
      "Handling a VITEEE-scale funnel conversationally requires four-language voice and messaging, grounding into test, rank and counselling systems, and elastic capacity concentrated into a few weeks. Building that would take longer than the admissions cycle it was meant to serve. The right move is to buy elastic capacity configured to VIT's own counselling rules and measure it against last year's conversion.",
    workflows: [
      {
        name: "VITEEE registration, slot and admit-card servicing",
        friction: "Hundreds of thousands of registrants generate process queries about payment confirmation, slot booking, admit-card download and exam-centre logistics, all of which land on human counsellors.",
        outcome: "Fully automated multilingual handling of the test-operations query set, absorbing the largest single block of admissions-season contact without adding staff.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["VITEEE test platform", "Payment gateway", "Admissions CRM", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Counselling-round guidance and choice filling",
        friction: "Families must interpret ranks, compare campuses and branches, and fill choices under deadline with only generic published instructions and an overwhelmed phone line to help them.",
        outcome: "Grounded, personalised explanation of the counselling process and campus and branch options in the family's language, with counsellor escalation for genuine advisory decisions.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Counselling and rank platform", "Programme and campus catalogue", "Admissions CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Fee payment, hostel allocation and joining logistics",
        friction: "After allotment, families face fee instalment deadlines, hostel selection and joining documentation, and questions in this window go unanswered exactly when melt risk is highest.",
        outcome: "Proactive multilingual guidance and reminders across fee, hostel and joining steps with in-channel payment, converting allotments into arrivals.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Fee/payment system", "Hostel allocation", "Document management", "Student information system"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "VITEEE registration, slot booking and result platform",
        "Admissions website with campus and programme information and online application",
        "Admissions counselling team operating phone and email during season",
        "Student portal covering fees, hostel and examination services for enrolled students",
      ],
      gaps: [
        "Test-operations queries consume counsellor capacity during the highest-value weeks",
        "Counselling-round mechanics are explained generically rather than against the family's own rank and choices",
        "Post-allotment fee, hostel and joining questions have no proactive conversational channel",
        "Regional-language coverage is limited to available counsellor staffing",
      ],
    },
    risks: [
      "Rank, seat-matrix, fee and placement statements must be grounded in official published data; no automated channel may speculate about admission chances.",
      "Applicant and parent data across a very large funnel is personal data under India's DPDP framework with consent and retention obligations.",
      "Admissions is a high-stress period for candidates — any expression of distress must trigger immediate routing to a human counsellor rather than continued automation.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.2,
      automationRate: 0.65,
      basis: "Seller assumptions from VITEEE's published applicant scale and Indian tele-counselling economics; the operative baseline is registrant count, contact volume per registrant and counselling-team cost across one cycle.",
    },
    pilotScope:
      "Deploy a four-language VITEEE registration, slot and admit-card servicing agent on WhatsApp and voice for one admissions cycle, measured on counsellor-hours released and query resolution rate.",
    expansion: [
      "Add counselling-round guidance and campus and branch choice explanation grounded in the candidate's rank",
      "Extend to post-allotment fee, hostel and joining logistics with in-channel payment",
      "Add enrolled-student servicing across the four campuses for fees, hostel and examinations",
    ],
    stakeholders: [
      "Director of Admissions, VIT",
      "Registrar / Dean of Academics",
      "Head of Admissions Operations",
      "Chief Information Officer / Head of IT Services",
      "Head of Student Services for post-enrolment expansion",
    ],
    discovery: [
      "What is the total VITEEE registrant count and the average number of contacts generated per registrant?",
      "What proportion of season contact volume is pure test operations versus advisory counselling?",
      "Can the counselling platform expose a candidate's rank and round status to an agent in real time?",
      "What is the current drop-off between allotment and joining, and what drives it?",
    ],
    flowTemplate: "admissions",
    scenario: "A VITEEE candidate's parent asks in Tamil what their rank means for a Vellore branch choice and gets a grounded explanation of the round mechanics without waiting on the counselling line.",
  },

  "mahe-manipal": {
    operatingContext:
      "Manipal Academy of Higher Education is a deemed university operating campuses at Manipal, Mangalore and Bengaluru plus international campuses, with a portfolio spanning medicine, dentistry, allied health, engineering, management and communication. Its admissions funnel runs through the MET entrance examination for professional programmes and a distinct, higher-value pathway for NRI and international applicants who pay premium fee structures and apply from the Gulf, Africa, Southeast Asia and beyond. That international dimension is what differentiates it from purely domestic private universities: inquiries arrive across time zones, involve visa, accommodation and remittance questions, and are often mediated by education agents. Domestic servicing runs in English, Hindi and Kannada; international servicing needs coverage outside Indian business hours.",
    strategicPressure: [
      { text: "NRI and international admissions carry materially higher fee realisation per student, which makes responsiveness to overseas inquiries disproportionately valuable relative to volume.", kind: "inference" },
      { text: "Overseas applicants and their families contact the university outside Indian business hours, so a business-hours counselling operation structurally under-serves the highest-value segment.", kind: "verified" },
      { text: "Health-sciences admissions carry regulatory complexity around eligibility, quotas and counselling authorities that generates persistent, high-stakes queries where a wrong answer is costly.", kind: "inference" },
      { text: "Group-level versus campus-level ownership of admissions technology is genuinely unclear from outside, which makes identifying the buying centre a prerequisite rather than a detail.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "MAHE runs sophisticated admissions marketing on purchased technology — CRM, test platform, payment and agent-management tooling — with an internal admissions and IT function operating rather than building it. There is no conversational-AI engineering capability. Buy-led, with the caveat that the group's scale means a decision may need to be made at group level rather than by a single campus.",
    whyNotBuild:
      "Serving international applicants around the clock requires coverage no Indian counselling team provides, plus grounded answers on visa documentation, accommodation, fee remittance and programme eligibility that must be accurate across regulatory regimes. Building that capability internally is not a rational use of a university's resources when a configured agent can provide time-zone-independent coverage from day one.",
    workflows: [
      {
        name: "MET and domestic admissions engagement",
        friction: "MET registration, slot, result and counselling queries plus general programme inquiries are worked by counsellors during Indian business hours, delaying first contact for applicants across the country.",
        outcome: "Immediate multilingual engagement with grounded programme, eligibility and fee answers, structured qualification and counsellor booking, freeing counsellors for advisory conversations.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["MET test platform", "Admissions CRM", "Programme and fee catalogue", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "International and NRI applicant servicing",
        friction: "Families in the Gulf, Africa and Southeast Asia inquire outside Indian hours about eligibility, fee remittance, visa documentation and accommodation, and receive replies a day later or through an agent with variable accuracy.",
        outcome: "Round-the-clock grounded servicing for international applicants covering eligibility, documentation, fee remittance and accommodation, with escalation to the international admissions team for advisory decisions.",
        channels: ["WhatsApp", "Voice", "Email", "Web chat"],
        systems: ["International admissions records", "Programme and fee catalogue", "Document management", "Agent portal"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Post-offer document, fee and arrival support",
        friction: "Admitted students — domestic and international — face document verification, fee instalments, accommodation allocation and arrival logistics with fragmented support across offices, and melt occurs in that gap.",
        outcome: "Structured post-offer nurture covering documents, fees, accommodation and arrival in the family's language and time zone, with proactive reminders that convert offers into enrolments.",
        channels: ["WhatsApp", "Email", "Voice", "SMS"],
        systems: ["Admissions CRM", "Document management", "Fee/payment system", "Accommodation allocation"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "MET entrance test registration and result platform",
        "Admissions website with programme, fee and eligibility information across campuses",
        "Domestic and international admissions counselling teams",
        "Education agent network for international recruitment",
      ],
      gaps: [
        "No servicing coverage for international applicants outside Indian business hours",
        "Visa, remittance and accommodation questions are answered inconsistently, often via agents",
        "Post-offer document and fee steps lack proactive follow-up across time zones",
        "Health-sciences eligibility and quota questions have no grounded, citable self-service answer",
      ],
    },
    risks: [
      "Health-sciences admissions are governed by regulatory bodies and counselling authorities — automated statements about eligibility or quota must be grounded and clearly bounded, with escalation to admissions officers.",
      "International applicant data crosses borders, engaging India's DPDP framework alongside the data-protection expectations of the applicant's home jurisdiction.",
      "Applicants under admissions stress, and international students facing relocation anxiety, must be routed to human counsellors on any distress cue.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 1.6,
      automationRate: 0.6,
      basis: "Seller assumptions from MAHE's published programme scale and Indian counselling economics adjusted for international servicing; the operative baseline is CRM inquiry volume split domestic versus international and current response-time distribution.",
    },
    pilotScope:
      "Deploy a round-the-clock international and NRI applicant servicing agent on WhatsApp and email covering eligibility, fee remittance, documentation and accommodation, with escalation to the international admissions team.",
    expansion: [
      "Add MET and domestic admissions engagement with counsellor booking in English, Hindi and Kannada",
      "Extend to post-offer document, fee and arrival nurture for both domestic and international cohorts",
      "Add enrolled-student servicing across campuses for fees, accommodation and examination queries",
    ],
    stakeholders: [
      "Registrar, MAHE",
      "Director of Admissions (group level)",
      "Head of International Admissions",
      "Chief Information Officer / Head of IT",
      "Director of Marketing and Student Recruitment",
    ],
    discovery: [
      "Is admissions technology decided at group level or by individual campuses and constituent institutions?",
      "What share of inquiries come from outside India, and what is the current response time on those?",
      "How much international recruitment is agent-mediated, and would an agent-facing channel be welcome or resisted?",
      "Which eligibility and quota statements can be made by an automated channel under health-sciences regulatory constraints?",
    ],
    flowTemplate: "admissions",
    scenario: "A family in Dubai asks Manipal at 9pm Gulf time about MBBS eligibility and fee remittance and gets grounded answers with an international admissions call booked for the next day.",
  },

  symbiosis: {
    operatingContext:
      "Symbiosis International University is a Pune-headquartered multi-institute university whose constituent colleges span management, law, engineering, media, health sciences, liberal arts and design, each with its own programme structure, fee schedule, eligibility criteria and admissions calendar. Applicants enter through the SNAP test for management programmes and SET and other institute-specific tests elsewhere, then must navigate to the specific institute and programme that fits — a navigation problem the university's own structure creates. Inquiries arrive from across India and from international applicants, and are handled by institute-level admissions offices rather than a single centralised team. That decentralisation is both the operational pain and the commercial complication.",
    strategicPressure: [
      { text: "A decentralised multi-institute structure means applicants routinely contact the wrong office and receive partial or incorrect guidance about programmes at sister institutes.", kind: "inference" },
      { text: "SNAP and SET cycles concentrate registration, admit-card and result queries into fixed windows across many institutes simultaneously.", kind: "verified" },
      { text: "Because fee structures and eligibility differ substantially between constituent institutes, inconsistent answers directly cause applicant confusion and drop-off.", kind: "inference" },
      { text: "Identifying a single buying centre across a federated university is the main commercial risk, and may require a group-level sponsor rather than an institute-level one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Symbiosis operates purchased admissions and test platforms with institute-level admissions teams; there is no central software engineering function building conversational systems. Buy-led on technology, but the deal shape must resolve the federated buying structure — a group-level sponsor with institute-level rollout is the realistic path.",
    whyNotBuild:
      "A grounded assistant that can answer accurately across dozens of institutes requires a curated, versioned knowledge base spanning every programme, fee schedule and eligibility rule, plus citation so applicants and institutes can trust the answers. Building and maintaining that is a content and platform discipline no university admissions office has. Buying it — and making the knowledge base the university's own governed asset — is what makes cross-institute accuracy achievable at all.",
    workflows: [
      {
        name: "Cross-institute inquiry routing and programme guidance",
        friction: "An applicant interested in law or design contacts a general or wrong number, gets partial information, and either drops off or applies to the wrong programme entirely.",
        outcome: "Grounded, citable guidance across every constituent institute's programmes, eligibility and fees, with routing to the correct institute's admissions team when a human conversation is warranted.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Programme and fee knowledge base", "Institute admissions CRM", "Test platform", "Counsellor calendars"],
        value: 3,
        complexity: 2,
      },
      {
        name: "SNAP and SET test-cycle servicing",
        friction: "Registration, payment confirmation, admit-card, centre and result queries arrive simultaneously across institutes and are answered by staff whose primary job is admissions counselling.",
        outcome: "Automated handling of the entire test-operations query set across both examinations, protecting institute admissions capacity during the peak conversion window.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["SNAP and SET test platforms", "Payment gateway", "Admissions CRM", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Application completion and admission-offer follow-up",
        friction: "Applications stall on documents or unpaid fees, and offers made by individual institutes are followed up unevenly depending on that institute's staffing.",
        outcome: "Consistent, university-wide document chasing, deadline reminders and offer follow-up with in-channel payment, standardising conversion discipline across all institutes.",
        channels: ["WhatsApp", "Email", "SMS", "Voice"],
        systems: ["Admissions CRM", "Document management", "Fee/payment system", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "SNAP and SET test registration and result platforms",
        "Institute-level admissions websites and application portals",
        "Institute admissions offices handling inquiries by phone and email",
        "Student portals for enrolled learners across constituent institutes",
      ],
      gaps: [
        "No single channel that can answer accurately across all constituent institutes",
        "Applicants cannot compare programmes and fees across institutes in one conversation",
        "Test-cycle operational queries displace counselling capacity at every institute simultaneously",
        "Offer follow-up discipline varies by institute rather than being university-wide",
      ],
    },
    risks: [
      "Fee, eligibility and placement statements must be grounded per institute in approved published sources — cross-institute inaccuracy is the specific failure mode to design against.",
      "Applicant data is personal data under India's DPDP framework with consent obligations for outbound contact, and institute-level data ownership must be clarified.",
      "Distress or wellbeing disclosures during a high-stakes admissions process must route to human counsellors at the relevant institute immediately.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.5,
      automationRate: 0.6,
      basis: "Seller assumptions from the university's multi-institute scale and Indian admissions-counselling economics; the operative baseline is aggregate inquiry volume across institutes, which no single office currently holds.",
    },
    pilotScope:
      "Deploy a grounded cross-institute admissions guidance agent on WhatsApp and web chat covering programmes, eligibility and fees for the management and law institutes, with routing to the correct admissions team.",
    expansion: [
      "Extend the knowledge base and routing across all constituent institutes",
      "Add SNAP and SET test-cycle operational servicing during examination windows",
      "Add university-wide application-completion chasing and offer follow-up with in-channel payment",
    ],
    stakeholders: [
      "Vice Chancellor or Pro Vice Chancellor, Symbiosis International University",
      "Director of Admissions (university level)",
      "Director of a flagship constituent institute as pilot sponsor",
      "Head of Information Technology",
      "Head of Marketing and Communications",
    ],
    discovery: [
      "Is there a university-level admissions authority that can sponsor a cross-institute deployment, or must institutes buy individually?",
      "What is the aggregate inquiry volume across institutes, and how much of it is misrouted?",
      "Who owns the authoritative programme, eligibility and fee content for each institute, and how often does it change?",
      "Which CRM systems are in use across institutes, and are they common or institute-specific?",
    ],
    flowTemplate: "admissions",
    scenario: "An applicant unsure whether Symbiosis law or media suits them gets grounded programme, eligibility and fee comparisons across both institutes in one conversation.",
  },

  nmims: {
    operatingContext:
      "NMIMS is a Mumbai-headquartered deemed university with a well-regarded management school fed by the NMAT examination, campuses in several Indian cities, and a very large distance and online division serving working professionals across the country. The two businesses have fundamentally different rhythms: the campus programmes follow a seasonal admissions calendar, while the online and distance arm enrols continuously and generates year-round learner-support volume around registration, learning-platform access, assignment submission, examination scheduling and result queries. Working-professional learners contact outside office hours because that is when they study, and their support experience directly determines re-registration into subsequent semesters. Servicing is English and Hindi with regional-language expectation across the distance cohort.",
    strategicPressure: [
      { text: "The online and distance division enrols continuously, so its support load is year-round and does not follow the campus admissions calendar that the institution's support staffing is built around.", kind: "inference" },
      { text: "Working professionals study and seek support outside business hours, so a business-hours support model structurally fails the largest learner population.", kind: "verified" },
      { text: "Semester re-registration is the revenue-critical moment for an online programme, and unresolved administrative friction before it directly drives non-continuation.", kind: "inference" },
      { text: "Examination scheduling and result queries produce concentrated, entirely predictable spikes several times a year across the online cohort.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "NMIMS operates purchased platforms — student information system, learning management system, examination and CRM tooling — with an internal IT and student-services function. There is no conversational-AI engineering capability. Buy-led, with the specific commercial question being whether the online division buys independently of the university.",
    whyNotBuild:
      "Year-round out-of-hours learner support requires conversational capacity across voice and messaging, grounding into the student information, learning and examination systems, and enough reliability that a learner trusts it with a re-registration deadline. A university student-services team cannot build that. Buying it turns support quality into a retention lever that can be measured semester over semester.",
    workflows: [
      {
        name: "Online-programme learner administrative support",
        friction: "Learners hit platform access failures, cannot find assignment submission windows, or need enrolment records, and must email or call during office hours while studying at night.",
        outcome: "Round-the-clock grounded answers on platform access, submission windows, enrolment records and programme structure, with identity-verified account recovery handled in-conversation.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Student information system", "Learning management system", "Identity and access management", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Examination scheduling and result servicing",
        friction: "Examination slot booking, centre allocation, hall-ticket downloads and result queries produce predictable spikes that overwhelm student services several times a year.",
        outcome: "Automated examination-cycle servicing across the full query set with proactive reminders on booking windows, absorbing spikes that currently require temporary staffing.",
        channels: ["WhatsApp", "Voice", "Web chat", "SMS"],
        systems: ["Examination system", "Student information system", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Re-registration and continuation nurture",
        friction: "Learners who miss a re-registration window or have an unresolved administrative issue simply stop, and nobody reaches them until the semester has already been lost.",
        outcome: "Proactive re-registration reminders with fee payment in-channel and resolution of blocking administrative issues before the deadline, directly improving semester-over-semester continuation.",
        channels: ["WhatsApp", "Voice", "SMS", "Email"],
        systems: ["Student information system", "Fee/payment system", "Case management", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Student portal and learning management platform for online and distance learners",
        "Campus admissions website with NMAT-linked application flows",
        "Student services helpdesk operating largely in business hours",
        "Examination platform for slot booking, hall tickets and results",
      ],
      gaps: [
        "No support coverage during the evening and weekend hours when working professionals study",
        "Platform access failures require a helpdesk ticket rather than guided self-recovery",
        "Examination-cycle spikes are handled with temporary capacity rather than elastic automation",
        "Re-registration lapses are discovered after the window closes rather than prevented",
      ],
    },
    risks: [
      "Student academic and financial records are personal data under India's DPDP framework, requiring identity verification before any record disclosure.",
      "Academic decisions — grades, evaluation appeals, disciplinary matters — must never be handled or pre-judged by an automated channel.",
      "Learners disclosing distress, particularly around examination outcomes, must be routed to human student-welfare staff immediately.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 1.4,
      automationRate: 0.65,
      basis: "Seller assumptions from the online division's published learner scale and Indian support-desk economics; the operative baseline is helpdesk ticket and call volume by category across an examination and re-registration cycle.",
    },
    pilotScope:
      "Deploy round-the-clock online-learner administrative support on WhatsApp and voice covering platform access, enrolment records and submission windows, with identity-verified account recovery.",
    expansion: [
      "Add examination scheduling, hall-ticket and result servicing with proactive booking reminders",
      "Extend to re-registration nurture with in-channel fee payment and blocker resolution",
      "Add campus admissions inquiry engagement across the NMAT cycle",
    ],
    stakeholders: [
      "Director of the online and distance education division",
      "Registrar, NMIMS",
      "Head of Student Services and Learner Support",
      "Chief Information Officer / Head of IT",
      "Head of Examinations",
    ],
    discovery: [
      "Does the online division buy technology independently of the university, and who signs?",
      "What is the helpdesk volume by category, and what proportion arrives outside business hours?",
      "What is the current semester-over-semester continuation rate, and how much of the loss is administrative rather than academic?",
      "Can the student information and learning platforms be queried by an authenticated agent for enrolment and submission status?",
    ],
    flowTemplate: "onboarding",
    scenario: "A working-professional NMIMS online learner locked out of the platform at 11pm recovers access and confirms an assignment deadline without waiting for the helpdesk to open.",
  },

  ignou: {
    operatingContext:
      "IGNOU is India's national open university and among the largest universities in the world by enrolment, serving millions of distance learners through a network of regional centres and thousands of study centres attached to partner institutions. Its learner population is deliberately broad — working adults, rural students, defence personnel, prisoners, and learners in remote areas — and includes many who chose distance education precisely because conventional access was unavailable. The administrative cycle is relentless: admissions and re-registration windows, assignment submission, examination form submission, hall tickets, results, and grade cards each generate national-scale query volume against regional-centre staff and email support. Servicing is Hindi and English at minimum, with regional-language expectation across every state.",
    strategicPressure: [
      { text: "Enrolment in the millions against a regional-centre support model produces query volumes that email and phone support cannot absorb, particularly at examination-form and result windows.", kind: "verified" },
      { text: "Examination form submission windows are hard deadlines where a missed submission costs a learner an entire cycle, making deadline-window support disproportionately consequential.", kind: "verified" },
      { text: "The learner population includes people with limited digital literacy and connectivity for whom voice in their own language is the only functional channel.", kind: "verified" },
      { text: "As a central university, IGNOU procures through government routes on annual budget cycles, so the engagement must be timed to a budget window rather than a sales quarter.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "IGNOU is an academic institution with a systems and operations IT function; its student platforms are vendor-delivered and its support is staffed at regional centres. There is no engineering capability for speech or conversational systems and no realistic hiring path within a central university. Buy-led, with government procurement being the operative constraint.",
    whyNotBuild:
      "Serving millions of distance learners conversationally requires multi-language speech including for low-literacy rural callers, grounding into admission, assignment, examination and result systems, and elastic capacity concentrated into deadline windows. IGNOU cannot build that, and the equity stakes are real: the learners who most need support are the ones least able to navigate an unstaffed email queue. A bought platform with broad language coverage is the only way to reach them.",
    workflows: [
      {
        name: "Admission and re-registration servicing",
        friction: "Each admission and re-registration cycle produces national query volume about eligibility, programme selection, fee payment and confirmation, handled unevenly across regional centres and email.",
        outcome: "Multilingual grounded guidance on eligibility, programme choice, fees and the registration process with in-channel payment and confirmation, applied consistently across every region.",
        channels: ["Voice", "WhatsApp", "Web chat", "SMS"],
        systems: ["Admission and registration system", "Programme and fee catalogue", "Payment gateway", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Assignment and examination-form deadline support",
        friction: "Assignment submission and examination form windows are hard deadlines; learners who cannot get an answer about eligibility, backlog papers or submission mechanics simply miss the window and lose a cycle.",
        outcome: "Deadline-window support at unlimited concurrency with proactive reminders and grounded answers on submission mechanics, preventing avoidable cycle losses for large numbers of learners.",
        channels: ["Voice", "WhatsApp", "SMS", "Web chat"],
        systems: ["Assignment records", "Examination form system", "Student information system", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Result, grade card and study-material queries",
        friction: "Result declarations produce immediate national query surges, and study-material dispatch queries generate steady volume, all handled through regional centres with long response times.",
        outcome: "Automated result, grade-card and material-dispatch status answers in the learner's language, absorbing declaration-day surges and freeing regional centre staff for academic support.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Examination results system", "Grade card records", "Study material dispatch tracking", "Student information system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online admission, re-registration and examination form portals",
        "Regional centre and study centre network providing learner support",
        "Result and grade card publication through the university website",
        "Email and phone support at regional centres with published contact details",
      ],
      gaps: [
        "No scalable support during examination-form and result windows when demand peaks nationally",
        "Regional-language voice support depends entirely on the staffing of the local regional centre",
        "Learners cannot verify assignment or examination eligibility without contacting a centre",
        "Study-material dispatch status is not conversationally accessible",
      ],
    },
    risks: [
      "Central-university procurement runs through government routes such as GeM on annual budget cycles, which sets the timeline regardless of urgency.",
      "Learner academic and personal data is personal data under India's DPDP framework, requiring identity verification before any record disclosure.",
      "Academic evaluation, re-evaluation and disciplinary matters must never be automated, and learners in distress must be routed to human student-support staff.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.7,
      automationRate: 0.65,
      basis: "Seller assumptions from IGNOU's published enrolment scale and Indian support-desk economics; the operative baseline is aggregate regional-centre contact volume across an examination cycle, which is not centrally reported today.",
    },
    pilotScope:
      "Deploy Hindi and English admission and re-registration servicing on voice and WhatsApp for three regional centres with in-channel fee payment and grounded eligibility guidance.",
    expansion: [
      "Add assignment and examination-form deadline support with proactive reminders nationally",
      "Extend to result, grade-card and study-material dispatch status servicing",
      "Add regional-language voice coverage across all major regional centre languages",
    ],
    stakeholders: [
      "Vice Chancellor / Pro Vice Chancellor, IGNOU",
      "Registrar (Student Registration Division)",
      "Registrar (Student Evaluation Division)",
      "Director, Computer Division",
      "Director of a pilot Regional Centre",
    ],
    discovery: [
      "What is the aggregate contact volume across regional centres during an examination-form window, and how is it currently measured?",
      "Which student systems — registration, assignment, examination, results — can be queried through interfaces today?",
      "What is the government procurement route and budget cycle for a central university technology purchase?",
      "Which regional languages would be considered essential for a national rollout to meet equity expectations?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An IGNOU learner in rural Bihar confirms in Hindi by phone that they are eligible to submit an examination form and completes the fee payment before the window closes.",
  },

  "narayana-group": {
    operatingContext:
      "Narayana Educational Institutions is one of India's largest private education groups, running hundreds of schools, junior colleges and competitive-examination coaching centres concentrated in Andhra Pradesh, Telangana, Karnataka and expanding across northern India. Its business is built on a high-volume, high-touch parent relationship: admissions are sold through counselling and referral, fees are collected in instalments, and academic performance is communicated continuously to parents who chose the group specifically for competitive-examination outcomes. Communication is overwhelmingly phone-first and Telugu, Hindi and English speaking, coordinated by campus-level staff rather than a central contact centre. In aggregate the group generates enormous parent-communication volume that no single office currently sees or measures.",
    strategicPressure: [
      { text: "Admissions season across hundreds of campuses generates parent inquiry and follow-up volume handled campus by campus, with no consistency in speed or quality of response.", kind: "inference" },
      { text: "Fee collection in instalments across a very large student base creates a continuous reminder and follow-up workload that campus staff perform manually alongside academic duties.", kind: "inference" },
      { text: "Parents choose the group for competitive-examination outcomes and expect frequent performance communication, making proactive parent engagement a retention mechanism rather than an administrative task.", kind: "inference" },
      { text: "Intense rivalry with peer coaching networks for the same parent base makes response speed on an admissions inquiry a direct determinant of enrolment.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Narayana is an education operator with campus-level administrative staffing and purchased school-management software; there is no platform engineering organization and no conversational-AI capability. Buy-led, with the central commercial question being how much parent communication is centralised versus devolved to state clusters and individual campuses.",
    whyNotBuild:
      "Standardising parent communication across hundreds of campuses requires multilingual voice and messaging at scale, grounding into student, fee and performance records, and governance so that what is said to a parent is consistent and auditable regardless of campus. That is precisely what a group cannot achieve through campus staff and what it has no capability to build. A bought platform makes group-wide consistency achievable for the first time.",
    workflows: [
      {
        name: "Admissions inquiry follow-up and campus matching",
        friction: "Parent inquiries arrive at campuses, referral contacts and campaign landing pages, and follow-up depends on whichever staff member picks them up, so response speed and quality vary enormously.",
        outcome: "Immediate multilingual engagement that captures requirements, answers programme and fee questions from approved sources, matches the family to the right campus and books a counselling visit.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Admissions CRM", "Campus and programme directory", "Fee catalogue", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Fee instalment reminders and collection",
        friction: "Campus staff chase fee instalments by phone alongside their academic responsibilities, follow-up is inconsistent, and arrears build quietly across the group with no central visibility.",
        outcome: "Policy-bounded multilingual reminder and payment conversations with in-channel payment links, commitments recorded and followed up automatically, and group-level arrears visibility for the first time.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Fee management system", "Student records", "Payment gateway", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Parent performance and attendance communication",
        friction: "Performance and attendance updates are communicated ad hoc by campus staff, so parents who want engagement get inconsistent contact and only hear from the campus when something is wrong.",
        outcome: "Consistent proactive performance and attendance communication in the parent's language with the ability to ask follow-up questions, and teacher-meeting booking when a real conversation is needed.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["School management system", "Attendance records", "Assessment records", "Teacher calendars"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Campus-level admissions counselling and parent communication by phone",
        "School management and fee collection software across campuses",
        "Group website and campaign landing pages capturing admissions inquiries",
        "Parent-facing SMS notifications for fees and campus announcements",
      ],
      gaps: [
        "No group-level view of inquiry volume, response speed or conversion across campuses",
        "Fee reminder discipline varies by campus and depends on staff availability",
        "Parent performance communication is reactive rather than scheduled and consistent",
        "No out-of-hours channel for working parents who cannot call during campus hours",
      ],
    },
    risks: [
      "Student data including minors' academic and attendance records requires strict handling under India's DPDP framework with parental consent considerations.",
      "Fee collection outreach must remain respectful and policy-bounded — aggressive automated chasing of school fees is both reputationally and ethically unacceptable.",
      "Any parent or student disclosure of distress, safety concern or wellbeing issue must route immediately to trained human staff and never be handled by automation.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions from the group's published campus and student scale and Indian outbound-calling economics; the operative baseline is aggregate campus call volume, which the group does not currently measure centrally.",
    },
    pilotScope:
      "Deploy Telugu, Hindi and English admissions inquiry follow-up and counselling-visit booking across one state cluster, measured on response time and inquiry-to-visit conversion against a control cluster.",
    expansion: [
      "Add policy-bounded fee instalment reminders with in-channel payment across the cluster",
      "Extend to proactive parent performance and attendance communication with meeting booking",
      "Scale group-wide with central visibility of inquiry, conversion and arrears metrics",
    ],
    stakeholders: [
      "Group Chief Executive Officer or Managing Director",
      "Head of Admissions for the state cluster",
      "Chief Financial Officer for fee collection outcomes",
      "Head of Information Technology",
      "Regional academic director for the pilot cluster",
    ],
    discovery: [
      "How much parent communication is centralised versus handled independently by each campus?",
      "What is the current inquiry-to-enrolment conversion rate, and is it measured consistently across campuses?",
      "What fee arrears position exists across the group, and who owns collection accountability?",
      "Which school management and fee systems are in use, and are they common across campuses?",
    ],
    flowTemplate: "admissions",
    scenario: "A Telugu-speaking parent enquiring about a Narayana junior college gets programme and fee answers that evening and a campus counselling visit booked before a rival network calls back.",
  },

  "sri-chaitanya": {
    operatingContext:
      "Sri Chaitanya Educational Institutions is a mega-network of schools, junior colleges and residential competitive-examination academies concentrated in Andhra Pradesh and Telangana with expansion across India, and operates the Infinity Learn edtech arm alongside the physical network. Its core business is preparing students for engineering and medical entrance examinations, largely through residential and intensive coaching programmes where the parent, not the student, is the buyer and the ongoing communication counterparty. Admissions season generates enormous parent inquiry volume about batches, campuses, hostel arrangements and fee structures, handled by campus and cluster-level staff. Communication is Telugu, Hindi and English, phone-first, and concentrated into the months following board and entrance results.",
    strategicPressure: [
      { text: "Direct competition with peer coaching networks for the same parent base means the first institution to give a family a substantive answer holds a decisive advantage.", kind: "verified" },
      { text: "Board and entrance result announcements trigger concentrated admissions inquiry surges that campus staffing cannot match.", kind: "verified" },
      { text: "Residential programmes make hostel, safety, food and supervision questions central to the parent's decision, and these are the questions most often deferred or answered inconsistently.", kind: "inference" },
      { text: "The Infinity Learn digital arm may claim scope over communications technology, so the deal must clarify whether the offline network buys separately.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "The physical network operates on purchased administrative software with campus-level staffing and no conversational-AI capability. Infinity Learn has digital engineering capacity but is a product business focused on learning content and platform, not contact automation for the offline network. Buy-led for the offline network, with the caveat that the digital arm's scope must be clarified before pursuit.",
    whyNotBuild:
      "Absorbing a post-results admissions surge across hundreds of campuses requires multilingual voice and messaging capacity that appears within days and disappears afterwards, grounded answers about batches, hostels and fees, and consistency the network currently cannot achieve. Even with a digital arm in the group, building contact automation for the offline network would divert product engineering from the edtech business it exists to run. Buying capacity sized to the surge is the correct decision.",
    workflows: [
      {
        name: "Post-results admissions inquiry engagement",
        friction: "When board and entrance results are declared, parent inquiries arrive in enormous volume across campuses and campaign channels, and families who do not get a call back the same day enrol elsewhere.",
        outcome: "Same-hour multilingual engagement that answers batch, campus, fee and hostel questions from approved sources, qualifies the family, and books a campus counselling visit.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Admissions CRM", "Campus and batch directory", "Fee catalogue", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Residential programme parent assurance",
        friction: "Hostel arrangements, food, supervision, safety and medical support are the questions parents care most about for residential coaching, and they are answered inconsistently or deferred to a campus visit.",
        outcome: "Grounded, consistent answers on residential arrangements in the parent's language with campus visit booking, removing the uncertainty that delays enrolment decisions.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Campus facility information", "Hostel allocation data", "Admissions CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Fee instalment and enrolment-completion follow-up",
        friction: "Families who commit at counselling still need to complete documentation and pay instalments, and follow-up is manual and inconsistent across campuses, so committed enrolments lapse.",
        outcome: "Structured multilingual follow-up on documents and fee instalments with in-channel payment and automatic reminders, converting counselling commitments into completed enrolments.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Fee management", "Document management", "Payment gateway", "Admissions CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Campus and cluster-level admissions counselling teams on phone and in person",
        "Group website and campaign landing pages capturing parent inquiries",
        "Infinity Learn digital platform serving online learners",
        "School and fee management software across the physical network",
      ],
      gaps: [
        "No capacity to engage every inquiry within hours of a results announcement",
        "Residential arrangement questions are answered inconsistently across campuses",
        "Committed families are not followed up systematically through documentation and fee payment",
        "No out-of-hours channel for working parents during the decisive admissions weeks",
      ],
    },
    risks: [
      "Claims about examination outcomes, ranks and success rates must be grounded in approved published figures — outcome claims are the highest-risk statement category in Indian coaching marketing.",
      "Student and parent data including minors' records requires DPDP-compliant handling with consent for outbound contact.",
      "Competitive-examination coaching carries well-documented student mental-health risk; any distress cue from a student or parent must route immediately to trained human counsellors and never be automated.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions from the network's published campus and student scale and Indian outbound-calling economics; the operative baseline is post-results inquiry volume across a cluster, which is not centrally measured today.",
    },
    pilotScope:
      "Deploy Telugu, Hindi and English post-results admissions engagement with residential-programme assurance answers and campus visit booking across one cluster, measured on same-day contact rate and visit conversion.",
    expansion: [
      "Add fee instalment and enrolment-completion follow-up with in-channel payment",
      "Extend to enrolled-parent communication on attendance, performance and campus updates",
      "Scale across clusters with central visibility of inquiry, conversion and completion metrics",
    ],
    stakeholders: [
      "Group Managing Director or Chief Executive Officer",
      "Head of Admissions for the pilot cluster",
      "Chief Financial Officer for fee realisation outcomes",
      "Head of Information Technology for the physical network",
      "Chief Executive of the Infinity Learn digital arm",
    ],
    discovery: [
      "Does Infinity Learn claim scope over communications technology for the offline network, or does the physical business buy separately?",
      "What is the inquiry volume in the two weeks after a board results announcement, and what proportion receives a same-day response today?",
      "What outcome and rank claims are approved for external communication, and who owns that source of truth?",
      "What proportion of counselling commitments lapse before enrolment is completed, and why?",
    ],
    flowTemplate: "admissions",
    scenario: "The evening board results are declared, a Telugu-speaking parent asks Sri Chaitanya about NEET batches and hostel arrangements, and has a campus visit booked within the hour.",
  },

  "allen-career": {
    operatingContext:
      "Allen Career Institute is the Kota-headquartered leader in NEET and JEE coaching, operating classroom centres across India alongside a digital arm built out following external investment. Its student population is large and heavily residential in Kota, where students relocate for one or two years of intensive preparation and parents remain the primary communication counterparty from another state. Admissions run through scholarship and admission tests, direct enquiry, and a referral network, with batch allocation, hostel arrangements, fee instalments and transfer requests forming a continuous operational conversation. Language is Hindi and English predominantly, with regional-language need for families from southern and eastern states sending students to Kota.",
    strategicPressure: [
      { text: "Kota's residential coaching model means parents in distant states need continuous reassurance and information about a child living away from home, which is a communications workload rather than an academic one.", kind: "verified" },
      { text: "Student mental health in the Kota coaching ecosystem has been the subject of sustained national attention, which raises the stakes on how any student-facing channel handles distress cues.", kind: "verified" },
      { text: "Post-results admissions windows concentrate enquiry and batch-allocation volume into weeks that determine the year's enrolment.", kind: "verified" },
      { text: "The group's digital investment has been directed at content and learning delivery rather than conversational infrastructure, leaving engagement automation as a clear buy.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Allen's digital arm builds learning products, not contact automation; the classroom business runs on purchased administrative software with centre-level staffing. There is no conversational-AI engineering effort directed at admissions or parent communication. Buy-led, with the organizational question being whether Allen Digital or the classroom business owns admissions communications after the restructuring.",
    whyNotBuild:
      "Parent communication for a residential coaching network needs multilingual voice and messaging capacity concentrated into admissions windows, grounded answers about batches, hostels and fees, and — critically — rigorous escalation design so that any student distress cue reaches a human immediately. Building that is neither Allen's competence nor its priority, and getting the distress-escalation design wrong through a self-built system would be a serious institutional risk.",
    workflows: [
      {
        name: "Admissions enquiry and batch-allocation servicing",
        friction: "Post-results enquiry volume overwhelms centre staff, families wait for callbacks about batch options, fee structures and admission-test outcomes, and competitors reach them first.",
        outcome: "Immediate multilingual engagement with grounded batch, fee and admission-test answers, structured qualification and a booked counselling conversation, protecting enrolment during the decisive weeks.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Admissions CRM", "Batch and centre directory", "Admission test platform", "Fee catalogue"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Parent communication for residential students",
        friction: "Parents in other states call centres and hostels for attendance, test performance, fee instalments and welfare updates, and get whoever answers the phone rather than a consistent, informed response.",
        outcome: "Consistent proactive parent updates on attendance, test performance and fee status in the family's language, with immediate human routing for any welfare or wellbeing matter.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Student information system", "Attendance and test records", "Fee management", "Warden and counsellor rosters"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Fee instalment and enrolment-completion follow-up",
        friction: "Fee instalments, transfer requests between centres and documentation are chased manually by centre staff, with inconsistent follow-up and no central visibility of what is outstanding.",
        outcome: "Structured multilingual follow-up with in-channel payment and automatic reminders, plus centralised visibility of outstanding fees and incomplete enrolments across centres.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Fee management", "Document management", "Payment gateway", "Student information system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Centre-level admissions counselling and parent communication by phone",
        "Admission and scholarship test platform with online registration",
        "Digital learning platform for online and hybrid learners",
        "Student and parent portals for attendance, performance and fee information",
      ],
      gaps: [
        "No same-day engagement capacity during post-results admissions surges",
        "Parent updates on residential students are reactive and depend on who answers the phone",
        "Fee and documentation follow-up is inconsistent across centres with no central view",
        "Regional-language coverage depends on centre staffing rather than being designed",
      ],
    },
    risks: [
      "Student mental health is the defining risk in this segment: any distress, self-harm or crisis cue must trigger immediate human escalation to trained counsellors, with no automated continuation of the conversation.",
      "Outcome and selection-rate claims must be grounded in approved published figures under advertising and consumer-protection norms.",
      "Student and parent data including minors' academic records requires DPDP-compliant handling with consent for outbound contact.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions from Allen's published student scale and Indian outbound-calling economics; the operative baseline is centre-level contact volume across a post-results admissions window and the current parent-communication workload.",
    },
    pilotScope:
      "Deploy Hindi, English and two regional-language post-results admissions engagement with batch and fee guidance and counselling booking, with hard-wired human escalation on any student wellbeing cue.",
    expansion: [
      "Add proactive parent communication on attendance, test performance and fee status for residential students",
      "Extend to fee instalment and enrolment-completion follow-up with in-channel payment",
      "Scale across centres with central visibility of enquiry, conversion and outstanding-fee metrics",
    ],
    stakeholders: [
      "Chief Executive Officer, Allen Career Institute",
      "Head of Admissions and Student Enrolment",
      "Chief Operating Officer for centre operations",
      "Head of Information Technology",
      "Head of Student Welfare and Counselling for escalation design",
    ],
    discovery: [
      "After the restructuring, does Allen Digital or the classroom business own admissions and parent communications?",
      "What is enquiry volume in the four weeks after NEET and JEE results, and what proportion gets a same-day response?",
      "What escalation protocol exists today for student wellbeing concerns, and who would own it in an automated channel?",
      "What outcome and selection-rate claims are approved for external communication?",
    ],
    flowTemplate: "admissions",
    scenario: "A parent in Kerala enquiring about an Allen NEET batch in Kota gets grounded batch, hostel and fee answers in the same evening and a counselling call the next day.",
  },

  fiitjee: {
    operatingContext:
      "FIITJEE is a long-established JEE coaching brand operating classroom programmes across Indian cities, historically recruiting through its own admission and talent-reward testing funnel and a strong reputation among engineering aspirants and their parents. Its operating model is city-centre classroom coaching with parent-facing communication around admissions, batch allocation, fee instalments, test performance and parent-teacher interaction. Communication is Hindi and English, phone-first, and coordinated centre by centre. The critical context for any pursuit is commercial rather than technical: widely reported centre closures and disputes have raised genuine questions about the institution's stability, which must be resolved before any engagement.",
    strategicPressure: [
      { text: "Reported centre closures and operational disputes have created uncertainty for existing students and parents, generating a distinctive volume of anxious enquiry that the institution is poorly equipped to handle consistently.", kind: "verified" },
      { text: "Brand erosion in a market where parents choose on reputation makes responsive, consistent parent communication a stabilisation requirement rather than an efficiency project.", kind: "inference" },
      { text: "Admission-test cycles remain a real funnel instrument, but converting from a weakened position requires faster and better engagement than competitors, not equivalent.", kind: "inference" },
      { text: "Financial viability is the binding constraint on any technology purchase and must be established before commercial effort is invested.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "FIITJEE is a coaching operator running purchased administrative software with centre-level staff; there is no engineering capability and, in the current financial position, no possibility of one. Buy-led in classification, but the practical qualification is affordability and stability rather than build competition.",
    whyNotBuild:
      "There is no scenario in which an institution under financial stress builds a conversational platform. The relevant question is whether a bought capability, scoped small, could stabilise parent communication and admissions conversion enough to justify its cost — and that requires a modest, tightly measured pilot rather than a platform programme.",
    workflows: [
      {
        name: "Admission-test funnel engagement",
        friction: "Admission and talent-test registrants receive inconsistent follow-up across centres, and in a weakened competitive position a slow response now costs enrolments that would previously have converted on brand alone.",
        outcome: "Immediate engagement with grounded programme, batch and fee answers plus counselling booking, restoring competitive response speed on a funnel the institution still generates.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Admission test platform", "Admissions CRM", "Batch and centre directory", "Fee catalogue"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Existing-parent communication and reassurance",
        friction: "Parents of currently enrolled students seek clarity on centre operations, batch continuity, fee status and transfers, and receive inconsistent answers from centre to centre during a period of uncertainty.",
        outcome: "Consistent, approved messaging on enrolment status, batch arrangements and fee position with escalation to management for anything requiring a commitment, reducing anxiety-driven repeat contact.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Student information system", "Fee management", "Centre operations records", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Fee, refund and transfer request handling",
        friction: "Fee, refund and centre-transfer requests are handled manually and inconsistently, which in the current environment escalates quickly into disputes and public complaints.",
        outcome: "Structured intake of fee, refund and transfer requests with tracked status and consistent policy application, containing disputes before they escalate.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Fee management", "Refund workflow", "Case management", "Student information system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Admission and talent-reward test platform with online registration",
        "Centre-level admissions counselling and parent communication by phone",
        "Student and parent portals for performance and fee information",
        "Website with programme and centre information",
      ],
      gaps: [
        "No consistent messaging across centres during a period of operational uncertainty",
        "Enquiry follow-up speed varies by centre and staffing",
        "Fee, refund and transfer requests have no tracked, consistent handling",
        "No out-of-hours channel for anxious parents seeking status",
      ],
    },
    risks: [
      "Financial viability is the primary qualification risk — commercial effort should not proceed until stability and payment capacity are established.",
      "In a disputed environment, every automated statement about enrolment, fees or refunds becomes potential evidence, so messaging must be approved, versioned and fully logged.",
      "Student wellbeing risk in competitive-examination coaching requires immediate human escalation on any distress cue, with no automated continuation.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from the institution's reduced but real centre footprint and Indian calling economics; any business case must be rebuilt entirely on current enrolment and enquiry data given the reported contraction.",
    },
    pilotScope:
      "Deploy a small, tightly scoped Hindi and English parent-communication and admission-test enquiry agent for a limited set of stable centres with approved messaging and full conversation logging.",
    expansion: [
      "Extend consistent parent messaging and enrolment-status servicing across remaining centres",
      "Add fee, refund and transfer request intake with tracked status and consistent policy application",
      "Scale admissions engagement only if enrolment recovery justifies further investment",
    ],
    stakeholders: [
      "Managing Director / Chairman's office",
      "Head of Admissions",
      "Chief Financial Officer for viability and payment capacity",
      "Head of Centre Operations",
      "Head of Information Technology",
    ],
    discovery: [
      "What is the current operating centre count and enrolled student base compared with two years ago?",
      "Is there budget authority and payment capacity for a technology engagement in the current financial position?",
      "What approved messaging exists for parent enquiries about centre continuity and fee status?",
      "What is the current volume and nature of refund and transfer requests, and how are they being handled?",
    ],
    flowTemplate: "admissions",
    scenario: "A FIITJEE parent asking whether their child's batch will continue receives the approved, consistent answer immediately rather than a different story from each centre.",
  },

  binus: {
    operatingContext:
      "BINUS University is Indonesia's most prominent private university group, operating multiple campuses in Jakarta and other cities, an international programme portfolio with overseas partner degrees, and BINUS Online serving working learners across the archipelago. It competes in a genuinely commercial private-admissions market where families compare institutions on programme reputation, employability and cost, and where response speed during the enrolment window materially affects intake. Enquiries arrive through digital campaigns, school outreach programmes, education fairs and the admissions website, and are worked by an admissions team by phone, WhatsApp and campus visits. Servicing is Bahasa Indonesia and English, with the international and online programmes generating enquiries outside standard hours.",
    strategicPressure: [
      { text: "Indonesia's private higher-education market is genuinely competitive, so admissions response speed and quality translate directly into intake and revenue.", kind: "verified" },
      { text: "BINUS Online enrols working learners continuously, creating year-round enquiry and learner-support volume that does not follow the campus admissions calendar.", kind: "inference" },
      { text: "International programme applicants and partner-degree pathways generate a distinct, higher-value enquiry stream with visa, credit-transfer and cost questions the general team answers inconsistently.", kind: "inference" },
      { text: "BINUS is more technically capable than most regional peers, so the internal IT directorate's scope must be established before positioning a bought platform.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "BINUS has a real internal IT directorate and a computing-focused academic identity, which makes it the most build-curious education account in this group. But its capability is application development and campus systems, not multilingual speech or conversational orchestration and evaluation. The realistic classification is buy-led on the conversational stack with the university owning integration and experience design.",
    whyNotBuild:
      "A capable university IT directorate would still need speech, telephony, orchestration and continuous evaluation to serve enquiries around the clock in two languages — and would be building it instead of the campus and learning systems that are its actual mandate. The opportunity-cost argument is the persuasive one here, alongside time-to-value: a bought agent runs in the current admissions cycle, an internal build does not.",
    workflows: [
      {
        name: "Admissions enquiry engagement and campus-visit booking",
        friction: "Enquiries from campaigns, school outreach and fairs are worked by the admissions team in office hours, so families researching in the evening wait for a callback while comparing competitor institutions.",
        outcome: "Immediate bilingual engagement with grounded programme, fee, scholarship and admission-pathway answers, qualification, and booked campus visits or counsellor calls.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Admissions CRM", "Programme and fee catalogue", "Scholarship rules", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "International and partner-programme applicant servicing",
        friction: "Applicants to international and partner-degree pathways ask about credit transfer, overseas study components, visas and total cost, and get inconsistent answers requiring specialist follow-up days later.",
        outcome: "Grounded, citable answers on pathway structure, credit transfer, cost and documentation with escalation to the international office for advisory decisions, at any hour.",
        channels: ["WhatsApp", "Email", "Web chat", "Voice"],
        systems: ["International programme catalogue", "Admissions CRM", "Document management", "Partner institution data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "BINUS Online enrolment and learner support",
        friction: "Working learners enquire and study outside office hours, and administrative issues around enrolment, platform access, assessment schedules and fee instalments are handled by a business-hours team.",
        outcome: "Round-the-clock enrolment and administrative support for online learners with identity-verified account recovery and in-channel fee payment, improving both conversion and continuation.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Student information system", "Learning management system", "Fee/payment system", "Identity management"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Admissions website with online application and programme information",
        "Admissions team working phone, WhatsApp and campus visits during office hours",
        "Student portal and learning platform for campus and online learners",
        "School outreach and education fair recruitment channels",
      ],
      gaps: [
        "No engagement in the evening and weekend hours when families research and decide",
        "International pathway questions require specialist follow-up rather than immediate grounded answers",
        "Online learners cannot resolve administrative issues outside business hours",
        "Scholarship eligibility questions are answered inconsistently across the admissions team",
      ],
    },
    risks: [
      "Indonesian personal-data protection law governs applicant and learner data, with consent requirements for marketing outreach and processing-location commitments.",
      "Fee, scholarship and employability claims must be grounded in approved published sources under Indonesian higher-education and advertising norms.",
      "Any student expressing distress or wellbeing concern must be routed to human counselling staff immediately, never handled by automation.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 1.3,
      automationRate: 0.6,
      basis: "Seller assumptions from BINUS's published enrolment scale and Indonesian contact-centre economics; the operative baseline is admissions CRM enquiry volume, current response-time distribution and online-division support ticket counts.",
    },
    pilotScope:
      "Deploy a bilingual admissions enquiry agent on WhatsApp and voice with grounded programme, fee and scholarship answers and campus-visit booking, measured on speed-to-first-contact and application conversion.",
    expansion: [
      "Add international and partner-programme applicant servicing with credit-transfer and documentation guidance",
      "Extend to BINUS Online enrolment and round-the-clock learner administrative support",
      "Add proactive application-completion chasing and post-offer nurture to reduce melt",
    ],
    stakeholders: [
      "Rector or Vice Rector responsible for Student Affairs and Admissions",
      "Head of Marketing and Admissions",
      "Director of the BINUS Online division",
      "Chief Information Officer / Head of the IT Directorate",
      "Head of the International Office",
    ],
    discovery: [
      "What is the monthly enquiry volume across campaign, outreach and fair channels, and what is the current median response time?",
      "Where does the IT directorate draw the line between what BINUS builds and what it buys for student-facing conversation?",
      "Does BINUS Online buy technology independently of the campus university?",
      "Which admissions CRM is incumbent, and what read and write access could an agent be granted?",
    ],
    flowTemplate: "admissions",
    scenario: "A Jakarta family researching BINUS at 9pm asks about computer science fees and scholarship eligibility in Bahasa Indonesia and books a campus visit in the same conversation.",
  },

  "ateneo-de-manila": {
    operatingContext:
      "Ateneo de Manila University is a Jesuit institution in Quezon City spanning basic education through graduate and professional schools, with a selective undergraduate admissions process and a strong graduate portfolio including a well-known business school. Its scale is smaller than the mega-universities of the region, but its brand position in Philippine higher education makes it a reference account rather than a volume account. Admissions activity concentrates around the entrance test and application cycle, with enquiries from applicants and parents about requirements, financial aid, scholarships and programme details, plus year-round enrolment, records and student-services queries from current students. Servicing is English and Filipino, and the institution's culture places high value on personal, considered communication.",
    strategicPressure: [
      { text: "Application and entrance-test cycles concentrate enquiry volume into short windows against admissions staffing sized for the annual average.", kind: "inference" },
      { text: "Financial aid and scholarship enquiries are consequential and repetitive, and delays or inconsistent answers directly affect whether qualified applicants from lower-income backgrounds proceed.", kind: "inference" },
      { text: "Registration and enrolment periods generate concentrated records, assessment and payment queries from current students each term.", kind: "verified" },
      { text: "As a brand-name Philippine institution, a successful deployment carries reference value across the sector that exceeds the account's own volume economics.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Ateneo operates purchased student information and admissions systems with an internal IT office focused on running them. It has strong computer science academics but no institutional software product function serving admissions. Buy-led, with the honest caveat that volume may be too small for standalone platform economics — the value is reference and expansion across the wider Jesuit education network.",
    whyNotBuild:
      "A university of this size has no reason to own speech and conversational infrastructure. What it needs is a well-governed assistant that answers admissions and student-services questions accurately in the institution's own voice, with careful escalation to human staff where a considered conversation is warranted — which is exactly what a configured bought capability provides.",
    workflows: [
      {
        name: "Admissions and financial-aid enquiry servicing",
        friction: "Applicants and parents ask about requirements, test schedules, deadlines and financial-aid eligibility, and admissions staff answer the same questions repeatedly while application-cycle deadlines approach.",
        outcome: "Grounded, citable answers on requirements, deadlines and financial-aid pathways in English and Filipino, with escalation to admissions officers for individual circumstances.",
        channels: ["Web chat", "WhatsApp", "Voice", "Email"],
        systems: ["Admissions system", "Financial aid rules", "Programme catalogue", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Enrolment and student-records servicing",
        friction: "Each registration period produces concentrated queries about enrolment steps, assessment of fees, class schedules and document requests, and students queue at offices for routine answers.",
        outcome: "Self-service enrolment guidance, assessment explanation and document-request intake with tracked status, removing office queues during registration weeks.",
        channels: ["Web chat", "WhatsApp", "Voice"],
        systems: ["Student information system", "Fee assessment", "Registrar document workflow", "Payment systems"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Application-completion and requirement follow-up",
        friction: "Applications stall on missing documents or incomplete requirements and are followed up manually, so qualified applicants drop out of the funnel for administrative rather than academic reasons.",
        outcome: "Automated requirement checking and follow-up with clear next steps and deadline reminders, improving completed-application rates without adding admissions staff.",
        channels: ["Email", "WhatsApp", "SMS"],
        systems: ["Admissions system", "Document management", "Notification gateway"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Admissions website with application portal and entrance-test information",
        "Student information system and registrar services for enrolled students",
        "Admissions and financial-aid offices handling enquiries by email and phone",
        "Learning management platform and student portal",
      ],
      gaps: [
        "Repetitive admissions and financial-aid questions consume officer time during peak cycles",
        "No self-service path for enrolment assessment and document requests during registration weeks",
        "Incomplete applications are followed up manually and inconsistently",
        "No out-of-hours channel for applicants and parents",
      ],
    },
    risks: [
      "Student and applicant data is personal information under the Philippine Data Privacy Act with consent and retention obligations.",
      "Admissions decisions and financial-aid determinations must remain entirely with staff; the agent may explain criteria and process only.",
      "Student wellbeing and mental-health disclosures must route immediately to the university's counselling services, never handled by automation.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 1.5,
      automationRate: 0.6,
      basis: "Seller assumptions from the institution's enrolment scale and Philippine support-desk economics; volume may be below standalone platform economics, so the baseline must be validated before commercial commitment.",
    },
    pilotScope:
      "Deploy an English and Filipino admissions and financial-aid enquiry agent on web chat and WhatsApp with grounded requirement and deadline answers and escalation to admissions officers.",
    expansion: [
      "Add enrolment guidance, fee-assessment explanation and registrar document requests",
      "Extend to automated application-requirement checking and deadline follow-up",
      "Explore extension across the wider Jesuit education network for portfolio-scale economics",
    ],
    stakeholders: [
      "Vice President for Higher Education / University Registrar",
      "Director of Admission and Aid",
      "Chief Information Officer / Director of Information Technology",
      "Director of Student Services",
      "Head of Finance for procurement approval",
    ],
    discovery: [
      "What is the enquiry volume during the application cycle versus the annual average, and how is it handled today?",
      "Is the volume sufficient for standalone economics, or should the pursuit target the wider network?",
      "Which admissions and student information systems are in place, and what integration is possible?",
      "What escalation protocol governs student wellbeing disclosures, and how would it apply to an automated channel?",
    ],
    flowTemplate: "admissions",
    scenario: "An applicant to Ateneo asks about financial-aid eligibility and application deadlines in Filipino on a Sunday evening and gets grounded answers with an officer meeting offered.",
  },

  "de-la-salle": {
    operatingContext:
      "De La Salle University is a major Manila private university and the flagship of the wider La Salle Philippines network of schools and colleges, operating undergraduate, graduate and professional programmes across its Taft Avenue campus and additional locations. Its administrative rhythm is defined by term-based enrolment cycles, where registration, fee assessment, class scheduling and document requests concentrate into a few weeks each term and generate queues at registrar and accounting offices. Admissions activity runs through its own application and testing process with enquiries from applicants and parents about requirements, scholarships and programme details. Servicing is English and Filipino, and the network structure means a successful deployment at the university has a natural expansion path across affiliated La Salle schools.",
    strategicPressure: [
      { text: "Term-based enrolment periods concentrate registrar, assessment and payment queries into short windows that produce visible campus queues each term.", kind: "verified" },
      { text: "Document requests — transcripts, certifications, credentials for employment and further study — generate steady, entirely procedural volume against registrar staffing.", kind: "inference" },
      { text: "Competition among Manila private universities for the same applicant pool makes admissions responsiveness a real enrolment factor.", kind: "inference" },
      { text: "The One La Salle network structure offers multi-entity expansion beyond the flagship university if a pilot succeeds, which changes the account's economics materially.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "DLSU operates purchased student information and admissions systems with an internal IT services function; there is no software product organization building conversational systems. Buy-led, with the commercial question being whether the buying centre is the university alone or the wider La Salle network organization.",
    whyNotBuild:
      "A university does not build speech and conversational infrastructure to answer registrar questions. What it needs is grounded, consistent answers across enrolment, records and admissions, delivered at term-peak volumes without adding staff — a configured bought capability, deployed once and extended across the network.",
    workflows: [
      {
        name: "Enrolment and fee-assessment servicing",
        friction: "Each term, students queue at registrar and accounting offices to understand enrolment steps, assessment of fees, payment options and scheduling conflicts, and staff answer the same questions hundreds of times.",
        outcome: "Self-service enrolment and assessment explanation grounded in the student's own record with payment guidance, eliminating routine queues during registration weeks.",
        channels: ["Web chat", "WhatsApp", "Voice"],
        systems: ["Student information system", "Fee assessment and accounting", "Class scheduling", "Payment systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Records and document-request servicing",
        friction: "Transcript, certification and credential requests are made in person or by email, processed manually, and requesters call repeatedly to ask whether the document is ready.",
        outcome: "Conversational document-request intake with identity verification, fee payment and proactive status through to release, removing an entirely procedural workload from registrar staff.",
        channels: ["Web chat", "WhatsApp", "Email", "Voice"],
        systems: ["Registrar document workflow", "Student records", "Payment systems", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Admissions enquiry and requirement follow-up",
        friction: "Applicants ask about requirements, testing, scholarships and deadlines, and incomplete applications are chased manually so qualified candidates drop out for administrative reasons.",
        outcome: "Grounded admissions answers with automated requirement checking and deadline follow-up, improving completed-application rates during the cycle.",
        channels: ["Web chat", "WhatsApp", "Email"],
        systems: ["Admissions system", "Document management", "Programme catalogue", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Student information system and online enrolment portal",
        "Registrar and accounting offices providing in-person enrolment and records services",
        "Admissions website with application and entrance-test information",
        "Learning management platform and student email communication",
      ],
      gaps: [
        "Registration-period queues persist despite an online enrolment portal",
        "Document requests have no self-service status path between request and release",
        "Admissions requirement follow-up is manual and inconsistent",
        "No out-of-hours channel for students and applicants",
      ],
    },
    risks: [
      "Student records and academic data are personal information under the Philippine Data Privacy Act, requiring identity verification before disclosure or document release.",
      "Academic decisions, grade matters and disciplinary processes must never be handled by an automated channel.",
      "Student wellbeing disclosures must route immediately to the university's counselling services.",
    ],
    economics: {
      volumeMonthly: 80000,
      costPerInteraction: 1.5,
      automationRate: 0.6,
      basis: "Seller assumptions from the university's enrolment scale and Philippine support-desk economics; the operative baseline is registrar and accounting transaction counts during a registration period plus admissions enquiry volume.",
    },
    pilotScope:
      "Deploy an English and Filipino enrolment and fee-assessment servicing agent on web chat and WhatsApp for one registration cycle, grounded in the student information system, measured on office-queue reduction.",
    expansion: [
      "Add records and document-request intake with identity verification, payment and status tracking",
      "Extend to admissions enquiry servicing and automated requirement follow-up",
      "Extend the deployment across affiliated schools in the One La Salle network",
    ],
    stakeholders: [
      "University Registrar, DLSU",
      "Vice Chancellor for Academics or Administration",
      "Director of Information Technology Services",
      "Director of Admissions and Scholarships",
      "Head of the La Salle network organization for multi-entity expansion",
    ],
    discovery: [
      "What are the registrar and accounting transaction volumes during a registration week versus a normal week?",
      "Is the buying centre DLSU alone, or can the La Salle network contract on behalf of affiliated schools?",
      "What identity verification would be required before an agent may discuss or release student records?",
      "How many document requests are processed monthly, and what is the current turnaround?",
    ],
    flowTemplate: "onboarding",
    scenario: "A De La Salle student resolves an enrolment assessment question and requests a transcript in one chat instead of queueing at the registrar during registration week.",
  },

  "ust-philippines": {
    operatingContext:
      "The University of Santo Tomas is one of the largest single-campus Catholic universities in the world, with tens of thousands of students across a very broad faculty portfolio including medicine, health sciences, engineering, law, education and the arts on its Manila campus. Its scale makes routine administration a genuine volume problem: entrance-test administration, enrolment across many faculties with different rules, fee assessment, document requests and student-services queries all concentrate at term boundaries and generate long physical queues. Admissions enquiries arrive nationally given the institution's reputation, particularly for health-sciences programmes with competitive entry. Servicing is English and Filipino, and institutional culture is traditional, meaning process change needs administrative sponsorship rather than technology enthusiasm.",
    strategicPressure: [
      { text: "Single-campus enrolment in the tens of thousands means term-boundary administrative load is concentrated in both time and physical space, producing queues that are visible and persistent.", kind: "verified" },
      { text: "Faculty-specific enrolment rules and fee structures make consistent answers hard to give, so students are routed between offices for questions that should be answerable once.", kind: "inference" },
      { text: "Competitive health-sciences admissions generate high-stakes, high-volume enquiry about requirements, entrance testing and quotas.", kind: "inference" },
      { text: "A traditional administrative culture means the deciding factor is likely an administrator experiencing queue relief rather than a technology strategy, which shapes how the pilot must be framed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "UST runs purchased student information and admissions systems with an internal IT office; there is no product engineering capability and no institutional appetite for building one. Buy-led, with the pursuit challenge being administrative appetite for automation rather than technical evaluation.",
    whyNotBuild:
      "The institution's problem is queue volume and inconsistent answers across faculties, not a missing engineering capability. A bought assistant grounded in a curated, faculty-aware knowledge base and the student record solves it; building anything would take longer than several enrolment cycles and would still require the same knowledge curation.",
    workflows: [
      {
        name: "Enrolment and fee-assessment servicing across faculties",
        friction: "Students queue physically to understand faculty-specific enrolment steps, assessment of fees and payment options, and are frequently sent between offices because no single point knows all the rules.",
        outcome: "Faculty-aware, grounded enrolment and assessment answers from the student's own record in one conversation, removing both the queue and the inter-office routing.",
        channels: ["Web chat", "WhatsApp", "Voice"],
        systems: ["Student information system", "Faculty enrolment rules", "Fee assessment", "Payment systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Document request and credential servicing",
        friction: "Transcript, certification and credential requests — including from alumni applying abroad or for professional licensure — are made in person or by email and chased repeatedly for status.",
        outcome: "Identity-verified request intake with payment and proactive status through to release, including for alumni who cannot visit campus, removing a purely procedural workload.",
        channels: ["Web chat", "Email", "WhatsApp"],
        systems: ["Registrar document workflow", "Student and alumni records", "Payment systems", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Admissions and entrance-test enquiry servicing",
        friction: "National enquiry volume about entrance testing, faculty-specific requirements and health-sciences quotas concentrates into the admissions cycle and consumes admissions staff on repetitive questions.",
        outcome: "Grounded, citable answers on requirements, testing logistics and programme criteria with escalation to admissions staff for individual circumstances.",
        channels: ["Web chat", "WhatsApp", "Voice", "Email"],
        systems: ["Admissions system", "Entrance test platform", "Programme requirement catalogue"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Student information system with online enrolment functions",
        "Registrar and faculty offices providing in-person enrolment and records services",
        "Admissions website and entrance-test administration",
        "Learning management platform and student portal",
      ],
      gaps: [
        "No single point that can answer faculty-specific enrolment and fee questions correctly",
        "Physical queues persist at term boundaries despite online enrolment functions",
        "Document requests, including from alumni abroad, have no self-service status path",
        "Admissions requirement questions are answered repetitively by staff during peak cycles",
      ],
    },
    risks: [
      "Student, alumni and academic records are personal information under the Philippine Data Privacy Act, requiring identity verification before any disclosure or release.",
      "Admissions decisions, academic standing and disciplinary matters must remain entirely with staff.",
      "Student wellbeing disclosures must route immediately to the university's counselling and guidance services.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.4,
      automationRate: 0.6,
      basis: "Seller assumptions from the university's published enrolment scale and Philippine support-desk economics; the operative baseline is registrar and faculty-office transaction counts during an enrolment period.",
    },
    pilotScope:
      "Deploy a faculty-aware enrolment and fee-assessment agent on web chat and WhatsApp for three faculties across one enrolment period, grounded in the student record, measured on office-queue and inter-office routing reduction.",
    expansion: [
      "Add document and credential request servicing including an alumni channel",
      "Extend enrolment servicing across all faculties with faculty-specific rule coverage",
      "Add admissions and entrance-test enquiry servicing during the admissions cycle",
    ],
    stakeholders: [
      "University Registrar, UST",
      "Vice Rector for Academic Affairs",
      "Director of the Office of Admissions",
      "Director of Information and Communications Technology",
      "Finance and Treasury office for procurement approval",
    ],
    discovery: [
      "What are registrar and faculty-office transaction volumes during enrolment weeks, and how long are the queues?",
      "How much do enrolment and fee rules vary by faculty, and where is the authoritative source for each?",
      "What identity verification standard would be required before an agent discusses a student record?",
      "Which administrator experiences the queue problem most acutely and could sponsor a pilot?",
    ],
    flowTemplate: "onboarding",
    scenario: "A UST student in a health-sciences faculty gets their enrolment steps and fee assessment explained in one chat instead of being sent between three offices.",
  },

  "rmit-vietnam": {
    operatingContext:
      "RMIT Vietnam is the largest foreign-owned university operation in Vietnam, running campuses in Ho Chi Minh City, Hanoi and Da Nang and delivering Australian-accredited degrees in business, technology, design and communication to Vietnamese students at premium fee levels. Its admissions proposition is consultative rather than transactional: families are buying an international-standard education at a price far above local universities, so the decision involves parents heavily and turns on questions about pathways, English requirements, employability, exchange opportunities and cost. Enquiries arrive through the website, education fairs, school outreach and agent channels, and are worked by an admissions and student-recruitment team. The distinguishing operational fact is bilingual asymmetry: programme content and academic communication are in English, while the parental decision conversation happens in Vietnamese.",
    strategicPressure: [
      { text: "Premium pricing relative to Vietnamese universities makes the parental value conversation central, and that conversation happens in Vietnamese even when the applicant corresponds in English.", kind: "verified" },
      { text: "English-language entry requirements and pathway programmes generate a distinct, consequential enquiry stream where confusion causes qualified applicants to abandon the funnel.", kind: "inference" },
      { text: "Competition from other international and pathway providers in Vietnam makes admissions response speed and quality a direct conversion factor.", kind: "inference" },
      { text: "Technology decisions may sit with RMIT in Melbourne rather than locally, which determines whether this is a Vietnam pursuit or an Australian one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "RMIT Vietnam operates within a larger university's technology estate and runs purchased CRM and student systems locally; it has no local engineering capability for conversational systems. Buy-led, with the essential qualification being whether local admissions can contract independently or whether the decision belongs to the parent institution's central IT.",
    whyNotBuild:
      "A campus operation does not build bilingual speech and conversational infrastructure. The genuine requirement — Vietnamese-language parental engagement grounded in English-language academic content, with accurate pathway and English-requirement guidance — is a configuration and knowledge-curation problem best solved with a bought platform and local content ownership.",
    workflows: [
      {
        name: "Bilingual admissions counselling engagement",
        friction: "Parents want to discuss programmes, costs and outcomes in Vietnamese while programme detail exists in English, and enquiries are worked in office hours by a team that families reach only after comparing alternatives.",
        outcome: "Immediate Vietnamese-language engagement grounded in the English programme content, answering pathway, cost and outcome questions accurately and booking counsellor appointments.",
        channels: ["Zalo", "WhatsApp", "Voice", "Web chat"],
        systems: ["Admissions CRM", "Programme and fee catalogue", "Pathway and English requirement rules", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "English-requirement and pathway guidance",
        friction: "Applicants who do not yet meet English entry requirements need to understand pathway options, test equivalences and timelines, and inconsistent guidance causes them to abandon rather than enrol in a pathway.",
        outcome: "Grounded, citable guidance on English requirements, accepted tests and pathway routes with timelines, converting near-miss applicants into pathway enrolments rather than losses.",
        channels: ["Zalo", "Web chat", "Voice"],
        systems: ["Admission requirement rules", "Pathway programme catalogue", "Admissions CRM", "Test equivalence data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Offer-to-enrolment nurture",
        friction: "Between offer and enrolment, families need to complete documentation, pay deposits and arrange logistics, and unanswered questions in that window let competitors and doubt take the student.",
        outcome: "Structured bilingual post-offer nurture covering documentation, deposits and orientation logistics with proactive reminders, reducing offer-to-enrolment melt on a high-value cohort.",
        channels: ["Zalo", "Email", "Voice", "SMS"],
        systems: ["Admissions CRM", "Document management", "Fee/payment system", "Orientation scheduling"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Admissions website with programme, fee and entry-requirement information in English and Vietnamese",
        "Admissions and student-recruitment team working phone, Zalo and campus appointments",
        "Education fair, school outreach and agent recruitment channels",
        "Student portal and learning platform for enrolled students",
      ],
      gaps: [
        "No out-of-hours Vietnamese-language engagement when families research and discuss",
        "English-requirement and pathway guidance is inconsistent across counsellors and agents",
        "Post-offer questions are handled reactively during the highest-melt-risk window",
        "Agent-mediated enquiries carry variable accuracy with no grounded reference channel",
      ],
    },
    risks: [
      "Vietnamese personal-data and cybersecurity regulations apply to applicant and family data, with data-localisation expectations to confirm.",
      "Statements about accreditation, credit transfer, English requirements and employability outcomes must be grounded in approved sources given the premium fee position.",
      "Student wellbeing disclosures, including relocation and academic stress, must route immediately to university counselling staff.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 1.6,
      automationRate: 0.6,
      basis: "Seller assumptions from the campus's enrolment scale and Vietnamese contact-centre economics; the operative baseline is admissions CRM enquiry volume, current response times and offer-to-enrolment melt rate.",
    },
    pilotScope:
      "Deploy a Vietnamese-language admissions engagement agent on Zalo and voice grounded in the English programme content, covering pathway and English-requirement guidance with counsellor booking.",
    expansion: [
      "Add offer-to-enrolment nurture covering documentation, deposits and orientation logistics",
      "Extend to a grounded reference channel for the education agent network",
      "Add enrolled-student administrative servicing across the three campuses",
    ],
    stakeholders: [
      "Vice President and Chief Operating Officer, RMIT Vietnam",
      "Director of Student Recruitment and Admissions",
      "Head of Marketing",
      "Head of Information Technology Services, RMIT Vietnam",
      "Central IT or procurement contact at RMIT Melbourne",
    ],
    discovery: [
      "Can RMIT Vietnam contract independently, or must technology decisions route through RMIT Melbourne?",
      "What is the current enquiry volume and median response time, and how much arrives outside office hours?",
      "What proportion of enquiries come through agents, and would a grounded agent-facing channel be supported?",
      "What is the current offer-to-enrolment melt rate, and what questions dominate that window?",
    ],
    flowTemplate: "admissions",
    scenario: "A Ho Chi Minh City parent asks RMIT Vietnam in Vietnamese what happens if their child's IELTS score falls short, and gets a grounded pathway explanation with a counsellor appointment.",
  },

  "apu-malaysia": {
    operatingContext:
      "Asia Pacific University of Technology and Innovation is a Kuala Lumpur private university with a strongly technology-oriented programme portfolio and one of Malaysia's most international student bodies, drawing students from across Asia, Africa and the Middle East. That international composition defines its operations: admissions enquiries arrive from dozens of countries and time zones, and every international offer triggers a visa and student-pass process through Malaysia's EMGS system, plus accommodation arrangements, arrival logistics and fee remittance from abroad. Domestic recruitment runs alongside through education fairs, school outreach and agent channels. Servicing is English-centred with Bahasa Malaysia and Mandarin need domestically, and the operational reality is that a mid-sized institution cannot staff round-the-clock coverage for a globally distributed applicant base.",
    strategicPressure: [
      { text: "A student body drawn from a very wide range of countries means enquiries arrive across every time zone against an admissions team working Malaysian hours.", kind: "verified" },
      { text: "The EMGS student-pass process is a documented, multi-stage requirement where applicant confusion and document errors cause delays that push arrivals past intake dates.", kind: "verified" },
      { text: "International recruitment is heavily agent-mediated, which introduces variable accuracy in what applicants are told about requirements, costs and visa timelines.", kind: "inference" },
      { text: "As a mid-sized institution competing against larger regional universities, responsiveness is one of the few levers APU can pull without a marketing budget it does not have.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "APU operates purchased CRM and student systems with an internal IT function; despite its technology-focused academic identity, it has no institutional software product organization serving admissions. Buy-led, and the round-the-clock international requirement makes the case unusually clean — this is capability the institution cannot staff at any reasonable cost.",
    whyNotBuild:
      "Serving applicants across dozens of time zones requires continuous availability, grounded answers on visa and student-pass requirements that change with regulation, and accurate cost and accommodation guidance. No mid-sized university builds that. Buying it gives APU a capability that larger competitors staff with headcount, at a fraction of the cost.",
    workflows: [
      {
        name: "International admissions enquiry servicing",
        friction: "Applicants from Africa, the Middle East and South Asia enquire at hours when nobody is working in Kuala Lumpur, wait a day for a reply, and often receive agent-mediated answers of uncertain accuracy.",
        outcome: "Round-the-clock grounded answers on programmes, entry requirements, fees and living costs with qualification and counsellor booking, giving every applicant a same-hour substantive response.",
        channels: ["WhatsApp", "Web chat", "Email", "Voice"],
        systems: ["Admissions CRM", "Programme and fee catalogue", "Entry requirement rules", "Counsellor calendar"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Visa and student-pass process support",
        friction: "The EMGS student-pass process requires specific documents in specific formats at specific stages, and applicant errors or delays push arrivals past the intake, costing the university the enrolment.",
        outcome: "Guided, grounded student-pass support with document checklists, format validation and proactive stage reminders, materially reducing arrival delays and lost intakes.",
        channels: ["WhatsApp", "Email", "Web chat"],
        systems: ["Student pass application tracking", "Document management", "Admissions CRM", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Accommodation and pre-arrival support",
        friction: "International students arriving in an unfamiliar country need accommodation, airport pickup, banking, and orientation information, and these questions land unevenly across offices in the weeks before intake.",
        outcome: "Structured pre-arrival support covering accommodation booking, arrival logistics and orientation in one channel, improving the arrival experience and reducing last-minute withdrawals.",
        channels: ["WhatsApp", "Email", "Web chat"],
        systems: ["Accommodation allocation", "Orientation scheduling", "Student information system", "Notification gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Admissions website with programme, fee and entry-requirement information",
        "International admissions team and education agent network across source markets",
        "Student pass and visa administration support through the university's international office",
        "Accommodation services and student portal for enrolled students",
      ],
      gaps: [
        "No servicing coverage outside Malaysian business hours for a globally distributed applicant base",
        "Student-pass document requirements are explained inconsistently, causing avoidable delays",
        "Agent-mediated information has no grounded reference channel to check against",
        "Pre-arrival logistics questions are handled across multiple offices with no single owner",
      ],
    },
    risks: [
      "Immigration and student-pass guidance must be grounded in current official requirements and clearly bounded — the agent explains process and documents but never gives immigration advice or predicts approval.",
      "Applicant data crosses many jurisdictions, engaging Malaysia's PDPA alongside source-country data-protection expectations.",
      "International students facing relocation stress or wellbeing difficulty must be routed to human student-support staff immediately.",
    ],
    economics: {
      volumeMonthly: 70000,
      costPerInteraction: 1.6,
      automationRate: 0.6,
      basis: "Seller assumptions from APU's published international enrolment profile and Malaysian contact-centre economics; the operative baseline is admissions enquiry volume by source country and time zone plus current student-pass delay rates.",
    },
    pilotScope:
      "Deploy a round-the-clock English-language international admissions enquiry and student-pass document-support agent on WhatsApp and web chat, measured on response time by time zone and student-pass delay reduction.",
    expansion: [
      "Add accommodation and pre-arrival logistics support ahead of each intake",
      "Extend to domestic recruitment with Bahasa Malaysia and Mandarin coverage",
      "Open a grounded reference channel for the education agent network across source markets",
    ],
    stakeholders: [
      "Vice Chancellor or Deputy Vice Chancellor, APU",
      "Director of International Marketing and Recruitment",
      "Head of the International Student Services / visa office",
      "Head of Information Technology",
      "Head of Admissions Operations",
    ],
    discovery: [
      "What is the enquiry volume by source country, and what proportion arrives outside Malaysian business hours?",
      "How many offers are delayed or lost each intake because of student-pass documentation problems?",
      "How much recruitment is agent-mediated, and would agents accept a grounded reference channel?",
      "Does APU buy independently of the parent APIIT group, and where do shared services sit?",
    ],
    flowTemplate: "admissions",
    scenario: "A prospective student in Nigeria asks APU at 3am Malaysian time about entry requirements and student-pass documents and gets a grounded checklist plus a counsellor appointment.",
  },

  kumon: {
    operatingContext:
      "Kumon Institute of Education operates the worldwide Kumon method through thousands of instructor-run learning centres, with Japan as its home market and largest single operation. The business model is franchise-like: individual instructors run centres under the Kumon brand and method, while the institute provides curriculum, materials, training and brand marketing. That produces two communication populations — parents enquiring about enrolment, method, fees and finding a nearby centre, and instructors needing operational, material-ordering and administrative support from headquarters. Parent enquiries are Japanese-language, phone- and web-driven, and highly seasonal around the Japanese school year, with trial-lesson periods driving concentrated demand. The structural constraint is that headquarters cannot simply deploy tooling into instructor-owned centres without their cooperation.",
    strategicPressure: [
      { text: "Japan's declining child population intensifies competition for every enrolment, making parent enquiry conversion a direct commercial priority rather than a service matter.", kind: "verified" },
      { text: "Centre discovery and matching is the first step of every parent journey, and a parent who cannot easily identify and contact a suitable nearby centre simply chooses a competitor.", kind: "inference" },
      { text: "Trial-lesson and new-term periods concentrate parent enquiry into windows where instructor-run centres, staffed by teaching personnel, are least able to handle phone volume.", kind: "verified" },
      { text: "Instructors themselves generate steady operational support demand on headquarters for materials, systems and administrative matters.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Kumon is a pedagogy and franchising organization; its technology is procured and its centres are run by instructors, not by a central operations technology function. There is no conversational-AI engineering capability. Buy-led, with the defining commercial question being whether headquarters can deploy a communications capability on behalf of instructor-owned centres or must offer it as an opt-in service.",
    whyNotBuild:
      "Handling parent enquiries centrally in Japanese with centre-level matching requires speech, messaging, a live centre directory with capacity information, and booking into individual centres' schedules. Kumon has no reason to build that and every reason to buy a capability that instructors can adopt without changing how they teach. The franchise structure makes a supplied, configurable service far more deployable than a bespoke internal build.",
    workflows: [
      {
        name: "Parent enquiry handling and centre matching",
        friction: "Parents researching Kumon must find a nearby centre themselves and phone it during teaching hours, often reaching nobody, and the enquiry evaporates before any conversation happens.",
        outcome: "Immediate Japanese-language parent engagement explaining the method, fees and expectations, matching the family to suitable nearby centres with capacity, and booking a trial lesson directly.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Centre directory and capacity data", "Trial lesson booking", "Fee and programme information", "Enquiry CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Trial-lesson scheduling and follow-up",
        friction: "Trial lessons are the conversion mechanism, but booking depends on reaching an instructor and follow-up after the trial is inconsistent, so interested families drop out between trial and enrolment.",
        outcome: "Booked trials with confirmations and reminders plus structured post-trial follow-up in the parent's language, converting a higher share of trials into enrolments across the network.",
        channels: ["LINE", "Voice", "SMS"],
        systems: ["Trial lesson scheduling", "Centre calendars", "Enquiry CRM", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Instructor operational support",
        friction: "Instructors contact headquarters for materials ordering, system access, administrative procedures and programme questions, and these queries queue behind each other on limited support capacity.",
        outcome: "A recognised-instructor support channel answering materials, systems and administrative questions from grounded sources, with escalation to regional staff for genuine exceptions.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Materials ordering system", "Instructor knowledge base", "Centre administration systems", "Case management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Corporate website with centre search and method information",
        "Centre-level telephone contact staffed by instructors and assistants",
        "Trial lesson programme as the standard entry experience for new families",
        "Instructor support channels from headquarters and regional offices",
      ],
      gaps: [
        "Parent enquiries reaching centres during teaching hours frequently go unanswered",
        "No central capability to match a family to suitable nearby centres with available capacity",
        "Post-trial follow-up depends entirely on individual instructor diligence",
        "Instructor operational queries queue against limited headquarters support capacity",
      ],
    },
    risks: [
      "Franchise structure is the central constraint: headquarters may not be able to deploy communications tooling into instructor-owned centres without an opt-in commercial model.",
      "Children's personal data collected during parent enquiries is sensitive under Japanese personal-information law with guardian consent requirements.",
      "Any parent or child disclosure concerning wellbeing, learning difficulty or safeguarding must be routed to trained human staff rather than handled by automation.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.0,
      automationRate: 0.6,
      basis: "Seller assumptions from Kumon's published Japanese centre and enrolment scale and Japanese contact-centre labour economics; the operative baseline is aggregate parent enquiry volume, which is currently distributed across centres and not centrally measured.",
    },
    pilotScope:
      "Deploy a Japanese-language parent enquiry and centre-matching agent on voice and LINE for one metropolitan region, booking trial lessons into participating centres' calendars.",
    expansion: [
      "Add post-trial follow-up and enrolment nurture across participating centres",
      "Extend nationally with an opt-in model for instructor-owned centres",
      "Open an instructor operational support channel for materials, systems and administration",
    ],
    stakeholders: [
      "Executive Officer responsible for the Japan education business",
      "General Manager, Franchise and Instructor Support",
      "General Manager, Marketing and Enrolment",
      "General Manager, Information Systems",
      "Regional office manager for the pilot region",
    ],
    discovery: [
      "Can headquarters deploy a communications service on behalf of instructor-owned centres, and under what commercial model?",
      "What is the aggregate parent enquiry volume, and what proportion currently goes unanswered at centre level?",
      "What is the current trial-to-enrolment conversion rate, and how much does it vary by centre?",
      "Can centre capacity and trial-lesson availability be exposed centrally for matching and booking?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Japanese parent researching Kumon in the evening is matched to two nearby centres with capacity and has a trial lesson booked before the centres open the next morning.",
  },

  "nova-japan": {
    operatingContext:
      "NOVA Holdings runs one of Japan's largest eikaiwa English-conversation school networks, with hundreds of schools in commercial locations plus a substantial online lesson business, alongside other language and education brands acquired over time. Its revenue model is subscription and lesson-credit based, which makes the booking calendar the operational heart of the company: trial-lesson bookings drive acquisition, lesson scheduling and rescheduling drive utilisation, and plan changes and cancellations drive retention economics. Student contact is therefore constant and transactional — booking, rebooking, instructor preferences, plan questions, and billing — handled by school reception staff and a central support function. Servicing is Japanese with English capability at schools, and demand concentrates in evenings and weekends when working adults study.",
    strategicPressure: [
      { text: "Lesson scheduling is directly tied to revenue: unbooked slots are unrecoverable capacity, and friction in booking or rebooking converts straight into lost lesson consumption.", kind: "inference" },
      { text: "Student contact concentrates in evenings and weekends when working adults manage their schedules, which is precisely when school reception capacity is committed to teaching operations.", kind: "verified" },
      { text: "Trial-lesson booking is the top of the acquisition funnel in a competitive eikaiwa market, and delayed response on a trial enquiry loses the customer to a competitor within the same evening.", kind: "inference" },
      { text: "Plan-change and cancellation conversations are retention moments handled inconsistently by reception staff, with no structured save process.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "NOVA is a language-education operator running purchased booking and billing systems with school-level and central support staffing. There is no platform engineering capability. Buy-led, with the practical dependency being integration into the incumbent booking system, which is the single most important technical qualification.",
    whyNotBuild:
      "Booking automation that actually works requires Japanese speech and messaging, live read and write access to lesson calendars across hundreds of schools and the online business, and reliability high enough that a student trusts it with a lesson they have paid for. A language-school operator does not build that. Buying it turns booking friction — a direct revenue leak — into an automated, measurable process.",
    workflows: [
      {
        name: "Trial-lesson booking and acquisition",
        friction: "Prospective students enquire in the evening after work, reach schools that are teaching or closed, and book with whichever competitor answers first.",
        outcome: "Immediate Japanese-language trial-lesson booking against live school and online availability with confirmation and reminders, capturing acquisition demand at the hour it occurs.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Lesson booking system", "School and instructor calendars", "Enquiry CRM", "Notification gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lesson scheduling, rescheduling and cancellation",
        friction: "Students rebooking or cancelling lessons must reach reception during opening hours; failed rebookings become unused credits and unfilled slots that cannot be recovered.",
        outcome: "Round-the-clock booking and rebooking against live calendars with instructor and location preferences honoured, improving lesson consumption and slot utilisation directly.",
        channels: ["Voice", "LINE", "App chat"],
        systems: ["Lesson booking system", "Instructor calendars", "Student credit balances", "Notification gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Plan change, billing and retention conversations",
        friction: "Plan changes, credit balance questions and cancellation requests are handled ad hoc by reception staff with no consistent retention process, so cancellations proceed without a save attempt.",
        outcome: "Consistent plan and billing answers with policy-bounded retention offers and escalation of genuine cancellation intent to trained staff, structuring a retention moment that is currently unmanaged.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Billing and subscription system", "Credit balance records", "Retention offer matrix", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Lesson booking system covering school-based and online lessons",
        "School reception staff handling booking, billing and student enquiries",
        "Website and app channels for lesson booking and plan information",
        "Trial-lesson programme as the standard acquisition entry point",
      ],
      gaps: [
        "No booking capability during evenings and weekends outside school reception hours",
        "Trial enquiries arriving after hours are lost to faster competitors",
        "Cancellations proceed with no structured retention conversation",
        "Unused lesson credits are not proactively surfaced to students before expiry",
      ],
    },
    risks: [
      "Subscription billing and cancellation handling is governed by Japanese consumer-contract rules — automated retention conversations must be policy-bounded and must never obstruct a cancellation request.",
      "Student personal and payment data is personal information under Japanese law with domestic-processing expectations.",
      "Integration into the incumbent booking system is the binding technical dependency and must be established before commitment.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 3.5,
      automationRate: 0.65,
      basis: "Seller assumptions from NOVA's published school and student scale and Japanese contact-centre labour economics; the operative baseline is booking-transaction volume, after-hours enquiry loss and current slot utilisation.",
    },
    pilotScope:
      "Deploy a Japanese-language trial-lesson booking and lesson-rescheduling agent on voice and LINE with live booking-system integration for one metropolitan region, measured on after-hours bookings captured and slot utilisation.",
    expansion: [
      "Extend booking and rescheduling nationally including the online lesson business",
      "Add plan-change, billing and policy-bounded retention conversations",
      "Add proactive credit-expiry reminders and lesson-consumption nudges",
    ],
    stakeholders: [
      "President or Executive Officer responsible for the eikaiwa business",
      "General Manager, School Operations",
      "General Manager, Marketing and Student Acquisition",
      "General Manager, Information Systems",
      "Head of Customer Support Centre",
    ],
    discovery: [
      "Which booking system is incumbent, and can it be read and written through an interface in real time?",
      "How many trial enquiries arrive outside school opening hours, and what happens to them today?",
      "What is current slot utilisation, and how much is lost to failed or absent rebooking?",
      "What retention practices are permitted on a cancellation request under the company's consumer-contract obligations?",
    ],
    flowTemplate: "appointments",
    scenario: "A Tokyo office worker rebooks a missed NOVA lesson at 11pm in Japanese against live instructor availability instead of waiting to call the school the next day.",
  },
};
