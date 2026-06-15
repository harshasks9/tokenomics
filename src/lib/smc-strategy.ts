export type BusinessId = "bank" | "infrastructure" | "food" | "petron";

export interface SourceLink {
  label: string;
  url: string;
  date: string;
}

export interface EvidenceCase {
  customer: string;
  business: BusinessId;
  challenge: string;
  approach: string;
  outcome: string;
  relevance: string;
  classification: "Proven implementation" | "Adjacent-industry evidence";
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
    evidenceCustomers: ["Federal Bank", "HSBC"],
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
    evidenceCustomers: ["SWISS", "Lufthansa Technik"],
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
    evidenceCustomers: ["PIC", "JB Cocoa"],
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
    evidenceCustomers: ["Canadian Tire", "ENGIE"],
  },
];

export const EVIDENCE_CASES: EvidenceCase[] = [
  {
    customer: "Federal Bank", business: "bank",
    challenge: "Deliver accurate, natural banking assistance at customer-service scale.",
    approach: "A virtual assistant built with Dialogflow and connected to banking knowledge and service workflows.",
    outcome: "98% answer accuracy, 25% higher customer satisfaction, 1.4 million annual queries, and five developer hours saved daily.",
    relevance: "Evidence for governed service automation and a reusable interaction layer at Bank of Commerce.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/federal-bank", date: "Publication date not displayed" },
  },
  {
    customer: "HSBC", business: "bank",
    challenge: "Credit-risk simulations took approximately four hours and constrained analyst iteration.",
    approach: "Cloud Storage, Dataflow, and BigQuery created a faster risk-advisory data pipeline.",
    outcome: "Risk simulations ran 16 times faster, reducing processing time to roughly 15 minutes.",
    relevance: "Direct evidence for faster credit-risk analytics; adjacent rather than direct fraud evidence.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/hsbc-risk-advisory-tool", date: "Publication date not displayed" },
  },
  {
    customer: "SWISS", business: "infrastructure",
    challenge: "Crew, passenger, rotation, and technical data were fragmented during operational decision-making.",
    approach: "BigQuery and AI brought operational signals together for network decision support.",
    outcome: "CHF 1 million saved in 14 weeks, with approximately 50% of network flights optimized.",
    relevance: "A close analogue for airport operations, disruption management, and cross-functional control towers.",
    classification: "Adjacent-industry evidence",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/swiss", date: "Publication date not displayed" },
  },
  {
    customer: "Lufthansa Technik", business: "infrastructure",
    challenge: "Aircraft technical-operations analytics were costly and difficult to scale.",
    approach: "An event-driven, managed Google Cloud architecture supported the AVIATAR platform.",
    outcome: "Approximately 50% lower infrastructure cost and actionable technical insights in minutes.",
    relevance: "Strong asset-reliability evidence, while the assets are aircraft rather than airport infrastructure.",
    classification: "Adjacent-industry evidence",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/lufthansa", date: "Publication date not displayed" },
  },
  {
    customer: "PIC", business: "food",
    challenge: "Preparing for food-safety inspections was complex and limited how often inspections could run.",
    approach: "Gemini automated key elements of inspection preparation and knowledge synthesis.",
    outcome: "Preparation became 66% faster, enabling inspections to move from quarterly to monthly.",
    relevance: "Directly relevant to more frequent, consistent quality and food-safety controls.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/pic", date: "Publication date not displayed" },
  },
  {
    customer: "JB Cocoa", business: "food",
    challenge: "Procurement, production, costing, and traceability data were fragmented.",
    approach: "SAP S/4HANA on Google Cloud created a more connected operational foundation.",
    outcome: "Product costing time fell from three days to four hours.",
    relevance: "Evidence for connected manufacturing and supply-chain decisions; predictive maintenance was stated as future intent.",
    classification: "Proven implementation",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/jb-cocoa", date: "Publication date not displayed" },
  },
  {
    customer: "Canadian Tire", business: "petron",
    challenge: "Unify online and offline behavior across a large retail and loyalty ecosystem.",
    approach: "BigQuery and Quantum Metric connected behavioral insight to omnichannel decisions.",
    outcome: "Up to 15% higher omnichannel sales across a loyalty base of 11 million active members.",
    relevance: "A strong retail analogue for joining forecourt, store, loyalty, and digital behavior at Petron.",
    classification: "Adjacent-industry evidence",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/canadian-tire", date: "Publication date not displayed" },
  },
  {
    customer: "ENGIE", business: "petron",
    challenge: "Identify markets with sufficient demand, affordability, and repayment capacity.",
    approach: "Atlas AI geospatial and predictive intelligence informed market prioritization.",
    outcome: "A Kenyan pilot reported a 48% increase in monthly sales.",
    relevance: "Adjacent evidence for geospatial site and network decisions; the result is limited to the cited pilot context.",
    classification: "Adjacent-industry evidence",
    source: { label: "Google Cloud customer story", url: "https://cloud.google.com/customers/engie", date: "Publication date not displayed" },
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
  "Canadian Tire reports up to 15% higher omnichannel sales; the result should not be generalized without an SMC baseline.",
  "ENGIE's 48% monthly-sales result comes from a Kenyan pilot and is context-specific.",
  "HSBC provides credit-risk evidence, not a direct fraud implementation; Lufthansa Technik covers aircraft rather than airport assets.",
  "No public evidence establishes the benefits achievable at SMC. Each lighthouse requires its own baseline and value case.",
];

export const ENTERPRISE_SOURCES: SourceLink[] = [
  { label: "Google Cloud AI announcements: 52% deploying agents", url: "https://cloud.google.com/blog/products/ai-machine-learning/what-google-cloud-announced-in-ai-this-month-2025", date: "January 1, 2026" },
  { label: "Introducing Gemini Enterprise", url: "https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise", date: "October 10, 2025" },
  { label: "Five lessons from Google's AI transformation", url: "https://cloud.google.com/transform/beyond-the-pilot-five-hard-won-lessons-from-google-clouds-ai-transformation-strategy", date: "March 2026 search index; page date not stated" },
  { label: "Manufacturing AI value and sponsorship", url: "https://cloud.google.com/transform/manufacturing-gen-ai-roi-report-dozen-reasons-ai-value", date: "September 11, 2024" },
  { label: "ROI of generative AI", url: "https://cloud.google.com/resources/roi-of-generative-ai", date: "Publication date not displayed" },
];
