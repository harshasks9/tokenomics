import type { Company } from "../schema";

export const COMPANIES_COMMERCE: Company[] = [
  // ─── Meesho ───────────────────────────────────────────────────────────────
  {
    slug: "meesho",
    name: "Meesho Limited",
    shortName: "Meesho",
    category: "Value commerce & long-tail marketplace",
    group: "commerce",
    color: "#F43397",
    oneLiner:
      "A zero-commission horizontal marketplace that sells unbranded, low-ticket goods to tier-2/3/4 India and monetises the seller side through advertising, logistics and fulfilment rather than take rate.",
    whyTop10:
      "Meesho now runs the largest order count in Indian e-commerce and the fastest-growing seller base, but almost every unit of that volume is a low-value, cash-on-delivery, vernacular transaction where a single failed delivery destroys the margin on several successful ones. That is the exact shape of problem an agent that can reason and act is built for — and no other Indian platform has this combination of scale, thin unit economics and a first-time-online audience on both sides of the marketplace.",
    snapshot: [
      { label: "Annual transacting users", value: "264 million at close of FY26, up 33% YoY", kind: "fact" },
      { label: "Placed orders", value: "2,668 million in FY26, up 45% YoY", kind: "fact" },
      { label: "Annual transacting sellers", value: "Approximately 961,000, up 87% YoY", kind: "fact" },
      { label: "FY26 revenue from operations", value: "Rs 12,626 crore, up 34% YoY", kind: "fact" },
      { label: "Cash-on-delivery share", value: "About 72% of shipped orders in H1 FY26", kind: "fact" },
    ],
    whyItMatters:
      "Meesho's profit and loss is decided in the last mile and in the seller panel, not in the storefront. With roughly seven in ten shipped orders paid in cash and a buyer base that is frequently transacting online for the first time, the platform absorbs the cost of every address that cannot be found, every buyer who changes their mind at the door, and every listing a new seller wrote badly. Each of those events is a conversation — in Hindi, Bhojpuri, Telugu or Marathi — that today either does not happen or happens too late to change the outcome. An agent that can read the order history, judge the risk, hold that conversation in the buyer's own language and then write the decision back into the order, the address book and the seller's catalogue is not a service-cost story here. It is a direct contribution-margin story, and it compounds across two-and-a-half billion orders a year.",
    context: [
      {
        text: "Meesho listed on the NSE and BSE in December 2025 after an IPO that raised Rs 5,421 crore and was subscribed roughly 79 times, listing at about a 46% premium to the Rs 111 issue price. Public-market scrutiny now applies to every line of its contribution margin.",
        kind: "fact",
        source: 1,
      },
      {
        text: "The company reported Q4 FY26 revenue of Rs 3,646.98 crore, up 47% YoY, with net loss narrowing to Rs 166.35 crore and GMV of Rs 18,941 crore. Growth is not the question; converting order volume into contribution is.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Meesho's RHP flags heavy cash-on-delivery dependence as a risk: COD requires physical cash handling by fragmented last-mile partners and raises the incidence of unsuccessful deliveries where consumers refuse the parcel at the door, driving logistics cost and operational inefficiency.",
        kind: "fact",
        source: 4,
      },
      {
        text: "Valmo, Meesho's own logistics network, moved from roughly 22% of orders to more than half within a year, reaching around 15,000 pin codes through about 6,000 logistics partners. Owning the last mile means Meesho now owns the full cost of a return-to-origin rather than passing it to a third party.",
        kind: "fact",
        source: 3,
      },
      {
        text: "In 2026 Meesho launched Vaani, a generative-AI voice shopping assistant in Hindi and English aimed at users who find typing and filter-based interfaces hard; the company reported over 1.5 million users and a 22% higher conversion rate alongside a reduction in returns and cancellations, with more regional languages planned.",
        kind: "fact",
        source: 2,
      },
      {
        text: "Because Meesho charges sellers no commission, the seller-side economics run through advertising, fulfilment and logistics services. That makes seller productivity — how quickly a new seller lists well, prices sensibly and keeps returns low — a direct revenue input rather than a support cost, which is unusual among Indian marketplaces.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "Medianama — Meesho posts Rs 166 crore loss in Q4 FY26, revenue jumps 47%",
        url: "https://www.medianama.com/2026/05/223-meesho-posts-rs-166-crore-loss-q4-fy26-revenue-jumps-47/",
      },
      {
        label: "Medianama — Meesho files updated RHP for IPO to raise Rs 5,421 crore",
        url: "https://www.medianama.com/2025/12/223-meesho-ipo-rhp-filing-5421-crore/",
      },
      {
        label: "Storyboard18 — Meesho launches Vaani, Gen-AI voice assistant for conversational shopping",
        url: "https://www.storyboard18.com/brand-marketing/meesho-unveils-vaani-ai-voice-assistant-to-transform-india-shopping-ws-l-93095.htm",
      },
      {
        label: "Business Standard — Meesho's logistics arm Valmo handles 50% of orders",
        url: "https://www.business-standard.com/companies/start-ups/meesho-s-logistics-arm-valmo-handles-50-of-orders-doubling-from-last-year-125032601337_1.html",
      },
      {
        label: "INDmoney — Meesho IPO review: strengths, risks and COD dependence",
        url: "https://www.indmoney.com/blog/ipo/meesho-ipo-review",
      },
    ],
    useCases: [
      {
        id: "meesho-cod-dispatch-risk",
        rank: 1,
        name: "COD dispatch-risk interception and address repair",
        audience: "customer",
        lifecycle: "transact",
        econ: "cost",
        current:
          "A cash-on-delivery order is placed, picked, packed and shipped before anyone knows whether the address resolves or the buyer still wants it. Risk signals — a landmark-only address, a pin code with poor serviceability, a buyer with prior refusals, a size the buyer has returned twice before — exist in the data but are not acted on conversationally. The failure surfaces at the doorstep, and Meesho absorbs forward freight, return freight, handling and the seller's lost sale.",
        agentic:
          "Between order placement and dispatch the agent scores the order against address structure, pin-code and rider-level delivery history, buyer refusal and return history, order value and category. Where risk is material it initiates an outbound call or WhatsApp thread in the buyer's language: confirms the buyer still wants the item, reads back and repairs the address by asking the specific missing element rather than a generic re-entry, offers a delivery window, and where policy allows negotiates a prepaid conversion in exchange for a bounded incentive. It writes the corrected address to the address book, updates the order, re-routes or holds the shipment, and where the buyer has genuinely changed their mind cancels pre-dispatch — which costs a fraction of a return-to-origin. Unresolved high-risk orders are handed to the seller with the reason attached.",
        trigger:
          "Order confirmed and risk-scored above threshold, before manifest hand-off to Valmo or a third-party partner.",
        systems: [
          "Order management",
          "Address / geocoding and pin-code serviceability",
          "Valmo and 3PL delivery-attempt history",
          "Buyer refusal and return ledger",
          "Payments and prepaid-incentive policy engine",
          "Seller notification service",
        ],
        channels: ["voice", "WhatsApp", "app"],
        outcomes: [
          "Return-to-origin rate on COD orders",
          "First-attempt delivery success",
          "Contribution margin per delivered order",
        ],
        whyThisCompany:
          "With roughly 72% of shipped orders on cash on delivery and average ticket sizes low enough that a single RTO can wipe out the margin on several successful orders, Meesho's failed-delivery economics are structurally worse than a branded, prepaid-heavy marketplace. And because Valmo now carries more than half of volume, Meesho eats the full round-trip cost rather than passing it to a courier. This is the single largest pool of avoidable cost on the platform, and it is only addressable through a conversation the buyer can actually have — spoken, vernacular, and completed in one exchange.",
        scores: { economic: 5, volume: 5, suitability: 5, ease: 2, differentiation: 4 },
      },
      {
        id: "meesho-listing-coach",
        rank: 2,
        name: "Vernacular listing coach for first-time sellers",
        audience: "merchant",
        lifecycle: "onboard",
        econ: "revenue",
        current:
          "A tailor in Surat or a housewares trader in Meerut registers, photographs stock on a phone against a cluttered background, types a title in transliterated Hindi and guesses at category, size chart and price. The catalogue goes live, converts poorly, attracts returns for wrong size or colour mismatch, and the seller concludes that online does not work. Written self-serve help articles do not reach a seller who does not read English comfortably.",
        agentic:
          "The seller sends product photos to a WhatsApp thread. The agent looks at the images and critiques them concretely — background clutter, cropping, missing back view, colour cast that will cause colour-mismatch returns — and asks for the specific reshoot it needs. It extracts attributes from the image and the seller's spoken description, drafts a searchable title, description, size chart and attribute set in the right category, benchmarks price against comparable live listings, flags GST and category-compliance gaps, and writes the finished listing into the seller panel for approval. It then watches the catalogue's first weeks and re-opens the conversation when a specific SKU shows weak click-through or an early return cluster, with a named fix rather than a generic tip.",
        trigger:
          "Seller completes registration, uploads a first catalogue, or an existing catalogue crosses a quality or early-return threshold.",
        systems: [
          "Seller panel and catalogue service",
          "Image understanding and attribute extraction",
          "Category taxonomy and size-chart library",
          "Pricing and competitive-listing index",
          "Search click-through and conversion analytics",
          "GST / compliance validation",
        ],
        channels: ["WhatsApp", "voice", "multimodal", "app"],
        outcomes: [
          "Time from registration to first sale",
          "Catalogue quality score and search click-through",
          "90-day seller survival and ad-spend adoption",
        ],
        whyThisCompany:
          "Meesho added sellers at roughly 87% YoY to reach about 961,000 annual transacting sellers, and because it charges zero commission it earns nothing from a seller until that seller sells, advertises and ships. A first-time seller who never gets a good listing live is pure acquisition cost. No competitor has both this volume of genuinely first-time, non-English sellers and a monetisation model that depends entirely on their productivity — which makes a multimodal coach that can look at the actual photograph and fix the actual listing a revenue instrument, not a support function.",
        scores: { economic: 4, volume: 4, suitability: 5, ease: 3, differentiation: 5 },
      },
      {
        id: "meesho-voice-guided-shopping",
        rank: 3,
        name: "Voice-first guided shopping for first-time online buyers",
        audience: "customer",
        lifecycle: "convert",
        econ: "revenue",
        current:
          "A buyer who has never used filters faces a grid of near-identical unbranded listings and no way to ask the questions they would ask a shopkeeper — will this fabric suit summer, will this fit my mother, is this seller reliable, what happens if it does not fit. Vaani has proved the appetite for a spoken interface, but a search assistant that returns results still leaves the buyer to judge trust, size and suitability alone.",
        agentic:
          "The agent runs the conversation a kirana shopkeeper would: asks what the item is for, who will wear or use it, budget, and the one attribute that matters most. It reasons over listing attributes, seller return rates and review text to shortlist three options and says out loud why each one, including the trust argument. It handles objections on price, fabric, sizing and returns, converts the buyer's own measurements or a reference garment into a size recommendation, captures the delivery address by voice with structured prompting, and places the order. Where it detects a size or suitability risk it says so before checkout rather than letting the return happen.",
        trigger:
          "Buyer opens the voice surface, or a session shows repeated unproductive scrolling in a high-return category.",
        systems: [
          "Catalogue and attribute index",
          "Speech recognition and synthesis in Indic languages",
          "Seller quality and return-rate signals",
          "Review and Q&A corpus",
          "Size recommendation service",
          "Checkout and address capture",
        ],
        channels: ["voice", "app", "WhatsApp"],
        outcomes: [
          "Conversion rate for low-digital-literacy cohorts",
          "Size and suitability driven return rate",
          "New-user second-order rate",
        ],
        whyThisCompany:
          "Meesho has already shown this works on its own base — Vaani reached over 1.5 million users with a reported 22% conversion uplift and fewer returns and cancellations. The unmet part is the step beyond search: the reasoning, objection-handling and pre-emptive size warning that turn a spoken query into a completed, low-return order across the regional languages still on the roadmap. The economics are unusually favourable here because the same conversation raises conversion and suppresses the return that would have destroyed the margin.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 4, differentiation: 2 },
      },
      {
        id: "meesho-return-forensics",
        rank: 4,
        name: "Return-reason forensics and catalogue correction loop",
        audience: "customer",
        lifecycle: "service",
        econ: "both",
        current:
          "A buyer selects a coarse return reason from a dropdown — most often the least effortful one — and the parcel comes back. The real cause, whether the listing photo overstated the colour, the size chart was copied from another SKU, the item arrived damaged, or a different item was shipped entirely, is never established. Nothing downstream changes, so the same listing generates the same return next week and the seller is judged on an aggregate number they cannot decompose.",
        agentic:
          "On return initiation the agent asks the buyer for a photo of what they actually received, plus the packaging where damage is claimed. It compares that image against the listing imagery and the seller's dispatch record to classify the true cause — colour or fabric mismatch, wrong variant shipped, transit damage, size-chart error, or genuine change of mind. Where the item is correct it attempts a save with an exchange in the right size or shade rather than a refund. Where the fault is in the listing it writes the finding into the catalogue record, opens a correction task with the seller in their language with the specific evidence attached, and where a pattern emerges across orders it suppresses the SKU pending fix. Where transit damage is established it files the packaging or partner claim itself.",
        trigger:
          "Return or replacement request raised, or a SKU crosses a return-rate threshold within a rolling window.",
        systems: [
          "Returns and refunds workflow",
          "Image comparison against catalogue assets",
          "Seller quality scoring and catalogue service",
          "Valmo damage and packaging claims",
          "Exchange and inventory availability",
        ],
        channels: ["app", "WhatsApp", "multimodal", "voice"],
        outcomes: [
          "Repeat-return rate on corrected SKUs",
          "Refund-to-exchange conversion",
          "Accuracy of seller quality attribution",
        ],
        whyThisCompany:
          "In apparel-heavy, unbranded, low-AOV assortments the return is the defect — and Meesho's returns are concentrated in exactly the categories where a photograph settles the argument instantly. Because sellers face visibility and COD restrictions when their return rates run high, mis-attributed returns are not just a cost line, they penalise the wrong sellers and push good supply off the platform. Closing the loop from a buyer's photo back to a corrected size chart is a structural fix no competitor with branded, standardised inventory needs as badly.",
        scores: { economic: 4, volume: 4, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "meesho-settlement-disputes",
        rank: 5,
        name: "Settlement reconciliation and seller payout dispute closure",
        audience: "merchant",
        lifecycle: "collect",
        econ: "cost",
        current:
          "A seller sees a payout that does not match what they expected and cannot tell whether the gap came from return adjustments, shipping and weight-discrepancy deductions, advertising spend, penalties or a timing difference. They message support, get a template reply pointing at a downloadable statement they cannot parse, and escalate repeatedly. Trust in the zero-commission promise erodes precisely where it is most visible.",
        agentic:
          "On the seller's query the agent reconciles the payout line by line against orders shipped, returns adjusted, weight-discrepancy charges, ad ledger and penalty events, and explains the delta in the seller's language as a short narrative rather than a spreadsheet. Where a charge is defensible it shows the underlying evidence, including the weight-discrepancy image where one exists. Where the deduction is wrong under policy it raises and resolves the claim end to end, issues the credit within its authority band, and confirms the corrected settlement date. It proactively opens the conversation before the next cycle where it detects a recurring deduction pattern the seller can fix at source.",
        trigger:
          "Seller raises a payment query, or a settlement cycle produces a delta beyond tolerance against the seller's expected payout.",
        systems: [
          "Settlement and payouts ledger",
          "Returns and adjustments engine",
          "Weight-discrepancy and logistics billing",
          "Advertising spend ledger",
          "Credit-note and claims workflow",
        ],
        channels: ["WhatsApp", "voice", "app", "email"],
        outcomes: [
          "Payment-dispute resolution time",
          "Repeat contacts per settlement cycle",
          "Seller retention among small suppliers",
        ],
        whyThisCompany:
          "Zero commission is Meesho's core promise to sellers, which makes every unexplained deduction a credibility event rather than a routine billing query. With roughly 961,000 annual transacting sellers, most of them small and many new, the volume of these conversations scales with the seller base rather than with revenue. It scores lower than the others here because the agent needs write access to the settlement ledger and the reasoning is closer to reconciliation than judgement — but it is the workflow sellers talk about most.",
        scores: { economic: 3, volume: 4, suitability: 3, ease: 1, differentiation: 3 },
      },
    ],
    openers: [
      "You now own more than half your last mile through Valmo, which means every failed COD delivery is a cost you pay twice and no longer share with a courier. If an agent could call the buyer in their own language before dispatch, fix the address and convert the wobbly ones to prepaid, what would a two-point move in RTO be worth against 2.7 billion orders?",
      "You added sellers at 87% last year and you earn nothing from any of them until they actually sell. What is your current cost of a seller who registers, lists badly and never trades — and what would change if a multimodal agent looked at their phone photos and wrote the listing for them in Bhojpuri?",
      "Vaani proved your buyers will talk to a machine — 1.5 million users and 22% better conversion. The interesting question is what happens when the same voice surface stops recommending and starts acting: changing the address, cancelling before dispatch, booking the exchange instead of the refund.",
    ],
    discovery: [
      "Across COD orders today, how many pre-dispatch or in-transit buyer contacts do you attempt per month, through which channel, and what proportion are actually completed in the buyer's preferred language rather than abandoned?",
      "When an agent needs to change an outcome — repair an address, cancel pre-dispatch, convert a refund to an exchange, or issue a settlement credit — which of those can be written back into your systems by an API today, and which still require a human in the seller or ops console?",
      "What is your internal view of the contribution-margin gap between a delivered order and an RTO at your current average ticket, and who owns the target for closing it?",
    ],
    pilot: {
      workflow:
        "COD dispatch-risk interception on a single high-RTO apparel category in three states, running the full loop: risk score, vernacular outbound call, address repair or prepaid conversion or pre-dispatch cancellation, and write-back to the order and address book. Run against a held-out control cohort.",
      weeks: "10 weeks",
      why: "It attacks the largest avoidable cost on the platform, the outcome is measurable in weeks because RTO resolves within a shipping cycle, and a single category in three states bounds the integration to one order-management write path and one language pair before scaling across the network.",
    },
  },

  // ─── Nykaa / FSN E-Commerce ───────────────────────────────────────────────
  {
    slug: "nykaa",
    name: "FSN E-Commerce Ventures Limited",
    shortName: "Nykaa",
    category: "Beauty & fashion omnichannel retail",
    group: "commerce",
    color: "#FC2779",
    oneLiner:
      "An inventory-led beauty and fashion retailer that buys directly from brands and sells through an app, a 300-plus store network, a quick-commerce arm and its own House of Nykaa labels — competing on curation, authenticity and advice rather than on price.",
    whyTop10:
      "Nykaa is the rare Indian digital native whose margin comes from persuasion, not logistics. Beauty is a high-consideration, repeat-purchase, advice-hungry category where the customer arrives with a question a shade grid cannot answer, and Nykaa is the only player that holds the inventory, the store network, the owned brands and the loyalty history needed to answer it and act on the answer in one motion. It is also the clearest commercial case in Indian retail for a genuinely multimodal agent: the customer already has the photograph in their hand.",
    snapshot: [
      { label: "FY26 GMV", value: "Rs 19,963 crore, up 28% YoY", kind: "fact" },
      { label: "FY26 revenue from operations", value: "Rs 10,022 crore, crossing the $1 billion mark", kind: "fact" },
      { label: "Physical store network", value: "313 stores across 99 cities, 76 added in FY26", kind: "fact" },
      { label: "House of Nykaa owned brands", value: "Rs 872 crore GMV in Q3 FY26, up 48% YoY", kind: "fact" },
      { label: "Cumulative beauty customers", value: "More than 42 million as of Q3 FY26, up 30% YoY", kind: "fact" },
    ],
    whyItMatters:
      "Every economic lever Nykaa is pulling right now depends on a conversation someone is not having at scale. Owned brands grew 48% YoY but they win by being recommended, not by being searched for. The store network crossed 313 outlets but the customer standing in one cannot see online stock and the customer online cannot see the shelf. Nykaa Now promises beauty in 30 to 60 minutes but only in the cities where demand has been correctly predicted. Authenticity is the entire reason luxury brands sign exclusive online partnerships with Nykaa, and it is defended today by warehouse process rather than by an answer the customer can see. A multimodal agent that can look at a photograph of a customer's skin, a shade they already own or a batch code on a bottle, reason over their purchase history and Prive tier, check what is physically on a shelf twelve kilometres away, and then complete the transaction is not an efficiency play at Nykaa. It is the beauty advisor the company already employs in 313 stores, extended to 42 million customers.",
    context: [
      {
        text: "FY26 revenue from operations rose 26% to Rs 10,022 crore and GMV rose 28% to Rs 19,963 crore. Q4 FY26 revenue grew 28% YoY to Rs 2,648 crore — described as the strongest growth in twelve quarters — with consolidated net profit up about 290% to Rs 78 crore.",
        kind: "fact",
        source: 0,
      },
      {
        text: "House of Nykaa, the owned-brand portfolio spanning makeup, skincare, fragrance and clean beauty, delivered Rs 872 crore of GMV in Q3 FY26 at an annualised run rate of about Rs 3,500 crore, growing 48% YoY — materially faster than the platform.",
        kind: "fact",
        source: 1,
      },
      {
        text: "Nykaa added 76 stores in FY26 to reach 313 across 99 cities, with management indicating similar additions in FY27 against an earlier ambition of roughly 500 stores over three to four years. Physical retail is a growth engine, not a legacy channel.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Nykaa Now, the quick-commerce vertical promising 30-to-60-minute beauty delivery, operates in 13 cities and in 2026 hired a former Swiggy Instamart COO to lead it, with stated plans to use AI-driven demand forecasting to optimise micro-fulfilment.",
        kind: "fact",
        source: 2,
      },
      {
        text: "The inventory-led model — buying directly from brands into Nykaa-controlled warehouses — is why premium and luxury houses use Nykaa as a primary or exclusive online partner in India: they will not sell where grey-market sellers can undercut and counterfeits can circulate.",
        kind: "fact",
        source: 3,
      },
      {
        text: "Because the same customer buys a serum, a shade of foundation and a fragrance on different cycles, and because Prive points and tier status create a deadline the customer forgets, the highest-value conversation at Nykaa is almost never inbound. It has to be started by the retailer at the right moment, which is a scheduling and reasoning problem rather than a service-queue problem.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "Business Standard — Nykaa Q4 FY26 profit jumps more than 300% to Rs 79 crore, revenue up 28.4%",
        url: "https://www.business-standard.com/companies/quarterly-results/nykaa-q4fy26-profit-jumps-more-than-300-to-79-cr-revenue-up-28-4-126052101502_1.html",
      },
      {
        label: "Upstox — FSN E-Commerce (Nykaa) Q3 FY26 results: net profit more than doubles, revenue up 27%",
        url: "https://upstox.com/news/market-news/earnings/fsn-e-commerce-ventures-nykaa-q3-results-net-profit-soars-142-yo-y-to-63-crore-revenue-up-27/article-189010/",
      },
      {
        label: "Business Standard — Nykaa appoints Ankit Jain to lead quick-commerce vertical Nykaa Now",
        url: "https://www.business-standard.com/companies/news/nykaa-appoints-ankit-jain-to-lead-quick-commerce-vertical-126072800728_1.html",
      },
      {
        label: "Acheron Research — Nykaa: India's beauty platform playbook (inventory-led model and brand exclusivity)",
        url: "https://acheronresearch.substack.com/p/nykaa",
      },
      {
        label: "Nykaa Affiliate Programme (NAP) — creator community scale",
        url: "https://affiliate.nykaa.com/",
      },
    ],
    useCases: [
      {
        id: "nykaa-multimodal-consult",
        rank: 1,
        name: "Multimodal beauty consultation that closes the regimen",
        audience: "customer",
        lifecycle: "convert",
        econ: "revenue",
        current:
          "A customer who wants to know which foundation matches her jawline, whether her breakouts need a niacinamide or a retinoid, or which shade of the discontinued lipstick she loved is closest, gets a filter grid, a virtual try-on overlay and a review section. In a store a beauty advisor would look at her face, ask three questions and hand her four products. Online that expertise stops at the point where a decision has to be made, and the customer either abandons or buys one item instead of a regimen.",
        agentic:
          "The customer sends a photograph — her bare skin in daylight, a swatch on her wrist, the back of a product she already uses, or a screenshot of a look she wants. The agent reads undertone, visible concern and current product from the image, then asks the two or three clarifying questions a trained advisor would ask about routine, sensitivity, climate and budget. It reasons over her purchase history, Prive tier, prior returns and what is actually in stock across the app, Nykaa Now and nearby stores, then proposes a sequenced regimen with named shade codes and an order of application, states plainly which items are House of Nykaa and why, applies eligible offers and points, and places the order. Where it is not confident from a photo — a medicated skin condition, an unusual undertone — it books an in-store advisor appointment and passes its notes forward rather than guessing.",
        trigger:
          "Customer uploads a photo or opens a consultation, or a high-consideration category browse stalls without an add-to-cart.",
        systems: [
          "Image understanding and shade / undertone analysis",
          "Product catalogue with shade, ingredient and concern taxonomy",
          "Customer purchase, return and Prive history",
          "Inventory across warehouses, Nykaa Now dark stores and retail",
          "Offers and loyalty engine",
          "Store appointment booking",
          "Checkout",
        ],
        channels: ["multimodal", "app", "WhatsApp", "chat"],
        outcomes: [
          "Basket size and units per order in beauty",
          "Consultation-to-purchase conversion",
          "Owned-brand attach rate and shade-related return rate",
        ],
        whyThisCompany:
          "Nykaa is the only Indian retailer with all four inputs this needs in one place: 42 million beauty customers with attributed purchase history, an owned-brand portfolio growing at 48% that benefits directly from being recommended in context, real inventory it controls, and 313 stores to escalate into when a photograph is not enough. A marketplace that does not own inventory cannot promise the regimen is available; a pure-play app without stores cannot hand off. This is the workflow that turns Nykaa's curation claim into a measurable basket.",
        scores: { economic: 5, volume: 4, suitability: 5, ease: 3, differentiation: 5 },
      },
      {
        id: "nykaa-replenishment-prive",
        rank: 2,
        name: "Regimen replenishment and loyalty-point rescue",
        audience: "customer",
        lifecycle: "retain",
        econ: "revenue",
        current:
          "A 30ml serum bought in March runs out in June and the customer buys her next one wherever she happens to be looking that week. Prive points accrue and lapse without the customer noticing, and tier thresholds are missed by small margins nobody tells her about. Blanket replenishment reminders go out on a fixed cadence regardless of whether the product worked, which is why they are ignored.",
        agentic:
          "The agent models depletion per SKU from pack size, stated usage and observed reorder behaviour, then opens the conversation at the point of run-out rather than on a calendar. It asks whether the regimen actually worked and will accept a photograph to compare against the one taken at purchase, adjusting the recommendation where the concern has changed or the product clearly has not delivered. It surfaces the customer's expiring points and how far she is from the next Prive tier as a concrete reason to act now, proposes the reorder including any House of Nykaa equivalent where it is genuinely a better fit, applies the points, and completes the order — or routes it to Nykaa Now where she is in one of the served cities and wants it today.",
        trigger:
          "Modelled depletion date for a consumable, points nearing expiry, or a tier threshold reachable within the current basket.",
        systems: [
          "Purchase history and SKU pack-size / usage model",
          "Prive loyalty ledger and tier engine",
          "Product substitution and ingredient equivalence graph",
          "Nykaa Now serviceability",
          "Image comparison for progress checks",
          "Checkout and offers",
        ],
        channels: ["WhatsApp", "app", "multimodal", "email"],
        outcomes: [
          "Repeat-purchase rate on consumables",
          "Points redeemed before expiry and tier progression",
          "Annual spend per beauty customer",
        ],
        whyThisCompany:
          "Beauty is a consumable category with predictable depletion and a loyalty programme that already creates a deadline, and Nykaa owns both the consumption history and the substitute product. The economic value is concentrated in the 42 million-strong beauty base where a single recovered replenishment cycle per customer per year moves GMV materially. It ranks below the consultation because the reasoning is narrower and much of it is scheduled rather than open-ended — but it is the most reliable revenue the agent can produce.",
        scores: { economic: 4, volume: 4, suitability: 4, ease: 3, differentiation: 3 },
      },
      {
        id: "nykaa-store-stock-bopis",
        rank: 3,
        name: "Store-stock reservation and BOPIS orchestration",
        audience: "employee",
        lifecycle: "transact",
        econ: "both",
        current:
          "A customer wants a specific shade today. Online it is out of stock; three stores in her city have it on a shelf but nobody can see that in the same view, and no system will hold it for her. Store teams field ad-hoc calls and WhatsApp messages asking them to check a drawer, with no record and no reservation. The sale either leaks to a competitor or converts into a store visit that ends in disappointment.",
        agentic:
          "The agent resolves the request against live stock across warehouses, Nykaa Now dark stores and the 313-store network, ranks the options by real travel time and confidence in the stock record, and messages the specific store team to physically confirm and hold the unit — chasing until it gets a yes or a no rather than leaving an unanswered ping. It creates the reservation, gives the customer a pickup window and a named counter, and where the shade is genuinely unavailable proposes the closest verified alternative with the reason, or converts the order to a Nykaa Now delivery if she is in a served city. When a hold expires it releases the stock back and tells the store why, and it feeds systematic mismatches between recorded and physical stock back as a store-level accuracy signal.",
        trigger:
          "Out-of-stock event on a specific SKU or shade where store or dark-store inventory shows availability, or a customer requests store pickup.",
        systems: [
          "Omnichannel inventory across warehouse, dark store and retail",
          "Store task and staff messaging",
          "Reservation and hold service",
          "Order management and fulfilment routing",
          "Nykaa Now serviceability and slotting",
        ],
        channels: ["WhatsApp", "app", "voice", "chat"],
        outcomes: [
          "Out-of-stock sale recovery rate",
          "Store pickup fulfilment reliability",
          "Store-level inventory record accuracy",
        ],
        whyThisCompany:
          "Nykaa added 76 stores in a single year against an ambition of roughly 500, which means the gap between what the app knows and what is on a shelf gets wider every quarter, not narrower. Beauty makes this worse than general retail because demand is shade-level: a customer will not accept a near-miss on foundation the way she might on a t-shirt size. It scores lower on ease because the agent needs write access to reserve physical stock and must coordinate a human on a shop floor, and lower on volume because it fires only on stock-outs — but it is the workflow that makes the store expansion earn its rent.",
        scores: { economic: 4, volume: 3, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "nykaa-authenticity-triage",
        rank: 4,
        name: "Authenticity challenge triage with batch traceability",
        audience: "customer",
        lifecycle: "service",
        econ: "both",
        current:
          "A customer posts that her serum smells different or the packaging looks off, sometimes publicly before she contacts anyone. The reply is a policy statement about sourcing directly from brands, which reassures nobody and satisfies no brand partner. Genuine issues — a batch nearing expiry, a formulation or packaging change the customer was not told about, a damaged seal — get the same answer as unfounded ones, and neither the brand nor the warehouse learns anything.",
        agentic:
          "The agent asks for specific photographs — the batch code, the seal, the base of the pack, the texture — and compares them against the brand's current and previous packaging generations and known formulation changes. It traces the actual unit back through Nykaa's owned-inventory chain to the brand invoice, warehouse lot and receipt date, and answers the customer with that evidence rather than with a policy line: this is lot X, received from the brand on this date, and the packaging changed in this month, which is why it looks different. Where the concern is legitimate it completes the replacement or refund immediately, and where it detects a pattern across a lot it raises a quarantine on the remaining stock, notifies the brand partner with the evidence pack, and holds outbound shipments of that lot.",
        trigger:
          "Customer raises an authenticity, freshness or packaging-difference concern in any channel, including a public post picked up by social listening.",
        systems: [
          "Image comparison against brand packaging reference library",
          "Batch and lot traceability to brand invoice and warehouse receipt",
          "Returns, refunds and replacement workflow",
          "Inventory quarantine and hold controls",
          "Brand-partner case management",
          "Social listening",
        ],
        channels: ["multimodal", "WhatsApp", "app", "email"],
        outcomes: [
          "Time to evidence-backed resolution",
          "Lot-level defect detection lead time",
          "Retention of customers who raise a concern",
        ],
        whyThisCompany:
          "Authenticity is the reason luxury and premium houses give Nykaa primary or exclusive online distribution in India — they will not go where grey-market sellers operate. That makes an unanswered counterfeit accusation a brand-partnership risk, not a support ticket, and it is a risk a marketplace competitor structurally cannot answer because it does not own the chain of custody. Nykaa does, and can therefore prove the claim rather than assert it. Volume is low by design; the value is in defending the moat and in catching a bad lot before it ships.",
        scores: { economic: 3, volume: 2, suitability: 5, ease: 2, differentiation: 5 },
      },
      {
        id: "nykaa-creator-ops",
        rank: 5,
        name: "Creator brief matching and affiliate payout resolution",
        audience: "partner",
        lifecycle: "acquire",
        econ: "revenue",
        current:
          "Nykaa's creator programme runs on thousands of micro-influencers, and the coordination is manual: briefs are blasted to lists rather than matched, seeding goes to creators whose audience does not match the launch, deliverables are chased over DMs, and commission queries pile up at month end. The creators who matter most get the least attention because the team is absorbed by administration.",
        agentic:
          "For each brand launch the agent matches creators to the product on audience composition, skin type and shade range, past conversion rather than reach alone, and category credibility — and briefs each one in their own terms rather than sending a common deck. It negotiates within a published rate card, confirms the seeding shipment, tracks the deliverable and follows up with a specific ask when a post is late, and reconciles affiliate commissions against attributed orders so it can answer a payout query with the order-level evidence and release the payment where policy allows. It flags creators whose content consistently drives returns as well as sales, which reach-based reporting hides.",
        trigger:
          "New product launch or campaign brief created, seeding shipment dispatched, deliverable overdue, or a creator raises a commission query.",
        systems: [
          "Affiliate and creator CRM",
          "Audience and performance analytics per creator",
          "Seeding inventory and dispatch",
          "Attribution and commission ledger",
          "Payouts",
          "Content and deliverable tracking",
        ],
        channels: ["WhatsApp", "email", "chat", "voice"],
        outcomes: [
          "Revenue per creator engaged",
          "Deliverable completion and time-to-live for launches",
          "Commission dispute volume and payout cycle time",
        ],
        whyThisCompany:
          "Discovery in Indian beauty is creator-led, and Nykaa built its position on a very large micro-influencer network rather than a handful of celebrities — which means its creator operation is a long-tail coordination problem of exactly the kind an agent handles well, and exactly the kind a human team cannot scale linearly. It ranks last here because the population is small relative to the customer base, but it sits on the revenue side and directly supports the owned-brand launches driving the fastest growth in the company.",
        scores: { economic: 3, volume: 2, suitability: 4, ease: 3, differentiation: 4 },
      },
    ],
    openers: [
      "Your owned brands grew 48% last year and they grow by being recommended, not searched for. You employ that recommendation in 313 stores. What would it be worth to give the same advisor to all 42 million beauty customers — one who can actually look at the photo she just took of her skin and then build and place the basket?",
      "You added 76 stores in a year and you are heading toward 500. Right now a customer whose shade is out of stock online cannot see that it is sitting on a shelf twelve kilometres away, and no system will hold it for her. How much of that demand do you think leaks, and would you let an agent reserve physical stock to catch it?",
      "Every luxury brand that gives you exclusive online distribution is buying your chain of custody. When a customer says her serum smells wrong, you answer with a policy statement. What changes for those brand relationships when you can answer with the lot number, the brand invoice date and the packaging change that explains it — inside an hour?",
    ],
    discovery: [
      "How many beauty consultation or shade-match interactions do you handle a month across app, chat and in-store today, and what share of those end in a completed order rather than a recommendation the customer takes elsewhere?",
      "What does your store and dark-store inventory look like to a system in real time — can an external agent read shade-level stock and write a reservation against it, or does that still require a person on the shop floor to confirm?",
      "Which of these would you be comfortable letting an agent do without a human approving each one: apply Prive points, place a reorder, reserve store stock, issue a replacement on an authenticity claim, quarantine a lot? Where is the line, and who owns it?",
    ],
    pilot: {
      workflow:
        "Multimodal beauty consultation for foundation and complexion in one metro, running photo intake through to a placed order: undertone and concern read from the customer's image, regimen and shade recommendation reasoned against her purchase history and Prive tier, live stock checked across app, Nykaa Now and nearby stores, and the basket completed in-conversation with an advisor-appointment fallback.",
      weeks: "12 weeks",
      why: "Complexion is the highest-consideration, highest-return and highest-basket sub-category in beauty, so the effect on units per order and shade-related returns is visible within a quarter against a control cohort. Restricting it to one metro keeps the inventory read to a single fulfilment footprint while still exercising the app, quick-commerce and store paths that the full rollout depends on.",
    },
  },
];
