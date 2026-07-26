// Deep analysis blocks for the first 50 India consumer profiles.
// Evidence discipline: "verified" only for widely-reported public facts.
// No fabricated figures, quotes, dates, or URLs. Economics are explicitly
// seller assumptions to be validated in discovery.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_INDIA_CONSUMER_A: Record<string, ProfileAnalysis> = {
  "mahindra-mahindra-auto": {
    operatingContext:
      "Mahindra & Mahindra's automotive division sells SUVs under the Scorpio, Thar, XUV and BE/XEV electric-origin nameplates, alongside a large pickup and light-commercial business, and separately runs India's largest tractor franchise under Mahindra Farm Equipment. Vehicles reach customers through a franchised dealer network spread across metros, tier-2 towns and deep rural districts, with sales, service and spares all executed by the dealer rather than the OEM. Popular nameplates have repeatedly carried multi-month waiting periods, so a large share of owner contact happens between booking and delivery, and again at each periodic service. The company reaches customers today through dealer telephony, an owner app and connected-vehicle services, with the OEM contact centre acting as an escalation layer above the dealer.",
    strategicPressure: [
      { text: "Mahindra's SUV portfolio has been demand-led with extended waiting periods on flagship nameplates, making booking-to-delivery communication a brand-defining moment rather than an administrative one.", kind: "verified" },
      { text: "The group's EV push (BE and XEV branded electric SUVs) introduces an entirely new question set — charging, range, warranty on the battery, software updates — that dealer sales consultants are not uniformly trained to answer.", kind: "verified" },
      { text: "Because service is delivered by franchised dealers, the OEM has limited visibility into what an owner was actually told, which shows up as inconsistent service-retention performance across the network.", kind: "inference" },
      { text: "Presence of Tech Mahindra inside the group creates an internal-first reflex on technology decisions, so any external platform must be positioned as accelerating the auto business rather than competing with group IT.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The group demonstrably has engineering capacity through Tech Mahindra and an in-house digital team for connected-vehicle services, so this is not a company that lacks builders. What it lacks is a productised speech-plus-telephony-plus-orchestration layer tuned for Indian regional-language dealer conversations, and the auto business has historically procured customer-experience tooling rather than commissioning it internally.",
    whyNotBuild:
      "Building would mean owning ASR and TTS quality across Marathi, Tamil, Telugu and code-switched Hindi, carrier-grade telephony into thousands of dealer numbers, an orchestration layer that writes back into dealer DMS instances the OEM does not control, and a continuous evaluation harness. None of that advances Mahindra's actual competitive assets — vehicle platforms, powertrain, and the dealer footprint — and a group SI would price an internal build against a delivery timeline measured in quarters, not weeks.",
    workflows: [
      {
        name: "Booking-to-delivery status and allocation updates",
        friction: "Customers waiting months for a high-demand SUV call the dealer sales consultant repeatedly; the consultant has no reliable allocation date and improvises an answer, which the customer then treats as a commitment.",
        outcome: "A single grounded answer on allocation stage and expected window, delivered proactively at each state change, cutting inbound status calls and reducing cancellation-to-competitor during the wait.",
        channels: ["WhatsApp", "Voice", "Owner app"],
        systems: ["Dealer DMS", "OEM order/allocation system", "CRM", "Vehicle dispatch/logistics tracking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Periodic service booking and slot confirmation",
        friction: "Service booking runs through dealer workshop phone lines that are busy at opening hours; missed calls are never returned, and service-due reminders are generic SMS blasts with no way to book back.",
        outcome: "Owners book, reschedule and confirm a workshop slot inside the conversation in their own language, raising service-retention on vehicles past the free-service period.",
        channels: ["Voice", "WhatsApp", "Owner app"],
        systems: ["Dealer DMS workshop scheduler", "Service history / warranty system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "EV pre-purchase and ownership question handling",
        friction: "Charging, range in real conditions, home-charger installation and battery-warranty questions are answered differently by every dealer consultant, and there is no authoritative conversational source an owner can reach at night.",
        outcome: "Grounded, citable EV answers available 24/7 in regional languages, with genuine purchase intent routed to a dealer consultant with the conversation attached.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Product/spec knowledge base", "Charging-network partner data", "Lead CRM", "Dealer DMS"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An owner mobile app carrying service history, service booking and connected-vehicle features on eligible models",
        "A central OEM customer-care telephone number sitting above dealer-level service contact",
        "Dealer-operated sales and workshop phone lines as the primary day-to-day customer channel",
        "SMS and app-notification service-due reminders to registered owners",
      ],
      gaps: [
        "No conversational path that returns a real allocation or delivery date grounded in the OEM order system",
        "Regional-language support depends on which individual answers the dealer phone, not on a governed capability",
        "Owners cannot complete a workshop booking end-to-end outside dealer working hours",
        "No consistent EV knowledge layer — charging, warranty, software — reachable in the customer's language",
      ],
    },
    risks: [
      "TRAI commercial-communication rules govern outbound voice and SMS to owners; delivery and service outreach must run on registered headers with consent scrubbed against DND registers",
      "DPDP obligations apply to owner personal data shared with franchised dealers, which are separate legal entities — data flows into dealer DMS instances need a documented basis",
      "Dealer DMS estates are fragmented across DMS vendors and versions; write-back capability must be proven per-DMS before an outcome can be promised",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions derived from installed-base scale and typical OEM-plus-dealer contact rates; every figure requires validation against Mahindra's actual dealer and central contact-centre volumes in discovery.",
    },
    pilotScope:
      "A 10-week pilot on booking-to-delivery status for one high-demand SUV nameplate across 40-60 dealerships in three states, in Hindi, Marathi and English, grounded in the OEM allocation system with write-back to dealer CRM.",
    expansion: [
      "Extend from delivery status into periodic service booking and slot confirmation across the same dealer cluster",
      "Add regional-language coverage (Tamil, Telugu) and take the same layer into the tractor and Farm Equipment dealer network",
      "Bring in EV ownership support and post-service feedback, with dealer-level quality scoring surfaced back to the OEM",
    ],
    stakeholders: [
      "Chief Executive, Automotive Division",
      "Head of Customer Care / Customer Experience, Auto",
      "Head of Service and Spares (After-Sales)",
      "Chief Digital Officer / Head of Digital, Auto Sector",
      "Head of Dealer Network Development",
    ],
    discovery: [
      "How much of your owner contact lands on dealer phone lines versus the OEM central number, and do you have visibility into what happens on the dealer side?",
      "When a customer asks for a delivery date on a waitlisted nameplate today, what system does the answer come from, and how often is it wrong?",
      "Which DMS platforms are in use across the network, and do you have write-back capability into workshop scheduling today?",
      "Where does the decision on a customer-facing conversational platform sit — the auto division, group digital, or Tech Mahindra?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A Thar customer four months into the waiting period asks in Marathi when the vehicle will be allocated, and gets a real answer plus a service-centre handover slot.",
  },

  "royal-enfield": {
    operatingContext:
      "Royal Enfield, the motorcycle business of Eicher Motors, builds mid-capacity motorcycles — the Classic, Bullet, Meteor, Himalayan and Hunter families — and sells them through company-appointed dealerships and studio stores across India plus a growing international network. Unlike volume two-wheeler brands, its economics lean on brand community, accessories and apparel merchandising, and a service relationship that owners actively care about. Owners contact the brand about service slots, spares availability for older motorcycles, accessory fitment, and participation in organised rides and events. Today those conversations run through dealer workshop phone lines, a central customer-care number, the brand's app and e-commerce store, and highly active social and community channels.",
    strategicPressure: [
      { text: "Royal Enfield's product strategy has broadened well beyond the classic 350cc single into multiple new platforms, which multiplies the spares and service-knowledge surface dealers must answer for.", kind: "verified" },
      { text: "The brand competes on ownership experience and community rather than price, so a poor service-booking experience damages the exact asset the premium is built on.", kind: "inference" },
      { text: "International expansion into Europe, the Americas and Southeast Asia adds a second language and time-zone burden onto a support model built for India.", kind: "inference" },
      { text: "Spares availability for long-lived older motorcycles is a recurring owner grievance that currently resolves only through a dealer manually checking parts systems.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Eicher Motors is a manufacturing group whose technology investment goes into motorcycle platforms, manufacturing and the connected-motorcycle features on newer models. There is no evidence of an internal contact-centre or conversational-AI engineering function, and customer support has been operated in the conventional OEM-plus-dealer model.",
    whyNotBuild:
      "The capability gap is not application code — it is multilingual speech recognition on noisy mobile calls, telephony integration across dealer and central numbers, orchestration into parts and workshop systems, and ongoing evaluation. For a company whose engineering identity is engines and chassis, standing up and staffing that stack permanently is a distraction with no brand return.",
    workflows: [
      {
        name: "Service-slot booking and workshop reminders",
        friction: "Owners call the dealer workshop and get an engaged tone at peak hours; service-due reminders arrive as SMS with no booking path, so the owner defers service and eventually drifts to an independent garage.",
        outcome: "Booking completed inside the conversation against live workshop capacity, lifting authorised-workshop retention on motorcycles beyond the warranty period.",
        channels: ["WhatsApp", "Voice", "Brand app"],
        systems: ["Dealer DMS workshop scheduler", "Service and warranty history", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Spares and accessory availability lookup",
        friction: "An owner asking whether a specific part fits their model year gets a promise of a call-back; the dealer checks the parts system manually and frequently does not call back at all.",
        outcome: "Fitment-checked availability answered in-conversation with an order or dealer-reservation placed, converting frustrated enquiries into accessory and spares revenue.",
        channels: ["WhatsApp", "Voice", "Web store"],
        systems: ["Spare-parts catalogue / parts master", "Dealer inventory", "E-commerce order system"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Ride, event and community enquiry handling",
        friction: "Organised-ride registrations, eligibility and logistics questions land in social inboxes and dealer phones during campaign spikes, where a small team cannot keep up and enquiries go cold.",
        outcome: "Elastic handling of event-driven spikes with registration completed in-channel, protecting the community programme that underpins the brand premium.",
        channels: ["WhatsApp", "Social messaging", "Web"],
        systems: ["Event registration platform", "CRM", "Owner database"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A brand-owned mobile app with service booking and ownership content for registered owners",
        "A central customer-care telephone line above dealer-level workshop contact",
        "A direct e-commerce store for apparel, accessories and genuine motorcycle parts",
        "Active social and community messaging channels used heavily around rides and launches",
      ],
      gaps: [
        "No way to confirm a live workshop slot outside dealer working hours",
        "Part-fitment and availability questions cannot be resolved without a human checking a parts system",
        "Regional-language support is inconsistent between dealer locations",
        "International owners have no support path aligned to their time zone or language",
      ],
    },
    risks: [
      "TRAI DND and registered-header rules constrain outbound service-due and event outreach to owners",
      "DPDP consent required before owner contact data is used for accessory and merchandise outreach, which is marketing rather than service",
      "Any commitment on spares availability is only as good as dealer inventory accuracy; over-promising in-conversation creates a worse experience than the current call-back",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions based on the scale of the owner base and typical service-and-spares contact rates for a premium two-wheeler brand; validate against Royal Enfield's central and dealer contact volumes.",
    },
    pilotScope:
      "An 8-week pilot automating service-slot booking and service-due follow-up across one metro dealer cluster in Hindi, English and Tamil, integrated with the DMS workshop scheduler.",
    expansion: [
      "Add spares and accessory fitment lookup with dealer reservation",
      "Extend to the full India dealer network with Kannada and Marathi coverage",
      "Take the same layer into selected international markets for time-zone-independent owner support",
    ],
    stakeholders: [
      "Head of Customer Experience, Royal Enfield",
      "Head of After-Sales / Service",
      "Head of Spare Parts and Accessories Business",
      "Chief Information Officer, Eicher Motors",
      "Head of Brand and Community",
    ],
    discovery: [
      "What proportion of service bookings are taken by phone at the dealership versus through the app, and what does your abandonment look like at peak?",
      "How do you measure authorised-workshop retention after the free-service period, and where does it drop?",
      "Can dealer parts inventory be queried in real time today, or is fitment always a manual look-up?",
      "Is customer support centrally owned, or does each dealership define its own service level?",
    ],
    flowTemplate: "appointments",
    scenario: "A Classic 350 owner in Coimbatore asks in Tamil for a Saturday service slot and confirms it in the same conversation.",
  },

  "ather-energy": {
    operatingContext:
      "Ather Energy designs and manufactures electric scooters — the 450 family and the Rizta — and, unusually for an Indian two-wheeler maker, also builds and operates its own fast-charging network and the vehicle software stack that runs on the scooter's touchscreen dashboard. It sells through company-operated experience centres and an expanding partner-retail footprint concentrated in metros and larger tier-2 cities. Its customers are digitally fluent early adopters who expect app-first service, but the highest-friction moments — a scooter that will not start, a charger that is occupied or down, a service visit needed urgently — still collapse into phone calls. Today the company reaches customers through its app, the in-vehicle dashboard, experience-centre staff and a support line.",
    strategicPressure: [
      { text: "Ather is vertically integrated in a way its rivals are not — it owns the charging network and the vehicle software, which means it also owns the blame when either fails.", kind: "verified" },
      { text: "Expansion beyond the metros into smaller cities takes the brand into markets where English-first, app-first support assumptions break down.", kind: "inference" },
      { text: "As a listed company, service-network cost per vehicle and support headcount growth become visible line items that must scale sub-linearly with the installed base.", kind: "inference" },
      { text: "A strong in-house product-engineering culture means any external conversational layer will be evaluated against 'we could build this ourselves in a quarter' and must win on speech, telephony and evaluation depth rather than application logic.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. Ather genuinely has software engineers and ships its own vehicle OS and consumer app, so a pure buy framing will be rejected. The credible motion is co-build: Ather owns the customer experience and the app surface, while the speech, telephony, orchestration and evaluation substrate is supplied and operated by a partner.",
    whyNotBuild:
      "Ather's engineering scarcity is real — the same team that would build a voice stack is the team shipping vehicle software and battery-management features, which are the actual competitive assets. Multilingual ASR tuned to Indian road-noise mobile calls, carrier telephony, and a continuous evaluation harness are all fixed costs with no product differentiation for a scooter company, and diverting scarce engineers to them is the expensive choice, not the cheap one.",
    workflows: [
      {
        name: "Charging-network and range assistance",
        friction: "A rider low on charge finds the nearest Ather Grid point occupied or unavailable; the app shows a status that may be stale, and the only recovery path is calling support and waiting.",
        outcome: "Live charger availability and a routed alternative delivered conversationally in seconds, converting the single worst EV ownership moment into a resolved one.",
        channels: ["Voice", "App chat", "WhatsApp"],
        systems: ["Charging-network telemetry", "Connected-vehicle telemetry", "Mapping/routing service"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Service booking and roadside-assistance triage",
        friction: "A scooter that will not start produces a phone call where a human asks diagnostic questions the vehicle telemetry already answers, then books a service slot manually.",
        outcome: "Telemetry-grounded triage that distinguishes a software issue, a charge issue and a genuine breakdown, then books the service slot or dispatches assistance without a human first-touch.",
        channels: ["Voice", "App chat", "WhatsApp"],
        systems: ["Connected-vehicle telemetry", "Service centre scheduling", "Roadside-assistance dispatch", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Test-ride booking and pre-purchase questions in new cities",
        friction: "In newly entered cities, enquiry volume outstrips the small local team, and prospects asking about subscription features, charging at home, or state subsidy eligibility wait days for a call-back.",
        outcome: "Immediate, grounded answers and a booked test ride in the prospect's language, protecting conversion in exactly the markets where the brand is least known.",
        channels: ["WhatsApp", "Web chat", "Voice"],
        systems: ["Lead CRM", "Experience-centre scheduling", "Product/subsidy knowledge base"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer mobile app tightly integrated with the scooter, covering ride data, charging and service booking",
        "A connected in-vehicle dashboard that surfaces vehicle state and diagnostics directly to the rider",
        "A company-operated fast-charging network with in-app status and navigation",
        "Company-run experience centres and service centres with a support telephone line",
      ],
      gaps: [
        "No conversational path that reasons over vehicle telemetry to triage a fault before a human is involved",
        "Charger-availability recovery still depends on the rider re-checking the app rather than being guided",
        "Regional-language support is thin relative to the cities the brand is now entering",
        "Roadside-assistance requests cannot be raised, tracked and updated end-to-end in one thread",
      ],
    },
    risks: [
      "DPDP applies to connected-vehicle telemetry and location data, which is among the most sensitive data any conversational layer here would touch — purpose limitation must be explicit",
      "Roadside and breakdown handling has a safety dimension; escalation thresholds to a human must be conservative and auditable",
      "TRAI rules constrain proactive outbound (service-due, charging offers) to registered headers and scrubbed consent",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 1.4,
      automationRate: 0.5,
      basis: "Seller assumptions from installed-base scale and EV-specific contact rates, which run higher per vehicle than ICE two-wheelers; validate against Ather's actual support ticket and call volumes.",
    },
    pilotScope:
      "A 10-week co-build pilot on telemetry-grounded service triage and charging assistance for one metro, with Ather owning the app surface and the partner supplying speech, telephony, orchestration and evaluation.",
    expansion: [
      "Extend triage to roadside-assistance dispatch with live status back to the rider",
      "Add Hindi, Tamil, Telugu and Marathi coverage for tier-2 city expansion",
      "Open the same layer to pre-purchase and test-ride conversion in newly entered cities",
    ],
    stakeholders: [
      "Chief Business Officer / Head of Customer Experience",
      "Head of Service Network and After-Sales",
      "Head of Software / Vehicle Platform Engineering",
      "Head of Ather Grid (charging network)",
      "Chief Financial Officer",
    ],
    discovery: [
      "What fraction of support contacts could be answered from vehicle telemetry alone, and does a human currently have that data at first touch?",
      "How does charger-unavailability show up in your support volume, and what is the recovery path today?",
      "Which languages are you staffing for as you expand beyond the metros, and how are you resourcing that?",
      "Where would your engineering team draw the line between what Ather builds and what it would take from a platform partner?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A 450 rider stranded at an occupied fast charger in Bengaluru is routed to a free one and offered a service slot in the same call.",
  },

  "jsw-mg-motor-india": {
    operatingContext:
      "JSW MG Motor India is the joint venture between the JSW Group and SAIC-owned MG, manufacturing at Halol in Gujarat and selling a portfolio weighted heavily toward electric vehicles — the Comet, ZS EV and Windsor — alongside ICE SUVs like the Hector and Astor. It sells through a franchised dealer network that is still smaller than the incumbents', which makes each lead materially more valuable than it is for a market leader. Its differentiated commercial models, including battery-as-a-service style rental structures on some EVs, generate a genuinely complicated set of customer questions that dealer sales staff must answer consistently. Customer reach today runs through dealer sales and service telephony, a connected-car app on i-SMART equipped vehicles, and a central customer-care line.",
    strategicPressure: [
      { text: "MG's India volume is disproportionately electric compared with the wider market, so its inbound question mix is skewed toward charging, range, battery warranty and subsidy eligibility.", kind: "verified" },
      { text: "Separating vehicle price from battery cost through a rental/subscription construct creates a commercial explanation burden that is unusually easy for a dealer consultant to get wrong.", kind: "verified" },
      { text: "With a thinner dealer footprint than the volume leaders, a lead lost to a slow response is not recoverable elsewhere in the network — speed-to-lead is a direct share issue.", kind: "inference" },
      { text: "Post-JV governance means CX platform authority may sit with JSW-appointed leadership rather than the legacy MG India organisation, and the decision path needs mapping before a proposal lands.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The JV's capital and management attention are going into manufacturing capacity, network expansion and product localisation. There is no India software organisation building conversational infrastructure, and connected-car features come from the SAIC/MG global stack rather than a local platform team.",
    whyNotBuild:
      "A JV racing to build volume and dealer coverage has no reason to divert scarce engineering and capital into speech, telephony and orchestration. Even the connected-car layer it does have is inherited globally, not built in India — which is the clearest possible signal that a locally-tuned multilingual conversational layer will be procured rather than constructed.",
    workflows: [
      {
        name: "EV enquiry qualification and test-drive booking",
        friction: "Web and campaign leads are worked by dealer tele-callers on a spreadsheet during office hours; the prospect's actual questions — running cost versus petrol, battery rental terms, home charger installation — get inconsistent answers and the lead cools.",
        outcome: "Leads engaged within minutes in their own language with grounded answers on EV economics, and qualified prospects landed on a dealer consultant's calendar as a booked test drive.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Lead management/CRM", "Dealer DMS", "Product and pricing knowledge base", "Test-drive scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Battery-subscription and charging support for EV owners",
        friction: "Owners on a battery-rental construct call with billing and terms questions that dealer service staff are not equipped to answer, and charging questions bounce between the dealer, the charge-point operator and the OEM.",
        outcome: "A single grounded owner channel for battery-plan billing, charging network guidance and warranty terms, removing the most common source of EV owner dissatisfaction.",
        channels: ["Voice", "WhatsApp", "Connected-car app"],
        systems: ["Subscription/billing system", "Charging-partner network data", "Connected-vehicle platform", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Service booking and delivery-status updates",
        friction: "Service scheduling depends on reaching a dealer workshop by phone, and post-booking delivery-timeline questions on new vehicles are answered by whichever consultant picks up.",
        outcome: "Owners self-serve service slots and get proactive delivery-stage updates, reducing dealer inbound and stabilising the ownership experience across an uneven network.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Dealer DMS workshop scheduler", "OEM order and dispatch system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A connected-car app on i-SMART equipped vehicles with remote features and vehicle status",
        "A central customer-care line above dealer sales and service telephony",
        "Dealer-operated lead follow-up through tele-calling teams and CRM",
        "Web enquiry forms and campaign landing pages feeding the dealer lead funnel",
      ],
      gaps: [
        "No fast, consistent first response to an inbound EV enquiry outside office hours",
        "Battery-rental commercial terms cannot be explained authoritatively in a customer conversation",
        "Charging support is fragmented across the OEM, dealer and third-party charge-point operators",
        "Regional-language depth is limited to whoever staffs the dealer phone that day",
      ],
    },
    risks: [
      "TRAI DND and registered-header requirements apply to outbound lead follow-up, which is the core of the entry workflow — consent capture at the enquiry form must be watertight",
      "DPDP obligations on lead data shared with franchised dealers require a documented processing basis per dealer",
      "Any statement about EV subsidy eligibility or battery-plan terms carries commercial commitment risk; grounded sourcing and approval-gated responses are mandatory",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 1.4,
      automationRate: 0.5,
      basis: "Seller assumptions from network size, EV mix and typical lead-plus-service contact rates; validate against MG's actual lead volumes and dealer call data in discovery.",
    },
    pilotScope:
      "A 10-week pilot on EV enquiry-to-test-drive conversion across the top three EV-selling states in Hindi, Gujarati, Marathi and English, with lead write-back into the dealer CRM.",
    expansion: [
      "Extend to battery-subscription billing and charging support for the existing EV owner base",
      "Add service booking and delivery-status updates across the full dealer network",
      "Layer proactive retention and renewal outreach on the growing owner base",
    ],
    stakeholders: [
      "Chief Commercial Officer, JSW MG Motor India",
      "Head of Sales and Network",
      "Head of Customer Service / After-Sales",
      "Chief Information Officer / Head of Digital",
      "Head of EV Business and Charging Ecosystem",
    ],
    discovery: [
      "What is your median time from web enquiry to first human contact, and how does conversion vary with that interval?",
      "Who answers a customer question about battery-rental terms today, and how confident are you the answer is consistent?",
      "Does lead and CX platform authority sit with the JV leadership, MG India legacy teams, or JSW group IT?",
      "How many of your inbound service and owner calls are EV-specific, and are they longer than ICE calls?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Windsor EV prospect in Ahmedabad asks in Gujarati about battery rental and monthly running cost at 10pm, and books a test drive before the call ends.",
  },

  "hyundai-motor-india": {
    operatingContext:
      "Hyundai Motor India is among the country's largest passenger-vehicle manufacturers, producing at Sriperumbudur near Chennai and, more recently, at the acquired Talegaon plant, and selling nameplates including Creta, Venue, i20 and Exter through a nationwide franchised sales and service network. It is also one of India's largest passenger-vehicle exporters, which adds a second operational rhythm on top of the domestic business. Its owner base runs into millions of vehicles, so the after-sales organisation — periodic service, extended warranty, roadside assistance, insurance renewal — generates far more customer contact than sales does. Customers reach Hyundai today through dealer sales and workshop telephony, a central toll-free customer-care line, the Hyundai owner app with Bluelink connected services on equipped models, and dealer tele-calling teams for service reminders and renewals.",
    strategicPressure: [
      { text: "Hyundai Motor India's separate listing on Indian exchanges puts the India P&L under direct public-market scrutiny, sharpening attention on after-sales revenue and operating cost.", kind: "verified" },
      { text: "After-sales — service, parts, extended warranty and insurance renewal — is a structurally higher-margin revenue pool than vehicle sales, so leakage in renewal and retention outreach is expensive.", kind: "verified" },
      { text: "Because service and renewal calling is executed dealer-by-dealer, the OEM cannot guarantee that an owner in a tier-3 town receives the same conversation as one in a metro.", kind: "inference" },
      { text: "Customer-care operations have historically been run through outsourced contact-centre partners, so the commercial entry point is likely a contract renewal window rather than a greenfield decision.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led at the India-entity level. Hyundai globally invests heavily in vehicle software and connected services, but India customer operations have been run in the conventional OEM model with outsourced contact centres and dealer-executed outreach. The India organisation is a sales, manufacturing and after-sales operation, not a software house.",
    whyNotBuild:
      "Nothing in the India entity's mandate covers building speech recognition for Tamil, Telugu, Marathi and code-switched Hindi, integrating carrier telephony across a national dealer estate, or running an evaluation harness on millions of conversations. Global Hyundai's software investments are in the vehicle, not in Indian-language contact-centre orchestration, and the India entity's cost discipline points toward replacing outsourced headcount economics rather than recreating them internally.",
    workflows: [
      {
        name: "Service-due outreach, booking and reminders",
        friction: "Dealer tele-callers work service-due lists during office hours with low contact rates; owners who miss the call get an SMS with no booking path, and a meaningful share drift to independent garages after the warranty period.",
        outcome: "Every service-due owner reached in their own language across voice and WhatsApp with a bookable slot in the conversation, lifting authorised-workshop retention — the highest-margin after-sales lever.",
        channels: ["Voice", "WhatsApp", "Owner app", "SMS"],
        systems: ["Dealer DMS workshop scheduler", "Service history / warranty system", "Central CRM", "Owner database"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Lead qualification and test-drive scheduling",
        friction: "Digital and campaign leads are distributed to dealers where tele-callers reach them hours or days later; working customers cannot answer daytime calls and are marked unresponsive, so the competitor who responded first wins.",
        outcome: "Leads engaged within minutes on their preferred channel, qualified against a rubric the OEM owns, and delivered as booked test drives to a named consultant.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Lead management system", "Dealer DMS", "Test-drive scheduling", "Product and pricing knowledge base"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Extended-warranty and insurance-renewal outreach",
        friction: "Renewal windows are worked as calling campaigns with limited capacity, so a large share of eligible owners are never actually reached before the window closes, and those who are get inconsistent quotes.",
        outcome: "Full coverage of the eligible renewal base with policy-bounded quotes and in-conversation payment links, converting an uncovered revenue pool into measured conversion.",
        channels: ["Voice", "WhatsApp", "Owner app"],
        systems: ["Warranty and policy administration", "Insurance partner systems", "Payment gateway", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A toll-free central customer-care line supporting sales, service and roadside assistance",
        "An owner mobile app with Bluelink connected-car services on equipped models",
        "Dealer tele-calling teams executing service-due, renewal and feedback outreach",
        "SMS and app-based service reminders to the registered owner base",
      ],
      gaps: [
        "Owners cannot complete a workshop booking end-to-end without reaching a dealer during working hours",
        "Renewal outreach coverage is capped by tele-caller capacity rather than by the size of the eligible base",
        "No governed regional-language capability — quality varies with who staffs the dealer phone",
        "The OEM has no reliable record of what was said to an owner in a dealer-executed conversation",
      ],
    },
    risks: [
      "TRAI DND registration and registered-header requirements bind all service-due, renewal and lead outreach — the primary workflows here are all outbound",
      "Insurance-related conversations touch IRDAI-regulated distribution; any quoting or solicitation must stay within the licensed partner's boundaries with human sign-off on the transaction",
      "DPDP compliance on owner data flowing to franchised dealers and to insurance partners requires documented purpose and consent chains",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Seller assumptions extrapolated from installed-base scale and typical OEM after-sales contact rates; must be validated against Hyundai India's central contact-centre and dealer outreach volumes before any business case is presented.",
    },
    pilotScope:
      "A 10-week pilot on service-due outreach and booking across one southern and one northern dealer cluster in Tamil, Telugu, Hindi and English, with confirmed slots written back into dealer DMS.",
    expansion: [
      "Extend to extended-warranty and insurance-renewal outreach on the same owner cohorts",
      "Add lead qualification and test-drive scheduling across the national network",
      "Consolidate inbound customer-care volume off the outsourced contact centre onto the same layer",
    ],
    stakeholders: [
      "Chief Operating Officer, Hyundai Motor India",
      "Head of Service / After-Sales Business",
      "Head of Customer Experience and Quality",
      "Chief Information Officer / Head of Digital Transformation",
      "Head of Sales Operations and Dealer Network",
    ],
    discovery: [
      "What is your authorised-workshop retention curve after the free-service period, and what would a few points of improvement be worth?",
      "What share of your service-due and renewal-eligible base is actually contacted in a given cycle, and what caps it?",
      "Which outsourced partners run customer care today, and when do those contracts come up for renewal?",
      "Do you have write-back capability into dealer DMS scheduling, or does every booking require a dealer keystroke?",
    ],
    flowTemplate: "retention",
    scenario: "A Creta owner in Hyderabad due for third service is reached in Telugu, books a Saturday slot, and adds an extended-warranty quote in the same conversation.",
  },

  "toyota-kirloskar-motor": {
    operatingContext:
      "Toyota Kirloskar Motor is the Toyota-Kirloskar joint venture manufacturing at Bidadi in Karnataka, selling a portfolio spanning the Innova, Fortuner, Hyryder and rebadged Maruti-sourced models, plus a strong hybrid emphasis that is unusual in the Indian market. Its buyers skew toward high-consideration, long-ownership customers, and popular nameplates have repeatedly carried extended waiting periods, which makes the booking-to-delivery window a defining stretch of the customer relationship. After-sales is central to the brand promise — Toyota's global reputation rests on ownership cost and reliability — so periodic service, genuine parts and value-chain products drive most owner contact. Customers reach the company through dealer sales and workshop telephony, a central customer-assistance line, a connected-services app on equipped models, and dealer relationship managers.",
    strategicPressure: [
      { text: "Toyota has pushed strong hybrid technology in India rather than pure battery-electric, which creates a distinctive and persistent explanation burden about how the system works and what servicing it requires.", kind: "verified" },
      { text: "Extended waiting periods on popular nameplates mean a large fraction of customer contact is booking-status enquiry during a period when the customer has already paid a deposit and is most vulnerable to cancelling.", kind: "verified" },
      { text: "The badge-engineering arrangement with Maruti Suzuki means some customers own Toyota-badged vehicles serviced in a Toyota network but engineered elsewhere, adding parts and service-communication complexity.", kind: "inference" },
      { text: "As a manufacturing-excellence culture, Toyota will evaluate any customer-communication change through a process-quality and standardisation lens rather than a technology-novelty lens.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Toyota Kirloskar Motor is a manufacturing and sales joint venture; software strategy for the vehicle sits with Toyota globally, and India customer-facing systems are procured. There is no India-level engineering organisation that would take on a speech and orchestration build.",
    whyNotBuild:
      "The Toyota Production System instinct is to standardise a proven capability, not to invent one outside the core competence. Building Indian-language speech, telephony and orchestration in-house would be a multi-year detour from vehicle manufacturing, and the JV's decision framework — standardise, measure, improve — favours a bought layer with a documented evaluation regime over an internal experiment.",
    workflows: [
      {
        name: "Booking status and delivery-timeline communication",
        friction: "A customer six weeks into a waitlist calls the dealer for a delivery date; the consultant does not have the allocation position and gives an estimate that later slips, which converts a manageable wait into a trust failure.",
        outcome: "Proactive, grounded updates at each allocation stage in the customer's language, reducing repeat status calls and protecting bookings from cancellation during the wait.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["OEM order and allocation system", "Dealer DMS", "Vehicle dispatch tracking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Periodic service booking and hybrid-service guidance",
        friction: "Service booking runs through dealer workshop lines that are congested at opening; hybrid-specific service questions get inconsistent answers, and reminders carry no booking path.",
        outcome: "Confirmed workshop slots booked in-conversation with grounded hybrid-servicing answers, supporting the ownership-cost promise the brand sells on.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Dealer DMS workshop scheduler", "Service history and warranty system", "Technical knowledge base"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Value-chain product renewal (extended warranty, service packages)",
        friction: "Renewal campaigns for extended warranty and prepaid service packages are executed by dealer callers with limited reach, so eligible owners lapse without ever having been offered the product.",
        outcome: "Complete coverage of the eligible base with policy-bounded offers and payment in-channel, converting an under-worked revenue pool.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Warranty administration", "Dealer DMS", "Payment gateway", "Owner database"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A central customer-assistance telephone line covering sales, service and roadside support",
        "A connected-services mobile app on equipped models with service-booking features",
        "Dealer relationship managers and tele-calling teams executing service and renewal outreach",
        "SMS-based service-due and booking-confirmation notifications",
      ],
      gaps: [
        "No authoritative conversational answer on where a specific booking sits in the allocation queue",
        "Hybrid technology and servicing questions have no grounded 24/7 source in regional languages",
        "Workshop slots cannot be confirmed outside dealer working hours",
        "Renewal outreach coverage is limited by dealer calling capacity rather than base size",
      ],
    },
    risks: [
      "TRAI commercial-communication rules constrain the delivery-update and renewal outreach that form the core workflows",
      "DPDP obligations where booking and owner data flow between the OEM, dealers and the Maruti Suzuki supply arrangement for shared models",
      "Delivery-date statements create commercial expectations; the agent must be permitted to state only allocation stage and a governed window, never an unhedged date",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions based on owner-base scale and waitlist-driven enquiry intensity; validate against Toyota Kirloskar's actual central and dealer contact volumes.",
    },
    pilotScope:
      "A 10-week pilot on booking-to-delivery status communication for two waitlisted nameplates across dealers in Karnataka and Maharashtra, in Kannada, Marathi, Hindi and English.",
    expansion: [
      "Extend into periodic service booking with hybrid-servicing guidance",
      "Add extended-warranty and prepaid-service-package renewal outreach",
      "Scale nationally with Tamil and Telugu coverage and dealer-level quality scoring",
    ],
    stakeholders: [
      "Vice President, Sales and Strategic Marketing",
      "General Manager, Customer Service / After-Sales",
      "Head of Customer Relations and Quality",
      "Head of Information Systems / Digital",
      "Head of Dealer Network Operations",
    ],
    discovery: [
      "How many inbound contacts does an average waitlisted booking generate before delivery, and who absorbs them?",
      "Can a dealer consultant see the real allocation position for a specific booking today, or is it an estimate?",
      "How are hybrid-specific service and technology questions answered consistently across the network?",
      "What proportion of the extended-warranty eligible base is actually contacted before the window closes?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An Innova Hycross customer in Pune asks in Marathi where their booking stands and receives a grounded allocation stage plus expected window.",
  },

  "kia-india": {
    operatingContext:
      "Kia India manufactures at Anantapur in Andhra Pradesh and built its position on SUVs — Seltos, Sonet, Carens and the electric EV6 and Carens Clavis line — reaching a meaningful installed base in under a decade. Because volume arrived fast, the owner base is now large relative to a service and customer-care organisation that was designed for a younger company. Sales and service are delivered through a franchised dealer network with the OEM operating a central customer-care layer above it, and connected-car services delivered through the Kia Connect app on equipped models. Owner contact is dominated by periodic service scheduling, service-due and recall communication, and connected-car feature support.",
    strategicPressure: [
      { text: "Kia went from market entry to a substantial installed base in a compressed period, so its after-sales load has grown faster than most peers' at the same organisational age.", kind: "verified" },
      { text: "Connected-car services on Kia Connect equipped vehicles generate a class of support question — app pairing, subscription state, remote features — that traditional dealer service staff are not trained for.", kind: "inference" },
      { text: "Recall and service-campaign communication must reach a specific VIN cohort reliably; SMS-only campaigns produce poor completion rates and leave regulatory and reputational exposure.", kind: "inference" },
      { text: "As a Korea-headquartered subsidiary, CX platform choices may be constrained by HQ-mandated global standards, which is the single biggest qualification question on this account.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Kia India is a manufacturing and sales operation; vehicle and connected-car software originates from Kia/Hyundai Motor Group globally. India customer operations run on procured platforms and vendor-operated contact-centre capacity, with no local engineering organisation positioned to build conversational infrastructure.",
    whyNotBuild:
      "Even if Korea HQ has AI capability, the specific gap here is Indian-language speech on mobile calls, integration into an India dealer DMS estate, and India telephony compliance — none of which a Korean platform team is positioned to deliver. The India entity's realistic choice is between a vendor contact centre and a governed agentic layer, not between buying and building.",
    workflows: [
      {
        name: "Service-due reminders and workshop booking",
        friction: "Service reminders go out as SMS with a dealer phone number; owners who call reach congested workshop lines, and dealer callbacks are inconsistent, so service intervals slip.",
        outcome: "Reminder and booking collapse into one conversation with a confirmed slot, raising authorised-workshop retention on a rapidly ageing installed base.",
        channels: ["WhatsApp", "Voice", "Kia Connect app"],
        systems: ["Dealer DMS workshop scheduler", "Service history system", "Owner/VIN database", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Recall and service-campaign completion outreach",
        friction: "A campaign targeting a specific VIN cohort is communicated by SMS and dealer calling; completion rates stall and the OEM chases the remaining owners repeatedly with the same message.",
        outcome: "Two-way, multilingual campaign outreach that answers the owner's actual objection and books the workshop visit, driving campaign completion rates that a broadcast cannot.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["VIN/campaign management system", "Dealer DMS", "Service scheduling", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Connected-car feature and subscription support",
        friction: "App pairing failures, expired connected-services subscriptions and remote-feature questions land on dealer service advisors who are not trained on the app stack and escalate to a central queue.",
        outcome: "First-contact resolution on connected-services issues without occupying a service advisor, and clean escalation of genuine platform faults with full context.",
        channels: ["App chat", "Voice", "WhatsApp"],
        systems: ["Connected-services platform", "Subscription management", "Owner database", "Ticketing"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The Kia Connect app providing connected-vehicle features and service booking on equipped models",
        "A central OEM customer-care telephone line above dealer service contact",
        "Dealer workshop telephony and tele-calling teams for service reminders",
        "SMS-based service-due, campaign and booking-confirmation notifications",
      ],
      gaps: [
        "Owners cannot secure a confirmed workshop slot without a dealer human in the loop",
        "Recall and campaign communication is one-way, so objections are never captured or answered",
        "Connected-services support is not resolvable at first contact by the people owners actually reach",
        "Regional-language coverage does not match the geographic spread of the owner base",
      ],
    },
    risks: [
      "Recall and safety-campaign communication carries regulatory weight; message content must be approved and every contact attempt auditable",
      "TRAI DND and registered-header rules apply to the reminder and campaign outreach that constitute the primary workflows",
      "DPDP: VIN-linked owner data flowing to franchised dealers needs a documented processing basis",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions from installed-base scale and standard OEM service-contact rates; validate against Kia India's central customer-care and dealer volumes in discovery.",
    },
    pilotScope:
      "A 10-week pilot on service-due reminder-plus-booking for one two-state dealer cluster in Telugu, Tamil, Hindi and English, with slot write-back into the DMS scheduler.",
    expansion: [
      "Add recall and service-campaign completion outreach on VIN-targeted cohorts",
      "Extend to connected-car and subscription support to relieve service advisors",
      "Scale to the national network with full regional-language coverage and campaign analytics",
    ],
    stakeholders: [
      "Chief Operating Officer / National Head of Sales and Service",
      "Head of Customer Experience, Kia India",
      "Head of After-Sales Service and Network",
      "Head of IT / Digital, Kia India",
      "Head of Connected Car and Digital Services",
    ],
    discovery: [
      "Are CX platform decisions made in India, or do they require Korea HQ approval against a global standard?",
      "What completion rate do your service campaigns reach, and how many contact attempts does the tail consume?",
      "How much service-advisor time is consumed by connected-app issues rather than the vehicle?",
      "What is your service-retention curve as the early Seltos and Sonet cohorts move out of warranty?",
    ],
    flowTemplate: "appointments",
    scenario: "A Seltos owner in Vijayawada gets a Telugu service-campaign call, has their objection answered, and books the workshop visit on the spot.",
  },

  "escorts-kubota": {
    operatingContext:
      "Escorts Kubota, now majority-controlled by Japan's Kubota Corporation, manufactures tractors under the Farmtrac, Powertrac and Kubota brands alongside construction equipment and railway equipment businesses. Its tractor customer is a farmer buying a capital asset that must work during a narrow sowing or harvest window, typically financed, and typically reached only by mobile phone in Hindi, Punjabi, Marathi or Telugu. Sales, service and spares run through a rural dealer network whose reach into smaller districts is the company's genuine competitive asset. Customer contact today is overwhelmingly dealer-mediated voice, supplemented by a central helpline, field service engineers, and financier follow-up on EMI schedules.",
    strategicPressure: [
      { text: "The Kubota takeover reorients the company toward Japanese governance and process standards, which typically raises expectations on documented after-sales service quality.", kind: "verified" },
      { text: "Tractor demand is seasonal and monsoon-dependent, so service and spares call volume spikes hard around sowing and harvest and collapses in between — exactly the pattern fixed staffing handles worst.", kind: "inference" },
      { text: "Downtime during a harvest window is a direct income loss for the farmer, so response speed on a breakdown call is a brand-defining moment far more than in passenger vehicles.", kind: "inference" },
      { text: "Financing-linked follow-up (EMI reminders, insurance, warranty renewals) is likely fragmented between the dealer, the captive/partner financier and the OEM, with no unified customer view.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. This is a farm-machinery manufacturer with no software organisation of any relevant kind. Its technology investment goes into tractor engineering, emissions compliance and manufacturing, and its customer operations are dealer-led with a modest central helpline.",
    whyNotBuild:
      "Rural Hindi, Punjabi and Marathi speech on poor mobile connections is a genuinely hard engineering problem, and it is the entire problem here — the application logic is trivial by comparison. A tractor manufacturer has no route to solving it, no reason to try, and every reason to buy a capability that already handles code-switched rural voice at carrier quality.",
    workflows: [
      {
        name: "Breakdown intake and field-service dispatch",
        friction: "A farmer with a tractor down mid-harvest calls the dealer; if nobody answers, they call the helpline, re-explain everything, and wait for a call-back that may route to an engineer who is already committed elsewhere.",
        outcome: "Structured breakdown intake in the farmer's language at any hour, with the right field engineer dispatched and an honest arrival window communicated — turning the highest-stakes moment into a resolved one.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Dealer service management", "Field-engineer dispatch/scheduling", "Warranty and service history", "Spare-parts inventory"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Spare-parts availability and dealer ordering",
        friction: "Parts enquiries require someone at the dealership to check stock manually; if the part is not local, the farmer is told to call back, and the tractor stays idle.",
        outcome: "Availability answered against live inventory with a nearest-stocking-point or order placed in-conversation, cutting equipment downtime that directly costs the farmer income.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Spare-parts inventory / parts master", "Dealer ordering system", "Logistics tracking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Warranty registration, service-due and financing follow-up",
        friction: "Warranty registration and periodic-service reminders are chased by dealer staff during peak season when they are least available, and EMI or insurance follow-up comes from a separate financier with no context.",
        outcome: "Reliable multilingual outreach that completes warranty registration, books periodic service and resolves financing questions without consuming dealer capacity during the season.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Warranty system", "Dealer DMS", "Financier/NBFC loan system", "Customer database"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A central customer helpline number printed on tractor documentation and dealer material",
        "A rural dealer network handling sales, service and spares as the primary customer interface",
        "Field service engineers dispatched for in-field breakdowns and warranty work",
        "SMS-based service reminders and campaign messaging to registered owners",
      ],
      gaps: [
        "No path to log a breakdown and receive an engineer commitment outside dealer working hours",
        "Parts availability cannot be confirmed without a human checking inventory manually",
        "Rural-language voice quality depends entirely on which individual answers",
        "No single view of an owner across the OEM, dealer and financier relationships",
      ],
    },
    risks: [
      "TRAI DND applies to outbound reminders; rural customers are heavily represented on DND registers, so consent capture at point of sale is critical",
      "DPDP obligations where owner data is shared between the OEM, dealers and financing partners for EMI-linked follow-up",
      "Seasonal peaks mean the pilot must be scheduled to include a real sowing or harvest window, or the volume case will be understated",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.0,
      automationRate: 0.5,
      basis: "Seller assumptions from tractor parc size and seasonal service-contact patterns; volumes are highly seasonal and must be validated against peak-month rather than average data.",
    },
    pilotScope:
      "A 10-week pilot spanning one sowing season on breakdown intake and field-service dispatch across dealers in Punjab, Haryana and western Uttar Pradesh, in Hindi and Punjabi.",
    expansion: [
      "Add spare-parts availability lookup with dealer ordering",
      "Extend to warranty registration and periodic-service outreach across the national dealer network",
      "Add Marathi, Telugu and Gujarati coverage and take the layer into the construction-equipment business",
    ],
    stakeholders: [
      "Chief Executive, Agri Machinery Business",
      "Head of Customer Care / After-Sales Service",
      "Head of Spare Parts Business",
      "Chief Information Officer, Escorts Kubota",
      "Head of Dealer Network and Rural Sales",
    ],
    discovery: [
      "What happens today when a farmer calls about a breakdown after dealer hours during harvest season?",
      "How much of your service and spares contact reaches the company at all, versus being absorbed and lost at the dealer?",
      "Can dealer parts inventory be queried centrally in real time, or only dealer-by-dealer?",
      "How does Kubota's ownership change your after-sales service standards and measurement expectations?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A Farmtrac owner in Bathinda logs a mid-harvest breakdown in Punjabi at 9pm and gets a named engineer with an arrival window.",
  },

  "sonalika-tractors": {
    operatingContext:
      "Sonalika, the tractor brand of International Tractors Limited, manufactures at Hoshiarpur in Punjab and is one of India's largest tractor exporters alongside a substantial domestic business, selling into price-sensitive farming segments through a dealer network concentrated in the northern and western belts but extending nationally. Its customers are farmers and rural contractors for whom the tractor is working capital, and its export business ships to Africa, Latin America, Southeast Asia and Europe. Domestic customer contact happens through dealers, a central helpline, and field service staff; export customers reach distributors rather than the company. The business is promoter-led and manufacturing-focused, with commercial energy directed at price competitiveness and dealer expansion.",
    strategicPressure: [
      { text: "Sonalika's export share is unusually high for an Indian tractor maker, which creates a distributor-support communication load in languages and time zones the domestic organisation is not built for.", kind: "verified" },
      { text: "Competing at the value end of the tractor market means the after-sales promise, not the price, is what protects repeat purchase and brand referral in tight rural communities.", kind: "inference" },
      { text: "Rural service coverage in districts where the dealer is thinly staffed is where warranty and breakdown complaints concentrate, and the OEM has little visibility into them.", kind: "inference" },
      { text: "There may be no meaningful central customer-care function at all, with support fully delegated to dealers — which would make the entry motion about creating a capability rather than replacing one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led, at the strongest end of the spectrum. International Tractors is a privately-held manufacturing company with no software organisation and no history of building customer-facing technology. Any conversational capability will be procured as a service.",
    whyNotBuild:
      "There is simply no internal function that could take this on. The value here is a working multilingual voice capability that requires zero internal engineering, integrates with the dealer systems that exist, and is operated as a managed service — the further the proposal moves from that, the less likely it is to be bought.",
    workflows: [
      {
        name: "Rural service and warranty helpline",
        friction: "A farmer with a warranty complaint calls the dealer; if the dealer is unresponsive there is no reliable escalation path to the company, so the grievance becomes a village-level reputation problem instead of a ticket.",
        outcome: "A genuine 24/7 multilingual company-level service line that logs the complaint, checks warranty entitlement and commits an action, giving the OEM visibility it currently does not have.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Warranty administration", "Dealer service management", "Field-engineer dispatch", "Customer/serial-number database"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Spare-parts enquiry and nearest-stockist routing",
        friction: "Parts enquiries reach dealers who may not stock the item; the farmer is sent between dealers by word of mouth while the tractor sits idle during a working window.",
        outcome: "Live routing to a stocking dealer or a placed order with a delivery commitment, directly reducing downtime for a customer whose income depends on it.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Parts master and dealer inventory", "Dealer ordering", "Logistics tracking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Export distributor support",
        friction: "Overseas distributors raise parts, warranty-claim and technical queries by email into an India team working Indian hours, so a straightforward question takes days across time zones.",
        outcome: "Always-available, English-and-local-language distributor support with grounded technical and parts answers, protecting the export growth engine without adding headcount.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Export order management", "Parts master", "Warranty claims system", "Technical documentation library"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A printed customer helpline number carried on product documentation and dealer signage",
        "A dealer network as the effective primary service and complaint channel",
        "Field service staff performing warranty and breakdown work in the field",
        "Distributor email and phone contact for export markets",
      ],
      gaps: [
        "No dependable escalation path from a dissatisfied farmer to the company when the dealer is unresponsive",
        "Parts availability across the dealer network cannot be answered centrally",
        "No structured record of what rural customers are actually complaining about, at company level",
        "Export distributor queries have no time-zone-independent response path",
      ],
    },
    risks: [
      "TRAI DND applies to any outbound service or campaign calling to rural owners, who are disproportionately DND-registered",
      "DPDP obligations on farmer personal and financing data shared between company, dealers and financiers",
      "Warranty entitlement statements made in-conversation create commercial liability; the agent must state entitlement only from the warranty system, never infer it",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 0.9,
      automationRate: 0.45,
      basis: "Seller assumptions from tractor parc and rural service-contact patterns, deliberately conservative because much contact may currently be absorbed by dealers and never reach the company; validate scale in discovery.",
    },
    pilotScope:
      "An 8-week pilot standing up a company-level rural service and warranty helpline in Hindi and Punjabi across the Punjab and Haryana dealer belt, with complaint logging and dealer routing.",
    expansion: [
      "Add spare-parts availability and nearest-stockist routing",
      "Extend to Marathi, Gujarati and Telugu across the national dealer network",
      "Open an export-distributor support line in English and priority export-market languages",
    ],
    stakeholders: [
      "Executive Director / Head of Domestic Business",
      "Head of Customer Care and After-Sales Service",
      "Head of Spare Parts and Service Network",
      "Head of International Business (Exports)",
      "Head of IT / Systems, International Tractors",
    ],
    discovery: [
      "Does a central customer-care function exist today, or is support entirely delegated to dealers?",
      "How do you find out when a dealer is failing a customer on warranty service?",
      "Can you see parts stock across dealers centrally, or is that dealer-by-dealer?",
      "What does export-distributor support cost you today in response delay, and who handles it?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Sonalika owner near Hoshiarpur logs a warranty complaint in Punjabi that the dealer had been ignoring, and the company sees it for the first time.",
  },

  "skoda-auto-volkswagen-india": {
    operatingContext:
      "Skoda Auto Volkswagen India Private Limited is the consolidated Indian entity for the Volkswagen Group's passenger-car brands, manufacturing at Chakan and Aurangabad in Maharashtra and selling Skoda nameplates (Kushaq, Slavia, Kylaq) and Volkswagen nameplates (Taigun, Virtus) built on a shared India-localised platform. The two brands operate separate dealer networks and separate customer identities while sharing engineering, manufacturing and much of the parts supply chain — which means duplicated customer-communication operations sitting on top of a single industrial base. Owners contact the company for service booking, parts availability, warranty and roadside assistance, largely through brand dealer workshops with a central customer-care line above. The India business has been a volume challenger rather than a leader, so cost per customer contact matters disproportionately.",
    strategicPressure: [
      { text: "Skoda and Volkswagen India vehicles share a heavily localised common platform, so the underlying service and parts reality is shared even though the customer-facing operations are split by brand.", kind: "verified" },
      { text: "Running two brand contact operations over one industrial base is a structural cost duplication that a consolidation-minded management would target.", kind: "inference" },
      { text: "The group's India volume ambitions depend on service-network confidence, historically a weak point for European brands in India relative to Japanese and Korean incumbents.", kind: "inference" },
      { text: "Global VW Group IT standards may constrain what the India entity can procure locally, which needs establishing before any commercial conversation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led at the India entity level. The India organisation is a manufacturing and sales operation; software and connected-services strategy sits with VW Group globally. India customer operations run on procured platforms and vendor contact-centre capacity.",
    whyNotBuild:
      "The group's software efforts are focused on vehicle software platforms, not Indian-language contact-centre orchestration, and its India entity has neither mandate nor headcount to build one. The India-specific requirement — Marathi, Gujarati and code-switched Hindi speech, Indian carrier telephony, a fragmented dealer DMS estate — is precisely what a global platform will not deliver and a local partner will.",
    workflows: [
      {
        name: "Cross-brand service-appointment booking",
        friction: "A Skoda owner and a Volkswagen owner in the same city call two different workshop networks running two sets of phone lines and reminder campaigns, duplicating cost while both queues congest at the same peak hours.",
        outcome: "One conversational layer serving both brands with brand-correct identity and grounded workshop capacity, cutting duplicated contact cost while raising booking completion.",
        channels: ["Voice", "WhatsApp", "Brand apps"],
        systems: ["Dealer DMS workshop schedulers (both networks)", "Service history and warranty systems", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Parts availability and service-cost transparency",
        friction: "European-brand owners in India worry about parts cost and availability; today an enquiry means a dealer checks manually and quotes verbally, which does nothing to fix the perception problem.",
        outcome: "Grounded parts availability and indicative service-cost answers delivered consistently, addressing the specific objection that suppresses the brands' service retention in India.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Parts master and dealer inventory", "Service pricing/labour-rate system", "Dealer DMS"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Roadside assistance and warranty-claim intake",
        friction: "Roadside assistance is requested through a central line, then coordinated by phone between the customer, the assistance provider and the dealer, with the customer chasing status at every step.",
        outcome: "Single-thread intake and proactive status through resolution, removing the repeat status calls that dominate assistance-related contact volume.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Roadside-assistance provider platform", "Warranty claims system", "Dealer DMS", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Separate brand customer-care telephone lines for Skoda and Volkswagen customers in India",
        "Brand owner apps with service-booking and vehicle-information features",
        "Dealer workshop telephony and service-advisor teams across both networks",
        "A roadside-assistance programme operated with third-party providers",
      ],
      gaps: [
        "No shared conversational layer across two brands sitting on one industrial and parts base",
        "Parts availability and service cost cannot be answered without a dealer human",
        "Regional-language coverage is inconsistent and dealer-dependent",
        "Roadside-assistance status requires the customer to chase across three parties",
      ],
    },
    risks: [
      "VW Group global IT governance and data-residency standards may restrict which platforms the India entity can procure — this must be qualified early",
      "DPDP obligations on owner data shared with two dealer networks and third-party assistance providers",
      "TRAI DND rules bind service-due and campaign outreach across both brand owner bases",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions from combined two-brand owner base and typical service-contact rates; validate against the India entity's actual central and dealer contact volumes.",
    },
    pilotScope:
      "A 10-week pilot on service-appointment booking across both brands in Maharashtra and Gujarat in Marathi, Gujarati, Hindi and English, with one deployment serving two brand identities.",
    expansion: [
      "Add parts availability and indicative service-cost transparency",
      "Extend to roadside-assistance intake and proactive status across both networks",
      "Scale nationally and consolidate outbound service-due and campaign outreach onto the same layer",
    ],
    stakeholders: [
      "Brand Director, Skoda Auto India / Volkswagen Passenger Cars India",
      "Head of After-Sales and Customer Service, SAVWIPL",
      "Head of Customer Experience and Quality",
      "Head of IT / Digital, SAVWIPL",
      "Head of Parts and Service Business",
    ],
    discovery: [
      "Do Skoda and Volkswagen share any customer-care backend today, or are they fully separate stacks?",
      "How much local autonomy does SAVWIPL have to procure a customer-facing platform outside VW Group global standards?",
      "What is your service retention beyond warranty, and how much of the drop-off is parts-cost perception?",
      "How many contacts does a single roadside-assistance event generate across the customer, provider and dealer?",
    ],
    flowTemplate: "appointments",
    scenario: "A Kushaq owner in Pune and a Taigun owner in Surat both book workshop slots through one layer, each hearing their own brand.",
  },

  "honda-cars-india": {
    operatingContext:
      "Honda Cars India sells a deliberately compact passenger-car lineup — City, Amaze and Elevate — from its Tapukara plant in Rajasthan, having consolidated manufacturing and narrowed its portfolio after ceding volume share to SUV-heavy rivals. With a smaller new-car business relative to its installed base, the economics of the India operation lean heavily on after-sales: periodic service, genuine parts, extended warranty and insurance renewal from a loyal, long-holding owner base. Sales and service run through a franchised dealer network with a central customer-care line above it, plus the Honda Connect app on equipped models. Owner outreach — service reminders, renewal campaigns, feedback calls — is executed by dealer tele-calling teams.",
    strategicPressure: [
      { text: "Honda's India passenger-car volumes have contracted relative to their peak while the installed base remains large, which structurally shifts the profit centre from sales to after-sales.", kind: "verified" },
      { text: "A lean India organisation with a narrow model lineup cannot fund proportionally large customer-operations headcount, making cost per owner contact a live constraint.", kind: "inference" },
      { text: "Owners of ageing City and Amaze vehicles are exactly the cohort most likely to defect to independent garages, so service-retention outreach is the single highest-value communication workflow.", kind: "inference" },
      { text: "Renewal outreach for extended warranty and insurance is probably capacity-capped at the dealer, meaning a material share of the eligible base is never contacted.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Honda Cars India is a manufacturing and sales subsidiary executing a global product playbook; vehicle software originates from Honda globally. The India entity has no engineering organisation building customer-facing platforms and runs customer operations through dealers and vendors.",
    whyNotBuild:
      "A deliberately lean India operation focused on defending after-sales profitability is the least likely organisation to fund a speech-plus-telephony-plus-orchestration build. The whole point of the opportunity is that it lets Honda contact more owners without adding tele-calling headcount — an internal build would invert that logic.",
    workflows: [
      {
        name: "Service-retention outreach and workshop booking",
        friction: "Service-due lists are worked by dealer tele-callers with limited reach; owners past warranty receive a generic SMS with no booking path and quietly move to a neighbourhood garage.",
        outcome: "Complete coverage of the service-due base in the owner's language with a confirmed slot booked in-conversation, directly defending the highest-margin revenue line.",
        channels: ["Voice", "WhatsApp", "Owner app"],
        systems: ["Dealer DMS workshop scheduler", "Service history and warranty system", "Owner database", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Extended-warranty and insurance-renewal outreach",
        friction: "Renewal windows are worked as calling campaigns; capacity limits mean many eligible owners are never reached, and those who are get quotes that vary by dealer.",
        outcome: "Policy-bounded quotes offered consistently across the full eligible base with payment links in-channel, converting an under-worked revenue pool into measurable renewals.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Warranty administration", "Insurance partner systems", "Payment gateway", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Post-service feedback and complaint capture",
        friction: "Feedback calls are made by dealer staff who have an incentive not to surface their own service failures, so the OEM's view of dealer quality is systematically flattered.",
        outcome: "Independent, multilingual post-service feedback at full coverage with complaints routed to the OEM rather than filtered by the dealer, giving honest network quality data.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service history (job-card closure trigger)", "CRM", "Complaint/ticketing system", "Dealer scorecard reporting"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A central toll-free customer-care line for sales, service and roadside assistance",
        "The Honda Connect owner app with service booking and vehicle information on equipped models",
        "Dealer tele-calling teams executing service-due, renewal and feedback outreach",
        "SMS-based service reminders and campaign notifications to registered owners",
      ],
      gaps: [
        "Owners cannot confirm a workshop slot without reaching a dealer during working hours",
        "Renewal outreach coverage is limited by tele-caller capacity, not by eligible-base size",
        "Post-service feedback is collected by the same party being evaluated",
        "Regional-language quality varies dealer by dealer with no governed standard",
      ],
    },
    risks: [
      "TRAI DND and registered-header requirements bind all three workflows, which are predominantly outbound",
      "Insurance renewal touches IRDAI-regulated distribution; solicitation and quoting must remain within the licensed partner boundary with human completion of the transaction",
      "DPDP obligations on owner data shared with dealers and insurance partners require documented purpose and consent",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Seller assumptions from installed-base scale and after-sales outreach intensity; validate against Honda Cars India's dealer tele-calling volumes and central care-line data.",
    },
    pilotScope:
      "An 8-week pilot on service-due outreach and booking for out-of-warranty City and Amaze owners across two dealer clusters in Hindi, Marathi and English.",
    expansion: [
      "Add extended-warranty and insurance-renewal outreach on the same cohorts",
      "Introduce independent post-service feedback with dealer scorecard reporting",
      "Scale nationally with Tamil and Telugu coverage and full inbound care-line coverage",
    ],
    stakeholders: [
      "Director, Sales and Marketing, Honda Cars India",
      "Head of Customer Service / After-Sales",
      "Head of Customer Relations and Quality",
      "Head of IT / Digital, Honda Cars India",
      "Head of Dealer Network Development",
    ],
    discovery: [
      "What share of your out-of-warranty owner base still services at an authorised workshop, and how is that trending?",
      "How many of your renewal-eligible owners are actually contacted before the window closes?",
      "Who makes post-service feedback calls today, and do you trust the resulting scores?",
      "How much of your after-sales outreach cost sits at the dealer versus the OEM?",
    ],
    flowTemplate: "retention",
    scenario: "A five-year-old City owner in Nagpur is reached in Marathi, books a paid service, and takes an extended-warranty quote in the same call.",
  },

  "honda-motorcycle-scooter-india": {
    operatingContext:
      "Honda Motorcycle & Scooter India is among the country's largest two-wheeler manufacturers, producing scooters led by the Activa and a broad motorcycle range from plants in Haryana, Rajasthan, Karnataka and Gujarat. Its customer base is enormous and spread from metros to small towns, buying an everyday-use vehicle often financed, and reaching the brand almost entirely through dealers for sales, service and spares. Because per-vehicle contact rates are low but the parc is huge, absolute conversation volume — service reminders, warranty questions, spare-parts availability, financing follow-up — is very large and overwhelmingly voice-first in regional languages. Customer reach today runs through dealer telephony, a central customer-care line, SMS reminders and a service-booking app.",
    strategicPressure: [
      { text: "HMSI's scooter franchise, anchored by the Activa, gives it one of the largest installed two-wheeler bases in the country, which makes even low per-vehicle contact rates produce very high absolute volume.", kind: "verified" },
      { text: "Two-wheeler service margins per job are small, so the cost of the conversation that generates the job is a real determinant of after-sales profitability.", kind: "inference" },
      { text: "Tightening emission and safety norms drive periodic service and recall-style campaigns across huge VIN cohorts, where SMS-only communication produces poor completion.", kind: "inference" },
      { text: "Much of the customer contact is probably absorbed at the dealer and never visible to the OEM, so HMSI may not know its own true contact volume.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. HMSI is a manufacturing subsidiary of Honda Motor executing a volume two-wheeler business; there is no India software organisation building customer platforms, and customer care runs through vendor and dealer capacity.",
    whyNotBuild:
      "At two-wheeler unit economics, the only thing that matters is cost per conversation at massive scale across ten-plus languages. Building that stack internally would require permanent speech, telephony and evaluation engineering with no manufacturing return, and the India entity has neither the mandate nor the reason.",
    workflows: [
      {
        name: "Service-due reminders and dealer workshop booking",
        friction: "Reminder SMS goes to millions of owners with a dealer phone number attached; the small fraction who call reach congested workshop lines, and the rest simply defer service.",
        outcome: "Two-way reminder-plus-booking in the owner's language at a cost per contact that works at two-wheeler economics, lifting workshop throughput and parts revenue.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Dealer DMS workshop scheduler", "Owner/VIN database", "Service history", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Warranty and service-campaign completion",
        friction: "Campaigns targeting large VIN cohorts are broadcast one-way; owners who do not understand why it matters ignore the message, and completion stalls with repeated identical follow-ups.",
        outcome: "Conversational campaign outreach that answers the owner's objection and books the visit, materially raising completion on cohorts numbering in the hundreds of thousands.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Campaign/VIN management", "Dealer DMS", "Service scheduling", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Spare-parts and accessory availability enquiry",
        friction: "Owners calling about a part are told to visit the dealer, where stock may or may not exist; there is no way to check availability before making the trip.",
        outcome: "Availability confirmed against dealer inventory with a reservation, cutting wasted trips and capturing genuine-parts revenue that leaks to the aftermarket.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Parts master and dealer inventory", "Dealer ordering system", "Owner database"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A central customer-care telephone line above dealer-level sales and service contact",
        "A service-booking mobile app for owners at participating dealerships",
        "Dealer workshop telephony as the dominant day-to-day owner channel",
        "High-volume SMS service reminders and campaign messaging to the registered base",
      ],
      gaps: [
        "No cost-viable two-way channel to a base this large — reminders are broadcast, not conversations",
        "Workshop slots cannot be confirmed outside dealer working hours",
        "Parts availability is unknowable before visiting a dealership",
        "The OEM has little visibility into contact volume or content absorbed at dealer level",
      ],
    },
    risks: [
      "TRAI DND and registered-header rules bind reminder and campaign outreach at very high volume, where a compliance failure is correspondingly expensive",
      "Safety-campaign communication content requires approval and per-owner auditability of contact attempts",
      "DPDP obligations on VIN-linked owner data flowing to a very large franchised dealer network",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 0.9,
      automationRate: 0.65,
      basis: "Seller assumptions from parc scale and two-wheeler service-contact patterns; the cost-per-interaction assumption is deliberately at the low end because two-wheeler economics will not support metro-BPO pricing. Validate all figures in discovery.",
    },
    pilotScope:
      "A 10-week pilot on service-due reminder-plus-booking for one state's Activa owner cohort in Hindi and one regional language, with confirmed slots written into dealer DMS.",
    expansion: [
      "Extend to warranty and service-campaign completion across national VIN cohorts",
      "Add spare-parts availability and reservation",
      "Scale to full multilingual national coverage with dealer-level performance reporting",
    ],
    stakeholders: [
      "Director, Sales and Marketing, HMSI",
      "Head of Customer Service and After-Sales",
      "Head of Spare Parts Business",
      "Head of IT / Digital, HMSI",
      "Head of Dealer Network Operations",
    ],
    discovery: [
      "Do you know your true owner contact volume, including what dealers absorb without reporting?",
      "What completion rate do your service campaigns reach, and what does the long tail cost in repeat attempts?",
      "What cost per contact would make two-way owner conversation viable at your parc size?",
      "How much genuine-parts revenue do you believe is leaking to the aftermarket because of availability uncertainty?",
    ],
    flowTemplate: "appointments",
    scenario: "An Activa owner in Jaipur receives a Hindi service-due call and books a Sunday workshop slot without ever speaking to the dealer.",
  },

  "landmark-cars": {
    operatingContext:
      "Landmark Cars is a listed premium automotive dealership group representing manufacturers including Mercedes-Benz, Jeep, Honda, Volkswagen, Renault and BYD across sales, service, spares and pre-owned vehicles, with a footprint concentrated in western and northern India and expanding into new geographies. Its revenue mix is characteristic of the dealer model: vehicle sales generate turnover while after-sales — service, parts, insurance and finance commissions — generates the profit. Its operating reality is lead follow-up speed, workshop bay utilisation, and renewal capture, all executed by tele-calling teams working OEM-mandated CRM and DMS systems. Customers reach it through showroom and workshop phone lines, walk-ins, and web enquiry forms feeding OEM lead systems.",
    strategicPressure: [
      { text: "As a listed company, Landmark reports on after-sales revenue and workshop throughput, which makes service-bay utilisation and renewal capture visible investor metrics rather than internal ones.", kind: "verified" },
      { text: "Representing multiple OEM brands means operating several mandated CRM and DMS systems in parallel, so the group has no single customer view across its own business.", kind: "verified" },
      { text: "Dealer margin on new vehicle sales is thin, so the economics of the business rest on capturing service, insurance and finance attach — all of which are conversation-dependent.", kind: "inference" },
      { text: "OEM-mandated systems may restrict what a dealer-side conversational layer is permitted to read or write, which is the central feasibility question on this account.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led without qualification. A dealership group runs a small corporate IT function that administers OEM-mandated systems; it has no capacity to build software and no reason to. The relevant decision is whether the OEM permits a dealer-side layer, not whether Landmark could build one.",
    whyNotBuild:
      "Landmark's competitive asset is showroom locations, brand representation and service capacity — none of it software. Its IT spend goes on running mandated OEM systems. A speech, telephony and orchestration build is inconceivable at this organisation's scale, and the value proposition is precisely that it replaces tele-calling headcount cost the group can measure directly.",
    workflows: [
      {
        name: "Lead follow-up and test-drive conversion",
        friction: "Web and walk-in leads are worked by tele-callers on lists during showroom hours; premium-car prospects are working professionals who do not answer daytime calls, and the lead is marked unresponsive after two attempts.",
        outcome: "Leads engaged in minutes on WhatsApp or voice at the hour the prospect is actually available, qualified consistently, and converted into booked test drives on a named consultant's calendar.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["OEM lead management systems", "Dealer DMS", "Test-drive scheduling", "Dealer CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Service-slot booking and bay-utilisation management",
        friction: "Workshop booking runs through phone lines that congest at opening; unfilled bays on slow days and overbooked Saturdays are managed by reactive calling rather than by demand shaping.",
        outcome: "Bookings taken and actively steered toward under-utilised slots, lifting the bay-utilisation metric that directly drives the group's after-sales profitability.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Dealer DMS workshop scheduler", "Service history", "Customer database"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Insurance-renewal and service-package attach outreach",
        friction: "Renewal calling is done by the same small tele-calling team that chases leads, so whichever activity is more urgent that week starves the other, and renewal capture is inconsistent quarter to quarter.",
        outcome: "Renewal outreach that runs at full coverage independent of tele-caller availability, stabilising a high-margin revenue line the group reports on.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Insurance partner systems", "Dealer DMS", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Showroom and workshop telephone lines as the primary customer channel",
        "OEM-mandated CRM and DMS systems for lead management and workshop scheduling",
        "In-house tele-calling teams handling lead follow-up, service reminders and renewals",
        "Web enquiry forms and digital campaigns feeding OEM lead systems",
      ],
      gaps: [
        "No response to a lead outside showroom working hours, when premium prospects actually engage",
        "No single customer view across the multiple OEM brands the group represents",
        "Workshop slot booking cannot be completed without a human on the dealer side",
        "Renewal capture fluctuates with tele-calling capacity rather than running at base coverage",
      ],
    },
    risks: [
      "OEM contractual and system restrictions may limit read/write access to mandated CRM and DMS platforms — feasibility must be proven per brand before scope is committed",
      "TRAI DND rules bind lead follow-up and renewal outreach, which are the group's core outbound activities",
      "IRDAI boundaries on insurance solicitation require the transaction to complete through the licensed intermediary with human involvement",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.5,
      automationRate: 0.55,
      basis: "Seller assumptions from dealership count, lead flow and workshop throughput; cost per interaction assumed higher than OEM benchmarks because dealer tele-calling is in-house rather than offshore. Validate against Landmark's tele-calling headcount cost.",
    },
    pilotScope:
      "An 8-week pilot on lead follow-up and test-drive conversion for two premium brands across the Mumbai and Ahmedabad dealerships in Hindi, Gujarati, Marathi and English.",
    expansion: [
      "Extend to service-slot booking with active bay-utilisation steering",
      "Add insurance-renewal and service-package attach outreach",
      "Roll across all represented brands and geographies with cross-brand customer view",
    ],
    stakeholders: [
      "Managing Director, Landmark Cars",
      "Chief Operating Officer / Head of After-Sales",
      "Head of Sales Operations and CRM",
      "Chief Financial Officer",
      "Head of IT / Business Systems",
    ],
    discovery: [
      "What contractual freedom do you have to run a conversational layer against OEM-mandated CRM and DMS platforms?",
      "What is your current median time from lead receipt to first contact, and what is your contact rate on attempt one?",
      "What is your workshop bay utilisation, and how much of the gap is demand shaping versus demand?",
      "What does your tele-calling function cost fully loaded, and how is it split between leads and renewals?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Mercedes prospect who submitted a web enquiry at 11pm is engaged immediately and has a Saturday test drive confirmed before morning.",
  },

  "popular-vehicles-services": {
    operatingContext:
      "Popular Vehicles & Services is a listed south-India automotive dealership group with roots in Kerala, representing Maruti Suzuki across Arena and Nexa channels alongside other brands, and operating across new vehicle sales, service, spares, pre-owned vehicles and driving schools. Its density is highest in Kerala and Tamil Nadu, where the customer base is Malayalam- and Tamil-first and where the service business — not vehicle sales — is the profit engine. Daily operating rhythm is workshop appointment scheduling, service reminders, insurance renewal calls and pre-owned lead follow-up, all run by branch-level staff and small tele-calling teams. Customers reach the group through branch and workshop phone numbers and walk-ins.",
    strategicPressure: [
      { text: "Popular's business is concentrated in Kerala and neighbouring southern states, so its customer conversations are dominated by Malayalam and Tamil rather than Hindi or English.", kind: "verified" },
      { text: "As a listed dealer group it discloses after-sales and service revenue, making workshop throughput and service retention externally visible performance metrics.", kind: "verified" },
      { text: "Branch-level staffing for phone handling is expensive relative to dealer margins, and quality varies by branch because there is no central contact operation.", kind: "inference" },
      { text: "Service-reminder and insurance-renewal calling is probably executed inconsistently branch by branch, leaving measurable renewal revenue uncaptured.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A regional dealership group with a modest corporate function that administers OEM-mandated systems has no software-building capability whatsoever. Any conversational capability is a procured, managed service.",
    whyNotBuild:
      "The specific hard problem — reliable Malayalam and Tamil speech on mobile calls, integrated into a Maruti-mandated DMS — is exactly the kind of capability a regional dealer group can only buy. It is also the capability that is hardest to staff consistently across branches, which is why automating it has direct operating leverage.",
    workflows: [
      {
        name: "Service-appointment booking across branches",
        friction: "Each branch workshop takes bookings on its own phone line; lines are busy at opening, missed calls are not returned, and a customer who cannot get through simply goes to a local garage.",
        outcome: "Centralised, always-available booking in Malayalam and Tamil against live branch workshop capacity, converting calls that are currently lost into workshop revenue.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Dealer DMS workshop scheduler", "Service history", "Branch capacity/rostering", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Service-due and insurance-renewal outreach",
        friction: "Reminder and renewal calling depends on whichever branch staff have time that week, so coverage is uneven and renewals lapse without the customer ever being offered a quote.",
        outcome: "Consistent full-coverage outreach independent of branch staffing, stabilising service retention and insurance attach across the group.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Dealer DMS", "Insurance partner systems", "Owner database", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-owned vehicle enquiry qualification",
        friction: "Pre-owned enquiries arrive through listings and walk-ins and are worked ad hoc; buyers asking about a specific vehicle's availability, condition and finance eligibility get slow, inconsistent answers.",
        outcome: "Immediate qualification against live pre-owned inventory with a viewing booked, improving turn on a working-capital-heavy inventory line.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Pre-owned inventory system", "Finance partner eligibility", "CRM", "Appointment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Branch and workshop telephone lines as the primary customer channel across the network",
        "OEM-mandated DMS and CRM systems for workshop scheduling and customer records",
        "Branch-level staff performing service reminder and insurance renewal calling",
        "Walk-in showroom and service reception as the dominant in-person channel",
      ],
      gaps: [
        "No central capability to answer a customer call when a branch line is busy",
        "Renewal and reminder coverage varies with branch staffing rather than customer base",
        "Bookings cannot be made outside branch working hours",
        "No group-level view of customer contact quality or lost-call volume",
      ],
    },
    risks: [
      "OEM (principally Maruti Suzuki) system access restrictions may constrain what a dealer-side layer can write into the DMS",
      "TRAI DND rules apply to reminder and renewal outreach, the group's core outbound activity",
      "IRDAI boundaries on insurance solicitation require the licensed intermediary to complete the transaction",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 1.3,
      automationRate: 0.55,
      basis: "Seller assumptions from branch count and per-branch service throughput; validate against Popular's actual branch call volumes, missed-call rates and tele-calling cost in discovery.",
    },
    pilotScope:
      "An 8-week pilot centralising service-appointment booking for the Kerala branches in Malayalam, Tamil and English, capturing missed and after-hours calls into confirmed DMS slots.",
    expansion: [
      "Add service-due and insurance-renewal outreach across the full branch network",
      "Extend to pre-owned enquiry qualification and viewing scheduling",
      "Roll into Tamil Nadu and Karnataka branches with Kannada coverage",
    ],
    stakeholders: [
      "Managing Director, Popular Vehicles & Services",
      "Chief Operating Officer / Head of After-Sales",
      "Head of Service Operations",
      "Chief Financial Officer",
      "Head of IT / Business Systems",
    ],
    discovery: [
      "How many calls to your branch workshop lines go unanswered on a typical Monday morning?",
      "Is service-reminder and renewal calling centralised anywhere, or is it entirely branch-managed?",
      "What write access do you have into the Maruti-mandated DMS for appointment creation?",
      "What proportion of your service revenue comes from customers past their free-service period?",
    ],
    flowTemplate: "appointments",
    scenario: "A Swift owner in Kochi who could not get through to the workshop line books a Malayalam-language service slot on the first attempt.",
  },

  "reliance-retail": {
    operatingContext:
      "Reliance Retail operates India's largest organised retail network, spanning grocery (Reliance Fresh, Smart, Smart Bazaar), consumer electronics (Reliance Digital), fashion (Trends, AJIO, Azorte), jewellery (Reliance Jewels), pharmacy and the JioMart digital commerce platform, across thousands of stores in hundreds of cities. Its customer conversations therefore span store-level queries, online order tracking and delivery exceptions, returns and refunds, large-appliance installation, and loyalty programme questions, in every major Indian language. Because the group also owns Jio Platforms, parts of its technology stack — commerce, identity, payments — are built in-house rather than bought. Customers reach it today through app support, chat and FAQ surfaces, format-specific helpline numbers and store staff.",
    strategicPressure: [
      { text: "Reliance Retail's scale across formats — grocery, electronics, fashion, jewellery, pharmacy and digital commerce — means customer support is fragmented by format rather than unified.", kind: "verified" },
      { text: "Ownership of Jio Platforms gives the group genuine in-house build capability, so a whole-platform sale will be refused; the credible motion is co-building specific workflows.", kind: "verified" },
      { text: "Quick-commerce and same-day delivery expectations make delivery exceptions — the single largest driver of contact volume — both more frequent and more time-critical.", kind: "inference" },
      { text: "Large-appliance delivery and installation coordination across Reliance Digital, third-party logistics and installation technicians is likely the highest-friction, highest-contact journey in the group.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. This is not a company that lacks engineers — Jio Platforms builds commerce, payments and telecom infrastructure at national scale. But group engineering is allocated to platform and commerce priorities, not to a multilingual voice-and-orchestration layer for a specific retail format's delivery-exception problem. The realistic entry is a co-build on a bounded workflow where Reliance owns the customer surface and data.",
    whyNotBuild:
      "The question is not capability but allocation and time-to-value. A format-level CX problem competes for Jio engineering attention against national platform priorities and loses. A partner-supplied speech, telephony, orchestration and evaluation substrate delivers a working workflow in a quarter without consuming a scarce internal roadmap slot — that, not the absence of engineers, is the right to win here.",
    workflows: [
      {
        name: "Delivery exception and order-status resolution",
        friction: "An order that misses its slot generates a stale tracking page, an FAQ bot that re-serves the same status, and eventually a call into a format-specific helpline where an agent toggles the OMS and the 3PL portal manually.",
        outcome: "Proactive notification the moment a delivery risk is detected, with reschedule or address correction executed in-channel, cutting repeat contacts per incident and reducing return-to-origin cost.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management system", "3PL / last-mile tracking", "Payments and refunds", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Large-appliance delivery and installation coordination",
        friction: "A refrigerator or air-conditioner purchase involves a delivery slot, a separate installation technician visit and often a third party for the installation, coordinated by phone with the customer chasing each step.",
        outcome: "One thread that schedules delivery, confirms installation, and re-books when a technician slips — collapsing three coordination calls into one governed conversation.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Order management system", "Installation/service partner dispatch", "3PL scheduling", "Warranty registration"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Returns, refunds and exchange handling",
        friction: "Return requests span policy checks, pickup scheduling and refund timelines across formats with different rules, so customers contact repeatedly to find out where the refund is.",
        outcome: "Policy-grounded return decisions, pickup scheduled in-conversation, and refund status answered from the payments pipeline rather than by a promise.",
        channels: ["App chat", "WhatsApp", "Voice"],
        systems: ["Order management system", "Reverse-logistics/3PL", "Payments and refund ledger", "Returns policy engine"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "In-app support and chat surfaces across JioMart, AJIO and format-specific apps",
        "Format-specific customer-care telephone numbers for grocery, electronics and fashion",
        "Order tracking pages and self-service return initiation on digital commerce properties",
        "Store staff and store-level phone contact as the fallback channel for in-store customers",
      ],
      gaps: [
        "No unified customer identity across formats — the same customer is a different record in each",
        "Delivery exceptions surface reactively rather than being pushed before the customer notices",
        "Large-appliance installation coordination cannot be completed in a single thread",
        "Regional-language depth in voice support does not match the geographic spread of the store network",
      ],
    },
    risks: [
      "DPDP obligations are substantial given the breadth of customer data across formats; purpose limitation across format boundaries needs explicit design",
      "Group data-governance policy may require the conversational layer to operate on Reliance-controlled infrastructure, which shapes the deployment architecture",
      "Peak-season change freezes around major sale events will constrain deployment windows, and those are precisely the periods with the highest volume",
    ],
    economics: {
      volumeMonthly: 8000000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions from store and digital-commerce order scale across formats; the figure is an order-of-magnitude placeholder pending format-by-format contact data from Reliance in discovery.",
    },
    pilotScope:
      "A 12-week co-build pilot on large-appliance delivery and installation coordination for Reliance Digital in three metros, in Hindi, Marathi, Tamil and English, with Reliance owning the customer surface.",
    expansion: [
      "Extend to delivery-exception handling across JioMart grocery orders in the same cities",
      "Add returns, refunds and exchange handling across fashion and electronics formats",
      "Scale nationally with full regional-language coverage and a unified cross-format customer view",
    ],
    stakeholders: [
      "Chief Executive, Reliance Digital / format business head",
      "Head of Customer Experience, Reliance Retail",
      "Head of Supply Chain and Last-Mile Operations",
      "Chief Technology Officer, Reliance Retail",
      "Head of Digital Commerce (JioMart)",
    ],
    discovery: [
      "Which formats route customer contact through Jio-built stacks and which use external platforms today?",
      "How many contacts does a single large-appliance delivery-plus-installation journey generate end to end?",
      "What is your return-to-origin cost, and how much of it is addressable by earlier exception contact?",
      "Where would you draw the boundary between what Jio builds and what a partner supplies for a workflow like this?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Reliance Digital customer in Chennai is told in Tamil that the air-conditioner installer will slip, and re-books both delivery and installation in one thread.",
  },

  "trent-westside-zudio": {
    operatingContext:
      "Trent, the Tata Group's fashion retail company, runs Westside as a full-price own-brand department format and Zudio as a fast-growing value fashion chain, alongside Star grocery, expanding store count aggressively into tier-2 and tier-3 cities. Its model is unusual in Indian fashion retail: almost entirely own-brand merchandise, tight inventory turns, and lean central overheads, with growth driven by rapid new-store openings rather than heavy marketing. Customer conversations centre on the Westside loyalty programme, online orders and returns from the Westside digital channel, product and size availability at specific stores, and gift-card queries. Customers reach the company through a customer-care line, app and website support, store staff, and Tata Neu where the loyalty programme intersects with the group's platform.",
    strategicPressure: [
      { text: "Zudio's store expansion has been among the fastest in Indian retail, taking the brand into towns where the customer base is vernacular-first and unfamiliar with app-based service.", kind: "verified" },
      { text: "Trent's operating model is built on lean central costs and high inventory turn, so any support function that scales linearly with store count is structurally unattractive.", kind: "verified" },
      { text: "Loyalty programme membership and the Tata Neu linkage generate a steady stream of points, tier and voucher queries that are low-value individually but high-volume in aggregate.", kind: "inference" },
      { text: "Group-level pressure to route customer engagement through Tata Neu may constrain a standalone conversational deployment, which needs qualifying early.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Trent's celebrated capability is merchandising, store operations and supply-chain turn — not technology. It runs deliberately thin central functions and has no engineering organisation that would build conversational infrastructure; technology at Tata group level sits with Tata Digital rather than with the retail operating company.",
    whyNotBuild:
      "Trent's entire operating philosophy is to avoid central cost that scales with store count. Building and staffing a speech, telephony and orchestration capability is exactly the kind of fixed central overhead the company has structurally avoided, and the buying argument writes itself: support cost per store falls as the network grows rather than rising with it.",
    workflows: [
      {
        name: "Loyalty programme and voucher support",
        friction: "Points balance, tier status, voucher validity and Tata Neu linkage questions arrive through a care line and store staff, who cannot resolve them and escalate, leaving the customer waiting on a call-back.",
        outcome: "Instant, grounded loyalty answers in the customer's language with voucher issues resolved in-conversation, removing a high-volume low-value contact category from human queues.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Loyalty programme platform", "Tata Neu / group loyalty integration", "POS transaction history", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Online order, return and exchange handling",
        friction: "Returns and exchanges from the digital channel require the customer to chase pickup scheduling and refund status, and in-store exchange eligibility for an online purchase is answered inconsistently by store staff.",
        outcome: "Policy-grounded return and exchange decisions with pickup or store-exchange arranged in-conversation and refund status answered from the payments record.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management system", "Reverse logistics/3PL", "Payments and refund ledger", "Store POS"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Store-level availability and new-store enquiry handling",
        friction: "Customers in newly opened tier-2 city stores call about size and product availability, opening hours and offers; there is no channel that answers reliably, so the query goes to store staff mid-shift.",
        outcome: "Vernacular self-service on availability, hours and offers for every store including brand-new ones, protecting store staff productivity during the expansion the company is built on.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Store inventory / POS", "Store master data", "Promotions and offers system"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A customer-care telephone line and email support for Westside and Zudio customers",
        "A Westside loyalty programme with app and in-store enrolment and points tracking",
        "Website and app-based order tracking and return initiation for the digital channel",
        "Store staff as the de facto first line of customer query handling",
      ],
      gaps: [
        "Loyalty and voucher questions cannot be resolved without a human check",
        "No vernacular support channel matched to the tier-2 and tier-3 towns the brand is entering",
        "Store-level product availability is unanswerable outside the store itself",
        "Online-to-store return and exchange rules are applied inconsistently by store staff",
      ],
    },
    risks: [
      "Tata group governance may require customer engagement to route through Tata Neu, constraining a standalone deployment",
      "DPDP obligations across loyalty data shared between the retail company and the group platform",
      "Festive and end-of-season sale periods create change freezes and volume spikes simultaneously — deployment windows must be planned around them",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions from store count, loyalty membership scale and digital-channel order volume; validate against Trent's actual care-line and digital-support contact data.",
    },
    pilotScope:
      "An 8-week pilot on loyalty and voucher support plus store availability enquiries across the Westside network in Hindi, Marathi, Tamil and English.",
    expansion: [
      "Extend to online order, return and exchange handling across the digital channel",
      "Add Zudio store-level enquiry handling with vernacular coverage for tier-2 and tier-3 towns",
      "Integrate with the group loyalty platform for a unified customer conversation",
    ],
    stakeholders: [
      "Chief Executive Officer, Trent",
      "Head of Customer Experience / Customer Care",
      "Head of E-commerce and Omnichannel",
      "Chief Information Officer, Trent",
      "Head of Retail Operations (Westside / Zudio)",
    ],
    discovery: [
      "Does Tata Digital mandate a group-level customer engagement platform for Trent's formats?",
      "What proportion of your care-line volume is loyalty and voucher queries versus orders and returns?",
      "How do you handle customer queries in a newly opened store in a town where you have no support presence?",
      "How does your support cost per store trend as the network grows — is it flat or rising?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Westside loyalty member in Nashik checks her points and redeems a voucher in Marathi without a store visit.",
  },

  "avenue-supermarts-dmart": {
    operatingContext:
      "Avenue Supermarts operates the DMart chain of everyday-low-cost supermarkets, running large-format owned stores concentrated in Maharashtra, Gujarat, Telangana, Andhra Pradesh and Karnataka, with the DMart Ready pickup-and-delivery service as its digital arm. The business is built on an extreme cost discipline: owned real estate, low operating expense, thin gross margins recovered through inventory turn, and famously restrained spending on anything that does not directly drive throughput. Customer conversations are concentrated in DMart Ready — order status, substitution, slot changes, refunds — plus store-level queries about stock and offers. Customers reach the company through the DMart Ready app, a customer-care line and store staff.",
    strategicPressure: [
      { text: "DMart's competitive position rests on being structurally lower cost than rivals, which makes any per-contact support cost a direct threat to the model rather than a line item.", kind: "verified" },
      { text: "The DMart Ready pickup-and-delivery business generates a support load — substitutions, slot changes, missing items, refunds — that store-only retail simply does not have.", kind: "verified" },
      { text: "Quick-commerce competitors are attacking the same basket with faster delivery, which pressures DMart Ready to improve service reliability without adding cost.", kind: "inference" },
      { text: "The company likely runs minimal dedicated customer-care headcount by design, so the pitch must be framed as cost avoidance rather than experience improvement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led, with an unusually hard cost bar. Avenue Supermarts is an operations company with deliberately minimal technology ambition; it has no engineering organisation and no history of building customer-facing systems. But its frugality means it will also refuse to buy anything whose cost per contact is not demonstrably below the alternative of doing nothing.",
    whyNotBuild:
      "Building would require permanent engineering headcount, which is antithetical to a business model that has succeeded specifically by not carrying such costs. The realistic risk on this account is not that DMart builds — it is that DMart declines to solve the problem at all, so the commercial case must be pure, defensible cost-per-contact arithmetic against their current fully-loaded support cost.",
    workflows: [
      {
        name: "DMart Ready order status, substitution and slot changes",
        friction: "A customer whose order has a substituted or unavailable item, or who needs a different pickup slot, has no way to resolve it other than calling; the call queue is small by design so waits are long.",
        outcome: "Order changes, substitution acceptance and slot rescheduling completed in-conversation at a cost per contact that fits DMart's economics, preventing order abandonment.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["DMart Ready order management", "Store fulfilment/pick systems", "Slot scheduling", "Payments and refunds"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Refund and missing-item resolution",
        friction: "A missing or damaged item requires the customer to report it, wait for verification, and then chase the refund; each step is a separate contact and the refund timeline is opaque.",
        outcome: "Policy-bounded resolution at first contact with refund status answered live from the payments record, eliminating the repeat-contact tail.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Order management", "Refund/payments ledger", "Store fulfilment records", "Case management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Store stock, timing and offer enquiries",
        friction: "Customers call stores about stock, opening hours and current offers, occupying staff whose time is scheduled for shelf and checkout throughput.",
        outcome: "Vernacular self-service on store-level questions, protecting the store-labour productivity that the low-cost model depends on.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Store inventory / POS", "Store master data", "Promotions system"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "The DMart Ready app and website for order placement, slot selection and order tracking",
        "A customer-care telephone number and email for order and store queries",
        "Store-level staff handling walk-in and telephone enquiries at the store",
        "SMS and app notifications for order confirmation and pickup readiness",
      ],
      gaps: [
        "Substitutions and slot changes cannot be resolved without waiting in a deliberately small call queue",
        "Refund status is opaque to the customer until the money arrives",
        "No vernacular voice channel matched to the Marathi, Gujarati and Telugu customer base",
        "Store staff absorb enquiry load that directly competes with throughput work",
      ],
    },
    risks: [
      "The cost bar is the primary commercial risk: any proposal must show cost per contact below DMart's current fully-loaded support cost, or it will be declined regardless of experience benefit",
      "DPDP obligations on customer order and contact data used across the Ready and store businesses",
      "TRAI DND rules apply to any proactive outbound order or offer messaging",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions deliberately set at the low end because DMart's cost discipline will not support metro-BPO pricing; validate DMart's actual fully-loaded cost per contact before presenting any business case.",
    },
    pilotScope:
      "An 8-week pilot on DMart Ready order status, substitution and slot changes for the Mumbai and Pune clusters in Marathi, Hindi and English, priced explicitly against DMart's current cost per contact.",
    expansion: [
      "Add refund and missing-item resolution with live refund status",
      "Extend to store stock, timing and offer enquiries to relieve store staff",
      "Scale to Gujarat, Telangana and Karnataka with Gujarati, Telugu and Kannada coverage",
    ],
    stakeholders: [
      "Chief Executive Officer, Avenue Supermarts",
      "Head of DMart Ready / E-commerce Operations",
      "Chief Financial Officer",
      "Head of Retail Operations",
      "Head of IT / Systems",
    ],
    discovery: [
      "What is your current fully-loaded cost per customer contact, and what number would make automation obviously worth doing?",
      "How many DMart Ready orders generate a customer contact, and what are the top three reasons?",
      "How much store-staff time goes to answering phone enquiries rather than floor work?",
      "What is your refund-related repeat-contact rate today?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A DMart Ready customer in Thane accepts a substitution and moves her pickup slot in Marathi without joining a call queue.",
  },

  "shoppers-stop": {
    operatingContext:
      "Shoppers Stop runs a department-store chain across major Indian cities selling third-party and own-brand apparel, beauty and accessories, with beauty specialty formats and a digital channel alongside. Its commercial engine is the First Citizen loyalty programme, which accounts for a substantial share of sales and makes points, tiers, vouchers and personalised offers the most frequent customer conversation. It also operates personal-shopper services in stores, and omnichannel fulfilment where online orders may ship from store inventory. Customers reach it through a customer-care line, app and website support, store staff and personal shoppers, and loyalty-programme communications.",
    strategicPressure: [
      { text: "First Citizen is central to Shoppers Stop's commercial model, with loyalty members contributing a large share of revenue, which makes loyalty servicing a revenue-protection activity rather than a cost centre.", kind: "verified" },
      { text: "Department-store retail in India faces sustained pressure from vertically-integrated fast-fashion chains and online marketplaces, compressing margins and scrutinising every support cost.", kind: "verified" },
      { text: "Omnichannel fulfilment from store inventory increases order-accuracy exceptions — wrong item, unavailable after order, delayed dispatch — which are contact-generating by nature.", kind: "inference" },
      { text: "Personal-shopper and beauty-consultation appointment demand is probably handled ad hoc by store staff rather than through a bookable system, leaving conversion on the table.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Shoppers Stop is a retail operator whose technology function integrates and administers packaged retail systems — POS, loyalty, order management — rather than building platforms. Under margin pressure it has no capacity or inclination to fund a conversational-AI engineering effort.",
    whyNotBuild:
      "A mid-scale department-store chain under structural margin pressure cannot justify permanent speech, telephony and orchestration engineering. What it can justify is removing a high-volume, low-complexity contact category — loyalty servicing — from human queues at a measurable cost per contact.",
    workflows: [
      {
        name: "First Citizen loyalty and voucher servicing",
        friction: "Points balance, tier progression, voucher validity and offer-eligibility questions arrive constantly through the care line and store desks; each is trivial to answer but requires a human to look it up.",
        outcome: "Instant grounded loyalty answers with vouchers reissued or applied in-conversation, removing the single largest contact category from human handling.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Loyalty platform (First Citizen)", "POS transaction history", "Promotions and offers engine", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Omnichannel order status and returns",
        friction: "Orders fulfilled from store inventory sometimes fail after confirmation; the customer discovers this through a delay, then chases status and refund across the care line and the app.",
        outcome: "Proactive notification of fulfilment exceptions with an alternative store or refund resolved in-channel, cutting the repeat-contact tail on omnichannel orders.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management system", "Store inventory / POS", "3PL delivery tracking", "Refund ledger"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Personal-shopper and beauty-consultation booking",
        friction: "High-value styling and beauty appointments are arranged informally by individual staff over phone and messages, with no shared calendar, so slots go unfilled and no-shows are unmanaged.",
        outcome: "Bookable, reminded and rescheduled consultations against real staff availability, lifting a high-conversion service that currently depends on individual initiative.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Staff scheduling/appointment system", "Loyalty and customer profile", "Store master data"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "The First Citizen loyalty programme with app-based points and tier visibility",
        "A customer-care telephone line and email support",
        "App and website order tracking and return initiation for the digital channel",
        "In-store personal shoppers and beauty advisors serving customers directly",
      ],
      gaps: [
        "Loyalty and voucher questions require a human lookup despite being fully determinable from systems",
        "Omnichannel fulfilment failures are discovered by the customer rather than announced by the retailer",
        "Personal-shopper appointments are not centrally bookable or reminded",
        "Regional-language support depends on which agent answers the care line",
      ],
    },
    risks: [
      "DPDP obligations on loyalty behavioural data, which is the richest customer data the company holds and the most tempting to reuse for marketing without a clean basis",
      "TRAI DND rules constrain loyalty and offer outreach, which is inherently promotional rather than transactional",
      "End-of-season sale and festive periods combine peak volume with change freezes, limiting deployment windows",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from loyalty membership scale and store-plus-digital order volume; validate against Shoppers Stop's actual care-line contact mix in discovery.",
    },
    pilotScope:
      "An 8-week pilot automating First Citizen loyalty and voucher servicing across all stores in Hindi, Marathi, Kannada and English, integrated with the loyalty platform.",
    expansion: [
      "Extend to omnichannel order status, fulfilment-exception notification and returns",
      "Add personal-shopper and beauty-consultation booking with reminders",
      "Layer consented, personalised offer conversations onto the loyalty base",
    ],
    stakeholders: [
      "Chief Executive Officer, Shoppers Stop",
      "Chief Customer Officer / Head of Loyalty and CRM",
      "Head of Customer Care",
      "Chief Technology Officer",
      "Head of Omnichannel and E-commerce",
    ],
    discovery: [
      "What share of your customer-care contacts are First Citizen queries versus orders and returns?",
      "How often does an omnichannel order fail after confirmation because store stock was inaccurate?",
      "How are personal-shopper appointments booked and tracked today?",
      "What does your care-line cost per contact look like, and how does it move during end-of-season sale?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A First Citizen member in Bengaluru checks her tier progress and reissues an expired voucher in one WhatsApp conversation.",
  },

  "lifestyle-international": {
    operatingContext:
      "Lifestyle International is the India arm of Dubai-headquartered Landmark Group, operating the Lifestyle department-store chain, Home Centre furniture and home retail, Max value fashion, and associated digital channels across major Indian cities. Its furniture and home business creates an operational profile most fashion retailers do not have: bulky-item delivery scheduling, assembly and installation visits, and post-delivery damage or defect claims, all of which generate long, multi-touch customer conversations. The fashion formats add order, return and loyalty queries at higher frequency and lower complexity. Customers reach the company through a customer-care line, brand app and website support, store staff, and delivery and installation partners.",
    strategicPressure: [
      { text: "Home Centre's furniture business requires delivery slot coordination and assembly visits, which is structurally the highest-friction post-purchase journey in Indian retail.", kind: "verified" },
      { text: "As the India arm of a Gulf-headquartered group, technology direction and platform selection are frequently set centrally, which shapes who the buyer actually is.", kind: "inference" },
      { text: "Furniture returns and damage claims are expensive to resolve and highly contact-intensive, so unresolved exceptions carry direct margin cost, not just satisfaction cost.", kind: "inference" },
      { text: "Assembly and installation are likely delivered by third-party partners, meaning the retailer is answerable for a workforce it does not directly control or schedule.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Landmark Group operates as a retail company with centralised, procured technology across its markets. The India entity administers group-selected platforms and has no software-engineering function that would take on conversational infrastructure.",
    whyNotBuild:
      "A centrally-governed retail group buys retail technology by design; the India entity's role is to operate it. The specific requirement — Indian-language voice, Indian telephony, integration into Indian 3PL and installation-partner systems — is exactly what a Gulf-set group platform will not cover and where a local partner is the only realistic answer.",
    workflows: [
      {
        name: "Furniture delivery and assembly scheduling",
        friction: "A furniture purchase triggers a delivery slot and a separate assembly visit coordinated by phone between the store, a 3PL and an installation partner, with the customer chasing each step and no single party owning the timeline.",
        outcome: "One thread that schedules delivery, confirms assembly, and re-books automatically when a partner slips, collapsing the most contact-intensive journey in the business.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Order management system", "3PL / bulky-item logistics", "Installation-partner dispatch", "Store fulfilment"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Damage, defect and replacement claims",
        friction: "Damage discovered on delivery requires photographs, a claim, an inspection visit and a replacement decision, with each step re-explained to a different person over days.",
        outcome: "Structured in-chat claim intake with photographs, entitlement checked against policy, and inspection or replacement scheduled without repeated re-explanation.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Claims/case management", "Order management", "Inventory and replacement stock", "Installation-partner dispatch"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Fashion order, return and loyalty support",
        friction: "Max and Lifestyle order status, exchange eligibility and loyalty-points queries arrive at high volume into a shared care line, crowding out the complex furniture cases that actually need human attention.",
        outcome: "Routine fashion queries fully self-served in the customer's language, freeing human capacity for the high-value furniture and claims conversations.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management", "Loyalty platform", "Store POS", "Returns/reverse logistics"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer-care telephone line and email support across the group's India brands",
        "Brand apps and websites with order tracking and return initiation",
        "A loyalty programme spanning the group's retail formats in India",
        "Third-party delivery and installation partners performing furniture fulfilment",
      ],
      gaps: [
        "No single owner of the delivery-plus-assembly timeline that the customer can talk to",
        "Damage and defect claims require repeated re-explanation across steps and parties",
        "Assembly visit rescheduling cannot be done by the customer directly",
        "Regional-language coverage in voice does not match the southern and western store concentration",
      ],
    },
    risks: [
      "Group-level technology governance from the Dubai head office may reserve platform decisions centrally — the actual buyer must be established before proposal",
      "DPDP obligations on customer address and contact data shared with 3PL and installation partners",
      "Statements about delivery or assembly dates create commercial expectations against partners the retailer does not control; commitments must be sourced from partner systems, not inferred",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions from store footprint and furniture-plus-fashion order volume; furniture journeys carry far higher contacts per order than fashion, so the mix must be validated in discovery.",
    },
    pilotScope:
      "A 10-week pilot on Home Centre furniture delivery and assembly scheduling in three metros in Hindi, Kannada, Tamil and English, integrated with 3PL and installation-partner dispatch.",
    expansion: [
      "Add damage, defect and replacement claim intake with inspection scheduling",
      "Extend to Lifestyle and Max fashion order, return and loyalty support",
      "Scale nationally with full regional-language coverage and partner performance reporting",
    ],
    stakeholders: [
      "Managing Director, Lifestyle International (India)",
      "Head of Customer Experience, India",
      "Head of Supply Chain and Last-Mile Operations",
      "Chief Information Officer, Landmark Group India",
      "Business Head, Home Centre",
    ],
    discovery: [
      "How many customer contacts does an average furniture order generate from purchase to completed assembly?",
      "Are delivery and installation partner schedules visible to you in real time, or only via partner call-backs?",
      "Do India technology decisions sit locally, or does the Dubai group office select platforms?",
      "What does a damage claim cost you to resolve today, including the contact handling?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Home Centre customer in Bengaluru re-books an assembly visit in Kannada after the installer slips, without calling anyone twice.",
  },

  "v-mart-retail": {
    operatingContext:
      "V-Mart Retail sells value-priced apparel and general merchandise through stores concentrated in tier-2, tier-3 and tier-4 towns across northern, eastern and central India, having also absorbed the Unlimited chain to extend its southern presence. Its customer is price-sensitive, predominantly Hindi- or Bengali-speaking, and interacts with the brand primarily in person; digital engagement is shallow by design because the format's economics do not support heavy technology spend per store. Customer conversations centre on product availability at a specific store, exchange and return policy, offers and store timings — questions that are today answered by store staff mid-shift or not at all. Central customer contact infrastructure is minimal.",
    strategicPressure: [
      { text: "V-Mart's footprint is deliberately concentrated in smaller towns where the customer base is vernacular-first and rarely served by app-based retail support.", kind: "verified" },
      { text: "The acquisition of the Unlimited chain extended the company into southern markets with a different language profile than its Hindi-belt core.", kind: "verified" },
      { text: "Value-format gross margins mean there is essentially no budget for per-store support infrastructure, so any solution must be centrally deployed and cheap per contact.", kind: "inference" },
      { text: "There may be no meaningful central customer-contact function at all, making this a capability-creation sale rather than a replacement sale.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led, absolutely. V-Mart is a value retailer whose technology spend goes to POS, inventory and supply chain. It has no software engineering function and its margin structure would not survive one.",
    whyNotBuild:
      "There is no plausible internal path. The value proposition also has to be unusually simple: a centrally-run vernacular channel that costs a fraction of a rupee-equivalent per contact and requires zero store-level effort. Anything requiring per-store configuration or staff training will fail on this account regardless of technical merit.",
    workflows: [
      {
        name: "Store availability, timings and offer enquiries",
        friction: "Customers call the store to ask whether a size or product is in stock, what the current offer is, or when the store opens; store staff answer between customers, often inaccurately, and many calls go unanswered.",
        outcome: "A single vernacular number answering store-level questions accurately across the whole network, protecting store-staff productivity and preventing wasted customer trips.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Store inventory / POS", "Store master data", "Promotions and offers system"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Exchange and return policy handling",
        friction: "Exchange eligibility is explained differently by different store staff, producing arguments at the counter and escalations that the company only hears about when a customer complains publicly.",
        outcome: "One consistent, policy-grounded answer in Hindi or Bengali before the customer travels to the store, reducing counter disputes and giving the company visibility into policy friction.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Returns policy engine", "POS transaction lookup", "Case management"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Customer complaint capture and store-quality visibility",
        friction: "Complaints about a store — staff behaviour, billing errors, stock claims — surface only when a customer escalates on social media, so the company has no systematic view of store-level service quality.",
        outcome: "A vernacular complaint channel that captures issues at source, routes them to regional management, and produces store-level quality data the company has never had.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Case management / ticketing", "Store master data", "Regional management reporting"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Store-level telephone numbers answered by store staff during trading hours",
        "A basic corporate customer-care contact route via phone and email",
        "In-store staff as the primary and effectively only customer service channel",
        "A loyalty or membership programme with in-store enrolment at participating stores",
      ],
      gaps: [
        "No central channel that answers a customer question when the store is busy or closed",
        "Product availability at a specific store is unknowable without visiting or calling it",
        "Return and exchange policy is applied inconsistently across the network",
        "The company has no systematic visibility into store-level service complaints",
      ],
    },
    risks: [
      "Cost per contact is the binding constraint; at value-format margins, anything approaching typical BPO pricing is unsellable",
      "TRAI DND applies to any outbound offer messaging, and this customer base is heavily DND-registered",
      "Store inventory accuracy in a value format may not be reliable enough to make availability commitments — this must be tested before the workflow promises anything",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 0.8,
      automationRate: 0.6,
      basis: "Seller assumptions set deliberately low for value-format economics, with volume estimated from store count and footfall; validate whether centralised contact exists at all before modelling savings.",
    },
    pilotScope:
      "An 8-week pilot standing up a single central vernacular enquiry line for store availability, timings and offers across one state's stores in Hindi, with store inventory grounding.",
    expansion: [
      "Add exchange and return policy handling with POS transaction lookup",
      "Introduce complaint capture with store-level quality reporting to regional management",
      "Extend to Bengali and to the Unlimited-acquired southern stores with Tamil and Telugu",
    ],
    stakeholders: [
      "Managing Director, V-Mart Retail",
      "Chief Operating Officer / Head of Retail Operations",
      "Chief Financial Officer",
      "Head of IT / Systems",
      "Regional Business Heads (North / East)",
    ],
    discovery: [
      "Do you have any centralised customer contact function today, or is it entirely store-managed?",
      "How reliable is your store-level inventory data — could you commit to an availability answer over the phone?",
      "How do complaints about a specific store reach head office today?",
      "What cost per customer contact would be acceptable at your format's margin structure?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer in Gorakhpur checks in Hindi whether her size is in stock and what the current offer is before travelling to the store.",
  },

  "vishal-mega-mart": {
    operatingContext:
      "Vishal Mega Mart operates a large network of value-format hypermarket stores selling apparel, general merchandise and FMCG, concentrated in tier-2 and smaller cities across the Hindi belt, eastern India and beyond, and listed on Indian exchanges after a large public offering. Its merchandise mix is weighted toward own-brand and private-label products, which gives it margin room that pure-distribution value retailers lack, and it has been extending digital engagement through an app and membership programme. Its customers are predominantly vernacular-speaking and voice-or-WhatsApp-first rather than app-native. Customer conversations today reach the company through store staff, a customer-care contact route, and app-based support for the membership programme.",
    strategicPressure: [
      { text: "Vishal Mega Mart's listing brings public reporting obligations and investor scrutiny on same-store metrics, membership engagement and operating cost that a private value retailer did not face.", kind: "verified" },
      { text: "Private-label penetration gives it margin headroom that pure-play value retailers lack, which makes a modest per-contact support investment defensible where it would not be at a thinner-margin peer.", kind: "verified" },
      { text: "Store density in smaller cities means the customer base skews strongly to Hindi, Bengali and Punjabi speakers who will not adopt an English app-based support journey.", kind: "inference" },
      { text: "The membership and loyalty programme is probably generating a growing tail of points, offer and voucher queries that currently land on store staff with no system-backed answer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Vishal Mega Mart's capability is store operations, private-label sourcing and supply chain. Its technology function runs retail packages — POS, ERP, loyalty — and there is no engineering organisation that would build conversational infrastructure.",
    whyNotBuild:
      "A newly listed value retailer will direct capital toward new stores and private-label development, which is where its return is. Speech, telephony, orchestration and evaluation are permanent fixed costs delivering nothing that shows up in same-store sales, and a bought layer that scales with store count without adding headcount is the only shape that fits.",
    workflows: [
      {
        name: "Membership and offer support in vernacular",
        friction: "Members asking about points, tier benefits, active offers or a voucher that did not apply have to ask store staff, who cannot see the loyalty system and improvise an answer at the counter.",
        outcome: "Grounded loyalty and offer answers in Hindi, Bengali or Punjabi delivered instantly, converting a source of counter friction into a retention touchpoint.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Loyalty/membership platform", "POS transaction history", "Promotions and offers engine", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Store availability, timings and new-store enquiries",
        friction: "Customers phone stores about stock, timings and offers; in newly opened stores nobody has capacity to answer, and the calls simply go unattended.",
        outcome: "One vernacular number serving every store consistently including new openings, protecting store-labour productivity during network expansion.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Store inventory / POS", "Store master data", "Promotions system"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Exchange, return and billing-dispute handling",
        friction: "Exchange eligibility and billing disputes are resolved verbally at the counter with no consistent policy application, and escalations reach head office only through complaints.",
        outcome: "Consistent policy-grounded answers before the customer travels, with disputes logged into a case system that gives head office store-level quality visibility.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Returns policy engine", "POS transaction lookup", "Case management", "Store reporting"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A membership/loyalty programme with in-store enrolment and app-based benefits",
        "A consumer mobile app carrying offers and membership features",
        "A corporate customer-care contact route by phone and email",
        "Store staff and store telephone numbers as the day-to-day customer channel",
      ],
      gaps: [
        "Store staff cannot answer loyalty or offer questions from the system of record",
        "No vernacular support channel matched to the Hindi-belt and eastern customer base",
        "Availability at a specific store cannot be confirmed remotely",
        "Head office has no structured view of store-level complaints or policy friction",
      ],
    },
    risks: [
      "TRAI DND rules constrain membership and offer outreach, which is promotional in nature and targets a heavily DND-registered base",
      "DPDP obligations on membership behavioural data used for personalised offers require an explicit consent basis",
      "Festive-season peaks in a value format combine maximum volume with minimum staff availability; deployment must avoid change freezes around them",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from store count, footfall and membership scale at value-format cost expectations; validate the actual centralised contact volume, which may be far smaller than the latent demand.",
    },
    pilotScope:
      "An 8-week pilot on membership and offer support plus store availability enquiries across one northern state's stores in Hindi, grounded in the loyalty platform and store inventory.",
    expansion: [
      "Add exchange, return and billing-dispute handling with case logging",
      "Extend to Bengali and Punjabi across eastern and northern clusters",
      "Layer consented personalised offer conversations onto the membership base",
    ],
    stakeholders: [
      "Chief Executive Officer, Vishal Mega Mart",
      "Chief Operating Officer / Head of Retail Operations",
      "Head of Marketing and Customer Loyalty",
      "Chief Technology Officer / Head of IT",
      "Chief Financial Officer",
    ],
    discovery: [
      "What does your membership programme generate in customer queries, and where do they land today?",
      "Post-listing, what are your commitments on operating cost per store as the network expands?",
      "Can store staff see loyalty and offer data at the counter, or do they improvise?",
      "How much of your customer contact is Hindi and Bengali voice versus app or English?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A member in Patna asks in Hindi why her voucher did not apply and gets it reissued without visiting the store again.",
  },

  "titan-company": {
    operatingContext:
      "Titan Company, part of the Tata Group, is India's largest branded jewellery and watch retailer, operating Tanishq and Mia in jewellery, the Titan and Fastrack watch brands, Titan Eye+ in eyewear, and Taneira in ethnic wear, through a mix of company-owned and franchised stores plus e-commerce. Its jewellery business runs recurring purchase-advance schemes — customers pay monthly instalments toward a future jewellery purchase — which creates a genuinely unusual communication obligation: monthly instalment reminders, maturity notifications and redemption guidance to a very large enrolled base. Its watch and eyewear businesses add service, warranty and prescription-related conversations. Customers reach Titan through brand customer-care lines, store staff, brand apps and websites, and franchisee-run stores.",
    strategicPressure: [
      { text: "Tanishq's purchase-advance schemes enrol customers into recurring monthly instalment commitments, making instalment reminder and maturity communication a directly revenue-linked operation rather than a service nicety.", kind: "verified" },
      { text: "Titan operates across jewellery, watches, eyewear and ethnic wear with distinct customer journeys and store networks, so support is naturally fragmented by brand.", kind: "verified" },
      { text: "Jewellery is a high-value, trust-dependent purchase where a communication failure — a missed instalment reminder, a wrong appointment — carries reputational weight disproportionate to its operational cost.", kind: "inference" },
      { text: "Franchised store operations may execute scheme communication locally, meaning the corporate centre cannot guarantee consistency of what customers are told.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Titan is a brand, design and retail company; its technology function integrates retail, ERP and CRM packages rather than building platforms. Tata group engineering capability sits in other companies, and Titan's own investment goes into store expansion, design and manufacturing.",
    whyNotBuild:
      "The scheme-communication problem is a governance problem — every instalment reminder is effectively a financial communication that must be accurate, timely, in the customer's language, and auditable. Building that on top of speech, telephony and orchestration infrastructure is entirely outside what a jewellery retailer does, while buying a governed layer with 100% conversation logging is directly aligned to the trust the brand sells on.",
    workflows: [
      {
        name: "Purchase-scheme instalment reminders and maturity outreach",
        friction: "Instalment reminders go out as SMS to a very large enrolled base; customers who want to pay, change a date, or understand maturity terms must call a store or care line, and lapsed instalments are chased inconsistently.",
        outcome: "Two-way instalment reminders in the customer's language with payment completed in-channel and maturity redemption guided to a booked store appointment, protecting a directly revenue-linked programme.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Scheme/instalment administration system", "Payment gateway", "Store appointment scheduling", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store appointment booking and order-readiness updates",
        friction: "High-value jewellery purchases and custom or resized orders require store visits; appointment booking is informal and order-ready notifications are made by individual store staff who may forget.",
        outcome: "Booked, reminded store appointments and reliable order-readiness notifications, improving conversion on high-ticket visits and removing a common source of customer irritation.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Store appointment system", "Order/job tracking (custom and resizing)", "Store master data", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Watch and eyewear service-status support",
        friction: "A watch sent for service or spectacles being fabricated leaves the customer with no status visibility; they call the store, which calls the service centre, and the answer arrives a day later.",
        outcome: "Live service and fabrication status answered in-conversation with collection notification pushed proactively, removing a repetitive contact category from store staff.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Service centre job tracking", "Lens/prescription lab system", "Store POS", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand customer-care telephone lines for Tanishq, Titan watches and Titan Eye+",
        "Brand mobile apps and e-commerce sites with order tracking and scheme information",
        "SMS-based instalment reminders and store communication to scheme customers",
        "Store staff and franchisee teams handling appointments and order updates informally",
      ],
      gaps: [
        "Scheme customers cannot pay an instalment or change a date inside the reminder conversation",
        "Store appointments are not systematically booked, reminded or rescheduled",
        "Watch and eyewear service status requires a human relay between store and service centre",
        "No governed guarantee that franchisee-run stores communicate scheme terms consistently",
      ],
    },
    risks: [
      "Purchase-advance scheme communication touches deposit-like customer money; messaging content and any commitment on maturity terms need compliance review and full auditability",
      "TRAI DND and registered-header requirements bind instalment and maturity outreach at very high volume",
      "DPDP obligations where scheme and purchase data flow to franchisee-operated stores that are separate legal entities",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Seller assumptions driven primarily by scheme-enrolment scale and monthly instalment cadence plus store and service contact; validate the enrolled scheme base and current reminder volumes in discovery.",
    },
    pilotScope:
      "A 10-week pilot on Tanishq purchase-scheme instalment reminders with in-conversation payment across two southern states in Tamil, Telugu, Hindi and English, integrated with the scheme administration system.",
    expansion: [
      "Add scheme maturity outreach with store appointment booking for redemption",
      "Extend to store appointment and order-readiness communication across Tanishq and Mia",
      "Take the layer into Titan watches and Titan Eye+ service-status support",
    ],
    stakeholders: [
      "Chief Executive Officer, Jewellery Division (Tanishq)",
      "Head of Customer Experience, Titan Company",
      "Head of Retail Operations and Franchise Network",
      "Chief Digital Officer / Head of IT",
      "Chief Financial Officer",
    ],
    discovery: [
      "How large is the enrolled scheme base, and what is your instalment lapse rate today?",
      "Can a scheme customer pay an instalment without visiting a store or opening a separate app?",
      "Do franchised stores handle scheme communication themselves, and how do you assure consistency?",
      "How much store-staff time goes to order-readiness and service-status calls rather than selling?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Tanishq scheme customer in Chennai gets her instalment reminder in Tamil and pays it inside the same WhatsApp conversation.",
  },

  "kalyan-jewellers": {
    operatingContext:
      "Kalyan Jewellers operates a large showroom network across India and the Gulf, built originally from Kerala and now spread across southern, western and northern states, with a growing franchise-showroom model alongside company-owned stores and the Candere digital brand. Like its peers, a substantial part of its customer relationship runs through purchase-advance schemes that collect monthly instalments toward a future jewellery purchase, plus bridal-purchase consultations, gold-exchange and buyback enquiries. Its customer base is strongly regional-language — Malayalam, Tamil, Telugu, Hindi — and expects a personal, relationship-led interaction rather than a transactional one. Customers reach it through showroom staff, a customer-care line, brand website and app, and scheme-specific communications.",
    strategicPressure: [
      { text: "Kalyan has expanded materially through a franchise-showroom model, which places more of the customer conversation in the hands of partners the corporate centre does not directly employ.", kind: "verified" },
      { text: "Its footprint spans both India and Gulf markets, so the same brand serves an NRI customer base with different time zones and remittance-linked purchase patterns.", kind: "verified" },
      { text: "Purchase-advance scheme collections are directly working capital: a lapsed instalment is deferred revenue, so reminder effectiveness has a measurable financial consequence.", kind: "inference" },
      { text: "Bridal-purchase consultation demand is likely handled by showroom staff without a bookable system, so high-value appointments depend on individual relationships rather than process.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Kalyan is a promoter-led jewellery retailer whose growth capital goes into showrooms and inventory. It has no software engineering organisation, and its technology function runs retail and ERP packages.",
    whyNotBuild:
      "The requirement is high-volume, financially-sensitive multilingual outreach with full auditability across a mixed company-owned and franchise network — a governance and infrastructure problem, not an application problem. A jeweller expanding showrooms will fund inventory and locations before it funds a speech and telephony platform, and correctly so.",
    workflows: [
      {
        name: "Purchase-scheme instalment and maturity outreach",
        friction: "Instalment reminders are SMS blasts; customers who want to pay must visit a showroom or use a separate payment route, and lapsed instalments are chased by showroom staff inconsistently across a franchise network.",
        outcome: "Two-way multilingual reminders with payment in-channel and maturity redemption converted into a booked showroom appointment, directly improving scheme collection and conversion.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Scheme administration system", "Payment gateway", "Showroom appointment scheduling", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Bridal and high-value consultation booking",
        friction: "Bridal purchase enquiries arrive by phone and walk-in and are handled by whichever staff member is free; there is no shared calendar, so families arrive to find no one prepared and consultations run over each other.",
        outcome: "Structured consultation booking with requirements captured in advance and the right showroom specialist assigned, lifting conversion on the highest-value purchase occasion in the business.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Showroom appointment/staff scheduling", "Customer profile and purchase history", "Inventory/collection availability", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Gold-exchange, buyback and rate enquiry handling",
        friction: "Customers phone showrooms constantly to ask the day's rate, exchange terms and buyback policy; staff answer between customers and terms are explained inconsistently.",
        outcome: "Consistent, grounded rate and policy answers in the customer's language at any hour, removing a very high-frequency query from showroom staff.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Daily rate feed", "Exchange/buyback policy engine", "Showroom master data"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A customer-care telephone line and showroom-level contact numbers across the network",
        "A brand website and app plus the Candere digital jewellery channel",
        "SMS-based scheme instalment reminders to enrolled customers",
        "Showroom staff and relationship-led selling as the primary customer interface",
      ],
      gaps: [
        "Scheme instalments cannot be paid inside the reminder conversation",
        "Bridal and high-value consultations are not systematically bookable or prepared for",
        "Daily rate and exchange-policy questions consume showroom staff time at high frequency",
        "No corporate assurance that franchise showrooms communicate scheme terms consistently",
      ],
    },
    risks: [
      "Purchase-advance schemes involve customer money held against future delivery; communication content and maturity commitments require compliance review and complete auditability",
      "DPDP obligations where customer and scheme data flow to franchise showroom operators as separate entities",
      "Gulf operations sit under different data-protection and telecom regimes, so the India deployment cannot simply be extended without a separate assessment",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions driven by scheme-enrolment scale, showroom count and monthly reminder cadence; validate the enrolled base and lapse rate with the company before modelling value.",
    },
    pilotScope:
      "A 10-week pilot on scheme instalment reminders with in-conversation payment across Kerala and Tamil Nadu showrooms in Malayalam, Tamil and English.",
    expansion: [
      "Add scheme maturity outreach converting into booked showroom redemption appointments",
      "Extend to bridal and high-value consultation booking with requirement capture",
      "Scale to northern and western showrooms with Hindi and Telugu, and assess the Gulf network separately",
    ],
    stakeholders: [
      "Managing Director, Kalyan Jewellers",
      "Chief Operating Officer, India Operations",
      "Head of Marketing and Customer Relationship",
      "Chief Financial Officer",
      "Head of IT / Retail Systems",
    ],
    discovery: [
      "What is your scheme enrolment base and the instalment lapse rate across company-owned versus franchise showrooms?",
      "How does a scheme customer pay an instalment today without walking into a showroom?",
      "How are bridal consultations booked and prepared for, and do you measure their conversion?",
      "How much showroom-staff time goes to answering rate and policy questions by phone?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A scheme customer in Kozhikode receives a Malayalam instalment reminder, pays in-channel, and books a maturity redemption appointment.",
  },

  "croma-infiniti-retail": {
    operatingContext:
      "Croma, operated by Infiniti Retail within the Tata Group, is a consumer-electronics retail chain running large-format and neighbourhood stores across major Indian cities alongside a digital channel integrated with Tata Neu. Its product mix — televisions, large appliances, air conditioners, laptops and mobile phones — means a substantial share of orders require delivery scheduling, installation or demonstration visits, and extended-warranty attach, making post-purchase coordination rather than the sale itself the dominant conversation. Seasonal peaks around festive sales and the summer air-conditioner season compound this. Customers reach Croma through a customer-care line, app and website support, store staff, and the installation and service partners who complete the fulfilment.",
    strategicPressure: [
      { text: "Croma's category mix is weighted toward large appliances and air conditioners that require delivery-plus-installation coordination, which is structurally the most contact-intensive retail journey.", kind: "verified" },
      { text: "Integration into Tata Neu means the customer's loyalty and identity relationship extends beyond Croma, adding a cross-platform dimension to servicing.", kind: "verified" },
      { text: "Summer air-conditioner demand and festive sale periods create volume spikes that fixed contact-centre staffing cannot absorb, exactly when installation partners are also stretched.", kind: "inference" },
      { text: "Extended-warranty attach is likely pitched at the counter and rarely followed up post-purchase, leaving a high-margin revenue pool under-worked.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Infiniti Retail is a merchandising and store-operations business; technology comes from retail packages and, at group level, from Tata Digital rather than from an in-house engineering team at the retail operating company.",
    whyNotBuild:
      "Croma's problem is orchestration across parties it does not control — 3PL delivery, third-party installers, brand service networks — combined with elastic capacity for seasonal spikes. Buying elasticity is the entire point; building a fixed-cost platform to absorb a two-month summer peak would be the worst possible answer to the actual problem.",
    workflows: [
      {
        name: "Delivery and installation scheduling",
        friction: "A large-appliance purchase requires a delivery slot from a 3PL and an installation visit from a brand or partner technician; the customer coordinates both by phone and chases when either slips.",
        outcome: "One conversation that books delivery, confirms installation, and re-books automatically on partner slippage, collapsing three or more contacts per order into a managed thread.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Order management system", "3PL delivery scheduling", "Installation-partner dispatch", "Store fulfilment"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Seasonal air-conditioner demand and service-visit handling",
        friction: "Summer creates a spike in AC purchase, installation and early-service contacts that overwhelms both the contact centre and installer capacity, producing long waits at the moment customer frustration is highest.",
        outcome: "Elastic conversational capacity that absorbs the spike, sets honest installation expectations, and prioritises genuinely urgent cases to human handling.",
        channels: ["Voice", "WhatsApp", "App chat"],
        systems: ["Order management", "Installation-partner capacity", "Brand service-network dispatch", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Extended-warranty attach and renewal outreach",
        friction: "Extended-warranty plans are offered at the counter; customers who declined or deferred are rarely contacted again, and existing plan holders are not systematically approached at renewal.",
        outcome: "Post-purchase and renewal-window outreach at full coverage with policy-bounded terms and payment in-channel, converting a high-margin pool that is currently left to counter conversation.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Warranty plan administration", "POS purchase history", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer-care telephone line and email support for order and service queries",
        "The Croma app and website with order tracking and service-request raising",
        "Tata Neu integration carrying loyalty and identity across group brands",
        "Third-party delivery and installation partners completing large-appliance fulfilment",
      ],
      gaps: [
        "Delivery and installation cannot be coordinated or re-booked in a single customer thread",
        "Seasonal spikes exceed contact capacity precisely when experience matters most",
        "Extended-warranty follow-up after purchase is effectively non-existent",
        "Regional-language voice depth does not match the geographic spread of the store network",
      ],
    },
    risks: [
      "Tata group governance and Tata Neu integration may constrain a standalone conversational deployment — the boundary needs establishing early",
      "DPDP obligations on customer address and contact data shared with 3PL and installation partners",
      "Festive-season change freezes coincide with the highest-volume periods, so deployment windows must be planned around retail calendars",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Seller assumptions from store and digital order volume with a high contacts-per-order ratio for large appliances; validate Croma's actual contact-centre volumes and seasonal peak multiples.",
    },
    pilotScope:
      "A 10-week pilot on large-appliance delivery and installation scheduling across three metros in Hindi, Marathi, Tamil and English, integrated with 3PL and installation-partner dispatch, timed ahead of the summer season.",
    expansion: [
      "Extend to seasonal air-conditioner demand and service-visit handling at peak",
      "Add extended-warranty attach and renewal outreach on the purchase base",
      "Scale nationally with full regional-language coverage and partner performance reporting",
    ],
    stakeholders: [
      "Chief Executive Officer, Infiniti Retail (Croma)",
      "Head of Customer Experience and Service",
      "Head of Supply Chain and Last-Mile Fulfilment",
      "Chief Technology Officer / Head of IT",
      "Head of Services Business (extended warranty and installation)",
    ],
    discovery: [
      "How many contacts does a typical large-appliance order generate from purchase to completed installation?",
      "What does your contact volume look like at the summer AC peak versus a normal month?",
      "Does Tata Neu integration constrain running a separate conversational layer for Croma?",
      "What is your extended-warranty attach rate, and is there any post-purchase follow-up today?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Croma customer in Mumbai whose AC installer slips is told proactively in Marathi and re-books both delivery and installation in one thread.",
  },

  "vijay-sales": {
    operatingContext:
      "Vijay Sales is a family-owned consumer-electronics retail chain built from Mumbai, operating stores across Maharashtra, Gujarat, Delhi NCR and expanding into other states, alongside a digital channel. It competes against larger national chains and online marketplaces primarily on service, price responsiveness and staff product knowledge, with a lean corporate office and a strong regional identity. Its product mix — televisions, large appliances, air conditioners and mobiles — means delivery, installation and demonstration coordination drive most post-purchase conversation, plus price-match and availability enquiries before purchase. Customers reach it through store phone numbers, a customer-care route, the website, and store staff.",
    strategicPressure: [
      { text: "Vijay Sales competes against national chains and online marketplaces where price is transparent, so its defensible differentiator is service responsiveness rather than price.", kind: "inference" },
      { text: "Geographic expansion beyond its Maharashtra and Gujarat base stretches a lean central function that was built for a regional business.", kind: "inference" },
      { text: "Large-appliance and air-conditioner sales carry the same delivery-plus-installation coordination burden as any electronics retailer, but without a large contact-centre operation to absorb it.", kind: "inference" },
      { text: "Customer contact is probably distributed across individual store numbers rather than centralised, so the company may not have visibility into its own missed-call volume.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A family-owned regional electronics chain runs a small IT function administering POS, inventory and e-commerce packages. There is no engineering organisation and no realistic path to building conversational infrastructure.",
    whyNotBuild:
      "For an organisation this size, the entire value is that the capability arrives as a service with no internal engineering, no headcount addition and predictable cost. Any proposal implying internal build effort, per-store configuration or new technical staff will be declined regardless of its merits.",
    workflows: [
      {
        name: "Delivery and installation status support",
        friction: "After a large-appliance purchase the customer calls the store to find out when delivery and installation will happen; store staff phone the warehouse or installer and call back, often late or not at all.",
        outcome: "Delivery and installation status answered directly from fulfilment systems with rescheduling in-conversation, removing a repetitive burden from store staff who should be selling.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Order management system", "Warehouse/delivery scheduling", "Installation-partner dispatch", "Store POS"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pre-purchase availability and price enquiry",
        friction: "Customers phone stores to check whether a model is in stock and what the current price is; calls at peak trading hours go unanswered and the customer buys online instead.",
        outcome: "Every availability and price enquiry answered instantly from live inventory, converting calls that are currently lost to a marketplace competitor.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Store and warehouse inventory", "Pricing/promotions system", "Store master data"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Service-request routing and brand-warranty guidance",
        friction: "Customers with a faulty product call the store, which routes them to the manufacturer's service network; the customer is bounced between retailer and brand with neither owning the outcome.",
        outcome: "Clear entitlement guidance and structured routing to the right brand service network with the case logged, so the retailer retains the relationship without absorbing the repair obligation.",
        channels: ["Voice", "WhatsApp"],
        systems: ["POS purchase history", "Brand service-network directory", "Case management", "Extended-warranty administration"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Store-level telephone numbers answered by store staff as the primary customer channel",
        "A website and digital sales channel with order placement and tracking",
        "A corporate customer-care contact route by phone and email",
        "Store staff product expertise as the brand's stated service differentiator",
      ],
      gaps: [
        "No central capability to answer store calls that go unanswered at peak trading hours",
        "Delivery and installation status requires a store staff member to relay from another system",
        "Availability across stores and the warehouse cannot be answered from a single place",
        "Service-request handling bounces between retailer and manufacturer with no owner",
      ],
    },
    risks: [
      "Contact volume may be too distributed across store numbers to justify a single deployment without first consolidating numbering — this is a feasibility question, not a nice-to-have",
      "TRAI DND rules apply to any proactive offer or delivery outreach",
      "Inventory accuracy across stores must be reliable enough to make availability commitments in-conversation",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions from store count and category mix; the true figure depends on whether contact is centralised at all, which is the first thing to establish in discovery.",
    },
    pilotScope:
      "An 8-week pilot consolidating pre-purchase availability and delivery-status calls for the Mumbai stores onto one number in Marathi, Hindi, Gujarati and English.",
    expansion: [
      "Add installation scheduling and rescheduling with partner dispatch integration",
      "Extend to service-request routing and warranty entitlement guidance",
      "Roll to Gujarat and Delhi NCR stores as the network expands",
    ],
    stakeholders: [
      "Managing Director / Promoter, Vijay Sales",
      "Head of Retail Operations",
      "Head of E-commerce and Omnichannel",
      "Head of IT / Systems",
      "Head of Customer Service",
    ],
    discovery: [
      "How many customer calls come into store numbers on a weekend, and how many go unanswered?",
      "Is there any central customer-contact function, or is everything store-managed?",
      "Can you see live stock across stores and the warehouse from one system?",
      "When a customer has a faulty product, who owns the outcome — you or the brand?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer in Mumbai checks TV availability and current price in Marathi at 9pm and reserves it for pickup the next morning.",
  },

  "abfrl": {
    operatingContext:
      "Aditya Birla Fashion and Retail operates a portfolio of apparel brands and retail formats — the Madura menswear brands Louis Philippe, Van Heusen, Allen Solly and Peter England, the Pantaloons value department format, ethnic-wear brands, and licensed international labels — through company-owned stores, franchised outlets, department-store shop-in-shops and e-commerce, with the group having restructured into separate listed entities to sharpen focus. Its customer conversations are brand-specific by design: a Louis Philippe customer and a Pantaloons customer expect different tone, but both generate order status, exchange, loyalty and store-availability queries. Customers reach it through brand care lines, brand apps and websites, store staff and franchise partners, plus marketplace channels for online orders.",
    strategicPressure: [
      { text: "ABFRL's demerger into separate listed entities separates the Madura lifestyle-brands business from the value and ethnic portfolio, which puts each entity's operating cost under independent scrutiny.", kind: "verified" },
      { text: "Running customer support brand-by-brand across a large portfolio duplicates fixed cost that a consolidated conversational layer could absorb once.", kind: "inference" },
      { text: "A material share of sales flows through third-party marketplaces and department-store shop-in-shops, so the company does not own the customer conversation on those channels.", kind: "inference" },
      { text: "Loyalty programme servicing across brands is probably fragmented, so a customer who shops two group brands is two separate records with two separate support experiences.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. ABFRL is a branded apparel and retail company whose technology function integrates retail, e-commerce and loyalty packages. Aditya Birla group technology capability sits elsewhere, and the fashion business's capital goes into brands, stores and inventory.",
    whyNotBuild:
      "Post-restructuring, each entity is being measured on profitability, which makes new fixed technology cost the hardest thing to justify. A shared conversational layer that serves many brands from one deployment is the consolidation-friendly answer; building it internally would create exactly the central overhead the restructuring was meant to reduce.",
    workflows: [
      {
        name: "Cross-brand order status, returns and exchanges",
        friction: "Each brand runs its own support route with its own policy interpretation; a customer with an online order and a store exchange gets different answers depending on which brand and which channel they contact.",
        outcome: "One layer serving every brand with brand-correct voice and policy-grounded answers, with returns and exchanges arranged in-conversation across owned and franchise stores.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management system", "Store POS", "Reverse logistics / 3PL", "Returns policy engine"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Loyalty and offer servicing across brands",
        friction: "Points, tier and voucher queries reach brand care lines and store staff who cannot resolve them without escalation, and a customer shopping two group brands has no unified view.",
        outcome: "Instant grounded loyalty answers regardless of which brand the customer entered through, removing a high-volume low-value contact category from human queues.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Loyalty platform", "POS transaction history", "Promotions engine", "CRM"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Store availability and reservation for owned and franchise stores",
        friction: "Customers call stores to check size and colour availability; franchise stores answer inconsistently and there is no way to reserve an item, so the customer buys online or from a competitor.",
        outcome: "Live availability answered and items reserved across the owned and franchise network, converting enquiry into a store visit that would otherwise leak online.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Store inventory / POS", "Franchise store inventory feeds", "Reservation/hold system", "Store master data"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand-specific customer-care lines and email support across the portfolio",
        "Brand apps and e-commerce sites with order tracking and return initiation",
        "A loyalty programme spanning group brands with in-store and online enrolment",
        "Store and franchise-partner staff handling in-person and telephone enquiries",
      ],
      gaps: [
        "No shared conversational layer across brands that all face the same customer",
        "Loyalty questions require human lookup despite being system-determinable",
        "Store availability cannot be checked or reserved remotely, particularly at franchise stores",
        "Policy application on exchanges varies by brand, channel and store type",
      ],
    },
    risks: [
      "Post-demerger entity boundaries determine who can contract for a shared layer across brands — this must be mapped before any multi-brand proposal",
      "DPDP obligations on loyalty and purchase data shared with franchise partners as separate legal entities",
      "End-of-season sale and festive periods bring simultaneous volume peaks and change freezes",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from combined brand store count, e-commerce volume and loyalty base; validate whether contact is measured centrally or only brand-by-brand.",
    },
    pilotScope:
      "A 10-week pilot on order status, returns and exchanges for two Madura brands across owned stores and e-commerce in Hindi, Bengali, Tamil and English, from a single deployment serving both brand identities.",
    expansion: [
      "Add loyalty and offer servicing across the full brand portfolio",
      "Extend to store availability and reservation including franchise stores",
      "Consolidate remaining brand care lines onto the shared layer with per-brand reporting",
    ],
    stakeholders: [
      "Managing Director / Chief Executive of the relevant listed entity",
      "Chief Customer Officer / Head of CRM and Loyalty",
      "Head of E-commerce and Omnichannel",
      "Chief Information Officer",
      "Head of Retail Operations and Franchise Network",
    ],
    discovery: [
      "After the demerger, which entity would contract for a layer serving multiple brands?",
      "Is customer support run centrally or brand-by-brand, and what does each brand spend?",
      "Can you see a customer's activity across two group brands today?",
      "Do franchise stores share live inventory with you, and could you commit to availability remotely?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Van Heusen customer in Kolkata arranges a store exchange for an online order in Bengali without calling two different numbers.",
  },

  "metro-brands": {
    operatingContext:
      "Metro Brands retails footwear and accessories through the Metro, Mochi, Walkway and Da Vinci store formats plus exclusive Crocs and other licensed-brand outlets, operating across Indian cities with a promoter-led, profitability-focused operating model and a growing omnichannel channel. Its category creates a distinctive service pattern: footwear sizing is unreliable across brands, so size exchange is a routine rather than exceptional event, and a meaningful share of online orders are exchanged rather than returned outright. Store availability of a specific size in a specific style is the most common pre-purchase question. Customers reach the company through store staff, a customer-care route, brand websites and apps, and marketplace channels.",
    strategicPressure: [
      { text: "Footwear retail generates structurally high size-exchange rates compared with apparel because fit varies unpredictably across brands and styles.", kind: "verified" },
      { text: "Metro Brands operates multiple store formats and licensed-brand outlets, so a single customer may interact with several fascias run on shared back-end systems.", kind: "verified" },
      { text: "A promoter-led business with a stated focus on profitability per store will resist any support cost that scales with store count rather than with revenue.", kind: "inference" },
      { text: "Size and style availability across stores is probably not queryable centrally, so exchange requests are resolved by phoning individual stores.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Metro Brands is a focused footwear retailer with a lean central function running retail packages. There is no engineering organisation and no strategic reason to create one.",
    whyNotBuild:
      "The problem is a logistics-and-availability orchestration problem wrapped in a conversation — matching a customer needing a different size to stock somewhere in the network. Solving that requires integration and multilingual conversation capability, not proprietary software, and a retailer of this scale will always procure it.",
    workflows: [
      {
        name: "Size exchange and store-availability matching",
        friction: "A customer needing a different size must call or visit stores one by one to find stock; online exchange requires a return, a refund and a fresh order, so many customers simply return and buy elsewhere.",
        outcome: "The right size located across the network and an exchange arranged in-conversation, converting a would-be return into a retained sale.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Store and warehouse inventory", "Order management system", "Reverse logistics / 3PL", "Reservation/hold system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Order status and delivery support",
        friction: "Online order status questions and delivery exceptions arrive at a small care team; customers chase repeatedly because the tracking page lags the actual 3PL state.",
        outcome: "Live order and delivery status with rescheduling in-channel, removing the repeat-contact tail from a lean support function.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management system", "3PL tracking", "Payments and refund ledger"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Store availability and reservation before visit",
        friction: "Customers call a store to check whether a style and size are available; calls at peak hours go unanswered, and there is no way to hold an item, so the trip is wasted or not made.",
        outcome: "Availability confirmed and stock held for a stated period, converting enquiry into a store visit with a much higher conversion rate.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Store inventory / POS", "Reservation system", "Store master data"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Store telephone numbers and store staff as the primary customer channel",
        "Brand websites and apps with order placement, tracking and return initiation",
        "A customer-care contact route by phone and email for online orders",
        "Marketplace channels carrying a share of online sales with their own support flows",
      ],
      gaps: [
        "No way to locate a specific size across the store network in a single query",
        "Exchange requires a return-and-reorder cycle rather than a direct swap",
        "Store availability cannot be confirmed or held before the customer travels",
        "Delivery status shown to the customer lags the actual carrier state",
      ],
    },
    risks: [
      "Store inventory accuracy at size-and-style granularity must be reliable enough to commit to availability; footwear inventory accuracy is often weaker than apparel",
      "DPDP obligations on customer order and contact data shared with 3PL partners",
      "Festive and sale-period volume peaks coincide with change freezes on retail systems",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions from store count and omnichannel order volume with a high exchange rate assumed for footwear; validate the actual exchange rate and support contact volume in discovery.",
    },
    pilotScope:
      "An 8-week pilot on size-exchange and store-availability matching for the Metro and Mochi formats in two metros, in Hindi, Marathi and English, grounded in live store inventory.",
    expansion: [
      "Add order status and delivery-exception handling for the online channel",
      "Extend availability-and-hold to all formats including licensed-brand outlets",
      "Scale nationally with additional regional languages",
    ],
    stakeholders: [
      "Managing Director, Metro Brands",
      "Chief Operating Officer / Head of Retail Operations",
      "Head of E-commerce and Omnichannel",
      "Chief Financial Officer",
      "Head of IT / Retail Systems",
    ],
    discovery: [
      "What proportion of your online orders end in an exchange rather than a return, and what does each cost?",
      "Can you query size-level stock across stores centrally today?",
      "How many store calls about availability go unanswered at peak trading hours?",
      "Do you have a mechanism to hold stock for a customer who has enquired?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Mochi customer in Pune finds her size at a nearby store in Marathi and has it held for collection that evening.",
  },

  "bata-india": {
    operatingContext:
      "Bata India operates one of the country's most widely recognised footwear retail networks, combining company-owned stores in larger cities with an aggressive franchise expansion into smaller towns, alongside distribution through multi-brand outlets and a digital channel. Its franchise model means a substantial and growing share of customer-facing stores are run by partners rather than employees, which creates a second audience for communication: the franchise partners themselves, who need stock, replenishment, scheme and settlement support. On the consumer side, footwear sizing drives exchange volume, and store availability is the most common enquiry. Customers reach Bata through store staff, a care line, the website and app, and franchise-store phone numbers.",
    strategicPressure: [
      { text: "Bata India's growth strategy relies heavily on franchise store expansion into smaller towns, shifting a growing share of the customer interface to partners the company does not employ.", kind: "verified" },
      { text: "Franchise partners themselves generate a support load — replenishment, stock, scheme and settlement queries — that is invisible in consumer-support metrics but consumes head-office capacity.", kind: "inference" },
      { text: "Legacy brand recognition brings enquiry volume that a lean modern support function was not sized for, particularly in towns with no company presence beyond a franchise store.", kind: "inference" },
      { text: "Consumer and franchise-partner queries probably arrive on the same overloaded routes, so neither audience is served well.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Bata India executes a global parent's retail playbook centred on product, sourcing and store operations. Its technology function runs retail and ERP packages; there is no engineering organisation building customer-facing platforms.",
    whyNotBuild:
      "The two audiences here — consumers in vernacular languages and franchise partners needing ERP-grounded answers — both require conversation over systems the company already runs. Building speech, telephony and orchestration to serve them would be a first-of-its-kind effort for an organisation with no such history, against a bought alternative that goes live in a quarter.",
    workflows: [
      {
        name: "Exchange, size and store-availability support",
        friction: "Customers call stores to check availability or arrange an exchange; franchise stores answer inconsistently and company policy is applied differently town to town.",
        outcome: "Consistent policy-grounded exchange guidance and live availability across company and franchise stores, in the customer's language, before they travel.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Store inventory / POS", "Franchise store stock feeds", "Returns policy engine", "Store master data"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Franchise-partner stock, replenishment and settlement support",
        friction: "Franchise partners phone or email head office about stock availability, replenishment status, scheme entitlement and settlement, and wait days for a reply from a small commercial team.",
        outcome: "Partners get ERP-grounded answers on stock, orders and settlements immediately in their own language, removing a bottleneck that directly constrains network expansion.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["ERP / distribution management", "Franchise order and settlement systems", "Inventory master", "Partner CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Online order status and return handling",
        friction: "Digital-channel order status and return requests reach a small care team, and returns involving a store drop-off are handled inconsistently between company and franchise locations.",
        outcome: "Order and refund status answered live with returns routed correctly by store type, cutting repeat contacts on the digital channel.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management system", "3PL tracking", "Store POS", "Refund ledger"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national store network combining company-owned and franchise outlets with store telephone contact",
        "A consumer website and app with online ordering, tracking and return initiation",
        "A customer-care telephone and email route for consumer queries",
        "Head-office commercial teams supporting franchise partners by phone and email",
      ],
      gaps: [
        "Availability and exchange policy are applied inconsistently across company and franchise stores",
        "Franchise partners have no immediate, system-grounded answer route for stock and settlement questions",
        "Consumer and partner queries compete for the same limited head-office attention",
        "Vernacular support quality varies entirely with who answers a given store phone",
      ],
    },
    risks: [
      "DPDP obligations where consumer data flows to franchise partners who are separate legal entities",
      "Franchise-partner commercial data (settlements, credit) requires strict entitlement control — a partner must never see another partner's position",
      "TRAI DND rules apply to consumer offer outreach across a heavily DND-registered small-town base",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions combining consumer enquiry volume from store footfall with franchise-partner query volume; validate the split between consumer and partner contact, which is likely undercounted.",
    },
    pilotScope:
      "An 8-week pilot on franchise-partner stock, replenishment and settlement support in Hindi and English across one northern region, grounded in ERP and franchise order systems.",
    expansion: [
      "Extend to consumer exchange, size and availability support across company and franchise stores",
      "Add online order status and return handling for the digital channel",
      "Scale to Bengali, Tamil and Marathi across the national network",
    ],
    stakeholders: [
      "Managing Director, Bata India",
      "Head of Retail and Franchise Business",
      "Head of Customer Service",
      "Chief Information Officer",
      "Head of Supply Chain and Distribution",
    ],
    discovery: [
      "How many queries a week come from franchise partners rather than consumers, and who handles them?",
      "Do franchise stores report stock to you in near real time, or on a lag?",
      "How consistently is exchange policy applied between company and franchise stores?",
      "What is currently the bottleneck to opening franchise stores faster — is partner support part of it?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A Bata franchise partner in Varanasi checks replenishment status and a settlement balance in Hindi without waiting on head office.",
  },

  "malabar-gold-diamonds": {
    operatingContext:
      "Malabar Gold & Diamonds operates one of the largest jewellery showroom networks spanning India and the Gulf, with additional presence in other international markets, run by a promoter group originating in Kerala and expanding through both company-owned and partner showrooms. Its India business is concentrated in the south but extends nationally, serving customers in Malayalam, Tamil, Telugu, Kannada and Hindi. Recurring purchase-advance schemes, bridal purchase journeys, gold exchange and buyback, and daily rate enquiries dominate customer conversation, with the international network adding NRI customers who buy in one country and service in another. Customers reach the company through showroom staff, customer-care numbers, the website and app, and scheme communications.",
    strategicPressure: [
      { text: "Malabar operates across India and Gulf markets under one brand, so a meaningful share of its customer base transacts across borders and expects continuity of scheme and service treatment.", kind: "verified" },
      { text: "Rapid showroom expansion, including partner-operated locations, spreads the customer conversation across a network the corporate centre cannot directly supervise.", kind: "verified" },
      { text: "Scheme instalment collection is a working-capital and revenue-commitment mechanism, so reminder effectiveness has a direct financial consequence rather than a service one.", kind: "inference" },
      { text: "Rate, exchange and buyback enquiries are probably the single highest-frequency call type into showrooms, consuming selling time on questions with a deterministic answer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Malabar is a promoter-run jewellery retailer whose capital and management attention go into showrooms, inventory and gold sourcing. It has no software-engineering function and no history of building customer-facing technology.",
    whyNotBuild:
      "The requirement is multilingual, financially-sensitive, fully-auditable outreach at very high volume across a mixed owned-and-partner network in multiple countries. That is an infrastructure and governance capability. A jeweller adding showrooms every quarter will always buy it, and the audit trail on every scheme conversation is itself a large part of the value.",
    workflows: [
      {
        name: "Gold-scheme instalment reminders and maturity conversion",
        friction: "Instalment reminders are one-way messages; customers who want to pay, defer or ask about maturity terms must reach a showroom, and lapses are chased inconsistently across owned and partner locations.",
        outcome: "Two-way multilingual reminders with in-channel payment and maturity converted into a booked showroom appointment, improving collection and redemption conversion together.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Scheme administration system", "Payment gateway", "Showroom appointment scheduling", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Bridal-purchase consultation booking and preparation",
        friction: "Bridal enquiries are handled ad hoc by whoever answers; requirements are not captured in advance, so families arrive to an unprepared showroom and the highest-value visit in the business is under-served.",
        outcome: "Structured booking with budget, occasion and collection preferences captured beforehand and the right specialist assigned, lifting conversion on the largest-ticket occasion.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Showroom appointment and staff scheduling", "Collection/inventory availability", "Customer profile and purchase history", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rate, exchange and buyback enquiry handling",
        friction: "Customers call showrooms constantly for the day's gold rate, exchange deductions and buyback terms; staff answer between customers and terms are explained inconsistently, occasionally incorrectly.",
        outcome: "Deterministic, grounded answers on rate and policy in the customer's language at any hour, freeing showroom staff for selling and removing a source of dispute.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Daily rate feed", "Exchange and buyback policy engine", "Showroom master data"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "Customer-care numbers and showroom-level telephone contact across the network",
        "A brand website and app with collection browsing and scheme information",
        "SMS-based scheme instalment reminders to the enrolled customer base",
        "Showroom staff performing relationship-led selling and scheme servicing in person",
      ],
      gaps: [
        "Scheme instalments cannot be paid or deferred inside the reminder conversation",
        "Bridal consultations are not systematically booked or prepared for",
        "Rate and policy questions consume showroom selling time despite having fixed answers",
        "No corporate assurance of consistent scheme communication across owned and partner showrooms",
      ],
    },
    risks: [
      "Purchase-advance schemes involve customer money against future delivery; communication content and maturity commitments require compliance review and complete auditability of every interaction",
      "DPDP obligations for the India network, with separate data-protection and telecom regimes governing the Gulf operations — the India deployment cannot be assumed extensible",
      "TRAI DND and registered-header rules bind high-volume instalment and offer outreach in India",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions driven by scheme-enrolment scale, showroom count and rate-enquiry frequency; validate enrolled base, lapse rate and showroom call volumes in discovery.",
    },
    pilotScope:
      "A 10-week pilot on gold-scheme instalment reminders with in-channel payment across Kerala and Tamil Nadu showrooms in Malayalam, Tamil and English.",
    expansion: [
      "Add maturity outreach converting into booked showroom redemption appointments",
      "Extend to bridal-consultation booking with requirement capture and specialist assignment",
      "Scale to Telugu, Kannada and Hindi across the national network, with a separate assessment for Gulf markets",
    ],
    stakeholders: [
      "Managing Director / Chairman's office, Malabar Group",
      "Chief Executive, India Operations",
      "Head of Marketing and Customer Relationship",
      "Chief Financial Officer",
      "Head of IT / Retail Systems",
    ],
    discovery: [
      "What is your scheme enrolment base in India, and what is the instalment lapse rate?",
      "Is scheme outreach run centrally or by individual showrooms, including partner locations?",
      "How many calls a day does a typical showroom take purely about rate and exchange terms?",
      "How do bridal enquiries get booked and prepared for today, and do you measure their conversion?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A scheme customer in Thrissur pays her monthly instalment in Malayalam on WhatsApp and books a maturity appointment for next month.",
  },

  "lenskart": {
    operatingContext:
      "Lenskart is India's largest eyewear retailer, combining a digital-native origin with a very large and growing physical store network across Indian cities and international markets, plus an at-home eye-test service delivered by trained optometrists visiting customers. Its supply chain includes owned lens manufacturing and a prescription-fabrication pipeline that sits between order and delivery, so a substantial share of orders involve a lab step and a fitting rather than a simple dispatch. This produces three distinct high-volume conversation types: appointment scheduling for stores and home visits, order and prescription-fabrication status, and post-delivery fit or prescription adjustment. Customers reach the company through the app, website, store staff, a customer-care line and messaging channels.",
    strategicPressure: [
      { text: "Lenskart's growth is driven substantially by physical store expansion rather than pure e-commerce, which makes store and home-visit appointment scheduling a core operational workflow rather than a peripheral one.", kind: "verified" },
      { text: "The at-home eye-test service requires dispatching a qualified optometrist to a time slot, which is a field-scheduling problem structurally similar to home-service logistics.", kind: "verified" },
      { text: "Prescription eyewear involves a lab fabrication step, so order status is genuinely multi-stage and customers contact repeatedly during a wait they do not understand.", kind: "inference" },
      { text: "Its in-house technology team may already claim support automation on its roadmap, which is the single most important qualification question before investing in the pursuit.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Lenskart is genuinely tech-capable and builds its consumer app, commerce stack and parts of its supply-chain systems. But its engineering priorities are lens technology, manufacturing automation and the consumer product surface — not multilingual voice, telephony and field-scheduling orchestration. The credible motion is partnering on the conversational and scheduling layer while Lenskart retains the app and data.",
    whyNotBuild:
      "The scarce resource is engineering attention, not engineering ability. Every quarter spent building Indian-language speech, carrier telephony and an evaluation harness is a quarter not spent on manufacturing automation or the app experience that differentiates the brand. A partner-supplied substrate delivers the scheduling and voice capability without consuming that roadmap.",
    workflows: [
      {
        name: "Home eye-test and store appointment scheduling",
        friction: "Home eye-test bookings must be matched to optometrist availability and travel geography; rescheduling requires a call, and no-shows waste an optometrist's slot entirely with no recovery.",
        outcome: "Slots booked, confirmed, reminded and rescheduled conversationally against live optometrist availability, raising utilisation of a costly field workforce and cutting no-shows.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Optometrist field-scheduling system", "Store appointment system", "Customer profile", "Routing/geography data"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Prescription-order and fabrication status",
        friction: "A customer waiting for prescription lenses sees a generic 'processing' status through a multi-day lab step and contacts repeatedly; agents check the lab system manually and give an estimate.",
        outcome: "Grounded stage-level status pushed proactively at each lab milestone, suppressing the repeat status contacts that dominate order-related volume.",
        channels: ["WhatsApp", "App chat", "Voice"],
        systems: ["Order management system", "Lens fabrication/lab system", "3PL delivery tracking", "Store fitting schedule"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-delivery fit and prescription adjustment",
        friction: "Customers with discomfort or a suspected prescription error must work out whether to visit a store, request a re-test or claim a remake; the path is unclear and often ends in an unnecessary return.",
        outcome: "Structured triage that distinguishes fit adjustment, re-test and remake, routing each to the right resolution and preserving the sale instead of refunding it.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Order and prescription records", "Store appointment system", "Remake/warranty workflow", "Case management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer app and website with ordering, virtual try-on and appointment booking",
        "An at-home eye-test service with optometrists dispatched to customer locations",
        "A large store network offering eye tests, fitting and after-sales adjustment",
        "A customer-care line and messaging-channel support for orders and appointments",
      ],
      gaps: [
        "Rescheduling a home eye-test still requires a human interaction",
        "Order status during the lab fabrication stage is opaque to the customer",
        "No structured triage distinguishing fit issues from genuine prescription errors",
        "Regional-language voice coverage is thin relative to the geographic spread of stores",
      ],
    },
    risks: [
      "Prescription and eye-test data is health-related personal data under DPDP, requiring stricter handling than ordinary commerce data",
      "Anything approaching clinical advice must escalate to a qualified optometrist — the agent's boundary must be explicit and conservative",
      "TRAI DND rules apply to appointment and offer outreach to the customer base",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from order volume, store count and home-visit scale with a high contacts-per-order ratio due to the fabrication step; validate against Lenskart's actual support and scheduling volumes.",
    },
    pilotScope:
      "A 10-week partner-led pilot on home eye-test and store appointment scheduling in three metros in Hindi, Tamil, Bengali and English, integrated with optometrist field scheduling.",
    expansion: [
      "Add proactive prescription-order and fabrication-status updates",
      "Extend to post-delivery fit and prescription-adjustment triage",
      "Scale nationally with full regional-language coverage and optometrist utilisation reporting",
    ],
    stakeholders: [
      "Chief Business Officer / Head of Retail Operations",
      "Head of Customer Experience",
      "Head of Optometry and Home Services",
      "Chief Technology Officer",
      "Head of Supply Chain and Lens Manufacturing",
    ],
    discovery: [
      "Does your internal technology roadmap already claim support and scheduling automation?",
      "What is your optometrist utilisation on home eye-tests, and what does a no-show cost you?",
      "How many contacts does a prescription order generate during the lab fabrication stage?",
      "How do you currently distinguish a fit complaint from a genuine prescription error before a return?",
    ],
    flowTemplate: "appointments",
    scenario: "A customer in Chennai reschedules her at-home eye test in Tamil and gets a fabrication-stage update on her existing order in the same thread.",
  },

  "asian-paints": {
    operatingContext:
      "Asian Paints is India's largest decorative-paints company, selling through an exceptionally deep network of retail dealers reached by a supply chain that replenishes stores multiple times a week, and increasingly extending into home decor through the Beautiful Homes retail and services proposition, waterproofing, and adjacencies like bath and kitchen fittings. Beyond dealers, its ecosystem includes painting contractors and individual painters whose loyalty programmes and product recommendations effectively decide what a homeowner buys. Its consumer services — colour consultation, site visits, safe-painting service delivery — require scheduling a person to a home at a specific time. Customers and channel partners reach the company today through dealer relationships, a consumer helpline, the Beautiful Homes digital properties, and painter/contractor loyalty programme channels.",
    strategicPressure: [
      { text: "Asian Paints' competitive moat is a dealer supply chain of unusual depth and replenishment frequency, which is also the operation generating the highest volume of channel-partner communication.", kind: "verified" },
      { text: "The company has extended from selling paint into selling painting services and home decor, which introduces appointment scheduling and technician coordination workflows it did not historically need.", kind: "verified" },
      { text: "New well-capitalised entrants into Indian decorative paints intensify competition for dealer shelf space and painter loyalty, raising the value of responsive channel and painter engagement.", kind: "verified" },
      { text: "Its reputation for strong internal supply-chain technology may extend to a build-first instinct on customer-facing systems, which must be tested rather than assumed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Asian Paints genuinely has technology depth, particularly in supply-chain and demand systems, so a straight buy framing understates the customer. But that capability is oriented to the supply chain rather than to multilingual voice and field-service orchestration, and the services business needs a scheduling and conversation layer far sooner than an internal team could deliver one.",
    whyNotBuild:
      "The company's technology reputation rests on supply-chain optimisation, not on speech or contact-centre orchestration. Building Hindi, Tamil, Bengali and Marathi voice at contractor-and-consumer scale, integrating field-technician dispatch, and running an evaluation harness would be a new competence with no supply-chain return. Partner-led lets Asian Paints keep the customer relationship and data while the substrate is supplied.",
    workflows: [
      {
        name: "Painting-service site-visit scheduling and execution updates",
        friction: "A homeowner requesting a painting service waits for a call-back to arrange a site visit, then coordinates repeatedly with a supervisor about crew arrival, materials and timelines over a multi-day job.",
        outcome: "Site visits booked and confirmed conversationally, with proactive daily job-progress updates, converting a fragmented multi-week coordination burden into a managed thread.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Service booking and job management", "Field supervisor/crew scheduling", "CRM", "Materials and dealer supply"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Painter and contractor loyalty engagement",
        friction: "Painter loyalty programme points, redemption and scheme queries are handled by field sales officers during visits, so a painter with a question waits until someone shows up, and the field team's time goes to admin rather than influence.",
        outcome: "Vernacular self-service on points, schemes and redemption for the painter network, freeing field officers for relationship work that actually shifts product choice.",
        channels: ["WhatsApp", "Voice", "IVR"],
        systems: ["Painter loyalty platform", "Rewards/redemption system", "Field-force CRM", "Product knowledge base"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Dealer order and supply-status support",
        friction: "Dealers call sales officers or depots to check order status, stock availability and scheme entitlement; answers depend on reaching a person who then checks a system, which slows a supply chain built on speed.",
        outcome: "Dealers get ERP-grounded answers on orders, availability and schemes immediately in their own language, protecting the replenishment responsiveness that is the company's structural advantage.",
        channels: ["WhatsApp", "Voice"],
        systems: ["ERP / distribution management", "Depot and plant inventory", "Dealer scheme and credit systems", "Logistics tracking"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for product, colour and service enquiries",
        "Beautiful Homes digital properties and stores offering colour consultation and services",
        "A painter and contractor loyalty programme with points and rewards",
        "Field sales officers and a dealer ordering system serving the retail network",
      ],
      gaps: [
        "Service site visits and job progress cannot be tracked by the homeowner in one place",
        "Painters must wait for a field officer to answer loyalty and scheme questions",
        "Dealers cannot self-serve order, stock or scheme status without reaching a person",
        "Vernacular coverage across the painter and dealer network is dependent on field-force language skills",
      ],
    },
    risks: [
      "TRAI DND rules bind outreach to painters and dealers, who are commercial contacts but often on personal DND-registered mobile numbers",
      "DPDP obligations on homeowner data collected during service enquiries and site visits",
      "Any statement of dealer credit or scheme entitlement must come from the ERP with strict per-dealer entitlement control, never inferred",
    ],
    economics: {
      volumeMonthly: 1500000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions combining dealer-network, painter-loyalty and consumer-service contact volumes; validate the painter programme size and dealer query volume in discovery, as both are likely undercounted.",
    },
    pilotScope:
      "A 10-week partner-led pilot on painter and contractor loyalty engagement in two states in Hindi and one regional language, grounded in the loyalty and rewards platform.",
    expansion: [
      "Add dealer order and supply-status support grounded in ERP and depot inventory",
      "Extend to painting-service site-visit scheduling and job-progress updates",
      "Scale nationally across Tamil, Bengali, Marathi and Telugu with field-force reporting",
    ],
    stakeholders: [
      "President, Decorative Business",
      "Head of Home Decor and Services Business",
      "Head of Sales and Channel Management",
      "Chief Digital Officer / Chief Information Officer",
      "Head of Customer Experience",
    ],
    discovery: [
      "How many painters are enrolled in the loyalty programme, and how do they get answers about points today?",
      "How much field-sales-officer time goes to answering routine dealer and painter queries?",
      "Does your internal technology team consider customer and channel conversation part of its roadmap?",
      "For the services business, how does a homeowner find out where their job stands mid-execution?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A painter in Nashik checks his loyalty points and redeems a reward in Marathi without waiting for the sales officer's next visit.",
  },

  "berger-paints": {
    operatingContext:
      "Berger Paints India is the country's second-largest decorative-paints company, with a heritage strength in eastern India and a national dealer network, selling decorative coatings alongside industrial and protective coatings, and running consumer service propositions including the Express Painting service delivery model. Like its larger rival, its route to market runs through paint dealers and, critically, through painters and contractors who influence the homeowner's brand choice. Its consumer service business requires scheduling a site visit, quoting a job, and coordinating a painting crew across several days. Dealers, painters and consumers reach the company today through field sales officers, a consumer helpline, dealer ordering routes and loyalty programme channels.",
    strategicPressure: [
      { text: "Berger competes directly against a much larger incumbent whose structural advantage is dealer supply-chain responsiveness, so channel service quality is Berger's most contested battleground.", kind: "verified" },
      { text: "New well-funded entrants into Indian decorative paints have intensified competition for dealer shelf space and painter loyalty across the whole category.", kind: "verified" },
      { text: "The Express Painting service proposition requires field crew scheduling and homeowner coordination that a paint manufacturer's operating model was never designed for.", kind: "inference" },
      { text: "Painter loyalty engagement is likely dependent on field officer visits, which caps how many painters can be meaningfully engaged per officer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Berger is a coatings manufacturer with a technology function that runs ERP, distribution and loyalty packages. Unlike its larger rival it does not have a comparable in-house technology reputation, and its investment priorities are capacity, distribution reach and brand.",
    whyNotBuild:
      "Berger's competitive problem is responsiveness to dealers and painters relative to a larger rival, and that problem needs solving this year, not after a multi-year internal build. Buying a working multilingual layer that scales painter and dealer engagement beyond field-officer capacity is a direct competitive move; building one is a distraction from capacity and distribution investment.",
    workflows: [
      {
        name: "Painter and contractor loyalty engagement",
        friction: "Painters ask about points, schemes and redemption whenever a field officer visits; between visits there is no answer route, so engagement with the programme decays and the influence it buys is lost.",
        outcome: "Always-available vernacular loyalty servicing for the painter network, multiplying the number of painters meaningfully engaged without adding field headcount.",
        channels: ["WhatsApp", "Voice", "IVR"],
        systems: ["Painter loyalty platform", "Rewards and redemption system", "Field-force CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Express Painting service booking and job coordination",
        friction: "A homeowner enquiring about the painting service waits for a call-back, then a site visit, then a quote; through execution they coordinate with a supervisor by phone with no single source of truth on progress.",
        outcome: "Enquiry to site visit to quote to daily progress handled in one thread, materially improving conversion on a service line that competes on responsiveness.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Service booking and job management", "Crew/supervisor scheduling", "Quotation system", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Dealer order, stock and scheme support",
        friction: "Dealers call sales officers or depots to check order status, stock and scheme eligibility, and the answer depends on catching the right person during working hours.",
        outcome: "Immediate ERP-grounded answers for dealers in their own language, closing the responsiveness gap against a larger competitor's supply chain.",
        channels: ["WhatsApp", "Voice"],
        systems: ["ERP / distribution management", "Depot inventory", "Dealer scheme and credit systems", "Logistics tracking"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for product, colour and service enquiries",
        "A painter and contractor loyalty programme with points and rewards",
        "Field sales officers servicing dealers and painters in person",
        "A dealer ordering route into the distribution system with depot fulfilment",
      ],
      gaps: [
        "Painters have no answer route between field-officer visits",
        "Service enquiries convert slowly because the first response depends on a call-back",
        "Dealers cannot self-serve order and scheme status outside working hours",
        "No consistent vernacular support across the eastern, northern and southern network",
      ],
    },
    risks: [
      "TRAI DND rules apply to painter and dealer outreach on personal mobile numbers",
      "DPDP obligations on homeowner data captured during service enquiry and site visits",
      "Dealer credit and scheme entitlement statements must come from ERP with strict per-dealer isolation",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from dealer count, painter programme scale and consumer service enquiry volume; validate the painter enrolment base and current query handling in discovery.",
    },
    pilotScope:
      "An 8-week pilot on painter loyalty engagement across eastern India in Bengali and Hindi, grounded in the loyalty and rewards platform.",
    expansion: [
      "Add dealer order, stock and scheme support grounded in ERP",
      "Extend to Express Painting enquiry, site-visit booking and job-progress updates",
      "Scale nationally with Tamil and Marathi coverage",
    ],
    stakeholders: [
      "Managing Director, Berger Paints India",
      "Head of Decorative Sales and Channel",
      "Head of Services Business (Express Painting)",
      "Chief Information Officer",
      "Head of Marketing and Painter Engagement",
    ],
    discovery: [
      "How many painters are in your loyalty programme, and how often does each actually interact with it?",
      "What is your conversion rate from painting-service enquiry to booked site visit, and what is the delay?",
      "How do dealers check order and stock status today outside a sales officer's visit?",
      "Where do you lose most against your largest competitor — product, price, or channel responsiveness?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A painter in Kolkata checks his scheme points in Bengali at night and redeems a reward without waiting for the sales officer.",
  },

  "havells-india": {
    operatingContext:
      "Havells India manufactures and sells electrical goods spanning switchgear, cables and wires, fans, lighting, water heaters and small domestic appliances, plus air conditioners, refrigerators and washing machines under the Lloyd brand. It reaches consumers through a very large network of electrical retailers and dealers, and critically through electricians who specify and install its wiring and switchgear products. Its after-sales operation covers both installation-dependent products (air conditioners, water heaters) and warranty service on appliances, delivered largely through authorised service partners rather than owned technicians. Customers, dealers and electricians reach the company through a consumer helpline, brand website and app, dealer and electrician loyalty programmes, and service-partner networks.",
    strategicPressure: [
      { text: "The Lloyd air-conditioner and white-goods business gives Havells a strongly seasonal service load with a summer peak that its historic electricals business never had.", kind: "verified" },
      { text: "Havells reaches consumers through electricians and retailers rather than directly, which makes electrician loyalty engagement a genuine commercial lever rather than a marketing nicety.", kind: "verified" },
      { text: "AC installation and service are delivered by authorised partners, so the brand is accountable for a technician workforce whose schedules it does not directly control.", kind: "inference" },
      { text: "Peak-summer call abandonment is likely severe, meaning the company may be losing installation and service revenue simply because customers cannot get through.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Havells is a manufacturing and brand company whose technology investment goes into manufacturing, distribution systems and product. Customer service runs through a helpline and authorised service-partner networks, with no in-house engineering function building conversational platforms.",
    whyNotBuild:
      "The defining requirement is elasticity — absorbing a summer peak that may be several times baseline volume without carrying that capacity for the remaining nine months. That is precisely the economics that favour a bought, usage-priced capability, and precisely the economics that a fixed internal build destroys.",
    workflows: [
      {
        name: "Air-conditioner service-request intake and technician scheduling",
        friction: "During summer, service and installation requests spike beyond helpline capacity; customers wait on hold, abandon, and call repeatedly, while the service partner's technician schedule is coordinated separately by phone.",
        outcome: "Every request captured regardless of volume, matched to real partner technician availability with an honest window, and updated proactively — converting abandoned calls into booked jobs.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management system", "Authorised service-partner dispatch", "Warranty and product registration", "Spare-parts availability"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Electrician and retailer loyalty engagement",
        friction: "Electricians enrolled in the loyalty programme ask about points, scheme eligibility and redemption; answers depend on catching a field officer or navigating an app many of them do not use comfortably.",
        outcome: "Vernacular voice and WhatsApp self-service for the electrician network, sustaining engagement with the influencers who decide which brand of wiring goes into a building.",
        channels: ["Voice", "WhatsApp", "IVR"],
        systems: ["Electrician loyalty platform", "Rewards and redemption system", "Field-force CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Warranty registration and extended-warranty attach",
        friction: "Product warranty registration depends on the customer completing a form after purchase; many never do, so the brand has no contactable record and loses both service revenue and the extended-warranty opportunity.",
        outcome: "Conversational warranty registration at the point of installation with an extended-warranty offer at the right moment, building a contactable installed-base record the company currently lacks.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Product registration/warranty system", "Service-partner installation records", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for service requests, complaints and product enquiries",
        "A brand website and app with service-request raising and product registration",
        "Electrician and retailer loyalty programmes with points and rewards",
        "An authorised service-partner network performing installation and warranty service",
      ],
      gaps: [
        "Helpline capacity cannot absorb the summer service peak, so requests are lost rather than queued",
        "Technician arrival windows are not committed or communicated proactively",
        "Electricians cannot self-serve loyalty questions in their own language by voice",
        "The company has an incomplete contactable record of its own installed base",
      ],
    },
    risks: [
      "Peak-season deployment risk: any change during the summer AC season is high-stakes, so go-live must be timed before the peak, not during it",
      "TRAI DND rules apply to electrician loyalty and extended-warranty outreach on personal mobile numbers",
      "Service-partner technician schedules are third-party controlled; committing arrival windows requires reliable partner system integration or the promise will fail",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions blending consumer service volume, electrician programme scale and seasonal peaks; the summer peak multiple is the critical figure to validate, since it defines the elasticity value.",
    },
    pilotScope:
      "A 10-week pilot on Lloyd air-conditioner service-request intake and technician scheduling in three northern cities in Hindi and English, deployed before the summer season with partner dispatch integration.",
    expansion: [
      "Add electrician and retailer loyalty engagement in vernacular voice",
      "Extend to warranty registration and extended-warranty attach at installation",
      "Scale nationally across Tamil, Telugu, Bengali and Marathi for the full product portfolio",
    ],
    stakeholders: [
      "Chief Executive Officer / President, Lloyd Business",
      "Head of Customer Service and After-Sales",
      "Head of Sales and Channel (Electricals)",
      "Chief Information Officer",
      "Head of Marketing and Influencer Programmes",
    ],
    discovery: [
      "What is your call abandonment rate at the summer peak versus a normal month?",
      "Can you see authorised service-partner technician availability in real time, or do you rely on partner call-backs?",
      "How many electricians are enrolled in your loyalty programme, and how many are actively engaged?",
      "What proportion of your sold products are ever registered for warranty by the customer?",
    ],
    flowTemplate: "appointments",
    scenario: "A Lloyd AC owner in Delhi at the peak of summer logs a service request in Hindi and gets a committed technician window instead of a busy tone.",
  },

  "voltas": {
    operatingContext:
      "Voltas, a Tata Group company, is among the leading room air-conditioner brands in India, selling through a wide retail and dealer network, with the Voltas Beko joint venture extending it into refrigerators, washing machines and other white goods, alongside a separate engineering projects and services business in commercial HVAC. Its consumer business has an extreme seasonal profile: air-conditioner sales, installations and first-service demand concentrate into the pre-monsoon summer months, and installation is delivered by franchised technician partners rather than employees. The company must therefore coordinate a surge of installation and service jobs through a partner workforce while fielding customer calls at several times baseline volume. Customers reach Voltas through a consumer helpline, brand website and app, dealers, and the service-partner network.",
    strategicPressure: [
      { text: "Room air-conditioner demand in India is sharply seasonal, concentrating sales, installation and early-service volume into a few summer months.", kind: "verified" },
      { text: "Installation and service are executed through franchised technician partners, so Voltas is judged on the performance of a workforce it coordinates rather than employs.", kind: "verified" },
      { text: "Installation delay immediately after purchase is the highest-emotion failure in the category — the customer has paid for a cooling product during a heatwave and cannot use it.", kind: "inference" },
      { text: "Fixed helpline staffing sized between peaks means summer abandonment rates are likely high, with lost installation and AMC revenue that never appears in any report.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Voltas is a Tata engineering and consumer-products company; its technology function runs ERP, service management and distribution systems. Neither the consumer business nor the projects business has an engineering organisation that would build conversational infrastructure.",
    whyNotBuild:
      "The entire commercial argument is elasticity: capacity that expands for a three-month peak and contracts afterwards. Building a fixed-cost internal platform to serve a seasonal spike is the economically worst available answer, and a Tata engineering culture that thinks in terms of capacity utilisation will recognise that immediately.",
    workflows: [
      {
        name: "Installation request intake and technician scheduling at peak",
        friction: "A customer who just bought an air conditioner needs installation within days; requests arrive faster than the helpline can take them, partner technician capacity is coordinated by phone, and the customer has no committed slot.",
        outcome: "Every installation request captured and matched to real partner capacity with a committed window and proactive updates, protecting the moment that most determines brand perception.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management system", "Franchised technician partner dispatch", "Product registration", "Dealer sale records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Breakdown-service intake and status during the summer peak",
        friction: "Breakdown calls during a heatwave hit a helpline already saturated by installation demand; customers abandon and call repeatedly, and there is no way to triage genuine urgency from routine service.",
        outcome: "Elastic intake with triage that prioritises no-cooling failures, honest arrival windows, and proactive status — absorbing the spike without adding permanent headcount.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management", "Technician partner dispatch", "Spare-parts availability", "Warranty records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "AMC and extended-warranty attach after installation",
        friction: "Annual maintenance contracts are pitched inconsistently by technicians at installation and rarely followed up, so a large share of the installed base is never offered one.",
        outcome: "Timed post-installation and pre-season AMC outreach at full coverage with payment in-channel, converting a recurring-revenue pool that currently depends on technician initiative.",
        channels: ["Voice", "WhatsApp"],
        systems: ["AMC administration", "Product registration and installation records", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for installation, service and complaint intake",
        "A brand website and app for service-request raising and product registration",
        "A franchised technician partner network delivering installation and service",
        "SMS and call-based communication of job assignment and technician details",
      ],
      gaps: [
        "Helpline capacity is structurally unable to absorb the summer peak",
        "Customers receive no committed installation window at the point of request",
        "No triage distinguishing an urgent no-cooling failure from routine service during peak",
        "AMC offers depend on technician initiative rather than systematic outreach",
      ],
    },
    risks: [
      "Deployment timing is critical — go-live must precede the summer season, and any change during peak is unacceptable operational risk",
      "Technician partner capacity is externally controlled; committed windows require reliable partner scheduling integration or the commitment will break",
      "TRAI DND rules apply to AMC and pre-season outreach to the installed base",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.2,
      automationRate: 0.6,
      basis: "Seller assumptions with a strong seasonal skew — peak months may run several times this figure; validate the peak-to-trough contact ratio and current abandonment rate, which together define the value.",
    },
    pilotScope:
      "A 10-week pilot on air-conditioner installation request intake and technician scheduling across two northern and one western city in Hindi, Marathi and English, deployed ahead of the summer season.",
    expansion: [
      "Extend to breakdown-service intake with urgency triage during peak",
      "Add AMC and extended-warranty outreach to the post-installation base",
      "Scale nationally across Telugu, Tamil and Bengali including the Voltas Beko white-goods portfolio",
    ],
    stakeholders: [
      "Business Head, Unitary Cooling Products",
      "Head of Customer Service and After-Sales",
      "Head of Service Network and Partner Management",
      "Chief Information Officer, Voltas",
      "Head of Sales and Distribution",
    ],
    discovery: [
      "What is your call abandonment rate in April and May compared with November?",
      "How long after purchase does an average installation actually happen at peak, and what do you commit to the customer?",
      "Can you see franchised technician availability in real time, or is dispatch coordinated by phone?",
      "What is your AMC attach rate on the installed base, and who is responsible for selling it?",
    ],
    flowTemplate: "appointments",
    scenario: "A customer in Nagpur who bought an AC yesterday gets a committed installation window in Marathi instead of a saturated helpline.",
  },

  "blue-star": {
    operatingContext:
      "Blue Star spans two related businesses: room air conditioners and consumer appliances sold through retail channels, and a larger commercial air-conditioning, refrigeration and electro-mechanical projects business serving corporates, hospitals, retail chains and industrial customers. The commercial side carries a substantial annual maintenance contract book, where scheduled preventive maintenance visits, breakdown response against SLA, and contract renewal are the operating rhythm. The consumer side shares the industry's severe summer seasonality in installation and breakdown demand. Service is delivered through a mix of owned engineers and authorised partners. Customers reach the company through a consumer helpline, a commercial service desk and account managers, plus dealer and channel routes.",
    strategicPressure: [
      { text: "Blue Star's commercial and projects business carries an AMC book where scheduled maintenance and SLA-bound breakdown response are contractual obligations rather than service goodwill.", kind: "verified" },
      { text: "The consumer room-AC business shares the category's extreme summer seasonality in installation and breakdown demand.", kind: "verified" },
      { text: "AMC renewal is high-margin recurring revenue whose capture depends on being contacted before expiry with a credible service history — a communication problem, not a pricing one.", kind: "inference" },
      { text: "Commercial customers likely have no self-service route for service-call logging or ticket status, so facility managers phone account managers directly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Blue Star is an engineering company delivering HVAC systems and services; its technology function runs ERP, field-service management and project systems. There is no software organisation that would build conversational or speech infrastructure.",
    whyNotBuild:
      "For an engineering firm, the value here is contractual: reliable SLA-bound intake, complete AMC renewal coverage, and an audit trail for every service commitment. That is achieved by integrating a bought conversational layer with the field-service system it already runs, not by inventing speech and telephony capability that has no relationship to HVAC engineering.",
    workflows: [
      {
        name: "AMC renewal outreach and contract conversion",
        friction: "AMC expiries are worked as calling campaigns by a small team; many contracts lapse without the customer being contacted, and renewal conversations lack the service history that would justify the price.",
        outcome: "Full coverage of the expiring AMC book with service-history-grounded renewal conversations and payment or quotation in-channel, protecting recurring revenue.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["AMC contract administration", "Field-service history", "Quotation system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Breakdown-call intake with SLA-aware triage",
        friction: "Commercial customers phone account managers or a service desk to log a breakdown; logging depends on reaching a person, SLA clocks start late, and status requires chasing.",
        outcome: "Structured breakdown intake at any hour with entitlement and SLA recognised from the contract, engineer assignment confirmed and status pushed proactively.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Field-service management", "AMC contract and entitlement", "Engineer dispatch and scheduling", "Spare-parts availability"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Consumer installation and service intake at seasonal peak",
        friction: "Room-AC installation and breakdown demand spikes in summer beyond helpline capacity, so calls are abandoned and jobs lost to whoever answers first.",
        outcome: "Elastic intake with committed windows during the peak, capturing installation and service revenue that currently evaporates in a busy tone.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management", "Partner and owned engineer dispatch", "Product registration", "Warranty records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for room-AC installation, service and complaints",
        "A commercial service desk with account managers serving contracted customers",
        "A field-service organisation combining owned engineers and authorised partners",
        "An AMC contract book with scheduled preventive-maintenance visit planning",
      ],
      gaps: [
        "Commercial customers cannot log a service call or check ticket status without reaching a person",
        "AMC renewal coverage is limited by calling-team capacity, so contracts lapse silently",
        "Consumer helpline capacity cannot absorb the summer peak",
        "Service history is not brought into the renewal conversation to justify value",
      ],
    },
    risks: [
      "SLA-bound commercial contracts mean any intake failure has contractual consequence — escalation and fallback paths must be watertight",
      "TRAI DND rules apply to AMC renewal outreach, including to individual facility managers on personal numbers",
      "Deployment timing must avoid the summer peak for the consumer workflow, while commercial workflows have no such constraint",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 1.3,
      automationRate: 0.5,
      basis: "Seller assumptions combining consumer seasonal volume and commercial service-desk contact; commercial interactions cost more to serve than consumer ones, so the blended figure needs validating against the actual mix.",
    },
    pilotScope:
      "An 8-week pilot on AMC renewal outreach for the commercial contract book expiring in one region, in Hindi, Tamil and English, grounded in contract and service-history systems.",
    expansion: [
      "Add breakdown-call intake with contract entitlement and SLA-aware triage",
      "Extend to consumer installation and service intake ahead of the summer peak",
      "Scale nationally across both businesses with engineer-utilisation reporting",
    ],
    stakeholders: [
      "President, Electro-Mechanical Projects and Commercial Air Conditioning",
      "Head of Customer Service / Service Business",
      "Head of Unitary Products (room AC and appliances)",
      "Chief Information Officer, Blue Star",
      "Head of Sales, Commercial Contracts",
    ],
    discovery: [
      "What proportion of your AMC book is actually contacted before expiry, and what is your renewal rate?",
      "How does a facility manager log a breakdown outside business hours today?",
      "Do you measure SLA clock start from customer call or from ticket creation, and how big is the gap?",
      "What does the summer peak do to your consumer helpline abandonment rate?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A hospital facility manager logs an SLA-bound chiller breakdown at 2am and gets an engineer assignment and arrival window immediately.",
  },

  "crompton-greaves-consumer": {
    operatingContext:
      "Crompton Greaves Consumer Electricals manufactures and sells fans, lighting, water heaters, kitchen appliances and — distinctively — agricultural and residential pumps, and following its acquisition of Butterfly Gandhimathi also holds a south-India kitchen-appliances franchise. Its products reach consumers through a broad electrical-retail and dealer network, with electricians influencing fan and lighting choices and rural dealers driving pump sales. Its service load splits into two very different customer populations: urban appliance owners requesting warranty service, and rural pump owners for whom a failed pump during irrigation season is an income emergency handled almost entirely by voice in regional languages. Service is delivered through authorised service partners with a central helpline above.",
    strategicPressure: [
      { text: "Crompton's pump business serves agricultural and rural customers whose service expectations, language needs and urgency profile are entirely different from its urban appliance customers.", kind: "verified" },
      { text: "The Butterfly Gandhimathi acquisition added a kitchen-appliances business with its own service network and a strong Tamil Nadu customer concentration.", kind: "verified" },
      { text: "Serving two structurally different customer populations through one helpline means neither is served in the language or urgency mode it needs.", kind: "inference" },
      { text: "Rural pump service demand likely spikes with irrigation cycles, creating a seasonality pattern the company may not be staffing against.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Crompton is a consumer-electricals manufacturer and brand; its technology function runs ERP, distribution and service-management systems. There is no engineering organisation building customer-facing conversational platforms, and post-acquisition integration is consuming management attention.",
    whyNotBuild:
      "The specific hard capability — rural Telugu, Marathi and Tamil voice recognition on poor mobile connections for a farmer whose pump has failed — is genuinely difficult and completely outside a fan-and-pump manufacturer's competence. Buying it is the only rational path, and the value is highest exactly where the customer is least well served today.",
    workflows: [
      {
        name: "Pump breakdown intake and rural service dispatch",
        friction: "A farmer with a failed pump during irrigation calls the dealer or helpline; if the call is not answered in a language he speaks, the issue goes unlogged and the crop is at risk while he finds a local repairer instead.",
        outcome: "Reliable regional-language intake at any hour with warranty entitlement checked and a service partner dispatched, protecting both the crop and the brand's rural reputation.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management system", "Authorised service-partner dispatch", "Warranty and product registration", "Spare-parts availability"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Appliance service-request intake and technician scheduling",
        friction: "Urban customers raise warranty service requests by phone and then chase for a technician visit date, with the service partner's schedule invisible to both the customer and the helpline agent.",
        outcome: "Requests logged with a committed visit window and proactive status, cutting the repeat status contacts that dominate appliance service volume.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management", "Service-partner dispatch", "Warranty records", "Spare-parts availability"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Electrician and dealer channel support",
        friction: "Electricians and dealers ask about scheme entitlement, product specification and stock, and depend on field officers who visit periodically, so questions wait days.",
        outcome: "Immediate vernacular answers on schemes, specifications and availability, extending channel engagement beyond field-officer capacity.",
        channels: ["WhatsApp", "Voice", "IVR"],
        systems: ["Channel loyalty and scheme platform", "ERP / distribution", "Product knowledge base", "Field-force CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A central consumer helpline for service requests across the product portfolio",
        "A brand website and app for service-request raising and product registration",
        "An authorised service-partner network performing warranty and paid service",
        "Channel schemes and loyalty programmes for electricians and dealers",
      ],
      gaps: [
        "Rural pump customers are not reliably served in their own language at the moment of failure",
        "No committed technician visit window is given at the point of request",
        "The Butterfly and Crompton service operations may not present a single face to a shared customer",
        "Channel partners have no answer route between field-officer visits",
      ],
    },
    risks: [
      "TRAI DND applies to service and channel outreach, with rural customers disproportionately DND-registered",
      "DPDP obligations on customer data shared with authorised service partners as separate entities",
      "Warranty entitlement statements must come from the registration and warranty system; an incorrect in-conversation entitlement promise creates direct cost",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from installed-base scale across appliances and pumps; the urban-versus-rural mix materially affects language requirements and handling time, and must be established in discovery.",
    },
    pilotScope:
      "An 8-week pilot on pump breakdown intake and rural service dispatch across two southern and western states in Telugu, Marathi and Tamil, integrated with service-partner dispatch.",
    expansion: [
      "Extend to urban appliance service-request intake with committed visit windows",
      "Add electrician and dealer channel support in vernacular voice",
      "Bring the Butterfly Gandhimathi service operation onto the same layer",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer, Crompton",
      "Head of Customer Service and After-Sales",
      "Business Head, Pumps",
      "Chief Information Officer",
      "Head of Sales and Channel Development",
    ],
    discovery: [
      "What is the split of your service volume between urban appliances and rural pumps?",
      "In which languages can you reliably answer a service call today, and which are you missing?",
      "Does pump service demand spike with irrigation cycles, and how do you staff for it?",
      "Have the Crompton and Butterfly service operations been integrated, or do they run separately?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A farmer in Telangana whose irrigation pump failed logs a service call in Telugu at dawn and gets a partner engineer assigned same-day.",
  },

  "bajaj-electricals": {
    operatingContext:
      "Bajaj Electricals sells consumer products spanning fans, lighting, kitchen appliances and small domestic appliances under the Bajaj brand and licensed brands including Morphy Richards in India, alongside a professional lighting and EPC-derived business. Its consumer products reach customers through a very wide general-trade retail network plus modern trade and e-commerce, and its after-sales runs through authorised service centres rather than owned technicians. The company has been through a strategic reset focused on distribution reach, brand and profitability. Consumer conversations centre on warranty service, spare-part availability for appliances, service-centre location, and product usage questions. Customers reach it through a consumer helpline, brand website, service centres and retail staff.",
    strategicPressure: [
      { text: "Bajaj Electricals' consumer business is built on very wide general-trade distribution, which means a large installed base spread across small towns with only indirect brand contact.", kind: "verified" },
      { text: "After-sales is delivered by authorised service centres rather than owned technicians, so the brand experience depends on a partner network's responsiveness.", kind: "inference" },
      { text: "The company's profitability focus makes service cost per contact a live concern, particularly for low-ticket appliances where a service interaction can exceed the product's margin.", kind: "inference" },
      { text: "Spare-part availability for small appliances is probably the largest source of unresolved service complaints, since parts economics for low-value products are unattractive to service centres.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Bajaj Electricals is a brand and distribution company whose technology spend goes to ERP, distribution management and e-commerce. There is no software organisation building conversational infrastructure, and the strategic focus is distribution and margin rather than technology capability.",
    whyNotBuild:
      "Small-appliance service economics are brutal: the cost of the conversation can approach the value of the repair. That makes cost per contact the whole argument, and it makes an internal build — with permanent engineering cost amortised over low-value interactions — indefensible. A usage-priced bought layer is the only structure that works.",
    workflows: [
      {
        name: "Warranty service-request intake and service-centre routing",
        friction: "A customer with a faulty appliance calls the helpline, is given a service-centre address, and then has to travel there or call it separately; the brand loses sight of whether the issue was ever resolved.",
        outcome: "Requests logged with entitlement checked and routed to a specific service centre with an appointment, and the outcome tracked back so the brand knows its own resolution rate.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management system", "Authorised service-centre network directory", "Warranty and purchase records", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Spare-part availability and ordering",
        friction: "Customers seeking a replacement jar, blade or accessory are told to visit a service centre that may not stock it; there is no way to check or order the part, so the appliance is discarded and the brand relationship ends.",
        outcome: "Part availability answered against inventory with direct ordering, converting an abandonment moment into a small but repeatable revenue and retention event.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Spare-parts inventory and catalogue", "E-commerce/order system", "Service-centre stock", "Logistics tracking"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Product usage and installation guidance",
        friction: "A large share of service calls are not faults at all but usage, installation or settings questions that consume a helpline slot and sometimes trigger an unnecessary service-centre visit.",
        outcome: "Grounded product guidance in the customer's language that deflects non-fault contacts entirely, reducing both helpline load and futile service visits.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Product documentation and knowledge base", "Purchase records", "Case management"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for service requests, complaints and product enquiries",
        "A brand website with product documentation and service-centre locator",
        "An authorised service-centre network performing warranty and paid repairs",
        "Retail and modern-trade staff answering product questions at the point of sale",
      ],
      gaps: [
        "The brand does not know whether a routed service request was ever resolved",
        "Spare-part availability cannot be checked or ordered by the customer",
        "Non-fault usage questions consume the same expensive channel as genuine faults",
        "Regional-language coverage does not match the small-town spread of the installed base",
      ],
    },
    risks: [
      "Cost per contact is the binding constraint on low-ticket appliances; the commercial case must be built on it explicitly",
      "DPDP obligations where customer data is passed to authorised service centres as independent businesses",
      "TRAI DND rules apply to any proactive service or offer outreach to the consumer base",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from installed-base scale and appliance service-contact rates, with cost per interaction held low to reflect small-appliance economics; validate the actual helpline volume and cost structure.",
    },
    pilotScope:
      "An 8-week pilot on warranty service-request intake with service-centre routing and outcome tracking across two states in Hindi, Marathi and English.",
    expansion: [
      "Add spare-part availability and direct ordering",
      "Extend to product usage and installation guidance to deflect non-fault contacts",
      "Scale nationally with Bengali and southern-language coverage across the brand portfolio",
    ],
    stakeholders: [
      "Managing Director, Bajaj Electricals",
      "Business Head, Consumer Products",
      "Head of Customer Service and After-Sales",
      "Chief Information Officer",
      "Head of Spare Parts and Service Network",
    ],
    discovery: [
      "Is your consumer-care centre in-house or already operated by a vendor, and what does it cost per contact?",
      "Do you know your resolution rate once a customer is routed to an authorised service centre?",
      "What proportion of service calls turn out to be usage questions rather than faults?",
      "Can a customer buy a replacement part today without visiting a service centre?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A mixer-grinder owner in Indore checks jar availability in Hindi and orders the replacement part without visiting a service centre.",
  },

  "whirlpool-of-india": {
    operatingContext:
      "Whirlpool of India manufactures and sells refrigerators, washing machines, air conditioners and other home appliances, operating plants in India and selling through a broad dealer, modern-trade and e-commerce network, as part of the global Whirlpool Corporation which has been reshaping its ownership position in the India listed entity. Appliances of this kind are installation-dependent and service-intensive over a long ownership life, so the after-sales operation — breakdown intake, technician visit scheduling, spare-part supply and extended-warranty sales — is where most customer contact occurs. Service is delivered through a mix of authorised service partners and company-managed field operations. Customers reach the company through a consumer helpline, brand website and app, service partners and dealers.",
    strategicPressure: [
      { text: "Whirlpool's India business sits within a global corporation that has been actively reviewing its India shareholding, which puts the India entity's operating performance under heightened scrutiny.", kind: "verified" },
      { text: "Refrigerators and washing machines have long ownership lives, so the service relationship extends many years beyond the sale and generates most of the lifetime contact.", kind: "verified" },
      { text: "Air-conditioner sales bring the same seasonal installation-and-service spike that affects every player in the category.", kind: "inference" },
      { text: "Local autonomy to adopt customer-facing tooling outside globally-mandated platforms is the key qualification question, and may be limited.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led at the India-entity level. Whirlpool India is a manufacturing and sales operation executing a global product and brand playbook; technology platforms are largely globally selected, and there is no India engineering organisation that would build a conversational layer.",
    whyNotBuild:
      "Global appliance-maker technology investment goes into connected appliances and manufacturing, not Indian-language contact-centre orchestration. The India-specific requirement — Hindi, Tamil and Marathi voice, Indian telephony, integration with Indian service-partner dispatch — is exactly what a global platform will not deliver, and an India entity under performance scrutiny will not fund a bespoke build.",
    workflows: [
      {
        name: "Breakdown intake and technician visit scheduling",
        friction: "A customer with a failed refrigerator calls the helpline, describes the fault, and is told a technician will call; the visit window is vague and the customer chases repeatedly over the following days.",
        outcome: "Structured fault intake with a committed visit window from partner scheduling and proactive status updates, removing the chase cycle that dominates appliance service contact.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management system", "Service-partner technician dispatch", "Warranty and purchase records", "Spare-parts availability"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Spare-part status and repair follow-through",
        friction: "When a repair needs a part that is not in the technician's stock, the case stalls; the customer has no visibility of the part's arrival and calls repeatedly, while the technician waits on the same information.",
        outcome: "Part status made visible to the customer and the revisit scheduled automatically on arrival, cutting the single largest source of repeat contact in appliance service.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Spare-parts inventory and logistics", "Service management", "Technician dispatch", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Extended-warranty and AMC attach outreach",
        friction: "Extended-warranty offers are made at purchase or by technicians ad hoc; the large in-warranty base approaching expiry is not systematically contacted, so a recurring revenue pool goes unworked.",
        outcome: "Timed pre-expiry outreach at full coverage with policy-bounded terms and payment in-channel, converting an under-worked pool on a long-lived installed base.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Warranty administration", "Purchase and registration records", "Payment gateway", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for service requests, complaints and product enquiries",
        "A brand website and app for service-request raising and product registration",
        "A service-partner network combined with company field-service operations",
        "SMS and call notifications of technician assignment and visit scheduling",
      ],
      gaps: [
        "No committed technician visit window given at the point of request",
        "Spare-part delays leave both customer and technician without visibility",
        "Extended-warranty outreach is opportunistic rather than systematic",
        "Regional-language service depends on which helpline agent answers",
      ],
    },
    risks: [
      "Global platform mandates may constrain India's ability to procure locally — this must be qualified before pursuit investment",
      "DPDP obligations on customer data shared with authorised service partners",
      "TRAI DND rules bind extended-warranty and service outreach to the installed base",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.1,
      automationRate: 0.55,
      basis: "Seller assumptions from installed-base scale and appliance service-contact rates over a long ownership life; validate against Whirlpool India's actual helpline and service-partner volumes.",
    },
    pilotScope:
      "A 10-week pilot on breakdown intake and technician visit scheduling across two states in Hindi, Marathi and English, integrated with service-partner dispatch.",
    expansion: [
      "Add spare-part status visibility and automatic revisit scheduling",
      "Extend to extended-warranty and AMC pre-expiry outreach",
      "Scale nationally with Tamil, Telugu and Bengali coverage across the product portfolio",
    ],
    stakeholders: [
      "Managing Director, Whirlpool of India",
      "Head of Customer Service and After-Sales",
      "Head of Service Network Operations",
      "Chief Information Officer / Head of IT, India",
      "Chief Financial Officer",
    ],
    discovery: [
      "How much local autonomy do you have to adopt a customer-facing platform outside globally-mandated systems?",
      "What proportion of service cases stall on spare-part availability, and how many contacts does each generate?",
      "Do you commit a visit window to the customer at intake, or only a call-back promise?",
      "What is your extended-warranty attach rate on the base approaching warranty expiry?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A refrigerator owner in Pune gets a committed technician window in Marathi and an automatic revisit booked when the part arrives.",
  },

  "lg-electronics-india": {
    operatingContext:
      "LG Electronics India manufactures and sells one of the country's largest home-appliance and consumer-electronics portfolios — refrigerators, washing machines, air conditioners, televisions and microwaves — through a very wide dealer, modern-trade and e-commerce network, and has completed a separate listing of the India entity on Indian exchanges. Its installed base is among the largest in Indian consumer durables, which makes its service organisation a major operation in its own right: breakdown intake, technician dispatch through owned and partner service networks, spare-part supply, and the sale of annual maintenance and extended-warranty products. Customers reach the company through a national service helpline, brand website and app, service centres, and dealer routes.",
    strategicPressure: [
      { text: "The separate listing of LG Electronics India puts the India entity's revenue, margin and operating cost under direct Indian public-market scrutiny for the first time.", kind: "verified" },
      { text: "LG's installed base across refrigerators, washing machines, air conditioners and televisions is among the largest in Indian consumer durables, making service volume correspondingly large.", kind: "verified" },
      { text: "Service revenue — AMC, extended warranty, out-of-warranty repair — is a meaningful profit pool for an appliance business with a base this size, and its capture depends on outreach coverage.", kind: "inference" },
      { text: "Korea HQ may mandate global CX platforms, which is the primary qualification question determining whether India can contract locally.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led at the India-entity level. LG globally builds product software and connected-appliance platforms, but India customer operations run on procured systems and vendor contact-centre capacity. The India entity is a manufacturing, sales and service organisation, not a software house.",
    whyNotBuild:
      "The India requirement is Indian-language speech at very high volume, Indian carrier telephony, and integration into an Indian service-partner dispatch estate. A Korean platform organisation is not positioned to deliver that, and the newly-listed India entity has every incentive to reduce service cost per contact rather than to fund a build. The realistic contest is against the incumbent BPO, not against an internal team.",
    workflows: [
      {
        name: "Service-request intake and technician scheduling",
        friction: "A very large volume of breakdown and installation requests arrives at a helpline whose capacity is fixed; customers wait, describe the fault to an agent who then books a technician, and chase for the visit date.",
        outcome: "Every request captured at any volume with fault details structured, entitlement checked and a committed visit window given, reducing cost per contact across the largest volume pool in the business.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management system", "Owned and partner technician dispatch", "Warranty and product registration", "Spare-parts availability"],
        value: 3,
        complexity: 3,
      },
      {
        name: "AMC and extended-warranty renewal outreach",
        friction: "AMC and extended-warranty offers depend on technician pitching and limited outbound calling, so a large share of an installed base numbering in the tens of millions is never approached.",
        outcome: "Full-coverage, policy-bounded renewal outreach with payment in-channel, converting a service revenue pool whose capture is currently capped by calling capacity.",
        channels: ["Voice", "WhatsApp"],
        systems: ["AMC and warranty administration", "Product registration records", "Payment gateway", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Repair status and spare-part follow-through",
        friction: "Cases awaiting a spare part stall with no visibility; the customer calls repeatedly for status and the helpline agent can only repeat what the system said yesterday.",
        outcome: "Proactive status at every stage with revisit scheduling on part arrival, suppressing the repeat status contacts that inflate helpline volume without adding value.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Service management", "Spare-parts inventory and logistics", "Technician dispatch", "Case management"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national service helpline handling breakdown, installation and product queries",
        "A brand website and app for service-request raising and product registration",
        "An extensive service-centre and technician network combining owned and partner capacity",
        "SMS-based notifications of technician assignment and job status",
      ],
      gaps: [
        "Helpline capacity constrains both intake quality and outbound renewal coverage",
        "Repeat status contacts on part-delayed cases consume a large share of volume",
        "AMC and extended-warranty outreach reaches only a fraction of the eligible base",
        "Regional-language service quality varies with agent staffing rather than being a governed capability",
      ],
    },
    risks: [
      "Korea HQ global platform mandates may restrict India-level procurement — qualify before investing in pursuit",
      "TRAI DND and registered-header rules bind AMC and warranty outreach at very high volume, where compliance failure scales with the base",
      "DPDP obligations on a very large installed-base dataset shared with partner service networks",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from installed-base scale across multiple durable categories; the figure is an order-of-magnitude estimate that must be validated against LG India's actual helpline and service-network contact data.",
    },
    pilotScope:
      "A 10-week pilot on service-request intake and technician scheduling for one northern region across refrigerators and washing machines, in Hindi and English, integrated with service dispatch.",
    expansion: [
      "Add repair status and spare-part follow-through with automatic revisit scheduling",
      "Extend to AMC and extended-warranty renewal outreach across the installed base",
      "Scale nationally across Tamil, Telugu, Bengali, Marathi and Kannada for the full portfolio",
    ],
    stakeholders: [
      "Managing Director, LG Electronics India",
      "Head of Customer Service / Service Business",
      "Head of Service Network and Technician Operations",
      "Chief Information Officer / Head of IT, India",
      "Chief Financial Officer",
    ],
    discovery: [
      "Does Korea HQ mandate a global CX platform, or can India contract locally for customer-facing systems?",
      "What share of your helpline volume is repeat status contacts on cases already open?",
      "How much of your AMC-eligible installed base is actually contacted in a year?",
      "Who operates your service helpline today, and when does that contract come up for renewal?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An LG washing-machine owner in Lucknow logs a fault in Hindi, gets a committed technician window, and is told automatically when the part arrives.",
  },

  "samsung-india-service": {
    operatingContext:
      "Samsung's India service operation supports an installed base spanning smartphones, televisions, refrigerators, washing machines and air conditioners — among the largest consumer-electronics footprints in the country — through a network of authorised service centres, walk-in Samsung service points, doorstep repair and pickup services, and a national customer-care helpline. Because the portfolio spans a low-value high-volume category (phones) and high-value installation-dependent categories (appliances), the service operation must handle two very different interaction shapes at once: quick repair-status and pickup-scheduling conversations, and slower technician-visit and part-dependent appliance repairs. Customers reach Samsung through the helpline, the Samsung Members app, service-centre walk-ins, and messaging and web support channels.",
    strategicPressure: [
      { text: "Samsung's India installed base across smartphones and home appliances is among the largest of any consumer-electronics brand in the country, producing correspondingly large service contact volume.", kind: "verified" },
      { text: "Samsung operates both walk-in service centres and doorstep/pickup repair models in India, which means scheduling and logistics coordination is a core part of the service conversation.", kind: "verified" },
      { text: "Repair status is the single highest-frequency service contact for smartphone repairs — customers call repeatedly during a repair they cannot see into.", kind: "inference" },
      { text: "India service contact-centre operations are likely delivered through outsourced partners, so the commercial entry is a contract renewal or an augmentation of an existing BPO arrangement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led for the India service operation specifically. Samsung globally is one of the world's largest technology companies and builds device software and its own AI capabilities, but India service communications are an operational function delivered through service partners and outsourced contact centres, not through a local engineering organisation.",
    whyNotBuild:
      "The gap is not model capability — it is Indian-language voice on mobile calls at scale, Indian telephony, and integration into an Indian authorised-service-centre estate with its own job-tracking systems. That is a local operational integration problem that a global device-software organisation is not structured to solve, and the India service P&L will judge any solution on cost per contact against the incumbent outsourcer.",
    workflows: [
      {
        name: "Repair status and service-job tracking",
        friction: "A customer whose phone or appliance is in for repair has no visibility into the job; they call the helpline repeatedly, and each call consumes an agent to read out a status the system already knows.",
        outcome: "Proactive stage-level status pushed at each job milestone with instant answers on demand, suppressing the largest single category of service contact volume.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Service job-tracking system", "Authorised service-centre systems", "Spare-parts availability", "Case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Doorstep-service and pickup scheduling",
        friction: "Booking a doorstep repair or device pickup requires a call, and rescheduling requires another; slot availability is opaque and no-shows waste a technician or courier slot entirely.",
        outcome: "Slots booked, confirmed and rescheduled conversationally against live technician and logistics availability in the customer's language, raising utilisation of a costly field operation.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Field-technician scheduling", "Pickup/logistics partner systems", "Service job creation", "Customer and device records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Warranty entitlement and pre-repair triage",
        friction: "Customers arrive at service centres or book visits for issues that are software-resolvable, out of warranty, or not faults at all, wasting both their trip and a technician slot.",
        outcome: "Grounded entitlement checks and guided triage before a job is created, deflecting non-fault cases and setting correct cost expectations before the customer travels.",
        channels: ["WhatsApp", "Voice", "App chat"],
        systems: ["Warranty and device registration records", "Product knowledge base", "Service job creation", "Case management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national customer-care helpline covering mobile devices and home appliances",
        "The Samsung Members app providing support, diagnostics and service booking for device owners",
        "A network of authorised service centres plus doorstep repair and device pickup services",
        "SMS and app notifications of service job creation and completion",
      ],
      gaps: [
        "Repair status must be requested rather than being pushed at each stage",
        "Doorstep and pickup slots cannot be rescheduled without a human interaction",
        "No pre-repair triage that deflects software-resolvable or out-of-warranty cases",
        "Regional-language voice quality depends on outsourced agent staffing rather than a governed capability",
      ],
    },
    risks: [
      "Device repair involves customer data on the device; any conversational flow touching data backup or device state must be handled with explicit consent and clear boundaries under DPDP",
      "Global Samsung platform and vendor governance may constrain what the India service organisation can procure independently",
      "TRAI DND rules apply to proactive service and offer outreach to the very large installed base",
    ],
    economics: {
      volumeMonthly: 4000000,
      costPerInteraction: 1.0,
      automationRate: 0.65,
      basis: "Seller assumptions from installed-base scale across mobile and appliance categories with high service-contact frequency on mobile; an order-of-magnitude estimate requiring validation against Samsung India's actual service contact-centre volumes.",
    },
    pilotScope:
      "A 10-week pilot on repair status and service-job tracking for mobile repairs across two states in Hindi, Tamil and English, integrated with the service job-tracking system.",
    expansion: [
      "Add doorstep-service and pickup scheduling with live technician and logistics availability",
      "Extend to warranty entitlement checks and pre-repair triage",
      "Scale nationally across appliance categories with full regional-language coverage",
    ],
    stakeholders: [
      "Head of Customer Service, Samsung India",
      "Head of Service Network Operations",
      "Head of Customer Experience / Quality",
      "Chief Information Officer / Head of IT, Samsung India",
      "Head of Procurement / Vendor Management for contact-centre services",
    ],
    discovery: [
      "Which outsourcer holds the India service-desk contract today, and when is it up for renewal?",
      "What share of your service contacts are repeat status enquiries on jobs already open?",
      "What is your no-show rate on doorstep and pickup slots, and what does each cost?",
      "How many service-centre visits turn out to be non-faults or out-of-warranty surprises?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Samsung phone owner in Chennai gets Tamil repair-stage updates pushed to WhatsApp and reschedules the doorstep return without calling.",
  },

  "godrej-enterprises": {
    operatingContext:
      "Godrej & Boyce, the flagship of the Godrej Enterprises Group following the family's separation of business interests, spans a diverse industrial and consumer portfolio: home appliances, Interio furniture and interiors for both homes and offices, security solutions including locks and safes, aerospace and process equipment, and material-handling. Its consumer-facing businesses generate installation-dependent conversations — appliance delivery and installation, furniture delivery and assembly, office-interiors project coordination — alongside warranty service across a long-lived installed base built on decades of brand trust. Service is delivered through a mix of company technicians and authorised partners. Customers reach the group through business-specific helplines, brand websites, dealer and retail channels, and Interio experience stores.",
    strategicPressure: [
      { text: "The separation of the Godrej family's business interests left Godrej Enterprises with the appliances, Interio, security and industrial portfolio, sharpening focus on those consumer businesses.", kind: "verified" },
      { text: "Godrej Interio's furniture and office-interiors business requires delivery scheduling and assembly visits, which is structurally the most contact-intensive post-purchase journey in the portfolio.", kind: "verified" },
      { text: "Multiple consumer businesses operating separate service and helpline routes means a customer who owns a Godrej refrigerator, a Godrej lock and Godrej furniture faces three different service experiences.", kind: "inference" },
      { text: "Consolidating service operations across appliances and Interio would probably reveal significant shared-cost opportunity, but the businesses may be organisationally siloed enough to resist it.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Godrej & Boyce is a manufacturing conglomerate whose technology investment goes into products, plants and industrial systems. Its consumer businesses run procured service-management and ERP platforms, and there is no engineering organisation building conversational infrastructure.",
    whyNotBuild:
      "The value proposition is consolidating fragmented service conversations across several businesses onto one governed layer with regional-language coverage. That is an integration and operations problem. Building it would require a shared engineering function that does not exist in a group organised around manufacturing business units.",
    workflows: [
      {
        name: "Furniture and appliance delivery-plus-installation scheduling",
        friction: "A furniture or large-appliance purchase requires a delivery slot and an assembly or installation visit, coordinated by phone across the store, a logistics team and a technician, with the customer chasing at every step.",
        outcome: "One thread that schedules delivery, confirms installation or assembly, and re-books on slippage, collapsing the group's most contact-intensive journey.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Order management", "Logistics and delivery scheduling", "Technician/assembly dispatch", "Store and dealer records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Warranty service intake across appliances and security products",
        friction: "Service requests for appliances, locks and safes arrive at business-specific helplines; a customer must know which business to call, and each has its own language coverage and hours.",
        outcome: "A single intake point that identifies the product and routes to the right service organisation with entitlement checked, giving the group a unified view of service demand for the first time.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management systems (per business)", "Warranty and product registration", "Technician dispatch", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Office-interiors project coordination for B2B customers",
        friction: "Corporate interiors projects involve site measurement, delivery phasing and installation crews coordinated by a project manager over email and phone; the client facility team has no self-service visibility into schedule or status.",
        outcome: "Client-facing status and scheduling in one channel with exceptions escalated to the project manager, reducing coordination load on a scarce and expensive resource.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Project management system", "Delivery and installation scheduling", "Order management", "Client CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Business-specific consumer helplines for appliances, Interio and security products",
        "Brand websites with service-request raising and product registration",
        "Godrej Interio experience stores and dealer networks serving customers in person",
        "A field-service organisation combining company technicians and authorised partners",
      ],
      gaps: [
        "Customers must know which Godrej business to contact for their product",
        "Delivery and assembly coordination requires the customer to chase multiple parties",
        "No single group-level view of service demand or customer relationships",
        "Regional-language coverage varies by business unit rather than being a group capability",
      ],
    },
    risks: [
      "Business-unit organisational boundaries may make a shared deployment politically harder than it is technically — the sponsoring entity must be established early",
      "DPDP obligations on customer data flowing between business units and to third-party installation and logistics partners",
      "TRAI DND rules apply to service and warranty outreach across the installed base",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions aggregating appliance, furniture and security service volumes; the per-business split must be established in discovery, as it determines which unit sponsors the pilot.",
    },
    pilotScope:
      "A 10-week pilot on Godrej Interio furniture delivery and assembly scheduling in two metros in Hindi, Marathi and English, integrated with logistics and assembly dispatch.",
    expansion: [
      "Extend to appliance delivery and installation scheduling on the same layer",
      "Add unified warranty service intake with routing across appliances and security products",
      "Introduce B2B office-interiors project status for corporate clients",
    ],
    stakeholders: [
      "Business Head, Godrej Interio",
      "Business Head, Godrej Appliances",
      "Head of Customer Service / Service Operations",
      "Chief Information Officer, Godrej & Boyce",
      "Head of Supply Chain and Logistics",
    ],
    discovery: [
      "Are service operations unified across appliances and Interio, or does each run its own helpline and dispatch?",
      "How many customer contacts does a furniture order generate from purchase to completed assembly?",
      "Which business unit would sponsor and fund a shared conversational layer?",
      "Do you have a single view of a customer who owns products from several Godrej businesses?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Godrej Interio customer in Mumbai re-books an assembly visit in Marathi after the crew slips, in the same thread that tracked the delivery.",
  },

  "pidilite-industries": {
    operatingContext:
      "Pidilite Industries is India's dominant adhesives and construction-chemicals company, best known for Fevicol in woodworking adhesives and Dr. Fixit in waterproofing, alongside a broad portfolio of sealants, art materials and industrial products. Its route to market is unusual: demand is created not by the end consumer but by influencers — carpenters, contractors, painters, plumbers and masons — who specify which product is used on a job, and who are cultivated through loyalty programmes, training and technical support. It also runs consumer-facing waterproofing service propositions where a homeowner requests a site assessment. Its channel reaches through a very large distributor and retailer network. Contact today runs through field sales and technical service officers, influencer loyalty programme channels, and consumer helplines.",
    strategicPressure: [
      { text: "Pidilite's demand is created by influencers — carpenters, contractors and applicators — rather than by end consumers, making influencer engagement the company's core commercial mechanism.", kind: "verified" },
      { text: "Dr. Fixit waterproofing sells partly as a service proposition requiring a site assessment, which brings a scheduling and technical-consultation workflow into a chemicals company.", kind: "verified" },
      { text: "Influencer loyalty engagement currently depends on field officers physically visiting, which caps the number of carpenters and contractors any officer can meaningfully serve.", kind: "inference" },
      { text: "Technical product questions — which adhesive for which substrate, waterproofing specification for a given problem — probably reach the company only through field technical staff, leaving most applicators unserved.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Pidilite is a specialty-chemicals and brand company whose R&D investment goes into formulation. Its technology function runs ERP, distribution and loyalty platforms; there is no engineering organisation that would build conversational infrastructure.",
    whyNotBuild:
      "The opportunity is scaling influencer engagement beyond the physical reach of a field force, in vernacular voice, for an audience that is voice-first and often not comfortable with apps. That capability is bought. Building it would require speech engineering for exactly the accents and code-switching that are hardest, with no chemistry return.",
    workflows: [
      {
        name: "Influencer loyalty and rewards engagement",
        friction: "A carpenter or contractor with a question about points, scheme eligibility or redemption must wait for a field officer visit or navigate an app he may not use, so programme engagement decays between visits.",
        outcome: "Always-available vernacular voice and WhatsApp servicing for the influencer network, multiplying engaged influencers without adding field headcount — directly amplifying the company's demand-creation mechanism.",
        channels: ["Voice", "WhatsApp", "IVR"],
        systems: ["Influencer loyalty platform", "Rewards and redemption system", "Field-force CRM", "Product knowledge base"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Technical product-selection and application support",
        friction: "Applicators facing a specific substrate, weather condition or failure mode need technical guidance; today that means finding a technical service officer, so most jobs proceed on guesswork or a competitor's advice.",
        outcome: "Grounded technical guidance in the applicator's language at the moment of the job, reducing application failures and defending specification against competitors.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Technical documentation and application knowledge base", "Product catalogue", "Complaint/failure case records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Waterproofing enquiry and site-assessment scheduling",
        friction: "A homeowner with a leak enquires about waterproofing services and waits for a call-back; a site assessment is then scheduled manually with an applicator or technical officer, and many enquiries lapse in between.",
        outcome: "Immediate qualification and a booked site assessment with the right applicator, converting an enquiry stream that currently leaks to local contractors.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Service enquiry/lead CRM", "Applicator network directory and scheduling", "Technical knowledge base"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Influencer loyalty programmes for carpenters, contractors and applicators with points and rewards",
        "Field sales and technical service officers providing in-person support to the channel",
        "Consumer helpline and brand websites for product and service enquiries",
        "A large distributor and retailer network serving as the physical route to market",
      ],
      gaps: [
        "Influencers have no answer route between field-officer visits",
        "Technical application guidance is unavailable at the moment of the job",
        "Waterproofing service enquiries depend on a call-back that often does not convert",
        "No systematic capture of application failures reported by influencers in the field",
      ],
    },
    risks: [
      "TRAI DND rules apply to influencer loyalty and scheme outreach, which targets personal mobile numbers in a heavily DND-registered population",
      "Technical application guidance carries product-liability implications; the agent must answer only from approved technical documentation and escalate anything outside it",
      "DPDP obligations on influencer personal data collected through the loyalty programme",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions from influencer programme enrolment scale and technical query frequency; the enrolled influencer base is the key figure to validate, as it drives the entire volume case.",
    },
    pilotScope:
      "An 8-week pilot on influencer loyalty servicing plus basic technical guidance for the carpenter network in two states, in Hindi and Marathi, grounded in the loyalty platform and technical documentation.",
    expansion: [
      "Extend technical application support across the Dr. Fixit waterproofing range",
      "Add waterproofing enquiry qualification and site-assessment scheduling",
      "Scale nationally across Tamil, Telugu and Bengali for the full influencer network",
    ],
    stakeholders: [
      "Chief Executive Officer / Business Head, Consumer and Bazaar Products",
      "Head of Marketing and Influencer Engagement",
      "Head of Technical Services",
      "Chief Information Officer",
      "Head of Sales and Channel Management",
    ],
    discovery: [
      "How many carpenters and contractors are enrolled in your loyalty programmes, and how many interact in a given month?",
      "How does an applicator get a technical answer today when a field officer is not present?",
      "What proportion of waterproofing service enquiries convert to a booked site assessment?",
      "How much field technical-officer time goes to routine questions rather than specification work?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A carpenter in Nagpur asks in Marathi which adhesive suits a laminate job and checks his loyalty points in the same call.",
  },

  "amul-gcmmf": {
    operatingContext:
      "Amul is the brand of the Gujarat Cooperative Milk Marketing Federation, a farmer-owned cooperative federation that markets milk, butter, cheese, ice cream and a wide packaged-dairy portfolio produced by member district unions across Gujarat and sold nationally through an extensive distributor and retailer network. Its structure is distinctive: procurement and processing sit with member unions and village societies, while GCMMF handles marketing and distribution, so communication responsibilities are split across cooperative layers. Its communication load spans distributors and retailers seeking stock, order and scheme support, franchise applicants and existing Amul parlour operators, and consumers raising product complaints. Contact today runs through distributor sales channels, a consumer helpline, franchise enquiry routes and regional offices.",
    strategicPressure: [
      { text: "Amul's federated cooperative structure splits responsibilities between GCMMF and member district unions, so no single entity owns the end-to-end customer or trade conversation.", kind: "verified" },
      { text: "The Amul parlour franchise model generates a continuous stream of new franchise enquiries and operating-partner support needs across the country.", kind: "verified" },
      { text: "Cold-chain dairy distribution creates time-critical trade conversations — stock, replenishment, damaged consignments — where a delayed answer means product loss.", kind: "inference" },
      { text: "Franchise enquiry handling is probably manual and slow relative to the volume of interest the brand attracts, so a share of prospective franchisees is lost to inattention.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. GCMMF is a marketing and distribution federation owned by farmer cooperatives; its investment goes into procurement infrastructure, processing capacity and brand. It has no software-engineering organisation and its governance structure makes any large discretionary technology build unlikely.",
    whyNotBuild:
      "A cooperative federation answerable to farmer members will not fund speculative technology capability. It will fund something that demonstrably reduces trade friction or captures franchise revenue, delivered as a service with clear cost. That framing — not a platform framing — is what makes this account addressable.",
    workflows: [
      {
        name: "Distributor and retailer trade support",
        friction: "Distributors and retailers call sales officers about order status, stock availability, scheme entitlement and damaged-consignment claims; answers depend on reaching a person during working hours, and cold-chain products do not wait.",
        outcome: "Immediate ERP-grounded answers on orders, availability and schemes in Gujarati, Hindi and regional languages, protecting a distribution chain where delay equals spoilage.",
        channels: ["WhatsApp", "Voice"],
        systems: ["ERP / distribution management", "Depot and plant stock", "Trade scheme and claims systems", "Logistics tracking"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Franchise enquiry qualification and parlour-partner support",
        friction: "Franchise enquiries arrive continuously from across the country into a manual process; prospects wait for a call-back, and existing parlour operators have no quick route for stock, scheme and operational questions.",
        outcome: "Enquiries qualified immediately against franchise criteria and routed to the right regional team, while existing operators self-serve routine questions — converting brand pull into franchise revenue.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Franchise enquiry CRM", "Regional office allocation", "Parlour operating knowledge base", "Distributor ordering"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Consumer product complaint capture and routing",
        friction: "Consumer complaints about a product batch or quality issue reach a helpline and then must be routed to the right member union or plant; the chain is slow and the federation lacks a consolidated quality signal.",
        outcome: "Structured complaint capture with batch details, routed automatically to the responsible union or plant, giving the federation a real-time quality signal it currently assembles slowly.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Complaint/case management", "Batch and plant traceability", "Member-union routing", "Quality reporting"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline and email route for product complaints and enquiries",
        "Distributor and retailer sales officers providing trade support in person and by phone",
        "A franchise enquiry route for prospective Amul parlour operators",
        "Regional offices coordinating distribution and trade relationships across states",
      ],
      gaps: [
        "Trade partners cannot self-serve order, stock or scheme status outside working hours",
        "Franchise enquiries wait on manual qualification and call-backs",
        "Consumer complaints route slowly between the federation and member unions",
        "No consolidated view of trade or consumer issues across the cooperative structure",
      ],
    },
    risks: [
      "Cooperative governance means decision rights are split between GCMMF and member unions; the contracting entity and scope boundary must be established before proposal",
      "Food-safety-related consumer complaints carry regulatory implications and must be captured, routed and retained with full auditability",
      "TRAI DND rules apply to trade and franchise outreach on personal mobile numbers",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions combining trade-partner query volume, franchise enquiry flow and consumer complaints; validate whether GCMMF or member unions own each contact stream before modelling.",
    },
    pilotScope:
      "An 8-week pilot on distributor and retailer trade support across Gujarat and one neighbouring state in Gujarati and Hindi, grounded in the distribution ERP.",
    expansion: [
      "Add franchise enquiry qualification and parlour-partner operational support nationally",
      "Extend to consumer complaint capture with batch traceability and union routing",
      "Scale to Marathi, Bengali and southern languages across the national distribution network",
    ],
    stakeholders: [
      "Managing Director, GCMMF",
      "Head of Sales and Distribution",
      "Head of Marketing / Brand",
      "Head of Franchise and Retail Business (Amul parlours)",
      "Head of IT / Systems, GCMMF",
    ],
    discovery: [
      "Does GCMMF or the member unions own consumer complaint handling, and where do complaints land today?",
      "How many franchise enquiries do you receive a month, and what proportion are actually contacted?",
      "How do distributors check order and stock status outside a sales officer's visit?",
      "What does a delayed answer on a cold-chain consignment cost you in product loss?",
    ],
    flowTemplate: "dealer-support",
    scenario: "An Amul distributor in Rajkot checks consignment status and scheme entitlement in Gujarati at 6am before the day's deliveries.",
  },

  "mother-dairy": {
    operatingContext:
      "Mother Dairy Fruit & Vegetable, owned by the National Dairy Development Board, sells packaged milk and dairy products, the Safal range of fruit and vegetables and frozen products, and Dhara edible oils, with an operating heartland in Delhi NCR built around a distinctive infrastructure: milk booths dispensing token milk, Safal retail outlets, and a franchise network operating both. Its customer conversations therefore include booth and outlet franchisees needing supply, settlement and operational support, as well as consumers raising quality complaints about a perishable product delivered daily. Its geography is concentrated enough that a single Hindi-first deployment covers most of the base. Contact today runs through franchise field officers, a consumer helpline, and regional distribution offices.",
    strategicPressure: [
      { text: "Mother Dairy's booth and outlet network is operated substantially by franchisees, which makes franchise-partner support a core operational function rather than a peripheral one.", kind: "verified" },
      { text: "Its Delhi NCR concentration means a single Hindi-first deployment reaches the large majority of both franchisees and consumers.", kind: "verified" },
      { text: "Daily perishable supply means a franchisee's supply or settlement problem is time-critical — an unresolved issue today is lost sales and spoiled stock, not a deferred inconvenience.", kind: "inference" },
      { text: "Franchisee queries probably reach field officers by phone with no system-grounded answer, so supply disputes are resolved by memory and negotiation rather than by data.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Mother Dairy is an NDDB-owned operations company focused on procurement, processing and distribution. It has no software organisation, and its capital priorities are cold-chain and processing infrastructure.",
    whyNotBuild:
      "This is an organisation that would buy a working capability and would not entertain building one. The relevant argument is operational: franchisees get answers in Hindi at 5am when the delivery arrives, which no field-officer model can provide, and which requires nothing internal beyond an integration.",
    workflows: [
      {
        name: "Booth and outlet franchisee supply and settlement support",
        friction: "A franchisee with a short delivery, a settlement discrepancy or a supply query calls a field officer; if unreachable, the issue waits, and the day's sales are affected by a problem that a system already has the answer to.",
        outcome: "System-grounded answers on deliveries, settlements and supply schedules in Hindi at any hour, resolving time-critical franchisee issues before they cost a day's trade.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Distribution and delivery management", "Franchisee settlement/accounting", "Route and supply scheduling", "Partner CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Consumer quality complaint capture and routing",
        friction: "A consumer with a quality complaint about milk or a Safal product calls a helpline; batch and outlet details are captured inconsistently, and routing to the responsible plant or route takes days.",
        outcome: "Structured complaint capture with batch, booth and route detail, routed immediately to the responsible operation, giving the company a same-day quality signal on a perishable product.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Complaint/case management", "Batch and plant traceability", "Route and booth master data", "Quality reporting"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Franchise enquiry and new-booth onboarding support",
        friction: "Prospective booth and Safal outlet franchisees enquire and then wait on a manual process of eligibility checks, documentation and site assessment, with many dropping out through the delay.",
        outcome: "Enquiries qualified immediately, documentation chased conversationally and site assessment scheduled, converting more interest into operating outlets.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Franchise enquiry CRM", "Eligibility and documentation checklist", "Regional office allocation", "Site assessment scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for product quality complaints and enquiries",
        "Field officers supporting booth and outlet franchisees across the distribution network",
        "A franchise enquiry route for prospective booth and Safal outlet operators",
        "Daily route-based distribution to booths and outlets with delivery documentation",
      ],
      gaps: [
        "Franchisees have no system-grounded answer route outside a field officer's availability",
        "Quality complaints are captured inconsistently and routed slowly relative to product shelf life",
        "Franchise onboarding depends on a manual documentation chase that loses applicants",
        "No consolidated near-real-time view of franchisee or consumer issues by route",
      ],
    },
    risks: [
      "Food-safety complaints carry regulatory implications; capture, routing and retention must be auditable and complete",
      "TRAI DND rules apply to franchisee and consumer outreach on personal mobile numbers",
      "Settlement and financial data shared with franchisees requires strict per-partner entitlement isolation",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 0.9,
      automationRate: 0.55,
      basis: "Seller assumptions from booth and outlet count plus consumer complaint volume in the NCR heartland; validate the split between franchisee and consumer contact, which is likely weighted toward franchisees.",
    },
    pilotScope:
      "An 8-week pilot on booth and outlet franchisee supply and settlement support across Delhi NCR in Hindi, grounded in distribution and settlement systems.",
    expansion: [
      "Add consumer quality complaint capture with batch and route traceability",
      "Extend to franchise enquiry qualification and onboarding documentation chase",
      "Scale to other operating regions beyond NCR as the network expands",
    ],
    stakeholders: [
      "Managing Director, Mother Dairy Fruit & Vegetable",
      "Head of Dairy Business / Sales and Distribution",
      "Head of Franchise and Retail Operations",
      "Head of Quality Assurance",
      "Head of IT / Systems",
    ],
    discovery: [
      "How many booth and outlet franchisees do you support, and how do they raise issues today?",
      "What proportion of your contact volume is franchisees versus end consumers?",
      "How quickly does a milk quality complaint reach the responsible plant and route today?",
      "How many franchise applicants drop out during documentation and site assessment?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A milk booth franchisee in Ghaziabad reports a short delivery in Hindi at 5am and gets a settlement adjustment confirmed before opening.",
  },

  "kent-ro-systems": {
    operatingContext:
      "Kent RO Systems sells water purifiers, along with air purifiers, water softeners and small appliances, primarily through direct-selling and dealer channels backed by a franchised service network. Its economics are structurally recurring: a purifier requires periodic filter and membrane replacement, and the company's profitability depends heavily on annual maintenance contracts and service-due visits rather than on the initial hardware sale. That makes proactive service-due outreach a revenue operation, not a courtesy. Its customer base spans metros and smaller cities, with service delivered by franchised technicians who also carry the commercial relationship at the point of service. Customers reach the company through a service helpline, brand website, technicians and dealers.",
    strategicPressure: [
      { text: "Water-purifier economics depend on recurring filter and membrane replacement, making service-due outreach the primary revenue mechanism after the initial sale.", kind: "verified" },
      { text: "Service is delivered by franchised technicians who often also handle the AMC and consumables sale, so the company's recurring revenue depends on a partner network's diligence.", kind: "inference" },
      { text: "A missed service-due contact is direct lost revenue and a step toward the customer switching to a local service provider for filters entirely.", kind: "inference" },
      { text: "Service-due outreach is probably executed by a mix of technician initiative and limited outbound calling, meaning coverage of the eligible base is well below 100%.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Kent is a promoter-led appliance company with a franchised service network. Its technology function runs service-management and ERP systems; there is no engineering organisation building conversational infrastructure.",
    whyNotBuild:
      "The value is straightforward: contact every customer whose filter is due, in their language, and convert. That requires outreach capacity and integration, not proprietary software. A build would add fixed engineering cost to a business whose entire model is recurring per-customer service revenue at modest ticket sizes.",
    workflows: [
      {
        name: "Filter-replacement due and AMC renewal outreach",
        friction: "Service-due customers are contacted inconsistently — some by technicians who remember, some by limited outbound calling — so a substantial share of the base lapses and starts buying filters from local providers.",
        outcome: "Complete coverage of the service-due and AMC-expiring base with visits booked in-conversation, converting the company's core recurring revenue mechanism from ad hoc to systematic.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Service and AMC administration", "Product registration and service history", "Franchised technician dispatch", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Service-request intake and technician visit scheduling",
        friction: "A customer with a malfunctioning purifier calls the helpline, is promised a technician call-back, and then chases; the technician's schedule is invisible to both the customer and the agent.",
        outcome: "Requests logged with a committed visit window from technician scheduling and proactive status, removing the chase cycle from routine service.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management system", "Franchised technician scheduling", "Warranty and AMC entitlement", "Spare-parts availability"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-service verification and consumables authenticity check",
        friction: "The company cannot easily verify whether a technician actually replaced the filter with a genuine part, and customers have no route to confirm what was fitted, which creates both revenue leakage and trust risk.",
        outcome: "Post-visit verification conversations that confirm what was done and capture dissatisfaction independently, protecting genuine-consumable revenue and giving visibility into franchise-technician quality.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Service job records", "Consumables/parts serialisation", "Case management", "Franchise partner scorecards"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A service helpline for purifier service requests and complaints",
        "A brand website with service-request raising and product registration",
        "A franchised technician network delivering installation, service and consumables",
        "SMS-based service-due reminders to registered customers",
      ],
      gaps: [
        "Service-due outreach coverage is well below the eligible base",
        "No committed technician visit window is given at intake",
        "The company cannot verify independently what a technician did at a visit",
        "Regional-language outreach depends on whoever is calling that week",
      ],
    },
    risks: [
      "TRAI DND rules bind service-due and AMC outreach, which is the core revenue workflow and predominantly outbound",
      "DPDP obligations on customer address and contact data shared with franchised technicians as independent operators",
      "Statements about AMC entitlement or consumable pricing must come from the administration system, since franchise technicians may quote differently in the field",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.0,
      automationRate: 0.6,
      basis: "Seller assumptions from installed-base scale and the recurring service cadence a purifier requires; validate the registered contactable base and current outreach coverage, which is the key value driver.",
    },
    pilotScope:
      "An 8-week pilot on filter-replacement due and AMC renewal outreach for one northern region in Hindi and English, with visits booked into technician scheduling.",
    expansion: [
      "Add service-request intake with committed technician visit windows",
      "Extend to post-service verification and franchise-technician quality scoring",
      "Scale nationally with Tamil, Bengali and Marathi coverage",
    ],
    stakeholders: [
      "Managing Director / Promoter, Kent RO Systems",
      "Head of Service Operations",
      "Head of Sales and Franchise Network",
      "Chief Financial Officer",
      "Head of IT / Systems",
    ],
    discovery: [
      "What proportion of your service-due base is actually contacted before the filter is overdue?",
      "What is your AMC attach and renewal rate, and who is responsible for selling it?",
      "How do you verify that a franchise technician fitted a genuine consumable?",
      "How much of your recurring revenue do you estimate leaks to local service providers?",
    ],
    flowTemplate: "retention",
    scenario: "A Kent purifier owner in Lucknow gets a Hindi filter-due call, books a technician slot, and renews the AMC in the same conversation.",
  },

  "eureka-forbes": {
    operatingContext:
      "Eureka Forbes, now controlled by private-equity owner Advent International after its separation from the Shapoorji Pallonji group, sells Aquaguard water purifiers, vacuum cleaners and air purifiers through a model historically built on direct selling — in-home demonstrations by a large field sales force — and now increasingly through retail and digital channels as well. Its defining asset is a very large installed base with a service relationship: annual maintenance contracts, filter and consumable replacement, and service visits delivered by an extensive owned and franchised service technician network. That makes the business fundamentally outbound-communication-driven: AMC renewals, service-due reminders and demonstration lead follow-up are the operating rhythm. Customers reach it through a service helpline, brand app and website, technicians and direct-sales representatives.",
    strategicPressure: [
      { text: "Eureka Forbes built its business on direct selling with in-home demonstrations, which makes lead follow-up and appointment conversion a core commercial process rather than a marketing function.", kind: "verified" },
      { text: "Under private-equity ownership the company has been professionalising operations and cost structure, which puts field and calling costs under explicit scrutiny.", kind: "verified" },
      { text: "Its recurring revenue from AMC and consumables on a very large installed base is the most defensible part of the business, and its capture is entirely dependent on outreach coverage.", kind: "inference" },
      { text: "The traditional direct-selling field force is expensive per lead worked, so shifting qualification and reminder work to a conversational layer could reallocate that force to closing.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Eureka Forbes is a consumer-durables and services company; its technology function runs service-management, field-force and CRM platforms. There is no engineering organisation building conversational infrastructure, and a private-equity-owned business focused on margin will favour a bought capability with visible cost per contact.",
    whyNotBuild:
      "A PE-owned business optimising toward an exit will not fund multi-year platform engineering with uncertain payback. It will fund something that visibly replaces calling cost this year. The direct comparison is against tele-calling headcount, which makes cost per contact the entire argument and an internal build the wrong answer commercially.",
    workflows: [
      {
        name: "AMC renewal and service-due outreach",
        friction: "AMC renewals and service-due reminders are worked by calling teams and technicians with capacity-limited reach; a large part of the installed base lapses without a conversation, and lapsed customers switch to local service providers.",
        outcome: "Full-coverage multilingual renewal and service-due outreach with visits booked and payment taken in-channel, protecting the most defensible revenue in the business.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["AMC administration", "Service history and product registration", "Technician scheduling", "Payment gateway"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Demonstration lead qualification and appointment booking",
        friction: "Leads from digital campaigns, retail and referrals are worked by the direct-sales force, whose time is expensive; unqualified leads consume field visits and genuinely interested prospects wait days for contact.",
        outcome: "Leads engaged in minutes and qualified conversationally, with only genuine prospects converted into booked in-home demonstrations, materially raising field-force productivity.",
        channels: ["WhatsApp", "Voice", "Web"],
        systems: ["Lead CRM", "Field-sales scheduling", "Product knowledge base", "Territory allocation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Service-request intake and technician visit scheduling",
        friction: "Service requests arrive at a helpline and are assigned to technicians whose availability is not visible to the customer; visit windows are vague and customers chase repeatedly.",
        outcome: "Requests logged with a committed window from live technician scheduling and proactive status, cutting the repeat-contact tail that dominates service volume.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management", "Technician scheduling and dispatch", "AMC entitlement", "Spare-parts availability"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A service helpline covering AMC, service requests and product enquiries",
        "A brand app and website for service booking and product registration",
        "A large owned and franchised service-technician network across the country",
        "A direct-sales field force conducting in-home demonstrations and closing sales",
      ],
      gaps: [
        "AMC renewal coverage is capped by calling capacity rather than by base size",
        "Expensive field-sales time is spent on leads that were never qualified",
        "Technician visit windows are not committed at the point of request",
        "Regional-language outreach quality varies with calling-team composition",
      ],
    },
    risks: [
      "TRAI DND and registered-header rules bind AMC renewal and lead-follow-up outreach, which together constitute the core of the opportunity",
      "DPDP obligations on customer address and service data shared with franchised technicians",
      "Direct-selling regulations govern how sales pitches may be made remotely; the boundary between service outreach and solicitation must be explicit",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 1.1,
      automationRate: 0.6,
      basis: "Seller assumptions from installed-base scale, AMC cadence and lead flow; validate the renewal-book size and current calling cost structure, which is the direct comparison for the business case.",
    },
    pilotScope:
      "A 10-week pilot on AMC renewal and service-due outreach for one region's expiring book in Hindi, Marathi and English, with visits booked and payment taken in-channel.",
    expansion: [
      "Add demonstration lead qualification and in-home appointment booking",
      "Extend to service-request intake with committed technician windows",
      "Scale nationally across Tamil and Bengali with field-force productivity reporting",
    ],
    stakeholders: [
      "Chief Executive Officer, Eureka Forbes",
      "Head of Service Business / AMC",
      "Head of Direct Sales and Field Operations",
      "Chief Financial Officer",
      "Chief Information Officer / Head of Digital",
    ],
    discovery: [
      "How large is your renewal book, and what proportion is actually contacted before expiry?",
      "What does your renewal calling function cost fully loaded, and how many agents does it employ?",
      "How much direct-sales field time is spent on leads that were never going to convert?",
      "What is your AMC lapse-to-recovery rate once a customer has gone a cycle without service?",
    ],
    flowTemplate: "retention",
    scenario: "An Aquaguard customer in Pune whose AMC expires next month is reached in Marathi, renews in-channel, and books the service visit immediately.",
  },

  "v-guard-industries": {
    operatingContext:
      "V-Guard Industries manufactures and sells voltage stabilisers, water heaters, inverters and batteries, pumps and motors, fans, kitchen appliances and electrical wiring, with a heritage base in Kerala and the southern states and a deliberate expansion into northern and western India that now contributes a growing share of revenue. Its products reach consumers through electrical retailers and dealers, with electricians and plumbers influencing purchase, and its after-sales is delivered through authorised service centres and franchised technicians. The customer mix therefore spans Malayalam- and Tamil-speaking southern heartland customers and Hindi-speaking newer markets, with a product mix that includes both installation-dependent items and rural pump customers. Contact runs through a service helpline, brand website, dealers and service partners.",
    strategicPressure: [
      { text: "V-Guard's deliberate expansion from its southern heartland into northern and western markets requires it to serve customers in Hindi and other languages its service organisation was not originally built for.", kind: "verified" },
      { text: "Its product range spans installation-dependent items like water heaters and inverters as well as rural pumps, so the service load is unusually varied for a company of its size.", kind: "verified" },
      { text: "Growth into new geographies outpaces service-network density, so customers in newer markets experience longer response times than the brand's southern reputation implies.", kind: "inference" },
      { text: "Service intake is probably centralised on a helpline while delivery is franchised, meaning the company has weak visibility into whether requests are actually resolved.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. V-Guard is a distribution-led electricals manufacturer whose technology function runs ERP, distribution and service-management platforms. There is no engineering organisation, and its investment priorities are manufacturing capacity and northern-market distribution.",
    whyNotBuild:
      "The requirement is multilingual service intake spanning Malayalam, Tamil and Hindi across an expanding geography, integrated with a franchised service network. Buying it lets the company serve new markets in their language from day one; building it would mean the expansion outruns the capability by years.",
    workflows: [
      {
        name: "Warranty and service-request intake across languages",
        friction: "Service requests from newly entered northern markets reach a helpline whose language strengths are southern, while southern customers expect Malayalam and Tamil; neither group is consistently served well.",
        outcome: "Consistent multilingual intake with entitlement checked and a service partner assigned, giving customers in every market the service experience the brand's reputation promises.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management system", "Authorised service-centre dispatch", "Warranty and product registration", "Spare-parts availability"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Installation scheduling for water heaters, inverters and pumps",
        friction: "Installation-dependent products require a technician visit arranged after purchase; the customer coordinates with a dealer or service centre by phone and receives no committed window.",
        outcome: "Installation booked with a committed window at the point of request and confirmed proactively, removing the post-purchase gap where dissatisfaction begins.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management", "Technician/service-centre scheduling", "Dealer sale records", "Product registration"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Electrician and dealer channel support",
        friction: "Electricians and dealers ask about product specification, scheme entitlement and stock, and depend on field officers whose coverage is thinnest in exactly the new markets the company is trying to win.",
        outcome: "Immediate vernacular answers on specification, schemes and availability across old and new markets, extending channel engagement beyond field-officer reach.",
        channels: ["WhatsApp", "Voice", "IVR"],
        systems: ["Channel scheme and loyalty platform", "ERP / distribution", "Product knowledge base", "Field-force CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A service helpline for warranty, installation and complaint intake",
        "A brand website and app for service-request raising and product registration",
        "An authorised service-centre and franchised technician network",
        "Channel schemes and field sales officers serving electricians and dealers",
      ],
      gaps: [
        "Language coverage does not match a customer base split across southern and northern markets",
        "Installation requests receive no committed window at intake",
        "The company has limited visibility into whether franchised service partners resolved a request",
        "Channel partners in newer markets have thin field-officer coverage and no alternative answer route",
      ],
    },
    risks: [
      "TRAI DND rules apply to service and channel outreach on personal mobile numbers",
      "DPDP obligations on customer data shared with authorised service centres as independent businesses",
      "Warranty entitlement statements must come from the registration system; incorrect in-conversation entitlement creates direct service cost",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions from installed-base scale across the product range with a south-weighted mix; validate the geographic and language split of service contact, which drives the deployment design.",
    },
    pilotScope:
      "An 8-week pilot on warranty and service-request intake across Kerala and Tamil Nadu in Malayalam, Tamil and English, with partner assignment and outcome tracking.",
    expansion: [
      "Add installation scheduling with committed windows for water heaters, inverters and pumps",
      "Extend the same layer into northern markets in Hindi as expansion continues",
      "Add electrician and dealer channel support across old and new geographies",
    ],
    stakeholders: [
      "Managing Director, V-Guard Industries",
      "Head of Customer Service and Service Network",
      "Head of Sales, North and West (expansion markets)",
      "Chief Information Officer",
      "Head of Marketing and Channel Engagement",
    ],
    discovery: [
      "How does your service response time in northern markets compare with Kerala and Tamil Nadu?",
      "Is service intake centralised, and do you know your resolution rate once a request goes to a franchised partner?",
      "In which languages can you reliably answer a service call today?",
      "How thin is field-officer coverage in your newer markets, and what does that cost you in channel engagement?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A V-Guard water-heater customer in Kochi logs an installation request in Malayalam and receives a committed technician window the same day.",
  },

  "daikin-india": {
    operatingContext:
      "Daikin Airconditioning India, the India subsidiary of Japan's Daikin Industries, manufactures locally at plants in Rajasthan and sells room air conditioners and commercial VRV/VRF systems through a dealer and system-integrator network, having grown into one of the leading brands in the Indian air-conditioning market. Its business spans a consumer side with the category's severe summer seasonality in installation and breakdown demand, and a commercial side where VRV systems in offices, hotels and retail carry maintenance contracts and SLA-bound service expectations. Installation and service are delivered largely through dealer and service-partner technicians rather than owned staff. Customers reach the company through a consumer helpline, brand website and app, dealers, and service partners.",
    strategicPressure: [
      { text: "Daikin has invested in local Indian manufacturing rather than importing, signalling a long-term commitment that raises expectations on local service capability.", kind: "verified" },
      { text: "The room air-conditioner business carries the category's extreme summer concentration of installation and breakdown demand.", kind: "verified" },
      { text: "Its commercial VRV business serves offices, hotels and retail chains with maintenance contracts where response-time expectations are contractual rather than discretionary.", kind: "inference" },
      { text: "Installation and service delivered through dealer and partner technicians means Daikin is judged on a workforce whose scheduling it can influence but not control.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Daikin India is a manufacturing and sales subsidiary of a Japanese engineering group; global technology investment goes into compressor and system engineering and connected-equipment platforms. The India entity has no software organisation and procures customer-facing systems.",
    whyNotBuild:
      "As with every player in this category, the requirement is elasticity for a seasonal spike plus multilingual intake integrated with partner dispatch. A Japanese engineering parent will build refrigeration technology, not Indian-language contact-centre orchestration, and the India entity's decision will be made on service-level and cost terms.",
    workflows: [
      {
        name: "Seasonal installation request intake and scheduling",
        friction: "Post-purchase installation demand concentrates into a few summer weeks, overwhelming the helpline; customers wait for a dealer or partner technician to call and have no committed date during a heatwave.",
        outcome: "Every installation request captured at any volume with a committed window from partner scheduling and proactive updates, protecting the moment that most shapes brand perception.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Service management system", "Dealer and partner technician dispatch", "Product registration", "Dealer sale records"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Breakdown-service intake with urgency triage",
        friction: "Summer breakdown calls hit a helpline already saturated by installation demand, with no way to distinguish a total cooling failure from a routine service request.",
        outcome: "Elastic intake with triage that prioritises genuine failures and gives honest windows for the rest, absorbing the peak without permanent capacity.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Service management", "Partner technician dispatch", "Warranty and AMC entitlement", "Spare-parts availability"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Commercial VRV service and maintenance-contract support",
        friction: "Facility managers with VRV systems log service calls through dealers or account contacts; entitlement and SLA are not recognised at intake, and status requires chasing a person.",
        outcome: "Contract-aware intake that recognises entitlement and SLA immediately, assigns the right partner engineer and pushes status, meeting commercial obligations reliably.",
        channels: ["Voice", "WhatsApp", "Email"],
        systems: ["Maintenance contract administration", "Commercial service dispatch", "Equipment/installation records", "Case management"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A consumer helpline for installation, service and complaint intake",
        "A brand website and app for service-request raising and product registration",
        "A dealer and service-partner technician network delivering installation and service",
        "Dealer and system-integrator relationships serving the commercial VRV business",
      ],
      gaps: [
        "Helpline capacity cannot absorb the summer installation and breakdown peak",
        "No committed installation window is given at the point of request",
        "Commercial contract entitlement and SLA are not recognised at intake",
        "Regional-language coverage does not match the national spread of the dealer network",
      ],
    },
    risks: [
      "Deployment must precede the summer season; changing service intake during peak is unacceptable operational risk",
      "Partner technician capacity is externally controlled, so committed windows depend on reliable partner scheduling integration",
      "TRAI DND rules apply to AMC and service outreach to the installed base",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.2,
      automationRate: 0.55,
      basis: "Seller assumptions with strong seasonal skew, blending consumer and commercial service contact; validate the peak-to-trough ratio and the consumer-versus-commercial mix, which have very different handling profiles.",
    },
    pilotScope:
      "A 10-week pilot on seasonal installation request intake and scheduling across two northern cities in Hindi and English, deployed ahead of the summer season with partner dispatch integration.",
    expansion: [
      "Extend to breakdown-service intake with urgency triage during peak",
      "Add commercial VRV contract-aware service intake with SLA recognition",
      "Scale nationally with Tamil, Telugu and Marathi coverage",
    ],
    stakeholders: [
      "Managing Director, Daikin Airconditioning India",
      "Head of Service / After-Sales",
      "Head of Sales, Room Air Conditioners",
      "Head of Commercial and Applied Systems Business",
      "Chief Information Officer / Head of IT, India",
    ],
    discovery: [
      "What does your helpline abandonment rate look like in May compared with a normal month?",
      "How soon after purchase does installation actually happen at peak, and what do you commit?",
      "Can you see dealer and partner technician availability in real time?",
      "How are commercial VRV maintenance-contract service calls logged and tracked today?",
    ],
    flowTemplate: "appointments",
    scenario: "A Daikin customer in Gurugram who bought an AC in peak summer gets a committed installation window in Hindi instead of an engaged helpline.",
  },

  "medanta-global-health": {
    operatingContext:
      "Medanta, operated by Global Health Limited, runs large multi-specialty quaternary-care hospitals anchored by its Gurugram flagship, with additional hospitals in Lucknow, Patna, Indore and other north-Indian cities, and a clinic network extending its reach. It is positioned at the complex end of care — cardiac sciences, oncology, neurosciences, transplants — which draws patients from across northern and eastern India and from neighbouring countries, making it a genuine referral and medical-value-travel destination. That produces a demanding communication load: OPD appointment booking across hundreds of consultants, pre-admission coordination, diagnostic report follow-up, international-patient logistics, and post-discharge follow-up. Patients reach the hospital through a central appointment helpline, the hospital app and website, front-desk staff, and consultant secretaries.",
    strategicPressure: [
      { text: "Medanta's positioning in quaternary care — cardiac, oncology, neurosciences and transplants — draws patients from well beyond its immediate catchment, including international patients.", kind: "verified" },
      { text: "Operating hospitals across Gurugram, Lucknow, Patna and Indore means patients speak Hindi, Bhojpuri-influenced dialects and Bengali as much as English.", kind: "verified" },
      { text: "Appointment no-shows in a high-fixed-cost specialty hospital waste consultant time that cannot be recovered, making reminder effectiveness a direct revenue issue.", kind: "inference" },
      { text: "International-patient coordination — visa letters, estimates, travel and accommodation — is probably handled by a small dedicated team that becomes a bottleneck.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Medanta's capital goes into clinical infrastructure, technology for diagnosis and treatment, and clinician recruitment. Its IT function runs a hospital information system and associated clinical and administrative packages; there is no engineering organisation that would build conversational infrastructure.",
    whyNotBuild:
      "Hospital IT is judged on clinical system availability and regulatory compliance, not on building customer-facing platforms. The requirement here — multilingual voice integrated with HIS appointment scheduling, with strict clinical-boundary enforcement and full auditability — is a governed capability to be procured, and the escalation discipline it requires is itself a reason to buy something already designed for it.",
    workflows: [
      {
        name: "OPD appointment booking, reminders and rescheduling",
        friction: "Patients call a central helpline to book with a specific consultant; lines congest at opening, slot availability requires an agent lookup, and reminders are one-way SMS with no reschedule path, so no-shows waste consultant sessions.",
        outcome: "Appointments booked, reminded and rescheduled conversationally against live consultant schedules in the patient's language, converting wasted consultant slots into utilised ones.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Hospital information system (HIS) scheduling", "Consultant roster/OPD calendar", "Patient master index", "Payment gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Diagnostic report readiness and follow-up coordination",
        friction: "Patients and referring doctors call repeatedly to ask whether a report is ready and how to collect or access it, consuming front-desk and lab-desk time on a status question the system already knows.",
        outcome: "Proactive report-ready notification with secure access guidance and a follow-up consultation booked, removing a high-frequency contact category entirely.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Laboratory information system", "Radiology/PACS reporting status", "HIS patient records", "Appointment scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Pre-admission and international-patient coordination",
        friction: "Patients travelling from other states or countries need estimates, admission requirements, document lists and travel guidance; a small team handles this by phone and email across time zones, and enquiries stall.",
        outcome: "Structured pre-admission coordination with estimates and requirement checklists delivered conversationally and complex cases escalated to the international-patient team with context, protecting a high-value patient stream.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["HIS admission and estimation", "International patient CRM", "Consultant scheduling", "Document checklist workflow"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A central appointment helpline serving OPD booking across hospitals",
        "A patient mobile app and website with appointment booking and report access",
        "Front-desk and consultant secretarial staff handling in-person and telephone scheduling",
        "SMS-based appointment confirmations and reminders to patients",
      ],
      gaps: [
        "Appointments cannot be rescheduled inside the reminder, so no-shows go unrecovered",
        "Report-readiness status requires the patient to call and a human to check",
        "No structured multilingual pre-admission coordination for out-of-state and international patients",
        "Language coverage depends on which helpline agent answers rather than being a governed capability",
      ],
    },
    risks: [
      "Clinical boundary discipline is mandatory — any symptom, triage or medication question must escalate to qualified clinical staff, and that boundary must be provable in audit",
      "Patient health data is sensitive personal data under DPDP, requiring strict purpose limitation, consent and access control across every integration",
      "Medical-council and advertising norms constrain how services and outcomes may be described in patient-facing communication",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 1.3,
      automationRate: 0.5,
      basis: "Seller assumptions from OPD footfall, diagnostic volume and admission scale across the hospital network; automation rate is held conservative because clinical escalation boundaries are deliberately wide. Validate against Medanta's actual helpline volumes and no-show rate.",
    },
    pilotScope:
      "A 10-week pilot on OPD appointment booking, reminders and rescheduling for the Gurugram hospital in Hindi and English, integrated with HIS scheduling and consultant rosters.",
    expansion: [
      "Add proactive diagnostic report-readiness notification with follow-up booking",
      "Extend to Lucknow and Patna units with Bhojpuri-inflected Hindi and Bengali coverage",
      "Add pre-admission and international-patient coordination with team escalation",
    ],
    stakeholders: [
      "Chief Executive Officer, Global Health (Medanta)",
      "Chief Operating Officer / Hospital Director, Gurugram",
      "Head of Patient Experience and Front Office",
      "Chief Information Officer / Head of Health Informatics",
      "Head of International Patient Services",
    ],
    discovery: [
      "What is your OPD no-show rate, and what does a wasted consultant slot cost you?",
      "How many calls a day are simply asking whether a diagnostic report is ready?",
      "Can appointment slots be created and modified programmatically in your HIS today?",
      "How is your international-patient coordination staffed, and what is the enquiry-to-admission conversion?",
    ],
    flowTemplate: "appointments",
    scenario: "A cardiac patient's family in Patna books a Gurugram OPD slot in Hindi and reschedules it from the reminder when travel plans change.",
  },

  "kims-hospitals": {
    operatingContext:
      "KIMS Hospitals, operating as Krishna Institute of Medical Sciences, runs a multi-specialty hospital network anchored in Hyderabad and Secunderabad with units across Telangana and Andhra Pradesh, plus expansion into Maharashtra and other states partly through acquisitions and greenfield builds. Its model combines quaternary-care capability at flagship units with a broader regional network serving a Telugu-speaking patient base that reaches the hospital primarily by phone. Because growth has come partly through acquiring existing hospitals, patient-access operations — appointment booking, report follow-up, admission coordination — vary unit to unit rather than running on a standard. Patients reach the hospitals through unit-level appointment numbers, a patient app, front-desk staff and consultant secretaries.",
    strategicPressure: [
      { text: "KIMS has grown its network across Telangana, Andhra Pradesh and into Maharashtra through a mix of greenfield builds and acquisitions, which leaves patient-access processes inconsistent across units.", kind: "verified" },
      { text: "Its core patient base is Telugu-speaking, so appointment and report conversations happen predominantly in Telugu rather than English or Hindi.", kind: "verified" },
      { text: "Newly acquired units typically arrive with their own scheduling practices and telephone numbers, so a patient's experience depends on which hospital they call.", kind: "inference" },
      { text: "Appointment no-shows and unfilled consultant sessions are probably significant across the network but measured inconsistently unit by unit.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. KIMS is a clinical operator whose capital goes into hospital capacity, equipment and clinician recruitment. Its IT function runs a hospital information system and clinical packages; there is no engineering organisation and no strategic reason to create one.",
    whyNotBuild:
      "For an acquisitive hospital group, the value of a bought layer is standardisation: every newly acquired unit can be brought onto the same patient-access experience without re-engineering its local processes. Building would mean the integration backlog grows with every acquisition — the opposite of what the growth strategy needs.",
    workflows: [
      {
        name: "Appointment booking and reminders in Telugu",
        friction: "Patients call unit-level numbers that congest at opening; slot availability requires a front-desk lookup, and reminders are one-way SMS, so no-shows waste consultant sessions across the network.",
        outcome: "Telugu-first booking, reminding and rescheduling against live consultant schedules across every unit, raising session utilisation and standardising the experience post-acquisition.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["HIS appointment scheduling", "Consultant roster/OPD calendar", "Patient master index", "Payment gateway"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Diagnostic report-ready notification and follow-up booking",
        friction: "Patients and families call repeatedly to ask if a report is ready; front-desk and lab staff answer a status question the system already knows, and follow-up consultations are booked separately.",
        outcome: "Proactive report-ready notification with a follow-up consultation booked in the same conversation, removing a high-frequency contact and closing the clinical loop.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Laboratory information system", "Radiology reporting status", "HIS records", "Appointment scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Admission coordination and insurance pre-authorisation status",
        friction: "Families of admitted patients chase estimate revisions, insurance pre-authorisation status and discharge timing across billing, TPA desks and ward staff, with no single answer point.",
        outcome: "Status on estimates, pre-authorisation and discharge planning answered from the systems of record with escalation to the billing or TPA desk only for exceptions.",
        channels: ["WhatsApp", "Voice"],
        systems: ["HIS billing and estimation", "TPA/insurance pre-authorisation workflow", "Ward and discharge planning", "Case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Unit-level appointment telephone numbers and front-desk booking",
        "A patient app and website with appointment booking and report access at participating units",
        "Consultant secretaries handling scheduling for specific doctors",
        "SMS-based appointment confirmations and reminders",
      ],
      gaps: [
        "Patient-access processes differ by unit, especially at recently acquired hospitals",
        "Appointments cannot be rescheduled from within a reminder",
        "Report-readiness requires a call and a human lookup",
        "Insurance pre-authorisation and discharge status have no single answer point for families",
      ],
    },
    risks: [
      "Clinical boundary discipline is mandatory — symptom, triage and medication questions must escalate to qualified staff with an auditable trail",
      "Patient health data is sensitive personal data under DPDP, with additional complexity where recently acquired units run separate systems",
      "Insurance pre-authorisation communication touches TPA processes; the agent must report status, never make coverage determinations",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions from OPD footfall and diagnostic volume across the network, with a conservative automation rate reflecting wide clinical escalation boundaries; validate unit-by-unit contact volumes and no-show rates.",
    },
    pilotScope:
      "A 10-week pilot on Telugu-first appointment booking, reminders and rescheduling for the Hyderabad and Secunderabad units, integrated with HIS scheduling.",
    expansion: [
      "Add proactive report-ready notification with follow-up consultation booking",
      "Extend to recently acquired and Maharashtra units, standardising patient access with Marathi coverage",
      "Add admission, estimate and insurance pre-authorisation status for inpatient families",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer, KIMS Hospitals",
      "Chief Operating Officer, Hospital Operations",
      "Head of Patient Experience and Front Office",
      "Chief Information Officer / Head of Hospital Systems",
      "Head of Insurance and TPA Desk",
    ],
    discovery: [
      "Do all units share one HIS instance and one appointment scheduling model, or do acquired hospitals run separately?",
      "What is your OPD no-show rate, and is it measured consistently across units?",
      "How many daily calls are simply asking whether a report is ready?",
      "How do families track insurance pre-authorisation status during an admission today?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Warangal books a Hyderabad specialist slot in Telugu and is told automatically when her diagnostic report is ready.",
  },
};
