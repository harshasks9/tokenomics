export type StrategyArea =
  | "Operations"
  | "Passenger"
  | "Commercial"
  | "Safety"
  | "Infrastructure"
  | "Ecosystem";

export type Horizon = "0-6 months" | "6-18 months" | "18-36+ months";

export const AIRPORT_STRATEGY_THESIS =
  "Airport data strategy should not start with a warehouse or a dashboard. It should start with the operating decisions that determine passenger flow, aircraft turnaround, safety, revenue, resilience, and partner coordination, then build the shared data products, governance, and AI platform required to improve those decisions every day.";

export const HERO_METRICS = [
  { value: "6", label: "airport value domains" },
  { value: "12", label: "priority use cases" },
  { value: "3", label: "execution horizons" },
  { value: "1", label: "governed platform model" },
];

export const CURRENT_STATE_QUESTIONS = [
  {
    title: "Operational decision latency",
    questions: [
      "Which decisions still depend on calls, spreadsheets, or end-of-shift reports?",
      "Where would a 5- to 15-minute earlier signal change staffing, gates, queues, safety response, or commercial action?",
      "Which airport events need streaming visibility rather than next-day reporting?",
    ],
  },
  {
    title: "Data ownership and trust",
    questions: [
      "Who owns passenger flow, baggage, turnaround, retail, asset, safety, and partner data as business products?",
      "Which datasets are authoritative, which are duplicated, and which are only trusted by one function?",
      "Where do quality issues create operational risk, rework, or executive disagreement?",
    ],
  },
  {
    title: "Ecosystem interoperability",
    questions: [
      "Which data from airlines, ground handlers, immigration, security, tenants, transport, and facilities must be shared under clear rules?",
      "What contractual, regulatory, or commercial terms block responsible sharing today?",
      "Which APIs or event streams should become standard airport-platform services?",
    ],
  },
  {
    title: "AI readiness",
    questions: [
      "Which workflows need traditional reporting, predictive AI, generative AI, or agentic AI?",
      "Which AI use cases have a measurable operational owner and adoption path?",
      "Where must humans approve, override, or audit AI-assisted recommendations?",
    ],
  },
];

export const STRATEGIC_PRINCIPLES = [
  {
    title: "Begin with measurable operating outcomes",
    detail:
      "Every data product should tie to a decision such as queue staffing, gate allocation, baggage recovery, tenant yield, asset maintenance, incident response, or passenger communication.",
  },
  {
    title: "Treat data domains as products",
    detail:
      "Each priority domain has an accountable owner, quality SLOs, semantics, access rules, lineage, usage telemetry, and a funded roadmap. A table without ownership is not a data product.",
  },
  {
    title: "Centralize the platform, federate ownership",
    detail:
      "The airport platform team runs shared tooling, governance, security, integration standards, and reusable AI services. Business domains own definitions, quality, adoption, and value realization.",
  },
  {
    title: "Design for real time, not only reporting",
    detail:
      "Airport operations require event-driven architecture for flights, queues, baggage, assets, incidents, and partner coordination, while finance and planning still need curated batch data.",
  },
  {
    title: "Keep models replaceable and context durable",
    detail:
      "Business semantics, governed APIs, historical data, policies, evaluations, and agent tools should outlive any specific model, interface, vendor, or orchestration framework.",
  },
  {
    title: "Make resilience a data requirement",
    detail:
      "Critical data services need availability tiers, degraded-mode operations, local edge continuity, disaster recovery, cyber monitoring, and tested failover procedures.",
  },
];

