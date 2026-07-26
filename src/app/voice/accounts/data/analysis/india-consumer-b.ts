// Deep analysis blocks for India consumer profiles, index 50 to end.
// Evidence discipline: "verified" only for widely-reported public facts.
// No fabricated figures, quotes, dates or URLs.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_INDIA_CONSUMER_B: Record<string, ProfileAnalysis> = {
  "aster-dm-healthcare": {
    operatingContext:
      "Aster DM Healthcare's India business operates multi-specialty hospitals, day-care clinics, diagnostic labs and retail pharmacies concentrated in Kerala, Karnataka, Telangana and Maharashtra, with Kerala remaining its deepest catchment. Following the separation of the GCC business, the India entity is a standalone listed healthcare operator that has combined with the Quality Care India (CARE Hospitals) platform, roughly doubling its bed footprint and pulling in south and central India geographies. Its patients are a mix of walk-in outpatients, insurance and corporate-panel cases, NRI families in Kerala managing care for parents remotely, and a large repeat outpatient base for labs and pharmacy refills. Patient access today runs through hospital-level front desks and call centres, a consumer app and website for appointments, and increasing WhatsApp-based reminder traffic — with each hospital effectively running its own telephone identity.",
    strategicPressure: [
      { text: "Aster's India entity has separated from its GCC business and combined with the Quality Care India hospital platform, creating a much larger multi-region network to integrate operationally.", kind: "verified" },
      { text: "Merging two hospital groups means reconciling different HIS instances, patient-ID schemes and call-centre vendors — a period where a single patient-access layer above the systems is far cheaper than replatforming them.", kind: "inference" },
      { text: "Kerala's large NRI population drives after-hours enquiry traffic from Gulf time zones for appointments, second opinions and elderly-parent care coordination that a day-shift front desk cannot serve.", kind: "inference" },
      { text: "Pharmacy refill and lab repeat-test outreach is a recurring, protocol-driven revenue stream that is almost certainly under-worked because it competes with acute inbound for the same staff.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Aster is classified buy-led. It is a clinical operator whose capital allocation goes to beds, oncology and cardiac equipment, and acquisition integration — not to platform engineering. Its digital function is sized to run and integrate vendor systems (HIS, LIS, pharmacy, app) rather than to build speech and orchestration. Post-merger, technology attention is committed to consolidation, which makes a packaged, integrable layer far more attractive than a build.",
    whyNotBuild:
      "Building this would mean owning Malayalam and Kannada ASR quality for elderly and accented speakers, telephony across dozens of hospital DIDs, an orchestration layer that writes back into two different HIS estates, and a clinical-safety evaluation harness that proves the agent never gives medical advice. That is a multi-year specialist programme for a hospital group whose engineering team is already fully consumed by merger integration, and no part of it differentiates Aster clinically.",
    workflows: [
      {
        name: "Appointment and teleconsult scheduling across hospitals and clinics",
        friction: "Each hospital front desk holds its own slot book; callers who dial the wrong unit are asked to call another number, and evening and Gulf-hours enquiries hit voicemail or a security desk.",
        outcome: "Single multilingual access number that books into live consultant schedules at any unit, 24/7, with confirmation and preparation instructions pushed to the patient.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Hospital information system (HIS)", "Consultant scheduling / OP slot book", "Teleconsult platform", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lab report status and pharmacy refill outreach",
        friction: "Patients call repeatedly to ask whether a report is ready; refill reminders for chronic prescriptions are run manually or not at all, so patients drift to a neighbourhood pharmacy.",
        outcome: "Proactive report-ready notification with in-channel access, plus consented refill reminders timed to the prescription cycle that convert into a pharmacy or home-delivery order.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Laboratory information system (LIS)", "Pharmacy / retail POS", "e-prescription record", "Consent register"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Post-discharge follow-up and review-visit adherence",
        friction: "Discharge follow-up calls are made by ward staff between clinical duties, so coverage is partial and unrecorded; missed review visits surface only as readmissions.",
        outcome: "Structured follow-up conversation in the patient's language that confirms medication adherence, books the review visit, and escalates any red-flag symptom to a clinician immediately.",
        channels: ["Voice", "WhatsApp"],
        systems: ["HIS discharge summary", "Consultant scheduling", "Nursing escalation desk", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Consumer mobile app and website offering appointment booking and report access",
        "Hospital-level reception and call-centre desks handling appointments and enquiries",
        "SMS and WhatsApp notification traffic for appointment confirmations and report readiness",
        "Teleconsultation booking for remote and NRI-linked patients",
      ],
      gaps: [
        "No single number that can book across every hospital, clinic and lab in the network",
        "After-hours and Gulf-time-zone enquiries cannot be completed without waiting for the next working day",
        "Report-status and refill questions still require a human, despite being fully answerable from the LIS and pharmacy record",
        "Post-discharge follow-up is not systematically captured, so adherence and readmission risk are unmeasured",
      ],
    },
    risks: [
      "Clinical-advice boundary: the agent must be hard-constrained to logistics and information, with any symptom, dosage or triage question escalated to qualified staff and that boundary provable in evaluation logs.",
      "DPDP Act obligations around health data as sensitive personal data — consent capture, purpose limitation, and retention rules must be designed into the transcript and recording store.",
      "TRAI DND and commercial-communication rules constrain outbound refill and health-checkup outreach; service-transactional messaging must be separated from anything promotional.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions derived from network scale and typical hospital-group contact patterns — patient-access volume, blended cost per contact and achievable automation must all be validated against Aster's own call-centre and front-desk data in discovery.",
    },
    pilotScope:
      "A 10-week pilot on one Kerala cluster taking all inbound appointment and report-status calls in Malayalam and English on a single number, booking live into the HIS and handing clinical questions to staff.",
    expansion: [
      "Extend to Karnataka and Telangana units, adding Kannada and Telugu, and absorb the merged CARE Hospitals patient-access lines onto the same layer.",
      "Add outbound: consented pharmacy refill reminders, lab repeat-test recall, and health-checkup package renewal.",
      "Add post-discharge follow-up and review-visit adherence with clinician escalation, and instrument readmission-linked outcomes.",
    ],
    stakeholders: [
      "Chief Executive Officer, India business",
      "Chief Operating Officer / Cluster COO",
      "Chief Information Officer / Head of Digital Health",
      "Head of Patient Experience or Patient Access",
      "Medical Superintendent (clinical governance sign-off)",
    ],
    discovery: [
      "How many distinct phone numbers does a patient in Kerala have to know to reach the right Aster unit, and what share of calls are transferred at least once?",
      "Post-merger, are patient-access operations being consolidated onto one HIS instance, or will an access layer need to sit above two estates for the next two years?",
      "What proportion of inbound calls are pure report-status or appointment-status questions that the LIS and HIS could already answer?",
      "Who owns the clinical-safety sign-off for an automated patient-facing voice agent, and what would they need to see before approving a pilot?",
    ],
    flowTemplate: "appointments",
    scenario: "A daughter in Dubai calls the Aster line at 11pm Gulf time to book her father's cardiology review in Kochi and check whether his lipid report is ready.",
  },

  "rainbow-childrens-medicare": {
    operatingContext:
      "Rainbow Children's Medicare runs a specialised network of paediatric, neonatal and maternity hospitals, anchored in Hyderabad and Telangana with expansion into Bengaluru, Chennai, Delhi NCR and other metros. Its clinical mix is unusually acute for a mid-sized chain — neonatal intensive care, paediatric surgery and high-risk obstetrics sit alongside routine well-baby visits, immunisation and antenatal care. Its customers are anxious parents making time-critical decisions, often at night, plus a large recurring cohort of mothers on antenatal schedules and infants on national and optional immunisation calendars. Contact today runs through hospital reception numbers, a booking app and website, and WhatsApp threads that individual units maintain informally with parents.",
    strategicPressure: [
      { text: "Rainbow is a listed, expansion-stage paediatric and maternity specialist adding hospitals in new metros beyond its Telangana home base.", kind: "verified" },
      { text: "Immunisation and antenatal care are calendar-driven: every child and every pregnancy generates a fixed schedule of due dates, making recall the single most automatable revenue and outcome workflow in the business.", kind: "inference" },
      { text: "Paediatric decisions are made under stress and at unsociable hours, so a slow or unanswered call is directly a lost admission to a competing hospital in the same city.", kind: "inference" },
      { text: "As new-city units open with thin local brand recall, speed and quality of first response likely matters more to fill rate than anything else in the marketing mix.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Rainbow is buy-led. It is a focused clinical operator whose scarce capital goes into NICU cots, paediatric surgical capability and new-city units. Its technology function procures and runs a HIS, a booking app and reporting — it is not staffed to build conversational infrastructure, and there is no strategic reason for a children's hospital chain to own speech technology.",
    whyNotBuild:
      "The build would require Telugu, Hindi and Tamil speech that works on a distressed parent's mobile call, telephony resilience for a service where a dropped call is a clinical-trust failure, orchestration into the HIS immunisation register, and — hardest — an evaluation regime that can demonstrate the agent never strays into paediatric advice. A hospital group cannot staff or govern that; buying it with the clinical guardrails already built and evidenced is the only realistic route.",
    workflows: [
      {
        name: "Immunisation due-date recall and vaccination booking",
        friction: "Recall is run from spreadsheets or manual HIS reports by front-desk staff between other duties, so a large share of due children are never called, and parents who do call must be given a slot manually.",
        outcome: "Every due immunisation triggers a consented reminder in the parent's language that books the slot in-conversation, lifting schedule completion and clinic utilisation together.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Hospital information system (HIS)", "Immunisation register", "OP slot scheduling", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Paediatric appointment booking and after-hours enquiry triage",
        friction: "Night-time calls from worried parents reach a reception desk that can only take a message or advise coming to emergency; consultant availability across units is not visible to the caller.",
        outcome: "24/7 multilingual line that books into live paediatric and neonatal consultant schedules, gives logistics and preparation information, and routes any clinical concern instantly to qualified staff.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["HIS", "Consultant scheduling", "Emergency triage desk", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Antenatal package follow-through and delivery-plan coordination",
        friction: "Antenatal visit schedules and package instalments are tracked manually per unit, so missed visits and lapsed packages are noticed late, and pre-admission paperwork is repeated at every touchpoint.",
        outcome: "Structured antenatal journey with visit reminders, package and admission-document guidance, and delivery-plan coordination handled conversationally instead of at the counter.",
        channels: ["WhatsApp", "Voice"],
        systems: ["HIS obstetric record", "Package / billing module", "Admission desk workflow", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Booking app and website for paediatric and obstetric appointments",
        "Hospital reception and central booking desks per city cluster",
        "SMS and WhatsApp appointment confirmations and some vaccination reminders",
        "Emergency and NICU hotlines staffed by clinical teams",
      ],
      gaps: [
        "No systematic, measured immunisation recall covering every due child in the register",
        "Parents cannot complete a booking or reschedule after hours without waiting for the morning",
        "Antenatal visit adherence and package lapse are not proactively worked",
        "Regional-language service quality varies by whoever is on the desk in each city",
      ],
    },
    risks: [
      "Paediatric clinical-advice boundary is absolute: symptom, fever, dosage and feeding questions must escalate to qualified staff with zero agent interpretation, and this must be provable in every logged interaction.",
      "DPDP Act treatment of children's health data — parental consent, minimisation and retention limits apply to transcripts, recordings and any recall register used for outreach.",
      "TRAI commercial-communication and DND rules: immunisation recall must be structured and consented as service communication, not marketing, or the outreach engine will be throttled.",
    ],
    economics: {
      volumeMonthly: 160000,
      costPerInteraction: 1.1,
      automationRate: 0.45,
      basis: "Seller assumptions based on network size and paediatric contact patterns; actual inbound volume, cost per contact and the size of the immunisation-due register must be pulled from Rainbow's own systems during discovery.",
    },
    pilotScope:
      "An 8-week pilot on the Hyderabad cluster running consented immunisation recall in Telugu, Hindi and English with in-conversation slot booking into the HIS, measured on schedule-completion rate against a control cohort.",
    expansion: [
      "Add inbound appointment booking and after-hours enquiry handling on the same number across Telangana units.",
      "Extend to Bengaluru, Chennai and Delhi NCR units with Kannada, Tamil and Hindi coverage.",
      "Add the antenatal journey — visit reminders, package guidance and pre-admission document readiness — with clinician escalation paths.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Operating Officer, Hospitals",
      "Head of Information Technology / Digital",
      "Head of Marketing and Patient Acquisition",
      "Clinical Director, Paediatrics (safety governance)",
    ],
    discovery: [
      "How large is the currently-due immunisation register across units, and what share of those children are actually contacted each month?",
      "What happens to a paediatric booking call that arrives at 10pm — who answers it, and what can they actually do?",
      "Is the immunisation schedule held in the HIS in a queryable form, or reconstructed manually from visit records?",
      "Which clinician owns approval for a patient-facing automated agent, and what escalation design would satisfy them?",
    ],
    flowTemplate: "appointments",
    scenario: "A mother in Hyderabad gets a Telugu WhatsApp reminder that her nine-month-old's vaccination is due and books the Saturday morning slot in the same thread.",
  },

  "dr-lal-pathlabs": {
    operatingContext:
      "Dr Lal PathLabs runs one of India's largest diagnostics networks — a national reference-lab and regional-lab hierarchy feeding thousands of collection centres and a large home-collection phlebotomist workforce, with its deepest density across north India and Delhi NCR. Revenue comes from walk-in patients at collection centres, doctor-referred testing, corporate and institutional panels, and a fast-growing home-collection channel where a phlebotomist visits the patient's address in a booked time window. Its customer interactions are short, structured and enormously repetitive: book a home collection, confirm or reschedule a slot, ask where the phlebotomist is, ask whether the report is ready, ask what a parameter means, and rebook a repeat test. Patients reach it today through a consumer app and website, a central booking helpline, collection-centre phones, and SMS or WhatsApp links for report delivery.",
    strategicPressure: [
      { text: "Dr Lal PathLabs is a listed national diagnostics chain operating a hub-and-spoke lab network with a large home-collection business.", kind: "verified" },
      { text: "Well-funded online diagnostics aggregators compete aggressively on price and app convenience, compressing realisation per test and making cost per booking a board-level metric.", kind: "verified" },
      { text: "Home collection is the growth channel and also the most contact-intensive: every booking generates slot confirmation, phlebotomist-ETA and rescheduling conversations that scale linearly with volume.", kind: "inference" },
      { text: "Repeat-test recall for chronic-condition patients — diabetes, thyroid, lipid panels — is a large recurring revenue pool that is likely worked only partially because it competes with inbound for the same tele-callers.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Dr Lal PathLabs is buy-led. Its engineering investment sits in the laboratory information system, sample logistics and the patient app — the machinery of running a lab network. Conversational infrastructure is adjacent to none of its scientific or operational moats, and a cost-pressured diagnostics business will not fund a speech and orchestration programme when the same outcome is procurable.",
    whyNotBuild:
      "The requirement is Hindi, Bengali and English speech accurate on address and PIN-code dictation, telephony that survives a national helpline's peak, orchestration that writes a booking into the phlebotomist routing system and reads status from the LIS, and evaluation that guarantees the agent never interprets a lab value. Building and operating that is a permanent specialist function; buying it converts a fixed engineering commitment into a usage-linked cost that tracks the very metric — cost per booking — under pressure.",
    workflows: [
      {
        name: "Home-collection booking and slot management",
        friction: "Booking calls queue at morning peak when fasting-sample demand concentrates; address capture is error-prone over the phone, and reschedules require a fresh call into the same queue.",
        outcome: "Bookings, address confirmation and reschedules completed conversationally at any hour, written straight into the collection-routing system with the slot confirmed in-channel.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Laboratory information system (LIS)", "Home-collection routing / phlebotomist scheduling", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Report-status and collection-ETA deflection",
        friction: "A large share of inbound is simply where is my report or where is the phlebotomist — questions the LIS and routing system already know the answer to, but which consume a human agent each time.",
        outcome: "Instant grounded status in the patient's language, plus proactive notification at sample-received, processing and report-ready stages so the call is never made.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["LIS", "Sample-tracking / logistics", "Phlebotomist routing", "Report delivery gateway"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Repeat-test and chronic-panel recall",
        friction: "Recall for periodic tests is run as generic SMS blasts with no conversation, so patients who intend to rebook are not converted and the outreach is unattributable.",
        outcome: "Consented, timing-aware recall that opens a two-way conversation and completes the rebooking, with conversion attributed test by test.",
        channels: ["WhatsApp", "Voice"],
        systems: ["LIS test history", "CRM / campaign engine", "Home-collection routing", "Consent register"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer app and website for test booking, home-collection scheduling and report download",
        "Central booking helpline plus collection-centre level phone contact",
        "SMS and WhatsApp report-ready notification with secure report links",
        "Some IVR self-service on the central line for status and booking options",
      ],
      gaps: [
        "Patients cannot reliably complete a home-collection booking or reschedule outside helpline hours",
        "Phlebotomist ETA and delay information is not proactively pushed, so patients call to chase",
        "Repeat-test recall is broadcast rather than conversational, and its conversion is not attributed",
        "Regional-language service depth is thinner than the geographic spread of the collection network",
      ],
    },
    risks: [
      "The agent must never interpret a result, suggest a diagnosis or advise on a parameter — a hard boundary with escalation to qualified staff, evidenced in evaluation logs.",
      "DPDP Act: diagnostic results are sensitive personal data; identity verification before disclosing any report status must be strong, and transcript retention explicitly governed.",
      "TRAI DND and commercial-communication rules apply to repeat-test recall outreach, which must be consent-anchored and separated from promotional health-package campaigns.",
    ],
    economics: {
      volumeMonthly: 1400000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from national booking and report-status contact patterns at a large diagnostics network; true monthly contact volume, blended cost per contact and current IVR containment must be confirmed with the customer-care leadership in discovery.",
    },
    pilotScope:
      "A 10-week pilot taking all home-collection booking, reschedule and report-status calls for the Delhi NCR region in Hindi and English on the central helpline, with bookings written live into the collection-routing system.",
    expansion: [
      "Extend to eastern and northern regions with Bengali and additional language coverage, and add proactive phlebotomist-ETA and report-stage notifications.",
      "Add consented repeat-test and chronic-panel recall with in-conversation rebooking and attributed conversion.",
      "Add the B2B side — collection-centre franchisee and referring-clinician queries on sample status, credit and test menus.",
    ],
    stakeholders: [
      "Chief Executive Officer or Chief Operating Officer",
      "Chief Information Officer / Head of Digital",
      "Head of Customer Care / Contact Centre Operations",
      "Head of Home Collection / Logistics Operations",
      "Chief Financial Officer (cost per booking ownership)",
    ],
    discovery: [
      "What is the current split of helpline volume between new bookings, reschedules, ETA chasing and report status?",
      "Can the home-collection routing system accept a booking or slot change through an API today, or is it screen-driven for the tele-caller?",
      "What is the abandonment rate on the booking line during the morning fasting-sample peak?",
      "How is repeat-test recall run today, and is anyone measuring conversion from recall to a completed booking?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Ghaziabad rebooks tomorrow's fasting blood draw to a later slot and asks whether yesterday's thyroid report is ready — both settled in one Hindi call.",
  },

  "metropolis-healthcare": {
    operatingContext:
      "Metropolis Healthcare operates a pan-India clinical-laboratory network with a hub-and-spoke structure of reference labs, satellite labs and collection centres, and unusual depth in western and southern India — Mumbai, Pune, Gujarat, Bengaluru, Chennai and the Hyderabad belt. Its revenue mixes B2C patients booking tests directly, a substantial B2B stream from hospitals, nursing homes and referring clinicians who send samples to its labs, and specialised and esoteric testing that carries higher realisation. Interactions therefore split into two very different populations: patients asking about home visits and reports in Marathi, Hindi, Tamil and English, and clinicians and lab partners asking about sample receipt, turnaround times and specialised-test protocols. Access today runs through a consumer app, a website, a central helpline and lab-level phone lines, with report delivery by SMS and email links.",
    strategicPressure: [
      { text: "Metropolis is a listed diagnostics chain with a pan-India lab network and a meaningful B2B referral business alongside its consumer channel.", kind: "verified" },
      { text: "Price-led online diagnostics competitors have compressed the consumer end of the market, pushing established labs to defend on service, turnaround and specialised testing rather than price.", kind: "verified" },
      { text: "The B2B clinician and lab-partner channel generates high-frequency, low-complexity status queries that are currently absorbed by the same teams serving anxious consumers — a poor use of both.", kind: "inference" },
      { text: "Home-visit scheduling in dense western-India catchments is the operational bottleneck where slot promises and phlebotomist reality most often diverge.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Metropolis is buy-led. Its differentiation is analytical — test menu breadth, esoteric assays, turnaround and quality accreditation — and its technology spend goes to the LIS, sample logistics and the patient app. There is no organisational appetite or staffing to build speech, telephony and orchestration, and a margin-pressured diagnostics business will treat that as a procurement decision.",
    whyNotBuild:
      "Serving both a Marathi-speaking patient booking a home visit and a clinician asking about a sample's turnaround requires two grounded conversational surfaces over the same LIS, plus telephony, consent handling and an evaluation regime that keeps the agent away from result interpretation. Metropolis has no reason to own any of that; it needs the outcome, and it needs it configured to its test menu, not built from scratch.",
    workflows: [
      {
        name: "Home-visit booking and phlebotomist coordination",
        friction: "Slot booking is a phone-and-callback loop; address and landmark capture is unreliable, and when a phlebotomist runs late nobody tells the waiting patient.",
        outcome: "Booking, address confirmation and rescheduling completed in one multilingual conversation, with proactive delay notification when the routing system shows the visit slipping.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Laboratory information system (LIS)", "Home-visit routing / phlebotomist scheduling", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Report-status line for patients",
        friction: "Report-status calls dominate inbound and are answered by reading the LIS aloud; at peak the queue is long enough that patients call the collection centre instead, moving the load rather than removing it.",
        outcome: "Grounded, identity-verified report status in the patient's language on any channel, plus a report-ready push that suppresses the call entirely.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["LIS", "Sample-tracking", "Report delivery gateway", "Identity verification"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Clinician and lab-partner query desk",
        friction: "Referring doctors and partner labs call the same consumer helpline for sample-receipt confirmation, turnaround estimates and specialised-test requirements, and wait behind patient calls.",
        outcome: "A dedicated grounded B2B line that recognises the partner account, answers sample and turnaround questions from the LIS, and routes protocol questions to the scientific team.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["LIS partner records", "B2B account / credit records", "Test-menu knowledge base", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer app and website for test booking, home-visit scheduling and report access",
        "Central helpline plus lab and collection-centre level phone contact",
        "SMS and email report-delivery links with secure access",
        "Account-manager relationships serving referring clinicians and partner labs",
      ],
      gaps: [
        "Home-visit delays are not communicated proactively; patients discover them by waiting",
        "Report-status questions still consume human agents despite being fully answerable from the LIS",
        "Clinician and partner queries share the consumer queue with no account recognition",
        "Language coverage is uneven across a network that spans Marathi, Gujarati, Tamil, Kannada and Hindi catchments",
      ],
    },
    risks: [
      "Absolute prohibition on interpreting results or advising on values; every clinical question escalates to qualified staff with the boundary evidenced in evaluation.",
      "DPDP Act obligations on sensitive health data, including strong identity verification before any report-status disclosure and governed retention of call transcripts.",
      "TRAI DND and commercial-communication rules constrain outbound health-package and recall campaigns, which must be consent-anchored and distinguishable from service messages.",
    ],
    economics: {
      volumeMonthly: 550000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from network scale and diagnostics contact patterns; the real B2C-versus-B2B contact split, helpline volume and cost per contact must be validated with customer-care and commercial leadership in discovery.",
    },
    pilotScope:
      "An 8-week pilot on the Mumbai and Pune catchment handling home-visit booking, rescheduling and report-status calls in Marathi, Hindi and English, writing bookings live into the routing system.",
    expansion: [
      "Extend to southern labs with Tamil, Kannada and Telugu coverage and add proactive phlebotomist-delay and report-stage notifications.",
      "Stand up the clinician and partner-lab desk with account recognition and grounded turnaround answers.",
      "Add consented preventive-panel and repeat-test recall with in-conversation rebooking and attributed conversion.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Operating Officer, Laboratory Operations",
      "Head of Information Technology",
      "Head of Customer Experience / Contact Centre",
      "Head of B2B Sales and Clinician Relations",
    ],
    discovery: [
      "What share of central helpline volume is report status versus booking versus B2B partner queries?",
      "Does the home-visit routing system expose live phlebotomist status that could drive a proactive delay message?",
      "Which languages are actually staffed on the helpline today, and which catchments are being served in a second-choice language?",
      "How are referring clinicians served today, and would the commercial team support a separate grounded partner line?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Thane is told proactively in Marathi that her home phlebotomist is running forty minutes late and moves the visit to the evening slot.",
  },

  "agilus-diagnostics": {
    operatingContext:
      "Agilus Diagnostics, formerly SRL Diagnostics and part of the Fortis Healthcare group, operates one of India's largest laboratory networks — a national chain of reference and regional labs, collection centres, and a substantial book of hospital-lab management contracts where Agilus runs the pathology operation inside a partner hospital. That gives it three distinct customer populations: consumers booking tests and home collections, hospitals and nursing homes whose in-house labs it operates, and referring clinicians tracking patient samples. Following the rename from a long-established brand, consumer recall has to be rebuilt at the same time as service expectations have been reset by app-first competitors. Contact today runs through a consumer app and website, a central helpline, collection-centre and lab phone lines, and digital report delivery.",
    strategicPressure: [
      { text: "Agilus operates under the Fortis Healthcare umbrella and was rebranded from the long-established SRL Diagnostics identity.", kind: "verified" },
      { text: "A brand rename forces every consumer touchpoint to work harder — a patient who does not recognise the name judges the business on the first phone or WhatsApp interaction.", kind: "inference" },
      { text: "The hospital-lab management book generates continuous institutional query traffic on sample receipt, turnaround and reporting that is operationally different from consumer service and probably under-served by the same helpline.", kind: "inference" },
      { text: "Consumer home collection is where the discounter competitors attack hardest, so cost per booking and slot reliability are likely the sharpest internal metrics.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Agilus is buy-led. As a laboratory operator inside a hospital group, its technology agenda is the LIS, sample logistics, hospital-lab integration and reporting. Neither Agilus nor its Fortis parent has a mandate to build conversational infrastructure, and rebrand-phase capital is going into brand, network and test menu.",
    whyNotBuild:
      "Building would mean owning multilingual speech across a national footprint, telephony for a helpline that spikes every morning, orchestration across its own LIS plus the systems of the hospitals whose labs it manages, and a clinical-boundary evaluation harness. That is a specialist engineering function with no diagnostic value, competing for budget against network and brand investment during a rebrand.",
    workflows: [
      {
        name: "Test booking and home-collection scheduling",
        friction: "Booking depends on helpline availability and manual address capture; patients who reach a collection centre directly get a different answer on slots than the central line gives.",
        outcome: "One multilingual booking surface that confirms tests, price, fasting requirements and a real slot, written into the collection-routing system regardless of which channel the patient used.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Laboratory information system (LIS)", "Home-collection routing", "Test-menu and pricing master", "Payments"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Sample and report status for patients",
        friction: "Status calls are the largest inbound driver and are answered by an agent reading the LIS; during peak, patients call repeatedly because there is no proactive update.",
        outcome: "Identity-verified grounded status on any channel plus stage-by-stage push notification, removing the reason to call at all.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["LIS", "Sample-tracking / logistics", "Report delivery gateway", "Identity verification"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Hospital-lab partner support desk",
        friction: "Hospital partners whose labs Agilus manages call individual coordinators for sample, turnaround and reporting questions, so service depends on a named person being available.",
        outcome: "A grounded partner line that recognises the institution, answers sample and turnaround queries from the LIS, and escalates protocol and escalation matters to the scientific and account teams.",
        channels: ["Voice", "Email", "WhatsApp"],
        systems: ["LIS institutional records", "Hospital lab-management contracts / SLA records", "Test-menu knowledge base", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Consumer app and website for booking, home collection and report access",
        "Central helpline plus lab and collection-centre phone contact",
        "Digital report delivery by SMS and email with secure links",
        "Named coordinators serving hospital-lab management partners",
      ],
      gaps: [
        "Booking cannot be completed reliably outside helpline hours or in every regional language of the network",
        "No proactive sample-stage or report-ready push, so status chasing dominates inbound",
        "Hospital-lab partners have no self-service route for routine sample and turnaround questions",
        "Post-rename, first-contact quality varies by channel, which is exactly where brand recall is being rebuilt",
      ],
    },
    risks: [
      "No result interpretation under any circumstance — clinical questions escalate to qualified staff, with the boundary demonstrable in logs.",
      "DPDP Act obligations on health data, compounded where Agilus processes data inside partner-hospital environments under contract.",
      "TRAI DND and commercial-communication rules on any preventive-package or recall outreach, which must be consented and separated from service messaging.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions from national lab-network contact patterns; actual helpline volume, consumer-versus-institutional mix and cost per contact require validation with Agilus customer-care and commercial leadership.",
    },
    pilotScope:
      "An 8-week pilot on the north-India consumer helpline taking booking, home-collection scheduling and report-status calls in Hindi and English, with live LIS grounding and bookings written into the routing system.",
    expansion: [
      "Extend to eastern and southern regions with Bengali and Tamil coverage, and add proactive sample-stage and report-ready notifications.",
      "Stand up the hospital-lab partner desk with institution recognition and grounded turnaround answers.",
      "Add consented preventive-health-package and repeat-test recall with in-conversation booking.",
    ],
    stakeholders: [
      "Chief Executive Officer, Agilus Diagnostics",
      "Chief Operating Officer / Head of Lab Operations",
      "Head of Information Technology",
      "Head of Customer Experience / Contact Centre",
      "Head of Hospital Lab Management (institutional business)",
    ],
    discovery: [
      "What share of inbound is consumer versus institutional, and are they handled by the same team today?",
      "Which systems hold live sample status, and can they be queried in real time for a patient-facing conversation?",
      "Since the rename, what has happened to first-contact resolution and to the volume of brand-confusion calls?",
      "Do the hospital lab-management contracts define service levels that an automated partner desk would need to evidence?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Lucknow books a Sunday home collection in Hindi and is told the fasting requirement and price before the phlebotomist is assigned.",
  },

  "hcg-oncology": {
    operatingContext:
      "HealthCare Global Enterprises (HCG) runs India's largest dedicated cancer-care network — comprehensive cancer centres, day-care chemotherapy units and radiation-oncology facilities concentrated in Karnataka, Gujarat, Maharashtra and eastern India, with a hub-and-spoke design where complex cases route to flagship centres. Cancer care is unlike any other hospital workload: a single patient generates months of coordinated contact across diagnostic staging, surgery, chemotherapy cycles on fixed intervals, radiation fractions delivered daily for weeks, and long survivorship follow-up. A large share of patients travel from smaller towns and neighbouring states, so every appointment carries travel, accommodation, financial-counselling and insurance-approval logistics around it. Contact today runs through centre-level reception and patient-coordinator teams, a website and app, and coordinator WhatsApp threads that carry a great deal of undocumented operational load.",
    strategicPressure: [
      { text: "HCG is a listed, specialised oncology network operating comprehensive cancer centres across multiple Indian states with a hub-and-spoke referral design.", kind: "verified" },
      { text: "Chemotherapy cycles and radiation fractions are protocol-scheduled, which makes adherence outreach both clinically consequential and highly automatable — a missed cycle is a clinical event, not just a lost slot.", kind: "inference" },
      { text: "Out-of-town patients need travel, stay, insurance pre-authorisation and financial-counselling coordination that currently sits with human coordinators and does not scale with volume.", kind: "inference" },
      { text: "Linear accelerator and day-care chair utilisation is the core economic constraint; no-shows and late reschedules on those assets are likely the most expensive operational leak in the network.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "HCG is buy-led. Its capital and attention go to radiation technology, molecular diagnostics, clinical talent and centre expansion. Its technology function integrates HIS, oncology information systems and radiation planning software rather than building platforms, and there is no oncology rationale for owning conversational infrastructure.",
    whyNotBuild:
      "The build is unusually hard here: Kannada, Hindi, Telugu and Tamil speech for elderly and unwell patients, orchestration across HIS and oncology-specific scheduling, and an evaluation regime strict enough that an agent handling cancer patients demonstrably never touches clinical content, prognosis or symptom interpretation. No cancer-care operator can staff that; the entire value is in buying it with the escalation design and clinical guardrails already proven.",
    workflows: [
      {
        name: "Treatment-cycle scheduling and adherence outreach",
        friction: "Coordinators phone patients between clinical duties to confirm the next chemotherapy cycle or radiation fraction; when a patient cannot travel, the change is handled ad hoc and the slot is lost.",
        outcome: "Every scheduled cycle and fraction confirmed proactively in the patient's language, with reschedules offered against live capacity so the chair or linear-accelerator slot is refilled rather than wasted.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Hospital information system (HIS)", "Oncology / chemotherapy scheduling", "Radiation-therapy scheduling", "Patient-coordinator CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Out-of-town patient logistics and pre-visit readiness",
        friction: "Patients travelling from other districts and states repeatedly call coordinators about what to bring, where to stay, what the visit will cost and whether insurance approval has come through; each answer requires a human to check two or three systems.",
        outcome: "A single grounded conversation that confirms the appointment, lists required reports and documents, gives travel and stay guidance and reports live pre-authorisation status.",
        channels: ["Voice", "WhatsApp"],
        systems: ["HIS", "Insurance / TPA pre-authorisation tracking", "Billing and estimate module", "Patient-coordinator CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Survivorship follow-up and surveillance-scan recall",
        friction: "Long-term follow-up scans and reviews depend on the patient remembering; recall is partial and manual, so surveillance adherence is unmeasured and late recurrences are found late.",
        outcome: "Protocol-timed, consented follow-up outreach that books the surveillance appointment in-conversation and flags non-responders to the clinical team.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["HIS follow-up register", "Imaging / radiology scheduling", "Consent register", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Centre-level reception and dedicated patient-coordinator teams for oncology journeys",
        "Website and app offering appointment requests and second-opinion enquiry",
        "SMS and WhatsApp appointment and report notifications",
        "Financial-counselling and insurance-desk support at each centre",
      ],
      gaps: [
        "No systematic confirmation of every scheduled chemotherapy cycle and radiation fraction",
        "Out-of-town logistics and pre-authorisation status require a coordinator to be reachable",
        "Surveillance and survivorship recall is not run to protocol or measured",
        "Coordinator WhatsApp threads carry critical operational context that is invisible to the organisation",
      ],
    },
    risks: [
      "Oncology clinical-advice boundary is absolute — symptoms, side effects, prognosis and dosage escalate immediately to clinical staff, and vulnerable or distressed callers must route to a human by design.",
      "DPDP Act treatment of cancer diagnosis and treatment data as sensitive personal data, with strict consent, minimisation and retention rules on transcripts and recordings.",
      "TRAI DND rules and the reputational sensitivity of outbound contact with cancer patients — outreach must be consented, service-framed and never promotional.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 1.2,
      automationRate: 0.4,
      basis: "Seller assumptions based on network scale and oncology contact intensity; the automation ceiling is deliberately conservative because a high share of oncology contact is clinical and must stay human — all figures require validation against HCG's coordinator workload data.",
    },
    pilotScope:
      "A 10-week pilot at the Bengaluru flagship centre confirming and rescheduling chemotherapy day-care and radiation appointments in Kannada, Hindi and English, with any clinical content escalated to the coordinator team and measured slot-refill rates.",
    expansion: [
      "Extend to Gujarat, Maharashtra and eastern centres with Gujarati, Marathi, Bengali and Telugu coverage.",
      "Add out-of-town patient readiness: document checklists, estimates and live insurance pre-authorisation status.",
      "Add protocol-timed survivorship and surveillance-scan recall with clinical flagging of non-responders.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer, Centres",
      "Chief Information Officer / Head of Digital",
      "Head of Patient Experience and Coordination",
      "Clinical Director, Oncology (safety and escalation governance)",
    ],
    discovery: [
      "What proportion of scheduled chemotherapy cycles and radiation fractions are missed or rescheduled late, and what does that cost in chair and linac utilisation?",
      "How much of a patient coordinator's day is spent on logistics, documents and pre-authorisation status rather than clinical coordination?",
      "Is insurance pre-authorisation status queryable in real time, or does the coordinator phone the TPA?",
      "What escalation and clinical-governance design would the oncology leadership require before any automated contact with cancer patients?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient travelling from Hubballi confirms next week's chemotherapy cycle in Kannada, hears the document checklist, and is told her pre-authorisation is approved.",
  },

  "care-hospitals": {
    operatingContext:
      "CARE Hospitals runs multi-specialty tertiary hospitals concentrated in Hyderabad and Telangana, with a broader footprint across Andhra Pradesh, Maharashtra, Chhattisgarh, Odisha and Madhya Pradesh, and a clinical reputation built on cardiac sciences. Owned through the Quality Care India platform and now combining with Aster's India business, it is in an active consolidation phase with bed expansion as the stated growth engine. Its patients are a Telugu-dominant urban and semi-urban base plus a significant catchment from central-Indian states with fewer tertiary options, arriving through walk-ins, cardiology and oncology referrals, corporate and insurance panels, and health-checkup packages. Patient access today is largely hospital-level: reception desks, unit-specific numbers, a website with appointment requests, and outbound tele-calling for health-checkup and follow-up campaigns.",
    strategicPressure: [
      { text: "CARE Hospitals operates under the Quality Care India platform, which is combining with Aster DM Healthcare's India business into a larger listed hospital group.", kind: "verified" },
      { text: "A consolidation phase means patient-access processes, phone estates and CRM systems across multiple states must be harmonised, and doing that above the systems rather than inside them is materially faster.", kind: "inference" },
      { text: "Cardiac specialisation pulls patients from central-Indian states where tertiary cardiac care is scarce, generating out-of-region enquiry and pre-visit coordination in Hindi as well as Telugu.", kind: "inference" },
      { text: "Health-checkup package sales and post-procedure follow-up are outbound-heavy workflows likely run by small tele-calling teams whose coverage is capacity-bound rather than demand-bound.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "CARE is buy-led. It is a PE-backed clinical operator in a merger integration, where every rupee of discretionary spend competes with beds, cath labs and clinician hiring. Its IT organisation runs HIS and supporting systems; it has neither the mandate nor the staffing to build conversational infrastructure, and merger conditions make a fast-to-deploy bought layer strictly more attractive.",
    whyNotBuild:
      "The requirement spans Telugu and Hindi speech quality for elderly cardiac patients, telephony across a multi-state hospital estate with fragmented numbering, orchestration into HIS instances that are themselves being consolidated, and a clinical-safety evaluation regime. Building that during a merger would consume exactly the engineering attention the integration needs, for a capability that is not a differentiator in tertiary care.",
    workflows: [
      {
        name: "Appointment booking and unit routing across the network",
        friction: "Patients call unit-specific numbers and are transferred or told to call another hospital; consultant availability across the network is invisible to the caller and to the desk answering.",
        outcome: "A single Telugu-and-Hindi access number that finds the right specialty and consultant across units, books into live schedules and confirms with preparation instructions.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Hospital information system (HIS)", "Consultant scheduling", "CRM", "Telephony / DID estate"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Health-checkup package outreach and booking",
        friction: "Corporate and retail checkup campaigns run through small tele-calling teams working lists during office hours, so coverage is a fraction of the eligible base and conversion is not attributed.",
        outcome: "Consented, language-matched outreach that explains the package, answers cost and fasting questions, and books the checkup slot in-conversation with attributed conversion.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["CRM / campaign lists", "Health-checkup scheduling", "Billing / package master", "Consent register"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Post-discharge and post-procedure follow-up",
        friction: "Cardiac and surgical follow-up calls are made by nursing or coordinator staff as time allows, so a meaningful share of discharged patients are never contacted and review visits are missed.",
        outcome: "Every discharge triggers a structured follow-up conversation confirming medication and review booking, with red-flag responses escalated immediately to clinical staff.",
        channels: ["Voice", "WhatsApp"],
        systems: ["HIS discharge record", "Consultant scheduling", "Nursing escalation desk", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Hospital reception and unit-level appointment desks",
        "Website appointment-request forms and enquiry capture",
        "Outbound tele-calling teams for health-checkup packages and follow-up",
        "SMS and WhatsApp appointment confirmations",
      ],
      gaps: [
        "No single network-wide number that can book across specialties and units",
        "Out-of-region enquiries in Hindi from central-India catchments are served inconsistently",
        "Follow-up coverage after discharge is capacity-limited and largely unrecorded",
        "Checkup-campaign conversion is not attributable to the outreach that produced it",
      ],
    },
    risks: [
      "Clinical-advice boundary with cardiac patients is safety-critical: chest-pain, breathlessness and medication questions must route immediately to clinical staff, never be answered by the agent.",
      "DPDP Act obligations on health data across a merging entity — consent, purpose limitation and retention need to survive the integration of two patient databases.",
      "TRAI DND and commercial-communication rules apply squarely to health-checkup package outreach, which is promotional and must be consent-anchored and time-window compliant.",
    ],
    economics: {
      volumeMonthly: 260000,
      costPerInteraction: 1.0,
      automationRate: 0.45,
      basis: "Seller assumptions from bed count and typical tertiary-hospital contact intensity; real inbound volume, tele-calling capacity and cost per contact must be established with CARE operations during discovery, particularly given merger-driven change.",
    },
    pilotScope:
      "An 8-week pilot on the Hyderabad cluster taking all inbound appointment calls in Telugu, Hindi and English on one number, booking live into the HIS and routing clinical questions to staff.",
    expansion: [
      "Extend to Andhra Pradesh, Maharashtra and central-India units, and align with the merged group's patient-access design.",
      "Add consented health-checkup package outreach with in-conversation booking and attributed conversion.",
      "Add structured post-discharge follow-up with clinical escalation and review-visit booking.",
    ],
    stakeholders: [
      "Chief Executive Officer, Hospitals",
      "Chief Operating Officer / Regional COO",
      "Chief Information Officer",
      "Head of Patient Experience / Patient Access",
      "Head of Marketing and Preventive Health (checkup business)",
    ],
    discovery: [
      "How many phone numbers does the network publish, and what share of inbound calls need at least one transfer to reach the right desk?",
      "Under the merged structure, who will own patient-access technology decisions and on what timeline?",
      "What is the current outbound tele-calling capacity for health checkups versus the size of the eligible base?",
      "What share of discharged cardiac patients receives a follow-up call today, and is that recorded anywhere queryable?",
    ],
    flowTemplate: "appointments",
    scenario: "A family in Raipur calls CARE in Hindi to find a cardiac slot in Hyderabad and gets the consultant, date and document list in one conversation.",
  },

  "dr-agarwals-eye-hospital": {
    operatingContext:
      "Dr Agarwal's Health Care operates one of the world's larger eye-care networks — a high-volume chain of eye hospitals and vision centres spread across most Indian states, with particular density in Tamil Nadu and the south, plus a substantial African footprint. The clinical model is throughput-driven: outpatient refraction and consultation funnels into elective procedures, predominantly cataract surgery, alongside refractive surgery, retina and glaucoma services, with an optical and lens retail attachment. Because most of its procedures are elective and scheduled, revenue depends less on emergency demand than on how many counselled patients actually convert to a surgery date and turn up for it. Patients reach it through hospital and vision-centre reception, a central enquiry line, a website and app, and camp-based outreach that generates large batches of screened leads needing follow-up.",
    strategicPressure: [
      { text: "Dr Agarwal's is a listed, high-volume eye-care chain operating across many Indian states and in Africa, with cataract surgery as its dominant procedure.", kind: "verified" },
      { text: "Elective surgical conversion is the core economic lever: a counselled patient who does not book, or books and does not arrive, is pure lost theatre capacity that cannot be recovered.", kind: "inference" },
      { text: "Eye camps and community screening produce lead batches far larger than the tele-calling team can work in the days when intent is still warm.", kind: "inference" },
      { text: "Post-operative check-in calls after cataract surgery are protocol-driven and almost certainly performed inconsistently across a network of this size.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Dr Agarwal's is buy-led. It is a clinical throughput operator whose investment goes into theatres, phaco and femto equipment, new centres and clinician capacity. Its technology function runs HIS, optical retail and scheduling systems; there is no software organisation to build speech and orchestration and no clinical reason to.",
    whyNotBuild:
      "Serving Tamil, Telugu, Kannada, Hindi and Malayalam callers — many elderly, many with limited literacy — on a network-wide line, orchestrating into surgical scheduling, and proving in evaluation that the agent never gives ophthalmic advice, is a specialist programme. A chain whose growth model is opening more centres will not divert clinical capital into building it, and the guardrails matter more than the code.",
    workflows: [
      {
        name: "Counselled-patient follow-up and surgery-date conversion",
        friction: "After counselling, follow-up depends on a tele-caller working a list during office hours; working-age family decision-makers are unreachable then, so warm intent cools and the patient goes elsewhere or defers indefinitely.",
        outcome: "Timely multilingual follow-up on the family's preferred channel that answers cost, insurance, procedure and recovery-logistics questions and books the surgery date directly into theatre scheduling.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Hospital information system (HIS)", "Surgical / theatre scheduling", "Counselling and estimate records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Eye-camp and screening lead follow-up",
        friction: "Camps generate hundreds of screened contacts at once; the calling team works a fraction of them, and the rest decay in a spreadsheet with no record of why they did not convert.",
        outcome: "Every camp lead contacted within a day in the local language, qualified for clinical urgency, and booked into the nearest centre with the drop-off reasons captured.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Camp / screening lead capture", "CRM", "Centre appointment scheduling", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-operative preparation and post-operative check-in",
        friction: "Pre-op instructions on fasting, medication and attendant requirements are given verbally and forgotten, causing day-of-surgery cancellations; post-op check-ins are inconsistent across centres.",
        outcome: "Structured pre-op readiness confirmation the day before, and a protocol post-op check-in that captures recovery concerns and escalates anything clinical to the treating team.",
        channels: ["Voice", "WhatsApp"],
        systems: ["HIS surgical record", "Theatre scheduling", "Clinical escalation desk", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Hospital and vision-centre reception plus a central enquiry line",
        "Website and app for appointment requests and centre locator",
        "Tele-calling teams working counselling and camp-generated leads",
        "SMS and WhatsApp appointment reminders",
      ],
      gaps: [
        "Counselled patients are not followed up fast enough or outside working hours to hold surgical intent",
        "Camp lead batches exceed calling capacity, so most screened patients are never contacted",
        "Pre-operative readiness is not systematically confirmed, so day-of cancellations persist",
        "Post-operative check-in coverage varies by centre with no network-level measurement",
      ],
    },
    risks: [
      "Ophthalmic clinical-advice boundary: symptoms, vision changes, post-op complications and medication questions must escalate to clinical staff, never be handled by the agent.",
      "DPDP Act obligations on patient data, with particular care where camp and screening leads are captured in community settings and consent quality is variable.",
      "TRAI DND and commercial-communication rules on surgery-conversion outreach, which is commercially motivated and must be consented and time-window compliant.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions from network centre count and elective-surgery funnel patterns; counselling volume, camp lead batch sizes and current tele-calling cost per contact must all be validated in discovery.",
    },
    pilotScope:
      "A 10-week pilot across Tamil Nadu centres following up counselled cataract patients in Tamil and English within 24 hours, booking surgery dates into theatre scheduling, measured against a matched control on conversion.",
    expansion: [
      "Extend to Telugu, Kannada, Malayalam and Hindi centres and add camp and screening lead follow-up at batch scale.",
      "Add pre-operative readiness confirmation and day-of-surgery cancellation reduction.",
      "Add post-operative protocol check-ins with clinical escalation, and optical and lens re-purchase reminders.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer, Hospitals",
      "Head of Information Technology",
      "Head of Marketing and Patient Acquisition",
      "Regional Clinical Head (escalation governance)",
    ],
    discovery: [
      "What share of counselled cataract patients convert to a booked surgery date, and how quickly is the first follow-up made today?",
      "How many leads does a typical eye camp generate, and what proportion are actually called within a week?",
      "Can theatre and surgical scheduling accept a booking from an external system, or is it manual entry at the centre?",
      "What is the current day-of-surgery cancellation rate and how much of it traces to pre-operative preparation failures?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A counselled cataract patient's son is reached in Tamil at 8pm, gets the cost and recovery answers he needs, and books his mother's surgery for Friday.",
  },

  "lemon-tree-hotels": {
    operatingContext:
      "Lemon Tree Hotels operates one of India's largest mid-market hotel networks, spanning the Aurika, Lemon Tree Premier, Lemon Tree and Red Fox brands across metros, tier-2 cities and increasingly smaller towns, with a deliberately growing share of managed and franchised properties rather than owned assets. Its guests are dominated by domestic business travellers, corporate accounts booking through negotiated rates, and weekend and event-driven leisure demand, with a meaningful crew and group-contract layer. The commercial fight is over channel mix: every booking that arrives through an online travel agency carries a commission that a direct booking does not, so direct-channel capture is a first-order margin issue. Guests reach it today through a brand website and app, a central reservations line, property front desks, an established loyalty programme, and the OTA channels themselves.",
    strategicPressure: [
      { text: "Lemon Tree operates a multi-brand mid-market portfolio across India and is expanding materially through managed and franchised properties rather than owned hotels.", kind: "verified" },
      { text: "OTA commissions are a structural margin cost for mid-market hotels, making direct-booking share a metric management actively manages.", kind: "verified" },
      { text: "An asset-light expansion model means new properties join with local front-desk teams and inconsistent service depth — a central conversational layer becomes the only way to hold a common standard.", kind: "inference" },
      { text: "Reservation changes, early check-in requests and small in-stay service requests likely swamp property front desks at exactly the hours they are also handling arrivals.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Lemon Tree is buy-led. It is a hotel operating company: its capital and management attention go to property pipeline, brand standards, and operating margins per key. Technology is procured — property management system, central reservations, revenue management, loyalty — and integrated, not built. There is no engineering organisation that could take on conversational infrastructure.",
    whyNotBuild:
      "Direct-booking capture requires an agent that can quote live availability and rate, take a booking, and handle modification within revenue-management rules across dozens of properties on different PMS instances, in Hindi and English, on voice and WhatsApp, 24/7. That is telephony, orchestration, speech and evaluation as a permanent function — nothing about it makes a hotel better at hospitality, and the ROI case is precisely that it costs less than the commission it displaces.",
    workflows: [
      {
        name: "Direct-booking capture and rate enquiry",
        friction: "Guests who call a property to check availability get whoever answers the front desk between check-ins; after hours the call is unanswered and the guest completes the booking on an OTA instead.",
        outcome: "A 24/7 conversational booking surface that quotes live availability and rate, applies loyalty benefits, and completes the booking directly — shifting share away from commissioned channels.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Central reservation system (CRS)", "Property management system (PMS)", "Revenue management", "Loyalty programme", "Payments"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Reservation modification and pre-arrival service",
        friction: "Date changes, early check-in and late check-out requests, airport-transfer bookings and special requests all require a human at the property, and the guest often has to repeat the request on arrival.",
        outcome: "Modifications and pre-arrival requests handled in-channel against live inventory and policy, written into the PMS so the front desk sees them before the guest walks in.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["PMS", "CRS", "Housekeeping / service-request workflow", "Loyalty programme"],
        value: 2,
        complexity: 2,
      },
      {
        name: "In-stay service requests and post-stay feedback",
        friction: "In-stay requests go through a front-desk phone that is busy at peak; feedback is collected by survey link after departure, when a fixable problem is already a review.",
        outcome: "Guest requests captured conversationally and routed straight to housekeeping or maintenance queues, with in-stay sentiment surfaced early enough for the duty manager to recover the stay.",
        channels: ["WhatsApp", "Voice", "In-room QR"],
        systems: ["PMS", "Housekeeping / maintenance task system", "Guest-feedback platform", "Duty-manager escalation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand website and mobile app with direct booking",
        "Central reservations telephone line plus property-level front-desk numbers",
        "An established guest loyalty programme with member rates and benefits",
        "Post-stay feedback surveys and review-platform monitoring",
      ],
      gaps: [
        "Availability and rate questions cannot be answered conversationally at night, when leisure booking intent is high",
        "Reservation modifications require reaching a human at the property or the reservations desk",
        "In-stay requests are not tracked to closure with any measurable service level",
        "Managed and franchised properties deliver inconsistent responsiveness against the brand standard",
      ],
    },
    risks: [
      "DPDP Act obligations on guest personal data, plus hotel guest-registration and identity-record requirements that vary by state and must be handled at check-in, not by the agent.",
      "Payment handling must stay tokenised and PCI-compliant — the agent must never capture card data conversationally, only issue secure payment links.",
      "Rate and inventory integrity: any agent quoting price must be bound to revenue-management rules and OTA rate-parity commitments, with overrides restricted to humans.",
    ],
    economics: {
      volumeMonthly: 320000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions from portfolio size and mid-market hotel contact patterns; reservations-line volume, property-level call load and the true cost of a commissioned booking versus a direct one must be quantified with commercial leadership in discovery.",
    },
    pilotScope:
      "A 10-week pilot on the central reservations line for the Delhi NCR and Bengaluru property cluster, handling availability, rate and booking conversations in Hindi and English against live CRS inventory.",
    expansion: [
      "Extend to all owned and managed properties nationally and add reservation modification and pre-arrival service requests written into the PMS.",
      "Add loyalty-member recognition, member-rate application and consented re-booking outreach to past guests.",
      "Extend to franchised properties as a brand-standard service layer, with in-stay request routing and duty-manager escalation.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Commercial Officer / Head of Revenue and Distribution",
      "Chief Information Officer / Head of Technology",
      "Head of Operations (owned and managed properties)",
      "Head of Loyalty and Guest Experience",
    ],
    discovery: [
      "What is the current direct-booking share, and what commission rate is being paid on the OTA share you most want to displace?",
      "How many calls reach property front desks versus central reservations, and what happens to them after 10pm?",
      "Are all properties on a single PMS and CRS instance, or does the managed and franchised estate fragment that?",
      "Which reservation modifications can be executed by policy without human approval, and where does revenue management need to hold control?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A traveller calls a Lemon Tree number at 11pm, gets live rates for tomorrow in Hindi, applies her loyalty benefit and books direct instead of on an OTA.",
  },

  "itc-hotels": {
    operatingContext:
      "ITC Hotels, demerged from ITC and separately listed, operates a luxury and upper-upscale portfolio spanning the ITC Hotels luxury collection, Welcomhotel, Storii and Mementos brands, with an increasingly managed-contract growth model alongside its owned landmark properties. It is distinctive in India for the strength of its food and beverage business — several of its restaurant brands are destinations in their own right, generating dining reservations from people who are not hotel guests at all — and for a large banqueting, weddings and MICE business where a single enquiry can be worth crores. Guests and enquirers reach it through brand websites, a loyalty programme, central reservations, hotel front desks, restaurant reservation lines and event sales teams. As a newly standalone listed company, its margins and capital efficiency are now scrutinised on their own rather than inside a conglomerate.",
    strategicPressure: [
      { text: "ITC Hotels was demerged from ITC and separately listed, making it a standalone hospitality company judged on its own operating metrics.", kind: "verified" },
      { text: "Its food and beverage and banqueting businesses are unusually strong for an Indian hotel group, generating substantial reservation and enquiry traffic independent of room occupancy.", kind: "verified" },
      { text: "Standalone listing raises the bar on cost-to-serve and on direct-channel revenue, since there is no longer a diversified parent absorbing the hospitality cycle.", kind: "inference" },
      { text: "High-value wedding and MICE enquiries are likely handled by sales teams with slow first-response times, where the first hotel to respond substantively wins a disproportionate share.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "ITC Hotels is buy-led. Post-demerger the organisation is focused on establishing standalone operating performance, brand investment and the managed-hotel pipeline. Technology is procured and integrated — PMS, CRS, revenue management, POS, loyalty — and the newly separated technology function is occupied with disentangling shared services rather than building a conversational platform.",
    whyNotBuild:
      "A luxury operator's tolerance for a bad automated interaction is near zero, which makes the evaluation and escalation design harder, not easier, than in mid-market. Building would require multilingual speech at a standard that will not embarrass a luxury brand, orchestration across PMS, restaurant POS reservation systems and event-sales CRM, and continuous quality scoring. That is a permanent specialist function with no hospitality differentiation, competing for attention with post-demerger integration.",
    workflows: [
      {
        name: "Restaurant reservations and dining enquiry",
        friction: "Destination-restaurant reservation lines are busiest at exactly the times the outlet is serving, so calls go unanswered or are handled by whoever is nearest the phone; menu, dietary and event questions need a callback.",
        outcome: "Dining reservations taken and modified conversationally against live table inventory, with grounded answers on menus, timings and dietary handling, and covers protected across every outlet.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Restaurant reservation / table-management system", "Restaurant POS", "PMS guest profile", "Loyalty programme"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Room reservations, modification and pre-arrival preferences",
        friction: "Central reservations and hotel desks handle availability, rate and change requests manually; loyalty benefits and stored guest preferences are applied only when a human remembers to look.",
        outcome: "24/7 reservation and modification handling that recognises the loyalty member, applies entitlements and captures pre-arrival preferences into the guest profile before arrival.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Central reservation system (CRS)", "Property management system (PMS)", "Revenue management", "Loyalty programme"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Banquet, wedding and MICE enquiry qualification",
        friction: "High-value event enquiries arrive by phone, form and email into sales inboxes and wait for a sales manager to respond, often days later, by which time a competing venue has already met the client.",
        outcome: "Every event enquiry engaged within minutes to capture date, guest count, format and budget band, checked against banquet availability and routed to the right sales manager with a qualified brief.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Event / banquet sales CRM", "Banquet space availability calendar", "PMS", "Proposal and quotation templates"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand websites and a guest loyalty programme with member recognition and benefits",
        "Central reservations plus hotel-level front desk and concierge lines",
        "Restaurant reservation lines and table-management at destination dining outlets",
        "Event and banquet sales teams handling weddings and MICE enquiries",
      ],
      gaps: [
        "Dining reservation calls go unanswered during service peaks, losing covers at premium outlets",
        "Guests cannot complete a reservation change or capture a preference outside desk hours",
        "Event enquiry first-response time depends on a sales manager's availability, not on demand",
        "Guest preference and loyalty context is not consistently applied at the moment of contact",
      ],
    },
    risks: [
      "Luxury brand tolerance: any automated interaction must meet a service standard where a clumsy exchange is itself brand damage, requiring conservative escalation thresholds and continuous quality scoring.",
      "DPDP Act obligations on guest personal data and preference profiles, plus hotel guest-registration record requirements handled at check-in rather than by the agent.",
      "Payment and rate integrity: no card capture in conversation, secure payment links only, and quoted rates bound by revenue-management and rate-parity rules with human-only overrides.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.4,
      automationRate: 0.45,
      basis: "Seller assumptions from portfolio scale and the unusually high F&B and banqueting contact load; reservations, dining and event-enquiry volumes and the current cost of handling them must be validated with commercial leadership, and the automation rate is deliberately conservative for a luxury brand.",
    },
    pilotScope:
      "A 10-week pilot taking dining reservations and enquiries for the destination restaurants at two flagship city hotels in Hindi and English, booking against live table inventory with instant escalation to the outlet team.",
    expansion: [
      "Extend to room reservations and modifications across the owned portfolio with loyalty recognition and preference capture.",
      "Add banquet, wedding and MICE enquiry qualification with routing to the right sales manager and measured first-response time.",
      "Extend the service layer to managed properties as a brand-standard capability, with regional-language coverage across the portfolio.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Operating Officer, Hotels",
      "Chief Information Officer / Head of Technology",
      "Head of Sales and Distribution (rooms, MICE and banqueting)",
      "Head of Food and Beverage Operations",
    ],
    discovery: [
      "How many dining reservation calls are missed or abandoned at the destination restaurants during peak service hours?",
      "Post-demerger, is the technology estate fully separated from ITC shared services, and who now owns CX platform decisions?",
      "What is the median first-response time on a wedding or MICE enquiry today, and how is it measured?",
      "Which reservation and rate actions can an automated agent be permitted to execute, and where must revenue management retain control?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A guest calls a flagship ITC hotel at 9pm to book a table at its signature restaurant for six, notes a dietary requirement, and gets instant confirmation.",
  },

  "eih-oberoi": {
    operatingContext:
      "EIH Limited operates The Oberoi and Trident brands — a deliberately small portfolio of luxury and upper-upscale hotels, palace properties, Nile and Kerala cruisers, and an airline flight-catering business — with a service reputation that is the entire asset. Its guests skew heavily toward high-net-worth international leisure travellers, inbound tour operators and luxury travel advisors booking on behalf of clients, plus premium corporate and diplomatic business in Delhi and Mumbai. Because the portfolio is small and each property is individually famous, a single poor pre-arrival interaction carries disproportionate reputational cost; conversely, the guest base has high repeat rates and long relationships with named staff. Contact today runs through brand websites, a central reservations office, property reservation and concierge desks, luxury-consortia and travel-advisor channels, and email threads with returning guests.",
    strategicPressure: [
      { text: "EIH operates the Oberoi and Trident brands as a small, premium-positioned portfolio where service reputation rather than scale is the competitive asset.", kind: "verified" },
      { text: "A high share of demand is international and advisor-mediated, which means enquiries arrive across time zones and outside Indian business hours.", kind: "inference" },
      { text: "With few properties, the marginal value of every enquiry converted is very high — a lost pre-arrival enquiry is not recoverable from a larger inventory pool elsewhere in the estate.", kind: "inference" },
      { text: "Concierge and pre-arrival coordination is likely handled through email and personal relationships, meaning the operational knowledge is in individuals rather than systems.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "EIH is buy-led. It is a hospitality operator with a service culture rather than a technology culture; its systems — PMS, central reservations, guest-profile and CRM tools — are procured. A portfolio of this size cannot amortise an engineering organisation, and there is no plausible internal path to building speech, telephony and orchestration.",
    whyNotBuild:
      "The bar here is the hardest in Indian hospitality: an automated interaction must be good enough that a luxury guest does not notice the seam. Meeting it needs speech quality across international accents, orchestration into PMS and guest profiles, and — decisively — an evaluation and escalation regime that catches nuance and hands to a human early. That regime is the product; EIH's right answer is to buy something already proven and tune the escalation thresholds conservatively.",
    workflows: [
      {
        name: "Reservation enquiry and availability across time zones",
        friction: "International guests and travel advisors enquire outside Indian working hours and receive an acknowledgement rather than an answer; by the time reservations responds the client has been shown an alternative property.",
        outcome: "Immediate, correctly-toned response at any hour with live availability and rate context, capturing the enquiry fully and handing to a reservations specialist with a complete brief.",
        channels: ["Voice", "Email", "Web chat"],
        systems: ["Central reservation system (CRS)", "Property management system (PMS)", "Revenue management", "Guest-profile / CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-arrival coordination and guest-preference capture",
        friction: "Airport transfers, dining preferences, celebration arrangements and special requests are agreed over scattered email threads, so the property learns of them late and the guest repeats them on arrival.",
        outcome: "A single structured pre-arrival conversation that confirms logistics, records preferences into the guest profile, and pushes the resulting tasks to concierge, housekeeping and F&B before check-in.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["PMS guest profile", "Concierge / task management", "Housekeeping and F&B request routing", "Transfer and transport vendors"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Travel-advisor and tour-operator desk",
        friction: "Luxury travel advisors and inbound operators need rate, availability and amenity confirmations quickly to close a client, but queue behind guest calls at the reservations office.",
        outcome: "A recognised advisor channel that answers availability, contracted-rate and amenity questions instantly and escalates commercial exceptions to the sales team with context.",
        channels: ["Voice", "Email", "WhatsApp"],
        systems: ["CRS contracted rates", "Travel-trade account records", "Revenue management", "Sales CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand websites with direct booking for Oberoi and Trident properties",
        "Central reservations office plus property reservation and concierge desks",
        "Guest-profile records supporting recognition of returning guests",
        "Relationships with luxury consortia, travel advisors and inbound tour operators",
      ],
      gaps: [
        "Enquiries arriving outside Indian hours receive acknowledgement rather than a substantive answer",
        "Pre-arrival preferences live in email threads rather than in the guest profile",
        "Travel advisors have no fast self-service route for routine availability and rate confirmations",
        "Concierge knowledge is held by individuals, so service depth varies with who is on duty",
      ],
    },
    risks: [
      "Brand tolerance is the binding constraint — escalation thresholds must be set so conservatively that the agent hands to a human at the first sign of nuance, and every interaction must be quality-scored.",
      "DPDP Act and cross-border data considerations for international guest data, plus hotel guest-registration and foreigner-registration requirements that remain human and property-side.",
      "No card capture in conversation; payment strictly by secure tokenised link, and quoted rates bound by revenue-management and contracted-rate rules.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 1.6,
      automationRate: 0.35,
      basis: "Seller assumptions reflecting a small luxury portfolio with high-value, low-volume contact; automation is set deliberately low because most luxury interactions should end with a human. Reservations and concierge contact volumes must be validated with EIH commercial leadership.",
    },
    pilotScope:
      "An 8-week pilot handling after-hours reservation enquiries for two Delhi and Mumbai properties in English and Hindi — capturing the enquiry, giving live availability, and handing a complete brief to the reservations specialist at the start of the Indian working day.",
    expansion: [
      "Add structured pre-arrival coordination with preference capture written into the guest profile and tasks routed to concierge and housekeeping.",
      "Extend to leisure and palace properties with international-accent coverage and consortia-rate awareness.",
      "Stand up the travel-advisor and tour-operator desk with account recognition and contracted-rate answers.",
    ],
    stakeholders: [
      "Chief Executive Officer / Executive Chairman's office",
      "Chief Operating Officer, Hotels",
      "Head of Information Technology",
      "Head of Sales and Reservations",
      "Corporate Head of Guest Experience / Brand Standards",
    ],
    discovery: [
      "What happens to a reservation enquiry that arrives at 3am Indian time from a US or European guest today?",
      "Where do pre-arrival preferences live — in the guest profile, or in the reservations mailbox?",
      "What quality bar would brand leadership set before allowing any automated interaction to carry the Oberoi name?",
      "How much of the reservations team's day is spent on routine availability confirmations for travel advisors?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A London travel advisor enquires at 2am Indian time about a suite for a client's anniversary and gets live availability plus a specialist follow-up brief.",
  },

  "mahindra-holidays": {
    operatingContext:
      "Mahindra Holidays & Resorts India runs Club Mahindra, India's largest vacation-ownership business, alongside a network of owned and leased resorts across hill stations, beaches, wildlife destinations and heritage towns, plus an overseas resort footprint. Its economics are unusual: members buy a multi-year membership up front, often financed on EMI, and then pay an annual subscription fee for the life of the membership — so the business runs a permanent, large-scale receivables and renewal operation alongside a resort-booking operation. Members interact constantly: booking holiday dates against seasonal inventory, requesting date changes, asking about entitlement balances, querying annual-fee invoices, and being pursued for overdue fees and EMIs. Contact today runs through a member app and portal, a central member-services helpline, resort-level desks, and outbound tele-calling teams for collections and upgrade sales.",
    strategicPressure: [
      { text: "Club Mahindra's vacation-ownership model generates recurring annual subscription fees from a large multi-year member base, alongside up-front membership sales often financed on EMI.", kind: "verified" },
      { text: "Annual-fee collection across a very large member base is a permanent, calendar-driven outbound operation whose coverage is limited by tele-calling headcount rather than by the size of the due book.", kind: "inference" },
      { text: "Holiday-booking demand concentrates violently around school holidays and long weekends, so member-services capacity is mismatched to demand for most of the year.", kind: "inference" },
      { text: "Member dissatisfaction in vacation ownership typically centres on availability at peak dates; handling those conversations well is a retention lever as much as a service one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Mahindra Holidays is buy-led. It is a resort operator and membership business inside the Mahindra group; its technology function procures and integrates a membership and receivables system, a resort booking engine, PMS at properties and a member app. The group's software capability sits in entirely different companies, and this business unit buys its customer-communication tooling.",
    whyNotBuild:
      "The collections half alone requires policy-timed outbound in Hindi, Tamil, Marathi and English within TRAI-permitted windows, payment links in-channel, and write-back of promises to pay into the receivables system — a regulated, auditable capability. Adding conversational booking against seasonal resort inventory doubles the orchestration surface. That is a specialist platform commitment for a hospitality business whose competitive assets are resorts and member experience.",
    workflows: [
      {
        name: "Annual subscription-fee collections and EMI follow-up",
        friction: "Outbound calling teams work overdue lists during office hours; coverage is a fraction of the due book, offers and instalment arrangements vary by caller, and promises to pay are captured in free-text notes with no automatic follow-up.",
        outcome: "Every due and overdue member contacted within permitted windows in their language, with balance and invoice detail grounded from the receivables system, a payment link issued in-channel, and promises written back with automated follow-up.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Membership and receivables / subscription billing system", "Payment gateway", "CRM", "Consent and DND register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Holiday booking, date change and entitlement queries",
        friction: "Peak-season booking requests overwhelm member services; members wait on hold to be told a resort is unavailable, and alternatives are offered only if the agent thinks to look.",
        outcome: "Members check entitlement balance, see live availability across resorts and dates, book or change holidays conversationally, and are offered viable alternatives automatically when the first choice is full.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Resort booking / inventory system", "Membership entitlement records", "Property management system (PMS)", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Membership renewal, upgrade and win-back outreach",
        friction: "Renewal and upgrade conversations depend on tele-sales capacity and are pitched from a script rather than from the member's actual usage history, so relevance and conversion are both poor.",
        outcome: "Consented outreach informed by usage and entitlement history that opens a real conversation, answers the member's actual objection, and routes genuine upgrade intent to a human seller.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Membership records and usage history", "CRM / campaign engine", "Sales workflow", "Consent register"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Member app and web portal for holiday booking and entitlement viewing",
        "Central member-services helpline plus resort-level guest desks",
        "Outbound tele-calling teams for annual-fee collections and upgrade sales",
        "SMS and email invoice, reminder and booking-confirmation notifications",
      ],
      gaps: [
        "The overdue member base exceeds what the calling team can cover each cycle",
        "Peak-season booking and date-change requests cannot be completed without a human",
        "Alternative-resort and alternative-date offers depend on the individual agent's initiative",
        "Promises to pay are not systematically captured or automatically followed up",
      ],
    },
    risks: [
      "TRAI DND, calling-window and commercial-communication rules govern all collections and renewal outbound, including scrubbing against the DND registry and honouring opt-outs.",
      "Fair-practice expectations on collections conduct: tone, frequency and escalation must be policy-bounded, with hardship and dispute cues routed to human specialists.",
      "Consumer-protection exposure specific to vacation ownership — any statement about entitlement, availability or fee terms must be grounded in the member contract, never improvised.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions from member-base scale, annual-fee cycle intensity and booking-season peaks; the actual due book, current tele-calling capacity and cost per contact must be validated with member-services and finance leadership.",
    },
    pilotScope:
      "A 10-week pilot running annual subscription-fee reminder and collections outreach for one member cohort in Hindi, Tamil and English, with grounded balances, in-channel payment links and promise-to-pay write-back, measured on collection rate against a control cohort.",
    expansion: [
      "Extend collections to the full member base with Marathi, Telugu, Bengali and Kannada coverage and add EMI follow-up for financed memberships.",
      "Add inbound holiday booking, date change and entitlement queries against live resort inventory.",
      "Add consented renewal, upgrade and win-back outreach with routing of genuine intent to human sellers.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Financial Officer (receivables and collections ownership)",
      "Chief Information Officer / Head of Digital",
      "Head of Member Services / Customer Experience",
      "Head of Sales and Membership (renewals and upgrades)",
    ],
    discovery: [
      "How large is the annual-fee due book each cycle, and what share of due members are actually contacted by the calling team?",
      "Can the booking system expose live resort and date availability to an external conversational agent, or is it agent-screen only?",
      "How are promises to pay recorded today, and is there any automated follow-up when one is broken?",
      "What is the peak-season abandonment rate on the member-services line during school-holiday booking windows?",
    ],
    flowTemplate: "collections",
    scenario: "A Club Mahindra member in Chennai is called in Tamil about an overdue annual fee, agrees a two-instalment plan and pays the first through a link in the same call.",
  },

  "sterling-holiday-resorts": {
    operatingContext:
      "Sterling Holiday Resorts operates a network of leisure resorts across hill stations, beaches and heritage destinations in India, running a hybrid model: a legacy vacation-ownership member base inherited from its original timeshare business, plus a growing open-market leisure-hotel business selling nights to non-members through direct and OTA channels. Owned within the Fairfax-linked Thomas Cook India group, it operates under clear cost discipline and has repositioned toward filling resorts with retail leisure demand rather than relying solely on member usage. Its contact load therefore has two shapes: members asking about entitlement, bookings and annual fees — including a persistent renewal and dues-collection workload — and retail guests making and changing resort bookings, concentrated around weekends and holiday seasons. Access today runs through a member portal and app, a central reservations and member-services line, resort desks, and OTA-mediated bookings.",
    strategicPressure: [
      { text: "Sterling operates a leisure resort network combining a legacy vacation-ownership member base with an open-market hotel business, within the Thomas Cook India group under Fairfax ownership.", kind: "verified" },
      { text: "Serving two customer types — entitled members and paying retail guests — on the same reservation team creates a persistent prioritisation conflict at exactly the peak dates both want.", kind: "inference" },
      { text: "Legacy member dues and renewal collection is a recurring outbound workload that yields cash but is unattractive to staff and probably capacity-limited.", kind: "inference" },
      { text: "Fairfax-style ownership implies tight scrutiny of operating cost per booking, favouring automation with a demonstrable payback over headcount growth.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Sterling is buy-led. It is a mid-scale resort operator with no software organisation, running procured systems for reservations, PMS and membership. Under cost-disciplined ownership, discretionary spend goes to resort refurbishment and occupancy, not to platform engineering, and a bought conversational layer is the only realistic route to more coverage without more headcount.",
    whyNotBuild:
      "Doing this internally would mean running member dues outreach within TRAI calling rules, conversational booking against live resort inventory shared between members and retail guests, and payment orchestration — all in Hindi, Tamil and English. There is no engineering team to build it, no reason for a resort company to own it, and the whole appeal is converting a fixed calling-headcount cost into a variable, measured one.",
    workflows: [
      {
        name: "Member dues and renewal collection",
        friction: "Legacy member dues and renewal calls are worked from lists by a small team; most of the overdue base is never reached in a cycle and any arrangement made is inconsistently recorded.",
        outcome: "Policy-timed multilingual outreach with grounded dues detail, in-channel payment links, and structured renewal offers, with arrangements written back and automatically followed up.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Membership and dues / receivables system", "Payment gateway", "CRM", "Consent and DND register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Resort booking and date-change handling for members and retail guests",
        friction: "Booking and change requests queue on one line where members and paying guests compete; availability across the resort network is checked manually, so alternatives are rarely offered.",
        outcome: "Both member entitlement bookings and retail reservations handled conversationally against live inventory, with alternative resorts and dates proposed automatically when the first choice is full.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Central reservation system / booking engine", "Property management system (PMS)", "Membership entitlement records", "Payments"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Pre-arrival readiness and post-stay feedback",
        friction: "Guests travelling to remote hill and forest resorts call for directions, road conditions, meal-plan and activity details; feedback is collected only after departure by survey link.",
        outcome: "Proactive pre-arrival conversation covering directions, timings, meal plans and activities, plus in-stay issue capture routed to the resort manager while the stay can still be recovered.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["PMS booking record", "Resort operations / activity scheduling", "Guest-feedback platform", "Duty-manager escalation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Member portal and app for entitlement viewing and holiday booking",
        "Central reservations and member-services helpline plus resort front desks",
        "Small outbound team working member dues, renewals and upgrade offers",
        "SMS, email and WhatsApp booking confirmations and pre-arrival information",
      ],
      gaps: [
        "The overdue member base is larger than the calling team can cover in a cycle",
        "Booking and date changes cannot be completed outside reservations hours",
        "Alternative-resort suggestions depend on the individual agent, so demand is lost rather than shifted",
        "Pre-arrival logistics questions for remote resorts consistently generate avoidable inbound calls",
      ],
    },
    risks: [
      "TRAI DND, calling-window and commercial-communication rules apply to all member dues and renewal outbound, with scrubbing and opt-out honouring mandatory.",
      "Legacy vacation-ownership contracts vary by cohort, so any statement on entitlement, dues or renewal terms must be grounded in the member's specific contract rather than a generic script.",
      "Consumer-protection sensitivity around timeshare renewal selling — pressure tactics must be structurally impossible, with escalation to humans on any dispute or hardship cue.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from resort count, member-base scale and leisure booking patterns; the active member base, dues due-book and current reservations call volume must be validated with Sterling finance and member-services leadership.",
    },
    pilotScope:
      "An 8-week pilot running member dues and renewal outreach for one cohort in Hindi, Tamil and English with grounded contract-specific dues, in-channel payment links and arrangement write-back, measured on collection rate.",
    expansion: [
      "Add inbound member booking and entitlement queries against live resort inventory.",
      "Extend to retail leisure reservations and date changes with alternative-resort offers to shift demand rather than lose it.",
      "Add pre-arrival readiness conversations and in-stay issue capture with resort-manager escalation.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Financial Officer (dues and receivables)",
      "Head of Information Technology",
      "Head of Member Services and Reservations",
      "Head of Resort Operations",
    ],
    discovery: [
      "How many legacy members carry overdue dues, and what share is contacted in a typical collection cycle?",
      "Do members and retail guests share one reservations queue, and how is priority resolved at peak dates?",
      "Are entitlement terms queryable per member contract, or does the agent have to interpret the paperwork?",
      "What proportion of inbound calls to remote resorts are directions, timings and meal-plan questions?",
    ],
    flowTemplate: "collections",
    scenario: "A long-standing Sterling member in Coimbatore settles two years of pending dues in Tamil and rebooks a Munnar stay in the same conversation.",
  },

  "thomas-cook-india": {
    operatingContext:
      "Thomas Cook (India), together with SOTC and its allied travel brands under Fairfax-linked ownership, sells outbound and domestic holiday packages, group tours, foreign exchange, travel insurance, visa assistance and corporate travel management. It reaches customers through a retail branch network across Indian cities, franchised outlets, a digital booking platform, and a large travel-consultant sales force whose relationships drive package sales. The operating rhythm is intensely seasonal: summer holidays, Diwali, and year-end departures concentrate bookings, and each booking then triggers weeks of coordination — passport and visa documentation, insurance, forex loading, instalment payments, tour-departure briefings and last-minute itinerary changes. Customers contact it through branches, consultant mobile numbers, a central helpline and WhatsApp threads that individual consultants maintain.",
    strategicPressure: [
      { text: "Thomas Cook (India) operates packaged holidays, forex, visa services and corporate travel through a branch and franchise network alongside its digital channels, with SOTC as a sister brand.", kind: "verified" },
      { text: "Package travel is documentation-heavy: visa paperwork, passport validity, insurance and instalment payments must all be chased before departure, and every missed item is an escalation or a cancelled traveller.", kind: "verified" },
      { text: "Seasonal peaks mean a fixed consultant base faces multiples of normal coordination load at exactly the moments when errors are most costly.", kind: "inference" },
      { text: "Much pre-departure coordination lives in individual consultants' WhatsApp threads, so the organisation cannot see which travellers are actually document-ready.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Thomas Cook India is buy-led. It is a travel-services distributor optimising for operating leverage over a branch and consultant network; its technology is procured booking, forex and CRM systems. Under Fairfax-style ownership, capital goes to network productivity and margin, not to building conversational infrastructure, and the value case here is explicitly cost per coordination touch.",
    whyNotBuild:
      "Pre-departure chasing needs an agent that knows each traveller's document checklist, reads live visa and payment status, speaks Hindi, Gujarati, Marathi and English, works on WhatsApp and voice, and escalates anything discretionary to the consultant. Building that means owning speech, telephony, orchestration across booking and forex systems, and an evaluation harness — a permanent engineering function inside a business that deliberately runs asset- and headcount-light.",
    workflows: [
      {
        name: "Pre-departure document and payment chasing",
        friction: "Consultants chase passports, visa documents, insurance details and instalment payments by phone and WhatsApp between selling; items are missed until the departure briefing, causing last-minute scrambles and occasional drop-outs.",
        outcome: "Every booked traveller receives structured, escalating reminders tied to their specific checklist and departure date, with document status and payment confirmations tracked centrally and consultants alerted only to exceptions.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Booking / tour reservation system", "Visa documentation tracker", "Payments and instalment ledger", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Itinerary, inclusion and forex enquiry handling",
        friction: "Travellers ask the same questions repeatedly — what is included, baggage rules, forex card loading and usage, insurance cover — and each one interrupts a consultant mid-sale or waits for a branch to open.",
        outcome: "Grounded answers drawn from the actual booked itinerary and product terms, available in-channel at any hour, with forex card and insurance queries answered from the customer's own records.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Tour itinerary and product master", "Forex card platform", "Insurance policy records", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Peak-season enquiry capture and consultant handoff",
        friction: "During peak booking windows, enquiries from web, branches and campaigns exceed consultant capacity; slow first contact loses the customer to a competing operator or an OTA.",
        outcome: "Every enquiry engaged within minutes in the customer's language, qualified on destination, dates, party size and budget, and routed to the right consultant with a complete brief and a booked call slot.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management / CRM", "Tour product and departure inventory", "Consultant calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Retail branch and franchise network with travel consultants as the primary service channel",
        "Digital booking platform and websites for Thomas Cook and SOTC brands",
        "Central helpline and consultant-level mobile and WhatsApp contact",
        "Forex card platform with self-service balance and reload functions",
      ],
      gaps: [
        "Document and payment readiness before departure is not visible centrally or chased systematically",
        "Routine itinerary and inclusion questions still consume consultant selling time",
        "Peak-season enquiries exceed consultant capacity, so first-response times slip when demand is highest",
        "Coordination context sits in individual WhatsApp threads rather than in the CRM",
      ],
    },
    risks: [
      "Visa and immigration information must never be improvised — the agent may relay checklist status and documented requirements only, escalating anything interpretive to a visa specialist.",
      "DPDP Act obligations around passport, identity and payment data collected in pre-departure chasing, including retention limits on documents shared over messaging channels.",
      "TRAI DND and commercial-communication rules on promotional holiday campaigns, which must be separated from transactional pre-departure service messaging.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.3,
      automationRate: 0.5,
      basis: "Seller assumptions from branch network scale and package-travel coordination intensity across Thomas Cook and SOTC; real coordination-touch volumes, seasonal multiples and consultant time cost must be validated in discovery.",
    },
    pilotScope:
      "A 10-week pilot running pre-departure document and payment chasing for outbound group-tour departures in Hindi, Gujarati and English, tracking checklist completion centrally and escalating exceptions to consultants.",
    expansion: [
      "Add grounded itinerary, inclusion, forex and insurance enquiry handling on the same channels.",
      "Extend to peak-season enquiry capture and qualified consultant handoff across Thomas Cook and SOTC brands.",
      "Extend to corporate travel servicing — policy-compliant booking changes and traveller support for managed accounts.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer, Holidays",
      "Chief Operating Officer / Head of Retail Network",
      "Chief Information Officer / Head of Digital",
      "Head of Tour Operations and Departures",
      "Head of Customer Experience",
    ],
    discovery: [
      "How is pre-departure document readiness tracked today, and can anyone see at a glance which travellers on a departure are incomplete?",
      "What share of a consultant's day during peak season is coordination and chasing rather than selling?",
      "What is the current first-response time on a web holiday enquiry during the summer booking window?",
      "Which visa and documentation statements are safe to relay automatically, and which must always come from a specialist?",
    ],
    flowTemplate: "onboarding",
    scenario: "A family booked on a European departure gets a Gujarati WhatsApp nudge that their visa photographs and second instalment are still pending, and completes both that evening.",
  },

  "yatra-online": {
    operatingContext:
      "Yatra Online runs a consumer online travel agency alongside a corporate travel management business that has become its strategic centre of gravity, serving a large base of Indian corporate clients whose employees book flights, hotels and ground transport under company travel policies. The corporate business sells on service levels: policy enforcement, approval workflows, consolidated billing, GST-compliant invoicing and traveller support during disruption. That produces a service load quite different from consumer OTA traffic — booking changes mid-trip, cancellation and refund tracking across airline and hotel suppliers, policy-exception queries, and invoice and expense-documentation requests from finance teams. Customers reach it through a booking platform and mobile app, dedicated corporate implant and helpdesk teams, email queues and phone support.",
    strategicPressure: [
      { text: "Yatra has shifted its strategic focus toward corporate travel management alongside its consumer OTA, serving a large base of Indian corporate clients.", kind: "verified" },
      { text: "OTA and TMC economics are thin per transaction, so every avoidable human service contact directly consumes the margin on the booking that generated it.", kind: "verified" },
      { text: "Refund tracking across airline and hotel suppliers is inherently multi-party, which is why refund-status contacts recur — the customer calls repeatedly because nobody proactively tells them where the money is.", kind: "inference" },
      { text: "Corporate helpdesk SLAs are contractual, so service failures during disruption events threaten account renewal rather than just satisfaction scores.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Yatra is partner-led. It is genuinely digital-native with real engineering capability, but that capability is directed at the booking platform, supplier connectivity, policy engines and corporate reporting — the things clients buy. Conversational service infrastructure is adjacent to that core, and a partner-delivered layer that plugs into existing systems is a faster path than diverting platform engineers.",
    whyNotBuild:
      "Yatra could build parts of this, but not economically: multilingual speech, carrier-grade telephony, and an evaluation harness for a customer-facing agent are all specialist commitments that would compete directly with roadmap work its corporate clients are paying for. The right split is Yatra owning policy, supplier integration and the booking core, and a partner owning the conversational and voice layer above it.",
    workflows: [
      {
        name: "Corporate booking changes and cancellations",
        friction: "A traveller whose meeting moves calls or emails the helpdesk, waits for an agent to check fare rules and policy, and gets a change confirmed hours later — often after the fare has moved.",
        outcome: "Change and cancellation requests handled conversationally against live fare rules and the client's travel policy, executed within policy and escalated to a human only when an exception is required.",
        channels: ["Voice", "WhatsApp", "App", "Email"],
        systems: ["Booking platform / GDS connectivity", "Corporate travel policy engine", "Approval workflow", "Supplier fare rules"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refund status and settlement tracking",
        friction: "Refunds pass through airline and hotel supplier queues; travellers and corporate finance teams call repeatedly because the status is opaque, and each call requires an agent to check multiple supplier systems.",
        outcome: "Live grounded refund status on demand plus proactive stage notifications to the traveller and the client finance contact, removing the reason to chase.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Refund and settlement ledger", "Supplier / airline refund queues", "Payments reconciliation", "Corporate account records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Disruption support and in-trip traveller assistance",
        friction: "When flights are cancelled, corporate helpdesk volume spikes far beyond staffed capacity, and travellers stranded at airports wait in queues behind routine enquiries.",
        outcome: "Affected travellers contacted proactively with rebooking options within policy, and inbound disruption contacts absorbed elastically with complex itineraries routed straight to specialists.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Booking / PNR records", "Airline schedule and disruption feeds", "Travel policy engine", "Hotel and ground-transport suppliers"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Consumer and corporate booking platform with mobile app and self-service changes",
        "Dedicated corporate helpdesk and implant teams with contractual service levels",
        "Travel-policy enforcement and approval workflows for corporate clients",
        "Email and phone support queues for post-booking servicing",
      ],
      gaps: [
        "Refund status is not proactively communicated, so chasing contacts recur across the refund lifecycle",
        "Change requests outside helpdesk hours wait, even when they are within policy and executable",
        "Disruption-event volume exceeds staffed capacity precisely when service matters most contractually",
        "Corporate finance teams have no self-service route for invoice and GST documentation queries",
      ],
    },
    risks: [
      "Contractual corporate SLAs mean an automated layer must have provable performance and audit trails, not just deflection statistics.",
      "DPDP Act obligations on traveller personal data held on behalf of corporate clients, where the client is often the data fiduciary and Yatra the processor — consent and purpose limits flow from the client contract.",
      "Fare rules, supplier penalties and GST invoicing are financially exact; the agent must be bound to system-of-record values with no improvisation on refund amounts or tax treatment.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions from combined consumer and corporate servicing volumes; the actual helpdesk contact load, refund-status share and per-contact cost must be validated against Yatra's own service analytics in discovery.",
    },
    pilotScope:
      "A 10-week pilot handling refund-status and cancellation queries for corporate clients in Hindi and English, grounded in the refund ledger with proactive stage notifications to travellers and client finance contacts.",
    expansion: [
      "Add policy-bounded booking changes with automatic execution inside policy and human escalation for exceptions.",
      "Add disruption-event proactive rebooking with elastic inbound absorption for affected corporate travellers.",
      "Extend to consumer OTA servicing and to corporate finance queries on invoices and GST documentation.",
    ],
    stakeholders: [
      "Chief Executive Officer / President, Corporate Travel",
      "Chief Technology Officer",
      "Head of Customer Service / Corporate Helpdesk Operations",
      "Head of Corporate Account Management",
      "Chief Financial Officer (cost per transaction)",
    ],
    discovery: [
      "What share of corporate helpdesk contacts are refund-status chasers, and how many times does a typical refund get chased?",
      "Which booking changes are executable within policy without human review, and what does the policy engine already expose?",
      "During a major disruption event, what multiple of normal volume hits the helpdesk and how is it currently absorbed?",
      "Do corporate contracts specify service levels that an automated layer would need to evidence in audit?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A corporate traveller stranded by a cancelled Delhi flight is offered two policy-compliant rebooking options on WhatsApp before she reaches the service desk.",
  },

  "easemytrip": {
    operatingContext:
      "EaseMyTrip is an Indian online travel agency built around an unusually lean cost structure, historically differentiating on convenience-fee positioning and profitability rather than on discount-fuelled growth. Its volume is dominated by domestic air ticketing, with hotels, rail, bus, holiday packages and outbound air as adjacent lines, sold through a website, mobile app and a network of agent and franchise partners. Because air ticketing is its core, its service load is dictated by airline behaviour: schedule changes, cancellations, refund processing timelines and date-change fare rules generate the overwhelming majority of contacts, and they arrive in bursts whenever an airline event occurs. Customers reach it through the app and website self-service, a customer-care helpline, email and social channels, with franchise partners raising issues on behalf of their own customers.",
    strategicPressure: [
      { text: "EaseMyTrip operates as a profitability-focused Indian OTA with domestic air ticketing as its dominant volume driver, sold through its app, website and partner network.", kind: "verified" },
      { text: "Refund and cancellation servicing is structurally the largest support cost in air-led OTA models because the refund depends on the airline's own processing timeline.", kind: "verified" },
      { text: "A lean cost structure means support headcount is deliberately constrained, so airline disruption events create service cliffs rather than gradual queue growth.", kind: "inference" },
      { text: "Franchise and agent partners likely generate a distinct, higher-frequency support stream that competes with end-consumer contacts on the same lines.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "EaseMyTrip is partner-led. It has real product and engineering capability, but that capability is deliberately concentrated on the booking funnel and conversion — the machinery that produces its margin. Support infrastructure is a cost centre it manages tightly rather than invests in, which makes a partner-delivered conversational layer with usage-linked economics a natural cultural fit and a build a poor one.",
    whyNotBuild:
      "Building means owning speech, telephony that can absorb a ten-times spike on an airline cancellation day, orchestration into PNR and refund ledgers, and a quality-evaluation regime — a fixed engineering and operations commitment inside a company whose entire identity is refusing fixed costs that do not convert. Buying converts the same outcome into a variable cost that scales with the spike and shrinks with it.",
    workflows: [
      {
        name: "Refund status and cancellation handling",
        friction: "Customers cancel and then call repeatedly because the refund timeline depends on the airline; each call is a human reading the same status, and dissatisfaction shows up in public reviews.",
        outcome: "Grounded refund status on demand plus automatic stage notifications when the airline processes and when funds are remitted, collapsing repeat contacts on a single booking.",
        channels: ["Voice", "WhatsApp", "App", "Email"],
        systems: ["Booking / PNR records", "Refund and settlement ledger", "Airline refund queues", "Payment gateway reconciliation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Schedule-change and date-change support",
        friction: "Airline schedule changes trigger inbound bursts; each customer needs fare-rule interpretation and rebooking options, and the lean support team cannot absorb the peak.",
        outcome: "Affected passengers notified proactively with the available options and fare implications, and changes executed in-channel within airline rules, with complex itineraries routed to specialists.",
        channels: ["WhatsApp", "Voice", "App", "SMS"],
        systems: ["PNR and booking records", "Airline schedule-change feeds", "Fare rules engine", "Payments"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Agent and franchise partner support desk",
        friction: "Partner agents raising issues for their own customers queue on the same lines as consumers, and their higher query frequency crowds out end-customer service at peak.",
        outcome: "A recognised partner channel that resolves booking, refund and commission-status queries from the partner ledger and escalates commercial matters to account managers.",
        channels: ["Voice", "WhatsApp", "Web portal"],
        systems: ["Partner / agent account ledger", "Booking records", "Commission and settlement records", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Mobile app and website with self-service cancellation and booking management",
        "Customer-care helpline plus email and social-media support channels",
        "Automated booking, cancellation and refund-initiation notifications by SMS and email",
        "Agent and franchise partner portal for partner-originated bookings",
      ],
      gaps: [
        "Refund progress is not proactively communicated after initiation, so customers chase repeatedly",
        "Disruption-day contact spikes exceed the lean support team's absorbable capacity",
        "Date-change options and fare implications require a human to explain before the customer can act",
        "Partner agents have no separated service path despite a distinct query profile",
      ],
    },
    risks: [
      "Refund amounts, cancellation charges and fare rules are financially exact and airline-determined — the agent must quote only system-of-record values and never estimate.",
      "DPDP Act obligations on traveller identity and payment data, with identity verification required before disclosing any booking or refund detail.",
      "TRAI DND and commercial-communication rules separate transactional booking messages from promotional fare campaigns; disruption notifications must be structured as transactional.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions from air-led OTA transaction and servicing patterns; actual contact volume, repeat-contact ratio per refund and current cost per contact must be validated with EaseMyTrip customer-care leadership in discovery.",
    },
    pilotScope:
      "An 8-week pilot handling refund-status and cancellation contacts in Hindi and English across voice and WhatsApp, grounded in the refund ledger with automatic stage notifications, measured on repeat contacts per refund.",
    expansion: [
      "Add proactive schedule-change notification with in-channel rebooking options and fare-rule grounding.",
      "Add elastic disruption-day absorption with specialist routing for complex and international itineraries.",
      "Stand up the agent and franchise partner desk with account recognition and commission-status answers.",
    ],
    stakeholders: [
      "Chief Executive Officer / Founder",
      "Chief Technology Officer / Head of Product",
      "Head of Customer Support Operations",
      "Head of Airline and Supplier Relations",
      "Chief Financial Officer (cost per contact)",
    ],
    discovery: [
      "How many contacts does a single refund generate on average from initiation to credit?",
      "On a major airline cancellation day, what multiple of normal volume arrives and what is the abandonment rate?",
      "Can the refund ledger expose live airline processing stage, or does support check the airline portal manually?",
      "What share of contacts come from franchise and agent partners rather than end consumers?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A passenger whose Mumbai flight is cancelled gets a WhatsApp message with two rebooking options and the exact refund amount before she opens the app.",
  },

  "dlf": {
    operatingContext:
      "DLF is India's largest listed real-estate developer by market capitalisation, with a residential development business concentrated in the premium and luxury segments — heavily anchored in Gurugram and the wider Delhi NCR, with a growing presence in Chennai, Chandigarh tri-city and Mumbai — alongside a substantial rental portfolio of offices and retail malls held largely through its DLF Cyber City joint venture. Its residential model is launch-driven: a project launch generates an intense, compressed surge of enquiries from domestic buyers, NRIs and channel partners, and the sales outcome is largely determined within weeks. After sale, the same customer remains in contact for years through construction-milestone payment demands, documentation, registration and possession-handover communication. Buyers reach DLF through the website and enquiry forms, a sales and pre-sales calling team, a large channel-partner broker network, and site sales galleries.",
    strategicPressure: [
      { text: "DLF is India's largest listed developer by market capitalisation, with premium residential development concentrated in Gurugram and NCR plus a large rental office and retail portfolio.", kind: "verified" },
      { text: "Premium launches sell down a large share of inventory in a short window, which makes speed and quality of lead handling in the first days of a launch disproportionately valuable.", kind: "verified" },
      { text: "Channel partners introduce most buyers, so partner queries about inventory, pricing and booking status are a service load in their own right and directly affect which projects brokers push.", kind: "inference" },
      { text: "Milestone payment demands across thousands of sold units are a recurring collections-shaped workload likely handled by a customer-relationship team working spreadsheets and calls.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "DLF is buy-led. It is a development and rental-asset business: its capabilities are land, design, execution and leasing. Technology is procured — CRM, ERP, lead management, construction management — and its IT function integrates rather than builds. There is no strategic case for a developer to own conversational infrastructure, and the launch-surge problem needs a solution now rather than a roadmap.",
    whyNotBuild:
      "A launch surge needs elastic capacity for days, not permanently, in Hindi, English and Punjabi, across voice and WhatsApp, with qualification against a rubric sales leadership owns and calendar booking into site-visit slots. Then the same platform must run milestone payment reminders under different conduct rules. Building and maintaining that for a business with a handful of launches a year is a poor use of capital; buying it with elastic economics matches the demand shape exactly.",
    workflows: [
      {
        name: "Launch-surge lead qualification and site-visit scheduling",
        friction: "A launch produces thousands of enquiries in days; the calling team works them in sequence, so late-queue leads are contacted after the buying moment has passed and qualification quality varies by caller.",
        outcome: "Every enquiry engaged within minutes in the buyer's language, qualified on budget, configuration, funding readiness and timeline against a rubric sales owns, and booked into a sales-gallery visit slot.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management system / CRM", "Project inventory and pricing master", "Sales-gallery visit calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Construction-milestone payment demand and follow-up",
        friction: "Demand letters go out and then rely on a customer-relationship team calling buyers individually; NRI buyers in other time zones are hardest to reach, and delayed collections tie up working capital.",
        outcome: "Policy-timed multilingual reminders grounded in the buyer's actual demand schedule and outstanding amount, with payment routes and documentation guidance in-channel and disputes escalated to the CRM team.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Customer relationship / receivables module in ERP", "Construction-milestone schedule", "Payment gateway", "Document repository"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Channel-partner enquiry and booking-status desk",
        friction: "Broker partners call sales managers directly for inventory availability, pricing, booking status and commission position, so service depends on relationships and consumes senior sales time.",
        outcome: "A recognised partner line that answers live inventory, price-list and booking-status questions from the system of record and escalates commercial negotiation to the sales team.",
        channels: ["Voice", "WhatsApp", "Partner portal"],
        systems: ["Inventory and price-list master", "Channel-partner records and commission ledger", "CRM", "Booking workflow"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Corporate and project websites with enquiry capture forms",
        "In-house pre-sales and sales calling teams plus site sales galleries",
        "A large channel-partner broker network with relationship managers",
        "Customer-relationship team handling post-sale documentation and payment demands",
      ],
      gaps: [
        "Launch-window enquiries exceed calling capacity, so a large share are contacted too late",
        "NRI enquiries and payment follow-ups across time zones are not served outside Indian hours",
        "Channel partners have no self-service route for inventory and booking-status questions",
        "Post-sale milestone communication is manual, so collection timing depends on team capacity",
      ],
    },
    risks: [
      "RERA obligations govern what may be represented about a project — possession timelines, approvals, carpet area and pricing must be drawn from registered project data, never improvised by the agent.",
      "TRAI DND and calling-window rules apply to launch outreach and payment reminders alike; consent capture at enquiry must be explicit and auditable.",
      "DPDP Act obligations on buyer financial and identity data collected during qualification and documentation, with retention and access controls on transcripts.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.5,
      automationRate: 0.5,
      basis: "Seller assumptions reflecting launch-driven surges averaged across the year plus continuous post-sale servicing; actual per-launch enquiry volumes, calling-team capacity and cost per qualified lead must be established with sales leadership in discovery.",
    },
    pilotScope:
      "A 10-week pilot covering one Gurugram residential launch, engaging every enquiry within minutes in Hindi and English, qualifying against the sales rubric and booking sales-gallery visits, measured on contact coverage and visit conversion.",
    expansion: [
      "Extend to launches in Chennai, tri-city and Mumbai with regional-language and NRI time-zone coverage.",
      "Add construction-milestone payment reminders and documentation follow-up for the sold-unit base.",
      "Stand up the channel-partner desk with live inventory, pricing and booking-status grounding.",
    ],
    stakeholders: [
      "Chief Executive Officer / Head of Residential Business",
      "Chief Marketing Officer / Head of Sales",
      "Chief Information Officer",
      "Head of Customer Relationship Management (post-sale)",
      "Chief Financial Officer (collections and receivables)",
    ],
    discovery: [
      "In the first week of a launch, how many enquiries arrive and what share receive a substantive first contact within an hour?",
      "Who owns the qualification rubric today, and is it applied consistently across in-house callers and channel partners?",
      "Are construction-milestone demand schedules queryable per buyer in the ERP, or assembled manually?",
      "What proportion of enquiries and payment follow-ups involve NRI buyers outside Indian working hours?",
    ],
    flowTemplate: "lead-sales",
    scenario: "Within four minutes of a Gurugram launch enquiry, a buyer is qualified in Hindi on budget and funding and booked into Saturday's sales-gallery slot.",
  },

  "godrej-properties": {
    operatingContext:
      "Godrej Properties is among India's most launch-intensive listed residential developers, running a capital-efficient model built largely on joint ventures and joint development agreements with landowners rather than outright land banking, which lets it operate simultaneously across Mumbai MMR, Pune, NCR, Bengaluru and Hyderabad. That model produces an unusually high frequency of project launches, each generating a compressed surge of enquiries across multiple cities and languages at once. After sale, every buyer enters a multi-year relationship of construction updates, milestone payment demands, documentation, registration and possession. Buyers reach it through project microsites and enquiry forms, digital campaigns, an in-house pre-sales calling operation, a large channel-partner network, and site experience centres.",
    strategicPressure: [
      { text: "Godrej Properties operates a joint-venture and joint-development-led model that supports a high launch cadence across Mumbai MMR, Pune, NCR, Bengaluru and Hyderabad.", kind: "verified" },
      { text: "A high launch frequency means the lead-surge problem is not occasional but near-continuous, and pre-sales capacity is the binding constraint on converting marketing spend.", kind: "inference" },
      { text: "Operating across five metros simultaneously means enquiries arrive in Marathi, Hindi, Kannada, Telugu, Bengali and English within the same week — a staffing shape no single calling floor solves cleanly.", kind: "inference" },
      { text: "Speed-to-first-contact is likely the single largest controllable variable in launch conversion, and current performance is probably measured in hours rather than minutes.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Godrej Properties is buy-led. Its competitive model is land partnerships, design and execution velocity, and brand trust. Technology is procured and integrated — CRM, lead management, ERP, construction management — and its digital team runs marketing and sales enablement rather than platform engineering. Conversational infrastructure is a bought capability everywhere in Indian real estate.",
    whyNotBuild:
      "The requirement is elastic multilingual capacity that spikes with each launch across five metros, qualification against a rubric that sales leadership controls, calendar integration into experience-centre visit slots, and later a differently-governed payment-reminder motion. Building that would mean a permanent engineering and operations function serving an intermittent demand curve — precisely the fixed cost a capital-efficient developer avoids.",
    workflows: [
      {
        name: "Multi-city launch lead engagement and qualification",
        friction: "Simultaneous launches in different cities flood a shared pre-sales team; leads are worked in list order regardless of intent, and language matching depends on who is rostered that day.",
        outcome: "Every lead engaged within minutes in the correct language, qualified against the sales rubric, and either booked for a site visit or routed to nurture with the reason recorded.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management / CRM", "Project inventory and pricing master", "Experience-centre visit calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Site-visit conversion and post-visit follow-up",
        friction: "Booked site visits suffer no-shows with no reminder discipline, and post-visit follow-up depends on the sales manager remembering, so warm buyers cool between visit and booking.",
        outcome: "Visit confirmations and reminders with one-tap rescheduling, plus structured post-visit follow-up that surfaces the actual objection and hands genuinely hot buyers to a sales manager immediately.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["CRM opportunity records", "Experience-centre calendars", "Sales-manager assignment", "Pricing and offer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-sale milestone payments and construction updates",
        friction: "Milestone demands and construction-progress questions are handled by a customer-care team across thousands of units in multiple cities; buyers call for updates that the construction system already knows.",
        outcome: "Grounded construction-stage and payment-schedule answers on demand, plus policy-timed payment reminders with in-channel payment routes and escalation of disputes to customer care.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Customer relationship / receivables module", "Construction milestone tracking", "Payment gateway", "Document repository"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Project microsites and digital campaigns with enquiry capture",
        "In-house pre-sales calling operation feeding city sales teams",
        "Channel-partner network with partner relationship managers",
        "Customer-care function handling post-sale documentation and payment demands",
      ],
      gaps: [
        "Launch-day lead volumes exceed pre-sales capacity, so first contact slips beyond the buying moment",
        "Language matching across five metros depends on rostering rather than on the lead",
        "Site-visit no-shows and post-visit follow-up are not systematically worked",
        "Buyers must call to learn construction progress that the project system already tracks",
      ],
    },
    risks: [
      "RERA compliance: possession dates, approvals, carpet areas and pricing statements must be drawn from registered project disclosures, with no agent improvisation.",
      "TRAI DND and calling-window rules on launch outreach and payment reminders, requiring auditable consent capture at the point of enquiry.",
      "DPDP Act obligations on buyer income, identity and financing data collected during qualification, with strict access control on transcripts and recordings.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.4,
      automationRate: 0.5,
      basis: "Seller assumptions from launch cadence across five metros plus continuous post-sale servicing; per-launch enquiry volumes, current speed-to-contact and cost per qualified lead need validation with sales and marketing leadership.",
    },
    pilotScope:
      "A 10-week pilot on two concurrent launches in MMR and Bengaluru, engaging every enquiry within minutes in Marathi, Kannada, Hindi and English, qualifying to the sales rubric and booking experience-centre visits.",
    expansion: [
      "Extend to all launch markets with Telugu, Bengali and additional language coverage, and add site-visit reminders and post-visit follow-up.",
      "Add channel-partner support for inventory, pricing and booking-status queries.",
      "Add post-sale construction-update answers and milestone payment reminders across the sold-unit base.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Sales Officer / Head of Sales and Marketing",
      "Chief Information Officer / Head of Digital",
      "Head of Customer Care (post-sale)",
      "Chief Financial Officer (collections)",
    ],
    discovery: [
      "What is the median time from enquiry submission to a substantive first conversation on launch day?",
      "How is the qualification rubric defined, and does the CRM capture it in structured fields or free text?",
      "What is the site-visit no-show rate, and is any reminder discipline running today?",
      "Can construction-milestone progress be exposed to a buyer-facing agent from the project management system?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Bengaluru launch enquiry is answered in Kannada within three minutes, qualified on budget and home-loan readiness, and booked for a Sunday site visit.",
  },

  "macrotech-lodha": {
    operatingContext:
      "Macrotech Developers, which sells under the Lodha brand, is one of India's largest residential developers by volume, with its core in Mumbai Metropolitan Region — including large township developments — plus expanding operations in Pune and Bengaluru. Its portfolio spans affordable and mid-income housing through to luxury, which means it runs both a very high-volume sales funnel and a premium one with different handling requirements. High unit volumes create a correspondingly large post-sale base: thousands of buyers on construction-linked payment plans, each generating demand letters, reminders, home-loan disbursement coordination with lenders, documentation and eventually possession and registration. Buyers reach it through project websites, digital campaigns, a large in-house pre-sales calling operation, channel partners, and site sales offices.",
    strategicPressure: [
      { text: "Macrotech Developers sells under the Lodha brand across MMR, Pune and Bengaluru, spanning affordable and mid-income housing through to luxury, with township-scale developments in Mumbai.", kind: "verified" },
      { text: "High unit-volume sales produce a very large construction-linked payment book, making collections timing a direct driver of cash flow and deleveraging.", kind: "inference" },
      { text: "Construction-linked plans depend on home-loan disbursements, so payment follow-up is really a three-way coordination between buyer, developer and lender that is slow when handled by phone.", kind: "inference" },
      { text: "The in-house pre-sales calling operation is likely one of the largest in Indian real estate, making it both a big cost line and an obvious automation target.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Lodha is buy-led. Its capabilities are land aggregation, township execution, construction at scale and sales velocity. Technology is procured — CRM, ERP, lead management, construction and collections modules — and its digital function serves sales and marketing. Nothing about residential development argues for owning speech and orchestration infrastructure.",
    whyNotBuild:
      "Two very different regulated motions are needed: high-velocity multilingual lead qualification, and construction-linked payment follow-up that must be conduct-governed, TRAI-compliant, grounded in each buyer's demand schedule and able to coordinate lender disbursement status. Building both, with the evaluation and audit discipline collections demands, is a specialist platform programme with no relationship to how Lodha wins land or sells homes.",
    workflows: [
      {
        name: "Construction-milestone payment reminders and lender-disbursement coordination",
        friction: "Demand letters trigger manual calling by the customer-relationship team; buyers say the bank has not disbursed, the team calls the bank relationship manager, and the loop takes days per unit across thousands of units.",
        outcome: "Policy-timed multilingual reminders grounded in the buyer's demand schedule and outstanding amount, capturing the specific blocker, issuing payment routes in-channel, and routing lender-disbursement blockers to the tie-up desk with structured detail.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Customer relationship / receivables module in ERP", "Construction milestone schedule", "Home-loan tie-up and disbursement tracker", "Payment gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "High-volume lead qualification and site-visit booking",
        friction: "Digital campaigns generate lead volumes the calling floor works in sequence; a large proportion are contacted late or not at all, and qualification depth varies with caller experience.",
        outcome: "Every lead engaged within minutes in Marathi, Hindi or English, qualified on budget, configuration and loan eligibility against the sales rubric, and booked into a site-office visit slot.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management / CRM", "Inventory and pricing master", "Site-office visit calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Possession, documentation and handover coordination",
        friction: "As towers complete, buyers need registration appointments, document checklists, dues clearance and handover slots; this is coordinated by phone and email per unit, creating a bottleneck at exactly the revenue-recognition moment.",
        outcome: "Structured handover journeys that confirm dues status, chase documents, book registration and possession appointments, and escalate exceptions to the customer-relationship team.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["ERP receivables and unit records", "Document repository", "Registration and handover scheduling", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Project websites and digital campaigns with high-volume lead capture",
        "Large in-house pre-sales calling operation plus site sales offices",
        "Channel-partner network with partner relationship management",
        "Customer-relationship team handling demand letters, documentation and possession",
      ],
      gaps: [
        "A significant share of campaign leads are never contacted while intent is warm",
        "Payment follow-up cannot resolve lender-disbursement blockers in the same conversation",
        "Possession and registration coordination is manual per unit at a moment of high volume",
        "Promises to pay and blocker reasons are captured as free text rather than structured, so patterns are invisible",
      ],
    },
    risks: [
      "RERA obligations on project representations — possession timelines, approvals, area and pricing must come from registered disclosures with no agent improvisation.",
      "TRAI DND, calling-window and commercial-communication rules apply to both lead outreach and payment reminders, requiring auditable consent and scrubbing.",
      "Collections conduct: tone, contact frequency and escalation must be policy-bounded, with dispute and hardship cues routed to human specialists and every interaction logged.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions from sales volumes and the size of the construction-linked payment book; actual lead volumes, calling-floor headcount and cost per contact must be validated with sales and customer-relationship leadership in discovery.",
    },
    pilotScope:
      "A 10-week pilot running construction-milestone payment reminders for one MMR township in Marathi, Hindi and English, grounded in each buyer's demand schedule with structured blocker capture and lender-disbursement routing, measured on collection timing.",
    expansion: [
      "Extend payment follow-up across all MMR, Pune and Bengaluru projects with promise-to-pay write-back and automated follow-up.",
      "Add high-volume lead qualification and site-visit booking on the same platform.",
      "Add possession, documentation and registration handover coordination for completing towers.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Financial Officer (collections and cash flow)",
      "Chief Information Officer / Head of Digital",
      "Head of Customer Relationship Management",
      "Head of Sales (residential)",
    ],
    discovery: [
      "How many units are currently on construction-linked plans, and what is the average delay between demand letter and payment?",
      "How is a lender-disbursement blocker resolved today, and how many days does that loop take?",
      "What is the size of the in-house pre-sales calling floor, and what share of leads does it actually contact?",
      "Are blocker reasons and promises to pay captured in structured CRM fields or in free-text notes?",
    ],
    flowTemplate: "collections",
    scenario: "A Thane buyer is reminded in Marathi about a slab-milestone demand, explains her bank has not disbursed, and the case is routed to the loan tie-up desk the same hour.",
  },

  "prestige-group": {
    operatingContext:
      "Prestige Estates Projects is one of south India's largest developers, with its historical base in Bengaluru and an expanding pipeline across Hyderabad, Chennai, Kochi, Mumbai and NCR, spanning residential, office, retail malls and hospitality. Its residential business is launch-driven and increasingly multi-city, so enquiry surges arrive in Kannada, Telugu, Tamil, Hindi and English depending on the project. Bengaluru's buyer base skews heavily toward technology-sector professionals who research digitally, expect fast responses and often make decisions with a spouse in a different city or country. After sale, buyers stay in contact for years through construction-linked payments, documentation, registration and possession. Contact today runs through project websites and portals, digital campaigns, an in-house pre-sales team, a very active channel-partner ecosystem, and site experience centres.",
    strategicPressure: [
      { text: "Prestige Estates is a leading south-India developer headquartered in Bengaluru with a diversified residential, commercial, retail and hospitality portfolio and an expanding multi-city pipeline.", kind: "verified" },
      { text: "Expansion into Hyderabad, Chennai, Mumbai and NCR multiplies the language and time-zone footprint of the sales funnel faster than a single Bengaluru calling floor can adapt.", kind: "inference" },
      { text: "Bengaluru's technology-professional buyer base researches online and expects near-immediate response, so slow first contact loses leads to developers who answer first.", kind: "inference" },
      { text: "Channel partners drive a large share of introductions in Bengaluru, and their inventory and status queries likely consume significant senior sales time.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Prestige is buy-led. It is a construction-led developer whose organisation is built around land, design, execution and leasing. Technology is procured and configured, and the digital function focuses on marketing performance and CRM hygiene. There is no engineering organisation and no strategic reason to create one for conversational infrastructure.",
    whyNotBuild:
      "Serving simultaneous launches in Kannada, Telugu, Tamil and Hindi with minute-level response, qualifying against a sales-owned rubric, booking into experience-centre calendars, and later running payment reminders under conduct and TRAI rules, is a specialist platform capability. For a developer whose competitive edge is execution velocity, buying elastic capacity that spikes with launches is strictly better than owning idle capacity between them.",
    workflows: [
      {
        name: "Launch enquiry engagement and qualification across cities",
        friction: "Multi-city launches funnel into a Bengaluru-centric calling team; leads in other cities and languages wait, and qualification quality depends on the individual caller.",
        outcome: "Immediate multilingual engagement of every enquiry, structured qualification on budget, configuration and loan readiness, and booking into the right city's experience-centre calendar.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management / CRM", "Inventory and pricing master", "Experience-centre visit calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Channel-partner inventory and booking-status desk",
        friction: "Broker partners phone sales managers for availability, price lists, offer terms and booking status; senior sellers spend their day answering lookups instead of closing.",
        outcome: "A recognised partner channel answering live inventory, pricing and booking-status queries from the system of record, with commercial negotiation escalated to sales managers.",
        channels: ["Voice", "WhatsApp", "Partner portal"],
        systems: ["Inventory and price-list master", "Channel-partner records and commission ledger", "CRM", "Booking workflow"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Post-sale payment schedule and construction-progress queries",
        friction: "Buyers call customer care to ask what is due, when the next milestone falls and how construction is progressing; each answer requires a human to check two systems, and reminders are capacity-limited.",
        outcome: "Grounded, self-service answers on dues and construction stage in any channel, plus policy-timed payment reminders with in-channel payment routes and human escalation for disputes.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Receivables / customer-relationship module", "Construction milestone tracking", "Payment gateway", "Document repository"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Project websites and buyer portals with enquiry capture and document access",
        "In-house pre-sales calling team feeding city sales managers",
        "Large channel-partner ecosystem with relationship managers",
        "Customer-care function for post-sale payments, documentation and possession",
      ],
      gaps: [
        "Non-Bengaluru enquiries wait longer and are less consistently served in the local language",
        "Channel partners have no grounded self-service route, so lookups consume sales-manager time",
        "Buyers cannot get dues or construction-stage answers without a human",
        "Payment reminder coverage is limited by customer-care capacity rather than by the due book",
      ],
    },
    risks: [
      "RERA obligations govern project representations — timelines, approvals, area and price statements must come from registered disclosures only.",
      "TRAI DND and calling-window rules on launch outreach and payment reminders, with auditable consent capture at enquiry.",
      "DPDP Act obligations on buyer identity, income and financing data gathered during qualification, with controlled retention of transcripts and recordings.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 1.3,
      automationRate: 0.5,
      basis: "Seller assumptions from launch cadence, sold-unit base and multi-city expansion; per-launch enquiry volumes, partner query load and current cost per contact require validation with Prestige sales and customer-care leadership.",
    },
    pilotScope:
      "A 10-week pilot on two Bengaluru and Hyderabad launches engaging every enquiry within minutes in Kannada, Telugu, Hindi and English, qualifying to the sales rubric and booking experience-centre visits.",
    expansion: [
      "Extend to Chennai, Kochi, Mumbai and NCR launches with Tamil, Malayalam and Marathi coverage.",
      "Stand up the channel-partner desk with live inventory, pricing and booking-status grounding.",
      "Add post-sale dues and construction-progress answers plus policy-timed payment reminders.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer, Residential",
      "Head of Sales and Marketing",
      "Head of Information Technology",
      "Head of Customer Care / Post-sale Services",
    ],
    discovery: [
      "What is the current median time to first substantive contact on a launch enquiry, and does it differ by city?",
      "How many partner lookup calls do sales managers field each week, and could they be grounded in the inventory system?",
      "Which languages are actually staffed on the pre-sales floor today versus the languages of the launch pipeline?",
      "Is construction-milestone progress available in a system that could answer a buyer question directly?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Hyderabad enquiry is answered in Telugu within minutes, qualified on budget and possession timeline, and booked into the experience centre for Saturday.",
  },

  "brigade-group": {
    operatingContext:
      "Brigade Enterprises is a Bengaluru-headquartered developer with a deliberately diversified portfolio: residential apartments and villas, leased office parks, retail malls, and hotels operated under international brands, concentrated in Bengaluru and Chennai with activity in Hyderabad, Mysuru and Kochi. That diversification means the same corporate entity carries three quite different communication loads — residential buyers moving through a multi-year purchase and payment journey, commercial office tenants raising facility and lease-related requests, and mall and hotel customers. The residential business is the highest-volume: launches generate enquiry surges, and the sold-unit base generates continuous construction-linked payment demands, documentation and handover coordination. Buyers and tenants reach Brigade through project websites, digital campaigns, an in-house sales team, channel partners, site sales offices and property-level facility desks.",
    strategicPressure: [
      { text: "Brigade Enterprises operates a diversified real-estate portfolio spanning residential, leased offices, retail malls and hotels, centred on Bengaluru and Chennai.", kind: "verified" },
      { text: "A steady multi-project launch cadence provides repeatable lead-handling volume rather than the spiky one-off pattern of a single-project developer, which suits a persistent automated layer.", kind: "inference" },
      { text: "Residential buyers in Bengaluru and Chennai research digitally and expect fast response, while the same organisation must serve Kannada, Tamil, Telugu and Hindi callers from one sales function.", kind: "inference" },
      { text: "Post-sale payment reminders and handover coordination are probably handled by a lean customer-care team whose coverage is capped by headcount rather than by the size of the due book.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Brigade is buy-led. It is a construction and asset-operating business with procured technology across CRM, ERP, lead management and property operations. Nothing in its diversified model creates a reason to own conversational infrastructure, and its digital function is oriented to marketing performance and system integration rather than platform engineering.",
    whyNotBuild:
      "Brigade would need multilingual speech across Kannada, Tamil, Telugu and Hindi, telephony spanning sales lines and property desks, orchestration into CRM, receivables and facility-management systems, and a conduct-safe reminder motion under TRAI rules. That is a permanent specialist function serving three different business lines, none of which is software — the classic case for buying a configured capability instead.",
    workflows: [
      {
        name: "Residential lead qualification and site-visit booking",
        friction: "Enquiries from campaigns and portals are worked in list order by the sales team; leads arriving evenings and weekends — when buyers actually browse — wait until the next working day.",
        outcome: "Every enquiry engaged within minutes in the buyer's language, qualified on budget, configuration and loan readiness, and booked into a site sales-office visit slot with reminders.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management / CRM", "Inventory and pricing master", "Sales-office visit calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Construction-milestone payment reminders and dues queries",
        friction: "Demand letters are followed by manual calls from a small customer-care team; buyers who want to check what is due or when the next milestone falls have to call and wait for a lookup.",
        outcome: "Policy-timed reminders grounded in each buyer's demand schedule with payment routes in-channel, plus on-demand dues and construction-stage answers that remove the routine inbound entirely.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Receivables / customer-relationship module", "Construction milestone tracking", "Payment gateway", "Document repository"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Office and mall tenant service requests",
        friction: "Commercial tenants raise facility, access, parking and maintenance requests through property-level desks and email, so response depends on the individual facility manager and nothing is measured across the portfolio.",
        outcome: "One tenant-facing channel that logs and routes requests into the facility-management workflow with grounded status, escalating lease and commercial matters to the leasing team.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Facility management / helpdesk system", "Lease and tenant records", "Access control and parking systems", "Vendor work-order workflow"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Project websites and digital campaigns with enquiry capture",
        "In-house sales teams and site sales offices plus a channel-partner network",
        "Customer-care function handling post-sale payments, documentation and handover",
        "Property-level facility desks serving office and mall tenants",
      ],
      gaps: [
        "Evening and weekend enquiries — when buyers actually search — are not engaged until the next working day",
        "Buyers cannot self-serve dues or construction-progress information",
        "Payment reminder coverage is limited by customer-care headcount",
        "Tenant service requests are handled property by property with no portfolio-level measurement",
      ],
    },
    risks: [
      "RERA obligations on project representations: possession timelines, approvals, carpet area and pricing must be drawn from registered disclosures only.",
      "TRAI DND and calling-window rules on lead outreach and payment reminders, with auditable consent capture at enquiry.",
      "DPDP Act obligations on buyer and tenant personal data, including controlled retention of call transcripts and recordings.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 1.3,
      automationRate: 0.5,
      basis: "Seller assumptions from launch cadence, sold-unit base and leased-portfolio tenant load; actual enquiry volumes, customer-care headcount and cost per contact must be validated with Brigade sales and operations leadership.",
    },
    pilotScope:
      "An 8-week pilot engaging all residential enquiries for Bengaluru projects within minutes in Kannada, Hindi and English, qualifying to the sales rubric and booking site-office visits including evenings and weekends.",
    expansion: [
      "Extend to Chennai, Hyderabad and Kochi projects with Tamil, Telugu and Malayalam coverage.",
      "Add post-sale dues and construction-progress answers plus policy-timed milestone payment reminders.",
      "Extend to office and mall tenant service requests routed into the facility-management workflow.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Operating Officer, Residential",
      "Head of Sales and Marketing",
      "Head of Information Technology",
      "Head of Customer Care and Post-sale Services",
    ],
    discovery: [
      "What share of residential enquiries arrive outside working hours, and what happens to them today?",
      "Is the demand schedule per buyer queryable so an agent could answer a dues question directly?",
      "How many customer-care staff work the payment-reminder book, and how many units are on it?",
      "Are office and mall tenant requests logged in a common helpdesk system or handled property by property?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Bengaluru buyer enquiring at 9pm on a Sunday is qualified in Kannada and booked into Monday evening's site visit before the sales office opens.",
  },

  "sobha": {
    operatingContext:
      "Sobha Limited is a Bengaluru-headquartered developer distinguished by backward integration — it owns in-house interiors, glazing, metalworks and concrete capabilities and self-executes construction rather than relying wholly on contractors, a model it markets as a quality guarantee. Its residential portfolio is premium-positioned, concentrated in Bengaluru with significant activity in Kerala, Chennai, NCR, Pune and the Gujarat region, and it has an unusually strong pull with Kerala-origin non-resident Indian buyers in the Gulf and beyond, for whom Sobha is a familiar and trusted name. That NRI concentration reshapes the communication problem: enquiries and payment conversations arrive from Gulf, UK and US time zones, in Malayalam and English, from buyers who cannot visit a site office. Contact runs through project websites, digital campaigns, an in-house sales team, international channel partners and NRI-focused events, and site sales offices.",
    strategicPressure: [
      { text: "Sobha operates a backward-integrated construction model with in-house interiors, glazing and concrete capability, and develops premium residential projects centred on Bengaluru with a significant Kerala and NRI-linked buyer base.", kind: "verified" },
      { text: "NRI buyers enquire and transact across Gulf, European and US time zones, so a nine-to-six Indian sales desk structurally misses a large share of its highest-value demand.", kind: "inference" },
      { text: "Remote buyers who cannot visit a site depend far more heavily on responsive, credible communication about construction progress and documentation than local buyers do.", kind: "inference" },
      { text: "NRI payment journeys involve NRE and NRO account routing, FEMA-linked documentation and remittance timing that generate repeated coordination touches per milestone.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Sobha is buy-led. Its entire strategic identity is manufacturing and construction quality — it has integrated backwards into building trades, not into software. Technology is procured CRM, ERP and construction-management systems. A company whose differentiation is owning its glazing factory has no argument for owning speech infrastructure.",
    whyNotBuild:
      "Serving NRI buyers well means round-the-clock multilingual conversation in Malayalam, English, Hindi and Kannada, grounded construction-progress answers, and documentation and remittance guidance that is accurate and never improvised. Building that requires telephony across international routing, speech quality across accents, orchestration into ERP and construction systems, and continuous evaluation — a permanent function with no relationship to Sobha's integrated-manufacturing edge.",
    workflows: [
      {
        name: "NRI enquiry handling across time zones",
        friction: "Gulf, UK and US enquiries land outside Indian office hours and receive an email acknowledgement; by the time the sales team calls back, the buyer has moved on or scheduled with a competitor during their own evening.",
        outcome: "Immediate engagement in the buyer's language and time zone, qualification on budget, configuration and remittance readiness, and a scheduled call or virtual site tour with a named sales manager.",
        channels: ["Voice", "WhatsApp", "Web form", "Video"],
        systems: ["Lead management / CRM", "Inventory and pricing master", "Sales-manager calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Construction-progress and documentation queries for remote buyers",
        friction: "Buyers who cannot visit call or email for progress updates, document copies and registration status; each request is fulfilled manually by the customer-relationship team during Indian hours only.",
        outcome: "On-demand grounded construction-stage updates, document retrieval and registration-status answers at any hour, with photo and progress evidence pushed proactively at each milestone.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Construction milestone tracking", "Document repository", "Customer-relationship module", "Registration and legal records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Milestone payment reminders and remittance coordination",
        friction: "Payment follow-up for NRI buyers involves banking-channel questions, remittance timing and documentation that a general tele-caller cannot answer, so cases bounce between teams over days.",
        outcome: "Policy-timed reminders grounded in the demand schedule that capture the specific remittance blocker, guide on documentation, and route banking-channel exceptions to the NRI desk with structured context.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Receivables / customer-relationship module", "Construction milestone schedule", "Banking and remittance documentation records", "Payment gateway"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Project websites and digital campaigns with enquiry capture, including NRI-targeted content",
        "In-house sales teams, site sales offices and international channel partners",
        "Customer-relationship team handling payments, documentation and possession",
        "Buyer portal or document-sharing mechanism for agreements and payment records",
      ],
      gaps: [
        "Enquiries and buyer questions arriving in Gulf and Western time zones wait for Indian working hours",
        "Construction progress is not proactively evidenced to buyers who cannot visit the site",
        "NRI remittance and documentation blockers require specialist humans who are not always reachable",
        "Malayalam and English service quality for the NRI segment depends on individual sales staff",
      ],
    },
    risks: [
      "RERA obligations on project representations — possession timelines, approvals, area and pricing must be drawn from registered disclosures only.",
      "FEMA and banking-channel rules govern NRI payment routing and documentation; the agent may relay documented requirements and status but must escalate anything interpretive to the NRI desk.",
      "TRAI DND rules on domestic outreach plus varying local telemarketing rules in Gulf and other jurisdictions where NRI buyers are contacted, alongside DPDP obligations on cross-border buyer data.",
    ],
    economics: {
      volumeMonthly: 130000,
      costPerInteraction: 1.5,
      automationRate: 0.5,
      basis: "Seller assumptions from launch cadence, sold-unit base and the unusually high NRI mix; enquiry volumes by geography, after-hours contact loss and cost per qualified lead must be validated with Sobha sales leadership.",
    },
    pilotScope:
      "An 8-week pilot handling all after-hours and Gulf-time-zone enquiries in Malayalam and English, qualifying against the sales rubric and booking calls or virtual tours with named sales managers.",
    expansion: [
      "Extend to all enquiry traffic with Kannada, Hindi and Tamil coverage across Bengaluru, Chennai, NCR and Pune projects.",
      "Add on-demand construction-progress, document and registration-status answers for remote buyers with proactive milestone evidence.",
      "Add milestone payment reminders with structured remittance-blocker capture and NRI-desk routing.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Head of Sales and Marketing",
      "Head of NRI Sales / International Business",
      "Head of Information Technology",
      "Head of Customer Relationship Management",
    ],
    discovery: [
      "What share of enquiries originate from NRI buyers, and what happens to those arriving outside Indian working hours?",
      "How are construction-progress updates delivered to buyers who never visit the site?",
      "Which remittance and documentation questions can be answered from records, and which require the NRI desk?",
      "Is the demand schedule and payment status queryable per buyer for a conversational agent?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Kerala-origin buyer in Dubai enquires at 9pm Gulf time, is qualified in Malayalam, and books a virtual site walkthrough for the weekend.",
  },

  "square-yards": {
    operatingContext:
      "Square Yards operates one of India's largest integrated real-estate transaction platforms: primary property brokerage for developer inventory, secondary resale and rental brokerage, mortgage and home-loan distribution, and property data and listings products, with a significant presence in Gulf markets serving NRI investors. Its revenue is transaction-brokerage and distribution commission, which makes it structurally a sales-operations business — its engine is a very large tele-sales and field-advisor workforce that works inbound leads from portals, campaigns and developer tie-ups, qualifies them, and converts them into site visits and bookings. Lead cost is a major expense line, so the ratio between leads bought and leads actually contacted while warm determines unit economics. Customers reach it through listings portals, its own website and app, campaign landing pages, tele-sales callbacks and field advisors.",
    strategicPressure: [
      { text: "Square Yards runs an integrated brokerage and mortgage-distribution platform across primary, secondary and rental real estate, with operations serving Indian and Gulf NRI buyers.", kind: "verified" },
      { text: "In a brokerage model, paid lead acquisition is a direct cost of revenue, so every lead not contacted while intent is warm is a written-off expense rather than a soft loss.", kind: "verified" },
      { text: "A very large tele-calling workforce is both the engine and the largest controllable cost, making speed-to-lead and cost-per-qualified-lead the two metrics that govern the business.", kind: "inference" },
      { text: "Gulf NRI investor enquiries arrive on a different clock and expect responsiveness that an India-shift calling floor cannot naturally provide.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Square Yards is partner-led. It genuinely builds technology — listings, data products, mortgage marketplace workflows and internal sales tooling — so it is not a naive buyer. But the tele-calling engine is an operations cost centre rather than differentiated IP, and its engineering roadmap is committed to the marketplace and data products that investors value. A partner-delivered conversational layer on top of its own CRM is the pragmatic route.",
    whyNotBuild:
      "Square Yards could build a conversational qualifier, but doing so means owning speech, telephony at scale, and an evaluation and quality regime for thousands of daily buyer conversations — while its engineers are needed on listings, data and mortgage products. The commercial logic is also cleaner: a bought layer prices against cost per qualified lead, which is exactly the metric management already runs the business on.",
    workflows: [
      {
        name: "Inbound lead engagement and qualification at scale",
        friction: "Purchased and organic leads arrive faster than the calling floor can work them; advisors call in list order during shift hours, so a large share of paid leads are contacted late or never, and qualification depth varies by advisor.",
        outcome: "Every lead engaged within minutes on WhatsApp or voice in the buyer's language, qualified on budget, location, configuration, timeline and loan need, with only qualified leads routed to human advisors.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management / CRM", "Listings and inventory database", "Advisor assignment and calendars", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Site-visit scheduling, confirmation and no-show recovery",
        friction: "Site visits are the conversion event, but scheduling is manual, confirmations are inconsistent and no-shows waste advisor field time that has already been committed.",
        outcome: "Visits booked against advisor and developer-site availability, confirmed and reminded automatically with one-tap rescheduling, and no-shows re-engaged the same day rather than written off.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["CRM opportunity records", "Advisor calendars", "Developer site-visit slots", "Field-advisor mobile workflow"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Mortgage lead qualification and document collection",
        friction: "Home-loan distribution requires income, employment and property documents collected by advisors over calls and WhatsApp; incomplete files stall at the lender and nobody chases systematically.",
        outcome: "Structured eligibility conversation followed by a tracked document checklist chased in-channel, so files reach the lender complete and disbursement timelines shorten.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Mortgage distribution / loan-application workflow", "Document repository", "Lender partner portals", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Listings portal, website and mobile app with enquiry capture",
        "Large in-house tele-sales floor and field-advisor network",
        "Internal CRM and lead-distribution tooling built in-house",
        "Mortgage distribution workflow with lender partner integrations",
      ],
      gaps: [
        "Purchased leads outnumber the calling floor's capacity to contact them while warm",
        "Gulf and NRI enquiries are not consistently served on their own clock",
        "Site-visit no-shows are not systematically re-engaged",
        "Mortgage document chasing depends on individual advisor diligence, so files stall at the lender",
      ],
    },
    risks: [
      "TRAI DND, calling-window and commercial-communication rules apply directly to high-volume outbound brokerage calling, with scrubbing and opt-out handling mandatory and enforcement risk material at this volume.",
      "RERA constrains what a broker may represent about a project — pricing, approvals and possession claims must be grounded in registered disclosures, not advisor claims.",
      "DPDP Act obligations on buyer income, identity and financial documents collected for mortgage distribution, with strict retention and access control.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions from high-volume brokerage calling patterns; actual lead inflow, contact-rate on purchased leads, calling-floor headcount and blended cost per contact must be validated with Square Yards sales operations in discovery.",
    },
    pilotScope:
      "A 10-week pilot taking one lead source in the NCR market, engaging every lead within minutes in Hindi and English, qualifying to the existing rubric and routing only qualified leads to advisors, measured on cost per qualified lead against the control floor.",
    expansion: [
      "Extend to all major Indian lead sources and markets with Marathi, Kannada, Telugu and Tamil coverage.",
      "Add Gulf NRI coverage on local clock, plus site-visit scheduling, confirmation and no-show recovery.",
      "Add mortgage eligibility qualification and tracked document collection feeding the lender workflow.",
    ],
    stakeholders: [
      "Chief Executive Officer / Co-founder",
      "Chief Technology Officer",
      "Head of Sales Operations / Tele-sales",
      "Head of Mortgages and Financial Services Distribution",
      "Chief Financial Officer (cost per qualified lead)",
    ],
    discovery: [
      "What share of purchased leads receive a first contact within thirty minutes today, and what does an uncontacted lead cost?",
      "Does management regard conversational qualification as proprietary IP or as a bought operating capability?",
      "How are advisor calendars and developer site-visit slots managed, and can they be booked programmatically?",
      "What percentage of mortgage files stall at the lender because of incomplete documentation?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Noida property enquiry is engaged on WhatsApp within two minutes, qualified on budget and loan need, and handed to an advisor with a booked Saturday site visit.",
  },

  "ecom-express": {
    operatingContext:
      "Ecom Express is a technology-enabled logistics company built specifically for e-commerce parcel delivery, operating a national first-mile, sortation and last-mile network with deliberate depth into tier-2, tier-3 and rural pin codes where the large marketplaces need reach they cannot build themselves. Its customers are the e-commerce platforms and direct-to-consumer brands that ship through it, but its daily conversations are overwhelmingly with the end consignees — the people receiving parcels — about address clarification, delivery timing, cash-on-delivery readiness and re-attempts. The commercial pain is concentrated in non-delivery reports: when a delivery fails, the shipment enters an NDR loop where someone must reach the consignee, fix the reason and schedule a re-attempt, or the parcel goes return-to-origin and the cost is borne with no revenue. The company has faced well-publicised financial stress after its planned public listing did not proceed.",
    strategicPressure: [
      { text: "Ecom Express operates a national e-commerce parcel network with deep tier-2, tier-3 and rural coverage, and its planned public listing did not proceed, leaving it under financial pressure.", kind: "verified" },
      { text: "Return-to-origin costs are the sharpest controllable loss in e-commerce logistics: the parcel is transported twice with no delivery revenue and the client brand also loses the sale.", kind: "verified" },
      { text: "NDR resolution depends on reaching a consignee quickly in their own language across pin codes where a Hindi-and-English calling floor is a poor match for the actual population served.", kind: "inference" },
      { text: "Client brands increasingly measure their logistics partners on NDR conversion and RTO percentage, so improving it is a retention argument as much as a cost one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Ecom Express is buy-led. Despite being technology-enabled, its engineering is committed to network operations — routing, sortation, rider apps, tracking and client integrations — which is where its service quality comes from. Financial pressure makes a new internal platform programme implausible, while a bought capability that pays for itself in avoided RTO cost is a fundable proposition.",
    whyNotBuild:
      "NDR calling at scale requires speech that works in Hindi, Bengali, Tamil, Telugu and more on low-quality mobile connections, telephony volumes in the millions of attempts, orchestration that writes a re-attempt instruction into the last-mile system and notifies the rider, and TRAI-compliant contact handling. Building that under financial stress, while engineering is needed on the network itself, is not a realistic allocation.",
    workflows: [
      {
        name: "NDR resolution and delivery re-attempt scheduling",
        friction: "Failed deliveries generate a calling backlog worked by agents during office hours; consignees who were unreachable at the door are often unreachable again, and each unresolved NDR moves closer to return-to-origin.",
        outcome: "Every failed delivery triggers immediate multilingual outreach on the consignee's channel that captures the real reason, confirms a workable slot and address, and writes the re-attempt instruction into the last-mile system for the rider.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Order management / shipment tracking", "Last-mile delivery and rider app", "Address database and pin-code master", "Client brand OMS integration"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Address verification and pre-delivery confirmation",
        friction: "Incomplete or ambiguous addresses in tier-3 and rural pin codes cause failed attempts before the rider even sets out, and verification calls are made only after the first failure.",
        outcome: "Pre-delivery confirmation that verifies address detail, landmark and availability window before the rider is dispatched, converting a first-attempt failure into a first-attempt success.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Shipment and address records", "Route planning / rider dispatch", "Pin-code and serviceability master", "Geocoding"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cash-on-delivery readiness and payment-mode conversion",
        friction: "COD parcels fail when the consignee has no cash ready or is not present with funds; riders absorb the wasted trip and the shipment re-enters the NDR loop.",
        outcome: "Pre-delivery COD confirmation that verifies amount and readiness and offers a digital payment link, converting cash failures into prepaid successes before dispatch.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Shipment COD records", "Payment gateway / digital collection", "Rider dispatch", "Client brand settlement reconciliation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consignee tracking pages and SMS or WhatsApp delivery notifications",
        "Central NDR calling operation contacting consignees on failed deliveries",
        "Rider mobile application with delivery status capture and proof of delivery",
        "Client-facing dashboards and APIs for brands shipping through the network",
      ],
      gaps: [
        "NDR outreach coverage is limited by calling capacity, so a share of failed deliveries never gets a real conversation",
        "Address ambiguity is discovered at the doorstep rather than before dispatch",
        "Consignees in many pin codes are contacted in a language that is not their first",
        "COD readiness is not confirmed before the rider is committed to the trip",
      ],
    },
    risks: [
      "TRAI DND and commercial-communication rules govern consignee outbound; delivery-coordination calls must be structured as transactional service communication with clean opt-out handling.",
      "DPDP Act obligations on consignee personal data that belongs commercially to the client brand — purpose limitation and retention must follow the client contract, since Ecom Express is often the processor.",
      "Peak-season change control: during major sale events the network runs at maximum load and client brands typically freeze changes, so deployment and configuration windows must avoid those periods.",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 0.8,
      automationRate: 0.65,
      basis: "Seller assumptions from parcel-volume-linked NDR and confirmation contact patterns; actual NDR counts, current calling capacity, RTO percentage and cost per failed delivery must be validated with network operations in discovery.",
    },
    pilotScope:
      "A 10-week pilot running NDR outreach for two north-India regions in Hindi and English, capturing the failure reason and confirming a re-attempt slot written into the last-mile system, measured on NDR-to-delivery conversion and RTO percentage against control regions.",
    expansion: [
      "Extend NDR coverage nationally with Bengali, Tamil, Telugu, Marathi and Kannada support.",
      "Add pre-delivery address verification and availability confirmation before rider dispatch.",
      "Add COD readiness confirmation with digital payment conversion, and expose outcome data to client brands as a service differentiator.",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer / Head of Network Operations",
      "Chief Technology Officer",
      "Head of Customer Experience / NDR Operations",
      "Head of Key Account Management (client brands)",
    ],
    discovery: [
      "How many NDR cases are generated daily, and what share receive a successful consignee conversation within 24 hours?",
      "What is the current RTO percentage, and what is the fully-loaded cost of a return-to-origin shipment?",
      "Can the last-mile system accept a re-attempt instruction and slot from an external agent, or is it operator-entered?",
      "Do client brand contracts permit automated consignee contact, and who owns the consignee data under those contracts?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A consignee in a Bihar tier-3 pin code is called in Hindi the same evening a delivery fails, gives a landmark, and the parcel is re-attempted next morning instead of going back.",
  },

  "xpressbees": {
    operatingContext:
      "XpressBees is a large Indian e-commerce logistics company running express parcel, business-to-business and cross-border lines, with a national first-mile, hub-and-sortation and last-mile network serving marketplaces, direct-to-consumer brands and quick-commerce clients. It has invested materially in automation and technology inside the network — sortation, routing, capacity planning and client integration — and positions that technology as part of its service proposition. Its everyday customer conversations, however, are with consignees: confirming addresses, agreeing delivery windows, resolving failed attempts and handling cash-on-delivery readiness. Because parcel volumes scale sharply during sale events and quick-commerce demand is time-critical, communication load is spiky and directly tied to the network's ability to deliver first time. Contact today runs through tracking links, automated SMS and WhatsApp notifications, a consignee helpline and an NDR calling operation.",
    strategicPressure: [
      { text: "XpressBees operates a national e-commerce logistics network across express parcel, B2B and cross-border lines with significant investment in network automation and technology.", kind: "verified" },
      { text: "Failed first-attempt deliveries and the resulting NDR loop are the dominant controllable cost in the parcel business, and they scale linearly with volume.", kind: "verified" },
      { text: "Client brands increasingly buy logistics on service metrics like first-attempt delivery rate and NDR conversion, so communication quality is a commercial differentiator rather than a back-office function.", kind: "inference" },
      { text: "The consignee-facing calling operation is probably a mix of in-house and outsourced capacity that is hard to flex during sale-event peaks.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "XpressBees is partner-led. It has genuine engineering capability and uses it as a differentiator, but that capability is deployed on network intelligence — sortation, routing, capacity and client integration — where it creates margin. Consignee conversation infrastructure is adjacent: valuable, but not where its engineers create advantage. A partner layer that plugs into its existing tracking and last-mile systems is faster and cheaper than diverting them.",
    whyNotBuild:
      "The gap between XpressBees building a conversational layer and buying one is speech, telephony and evaluation — multilingual ASR that works on poor mobile connections across every pin code it serves, telephony that absorbs sale-event spikes, and quality scoring across millions of consignee conversations. Those are specialist assets with no network-operations synergy, and building them would compete directly with the roadmap its clients pay for.",
    workflows: [
      {
        name: "NDR resolution and re-attempt coordination",
        friction: "Failed deliveries queue for a calling team whose capacity is fixed; during sale peaks the backlog grows exactly when parcel value is highest, and unresolved cases convert to return-to-origin.",
        outcome: "Immediate multilingual outreach on every failed delivery that captures the true reason, confirms address and slot, and writes the re-attempt into the last-mile system for the rider.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Shipment tracking / order management", "Last-mile dispatch and rider app", "Address and pin-code master", "Client OMS integration"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-dispatch address verification and delivery-window agreement",
        friction: "Ambiguous addresses and absent consignees are discovered at the doorstep; verification happens after a wasted trip rather than before dispatch.",
        outcome: "Address and availability confirmed conversationally before the rider is routed, lifting first-attempt success and reducing the NDR pool at source.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Shipment and address records", "Route planning / dispatch", "Geocoding and serviceability master", "Rider app"],
        value: 3,
        complexity: 2,
      },
      {
        name: "B2B shipper and client-brand status desk",
        friction: "Client brands and B2B shippers raise shipment-status, exception and pickup queries through account managers and email, so answers depend on someone being available and are inconsistent at peak.",
        outcome: "A recognised client channel giving grounded shipment, exception and pickup-status answers from the tracking system, with commercial and SLA matters escalated to account management.",
        channels: ["Voice", "Email", "WhatsApp"],
        systems: ["Shipment tracking", "Client account and SLA records", "Pickup scheduling", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consignee tracking links with automated SMS and WhatsApp delivery notifications",
        "NDR calling operation contacting consignees on failed deliveries",
        "Rider mobile application capturing delivery status and proof of delivery",
        "Client dashboards and API integrations for brands and marketplaces",
      ],
      gaps: [
        "NDR outreach cannot flex with sale-event volume spikes",
        "Address quality problems surface only after a failed attempt",
        "Regional-language coverage lags the pin-code footprint the network actually serves",
        "B2B shippers rely on account managers for routine status questions",
      ],
    },
    risks: [
      "TRAI DND and commercial-communication rules on consignee outbound, which must be structured as transactional delivery coordination with clean opt-out handling.",
      "DPDP Act obligations on consignee data owned commercially by client brands, where XpressBees typically acts as processor under contract terms that govern purpose and retention.",
      "Peak-season change freezes: during major sale events clients and the network both lock configuration, so deployment windows must be planned around them.",
    ],
    economics: {
      volumeMonthly: 5000000,
      costPerInteraction: 0.8,
      automationRate: 0.65,
      basis: "Seller assumptions from parcel-volume-linked consignee contact patterns; actual NDR volumes, first-attempt delivery rate, current calling mix and cost per contact must be validated with network and CX operations in discovery.",
    },
    pilotScope:
      "A 10-week pilot running pre-dispatch address and availability confirmation plus NDR outreach for two western-India regions in Hindi, Marathi and English, measured on first-attempt delivery rate and NDR conversion against control regions.",
    expansion: [
      "Extend nationally with Telugu, Tamil, Kannada and Bengali coverage and elastic capacity for sale-event peaks.",
      "Add COD readiness confirmation and digital payment conversion before dispatch.",
      "Stand up the B2B shipper and client-brand status desk with account recognition and SLA-aware escalation.",
    ],
    stakeholders: [
      "Chief Executive Officer / Founder",
      "Chief Operating Officer, Network Operations",
      "Chief Technology Officer",
      "Head of Customer Experience / NDR Operations",
      "Head of Enterprise Sales and Key Accounts",
    ],
    discovery: [
      "What is the current first-attempt delivery rate, and how much of the gap traces to address quality versus consignee availability?",
      "Is consignee calling in-house, outsourced, or partly automated today, and how does capacity flex during sale events?",
      "Can the dispatch system consume a confirmed delivery window from an external agent before routing?",
      "Which client contracts specify NDR conversion or first-attempt metrics that this would directly improve?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Pune consignee confirms her evening availability and building gate code on WhatsApp in Marathi before the rider is even assigned the parcel.",
  },

  "safexpress": {
    operatingContext:
      "Safexpress is a privately held pan-India surface express logistics company built around business-to-business supply-chain movement rather than consumer parcels, serving apparel, pharmaceutical, automotive, electronics, publishing and institutional shippers through a large network of logistics parks, branches and franchise-operated booking points. Its customers are shipper businesses and their consignees — retailers, distributors, dealers and institutional buyers — whose everyday questions are about consignment status, expected delivery date, proof of delivery, pickup scheduling and documentation. Because it moves high-value B2B freight, a delayed or undocumented consignment blocks a customer's own operations, so status transparency is a service commitment rather than a nicety. Contact today runs through branch phone numbers, a customer-service helpline, a track-and-trace web portal, and relationship managers for larger accounts.",
    strategicPressure: [
      { text: "Safexpress is a privately held pan-India surface express logistics operator serving B2B supply chains through a large network of logistics parks, branches and franchise booking points.", kind: "verified" },
      { text: "B2B freight customers escalate on status and proof-of-delivery because a missing consignment or POD blocks their own billing and inventory processes.", kind: "inference" },
      { text: "A branch-and-franchise network means customers call whichever local number they know, so the same query is handled inconsistently and central visibility of service load is poor.", kind: "inference" },
      { text: "A large share of inbound calls are almost certainly answerable directly from existing track-and-trace data, making deflection the fastest available win.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Safexpress is buy-led. It is a promoter-led asset-heavy trucking and warehousing business whose investment goes into logistics parks, fleet and network coverage. Its technology is a procured and internally-supported transport management and tracking estate, not a software product organisation. There is no plausible internal path to building conversational infrastructure.",
    whyNotBuild:
      "The requirement is Hindi and English speech on a national B2B helpline, integration into the transport management and POD systems, and routing across a branch and franchise network — plus the discipline to keep answers grounded in shipment records rather than improvised. That is a specialist capability with no freight-operations synergy, and for a privately held company the compelling argument is that it removes call load from branches without adding headcount.",
    workflows: [
      {
        name: "Consignment status and expected-delivery enquiry",
        friction: "Customers call branch numbers where whoever answers looks up the consignment manually; during peak dispatch hours calls go unanswered and customers escalate to relationship managers.",
        outcome: "Grounded consignment status, current location and expected delivery answered instantly on any channel from the tracking system, in Hindi or English, without touching a branch.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Transport management system (TMS)", "Track-and-trace / consignment records", "Branch and hub scan data", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Pickup booking and scheduling",
        friction: "Shippers book pickups by calling the local branch; booking depends on the branch's own record keeping, and confirmation back to the shipper is inconsistent.",
        outcome: "Pickup requests captured conversationally with address, volume and time window, written into the operations system and confirmed to the shipper with a reference.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Pickup / booking module in TMS", "Branch and route allocation", "Customer account records", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Proof-of-delivery retrieval and documentation follow-up",
        friction: "POD copies are chased by phone and email because the customer's own billing depends on them; branches search physical or scanned records and respond over days.",
        outcome: "POD status and copies retrieved on demand in-channel, with outstanding documentation flagged proactively to the customer and to the branch responsible.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["POD repository / document management", "TMS consignment records", "Branch operations workflow", "Billing and invoicing"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Web track-and-trace portal for consignment status",
        "Central customer-service helpline plus branch and franchise phone numbers",
        "Relationship managers serving larger shipper accounts",
        "SMS and email booking and delivery notifications",
      ],
      gaps: [
        "Customers still call branches for status the tracking system already knows",
        "Pickup bookings depend on reaching the right branch during working hours",
        "POD retrieval takes days and blocks customers' own invoicing",
        "There is no central visibility of how much service load branches are actually absorbing",
      ],
    },
    risks: [
      "TRAI DND and commercial-communication rules apply to any proactive shipper or consignee outbound, which must be structured as transactional service messaging.",
      "B2B contractual service commitments mean automated status answers must be exactly grounded in scan data — an incorrect ETA is a commercial dispute, not a service annoyance.",
      "Franchise-operated booking points introduce data-quality and access-control questions that must be resolved before an agent can answer on their behalf.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from branch network scale and B2B status-query patterns; true call volumes across branches and the central helpline, and their cost, must be measured in discovery since much of the load is currently invisible centrally.",
    },
    pilotScope:
      "An 8-week pilot taking consignment-status and expected-delivery calls for the north-India branch cluster onto a single number in Hindi and English, grounded in live track-and-trace, measured on branch call deflection.",
    expansion: [
      "Extend nationally and add pickup booking written into the operations system with confirmation references.",
      "Add POD retrieval and proactive documentation follow-up linked to customer billing cycles.",
      "Add proactive exception notification for delayed consignments to shippers and consignees.",
    ],
    stakeholders: [
      "Managing Director / Promoter",
      "Chief Operating Officer / Head of Network Operations",
      "Head of Information Technology",
      "Head of Customer Service",
      "Head of Sales and Key Accounts",
    ],
    discovery: [
      "How many status calls reach branches each day, and is that volume visible centrally at all?",
      "Can the track-and-trace system provide a reliable expected-delivery date, or only last-scan location?",
      "How long does a POD request currently take from customer ask to document delivered?",
      "Which branches and franchise points would need to be in scope for a single national service number to work?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Ludhiana apparel shipper asks in Hindi where three consignments are and gets live status plus a POD copy for the one already delivered.",
  },

  "tci-transport-corporation": {
    operatingContext:
      "Transport Corporation of India (TCI) is a long-established listed logistics group operating across multiple divisions: surface freight and full-truckload movement, a supply-chain solutions business serving automotive, retail and consumer clients with warehousing and in-plant logistics, and a coastal shipping and multimodal seaways arm. Its customers are almost entirely businesses — manufacturers, distributors and retailers — served through a wide branch network across Indian industrial and commercial centres, with branch managers and relationship teams as the primary human interface. Everyday communication is booking consignments, chasing shipment status and expected delivery, retrieving proof of delivery, coordinating warehouse dispatch schedules and resolving billing queries, and it is fragmented across dozens of branch phone numbers rather than concentrated centrally.",
    strategicPressure: [
      { text: "TCI is a listed multi-division logistics group spanning surface freight, supply-chain solutions and coastal shipping, operating through a national branch network.", kind: "verified" },
      { text: "A branch-led service model fragments customer contact across many local numbers, so service quality is uneven and the organisation cannot see its own contact load.", kind: "inference" },
      { text: "Supply-chain contracts with automotive and retail clients carry service commitments where status transparency and documentation turnaround are contractually measured.", kind: "inference" },
      { text: "Consolidating routine status and POD queries onto a central grounded line would free branch staff for commercial work they are better used for.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "TCI is buy-led. It is an asset and operations business — trucks, warehouses, vessels and people — modernising incrementally through procured systems. Its IT function runs and integrates transport management, warehouse management and financial systems; it has no software product organisation, and a conversational layer is unambiguously something it would buy.",
    whyNotBuild:
      "Building would mean owning Hindi and English speech on a national B2B line, telephony consolidation across a fragmented branch numbering estate, and orchestration across separate TMS, WMS and billing systems for different divisions. That is a specialist integration and platform programme with no relationship to freight economics, for a company whose competitive assets are network density and execution reliability.",
    workflows: [
      {
        name: "Shipment status and expected-delivery enquiry across divisions",
        friction: "Customers call the branch that booked the consignment; the answer depends on that branch's staff and working hours, and multi-division customers must call different teams for freight and warehousing questions.",
        outcome: "One grounded national line that identifies the customer and consignment, answers status and expected delivery from the system of record regardless of division, and escalates exceptions to the owning branch.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Transport management system (TMS)", "Warehouse management system (WMS)", "Consignment tracking / scan data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Booking capture and pickup scheduling",
        friction: "Bookings are taken by branch staff over the phone and entered manually, with confirmation back to the customer inconsistent and errors surfacing at pickup.",
        outcome: "Booking details captured conversationally with validation against the customer's contracted rates and serviceable lanes, written into the operations system and confirmed with a reference.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Booking module in TMS", "Customer contract and rate master", "Branch and route allocation", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "POD retrieval and billing-query resolution",
        friction: "Customers chase proof of delivery and query invoices through branches and finance teams; reconciliation takes days and blocks the customer's own payment cycle, which then delays TCI's collections.",
        outcome: "POD copies and invoice detail retrieved on demand in-channel, with genuine billing disputes routed to finance with structured context instead of an email thread.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["POD / document management", "Billing and invoicing", "TMS consignment records", "Accounts receivable"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Web and app-based track-and-trace for consignments",
        "National branch network with local phone contact and relationship managers",
        "Customer portals for larger supply-chain accounts",
        "SMS and email booking and delivery notifications",
      ],
      gaps: [
        "No single national number that answers status across freight, supply-chain and seaways divisions",
        "Branch-level call load is invisible to central management",
        "POD and billing queries take days and delay the customer's payment cycle",
        "Service quality and language coverage vary branch by branch",
      ],
    },
    risks: [
      "Contractual service levels in supply-chain agreements mean any automated status answer must be exactly grounded in scan and system data, with audit trails available to the client.",
      "TRAI DND and commercial-communication rules on proactive shipper notifications, which must be transactional in structure.",
      "Multi-division data segregation: a customer of the supply-chain business must not be able to query freight or seaways records they are not entitled to see.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions from branch network scale and B2B logistics query patterns; branch-level call volumes are largely unmeasured today and must be quantified in discovery before any business case is fixed.",
    },
    pilotScope:
      "An 8-week pilot consolidating shipment-status and expected-delivery calls for one region's branches onto a single grounded national number in Hindi and English, measured on branch call deflection and answer accuracy.",
    expansion: [
      "Extend nationally across freight and supply-chain divisions with entitlement-aware customer recognition.",
      "Add booking capture and pickup scheduling validated against contracted rates and serviceable lanes.",
      "Add POD retrieval and billing-query handling with structured routing of genuine disputes to finance.",
    ],
    stakeholders: [
      "Managing Director / Executive Director",
      "Chief Operating Officer, Freight and Supply Chain divisions",
      "Chief Information Officer",
      "Head of Customer Service",
      "Chief Financial Officer (billing disputes and receivables)",
    ],
    discovery: [
      "How many customer calls reach branches each day, and does any central system record them?",
      "Can consignment status be resolved to a reliable expected-delivery date, or only to last scan?",
      "How are entitlements defined so a customer sees only their own consignments across divisions?",
      "What is the average time from a POD request to the document reaching the customer today?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An auto-component buyer in Pune calls one TCI number in Hindi and gets live status on two freight consignments plus a POD for a third.",
  },

  "vrl-logistics": {
    operatingContext:
      "VRL Logistics is a Hubballi-headquartered transporter operating one of India's largest owned commercial vehicle fleets, built around less-than-truckload parcel and goods movement through a very wide network of branches and agency booking points, complemented by a passenger bus transport business. Its customer base is distinctively small-business and trader-heavy: shopkeepers, distributors, traders and small manufacturers in Karnataka, Maharashtra, Goa, Tamil Nadu, Telangana and beyond who book consignments at a local branch and then call to track them. That base speaks Kannada, Marathi, Hindi, Telugu and Tamil first, and interacts by phone rather than through portals. The bus business adds a consumer layer of ticket booking, seat availability, schedule and cancellation queries. Contact today is overwhelmingly branch-level telephone, supplemented by a website and app for tracking and bus booking.",
    strategicPressure: [
      { text: "VRL Logistics operates a very large owned fleet for less-than-truckload goods transport through an extensive branch network, alongside a passenger bus business, from its Hubballi base.", kind: "verified" },
      { text: "Its customer base of small traders and shopkeepers is phone-first and vernacular-first, so digital self-service adoption is structurally limited and calls remain the dominant channel.", kind: "verified" },
      { text: "Hundreds of branches each absorbing tracking and booking calls means the true customer-service cost is dispersed into branch staffing and never appears as a contact-centre line item.", kind: "inference" },
      { text: "Kannada, Marathi and Telugu voice service is not a nice-to-have but the actual language of the business, and is likely served better by branch staff than by any central system today.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "VRL is buy-led. It is a promoter-run, asset-heavy transporter whose capital goes into vehicles and branch infrastructure. Its technology estate is procured and modest, and there is no software organisation. Nothing about a trucking business argues for building conversational infrastructure, and vernacular voice is precisely the capability it cannot assemble internally.",
    whyNotBuild:
      "The requirement is high-quality Kannada, Marathi, Hindi, Telugu and Tamil speech on ordinary mobile calls from small-town callers, integrated into consignment tracking and bus reservation systems, running at a cost per call low enough to beat a branch clerk answering the phone. Each element is specialist; together they are a platform business. VRL's rational move is to buy the capability and point it at its own data.",
    workflows: [
      {
        name: "Consignment tracking and delivery-status enquiry",
        friction: "Traders call the booking branch to ask where a consignment is; branch staff interrupt loading and booking work to look it up, and at peak the phone simply goes unanswered.",
        outcome: "A vernacular voice line that identifies the consignment from a lorry receipt number and gives live status and expected arrival, removing routine lookups from branch staff entirely.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Consignment tracking / lorry receipt records", "Branch and hub scan data", "Transport management system", "SMS gateway"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Booking enquiry, rate quotation and pickup request",
        friction: "New and occasional shippers call branches to ask whether a route is served, what it costs and whether pickup is possible; answers vary by branch and quotes are inconsistent.",
        outcome: "Grounded serviceability, rate-band and transit-time answers in the caller's language, with pickup requests captured and routed to the correct branch with a reference number.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Route and serviceability master", "Rate master / tariff tables", "Branch allocation and pickup workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Bus ticket booking, schedule and cancellation support",
        friction: "Bus passengers call for seat availability, timings, boarding points and cancellations, competing with goods-transport calls on the same branch phones and during travel peaks.",
        outcome: "Passenger enquiries handled on a separate vernacular conversational line against live seat inventory, with bookings, cancellations and boarding-point details completed in-channel.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Bus reservation / seat inventory system", "Route and schedule master", "Payment gateway", "Boarding-point records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Website and mobile app offering consignment tracking and bus ticket booking",
        "Extensive branch and agency network taking bookings and calls in local languages",
        "SMS notifications on booking and delivery events",
        "Third-party bus-ticketing platform presence for the passenger business",
      ],
      gaps: [
        "Routine tracking calls consume branch staff who are simultaneously handling physical operations",
        "There is no central, measurable service line — customer contact is invisible above branch level",
        "Rate and serviceability answers are inconsistent between branches",
        "Bus and goods enquiries compete for the same branch phone at peak times",
      ],
    },
    risks: [
      "TRAI DND and commercial-communication rules apply to proactive shipper and passenger notifications, which must be structured as transactional.",
      "Rate quotation carries commercial risk: the agent must quote only from the approved tariff master, with negotiated-rate customers routed to the branch or account owner.",
      "Passenger-transport service commitments and refund rules on cancellations must be applied exactly, with disputes escalated to human staff.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions from branch density and phone-first customer behaviour across goods and bus businesses; because contact is dispersed across branches, actual volumes must be estimated jointly with operations in discovery rather than read from a contact-centre report.",
    },
    pilotScope:
      "An 8-week pilot running a Kannada, Marathi and Hindi consignment-tracking line for the Karnataka and Maharashtra branch cluster, grounded in lorry-receipt tracking data, measured on calls deflected from branch phones.",
    expansion: [
      "Extend to Telugu, Tamil and additional states, and add booking enquiry with grounded serviceability and tariff answers.",
      "Add pickup request capture routed to branches with confirmation references.",
      "Add the passenger bus line for seat availability, booking, boarding points and cancellations.",
    ],
    stakeholders: [
      "Managing Director / Promoter",
      "Chief Operating Officer, Goods Transport",
      "Head of Information Technology",
      "Head of Branch Operations",
      "Head of Passenger Transport (bus division)",
    ],
    discovery: [
      "How much of a branch clerk's day goes to answering tracking calls rather than booking and loading?",
      "Is consignment status available centrally in real time, or does it depend on branch data entry timing?",
      "Which languages dominate calls by region, and are they served by branch staff only?",
      "Are goods and bus enquiries handled on the same numbers today, and how is priority resolved at peak?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Hubballi trader calls in Kannada with a lorry receipt number and hears exactly which hub his consignment cleared and when it will arrive.",
  },

  "allcargo-gati": {
    operatingContext:
      "Gati, operating under Allcargo group ownership, is an express distribution company moving surface and air express consignments across India for business and small-business shippers, using a hub-and-spoke network of transhipment hubs, branches and franchise booking points. Its customer base spans manufacturers and distributors moving regular freight, e-commerce and direct-to-consumer sellers, and a long tail of small shippers who book at franchise counters. Under Allcargo ownership the business has been through a sustained turnaround focused on network rationalisation, service reliability and profitability rather than growth at any cost. Its everyday communication load is shipment status, delivery exceptions, pickup booking, POD retrieval and billing queries, arriving at branch numbers, a central customer-service line, a tracking portal and account managers.",
    strategicPressure: [
      { text: "Gati operates as an express distribution business under Allcargo group ownership and has been the subject of a sustained operational turnaround focused on network and profitability.", kind: "verified" },
      { text: "A turnaround mandate makes cost per customer contact a directly relevant metric, and favours interventions with a short and measurable payback over platform investment.", kind: "inference" },
      { text: "Delivery exceptions in express distribution are time-critical: an unresolved exception converts into a return or a service-level breach within days, so the speed of the customer conversation determines the outcome.", kind: "inference" },
      { text: "Franchise booking points likely generate their own query stream about bookings, rates and settlements that competes with shipper service on the same lines.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Gati is buy-led. It is a network operations business in turnaround, where discretionary spend must show payback. Its technology estate is procured transport management, tracking and billing systems supported by a modest IT function; neither Gati nor the Allcargo group operates a software product organisation that would build conversational infrastructure.",
    whyNotBuild:
      "A build would require multilingual speech, telephony spanning central and branch numbers, orchestration into tracking, POD and billing systems, and continuous quality evaluation — a fixed cost commitment that a turnaround balance sheet cannot justify. Buying converts it into a usage-linked cost measured directly against the contact cost it displaces.",
    workflows: [
      {
        name: "Delivery-exception handling and re-attempt coordination",
        friction: "Exceptions are worked by a calling team during office hours; consignees and shippers are contacted late, and unresolved cases become returns or SLA breaches that the account manager then has to defend.",
        outcome: "Immediate multilingual outreach on every exception that captures the reason, confirms a workable delivery arrangement, and writes the instruction into the operations system before the case ages.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Shipment tracking / exception queue", "Last-mile and branch delivery workflow", "Address records", "Shipper account records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Shipment status and expected-delivery enquiry",
        friction: "Shippers and consignees call the central line or a branch for status; at peak the queue is long and branch staff are pulled off operations to answer lookups.",
        outcome: "Instant grounded status and expected delivery from the tracking system on any channel in the caller's language, removing routine lookups from both the central line and branches.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Track-and-trace / scan data", "Transport management system", "Branch operations records", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Pickup booking and franchise-counter support",
        friction: "Pickup requests and franchise queries about bookings, rates and settlement statements go to branch staff and account managers, so answers depend on availability and vary in accuracy.",
        outcome: "Pickup requests captured and routed with confirmation references, and franchise partners served on a recognised channel with grounded booking, rate and settlement answers.",
        channels: ["Voice", "WhatsApp", "Web portal"],
        systems: ["Pickup / booking module", "Rate and tariff master", "Franchise settlement ledger", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Web and app track-and-trace for consignments",
        "Central customer-service line plus branch and franchise counter phone contact",
        "Exception and NDR calling operation for failed deliveries",
        "Account managers serving contracted shipper accounts",
      ],
      gaps: [
        "Exception outreach is limited by calling capacity, so cases age into returns and SLA breaches",
        "Routine status calls still consume branch and central agent time",
        "Franchise partners have no grounded self-service route for booking and settlement questions",
        "Regional-language coverage is thinner than the network's geographic spread",
      ],
    },
    risks: [
      "TRAI DND and commercial-communication rules on consignee and shipper outbound, which must be structured as transactional delivery coordination.",
      "Contracted shipper service levels mean automated status and ETA answers must be exactly grounded in scan data with audit trails, since an incorrect ETA becomes a commercial dispute.",
      "DPDP Act obligations on consignee data held on behalf of shipper clients, where Gati typically acts as processor under the client contract.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions from express-network volume and exception patterns; actual exception counts, central and branch call volumes and cost per contact must be validated with Gati operations, especially given ongoing network rationalisation.",
    },
    pilotScope:
      "An 8-week pilot handling delivery exceptions and status enquiries for two regions in Hindi, Telugu and English, grounded in the tracking system with re-attempt instructions written back, measured on exception resolution time and return rate.",
    expansion: [
      "Extend nationally with additional regional languages and elastic capacity for seasonal peaks.",
      "Add pickup booking capture with confirmation references routed to the correct branch.",
      "Stand up the franchise-partner desk with grounded booking, rate and settlement answers.",
    ],
    stakeholders: [
      "Chief Executive Officer, Gati Express",
      "Chief Operating Officer / Head of Network Operations",
      "Chief Information Officer / Head of Technology",
      "Head of Customer Service",
      "Chief Financial Officer (turnaround cost metrics)",
    ],
    discovery: [
      "How many delivery exceptions are raised weekly and what share are resolved before they age into returns?",
      "What is the current split between central customer-service calls and calls absorbed by branches?",
      "Can the operations system accept a re-attempt or delivery instruction from an external agent?",
      "What service levels do the largest shipper contracts specify, and how are breaches currently attributed?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Hyderabad distributor is called in Telugu within an hour of a failed delivery and reschedules it for the next morning with a corrected gate address.",
  },

  "mahindra-logistics": {
    operatingContext:
      "Mahindra Logistics is an asset-light third-party logistics provider inside the Mahindra group, operating integrated supply-chain services — warehousing, transportation management, in-plant logistics and freight forwarding — for automotive, e-commerce, consumer, pharmaceutical and engineering clients, alongside an enterprise mobility business providing employee transportation. Because it is asset-light, its value proposition is orchestration and service quality rather than owned fleet, and it runs operations on behalf of clients under contracted service levels. That creates three distinct communication populations: client operations teams asking about shipments and dispatch schedules, end consignees when Mahindra Logistics runs a client's last-mile delivery, and employees plus transport vendors in the mobility business. Contact today runs through client-dedicated coordinators, control towers, a driver and vendor coordination layer, and last-mile consignee calling for e-commerce clients.",
    strategicPressure: [
      { text: "Mahindra Logistics is an asset-light third-party logistics provider in the Mahindra group offering integrated supply-chain services plus an enterprise employee-mobility business.", kind: "verified" },
      { text: "An asset-light 3PL competes on service quality and cost-to-serve rather than on assets, so the labour cost of coordination is a direct margin lever.", kind: "verified" },
      { text: "Where it operates last-mile delivery for e-commerce clients, consignee communication is contractually its responsibility and its performance shows up in the client's own customer metrics.", kind: "inference" },
      { text: "Employee-transport operations generate a high-frequency, low-value contact stream — pickup timing, driver location, roster changes — that is probably absorbed by coordinators and helpdesks with no measurement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Mahindra Logistics is buy-led. Its differentiation is designing and running client supply chains, and its technology is a procured and integrated estate of warehouse, transport and mobility systems. Group software capability sits in a different company entirely, and this business unit buys platform capabilities that it then configures per client contract.",
    whyNotBuild:
      "Its communication requirement is multi-tenant by nature — different clients, different systems, different service levels, different languages — which is exactly the shape that argues for a configurable bought platform rather than a bespoke build. Adding speech, telephony and evaluation on top would be a permanent engineering commitment for a business that has deliberately chosen to be asset-light and orchestration-led.",
    workflows: [
      {
        name: "Last-mile delivery-exception coordination for client brands",
        friction: "When a delivery fails on a client's behalf, coordination depends on calling capacity that is sized per contract; delays show up directly in the client brand's own customer-experience metrics.",
        outcome: "Immediate multilingual consignee outreach that captures the reason, confirms slot and address, writes the re-attempt into the delivery system, and gives the client visible resolution performance.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Client order management system (OMS)", "Last-mile delivery and driver app", "Address records", "Client reporting dashboards"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Client operations desk for shipment and dispatch status",
        friction: "Client operations teams call or email dedicated coordinators for shipment status, dispatch confirmation and exception updates; coverage depends on the coordinator's shift and knowledge.",
        outcome: "A recognised client channel giving grounded shipment, dispatch and inventory-movement answers from warehouse and transport systems, with exceptions escalated to the control tower.",
        channels: ["Voice", "Email", "WhatsApp"],
        systems: ["Warehouse management system (WMS)", "Transport management system (TMS)", "Control-tower visibility platform", "Client SLA records"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Employee-transport coordination and driver-vendor support",
        friction: "Employees call helpdesks about cab timing, driver location and roster changes while transport vendors call about trip allocation and settlement, all handled by coordinators with no measurement.",
        outcome: "Employees get live trip and driver-location answers and roster changes in-channel, and vendors get grounded trip and settlement answers, with only exceptions reaching coordinators.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Employee transport management system", "Driver and vehicle tracking", "Roster and shift records", "Vendor settlement ledger"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Client-dedicated coordinator teams and control-tower visibility for contracted accounts",
        "Last-mile consignee calling operations run on behalf of e-commerce clients",
        "Employee-transport app and helpdesk for enterprise mobility customers",
        "Client dashboards and reporting against contracted service levels",
      ],
      gaps: [
        "Consignee exception coverage is sized per contract, so it flexes poorly during client peaks",
        "Client operations teams depend on a named coordinator being available for routine status",
        "Employee-transport contact is absorbed by helpdesks with no service measurement",
        "Regional-language coverage varies by contract rather than by the population being served",
      ],
    },
    risks: [
      "Client contracts define who owns consignee and employee data; Mahindra Logistics acts as processor, so consent, purpose limitation and retention flow from each contract under the DPDP Act.",
      "Contracted service levels require auditable performance evidence from any automated layer, not just aggregate deflection statistics.",
      "TRAI DND and commercial-communication rules on consignee outbound, which must be structured as transactional delivery coordination on behalf of the client brand.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions across last-mile consignee, client operations and employee-mobility contact streams; because volumes are contract-specific, discovery must scope one or two client contracts rather than assume an enterprise-wide number.",
    },
    pilotScope:
      "A 10-week pilot on one e-commerce client's last-mile operation, running consignee exception outreach in Hindi, Marathi and English with re-attempt instructions written into the delivery system and resolution performance reported to the client.",
    expansion: [
      "Extend to additional last-mile client contracts with Tamil, Telugu, Kannada and Bengali coverage.",
      "Add the client operations desk giving grounded shipment and dispatch answers from WMS and TMS.",
      "Add employee-transport coordination and driver-vendor support in the enterprise mobility business.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer, Supply Chain Management",
      "Chief Information Officer / Head of Technology",
      "Head of Enterprise Mobility Business",
      "Head of Key Account Management and Client Solutions",
    ],
    discovery: [
      "Which client contracts explicitly include consignee communication in scope, and what service levels attach to it?",
      "How is exception-calling capacity sized today, and what happens during a client's peak sale period?",
      "Can client OMS and last-mile systems accept re-attempt instructions from an external agent under the contract's integration terms?",
      "In enterprise mobility, how many employee and vendor contacts per month are handled, and is that cost recovered contractually?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A consignee in Nashik is contacted in Marathi minutes after a failed delivery and the corrected address flows straight into the client brand's delivery system.",
  },

  "adani-electricity-mumbai": {
    operatingContext:
      "Adani Electricity Mumbai is the integrated distribution licensee for a large part of Mumbai — principally the suburbs — serving millions of residential, commercial and industrial consumers in one of the densest and most demanding urban licence areas in India, with generation and transmission assets attached to the distribution business. Its consumers are a mix of high-rise residential societies, chawls and dense low-income neighbourhoods, small shops and large commercial establishments, spread across a Marathi, Hindi, Gujarati and English speaking population. Its communication load is relentless and event-driven: local outages and supply complaints, monthly billing disputes and high-bill queries, meter faults and replacements, name-change and load-change applications, new connections, and payment reminders and disconnection notices. Consumers reach it today through a consumer app and web portal, a 24-hour complaint helpline, IVR self-service, WhatsApp servicing, SMS outage notifications and physical customer-care centres.",
    strategicPressure: [
      { text: "Adani Electricity Mumbai is the distribution licensee for a large part of Mumbai serving millions of consumers, and operates under Maharashtra electricity regulatory oversight with defined consumer service standards.", kind: "verified" },
      { text: "Distribution licensees are held to regulator-defined standards of performance on complaint response and restoration, so service failures carry regulatory as well as reputational consequence.", kind: "verified" },
      { text: "Monsoon and summer create sharp, correlated demand spikes: a single feeder fault in a dense suburb generates thousands of calls in minutes, which no staffed queue can absorb.", kind: "inference" },
      { text: "High-bill disputes after summer months are likely the single largest driver of avoidable long-duration calls, because explaining consumption requires walking a consumer through meter data conversationally.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Adani Electricity is buy-led for this capability. Distribution utilities procure their consumer-facing technology stack — billing and customer information systems, outage management, metering platforms, contact-centre software — and integrate it. Its engineering capability is in network operations and metering, not in speech and conversational orchestration, and utility procurement culture is explicitly vendor-led with defined scope and service levels.",
    whyNotBuild:
      "Absorbing an outage spike needs elastic telephony and speech capacity that is idle most of the month, in Marathi, Hindi, Gujarati and English, grounded live in the outage management and billing systems, with every interaction logged to a standard a regulator can audit. Building that means a permanent platform team inside a utility whose engineering priorities are network reliability and metering — and the capacity economics only work if the capacity is rented, not owned.",
    workflows: [
      {
        name: "Outage reporting, status and restoration communication",
        friction: "A feeder fault produces a call flood; the helpline saturates, consumers redial repeatedly, and each caller is told the same thing an agent reads from the outage system after taking their details.",
        outcome: "Consumers are identified by their calling number, told the known fault and estimated restoration immediately in their language, and proactively notified on restoration — collapsing repeat calls and giving the utility auditable response evidence.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Outage management system", "Consumer information / billing system (CIS)", "SCADA and feeder data", "Field crew work-order system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "High-bill and billing-dispute explanation",
        friction: "Bill disputes require an agent to compare consumption history, tariff slabs and meter readings and explain them; calls are long, agents are inconsistent, and unresolved disputes escalate into regulatory grievances.",
        outcome: "A grounded conversation that walks the consumer through their own consumption history, slab movement and meter reading in their language, books a meter test where genuinely warranted, and escalates only real disputes.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Consumer information / billing system (CIS)", "Meter data management", "Tariff master", "Grievance and complaint register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Payment reminders, disconnection notices and connection-service requests",
        friction: "Payment reminders go out as generic SMS; name-change, load-change and new-connection applications require document submission and stall silently, generating repeat status calls.",
        outcome: "Two-way reminders with payment links and instalment guidance where policy permits, and guided service applications where the document checklist is tracked and the consumer is told each stage without calling.",
        channels: ["WhatsApp", "Voice", "SMS", "App"],
        systems: ["CIS billing and receivables", "Payment gateway", "New-connection / service-request workflow", "Document repository"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer mobile app and web portal for bill view, payment and complaint registration",
        "24-hour complaint helpline with IVR self-service options",
        "WhatsApp servicing for bill and basic service requests",
        "SMS notifications for bills, payments and planned outages",
      ],
      gaps: [
        "The helpline cannot absorb a mass-outage call spike, so consumers experience busy tones at the worst moment",
        "High-bill disputes cannot be explained conversationally without a long agent call",
        "Service applications like name change and load change stall without proactive status communication",
        "IVR containment is limited to simple transactions and collapses for anything requiring explanation",
      ],
    },
    risks: [
      "Regulator-defined standards of performance govern complaint response and restoration timelines; any automated layer must produce auditable evidence of when a consumer was informed and what they were told.",
      "TRAI DND and commercial-communication rules constrain outbound; outage and billing notifications must be classified and sent as transactional service messages.",
      "Safety and emergency separation: electrical hazard and live-wire reports must bypass automation entirely and route straight to emergency dispatch, with that path independently reliable.",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from consumer-base scale and utility contact patterns including monsoon and summer peaks; actual helpline volumes, current IVR containment and cost per contact must be validated with the customer-care function in discovery.",
    },
    pilotScope:
      "A 10-week pilot absorbing outage-reporting and outage-status calls for two suburban divisions in Marathi, Hindi and English, grounded in the outage management system with proactive restoration notification, measured on call abandonment during fault events.",
    expansion: [
      "Extend outage handling across the full licence area and add proactive planned-outage and restoration messaging.",
      "Add high-bill and billing-dispute explanation grounded in consumption history and meter data.",
      "Add payment reminders with in-channel payment and guided new-connection, name-change and load-change applications.",
    ],
    stakeholders: [
      "Chief Executive Officer, Distribution Business",
      "Chief Operating Officer / Head of Distribution Operations",
      "Head of Customer Service / Consumer Experience",
      "Chief Information Officer / Head of IT and Digital",
      "Head of Regulatory Affairs and Compliance",
    ],
    discovery: [
      "During a major feeder fault, how many calls arrive in the first hour and what share are abandoned?",
      "Can the outage management system expose fault and estimated-restoration data in real time to a consumer-facing agent?",
      "What proportion of helpline handling time is spent on high-bill explanation, and what is the average call duration?",
      "What evidence does the regulator require on consumer complaint response, and would automated interaction logs satisfy it?",
    ],
    flowTemplate: "inbound-service",
    scenario: "During a suburban Mumbai feeder fault, a consumer hears in Marathi within seconds which area is affected and the estimated restoration time, without waiting in a queue.",
  },

  "bses-rajdhani-power": {
    operatingContext:
      "BSES Rajdhani Power is the electricity distribution licensee for south and west Delhi, serving millions of consumers across a mix of affluent colonies, dense urban villages, unauthorised and resettlement colonies, and substantial commercial and institutional load. Delhi's distribution environment is distinctive: consumers are used to a subsidy regime with slab-linked benefits, summer demand peaks are extreme, and the regulator sets explicit service standards that discoms are publicly measured against. Its consumers are overwhelmingly Hindi-first, contact it by phone far more than by app, and call about local power failures, bills that jump when subsidy thresholds are crossed, meter faults and replacements, new connections and load enhancements, and disconnection and reconnection matters. Access today runs through a 24-hour complaint number, IVR, a consumer app and web portal, WhatsApp servicing and division-level customer-care centres.",
    strategicPressure: [
      { text: "BSES Rajdhani distributes electricity across south and west Delhi under Delhi's electricity regulatory framework, which sets published consumer service standards for discoms.", kind: "verified" },
      { text: "Delhi's consumer subsidy regime makes billing sensitive to consumption thresholds, so a small increase in usage can produce a large bill change and a predictable spike in dispute calls.", kind: "verified" },
      { text: "Summer peak demand drives both local outages and high-bill complaints simultaneously, creating the year's worst call volume exactly when consumer tolerance is lowest.", kind: "inference" },
      { text: "Discom budgets are regulator-constrained, so headcount-led capacity expansion is effectively unavailable and automation is the only lever that scales with the peak.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "BSES Rajdhani is buy-led. Discoms procure their entire consumer technology stack through tendered vendor engagements — billing and CIS, outage management, contact centre — and operate under regulated cost structures that make internal platform building implausible. Its engineering focus is network reliability and loss reduction, not software product development.",
    whyNotBuild:
      "Handling a Delhi summer evening means absorbing a call surge in Hindi with live grounding in outage and billing systems and an audit trail the regulator can inspect. Building that requires speech, telephony and evaluation expertise a discom has no route to hiring or retaining, and a capital case that a regulated tariff structure will not easily accommodate. Renting elastic capacity that matches the seasonal shape is the only economically coherent answer.",
    workflows: [
      {
        name: "Power-failure reporting and restoration status",
        friction: "During a local failure the complaint number saturates; consumers redial and register duplicate complaints, and agents spend the call taking details the system could infer from the calling number.",
        outcome: "Instant identification, known-fault status and estimated restoration in Hindi, duplicate complaints suppressed automatically, and proactive restoration confirmation — with every interaction time-stamped for regulatory reporting.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Outage / complaint management system", "Consumer information system (CIS)", "Feeder and network data", "Field crew dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "High-bill explanation and subsidy-threshold queries",
        friction: "When consumption crosses a subsidy threshold the bill jumps sharply; consumers call convinced the meter is faulty, and agents spend long calls explaining slabs and subsidy rules inconsistently.",
        outcome: "A grounded explanation of the consumer's own consumption, slab movement and subsidy applicability in Hindi, with genuine meter-fault suspicions converted into a booked meter test rather than a repeated argument.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["CIS billing", "Meter data / reading records", "Tariff and subsidy rules master", "Meter-testing work orders"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New connection, load change and meter service requests",
        friction: "Applications require documents and site inspections; consumers cannot see where their application stands and call repeatedly, while incomplete documents stall cases silently.",
        outcome: "Guided applications with a tracked document checklist, proactive stage updates at each step including inspection scheduling, and human escalation only where a decision is required.",
        channels: ["WhatsApp", "Voice", "App", "Web"],
        systems: ["New-connection / service-request workflow", "Document repository", "Field inspection scheduling", "CIS consumer records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "24-hour complaint helpline with IVR self-service",
        "Consumer mobile app and web portal for bills, payments and complaint registration",
        "WhatsApp servicing for bill and basic service requests",
        "Division-level customer-care centres and SMS notifications",
      ],
      gaps: [
        "The complaint line cannot absorb summer-evening outage surges without abandonment",
        "Subsidy and slab-driven bill changes are not explained to consumers before they call",
        "Service-application status is opaque, generating repeat status calls",
        "Duplicate complaint registration during mass outages inflates the queue and distorts reporting",
      ],
    },
    risks: [
      "Delhi's regulator publishes consumer service standards for discoms; automated interactions must generate auditable timing and content evidence to support compliance reporting.",
      "Subsidy rules are policy-set and change; any statement about subsidy applicability must be grounded in the current rules master and never inferred by the agent.",
      "Electrical safety reports — live wires, sparking, fallen conductors — must bypass automation and reach emergency dispatch directly, with that path tested independently.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions from consumer-base scale and Delhi discom contact patterns with pronounced summer peaks; helpline volumes, current containment and cost per contact must be validated with customer-care and regulatory teams in discovery.",
    },
    pilotScope:
      "A 10-week pilot absorbing power-failure reporting and status calls for two south Delhi divisions in Hindi and English, grounded in the complaint and outage systems with duplicate suppression and proactive restoration messaging.",
    expansion: [
      "Extend outage handling across the full licence area with proactive planned-outage notification.",
      "Add high-bill and subsidy-threshold explanation grounded in consumption and tariff rules.",
      "Add guided new-connection, load-change and meter service applications with tracked document checklists.",
    ],
    stakeholders: [
      "Chief Executive Officer, BSES Rajdhani",
      "Head of Distribution Operations",
      "Head of Customer Care",
      "Chief Information Officer / Head of IT",
      "Head of Regulatory Affairs",
    ],
    discovery: [
      "On a peak summer evening, what is the call arrival rate on the complaint number and the abandonment percentage?",
      "How many duplicate complaints are registered per genuine fault, and does the system deduplicate today?",
      "What share of billing calls relate to subsidy thresholds and slab movement rather than genuine meter faults?",
      "What consumer-service evidence does the regulator require, and would automated interaction logs be accepted?",
    ],
    flowTemplate: "inbound-service",
    scenario: "On a 45-degree Delhi evening a consumer in Dwarka reports a power failure in Hindi and is told the fault is known and crews are en route, without waiting on hold.",
  },

  "bses-yamuna-power": {
    operatingContext:
      "BSES Yamuna Power is the electricity distribution licensee for east and central Delhi — a licence area that includes some of the city's densest older neighbourhoods, walled-city commercial clusters, and mixed residential and small-industrial pockets. Compared with its sister discom it serves a smaller but denser consumer base with a different load profile: heavy small-commercial concentration, narrow-lane network infrastructure that is harder to maintain, and historically greater exposure to distribution losses and theft-related enforcement activity. Consumers are almost entirely Hindi-first, phone-first, and contact the discom about local supply failures, voltage complaints, bills, meter issues, connection changes for shops and small businesses, and reconnection after disconnection. Access today is via a 24-hour complaint number and IVR, a consumer app and portal, WhatsApp servicing, and local customer-care centres.",
    strategicPressure: [
      { text: "BSES Yamuna distributes electricity across east and central Delhi under the same Delhi regulatory framework and published service standards as other city discoms.", kind: "verified" },
      { text: "Dense older network areas with high small-commercial load produce frequent localised faults, so complaint volume per consumer is structurally higher than in planned colonies.", kind: "inference" },
      { text: "Loss reduction and enforcement activity generate their own consumer contact stream — disconnection, reconnection, assessment disputes — that is adversarial and currently entirely human-handled.", kind: "inference" },
      { text: "Because the two BSES discoms share operating heritage, technology procurement is likely coordinated, which makes a proven deployment in one a fast follow in the other.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "BSES Yamuna is buy-led. It operates under the same regulated cost structure and vendor-procurement model as other Indian discoms, with technology delivered through tendered engagements. It has no software organisation, and a smaller consumer base makes any internal platform build even less defensible on cost per consumer.",
    whyNotBuild:
      "The problem is peak absorption and grounded explanation in Hindi, plus an audit trail regulators accept. Every component — speech, telephony, orchestration into CIS and outage systems, continuous evaluation — is a specialist function. For a discom of this size the fixed cost of owning them could never be recovered, whereas a bought layer prices against the calls it actually handles.",
    workflows: [
      {
        name: "Supply-failure and voltage-complaint handling",
        friction: "Localised faults in dense areas generate rapid call clusters; the helpline saturates and consumers in the same lane each register separate complaints that field teams then have to reconcile.",
        outcome: "Callers identified by number and matched to known faults instantly, duplicate complaints clustered automatically, and restoration confirmed proactively — giving field teams a clean, deduplicated work queue.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Complaint / outage management system", "Consumer information system (CIS)", "Network and feeder records", "Field crew dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Small-commercial connection, load-change and reconnection requests",
        friction: "Shopkeepers and small businesses need load enhancements, category changes and reconnections quickly because supply directly affects trade; applications stall on documents and inspections with no visible status.",
        outcome: "Guided applications with tracked checklists, inspection scheduling and stage-by-stage status in Hindi, so a shopkeeper knows exactly what is pending without visiting a customer-care centre.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Service-request / connection workflow", "Document repository", "Field inspection scheduling", "CIS consumer and category records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing queries, payment reminders and reconnection facilitation",
        friction: "Disconnection for non-payment generates urgent, often heated calls; reminders before disconnection are generic SMS, and after payment the reconnection status is opaque.",
        outcome: "Two-way reminders before disconnection with payment links and policy-permitted arrangements, and after payment an automatic reconnection-status conversation that removes the panic call entirely.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["CIS billing and receivables", "Payment gateway", "Disconnection and reconnection work orders", "Consent register"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "24-hour complaint helpline with IVR options",
        "Consumer app and web portal for bills, payment and complaint logging",
        "WhatsApp servicing for routine bill and service requests",
        "Local customer-care centres and SMS notifications",
      ],
      gaps: [
        "Call clusters from a single dense-area fault overwhelm the helpline and create duplicate complaints",
        "Small-commercial consumers cannot track connection and load-change applications without visiting a centre",
        "Reconnection status after payment is not communicated, generating urgent repeat calls",
        "Explanation-heavy billing conversations have no self-service path at all",
      ],
    },
    risks: [
      "Delhi regulatory service standards apply, so automated interactions must produce auditable evidence of response timing and content.",
      "Disconnection, assessment and theft-related conversations are legally sensitive and often adversarial — these must route to trained human staff rather than be handled conversationally.",
      "Electrical safety and hazard reports must bypass automation entirely into emergency dispatch, with an independently reliable path.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions from consumer-base scale and dense-area fault frequency; actual complaint volumes, duplicate rates and cost per contact must be validated with BSES Yamuna customer-care leadership in discovery.",
    },
    pilotScope:
      "An 8-week pilot handling supply-failure reporting and status for two east Delhi divisions in Hindi, with automatic duplicate clustering against the complaint system and proactive restoration messaging.",
    expansion: [
      "Extend across the licence area and add planned-outage and voltage-complaint handling.",
      "Add guided small-commercial connection, load-change and category-change applications with tracked checklists.",
      "Add pre-disconnection reminders with payment links and automatic reconnection-status communication.",
    ],
    stakeholders: [
      "Chief Executive Officer, BSES Yamuna",
      "Head of Distribution Operations",
      "Head of Customer Care",
      "Head of Information Technology",
      "Head of Regulatory Affairs and Commercial",
    ],
    discovery: [
      "How many duplicate complaints does a single dense-area fault typically generate?",
      "Do the two BSES discoms procure customer-care technology jointly, and would a pilot in one extend to the other?",
      "What is the current turnaround on a small-commercial load-change application, and where does it stall?",
      "How is reconnection after payment communicated today, and how many calls does that generate?",
    ],
    flowTemplate: "inbound-service",
    scenario: "Six households in a Shahdara lane report the same outage and are each told in Hindi that the fault is logged and a crew is already assigned.",
  },

  "tata-power-ddl": {
    operatingContext:
      "Tata Power Delhi Distribution is the distribution licensee for north and north-west Delhi, structured as a joint venture between Tata Power and the Delhi government, serving millions of consumers across planned colonies, unauthorised settlements, industrial areas and dense urban villages. It is widely regarded as one of India's most modernisation-forward discoms: it has been an early and visible adopter of smart metering, advanced distribution automation, analytics-driven loss reduction and digital consumer channels, and it is frequently used as a reference site for utility technology in India. Its consumer conversations centre on supply interruptions, bills — increasingly smart-meter and prepaid-linked — meter and connection services, and payment. Consumers reach it through a consumer app and portal, a 24-hour helpline with IVR, WhatsApp servicing, chatbot channels and customer-care centres.",
    strategicPressure: [
      { text: "Tata Power-DDL is a Tata Power and Delhi government joint venture distributing electricity in north Delhi, with a well-established public reputation for smart metering and distribution technology adoption.", kind: "verified" },
      { text: "Smart and prepaid metering changes the consumer conversation fundamentally — balance, top-up, consumption alerts and disconnection thresholds become continuous interactions rather than monthly ones.", kind: "verified" },
      { text: "A discom that positions itself as a technology showcase has both the internal appetite and the external incentive to be an early reference deployment for agentic consumer communication.", kind: "inference" },
      { text: "Its existing digital channel adoption is probably higher than peer discoms, which means the residual call volume is skewed toward the harder, explanation-heavy conversations that simple IVR and chatbots cannot handle.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Tata Power-DDL is buy-led, but it is a sophisticated buyer. It procures and integrates best-in-class utility technology and has the internal capability to evaluate, deploy and measure it rigorously — which is exactly what makes it a strong lighthouse account. It does not build consumer-facing platform software; it selects, integrates and then publicises results.",
    whyNotBuild:
      "Its own modernisation record shows the pattern: it buys advanced platforms and integrates them into a strong operational core. Speech, telephony, orchestration and evaluation for conversational AI are no different — specialist capabilities where the discom's advantage lies in deploying and measuring well, not in building. The value it wants is a proven, auditable outcome it can demonstrate publicly.",
    workflows: [
      {
        name: "Smart-meter and prepaid billing, balance and top-up support",
        friction: "Prepaid and smart-meter consumers generate continuous questions about balance, consumption, top-up and imminent disconnection thresholds; app self-service covers the confident users and the rest call.",
        outcome: "Conversational balance, consumption and top-up handling in Hindi and English with proactive low-balance and threshold alerts, so consumers are warned before supply is affected rather than after.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Meter data management (MDM)", "Consumer information / billing system (CIS)", "Prepaid vending and payment gateway", "Head-end metering system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Outage reporting, restoration status and planned-shutdown communication",
        friction: "Faults produce call clusters that overwhelm the helpline, and planned shutdown notifications go out as generic SMS that consumers do not connect to their own supply.",
        outcome: "Instant grounded fault and restoration status per consumer, duplicate complaints suppressed, and planned shutdowns communicated conversationally with the consumer's own supply context.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Outage management system", "Distribution automation / SCADA", "CIS consumer-to-feeder mapping", "Field crew dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Connection, meter-service and rooftop-solar application support",
        friction: "New connections, load changes, meter replacements and rooftop solar net-metering applications all require documents, inspections and approvals, and applicants call repeatedly for status.",
        outcome: "Guided applications with tracked document checklists, inspection scheduling and proactive stage updates, with technical and approval decisions routed to engineers.",
        channels: ["WhatsApp", "Voice", "Web", "App"],
        systems: ["Service-request and connection workflow", "Net-metering / solar application system", "Field inspection scheduling", "Document repository"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Consumer app and web portal with bill, payment, complaint and smart-meter consumption views",
        "24-hour helpline with IVR plus WhatsApp and chatbot servicing channels",
        "Smart and prepaid metering with consumption and alert infrastructure",
        "Customer-care centres and SMS notification programmes",
      ],
      gaps: [
        "Explanation-heavy conversations still require an agent because existing chatbots handle only structured transactions",
        "Prepaid and smart-meter consumers are not proactively warned conversationally before threshold events",
        "Outage call clusters still saturate the helpline despite strong digital adoption",
        "Solar and net-metering applicants have no guided, status-transparent journey",
      ],
    },
    risks: [
      "Delhi regulatory service standards require auditable evidence of consumer complaint handling, which an automated layer must produce natively.",
      "Prepaid disconnection thresholds are consequential — any balance or threshold statement must be grounded in live meter data, never estimated.",
      "Electrical safety and hazard reports must bypass automation into emergency dispatch, and this path must be independently reliable during mass events.",
    ],
    economics: {
      volumeMonthly: 1800000,
      costPerInteraction: 0.9,
      automationRate: 0.65,
      basis: "Seller assumptions from consumer-base scale and above-average digital adoption, which raises achievable automation but leaves harder residual calls; actual helpline volumes, containment rates and cost per contact must be validated in discovery.",
    },
    pilotScope:
      "A 10-week lighthouse pilot handling smart-meter and prepaid balance, consumption and top-up conversations plus low-balance alerts in Hindi and English, grounded in meter data management, with published outcome metrics.",
    expansion: [
      "Add outage reporting, restoration status and consumer-specific planned-shutdown communication.",
      "Add guided connection, load-change and meter-service applications with tracked checklists.",
      "Add rooftop-solar and net-metering application support, and package the deployment as a public utility reference case.",
    ],
    stakeholders: [
      "Chief Executive Officer, Tata Power-DDL",
      "Chief Operating Officer / Head of Distribution",
      "Head of Customer Services",
      "Chief Information Officer / Head of Digital and Smart Metering",
      "Head of Regulatory Affairs",
    ],
    discovery: [
      "What is the current digital-channel containment rate, and what call types make up the residual volume?",
      "Can meter data management provide live balance and consumption to a consumer-facing conversational agent?",
      "Would leadership support a publicly-referenceable lighthouse deployment, and what outcome metrics would it need to show?",
      "How are planned shutdowns communicated today, and is the consumer-to-feeder mapping reliable enough for personalised notification?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A prepaid consumer in Rohini is warned in Hindi that her balance will run out by Thursday and tops up through a link in the same conversation.",
  },

  "torrent-power": {
    operatingContext:
      "Torrent Power is an integrated power utility with generation, transmission and distribution operations, and is best known in distribution for its licensed areas in Ahmedabad, Gandhinagar and Surat plus distribution franchise operations in cities including Bhiwandi, Agra and areas of Uttar Pradesh — a model where it takes over an existing state-utility distribution area and turns around its losses and service quality. That franchise model shapes everything about its consumer communication: it inherits consumer bases with poor service history, high loss levels and low trust, and must visibly improve billing accuracy, complaint response and connection turnaround to establish credibility. Its consumers span Gujarati-speaking Ahmedabad and Surat, Marathi-speaking Bhiwandi with a dense powerloom industrial base, and Hindi-speaking Agra. Contact runs through consumer apps and portals, 24-hour helplines, IVR, WhatsApp and local customer-care centres.",
    strategicPressure: [
      { text: "Torrent Power operates licensed electricity distribution in Ahmedabad, Gandhinagar and Surat alongside distribution franchise operations in cities such as Bhiwandi and Agra.", kind: "verified" },
      { text: "The distribution franchise model requires visible, measurable service improvement in inherited areas, so consumer communication quality is directly tied to the commercial case for each franchise.", kind: "verified" },
      { text: "Operating across Gujarati, Marathi and Hindi consumer bases with different service histories means a single call-centre design cannot serve all areas equally well.", kind: "inference" },
      { text: "Torrent's reputation for operating efficiency implies management will evaluate any automation strictly on measurable cost-to-serve and complaint-resolution metrics rather than on novelty.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Torrent Power is buy-led. It is a utility operator whose competitive skill is running distribution networks efficiently and turning around franchise areas. Technology is procured — billing and CIS, metering, outage management, contact centre — and deployed area by area. There is no software product organisation, and the franchise model rewards fast, repeatable deployment over bespoke building.",
    whyNotBuild:
      "Each new franchise area needs consumer service capability standing up quickly in the local language against an inherited system estate. Building a conversational platform would make every new area a bespoke engineering project; buying a configurable one makes it a deployment. Speech across Gujarati, Marathi and Hindi, telephony, orchestration and evaluation are exactly the components a utility should rent rather than own.",
    workflows: [
      {
        name: "Billing accuracy queries and bill explanation",
        friction: "In franchise areas consumers distrust bills inherited from the previous regime; disputes are frequent, calls are long, and explanation quality varies by agent, undermining the credibility the franchise depends on.",
        outcome: "Grounded bill explanation walking the consumer through their own reading history, tariff slab and any arrears in their own language, with genuine disputes converted into booked meter tests rather than repeated arguments.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Consumer information / billing system (CIS)", "Meter reading and MDM records", "Tariff master", "Grievance register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Supply-interruption reporting and restoration status",
        friction: "Interruptions trigger call surges; in industrial areas like Bhiwandi a supply failure halts production and generates urgent commercial escalation alongside residential complaints.",
        outcome: "Immediate grounded fault and restoration status per consumer with duplicate suppression, and priority routing of industrial and commercial consumers to the appropriate escalation path.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Outage / complaint management", "CIS consumer category and feeder mapping", "SCADA and network data", "Field crew dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New connection and service-request onboarding",
        friction: "Connection applications in franchise areas are a trust test — slow turnaround confirms consumers' expectations from the previous regime; documents stall and applicants must visit offices for status.",
        outcome: "Guided applications with tracked document checklists, inspection scheduling and proactive stage updates in the local language, demonstrably faster than the inherited process.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["New-connection / service-request workflow", "Document repository", "Field inspection scheduling", "CIS consumer records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer apps and web portals for bills, payments and complaints across licensed and franchise areas",
        "24-hour helplines with IVR self-service",
        "WhatsApp servicing for routine bill and service transactions",
        "Local customer-care centres in each licensed and franchise area",
      ],
      gaps: [
        "Bill explanation, the highest-trust-value conversation in a franchise area, has no self-service path",
        "Language coverage differs by area and is staffed rather than platform-provided",
        "Connection-application status requires an office visit or repeat calls",
        "Industrial and commercial consumers are not distinguished from residential in the inbound queue",
      ],
    },
    risks: [
      "State regulatory service standards differ across Gujarat, Maharashtra and Uttar Pradesh operations, so compliance evidence requirements are not uniform across the footprint.",
      "Distribution franchise agreements carry specific service and loss-reduction commitments that any consumer-facing change must support and evidence.",
      "Electrical safety reports must bypass automation into emergency dispatch, and industrial supply failures need a distinct commercial escalation path.",
    ],
    economics: {
      volumeMonthly: 1600000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions across licensed and franchise consumer bases; area-level call volumes, current containment and cost per contact vary considerably between Ahmedabad, Surat and franchise cities and must be validated area by area in discovery.",
    },
    pilotScope:
      "A 10-week pilot handling bill-explanation and billing-dispute calls in the Ahmedabad licence area in Gujarati, Hindi and English, grounded in reading history and tariff data, measured on call duration and repeat-contact rate.",
    expansion: [
      "Extend to Surat and Gandhinagar, then to Bhiwandi and Agra franchise areas with Marathi and Hindi coverage.",
      "Add supply-interruption reporting with duplicate suppression and separate industrial escalation routing.",
      "Add guided new-connection and service-request onboarding as a visible franchise service-improvement metric.",
    ],
    stakeholders: [
      "Managing Director / Executive Director, Distribution",
      "Head of Distribution Operations (licensed and franchise areas)",
      "Head of Customer Care",
      "Chief Information Officer / Head of IT",
      "Head of Regulatory and Franchise Compliance",
    ],
    discovery: [
      "What share of helpline calls are billing disputes, and how does that differ between licensed and franchise areas?",
      "What service and turnaround commitments do the franchise agreements specify for consumer complaints and new connections?",
      "Which languages are staffed in each area today, and where is service delivered in a second-choice language?",
      "Are industrial and commercial consumers routed differently on supply failure, and should they be?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "An Ahmedabad consumer disputing a high bill is walked through her own six-month reading history in Gujarati and books a meter test in the same call.",
  },

  "cesc-kolkata": {
    operatingContext:
      "CESC is the integrated electricity utility for the Kolkata licence area, generating, transmitting and distributing power to millions of consumers across a dense, largely Bengali-speaking metropolitan territory that includes the old city, commercial districts, and surrounding municipal areas. Part of the RP-Sanjiv Goenka group and more than a century old, it operates one of India's oldest continuously-run distribution networks, with a mix of underground and overhead infrastructure in narrow, congested streets. Its communication load is shaped by geography and weather: the Bengal monsoon and periodic cyclonic events cause widespread, sustained outages that produce enormous call surges, while routine volume is billing queries, meter and connection services, and payment. Consumers reach CESC through a consumer app and web portal, a 24-hour helpline with IVR, WhatsApp servicing, SMS notifications and regional customer-care offices.",
    strategicPressure: [
      { text: "CESC is the long-established integrated electricity utility for the Kolkata licence area, part of the RP-Sanjiv Goenka group, serving millions of consumers.", kind: "verified" },
      { text: "Kolkata's monsoon season and periodic cyclonic weather cause sustained multi-day outage events that generate call volumes far beyond any staffed helpline's capacity.", kind: "verified" },
      { text: "A Bengali-first consumer base is served by a market where high-quality Bengali voice automation is genuinely scarce, so this is a language capability CESC cannot simply procure from generic vendors.", kind: "inference" },
      { text: "A century-old network in congested streets means fault localisation and restoration estimates are harder to give precisely, which makes honest, frequent status communication more valuable than exact ETAs.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "CESC is buy-led. It is an operating utility that modernises through procurement, with technology delivered by vendors under defined scope. Its engineering strength is network operations and generation, not software; there is no internal path to building Bengali speech systems and conversational orchestration.",
    whyNotBuild:
      "The specific requirement — production-grade Bengali voice that works on ordinary mobile calls from elderly and less-literate consumers, at surge volumes during a cyclone, grounded in the outage and billing systems — is a specialist capability. No Indian utility has built that internally, and the value CESC needs is elastic capacity that exists only for the weeks it is needed.",
    workflows: [
      {
        name: "Storm and monsoon outage reporting at surge volume",
        friction: "A cyclonic event or heavy monsoon spell produces widespread faults and a call flood that saturates every line for days; consumers cannot get through, and the utility cannot tell affected areas what it does know.",
        outcome: "Unlimited concurrent Bengali-language handling that identifies the consumer, states known area status and restoration progress honestly, logs new fault reports, and pushes updates as crews progress.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Outage / fault management system", "Consumer information system (CIS)", "Network and feeder records", "Field crew dispatch and restoration tracking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing queries and bill explanation in Bengali",
        friction: "Bill disputes and consumption questions require explanation that IVR cannot provide; consumers wait for an agent or visit a customer-care office, and older consumers in particular prefer conversation to app self-service.",
        outcome: "Grounded bill explanation in Bengali covering reading history, slab movement and arrears, with meter tests booked where genuinely warranted and complaints registered with reference numbers.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["CIS billing", "Meter reading records", "Tariff master", "Grievance and complaint register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New connection, name change and meter service requests",
        friction: "Service applications require documents and inspections and are tracked poorly, so applicants call repeatedly or visit regional offices to learn where their case stands.",
        outcome: "Guided applications in Bengali with tracked document checklists, inspection scheduling and proactive stage updates, reducing office footfall and repeat status calls.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Service-request / connection workflow", "Document repository", "Field inspection scheduling", "CIS consumer records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer app and web portal for bills, payments and complaint registration",
        "24-hour helpline with IVR self-service options",
        "WhatsApp servicing for routine bill and service transactions",
        "Regional customer-care offices and SMS notification programmes",
      ],
      gaps: [
        "Storm-event call surges cannot be absorbed, so consumers are left without information for days",
        "Bengali-language service depth is staffed rather than platform-provided, and collapses at peak",
        "Bill explanation requires an agent or an office visit",
        "Service-application status is not communicated proactively",
      ],
    },
    risks: [
      "West Bengal regulatory service standards apply to complaint response and restoration, requiring auditable evidence from any automated layer.",
      "During cyclonic events, statements about restoration timing carry public-safety and public-trust weight — the agent must communicate known status honestly rather than generate estimates.",
      "Electrical hazard reports, including fallen conductors after storms, must bypass automation directly into emergency dispatch with an independently reliable path.",
    ],
    economics: {
      volumeMonthly: 1400000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions from consumer-base scale with heavy monsoon-season skew; baseline and storm-peak call volumes, current containment and cost per contact must be validated with CESC customer-care leadership in discovery.",
    },
    pilotScope:
      "A 10-week pilot, timed ahead of monsoon, absorbing outage reporting and status calls for two Kolkata districts in Bengali, Hindi and English, grounded in the fault management system with proactive restoration updates.",
    expansion: [
      "Extend across the full licence area with surge capacity provisioned for cyclonic events.",
      "Add Bengali bill explanation and billing-dispute handling with meter-test booking.",
      "Add guided connection, name-change and meter-service applications with tracked checklists.",
    ],
    stakeholders: [
      "Managing Director, CESC",
      "Head of Distribution Operations",
      "Head of Customer Services",
      "Chief Information Officer / Head of IT",
      "Head of Regulatory Affairs",
    ],
    discovery: [
      "During the last major storm event, what call volume arrived and what share was answered?",
      "How is Bengali-language service staffed today, and what happens to service quality at peak?",
      "Can the fault management system provide area-level restoration progress suitable for consumer communication?",
      "What proportion of customer-care office footfall is people checking application or complaint status?",
    ],
    flowTemplate: "inbound-service",
    scenario: "After a monsoon storm, a consumer in north Kolkata is told in Bengali which feeder is down and that restoration crews are working, instead of hearing an engaged tone.",
  },

  "indraprastha-gas": {
    operatingContext:
      "Indraprastha Gas Limited is the city gas distribution licensee for Delhi and much of the National Capital Region, running two connected businesses: piped natural gas supplied to residential kitchens, commercial establishments and industry, and compressed natural gas dispensed through a very large network of filling stations serving Delhi's autorickshaws, taxis, buses and private CNG vehicles. Its ownership links it to public-sector gas majors, which shapes a conservative, tender-driven procurement culture. The two businesses generate very different conversations: PNG customers ask about new connections, meter readings, bills, safety checks and shifting or disconnecting supply, while CNG customers ask about station locations, queues, pricing and card or fleet-account issues. Safety sits above everything — a suspected gas leak is an emergency that must reach a response team immediately. Contact today runs through a customer portal and app, a 24-hour helpline including an emergency number, WhatsApp servicing and walk-in customer-care centres.",
    strategicPressure: [
      { text: "IGL is the city gas distribution licensee for Delhi and much of the NCR, operating both piped natural gas supply and an extensive CNG station network, with public-sector gas majors among its promoters.", kind: "verified" },
      { text: "PNG network expansion into new NCR areas requires converting households from cylinders to piped supply, a connection-drive workload that is entirely communication-driven.", kind: "verified" },
      { text: "Its conservative, tender-led procurement culture means adoption will be slower but larger in scope once decided, and will require clear compliance and safety separation in the design.", kind: "inference" },
      { text: "New-connection applications probably carry a visible backlog with applicants calling repeatedly for status, since the process involves documents, site feasibility and installation scheduling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "IGL is buy-led. As a public-sector-linked city gas utility it procures its technology through tenders and integrates vendor systems; it has no software development organisation and no strategic reason to create one. Its capital goes into pipeline networks, CNG stations and safety infrastructure.",
    whyNotBuild:
      "The requirement is a Hindi and English conversational layer over connection workflows and billing systems, with an absolutely reliable carve-out routing any gas-leak or safety report to emergency response untouched. Building that means owning speech, telephony and an evaluation regime rigorous enough to prove the safety carve-out works every time — a specialist assurance problem that a gas utility should buy with evidence rather than construct.",
    workflows: [
      {
        name: "New PNG connection application and installation scheduling",
        friction: "Households applying for piped gas submit documents, wait for feasibility checks and installation slots, and have no visibility of where their application stands, so they call or visit repeatedly.",
        outcome: "Guided applications with a tracked document checklist, feasibility and installation-slot scheduling handled conversationally, and proactive stage updates that eliminate the status call entirely.",
        channels: ["WhatsApp", "Voice", "Web", "App"],
        systems: ["New-connection application workflow", "Document repository", "Site feasibility and installation scheduling", "Customer information system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "PNG billing, meter reading and payment support",
        friction: "Bill queries, self-reading submission and payment questions come to the helpline; consumers who missed a reading receive estimated bills and then dispute them, generating long explanatory calls.",
        outcome: "Conversational meter-reading submission, grounded bill explanation against reading history and tariff, and in-channel payment, with genuine disputes routed to billing staff.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Billing / customer information system", "Meter reading records", "Tariff master", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "CNG station and fleet-customer support",
        friction: "CNG customers — especially commercial fleet and autorickshaw drivers — ask about station locations, working status, pricing and fleet-card issues, and reach a helpline built primarily around PNG service.",
        outcome: "A dedicated conversational path giving live station status and location guidance, price information and fleet-card account answers, keeping the PNG helpline clear for household service.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["CNG station network status system", "Fleet card / account management", "Pricing master", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer portal and mobile app for bills, payments and self-meter-reading submission",
        "24-hour customer helpline plus a separate gas-emergency number",
        "WhatsApp servicing for routine billing and service requests",
        "Walk-in customer-care centres and a network of CNG stations with attendant support",
      ],
      gaps: [
        "New-connection applicants cannot see application status without calling or visiting",
        "Estimated-bill disputes require long explanatory agent calls",
        "CNG and fleet customers share a helpline designed around PNG household service",
        "Safety-check and appliance-servicing appointments are scheduled manually",
      ],
    },
    risks: [
      "Gas safety is the binding constraint: any leak, smell or hazard report must be detected and routed immediately to the emergency response line with no conversational handling, and this carve-out must be provable in every evaluation cycle.",
      "PNGRB and city gas distribution regulatory obligations govern connection and service standards, requiring auditable records of consumer interactions.",
      "TRAI DND and commercial-communication rules apply to connection-drive outreach, which is promotional in nature and must be consent-anchored and separated from safety and service messaging.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 0.85,
      automationRate: 0.55,
      basis: "Seller assumptions across PNG household service and CNG customer contact; actual helpline volumes, connection-application backlog and cost per contact must be validated with IGL customer-service leadership in discovery.",
    },
    pilotScope:
      "A 10-week pilot handling new PNG connection applications end to end for two NCR areas in Hindi and English — document checklist, feasibility status and installation scheduling — with an independently tested safety carve-out routing any gas-related hazard report straight to emergency response.",
    expansion: [
      "Extend connection support across the licence area and add connection-drive outreach for newly networked localities.",
      "Add PNG billing, self-reading and payment support with grounded bill explanation.",
      "Add the CNG station and fleet-customer path with live station status and fleet-card account answers.",
    ],
    stakeholders: [
      "Managing Director",
      "Director, Commercial",
      "Head of Customer Service / Marketing",
      "Head of Information Technology",
      "Head of Health, Safety and Environment (safety carve-out sign-off)",
    ],
    discovery: [
      "What is the current backlog and average turnaround on a new PNG connection application, and where does it stall?",
      "How is a gas-leak report currently detected and routed, and what would the safety team require to approve any automated front door?",
      "What share of billing calls arise from estimated bills where a reading was not captured?",
      "Are CNG and fleet customer queries handled on the same helpline as PNG households today?",
    ],
    flowTemplate: "onboarding",
    scenario: "A Ghaziabad household applying for piped gas is told on WhatsApp in Hindi that only the ownership proof is pending and books the installation slot once it is uploaded.",
  },

  "mahanagar-gas": {
    operatingContext:
      "Mahanagar Gas Limited is the city gas distribution licensee for Mumbai and its adjoining areas including Thane and parts of Raigad, supplying piped natural gas to households, commercial establishments and industry, and compressed natural gas through a station network serving Mumbai's taxis, autorickshaws and private vehicles. Its growth comes from network expansion — laying pipelines into new localities and converting households from cylinder LPG to piped supply — which makes area-conversion campaigns a core, recurring commercial activity rather than an occasional project. Mumbai's housing stock shapes the operational reality: connections must be coordinated through housing societies and building managements, not just individual households, so a conversion drive is a sequence of society-level negotiations followed by household-level scheduling. Consumers are Marathi, Hindi, Gujarati and English speaking and reach MGL through a portal and app, a 24-hour helpline with a separate emergency number, WhatsApp servicing and customer-care centres.",
    strategicPressure: [
      { text: "Mahanagar Gas is the city gas distribution licensee for Mumbai and adjoining areas, supplying piped natural gas to households and industry alongside a CNG station network.", kind: "verified" },
      { text: "Growth depends on converting new localities and households from cylinder LPG to piped gas, which is a campaign-driven outreach and scheduling workload rather than an inbound service one.", kind: "verified" },
      { text: "Mumbai's society-based housing means conversion requires coordinating building committees and then large batches of individual households, a two-stage communication problem that scales badly with tele-calling headcount.", kind: "inference" },
      { text: "Routine billing and self-reading conversations are probably the largest steady-state helpline load and are almost entirely automatable, freeing staff for the conversion campaigns that drive growth.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "MGL is buy-led. It is a listed city gas utility whose capital goes into pipeline networks, CNG infrastructure and safety systems, with technology procured through tendered vendor engagements. There is no software organisation, and conversational infrastructure is unambiguously a bought capability in this sector.",
    whyNotBuild:
      "Running a conversion campaign well needs consented multilingual outreach at batch scale, appointment scheduling into installation crew calendars, and document collection — all layered over an absolutely rigid safety carve-out for gas-leak reports. Building speech, telephony, orchestration and the assurance regime for that carve-out is a specialist programme with no relationship to laying pipe or running a gas network.",
    workflows: [
      {
        name: "Area-conversion outreach and connection sign-up",
        friction: "When a locality is networked, converting households depends on tele-calling and society meetings; coverage is limited by team size, so utilisation of newly laid infrastructure ramps slowly.",
        outcome: "Consented multilingual outreach to every household in a newly networked area explaining the offer, answering cost and safety questions from approved content, and capturing sign-ups with documents.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Network coverage and locality master", "New-connection application workflow", "Document repository", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Installation scheduling and society coordination",
        friction: "Installation appointments must fit household availability and society permissions; scheduling is manual, no-shows waste crew visits, and rescheduling requires another round of calls.",
        outcome: "Installation slots booked and confirmed conversationally against crew availability with reminders and one-tap rescheduling, and society-level coordination status tracked centrally.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Installation crew scheduling", "Society and building records", "Connection workflow", "Field workforce management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing, self-meter-reading and payment support",
        friction: "Households that miss meter readings receive estimated bills and then call to dispute; self-reading submission through the app is used by only part of the base and the rest phone in.",
        outcome: "Conversational self-reading capture, grounded bill explanation against reading history and tariff, and in-channel payment, removing the steady-state load from the helpline.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Billing / customer information system", "Meter reading records", "Tariff master", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer portal and mobile app for bills, payments and self-meter-reading",
        "24-hour helpline plus a dedicated gas-emergency number",
        "WhatsApp servicing for routine billing and service requests",
        "Customer-care centres and field teams handling installations and safety checks",
      ],
      gaps: [
        "Conversion outreach in newly networked areas is limited by tele-calling capacity",
        "Installation scheduling and no-show handling are manual and waste crew visits",
        "Estimated-bill disputes still require explanatory agent calls",
        "Society-level coordination status is not visible centrally during a conversion drive",
      ],
    },
    risks: [
      "Gas safety carve-out is absolute: any leak, smell or hazard report must be routed instantly to the emergency response line with no conversational handling, and this must be provable in every evaluation cycle.",
      "PNGRB and city gas regulatory obligations govern connection and service standards and require auditable interaction records.",
      "TRAI DND, calling-window and commercial-communication rules govern conversion-drive outreach, which is promotional and must be consent-anchored and scrubbed.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions from household base, conversion-campaign intensity and steady-state billing contact; actual helpline volumes, conversion-campaign sizes and cost per contact must be validated with MGL marketing and customer-service leadership.",
    },
    pilotScope:
      "A 10-week pilot running conversion outreach and installation scheduling for two newly networked Thane localities in Marathi, Hindi and English, with document capture and crew-calendar booking, and an independently tested safety carve-out.",
    expansion: [
      "Extend conversion outreach to all new network areas with society-level coordination tracking.",
      "Add billing, self-reading and payment support to remove steady-state helpline load.",
      "Add safety-check and appliance-service appointment scheduling across the connected base.",
    ],
    stakeholders: [
      "Managing Director",
      "Director / Head of Commercial and Marketing",
      "Head of Customer Service",
      "Head of Information Technology",
      "Head of Health, Safety and Environment (safety carve-out sign-off)",
    ],
    discovery: [
      "How many households sit in newly networked but unconverted localities, and what conversion rate is achieved per campaign today?",
      "How are installation slots scheduled, and what is the current no-show or failed-visit rate?",
      "What share of billing calls result from estimated bills where no reading was captured?",
      "What assurance would the safety team require before any automated front door sits ahead of the emergency number?",
    ],
    flowTemplate: "onboarding",
    scenario: "A Thane housing society's residents are contacted in Marathi about piped-gas conversion and forty households book installation slots within the week.",
  },

  "adani-total-gas": {
    operatingContext:
      "Adani Total Gas is a city gas distribution company — a joint venture between the Adani group and TotalEnergies — holding licences for a large number of geographical areas spread across many Indian states, which makes multi-geography rollout its defining operational characteristic. Unlike a single-city distributor, it is simultaneously building networks, converting households and running steady-state service across areas at very different maturity stages, from freshly authorised territories with no customers to established areas with substantial PNG and CNG bases. Each new geographical area brings a different first language, a different consumer profile and a fresh conversion campaign. Its consumers are households converting from cylinders, commercial and industrial gas users, and CNG vehicle owners at its expanding station network. Contact runs through a customer app and portal, helplines with separate emergency numbers, WhatsApp servicing and area-level customer-care presence.",
    strategicPressure: [
      { text: "Adani Total Gas is a joint venture between the Adani group and TotalEnergies holding city gas distribution licences across a large number of geographical areas in multiple Indian states.", kind: "verified" },
      { text: "Licence obligations in city gas distribution include minimum work programmes for network build and connections, so conversion pace is a regulatory commitment and not only a commercial choice.", kind: "verified" },
      { text: "Simultaneous rollout across many states multiplies language requirements faster than any centralised calling operation can staff, making language a rollout bottleneck rather than a service nicety.", kind: "inference" },
      { text: "Each new area repeats the same conversion, scheduling and onboarding sequence, so a templated conversational deployment could be reused area after area with only content and language changes.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Adani Total Gas is buy-led for this capability. It is an infrastructure build-out business whose capital and management attention go to pipeline networks, CNG stations and licence-obligation delivery. Technology is procured, and the group's digital ambitions sit in other entities; this business needs deployable capability per geographical area, not a platform programme.",
    whyNotBuild:
      "The rollout model argues decisively against building. Every new area needs consumer service standing up quickly in a new language against the same workflows. A bought, configurable conversational layer turns that into a repeatable deployment; a build would make each area a bespoke engineering effort, on top of owning speech, telephony and the safety-carve-out assurance regime.",
    workflows: [
      {
        name: "New-area connection outreach and sign-up",
        friction: "When a network reaches a new locality, conversion depends on local tele-calling and camps in a language the central team may not staff; uptake ramps slowly against licence-obligation timelines.",
        outcome: "Consented outreach to every reachable household in the new area in the local language, explaining the offer and safety from approved content and capturing sign-ups with documents.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Geographical-area network coverage master", "Connection application workflow", "Document repository", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Installation scheduling and onboarding across dispersed areas",
        friction: "Installation crews serve dispersed new areas; appointment coordination is manual, failed visits are costly given travel distances, and rescheduling loops consume days.",
        outcome: "Slots booked against crew availability with confirmations and one-tap rescheduling, and readiness checks before dispatch so crews do not travel to households that are not ready.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Installation crew scheduling and field workforce management", "Connection workflow", "Area and route records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Steady-state billing, service and CNG customer support",
        friction: "As each area matures it generates its own billing, reading and service load in its own language, and a centralised helpline serves later-established areas worse than early ones.",
        outcome: "Uniform grounded billing, self-reading, payment and service support in every area's own language from a single deployment, with CNG station and pricing queries handled on the same layer.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Billing / customer information system", "Meter reading records", "CNG station status and pricing", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer app and web portal for bills, payments and service requests",
        "Area helplines with separate gas-emergency numbers",
        "WhatsApp servicing for routine billing and service transactions",
        "Local customer-care presence and field teams in established geographical areas",
      ],
      gaps: [
        "Conversion outreach in new areas is constrained by local calling capacity and language staffing",
        "Installation crews make wasted trips because readiness is not confirmed before dispatch",
        "Service quality and language coverage differ sharply between mature and newly authorised areas",
        "There is no repeatable service-launch template that goes live with each new geographical area",
      ],
    },
    risks: [
      "Gas safety carve-out is absolute — any leak or hazard report must route directly to emergency response with no conversational handling, provable in evaluation across every area.",
      "PNGRB licence obligations, including minimum work programme commitments on connections, mean consumer-facing processes carry regulatory reporting requirements.",
      "TRAI DND, calling-window and commercial-communication rules govern conversion outreach across every state, with consent capture and scrubbing mandatory at rollout scale.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions across a mixed portfolio of mature and newly authorised geographical areas; per-area customer bases, conversion targets and current calling arrangements vary widely and must be validated area by area in discovery.",
    },
    pilotScope:
      "A 10-week pilot in two newly networked geographical areas running conversion outreach, document capture and installation scheduling in the local language plus Hindi, with readiness confirmation before crew dispatch and an independently tested safety carve-out.",
    expansion: [
      "Template the deployment so each newly authorised area goes live with conversational service on day one, in its own language.",
      "Add steady-state billing, self-reading and payment support across mature areas.",
      "Add CNG station status, pricing and fleet-account support on the same layer.",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer / Head of Geographical Area Operations",
      "Head of Marketing and Customer Acquisition",
      "Head of Information Technology / Digital",
      "Head of Health, Safety and Environment (safety carve-out sign-off)",
    ],
    discovery: [
      "How many geographical areas are in active rollout, and what languages do they collectively require?",
      "What conversion rate and pace are the licence obligations driving, and where is the current bottleneck?",
      "What is the failed-visit rate for installation crews travelling to dispersed new areas?",
      "Would a templated service launch per new area be valued by operations as a repeatable rollout asset?",
    ],
    flowTemplate: "onboarding",
    scenario: "Households in a newly networked town are contacted in the local language about piped gas, and installation slots are booked only after readiness is confirmed.",
  },

  "gujarat-gas": {
    operatingContext:
      "Gujarat Gas is India's largest city gas distribution company by customer count, operating across a wide swathe of Gujarat plus adjoining areas, and is distinctive for the scale of its industrial gas business alongside its residential PNG base. Its industrial customers are concentrated in Gujarat's manufacturing clusters — most notably the Morbi ceramics belt, which switched substantially to piped natural gas and whose demand is highly sensitive to gas pricing relative to alternative fuels — plus textiles, chemicals and engineering units. That gives it two utterly different customer conversations: hundreds of thousands of Gujarati-speaking households asking about bills, readings, connections and safety, and industrial customers whose questions are about pricing, volume commitments, supply continuity and commercial terms. Contact runs through a customer portal and app, helplines with separate emergency numbers, WhatsApp servicing, area customer-care centres and industrial account managers.",
    strategicPressure: [
      { text: "Gujarat Gas is India's largest city gas distributor by customer count, with a very large residential PNG base and a substantial industrial gas business concentrated in Gujarat's manufacturing clusters.", kind: "verified" },
      { text: "Industrial demand, particularly from the Morbi ceramics cluster, is highly sensitive to gas price relative to alternative fuels, making pricing and supply communication commercially critical.", kind: "verified" },
      { text: "A Gujarati-first residential base of this size makes vernacular voice service a core operating requirement rather than a regional add-on.", kind: "inference" },
      { text: "Household billing, self-reading and connection queries almost certainly dominate contact volume and are highly automatable, while industrial conversations should stay with account managers.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Gujarat Gas is buy-led. It is a state-linked utility whose investment goes into pipeline networks, industrial supply infrastructure and CNG stations, with technology delivered through tendered vendor engagements. It has no software product organisation, and its procurement culture is explicitly vendor-led with defined scope and service levels.",
    whyNotBuild:
      "The requirement is production-grade Gujarati voice at very large residential scale, grounded in billing and connection systems, with an absolutely rigid safety carve-out — plus enough sophistication to recognise an industrial customer and route them to their account manager rather than answering commercially. Building speech, telephony and that assurance regime internally is implausible for a gas utility and unnecessary when it can be bought and configured.",
    workflows: [
      {
        name: "Residential billing, self-meter-reading and payment support",
        friction: "A very large household base generates continuous billing, reading and payment questions; app self-service covers a minority and the rest reach helplines that are staffed for average rather than peak load.",
        outcome: "Conversational self-reading capture, grounded bill explanation against reading history and tariff, and in-channel payment in Gujarati, removing the largest steady-state contact driver.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Billing / customer information system", "Meter reading records", "Tariff master", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "New connection applications and service requests",
        friction: "Connection, name-change, shifting and disconnection applications require documents and site visits, and applicants call repeatedly because status is not communicated.",
        outcome: "Guided applications in Gujarati with tracked document checklists, site-visit scheduling and proactive stage updates, cutting both repeat calls and customer-care centre footfall.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Connection and service-request workflow", "Document repository", "Field visit scheduling", "Customer information system"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Industrial customer recognition and routing",
        friction: "Industrial and commercial customers with pricing, volume and supply-continuity questions reach the same helpline as households, and are answered by agents who cannot address commercial terms.",
        outcome: "Industrial customers recognised at contact, given grounded supply and billing status from their own account, and routed straight to their account manager for anything commercial rather than queued behind household calls.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Industrial account and contract records", "Supply and volume metering data", "Billing system", "Account-manager CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Customer portal and mobile app for bills, payments and self-meter-reading submission",
        "Area helplines with separate gas-emergency numbers",
        "WhatsApp servicing for routine billing and service requests",
        "Area customer-care centres plus account managers for industrial customers",
      ],
      gaps: [
        "Household billing and reading questions still reach human agents at very large volume",
        "Connection and service-request status is not communicated proactively",
        "Industrial customers are not recognised at the point of contact and share the household queue",
        "Gujarati service depth is staffed rather than platform-provided and varies with load",
      ],
    },
    risks: [
      "Gas safety carve-out is absolute — leak, smell and hazard reports must route directly to emergency response with no conversational handling, provable in every evaluation cycle.",
      "PNGRB and state regulatory obligations govern connection and service standards and require auditable interaction records.",
      "Industrial pricing and contract terms are commercially sensitive and negotiated; the agent must never quote or interpret them and must route all such conversations to account managers.",
    ],
    economics: {
      volumeMonthly: 1800000,
      costPerInteraction: 0.8,
      automationRate: 0.65,
      basis: "Seller assumptions from a very large residential customer base plus industrial contact; actual helpline volumes, app self-service adoption and cost per contact must be validated with Gujarat Gas customer-service leadership in discovery.",
    },
    pilotScope:
      "A 10-week pilot handling residential billing, self-meter-reading and payment conversations in Gujarati, Hindi and English for two operating areas, grounded in the billing system, with an independently tested safety carve-out.",
    expansion: [
      "Extend residential billing and payment support across all operating areas.",
      "Add guided connection and service-request applications with tracked checklists and site-visit scheduling.",
      "Add industrial customer recognition with grounded supply and billing status and direct account-manager routing.",
    ],
    stakeholders: [
      "Managing Director",
      "Head of Marketing / Commercial (residential and industrial)",
      "Head of Customer Service",
      "Head of Information Technology",
      "Head of Health, Safety and Environment (safety carve-out sign-off)",
    ],
    discovery: [
      "What is the current split of helpline volume between billing, readings, connections and industrial queries?",
      "What proportion of households submit self-meter-readings digitally, and what happens to the rest?",
      "Can industrial customers be identified at the point of contact from the calling number or account reference?",
      "What assurance would the safety function require before an automated layer sits in front of the customer helpline?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A household in Surat submits its gas meter reading in Gujarati over WhatsApp and gets the resulting bill explained and paid in the same thread.",
  },

  "akasa-air": {
    operatingContext:
      "Akasa Air is India's newest scheduled airline, operating an all-Boeing 737 MAX narrowbody fleet on a low-cost, single-cabin model with a rapidly growing domestic network and a small but expanding set of international routes. As a young carrier it has deliberately built lean: it is aggressively digital-first, with app and web self-service as the primary servicing channel, and it has none of the legacy contact-centre estate that older carriers carry. Its passengers are price-sensitive domestic leisure and small-business travellers plus a growing corporate segment, who contact the airline mainly around disruption — delays, cancellations, missed connections — and around post-booking changes, refunds, baggage issues, seat and meal add-ons and special assistance requests. Contact today runs through the app and website, a customer-care helpline, email and social channels, and airport service desks.",
    strategicPressure: [
      { text: "Akasa Air is a young Indian low-cost carrier operating an all-737 MAX fleet with a fast-growing domestic network and expanding international operations.", kind: "verified" },
      { text: "A start-up airline builds its cost base deliberately, so customer-service headcount is a scrutinised line rather than an inherited one — automation decisions are made at design time rather than retrofitted.", kind: "inference" },
      { text: "Disruption events generate order-of-magnitude call spikes that a lean support team cannot absorb, and in a young airline every badly-handled disruption disproportionately shapes brand perception.", kind: "inference" },
      { text: "Fleet and network growth means service volume is compounding, so any fix must scale without a proportional increase in agent headcount.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Akasa is buy-led. A start-up airline builds flight operations, safety systems and commercial capability; everything else is procured — passenger service system, reservations, revenue management, customer-service tooling. It has neither the engineering headcount nor the strategic reason to build conversational infrastructure, and its greenfield estate makes integrating a bought layer unusually clean.",
    whyNotBuild:
      "Absorbing a disruption spike requires elastic telephony and speech capacity that sits idle on normal days, grounded live in PNR and schedule systems, with DGCA-compliant passenger-rights handling and full auditability. Building that inside a young airline would consume engineering capacity needed for network and commercial systems, and would create a fixed cost precisely where the demand is spiky.",
    workflows: [
      {
        name: "Disruption notification and in-channel rebooking",
        friction: "When a flight cancels, passengers learn from an SMS and then all call at once; the helpline saturates, airport desks queue, and rebooking options are read out one at a time by whoever is available.",
        outcome: "Every affected passenger contacted proactively with their specific options, rebooking confirmed in-channel against live seat availability, and only complex or connecting itineraries routed to specialists.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Passenger service system (PSS) / PNR records", "Flight schedule and disruption feed", "Seat inventory", "Refund and compensation rules engine"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refund status and post-booking change support",
        friction: "Refund timelines and change fees generate repeated contacts because status is opaque; each call requires an agent to look up the PNR and explain fare rules.",
        outcome: "Grounded refund status and change options on demand in the passenger's language, with changes executed within fare rules and proactive notification at each refund stage.",
        channels: ["Voice", "WhatsApp", "App", "Email"],
        systems: ["PSS / PNR records", "Fare rules and change-fee engine", "Refund and payments ledger", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Baggage, ancillary and special-assistance requests",
        friction: "Baggage issues, seat and meal add-ons, and special-assistance requests are handled at airport desks or by helpline agents, so passengers must reach a human for requests that are entirely rule-bound.",
        outcome: "Ancillary purchases and seat changes completed conversationally, baggage-issue reports logged into the tracing workflow with status pushed proactively, and special-assistance requests captured and confirmed to airport operations before departure.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["PSS ancillary and seat inventory", "Baggage tracing system", "Airport operations / special-assistance workflow", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Mobile app and website with booking management, check-in and self-service changes",
        "Customer-care helpline plus email and social-media support",
        "Automated SMS, email and app notifications for schedule changes and check-in",
        "Airport service desks handling disruption, baggage and special assistance",
      ],
      gaps: [
        "Disruption-day contact volume far exceeds staffed capacity, so passengers queue at the worst moment",
        "Refund progress is not communicated after initiation, driving repeat contacts",
        "Rebooking options cannot be self-served conversationally, only through a human or a limited app flow",
        "Regional-language service is thin relative to the domestic network's spread",
      ],
    },
    risks: [
      "DGCA passenger-rights rules govern compensation, refunds and facilities during delays and cancellations; any statement the agent makes must be grounded in the current regulatory and airline policy position.",
      "Refund amounts, change fees and fare rules are financially exact and must come from the system of record, never be estimated.",
      "DPDP Act obligations on passenger identity and payment data, with identity verification required before any booking or refund disclosure, and no card capture in conversation.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from network size and low-cost carrier servicing patterns with disruption-driven spikes; actual contact volumes, disruption multiples and current outsourced or in-house cost per contact must be validated in discovery.",
    },
    pilotScope:
      "A 10-week pilot handling disruption notification and in-channel rebooking for a defined set of routes in Hindi and English, grounded in PNR and live seat inventory, measured on contacts per disruption event and rebooking completion rate.",
    expansion: [
      "Extend disruption handling network-wide with additional regional languages and elastic peak capacity.",
      "Add refund-status transparency and post-booking change execution within fare rules.",
      "Add ancillary sales, seat changes, baggage-issue tracking and special-assistance capture with airport-operations handoff.",
    ],
    stakeholders: [
      "Chief Executive Officer / Co-founder",
      "Chief Commercial Officer",
      "Head of Customer Experience / Guest Services",
      "Chief Information Officer / Head of Technology",
      "Head of Airport Operations",
    ],
    discovery: [
      "On a cancellation day, what multiple of normal contact volume arrives and how is it currently absorbed?",
      "Is customer care in-house or outsourced today, and what is the contracted cost per contact?",
      "Can the passenger service system accept a rebooking from an external conversational agent, or is it agent-desktop only?",
      "How many contacts does a single refund generate from initiation to credit?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "When an Akasa flight from Bengaluru cancels, affected passengers get two rebooking options on WhatsApp in Hindi before the airport desk queue forms.",
  },

  "spicejet": {
    operatingContext:
      "SpiceJet is a long-established Indian value carrier operating a mixed narrowbody and turboprop fleet on domestic trunk and regional routes, including regional connectivity services into smaller airports, plus a cargo operation. It has been through an extended period of financial stress, fleet grounding and restructuring, which has directly shaped its customer-service reality: reduced capacity, schedule volatility and a well-publicised history of refund backlogs and passenger complaints. Its passengers are price-sensitive domestic travellers, including a significant share flying regional routes into tier-2 and tier-3 airports where SpiceJet is one of few operators. The dominant contact drivers are refund status, schedule changes and cancellations, rebooking, and baggage and airport service issues. Contact runs through the app and website, a customer-care helpline, email, social media escalation and airport desks.",
    strategicPressure: [
      { text: "SpiceJet has operated through a prolonged period of financial stress and restructuring, with fleet and capacity constraints and a publicly reported history of refund and complaint volumes.", kind: "verified" },
      { text: "Its regional route network serves tier-2 and tier-3 airports where passengers are more likely to need voice service in a regional language than app self-service.", kind: "inference" },
      { text: "Refund-status contacts are structurally the heaviest load for a carrier with a backlog history, and each unresolved case generates repeated calls and public escalation.", kind: "inference" },
      { text: "Financial constraints mean any proposal must be structured around a visible, near-term reduction in contact cost rather than a multi-phase transformation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "SpiceJet is buy-led, with an important caveat: capacity to commit is the binding question, not appetite. It procures its passenger service, reservations and service systems and has no engineering organisation for platform building; under financial constraint an internal build is simply not available as an option.",
    whyNotBuild:
      "There is no realistic scenario in which a financially constrained airline funds a speech, telephony and orchestration programme. The only viable structure is a bought capability with usage-linked economics, scoped tightly to the highest-cost contact type so the payback is visible within a quarter rather than a planning cycle.",
    workflows: [
      {
        name: "Refund status and backlog communication",
        friction: "Passengers awaiting refunds call repeatedly and escalate publicly because status is opaque; each contact consumes an agent and none of them changes the underlying processing timeline.",
        outcome: "Grounded refund status on demand plus automatic stage notification, so passengers know where their case stands without calling, and genuinely stuck cases are surfaced to finance as a structured queue.",
        channels: ["Voice", "WhatsApp", "App", "Email"],
        systems: ["PNR and booking records", "Refund and settlement ledger", "Payment gateway reconciliation", "Grievance register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Schedule-change and cancellation rebooking",
        friction: "Schedule changes on a constrained network generate rebooking demand that a reduced support team cannot absorb; passengers at regional airports have few alternatives and need options explained.",
        outcome: "Affected passengers notified proactively with available options in their language and rebooking completed in-channel within fare and regulatory rules, with complex cases routed to specialists.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Passenger service system (PSS)", "Schedule and disruption feed", "Seat inventory", "Passenger-rights policy rules"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Regional-route passenger support in vernacular languages",
        friction: "Passengers flying regional connectivity routes into smaller airports are served by a helpline staffed mainly in Hindi and English, so questions take longer and satisfaction is lower.",
        outcome: "Booking, baggage, check-in and airport-service questions answered in the passenger's own language on voice and WhatsApp, matching the actual language profile of the regional network.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["PNR records", "Baggage tracing", "Airport operations records", "Knowledge base of policies and procedures"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Mobile app and website with booking management and check-in",
        "Customer-care helpline plus email and social-media support channels",
        "Automated SMS and email notifications for schedule changes and cancellations",
        "Airport service desks handling disruption, baggage and passenger assistance",
      ],
      gaps: [
        "Refund progress is not communicated proactively, so the same case generates many contacts",
        "Schedule-change rebooking cannot be completed without reaching a human",
        "Regional-language service does not match the language profile of the regional route network",
        "Public escalation on social media substitutes for a working service path",
      ],
    },
    risks: [
      "DGCA passenger-rights rules on refunds, compensation and facilities during disruption must be applied exactly, and a carrier with complaint history will be held to them closely.",
      "Refund amounts and timelines are financially exact and must be quoted from the system of record only, never estimated.",
      "Commercial capacity to commit is itself a risk — commercial structuring must fit constrained cash flows, with scope tight enough to show payback quickly.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from network scale and a contact mix weighted toward refunds and schedule changes; actual contact volumes, refund backlog size and current cost per contact must be validated and the commercial model structured around demonstrable near-term savings.",
    },
    pilotScope:
      "An 8-week tightly-scoped pilot handling refund-status contacts in Hindi and English across voice and WhatsApp, grounded in the refund ledger with automatic stage notifications, measured on repeat contacts per refund case.",
    expansion: [
      "Add schedule-change notification with in-channel rebooking within fare and passenger-rights rules.",
      "Add regional-language coverage matched to the regional route network's actual passenger profile.",
      "Add baggage, check-in and airport-service query handling with airport-operations escalation.",
    ],
    stakeholders: [
      "Chief Executive Officer / Chairman's office",
      "Chief Commercial Officer",
      "Head of Customer Service",
      "Head of Information Technology",
      "Chief Financial Officer (commercial structuring and payback)",
    ],
    discovery: [
      "How many open refund cases exist, and how many contacts does each generate before resolution?",
      "Is customer care in-house or outsourced, and what is the current contracted cost per contact?",
      "What commercial structure — usage-linked, outcome-linked, phased — would fit current cash constraints?",
      "Which regional routes generate the most contact, and in what languages?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A passenger awaiting a SpiceJet refund gets a WhatsApp update in Hindi showing the exact processing stage and stops calling the helpline daily.",
  },

  "adani-airports": {
    operatingContext:
      "Adani Airport Holdings operates a portfolio of Indian airports including Mumbai's Chhatrapati Shivaji Maharaj International Airport, Ahmedabad, Lucknow, Mangaluru, Jaipur, Guwahati and Thiruvananthapuram, and is developing the new Navi Mumbai International Airport. As an airport operator rather than an airline, its customer is layered: passengers using the terminal, airlines and ground handlers as tenants and operational partners, retail and food-and-beverage concessionaires, car-park and taxi operators, and cargo customers. Passenger-facing communication covers terminal navigation and facilities, lounge access, parking, lost-and-found, meet-and-assist services, and complaints — none of which airlines handle, since these are airport rather than flight matters. The group also runs a consumer super-app ambition that spans its airport touchpoints, which shapes who inside the organisation owns passenger digital experience.",
    strategicPressure: [
      { text: "Adani Airport Holdings operates a multi-airport portfolio in India including Mumbai and Ahmedabad, and is developing Navi Mumbai International Airport.", kind: "verified" },
      { text: "Airport revenue increasingly depends on non-aeronautical income — retail, food and beverage, parking, lounges — which makes passenger engagement a revenue function rather than only a service one.", kind: "verified" },
      { text: "Passengers cannot easily tell which questions belong to the airline and which to the airport, so airport service channels absorb misdirected queries and vice versa.", kind: "inference" },
      { text: "Because the group has its own consumer digital platform ambitions, the practical entry is a partner-delivered layer for airport passenger-service lines rather than a wholesale platform sale.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Adani Airports is partner-led. The group has real digital ambition and its own consumer platform agenda, so it will not simply hand over passenger experience wholesale. But airport passenger-service operations — lost and found, parking, meet-and-assist, terminal enquiries — are operational rather than platform work, and a partner-delivered conversational layer that integrates into airport operational systems is the realistic and fast route.",
    whyNotBuild:
      "Even a group with platform ambitions will not build multilingual speech, telephony and evaluation for airport service lines: the volumes are large but the workflows are operational and airport-specific, and the group's own digital investment is directed at consumer-facing commerce and loyalty. The sensible split is the group owning the passenger app and commercial relationship, and a partner owning the conversational service layer over airport operations.",
    workflows: [
      {
        name: "Lost-and-found reporting and recovery",
        friction: "Passengers who lose an item report it by phone, email or a web form after they have left the airport; matching against found items is manual, updates are rare, and most cases end without resolution or communication.",
        outcome: "Structured multilingual intake capturing item description, terminal, time and location, automatic matching against the found-property register, and proactive status updates until the case closes.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Lost-property / found-item register", "Terminal operations records", "Courier and handover workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Terminal services, parking and passenger-facility enquiries",
        friction: "Passengers call or ask staff about parking availability and charges, lounge access, terminal transfers, wheelchair and meet-and-assist bookings, and facility locations, and answers depend on which staff member is asked.",
        outcome: "One grounded multilingual passenger line answering facility, parking, lounge and transfer questions from airport systems, and booking assist services directly into the operations workflow.",
        channels: ["Voice", "WhatsApp", "Web", "Kiosk"],
        systems: ["Car-park management system", "Lounge and meet-and-assist booking", "Terminal facility and wayfinding data", "Flight information display system feed"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Concessionaire, ground-handler and tenant service desk",
        friction: "Retail and food concessionaires, ground handlers and airline tenants raise facility, access, permit and maintenance requests through airport operations teams by phone and email, with no consistent tracking.",
        outcome: "A recognised tenant channel logging and routing requests into the airport facility and permits workflow with grounded status, escalating commercial and safety matters to airport operations management.",
        channels: ["Voice", "Email", "WhatsApp"],
        systems: ["Airport facility management / maintenance workflow", "Access control and permit system", "Tenant and concession records", "Operations control centre"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Airport websites and a group consumer app covering flight information and airport services",
        "Terminal information desks and passenger help points",
        "Lost-and-found reporting via phone, email or web form",
        "Lounge, meet-and-assist and car-park booking channels",
      ],
      gaps: [
        "Lost-and-found cases receive no proactive status and mostly close without communication",
        "Passenger enquiries about airport facilities depend on reaching a desk or a staff member in the terminal",
        "Airline-versus-airport query confusion is absorbed manually rather than routed intelligently",
        "Tenant and concessionaire requests are handled by phone and email with no tracked service level",
      ],
    },
    risks: [
      "Aviation security regulation constrains what can be discussed and disclosed about terminal operations, access and procedures; the agent must be bounded to published passenger information.",
      "Emergency and security incidents must never be handled conversationally — any such report routes immediately to airport security and the operations control centre.",
      "DPDP Act obligations on passenger data captured in lost-and-found and assist-service bookings, with retention limits and controlled access.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from combined passenger throughput across the airport portfolio and typical airport service-contact rates; actual enquiry, lost-and-found and tenant-request volumes must be validated per airport in discovery.",
    },
    pilotScope:
      "A 10-week pilot at one airport handling lost-and-found intake and terminal, parking and assist-service enquiries in Hindi, English and the local language, grounded in airport operational systems with proactive lost-property status updates.",
    expansion: [
      "Extend to the wider airport portfolio with Gujarati, Marathi, Malayalam, Assamese and other local-language coverage.",
      "Add lounge, meet-and-assist and premium-service booking integrated with the group consumer app.",
      "Stand up the concessionaire, ground-handler and tenant service desk routed into facility and permit workflows.",
    ],
    stakeholders: [
      "Chief Executive Officer, Adani Airport Holdings",
      "Airport Director / Chief Operating Officer (per airport)",
      "Head of Passenger Experience / Terminal Services",
      "Chief Digital Officer (group consumer platform)",
      "Head of Commercial and Retail (non-aeronautical revenue)",
    ],
    discovery: [
      "How many lost-and-found cases are reported monthly per airport, and what share are resolved and communicated?",
      "How does the group digital team scope ownership between the consumer app and airport service operations?",
      "Which passenger enquiries currently reach airport staff that could be grounded in car-park, lounge and facility systems?",
      "Are tenant and concessionaire requests tracked against any service level today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A passenger who left a laptop bag at a Mumbai terminal security point reports it on WhatsApp and is told two days later that it has been matched and is ready for collection.",
  },

  "tata-play": {
    operatingContext:
      "Tata Play is one of India's largest pay-television operators, running a direct-to-home satellite television business with a very large subscriber base, alongside a fibre broadband service and a streaming aggregation product. Its economics are prepaid-recharge driven: subscribers pay in advance for a channel pack, and service suspends when the balance runs out, so recharge behaviour directly determines revenue and churn. That produces a continuous, calendar-driven communication cycle across the whole base — balance reminders, pack changes and upgrades, promotional add-ons — layered on top of a heavy technical-support load, since set-top boxes, dish alignment and signal issues generate troubleshooting calls that often end in a technician visit. Its subscribers span metros and small towns across every major Indian language region. Contact runs through a subscriber app and website, an IVR-heavy helpline, WhatsApp servicing, SMS and a large field-technician and local-dealer network.",
    strategicPressure: [
      { text: "Tata Play operates a large direct-to-home pay-TV subscriber base on a prepaid recharge model, alongside fibre broadband and streaming aggregation products.", kind: "verified" },
      { text: "Streaming substitution puts sustained pressure on pay-TV subscriber numbers and average revenue, making recharge conversion and churn prevention the central commercial problems.", kind: "verified" },
      { text: "The prepaid model means every subscriber generates recurring balance, recharge and pack conversations, so contact volume scales with the base rather than with problems.", kind: "inference" },
      { text: "Technical-support calls that end in an avoidable technician visit are among the most expensive contacts in the business, and many are probably resolvable through guided conversational troubleshooting.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Tata Play is buy-led. It is a subscription operations business whose capability is content aggregation, distribution and field service. Its technology estate — subscriber management, conditional access, billing, field-service dispatch — is procured and integrated. Conversational infrastructure is not a differentiator in pay-TV and would compete with content and product investment.",
    whyNotBuild:
      "Serving a subscriber base spread across Hindi, Tamil, Telugu, Bengali, Marathi, Kannada and Malayalam regions requires speech quality in all of them at a cost per contact below the average revenue per subscriber — an economics problem, not just an engineering one. Building speech, telephony, orchestration into subscriber-management systems and evaluation would be a permanent platform commitment in a business under revenue pressure.",
    workflows: [
      {
        name: "Recharge reminders, pack changes and balance queries",
        friction: "Balance reminders are one-way SMS that many subscribers ignore; those who want to change or downgrade a pack navigate an IVR or call an agent, and lapsed subscribers are pursued only by broadcast.",
        outcome: "Two-way conversational reminders in the subscriber's language that explain the balance, offer suitable packs within approved rules, and complete the recharge or change in-channel with a payment link.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Subscriber management system", "Conditional access / entitlement platform", "Pack and pricing master", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Set-top box troubleshooting and technician-visit scheduling",
        friction: "Signal, box and picture problems go through IVR trees and agents reading scripts; many calls end in a technician visit that was avoidable, and visits are scheduled without confirming subscriber availability.",
        outcome: "Guided conversational troubleshooting in the subscriber's language that resolves common faults remotely, and where a visit is genuinely needed, books it against technician availability with confirmation and reminders.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Set-top box diagnostics / signal telemetry", "Field-service dispatch and technician scheduling", "Subscriber management system", "Work-order system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Churn-risk retention and win-back outreach",
        friction: "Subscribers who stop recharging are pursued with generic offers by SMS; nobody asks why they stopped, so offers are mistargeted and the actual churn driver is never captured.",
        outcome: "Timely two-way outreach to at-risk and lapsed subscribers that captures the real reason, offers retention terms within an approved matrix, and routes high-value saves to human specialists.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Subscriber management and usage history", "Churn-risk scoring", "Retention offer matrix", "Consent and DND register"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Subscriber mobile app and website for recharge, pack management and complaint logging",
        "IVR-heavy helpline plus WhatsApp servicing for recharge and basic support",
        "SMS balance and recharge reminder programmes",
        "Field-technician network and local dealer support for installations and faults",
      ],
      gaps: [
        "Recharge reminders are one-way, so intent is not converted in the moment",
        "Troubleshooting is script-driven and produces avoidable technician visits",
        "Lapsed subscribers are pursued with broadcast offers and their churn reason is never captured",
        "Regional-language service quality varies by staffing rather than by subscriber location",
      ],
    },
    risks: [
      "TRAI regulates both broadcasting tariff and channel-pack rules and commercial communications — pack and pricing statements must be grounded in the current regulated framework, and outbound must respect DND and calling windows.",
      "Retention offers must be bounded by an approved commercial matrix with exceptions to humans, or offer leakage will exceed the churn saved.",
      "DPDP Act obligations on subscriber and viewing-related data, with identity verification before any account disclosure and controlled transcript retention.",
    ],
    economics: {
      volumeMonthly: 6000000,
      costPerInteraction: 0.8,
      automationRate: 0.65,
      basis: "Seller assumptions from a very large prepaid subscriber base generating recurring recharge and support contact; actual helpline volumes, IVR containment, technician-visit rates and cost per contact must be validated with Tata Play customer-service leadership.",
    },
    pilotScope:
      "A 10-week pilot running two-way recharge reminders and pack-change conversations for one subscriber cohort in Hindi, Tamil and Telugu with in-channel payment, measured on recharge conversion against a control cohort.",
    expansion: [
      "Extend recharge and pack management across the full base with Bengali, Marathi, Kannada and Malayalam coverage.",
      "Add guided set-top box troubleshooting with technician-visit booking and avoidable-visit reduction.",
      "Add churn-risk retention and win-back outreach with an approved offer matrix and specialist routing for high-value saves.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer / Head of Service Delivery",
      "Chief Marketing Officer (retention and subscriber revenue)",
      "Chief Information Officer / Head of Technology",
      "Head of Customer Service Operations",
    ],
    discovery: [
      "What share of subscribers lapse each month before recharging, and how are they pursued today?",
      "What proportion of technical-support calls result in a technician visit, and how many of those are avoidable?",
      "What is the current IVR containment rate, and which call types escape it?",
      "Is set-top box telemetry available in real time to support guided troubleshooting?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Tata Play subscriber in Coimbatore is reminded in Tamil that her pack expires tomorrow, switches to a cheaper pack and recharges in the same conversation.",
  },

  "act-fibernet": {
    operatingContext:
      "ACT Fibernet, operated by Atria Convergence Technologies, is one of India's larger non-telco fixed-line broadband providers, delivering fibre-to-the-home internet to residential subscribers and small businesses concentrated in southern cities — Bengaluru, Hyderabad, Chennai and Coimbatore among them — plus Delhi. Unlike the integrated telcos it competes against, it has no mobile business to bundle with, so it must win and hold subscribers purely on broadband speed, reliability and service quality. Its subscribers are urban households and work-from-home professionals for whom an outage is immediately disruptive, and its contact load reflects that: connectivity complaints and speed issues, plan changes and upgrades, monthly payment and renewal, new-connection and relocation requests, and router or wiring faults requiring an engineer visit. Contact runs through a subscriber app and self-care portal, a helpline with IVR, WhatsApp servicing, and a local field-engineer network per city.",
    strategicPressure: [
      { text: "ACT Fibernet is a major fixed-line fibre broadband provider concentrated in southern Indian cities, competing against integrated telcos that can bundle mobile with home broadband.", kind: "verified" },
      { text: "Without a mobile business to bundle, ACT must defend subscribers on service quality and reliability, so complaint handling and outage communication are direct retention levers.", kind: "verified" },
      { text: "A localised outage in a fibre network affects an entire apartment complex or street simultaneously, producing tightly clustered call spikes that a shared helpline handles poorly.", kind: "inference" },
      { text: "Monthly renewal and payment reminders across the base are a recurring outbound workload that is probably run as broadcast SMS rather than as conversations that actually convert.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "ACT is buy-led. It is a network and service operator whose investment goes into fibre infrastructure, capacity and field operations. Its technology estate — subscriber management, provisioning, billing, network monitoring, field dispatch — is procured and integrated. A regional ISP under price pressure from national telcos will not fund a conversational platform build.",
    whyNotBuild:
      "Serving Kannada, Telugu, Tamil, Hindi and English subscribers on outage-day clusters requires elastic multilingual capacity grounded live in network monitoring and provisioning systems. Building speech, telephony, orchestration and evaluation would create a permanent cost base in a business defending margins against much larger competitors — exactly the wrong shape.",
    workflows: [
      {
        name: "Connectivity outage handling and proactive area notification",
        friction: "When a fibre cut or area fault occurs, every affected subscriber calls within minutes; the helpline saturates and each caller is separately told what the network team already knows.",
        outcome: "Affected subscribers identified against the network fault and notified proactively with cause and restoration estimate in their language, with inbound calls answered instantly by the same grounded status.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Network monitoring / fault management", "Subscriber-to-node mapping", "Field engineer dispatch", "Subscriber management system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Individual fault triage and engineer-visit scheduling",
        friction: "Single-subscriber problems — router faults, wiring, speed complaints — go through IVR and scripted agents; many result in an engineer visit that could have been avoided, and visit slots are set without confirming availability.",
        outcome: "Guided conversational diagnostics using live line telemetry that resolves what can be resolved remotely, and books a confirmed engineer slot with reminders where a visit is genuinely required.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Line diagnostics and telemetry", "Field engineer scheduling and work orders", "Subscriber management system", "Router / CPE management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Renewal, payment and plan-change outreach",
        friction: "Renewal reminders go out as broadcast SMS; subscribers considering a downgrade or a switch to a competitor are never actually spoken to, so churn is discovered after it happens.",
        outcome: "Two-way renewal conversations in the subscriber's language that complete payment in-channel, present suitable plan options within approved rules, and capture switching intent for retention handling.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Billing and subscriber management", "Plan and pricing master", "Payment gateway", "Retention offer matrix", "Consent register"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Subscriber app and self-care portal for payment, plan view and complaint logging",
        "Helpline with IVR plus WhatsApp servicing for routine requests",
        "SMS notifications for renewals, payments and some outage events",
        "City-level field engineer network for installations and fault resolution",
      ],
      gaps: [
        "Area outages are not communicated proactively, so every affected subscriber calls",
        "Fault triage is scripted rather than telemetry-driven, producing avoidable engineer visits",
        "Renewal reminders are one-way and do not convert intent in the moment",
        "Churn intent is captured only after the subscriber has already left",
      ],
    },
    risks: [
      "TRAI regulations govern telecom service quality reporting and commercial communications; outbound renewal and retention outreach must respect DND and calling-window rules.",
      "Retention offers must be bounded by an approved commercial matrix, with exceptions escalated to humans to prevent margin leakage in a price-pressured market.",
      "DPDP Act obligations on subscriber data, with identity verification before account disclosure and controlled retention of call transcripts.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions from subscriber-base scale and broadband service contact patterns; actual helpline volumes, outage call clustering, engineer-visit rates and cost per contact must be validated with ACT service operations in discovery.",
    },
    pilotScope:
      "A 10-week pilot in Bengaluru and Hyderabad handling connectivity complaints with proactive area-outage notification in Kannada, Telugu, Hindi and English, grounded in network fault data, measured on calls per outage event.",
    expansion: [
      "Extend to Chennai, Coimbatore and Delhi with Tamil coverage and add telemetry-driven fault triage with engineer-visit booking.",
      "Add two-way renewal and payment conversations with in-channel payment and plan options.",
      "Add churn-intent capture and retention offers within an approved matrix, with specialist routing for high-value subscribers.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer / Head of Service Delivery",
      "Chief Technology Officer / Head of Network Operations",
      "Head of Customer Experience",
      "Chief Marketing Officer (retention and renewals)",
    ],
    discovery: [
      "When an area fault occurs, how many calls arrive in the first thirty minutes and what share are abandoned?",
      "Can network monitoring map affected subscribers to a fault reliably enough for proactive notification?",
      "What percentage of fault calls result in an engineer visit, and how many are resolved remotely today?",
      "How are renewal reminders run, and is anyone measuring conversion from reminder to payment?",
    ],
    flowTemplate: "retention",
    scenario: "When a fibre cut hits a Bengaluru apartment complex, every affected subscriber gets a Kannada WhatsApp message with the cause and restoration estimate before they call.",
  },

  "justdial": {
    operatingContext:
      "Justdial, now majority-owned by Reliance Retail, is India's long-established local search and business-listing platform, connecting consumers looking for local services with businesses that pay to be listed and promoted. Its model has two engines that both run on telephony: a consumer side where users search by phone, app or web and are connected to relevant local businesses, and an advertiser side where a very large tele-sales and tele-account-management workforce sells and renews paid listing subscriptions to small and medium businesses across hundreds of Indian towns and cities. Subscription renewal is the commercial heartbeat — advertisers are small businesses with high churn propensity, so a large calling operation exists purely to retain and upsell them. Consumers reach Justdial through its search app, website and voice search line; advertisers deal with tele-sales executives and field representatives.",
    strategicPressure: [
      { text: "Justdial operates India's established local search and business-listing platform and is majority-owned by Reliance Retail, monetising primarily through paid advertiser listings and subscriptions.", kind: "verified" },
      { text: "Its advertiser base is small and medium businesses with high churn propensity, so subscription renewal calling is a permanent, large-scale operational cost tied directly to revenue retention.", kind: "verified" },
      { text: "Competition from search engines, marketplaces and vertical aggregators pressures both consumer usage and advertiser willingness to pay, sharpening the focus on cost per retained advertiser.", kind: "inference" },
      { text: "The tele-calling operation is a cost centre rather than differentiated IP, which makes automating its routine tiers a direct margin play rather than a strategic surrender.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Justdial is partner-led. It has genuine engineering capability in search, listings, ranking and data products, and Reliance ownership adds group platform ambitions. But the tele-calling engine is operational scale, not proprietary technology, and its engineers are needed on the search and commerce products. A partner-delivered conversational layer over its own CRM and subscription systems is the pragmatic route.",
    whyNotBuild:
      "Building conversational calling for hundreds of thousands of advertiser renewals across a dozen languages means owning speech, telephony at very high volume, and an evaluation regime for sales-adjacent conversations that carry commitment risk. That is a specialist platform investment competing with the search and data roadmap, and its payback is measured in cost per retained advertiser — a metric a bought, usage-priced layer maps to directly.",
    workflows: [
      {
        name: "Advertiser subscription-renewal outreach",
        friction: "Renewal calling is worked from lists by executives during shift hours; a large share of the expiring base is never reached, pitches vary by executive, and reasons for non-renewal are recorded thinly if at all.",
        outcome: "Every expiring advertiser contacted in their own language within permitted windows, renewal value explained from their own listing performance data, payment completed in-channel, and non-renewal reasons captured as structured data.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Advertiser subscription and billing system", "Listing performance analytics", "Payment gateway", "CRM", "Consent and DND register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Advertiser onboarding and listing-content collection",
        friction: "New advertisers need listing details, categories, photographs, timings and service areas collected; this is done by executives over calls, so listings go live incomplete and perform poorly, which then drives churn.",
        outcome: "Structured conversational onboarding that collects and validates listing content in the advertiser's language, gets the listing live complete, and sets performance expectations from the first day.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Listing management system", "Category and taxonomy master", "Media upload and moderation workflow", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Advertiser service and query handling",
        friction: "Advertisers call about lead quality, listing edits, billing and ranking questions and reach whichever executive is available, so answers vary and account managers are consumed by routine requests.",
        outcome: "Grounded answers on lead delivery, billing and listing status from the advertiser's own account, with listing edits executed in-channel and genuine commercial disputes routed to account managers.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["Advertiser account and lead-delivery records", "Billing system", "Listing management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer search app, website and voice search line connecting users to local businesses",
        "Large tele-sales and tele-account-management workforce for advertiser acquisition and renewal",
        "Advertiser dashboard showing listing presence and lead delivery",
        "SMS and email billing and renewal notifications",
      ],
      gaps: [
        "A large share of the expiring advertiser base is never actually reached before lapse",
        "Non-renewal reasons are not captured as structured, analysable data",
        "New advertiser listings go live incomplete, depressing performance and driving churn",
        "Routine advertiser service queries consume account-management capacity",
      ],
    },
    risks: [
      "TRAI DND, calling-window and commercial-communication rules apply squarely to very high-volume advertiser outbound; scrubbing, consent and opt-out handling are enforcement-critical at this scale.",
      "Sales-adjacent conversations create commitment risk — pricing, renewal terms and performance claims must be bounded by approved content, with anything negotiated escalated to a human.",
      "DPDP Act obligations on advertiser and consumer personal data, and clarity on how data flows under Reliance group ownership.",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions from advertiser-base scale and renewal-calling intensity; actual expiring-base size, contact coverage, calling headcount and cost per retained advertiser must be validated with Justdial sales operations in discovery.",
    },
    pilotScope:
      "A 10-week pilot running subscription-renewal outreach for one advertiser cohort in Hindi, Tamil and Marathi with performance-grounded renewal conversations and in-channel payment, measured on renewal rate against a control cohort.",
    expansion: [
      "Extend renewal outreach across the full expiring base with additional regional languages and structured churn-reason capture.",
      "Add conversational advertiser onboarding and listing-content collection to raise first-month listing performance.",
      "Add advertiser service and query handling with in-channel listing edits and account-manager escalation.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer / Head of Sales Operations",
      "Chief Technology Officer",
      "Head of Advertiser Retention and Account Management",
      "Chief Financial Officer (cost per retained advertiser)",
    ],
    discovery: [
      "What share of the expiring advertiser base is actually contacted before lapse each month?",
      "Is non-renewal reason captured today in any structured form?",
      "Does Reliance intend to fold Justdial operations into group-built platforms, and on what timeline?",
      "How large is the tele-calling workforce, and what is the fully-loaded cost per renewal contact?",
    ],
    flowTemplate: "retention",
    scenario: "A Coimbatore restaurant owner is called in Tamil about his expiring Justdial listing, shown his lead numbers, and renews by payment link in the same call.",
  },

  "pvr-inox": {
    operatingContext:
      "PVR INOX is India's largest cinema exhibition company, formed by the merger of PVR and INOX Leisure, operating a very large screen count across multiplexes in metros, tier-2 and tier-3 cities under several brand formats from standard multiplex screens to premium and luxury formats. Its economics rest on two legs: box-office admissions, and food and beverage sales at a high margin per patron, which is why in-cinema ordering and loyalty engagement matter as much as ticketing. A large share of its ticket sales flow through third-party online ticketing platforms rather than its own app, which means the customer relationship — and much of the service contact — is split between PVR INOX and the aggregator. Its contact load is intensely event-driven: a major release weekend produces booking, cancellation, refund and seat-issue volume that dwarfs an ordinary weekday. Patrons reach it through its own app and website, cinema box offices and managers, a customer-care line, and social channels.",
    strategicPressure: [
      { text: "PVR INOX is India's largest cinema exhibitor, formed by the merger of PVR and INOX Leisure, operating a very large national screen network across multiple formats.", kind: "verified" },
      { text: "Food and beverage revenue per patron is a critical margin driver in Indian exhibition, making in-cinema ordering and upsell commercially significant rather than incidental.", kind: "verified" },
      { text: "Because much ticketing runs through third-party platforms, PVR INOX's direct customer contact is concentrated on issues those platforms cannot resolve — seat problems, in-cinema experience, refunds tied to show cancellations and loyalty questions.", kind: "inference" },
      { text: "Release-weekend contact spikes are highly predictable in timing but not in magnitude, which is exactly the shape that argues for elastic rather than staffed capacity.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "PVR INOX is buy-led. Its business is real-estate-anchored exhibition and food-and-beverage operations; technology is procured — ticketing and box-office systems, food-and-beverage point of sale, loyalty platforms — and integrated. Post-merger, technology attention is on consolidating two estates, which further argues against any internal platform build.",
    whyNotBuild:
      "The requirement is elastic multilingual capacity that spikes on release weekends, grounded in ticketing, show-schedule and loyalty systems, with refund handling that respects both its own policy and the aggregator's. Building speech, telephony and orchestration for that would create a permanent cost against an intermittent demand curve in a business whose margins depend on operating leverage.",
    workflows: [
      {
        name: "Booking, cancellation and refund support around big releases",
        friction: "Release weekends generate booking questions, cancellation requests and refund queries — including show cancellations and technical issues — that overwhelm a customer-care line staffed for weekday volume.",
        outcome: "Elastic multilingual handling of booking, cancellation and refund conversations grounded in the ticketing system and refund policy, with aggregator-originated bookings routed correctly rather than bounced.",
        channels: ["Voice", "WhatsApp", "App", "Web"],
        systems: ["Ticketing and box-office system", "Show schedule and seat inventory", "Refund and payments ledger", "Third-party aggregator booking references"],
        value: 3,
        complexity: 2,
      },
      {
        name: "In-cinema food-and-beverage ordering and service issues",
        friction: "In-seat and counter ordering depends on staff and app adoption; when an order is wrong or delayed the patron complains to a floor manager, and the incident is never captured centrally.",
        outcome: "Conversational in-seat ordering that writes into the food-and-beverage point of sale, and service issues captured and routed to the cinema manager in real time with central visibility of patterns.",
        channels: ["WhatsApp", "App", "In-seat QR"],
        systems: ["Food and beverage point of sale", "Cinema operations / manager workflow", "Payment gateway", "Loyalty programme"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Loyalty programme and corporate or bulk-booking enquiries",
        friction: "Loyalty point queries, tier benefits and voucher issues need agent lookups, while corporate, group and private-screening enquiries wait for a sales contact who may respond days later.",
        outcome: "Grounded loyalty answers and voucher handling in-channel, and bulk or private-screening enquiries qualified immediately on date, screen and headcount and routed to the sales team with a complete brief.",
        channels: ["Voice", "WhatsApp", "App", "Web form"],
        systems: ["Loyalty programme platform", "Voucher and offer management", "Screen availability and booking system", "Corporate sales CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Own mobile app and website for ticket booking, seat selection and food pre-ordering",
        "Customer-care line plus cinema box offices and floor managers",
        "Loyalty programme with points, tiers and member offers",
        "Presence on third-party online ticketing platforms that handle a large share of bookings",
      ],
      gaps: [
        "Release-weekend contact spikes exceed staffed customer-care capacity",
        "Aggregator-originated booking issues bounce between the platform and the cinema",
        "In-cinema service incidents are resolved locally and never aggregated for pattern analysis",
        "Corporate and bulk-booking enquiries wait for a sales contact rather than being qualified immediately",
      ],
    },
    risks: [
      "Refund and cancellation entitlements differ between direct bookings and aggregator bookings, so the agent must apply the correct policy per channel and never improvise a refund commitment.",
      "DPDP Act obligations on patron and loyalty data, with identity verification before booking disclosure and controlled transcript retention.",
      "TRAI DND and commercial-communication rules on promotional release and offer campaigns, which must be consent-anchored and separated from transactional booking messages.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from screen count and admissions-linked contact patterns with heavy release-weekend skew; the share of contact reaching PVR INOX directly versus absorbed by ticketing platforms must be established in discovery before sizing.",
    },
    pilotScope:
      "An 8-week pilot covering booking, cancellation and refund contacts for the Delhi NCR and Mumbai cinema clusters in Hindi and English across a major release window, grounded in the ticketing system and refund policy.",
    expansion: [
      "Extend nationally with Tamil, Telugu, Kannada and Marathi coverage and elastic capacity provisioned per release calendar.",
      "Add in-seat food-and-beverage ordering into the point of sale with real-time service-issue routing to cinema managers.",
      "Add loyalty query handling and immediate qualification of corporate, group and private-screening enquiries.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer, Cinema Operations",
      "Chief Information Officer / Head of Technology",
      "Head of Food and Beverage",
      "Head of Marketing and Loyalty",
    ],
    discovery: [
      "What share of patron contact reaches PVR INOX directly versus being absorbed by third-party ticketing platforms?",
      "On a major release weekend, what multiple of weekday contact volume arrives and how is it handled?",
      "Can the food-and-beverage point of sale accept an in-seat order placed through a conversational channel?",
      "How are corporate and private-screening enquiries handled today, and what is the median response time?",
    ],
    flowTemplate: "inbound-service",
    scenario: "On a blockbuster Friday a patron whose show is cancelled gets the refund policy, the alternative showtimes and a confirmed rebooking on WhatsApp in Hindi.",
  },

  "wonderla-holidays": {
    operatingContext:
      "Wonderla Holidays operates amusement and water parks in Kochi, Bengaluru, Hyderabad and Bhubaneswar, with further parks in development, plus a resort attached to its Bengaluru park. Its business is sharply seasonal and calendar-driven: school holidays, summer months, weekends and festival periods carry the bulk of footfall, and weekday off-season traffic depends heavily on organised group business — school excursions, college trips and corporate outings — booked weeks in advance by an institutional decision-maker rather than a walk-up consumer. That group segment is where the enquiry-to-booking conversation matters most, since a single school trip can represent hundreds of tickets. Its customers span Malayalam, Kannada, Telugu, Odia, Hindi and English speaking regions. Contact runs through park websites and an online ticketing flow, park-level enquiry numbers, a sales team handling group bookings, and social channels.",
    strategicPressure: [
      { text: "Wonderla operates amusement parks in Kochi, Bengaluru, Hyderabad and Bhubaneswar with a resort at its Bengaluru park, and has an expansion pipeline into further cities.", kind: "verified" },
      { text: "Park economics are dominated by footfall concentration in holidays and weekends, so filling weekday capacity through group and institutional bookings is the main controllable revenue lever.", kind: "inference" },
      { text: "Group booking enquiries come from schools, colleges and corporate organisers who compare venues and commit early; slow or inconsistent response directly loses a high-ticket booking.", kind: "inference" },
      { text: "Each new park city adds a language and a local enquiry stream that a small central sales team is unlikely to serve well.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Wonderla is buy-led. It is a parks operator whose capital goes into rides, water attractions, land and park expansion. Its technology is a procured ticketing, point-of-sale and booking estate, and it has no software organisation. Conversational infrastructure is an obvious purchase, not a build candidate.",
    whyNotBuild:
      "Handling group enquiries well needs a conversational layer that quotes group pricing from an approved matrix, checks date capacity, captures headcount and requirements, and routes to a human seller — in Malayalam, Kannada, Telugu, Odia and Hindi. Building speech, telephony and orchestration for a four-park operator would cost more than the sales team it supports.",
    workflows: [
      {
        name: "Group and school-trip booking enquiry qualification",
        friction: "School and corporate organisers enquire by phone and web form; responses depend on a small sales team's availability, quotes are inconsistent, and organisers who do not hear back quickly book a competing venue.",
        outcome: "Every group enquiry engaged immediately in the organiser's language, qualified on date, headcount, age group and requirements against live date capacity, with an approved-rate indication and a booked call with a sales manager.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Group booking / reservations system", "Date capacity and park calendar", "Group rate matrix", "Sales CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Consumer ticket enquiry, booking support and visit preparation",
        friction: "Families ask about timings, ride availability, height restrictions, what to bring, locker and food arrangements and weather policy; these arrive at park numbers and social channels and are answered inconsistently.",
        outcome: "Grounded answers on timings, attractions, restrictions and park policies in the visitor's language, with booking completed in-channel and pre-visit preparation guidance pushed before the visit date.",
        channels: ["Voice", "WhatsApp", "Web", "SMS"],
        systems: ["Online ticketing system", "Park operations and ride-status data", "Policy and FAQ knowledge base", "Payment gateway"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Off-peak demand generation and group re-engagement",
        friction: "Weekday capacity goes unsold while past group organisers — schools that came last year, corporates that ran an outing — are never systematically re-approached.",
        outcome: "Consented seasonal outreach to past and prospective group organisers in their language, offering off-peak dates with approved pricing and converting into a held date with a sales handoff.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Group booking history / CRM", "Park calendar and capacity", "Group rate matrix", "Consent register"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Park websites with online ticket booking and offers",
        "Park-level enquiry phone numbers and on-site ticket counters",
        "A sales team handling school, college and corporate group bookings",
        "Social media channels used heavily for enquiries and announcements",
      ],
      gaps: [
        "Group enquiries wait on a small sales team, so high-ticket organisers go elsewhere",
        "Consumer enquiries are answered inconsistently across park numbers and social channels",
        "Past group organisers are not systematically re-approached for repeat visits",
        "Local-language service depends on which park staff answer rather than on the platform",
      ],
    },
    risks: [
      "Safety and ride-restriction information — height, health and age restrictions — must be relayed exactly from official park policy, never paraphrased, since it affects visitor safety and admission at the gate.",
      "TRAI DND and calling-window rules apply to group re-engagement outreach, which is promotional and must be consent-anchored.",
      "Group pricing is commercially negotiated; the agent may indicate only approved published rates and must route negotiation to the sales team.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from park count, footfall seasonality and group-booking enquiry patterns; actual enquiry volumes, group-booking revenue share and current response times must be validated with Wonderla sales and marketing leadership.",
    },
    pilotScope:
      "An 8-week pilot handling group and school-trip enquiries for the Bengaluru and Kochi parks in Kannada, Malayalam and English, qualifying on date, headcount and requirements against live capacity and booking sales-manager calls.",
    expansion: [
      "Extend to Hyderabad and Bhubaneswar with Telugu and Odia coverage, and to new parks as they open.",
      "Add consumer ticket enquiry, booking support and pre-visit preparation guidance.",
      "Add consented off-peak group re-engagement outreach to past and prospective organisers.",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Operating Officer, Parks",
      "Head of Sales and Marketing",
      "Head of Information Technology",
      "Park General Manager (operations and safety)",
    ],
    discovery: [
      "What share of revenue comes from group and institutional bookings, and how is that enquiry flow handled today?",
      "What is the median response time on a school-trip enquiry, and how often does it lose to a competing venue?",
      "Can the booking system expose date-level capacity so an agent can quote availability accurately?",
      "Are past group organisers held in a CRM that could support consented seasonal re-engagement?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A school coordinator in Kochi enquires about a 300-student trip in Malayalam and leaves with a held date and a scheduled call with the group sales manager.",
  },

  "devyani-international": {
    operatingContext:
      "Devyani International is one of India's largest quick-service restaurant franchisees, operating KFC, Pizza Hut and Costa Coffee outlets across India as a franchise partner of the global brand owners, alongside international operations in Nepal and Nigeria and some own-brand and other franchised formats. Its business is store operations at scale — site selection, kitchen throughput, staffing, supply chain and unit economics — across many hundreds of outlets in metros and smaller cities. The customer-contact reality is distinctive: a large and growing share of orders arrive through third-party delivery aggregator platforms, where the aggregator owns the customer relationship and the first line of complaint handling, while dine-in and takeaway issues surface at the store and brand-level complaints route to Devyani as the operator even though the brand is not its own. Contact reaches it through brand apps and websites, aggregator platforms, store staff and managers, and a customer-care function.",
    strategicPressure: [
      { text: "Devyani International operates KFC, Pizza Hut and Costa Coffee stores across India as a franchisee, alongside international operations, with store expansion as its principal growth engine.", kind: "verified" },
      { text: "A large share of QSR orders in India now flow through third-party delivery aggregators, which sit between the operator and the end customer on both ordering and complaint handling.", kind: "verified" },
      { text: "Because the brands are franchised, service consistency across hundreds of outlets is a contractual obligation to the brand owner as well as a commercial one, and complaint handling is where inconsistency shows first.", kind: "inference" },
      { text: "Store-level complaint resolution is probably handled by managers ad hoc, so the operator has limited structured visibility of which outlets generate recurring problems.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Devyani is buy-led. It is a store-operations franchisee whose capital goes into new outlets, kitchen equipment and supply chain, and whose technology comes partly from the brand owners' global systems and partly from procured point-of-sale, aggregator integration and workforce tools. It builds nothing, and a franchisee has no mandate to develop customer-facing platform software for brands it does not own.",
    whyNotBuild:
      "Its complaint and feedback problem needs a multilingual layer that recognises whether an order came through an aggregator or a direct channel, applies the correct brand's service-recovery policy, executes refunds or vouchers within authority, and reports patterns by outlet. Building speech and orchestration for that would be an odd investment for a franchisee — and the brand owners, not Devyani, would own the resulting customer experience standards anyway.",
    workflows: [
      {
        name: "Order-issue resolution and service recovery",
        friction: "Wrong, missing or poor-quality orders are raised through aggregator apps, brand apps and store phone numbers; resolution depends on the channel and the store manager, refunds and vouchers are given inconsistently, and no central record links the incident to the outlet.",
        outcome: "One multilingual complaint path that identifies the order and channel, applies the correct brand's service-recovery policy within authority limits, issues the refund or voucher, and records the incident against the outlet.",
        channels: ["Voice", "WhatsApp", "App", "Web"],
        systems: ["Point of sale / order records", "Aggregator order integration", "Refund and voucher issuance", "Store operations and incident register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store-level feedback capture and pattern reporting",
        friction: "Feedback is collected via aggregator ratings and occasional surveys, so the operator learns about a failing outlet from a declining rating rather than from a structured signal it can act on quickly.",
        outcome: "Structured post-order feedback in the customer's language, aggregated by outlet, daypart and issue type, so area managers get an actionable weekly signal instead of a rating average.",
        channels: ["WhatsApp", "SMS", "App"],
        systems: ["Order records", "Store master and area-manager hierarchy", "Feedback and analytics platform", "Aggregator ratings feed"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Catering, bulk-order and corporate enquiry handling",
        friction: "Bulk and party orders and corporate catering enquiries arrive at store numbers and are handled by whoever answers between service rushes, so high-value orders are quoted inconsistently or lost.",
        outcome: "Bulk and catering enquiries qualified conversationally on date, quantity, location and menu against store capacity and approved pricing, then confirmed with the store and the customer.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Store capacity and production planning", "Menu and pricing master", "Order management / point of sale", "Area sales workflow"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand mobile apps and websites operated with the global brand owners for direct ordering",
        "Third-party delivery aggregator presence handling a large share of orders and first-line complaints",
        "Store-level phone numbers and managers handling walk-in and takeaway issues",
        "A customer-care function receiving brand-level complaints and escalations",
      ],
      gaps: [
        "Complaint handling differs by channel and by store manager, with no consistent service-recovery standard",
        "Incidents are not linked to outlets in a way that supports operational correction",
        "Structured customer feedback is largely limited to aggregator ratings the operator does not control",
        "Bulk and catering enquiries are handled at stores during service rushes and are frequently lost",
      ],
    },
    risks: [
      "Franchise agreements with the global brand owners govern customer-facing experience standards, so any automated layer must be compatible with brand-mandated service and data requirements.",
      "Food-safety complaints must be escalated immediately to a human and to quality assurance, never handled conversationally as a routine refund case.",
      "DPDP Act obligations on customer order and contact data, complicated by aggregator-mediated orders where the platform holds the customer relationship.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.85,
      automationRate: 0.55,
      basis: "Seller assumptions from outlet count and order-volume-linked complaint rates; the crucial unknown is how much customer contact reaches Devyani directly versus being absorbed by aggregator platforms, which must be quantified in discovery.",
    },
    pilotScope:
      "An 8-week pilot handling order-issue complaints for one brand's outlets in two cities in Hindi and English, applying brand service-recovery policy within authority limits and recording every incident against the outlet.",
    expansion: [
      "Extend across brands and cities with Bengali, Tamil, Telugu and Marathi coverage.",
      "Add structured post-order feedback capture with outlet-level pattern reporting to area managers.",
      "Add bulk-order and corporate catering enquiry handling qualified against store capacity and approved pricing.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer (brand operations)",
      "Head of Customer Experience / Quality Assurance",
      "Head of Information Technology",
      "Head of Marketing and Delivery Channel Partnerships",
    ],
    discovery: [
      "What share of customer complaints reaches Devyani directly versus being resolved inside aggregator platforms?",
      "Do the franchise agreements constrain how customer complaints may be handled or what data may be processed?",
      "Are complaints currently linked to specific outlets in a way area managers can act on?",
      "How are bulk and catering enquiries handled today, and what is the estimated loss rate?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer whose Pizza Hut delivery arrived incomplete raises it on WhatsApp in Hindi, gets the approved refund applied, and the incident is logged against that outlet.",
  },

  "vlcc": {
    operatingContext:
      "VLCC Health Care operates a long-established network of wellness, slimming, dermatology and beauty clinics across Indian cities alongside a personal-care products business and vocational training institutes, with some international presence. Its clinic model is package-based rather than transactional: customers buy multi-session slimming, skin or beauty programmes paid upfront or in instalments and then return for scheduled sessions over weeks or months, which means clinic revenue depends on session utilisation, package completion and renewal rather than on walk-in volume. The network mixes company-owned clinics with franchised ones, so service consistency varies. Its customers are predominantly urban women across Hindi, Bengali, English and regional-language markets, and they interact constantly: booking sessions, rescheduling, being reminded, being sold renewals and upgrades, and responding to lead-generation campaigns. Contact today runs through clinic-level phone lines and reception desks, tele-callers working lead and renewal lists, a website and app, and WhatsApp threads maintained by individual clinics.",
    strategicPressure: [
      { text: "VLCC operates a network of wellness, slimming and beauty clinics across India alongside personal-care products and vocational training, with a mix of company-owned and franchised clinics.", kind: "verified" },
      { text: "Package-based clinic economics mean revenue depends on session attendance and package completion — a no-show is a wasted therapist hour and a step toward an unfinished, unrenewed package.", kind: "inference" },
      { text: "Lead-generation campaigns for slimming and skin programmes produce enquiry volumes that clinic-level tele-callers work inconsistently, so acquisition spend leaks at the follow-up stage.", kind: "inference" },
      { text: "Franchised clinics likely deliver noticeably different responsiveness from company-owned ones, which shows up as inconsistent brand experience in the same city.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "VLCC is buy-led. It is a services business running clinics and training centres; its technology is a procured clinic-management, appointment and CRM estate. Under its current ownership structure, capital and attention go to clinic performance and network rationalisation, and there is no software organisation that could take on conversational infrastructure.",
    whyNotBuild:
      "Its needs are appointment reminders and rebooking against therapist and room availability, lead follow-up that converts campaign spend, and consented renewal outreach — in Hindi, Bengali, English and regional languages, across company-owned and franchised clinics with different systems maturity. Building speech, telephony and orchestration for that is far beyond a clinic chain's capability and would cost more than the tele-calling it replaces.",
    workflows: [
      {
        name: "Session booking, reminders and no-show recovery",
        friction: "Sessions are booked at clinic reception or by phone during clinic hours; reminders are inconsistent, no-shows waste therapist and room capacity, and rescheduling requires another call into the same desk.",
        outcome: "Sessions booked and rescheduled conversationally against live therapist and room availability, reminders sent with one-tap rescheduling, and same-day no-shows re-engaged to refill the slot.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Clinic management / appointment system", "Therapist and room scheduling", "Customer package records", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Campaign lead follow-up and consultation booking",
        friction: "Slimming and skin-programme campaigns generate enquiries that clinic tele-callers work during working hours; many prospects are never called, and qualification quality varies clinic by clinic.",
        outcome: "Every enquiry engaged within minutes in the prospect's language, qualified on interest, location and availability, and booked into a consultation slot at the nearest clinic with reminders.",
        channels: ["Voice", "WhatsApp", "Web form"],
        systems: ["Lead management / CRM", "Clinic consultation calendars", "Programme and pricing master", "Consent register"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Package renewal, upgrade and completion outreach",
        friction: "Customers with sessions remaining, or with packages about to expire, are chased inconsistently by clinic staff between appointments, so completion and renewal rates depend on individual initiative.",
        outcome: "Consented outreach informed by the customer's actual session history that books remaining sessions, presents renewal or upgrade options within approved pricing, and routes genuine intent to a clinic counsellor.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Customer package and session-history records", "Clinic management system", "Pricing and offer master", "Consent register"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Clinic-level reception desks and phone lines handling bookings and enquiries",
        "Tele-callers working campaign leads and renewal lists",
        "Website and app with enquiry capture and clinic locator",
        "SMS and WhatsApp appointment reminders maintained at clinic level",
      ],
      gaps: [
        "Bookings and rescheduling cannot be completed outside clinic hours",
        "Campaign leads exceed tele-calling capacity, so acquisition spend leaks at follow-up",
        "No-shows are not systematically recovered and slots go unfilled",
        "Service responsiveness differs between company-owned and franchised clinics with no central measurement",
      ],
    },
    risks: [
      "Wellness and dermatology services carry health-claim sensitivity: the agent must never make outcome, weight-loss or clinical claims, and any medical or skin-condition question must route to a qualified consultant.",
      "DPDP Act obligations on customer health, body-measurement and treatment data, which is sensitive personal data requiring explicit consent and controlled retention.",
      "TRAI DND, calling-window and commercial-communication rules apply to lead follow-up and renewal outreach, which is promotional and must be consent-anchored and scrubbed.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions from clinic count and package-based session frequency; actual appointment volumes, no-show rates, campaign lead flow and tele-calling cost must be validated with VLCC operations, separating company-owned from franchised clinics.",
    },
    pilotScope:
      "An 8-week pilot across company-owned Delhi NCR clinics running session reminders, rescheduling and same-day no-show recovery in Hindi and English against live therapist availability, measured on no-show rate and slot refill.",
    expansion: [
      "Extend to company-owned clinics nationally with Bengali, Marathi, Tamil and Telugu coverage, and add campaign lead follow-up with consultation booking.",
      "Add consented package renewal, upgrade and completion outreach informed by session history.",
      "Extend the layer to franchised clinics as a brand-standard service capability with central measurement.",
    ],
    stakeholders: [
      "Chief Executive Officer / Managing Director",
      "Chief Operating Officer, Clinics",
      "Head of Sales and Marketing",
      "Head of Information Technology",
      "Head of Franchise Operations",
    ],
    discovery: [
      "What is the current no-show rate on booked sessions, and how much therapist capacity does it waste?",
      "How many campaign leads are generated monthly, and what share receive a first call within a day?",
      "Are package and session histories held centrally, or clinic by clinic in separate systems?",
      "How do renewal and completion rates differ between company-owned and franchised clinics?",
    ],
    flowTemplate: "appointments",
    scenario: "A VLCC customer in Noida who missed her slimming session is reached in Hindi the same afternoon and rebooked into an evening slot that would otherwise go empty.",
  },
};
