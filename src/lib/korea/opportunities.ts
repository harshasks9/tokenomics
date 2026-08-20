// Customer-facing opportunity map, future operating model, sequence and
// commercial shape for the Global Sae-A AX programme.

export type Opportunity = {
  id: string;
  name: string;
  subsidiary: string;
  problem: string;
  solution: string;
  googleStack: string[];
  metric: string;
  horizon: "Phase 1 · 60 days" | "Phase 2 · Q4 2026" | "Phase 3 · 2027";
  value: number; // 1-5, modelled business value
  effort: number; // 1-5, modelled implementation difficulty
  dependency?: string;
  accent: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "allocation",
    name: "Landed-Cost Allocation",
    subsidiary: "Sae-A Trading",
    problem:
      "Deciding which of 41 factories should take a Walmart or Target programme, and at what fully-landed cost, means assembling duty exposure, standard-minute data, capacity, lead time and freight by hand. Since 24 July the duty component of that answer can change faster than the answer can be produced.",
    solution:
      "An agent that reads the buyer's enquiry, retrieves current duty treatment by origin, pulls standard-minute and capacity data, and returns a ranked factory recommendation with a fully-landed cost and its working shown — so your commercial team can interrogate it rather than assemble it.",
    googleStack: ["Gemini Enterprise", "Enterprise Agents", "BigQuery", "Gemini Enterprise Agent Platform"],
    metric: "Hours to produce a duty-inclusive quote across four candidate factories",
    horizon: "Phase 1 · 60 days",
    value: 5,
    effort: 3,
    dependency:
      "Phase one proves this on one buyer programme. Extending it across all 41 factories needs the data work sequenced for Q1 2027, and we would rather scope it that way than over-promise in August.",
    accent: "#0047A0",
  },
  {
    id: "audit",
    name: "Remote Audit Support",
    subsidiary: "Holding company — Group Internal Audit",
    problem:
      "Auditing 41 factories across 10 countries means travel and the manual review of invoices, ERP extracts and contracts in Korean, English, Spanish and Vietnamese. Coverage is necessarily a sample of the population.",
    solution:
      "A document pipeline that reads the full population rather than a sample, flags anomalies against your policy, and returns a ranked exception list in which every flag cites its source document. Your auditors decide; the system does the reading.",
    googleStack: ["Gemini Enterprise", "Document AI", "Gemini Enterprise Agent Platform", "BigQuery"],
    metric: "Auditor-days and travel cost per cycle; share of transactions actually reviewed",
    horizon: "Phase 1 · 60 days",
    value: 5,
    effort: 2,
    dependency:
      "The cleanest starting point in the group: a well-understood cost baseline, and no dependency on factory instrumentation or on how quickly people adopt a new tool.",
    accent: "#A50E0E",
  },
  {
    id: "esg",
    name: "ESG Data Foundation & Buyer Dashboards",
    subsidiary: "Sae-A Trading · Win Textile",
    problem:
      "Your buyers are raising Scope 3 disclosure expectations, and the EU Digital Product Passport will ask for structured product-level data from around 2028. Environmental metrics for 41 factories are consolidated manually each time they are requested.",
    solution:
      "Factory-level energy, water, waste and emissions data centralised with its lineage intact, and dashboards that answer a buyer's question on the day it arrives rather than in the quarter that follows.",
    googleStack: ["BigQuery", "Looker", "Gemini Enterprise", "Dataplex"],
    metric: "Days to answer a buyer ESG request; data completeness across 41 factories",
    horizon: "Phase 2 · Q4 2026",
    value: 5,
    effort: 4,
    dependency:
      "This protects revenue rather than reducing cost, and we think it should be judged that way. Its value shows up in bids you stay qualified for, which is harder to put in a savings model and considerably larger.",
    accent: "#188038",
  },
  {
    id: "knowledge",
    name: "Group Knowledge & Everyday Agents",
    subsidiary: "All subsidiaries — Korean office staff",
    problem:
      "Knowledge across apparel, construction and paper sits in mail, shared drives and long tenure. Two acquisitions since 2022 have made finding what the group already knows harder, not easier.",
    solution:
      "Grounded search across your document estate, and the ability for colleagues in planning, HR, marketing and administration to build their own simple agents — the pattern behind the Samsung DX rollout announced in July.",
    googleStack: ["Gemini Enterprise", "NotebookLM", "Workspace", "Gemini Enterprise Agent Platform"],
    metric: "Weekly active users outside IT; agents built by non-technical colleagues",
    horizon: "Phase 1 · 60 days",
    value: 4,
    effort: 1,
    dependency:
      "The fastest to show visible adoption and the hardest to attribute financially. We pair it with the audit workstream deliberately, because that one attributes cleanly.",
    accent: "#4285F4",
  },
  {
    id: "engineering-memory",
    name: "Engineering Memory for Overseas Projects",
    subsidiary: "Ssangyong E&C",
    problem:
      "Overseas orders grew roughly eightfold to USD 650M a year across Dubai, Equatorial Guinea and beyond, while senior engineers approach retirement. Method statements, claims history and lessons learned live in archives that are rarely searched.",
    solution:
      "Grounded retrieval across drawings, method statements, claims and handover documents, so an engineer abroad can ask what the group learned on the last comparable structure and receive a cited answer.",
    googleStack: ["Gemini Enterprise", "NotebookLM", "Document AI", "Gemini Enterprise Agent Platform"],
    metric: "Rework and claim incidence on overseas projects; time to answer a technical query",
    horizon: "Phase 2 · Q4 2026",
    value: 4,
    effort: 2,
    dependency:
      "At construction margins, avoiding a single significant overseas rework event can outweigh the cost of the whole programme. We think this one is routinely underestimated.",
    accent: "#CD2E3A",
  },
  {
    id: "order-volatility",
    name: "Order-Change Response",
    subsidiary: "Sae-A Trading",
    problem:
      "Brands increasingly expect suppliers to absorb late order changes and low minimum quantities. Each change ripples through materials, capacity and shipping, and is reasoned through manually.",
    solution:
      "An agent that takes a buyer's change request and returns the feasible responses with their cost and delivery consequences, so your team can answer inside the same conversation.",
    googleStack: ["Gemini Enterprise", "Enterprise Agents", "BigQuery"],
    metric: "Response time to a buyer change request; margin retained on changed orders",
    horizon: "Phase 2 · Q4 2026",
    value: 4,
    effort: 3,
    accent: "#7B61FF",
  },
  {
    id: "safety",
    name: "Site Safety Support & Compliance Record",
    subsidiary: "Ssangyong E&C",
    problem:
      "Human monitoring of active sites is necessarily sampled, and the evidentiary record of what the safety system was doing at a given moment is thin.",
    solution:
      "Vision analysis on site CCTV for protective-equipment compliance and hazardous-zone conditions, producing both continuous detection and a timestamped compliance record.",
    googleStack: ["Gemini Enterprise Agent Platform — Vision", "Cloud Storage", "Looker", "BigQuery"],
    metric: "Protective-equipment compliance rate; near-miss detections; completeness of the record",
    horizon: "Phase 2 · Q4 2026",
    value: 4,
    effort: 4,
    dependency:
      "Designed to detect equipment and conditions, not identities. How this is introduced with your site teams matters more than how accurate it is, and we would want your safety and HR leadership to shape it before anything is installed.",
    accent: "#F29900",
  },
  {
    id: "traceability",
    name: "Material Traceability & Certified Content",
    subsidiary: "Win Textile · Sae-A Spinning · Swisstex",
    problem:
      "Orders are at risk when certified recycled or organic material logs cannot be produced on demand. Your vertical integration means the evidence exists inside the group but is not linked from yarn through to finished garment.",
    solution:
      "A traceability layer linking yarn lots to fabric rolls to garment cartons with certificate evidence attached, exportable in both buyer formats and the emerging Digital Product Passport structure.",
    googleStack: ["BigQuery", "Gemini Enterprise Agent Platform", "Gemini Enterprise", "Looker"],
    metric: "Share of shipments with complete chain-of-custody evidence available on demand",
    horizon: "Phase 3 · 2027",
    value: 4,
    effort: 5,
    dependency:
      "Genuinely difficult, and dependent on the ESG foundation landing first. Sequenced third on purpose — proposing it in August would overload the programme and put the earlier work at risk.",
    accent: "#00897B",
  },
  {
    id: "mill-energy",
    name: "Mill Energy & Reliability",
    subsidiary: "Tailim Packaging · Jeonju Paper",
    problem:
      "Steam and electricity dominate controllable cost across more than 20 domestic mills, and unplanned boiler or line downtime is expensive in both cash and carbon.",
    solution:
      "Forecasting of boiler and heavy-machinery behaviour, and energy optimisation tuned to Korean electricity tariff structures.",
    googleStack: ["Gemini Enterprise Agent Platform", "BigQuery", "Looker"],
    metric: "Unplanned downtime hours; energy cost per tonne of output",
    horizon: "Phase 3 · 2027",
    value: 3,
    effort: 5,
    dependency:
      "This needs historian-grade operational data that we have not yet seen. If that foundation is not in place, this is a 2027 conversation and we would rather tell you that now than discover it later.",
    accent: "#E37400",
  },
];