export const CENTRALIZED_VS_FEDERATED = [
  {
    model: "Centralize at airport-platform or group level",
    items: [
      "Cloud landing zones, network, identity, encryption, observability, security operations, and disaster recovery patterns.",
      "Shared ingestion, streaming, API, catalog, quality, lineage, access, FinOps, MLOps, and agent-operations services.",
      "Common master data for flight, airport asset, facility, tenant, partner, location, role, and policy entities.",
      "Responsible AI standards, model-risk controls, prompt and tool approval, evaluation harnesses, and audit evidence.",
    ],
  },
  {
    model: "Federate to airport functions and ecosystem domains",
    items: [
      "Operational definitions, quality thresholds, business rules, adoption plans, and value targets for each data product.",
      "Use-case prioritization for terminal operations, airside, baggage, commercial, safety, infrastructure, and passenger experience.",
      "Human approval workflows, exception handling, frontline training, and performance management.",
      "Partner-specific sharing agreements with airlines, handlers, regulators, tenants, transport providers, and service contractors.",
    ],
  },
];

export const DISTINCTIONS = [
  {
    title: "Platform versus value",
    detail:
      "The platform supplies trusted, governed, reusable data and AI capabilities. Value is created only when airport workflows, incentives, staffing, contracts, and decisions change around those capabilities.",
  },
  {
    title: "Reporting versus AI",
    detail:
      "Reporting explains what happened. Predictive AI anticipates what is likely. Generative AI synthesizes knowledge and communication. Agentic AI coordinates tools, policies, approvals, and actions across systems.",
  },
  {
    title: "Technology versus adoption",
    detail:
      "A model can be technically accurate and still fail if dispatchers, terminal managers, commercial teams, safety leaders, and partners do not trust, use, and measure it.",
  },
  {
    title: "Quick wins versus sustainability",
    detail:
      "Early use cases prove value and build confidence. Long-term sustainability comes from reusable data products, governance automation, product funding, and operating discipline.",
  },
];

export const OPERATING_MODEL = [
  {
    role: "Airport Data and AI Council",
    owner: "CEO or COO sponsor with CIO, CDO, airport operations, safety, commercial, legal, risk, and finance",
    mandate:
      "Set priorities, approve funding, resolve data-sharing conflicts, define risk appetite, and review value realization quarterly.",
  },
  {
    role: "Data and AI Office",
    owner: "CDO / Head of Data and AI",
    mandate:
      "Run strategy, portfolio management, architecture standards, governance, data product methods, AI controls, enablement, and group-level capability building.",
  },
  {
    role: "Domain Product Owners",
    owner: "Senior leaders in operations, passenger, commercial, safety, infrastructure, and partner ecosystems",
    mandate:
      "Own the data product backlog, definitions, quality targets, adoption, service levels, and measurable business outcomes.",
  },
  {
    role: "Data Stewards and Process Owners",
    owner: "Operational managers and subject-matter experts",
    mandate:
      "Manage definitions, quality rules, exceptions, lineage validation, access requests, and business-process change.",
  },
  {
    role: "Platform, Analytics, and AI Engineering",
    owner: "Technology and enterprise architecture",
    mandate:
      "Build reusable ingestion, streaming, storage, analytics, API, MLOps, agent, observability, and security services.",
  },
  {
    role: "Partner Data Governance Forum",
    owner: "Airport ecosystem lead with legal, cyber, commercial, airlines, handlers, tenants, authorities, and transport partners",
    mandate:
      "Define data-sharing purposes, minimum data sets, consent, retention, incident handling, commercial terms, and API/event standards.",
  },
];

