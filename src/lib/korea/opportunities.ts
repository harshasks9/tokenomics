// The opportunity map, transferable patterns, sequencing and commercial design
// for the Global Sae-A AX programme.

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
  honesty?: string;
  accent: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "allocation",
    name: "Landed-Cost Allocation Agent",
    subsidiary: "Sae-A Trading",
    problem:
      "Answering 'which of our 41 factories should take this Walmart programme, at what fully-landed cost' requires manually assembling duty exposure, GSDCost standard minutes, capacity, lead time and freight. Under the post-24-July tariff regime that answer expires faster than it can be assembled.",
    solution:
      "An agent that reads the buyer's RFQ, retrieves current duty treatment by origin, pulls standard-minute and capacity data, and returns a ranked factory recommendation with a fully-landed cost and its working shown.",
    googleStack: ["Gemini Enterprise", "Enterprise Agents", "BigQuery", "Vertex AI Search"],
    metric: "Hours to produce a duty-and-carbon-inclusive quote across four candidate factories",
    horizon: "Phase 1 · 60 days",
    value: 5,
    effort: 3,
    honesty:
      "Phase one proves the retrieval and reasoning on one buyer programme. Full automation across all 41 sites requires data work that belongs to phase two — do not promise it in August.",
    accent: "#0047A0",
  },
  {
    id: "audit",
    name: "Remote Smart Audit Agent",
    subsidiary: "Holding company — Group Internal Audit",
    problem:
      "Auditing 41 factories across 10 countries means physical travel and manual review of multilingual invoices, ERP extracts and contracts in Korean, English, Spanish and Vietnamese.",
    solution:
      "A document-ingestion pipeline that reads the full population rather than a sample, flags anomalies against policy, and returns a ranked exception list where every flag cites its source document. Auditors decide; the agent reads.",
    googleStack: ["Gemini Enterprise", "Document AI", "Vertex AI Search", "BigQuery"],
    metric: "Auditor-days and travel cost per audit cycle; percentage of transactions reviewed",
    horizon: "Phase 1 · 60 days",
    value: 5,
    effort: 2,
    honesty:
      "This is the cleanest first win in the group: an unusually clear baseline, cash-visible savings, and no dependency on factory instrumentation.",
    accent: "#A50E0E",
  },
  {
    id: "esg",
    name: "ESG Data Pipeline & Buyer Compliance Dashboards",
    subsidiary: "Sae-A Trading · Win Textile",
    problem:
      "Global buyers — Walmart above all — are raising Scope 3 disclosure expectations, and the EU's Digital Product Passport will demand structured product-level data from roughly 2028. Environmental metrics for 41 factories are consolidated manually, in a quarterly scramble.",
    solution:
      "Centralise factory-level energy, water, waste and emissions data in BigQuery with lineage, and publish Looker dashboards that answer a buyer's question the day they ask it rather than the quarter after.",
    googleStack: ["BigQuery", "Looker", "Gemini Enterprise", "Dataplex"],
    metric: "Days to answer a buyer ESG data request; data completeness across 41 factories",
    horizon: "Phase 2 · Q4 2026",
    value: 5,
    effort: 4,
    honesty:
      "The value here is protecting bidding competitiveness, not reducing cost. Do not present it as a savings case — present it as a revenue-defence case, which is where its real magnitude sits.",
    accent: "#188038",
  },
  {
    id: "knowledge",
    name: "Group Knowledge & Workspace Agents",
    subsidiary: "All subsidiaries — ~2,000 Korean office staff",
    problem:
      "Institutional knowledge across apparel, construction and paper sits in email, shared drives and the heads of long-tenured staff. Two acquisitions since 2022 have made this materially worse.",
    solution:
      "Grounded enterprise search across the group's document estate, plus no-code agent building so HR, marketing, planning and administrative staff automate their own work — the pattern Samsung's DX division adopted for roughly 50,000 employees.",
    googleStack: ["Gemini Enterprise", "NotebookLM", "Workspace", "Vertex AI Search"],
    metric: "Weekly active users among non-IT staff; hours recovered per user per week",
    horizon: "Phase 1 · 60 days",
    value: 4,
    effort: 1,
    honesty:
      "Lowest effort and fastest visible adoption, which is why it belongs in phase one — but it is the hardest to attribute financially. Pair it with audit, which is easy to attribute.",
    accent: "#4285F4",
  },
  {
    id: "traceability",
    name: "Material Traceability & Certified-Content Ledger",
    subsidiary: "Win Textile · Sae-A Spinning · Swisstex",
    problem:
      "Orders are at risk when certified recycled or organic material logs cannot be produced on demand. Vertical integration means the evidence exists internally — it is simply not joined from yarn to finished garment.",
    solution:
      "A traceability layer that links yarn lots to fabric rolls to garment cartons with certificate evidence attached, exportable in buyer and Digital Product Passport formats.",
    googleStack: ["BigQuery", "Vertex AI", "Gemini Enterprise", "Looker"],
    metric: "Percentage of shipments with complete chain-of-custody evidence on demand",
    horizon: "Phase 3 · 2027",
    value: 4,
    effort: 5,
    honesty:
      "Genuinely hard, and dependent on the ESG pipeline landing first. Sequenced third deliberately — proposing it in August would overload the programme.",
    accent: "#00897B",
  },
  {
    id: "safety",
    name: "Site Safety Vision & Compliance Record",
    subsidiary: "Ssangyong E&C",
    problem:
      "Under the Serious Accident Punishment Act, a fatality exposes named executives to imprisonment of at least one year and fines up to KRW 1 billion. Human monitoring is sampled; the evidentiary record after an incident is thin.",
    solution:
      "Vision analysis on active-site CCTV for PPE compliance and hazardous-zone conditions, producing continuous detection plus a timestamped, defensible compliance log.",
    googleStack: ["Vertex AI Vision", "Cloud Storage", "Looker", "BigQuery"],
    metric: "PPE compliance rate; near-miss detections; completeness of the evidentiary record",
    horizon: "Phase 2 · Q4 2026",
    value: 4,
    effort: 4,
    honesty:
      "Detect equipment and conditions, never identities. Korean privacy expectations and worker-relations risk make the design of this more important than its accuracy.",
    accent: "#F29900",
  },
  {
    id: "engineering-memory",
    name: "Engineering Memory for Overseas Projects",
    subsidiary: "Ssangyong E&C",
    problem:
      "Senior engineers are retiring while the overseas backlog grew eightfold to USD 650 million a year across Dubai, Equatorial Guinea and beyond. Method statements, claims history and lessons learned live in individuals and in project archives nobody searches.",
    solution:
      "Grounded retrieval across drawings, method statements, claims and handover documents, so a project engineer in Dubai can ask what Ssangyong learned on the last comparable structure and get a cited answer.",
    googleStack: ["Gemini Enterprise", "NotebookLM", "Document AI", "Vertex AI Search"],
    metric: "Rework and claim incidence on overseas projects; time to answer a technical query",
    horizon: "Phase 2 · Q4 2026",
    value: 4,
    effort: 2,
    honesty:
      "Frequently underestimated. With ~3% operating margins, avoiding one significant overseas rework event can outweigh the entire programme cost.",
    accent: "#CD2E3A",
  },
  {
    id: "mill-energy",
    name: "Mill Energy & Reliability Optimisation",
    subsidiary: "Tailim Packaging · Jeonju Paper",
    problem:
      "Steam and electricity dominate controllable cost across 20+ domestic mills, and unplanned boiler or line downtime is expensive in both cost and Net-Zero trajectory.",
    solution:
      "Predictive maintenance and energy optimisation on boiler and heavy-machinery telemetry, tuned to Korean electricity tariff structures.",
    googleStack: ["Vertex AI", "BigQuery", "Looker"],
    metric: "Unplanned downtime hours; energy cost per tonne of output",
    horizon: "Phase 3 · 2027",
    value: 3,
    effort: 5,
    honesty:
      "This requires historian-grade OT data that we should not assume exists. If the sensor and historian foundation is absent, this is a 2027 conversation and we should say so rather than sell it in August.",
    accent: "#E37400",
  },
  {
    id: "order-volatility",
    name: "Order-Change Absorption Agent",
    subsidiary: "Sae-A Trading",
    problem:
      "Brands increasingly expect suppliers to absorb last-minute order changes and low minimum order quantities. Each change ripples through materials, capacity and shipping, and is currently reasoned through manually.",
    solution:
      "An agent that takes a buyer change request and returns the feasible responses with cost and delivery consequences, so the commercial team can answer in the same conversation.",
    googleStack: ["Gemini Enterprise", "Enterprise Agents", "BigQuery"],
    metric: "Response time to a buyer change request; margin retained on changed orders",
    horizon: "Phase 2 · Q4 2026",
    value: 4,
    effort: 3,
    accent: "#7B61FF",
  },
  {
    id: "not-recommended",
    name: "What we are deliberately not proposing",
    subsidiary: "Group-wide",
    problem:
      "The obvious temptation is to propose Gemini Enterprise seats for all 70,000 employees, an ERP consolidation, and a group-wide data lake before any value is proven.",
    solution:
      "We recommend against all three. Roughly 68,000 of 70,000 employees are factory and field workers for whom a seat-based knowledge assistant is not the right tool. ERP consolidation is a multi-year programme with no AI dependency. A group-wide lake before a proven use case is the most reliable way to spend two years and prove nothing.",
    googleStack: ["— none —"],
    metric: "Money not spent",
    horizon: "Phase 1 · 60 days",
    value: 3,
    effort: 1,
    honesty:
      "Saying this out loud in front of a cost-conservative owner family is worth more than any capability slide. It is also true.",
    accent: "#5F6368",
  },
];

