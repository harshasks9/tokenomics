import type { DeepDive, Enabler, Phase, Play } from "../types";

/** Six plays (slides 16, 17, 96, 133). leadCount = cohorts where the play leads on slide 17. */
export const plays: Play[] = [
  {
    id: "coding",
    name: "Coding",
    family: "Model platform business",
    what: "Antigravity and coding agents for dev and R&D teams.",
    detail: ["Repo-level bake-offs on customer codebases.", "Developer workflow integration: IDEs, PR bots, dev portals.", "Route high-volume code work to lower-cost models and caching."],
    leadCount: 5,
  },
  {
    id: "live",
    name: "Live Agent & GenMedia",
    family: "Model platform business",
    what: "Gemini Live API for real-time voice agents; Omni, Imagen and Veo for creative media.",
    detail: ["Real-time Korean voice and vision prototypes.", "Low-latency, high-concurrency production.", "Creative pipelines on customer IP."],
    leadCount: 4,
  },
  {
    id: "products",
    name: "AI in products",
    family: "Model platform business",
    what: "Gemini and third-party APIs inside customers' B2C / B2B apps.",
    detail: ["Competitor API displacement.", "Shadow-to-live cutover.", "Tiered model routing."],
    leadCount: 3,
  },
  {
    id: "agentic",
    name: "Agentic",
    family: "Model platform business",
    what: "AI agents in enterprise operations and customer service.",
    detail: ["Grounding, tool use and workflow automation.", "Lighthouse pods at anchor accounts.", "Replicate through captive SIs."],
    leadCount: 6,
  },
  {
    id: "security",
    name: "Security",
    family: "Model platform business",
    what: "CodeMender: AI for secure code and security operations.",
    detail: ["CISO gate-clearing at stage 1–2.", "Runtime guardrails (VPC-SC, CMEK, IAM, DLP, Model Armor).", "AI-powered SecOps."],
    leadCount: 7,
  },
  {
    id: "unified",
    name: "Unified App",
    family: "Gemini Enterprise",
    what: "Gemini Enterprise seats as the workforce front door: Spark, connectors, agent governance.",
    detail: ["Connectors, governance and role-based workflows.", "30 / 60 / 90-day seat activation.", "Seat expansion gated on weekly active use."],
    leadCount: 4,
  },
];

export const enablers: Enabler[] = [
  {
    name: "Model Choice",
    tagline: "Land without rewrites.",
    detail:
      "Unify Gemini, Anthropic, OpenAI and open weights on one platform. No single-model lock-in; take competitor workloads fast without code rewrites (e.g. Claude on Vertex).",
  },
  {
    name: "Cost / Tokenomics",
    tagline: "Scale to production.",
    detail:
      "Cut inference TCO with Gemini Flash dynamic routing, Context Caching, Batch and Provisioned Throughput, turning negative unit economics into multi-year commits.",
  },
];

export const enablerNote =
  "Not a seventh or eighth play. Slide 16 shows two enablers; slides 96 and 133 merge them into one: \"Tokenomics: Gemini + third-party models on Vertex — not a play on its own.\"";

export const heatmapNote =
  "Lead / second-line states from slide 17 (team input, updated 1 Oct). Several cohort pages (slides 25–35) still show an earlier mix: most notably Security, which slide 17 now has leading in 7 of 8 cohorts. States only; the deck attributes no revenue by play.";

export const engines =
  "Two product engines: model plays drive Digital Natives (+$449M); Unified App opens the enterprise, mid-market and public-sector doors. Security now leads in 7 of 8 cohorts.";