export const ARCHITECTURE_LAYERS = [
  {
    layer: "Ecosystem sources",
    detail:
      "AODB, FIDS, CUPPS/CUTE, baggage, BMS, IoT, CCTV metadata, access control, Wi-Fi, airline DCS, ground handling, security, immigration, retail POS, parking, transport, weather, and geospatial data.",
  },
  {
    layer: "Ingestion and integration",
    detail:
      "Batch ELT for planning and finance; streaming events for queues, baggage, flights, assets, incidents, and passenger communications; APIs for partner exchange; edge collection for constrained sites.",
  },
  {
    layer: "Storage and processing",
    detail:
      "Lakehouse-style storage for raw and curated data, warehouse marts for trusted metrics, real-time feature stores, geospatial indexes, object storage for documents, images, audio, and video-derived metadata.",
  },
  {
    layer: "Governance and trust",
    detail:
      "Catalog, business glossary, ownership, policy tags, access controls, encryption, lineage, data quality, retention, sovereignty, privacy controls, security monitoring, and audit evidence.",
  },
  {
    layer: "Data products and APIs",
    detail:
      "Curated operational products such as flight turnaround, passenger flow, baggage performance, asset health, commercial yield, incident history, tenant performance, and partner events.",
  },
  {
    layer: "Analytics, AI, and agents",
    detail:
      "BI, forecasting, optimization, anomaly detection, simulation, multimodal analysis, grounded copilots, agent workflows, model evaluation, monitoring, human approvals, and agent audit trails.",
  },
  {
    layer: "Operating channels",
    detail:
      "Airport operations center, mobile supervisor tools, executive cockpit, partner portal, passenger app, tenant dashboards, maintenance consoles, and agent-assisted command workflows.",
  },
];

export const PRIORITY_DOMAINS: Array<{
  area: StrategyArea;
  domain: string;
  owner: string;
  operationalMeaning: string;
  businessOutcome: string;
}> = [
  {
    area: "Operations",
    domain: "Flight, stand, gate, and turnaround",
    owner: "Airport operations with airlines and ground handlers",
    operationalMeaning:
      "A governed event model for schedule, actual movement, stand assignment, gate readiness, crew, baggage, fueling, cleaning, catering, delay codes, and turnaround milestones.",
    businessOutcome: "Higher on-time performance, better stand utilization, fewer missed connections, and faster disruption recovery.",
  },
  {
    area: "Passenger",
    domain: "Passenger flow and experience",
    owner: "Terminal operations and passenger experience",
    operationalMeaning:
      "A privacy-aware view of demand, entry, check-in, security, immigration, dwell, wayfinding, disruption communications, accessibility needs, and sentiment.",
    businessOutcome: "Lower queue time, better passenger satisfaction, improved service recovery, and more targeted communications.",
  },
  {
    area: "Commercial",
    domain: "Retail, parking, media, and tenant performance",
    owner: "Commercial operations",
    operationalMeaning:
      "Tenant sales, footfall, dwell, flight mix, promotions, parking occupancy, media inventory, lease terms, and product/category performance connected to passenger segments.",
    businessOutcome: "Higher non-aeronautical revenue, better tenant mix, stronger concession planning, and improved campaign ROI.",
  },
  {
    area: "Safety",
    domain: "Safety, security, and incident intelligence",
    owner: "Safety, security, compliance, and airport operations",
    operationalMeaning:
      "A controlled record of hazards, incidents, near misses, inspections, access events, emergency response, regulatory obligations, evidence, and corrective actions.",
    businessOutcome: "Earlier risk detection, better investigation, faster response, and stronger audit readiness.",
  },
  {
    area: "Infrastructure",
    domain: "Asset, facilities, and energy",
    owner: "Engineering, facilities, and sustainability",
    operationalMeaning:
      "Asset hierarchy, maintenance history, sensor telemetry, work orders, warranties, spares, energy consumption, environmental conditions, and service criticality.",
    businessOutcome: "Higher availability, lower maintenance cost, fewer operational disruptions, and improved energy efficiency.",
  },
  {
    area: "Ecosystem",
    domain: "Partner and regulatory exchange",
    owner: "Ecosystem partnerships, legal, cyber, and airport operations",
    operationalMeaning:
      "Standardized APIs, events, data-sharing contracts, consent, retention, partner identity, data quality, and dispute procedures across airport participants.",
    businessOutcome: "Faster coordination, lower integration cost, trusted partner collaboration, and safer ecosystem-wide automation.",
  },
];