export const patterns = [
  {
    id: "cost-sensitive",
    title: "Prove one number before scaling",
    who: "Cost-sensitive, owner-operated enterprises",
    pattern:
      "Organisations with a strong balance sheet and a history of technology scepticism adopt successfully when the first commitment is small, bounded and tied to a single pre-agreed metric — and fail when the first commitment is a platform.",
    fit: "Direct. The briefing explicitly identifies the owner family's cost conservatism as the gating factor.",
    application:
      "One thousand seats, one buyer programme, sixty days, one metric agreed on 14 August before any engineering begins.",
  },
  {
    id: "no-code",
    title: "Adoption comes from non-technical builders",
    who: "Large Korean and Japanese conglomerates",
    pattern:
      "Deployments that depend on central IT to build agents stall at licence deployment. Deployments where HR, marketing and administrative staff build their own no-code agents compound. Samsung Electronics' DX rollout — roughly 50,000 employees, announced 13 July 2026 — was justified on exactly this basis.",
    fit: "Direct and locally proven, which matters more here than any Western reference.",
    application:
      "Make weekly active use by non-IT staff the headline adoption metric on the Q4 scorecard, and run an agent-building clinic inside the 60 days.",
  },
  {
    id: "knowledge-first",
    title: "Knowledge retrieval before analytics",
    who: "Global manufacturers with heterogeneous, acquired estates",
    pattern:
      "Manufacturers that begin with a warehouse programme typically take 18 months to first value. Those that begin with grounded retrieval over documents they already trust reach value in weeks and earn the right to the data programme.",
    fit: "Strong. Ssangyong (2022) and Tegra (2024) guarantee estate heterogeneity.",
    application:
      "Phase one touches no schemas and migrates no data. The ESG warehouse work in phase two is funded by phase-one credibility.",
  },
  {
    id: "regulatory-forcing",
    title: "Let the regulator set the deadline",
    who: "Highly regulated and buyer-audited enterprises",
    pattern:
      "AI programmes justified on productivity drift. Programmes justified on a dated external obligation — a buyer requirement, a statute, a disclosure regime — hold their funding through budget cycles.",
    fit: "Unusually strong. Three separate external clocks are already running.",
    application:
      "Anchor the roadmap to the Section 301 transition, Walmart's Scope 3 escalation and the EU DPP timeline rather than to internal ambition.",
  },
  {
    id: "family-legacy",
    title: "Frame transformation as protection of the legacy",
    who: "Family-owned industrial groups",
    pattern:
      "Family-controlled businesses reject transformation narratives built on disruption and accept narratives built on protecting what the family built. The verb matters more than the technology.",
    fit: "Direct. Owner-family CEO in the room; 70,000 employees framed as social legacy.",
    application:
      "Every headline in the deck uses defend, protect and compete — never disrupt, transform-or-die, or headcount reduction.",
  },
  {
    id: "buyer-mirror",
    title: "Sell to the customer's customer",
    who: "OEM and contract manufacturers",
    pattern:
      "For a manufacturer, the most persuasive AI case is not internal efficiency but becoming measurably easier for its buyers to work with. The buyer's procurement scorecard is the real business case.",
    fit: "Direct, and reinforced by a Vice Chairman who ran Walmart Korea and has enforced such a scorecard personally.",
    application:
      "Open the executive session with the buyer's view of Sae-A, not with Google's product portfolio.",
  },
];

