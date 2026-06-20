export type BusinessId = "bank" | "infrastructure" | "food" | "petron";

export interface SourceLink {
  label: string;
  url: string;
}

export interface EvidenceCase {
  customer: string;
  business: BusinessId;
  challenge: string;
  aiRole: string;
  approach: string;
  outcome: string;
  relevance: string;
  classification: "Proven implementation" | "Credible partner implementation" | "Adjacent-industry evidence";
  source: SourceLink;
}

export interface BusinessOpportunity {
  id: BusinessId;
  shortName: string;
  name: string;
  thesis: string;
  useCases: Array<{ title: string; value: string; measure: string }>;
  evidenceCustomers: string[];
}

export const EXECUTIVE_THESIS =
  "Enterprise AI has moved from standalone copilots to agents that can interpret context, coordinate workflows, and take governed action. The advantage will not come from deploying the most pilots or choosing one model; it will come from redesigning high-value workflows around trusted data, measurable outcomes, human accountability, and reusable platform capabilities. SMC has unusually strong opportunities because banking, infrastructure, food manufacturing, and fuel retail all generate operational data and repeatable decisions at scale.";

export const BUSINESSES: BusinessOpportunity[] = [
  {
    id: "bank",
    shortName: "Bank",
    name: "Bank of Commerce",
    thesis: "Reduce risk and decision time while making every customer and relationship-manager interaction more relevant.",
    useCases: [
      { title: "Fraud and financial crime", value: "Detect suspicious behavior earlier and focus investigators on higher-risk cases.", measure: "Avoided loss, false positives, investigation time" },
      { title: "Personalized banking", value: "Turn customer context into timely, explainable next-best actions across channels.", measure: "Conversion, retention, customer satisfaction" },
      { title: "Credit and vendor intelligence", value: "Synthesize internal and external signals for faster, more consistent decisions.", measure: "Decision cycle time, risk-adjusted yield" },
      { title: "RM productivity", value: "Prepare briefs, surface opportunities, and automate follow-through without removing accountability.", measure: "Client time, portfolio coverage, revenue per RM" },
    ],
    evidenceCustomers: ["Federal Bank", "Commerzbank"],
  },
  {
    id: "infrastructure",
    shortName: "Infrastructure",
    name: "SMC Infrastructure and Airports",
    thesis: "Build a real-time operational picture that improves flow, reliability, safety, and disruption response.",
    useCases: [
      { title: "Airport operations", value: "Coordinate operational signals to improve rotations, resource allocation, and recovery.", measure: "On-time performance, turnaround time, disruption cost" },
      { title: "Passenger experience", value: "Anticipate friction and provide contextual assistance throughout the journey.", measure: "Queue time, resolution rate, satisfaction" },
      { title: "Asset reliability", value: "Move from scheduled maintenance toward condition-aware intervention and faster diagnosis.", measure: "Availability, mean time to repair, maintenance cost" },
      { title: "Worker and passenger safety", value: "Combine operational data and governed alerts to identify emerging hazards sooner.", measure: "Incidents, response time, leading safety indicators" },
    ],
    evidenceCustomers: ["VINCI Airports", "Airports of Thailand"],
  },
  {
    id: "food",
    shortName: "Food and Beverage",
    name: "San Miguel Foods and Beverage",
    thesis: "Connect demand, production, quality, and supply signals so decisions improve throughput without compromising food safety.",
    useCases: [
      { title: "Demand forecasting", value: "Improve forecasts at the product, channel, and location level using richer demand signals.", measure: "Forecast error, service level, waste" },
      { title: "Supply-chain optimization", value: "Balance inventory, sourcing, logistics, and production constraints as conditions change.", measure: "Working capital, fill rate, logistics cost" },
      { title: "Smart manufacturing", value: "Detect process drift and support operators with contextual recommendations.", measure: "Yield, downtime, throughput, energy intensity" },
      { title: "Quality and food safety", value: "Accelerate inspection preparation and make controls more frequent and consistent.", measure: "Inspection time, non-conformance, traceability" },
    ],
    evidenceCustomers: ["PIC", "DiMuto"],
  },
  {
    id: "petron",
    shortName: "Petron",
    name: "Petron",
    thesis: "Use network, customer, and geospatial intelligence to improve each site, offer, and investment decision.",
    useCases: [
      { title: "Retail and customer analytics", value: "Unify forecourt, store, digital, and behavioral signals into a usable customer view.", measure: "Basket size, frequency, margin" },
      { title: "Loyalty and personalization", value: "Deliver relevant offers based on context, value, and customer intent.", measure: "Redemption, incremental sales, retention" },
      { title: "Network optimization", value: "Identify network gaps and improve assortment, staffing, and service by location.", measure: "Site productivity, coverage, operating cost" },
      { title: "Site selection", value: "Combine mobility, demand, competition, and affordability data for investment decisions.", measure: "Ramp time, return on invested capital, forecast accuracy" },
    ],
    evidenceCustomers: ["Coca-Cola Bottlers Japan", "ENGIE"],
  },
];