export const HIGH_VALUE_USE_CASES: Array<{
  area: StrategyArea;
  useCase: string;
  type: "Reporting" | "Predictive AI" | "Generative AI" | "Agentic AI";
  value: string;
  dataNeeded: string;
  adoptionRequirement: string;
  metric: string;
}> = [
  {
    area: "Operations",
    useCase: "Real-time airport operating picture",
    type: "Reporting",
    value: "Give the operations center one trusted view of flights, stands, gates, queues, baggage, incidents, and constraints.",
    dataNeeded: "AODB/FIDS, baggage, staffing, queues, incidents, assets, weather, and partner event feeds.",
    adoptionRequirement: "Define which dashboard becomes the operational record and retire conflicting manual reports.",
    metric: "Decision latency, number of manual status calls, disruption recovery time.",
  },
  {
    area: "Operations",
    useCase: "Turnaround delay prediction and recovery",
    type: "Predictive AI",
    value: "Predict at-risk turnarounds early enough to reassign stands, staff, baggage resources, or passenger communications.",
    dataNeeded: "Turnaround milestones, delay codes, airline/handler events, gate/stand status, baggage, crew, fueling, weather.",
    adoptionRequirement: "Agree playbooks for who acts on an alert and how conflicts between airlines, handlers, and airport operations are resolved.",
    metric: "On-time departure, avoidable delay minutes, stand conflicts, alert precision.",
  },
  {
    area: "Passenger",
    useCase: "Queue prediction and dynamic staffing",
    type: "Predictive AI",
    value: "Forecast security, immigration, check-in, and baggage bottlenecks before lines form.",
    dataNeeded: "Flight load factors, boarding pass scans, sensors, processing rates, rosters, historical flow, irregular operations.",
    adoptionRequirement: "Operations managers must be able to move staff or open lanes before the predicted breach.",
    metric: "Queue SLA adherence, staff utilization, passenger complaints, missed-flight incidents.",
  },
  {
    area: "Passenger",
    useCase: "Passenger disruption communications agent",
    type: "Generative AI",
    value: "Produce timely, consistent, multilingual passenger updates grounded in operational facts and approved policies.",
    dataNeeded: "Flight status, disruption reason, passenger channels, service policies, wayfinding, airline rules, accessibility guidance.",
    adoptionRequirement: "Human approval thresholds for safety, legal, reputational, and high-volume disruption messages.",
    metric: "Time to publish, contact-center deflection, message consistency, passenger sentiment.",
  },
  {
    area: "Commercial",
    useCase: "Retail demand and tenant yield optimization",
    type: "Predictive AI",
    value: "Connect flight mix, dwell, passenger flow, promotions, and tenant sales to improve assortment, staffing, and lease discussions.",
    dataNeeded: "POS, tenant category, passenger flow, flight schedule, parking, promotions, seasonality, events.",
    adoptionRequirement: "Commercial teams and tenants need clear rules for data sharing, benchmarking, and action planning.",
    metric: "Sales per passenger, conversion, tenant productivity, campaign lift.",
  },
  {
    area: "Commercial",
    useCase: "Commercial planning copilot",
    type: "Generative AI",
    value: "Help commercial leaders synthesize tenant performance, passenger trends, contract obligations, and opportunity analysis.",
    dataNeeded: "Trusted metrics, contracts, tenant records, market benchmarks, traffic forecasts, retail plans.",
    adoptionRequirement: "Ground outputs in approved data products and require citation for every recommendation.",
    metric: "Analysis cycle time, forecast quality, adoption by category managers.",
  },
  {
    area: "Safety",
    useCase: "Safety incident intelligence and corrective-action assistant",
    type: "Generative AI",
    value: "Summarize incident evidence, classify risk themes, draft corrective actions, and support audit preparation.",
    dataNeeded: "Incident logs, inspection reports, photos, video metadata, policies, corrective-action history, regulatory obligations.",
    adoptionRequirement: "Safety leaders retain decision authority; AI drafts must preserve evidence, lineage, and audit trail.",
    metric: "Investigation cycle time, repeat incidents, overdue actions, audit findings.",
  },
  {
    area: "Safety",
    useCase: "Security anomaly and access-risk detection",
    type: "Predictive AI",
    value: "Identify unusual access, perimeter, crowding, or operational patterns that merit investigation.",
    dataNeeded: "Access control, CCTV metadata, patrol logs, incident history, rosters, zones, threat levels.",
    adoptionRequirement: "Strict privacy, bias, proportionality, and escalation controls with human review.",
    metric: "Detection precision, investigation time, false-positive rate, control compliance.",
  },
  {
    area: "Infrastructure",
    useCase: "Predictive maintenance for critical assets",
    type: "Predictive AI",
    value: "Prioritize maintenance for baggage belts, passenger boarding bridges, HVAC, lifts, power systems, and safety-critical assets.",
    dataNeeded: "Asset hierarchy, telemetry, work orders, failures, spares, environmental factors, operating schedules.",
    adoptionRequirement: "Maintenance planning and procurement must act on predicted risk, not only fixed schedules.",
    metric: "Unplanned downtime, mean time between failures, maintenance cost, asset availability.",
  },
  {
    area: "Infrastructure",
    useCase: "Energy and sustainability optimization",
    type: "Predictive AI",
    value: "Optimize energy use around flight schedules, weather, occupancy, and asset performance without compromising comfort or resilience.",
    dataNeeded: "BMS, meters, occupancy, weather, flight schedules, asset performance, comfort thresholds.",
    adoptionRequirement: "Facilities teams need approved control limits and exception handling.",
    metric: "Energy intensity, cost, comfort breaches, emissions.",
  },
  {
    area: "Ecosystem",
    useCase: "Partner coordination agent",
    type: "Agentic AI",
    value: "Coordinate approved actions across airport operations, airlines, handlers, tenants, transport, and facilities during disruptions.",
    dataNeeded: "Partner APIs, event streams, policies, contracts, contact trees, operating constraints, approval rules.",
    adoptionRequirement: "Agent tools must be permissioned, audited, reversible where possible, and limited by partner agreements.",
    metric: "Coordination cycle time, SLA breaches, manual escalations, partner satisfaction.",
  },
  {
    area: "Ecosystem",
    useCase: "Regulatory and operational knowledge agent",
    type: "Agentic AI",
    value: "Answer complex operational questions, retrieve procedures, assemble evidence, and open tasks across governed systems.",
    dataNeeded: "Policies, manuals, SOPs, incident history, asset records, audit evidence, data catalog, workflow systems.",
    adoptionRequirement: "Ground every answer in approved sources and log tool use, citations, approvals, and outcomes.",
    metric: "Time to answer, citation quality, avoided escalations, user adoption.",
  },
];