/** Common three-phase delivery model (slides 18–22, 96, 133). */
export const phases: Phase[] = [
  {
    num: 1,
    name: "Technical Land",
    owner: "AI CE",
    bullets: [
      "Assess current architecture and the full model wallet.",
      "Run bake-offs and benchmarks on customer data.",
      "Clear compliance and architecture gates; engage the CISO early.",
      "Build early-access (EAP) and prototype entry points.",
    ],
  },
  {
    num: 2,
    name: "Production Engineering",
    owner: "FDE / CE pods",
    bullets: [
      "Commit-gated 4–6 week migration or build sprints.",
      "Connect production data and systems.",
      "Build eval harnesses and guardrails.",
      "Cut over live traffic or activate enterprise workflows.",
    ],
  },
  {
    num: 3,
    name: "Consumption Scale",
    owner: "AI CE + FDE + GTM",
    bullets: [
      "Route for cost and quality (Flash, caching, batch).",
      "Move to provisioned throughput and multi-year commits.",
      "Expand seats and weekly active users.",
      "Replicate via partners, group SIs and blueprints.",
    ],
  },
];

/** Slide 18 play-by-phase grid (WIP; XXX placeholders kept). */
export const phaseGrid = [
  {
    play: "Coding & AI in products",
    land: "Multi-model & tokenomics bake-off: benchmark Gemini, Claude, OpenAI & OSS with Antigravity on customer repos to prove TCO savings.",
    build: "Commit-gated migration sprints: refactor API gateways, build automated eval harnesses, migrate live traffic with zero app rewrite.",
    scale: "Tiered routing & partner scale: route live traffic across Flash, caching and batch; lock in PT; scale via VCs / MSPs.",
  },
  {
    play: "Agentic & Unified App",
    land: "CAIO architecture & Spark pilot: map enterprise data silos and benchmark Gemini Enterprise with multi-model agent routing.",
    build: "Dedicated lighthouse pods: embed FDE + CE pods at anchor accounts to build connectors, domain RAG and agent pipelines.",
    scale: "Autonomous workflows & SI scale: activate users to workflow agents and scale via group SIs.",
  },
  {
    play: "Live Agent & GenMedia",
    land: "Native multimodal prototyping: Gemini Live API, Omni and Imagen prototypes on customer assets.",
    build: "Pooled FDE strike teams: low-latency voice / video pipelines and multimodal guardrails, pilot studios to live production.",
    scale: "High-concurrency launch & PT lock-in: media caching and streaming concurrency for paid B2C rollout.",
  },
  {
    play: "Security",
    land: "XXX (placeholder in the deck)",
    build: "XXX (placeholder in the deck)",
    scale: "Autonomous CodeMender scale: standardize CodeMender in CI/CD and expand autonomous threat hunting.",
  },
];

export const governance = [
  { title: "One owner, one number", detail: "Every cohort has a named owner, a revenue target and a quarterly run-rate KPI." },
  { title: "Proof before scale", detail: "FDE time is gated by a real production or consumption outcome." },
  { title: "Pilot → production, monthly", detail: "Conversion is measured every month, not at year end." },
  { title: "Stickiness over raw tokens", detail: "Win multi-year commits and platform depth so portable workloads are harder to move." },
  { title: "Partner by design", detail: "Startups and large groups covered direct; much of the rest partner-led." },
];

export const kpis = [
  "Share of wallet",
  "$ committed",
  "Pilot → production conversion",
  "Quarterly run-rate",
  "Seat activation / weekly active users (where relevant)",
  "Provisioned-throughput utilization (where relevant)",
];

export const commercialBuckets = [
  { name: "Switch", items: "Anthropic offers, RaMP" },
  { name: "Commit", items: "Savings Plan, Enterprise Agreement offers, custom market pricing" },
  { name: "Start", items: "Startup program" },
  { name: "Adopt", items: "NAL Pen seat offers, vouchers" },
];

export const activation = [
  { day: "Day 30", what: "Top-3 enterprise connectors live; security sign-off." },
  { day: "Day 60", what: "Business-unit champion enablement and role templates." },
  { day: "Day 90", what: "Weekly-active-use / utilization audit gates any seat expansion." },
];