export const EVIDENCE_CASES: EvidenceCase[] = [
  {
    customer: "Federal Bank", business: "bank",
    challenge: "Deliver accurate, natural banking assistance at customer-service scale.",
    aiRole: "Dialogflow's conversational AI interprets customer intent, maintains context, and continuously improves responses without manually training every phrasing.",
    approach: "A virtual assistant built with Dialogflow and connected to banking knowledge and service workflows.",
    outcome: "98% answer accuracy, 25% higher customer satisfaction, 1.4 million annual queries, and five developer hours saved daily.",
    relevance: "Evidence for governed service automation and a reusable interaction layer at Bank of Commerce.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/federal-bank" },
  },
  {
    customer: "Commerzbank", business: "bank",
    challenge: "Corporate-client advisors spent more than an hour reviewing recorded calls and manually documenting regulated investment advice.",
    aiRole: "Gemini 1.5 Pro transcribes multi-hour audio, identifies speakers, extracts client facts and risk preferences, drafts compliant summaries, and uses Vertex AI evaluation to select the strongest output.",
    approach: "A multi-stage generative AI workflow on Vertex AI automates advisory-call documentation while retaining human review and explainable quality evaluation.",
    outcome: "Work that took more than 60 minutes can be completed in a few minutes with human oversight, returning advisor time to client relationships and personalized advice.",
    relevance: "A direct analogue for relationship-manager productivity, regulated documentation, client briefing, and human-governed AI at Bank of Commerce.",
    classification: "Proven implementation",
    source: { label: "Google Cloud implementation story", url: "https://cloud.google.com/blog/products/ai-machine-learning/how-commerzbank-is-transforming-financial-advisory-workflows-with-gen-ai" },
  },
  {
    customer: "VINCI Airports", business: "infrastructure",
    challenge: "Unify fragmented, non-standardized operational data across more than 70 airports in 14 countries to anticipate passenger traffic and congestion.",
    aiRole: "Vertex AI predictive models combine traffic history, operational capacity, exogenous variables, and boarding-pass signals to forecast peaks and congestion at multiple time horizons.",
    approach: "A global Data Factory on Google Cloud federates local airport data, applies automated quality controls, and powers predictive traffic models with BigQuery and Vertex AI.",
    outcome: "Boarding-pass and flow data can predict arrivals at security checkpoints, allowing teams to adjust staffing in real time and work toward waits below 10 minutes.",
    relevance: "A direct operating analogue for terminal flow, security checkpoints, reception, baggage handling, and resource orchestration across SMC airport assets.",
    classification: "Credible partner implementation",
    source: { label: "Artefact case study with Google Cloud", url: "https://www.artefact.com/cases/how-vinci-airports-uses-ai-to-optimize-its-operational-commercial-and-financial-performance-with-google-cloud-and-artefact/" },
  },
  {
    customer: "Airports of Thailand", business: "infrastructure",
    challenge: "Absorb sharp passenger-volume spikes across six international airports while eliminating data silos and maintaining reliable traveler services.",
    aiRole: "The transformation establishes the governed, real-time airport and passenger data foundation required for future predictive operations and AI-assisted passenger services; the documented result itself is cloud-scale modernization.",
    approach: "AOT migrated its IT footprint to Google Cloud and used an open, scalable data platform for ground aviation services and the SAWASDEE by AOT passenger app.",
    outcome: "Core systems can accommodate up to 10 times their usual workloads and deliver real-time airport and flight information from check-in through baggage collection.",
    relevance: "Direct evidence for airport-wide digital operations, passenger communications, baggage visibility, loyalty, and resilient peak-demand service at SMC airports.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer publication", url: "https://cloud.google.com/blog/products/gcp/airports-of-thailand-and-evme-rely-on-cloud-to-improve-travel" },
  },
  {
    customer: "PIC", business: "food",
    challenge: "Preparing for food-safety inspections was complex and limited how often inspections could run.",
    aiRole: "Gemini summarizes daily food-safety intelligence and prepares inspection inputs, while Vertex AI also supports visual shelf analysis, recommendations, and product recognition.",
    approach: "Gemini automated key elements of inspection preparation and knowledge synthesis.",
    outcome: "Preparation became 66% faster, enabling inspections to move from quarterly to monthly.",
    relevance: "Directly relevant to more frequent, consistent quality and food-safety controls.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/pic" },
  },
  {
    customer: "DiMuto", business: "food",
    challenge: "Food quality and trade data disappeared into a supply-chain blind spot between packhouses and retailers, while defect-detection models were slow to train.",
    aiRole: "Vertex AI visually inspects produce to detect defects and grade quality in real time; Gemini and Vertex AI Agent Builder power a trade-contract agent over logistics documents.",
    approach: "DiMuto unified AI training, real-time quality inspection, traceability, and agentic document retrieval on Google Cloud.",
    outcome: "AI model training accelerated by roughly 35%, compute costs fell roughly 25%, and produce quality can be graded as cartons enter the packhouse.",
    relevance: "Directly relevant to ingredient quality, food-safety inspection, supplier traceability, claims resolution, and intelligent supply-chain operations at San Miguel Foods and Beverage.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/dimuto-ai" },
  },
  {
    customer: "Coca-Cola Bottlers Japan", business: "petron",
    challenge: "Optimize the location, assortment, pricing, and replenishment decisions for a distributed network of approximately 700,000 physical vending locations.",
    aiRole: "Vertex AI, AutoML, and BigQuery ML predict where to place machines, which products to stock, at what price, and expected sales, with recommendations delivered to field teams on maps and tablets.",
    approach: "A production MLOps platform turns billions of location and transaction records into near-real-time network and merchandising recommendations.",
    outcome: "The platform rolled out to sales managers across 35 prefectures with 100% utilization, replacing intuition-led placement with high-accuracy ML recommendations.",
    relevance: "A close analogue for Petron station location, convenience assortment, local pricing, demand prediction, and field-sales productivity across a large physical network.",
    classification: "Adjacent-industry evidence",
    source: { label: "Google Cloud AI implementation story", url: "https://cloud.google.com/blog/topics/developers-practitioners/coca-cola-bottlers-japan-collects-insights-700000-vending-machines-vertex-ai" },
  },
  {
    customer: "ENGIE", business: "petron",
    challenge: "Identify markets with sufficient demand, affordability, and repayment capacity.",
    aiRole: "Atlas AI combines machine learning, satellite imagery, geospatial features, and socioeconomic signals to predict market demand and prioritize expansion locations.",
    approach: "Atlas AI geospatial and predictive intelligence informed market prioritization.",
    outcome: "A Kenyan pilot reported a 48% increase in monthly sales.",
    relevance: "Adjacent evidence for geospatial site and network decisions; the result is limited to the cited pilot context.",
    classification: "Adjacent-industry evidence",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/engie" },
  },
];