export const GOVERNANCE_FRAMEWORK = [
  {
    pillar: "Data governance",
    controls:
      "Data product charters, owners, stewards, glossary, quality rules, SLOs, lineage, retention, master data, issue management, and usage telemetry.",
  },
  {
    pillar: "Access, privacy, and security",
    controls:
      "Role- and attribute-based access, partner identity, policy tags, consent, data minimization, encryption, key management, cyber monitoring, least privilege, and incident response.",
  },
  {
    pillar: "Ecosystem sharing",
    controls:
      "Purpose-bound sharing agreements, API/event contracts, partner onboarding, data quality obligations, dispute handling, regulatory boundaries, and revocation procedures.",
  },
  {
    pillar: "Model and AI governance",
    controls:
      "Use-case risk tiering, model cards, prompt/tool approval, grounding, evaluation, red-team testing, monitoring, drift detection, human approval, and rollback.",
  },
  {
    pillar: "Agent operations",
    controls:
      "Tool permissions, identity, action limits, audit trails, escalation rules, output citations, simulation before deployment, incident playbooks, and post-action review.",
  },
];

export const PEOPLE_ROADMAP = [
  {
    capability: "Executive literacy",
    actions:
      "Teach the distinction between data platform, analytics, predictive AI, generative AI, and agentic AI; use decision simulations rather than generic training.",
  },
  {
    capability: "Data product management",
    actions:
      "Train domain owners to write product charters, define consumers, prioritize backlogs, measure usage, and link quality work to airport KPIs.",
  },
  {
    capability: "Data engineering and integration",
    actions:
      "Build skills in streaming, API design, geospatial data, legacy integration, data quality engineering, and operational observability.",
  },
  {
    capability: "Analytics and AI translation",
    actions:
      "Develop translators who understand airport processes, statistics, model limitations, frontline adoption, and measurable business value.",
  },
  {
    capability: "Responsible AI and agent operations",
    actions:
      "Create capability in evaluation, grounding, human-in-the-loop design, model monitoring, tool governance, red teaming, and AI incident management.",
  },
];

