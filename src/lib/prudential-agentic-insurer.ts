export const heroStats = [
  { value: "$1.1T", label: "potential annual AI value for global insurance" },
  { value: "100+", label: "AI use cases live or in development at Prudential" },
  { value: "24", label: "Asian and African markets" },
  { value: "68K", label: "average monthly active agents" },
];

export const tldr = [
  {
    title: "Insurance becomes software-defined",
    body: "Agentic AI can convert insurance from a labor-bound operating model into a software-operated business within 3-5 years. The economic unit of work shifts from the human FTE to the governed, orchestrated agent.",
  },
  {
    title: "Prudential is positioned to lead",
    body: "Prudential has a Google Cloud-powered AI Lab in Singapore, 100+ use cases, proven MedLM and MedScreen+ outcomes, 200+ bank partners, about 18 million customers, and a distribution footprint that maps directly to where agentic AI creates value.",
  },
  {
    title: "Google Cloud is the strategic platform",
    body: "Insurance is reasoning-heavy, multimodal, healthcare-bound, and cost-of-inference-bound. Google combines Gemini, MedLM/MedGemma, Cloud Healthcare API, ADK, A2A, MCP, Gemini Enterprise, and TPU economics.",
  },
];

export const keyFindings = [
  "The industry is climbing an AI staircase: predictive AI is mature, generative AI is reshaping document-heavy workflows, and agentic AI is the emerging frontier for end-to-end workflow execution.",
  "The economics change, not just the workflow: agentic AI decouples premium growth from expense growth and creates measurable gains in quote-to-bind, claims cycle time, loss ratio, modernization, routing accuracy, complaints, and savings.",
  "Google Cloud has a deep insurance reference base across Generali, HDFC ERGO, Definity, CNA, Iris Global, Hiscox, Loadsure, Five Sigma, Interseguro, Cytora, Guidewire, and claims acceleration.",
  "Prudential's strategy is agentic-ready: customer experience, technology-powered distribution, health, a Google partnership since 2019, PRUServices, PRUForce, PRULeads, the AI Lab, and Bengaluru capability build-out.",
  "Google's differentiation is philosophical: full-stack ownership from TPU silicon to Gemini to the agent platform, open protocols, healthcare AI, and structural inference-cost advantage.",
];

export const staircase = [
  {
    step: "01",
    title: "Predictive AI",
    detail: "Established in pricing, fraud detection, risk modeling, geospatial analytics, loss-ratio improvement, and portfolio monitoring.",
    color: "bg-slate-200 text-slate-900",
  },
  {
    step: "02",
    title: "Generative AI",
    detail: "Reshapes document-heavy work such as submissions, policy issuance, claims handling, medical evidence summarization, call center guidance, and knowledge search.",
    color: "bg-[#e8f0fe] text-[#174ea6]",
  },
  {
    step: "03",
    title: "Agentic AI",
    detail: "Plans, acts across tools, uses context, iterates with controls, and autonomously manages workflows while humans govern, judge, empathize, and remain accountable.",
    color: "bg-[#fce8e6] text-[#a50e0e]",
  },
];

export const macroForces = [
  "Frontier models gained reasoning, multimodality, and long context around 2024-2026.",
  "Production AI build costs fell sharply from the 2022 baseline.",
  "Open protocols such as Agent2Agent and Model Context Protocol made multi-vendor orchestration practical.",
  "Custom silicon made high-volume agent workloads more economically viable.",
  "Customer expectations now mirror e-commerce and consumer technology: speed, personalization, reliability, conversational service, and on-demand products.",
  "Health, climate risk, cyber, fraud, connected devices, embedded insurance, claims inflation, and distribution digitization all push insurers toward agentic operating models.",
];