export const PLATFORM_FOUNDATIONS = [
  { title: "Trusted data", detail: "Business context, lineage, quality, and controlled access" },
  { title: "Identity and policy", detail: "Who or what may act, on which data, under what conditions" },
  { title: "Agent orchestration", detail: "Reusable workflows, tools, models, and human approval points" },
  { title: "Evaluation", detail: "Quality, safety, and business-outcome tests before and after release" },
  { title: "Observability", detail: "Performance, cost, drift, exceptions, and audit evidence" },
  { title: "Adoption", detail: "Process redesign, role clarity, incentives, and frontline enablement" },
];

export const QUALIFICATIONS = [
  "Survey findings are self-reported and should be treated as directional evidence, not audited market facts.",
  "Airports of Thailand demonstrates a real-time, scalable data foundation for AI; its published 10x capacity result is infrastructure modernization, not a measured AI outcome.",
  "ENGIE's 48% monthly-sales result comes from a Kenyan pilot and is context-specific.",
  "VINCI's under-10-minute checkpoint wait is an operating target enabled by predictive staffing, not a published realized network-wide average.",
  "No public evidence establishes the benefits achievable at SMC. Each lighthouse requires its own baseline and value case.",
];

export const ENTERPRISE_SOURCES: SourceLink[] = [
  { label: "Google Cloud AI announcements: 52% deploying agents", url: "https://cloud.google.com/blog/products/ai-machine-learning/what-google-cloud-announced-in-ai-this-month-2025" },
  { label: "Introducing Gemini Enterprise", url: "https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise" },
  { label: "Five lessons from Google's AI transformation", url: "https://cloud.google.com/transform/beyond-the-pilot-five-hard-won-lessons-from-google-clouds-ai-transformation-strategy" },
  { label: "Manufacturing AI value and sponsorship", url: "https://cloud.google.com/transform/manufacturing-gen-ai-roi-report-dozen-reasons-ai-value" },
  { label: "ROI of generative AI", url: "https://cloud.google.com/resources/roi-of-generative-ai" },
];