export const futureState = {
  headline: "Global Sae-A in 2029",
  standfirst:
    "Not a description of software. A description of how the company would work if the next three years go the way we think they can.",
  paragraphs: [
    "A buyer sends a programme enquiry on a Tuesday morning. By the time your commercial team joins the call that afternoon, they already hold a ranked allocation across four candidate factories in two tariff regimes, each with a fully-landed cost, a delivery date, an emissions intensity per unit and a chain-of-custody pack. Nobody assembled it that morning. It was standing, because the question is asked constantly and the answer is now maintained rather than produced.",
    "Group Internal Audit no longer samples. Every invoice, contract and ERP entry across 41 factories in 10 countries is read continuously in its original language, and your auditors spend their weeks on the exceptions the system surfaces rather than in transit. Coverage has widened while the travel budget has fallen.",
    "At Ssangyong E&C, an engineer in Dubai asks what the group learned on the last comparable post-tension structure and receives a cited answer drawn from thirty years of Korean project records, in under a minute. The engineers who wrote those method statements have retired. Their judgement has not left the company.",
    "In the mills, boiler behaviour is forecast rather than observed, and the energy plan is written against the coming tariff structure rather than last month's invoice. Emissions reporting has stopped being a quarterly project and become a query.",
    "And in Seoul, your office teams spend materially less of the week assembling information and materially more of it deciding. The group absorbs more order volatility, more overseas construction and more buyer compliance work than it could in 2026, with the same people. That is the change we are describing: not fewer colleagues, but a company whose decisions move at the speed its markets now change.",
  ],
  shifts: [
    { from: "Allocation decided in a planning cycle", to: "Allocation decided per order, continuously" },
    { from: "ESG data assembled when a buyer asks", to: "ESG data standing, and buyer-ready" },
    { from: "Audit by sample, and by aeroplane", to: "Audit by population, and by exception" },
    { from: "Engineering judgement retiring with individuals", to: "Engineering judgement retained and searchable" },
    { from: "Knowledge held in mail, drives and tenure", to: "Knowledge grounded, cited and shared across the group" },
    { from: "Automation queued behind a central team", to: "Colleagues building their own, continuously" },
  ],
};