export const valueChain = [
  ["Customer Discovery", "Blunt segmentation; wasted spend", "Persona/intent agents build dynamic 1:1 profiles", "Higher conversion, lower CAC", "Strategy, ethics", "Vertex AI, BigQuery, Looker"],
  ["Marketing", "Slow, generic campaigns", "Campaign agents generate, localize, and test across 24 markets", "Speed, personalization", "Brand, compliance", "Gemini multimodal, grounding"],
  ["Sales/Advisory", "Agents spend time on admin, not clients", "Agency Copilot pre-fills, recommends, and coaches", "Productivity per agent", "Relationship, closing", "Gemini + Agent Builder in PRUForce"],
  ["Quote", "Manual re-keying over days", "Quote agents assemble decision-ready risk", "Days to minutes", "Exceptions", "Cytora pattern on Google Cloud"],
  ["Underwriting", "Manual document review", "Medical underwriting agents triage, summarize, and decide", "Faster STP and accuracy", "Borderline judgment", "MedLM/MedGemma, Document AI, Healthcare API"],
  ["Policy Issuance", "Paperwork and delays", "Issuance agents generate documents and orchestrate handoff", "Same-day issuance", "Audit", "Document AI, Gemini, Guidewire"],
  ["Servicing", "High call volumes", "Voice/chat agents resolve end-to-end", "Cost-to-serve down", "Empathy escalations", "Customer Engagement Suite, Gemini Enterprise"],
  ["Claims", "Manual sifting and leakage", "Claims and medical validation agents auto-adjudicate", "Cycle time and leakage down", "Contested claims", "MedLM, Document AI, Claims Acceleration Suite"],
  ["Fraud", "Rule-based and reactive", "Fraud-hunter agents run graph, anomaly, and deepfake checks", "30-40% detection lift", "Investigation", "Vertex AI, BigQuery, Chronicle"],
  ["Renewals", "Static and churn-prone", "Retention agents predict and personalize", "Lower attrition", "Saves", "Vertex AI, Looker"],
  ["Cross-sell", "Missed opportunities", "Financial-wellness agents find life-event triggers", "Share of wallet", "Advice", "Gemini, BigQuery"],
  ["Finance", "Manual close", "Finance agents automate reconciliation and forecast", "Faster close", "Controls", "Gemini, BigQuery, AlloyDB"],
  ["Compliance", "Manual and slow", "Compliance agents check every step against rules", "Fewer breaches and audit trail", "Accountability", "Gemini Enterprise governance"],
  ["Actuarial", "Slow model builds", "Actuarial agents accelerate scenarios", "Richer insight", "Sign-off", "Vertex AI, BigQuery"],
  ["Reinsurance", "Manual optimization", "Reinsurance optimizer models cessions", "Capital efficiency", "Strategy", "Vertex AI, BigQuery"],
  ["Enterprise Ops/IT", "Modernization stuck", "Agents reverse-engineer and migrate cores", "10-90% productivity", "Architecture", "Gemini Code Assist, ADK"],
];

export const agents = [
  ["Personal Insurance Advisor", "Guides customers to the right cover using consented health and financial data; outputs needs analysis and recommendations.", "PRUServices, product catalog", "L3", "Conversion and NPS"],
  ["Family Protection Planner", "Life-event-driven protection modeling.", "Customer profile, family context", "L2-L3", "Cross-sell"],
  ["Medical Underwriting Agent", "Triages and summarizes medical evidence and auto-decides standard cases.", "MedLM/MedGemma, Healthcare API", "L3", "Very high ROI; proven doubled automation"],
  ["Claims Investigator Agent", "Adjudicates low-risk claims end-to-end.", "Document AI, MedLM", "L3-L4", "Cycle time and leakage"],
  ["Fraud Hunter Agent", "Continuous graph, anomaly, and deepfake detection.", "BigQuery, Chronicle, Vertex AI", "L2-L3", "30-40% detection lift"],
  ["Document Intelligence Agent", "Extracts and classifies any document, format, or language.", "Document AI, Gemini", "L4", "Foundational automation"],
  ["Call Center Agent", "Resolves voice and chat servicing queries.", "Customer Engagement Suite", "L3", "About 22% cycle-time reduction"],
  ["Financial Wellness Coach", "Ongoing engagement and nudges.", "Gemini, BigQuery", "L2", "Retention and cross-sell"],
  ["Sales Coach Agent", "Real-time coaching and objection handling.", "PRUForce, Gemini", "L1-L2", "Agent productivity"],
  ["Agency Copilot", "Pre-fills, recommends next-best action, and generates leads in PRUForce.", "PRUForce, PRULeads, ADK", "L3", "Leads and conversion"],
  ["Compliance Officer Agent", "Checks workflow steps against regulation across 24 markets.", "Agent Registry, governance", "L2", "Audit readiness"],
  ["Risk Intelligence Agent", "Portfolio and emerging-risk monitoring.", "BigQuery, Vertex AI", "L2", "Risk foresight"],
  ["Product Designer Agent", "Rapid product prototyping and localization.", "Gemini, enterprise data", "L2", "Speed to market"],
  ["Pricing Agent", "Dynamic guardrailed pricing.", "Vertex AI, actuarial models", "L3", "Loss-ratio improvement"],
  ["Reinsurance Optimizer Agent", "Dynamic cession modeling.", "BigQuery, Vertex AI", "L2", "Capital efficiency"],
  ["Catastrophe Planner Agent", "Geospatial natural-catastrophe modeling.", "BigQuery geospatial, Maps", "L2", "Selection and pricing"],
  ["Customer Retention Agent", "Churn prediction and personalized saves.", "Looker, Vertex AI", "L3", "Lower attrition"],
  ["Healthcare Navigation Agent", "Guides customers to care and panel hospitals.", "Healthcare API, Maps", "L3", "Health strategy"],
  ["Wealth Protection Agent", "Affluent and HNW advisory support.", "Gemini, wealth data", "L2-L3", "Wealth growth"],
  ["Partner Distribution Agent", "Bancassurance partner integration and enablement.", "Apigee, Cloud Run", "L3", "Partner onboarding"],
  ["Marketing Campaign Agent", "Multilingual campaign generation and testing.", "Gemini multimodal", "L3", "Personalized growth"],
  ["Enterprise Knowledge Agent", "Search across internal knowledge for employees.", "Gemini Enterprise, Vertex AI Search", "L2", "15,000 employees faster"],
];

