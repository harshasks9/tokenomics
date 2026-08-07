import type { Company } from "../schema";

export const COMPANIES_TRAVEL_MOBILITY: Company[] = [
  {
    slug: "makemytrip",
    name: "MakeMyTrip Limited",
    shortName: "MakeMyTrip",
    category: "Online travel (flights, hotels, bus, holidays)",
    group: "travel",
    color: "#EB2226",
    oneLiner:
      "India's largest online travel platform, selling flights, hotels, buses and holidays across MakeMyTrip, Goibibo and redBus, and monetising a thin take rate on more than ten billion dollars of gross bookings a year.",
    whyTop10:
      "No other Indian digital native carries this combination: very high ticket value, very high customer anxiety, and an operating model where the platform does not control the supplier that actually causes the failure. A cancelled flight, an unconfirmed hotel or a bus that never arrives is a MakeMyTrip problem in the customer's mind and an airline, hotel or operator problem in the system of record. Every recovery is therefore a negotiation across somebody else's inventory and somebody else's policy. That is the exact shape of work agents are now good at, and it is the shape of work a conversational assistant cannot finish.",
    snapshot: [
      { label: "FY26 gross bookings", value: "$10.4B, a company record", kind: "fact" },
      { label: "Q1 FY27 gross bookings", value: "~$2.9B, up 19.9% YoY in constant currency", kind: "fact" },
      { label: "Corporate travel", value: "Crossed $1B gross bookings in CY2025, over 10% of group total", kind: "fact" },
      { label: "Myra post-booking resolution", value: "~55% of flight and hotel post-booking queries resolved autonomously", kind: "fact" },
      { label: "Consumer brands", value: "MakeMyTrip, Goibibo, redBus", kind: "fact" },
    ],
    whyItMatters:
      "Say this plainly in the first meeting: MakeMyTrip already ships a GenAI travel assistant. Myra launched in August 2025 on an agentic framework, runs in English and Hindi, and the company has since deepened an AI-first strategy through a collaboration with OpenAI. Pitching an assistant here is not a differentiated conversation and an exec will treat it as a sign the seller did not do the reading. The gap is not conversation, it is autonomous action. Myra is reported to resolve around 55% of post-booking flight and hotel queries, which means the residual is the expensive part: the cases where resolving requires writing to an airline's inventory, extracting a confirmation out of a hotel that has not responded, arguing a refund against a supplier's own fare rules, or rescuing a payment that failed mid-transaction. Those cases need an agent with credentials, policy reasoning and the authority to commit the company to an outcome, plus a controlled boundary where it stops and hands to a human. That is the sale, and every use case below is written on that side of the line.",
    context: [
      {
        text: "MakeMyTrip closed FY26 with record gross bookings of $10.4B and crossed $1B in annual revenue for the first time, with air ticketing, hotels and packages, bus ticketing and other segments all growing double digits in constant currency.",
        kind: "fact",
        source: 3,
      },
      {
        text: "In Q1 FY27 gross bookings grew 19.9% YoY in constant currency to roughly $2.9B, but profit for the period fell about 65% YoY to $9.1M, driven largely by finance costs on convertible notes and a rupee that had depreciated more than 10% against the dollar. Growth is intact; the profit line is under real pressure, which makes cost-to-serve and take-rate protection a live board conversation rather than an efficiency nicety.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Myra, the multilingual GenAI trip planning assistant, launched in August 2025 built on a network of specialised agents across flights, accommodation, holidays, ground transport, visas and forex, handling voice and text. Management has since reported that more than 45% of Myra usage comes from tier-2 and smaller cities and that it autonomously resolves around 55% of post-booking flight and hotel queries.",
        kind: "fact",
        source: 1,
      },
      {
        text: "In February 2026 MakeMyTrip announced a deeper AI-first strategy through a collaboration with OpenAI, positioning itself to convert conversational travel intent into transaction-ready options across flights, hotels and ancillaries. The strategic direction is set at the top of the house; the unmet need is execution depth in post-booking and supplier-facing workflows, not another front door.",
        kind: "fact",
        source: 2,
      },
      {
        text: "Corporate travel crossed $1B in gross bookings in CY2025 and now represents more than 10% of group gross bookings, spanning roughly 500 large enterprises and about 75,000 SMEs on myBiz. SME corporate travel has no in-house travel desk, which means the policy enforcement and approval conversation has nowhere to live except the platform.",
        kind: "fact",
        source: 4,
      },
      {
        text: "The structural asymmetry to sell against: MakeMyTrip owns the customer relationship and the brand risk, but the systems that cause and can fix a failure, being airline inventory and fare rules, hotel property management systems and the Connect extranet, and bus operator manifests, sit outside it. Recovery quality is therefore a function of how fast and how competently the platform can act inside third-party systems, which is an agent problem before it is a service problem.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "MakeMyTrip Q1 FY27 results, Form 6-K (SEC EDGAR)",
        url: "https://www.sec.gov/Archives/edgar/data/0001495153/000119312526329440/mmyt-6k-q1_2027.htm",
      },
      {
        label: "MakeMyTrip press release: Multilingual GenAI Trip Planning Assistant (Myra)",
        url: "https://investors.mmtcdn.com/Press_Release_Gen_AI_Trip_Planning_Assistant_07_08_2025_404cc1872a.pdf",
      },
      {
        label: "MakeMyTrip Deepens AI-First Strategy with OpenAI Collaboration (Business Wire, Feb 2026)",
        url: "https://www.businesswire.com/news/home/20260217777911/en/MakeMyTrip-Deepens-AI-First-Strategy-with-OpenAI-Collaboration",
      },
      {
        label: "MakeMyTrip revenue tops $1 billion for first time in FY26 (Indian Startup News)",
        url: "https://indianstartupnews.com/news/makemytrip-revenue-tops-1-billion-for-first-time-in-fy26-q4-profit-falls-11852008",
      },
      {
        label: "MakeMyTrip corporate travel bookings cross $1B (Asian Hospitality)",
        url: "https://www.asianhospitality.com/makemytrip-1b-corporate-travel-bookings/",
      },
    ],
    useCases: [
      {
        id: "mmt-irrops-rebooking",
        rank: 1,
        name: "Disruption recovery agent that rebooks against live airline inventory",
        audience: "customer",
        lifecycle: "service",
        econ: "both",
        current:
          "When an airline cancels or reschedules, the schedule-change message lands in MakeMyTrip's systems long before the traveller understands what it means. Today the customer is told what happened and then routed into a queue where a human opens the airline portal, checks fare rules, finds alternatives and rebooks by hand. The assistant can explain the disruption; it cannot commit an airline seat. Meanwhile the downstream legs the customer booked on the same itinerary, being the hotel night, the airport transfer, the redBus connection, quietly become wrong.",
        agentic:
          "The agent ingests the schedule-change or cancellation event, reads the PNR and the fare basis, reasons over the carrier's reaccommodation policy and MakeMyTrip's own service commitment, searches live inventory for options that actually work for this traveller including onward connections and the reason for travel, presents two or three ranked choices in the traveller's language on WhatsApp or voice, and then executes the chosen option inside the airline system, reissues the ticket, and cascades the change into the linked hotel and ground legs. Where the carrier's policy leaves the traveller out of pocket, it opens and tracks the refund or compensation claim to closure rather than handing the customer a reference number.",
        trigger:
          "Airline schedule-change, cancellation or long-delay message received against a live PNR, or an inventory event on a linked hotel or bus leg of the same trip.",
        systems: [
          "GDS and airline NDC / reaccommodation APIs",
          "PNR and ticketing store",
          "Fare rules and carrier reaccommodation policy library",
          "Hotel and bus booking records for linked legs",
          "Refunds and payments ledger",
          "CRM and case management",
        ],
        channels: ["WhatsApp", "Outbound voice", "In-app chat", "Push", "Email"],
        outcomes: [
          "Time from disruption event to a confirmed alternative itinerary",
          "Share of disruptions resolved without a human agent touching the airline portal",
          "Repeat booking rate among travellers who experienced a disruption",
        ],
        whyThisCompany:
          "Travel is the one category in this cohort where the product routinely fails through no fault of the platform, and where the customer nonetheless blames the platform. With gross bookings at $10.4B in FY26 across air, hotels, bus and holidays, and profit under pressure from finance costs and currency in Q1 FY27, the cost of manual recovery and the goodwill spend that follows a bad recovery both land directly on a thin take rate. This is also the single clearest case where the existing assistant stops: Myra can already explain a cancellation, but reissuing a ticket against carrier inventory is an action, not an answer.",
        scores: { economic: 5, volume: 4, suitability: 5, ease: 1, differentiation: 5 },
      },
      {
        id: "mmt-hotel-confirmation-chase",
        rank: 2,
        name: "Unconfirmed-booking chase agent that works the hotel partner, not the customer",
        audience: "merchant",
        lifecycle: "transact",
        econ: "both",
        current:
          "A share of hotel bookings, concentrated in independent properties and homestays in leisure and tier-2 markets, do not come back confirmed on the first pass. Someone has to chase the property through the Connect extranet, then the property's phone, then WhatsApp, in whichever language the front desk speaks, while the customer sits with a payment taken and no confirmation. If the property never responds, the platform relocates the guest late and expensively.",
        agentic:
          "On a pending confirmation the agent works the supply side. It reads the property's historical response behaviour and channel manager setup, reaches the right contact on the channel that property actually answers, states the specific booking and the deadline, accepts or negotiates an alternative room category, writes the confirmation back into the booking record, and updates inventory. If the property is unreachable inside the window, it pre-sources a comparable alternative at a controlled rate delta, gets internal approval where the delta exceeds policy, and only then speaks to the guest, arriving with a solved problem rather than a warning.",
        trigger:
          "Booking sits in pending or unconfirmed state past a property-specific SLA, or a property fails to acknowledge an inventory pull.",
        systems: [
          "Connect (Ingo-MMT) hotel extranet",
          "Channel manager integrations",
          "Property contact and response-behaviour history",
          "Rate and inventory engine",
          "Relocation and goodwill policy engine",
          "Payments and refunds ledger",
        ],
        channels: ["Outbound voice to property", "WhatsApp", "Extranet messaging", "Email", "Guest push"],
        outcomes: [
          "Confirmation turnaround on pending hotel bookings",
          "Rate of at-destination relocations and their cost",
          "Independent and homestay supply retained on-platform",
        ],
        whyThisCompany:
          "MakeMyTrip's hotels and packages line has been one of its fastest-growing verticals, and growth there increasingly comes from long-tail Indian supply where the property is a small operator with no revenue manager and no 24x7 desk. The platform's leverage over that supply is a conversation, in the operator's language, at the moment it matters. An agent that works the hotelier rather than soothing the guest attacks the failure at its source and protects supply relationships that a competitor is actively courting.",
        scores: { economic: 4, volume: 4, suitability: 4, ease: 3, differentiation: 4 },
      },
      {
        id: "mmt-payment-failure-rescue",
        rank: 3,
        name: "Mid-booking payment failure rescue with fare and inventory hold",
        audience: "customer",
        lifecycle: "convert",
        econ: "revenue",
        current:
          "A payment fails at the gateway after the customer has chosen a fare, and the session dies. The customer is left unsure whether money left their account, the held fare expires, and they either retry later at a higher price or book somewhere else. Recovery today is a generic reminder that does not know what actually broke, does not know whether the fare still exists, and cannot re-attempt the payment on the customer's behalf.",
        agentic:
          "The agent reads the actual failure reason, distinguishing a bank decline from an expired mandate from a 3DS drop-off from a UPI timeout, holds or re-prices the itinerary against live inventory, and reaches the customer within minutes on WhatsApp with the specific remedy: a different payment rail, a corrected mandate, an EMI option, or a re-quoted fare with the delta stated honestly. It then completes the transaction end to end and confirms, including reissuing the hold if the original fare has moved.",
        trigger:
          "Payment authorisation failure or session abandonment after fare selection on a booking above a value threshold.",
        systems: [
          "Payment gateway and PSP failure codes",
          "UPI and card tokenisation stack",
          "Fare hold and pricing engine",
          "Inventory availability",
          "Customer wallet, loyalty and EMI eligibility",
        ],
        channels: ["WhatsApp", "In-app", "Outbound voice", "SMS"],
        outcomes: [
          "Recovered gross bookings from failed-payment sessions",
          "Median time from failure to completed booking",
          "Share of recoveries completed without a human",
        ],
        whyThisCompany:
          "Air and bus ticketing are high-frequency, price-sensitive and instantly substitutable, and MakeMyTrip's revenue is a thin margin on a very large booking base, so a percentage point of recovered failed transactions is real money against a profit line that fell sharply in Q1 FY27. The differentiation is honest and low: every OTA and aggregator will build payment-failure recovery, and some already have. It earns its place on volume and payback speed, not on strategic distance from competitors, and it is the right workflow to prove agent write-access safely on a bounded ledger before asking for airline inventory credentials.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 3, differentiation: 2 },
      },
      {
        id: "mmt-mybiz-policy-agent",
        rank: 4,
        name: "myBiz travel policy and approval agent for SMEs with no travel desk",
        audience: "employee",
        lifecycle: "retain",
        econ: "both",
        current:
          "In an SME on myBiz there is no travel manager. An employee books, an owner or finance lead approves over WhatsApp, and policy exists as a rule in the platform that people route around when the trip is urgent. Out-of-policy bookings surface after the fact in a report nobody reads, approvals stall while the fare moves, and the customer-side reconciliation of GST invoices and unused ticket credits is manual.",
        agentic:
          "The agent sits between the traveller and the approver. It reads the booking intent against the company's configured policy, tells the traveller in the moment which option is compliant and what the compliant alternative costs, assembles the exception case with a real business justification, reaches the approver on WhatsApp or voice with a one-tap decision while the fare is still held, and on approval books, issues the GST-compliant invoice, and books the residual value of any unused ticket back into the company's credit pool so it gets consumed rather than expired.",
        trigger:
          "Booking request that breaches configured corporate policy, or an approval that has been pending long enough to risk the held fare.",
        systems: [
          "myBiz policy and approval workflow",
          "Corporate account hierarchy and cost centres",
          "Fare hold and pricing engine",
          "GST invoicing",
          "Unused-ticket credit ledger",
          "Expense and ERP integrations",
        ],
        channels: ["WhatsApp", "In-app", "Email", "Outbound voice to approver"],
        outcomes: [
          "Share of corporate bookings compliant at point of sale",
          "Approval cycle time and fares lost to approval delay",
          "Unused ticket credit consumed before expiry",
        ],
        whyThisCompany:
          "Corporate travel crossed $1B in gross bookings in CY2025 and is now over 10% of group gross bookings, and roughly 75,000 of those accounts are SMEs. Those accounts are precisely the ones that cannot staff a travel desk, so the platform is the travel desk. Enforcing policy conversationally at the moment of booking is a retention moat in a segment where switching costs are otherwise near zero, and it moves the account from a booking tool to the system of record for T&E.",
        scores: { economic: 4, volume: 3, suitability: 4, ease: 3, differentiation: 4 },
      },
      {
        id: "mmt-holiday-itinerary-change",
        rank: 5,
        name: "Holiday and group itinerary change orchestration with re-quote and upsell",
        audience: "customer",
        lifecycle: "upsell",
        econ: "both",
        current:
          "A holiday package is a bundle of independently owned components: flights on a fare rule, hotel nights on a supplier contract, transfers with a local operator, sometimes a visa in progress. When one traveller in a group of nine drops out, or the family wants to add two nights, the change is worked manually across every supplier by a holidays consultant over days, with a re-quote assembled in a spreadsheet. Many changes that the customer would happily pay for simply do not get made because the effort exceeds the margin.",
        agentic:
          "The agent decomposes the itinerary, computes the true change cost across every component including each supplier's own change and cancellation penalty, negotiates or executes the change against each supplier system, reassembles the priced itinerary, and returns to the customer with a clear delta and, where genuinely better, a paid upgrade such as a longer stay, a better room category or an added experience. On acceptance it collects the differential, reissues documents and re-confirms every component.",
        trigger:
          "Customer-initiated change to a multi-component holiday or group booking, a supplier-initiated change to any component, or a visa outcome that invalidates a leg.",
        systems: [
          "Holidays package and itinerary engine",
          "Supplier contracts and penalty rules",
          "Airline and hotel change and cancellation APIs",
          "Ground transfer and activity operator systems",
          "Visa status tracking",
          "Payments and differential collection",
        ],
        channels: ["WhatsApp", "Voice", "Email", "In-app"],
        outcomes: [
          "Consultant hours per package change",
          "Change requests converted rather than abandoned",
          "Incremental margin from upgrades attached at change time",
        ],
        whyThisCompany:
          "Holidays is a lower-volume, high-value vertical for MakeMyTrip where cost-to-serve per booking is an order of magnitude above a bus ticket and where the manual effort of a change frequently eats the margin. It is the purest test of multi-system reasoning in the account, and it is where the case for autonomous action is easiest for an exec to feel, because everyone in the room has watched a group booking change take a week. Volume is genuinely low relative to air and bus, and the agent needs write access to supplier penalties and refunds, so this is a follower to the disruption agent rather than a starting point.",
        scores: { economic: 3, volume: 2, suitability: 5, ease: 2, differentiation: 4 },
      },
    ],
    openers: [
      "You already have Myra, and it reportedly closes about 55% of post-booking flight and hotel queries. I want to talk about the other 45%, because that residual is not a conversation problem, it is an authority problem: those cases need something that can reissue a ticket inside an airline's system, not explain what the airline did.",
      "Your gross bookings grew almost 20% in constant currency last quarter while profit fell around 65%. Every recovery you run manually against an airline, a hotel or a bus operator is margin leaving the business on a take rate you cannot widen. Where does the manual work concentrate?",
      "Your fastest-growing hotel supply is the long tail, independents and homestays with no 24x7 desk. Right now when one of them does not confirm, you manage the guest. What would change if you had something that worked the hotelier instead, in their language, before the guest ever knew there was a problem?",
    ],
    discovery: [
      "In a quarter, how many bookings are touched by a supplier-caused disruption, meaning a cancellation, a schedule change, an unconfirmed hotel or a bus no-show, and of those how many still require a human to open a supplier system to resolve?",
      "For disruption recovery specifically, what does your stack allow today: can Myra or any automated flow write to airline inventory, issue a reissue, or commit a refund, or does every write action still stop at a human with credentials?",
      "If an agent could complete a rebooking autonomously inside defined value and policy limits, what would the limit have to be for you to approve it, and who owns the decision to grant that write authority: engineering, service operations, or the supplier relationship team?",
    ],
    pilot: {
      workflow:
        "Domestic air disruption recovery on a single carrier and a single route family: from schedule-change event through ranked options on WhatsApp to an executed reissue, with a hard human handoff above a defined fare-delta and for any international or multi-carrier itinerary.",
      weeks: "10-12 weeks",
      why: "Narrowing to one carrier means one reaccommodation policy and one set of inventory credentials to negotiate, which is the real gating item rather than the model work. Domestic single-carrier disruptions give enough weekly volume to read a result inside the window, the counterfactual is cleanly measurable against the existing manual queue, and a fare-delta ceiling lets the business grant genuine write authority without granting unbounded financial exposure. Ten to twelve weeks reflects that supplier API access and the reissue path, not the agent, set the timeline.",
    },
  },
  {
    slug: "rapido",
    name: "Roppen Transportation Services (Rapido)",
    shortName: "Rapido",
    category: "Bike-taxi-led mobility, autos, cabs and delivery",
    group: "mobility",
    color: "#F5C518",
    oneLiner:
      "India's bike-taxi-led mobility platform, now spanning autos, cabs, parcel and food delivery, which monetises its captains through a SaaS-style subscription fee rather than a per-ride commission and competes with Ola and Uber primarily on the size and liquidity of its supply base.",
    whyTop10:
      "Rapido is the only large Indian consumer platform whose unit economics are a subscription sold to its own supply. Because a captain pays a daily or monthly fee and keeps the fare, Rapido cannot manage behaviour by adjusting a commission after the fact. It has no economic lever between the fee and the ride. The only remaining lever is communication: getting a captain live, keeping them live, resolving what they believe they are owed, and intervening before they cancel. In every other marketplace, partner communications are a cost centre. At Rapido they are the pricing mechanism.",
    snapshot: [
      { label: "Valuation", value: "$3B post-money, May 2026", kind: "fact" },
      { label: "Latest raise", value: "$240M led by Prosus, with WestBridge and Accel", kind: "fact" },
      { label: "Captain economics", value: "Auto captains pay Rs 9-29 per day; cab captains Rs 500 per month above Rs 10,000 earnings", kind: "fact" },
      { label: "FY25 operating revenue", value: "Rs 934 crore, up about 44% YoY", kind: "fact" },
      { label: "Competitive position", value: "Uber's CEO publicly named Rapido its biggest India rival, Aug 2025", kind: "fact" },
    ],
    whyItMatters:
      "Rapido's entire growth thesis is supply density, and its monetisation model means the company earns from a captain being logged in, not from what that captain earns. That inverts where communications value sits. Every day a verified captain does not go live, every wallet lapse that silently takes supply offline, every earnings dispute that ends with a captain believing the platform shorted them, and every cancellation at match time is direct revenue destruction against a subscription base, not a soft experience metric. Add the delivery expansion, which draws on the same captain pool, and Rapido is now arbitrating one supply base across two demand systems. Against that, one boundary is absolute and must be stated to the customer before anything else: safety incidents, harassment reports and accidents route to a trained human immediately and are never resolved by an agent. That is not a hedge, it is a live regulatory exposure, and a seller who does not raise it first will not be trusted with the rest.",
    context: [
      {
        text: "Rapido raised $240M led by Prosus in May 2026 at a $3B post-money valuation, roughly tripling its valuation in about nine months and taking total financing to around $730M. Growth capital at that pace makes captain acquisition cost and captain retention the metrics the board watches.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Rapido runs a SaaS-style zero-commission model, first for cabs and then extended to auto captains in February 2024. Auto captains pay a dynamic daily fee of roughly Rs 9 to Rs 29 and cab captains around Rs 500 a month once monthly earnings exceed Rs 10,000, keeping 100% of fares. Ola and Uber take a per-ride commission instead.",
        kind: "fact",
        source: 1,
      },
      {
        text: "Rapido launched its food delivery app Ownly across Bengaluru in March 2026 on a zero-commission model with a flat Rs 30 delivery fee, having onboarded roughly 20,000 restaurant partners, and fulfils orders through the same captain network used for rides. It has since folded Ownly into the main app and set out a multi-city expansion.",
        kind: "fact",
        source: 2,
      },
      {
        text: "Regulatory exposure is real and state-specific. Maharashtra revoked the provisional bike-taxi licences of Ola, Uber and Rapido in March 2026, citing documentation failures, complaints alleging harassment of women riders, and use of petrol rather than the mandated electric two-wheelers. Karnataka's High Court had lifted that state's bike-taxi ban in January 2026, directing registration of motorcycles as transport vehicles.",
        kind: "fact",
        source: 3,
      },
      {
        text: "Rapido requires captains to complete mandatory app-based training covering conduct, respectful interaction with women passengers, emergency protocol and dispute handling before going live, and repeated complaints or safety flags can trigger retraining or deactivation. The onboarding funnel is therefore not just document verification, it is a compliance gate with several places to drop out.",
        kind: "fact",
        source: 4,
      },
      {
        text: "The operating consequence to sell against: with a subscription model, the marginal revenue of a ride is zero and the marginal revenue of a logged-in captain is the fee. Anything that raises days-live per captain, shortens time from signup to first ride, or prevents a captain lapsing has a direct and unusually legible revenue effect, which makes partner communications easier to attach a number to here than at any commission-based competitor.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "Indian Uber rival Rapido raises $240M at $3B valuation (TechCrunch, May 2026)",
        url: "https://techcrunch.com/2026/05/15/indian-uber-rival-rapido-raises-240m-at-3b-valuation/",
      },
      {
        label: "After cabs, Rapido extends SaaS-based zero-commission model to auto drivers (Business Standard)",
        url: "https://www.business-standard.com/companies/start-ups/after-cabs-rapido-extends-saas-based-zero-commission-model-to-auto-drivers-124021300846_1.html",
      },
      {
        label: "Rapido rolls out Ownly in Bengaluru with zero-commission model (MediaNama, Mar 2026)",
        url: "https://www.medianama.com/2026/03/223-rapido-ownly-bengaluru-zero-commission-model-sustain-without-charging-restaurants/",
      },
      {
        label: "Maharashtra revokes bike taxi licences of Ola, Uber, Rapido (MediaNama, Mar 2026)",
        url: "https://www.medianama.com/2026/03/223-maharashtra-revokes-bike-taxi-licenses-ola-uber-rapido/",
      },
      {
        label: "Why Rapido treats safety as a skill, not a rule: captain training (Outlook India)",
        url: "https://www.outlookindia.com/xhub/featured-insights/training-wheels-of-a-different-kind-why-rapido-treats-safety-as-a-skill-not-a-rule",
      },
    ],
    useCases: [
      {
        id: "rapido-captain-activation",
        rank: 1,
        name: "Captain signup-to-first-ride activation agent, state rules included",
        audience: "partner",
        lifecycle: "onboard",
        econ: "both",
        current:
          "A prospective captain downloads the app, uploads a licence, RC and identity documents, and then hits a gauntlet: a rejected document with a reason nobody explained, a mandatory training module left half-finished, a vehicle class that is not permitted in that state this month, a bank account that fails penny-drop. Each drop-off is silent. Field teams chase the ones they can reach by phone, in whichever language they happen to share, and the rest evaporate after the acquisition spend has already been paid.",
        agentic:
          "The agent owns the funnel from signup to first completed ride. It reads the actual rejection reason and tells the captain exactly what to re-shoot and why, verifies the image is now usable before resubmitting, walks the captain through the mandatory safety and conduct training in their own language and confirms comprehension rather than completion, checks the vehicle and permit class against the rules currently in force in that state, fixes bank and UPI failures, and then stays with the captain through the first ride, explaining how the subscription fee works and what they will actually keep. It escalates only genuine document fraud signals and permit exceptions to a human.",
        trigger:
          "Signup created, or any stall in the funnel: document rejection, training module abandoned for more than a set period, failed bank verification, or verified captain with no first ride.",
        systems: [
          "Captain onboarding and KYC pipeline",
          "Document verification and OCR",
          "In-app training and certification records",
          "State-by-state permit and vehicle eligibility rules",
          "Bank and UPI verification",
          "Subscription billing and captain wallet",
        ],
        channels: ["Outbound voice in regional languages", "WhatsApp", "In-app", "IVR"],
        outcomes: [
          "Signup to first-ride conversion rate",
          "Median days from signup to first ride",
          "Effective captain acquisition cost per activated captain",
        ],
        whyThisCompany:
          "Rapido's valuation tripled to $3B in about nine months on the strength of supply density, and its revenue accrues per logged-in captain rather than per ride, so an unactivated captain is acquisition spend that produces literally zero. Onboarding is also a compliance gate here, not a form: training is mandatory before going live, and eligibility genuinely differs by state after Karnataka's court ruling and Maharashtra's licence revocations. That combination of high drop-off, multilingual supply and rules that shift by geography is exactly what a human field team cannot cover and a static app flow cannot explain.",
        scores: { economic: 5, volume: 5, suitability: 4, ease: 3, differentiation: 4 },
      },
      {
        id: "rapido-cancellation-intervention",
        rank: 2,
        name: "Pre-cancellation intervention at match time, where no commission lever exists",
        audience: "partner",
        lifecycle: "transact",
        econ: "both",
        current:
          "A captain accepts and then stalls: the pickup is eight minutes away in traffic, the rider wants cash and the captain has none, the drop takes them out of their zone at the end of a shift. Today the platform waits, the timer runs, the captain cancels or lets it lapse, and the rider is rematched with a worse ETA or leaves for Uber. Penalties and rating deductions arrive later and teach the captain to be slower to accept rather than better at completing.",
        agentic:
          "At the first behavioural signal that a cancellation is coming, the agent reaches the captain instantly on voice in their language, identifies the actual blocker rather than the cancellation reason code, and resolves it with what it is authorised to offer: a pickup compensation within a bounded budget, a same-direction reassignment, an assurance about the payment mode, a confirmation of the return leg. If the blocker cannot be solved, it releases and rematches immediately with the rider already informed, rather than burning the timer. It writes what it learned back so the matching engine stops making the same offer to that captain.",
        trigger:
          "Post-acceptance stall signals: no movement toward pickup, ETA slippage past threshold, repeated app foregrounding without progress, or a rider-initiated where-are-you message.",
        systems: [
          "Dispatch and matching engine",
          "Live GPS and ETA telemetry",
          "Captain history, ratings and cancellation profile",
          "Incentive and pickup-compensation budget engine",
          "Payment mode and captain wallet state",
        ],
        channels: ["Outbound voice", "In-app voice", "Push", "WhatsApp to rider"],
        outcomes: [
          "Post-acceptance cancellation rate",
          "Rider wait time and rematch rate",
          "Completed rides per logged-in captain hour",
        ],
        whyThisCompany:
          "This is the sharpest expression of the subscription model. Ola and Uber can price a cancellation into a commission after the fact; Rapido has already been paid the daily fee and earns nothing more from the ride, so its only instrument at match time is a conversation. That makes real-time voice intervention a pricing mechanism at Rapido and merely a service nicety at its competitors, and it is why this workflow cannot be pasted onto Uber unchanged. With bike-taxi share concentrated in short, high-frequency trips, the intervention window is measured in tens of seconds, which rules out a human queue entirely.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 3, differentiation: 5 },
      },
      {
        id: "rapido-earnings-dispute",
        rank: 3,
        name: "Earnings and subscription-fee dispute resolution with ledger-level reconstruction",
        audience: "partner",
        lifecycle: "retain",
        econ: "cost",
        current:
          "A captain believes they are owed more than they were paid. The dispute could be a missed incentive tier, a daily fee charged on a day they barely worked, a cash-ride adjustment, a negative wallet balance they do not recognise, or a surge they thought applied. Support answers with a policy line the captain does not accept, the captain repeats the complaint across channels, and the unresolved belief that the platform shorts its captains is the single most corrosive thing in a supply war where the competitor is actively recruiting.",
        agentic:
          "The agent reconstructs the captain's ledger for the disputed period ride by ride, explains in the captain's language exactly how the number was arrived at, including which incentive tier was missed and by how much, and where the platform is genuinely wrong it issues the adjustment itself within a bounded authority and confirms the credit. Where the captain is wrong but close, it states what specifically would have qualified them, which turns a grievance into a behaviour instruction. Anything above the authority ceiling, or any pattern suggesting a systemic fee error, is escalated with the reconstruction already attached.",
        trigger:
          "Captain-raised earnings or fee dispute on any channel, or a detected anomaly such as a fee charged against near-zero logged hours.",
        systems: [
          "Ride and earnings ledger",
          "Subscription fee billing engine",
          "Incentive and surge rule engine",
          "Captain wallet and payouts",
          "Cash-collection reconciliation",
          "Case management",
        ],
        channels: ["Outbound and inbound voice", "WhatsApp", "In-app captain support"],
        outcomes: [
          "Cost per earnings dispute resolved",
          "Repeat-contact rate on the same dispute",
          "Captain 30-day retention after a disputed payout",
        ],
        whyThisCompany:
          "Under a per-ride commission the captain sees a percentage; under Rapido's model the captain pays a fee up front and then judges every rupee of the fare against what they expected, so the surface area for disputes is structurally larger and the emotional stakes are higher. The fee is charged whether or not the day went well, which is exactly the condition that produces the accusation of an unfair platform. Ease is deliberately scored low: giving an agent authority to write adjustments to an earnings ledger is a genuine financial-control decision and will need a hard ceiling, dual logging and finance sign-off before it goes live.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "rapido-safety-escalation",
        rank: 4,
        name: "Safety signal detection and instant human handoff, with resolution never automated",
        audience: "customer",
        lifecycle: "service",
        econ: "cost",
        current:
          "Safety signals arrive scattered and out of band: an SOS tap, a night-ride check call that goes unanswered, a route deviation, a rider message that reads wrong, a post-ride rating with a comment nobody triaged for days. The human safety desk is the right place for these, but it is reached slowly and it starts cold, with an officer opening tabs to find out who the captain is, where the ride went and whether there were prior flags, while the caller waits.",
        agentic:
          "The agent's job here is detection, enrichment and speed, never resolution. It watches every channel for safety signals, correlates them with live telemetry and the captain's prior flag history, and inside seconds hands a fully assembled context packet, being ride ID, live location, captain record, prior complaints, transcript, to a trained human safety officer with the line already open. It does not interview the reporter, does not judge severity beyond routing, does not close the case and does not offer compensation. In parallel it executes only the mechanical containment the policy pre-authorises, such as suspending further dispatch to that captain pending review, and preserves the record for the regulator.",
        trigger:
          "SOS activation, unanswered night-ride safety check, significant route deviation, or any text or voice signal classified as a harassment, accident or distress indicator on any channel.",
        systems: [
          "SOS and safety event stream",
          "Live ride telemetry and GPS",
          "Captain flag, complaint and training history",
          "Safety desk case management and telephony",
          "Dispatch suspension controls",
          "Regulatory and law-enforcement reporting records",
        ],
        channels: ["In-app SOS", "Voice", "WhatsApp", "Immediate human handoff"],
        outcomes: [
          "Time from first safety signal to a human officer engaged with full context",
          "Share of safety signals detected proactively rather than reported after the fact",
          "Completeness of the evidentiary record filed per incident",
        ],
        whyThisCompany:
          "State this as a hard boundary in the room before anything else: at Rapido, safety incidents, harassment reports and accidents route to a human immediately and are never resolved, negotiated or closed by an agent. Maharashtra cited complaints alleging harassment of women riders among its reasons for revoking bike-taxi licences in March 2026, which makes this a licence-to-operate matter and not a CX metric. Bike taxis also place rider and captain in physical contact in a way a cab does not, so the platform's exposure is categorically different from Ola's or Uber's cab businesses. Agentic suitability is deliberately scored mid-range because the agent cannot and must not complete the outcome; its value is that a human starts the conversation warm and in seconds.",
        scores: { economic: 3, volume: 3, suitability: 3, ease: 2, differentiation: 4 },
      },
      {
        id: "rapido-ownly-restaurant-acquisition",
        rank: 5,
        name: "Ownly restaurant acquisition and go-live agent for the multi-city expansion",
        audience: "merchant",
        lifecycle: "acquire",
        econ: "revenue",
        current:
          "Ownly's proposition to a restaurant is that it charges no commission, which makes it easy to say yes to and easy to never actually switch on. Field sales sign a restaurant, then the listing stalls on a menu that never arrived, prices that do not match the in-store board, an FSSAI licence not uploaded, or a store that is technically live but rejects orders because the counter never learned to watch the tablet. Each city launch repeats the same manual chase with a new field team.",
        agentic:
          "The agent runs acquisition and go-live end to end for the long tail. It reaches the owner on WhatsApp or voice in their language, explains the zero-commission and flat delivery-fee model against what they currently pay incumbents in numbers specific to their order profile, collects and validates menu, pricing, timings and FSSAI documentation, builds the catalogue from photographs of the physical menu, verifies the first live orders are being accepted, and calls the counter when acceptance behaviour slips. It hands to a human for negotiated exclusivity or any commercial term outside the standard model.",
        trigger:
          "New city launch list, an incoming restaurant lead, a signed store that has not gone live within its window, or a live store whose order-acceptance rate falls below threshold.",
        systems: [
          "Ownly merchant onboarding and catalogue",
          "FSSAI and compliance document validation",
          "Menu and pricing management",
          "Order acceptance and store-health telemetry",
          "Captain fulfilment capacity by zone",
          "Merchant CRM",
        ],
        channels: ["WhatsApp", "Outbound voice in regional languages", "Merchant app", "Multimodal menu capture"],
        outcomes: [
          "Signed to first-order conversion rate per city",
          "Days from signup to live catalogue",
          "Order acceptance rate across newly live stores",
        ],
        whyThisCompany:
          "Ownly launched citywide in Bengaluru in March 2026 with roughly 20,000 restaurant partners on a zero-commission, flat Rs 30 delivery fee model, and the stated plan runs to several more metros. Zero commission removes the lever an incumbent would use to force listing quality, so the only way to make a merchant actually trade is to talk to them. It also means Rapido has to earn a second revenue stream out of the same captain pool it monetises for rides, which is why merchant activation speed and zone-level fulfilment capacity have to be reasoned about together. Scores are moderate because this is early-stage volume against two entrenched incumbents, and merchant onboarding is a workflow every food platform will automate.",
        scores: { economic: 3, volume: 3, suitability: 4, ease: 3, differentiation: 3 },
      },
    ],
    openers: [
      "Your model means you get paid when a captain is logged in, not when they complete a ride. So every silent drop-off in onboarding and every lapsed captain is not a service problem, it is lost subscription revenue. Do you know, by state, where in the funnel your verified captains stop?",
      "Uber and Ola can price a cancellation into their commission after the ride. You have already been paid the daily fee, so when a captain is about to cancel, the only lever you have left is somebody talking to them in the next thirty seconds. Today, nobody does. That is the gap I want to talk about.",
      "Before anything else: nothing I am proposing touches safety. Harassment, accidents and SOS go to your human desk immediately, and the only thing worth automating there is making sure your officer picks up already knowing who the captain is, where the ride went, and what was flagged before. Everything else we discuss sits outside that line.",
    ],
    discovery: [
      "Between signup and first completed ride, what share of captains drop off, where does that concentrate by stage and by state, and how many of those drop-offs does a human currently attempt to call back?",
      "Which captain-facing conversations are automated today and which still require a human, specifically for document rejections, earnings disputes and post-acceptance cancellations, and what is the current cost and language coverage of that support?",
      "What financial authority would you be willing to delegate to an automated system: could it credit an earnings adjustment or release a pickup incentive within a fixed ceiling without human approval, and who signs off on that, finance or operations?",
    ],
    pilot: {
      workflow:
        "Captain signup-to-first-ride activation in two cities under different state regimes: multilingual outbound voice and WhatsApp on every funnel stall, with document re-capture, training completion, permit-eligibility guidance and first-ride handholding, measured against a matched control cohort worked the existing way.",
      weeks: "8-10 weeks",
      why: "Activation is the highest-value workflow that needs no write access to the earnings ledger and carries no safety exposure, so it can go live while the harder authority conversations about adjustments and incentive budgets are still being had. Two cities under different state rules proves the agent can reason over geography-specific eligibility, which is the part a scripted flow fails at. Signup cohorts are large enough that a matched control reads a clean result inside eight to ten weeks, and the metric it moves, activated captains per rupee of acquisition spend, is one the board is already tracking after the Prosus round.",
    },
  },
];