export const EXECUTION_ROADMAP: Array<{
  horizon: Horizon;
  focus: string;
  moves: string[];
  proof: string;
}> = [
  {
    horizon: "0-6 months",
    focus: "Establish the operating spine and prove value in two to three lighthouse workflows.",
    moves: [
      "Appoint executive sponsor, CDO/Data and AI Office lead, council, domain product owners, and stewards.",
      "Complete current-state diagnostic across source systems, integrations, data quality, partner sharing, cyber, and AI readiness.",
      "Stand up cloud landing zone, catalog, identity, security, core data platform, and first ingestion patterns.",
      "Launch flight-turnaround, passenger-flow, and asset-health data products with clear quality SLOs.",
      "Deliver quick wins: operations cockpit, queue forecasting pilot, and incident-summary assistant with human review.",
    ],
    proof: "Baseline KPIs, first production data products, named owners, measured adoption, and funding decision for scale.",
  },
  {
    horizon: "6-18 months",
    focus: "Scale governed data products and move predictive AI into operational workflows.",
    moves: [
      "Expand data domains to baggage, commercial, safety, partner events, facilities, energy, and passenger communications.",
      "Deploy streaming pipelines, data-sharing APIs, partner onboarding processes, and enterprise data quality monitoring.",
      "Industrialize MLOps for queue prediction, turnaround risk, predictive maintenance, commercial optimization, and anomaly detection.",
      "Create reusable governance patterns for privacy, partner access, model risk, grounding, evaluation, and audit evidence.",
      "Embed product teams into airport operations, commercial, safety, and facilities with change-management targets.",
    ],
    proof: "Operational AI in production, reduced decision latency, improved service SLAs, documented savings or revenue lift, and partner data contracts.",
  },
  {
    horizon: "18-36+ months",
    focus: "Operate an agent-ready airport platform with durable governance and ecosystem coordination.",
    moves: [
      "Move from single-use analytics to an airport data marketplace of governed, reusable domain products.",
      "Deploy agentic workflows for disruption coordination, regulatory evidence assembly, maintenance orchestration, and commercial planning.",
      "Extend multimodal intelligence across documents, images, audio, video-derived metadata, geospatial, and IoT data under strict controls.",
      "Run continuous optimization for FinOps, resilience, latency, model performance, data quality, cyber posture, and user adoption.",
      "Use portfolio metrics to fund what scales and retire dashboards, data sets, models, and agents that do not change decisions.",
    ],
    proof: "Agent operations are audited, business functions rely on governed products, platform services survive model changes, and AI value is traceable to airport KPIs.",
  },
];

export const KEY_DECISIONS = [
  "Which airport outcomes are the first executive priorities: flow, turnaround, safety, commercial yield, asset reliability, or ecosystem coordination?",
  "What data-sharing terms are acceptable with airlines, ground handlers, tenants, regulators, transport providers, and security partners?",
  "Which data and AI capabilities must be common group services versus local airport or function-level services?",
  "What operational systems remain on premises or edge, and what can move to cloud-native or hybrid services?",
  "What risk tier requires human approval, simulation, or board-level review before an AI or agent workflow is deployed?",
];