export const claimsFlow = [
  "Claims Intake",
  "Document Intelligence",
  "Medical Validation",
  "Fraud Agent",
  "Policy Agent",
  "Payment Agent",
  "Customer Communication",
  "Audit Agent",
];

export const useCaseDomains = [
  {
    domain: "Life",
    range: "1-15",
    examples: "Accelerated underwriting, beneficiary changes, needs-based advice, policy illustration generation, lapse prediction, medical evidence summarization, anti-selection detection, e-application pre-fill, death-claim automation, rider recommendation, underwriting-rules modernization, mortality-trend modeling, KYC, servicing chatbot, agent recruitment scoring.",
  },
  {
    domain: "Health",
    range: "16-35",
    examples: "Claims auto-adjudication, prior authorization, MedScreen+ medical-report screening, care navigation, panel-hospital finder, teleconsult triage, chronic-disease nudges, fraud/waste/abuse detection, clinical coding, provider optimization, wellness personalization, wearables, medical necessity, reimbursement, risk assessment, population health, symptom checking, discharge-summary parsing, duplicate claims, pharmacy validation.",
  },
  {
    domain: "Wealth & Retirement",
    range: "36-50",
    examples: "Goal-based planning, portfolio risk profiling, retirement income modeling, HNW advisory copilot, fund insights, rebalancing alerts, tax-document generation, annuity suitability, next-best conversation, decumulation, ESG matching, estate planning, wealth transfer, client-review automation, market commentary.",
  },
  {
    domain: "Group/Commercial",
    range: "51-65",
    examples: "Submission ingestion, risk triage, appetite matching, SME quote-and-bind, geospatial property risk, loss-run analysis, exposure monitoring, benefits enrollment, census processing, policy wording, catastrophe modeling, binder management, certificate issuance, risk-engineering reports, broker drafting.",
  },
  {
    domain: "Ops/Finance/HR/IT/CX",
    range: "66-100+",
    examples: "Core migration, financial close, reconciliation, regulatory reporting, voice AI, case triage, knowledge search, HR onboarding, recruitment screening, IT incident triage, code review/testing, security detection, Apigee API management, data quality, translation, complaints, NPS, personalization, training, meeting summaries, expenses, contracts, forecasting, churn, sentiment, fraud rings, FAQs, policy summaries, multilingual chatbots, workflow mining.",
  },
];

export const googleStories = [
  ["Generali Italia", "Vertex AI and Gemini Enterprise for natural-language policy access, multimodal search, extraction, classification, underwriting, claims, and a multi-market Insurance in a Box platform."],
  ["HDFC ERGO", "Customer and advisor superapps, 300+ services integrated through Apigee, BigQuery data lake, and roughly 93% retail policies issued digitally."],
  ["Definity", "Enterprise-wide Gemini Enterprise rollout across servicing, claims, underwriting, software, and infrastructure."],
  ["CNA", "BigQuery geospatial analytics to better measure flood risk."],
  ["Iris Global", "Up to 80% document-classification automation with Vertex AI and Vision AI."],
  ["Hiscox", "BigQuery and Vertex AI lead underwriting, cutting complex-risk quoting from three days to minutes."],
  ["Loadsure", "Document AI and Gemini for high-accuracy claims extraction and processing."],
  ["Five Sigma", "AI claims engine with 80% error reduction, 25% adjuster productivity gain, and 10% cycle-time reduction."],
  ["Interseguro", "Core migration to Google Cloud plus Gemini-powered agents for sales, call center, claims, image analysis, and file analysis."],
  ["Cytora", "Agentic underwriting and claims platform supporting 140+ languages; Zurich scaled to five countries in 90 days."],
  ["Guidewire ecosystem", "BigQuery, Analytics Hub, UnderwritingCenter, and Agentic Framework for submission ingestion, triage, and clearance."],
  ["Claims Acceleration Suite", "AI-enabled prior-authorization and claims processing that converts unstructured data to structured data."],
];