export const roadmap = [
  {
    phase: "Now → 14 August 2026",
    title: "Choose the working material",
    detail:
      "Confirm the workshop and agree in advance the single measurable outcome it will target. Choose one live buyer programme and one audit cycle to work on. We bring the Korean AI specialist team and the named delivery partner; you bring real documents.",
    outputs: [
      "Workshop agenda built around one named business problem",
      "Data-access checklist agreed with your Group CTO",
      "One-page charter drafted, ready for signature on the day",
    ],
    owner: "Joint — Sae-A Strategic Initiatives and Google Cloud Korea",
  },
  {
    phase: "14 August 2026",
    title: "AX Workshop — a working session, not a demonstration",
    detail:
      "We stand up grounded retrieval over your own documents in the room, build one agent alongside a colleague from planning or HR, and finish with the sixty-day charter signed by a named owner on your side.",
    outputs: [
      "Grounded search working over real Sae-A documents",
      "One agent built by a non-technical colleague from your team",
      "Signed 60-day charter: the metric, the owner, the date",
    ],
    owner: "Joint — Google Cloud Korea AI team and Sae-A Strategic Planning",
  },
  {
    phase: "September → October 2026",
    title: "Sixty-day proof on audit and allocation",
    detail:
      "Two workstreams, deliberately. Remote audit support against one real audit cycle, and landed-cost allocation against one buyer programme. Weekly checkpoints, a single scorecard, and exit criteria agreed before we start.",
    outputs: [
      "Measured auditor-days and travel cost avoided",
      "Measured hours-to-quote on one buyer programme",
      "Adoption baseline: weekly active users outside IT",
    ],
    owner: "Sae-A programme owner, with Google Cloud customer engineering",
  },
  {
    phase: "Q4 2026",
    title: "Gemini Enterprise — 1,000 seats",
    detail:
      "Scale to around half your Korean office population on the strength of measured results rather than projections, with governance for the AI Basic Act configured inside the grace period rather than retrofitted in 2027.",
    outputs: [
      "1,000 seats live across the group's Korean offices",
      "Agent-building sessions for planning, HR and marketing colleagues",
      "Transparency, logging and audit posture documented",
    ],
    owner: "Sae-A Group IT and HR, with Google Cloud Korea",
  },
  {
    phase: "Q1 2027",
    title: "The ESG and traceability foundation",
    detail:
      "With adoption established, build the data foundation your buyers and the EU timeline require: factory environmental metrics centralised with lineage, dashboards for buyer requests, and a first product-level data model ahead of the passport deadline.",
    outputs: [
      "41-factory environmental data foundation live",
      "Buyer-ready compliance dashboards",
      "Product data model aligned to the emerging passport structure",
    ],
    owner: "Sae-A ESG and Group IT, with Google Cloud",
  },
  {
    phase: "2027 → 2029",
    title: "The operating model",
    detail:
      "Extend to Ssangyong engineering memory and site safety, mill energy optimisation, and the traceability layer. By this point the group is not adopting AI. It is running a company in which allocation, evidence and knowledge are continuously maintained.",
    outputs: [
      "Cross-subsidiary agent registry with governance",
      "Vision safety support and forecasting in production",
      "Yarn-to-garment traceability exportable to buyers",
    ],
    owner: "Sae-A group AX function",
  },
];