/** Solution deep dives (slides 19–22, all marked WIP). Individual names replaced by roles. */
export const deepDives: DeepDive[] = [
  {
    id: "coding-products",
    title: "Coding & AI in products",
    pod: "DN specialty pod: 2 DN pool AI CEs + 2 dedicated DN FDEs (+ sprint pool)",
    cohorts: "Big existing AI spenders, AI startups, big GCP spenders with low AI",
    wip: true,
    tracks: [
      {
        name: "Coding (Antigravity & enterprise dev environments)",
        focus: "Repo-level bake-offs, EAP onboarding and CI/CD integration",
        land: ["Repo-level bake-off: Gemini, Claude, OpenAI and OSS on customer codebases with Antigravity.", "EAP model seeding for DN engineering leads."],
        build: ["2 dedicated DN FDEs wire Antigravity and coding APIs into IDEs, PR review bots and dev portals.", "Automated, repo-specific eval harness for production readiness."],
        scale: ["Expand from the core AI squad to all engineers and QA automation.", "Route codebase indexing and test generation to Flash and Context Caching."],
      },
      {
        name: "AI in products (B2C / B2B apps & API migration)",
        focus: "Competitor API displacement, gateway refactoring and PT lock-in",
        land: ["Multi-model tokenomics audit on live production prompts vs OpenAI / Anthropic.", "New-feature EAP to co-launch flagship features."],
        build: ["Commit-gated 4–6 week sprints refactor API gateways and prompt templates with zero app rewrite.", "Shadow-to-live cutover from competitor APIs."],
        scale: ["Tiered routing: Pro for complex reasoning, Flash / Batch / Caching for bulk.", "Convert stable run-rate into Provisioned Throughput; scale the long tail via VCs / MSPs."],
      },
    ],
    cadence: [
      "The DN pod works as one permanent unit across PoC and production, with no handoffs.",
      "A rolling top-15 DN list for immediate EAP onboarding when new models ship.",
      "Weekly review with DN AI SS: gateway cutovers, token consumption, PT utilization.",
    ],
  },
  {
    id: "agentic-unified",
    title: "Agentic & Unified App (Gemini Enterprise)",
    pod: "Samsung & ENT pods: 2 ENT pool CEs + 4 dedicated FDEs (2 Samsung · 2 ENT)",
    cohorts: "Samsung, flagship conglomerates, traditional enterprises",
    wip: true,
    tracks: [
      {
        name: "Unified App (Gemini Enterprise)",
        focus: "Clearing Samsung / LG blockers, custom connectors and 30 / 60 / 90-day activation",
        land: ["Clear account blockers up front: Samsung baseline GE feature / connector asks; LG GE security approval with LG CNS.", "Enterprise EAP access to upcoming connectors, admin controls and governance."],
        build: ["Samsung and ENT FDEs build ACL-aware connectors (ERP, SCM, M365, Confluence, groupware).", "Korean domain grounding: search relevance and citation accuracy before rollout."],
        scale: ["30 / 60 / 90-day seat activation tracked on weekly active users.", "Department prompt-athons and role templates (HR, Finance, Sales, R&D)."],
      },
      {
        name: "Agentic (domain workflow agents)",
        focus: "CAIO architecture, custom agent asks and group SI replication",
        land: ["CAIO domain architecture: map high-ROI workflows (SCM, Finance, Customer Ops).", "Escalate strategic client asks (e.g. Galaxy AI, device and ops agents) via PM / Eng + EAP sandboxes."],
        build: ["Lighthouse pod engineering: production multi-agent systems (ADK, A2A, MCP).", "Grounding and eval pipelines on BigQuery / AlloyDB / SAP data."],
        scale: ["From chat to autonomous operations: multi-step agents running 24/7.", "Blueprints replicated across affiliates via Samsung SDS, LG CNS and AutoEver."],
      },
    ],
    cadence: [
      "Day 30: top-3 connectors live and security sign-off. Day 60: BU champions and role templates. Day 90: utilization audit gates expansion.",
      "Named owners for each account blocker, burned down weekly with Product Eng and customer IT / CISOs.",
      "All 4 Samsung / ENT FDEs run EAP tracks on customer data.",
    ],
  },
  {
    id: "live-genmedia",
    title: "Live Agent & GenMedia",
    pod: "Specialty pod: 2 AI CEs + an FDE lead + pooled FDE strike teams",
    cohorts: "Gaming / media DN, telco / retail enterprise, Samsung",
    wip: true,
    tracks: [
      {
        name: "Live Agent (real-time voice / video & AICC)",
        focus: "Gemini Live API prototyping, WebRTC sprints and B2C concurrency",
        land: ["Real-time Korean voice and vision prototypes for AICC, concierge and device scenarios.", "Multimodal EAP for telco, retail and device accounts."],
        build: ["Low-latency WebRTC / SIP integration and sub-second interruption handling.", "Live product-catalog RAG and real-time voice compliance guardrails."],
        scale: ["Full B2C / AICC traffic cutover.", "Multi-quarter Provisioned Throughput for peak B2C hours."],
      },
      {
        name: "GenMedia (Imagen & Veo pipelines)",
        focus: "Brand / game IP studio workshops, automated asset pipelines and batch scale",
        land: ["Imagen and Veo prototypes on customer brand, e-commerce and game IP.", "Creative EAP for Veo editing, style consistency and character control."],
        build: ["4–6 week strike-team sprints into CMS, ad-tech and game engines.", "Copyright filtering, watermarking and style-consistency validation."],
        scale: ["Catalog-wide ad and localization generation via Batch and media caching.", "Studio blueprints replicated through MSPs and creative partners."],
      },
    ],
    cadence: [
      "Strike-team sprints gated by committed B2C / AICC launch dates and target consumption.",
      "Gold-standard Korean voice latency, naturalness and brand-consistency benchmarks.",
      "Bi-weekly launch readiness, latency SLA and PT sizing review with AI SS.",
    ],
  },
  {
    id: "security",
    title: "Security",
    pod: "Security pod: 1 AI CE + a security FDE (to be hired) + Mandiant specialists",
    cohorts: "Flagship conglomerates, financial services, big GCP spenders",
    wip: true,
    tracks: [
      {
        name: "Upfront CISO gate-clearing & AI governance",
        focus: "Korean enterprise / FSI compliance and runtime AI guardrails",
        land: ["Engage CISOs at stage 1–2 to clear data residency, PIPA and FSI hurdles.", "Differentiate on enterprise-grade isolation and zero data retention."],
        build: ["VPC-SC, CMEK, IAM least privilege and DLP inside Agentic / GE sprints.", "Model Armor against prompt injection, jailbreaks and sensitive-data leakage."],
        scale: ["Group-wide CISO pre-approval at holding level (Samsung, LG, Hyundai, FSI).", "Google's security stack as the default layer for new AI workloads."],
      },
      {
        name: "AI-powered SecOps & CodeMender",
        focus: "Autonomous SOC and CI/CD vulnerability remediation",
        land: ["Mandiant threat briefings and SOC readiness reviews.", "CodeMender and Gemini in SecOps via EAP."],
        build: ["CodeMender root-cause analysis and patch PRs wired into CI/CD.", "SIEM ingestion and Gemini-powered alert triage."],
        scale: ["CodeMender across all repos; wider telemetry.", "SOC monitoring and compliance blueprints via MSSP partners."],
      },
    ],
    cadence: [
      "The security CE joins every flagship and financial-services pursuit at discovery.",
      "Paired with the Coding pod (CodeMender on Antigravity wins) and the ENT pod (GE security approvals).",
      "Pre-packaged Korean compliance artifacts (FSI, PIPA, CSAP) to shorten reviews.",
    ],
  },
];