export const prudentialFacts = [
  "Prudential plc serves about 18 million customers across 24 Asia and Africa markets and focuses on Greater China, ASEAN, India, and Africa.",
  "FY2025 results announced 18 March 2026: new business profit up 12% to $2,782m, new-business margin up 2 points to 42%, operating free surplus up 15% to $3,059m, adjusted operating EPS up 12% to 101.4 cents, and S&P upgraded core entities to AA.",
  "Distribution includes about 68,000 average monthly active agents and 200+ bank partners; bancassurance new business profit rose 27% to $1,033m in 2025.",
  "CEO Anil Wadhwani's priorities are operations, agency, and health, delivered through customer experience, technology-powered distribution, and transforming the health business model.",
  "The Google Cloud relationship began in 2019, expanded in 2022 around Pulse, and expanded again in August 2024 into a strategic AI partnership.",
  "The Prudential AI Lab launched in Singapore on 19 November 2024 with support from MDDI, EDB, and MAS; it gives around 15,000 employees a secure sandbox with leading LLMs, gen AI, and analytics.",
  "MedLM proof-of-concept tests doubled the automation rate of claim reviews and assessments while improving accuracy, with rollout first in Singapore and Malaysia and a human in the loop.",
  "MedScreen+ in Hong Kong evaluates medical reports in less than half the traditional time across 160+ test types.",
  "PRUServices drove a 20% drop in call volumes versus 2023; around 96% of new-business policies were submitted electronically and about 74% processed via auto-underwriting in FY2024.",
  "PRUForce and PRULeads generated 5.7 million leads in H1 2025, with conversion at 8.4%.",
  "The Bengaluru global services hub opened in March 2025 and is scaling data, AI, software, testing, cybersecurity, PRUServices, and PRUForce capabilities.",
  "Ashley Veasey leads technology, Grace Park leads data/analytics/AI, Tomasz Kurczyk heads the AI Lab, and governance runs through a Responsible AI Framework and cross-functional AI Working Group.",
];

export const prudentialAssessment = [
  ["Strengths", "Google Cloud partnership; live AI Lab; proven health-AI outcomes; proprietary distribution; health/wealth data across 24 markets; AA balance sheet; reskilling."],
  ["Gaps", "Legacy core fragmentation; production scaling beyond POC; mixed consumer-app history after Pulse; talent depth; consistent data quality across markets."],
  ["Quick wins", "Scale MedLM and MedScreen+; deploy Agency Copilot; enterprise knowledge search; voice AI in high-volume contact centers."],
  ["Long-term", "Group-wide agentic mesh; unified health navigation; embedded distribution; autonomous underwriting for standard life and health."],
];

export const platformComparisons = [
  ["OpenAI", "Frontier-model-first and consumer-led, with superb reasoning but thinner enterprise stack and inference economics exposed to GPU pricing."],
  ["Anthropic", "Safety-first, strong at code and reliability; available through Google Model Garden and AWS Bedrock, but it is a model rather than a full agentic enterprise platform."],
  ["Microsoft", "Strong distribution through Copilot/Azure and Office, but largely reliant on OpenAI models and NVIDIA silicon."],
  ["AWS", "Broad infrastructure and Bedrock model choice, but less vertically integrated on models and more service-by-service in healthcare coverage."],
  ["Google", "Owns the stack from TPU silicon to Gemini, Gemini Enterprise, open protocols, applications, Workspace, Search, healthcare AI, and open orchestration."],
];