export const RISKS_AND_DEPENDENCIES = [
  {
    risk: "Legacy system integration is slower than the roadmap assumes.",
    mitigation: "Prioritize API/event wrappers around critical systems, avoid rip-and-replace as a precondition, and define degraded integration modes.",
  },
  {
    risk: "Functions treat data quality as an IT problem.",
    mitigation: "Assign domain owners and stewards with KPI-linked quality SLOs and visible issue queues.",
  },
  {
    risk: "Partners resist sharing because value and liability are unclear.",
    mitigation: "Start with purpose-bound use cases, reciprocal value, data minimization, contractual controls, and phased trust-building.",
  },
  {
    risk: "AI pilots do not change frontline behavior.",
    mitigation: "Require adoption owners, human workflow redesign, training, escalation playbooks, and before/after measurement.",
  },
  {
    risk: "Agentic AI creates unmanaged action risk.",
    mitigation: "Gate agents behind tool permissions, policy checks, simulation, human approval, observability, and rollback procedures.",
  },
];

export const SUCCESS_METRICS = [
  "Operational: queue SLA adherence, turnaround delay minutes, baggage recovery time, stand/gate utilization, incident response time.",
  "Commercial: sales per passenger, tenant productivity, parking yield, campaign conversion, forecast accuracy.",
  "Infrastructure: asset availability, unplanned downtime, maintenance cost, energy intensity, recovery time objective achievement.",
  "Data platform: certified data products, quality SLO compliance, lineage coverage, access approval cycle time, API/event reuse, cost per workload.",
  "AI adoption: models in production, agent actions approved, human override rate, evaluation pass rate, drift incidents, active users, measured value delivered.",
];

export const GOOGLE_CLOUD_CAPABILITIES = [
  {
    requirement: "Data integration and streaming",
    capabilities: "Pub/Sub, Dataflow, Datastream, Application Integration, Apigee, Cloud Run, and partner connectors",
    relevance:
      "Ingest airline, baggage, sensor, retail, asset, and partner events into governed pipelines for batch and real-time airport operations.",
    source: "https://cloud.google.com/pubsub",
  },
  {
    requirement: "Storage, analytics, and AI-ready data",
    capabilities: "BigQuery, Cloud Storage, BigLake, BigQuery ML, geospatial analytics, notebooks, and Looker",
    relevance:
      "Unify structured, streaming, geospatial, and unstructured airport data for executive reporting, operational analytics, prediction, and AI grounding.",
    source: "https://cloud.google.com/bigquery",
  },
  {
    requirement: "Governance, catalog, lineage, and data products",
    capabilities: "Knowledge Catalog, BigQuery governance, policy tags, data quality, lineage, profiling, and data products",
    relevance:
      "Make airport data discoverable, owned, policy-controlled, trustworthy, and usable by both humans and agents.",
    source: "https://cloud.google.com/products/knowledge-catalog",
  },
  {
    requirement: "Security, privacy, and resilience",
    capabilities: "IAM, VPC Service Controls, Cloud KMS, Secret Manager, Security Command Center, Cloud Logging, Cloud Monitoring, Backup and DR",
    relevance:
      "Protect sensitive passenger, security, partner, and operational data while supporting auditability, resilience, and business continuity.",
    source: "https://cloud.google.com/security",
  },
  {
    requirement: "AI development, deployment, and monitoring",
    capabilities: "Gemini Enterprise Agent Platform, model garden, Vertex AI model registry capabilities, evaluation, pipelines, monitoring, and MLOps",
    relevance:
      "Build and govern predictive, generative, multimodal, and agentic use cases without tying the airport strategy to one model or interface.",
    source: "https://cloud.google.com/products/gemini-enterprise-agent-platform",
  },
  {
    requirement: "Grounded agents and enterprise deployment",
    capabilities: "Grounding, agent building, orchestration, tool use, evaluation, monitoring, and enterprise controls in Gemini Enterprise Agent Platform",
    relevance:
      "Create airport agents that retrieve approved data, call authorized tools, cite evidence, respect governance policies, and produce auditable actions.",
    source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform",
  },
];