export const futureState = {
  headline: "Global Sae-A in 2029: the manufacturer that answers first",
  paragraphs: [
    "A Walmart merchandising team sends a programme enquiry on a Tuesday morning. By the time the Seoul commercial team joins the call that afternoon, they already hold a ranked allocation across four candidate factories in two tariff regimes, each with a fully-landed cost, a delivery date, an emissions intensity per unit and a chain-of-custody evidence pack. Nobody assembled it. It was standing, because the question is asked constantly and the answer is now maintained rather than produced.",
    "Group Internal Audit no longer samples. Every invoice, contract and ERP entry across 41 factories in 10 countries is read continuously in its original language, and auditors spend their weeks on the ranked exceptions the system surfaces rather than on flights. The team's coverage has widened while its travel budget has fallen.",
    "At Ssangyong E&C, a project engineer in Dubai asks what the group learned on the last comparable post-tension structure and receives a cited answer drawn from thirty years of Korean project archives, in English, in under a minute. The engineers who wrote those method statements have retired; their judgement has not left the company.",
    "In the paper mills, boiler behaviour is forecast rather than observed, and the energy plan is written against tomorrow's tariff structure rather than last month's invoice. Emissions reporting is not a quarterly project — it is a query.",
    "And in Seoul, roughly 2,000 office staff spend materially less of their week assembling information and materially more of it deciding. The group absorbs more order volatility, more overseas construction and more buyer compliance work than it could in 2026, with the same people. That is the transformation: not fewer people, but a company whose decisions move at the speed its markets now change.",
  ],
  shifts: [
    { from: "Allocation decided in a planning cycle", to: "Allocation decided per order, continuously" },
    { from: "ESG data assembled quarterly for a buyer request", to: "ESG data standing, queryable, and buyer-ready" },
    { from: "Audit by sample and by aeroplane", to: "Audit by population and by exception" },
    { from: "Engineering judgement retiring with individuals", to: "Engineering judgement retained and searchable" },
    { from: "Knowledge trapped in mail, drives and tenure", to: "Knowledge grounded, cited and shared across subsidiaries" },
    { from: "IT builds the automations, slowly", to: "Business staff build their own agents, constantly" },
  ],
};

