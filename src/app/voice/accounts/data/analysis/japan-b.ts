// Deep analysis blocks for Japan qualified profiles, second half of the universe
// (rail, travel, hotels, utilities, media, logistics, care, staffing, property,
// auto finance, and service operators). Evidence discipline: "verified" is used
// only for widely-reported public facts; no figures, quotes, dates or URLs are
// invented. Everything in economics is a seller assumption to validate.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_JAPAN_B: Record<string, ProfileAnalysis> = {
  "jr-west": {
    operatingContext:
      "West Japan Railway runs the Sanyo Shinkansen plus a dense conventional network across Kansai, Chugoku, Hokuriku and northern Kyushu, anchored on the Osaka Loop, Kyoto, Kobe and Hiroshima corridors and roughly a thousand stations. Beyond rail it operates hotels, station retail and shopping-centre businesses, so a single customer can hold a commuter pass, an ICOCA balance, an e5489 reservation and a hotel booking at once. Customers reach it today through Midori-no-Madoguchi ticket windows, station staff, the WESTER app and website, and telephone centres that are substantially outsourced to domestic BPOs. Inbound tourism through Kyoto, Osaka and Hiroshima layers English, Chinese and Korean demand on top of an aging domestic ridership that still prefers to phone or walk up to a counter.",
    strategicPressure: [
      { text: "JR West has been consolidating and reducing staffed Midori-no-Madoguchi ticket counters while pushing customers to ticket machines and online reservation, and has publicly had to moderate that pace after congestion complaints.", kind: "verified" },
      { text: "Rail operators cannot recruit station and crew staff at historic levels; the servicing tasks removed from counters land on telephone lines rather than disappearing.", kind: "inference" },
      { text: "Lost-and-found is an enormous, entirely manual voice workload for a network this size, and inbound-tourist lost property arrives in languages the station estate cannot staff overnight.", kind: "inference" },
      { text: "Post-pandemic recovery is skewed toward inbound leisure rather than commuter revenue, which raises the multilingual servicing share of every contact without raising staffed capacity.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "JR West's engineering strength sits in rolling stock, signalling, safety systems and station infrastructure, and its customer-facing IT (reservation, IC card, app) is delivered through group SIers and vendor contracts rather than an in-house product organisation. There is no public evidence of an internal conversational-AI platform team, and contact-centre operations are largely contracted to domestic BPOs — the classic buy-led shape.",
    whyNotBuild:
      "Building this means owning Japanese ASR tuned to station names and rail jargon, keigo-grade TTS an operator with JR West's public-safety brand would accept, carrier-grade telephony into an outsourced centre estate, orchestration into reservation and lost-property systems, plus continuous evaluation in four languages. None of that is on the roadmap of a railway whose capital priorities are seismic reinforcement, platform doors and rolling stock.",
    workflows: [
      {
        name: "Multilingual lost-and-found intake and matching",
        friction: "A passenger who leaves a bag on a train phones a station or the customer centre, describes the item in halting Japanese or English, and staff manually search a lost-property register across multiple stations, often calling back hours later.",
        outcome: "Structured item description captured in the caller's language at any hour, matched against the lost-property register, with pickup station and hours confirmed in-conversation and a human handling only ambiguous or valuable items.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Lost-property register", "Station operations system", "CRM / customer-centre ticketing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Reservation and ticket-change support for e5489 and Shinkansen bookings",
        friction: "Older customers who cannot complete a change on the app or a ticket machine queue at Midori-no-Madoguchi or phone the reservation centre, where a human re-reads seat availability that the system already knows.",
        outcome: "Seat changes, refunds and reserved-seat questions completed in conversation against live inventory, with the counter reserved for genuinely complex itineraries and accessibility cases.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Seat-reservation system", "Fare and refund rules engine", "IC-card / member account"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Accessibility-assistance and barrier-free travel booking",
        friction: "Wheelchair and assistance requests are taken by phone station-by-station, then coordinated manually between origin, transfer and destination staff, which limits how late a request can be accepted.",
        outcome: "Assistance requests captured conversationally with route, time and equipment details, routed to every station on the itinerary, and confirmed back to the passenger before travel.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Station operations system", "Timetable / routing", "Assistance dispatch records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "WESTER app and member account covering timetables, reservations and points",
        "e5489 online reservation service for Shinkansen and limited-express seats",
        "ICOCA IC card estate with balance, commuter-pass and refund servicing",
        "Staffed Midori-no-Madoguchi counters plus telephone customer centres run with outsourced operators",
      ],
      gaps: [
        "No end-to-end lost-and-found journey a non-Japanese speaker can complete without a station visit",
        "After-hours reservation changes require waiting for centre opening or using a machine the customer already failed at",
        "Accessibility assistance cannot be booked conversationally across a multi-operator itinerary",
        "Disruption-time enquiries have no personalised channel — passengers get broadcast announcements, not answers about their own booking",
      ],
    },
    risks: [
      "Public-transport safety communications are regulated and reputationally sensitive: automated voice must be firewalled from anything touching accident, evacuation or service-suspension instructions.",
      "APPI obligations apply to lost-property records that frequently contain identity documents, wallets and phones, so retention and access rules must be explicit before any pilot.",
      "Contact-centre work is contracted to domestic BPO partners, so commercial terms and headcount commitments in those contracts constrain how quickly volume can be shifted.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions for pilot sizing only — contact volume, blended cost per handled contact and achievable containment must be validated against JR West's customer-centre and BPO reporting in discovery.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating inbound lost-and-found intake in Japanese, English, Chinese and Korean for the Osaka and Kyoto station clusters, with structured item capture written into the lost-property register and human handover for high-value items.",
    expansion: [
      "Extend lost-and-found across the full station estate and add proactive outbound notification when an item is matched",
      "Add e5489 and Shinkansen reservation-change servicing on the same voice and LINE front door",
      "Attach disruption-time personalised enquiry handling for reserved-seat passengers during weather and incident events",
    ],
    stakeholders: [
      "General Manager, Railway Operations Headquarters",
      "Head of Customer Service / Customer Centre",
      "General Manager, Digital Solutions / IT Systems Division",
      "Head of Station Operations (Kansai area)",
      "Procurement lead for outsourced contact-centre services",
    ],
    discovery: [
      "How many lost-property enquiries do stations and the customer centre handle a month, and what share arrive by phone versus in person?",
      "Which BPO partners run the telephone centres today, and what notice or volume commitments sit in those contracts?",
      "What share of customer-centre calls are non-Japanese, and how are they handled outside daytime hours?",
      "Who owns the decision on customer-facing voice — the railway operations headquarters, the digital division, or each area office?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A visitor leaves a camera bag on a Sanyo Shinkansen service and phones JR West at 22:40 in English; the agent captures the item, train and car number, matches the lost-property register and confirms the pickup station and hours.",
  },

  "jr-central": {
    operatingContext:
      "Central Japan Railway operates the Tokaido Shinkansen between Tokyo, Nagoya and Shin-Osaka — the busiest high-speed line in the world and the overwhelming source of the company's revenue — alongside conventional lines around Nagoya and the Chuo Shinkansen maglev project. Its customers are dominated by business travellers on the EX reservation services (Express Reservation and Smart EX) plus domestic and international leisure passengers buying at counters and machines. Contact today runs through the EX membership site and app, TOICA IC-card servicing, staffed ticket counters, and telephone centres for reservation support and membership issues. The operating model is famously lean and schedule-obsessed, which makes any customer-contact spike — weather suspension, earthquake stoppage, a rescheduled meeting — hit a deliberately thin servicing layer.",
    strategicPressure: [
      { text: "JR Central's revenue and profit are concentrated in a single high-speed corridor, so Shinkansen reservation servicing is not a peripheral cost centre but the customer interface of the core business.", kind: "verified" },
      { text: "The Chuo Shinkansen maglev programme consumes an extraordinary share of capital and management attention, leaving little appetite for discretionary software programmes in customer service.", kind: "verified" },
      { text: "Typhoon and seismic service suspensions on the Tokaido corridor produce sharp, unpredictable enquiry spikes that a lean centre cannot staff for and that broadcast announcements do not resolve at booking level.", kind: "inference" },
      { text: "Growth in inbound visitors buying Shinkansen seats through Smart EX raises the share of non-Japanese enquiries at exactly the points where staffed capacity is thinnest.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "The engineering culture is world-class in rolling stock, track and signalling and is currently absorbed by maglev, not in conversational software. Reservation and membership platforms are built and operated with vendor and group-SIer partners, and there is no public evidence of an internal speech or conversational-AI capability. Bounded servicing workflows are therefore a bought package, not a build.",
    whyNotBuild:
      "A railway whose safety-critical software discipline is its identity will not stand up a speech stack, telephony estate, LLM orchestration and evaluation harness for reservation servicing. The value is in a governed, evaluable layer that never touches operational safety communications — which is precisely what a packaged deployment with human escalation provides.",
    workflows: [
      {
        name: "Shinkansen reservation and seat-change servicing",
        friction: "A business traveller whose meeting moves cannot complete a change on the EX app and phones the centre, where an operator re-reads seat availability, fare differences and refund rules that live in the reservation system.",
        outcome: "Seat and train changes executed conversationally against live inventory with fare difference explained and confirmed, freeing operators for exception cases and group bookings.",
        channels: ["Voice", "App", "LINE"],
        systems: ["Seat-reservation system", "EX membership account", "Fare and refund rules engine"],
        value: 3,
        complexity: 3,
      },
      {
        name: "EX membership and payment-issue support",
        friction: "Password resets, card-expiry failures and membership registration problems on the EX services generate repetitive calls that are pure identity-and-account work, handled by humans at business-hours cost.",
        outcome: "Authenticated self-service for membership, card and login issues in conversation at any hour, with fraud-sensitive cases escalated to staff.",
        channels: ["Voice", "Web", "App"],
        systems: ["EX membership platform", "Payment / card processor", "Identity and authentication"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Disruption-time booking enquiries for reserved passengers",
        friction: "When the corridor suspends, passengers hear generic announcements and then flood counters and phone lines asking what happens to their specific reserved seat and refund entitlement.",
        outcome: "Every reserved passenger can ask about their own booking and get a grounded answer on validity, rebooking options and refund handling, absorbing the spike without adding staffed capacity.",
        channels: ["Voice", "App", "SMS"],
        systems: ["Seat-reservation system", "Operations status feed", "Refund processing"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Express Reservation and Smart EX membership services with app and web booking",
        "TOICA IC card and integrated touch-to-ride Shinkansen entry",
        "Staffed ticket counters and ticket machines across Tokaido corridor stations",
        "Telephone support centres for reservation and membership enquiries",
      ],
      gaps: [
        "No conversational path for a customer who has already failed in the app — the fallback is a queue",
        "Disruption enquiries are answered as broadcasts, not per-booking answers",
        "Non-Japanese speakers have limited voice support outside daytime hours",
        "Membership and payment failures require human handling even when fully deterministic",
      ],
    },
    risks: [
      "Anything adjacent to operational safety or service-suspension instruction must remain human and system-controlled; the automation boundary has to be explicit and auditable.",
      "APPI and payment-data handling apply to EX membership records, so card and identity data must never enter the conversational layer in the clear.",
      "A conservative approval culture means a pilot needs an unusually rigorous evaluation and rollback story before any customer-facing exposure.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 5.5,
      automationRate: 0.45,
      basis: "Seller assumptions for modelling only; JR Central does not publish contact-centre volumes, so baseline contacts, cost per contact and containment must be established with the customer-service organisation in discovery.",
    },
    pilotScope:
      "A ten-week pilot on EX membership and payment-issue calls in Japanese and English — a high-volume, low-risk intent set well away from operational communications — with measured containment and full transcript logging.",
    expansion: [
      "Add reserved-seat change and refund servicing against live inventory",
      "Introduce per-booking disruption enquiry handling for weather and incident events",
      "Extend to multilingual station-enquiry support for inbound Smart EX users",
    ],
    stakeholders: [
      "General Manager, Transport Operations / Passenger Sales",
      "Head of Customer Service Centre",
      "General Manager, Information Systems Department",
      "Head of EX Service Planning",
      "Corporate procurement lead",
    ],
    discovery: [
      "What share of customer-centre calls are EX membership and payment issues versus reservation changes?",
      "How does the centre currently absorb disruption-day volume, and what is the overflow arrangement?",
      "Where is the approved boundary between customer-service communication and operational safety communication?",
      "Which vendors operate the reservation and membership platforms, and what integration path exists for a conversational layer?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A typhoon suspends the Tokaido Shinkansen; a passenger with an EX reservation asks about their own seat and gets grounded rebooking and refund options instead of a queue.",
  },

  "jr-kyushu": {
    operatingContext:
      "JR Kyushu operates the Kyushu Shinkansen and the island's conventional rail network, but a large share of its earnings comes from non-rail businesses — hotels, real estate, retail, restaurants and the Nanatsuboshi luxury cruise train and other D&S tourism trains. That mix means customer enquiries span ticketing, tourism-train reservations, hotel bookings and property enquiries, each historically served by its own desk. Customers reach it through SUGOCA IC cards, station counters, the JR Kyushu ticket site and app, and telephone reservation lines, with strong Korean, Chinese and Taiwanese inbound flows via Fukuoka and Hakata. Kyushu's population decline shrinks both the domestic ridership and the pool of people available for counter and phone work.",
    strategicPressure: [
      { text: "JR Kyushu derives a substantial and strategically emphasised portion of profit from non-rail businesses including real estate, hotels and retail, so customer contact is diversified rather than ticket-only.", kind: "verified" },
      { text: "The company's design-and-service brand — built on distinctive tourism trains and station design — sets an unusually high bar for the tone of any automated voice touching guests.", kind: "verified" },
      { text: "Kyushu's demographic decline compresses the recruitable pool for counter, reception and telephone roles faster than in metropolitan Japan, forcing servicing consolidation.", kind: "inference" },
      { text: "Korean and Taiwanese inbound demand arrives disproportionately at Hakata and via ferry and low-cost-carrier routes, concentrating multilingual enquiry load on a few contact points.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A diversified regional conglomerate with rail-engineering depth and no software product organisation; customer-facing systems across rail, hotel and retail are vendor-supplied and largely unintegrated. Margins in the non-rail businesses do not support a platform build, and no internal AI capability has been publicly signalled.",
    whyNotBuild:
      "The hard part here is not a chatbot — it is keigo-quality Japanese voice that a hospitality brand will put in front of guests, plus Korean and Chinese coverage, plus integration into separate rail and hotel reservation systems, plus evaluation that proves tone quality. That is a packaged capability, not something a rail group's IT division assembles.",
    workflows: [
      {
        name: "Tourism-train and D&S train reservation enquiries",
        friction: "Enquiries about seat availability, itinerary, meal plans and boarding procedure for the specialty trains arrive by phone in several languages and are answered by a small specialist desk with limited hours.",
        outcome: "Availability, itinerary and boarding questions answered conversationally at any hour in four languages, with booking handoff to the reservation system and human handling for premium cruise-train enquiries.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Seat-reservation system", "Tourism-train booking records", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Group hotel reservation and change handling",
        friction: "Reservation changes and pre-stay questions ring individual properties whose front desks are already short-staffed, pulling reception away from arriving guests.",
        outcome: "Changes, cancellations and pre-stay questions handled centrally in conversation with the PMS updated, so front-desk staff stay with in-person guests.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Hotel PMS", "Central reservation system", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Multilingual station and route enquiry support",
        friction: "Inbound visitors ask about passes, transfers, luggage and accessibility at counters where staff numbers have been cut and language coverage is inconsistent.",
        outcome: "Route, fare, pass and luggage questions resolved by voice or LINE in Japanese, English, Korean and Chinese, reducing counter queues at Hakata and Kagoshima-Chuo.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Timetable / routing", "Fare and pass rules", "Station operations system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "SUGOCA IC card and commuter-pass servicing",
        "JR Kyushu online ticket booking site and app for Shinkansen and limited-express seats",
        "Central telephone reservation lines for rail and for the tourism trains",
        "Property-level front desks and reservation handling across the group hotel portfolio",
      ],
      gaps: [
        "Rail, hotel and tourism-train enquiries have no shared front door — the customer has to know which number to call",
        "Korean and Chinese support is unavailable outside limited hours",
        "Hotel reservation changes still ring individual properties rather than a central capability",
        "No proactive contact when a tourism-train service is disrupted or a booking needs attention",
      ],
    },
    risks: [
      "Brand tone is a core asset for a company that markets service design; automated voice must pass an internal keigo and hospitality-quality bar before guest exposure.",
      "APPI applies across rail, hotel and retail records, and cross-entity data sharing inside the group needs a documented lawful basis.",
      "Non-rail entities buy technology independently, so a cross-group deployment requires a holding-level sponsor or it fragments into small pilots.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 5.0,
      automationRate: 0.45,
      basis: "Order-of-magnitude seller assumptions for a diversified regional group; actual contact volumes and cost per contact must be gathered separately for rail, hotel and tourism-train desks in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling group-hotel reservation changes and pre-stay enquiries in Japanese, English and Korean across the Fukuoka-area properties, with PMS write-back and front-desk escalation.",
    expansion: [
      "Extend to tourism-train availability and boarding enquiries with premium-cruise escalation to the specialist desk",
      "Add multilingual station and pass enquiry support at Hakata and Kagoshima-Chuo",
      "Introduce proactive outbound notification for tourism-train disruption and booking issues",
    ],
    stakeholders: [
      "General Manager, Railway Operations Headquarters",
      "President / General Manager, JR Kyushu Hotels",
      "Head of Sales and Marketing Headquarters",
      "General Manager, Information Systems",
      "Head of Inbound / Tourism Business Development",
    ],
    discovery: [
      "Do rail, hotel and tourism-train contacts share any telephony or CRM infrastructure today?",
      "What are the monthly call volumes at the central reservation line versus individual hotel front desks?",
      "What language mix arrives on the inbound-tourist enquiry lines, and how is it handled after hours?",
      "Who at holding-company level can sponsor a cross-entity customer-communications programme?",
    ],
    flowTemplate: "appointments",
    scenario: "A Korean traveller phones at 21:00 to move a JR Kyushu group-hotel booking by one night; the agent checks availability, updates the PMS and confirms in Korean without waking the front desk.",
  },

  "tokyo-metro": {
    operatingContext:
      "Tokyo Metro operates nine subway lines through the densest part of Tokyo, carrying millions of passengers a day and interchanging heavily with JR East, Toei and the private railways whose trains run through onto its tracks. It listed on the Tokyo Stock Exchange in 2024, which put its operating efficiency under public-market scrutiny for the first time. Customers reach it through PASMO IC cards and commuter passes, station staff and station offices, its route and service apps, and a customer-relations centre that handles route, fare, facility and lost-property enquiries. Inbound visitors are a structural share of ridership, so route, fare and lost-item questions arrive in English, Chinese and Korean at volumes no station office can staff.",
    strategicPressure: [
      { text: "Tokyo Metro completed a Tokyo Stock Exchange listing in 2024, exposing its cost structure and operating efficiency to public-market scrutiny.", kind: "verified" },
      { text: "Station staffing in Tokyo is under sustained recruitment pressure, and operators have been consolidating station offices and remote-supervising stations as a result.", kind: "verified" },
      { text: "A subway network of this scale generates one of the largest lost-property workloads in the country, almost all of it handled by phone and counter visits today.", kind: "inference" },
      { text: "Through-running with multiple other operators means many enquiries span companies, so the passenger calls whoever they think is responsible and is frequently redirected.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Tokyo Metro's technical depth is in signalling, platform-door and station systems; passenger-facing digital services are delivered with vendors and group IT partners. There is no public evidence of an internal conversational-AI or speech capability, and the newly listed company's investment narrative is about safety, barrier-free works and asset efficiency — a buy-led profile for customer communications.",
    whyNotBuild:
      "The stack needed — Japanese ASR robust to station names and platform noise, keigo TTS, four-language coverage, telephony into an existing customer-relations centre, orchestration into lost-property and fare systems, and per-conversation evaluation — has no overlap with railway engineering and no internal owner. Buying it converts an unstaffable workload into a measured service.",
    workflows: [
      {
        name: "Multilingual lost-property intake and status",
        friction: "A passenger who loses an item calls or visits the lost-property centre, describes it verbally, and then calls back repeatedly to check whether it has been found, with limited language support.",
        outcome: "Structured intake in four languages at any hour, automatic matching against the register, and proactive notification when an item is logged, replacing repeat status calls.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Lost-property register", "Station operations system", "Customer-relations CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Route, fare and IC-card enquiry handling",
        friction: "Fare adjustment, commuter-pass rules, through-service fares and PASMO problems are explained one caller at a time by the customer-relations centre and by station staff who should be on the platform.",
        outcome: "Fare, route and IC-card questions answered conversationally with grounded answers from fare and timetable systems, in Japanese, English, Chinese and Korean.",
        channels: ["Voice", "LINE", "Web", "App"],
        systems: ["Fare and routing engine", "PASMO / IC-card servicing", "Timetable data"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Accessibility and barrier-free assistance requests",
        friction: "Wheelchair and assistance requests are phoned to individual stations and coordinated manually, including with connecting operators, which limits acceptance windows.",
        outcome: "Assistance requests captured with route and timing, dispatched to the stations concerned, and confirmed back to the passenger, including for through-running journeys.",
        channels: ["Voice", "LINE"],
        systems: ["Station operations system", "Assistance dispatch records", "Timetable / routing"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "PASMO IC card and commuter-pass servicing across the network",
        "Official route and service-status apps with delay information",
        "A central customer-relations centre plus a lost-property centre",
        "Staffed station offices with progressively remote-supervised smaller stations",
      ],
      gaps: [
        "Lost-property status cannot be checked without calling again, and not at all in most languages after hours",
        "Fare and through-service questions spanning multiple operators bounce between companies",
        "No conversational channel for accessibility booking on multi-operator journeys",
        "Service-disruption information is broadcast, with no way for a passenger to ask about their own route",
      ],
    },
    risks: [
      "Operational and emergency communications must stay entirely within human and system control; the automation boundary needs to be documented for a newly listed company's disclosure posture.",
      "Lost-property records routinely contain wallets, identity documents and phones, making APPI handling, retention and access controls a gating design item.",
      "Through-running with other operators means some answers depend on third-party data the agent may not be authorised to state — scope has to be explicit.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions for pilot modelling; Tokyo Metro's customer-relations and lost-property volumes, staffing cost and language mix must be confirmed in discovery before any business case is presented.",
    },
    pilotScope:
      "A ten-week pilot on multilingual lost-property intake and status for the whole network in Japanese, English, Chinese and Korean, with structured capture into the lost-property register and proactive match notifications.",
    expansion: [
      "Add route, fare and IC-card enquiry handling on the same front door",
      "Introduce accessibility-assistance booking including through-running journeys",
      "Extend to per-passenger disruption enquiries during suspensions and delays",
    ],
    stakeholders: [
      "Director, Railway Operations Department",
      "Head of Customer Relations Centre",
      "General Manager, IT / Digital Strategy",
      "Head of Station Business Department",
      "IR / corporate planning lead responsible for efficiency commitments",
    ],
    discovery: [
      "What is the monthly lost-property enquiry volume and how many of those are repeat status calls?",
      "How is the customer-relations centre staffed and sourced, and what are its opening hours by language?",
      "What efficiency commitments were made to the market at listing that touch station and centre operations?",
      "Which enquiries involving through-running operators can Tokyo Metro answer directly today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A tourist reports a lost umbrella and passport wallet on the Ginza Line at 23:15 in Mandarin; the agent captures the item, matches the register overnight and pushes a pickup notification when it is logged.",
  },

  "tobu-railway": {
    operatingContext:
      "Tobu Railway runs the largest private-rail network in the Kanto region by route length, stretching from Asakusa and Ikebukuro out to Nikko, Kinugawa and northern Saitama and Gunma, and it owns Tokyo Skytree and Tokyo Solamachi. Its earnings lean heavily on tourism assets: Skytree admission, the Spacia and Spacia X limited-express services to Nikko, group hotels along the Nikko and Kinugawa corridor, and leisure facilities. That concentrates enquiry load on limited-express seat reservations, Skytree timed-entry tickets, hotel bookings and multilingual tourist questions, handled today through the Tobu ticket site, Skytree ticketing, station counters and separate telephone desks per business. The customer base splits between Kanto commuters using IC cards and inbound and domestic tourists heading to Nikko, whose questions are seasonal and language-diverse.",
    strategicPressure: [
      { text: "Tokyo Skytree and the Nikko and Kinugawa tourism corridor are central to Tobu's non-rail earnings, so leisure enquiry handling is directly revenue-linked rather than a back-office cost.", kind: "verified" },
      { text: "The Spacia X limited express was introduced to premiumise the Nikko route, raising the service expectation attached to reservation support for those trains.", kind: "verified" },
      { text: "Regional hotel and leisure staffing along the Nikko and Kinugawa corridor is chronically short, pushing guest questions onto phone lines that are answered by the same thin teams.", kind: "inference" },
      { text: "Seasonal peaks — autumn foliage at Nikko, Golden Week, New Year at Skytree — create enquiry spikes several times the baseline that cannot be staffed for economically.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A conglomerate of rail, tourism, hotel, retail and property businesses with technology procured per entity through vendors, and no group software organisation. Each business runs a small desk, so no single unit has either the volume or the engineering bench to justify a build; the group buys capability that can be pointed at several desks at once.",
    whyNotBuild:
      "Tobu would have to build Japanese and Chinese speech, keigo-grade voice acceptable to a premium tourism brand, telephony into several separate desks, and integration to rail reservation, Skytree ticketing and hotel PMS systems — for a combined volume that no single entity would fund. A packaged multi-tenant deployment is the only economic shape.",
    workflows: [
      {
        name: "Limited-express reservation and change handling for Nikko services",
        friction: "Seat reservations and changes for Spacia and Spacia X are handled by counters and a phone desk, with seasonal spikes producing long waits precisely when the trains are most valuable.",
        outcome: "Availability, booking changes and refund rules handled conversationally against live seat inventory, with premium-service exceptions escalated.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Seat-reservation system", "Fare and refund rules", "Member / ticket account"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Skytree ticketing and visit-planning enquiries",
        friction: "Timed-entry ticket questions, combination-ticket rules, accessibility and weather-visibility questions arrive by phone and web in multiple languages against a small information desk.",
        outcome: "Ticket rules, entry timing, access and facility questions answered instantly in Japanese, English and Chinese, with ticket changes actioned where policy allows.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Attraction ticketing platform", "Facility information base", "Payment processing"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Group hotel booking and pre-stay enquiry handling",
        friction: "Nikko and Kinugawa properties field reservation changes and pre-arrival questions at the front desk, which is the same team checking in guests and running the onsen operation.",
        outcome: "Reservation changes, transport and pre-stay questions handled centrally with PMS write-back, keeping property staff on in-person hospitality.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Hotel PMS", "Central reservation system", "Payment processing"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online limited-express seat reservation for Spacia and Spacia X services",
        "Tokyo Skytree timed-entry ticketing with web and counter purchase",
        "IC-card and commuter-pass servicing across the rail network",
        "Property-level hotel reservation handling along the Nikko and Kinugawa corridor",
      ],
      gaps: [
        "No single front door across rail, Skytree and hotel enquiries for a customer planning one trip",
        "Chinese and English support is limited to business hours and specific channels",
        "Seasonal spikes are absorbed by queueing rather than by capacity",
        "No proactive outreach when weather affects Nikko services or Skytree visibility for booked visitors",
      ],
    },
    risks: [
      "Tourism enquiry data spans several group entities, so APPI-compliant data sharing between rail, attraction and hotel businesses needs an explicit basis.",
      "Any automated voice touching a premium limited-express or Skytree brand must clear an internal tone and keigo review before launch.",
      "Entity-by-entity budgets mean a pilot can stall for want of a holding-level sponsor rather than for technical reasons.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 4.5,
      automationRate: 0.5,
      basis: "Seller assumptions across the rail, attraction and hotel desks combined; each desk's real volume, hours and cost must be measured separately in discovery.",
    },
    pilotScope:
      "An eight-week pilot covering Spacia and Spacia X reservation changes and Skytree ticketing enquiries in Japanese, English and Chinese, with live seat and ticket-inventory grounding.",
    expansion: [
      "Extend to Nikko and Kinugawa group-hotel reservation changes with PMS write-back",
      "Add proactive weather and service-disruption outreach to booked leisure travellers",
      "Introduce a single group front door spanning rail, attraction and lodging enquiries",
    ],
    stakeholders: [
      "General Manager, Railway Business Headquarters",
      "Head of Tokyo Skytree operating company",
      "General Manager, Hotel Business Division",
      "Head of Information Systems",
      "Group corporate planning lead",
    ],
    discovery: [
      "What are the separate monthly enquiry volumes at the rail, Skytree and hotel desks?",
      "How large is the seasonal peak-to-trough ratio on Nikko-related enquiries?",
      "Which languages arrive on the Skytree information line and how are they covered today?",
      "Can the holding company sponsor a shared deployment, or must each entity fund its own?",
    ],
    flowTemplate: "appointments",
    scenario: "A family reschedules Spacia X seats to Nikko and asks about Skytree combination tickets in one conversation, in English, on a Sunday evening.",
  },

  "odakyu-electric-railway": {
    operatingContext:
      "Odakyu Electric Railway runs the Odawara, Enoshima and Tama lines from Shinjuku through western Tokyo and Kanagawa, and its brand asset is the Romancecar limited express feeding the Hakone tourism corridor. The group controls a large part of the Hakone experience — mountain railway, cablecar, ropeway, sightseeing boats, buses and hotels — sold heavily through the Hakone Freepass, alongside commuter rail, retail and residential businesses along the line. Customers reach it through the Romancecar reservation service, the group's mobility app, station counters, and telephone desks split between rail reservations and Hakone leisure operations. Demand is intensely seasonal and increasingly inbound, while Hakone's tourism operators face some of the worst accommodation and transport staffing shortages in Kanto.",
    strategicPressure: [
      { text: "Odakyu's Hakone corridor operations — Romancecar, mountain railway, ropeway, boats and hotels — are marketed as an integrated tourism product, so enquiry handling spans several transport modes and lodging in one customer journey.", kind: "verified" },
      { text: "Hakone tourism staffing, particularly in hotels and ryokan, is chronically short and has constrained capacity even when demand recovered.", kind: "inference" },
      { text: "Inbound visitors buying Hakone passes generate multilingual questions about transfers, luggage, timings and weather closures that station and facility staff cannot cover in extended hours.", kind: "inference" },
      { text: "Weather closures of the ropeway and boat services trigger sharp enquiry spikes from travellers already en route with prepaid passes.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Odakyu is a rail and property group whose technology is vendor-delivered; its digital efforts have centred on mobility and pass products rather than on building conversational platforms. Contact desks are split by business unit and modest in individual scale, which rules out an internal build and argues for a shared bought layer.",
    whyNotBuild:
      "The requirement is multilingual speech with keigo quality on a service brand descended from a department-store hospitality culture, integrated across rail reservations, pass validity rules, facility operating status and hotel PMS. No part of that is adjacent to Odakyu's existing capabilities, and its combined desk volume would never justify building it.",
    workflows: [
      {
        name: "Romancecar reservation and seat-change servicing",
        friction: "Reserved-seat bookings and changes concentrate at Shinjuku counters and a phone desk, with weekend and foliage-season peaks producing waits for a premium product.",
        outcome: "Seat availability, changes and refunds handled conversationally against live inventory in Japanese and English, keeping counters for complex and group cases.",
        channels: ["Voice", "App", "Web"],
        systems: ["Romancecar reservation system", "Fare and refund rules", "Member account"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Hakone pass, transfer and facility-status enquiries",
        friction: "Travellers ask what their Hakone pass covers, how to connect between ropeway, boat and bus, and whether services are running in bad weather; answers live with different operating units and are given by phone one at a time.",
        outcome: "Pass coverage, connection guidance and live facility-operating status answered instantly in three languages, with proactive notice to pass holders when a mode suspends.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Pass product rules", "Facility operating-status feed", "Timetable / routing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Group hotel and leisure-facility reservation handling",
        friction: "Hakone-area hotels and facilities take changes and pre-stay questions at the property, where the same staff are running check-in, transport and dining service.",
        outcome: "Reservation changes and pre-stay questions handled centrally with PMS write-back so property staff stay with guests in front of them.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Hotel PMS", "Facility booking system", "Payment processing"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online Romancecar reserved-seat booking and ticketless boarding",
        "Hakone Freepass and related pass products sold digitally and at counters",
        "A group mobility and ticketing app covering rail and Hakone transport",
        "Station counters and separate telephone desks for rail reservations and Hakone leisure",
      ],
      gaps: [
        "A traveller cannot get pass coverage, transfer timing and facility status answered in one place",
        "No proactive notification to pass holders when the ropeway or boats suspend for weather",
        "Chinese and English voice support is limited outside daytime hours",
        "Hotel changes still ring individual properties instead of a central capability",
      ],
    },
    risks: [
      "Facility operating status during weather events is safety-adjacent; the agent must state only what the operating-status system publishes and escalate anything beyond it.",
      "Pass and reservation records across rail, facilities and hotels sit in different entities, requiring an APPI-compliant sharing basis before a unified front door.",
      "Odakyu's service culture makes tone quality a launch gate, not a post-launch optimisation.",
    ],
    economics: {
      volumeMonthly: 50000,
      costPerInteraction: 4.5,
      automationRate: 0.5,
      basis: "Seller assumptions spanning rail, Hakone facility and hotel desks; peak-season and off-season volumes must be measured separately in discovery because the seasonal ratio drives the whole case.",
    },
    pilotScope:
      "An eight-week pilot on Hakone pass, transfer and facility-status enquiries plus Romancecar seat changes in Japanese, English and Chinese, grounded in live seat inventory and facility operating status.",
    expansion: [
      "Add proactive weather-suspension outreach to pass holders and reserved passengers",
      "Extend to group hotel and leisure-facility reservation changes with PMS write-back",
      "Introduce commuter-side servicing for passes and IC-card issues on the same front door",
    ],
    stakeholders: [
      "General Manager, Railway Business Division",
      "Head of Hakone / Leisure Business Division",
      "General Manager, Digital Business or IT Department",
      "Head of Hotel Business",
      "Group corporate planning lead",
    ],
    discovery: [
      "What is the peak-to-trough ratio of Hakone-related enquiries across the year?",
      "Which system holds authoritative operating status for the ropeway, boats and mountain railway?",
      "How are the rail-reservation and Hakone leisure desks staffed and sourced today?",
      "What share of Hakone pass buyers are non-Japanese, and what languages dominate?",
    ],
    flowTemplate: "appointments",
    scenario: "High winds suspend the Hakone ropeway; pass holders arriving on the Romancecar are messaged with alternative bus routing and can ask follow-up questions in English by voice.",
  },

  "keio-corporation": {
    operatingContext:
      "Keio Corporation operates the Keio and Inokashira lines connecting Shinjuku and Shibuya to western Tokyo suburbs, and its group extends into the Keio Plaza Hotel in Nishi-Shinjuku and other lodgings, the Keio department store, retail and restaurant businesses, bus operations, and the Mt. Takao leisure corridor. Revenue is a mix of commuter rail, retail and hospitality, with the hotel business carrying a disproportionate share of inbound guests. Customers reach the group through IC cards and commuter passes, a group point-card programme, station offices, hotel reservation desks, and separate telephone lines for rail, hotel and retail businesses. Each of those desks is small, staffed in business hours, and increasingly hard to recruit for in a tight Tokyo service labour market.",
    strategicPressure: [
      { text: "Keio Plaza Hotel is a large, internationally oriented property whose reservation and guest-services load is significant relative to the group's other service desks.", kind: "verified" },
      { text: "Mt. Takao is one of the most visited hiking destinations near Tokyo and drives concentrated seasonal enquiry load about access, passes and facilities.", kind: "verified" },
      { text: "Group companies each run their own thin service desk, so total contact cost is higher than any single entity's budget makes visible.", kind: "inference" },
      { text: "Tokyo service-sector recruitment difficulty is pushing station office consolidation and hotel front-desk multi-tasking, which increases reliance on phone channels.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "A mid-scale private-rail conglomerate with vendor-procured IT and no software product organisation. No individual business unit has enough contact volume to justify building conversational infrastructure, and there is no public signal of internal AI capability — the profile is buy-led with a group-level sponsor needed to aggregate demand.",
    whyNotBuild:
      "Keio would need Japanese and English speech, keigo-grade voice good enough for an international hotel brand, telephony into three or four separate desks and integration to hotel PMS, rail reservation and point-programme systems. Aggregating that across small desks is exactly what a packaged deployment does and exactly what no group entity would fund alone.",
    workflows: [
      {
        name: "Hotel reservation and guest-enquiry handling",
        friction: "Reservation changes, room-type questions, airport-transfer and facility enquiries arrive by phone from domestic and overseas guests, handled by a reservation desk with fixed hours and limited language depth.",
        outcome: "Changes, cancellations and pre-stay questions handled conversationally in Japanese and English at any hour with PMS write-back and human escalation for VIP and group bookings.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Hotel PMS", "Central reservation system", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rail, pass and point-programme servicing",
        friction: "Commuter-pass rules, IC-card trouble and group point-card questions are handled at station offices and a small phone desk, pulling staff away from platform duties.",
        outcome: "Pass, fare and point-programme questions answered conversationally with grounded answers, and simple account actions completed without a station visit.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Fare and pass rules", "IC-card servicing", "Group point-programme platform"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Mt. Takao and leisure-facility access enquiries",
        friction: "Seasonal callers ask about cablecar and chairlift operation, access passes, parking and facility hours; answers sit with different operating units and peak sharply in autumn.",
        outcome: "Access, operating status, pass and facility questions answered instantly in Japanese and English, absorbing autumn peaks without seasonal hiring.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Facility operating-status feed", "Pass product rules", "Timetable / routing"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "IC-card and commuter-pass servicing across the Keio and Inokashira lines",
        "A group point-card programme spanning rail, retail and hotel spend",
        "Hotel reservation desk and web booking for the Keio Plaza and other group properties",
        "Station offices and separate business-hours telephone lines per group business",
      ],
      gaps: [
        "No shared front door across rail, hotel, retail and leisure enquiries",
        "English support depends on which desk the customer happens to reach",
        "Hotel changes and pre-stay questions cannot be completed outside desk hours",
        "Seasonal Takao and leisure spikes are handled by queueing rather than capacity",
      ],
    },
    risks: [
      "Group entities hold customer data separately, so a shared conversational front door needs an APPI-compliant data-sharing design before it can recognise a customer across businesses.",
      "An internationally branded hotel imposes a high tone and accuracy bar on any automated guest-facing voice.",
      "Without a holding-level sponsor, the deployment fragments into desk-by-desk pilots that never reach economic scale.",
    ],
    economics: {
      volumeMonthly: 35000,
      costPerInteraction: 4.5,
      automationRate: 0.5,
      basis: "Seller assumptions aggregating several small group desks; each desk's staffing model, hours and volume must be measured in discovery, since the case depends on aggregation rather than any single line.",
    },
    pilotScope:
      "An eight-week pilot on hotel reservation changes and pre-stay enquiries in Japanese and English for the group's Shinjuku properties, with PMS write-back and escalation to the reservation desk.",
    expansion: [
      "Extend to rail pass, IC-card and group point-programme servicing",
      "Add Mt. Takao and leisure-facility access and operating-status enquiries",
      "Consolidate group desks behind one recognised front door with cross-entity context",
    ],
    stakeholders: [
      "General Manager, Railway Business Division",
      "General Manager, Hotel Business (Keio Plaza Hotel)",
      "Head of Group Corporate Planning",
      "General Manager, Information Systems",
      "Head of Retail / Point-programme operations",
    ],
    discovery: [
      "Which group desk carries the highest call volume today, and what does each cost to run?",
      "Would the holding company fund a shared deployment, or does each entity buy independently?",
      "What share of hotel enquiries arrive in English, and how are they handled overnight?",
      "How much station-office time is consumed by pass and IC-card questions that could be answered remotely?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An overseas guest calls the Keio Plaza reservation line at 02:00 JST to change room type and arrange an airport transfer; the agent completes both and writes back to the PMS.",
  },

  "kintetsu-group": {
    operatingContext:
      "Kintetsu Group Holdings operates the largest private railway network in Japan by route length, linking Osaka, Kyoto, Nara, Nagoya and Ise-Shima — a spine that carries both dense commuter traffic and the country's most concentrated cultural-tourism corridor. The group extends into the Miyako Hotels chain, department stores at Abeno Harukas, real estate, and travel and logistics arms. Its named limited-express services — Hinotori, Shimakaze, Aoniyoshi and Urban Liner — are reserved products sold through the Kintetsu ticket site, counters and phone desks, while inbound visitors buy Kintetsu Rail Pass products for the Nara and Ise routes. Enquiries therefore split between commuter servicing, premium reserved-seat handling, multilingual tourist routing, and hotel bookings, each landing on separate lean desks.",
    strategicPressure: [
      { text: "Kintetsu operates Japan's longest private-railway network and a portfolio of named limited-express services sold as reserved, premium products.", kind: "verified" },
      { text: "The Nara, Kyoto and Ise-Shima corridors are core inbound-tourism routes, so reserved-seat and pass enquiries arrive in several languages with strong seasonality.", kind: "verified" },
      { text: "Group hotel and department-store businesses face the same service-labour shortage as the rail side, so consolidating enquiry handling across entities is the only way to protect service levels.", kind: "inference" },
      { text: "Premium limited-express products carry service expectations that make long phone queues a brand problem, not just a cost problem.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "The group's scale is in rail infrastructure, hospitality and retail property; technology is procured through vendors and group IT companies, with no evidence of an internal conversational-AI product organisation. Contact operations are split across entities and partly outsourced, which is the standard buy-led configuration.",
    whyNotBuild:
      "Delivering this internally would mean four-language speech, keigo-grade voice for premium rail and hotel brands, telephony across several entity desks, integration to reserved-seat inventory, pass rules and hotel PMS, and ongoing evaluation. No group company owns that capability or would fund it for its own desk alone.",
    workflows: [
      {
        name: "Limited-express reserved-seat booking and change handling",
        friction: "Seat enquiries and changes for Hinotori, Shimakaze and Aoniyoshi services concentrate at major-station counters and a phone desk, with seasonal peaks producing waits on premium products.",
        outcome: "Availability, booking changes and refund rules handled conversationally against live inventory, with group and special-service bookings escalated to staff.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Reserved-seat inventory", "Fare and refund rules", "Member / ticket account"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Multilingual tourist routing and rail-pass support",
        friction: "Visitors using Kintetsu rail passes ask about coverage, transfers to Nara and Ise, luggage and station facilities, answered by counter staff whose language coverage varies by station and hour.",
        outcome: "Pass coverage, routing and facility questions answered in Japanese, English, Chinese and Korean at any hour, reducing counter congestion at Osaka-Namba, Kyoto and Kintetsu-Nara.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Pass product rules", "Timetable / routing", "Station operations system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Group hotel reservation and pre-stay servicing",
        friction: "Miyako Hotels properties handle reservation changes and pre-arrival questions at the property level, competing with check-in and in-person guest service.",
        outcome: "Reservation changes and pre-stay enquiries handled centrally with PMS write-back, freeing front-desk staff for arriving guests.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Hotel PMS", "Central reservation system", "Payment processing"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online reserved-seat booking for named limited-express services",
        "Kintetsu rail-pass products sold to inbound visitors with multilingual materials",
        "IC-card and commuter-pass servicing across the network",
        "Property-level and central reservation handling for the group hotel chain",
      ],
      gaps: [
        "Rail, pass and hotel enquiries have no shared front door for a single trip",
        "Korean and Chinese voice support is not available across the network or after hours",
        "Reserved-seat changes require a counter visit when the app or site fails",
        "No proactive contact to reserved passengers when a limited-express service is disrupted",
      ],
    },
    risks: [
      "Cross-entity customer recognition between rail, hotel and retail requires an APPI-compliant sharing basis that does not exist by default in a holding structure.",
      "Premium limited-express and hotel brands impose a keigo and tone gate on automated voice before any guest exposure.",
      "Existing outsourced contact arrangements carry volume commitments that shape how fast automated containment can be realised.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 5.0,
      automationRate: 0.5,
      basis: "Seller assumptions aggregating rail, pass and hotel desks; entity-level volumes, outsourcing costs and language mix must be validated in discovery before any business case is shown to the customer.",
    },
    pilotScope:
      "A ten-week pilot on limited-express reserved-seat changes plus multilingual pass and routing enquiries for the Osaka-Nara-Kyoto corridor in four languages, grounded in live seat inventory and pass rules.",
    expansion: [
      "Extend to Miyako Hotels reservation changes and pre-stay enquiries with PMS write-back",
      "Add proactive disruption outreach to reserved limited-express passengers",
      "Consolidate group entity desks behind one multilingual front door",
    ],
    stakeholders: [
      "General Manager, Railway Business (Kintetsu Railway)",
      "Head of Hotel and Leisure Business",
      "General Manager, Group IT / Digital Strategy",
      "Head of Inbound Tourism Business Development",
      "Group corporate planning lead at the holding company",
    ],
    discovery: [
      "What are the monthly enquiry volumes at the reserved-seat desk versus station counters?",
      "Which stations carry the heaviest non-Japanese enquiry load and in what languages?",
      "Are contact operations outsourced, and under what commercial terms?",
      "Would the holding company sponsor a shared deployment across rail, hotel and travel arms?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A visitor holding a Kintetsu rail pass asks in Mandarin how to reach Ise-Shima and moves a Shimakaze reserved seat forward by two hours, in one call at 21:00.",
  },

  "tokyu-corporation": {
    operatingContext:
      "Tokyu Corporation runs the Toyoko, Den-en-toshi, Meguro and Oimachi lines connecting Shibuya to the affluent southwestern Tokyo and Kanagawa suburbs it largely developed, and it is the principal driver of the Shibuya redevelopment. Its customer relationships extend well beyond rail into commercial facilities, retail, hotels, residential services and a group point programme that ties spend across those businesses together. Contact today runs through IC cards and commuter passes, station offices, facility information desks, hotel reservation lines, and residential and property-management desks — a wide estate of small, business-hours teams. Tokyu is more visibly digital than most private-rail peers, with urban-development and MaaS-style initiatives around Shibuya, which changes the shape of the sale rather than the need.",
    strategicPressure: [
      { text: "Tokyu is the anchor developer of the Shibuya redevelopment and positions itself as an urban-development company as much as a railway, which raises expectations for the digital experience across its facilities.", kind: "verified" },
      { text: "The group operates a point programme spanning rail, retail and facility spend, giving it a cross-business customer identity that most rail peers lack.", kind: "verified" },
      { text: "Commercial-facility and residential service desks are staffed in business hours by small teams that cannot cover the after-hours enquiry demand a 24-hour city generates.", kind: "inference" },
      { text: "Group DX programmes tend to produce point solutions per asset, leaving keigo-quality voice workflows as the gap that a partner rather than an internal team fills.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led rather than buy-led: Tokyu has genuine digital ambition and internal DX resourcing around urban development, so it can integrate and govern, but there is no evidence of an internal speech or conversational-AI platform. The right sale is packaged workflows and a governed voice layer that its DX teams adopt and extend, not a black box.",
    whyNotBuild:
      "Tokyu's DX teams can build web and data products; they cannot economically build Japanese ASR and keigo TTS, carrier telephony across dozens of facility desks, orchestration into PMS, facility, point-programme and property-management systems, and a per-conversation evaluation harness. Assembling that from parts is a multi-year detour from the Shibuya agenda.",
    workflows: [
      {
        name: "Commercial-facility and mall information handling",
        friction: "Facility desks answer repetitive questions about opening hours, tenant locations, parking, lost items and accessibility, in person and by phone, at every asset separately.",
        outcome: "One conversational front door across facilities answering hours, tenant, parking and lost-item questions in Japanese and English, with lost-item intake structured into the facility register.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Facility information base", "Tenant directory", "Lost-property register"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Residential and property-management service intake",
        friction: "Residents in Tokyu-managed buildings phone for repairs, key issues, common-area faults and move-in or move-out procedures, with after-hours calls routed to an answering arrangement that only takes messages.",
        outcome: "Structured repair and service intake at any hour with dispatch routing and status updates, replacing message-taking with actual triage.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Property-management system", "Work-order / dispatch", "Resident records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rail pass, IC-card and point-programme servicing",
        friction: "Commuter-pass rules, IC-card faults and point-programme questions consume station-office time that should go to platform and passenger duties.",
        outcome: "Pass, fare and point questions answered conversationally with authenticated account actions, reducing station-office queues.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Fare and pass rules", "IC-card servicing", "Point-programme platform"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "IC-card and commuter-pass servicing across the Tokyu rail network",
        "A group point programme linking rail, retail and facility spend",
        "Facility information desks at Shibuya and suburban commercial properties",
        "Property-management and residential service desks with after-hours message handling",
      ],
      gaps: [
        "Facility and residential enquiries cannot be completed outside business hours",
        "Cross-business customer recognition exists in the point programme but not in service channels",
        "Repair intake produces messages rather than triaged, dispatched work orders",
        "English support across facilities is inconsistent asset by asset",
      ],
    },
    risks: [
      "Residential service data is personal and sometimes sensitive (access, occupancy), so APPI handling and access control must be designed before any resident-facing deployment.",
      "An internal DX organisation will scrutinise architecture and lock-in; the sale needs a governed, extensible integration story rather than a closed product.",
      "Facility operations are frequently run by subsidiaries with their own budgets, so scope must be agreed at group level to avoid asset-by-asset fragmentation.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions across facility, residential and rail desks; the real baseline must come from Tokyu's own contact reporting, which is likely fragmented by subsidiary, during discovery.",
    },
    pilotScope:
      "An eight-week pilot providing 24-hour residential repair and service intake for a defined Tokyu-managed property portfolio, with structured work-order creation and dispatch routing.",
    expansion: [
      "Extend to commercial-facility information and lost-item intake across Shibuya and suburban assets",
      "Add rail pass, IC-card and point-programme servicing on the same front door",
      "Introduce cross-business customer recognition using the point-programme identity",
    ],
    stakeholders: [
      "General Manager, Urban Development / Commercial Facilities",
      "Head of Property Management subsidiary operations",
      "General Manager, DX / Digital Platform",
      "Head of Railway Business customer service",
      "Group corporate planning and procurement lead",
    ],
    discovery: [
      "Which subsidiary owns residential and facility contact operations, and what does each cost?",
      "What happens to an after-hours resident repair call today, end to end?",
      "How far does the group DX programme extend into customer-contact channels?",
      "Can the point-programme identity be used to recognise customers in service channels under current consents?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A resident in a Tokyu-managed building reports a water leak at 01:30; the agent triages severity, creates a work order and dispatches the on-call contractor instead of leaving a message.",
  },

  "hankyu-hanshin-holdings": {
    operatingContext:
      "Hankyu Hanshin Holdings runs the Hankyu and Hanshin railway networks across Osaka, Kobe and Kyoto and owns an unusually entertainment-heavy portfolio for a rail group: the Takarazuka Revue and its theatres, the Hanshin Tigers and Koshien-related businesses, a large hotel chain, travel agencies, and real-estate and commercial-facility operations. That produces three very different contact patterns — commuter rail servicing, hotel reservations, and ticketing for performances and games where demand spikes violently around release dates and season events. Customers reach the group through IC cards and commuter passes, the group point programme, hotel reservation lines, theatre and stadium ticketing services, and station offices. Kansai's service-labour market is as tight as Tokyo's, and seasonal entertainment peaks are precisely what a fixed-headcount desk cannot absorb.",
    strategicPressure: [
      { text: "The group combines rail with the Takarazuka Revue, Hanshin Tigers and Koshien businesses, so entertainment ticketing demand spikes are a structural feature of its customer contact.", kind: "verified" },
      { text: "The group operates a large Kansai hotel portfolio and travel businesses whose reservation servicing sits on the same labour-scarce base as the rail side.", kind: "verified" },
      { text: "Ticket on-sale moments for popular performances and games generate enquiry volumes orders of magnitude above baseline for short windows, which no staffed desk can be sized for.", kind: "inference" },
      { text: "Devoted fan bases expect a level of courtesy and responsiveness in ticketing support that generic automation would damage, making keigo quality a gating requirement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Technology across the group's entities is vendor-procured, with ticketing platforms supplied by external providers and no group software organisation. Entertainment and hospitality margins do not fund platform builds, and the entities most affected by spikes are the smallest — a textbook buy-led configuration with a holding-level sponsor.",
    whyNotBuild:
      "The group would have to build speech, keigo-grade voice acceptable to Takarazuka and Tigers fan bases, elastic telephony that absorbs on-sale spikes, and integrations to third-party ticketing, hotel PMS and rail systems. The spike-absorbing elasticity alone is a platform property that cannot be built for an entity-sized budget.",
    workflows: [
      {
        name: "Performance and game ticketing enquiry handling",
        friction: "On-sale windows and event days flood ticketing lines with questions about availability, seat categories, resale rules, entry procedure and refunds when events are rained off, against a fixed desk.",
        outcome: "Elastic conversational capacity absorbing on-sale and event-day spikes with grounded answers on availability, entry rules and refund policy, escalating disputes to staff.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Ticketing platform", "Event and venue information base", "Refund / payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Hotel reservation and pre-stay servicing",
        friction: "Reservation changes and pre-arrival questions ring individual properties and a central desk in business hours, with event-driven demand compounding the load around Koshien and theatre seasons.",
        outcome: "Changes, cancellations and pre-stay questions handled conversationally with PMS write-back at any hour, including package bookings tied to events.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Hotel PMS", "Central reservation system", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rail pass, fare and point-programme servicing",
        friction: "Commuter-pass rules, IC-card trouble and group point questions consume station-office time across two rail networks with different histories and rules.",
        outcome: "Pass, fare and point questions answered conversationally with authenticated actions, reducing station-office load across both networks.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Fare and pass rules", "IC-card servicing", "Group point-programme platform"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "IC-card and commuter-pass servicing across the Hankyu and Hanshin networks",
        "A group point programme spanning rail, retail and hotel spend",
        "Ticketing services for theatre performances and baseball games via platform partners",
        "Central and property-level hotel reservation handling across the Kansai portfolio",
      ],
      gaps: [
        "Ticketing enquiry capacity does not flex with on-sale and event-day spikes",
        "Event-day weather cancellations produce refund questions with no scalable answering channel",
        "Hotel reservation changes are limited to desk hours",
        "No shared front door linking event tickets, hotel stays and rail access for one customer trip",
      ],
    },
    risks: [
      "Ticketing and refund policy is contractual and disputes are common, so the agent must answer only from approved policy and escalate anything discretionary.",
      "Fan-base sentiment is a reputational asset; an automated voice that reads as impersonal on a Takarazuka or Tigers line is a brand risk, making tone evaluation a launch gate.",
      "Ticketing platforms are third-party, so integration depth and data access depend on partner contracts that must be checked before scoping.",
    ],
    economics: {
      volumeMonthly: 70000,
      costPerInteraction: 4.5,
      automationRate: 0.5,
      basis: "Seller assumptions across ticketing, hotel and rail desks; the entertainment spike profile in particular must be measured in discovery because it determines the value of elastic capacity.",
    },
    pilotScope:
      "An eight-week pilot absorbing on-sale and event-day ticketing enquiry spikes for one entertainment property in Japanese and English, with grounded availability and policy answers and staff escalation for disputes.",
    expansion: [
      "Extend to group hotel reservation changes and event-package pre-stay servicing",
      "Add rail pass, fare and point-programme servicing across both networks",
      "Introduce proactive outbound notification for event cancellations and refund handling",
    ],
    stakeholders: [
      "Head of Entertainment Business (theatre / baseball operations)",
      "General Manager, Hotel Business",
      "General Manager, Railway Business customer service",
      "Head of Group IT / Digital Strategy",
      "Holding-company corporate planning lead",
    ],
    discovery: [
      "What does enquiry volume look like in the hour after a major on-sale opens versus baseline?",
      "Which ticketing platform partners hold the data an agent would need to answer availability and refund questions?",
      "How are hotel reservation changes handled today between central desk and individual properties?",
      "Who at holding level can sponsor a deployment that spans entertainment, hotel and rail entities?",
    ],
    flowTemplate: "appointments",
    scenario: "A Takarazuka performance sells out within minutes; hundreds of callers ask about returned seats and entry rules simultaneously and every one gets a grounded answer instead of a busy tone.",
  },

  "keisei-electric-railway": {
    operatingContext:
      "Keisei Electric Railway connects central Tokyo and Chiba to Narita Airport, and its flagship Skyliner on the Narita Sky Access line is one of the two principal rail routes into the country for international arrivals. Alongside airport access it runs commuter services in eastern Tokyo and Chiba, bus operations, and property and retail businesses, and it is a major long-term shareholder in Oriental Land, operator of Tokyo Disney Resort. Its customer contact is unusually skewed: a small commuter-scale company handles enquiry volume shaped by international arrivals, covering tickets and passes, luggage rules, train timing against flight schedules, connections and lost items. Today those questions land on airport-station counters, ticket offices, a modest customer centre and the Skyliner online reservation service, staffed in a labour market where multilingual counter staff are close to unobtainable.",
    strategicPressure: [
      { text: "Keisei operates the Skyliner on the Narita Sky Access line, making it a primary rail gateway for international arrivals into Tokyo.", kind: "verified" },
      { text: "Keisei is a long-standing major shareholder in Oriental Land, and its airport-access role feeds visitors heading to Tokyo Disney Resort and central Tokyo.", kind: "verified" },
      { text: "Multilingual enquiry demand is disproportionate to the company's size, so per-contact language coverage cost is far higher than for a comparable commuter railway.", kind: "inference" },
      { text: "Flight delays and late arrivals push airport-access questions into hours when counters are closing, exactly when a disoriented traveller most needs an answer.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "A mid-size private railway with vendor-delivered IT, no software product organisation, and a customer centre operated at commuter-railway scale. The multilingual requirement is structural but the company's absolute contact volume is modest — the definition of a buy-led case, where elastic bought capacity beats both hiring and building.",
    whyNotBuild:
      "Keisei would need four-language speech and keigo-grade Japanese voice, telephony into a small customer centre, and integration to Skyliner seat inventory, pass rules and lost-property records — an engineering programme wholly out of proportion to a railway of its size. Buying converts an unaffordable staffing problem into a metered service.",
    workflows: [
      {
        name: "Multilingual Skyliner ticketing and seat-reservation support",
        friction: "Arriving travellers ask about Skyliner seat availability, ticket types, pass combinations and how their booking maps to a delayed flight; counters at Narita queue and language coverage varies by shift.",
        outcome: "Ticket options, seat availability and reservation changes handled conversationally in four languages at any hour, with counters kept for exceptions and payment problems.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Skyliner reservation system", "Fare and pass rules", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Airport-access routing, luggage and connection enquiries",
        friction: "Questions about which train to take for a terminal, luggage allowances, last services and onward connections are answered one traveller at a time at counters that close before the last flights land.",
        outcome: "Routing, timing, luggage and connection questions answered instantly around the clock in four languages, with grounded timetable and service-status data.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Timetable / routing", "Service-status feed", "Station operations system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lost-property intake for airport-access services",
        friction: "Items left on Skyliner and commuter services are reported by phone and in person, described in unfamiliar languages, then chased by travellers who have already left the country.",
        outcome: "Structured multilingual intake and match notification, with forwarding and pickup options explained, cutting repeat status contacts from overseas.",
        channels: ["Voice", "LINE", "Email"],
        systems: ["Lost-property register", "Station operations system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online Skyliner ticket and seat reservation with airport counter sales",
        "IC-card and commuter-pass servicing across the Keisei network",
        "Airport-station information counters with limited-hours multilingual staffing",
        "A customer centre handling enquiries and lost-property reports",
      ],
      gaps: [
        "No multilingual voice support in the late-evening and early-morning flight windows",
        "Travellers cannot check lost-item status from overseas without email round-trips",
        "Ticket and pass combination questions require a counter conversation",
        "Service disruption on the airport line is broadcast rather than answered per traveller",
      ],
    },
    risks: [
      "Airport-access service disruption is time-critical for travellers with flights, so escalation rules and accuracy of service-status statements must be tightly controlled.",
      "Lost-property records for international travellers involve cross-border handling of personal data, so APPI and transfer handling need explicit design.",
      "A small IT organisation means integration effort must be minimised; the deployment has to work against existing reservation and register systems without a re-platforming project.",
    ],
    economics: {
      volumeMonthly: 40000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions for a mid-size operator with outsized multilingual load; actual customer-centre and airport-counter volumes and the non-Japanese share must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot providing 24-hour multilingual Skyliner ticketing and airport-access routing support in Japanese, English, Chinese and Korean, grounded in live seat inventory and timetable data.",
    expansion: [
      "Add lost-property intake and overseas status notification",
      "Extend to commuter-side pass, fare and IC-card servicing",
      "Introduce proactive service-disruption messaging to booked Skyliner passengers",
    ],
    stakeholders: [
      "General Manager, Railway Business Division",
      "Head of Customer Service Centre",
      "Head of Narita Airport station operations",
      "General Manager, Information Systems",
      "Head of Inbound / Tourism Sales",
    ],
    discovery: [
      "What share of enquiries at airport stations and the customer centre are non-Japanese, and in which languages?",
      "What are the staffed hours at Narita counters versus the last and first flight arrivals?",
      "How many lost-property reports come from travellers who have already left Japan?",
      "What integration exists today between the Skyliner reservation system and any customer-facing channel other than the website?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A delayed flight lands at 23:50; the passenger asks in Korean whether their Skyliner reservation is still valid and gets rebooked to the last service without finding a counter.",
  },

  "sotetsu-holdings": {
    operatingContext:
      "Sotetsu Holdings runs the Sagami Railway network in Yokohama and western Kanagawa, which gained direct through-services to central Tokyo via JR and Tokyu links, and its most nationally visible business is Sotetsu Hotels — a budget-to-midscale chain spanning Fresa Inn, Grand Fresa and the Sunroute brand it acquired, with properties well beyond its rail territory. The group also runs supermarkets, real-estate and bus operations in Kanagawa. The hotel arm's economics depend on thin front-desk staffing, so reservation changes, late-arrival calls, invoice and receipt requests and pre-stay questions land on reception teams already running check-in. Guests reach the chain through its own booking site and member programme, OTAs, and telephone lines answered property by property.",
    strategicPressure: [
      { text: "Sotetsu Hotels operates a nationwide budget-to-midscale portfolio including the Sunroute brand, extending the group's service footprint far outside its Kanagawa rail territory.", kind: "verified" },
      { text: "Direct through-running between the Sotetsu network and central Tokyo has raised the profile of the rail business and its commuter-servicing load.", kind: "verified" },
      { text: "Budget and midscale hotels in Japan cannot staff overnight reception at pre-pandemic levels, so night calls are answered by a single person also handling arrivals and security.", kind: "inference" },
      { text: "A large share of reservation-change and cancellation traffic still arrives by phone even when the booking originated on an OTA, because guests call the property directly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A mid-scale regional group with no software organisation and hotel technology bought from PMS and booking-engine vendors. Hotel operations run on cost discipline that would never fund a platform build, and rail-side IT is vendor-delivered — clearly buy-led, with the hotel chain the natural first buyer.",
    whyNotBuild:
      "The chain needs Japanese and English speech with keigo quality that a hotel guest will accept, telephony that can front dozens of properties, and PMS integration for changes and cancellations. That is a product, not a project a hotel operator with per-property IT budgets can undertake.",
    workflows: [
      {
        name: "Reservation change and cancellation handling across the chain",
        friction: "Guests phone individual properties to change dates, room types or cancel, interrupting reception during check-in peaks and producing inconsistent handling of cancellation policy.",
        outcome: "Changes and cancellations executed conversationally against the PMS with policy applied consistently, and reception freed for guests physically present.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Hotel PMS", "Central reservation system", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Late-arrival and pre-stay enquiry handling",
        friction: "Late-arrival notifications, parking, luggage-storage, breakfast and access questions arrive by phone at night to a single overnight staff member.",
        outcome: "Pre-stay and late-arrival questions answered and recorded against the booking at any hour, with only genuine exceptions waking the night desk.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Hotel PMS", "Property information base", "Guest messaging"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Corporate booking and invoice-request servicing",
        friction: "Business guests and corporate accounts request receipts, invoices and billing corrections by phone, which reception handles manually per property.",
        outcome: "Receipt, invoice and billing-detail requests handled conversationally with documents issued automatically, removing a recurring reception task.",
        channels: ["Voice", "Email", "Web"],
        systems: ["Hotel PMS", "Billing / accounting", "Corporate account records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Own-brand hotel booking site with a guest member programme",
        "OTA distribution across the budget-to-midscale portfolio",
        "Property-level telephone reception handling reservations and guest requests",
        "IC-card and commuter-pass servicing on the rail network",
      ],
      gaps: [
        "Reservation changes depend on reaching a property that may be mid-check-in",
        "No consistent overnight answering capability across the chain",
        "English-language guest support varies by property and by shift",
        "Invoice and receipt requests still require a human at each property",
      ],
    },
    risks: [
      "Cancellation-policy application has commercial consequences, so the agent must act strictly from the property's configured policy with exceptions escalated.",
      "Guest records and payment details fall under APPI and card-handling rules, so payment capture must stay outside the conversational layer.",
      "Properties may operate under different PMS configurations, so integration scope has to be confirmed before a chain-wide rollout is promised.",
    ],
    economics: {
      volumeMonthly: 45000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions across the hotel portfolio; per-property call volumes, overnight staffing cost and OTA-versus-direct mix must be established in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling reservation changes, cancellations and late-arrival notifications for a defined cluster of properties in Japanese and English, with PMS write-back and night-desk escalation.",
    expansion: [
      "Roll the same front door across the full chain including the Sunroute properties",
      "Add corporate invoice and receipt servicing",
      "Extend to rail-side pass and IC-card servicing for the Kanagawa network",
    ],
    stakeholders: [
      "President / General Manager, Sotetsu Hotels",
      "Head of Reservation and Revenue Management",
      "Head of Hotel Operations (regional)",
      "General Manager, Group Information Systems",
      "Group corporate planning lead",
    ],
    discovery: [
      "Are reservations handled centrally or property by property, and where do change calls actually land?",
      "What is the overnight staffing model at typical Fresa Inn and Sunroute properties?",
      "What share of bookings arrive via OTA versus the own-brand site, and how does that change who the guest calls?",
      "Which PMS platforms are in use across the portfolio and how uniform is the configuration?",
    ],
    flowTemplate: "appointments",
    scenario: "A guest calls a Sotetsu Fresa Inn at 01:20 to push a booking back a night; the agent applies the cancellation policy, updates the PMS and confirms without waking the night-desk staff member.",
  },

  "meitetsu": {
    operatingContext:
      "Nagoya Railroad, known as Meitetsu, is the transport backbone of the Chubu region, running a rail network across Aichi and Gifu including the μSKY airport express to Chubu Centrair International Airport, plus one of Japan's largest bus operations, taxi companies, hotels, a Nagoya department store and real-estate businesses. The customer estate is therefore fragmented: rail passengers using manaca IC cards, airport travellers with luggage and connection questions, bus and taxi users, hotel guests and department-store customers each contact a different desk. Chubu's labour market is tightened by both manufacturing employment and demographic decline, which makes drivers, station staff, receptionists and phone operators all hard to recruit simultaneously. Inbound demand through Centrair adds English and Chinese enquiry load onto a group whose language coverage is thin outside the airport line.",
    strategicPressure: [
      { text: "Meitetsu operates the rail link to Chubu Centrair International Airport, concentrating multilingual traveller enquiries on a small part of a mainly domestic network.", kind: "verified" },
      { text: "The group spans rail, bus, taxi, hotels, department-store retail and real estate, so customer contact is spread across many separately managed desks.", kind: "verified" },
      { text: "Bus and taxi driver shortages in Chubu have already forced service reductions across Japanese regional operators, which increases enquiry and complaint volume about timetables and availability.", kind: "inference" },
      { text: "No single Meitetsu entity has enough contact volume to justify its own automation, so the case depends on a group-level deployment across desks.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A regional transport conglomerate with vendor-procured IT and no group software organisation. Individual entities run small, business-hours desks, and technology decisions are made per company — the buy-led profile, contingent on a holding-company sponsor to aggregate the demand.",
    whyNotBuild:
      "Meitetsu would need Japanese, English and Chinese speech, keigo-grade voice for a department-store and hotel service culture, telephony spanning rail, bus, taxi, hotel and retail desks, and integrations into an unrelated set of systems. The economics only work if the capability is shared, which is precisely what buying a packaged multi-desk deployment delivers.",
    workflows: [
      {
        name: "Airport-access and multilingual travel enquiry handling",
        friction: "Travellers ask about μSKY timings, terminal access, luggage, fares and connections at counters with variable language coverage and closing hours earlier than late flights.",
        outcome: "Routing, timing, fare and luggage questions answered around the clock in three languages with grounded timetable and service-status data.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Timetable / routing", "Fare rules", "Service-status feed"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Group hotel reservation and enquiry handling",
        friction: "Reservation changes and pre-stay questions ring property front desks in Nagoya and regional locations that are running check-in with minimal staff.",
        outcome: "Reservation changes and pre-stay enquiries handled centrally with PMS write-back, keeping reception with in-person guests.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Hotel PMS", "Central reservation system", "Payment processing"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Bus and taxi service enquiry and booking support",
        friction: "Timetable changes, route questions, reserved-seat highway-bus bookings and taxi dispatch requests are handled by separate phone desks with business-hours coverage.",
        outcome: "Timetable, route and highway-bus reservation questions answered conversationally, with taxi dispatch requests captured and routed to the dispatch system.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Bus reservation / timetable", "Taxi dispatch system", "Service-status feed"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "manaca IC card and commuter-pass servicing across rail and bus",
        "Online reservation for μSKY reserved seats and highway-bus services",
        "Station and airport-station information counters with limited multilingual staffing",
        "Property-level reservation handling across group hotels and a taxi dispatch operation",
      ],
      gaps: [
        "No shared front door across rail, bus, taxi, hotel and retail enquiries",
        "English and Chinese support is confined to the airport line and daytime hours",
        "Bus timetable-reduction questions have no scalable answering channel",
        "Hotel and taxi requests cannot be completed outside business hours",
      ],
    },
    risks: [
      "Group entities are separate companies with their own data and budgets, so cross-entity recognition needs an APPI-compliant sharing agreement and a holding-level mandate.",
      "Taxi dispatch and bus service information are operationally time-sensitive; the agent must only state what dispatch and timetable systems confirm.",
      "Without a group sponsor the deployment fragments into desk-level pilots too small to prove economics.",
    ],
    economics: {
      volumeMonthly: 55000,
      costPerInteraction: 4.5,
      automationRate: 0.5,
      basis: "Seller assumptions aggregating rail, bus, taxi and hotel desks; per-entity volumes and staffing costs must be gathered individually in discovery because no consolidated figure is likely to exist.",
    },
    pilotScope:
      "An eight-week pilot providing multilingual airport-access and rail enquiry handling for the Centrair corridor in Japanese, English and Chinese, grounded in timetable, fare and service-status data.",
    expansion: [
      "Extend to group hotel reservation changes and pre-stay enquiries with PMS write-back",
      "Add highway-bus reservation and taxi dispatch request handling",
      "Consolidate group desks behind one front door with shared customer context",
    ],
    stakeholders: [
      "General Manager, Railway Business Headquarters",
      "Head of Bus and Taxi Business",
      "General Manager, Hotel Business",
      "Head of Group Information Systems",
      "Holding-company corporate planning lead",
    ],
    discovery: [
      "How many separate customer-facing phone numbers does the group operate across its businesses?",
      "What is the non-Japanese enquiry share at Centrair-line stations and in what languages?",
      "Which entity would fund a shared deployment, and does the holding company have that authority?",
      "How are bus timetable reductions and taxi dispatch requests communicated to customers today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A traveller landing at Centrair asks in English about the last μSKY service and the connection to a Meitetsu group hotel, and books the hotel change in the same conversation.",
  },

  "jtb": {
    operatingContext:
      "JTB is Japan's largest travel company, selling domestic and overseas package tours, arranging school excursions and group travel, running a corporate business-travel operation, and handling inbound and event businesses. Its customer base skews older and institutional: leisure travellers who value a counter conversation, school and organisation trips that involve long consultative planning, and corporate accounts with booked-and-managed itineraries. Contact today runs through a substantially reduced retail-store network, telephone reservation and support centres including outsourced capacity, the JTB website and app, and dedicated corporate desks. The company restructured heavily after the pandemic, cutting fixed costs and store count, which pushed more servicing into phone and digital channels without a matching increase in staffed capacity.",
    strategicPressure: [
      { text: "JTB undertook a major post-pandemic restructuring that substantially reduced its retail store network and fixed cost base.", kind: "verified" },
      { text: "School and group travel, plus corporate travel management, remain core JTB businesses that are consultative and communication-intensive rather than self-service.", kind: "verified" },
      { text: "With fewer stores, booking changes and pre-departure questions that used to be handled face to face now arrive by phone at centres sized for a smaller load.", kind: "inference" },
      { text: "Disruption events — typhoons, airline cancellations, overseas incidents — generate simultaneous contact from every affected traveller, which is the hardest pattern for a fixed-headcount travel desk.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "JTB's technology is a mixture of legacy reservation and back-office systems, vendor platforms and outsourced contact operations; its capability and capital have gone into distribution and product, not into building conversational infrastructure. Post-restructuring cost discipline makes a platform build implausible, while elastic servicing capacity is directly aligned to the new operating model.",
    whyNotBuild:
      "JTB would have to build Japanese speech with travel-domain vocabulary, keigo-grade voice acceptable to an older customer base that chose an agent precisely for the human touch, telephony across in-house and outsourced centres, and integration into reservation, itinerary and supplier systems. Its competitive investment is in product and distribution, not in becoming a speech-platform operator.",
    workflows: [
      {
        name: "Package-tour booking change and cancellation handling",
        friction: "Changes to package bookings — dates, room types, participant lists, cancellations — are handled by phone against tour conditions that vary by product, with long calls and inconsistent policy application.",
        outcome: "Booking changes and cancellations handled conversationally with tour conditions applied consistently, cancellation charges explained clearly, and complex multi-supplier changes escalated with full context.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Tour reservation system", "Tour conditions / fare rules", "Payment and refund processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Pre-departure enquiry and document handling",
        friction: "Travellers phone repeatedly before departure about meeting points, documents, baggage, visa and insurance requirements, generating high-volume, low-complexity calls that saturate the centre in peak season.",
        outcome: "Pre-departure questions answered from governed sources at any hour, with documents re-sent on request and outstanding items chased proactively.",
        channels: ["Voice", "LINE", "Email"],
        systems: ["Itinerary / booking records", "Product information base", "Document delivery"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Disruption response for travellers in progress",
        friction: "When flights cancel or a destination is affected, every affected traveller calls at once; the centre triages by whoever gets through rather than by urgency, and travellers overseas face time-zone gaps.",
        outcome: "Proactive outbound contact to affected bookings with grounded options, elastic inbound capacity absorbing the spike, and specialists reserved for complex re-routing.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Itinerary / booking records", "Supplier and airline status feeds", "Emergency assistance records"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A reduced but still national retail store network for consultative selling",
        "Telephone reservation and support centres including outsourced capacity",
        "JTB website, app and a member programme covering domestic and overseas products",
        "Dedicated corporate travel and school/group travel desks",
      ],
      gaps: [
        "Booking changes cannot be completed outside centre hours for the customers least likely to use the app",
        "Disruption response depends on who gets through the queue rather than on who is most affected",
        "Repeat pre-departure questions consume specialist consultant time",
        "Travellers overseas have no reliable same-language channel across time zones",
      ],
    },
    risks: [
      "Travel-agency cancellation charges and tour conditions are contractually and legally defined; the agent must quote only from configured product conditions and escalate any discretion.",
      "APPI applies to passport, insurance and itinerary data, some of which is sensitive, so what the agent may retrieve and state must be tightly scoped.",
      "Outsourced contact partners hold volume commitments and trained-agent capacity that shape the pace at which automated containment can be realised.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 6.0,
      automationRate: 0.5,
      basis: "Seller assumptions for a national travel agency post-restructuring; actual contact volumes, in-house versus outsourced cost per contact and seasonal peaks must be validated with JTB's customer-service organisation.",
    },
    pilotScope:
      "A ten-week pilot automating pre-departure enquiries and document re-sends for domestic package-tour customers in Japanese, grounded in itinerary records and product information, with consultant escalation.",
    expansion: [
      "Add package-tour booking changes and cancellations with tour-condition grounding",
      "Introduce proactive disruption outreach and elastic inbound capacity for affected bookings",
      "Extend to corporate and group-travel desks with account-aware handling",
    ],
    stakeholders: [
      "Executive Officer, Domestic Travel Business",
      "Head of Customer Service / Contact Centre operations",
      "General Manager, Digital / IT Division",
      "Head of Corporate and Group Travel Business",
      "Procurement lead for outsourced contact services",
    ],
    discovery: [
      "What share of servicing contacts arrives by phone now compared with before the store-network reduction?",
      "How is disruption-day volume absorbed today, and what does the overflow arrangement cost?",
      "Which system holds authoritative tour conditions and cancellation charges per product?",
      "What proportion of contacts are pre-departure questions that never change a booking?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A typhoon cancels flights to Okinawa; every affected JTB package customer is contacted proactively with rebooking and refund options before the reservation centre opens.",
  },

  "his": {
    operatingContext:
      "H.I.S. built its business on discount overseas air tickets and value-oriented package tours and remains one of Japan's better-known travel brands, particularly with younger and price-sensitive leisure travellers. After the pandemic it restructured hard, closing a large share of its retail branches and divesting non-core assets, which shifted servicing weight decisively onto phone and online channels. Customers today book through its website and app, remaining branches and telephone desks, and contact it for fare questions, booking changes, airline schedule changes, visa and document queries and cancellations. Because its product mix is heavier in air-inclusive and overseas travel, its servicing load is unusually exposed to airline schedule changes and destination disruptions.",
    strategicPressure: [
      { text: "H.I.S. carried out a substantial post-pandemic restructuring including a large reduction of its retail branch network and disposal of non-core businesses.", kind: "verified" },
      { text: "The company's product mix is weighted toward overseas air-inclusive travel, which makes airline schedule changes a constant driver of servicing contacts.", kind: "verified" },
      { text: "With fewer branches and a leaner cost base, the servicing load has concentrated on phone and web channels without a proportional increase in staffed capacity.", kind: "inference" },
      { text: "Fare-sale and seasonal booking windows generate short, intense enquiry spikes that a restructured desk cannot staff for economically.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A restructured travel retailer whose priority is fixed-cost reduction and whose technology is a mix of vendor platforms and legacy systems. There is no internal speech or conversational-AI capability and no plausible investment case for building one; elastic bought capacity aligns exactly with the post-restructuring operating model.",
    whyNotBuild:
      "Building speech, keigo-quality voice, telephony and integrations to reservation, ticketing and supplier systems is a multi-year programme for a company whose stated priority is cost discipline. The right to win is a deployment that reduces servicing cost from month one without capital investment.",
    workflows: [
      {
        name: "Booking-change and airline schedule-change handling",
        friction: "Airline schedule changes require the agency to contact travellers and rebook; today that is manual outbound calling plus inbound follow-up, with travellers frequently unreachable in business hours.",
        outcome: "Affected travellers contacted proactively on their preferred channel with grounded rebooking options and confirmation, with complex multi-sector itineraries escalated.",
        channels: ["Voice", "LINE", "Email"],
        systems: ["Reservation / ticketing system", "Airline schedule feeds", "Customer records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Fare, availability and product enquiry handling",
        friction: "Price-sensitive customers phone repeatedly to check fares, seat availability and campaign conditions during sale windows, consuming staff time on enquiries that mostly do not convert immediately.",
        outcome: "Fare, availability and campaign-condition questions answered instantly at any hour with grounded product data, and genuine buying intent routed to a human seller.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Product / fare database", "Campaign rules", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Document, visa and pre-departure requirement support",
        friction: "Overseas travel generates high-volume questions about passports, visas, entry requirements and insurance that staff answer one call at a time from reference materials.",
        outcome: "Requirement questions answered from governed, destination-specific sources with clear escalation where official confirmation is needed, cutting repetitive load.",
        channels: ["Voice", "LINE", "Email"],
        systems: ["Destination requirement information base", "Itinerary records", "Insurance product data"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Website and app booking for air tickets and package products",
        "A reduced retail branch network for consultative and complex sales",
        "Telephone reservation and support desks with business-hours coverage",
        "A customer member programme with booking history",
      ],
      gaps: [
        "Airline schedule changes still depend on manual outbound calling to reach travellers",
        "Fare and availability questions cannot be answered outside business hours",
        "Entry-requirement questions consume consultant time with no self-service equivalent",
        "Sale-window spikes are absorbed by queueing rather than by capacity",
      ],
    },
    risks: [
      "Entry requirements and visa rules change without notice and carry real consequences for travellers, so the agent must cite governed sources and escalate anything not confirmed.",
      "Cancellation and change charges are contractual; only configured conditions may be quoted, with discretion reserved to staff.",
      "APPI applies to passport and itinerary data, so retrieval scope and retention must be defined before deployment.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions for a restructured travel retailer; post-restructuring contact volumes, channel mix and cost per contact must be validated in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling fare, availability and pre-departure requirement enquiries in Japanese and English with grounded product and destination data, and warm handoff to sellers on buying intent.",
    expansion: [
      "Add proactive outbound handling of airline schedule changes with in-conversation rebooking options",
      "Extend to booking changes and cancellations with configured condition grounding",
      "Introduce disruption-event outreach for travellers already overseas",
    ],
    stakeholders: [
      "Executive Officer, Travel Business",
      "Head of Customer Support / Contact Centre",
      "General Manager, IT / Digital",
      "Head of Overseas Travel Product",
      "Corporate planning lead responsible for cost programmes",
    ],
    discovery: [
      "How many travellers per month are affected by airline schedule changes, and how are they contacted today?",
      "What is the current phone-versus-web mix of servicing contacts after the branch reductions?",
      "How intense are the enquiry spikes during fare-sale windows relative to baseline?",
      "Which system is the authoritative source for destination entry requirements used by staff?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "An airline moves a Bangkok departure by six hours; every affected H.I.S. traveller is reached on LINE or by voice with alternative options and confirms a new itinerary the same evening.",
  },

  "skymark-airlines": {
    operatingContext:
      "Skymark Airlines is an independent Japanese carrier operating a single-type narrow-body fleet on domestic trunk and leisure routes from Haneda, Kobe, Fukuoka, Naha and Sapporo, competing on fare and on a consistently strong on-time record rather than on network breadth or alliance benefits. Without the group infrastructure of the two majors, it runs a comparatively small reservation and customer-support operation covering bookings, changes, special-assistance requests, baggage issues and irregular operations. Customers reach it through its website and app, travel agencies and OTAs, airport counters and a telephone reservation centre with defined operating hours. Its exposure is asymmetric: on a normal day the desk is adequate, and on a weather-disrupted day the same desk faces the entire affected passenger base at once.",
    strategicPressure: [
      { text: "Skymark operates a single-fleet-type domestic network and competes principally on price and punctuality, without the servicing infrastructure of a full-service group carrier.", kind: "verified" },
      { text: "Its route network is weighted toward routes exposed to seasonal weather disruption including Okinawa, Hokkaido and Kobe services.", kind: "verified" },
      { text: "Disruption-day contact volume can exceed normal-day volume by an order of magnitude, which a small reservation centre cannot staff for at any price.", kind: "inference" },
      { text: "Special-assistance and accessibility requests carry regulatory expectations that make timely handling a compliance as well as a service matter.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A mid-size carrier with reservation systems and customer platforms supplied by aviation-industry vendors, no software product organisation, and a cost base that rules out platform investment. Buy-led is the only realistic classification, with disruption elasticity as the value driver.",
    whyNotBuild:
      "Skymark cannot build Japanese and English speech, keigo-grade voice, elastic telephony and PSS integration for a reservation centre of its size. The whole point of the offer is that elasticity is rented rather than owned — the carrier pays for surge capacity only on the days it actually surges.",
    workflows: [
      {
        name: "Irregular-operations rebooking and passenger notification",
        friction: "When weather cancels or delays flights, all affected passengers call at once; the reservation centre queues, and passengers with connections or return legs get no proactive contact.",
        outcome: "Affected passengers notified proactively with grounded rebooking options and self-service confirmation, and inbound spikes absorbed with specialists reserved for complex cases.",
        channels: ["Voice", "SMS", "LINE", "App"],
        systems: ["Passenger service system", "Flight operations status feed", "Refund / payment processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Booking change, name-correction and refund servicing",
        friction: "Date changes, name corrections and refund requests are handled by phone against fare rules that differ by booking class, producing long calls and inconsistent charge explanations.",
        outcome: "Changes and refunds executed conversationally with fare rules applied consistently and charges explained clearly, with exceptions escalated.",
        channels: ["Voice", "Web", "App"],
        systems: ["Passenger service system", "Fare rules engine", "Payment and refund processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Special-assistance and baggage enquiry handling",
        friction: "Wheelchair, medical-equipment and unaccompanied-passenger requests, plus baggage size, sports-equipment and delayed-baggage questions, are all handled manually by the same small desk.",
        outcome: "Assistance requests captured with structured detail and routed to airport operations, and baggage rules answered instantly, keeping staff for cases needing judgement.",
        channels: ["Voice", "Web", "App"],
        systems: ["Passenger service system", "Airport operations / assistance records", "Baggage tracing system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Website and app booking with online change and cancellation for standard cases",
        "A telephone reservation and support centre with defined operating hours",
        "Airport check-in counters and self-service kiosks at served airports",
        "SMS and email notification for schedule changes",
      ],
      gaps: [
        "Disruption-day inbound capacity does not flex with demand",
        "Proactive rebooking is limited to notification rather than an in-channel option to confirm",
        "Special-assistance requests cannot be lodged conversationally outside desk hours",
        "Delayed-baggage status requires calling rather than being pushed to the passenger",
      ],
    },
    risks: [
      "Aviation consumer-protection and accessibility expectations mean assistance and disruption handling must be auditable and never silently mishandled by automation.",
      "Fare rules and refund entitlements are contractual, so only configured rules may be applied and discretion must remain human.",
      "APPI and payment-card handling apply to passenger records; card capture must remain outside the conversational layer.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 6.0,
      automationRate: 0.5,
      basis: "Seller assumptions for a mid-size domestic carrier; baseline and disruption-day contact volumes, centre staffing cost and overflow arrangements must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot providing proactive disruption notification with in-channel rebooking confirmation plus elastic inbound handling for one seasonally disrupted route group, in Japanese and English.",
    expansion: [
      "Extend to booking changes, name corrections and refund servicing with fare-rule grounding",
      "Add special-assistance request intake routed to airport operations",
      "Introduce delayed-baggage proactive status updates",
    ],
    stakeholders: [
      "Executive Officer, Sales and Marketing",
      "Head of Reservation and Customer Support Centre",
      "Head of Airport Operations / Ground Handling",
      "General Manager, IT / Systems",
      "Head of Operations Control",
    ],
    discovery: [
      "What is the ratio of disruption-day contact volume to a normal day, and how is overflow handled?",
      "Can the passenger service system support in-channel rebooking confirmation, or only notification?",
      "How many special-assistance requests are received monthly and through which channels?",
      "What are the reservation centre's hours, and what happens to calls outside them?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "Snow closes New Chitose; every affected Skymark passenger is messaged with live alternative flights and rebooks in-channel before reaching the airport.",
  },

  "seibu-prince-hotels": {
    operatingContext:
      "Seibu Prince Hotels Worldwide operates the Prince Hotels portfolio — city hotels in Tokyo and major cities, plus a distinctive base of resort assets covering ski fields, golf courses and mountain and coastal resorts, many inherited from the Seibu group's land holdings. The mix means the reservation load spans business city stays, domestic leisure packages, ski and golf bookings with equipment and lift-pass components, banquet and wedding enquiries, and rising inbound demand. Guests reach the group through its own booking site and member programme, OTAs, travel agencies, and telephone reservation handling that is partly central and partly property-level. Resort properties in particular sit in areas where seasonal staffing is extremely difficult, so telephone-operator and reception roles are consolidated or left unfilled.",
    strategicPressure: [
      { text: "The Prince Hotels portfolio spans city hotels and a large resort estate including ski and golf assets, giving it a reservation mix far more complex than a pure city-hotel chain.", kind: "verified" },
      { text: "The group has been repositioning and rationalising its hotel portfolio, including asset transactions, which puts operating efficiency under active management scrutiny.", kind: "verified" },
      { text: "Resort-area properties cannot recruit seasonal reception and telephone staff at required levels, so enquiry handling is being consolidated toward central capability.", kind: "inference" },
      { text: "Ski and golf bookings carry component questions — lift passes, rentals, tee times, shuttle transfers — that generate multiple contacts per booking and are ideal automation candidates.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Hotel groups buy PMS, central reservation and booking-engine technology from specialist vendors; Seibu Prince has no software product organisation and its capital is deployed in property. Contact operations are partly outsourced and partly property-level, which is the standard buy-led hospitality configuration.",
    whyNotBuild:
      "Delivering this internally means four-language speech, keigo-grade voice that a premium Japanese hotel brand will accept, telephony fronting both a central desk and dozens of properties, and integration into PMS, central reservation and resort activity systems. Hotel groups do not build that; they buy it and hold the vendor to a service standard.",
    workflows: [
      {
        name: "Central reservation-line change and cancellation handling",
        friction: "Guests phone to change dates, room types and rate plans, and the central line queues at peak while properties field overflow calls during check-in.",
        outcome: "Changes and cancellations executed against the PMS with rate-plan conditions applied consistently, in four languages, at any hour.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Central reservation system", "Hotel PMS", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Resort activity and facility enquiry handling",
        friction: "Ski, golf, spa and shuttle questions — lift-pass rules, rental sizing, tee-time availability, transfer timings — are answered property by property, seasonally, by staff who are also serving guests in person.",
        outcome: "Activity, facility and transfer questions answered instantly with grounded property data, and bookable components captured for the property's booking systems.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Property information base", "Activity / tee-time booking systems", "Hotel PMS"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Banquet, wedding and group enquiry qualification",
        friction: "Enquiries for banquets, weddings and group bookings arrive by phone and web and wait for a sales coordinator, with slow first response losing enquiries to competitors.",
        outcome: "Enquiries qualified conversationally within minutes with date, headcount and budget captured, and appointments booked directly onto coordinator calendars.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Sales / banquet CRM", "Function-space availability", "Coordinator calendars"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Own-brand booking site with a hotel member and points programme",
        "Central reservation handling alongside property-level telephone reception",
        "OTA and travel-agency distribution across city and resort properties",
        "Property-level activity and facility booking for ski, golf and banquet operations",
      ],
      gaps: [
        "Resort activity questions cannot be answered centrally, so calls fall back to seasonal property staff",
        "Reservation changes are constrained to central-desk hours for a portfolio serving international guests",
        "Banquet and wedding enquiries wait for coordinator availability rather than being qualified immediately",
        "Chinese and Korean support is inconsistent across properties",
      ],
    },
    risks: [
      "Rate-plan and cancellation conditions vary by property and channel, so only configured conditions may be applied and OTA-sourced bookings need careful scope handling.",
      "APPI and payment-card rules apply to guest records; card data must be captured outside the conversational layer.",
      "A premium brand requires a documented tone and keigo evaluation gate before any guest-facing exposure.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions across central and property-level contact; the split between central-desk and property calls, and the outsourcing arrangement behind the central line, must be established in discovery.",
    },
    pilotScope:
      "A ten-week pilot on central reservation-line changes and cancellations plus resort activity enquiries for the ski-season properties, in Japanese, English, Chinese and Korean with PMS write-back.",
    expansion: [
      "Extend across the full city-hotel portfolio for reservation servicing",
      "Add banquet, wedding and group enquiry qualification with coordinator scheduling",
      "Introduce proactive pre-arrival outreach covering transfers, activities and upsell",
    ],
    stakeholders: [
      "Executive Officer, Hotel Operations",
      "Head of Reservation Centre / Revenue Management",
      "General Manager, Resort Business (ski and golf operations)",
      "Head of IT / Digital for the hotel company",
      "Head of Sales for banquet and group business",
    ],
    discovery: [
      "What share of reservation contacts reaches the central line versus individual properties?",
      "Is the central reservation line operated in-house or by an outsourced partner, and under what terms?",
      "How are resort activity bookings handled today, and which systems hold availability?",
      "What is the language mix of inbound guest contacts across city and resort properties?",
    ],
    flowTemplate: "appointments",
    scenario: "A guest booking a Prince ski resort asks in Mandarin about lift passes, rental sizes and the shuttle from the station, then moves the stay a day later — all in one late-night call.",
  },

  "apa-group": {
    operatingContext:
      "APA Group operates the largest domestic hotel chain in Japan by number of rooms, built on a deliberately lean model: compact rooms, high-density city-centre locations, aggressive direct-booking promotion through its own membership programme and app, and minimal staffing per property. Front desks are small, self check-in is pushed hard, and the economics depend on keeping labour per room-night very low. That model concentrates guest contact — reservation changes, cancellations, late arrivals, receipt requests, facility questions — onto a small number of people per property and a central reservation capability. Tourist-city properties in Tokyo, Osaka, Kyoto and Sapporo carry substantial inbound demand, so a meaningful share of those calls arrive in English or Chinese against staffing that is not designed for language coverage.",
    strategicPressure: [
      { text: "APA is the largest domestic hotel chain by room count and runs an unusually lean staffing and direct-booking model with heavy promotion of its own membership programme and self check-in.", kind: "verified" },
      { text: "The chain has continued aggressive room expansion, which multiplies contact volume across properties without proportional staffing growth.", kind: "verified" },
      { text: "Direct-booking emphasis means more servicing lands on APA itself rather than on OTAs, so change and cancellation calls are APA's cost rather than a partner's.", kind: "inference" },
      { text: "Inbound guests at tourist-city properties generate English and Chinese calls that thin front desks cannot cover reliably across shifts.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A famously cost-disciplined operator that buys hotel technology rather than building it, with no software product organisation and capital directed at property development. Its economics reward any automation that protects the thin-staffing model, but only if it is bought as an operating cost rather than built as a project.",
    whyNotBuild:
      "APA would need Japanese, English and Chinese speech, keigo-grade voice, telephony across hundreds of properties and PMS integration for changes and cancellations. For a company whose entire advantage is cost per room-night, that is exactly the kind of fixed investment it systematically avoids — buying metered capacity is congruent with the business model.",
    workflows: [
      {
        name: "Reservation change and cancellation handling at property scale",
        friction: "Guests call individual properties or the central line to change dates or cancel, interrupting a front desk of one or two people during check-in peaks and producing uneven policy application.",
        outcome: "Changes and cancellations executed against the PMS with membership-rate conditions applied consistently, in three languages, without interrupting the desk.",
        channels: ["Voice", "Web", "App"],
        systems: ["Central reservation system", "Hotel PMS", "Membership programme platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Late-arrival, access and facility enquiry handling",
        friction: "Late-arrival notifications, parking, luggage, bath and breakfast questions arrive overnight to a desk that may be handling security and check-in simultaneously.",
        outcome: "Routine guest questions answered and late arrivals recorded against the booking at any hour, with only genuine exceptions reaching staff.",
        channels: ["Voice", "App", "LINE"],
        systems: ["Hotel PMS", "Property information base", "Guest messaging"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Membership and receipt-request servicing",
        friction: "Membership point questions, login problems and receipt or invoice reissues are handled manually by property staff and a central desk, at volumes that scale with the chain's size.",
        outcome: "Membership account questions and receipt reissues handled conversationally with automated document delivery, removing a recurring manual task.",
        channels: ["Voice", "App", "Email"],
        systems: ["Membership programme platform", "Hotel PMS", "Billing / accounting"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large direct-booking membership programme with app-based booking and self check-in",
        "Central reservation handling alongside property-level telephone reception",
        "Self-service check-in and check-out terminals deployed across properties",
        "OTA distribution alongside a heavily promoted direct channel",
      ],
      gaps: [
        "Guests who cannot complete a change in the app fall back to a single-person front desk",
        "No consistent English or Chinese voice support across properties and shifts",
        "Overnight enquiries compete directly with security and arrival duties",
        "Receipt and membership issues require human handling despite being fully deterministic",
      ],
    },
    risks: [
      "Cancellation and membership-rate conditions are commercially material, so the agent must operate strictly within configured policy.",
      "APPI and payment-card handling apply to guest and membership records; card data must not enter the conversational layer.",
      "A chain-wide rollout depends on PMS configuration consistency across a very large property estate, which must be verified before commitments are made.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 4.0,
      automationRate: 0.6,
      basis: "Seller assumptions reflecting a very large but low-cost-per-contact property estate; per-property call volumes and the central-versus-property split must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling reservation changes, cancellations and late-arrival notifications for a cluster of tourist-city properties in Japanese, English and Chinese, with PMS write-back.",
    expansion: [
      "Roll the same capability across the national property estate",
      "Add membership account and receipt-reissue servicing",
      "Introduce proactive pre-arrival messaging covering access, parking and check-in guidance",
    ],
    stakeholders: [
      "Executive responsible for Hotel Operations",
      "Head of Reservation Centre",
      "Head of Membership / Direct Channel",
      "General Manager, Information Systems",
      "Regional operations managers for tourist-city clusters",
    ],
    discovery: [
      "What proportion of change and cancellation contacts reach individual properties rather than the central line?",
      "How many staff are on duty overnight at a typical property, and what do they currently handle?",
      "What share of guests at tourist-city properties are non-Japanese, and in which languages do they call?",
      "How uniform is the PMS configuration across the estate for automated change write-back?",
    ],
    flowTemplate: "appointments",
    scenario: "A guest arriving at 01:00 in Osaka calls to hold the room and extend by a night; the agent updates the PMS and confirms in Chinese while the single night-desk staff member keeps working.",
  },

  "hoshino-resorts": {
    operatingContext:
      "Hoshino Resorts operates a multi-brand portfolio — Hoshinoya at the luxury end, Kai for onsen ryokan, Risonare for family resorts and OMO for city hotels — with properties across Japan and a growing overseas footprint. Its identity rests on omotenashi delivered by multi-skilled staff who rotate across service roles rather than being siloed, an operational model it developed explicitly to cope with labour scarcity in resort locations. Guests reach it through its own booking site and reservation centre, OTAs and travel agencies, and pre-stay consultation is a real part of the product: dinner plans, onsen etiquette, activity programmes, transfers and accessibility all get discussed before arrival. That consultative contact is high-value but high-volume, and every hour a multi-skilled staff member spends on the phone is an hour not spent with guests on site.",
    strategicPressure: [
      { text: "Hoshino Resorts is known for a multi-skilled staff model in which employees rotate across service roles, an operational response to resort-area labour scarcity.", kind: "verified" },
      { text: "The group runs several distinct brands with different service positioning, so any guest-facing automation must be configurable per brand rather than uniform.", kind: "verified" },
      { text: "Pre-stay consultation calls are substantive and repetitive at the same time — the same questions about meals, onsen, transfers and activities recur across every booking.", kind: "inference" },
      { text: "Because staff time is the scarce resource rather than headcount budget, the value case is redeploying hours to in-person hospitality rather than cutting jobs.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "An operations-innovation company, not a software company: it buys hotel technology and invests its own ingenuity in service design and staffing models. Its openness to operational experimentation makes it an unusually receptive buyer, but the build path has no internal owner.",
    whyNotBuild:
      "The requirement is keigo-quality Japanese voice good enough to represent a luxury ryokan brand, plus English and Chinese, telephony fronting a reservation centre and properties, PMS and activity-system integration, and per-brand tone configuration with continuous evaluation. That is a product with a quality bar Hoshino would never risk building itself.",
    workflows: [
      {
        name: "Pre-stay consultation and preparation guidance",
        friction: "Guests call before arrival with questions about dinner plans, onsen etiquette, dress, activity programmes, transfers and accessibility, consuming multi-skilled staff hours that are the resort's scarcest resource.",
        outcome: "Recurring pre-stay questions answered in brand-appropriate tone at any hour with booking context, and genuine consultation escalated to staff with the conversation summarised.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Hotel PMS", "Property and activity information base", "Guest messaging"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Reservation change and plan-modification handling",
        friction: "Date, plan and meal-option changes require checking availability across accommodation and dining, and are handled by phone through the reservation centre in limited hours.",
        outcome: "Changes executed against accommodation and dining availability with plan conditions applied, at any hour and in three languages.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Central reservation system", "Hotel PMS", "Dining / activity booking"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Activity and dining reservation coordination",
        friction: "In-stay activities, dining slots and spa bookings are coordinated by staff at each property, adding coordination load during service hours.",
        outcome: "Activity and dining slots offered and booked conversationally from live availability, with staff involved only where the guest wants a recommendation.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Activity / dining booking systems", "Hotel PMS", "Property information base"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Own-brand booking site and reservation centre across the brand portfolio",
        "Property-level activity, dining and spa booking operations",
        "OTA and travel-agency distribution alongside direct booking",
        "A multi-skilled staffing model that already reallocates labour dynamically within properties",
      ],
      gaps: [
        "Pre-stay questions cannot be answered outside reservation-centre hours",
        "Overseas guests in other time zones have limited same-language voice access",
        "Activity and dining coordination still consumes on-property staff time",
        "No consistent capture of pre-stay preferences into a structured guest record across brands",
      ],
    },
    risks: [
      "Brand tone is the product; automated voice must pass a per-brand keigo and hospitality evaluation gate, with Hoshinoya held to a stricter standard than OMO.",
      "APPI applies to guest preference data including dietary and accessibility information, which is sensitive and must be scoped carefully.",
      "Guests choosing a high-touch ryokan may react badly to automation if it is not framed and escalated well, so the handoff design is a commercial risk, not just a technical one.",
    ],
    economics: {
      volumeMonthly: 70000,
      costPerInteraction: 6.0,
      automationRate: 0.45,
      basis: "Seller assumptions with a deliberately conservative automation rate given the consultative mix; actual pre-stay contact volumes and the split between routine and consultative calls must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot answering pre-stay preparation questions for one brand's properties in Japanese and English, with brand-specific tone configuration, booking context and staff escalation on any consultative turn.",
    expansion: [
      "Extend to reservation and plan changes with dining and accommodation availability grounding",
      "Add in-stay activity and dining reservation coordination",
      "Roll the configured tone model across the remaining brands with per-brand evaluation",
    ],
    stakeholders: [
      "Head of Reservation Centre / Sales",
      "Brand directors for Hoshinoya, Kai, Risonare and OMO",
      "Head of Operations Innovation",
      "General Manager, IT / Digital",
      "General managers of pilot properties",
    ],
    discovery: [
      "What share of pre-stay calls are recurring routine questions versus genuine consultation?",
      "How many staff hours per property per week go to phone handling today?",
      "Which brand would accept an automated first touch, and what tone standard must it meet?",
      "Which systems hold live availability for dining, activities and spa across properties?",
    ],
    flowTemplate: "appointments",
    scenario: "A guest booked at a Kai onsen property asks at 23:00 about dinner timing, onsen etiquette and station transfers, and books a dining slot — in keigo, with staff kept for the recommendation they actually wanted.",
  },

  "chubu-electric": {
    operatingContext:
      "Chubu Electric Power supplies the Nagoya industrial region and surrounding prefectures, serving several million household and business accounts through its retail arm alongside generation and network businesses. Since retail liberalisation it competes for those customers rather than simply serving them, which makes servicing cost and servicing quality competitive variables at once. Its retail contact load is dominated by moving-in and moving-out procedures, billing and payment questions, rate-plan changes and switching enquiries, plus outage-related contacts handled separately by the network company. Customers reach it through a web member service and app, paper bills with printed contact numbers, and telephone centres that are heavily outsourced to domestic BPOs, with the March-to-April moving season producing the sharpest annual demand spike in the business.",
    strategicPressure: [
      { text: "Japanese electricity retail is liberalised and Chubu Electric competes for retail customers, making servicing cost and switching-related contact handling commercially material.", kind: "verified" },
      { text: "The March-to-April moving season generates a concentrated spike in start and stop procedure contacts across all Japanese utilities.", kind: "verified" },
      { text: "Outsourced contact-centre capacity is increasingly difficult and expensive to secure in Japan, so peak staffing is a procurement problem as much as a cost problem.", kind: "inference" },
      { text: "Older customers continue to handle start and stop procedures by phone even where a web equivalent exists, keeping voice the dominant channel for the peak.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Utility customer systems in Japan are delivered by system vendors and group IT companies, and contact operations are contracted to BPOs. Chubu Electric's engineering strength is in generation and networks, not customer software; there is no public evidence of an internal conversational-AI platform, making this buy-led.",
    whyNotBuild:
      "The utility would have to build Japanese speech tolerant of elderly callers and address dictation, keigo-grade voice, telephony into an outsourced centre estate, and integration into customer information and billing systems — with the peak elasticity that is the whole point. That elasticity is a platform property no utility builds for itself.",
    workflows: [
      {
        name: "Moving-season start and stop procedure handling",
        friction: "In March and April, start and stop requests overwhelm centres; callers wait, addresses and dates are captured by voice into forms, and errors generate follow-up contacts.",
        outcome: "Start and stop requests captured conversationally with address and date verified, written into the customer information system, absorbing the seasonal peak without extra outsourced headcount.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Customer information system", "Address / supply-point database", "Billing system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing enquiry and payment-method servicing",
        friction: "Bill amount questions, payment-method changes and payment-date enquiries from older customers are handled by human operators reading data the billing system already holds.",
        outcome: "Authenticated billing and payment questions answered conversationally with clear explanation of charges and rate components, and payment-method changes captured for processing.",
        channels: ["Voice", "Web", "App"],
        systems: ["Billing system", "Customer information system", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rate-plan enquiry and retention handling",
        friction: "Customers considering switching call with plan and price questions; the answer quality depends on which operator picks up, and no structured save process exists at volume.",
        outcome: "Plan comparisons explained consistently from approved product data, switching reasons captured, and retention offers applied strictly within the approved matrix with escalation for exceptions.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Product / tariff data", "Customer information system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A web member service and app for billing, usage and procedure requests",
        "Telephone customer centres operated substantially through outsourced partners",
        "Printed bills and notices carrying contact numbers for phone-first customers",
        "Separate network-company contacts for outage and equipment matters",
      ],
      gaps: [
        "Moving-season peaks cannot be absorbed without additional outsourced capacity",
        "Start and stop procedures still require a voice conversation for customers who will not use the web service",
        "Billing explanations vary by operator rather than being consistently grounded",
        "No structured capture of switching reasons at the moment a customer calls to leave",
      ],
    },
    risks: [
      "Electricity retail contracts and switching are regulated; procedural steps and disclosures must follow approved scripts and be auditable.",
      "APPI applies to customer address, usage and payment data, and address capture by voice needs a verification design that avoids mis-supply.",
      "Outage and safety-related contacts must be routed to the network company's processes and never handled as retail servicing.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a large retail utility with a pronounced seasonal peak; actual contact volumes, outsourced cost per contact and peak ratios must be validated with the retail company in discovery.",
    },
    pilotScope:
      "A ten-week pilot automating moving-season start and stop procedure intake in Japanese, with address and date verification written into the customer information system and human escalation for exceptions.",
    expansion: [
      "Add authenticated billing and payment-method servicing on the same front door",
      "Introduce rate-plan enquiry handling with structured switching-reason capture",
      "Extend to proactive outbound confirmation and reminder calls around procedure dates",
    ],
    stakeholders: [
      "Executive Officer, Retail Business (Chubu Electric Power Miraiz)",
      "Head of Customer Centre operations",
      "General Manager, IT / Digital Strategy",
      "Head of Sales and Marketing for retail electricity",
      "Procurement lead for outsourced contact-centre services",
    ],
    discovery: [
      "What is the March-April peak multiple over baseline contact volume, and how is it staffed today?",
      "Which BPO partners run the customer centres and what are the contract terms and notice periods?",
      "What share of start and stop procedures still arrive by phone rather than the web service?",
      "How is the boundary between retail servicing and network-company outage handling enforced at the front door?",
    ],
    flowTemplate: "onboarding",
    scenario: "On a Saturday in late March a customer moving to Nagoya calls to start supply; the agent verifies the address, sets the start date and writes it into the customer system without joining a two-hour queue.",
  },

  "kyushu-electric": {
    operatingContext:
      "Kyushu Electric Power supplies all seven prefectures of Kyushu, serving several million household and business accounts through its retail arm while operating generation including nuclear units and the regional network business. Its service territory is demographically among the oldest and fastest-depopulating in Japan outside Tohoku, so the customer base skews heavily toward elderly householders who transact by phone and paper bill rather than app. Contacts are dominated by start and stop procedures around moving season, billing and payment questions, rate-plan and switching enquiries in the liberalised retail market, and weather-driven outage contacts during typhoon season. Servicing runs through a web member service, printed bills, and telephone centres substantially delivered by domestic outsourcing partners whose own recruitment in Kyushu is tightening.",
    strategicPressure: [
      { text: "Kyushu Electric competes for retail customers in a liberalised market while serving one of Japan's most rapidly aging and depopulating regions.", kind: "verified" },
      { text: "Kyushu is exposed to annual typhoon and heavy-rain events that generate concentrated outage and enquiry surges.", kind: "verified" },
      { text: "Contact-centre recruitment in regional Kyushu is tightening as the working-age population shrinks, raising the cost and difficulty of peak staffing.", kind: "inference" },
      { text: "An elderly customer base keeps voice dominant even where web self-service exists, so digital deflection alone will not reduce the phone load.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Customer information and billing systems are vendor-delivered, contact operations are outsourced, and internal engineering focuses on generation, nuclear safety and grid operations. No public evidence of internal conversational-AI capability, and the retail arm's cost pressure argues for bought capacity — a clear buy-led case.",
    whyNotBuild:
      "Kyushu Electric would need Japanese speech robust to elderly speakers and regional accent variation, keigo-grade voice, telephony into outsourced centres, and integration with customer information and billing systems, plus surge elasticity for storm events. Building any of that competes directly with grid and generation capital priorities.",
    workflows: [
      {
        name: "Start and stop procedure handling for moving customers",
        friction: "Moving-season and year-round start and stop requests are taken by voice, with addresses and dates transcribed manually into forms and errors surfacing later as complaints.",
        outcome: "Procedure requests captured conversationally with verified address and date written into the customer information system, absorbing peaks without extra outsourced seats.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Customer information system", "Supply-point / address database", "Billing system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing and payment enquiry handling for elderly customers",
        friction: "Older customers phone about bill amounts, payment dates and payment-method changes, and operators read out information the billing system already holds, at length and in keigo.",
        outcome: "Authenticated billing questions answered patiently and consistently at any hour, with payment-method changes captured and vulnerable callers routed to human staff.",
        channels: ["Voice", "Web"],
        systems: ["Billing system", "Customer information system", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Storm-event enquiry absorption and restoration information",
        friction: "Typhoon and heavy-rain events produce contact surges about outages and restoration timing, overwhelming lines that are also carrying routine retail servicing.",
        outcome: "Routine servicing continues to be handled automatically during events, and outage callers get grounded restoration information from published network data with clear routing for safety matters.",
        channels: ["Voice", "Web", "SMS"],
        systems: ["Outage / restoration information feed", "Customer information system", "Network-company routing"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A web member service for billing, usage and procedure requests",
        "Telephone customer centres delivered largely through outsourced partners",
        "Printed bills and notices carrying contact numbers for phone-first customers",
        "Separate network-company channels for outage reporting and restoration information",
      ],
      gaps: [
        "Elderly customers have no path other than voice, and voice is only available in staffed hours",
        "Storm-event surges swamp routine servicing rather than being separated from it",
        "Start and stop procedures require manual transcription with downstream error cost",
        "No structured capture of switching reasons when customers call to leave",
      ],
    },
    risks: [
      "Outage and electrical-safety matters belong to the network company's regulated processes and must be routed, never answered, by the retail conversational layer.",
      "Regulated retail switching and contract procedures require approved disclosures and an auditable record of what the customer was told.",
      "APPI applies to address, usage and payment data, and elderly-caller handling requires an explicit vulnerability escalation path.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions for a regional retail utility; contact volumes, outsourced cost per contact and storm-event surge multiples must be validated with the retail business in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling start and stop procedure intake plus authenticated billing enquiries in Japanese, with verified address capture into the customer information system and a vulnerability escalation path.",
    expansion: [
      "Add payment-method change and rate-plan enquiry handling",
      "Introduce storm-event routine-servicing continuity with grounded restoration information",
      "Extend to proactive outbound reminders around procedure dates and payment issues",
    ],
    stakeholders: [
      "Executive Officer, Retail Business (Kyuden Mirai Energy)",
      "Head of Customer Centre operations",
      "General Manager, Information Systems",
      "Head of Sales and Marketing for retail electricity",
      "Procurement lead for outsourced contact services",
    ],
    discovery: [
      "What share of retail contacts come from customers over 65, and how long is the average call?",
      "How is contact-centre capacity flexed during typhoon events today?",
      "Which outsourcing partners operate the centres and what are the contract terms?",
      "What is the authoritative source of restoration information the retail side may quote?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "An 82-year-old customer in Kumamoto calls about a higher-than-usual bill; the agent explains the charge components in keigo, checks usage history and offers a payment-method change without a wait.",
  },

  "tohoku-electric": {
    operatingContext:
      "Tohoku Electric Power supplies the six Tohoku prefectures plus Niigata — a territory covering the most aged and fastest-depopulating parts of Japan, with severe winters and frequent seismic and storm events. Its retail arm serves several million accounts where the median customer is older, uses paper bills, and treats the telephone as the default channel for anything procedural. Contact volume is driven by start and stop procedures, billing questions, payment arrangements, and sharp weather-driven surges from snow, typhoon and earthquake events. Servicing runs through a web member service and telephone centres largely delivered by outsourced partners located within the region, where the labour pool for that work is shrinking faster than in metropolitan Japan.",
    strategicPressure: [
      { text: "Tohoku Electric's service territory covers Japan's most rapidly aging and depopulating prefectures, which shapes both its customer base and its recruitable workforce.", kind: "verified" },
      { text: "The territory experiences heavy snow, typhoon and seismic events that produce concentrated contact surges and restoration enquiries.", kind: "verified" },
      { text: "Regional outsourced contact centres, historically located in Tohoku for cost reasons, now face the same recruitment shortage as every other local employer.", kind: "inference" },
      { text: "An elderly, phone-first customer base means digital deflection has a low ceiling and voice automation with strong keigo is the only route to real containment.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Vendor-delivered customer systems, outsourced contact operations, and internal engineering focused on generation, grid resilience and disaster recovery. There is no software product organisation and no public signal of conversational-AI capability — buy-led, with elasticity for weather events as the differentiating value.",
    whyNotBuild:
      "Building would require Japanese ASR robust to Tohoku dialect and elderly speech, keigo TTS acceptable to that customer base, telephony into regional outsourced centres, integration to customer and billing systems, and surge elasticity for disaster events. None of that is adjacent to a utility's engineering capability.",
    workflows: [
      {
        name: "Elderly-customer billing and payment-arrangement handling",
        friction: "Older customers phone about bill amounts, payment dates and difficulty paying; calls are long, require patience and keigo, and consume the most experienced operators.",
        outcome: "Billing questions answered patiently and consistently at any hour with payment arrangements captured within approved policy, and hardship or confusion cues routed immediately to human staff.",
        channels: ["Voice", "Web"],
        systems: ["Billing system", "Customer information system", "Payment processing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Start and stop procedure handling",
        friction: "Moving procedures require address, date and meter details captured by voice and re-keyed into systems, with the spring peak straining regional centre capacity.",
        outcome: "Procedure requests captured with verified address and date and written directly into the customer information system, absorbing seasonal peaks without extra seats.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Customer information system", "Supply-point / address database", "Billing system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Weather-event enquiry absorption",
        friction: "Snowstorms and typhoons produce simultaneous outage and enquiry contacts that swamp lines, so routine servicing stops entirely for days.",
        outcome: "Routine retail servicing continues automatically during events while outage callers receive grounded restoration information and safety matters are routed to network processes.",
        channels: ["Voice", "Web", "SMS"],
        systems: ["Outage / restoration information feed", "Customer information system", "Network-company routing"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A web member service for billing, usage and procedure requests",
        "Regional telephone customer centres delivered through outsourced partners",
        "Paper billing and notices as the primary channel for many older customers",
        "Separate network-company outage reporting and restoration information channels",
      ],
      gaps: [
        "No servicing channel at all outside staffed hours for phone-first elderly customers",
        "Weather events halt routine servicing rather than running alongside it",
        "Payment-difficulty conversations depend on which operator answers",
        "Procedure intake is manual and error-prone with downstream rework",
      ],
    },
    risks: [
      "Disaster and outage communications are regulated and safety-critical; the retail conversational layer must route rather than answer anything operational.",
      "Payment-difficulty conversations touch vulnerable customers and require a documented escalation path and conduct standard.",
      "APPI applies to customer and usage data, and voice capture of addresses in a region with complex place names requires verification design.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.5,
      automationRate: 0.5,
      basis: "Seller assumptions for a regional retail utility with an older customer base; call volumes, average handling times and weather-surge multiples must be validated with the retail organisation.",
    },
    pilotScope:
      "An eight-week pilot answering authenticated billing and payment questions in Japanese with an explicit vulnerability escalation path, plus start and stop procedure intake into the customer information system.",
    expansion: [
      "Add payment-arrangement capture within approved policy",
      "Introduce weather-event servicing continuity with grounded restoration information",
      "Extend to proactive outbound reminders for payment and procedure dates",
    ],
    stakeholders: [
      "Executive Officer, Retail Business",
      "Head of Customer Centre operations",
      "General Manager, Information Systems",
      "Head of Customer Service Planning",
      "Procurement lead for outsourced contact services",
    ],
    discovery: [
      "What are the current staffed hours, and what happens to calls arriving outside them?",
      "How does contact volume behave during a major snow or typhoon event compared with baseline?",
      "What escalation path exists today for customers in payment difficulty?",
      "How much of the regional outsourced centre capacity is at risk from local recruitment shortfalls?",
    ],
    flowTemplate: "inbound-service",
    scenario: "During a February snow event a customer in Akita calls about a payment date; the agent handles it in keigo while the human centre stays focused on outage-related contacts.",
  },

  "osaka-gas": {
    operatingContext:
      "Osaka Gas, the core of the Daigas Group, supplies city gas to millions of accounts across Kansai and has built a large adjacent business selling and servicing gas equipment — water heaters, floor heating, stoves and air conditioning — alongside electricity retail since liberalisation. That equipment business turns the company into a field-service operator: appointments must be booked, technicians dispatched, safety inspections scheduled on a statutory cycle, and repair visits coordinated with customers who are frequently elderly and at home only at particular times. Contact today runs through a member web service, printed bills, service shops and a telephone centre network partly delivered by outsourcing partners and group service companies. The scheduling workload is the distinguishing feature: it is repetitive, appointment-shaped, and consumes enormous operator time that has nothing to do with commodity billing.",
    strategicPressure: [
      { text: "Osaka Gas combines city-gas supply with a substantial equipment sales and service business, making appointment scheduling and technician dispatch core operational workflows rather than peripheral ones.", kind: "verified" },
      { text: "City-gas suppliers are obliged to carry out periodic safety inspections of customer premises, which generates a continuous, statutory scheduling and re-scheduling workload.", kind: "verified" },
      { text: "Field technicians are scarce and expensive, so every failed or mis-timed appointment wastes the company's most constrained resource.", kind: "inference" },
      { text: "Elderly customers coordinating a home visit strongly prefer phone confirmation, which keeps this workflow on voice regardless of app investment.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Daigas procures customer information, billing and field-dispatch systems from vendors and runs contact operations through group service companies and outsourcers. Its innovation investment is in energy solutions and equipment, not conversational software, and no internal speech capability has been publicly signalled — buy-led.",
    whyNotBuild:
      "Scheduling automation of this kind requires Japanese speech tolerant of elderly callers, keigo-grade voice, telephony into a distributed service-shop and centre estate, and integration into dispatch, customer and equipment-history systems, with outbound confirmation and reminder capability. That is a packaged product, not a utility IT project.",
    workflows: [
      {
        name: "Equipment repair-visit scheduling and rescheduling",
        friction: "A customer with a failed water heater calls, describes the symptom, and an operator manually finds a technician slot; reschedules and no-shows then generate repeat calls and wasted visits.",
        outcome: "Symptom captured conversationally, appointment offered from live technician availability and booked, with automated reminders and one-step rescheduling that protects technician utilisation.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Field-dispatch / scheduling system", "Equipment and installation history", "Customer information system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Statutory safety-inspection appointment coordination",
        friction: "Periodic inspection visits must be arranged with every premises, requiring outbound calling campaigns, repeated attempts to reach absent households, and manual rescheduling.",
        outcome: "Outbound appointment setting handled automatically across the inspection population with confirmations and reminders, raising first-visit success and reducing repeat attempts.",
        channels: ["Voice", "SMS", "LINE"],
        systems: ["Inspection scheduling records", "Customer information system", "Field-dispatch system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Start and stop procedures and billing enquiries",
        friction: "Moving-season procedure requests and billing questions compete for the same operator capacity as equipment scheduling, so peaks in one degrade the other.",
        outcome: "Commodity servicing handled conversationally with verified address and date capture into the customer system, protecting operator capacity for equipment work.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Customer information system", "Billing system", "Payment processing"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A member web service covering billing, usage and procedure requests",
        "A network of service shops and group service companies performing equipment work",
        "Telephone centres handling commodity servicing and equipment scheduling",
        "Field-dispatch operations for repair and statutory inspection visits",
      ],
      gaps: [
        "Repair appointments cannot be booked outside centre hours when equipment fails at night or on holidays",
        "Inspection appointment setting relies on manual outbound calling with poor contact rates",
        "Reschedules and no-shows are handled reactively rather than prevented by reminders",
        "Equipment symptom capture is unstructured, so technicians arrive without complete context",
      ],
    },
    risks: [
      "Gas safety is regulated and any suspected leak or hazard must be routed immediately to emergency human handling with an unmistakable escalation rule.",
      "Statutory inspection obligations mean the record of contact attempts and appointments must be auditable.",
      "APPI applies to customer address, premises and equipment data used to schedule home visits.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions across commodity servicing and equipment scheduling; the split between the two and the cost of failed or rescheduled visits must be quantified in discovery because visit economics drive the case.",
    },
    pilotScope:
      "A ten-week pilot automating equipment repair-visit scheduling and rescheduling in Japanese for one Kansai service area, booking against live technician availability with automated reminders and emergency escalation.",
    expansion: [
      "Add outbound statutory safety-inspection appointment setting across the inspection population",
      "Extend to start and stop procedures and billing enquiries",
      "Introduce proactive equipment-lifecycle outreach for replacement and maintenance offers",
    ],
    stakeholders: [
      "Executive Officer, Residential Energy Business",
      "Head of Customer Centre operations",
      "General Manager, Equipment Service / Field Operations",
      "General Manager, Information Systems",
      "Head of Safety and Inspection compliance",
    ],
    discovery: [
      "How many equipment service visits are scheduled monthly, and what proportion are rescheduled or missed?",
      "What is the cost of a wasted technician visit, and how is it currently measured?",
      "How are statutory inspection appointments set today and what is the first-attempt contact rate?",
      "What is the mandated escalation path for any call suggesting a gas leak or hazard?",
    ],
    flowTemplate: "appointments",
    scenario: "A water heater fails on a Sunday evening in Kobe; the agent captures the symptom, books the first available technician slot and confirms the window with a reminder the night before.",
  },

  "tokyo-gas": {
    operatingContext:
      "Tokyo Gas is Japan's largest city-gas utility, supplying over ten million customer accounts across greater Tokyo and neighbouring prefectures, and since liberalisation it also sells electricity in a fiercely competitive metropolitan retail market. Like its Kansai counterpart it runs a large equipment business — water heaters, floor heating, kitchen appliances — with installation, repair and statutory safety-inspection visits at metropolitan scale. Its contact load is therefore both enormous and bimodal: high-volume commodity servicing around moving season and billing, and appointment-shaped field-service coordination that runs continuously. Customers reach it through a member web service and app, printed bills, service shops and telephone centres delivered substantially through outsourcing partners and group service companies.",
    strategicPressure: [
      { text: "Tokyo Gas serves over ten million customer accounts and competes in both gas and electricity retail across the Tokyo metropolitan market.", kind: "verified" },
      { text: "City-gas suppliers must carry out periodic safety inspections at customer premises, which at Tokyo Gas's scale is one of the largest recurring appointment-coordination workloads in Japanese utilities.", kind: "verified" },
      { text: "Greater Tokyo's March-April moving season produces the single sharpest contact peak of the year for start and stop procedures across gas and electricity.", kind: "verified" },
      { text: "Retail energy competition makes servicing cost per account a board-visible number, since it is one of the few levers a supplier controls when commodity margins are thin.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Customer, billing and dispatch systems are vendor-delivered and contact operations run through outsourcing partners and group service companies. Tokyo Gas invests in energy solutions, LNG and equipment rather than in software products, and there is no public evidence of an internal conversational-AI platform — a buy-led profile at very large scale.",
    whyNotBuild:
      "At ten million accounts the elasticity, evaluation and language quality requirements are severe: Japanese speech tolerant of elderly callers, keigo TTS, telephony fronting a multi-partner outsourced estate, integration into customer, billing, dispatch and inspection systems, and a governance layer that survives regulatory audit. That is a platform, and Tokyo Gas's capital goes elsewhere.",
    workflows: [
      {
        name: "Moving-season start and stop procedure handling",
        friction: "March and April bring an extreme concentration of start and stop requests; queues run long, address and date details are transcribed manually, and errors create downstream supply and billing problems.",
        outcome: "Procedure requests captured conversationally with verified address, date and meter details written into the customer system, absorbing the annual peak without adding outsourced seats.",
        channels: ["Voice", "Web", "LINE", "App"],
        systems: ["Customer information system", "Supply-point / address database", "Billing system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Statutory safety-inspection appointment setting",
        friction: "Inspection visits must be arranged with millions of premises on a recurring cycle, driven by outbound calling campaigns with low first-attempt contact rates and heavy rescheduling.",
        outcome: "Automated outbound appointment setting with confirmation and reminders across the inspection population, raising first-visit success and creating an auditable contact record.",
        channels: ["Voice", "SMS", "LINE"],
        systems: ["Inspection scheduling records", "Customer information system", "Field-dispatch system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Equipment repair-visit booking and dual-fuel plan servicing",
        friction: "Repair appointments and gas-plus-electricity plan questions land on the same centres, so equipment emergencies queue behind commodity enquiries and plan questions get inconsistent answers.",
        outcome: "Repair visits booked against live technician availability with structured symptom capture, and plan questions answered consistently from approved tariff data.",
        channels: ["Voice", "Web", "App"],
        systems: ["Field-dispatch / scheduling system", "Product / tariff data", "Customer information system"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A large member web service and app covering billing, usage and procedure requests",
        "Service shops and group service companies performing installation and repair work",
        "Telephone centres operated substantially through outsourcing partners",
        "Field-dispatch operations for repair and statutory safety-inspection visits",
      ],
      gaps: [
        "The annual moving peak is met by temporary outsourced capacity rather than by elastic servicing",
        "Inspection appointment setting has low first-attempt contact success and heavy manual rework",
        "Repair booking is unavailable outside centre hours when equipment actually fails",
        "IVR containment does not extend to procedures that require address capture and verification",
      ],
    },
    risks: [
      "Gas-safety escalation is non-negotiable: any indication of a leak or hazard must route immediately to emergency human handling, and that rule must be demonstrable to regulators.",
      "Statutory inspection contact records must be complete and auditable, so automated attempts must be logged to the same standard as human ones.",
      "APPI applies to a very large customer, premises and equipment dataset, and access scope for the conversational layer must be minimised and documented.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions at metropolitan-utility scale; Tokyo Gas's actual contact volumes, IVR containment rate and outsourced cost per contact must be validated before any business case is presented.",
    },
    pilotScope:
      "A ten-week pilot automating moving-season start and stop procedure intake in Japanese for one metropolitan service area, with verified address capture written into the customer system and emergency escalation rules enforced.",
    expansion: [
      "Add outbound statutory safety-inspection appointment setting with reminder and rescheduling",
      "Extend to equipment repair-visit booking with structured symptom capture",
      "Introduce dual-fuel plan servicing and retention conversations within approved policy",
    ],
    stakeholders: [
      "Executive Officer, Residential Energy / Retail Business",
      "Head of Customer Centre operations",
      "General Manager, Equipment Service and Field Operations",
      "General Manager, Digital / Information Systems",
      "Head of Safety and Regulatory Compliance",
    ],
    discovery: [
      "What is the current IVR containment rate, and what intents fall out to human operators?",
      "How many statutory inspection appointments are set monthly and what is the first-attempt success rate?",
      "How is the March-April peak resourced, and what does the incremental outsourced capacity cost?",
      "What is the mandated routing for any contact suggesting a gas leak, and how is compliance evidenced?",
    ],
    flowTemplate: "appointments",
    scenario: "In late March a customer moving within Setagaya starts gas supply and books the safety-inspection visit in the same call, at 22:00, without joining the seasonal queue.",
  },

  "jcom": {
    operatingContext:
      "JCOM is Japan's largest cable operator, delivering television, broadband, fixed telephony and mobile services to several million subscriber households, mainly in the Kanto, Kansai and other metropolitan franchise areas. Its service model is unusually physical for a communications provider: installation and fault resolution frequently require a technician visit into the home, and set-top boxes, routers and in-building wiring generate genuine technical support traffic. Subscribers reach it through a customer centre, a member web service and app, and door-to-door and retail sales channels, with a subscriber base that skews toward older households in the pay-TV segment. Competitive pressure from streaming and mobile-bundled broadband adds a continuous retention workload on top of the servicing load.",
    strategicPressure: [
      { text: "JCOM is Japan's largest cable operator, delivering TV, broadband, telephony and mobile services to a multi-million subscriber base built around metropolitan franchise areas.", kind: "verified" },
      { text: "Pay-TV in Japan faces structural pressure from streaming services, which makes retention and downgrade conversations a permanent part of the contact mix.", kind: "verified" },
      { text: "In-home technician visits are the expensive part of the operating model, so anything that improves first-visit resolution or avoids an unnecessary visit is directly margin-relevant.", kind: "inference" },
      { text: "An older pay-TV subscriber base keeps technical support on the phone rather than in self-service channels, sustaining voice volume even as digital tools improve.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "JCOM operates as a service company on top of vendor-supplied OSS, BSS and CRM platforms, with contact operations partly outsourced. Its parents' technology strategies sit elsewhere in the group; the operating company itself buys servicing technology and can be sold to directly, making this buy-led with a parent-alignment check.",
    whyNotBuild:
      "JCOM would have to build Japanese speech, keigo-grade voice for an older subscriber base, telephony into a multi-site centre estate, and integration into provisioning, diagnostics, dispatch and billing systems. Its engineering effort goes to network and service delivery, not to building a conversational platform it can rent.",
    workflows: [
      {
        name: "Technical-support triage and self-resolution",
        friction: "Subscribers with no picture, slow broadband or router problems call and are walked through scripted checks by an operator, with many calls ending in a technician visit that a better diagnosis would have avoided.",
        outcome: "Guided diagnosis using live line and device signals, resolving what can be resolved in-conversation and booking a visit with full context only when genuinely needed.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Network / device diagnostics", "Subscriber account (CRM/BSS)", "Field-dispatch system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Technician-visit scheduling and rescheduling",
        friction: "Installation and repair appointments are booked and rebooked by phone, with no-shows and reschedules wasting technician capacity in a market where field engineers are scarce.",
        outcome: "Appointments booked from live technician availability with automated confirmation and reminders and one-step rescheduling, protecting field utilisation.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Field-dispatch / scheduling system", "Subscriber account", "Work-order records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Plan-change and retention conversations",
        friction: "Downgrade and cancellation calls are handled by whichever operator answers, with inconsistent offers and no structured capture of the actual reason for leaving.",
        outcome: "Plan questions answered consistently from approved product data, churn reasons captured structurally, and retention offers applied strictly within the approved matrix with human escalation for exceptions.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Product / tariff data", "Subscriber account (CRM/BSS)", "Offer and discount matrix"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A subscriber member web service and app for billing and service management",
        "Customer centres handling technical support, billing and retention",
        "A field-technician organisation performing installations and in-home repairs",
        "Set-top box and app-based service management for TV and broadband customers",
      ],
      gaps: [
        "Technical triage cannot use live diagnostics conversationally, so avoidable visits are still booked",
        "Support is unavailable or degraded outside main centre hours for a household-service product",
        "Retention offers depend on operator discretion rather than a governed matrix",
        "No structured, analysable record of why subscribers actually downgrade or leave",
      ],
    },
    risks: [
      "Telecommunications customer data is subject to APPI and sector-specific confidentiality expectations, so account access scope must be tightly controlled.",
      "Retention offers have direct revenue consequences and must be constrained to an approved matrix with auditable application.",
      "Parent-company technology governance may constrain vendor selection, so alignment has to be checked before a deployment decision is assumed.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions for a large multi-service operator; JCOM's actual contact volumes, technical-versus-billing mix and cost per contact must be validated with its customer-operations organisation.",
    },
    pilotScope:
      "A ten-week pilot automating broadband and TV technical triage with live diagnostics plus technician-visit scheduling for one franchise area, measuring avoided visits and first-contact resolution.",
    expansion: [
      "Extend triage and scheduling across all franchise areas",
      "Add plan-change and governed retention conversations with structured churn-reason capture",
      "Introduce proactive outbound contact on detected line and device faults before the subscriber calls",
    ],
    stakeholders: [
      "Executive Officer, Customer Operations",
      "Head of Technical Support Centre",
      "Head of Field Service / Installation operations",
      "General Manager, IT / Systems",
      "Head of Retention and Subscriber Marketing",
    ],
    discovery: [
      "What share of technical calls currently end in a technician visit, and what proportion of those visits find no fault?",
      "What live diagnostic signals are available to an agent at the moment a subscriber calls?",
      "How are retention offers governed today, and is the discount matrix systematised?",
      "Does parent-company technology governance constrain vendor choice for customer-facing systems?",
    ],
    flowTemplate: "appointments",
    scenario: "A subscriber reports a frozen TV picture at 22:30; the agent reads live device signals, restores the service remotely, and cancels the visit that would otherwise have been booked.",
  },

  "sky-perfect-jsat": {
    operatingContext:
      "SKY Perfect JSAT operates both a satellite communications business serving broadcasters, enterprises, maritime and government customers, and the consumer SKY PerfecTV! pay-satellite platform in Japan. The consumer side is the communications-heavy half: subscribers pay for channel packs and premium sports and entertainment content, manage contracts through a member service, and contact the company about channel changes, equipment and reception problems, billing, and cancellation. The subscriber base skews older and long-tenured, so the phone remains the dominant channel for anything contractual. Structurally the pay-satellite market is in decline against streaming, which means per-subscriber servicing cost rises as the base shrinks and makes both efficient servicing and effective save conversations existential rather than optional.",
    strategicPressure: [
      { text: "SKY Perfect JSAT combines a satellite communications business with the consumer SKY PerfecTV! pay-broadcasting platform in Japan.", kind: "verified" },
      { text: "Japanese pay-satellite broadcasting faces structural subscriber decline as streaming services take share of entertainment spend.", kind: "verified" },
      { text: "A shrinking subscriber base spreads fixed contact-centre cost over fewer accounts, so cost per servicing contact rises even as total volume falls.", kind: "inference" },
      { text: "Save conversations at cancellation are the highest-value contacts in the business, yet they are handled by whoever answers with no systematic offer governance.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "The consumer platform runs on vendor-supplied subscriber-management and CRM systems with outsourced contact operations; internal engineering is satellite and network engineering, not conversational software. Declining consumer economics rule out any platform build — buy-led.",
    whyNotBuild:
      "Building speech, keigo voice, telephony and subscriber-system integration for a shrinking consumer base is an obviously bad investment. Renting elastic capacity that shrinks with the base is exactly the right commercial shape for a business in managed decline.",
    workflows: [
      {
        name: "Subscription and channel-pack change servicing",
        friction: "Subscribers call to add, drop or change channel packs around sports seasons and content launches, and operators walk through options and pricing manually.",
        outcome: "Pack changes executed conversationally with pricing and effective dates explained from approved product data, at any hour and without queueing.",
        channels: ["Voice", "Web", "App"],
        systems: ["Subscriber management system", "Product / pack catalogue", "Billing system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Equipment and reception troubleshooting",
        friction: "Reception problems after weather, dish misalignment, receiver faults and card errors are diagnosed over the phone through scripted checks with an older subscriber base that finds them hard to follow.",
        outcome: "Guided troubleshooting at a pace the subscriber sets, with device and signal status where available, resolving simple cases and dispatching only genuine faults.",
        channels: ["Voice", "Web"],
        systems: ["Subscriber management system", "Device / signal status data", "Field-dispatch records"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Cancellation-save and retention conversations",
        friction: "Cancellation calls arrive with the decision already made; the offer given depends on the operator and no structured record of the reason survives the call.",
        outcome: "Reasons captured structurally, retention offers applied strictly within an approved matrix, high-value saves routed to specialists with full context, and save economics measured properly.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Subscriber management system", "Offer and discount matrix", "CRM / churn records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A subscriber member web service for contract and pack management",
        "A customer centre handling subscription, technical and cancellation contacts",
        "Set-top box and card-based entitlement management for the satellite platform",
        "Outbound campaign capability for content promotion and renewal",
      ],
      gaps: [
        "Contract changes and cancellations are limited to staffed hours for a phone-first subscriber base",
        "Retention offers are not governed by a consistent, auditable matrix",
        "No structured churn-reason data to feed content and pricing decisions",
        "Reception troubleshooting cannot draw on device status conversationally",
      ],
    },
    risks: [
      "Retention offers directly affect revenue and must be bounded by an approved matrix with auditable application.",
      "APPI applies to subscriber and viewing-related data, and viewing history in particular requires careful handling and minimal exposure.",
      "In a declining business, contract terms with outsourced contact partners may include minimum volumes that limit realisable savings.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions for a declining consumer pay-TV base; actual contact volumes, save rates and outsourced cost per contact must be validated with the consumer business in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling channel-pack changes and subscription servicing in Japanese with a governed cancellation-save flow that captures structured churn reasons and escalates high-value accounts.",
    expansion: [
      "Add guided reception and equipment troubleshooting with device-status grounding",
      "Introduce proactive outbound renewal and win-back outreach within consent rules",
      "Extend governed offer application across all retention channels with measured save economics",
    ],
    stakeholders: [
      "Executive Officer, Media / Consumer Business",
      "Head of Customer Centre operations",
      "Head of Subscriber Marketing and Retention",
      "General Manager, IT / Systems",
      "Head of Product and Pack Planning",
    ],
    discovery: [
      "How many cancellation contacts are received monthly and what is the current save rate?",
      "Is there an approved retention-offer matrix, and is it enforced systematically?",
      "What device and signal status data can an agent access during a reception call?",
      "What minimum-volume commitments exist with outsourced contact partners?",
    ],
    flowTemplate: "retention",
    scenario: "A long-tenured subscriber calls to cancel after a sports season ends; the agent captures the real reason, applies an approved pack downgrade instead, and logs the save for measurement.",
  },

  "sg-holdings": {
    operatingContext:
      "SG Holdings is the parent of Sagawa Express, Japan's second-largest parcel delivery network, moving business-to-business freight and a very large volume of e-commerce parcels to households through a nationwide branch and driver network. Its consumer-facing workload is dominated by delivery coordination: absence notices, redelivery requests, delivery-window changes, address corrections and pickup bookings, all of which are essentially appointment negotiations conducted with people who are not at home. The company offers app and web redelivery booking and works with LINE-based notification, yet a substantial share of coordination still arrives by phone, including through automated redelivery lines that handle only the simplest cases. Since the 2024 application of overtime caps to truck drivers, every minute of driver time spent on failed deliveries and rescheduling has become the industry's defining cost problem.",
    strategicPressure: [
      { text: "Japanese truck drivers came under work-hour overtime caps from April 2024, the change universally referred to as the 2024 problem, which constrains the delivery hours available to carriers like Sagawa.", kind: "verified" },
      { text: "Sagawa Express operates one of the two dominant nationwide parcel networks in Japan, with e-commerce growth driving household delivery volume.", kind: "verified" },
      { text: "Failed first deliveries are the single largest source of wasted driver time, so redelivery coordination is where labour-hour savings are most concentrated.", kind: "inference" },
      { text: "Older recipients and non-app users continue to arrange redelivery by phone, so digital redelivery tools alone do not remove the voice workload.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "SG Holdings invests in network capacity, terminals, vehicles and logistics systems supplied by vendors and group IT; there is no software product organisation building conversational AI. Contact operations run through branch offices and centres, partly outsourced — a buy-led profile where the value is measured in driver hours rather than agent minutes.",
    whyNotBuild:
      "Sagawa would need Japanese speech robust to address and apartment-name dictation, keigo-grade voice, telephony fronting branch and centre estates, and real-time integration into delivery and routing systems so that a rescheduled slot is actually feasible for the driver. That is a specialised platform, and the group's capital is committed to physical network capacity.",
    workflows: [
      {
        name: "Redelivery booking and delivery-window changes",
        friction: "Recipients call after an absence notice; simple automated lines handle only basic cases and anything unusual — apartment access, changed address, specific time bands — falls to a human, while drivers wait on schedules that are still shifting.",
        outcome: "Redelivery and window changes negotiated conversationally against live route feasibility, written into the delivery system, and confirmed to both recipient and driver.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Delivery / tracking system", "Route and driver scheduling", "Address / supply-point data"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Pickup request booking for shippers and consumers",
        friction: "Pickup bookings arrive at branches by phone from SME shippers and individuals, and branch staff manually capture details and coordinate with driver routes.",
        outcome: "Pickup requests captured conversationally with size, timing and address details validated and routed into scheduling, freeing branch staff from telephone coordination.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Pickup / dispatch scheduling", "Customer and shipper records", "Route planning"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Proactive delivery-exception outreach",
        friction: "When a delivery is at risk — weather, address problem, repeated absence — the recipient learns from a paper notice, and the subsequent contact is inbound, late and manual.",
        outcome: "Recipients contacted proactively before a failed attempt with options to change slot, address or pickup location, converting failed deliveries into planned ones.",
        channels: ["LINE", "Voice", "SMS"],
        systems: ["Delivery / tracking system", "Route scheduling", "Consent and contact preferences"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Web and app redelivery booking with tracking",
        "LINE-based delivery notification and redelivery arrangement for registered users",
        "Automated telephone redelivery lines handling simple cases",
        "Branch offices and centres handling shipper and consumer telephone coordination",
      ],
      gaps: [
        "Complex redelivery cases — access instructions, address changes, narrow time bands — still require a human",
        "Rescheduling is not checked against live route feasibility, so promised slots are not always deliverable",
        "Proactive contact before a failed attempt is limited rather than systematic",
        "SME shippers phoning branches get coordination handled manually with no structured capture",
      ],
    },
    risks: [
      "Delivery data includes home addresses and access details, so APPI handling and recipient authentication must be designed before any address change can be accepted conversationally.",
      "Driver work-hour compliance means a rescheduled slot must be validated against legal working time, not just route capacity.",
      "Branch-level operational autonomy means a national rollout requires strong central sponsorship or it will vary branch by branch.",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 3.5,
      automationRate: 0.65,
      basis: "Seller assumptions for a national parcel network where the true value is driver hours recovered rather than agent minutes; redelivery rates, call volumes and cost per failed delivery must be quantified in discovery.",
    },
    pilotScope:
      "A ten-week pilot handling redelivery booking and delivery-window changes by voice and LINE for one metropolitan branch cluster, validating slots against live route feasibility and measuring failed-delivery reduction.",
    expansion: [
      "Add proactive pre-failure outreach to recipients with slot and pickup-location options",
      "Extend to SME shipper pickup booking and status enquiries at branch level",
      "Roll nationally with driver-hour compliance checks built into slot confirmation",
    ],
    stakeholders: [
      "Executive Officer, Delivery Business (Sagawa Express)",
      "Head of Customer Service / Contact Centre operations",
      "General Manager, Logistics Systems / IT",
      "Head of Branch Operations for a pilot region",
      "Head of Driver Operations and work-hour compliance",
    ],
    discovery: [
      "What is the current first-delivery failure rate and how many redelivery contacts does it generate monthly?",
      "What share of redelivery arrangements still arrive by phone versus app and LINE?",
      "Can the delivery system validate a proposed slot against live route and driver-hour feasibility?",
      "How much branch-office staff time goes to telephone coordination with shippers?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A recipient who missed two attempts is contacted on LINE before the third; they switch to an evening slot that the routing system confirms is feasible within the driver's remaining legal hours.",
  },

  "seino-holdings": {
    operatingContext:
      "Seino Holdings runs the Kangaroo-brand less-than-truckload network from its Ogaki base, moving business freight nationwide through a dense branch and terminal structure, alongside logistics solutions, forwarding and a set of diversified businesses including automobile sales. Its customers are overwhelmingly business shippers, and a large share are small and medium enterprises that do not use shipper portals: they phone the local branch to arrange a pickup, ask where a shipment is, request a delivery-time change or ask for a freight quote. That means the branch office is effectively a distributed contact centre staffed by people who also handle dock, documentation and dispatch work. The 2024 driver-hour caps squeeze both the driver network and the office staff who coordinate around it, making telephone coordination a direct constraint on throughput.",
    strategicPressure: [
      { text: "Seino operates the Kangaroo LTL network serving business shippers nationwide through a branch and terminal structure rather than a centralised consumer contact model.", kind: "verified" },
      { text: "The April 2024 driver overtime caps have forced Japanese freight carriers to reorganise schedules and reduce non-driving time, increasing coordination pressure.", kind: "verified" },
      { text: "SME shippers without portal adoption default to phoning their local branch, so coordination labour is spread across hundreds of small offices and invisible in any central metric.", kind: "inference" },
      { text: "Branch staff handling phones are the same people handling dock and documentation work, so telephone interruptions have a direct operational cost beyond the call itself.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A traditional freight group whose systems are vendor-delivered and whose investment goes to terminals, vehicles and network design. There is no software product organisation, and coordination technology is bought — a straightforward buy-led case where the buyer is operations rather than IT.",
    whyNotBuild:
      "Seino would need Japanese speech that copes with company names, product descriptions and addresses dictated by shippers, telephony fronting hundreds of branch numbers, and integration into pickup scheduling, tracking and quoting systems. Nothing in a freight carrier's capability set points that way.",
    workflows: [
      {
        name: "Pickup-request booking from SME shippers",
        friction: "Shippers phone the branch to book a pickup, describing piece count, size and timing; branch staff capture details manually between dock duties and coordinate with driver routes.",
        outcome: "Pickup requests captured conversationally with structured piece, size and timing detail routed into scheduling, so branch staff are interrupted only by exceptions.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Pickup / dispatch scheduling", "Shipper account records", "Route planning"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Shipment-status and delivery-time enquiries",
        friction: "Where is my freight is the most common call at every branch, answered by a person reading the tracking system to a shipper who could have been told automatically.",
        outcome: "Status and expected delivery answered instantly from tracking data with shipper authentication, and proactive notification for exceptions replacing repeat status calls.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Tracking system", "Shipper account records", "Terminal / route status"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Freight quote and service-condition enquiries",
        friction: "Quote requests for non-standard freight arrive by phone and require staff to check size, weight and destination rules, with answers varying by branch and by person.",
        outcome: "Standard quotes and service conditions answered consistently from the rate structure, with non-standard cases routed to sales with structured details already captured.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Rate and service-condition data", "Shipper account records", "Sales CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A shipper web portal with tracking and shipping-instruction functions",
        "Branch offices acting as local contact points for pickup and enquiry handling",
        "Nationwide terminal and tracking infrastructure across the Kangaroo network",
        "Account-based relationships with corporate and SME shippers",
      ],
      gaps: [
        "Pickup booking cannot be completed outside branch office hours",
        "Status enquiries consume staff time even though the data is fully available",
        "Quote answers are inconsistent between branches and people",
        "No proactive notification when a shipment is delayed, so shippers call to find out",
      ],
    },
    risks: [
      "Shipper freight data is commercially sensitive, so authentication of who is calling about which shipment must be robust before any status is disclosed.",
      "Pickup commitments must respect driver working-hour limits, so accepted bookings need feasibility validation rather than simple capture.",
      "Branch-level autonomy means a central deployment must be operationally sponsored or branches will keep answering their own numbers.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4.0,
      automationRate: 0.6,
      basis: "Seller assumptions aggregating branch-level telephone traffic that is unlikely to be centrally measured today; a branch-level call audit is the first discovery task.",
    },
    pilotScope:
      "An eight-week pilot handling pickup booking and shipment-status enquiries for one regional branch cluster in Japanese, with authenticated shipper access and structured booking capture into scheduling.",
    expansion: [
      "Add proactive delay notification to shippers to suppress status calls",
      "Extend to standard freight quoting with sales handoff for non-standard cases",
      "Roll nationally across branches with a single shipper-facing number",
    ],
    stakeholders: [
      "Executive Officer, Transportation Business",
      "Head of Branch and Terminal Operations",
      "General Manager, Information Systems",
      "Head of Sales for SME shipper accounts",
      "Head of Driver Operations and compliance",
    ],
    discovery: [
      "How many calls does a typical branch receive daily, and what is the intent breakdown?",
      "What share of SME shippers use the web portal versus phoning the branch?",
      "Can the scheduling system validate a pickup commitment against driver-hour availability?",
      "Who owns the decision to consolidate branch telephone traffic behind a single number?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An SME shipper in Gifu calls at 07:30 to add three pallets to today's pickup; the agent captures the details, confirms feasibility against the route and the branch dock staff are never interrupted.",
  },

  "fukuyama-transporting": {
    operatingContext:
      "Fukuyama Transporting is a major business-to-business freight carrier operating a nationwide LTL network out of its Hiroshima base, serving manufacturers, wholesalers and SME shippers with a branch-and-terminal structure similar to its LTL peers. Its traffic is commercial rather than consumer, so the phone calls it receives are about pickups, redeliveries to business addresses, delivery-time coordination with receiving docks, and shipment status. As with the rest of the sector, branch offices act as the customer interface, and the same clerks handle documentation, dock coordination and telephone traffic. The company has a traditional, operationally conservative culture with vendor-led IT, and the 2024 driver-hour rules apply to it with full force, making coordination labour and delivery-window accuracy the binding constraints on network throughput.",
    strategicPressure: [
      { text: "Fukuyama Transporting operates a nationwide LTL freight network serving business shippers through a branch and terminal structure.", kind: "verified" },
      { text: "The April 2024 driver overtime caps apply across Japanese trucking and have forced carriers to reduce non-driving time and rework schedules.", kind: "verified" },
      { text: "Business deliveries fail when receiving docks are closed or occupied, so delivery-window coordination is a distinct and costly workflow separate from consumer redelivery.", kind: "inference" },
      { text: "Clerical staff shortages at regional branches compound the driver shortage, since the coordination work cannot simply be reassigned to fewer people.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A conservative, family-rooted transport company with vendor-delivered IT and no software organisation. Investment goes into terminals, vehicles and network operations, and coordination technology is procured — buy-led, with operations rather than IT as the economic buyer.",
    whyNotBuild:
      "Building Japanese speech that handles company names, dock instructions and freight descriptions, telephony fronting a branch estate, and integration into pickup, tracking and scheduling systems is far outside the capability of a regional freight operator. The bounded pickup-and-status workflow is exactly what a packaged deployment delivers immediately.",
    workflows: [
      {
        name: "Pickup booking and dock-window coordination",
        friction: "Shippers phone branches to arrange pickups and to negotiate dock windows; staff capture the details manually and reconcile them against routes that are already tight under driver-hour limits.",
        outcome: "Pickup and dock-window requests captured conversationally with structured detail and validated against route feasibility before commitment.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Pickup / dispatch scheduling", "Route planning", "Shipper account records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Shipment-status and delivery-confirmation enquiries",
        friction: "Receiving businesses and shippers call branches for status and proof of delivery, and clerks read tracking screens aloud repeatedly through the day.",
        outcome: "Authenticated status and delivery-confirmation answers delivered instantly from tracking data, with proactive exception notification cutting repeat calls.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Tracking system", "Proof-of-delivery records", "Shipper account records"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Redelivery coordination for business addresses",
        friction: "When a business address is closed or the dock is unavailable, rescheduling requires calls in both directions between branch, driver and receiver, often across days.",
        outcome: "Redelivery negotiated conversationally with the receiving business against live route feasibility, with the outcome written back and confirmed to the driver.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Delivery / tracking system", "Route and driver scheduling", "Receiver contact records"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A shipper web service with tracking and shipping-instruction entry",
        "Branch offices acting as local telephone contact points",
        "Nationwide terminal network with shipment tracking",
        "Account relationships with manufacturing and wholesale shippers",
      ],
      gaps: [
        "Pickup and redelivery coordination stops when the branch office closes",
        "Status enquiries consume clerical time despite being fully answerable from data",
        "Rescheduled windows are not validated against driver-hour feasibility at the point of promise",
        "No proactive notification to receivers when a delivery window will be missed",
      ],
    },
    risks: [
      "Shipment data is commercially sensitive, so caller authentication must be solid before any status or delivery detail is disclosed.",
      "Delivery commitments must be checked against driver working-hour limits to avoid creating compliance exposure.",
      "A conservative operating culture means the pilot must be branch-sponsored and visibly reversible, or it will not get operational cooperation.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 4.0,
      automationRate: 0.6,
      basis: "Seller assumptions aggregating branch telephone traffic that is probably not centrally measured; a branch call audit is the necessary first step in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling pickup booking and shipment-status enquiries for one regional branch cluster in Japanese, with authenticated shipper access and scheduling write-back.",
    expansion: [
      "Add business-address redelivery coordination with route-feasibility validation",
      "Introduce proactive missed-window notification to receiving businesses",
      "Roll nationally behind a single shipper-facing number",
    ],
    stakeholders: [
      "Executive Officer, Transportation Business",
      "Head of Branch and Terminal Operations",
      "General Manager, Information Systems",
      "Head of Sales for shipper accounts",
      "Head of Safety and driver work-hour compliance",
    ],
    discovery: [
      "What is the daily call volume at a representative branch and how is it split by intent?",
      "How often are business deliveries rescheduled because the dock was unavailable?",
      "Does the scheduling system expose route feasibility at the moment a window is promised?",
      "Which regional cluster would be operationally willing to host a pilot?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A receiving warehouse in Okayama calls to move tomorrow's delivery to an afternoon dock window; the agent checks route feasibility, confirms the change and notifies the driver without a chain of branch calls.",
  },

  "nx-holdings": {
    operatingContext:
      "NX Holdings, the parent of Nippon Express, is Japan's largest logistics group, spanning global air and ocean forwarding, domestic freight and warehousing, heavy-haulage and project logistics, and a large consumer moving-services business. The moving business is the communications-heavy part: households request quotes, receive an on-site or remote survey, negotiate a moving date, coordinate packing and delivery, and handle post-move issues — a sequence of appointments and confirmations concentrated overwhelmingly in the March-April relocation season when Japanese companies and schools change year. Customers reach it through a web quote form, telephone quote lines, branch offices and sales representatives. On the forwarding and freight side, corporate customers phone branch and operations desks for shipment status, booking and documentation questions.",
    strategicPressure: [
      { text: "NX Holdings is Japan's largest logistics group and operates a major consumer moving-services business alongside global forwarding and domestic freight.", kind: "verified" },
      { text: "Japanese relocations concentrate heavily in March and April because of the fiscal and school year change, producing an extreme seasonal peak in moving demand.", kind: "verified" },
      { text: "The moving business has been capacity-constrained in peak season across the industry, with carriers turning away demand because crews and vehicles cannot be staffed.", kind: "inference" },
      { text: "Quote and survey scheduling is where demand is lost: a household that cannot reach a company at the moment it decides simply calls a competitor.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "NX invests heavily in logistics systems, warehouse automation and forwarding platforms, all delivered with vendors and systems integrators; there is no consumer-facing conversational-AI product organisation. The moving business in particular is a service operation with thin margins and seasonal economics — buy-led, with speed-to-lead as the commercial driver.",
    whyNotBuild:
      "The requirement is Japanese speech that handles addresses, building types, floor counts and item lists, keigo-grade voice for household customers, telephony fronting branch and centre estates, and integration into quoting, survey scheduling and crew planning. NX's technology capability is in freight systems, not in conversational sales and scheduling.",
    workflows: [
      {
        name: "Moving quote intake and survey-appointment scheduling",
        friction: "Peak-season quote calls overflow, web forms wait for a callback that may take a day, and by then the household has booked a competitor; survey appointments are then scheduled manually against crew availability.",
        outcome: "Quote enquiries captured conversationally within minutes at any hour with property and volume detail structured, and survey appointments booked directly onto surveyor calendars.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Quotation system", "Survey / crew scheduling", "Sales CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Moving-day coordination and confirmation calls",
        friction: "Confirming arrival windows, parking arrangements, elevator reservations and packing details requires repeated outbound calls to customers who are working, and missed contact creates day-of problems.",
        outcome: "Automated confirmation and detail-gathering outreach on the customer's channel with structured capture of access constraints, reducing day-of surprises and crew idle time.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Job / crew scheduling", "Customer job records", "Route planning"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Corporate shipment-status and booking enquiries",
        friction: "Forwarding and domestic freight customers phone branch and operations desks for shipment status, booking confirmations and documentation questions, occupying specialist staff with routine lookups.",
        outcome: "Authenticated status and booking answers delivered from operational systems instantly, with specialists reserved for exceptions and customs or documentation complexity.",
        channels: ["Voice", "Email", "Web"],
        systems: ["Forwarding / tracking systems", "Booking records", "Customer account data"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Web quote request forms and telephone quote lines for the moving business",
        "Branch offices and sales representatives handling household and corporate customers",
        "Shipment tracking and booking systems for forwarding and domestic freight customers",
        "Crew and vehicle scheduling operations for moving jobs",
      ],
      gaps: [
        "Quote enquiries outside business hours wait for a callback and are frequently lost",
        "Survey scheduling is manual and disconnected from live surveyor availability",
        "Moving-day detail gathering depends on reaching customers by phone during work hours",
        "Corporate status enquiries consume operations-desk time despite being answerable from systems",
      ],
    },
    risks: [
      "Household moving data includes addresses, building access and occupancy details that require careful APPI handling and access control.",
      "Quotes are commercially binding in effect; the agent must produce indicative pricing strictly from configured rules with confirmation reserved to the survey.",
      "Peak-season crew capacity is the real constraint, so automation must not book demand the operation cannot serve — feasibility checks are part of scope.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions across moving and freight contact; the moving business's peak-season enquiry volume, callback delay and lost-enquiry rate must be measured in discovery because the case is revenue capture as much as cost.",
    },
    pilotScope:
      "A ten-week pilot capturing moving quote enquiries and booking survey appointments 24 hours a day in Japanese for one metropolitan region ahead of the spring peak, measured on enquiries captured outside business hours and conversion to survey.",
    expansion: [
      "Add moving-day confirmation and access-detail gathering outreach",
      "Extend nationally across branches ahead of the following peak season",
      "Introduce corporate shipment-status and booking enquiry handling for freight customers",
    ],
    stakeholders: [
      "Executive Officer, Domestic Logistics / Moving Services",
      "Head of Moving Business sales operations",
      "General Manager, Digital / Information Systems",
      "Head of Branch Operations in a pilot region",
      "Head of Customer Service for corporate freight",
    ],
    discovery: [
      "How many moving quote enquiries arrive monthly at peak, and how many go unanswered or wait for a callback?",
      "What is the conversion rate from enquiry to survey, and how does it vary with response speed?",
      "Can the scheduling system expose live surveyor and crew availability to an external booking flow?",
      "How much operations-desk time on the freight side goes to routine status lookups?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A family decides on a March move at 23:00, calls NX, gets an indicative quote and a survey appointment booked for Saturday morning before any competitor opens.",
  },

  "benesse-holdings": {
    operatingContext:
      "Benesse Holdings runs two very different businesses that happen to share the same operational shape. Its education arm delivers correspondence-based learning at national scale — Shinkenzemi for school-age children and Kodomo Challenge for preschoolers — sold to parents on subscription, with enrolment, grade-transition, material-delivery and cancellation contacts concentrated around the school year. Its care arm is one of Japan's largest operators of paid nursing homes, where family enquiries, facility tours and admission consultations are the sales funnel and post-admission family communication is continuous. Both reach customers through call centres, direct mail, member web services and increasingly LINE, and both deal with emotionally weighted conversations — a parent cancelling a child's course, a family choosing a home for a parent — where tone matters more than speed.",
    strategicPressure: [
      { text: "Benesse operates both a national correspondence-education business and one of Japan's largest paid nursing-home operations, giving it two communications-intensive consumer businesses under one roof.", kind: "verified" },
      { text: "Japan's declining birth rate structurally shrinks the addressable base for school-age correspondence education, making retention and cancellation-save conversations commercially critical.", kind: "verified" },
      { text: "Enrolment and grade-transition periods create contact spikes several times baseline that a fixed call-centre roster cannot absorb without outsourced surge capacity.", kind: "inference" },
      { text: "Nursing-home enquiry response speed is a direct determinant of occupancy, since families comparing facilities typically contact several and move quickly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Benesse's transformation programme under private-equity ownership has leaned on external technology partners and packaged capability rather than internal platform builds, and its contact operations are substantially outsourced. Education and care are its competencies; conversational infrastructure is not, and there is no public evidence of an internal speech capability.",
    whyNotBuild:
      "Benesse would need Japanese speech, keigo-grade voice trusted enough for parents cancelling a subscription and families discussing elderly care, telephony into outsourced centre estates for two separate businesses, integration into subscription, delivery and care-facility systems, and a tone-evaluation regime. That is a product, and Benesse's transformation agenda is about focus, not platform building.",
    workflows: [
      {
        name: "Enrolment-season enquiry and subscription-change handling",
        friction: "Enrolment, grade transition, course changes, address changes and material re-sends spike around the school year, overwhelming centres and producing waits at exactly the moment a parent is deciding whether to continue.",
        outcome: "Subscription and course changes handled conversationally at any hour with delivery and billing effects explained, absorbing seasonal spikes without surge staffing.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Subscription management system", "Delivery / fulfilment records", "Billing and payment"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cancellation and retention conversations with parents",
        friction: "Cancellation calls are handled by whoever answers, retention offers vary, and the real reason a family is leaving is rarely captured in a form that can improve the product.",
        outcome: "Reasons captured structurally, approved retention options offered consistently, and genuinely dissatisfied families routed to specialists with the conversation summarised.",
        channels: ["Voice", "LINE"],
        systems: ["Subscription management system", "Offer / retention matrix", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Nursing-home enquiry qualification and tour booking",
        friction: "Families researching care homes call several operators; Benesse's enquiry may wait for a consultant, and a slow response loses an admission worth many months of revenue.",
        outcome: "Enquiries qualified conversationally within minutes with care level, budget, area and timing captured, and facility tours booked directly onto consultant calendars.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Facility availability records", "Care-consultant calendars", "Sales CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "National call-centre operations for the education subscription business, substantially outsourced",
        "Member web services and LINE channels for parents and guardians",
        "A care-business enquiry desk with facility consultants and tour arrangements",
        "Direct-mail and delivery infrastructure tied to subscription records",
      ],
      gaps: [
        "Enrolment-season spikes are met by queueing rather than elastic capacity",
        "Cancellation conversations are inconsistent and produce no structured reason data",
        "Care enquiries arriving after hours wait for a callback while families contact competitors",
        "No shared customer view between education and care despite overlapping family lifecycles",
      ],
    },
    risks: [
      "Education records concern children, so APPI handling, guardian authentication and data minimisation must be designed conservatively.",
      "Nursing-care enquiries touch health and care-need information that is sensitive; the agent must capture only what is needed and escalate clinical questions to qualified staff.",
      "Retention offers in the education business have revenue consequences and must be bounded by an approved matrix.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions spanning two separately operated businesses; education-season contact volumes and care-enquiry volumes must be measured independently in discovery.",
    },
    pilotScope:
      "A ten-week pilot handling enrolment-season subscription and course-change contacts for the education business in Japanese, with structured cancellation-reason capture and specialist escalation.",
    expansion: [
      "Add governed retention conversations with approved offer application",
      "Extend to nursing-home enquiry qualification and tour booking with consultant scheduling",
      "Introduce proactive outbound outreach for grade transitions and payment issues",
    ],
    stakeholders: [
      "Executive Officer, Education Business",
      "Head of Customer Centre operations (education)",
      "Executive Officer, Nursing Care and Childcare Business",
      "Head of Care-home Sales and Admissions",
      "General Manager, Digital / IT",
    ],
    discovery: [
      "What is the enrolment-season contact peak relative to baseline, and how is it currently staffed?",
      "How are cancellation reasons captured today and are they analysable?",
      "How quickly is a nursing-home enquiry contacted after it arrives, and what is the tour-booking conversion rate?",
      "Are the education and care contact operations run by the same outsourcing partners?",
    ],
    flowTemplate: "admissions",
    scenario: "A parent calls at 21:00 in March to change a Shinkenzemi course level and asks about delivery timing; the change is made, the billing effect explained, and the cancellation they were considering never happens.",
  },

  "nichii-holdings": {
    operatingContext:
      "Nichii Holdings, operating through Nichii Gakkan, is one of Japan's largest providers of nursing-care services and medical-office support, running home-visit care, day services, care facilities and a large business placing trained clerical staff into hospital and clinic reception and billing functions. Its operating model is almost entirely service labour: care workers visiting homes on schedules, staff rostered across facilities, and a continuous recruitment machine feeding a sector with the highest turnover and tightest supply in the country. Communications load therefore runs in three directions — families and care recipients coordinating visits and asking questions, care staff coordinating shifts and schedule changes, and a constant inbound flow of job applicants who must be screened, interviewed and onboarded. Contact today runs through branch offices, care-manager relationships, a recruitment operation and telephone coordination that consumes managerial time.",
    strategicPressure: [
      { text: "Nichii Gakkan is one of Japan's largest nursing-care providers and also supplies clerical staffing to medical institutions, so it is a labour business at its core.", kind: "verified" },
      { text: "Japanese nursing care faces the country's most acute labour shortage, with care-worker vacancy ratios persistently among the highest of any occupation.", kind: "verified" },
      { text: "Care-sector revenue is largely determined by the public long-term care insurance fee schedule, so margin improvement has to come from labour productivity rather than pricing.", kind: "verified" },
      { text: "Every hour a care manager spends on scheduling phone calls or applicant screening is an hour not spent on care coordination that generates billable service.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "A pure services operator whose systems are vendor-supplied care-management and HR platforms, with no software product organisation. Fee-schedule-capped economics make platform investment implausible while making labour offload directly margin-relevant — buy-led in the strongest sense.",
    whyNotBuild:
      "Nichii would need Japanese speech tolerant of elderly speakers and care-domain vocabulary, keigo-grade voice appropriate for families discussing a relative's care, telephony across hundreds of branches, and integration into care scheduling and applicant-tracking systems. None of that is available to a care operator, and the fee schedule would never fund it.",
    workflows: [
      {
        name: "Caregiver-recruitment screening and interview scheduling",
        friction: "Applicants for care roles apply across job platforms and are called back by branch managers during working hours; slow response loses candidates to competitors in a market where applicants have many options.",
        outcome: "Applicants contacted within minutes on their channel, screened against a structured rubric for qualifications, availability and area, and booked directly into interview slots.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Applicant tracking system", "Branch manager calendars", "Qualification records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Home-visit schedule coordination and change handling",
        friction: "Visit times change constantly because of hospital appointments, family availability and staff absence, and each change is negotiated by phone between families, care managers and staff.",
        outcome: "Schedule change requests captured and matched against available staff, confirmed to family and caregiver, with care managers involved only where clinical judgement is required.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Care scheduling system", "Staff rostering", "Care-recipient records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Family enquiry and service-explanation handling",
        friction: "Families call branches with questions about service content, long-term care insurance coverage, billing and how to add services, occupying care managers who are also coordinating visits.",
        outcome: "Service, coverage and billing questions answered consistently from approved information, with care-need and clinical questions routed to qualified staff with context.",
        channels: ["Voice", "LINE"],
        systems: ["Care-recipient records", "Billing / insurance claim records", "Service catalogue"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch-based care operations with care managers as the family relationship point",
        "A national recruitment operation advertising across job platforms",
        "Care scheduling and long-term care insurance billing systems",
        "Training and qualification programmes feeding its own staffing pipeline",
      ],
      gaps: [
        "Applicants are not contacted quickly enough in a market where they hold the power",
        "Visit-schedule changes consume care-manager hours that should go to care coordination",
        "Family questions have no channel outside branch hours",
        "No structured capture of why applicants drop out of the recruitment funnel",
      ],
    },
    risks: [
      "Care-recipient information includes health and care-need data that is sensitive under APPI, so retrieval scope must be minimal and clinical questions must always escalate.",
      "Long-term care insurance rules govern what services can be provided and billed, so the agent must never imply eligibility that a care manager has not assessed.",
      "Recruitment conversations touch employment law expectations, so screening criteria must be documented and non-discriminatory.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 5.0,
      automationRate: 0.5,
      basis: "Seller assumptions combining recruitment, scheduling and family contact; applicant volumes and care-manager phone time must be measured in discovery because managerial hours are the real currency here.",
    },
    pilotScope:
      "An eight-week pilot contacting and screening care-worker applicants within minutes of application across a defined regional cluster, booking interviews onto branch-manager calendars and measuring applicant-to-interview conversion.",
    expansion: [
      "Extend to home-visit schedule change coordination with staff matching",
      "Add family service and billing enquiry handling with clinical escalation",
      "Introduce proactive outbound retention contact with newly hired care staff during the early-attrition window",
    ],
    stakeholders: [
      "Executive Officer, Nursing Care Business",
      "Head of Human Resources / Recruitment",
      "Head of Branch Operations for a pilot region",
      "General Manager, Information Systems",
      "Head of Care Quality and Compliance",
    ],
    discovery: [
      "How many care-worker applications are received monthly and what is the current time to first contact?",
      "How many hours a week does a branch manager spend on scheduling calls?",
      "What proportion of applicants drop out before interview, and is the reason recorded?",
      "Which systems hold care schedules and staff rosters, and can they be updated externally?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A care-worker applicant submits an application at 22:00; within two minutes the agent confirms their qualification and area, and books an interview at the nearest Nichii branch for the next morning.",
  },

  "ain-holdings": {
    operatingContext:
      "Ain Holdings is Japan's largest dispensing-pharmacy chain, operating well over a thousand Ain Pharmacy locations, most of them positioned adjacent to hospitals and clinics to receive prescriptions from those institutions, alongside a cosmetics retail business. Its economics are set by the national dispensing fee schedule, which increasingly rewards pharmacist-led patient follow-up — checking on medication adherence and side effects after dispensing — and by pharmacist labour, which is the scarcest and most expensive input in the business. Patients are disproportionately elderly with chronic conditions and repeat prescriptions, and they interact by phone and in person rather than through apps. Day-to-day pharmacy communications are therefore constant and repetitive: telling patients a prescription is ready, chasing uncollected medicines, following up after dispensing, and answering refill and timing questions, all performed by licensed pharmacists between dispensing tasks.",
    strategicPressure: [
      { text: "Ain Holdings operates Japan's largest dispensing-pharmacy network, concentrated around hospital and clinic locations.", kind: "verified" },
      { text: "Japan's dispensing fee structure has moved toward rewarding pharmacist follow-up and continuous patient management rather than dispensing volume alone, creating a mandated communications workload.", kind: "verified" },
      { text: "Pharmacist supply is constrained and expensive, so time spent on routine notification and follow-up calls displaces higher-value clinical work.", kind: "inference" },
      { text: "An elderly chronic-medication patient base keeps these interactions on the telephone regardless of app availability, so digital-only follow-up under-serves exactly the patients who need it.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Pharmacy chains buy dispensing, inventory and electronic medication-record systems from healthcare vendors; Ain has no software product organisation and its capital goes into store openings and acquisitions. Reimbursement-set margins reward measurable labour offload but never fund platform builds — buy-led.",
    whyNotBuild:
      "Ain would need Japanese speech that copes with elderly speakers and medication names, keigo-grade voice patients trust in a health context, telephony fronting more than a thousand stores, and integration into dispensing and medication-history systems, plus an evaluation regime rigorous enough for regulated follow-up. That is a healthcare-grade product, not a retail IT project.",
    workflows: [
      {
        name: "Prescription-ready notification and collection reminders",
        friction: "Pharmacists phone patients to say a prescription is ready and then chase uncollected medicines, an entirely manual outbound task performed between dispensing duties.",
        outcome: "Automated notification and reminder outreach on the patient's channel with collection timing confirmed, freeing pharmacist hours and reducing uncollected stock.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Dispensing system", "Patient contact records", "Store inventory"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Post-dispensing medication follow-up",
        friction: "Follow-up contact required to check adherence and side effects is made by pharmacists by phone, is hard to complete at scale, and its documentation is manual.",
        outcome: "Structured follow-up conversations conducted at the right interval with responses recorded against the medication record, and any reported symptom or concern escalated immediately to a pharmacist.",
        channels: ["Voice", "LINE"],
        systems: ["Electronic medication record", "Dispensing system", "Pharmacist task queue"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refill timing and prescription-logistics enquiries",
        friction: "Patients call stores asking when to refill, whether a medicine is in stock, opening hours and whether a prescription can be transferred, interrupting dispensing work store by store.",
        outcome: "Routine timing, stock and logistics questions answered instantly with store-level grounding, and clinical questions routed to a pharmacist with context.",
        channels: ["Voice", "LINE"],
        systems: ["Dispensing system", "Store inventory", "Store information base"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A nationwide network of dispensing pharmacies with electronic medication records",
        "Prescription pre-submission via app or fax for faster collection",
        "Store-level telephone lines answered by pharmacy staff",
        "A pharmacist workforce delivering regulated patient guidance and follow-up",
      ],
      gaps: [
        "Ready-notification and collection chasing are entirely manual pharmacist tasks",
        "Follow-up contact cannot be completed for all patients who should receive it",
        "Patients cannot get timing or stock answers outside store opening hours",
        "No structured, analysable record of patient-reported adherence issues at chain level",
      ],
    },
    risks: [
      "Medication follow-up is a regulated pharmacist activity; the agent may collect and route but must never give clinical advice, and the boundary must be enforced and documented.",
      "Medication data is sensitive personal information under APPI requiring explicit handling, minimal retrieval and strict access control.",
      "Patient trust in a health context is fragile, so consent, identification and escalation design must be conservative and clearly disclosed.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions across a very large store network where the binding cost is pharmacist time rather than call-centre time; per-store call and follow-up volumes must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot automating prescription-ready notification and collection reminders across a regional store cluster in Japanese, measured in pharmacist hours returned and uncollected-prescription reduction.",
    expansion: [
      "Add structured post-dispensing follow-up with pharmacist escalation on any reported symptom",
      "Extend to refill timing, stock and store-logistics enquiries",
      "Roll chain-wide with follow-up documentation written into the medication record",
    ],
    stakeholders: [
      "Executive Officer, Pharmacy Business",
      "Head of Pharmacy Operations",
      "Chief Pharmacist / Head of Clinical Quality",
      "General Manager, Information Systems",
      "Head of Regulatory and Reimbursement Affairs",
    ],
    discovery: [
      "How many outbound notification and follow-up calls does a typical store make each day?",
      "What is the regulatory interpretation of an automated first contact in follow-up, and who signs it off?",
      "Can follow-up responses be written back into the electronic medication record automatically?",
      "What proportion of patients would accept LINE contact versus requiring a voice call?",
    ],
    flowTemplate: "appointments",
    scenario: "A chronic-medication patient is called three days after dispensing, confirms they are taking the medicine as directed, mentions dizziness, and is transferred straight to a pharmacist with the record open.",
  },

  "nihon-chouzai": {
    operatingContext:
      "Nihon Chouzai operates a national chain of dispensing pharmacies alongside a generic-drug manufacturing business and a pharmacist staffing and placement business, giving it an unusual three-way exposure to the same pharmacist labour shortage. Its pharmacies sit mainly beside hospitals and clinics, and it has moved earlier than many peers into online medication guidance and app-based prescription handling, showing a willingness to shift patient interaction into new channels. Its patients mirror the sector: older, on repeat prescriptions for chronic conditions, and comfortable with the telephone. The daily communications load is the category standard — ready notifications, refill reminders, follow-up contact required under the dispensing fee framework, and store enquiries — but the company's channel openness makes it a faster mover than the average chain.",
    strategicPressure: [
      { text: "Nihon Chouzai combines dispensing pharmacies with generic-drug manufacturing and a pharmacist staffing business, so pharmacist scarcity affects it through three separate channels.", kind: "verified" },
      { text: "The company has adopted online medication guidance and app-based prescription services earlier than many peers in the category.", kind: "verified" },
      { text: "Fee-schedule emphasis on continuous patient follow-up creates a mandated outbound contact workload that scales with prescription volume.", kind: "inference" },
      { text: "Its prior digital moves have been adoptions of external services rather than internal platform builds, which suggests a bought conversational layer would fit its pattern.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "The company's digital progress has come from adopting services and vendor platforms rather than building them; there is no evidence of an internal conversational-AI or speech capability, and pharmacy margins are set by the reimbursement schedule. Buy-led, with a shorter sales cycle than the category average because channel change is already accepted internally.",
    whyNotBuild:
      "Nihon Chouzai would need medication-aware Japanese speech, keigo-grade voice for elderly patients, telephony fronting a national store estate, and integration into dispensing and medication-record systems with regulated escalation. Its manufacturing and staffing businesses give it no relevant engineering capability at all.",
    workflows: [
      {
        name: "Refill reminder and adherence outreach for chronic-medication patients",
        friction: "Patients on long-term medication lapse between prescriptions; reminders depend on pharmacist-initiated calls that are rarely completed at scale.",
        outcome: "Timed reminder outreach on the patient's preferred channel with refill timing confirmed and clinic-visit prompts where a new prescription is needed, with responses recorded.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Dispensing system", "Electronic medication record", "Patient contact records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-dispensing follow-up contact",
        friction: "Required follow-up contact competes with dispensing work, so it is completed unevenly and documented manually.",
        outcome: "Structured follow-up conducted at the right interval, responses written to the medication record, and any symptom or concern escalated immediately to a pharmacist.",
        channels: ["Voice", "LINE"],
        systems: ["Electronic medication record", "Pharmacist task queue", "Dispensing system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Online-guidance appointment and prescription-logistics support",
        friction: "Patients using online medication guidance need appointment slots, delivery arrangements and prescription-transfer questions answered, and those enquiries land on store staff.",
        outcome: "Guidance appointments booked from live pharmacist availability and delivery or collection logistics arranged conversationally, with pharmacists reserved for the guidance itself.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Online guidance scheduling", "Dispensing system", "Delivery / logistics records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national dispensing-pharmacy network with electronic medication records",
        "App-based prescription submission and online medication guidance services",
        "Store-level telephone lines answered by pharmacy staff",
        "A pharmacist staffing business with its own recruitment and placement operations",
      ],
      gaps: [
        "Refill and adherence outreach is not completed consistently across the patient base",
        "Follow-up documentation is manual and inconsistent between stores",
        "Online-guidance scheduling still requires staff coordination",
        "No out-of-hours channel for patients with timing or logistics questions",
      ],
    },
    risks: [
      "Regulated pharmacist guidance must remain human; the agent's role is limited to scheduling, reminders, structured capture and escalation.",
      "Medication data is sensitive under APPI and requires minimal retrieval, strict access control and explicit patient consent for outreach.",
      "Automated outbound contact about medication must avoid any implication of clinical advice, which makes script governance and evaluation non-negotiable.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions for a national pharmacy chain where pharmacist hours are the binding constraint; store-level call and follow-up volumes and online-guidance uptake must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot running refill-reminder and adherence outreach for chronic-medication patients across a regional cluster in Japanese, with responses recorded and immediate pharmacist escalation on any clinical cue.",
    expansion: [
      "Add post-dispensing follow-up with medication-record write-back",
      "Extend to online-guidance appointment scheduling and delivery logistics",
      "Introduce inbound store-enquiry handling outside opening hours",
    ],
    stakeholders: [
      "Executive Officer, Pharmacy Business",
      "Head of Pharmacy Operations",
      "Chief Pharmacist / Head of Clinical Governance",
      "General Manager, Information Systems / DX",
      "Head of Online Medication Guidance services",
    ],
    discovery: [
      "How many patients are on repeat chronic medication and how is refill timing tracked today?",
      "What is the current completion rate for required follow-up contact?",
      "How is online medication guidance staffed and scheduled, and what is its uptake?",
      "What consent basis exists today for outbound contact to patients?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient due to refill a blood-pressure prescription is called on day 26; the agent confirms the refill timing, books the online guidance slot, and flags to a pharmacist that doses were missed.",
  },

  "tsukui-holdings": {
    operatingContext:
      "Tsukui Holdings is one of Japan's largest operators of day services for the elderly, running a national network of day-care centres alongside home-visit care and group homes. Its daily operating rhythm is defined by transport and attendance: each morning a fleet of small pickup vans collects service users from their homes on tight routes, and any change — a user unwell, a family running late, a hospital appointment — has to be communicated and re-planned before the vans leave. Communication runs constantly between facility staff, families, care managers at external offices, and drivers, almost entirely by telephone. On top of that sits perpetual recruitment: care staff and drivers turn over faster than in almost any other sector, so every facility is always hiring, and the applicant follow-up work falls on facility managers who are also running the floor.",
    strategicPressure: [
      { text: "Tsukui operates one of Japan's largest day-service networks for the elderly, a model built around daily pickup and drop-off transport for service users.", kind: "verified" },
      { text: "Care-sector revenue is capped by the long-term care insurance fee schedule, so operators cannot price their way out of labour cost increases.", kind: "verified" },
      { text: "Attendance and pickup coordination is a daily, time-boxed telephone workload where a missed call directly disrupts a vehicle route and a user's care.", kind: "inference" },
      { text: "Facility managers spend a substantial share of their week on recruitment follow-up and scheduling calls rather than care supervision.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A care operator with vendor-supplied care-management systems, no technology organisation, and fee-schedule economics that preclude any platform investment. Labour offload is existential rather than optional, which makes it a buy-led account where the decision maker is operations, not IT.",
    whyNotBuild:
      "Tsukui would need Japanese speech that works with elderly service users and their families, keigo-grade voice in a care context, telephony across hundreds of facilities, and integration into attendance, transport-route and applicant systems. There is no internal capability of any kind, and the fee schedule leaves no budget for one.",
    workflows: [
      {
        name: "Morning attendance confirmation and absence handling",
        friction: "Facilities call or wait for calls each morning to confirm who is attending; absences arriving late force van routes to be replanned under time pressure and users to be dropped from meal and staffing counts.",
        outcome: "Automated attendance confirmation outreach the evening before and early morning, with absences captured immediately and route and meal counts updated before vehicles depart.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Attendance records", "Transport route planning", "Care-user records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pickup-schedule change coordination with families",
        friction: "Hospital appointments, family availability and weather force pickup-time changes negotiated by phone between family, facility and driver, often on the same morning.",
        outcome: "Change requests captured conversationally, checked against route feasibility, confirmed to family and driver, with staff involved only for genuine conflicts.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Transport route planning", "Attendance records", "Driver schedules"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Care-staff and driver recruitment follow-up",
        friction: "Applications arrive continuously and facility managers call back when they can, losing candidates who have applied to several employers on the same day.",
        outcome: "Applicants contacted within minutes, screened for qualification, licence and availability, and booked into facility interview slots without manager involvement until the interview.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Applicant tracking system", "Facility manager calendars", "Qualification records"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national network of day-service facilities with attendance and care records",
        "Pickup vehicle fleets with route planning per facility",
        "Facility-level telephone contact with families and external care managers",
        "Continuous recruitment advertising across job platforms",
      ],
      gaps: [
        "Attendance confirmation depends on families remembering to call rather than being asked",
        "Route replanning happens after the disruption rather than before vehicles depart",
        "Applicants wait hours or days for a callback in a market where they will not wait",
        "No out-of-hours channel for families to report an absence or change",
      ],
    },
    risks: [
      "Care-user information includes health and care-need data that is sensitive under APPI, so retrieval scope must be minimal and clinical matters must escalate to qualified staff.",
      "Attendance and transport decisions have safety implications for frail users, so any ambiguity must default to human confirmation.",
      "Long-term care insurance billing depends on accurate attendance records, so automated capture must be auditable and reconcilable.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions across attendance, transport and recruitment contact at facility level; per-facility call volumes and manager time allocation must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot running evening and early-morning attendance confirmation outreach for a regional cluster of day-service facilities in Japanese, with absences captured into attendance records before route departure.",
    expansion: [
      "Add pickup-schedule change coordination with route-feasibility checks",
      "Extend to care-staff and driver recruitment screening and interview booking",
      "Introduce proactive family communication about facility events and care updates",
    ],
    stakeholders: [
      "Executive Officer, Day Service / Care Operations",
      "Head of Regional Facility Operations",
      "Head of Human Resources / Recruitment",
      "General Manager, Information Systems",
      "Head of Transport and Vehicle Operations",
    ],
    discovery: [
      "How many attendance and pickup-change calls does a typical facility handle each morning?",
      "How much time does a facility manager spend weekly on recruitment follow-up?",
      "Which system holds attendance records, and can they be updated externally before billing reconciliation?",
      "How are route changes currently communicated to drivers on the morning of service?",
    ],
    flowTemplate: "appointments",
    scenario: "A family reports at 06:40 that their father is unwell; the agent records the absence, updates the meal and staffing count and removes the stop from the van route before it leaves the facility.",
  },

  "pasona-group": {
    operatingContext:
      "Pasona Group is one of Japan's major staffing and outsourcing companies, placing temporary and permanent staff across office, sales, engineering and specialist roles, and running business-process outsourcing services including contact-centre and back-office operations for client companies. It also runs regional-revitalisation businesses centred on Awaji Island where it relocated significant headquarters functions. Its core commercial engine is a candidate funnel: registrations, follow-up calls, job matching outreach, interview coordination and post-placement check-ins, all conducted by career advisors and coordinators over the phone. That workload has exactly the shape of the labour shortage Pasona sells solutions for, and because it also operates BPO services, any conversational-AI conversation is simultaneously a customer conversation and a channel conversation.",
    strategicPressure: [
      { text: "Pasona is a major Japanese staffing and BPO group whose revenue depends on matching candidates to client demand at speed and volume.", kind: "verified" },
      { text: "The group operates business-process outsourcing including contact-centre services, making it both a potential customer for conversational AI and a potential delivery partner.", kind: "verified" },
      { text: "Candidate response speed is a direct determinant of placement success in a market where candidates hold multiple options simultaneously.", kind: "inference" },
      { text: "Coordinator time spent on scheduling and status calls is time not spent on the consultative matching that differentiates a staffing firm.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led rather than buy-led: Pasona has systems capability and a BPO organisation that could operate a conversational layer, but no evidence of an internal speech or conversational-AI platform. The right approach is to automate its own candidate funnel first while opening a channel conversation about delivering the same capability to its BPO clients.",
    whyNotBuild:
      "Pasona's BPO business is built on operating people-based processes, not on building speech platforms; it buys the technology its delivery centres run on. Building Japanese ASR, keigo TTS, telephony and orchestration would be a diversification with no strategic payoff compared with reselling and operating a capability it does not have to maintain.",
    workflows: [
      {
        name: "Candidate registration follow-up and qualification",
        friction: "Registrations arrive continuously through web and job platforms, and coordinators call back during business hours; candidates who registered with several agencies commit elsewhere first.",
        outcome: "Candidates contacted within minutes on their channel, qualified against a structured rubric for skills, availability and location, and routed to the right advisor with the profile already populated.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Candidate database / ATS", "Advisor calendars", "Job requisition data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Job-matching outreach and interview scheduling",
        friction: "Matching a new requisition to registered candidates means coordinators calling down a list, most calls going unanswered, and interview slots negotiated across three parties.",
        outcome: "Matched candidates contacted at scale on their preferred channel with role details, interest captured, and interviews scheduled directly against client and advisor availability.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Candidate database / ATS", "Job requisition data", "Client and advisor calendars"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Post-placement check-in and retention contact",
        friction: "Early attrition in temporary placements is costly, but structured check-ins depend on coordinator capacity and are often skipped.",
        outcome: "Scheduled check-ins conducted consistently in the first weeks of a placement with issues captured structurally and escalated to the coordinator before the worker resigns.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Placement records", "Candidate database", "Coordinator task queue"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national candidate registration and matching operation with advisor relationships",
        "Job platforms and web registration channels feeding the candidate funnel",
        "BPO delivery centres operating contact-centre and back-office services for clients",
        "Client account teams managing corporate staffing demand",
      ],
      gaps: [
        "Candidates who register outside business hours wait for a callback and are frequently lost",
        "Matching outreach is capacity-limited to the number of calls coordinators can make",
        "Post-placement check-ins are inconsistent, so early attrition is discovered late",
        "No structured capture of why candidates decline roles or drop out",
      ],
    },
    risks: [
      "Employment intermediation is regulated in Japan and candidate screening must follow non-discriminatory, documented criteria.",
      "Candidate personal data including work history falls under APPI, and cross-use between staffing and BPO businesses needs an explicit basis.",
      "As a BPO provider Pasona may see the platform as competitive with its own delivery model, so positioning must lead with augmentation and a partner path.",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions for a national staffing funnel; registration volumes, current time to first contact and coordinator call capacity must be measured in discovery, since speed-to-candidate is the value driver.",
    },
    pilotScope:
      "An eight-week pilot contacting and qualifying new candidate registrations within minutes across one business line in Japanese, booking advisor appointments and measuring registration-to-interview conversion against the current baseline.",
    expansion: [
      "Extend to job-matching outreach at scale against open requisitions",
      "Add post-placement check-in and early-attrition escalation",
      "Open a partner track offering the same capability through Pasona BPO to client companies",
    ],
    stakeholders: [
      "Executive Officer, Staffing / HR Solutions Business",
      "Head of Candidate Registration and Career Advisory operations",
      "Executive responsible for BPO delivery services",
      "General Manager, Information Systems / DX",
      "Head of Client Account Management",
    ],
    discovery: [
      "What is the current median time from candidate registration to first human contact?",
      "How many outbound matching calls does a coordinator make per day and what is the connect rate?",
      "Would the BPO organisation view this capability as competitive or as something to resell?",
      "What consent basis covers outbound contact to registered candidates on LINE and voice?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A candidate registers at 23:30 after finishing a shift; within minutes the agent qualifies their skills and availability and books an advisor appointment before a rival agency calls in the morning.",
  },

  "dip-corporation": {
    operatingContext:
      "Dip Corporation operates Baitoru, one of Japan's leading part-time and casual job platforms, alongside Hatarako.net and adjacent HR services, earning revenue from employers who post positions and pay for applicant flow. Its clients are overwhelmingly SMEs — restaurants, retail stores, care facilities, logistics operators — which are precisely the employers hit hardest by labour scarcity and least equipped to respond quickly to applicants. Dip has moved beyond pure job advertising into selling labour-saving digital tools to that same SME base, positioning itself as a productivity supplier rather than only a media business. Its own operations involve high-volume advertiser support, applicant-flow servicing and sales outreach to small employers, all telephone-heavy, while its platform position gives it distribution into thousands of employers who each individually could never buy conversational AI.",
    strategicPressure: [
      { text: "Dip operates Baitoru, a leading part-time job platform, and has extended into selling labour-saving digital tools to its SME client base.", kind: "verified" },
      { text: "Its SME advertisers face acute hiring difficulty and typically cannot respond to applicants quickly, which suppresses the platform's own conversion metrics.", kind: "verified" },
      { text: "Applicant drop-off between application and interview is a structural problem for part-time hiring and is largely caused by slow or failed employer follow-up.", kind: "inference" },
      { text: "Embedded applicant-screening voice automation would improve Dip's own product metrics and create a new revenue line, making it a channel as much as a customer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led: Dip is a genuine internet company with product and engineering capability, so it can integrate and operate a conversational layer, but building Japanese speech, telephony and evaluation infrastructure is far outside a job-platform's stack. The sale is a capability it embeds and resells rather than a system it consumes.",
    whyNotBuild:
      "Dip's engineering builds matching, search, advertising and mobile products. Speech recognition, keigo-grade synthesis, carrier telephony and per-conversation evaluation would be a new platform business requiring specialist teams; partnering lets it ship an embedded feature to SME clients in months rather than building for years.",
    workflows: [
      {
        name: "Applicant screening and interview booking on behalf of SME employers",
        friction: "An applicant applies through the platform and waits for a small employer to call back; many employers respond a day or more later, by which time the applicant has taken another job.",
        outcome: "Applicants contacted within minutes, screened against the employer's stated requirements for availability, experience and location, and booked directly into interview slots the employer confirmed.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Platform applicant records", "Employer requirement and calendar data", "Interview scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Advertiser support and posting assistance",
        friction: "SME advertisers phone for help writing postings, adjusting budgets and understanding applicant flow, occupying a support team whose volume scales with client count.",
        outcome: "Routine posting, billing and performance questions answered conversationally at any hour with account context, and genuine sales opportunities routed to representatives.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Advertiser account platform", "Billing records", "Campaign performance data"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Applicant re-engagement and no-show recovery",
        friction: "Applicants who do not attend interviews or go quiet are rarely followed up, so demand that the platform already generated is simply lost.",
        outcome: "Automated re-engagement outreach that reschedules interviews or offers alternative matched roles, converting lapsed applicants back into placements.",
        channels: ["LINE", "Voice", "SMS"],
        systems: ["Platform applicant records", "Matching engine", "Employer calendars"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large job platform with applicant and employer accounts and matching functionality",
        "Advertiser support operations serving a national SME client base",
        "Digital labour-saving tools already sold into the same SME segment",
        "Applicant messaging and notification channels within the platform",
      ],
      gaps: [
        "Applicants depend on SME employers to call back, which is the platform's weakest link",
        "No voice capability that employers can delegate screening to",
        "Advertiser support is limited to business hours for clients who work evenings and weekends",
        "Lapsed applicants and interview no-shows are not systematically recovered",
      ],
    },
    risks: [
      "Employment intermediation and screening are regulated; criteria must be documented, non-discriminatory and auditable, especially when automated on an employer's behalf.",
      "Applicant personal data under APPI is shared between platform and employer, so the lawful basis and scope of an agent acting for the employer must be explicit.",
      "Positioning matters commercially: this must strengthen Dip's product rather than appear to disintermediate its own support and sales organisation.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 4.0,
      automationRate: 0.6,
      basis: "Seller assumptions covering applicant-side contact across the platform rather than Dip's internal desk alone; application volumes, current employer response times and drop-off rates must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot screening applicants and booking interviews on behalf of a defined cohort of SME employers on the platform, measured on time to first contact and application-to-interview conversion versus the control group.",
    expansion: [
      "Package the capability as an embedded paid feature for platform advertisers",
      "Add advertiser support automation for posting, billing and performance questions",
      "Introduce applicant re-engagement and no-show recovery across the platform",
    ],
    stakeholders: [
      "Executive Officer, Baitoru / Media Business",
      "Head of Product for employer-side services",
      "Head of Advertiser Sales and Support",
      "CTO / Head of Engineering",
      "Head of Legal and Compliance for employment services",
    ],
    discovery: [
      "What is the median time from application to employer first contact across the platform today?",
      "What proportion of applications never receive a response, and what does that cost in advertiser churn?",
      "Would employers pay for delegated screening as an add-on, and at what price point?",
      "What contractual and consent framework would let an agent act on an employer's behalf with applicant data?",
    ],
    flowTemplate: "lead-sales",
    scenario: "An applicant applies to a Baitoru restaurant listing at 01:00; the agent screens availability and experience and books a Tuesday interview before the owner opens the shop.",
  },

  "mitsui-fudosan": {
    operatingContext:
      "Mitsui Fudosan is Japan's largest real-estate developer, operating LaLaport and Mitsui Outlet Park retail facilities nationwide, a large office portfolio centred on Nihonbashi and other Tokyo districts, residential development and brokerage through its group companies, hotels and resorts, and logistics facilities. Each asset class carries its own customer contact: shoppers asking about hours, tenants and parking at malls, office tenants raising facility and building-service requests, homebuyers and residents raising after-sales and repair issues, and hotel guests booking and changing stays. Those contacts are handled today by facility information desks, property-management companies, after-sales service desks and hotel reservation lines — a wide estate of small teams working business hours. The group runs serious digital programmes around its properties and customer membership, which changes how a conversational layer must be sold rather than whether it is needed.",
    strategicPressure: [
      { text: "Mitsui Fudosan operates a nationwide portfolio spanning LaLaport and outlet retail, offices, residential, hotels and logistics, each generating distinct customer-contact loads.", kind: "verified" },
      { text: "The group runs group-wide digital and customer-membership programmes intended to connect experience across its properties.", kind: "verified" },
      { text: "Facility and property-management staffing is under sustained pressure, and desks at individual assets cannot extend hours by hiring.", kind: "inference" },
      { text: "Residential after-sales and repair intake is the highest-friction contact in the portfolio because it is unpredictable, often urgent, and currently limited to message-taking outside hours.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led: Mitsui Fudosan has real digital capability and governance expectations but builds property and experience platforms, not speech infrastructure. Its property-management and facility subsidiaries buy operational technology, so the right shape is packaged workflows integrated into group systems with the developer's own teams governing them.",
    whyNotBuild:
      "The group would need Japanese and English speech, keigo-grade voice for a premium property brand, telephony fronting dozens of facility and property-management desks, and integration into facility, work-order, property-management and hotel systems. Its DX ambition is about customer experience across assets, and assembling a voice platform underneath that would consume years for no differentiation.",
    workflows: [
      {
        name: "Mall and commercial-facility information handling",
        friction: "Facility desks answer high volumes of repetitive questions about hours, tenants, parking, events, lost items and accessibility, separately at each property and only during opening hours.",
        outcome: "One conversational front door across facilities answering these questions in Japanese and English with structured lost-item intake into each property's register.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Facility information base", "Tenant directory", "Lost-property register"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Residential after-sales and repair intake",
        friction: "Homeowners and residents call about defects, equipment failures and repair requests; outside hours they reach a message service, and inside hours details are captured inconsistently.",
        outcome: "Structured repair and defect intake at any hour with warranty status checked, work orders created and contractors dispatched, replacing message-taking with triage.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Property-management system", "Work-order / dispatch", "Warranty and handover records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Office-tenant service request handling",
        friction: "Tenant facility requests — air conditioning, access cards, cleaning, after-hours building services — are phoned to building management and logged manually with variable turnaround.",
        outcome: "Tenant requests captured with building, floor and entitlement context, routed into building-management workflows and status-tracked back to the requester.",
        channels: ["Voice", "Web", "Chat"],
        systems: ["Building-management system", "Tenant records and entitlements", "Work-order / dispatch"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Facility information desks at LaLaport, outlet and office properties",
        "A group customer-membership and points programme spanning retail and other assets",
        "Property-management companies operating residential and office service desks",
        "Hotel reservation operations for the group's lodging portfolio",
      ],
      gaps: [
        "Residential and facility enquiries cannot be completed outside business hours",
        "Repair intake produces messages rather than triaged, dispatched work orders",
        "Facility information is answered asset by asset with no shared front door",
        "English support varies by property despite significant international tenant and visitor presence",
      ],
    },
    risks: [
      "Residential and tenant data is personal and access-sensitive under APPI, so authentication and retrieval scope must be tightly designed.",
      "Property-management subsidiaries and facility operators have their own budgets and vendors, so scope must be agreed at group level to avoid fragmentation.",
      "A sophisticated internal DX organisation will require an architecture and governance story, not a closed product, before it will sponsor a deployment.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 5.0,
      automationRate: 0.55,
      basis: "Seller assumptions aggregating facility, residential and tenant desks; contact data is likely fragmented across subsidiaries, so a consolidated baseline is the first discovery deliverable.",
    },
    pilotScope:
      "A ten-week pilot providing 24-hour residential after-sales and repair intake for a defined Mitsui Fudosan Residential portfolio, with warranty checks, structured work-order creation and contractor dispatch.",
    expansion: [
      "Extend to mall and commercial-facility information handling with lost-item intake",
      "Add office-tenant service request handling with building-management integration",
      "Connect the membership identity so customers are recognised across asset classes",
    ],
    stakeholders: [
      "Executive Officer, Retail Properties Business",
      "Executive Officer, Residential Business / Mitsui Fudosan Residential",
      "Head of Property Management subsidiary operations",
      "General Manager, DX / Digital Strategy",
      "Head of Office Building Management operations",
    ],
    discovery: [
      "Which business unit owns customer-contact operations for each asset class, and what does each spend?",
      "What happens end to end when a resident reports a defect at 23:00 today?",
      "How far does the group DX programme currently reach into voice and service channels?",
      "Can the membership identity be used for authentication in service channels under existing consents?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A resident in a Mitsui Fudosan Residential building reports a failed water heater at midnight; the agent checks warranty status, creates the work order and books the contractor for the morning.",
  },

  "mitsubishi-estate": {
    operatingContext:
      "Mitsubishi Estate is the developer and landlord of the Marunouchi business district, giving it one of Japan's most concentrated office-tenant portfolios, and it also operates premium outlet centres, residential development and brokerage, hotels and international property businesses. Its contact profile is therefore weighted toward business tenants rather than consumers: building services, access and security, facility maintenance, tenant events, and workplace-support requests from major corporate occupiers, alongside consumer contact at outlets and in residential after-sales. Those are handled by building-management subsidiaries, facility information desks and after-sales service teams, largely staffed in business hours by conventional operations. The group has visible digital ambition around Marunouchi as a smart district, but customer-contact operations remain traditional and vendor-run.",
    strategicPressure: [
      { text: "Mitsubishi Estate is the principal owner and developer of the Marunouchi district, giving it a dense portfolio of corporate office tenants with continuous building-service needs.", kind: "verified" },
      { text: "The group also operates premium outlet centres and residential and hotel businesses, adding consumer contact to a mainly business-tenant profile.", kind: "verified" },
      { text: "Building-management and facility staffing is under recruitment pressure, so extending desk hours or adding coverage by hiring is not realistic.", kind: "inference" },
      { text: "Corporate tenants increasingly expect workplace services with consumer-grade responsiveness, which conventional building-management desks cannot deliver.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led: group DX ambitions exist at district and asset level, but contact operations sit with property-management subsidiaries running vendor systems. There is no internal speech capability and no plausible reason to build one; the sale is packaged tenant and facility workflows integrated into building-management systems.",
    whyNotBuild:
      "Mitsubishi Estate would need Japanese and English speech, keigo-grade voice for a premium landlord brand, telephony fronting many building-management desks, and integration into building-management, access-control and work-order systems. Its smart-district investment is about sensors, data and tenant experience platforms, not about operating a speech stack.",
    workflows: [
      {
        name: "Office-tenant service request intake and status",
        friction: "Tenant requests for air conditioning, lighting, cleaning, access cards and after-hours building services are phoned to building management, logged manually, and status has to be chased.",
        outcome: "Requests captured with building, floor, tenant and entitlement context, routed into building-management workflows, and status pushed back automatically to the requester.",
        channels: ["Voice", "Chat", "Web"],
        systems: ["Building-management system", "Tenant records and entitlements", "Work-order / dispatch"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Building-concierge and district information handling",
        friction: "Visitors and tenant employees ask about access, meeting-room facilities, parking, deliveries and district amenities at concierge desks with fixed hours and variable English coverage.",
        outcome: "Access, facility and district questions answered in Japanese and English at any hour, freeing concierge staff for in-person service and security duties.",
        channels: ["Voice", "Chat", "Web"],
        systems: ["Building information base", "Access and visitor management", "Facility booking"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Premium-outlet customer enquiry handling",
        friction: "Outlet centres field high volumes of seasonal questions about hours, shuttle buses, tenant stores, tax-free shopping and lost items, in several languages, at small information desks.",
        outcome: "Outlet enquiries answered instantly in Japanese, English and Chinese with lost-item intake structured into the centre register, absorbing seasonal peaks.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Facility information base", "Tenant directory", "Lost-property register"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Building-management operations across the Marunouchi office portfolio",
        "Concierge and information desks at major buildings and outlet centres",
        "Tenant relationship and leasing organisations serving corporate occupiers",
        "Residential after-sales service desks for the development business",
      ],
      gaps: [
        "Tenant service requests cannot be lodged or tracked outside building-management hours",
        "Request status must be chased by the tenant rather than pushed to them",
        "Outlet enquiry capacity does not flex with seasonal visitor peaks",
        "English coverage at concierge and information desks is inconsistent",
      ],
    },
    risks: [
      "Access, security and visitor data is sensitive; the agent must not perform access grants and must route anything security-related to human control.",
      "Tenant contracts define service entitlements, so the agent must act strictly within the entitlements recorded for each tenant.",
      "Property-management subsidiaries buy technology independently, so a portfolio deployment requires group-level agreement on scope and funding.",
    ],
    economics: {
      volumeMonthly: 80000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions across tenant, concierge and outlet contact; per-building request volumes and the split between phone and existing tenant portals must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling office-tenant service request intake and status for a defined Marunouchi building cluster in Japanese and English, with work-order creation and automatic status updates to requesters.",
    expansion: [
      "Extend to building-concierge and district information handling across the portfolio",
      "Add premium-outlet customer enquiry handling with lost-item intake",
      "Introduce residential after-sales and repair intake for the development business",
    ],
    stakeholders: [
      "Executive Officer, Office Building Business",
      "Head of Building Management subsidiary operations",
      "General Manager, DX / Digital Strategy",
      "Head of Commercial Property (outlet) operations",
      "Head of Tenant Relations for major corporate occupiers",
    ],
    discovery: [
      "How many tenant service requests are received per building per month, and through which channels?",
      "Do property-management subsidiaries buy technology independently or under a group framework?",
      "What tenant portal exists today and why do tenants still phone?",
      "What proportion of concierge and outlet enquiries arrive in languages other than Japanese?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A tenant in a Marunouchi tower requests after-hours air conditioning for a Saturday project; the agent checks the lease entitlement, raises the work order and confirms the charge before the building desk opens.",
  },

  "open-house-group": {
    operatingContext:
      "Open House Group sells and develops urban detached houses and condominiums, concentrated in central Tokyo and other metropolitan areas, with a business model built on aggressive land sourcing, rapid turnover and an intense direct-sales culture that treats lead response speed as a core discipline. Its buyers are typically working households in their thirties and forties who research online in the evening and at weekends, submit enquiries through property portals and the company's own site, and expect fast contact. The sales organisation runs on showroom and site visits, so the critical conversion event is booking a viewing appointment while the buyer is still engaged. Contact today runs through sales offices, telephone teams and web enquiry handling that is strongest during working hours — which is precisely when the target buyer is at work.",
    strategicPressure: [
      { text: "Open House built its growth on a high-velocity, sales-driven model in urban detached housing where speed of customer contact is treated as a competitive discipline.", kind: "verified" },
      { text: "Property enquiries in Japan arrive predominantly through portals and web forms, where the first responder captures a disproportionate share of viewings.", kind: "verified" },
      { text: "Its buyer demographic researches in the evening and at weekends, so a large share of enquiries arrive outside the hours the sales organisation is strongest.", kind: "inference" },
      { text: "Because a single conversion is worth a large transaction value, even a modest lift in after-hours lead capture is financially significant, making this a revenue play rather than a cost play.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A sales-led organisation that buys tools which feed the funnel and has no software product organisation; its investment goes into land acquisition, construction and sales headcount. There is no evidence of internal conversational-AI capability and no reason to develop one — buy-led, with an unusually short decision cycle because the buyer is the sales leadership.",
    whyNotBuild:
      "Open House would need Japanese speech, keigo-grade voice appropriate for a high-value purchase conversation, telephony, and integration into property inventory and sales CRM with calendar booking. Its competitive advantage is sales execution; renting a capability that answers every lead in sixty seconds is entirely congruent with that, and building one is not.",
    workflows: [
      {
        name: "After-hours lead qualification and viewing booking",
        friction: "Enquiries submitted in the evening and at weekends receive an auto-reply and wait for a sales call the next business day, by which time the buyer has booked viewings with competitors.",
        outcome: "Every enquiry engaged within minutes at any hour, qualified on budget, area, timing and financing readiness, and a viewing appointment booked directly onto a sales representative's calendar.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Sales CRM", "Property inventory", "Sales representative calendars"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Property availability and specification enquiries",
        friction: "Buyers call to ask whether a listed property is still available, about layout, land area, station distance and price, and get answers only when a representative is free.",
        outcome: "Availability and specification questions answered instantly from live inventory, with genuine interest converted into a booked viewing in the same conversation.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Property inventory", "Sales CRM", "Listing content"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Viewing reminder and no-show recovery",
        friction: "Booked viewings are lost to no-shows and cancellations that are not followed up systematically, wasting representative time and losing pipeline already paid for.",
        outcome: "Automated confirmation and reminder outreach with one-step rescheduling, and re-engagement of no-shows with alternative properties and slots.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Sales representative calendars", "Sales CRM", "Property inventory"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Property portal listings and an own-site enquiry funnel",
        "A large direct-sales organisation with showrooms and site-visit operations",
        "A sales CRM tracking leads through to contract",
        "Telephone teams handling inbound enquiries during business hours",
      ],
      gaps: [
        "Enquiries arriving evenings and weekends get an auto-reply rather than a conversation",
        "Availability questions depend on reaching a representative rather than live inventory",
        "No systematic reminder and recovery process around booked viewings",
        "No structured capture of why qualified leads never convert to a viewing",
      ],
    },
    risks: [
      "Real-estate advertising and representation rules constrain what may be stated about properties, so the agent must speak only from approved listing content.",
      "Financing and loan-eligibility questions must be treated carefully and routed to qualified staff rather than answered.",
      "Buyer personal and financial information falls under APPI, so what is captured conversationally and where it is stored must be tightly scoped.",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 6.0,
      automationRate: 0.5,
      basis: "Seller assumptions for a high-value sales funnel where the case is measured in additional viewings booked, not agent minutes saved; current after-hours enquiry volume and response times must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot engaging every enquiry received outside business hours within minutes for one metropolitan sales region, qualifying and booking viewings onto representative calendars, measured against a control group on viewing conversion.",
    expansion: [
      "Extend to all-hours handling of availability and specification enquiries with live inventory grounding",
      "Add viewing reminder and no-show recovery outreach",
      "Roll across all sales regions with structured lead-quality feedback to marketing",
    ],
    stakeholders: [
      "Executive Officer, Sales Division",
      "Head of Marketing and Lead Generation",
      "Regional sales managers for pilot areas",
      "General Manager, Information Systems",
      "Head of Legal / Compliance for property advertising",
    ],
    discovery: [
      "What proportion of enquiries arrive outside business hours, and what is the current response time for them?",
      "What is the conversion rate from enquiry to booked viewing, and how does it vary by response speed?",
      "Can property inventory availability be exposed to a conversational agent in real time?",
      "What is the no-show rate on booked viewings and is any recovery process in place?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A couple submits an enquiry on a Setagaya detached house at 23:40; within two minutes the agent confirms availability, qualifies budget and area, and books a Saturday viewing.",
  },

  "daito-trust": {
    operatingContext:
      "Daito Trust Construction builds rental apartment buildings for landowners and then manages them under long-term lease-guarantee arrangements, which makes its property-management arm one of the largest tenant-facing operations in Japan, responsible for well over a million rental units nationwide. Two distinct customer groups depend on it: landowners who need rent, occupancy and building-maintenance answers, and tenants who need everything from contract and rent questions to lock-outs, water leaks, appliance failures and noise complaints, at all hours. Tenants reach it through a leasing brand network, a tenant support line, member web services and property-level notices, with a growing share of foreign residents whose Japanese is limited. Because the guarantee model means vacancies and tenant churn hit Daito directly, tenant experience is not a soft metric but a direct driver of the company's own revenue.",
    strategicPressure: [
      { text: "Daito Trust builds and then manages rental apartments under lease-guarantee arrangements covering well over a million units, making tenant support a core operating function rather than an outsourced afterthought.", kind: "verified" },
      { text: "Japan's rental market increasingly houses foreign residents and workers, so multilingual tenant support has become an operational requirement in the segment Daito serves.", kind: "verified" },
      { text: "Tenant support is inherently 24-hour work — leaks, lock-outs and equipment failures do not wait for office hours — yet staffing overnight coverage at national scale is prohibitively expensive.", kind: "inference" },
      { text: "Because vacancy risk sits with Daito under the guarantee model, faster and better tenant support translates directly into retention and therefore revenue.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Daito's competence is construction, leasing and property management; its systems are vendor-delivered and its after-hours tenant support is substantially outsourced to call-centre partners. There is no software product organisation and no public evidence of conversational-AI capability, making this a buy-led account with an unusually clear cost centre to attack.",
    whyNotBuild:
      "Daito would need Japanese speech plus English, Chinese and Vietnamese coverage, keigo-grade voice for tenant and landowner conversations, telephony fronting a national support estate, and integration into property-management, work-order and contract systems with 24-hour reliability. A construction and leasing company has no path to building that, and the outsourced alternative is exactly the cost being challenged.",
    workflows: [
      {
        name: "24-hour tenant repair and trouble intake",
        friction: "Leaks, lock-outs, air-conditioning failures and equipment faults are reported at night to an outsourced line that mostly takes messages, so triage and dispatch wait until morning.",
        outcome: "Structured intake at any hour with severity triage, emergency contractor dispatch for genuine urgencies, work orders created in the property-management system, and status pushed back to the tenant.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Property-management system", "Work-order / contractor dispatch", "Tenant and contract records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Move-in and move-out coordination",
        friction: "Move-in procedures, utility setup guidance, key handover, move-out notice, inspection scheduling and deposit settlement questions generate long, repetitive calls with high multilingual demand.",
        outcome: "Procedures explained and captured conversationally in four languages, notices lodged, inspection appointments booked, and settlement questions answered from contract terms.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Tenant and contract records", "Inspection scheduling", "Billing and settlement"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rent, contract and renewal enquiry handling",
        friction: "Rent payment questions, contract renewal terms, guarantor and payment-method changes are handled by business-hours staff for tenants who work during those hours.",
        outcome: "Authenticated rent and contract questions answered at any hour with renewal terms explained from the contract record, and payment-difficulty cases routed sensitively to human staff.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Tenant and contract records", "Rent billing / payment", "Renewal management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national leasing brand network handling tenant acquisition and contracts",
        "A tenant support line with after-hours coverage delivered through outsourced partners",
        "Tenant member web services for rent, contract and procedure information",
        "Contractor networks performing repairs and building maintenance",
      ],
      gaps: [
        "After-hours contact produces messages rather than triaged, dispatched work",
        "Foreign tenants have inconsistent language support exactly where the portfolio is growing",
        "Tenants cannot check repair status without calling again",
        "Move-in and move-out procedures require repeated calls to complete",
      ],
    },
    risks: [
      "Tenant data including occupancy, access and payment status is personal under APPI, and authentication must be solid before any contract or access information is disclosed.",
      "Emergency situations — gas smell, serious water ingress, fire, personal safety — must have unmistakable escalation rules to human and emergency response.",
      "Rent-arrears and payment-difficulty conversations carry conduct expectations and must be routed to trained human staff rather than handled automatically.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a tenant base above a million units; actual tenant support contact volumes, the after-hours outsourcing cost and the language mix must be validated with the property-management arm in discovery.",
    },
    pilotScope:
      "A ten-week pilot providing 24-hour tenant repair and trouble intake for a defined regional portfolio in Japanese, English, Chinese and Vietnamese, with severity triage, work-order creation and emergency escalation.",
    expansion: [
      "Add move-in and move-out coordination including inspection scheduling",
      "Extend to rent, contract and renewal enquiry handling with authenticated access",
      "Introduce proactive status updates on open repairs and renewal reminders",
    ],
    stakeholders: [
      "Executive Officer, Property Management Business",
      "Head of Tenant Support Centre operations",
      "General Manager, Information Systems",
      "Head of Leasing Brand Network operations",
      "Procurement lead for outsourced after-hours support",
    ],
    discovery: [
      "How many tenant contacts are handled monthly, and what share arrive outside office hours?",
      "What does the current outsourced after-hours arrangement cost and what does it actually do beyond message-taking?",
      "What proportion of tenants are foreign residents, and which languages dominate?",
      "Can work orders be created and contractors dispatched directly from an external conversational layer?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Vietnamese tenant reports a bathroom leak at 02:00; the agent triages the severity in Vietnamese, dispatches the emergency contractor and creates the work order before the office opens.",
  },

  "leopalace21": {
    operatingContext:
      "Leopalace21 develops and manages a large portfolio of small furnished rental apartments marketed heavily to single occupants — students, young workers, corporate assignees and technical trainees — with an unusually high proportion of foreign residents compared with the rest of the Japanese rental market. Its furnished, utilities-bundled, short-contract product means tenant contact starts early and stays frequent: contract and payment questions, internet and appliance problems, key and access issues, and repair requests, often from residents with limited Japanese. The company came through a prolonged construction-defect crisis and multi-year restructuring, which stripped cost from every function including tenant support and eliminated any appetite for discretionary technology investment. Tenants reach it through a member web service, a support line and property notices, with support quality directly affecting occupancy in a segment where switching costs are low.",
    strategicPressure: [
      { text: "Leopalace21 manages a large portfolio of small furnished rental units and serves an unusually high share of foreign residents and corporate-assignment tenants.", kind: "verified" },
      { text: "The company underwent years of restructuring following construction-defect problems, leaving a cost base with no room for discretionary technology projects.", kind: "verified" },
      { text: "A tenant base of single occupants on short contracts churns quickly, so support friction converts directly into vacancy.", kind: "inference" },
      { text: "Multilingual demand is concentrated in a handful of languages — English, Chinese and Vietnamese in particular — which makes targeted language coverage practical rather than open-ended.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A restructured company with vendor-supplied property-management systems, outsourced support elements and no technology organisation. Its cost discipline rules out any build, while multilingual support is a genuine competitive differentiator in its segment — buy-led with a fast payback narrative.",
    whyNotBuild:
      "Leopalace would need Japanese, English, Chinese and Vietnamese speech, keigo-grade Japanese voice, telephony and property-management integration. After years of cost reduction there is neither the team nor the capital, and the entire value proposition of buying is that language coverage arrives without headcount.",
    workflows: [
      {
        name: "Multilingual tenant repair and trouble intake",
        friction: "Foreign tenants report appliance, internet, heating and access problems in limited Japanese to a support line with inconsistent language coverage, producing misdiagnosis and repeat calls.",
        outcome: "Structured intake in the tenant's own language at any hour with triage, work-order creation and contractor dispatch, and status pushed back in the same language.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Property-management system", "Work-order / contractor dispatch", "Tenant records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Move-in guidance and utilities setup support",
        friction: "New tenants, often newly arrived in Japan, need guidance on key collection, utilities, internet, waste rules and payment setup, which currently requires several calls or emails in a language they may not read.",
        outcome: "Guided move-in support in the tenant's language covering procedures step by step, with confirmations recorded and outstanding items chased automatically.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Tenant and contract records", "Property information base", "Billing / payment setup"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Contract, rent and renewal enquiry handling",
        friction: "Contract terms, rent payment, renewal and early-termination questions are handled in business hours by Japanese-speaking staff, for tenants who work and whose Japanese is limited.",
        outcome: "Authenticated contract and payment questions answered in four languages at any hour, with early-termination and arrears cases routed to human staff.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Tenant and contract records", "Rent billing / payment", "Renewal management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A tenant member web service for contract, payment and procedure information",
        "A tenant support line covering repair and trouble reporting",
        "Furnished-apartment product with bundled utilities and internet across the portfolio",
        "Contractor networks performing repairs and unit maintenance",
      ],
      gaps: [
        "Language coverage on the support line does not match the tenant base",
        "After-hours contact does not produce dispatched work",
        "Move-in guidance depends on written materials tenants may not be able to read",
        "Repair status must be chased by the tenant rather than pushed to them",
      ],
    },
    risks: [
      "Tenant data including immigration-adjacent and employment information may be present in records and requires careful APPI scoping and minimal retrieval.",
      "Emergency situations must have clear escalation to human and emergency services regardless of language.",
      "Arrears and early-termination conversations carry conduct expectations and should route to trained human staff.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a large single-occupant rental portfolio; tenant contact volumes, language mix and current support cost must be validated in discovery, with the language mix determining scope.",
    },
    pilotScope:
      "An eight-week pilot providing multilingual tenant repair and trouble intake in Japanese, English, Chinese and Vietnamese for a defined regional portfolio, with triage, work-order creation and status callbacks.",
    expansion: [
      "Add guided move-in and utilities setup support in the same languages",
      "Extend to contract, rent and renewal enquiry handling with authentication",
      "Introduce proactive pre-move-out and renewal outreach to reduce avoidable churn",
    ],
    stakeholders: [
      "Executive Officer, Leasing / Property Management Business",
      "Head of Tenant Support operations",
      "General Manager, Information Systems",
      "Head of Corporate Leasing accounts",
      "Head of Building Maintenance and contractor management",
    ],
    discovery: [
      "What share of tenants are foreign residents and what is the actual language distribution?",
      "How is the support line staffed by hour and by language today?",
      "What proportion of repair reports require a follow-up call because the first was misunderstood?",
      "Can work orders be created directly in the property-management system from an external channel?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A newly arrived technical trainee reports a broken air conditioner in Vietnamese on a Sunday; the agent triages, books the contractor and explains the visit window in Vietnamese.",
  },

  "toyota-financial-services": {
    operatingContext:
      "Toyota Financial Services in Japan is the captive finance arm supporting Toyota and Lexus sales through the domestic dealer network, providing auto loans, leases, credit-card and insurance-related products to a very large in-force customer book. Its customer contact is almost entirely servicing rather than sales: payment-date changes, payment-method updates, payoff quotes, contract copies, lease-end procedures including return, extension and purchase options, and insurance and accident-related coordination. Customers reach it through a member web service, printed statements, dealer sales staff who often act as the informal first point of contact, and telephone centres partly delivered by outsourcing partners. Because the customer relationship is mediated by dealers, servicing quality reflects directly on the Toyota brand even when the contact is purely financial.",
    strategicPressure: [
      { text: "Toyota Financial Services is the captive finance arm supporting Toyota and Lexus retail sales in Japan through the dealer network, giving it a large in-force servicing book.", kind: "verified" },
      { text: "Lease and subscription-style vehicle products have grown in Japan, which increases the volume of end-of-term procedures requiring customer contact.", kind: "verified" },
      { text: "Servicing contacts are dominated by a small number of deterministic intents — payment date, payment method, payoff quote, lease-end options — that are ideal automation candidates.", kind: "inference" },
      { text: "Because dealers are the relationship owner, poor finance servicing generates dealer complaints and consumes dealer staff time, giving the pilot a second constituency.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Captive finance companies run vendor-delivered loan-servicing and contract-management platforms with outsourced contact operations. Toyota's software ambitions sit in mobility and vehicle software organisations, not in finance servicing, and there is no public evidence of a conversational-AI capability inside the captive — buy-led, subject to a group technology-governance check.",
    whyNotBuild:
      "The captive would need Japanese speech, keigo-grade voice for financial conversations, telephony into an outsourced centre estate, and integration into loan-servicing, contract and payment systems with financial-grade authentication and audit. Its IT roadmap is servicing-platform maintenance, not speech infrastructure.",
    workflows: [
      {
        name: "Payment-date and payment-method change handling",
        friction: "Customers call to move a payment date or change bank details; operators authenticate manually and re-key changes, and the customer often calls again to confirm it took effect.",
        outcome: "Authenticated changes executed conversationally against the servicing system with confirmation issued immediately, at any hour, with exceptions escalated.",
        channels: ["Voice", "Web", "App"],
        systems: ["Loan / lease servicing system", "Payment and direct-debit processing", "Identity and authentication"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Payoff quote and early-settlement enquiries",
        friction: "Customers trading in or settling early call for a payoff figure, which requires a calculation and an explanation of fees, currently performed by operators one call at a time and often relayed through dealers.",
        outcome: "Payoff figures and settlement conditions calculated and explained conversationally with a written quote issued, freeing operators and dealer staff.",
        channels: ["Voice", "Web", "App"],
        systems: ["Loan / lease servicing system", "Fee and settlement rules", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lease-end procedure coordination",
        friction: "End-of-term customers must choose between return, extension and purchase, arrange inspection and coordinate with a dealer; today that is a sequence of outbound calls with low contact rates.",
        outcome: "Proactive outbound contact ahead of term end explaining options, capturing the customer's choice, and booking the dealer appointment, with residual and charge questions answered from contract terms.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Lease contract records", "Dealer appointment scheduling", "Inspection and remarketing workflow"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A member web service for contract, payment and statement information",
        "Telephone servicing centres partly delivered through outsourcing partners",
        "Dealer-facing systems where sales staff handle finance queries at the point of sale",
        "Direct-debit and payment infrastructure across the in-force book",
      ],
      gaps: [
        "Servicing changes cannot be completed outside centre hours",
        "Payoff quotes are relayed through humans and often through dealers",
        "Lease-end outreach has low contact rates and depends on manual calling",
        "Dealer staff absorb finance servicing questions that should never reach them",
      ],
    },
    risks: [
      "Consumer credit servicing is regulated: authentication, disclosure and record-keeping standards must be met and demonstrable for every automated interaction.",
      "Payment-difficulty and arrears conversations carry conduct obligations and must route to trained human collectors rather than being automated.",
      "Group technology governance may constrain vendor choice, so alignment with Toyota-wide IT policy has to be confirmed early.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a large captive servicing book; contact volumes by intent, outsourced cost per contact and lease-end outreach contact rates must be validated with the servicing organisation.",
    },
    pilotScope:
      "An eight-week pilot handling authenticated payment-date and payment-method changes plus payoff quotes in Japanese, with servicing-system write-back, written confirmation and escalation for arrears.",
    expansion: [
      "Add proactive lease-end outreach with option capture and dealer appointment booking",
      "Extend to contract-document and statement requests",
      "Introduce a dealer-facing channel so dealer staff can resolve finance questions instantly",
    ],
    stakeholders: [
      "Executive Officer, Retail Finance Business",
      "Head of Customer Servicing Centre operations",
      "General Manager, Information Systems",
      "Head of Dealer Relations / Sales Support",
      "Head of Compliance and Risk Management",
    ],
    discovery: [
      "What is the intent breakdown of servicing calls, and what share are payment-related changes?",
      "How are lease-end customers contacted today and what is the contact success rate?",
      "How much finance-servicing time is currently absorbed by dealer staff?",
      "Does Toyota group technology governance constrain vendor selection for the captive?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer trading in a Lexus calls at 21:00 for a payoff figure; the agent authenticates, calculates the settlement with fees explained and issues the written quote before the dealer appointment.",
  },

  "honda-finance": {
    operatingContext:
      "Honda Finance is Honda's domestic captive finance company, providing auto loans, leases and related credit products sold through the Honda dealer network to buyers of cars and motorcycles. Its in-force book generates the standard captive servicing load — payment-date and payment-method changes, statement and contract-copy requests, payoff quotes, end-of-term coordination and insurance-related questions — handled through a member web service, printed statements, dealer staff and telephone servicing centres. It is smaller than the Toyota captive with correspondingly less internal capacity and a leaner IT function, so the same servicing intents arrive against thinner resources. Honda's motorcycle business adds a customer segment with different finance products and a younger buyer profile more willing to use digital channels.",
    strategicPressure: [
      { text: "Honda Finance is the domestic captive providing loans and leases through Honda's car and motorcycle dealer network.", kind: "verified" },
      { text: "Captive servicing volume is driven by the in-force book rather than by new sales, so contact load persists regardless of market conditions.", kind: "verified" },
      { text: "A smaller captive has proportionally less internal servicing capacity for the same deterministic intent mix, which raises the value of containment.", kind: "inference" },
      { text: "The motorcycle segment's younger buyers are more likely to accept digital and messaging channels, making a staged channel rollout practical.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Vendor-delivered servicing platforms, outsourced or lean in-house contact operations, and no software product organisation. Honda's engineering and software investment sits in vehicles and mobility, not in finance-subsidiary customer channels — buy-led.",
    whyNotBuild:
      "Honda Finance would need Japanese speech, keigo-grade voice for regulated financial conversations, telephony, and integration into servicing and payment systems with financial-grade authentication and audit trails. For a captive of this size that is a disproportionate programme with no strategic return.",
    workflows: [
      {
        name: "Payment change and contract-servicing requests",
        friction: "Payment-date changes, bank-detail updates and contract-copy requests are handled by operators who authenticate manually and re-key data the system already holds.",
        outcome: "Authenticated changes and document requests executed conversationally with immediate confirmation, available outside business hours.",
        channels: ["Voice", "Web", "App"],
        systems: ["Loan / lease servicing system", "Payment and direct-debit processing", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Payoff quote and early-settlement handling",
        friction: "Customers replacing a vehicle need a settlement figure, which requires calculation and fee explanation and is often relayed via the dealer, adding a day to the sale.",
        outcome: "Settlement figures calculated and explained conversationally with a written quote issued immediately, removing the dealer relay.",
        channels: ["Voice", "Web", "App"],
        systems: ["Loan / lease servicing system", "Fee and settlement rules", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "End-of-term coordination for lease customers",
        friction: "End-of-term option selection, inspection and dealer coordination depend on manual outbound calling with low contact rates and slipped timelines.",
        outcome: "Proactive outreach ahead of term end capturing the customer's choice and booking the dealer appointment, with charge questions answered from contract terms.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Lease contract records", "Dealer appointment scheduling", "Inspection workflow"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A member web service for contract and payment information",
        "Telephone servicing operations for the in-force loan and lease book",
        "Dealer-facing finance support at the point of sale",
        "Direct-debit and payment processing infrastructure",
      ],
      gaps: [
        "No servicing channel outside business hours for deterministic requests",
        "Payoff quotes depend on human calculation and dealer relay",
        "End-of-term outreach has low contact success",
        "Dealer staff absorb finance servicing questions that reduce selling time",
      ],
    },
    risks: [
      "Consumer credit rules require robust authentication, clear disclosure and complete records for every servicing interaction, including automated ones.",
      "Arrears and hardship conversations must route to trained human staff under conduct expectations.",
      "Parent-company technology governance may influence vendor selection and must be checked before deployment planning.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a mid-size captive book; contact volumes by intent and current cost per contact must be validated with the servicing organisation in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling authenticated payment changes and document requests in Japanese with servicing-system write-back and immediate written confirmation.",
    expansion: [
      "Add payoff quote and early-settlement handling with automated quote issuance",
      "Introduce proactive end-of-term outreach with dealer appointment booking",
      "Open a dealer-facing channel for instant finance answers at the point of sale",
    ],
    stakeholders: [
      "Executive Officer, Retail Finance",
      "Head of Customer Servicing operations",
      "General Manager, Information Systems",
      "Head of Dealer Sales Support",
      "Head of Compliance",
    ],
    discovery: [
      "What is the monthly servicing contact volume and its breakdown by intent?",
      "Is the contact centre in-house or outsourced, and at what cost per contact?",
      "How are end-of-term lease customers contacted and what is the response rate?",
      "How much dealer time goes to answering finance servicing questions?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A motorcycle finance customer updates their bank details on LINE at 22:00; the agent authenticates, writes the change into the servicing system and confirms the next debit date.",
  },

  "nissan-financial-services": {
    operatingContext:
      "Nissan Financial Services is Nissan's domestic captive, financing car purchases and leases through the Nissan dealer network and servicing the resulting in-force book of loans, leases and related products. Its contact profile mirrors the captive category: payment-date and payment-method changes, payoff quotes, contract documents, end-of-term lease procedures and insurance-related coordination, reached through a member web service, statements, dealer staff and telephone servicing. What distinguishes it commercially is the parent context — Nissan has run sustained cost-reduction programmes that cascade into every subsidiary, which makes a servicing-cost reduction case unusually easy to land internally and unusually urgent for the people who own the budget.",
    strategicPressure: [
      { text: "Nissan Financial Services is the domestic captive supporting Nissan vehicle sales and servicing the resulting loan and lease book through the dealer network.", kind: "verified" },
      { text: "Nissan has pursued sustained group-wide cost reduction, which shapes budget and efficiency expectations at subsidiary level.", kind: "verified" },
      { text: "Captive servicing intents are deterministic and repetitive, so containment gains are achievable quickly and are easy to evidence to a cost-focused parent.", kind: "inference" },
      { text: "Cost programmes tend to cut contact-centre headcount before automation is in place, which creates a service-quality gap the deployment can fill.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Vendor-delivered servicing systems, lean IT, and a parent whose software investment is in vehicles and manufacturing. No captive of this size builds conversational AI, and the cost environment makes bought, usage-priced capacity far more attractive than capital projects — buy-led.",
    whyNotBuild:
      "Building would require Japanese speech, keigo-grade financial-conversation voice, telephony, financial-grade authentication and servicing-system integration. Under an active cost-reduction regime, a multi-year internal build is the least likely path any subsidiary would propose.",
    workflows: [
      {
        name: "Payment change and account-servicing requests",
        friction: "Payment-date and bank-detail changes and document requests occupy operators with manual authentication and re-keying, with volume unaffected by headcount cuts.",
        outcome: "Authenticated changes and document requests executed conversationally with immediate confirmation and out-of-hours availability, protecting service levels as headcount falls.",
        channels: ["Voice", "Web", "App"],
        systems: ["Loan / lease servicing system", "Payment and direct-debit processing", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Payoff quote and settlement enquiry handling",
        friction: "Settlement figures for trade-ins and early payoffs require calculation and fee explanation, and are often relayed through the dealer, slowing the vehicle transaction.",
        outcome: "Settlement figures produced and explained conversationally with a written quote issued immediately, accelerating the dealer's sale.",
        channels: ["Voice", "Web", "App"],
        systems: ["Loan / lease servicing system", "Fee and settlement rules", "Document generation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lease-end option capture and appointment booking",
        friction: "End-of-term outreach is manual, contact rates are low, and slipped decisions create remarketing and inventory friction downstream.",
        outcome: "Proactive multi-channel outreach capturing the customer's end-of-term choice and booking the dealer appointment, with charges explained from contract terms.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Lease contract records", "Dealer appointment scheduling", "Remarketing workflow"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A member web service for contract, payment and statement information",
        "Telephone servicing operations covering the in-force book",
        "Dealer-facing finance support at the point of sale",
        "Direct-debit and payment processing across the book",
      ],
      gaps: [
        "No out-of-hours servicing channel for deterministic requests",
        "Payoff quotes depend on human calculation and dealer relay",
        "End-of-term outreach relies on manual calling with poor contact rates",
        "Service levels are exposed if contact-centre headcount is reduced further",
      ],
    },
    risks: [
      "Consumer credit servicing requires strong authentication, disclosure and record-keeping that automated interactions must satisfy identically.",
      "Arrears and hardship handling must remain with trained human staff under conduct expectations.",
      "Parent-driven cost programmes can also constrain vendor spend, so a usage-priced commercial model is important to the internal case.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a mid-size captive book under cost pressure; contact volumes by intent and current cost per contact must be validated with the servicing organisation.",
    },
    pilotScope:
      "An eight-week pilot handling authenticated payment changes and payoff quotes in Japanese with servicing-system write-back, immediate written confirmation and arrears escalation.",
    expansion: [
      "Add contract-document and statement request handling",
      "Introduce proactive lease-end option capture with dealer appointment booking",
      "Open a dealer-facing channel for instant finance answers during the sale",
    ],
    stakeholders: [
      "Executive Officer, Retail Finance",
      "Head of Customer Servicing Centre",
      "General Manager, Information Systems",
      "Head of Dealer Sales Support",
      "Corporate planning lead responsible for cost programmes",
    ],
    discovery: [
      "What is the servicing contact volume and intent mix, and how has headcount changed recently?",
      "How are payoff quotes produced today and how long do they take to reach the dealer?",
      "What contact rate does end-of-term outreach currently achieve?",
      "What commercial model would fit the parent's cost-programme constraints?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer at a Nissan dealer needs a payoff figure to close a trade-in on the spot; the agent produces and sends the settlement quote in minutes instead of the next business day.",
  },

  "park24": {
    operatingContext:
      "Park24 operates the Times parking network — tens of thousands of unmanned car parks across Japan — and Times Car, the country's dominant car-sharing service, alongside mobility and fleet-management businesses. Its defining operational characteristic is that its assets are unmanned: parking lots run on gates, flap plates and payment machines with no staff, and shared vehicles sit in those lots waiting for members to unlock them with an IC card or app. When anything goes wrong — a gate that will not open, a payment machine error, a car that will not start, a vehicle returned to the wrong bay, a minor collision — the customer's only route to help is a support line, staffed around the clock. That call centre is effectively the entire human service layer of a business with a very large physical footprint, which makes it both a critical operation and an expensive one.",
    strategicPressure: [
      { text: "Park24 runs the Times unmanned parking network and Japan's leading car-sharing service, so its customer support operates 24 hours a day for physically unmanned assets.", kind: "verified" },
      { text: "Car-sharing membership in Japan has grown substantially, which increases support contact volume including vehicle trouble and accident first reception.", kind: "verified" },
      { text: "Night-time support staffing is among the hardest roles to recruit in Japan and commands premium wages, making overnight contact the most expensive part of the operation.", kind: "inference" },
      { text: "A high share of contacts are recoverable without dispatch — payment confusion, gate operation, vehicle-return procedure — but they must be handled immediately or the customer is stranded.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Park24's technology investment goes into IoT-enabled parking equipment, vehicle telematics and its member platform, all built with vendors and equipment partners; there is no conversational-AI capability and no reason to build one. Support operations are a cost centre with 24-hour staffing, which is the clearest possible buy-led case.",
    whyNotBuild:
      "The company would need Japanese speech robust to roadside noise and stressed callers, keigo-grade voice, telephony with 24-hour reliability, and integration into parking-equipment telemetry, member accounts, vehicle telematics and dispatch. Its engineering effort is in the physical estate, and support elasticity is precisely the thing worth renting.",
    workflows: [
      {
        name: "Parking gate and payment-machine trouble resolution",
        friction: "A driver blocked at a flap plate or payment machine calls a 24-hour line, describes the location and problem, and waits while an operator identifies the lot and issues a remote release or dispatches a patrol.",
        outcome: "Lot and equipment identified from the caller and telemetry immediately, guided resolution attempted, and remote release or patrol dispatch triggered with the incident logged.",
        channels: ["Voice", "App", "Web"],
        systems: ["Parking equipment telemetry / remote control", "Lot master data", "Patrol dispatch"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Car-share vehicle trouble and usage support",
        friction: "Members call because a car will not unlock or start, the previous user left it dirty or low on fuel, or they cannot extend a booking; each call is handled by an operator checking multiple systems.",
        outcome: "Member and vehicle identified instantly with telematics status, usage and booking issues resolved conversationally including extensions, and genuine faults escalated to dispatch or roadside assistance.",
        channels: ["Voice", "App", "LINE"],
        systems: ["Car-share booking platform", "Vehicle telematics", "Member account and billing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Accident and incident first reception",
        friction: "Minor collisions and damage reports arrive from distressed members at all hours and must be captured accurately for insurance while the member is guided on immediate steps.",
        outcome: "Structured first reception capturing time, location, parties and damage with immediate guidance on safety and police notification, escalating without delay to human staff for anything involving injury.",
        channels: ["Voice", "App"],
        systems: ["Incident / claims records", "Member account", "Insurance partner workflow"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A 24-hour support centre serving parking and car-share customers",
        "IoT-connected parking equipment with remote monitoring and control capability",
        "A member platform and app for car-share booking, unlocking and billing",
        "Patrol and maintenance teams dispatched to lots and vehicles",
      ],
      gaps: [
        "Every contact, however routine, consumes a 24-hour human operator",
        "Callers must describe their location verbally rather than being identified automatically",
        "Booking extensions and usage issues require an operator despite being deterministic",
        "No structured analysis of which lots and equipment generate repeat trouble calls",
      ],
    },
    risks: [
      "Accident and injury situations must escalate immediately to humans and emergency services with an unmistakable rule, and that boundary must be auditable.",
      "Remote gate release has physical and financial consequences, so automated release must be strictly bounded by verified telemetry and policy.",
      "Member and location data under APPI requires careful handling, particularly vehicle telematics and movement data.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a 24-hour unmanned-asset support operation; contact volumes by hour, the night-shift cost premium and the proportion resolvable without dispatch must be measured in discovery.",
    },
    pilotScope:
      "A ten-week pilot handling parking gate and payment-machine trouble calls in Japanese with lot identification from telemetry, guided resolution and bounded remote release, measured on containment and patrol dispatches avoided.",
    expansion: [
      "Extend to car-share vehicle trouble, booking extension and usage support",
      "Add structured accident and incident first reception with immediate human escalation",
      "Introduce equipment-failure pattern analysis feeding maintenance and lot design",
    ],
    stakeholders: [
      "Executive Officer, Parking Business",
      "Executive Officer, Mobility / Car-share Business",
      "Head of Customer Support Centre operations",
      "General Manager, IT / Systems",
      "Head of Equipment Maintenance and Patrol operations",
    ],
    discovery: [
      "What is the hourly distribution of support contacts and what does the night shift cost?",
      "What share of calls are resolved remotely versus requiring a patrol or roadside dispatch?",
      "Can parking equipment telemetry identify the lot and fault state at the moment of the call?",
      "What is the mandated escalation path for accident calls involving injury?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A driver stuck at a Times flap plate at 03:00 calls; the agent identifies the lot from telemetry, confirms payment status and releases the gate without waking a patrol crew.",
  },

  "duskin": {
    operatingContext:
      "Duskin operates two businesses under one franchise system: a direct-selling cleaning and hygiene business built on recurring rental of mops, mats and cleaning equipment delivered and exchanged on a regular cycle by franchisee route staff, and the Mister Donut food franchise. The cleaning business is the communications-heavy one — every household and business customer sits on a recurring visit schedule, and every schedule change, absence, product swap, contract change or new-service enquiry is a phone conversation between the customer and a local franchise office. Route staff are the same people who sell, deliver and collect, so telephone coordination competes directly with route time in a labour market where route positions are hard to fill. Franchisees each run their own small office, so the same coordination workload is duplicated hundreds of times across the network.",
    strategicPressure: [
      { text: "Duskin's core cleaning business is built on recurring rental of mops, mats and equipment exchanged on a regular visit cycle by franchisee route staff.", kind: "verified" },
      { text: "The business operates through a franchise system, so any centrally deployed capability lifts every franchisee at once while any local build helps only one.", kind: "verified" },
      { text: "Route staff recruitment is difficult, so time lost to telephone coordination directly reduces the number of customer visits a franchise can serve.", kind: "inference" },
      { text: "Schedule changes and temporary suspensions are the highest-volume contact type and are almost entirely deterministic, making them ideal automation candidates.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A franchise services company with vendor-supplied route and order systems and no software organisation; its franchisees are small businesses with no technology capability at all. Central deployment of bought capability is the only model that works economically — buy-led with a franchise-system distribution advantage.",
    whyNotBuild:
      "Duskin would need Japanese speech, keigo-grade voice for household customers, telephony fronting hundreds of franchise offices, and integration into route scheduling and customer contract systems. No franchisor of this type builds that; the value is a capability the head office deploys and every franchisee inherits.",
    workflows: [
      {
        name: "Service-visit rescheduling and temporary suspension",
        friction: "Customers call the local office to move a visit, skip a cycle or suspend service while away; office staff or route staff take the call and manually adjust the route plan.",
        outcome: "Change, skip and suspension requests captured conversationally against the route schedule and confirmed to both customer and route staff, without interrupting deliveries.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Route scheduling system", "Customer contract records", "Franchisee operations records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Product change and additional-service enquiries",
        friction: "Requests to change mop or mat types, add products or ask about new services require a conversation with someone who knows the catalogue, and are often deferred to the next visit.",
        outcome: "Catalogue questions answered and product changes captured immediately against the contract, with sales opportunities routed to the franchise with the details already gathered.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Product catalogue and pricing", "Customer contract records", "Franchisee sales records"],
        value: 2,
        complexity: 2,
      },
      {
        name: "New-customer enquiry intake and estimate booking",
        friction: "Enquiries about cleaning services and home-cleaning products arrive by phone and web to offices that may be closed or whose staff are on route, so response is delayed.",
        outcome: "Enquiries qualified conversationally at any hour with service area, needs and timing captured, and estimate visits booked directly into the franchise schedule.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Franchise territory / area mapping", "Route and estimate scheduling", "Sales CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national franchise network delivering recurring cleaning and hygiene rental services",
        "Route scheduling and delivery operations with regular visit cycles",
        "Franchise office telephone lines as the customer contact point",
        "A web presence for service information and enquiries",
      ],
      gaps: [
        "Schedule changes require reaching a franchise office during business hours",
        "Route staff are interrupted by coordination calls that reduce visit capacity",
        "New enquiries arriving out of hours wait for a callback",
        "Customer-facing service quality varies franchise by franchise with no shared capability",
      ],
    },
    risks: [
      "Franchise agreements govern how customers are contacted and who owns the relationship, so a central capability must be structured to reinforce rather than bypass franchisees.",
      "Customer address and visit-schedule data under APPI needs a clear controller-processor structure between franchisor and franchisees.",
      "Route feasibility must be respected when accepting schedule changes, or the automation simply moves the problem to the route staff.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.0,
      automationRate: 0.6,
      basis: "Seller assumptions aggregating franchise-office telephone traffic that is almost certainly not centrally measured; a franchise-level call audit is the first discovery task.",
    },
    pilotScope:
      "An eight-week pilot handling service-visit rescheduling and temporary suspension requests for a defined franchise cluster in Japanese, with route-schedule write-back and confirmation to route staff.",
    expansion: [
      "Add product change and additional-service enquiry handling with franchise sales handoff",
      "Extend to new-customer enquiry intake and estimate-visit booking",
      "Roll the capability network-wide as a franchisor-provided service",
    ],
    stakeholders: [
      "Executive Officer, Direct Selling / Cleaning Business",
      "Head of Franchise Support and Operations",
      "General Manager, Information Systems",
      "Regional franchise operations managers",
      "Head of Product and Service Planning",
    ],
    discovery: [
      "How many customer calls does a typical franchise office receive daily and what is the intent mix?",
      "Is route scheduling centrally systematised or managed franchise by franchise?",
      "How much route-staff time is lost to telephone coordination each week?",
      "How would franchise agreements need to change for a central contact capability?",
    ],
    flowTemplate: "appointments",
    scenario: "A customer calls at 20:00 to skip next week's mop exchange while travelling; the agent adjusts the route schedule and confirms the resumed date without the route staff being interrupted.",
  },

  "oriental-land": {
    operatingContext:
      "Oriental Land operates Tokyo Disneyland and Tokyo DisneySea under licence from Disney, together with the Disney hotels, Ikspiari retail and monorail operations on the Maihama resort site. It is an operating company, not a content or software company: its business is running two of the world's most visited theme parks and the hotel and retail estate around them at extremely high service standards. Guest contact is enormous and varied — park ticket and entry questions, hotel and vacation-package reservations and changes, accessibility and disability-services planning, restaurant and experience reservations, lost property, and enquiries during weather closures and event periods. Guests reach it through the official app and website, a reservation centre and guest information lines, and increasing international visitation adds English and Chinese demand to a contact operation whose service-quality bar is among the highest in Japan.",
    strategicPressure: [
      { text: "Oriental Land operates the Tokyo Disney Resort under licence and is an operating and hospitality company rather than a technology or content company.", kind: "verified" },
      { text: "Inbound international visitation to the resort has been growing, adding multilingual guest-contact demand on top of a large domestic base.", kind: "verified" },
      { text: "The resort's service standards are exceptionally high and brand-governed, which makes tone quality a gating requirement for any guest-facing automation.", kind: "verified" },
      { text: "Reservation and information contacts spike around ticket on-sales, event announcements and weather closures in patterns a fixed-headcount centre cannot absorb.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Oriental Land buys its reservation, ticketing and app technology and invests its own capability in park operations, attraction development and guest experience delivery. There is no software product organisation and no evidence of internal conversational-AI capability — buy-led, with brand governance rather than build capability as the gating factor.",
    whyNotBuild:
      "The company would need Japanese speech, keigo-grade voice capable of representing a brand with the highest service expectations in the market, plus English and Chinese, telephony fronting a large reservation and information operation, and integration into ticketing, hotel PMS and dining reservation systems. Its whole model is licensing world-class experience design and executing it operationally, not building infrastructure.",
    workflows: [
      {
        name: "Hotel and vacation-package reservation changes",
        friction: "Guests call the reservation centre to change dates, room types and package components; queues lengthen around on-sale windows and school holidays, and complex packages require long calls.",
        outcome: "Package and hotel changes executed conversationally against live availability with conditions explained, in three languages, at any hour, with complex multi-component cases escalated.",
        channels: ["Voice", "Web", "App"],
        systems: ["Hotel PMS", "Vacation-package reservation system", "Payment processing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Guest information and visit-planning enquiries",
        friction: "Ticket types, entry rules, operating hours, height and age restrictions, park rules and event details are asked constantly in several languages against an information line with fixed hours.",
        outcome: "Visit-planning questions answered instantly from governed park information in Japanese, English and Chinese, absorbing announcement-driven spikes without staffing.",
        channels: ["Voice", "App", "LINE"],
        systems: ["Park information base", "Ticketing platform", "Event and operating-hours data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Accessibility and disability-services planning",
        friction: "Guests with disabilities plan visits by phone, discussing attraction access, mobility equipment, service animals and companion arrangements, which requires knowledgeable staff and long conversations.",
        outcome: "Accessibility information provided accurately from governed sources with requirements captured ahead of the visit and passed to guest services, and anything requiring judgement handled by trained staff.",
        channels: ["Voice", "Web", "App"],
        systems: ["Accessibility information base", "Guest services records", "Reservation records"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "An official app and website covering tickets, entry, dining and experience reservations",
        "A reservation centre for hotels and vacation packages",
        "Guest information lines covering park, ticket and event enquiries",
        "On-site guest services and lost-property operations at the resort",
      ],
      gaps: [
        "Reservation changes are constrained to centre hours despite international guests booking across time zones",
        "Information-line capacity does not flex with announcement and on-sale spikes",
        "English and Chinese voice support is limited relative to visitor mix",
        "Accessibility planning depends entirely on reaching specialist staff by phone",
      ],
    },
    risks: [
      "Brand standards are licensed and strictly governed, so automated guest-facing voice requires explicit approval and a documented tone-evaluation regime.",
      "Accessibility information carries safety and legal weight; the agent must state only governed facts and escalate any judgement to trained guest services.",
      "APPI and payment-card handling apply to reservation records, so card capture must remain outside the conversational layer.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions for a very large guest-contact operation; reservation-centre and information-line volumes, spike profiles and language mix must be validated in discovery.",
    },
    pilotScope:
      "A ten-week pilot answering guest information and visit-planning enquiries in Japanese, English and Chinese from governed park information sources, with a documented tone-evaluation gate and escalation to guest services.",
    expansion: [
      "Extend to hotel and vacation-package reservation changes against live availability",
      "Add accessibility and disability-services planning capture with specialist escalation",
      "Introduce proactive guest outreach for weather closures and event changes affecting booked visits",
    ],
    stakeholders: [
      "Executive Officer, Theme Park Operations",
      "Head of Reservation Centre operations",
      "Head of Guest Services and Accessibility",
      "General Manager, Information Systems / Digital",
      "Head of Brand Standards and Licensing Compliance",
    ],
    discovery: [
      "What are the monthly volumes on the reservation centre versus the guest information lines?",
      "What brand-standard approval process governs automated guest-facing communications?",
      "What proportion of contacts arrive in English and Chinese, and how are they handled today?",
      "How does contact volume behave in the hour after a major event or ticket announcement?",
    ],
    flowTemplate: "appointments",
    scenario: "An overseas family asks in English at 03:00 JST about height restrictions, hotel package changes and stroller access, and completes the booking change in one conversation.",
  },

  "shiseido-japan": {
    operatingContext:
      "Shiseido's Japan business sells prestige and mass-market cosmetics and personal-care brands through department-store counters staffed by beauty consultants, drugstore and mass channels, its own e-commerce and membership platform, and specialty stores. Its consumer centre handles product usage questions, ingredient and suitability enquiries, quality complaints, and guidance on which product suits a particular skin concern — conversations where tone, empathy and accuracy carry real brand weight. Consumers reach it by phone, web form, the brand app and increasingly LINE, with a customer base spanning older loyal users who phone and younger consumers who message. At the same time, beauty consultants at department-store counters are increasingly hard to recruit and retain, which makes protecting their time for genuine face-to-face consultation a strategic concern rather than an efficiency one.",
    strategicPressure: [
      { text: "Shiseido's Japan business relies on beauty consultants at department-store and specialty counters as a core part of its selling model.", kind: "verified" },
      { text: "The company has invested significantly in digital and e-commerce capability in Japan, giving it internal digital teams that would govern any customer-facing deployment.", kind: "verified" },
      { text: "Beauty-consultant recruitment and retention has become harder as retail service work competes with other sectors, making consultant time a scarce asset.", kind: "inference" },
      { text: "A meaningful share of consumer-centre contacts are routine product, availability and usage questions that displace capacity from genuine consultation and quality handling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led: Shiseido has real digital marketing and e-commerce capability and will govern any consumer-facing deployment closely, but it builds brand and commerce experiences rather than speech infrastructure. The right sale is a keigo-quality voice layer for routine consumer-centre intents that its digital teams integrate and supervise.",
    whyNotBuild:
      "Shiseido's digital organisation builds commerce, CRM and content experiences. Japanese ASR, keigo-grade TTS at a beauty-brand tone standard, telephony into the consumer centre and per-conversation evaluation is a different discipline entirely, and its digital roadmap is about commerce growth, not infrastructure.",
    workflows: [
      {
        name: "Routine product and usage enquiry handling",
        friction: "Consumers phone about how to use a product, application order, shade selection basics, shelf life and where to buy, occupying consumer-centre advisors trained for deeper consultation.",
        outcome: "Routine product, usage and availability questions answered accurately from governed product information in brand-appropriate tone, freeing advisors for consultation and quality cases.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Product information base", "Store and stock locator", "Consumer CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Counter appointment booking and consultant scheduling",
        friction: "Consumers wanting a counter consultation or a skin-measurement session book by calling the store or turning up, so consultant time is used unevenly and walk-in peaks leave counters overloaded.",
        outcome: "Counter appointments booked conversationally against consultant availability with the consumer's concern captured in advance, improving consultant utilisation and consultation quality.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Counter appointment scheduling", "Consumer CRM", "Store staffing data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Quality-concern intake and escalation",
        friction: "Reports of irritation, product defects or packaging issues arrive by phone and require careful, empathetic capture of details before routing to quality assurance, which is slow and inconsistently documented.",
        outcome: "Structured, empathetic intake capturing product, lot, symptom and timeline with immediate escalation to a human advisor for anything involving a health effect, and consistent documentation to quality assurance.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Quality assurance case system", "Product and lot records", "Consumer CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A consumer centre handling product, usage and quality enquiries by phone and web",
        "Beauty consultants at department-store and specialty counters providing in-person consultation",
        "A brand membership and e-commerce platform with consumer accounts",
        "LINE and app channels used for marketing and consumer communication",
      ],
      gaps: [
        "Consumer-centre support is limited to business hours for a consumer base that shops at night",
        "Counter consultations cannot be booked conversationally with the concern captured in advance",
        "Routine questions displace advisor capacity from consultation and quality work",
        "No structured link between consumer-centre contacts and the counter consultation record",
      ],
    },
    risks: [
      "Cosmetics claims are regulated in Japan, so the agent must state only approved product information and never make efficacy claims beyond the approved wording.",
      "Any report of a skin reaction or health effect must escalate immediately to a human advisor and into the quality process, with no automated reassurance.",
      "Brand tone is a governed asset, so keigo and voice quality require sign-off from brand and consumer-centre leadership before launch.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions for a consumer-centre operation; the actual split between routine questions, consultation and quality contacts must be measured in discovery because it determines the achievable automation rate.",
    },
    pilotScope:
      "An eight-week pilot answering routine product, usage and availability enquiries in Japanese with governed product information, brand-tone evaluation and immediate escalation of any skin-reaction report.",
    expansion: [
      "Add counter appointment booking with advance capture of the consumer's concern",
      "Extend to structured quality-concern intake feeding the quality assurance process",
      "Introduce English and Chinese coverage for inbound and travel-retail consumers",
    ],
    stakeholders: [
      "Head of Consumer Centre / Customer Relations, Japan",
      "Executive responsible for Japan Business / Brand marketing",
      "Head of Digital and E-commerce, Japan",
      "Head of Quality Assurance",
      "Head of Retail Operations and beauty-consultant management",
    ],
    discovery: [
      "What is the contact mix at the consumer centre between routine, consultative and quality contacts?",
      "What approval process governs the wording an agent may use about products?",
      "How are counter consultations booked today, and is consultant availability systematised?",
      "What escalation path exists for a reported skin reaction, and how quickly must it trigger?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A consumer asks at 22:00 which of two Shiseido serums suits dry winter skin and books a counter consultation for Saturday with the concern already recorded.",
  },

  "askul": {
    operatingContext:
      "ASKUL is Japan's leading business-to-business office-supplies e-commerce operator, serving hundreds of thousands of SME customers with next-day and same-day delivery from its own distribution centres, alongside the LOHACO consumer channel operated with a major platform partner. Its customers are small businesses ordering consumables repeatedly, and the contacts they generate are transactional and time-critical: order changes and cancellations before cut-off, delivery status and missed-delivery issues, returns and wrong-item claims, invoice and account questions, and product availability. Those customers are office managers and owners who often prefer to phone rather than navigate a portal, particularly when something has gone wrong. ASKUL runs genuine internal logistics and fulfilment engineering, so it is a technically capable buyer, but its customer-contact operations remain conventional.",
    strategicPressure: [
      { text: "ASKUL serves a very large SME customer base with next-day delivery from its own distribution network, making delivery reliability the core of its value proposition.", kind: "verified" },
      { text: "The company operates its own fulfilment and logistics technology capability, so it is a technically sophisticated buyer rather than a passive one.", kind: "verified" },
      { text: "Delivery-labour scarcity and the 2024 driver-hour constraints put direct pressure on the next-day promise that ASKUL's proposition depends on.", kind: "verified" },
      { text: "SME customers phone rather than use self-service precisely at exception moments, so the contact mix is weighted toward time-critical problems rather than routine queries.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led: ASKUL has real engineering capability in fulfilment and commerce, so it will integrate deeply and expect architectural transparency, but speech, telephony and conversational evaluation are outside its stack. The sale is voice workflows that complement its logistics engineering rather than a system it would consider building.",
    whyNotBuild:
      "ASKUL's engineers build warehouse automation, order management and commerce systems. Japanese ASR, keigo-grade TTS, carrier telephony and per-conversation evaluation would be a new platform discipline with no relationship to its logistics advantage, and its roadmap is committed to fulfilment capacity and delivery reliability.",
    workflows: [
      {
        name: "Order change and cancellation before cut-off",
        friction: "SME customers phone to add, change or cancel items against a tight fulfilment cut-off; the call must be handled fast or the order ships wrong, and operators work across order and warehouse systems manually.",
        outcome: "Order changes and cancellations executed conversationally against live order status and cut-off windows, with clear confirmation of what was and was not possible.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Order management system", "Warehouse / fulfilment status", "Customer account records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Delivery status and missed-delivery resolution",
        friction: "Where is my order calls dominate inbound, and missed deliveries to offices closed at delivery time require rescheduling coordinated with carriers.",
        outcome: "Authenticated live delivery status answered instantly, redelivery arranged against carrier feasibility, and proactive notification for at-risk deliveries suppressing status calls entirely.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Order management system", "Carrier tracking feeds", "Customer account records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Returns, wrong-item claims and invoice enquiries",
        friction: "Wrong or damaged items and invoice or account questions require operators to verify order history and apply return policy, with resolution frequently deferred to a follow-up call.",
        outcome: "Return and claim intake structured with policy applied consistently and replacement or credit initiated in-conversation, and invoice questions answered from account records.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Order management system", "Returns / claims workflow", "Billing and account records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A B2B e-commerce platform with business account management and ordering history",
        "Own distribution centres with next-day and same-day delivery operations",
        "A customer service centre handling order, delivery and account contacts",
        "Carrier integrations providing shipment tracking to customers",
      ],
      gaps: [
        "Order changes against tight cut-offs depend on reaching a human quickly enough",
        "Delivery status calls persist despite tracking being available online",
        "Missed deliveries to closed offices are resolved reactively rather than prevented",
        "Returns and claims frequently require a second contact to complete",
      ],
    },
    risks: [
      "Order changes have direct fulfilment consequences, so the agent must act only within verified cut-off and warehouse status and never promise a change the system cannot execute.",
      "Business customer and account data under APPI requires authentication before order or invoice details are disclosed, including when several people at one customer call.",
      "Redelivery commitments must respect carrier driver-hour constraints rather than simply being accepted.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions for a large B2B e-commerce servicing operation; contact volumes by intent, the phone-versus-web split and the proportion of contacts arriving before cut-off must be measured in discovery.",
    },
    pilotScope:
      "An eight-week pilot handling delivery-status enquiries and missed-delivery redelivery arrangement in Japanese with authenticated account access and carrier-feasibility checks, measured on status-call suppression.",
    expansion: [
      "Add order change and cancellation handling against live cut-off and warehouse status",
      "Introduce proactive at-risk delivery notification to office customers",
      "Extend to returns, wrong-item claims and invoice enquiry handling",
    ],
    stakeholders: [
      "Executive Officer, B2B Business",
      "Head of Customer Service Centre operations",
      "CTO / Head of Technology",
      "Head of Logistics and Fulfilment operations",
      "Head of Customer Experience / CRM",
    ],
    discovery: [
      "What share of customer contacts are delivery-status enquiries that the portal already answers?",
      "How many order changes arrive by phone before cut-off, and what is the failure rate?",
      "Can order management expose live cut-off and warehouse status to an external conversational layer?",
      "How are missed deliveries to closed offices handled today with carrier partners?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An office manager calls at 08:10 to add toner to an order shipping that morning; the agent checks the warehouse cut-off, applies the change and confirms same-day delivery.",
  },
};