export const commercialShape = {
  label: "협업 방식 · How we would structure this",
  headline: "Designed to be easy to stop, so that continuing is a decision rather than a default",
  principles: [
    {
      title: "A bounded first phase",
      detail:
        "Sixty days, one metric, exit criteria agreed before engineering begins. If the metric does not move, the programme stops and the finding belongs to you.",
    },
    {
      title: "A stated ceiling",
      detail:
        "One thousand seats, roughly half your Korean office population. Expansion tied to measured weekly active use rather than to a contractual ramp.",
    },
    {
      title: "Platform work kept separate",
      detail:
        "The data foundation work in Q1 2027 is a separate decision on separate economics. Bundling it into the seat conversation would make both harder to evaluate.",
    },
    {
      title: "Delivered by a partner, assured by Google",
      detail:
        "Named before 14 August, so that the team running the workshop is the team that delivers the work — the model behind the Samsung DX rollout.",
    },
    {
      title: "Governance included",
      detail:
        "AI Basic Act transparency, logging and high-impact handling configured during phase one, within the grace period, as part of the programme rather than as a later addition.",
    },
  ],
};

// Defaults for the interactive model. Every figure here is a Google placeholder
// to be replaced with Sae-A's own numbers — that is the point of publishing the
// model rather than a conclusion.
export const roiDefaults = {
  seats: 1000,
  officeStaff: 2000,
  loadedCostPerFteKrw: 85_000_000,
  hoursRecoveredPerWeek: 3,
  adoptionRate: 0.55,
  realisationRate: 0.4,
  seatCostUsdPerMonth: 30,
  factories: 41,
  auditTripsPerYear: 82,
  auditorsPerTrip: 3,
  costPerTripUsd: 4500,
  auditorDaysPerTrip: 12,
  auditTravelReduction: 0.35,
  usdKrw: 1380,
};
