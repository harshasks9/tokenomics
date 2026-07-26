import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_TH_MY_SG_B: Record<string, ProfileAnalysis> = {
  "etiqa": {
    operatingContext:
      "Etiqa is the insurance and takaful arm of Maybank group, writing both conventional and Shariah-compliant business across general and family lines in Malaysia, with sister operations in Singapore, the Philippines and Indonesia. Motor is its highest-frequency line, distributed through Maybank branches, tied agents, brokers, aggregators and its own direct-to-consumer digital channels, and the brand has been built explicitly around fast claim settlement. Customers reach it through a careline, the Etiqa mobile app and online portal, agent relationships and increasingly WhatsApp, while panel workshops and tow operators sit behind every motor claim. Monsoon flooding and festive-season road traffic concentrate claim volume into short, brutal windows.",
    strategicPressure: [
      { text: "Malaysia experiences recurring seasonal monsoon flooding that produces concentrated, multi-thousand-claim motor and property events in specific states within days.", kind: "verified" },
      { text: "Motor and fire detariffication has intensified price competition in Malaysian general insurance, pushing acquisition and per-policy servicing cost onto the management agenda.", kind: "verified" },
      { text: "A brand promise built on claim speed makes careline queue failures during surge events an attack on the core positioning, not just a service metric.", kind: "inference" },
      { text: "Bank Negara expectations on fair treatment of financial consumers raise the evidentiary burden on how claims and repudiation conversations are conducted and recorded.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Etiqa demonstrably ships customer-facing digital product — direct online motor and travel purchase journeys, an app with self-service claim submission — so it is not a technology-naive buyer. But that engineering capacity is pointed at distribution and claims processing, and the group's platform decisions are governed centrally rather than experimented with locally.",
    whyNotBuild:
      "Speech recognition tuned to Bahasa Malaysia with Malaysian-English and Mandarin code-switching, carrier-grade telephony into a Malaysian careline, policy-bounded orchestration across policy administration and claims systems, and continuous evaluation of every conversation are four separate engineering disciplines. An insurer measures itself on combined ratio, not on maintaining a speech stack, and Etiqa's technology headcount is already committed to claims processing and distribution roadmaps.",
    workflows: [
      {
        name: "Motor FNOL intake with tow and workshop dispatch",
        friction: "A roadside caller queues behind routine policy questions, then reads out policy and vehicle numbers to an agent who separately phones a tow operator and a panel workshop; photos arrive later by email in rejected formats.",
        outcome: "Structured FNOL captured in-thread with photos validated on the spot, tow dispatched and panel workshop booked before the call would have been answered.",
        channels: ["WhatsApp", "Voice", "Mobile app"],
        systems: ["Policy administration", "Claims management", "Panel workshop and tow dispatch", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Flood-event claim surge absorption",
        friction: "A monsoon event multiplies inbound claim contacts overnight; the careline saturates, claimants call repeatedly for status, and the speed-of-claims promise fails exactly when it is most visible.",
        outcome: "Elastic intake across voice and messaging with proactive stage updates pushed to affected claimants, suppressing the repeat-status calls that make the queue worse.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Claims management", "Policy administration", "Geospatial event data", "Notification platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Renewal and road-tax reminder outreach",
        friction: "Renewal reminders go out as one-way SMS blasts with a link; anyone with a question about NCD, coverage change or a new road-tax rule has to call, and lapses surface only in month-end retention reports.",
        outcome: "Two-way renewal conversations in Bahasa Malaysia, English or Mandarin that answer NCD and coverage questions and take payment in-channel, with lapse risk measured rather than inferred.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Policy administration", "Payment gateway", "CRM", "Consent register"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A Malaysian careline with a menu-driven IVR front end for claims and policy servicing",
        "A consumer mobile app supporting policy viewing and basic claim submission",
        "Direct online purchase and renewal journeys for motor, travel and personal lines",
        "Agency and Maybank-branch servicing as the relationship channel for life and takaful products",
      ],
      gaps: [
        "No way to complete a motor FNOL end-to-end in one messaging thread including photo validation and tow booking",
        "Claim-stage answers still require a call or an agent chase rather than being pushed as the file moves",
        "No conversational self-service in Bahasa Malaysia or Mandarin on the voice channel",
        "Takaful contribution and certificate questions cannot be resolved without human involvement",
      ],
    },
    risks: [
      "Bank Negara Malaysia conduct expectations on fair treatment of financial consumers and claims handling constrain what an agent may state about coverage, exclusions or repudiation without human review.",
      "Malaysia's PDPA requires documented consent for outbound claim and renewal contact and governs any processing that leaves Malaysia, which shapes deployment region and data-retention design.",
      "Takaful product conversations sit under Shariah governance, so product wording and any surplus-sharing explanation must be pre-approved rather than generated freely.",
    ],
    economics: {
      volumeMonthly: 420000,
      costPerInteraction: 1.7,
      automationRate: 0.52,
      basis: "Volume, cost and automation figures are seller assumptions derived from insurer-scale benchmarks and Malaysian servicing costs, to be replaced with Etiqa's own careline and digital-channel data in discovery.",
    },
    pilotScope:
      "A ten-week Scale pilot automating motor FNOL intake and proactive claim-status updates on WhatsApp and the careline in Bahasa Malaysia and English, integrated to the claims system and panel-workshop dispatch, measured on FNOL completion rate and status-call suppression.",
    expansion: [
      "Extend to property and flood-event claim intake with geospatial triggering of proactive outreach",
      "Add renewal and NCD conversations with in-channel payment for motor and personal lines",
      "Package the same deployment for Etiqa's Singapore and Philippines operations under group governance",
    ],
    stakeholders: [
      "Chief Executive Officer, General Insurance and Takaful",
      "Head of Claims Operations",
      "Chief Digital and Customer Experience Officer",
      "Head of Contact Centre and Careline Operations",
      "Group Chief Information Officer and Shariah Compliance lead",
    ],
    discovery: [
      "What proportion of motor FNOL already arrives digitally rather than by phone, and where does the digital journey break and revert to a call?",
      "During the last major flood event, what happened to careline answer rates and how much of the spike was repeat status calls?",
      "Does Etiqa procure customer-facing platforms independently, or does anything of this nature require Maybank group technology approval?",
      "Which claim decisions must stay human under your current conduct framework, and where is the line an agent must never cross?",
    ],
    flowTemplate: "claims",
    scenario: "A Klang Valley motorist reports a flood-damaged car to Etiqa on WhatsApp at 11pm, uploads photos, and has a tow booked and a claim number before the water recedes.",
  },

  "allianz-my": {
    operatingContext:
      "Allianz Malaysia operates general insurance through Allianz General and life through Allianz Life, and is one of the country's largest motor insurers by premium. Distribution runs through a large tied-agency force, bank partners, brokers and direct digital channels, with claims delivered through a panel of workshops and tow providers plus the Allianz Road Rangers roadside assistance proposition. Customers contact it through a 24-hour careline, the agency relationship, an online portal and app, and messaging; motor claims and roadside assistance dominate the contact mix. Seasonal flooding and the annual road-tax and insurance renewal cycle create predictable but severe demand peaks.",
    strategicPressure: [
      { text: "Motor is the dominant Malaysian general-insurance line by volume, so accident and monsoon-flood surges define the service workload rather than sitting at its edge.", kind: "verified" },
      { text: "Allianz Group operates centralised technology standards and vendor assurance, which slows local procurement but makes any approved deployment reusable across operating entities.", kind: "inference" },
      { text: "A roadside-assistance proposition sets an implicit response-time expectation that a queued careline cannot honour during multi-incident weather events.", kind: "inference" },
      { text: "Detariffied motor pricing has compressed underwriting margin, moving expense ratio and cost-to-serve up the local management agenda.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Allianz Malaysia has real digital delivery through group platforms and local customer-facing apps, but conversational infrastructure decisions sit within a global vendor-assurance framework. The realistic motion is a certified platform deployed with an implementation partner against locally-owned workflows, not a Kuala Lumpur build.",
    whyNotBuild:
      "Group information-security and model-governance requirements make an unvetted internal speech stack the slowest possible path, and the local entity has no mandate to staff speech, telephony and evaluation engineering. The differentiating asset Allianz owns is its claims panel and underwriting, not the plumbing that connects a caller at the roadside to it.",
    workflows: [
      {
        name: "Roadside assistance and motor FNOL intake",
        friction: "A stranded motorist calls the careline, waits, then repeats vehicle, location and incident details to an agent who manually dispatches a tow; during multi-incident weather the wait extends exactly when safety matters.",
        outcome: "Location and incident captured immediately in any channel, tow dispatched against the panel, and the claim opened in the same conversation with photographs already attached.",
        channels: ["Voice", "WhatsApp", "Mobile app"],
        systems: ["Claims management", "Policy administration", "Roadside assistance dispatch", "Panel workshop network"],
        value: 3, complexity: 3,
      },
      {
        name: "Flood-surge claims intake and proactive status",
        friction: "A flood event generates claim volume far beyond careline capacity, and claimants with damaged vehicles call daily for status because nothing is pushed to them.",
        outcome: "Unlimited concurrent intake in Bahasa Malaysia, English and Mandarin, with every stage change pushed to the claimant so the status-call wave never forms.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Claims management", "Notification platform", "Panel workshop network"],
        value: 3, complexity: 2,
      },
      {
        name: "Renewal-season policy and NCD servicing",
        friction: "Road-tax season concentrates renewal questions about no-claim discount, coverage and premium change into a few weeks; agents field the same explanations by phone while quotes go cold.",
        outcome: "Renewal questions answered conversationally with the actual NCD and premium position, and payment completed in-channel before the policy lapses.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Policy administration", "Rating engine", "Payment gateway", "Agency CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A 24-hour motor claims and roadside-assistance careline",
        "A consumer mobile app with policy access and claim notification features",
        "Online quote-and-buy journeys for motor and personal lines",
        "A large tied-agency force acting as the primary servicing relationship for life products",
      ],
      gaps: [
        "Roadside assistance cannot be requested and dispatched entirely inside a messaging thread",
        "Claim progress is pull-only, so status calls remain a dominant inbound driver",
        "No voice self-service in Bahasa Malaysia or Mandarin beyond a menu tree",
        "Agents cannot get instant grounded answers on underwriting or claim eligibility without escalating internally",
      ],
    },
    risks: [
      "Allianz Group vendor assurance and model-governance approval is a gating dependency that must be sequenced before any production deployment, not discovered late.",
      "BNM conduct standards on claims handling and Malaysia's PDPA constrain automated statements about coverage and require documented consent for outbound contact.",
      "Language coverage must credibly span Bahasa Malaysia, Malaysian English, Mandarin and enough Tamil to avoid excluding a segment of motor policyholders.",
    ],
    economics: {
      volumeMonthly: 260000,
      costPerInteraction: 1.8,
      automationRate: 0.48,
      basis: "These volume, unit-cost and automation figures are seller assumptions from Malaysian insurer servicing benchmarks and must be validated against Allianz Malaysia's own careline and claims-contact reporting in discovery.",
    },
    pilotScope:
      "An eight-week Launch pilot handling motor FNOL and roadside-assistance intake on the careline and WhatsApp in Bahasa Malaysia and English, integrated to claims and tow dispatch, measured on time-to-dispatch and FNOL abandonment.",
    expansion: [
      "Add proactive claim-status updates and flood-event surge intake across general lines",
      "Extend to renewal and NCD servicing with in-channel payment during road-tax season",
      "Offer the certified deployment pattern to other Allianz Asia-Pacific operating entities",
    ],
    stakeholders: [
      "Chief Executive Officer, Allianz General Insurance Malaysia",
      "Head of Claims",
      "Chief Operations Officer",
      "Head of Customer Care Centre",
      "Chief Information Officer and regional IT governance contact",
    ],
    discovery: [
      "What does careline answer rate look like on the worst flood day of last year versus a normal Tuesday?",
      "Is there an existing Allianz Group vendor arrangement for conversational AI that a Malaysian deployment would have to sit under?",
      "How is Road Rangers dispatch triggered today, and can it be called by an external orchestration layer?",
      "What share of renewal-season contacts are pure NCD and premium-explanation questions that never needed a human?",
    ],
    flowTemplate: "claims",
    scenario: "A driver on the Karak Highway messages Allianz after a collision, and a tow, a panel workshop and an open claim are confirmed in the same thread within minutes.",
  },

  "syarikat-takaful": {
    operatingContext:
      "Syarikat Takaful Malaysia Keluarga is one of Malaysia's longest-established takaful operators, writing family takaful and, through its general subsidiary, motor, fire and personal-accident cover on Shariah-compliant principles. A large share of its distribution runs through bank partners, notably Bank Islam and other Islamic banking channels, which means many certificate holders were acquired at a bank counter rather than through a takaful agent. Servicing runs through a customer careline, branch counters, an online portal and app, and the bank partners themselves, with contributions collected largely by standing instruction and salary deduction. Its customer base skews toward Malay-speaking, Bahasa-first participants across both urban and smaller-town Malaysia.",
    strategicPressure: [
      { text: "Bancatakaful distribution means a large proportion of certificate holders have no agent relationship and default to the careline or the bank branch for every servicing question.", kind: "inference" },
      { text: "Shariah governance requires that product explanations, surplus-sharing and certificate wording be pre-approved and auditable, which raises the cost of ad-hoc human explanation as much as it constrains automation.", kind: "verified" },
      { text: "Contribution lapse from failed standing instructions is a silent revenue leak that only surfaces in month-end reporting rather than being caught conversationally.", kind: "hypothesis" },
      { text: "As a focused operator without the expense base of a bank-owned insurance arm, cost-to-serve improvements go straight to a visible operating ratio.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. This is a specialist takaful operator whose technology function is sized to run policy administration and regulatory reporting, not to develop conversational infrastructure. Nothing in its public posture suggests platform engineering ambition, and a packaged deployment with clear Shariah-reviewed content boundaries is the only realistic route to conversational servicing.",
    whyNotBuild:
      "Building speech, telephony, orchestration and evaluation would require a software organisation this operator has no reason to create. More decisively, the governance layer it actually needs — provably bounded, auditable statements about takaful products — is a platform capability to be configured, not a research project a Malaysian takaful operator should be running.",
    workflows: [
      {
        name: "Contribution-reminder and lapse-prevention outreach",
        friction: "Failed standing instructions produce a lapse notice by letter or SMS with no conversation; participants who intended to keep cover discover the lapse only when they claim.",
        outcome: "Timed, consent-governed reminders in Bahasa Malaysia that explain the shortfall, accept payment in-channel and reinstate cover before the certificate lapses.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Takaful administration system", "Payment gateway", "Consent register", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Certificate servicing and nomination changes",
        friction: "Changes to nominee, address or contribution mode require a form, a branch visit or a careline call, and Bahasa-first participants often abandon the online route entirely.",
        outcome: "Routine certificate changes completed conversationally in Bahasa Malaysia with documents captured in-thread and written back to the administration system.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Takaful administration system", "Document management", "Identity verification"],
        value: 2, complexity: 2,
      },
      {
        name: "Claim intake and status for family and motor takaful",
        friction: "Claimants, often at a difficult moment, must assemble documents from a checklist they misread, then call repeatedly for status because nothing is pushed back to them.",
        outcome: "Guided document collection with validation in-flow and automatic stage notifications, with any Shariah or adjudication decision routed to a human.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Claims system", "Document management", "Takaful administration system", "Notification platform"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer careline with menu-driven routing for certificate and claim queries",
        "An online participant portal and mobile app for certificate viewing and basic transactions",
        "Servicing through Islamic-bank partner branches for bancatakaful-acquired participants",
        "Agency and branch counters for document-heavy transactions",
      ],
      gaps: [
        "No conversational Bahasa Malaysia servicing that can complete a nomination or contribution-mode change end-to-end",
        "Lapse and contribution-failure conversations happen only after the fact, if at all",
        "Claim status is not pushed, so status-chasing dominates careline volume",
        "Bank-partner-acquired participants have no clear digital servicing identity separate from the bank",
      ],
    },
    risks: [
      "Shariah governance means all product, surplus-sharing and certificate wording used by an agent must be pre-approved content under the Shariah committee, with no generative latitude on product characterisation.",
      "BNM conduct requirements and Malaysia's PDPA govern contribution-reminder outreach, requiring documented consent, permitted contact windows and careful handling of vulnerable participants.",
      "Servicing responsibility is genuinely split with bank partners, so an agent must know which cases it may act on and which belong to the bank's own channel.",
    ],
    economics: {
      volumeMonthly: 110000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Volume, cost per interaction and automation rate are seller assumptions based on mid-scale Malaysian insurer benchmarks and require validation against Takaful Malaysia's own careline and bancatakaful servicing split.",
    },
    pilotScope:
      "An eight-week Launch pilot automating contribution-reminder outreach and certificate-servicing queries on WhatsApp and the careline in Bahasa Malaysia and English, with Shariah-approved response content and measured lapse-prevention outcomes.",
    expansion: [
      "Add family and motor claim intake with guided document validation and pushed status updates",
      "Extend the same agent into bank-partner servicing journeys where the boundary permits",
      "Introduce a general-takaful renewal workflow around the motor road-tax cycle",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Operations Officer",
      "Head of Customer Experience and Contact Centre",
      "Head of Shariah Compliance",
      "Chief Information Officer",
    ],
    discovery: [
      "What proportion of certificates lapse from failed standing instructions each year, and is anyone conversationally intervening before lapse?",
      "Which servicing transactions do bank partners handle on your behalf, and which always come back to your careline?",
      "What is the Shariah committee's approval process for customer-facing scripted content, and how long does a change take?",
      "How much of your careline volume is pure status-chasing on an open claim?",
    ],
    flowTemplate: "collections",
    scenario: "A Takaful Malaysia participant whose standing instruction bounced is reached on WhatsApp in Bahasa Malaysia, understands the shortfall, and reinstates cover with a payment link the same evening.",
  },

  "aeon-malaysia": {
    operatingContext:
      "AEON Co. (M) operates general-merchandise stores and shopping malls across Malaysia under the Japanese AEON group, combining supermarket and department-store retail with mall landlord operations and a growing online grocery and merchandise channel. Its customer relationship is anchored by AEON Member loyalty and a substantial cardholder base serviced through the affiliated credit business, giving it a named, contactable customer file unusual for Malaysian retail. Shoppers reach it through in-store service counters, a careline, the mobile app, social media pages and WhatsApp, with online-order questions increasingly dominant. Festive cycles around Hari Raya, Chinese New Year and Deepavali produce sharp demand and service spikes across a multilingual customer base.",
    strategicPressure: [
      { text: "Malaysian grocery and general-merchandise retail runs on thin operating margins, so any per-contact service cost is measured directly against basket economics.", kind: "verified" },
      { text: "Festive-season concentration means service demand is not evenly distributed, making fixed careline headcount either wasteful or inadequate for most of the year.", kind: "inference" },
      { text: "Loyalty and cardholder servicing gives AEON an identified customer base that could be engaged proactively, but today the relationship is mostly one-way promotional messaging.", kind: "inference" },
      { text: "Japanese-parent governance favours proven, vendor-supported systems over locally-invented platforms, shortening the path to a packaged decision.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. AEON Malaysia is a retail operator whose technology function runs merchandising, point-of-sale, loyalty and e-commerce platforms bought from vendors. There is no evidence of platform-engineering ambition, and retail cost structure makes any speculative internal build implausible.",
    whyNotBuild:
      "A retailer's engineering budget goes to store systems, supply chain and the commerce stack. Speech recognition across Bahasa Malaysia, Mandarin and Malaysian English, telephony integration, orchestration into order and loyalty systems, and per-conversation evaluation are four capabilities with no retail analogue — they would be bought even by a retailer many times AEON Malaysia's size.",
    workflows: [
      {
        name: "Online-order and delivery issue resolution",
        friction: "A missing or substituted grocery item triggers a social-media post or a careline call; the agent checks the order system and the delivery partner separately, and any refund becomes a ticket resolved days later.",
        outcome: "Order looked up from the registered number, live delivery status retrieved, and substitution, refund or redelivery executed inside the conversation within policy.",
        channels: ["WhatsApp", "Voice", "Web chat", "Social messaging"],
        systems: ["Order management", "Last-mile delivery partner feeds", "Payment and refund system", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Loyalty member and points servicing",
        friction: "Points-balance, voucher-expiry and member-tier questions arrive constantly at store counters and the careline, occupying staff with lookups the customer could self-serve if the channel existed.",
        outcome: "Instant grounded answers on points, vouchers and tier status in the member's language, with promotional eligibility explained rather than guessed.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Loyalty platform", "CRM", "Promotions engine"],
        value: 2, complexity: 1,
      },
      {
        name: "Festive-season store and mall enquiry handling",
        friction: "Trading hours, stock availability, mall services and event questions flood social channels and store lines during festive weeks, with inconsistent answers per store.",
        outcome: "One consistent, grounded answer across all channels and languages, elastic through the festive peak without temporary staffing.",
        channels: ["WhatsApp", "Social messaging", "Voice"],
        systems: ["Store master data", "Inventory availability", "Mall operations systems"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A customer careline and in-store service counters at every mall and store",
        "The AEON mobile app with member identity, e-vouchers and offers",
        "An online grocery and merchandise ordering channel with a tracking page",
        "Active social-media pages that function as an unofficial complaints channel",
      ],
      gaps: [
        "Customers cannot resolve a missing-item or refund case end-to-end without a human or a multi-day ticket",
        "Loyalty points and voucher questions still consume counter and careline staff time",
        "No unified conversational front door across app, social, WhatsApp and phone",
        "No proactive outreach when a delivery is running late or an item is out of stock",
      ],
    },
    risks: [
      "Malaysia's PDPA governs use of loyalty and cardholder data for conversational identification and any proactive outreach, requiring consent evidence and purpose limitation.",
      "Refund and goodwill authority must be bounded by an approved matrix with human approval above a threshold, or automation becomes a margin leak.",
      "Language coverage must genuinely include Bahasa Malaysia, Mandarin and Malaysian English, since a single-language deployment would exclude a large share of the customer base.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Interaction volume, unit cost and automation rate are seller assumptions from Malaysian retail servicing benchmarks and must be validated against AEON's careline, social-channel and online-order contact data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling online-order issues and loyalty-member queries on WhatsApp and web chat in Bahasa Malaysia, English and Mandarin, integrated to order management and the loyalty platform, measured on contacts resolved without a human.",
    expansion: [
      "Add voice self-service on the careline for order and store enquiries",
      "Introduce proactive delivery-exception outreach before customers contact AEON",
      "Extend to mall tenant and concierge service requests as a separate B2B workflow",
    ],
    stakeholders: [
      "Managing Director, AEON Co. (M)",
      "Director of Retail Operations",
      "Head of Digital and E-commerce",
      "Head of Customer Service and Loyalty",
      "Chief Information Officer",
    ],
    discovery: [
      "How many contacts a month arrive across careline, social messaging and the app, and what share are order issues versus loyalty questions?",
      "What refund and goodwill authority does a frontline agent hold today without escalation?",
      "Which delivery partners serve online grocery, and are their status feeds available in real time?",
      "How much does festive-season temporary service staffing cost you each year?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An AEON online-grocery shopper in Shah Alam messages about two missing items and gets a live order check, a refund and a redelivery slot without ever reaching a queue.",
  },

  "mydin": {
    operatingContext:
      "Mydin Mohamed Holdings is Malaysia's largest home-grown halal hypermarket, supermarket and wholesale-emporium operator, serving mass-market households and, distinctively, thousands of small retailers and food operators who buy from it wholesale. Its positioning on everyday low prices and halal assurance makes it a staple destination in Bahasa-first communities across the peninsula, with a Meriah loyalty programme tying repeat shoppers together. Wholesale customers place orders and coordinate deliveries largely by phone and WhatsApp with branch staff, an informal channel that carries real commercial volume. It is a family-controlled business with a lean corporate function and famously tight cost discipline.",
    strategicPressure: [
      { text: "Wholesale and hypermarket retail in Malaysia operates on very thin gross margins, so every staffed hour spent on order-taking and delivery coordination is measured against a small unit contribution.", kind: "verified" },
      { text: "A significant part of the wholesale ordering relationship runs through informal phone and WhatsApp contact with branch staff, which is unrecorded, unmeasured and fragile to staff turnover.", kind: "hypothesis" },
      { text: "Competition from foreign hypermarket chains and hard-discount minimart formats squeezes both price and service investment simultaneously.", kind: "inference" },
      { text: "Bahasa Malaysia is the dominant language of its customer base, and English-first digital tooling systematically underserves it.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Mydin is a family-run retailer with an IT function focused on point-of-sale, merchandising and basic e-commerce. There is no software organisation and no plausible path to one; any conversational capability arrives as a bought, configured product with a very short proof window.",
    whyNotBuild:
      "The question is not whether Mydin would prefer to build — it is that the entire category of speech, telephony, orchestration and evaluation engineering sits outside the operating model of a hypermarket group. A packaged agent that pays for itself in reduced branch-staff coordination time is the only proposition that survives its investment discipline.",
    workflows: [
      {
        name: "Wholesale customer ordering and delivery coordination",
        friction: "Small retailers phone or WhatsApp a branch to place a repeat order; staff take it down manually, availability is guessed, and delivery timing is negotiated verbally with no record.",
        outcome: "Repeat orders captured conversationally in Bahasa Malaysia against live availability, confirmed with a delivery slot, and written into the order system rather than a notebook.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Wholesale order management", "Inventory availability", "Delivery scheduling", "Customer master"],
        value: 3, complexity: 3,
      },
      {
        name: "Store, stock and promotion enquiry handling",
        friction: "Shoppers call branches to ask about trading hours, promotion validity and item availability, tying up staff who are needed on the floor, with answers that vary by whoever picks up.",
        outcome: "Consistent, grounded answers on hours, promotions and availability in Bahasa Malaysia and English, at any hour, without pulling staff off the floor.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Store master data", "Promotions calendar", "Inventory availability"],
        value: 2, complexity: 1,
      },
      {
        name: "Meriah loyalty and member servicing",
        friction: "Points, card-replacement and member-benefit questions arrive at counters and branch phones, with no self-service path for a customer base that does not use an app-first journey.",
        outcome: "Loyalty questions resolved conversationally in the customer's language without a counter visit, freeing checkout and service staff.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Loyalty platform", "Customer master", "Point-of-sale transaction history"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "Branch telephone lines and in-store customer-service counters as the primary contact route",
        "An active WhatsApp and social-media presence used informally for orders and enquiries",
        "The Meriah loyalty programme with member identification at point of sale",
        "A basic online ordering and grocery-delivery channel",
      ],
      gaps: [
        "Wholesale customers cannot place or confirm a repeat order against live stock without a staff member",
        "No record or measurement of the phone and WhatsApp ordering relationship that carries real revenue",
        "No after-hours channel at all, despite food-operator customers ordering outside trading hours",
        "Loyalty and promotion questions have no self-service path in Bahasa Malaysia",
      ],
    },
    risks: [
      "Malaysia's PDPA applies to wholesale customer contact data and loyalty records, and informal WhatsApp channels currently sit outside any documented consent or retention framework.",
      "Order-taking automation is only safe if it is bounded by live inventory and credit-limit checks, otherwise it creates fulfilment failures that cost more than the staff time saved.",
      "The deployment must work in Bahasa Malaysia first with tolerance for regional accent and colloquial ordering language, or adoption among wholesale customers will not happen.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 0.9,
      automationRate: 0.5,
      basis: "Volume, cost per interaction and automation rate are seller assumptions from Malaysian mass-retail and wholesale servicing benchmarks, to be replaced with Mydin's own branch-call and WhatsApp data during discovery.",
    },
    pilotScope:
      "An eight-week Launch pilot at a cluster of wholesale-emporium branches automating repeat-order capture and delivery scheduling on WhatsApp and voice in Bahasa Malaysia, integrated to order management and inventory, measured on staff hours released and order accuracy.",
    expansion: [
      "Extend order-taking to the full branch network with credit-limit-aware ordering for trade customers",
      "Add store, promotion and availability enquiry handling across all branches",
      "Introduce Meriah loyalty servicing and proactive restock reminders for regular wholesale buyers",
    ],
    stakeholders: [
      "Managing Director",
      "Director of Operations",
      "Head of Wholesale and Trade Sales",
      "Head of Information Technology",
      "Regional Branch Operations Manager",
    ],
    discovery: [
      "How much of your wholesale order volume arrives by phone or WhatsApp rather than through a system?",
      "Can an external system read live stock availability and a trade customer's credit position in real time?",
      "How many staff hours per branch per day go to answering the phone rather than serving the floor?",
      "What happens today when a trade customer wants to order outside trading hours?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Kelantan restaurant owner WhatsApps Mydin at 10pm with a repeat wholesale order, and gets availability confirmed and a morning delivery slot locked in Bahasa Malaysia.",
  },

  "99-speedmart": {
    operatingContext:
      "99 Speed Mart operates Malaysia's largest minimart chain, running thousands of small-format neighbourhood outlets supplied through a network of regional distribution centres, with a listing on Bursa Malaysia that put its operating discipline under public scrutiny. Its economic model depends on extreme standardisation and low overhead per store, so the dominant communication load is internal rather than consumer-facing: outlet staff contacting head office and distribution centres about stock, deliveries, point-of-sale problems and operating procedures. Consumer contact is comparatively light and mostly arrives through social media and a general enquiry line. The workforce is largely Bahasa-speaking with Mandarin used in parts of the management chain.",
    strategicPressure: [
      { text: "A minimart chain of this size runs on very low overhead per outlet, so any head-office support function that scales linearly with store count is a structural cost problem.", kind: "verified" },
      { text: "Public listing has increased external scrutiny of operating efficiency and margin, making measurable back-office cost reduction more attractive than before.", kind: "verified" },
      { text: "Store-to-head-office support today is likely handled by phone and messaging groups with no routing, no record and no measurement of resolution time.", kind: "hypothesis" },
      { text: "Continued aggressive outlet expansion means the support burden grows faster than any plan to staff it.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. This is a famously lean, founder-led retail operator whose competitive advantage is operational simplicity. It has no software organisation and would not create one; a bought internal-helpdesk agent with a hard cost case is the only shape of proposal that gets attention.",
    whyNotBuild:
      "The organisation is deliberately constructed to avoid overhead functions, and a speech-plus-orchestration engineering team is exactly the kind of overhead it has spent years not accumulating. The buying decision here will be made on payback period against head-office headcount, not on technical preference.",
    workflows: [
      {
        name: "Outlet-staff operations helpdesk",
        friction: "Store staff phone or message head office about stock discrepancies, delivery shortfalls, point-of-sale faults and procedure questions; calls land wherever they land, answers vary, and nothing is recorded.",
        outcome: "One front door in Bahasa Malaysia and Mandarin that answers procedure questions from governed sources, raises the right ticket automatically, and measures which issues recur.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Store operations knowledge base", "Point-of-sale support ticketing", "Inventory and replenishment system", "HR system"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery and replenishment exception handling",
        friction: "A short or missed distribution-centre delivery triggers a store call chain to the DC, then to merchandising, with the outlet losing sales while the loop closes.",
        outcome: "Exception logged against the actual delivery record, DC and merchandising notified with context, and the outlet given a grounded resolution time instead of a promise.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Warehouse management", "Replenishment system", "Transport scheduling", "Store operations ticketing"],
        value: 3, complexity: 3,
      },
      {
        name: "Store-staff HR and shift queries",
        friction: "Leave balances, payroll questions and shift-swap requests from a large, distributed, mostly non-desk workforce arrive at a small HR team by phone and message.",
        outcome: "Routine HR questions answered and simple requests actioned conversationally, with manager approval collected in-flow, freeing HR for exceptions.",
        channels: ["WhatsApp", "Voice"],
        systems: ["HR information system", "Payroll", "Workforce scheduling"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Head-office and distribution-centre phone lines used by outlets as the default support route",
        "Internal messaging groups functioning as an informal operations helpdesk",
        "A consumer enquiry line and social-media pages for customer-facing questions",
        "Standardised written operating procedures distributed to outlets",
      ],
      gaps: [
        "No single, measured support front door for outlet staff — issues route by habit rather than by category",
        "Procedure answers depend on who picks up, so consistency across thousands of outlets is unverifiable",
        "Recurring operational defects are never clustered or reported upstream because nothing is logged",
        "No after-hours support for outlets trading beyond head-office hours",
      ],
    },
    risks: [
      "This is an internal-workforce deployment, so Malaysia's PDPA and employment-data handling apply to staff records, and works-council-style sensitivities around monitoring must be managed explicitly.",
      "Any agent action touching inventory, replenishment or payroll must be least-privilege and fully logged, since store-level errors compound across thousands of outlets.",
      "The business case has to survive a founder-led investment test on payback, so scope must stay narrow enough to prove savings in one quarter.",
    ],
    economics: {
      volumeMonthly: 140000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Contact volume, unit cost and automation assumptions are seller estimates from internal-helpdesk benchmarks scaled to outlet count, and must be validated against 99 Speed Mart's actual head-office and DC call data.",
    },
    pilotScope:
      "An eight-week Launch pilot giving outlet staff in one region a WhatsApp and voice operations helpdesk in Bahasa Malaysia and Mandarin, grounded in operating procedures and integrated to store-operations ticketing, measured on head-office call deflection and resolution time.",
    expansion: [
      "Roll the helpdesk across all regions and add delivery-exception handling with DC integration",
      "Add HR and shift-query self-service for the full outlet workforce",
      "Introduce a consumer-facing enquiry agent for social and phone contact once internal savings are proven",
    ],
    stakeholders: [
      "Chief Executive Officer / Founder",
      "Chief Operating Officer",
      "Head of Store Operations",
      "Head of Supply Chain and Distribution",
      "Head of Information Technology",
    ],
    discovery: [
      "How many calls and messages does head office receive from outlets each day, and who currently absorbs them?",
      "What are the top five issues outlet staff contact head office about, and how long do they take to close?",
      "Is there a ticketing system behind store operations today, or is support entirely verbal?",
      "What head-office or DC headcount is currently justified by store support, and what payback period would make this worth doing?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A 99 Speed Mart outlet supervisor in Johor messages about a short delivery and gets the DC record checked, a ticket raised and a resolution time confirmed in Bahasa Malaysia within a minute.",
  },

  "u-mobile": {
    operatingContext:
      "U Mobile is Malaysia's fourth mobile network operator, competing on aggressive prepaid and postpaid value propositions with a subscriber base skewed toward price-sensitive, multilingual consumers including a substantial migrant-worker segment. It was selected to deploy Malaysia's second 5G network, a capital-intensive undertaking that dominates its investment agenda and heightens pressure on every other line of operating cost. Customers reach it through a careline, retail stores and dealer outlets, the MyUMobile app, web self-care and messaging channels, with prepaid top-up, billing disputes, plan changes and coverage complaints forming the bulk of contact. Its channel reality is WhatsApp-heavy, and its language mix genuinely spans Bahasa Malaysia, English, Mandarin and Tamil.",
    strategicPressure: [
      { text: "U Mobile was selected to build Malaysia's second 5G network, a capital programme that concentrates investment on infrastructure and squeezes discretionary operating spend elsewhere.", kind: "verified" },
      { text: "Prepaid ARPU in the Malaysian value segment is low enough that a single assisted call can exceed a subscriber's monthly revenue contribution.", kind: "inference" },
      { text: "A challenger operator cannot staff four-language service at incumbent depth, so language coverage is a structural service gap rather than a quality issue.", kind: "inference" },
      { text: "5G rollout itself generates a new class of coverage, device-compatibility and plan-migration questions that the existing careline was never sized for.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. U Mobile's engineering identity is network deployment and radio planning, not conversational software. Its digital channels are vendor-delivered, and with capital committed to 5G, there is neither appetite nor headroom for an internal AI platform programme.",
    whyNotBuild:
      "Every engineer and every ringgit of capital the company can mobilise is pointed at a national network build with regulatory deadlines. Speech recognition across four languages, telephony orchestration, integration into billing and provisioning, and continuous evaluation would be a second engineering programme competing with the one that determines the company's future.",
    workflows: [
      {
        name: "Prepaid top-up, balance and plan self-service",
        friction: "Balance, validity and top-up questions arrive by phone into a two-language IVR from a four-language base; a human call on a low-ARPU prepaid line destroys the account's monthly economics.",
        outcome: "Balance, validity, plan and top-up handled conversationally in the subscriber's own language with payment completed in-channel, at a fraction of assisted cost.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Billing and charging system", "Prepaid balance platform", "Payment gateway", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Coverage complaint triage and 5G migration support",
        friction: "Coverage complaints and 5G device or plan questions all land as generic calls; agents cannot see network status at the caller's location and default to apology and a ticket.",
        outcome: "Location-aware coverage answers grounded in live network status, device-compatibility checks, and guided plan migration without an agent.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Network operations and outage data", "Device catalogue", "Provisioning", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Postpaid billing dispute and retention conversations",
        friction: "Bill-shock and contract-end conversations are handled by a small retention team reaching only a fraction of at-risk subscribers, with offers improvised per agent.",
        outcome: "Every at-risk subscriber engaged in their language with the actual bill explained line by line and retention offers bounded by an approved matrix.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Billing system", "CRM", "Offer and campaign management", "Churn scoring"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A careline with menu-driven IVR routing in Bahasa Malaysia and English",
        "The MyUMobile self-care app for top-up, plan and usage management",
        "Web self-care and an online store for plan purchase and SIM registration",
        "A dealer and retail-outlet network handling in-person servicing and top-up",
      ],
      gaps: [
        "No conversational voice self-service in Mandarin or Tamil despite a genuinely four-language base",
        "Coverage complaints cannot be answered against live network status in the conversation",
        "Bill explanation still requires a human, so bill-shock calls stay expensive",
        "Retention outreach reaches only a fraction of contract-end subscribers",
      ],
    },
    risks: [
      "MCMC consumer-protection and service-quality requirements govern how complaints are handled and recorded, and coverage statements must be defensible.",
      "Malaysia's PDPA constrains outbound retention contact and subscriber-data use, requiring documented consent and permitted contact windows.",
      "Four-language coverage including Tamil is a genuine technical requirement here, not a nice-to-have, and partial coverage would visibly disadvantage part of the base.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.2,
      automationRate: 0.62,
      basis: "Monthly interaction volume, cost per contact and automation rate are seller assumptions from Malaysian telecom servicing benchmarks scaled to a challenger subscriber base, for validation against U Mobile's own contact-centre reporting.",
    },
    pilotScope:
      "A twelve-week Scale pilot automating prepaid balance, validity and top-up plus billing enquiries on voice and WhatsApp in Bahasa Malaysia, English, Mandarin and Tamil, integrated to the charging system and payment gateway, measured on cost per contact and containment.",
    expansion: [
      "Add coverage-complaint triage grounded in live network operations data and 5G migration guidance",
      "Extend to postpaid billing explanation and contract-end retention conversations",
      "Introduce a dealer-support desk for the retail and reseller network",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Digital Officer",
      "Head of Customer Service and Contact Centre",
      "Chief Technology Officer",
    ],
    discovery: [
      "What is your current fully loaded cost per assisted call, and how does it compare with prepaid ARPU in the value segment?",
      "What proportion of careline volume is pure balance, validity and top-up traffic?",
      "Can live network and outage status be exposed to an external system for location-aware coverage answers?",
      "How does the 5G capital programme affect the approval path for an operating-cost-reduction investment this year?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A U Mobile prepaid subscriber asks about validity in Tamil at midnight, gets a grounded answer and tops up in the same conversation without ever reaching a human.",
  },

  "yes-5g": {
    operatingContext:
      "Yes 5G is YTL Communications' mobile brand, a challenger operator that moved early onto Malaysia's wholesale 5G network with data-centric plans aimed at value-conscious and digitally-inclined subscribers, and with a notable presence in education-linked connectivity programmes. Its go-to-market is digital-first with a lean retail footprint, so the app, web self-care and messaging carry most of the customer relationship, backed by a small careline. Contact is dominated by billing questions, device and SIM activation, coverage complaints and plan changes, arriving mainly in Bahasa Malaysia, English and Mandarin. It sits inside YTL Group, a diversified infrastructure conglomerate whose engineering strength is in utilities, construction and now data-centre and cloud infrastructure rather than consumer conversational software.",
    strategicPressure: [
      { text: "As a small challenger, Yes cannot spread service cost across an incumbent-scale subscriber base, so cost per contact is structurally worse for it than for its competitors.", kind: "inference" },
      { text: "A digital-first proposition raises customer expectations for instant resolution while providing the smallest human service capacity of any Malaysian operator.", kind: "inference" },
      { text: "Riding a wholesale 5G network removes network differentiation, pushing competition toward price and service experience where automation directly affects the P&L.", kind: "verified" },
      { text: "YTL Group's current technology attention is on data-centre and AI infrastructure investment, which favours buying application-layer capability rather than building it inside the telco.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Yes is a lean consumer brand inside an infrastructure group; its own technology function runs BSS, the app and digital channels. Even where group-level AI infrastructure exists, a consumer-service agent is an application to be bought and configured, not a platform the telco would develop.",
    whyNotBuild:
      "The subscriber base is too small to amortise a speech, telephony, orchestration and evaluation build, and the operator's competitive problem is immediate service cost, not a multi-year platform position. Buying gets a measurable containment rate this quarter; building would consume the same budget with no service improvement for a year.",
    workflows: [
      {
        name: "Billing and plan-change self-service",
        friction: "Billing questions and plan changes generate calls into a small careline; the app answers only the simplest cases, so anything requiring explanation escalates to a human immediately.",
        outcome: "Bills explained line by line and plan changes executed conversationally in the subscriber's language, containing the majority of billing contacts without a human.",
        channels: ["WhatsApp", "Voice", "App", "Web chat"],
        systems: ["Billing system", "Product catalogue", "Provisioning", "Payment gateway"],
        value: 3, complexity: 2,
      },
      {
        name: "Coverage and connectivity troubleshooting",
        friction: "Coverage complaints are handled with generic advice because the agent cannot see network status at the subscriber's location, so tickets are raised that resolve nothing.",
        outcome: "Guided diagnostics grounded in live network status and device settings, resolving fixable cases in-conversation and escalating genuine faults with real data attached.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Network status feeds", "Device and SIM records", "Fault ticketing", "CRM"],
        value: 2, complexity: 3,
      },
      {
        name: "SIM activation and device onboarding",
        friction: "New subscribers stall during eKYC, SIM registration or device configuration and abandon; the only recovery path is a call the customer often does not make.",
        outcome: "Guided activation with proactive intervention when a subscriber stalls, converting abandoned onboarding into completed activations.",
        channels: ["WhatsApp", "App", "Voice"],
        systems: ["eKYC and registration platform", "Provisioning", "Order management", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A self-care mobile app carrying most routine subscriber transactions",
        "Web self-service and an online store for plan and device purchase",
        "A careline with basic menu routing for escalated issues",
        "Messaging-based support through social and chat channels",
      ],
      gaps: [
        "Billing explanation still requires a human whenever the answer is not a number on a screen",
        "Coverage complaints cannot be grounded in live network status during the conversation",
        "Onboarding abandonment is not detected or recovered conversationally",
        "No conversational voice service in Mandarin despite a meaningful Chinese-Malaysian subscriber segment",
      ],
    },
    risks: [
      "MCMC service-quality and consumer-protection rules govern complaint handling and require defensible records of what a subscriber was told.",
      "Malaysia's PDPA governs subscriber data use and any proactive outreach, and eKYC-adjacent flows carry additional identity-handling obligations.",
      "Subscriber scale may not yet justify a full multi-channel deployment, so the pilot must be scoped narrowly enough that the unit economics still work at challenger volume.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "These volume, cost and automation figures are seller assumptions from challenger-telco servicing benchmarks and must be validated against Yes 5G's actual subscriber base and contact volumes in discovery.",
    },
    pilotScope:
      "An eight-week Launch pilot containing billing and plan-change contacts on WhatsApp and the careline in Bahasa Malaysia, English and Mandarin, integrated to the billing system and provisioning, measured on containment rate and cost per contact.",
    expansion: [
      "Add coverage and connectivity troubleshooting grounded in live network status",
      "Extend to onboarding and activation recovery for abandoned sign-ups",
      "Introduce proactive usage and bill-shock notifications ahead of billing cycles",
    ],
    stakeholders: [
      "Chief Executive Officer, YTL Communications",
      "Head of Customer Experience",
      "Head of Digital Channels",
      "Chief Technology Officer",
      "Head of Finance / Commercial Planning",
    ],
    discovery: [
      "What is your monthly contact volume across app, chat, social and voice, and what share is billing-related?",
      "What containment does the app achieve today, and which intents consistently escape it to a human?",
      "Can network status at a subscriber location be queried by an external system in real time?",
      "How many subscribers start an activation and never complete it, and is anyone reaching out to them?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Yes 5G subscriber questions a data charge on WhatsApp, gets the bill explained line by line in Mandarin, and switches to a better plan without a call.",
  },

  "tenaga-nasional": {
    operatingContext:
      "Tenaga Nasional is Malaysia's national electricity utility, owning generation, transmission and distribution across Peninsular Malaysia and serving on the order of ten million customer accounts spanning households, businesses and industry. Its customer interface runs through the myTNB app and web portal, a national careline, Kedai Tenaga counters, and social channels, with billing enquiries, outage reports, new-connection applications and meter questions forming the bulk of contact. Tariff reform, the imbalance cost pass-through mechanism and smart-meter rollout have each generated waves of customer questions that arrive faster than the careline can absorb. Storm and flood events produce concentrated outage-reporting surges across specific states, and the customer base genuinely spans Bahasa Malaysia, English, Mandarin and Tamil.",
    strategicPressure: [
      { text: "TNB serves close to ten million customer accounts across Peninsular Malaysia, making it the largest single consumer-contact estate in the country outside telecoms and banking.", kind: "verified" },
      { text: "Periodic tariff and surcharge changes are national news events that generate synchronised bill-shock enquiry surges across the whole customer base within days.", kind: "verified" },
      { text: "Smart-meter rollout creates a distinct and unfamiliar category of customer question — reading discrepancies, estimated bills, meter access — that legacy scripts do not cover.", kind: "inference" },
      { text: "TNB runs large multi-year transformation programmes with systems-integrator partners, so a grounded outage-and-billing agent fits an existing modernisation narrative rather than requiring a new one.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. TNB has substantial internal IT and runs major digital programmes, but it delivers them through systems integrators and enterprise vendors under public-sector-style procurement. It has the governance maturity to run a complex deployment and no tradition of building customer-facing AI platforms in-house.",
    whyNotBuild:
      "A utility's engineering identity is grid assets and reliability. Even with a large IT function, TNB procures rather than develops customer-facing platforms, and the four capabilities in question — four-language speech, national-scale telephony, orchestration into billing and outage systems, and evaluation of every conversation — would each need a specialist team that carries no regulated-asset return.",
    workflows: [
      {
        name: "Outage reporting and restoration-status updates",
        friction: "A storm knocks out supply and thousands of customers call simultaneously; the careline saturates, each caller reports the same outage separately, and nobody receives a restoration estimate.",
        outcome: "Outage reports absorbed at any volume, grouped against known incidents, with restoration estimates pushed proactively so the repeat-call wave never forms.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["Outage management system", "SCADA and network status", "Customer information system", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Billing enquiry and tariff-change explanation",
        friction: "A tariff or surcharge change produces a synchronised national spike of bill-shock calls, answered by agents reading a generic explanation without the customer's own consumption in front of them.",
        outcome: "Each customer's actual bill explained against their own consumption and the specific tariff component that changed, in their language, at unlimited concurrency.",
        channels: ["Voice", "WhatsApp", "App", "Web chat"],
        systems: ["Customer information and billing system", "Meter data management", "Tariff rules engine"],
        value: 3, complexity: 2,
      },
      {
        name: "New-connection and supply-application support",
        friction: "New-connection applications from households, developers and businesses stall on missing documents or unclear next steps, and applicants call repeatedly for status with no push notification.",
        outcome: "Guided application with document validation in-flow and automatic stage notifications, converting a multi-call process into a tracked conversation.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Connection application workflow", "Document management", "Customer information system", "Field scheduling"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "The myTNB app and web portal for billing, payment and outage reporting",
        "A national careline with menu-driven routing across billing and technical issues",
        "Kedai Tenaga walk-in counters for applications and account transactions",
        "Social-media channels used heavily for outage reporting and public updates",
      ],
      gaps: [
        "Customers cannot get a grounded restoration estimate for their own address during an outage",
        "Bill-shock enquiries cannot be answered against the customer's own consumption without a human",
        "No conversational voice service in Mandarin or Tamil despite a genuinely four-language customer base",
        "New-connection applicants have no proactive status push and must chase by phone",
      ],
    },
    risks: [
      "As a regulated utility under Energy Commission oversight, statements about restoration times, tariffs and compensation carry regulatory and reputational weight and must be grounded, never generated.",
      "Malaysia's PDPA governs consumption and account data used to personalise answers, and public-sector-adjacent procurement adds data-residency and security-clearance requirements.",
      "Genuine four-language coverage including Tamil is a fairness expectation for a national utility, and partial coverage would attract political criticism.",
    ],
    economics: {
      volumeMonthly: 2400000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Monthly interaction volume, cost per contact and automation rate are seller assumptions derived from national-utility contact benchmarks scaled to TNB's account base, and require validation against TNB careline and myTNB channel reporting.",
    },
    pilotScope:
      "A twelve-week Scale pilot handling outage reporting with grounded restoration status and billing enquiries on voice and WhatsApp in four languages, integrated to the outage management and customer information systems, measured on repeat-call suppression during a storm event.",
    expansion: [
      "Extend to new-connection and supply-application support with document validation",
      "Add proactive planned-maintenance and tariff-change outreach to affected customer segments",
      "Introduce a commercial and industrial account desk with dedicated escalation paths",
    ],
    stakeholders: [
      "Chief Retail Officer / Head of Distribution Network",
      "Chief Information Officer",
      "Head of Customer Service Operations",
      "Head of Digital Transformation",
      "Chief Financial Officer / Head of Procurement",
    ],
    discovery: [
      "What happens to careline answer rate and abandonment during a major storm outage, and how many of those calls are duplicates of the same incident?",
      "Can restoration estimates from the outage management system be exposed at address level to an external agent?",
      "Which systems integrator currently holds the customer-experience workstream in your transformation portfolio?",
      "How large was the enquiry spike following the most recent tariff adjustment, and how was it absorbed?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Penang household reports a blackout to TNB on WhatsApp during a storm and receives a grounded restoration estimate for their own street instead of a busy tone.",
  },

  "air-selangor": {
    operatingContext:
      "Air Selangor is the sole licensed water operator for Selangor, Kuala Lumpur and Putrajaya, supplying treated water to millions of household and commercial accounts across Malaysia's most densely populated conurbation. Its contact profile is bimodal: a steady baseline of billing, meter and account queries, and violent surges whenever an unscheduled supply disruption or a river-pollution incident forces treatment plants offline across whole districts. Customers reach it through a careline, the Air Selangor mobile app, a web portal and social media, where disruption complaints are highly visible and politically charged. The customer base is predominantly Bahasa Malaysia and English speaking, with Mandarin and Tamil present across the Klang Valley.",
    strategicPressure: [
      { text: "Unscheduled water-supply disruptions in the Klang Valley affect hundreds of thousands of accounts at once and are consistently high-profile public and political events.", kind: "verified" },
      { text: "River-pollution incidents forcing treatment-plant shutdowns are a recurring cause of these disruptions and are outside the operator's control, making communication the only manageable variable.", kind: "verified" },
      { text: "During a disruption, customers want one thing — a credible restoration time for their own area — and the careline structurally cannot deliver it at that volume.", kind: "inference" },
      { text: "As a state-linked operator, its performance on disruption communication is scrutinised by state government as well as customers, making this a reputational priority above its cost value.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Air Selangor is a water operator whose technical capability is treatment, distribution and network asset management. Its digital channels are vendor-built, and it has no software organisation that could take on conversational infrastructure.",
    whyNotBuild:
      "There is no plausible route from a water utility's operating model to owning speech recognition, telephony, orchestration and evaluation engineering. What it needs is elastic capacity on the worst day of the year, grounded in its own disruption data, which is precisely a bought capability configured against its systems.",
    workflows: [
      {
        name: "Supply-disruption notification and restoration status",
        friction: "A treatment-plant shutdown triggers a call and social-media surge; the careline melts, agents read a generic statement, and customers with no restoration estimate call repeatedly and post publicly.",
        outcome: "Affected accounts notified proactively by area with a grounded restoration estimate, and unlimited concurrent enquiry handling so the queue never forms.",
        channels: ["WhatsApp", "Voice", "SMS", "App"],
        systems: ["Disruption and incident management", "Network and zone mapping", "Customer information system", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Water-tanker request and scheduling during disruptions",
        friction: "Residents and building managers phone repeatedly to request tanker deliveries; requests are logged manually, duplicated across callers from the same building, and dispatch has no view of true demand.",
        outcome: "Tanker requests captured and de-duplicated by location, prioritised against actual demand, and confirmed back to requesters with a slot.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Tanker dispatch and logistics", "Incident management", "Customer information system", "Zone mapping"],
        value: 3, complexity: 3,
      },
      {
        name: "Billing, meter and account servicing",
        friction: "High-bill queries, meter-reading disputes and account transfers require a careline call or counter visit, and the same handful of explanations are given thousands of times a month.",
        outcome: "Consumption-grounded bill explanations, meter-reading queries and account changes handled conversationally in Bahasa Malaysia and English without a human.",
        channels: ["WhatsApp", "Voice", "App", "Web chat"],
        systems: ["Billing system", "Meter data", "Customer information system", "Payment gateway"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer careline handling billing and disruption enquiries",
        "The Air Selangor mobile app with account, billing and disruption-notice features",
        "A web portal publishing scheduled and unscheduled disruption notices by area",
        "Social-media channels that function as the de facto real-time disruption channel",
      ],
      gaps: [
        "Customers cannot get a restoration estimate specific to their own address during a disruption",
        "Tanker requests are taken manually with heavy duplication and no confirmed slot back to the requester",
        "No proactive push to affected accounts when a disruption begins or when restoration progresses",
        "Bill and meter disputes still require a human or a counter visit",
      ],
    },
    risks: [
      "Restoration-time statements carry political and regulatory weight under state water-services oversight, so an agent must only relay grounded operational data and never estimate independently.",
      "Malaysia's PDPA governs the account and location data used to target disruption notifications and requires consent evidence for proactive contact channels.",
      "Disruption data must be available in real time and mapped to supply zones, or the agent will confidently give wrong answers at the worst possible moment.",
    ],
    economics: {
      volumeMonthly: 340000,
      costPerInteraction: 1.0,
      automationRate: 0.62,
      basis: "Volume, unit cost and automation rate are seller assumptions from utility contact-centre benchmarks scaled to the Klang Valley account base, to be validated against Air Selangor's careline and app channel data.",
    },
    pilotScope:
      "An eight-week Launch pilot delivering proactive disruption notification and grounded restoration-status answers on WhatsApp and the careline in Bahasa Malaysia and English for a defined set of supply zones, measured on call-volume suppression during the next unscheduled disruption.",
    expansion: [
      "Add tanker request capture, de-duplication and slot confirmation integrated to dispatch",
      "Extend to billing, meter and account servicing across all channels",
      "Introduce planned-maintenance pre-notification and post-restoration confirmation outreach",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer / Head of Distribution",
      "Head of Customer Experience",
      "Head of Corporate Communications",
      "Chief Information Officer",
    ],
    discovery: [
      "During the last unscheduled disruption, how many calls arrived and what was the abandonment rate?",
      "Is disruption and restoration data available in real time and mapped to supply zones an agent could query by address?",
      "How are tanker requests captured today, and how much duplication do you estimate?",
      "Who owns disruption communication between operations and corporate communications, and how fast can a message go out?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Petaling Jaya resident asks Air Selangor on WhatsApp when water returns to their block and gets a zone-specific restoration estimate plus a tanker slot, instead of a busy careline.",
  },

  "gas-malaysia": {
    operatingContext:
      "Gas Malaysia distributes and sells natural gas through the Peninsular Gas Utilisation pipeline network to industrial, commercial and a smaller set of residential customers, and has expanded into distributed energy and virtual pipeline services. Its revenue is dominated by industrial and commercial accounts — manufacturers, hotels, hospitals and food processors — where the relationship is account-managed rather than mass-market, while residential and small-commercial customers deal with billing, new-connection and safety matters through a customer line. Contact volume is modest by utility standards but carries unusual weight: a mishandled gas-odour or leak report is a safety event, not a service failure. Its customers span Bahasa Malaysia and English, with Mandarin common among small-business owners.",
    strategicPressure: [
      { text: "Gas Malaysia's volume is concentrated in industrial and commercial accounts, so its service model is account-managed rather than call-centre-scaled, and consumer-style automation must respect that.", kind: "verified" },
      { text: "Safety-related contacts such as gas-odour and suspected-leak reports must reach a qualified human response path within minutes, which sets a hard non-automation boundary.", kind: "verified" },
      { text: "Regulated tariff structures and the gas market liberalisation framework generate periodic pricing questions from commercial customers that account teams answer manually and inconsistently.", kind: "inference" },
      { text: "New-connection applications for commercial premises involve technical assessment, documentation and scheduling steps where applicants currently chase status by phone.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. This is a lean, focused gas distribution utility whose technical capability is pipeline engineering and metering. Its IT function runs billing, SCADA-adjacent systems and enterprise applications procured from vendors; conversational infrastructure has no path to being built here.",
    whyNotBuild:
      "Even large utilities buy this stack, and Gas Malaysia's contact volume would never amortise the engineering cost of speech, telephony, orchestration and evaluation. What it needs is a narrow, safety-aware deployment with rigorous escalation rules — a configuration problem on a bought platform, not a development programme.",
    workflows: [
      {
        name: "Billing and consumption enquiry handling",
        friction: "Commercial customers question gas charges and consumption against a tariff structure agents explain from memory, so answers vary and disputes escalate to account managers.",
        outcome: "Consumption and tariff components explained against the customer's own meter data, consistently, with disputes raised into the right queue with evidence attached.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Billing system", "Meter data management", "Tariff rules", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "New-connection application support and status",
        friction: "Applicants for commercial and residential connections submit incomplete documentation, then phone repeatedly for status through a multi-stage technical assessment process.",
        outcome: "Guided application with document checks in-flow and automatic stage notifications, removing the chase calls and shortening time to connection.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Connection application workflow", "Document management", "Field scheduling", "CRM"],
        value: 2, complexity: 3,
      },
      {
        name: "Safety-report intake with immediate human escalation",
        friction: "Gas-odour and suspected-leak reports arrive on the same line as billing queries and can queue behind them, which is unacceptable for a safety contact.",
        outcome: "Safety intent recognised instantly in any language, safety instructions delivered, and the report routed to the emergency response path ahead of all other traffic with full context.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Emergency response dispatch", "Customer information system", "Network asset data", "Incident logging"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer service line covering billing, connections and emergency reporting",
        "A web portal and online billing access for account holders",
        "Named account managers serving industrial and large commercial customers",
        "Published safety guidance and an emergency contact number",
      ],
      gaps: [
        "Consumption and tariff questions cannot be answered against the customer's own meter data without a human",
        "Connection applicants have no proactive status updates through a long technical process",
        "No after-hours conversational handling of non-emergency enquiries",
        "Safety reports and routine enquiries share one entry point with no intent-based prioritisation",
      ],
    },
    risks: [
      "Safety contacts are an absolute human-escalation boundary — the agent may deliver standard safety instructions and route, and must never diagnose or reassure about a suspected leak.",
      "Energy Commission regulation of gas distribution and tariffs means pricing statements must be grounded in published tariff data, not generated.",
      "Malaysia's PDPA and industrial-customer confidentiality govern consumption data, which for manufacturing customers can reveal commercially sensitive production patterns.",
    ],
    economics: {
      volumeMonthly: 45000,
      costPerInteraction: 1.4,
      automationRate: 0.45,
      basis: "Volume, cost per interaction and automation rate are seller assumptions based on small-utility contact benchmarks and must be validated against Gas Malaysia's actual customer-line and account-management contact data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling billing and consumption enquiries plus safety-intent triage on the customer line and WhatsApp in Bahasa Malaysia and English, integrated to billing and meter data, with a hard escalation path for any safety contact.",
    expansion: [
      "Add new-connection application guidance with document validation and status push",
      "Extend to an industrial and commercial account-support desk with consumption reporting",
      "Introduce proactive planned-maintenance and supply-interruption notifications",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Customer Service",
      "Head of Health, Safety and Environment",
      "Head of Information Technology",
    ],
    discovery: [
      "What is your monthly contact volume across the customer line, and what share is billing versus connections versus safety?",
      "What is the mandated response protocol for a gas-odour report, and where exactly must a human take over?",
      "Can meter and consumption data be queried per account in real time by an external system?",
      "How long does a commercial new-connection application take end to end, and how many status chase calls does it generate?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Seremban factory manager questions a gas invoice on WhatsApp and gets consumption and tariff components explained against their own meter data in one exchange.",
  },

  "malaysia-airlines": {
    operatingContext:
      "Malaysia Airlines is the national full-service carrier operating under Malaysia Aviation Group, flying a domestic, regional and long-haul network from Kuala Lumpur alongside Firefly and MASwings within the group, with the Enrich loyalty programme as its customer relationship anchor. Passengers reach it through a global contact centre, the website and app, airport counters, travel agents and social messaging, with the contact mix dominated by booking changes, disruption rebooking, refund status, baggage issues and Enrich servicing. Long-haul and connecting itineraries mean a single disruption cascades across multiple onward segments and time zones, multiplying the servicing burden per affected passenger. Post-restructuring, cost discipline and margin recovery are explicit board-level mandates for the group.",
    strategicPressure: [
      { text: "Malaysia Airlines was restructured under Malaysia Aviation Group with sovereign-fund backing, making sustained cost discipline and margin recovery an explicit board-level mandate.", kind: "verified" },
      { text: "A connecting long-haul network means one delay generates rebooking work across multiple onward segments and time zones per passenger, not one interaction.", kind: "verified" },
      { text: "Disruption events produce contact spikes an order of magnitude above baseline, which no fixed contact-centre staffing model can economically absorb.", kind: "inference" },
      { text: "Refund-status enquiries are a persistent, low-value but high-volume contact category that consumes premium agent capacity better spent on complex itineraries.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. MAG runs meaningful digital programmes and has modernised its commercial systems, but it delivers transformation through technology partners rather than in-house platform development. It has the governance and integration maturity for a complex deployment and no appetite to own conversational infrastructure.",
    whyNotBuild:
      "An airline's engineering priorities are network, revenue management, operations control and safety systems. Speech across Bahasa Malaysia, English and Mandarin, global telephony, orchestration into PSS and loyalty systems, and evaluation of every conversation are four disciplines an airline recovering margin will not staff — especially when the value is available immediately from a configured platform.",
    workflows: [
      {
        name: "Disruption rebooking and proactive passenger notification",
        friction: "A cancellation triggers a call-volume spike; passengers queue for an hour while an agent reads rebooking options one at a time, and connecting passengers discover the problem at the airport.",
        outcome: "Affected passengers messaged before they call, with live rebooking options offered in-channel and confirmed in one tap, and the spike absorbed without added headcount.",
        channels: ["WhatsApp", "App", "Voice", "SMS", "Email"],
        systems: ["Passenger service system", "Departure control", "Operations control disruption feeds", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Refund-status and ticket-change servicing",
        friction: "Refund enquiries occupy agents who can only read the same pending status, and passengers call weekly because nothing is pushed when the state changes.",
        outcome: "Live refund state retrieved from the payments pipeline and pushed on every change, removing a whole category of repeat contact.",
        channels: ["WhatsApp", "App", "Voice", "Email"],
        systems: ["Passenger service system", "Refund and payments pipeline", "CRM", "Notification platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Enrich loyalty servicing and award redemption support",
        friction: "Enrich members call about points, tier status, expiry and award availability, and complex redemption questions consume long agent handling times for no incremental revenue.",
        outcome: "Points, tier and expiry answered instantly in the member's language, with award availability checked and simple redemptions completed conversationally.",
        channels: ["WhatsApp", "App", "Voice", "Web chat"],
        systems: ["Loyalty platform", "Passenger service system", "Award inventory", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A global contact centre with menu-driven routing and regional numbers",
        "The Malaysia Airlines app and website with self-service booking management",
        "Enrich loyalty servicing through digital channels and a dedicated member line",
        "Active social-messaging support used heavily during disruptions",
      ],
      gaps: [
        "No proactive, actionable rebooking push to affected passengers before they contact the airline",
        "Refund status is pull-only, so status chasing remains a dominant contact driver",
        "No conversational voice self-service in Bahasa Malaysia or Mandarin beyond menu navigation",
        "Connecting-itinerary disruption cannot be resolved end-to-end in a single conversation",
      ],
    },
    risks: [
      "Malaysian Aviation Commission consumer-protection rules on delays, cancellations and refunds set entitlements an agent must apply exactly and consistently.",
      "Malaysia's PDPA plus cross-border data-transfer considerations apply to a passenger base spanning many jurisdictions, and GDPR reaches European-originating passengers.",
      "Rebooking authority must be bounded by fare rules and inventory reality, with complex multi-leg and interline cases routed to specialists rather than attempted.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 2.2,
      automationRate: 0.5,
      basis: "Interaction volume, cost per contact and automation rate are seller assumptions from full-service-carrier servicing benchmarks and must be validated against MAG's contact-centre and outsourcing cost data in discovery.",
    },
    pilotScope:
      "A twelve-week Scale pilot delivering proactive disruption notification with in-channel rebooking and live refund status on WhatsApp, the app and voice in Bahasa Malaysia, English and Mandarin, measured on disruption-call suppression and rebooking completion rate.",
    expansion: [
      "Add Enrich loyalty and award-redemption servicing across channels",
      "Extend to baggage-tracing and special-assistance request handling",
      "Roll the same deployment into Firefly and MASwings under group governance",
    ],
    stakeholders: [
      "Group Chief Executive Officer, Malaysia Aviation Group",
      "Chief Customer Experience Officer",
      "Chief Operating Officer",
      "Head of Contact Centre and Global Customer Support",
      "Chief Information Officer",
    ],
    discovery: [
      "What does contact volume do on a major disruption day versus baseline, and what does that cost you in overtime and outsourced capacity?",
      "How much of your contact centre is outsourced today, and what is the contractual flexibility to reduce seats?",
      "Can operations control disruption data be consumed in real time to trigger passenger-level outreach?",
      "What share of contacts are refund-status enquiries, and what is the average handling time on them?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A Malaysia Airlines passenger connecting through Kuala Lumpur is messaged about a cancelled onward leg and rebooked in-thread before landing.",
  },

  "batik-air-my": {
    operatingContext:
      "Batik Air Malaysia, formerly Malindo Air, is a hybrid carrier within the Lion Group orbit operating domestic Malaysian routes and regional international services from Kuala Lumpur, positioned above pure low-cost carriers with allowances and inflight service but running on a lean cost base. Passengers reach it through a call centre, the website, airport counters, travel agents and social media, where schedule changes, refund status and baggage issues dominate contact. Its service reputation has been visibly strained by schedule-change and refund handling, a pattern evident in public complaint volumes and consumer-protection commentary. Its passenger mix is largely Malaysian and regional, with Bahasa Malaysia and English the primary service languages.",
    strategicPressure: [
      { text: "Batik Air Malaysia operates a hybrid model with full-service passenger expectations on a lean cost base, which structurally under-resources customer service relative to what passengers expect.", kind: "inference" },
      { text: "Schedule changes and refund handling have attracted sustained public complaint volume in Malaysia, making service recovery a commercial and regulatory exposure.", kind: "inference" },
      { text: "Group priorities across the Lion Group orbit centre on fleet, network and cost, so any service investment must be self-funding within a short window.", kind: "inference" },
      { text: "The Malaysian Aviation Commission has increased scrutiny of carrier consumer-protection performance, raising the cost of poor refund and disruption handling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Batik Air Malaysia has no software organisation and relies on vendor-supplied passenger systems and channels. A packaged deployment that removes refund-status and schedule-change contacts is the only realistic form of intervention.",
    whyNotBuild:
      "A carrier under this cost pressure will not fund speech, telephony, orchestration and evaluation engineering, and its immediate problem is that passengers cannot get an answer this week. Buying delivers containment within a quarter; building is not on the table at any horizon that matters.",
    workflows: [
      {
        name: "Schedule-change notification and rebooking acceptance",
        friction: "Schedule changes are communicated by email or not at all; passengers discover them late, then face a call centre that cannot absorb the resulting volume, and complaints go public.",
        outcome: "Every affected passenger notified in-channel with the change explained and acceptance or alternative options confirmed in one conversation.",
        channels: ["WhatsApp", "SMS", "Email", "Voice"],
        systems: ["Passenger service system", "Schedule management", "Notification platform", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Refund-status enquiry handling",
        friction: "Refund requests sit in an opaque process while passengers call and message repeatedly, and each contact produces the same non-answer, compounding both cost and reputational damage.",
        outcome: "Live refund state retrieved and explained, with automatic notification on every state change so the repeat-contact cycle stops.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Refund workflow", "Payments pipeline", "Passenger service system", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Booking servicing and baggage-policy enquiries",
        friction: "Routine questions about baggage allowance, name changes, seat selection and check-in flood the call centre and social channels, crowding out genuine service recovery cases.",
        outcome: "Routine booking and policy questions contained conversationally in Bahasa Malaysia and English, freeing scarce human capacity for disruption cases.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Passenger service system", "Fare and policy rules", "Payment gateway"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A call centre and airport counters as primary service channels",
        "A website and app supporting booking and check-in",
        "Social-media pages that carry a large share of complaint and enquiry traffic",
        "Travel-agent distribution handling a portion of servicing indirectly",
      ],
      gaps: [
        "Schedule changes are not reliably pushed with an actionable response path",
        "Refund status cannot be self-served, generating repeat contacts per case",
        "No conversational voice self-service in Bahasa Malaysia",
        "Social-channel complaints are handled manually with inconsistent response times",
      ],
    },
    risks: [
      "Malaysian Aviation Commission consumer-protection requirements on refunds and schedule changes define entitlements the agent must state accurately, with penalties for misstatement.",
      "Malaysia's PDPA governs passenger data used for proactive notification and requires a documented consent and channel basis.",
      "Decision rights may sit with group management outside Malaysia, so the buying process must be mapped early or the pilot will stall on approval rather than merit.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 1.6,
      automationRate: 0.55,
      basis: "Volume, unit cost and automation rate are seller assumptions from regional hybrid-carrier benchmarks and require validation against Batik Air Malaysia's own contact-centre and social-channel data.",
    },
    pilotScope:
      "An eight-week Launch pilot automating schedule-change notification with rebooking acceptance and refund-status enquiries on WhatsApp and voice in Bahasa Malaysia and English, measured on repeat-contact reduction and complaint volume.",
    expansion: [
      "Add routine booking servicing and baggage-policy enquiry containment",
      "Extend to proactive disruption-day rebooking with live inventory",
      "Introduce a travel-agent support desk for trade partner enquiries",
    ],
    stakeholders: [
      "Chief Executive Officer, Batik Air Malaysia",
      "Head of Customer Service",
      "Head of Commercial",
      "Head of Information Technology",
      "Head of Ground Operations",
    ],
    discovery: [
      "How many refund cases are open at any time, and how many contacts does an average case generate before closure?",
      "Are schedule changes pushed today, and through which channel with what confirmed delivery rate?",
      "Are customer-service platform decisions made in Kuala Lumpur or by group management?",
      "What has your MAVCOM complaint volume looked like over the last year and what is driving it?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A Batik Air passenger whose Kuching flight moved by four hours is told on WhatsApp, offered alternatives, and rebooked without ever calling.",
  },

  "ktmb": {
    operatingContext:
      "Keretapi Tanah Melayu Berhad operates Malaysia's national railway, running the Electric Train Service intercity network up and down the peninsula, KTM Komuter urban services around the Klang Valley and northern corridor, and freight operations. ETS seat inventory sells out well in advance around Hari Raya, school holidays and long weekends, generating intense booking, waitlist, rescheduling and refund contact through its online ticketing channel, station counters and a customer line. Komuter service disruptions are a recurring public grievance handled largely through social media and station announcements. Its customer base is predominantly Bahasa Malaysia speaking with English as the second service language.",
    strategicPressure: [
      { text: "ETS intercity seats sell out around Malaysian festive periods, concentrating booking, waitlist and refund contact into short, predictable and extremely intense windows.", kind: "verified" },
      { text: "Komuter service disruptions attract sustained public and political criticism, where the complaint is usually about communication rather than the delay itself.", kind: "inference" },
      { text: "As a government-linked entity, KTMB acquires technology through procurement cycles, so a deployment must fit a tender-shaped process rather than a fast commercial close.", kind: "inference" },
      { text: "Station counters still absorb booking and refund transactions that a conversational channel could handle, tying up staff needed for platform operations.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. KTMB is a rail operator whose engineering is rolling stock, track and signalling. Its ticketing and digital channels are vendor-supplied, and there is no internal software organisation that could build or operate conversational infrastructure.",
    whyNotBuild:
      "The organisation has no plausible route to owning speech, telephony, orchestration and evaluation capability, and its acute need is elastic capacity during festive booking peaks and disruption events. That is a bought, configured product, procured through tender, not a development project.",
    workflows: [
      {
        name: "ETS booking, waitlist and rescheduling support",
        friction: "Festive-period seat releases overwhelm the ticketing channel and customer line; passengers cannot find out whether a waitlist will clear, and rescheduling requires a counter visit or a long call.",
        outcome: "Availability, waitlist position and rescheduling handled conversationally in Bahasa Malaysia against live inventory, with payment completed in-channel.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Rail ticketing and reservation system", "Payment gateway", "Passenger records", "Refund workflow"],
        value: 3, complexity: 3,
      },
      {
        name: "Service-disruption notification for Komuter and ETS",
        friction: "Delays and service suspensions are announced at stations and on social media, so commuters already travelling learn late and the customer line saturates with the same question.",
        outcome: "Affected passengers notified proactively by line and station with grounded status and alternative options, suppressing the enquiry surge.",
        channels: ["WhatsApp", "SMS", "Social messaging", "Voice"],
        systems: ["Operations control and disruption data", "Timetable system", "Notification platform", "Ticketing records"],
        value: 3, complexity: 2,
      },
      {
        name: "Refund and ticket-change request handling",
        friction: "Refund requests follow a manual process with counter or form submission, and passengers phone repeatedly for status through a slow settlement cycle.",
        outcome: "Refund eligibility explained against fare rules, requests captured and tracked, and status pushed automatically until settlement.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Ticketing and reservation system", "Refund workflow", "Payments", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "An online ticketing platform and mobile app for ETS booking",
        "Station ticket counters handling booking, change and refund transactions",
        "A customer enquiry line with menu-driven routing",
        "Social-media channels used as the de facto real-time disruption feed",
      ],
      gaps: [
        "Waitlist position and seat availability cannot be checked conversationally during festive demand peaks",
        "Disruption information is broadcast rather than targeted at passengers holding affected tickets",
        "Refund status must be chased manually with no automatic notification",
        "No conversational voice self-service in Bahasa Malaysia for booking or rescheduling",
      ],
    },
    risks: [
      "Government-linked procurement means acquisition runs through a tender process with defined evaluation criteria, so timelines and commercial structure must be planned around it.",
      "Malaysia's PDPA governs passenger records used for targeted disruption notification and requires a documented consent basis for messaging channels.",
      "Any booking or refund action requires write integration into the ticketing platform, and its openness to external orchestration is the single biggest feasibility unknown.",
    ],
    economics: {
      volumeMonthly: 260000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Volume, unit cost and automation rate are seller assumptions from rail-operator contact benchmarks and must be validated against KTMB's ticketing-channel, counter and customer-line data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling ETS booking, availability and rescheduling enquiries plus targeted disruption notifications on WhatsApp and the customer line in Bahasa Malaysia and English, measured through one festive booking peak.",
    expansion: [
      "Add refund eligibility handling and automatic settlement-status push",
      "Extend disruption notification across the full Komuter network with alternative-route guidance",
      "Introduce station-counter deflection targets with in-channel payment for booking changes",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Commercial and Passenger Services",
      "Head of Information Technology",
      "Head of Corporate Communications",
    ],
    discovery: [
      "What happens to your ticketing channel and customer line during the Hari Raya seat release, and how many enquiries do you lose?",
      "Can the ticketing platform accept booking changes and refunds from an external orchestration layer?",
      "Is real-time disruption data available in a form that can be matched to passengers holding affected tickets?",
      "What procurement route would a deployment like this follow, and what is the realistic timeline?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A traveller chasing an ETS seat to Ipoh for Hari Raya checks waitlist position on WhatsApp in Bahasa Malaysia and rebooks onto a released seat in the same conversation.",
  },

  "prasarana": {
    operatingContext:
      "Prasarana Malaysia is the state-owned operator of Kuala Lumpur's rail and bus public transport, running the Kelana Jaya and Ampang LRT lines, the KL Monorail, MRT operations and the Rapid bus networks in the Klang Valley, Penang, Kuantan and Kamunting under the Rapid brands. It moves well over a million passenger journeys on a typical weekday, with contact driven by service disruptions, concession-card and Touch n Go-linked fare issues, lost property, route and journey planning, and bus-service complaints. Riders reach it through the Rapid customer line, station and hub counters, the app, and heavily through social media where disruption complaints play out publicly. Its rider base is multilingual, with Bahasa Malaysia and English dominant and Mandarin and Tamil present across the Klang Valley.",
    strategicPressure: [
      { text: "Prasarana carries well over a million public transport journeys on a typical weekday across LRT, MRT, monorail and bus operations in the Klang Valley.", kind: "verified" },
      { text: "Rail service disruptions in Kuala Lumpur become immediate public and political events, and criticism concentrates on the speed and clarity of communication.", kind: "verified" },
      { text: "Concession-card and fare-media issues generate steady counter and call volume that has no self-service path for riders without app fluency.", kind: "inference" },
      { text: "As a government-linked company, technology is acquired through procurement, and public-accountability incentives make proactive disruption communication a board-level reputational priority.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Prasarana is a transit operator whose engineering capability is rolling stock, signalling and fleet maintenance. Digital channels are vendor-delivered and technology is procured, so conversational capability arrives as a bought platform configured against its operations data.",
    whyNotBuild:
      "A public transport operator has no reason to develop speech, telephony, orchestration or evaluation engineering, and building would consume years while the reputational problem is happening every week. The differentiator is grounding answers in real disruption data, which is an integration task on a bought platform.",
    workflows: [
      {
        name: "Service-disruption enquiry handling and proactive alerts",
        friction: "A line fault sends thousands of riders to social media and the customer line simultaneously; the same question is answered manually hundreds of times and riders already on platforms learn nothing.",
        outcome: "Grounded, line-specific status and alternative routing delivered at unlimited concurrency, with proactive alerts to riders subscribed on affected lines.",
        channels: ["WhatsApp", "Social messaging", "Voice", "App"],
        systems: ["Operations control and service status", "Timetable and routing data", "Notification platform", "Rider subscription records"],
        value: 3, complexity: 2,
      },
      {
        name: "Concession-card and fare-media servicing",
        friction: "Card blocks, balance disputes, student and senior concession applications and replacements require a counter visit or a long call, concentrated at a handful of hubs.",
        outcome: "Card issues diagnosed and eligible actions executed conversationally, with applications guided and documents captured in-thread instead of at a counter.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Fare collection and card management", "Concession eligibility records", "Customer records", "Payment gateway"],
        value: 2, complexity: 3,
      },
      {
        name: "Lost property and journey-planning enquiries",
        friction: "Lost-item reports are taken by phone or counter and matched manually across stations and depots, while routine route and fare questions consume the same scarce capacity.",
        outcome: "Structured lost-item intake matched automatically against found-item records with status pushed, and routing and fare questions answered instantly in four languages.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Lost property register", "Station and depot records", "Routing and fare data", "CRM"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A Rapid customer enquiry line and station and hub customer-service counters",
        "A journey-planning and service-status mobile app",
        "Social-media channels used as the primary real-time disruption communication route",
        "Published service-status pages and station announcements",
      ],
      gaps: [
        "Riders cannot get a grounded, line-specific restoration estimate during a disruption",
        "Concession-card problems almost always require a counter visit",
        "Lost-property reporting has no tracked status back to the rider",
        "No conversational service in Mandarin or Tamil despite a multilingual Klang Valley ridership",
      ],
    },
    risks: [
      "Government-linked procurement governs acquisition, and Land Transport-sector coordination means disruption messaging responsibility may be shared with other agencies.",
      "Malaysia's PDPA governs rider and concession-holder data, with additional sensitivity around student and senior concession records.",
      "Service-status statements are politically scrutinised, so the agent must relay only grounded operations data and never estimate restoration times independently.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Volume, unit cost and automation rate are seller assumptions from urban-transit contact benchmarks scaled to Klang Valley ridership, and require validation against Prasarana's customer-line, counter and social-channel data.",
    },
    pilotScope:
      "An eight-week Launch pilot delivering grounded disruption status and alternative-routing answers on WhatsApp, social messaging and the customer line in Bahasa Malaysia and English for the LRT lines, measured on enquiry containment during the next major disruption.",
    expansion: [
      "Add proactive disruption alerts to riders subscribed by line and station",
      "Extend to concession-card servicing and application guidance with document capture",
      "Introduce lost-property intake with automated matching and status push, plus Mandarin and Tamil coverage",
    ],
    stakeholders: [
      "President and Group Chief Executive Officer",
      "Chief Operating Officer, Rail Operations",
      "Head of Customer Experience",
      "Head of Corporate Communications",
      "Chief Information Officer",
    ],
    discovery: [
      "During your last major LRT disruption, how many enquiries arrived across the customer line and social channels, and how were they handled?",
      "Is real-time service status available to an external system at line and station granularity?",
      "How many concession-card transactions require a counter visit each month, and which of those could be done remotely?",
      "How is disruption communication responsibility divided between Prasarana and the transport authority?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Rapid KL commuter stuck at Masjid Jamek asks what is happening on WhatsApp and gets a grounded line status plus a bus-bridging option in Bahasa Malaysia.",
  },

  "pantai-gleneagles-my": {
    operatingContext:
      "IHH Healthcare's Malaysian operations run the Pantai Hospitals and Gleneagles Hospitals networks, together forming one of the country's largest private hospital groups with campuses across Kuala Lumpur, Penang, Johor, Melaka and other states. The patient mix combines Malaysian private and insured patients with a significant medical-travel inflow, particularly from Indonesia, where families research, price and book treatment remotely before travelling. Contact runs through hospital call centres, specialist clinic lines, an appointment platform, health-screening enquiry desks and an international patient centre, with appointment booking, specialist availability, package pricing and insurance eligibility dominating volume. Language needs span Bahasa Malaysia, English, Mandarin and Bahasa Indonesia for the medical-travel segment.",
    strategicPressure: [
      { text: "IHH is one of the largest private healthcare groups in Asia and operates both Pantai and Gleneagles networks in Malaysia across more than a dozen campuses.", kind: "verified" },
      { text: "Malaysia is a major regional medical-travel destination, with Indonesian patients forming the largest inbound source market for private hospitals.", kind: "verified" },
      { text: "Appointment and enquiry handling is fragmented per hospital, so a patient calling the group experiences a different process depending on which campus answers.", kind: "inference" },
      { text: "Medical-travel enquiries are high-value and highly time-sensitive — a slow or unanswered price-and-availability question is lost to a Singaporean or Thai competitor.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. IHH runs group-level digital programmes and has the governance to standardise across markets, but delivers through technology partners rather than building customer-facing platforms. Malaysia is a natural high-volume proving ground for a group-standard deployment.",
    whyNotBuild:
      "A hospital group's technology investment goes to clinical systems, electronic medical records and diagnostic infrastructure, all of which carry patient-safety obligations that consume the available engineering governance. Multilingual speech, telephony, orchestration into scheduling systems and per-conversation evaluation are outside that remit and would be bought under group vendor assurance.",
    workflows: [
      {
        name: "Cross-network appointment booking and specialist matching",
        friction: "A patient calls one hospital, is told the specialist has no slot, and must call another campus and start over; each hospital's line has its own queue and its own booking process.",
        outcome: "One conversational front door that matches the patient to an available specialist across the Malaysian network and books the slot in the live schedule.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Hospital information system", "Specialist scheduling", "Patient master index", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Health-screening package enquiry and conversion",
        friction: "Screening enquiries arrive as calls and web forms asking about package contents and price; response is delayed and inconsistent, and a high-margin, high-volume service leaks conversion.",
        outcome: "Package details and pricing answered instantly and consistently in the enquirer's language, with the screening appointment booked in the same conversation.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Package and pricing catalogue", "Scheduling system", "CRM", "Payment gateway"],
        value: 3, complexity: 2,
      },
      {
        name: "International-patient coordination and pre-arrival guidance",
        friction: "Indonesian and regional families coordinate estimates, visas, transfers and appointment sequencing through email and phone across time zones, with slow responses losing the case to competitors.",
        outcome: "Around-the-clock coordination in Bahasa Indonesia and English covering estimates, document requirements and appointment sequencing, with human coordinators handling the clinical complexity.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["International patient centre records", "Scheduling", "Cost-estimate tooling", "CRM"],
        value: 3, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Hospital-level call centres and specialist clinic appointment lines",
        "An online appointment request and enquiry platform across the networks",
        "Dedicated international patient centres serving medical-travel enquiries",
        "Health-screening enquiry desks and published package information",
      ],
      gaps: [
        "No single front door that can find and book an available specialist across all Malaysian campuses",
        "Enquiries outside office hours, including from other time zones, go unanswered until the next working day",
        "Cost estimates and insurance eligibility cannot be answered conversationally without a human",
        "No Bahasa Indonesia conversational coverage despite it being the largest medical-travel source language",
      ],
    },
    risks: [
      "Malaysia's PDPA and healthcare confidentiality obligations govern patient data, and medical-travel cases involve cross-border transfer that must be explicitly designed for.",
      "Anything clinical — symptom interpretation, triage, treatment suitability — is a hard human boundary; the agent may schedule and inform, never advise.",
      "Ministry of Health and Malaysia Healthcare Travel Council rules constrain how treatment and pricing may be promoted, so package statements must be grounded in approved content.",
    ],
    economics: {
      volumeMonthly: 380000,
      costPerInteraction: 1.9,
      automationRate: 0.5,
      basis: "Volume, cost per interaction and automation rate are seller assumptions from private-hospital-network contact benchmarks and must be validated against IHH Malaysia's call-centre and international-patient-centre data.",
    },
    pilotScope:
      "A twelve-week Scale pilot delivering cross-network appointment booking and health-screening package enquiries on WhatsApp and hospital lines in Bahasa Malaysia, English and Mandarin at a cluster of Pantai and Gleneagles campuses, measured on booking conversion and abandoned-enquiry recovery.",
    expansion: [
      "Add international-patient coordination in Bahasa Indonesia with pre-arrival document guidance",
      "Extend to insurance-eligibility and cost-estimate conversations with payer integration",
      "Propose the deployment as an IHH group standard across other operating markets",
    ],
    stakeholders: [
      "Chief Executive Officer, IHH Malaysia Operations",
      "Chief Operating Officer, Hospital Operations",
      "Head of Patient Experience",
      "Director, International Patient Services",
      "Group Chief Information Officer",
    ],
    discovery: [
      "How many appointment enquiries a month arrive across all Malaysian campuses, and what share go unbooked?",
      "Do all Pantai and Gleneagles hospitals share one scheduling system, or is it campus by campus?",
      "What is your current response time to an international-patient enquiry, and what happens to enquiries received overnight?",
      "Does IHH group digital already have a conversational-AI programme this would need to align with?",
    ],
    flowTemplate: "appointments",
    scenario: "A Jakarta family messages Gleneagles at midnight in Bahasa Indonesia about a cardiology consultation and gets a specialist slot, an estimate and document guidance before morning.",
  },

  "kpj-healthcare": {
    operatingContext:
      "KPJ Healthcare operates Malaysia's largest domestic private-hospital network, with dozens of hospitals and specialist centres distributed across every state, majority-owned through Johor Corporation and serving a broad middle-market patient base alongside a growing health-tourism intake. Its estate is deliberately decentralised — hospitals operate with local management, local consultant panels and, historically, variable systems — which makes the patient experience differ from campus to campus. Patients reach it through hospital switchboards and clinic lines, the KPJ appointment app and website, walk-in counters and increasingly WhatsApp, with appointment booking, specialist availability, insurance guarantee-letter status and pre-admission coordination dominating contact. Service languages are Bahasa Malaysia, English and Mandarin, with Bahasa Indonesia relevant for the medical-travel segment.",
    strategicPressure: [
      { text: "KPJ operates the largest domestic private-hospital network in Malaysia by number of hospitals, spread across every state rather than concentrated in the Klang Valley.", kind: "verified" },
      { text: "A decentralised hospital estate means each campus runs its own booking and enquiry process, so a group-level patient experience does not currently exist.", kind: "inference" },
      { text: "Insurance and guarantee-letter coordination sits between hospital admissions, insurers and third-party administrators, and is a persistent source of patient frustration and repeat contact.", kind: "inference" },
      { text: "A health-tourism push targeting Indonesian patients raises the cost of unanswered after-hours and non-Malay-language enquiries.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. KPJ is a hospital operator without platform engineering; its technology function focuses on hospital information systems and clinical applications procured from healthcare vendors. A centralised conversational layer that sits above a fragmented estate is exactly the kind of capability it would buy rather than construct.",
    whyNotBuild:
      "The organisation's scarce technical capacity is consumed by standardising clinical systems across dozens of hospitals — a programme that competes directly with any notion of building conversational infrastructure. Speech, telephony, orchestration and evaluation would each need specialist teams that carry no clinical return.",
    workflows: [
      {
        name: "Network-wide appointment booking and specialist availability",
        friction: "A patient calls a hospital switchboard, is transferred to a clinic, and finds the consultant fully booked; there is no way to see availability at a nearby KPJ hospital without starting again.",
        outcome: "One front door that finds available consultants across the network, books into the live schedule and confirms in the patient's language.",
        channels: ["WhatsApp", "Voice", "Web chat", "App"],
        systems: ["Hospital information systems", "Consultant scheduling", "Patient master index", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Insurance eligibility and guarantee-letter status",
        friction: "Patients and admissions staff chase insurers and third-party administrators by phone for guarantee-letter approval, and the patient sits in admissions with no visibility of where the request stands.",
        outcome: "Eligibility position and guarantee-letter status retrieved and pushed to the patient, with exceptions routed to admissions staff with full context attached.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Admissions system", "Insurance and TPA interfaces", "Hospital information system", "Billing"],
        value: 3, complexity: 3,
      },
      {
        name: "Pre-admission preparation and health-screening booking",
        friction: "Pre-admission instructions, fasting requirements, document lists and screening package details are communicated inconsistently by phone, causing cancellations and rescheduling on the day.",
        outcome: "Structured pre-admission guidance and reminders delivered in the patient's language with confirmation captured, cutting day-of cancellations and empty slots.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Scheduling system", "Pre-admission workflow", "Package catalogue", "Notification platform"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Hospital switchboards and clinic appointment lines at every campus",
        "A group appointment app and website for booking requests",
        "Walk-in admissions and customer-service counters at each hospital",
        "WhatsApp lines operated informally by individual hospitals and clinics",
      ],
      gaps: [
        "No network-level view of consultant availability a patient can act on",
        "Guarantee-letter and insurance status is opaque to the patient until admission",
        "After-hours enquiries, including from Indonesian medical travellers, go unanswered",
        "Pre-admission instructions are inconsistent across hospitals, driving avoidable cancellations",
      ],
    },
    risks: [
      "Malaysia's PDPA and medical confidentiality obligations govern patient identification and record access, requiring strict least-privilege integration into hospital information systems.",
      "Clinical questions are an absolute human boundary — the agent may schedule, inform and prepare, never triage or advise on symptoms.",
      "Estate fragmentation is the main feasibility risk: if hospitals run different information systems, integration cost scales with campus count rather than with the deployment.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 1.6,
      automationRate: 0.5,
      basis: "Volume, cost per interaction and automation rate are seller assumptions from multi-hospital network benchmarks scaled to KPJ's campus count, requiring validation against actual switchboard and clinic contact data.",
    },
    pilotScope:
      "A twelve-week Scale pilot providing cross-network appointment booking and pre-admission guidance on WhatsApp and hospital lines in Bahasa Malaysia, English and Mandarin at a cluster of five hospitals sharing one information system, measured on booking conversion and day-of cancellations.",
    expansion: [
      "Add insurance-eligibility and guarantee-letter status conversations with payer and TPA integration",
      "Extend the deployment across the remaining hospitals as information systems standardise",
      "Introduce Bahasa Indonesia coverage for the health-tourism enquiry channel",
    ],
    stakeholders: [
      "President and Managing Director",
      "Chief Operating Officer, Hospital Operations",
      "Head of Patient Experience / Customer Relations",
      "Head of Group Information Technology",
      "Director of Business Development / Health Tourism",
    ],
    discovery: [
      "How standardised are hospital information systems across the network, and how many distinct scheduling platforms are in use?",
      "How many appointment enquiries a month arrive across switchboards, app and WhatsApp, and what share convert to a booking?",
      "How long does a guarantee-letter approval take today, and who chases it?",
      "What share of enquiries arrive outside working hours and what happens to them?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Seremban asks KPJ on WhatsApp for the earliest orthopaedic slot and is booked at a nearby KPJ hospital the same week, with pre-admission instructions in Bahasa Malaysia.",
  },

  "sunway-medical": {
    operatingContext:
      "Sunway Medical Centre is the flagship private hospital of the Sunway group, anchored on a large integrated campus in Bandar Sunway alongside additional facilities, and is one of Malaysia's largest single-site private hospitals by bed count and specialist coverage. It combines domestic private and insured patients with a growing medical-travel intake, particularly from Indonesia, drawn by its concentration of specialists and its association with the Sunway township, university and hospitality ecosystem. Patients contact it through a hospital call centre, specialist clinic lines, an online appointment and health-screening enquiry channel, and messaging, with appointment scheduling, specialist availability, package pricing and international-patient logistics dominating volume. Its language mix is English, Bahasa Malaysia and Mandarin, with Bahasa Indonesia significant for medical travel.",
    strategicPressure: [
      { text: "Sunway Medical Centre is one of Malaysia's largest single-campus private hospitals and has expanded capacity substantially over the last decade.", kind: "verified" },
      { text: "Concentration on one campus makes the automation problem materially simpler than a distributed estate — one scheduling system, one set of specialists, one set of processes.", kind: "inference" },
      { text: "Medical-travel enquiries from Indonesia are high-value and decided on responsiveness, so unanswered after-hours enquiries convert to competitors in Penang, Singapore or Bangkok.", kind: "inference" },
      { text: "Specialist clinic lines and the call centre absorb a large volume of routine availability and package questions that never needed clinical judgement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Sunway group is diversified across property, education, healthcare and retail but is not a software developer; the hospital's technology function runs clinical and administrative systems from healthcare vendors. Conversational capability would be procured and configured.",
    whyNotBuild:
      "A single-campus hospital has no economic basis for building speech, telephony, orchestration and evaluation capability, and its clinical governance appetite is fully consumed by patient-safety systems. The whole value here is speed to a working multilingual booking channel, which building would delay by years.",
    workflows: [
      {
        name: "Specialist appointment scheduling and availability",
        friction: "Patients call the hospital or a clinic line to find a consultant slot; queues form at opening hours, and the caller has no view of alternative specialists or earlier availability.",
        outcome: "Live schedule searched conversationally, alternatives offered, and the appointment booked and confirmed in the patient's language at any hour.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Hospital information system", "Consultant scheduling", "Patient master index", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "International-patient enquiry and coordination",
        friction: "Indonesian and regional enquirers ask about specialists, cost estimates, visas and accommodation by email and phone across time zones, and slow replies lose high-value cases.",
        outcome: "Around-the-clock coordination in Bahasa Indonesia and English covering specialist matching, estimates and logistics, with human coordinators taking clinical complexity.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["International patient office records", "Scheduling", "Cost estimation", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Health-screening package booking and preparation",
        friction: "Screening enquiries need package explanation and price comparison, then fasting and preparation instructions that are given verbally and frequently forgotten, causing wasted slots.",
        outcome: "Packages explained and booked conversationally with structured preparation reminders, raising screening throughput and cutting no-shows.",
        channels: ["WhatsApp", "SMS", "Voice", "Web chat"],
        systems: ["Package catalogue", "Scheduling system", "Notification platform", "Payment gateway"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A hospital call centre and individual specialist clinic appointment lines",
        "An online appointment request and health-screening enquiry channel",
        "An international patient office serving medical-travel enquiries",
        "Published specialist directories and package information on the website",
      ],
      gaps: [
        "Appointment booking is not completed conversationally against the live schedule outside office hours",
        "No Bahasa Indonesia conversational channel despite it being a primary medical-travel language",
        "Screening preparation instructions are not reliably delivered or confirmed, causing wasted slots",
        "Patients cannot compare specialist availability without calling multiple clinic lines",
      ],
    },
    risks: [
      "Malaysia's PDPA and medical confidentiality govern patient identification and scheduling data, and international-patient cases involve cross-border data handling.",
      "Clinical triage and symptom advice are absolute human boundaries; the agent schedules and informs only.",
      "Advertising and promotion of medical services in Malaysia is regulated, so package and treatment statements must come from approved content rather than being generated.",
    ],
    economics: {
      volumeMonthly: 140000,
      costPerInteraction: 1.8,
      automationRate: 0.55,
      basis: "Volume, cost per interaction and automation rate are seller assumptions from single-campus private-hospital benchmarks and require validation against Sunway Medical Centre's call-centre and clinic-line data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling specialist appointment scheduling and health-screening bookings on WhatsApp and the hospital line in English, Bahasa Malaysia and Mandarin, integrated to the scheduling system, measured on after-hours bookings captured and no-show rate.",
    expansion: [
      "Add international-patient coordination in Bahasa Indonesia with estimate and logistics guidance",
      "Extend to pre-admission preparation and post-discharge follow-up conversations",
      "Introduce insurance-eligibility and billing-estimate handling with payer integration",
    ],
    stakeholders: [
      "Chief Executive Officer, Sunway Healthcare Group",
      "Hospital Director / Chief Operating Officer",
      "Head of Patient Experience",
      "Manager, International Patient Centre",
      "Head of Information Technology",
    ],
    discovery: [
      "What proportion of appointment enquiries arrive outside call-centre hours and what happens to them?",
      "Can the scheduling system be booked into directly by an external orchestration layer, or only read?",
      "How many international-patient enquiries do you receive monthly and what is your current response time?",
      "What is your health-screening no-show rate and is preparation guidance currently confirmed by the patient?",
    ],
    flowTemplate: "appointments",
    scenario: "A Medan patient messages Sunway Medical in Bahasa Indonesia on a Sunday and leaves with a cardiology appointment, a cost estimate and preparation instructions.",
  },

  "sime-darby-property": {
    operatingContext:
      "Sime Darby Property is one of Malaysia's largest property developers by landbank, best known for master-planned townships such as those in the Klang Valley growth corridors, and increasingly for industrial and logistics development alongside residential. Its business runs in long cycles: each township launch produces a concentrated surge of buyer leads through sales galleries, digital campaigns and agents, and each completion wave produces vacant-possession scheduling, defect reporting and warranty-period coordination with hundreds of purchasers at once. Buyer contact happens at sales galleries, through appointed agents, a customer careline and increasingly WhatsApp, in Bahasa Malaysia, English and Mandarin depending on township and price point. Purchaser relationships extend years past the sale through progress billing, handover and defect liability.",
    strategicPressure: [
      { text: "Township development creates two distinct communication surges — launch-period lead volume and completion-period handover and defect coordination — that arrive years apart from the same project.", kind: "verified" },
      { text: "Malaysian residential buyers commonly enquire with several developers simultaneously, so speed of first response materially affects which sales gallery gets the visit.", kind: "inference" },
      { text: "Defect-liability-period handling is a reputational driver for repeat purchase and referral in townships where the developer keeps selling adjacent phases for a decade.", kind: "inference" },
      { text: "A softer Malaysian residential market makes conversion efficiency and cost-per-lead a sharper management focus than in a rising cycle.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. This is a land and township developer whose capability is planning, construction and sales; its technology function runs enterprise systems and a property CRM. There is no software organisation and no reason to create one for buyer communications.",
    whyNotBuild:
      "Property developers buy their CRM, their sales tooling and their customer portals. Speech across three languages, telephony into sales galleries, orchestration into project and defect systems, and per-conversation evaluation are far outside anything a developer staffs, and the value is entirely in configuration speed against a launch calendar.",
    workflows: [
      {
        name: "Township-launch lead qualification and gallery booking",
        friction: "A launch campaign floods the careline and digital forms; sales staff call back hours or days later, by which time the buyer has visited a competitor's gallery, and qualification quality varies by who called.",
        outcome: "Every lead engaged within minutes in their language, qualified on a structured rubric, and booked into a sales-gallery appointment with the consultant's calendar.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Property CRM", "Project and unit inventory", "Sales consultant calendars", "Marketing campaign platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Progress-billing and purchaser-journey enquiries",
        friction: "Purchasers under construction ask about progress-billing stages, loan documentation and completion timing; each question becomes a call to a small customer-relations team that looks it up manually.",
        outcome: "Grounded answers on billing stage, construction progress and documentation drawn from project systems, with stage changes pushed rather than chased.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Project management system", "Progress-billing and finance", "Purchaser records", "Document management"],
        value: 2, complexity: 3,
      },
      {
        name: "Vacant possession and defect-report coordination",
        friction: "A completion wave hands over hundreds of units in weeks; defect reports arrive by form, phone and WhatsApp with no tracking, and purchasers chase rectification status repeatedly.",
        outcome: "Structured defect intake with photos captured in-thread, work orders raised to contractors, and rectification status pushed to each purchaser automatically.",
        channels: ["WhatsApp", "Voice", "Web portal"],
        systems: ["Defect management system", "Contractor work orders", "Purchaser records", "Handover scheduling"],
        value: 3, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Sales galleries with consultants as the primary conversion channel",
        "A customer careline and enquiry forms on project websites",
        "A purchaser portal or portal-equivalent for progress and documentation in some projects",
        "WhatsApp used informally by sales consultants and customer-relations staff",
      ],
      gaps: [
        "Leads are not engaged within the window where they are still choosing between developers",
        "Purchasers cannot self-serve progress-billing or construction-stage answers",
        "Defect reports have no tracked, pushed status back to the purchaser",
        "No consistent multilingual coverage across townships with different buyer demographics",
      ],
    },
    risks: [
      "Malaysia's PDPA governs buyer and purchaser data used for qualification and outreach, with consent required for marketing contact and a clear separation from servicing contact.",
      "Housing development regulation under the Ministry of Local Government Development sets defect-liability obligations and timelines that an agent must state accurately, never estimate.",
      "Pricing, availability and bumiputera-lot statements must be grounded in live inventory and approved content, since misstatement in a sales context creates legal exposure.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 2.0,
      automationRate: 0.5,
      basis: "Lead and purchaser interaction volumes, unit cost and automation rate are seller assumptions from Malaysian developer benchmarks and must be validated against Sime Darby Property's own CRM and careline data across the launch calendar.",
    },
    pilotScope:
      "An eight-week Launch pilot engaging and qualifying leads for one township launch on WhatsApp and voice in Bahasa Malaysia, English and Mandarin, booking sales-gallery appointments into consultant calendars, measured on speed to first contact and gallery attendance rate.",
    expansion: [
      "Extend lead qualification across all active launches and the industrial and logistics portfolio",
      "Add progress-billing and construction-stage enquiry handling for purchasers under construction",
      "Introduce defect-report intake with contractor work-order integration and status push at handover",
    ],
    stakeholders: [
      "Group Managing Director",
      "Chief Marketing Officer / Head of Sales",
      "Head of Customer Relations",
      "Head of Project Delivery",
      "Chief Information Officer",
    ],
    discovery: [
      "What is your median time from lead submission to first human contact during a launch weekend?",
      "Which CRM holds leads today and can an agent write qualified leads and book consultant appointments into it?",
      "How many defect reports does a typical completion wave generate and how are they tracked today?",
      "Which languages dominate enquiries by township, and are your sales teams staffed to match?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A buyer enquiring about a Sime Darby township launch at 11pm is qualified on WhatsApp in Mandarin and holds a Saturday sales-gallery appointment before a competitor calls back.",
  },

  "sp-setia": {
    operatingContext:
      "SP Setia is one of Malaysia's largest listed property developers, with township, high-rise and mixed-use projects across the Klang Valley, Johor, Penang and East Malaysia, plus international projects including in Australia and the United Kingdom. Its purchaser base spans mass-market township buyers to high-rise investors, and each project carries purchasers through years of progress billing, construction milestones, vacant possession and defect liability. Buyer contact runs through sales galleries, appointed agents, project websites, a customer-care line and WhatsApp, in Bahasa Malaysia, English and Mandarin depending on project and price segment. Balance-sheet discipline and inventory clearing have been persistent management themes through a soft residential cycle.",
    strategicPressure: [
      { text: "SP Setia carries a large and diverse project portfolio across Malaysian states and international markets, so purchaser servicing spans many concurrent construction and handover cycles.", kind: "verified" },
      { text: "A soft Malaysian residential market has kept inventory clearing and balance-sheet discipline central to management priorities, which favours measurable conversion and cost improvements.", kind: "verified" },
      { text: "Purchaser servicing is likely organised project by project, so the same question gets different answers depending on which project team handles it.", kind: "hypothesis" },
      { text: "Progress-billing and loan-documentation questions recur predictably at each construction milestone and consume customer-care capacity that could be automated.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. A developer of this type buys its CRM, sales tooling and purchaser portals. Its technology function integrates enterprise systems rather than developing platforms, and a conversational purchaser layer would be procured against a defined business case.",
    whyNotBuild:
      "Nothing in a property developer's operating model produces speech, telephony, orchestration or evaluation engineering, and in a capital-disciplined cycle the only investments that clear the bar are ones with a measurable, near-term return. A configured deployment against progress-billing and defect workflows meets that test; a build does not.",
    workflows: [
      {
        name: "Progress-billing and construction-milestone enquiries",
        friction: "At each billing stage purchasers and their bankers call to confirm milestone completion and documentation requirements; customer care looks each one up manually and answers vary by project.",
        outcome: "Milestone status, billing stage and documentation requirements answered from project systems consistently, with stage notifications pushed before the questions arise.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Project management system", "Progress-billing and finance", "Purchaser records", "Document management"],
        value: 3, complexity: 3,
      },
      {
        name: "Defect reporting and rectification tracking",
        friction: "Handover waves generate defect reports through forms, phone calls and WhatsApp to project teams with no unified tracking; purchasers chase rectification repeatedly and escalate publicly when ignored.",
        outcome: "Structured defect intake with photographic evidence, automatic work-order creation and pushed rectification status per purchaser.",
        channels: ["WhatsApp", "Web portal", "Voice"],
        systems: ["Defect management", "Contractor work orders", "Purchaser records", "Handover scheduling"],
        value: 3, complexity: 3,
      },
      {
        name: "Sales enquiry qualification and viewing bookings",
        friction: "Inventory-clearing campaigns generate enquiry volume that sales teams follow up inconsistently, and viewing appointments are arranged through slow back-and-forth messaging.",
        outcome: "Instant qualification in the buyer's language against a structured rubric, with viewing appointments booked directly into consultant calendars.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Property CRM", "Unit inventory", "Sales consultant calendars", "Campaign platform"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Sales galleries and appointed-agent networks as the primary sales channels",
        "A customer-care line and project enquiry forms",
        "Purchaser portals or portal-equivalents for documentation on some projects",
        "WhatsApp used informally by project and customer-care teams",
      ],
      gaps: [
        "Purchasers cannot self-serve progress-billing or milestone status at any hour",
        "Defect rectification status is not pushed, so chasing dominates post-handover contact",
        "Enquiry follow-up speed varies by project team, leaking conversion during clearing campaigns",
        "No consistent multilingual coverage across a portfolio spanning very different buyer demographics",
      ],
    },
    risks: [
      "Housing development regulation sets defect-liability obligations and progress-billing rules that an agent must state exactly, with any interpretation routed to a human.",
      "Malaysia's PDPA governs purchaser and lead data, requiring separate consent bases for marketing outreach versus purchaser servicing.",
      "Inventory, pricing and bumiputera-release statements must be grounded in live records, since a misstatement in a sales conversation carries contractual exposure.",
    ],
    economics: {
      volumeMonthly: 70000,
      costPerInteraction: 1.9,
      automationRate: 0.5,
      basis: "Purchaser and lead interaction volumes, unit cost and automation rate are seller assumptions from Malaysian developer benchmarks and require validation against SP Setia's customer-care and CRM data across active projects.",
    },
    pilotScope:
      "An eight-week Launch pilot handling progress-billing and construction-milestone enquiries for purchasers across two active projects on WhatsApp and the customer-care line in Bahasa Malaysia, English and Mandarin, measured on enquiry containment and customer-care hours released.",
    expansion: [
      "Add defect-report intake with contractor work-order integration and pushed rectification status",
      "Extend to sales enquiry qualification and viewing bookings for inventory-clearing campaigns",
      "Standardise the deployment across all Malaysian projects and evaluate international portfolio use",
    ],
    stakeholders: [
      "President and Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Customer Relationship Management",
      "Head of Sales and Marketing",
      "Chief Information Officer",
    ],
    discovery: [
      "Is purchaser servicing centralised or handled project by project, and who owns the customer-care number?",
      "Can construction-milestone and progress-billing data be queried per purchaser by an external system?",
      "How many defect reports does a typical handover wave produce and what is the current rectification cycle time?",
      "What is your current cost per qualified lead during a clearing campaign?",
    ],
    flowTemplate: "onboarding",
    scenario: "An SP Setia purchaser asks on WhatsApp when the next progress-billing stage falls due and gets the milestone, the amount and the document list without calling customer care.",
  },

  "perodua": {
    operatingContext:
      "Perodua is Malaysia's best-selling carmaker, producing and selling hundreds of thousands of vehicles a year through a nationwide network of sales dealers and authorised service centres, with Daihatsu and Toyota shareholding shaping its manufacturing and quality operating model. Its customer base is mass-market and price-sensitive, spread across every state and language group, and its relationship with owners continues for years through periodic servicing, parts, warranty and recall campaigns. Contact runs through a customer careline, dealer and service-centre phone lines, the myPerodua app and website, and WhatsApp at dealer level, with service booking, delivery-status enquiries during order backlogs, and parts availability dominating. Order backlogs on popular models have made delivery-timing enquiries a persistent, emotionally charged contact category.",
    strategicPressure: [
      { text: "Perodua is consistently Malaysia's highest-volume carmaker, giving it the largest owner base and the largest after-sales servicing network in the country.", kind: "verified" },
      { text: "Extended delivery backlogs on popular models generate sustained delivery-status enquiry volume that dealers absorb manually with inconsistent answers.", kind: "verified" },
      { text: "After-sales service booking is fragmented across independently-run service centres, so a single owner experience does not exist across the network.", kind: "inference" },
      { text: "Recall and service-campaign communication has to reach owners reliably across four language groups, and today depends on dealer diligence rather than a central channel.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Perodua's engineering identity is vehicle manufacturing and quality systems under a Japanese production model. Its customer-facing digital tooling is vendor-supplied, and network-wide communications capability would be procured centrally and rolled out to dealers.",
    whyNotBuild:
      "An automaker's software investment goes into vehicle systems, manufacturing execution and dealer management systems. Four-language speech, telephony across a dealer network, orchestration into DMS and order systems, and per-conversation evaluation are entirely outside that scope and would be bought — the same conclusion its Japanese shareholders reach globally.",
    workflows: [
      {
        name: "Service-appointment booking across the network",
        friction: "Owners phone individual service centres to book, wait on hold, and take whatever slot is offered; the centre has no view of adjacent capacity and the customer has no view of alternatives.",
        outcome: "Owners book conversationally in their language against live service-centre capacity, with reminders and rescheduling handled in-channel, raising bay utilisation.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Dealer management system", "Service-bay scheduling", "Vehicle and owner records", "Parts availability"],
        value: 3, complexity: 3,
      },
      {
        name: "Vehicle delivery-status updates during order backlog",
        friction: "Customers waiting months for delivery call their salesperson and the careline repeatedly for an estimate nobody can confirm, and the answer varies with who they reach.",
        outcome: "Grounded, consistent delivery-status answers from the order and production pipeline, with proactive updates at each milestone so the chase calls stop.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Order management", "Production and allocation planning", "Dealer management system", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Recall and service-campaign outreach",
        friction: "Recall and campaign notifications rely on letters and dealer follow-up calls, so completion rates depend on dealer effort and owners in some language groups are systematically underserved.",
        outcome: "Every affected owner contacted in their own language with the campaign explained and a service appointment booked in the same conversation, with completion measured centrally.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Vehicle and owner records", "Campaign management", "Service scheduling", "Consent register"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national customer careline for sales and after-sales enquiries",
        "The myPerodua app and website with service booking and owner information",
        "Dealer and service-centre phone lines handling most operational contact locally",
        "WhatsApp used informally by dealers and sales consultants for customer follow-up",
      ],
      gaps: [
        "Owners cannot see or book across service-centre capacity beyond the one centre they called",
        "Delivery-status answers are inconsistent and depend on which salesperson responds",
        "Recall and campaign outreach is not centrally executed or measured across four languages",
        "No after-hours conversational channel for booking or enquiries",
      ],
    },
    risks: [
      "Malaysia's PDPA governs owner records used for proactive campaign and delivery outreach, requiring consent evidence and a defined retention basis.",
      "Recall communication carries safety and regulatory weight, so campaign content must be approved and any technical question routed to qualified staff.",
      "Dealer-network politics are the main operational constraint — service centres own their booking calendars and will resist a central channel that redirects work between them.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.4,
      automationRate: 0.55,
      basis: "Interaction volume, cost per contact and automation rate are seller assumptions from mass-market automotive after-sales benchmarks scaled to Perodua's owner base, requiring validation against careline and dealer contact data.",
    },
    pilotScope:
      "A twelve-week Scale pilot delivering service-appointment booking and delivery-status enquiries on WhatsApp and the careline in Bahasa Malaysia, English and Mandarin across a regional cluster of service centres, measured on bay utilisation and chase-call reduction.",
    expansion: [
      "Roll booking across the full national service network with capacity-aware slot offering",
      "Add recall and service-campaign outreach with completion measurement in four languages",
      "Introduce a dealer-facing support desk for parts availability and warranty-claim queries",
    ],
    stakeholders: [
      "President and Chief Executive Officer",
      "Director of After-Sales / Customer Service",
      "Head of Sales and Dealer Network",
      "Head of Information Technology",
      "Head of Quality and Product Campaigns",
    ],
    discovery: [
      "How many service bookings are made by phone versus the app today, and what is your bay utilisation rate?",
      "Can order and production allocation data support a grounded delivery estimate per customer?",
      "Who owns the customer relationship after handover — Perodua centrally or the dealer principal?",
      "What is your current recall campaign completion rate and how is it chased?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A Perodua owner in Ipoh books a service on WhatsApp in Bahasa Malaysia against live bay capacity and is reminded, with a recall campaign folded into the same visit.",
  },

  "proton": {
    operatingContext:
      "Proton is Malaysia's national carmaker, revitalised under Geely partnership with the X-series SUVs driving a substantial volume recovery and an expanding sales and after-sales network across Malaysia plus growing export activity in the region. Its customer base spans first-time buyers to fleet operators, and the ownership relationship runs through 3S and 4S outlets operated by dealer partners rather than by Proton directly. Contact arrives through a customer careline, dealer sales and service lines, the Proton app and website, and dealer-level WhatsApp, dominated by booking-status enquiries during launch backlogs, service scheduling, parts availability and warranty questions. Language needs span Bahasa Malaysia, English and Mandarin, with regional variation across the network.",
    strategicPressure: [
      { text: "Proton's volume recovery under the Geely partnership has been driven by SUV launches that generate order backlogs and sustained booking-status enquiry volume.", kind: "verified" },
      { text: "Customer contact is executed by dealer partners rather than Proton directly, so service quality and response speed vary across the network with no central measurement.", kind: "inference" },
      { text: "Geely supplies vehicle and connected-car technology, but customer-service conversational capability for the Malaysian market is not part of that transfer.", kind: "inference" },
      { text: "Rebuilding brand perception after years of quality reputation issues makes consistent after-sales communication commercially material, not cosmetic.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Proton is an automaker whose technology partnership brings vehicle platforms and connected-car features, not conversational service infrastructure for Malaysian dealers. Customer-communication capability would be procured centrally and deployed across the dealer network.",
    whyNotBuild:
      "The engineering capacity Proton has access to is directed at vehicle programmes and manufacturing. Building three-language speech, dealer telephony orchestration, DMS integration and evaluation would divert scarce local technical management from the product roadmap that is actually rebuilding the brand.",
    workflows: [
      {
        name: "Booking-status updates during launch backlogs",
        friction: "Customers who have placed a booking chase their salesperson and the careline for allocation and delivery timing; answers differ between dealer and headquarters, and frustration surfaces publicly.",
        outcome: "One grounded delivery-status answer drawn from order and allocation systems, pushed proactively at each milestone in the customer's language.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Order management", "Allocation and production planning", "Dealer management system", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Service-appointment scheduling across the dealer network",
        friction: "Service booking means calling an outlet during working hours; no view of alternative outlets or earlier slots exists, and no-shows waste bay capacity with no reminder discipline.",
        outcome: "Conversational booking against live outlet capacity with reminders and one-tap rescheduling, improving both customer convenience and bay utilisation.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Dealer management system", "Service scheduling", "Vehicle and owner records", "Parts availability"],
        value: 3, complexity: 3,
      },
      {
        name: "Warranty and after-sales enquiry handling",
        friction: "Warranty coverage, service-interval and parts-availability questions bounce between careline and dealers, with inconsistent answers that erode trust in the brand's after-sales promise.",
        outcome: "Consistent, grounded answers on warranty terms, service intervals and parts availability across the whole network, with genuine claims routed with context.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Warranty system", "Parts inventory", "Vehicle records", "Dealer management system"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national customer careline for sales and after-sales enquiries",
        "The Proton app and website with owner and service information",
        "A dealer network of 3S and 4S outlets handling most direct customer contact",
        "Dealer-level WhatsApp and social channels used informally for follow-up",
      ],
      gaps: [
        "Booking and delivery status cannot be answered consistently from a single grounded source",
        "Service booking is outlet-by-outlet with no network capacity view for the customer",
        "Warranty and parts answers vary between careline and dealers",
        "No after-hours conversational channel across the network",
      ],
    },
    risks: [
      "Malaysia's PDPA governs owner and booking data used for proactive status outreach and requires consent evidence per channel.",
      "Dealer partners own the customer relationship contractually in many cases, so a central conversational channel needs a commercial and governance agreement before it can act on bookings.",
      "Warranty and technical statements carry contractual exposure and must be grounded in approved warranty terms, with any diagnosis routed to qualified technicians.",
    ],
    economics: {
      volumeMonthly: 320000,
      costPerInteraction: 1.4,
      automationRate: 0.55,
      basis: "Volume, cost per contact and automation rate are seller assumptions from Malaysian automotive after-sales benchmarks and require validation against Proton's careline and dealer-network contact data.",
    },
    pilotScope:
      "An eight-week Launch pilot delivering booking-status updates and service-appointment scheduling on WhatsApp and the careline in Bahasa Malaysia, English and Mandarin across a cluster of outlets, measured on chase-call reduction and booking conversion.",
    expansion: [
      "Extend booking and service scheduling across the full national outlet network",
      "Add warranty and parts-availability enquiry handling with dealer-facing support",
      "Introduce proactive service-interval and campaign outreach to the owner base",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer / Head of After-Sales",
      "Head of Sales and Network Development",
      "Head of Customer Experience",
      "Chief Information Officer",
    ],
    discovery: [
      "Who owns the post-sale customer relationship contractually — Proton or the dealer principal?",
      "Can order allocation data support a grounded delivery estimate per booking today?",
      "What is your current no-show rate on service appointments and are reminders sent?",
      "Is there a Geely-driven digital roadmap that a customer-service deployment would need to align with?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A Proton X50 buyer waiting on delivery gets a grounded allocation update on WhatsApp instead of chasing a salesperson for the fourth time.",
  },

  "pos-malaysia": {
    operatingContext:
      "Pos Malaysia is the national postal operator, running mail, courier and parcel services through a nationwide network of post offices, processing hubs and delivery routes, alongside logistics and financial-agency services at counters. Its business has been reshaped by structural mail decline and intense competition in e-commerce parcel delivery, where it competes with well-funded private couriers on cost and reliability. Customer contact is dominated by tracking enquiries, failed-delivery and redelivery arrangements, missing-item claims and post-office service questions, arriving through a careline, the tracking website and app, social media and counters, mainly in Bahasa Malaysia and English. It has been through repeated turnaround programmes where cost-to-serve reduction is existential rather than optional.",
    strategicPressure: [
      { text: "Structural decline in mail volumes alongside intense price competition in e-commerce parcel delivery has kept Pos Malaysia under sustained turnaround pressure.", kind: "verified" },
      { text: "Tracking and failed-delivery enquiries are the dominant contact category for any parcel operator and scale directly with volume rather than with revenue.", kind: "verified" },
      { text: "Failed first-delivery attempts generate both a service contact and a redelivery cost, so preventing them attacks two cost lines with one intervention.", kind: "inference" },
      { text: "Turnaround economics mean a service-automation case must show payback inside the current planning cycle to be funded at all.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Pos Malaysia's technology attention is on network, sortation and operational systems within a turnaround programme. There is no software organisation for conversational infrastructure, and management focus is on financial restructuring rather than platform development.",
    whyNotBuild:
      "An organisation cutting cost to survive does not staff four new engineering disciplines. What it needs is a rapid, measurable reduction in cost per contact and in failed deliveries, which a configured deployment against its tracking and delivery systems can demonstrate in a quarter.",
    workflows: [
      {
        name: "Parcel tracking and delivery-status enquiries",
        friction: "The tracking page shows a stale scan and the customer calls or posts on social media; the agent reads the same scan back, so the contact costs money and resolves nothing.",
        outcome: "Live status retrieved with the actual next step explained, and exceptions detected proactively so the customer is told before they ask.",
        channels: ["WhatsApp", "Voice", "Web chat", "Social messaging"],
        systems: ["Track and trace", "Delivery route and scan data", "Customer records", "Notification platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Failed-delivery and redelivery arrangement",
        friction: "A failed attempt leaves a card; the recipient must call or visit a post office to arrange redelivery, and many parcels sit until they are returned to sender at full cost.",
        outcome: "Redelivery or collection-point redirection arranged conversationally in-channel immediately after the failed attempt, cutting return-to-sender volume.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Delivery management", "Route scheduling", "Collection-point network", "Track and trace"],
        value: 3, complexity: 3,
      },
      {
        name: "Missing-item and compensation claim intake",
        friction: "Claims are submitted on forms at counters or by email, chased repeatedly by phone, and processed slowly with no status visibility for the claimant.",
        outcome: "Structured claim intake with evidence captured in-thread, eligibility explained against policy, and status pushed until settlement.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Claims workflow", "Track and trace", "Customer records", "Finance and settlement"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A tracking website and mobile app with scan-level parcel status",
        "A customer careline handling tracking, delivery and counter-service enquiries",
        "A nationwide post-office counter network serving as a physical service channel",
        "Social-media channels carrying a large share of complaint and tracking traffic",
      ],
      gaps: [
        "Customers cannot arrange redelivery or redirection conversationally at the moment of failed delivery",
        "No proactive notification when a parcel is delayed or a delivery attempt fails",
        "Claims have no tracked, pushed status back to the claimant",
        "Social-channel enquiries are handled manually with inconsistent response times",
      ],
    },
    risks: [
      "MCMC postal-service quality standards govern delivery performance and complaint handling, so statements about delivery commitments must be accurate.",
      "Malaysia's PDPA governs recipient contact data supplied by merchants, and using it for proactive outreach requires a clear lawful basis agreed with senders.",
      "Turnaround budget discipline means scope must stay narrow enough to prove payback quickly, or the initiative will be cut regardless of merit.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.0,
      automationRate: 0.65,
      basis: "Volume, unit cost and automation rate are seller assumptions from postal and parcel-operator contact benchmarks and must be validated against Pos Malaysia's careline, social-channel and tracking-enquiry data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling tracking enquiries and redelivery arrangement on WhatsApp and the careline in Bahasa Malaysia and English, integrated to track-and-trace and delivery management, measured on cost per contact and return-to-sender reduction.",
    expansion: [
      "Add proactive delivery-exception notification before the customer contacts Pos Malaysia",
      "Extend to missing-item and compensation claim intake with status push",
      "Introduce a merchant and e-commerce-sender support desk as a B2B workflow",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Operating Officer, Postal and Courier",
      "Head of Customer Experience",
      "Chief Financial Officer",
      "Chief Information Officer",
    ],
    discovery: [
      "What is your monthly contact volume across careline, social and counters, and what share is pure tracking?",
      "What is your failed-first-delivery rate and what does a return-to-sender cost you per parcel?",
      "Can delivery-exception events be published to an external system in near real time?",
      "What payback period would a service-automation investment need to clear in the current turnaround plan?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Pos Malaysia recipient whose parcel missed delivery gets a WhatsApp message the same hour and picks a redelivery slot without ever calling.",
  },

  "taylors-university": {
    operatingContext:
      "Taylor's University is one of Malaysia's leading private universities, based in Subang Jaya with a strong reputation in hospitality, business, design and law, recruiting domestic students alongside international cohorts from across ASEAN, South Asia, the Middle East and Africa. Its admissions cycle runs multiple intakes a year, each producing concentrated waves of enquiries about programmes, entry requirements, fees, scholarships, accommodation and visa processes, arriving through web forms, WhatsApp, phone, education agents and open-day events. Counsellor capacity is fixed while enquiry volume swings by an order of magnitude across the cycle, and enquiries arrive across many time zones. Enrolment outcomes are demonstrably sensitive to first-response speed in a market where families are simultaneously enquiring with several institutions.",
    strategicPressure: [
      { text: "Malaysia's private higher-education market is intensely competitive for both domestic and international students, with several established brands recruiting the same applicant pools.", kind: "verified" },
      { text: "International applicant enquiries arrive across time zones and languages, so an office-hours counsellor model systematically loses the overnight enquiry.", kind: "inference" },
      { text: "Intake-season enquiry volume spikes far above baseline while counsellor headcount stays flat, guaranteeing slow first response exactly when it costs most.", kind: "inference" },
      { text: "Application funnels leak on missing documents and unfollowed-up conversations that nobody has capacity to chase.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A university buys its student information system, CRM and learning platforms. Taylor's has education-technology capability in teaching delivery, not platform engineering, and an admissions agent is a bounded, measurable purchase against enrolment outcomes.",
    whyNotBuild:
      "University IT budgets are committed to student systems and teaching infrastructure, and the admissions problem is seasonal and urgent rather than a long-term engineering ambition. Speech, telephony, orchestration into the admissions CRM and evaluation are bought capabilities anywhere in the sector.",
    workflows: [
      {
        name: "Admissions enquiry response and counsellor booking",
        friction: "Enquiries arrive at all hours through forms, WhatsApp and phone; counsellors reply within a day or two, by which time the family has spoken to a competing university that answered first.",
        outcome: "Every enquiry engaged within minutes in the family's language with grounded programme, fee and entry-requirement answers, and a counsellor call booked into a real calendar.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Admissions CRM", "Programme and fee catalogue", "Counsellor calendars", "Campaign platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Application document chasing and completion",
        friction: "Applications stall on missing transcripts, English-test results or visa documentation, and nobody has the capacity to chase every incomplete file before the intake closes.",
        outcome: "Automatic, personalised document chasing with checklist tracking and upload in-channel, converting stalled applications into completed ones.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Admissions CRM", "Application workflow", "Document management", "Student information system"],
        value: 3, complexity: 2,
      },
      {
        name: "Scholarship, fee and accommodation enquiries",
        friction: "Scholarship eligibility, fee structures and accommodation questions require two or three different offices, so the applicant waits days for an answer that determines whether they enrol.",
        outcome: "Grounded, citable answers on scholarships, fees and accommodation in one conversation, with genuine edge cases escalated to the right office with context.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Scholarship rules and catalogue", "Fee schedules", "Accommodation management", "Admissions CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Web enquiry forms and programme pages as the primary digital front door",
        "A counsellor team handling enquiries by phone, WhatsApp and email",
        "Education-agent networks recruiting international students in source markets",
        "Open days and campus events as the main conversion mechanism",
      ],
      gaps: [
        "Enquiries received outside office hours or across time zones go unanswered until the next working day",
        "Incomplete applications are not systematically chased before intake deadlines",
        "Scholarship and fee answers require multiple offices and multi-day turnaround",
        "No structured measurement of enquiry-to-enrolment conversion by source and language",
      ],
    },
    risks: [
      "Malaysia's PDPA governs applicant data, and international applicants bring additional cross-border data-transfer considerations including GDPR for European enquirers.",
      "Ministry of Higher Education and MQA rules govern how programmes, accreditation and outcomes may be represented, so all programme statements must be grounded in approved content.",
      "Visa and immigration guidance carries real consequence for international applicants and must be bounded to published requirements with human escalation for anything case-specific.",
    ],
    economics: {
      volumeMonthly: 45000,
      costPerInteraction: 2.2,
      automationRate: 0.6,
      basis: "Enquiry volume, cost per interaction and automation rate are seller assumptions from private higher-education admissions benchmarks and must be validated against Taylor's own enquiry and counsellor-capacity data across the intake calendar.",
    },
    pilotScope:
      "An eight-week Launch pilot answering admissions enquiries and booking counsellor calls on WhatsApp and web chat in English, Bahasa Malaysia and Mandarin for one intake, integrated to the admissions CRM, measured on first-response time and enquiry-to-application conversion.",
    expansion: [
      "Add automated document chasing and application-completion workflows across all intakes",
      "Extend to scholarship, fee and accommodation enquiries with multi-office grounding",
      "Introduce post-offer nurture to reduce melt between acceptance and enrolment",
    ],
    stakeholders: [
      "Vice-Chancellor / President",
      "Chief Marketing Officer / Director of Student Recruitment",
      "Head of Admissions",
      "Director of International Recruitment",
      "Chief Information Officer",
    ],
    discovery: [
      "What is your median first-response time to an enquiry during peak intake, and what is it overnight?",
      "Which CRM holds admissions enquiries and can an agent write qualified enquiries and book counsellor appointments into it?",
      "What share of started applications never complete, and what is the most common missing document?",
      "Which source markets and languages generate the most international enquiries?",
    ],
    flowTemplate: "admissions",
    scenario: "A Dhaka family enquiring about Taylor's hospitality degree at 2am gets fees, entry requirements and a scholarship answer, and books a counsellor call for the next morning.",
  },

  "sunway-university": {
    operatingContext:
      "Sunway University sits within the Sunway group's education arm on the Bandar Sunway campus, offering degrees in partnership with international institutions and recruiting a diverse student body from Malaysia and across Asia and Africa. Its admissions operation handles multiple intakes annually with enquiries about programme choice, entry pathways, partner-degree arrangements, scholarships, accommodation and student-visa processes, arriving through web forms, WhatsApp, phone, education agents and campus events. Counsellor capacity is fixed against volume that swings sharply by intake, and international enquiries arrive outside Malaysian working hours. It shares a campus ecosystem with Sunway Medical Centre, Sunway Pyramid and Sunway Lagoon, giving it a distinctive integrated-campus proposition that features heavily in recruitment conversations.",
    strategicPressure: [
      { text: "Sunway University recruits internationally with partner-degree arrangements, which makes its enquiry mix more complex than a purely domestic institution's.", kind: "verified" },
      { text: "Enquiry volume concentrates into intake windows against flat counsellor headcount, guaranteeing slow response when speed most affects conversion.", kind: "inference" },
      { text: "International applicants from Africa and South Asia enquire outside Malaysian office hours and in varied English registers, and unanswered overnight enquiries convert elsewhere.", kind: "inference" },
      { text: "Partner-degree and pathway questions are the hardest for a generalist counsellor to answer consistently, so applicants receive variable information on a decisive point.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The university buys its student information system, admissions CRM and digital tooling. Its technology strength is in teaching delivery and campus systems, not conversational platform engineering, and an admissions agent is a contained, measurable purchase.",
    whyNotBuild:
      "No university of this size builds speech, telephony, orchestration and evaluation infrastructure — the sector universally buys it. The competitive problem is response speed in a specific intake window, which building could not address on any relevant timescale.",
    workflows: [
      {
        name: "Intake-season enquiry response and counsellor booking",
        friction: "Enquiry volume multiplies during intake windows; counsellors reply days later and international enquirers in other time zones frequently get no reply at all before they commit elsewhere.",
        outcome: "Instant grounded engagement in the applicant's language on programmes, pathways and entry requirements, with counsellor appointments booked into real calendars.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Admissions CRM", "Programme and pathway catalogue", "Counsellor calendars", "Campaign platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Scholarship and financial-aid enquiry handling",
        friction: "Scholarship eligibility questions are decisive for many applicants but require the scholarships office to assess, so answers take days and applicants make decisions without them.",
        outcome: "Eligibility explained against published scholarship criteria immediately, with genuine assessment cases routed to the scholarships office already structured.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Scholarship rules and catalogue", "Admissions CRM", "Fee schedules", "Student information system"],
        value: 3, complexity: 2,
      },
      {
        name: "Enrolment document and visa-process coordination",
        friction: "International offer-holders must assemble academic documents, English-test results and student-pass paperwork with no proactive guidance, and files stall silently until the intake closes.",
        outcome: "Checklist-driven document collection with validation in-channel and proactive chasing, converting more offers into enrolments.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Application workflow", "Document management", "International student services records", "Admissions CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Web enquiry forms and programme information pages",
        "A counsellor team handling enquiries by WhatsApp, phone and email",
        "Education-agent representation in international source markets",
        "Campus open days and virtual information sessions as conversion events",
      ],
      gaps: [
        "No overnight or weekend response capability for international enquiries",
        "Partner-degree and pathway questions receive inconsistent answers across counsellors",
        "Offer-holder document collection is not proactively chased",
        "Melt between offer acceptance and enrolment is not addressed by structured nurture",
      ],
    },
    risks: [
      "Malaysia's PDPA and cross-border transfer rules govern international applicant data, with GDPR applying to European enquirers.",
      "MQA and Ministry of Higher Education requirements constrain how programmes, accreditation and partner-degree arrangements may be described, so content must be approved and grounded.",
      "Student-pass and immigration guidance must be limited to published requirements, with any case-specific question escalated to international student services.",
    ],
    economics: {
      volumeMonthly: 35000,
      costPerInteraction: 2.2,
      automationRate: 0.6,
      basis: "Enquiry volume, unit cost and automation rate are seller assumptions from private-university admissions benchmarks and must be validated against Sunway University's own enquiry and conversion data by intake.",
    },
    pilotScope:
      "An eight-week Launch pilot answering intake-season enquiries and booking counsellor calls on WhatsApp and web chat in English, Bahasa Malaysia and Mandarin, integrated to the admissions CRM, measured on first-response time and enquiry-to-application conversion for one intake.",
    expansion: [
      "Add scholarship and financial-aid eligibility conversations grounded in published criteria",
      "Extend to offer-holder document chasing and student-pass coordination for international applicants",
      "Introduce post-offer nurture and orientation onboarding to reduce melt",
    ],
    stakeholders: [
      "Vice-Chancellor",
      "Director of Marketing and Student Recruitment",
      "Head of Admissions",
      "Head of International Office",
      "Director of Information Technology",
    ],
    discovery: [
      "What proportion of enquiries arrive outside Malaysian working hours, and what is the current response rate on those?",
      "How many offer-holders fail to enrol each intake, and at which step do they drop?",
      "Can an agent read programme, pathway and scholarship rules from a single governed source today?",
      "Which source markets are you growing into, and does your counsellor team cover their languages?",
    ],
    flowTemplate: "admissions",
    scenario: "A Nairobi applicant messages Sunway University about a partner-degree pathway on a Sunday and receives grounded entry, fee and scholarship answers plus a counsellor booking.",
  },

  "singtel-regional": {
    operatingContext:
      "Singtel is Singapore's incumbent telecommunications operator, running consumer mobile, broadband, pay-TV and digital services domestically, an enterprise and ICT business through NCS, a regional data-centre and infrastructure arm, and significant associate stakes in operators across Australia, Indonesia, India, Thailand and the Philippines. Its Singapore consumer base is multilingual and reaches it through the Singtel app, web self-service, a contact centre, retail stores and messaging, with billing, roaming, plan change, fibre-fault and device-contract enquiries dominating volume. It has invested materially in internal digital and data capability and has publicly pursued AI initiatives, which makes it a discerning rather than a naive buyer. Singapore's high labour cost makes assisted-contact economics harsher here than anywhere else in the region.",
    strategicPressure: [
      { text: "Singtel operates both a domestic consumer business and a large regional associate portfolio, giving any Singapore capability a potential multi-market reference path.", kind: "verified" },
      { text: "Singapore's labour costs make assisted contact structurally more expensive than in the rest of Southeast Asia, so automation economics are sharper here than in any neighbouring market.", kind: "verified" },
      { text: "Singtel has real internal digital and AI capability, so the credible sell is infrastructure, models, governance and specific gaps rather than a turnkey replacement of its service stack.", kind: "inference" },
      { text: "Fibre-fault and connectivity diagnosis remains a high-handling-time contact category that self-service channels have not meaningfully absorbed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. Singtel has genuine platform engineering, an ICT services arm in NCS, and existing AI programmes, so it will not accept a black-box turnkey deployment. The realistic motion is supplying the model, speech, orchestration and evaluation layers into a service stack Singtel continues to own and operate.",
    whyNotBuild:
      "Singtel can build parts of this, and will. What it will not economically build is frontier speech and language capability across English, Mandarin, Malay and Tamil, nor a per-conversation evaluation and governance framework it would then have to maintain against a moving research frontier. The right to win is supplying those layers under Singtel's own architecture and control.",
    workflows: [
      {
        name: "Fibre-fault diagnosis and appointment scheduling",
        friction: "Broadband fault calls carry long handling times as agents walk customers through router checks, then book an engineer visit through a separate scheduling process, often for a fault that was resolvable remotely.",
        outcome: "Guided diagnostics grounded in live line status resolve the resolvable cases, and genuine faults are booked into engineer schedules with diagnostic evidence attached.",
        channels: ["Voice", "App", "Web chat", "WhatsApp"],
        systems: ["Network fault management", "Line status and diagnostics", "Field engineer scheduling", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Billing, roaming and plan-change self-service",
        friction: "Bill-shock, roaming charge and plan-comparison questions escape app self-service whenever they need explanation, landing on expensive Singapore-cost agents.",
        outcome: "Bills explained line by line against the customer's own usage, roaming options compared, and plan changes executed conversationally in four languages.",
        channels: ["Voice", "App", "WhatsApp", "Web chat"],
        systems: ["Billing and charging", "Product catalogue", "Provisioning", "Usage data"],
        value: 3, complexity: 2,
      },
      {
        name: "Contract-renewal and device-upgrade conversations",
        friction: "Contract-end customers are reached by outbound campaigns and store visits; the retention team covers only a fraction of the base and offers depend on the individual agent.",
        outcome: "Every contract-end customer engaged conversationally with eligibility, device options and offers bounded by an approved matrix, with high-value saves routed to humans.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["CRM", "Contract and subscription records", "Device inventory", "Offer management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The Singtel app and web self-service covering most routine transactions",
        "A contact centre with menu routing and live-chat support",
        "An existing virtual-assistant capability on digital channels",
        "A retail store network handling device, contract and complex service transactions",
      ],
      gaps: [
        "Fibre-fault diagnosis still requires long assisted handling rather than grounded guided troubleshooting",
        "Bill explanation escapes self-service whenever the customer needs reasoning rather than a figure",
        "Voice remains largely menu-driven despite digital channels being well developed",
        "Retention coverage reaches only a portion of the contract-end base",
      ],
    },
    risks: [
      "IMDA telecom consumer-protection and service-quality obligations govern complaint handling, fault resolution and what customers may be told about service commitments.",
      "Singapore's PDPA and its Do Not Call provisions constrain outbound retention and marketing contact, requiring documented consent and DNC screening.",
      "As a co-build account, model and data governance must fit Singtel's own architecture, security review and vendor-assurance processes, which lengthens the sales cycle materially.",
    ],
    economics: {
      volumeMonthly: 1600000,
      costPerInteraction: 4.2,
      automationRate: 0.55,
      basis: "Interaction volume, Singapore cost per contact and automation rate are seller assumptions from developed-market telecom benchmarks and must be validated against Singtel's own contact-centre and digital-channel reporting.",
    },
    pilotScope:
      "A twelve-week Scale engagement supplying speech, orchestration and evaluation layers for fibre-fault diagnosis and billing enquiries on voice and app channels in English, Mandarin, Malay and Tamil, operated within Singtel's own architecture and measured on handling time and truck-roll avoidance.",
    expansion: [
      "Extend the capability layer to contract-renewal and device-upgrade conversations",
      "Add enterprise and SME service desks in partnership with NCS delivery",
      "Offer the pattern into regional associate operators as a reference architecture",
    ],
    stakeholders: [
      "Chief Executive Officer, Singtel Singapore",
      "Chief Digital and Data Officer",
      "Head of Consumer Customer Experience",
      "Chief Information Officer / Head of Enterprise Architecture",
      "Head of Network Operations",
    ],
    discovery: [
      "What have your internal AI teams already deployed in customer service, and where do they say the genuine capability gap is?",
      "What is the average handling time on a fibre-fault call and what proportion end in an avoidable engineer visit?",
      "How does your architecture team expect an external model and orchestration layer to be integrated and governed?",
      "What share of contract-end customers does the retention team actually reach today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Singtel broadband customer reports a dropped fibre line and is guided through grounded diagnostics that fix it without an engineer visit.",
  },

  "starhub": {
    operatingContext:
      "StarHub is Singapore's second-largest telecommunications operator, running mobile, broadband, entertainment and enterprise lines with a consumer base that skews toward bundled home-and-mobile households. It has pursued a multi-year cost and capability transformation programme aimed at simplifying its technology estate and reducing operating cost, an explicit and publicly-stated strategic posture. Customers reach it through the StarHub app, web self-service, a contact centre, retail stores and messaging, with billing, contract-renewal, service-fault and entertainment-subscription enquiries dominating contact. Its service languages are English, Mandarin and Malay, and Singapore's labour economics make every assisted contact expensive.",
    strategicPressure: [
      { text: "StarHub has publicly run a multi-year transformation programme explicitly targeting simplified systems and a leaner operating cost base.", kind: "verified" },
      { text: "As the second operator in a small, saturated market, it cannot spread service cost across incumbent-scale volume, making cost per contact structurally more painful.", kind: "inference" },
      { text: "Contract-renewal and retention conversations are commercially decisive in a market where switching is easy and heavily promoted by competitors.", kind: "verified" },
      { text: "Entertainment and bundled-service subscriptions add a category of billing complexity that generates avoidable explanation calls.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. StarHub has a capable technology function but a stated strategy of simplification and cost reduction, which argues directly against accumulating new internal platform capability. A partner-delivered deployment on a modern platform fits the transformation narrative it has already committed to publicly.",
    whyNotBuild:
      "A company whose declared strategy is to reduce systems complexity and operating cost will not add speech, telephony, orchestration and evaluation engineering to its estate. The proposition that fits is a partner-operated capability that removes cost and demonstrably reduces the number of things StarHub has to maintain.",
    workflows: [
      {
        name: "Contract-renewal and retention conversations",
        friction: "Contract-end customers are worked by an outbound team with limited reach; offers vary by agent, and customers approaching renewal in a switching-friendly market are often contacted after they have decided.",
        outcome: "Full at-risk base engaged conversationally with eligibility and offers bounded by an approved matrix, and high-value saves routed to human specialists with context.",
        channels: ["Voice", "WhatsApp", "App", "SMS"],
        systems: ["CRM", "Contract records", "Offer and campaign management", "Churn scoring"],
        value: 3, complexity: 2,
      },
      {
        name: "Billing and bundled-subscription enquiries",
        friction: "Bundled mobile, broadband and entertainment billing produces explanation calls that self-service cannot resolve, each landing on a high-cost Singapore agent.",
        outcome: "Bills explained component by component against the customer's own usage and subscriptions, with changes executed in-channel in three languages.",
        channels: ["Voice", "App", "WhatsApp", "Web chat"],
        systems: ["Billing system", "Subscription and entitlement records", "Product catalogue", "Payment gateway"],
        value: 3, complexity: 2,
      },
      {
        name: "Service-fault triage and technician scheduling",
        friction: "Broadband and TV fault calls carry long handling times as agents run through scripted checks, and technician visits are booked for issues that were remotely resolvable.",
        outcome: "Guided diagnostics grounded in live service status resolve what can be resolved and book technicians only where genuinely needed, with evidence attached.",
        channels: ["Voice", "App", "Web chat"],
        systems: ["Fault management", "Service status", "Field scheduling", "CRM"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "The StarHub app and web self-service for account and subscription management",
        "A contact centre with menu routing and live chat",
        "Digital chatbot capability on web and app channels",
        "Retail stores handling contract, device and complex service transactions",
      ],
      gaps: [
        "Retention outreach covers only a fraction of contract-end customers",
        "Bundled-billing explanation still requires an expensive assisted contact",
        "Voice service remains menu-driven with no conversational containment",
        "Fault triage does not use live service status to avoid unnecessary technician visits",
      ],
    },
    risks: [
      "IMDA consumer-protection and service-quality obligations govern fault handling, contract terms and what may be represented to customers.",
      "Singapore's PDPA and Do Not Call registry constrain outbound retention contact, requiring consent management and DNC screening on every campaign.",
      "The transformation programme may already have committed contact-centre tooling spend, so the deployment must be positioned against that roadmap rather than beside it.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 4.0,
      automationRate: 0.55,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from developed-market telecom benchmarks and must be validated against StarHub's own contact-centre cost and volume reporting.",
    },
    pilotScope:
      "A twelve-week Scale pilot automating billing enquiries and contract-renewal conversations on voice, app and WhatsApp in English, Mandarin and Malay, integrated to billing and offer management, measured on containment rate and retention save rate.",
    expansion: [
      "Add service-fault triage grounded in live status with technician-visit avoidance",
      "Extend to entertainment-subscription servicing and upsell conversations",
      "Introduce an SME and enterprise service desk aligned to the transformation programme",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Consumer Officer",
      "Head of Customer Experience and Operations",
      "Chief Information Officer / Transformation lead",
      "Chief Financial Officer",
    ],
    discovery: [
      "What has the transformation programme already committed to for contact-centre and CX tooling?",
      "What proportion of contract-end customers does your retention team currently reach?",
      "What is your fully loaded cost per assisted contact and what containment does the app achieve today?",
      "How much of your fault-visit volume turns out to be remotely resolvable?",
    ],
    flowTemplate: "retention",
    scenario: "A StarHub household approaching contract end is engaged in Mandarin on WhatsApp, offered a bounded renewal package, and retained without an outbound call queue.",
  },

  "m1-singapore": {
    operatingContext:
      "M1 is Singapore's third mobile operator, owned by Keppel, which rebuilt its business support systems around a cloud-native digital platform to enable flexible, customisable consumer plans and a faster product cadence. It runs consumer mobile and fixed services alongside a growing enterprise and connectivity business, serving a smaller subscriber base than its two larger rivals. Customers reach it primarily through the M1 app and web self-service, with a contact centre, a small retail footprint and messaging channels behind them, and contact concentrates on billing, SIM and eSIM activation, roaming and plan changes. Its service languages are English, Mandarin and Malay, and Singapore labour costs make each assisted contact expensive relative to a challenger's ARPU.",
    strategicPressure: [
      { text: "M1 rebuilt its business support systems on a cloud-native platform to support customisable consumer plans, delivered with technology vendors rather than internally.", kind: "verified" },
      { text: "As the smallest of Singapore's main operators, M1 cannot amortise deep multilingual service staffing across its subscriber base.", kind: "inference" },
      { text: "A digital-first, customisable-plan proposition generates a distinctive enquiry mix — plan configuration and entitlement questions — that generic self-service handles poorly.", kind: "inference" },
      { text: "Keppel ownership frames M1 within a broader connectivity and infrastructure strategy, which favours efficient operations over consumer-service platform investment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. M1's platform rebuild was executed with vendors, establishing the pattern: it buys capability and integrates it into its own stack. Conversational service is a natural extension of that pattern rather than a new internal engineering ambition.",
    whyNotBuild:
      "The subscriber base is too small to justify building speech, telephony, orchestration and evaluation, and M1 has already demonstrated its preferred model by buying its core digital platform. Its scarce technical capacity is better spent on the product differentiation that makes plans customisable in the first place.",
    workflows: [
      {
        name: "Billing and plan-configuration enquiries",
        friction: "Customisable plans generate entitlement and billing questions the app cannot explain, so every ambiguity becomes an expensive assisted contact.",
        outcome: "Plan components and charges explained conversationally against the customer's own configuration and usage, with changes executed in-channel.",
        channels: ["App", "WhatsApp", "Voice", "Web chat"],
        systems: ["Billing and charging", "Plan configuration engine", "Usage data", "Provisioning"],
        value: 3, complexity: 2,
      },
      {
        name: "Roaming and travel-plan support",
        friction: "Roaming questions arrive from customers already overseas, often outside Singapore business hours, and unresolved roaming confusion produces bill disputes later.",
        outcome: "Roaming entitlements, add-ons and country coverage explained and purchased in-channel at any hour, preventing downstream bill disputes.",
        channels: ["App", "WhatsApp", "Voice"],
        systems: ["Roaming product catalogue", "Charging system", "Provisioning", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "SIM, eSIM activation and onboarding recovery",
        friction: "New subscribers stall during eSIM activation or number porting and abandon or call for help; there is no detection of a stalled activation and no proactive recovery.",
        outcome: "Guided activation with proactive intervention on stalled journeys, converting abandoned sign-ups into active subscribers.",
        channels: ["App", "WhatsApp", "Voice"],
        systems: ["Provisioning and eSIM platform", "Number portability workflow", "Order management", "Identity verification"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A cloud-native app and web self-service platform carrying most routine transactions",
        "A contact centre with menu routing and live chat",
        "Digital chatbot capability on web and app",
        "A small retail footprint plus online sales channels",
      ],
      gaps: [
        "Plan-configuration and entitlement questions escape self-service into assisted contact",
        "No conversational voice service in Mandarin or Malay",
        "Stalled eSIM activations and porting journeys are not detected or recovered",
        "Roaming support is not available conversationally to customers already overseas",
      ],
    },
    risks: [
      "IMDA consumer-protection and number-portability rules govern activation, porting and service-commitment statements.",
      "Singapore's PDPA and Do Not Call provisions constrain outbound contact and subscriber-data use.",
      "Because the app already achieves high containment, the pilot must target the specific intents that escape it, or measured incremental value will be thin.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 3.8,
      automationRate: 0.6,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from challenger-telecom benchmarks and must be validated against M1's own contact and digital-containment data.",
    },
    pilotScope:
      "An eight-week Launch pilot containing billing and plan-configuration enquiries plus roaming support on the app, WhatsApp and voice in English, Mandarin and Malay, integrated to the charging and plan-configuration systems, measured on assisted-contact deflection.",
    expansion: [
      "Add eSIM activation guidance and stalled-onboarding recovery",
      "Extend to contract-renewal and retention conversations",
      "Introduce an SME service desk for the enterprise connectivity business",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Digital Officer",
      "Head of Customer Experience",
      "Chief Technology Officer",
      "Head of Consumer Marketing",
    ],
    discovery: [
      "What containment does your app achieve, and which intents consistently escape it to an agent?",
      "What is your fully loaded cost per assisted contact today?",
      "How many activations and ports stall before completion each month?",
      "Does your cloud-native BSS expose APIs an external orchestration layer can transact against?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "An M1 subscriber overseas asks about roaming charges on WhatsApp at 3am Singapore time and buys the right add-on before the bill goes wrong.",
  },

  "uob-regional": {
    operatingContext:
      "UOB is a Singapore-headquartered bank with the broadest ASEAN retail footprint among its local peers, substantially expanded by its acquisition of Citigroup's consumer banking businesses in Malaysia, Thailand, Indonesia and Vietnam, which added several million customers and a large cards and unsecured-lending book. Its retail business now spans Singapore, Malaysia, Thailand, Indonesia and Vietnam alongside wholesale banking across the region, with the TMRW digital banking capability folded into its consumer proposition. Customers reach it through contact centres in each market, mobile and internet banking, branches, and messaging channels, with card disputes, installment-plan servicing, collections, and application-status enquiries dominating retail contact. Each market brings its own language, regulator and channel reality — LINE in Thailand, WhatsApp in Malaysia and Indonesia, multi-channel in Singapore.",
    strategicPressure: [
      { text: "UOB acquired Citigroup's consumer banking businesses in Malaysia, Thailand, Indonesia and Vietnam, adding several million customers and materially increasing regional servicing and collections volume.", kind: "verified" },
      { text: "Integrating acquired portfolios creates a window where servicing processes and platforms are being standardised across markets, which is exactly when a regional standard can be set.", kind: "inference" },
      { text: "Cards and unsecured lending across five markets generate dispute, installment and collections volume in five languages under five different regulators.", kind: "verified" },
      { text: "UOB has invested in digital banking capability but executes large programmes with technology partners rather than purely in-house.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. UOB has genuine digital capability and a demanding architecture and risk function, but it delivers major transformation programmes through partners and vendors. A regional service-automation standard is a partner-led sell into an integration programme already underway, not a displacement of internal engineering.",
    whyNotBuild:
      "A bank running a multi-market integration will not simultaneously build a speech, telephony, orchestration and evaluation stack across Thai, Bahasa, Vietnamese, Mandarin and English. Its engineering priority is migrating acquired customers onto its platforms; conversational capability is exactly the layer it buys to make that migration less painful.",
    workflows: [
      {
        name: "Card dispute and transaction-query servicing",
        friction: "Disputes are raised by phone, re-authenticated at length, then logged into a workflow the customer cannot see; status calls recur weekly across five markets and languages.",
        outcome: "Disputes raised conversationally with identity resolved once, provisional-credit rules explained, and every status change pushed instead of chased.",
        channels: ["Voice", "WhatsApp", "LINE", "Mobile banking app"],
        systems: ["Card management system", "Dispute workflow", "Core banking", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Early-bucket collections and payment arrangements",
        friction: "Dialer campaigns reach a fraction of delinquent accounts within permitted windows, collectors improvise arrangements, and promises to pay are recorded without automated follow-up.",
        outcome: "Policy-timed, multilingual outreach across every delinquent account with arrangements bounded by an approved matrix, payment links in-channel and automatic follow-up on broken promises.",
        channels: ["Voice", "WhatsApp", "LINE", "SMS"],
        systems: ["Collections system", "Core banking", "Payment gateway", "Offer and hardship matrix"],
        value: 3, complexity: 3,
      },
      {
        name: "Installment-plan and card-servicing enquiries",
        friction: "Installment conversion, limit and statement questions consume contact-centre capacity in every market with per-market scripts and inconsistent answers.",
        outcome: "Consistent regional handling of installment, limit and statement enquiries in each market's language, executed against the card system within policy.",
        channels: ["Voice", "WhatsApp", "LINE", "Mobile banking app"],
        systems: ["Card management system", "Core banking", "Product and pricing rules", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Contact centres in each retail market with menu-driven IVR and live agents",
        "UOB TMRW and mobile banking apps with self-service transaction and card controls",
        "Digital chatbot capability on app and web channels",
        "Branch networks and relationship managers for complex and wealth servicing",
      ],
      gaps: [
        "Dispute and application status is pull-only, so status chasing persists across markets",
        "Collections coverage is capacity-limited rather than complete",
        "No consistent conversational experience across the five retail markets and their languages",
        "Acquired-portfolio customers still experience servicing that differs from legacy UOB customers",
      ],
    },
    risks: [
      "Five regulators apply simultaneously — MAS in Singapore, BNM in Malaysia, the Bank of Thailand's responsible-lending and debt-collection rules, and Indonesian and Vietnamese banking regulation — so collections conduct and disclosure rules differ by market.",
      "Singapore PDPA, Malaysia PDPA and Thailand PDPA all govern customer data and cross-border transfer, which constrains where a regional deployment may process conversations.",
      "MAS technology risk management guidelines set expectations on outsourcing, model governance and resilience that must be satisfied before any production deployment.",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 3.4,
      automationRate: 0.5,
      basis: "Regional interaction volume, blended cost per contact and automation rate are seller assumptions from ASEAN retail-banking benchmarks across five markets, requiring validation against UOB's own contact-centre and collections reporting.",
    },
    pilotScope:
      "A fourteen-week Scale pilot automating card dispute intake with pushed status and early-bucket collections in two markets — Singapore and Malaysia — in English, Mandarin, Malay and Thai-ready configuration, measured on dispute status-call suppression and contact coverage in collections.",
    expansion: [
      "Extend to Thailand with LINE as the primary channel and Bank of Thailand collections conduct rules configured",
      "Add installment-plan and card-servicing enquiries across all five retail markets",
      "Establish the deployment as the regional service-automation standard for acquired and legacy portfolios",
    ],
    stakeholders: [
      "Head of Group Personal Financial Services",
      "Head of Group Retail Operations",
      "Regional Head of Cards and Unsecured Lending",
      "Chief Information Officer / Head of Group Technology",
      "Chief Risk Officer / Head of Compliance",
    ],
    discovery: [
      "Does group operations want one regional contact-automation standard, or does each market choose its own?",
      "Where has the Citigroup portfolio integration left servicing platforms — consolidated or still parallel?",
      "What proportion of your delinquent accounts do you actually reach within the early buckets today?",
      "What does MAS technology risk management require of you before a conversational AI vendor can go to production?",
    ],
    flowTemplate: "collections",
    scenario: "A UOB cardholder in Kuala Lumpur disputes a transaction on WhatsApp, is authenticated once, and receives every status change pushed until the provisional credit lands.",
  },

  "ocbc-regional": {
    operatingContext:
      "OCBC is a Singapore banking group with consumer franchises in Singapore, Malaysia and Indonesia through OCBC NISP, a Greater China presence, and Great Eastern insurance within the group, giving it an unusually integrated bank-and-insurer proposition. Its Singapore retail business serves a broad customer base through mobile and internet banking, a contact centre, branches and messaging channels, with card servicing, mortgage enquiries, wealth-appointment demand and account operations dominating contact. It has publicly invested in internal AI capability, particularly for employee productivity, which shapes how a customer-facing proposition must be positioned. Its service languages are English, Mandarin and Malay, with Bahasa Indonesia relevant for OCBC NISP.",
    strategicPressure: [
      { text: "OCBC has publicly deployed generative AI tooling internally at scale for employee productivity, so it will assess any customer-facing proposition against what it believes it can do itself.", kind: "verified" },
      { text: "Great Eastern sitting inside the group creates cross-sell and joint-servicing surface that neither bank nor insurer contact centres currently handle as one conversation.", kind: "verified" },
      { text: "Branch-appointment and wealth-consultation demand is a scheduling problem consuming contact-centre and branch capacity that has no conversational front door.", kind: "inference" },
      { text: "Singapore's assisted-contact cost makes even modest containment improvements financially material at OCBC's retail volume.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. OCBC has real internal AI capability but has concentrated it on employee-facing productivity rather than regulated customer-facing voice. The credible motion is a partner-delivered deployment on defined customer-facing service workflows, positioned to complement rather than compete with its internal agenda.",
    whyNotBuild:
      "Internal productivity tooling and a regulated, multilingual customer-facing voice and messaging stack are different problems with different risk profiles. OCBC will not build carrier-grade telephony, three-language speech, policy-bounded orchestration into core banking, and per-conversation evaluation under MAS scrutiny when a governed platform can be deployed and audited.",
    workflows: [
      {
        name: "Card servicing and transaction-dispute handling",
        friction: "Card queries and disputes require full re-authentication and manual lookup across card and core systems, then status chasing by the customer through an opaque workflow.",
        outcome: "Identity resolved once, card actions and dispute intake executed within policy, and every status change pushed to the customer.",
        channels: ["Voice", "Mobile banking app", "WhatsApp", "Web chat"],
        systems: ["Card management", "Dispute workflow", "Core banking", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Branch and wealth-appointment scheduling",
        friction: "Appointment requests for branch services and wealth consultations arrive by phone and web form and are scheduled manually, wasting relationship-manager capacity on coordination.",
        outcome: "Appointments matched to the right specialist and booked into live calendars conversationally, with reminders and rescheduling handled in-channel.",
        channels: ["Voice", "Mobile banking app", "WhatsApp", "Web chat"],
        systems: ["Branch and RM scheduling", "CRM", "Customer segmentation", "Notification platform"],
        value: 2, complexity: 2,
      },
      {
        name: "Mortgage and loan application-status enquiries",
        friction: "Applicants call repeatedly through a multi-stage mortgage process for status and outstanding-document lists, occupying agents who can only read the same workflow state.",
        outcome: "Grounded application status and document checklists delivered conversationally with automatic stage notifications, removing a whole class of repeat contact.",
        channels: ["Voice", "Mobile banking app", "WhatsApp", "Email"],
        systems: ["Loan origination system", "Document management", "Core banking", "CRM"],
        value: 3, complexity: 3,
      },
    ],
    existing: {
      has: [
        "OCBC mobile and internet banking with extensive self-service transaction capability",
        "A contact centre with IVR routing and live-agent support",
        "Digital chatbot capability on web and app channels",
        "Branch network and relationship managers for wealth and complex servicing",
      ],
      gaps: [
        "Voice remains menu-driven, so complex servicing intents still require an assisted agent",
        "Application and dispute status is pull-only, sustaining repeat-contact volume",
        "Bank and Great Eastern servicing are separate conversations for the same household",
        "Appointment scheduling consumes agent and RM time that could be automated",
      ],
    },
    risks: [
      "MAS technology risk management and outsourcing guidelines set the governance bar for any production deployment, including model risk, resilience and audit expectations.",
      "Singapore's PDPA and Do Not Call provisions govern customer data use and outbound contact, with cross-border considerations for any regional extension to Malaysia or Indonesia.",
      "OCBC's internal AI agenda may already claim customer-facing scope, so positioning must be evidence-based about which gap this fills rather than assuming an open field.",
    ],
    economics: {
      volumeMonthly: 1400000,
      costPerInteraction: 3.8,
      automationRate: 0.5,
      basis: "Interaction volume, Singapore cost per contact and automation rate are seller assumptions from developed-market retail-banking benchmarks and must be validated against OCBC's own contact-centre and digital-channel data.",
    },
    pilotScope:
      "A twelve-week Scale pilot handling card servicing and dispute intake plus branch-appointment scheduling on voice and app channels in English, Mandarin and Malay, integrated to card management and CRM, measured on containment and status-call suppression.",
    expansion: [
      "Add mortgage and loan application-status conversations with automatic stage notifications",
      "Extend to joint bank-and-Great-Eastern household servicing conversations",
      "Evaluate extension to OCBC Malaysia and OCBC NISP under group governance",
    ],
    stakeholders: [
      "Head of Group Consumer Financial Services",
      "Head of Group Operations and Technology",
      "Head of Customer Experience",
      "Chief Data Officer / Head of AI",
      "Chief Risk Officer / Head of Technology Risk",
    ],
    discovery: [
      "What scope has your internal AI programme claimed for customer-facing voice and messaging?",
      "What proportion of contact-centre volume is application or dispute status chasing?",
      "How are branch and wealth appointments scheduled today and what does that cost in RM time?",
      "What would MAS technology risk management require of a conversational AI vendor before production?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An OCBC customer queries a card transaction in Mandarin on the app, is authenticated once, and has the dispute raised with status pushed until resolution.",
  },

  "great-eastern-sg": {
    operatingContext:
      "Great Eastern is Singapore's oldest and one of its largest life insurers, part of the OCBC group, with a substantial in-force book built over generations and a large tied-agency distribution force alongside bancassurance through OCBC branches. Its Singapore business spans life, health, critical illness and investment-linked products, complemented by a significant Malaysian operation, and it serves a policyholder base that includes many older customers who strongly prefer telephone and agent contact over digital channels. Servicing runs through a customer service centre, the agency force, a policyholder portal and app, and branch and service counters, with policy servicing, premium payment, claims status and agent-support enquiries dominating volume. Its service languages are English, Mandarin, Malay and dialect-inflected Mandarin for older policyholders.",
    strategicPressure: [
      { text: "Great Eastern holds a long-established in-force book with policyholders across multiple generations, which means a significant portion of servicing demand comes from customers who prefer voice over digital.", kind: "verified" },
      { text: "A large tied-agency force creates a second, internal service load — agents needing product, underwriting and policy answers — that competes with policyholder servicing for the same capacity.", kind: "inference" },
      { text: "Premium-collection failures on long-dated policies create lapse risk that is expensive to remediate and damaging to the customer relationship when discovered at claim time.", kind: "inference" },
      { text: "OCBC group governance means platform decisions are made under group technology risk standards, which lengthens approval but makes any decision extensible to the Malaysian operation.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Great Eastern operates within OCBC group technology governance and delivers major systems through vendors and implementation partners. It has the scale and governance maturity for a substantial deployment and no tradition of building customer-facing platforms itself.",
    whyNotBuild:
      "A life insurer's technology investment goes into policy administration, actuarial systems and distribution tooling under long replacement cycles. Speech tuned to older Singaporean policyholders across English, Mandarin and Malay, telephony, policy-bounded orchestration and evaluation are four capabilities that would each need specialist teams and would still face group vendor-assurance review.",
    workflows: [
      {
        name: "Policy servicing and change requests",
        friction: "Policyholders call the service centre or their agent for address, nominee, payment-mode and fund-switch changes; each requires forms, verification and manual processing, and older customers frequently need multiple calls.",
        outcome: "Routine policy changes completed conversationally with identity verified once, documents captured in-channel and written back to policy administration.",
        channels: ["Voice", "WhatsApp", "Web chat", "App"],
        systems: ["Policy administration", "Document management", "Identity verification", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Premium-collection reminders and lapse prevention",
        friction: "Failed GIRO or card premium collections trigger letters and a lapse clock; nobody has a conversation with the policyholder, and lapses surface as a retention statistic rather than a saved relationship.",
        outcome: "Timely, consent-governed reminder conversations in the policyholder's language that explain the shortfall and take payment in-channel before lapse.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration", "Premium collection and payments", "Consent and DNC register", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Agency-force product and case support",
        friction: "Agents call internal support lines for product, underwriting and case-status answers, queueing behind each other and receiving inconsistent guidance that they then relay to clients.",
        outcome: "Agents get instant grounded answers on product terms, underwriting requirements and case status, with genuine underwriting decisions routed to human underwriters.",
        channels: ["Voice", "WhatsApp", "Agent portal chat"],
        systems: ["Product and underwriting rules", "New business workflow", "Policy administration", "Agent records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer service centre with IVR routing for policy and claims enquiries",
        "A policyholder portal and mobile app for policy viewing and selected transactions",
        "A large tied-agency force acting as the primary servicing relationship for most policyholders",
        "Bancassurance servicing through OCBC branch channels",
      ],
      gaps: [
        "Older policyholders cannot complete policy changes without agent or service-centre involvement",
        "Premium-collection failures produce letters rather than conversations",
        "Claims status is not pushed, so status calls persist through long claim cycles",
        "Agents have no instant grounded answer source and queue on internal support lines",
      ],
    },
    risks: [
      "MAS insurance conduct requirements, including fair dealing and financial-advisory rules, mean an agent must never stray into advice or product recommendation without a licensed human.",
      "Singapore's PDPA and Do Not Call provisions govern premium-reminder outreach, and older policyholders are a vulnerability consideration requiring careful escalation design.",
      "OCBC group technology risk governance applies, so model, data and outsourcing controls must be satisfied before production, and any Malaysian extension adds Malaysia PDPA and BNM requirements.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4.0,
      automationRate: 0.45,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from developed-market life-insurance servicing benchmarks and must be validated against Great Eastern's service-centre and agency-support data.",
    },
    pilotScope:
      "A twelve-week Scale pilot handling policy-servicing enquiries and premium-collection reminders on voice and WhatsApp in English, Mandarin and Malay, integrated to policy administration and payments, measured on containment and lapse prevention.",
    expansion: [
      "Add claims-status push and guided claim document collection",
      "Extend to an agency-force support desk grounded in product and underwriting rules",
      "Evaluate extension to Great Eastern Malaysia under group governance",
    ],
    stakeholders: [
      "Chief Executive Officer, Singapore",
      "Chief Operations Officer",
      "Head of Customer Service and Operations",
      "Head of Agency Distribution",
      "Chief Information Officer / Group Technology Risk",
    ],
    discovery: [
      "What share of your servicing contacts come from policyholders over sixty, and what channel do they use?",
      "How many policies lapse annually from failed premium collection, and is anyone calling them first?",
      "How much internal support volume does the agency force generate and what is the wait time?",
      "Would a Singapore deployment decision extend automatically to Great Eastern Malaysia, or be decided separately?",
    ],
    flowTemplate: "collections",
    scenario: "A long-standing Great Eastern policyholder whose GIRO premium bounced is called in Mandarin, understands the shortfall, and pays in-channel before the policy lapses.",
  },

  "income-insurance": {
    operatingContext:
      "Income Insurance, formerly NTUC Income, is a Singapore composite insurer with an explicit mass-market position, strong in motor, health, travel and life products and historically associated with affordable, accessible cover for ordinary Singaporeans. It distributes through its own advisers, digital channels, brokers and partnerships, and its motor book makes claims a defining operational workload alongside health and travel claims. Customers reach it through a contact centre, a digital portal and app, adviser relationships and branch service points, with motor FNOL, claims status, renewals and policy servicing dominating contact in English, Mandarin and Malay. Corporatisation has sharpened its focus on operating efficiency while retaining a value-for-money brand promise that makes cost-to-serve directly strategic.",
    strategicPressure: [
      { text: "Income holds a significant share of Singapore's motor insurance market, which makes claims intake and status handling its highest-frequency operational workload.", kind: "verified" },
      { text: "Its corporatisation from a cooperative structure has increased focus on operating efficiency and commercial performance while retaining a mass-market price position.", kind: "verified" },
      { text: "A value-for-money brand promise means cost-to-serve improvements are strategically aligned rather than in tension with brand positioning.", kind: "inference" },
      { text: "Renewal cycles across motor, travel and health generate concentrated outbound and inbound demand that a fixed contact-centre model handles inefficiently.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Income is an insurer of moderate scale focused on operating efficiency; it procures its core systems and digital channels. It does not have, and would not build, the engineering base for conversational infrastructure, and its economics favour a packaged deployment with a measurable claims-and-service business case.",
    whyNotBuild:
      "Building three-language speech, telephony, orchestration into policy and claims systems, and evaluation would require an engineering organisation Income has no reason to create, competing directly with the efficiency agenda that drives it. Buying is the only route consistent with the value proposition it sells to its own customers.",
    workflows: [
      {
        name: "Motor claim FNOL and workshop coordination",
        friction: "A motorist at an accident scene queues on the claims line, repeats details, and is separately routed to a reporting centre and workshop; photos and documents follow later by email.",
        outcome: "FNOL captured with photos in-channel, reporting-centre and workshop steps explained and booked, and the claim opened before the caller would have been answered.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Claims management", "Policy administration", "Approved workshop network", "Reporting-centre scheduling"],
        value: 3, complexity: 3,
      },
      {
        name: "Claims-status and health-claim enquiry handling",
        friction: "Claimants call weekly for status through multi-week motor and health claim cycles, and each call produces the same read-out of an unchanged workflow state.",
        outcome: "Live claim status retrieved on demand and pushed automatically on every stage change, eliminating a dominant category of repeat contact.",
        channels: ["WhatsApp", "Voice", "App", "Email"],
        systems: ["Claims management", "Health claims adjudication", "Notification platform", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Renewal and policy-servicing conversations",
        friction: "Renewal notices go out as documents; customers with questions about premium change, NCD or coverage must call, and price-sensitive customers who do not call simply shop elsewhere.",
        outcome: "Two-way renewal conversations that explain premium changes against the customer's own record and complete payment in-channel, improving retention measurably.",
        channels: ["WhatsApp", "Voice", "Email", "App"],
        systems: ["Policy administration", "Rating engine", "Payment gateway", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A contact centre handling claims, policy and renewal enquiries",
        "A digital portal and mobile app supporting policy access and claim submission",
        "Online quote-and-buy journeys for motor, travel and personal lines",
        "An adviser force and partnership distribution serving life and health products",
      ],
      gaps: [
        "Motor FNOL cannot be completed end-to-end in one conversation with reporting-centre and workshop coordination",
        "Claim status is pull-only, so repeat status contact persists across every open claim",
        "Renewal questions require a call, and unanswered questions become non-renewals",
        "No conversational voice self-service in Mandarin or Malay",
      ],
    },
    risks: [
      "MAS insurance conduct and fair-dealing requirements constrain what may be stated about coverage and claims outcomes without a licensed human.",
      "Singapore's PDPA and Do Not Call provisions govern renewal outreach and customer-data use, requiring consent management on every campaign.",
      "Motor claims involve third parties, reporting centres and workshops, so the agent must be clear about what it may commit on behalf of Income versus what requires an adjuster.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 3.6,
      automationRate: 0.55,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from composite-insurer servicing benchmarks and require validation against Income's claims and contact-centre reporting.",
    },
    pilotScope:
      "A twelve-week Scale pilot automating motor FNOL intake with pushed claim-status updates and renewal-reminder conversations on WhatsApp and voice in English, Mandarin and Malay, measured on FNOL completion and status-call suppression.",
    expansion: [
      "Add health and travel claim intake and adjudication-status conversations",
      "Extend to full policy servicing including changes, endorsements and payment",
      "Introduce proactive risk and renewal outreach across the personal-lines book",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Claims",
      "Head of Customer Experience and Contact Centre",
      "Chief Technology Officer",
    ],
    discovery: [
      "What share of motor FNOL arrives digitally today, and where does the digital journey break?",
      "How many contacts does an average motor claim generate from FNOL to settlement?",
      "What is your renewal retention rate and how many non-renewals had an unanswered question?",
      "What is your fully loaded cost per assisted contact at the contact centre?",
    ],
    flowTemplate: "claims",
    scenario: "An Income motorist reports an accident on WhatsApp from the roadside, uploads photos, and gets the reporting-centre appointment and workshop booked in one thread.",
  },

  "prudential-sg": {
    operatingContext:
      "Prudential Singapore is one of the market's largest life insurers, part of Prudential plc's Asian business, distributing through a large tied-agency force, financial advisory firms and bancassurance partnerships, with a product mix spanning protection, health, savings and investment-linked plans. Its customer base is broad, from mass-market protection buyers to mass-affluent wealth customers, and it maintains a substantial in-force book requiring ongoing servicing across decades. Contact runs through a customer service centre, the PRUServices digital portal and app, adviser relationships and a service centre counter, with policy servicing, premium queries, claims status and heavy adviser-support demand dominating volume. Regional platform strategy is set by Prudential plc, which shapes both what Singapore can decide alone and how far a Singapore proof can travel.",
    strategicPressure: [
      { text: "Prudential Singapore distributes through a large tied-agency and financial-advisory force, creating a substantial internal adviser-support workload alongside policyholder servicing.", kind: "verified" },
      { text: "Prudential plc drives regional technology and platform strategy across its Asian markets, so Singapore is both a deployment market and a potential gateway to a multi-market standard.", kind: "verified" },
      { text: "Health and medical-claim servicing carries rising volume as integrated shield and medical products grow, adding claims-status contact to a servicing-heavy base.", kind: "inference" },
      { text: "Advisers escalate product and underwriting questions to internal support lines, and slow answers directly delay case submission and revenue recognition.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Prudential Singapore has strong digital delivery but operates within group platform strategy and vendor governance. A partner-delivered deployment on well-defined servicing and adviser-support workflows fits how the group executes, with the Singapore proof positioned for regional replication.",
    whyNotBuild:
      "Group technology strategy would not sanction a Singapore-only speech and orchestration build, and the local business has no mandate for it. What Singapore controls is which workflows to prove, which is precisely the value a configured deployment delivers quickly.",
    workflows: [
      {
        name: "Agency and adviser support desk",
        friction: "Advisers phone internal support for product, underwriting requirement and case-status answers; queues form, answers vary, and every delay pushes case submission later.",
        outcome: "Instant grounded answers on product terms, underwriting requirements and case status in the adviser's channel, with genuine underwriting decisions routed to humans.",
        channels: ["Voice", "WhatsApp", "Adviser portal chat"],
        systems: ["Product and underwriting rules", "New business workflow", "Policy administration", "Adviser records"],
        value: 3, complexity: 2,
      },
      {
        name: "Policy servicing and premium enquiries",
        friction: "Policyholders call for premium status, payment-mode changes, fund switches and nominee updates; each requires verification and manual processing through the service centre.",
        outcome: "Routine servicing completed conversationally with identity verified once and changes written back to policy administration, in the policyholder's language.",
        channels: ["Voice", "App", "WhatsApp", "Web chat"],
        systems: ["Policy administration", "Payments", "Document management", "Identity verification"],
        value: 3, complexity: 3,
      },
      {
        name: "Health and medical claim status",
        friction: "Claimants and their advisers call repeatedly through medical-claim adjudication cycles, and each call reads back the same pending state without moving the case.",
        outcome: "Claim state retrieved on demand and pushed on every change, with document requirements chased proactively so cycles shorten.",
        channels: ["Voice", "App", "WhatsApp", "Email"],
        systems: ["Health claims adjudication", "Policy administration", "Document management", "Notification platform"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer service centre with IVR routing and live agents",
        "A policyholder digital portal and app supporting servicing transactions",
        "A tied-agency and financial-advisory distribution force as the primary relationship channel",
        "An adviser portal with product and case information",
      ],
      gaps: [
        "Advisers queue on internal support lines instead of getting instant grounded answers",
        "Claim status is pull-only, sustaining repeat contact through adjudication cycles",
        "No conversational voice servicing in Mandarin or Malay",
        "Document requirements for claims and new business are not proactively chased",
      ],
    },
    risks: [
      "MAS financial-advisory and insurance-conduct rules mean the agent may inform and service but must never advise or recommend without a licensed human.",
      "Singapore's PDPA and Do Not Call provisions govern policyholder outreach and data use, with additional sensitivity for medical-claim information.",
      "Prudential plc group governance may sequence Singapore behind other markets, so the buying path must be mapped at group as well as local level.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 4.2,
      automationRate: 0.5,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from developed-market life-insurance benchmarks and require validation against Prudential Singapore's service-centre and adviser-support data.",
    },
    pilotScope:
      "An eight-week Launch pilot providing an adviser support desk grounded in product and underwriting rules plus policy-servicing enquiries on voice and WhatsApp in English and Mandarin, measured on adviser wait time and case-submission cycle time.",
    expansion: [
      "Add health and medical claim status with proactive document chasing",
      "Extend to full policyholder servicing including payment-mode and fund changes",
      "Position the Singapore proof for replication across Prudential's other Asian markets",
    ],
    stakeholders: [
      "Chief Executive Officer, Prudential Singapore",
      "Chief Operations Officer",
      "Chief Agency Officer / Head of Distribution",
      "Head of Customer Service",
      "Chief Technology Officer / Regional CIO contact",
    ],
    discovery: [
      "How much internal support volume does the adviser force generate, and what is the average wait?",
      "Where does Singapore sit in Prudential's regional digital programme sequencing right now?",
      "What proportion of service-centre contacts are pure claim or case status enquiries?",
      "What must a vendor satisfy under group technology governance before a Singapore production deployment?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A Prudential adviser asks about underwriting requirements for a medical case on WhatsApp and gets a grounded answer in seconds instead of queueing on the support line.",
  },

  "aia-singapore": {
    operatingContext:
      "AIA Singapore is one of the market's largest life insurers within the pan-Asian AIA Group, distributing through a substantial tied-agency force, financial advisory partners and bancassurance, with a product mix spanning protection, health, critical illness and wealth accumulation. It maintains a large in-force book with policyholders across age cohorts, and its health and integrated shield business generates continuous claims and pre-authorisation activity alongside routine policy servicing. Customers reach it through a customer service centre, the AIA digital app and portal, the agency relationship and a service centre, in English, Mandarin and Malay. AIA Group sets regional technology direction and vendor standards, which limits how much Singapore can decide independently but raises the stakes if the group standardises.",
    strategicPressure: [
      { text: "AIA Group operates across many Asian markets with centrally-set technology direction, so a Singapore deployment is evaluated partly on whether it can become a group pattern.", kind: "verified" },
      { text: "Integrated shield and health business generates continuous claims, pre-authorisation and provider-coordination contact that grows with medical inflation.", kind: "inference" },
      { text: "A large agency force generates internal support demand for product, underwriting and case-status answers that competes with policyholder servicing capacity.", kind: "inference" },
      { text: "Singapore's assisted-contact cost makes routine servicing calls disproportionately expensive relative to the same call in AIA's other Asian markets.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Partner-led. AIA Singapore operates under group technology governance and deploys through approved vendors and implementation partners. It has the operational scale for a substantial deployment but not the local mandate to build conversational infrastructure.",
    whyNotBuild:
      "Group architecture and vendor-assurance processes make an unapproved local build the slowest possible route, and the local business has no engineering charter for speech, telephony, orchestration or evaluation. The route to value is proving a workflow locally on a governed platform that the group can then standardise.",
    workflows: [
      {
        name: "Policy servicing and payment enquiries",
        friction: "Premium status, payment-mode change, nominee update and fund-switch requests arrive by phone and require verification and manual processing at the service centre.",
        outcome: "Routine servicing completed conversationally with identity verified once and updates written back to policy administration in the policyholder's language.",
        channels: ["Voice", "App", "WhatsApp", "Web chat"],
        systems: ["Policy administration", "Payments", "Identity verification", "Document management"],
        value: 3, complexity: 3,
      },
      {
        name: "Health claim and pre-authorisation status",
        friction: "Policyholders, advisers and hospitals chase claim and pre-authorisation status by phone during medical episodes, when the stakes and the anxiety are highest.",
        outcome: "Live claim and pre-authorisation state retrieved and pushed on every change, with document requirements chased so approvals do not stall.",
        channels: ["Voice", "App", "WhatsApp", "Email"],
        systems: ["Health claims adjudication", "Pre-authorisation workflow", "Provider records", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Agency support and case-status desk",
        friction: "Agents call internal lines for product terms, underwriting requirements and new-business case status, queueing behind each other and delaying client conversations.",
        outcome: "Grounded instant answers for agents on product and case status, with underwriting decisions routed to human underwriters with structured context.",
        channels: ["Voice", "WhatsApp", "Agent portal chat"],
        systems: ["Product and underwriting rules", "New business workflow", "Policy administration", "Agent records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer service centre with IVR routing for policy and claims enquiries",
        "The AIA app and policyholder portal with servicing and claims submission features",
        "A tied-agency force serving as the primary relationship channel",
        "Digital chat support on web and app channels",
      ],
      gaps: [
        "Claim and pre-authorisation status is not pushed, sustaining anxious repeat contact during medical episodes",
        "Routine servicing changes still require verification and manual processing",
        "No conversational voice servicing in Mandarin or Malay",
        "Agents have no instant grounded answer source for product and underwriting questions",
      ],
    },
    risks: [
      "MAS insurance conduct and financial-advisory rules restrict the agent to informing and servicing, never advising or recommending.",
      "Singapore's PDPA governs policyholder and medical data, and health-claim information carries heightened sensitivity and access-control requirements.",
      "AIA Group vendor assurance and architecture governance is a gating dependency that must be sequenced before local production deployment.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4.2,
      automationRate: 0.5,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from developed-market life and health insurance benchmarks, for validation against AIA Singapore's service-centre and claims contact data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling policy-servicing enquiries and health claim-status conversations on voice and the app in English and Mandarin, integrated to policy administration and claims, measured on containment and status-call suppression.",
    expansion: [
      "Add pre-authorisation status with provider coordination and document chasing",
      "Extend to an agency support desk grounded in product and underwriting rules",
      "Propose the deployment as an AIA Group reference pattern for other Asian markets",
    ],
    stakeholders: [
      "Chief Executive Officer, AIA Singapore",
      "Chief Operations Officer",
      "Head of Customer Service and Operations",
      "Chief Agency Officer",
      "Chief Technology Officer / Group architecture contact",
    ],
    discovery: [
      "Can AIA Singapore pilot a conversational platform independently, or does group architecture have to approve first?",
      "What proportion of your service-centre volume is claim or pre-authorisation status chasing?",
      "How many contacts does an average integrated shield claim generate before settlement?",
      "What existing conversational AI commitments does AIA Group already have in place?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An AIA policyholder awaiting a hospital pre-authorisation gets the approval status pushed to their app instead of calling the service centre three times.",
  },

  "singlife": {
    operatingContext:
      "Singlife is a Singapore insurer built around a mobile-first savings-and-insurance proposition, now wholly owned by Sumitomo Life following its acquisition of the remaining stake from Aviva, and combining its digital-first Singlife Account and app experience with adviser and partnership distribution. Its product range spans savings, protection, health and general insurance lines, and its customer base skews younger and more digitally fluent than the traditional life insurers, though adviser-distributed products bring a broader mix. Customers reach it primarily through the app and in-app chat, with a customer service line, email and adviser relationships behind them, and contact concentrates on claims status, policy changes, account transactions and adviser support. Its digital-first brand raises the expectation of instant resolution that a conventional service model cannot meet.",
    strategicPressure: [
      { text: "Singlife is now wholly owned by Sumitomo Life, which acquired the remaining stake from Aviva, making post-acquisition technology direction a live and unsettled question.", kind: "verified" },
      { text: "A digital-first brand promise creates an expectation of instant resolution that a conventional email-and-call-back service model visibly fails.", kind: "inference" },
      { text: "Combining a direct digital proposition with adviser distribution creates two service populations with very different expectations served by one operation.", kind: "inference" },
      { text: "As a mid-scale insurer, its engineering capacity is committed to the app and product experience that constitute its differentiation.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Singlife builds its customer-facing app and product experience, which is precisely why it will not build conversational service infrastructure — that capacity is fully allocated to the differentiator. Service automation is bought and integrated behind the app.",
    whyNotBuild:
      "A mid-scale insurer with a strong product-engineering focus makes explicit choices about where its scarce engineering goes, and speech, telephony, orchestration and evaluation are not it. The value proposition is a service layer that plugs into the app experience it has already built rather than a competing platform.",
    workflows: [
      {
        name: "Claims-status and claim-submission support",
        friction: "Claims submitted in-app then go quiet; customers chase by chat and email, and a digital-first brand ends up delivering an opaque, slow claim experience.",
        outcome: "Guided submission with document validation in-flow and automatic status push at every stage, matching the service experience to the brand promise.",
        channels: ["App chat", "WhatsApp", "Voice", "Email"],
        systems: ["Claims management", "Document management", "Policy administration", "Notification platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Policy-change and account servicing",
        friction: "Policy changes, beneficiary updates and account transactions that the app does not cover fall back to email and a call-back, which feels jarringly analogue against the product experience.",
        outcome: "Changes completed conversationally in-app or in-channel with verification and write-back, closing the gap between the app and the service model.",
        channels: ["App chat", "WhatsApp", "Voice"],
        systems: ["Policy administration", "Account and transaction platform", "Identity verification", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Adviser and partner support",
        friction: "Advisers and partnership channels need product, eligibility and case-status answers, and route them through the same service capacity as retail customers.",
        outcome: "A separate grounded support channel for advisers and partners that removes their load from retail servicing and shortens case cycles.",
        channels: ["WhatsApp", "Voice", "Partner portal chat"],
        systems: ["Product and underwriting rules", "New business workflow", "Partner records", "Policy administration"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile-first app carrying account, policy and claims-submission journeys",
        "In-app chat and email support channels",
        "A customer service line for escalated and complex cases",
        "Adviser and partnership distribution with their own servicing needs",
      ],
      gaps: [
        "Claim progress is not pushed, so a digital-first brand delivers an opaque claim experience",
        "Anything the app does not cover falls back to email and call-back",
        "No conversational voice servicing in Mandarin or Malay",
        "Adviser and partner queries compete with retail servicing for the same capacity",
      ],
    },
    risks: [
      "MAS insurance conduct and financial-advisory rules limit the agent to information and servicing, with advice reserved for licensed humans.",
      "Singapore's PDPA governs customer and claims data, and health-related claim information requires heightened access control.",
      "Post-acquisition technology direction under Sumitomo Life ownership is unsettled, so the buying path and its approval layers must be established early.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 3.5,
      automationRate: 0.6,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from digital-insurer benchmarks and must be validated against Singlife's own in-app chat, email and call volumes.",
    },
    pilotScope:
      "An eight-week Launch pilot handling claims-status conversations and policy-change servicing in-app and on WhatsApp in English and Mandarin, integrated to claims and policy administration, measured on chase-contact reduction and claim-cycle time.",
    expansion: [
      "Add guided claim submission with document validation across all product lines",
      "Extend to an adviser and partner support desk separate from retail servicing",
      "Introduce proactive renewal and account-engagement conversations",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Operations Officer",
      "Head of Customer Experience",
      "Chief Technology Officer",
      "Head of Distribution and Partnerships",
    ],
    discovery: [
      "What proportion of claims generate a chase contact after submission, and how many per claim?",
      "Which servicing journeys fall out of the app today into email or call-back?",
      "How has Sumitomo Life ownership changed your technology decision-making and approval path?",
      "How much of your support capacity is consumed by adviser and partner queries rather than customers?",
    ],
    flowTemplate: "claims",
    scenario: "A Singlife customer submits a claim in-app and receives every stage update pushed to them, instead of emailing support twice a week for news.",
  },

  "certis": {
    operatingContext:
      "Certis is a Singapore-headquartered security and integrated-services group that delivers outsourced operations for governments, airports, transport operators, healthcare institutions and enterprises across Singapore and other Asia-Pacific markets, covering guarding, aviation security, facilities management, technology-enabled operations and customer-contact services. Its differentiation is an operations-technology model that combines a deployed workforce with a command-and-control platform, so it sells outcomes rather than headcount. Its own communication load is dominated by workforce coordination for a very large shift-based, multilingual deployed workforce, incident reporting from the field, and client-facing service desks operated under contract. It is simultaneously a potential customer for agentic communications and a potential channel that could embed the capability into its own managed-service contracts.",
    strategicPressure: [
      { text: "Certis operates a large deployed shift-based workforce across client sites, which makes rostering, deployment and incident coordination its highest-frequency internal communication load.", kind: "verified" },
      { text: "Its commercial model sells operational outcomes rather than headcount, so any technology that reduces labour intensity improves contract margin directly.", kind: "verified" },
      { text: "Its own operations-technology platform positioning means it will evaluate a conversational layer partly on whether it can be embedded into client-facing propositions.", kind: "inference" },
      { text: "Singapore's tight labour market for security and operations staff makes workforce retention and coordination efficiency a persistent operational constraint.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Certis builds operations technology and would insist on integrating any conversational capability into its own platform and client propositions rather than accepting a black box. The realistic motion is a partnership where the capability is supplied and co-deployed, potentially with a resale dimension.",
    whyNotBuild:
      "Certis builds command-and-control and workflow orchestration for physical operations, not speech recognition or conversational evaluation. It would source the language and speech layer and integrate it, exactly as it sources sensing and hardware, because building it would divert engineering from the operations platform that constitutes its differentiation.",
    workflows: [
      {
        name: "Workforce scheduling and deployment desk",
        friction: "Shift swaps, absence reporting, deployment queries and roster questions from a large distributed workforce arrive by phone and messaging to operations coordinators around the clock.",
        outcome: "Roster and deployment queries answered and simple changes actioned conversationally in the officer's language, with supervisor approval collected in-flow.",
        channels: ["WhatsApp", "Voice", "Internal messaging"],
        systems: ["Workforce management and rostering", "HR information system", "Deployment and command platform", "Payroll"],
        value: 3, complexity: 3,
      },
      {
        name: "Field incident-report intake and escalation",
        friction: "Officers report incidents by phone or radio to a command centre where operators transcribe details manually, delaying escalation and producing inconsistent records.",
        outcome: "Structured incident capture in the officer's language with photos and location, automatically classified, escalated by severity and written into the incident record.",
        channels: ["Voice", "WhatsApp", "Mobile app"],
        systems: ["Incident management", "Command and control platform", "Client SLA records", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Client service desks operated under contract",
        friction: "Client-facing service desks that Certis runs on contract are staffed to volume, so margin depends on headcount and peak demand is expensive to cover.",
        outcome: "Contracted service desks operated with an agentic front line under Certis supervision, improving contract margin and enabling outcome-based pricing.",
        channels: ["Voice", "WhatsApp", "Web chat", "Email"],
        systems: ["Client ticketing systems", "Certis operations platform", "Knowledge sources per client", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A command-and-control operations platform coordinating deployed teams",
        "Command centres taking incident reports from the field by phone and radio",
        "Workforce management and rostering systems for a large shift-based workforce",
        "Contracted customer-contact and service-desk operations delivered for clients",
      ],
      gaps: [
        "Officers cannot resolve roster, leave and deployment questions without a coordinator",
        "Incident intake depends on manual transcription in the command centre",
        "Client service desks scale by headcount rather than by capability",
        "No multilingual conversational layer covering the languages of the deployed workforce",
      ],
    },
    risks: [
      "Government and critical-infrastructure clients impose security clearance, data-residency and vetting requirements that constrain deployment architecture and personnel.",
      "Singapore's PDPA and employment-data obligations govern workforce records, and monitoring-adjacent capabilities need careful design and communication.",
      "If Certis positions as a channel rather than a customer, the commercial construct — resale, revenue share, white-label — must be settled before any technical work begins.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 3.2,
      automationRate: 0.55,
      basis: "Volume, cost per interaction and automation rate are seller assumptions from managed-services and workforce-coordination benchmarks and must be validated against Certis's own command-centre and service-desk data.",
    },
    pilotScope:
      "An eight-week Launch pilot delivering a workforce scheduling and deployment desk on WhatsApp and voice for one operating division in English, Mandarin and Malay, integrated to rostering and HR systems, measured on coordinator hours released and response time.",
    expansion: [
      "Add field incident-report intake with automatic classification and severity-based escalation",
      "Extend into a named client service desk as a co-delivered managed capability",
      "Formalise a channel construct for embedding the capability into Certis managed-service contracts",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Technology Officer / Head of Operations Technology",
      "Head of Human Resources / Workforce Operations",
      "Head of Managed Services / Client Solutions",
    ],
    discovery: [
      "How many workforce coordination contacts does your command centre handle per day and what is the coordinator cost?",
      "Are you evaluating this as an internal efficiency tool, or as something you would embed in client contracts?",
      "What security clearance and data-residency conditions apply for your government and critical-infrastructure clients?",
      "How are field incidents captured today and what is the delay from report to escalation?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A Certis officer on a night shift reports an incident by voice, and the classified report reaches the command centre with location and photos before the call would have connected.",
  },

  "sats": {
    operatingContext:
      "SATS is a Singapore-headquartered aviation ground-handling, air-cargo and food-solutions group that became one of the world's largest air-cargo handlers after acquiring Worldwide Flight Services, giving it operations across hundreds of stations in Asia-Pacific, Europe, North America and the Middle East. Its customers are airlines, freight forwarders and integrators rather than consumers, and its communication load is dominated by cargo-status and booking enquiries from forwarders, airline-client service coordination, and around-the-clock shift-workforce coordination across a very large operational headcount in many languages. Contact runs through station customer-service desks, cargo call centres, email, EDI and portals, with email and phone still carrying a surprising share of forwarder enquiries. Integration-era cost synergies from the WFS acquisition are an explicit management priority.",
    strategicPressure: [
      { text: "SATS acquired Worldwide Flight Services, transforming it into one of the largest global air-cargo handlers with operations across hundreds of stations worldwide.", kind: "verified" },
      { text: "Delivering integration synergies from that acquisition is an explicit and closely-tracked management commitment, which makes measurable operating-cost reduction highly saleable.", kind: "verified" },
      { text: "Freight-forwarder enquiries about shipment status and booking still arrive substantially by phone and email despite portal and EDI availability, because the exceptions are what people call about.", kind: "inference" },
      { text: "A very large shift-based ground-handling workforce across many countries generates continuous rostering, deployment and HR query volume in many languages.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. SATS invests in cargo-handling technology, automation and operational systems, and delivers major technology programmes with partners. Conversational infrastructure is not part of its technology identity, but it has the integration maturity to run a substantial deployment.",
    whyNotBuild:
      "The technology attention of an air-cargo handler goes to terminal automation, cargo management systems and network integration — especially mid-integration. Multilingual speech, global telephony, orchestration into cargo systems and evaluation would each need a specialist team competing with synergy delivery.",
    workflows: [
      {
        name: "Cargo-status and shipment enquiry desk",
        friction: "Forwarders phone and email station desks for shipment status, breakdown and readiness-for-collection information, because the portal shows a state that does not answer their actual question.",
        outcome: "Grounded shipment status and exception explanation delivered conversationally around the clock, with genuine exceptions routed to operations with full context.",
        channels: ["Voice", "Email", "WhatsApp", "Web chat"],
        systems: ["Cargo management system", "Terminal operations", "Airline booking feeds", "Customer records"],
        value: 3, complexity: 3,
      },
      {
        name: "Shift-workforce coordination desk",
        friction: "Roster queries, shift swaps, absence reporting and deployment questions from a very large shift workforce reach supervisors and HR by phone at all hours, in many languages.",
        outcome: "Roster and deployment queries handled conversationally in the worker's language with supervisor approvals in-flow, releasing supervisor time to the operation.",
        channels: ["WhatsApp", "Voice", "Internal messaging"],
        systems: ["Workforce management and rostering", "HR information system", "Payroll", "Station operations"],
        value: 3, complexity: 2,
      },
      {
        name: "Airline-client service coordination",
        friction: "Airline customers raise service queries, irregularity reports and performance questions through station contacts and email chains, with inconsistent response and no structured record.",
        outcome: "Structured client enquiry handling grounded in operational data with automatic acknowledgement and status, improving contract service levels and evidencing performance.",
        channels: ["Email", "Voice", "Web chat"],
        systems: ["Station operations systems", "Service-level records", "Cargo and ramp handling data", "CRM"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Station customer-service desks and cargo call centres serving forwarders and airlines",
        "Cargo portals and EDI connections for booking and status where forwarders are integrated",
        "Workforce management and rostering systems across stations",
        "Airline account management as the primary client relationship channel",
      ],
      gaps: [
        "Forwarder exception enquiries still require a human because the portal only shows state, not explanation",
        "No around-the-clock multilingual desk covering the network's operating hours and languages",
        "Shift-workforce queries consume supervisor time on the operational floor",
        "Client service enquiries are handled in email chains with no structured record or SLA evidence",
      ],
    },
    risks: [
      "Aviation security and customs regimes govern cargo data across many jurisdictions, so integration and data-handling design must satisfy multiple regulators simultaneously.",
      "Singapore's PDPA plus GDPR across the WFS European network apply to workforce and customer data, constraining processing location and retention.",
      "Post-acquisition system heterogeneity is the main feasibility risk — cargo systems may differ by station and region, so scope must start where one platform dominates.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 3.2,
      automationRate: 0.55,
      basis: "Volume, blended cost per interaction and automation rate are seller assumptions from aviation-services and logistics-contact benchmarks scaled to a global station network, requiring validation against SATS's own station and cargo-desk data.",
    },
    pilotScope:
      "A twelve-week Scale pilot delivering a cargo-status enquiry desk for forwarders at Singapore Changi plus a shift-workforce coordination desk in English, Mandarin and Malay, integrated to the cargo management and rostering systems, measured on enquiry containment and supervisor hours released.",
    expansion: [
      "Extend the cargo desk to other Asia-Pacific stations sharing the same cargo management platform",
      "Add airline-client service coordination with SLA evidencing",
      "Roll the workforce desk across the WFS network with local language coverage per region",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Operating Officer, Gateway Services",
      "President, Cargo / Head of Global Cargo",
      "Chief Information Officer",
      "Chief Human Resources Officer",
    ],
    discovery: [
      "How many forwarder enquiries do your Singapore cargo desks handle daily, and what share are status versus exceptions?",
      "Is the cargo management platform common across stations post-WFS, or does it vary by region?",
      "How much supervisor time goes to workforce coordination queries rather than the operation?",
      "Where do integration synergy targets touch customer-service and workforce-coordination cost lines?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A freight forwarder asks SATS at 2am why a shipment is not ready for collection and gets a grounded terminal-status answer without waiting for the day shift.",
  },

  "sia-engineering": {
    operatingContext:
      "SIA Engineering Company is a Singapore-listed aircraft maintenance, repair and overhaul provider, majority-owned by Singapore Airlines, delivering line maintenance, base maintenance and component and engine services to airline customers through its Singapore operations and a network of joint ventures and subsidiaries across the region. Its customers are airlines and lessors rather than consumers, so its communication load is business-to-business — aircraft status and turnaround updates to airline clients, parts and component coordination with suppliers — plus a substantial internal load from a large technical workforce working shifts across hangars and line stations. Contact runs through client account teams, maintenance control, email and phone, with internal queries reaching HR, rostering and technical support desks. Its workforce is multilingual with English as the technical working language.",
    strategicPressure: [
      { text: "SIA Engineering serves airline customers through both Singapore operations and a network of regional joint ventures, so client communication spans multiple entities and jurisdictions.", kind: "verified" },
      { text: "A large shift-based technical workforce across hangars and line stations generates continuous rostering, certification, leave and HR query volume outside office hours.", kind: "inference" },
      { text: "Aircraft-on-ground situations make turnaround status communication commercially critical to airline clients, where delays translate directly into their lost revenue.", kind: "verified" },
      { text: "Without a consumer volume story, the business case must rest on internal productivity and client service levels, which narrows but sharpens the proposition.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. SIA Engineering has engineering discipline in aviation maintenance and structured IT delivery within SIA group governance, but no conversational-platform capability. A partner-delivered deployment against internal service desks and client status communication fits how it acquires technology.",
    whyNotBuild:
      "Aviation MRO engineering is regulated, safety-critical and completely unrelated to conversational software. The organisation's technical governance capacity is consumed by airworthiness and quality systems; speech, telephony, orchestration and evaluation would be bought under SIA group vendor standards.",
    workflows: [
      {
        name: "Technical-workforce service desk",
        friction: "Shift workers query rostering, leave, certification currency, payroll and facilities issues by phone and messaging to small HR and admin teams that operate on office hours while the hangars run continuously.",
        outcome: "One around-the-clock front door answering HR, rostering and certification questions and actioning simple requests with manager approval in-flow.",
        channels: ["WhatsApp", "Voice", "Internal chat"],
        systems: ["HR information system", "Rostering and shift management", "Certification and training records", "Payroll"],
        value: 3, complexity: 2,
      },
      {
        name: "Airline-client maintenance status updates",
        friction: "Airline customers chase turnaround and aircraft-on-ground status through account managers and maintenance control by phone and email, especially outside Singapore hours.",
        outcome: "Grounded maintenance status and estimated release time delivered to authorised client contacts on demand and pushed on material change, with escalation to maintenance control for decisions.",
        channels: ["Email", "Voice", "Client portal chat"],
        systems: ["Maintenance management system", "Maintenance control records", "Client contract and SLA data", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Parts and component coordination enquiries",
        friction: "Parts availability, repair-turnaround and component-status questions bounce between stores, planning and client teams by email, delaying maintenance sequencing.",
        outcome: "Grounded parts and component status answers from inventory and repair systems, with exceptions escalated to planning with structured context.",
        channels: ["Email", "Voice", "Internal chat"],
        systems: ["Inventory and stores management", "Component repair tracking", "Maintenance planning", "Supplier records"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Client account teams and maintenance control as the primary airline communication channel",
        "Internal HR and administrative support desks operating largely in office hours",
        "Maintenance management and planning systems holding authoritative status data",
        "Email and phone as the dominant client and internal communication media",
      ],
      gaps: [
        "Shift workers have no support channel outside office hours despite continuous operations",
        "Airline clients cannot self-serve maintenance status without reaching a human",
        "Parts and component status requires email chains across several internal teams",
        "No structured record or measurement of internal query volume and resolution time",
      ],
    },
    risks: [
      "Aviation regulatory and airworthiness requirements mean the agent may relay recorded status but must never make or imply any technical or airworthiness determination.",
      "Singapore's PDPA and employment-data obligations govern workforce records, with certification data requiring particular accuracy and access control.",
      "Client maintenance data is commercially sensitive and contractually protected, so authorisation and disclosure boundaries per client must be designed explicitly.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 3.5,
      automationRate: 0.55,
      basis: "Volume, cost per interaction and automation rate are seller assumptions from B2B technical-services and internal-helpdesk benchmarks, requiring validation against SIA Engineering's own HR desk and client-contact data.",
    },
    pilotScope:
      "An eight-week Launch pilot delivering a technical-workforce service desk on WhatsApp and voice in English and Malay for HR, rostering and certification queries, integrated to the HR and rostering systems, measured on after-hours query resolution and admin hours released.",
    expansion: [
      "Add airline-client maintenance status with authorised-contact controls and push notification",
      "Extend to parts and component status enquiries across stores and planning",
      "Roll the workforce desk into regional joint ventures with local language coverage",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Senior Vice President, Operations",
      "Head of Human Resources",
      "Head of Customer Accounts / Commercial",
      "Head of Information Technology",
    ],
    discovery: [
      "How many internal HR, rostering and certification queries do you handle monthly and what share arrive outside office hours?",
      "Can maintenance status be exposed per aircraft to authorised client contacts through an external layer?",
      "What is the volume of client status enquiries reaching account managers and maintenance control?",
      "Does SIA group technology governance set vendor requirements this deployment would fall under?",
    ],
    flowTemplate: "employee-desk",
    scenario: "An SIA Engineering technician on a night shift asks about certification currency and leave balance on WhatsApp and gets both answered without waiting for the HR office to open.",
  },

  "scoot": {
    operatingContext:
      "Scoot is Singapore Airlines' low-cost subsidiary, operating a wide Asia-Pacific network from Singapore Changi across Southeast Asia, North Asia, India and Australia with a mix of narrowbody and widebody aircraft that gives it medium and long-haul reach unusual for an LCC. Its passenger base spans a dozen or more languages and includes price-sensitive leisure travellers, visiting-friends-and-relatives traffic and students, who reach it through the website and app, a contact centre, chat channels and airport counters. Contact concentrates on booking changes, add-on purchases such as baggage and seats, refund status, and disruption rebooking, where LCC cost discipline collides with the complexity of long-haul and connecting itineraries. It operates within Singapore Airlines Group governance while carrying a cost base that cannot support premium human servicing.",
    strategicPressure: [
      { text: "Scoot operates medium and long-haul routes on a low-cost model, so a single disruption creates rebooking complexity far beyond a typical short-haul LCC.", kind: "verified" },
      { text: "LCC unit economics cannot support premium human servicing, yet passengers on multi-hour and connecting itineraries expect service quality closer to a full-service carrier.", kind: "inference" },
      { text: "A passenger base spanning many Asian source markets creates language coverage demand that a Singapore-cost contact centre cannot economically staff.", kind: "verified" },
      { text: "Singapore Airlines Group technology governance sets standards Scoot operates within, which shapes vendor selection but leaves service workflows locally owned.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Scoot operates within SIA Group technology standards and would deploy an approved platform with an implementation partner. It has neither the engineering base nor the cost structure to build conversational infrastructure, but it has enough governance sophistication to demand a properly assured one.",
    whyNotBuild:
      "An LCC's entire discipline is not doing things that do not lower unit cost or raise ancillary revenue. Building speech across a dozen languages, telephony, orchestration into the passenger service system and evaluation would be the single most expensive way to solve a problem a configured platform solves in a quarter.",
    workflows: [
      {
        name: "Disruption rebooking and proactive notification",
        friction: "A delay or cancellation triggers a contact spike; passengers queue in chat and on the phone while agents read rebooking options, and connecting passengers find out too late.",
        outcome: "Affected passengers messaged proactively with live rebooking options confirmable in one tap, absorbing the spike without adding contact-centre seats.",
        channels: ["App", "WhatsApp", "SMS", "Email", "Voice"],
        systems: ["Passenger service system", "Departure control", "Operations disruption feeds", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Refund-status and booking-change servicing",
        friction: "Refund and change enquiries dominate routine contact, each producing the same pending answer, and every contact carries Singapore agent cost against an LCC fare.",
        outcome: "Live refund and change status delivered conversationally with automatic push on state change, removing a whole category of repeat contact.",
        channels: ["App", "WhatsApp", "Web chat", "Email"],
        systems: ["Passenger service system", "Refund and payments pipeline", "Fare rules", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Ancillary add-on purchase and baggage enquiries",
        friction: "Passengers ask about baggage allowance, seat selection and add-on pricing through chat and phone; slow or absent answers lose ancillary revenue that is central to LCC economics.",
        outcome: "Add-on questions answered instantly in the passenger's language with purchase completed in-conversation, converting service contacts into ancillary revenue.",
        channels: ["App", "WhatsApp", "Web chat"],
        systems: ["Passenger service system", "Ancillary product catalogue", "Payment gateway", "Fare rules"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The Scoot website and app supporting booking management and add-on purchase",
        "A contact centre and chat support for escalated cases",
        "Automated chat capability on digital channels",
        "Airport counters handling day-of-travel service",
      ],
      gaps: [
        "No proactive, actionable rebooking push to disrupted passengers",
        "Refund status is pull-only, sustaining repeat contact per case",
        "Language coverage is far narrower than the passenger base's actual language mix",
        "Ancillary questions that could convert to revenue go unanswered or slow",
      ],
    },
    risks: [
      "Singapore and destination-market aviation consumer-protection rules define disruption entitlements the agent must apply exactly, and they differ by jurisdiction.",
      "Singapore's PDPA plus the data-protection regimes of source markets apply to passenger data used for proactive notification and cross-border processing.",
      "SIA Group technology governance and vendor assurance is a gating dependency, and the split between group-inherited and Scoot-decided tooling must be established early.",
    ],
    economics: {
      volumeMonthly: 550000,
      costPerInteraction: 3.4,
      automationRate: 0.6,
      basis: "Volume, Singapore-blended cost per contact and automation rate are seller assumptions from low-cost-carrier servicing benchmarks and require validation against Scoot's own contact-centre and chat-channel data.",
    },
    pilotScope:
      "A twelve-week Scale pilot delivering proactive disruption notification with in-channel rebooking and live refund status on the app, WhatsApp and voice in English, Mandarin, Malay and Thai, measured on disruption-contact suppression and rebooking completion.",
    expansion: [
      "Add ancillary add-on and baggage conversations with in-conversation purchase",
      "Extend language coverage to the full source-market mix including Japanese, Korean and Vietnamese",
      "Evaluate a shared deployment pattern with Singapore Airlines under group governance",
    ],
    stakeholders: [
      "Chief Executive Officer, Scoot",
      "Chief Commercial Officer",
      "Head of Customer Experience",
      "Head of Operations Control",
      "Chief Information Officer / SIA Group technology contact",
    ],
    discovery: [
      "What happens to contact volume and cost on a major disruption day versus baseline?",
      "How much of your service tooling is inherited from SIA Group and how much do you decide?",
      "What share of contacts are refund or change status enquiries?",
      "Which passenger source markets generate the most contacts, and are you staffed for their languages?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A Scoot passenger to Tokyo learns of a cancellation on WhatsApp in Mandarin and confirms a rebooked flight in one tap before reaching the airport.",
  },

  "foodpanda": {
    operatingContext:
      "foodpanda is Delivery Hero's Asia-Pacific brand, running food delivery and quick-commerce across Singapore, Malaysia, Thailand, the Philippines, Hong Kong, Taiwan and other regional markets from a Singapore regional hub. Its operating model is three-sided: consumers ordering, rider fleets fulfilling, and merchant partners preparing, and each side generates support contact with different urgency and different systems behind it. Order issues — missing items, late deliveries, rider access problems, refund requests — are time-critical, since resolution speed within the delivery window determines whether the order and the customer are saved. Unit economics are famously thin and the APAC business has been repeatedly restructured for profitability, making support cost per order a live executive metric. Channel reality varies sharply by market: LINE matters in Thailand, WhatsApp in Malaysia and the Philippines, in-app chat everywhere.",
    strategicPressure: [
      { text: "Delivery Hero has repeatedly restructured its Asia-Pacific operations in pursuit of profitability, making regional operating-cost reduction an executive-level and publicly-visible priority.", kind: "verified" },
      { text: "Three-sided support — consumers, riders and merchants — multiplies contact volume per order across three different populations and systems.", kind: "verified" },
      { text: "Order-issue resolution has to happen inside the delivery window to save the order, so speed of first response is directly tied to revenue retention rather than satisfaction scores.", kind: "inference" },
      { text: "Support tooling may be mandated globally by Delivery Hero rather than decided regionally, which is the single biggest determinant of whether an APAC deal is possible.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Delivery Hero builds substantial logistics and marketplace technology, so this is not a naive buyer; but a regional business under profitability pressure is exactly where a partner-delivered capability that reduces cost per order quickly beats an internal roadmap item competing for global engineering priority.",
    whyNotBuild:
      "Delivery Hero's engineering is allocated to dispatch, logistics and marketplace economics globally. Multi-language speech and conversational orchestration for APAC support is a regional need competing with a global backlog, which is precisely the situation where buying a governed capability wins on time-to-value rather than on capability.",
    workflows: [
      {
        name: "Consumer order-issue resolution",
        friction: "A missing item or late delivery becomes an in-app chat that queues; by the time an agent responds the delivery window has closed, and the resolution is a refund rather than a saved order.",
        outcome: "Order issues detected and resolved inside the delivery window with refunds, redelivery or credits applied within a bounded policy matrix, in the customer's language.",
        channels: ["In-app chat", "WhatsApp", "LINE", "Voice"],
        systems: ["Order management", "Dispatch and rider tracking", "Refund and payments", "Merchant records"],
        value: 3, complexity: 2,
      },
      {
        name: "Rider support and incident handling",
        friction: "Riders mid-delivery hit address problems, customer-unreachable situations, app faults and payment issues, and contact support from the road where waiting costs them earnings.",
        outcome: "Riders get instant grounded answers and actions in their own language while moving, cutting delivery failures and improving rider retention.",
        channels: ["Rider app chat", "WhatsApp", "Voice"],
        systems: ["Rider app and dispatch", "Order management", "Rider payment and incentives", "Incident logging"],
        value: 3, complexity: 3,
      },
      {
        name: "Merchant partner support desk",
        friction: "Merchants raise menu changes, order-acceptance faults, payout queries and store-status issues through account managers and shared inboxes, with slow response costing them and the platform orders.",
        outcome: "Merchant queries resolved conversationally against live platform data, with menu and store-status changes executed in-conversation and payout questions answered from records.",
        channels: ["WhatsApp", "LINE", "Merchant portal chat", "Voice"],
        systems: ["Merchant management platform", "Menu and catalogue", "Payout and finance", "Order management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "In-app chat support for consumers and riders across markets",
        "Automated chatbot and self-service flows for common order issues",
        "Merchant portals and account-management relationships for partner support",
        "Market-level outsourced support operations handling escalated contacts",
      ],
      gaps: [
        "Order issues frequently resolve after the delivery window has closed, converting saves into refunds",
        "Riders cannot get an actioned resolution while moving without waiting in a queue",
        "Merchant support depends on account managers and shared inboxes rather than a real-time channel",
        "Channel coverage does not match market reality, particularly LINE in Thailand",
      ],
    },
    risks: [
      "Each market brings its own data-protection regime — Singapore PDPA, Malaysia PDPA, Thailand PDPA — and gig-worker regulation is evolving in several of them, affecting rider-data handling.",
      "Refund and credit authority must be tightly bounded by policy, since automated goodwill at delivery-platform volume becomes a direct margin leak.",
      "Global versus regional decision rights at Delivery Hero are the key commercial risk — the deal is only possible if APAC can decide support tooling itself.",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 3.0,
      automationRate: 0.65,
      basis: "Regional interaction volume, blended cost per contact and automation rate are seller assumptions from delivery-platform support benchmarks across APAC markets and must be validated against foodpanda's own support cost-per-order data.",
    },
    pilotScope:
      "A twelve-week Scale pilot resolving consumer order issues within the delivery window in two markets — Singapore and Malaysia — on in-app chat and WhatsApp in English, Malay and Mandarin, integrated to order management and refunds, measured on in-window resolution rate and cost per order supported.",
    expansion: [
      "Add rider support and incident handling with in-conversation actions across both pilot markets",
      "Extend to Thailand with LINE as the primary consumer and rider channel",
      "Introduce a merchant partner support desk replacing shared-inbox handling",
    ],
    stakeholders: [
      "Regional Managing Director, APAC",
      "Regional Head of Customer Experience / Operations",
      "Head of Rider Operations",
      "Head of Merchant Operations",
      "Regional Chief Technology Officer / Global platform contact",
    ],
    discovery: [
      "Is support tooling decidable at APAC regional level, or mandated by Delivery Hero globally?",
      "What is your current support cost per order by market, and what share of issues resolve inside the delivery window?",
      "How much rider contact volume do you handle, and what does an unresolved rider incident cost in failed deliveries?",
      "Which channels do customers and riders actually use per market, and how does that differ from where support is offered?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A foodpanda customer in Kuala Lumpur reports a missing item while the rider is still nearby, and a redelivery is dispatched before the order is written off.",
  },

  "comfortdelgro": {
    operatingContext:
      "ComfortDelGro is a Singapore-headquartered land transport group operating one of the world's largest taxi and private-hire fleets alongside public bus and rail operations in Singapore and overseas businesses in Australia, the United Kingdom, Ireland and China. In Singapore it runs the Comfort and CityCab taxi fleets, bus services under contract, the North East MRT line and LRT operations, plus driving-centre, vehicle-inspection and car-rental businesses. Its contact profile is distinctive: a large and persistent phone-booking segment, particularly among older passengers who have not migrated to the Zig app, alongside driver-partner support for thousands of taxi and private-hire drivers, lost-property enquiries and fare disputes. Service languages span English, Mandarin, Malay and dialects that matter for older phone-booking customers.",
    strategicPressure: [
      { text: "ComfortDelGro operates one of the largest taxi and private-hire fleets globally alongside bus and rail contracts in Singapore and several overseas markets.", kind: "verified" },
      { text: "A substantial phone-booking segment persists despite app adoption, concentrated among older passengers whom app-only strategies structurally exclude.", kind: "inference" },
      { text: "Competition from ride-hailing platforms has compressed taxi economics, making both booking-conversion efficiency and driver retention direct commercial priorities.", kind: "verified" },
      { text: "Thousands of driver-partners generate continuous support demand — fares, incentives, vehicle issues, app problems — that scales with fleet size rather than with revenue.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. ComfortDelGro is a transport operator, and while it has invested in the Zig app and digital booking, that investment is product-facing rather than platform engineering for conversational service. Its contact operations would be automated with a bought, integrated capability.",
    whyNotBuild:
      "Building multilingual speech capable of handling older Singaporean callers in Mandarin and dialect, telephony at booking-line volume, orchestration into dispatch, and evaluation would be a software programme with no relationship to the group's operating expertise. The value is in converting phone bookings reliably today, which a configured deployment delivers immediately.",
    workflows: [
      {
        name: "Taxi phone-booking automation",
        friction: "Phone bookings queue at peak times and during weather events; older callers who cannot use the app abandon and switch to a competitor's street hail, and each answered call carries full Singapore agent cost against a single fare.",
        outcome: "Bookings taken conversationally in the caller's language including dialect-inflected Mandarin, dispatched into the fleet system, with confirmation and driver details returned in the call.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Taxi dispatch system", "Fleet availability", "Customer booking records", "Payment and fare systems"],
        value: 3, complexity: 3,
      },
      {
        name: "Driver-partner support desk",
        friction: "Drivers call about fares, incentives, rental payments, vehicle faults and app issues; support lines queue, drivers lose earning time waiting, and inconsistent answers erode retention.",
        outcome: "Drivers get instant grounded answers on earnings, incentives and rental matters, with vehicle and app faults logged and escalated automatically.",
        channels: ["Voice", "WhatsApp", "Driver app chat"],
        systems: ["Driver earnings and incentive records", "Vehicle rental and fleet management", "Fault ticketing", "Payment records"],
        value: 3, complexity: 2,
      },
      {
        name: "Lost-property and fare-dispute handling",
        friction: "Lost-item reports require the passenger to recall trip details, then staff manually match against driver records and trips; fare disputes follow a similar manual investigation loop.",
        outcome: "Structured lost-item intake matched automatically against trip and driver records with status pushed, and fare disputes investigated against trip data within policy.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Trip and dispatch records", "Driver records", "Lost property register", "Fare and payment systems"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A taxi booking hotline handling a large residual phone-booking segment",
        "The Zig app for booking, payment and ride management",
        "Driver support lines and driver-app channels for the partner fleet",
        "Customer service lines covering lost property, feedback and fare disputes",
      ],
      gaps: [
        "Phone bookings queue at exactly the peak moments when demand is highest",
        "No conversational booking channel serving older customers in Mandarin or dialect",
        "Driver support has no instant grounded answer source for earnings and incentive questions",
        "Lost-property reports have no automated matching or status push",
      ],
    },
    risks: [
      "Land Transport Authority regulation of point-to-point transport governs booking, fare and service standards, so fare and service statements must be grounded in approved rules.",
      "Singapore's PDPA governs passenger trip data and driver-partner records, with trip histories being particularly sensitive location data.",
      "Fare-dispute and goodwill authority must be bounded by policy with human approval above a threshold to avoid systematic leakage across high booking volumes.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 3.4,
      automationRate: 0.6,
      basis: "Booking and support interaction volume, Singapore cost per contact and automation rate are seller assumptions from point-to-point transport benchmarks and require validation against ComfortDelGro's hotline and driver-support data.",
    },
    pilotScope:
      "A twelve-week Scale pilot automating taxi phone bookings on the hotline in English, Mandarin and Malay with dispatch integration, measured on booking abandonment at peak and cost per completed booking.",
    expansion: [
      "Add a driver-partner support desk covering earnings, incentives and rental queries",
      "Extend to lost-property intake with automated trip matching and status push",
      "Evaluate the pattern for bus and rail passenger enquiries and overseas operations",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Executive Officer, Singapore Taxi and Private Hire",
      "Head of Customer Service Operations",
      "Head of Driver Relations / Fleet Operations",
      "Group Chief Information Officer",
    ],
    discovery: [
      "How many bookings still arrive by phone each month, and what is your abandonment rate at peak?",
      "What is your fully loaded cost per phone booking versus an app booking?",
      "How much driver-support contact volume do you handle, and what are the top query types?",
      "Can the dispatch system accept bookings from an external orchestration layer with the same reliability as the hotline?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An elderly Singaporean books a Comfort taxi by phone in Mandarin during a rainstorm and gets a confirmed cab and driver details without ever reaching a hold queue.",
  },

  "smrt": {
    operatingContext:
      "SMRT Corporation is a Temasek-owned public transport operator running Singapore's North-South and East-West MRT lines, the Circle Line, the Bukit Panjang LRT and a substantial bus operation, carrying millions of passenger journeys daily. Its communication profile is dominated by service-disruption enquiries, fare-card and concession issues, lost-property requests and general journey questions, and it operates under exceptionally intense public and regulatory scrutiny of both service reliability and the quality of its disruption communication. Passengers reach it through station staff and passenger-service centres, a customer hotline, the SMRT Connect app, social media and the LTA's shared information channels, in English, Mandarin, Malay and Tamil. Disruption events produce near-instantaneous, high-volume public enquiry spikes concentrated in minutes rather than hours.",
    strategicPressure: [
      { text: "SMRT operates core MRT lines carrying millions of daily journeys, so any service disruption immediately affects an enormous number of people simultaneously.", kind: "verified" },
      { text: "Rail reliability and disruption communication in Singapore are subject to intense public, media and regulatory scrutiny, with communication quality frequently the central criticism.", kind: "verified" },
      { text: "Disruption enquiry spikes are compressed into minutes, which is a fundamentally different capacity problem from a steady contact-centre load.", kind: "inference" },
      { text: "Four-language coverage including Tamil is a public-service expectation for a Singapore transit operator rather than a commercial choice.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Buy-led. SMRT's engineering is rail systems, signalling and rolling-stock maintenance. Its customer-facing digital tooling is procured, and a conversational disruption-communication layer would be bought and grounded in its operations data.",
    whyNotBuild:
      "A rail operator has no path to owning speech, telephony, orchestration or evaluation engineering, and the problem it faces — absorbing an enquiry spike in minutes with grounded, four-language answers — is a capacity and grounding problem that a configured platform solves directly.",
    workflows: [
      {
        name: "Service-disruption enquiry handling and alerts",
        friction: "A line fault sends tens of thousands of commuters to social media, the hotline and station staff at once; the same question is answered manually thousands of times while people already on platforms get nothing.",
        outcome: "Grounded, line and station-specific status with bridging-bus and alternative-route guidance delivered at unlimited concurrency, plus proactive alerts to subscribed commuters.",
        channels: ["WhatsApp", "App", "Social messaging", "Voice", "SMS"],
        systems: ["Operations control and service status", "Bridging-bus deployment data", "Timetable and routing", "Notification platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Fare-card and concession servicing",
        friction: "Card faults, balance disputes, concession applications and replacements require a passenger-service centre visit, concentrated at limited hours and locations.",
        outcome: "Card issues diagnosed and eligible actions completed conversationally, with concession applications guided and documents captured remotely.",
        channels: ["WhatsApp", "Voice", "App", "Web chat"],
        systems: ["Fare collection and card management", "Concession eligibility records", "Customer records", "Payment gateway"],
        value: 2, complexity: 3,
      },
      {
        name: "Lost-property intake and matching",
        friction: "Lost-item reports are taken at passenger-service centres and by phone, matched manually across stations and depots, and passengers must call back repeatedly for news.",
        outcome: "Structured intake with automatic matching against found-item records and pushed status, in the passenger's language, without a station visit.",
        channels: ["WhatsApp", "App", "Voice", "Web chat"],
        systems: ["Lost property register", "Station and depot records", "Customer records", "Notification platform"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "Passenger-service centres and station staff as the frontline service channel",
        "A customer hotline for enquiries, feedback and lost property",
        "The SMRT Connect app with journey and service-status information",
        "Social-media channels functioning as the primary real-time disruption feed",
      ],
      gaps: [
        "Commuters cannot get station-specific disruption guidance conversationally during an incident",
        "Fare-card and concession issues almost always require a passenger-service centre visit",
        "Lost-property reports have no automated matching or status push",
        "No conversational service in Tamil despite it being an official language expectation",
      ],
    },
    risks: [
      "Land Transport Authority oversight and public accountability mean service-status statements must relay only grounded operations data, never estimates the agent generates.",
      "Singapore's PDPA governs commuter and concession-holder data, with student and senior concession records requiring additional care.",
      "Disruption communication responsibility is shared with LTA and other operators, so message ownership and consistency across agencies must be agreed before deployment.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 3.2,
      automationRate: 0.65,
      basis: "Enquiry volume, Singapore cost per contact and automation rate are seller assumptions from urban-transit benchmarks scaled to SMRT ridership and require validation against hotline, app and social-channel data.",
    },
    pilotScope:
      "An eight-week Launch pilot delivering grounded disruption status and alternative-route guidance on WhatsApp, the app and the hotline in English, Mandarin, Malay and Tamil for the North-South and East-West lines, measured on enquiry containment during the next disruption.",
    expansion: [
      "Add proactive disruption alerts to commuters subscribed by line and station",
      "Extend to fare-card and concession servicing with remote document capture",
      "Introduce lost-property intake with automated matching and status push",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "President, Trains",
      "Head of Customer Experience",
      "Head of Corporate Communications",
      "Chief Information Officer",
    ],
    discovery: [
      "During your last major line disruption, how many enquiries arrived across hotline, app and social channels in the first hour?",
      "Can real-time service status and bridging-bus deployment be exposed to an external system at station granularity?",
      "How many fare-card and concession transactions require a passenger-service centre visit monthly?",
      "How is disruption messaging coordinated with LTA, and who owns the wording?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An SMRT commuter stranded at Jurong East asks what is happening on WhatsApp in Tamil and gets grounded line status plus the bridging-bus pickup point.",
  },

  "zalora": {
    operatingContext:
      "Zalora is Global Fashion Group's Southeast Asian fashion e-commerce platform, headquartered in Singapore and operating marketplace and retail assortments across Singapore, Malaysia, Indonesia, the Philippines, Hong Kong and Taiwan, with regional fulfilment and last-mile partnerships in each market. Fashion e-commerce carries structurally high return rates because sizing and fit cannot be verified before purchase, which makes returns, exchanges and refund status the dominant support categories rather than order tracking alone. Customers reach it through in-app and web chat, email, WhatsApp in Malaysia and the Philippines, and social channels, in each market's language. Sustained profitability pressure across Global Fashion Group has made cost per order, including support cost, a closely-watched metric.",
    strategicPressure: [
      { text: "Fashion e-commerce carries structurally higher return rates than other categories because fit and sizing cannot be verified before purchase, making returns handling the core support workload.", kind: "verified" },
      { text: "Global Fashion Group has been under sustained profitability pressure, which pushes support cost per order into the set of metrics that determine investment decisions.", kind: "verified" },
      { text: "Operating across six markets with different languages, couriers and return logistics multiplies the support surface without multiplying the revenue behind it.", kind: "inference" },
      { text: "Return and refund status enquiries repeat per case across a multi-week reverse-logistics cycle, so each return generates several contacts rather than one.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Zalora has genuine commerce and logistics engineering, but under profitability pressure its engineering priorities are marketplace, fulfilment and margin. A partner-delivered conversational layer that reduces support cost per order across six markets is a faster route than a regional roadmap item.",
    whyNotBuild:
      "The engineering it has is committed to the commerce and logistics stack that constitutes the business. Building six-market speech and messaging orchestration, plus evaluation, would consume the same budget that the support automation is meant to save, on a timeline that does not fit the profitability agenda.",
    workflows: [
      {
        name: "Returns and exchange handling",
        friction: "A customer wanting to return an item navigates a portal, arranges pickup with a courier separately, then waits without visibility while the item travels back and is inspected.",
        outcome: "Returns initiated conversationally with eligibility explained, pickup booked with the courier in-channel, and every reverse-logistics stage pushed to the customer.",
        channels: ["In-app chat", "WhatsApp", "Web chat", "Email"],
        systems: ["Order management", "Returns and reverse logistics", "Courier partner feeds", "Refund and payments"],
        value: 3, complexity: 3,
      },
      {
        name: "Refund-status enquiries",
        friction: "Refunds move through inspection, approval and payment-provider settlement over weeks, and customers contact repeatedly at each silent stage, each contact costing money and resolving nothing.",
        outcome: "Live refund state retrieved across the returns and payments pipeline and pushed on every change, collapsing several contacts per case into zero.",
        channels: ["In-app chat", "WhatsApp", "Email"],
        systems: ["Returns workflow", "Refund and payments pipeline", "Order management", "Notification platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery-status and order-issue resolution",
        friction: "Delivery exceptions across many last-mile partners produce tracking pages that show a stale state, so customers contact support, who check the same partner portal manually.",
        outcome: "Live courier status retrieved and exceptions explained with redelivery or address correction executed in-channel, ahead of the customer contacting support.",
        channels: ["In-app chat", "WhatsApp", "Web chat"],
        systems: ["Order management", "Last-mile courier feeds", "Warehouse and fulfilment", "Customer records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "In-app and web chat support with automated self-service flows",
        "A returns portal for initiating returns and exchanges",
        "Order tracking pages fed by courier partner integrations",
        "Market-level support operations, partly outsourced, handling escalations",
      ],
      gaps: [
        "Returns cannot be completed end-to-end conversationally including courier pickup booking",
        "Refund progress is not pushed, generating multiple contacts per return case",
        "Delivery exceptions are not detected proactively before the customer contacts support",
        "Channel and language coverage varies by market rather than matching where customers actually are",
      ],
    },
    risks: [
      "Six markets bring six data-protection regimes including Singapore PDPA, Malaysia PDPA and Indonesia's PDP law, constraining cross-border processing of customer data.",
      "Refund and goodwill authority must be bounded by an approved matrix, since automated concessions at fashion-return volume would directly erode already-thin margins.",
      "Consumer-protection rules on returns and refunds differ by market, so eligibility statements must be configured per jurisdiction rather than regionally generalised.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 3.0,
      automationRate: 0.65,
      basis: "Regional support volume, blended cost per contact and automation rate are seller assumptions from fashion e-commerce benchmarks across SEA markets and require validation against Zalora's own support cost-per-order data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling returns initiation and refund-status conversations in Singapore and Malaysia on in-app chat and WhatsApp in English, Malay and Mandarin, integrated to the returns workflow and payments pipeline, measured on contacts per return case.",
    expansion: [
      "Add proactive delivery-exception detection and in-channel resolution",
      "Extend to Indonesia, the Philippines, Hong Kong and Taiwan with local language and channel coverage",
      "Introduce sizing and fit guidance conversations to reduce return rates upstream",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Operating Officer",
      "Regional Head of Customer Care",
      "Head of Logistics and Fulfilment",
      "Chief Technology Officer",
    ],
    discovery: [
      "What is your current support cost per order, and how does it split between returns, refunds and delivery?",
      "How many contacts does an average return case generate from initiation to refund?",
      "Which markets carry the heaviest return-related volume and why?",
      "Can courier partner status be consumed in real time across all your last-mile partners?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Zalora customer in Singapore returns a dress on WhatsApp, books the courier pickup in the same thread, and is told automatically when the refund settles.",
  },

  "carousell": {
    operatingContext:
      "Carousell Group is a Singapore-headquartered classifieds and recommerce marketplace operating across Singapore, Malaysia, Indonesia, the Philippines, Vietnam, Hong Kong and Taiwan, with vertical brands in cars and property alongside its general consumer-to-consumer marketplace. Because most transactions happen between individual users, its defining operational challenges are trust and safety, scam and fraud prevention, listing moderation, and dispute resolution between buyers and sellers, rather than conventional order support. It has a genuine product-engineering culture and has invested in machine learning for moderation and recommendations, so it evaluates any external capability against what its own teams could build. User contact runs through in-app help, web forms and community channels, in English, Mandarin, Malay, Bahasa Indonesia and other regional languages.",
    strategicPressure: [
      { text: "Carousell operates a consumer-to-consumer marketplace across several Southeast Asian markets plus Hong Kong and Taiwan, where trust and safety rather than fulfilment defines the operational burden.", kind: "verified" },
      { text: "Scam and fraud prevention on classifieds platforms is subject to increasing regulatory and public attention in Singapore, raising the stakes on dispute and report handling.", kind: "verified" },
      { text: "A genuine product-engineering culture means the company will treat support automation as a build-versus-context decision rather than an automatic purchase.", kind: "inference" },
      { text: "Dispute mediation between two individual users is inherently conversational and multi-party, which is precisely what its existing rules-based automation cannot resolve.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Co-build. Carousell builds its own moderation and marketplace machine learning and would not accept a turnkey black box. The realistic motion is supplying speech, conversational reasoning and evaluation capability into support tooling that Carousell continues to own, control and instrument.",
    whyNotBuild:
      "Carousell can and does build classification and moderation models tuned to its own data. What it will not build is a frontier conversational reasoning and evaluation layer capable of mediating a two-party dispute in five languages — that is a moving research frontier well outside a marketplace's engineering charter, and its teams will recognise that faster than most.",
    workflows: [
      {
        name: "Buyer-seller dispute mediation",
        friction: "Disputes over item condition, non-delivery or payment escalate through forms and slow email exchanges where each party tells their story separately, and resolution depends on an overloaded trust-and-safety queue.",
        outcome: "Structured, conversational mediation that gathers evidence from both parties in their own language, applies policy consistently, and escalates genuinely contested cases with a complete case file.",
        channels: ["In-app chat", "Web chat", "Email"],
        systems: ["Dispute and case management", "Transaction and listing records", "User trust and reputation data", "Payment and escrow records"],
        value: 3, complexity: 3,
      },
      {
        name: "Scam and fraud report intake and triage",
        friction: "Users report suspected scams through forms with unstructured descriptions, so triage requires human reading before any action, and urgent cases sit alongside routine ones.",
        outcome: "Structured report intake that extracts the signals moderation actually needs, triages by severity, and escalates high-risk cases immediately with evidence attached.",
        channels: ["In-app chat", "Web form", "Email"],
        systems: ["Trust and safety case management", "Listing and user records", "Moderation models", "Law-enforcement referral workflow"],
        value: 3, complexity: 3,
      },
      {
        name: "Seller support and listing-quality guidance",
        friction: "Sellers whose listings are rejected or restricted receive template notifications they do not understand, then contact support to ask why, generating volume that better explanation would prevent.",
        outcome: "Conversational explanation of moderation decisions grounded in policy with guided remediation, converting a support contact into a corrected listing.",
        channels: ["In-app chat", "Web chat"],
        systems: ["Moderation decision records", "Listing catalogue", "Policy knowledge base", "Seller records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "In-app help centre and support request flows",
        "Automated moderation and listing-classification machine learning",
        "A trust-and-safety team handling escalated disputes and fraud reports",
        "In-app chat between buyers and sellers as the primary transaction channel",
      ],
      gaps: [
        "Disputes are handled through asynchronous forms rather than mediated conversation with both parties",
        "Fraud reports arrive unstructured and require human reading before triage",
        "Moderation decisions are explained by template, generating avoidable support contacts",
        "No voice channel at all for high-value verticals such as cars and property",
      ],
    },
    risks: [
      "Singapore's PDPA plus the data-protection regimes of its other markets govern user data, and dispute evidence frequently contains third-party personal information.",
      "Online safety and scam-prevention regulation in Singapore is tightening, so report handling and escalation must satisfy evolving statutory expectations including law-enforcement referral.",
      "As a co-build account, the boundary between what Carousell builds and what is supplied must be agreed explicitly, or the engagement will be re-litigated at every sprint.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 3.0,
      automationRate: 0.55,
      basis: "Support and trust-and-safety interaction volume, blended cost per contact and automation rate are seller assumptions from marketplace benchmarks and must be validated against Carousell's own case-management data.",
    },
    pilotScope:
      "An eight-week Launch engagement supplying conversational reasoning and evaluation for buyer-seller dispute mediation in Singapore and Malaysia in English, Mandarin and Malay, operated inside Carousell's own case-management tooling, measured on time-to-resolution and escalation rate.",
    expansion: [
      "Extend to structured scam and fraud report intake with severity-based triage",
      "Add moderation-decision explanation and listing remediation guidance for sellers",
      "Introduce voice support for the cars and property verticals where transaction values justify it",
    ],
    stakeholders: [
      "Group Chief Executive Officer / Co-founder",
      "Chief Product Officer",
      "Head of Trust and Safety",
      "Head of Customer Experience",
      "Chief Technology Officer",
    ],
    discovery: [
      "Does your team consider support and dispute automation core product work, or context you would rather source?",
      "How many disputes and fraud reports do you handle monthly, and what is the current time to resolution?",
      "What share of support contacts are sellers asking why a listing was actioned?",
      "Where do your own models stop being sufficient for a conversational dispute, and what would you want supplied?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Carousell buyer and seller in a condition dispute are mediated conversationally in Malay and English, with evidence gathered from both and a policy-consistent outcome in hours rather than days.",
  },

  "ntuc-fairprice": {
    operatingContext:
      "NTUC FairPrice Group is Singapore's dominant grocery retailer, operating FairPrice supermarkets, FairPrice Finest, FairPrice Xtra and Cheers convenience formats alongside Kopitiam food courts and a substantial online grocery business, all within a social-enterprise cooperative structure that carries an explicit affordability mandate. Its customer relationship is anchored by the Link Rewards loyalty programme and the FairPrice app, giving it identified household-level data across a very large share of Singapore residents. Contact concentrates on online-order issues, delivery-slot changes and substitutions, loyalty and membership queries, and store-level enquiries, arriving through a customer service line, app and web chat, email and social channels in English, Mandarin and Malay. Festive periods and public-holiday cycles produce concentrated online-grocery demand and service spikes.",
    strategicPressure: [
      { text: "FairPrice Group is Singapore's largest grocery retailer operating under a social-enterprise cooperative mandate that makes cost discipline and affordability explicit obligations rather than choices.", kind: "verified" },
      { text: "Its online grocery operation, expanded substantially since the pandemic, generates a support load per order that physical retail never did.", kind: "verified" },
      { text: "The Link Rewards programme and app give it identified household data that could support proactive service, but the relationship today is largely promotional rather than conversational.", kind: "inference" },
      { text: "Singapore's labour costs make every assisted service contact expensive against grocery basket margins, which are among the thinnest in retail.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Buy-led. FairPrice is a grocery cooperative whose technology function runs merchandising, point-of-sale, loyalty and e-commerce platforms procured from vendors. It has no platform-engineering tradition and a mandate that makes speculative internal building difficult to justify.",
    whyNotBuild:
      "A cooperative with an affordability mandate cannot justify funding four new engineering disciplines when a configured platform delivers containment in a quarter. Grocery retail buys its technology, and the value here is entirely in how fast the deployment reduces the cost of servicing an order.",
    workflows: [
      {
        name: "Online-order issue and substitution resolution",
        friction: "Missing items, unwanted substitutions and damaged goods generate calls, chats and social posts; agents check the order system and the delivery operation separately, and refunds become tickets resolved days later.",
        outcome: "Order recognised instantly, live delivery and picking status retrieved, and refunds, credits or redelivery executed in the conversation within an approved policy matrix.",
        channels: ["App chat", "WhatsApp", "Voice", "Web chat"],
        systems: ["Online order management", "Warehouse and picking systems", "Delivery scheduling", "Refund and payments"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery-slot management and proactive exception handling",
        friction: "Customers wanting to change a delivery slot, or whose delivery is running late, have no conversational route; slot changes require a call and late deliveries produce inbound complaints.",
        outcome: "Slot changes handled conversationally against live capacity and late deliveries flagged proactively with options, before the customer contacts anyone.",
        channels: ["App chat", "WhatsApp", "SMS", "Voice"],
        systems: ["Delivery scheduling", "Route and fleet management", "Order management", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "Link Rewards and membership servicing",
        friction: "Points, voucher, membership and rebate questions arrive at the service line, store counters and social channels in large volume, each a simple lookup that costs a full assisted contact.",
        outcome: "Instant grounded answers on points, vouchers, rebates and membership status in three languages, removing a high-volume, low-complexity category from human handling.",
        channels: ["App chat", "WhatsApp", "Voice", "Web chat"],
        systems: ["Loyalty platform", "Membership records", "Promotions engine", "Point-of-sale transaction history"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A customer service line covering online orders, loyalty and store enquiries",
        "The FairPrice app and website with ordering, Link Rewards and account features",
        "Store customer-service counters across supermarket and convenience formats",
        "Social-media channels carrying a meaningful share of complaint traffic",
      ],
      gaps: [
        "Order issues cannot be resolved end-to-end in one conversation without a ticket",
        "Delivery-slot changes and late-delivery exceptions have no proactive conversational path",
        "Loyalty and membership questions still consume assisted-contact capacity",
        "No unified conversational front door across app, phone, social and store channels",
      ],
    },
    risks: [
      "Singapore's PDPA governs household-level loyalty and purchase data, which is unusually rich here and requires careful purpose limitation for conversational identification.",
      "Refund and goodwill authority must be bounded by policy with human approval above a threshold, since grocery margins cannot absorb systematic automated concessions.",
      "As a social enterprise with an affordability mandate, any automation must be demonstrably service-improving as well as cost-reducing, since service degradation would attract public criticism.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 3.2,
      automationRate: 0.65,
      basis: "Interaction volume, Singapore cost per contact and automation rate are seller assumptions from developed-market grocery retail benchmarks and require validation against FairPrice's service-line, chat and social-channel data.",
    },
    pilotScope:
      "A twelve-week Scale pilot resolving online-order issues and delivery-slot changes on the app, WhatsApp and the service line in English, Mandarin and Malay, integrated to order management and delivery scheduling, measured on first-contact resolution and cost per online order supported.",
    expansion: [
      "Add proactive delivery-exception outreach ahead of customer contact",
      "Extend to Link Rewards and membership servicing across all channels",
      "Introduce store-level enquiry handling and Kopitiam and convenience-format servicing",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Executive Officer, FairPrice Group Retail",
      "Head of Customer Experience",
      "Head of Online / E-commerce",
      "Chief Information Officer",
    ],
    discovery: [
      "How many contacts a month does the online grocery business generate, and what is your support cost per online order?",
      "What refund and goodwill authority does a frontline agent hold without escalation?",
      "Where does Link Rewards servicing sit organisationally relative to retail customer service?",
      "Can live picking and delivery status be exposed per order to an external orchestration layer?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A FairPrice online shopper reports two substituted items on WhatsApp and gets a credit applied and the delivery slot moved without a ticket or a callback.",
  },

  "parkway-ihh-sg": {
    operatingContext:
      "Parkway Hospitals Singapore, part of IHH Healthcare, operates the Mount Elizabeth Orchard and Novena, Gleneagles and Parkway East hospitals, together forming Singapore's largest private hospital cluster and among the region's most recognised premium medical brands. Its patient mix combines Singapore private and insured patients with a substantial international-patient franchise drawn from Indonesia, Vietnam, Myanmar, Bangladesh and beyond, many of whom research, price and coordinate treatment remotely before travelling. Contact runs through hospital call centres, specialist clinic lines, the Parkway appointment channels, health-screening desks and dedicated international patient assistance centres, covering appointment scheduling, specialist referral, cost estimates, insurance coordination and travel logistics. Language needs span English, Mandarin, Malay and Bahasa Indonesia, with other regional languages relevant to the medical-travel segment.",
    strategicPressure: [
      { text: "Parkway operates Singapore's largest private hospital cluster including Mount Elizabeth and Gleneagles, brands with strong regional recognition among international patients.", kind: "verified" },
      { text: "Singapore's international-patient business competes directly with Malaysia, Thailand and increasingly India, where responsiveness and cost transparency are decisive at the enquiry stage.", kind: "verified" },
      { text: "Cost-estimate and insurance-coordination enquiries are among the hardest to answer quickly, yet they are exactly what determines whether a high-value international case proceeds.", kind: "inference" },
      { text: "A Singapore deployment would credential the platform across IHH's operations in more than ten markets, which raises the strategic value well above the Singapore economics alone.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. IHH runs group technology programmes and deploys through partners under group vendor assurance. Parkway has the operational scale and international-patient complexity to justify a substantial deployment, but not a mandate to build conversational infrastructure locally.",
    whyNotBuild:
      "Hospital technology governance capacity is consumed by clinical systems where patient safety obligations dominate. Multilingual speech spanning Bahasa Indonesia and regional languages, telephony, orchestration into scheduling and estimate systems, and per-conversation evaluation are outside that remit and would be procured under IHH group standards.",
    workflows: [
      {
        name: "International-patient enquiry and coordination",
        friction: "Enquiries from Indonesia and Indochina arrive by email, WhatsApp and phone across time zones asking about specialists, costs, visas and logistics; slow or overnight-unanswered replies lose high-value cases to regional competitors.",
        outcome: "Around-the-clock coordination in the enquirer's language covering specialist matching, indicative estimates, document requirements and appointment sequencing, with coordinators handling clinical complexity.",
        channels: ["WhatsApp", "Voice", "Email", "Web chat"],
        systems: ["International patient assistance records", "Specialist scheduling", "Cost-estimate tooling", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Appointment scheduling across the hospital cluster",
        friction: "Patients call one hospital, find their preferred specialist unavailable, and must call another campus and start over; each clinic line has its own queue and process.",
        outcome: "One front door matching patients to available specialists across Mount Elizabeth, Gleneagles and Parkway East and booking into live schedules.",
        channels: ["Voice", "WhatsApp", "Web chat", "App"],
        systems: ["Hospital information systems", "Specialist scheduling", "Patient master index", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Cost-estimate and insurance-coordination enquiries",
        friction: "Cost-estimate requests and insurance and guarantee-letter coordination require manual assembly across billing, admissions and payers, delaying decisions for both local and international patients.",
        outcome: "Indicative estimates and insurance-coordination status delivered conversationally from governed sources, with complex cases routed to billing and admissions with structured context.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Billing and estimate systems", "Admissions", "Insurance and TPA interfaces", "Hospital information system"],
        value: 3, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Hospital call centres and specialist clinic appointment lines across the cluster",
        "Dedicated international patient assistance centres for medical-travel enquiries",
        "Online appointment request and health-screening enquiry channels",
        "Published specialist directories and hospital service information",
      ],
      gaps: [
        "No single front door that can find and book across all four hospitals",
        "Overnight and cross-time-zone international enquiries go unanswered until the next working day",
        "Cost estimates require manual assembly rather than being answerable conversationally",
        "No Bahasa Indonesia conversational coverage despite it being the largest medical-travel source language",
      ],
    },
    risks: [
      "Singapore's PDPA and healthcare confidentiality obligations govern patient data, and international cases involve cross-border transfer that must be designed for explicitly.",
      "Ministry of Health rules on medical advertising and price transparency constrain how treatment and cost information may be presented, so estimates must be grounded and clearly indicative.",
      "Clinical triage and treatment-suitability questions are an absolute human boundary; the agent may schedule, inform and coordinate only.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 4.5,
      automationRate: 0.45,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from premium private-hospital benchmarks and must be validated against Parkway's call-centre and international-patient-centre data.",
    },
    pilotScope:
      "A twelve-week Scale pilot delivering international-patient enquiry coordination and cross-cluster appointment scheduling on WhatsApp and hospital lines in English, Mandarin and Bahasa Indonesia, measured on overnight-enquiry capture and enquiry-to-appointment conversion.",
    expansion: [
      "Add cost-estimate and insurance-coordination conversations with payer and TPA integration",
      "Extend to health-screening booking and pre-admission preparation across the cluster",
      "Propose the deployment as an IHH group reference across its other operating markets",
    ],
    stakeholders: [
      "Chief Executive Officer, Parkway Hospitals Singapore",
      "Chief Operating Officer",
      "Head of Patient Experience",
      "Director, International Patient Services",
      "Group Chief Information Officer, IHH",
    ],
    discovery: [
      "How many international-patient enquiries do you receive monthly and what is your current response time overnight?",
      "Do all four hospitals share one scheduling platform, or is booking campus-specific?",
      "How long does a cost estimate take to produce today, and who assembles it?",
      "How is coordination divided between hospital teams and IHH group functions for medical-travel cases?",
    ],
    flowTemplate: "appointments",
    scenario: "A Jakarta patient messages Mount Elizabeth in Bahasa Indonesia at midnight and leaves with a specialist slot, an indicative estimate and a document checklist.",
  },

  "raffles-medical": {
    operatingContext:
      "Raffles Medical Group is a Singapore-headquartered integrated healthcare provider running Raffles Hospital in Singapore, a large network of Raffles Medical clinics across the island, dental and specialist services, an insurance arm in Raffles Health Insurance, and hospitals in China and Vietnam. Its distinctive model is vertical integration — primary care clinics feeding a tertiary hospital, with its own insurance product alongside — which means a single patient relationship can span clinic visits, hospital care, health screening and claims. Patients reach it through clinic phone lines, a hospital call centre, the Raffles Connect app, corporate health-plan channels and walk-ins, with appointment booking across dozens of clinics, health-screening scheduling and insurance-claim queries dominating volume. Service languages are English, Mandarin and Malay, with corporate and expatriate patient segments adding further diversity.",
    strategicPressure: [
      { text: "Raffles Medical operates an integrated model spanning a hospital, a large clinic network, insurance and overseas hospitals in China and Vietnam under one brand.", kind: "verified" },
      { text: "A large distributed clinic network means appointment demand is spread across dozens of small sites, each answering its own phone with limited administrative capacity.", kind: "inference" },
      { text: "Corporate health-plan and insurance relationships add eligibility and coverage questions that clinic staff are poorly positioned to answer accurately.", kind: "inference" },
      { text: "Singapore's labour costs make front-desk administrative time expensive, and clinic staff answering phones are simultaneously serving patients in front of them.", kind: "verified" },
    ],
    buildVsBuyWhy:
      "Buy-led. Raffles Medical is a physician-led clinical organisation whose technology function runs clinical, scheduling and insurance systems procured from vendors. There is no platform-engineering capability, and a conversational layer spanning clinics, hospital and insurance is a bought capability.",
    whyNotBuild:
      "A clinically-led group directs its investment to care delivery and clinical systems. Speech, telephony across dozens of clinic lines, orchestration into scheduling and insurance systems, and evaluation are four engineering disciplines with no clinical return and no internal home.",
    workflows: [
      {
        name: "Clinic-network appointment booking",
        friction: "Patients call individual clinics where front-desk staff answer the phone while serving patients in person; lines are busy at peak, and the caller has no view of availability at a nearby clinic.",
        outcome: "Appointments booked conversationally against live availability across the clinic network, freeing front-desk staff for patients physically present.",
        channels: ["Voice", "WhatsApp", "App", "Web chat"],
        systems: ["Clinic scheduling system", "Hospital information system", "Patient records", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Health-screening scheduling and preparation",
        friction: "Corporate and individual health-screening bookings involve package selection, fasting instructions and multi-station scheduling, communicated verbally and frequently misremembered, causing wasted slots.",
        outcome: "Screening packages explained and booked with structured preparation instructions and reminders confirmed by the patient, raising throughput and cutting no-shows.",
        channels: ["WhatsApp", "Voice", "App", "SMS"],
        systems: ["Screening package catalogue", "Scheduling system", "Corporate health-plan records", "Notification platform"],
        value: 3, complexity: 2,
      },
      {
        name: "Insurance eligibility and claim-status enquiries",
        friction: "Patients with Raffles Health Insurance or corporate plans ask about coverage, eligibility and claim status, and clinic or hospital staff cannot answer authoritatively without contacting the insurance side.",
        outcome: "Coverage and claim status answered conversationally from insurance and corporate-plan records, with genuine adjudication questions routed to the insurance team.",
        channels: ["Voice", "WhatsApp", "App", "Web chat"],
        systems: ["Insurance policy administration", "Claims adjudication", "Corporate plan records", "Hospital billing"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Individual clinic phone lines and a hospital call centre",
        "The Raffles Connect app supporting appointments and health records",
        "Corporate health-plan servicing channels for employer clients",
        "Walk-in reception at clinics and hospital service counters",
      ],
      gaps: [
        "No network-level booking view, so patients call clinic by clinic",
        "Front-desk staff answer phones while serving patients in person, degrading both",
        "Screening preparation instructions are not reliably confirmed, wasting slots",
        "Insurance coverage and claim questions cannot be answered at the point of care",
      ],
    },
    risks: [
      "Singapore's PDPA and medical confidentiality govern patient records across clinics, hospital and insurance, and the integrated model means data crosses internal entity boundaries requiring careful access control.",
      "MAS insurance conduct rules apply to the Raffles Health Insurance side, so coverage statements must be informational and never advisory.",
      "Clinical triage and symptom advice are absolute human boundaries; the agent schedules, informs and prepares only.",
    ],
    economics: {
      volumeMonthly: 320000,
      costPerInteraction: 3.6,
      automationRate: 0.6,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from integrated-healthcare benchmarks and must be validated against Raffles Medical's clinic-line, call-centre and insurance contact data.",
    },
    pilotScope:
      "An eight-week Launch pilot delivering clinic-network appointment booking and health-screening scheduling on voice and WhatsApp in English, Mandarin and Malay, integrated to the clinic scheduling system, measured on front-desk hours released and no-show rate.",
    expansion: [
      "Add insurance eligibility and claim-status conversations spanning the insurance arm",
      "Extend to hospital appointment and pre-admission coordination",
      "Evaluate deployment for the China and Vietnam hospital operations with local language coverage",
    ],
    stakeholders: [
      "Executive Chairman / Group Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Clinic Operations",
      "Chief Executive, Raffles Health Insurance",
      "Head of Information Technology",
    ],
    discovery: [
      "Do clinics and the hospital share one scheduling system an agent could book into?",
      "How much front-desk time across the clinic network goes to answering the phone?",
      "What is your health-screening no-show rate and how is preparation communicated today?",
      "Can insurance coverage and claim status be queried per patient across the group's systems?",
    ],
    flowTemplate: "appointments",
    scenario: "A Raffles Medical patient books a clinic appointment by voice in Mandarin at 7am and gets the nearest available slot without a single front-desk phone being answered.",
  },

  "thomson-medical": {
    operatingContext:
      "Thomson Medical Group is a Singapore-listed healthcare provider centred on Thomson Medical Centre's women's and children's services, one of Singapore's best-known private maternity and paediatric institutions, with a specialist clinic network, TMC Fertility operations in Malaysia and a major hospital acquisition in Vietnam extending it regionally. Its core service lines — antenatal packages, delivery, paediatrics and fertility treatment — involve long, emotionally significant patient journeys where the enquiry-to-booking conversion of a high-value package is decided on responsiveness and reassurance. Patients reach it through clinic and hospital lines, an appointment channel, specialist clinics and increasingly messaging, in English, Mandarin and Malay, with regional patients adding further language needs. Fertility and antenatal conversations are particularly sensitive, which shapes what may be automated and what must stay human.",
    strategicPressure: [
      { text: "Thomson Medical is anchored on women's and children's care, including a large maternity franchise and fertility services extending into Malaysia and Vietnam.", kind: "verified" },
      { text: "Antenatal and fertility packages are high-value, long-cycle purchases where enquiry responsiveness and emotional reassurance materially determine conversion.", kind: "inference" },
      { text: "Regional expansion into Vietnam and Malaysia creates a multi-market servicing footprint from a base with limited central service infrastructure.", kind: "verified" },
      { text: "Falling birth rates in Singapore intensify competition for each maternity patient, raising the commercial cost of a slow or unanswered enquiry.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Thomson Medical is a clinical operator expanding through acquisition; its technology function runs hospital and clinic systems from healthcare vendors. It has no platform engineering and would procure a conversational capability with tight clinical and emotional-sensitivity boundaries.",
    whyNotBuild:
      "A specialist clinical group of this scale has no route to building speech, telephony, orchestration and evaluation, and the specific requirement — bounded, sensitively-designed conversations about fertility and pregnancy — is a configuration and governance problem on a governed platform, not a research programme.",
    workflows: [
      {
        name: "Antenatal and maternity package enquiry handling",
        friction: "Expectant parents enquire about package inclusions, delivery options and pricing by phone and web form; responses come during office hours and vary by who answers, while the family is comparing institutions.",
        outcome: "Consistent, grounded package and pricing information delivered promptly in the family's language with a specialist appointment booked in the same conversation.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Package and pricing catalogue", "Specialist scheduling", "Patient records", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Appointment scheduling and antenatal visit reminders",
        friction: "Antenatal care involves a long sequence of scheduled visits; rescheduling requires calling the clinic, and missed visits are only noticed after the fact.",
        outcome: "Visit scheduling and rescheduling handled conversationally with reminders and preparation guidance, improving both attendance and the care experience.",
        channels: ["WhatsApp", "SMS", "Voice", "App"],
        systems: ["Clinic and hospital scheduling", "Patient records", "Notification platform", "Care pathway records"],
        value: 3, complexity: 2,
      },
      {
        name: "Fertility-treatment enquiry triage with human handover",
        friction: "Fertility enquiries are emotionally sensitive and often arrive outside hours; a generic response or a delayed reply damages trust at exactly the moment a family is choosing a provider.",
        outcome: "Sensitive, carefully-bounded first response covering process, logistics and appointment booking, with every clinical and emotional escalation handed to a human counsellor with full context.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Fertility clinic scheduling", "Package information", "Patient records", "CRM"],
        value: 3, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Hospital and specialist clinic appointment lines",
        "Online enquiry forms and package information on the website",
        "Specialist clinic relationships as the primary continuing-care channel",
        "Messaging channels used informally by clinics for patient coordination",
      ],
      gaps: [
        "Package and pricing enquiries outside office hours go unanswered while families compare providers",
        "Antenatal visit rescheduling requires a phone call to the clinic",
        "Fertility enquiries have no sensitively-designed after-hours first response",
        "No consistent multilingual coverage for regional patients from Malaysia, Indonesia and Vietnam",
      ],
    },
    risks: [
      "Fertility and pregnancy conversations are emotionally sensitive and clinically consequential, so escalation design and tone governance matter more here than in almost any other deployment.",
      "Singapore's PDPA and medical confidentiality govern reproductive and maternity data, which is among the most sensitive categories, requiring strict access control and retention limits.",
      "Ministry of Health rules on medical advertising and on assisted reproduction services constrain what may be stated about treatment options and outcomes, so content must be approved and grounded.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 3.8,
      automationRate: 0.45,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from specialist private-healthcare benchmarks and must be validated against Thomson Medical's clinic-line and enquiry data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling antenatal and maternity package enquiries with appointment booking on WhatsApp and clinic lines in English, Mandarin and Malay, with strict clinical escalation rules, measured on enquiry-to-booking conversion and after-hours capture.",
    expansion: [
      "Add antenatal visit scheduling with reminders and preparation guidance across the care pathway",
      "Extend to fertility enquiry triage with a sensitively-designed human handover model",
      "Evaluate deployment for TMC Fertility Malaysia and the Vietnam hospital operation",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Patient Experience",
      "Medical Director / Head of Clinical Governance",
      "Head of Information Technology",
    ],
    discovery: [
      "What is your current enquiry-to-booking conversion on antenatal packages, and what happens to overnight enquiries?",
      "How sensitive are you to automating any part of a fertility conversation, and where exactly must a human take over?",
      "Can clinic and hospital scheduling be booked into by an external orchestration layer?",
      "How much enquiry volume comes from regional patients and in which languages?",
    ],
    flowTemplate: "appointments",
    scenario: "An expectant couple enquiring about a Thomson maternity package on a Sunday evening gets grounded package details in Mandarin and a specialist appointment for the week ahead.",
  },

  "sp-group": {
    operatingContext:
      "SP Group is Singapore's national electricity and gas transmission and distribution utility, owning the grid, operating the market-support services function that underpins the Open Electricity Market, and providing metering, billing services and a growing EV-charging and district-cooling business. Because retail electricity was liberalised, SP Group sits in a distinctive position — it delivers supply and handles market-support services for most households even where a retailer bills them — which makes its customer contact a mix of billing, account transfer, switching, supply-issue and EV-charging enquiries. Customers reach it through the SP app, which has absorbed substantial routine volume, a customer service line, web self-service and email, in English, Mandarin and Malay. Supply interruptions and planned works generate concentrated but relatively infrequent enquiry spikes given Singapore's high grid reliability.",
    strategicPressure: [
      { text: "SP Group operates Singapore's electricity and gas networks and the market-support services function underpinning the Open Electricity Market, giving it a relationship with nearly every household.", kind: "verified" },
      { text: "Its own app and digital channels have already absorbed a large share of routine transactions, so the remaining contact volume is disproportionately the complex residue.", kind: "inference" },
      { text: "Open Electricity Market switching, account transfers and move-in and move-out transactions generate a steady administrative contact load distinct from supply issues.", kind: "verified" },
      { text: "EV charging and new energy services add an unfamiliar and growing enquiry category that legacy utility scripts do not cover.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. SP Group is a regulated infrastructure operator whose engineering is grid assets, metering and network systems. Its digital channels are vendor-delivered under structured procurement, and conversational capability would be bought and grounded in its billing and network data.",
    whyNotBuild:
      "A grid operator's technical governance capacity goes to network reliability and metering integrity. Speech, telephony, orchestration into billing and market-support systems, and evaluation are outside that remit, and given how much routine volume the app already absorbs, the case rests on handling the complex residue efficiently — a configuration problem.",
    workflows: [
      {
        name: "Billing and account-transfer enquiries",
        friction: "Move-in, move-out, account-transfer and final-bill questions are administrative but multi-step, and they escape app self-service into an expensive assisted contact.",
        outcome: "Account transfers and move-in and move-out transactions completed conversationally with identity verified and changes written into the customer system.",
        channels: ["Voice", "App", "WhatsApp", "Web chat"],
        systems: ["Customer information and billing", "Market-support services records", "Meter data", "Payment gateway"],
        value: 3, complexity: 3,
      },
      {
        name: "Supply-issue reporting and restoration status",
        friction: "Supply interruptions and internal electrical faults produce calls where the customer cannot tell whether the problem is the grid or their own installation, and status afterwards is not pushed.",
        outcome: "Guided triage distinguishing network faults from premises issues, with grounded restoration status pushed for genuine network events and safe escalation for anything electrical.",
        channels: ["Voice", "App", "WhatsApp", "SMS"],
        systems: ["Outage and network status", "Customer information system", "Field dispatch", "Notification platform"],
        value: 3, complexity: 3,
      },
      {
        name: "EV-charging and new-services support",
        friction: "EV-charging faults, payment issues and account questions arrive from a growing user base with no dedicated support model, and unresolved charging failures strand drivers.",
        outcome: "Charging session and payment issues diagnosed and resolved conversationally against live charger status, with faults dispatched and refunds applied within policy.",
        channels: ["App", "Voice", "WhatsApp"],
        systems: ["EV charging network management", "Payment and wallet records", "Fault dispatch", "Customer accounts"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The SP app and web self-service absorbing most routine billing and account transactions",
        "A customer service line for escalated and complex enquiries",
        "Digital chat and email support channels",
        "Outage and planned-works information published to customers",
      ],
      gaps: [
        "Multi-step account transfers and move-in transactions escape self-service into assisted contact",
        "Supply-issue triage cannot distinguish network from premises faults conversationally",
        "No conversational voice service in Mandarin or Malay",
        "EV-charging support has no dedicated real-time resolution channel",
      ],
    },
    risks: [
      "Energy Market Authority regulation governs market-support services, switching and supply obligations, so statements about supply, tariffs and switching must be grounded in regulated processes.",
      "Anything involving suspected electrical faults inside premises is a safety boundary requiring standard safety guidance and immediate escalation, never diagnosis.",
      "Singapore's PDPA governs consumption and account data, which at household granularity is sensitive behavioural information requiring strict purpose limitation.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 3.4,
      automationRate: 0.55,
      basis: "Volume, Singapore cost per contact and automation rate are seller assumptions from developed-market utility benchmarks and must be validated against SP Group's post-digitalisation residual contact data.",
    },
    pilotScope:
      "An eight-week Launch pilot handling billing, account-transfer and move-in transactions on voice and the app in English, Mandarin and Malay, integrated to the customer information system, measured on assisted-contact deflection for the intents that currently escape self-service.",
    expansion: [
      "Add supply-issue triage with grounded restoration status and safe escalation rules",
      "Extend to EV-charging and new-energy-services support",
      "Introduce proactive planned-works and interruption notifications to affected premises",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Head of Customer Experience",
      "Head of Market Support Services",
      "Head of Digital and Technology",
      "Head of Network Operations",
    ],
    discovery: [
      "Which intents consistently escape your app into an assisted contact, and what volume do they represent?",
      "What is your fully loaded cost per assisted contact today?",
      "Can outage and network status be exposed at premises level to an external orchestration layer?",
      "How is EV-charging support handled today and what is the fault-contact volume?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Singapore household moving flat completes the SP account transfer and final-bill arrangement by voice in Mandarin without ever reaching a service officer.",
  },

  "capitaland": {
    operatingContext:
      "CapitaLand Investment is a Singapore-headquartered global real-asset manager operating retail malls, offices, business parks, lodging through The Ascott Limited, and a substantial funds-management business, with properties across Singapore, China, India, Southeast Asia, Japan and beyond. Its customer-facing communication load is unusually diverse: mall shoppers in the CapitaStar loyalty programme, Ascott and lyf guests booking and modifying stays across dozens of countries, office and retail tenants raising service and facilities requests, and mall concierge enquiries. Each of these runs on different systems and different service teams, and none of them has the volume of a telco but together they represent a large multilingual contact estate. Its own technology arm focuses on proptech for asset and building operations rather than guest and shopper communications.",
    strategicPressure: [
      { text: "CapitaLand Investment manages retail, office, business park and lodging assets across many countries, so its customer contact spans shoppers, guests and tenants under different operating models.", kind: "verified" },
      { text: "The Ascott lodging business operates across dozens of markets, where booking modifications and guest enquiries arrive around the clock in many languages.", kind: "verified" },
      { text: "CapitaStar loyalty ties mall shoppers into an identified relationship that is used promotionally but not conversationally for service.", kind: "inference" },
      { text: "Contact volume is fragmented across business units, so no single unit may own enough volume alone to anchor a deployment — which makes unit selection the key qualification question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. CapitaLand invests in proptech for asset and building operations and has real technology capability, but that capability is directed at building systems, energy and asset performance rather than guest and shopper communications. A partner-delivered deployment against a chosen business unit fits how it acquires customer-facing capability.",
    whyNotBuild:
      "Its technology arm exists to make buildings and portfolios perform better, not to build speech and conversational orchestration. Multi-country guest servicing in many languages, telephony, orchestration into property management and loyalty systems, and evaluation would be four disciplines with no relationship to real-asset management returns.",
    workflows: [
      {
        name: "Ascott booking modification and guest servicing",
        friction: "Guests wanting to modify stays, extend, or ask about property services contact properties directly or a central line, across time zones and languages, with each property answering differently.",
        outcome: "Booking modifications, extensions and property questions handled conversationally around the clock in the guest's language, written into the property management system.",
        channels: ["WhatsApp", "Voice", "Web chat", "Email"],
        systems: ["Property management system", "Central reservation system", "Loyalty and guest records", "Payment gateway"],
        value: 3, complexity: 3,
      },
      {
        name: "CapitaStar loyalty and mall concierge servicing",
        friction: "Points, voucher, parking-redemption and mall-service questions arrive at concierge desks and a service line, each a simple lookup consuming staffed time at Singapore cost.",
        outcome: "Loyalty, parking and mall-service questions answered instantly in three languages across every mall, freeing concierge staff for genuinely in-person service.",
        channels: ["App chat", "WhatsApp", "Voice", "Web chat"],
        systems: ["Loyalty platform", "Parking and redemption systems", "Mall directory and tenant data", "Promotions engine"],
        value: 2, complexity: 2,
      },
      {
        name: "Tenant service-request handling",
        friction: "Retail and office tenants raise facilities, access and maintenance requests by email and phone to property management teams, with inconsistent acknowledgement and no visible tracking.",
        outcome: "Structured tenant request intake routed to the right facilities team with automatic acknowledgement and status push, evidencing service levels to tenants.",
        channels: ["WhatsApp", "Email", "Voice", "Tenant portal chat"],
        systems: ["Facilities and work-order management", "Tenant records", "Building management systems", "Service-level records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Ascott central reservations and property-level guest service teams",
        "The CapitaStar app and loyalty programme with mall offers and parking redemption",
        "Mall concierge desks and customer service lines",
        "Property management teams handling tenant service requests",
      ],
      gaps: [
        "Guests cannot modify Ascott bookings conversationally around the clock in their own language",
        "Loyalty and parking questions still consume concierge and service-line capacity",
        "Tenant service requests have no tracked, acknowledged status",
        "No unified conversational capability across malls, lodging and offices despite shared customers",
      ],
    },
    risks: [
      "Operating across many jurisdictions brings multiple data-protection regimes — Singapore PDPA, China's PIPL, India's DPDP Act, GDPR in Europe — which constrains where guest data may be processed.",
      "Loyalty and guest data use for conversational identification requires clear consent and purpose limitation, particularly across business units with different collection bases.",
      "Business-unit fragmentation is the main commercial risk: without a single unit owning enough volume and budget, the deployment will stall on internal sponsorship rather than on merit.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 3.6,
      automationRate: 0.55,
      basis: "Volume, blended cost per contact and automation rate are seller assumptions across lodging, retail and tenant servicing benchmarks, requiring validation against the specific CapitaLand business unit selected in discovery.",
    },
    pilotScope:
      "An eight-week Launch pilot handling Ascott booking modifications and guest servicing for a cluster of Singapore and regional properties on WhatsApp and voice in English, Mandarin and Malay, integrated to the property management system, measured on after-hours request capture and property-team hours released.",
    expansion: [
      "Extend Ascott servicing across additional markets with local language coverage",
      "Add CapitaStar loyalty and mall concierge servicing across the Singapore mall portfolio",
      "Introduce tenant service-request intake with facilities work-order integration",
    ],
    stakeholders: [
      "Chief Executive Officer, CapitaLand Investment",
      "Chief Executive Officer, The Ascott Limited",
      "Head of Retail Operations / CapitaStar",
      "Head of Property and Facilities Management",
      "Chief Digital Officer / Head of Technology",
    ],
    discovery: [
      "Which business unit — Ascott, retail malls or property management — carries enough contact volume and budget to anchor a first deployment?",
      "How are Ascott guest enquiries handled outside property operating hours today?",
      "How much concierge and service-line time goes to CapitaStar loyalty and parking questions?",
      "Can the property management and central reservation systems be transacted against by an external orchestration layer?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An Ascott guest in Ho Chi Minh City extends a stay on WhatsApp at 1am in Mandarin, with the change written into the property system and confirmed instantly.",
  },
};