export const googleWins = [
  "Reasoning and long context for full medical files, policy wordings, and multi-document claims.",
  "Native multimodality across documents, images, video, and voice.",
  "Healthcare depth through MedLM, MedGemma, Med-Gemini research, FHIR-native Cloud Healthcare API, Vertex AI Search for Healthcare, and Claims Acceleration Suite.",
  "Open agent orchestration through ADK, A2A, and MCP.",
  "Search and grounding to reduce hallucination and cite enterprise data.",
  "Maps and geospatial for catastrophe risk, panel-hospital navigation, and territory optimization.",
  "TPU-backed inference economics for millions of daily agent calls and model routing across frontier and cheaper high-volume models.",
];

export const capabilityMap = [
  ["Slow health-claim adjudication", "Multimodal doc + clinical reasoning", "Claims + Medical Validation agents", "MedLM/MedGemma, Document AI, Healthcare API, Vertex AI", "Doubled automation rate; faster turnaround"],
  ["Slow medical underwriting", "OCR + clinical assessment", "Medical Underwriting agent", "MedScreen+ pattern, MedGemma, Document AI", "Reports in less than half the time"],
  ["Manual submission intake", "Unstructured to structured", "Submission ingestion + triage agents", "Cytora on Google Cloud, Gemini, Document AI", "Quote days to minutes"],
  ["High call-center volume", "Conversational + retrieval", "Voice/chat servicing agent", "Customer Engagement Suite, Gemini Enterprise", "About 22% cycle-time cut"],
  ["Fraud including deepfakes", "Graph + anomaly + forensics", "Fraud Hunter agent", "Vertex AI, BigQuery, Chronicle", "30-40% detection lift"],
  ["Agent productivity", "RAG + recommendation", "Agency Copilot in PRUForce", "Gemini, ADK, BigQuery", "Productivity up; leads up"],
  ["Employee knowledge", "Search + grounding", "Enterprise Knowledge agent", "Gemini Enterprise, Vertex AI Search", "15,000 employees faster"],
  ["Legacy modernization", "Code understanding", "Migration agents", "Gemini Code Assist, ADK, Cloud Run/GKE", "10-90% productivity"],
  ["Catastrophe/flood risk", "Geospatial analytics", "Catastrophe Planner agent", "BigQuery geospatial, Maps", "Better selection/pricing"],
  ["Partner integration", "API-to-agent bridging", "Partner Distribution agent", "Apigee MCP bridge, Cloud Run", "Faster onboarding"],
  ["Compliance in 24 markets", "Rule-checking + audit", "Compliance agent", "Gemini Enterprise governance, Agent Registry", "Audit-ready"],
  ["Churn", "Predictive + personalization", "Retention agent", "Vertex AI, Looker, AlloyDB", "Lower attrition"],
];

export const roadmap = [
  {
    horizon: "First 90 days",
    title: "Prove and Anchor",
    people: "Agentic-AI tiger team under CIO/CDAO; domain owners for claims, underwriting, servicing, distribution.",
    tech: "Scale MedLM claims and MedScreen+ to 2-3 more markets; deploy Enterprise Knowledge agent; pilot Agency Copilot.",
    governance: "Extend Responsible AI to autonomy levels and human-in-the-loop policy.",
    kpis: "Claims cycle time, cost-to-serve, accuracy, hallucination rate, auto-completion, escalation rate.",
    success: "3 agents in production with measured P&L impact.",
  },
  {
    horizon: "6 months",
    title: "Scale the Core Domains",
    people: "Reskill underwriters, claims, and contact-center staff; appoint agent product managers.",
    tech: "Multi-agent claims workflow in a flagship market; voice AI in top contact centers.",
    governance: "Agent Registry, Identity, Gateway, and audit trails operational.",
    kpis: "STP rate, loss-ratio delta, NPS, first-contact resolution.",
    success: "One fully orchestrated multi-agent workflow in production.",
  },
  {
    horizon: "12 months",
    title: "Agentic Distribution & Health",
    people: "Agency Copilot across major agency markets; health-navigation team.",
    tech: "PRULeads/PRUForce uplift, health-navigation agent, and submission agents where relevant.",
    governance: "Market-by-market regulatory sign-off and model-validation cadence.",
    kpis: "Leads, conversion, productivity per active agent, health cross-sell, auto-underwriting.",
    success: "New-business-profit contribution from agentic distribution.",
  },
  {
    horizon: "24 months",
    title: "The Agentic Mesh",
    people: "Enterprise agent operating model at group level.",
    tech: "A2A/MCP mesh across underwriting, claims, servicing, finance, compliance; core modernization agents at scale.",
    governance: "Standardized observability, simulation, and evaluation.",
    kpis: "Cost/income ratio, expense-vs-premium-growth decoupling, AI-assisted decision share.",
    success: "Premium growth outpacing expense growth attributable to agents.",
  },
  {
    horizon: "36 months",
    title: "AI-Native Insurer",
    people: "Humans concentrated at judgment, empathy, accountability, and transparent workforce reskilling.",
    tech: "Governed agent portfolio, autonomous standard underwriting, embedded distribution, continuous learning loops.",
    governance: "Responsible AI as public commitment.",
    kpis: "TSR vs peers, loss ratio, NPS, AI fluency, autonomy mix, reliability, cost per resolved interaction.",
    success: "Prudential operates as a portfolio of governed agents with humans at judgment points.",
  },
];

