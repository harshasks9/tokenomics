import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_KR_TW_B: Record<string, ProfileAnalysis> = {
  "severance-hospital": {
    operatingContext:
      "Severance Hospital is the flagship of Yonsei University Health System, one of Korea's big-five academic medical centres, operating the main Sinchon campus alongside Gangnam Severance, Yongin Severance and a cancer hospital and heart vascular hospital on the Sinchon site. Its administrative load is dominated by outpatient appointment booking against scarce named-professor slots, referral intake from clinics and regional hospitals, and pre-visit preparation instructions for imaging, endoscopy and day-surgery. Patients reach it through a phone reservation centre that saturates at opening hour, a hospital app and web reservation portal, and increasingly through KakaoTalk alerts for confirmations. Because Korea's national health insurance permits direct access to tertiary centres, demand for specialist slots consistently exceeds supply, and every no-show is a slot that a waiting patient could have used.",
    strategicPressure: [
      { text: "Korean tertiary hospitals have operated under sustained disruption since the 2024 medical-trainee dispute, forcing outpatient scheduling and referral flows to be re-planned repeatedly across campuses.", kind: "verified" },
      { text: "Named-professor specialist slots at big-five centres carry waiting periods long enough that a no-show is effectively unrecoverable capacity for that clinic session.", kind: "inference" },
      { text: "Reservation-centre staffing cannot be scaled to the 8-9am booking peak without carrying that headcount all day, so the peak is absorbed as abandoned calls rather than as cost.", kind: "inference" },
      { text: "Multi-campus operation means a patient referred between Sinchon, Gangnam and Yongin repeats identification and history to a different administrative desk each time.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Yonsei University Health System's technology investment concentrates on the electronic medical record, clinical decision support and research data platforms, with clinical informatics faculty publishing on medical AI rather than on patient-communication infrastructure. Administrative patient contact is owned by the hospital administration office and served by outsourced or in-house reservation-centre staff, which is a procurement line item rather than an engineering programme. This is a buy-led profile: the buyer is administration, and the purchase is a workflow, not a platform.",
    whyNotBuild:
      "A university health system can build clinical models on its own data because that is its research mission and its differentiation. It has no reason to build Korean speech recognition tuned to elderly callers, carrier-grade telephony for a reservation centre, orchestration into a hospital information system, or a conversation-evaluation harness — none of these produce papers, patents or clinical outcomes. Buying gives the administration office a measurable no-show and abandoned-call number within a quarter, which no internal build could match.",
    workflows: [
      {
        name: "Specialist appointment reminder and one-tap reschedule",
        friction: "Reminders today are one-way SMS or KakaoTalk notifications with no way to act; a patient who cannot attend either calls the saturated reservation line or simply does not appear.",
        outcome: "No-shows converted into re-filled slots by offering the released time to the waiting list within the same conversation.",
        channels: ["KakaoTalk", "Voice", "SMS"],
        systems: ["Hospital information system", "Outpatient scheduling module", "Patient master index"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Referral intake from clinics and regional hospitals",
        friction: "Referring clinics fax or phone the referral desk, then call back to chase whether a slot was assigned; the referral coordinator re-keys the same details into the scheduling system.",
        outcome: "Referrals acknowledged and slotted the same day, with the referring clinic notified automatically instead of chasing.",
        channels: ["Voice", "Fax intake", "Web portal"],
        systems: ["Referral management system", "Outpatient scheduling module", "EMR"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Pre-visit preparation and document guidance",
        friction: "Fasting, contrast, medication-hold and document requirements are printed on a slip that patients lose, generating call-centre volume and cancelled procedures on the day.",
        outcome: "Procedure-specific preparation delivered and confirmed in the patient's channel, cutting day-of cancellations for imaging and endoscopy.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Scheduling module", "Procedure preparation content library", "EMR order set"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Phone reservation centre with campus-level routing",
        "Hospital mobile app and web reservation portal with certificate-based login",
        "KakaoTalk notification channel for appointment confirmations and results-ready alerts",
        "On-site kiosks for check-in and payment at each campus",
      ],
      gaps: [
        "No conversational path to reschedule a specialist appointment outside reservation-centre hours",
        "Released slots are not automatically offered to waiting patients",
        "Referring clinics have no self-service view of referral status",
        "Elderly patients who do not use the app have only the saturated phone line",
      ],
    },
    risks: [
      "PIPA and the Medical Service Act treat appointment and department data as sensitive health information, requiring explicit consent, purpose limitation and careful handling of any transcript retention.",
      "Any statement that could be read as clinical advice must be prevented by design; scope has to stay strictly administrative with hard routing to clinical staff.",
      "Academic-hospital governance runs through committee approval cycles, which lengthens the path from pilot agreement to production data access.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 2.6,
      automationRate: 0.5,
      basis: "Seller assumptions for a multi-campus Korean tertiary centre — outpatient contact volume, blended reservation-centre cost per contact and containable share must all be validated against the administration office's own reporting in discovery.",
    },
    pilotScope:
      "Automate outbound appointment reminders with in-conversation reschedule and waiting-list backfill for three high-no-show outpatient departments at the Sinchon campus, measured against a matched control set of departments.",
    expansion: [
      "Extend reminder and reschedule to all outpatient departments across Sinchon, Gangnam and Yongin campuses",
      "Add pre-visit preparation guidance for imaging, endoscopy and day-surgery order sets",
      "Open referral intake and status notification for referring clinics and regional hospitals",
    ],
    stakeholders: [
      "Director of Hospital Administration, Yonsei University Health System",
      "Head of Outpatient Services / Reservation Centre Manager",
      "Chief Information Officer, hospital information system",
      "Personal Information Protection Officer",
      "Head of Referral Centre (International and domestic referral coordination)",
    ],
    discovery: [
      "What is the measured no-show rate by department, and how does it differ between first visits and follow-ups?",
      "How many reservation-centre calls are abandoned during the morning booking peak, and what is the current staffed capacity?",
      "When a patient cancels, is the released slot offered to anyone, and by what mechanism?",
      "Which system of record holds the outpatient schedule, and what integration path exists for writing a reschedule back into it?",
    ],
    flowTemplate: "appointments",
    scenario:
      "A patient with a Thursday cardiology appointment at Sinchon Severance messages that she cannot attend; the agent finds the next slot with the same professor, rebooks her, and offers the released Thursday time to a waiting patient.",
  },

  "sk-broadband": {
    operatingContext:
      "SK Broadband is the SK group's fixed-line arm, supplying household broadband and the B tv IPTV service to millions of Korean homes, alongside enterprise leased lines and data-centre services. Its consumer service load is structurally different from SK Telecom's mobile servicing: it is dominated by field-visit scheduling for installation, relocation and repair, plus IPTV and set-top troubleshooting, bundle and speed changes, and the three-year contract lifecycle around renewals and termination penalties. Customers reach it by phone, through the SK Broadband and B tv apps, and through group channels shared with SK Telecom retail stores. Every field visit that is misbooked, missed or arrives without the right equipment is a truck roll paid for twice.",
    strategicPressure: [
      { text: "Korean fixed broadband is a saturated three-operator market where growth comes from bundle attachment and churn defence rather than new households.", kind: "verified" },
      { text: "IPTV subscriber growth has stalled across Korean operators as viewing shifts to global streaming services, putting the focus on cost per subscriber served.", kind: "inference" },
      { text: "Truck-roll cost in Korea carries high service-labour rates, so every avoided or correctly-prepared visit is a direct and measurable saving.", kind: "inference" },
      { text: "Sitting inside a group whose parent has its own AI programme, SK Broadband's fixed-line servicing risks being deprioritised in group platform roadmaps — creating room for a dedicated partner-led deployment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "SK Broadband operates real network and platform engineering for IPTV delivery, IDC and transport, but its customer-servicing stack is a conventional contact-centre estate with IVR and outsourced seats. Group-level AI investment sits with SK Telecom and SK's AI companies, whose priorities are mobile and platform businesses, not fixed-line truck-roll scheduling. That makes SK Broadband partner-led: technically credible enough to integrate deeply, but dependent on an outside platform for the conversational and evaluation layer.",
    whyNotBuild:
      "The engineering that matters to SK Broadband is network and video delivery. Building Korean speech recognition robust to household background noise, carrier telephony integration for millions of scheduling calls, orchestration into a workforce-management and dispatch system, and an evaluation harness that proves quality to a regulator-facing service organisation would be a multi-year detour from that. The commercial logic is stronger still: a bought platform lets them show a truck-roll saving in one quarter instead of staffing a build team.",
    workflows: [
      {
        name: "Installation and repair visit scheduling with pre-visit qualification",
        friction: "Slot booking happens by phone against engineer availability the agent cannot see cleanly, and the technician arrives to find the wrong equipment, no access, or a fault that could have been resolved remotely.",
        outcome: "Visits booked into genuinely available windows with pre-qualified fault detail, cutting failed and unnecessary truck rolls.",
        channels: ["Voice", "KakaoTalk", "App"],
        systems: ["Field workforce management", "Dispatch scheduling", "Subscriber management system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "IPTV and broadband fault triage before dispatch",
        friction: "A set-top or line fault goes straight into the dispatch queue because the IVR cannot run diagnostics, so remotely-fixable faults consume engineer capacity.",
        outcome: "Remote-resolvable faults closed in the conversation with guided reboot, line reset and provisioning refresh; only genuine faults dispatched.",
        channels: ["Voice", "KakaoTalk", "App"],
        systems: ["Network element management", "Set-top provisioning", "Trouble-ticket system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Contract renewal and bundle-change servicing",
        friction: "Customers approaching the end of a three-year term call to ask about penalties and options, get an inconsistent answer depending on the agent, and shop the competing operator instead.",
        outcome: "Consistent, policy-bounded renewal and bundle offers presented at the right moment in the contract lifecycle, with exceptions routed to retention specialists.",
        channels: ["Voice", "KakaoTalk"],
        systems: ["Subscriber management system", "Billing", "Offer and discount matrix"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer contact centre with IVR routing for broadband and IPTV lines",
        "SK Broadband and B tv mobile apps with account and payment functions",
        "KakaoTalk notification channel for visit confirmations and billing alerts",
        "Field dispatch and workforce-management system for installation and repair crews",
      ],
      gaps: [
        "Customers cannot reschedule an engineer visit end-to-end without reaching an agent",
        "No conversational diagnostic that can clear a set-top fault before a truck is dispatched",
        "Contract-end options are not proactively surfaced, so renewal conversations start with the competitor",
        "No unified context when a customer moves between the app, the phone line and an SK retail store",
      ],
    },
    risks: [
      "PIPA consent and retention rules apply to call recordings and transcripts; outbound scheduling contact must respect registered consent and permitted-hours rules.",
      "Telecommunications Business Act service-quality and complaint-handling obligations mean any automated servicing must be auditable and escalate cleanly to a human.",
      "Field-union and outsourced-partner arrangements around dispatch scheduling may constrain how far automation can alter engineer allocation.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 3.2,
      automationRate: 0.55,
      basis: "Seller assumptions for a Korean fixed-line operator of this subscriber scale — contact volume, blended cost per contact including outsourced seats, and containable share require validation against SK Broadband's own service reporting.",
    },
    pilotScope:
      "Deploy conversational visit scheduling and pre-dispatch fault triage for IPTV set-top faults in two metropolitan service regions, measured on failed-visit rate and dispatch avoidance against the remaining regions.",
    expansion: [
      "Extend triage and scheduling to broadband line faults and relocation orders nationwide",
      "Add contract-renewal and bundle-change servicing with a policy-bounded offer matrix",
      "Open proactive outage and restoration notification to affected apartment complexes and districts",
    ],
    stakeholders: [
      "Head of Customer Service Division, SK Broadband",
      "Head of Network Operations and Field Service",
      "Chief Information Officer / IT Planning lead",
      "Personal Information Protection Officer",
      "Head of Home Business marketing (bundle and retention owner)",
    ],
    discovery: [
      "What proportion of dispatched visits end without a fix, and what is the fully-loaded cost of a truck roll?",
      "Which service functions are shared with SK Telecom's servicing organisation and which are run independently by SK Broadband?",
      "What share of inbound calls are set-top or line faults that a guided remote diagnostic could clear?",
      "How are contract-end retention offers governed today, and who owns the approved discount matrix?",
    ],
    flowTemplate: "appointments",
    scenario:
      "A B tv customer whose set-top has frozen messages on KakaoTalk; the agent runs a remote provisioning refresh, restores the service without a visit, and cancels the engineer slot that was about to be booked.",
  },

  "lg-hellovision": {
    operatingContext:
      "LG HelloVision runs two businesses under one cost base: a regional cable television and broadband operator serving franchise areas across Korea, and one of the country's largest MVNO operations reselling network capacity as low-cost mobile service. The MVNO base is explicitly price-driven, with monthly plans priced far below the major operators, which means the economics of servicing that customer by phone are brutal — a single assisted call can consume a meaningful share of a month's revenue from that line. Its contact load is dominated by activation and SIM issues, number portability into and out of the service, plan changes, and billing disputes, plus the legacy cable side's set-top and channel-package queries. Customers arrive through a contact centre, a self-service web and app estate, and online sign-up funnels that hand off to phone whenever anything deviates from the happy path.",
    strategicPressure: [
      { text: "Korea's MVNO segment competes almost entirely on price, so operators carry very low ARPU per line and cannot fund human-heavy servicing.", kind: "verified" },
      { text: "The cable television side faces structural subscriber decline as households move to IPTV and streaming, shifting the growth burden onto the MVNO business.", kind: "verified" },
      { text: "Number portability makes acquisition and churn continuous rather than seasonal, so activation and porting conversations are the operational heartbeat of the business.", kind: "inference" },
      { text: "With LG Uplus as parent, there is a live question of whether group service platforms will absorb HelloVision's servicing or leave it to run its own economics — the answer determines deal shape.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "LG HelloVision is a regional cable and reseller business, not a platform company: its technology function operates billing, provisioning and cable headend systems rather than building customer-facing AI. Group AI capability sits with LG Uplus and LG's AI research organisation, and neither is likely to fund a bespoke servicing build for a low-ARPU MVNO subsidiary. This is a clean buy-led profile driven by unit economics rather than by ambition.",
    whyNotBuild:
      "The whole premise of an MVNO is not owning infrastructure. A company that deliberately declines to build a network will not build a speech stack, telephony platform, orchestration layer and evaluation harness to service lines that generate low single-digit monthly revenue. The right to win is arithmetic: bought per-minute automation is the only structure where the cost of servicing a cheap line stays below the revenue from it.",
    workflows: [
      {
        name: "Activation, SIM and number-portability servicing",
        friction: "Porting and activation stall on identity verification or carrier-side timing, and every stall converts into a call because the self-service funnel has no way to explain what is blocking.",
        outcome: "Activation and porting completed or unblocked in-conversation with identity verified once, cutting the highest-volume call driver at the point of acquisition.",
        channels: ["Voice", "KakaoTalk", "Web"],
        systems: ["MVNO provisioning platform", "Number-portability interface", "Identity verification service"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Plan change and billing-dispute resolution",
        friction: "A plan change or an unexpected data-overage charge is a rules question the IVR cannot answer, so it queues to a human whose handling cost exceeds the line's monthly revenue.",
        outcome: "Plan comparisons, changes and billing explanations completed conversationally with the change written back to billing, keeping cost per contact under ARPU.",
        channels: ["Voice", "KakaoTalk"],
        systems: ["Billing system", "Product and tariff catalogue", "Subscriber management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cable set-top and channel-package servicing",
        friction: "Legacy cable subscribers, skewing older, phone in for channel-package questions and set-top faults that route into the same queue as mobile activations with no specialised handling.",
        outcome: "Cable queries handled separately and remotely, with genuine faults dispatched pre-qualified and package changes executed in-conversation.",
        channels: ["Voice", "KakaoTalk"],
        systems: ["Cable subscriber management", "Set-top provisioning", "Field dispatch"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Contact centre serving both MVNO and cable lines with IVR front-end",
        "Online sign-up and self-service portal for mobile plan enrolment",
        "Mobile app for usage, billing and plan management",
        "KakaoTalk channel for billing and service notifications",
      ],
      gaps: [
        "A stalled number-port cannot be diagnosed or unblocked without an agent",
        "Data-overage and billing disputes have no explanatory self-service path",
        "Cable and mobile customers share one queue with no differentiated handling",
        "No proactive contact before a low-ARPU line lapses or ports out",
      ],
    },
    risks: [
      "PIPA governs the identity data captured during activation and porting; automated handling of resident-registration-linked verification requires careful scoping and consent design.",
      "Number-portability processes are regulated and time-bound, so any automation must fit the mandated carrier-to-carrier sequence rather than reinterpret it.",
      "Low ARPU caps the deal size — the commercial model must be usage-based and modest, or the business case inverts.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 2.8,
      automationRate: 0.6,
      basis: "Seller assumptions for a Korean MVNO plus regional cable operator at this subscriber scale; volume, cost per contact and containment must be validated against LG HelloVision's own contact-centre reporting before any business case is presented.",
    },
    pilotScope:
      "Automate activation and number-portability status servicing for the MVNO base across voice and KakaoTalk, measured on containment rate and cost per activation-related contact over a single quarter.",
    expansion: [
      "Add plan-change and billing-dispute handling with write-back to the billing system",
      "Extend to cable set-top triage and channel-package changes for the legacy base",
      "Introduce proactive pre-lapse and pre-port-out outreach against churn-risk signals",
    ],
    stakeholders: [
      "Head of MVNO (alttlepon) Business",
      "Head of Customer Service / Contact Centre Operations",
      "Chief Information Officer, LG HelloVision",
      "Personal Information Protection Officer",
      "Head of Cable Broadcasting Business (legacy subscriber base owner)",
    ],
    discovery: [
      "What is the blended cost per assisted contact, and how does it compare to average monthly revenue per MVNO line?",
      "What share of inbound volume is activation and porting versus billing versus cable service?",
      "Has LG Uplus mandated any group servicing platform that HelloVision must adopt?",
      "Which parts of the porting flow can be automated within the regulated carrier-to-carrier sequence?",
    ],
    flowTemplate: "billing-recharge",
    scenario:
      "A new MVNO customer whose number port has been pending for two days messages on KakaoTalk; the agent identifies the verification mismatch holding it, guides the correction, and confirms activation without a call to the centre.",
  },

  "hanjin-logistics": {
    operatingContext:
      "Hanjin is one of Korea's largest parcel carriers, operating the Hanjin Taekbae network of terminals, hubs and delivery agents that moves consumer and e-commerce parcels nationwide, alongside contract logistics and port and international freight operations. Its consumer-facing contact load is almost entirely exception-driven: failed delivery attempts, address and recipient corrections, delivery-window requests, damage and loss claims, and status chasing on parcels that have stalled at a terminal. That load arrives from two directions at once — recipients who did not choose the carrier and shippers whose own customer service escalates to Hanjin. Contact peaks brutally around Chuseok and Seollal, when parcel volume multiplies and every stalled shipment produces multiple contacts across channels.",
    strategicPressure: [
      { text: "Korean parcel delivery is a scale-driven, price-competitive market in which Hanjin competes against a substantially larger leader, keeping unit-cost discipline permanent.", kind: "verified" },
      { text: "Delivery-worker working-hour protections introduced after industry overwork controversies constrain how far peak capacity can be flexed with labour.", kind: "verified" },
      { text: "Holiday peaks multiply exception volume well beyond any staffed contact-centre capacity, so the peak is absorbed as queue time and abandoned calls.", kind: "inference" },
      { text: "Shipper clients increasingly judge carriers on the recipient experience, making exception communication a commercial retention issue and not just a cost line.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Hanjin's technology spend goes into terminal automation, sorting capacity, route optimisation and the tracking backbone — physical-network productivity, where the returns are visible per parcel. Customer communication is handled by a contact centre and a tracking web and app estate, with no evidence of an internal conversational AI programme. In a price-competitive parcel market with constrained margins, a multi-year servicing build is not a rational allocation, which places Hanjin firmly buy-led.",
    whyNotBuild:
      "Every won of Hanjin's engineering capacity has a higher-return home in the physical network. Building Korean speech and messaging automation, telephony at parcel-industry contact volumes, orchestration into a transport management and tracking system, and evaluation of tens of thousands of daily conversations would compete directly with sortation and route investment for the same budget — and lose. Bought automation converts the holiday peak from a staffing problem into a usage line.",
    workflows: [
      {
        name: "Delivery-exception resolution: failed attempts and address correction",
        friction: "A failed attempt triggers a slip and an SMS; the recipient then calls the centre or the local agent's mobile, and the correction is relayed verbally with no reliable write-back to the delivery record.",
        outcome: "Address and recipient corrections captured and written into the delivery record in-conversation, converting failed attempts into next-day successful deliveries instead of returns.",
        channels: ["KakaoTalk", "Voice", "SMS"],
        systems: ["Transport management system", "Parcel tracking", "Delivery agent dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Proactive delay and holiday-peak status notification",
        friction: "During Chuseok and Seollal, parcels stall at hubs and recipients call repeatedly for a status the tracking page cannot explain, saturating the centre exactly when volume peaks.",
        outcome: "Delay detected at the hub and pushed to affected recipients with a realistic window before they contact, suppressing the peak-season status-call spike.",
        channels: ["KakaoTalk", "SMS", "Voice"],
        systems: ["Hub scan and tracking events", "Transport management system", "Notification platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Damage and loss claim intake",
        friction: "Claims start on a phone call, require photographs and shipper details submitted separately, and then go quiet — so the claimant calls back weekly for status.",
        outcome: "Structured claim intake with photographs captured in-channel and automatic status updates at each assessment stage, removing repeat status calls.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Claims workflow system", "Tracking and scan history", "Shipper contract records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Parcel tracking on web and mobile app with scan-event history",
        "Consumer contact centre with IVR routing for tracking, claims and pickup",
        "SMS and KakaoTalk delivery notifications including failed-attempt slips",
        "Shipper-facing systems for booking, labelling and bulk consignment management",
      ],
      gaps: [
        "Recipients cannot change an address or delivery window end-to-end without reaching an agent or the delivery driver directly",
        "No proactive explanation when a parcel stalls at a hub during peak",
        "Claim status is not pushed, so claimants chase by phone",
        "Shipper escalations and recipient contacts are handled in separate places with no shared context on the same parcel",
      ],
    },
    risks: [
      "PIPA restricts how recipient contact details supplied by shippers may be used, so proactive outreach must be scoped to delivery purpose and consented channels.",
      "Delivery-worker protection rules limit how far automated scheduling can push work into evening and holiday windows.",
      "Exception resolution often depends on the local delivery agent's cooperation, so automation that bypasses the agent network can fail operationally even when technically correct.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for a Korean number-two parcel carrier at this daily volume; contact counts, blended cost per contact and containable share must be validated against Hanjin's own contact-centre and exception reporting.",
    },
    pilotScope:
      "Automate failed-attempt exception handling — address correction, redelivery window selection and pickup-point diversion — on KakaoTalk and voice for two metropolitan delivery regions across a single holiday peak.",
    expansion: [
      "Add proactive hub-delay notification nationwide with realistic revised delivery windows",
      "Extend to structured damage and loss claim intake with automatic status updates",
      "Open a shipper-facing escalation channel sharing the same parcel context as the recipient conversation",
    ],
    stakeholders: [
      "Head of Parcel (Taekbae) Business Division",
      "Head of Customer Service / Contact Centre Operations",
      "Chief Information Officer / IT Planning lead",
      "Head of Terminal and Delivery Network Operations",
      "Personal Information Protection Officer",
    ],
    discovery: [
      "What share of monthly contacts are failed-attempt and address corrections versus status chasing versus claims?",
      "How much does contact volume multiply during Chuseok and Seollal against a normal week?",
      "Can a delivery record be updated by an external system, or does correction have to route through the local agent?",
      "What proportion of exception contacts originate from shipper clients rather than recipients?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A recipient who missed a Hanjin delivery gets a KakaoTalk message before she calls; she corrects the apartment entry code and picks tomorrow evening, and the delivery record updates without a call to the centre.",
  },

  "lotte-global-logistics": {
    operatingContext:
      "Lotte Global Logistics is the Lotte group's parcel and contract-logistics arm, carrying group retail and e-commerce volume from Lotte Shopping, Lotte Mart and Lotte On alongside a substantial third-party parcel book, plus warehousing, port and international freight operations. Its consumer contact profile mirrors the rest of the Korean parcel industry — status chasing, redelivery scheduling, address corrections and damage claims — but with a distinctive twist: a large share of contacts arrive through group retail customer service first, so the same delivery problem is often handled twice, once by the retailer and once by the carrier. Recipients reach it through a tracking site and app, SMS and KakaoTalk delivery notifications, and a contact centre that peaks with retail promotion cycles as much as with holidays.",
    strategicPressure: [
      { text: "Korean parcel logistics is consolidating around scale leaders, and market reporting has repeatedly discussed strategic options for Lotte's logistics arm — which raises the internal bar on demonstrated operating efficiency.", kind: "inference" },
      { text: "Group retail volume ties parcel service quality directly to Lotte's own e-commerce customer experience, so delivery exceptions become a group brand issue rather than a carrier issue.", kind: "verified" },
      { text: "Handling the same delivery exception twice — once at the retailer, once at the carrier — is a duplicated cost that neither side currently measures end-to-end.", kind: "inference" },
      { text: "Consolidation uncertainty makes long internal technology programmes unattractive and short-payback bought capability attractive.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Lotte Global Logistics is an operations company whose technology investment goes into warehouse automation, sortation and transport management. Group IT capability sits in Lotte's shared services and data organisations, oriented to retail and commerce platforms rather than to carrier customer service. Procurement-driven purchase of operational technology is the established pattern here, and strategic uncertainty reinforces a preference for fast-deploying bought capability over multi-year builds.",
    whyNotBuild:
      "A logistics subsidiary under efficiency scrutiny will not fund speech recognition, telephony, orchestration and conversation evaluation as internal projects — the payback horizon is wrong and the skills are not in the building. The right to win is time-to-proof: a bought deployment can show a measured reduction in status-chasing contacts within a quarter, which is exactly the kind of evidence an organisation facing structural questions needs to produce.",
    workflows: [
      {
        name: "Parcel-status and redelivery self-service",
        friction: "The tracking page shows a scan event without an explanation or a delivery window, so recipients call to ask when it will actually arrive and to arrange a different time.",
        outcome: "Status explained in plain language with a redelivery window or pickup-point diversion selected in-conversation, removing the dominant call driver.",
        channels: ["KakaoTalk", "Voice", "SMS"],
        systems: ["Transport management system", "Parcel tracking", "Pickup-point network"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Group-retail order and delivery exception joining",
        friction: "A customer who ordered on a Lotte retail channel contacts the retailer, who then contacts the carrier, so the same exception is worked twice with context lost between them.",
        outcome: "A single conversation resolving the delivery exception with both order and consignment context, eliminating the duplicated retailer-to-carrier handoff.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Order management (group retail)", "Transport management system", "Customer service ticketing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Damage and loss claim intake with proactive status",
        friction: "Claims are opened by phone with documents chased over email, then go silent until settlement, producing repeated status calls from both recipient and shipper.",
        outcome: "Structured intake with photographs in-channel and automatic stage notifications, cutting claim-related repeat contacts.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Claims workflow", "Scan and tracking history", "Shipper contract records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Parcel tracking website and mobile app with scan-event history",
        "Contact centre handling recipient and shipper enquiries",
        "SMS and KakaoTalk delivery and failed-attempt notifications",
        "Shipper and group-retail integration for consignment booking and label generation",
      ],
      gaps: [
        "Recipients cannot reschedule a delivery window end-to-end in a conversation",
        "Order context from group retail channels is not available to the carrier's service conversation",
        "No proactive notice when a parcel stalls at a hub or misses its promised day",
        "Claim status is not pushed to claimants, generating repeat contacts",
      ],
    },
    risks: [
      "PIPA limits use of recipient contact data received from shippers, so proactive messaging must stay within delivery purpose and consented channels.",
      "Any consolidation or ownership change could freeze platform decisions mid-cycle, so the pilot must be scoped to stand alone commercially.",
      "Joining group-retail order data to carrier consignment data crosses legal entities and requires a data-sharing basis agreed in advance.",
    ],
    economics: {
      volumeMonthly: 550000,
      costPerInteraction: 2.4,
      automationRate: 0.58,
      basis: "Seller assumptions for a Korean parcel and contract-logistics operator of this scale; volumes, blended cost per contact and containable share must be validated with the contact-centre owner before any business case is used externally.",
    },
    pilotScope:
      "Automate parcel-status explanation and redelivery scheduling across KakaoTalk and voice for third-party parcel volume in the Seoul metropolitan region, measured on containment and repeat-contact rate.",
    expansion: [
      "Join group-retail order context so a single conversation resolves both the order and the delivery exception",
      "Add proactive hub-delay and missed-promise notification nationwide",
      "Extend to structured damage and loss claim intake with automatic status updates",
    ],
    stakeholders: [
      "Head of Parcel Business Division, Lotte Global Logistics",
      "Head of Customer Service / Contact Centre Operations",
      "Chief Information Officer / IT Planning",
      "Group retail e-commerce service operations lead (Lotte Shopping / Lotte On)",
      "Personal Information Protection Officer",
    ],
    discovery: [
      "What proportion of parcel volume originates from Lotte group retail versus third-party shippers, and how does the contact profile differ?",
      "When a group-retail customer reports a delivery problem, how many separate teams touch it before resolution?",
      "What is the blended cost per assisted contact, and how does it move during promotion peaks?",
      "Do any pending strategic or ownership decisions gate new platform commitments this year?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A customer whose Lotte On order stalled at a hub receives a proactive KakaoTalk message with a revised window and a one-tap option to divert the parcel to a nearby pickup point.",
  },

  "megastudy": {
    operatingContext:
      "Megastudy Education is Korea's best-known suneung preparation business, selling online lecture packages from star instructors, running offline academies and boarding-style intensive programmes, and publishing its own workbooks and mock examinations. Its revenue is intensely seasonal and deadline-driven: enrolment surges around the academic year start, mock-exam cycles, and the period immediately after suneung results when repeat candidates decide whether to retake. Parents and students reach it through course websites, a mobile learning app, telephone consultation lines and academy front desks, and the questions are consequential rather than casual — which instructor, which package, what the refund terms are if a student switches, whether a boarding place is available. In Korea's education market, parents typically call rather than self-serve because the decision affects university entrance.",
    strategicPressure: [
      { text: "Korea's shrinking school-age cohort structurally reduces the addressable student base for examination preparation over time.", kind: "verified" },
      { text: "Government scrutiny of private-education costs and marketing claims has intensified, raising the compliance bar on what consultation staff may promise.", kind: "verified" },
      { text: "Enrolment demand concentrates into a handful of weeks each year, so consultation capacity is either idle or catastrophically short, never right-sized.", kind: "inference" },
      { text: "Speed of first response is likely a direct determinant of enrolment conversion when a parent is comparing two or three providers on the same evening.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Megastudy's product organisation builds learning content, video delivery and study-management features; its consultation and enrolment operations run on conventional call and counter staffing. There is no evidence of a platform-engineering culture that would treat conversational infrastructure as a product, and the seasonal cost curve makes a usage-priced bought service structurally better than a fixed internal build. Buy-led.",
    whyNotBuild:
      "The asset Megastudy protects is instructor brand and content, not infrastructure. Building Korean speech handling for anxious parents, telephony sized for a three-week annual peak, orchestration into an enrolment and payment system, and evaluation of consultation quality would mean carrying year-round engineering cost for a workload that exists in bursts. Bought capacity that scales to the peak and costs almost nothing off-peak is the only shape that matches this business.",
    workflows: [
      {
        name: "Enrolment-season inquiry surge handling",
        friction: "During enrolment weeks the consultation lines saturate, evening calls from working parents go unanswered, and prospective students enrol with whichever provider answered first.",
        outcome: "Every inquiry answered within minutes in the evening and weekend windows when parents actually call, with qualified prospects booked onto a human counsellor's calendar.",
        channels: ["KakaoTalk", "Voice", "Web"],
        systems: ["Course catalogue and pricing", "Enrolment system", "Counsellor scheduling"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Course-change, refund and package-switch servicing",
        friction: "Refund and switch rules vary by package and by how much of a lecture series has been consumed; students call to ask and get answers that differ between staff, creating disputes.",
        outcome: "Consistent, policy-grounded answers on refund entitlement and package switching, with the change executed and confirmed in writing.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Enrolment and billing system", "Lecture consumption tracking", "Refund policy rules"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Post-result retake counselling outreach",
        friction: "The window after suneung results when repeat candidates decide is short and enormous, and outbound counselling reaches only a fraction of the base within it.",
        outcome: "Consent-based outreach to every eligible student in the decision window, with genuinely interested candidates handed to counsellors ranked by intent.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Student CRM", "Course catalogue", "Counsellor scheduling"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Course websites and a mobile lecture app with enrolment and payment",
        "Telephone consultation lines segmented by division and course type",
        "KakaoTalk official channel for course notices and enrolment alerts",
        "Academy and boarding-campus front desks handling in-person enrolment",
      ],
      gaps: [
        "No answer to an evening or weekend inquiry until the next working day during peak season",
        "Refund and package-switch entitlement cannot be checked without an agent",
        "Outbound retake counselling reaches only a fraction of eligible students in the decision window",
        "No single view when a family moves between website, phone line and academy desk",
      ],
    },
    risks: [
      "PIPA applies with additional care because a large share of contacts concern minors, requiring guardian consent handling for both data and outbound contact.",
      "Private-education advertising rules constrain claims about results and admissions outcomes, so grounded answers must be restricted to published, approved content.",
      "Extreme seasonality means the commercial model must be usage-priced; a fixed annual platform fee will not survive the off-peak months.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 3.0,
      automationRate: 0.5,
      basis: "Seller assumptions for a Korean examination-preparation provider with sharply seasonal enrolment; peak-versus-trough volumes and consultation cost per contact must be validated with the enrolment operations owner.",
    },
    pilotScope:
      "Run a single enrolment-season deployment on KakaoTalk and voice answering course, instructor, schedule and fee inquiries with counsellor booking, measured on first-response time and booked-consultation conversion against the prior season.",
    expansion: [
      "Add refund, course-change and package-switch execution with billing write-back",
      "Extend to outbound retake counselling in the post-result decision window",
      "Cover academy and boarding-programme enquiries alongside the online lecture business",
    ],
    stakeholders: [
      "Head of Enrolment / Consultation Operations",
      "Chief Marketing Officer or head of student acquisition",
      "Chief Information Officer / IT lead",
      "Personal Information Protection Officer",
      "Head of Academy Division (offline campus operations)",
    ],
    discovery: [
      "How many inquiries arrive per week at enrolment peak versus off-peak, and how many currently go unanswered?",
      "What is the measured conversion difference between an inquiry answered within an hour and one answered the next day?",
      "Which content sources are approved for quoting fees, schedules and instructor information to parents?",
      "How is guardian consent captured today for contacting students who are minors?",
    ],
    flowTemplate: "admissions",
    scenario:
      "A parent messages Megastudy at 10pm asking whether her son can switch to a different instructor's package mid-term; the agent explains the refund position, confirms the switch, and books a counsellor call for the following evening.",
  },

  "daekyo": {
    operatingContext:
      "Daekyo runs the Noonnoppi worksheet-learning programme in Korea and the Eye Level brand internationally, a model built on thousands of visiting teachers who come to member households on a weekly schedule with graded worksheet sets, supplemented by learning centres and digital learning products. Its communications load is generated by the operating model itself: visit rescheduling when a child is ill or a family travels, teacher reassignment when a teacher leaves a route, monthly membership billing and payment failures, subject additions and pauses, and cancellation conversations. Households interact through the assigned teacher, a member call centre, a parent app and KakaoTalk notifications, which means service quality is inconsistent because much of it is mediated by an individual teacher's responsiveness. Korea's falling birth rate is shrinking the pool of member households year over year.",
    strategicPressure: [
      { text: "Korea's birth rate is among the lowest in the world, structurally contracting the member base for household-visit children's education over time.", kind: "verified" },
      { text: "Home-visit learning competes directly with tablet-based and online learning products that require no scheduling at all, pressuring both price and retention.", kind: "verified" },
      { text: "Because much service contact is mediated by the visiting teacher, the company has limited visibility of dissatisfaction until a membership is cancelled.", kind: "inference" },
      { text: "Retention outreach and service-cost reduction are the same programme for this business: the households most expensive to serve are often the ones closest to cancelling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Daekyo is a curriculum and field-operations company: its investment goes into learning content, teacher training and route management, with technology procured to support those. There is no internal platform-engineering function that would attempt speech, telephony and orchestration, and a business in structural demographic decline will not open one. Buy-led, with the caveat that budget appetite is constrained and the deal must be sized accordingly.",
    whyNotBuild:
      "This is a company whose scarce management attention is on membership retention and field-teacher supply. Building conversational infrastructure would consume both budget and attention that the core business needs, for a capability available as a service. The right to win is that bought automation both reduces service cost and surfaces early cancellation signals that the teacher-mediated model currently hides — one purchase serving the two things management actually cares about.",
    workflows: [
      {
        name: "Visit rescheduling and teacher-reassignment coordination",
        friction: "Reschedules are arranged informally by text with the individual teacher, so the company's schedule of record drifts and missed visits surface only in monthly reconciliation.",
        outcome: "Reschedules captured centrally against the real route schedule, keeping the system of record accurate and reducing missed and disputed visits.",
        channels: ["KakaoTalk", "Voice", "App"],
        systems: ["Member management system", "Teacher route scheduling", "Visit record"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Membership billing and payment-failure recovery",
        friction: "A failed automatic payment produces a notice and then silence; the member call centre chases by phone in office hours, when parents cannot answer.",
        outcome: "Payment failures resolved in-channel with a payment link, cutting involuntary lapses that are currently indistinguishable from real churn.",
        channels: ["KakaoTalk", "Voice", "SMS"],
        systems: ["Billing and direct-debit system", "Member management system", "Payment gateway"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Cancellation-risk outreach and save conversation",
        friction: "The first the company hears of dissatisfaction is a cancellation request, at which point the conversation is a retention argument rather than a service fix.",
        outcome: "Early risk signals — missed visits, payment failures, reduced worksheet completion — trigger a real two-way conversation while the membership is still savable.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Member management system", "Visit and completion records", "Retention offer rules"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Member call centre for billing, scheduling and membership changes",
        "Parent-facing mobile app with learning progress and schedule information",
        "KakaoTalk notification channel for visit and billing alerts",
        "Field teacher management and route scheduling systems",
      ],
      gaps: [
        "Reschedules agreed informally with a teacher never reach the system of record",
        "Payment failures are not recovered conversationally, so voluntary and involuntary churn are conflated",
        "No early warning before a household decides to cancel",
        "Parents cannot pause, add or change a subject without reaching a person in office hours",
      ],
    },
    risks: [
      "PIPA compliance is heightened because the learners are children; guardian consent and minimisation of any learning-performance data in conversation are mandatory.",
      "The visiting-teacher relationship is the product; automation that appears to displace the teacher's role can damage retention rather than improve it.",
      "A business under demographic and margin pressure has limited budget, so the entry deal must be small and payback must be demonstrable within a quarter.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 2.8,
      automationRate: 0.5,
      basis: "Seller assumptions for a Korean home-visit learning provider at this membership scale; member-contact volume, call-centre cost per contact and containment must be validated against Daekyo's own service reporting.",
    },
    pilotScope:
      "Automate membership billing and payment-failure recovery on KakaoTalk and voice for one regional member base, measured on involuntary-lapse rate and recovered payments against a control region.",
    expansion: [
      "Add central visit rescheduling that keeps the teacher route schedule accurate",
      "Introduce cancellation-risk outreach driven by missed-visit and completion signals",
      "Extend to learning-centre and digital-product membership servicing",
    ],
    stakeholders: [
      "Head of Domestic Membership Business (Noonnoppi)",
      "Head of Member Service / Call Centre Operations",
      "Head of Field Organisation and Teacher Management",
      "Chief Information Officer / IT lead",
      "Personal Information Protection Officer",
    ],
    discovery: [
      "What share of monthly cancellations are involuntary — driven by payment failure rather than a decision to leave?",
      "How are visit reschedules recorded today, and how often does the system of record disagree with what actually happened?",
      "Which signals in the member data most reliably precede a cancellation?",
      "What is the guardian-consent basis for contacting households about a child's learning schedule?",
    ],
    flowTemplate: "retention",
    scenario:
      "A Noonnoppi household's monthly payment fails; the agent messages the parent on KakaoTalk that evening, resolves the card issue with a payment link, and the membership never enters the lapse queue.",
  },

  "woongjin-thinkbig": {
    operatingContext:
      "Woongjin ThinkBig sells subscription home-learning to Korean families, combining printed learning materials, visiting teacher services and tablet-based smart-learning products delivered on company-supplied devices. Its economics are subscription economics: monthly recurring billing across a large membership base, with contract terms, device leases and multi-year commitments layered on top. That produces a distinctive contact mix — billing and contract-term questions, learning-device technical support when a tablet will not sync or a licence lapses, schedule coordination with visiting teachers, and cancellation and mid-term change requests that carry penalty calculations. Parents reach it through a member centre phone line, a parent app, KakaoTalk notifications and the visiting teacher, and the company's own AI investment has gone into the learning product rather than into how it talks to those parents.",
    strategicPressure: [
      { text: "Korea's declining child population contracts the subscription base for home-learning products year over year, making retention the primary growth lever.", kind: "verified" },
      { text: "Device-based smart-learning products create a technical-support obligation that a traditional education company was never staffed to carry.", kind: "inference" },
      { text: "Subscription churn in a contract-and-device model is expensive twice over: lost recurring revenue plus device recovery and refurbishment cost.", kind: "inference" },
      { text: "The internal AI narrative sits with the learning product, which may cause service automation to be assumed as covered when in fact it is untouched — a live qualification risk.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Woongjin ThinkBig's technology organisation builds the learning platform and adaptive content on the tablet, which is where its differentiation and its AI messaging live. Member servicing runs on a conventional call-centre estate. Because the two live in different parts of the company with different budgets, service automation is a procured operational purchase rather than a product build — buy-led, provided the pitch is framed to the service organisation and not to the product AI team.",
    whyNotBuild:
      "The product team's AI capability is in adaptive learning, not in Korean speech recognition, telephony, subscription-billing orchestration or conversation evaluation. Redirecting that team to build member servicing would slow the learning roadmap that the company's competitive position depends on. Buying is faster, cheaper and does not put the product roadmap at risk — and the service organisation controls its own budget line to make the decision.",
    workflows: [
      {
        name: "Subscription billing and contract-term servicing",
        friction: "Questions about remaining contract term, mid-term change penalties and device lease charges require an agent to compute from multiple records, and answers vary between agents.",
        outcome: "Accurate, consistent contract and billing answers with changes executed in-conversation, cutting billing disputes and repeat contacts.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Subscription billing", "Contract and device-lease records", "Member management system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Learning-device technical support",
        friction: "A tablet that will not sync, a lapsed content licence or a forgotten login sends a parent to a phone queue for a problem that is scriptable and diagnosable remotely.",
        outcome: "Device and licence issues resolved conversationally with guided steps and licence re-provisioning, keeping children learning instead of waiting.",
        channels: ["KakaoTalk", "Voice", "App"],
        systems: ["Device management platform", "Content licence service", "Member account system"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Churn-risk outreach on usage decline",
        friction: "Falling tablet usage is visible in the learning platform but is not connected to any service intervention, so decline is discovered when the cancellation call arrives.",
        outcome: "Usage-decline signals trigger a real conversation about what changed, with support or plan adjustment offered before cancellation.",
        channels: ["KakaoTalk", "Voice"],
        systems: ["Learning platform usage data", "Member management system", "Retention offer rules"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Member centre telephone support for billing, contracts and cancellations",
        "Parent mobile app showing learning progress and schedule",
        "Tablet-based smart-learning platform with its own account and licence system",
        "KakaoTalk notification channel for billing and learning alerts",
      ],
      gaps: [
        "Parents cannot see or change contract terms and penalties without an agent",
        "Device and licence faults have no guided self-service path",
        "Learning-usage decline is not connected to any retention action",
        "Visiting-teacher scheduling and platform servicing sit in separate service silos",
      ],
    },
    risks: [
      "PIPA and children's-data sensitivity mean learning-performance data must be tightly scoped out of service conversations except where strictly necessary and consented.",
      "Contract-cancellation and penalty terms are consumer-protection sensitive; automated statements about penalties must be provably grounded in the actual contract record.",
      "Internal ownership ambiguity between the product AI team and the service organisation can stall a deal — the buyer must be established early.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 2.8,
      automationRate: 0.5,
      basis: "Seller assumptions for a Korean subscription home-learning provider at this membership scale; contact volume, member-centre cost per contact and containable share require validation with the service organisation.",
    },
    pilotScope:
      "Automate subscription billing and contract-term enquiries plus learning-device technical support on KakaoTalk and voice for the smart-learning member base, measured on containment and repeat-contact rate over one quarter.",
    expansion: [
      "Add mid-term plan change and subject addition with billing write-back",
      "Introduce churn-risk outreach driven by tablet usage-decline signals",
      "Extend to visiting-teacher schedule coordination across the combined membership",
    ],
    stakeholders: [
      "Head of Member Service / Customer Centre",
      "Head of Smart Learning Product (device and platform owner)",
      "Chief Information Officer / IT lead",
      "Head of Subscription Business and Retention",
      "Personal Information Protection Officer",
    ],
    discovery: [
      "What share of member-centre contacts are billing and contract questions versus device and licence support?",
      "Does the learning platform's usage data currently trigger any retention action, and who owns that decision?",
      "Is service automation inside the product AI team's roadmap, or is it clearly the service organisation's to buy?",
      "How are contract penalties calculated today, and can that logic be exposed to an external system?",
    ],
    flowTemplate: "retention",
    scenario:
      "A parent messages that her daughter's learning tablet stopped syncing; the agent re-provisions the content licence in the conversation and the evening's lesson goes ahead without a call to the member centre.",
  },

  "visang": {
    operatingContext:
      "Visang Education publishes school textbooks and reference materials for the Korean curriculum and operates digital learning services including English-learning and smart-classroom products sold to schools and to consumers. That gives it two very different communication loads on one organisation. The B2B side is sharply seasonal: during textbook-adoption and ordering periods, teachers and school administrators across the country contact Visang about specimen copies, adoption paperwork, delivery of class sets, supplementary teaching materials and digital licence activation for classroom platforms. The B2C side is a smaller but continuous subscription and learning-service load. Schools reach Visang through sales representatives, a customer centre and web ordering, and when adoption season compresses months of decisions into weeks, the representative and the phone line become the bottleneck.",
    strategicPressure: [
      { text: "Korea's digital-textbook and smart-classroom policy direction has repeatedly shifted, forcing publishers to service schools through periods of changing platform requirements.", kind: "verified" },
      { text: "A shrinking student population reduces class-set volumes over time, pushing publishers toward digital services with different servicing demands.", kind: "verified" },
      { text: "Adoption-season contact volume is concentrated into weeks, so sales representatives spend that window answering routine logistics questions instead of selling.", kind: "inference" },
      { text: "Digital licence activation for classroom platforms likely produces a support load that a textbook publisher's service organisation was never designed to carry.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Visang builds educational content and learning applications; its engineering is oriented to classroom platform features and content delivery, not to communications infrastructure. School-facing service runs through field sales representatives and a customer centre, which is an operational cost line owned outside the product organisation. That combination — no communications-platform capability, seasonal load, operational budget owner — makes this buy-led.",
    whyNotBuild:
      "A publisher's advantage is curriculum authority and teacher relationships. Building speech, telephony, orchestration into an ordering and licence system, and evaluation tooling would divert its modest engineering capacity from the classroom platform that determines whether schools adopt at all. The payoff of buying is specific: it frees field representatives during the only weeks of the year when their selling time is worth anything.",
    workflows: [
      {
        name: "Adoption-season teacher and school inquiry handling",
        friction: "Teachers phone or message their representative for specimen copies, adoption paperwork and delivery timing; representatives answer logistics questions during the exact weeks they should be selling.",
        outcome: "Routine adoption logistics handled automatically in the teacher's channel, returning representative time to adoption conversations that actually influence decisions.",
        channels: ["KakaoTalk", "Voice", "Web"],
        systems: ["Order management", "Title and specimen catalogue", "School and teacher CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Class-set delivery and order-status servicing",
        friction: "Schools chase delivery of class sets by calling the customer centre, which checks a separate distribution system and calls back, all under a fixed term-start deadline.",
        outcome: "Live order and delivery status answered on first contact, with shortfalls and substitutions flagged before the term starts.",
        channels: ["Voice", "KakaoTalk", "Email"],
        systems: ["Order management", "Distribution and logistics system", "School account records"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Digital licence activation and classroom-platform support",
        friction: "A teacher whose classroom licences will not activate on the first day of term has an urgent problem with no fast path other than the phone line.",
        outcome: "Licence provisioning and access issues resolved in-conversation, protecting the first-week experience that determines platform renewal.",
        channels: ["KakaoTalk", "Voice", "Web"],
        systems: ["Licence management platform", "School account records", "Learning platform authentication"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Customer centre serving school and consumer enquiries",
        "Web ordering and specimen-request portal for schools and teachers",
        "Field sales representatives covering school territories",
        "Digital learning platforms with school licence administration",
      ],
      gaps: [
        "Teachers have no self-service route to order and delivery status during adoption season",
        "Licence activation problems require a phone call at exactly the moment a class is waiting",
        "Sales representatives absorb routine logistics questions that could be automated",
        "No shared context between the representative, the customer centre and the ordering system",
      ],
    },
    risks: [
      "School procurement and textbook-adoption processes are regulated and audited; any automated statement about adoption entitlement or pricing must be grounded in approved published terms.",
      "PIPA applies to teacher and school-administrator contact data, and outbound adoption-season messaging must rest on a valid consent or contractual basis.",
      "Extreme seasonality means an always-on fixed-cost platform is a poor commercial fit; the model must be usage-priced.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 3.0,
      automationRate: 0.45,
      basis: "Seller assumptions for a Korean textbook and edtech publisher with a sharply seasonal B2B contact load; peak-versus-trough volumes and customer-centre cost per contact must be validated in discovery.",
    },
    pilotScope:
      "Deploy adoption-season inquiry handling for one subject division on KakaoTalk and voice, covering specimen requests, adoption paperwork and delivery status, measured on representative time returned and first-contact resolution.",
    expansion: [
      "Extend to all subject divisions and to class-set delivery exception handling nationwide",
      "Add digital licence activation and classroom-platform access support",
      "Cover the B2C subscription learning services with the same deployment",
    ],
    stakeholders: [
      "Head of School Business (textbook adoption and distribution)",
      "Head of Customer Centre / Service Operations",
      "Head of Digital Learning Platform",
      "Chief Information Officer / IT lead",
      "Personal Information Protection Officer",
    ],
    discovery: [
      "How much does contact volume rise during adoption season compared with a normal month?",
      "How much of a sales representative's time during adoption weeks goes to logistics rather than selling?",
      "What proportion of contacts are digital licence and platform-access issues versus physical order matters?",
      "Which published sources are approved for quoting adoption terms and pricing to schools?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A middle-school teacher messages on the first morning of term that her class licences will not activate; the agent re-provisions the school's seats and the lesson starts on time.",
  },

  "zigbang": {
    operatingContext:
      "Zigbang is one of Korea's leading property platforms, matching renters and buyers with listings for officetels, villas, apartments and one-room units, monetised through agent subscriptions and advertising, and extended into proptech services including smart door locks and home-management technology. Its operational communications run in two directions: consumer-side inquiries about listings, viewing arrangements and reports of suspicious or misrepresented postings, and agent-side onboarding, listing verification, subscription billing and policy-enforcement conversations. After Korea's jeonse deposit-fraud scandals, listing authenticity became a trust-critical function rather than a moderation chore, and the speed with which a suspicious posting is investigated and removed is now a reputational variable. Users reach Zigbang through its app and web platform, an in-app enquiry flow and a customer centre, while agents are served through a separate agent-facing console and support line.",
    strategicPressure: [
      { text: "Korea's jeonse deposit-fraud crisis made verification of property listings and landlords a public-trust issue for every property platform.", kind: "verified" },
      { text: "A depressed transaction market in Korean residential property compresses agent subscription revenue, tightening the platform's own cost discipline.", kind: "inference" },
      { text: "Fraud-report handling is time-critical: a fraudulent listing left live for a day is a potential victim, which makes response latency an operational risk rather than a service metric.", kind: "inference" },
      { text: "As a technology company, Zigbang may prefer to own any customer-facing conversational layer itself, which caps this to a co-build and warrants early qualification of engineering appetite.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Zigbang is genuinely a product-engineering company: it builds its consumer app, matching and search experience, and proptech hardware software in-house, and it has the talent to attempt a conversational layer. What it does not have is spare roadmap capacity for internal service operations tooling, which is peripheral to the product bets that determine its market position. That is the definition of co-build — sell infrastructure, speech and orchestration capability and expect Zigbang to own the experience layer — and it should be deprioritised if engineering appetite to build turns out to be high.",
    whyNotBuild:
      "The realistic argument here is opportunity cost rather than capability. Zigbang's engineers can build a chat interface; they cannot cheaply build Korean speech, carrier telephony, and a conversation-evaluation harness while also shipping the listing-verification and matching features the business is judged on. The right to win is supplying the parts that are pure infrastructure and letting Zigbang keep the parts that touch its brand — but this must be qualified honestly before investing sales effort.",
    workflows: [
      {
        name: "Fraud and misrepresentation report intake",
        friction: "Suspicious-listing reports arrive through a generic enquiry form and queue for human review, so the time between a report and a takedown decision is measured in hours or days.",
        outcome: "Structured, evidence-complete reports triaged immediately with clear-cut cases escalated for takedown within minutes rather than days.",
        channels: ["App", "KakaoTalk", "Voice"],
        systems: ["Listing database", "Trust and safety case management", "Agent account records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Agent onboarding and listing-verification document collection",
        friction: "Agent registration and listing verification require licence and ownership documents submitted piecemeal, with rejections communicated late and re-submissions chased manually.",
        outcome: "Documents validated in-flow with rejection reasons explained immediately, shortening the time from agent signup to verified live listings.",
        channels: ["App", "KakaoTalk", "Voice"],
        systems: ["Agent onboarding system", "Document verification service", "Listing management"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Consumer listing and viewing enquiry handling",
        friction: "Consumer questions about whether a listing is still available or genuinely priced as advertised go to the agent, who may not respond, and the platform never learns that the listing was stale.",
        outcome: "Availability and accuracy questions answered or escalated with the outcome fed back into listing-quality scoring, improving both experience and data.",
        channels: ["App", "KakaoTalk"],
        systems: ["Listing database", "Agent messaging", "Listing-quality scoring"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Consumer mobile app and web platform with in-app listing enquiry",
        "Agent-facing console for listing management and subscription administration",
        "Customer centre handling consumer and agent support",
        "Listing verification and trust-and-safety review processes",
      ],
      gaps: [
        "Fraud reports cannot be triaged and acted on outside review-team working hours",
        "Agents get no immediate explanation when a verification document is rejected",
        "Consumers cannot confirm listing availability without depending on an individual agent's response",
        "Report outcomes are not systematically fed back into listing-quality signals",
      ],
    },
    risks: [
      "PIPA governs the personal data in fraud reports and agent verification documents, including licence and identity information requiring strict handling and retention limits.",
      "Real-estate brokerage regulation constrains what a platform may state about a listing's legal status; automated responses must not stray into brokerage advice.",
      "High internal engineering confidence may mean the platform prefers to build the conversational layer itself, making this a qualification-first opportunity.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 2.5,
      automationRate: 0.5,
      basis: "Seller assumptions for a Korean property platform of this user and agent scale; consumer and agent contact volumes, support cost per contact and containable share must be validated before any business case is used.",
    },
    pilotScope:
      "Automate structured fraud and misrepresentation report intake with immediate triage and evidence collection, measured on time-from-report-to-decision against the current human-review queue.",
    expansion: [
      "Add agent onboarding and listing-verification document collection with in-flow validation",
      "Extend to consumer listing-availability and viewing enquiries with quality-signal feedback",
      "Cover proptech product support for smart-lock and home-management customers",
    ],
    stakeholders: [
      "Head of Trust and Safety / Listing Verification",
      "Head of Agent Business (subscription and onboarding owner)",
      "Chief Technology Officer",
      "Head of Customer Experience Operations",
      "Personal Information Protection Officer",
    ],
    discovery: [
      "What is the current median time from a fraud report being filed to a takedown decision?",
      "How many agent verification submissions are rejected, and how long does re-submission take?",
      "Does the engineering organisation intend to build conversational service tooling itself, and on what timeline?",
      "Which parts of the trust-and-safety decision must remain human under current policy?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A renter reports a suspicious jeonse listing at midnight; the agent collects the evidence in a structured intake, flags the matching pattern, and the listing is suspended before the morning review shift begins.",
  },

  "first-commercial-bank-tw": {
    operatingContext:
      "First Commercial Bank is the banking core of First Financial Holding, one of Taiwan's government-linked financial groups, running close to two hundred domestic branches plus overseas outlets serving Taiwanese businesses abroad. Its retail franchise rests on deposits, mortgages, credit cards and wealth products sold across that branch network, while its corporate franchise is weighted toward the small and mid-sized manufacturers that form Taiwan's export base. Customers reach it through branch counters, a phone service centre, internet and mobile banking, and increasingly a LINE official account for notifications, but the older half of its depositor base still treats the branch and the phone line as the real bank. Because it sits inside a financial holding, the same customer is also a target for insurance and securities cross-sell, and service conversations are one of the few moments where that relationship is visible.",
    strategicPressure: [
      { text: "Taiwan's Financial Supervisory Commission has actively pushed digital-service development and fair-treatment-of-customers principles across domestic banks, raising expectations on service channel quality.", kind: "verified" },
      { text: "Government-linked banks in Taiwan carry public-service expectations that make reducing branch access politically difficult, so digital channels must absorb growth rather than replace branches.", kind: "verified" },
      { text: "A depositor base skewing older keeps a substantial share of servicing on the phone in Taiwanese Hokkien, which a Mandarin-only IVR handles poorly.", kind: "inference" },
      { text: "SME clients calling about facility utilisation, remittance and trade documents are commercially valuable but are served through the same general queue as retail depositors.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "First Commercial Bank's technology function operates core banking, channel systems and regulatory reporting under state-linked governance where major systems arrive through formal tender. There is no evidence of an internal conversational AI capability, and the procurement culture of a government-linked institution actively favours proven, referenceable platforms with clear audit characteristics over experimental internal development. Buy-led.",
    whyNotBuild:
      "A state-linked bank is measured on stability and compliance, not on engineering ambition. Building Mandarin and Hokkien speech recognition, telephony integration for a national service centre, orchestration into core banking, and a conversation-evaluation framework that satisfies FSC examiners would be an unfunded and unrewarded programme. Buying gives the bank an auditable, vendor-supported capability that fits the tender process it already knows how to run.",
    workflows: [
      {
        name: "Deposit and card servicing in Mandarin and Hokkien",
        friction: "The IVR is Mandarin-first and menu-driven, so older customers navigate poorly and press zero, pushing routine balance, statement and card-status questions to human agents.",
        outcome: "Routine retail servicing completed conversationally in the customer's preferred language including Hokkien, releasing agent capacity for advice-led conversations.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Core banking", "Card management system", "Customer information file"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Mortgage servicing and rate-adjustment enquiries",
        friction: "Rate resets and repayment-change questions require the agent to open several systems and often end in a branch appointment for something that is purely informational.",
        outcome: "Rate, schedule and early-repayment questions answered accurately in-conversation, with only genuine advice cases routed to a branch.",
        channels: ["Voice", "LINE"],
        systems: ["Loan servicing system", "Core banking", "Rate and product terms repository"],
        value: 3,
        complexity: 2,
      },
      {
        name: "SME facility and remittance status servicing",
        friction: "SME clients queue behind retail callers to ask about facility drawdown status, remittance arrival and document requirements, and are called back later with the answer.",
        outcome: "Business clients recognised and served immediately with live facility and remittance status, protecting the relationship that generates the bank's corporate margin.",
        channels: ["Voice", "LINE", "Corporate portal"],
        systems: ["Corporate lending system", "Remittance and payments platform", "Corporate customer records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Nationwide branch network with counter servicing as the primary channel for older customers",
        "Telephone service centre with Mandarin-first IVR routing",
        "Internet banking and a mobile banking app with transfer and enquiry functions",
        "LINE official account used for notifications and simple enquiries",
      ],
      gaps: [
        "No conversational servicing in Taiwanese Hokkien for the older depositor base",
        "Mortgage rate and repayment questions cannot be resolved without an agent or a branch visit",
        "Business clients have no differentiated service path for facility and remittance status",
        "Context is lost when a customer moves between LINE, the app, the phone line and a branch",
      ],
    },
    risks: [
      "FSC rules on financial-institution use of cloud services and outsourcing require regulator notification or approval, and impose data-residency and auditability conditions on any hosted platform.",
      "Taiwan's Personal Data Protection Act governs the customer data surfaced in service conversations, requiring purpose limitation and controlled retention of recordings and transcripts.",
      "Government-linked procurement runs on formal tender cycles, so the path from pilot interest to contract is long and must be planned for explicitly.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 3.2,
      automationRate: 0.55,
      basis: "Seller assumptions for a Taiwanese government-linked bank of this branch and customer scale; contact volume, blended service-centre cost per contact and containable share must be validated with the bank before use in a business case.",
    },
    pilotScope:
      "Deploy Mandarin and Hokkien conversational servicing for deposit, statement and card-status enquiries on the main service line and LINE official account, measured on containment rate and agent handling-time released.",
    expansion: [
      "Add mortgage servicing including rate-adjustment and repayment-schedule enquiries",
      "Open a differentiated SME path for facility drawdown and remittance status",
      "Extend into holding-level cross-channel servicing with the insurance and securities affiliates",
    ],
    stakeholders: [
      "Head of Retail Banking / Personal Banking Division",
      "Head of Customer Service Centre",
      "Chief Information Officer, First Commercial Bank",
      "Chief Compliance Officer / Legal Affairs (FSC liaison)",
      "Head of Digital Banking Department",
    ],
    discovery: [
      "What share of service-centre calls are handled in Taiwanese Hokkien rather than Mandarin today?",
      "How many calls escalate from the IVR to an agent for purely informational deposit and card queries?",
      "What is the bank's current FSC position on cloud-hosted processing of customer conversations?",
      "Are SME clients routed separately from retail callers, and what is the target response standard for them?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An elderly depositor calls First Commercial Bank in Hokkien to check a time-deposit maturity; the agent answers in Hokkien, confirms the rollover rate, and sets the renewal without transferring to a counter.",
  },

  "hua-nan-bank": {
    operatingContext:
      "Hua Nan Commercial Bank, the banking arm of Hua Nan Financial Holdings, is a century-old Taiwanese lender with a broad domestic branch network and a customer base that skews older and strongly branch-loyal. Its business mix is conventional and deposit-heavy: passbook savings, time deposits, mortgages, consumer loans, credit cards and SME lending, distributed largely through branch relationships rather than digital acquisition. Contact volume follows that profile — passbook and account queries, card activation and dispute questions, mortgage payment enquiries, and a steady flow of customers who simply prefer to ask a person. Digital channels exist in the form of internet and mobile banking and a LINE official account, but adoption among the core customer cohort lags the bank's own targets, so branch and phone continue to carry a load the bank would rather move.",
    strategicPressure: [
      { text: "Taiwan's regulator has pushed domestic banks toward digital-channel development while fair-treatment principles constrain how quickly branch access can be reduced.", kind: "verified" },
      { text: "Branch rationalisation pressure across Taiwan's crowded banking market pushes servicing onto phone and digital channels that this bank has historically underinvested in.", kind: "inference" },
      { text: "A customer base skewing older concentrates demand on voice and on Taiwanese Hokkien, the two things a menu-driven IVR serves worst.", kind: "inference" },
      { text: "Holding-level cross-sell into insurance and securities depends on service conversations the bank currently treats as pure cost.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Hua Nan operates a conservative, procurement-driven IT function focused on core banking stability and regulatory reporting. Nothing in its public posture suggests an internal conversational AI capability or an intent to develop one, and its governance as a state-linked financial holding subsidiary channels technology decisions through formal vendor selection. This is one of the cleanest buy-led profiles in the Taiwan set.",
    whyNotBuild:
      "The institution's scarce technology capacity is committed to core-system stability and compliance obligations. Speech recognition tuned to elderly Hokkien speakers, telephony, orchestration into a legacy core, and an evaluation framework that survives an FSC examination are four separate specialist disciplines with no internal home. Buying is not a preference here — it is the only realistic path to any service automation at all.",
    workflows: [
      {
        name: "Branch-overflow deposit and passbook servicing",
        friction: "Customers phone to ask balance, transaction history and passbook-update questions, and the Mandarin menu tree pushes most of them straight to an agent.",
        outcome: "Routine deposit enquiries resolved conversationally in Mandarin or Hokkien, absorbing branch-overflow volume without additional headcount.",
        channels: ["Voice", "LINE"],
        systems: ["Core banking", "Customer information file", "Transaction history"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Card activation, limit and dispute triage",
        friction: "Card queries mix simple activation with genuine dispute cases in one queue, so straightforward calls consume the same agent minutes as complex ones.",
        outcome: "Activation, limit and statement queries completed automatically while genuine disputes reach a specialist with the case already structured.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Card management system", "Dispute case management", "Core banking"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Mortgage payment and statement servicing",
        friction: "Mortgage customers call about payment dates, outstanding balances and early-repayment amounts, all of which require an agent to look up and read out.",
        outcome: "Accurate mortgage servicing answers delivered in-conversation with documents sent to the customer's channel, cutting branch appointments for informational requests.",
        channels: ["Voice", "LINE"],
        systems: ["Loan servicing system", "Core banking", "Document generation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Dense domestic branch network serving a branch-loyal customer base",
        "Telephone customer service centre with Mandarin IVR",
        "Internet and mobile banking with enquiry and transfer functions",
        "LINE official account used for notices and basic enquiries",
      ],
      gaps: [
        "No Hokkien-capable conversational servicing for the core older cohort",
        "Card activation and simple queries share a queue with complex dispute cases",
        "Mortgage informational requests still generate branch appointments",
        "No proactive outreach on maturing deposits or lapsing card benefits",
      ],
    },
    risks: [
      "FSC outsourcing and cloud-use rules require notification or approval and impose auditability and residency conditions on hosted conversational processing.",
      "Taiwan's Personal Data Protection Act limits how customer data and voice recordings may be processed and retained in service automation.",
      "A conservative, consensus-driven institution will require an unusually long proof and reference process before production deployment.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 3.0,
      automationRate: 0.55,
      basis: "Seller assumptions for a Taiwanese state-linked commercial bank of this branch scale; call volumes, service-centre cost per contact and containable share require validation with the bank's own reporting.",
    },
    pilotScope:
      "Automate deposit balance, transaction history and passbook enquiries in Mandarin and Hokkien on the main service line, measured on containment rate and reduced branch-counter enquiry traffic in two pilot regions.",
    expansion: [
      "Add card activation, limit and statement servicing with structured dispute intake",
      "Extend to mortgage payment, balance and early-repayment servicing",
      "Introduce proactive deposit-maturity and product-renewal outreach",
    ],
    stakeholders: [
      "Head of Personal Banking Division",
      "Head of Customer Service Centre",
      "Chief Information Officer, Hua Nan Commercial Bank",
      "Chief Compliance Officer (FSC and PDPA liaison)",
      "Head of Digital Finance Department",
    ],
    discovery: [
      "What proportion of service-centre calls could be resolved from core-banking data alone?",
      "How large is the Hokkien-speaking share of the phone-service customer base?",
      "Does Hua Nan Financial's digital roadmap carry a funded line for contact-centre modernisation this cycle?",
      "What FSC filings would be required before customer conversations could be processed on a hosted platform?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A long-standing Hua Nan customer calls to check whether his mortgage payment cleared this month; the agent confirms it in Hokkien and sends the statement to his LINE account without a branch visit.",
  },

  "chang-hwa-bank": {
    operatingContext:
      "Chang Hwa Commercial Bank is one of Taiwan's oldest banks, with particularly deep roots in central Taiwan and a lending book weighted toward the small and mid-sized manufacturers of the Taichung and Changhua industrial belt. Its retail side is a conventional deposit, mortgage and card franchise serving a customer base that is older and geographically concentrated outside Taipei, while its corporate side services SME working-capital facilities, guarantees and remittances for exporters. Servicing runs through branch counters, relationship managers for SME clients, a telephone service centre and a digital estate of internet and mobile banking plus a LINE official account. In central and southern Taiwan the practical service reality includes a high proportion of Taiwanese Hokkien conversation, which a Mandarin-designed IVR cannot serve.",
    strategicPressure: [
      { text: "Taiwan's banking market is unusually crowded for its size, keeping margin pressure and cost-efficiency discipline permanent for mid-sized domestic banks.", kind: "verified" },
      { text: "The FSC's digital-finance and fair-treatment agenda obliges banks to demonstrate accessible service quality across channels, not only in branches.", kind: "verified" },
      { text: "A central-Taiwan SME and retail base makes Hokkien-language servicing a practical requirement rather than a nicety.", kind: "inference" },
      { text: "SME relationship managers likely absorb routine facility and remittance status questions that could be automated, diluting their credit and origination time.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Chang Hwa runs the conservative operating culture typical of Taiwan's state-linked lenders: technology arrives through formal procurement, focused on core banking, channels and regulatory reporting. There is no visible internal AI engineering function, and no strategic narrative that would justify creating one. Buy-led, with the decisive question being which executive owns the modernisation budget rather than whether the bank would build.",
    whyNotBuild:
      "The bank has neither the talent pool nor the mandate to assemble speech, telephony, orchestration and evaluation into a governed platform. Every one of those layers carries an FSC-facing audit obligation that a bought, referenceable platform can evidence and an internal prototype cannot. The right to win is regulatory defensibility plus Hokkien-capable speech that the bank cannot source any other way.",
    workflows: [
      {
        name: "SME facility and remittance status servicing",
        friction: "SME owners call their relationship manager's mobile to ask whether a drawdown cleared or a remittance arrived, consuming origination time on lookup work.",
        outcome: "Live facility and remittance status delivered conversationally to verified business callers, returning relationship-manager time to credit and origination.",
        channels: ["Voice", "LINE", "Corporate portal"],
        systems: ["Corporate lending system", "Remittance and payments platform", "Corporate customer records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Retail deposit and account servicing in Hokkien",
        friction: "Older central-Taiwan customers navigate a Mandarin menu badly and default to an agent for balance, history and passbook questions.",
        outcome: "Everyday retail servicing handled in the customer's own language, cutting agent minutes on informational calls.",
        channels: ["Voice", "LINE"],
        systems: ["Core banking", "Customer information file", "Transaction history"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Loan payment and rate-change enquiry handling",
        friction: "Rate adjustments generate predictable waves of calls asking what changed and what the new instalment is, all handled manually.",
        outcome: "Rate-change waves absorbed with grounded, customer-specific explanations delivered proactively before the calls arrive.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Loan servicing system", "Rate and product terms repository", "Core banking"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch network concentrated in central Taiwan with counter servicing",
        "Relationship managers serving SME lending clients directly",
        "Telephone service centre with Mandarin-first IVR",
        "Internet and mobile banking plus a LINE official account for notices",
      ],
      gaps: [
        "No Hokkien-capable automated servicing for the core regional customer base",
        "SME status enquiries depend on an individual relationship manager being reachable",
        "Rate-change communications are reactive rather than proactive",
        "No unified context across branch, phone, app and LINE interactions",
      ],
    },
    risks: [
      "FSC cloud-outsourcing rules require regulatory notification or approval with residency and audit conditions before conversational processing goes live.",
      "Taiwan's Personal Data Protection Act constrains processing and retention of customer conversation data, particularly for corporate-client information.",
      "SME servicing relies on relationship trust; automation perceived as displacing the relationship manager can meet internal resistance from the business line.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 3.0,
      automationRate: 0.5,
      basis: "Seller assumptions for a mid-large Taiwanese state-linked bank; contact volume, service-centre cost per contact and containable share must be validated against the bank's own operational reporting.",
    },
    pilotScope:
      "Deploy Mandarin and Hokkien retail deposit and account servicing on the main service line for the central-Taiwan branch region, measured on containment rate and counter-enquiry reduction.",
    expansion: [
      "Add loan payment and rate-change servicing with proactive pre-emptive notification",
      "Open a verified SME path for facility drawdown and remittance status enquiries",
      "Extend to card servicing and structured dispute intake",
    ],
    stakeholders: [
      "Head of Personal Banking Division",
      "Head of Corporate Banking / SME Business",
      "Head of Customer Service Centre",
      "Chief Information Officer, Chang Hwa Commercial Bank",
      "Chief Compliance Officer (FSC and PDPA liaison)",
    ],
    discovery: [
      "Which executive owns customer-service technology, and is there a funded modernisation programme this year?",
      "What share of central and southern branch-region calls are conducted in Taiwanese Hokkien?",
      "How much relationship-manager time goes to routine facility and remittance status lookups?",
      "What call volume follows a benchmark rate adjustment, and over how many days?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Taichung machine-shop owner calls Chang Hwa to check whether his working-capital drawdown has cleared; the agent verifies him, confirms the credit in Hokkien, and his relationship manager never has to pick up.",
  },

  "mega-bank": {
    operatingContext:
      "Mega International Commercial Bank, the banking arm of Mega Financial Holding, is Taiwan's leading foreign-exchange and trade-finance bank, serving the exporters and manufacturers that drive the island's economy through a domestic branch network plus overseas branches across Asia, North America and Europe. Its distinctive contact load is corporate rather than retail: trade-document status on letters of credit and collections, remittance tracing across correspondent banks, FX rate and settlement enquiries, and compliance documentation requests that must be satisfied before a transaction can clear. These conversations are deadline-driven in a way retail banking rarely is — a stuck document query holds a shipment, and time-zone differences mean the customer's urgency and the bank's working hours frequently do not align. Corporate customers reach it through relationship managers, a corporate service line, corporate banking portals and email, with LINE used for retail notifications.",
    strategicPressure: [
      { text: "Mega has been subject to significant anti-money-laundering enforcement action by overseas regulators in the past, after which the group substantially strengthened its compliance function and posture.", kind: "verified" },
      { text: "As Taiwan's dominant trade-finance and FX bank, its service quality is tied directly to the operating rhythm of Taiwanese exporters rather than to consumer banking cycles.", kind: "verified" },
      { text: "A post-remediation compliance culture strongly favours governed, auditable, vendor-supported systems over internally built experimental tooling.", kind: "inference" },
      { text: "Overseas branch time zones mean corporate customers frequently need document and remittance status outside Taipei working hours, when only email is available.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Mega's technology investment is concentrated on core banking, trade-finance platforms, payments and — since its remediation programme — compliance and transaction-monitoring systems. The institution's post-enforcement culture prizes demonstrable control and third-party assurance, which maps directly onto buying a governed platform rather than building one. There is no evidence of an internal conversational AI capability and every reason to expect formal procurement. Buy-led.",
    whyNotBuild:
      "In a bank whose recent history is defined by compliance remediation, an internally built system handling customer communications about remittances and trade documents would be an examination liability rather than an asset. It needs a platform whose speech, orchestration, logging and evaluation layers can be evidenced to an examiner on demand. That is a bought-platform characteristic, and it is precisely why Mega will not attempt this internally.",
    workflows: [
      {
        name: "Trade-document status servicing",
        friction: "Exporters phone or email the trade-finance desk to ask whether documents were accepted, discrepancies raised or payment released, and wait for a manual check across trade systems.",
        outcome: "Live document status delivered to verified corporate callers in-conversation, removing the shipment-blocking wait for a desk callback.",
        channels: ["Voice", "Corporate portal", "Email"],
        systems: ["Trade finance system", "Document imaging", "Corporate customer records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Remittance tracing and settlement enquiry",
        friction: "A remittance that has not arrived triggers a call, a manual trace across correspondent messaging and a callback hours or days later, often crossing time zones.",
        outcome: "Remittance status and trace initiation handled conversationally at any hour, with compliance holds explained clearly instead of leaving the customer guessing.",
        channels: ["Voice", "Corporate portal"],
        systems: ["Payments and remittance platform", "Correspondent messaging records", "Compliance screening system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Compliance documentation collection",
        friction: "Enhanced due-diligence and transaction-purpose documentation is requested by email and chased manually, delaying transactions and consuming compliance-officer time.",
        outcome: "Structured, validated documentation collected in-channel with clear explanation of what is required and why, shortening compliance holds.",
        channels: ["Corporate portal", "Voice", "Email"],
        systems: ["Compliance case management", "Document management", "KYC repository"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Corporate banking portals for trade finance, FX and payments",
        "Relationship managers covering corporate and trade-finance clients",
        "Telephone service centre covering retail and corporate lines",
        "Overseas branch network providing local-hours coverage in key markets",
      ],
      gaps: [
        "No out-of-hours conversational path for trade-document or remittance status",
        "Compliance holds are communicated by email with limited explanation of what will release them",
        "Corporate callers are not consistently recognised and routed to trade-capable handling",
        "No single view joining a corporate customer's portal activity, calls and pending compliance requests",
      ],
    },
    risks: [
      "Post-enforcement AML governance means any system touching remittance or trade communications must satisfy stringent auditability and record-keeping requirements.",
      "FSC cloud-outsourcing rules plus overseas-branch host-regulator expectations create a multi-jurisdiction approval path for hosted processing.",
      "Taiwan's Personal Data Protection Act and corporate confidentiality obligations restrict how trade and payment details may be surfaced conversationally.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 3.5,
      automationRate: 0.45,
      basis: "Seller assumptions for a Taiwanese trade-finance-led bank with a corporate-weighted contact mix; volumes, cost per corporate contact and containable share must be validated with the bank in discovery.",
    },
    pilotScope:
      "Automate trade-document status and remittance-tracing enquiries for verified corporate callers on the corporate service line, with full transcript logging for compliance review, measured on desk callback volume eliminated.",
    expansion: [
      "Extend coverage to overseas-branch time zones for round-the-clock corporate status servicing",
      "Add structured compliance documentation collection with in-flow validation",
      "Open FX rate and settlement enquiry handling for corporate treasury users",
    ],
    stakeholders: [
      "Head of Corporate Banking / Trade Finance Division",
      "Chief Compliance Officer (AML and FSC liaison)",
      "Chief Information Officer, Mega International Commercial Bank",
      "Head of Operations / Payments and Remittance Centre",
      "Head of International Banking (overseas branch network)",
    ],
    discovery: [
      "What is the current turnaround for a trade-document status enquiry from customer call to answer?",
      "How many remittance-trace requests are opened monthly, and what share stem from compliance holds?",
      "What assurance evidence would the compliance function require before an AI system could handle corporate communications?",
      "Which overseas branches would be in scope, and what host-regulator constraints apply to each?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Taiwanese exporter calls Mega at 8pm asking whether the shipping documents under her letter of credit were accepted; the agent confirms acceptance and the discrepancy already waived, and her buyer ships the next morning.",
  },

  "land-bank-taiwan": {
    operatingContext:
      "Land Bank of Taiwan is a wholly state-owned bank whose historic mandate centres on real-estate and agricultural finance, making it one of the largest mortgage servicers in the country and a primary channel for government housing-policy lending. Its book is dominated by long-duration mortgages and land-related lending, with a deposit franchise attached, distributed through a nationwide branch network. That concentration produces an unusually homogeneous contact profile: rate-adjustment questions when benchmark rates move, repayment-schedule and instalment queries, early-repayment and payoff quotations, and waves of enquiries whenever the government announces a change to preferential housing-loan schemes. Customers reach it through branches, a telephone service centre, internet and mobile banking, and LINE notifications, and the mortgage cohort skews older and phone-first.",
    strategicPressure: [
      { text: "Taiwan's government has repeatedly used preferential housing-loan and credit-control measures to manage the property market, and state-owned banks carry the operational load of implementing them.", kind: "verified" },
      { text: "Benchmark rate movements produce synchronised, predictable enquiry waves across a mortgage-concentrated book of this size.", kind: "inference" },
      { text: "Policy-scheme announcements create sudden national demand for eligibility explanations that branch and phone capacity cannot absorb.", kind: "inference" },
      { text: "Because servicing is dominated by a small number of highly repeatable question types, containment potential here is higher than for a diversified retail bank.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A wholly state-owned bank operates under government procurement discipline: systems are specified, tendered and bought, with internal technology capacity devoted to running core banking and satisfying supervisory and audit requirements. There is no plausible route by which Land Bank would create a conversational AI engineering function. This is the purest procurement-driven buy in the Taiwan banking set — the work is in navigating the tender, not in winning a build-versus-buy argument.",
    whyNotBuild:
      "State-owned institutions are budgeted and audited against defined capital programmes, not against speculative internal development. Speech, telephony, orchestration and evaluation would each need to be justified, staffed and defended to the audit office. Buying a proven platform with documented controls is the only path that survives that governance — and the mortgage-servicing workload is repeatable enough that a bought deployment shows results fast.",
    workflows: [
      {
        name: "Mortgage rate-adjustment and instalment explanation",
        friction: "Every benchmark rate move triggers a wave of calls asking what the new instalment is and why, each handled manually by an agent reading from the loan system.",
        outcome: "Customer-specific rate and instalment explanations delivered proactively and on demand, flattening the post-adjustment call spike.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Loan servicing system", "Rate and product terms repository", "Core banking"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Early-repayment and payoff quotation",
        friction: "Payoff quotes require an agent calculation including any penalty period, and customers commonly visit a branch for what is a computed number.",
        outcome: "Accurate payoff and partial-prepayment quotations delivered in-conversation with the written quotation sent to the customer's channel.",
        channels: ["Voice", "LINE"],
        systems: ["Loan servicing system", "Document generation", "Core banking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Housing-policy scheme eligibility guidance",
        friction: "A government scheme announcement produces a national surge of eligibility questions that overwhelm both branches and the service line for weeks.",
        outcome: "Grounded eligibility explanations at surge scale with genuine applicants routed to branch appointments already pre-qualified.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Policy scheme rules repository", "Loan origination system", "Branch appointment scheduling"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Nationwide branch network as the primary mortgage servicing channel",
        "Telephone service centre with Mandarin IVR routing",
        "Internet and mobile banking with loan account enquiry",
        "LINE official account used for notices and payment reminders",
      ],
      gaps: [
        "No self-service explanation of a customer's own rate change and revised instalment",
        "Payoff quotations require an agent or a branch visit",
        "Policy-scheme eligibility questions have no scalable grounded answer path",
        "No Hokkien-capable automated servicing for the older mortgage cohort",
      ],
    },
    risks: [
      "FSC cloud-outsourcing rules and state-enterprise data-handling requirements impose residency, approval and audit conditions on any hosted conversational processing.",
      "Statements about loan terms and payoff amounts are contractually consequential, so grounding must come from the loan system of record with no generative estimation.",
      "Government-enterprise tender cycles are long and formally specified, requiring the pilot to be structured as a demonstrable, procurable scope.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 2.9,
      automationRate: 0.6,
      basis: "Seller assumptions for a mortgage-concentrated Taiwanese state-owned bank; contact volumes, service-centre cost per contact and containment potential must be validated against the bank's own reporting.",
    },
    pilotScope:
      "Automate rate-adjustment explanation and payoff quotation for the mortgage book on voice and LINE across two branch regions, measured on containment and reduction in branch appointments for informational requests.",
    expansion: [
      "Add proactive outbound explanation ahead of each benchmark rate adjustment nationwide",
      "Extend to housing-policy scheme eligibility guidance with pre-qualified branch handoff",
      "Cover deposit and general account servicing for the same customer base",
    ],
    stakeholders: [
      "Head of Personal Finance / Mortgage Business Department",
      "Head of Customer Service Centre",
      "Chief Information Officer, Land Bank of Taiwan",
      "Chief Compliance Officer / Legal Affairs (FSC liaison)",
      "Head of Branch Operations Administration",
    ],
    discovery: [
      "How many calls follow a benchmark rate adjustment, and over how many days does the wave last?",
      "What proportion of branch appointments are informational mortgage requests rather than transactions?",
      "What is the procurement route and typical tender duration for a customer-facing system of this type?",
      "Can payoff and prepayment calculations be exposed to an external system, or must they stay in-branch?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "The week after a rate adjustment, a Land Bank mortgage customer asks on LINE what her new monthly payment will be; the agent explains the change against her own loan terms and sends the revised schedule.",
  },

  "taiwan-cooperative-bank": {
    operatingContext:
      "Taiwan Cooperative Bank, the core of Taiwan Cooperative Financial Holding, operates one of the island's largest domestic branch networks, built on a heritage of cooperative and agricultural finance that still shapes its customer base and geography. It serves a very large retail deposit franchise skewed toward older, rural and small-town customers who bank at the counter, alongside SME and agricultural lending, and it has a distinctive institutional role providing services to community financial institutions such as credit cooperatives and farmers' and fishermen's associations. That produces two contact populations at once: a huge retail voice load in Mandarin and Taiwanese Hokkien, and a B2B operational load from partner institutions. Digital channels — internet and mobile banking and a LINE official account — exist but carry a modest share of the core cohort's interactions.",
    strategicPressure: [
      { text: "The bank's branch network is among the largest in Taiwan, so counter-servicing cost is a structurally significant part of its expense base.", kind: "verified" },
      { text: "The FSC's digital-finance agenda pushes domestic banks to shift routine servicing onto non-branch channels while maintaining accessibility.", kind: "verified" },
      { text: "A rural and older customer base makes Hokkien-language voice servicing an operational requirement, not an optional enhancement.", kind: "inference" },
      { text: "Servicing partner community financial institutions adds a B2B operational contact stream that is likely handled informally by branch and department staff today.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Taiwan Cooperative Bank's technology posture is that of a large, conservative, state-linked institution: core banking stability, channel maintenance and regulatory reporting, procured through formal vendor selection. Its scale is real but its operating culture is not experimental, and there is no signal of an internal conversational AI capability. Buy-led, with scale making it one of the more valuable buy-led targets in Taiwan.",
    whyNotBuild:
      "Nothing in the bank's mandate or talent base supports building Hokkien-capable speech, telephony at national retail scale, orchestration into a legacy core, and an FSC-defensible evaluation framework. The size of the branch estate means the payback on bought automation is large and quick, while an internal build would take years the cost curve does not allow.",
    workflows: [
      {
        name: "High-volume retail deposit servicing in Mandarin and Hokkien",
        friction: "Balance, transaction-history and passbook questions arrive by phone and at counters from a cohort the Mandarin IVR effectively cannot serve, so almost all of it becomes human handling.",
        outcome: "The largest single contact category resolved conversationally in the customer's own language, taking measurable load off the biggest branch network in Taiwan.",
        channels: ["Voice", "LINE"],
        systems: ["Core banking", "Customer information file", "Transaction history"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Deposit maturity and renewal servicing",
        friction: "Time-deposit maturities are handled by letter or by the customer coming in, and renewal decisions default to whatever happens automatically rather than to an informed choice.",
        outcome: "Proactive maturity conversations with rate options presented and renewal executed in-channel, retaining deposits without a counter visit.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Core banking", "Deposit product and rate catalogue", "Customer information file"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Partner-institution operational enquiry handling",
        friction: "Community financial institutions call departments and branches directly for clearing, settlement and product operational questions, with no consistent service standard or record.",
        outcome: "Partner institutions served through a consistent, logged channel with live operational status, freeing specialist staff from repetitive lookups.",
        channels: ["Voice", "Email", "Partner portal"],
        systems: ["Clearing and settlement systems", "Partner institution records", "Operations case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "One of Taiwan's largest branch networks with counter-first servicing",
        "Telephone service centre with Mandarin IVR routing",
        "Internet and mobile banking with enquiry and transfer functions",
        "LINE official account for notifications and simple enquiries",
      ],
      gaps: [
        "No Hokkien-capable automated servicing despite a heavily Hokkien-speaking customer base",
        "Deposit maturity decisions are not supported by any proactive conversation",
        "Partner-institution enquiries have no standardised service channel",
        "Digital-channel adoption targets are not supported by an assisted conversational path for less digital customers",
      ],
    },
    risks: [
      "FSC cloud-outsourcing and data-residency requirements apply before hosted conversational processing of customer data can go live.",
      "Taiwan's Personal Data Protection Act limits processing and retention of voice recordings and transcripts across a very large customer base.",
      "Scale is both the opportunity and the risk: a national deployment across this branch estate demands a phased rollout plan with strict evaluation gates.",
    ],
    economics: {
      volumeMonthly: 1000000,
      costPerInteraction: 2.9,
      automationRate: 0.55,
      basis: "Seller assumptions for a Taiwanese bank with one of the island's largest branch networks; contact volumes, blended cost per contact and containable share must be validated against the bank's own service reporting.",
    },
    pilotScope:
      "Deploy Mandarin and Hokkien deposit and account servicing on the main service line for two rural branch regions, measured on containment rate and counter-enquiry reduction against comparable regions.",
    expansion: [
      "Roll the same servicing nationwide across the full branch network",
      "Add proactive deposit-maturity and renewal conversations",
      "Open a standardised operational channel for partner community financial institutions",
    ],
    stakeholders: [
      "Head of Personal Banking Department",
      "Head of Customer Service Centre",
      "Chief Information Officer, Taiwan Cooperative Bank",
      "Head of Branch Administration / Regional Operations",
      "Chief Compliance Officer (FSC and PDPA liaison)",
    ],
    discovery: [
      "What share of counter transactions across the network are purely informational enquiries?",
      "How large is the Hokkien-speaking proportion of the phone and counter customer base by region?",
      "Are there formal digital-channel migration targets, and who is accountable for them?",
      "How are partner community financial institutions serviced operationally today?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A farmer in Yunlin calls Taiwan Cooperative Bank in Hokkien to check whether his subsidy payment has landed and when his time deposit matures; both answered in one conversation, with no trip to the branch.",
  },

  "union-bank-taiwan": {
    operatingContext:
      "Union Bank of Taiwan is a mid-sized privately owned commercial bank that punches above its balance-sheet weight in consumer credit, with credit cards and unsecured consumer lending forming a disproportionate share of its business relative to peers of similar size. That mix determines its service profile: card activation and statement queries, instalment-plan conversions, limit and reward-point questions, transaction-dispute intake, and consumer-loan application status and repayment enquiries. It competes against both the state-linked giants and the large financial holdings without the IT budget of either, so service agility rather than scale is its positioning. Customers reach it through a telephone service centre, internet and mobile banking, a card-focused app experience and a LINE official account, with a branch network far smaller than the state banks.",
    strategicPressure: [
      { text: "Taiwan's credit-card and consumer-lending market is intensely competitive with heavy reward-driven acquisition, making per-customer servicing cost a direct margin issue.", kind: "verified" },
      { text: "FSC consumer-protection and fair-treatment expectations bear particularly on unsecured lending and card practices, raising the compliance load on servicing conversations.", kind: "verified" },
      { text: "A card-heavy portfolio generates high contact frequency per customer relative to a deposit-led bank, concentrating cost in exactly the workflows automation handles best.", kind: "inference" },
      { text: "Without the budget of larger rivals, a packaged deployment is likely the only route by which this bank matches their service response times.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A mid-sized private bank with a card-led business runs its technology function on card processing, core banking and digital channels, with capacity fully committed to keeping those competitive. It has neither the headcount nor the budget to assemble a conversational platform, and its competitive logic favours buying capability that larger rivals build. Buy-led, with a modest but well-defined entry scope.",
    whyNotBuild:
      "This bank's advantage is speed of decision, not depth of engineering. Diverting its small technology team to build speech, telephony, orchestration and evaluation would cost it the agility that is its actual differentiator. Buying lets it deploy card-servicing automation in a quarter and compete on response time against banks with far larger technology organisations.",
    workflows: [
      {
        name: "Card activation, statement and reward servicing",
        friction: "High-frequency, low-complexity card queries fill the service queue, so every reward-point or statement question costs a full agent interaction.",
        outcome: "The dominant card contact categories resolved automatically, cutting cost per card account and freeing agents for disputes and collections.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Card management system", "Rewards platform", "Core banking"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Instalment-plan conversion and limit requests",
        friction: "Converting a large purchase to instalments or requesting a temporary limit increase requires an agent to check eligibility and apply the change manually.",
        outcome: "Eligibility-checked instalment conversions and limit changes executed within policy inside the conversation, capturing revenue that today leaks to abandoned calls.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Card management system", "Credit decisioning rules", "Billing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Transaction-dispute intake and status",
        friction: "Disputes start with a long verbal information-gathering call, then go quiet during investigation, generating repeated status chasing.",
        outcome: "Structured dispute intake completed in one pass with automatic status updates at each stage, cutting both handling time and repeat contacts.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Dispute case management", "Card transaction records", "Chargeback workflow"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Telephone service centre focused on card and consumer-lending enquiries",
        "Mobile banking and card app with statement and payment functions",
        "LINE official account for transaction alerts and promotions",
        "Internet banking for account and loan servicing",
      ],
      gaps: [
        "Reward-point and statement questions still require an agent",
        "Instalment conversion and limit requests cannot be completed self-service",
        "Dispute status is not proactively communicated during investigation",
        "No unified context when a cardholder moves between app, LINE and the phone line",
      ],
    },
    risks: [
      "FSC consumer-protection rules on unsecured credit require careful control over any automated statement about credit terms, limits or instalment costs.",
      "Personal Data Protection Act obligations apply to card transaction data surfaced in conversation, with strict retention limits on recordings.",
      "A mid-sized bank's budget constrains deal size, so the entry scope must be tightly bounded and payback demonstrated quickly.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 2.8,
      automationRate: 0.6,
      basis: "Seller assumptions for a card-led mid-sized Taiwanese bank; contact volumes, service-centre cost per contact and containable share must be validated against the bank's own card-servicing reporting.",
    },
    pilotScope:
      "Automate card activation, statement and reward-point servicing across voice and LINE for the full cardholder base, measured on containment rate and cost per card account served.",
    expansion: [
      "Add instalment-plan conversion and limit-request handling within a policy-bounded decision matrix",
      "Extend to structured dispute intake with proactive investigation-status updates",
      "Cover consumer-loan application status and repayment servicing",
    ],
    stakeholders: [
      "Head of Credit Card Business Division",
      "Head of Consumer Banking / Personal Lending",
      "Head of Customer Service Centre",
      "Chief Information Officer, Union Bank of Taiwan",
      "Chief Compliance Officer (FSC consumer-protection liaison)",
    ],
    discovery: [
      "What is the monthly contact-per-active-card ratio, and which query types dominate?",
      "How many instalment-conversion opportunities are lost to abandoned calls each month?",
      "What is the average dispute-related contact count from intake to resolution?",
      "What budget envelope exists for customer-service technology this fiscal year?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Union Bank cardholder asks on LINE whether her large appliance purchase can be split into instalments; the agent checks eligibility, applies the plan, and confirms the new monthly amount in the same conversation.",
  },

  "bank-sinopac": {
    operatingContext:
      "Bank SinoPac is the banking arm of SinoPac Financial Holdings and one of Taiwan's more digitally assertive private banks, best known for its DAWHO digital-banking brand, which built a young, high-frequency customer base through fee-free transfers, cash-back debit and FX-friendly features rather than through branches. That base behaves nothing like a traditional Taiwanese bank's: they transact constantly on mobile, use the bank for cross-border and travel FX, expect answers in-app or on LINE within minutes, and abandon rather than wait. Alongside it, SinoPac runs a conventional retail, wealth and corporate bank with a branch network and an older customer segment. The result is one service organisation carrying two very different expectation sets, where the digital cohort generates high contact frequency at low value per contact.",
    strategicPressure: [
      { text: "DAWHO established SinoPac as a leading digital-banking brand in Taiwan, drawing a large and young digitally-native customer base.", kind: "verified" },
      { text: "The FSC's digital-banking and open-finance direction keeps competitive pressure high among Taiwan's digitally ambitious private banks.", kind: "verified" },
      { text: "A high-frequency, low-balance digital cohort makes cost per contact the binding constraint on the brand's profitability.", kind: "inference" },
      { text: "Digital-brand customers who cannot get an instant answer are more likely to switch than to wait, making response latency a retention variable rather than a service metric.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "SinoPac has genuine digital product capability — it designed and shipped a differentiated digital bank, which most Taiwanese peers did not. But its engineering is oriented to app experience, payments and product features, not to speech recognition, telephony infrastructure or conversation-evaluation frameworks. That gap is exactly the partner-led shape: a capable customer that will integrate deeply and own the experience layer, while buying the conversational and evaluation infrastructure underneath it.",
    whyNotBuild:
      "SinoPac's product team is the reason DAWHO worked, and its time is worth more spent on the next differentiating feature than on rebuilding a speech and telephony stack that is available as a service. The bank also faces an FSC-facing evidence burden for any AI touching customers, which a vendor platform with built-in evaluation and logging satisfies far more cheaply than an internal effort. Partner, not build.",
    workflows: [
      {
        name: "DAWHO digital-customer servicing across payments and cards",
        friction: "A digitally-native cohort generates constant transaction, transfer-limit and cash-back questions that overflow into a phone queue designed for traditional banking customers.",
        outcome: "High-frequency digital queries resolved instantly in-app and on LINE, holding cost per contact at a level the digital brand's economics can support.",
        channels: ["Mobile app", "LINE", "Voice"],
        systems: ["Core banking", "Card and payment systems", "Digital channel platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Foreign-exchange and cross-border transaction servicing",
        friction: "FX conversion, overseas withdrawal and cross-border transfer questions arrive at all hours from travelling customers, but service coverage follows Taipei business hours.",
        outcome: "FX rate, conversion and cross-border status questions answered around the clock in the customer's channel, matching the travel behaviour the brand was designed for.",
        channels: ["Mobile app", "LINE", "Voice"],
        systems: ["FX and treasury systems", "Payments platform", "Card transaction records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Digital onboarding and verification completion",
        friction: "Remote account opening stalls on identity verification or document quality, and the applicant is left to work out what went wrong or abandon.",
        outcome: "Stalled onboarding recovered conversationally with the specific blocker explained and corrected, lifting completion on the brand's primary acquisition path.",
        channels: ["Mobile app", "LINE", "Voice"],
        systems: ["Digital onboarding platform", "Identity verification service", "KYC repository"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "DAWHO digital-banking brand with a full-featured mobile app",
        "LINE official account used actively for alerts and customer engagement",
        "Telephone service centre serving both digital and traditional customers",
        "Branch network and wealth-management service for the conventional customer base",
      ],
      gaps: [
        "No round-the-clock conversational servicing despite a customer base that transacts around the clock",
        "FX and overseas-transaction questions from travelling customers depend on business-hours support",
        "Onboarding drop-offs are not recovered conversationally",
        "Digital-brand and traditional-bank customers share a service queue with the same handling model",
      ],
    },
    risks: [
      "FSC cloud-outsourcing rules require notification or approval and impose auditability and residency conditions on hosted conversational processing.",
      "Personal Data Protection Act obligations apply to transaction and identity data surfaced in service conversations, including onboarding recovery.",
      "A digitally confident bank will scrutinise where the vendor's layer ends and its own experience layer begins — the architecture split must be explicit from the first conversation.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 3.0,
      automationRate: 0.65,
      basis: "Seller assumptions for a Taiwanese digital-brand-led private bank; contact volumes, cost per contact split between digital and traditional cohorts, and containable share must all be validated in discovery.",
    },
    pilotScope:
      "Deploy always-on conversational servicing for DAWHO transaction, transfer-limit and cash-back queries in-app and on LINE, measured on containment, response latency and cost per digital customer served.",
    expansion: [
      "Add FX and cross-border transaction servicing with round-the-clock coverage",
      "Extend to digital onboarding recovery for stalled verification cases",
      "Bring the traditional retail and wealth customer base onto the same platform with voice and Hokkien support",
    ],
    stakeholders: [
      "Head of Digital Banking / DAWHO brand owner",
      "Head of Customer Service Centre",
      "Chief Information Officer, Bank SinoPac",
      "Head of Retail Banking Division",
      "Chief Compliance Officer (FSC and PDPA liaison)",
    ],
    discovery: [
      "What is the contact rate per DAWHO customer per month compared with a traditional retail customer?",
      "What proportion of contacts arrive outside Taipei business hours?",
      "How many remote account openings stall at verification, and is any recovery attempted today?",
      "Where does SinoPac want the boundary between its own experience layer and a vendor's conversational infrastructure?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A DAWHO customer in Tokyo messages at midnight asking why her card was declined at an ATM; the agent identifies the overseas-withdrawal setting, enables it, and the withdrawal succeeds minutes later.",
  },

  "yuanta-bank": {
    operatingContext:
      "Yuanta Commercial Bank is the banking arm of Yuanta Financial Holdings, a group whose centre of gravity is Yuanta Securities, Taiwan's leading brokerage. That parentage gives the bank an unusual customer profile: a meaningful share of its retail base is investment-active, holding brokerage accounts alongside deposits, funds and securities-collateralised lending. Its service load therefore correlates with market behaviour rather than with banking cycles — settlement and fund-transfer questions, NAV and fund-switch enquiries, margin and collateral questions, and surges on volatile trading days when banking and securities enquiries spike simultaneously. Customers reach it through a branch network, a service centre, banking and trading apps, and LINE, and the holding structure means a single customer's problem may span two subsidiaries with two service organisations.",
    strategicPressure: [
      { text: "Yuanta Financial Holdings is anchored by Taiwan's largest securities brokerage, making the group's fortunes and service load closely tied to equity-market activity.", kind: "verified" },
      { text: "Taiwan's exceptionally high retail participation in equity trading concentrates service demand into market-moving days.", kind: "verified" },
      { text: "Group technology investment naturally prioritises trading platforms and market connectivity, leaving bank servicing dependent on procured capability.", kind: "inference" },
      { text: "Cross-subsidiary customers who must call two service organisations for one problem are a visible cross-sell and experience weakness the holding could address with one deployment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "In a securities-led financial holding, engineering priority goes to trading systems, order routing and market data — the places where latency and reliability are competitive weapons. The banking subsidiary's servicing runs on conventional contact-centre infrastructure and is funded as an operating cost. That makes the bank buy-led, with the interesting angle being whether the securities arm's servicing needs can be attached to anchor a larger group deployment.",
    whyNotBuild:
      "The group's scarce engineering talent is committed to trading infrastructure where milliseconds matter commercially. Nobody in that organisation is going to be reassigned to build Mandarin speech, telephony and conversation evaluation for bank servicing. Buying is faster, and a platform that can serve both bank and securities workflows is worth more to the holding than anything the bank could build alone.",
    workflows: [
      {
        name: "Volatility-day enquiry surge handling",
        friction: "On sharp market days, settlement, transfer and fund-value enquiries spike simultaneously across bank and securities lines, and both queues melt at once.",
        outcome: "Surge volume absorbed elastically with grounded account and settlement answers, so specialists handle only the cases that genuinely need judgement.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Core banking", "Securities settlement interface", "Customer information file"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Fund and wealth-product servicing",
        friction: "NAV, holdings, switch and redemption-timing questions require an agent to open the wealth platform and read out values that change daily.",
        outcome: "Holdings and fund-transaction questions answered accurately in-conversation, with switches and redemptions executed within suitability rules.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Wealth management platform", "Fund transaction records", "Suitability assessment records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Deposit and settlement-account servicing",
        friction: "Routine balance, transfer-limit and settlement-account questions from investment customers consume the same agent capacity as advisory conversations.",
        outcome: "Everyday banking queries handled automatically, protecting agent capacity for the wealth conversations that generate fee income.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Core banking", "Transaction history", "Settlement account records"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Branch network and telephone service centre for banking customers",
        "Mobile and internet banking with settlement-account functions",
        "LINE official account for account alerts and notices",
        "Group brokerage platforms and trading apps serving the same customers separately",
      ],
      gaps: [
        "Bank and securities service organisations do not share context for the same customer",
        "Fund NAV, holdings and switch questions require an agent lookup",
        "Volatility-day surges have no elastic capacity mechanism",
        "No proactive communication to investment customers when settlement or corporate-action events affect their accounts",
      ],
    },
    risks: [
      "Suitability and investor-protection rules mean anything approaching investment advice must be firmly out of scope with hard routing to licensed staff.",
      "FSC cloud-outsourcing requirements and PDPA obligations apply to both banking and securities customer data, and the securities side carries additional supervisory expectations.",
      "Cross-subsidiary data sharing between bank and brokerage requires an explicit legal basis under Taiwan's financial-holding customer-data rules.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 3.0,
      automationRate: 0.55,
      basis: "Seller assumptions for the banking arm of a securities-led Taiwanese financial holding; contact volumes, volatility-day multipliers and cost per contact must be validated with the bank in discovery.",
    },
    pilotScope:
      "Automate deposit, transfer-limit and settlement-account servicing on voice and LINE for the investment-active retail base, with elastic capacity proven across at least one high-volatility trading week.",
    expansion: [
      "Add fund holdings, NAV and switch servicing within suitability boundaries",
      "Extend to securities-side settlement and corporate-action enquiries as a group deployment",
      "Introduce proactive notification for settlement, corporate-action and margin events",
    ],
    stakeholders: [
      "Head of Retail Banking / Wealth Management Division",
      "Head of Customer Service Centre, Yuanta Commercial Bank",
      "Chief Information Officer, Yuanta Commercial Bank",
      "Holding-level Chief Digital Officer or group technology lead",
      "Chief Compliance Officer (FSC, suitability and PDPA liaison)",
    ],
    discovery: [
      "How much does contact volume rise on a high-volatility trading day compared with a normal day?",
      "How many customers hold both bank and brokerage accounts, and how are their enquiries handled today?",
      "What is the legal basis for sharing customer context between the bank and the securities arm?",
      "Which wealth-product enquiries can be answered without triggering suitability obligations?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "On a sharp market down-day a Yuanta customer calls to check whether his settlement account has funds for tomorrow's trade; the agent confirms the balance and pending settlement instantly instead of queueing behind a hundred similar calls.",
  },

  "kgi-bank": {
    operatingContext:
      "KGI Bank is the commercial-banking unit of KGI Financial Holding, a group whose weight sits in securities, life insurance and principal investment rather than in retail banking. The bank operates at challenger scale with a modest branch network, competing through consumer lending, credit cards, digital account products and wealth distribution rather than through deposit-gathering breadth. Its contact profile is consequently credit-and-card-shaped: application status for personal loans, card activation and statement queries, instalment and limit requests, repayment and collections conversations, and digital-account onboarding support. Customers reach it through a service centre, mobile and internet banking, a LINE official account and a small branch footprint, and because the holding's attention and technology budget flow toward the securities and insurance arms, the bank's servicing modernisation depends on what it can buy rather than what the group will build for it.",
    strategicPressure: [
      { text: "KGI Financial Holding's business mix is weighted toward securities and life insurance, so the banking unit competes for group technology attention against larger-earning affiliates.", kind: "verified" },
      { text: "Taiwan's consumer-lending and card market is crowded, making acquisition costly and per-account servicing cost a direct determinant of unit profitability.", kind: "verified" },
      { text: "Challenger-scale banks cannot fund contact-centre headcount growth in line with account growth, so containment is the only scalable path.", kind: "inference" },
      { text: "Servicing technology decisions may sit ambiguously between the bank and holding IT, which will determine deal shape and must be mapped early.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A challenger bank inside a holding focused elsewhere gets neither the budget nor the engineering headcount to build platform capability. Its technology function keeps core banking, cards and digital channels running; anything beyond that is procured. There is no signal of internal conversational AI work and no structural reason one would start. Buy-led, with a modest entry scope matched to its scale.",
    whyNotBuild:
      "KGI Bank's competitive problem is cost per serviced account, not engineering differentiation. Building speech, telephony, orchestration and evaluation would consume years of a small team's capacity to reach a capability it can rent immediately. Buying also sidesteps the FSC evidence burden, since a vendor platform brings documented controls and evaluation that the bank would otherwise have to construct and defend itself.",
    workflows: [
      {
        name: "Consumer-loan application status and disbursement servicing",
        friction: "Applicants call repeatedly to ask where their loan application stands, and each call is a manual lookup across origination and decisioning systems.",
        outcome: "Application status pushed proactively at each stage and answered on demand, eliminating the highest-volume avoidable call driver in consumer lending.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Loan origination system", "Credit decisioning", "Core banking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card activation, statement and instalment servicing",
        friction: "Routine card queries and instalment-conversion requests all require agent handling at a bank whose account base is growing faster than its service headcount.",
        outcome: "Card servicing contained automatically with instalment conversions executed within policy, holding servicing cost flat as accounts grow.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Card management system", "Billing", "Credit decisioning rules"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Early-stage repayment reminder and arrangement",
        friction: "Early-delinquency outreach is dialler-driven and capacity-limited, so many recoverable accounts are contacted late or not at all.",
        outcome: "Every early-stage account contacted in a permitted window with policy-bounded arrangements offered in-channel, reducing roll-forward into costlier buckets.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Collections system", "Core banking", "Approved arrangement matrix"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Telephone service centre covering card, lending and account enquiries",
        "Mobile and internet banking with digital account-opening functions",
        "LINE official account for transaction alerts and servicing notices",
        "Small branch network supporting wealth and complex servicing",
      ],
      gaps: [
        "Loan applicants have no proactive status communication and must call to find out",
        "Instalment conversion and limit changes cannot be completed without an agent",
        "Early-stage collections outreach reaches only a fraction of eligible accounts",
        "No shared context when a customer moves between LINE, app and phone",
      ],
    },
    risks: [
      "FSC debt-collection conduct rules govern contact timing, frequency and language in any automated repayment outreach.",
      "Consumer-protection expectations on unsecured lending require tight control over automated statements about credit terms and arrangements.",
      "Ownership ambiguity between bank IT and KGI holding IT can stall procurement, so the decision path must be confirmed before investing in a proof of concept.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 2.8,
      automationRate: 0.6,
      basis: "Seller assumptions for a challenger-scale Taiwanese bank with a consumer-credit-weighted book; volumes, cost per contact and containable share must be validated against the bank's own reporting.",
    },
    pilotScope:
      "Automate consumer-loan application status communication and card activation and statement servicing on voice and LINE, measured on containment and reduction in status-chasing calls over one quarter.",
    expansion: [
      "Add instalment-conversion and limit-request handling within a policy-bounded decision matrix",
      "Extend to early-stage repayment reminders and arrangement offers under FSC conduct rules",
      "Cover digital account-opening recovery for stalled applications",
    ],
    stakeholders: [
      "Head of Consumer Banking / Personal Lending Division",
      "Head of Credit Card Business",
      "Head of Customer Service Centre",
      "Chief Information Officer, KGI Bank",
      "Chief Compliance Officer (FSC conduct and PDPA liaison)",
    ],
    discovery: [
      "What share of inbound calls are loan-application status enquiries that a proactive update would eliminate?",
      "How many early-stage delinquent accounts are actually contacted each cycle versus how many are eligible?",
      "Do servicing technology decisions sit with the bank or with KGI holding IT?",
      "What conduct constraints apply to automated repayment outreach under current FSC guidance?",
    ],
    flowTemplate: "onboarding",
    scenario:
      "A KGI Bank loan applicant gets a LINE message the moment her application moves to approval with the disbursement date and remaining document, instead of calling three times to ask.",
  },

  "shin-kong-life": {
    operatingContext:
      "Shin Kong Life is one of Taiwan's major life insurers, carrying millions of long-duration policies sold historically through a large tied-agent force and through bancassurance, and it is now inside the Taishin and Shin Kong merger integration that combines it with Taishin Financial's businesses. Its servicing load is the classic Taiwanese life book: policy loans against cash value, premium payment and reinstatement questions, beneficiary and address changes, surrender enquiries, and claims status — all against policies whose owners are frequently elderly and whose selling agent may have left the industry years ago. Policyholders reach it through a service centre, counter service at branches, a policyholder web portal and app, and LINE notifications. Merger integration puts every service cost and every service disruption under direct board-level scrutiny.",
    strategicPressure: [
      { text: "The Taishin and Shin Kong merger is one of the largest financial-sector consolidations in Taiwan in recent years, placing integration execution under regulatory and market scrutiny.", kind: "verified" },
      { text: "Taiwan's life insurers have faced sustained pressure from interest-rate and IFRS 17 related capital considerations, keeping operating-expense discipline central.", kind: "verified" },
      { text: "Merger integration makes multi-year internal technology programmes unattractive; fast-deploying capability that shows a service-cost result inside the integration window is what gets funded.", kind: "inference" },
      { text: "Orphaned policies whose selling agent has left create a servicing population with no relationship channel, defaulting entirely to the contact centre.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Shin Kong Life's technology organisation is consumed by policy administration, actuarial and regulatory systems, and during integration by the far larger task of harmonising platforms with Taishin. Nothing about that context supports building conversational infrastructure. Merger-era organisations buy proven capability with short deployment horizons because integration risk is the dominant consideration. Buy-led.",
    whyNotBuild:
      "During a merger, every engineering hour is committed to integration and every new system must justify itself against integration risk. Building Mandarin and Hokkien speech, telephony, orchestration into policy administration, and an FSC-defensible evaluation harness would be an unfundable distraction. A bought platform can be deployed on top of existing policy systems without waiting for the integrated target architecture — which is precisely its appeal in this window.",
    workflows: [
      {
        name: "Policy loan and cash-value servicing",
        friction: "Policy-loan availability, interest accrual and repayment questions require an agent to compute from the policy record, and elderly callers often need it explained twice in Hokkien.",
        outcome: "Loan availability, balance and repayment questions answered accurately in the policyholder's language, with applications initiated in-conversation.",
        channels: ["Voice", "LINE", "Portal"],
        systems: ["Policy administration system", "Policy loan module", "Policyholder records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Premium payment, lapse prevention and reinstatement",
        friction: "Missed premiums generate letters and lapse notices rather than conversations, so policies lapse that the policyholder would have paid if reached properly.",
        outcome: "Proactive pre-lapse contact with payment completed in-channel and reinstatement guided where lapse has occurred, protecting in-force premium.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Premium billing", "Policy administration system", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Orphaned-policy servicing continuity through integration",
        friction: "Policies whose selling agent has left have no relationship channel, so every change and question lands on the contact centre with no context continuity — a problem the merger amplifies.",
        outcome: "A consistent service channel for orphaned policyholders that maintains servicing quality through integration and surfaces genuine advice needs to licensed staff.",
        channels: ["Voice", "LINE", "Portal"],
        systems: ["Policy administration system", "Agent assignment records", "Customer information file"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Policyholder service centre with Mandarin IVR routing",
        "Counter service at branch and service locations",
        "Policyholder web portal and mobile app for policy enquiry and simple changes",
        "LINE official account for premium reminders and policy notices",
      ],
      gaps: [
        "Policy-loan and cash-value questions cannot be resolved without an agent",
        "No proactive conversational contact before a policy lapses",
        "Orphaned policyholders have no relationship channel of any kind",
        "No Hokkien-capable automated servicing for an elderly policyholder base",
      ],
    },
    risks: [
      "Insurance conduct rules mean anything approaching advice on surrender, switching or coverage adequacy must route to licensed staff with a clear boundary.",
      "FSC cloud-outsourcing rules and PDPA obligations apply to policy and health-related data surfaced in servicing conversations.",
      "Merger integration may freeze or redirect platform decisions mid-cycle, so the pilot must be scoped to deliver standalone value regardless of the target architecture.",
    ],
    economics: {
      volumeMonthly: 550000,
      costPerInteraction: 3.2,
      automationRate: 0.5,
      basis: "Seller assumptions for a major Taiwanese life insurer of this in-force scale; servicing contact volume, cost per contact and containable share must be validated with the service organisation during discovery.",
    },
    pilotScope:
      "Automate policy-loan and premium-payment servicing in Mandarin and Hokkien on voice and LINE for the orphaned-policy population, measured on containment and lapse-rate change against a matched control group.",
    expansion: [
      "Extend to beneficiary, address and payment-method changes with policy-system write-back",
      "Add proactive pre-lapse outreach across the full in-force book",
      "Bring claims-status servicing and document collection onto the same platform",
    ],
    stakeholders: [
      "Head of Policyholder Service / Customer Service Division",
      "Chief Operating Officer or head of policy administration",
      "Chief Information Officer, Shin Kong Life",
      "Chief Compliance Officer (FSC insurance conduct liaison)",
      "Merger integration programme lead",
    ],
    discovery: [
      "What share of the in-force book is orphaned from its selling agent, and how are those policies serviced today?",
      "How many policies lapse each month, and what contact is attempted before lapse?",
      "Does the integration programme allow new customer-facing platform decisions in the current phase?",
      "What proportion of policyholder calls are handled in Taiwanese Hokkien?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "An elderly Shin Kong policyholder calls in Hokkien to ask how much he can borrow against his policy; the agent gives the exact available amount and interest terms and starts the loan application in the same call.",
  },

  "nan-shan-life": {
    operatingContext:
      "Nan Shan Life is one of Taiwan's largest life insurers, with millions of in-force policies and one of the biggest tied-agent forces in the market, giving it enormous servicing scale across policy loans, premium collection, beneficiary and contact changes, claims intake and status, and health and medical rider enquiries. Its policyholder base skews older and voice-first, and its agent force is itself a communication load — agents call service lines on behalf of clients for policy details, commission and case status. Nan Shan's core-system replacement programme was a widely reported and difficult undertaking, which shaped an institutional wariness about large internal technology transformations. Policyholders and agents reach the company through a service centre, counter service, a policyholder portal and app, an agent-facing system, and LINE notifications.",
    strategicPressure: [
      { text: "Nan Shan's core administration-system replacement was a prolonged and publicly reported programme that drew regulatory attention, shaping caution about large internal technology projects.", kind: "verified" },
      { text: "Taiwan's life sector operates under sustained capital and expense pressure from interest-rate exposure and international accounting standards adoption.", kind: "verified" },
      { text: "A very large tied-agent force generates a second, internal servicing load that is rarely measured alongside policyholder contact volume.", kind: "inference" },
      { text: "Post-programme wariness makes a bought, quickly-provable capability far more sellable here than any co-development proposal.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Nan Shan's recent history is the single strongest build-versus-buy signal in the Taiwan insurance set: an organisation that has lived through a painful internal transformation will not authorise another one for customer servicing. Its technology capacity is committed to stabilising and extending the administration platform. Servicing automation will be bought, evaluated on deployment speed and demonstrable control, and scoped to avoid touching the core.",
    whyNotBuild:
      "Speech, telephony, orchestration and evaluation are four specialist stacks with no internal home at Nan Shan, and the organisation's appetite for internal platform construction is at a structural low. The right to win is deploying alongside the administration system rather than inside it — reading and writing through defined interfaces, proving value in a quarter, and imposing no new core-system risk.",
    workflows: [
      {
        name: "Policy-loan and premium servicing for an aging policyholder base",
        friction: "Loan availability, premium due dates and payment-method questions dominate the service line, and elderly callers frequently need patient repetition in Hokkien.",
        outcome: "The highest-volume servicing categories handled conversationally in the policyholder's language, with transactions initiated in-channel.",
        channels: ["Voice", "LINE", "Portal"],
        systems: ["Policy administration system", "Premium billing", "Policy loan module"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims status and document collection",
        friction: "Claimants call weekly for status because updates are not pushed, and medical documents are submitted piecemeal with rejections communicated slowly.",
        outcome: "Status pushed at every stage with documents validated in-channel, removing repeat status calls and shortening claim cycle time.",
        channels: ["LINE", "Voice", "Portal"],
        systems: ["Claims administration system", "Document management", "Policy administration system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Agent-facing case and policy enquiry servicing",
        friction: "Tied agents call the service line for policy details, case progress and commission questions, consuming servicing capacity intended for policyholders.",
        outcome: "Agents self-serve case and policy status conversationally at any hour, returning contact-centre capacity to customers and improving agent productivity.",
        channels: ["LINE", "Voice", "Agent portal"],
        systems: ["Agent management system", "Policy administration system", "New business pipeline"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Large policyholder service centre with Mandarin IVR",
        "Policyholder web portal and mobile app for policy enquiry and simple changes",
        "Agent-facing systems and support lines for the tied-agent force",
        "LINE official account for premium and policy notifications",
      ],
      gaps: [
        "No conversational policy-loan or premium servicing outside agent hours",
        "Claim status is not pushed, so claimants chase repeatedly by phone",
        "Agents compete with policyholders for the same service-line capacity",
        "No Hokkien-capable automated servicing for the core elderly cohort",
      ],
    },
    risks: [
      "Health and medical information in claims conversations is sensitive data under Taiwan's PDPA, requiring strict scoping, consent and retention control.",
      "Insurance conduct rules require any advice-adjacent conversation about coverage or surrender to route to licensed staff.",
      "Institutional caution following the core-system programme means the deployment must be provably isolated from the administration platform's stability.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 3.2,
      automationRate: 0.5,
      basis: "Seller assumptions for one of Taiwan's largest life insurers by in-force policies; servicing volume, cost per contact and containable share must be validated with the service organisation before use externally.",
    },
    pilotScope:
      "Automate policy-loan availability and premium payment servicing in Mandarin and Hokkien on voice and LINE for one policy portfolio segment, deployed alongside rather than inside the administration platform.",
    expansion: [
      "Add claims-status notification and in-channel document collection",
      "Open an agent-facing self-service channel for case and policy status",
      "Extend to beneficiary, address and payment-method changes with system write-back",
    ],
    stakeholders: [
      "Head of Policyholder Service Division",
      "Head of Claims Operations",
      "Chief Information Officer, Nan Shan Life",
      "Head of Agency / Distribution Operations",
      "Chief Compliance Officer (FSC insurance conduct and PDPA liaison)",
    ],
    discovery: [
      "What share of service-line calls come from tied agents rather than policyholders?",
      "How many contacts does an average claim generate from intake to settlement?",
      "What integration surface does the administration platform expose for read and write operations?",
      "What is the organisation's current appetite for new customer-facing technology after the core programme?",
    ],
    flowTemplate: "claims",
    scenario:
      "A Nan Shan claimant uploads her hospital discharge summary on LINE, the agent validates it against the outstanding checklist, and she receives an assessment-stage update the next morning without calling.",
  },

  "taiwan-life": {
    operatingContext:
      "Taiwan Life is the life-insurance arm of CTBC Financial Holding, distributing through a tied-agent force and, significantly, through bancassurance across CTBC's large branch and wealth network. That bancassurance weighting shapes its servicing problem: a large share of policies were sold by a bank relationship manager rather than an insurance agent, and those relationship managers rotate, leaving policies effectively orphaned from any advisory relationship within a few years of sale. Those policyholders then default entirely to the contact centre for premium questions, policy loans, beneficiary changes and claims. Servicing runs through a policyholder service centre, a portal and app, LINE notifications and, for some customers, the CTBC branch that sold the policy — a route that frequently sends the customer back to insurance servicing anyway.",
    strategicPressure: [
      { text: "Taiwan Life sits inside CTBC Financial Holding, one of Taiwan's largest financial groups, giving it a bancassurance-weighted distribution mix distinct from agent-led insurers.", kind: "verified" },
      { text: "Taiwan's life sector faces continuing capital and expense pressure from interest-rate exposure and international accounting-standard adoption.", kind: "verified" },
      { text: "Bancassurance-sold policies become orphaned faster than agent-sold ones because bank relationship managers rotate roles, concentrating servicing demand on the contact centre.", kind: "inference" },
      { text: "Because the parent bank is separately covered, the insurance subsidiary's servicing operations may be assumed to be included in group platform decisions when in fact they run independently — a qualification point.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Taiwan Life's technology function runs policy administration, claims and distribution systems; group platform ambition sits with CTBC's banking organisation and does not extend to insurance servicing automation. The insurance subsidiary funds and procures its own operational technology. Buy-led, provided discovery confirms that servicing genuinely sits with the insurer rather than with a group shared-services function.",
    whyNotBuild:
      "An insurance subsidiary inside a bank-led holding has no mandate to build conversational infrastructure and no engineering pool to do it. Its problem is concrete and immediate — a large orphaned-policy population generating contact-centre load — and it needs a solution measured in weeks. A bought platform delivers that; an internal build would still be in design when the next cohort of relationship managers rotates.",
    workflows: [
      {
        name: "Orphaned bancassurance-policy servicing",
        friction: "Policyholders sold through a bank branch call the branch first, are redirected to insurance servicing, and re-explain everything to an agent with no record of the original sale context.",
        outcome: "A single service path that recognises the policy and its bancassurance origin, resolving premium, loan and change requests without the branch bounce.",
        channels: ["Voice", "LINE", "Portal"],
        systems: ["Policy administration system", "Bancassurance sales records", "Customer information file"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Premium payment and lapse prevention",
        friction: "Premium reminders are one-way notices; a policyholder with a payment problem has no conversational route and the policy drifts toward lapse.",
        outcome: "Two-way pre-lapse conversations with payment or method change completed in-channel, protecting in-force premium on the orphaned book.",
        channels: ["LINE", "Voice", "SMS"],
        systems: ["Premium billing", "Policy administration system", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims intake and status notification",
        friction: "Claims begin with a long phone call, documents are chased separately, and status is only available by calling back.",
        outcome: "Structured intake with documents validated in-channel and automatic stage updates, cutting claim-related repeat contacts.",
        channels: ["LINE", "Voice", "Portal"],
        systems: ["Claims administration system", "Document management", "Policy records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Policyholder service centre with Mandarin IVR routing",
        "Policyholder portal and mobile app for enquiry and simple changes",
        "LINE official account for premium and policy notifications",
        "CTBC bank branch network as an origination and informal service touchpoint",
      ],
      gaps: [
        "Bancassurance-sold policyholders bounce between bank branch and insurance servicing",
        "No proactive conversational contact before a policy lapses",
        "Claims status must be chased by phone",
        "No Hokkien-capable automated servicing for older policyholders",
      ],
    },
    risks: [
      "Financial-holding customer-data rules constrain how bank origination context may be joined to insurance servicing data.",
      "Insurance conduct rules require advice-adjacent conversations about coverage or surrender to route to licensed staff.",
      "PDPA obligations apply to health and claims data surfaced in servicing conversations, with strict retention limits.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 3.0,
      automationRate: 0.5,
      basis: "Seller assumptions for a bancassurance-weighted Taiwanese life insurer of this scale; servicing volumes, cost per contact and containable share must be validated with the insurer's own service organisation.",
    },
    pilotScope:
      "Automate premium payment, policy-loan and change-of-detail servicing on voice and LINE for the orphaned bancassurance population, measured on containment and branch-redirect elimination.",
    expansion: [
      "Add proactive pre-lapse outreach across the orphaned and agent-sold books",
      "Extend to claims intake with in-channel document validation and status updates",
      "Join bank origination context so branch-referred policyholders are recognised on first contact",
    ],
    stakeholders: [
      "Head of Policyholder Service Division, Taiwan Life",
      "Head of Bancassurance Channel",
      "Chief Information Officer, Taiwan Life",
      "Chief Compliance Officer (FSC insurance conduct liaison)",
      "Group customer-data governance lead, CTBC Financial Holding",
    ],
    discovery: [
      "What proportion of the in-force book was sold through bancassurance, and how many are orphaned from the selling relationship manager?",
      "How often does a policyholder contact the bank branch first and get redirected to insurance servicing?",
      "Is servicing technology procured by Taiwan Life or through a CTBC group shared-services function?",
      "What legal basis exists for joining bank origination context to insurance servicing records?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A policyholder who bought her Taiwan Life policy at a CTBC branch five years ago messages on LINE about changing her premium payment date; the agent recognises the policy, makes the change, and she never visits the branch.",
  },

  "mercuries-life": {
    operatingContext:
      "Mercuries Life is a mid-tier Taiwanese life insurer within the Mercuries group, servicing a mature in-force book built over decades through agent and broker distribution. Its operating reality is defined by scale disadvantage: it carries the same regulatory, actuarial and servicing obligations as insurers many times its size, spread over a much smaller premium base, and Taiwan's life sector capital requirements have kept expense discipline and capital strengthening at the centre of management attention. Its servicing load is conventional — premium collection and lapse handling, policy loans, beneficiary and contact changes, and claims status — but the cost of carrying a contact centre against a modest book makes per-contact cost unusually consequential. Policyholders reach it through a service centre, a policyholder portal, counter service and LINE notifications.",
    strategicPressure: [
      { text: "Taiwan's life insurers have operated under sustained capital-adequacy and accounting-standard pressure, which bears hardest on smaller and mid-tier companies.", kind: "verified" },
      { text: "A mid-tier insurer carries full regulatory and servicing infrastructure costs across a much smaller premium base than the market leaders.", kind: "inference" },
      { text: "Expense-ratio improvement is one of the few levers a capital-constrained insurer controls directly, making service-cost reduction a board-level rather than operational topic.", kind: "inference" },
      { text: "The same constraint that makes automation attractive limits how much can be spent on it, so deal sizing must start small and prove payback quickly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A capital-constrained mid-tier insurer has neither the engineering headcount nor the discretionary budget for platform construction; its technology function keeps policy administration and regulatory reporting running. Every element of a conversational stack would have to be bought regardless, and the commercial case rests entirely on demonstrable expense-ratio improvement. Buy-led, with a small entry scope.",
    whyNotBuild:
      "There is no scenario in which an insurer strengthening capital diverts funds to build speech recognition and telephony infrastructure. The right to win is a usage-priced deployment that begins on the single highest-volume workflow, shows a measurable reduction in servicing cost within a quarter, and expands only as that saving is realised — the only commercial shape this buyer can accept.",
    workflows: [
      {
        name: "Premium collection and lapse prevention",
        friction: "Missed premiums are handled by letter and by capacity-limited outbound calling, so recoverable policies lapse for want of a conversation.",
        outcome: "Every at-risk policy contacted before lapse with payment completed in-channel, protecting in-force premium at the point where it is cheapest to save.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Premium billing", "Policy administration system", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims-status and premium-servicing enquiry handling",
        friction: "Routine status and premium questions consume the majority of a small contact centre's capacity, leaving no headroom for complex cases.",
        outcome: "Routine enquiries contained automatically so the small servicing team handles only the cases that genuinely require judgement.",
        channels: ["Voice", "LINE", "Portal"],
        systems: ["Claims administration system", "Policy administration system", "Premium billing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy detail and beneficiary change processing",
        friction: "Address, contact and beneficiary changes are paper-and-counter processes that generate both a call and a physical visit for a simple data update.",
        outcome: "Straightforward policy changes completed conversationally with documentation captured in-channel, removing counter visits for routine updates.",
        channels: ["LINE", "Voice", "Portal"],
        systems: ["Policy administration system", "Document management", "Identity verification"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Policyholder service centre with Mandarin IVR",
        "Policyholder web portal for policy enquiry and forms",
        "Counter service locations for document-based transactions",
        "LINE official account for premium reminders and notices",
      ],
      gaps: [
        "No proactive conversational contact before a policy lapses",
        "Routine status enquiries consume the majority of limited service capacity",
        "Policy detail changes still require paper and counter visits",
        "No Hokkien-capable automated servicing for older policyholders",
      ],
    },
    risks: [
      "Capital-strengthening priorities may leave little or no discretionary budget, so the commercial model must be usage-priced and small at entry.",
      "Insurance conduct rules require advice-adjacent conversations to route to licensed staff with a clearly documented boundary.",
      "PDPA and FSC cloud-outsourcing obligations apply in full regardless of the insurer's size, so compliance effort does not scale down with deal size.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 3.0,
      automationRate: 0.5,
      basis: "Seller assumptions for a mid-tier Taiwanese life insurer; servicing contact volume, cost per contact and containable share must be validated against the insurer's own expense reporting.",
    },
    pilotScope:
      "Automate premium-collection and pre-lapse outreach on voice and LINE for one policy cohort, measured on lapse-rate change and premium retained against a matched control cohort.",
    expansion: [
      "Add routine claims-status and premium enquiry handling to contain inbound volume",
      "Extend to policy detail and beneficiary change processing with document capture",
      "Introduce Hokkien-language voice servicing across the older policyholder base",
    ],
    stakeholders: [
      "Head of Policyholder Service / Operations",
      "Chief Financial Officer (expense-ratio owner)",
      "Chief Information Officer, Mercuries Life",
      "Head of Claims Operations",
      "Chief Compliance Officer (FSC and PDPA liaison)",
    ],
    discovery: [
      "What is the current monthly lapse count, and what contact is attempted before lapse?",
      "What proportion of contact-centre capacity goes to routine status and premium enquiries?",
      "What discretionary operating budget exists for service technology given capital-strengthening priorities?",
      "Which policy changes could be completed without a counter visit if documentation were captured digitally?",
    ],
    flowTemplate: "retention",
    scenario:
      "A Mercuries policyholder whose premium payment failed gets a LINE message before the grace period ends, updates her bank account details in the conversation, and the policy stays in force.",
  },

  "px-mart": {
    operatingContext:
      "PX Mart is Taiwan's dominant supermarket chain, operating well over a thousand stores nationwide with a positioning built on everyday low prices and a famously frugal operating culture, and it has become the country's largest grocery retailer by store count. Its PX Pay mobile payment and loyalty app turned that store footprint into a digital membership base measured in millions, and with it came a permanent servicing load: points balances and expiry, coupon and voucher redemption failures, payment errors at the till, account and phone-number changes, and promotional-campaign questions. Its acquisition of RT-Mart added big-box formats and delivery operations, extending the contact surface into online order exceptions, substitutions and refunds. Customers reach it through in-app support, a customer service line, a LINE official account and store service counters.",
    strategicPressure: [
      { text: "PX Mart is Taiwan's largest supermarket operator by store count and acquired RT-Mart's Taiwan hypermarket business, materially expanding its scale and formats.", kind: "verified" },
      { text: "PX Pay gave the company a large digital membership base, converting a low-margin grocery operation into one that carries app-scale customer support obligations.", kind: "verified" },
      { text: "Grocery retail gross margins cannot support human-heavy support, so support cost per member is the binding constraint on how far the loyalty programme can scale.", kind: "inference" },
      { text: "RT-Mart integration doubles the service model complexity — store, app, and delivery exceptions all landing in one organisation designed for none of them.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "PX Mart's operating culture is famously cost-disciplined and merchandising-led; its technology partners and vendors build the app and payment infrastructure rather than a large internal engineering organisation. Customer support is an operational function under retail operations, funded as cost. There is no evidence of internal AI platform capability and every structural reason it would buy. Buy-led, and the loyalty scale it has created makes it one of the highest-value buy-led targets in Taiwan retail.",
    whyNotBuild:
      "A grocery retailer optimises supply chain and store labour, not speech models. Building conversational infrastructure would mean carrying engineering cost against grocery margins, for a capability that a bought platform delivers immediately at per-interaction pricing. The right to win is straightforward: PX Pay created millions of support-generating members, and only automation keeps the cost of serving them below what a basket of groceries earns.",
    workflows: [
      {
        name: "PX Pay points, coupon and payment servicing",
        friction: "Points that did not post, coupons that would not redeem and payments that failed at the till all become support contacts, and each one is a manual lookup across app and POS records.",
        outcome: "The dominant loyalty-support categories resolved automatically with corrections applied in-conversation, keeping support cost per member near zero.",
        channels: ["LINE", "In-app chat", "Voice"],
        systems: ["PX Pay loyalty platform", "POS transaction records", "Member account system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Member account and verification recovery",
        friction: "Members locked out after changing phone numbers or devices cannot recover access without a support agent, and an inaccessible wallet means a lost transaction at the till.",
        outcome: "Identity-verified account recovery completed conversationally, restoring wallet access before the member abandons the app.",
        channels: ["LINE", "In-app chat", "Voice"],
        systems: ["Member account system", "Identity verification", "PX Pay wallet platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Online grocery order exceptions and substitutions",
        friction: "Delivery and pickup orders generate substitution, missing-item and refund contacts that route to a support team designed for store-based questions.",
        outcome: "Order exceptions resolved with live order context and refunds applied within policy, protecting the delivery proposition RT-Mart integration depends on.",
        channels: ["LINE", "In-app chat", "Voice"],
        systems: ["Online order management", "Store fulfilment system", "Payment and refund processing"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "PX Pay mobile payment and loyalty app with a large member base",
        "LINE official account used for promotions and member notices",
        "Customer service line and in-app support channel",
        "Store service counters handling member and transaction issues in person",
      ],
      gaps: [
        "Points and coupon failures cannot be corrected without a support agent",
        "Account lockouts after a phone change require human verification",
        "Online order exceptions have no dedicated conversational path",
        "No unified view when a member's problem spans app, till and delivery",
      ],
    },
    risks: [
      "PX Pay handles stored-value and payment data, so any automated servicing must respect electronic-payment-institution regulatory requirements and PDPA obligations.",
      "Account recovery is a fraud-sensitive workflow; identity verification standards must be at least as strong as the current human process.",
      "A famously cost-disciplined organisation will demand hard evidence of per-contact savings before committing to anything beyond a small pilot.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 2.4,
      automationRate: 0.65,
      basis: "Seller assumptions for Taiwan's largest supermarket operator with an app-scale loyalty base; support contact volume, cost per contact and containable share must be validated against PX Mart's own support reporting.",
    },
    pilotScope:
      "Automate PX Pay points, coupon and payment-failure servicing on LINE and in-app chat, measured on containment rate and support cost per active member over one quarter.",
    expansion: [
      "Add identity-verified member account and wallet recovery",
      "Extend to online grocery order exceptions, substitutions and refunds across PX Mart and RT-Mart formats",
      "Introduce proactive campaign and points-expiry outreach to drive redemption",
    ],
    stakeholders: [
      "Head of PX Pay / Digital Business",
      "Head of Customer Service Operations",
      "Chief Information Officer / Head of Information Systems",
      "Head of E-commerce and Delivery Operations",
      "Data protection and payment-compliance officer",
    ],
    discovery: [
      "What is the monthly support contact volume per million PX Pay members, and which categories dominate?",
      "What share of contacts are points or coupon failures that could be corrected automatically?",
      "How is member identity verified today for account recovery, and could that standard be automated?",
      "How will RT-Mart's service operations be integrated, and on what timeline?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A PX Pay member messages on LINE that her points did not post from yesterday's shop; the agent finds the transaction, credits the points, and confirms the corrected balance in under a minute.",
  },

  "president-chain-store": {
    operatingContext:
      "President Chain Store Corporation operates 7-Eleven in Taiwan, running close to seven thousand stores that function as national infrastructure rather than as a convenience chain: they are where Taiwanese consumers pay utility bills, collect and send e-commerce parcels, top up transit cards, buy prepared food and redeem OPEN POINT loyalty rewards. That breadth produces an unusually diverse contact load — parcel collection and pickup-code problems, icash and OPEN POINT balance and redemption issues, bill-payment queries, food-safety and product complaints, and a parallel franchisee-support load from thousands of store operators asking about ordering, equipment, settlement and promotions. Consumers reach it through a customer service line, the OPEN POINT and 7-Eleven apps, a LINE official account and store staff, while franchisees have their own support lines and field consultants.",
    strategicPressure: [
      { text: "7-Eleven Taiwan operates one of the densest convenience-store networks in the world and serves as a primary channel for parcel pickup, bill payment and everyday services.", kind: "verified" },
      { text: "E-commerce parcel pickup at convenience stores is a structurally growing volume in Taiwan, pushing logistics-exception contacts into a retail service organisation.", kind: "verified" },
      { text: "Franchisee support is a second, largely invisible contact load whose responsiveness directly affects store-level execution across thousands of locations.", kind: "inference" },
      { text: "With loyalty, payment, parcel and food workflows spread across group subsidiaries, the hardest part of a deal here is establishing who owns customer service end-to-end.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Uni-President group runs genuine retail technology — POS, supply chain, loyalty and payment systems developed and operated at national scale — which makes this partner-led rather than purely buy-led. But conversational automation spanning parcel, loyalty, payment and franchisee workflows is not a natural extension of a retail IT organisation, and the breadth of integration required is exactly what a specialist platform supplies. The right posture is partner: deep integration into their systems, with the conversational and evaluation layer bought.",
    whyNotBuild:
      "PCSC's technology teams are fully committed to store systems, supply chain and payment infrastructure at a scale where downtime is national news. Adding Mandarin and Hokkien speech, telephony, and evaluation across four distinct workflow families would be a multi-year programme competing with store-critical systems for the same people. Buying the conversational layer and integrating it into their existing platforms gets a result in a quarter without touching store operations risk.",
    workflows: [
      {
        name: "Parcel pickup and collection-code servicing",
        friction: "Customers arrive to collect a parcel that is not there, or cannot retrieve a pickup code, and store staff have no way to resolve it beyond telling them to call.",
        outcome: "Parcel location, arrival status and pickup codes resolved conversationally before the customer walks to the store, cutting failed collection trips and counter disputes.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Parcel logistics platform", "Store inventory and receipt records", "Member account system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "OPEN POINT and icash loyalty servicing",
        friction: "Points that did not credit, expiring balances and redemption failures generate constant contacts, each requiring a manual check across loyalty and POS records.",
        outcome: "Loyalty balance, crediting and redemption issues corrected automatically, protecting engagement in a programme with national-scale membership.",
        channels: ["LINE", "App", "Voice"],
        systems: ["OPEN POINT loyalty platform", "icash stored-value system", "POS transaction records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Franchisee operations support",
        friction: "Store operators call field consultants and head-office lines for ordering, equipment, settlement and promotion questions, and answers depend on who picks up.",
        outcome: "Consistent, always-available operational answers for thousands of franchisees, freeing field consultants for store development rather than query handling.",
        channels: ["LINE", "Voice", "Store portal"],
        systems: ["Store ordering system", "Settlement and accounting", "Promotion and planogram systems"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "National customer service line covering retail, parcel and loyalty enquiries",
        "OPEN POINT and 7-Eleven mobile apps with member and service functions",
        "LINE official account used for promotions and member communication",
        "Franchisee support lines and a field consultant network",
      ],
      gaps: [
        "Parcel status and pickup-code problems cannot be resolved before the customer travels to the store",
        "Loyalty crediting and redemption failures require a support agent",
        "Franchisee answers vary by which consultant or line responds",
        "No shared context across parcel, loyalty, payment and food-service enquiries",
      ],
    },
    risks: [
      "icash stored-value operations sit under electronic-payment regulation, constraining what balance and transaction actions may be automated.",
      "Food-safety complaints must follow a defined escalation path with human handling and traceable records — automation must route, not resolve, these.",
      "Ownership of customer service is likely split across group subsidiaries, so the commercial and integration path must be mapped before a proposal is built.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 2.6,
      automationRate: 0.6,
      basis: "Seller assumptions for Taiwan's largest convenience-retail operator with parcel, loyalty and payment workflows; contact volumes, cost per contact and containable share must be validated across the relevant group subsidiaries.",
    },
    pilotScope:
      "Automate parcel pickup status and collection-code servicing on LINE and voice for the national store network, measured on failed-collection trips avoided and containment against the current service line.",
    expansion: [
      "Add OPEN POINT and icash loyalty servicing including crediting corrections",
      "Extend to franchisee operational support for ordering, settlement and promotions",
      "Bring bill-payment and prepared-food service enquiries onto the same platform",
    ],
    stakeholders: [
      "Head of Customer Service / Consumer Relations, PCSC",
      "Head of Logistics and Parcel Services business",
      "Head of OPEN POINT / Digital Membership business",
      "Chief Information Officer, President Chain Store Corporation",
      "Head of Franchise Operations / Field Consulting",
    ],
    discovery: [
      "Which subsidiary or department owns customer service across retail, parcel, loyalty and payment functions?",
      "What is the monthly volume of parcel-related contacts, and how many end in a failed store collection?",
      "How much field-consultant time is spent answering routine franchisee operational questions?",
      "What regulatory constraints apply to automating icash stored-value enquiries and adjustments?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A customer messages 7-Eleven on LINE asking whether her parcel has arrived at the Zhongshan store; the agent confirms it arrived this morning, sends the pickup code, and she collects it on her way home.",
  },

  "carrefour-taiwan": {
    operatingContext:
      "Carrefour Taiwan operates hypermarkets and smaller supermarket-format stores across the island and was acquired by Uni-President group from Carrefour, placing it alongside 7-Eleven, Starbucks Taiwan and the group's other retail assets. Its service load is hypermarket-shaped: online grocery orders with substitutions and missing items, home-delivery scheduling and failures, membership and loyalty enquiries, product-availability and promotion questions, and returns and refunds on both online and in-store purchases. The ownership transition has put service-cost rationalisation and system consolidation on the agenda at exactly the moment when online grocery is the growth channel demanding the most support. Customers reach it through a service line, a mobile app and online store, a LINE official account and store service counters.",
    strategicPressure: [
      { text: "Uni-President group acquired Carrefour's Taiwan operations, bringing the chain under a domestic owner alongside 7-Eleven and the group's other retail businesses.", kind: "verified" },
      { text: "Online grocery and home delivery generate materially more service contacts per order than in-store shopping, and that channel is where growth is concentrated.", kind: "inference" },
      { text: "Post-acquisition integration creates a window in which service platforms are being reconsidered rather than defended, which favours a fast-deploying purchase.", kind: "inference" },
      { text: "Service operations may be consolidated into group shared functions, which would change the buyer and the scope — a decisive qualification question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A hypermarket operator's technology function runs merchandising, supply chain, POS and e-commerce; conversational automation has no internal home in that structure, and integration-era organisations avoid starting new internal builds. Group-level retail IT capability exists within Uni-President but is committed to larger platforms. Buy-led, with the caveat that the buying entity may be the group rather than the chain.",
    whyNotBuild:
      "During ownership integration, management attention and capital go to harmonising systems and protecting trading performance, not to constructing a speech and telephony stack. A bought platform can sit on top of whatever the target architecture becomes and start reducing online-order support cost immediately — which is the only proposition an integration-phase retailer will entertain.",
    workflows: [
      {
        name: "Online grocery order exceptions and substitutions",
        friction: "Substituted, missing or damaged items in a delivered grocery order all become support contacts, each requiring manual reconciliation between order, picking and payment records.",
        outcome: "Order exceptions resolved with live order context and refunds or credits applied within policy inside the conversation.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Online order management", "Store picking and fulfilment", "Payment and refund processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Delivery scheduling and failed-delivery recovery",
        friction: "Missed delivery windows for perishable grocery orders generate urgent calls, and rescheduling requires coordination the service line cannot perform directly.",
        outcome: "Delivery windows confirmed, changed or recovered in-conversation before perishable orders are written off.",
        channels: ["LINE", "App", "Voice", "SMS"],
        systems: ["Delivery scheduling system", "Online order management", "Third-party logistics feeds"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Membership, promotion and returns servicing",
        friction: "Loyalty balance, promotion eligibility and return-policy questions fill the service line with repetitive, fully scriptable enquiries.",
        outcome: "Routine membership and returns questions contained automatically, leaving agents for genuine complaints and complex refunds.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Loyalty and membership platform", "POS transaction records", "Returns policy rules"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Customer service line for store and online enquiries",
        "Online store and mobile app with grocery delivery ordering",
        "LINE official account used for promotions and member notices",
        "Store service counters handling returns and membership issues",
      ],
      gaps: [
        "Online order exceptions cannot be resolved without an agent reconciling systems",
        "Failed perishable deliveries have no fast conversational recovery path",
        "Routine loyalty and returns questions consume agent capacity",
        "No shared context between online order support and in-store service counters",
      ],
    },
    risks: [
      "Consumer-protection rules on distance selling govern refund and return handling, so automated resolutions must apply statutory entitlements correctly.",
      "PDPA obligations apply to order, payment and delivery-address data surfaced in service conversations.",
      "Integration into Uni-President group shared services could relocate the buying decision mid-cycle, so the sponsor must be confirmed early.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for a Taiwanese hypermarket chain with a growing online grocery channel; contact volumes, cost per contact and containable share must be validated with the service organisation in discovery.",
    },
    pilotScope:
      "Automate online grocery order-exception and refund handling on LINE and voice for the delivery customer base, measured on containment and refund cycle time over one quarter.",
    expansion: [
      "Add delivery scheduling and failed-delivery recovery for perishable orders",
      "Extend to membership, promotion and returns servicing across store and online",
      "Align with Uni-President group service platforms for shared handling with other banners",
    ],
    stakeholders: [
      "Head of E-commerce and Omnichannel",
      "Head of Customer Service Operations",
      "Chief Information Officer / Head of IT, Carrefour Taiwan",
      "Head of Store Operations",
      "Uni-President group retail integration lead",
    ],
    discovery: [
      "What share of service contacts originate from online grocery orders versus in-store purchases?",
      "How many delivery orders per month fail or arrive incomplete, and what does each cost to resolve?",
      "Will service operations remain with Carrefour Taiwan or move into Uni-President group shared functions?",
      "What refund authority can be delegated to an automated system within current policy?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A Carrefour Taiwan delivery arrives with three substituted items; the customer messages on LINE, the agent applies the refund for the items she did not want, and no one calls the store.",
  },

  "rt-mart-taiwan": {
    operatingContext:
      "RT-Mart Taiwan operates big-box hypermarkets across the island and now sits under PX Mart ownership, making it the large-format arm of Taiwan's biggest grocery retailer. Its stores serve bulk household shopping with a service profile centred on delivery and pickup order status, refunds and returns on high-value general merchandise, membership and promotion enquiries, and product-availability questions across a much wider non-food assortment than a supermarket carries. Because the acquisition pointed toward shared infrastructure with PX Mart, its service operations sit in a transitional state where duplicated capability is being examined. Customers reach it through a service line, an online ordering channel, a LINE official account and store service counters, with membership increasingly intersecting the PX Pay ecosystem.",
    strategicPressure: [
      { text: "RT-Mart's Taiwan hypermarket business came under PX Mart ownership, consolidating two of the island's largest grocery formats under one owner.", kind: "verified" },
      { text: "Post-acquisition rationalisation makes shared servicing infrastructure with PX Mart the probable end state rather than an independent RT-Mart platform.", kind: "inference" },
      { text: "Big-box general merchandise generates higher-value refund and return contacts than grocery, with more policy judgement per case.", kind: "inference" },
      { text: "The practical route here is as an extension of a PX Mart group conversation rather than a standalone pursuit, which should govern how sales effort is allocated.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "RT-Mart Taiwan is an operating retail business, not a technology organisation, and under new ownership its systems roadmap is set by the parent rather than by itself. Any conversational capability will be bought, and most likely bought once for both banners. Buy-led, but the buying decision realistically sits at PX Mart group level.",
    whyNotBuild:
      "A hypermarket chain in the middle of an ownership consolidation has no basis for building infrastructure that the parent may replace within a year. The right to win is being the platform PX Mart selects for the group, with RT-Mart as an additional deployment surface rather than a separate sale — anything else risks building a capability that consolidation deletes.",
    workflows: [
      {
        name: "Delivery and pickup order-status servicing",
        friction: "Customers call to ask where a large-item delivery is and when it will arrive, and the answer requires an agent to check fulfilment and carrier records separately.",
        outcome: "Live order and delivery status answered on first contact with rescheduling handled in the conversation.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Online order management", "Store fulfilment", "Delivery carrier feeds"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Refund and return handling on general merchandise",
        friction: "Returns of appliances and bulk general merchandise involve policy judgement, collection arrangement and refund processing across three teams.",
        outcome: "Return eligibility determined and collection arranged in one conversation, with refunds triggered within policy and exceptions escalated with full context.",
        channels: ["LINE", "Voice", "Store counter"],
        systems: ["Returns and refunds system", "POS and order records", "Reverse logistics scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Membership and promotion enquiry handling",
        friction: "Membership, points and promotion-eligibility questions are repetitive and high-volume, and answers differ between the store counter and the service line.",
        outcome: "Consistent, instant answers on membership and promotions across channels, freeing counter staff for in-store service.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Membership platform", "Promotion engine", "POS transaction records"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Customer service line covering store and online enquiries",
        "Online ordering channel with delivery and store pickup",
        "LINE official account for promotions and member communication",
        "Store service counters handling returns, membership and complaints",
      ],
      gaps: [
        "Delivery status for large-item orders requires manual cross-system lookup",
        "Return eligibility and collection arrangement span multiple teams",
        "Membership answers are inconsistent between store counter and service line",
        "No shared service context with PX Mart despite common ownership",
      ],
    },
    risks: [
      "Distance-selling and consumer-protection rules govern refund entitlement on general merchandise, so automated decisions must apply statutory rules correctly.",
      "PDPA obligations apply to order, delivery and membership data used in service conversations.",
      "Service-operations consolidation into PX Mart may supersede any RT-Mart-specific deployment, so scope should be designed as group-extensible from the start.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for a Taiwanese hypermarket chain of this store count; contact volumes, cost per contact and containable share must be validated with the service organisation and against PX Mart group plans.",
    },
    pilotScope:
      "Automate delivery and pickup order-status servicing on LINE and voice for the online order base, designed from the outset to extend to PX Mart's own order support.",
    expansion: [
      "Add return eligibility, collection scheduling and refund processing for general merchandise",
      "Extend to membership and promotion servicing across both banners",
      "Consolidate into a single group service deployment covering PX Mart and RT-Mart",
    ],
    stakeholders: [
      "Head of Customer Service Operations, RT-Mart Taiwan",
      "Head of E-commerce and Delivery Operations",
      "Chief Information Officer / Head of IT",
      "PX Mart group integration lead",
      "Head of Store Operations",
    ],
    discovery: [
      "What is the timeline for consolidating service operations into PX Mart?",
      "How many contacts per month relate to large-item delivery status and returns?",
      "Which refund and return decisions can be delegated to an automated system within current policy?",
      "Are membership systems already being merged with PX Pay, and on what schedule?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "An RT-Mart customer messages on LINE to ask when her washing machine will be delivered and whether the old one will be taken away; the agent confirms both and shifts the slot to Saturday morning.",
  },

  "poya": {
    operatingContext:
      "Poya is Taiwan's leading domestic health, beauty and lifestyle retailer, operating hundreds of stores that combine cosmetics, personal care, household goods and seasonal merchandise in a format built for frequent, low-ticket visits, and it has extended into larger home-goods stores under the Poya Home banner. Its growth has been driven by merchandising discipline and store expansion rather than by digital channels, but a growing membership programme and app have created a steady stream of loyalty, promotion and product-availability enquiries. Customers reach it through a customer service line, a membership app, a LINE official account and store staff, and because its assortment turns over rapidly with seasonal and promotional lines, availability questions concentrate around campaign periods.",
    strategicPressure: [
      { text: "Poya has expanded consistently as Taiwan's largest domestic health-and-beauty retail chain, adding the Poya Home format to broaden its assortment.", kind: "verified" },
      { text: "Membership programme growth converts a purely transactional store business into one carrying continuing customer-service obligations.", kind: "inference" },
      { text: "Promotion-driven merchandising concentrates availability and eligibility enquiries into campaign windows that a small service team cannot flex to meet.", kind: "inference" },
      { text: "Service is likely handled by a lean central team plus store staff, meaning contact quality varies and volume is only partly visible to management.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Poya is a merchandising organisation: its competitive strength is buying, assortment and store operations, with technology procured to support POS, membership and supply chain. There is no technology organisation that would consider building conversational infrastructure, and no strategic reason to create one. Buy-led, at a scope proportionate to a retailer whose service load is real but not yet enormous.",
    whyNotBuild:
      "Every element of a conversational stack would be a first for this organisation, with no internal skills and no roadmap slot. What Poya needs is straightforward: consistent answers about membership, promotions and stock, available when customers ask rather than when a small team is free. That is a bought capability, deployed on LINE where its customers already are.",
    workflows: [
      {
        name: "Membership and points servicing",
        friction: "Points balance, tier status and reward-redemption questions go to a lean service team or to store staff mid-shift, producing slow and inconsistent answers.",
        outcome: "Instant, consistent membership answers in the customer's channel, removing routine load from both the service line and store staff.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Membership and loyalty platform", "POS transaction records", "Rewards catalogue"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Promotion eligibility and campaign enquiry handling",
        friction: "Campaign mechanics are complex and change frequently, so customers ask whether a promotion applies to their basket and get answers that differ by store.",
        outcome: "Grounded, consistent promotion explanations at campaign scale, reducing checkout disputes and store-staff interruptions.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Promotion engine", "Product master data", "Membership platform"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Product availability and store enquiry handling",
        friction: "Customers phone individual stores to ask whether a seasonal or promotional line is in stock, interrupting floor staff and producing unreliable answers.",
        outcome: "Store-level availability answered directly from inventory data, saving wasted trips and protecting store labour for selling.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Inventory management", "Store master data", "Product catalogue"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Membership programme with a mobile app",
        "LINE official account used for promotions and member communication",
        "Central customer service line",
        "Store staff handling in-person membership and product enquiries",
      ],
      gaps: [
        "Points and tier questions depend on a lean central team or store staff availability",
        "Promotion eligibility answers vary between stores",
        "No reliable store-level stock enquiry path for customers",
        "Contact volume and reasons are only partly visible to management",
      ],
    },
    risks: [
      "PDPA obligations apply to membership and purchase-history data surfaced in service conversations.",
      "Promotion terms are commercially sensitive and change frequently, so grounding must come from the live promotion engine rather than static content.",
      "A lean organisation means limited internal capacity to run a deployment, so managed operations should be part of the proposal.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 2.2,
      automationRate: 0.65,
      basis: "Seller assumptions for a Taiwanese health-and-beauty chain of this store count and membership scale; contact volume, cost per contact and containable share must be validated in discovery.",
    },
    pilotScope:
      "Automate membership, points and promotion-eligibility enquiries on the LINE official account across the full store network, measured on containment and store-staff interruption reduction.",
    expansion: [
      "Add store-level product availability enquiries grounded in inventory data",
      "Extend to Poya Home formats with their distinct assortment and delivery questions",
      "Introduce proactive points-expiry and campaign outreach to drive redemption",
    ],
    stakeholders: [
      "Head of Marketing / Membership Programme",
      "Head of Customer Service",
      "Head of Information Systems",
      "Head of Store Operations",
      "Data protection officer or equivalent compliance owner",
    ],
    discovery: [
      "What is the current monthly contact volume, and how much of it is absorbed informally by store staff?",
      "How many membership enquiries relate to points balances and reward redemption?",
      "Can store-level inventory be exposed reliably enough to answer availability questions?",
      "Who would own day-to-day operation of an automated service channel?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "A Poya member asks on LINE whether her points cover a reward item and whether the Kaohsiung store has it in stock; both answered in one exchange, and she goes straight to the shelf.",
  },

  "watsons-taiwan": {
    operatingContext:
      "Watsons Taiwan is the local arm of A.S. Watson's health-and-beauty retail business, operating hundreds of drugstores across the island with a strong membership programme, an active e-commerce channel and click-and-collect fulfilment that links the two. Its service load blends retail and pharmacy-adjacent enquiries: online order status and click-and-collect readiness, returns and refunds, membership points and coupon issues, promotion eligibility during the frequent campaign cycles the category runs on, and product-availability questions across stores. Customers reach it through a service line, the Watsons app and online store, a LINE official account, and store staff. Because A.S. Watson operates across many Asian markets from a Hong Kong-headquartered group, customer-experience technology standards may be set regionally rather than locally, which materially affects how a Taiwan deal can be structured.",
    strategicPressure: [
      { text: "Watsons is part of A.S. Watson, a multinational health-and-beauty retail group operating across numerous Asian and European markets under common brand and systems standards.", kind: "verified" },
      { text: "Health-and-beauty retail in Taiwan runs on high-frequency promotional cycles, which concentrate eligibility and coupon enquiries into repeated campaign peaks.", kind: "verified" },
      { text: "Click-and-collect creates a support obligation at the seam between online order and store fulfilment, where failures are most visible to the customer.", kind: "inference" },
      { text: "Regional group CX standards may constrain or entirely determine local vendor selection, making the qualification question about decision rights rather than about fit.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Neither Watsons Taiwan nor A.S. Watson regionally is in the business of building conversational AI; group technology sets standards and procures platforms centrally for deployment across markets. That makes this partner-led in shape: the opportunity is real but the path likely runs through alignment with a regional standard rather than through a purely local decision. Qualification of decision rights should precede any solution investment.",
    whyNotBuild:
      "A multi-market retail group standardises and buys rather than building market-specific infrastructure — that is the entire logic of operating one brand across many countries. Taiwan will not build its own speech and orchestration stack, and the region will not fund a Taiwan-only build. The right to win is being deployable to a regional standard while proving value in the Taiwan market first.",
    workflows: [
      {
        name: "Click-and-collect order and readiness servicing",
        friction: "Customers arrive before an order is ready or cannot confirm whether a collection is available, and the store and online systems answer differently.",
        outcome: "Order readiness and collection details confirmed conversationally before the customer travels, removing failed collection trips.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Online order management", "Store fulfilment", "Membership platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Membership points and coupon servicing",
        friction: "Points that did not credit and coupons that will not apply generate repetitive contacts across every campaign cycle.",
        outcome: "Loyalty crediting and coupon issues corrected automatically, protecting redemption in a business built on promotional frequency.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Membership and loyalty platform", "Promotion engine", "POS transaction records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Returns, refunds and product enquiry handling",
        friction: "Returns and product questions mix simple policy answers with cases needing pharmacist or specialist input, all in one undifferentiated queue.",
        outcome: "Policy and status questions contained automatically while health-related product questions route immediately to qualified staff.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Returns and refunds system", "Product catalogue", "Store staffing and pharmacy roster"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Membership programme with a mobile app and online store",
        "Click-and-collect fulfilment linking online orders to store pickup",
        "LINE official account used for campaigns and member communication",
        "Customer service line covering online and store enquiries",
      ],
      gaps: [
        "Click-and-collect readiness cannot be confirmed reliably before travelling to the store",
        "Points and coupon failures require an agent to correct",
        "Health-related product questions are not systematically routed to qualified staff",
        "Online and store service contexts are not joined for the same customer",
      ],
    },
    risks: [
      "Pharmacy and health-product enquiries must never receive automated clinical or medicinal advice; hard routing to qualified staff is mandatory.",
      "PDPA obligations apply to membership and purchase-history data, with particular care where purchases imply health conditions.",
      "A.S. Watson regional CX standards may preclude local vendor selection entirely, which must be established before solution effort is committed.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 2.3,
      automationRate: 0.6,
      basis: "Seller assumptions for a Taiwanese health-and-beauty chain of this store and membership scale; volumes, cost per contact and containable share must be validated locally and against regional group reporting.",
    },
    pilotScope:
      "Automate click-and-collect order readiness and membership points and coupon servicing on LINE for the Taiwan market, structured to demonstrate a pattern that A.S. Watson could standardise regionally.",
    expansion: [
      "Add returns and refund handling with clear routing of health-related questions to qualified staff",
      "Extend to product availability and campaign eligibility enquiries across stores",
      "Present the Taiwan deployment as a template for other A.S. Watson markets",
    ],
    stakeholders: [
      "Managing Director / General Manager, Watsons Taiwan",
      "Head of Customer Experience or Customer Service, Taiwan",
      "Head of E-commerce and Omnichannel, Taiwan",
      "Regional Chief Information Officer or CX technology lead, A.S. Watson",
      "Data protection and pharmacy compliance officer",
    ],
    discovery: [
      "Does Watsons Taiwan have authority to select customer-experience technology locally, or is it set regionally?",
      "What share of contacts relate to click-and-collect orders versus membership and promotions?",
      "How are health-product enquiries currently routed to pharmacists or qualified staff?",
      "What would a regional group evaluation of a conversational platform require, and who runs it?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A Watsons customer messages on LINE to check whether her click-and-collect order is ready at the Xinyi store; the agent confirms it is packed, applies the coupon that failed at checkout, and she collects it that evening.",
  },

  "wowprime": {
    operatingContext:
      "Wowprime is Taiwan's largest multi-brand restaurant group, operating a portfolio spanning Wang Steak, Tasty and more than a dozen other dining concepts across hundreds of locations, with brands positioned from casual dining to premium steakhouse. Its communications load is reservation-shaped and intensely peaked: booking, changing and cancelling tables, waitlist management on busy evenings, and enormous surges around Chinese New Year banquets, Mother's Day, Father's Day and Valentine's Day when a large share of annual bookings are made in a compressed window. Layered on top is a membership and points programme spanning brands, plus gift-voucher and dining-card enquiries. Customers reach it through individual restaurant phone lines, brand and group apps, online booking pages, and LINE official accounts per brand — a fragmented estate where a single group customer meets many separate front doors.",
    strategicPressure: [
      { text: "Wowprime operates a large multi-brand restaurant portfolio across Taiwan, giving it one of the biggest organised dining footprints in the market.", kind: "verified" },
      { text: "Taiwanese holiday and festival dining concentrates bookings into a handful of dates each year, creating reservation demand no restaurant phone line can absorb.", kind: "verified" },
      { text: "Reservation handling by individual restaurant staff means calls go unanswered during service hours, when demand to book is highest.", kind: "inference" },
      { text: "A fragmented per-brand channel estate means the group cannot see or serve a member consistently across its own restaurants.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Wowprime's technology footprint is POS, reservation and membership systems procured and operated to run restaurants; its organisational strength is brand development and store operations. Conversational automation is not adjacent to anything it builds, and its seasonal demand curve suits usage-based purchasing far better than fixed internal cost. Buy-led.",
    whyNotBuild:
      "Restaurant groups compete on concept, food and service execution, and their capital goes into new sites. Building speech, telephony, reservation-system orchestration and evaluation would be entirely outside the company's competence and would still leave the peak-day problem unsolved for at least a year. A bought platform can answer every Mother's Day call this year.",
    workflows: [
      {
        name: "Reservation booking, change and cancellation",
        friction: "Bookings depend on restaurant staff answering the phone during service, so calls go unanswered at exactly the times customers try to book, and cancellations go unrecorded.",
        outcome: "Every booking request answered instantly against live table availability, with cancellations captured so tables are re-released rather than lost.",
        channels: ["LINE", "Voice", "Web"],
        systems: ["Reservation management system", "Table and capacity data", "Membership platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Holiday and banquet surge handling",
        friction: "Festival booking windows generate volume many multiples of normal, and the group loses reservations simply because nobody could answer.",
        outcome: "Peak-day booking demand absorbed elastically across all brands, converting unanswered calls into confirmed covers.",
        channels: ["LINE", "Voice", "Web"],
        systems: ["Reservation management system", "Brand and menu catalogue", "Deposit and payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Membership, voucher and dining-card servicing",
        friction: "Points, gift-voucher validity and dining-card questions are handled inconsistently by restaurant staff who are not equipped to check group membership systems.",
        outcome: "Consistent group-level membership and voucher answers in the customer's channel, independent of which restaurant they contacted.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Membership and points platform", "Voucher and gift-card system", "POS records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online reservation pages and booking systems per brand",
        "LINE official accounts operated brand by brand",
        "Restaurant-level phone lines handling bookings and enquiries",
        "Group membership and points programme spanning brands",
      ],
      gaps: [
        "Reservation calls go unanswered during service hours and peak booking windows",
        "Cancellations are frequently not captured, so tables are not re-released",
        "Membership and voucher answers vary by restaurant and by staff member",
        "No group-level view of a customer who dines across multiple brands",
      ],
    },
    risks: [
      "PDPA obligations apply to reservation and membership data, including dietary or occasion notes that customers volunteer.",
      "Deposit-taking for banquet bookings involves payment handling that must follow the group's existing payment-compliance arrangements.",
      "Brand autonomy within the group can fragment the decision, so a group-level sponsor is required rather than a single brand's operator.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 2.2,
      automationRate: 0.65,
      basis: "Seller assumptions for a Taiwanese multi-brand restaurant group of this location count; reservation and enquiry volume, cost per contact and containable share must be validated with group operations in discovery.",
    },
    pilotScope:
      "Automate reservation booking, change and cancellation on LINE and voice for two brands ahead of a major festival window, measured on bookings captured that would previously have gone unanswered.",
    expansion: [
      "Extend reservation handling across all group brands with deposit capture for banquet bookings",
      "Add membership, points and voucher servicing at group level",
      "Introduce proactive booking reminders and waitlist offers to reduce no-shows",
    ],
    stakeholders: [
      "Group Chief Operating Officer or head of restaurant operations",
      "Head of Marketing / Membership Programme",
      "Head of Information Technology, Wowprime Group",
      "Brand general managers for the pilot brands",
      "Customer service operations lead",
    ],
    discovery: [
      "What proportion of reservation calls go unanswered during service hours and peak festival windows?",
      "How many bookings are made per year in the top five festival windows compared with a normal week?",
      "Are reservation systems common across brands, or does each brand run its own?",
      "Who at group level owns membership and could sponsor a cross-brand deployment?",
    ],
    flowTemplate: "appointments",
    scenario:
      "On the morning Mother's Day bookings open, a customer messages a Wowprime brand on LINE, is offered three available time slots at her nearest Wang Steak, and confirms the table while the restaurant's phone line is still engaged.",
  },

  "gourmet-master-85c": {
    operatingContext:
      "Gourmet Master operates the 85 degrees C bakery-cafe chain, a Taiwanese brand combining bakery, coffee and cake retail across a home-market store network plus substantial operations in China and the United States. Its most consequential customer communication is cake pre-ordering: birthday and celebration cakes are date-critical, customisation-heavy and emotionally loaded, and a mistaken pickup date or a lost customisation instruction is an unrecoverable service failure. Around that sit store-level enquiries about product availability, promotions and membership, plus internal store-support and franchise communications for a head office that runs lean relative to its store count. Customers reach it through store phone lines, a membership app, LINE official accounts and in-store counters, with cake orders frequently taken by hand at the counter.",
    strategicPressure: [
      { text: "Gourmet Master operates the 85 degrees C brand across Taiwan, China and the United States, exposing it to very different market conditions and cost structures simultaneously.", kind: "verified" },
      { text: "Its China business has faced sustained competitive and margin pressure in a crowded bakery and beverage market.", kind: "inference" },
      { text: "Cake pre-orders are date-critical and highly customised, so order-capture errors produce total service failures rather than degraded experiences.", kind: "inference" },
      { text: "A lean head office relative to store count means store-support communications likely consume disproportionate management attention.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Gourmet Master is a food-manufacturing and retail operator whose investment goes into production capacity, store development and product. Technology is procured for POS, membership and ordering, and margin pressure in its largest overseas market removes any appetite for discretionary platform investment. Buy-led, at a scope small enough to prove out in one market.",
    whyNotBuild:
      "A bakery chain under margin pressure has no path to funding an internal conversational platform, and its problem does not require one. What it needs is reliable, structured capture of cake pre-orders with confirmations that customers cannot misread — a bought capability deployed on LINE, where Taiwanese customers already message the brand.",
    workflows: [
      {
        name: "Cake pre-order capture and confirmation",
        friction: "Orders are taken verbally at counters or by phone with customisation details written on slips, and errors on date, message or size surface only at pickup.",
        outcome: "Structured pre-orders captured with every detail confirmed back in writing, eliminating the pickup-day failures that cost customers permanently.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Order management", "Store production scheduling", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-order change and pickup reminder handling",
        friction: "Customers who need to change a date, size or message must reach the specific store that took the order, and stores have no reliable reminder process before pickup day.",
        outcome: "Changes handled centrally against the production schedule and pickup reminders sent automatically, cutting both failed pickups and wasted production.",
        channels: ["LINE", "Voice", "SMS"],
        systems: ["Order management", "Store production scheduling", "Customer records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store product, promotion and membership enquiry handling",
        friction: "Customers phone individual stores about product availability, promotions and membership points, interrupting counter service during peak trading.",
        outcome: "Routine enquiries answered centrally in the customer's channel, returning counter staff to serving the queue in front of them.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Product catalogue", "Promotion engine", "Membership platform"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Store network with counter-based cake pre-order taking",
        "Membership programme with a mobile app",
        "LINE official account used for promotions and customer communication",
        "Store-level phone lines handling customer enquiries",
      ],
      gaps: [
        "Cake pre-orders are captured informally with no systematic written confirmation",
        "Order changes require reaching the specific store that took the order",
        "No automated pickup reminders before the collection date",
        "Routine product and membership questions interrupt counter service",
      ],
    },
    risks: [
      "Food-allergen and ingredient questions carry safety consequences and must route to trained staff rather than being answered automatically.",
      "PDPA obligations apply to order and membership data, including the personal occasion details customers share when ordering celebration cakes.",
      "Cross-market operation means the Taiwan deployment must be scoped independently of the China business's systems and constraints.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 2.2,
      automationRate: 0.6,
      basis: "Seller assumptions for a Taiwanese bakery-cafe chain of this store count; enquiry and pre-order volumes, cost per contact and containable share must be validated with Taiwan operations in discovery.",
    },
    pilotScope:
      "Automate cake pre-order capture, confirmation and change handling on LINE and voice for the Taiwan store network through one major celebration season, measured on pickup-day failure rate.",
    expansion: [
      "Add automated pickup reminders and production-schedule reconciliation",
      "Extend to store product, promotion and membership enquiry handling",
      "Evaluate replication for the overseas store networks once the Taiwan pattern is proven",
    ],
    stakeholders: [
      "General Manager, Taiwan operations",
      "Head of Store Operations",
      "Head of Marketing / Membership",
      "Head of Information Technology",
      "Food safety and quality assurance lead",
    ],
    discovery: [
      "How many cake pre-orders are taken per month, and how are customisation details recorded today?",
      "What proportion of pre-orders result in a pickup-day problem, and what does each cost in goodwill and rework?",
      "Does Taiwan decide service technology independently of the China business unit?",
      "Which enquiries must always route to trained staff on food-safety grounds?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A customer orders a birthday cake on 85 degrees C's LINE account, confirms the inscription and Saturday 3pm pickup in writing, and gets a reminder the night before — no slip, no phone call, no wrong name on the cake.",
  },

  "starlux-airlines": {
    operatingContext:
      "Starlux Airlines is Taiwan's premium full-service carrier, founded to compete on cabin quality and service refinement, and it has expanded from regional Asian routes into long-haul North American flying with a widebody fleet. Its brand promise is the product: passengers paying a premium expect service recovery that matches the cabin they booked. That makes its communication load disproportionately high-stakes — irregular operations rebooking, baggage delay and damage cases, special service requests including meals, mobility assistance and travelling minors, seat and upgrade requests, and loyalty programme enquiries — arriving across multiple time zones as the network stretches across the Pacific. Passengers reach it through a contact centre, the airline app and website, LINE and social channels, and airport counters, and a young airline's service organisation cannot be scaled by hiring at the rate its network is growing.",
    strategicPressure: [
      { text: "Starlux has expanded rapidly from a regional start-up into long-haul North American operations with widebody aircraft, stretching its service organisation across time zones.", kind: "verified" },
      { text: "The airline's entire competitive position rests on premium service quality, which makes every disruption interaction a brand test rather than a cost event.", kind: "verified" },
      { text: "A growth-stage airline directs capital to fleet, slots and network rather than to internal software platforms.", kind: "inference" },
      { text: "Premium positioning creates a genuine internal question about where AI-fronted service is acceptable and where a human must answer — this must be resolved before scope is agreed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Starlux buys its core operating systems — reservations, departure control, loyalty — as airlines do, and its technology function integrates and operates rather than builds platforms. Capital is committed to aircraft and network development. A young carrier scaling faster than it can hire service staff is the textbook buy-led profile: it needs capability now, priced per use, not an engineering programme.",
    whyNotBuild:
      "Every dollar Starlux spends builds the network that justifies its existence. Constructing multilingual speech, telephony across time zones, orchestration into a passenger service system, and an evaluation framework a premium brand could trust would take years the growth curve does not allow. Buying gives it service capacity that scales with the route map instead of with headcount — and a premium brand can only defend automation that is measurably good, which is what a platform with built-in evaluation provides.",
    workflows: [
      {
        name: "Irregular-operations rebooking for premium passengers",
        friction: "A delay or cancellation floods the contact centre and airport counters simultaneously, and premium passengers wait in the same queue as everyone else at the moment the brand promise matters most.",
        outcome: "Affected passengers contacted proactively with live rebooking options confirmed in-channel, so the recovery experience matches the cabin they paid for.",
        channels: ["App", "LINE", "Voice", "Email"],
        systems: ["Passenger service system", "Inventory and seat availability", "Disruption management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Special service request management",
        friction: "Meal preferences, mobility assistance, unaccompanied minors and other special requests are captured across email, phone and web forms, and gaps only surface at the airport.",
        outcome: "Special requests captured, validated against what the route and aircraft can actually deliver, and confirmed back to the passenger before travel.",
        channels: ["App", "LINE", "Voice", "Email"],
        systems: ["Passenger service system", "Special service request records", "Catering and ground handling interfaces"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Baggage delay and damage case handling",
        friction: "Baggage cases start at an airport counter and then go quiet, so passengers call repeatedly across time zones for a status nobody proactively provides.",
        outcome: "Case status pushed at every tracing stage in the passenger's language and channel, converting the worst service moment into a managed one.",
        channels: ["App", "LINE", "Voice", "Email"],
        systems: ["Baggage tracing system", "Passenger records", "Compensation policy rules"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Contact centre serving Taiwan and overseas markets",
        "Airline mobile app and website with booking, check-in and manage-booking functions",
        "LINE official account and social channels for passenger communication",
        "Loyalty programme with member servicing and tier benefits",
      ],
      gaps: [
        "No round-the-clock premium-grade servicing across North American and Asian time zones",
        "Disruption rebooking depends on reaching an agent or an airport counter",
        "Special service requests are not validated and confirmed back systematically",
        "Baggage case status is not proactively communicated to affected passengers",
      ],
    },
    risks: [
      "Carriage and consumer-protection obligations differ across Taiwan, the United States and other markets served, so compensation and rebooking statements must be jurisdiction-aware.",
      "PDPA and equivalent overseas privacy rules apply to passenger data, including special service requests that may reveal health or mobility information.",
      "A premium brand will define a hard line on where automation may speak for the airline; scope must be agreed with brand and service leadership up front.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 3.8,
      automationRate: 0.5,
      basis: "Seller assumptions for a growth-stage Taiwanese premium carrier; passenger contact volumes, cost per contact across markets and containable share must be validated with the airline in discovery.",
    },
    pilotScope:
      "Deploy proactive disruption notification with in-channel rebooking for one long-haul route pair across the app and LINE, measured on contact-centre volume suppressed and passenger recovery satisfaction.",
    expansion: [
      "Extend disruption handling network-wide with jurisdiction-aware compensation guidance",
      "Add special service request capture, validation and confirmation before travel",
      "Bring baggage tracing status and loyalty servicing onto the same platform",
    ],
    stakeholders: [
      "Chief Customer Officer or head of Customer Experience",
      "Head of Contact Centre / Reservations",
      "Chief Information Officer, Starlux Airlines",
      "Head of Ground Services and Airport Operations",
      "Head of Brand and Marketing (premium positioning owner)",
    ],
    discovery: [
      "How does contact volume behave during a long-haul disruption, and how long does the queue take to clear?",
      "What share of passenger contacts arrive outside Taipei working hours as the North American network grows?",
      "Where does brand leadership draw the line between AI-fronted and human-only service?",
      "How are special service requests captured and validated today, and how often do they fail at the airport?",
    ],
    flowTemplate: "travel-disruption",
    scenario:
      "A Starlux long-haul flight to Los Angeles is delayed overnight; affected business-class passengers receive rebooking options and hotel arrangements in-app before they reach the counter.",
  },

  "tigerair-taiwan": {
    operatingContext:
      "Tigerair Taiwan is the island's only pure low-cost carrier, affiliated with the China Airlines group, operating a narrowbody fleet concentrated on short-haul leisure routes to Japan, Korea and Southeast Asia. Its economics depend on a minimal service organisation, unbundled ancillary revenue and high aircraft utilisation, which means it has almost no service slack when operations break. Typhoon season is its structural problem: a single storm system across the Japan or Taiwan route network cancels multiple rotations at once, stranding thousands of price-sensitive travellers who bought non-flexible fares and now need rebooking, refunds or credit, all at once. Passengers reach it through a website and app, a small contact centre, LINE and social channels, and airport counters, and disruption queues routinely stretch for days after a major weather event.",
    strategicPressure: [
      { text: "Tigerair Taiwan operates as Taiwan's low-cost carrier within the China Airlines group, competing on fare and ancillary revenue rather than service inclusion.", kind: "verified" },
      { text: "Taiwan and its core North Asian leisure markets sit in a typhoon corridor, making weather-driven mass disruption a recurring annual event rather than an exception.", kind: "verified" },
      { text: "LCC unit economics preclude carrying service capacity for disruption peaks, so every major event produces a multi-day backlog.", kind: "inference" },
      { text: "Refund and credit processing delays after disruption are likely a larger driver of complaint volume and reputational damage than the cancellations themselves.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "An LCC's entire operating philosophy is to own as little overhead as possible: it buys reservations, distribution and operational systems and runs a lean technology function. Building conversational infrastructure is inconceivable within that cost model, and group affiliation with China Airlines does not supply it either. Buy-led, with the qualifying question being whether group procurement constrains independent vendor selection.",
    whyNotBuild:
      "The airline's cost base is its competitive weapon; adding engineering headcount to build speech and telephony would contradict the business model outright. It needs elastic capacity that costs nothing when the weather is fine and absorbs ten times normal volume when it is not — which is precisely what a usage-priced bought platform provides and an internal build never could.",
    workflows: [
      {
        name: "Typhoon-disruption rebooking at surge scale",
        friction: "A weather cancellation event produces call and message volume many multiples of capacity, and passengers wait days for a rebooking option that becomes worse as seats fill.",
        outcome: "Affected passengers contacted proactively with live rebooking options confirmed in-channel, clearing the disruption before the queue forms.",
        channels: ["App", "LINE", "Voice", "SMS"],
        systems: ["Reservation system", "Inventory and seat availability", "Disruption management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refund and travel-credit status servicing",
        friction: "Post-disruption refunds take weeks and status is unavailable, so passengers call repeatedly and escalate publicly, generating a second wave of contacts after the first.",
        outcome: "Live refund and credit status available on demand with expected timing explained, suppressing the post-disruption complaint wave.",
        channels: ["App", "LINE", "Voice", "Email"],
        systems: ["Refund processing", "Payment gateway records", "Reservation system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Ancillary purchase and booking-change servicing",
        friction: "Baggage, seat and meal add-ons and voluntary date changes generate routine contacts that a minimal service team handles slowly, losing ancillary revenue at the margin.",
        outcome: "Ancillary purchases and voluntary changes completed conversationally with payment in-channel, converting service contacts into revenue.",
        channels: ["App", "LINE", "Voice"],
        systems: ["Reservation system", "Ancillary product catalogue", "Payment processing"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Booking website and mobile app with manage-booking functions",
        "Small contact centre covering Taiwan and key overseas markets",
        "LINE official account and social channels for passenger communication",
        "Airport counter service at base and destination stations",
      ],
      gaps: [
        "No elastic capacity for disruption-driven surge volume",
        "Refund and credit status cannot be checked without contacting an agent",
        "Proactive disruption communication is limited relative to the number of passengers affected",
        "Japanese and Korean language servicing capacity is thin relative to route-network demand",
      ],
    },
    risks: [
      "Civil aviation consumer-protection rules in Taiwan, Japan and Korea impose differing obligations on disruption care and refunds, so automated statements must be jurisdiction-aware.",
      "PDPA and equivalent overseas privacy rules apply to passenger contact and payment data used in proactive outreach.",
      "China Airlines group procurement or shared-services arrangements may constrain independent platform selection and must be established early.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 2.8,
      automationRate: 0.6,
      basis: "Seller assumptions for a Taiwanese low-cost carrier of this fleet and network scale; baseline and disruption-peak contact volumes, cost per contact and containable share must be validated with the airline.",
    },
    pilotScope:
      "Deploy proactive disruption notification with in-channel rebooking and refund-status servicing on app and LINE ahead of one typhoon season, measured on contacts suppressed and rebooking completion time.",
    expansion: [
      "Add Japanese and Korean language coverage across the leisure route network",
      "Extend to ancillary purchase and voluntary booking-change servicing",
      "Introduce post-disruption refund and credit processing status across all payment channels",
    ],
    stakeholders: [
      "Head of Customer Service / Contact Centre",
      "Head of Commercial and Distribution",
      "Head of Operations Control (disruption management owner)",
      "Chief Information Officer or IT lead, Tigerair Taiwan",
      "China Airlines group procurement or shared-services contact",
    ],
    discovery: [
      "How many passengers are affected by a typical typhoon disruption event, and how long does the service backlog last?",
      "What is the current median time from disruption to a confirmed rebooking for an affected passenger?",
      "Does China Airlines group affiliation constrain independent platform procurement?",
      "What Japanese and Korean language servicing capacity exists today relative to route demand?",
    ],
    flowTemplate: "travel-disruption",
    scenario:
      "A typhoon cancels Tigerair's Taipei to Okinawa rotations; affected passengers receive rebooking options on LINE that evening and the contact centre never sees most of them.",
  },

  "lion-travel": {
    operatingContext:
      "Lion Travel is Taiwan's largest travel agency, selling group package tours, independent travel arrangements, air ticketing, hotel bookings and corporate travel through a nationwide network of retail branches, a website and app, and a substantial outbound telesales operation. Its service load spans the whole journey: pre-departure document and visa requirements, itinerary changes and payment schedules, tour-departure confirmations and briefing logistics, in-trip support when something goes wrong overseas, and post-trip issues and refunds. Its group-tour customers skew significantly older and strongly prefer phone contact and branch visits, often in Taiwanese Hokkien, while its independent-travel customers behave digitally. When an airline disruption, weather event or overseas incident occurs, every affected itinerary generates contacts simultaneously across both populations.",
    strategicPressure: [
      { text: "Lion Travel is Taiwan's largest travel agency by scale, operating across package tours, ticketing and independent travel with a nationwide branch network.", kind: "verified" },
      { text: "Taiwanese outbound travel recovered strongly post-pandemic, restoring high booking and servicing volumes across the agency sector.", kind: "verified" },
      { text: "Group-tour customers skewing older concentrate demand on voice and Hokkien-language servicing that digital channels do not address.", kind: "inference" },
      { text: "Disruption events cascade across every affected itinerary at once, producing a contact spike that branch and telephone capacity cannot absorb.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Travel agencies invest in booking, reservation and product-distribution technology, plus the retail and telesales operations that sell it. Lion Travel's technology function integrates supplier systems rather than building platforms, and its margins do not support speculative engineering. Buy-led, with a clear seasonal and event-driven demand curve that suits usage pricing.",
    whyNotBuild:
      "An agency's economics are commission-based and thin; adding a platform-engineering function would be a structural mismatch. Its problem is also acute and immediate — pre-departure coordination consumes staff time on every booking, and disruption events overwhelm capacity — so a bought deployment that starts working this season beats any internal roadmap.",
    workflows: [
      {
        name: "Pre-departure coordination and document readiness",
        friction: "Every booking requires chasing passports, visas, forms and payment instalments, and staff make repeated calls per traveller to get documents in before deadlines.",
        outcome: "Document and payment requirements chased and validated automatically in the traveller's channel, freeing consultants for selling rather than administration.",
        channels: ["LINE", "Voice", "SMS", "Email"],
        systems: ["Booking and reservation system", "Document checklist records", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Booking-change and itinerary enquiry servicing",
        friction: "Change requests and itinerary questions go to the branch or consultant who made the booking, and answers stall whenever that person is unavailable.",
        outcome: "Itinerary details and change options answered on demand in Mandarin or Hokkien, with changes executed or escalated with full booking context.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Booking and reservation system", "Supplier availability feeds", "Change and cancellation policy rules"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Disruption cascade handling across affected itineraries",
        friction: "One airline cancellation or weather event affects hundreds of itineraries at once, and staff work through them sequentially by phone while travellers call in parallel.",
        outcome: "Every affected traveller contacted proactively with the impact on their specific itinerary and the options available, absorbing the spike.",
        channels: ["LINE", "Voice", "SMS"],
        systems: ["Booking and reservation system", "Supplier disruption feeds", "Tour operations records"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Nationwide retail branch network with travel consultants",
        "Booking website and mobile app for independent travel and packages",
        "LINE official account used for promotions and traveller communication",
        "Telesales and customer service operation supporting bookings",
      ],
      gaps: [
        "Pre-departure document chasing is entirely manual and consultant-dependent",
        "Itinerary answers depend on reaching the individual consultant who made the booking",
        "No mechanism to contact every traveller affected by a disruption simultaneously",
        "No Hokkien-capable automated servicing for the older group-tour base",
      ],
    },
    risks: [
      "Travel agency regulation in Taiwan governs disclosure of tour terms, cancellation charges and traveller protections, so automated statements must be grounded in the contracted terms.",
      "PDPA obligations apply to passport, visa and traveller identity data collected during pre-departure coordination.",
      "In-trip overseas support involves safety-sensitive situations that must escalate to human staff immediately rather than being handled conversationally.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 2.6,
      automationRate: 0.55,
      basis: "Seller assumptions for Taiwan's largest travel agency across package and independent travel; booking-related contact volumes, cost per contact and containable share must be validated with operations in discovery.",
    },
    pilotScope:
      "Automate pre-departure document and payment coordination on LINE and voice for outbound group tours to one destination region, measured on consultant hours returned and on-time document completion.",
    expansion: [
      "Add itinerary enquiry and booking-change servicing in Mandarin and Hokkien",
      "Extend to disruption cascade handling across all affected itineraries",
      "Bring independent-travel and ticketing customers onto the same platform",
    ],
    stakeholders: [
      "Head of Group Tour / Outbound Product Business",
      "Head of Customer Service Operations",
      "Head of Retail Branch Network",
      "Chief Information Officer, Lion Travel",
      "Head of Tour Operations (disruption management owner)",
    ],
    discovery: [
      "How much consultant time per booking goes to chasing documents and payments?",
      "What is the contact-volume split between package-tour and independent-travel customers?",
      "How is a mass disruption handled today, and how long does it take to reach every affected traveller?",
      "What proportion of servicing conversations are conducted in Taiwanese Hokkien?",
    ],
    flowTemplate: "travel-disruption",
    scenario:
      "Two weeks before a Lion Travel group tour to Hokkaido, the agent messages each traveller on LINE with their outstanding document and the final payment date, and the consultant makes no chase calls at all.",
  },

  "eztravel": {
    operatingContext:
      "ezTravel is one of Taiwan's largest online travel agencies, selling flights, hotels, packages and domestic travel products to a digitally native customer base, and it is majority-owned by Trip.com Group. Its customers book online without assistance, which means almost every contact it receives is an exception: a booking that failed after payment, a supplier confirmation that did not arrive, a change or cancellation request against a fare or rate with restrictive terms, a refund whose status is opaque, or a disruption affecting travel already underway. Contacts arrive through a service line, in-app and web support, LINE and email, and demand peaks around holiday booking windows and whenever airline or weather disruption hits. Parent-group ownership means technology direction may flow from Trip.com's substantial platform and AI investments rather than from local decisions.",
    strategicPressure: [
      { text: "ezTravel is majority-owned by Trip.com Group, one of the largest online travel platforms globally with significant in-house technology and AI investment.", kind: "verified" },
      { text: "Online travel service contacts are overwhelmingly exception-driven, so contact volume correlates with booking failures and disruption rather than with sales.", kind: "inference" },
      { text: "Refund status opacity on cancelled travel is a disproportionate driver of repeat contacts across the OTA sector.", kind: "inference" },
      { text: "The parent may already supply or mandate service technology, so the addressable opportunity may be limited to Taiwan-specific workflows — this determines whether the account is worth pursuing at all.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "ezTravel itself is a commercial and marketing organisation on top of platform technology that increasingly comes from its parent. It will not build conversational infrastructure locally, but it may also not be free to buy it independently. That makes this partner-led and qualification-first: the question is not whether ezTravel would build, but how much of its service stack Trip.com already supplies.",
    whyNotBuild:
      "A local OTA subsidiary has neither the engineering scale nor the mandate to build speech and orchestration when its parent operates one of the world's largest travel technology platforms. The realistic right to win is Taiwan-specific: local language servicing including Hokkien, local supplier and payment integrations, and LINE as the dominant local channel — things a regional parent platform typically covers poorly.",
    workflows: [
      {
        name: "Booking-failure and confirmation recovery",
        friction: "A booking that fails after payment leaves the customer with a charge and no confirmation, and resolution requires an agent to reconcile payment, supplier and booking records.",
        outcome: "Failed bookings diagnosed and resolved in-conversation with confirmation or refund initiated immediately, removing the most damaging service failure an OTA produces.",
        channels: ["LINE", "App", "Voice", "Web chat"],
        systems: ["Booking engine", "Payment gateway records", "Supplier confirmation feeds"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Change, cancellation and refund-status servicing",
        friction: "Fare and rate rules are complex, refunds take weeks through supplier chains, and status is invisible, so customers contact repeatedly through the wait.",
        outcome: "Change eligibility explained accurately against actual fare rules and refund status available on demand, suppressing repeat contacts.",
        channels: ["LINE", "App", "Voice", "Email"],
        systems: ["Booking engine", "Fare and rate rules", "Refund processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "In-trip disruption support",
        friction: "Travellers already overseas who hit a cancellation or hotel problem need help in their own time zone, and support capacity follows Taipei hours.",
        outcome: "Round-the-clock in-trip support with booking context loaded and genuine emergencies routed immediately to human staff.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Booking engine", "Supplier disruption feeds", "Emergency escalation procedures"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online booking platform and mobile app for flights, hotels and packages",
        "Customer service line and web or in-app support channels",
        "LINE official account for promotions and customer communication",
        "Trip.com group platform capability available to the Taiwan operation",
      ],
      gaps: [
        "Failed bookings after payment require manual reconciliation by an agent",
        "Refund status is opaque to customers during the supplier processing period",
        "Support coverage does not match the time zones customers travel to",
        "No Hokkien-capable servicing for older customers booking domestic travel",
      ],
    },
    risks: [
      "Trip.com group technology standards may preclude independent local platform selection, which must be established before solution effort is committed.",
      "PDPA obligations apply to traveller identity and payment data used in booking recovery and refund conversations.",
      "Travel-agency consumer-protection rules govern cancellation and refund disclosures, so automated statements must reflect actual contracted terms.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for a Taiwanese online travel agency of this booking scale; exception-driven contact volume, cost per contact and containable share must be validated locally in discovery.",
    },
    pilotScope:
      "Automate booking-failure recovery and refund-status servicing on LINE and web chat for the Taiwan customer base, scoped explicitly around workflows the Trip.com parent platform does not already cover.",
    expansion: [
      "Add change and cancellation eligibility handling grounded in live fare and rate rules",
      "Extend to round-the-clock in-trip disruption support across destination time zones",
      "Add Hokkien-language voice servicing for domestic travel customers",
    ],
    stakeholders: [
      "General Manager, ezTravel",
      "Head of Customer Service Operations",
      "Head of Product and Technology, ezTravel",
      "Trip.com Group regional technology or platform lead",
      "Data protection and consumer-compliance officer",
    ],
    discovery: [
      "How much of ezTravel's service technology is already supplied by Trip.com Group?",
      "What share of contacts stem from booking failures after payment?",
      "What is the average number of contacts a customer makes while waiting for a refund?",
      "Does ezTravel have authority to select a local platform, and who signs it off?",
    ],
    flowTemplate: "travel-disruption",
    scenario:
      "An ezTravel customer whose hotel booking was charged but never confirmed messages on LINE; the agent finds the supplier failure, rebooks an equivalent room at the same rate, and confirms it within minutes.",
  },

  "taipower": {
    operatingContext:
      "Taiwan Power Company is the state-owned electricity monopoly, generating, transmitting and distributing power to well over ten million customer accounts covering essentially every household and business on the island. Its customer contact load is correspondingly national in scale and unusually varied: bimonthly billing enquiries and payment arrangements, rate-plan and tariff questions including time-of-use and EV charging tariffs, new connection and meter applications, and outage reporting and restoration status. Typhoons and earthquakes turn the last of these into emergency-scale events, with hundreds of thousands of households losing supply simultaneously and every one of them wanting to know when it will return. Customers reach Taipower through a national service line, regional business offices, a website and app, and convenience-store and bank payment channels, with an older and rural customer base for whom the phone and the counter remain primary.",
    strategicPressure: [
      { text: "Taipower serves more than ten million customer accounts across Taiwan as the state-owned electricity monopoly, giving it one of the largest customer bases of any organisation on the island.", kind: "verified" },
      { text: "Taipower has faced significant financial pressure from the gap between generation costs and regulated tariffs, keeping operating-cost discipline under government and public scrutiny.", kind: "verified" },
      { text: "Typhoon and seismic events produce simultaneous mass outages where call volume vastly exceeds any staffed capacity, precisely when public expectations are highest.", kind: "verified" },
      { text: "Energy-transition programmes including time-of-use tariffs, EV charging and distributed solar are adding new, explanation-heavy contact categories to an already saturated service estate.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "As a state-owned enterprise, Taipower acquires technology through formal public tender with defined specifications, audit obligations and data-handling requirements. Its engineering strength is in generation, grid and transmission, not in software platforms, and public-enterprise governance makes internal conversational AI development institutionally implausible. Buy-led, with the entire sales challenge being procurement navigation rather than build-versus-buy persuasion.",
    whyNotBuild:
      "A state utility cannot staff or justify a speech, telephony, orchestration and evaluation programme against a capital plan scrutinised by government and legislature. It also cannot afford the risk: outage communication is a public-safety-adjacent function where failure becomes a political event. A proven, referenceable platform with documented controls is the only procurable answer, and it is why the build conversation never starts here.",
    workflows: [
      {
        name: "Outage reporting and proactive restoration updates",
        friction: "During a typhoon the national service line is instantly saturated, so customers cannot report outages and receive no restoration information until power simply returns.",
        outcome: "Outage reports captured at surge scale with location-specific restoration estimates pushed proactively, converting the worst service moment into a managed one.",
        channels: ["Voice", "LINE", "App", "SMS"],
        systems: ["Outage management system", "Distribution network data", "Customer account records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Billing enquiry and payment arrangement",
        friction: "Bimonthly billing cycles generate synchronised waves of enquiries about consumption, tariff application and payment options, all handled by agents reading from billing records.",
        outcome: "Bill explanations grounded in the customer's own consumption and tariff, with payment arrangements set up in-conversation, flattening the billing-cycle spike.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Billing system", "Meter data management", "Payment and arrangement processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Tariff, EV-rate and connection application guidance",
        friction: "Time-of-use, EV charging and new-connection applications require explanation and document collection that today consumes business-office counter time.",
        outcome: "Eligibility explained and applications initiated with documents validated in-channel, cutting counter visits for application processes.",
        channels: ["Voice", "LINE", "App", "Web"],
        systems: ["Tariff and product rules repository", "Connection application workflow", "Document management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "National customer service line with Mandarin IVR routing",
        "Regional business offices providing counter service across the island",
        "Website and mobile app for billing enquiry and payment",
        "Convenience-store, bank and direct-debit payment channels",
      ],
      gaps: [
        "No capacity to absorb mass outage reporting during typhoon and seismic events",
        "Restoration estimates are not proactively communicated to affected households",
        "Bill explanations grounded in individual consumption require an agent",
        "No Hokkien-capable automated servicing despite a large rural and elderly customer base",
      ],
    },
    risks: [
      "State-enterprise data-handling and PDPA requirements impose residency, retention and audit conditions on any hosted processing of customer communications.",
      "Outage communication is a public-safety-adjacent function; incorrect restoration information carries political and safety consequences, so grounding must be strictly from the outage management system.",
      "Public tender processes are long and formally specified, requiring the engagement to be structured around procurement milestones from the outset.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 2.6,
      automationRate: 0.6,
      basis: "Seller assumptions for Taiwan's national electricity utility at this account scale; contact volumes, blended cost per contact and containable share must be validated against Taipower's own service reporting before use in any tender response.",
    },
    pilotScope:
      "Deploy outage reporting intake and proactive restoration-status notification in Mandarin and Hokkien for one distribution region across a single typhoon season, measured on reports captured and calls suppressed.",
    expansion: [
      "Extend outage handling to all distribution regions nationwide",
      "Add billing enquiry and payment arrangement servicing across the bimonthly cycle",
      "Bring tariff, EV-rate and new-connection application guidance onto the same platform",
    ],
    stakeholders: [
      "Head of Customer Service Department, Taipower",
      "Head of Distribution and Service Operations",
      "Chief Information Officer / Information Systems Department head",
      "Procurement Department lead for information systems tenders",
      "Personal data protection and information-security officer",
    ],
    discovery: [
      "What is normal monthly contact volume, and how far does it rise during a major typhoon event?",
      "Can restoration estimates from the outage management system be exposed reliably enough for customer communication?",
      "What is the procurement route and expected tender timeline for a customer-facing system of this scale?",
      "What data-residency and audit conditions apply to hosted processing of customer conversations?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "As a typhoon crosses Taiwan, a household in Hualien reports its outage on LINE in Hokkien and receives a restoration estimate for its own feeder, while the national service line stays clear for emergencies.",
  },

  "cpc-taiwan": {
    operatingContext:
      "CPC Corporation, Taiwan is the state-owned oil and gas enterprise, running refineries, the island's dominant branded fuel-station network, LPG distribution to households and businesses, and natural-gas supply, alongside petrochemical operations. Its consumer and commercial contact load spans fleet-card and corporate account servicing, station-level feedback and complaints, LPG delivery scheduling and safety enquiries, natural-gas connection and billing questions, and predictable inquiry waves every time the weekly fuel-price adjustment is announced. Customers reach it through a service line, station staff, a member and fleet-card portal, and LINE notifications, and the state-enterprise structure means every technology capability it uses arrives through public procurement rather than internal development.",
    strategicPressure: [
      { text: "CPC is a state-owned enterprise operating Taiwan's dominant fuel-station network alongside LPG and natural-gas distribution, giving it national consumer reach.", kind: "verified" },
      { text: "Taiwan's regulated fuel-price adjustment mechanism produces regular, publicly announced price changes that generate predictable customer enquiry waves.", kind: "verified" },
      { text: "LPG household delivery involves safety-sensitive scheduling and enquiry handling that cannot be left entirely to informal station and distributor contact.", kind: "inference" },
      { text: "Consumer contacts may be dispersed across stations, distributors and the central service line, so the automatable volume may be smaller than the customer base suggests — a sizing question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "State-enterprise governance means CPC specifies and tenders for technology; its engineering capability is in refining, distribution and energy operations. There is no internal software-platform function of the kind that would attempt conversational AI, and public-sector accountability strongly favours procured, auditable systems. Buy-led, with a modest scope reflecting how much contact volume is genuinely centralised.",
    whyNotBuild:
      "A state energy enterprise's capital plan is scrutinised line by line and directed at refining, storage and distribution assets. Speech, telephony, orchestration and evaluation would each require separate justification with no operational precedent. Buying through tender is the only institutionally viable path, and the workflows in question are repeatable enough that a bought platform shows results without any bespoke development.",
    workflows: [
      {
        name: "Fleet-card and corporate account servicing",
        friction: "Fleet customers call about card issues, transaction disputes, limits and statement queries, each handled manually against card and account systems.",
        outcome: "Fleet-card servicing contained conversationally with card actions and statement requests executed in-channel, protecting a commercially valuable customer segment.",
        channels: ["Voice", "LINE", "Portal"],
        systems: ["Fleet card management", "Transaction records", "Corporate account records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Price-adjustment enquiry and station information handling",
        friction: "Each announced price adjustment triggers a wave of enquiries about new prices, timing and station availability that the service line handles repetitively.",
        outcome: "Price, timing and station information answered instantly at wave scale, absorbing an entirely predictable recurring load.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Price announcement records", "Station network data", "Product information"],
        value: 2,
        complexity: 1,
      },
      {
        name: "LPG delivery scheduling and safety enquiry routing",
        friction: "Household LPG orders and safety questions are handled informally through distributors, with no consistent record or escalation standard.",
        outcome: "Delivery requests captured consistently and routed to the correct distributor, with any safety-related enquiry escalated immediately to trained staff.",
        channels: ["Voice", "LINE"],
        systems: ["LPG distribution records", "Distributor network data", "Safety escalation procedures"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "National customer service line for fuel, LPG and gas enquiries",
        "Fleet-card and member portal for corporate and consumer accounts",
        "LINE official account used for price announcements and notices",
        "Station network and LPG distributor network as informal service touchpoints",
      ],
      gaps: [
        "Fleet-card actions require an agent to perform",
        "Price-adjustment enquiry waves are handled repetitively by human agents",
        "LPG delivery requests have no consistent centrally-recorded intake",
        "No Hokkien-capable automated servicing for a broad national customer base",
      ],
    },
    risks: [
      "Any LPG or fuel safety enquiry must escalate immediately to trained personnel; automation must route, never advise, on safety matters.",
      "State-enterprise procurement and data-handling rules impose residency, audit and tender requirements on hosted conversational processing.",
      "Contact volume may be dispersed across stations and independent distributors rather than centralised, which materially affects the addressable scope.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 2.4,
      automationRate: 0.55,
      basis: "Seller assumptions for a Taiwanese state-owned energy enterprise with dispersed consumer contact; centralised contact volume, cost per contact and containable share must be validated before any business case is built.",
    },
    pilotScope:
      "Automate fleet-card servicing and price-adjustment enquiry handling on the central service line and LINE, measured on containment and agent time released across two adjustment cycles.",
    expansion: [
      "Add LPG delivery request intake with distributor routing and safety escalation",
      "Extend to natural-gas connection and billing enquiries",
      "Introduce Hokkien-language voice servicing across all consumer contact",
    ],
    stakeholders: [
      "Head of Marketing Business Division (fuel stations and fleet cards)",
      "Head of Customer Service Centre",
      "Head of LPG Business Division",
      "Chief Information Officer / Information Management Department head",
      "Procurement lead for information systems",
    ],
    discovery: [
      "How much consumer contact reaches the central service line versus stations and independent distributors?",
      "What enquiry volume follows each announced price adjustment, and over how many days?",
      "Which fleet-card actions could be delegated to an automated system within current controls?",
      "What escalation standard applies to LPG safety enquiries, and how is it enforced today?",
    ],
    flowTemplate: "inbound-service",
    scenario:
      "The evening a fuel-price adjustment is announced, hundreds of CPC customers ask on LINE what diesel will cost tomorrow and which nearby stations are open; all answered instantly while the service line stays free for fleet accounts.",
  },

  "chang-gung-memorial": {
    operatingContext:
      "Chang Gung Memorial Hospital is Taiwan's largest hospital system, affiliated with the Formosa Plastics group and operating major campuses at Linkou, Taipei, Kaohsiung, Keelung, Chiayi and elsewhere, together handling some of the highest outpatient volumes of any healthcare organisation in the world. Taiwan's national health insurance system, with low co-payments and free choice of provider, drives extraordinary outpatient throughput, so the administrative machinery around booking, registration and rescheduling operates at industrial scale. Its contact load is dominated by appointment booking against specific physicians and clinic sessions, reschedules and cancellations, registration and arrival guidance across large multi-building campuses, examination and report enquiries, and health-checkup scheduling. Patients reach it through phone reservation lines, hospital web and app booking, kiosks on site, and LINE notifications, with older patients heavily reliant on phone and often speaking Taiwanese Hokkien.",
    strategicPressure: [
      { text: "Chang Gung operates Taiwan's largest hospital system across multiple major campuses with outpatient volumes among the highest in the world.", kind: "verified" },
      { text: "Taiwan's national health insurance model, with free provider choice and low co-payments, structurally drives very high outpatient visit rates per capita.", kind: "verified" },
      { text: "At this throughput, even small percentage reductions in no-shows or misbooked slots translate into substantial recovered clinic capacity.", kind: "inference" },
      { text: "Multi-campus operation means a patient moving between Linkou and Taipei campuses navigates separate administrative processes for what feels like one hospital.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Chang Gung is genuinely strong in clinical informatics and medical research, with an established record in health data and clinical AI work — which is exactly why this is partner-led rather than buy-led. That strength lives in clinical and research computing, not in patient-communication infrastructure, and appointment operations are owned administratively. The right posture is partnering: deep integration into their hospital information systems, with the conversational and evaluation layer supplied rather than built.",
    whyNotBuild:
      "The hospital's informatics talent is committed to clinical decision support, imaging and research data — work that produces medical outcomes and publications. Building Mandarin and Hokkien speech for elderly patients, telephony for reservation lines at national scale, and a conversation-evaluation harness would deliver none of that, and would take years while the appointment lines stay saturated every morning. Partnering delivers administrative capacity now without touching clinical systems ownership.",
    workflows: [
      {
        name: "Multi-campus appointment booking and rescheduling",
        friction: "Reservation lines saturate at opening, patients cannot easily reschedule, and released slots go unfilled while other patients wait for the same physician.",
        outcome: "Booking and rescheduling handled at surge scale in Mandarin and Hokkien, with released slots offered to waiting patients automatically.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Hospital information system", "Outpatient scheduling", "Physician clinic session data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Registration, arrival and campus navigation guidance",
        friction: "Patients arriving at vast multi-building campuses call or ask staff where to register, which building to attend and what documents to bring, consuming counter capacity.",
        outcome: "Pre-visit guidance delivered proactively with campus, building and document detail, reducing arrival confusion and counter queues.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Outpatient scheduling", "Campus and clinic location data", "Patient records"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Health-checkup scheduling and preparation",
        friction: "Health-checkup packages involve multi-step booking, fasting and preparation instructions, and results follow-up, all coordinated by phone and paper.",
        outcome: "Checkup appointments booked with preparation confirmed and results-notification handled automatically, protecting a high-value service line.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Health checkup scheduling", "Preparation protocol library", "Results notification workflow"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Phone reservation lines and web and app booking across campuses",
        "On-site kiosks for registration, check-in and payment",
        "LINE official account used for appointment and results notifications",
        "Hospital information systems with strong clinical informatics capability",
      ],
      gaps: [
        "Reservation lines cannot absorb the morning booking peak",
        "Cancelled slots are not automatically offered to waiting patients",
        "No Hokkien-capable conversational booking for elderly patients",
        "Campus navigation and preparation guidance depends on staff answering questions in person",
      ],
    },
    risks: [
      "Taiwan's PDPA treats medical information as sensitive personal data, requiring explicit consent and tight scoping of what appears in any conversation or transcript.",
      "Automation must never approach clinical advice; scope has to stay administrative with hard routing to clinical staff for any symptom or treatment question.",
      "Hospital governance runs through administrative and ethics committees, which lengthens the path from agreement to production data access.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for Taiwan's largest multi-campus hospital system; appointment-related contact volume, administrative cost per contact and containable share must be validated with hospital administration in discovery.",
    },
    pilotScope:
      "Automate appointment booking and rescheduling with waiting-list backfill in Mandarin and Hokkien for the outpatient departments of one campus, measured on no-show rate and reservation-line abandonment.",
    expansion: [
      "Extend booking and rescheduling to all major campuses with cross-campus context",
      "Add registration, arrival and preparation guidance ahead of every appointment",
      "Bring health-checkup scheduling and results notification onto the same platform",
    ],
    stakeholders: [
      "Head of Hospital Administration / Superintendent's office",
      "Head of Outpatient Services and Registration",
      "Chief Information Officer / Head of Medical Informatics",
      "Personal data protection officer",
      "Head of Health Management Centre (checkup services)",
    ],
    discovery: [
      "What is the measured no-show rate by department, and how many slots go unfilled after cancellation?",
      "How many reservation-line calls are abandoned during the morning peak?",
      "What proportion of patient calls are conducted in Taiwanese Hokkien?",
      "Which administrative office owns appointment operations across campuses, and does it have a shared system of record?",
    ],
    flowTemplate: "appointments",
    scenario:
      "An elderly patient calls Chang Gung Linkou in Hokkien to move her orthopaedics appointment; the agent rebooks her with the same physician next Tuesday and offers her original slot to a waiting patient.",
  },

  "cathay-general-hospital": {
    operatingContext:
      "Cathay General Hospital is a Taipei-based hospital network affiliated with the Cathay group, operating its main Taipei hospital alongside branch hospitals and clinics, and running busy outpatient services under Taiwan's national health insurance throughput model. Its administrative contact load follows the standard Taiwanese pattern — appointment booking against named physicians and clinic sessions, rescheduling, registration guidance and report enquiries — with the distinctive addition of a substantial health-checkup business, a major revenue line for Taiwanese hospitals that carries its own scheduling, preparation-instruction and results-communication workload. Patients reach it through phone reservation lines, web and app booking, on-site kiosks and LINE notifications. Although it carries the Cathay name, the hospital is operationally distinct from the financial holding, and the relationship between them needs validating rather than assuming.",
    strategicPressure: [
      { text: "Taiwan's national health insurance model produces very high outpatient visit rates, keeping hospital appointment and registration operations under permanent load.", kind: "verified" },
      { text: "Health-checkup packages are a significant self-pay revenue line for Taiwanese hospitals, making checkup scheduling and results communication commercially as well as clinically important.", kind: "verified" },
      { text: "Reservation-line congestion at opening hours is a structural feature of Taiwanese hospital booking rather than a capacity anomaly.", kind: "inference" },
      { text: "The Cathay group affiliation may open doors or may complicate the sale depending on where technology decisions sit — this is the first thing to establish.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Hospital administration owns appointment and checkup operations and funds them as an operating cost; hospital IT runs the hospital information system and clinical applications. There is no conversational AI capability and no route by which a hospital of this scale would create one. Buy-led, with the administrative office as the buyer and a checkup-led entry as the commercially clearest wedge.",
    whyNotBuild:
      "Hospital IT capacity is committed to clinical systems where reliability is a patient-safety matter. Building speech, telephony, scheduling orchestration and evaluation would divert that team from work it cannot afford to deprioritise, for a capability available immediately as a service. Buying also keeps the deployment administrative, which is where the governance and the budget both sit.",
    workflows: [
      {
        name: "Health-checkup scheduling and preparation",
        friction: "Checkup bookings involve multi-step scheduling, fasting and preparation instructions delivered on paper, and same-day cancellations when preparation was not followed.",
        outcome: "Checkup appointments booked with preparation confirmed in-channel, protecting a high-value self-pay service line from wasted slots.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Health checkup scheduling", "Preparation protocol library", "Patient records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Results notification and follow-up booking",
        friction: "Checkup and examination results are communicated by post or by asking the patient to return, so follow-up consultations for abnormal findings are booked late or not at all.",
        outcome: "Results-ready notification with follow-up consultation booked immediately in the same conversation, closing the loop on abnormal findings.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Results reporting system", "Outpatient scheduling", "Patient records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Outpatient appointment booking and rescheduling",
        friction: "Reservation lines saturate at opening and rescheduling requires reaching an agent, so cancellations often become silent no-shows.",
        outcome: "Booking and rescheduling handled conversationally in Mandarin and Hokkien with released slots offered to waiting patients.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Hospital information system", "Outpatient scheduling", "Physician session data"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Phone reservation line and web and app appointment booking",
        "On-site registration and payment kiosks",
        "LINE official account for appointment and results-ready notifications",
        "Health management centre operating the checkup business",
      ],
      gaps: [
        "Checkup preparation instructions are not confirmed, so same-day cancellations persist",
        "Abnormal-result follow-up booking is not closed in the notification itself",
        "No Hokkien-capable conversational booking for older patients",
        "Released appointment slots are not offered to waiting patients",
      ],
    },
    risks: [
      "Medical information is sensitive personal data under Taiwan's PDPA, so results-related conversations require explicit consent and strict content scoping.",
      "Automation must never interpret results or offer clinical guidance; notification must route to clinical staff for any interpretation.",
      "Hospital committee governance lengthens approval timelines for systems touching patient data.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 2.4,
      automationRate: 0.55,
      basis: "Seller assumptions for a Taipei hospital network of this outpatient and checkup scale; contact volume, administrative cost per contact and containable share must be validated with hospital administration.",
    },
    pilotScope:
      "Automate health-checkup scheduling and preparation confirmation on LINE and voice for the health management centre, measured on same-day cancellation rate and slot utilisation.",
    expansion: [
      "Add results-ready notification with immediate follow-up consultation booking",
      "Extend to general outpatient booking and rescheduling with waiting-list backfill",
      "Bring branch hospitals and clinics onto the same platform with shared patient context",
    ],
    stakeholders: [
      "Head of Hospital Administration / Superintendent's office",
      "Head of Health Management Centre (checkup business)",
      "Head of Outpatient Services and Registration",
      "Chief Information Officer / Head of Information Management",
      "Personal data protection officer",
    ],
    discovery: [
      "What is the same-day cancellation rate on health-checkup appointments, and what causes it?",
      "How are abnormal checkup findings followed up today, and what proportion result in a booked consultation?",
      "Do Cathay group relationships help or hinder a direct hospital sale?",
      "What share of reservation-line calls are abandoned during the morning peak?",
    ],
    flowTemplate: "appointments",
    scenario:
      "A Cathay General health-checkup patient gets a LINE reminder two days before with the fasting instructions confirmed, and arrives prepared instead of being turned away and rebooked.",
  },

  "taipei-medical-university-hospitals": {
    operatingContext:
      "Taipei Medical University operates a hospital system spanning TMU Hospital, Wan Fang Hospital and Shuang Ho Hospital across the Taipei metropolitan area, combining high outpatient throughput with an unusually strong institutional commitment to medical AI, digital health and clinical research. That produces three administrative communication loads at once: everyday outpatient appointment coordination across three hospitals, international-patient services for medical-travel patients requiring English and other language support plus visa, estimate and logistics coordination, and clinical-trial participant communications including screening, scheduling and follow-up adherence. Patients reach the system through phone reservation lines, web and app booking, on-site kiosks and LINE, while international and research contacts run through dedicated offices with far less systematic tooling.",
    strategicPressure: [
      { text: "Taipei Medical University operates multiple teaching hospitals in the Taipei area and has positioned itself prominently in medical AI and digital-health research.", kind: "verified" },
      { text: "Taiwan actively promotes international medical travel, and university hospital systems compete for those self-pay patients on service responsiveness as well as clinical quality.", kind: "verified" },
      { text: "Clinical-trial recruitment and retention depend heavily on participant communication, which is typically handled manually by coordinators.", kind: "inference" },
      { text: "A strong clinical-AI identity may either open the door to partnership or cause the institution to assume administrative automation is already covered — this must be tested directly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "TMU's AI capability is real but clinical and research-oriented: it builds models and studies, not communication infrastructure. That orientation makes it a good partner rather than a passive buyer — it will want to understand and shape the system, integrate it into research workflows, and potentially publish on it — while having no intention of building speech and telephony itself. Partner-led is the accurate posture.",
    whyNotBuild:
      "Research groups build what produces research output. Administrative appointment automation produces none, and the informatics team's time is committed to clinical AI and data platforms. What TMU cannot get elsewhere is a governed conversational layer it can integrate into international-patient and trial-participant workflows — which is a partnership proposition, not a build one.",
    workflows: [
      {
        name: "Cross-hospital outpatient appointment coordination",
        friction: "Three hospitals run their own reservation processes, so a patient referred between them books each separately and reservation lines saturate independently.",
        outcome: "Booking and rescheduling handled across the system with shared patient context, and released slots offered to waiting patients.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Hospital information systems", "Outpatient scheduling", "Patient master index"],
        value: 3,
        complexity: 3,
      },
      {
        name: "International-patient enquiry and coordination",
        friction: "International enquiries arrive by email in several languages and require manual coordination of estimates, scheduling, visa letters and logistics, with slow first responses losing patients to competing destinations.",
        outcome: "Multilingual enquiries answered immediately with structured intake and coordinated scheduling, improving conversion in a competitive medical-travel market.",
        channels: ["Email", "Web chat", "Voice", "LINE"],
        systems: ["International patient office records", "Outpatient scheduling", "Estimate and billing systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Clinical-trial participant scheduling and adherence follow-up",
        friction: "Trial coordinators manually call participants for visit scheduling, reminders and adherence follow-up, and missed visits threaten data completeness.",
        outcome: "Protocol-bounded scheduling and reminders automated with any clinical question routed to coordinators, improving visit adherence and coordinator productivity.",
        channels: ["LINE", "Voice", "SMS"],
        systems: ["Clinical trial management system", "Participant records", "Visit schedule protocols"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Phone reservation lines and web and app booking across three hospitals",
        "On-site registration and payment kiosks",
        "LINE official accounts for appointment and results notifications",
        "International patient office and clinical research units with dedicated coordinators",
      ],
      gaps: [
        "Patients referred between the system's hospitals must book each separately",
        "International enquiries wait days for a first response",
        "Trial participant scheduling and reminders are entirely manual",
        "No Hokkien-capable conversational booking for older local patients",
      ],
    },
    risks: [
      "Medical and trial-participant data are highly sensitive under Taiwan's PDPA and under research ethics governance, requiring IRB approval for any trial-related deployment.",
      "Clinical-trial communications must stay strictly within protocol-defined scope, with any clinical question routed immediately to qualified coordinators.",
      "Automation must never offer clinical or treatment guidance to patients or international enquirers.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 2.5,
      automationRate: 0.55,
      basis: "Seller assumptions for a three-hospital Taipei university medical system; appointment, international and research contact volumes and cost per contact must be validated with each responsible office.",
    },
    pilotScope:
      "Automate international-patient enquiry intake and coordination in English and Mandarin with structured scheduling handoff, measured on first-response time and enquiry-to-appointment conversion.",
    expansion: [
      "Extend to cross-hospital outpatient booking and rescheduling with shared patient context",
      "Add clinical-trial participant scheduling and adherence reminders under IRB approval",
      "Introduce Hokkien-language conversational booking for the local patient base",
    ],
    stakeholders: [
      "Superintendent's office / Hospital Administration lead",
      "Director, International Medical Service Centre",
      "Director of Clinical Research / Clinical Trial Centre",
      "Chief Information Officer / Head of Medical Informatics",
      "Institutional Review Board and personal data protection officer",
    ],
    discovery: [
      "What is the current first-response time on international patient enquiries, and what is the conversion rate?",
      "Do the three hospitals share a patient master index and scheduling system, or run separately?",
      "How much coordinator time goes to trial participant scheduling and reminder calls?",
      "Does the institution's digital-health agenda already claim administrative automation, or is it purely clinical?",
    ],
    flowTemplate: "appointments",
    scenario:
      "An enquiry from an overseas patient about a TMU procedure is answered within minutes in English with an estimate range and three candidate appointment dates, instead of sitting in an inbox for three days.",
  },

  "chunghwa-post": {
    operatingContext:
      "Chunghwa Post is Taiwan's state-owned postal operator, running mail and parcel delivery, one of the island's densest branch networks, a very large postal savings business, and a simple life-insurance operation — four service lines under one roof. That combination produces a rare breadth of customer contact: parcel tracking, delivery exceptions and redelivery scheduling; postal-savings account, passbook, transfer and card enquiries from a depositor base that includes a large share of Taiwan's population; simple-insurance policy and premium questions; and counter-service enquiries about postal products, remittances and government payment services. Its customers skew older and rural more than almost any other institution in Taiwan, making counter and telephone service dominant and Taiwanese Hokkien a practical service requirement. Contact arrives through a service line, post-office counters, a website and app, and LINE notifications.",
    strategicPressure: [
      { text: "Chunghwa Post operates postal, savings and simple-insurance businesses together through the island's densest branch network, serving a very large share of the population.", kind: "verified" },
      { text: "E-commerce parcel growth has shifted the postal business mix toward parcels, bringing consumer-grade delivery-exception expectations into a state postal service.", kind: "verified" },
      { text: "An older and rural customer base concentrates demand on counter and phone service in Mandarin and Hokkien rather than on digital channels.", kind: "inference" },
      { text: "Postal, banking and insurance service lines may be organised separately, which would determine whether one deployment can serve all three — the decisive scoping question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "As a state-owned enterprise, Chunghwa Post procures technology through public tender with specified requirements and audit obligations, and its internal capability runs postal, banking and insurance operational systems rather than building platforms. Nothing about its governance or talent base supports internal conversational AI development. Buy-led, with the workflow breadth making the entry-point choice more consequential than the build-versus-buy question.",
    whyNotBuild:
      "A state postal operator's capital programme is directed at logistics capacity, branch systems and banking compliance. Constructing speech, telephony, orchestration across three regulated service lines, and an evaluation framework would be indefensible in a public tender-based governance model. Buying a proven platform and starting with parcel tracking — the least regulated and highest-volume workflow — is both the procurable and the operationally sensible path.",
    workflows: [
      {
        name: "Parcel tracking and redelivery scheduling",
        friction: "Failed deliveries leave a slip and the recipient must call the local office or visit to collect, with no reliable way to reschedule into a convenient window.",
        outcome: "Redelivery windows and collection-point changes arranged conversationally, cutting both failed attempts and counter collection queues.",
        channels: ["Voice", "LINE", "App", "SMS"],
        systems: ["Parcel tracking system", "Delivery office scheduling", "Recipient records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Postal-savings account servicing",
        friction: "Balance, transaction, passbook and card enquiries from a very large depositor base fill counters and the phone line, largely from customers who do not use digital channels.",
        outcome: "Everyday savings enquiries handled conversationally in Mandarin and Hokkien, releasing counter capacity across the branch network.",
        channels: ["Voice", "LINE"],
        systems: ["Postal savings core system", "Account and transaction records", "Card management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Simple-insurance policy and premium servicing",
        friction: "Policy, premium and claim-status questions on simple life products are handled at counters and by phone with the same staff serving postal and savings customers.",
        outcome: "Insurance servicing separated and automated with claims and premium status answered directly, removing a third load from shared counter capacity.",
        channels: ["Voice", "LINE"],
        systems: ["Insurance policy administration", "Premium billing", "Claims records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Dense national post-office branch network providing counter service for all four business lines",
        "Parcel tracking website and mobile app",
        "Customer service line covering postal, savings and insurance enquiries",
        "LINE official account for delivery and service notifications",
      ],
      gaps: [
        "Redelivery cannot be scheduled end-to-end without calling or visiting a delivery office",
        "Savings enquiries require counter or phone service for a largely non-digital customer base",
        "Insurance servicing shares capacity with postal and banking counters",
        "No Hokkien-capable automated servicing despite a heavily Hokkien-speaking customer base",
      ],
    },
    risks: [
      "Postal savings and simple insurance are financially regulated, so those workflows carry FSC-adjacent supervisory expectations and stricter data handling than the parcel business.",
      "State-enterprise procurement and data-residency requirements govern any hosted processing of customer communications.",
      "Serving three regulated business lines from one deployment requires clear separation of data and permissions, which must be designed rather than retrofitted.",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 2.4,
      automationRate: 0.55,
      basis: "Seller assumptions for Taiwan's state postal operator across parcel, savings and insurance service lines; contact volumes, cost per contact and containable share must be validated with each business line in discovery.",
    },
    pilotScope:
      "Automate parcel tracking and redelivery scheduling in Mandarin and Hokkien on voice and LINE for two delivery regions, deliberately chosen as the least regulated wedge into the wider service estate.",
    expansion: [
      "Extend redelivery and tracking nationwide with proactive exception notification",
      "Add postal-savings account servicing under the appropriate financial-service controls",
      "Bring simple-insurance policy, premium and claims-status servicing onto the same platform",
    ],
    stakeholders: [
      "Head of Mail and Parcel Business Department",
      "Head of Savings and Remittance Business Department",
      "Head of Customer Service",
      "Chief Information Officer / Information Management Department head",
      "Procurement lead for information systems tenders",
    ],
    discovery: [
      "Do postal, savings and insurance share one contact-centre organisation or run separately?",
      "What is the monthly volume of failed deliveries and redelivery requests?",
      "What proportion of savings enquiries reaching counters could be answered from account data alone?",
      "What supervisory approvals are required before automating financial-service conversations?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A rural recipient who missed a Chunghwa Post delivery messages on LINE in Hokkien, reschedules for Saturday morning, and avoids the trip to the delivery office entirely.",
  },

  "t-cat-taiwan-pelican": {
    operatingContext:
      "Taiwan Pelican Express, known universally as the black-cat T-cat service and built on Yamato Transport lineage, is Taiwan's leading home-delivery brand, differentiated by time-window delivery commitments and a substantial cold-chain business carrying chilled and frozen goods for food retailers, e-commerce sellers and direct consumers. Those two characteristics make its service failures unusually costly: a missed time window breaks the promise customers pay a premium for, and a cold-chain delay does not merely delay a parcel but destroys the goods inside it. Its contact load is therefore exception-heavy and urgent — window changes, missed-attempt rescheduling, cold-chain delay enquiries, address corrections and damage claims — arriving from both recipients and the shippers who pay for the service. Contacts come through a customer service line, a tracking website and app, LINE notifications and, informally, the delivery driver's own phone.",
    strategicPressure: [
      { text: "T-cat is Taiwan's leading home-delivery brand with a Yamato-derived operating model built on time-window delivery and cold-chain capability.", kind: "verified" },
      { text: "Cold-chain delivery failures are unrecoverable — the goods are lost, not merely delayed — making proactive delay notification directly valuable to both shipper and recipient.", kind: "verified" },
      { text: "Time-window promises are the brand's premium differentiator, so window failures damage pricing power rather than just satisfaction scores.", kind: "inference" },
      { text: "Much exception handling likely happens informally through driver mobile contact, so the true contact volume and its cost are only partly visible to management.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "T-cat is a delivery operator whose investment goes into cold-chain fleet, terminals and route capability. Its technology function operates tracking, dispatch and scanning systems procured to support those operations. There is no conversational AI capability and no reason to develop one, and its Yamato heritage brings a service-quality orientation that makes it receptive to tooling that improves measurable delivery outcomes. Buy-led.",
    whyNotBuild:
      "Cold-chain capacity and route density are where this company's capital earns a return. Building speech, telephony, tracking-system orchestration and conversation evaluation would consume years for a capability it can buy now — and the problem it faces is immediate, since every cold-chain delay that goes unannounced today is a claim tomorrow. Bought automation converts an unmeasured informal process into a managed, instrumented one.",
    workflows: [
      {
        name: "Proactive cold-chain and time-window delay notification",
        friction: "When a route falls behind, nobody tells the recipient; the first they know is a missed window or a thawed delivery, and then a claim.",
        outcome: "Delay detected at route level and pushed to affected recipients with a revised window or a diversion option, preventing losses rather than compensating them.",
        channels: ["LINE", "SMS", "Voice"],
        systems: ["Route and dispatch system", "Scan and tracking events", "Cold-chain monitoring"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Delivery-window change and missed-attempt rescheduling",
        friction: "Recipients call the service line or the driver directly to change a window, and the change may or may not reach the dispatch record.",
        outcome: "Window changes captured centrally against live route capacity so the dispatch record and the customer's expectation always match.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Route and dispatch system", "Delivery scheduling", "Recipient records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Shipper-side exception and claim handling",
        friction: "Shippers escalate the same delivery exceptions their own customers raised, so the same incident is worked twice with no shared record, and claims are opened by email.",
        outcome: "Shipper and recipient contacts joined on the same consignment with structured claim intake, removing duplicated handling and speeding settlement.",
        channels: ["Voice", "Email", "Shipper portal"],
        systems: ["Consignment records", "Claims workflow", "Shipper contract records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Parcel tracking website and mobile app with scan-event history",
        "Customer service line for recipients and shippers",
        "LINE and SMS delivery notifications including time-window confirmations",
        "Shipper-facing booking and consignment systems",
      ],
      gaps: [
        "No proactive notification when a route falls behind on a cold-chain delivery",
        "Window changes made with the driver do not reliably reach the dispatch record",
        "Shipper and recipient contacts about the same incident are handled separately",
        "Claims are opened by email with no automatic status communication",
      ],
    },
    risks: [
      "PDPA limits use of recipient contact details supplied by shippers, so proactive outreach must stay within delivery purpose and consented channels.",
      "Cold-chain claim decisions carry contractual liability and must remain human-decided, with automation limited to intake and status.",
      "Informal driver-mediated exception handling means automation must be designed with driver cooperation, or it will be bypassed operationally.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for a leading Taiwanese home-delivery operator with cold-chain volume; exception contact counts, cost per contact and containable share must be validated against the operator's own reporting.",
    },
    pilotScope:
      "Deploy proactive delay notification with in-channel window rescheduling for cold-chain routes in two metropolitan regions, measured on cold-chain claim rate and avoided failed deliveries.",
    expansion: [
      "Extend proactive notification and window rescheduling to the full delivery network",
      "Add address correction and missed-attempt recovery with dispatch write-back",
      "Join shipper-side escalation and structured claim intake to the same consignment context",
    ],
    stakeholders: [
      "Head of Delivery Operations",
      "Head of Customer Service",
      "Head of Cold Chain Business",
      "Chief Information Officer / Head of Information Systems",
      "Head of Shipper Sales and Account Management",
    ],
    discovery: [
      "How many cold-chain deliveries per month miss their window, and what does each failure cost in claims and goodwill?",
      "How much exception handling happens informally through driver mobile contact rather than the service line?",
      "Can the dispatch system accept externally-initiated window changes?",
      "What share of exception contacts originate from shippers rather than recipients?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A T-cat cold-chain route runs ninety minutes late; affected recipients get a LINE message with a revised window and a one-tap option to redirect to a nearby pickup point before anything thaws.",
  },

  "kerry-tj-logistics": {
    operatingContext:
      "Kerry TJ Logistics is one of Taiwan's largest trucking and distribution networks, affiliated with Kerry Logistics, operating B2B freight and distribution alongside a growing consumer parcel business built on e-commerce volume. Its historical customer was a shipper — a manufacturer, retailer or distributor moving pallets and cases — served through account managers, operations desks and EDI integrations. E-commerce growth has added a second customer type that the organisation was not built for: individual consumers who expect real-time tracking, self-service rescheduling and instant answers about a parcel the company is delivering on behalf of someone else. Contacts therefore arrive from both directions on the same shipments, through a customer service line, a tracking site, account managers and, increasingly, consumer messaging channels.",
    strategicPressure: [
      { text: "Kerry TJ Logistics operates one of Taiwan's largest trucking and distribution networks with both B2B freight and consumer parcel operations.", kind: "verified" },
      { text: "E-commerce parcel growth in Taiwan imposes consumer-grade service expectations on operators whose service organisations were designed for B2B shippers.", kind: "verified" },
      { text: "Serving two customer types with one service organisation produces inconsistent handling: shippers get account managers, consumers get a queue.", kind: "inference" },
      { text: "Consumer contact volume is likely growing faster than the service organisation's capacity to absorb it, making automation a timing question rather than an efficiency one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Freight and distribution companies buy their customer-facing technology; their engineering investment goes into transport management, warehousing and fleet systems. Kerry TJ has no conversational AI capability and no strategic reason to develop one, and its parent's regional systems are logistics-oriented rather than service-automation platforms. Buy-led.",
    whyNotBuild:
      "A trucking network's returns come from utilisation, density and warehouse throughput, not from software platforms. Building speech, telephony, transport-system orchestration and evaluation would be an entirely novel undertaking for the organisation with no supporting skills. Buying gives it consumer-grade service on top of the B2B systems it already runs — which is precisely the gap e-commerce growth has opened.",
    workflows: [
      {
        name: "Consumer parcel status and delivery-exception handling",
        friction: "Consumers call a service line built for shippers to ask where their parcel is and to reschedule, and get slow answers from staff working B2B tools.",
        outcome: "Consumer status and rescheduling handled instantly in messaging channels, matching e-commerce expectations without adding consumer-service headcount.",
        channels: ["LINE", "Voice", "Web"],
        systems: ["Transport management system", "Parcel tracking", "Delivery dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Shipper operations enquiry servicing",
        friction: "Shipper operations teams call account managers and operations desks for shipment status, proof of delivery and booking confirmation, consuming account-management time on lookups.",
        outcome: "Shipper operational enquiries self-served conversationally with live shipment and POD data, returning account managers to commercial work.",
        channels: ["Voice", "Email", "Shipper portal"],
        systems: ["Transport management system", "Proof of delivery records", "Shipper account records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Delivery exception and damage claim intake",
        friction: "Exceptions and damage claims are raised by phone and email from both shippers and consumers, with no structured intake and no automatic status.",
        outcome: "Structured claim and exception intake with automatic status updates, cutting repeat chasing from both customer types.",
        channels: ["LINE", "Voice", "Email"],
        systems: ["Claims workflow", "Scan and tracking history", "Shipper contract records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Shipment and parcel tracking through web and system integrations",
        "Customer service line handling shipper and consumer enquiries",
        "Account managers and operations desks serving B2B shippers",
        "Delivery dispatch and transport management systems",
      ],
      gaps: [
        "Consumers have no self-service rescheduling or messaging-based support path",
        "Shipper operational questions consume account-manager time",
        "Exceptions and claims have no structured intake or automatic status",
        "One service organisation serves two customer types with one handling model",
      ],
    },
    risks: [
      "PDPA limits use of consumer contact data supplied by shippers, so consumer outreach must be scoped to delivery purpose and consented channels.",
      "Freight contracts define liability and claim terms per shipper, so claim handling must be grounded in the specific contract rather than a generic policy.",
      "Serving both B2B and consumer populations from one deployment requires distinct permissions and data separation by design.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for a Taiwanese freight and parcel operator of this network scale; shipper and consumer contact volumes, cost per contact and containable share must be validated in discovery.",
    },
    pilotScope:
      "Automate consumer parcel status and delivery-exception handling on LINE and voice for the e-commerce parcel base, measured on containment and repeat-contact rate over one quarter.",
    expansion: [
      "Add shipper operational enquiry self-service for status, booking and proof of delivery",
      "Extend to structured exception and damage claim intake with automatic status",
      "Join shipper and consumer contacts on the same shipment record to remove duplicated handling",
    ],
    stakeholders: [
      "Head of Parcel and Consumer Delivery Business",
      "Head of Customer Service Operations",
      "Head of Freight and Distribution Sales",
      "Chief Information Officer / Head of Information Systems",
      "Operations lead for dispatch and delivery network",
    ],
    discovery: [
      "What is the split of contact volume between B2B shippers and individual consumers, and how is it trending?",
      "How much account-manager time goes to operational status lookups?",
      "Can the transport management system accept externally-initiated delivery reschedules?",
      "How are damage claims currently intake-ed and tracked across shipper contracts?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A consumer expecting a Kerry TJ delivery messages on LINE to move it to Saturday; the reschedule writes back to dispatch and no one calls the shipper's own customer service line.",
  },

  "momo-taiwan": {
    operatingContext:
      "momo.com is Taiwan's largest business-to-consumer e-commerce platform, linked to the Fubon and Taiwan Mobile group, and it built its position on breadth of assortment combined with a fast-delivery promise supported by its own network of satellite warehouses. That operating model makes logistics exceptions unusually brand-critical: the proposition is speed, so a late or failed delivery is a direct breach of the reason customers chose momo. Its service load scales with order volume and spikes violently during Double-11, year-end and other major sale events, dominated by order status, delivery exceptions, returns and refunds, product and warranty questions, and payment and invoice issues. Customers reach it through in-app and web support, a customer service line, and LINE, and its scale means even a small percentage of orders generating a contact produces enormous absolute volume.",
    strategicPressure: [
      { text: "momo is Taiwan's largest B2C e-commerce platform, with a fast-delivery proposition supported by a distributed satellite-warehouse network.", kind: "verified" },
      { text: "Coupang's entry into Taiwan and continued competition from PChome and Shopee keep pressure on both delivery speed and service cost.", kind: "verified" },
      { text: "Mega sale events multiply order volume and therefore exception contacts far beyond any staffed service capacity.", kind: "inference" },
      { text: "Group AI initiatives at Taiwan Mobile may or may not claim momo's service-automation roadmap, which must be established before the opportunity can be sized.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "momo runs real commerce engineering — its platform, logistics orchestration and warehouse systems are built and operated in-house at national scale. That capability makes it partner-led rather than buy-led: it will integrate deeply and will want to own the customer experience layer. But conversational service AI, including speech, telephony and evaluation, is not on its build path, and buying that layer lets its engineers stay on the commerce and logistics work that determines competitive position.",
    whyNotBuild:
      "Every engineering hour momo spends is contested by delivery-speed and platform work in a market where Coupang is competing on exactly those dimensions. Diverting people to build a speech and telephony stack would be strategically inverted. The right to win is supplying the conversational infrastructure that plugs into their order and logistics systems, so their teams get service automation without giving up a single sprint on delivery.",
    workflows: [
      {
        name: "Sale-event order and delivery-exception servicing",
        friction: "During Double-11 and year-end events, order volume and exception contacts spike simultaneously and the service organisation cannot flex, so queues and response times collapse.",
        outcome: "Peak-event exception volume absorbed elastically with live order and logistics context, protecting the fast-delivery promise when it is most tested.",
        channels: ["LINE", "In-app chat", "Voice"],
        systems: ["Order management", "Warehouse and logistics orchestration", "Carrier tracking feeds"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Returns and refund processing",
        friction: "Return eligibility, pickup arrangement and refund timing involve several systems and policy rules, so each return generates multiple contacts across its lifecycle.",
        outcome: "Return eligibility determined, pickup arranged and refund status communicated automatically, collapsing a multi-contact process into one conversation.",
        channels: ["LINE", "In-app chat", "Voice"],
        systems: ["Returns and refunds system", "Reverse logistics scheduling", "Payment processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Proactive delivery-risk notification",
        friction: "When a delivery is going to miss its promised window, the customer discovers it by waiting, then contacts support, generating a contact that could have been prevented.",
        outcome: "Delivery risk detected and communicated before the customer notices, with options offered in-channel, suppressing the largest avoidable contact category.",
        channels: ["LINE", "App push", "SMS"],
        systems: ["Logistics orchestration", "Carrier tracking feeds", "Order management"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "E-commerce platform with in-app and web self-service order management",
        "Customer service line and in-app support channels",
        "LINE official account used for order notifications and promotions",
        "Own satellite-warehouse and logistics network with real-time order tracking",
      ],
      gaps: [
        "Service capacity cannot flex to sale-event exception volume",
        "Returns generate multiple contacts across eligibility, pickup and refund stages",
        "Delivery risk is not communicated before the customer experiences the failure",
        "No unified conversation context across app, LINE and phone for the same order",
      ],
    },
    risks: [
      "Distance-selling consumer-protection rules govern return and refund entitlements, so automated decisions must apply statutory rights correctly.",
      "PDPA obligations apply to order, payment and delivery data surfaced in service conversations.",
      "Taiwan Mobile group AI initiatives may claim this roadmap; the ownership of service automation must be confirmed before pursuit.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 2.3,
      automationRate: 0.65,
      basis: "Seller assumptions for Taiwan's largest B2C e-commerce platform; order-related contact volumes, cost per contact and containable share must be validated with momo's own service reporting.",
    },
    pilotScope:
      "Deploy proactive delivery-risk notification with in-channel resolution options on LINE and app push ahead of one major sale event, measured on exception contacts suppressed and on-time delivery recovery.",
    expansion: [
      "Add full order and delivery-exception servicing across all channels at peak scale",
      "Extend to returns eligibility, pickup scheduling and refund-status handling",
      "Bring product, warranty and invoice enquiries onto the same platform",
    ],
    stakeholders: [
      "Head of Customer Service / Customer Experience, momo",
      "Head of Logistics and Fulfilment Operations",
      "Chief Technology Officer or Head of Platform Engineering",
      "Head of E-commerce Operations",
      "Taiwan Mobile group AI or digital transformation lead",
    ],
    discovery: [
      "How much does exception contact volume rise during Double-11 compared with a normal week?",
      "What share of contacts are delivery-risk related and could be prevented by proactive notification?",
      "How many contacts does an average return generate from request to refund?",
      "Do Taiwan Mobile group AI initiatives already claim momo's service-automation roadmap?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "Two days into Double-11, a momo customer's order is flagged as at risk of missing its next-day promise; she gets a LINE message with a revised time and a pickup-point option before she thinks to check.",
  },

  "pchome": {
    operatingContext:
      "PChome Online is a pioneer of Taiwanese e-commerce, operating marketplace and direct-retail businesses built historically on a 24-hour delivery promise, alongside logistics and payment affiliates. It now operates under sustained competitive pressure from momo's scale, Shopee's marketplace reach and Coupang's entry into Taiwan, which has made service-cost efficiency an existential rather than optimisation question. Its contact load is standard e-commerce — order status, delivery exceptions, returns and refunds, marketplace seller disputes, product and warranty questions, payment and invoice issues — but it carries that load on materially weaker margins than its larger rivals. Customers reach it through in-app and web support, a service line and messaging channels, and as an internet company it retains genuine engineering identity even where its financial capacity to fund new platform spend is constrained.",
    strategicPressure: [
      { text: "PChome faces intense competition from momo, Shopee and Coupang's Taiwan entry, and has undergone restructuring and strategic repositioning under that pressure.", kind: "verified" },
      { text: "Its historic 24-hour delivery proposition creates the same exception-driven contact load as larger rivals but on a smaller revenue base.", kind: "verified" },
      { text: "Service-cost efficiency is a survival lever rather than an efficiency programme, which raises urgency but also constrains what can be spent.", kind: "inference" },
      { text: "As an internet company with engineering identity, it will want to own the experience layer, making co-build the honest posture rather than a packaged sale.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "PChome is a technology company by self-conception and by history, with platform, logistics and payment engineering in-house. It will not accept a black-box service platform, and it has the skills to build experience layers itself. But it cannot fund speech, telephony and evaluation infrastructure while competing on delivery and price. Co-build is the accurate posture: sell infrastructure and conversational capability, expect PChome to own the experience.",
    whyNotBuild:
      "The constraint is financial and strategic rather than technical. PChome's engineers could build parts of this; what they cannot do is fund a multi-quarter infrastructure programme while fighting three better-capitalised competitors on delivery speed and price. Selling the layers that are pure infrastructure — speech, telephony, orchestration, evaluation — lets their team spend its limited capacity on the commerce experience that differentiates them.",
    workflows: [
      {
        name: "Order-exception and delivery-status servicing",
        friction: "Order status and delivery exception contacts are high-volume and repetitive, and each one costs agent time the company's margins cannot absorb.",
        outcome: "The dominant contact category contained automatically, cutting service cost per order at the point where margin pressure is greatest.",
        channels: ["In-app chat", "LINE", "Voice"],
        systems: ["Order management", "Logistics and carrier tracking", "Customer account records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Returns and refund handling",
        friction: "Returns span eligibility checks, pickup arrangement and refund processing across systems, generating repeated contacts through the cycle.",
        outcome: "Return eligibility, pickup and refund status handled in one conversation, collapsing a multi-contact process and shortening refund cycle time.",
        channels: ["In-app chat", "LINE", "Voice"],
        systems: ["Returns and refunds system", "Reverse logistics", "Payment processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Marketplace seller and buyer dispute triage",
        friction: "Marketplace disputes between buyers and third-party sellers arrive with incomplete information and require manual evidence gathering before any decision.",
        outcome: "Structured dispute intake with evidence collected from both sides automatically, so human arbiters decide rather than investigate.",
        channels: ["In-app chat", "Email", "Seller portal"],
        systems: ["Marketplace order records", "Dispute case management", "Seller account records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "E-commerce platform with in-app and web self-service order management",
        "Customer service line and messaging support channels",
        "Own logistics and payment affiliate capability",
        "Marketplace seller platform with dispute processes",
      ],
      gaps: [
        "Routine order-status contacts still require agent handling",
        "Returns generate repeated contacts across the refund cycle",
        "Marketplace disputes require manual evidence gathering before decisions",
        "No unified conversation context across app, messaging and phone for one order",
      ],
    },
    risks: [
      "Financial capacity for new platform spend is genuinely constrained, so the commercial model must be usage-priced with rapid demonstrable payback.",
      "Distance-selling consumer-protection rules govern refund and return entitlements, requiring statutory accuracy in any automated decision.",
      "An engineering-identity company will push to build the experience layer itself; the architecture boundary must be agreed explicitly at the outset.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 2.2,
      automationRate: 0.65,
      basis: "Seller assumptions for a Taiwanese e-commerce platform under competitive margin pressure; contact volumes, cost per contact and containable share must be validated against PChome's own service reporting.",
    },
    pilotScope:
      "Deploy conversational order-status and delivery-exception servicing on the existing app and messaging channels with PChome owning the front end, measured on containment and service cost per order.",
    expansion: [
      "Add returns eligibility, pickup scheduling and refund-status handling",
      "Extend to marketplace dispute intake and evidence collection",
      "Open proactive delivery-risk notification against the 24-hour delivery promise",
    ],
    stakeholders: [
      "Chief Executive Officer or Chief Operating Officer (cost programme owner)",
      "Head of Customer Service Operations",
      "Chief Technology Officer / Head of Platform Engineering",
      "Head of Marketplace Business",
      "Chief Financial Officer (spend authorisation under margin pressure)",
    ],
    discovery: [
      "What is the current fully-loaded service cost per order, and what target has been set?",
      "What budget envelope realistically exists for new service technology this year?",
      "Where does PChome want the boundary between its own experience layer and vendor infrastructure?",
      "How many contacts does an average return or marketplace dispute generate?",
    ],
    flowTemplate: "order-logistics",
    scenario:
      "A PChome customer asks in-app why her 24-hour order has not arrived; the agent identifies the carrier exception, rebooks delivery for tomorrow morning, and closes the case without an agent touching it.",
  },

  "tutorabc": {
    operatingContext:
      "TutorABC is a Taiwan-rooted online English-learning platform delivering live one-to-one and small-group lessons with foreign instructors, sold on subscription and package models through a consultative sales process. Its business is communications-intensive by construction: prospective learners submit enquiries or take trial lessons and are followed up by sales consultants, existing learners book, reschedule and cancel sessions constantly across time zones, instructors and learners both need matching and scheduling support, and subscription renewals and package top-ups require proactive conversations. Speed of lead follow-up is a direct determinant of conversion in a category where prospects trial several providers in the same week. Learners reach it through the learning platform, a mobile app, a service line and LINE, and the company has its own platform engineering supporting the live-lesson product.",
    strategicPressure: [
      { text: "Online English tutoring in Taiwan and the wider Chinese-language market is highly competitive, with learners commonly trialling multiple providers before committing.", kind: "verified" },
      { text: "The sector has faced significant business-model disruption from both regulatory change in China and the arrival of AI-based language-practice tools.", kind: "verified" },
      { text: "Lead follow-up speed materially affects conversion when prospects are actively comparing providers within days.", kind: "inference" },
      { text: "Session scheduling across learner and instructor time zones is a continuous operational load that scales linearly with active learners unless automated.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "TutorABC is an edtech company with its own platform engineering, and it would naturally build learner-facing product features itself — which makes co-build the honest classification. What it is less likely to build is the sales and scheduling automation infrastructure around the product: speech, telephony, outbound orchestration and evaluation. Sell those layers and expect the company to integrate them into its own learner experience.",
    whyNotBuild:
      "The company's engineering capacity is committed to the live-lesson platform, matching and content — the product learners pay for. Sales follow-up and scheduling automation are adjacent operational functions that would never win a roadmap slot against product work, yet they are where conversion and retention are actually decided. Supplying that infrastructure is the right to win; competing with their product team is not.",
    workflows: [
      {
        name: "Lead follow-up and trial-lesson conversion",
        friction: "Enquiries and trial completions are followed up by consultants during working hours, so prospects who enquire at night are contacted a day later, after competitors have called.",
        outcome: "Every lead engaged within minutes in their own channel and language, with qualified prospects booked onto a consultant's calendar.",
        channels: ["LINE", "Voice", "Web chat"],
        systems: ["CRM and lead records", "Trial lesson scheduling", "Consultant calendars"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Session booking, rescheduling and cancellation",
        friction: "Learners book and reschedule constantly against instructor availability across time zones, and changes made late leave instructor slots unfilled.",
        outcome: "Booking and rescheduling handled instantly against live instructor availability, with released slots offered to other learners.",
        channels: ["LINE", "App", "Voice"],
        systems: ["Lesson scheduling platform", "Instructor availability", "Learner subscription records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Renewal and package top-up outreach",
        friction: "Renewal conversations depend on consultant capacity, so learners whose packages are running down are contacted inconsistently or after they lapse.",
        outcome: "Timely, consumption-triggered renewal conversations for every learner, with genuine negotiation escalated to consultants.",
        channels: ["LINE", "Voice", "App"],
        systems: ["Subscription and package records", "Lesson consumption data", "Payment processing"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Live online lesson platform with learner and instructor scheduling",
        "Mobile app for booking, lesson access and account management",
        "Sales consultant organisation handling enquiries and renewals",
        "LINE official account for learner communication and reminders",
      ],
      gaps: [
        "Out-of-hours leads wait until the next working day for first contact",
        "Late cancellations leave instructor slots unfilled with no re-offer mechanism",
        "Renewal outreach depends on consultant capacity rather than on consumption signals",
        "No unified context across the platform, LINE and consultant conversations",
      ],
    },
    risks: [
      "PDPA obligations apply to learner data, with additional care where learners are minors requiring guardian consent for contact and data use.",
      "Consumer-protection rules on subscription and package terms constrain what can be stated automatically about refunds and cancellation.",
      "Business restructuring and financial capacity may limit budget, so the entry scope must be small and tied directly to conversion or retention outcomes.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 2.4,
      automationRate: 0.6,
      basis: "Seller assumptions for an online tutoring platform of this learner and lead scale; lead, scheduling and renewal contact volumes and cost per contact must be validated with the company in discovery.",
    },
    pilotScope:
      "Automate lead follow-up and trial-lesson booking on LINE and voice covering evenings and weekends, measured on first-response time and trial-to-paid conversion against the current consultant-only process.",
    expansion: [
      "Add session booking, rescheduling and released-slot re-offering against instructor availability",
      "Extend to consumption-triggered renewal and package top-up outreach",
      "Integrate consultant handoff so human sellers receive fully qualified, contextualised prospects",
    ],
    stakeholders: [
      "Head of Sales / Consultant Organisation",
      "Head of Learner Experience or Customer Success",
      "Chief Technology Officer / Head of Platform",
      "Head of Instructor Operations and Scheduling",
      "Chief Financial Officer (spend authorisation post-restructuring)",
    ],
    discovery: [
      "What is the current median time from enquiry to first consultant contact, and how does conversion vary with it?",
      "How many instructor slots go unfilled each week due to late cancellations?",
      "Is renewal outreach triggered by consumption data today, or by consultant capacity?",
      "What budget exists for sales and scheduling automation given the current business position?",
    ],
    flowTemplate: "lead-sales",
    scenario:
      "A prospective TutorABC learner finishes a trial lesson at 10pm and is engaged on LINE within minutes about package options, with a consultant call booked for the next evening.",
  },
};