export const roadmap = [
  {
    phase: "Now → 14 August 2026",
    title: "Lock the workshop on one problem, not twelve",
    detail:
      "Confirm the AX Workshop and agree in advance the single measurable outcome it will target. Pre-select one live buyer programme and one audit cycle as the working material. Google brings the Korean AI specialist team; Sae-A brings real documents.",
    outputs: [
      "Signed workshop agenda with a named business problem",
      "Data-access checklist agreed with the Group CTO",
      "One-page PoC charter drafted for signature on the day",
    ],
    owner: "Michael Lesniak · Juhyung Lee · Jincheol Kim",
  },
  {
    phase: "14 August 2026",
    title: "AX Workshop — build in the room",
    detail:
      "A working session, not a capability tour. Stand up grounded retrieval over Sae-A's own documents live, build one no-code agent with an HR or planning user in the room, and leave with the sixty-day charter signed by a named Sae-A owner.",
    outputs: [
      "Working grounded search over real Sae-A documents",
      "One agent built by a non-technical Sae-A employee",
      "Signed 60-day PoC charter: metric, owner, date",
    ],
    owner: "Google Cloud Korea AI team · Sae-A Strategic Planning",
  },
  {
    phase: "Sept → Oct 2026",
    title: "Sixty-day proof on audit and allocation",
    detail:
      "Two workstreams only. The Remote Smart Audit Agent against one real audit cycle, and the Landed-Cost Allocation Agent against one buyer programme. Weekly checkpoint, single scorecard, pre-agreed exit criteria. Country Director engagement lands in this window.",
    outputs: [
      "Measured auditor-days and travel cost avoided",
      "Measured hours-to-quote reduction on one buyer programme",
      "Adoption baseline: weekly active non-IT users",
    ],
    owner: "Saejin Jung (PM) · Google Cloud CE team",
  },
  {
    phase: "Q4 2026",
    title: "Gemini Enterprise — 1,000 seats, deliberately bounded",
    detail:
      "Scale to half the Korean office population on the strength of measured results, not projections. Explicitly not a 70,000-seat proposal. Governance for the AI Basic Act is configured now, inside the grace period, rather than retrofitted in 2027.",
    outputs: [
      "1,000 Gemini Enterprise seats live",
      "No-code agent clinic run for HR, marketing and planning",
      "AI Basic Act transparency and logging posture documented",
    ],
    owner: "Brian Cho · Jason Park · Google Cloud Korea",
  },
  {
    phase: "Q1 2027",
    title: "BigQuery and Vertex AI Search — the ESG and traceability estate",
    detail:
      "With adoption proven, build the data foundation that the buyer and regulatory clocks require: factory environmental metrics in BigQuery with lineage, Looker dashboards for buyer requests, and the first Digital Product Passport data model ahead of the EU timeline.",
    outputs: [
      "41-factory environmental data pipeline live",
      "Buyer-ready compliance dashboards in Looker",
      "DPP-aligned product data model drafted",
    ],
    owner: "Sae-A ESG · Brian Cho · Google Cloud",
  },
  {
    phase: "2027 → 2029",
    title: "Agentic operating model across the group",
    detail:
      "Extend to Ssangyong engineering memory and site safety, mill energy optimisation, and the traceability ledger. By this point Sae-A is not adopting AI; it is operating a company in which allocation, evidence and knowledge are continuously maintained.",
    outputs: [
      "Cross-subsidiary agent registry with governance",
      "Vision safety and predictive maintenance in production",
      "Yarn-to-garment traceability exportable to buyers",
    ],
    owner: "Group AX office",
  },
];