export const micrositeStructure = [
  ["Homepage", "The Agentic Insurer: Prudential and Google, Inventing the Future of Insurance."],
  ["Industry Trends", "The AI Staircase with adoption, TSR, and macro-force exhibits."],
  ["Future of Insurance", "From Human-Operated to Software-Operated."],
  ["Agent Gallery", "Meet Your 2028 Workforce with 20+ agents and autonomy levels."],
  ["Use Case Explorer", "100+ Ways to Win, filtered by domain, complexity, ROI, workflow, and Google capability."],
  ["Google Capabilities", "The Full Stack, Chip to Inbox: TPU, Gemini, Agent Platform, Apps, cost, healthcare."],
  ["Customer Stories", "Already Real: insurance reference cards for Google Cloud customers and partners."],
  ["Architecture", "The Agentic Mesh with governance and human-in-the-loop boundaries."],
  ["Prudential Opportunities", "Where Prudential Wins First: heat map and journey maps."],
  ["Implementation Roadmap", "90 Days to 36 Months with KPI reveals."],
  ["Innovation Lab", "Inside the Prudential AI Lab: 100+ use cases and Responsible AI."],
];

export const visualSpecs = [
  "Insurance Value Chain ribbon with 16 nodes color-coded by AI maturity.",
  "Agent Ecosystem Map with Gemini Enterprise at the center and 20+ agent nodes.",
  "Claims Orchestration Flow with Intake, Document, Medical, Fraud, Policy, Payment, Comms, Audit, and human gates.",
  "Customer Journey Map from discover to buy to serve to claim to renew.",
  "Agent Collaboration Diagram showing A2A/MCP capability discovery and handoff.",
  "Data Architecture from PRUServices, PRUForce, wearables, and partner APIs to BigQuery, Healthcare API, Gemini, agents, and channels.",
  "Future Operating Model from 2025 functional silos to 2028 agent-augmented pods.",
  "Capability Heat Map across Prudential domains with quick-win stars.",
  "Industry Maturity Curve showing the AI-native frontier and Prudential target position.",
  "Transformation Roadmap across 90d, 6m, 12m, 24m, and 36m stages.",
];

export const recommendations = [
  "Declare an AI-native ambition now and resource it as enterprise redesign, not a pilot portfolio.",
  "Double down on health AI as the wedge by scaling MedLM and MedScreen+ across major markets within two quarters.",
  "Deploy Agency Copilot into PRUForce as the distribution flywheel for 68,000 active agents and millions of leads.",
  "Standardize on an open agentic mesh on Google Cloud with Gemini Enterprise, ADK, A2A, MCP, BigQuery, and Healthcare API.",
  "Make inference economics a board-level design constraint by routing reasoning-heavy and high-volume steps differently.",
  "Govern for trust from day one with autonomy levels, human-in-the-loop boundaries, explainability, and auditability.",
  "Invest in people through reskilling, agent product management, and roles focused on judgment, empathy, and accountability.",
];

export const caveats = [
  "Several Prudential efficiency figures come from a single trade-press interview and should be treated as executive characterization rather than audited metrics.",
  "Beyond MedLM, not every Google product in the recommended architecture is publicly confirmed as currently used by Prudential.",
  "Vendor and analyst ROI figures indicate potential, not guaranteed outcomes; execution, data quality, and change management decide results.",
  "Forward-looking adoption figures such as 14% to 70% by 2028 and 40% of enterprise apps with agents by end-2026 are projections.",
  "Model pricing and capabilities move monthly; the structural TPU advantage is more durable than any specific price snapshot.",
  "Prudential faces real execution risk across legacy cores, pilot-to-production scaling, talent, and its mixed consumer-app history.",
  "Regulatory divergence across 24 Asian and African markets will shape data residency, AI governance, healthcare data, and deployment pace.",
];
