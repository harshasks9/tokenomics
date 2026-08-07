import type { Company } from "../schema";

export const COMPANIES_FOOD: Company[] = [
  {
    slug: "eternal",
    name: "Eternal Ltd",
    shortName: "Eternal",
    category: "Quick commerce, food delivery & going out",
    group: "food-quick-commerce",
    color: "#E23744",
    oneLiner:
      "The renamed Zomato parent, now a four-business holding company where Blinkit's inventory-led quick commerce is the growth engine, Zomato food delivery is the cash engine, Hyperpure supplies restaurant kitchens, and District sells the evening out.",
    whyTop10:
      "Eternal is the largest consumer internet company in India by net order value and the clearest example of a digital native that rebuilt its identity around a second business. Its quarterly disclosures set the reference prices for quick commerce economics that every other Indian operator is judged against, and it touches customers, restaurants, brands, dark-store staff and rider partners in a single day.",
    snapshot: [
      { label: "Blinkit dark stores", value: "2,243 stores across 150+ cities (Mar 2026)", kind: "fact" },
      { label: "Blinkit net order value", value: "INR 17,132 cr in Q1 FY27, +86% YoY", kind: "fact" },
      { label: "Consolidated revenue", value: "INR 20,211 cr in Q1 FY27; PAT INR 92 cr", kind: "fact" },
      { label: "District net order value", value: "INR 3,218 cr in Q1 FY27, +60% YoY", kind: "fact" },
      { label: "Contact volume already automated", value: "Nugget handles 15 mn+ support conversations a month across Zomato, Blinkit and Hyperpure", kind: "fact" },
    ],
    whyItMatters:
      "Eternal has already won the easy half of the argument: it built Nugget, it automated reactive support at scale, and it has publicly banked the cost saving. That makes it a hard account for a generic support pitch and an unusually good account for an agentic one. Every remaining interaction of value at Eternal is proactive and transactional rather than reactive and informational: rescuing a basket when a dark store cannot fulfil it, keeping a restaurant's Hyperpure order cadence alive, standing up two hundred new stores a quarter, and turning a ticket purchase into a whole evening. Those are agent workloads, not deflection workloads, and none of them are served by the platform Eternal already owns.",
    context: [
      {
        text: "Zomato Ltd renamed itself Eternal Ltd to reflect a portfolio built around Blinkit, Hyperpure and District, keeping the Zomato app and brand unchanged. The rename was an explicit signal that quick commerce, not food delivery, is the growth story.",
        kind: "fact",
        source: 2,
      },
      {
        text: "Blinkit added 216 net new dark stores in the March 2026 quarter alone to reach 2,243 stores across more than 150 cities and roughly 17 mn sq ft, and posted its first positive adjusted EBITDA at 0.3% of net order value.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Blinkit moved to a first-party inventory-led model, so Eternal now recognises the full value of goods sold and owns the buying, the shelf and the write-off. Part of what used to be Hyperpure revenue now sits inside Blinkit, which is why Hyperpure's reported revenue fell sharply even as it turned adjusted-EBITDA positive.",
        kind: "fact",
        source: 0,
      },
      {
        text: "In Q1 FY27 Eternal reported INR 20,211 cr revenue and INR 92 cr profit, with B2C net order value up 54% and District accelerating to 60% growth. Management has been explicit that it will spend margin to protect growth if it has to.",
        kind: "fact",
        source: 1,
      },
      {
        text: "Nugget, Eternal's in-house AI support platform, already runs more than 15 mn conversations a month across the group with high self-resolution. The commercial implication is that reactive query handling is a closed conversation at this account, and the open ground is agents that take action in operational and commercial systems.",
        kind: "fact",
        source: 3,
      },
      {
        text: "Because Blinkit now owns inventory, every substitution, cancellation and partial fulfilment is a direct hit to Eternal's own gross margin rather than a seller's. We would expect the highest-value agentic workload to sit at the moment a dark store cannot serve a basket as ordered.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "Eternal Q4 FY26 results: Blinkit store count, EBITDA and segment detail",
        url: "https://indianstartupnews.com/news/a-full-picture-of-eternals-q4-fy26-results-from-blinkit-to-zomato-and-beyond-11775239",
      },
      {
        label: "Eternal Q1 FY27: INR 20,211 cr revenue, INR 92 cr profit",
        url: "https://entrackr.com/fintrackr/eternal-reports-rs-20211-cr-revenue-and-rs-92-cr-profit-in-q1-fy27-12187705",
      },
      {
        label: "TechCrunch: India's Zomato to rebrand as Eternal",
        url: "https://techcrunch.com/2025/02/06/indias-zomato-to-rebrand-as-eternal",
      },
      {
        label: "Business Standard: Zomato launches AI customer support platform Nugget",
        url: "https://www.business-standard.com/companies/news/zomato-launches-ai-customer-support-platform-nugget-125021700734_1.html",
      },
      {
        label: "Eternal: District business overview",
        url: "https://www.eternal.com/our-businesses/district/",
      },
    ],
    useCases: [
      {
        id: "eternal-basket-rescue",
        rank: 1,
        name: "Dark-store fulfilment gap rescue before the rider leaves",
        audience: "customer",
        lifecycle: "transact",
        econ: "both",
        current:
          "A picker at a Blinkit dark store cannot find one or more items in a live basket. Today the order is silently short-shipped, part-refunded after delivery, or cancelled outright, and the customer discovers the problem at the door. Under the 1P model the lost margin, the write-off and the goodwill credit all land on Eternal.",
        agentic:
          "The moment picking flags a shortfall, the agent reads the customer's substitution history, brand and dietary sensitivity, membership tier and the basket's role (top-up versus a real shop), then reasons over live inventory in the adjacent store cluster. It decides between a like-for-like swap, a split despatch from a second store, a hold-and-top-up, or a clean removal with a proportionate credit — proposes it in one message on the app or WhatsApp with a countdown, executes the chosen path in the order and inventory systems, issues any credit itself, and updates the promise time.",
        trigger: "Picker or inventory system flags an unfillable line in a basket that has not yet been despatched.",
        systems: [
          "Blinkit order management",
          "Store-level inventory and picking",
          "Customer purchase and substitution history",
          "Payments and refunds ledger",
          "Rider despatch and routing",
        ],
        channels: ["App push", "In-app chat", "WhatsApp", "Outbound voice for high-value baskets"],
        outcomes: [
          "Fewer full-order cancellations per thousand orders",
          "Higher accepted-substitution rate and preserved basket value",
          "Lower post-delivery credit and refund cost per order",
        ],
        whyThisCompany:
          "Only Eternal carries this cost on its own balance sheet. Since Blinkit went inventory-led, a substitution decision is a buying and margin decision, not a marketplace notification. At 2,243 stores and a store base still growing by roughly two hundred a quarter, newly opened stores carry the thinnest assortment depth and generate the most shortfalls exactly when Eternal is trying to prove the store's contribution economics.",
        scores: { economic: 5, volume: 5, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "eternal-hyperpure-cadence",
        rank: 2,
        name: "Hyperpure kitchen replenishment agent that reads the restaurant's own demand",
        audience: "merchant",
        lifecycle: "retain",
        econ: "revenue",
        current:
          "Hyperpure account managers cover restaurant customers on a call rotation. Outlets drift to local mandis and cash-and-carry between calls, and nobody notices a lapsed SKU until the quarter closes. Coverage is thin outside the top accounts.",
        agentic:
          "The agent watches the outlet's own Zomato and District demand — dish-level order mix, weekend spikes, a menu change, a new outlet opening — and models when each key input runs out. It opens the conversation on WhatsApp or voice in the owner's language, proposes a basket with quantities and a price inside its authorised band, handles the objection about a cheaper local rate with the delivered-cost comparison, places the order, and when a delivery truck slips it reschedules the slot and renegotiates the affected lines rather than dropping them.",
        trigger:
          "Predicted stock-out on a tracked SKU, an unexplained drop in order cadence versus the outlet's demand signal, or a menu or outlet change detected on Zomato.",
        systems: [
          "Hyperpure order and catalogue",
          "Zomato restaurant demand and menu data",
          "Warehouse stock and delivery slotting",
          "Credit limits and pricing bands",
          "CRM and account ownership",
        ],
        channels: ["WhatsApp", "Outbound voice", "Merchant app"],
        outcomes: [
          "Higher share of wallet per restaurant account",
          "Lower lapsed-SKU and dormant-account rate",
          "Account manager time redirected to the top of the base",
        ],
        whyThisCompany:
          "No competitor can run this play. Eternal is the only operator that sees a restaurant's live consumer demand on one side and supplies its kitchen on the other, and the 1P shift has just made the group's buying scale larger and its cost position better. Hyperpure has turned adjusted-EBITDA positive on a smaller reported base, so the next unit of value has to come from depth per account rather than headcount.",
        scores: { economic: 4, volume: 3, suitability: 4, ease: 3, differentiation: 5 },
      },
      {
        id: "eternal-district-evening",
        rank: 3,
        name: "District evening assembly and plan-change agent",
        audience: "customer",
        lifecycle: "convert",
        econ: "revenue",
        current:
          "A District user books a concert, a match or a movie and the transaction ends there. The dinner before, the table, the group's ticket split and the re-plan when the show time moves all happen off-platform, on WhatsApp threads Eternal never sees. Plan changes surface as refund requests rather than rebooking.",
        agentic:
          "On ticket confirmation the agent assembles the rest of the evening: it reasons over the venue, the start time, travel time and the group's past dining behaviour to propose a table at the right distance and hour, holds the reservation, runs the group's seat and payment split conversation with each attendee directly, and adds a pre-order where the restaurant supports it. When the event time moves or a venue changes, it re-plans the whole evening — moves the table, re-notifies the group, and offers alternative dates before the user ever asks for a refund.",
        trigger: "Ticket confirmation on District, or an event time, venue or seating change published by the organiser.",
        systems: [
          "District ticketing and inventory",
          "District dining and reservations",
          "Customer dining and event history",
          "Group payment splitting",
          "Organiser and venue feeds",
        ],
        channels: ["App", "WhatsApp group thread", "Voice for same-day changes"],
        outcomes: [
          "Higher attached dining value per ticket sold",
          "Lower refund rate on rescheduled events",
          "More multi-person bookings originating in-app",
        ],
        whyThisCompany:
          "District is the only asset in India that owns the ticket and the table in the same account, and Eternal has said it wants to take share in movies and events specifically. Going-out net order value is compounding at 60% off a smaller base, which means the marginal ticket is worth far more when it carries a table with it — and the plan-change conversation is the single most common reason a going-out booking turns into a refund instead of a rebooking.",
        scores: { economic: 3, volume: 2, suitability: 4, ease: 3, differentiation: 5 },
      },
      {
        id: "eternal-store-launch",
        rank: 4,
        name: "Dark-store launch orchestration across landlord, hiring, licences and cold chain",
        audience: "employee",
        lifecycle: "onboard",
        econ: "cost",
        current:
          "Every new Blinkit store is a project run by a city ops manager over phone and spreadsheets: fit-out vendor, electricity load, food licence, cold-chain install, picker hiring and training, first assortment load-in. At two hundred-odd stores a quarter across 150+ cities, city teams are the bottleneck and every slipped week is a week of rent with no orders.",
        agentic:
          "The agent owns the launch plan for every store in flight. It chases each dependency with the responsible party by voice or WhatsApp in the local language, understands a spoken answer such as a two-day inspection delay, recomputes the critical path, moves the dependent tasks, reallocates the training slot, escalates only the items that actually threaten the go-live date, and keeps the launch tracker and the go-live forecast current without a human status call.",
        trigger: "A site is approved for launch, or any launch dependency misses its committed date.",
        systems: [
          "Store launch and project tracker",
          "Vendor and contractor directory",
          "Hiring and onboarding pipeline",
          "Licensing and compliance records",
          "Assortment and first-load planning",
        ],
        channels: ["WhatsApp", "Outbound and inbound voice", "Internal ops app"],
        outcomes: [
          "Shorter site-approval to first-order cycle time",
          "Fewer stores opening with incomplete staffing or assortment",
          "City ops span of control extended without added headcount",
        ],
        whyThisCompany:
          "Store-opening velocity is the mechanism by which Blinkit's lead is built and defended, and it is the one operational rhythm Eternal runs harder than anyone else. But the workflow itself is coordination rather than commercial advantage — a competitor could stand up something similar — so it earns its place on volume and cycle time, not on strategic distance.",
        scores: { economic: 3, volume: 3, suitability: 4, ease: 4, differentiation: 2 },
      },
      {
        id: "eternal-brand-terms",
        rank: 5,
        name: "Mid-tail brand listing and trade-terms negotiation for the 1P buying desk",
        audience: "merchant",
        lifecycle: "upsell",
        econ: "revenue",
        current:
          "Category managers negotiate margin, marketing support and listing decisions with brands in a periodic cycle. The top brands get attention; the long tail of regional and challenger brands is reviewed late, delisted bluntly, or left on shelf earning nothing, which is expensive now that Blinkit owns the inventory.",
        agentic:
          "The agent runs the recurring commercial conversation with the mid-tail. It reads sell-through, wastage and days-of-cover by store cluster, builds a position — expand to these forty cities, exit these two SKUs, this margin and this trade spend — and negotiates it directly with the brand's sales contact within a guardrail set by the category manager. It drafts the revised terms, raises the purchase order, sets the cluster-level listing, and hands anything outside its authority to a human with the full negotiation history attached.",
        trigger: "Scheduled terms review, a sell-through or wastage threshold breach, or a brand-initiated listing request.",
        systems: [
          "1P buying and purchase orders",
          "Store-cluster sell-through and wastage",
          "Trade terms and contract repository",
          "Retail media and promo planning",
          "Vendor master",
        ],
        channels: ["Email", "WhatsApp", "Outbound voice", "Vendor portal"],
        outcomes: [
          "Higher trade and retail-media income per mid-tail brand",
          "Lower wastage and days-of-cover on tail SKUs",
          "More brands reviewed per category manager per cycle",
        ],
        whyThisCompany:
          "This workflow only exists because Blinkit went first-party. Eternal now buys, holds and writes off the stock, which turns a marketplace listing decision into a real P&L negotiation — and its store network is large enough that terms can be set by geography rather than nationally. It ranks last only because the interaction count is small and the agent needs commercial write authority, which is the slowest permission any buying organisation grants.",
        scores: { economic: 4, volume: 1, suitability: 3, ease: 2, differentiation: 4 },
      },
    ],
    openers: [
      "You have already taken reactive support off the table with Nugget, so I am not here to sell you deflection. The money you have not touched is upstream of it: the twenty seconds between a picker not finding an item and a customer being told about it. Under 1P that gap is your gross margin, not a seller's.",
      "You are opening roughly two hundred dark stores a quarter, and the newest stores generate the most substitutions and cancellations at exactly the moment you are trying to prove their contribution. An agent that manages the fulfilment gap makes your store-opening curve cheaper, not just your support queue.",
      "Nobody else in India can see a restaurant's demand and supply its kitchen in the same company. Right now Hyperpure sells that restaurant on a call rotation. What if the reorder conversation started from the outlet's own Zomato order mix, in the owner's language, before he ran out?",
    ],
    discovery: [
      "Across Blinkit, Zomato, Hyperpure and District, how many interactions a month happen outside Nugget — outbound calls to restaurants, WhatsApp threads with brands, city ops chasing a store launch — and who owns each of those lines today?",
      "When a dark store cannot fill a line item, what actually happens today: silent short-ship, human call, or post-delivery refund? What does that cost per thousand orders now that you own the inventory, and who is accountable for the number?",
      "Where would you draw the line on an agent acting without a human in the loop — is it allowed to issue a credit, place a Hyperpure order, or commit trade terms to a brand, and what limit would make you comfortable in each case?",
    ],
    pilot: {
      workflow: "Fulfilment gap rescue on Blinkit, scoped to a single city cluster of newly opened dark stores.",
      weeks: "8-10 weeks",
      why: "It is the highest-value workload and the easiest to measure honestly: cancellations, accepted substitutions and credit cost per thousand orders are already instrumented, and a single-city cluster of new stores gives a high shortfall rate against a clean control group. Starting with substitution-only authority and adding credit-issuing authority in the back half lets Eternal see the agent's judgement before it hands over the refund ledger.",
    },
  },
  {
    slug: "swiggy",
    name: "Swiggy Ltd",
    shortName: "Swiggy",
    category: "Food delivery, quick commerce & dining out",
    group: "food-quick-commerce",
    color: "#FC8019",
    oneLiner:
      "A single-app, multi-vertical consumer platform where food delivery, Instamart quick commerce, Dineout table booking and the Swiggy One membership are deliberately bundled around one user, one wallet and one delivery fleet.",
    whyTop10:
      "Swiggy is the only Indian consumer company running food delivery, quick commerce and dining reservations as one membership-led product rather than a holding company of apps, and it did so through a public listing that put its unit economics under quarterly scrutiny. It reaches roughly 19 mn monthly food-delivery users, works with over 2.6 lakh restaurants, and operates one of the country's largest gig delivery fleets across 600+ cities.",
    snapshot: [
      { label: "Food delivery scale", value: "GOV INR 9,490 cr in Q1 FY27; 1.92 cr monthly transacting users", kind: "fact" },
      { label: "Instamart network", value: "1,171 dark stores across 131 cities (Jun 2026)", kind: "fact" },
      { label: "Quick commerce turn", value: "Instamart hit contribution breakeven in May 2026; CM +440 bps to 0.2%", kind: "fact" },
      { label: "Group P&L", value: "Q1 FY27 revenue INR 6,812 cr, +37% YoY; net loss narrowed 34% to INR 791 cr", kind: "fact" },
      { label: "Membership leverage", value: "~80% of Swiggy One members use two or more services and spend 3x non-members", kind: "fact" },
    ],
    whyItMatters:
      "Swiggy's entire thesis is that one membership across four verticals is worth more than four separate apps — and its own disclosure proves it, because multi-service members spend three times what single-service users do. That makes the highest-value conversations at Swiggy cross-vertical and outbound: moving a food-only member into Instamart, saving a renewal before it lapses, filling a Dineout table with delivery-order intent. On the supply side, Swiggy's long-standing investment in delivery-partner tooling is now a defensive necessity, because gig-worker availability is the binding constraint on fulfilment during seasonal troughs. Neither of those is a support workload. Both are agent workloads that need to reason over policy and act in payment and membership systems.",
    context: [
      {
        text: "In Q4 FY26 Swiggy's food delivery GOV grew 22.6% to INR 9,005 cr, its fastest in 15 quarters, and the business crossed INR 1,000 cr in annual adjusted EBITDA while group revenue rose 45% to INR 6,383 cr.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Instamart reached contribution breakeven in May 2026, with contribution margin improving 440 bps to 0.2% and the network at 1,171 dark stores in 131 cities. Quick-commerce revenue grew 53% while the segment loss narrowed 18%.",
        kind: "fact",
        source: 1,
      },
      {
        text: "Instamart started later than Blinkit and runs roughly half its store count, so Swiggy's route to density runs through converting its own existing food-delivery base inside each new catchment rather than out-building the market.",
        kind: "inference",
      },
      {
        text: "Around 80% of Swiggy One members use two or more services and spend about 3x non-members, and Swiggy has extended the ladder upward with the invite-only One BLCK tier. The membership is the mechanism that makes the multi-vertical app pay.",
        kind: "fact",
        source: 2,
      },
      {
        text: "Swiggy has kept building out Dineout as a distinct dining product, including a 2026 partnership with Eat App to give restaurants reservation management and promotion tooling — a supply-side investment in table inventory rather than events.",
        kind: "fact",
        source: 3,
      },
      {
        text: "Gig-worker availability across Indian quick commerce fell by an estimated 10-12% during 2026 seasonal troughs, pushing platforms to raise bonuses and shift users to scheduled slots. For a company whose fleet spans 600+ cities, partner retention economics are a first-order fulfilment problem, not an HR one.",
        kind: "fact",
        source: 4,
      },
    ],
    sources: [
      {
        label: "Swiggy Q4 FY26 press release: food delivery GOV, Instamart and group results",
        url: "https://www.swiggy.com/corporate/press-release/swiggys-food-delivery-gov-grew-22-6-yoy-with-inr-1000-cr-in-adjusted-ebitda-overall-revenue-surges-45-to-inr-6383-cr-losses-narrow-by-inr-281-cr-yoy/",
      },
      {
        label: "Business Standard: Swiggy Q1 FY27 results and Instamart contribution breakeven",
        url: "https://www.business-standard.com/companies/quarterly-results/swiggy-q1fy27-loss-revenue-results-126073000993_1.html",
      },
      {
        label: "Swiggy: launch of One BLCK invite-only premium membership",
        url: "https://www.swiggy.com/corporate/press-release/swiggy-launches-one-blck-an-invite-only-premium-membership/",
      },
      {
        label: "TechCrunch: Eat App partners with Swiggy on restaurant reservations",
        url: "https://techcrunch.com/2026/01/20/eat-app-wants-a-bite-of-indias-restaurant-reservation-business-with-an-acquisition-and-swiggy-partnership/",
      },
      {
        label: "Asia Business Outlook: gig worker shortage hits Indian quick commerce",
        url: "https://www.asiabusinessoutlook.com/news/gig-worker-shortage-hits-quick-commerce-in-india-nwid-11673.html",
      },
    ],
    useCases: [
      {
        id: "swiggy-one-renewal-save",
        rank: 1,
        name: "Swiggy One renewal save that repairs the value equation before it lapses",
        audience: "customer",
        lifecycle: "retain",
        econ: "both",
        current:
          "Members renew or lapse on a date. A member who joined for food delivery and never used Instamart or Dineout accrues less saving than the fee, sees no reason to renew, and churns silently. Retention today is a broad discount campaign fired at everyone approaching renewal, which pays money to members who would have stayed anyway.",
        agentic:
          "Weeks before renewal the agent computes each member's realised saving against their fee and diagnoses why the bundle is underperforming for them — wrong vertical mix, a bad delivery experience that stopped Instamart use, a tier mismatch. It picks the single intervention most likely to restore value for that person, constructs it inside a margin budget, and delivers it as a conversation rather than a coupon: it explains what they saved, proposes the change, answers the objection, then executes it — switching tier, applying credits, activating a benefit, or scheduling a first Instamart order — directly in the membership and billing systems.",
        trigger: "Renewal window opens, or realised-saving-to-fee ratio crosses a risk threshold mid-term.",
        systems: [
          "Membership and subscription billing",
          "Cross-vertical order history (food, Instamart, Dineout)",
          "Payments and credits ledger",
          "Offer and margin budgeting engine",
          "Complaint and service history",
        ],
        channels: ["App", "WhatsApp", "Email", "Outbound voice for high-value and BLCK tiers"],
        outcomes: [
          "Higher renewal rate among single-vertical members",
          "More members active in two or more services",
          "Lower discount cost per member saved",
        ],
        whyThisCompany:
          "Swiggy has stated the economics itself: multi-service members spend roughly three times non-members. That makes the renewal conversation the highest-leverage moment in the entire business, and it is a reasoning problem — which of four verticals to activate for this specific person — not a messaging problem. Eternal has no equivalent, because its verticals sit in separate apps with no single bundled membership binding them.",
        scores: { economic: 5, volume: 4, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "swiggy-partner-earnings",
        rank: 2,
        name: "Delivery-partner earnings adjudication and pre-churn shift recovery",
        audience: "partner",
        lifecycle: "retain",
        econ: "cost",
        current:
          "A partner disputes a payout — a long-distance trip paid short, waiting time not counted, an order cancelled at the restaurant, an incentive slab missed by one delivery. It goes to a ticket queue or a city office visit, takes days, and resolves with a flat explanation. Unresolved payout disputes are the loudest grievance in the fleet and a leading indicator of a partner going inactive.",
        agentic:
          "The agent adjudicates the claim end to end in the partner's own language, by voice: it pulls the trip log, GPS trace, restaurant dwell time and cancellation cause, reasons over the payout policy, and either corrects the payout and credits it immediately or explains precisely which condition was not met with the evidence. It then watches for the second-order signal — a partner whose logged hours are collapsing — and proactively negotiates a return with a shift pattern and incentive plan built for that partner's history and city, within an authorised cost ceiling.",
        trigger: "Payout dispute raised, or a partner's active hours fall materially below their own baseline.",
        systems: [
          "Partner payout and incentive engine",
          "Trip, GPS and dwell-time telemetry",
          "Shift and supply-planning system",
          "Partner profile, tenure and rating",
          "Payments disbursal",
        ],
        channels: ["Outbound and inbound voice in regional languages", "Partner app", "WhatsApp"],
        outcomes: [
          "Faster payout dispute resolution and fewer repeat contacts",
          "Higher weekly active partner retention in stressed cities",
          "Lower blanket surge and bonus spend to cover supply gaps",
        ],
        whyThisCompany:
          "Swiggy has invested longer and deeper in delivery-partner tooling than anyone in the category, and its fleet spans 600+ cities across both food delivery and Instamart, which means one partner's earnings question crosses two business lines. With gig availability falling 10-12% in seasonal troughs, holding an experienced partner is materially cheaper than buying a new one with bonuses — and the payout conversation is where that partner decides.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "swiggy-kitchen-capacity",
        rank: 3,
        name: "Peak-hour kitchen capacity negotiation with the outlet before orders break",
        audience: "merchant",
        lifecycle: "transact",
        econ: "both",
        current:
          "During peak the outlet is swamped. Prep times blow out, items get marked unavailable in bulk, orders are rejected, and riders idle at the counter. The platform finds out through breached promise times and customer complaints, and the restaurant finds out through a payout deduction it did not expect — which is precisely the grievance driving restaurant associations to threaten boycotts.",
        agentic:
          "When live signals show an outlet drifting past its committed prep time, the agent calls the kitchen, establishes what is actually happening in a thirty-second conversation, and acts: it adjusts the outlet's live prep time, selectively pauses the dishes the kitchen cannot make instead of letting staff blanket-disable the menu, holds rider assignment to stop idle waiting, and re-plans affected customer orders with an honest revised time or an alternative. Afterwards it walks the outlet through exactly which orders were affected and why, so the payout conversation is settled before the invoice.",
        trigger: "Live prep-time drift, a spike in item unavailability, or a cluster of rejections at one outlet.",
        systems: [
          "Restaurant partner menu and availability",
          "Live order and prep-time telemetry",
          "Rider assignment and routing",
          "Merchant payouts and deduction rules",
          "Customer order management",
        ],
        channels: ["Outbound voice to the outlet", "Merchant app", "WhatsApp", "Customer app notifications"],
        outcomes: [
          "Fewer breached promise times and order rejections at peak",
          "Reduced rider idle time at restaurant counters",
          "Fewer merchant payout disputes arising from peak-hour failures",
        ],
        whyThisCompany:
          "Swiggy has pushed hardest on fast-delivery formats from partner kitchens, which makes committed prep time a contractual promise rather than an estimate, and its restaurant relationships are under active strain over payout transparency and cancellation policy. Handling the failure with the outlet, in the moment, is a relationship instrument. That said, order-failure prevention is the workflow every aggregator in the market is building, so it wins on volume and goodwill rather than on competitive distance.",
        scores: { economic: 4, volume: 4, suitability: 4, ease: 3, differentiation: 2 },
      },
      {
        id: "swiggy-dineout-yield",
        rank: 4,
        name: "Dineout empty-cover yield agent that sells the table using delivery intent",
        audience: "merchant",
        lifecycle: "convert",
        econ: "revenue",
        current:
          "A restaurant's table inventory is perishable in a way its menu is not: a Tuesday 8pm slot that goes unbooked is gone. Today restaurants set a static Dineout discount and hope, and the platform has no mechanism to sell a specific slot to a specific person at the moment it is about to expire.",
        agentic:
          "The agent tracks each outlet's booking pace against its own historical fill for that slot and day. When a block is heading empty, it builds a time-boxed offer inside the discount ladder the restaurant has pre-authorised, identifies nearby Swiggy users whose food-delivery history shows appetite for that cuisine and price point, and reaches out with a bookable proposition rather than a banner. It confirms the reservation, briefs the outlet on covers and timing, chases confirmation as the slot approaches, and reallocates a no-show's table to the next-best candidate.",
        trigger: "Slot fill rate falls below the outlet's own historical pace inside the booking window.",
        systems: [
          "Dineout reservations and table inventory",
          "Restaurant discount ladders and terms",
          "Food-delivery cuisine and price-point affinity",
          "Location and travel-time data",
          "Merchant billing",
        ],
        channels: ["App", "WhatsApp", "Push", "Outbound voice to the outlet"],
        outcomes: [
          "Higher covers per outlet on soft slots",
          "Less blanket discounting on slots that would have filled anyway",
          "More delivery-only users converted into first-time diners",
        ],
        whyThisCompany:
          "Dineout is the vertical where Swiggy's single-app design pays off most directly: the intent signal that sells a table lives in the same account as the delivery order history, with no cross-app identity problem to solve. Swiggy has kept investing in restaurant-side reservation tooling, which is what makes autonomous yield management possible — the agent needs a pre-authorised discount ladder to act inside, not a phone call to the manager each time.",
        scores: { economic: 3, volume: 3, suitability: 4, ease: 3, differentiation: 4 },
      },
      {
        id: "swiggy-instamart-catchment",
        rank: 5,
        name: "New Instamart catchment activation from the existing food-delivery base",
        audience: "customer",
        lifecycle: "acquire",
        econ: "revenue",
        current:
          "A new dark store opens and starts burning rent immediately. Activation today is a broad launch offer to the pincode, which buys discount-led first orders that do not repeat, and the store's assortment is set from a national template rather than what the catchment actually wants.",
        agentic:
          "For each new store the agent works the population that matters most — Swiggy food-delivery users inside the catchment who have never ordered Instamart. It reasons over each household's likely basket from their delivery behaviour, runs a sequenced conversation across app and WhatsApp built around a specific relevant basket rather than a flat discount, and adapts as early orders come in: it feeds the emerging demand pattern back to the category team as concrete add and drop recommendations for that store, and stops spending on segments that are not converting.",
        trigger: "A new Instamart dark store goes live, or an existing store's order density stalls below its ramp curve.",
        systems: [
          "Instamart store catalogue and catchment mapping",
          "Food-delivery user base and location",
          "Campaign and offer management",
          "Order density and ramp tracking",
          "Category and assortment planning",
        ],
        channels: ["App", "WhatsApp", "Push", "Email"],
        outcomes: [
          "Faster time from store go-live to target order density",
          "Higher repeat rate among activated first-time Instamart users",
          "Lower activation cost per retained customer",
        ],
        whyThisCompany:
          "Instamart started later and runs roughly half the store count of the market leader, so its path to density is conversion of its own captive food-delivery base rather than out-building rivals — an asset a pure-play quick-commerce competitor simply does not have. It ranks last because store-launch activation marketing is something every operator will automate, and the agent's authority here is promotional rather than transactional, which caps both the differentiation and the value.",
        scores: { economic: 3, volume: 3, suitability: 3, ease: 4, differentiation: 2 },
      },
    ],
    openers: [
      "Your own numbers say a member using two or more services spends three times a single-service user. So the most valuable conversation you have all year is the one before renewal — and today it is a discount fired at everyone. What if it were an agent that worked out why the bundle stopped being worth it for that specific member, and fixed that?",
      "You have built more delivery-partner tooling than anyone in this market, and gig availability still drops double digits in the bad months. The payout dispute is where an experienced partner decides whether to keep riding for you. Right now that decision is made in a ticket queue.",
      "Instamart just crossed contribution breakeven on about half the store count of the leader. That means your growth has to come from density, not stores — and the people most likely to place a first Instamart order in a new catchment are already ordering dinner from you tonight.",
    ],
    discovery: [
      "Across food delivery, Instamart, Dineout and the partner fleet, where does your outbound interaction volume actually sit today — renewal saves, partner payout calls, outlet calls at peak — and how much of it is people on phones versus templated messaging?",
      "What does a delivery-partner payout dispute cost you end to end today, counting the resolution time, the repeat contacts, and the probability that partner goes inactive in the following fortnight?",
      "If an agent could act without a human approving each step, what is the largest thing you would let it do unattended — change a membership tier, credit a partner's payout, pause a restaurant's dishes at peak — and what would have to be true for you to sign that off?",
    ],
    pilot: {
      workflow: "Swiggy One renewal save for single-vertical members, run in three metro markets across one full renewal cohort.",
      weeks: "8-12 weeks",
      why: "The cohort is well defined, the counterfactual is clean because renewal dates create a natural control group, and the outcome is measured in renewal rate and cost per save rather than a soft satisfaction metric. It also proves the hardest capability first — an agent reasoning over cross-vertical behaviour and then writing to the membership and credits systems — which is the same authority pattern the partner-payout and Dineout workflows will need next.",
    },
  },
];