export const commercial = {
  headline: "A commercial structure designed for a family that does not like surprises",
  principles: [
    {
      title: "Bounded phase one",
      detail:
        "Sixty days, one named metric, pre-agreed exit criteria. If the metric does not move, the programme stops and Sae-A owns the finding. This is the single most important commercial term for this customer.",
    },
    {
      title: "1,000 seats, not 70,000",
      detail:
        "State the ceiling before procurement asks. Roughly half the Korean office population, with expansion tied to measured weekly active use rather than to a contractual ramp.",
    },
    {
      title: "Consumption separated from seats",
      detail:
        "BigQuery, Looker and Vertex AI work in Q1 2027 is a separate decision on separate economics. Bundling it into the Q4 seat conversation makes the seat conversation harder and slower.",
    },
    {
      title: "Partner-delivered, Google-assured",
      detail:
        "Partner status is not yet confirmed. Select the delivery partner before 14 August so the workshop is run by the team that will deliver, following the Samsung SDS pattern of a Korean MSP delivering with Google Cloud assurance.",
    },
    {
      title: "Governance included, not invoiced later",
      detail:
        "AI Basic Act transparency, logging and high-impact-category handling are configured during phase one within MSIT's grace period. Retrofitting governance in 2027 costs more and lands during enforcement.",
    },
    {
      title: "Reference value acknowledged both ways",
      detail:
        "The world's largest apparel manufacturer adopting agentic AI is a significant story for Google. Recognise that value in the commercial construct rather than pretending it does not exist.",
    },
  ],
};

// Defaults for the interactive ROI model. Every figure here is an assumption
// to be replaced with Sae-A's own numbers on 14 August — that is the point of
// exposing the model rather than the conclusion.
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
