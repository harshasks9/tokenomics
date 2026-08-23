import type { ArchPattern } from "../types";

/**
 * Governance profiles per AI architecture — what changes about governance
 * depending on what you are actually deploying.
 */
export const ARCHITECTURES: ArchPattern[] = [
  {
    id: "employee-assistant",
    name: "Employee assistant",
    examples: "Gemini Enterprise · M365 Copilot · ChatGPT Enterprise · Claude for Work",
    description:
      "A general-purpose assistant for the whole workforce, usually with enterprise-data grounding.",
    distinctive:
      "The widest blast radius by population: every employee becomes a model operator, and the assistant inherits every permission problem in your document estate.",
    governanceNotes: [
      { layerId: "people", note: "Rollout gated by training; acceptable use named in behaviors; usage telemetry watched." },
      { layerId: "data", note: "Permissions cleanup before grounding; label/IRM exclusions; DLP on prompts and uploads." },
      { layerId: "security", note: "Tenant restrictions vs. personal accounts; audit logs of employee AI activity." },
    ],
    topRiskIds: ["shadow-ai", "data-leakage", "hallucination"],
    googleNote:
      "Gemini Enterprise is the governed surface: admin agent allowlists, Workspace label/IRM enforcement, context-aware access, usage audit logs — with Chrome Enterprise Premium covering the shadow long tail.",
    googleCapabilityIds: ["gemini-enterprise", "workspace-ai-controls", "chrome-enterprise"],
  },
  {
    id: "enterprise-search",
    name: "Enterprise search & knowledge (RAG)",
    examples: "Agent Search over intranets, wikis, tickets, contracts",
    description:
      "Retrieval-augmented answers over enterprise corpora, with citations.",
    distinctive:
      "The index is a new security boundary: retrieval must honor per-user ACLs, and every over-shared folder becomes an AI answer.",
    governanceNotes: [
      { layerId: "data", note: "ACL-aware indexing, classification-based exclusions, corpus access reviews before launch." },
      { layerId: "application", note: "Citation discipline, groundedness checks, answerability thresholds ('I don't know' as a feature)." },
      { layerId: "security", note: "Indirect-injection defense — retrieved documents are untrusted input." },
    ],
    topRiskIds: ["data-leakage", "hallucination", "prompt-injection"],
    googleNote:
      "Agent Search (formerly Vertex AI Search) does ACL-aware retrieval with grounded generation and citations; Sensitive Data Protection profiles corpora; Model Armor screens both directions.",
    googleCapabilityIds: ["agent-search", "sdp", "model-armor", "grounding"],
  },
  {
    id: "customer-assistant",
    name: "Customer-facing assistant",
    examples: "Support and commerce chatbots, voice ordering, in-app assistants",
    description: "AI that speaks to customers in your brand's name.",
    distinctive:
      "Courts treat its words as your words (Air Canada). Scope fences, authority limits, and human handoff are the difference between Wendy's and the $1 Tahoe.",
    governanceNotes: [
      { layerId: "application", note: "Hard scope fences; no authority over price/contract/advice; confidence-based human handoff." },
      { layerId: "security", note: "Injection screening and output egress control on a public attack surface." },
      { layerId: "enterprise", note: "Legal review of accountability posture; incident path with fix-or-kill SLA." },
    ],
    topRiskIds: ["hallucination", "harmful-content", "prompt-injection"],
    googleNote:
      "Grounding in canonical policy corpora, Gemini safety filters tuned to audience, Model Armor at the edge (load balancer/Apigee), and eval gates on every prompt change.",
    googleCapabilityIds: ["grounding", "safety-filters", "model-armor", "apigee", "genai-eval"],
  },
  {
    id: "custom-app",
    name: "Custom AI application on model APIs",
    examples: "Document processing, summarization services, decision support",
    description: "Your engineers building on hosted foundation-model APIs.",
    distinctive:
      "The pipeline is yours even though the model isn't: validation moves from the model artifact to the system — retrieval + prompt + model + output handling together.",
    governanceNotes: [
      { layerId: "application", note: "Prompts under change control; eval gates in CI; structured output contracts." },
      { layerId: "model", note: "Catalog-approved models only; version pinning; regression evals on provider updates." },
      { layerId: "data", note: "De-identification before external calls; retention posture decided explicitly." },
    ],
    topRiskIds: ["hallucination", "data-leakage", "model-supply-chain"],
    googleNote:
      "The Agent Platform gives the governed defaults: org-policy model allowlists, Gen AI evaluation in CI, VPC-SC perimeter, CMEK, Model Armor floors — controls inherited, not re-implemented per app.",
    googleCapabilityIds: ["model-org-policy", "genai-eval", "vpc-sc", "cmek", "model-armor"],
  },
  {
    id: "open-models",
    name: "Open & self-hosted models",
    examples: "Gemma, Llama, Mistral on GKE/GCE or on-prem",
    description: "Weights you download and serve yourself.",
    distinctive:
      "Maximum control, maximum responsibility: platform guardrails, filters, and logging no longer apply once weights leave the managed control plane.",
    governanceNotes: [
      { layerId: "model", note: "Provenance verification (signatures, safetensors), license review, internal registry as the only source." },
      { layerId: "security", note: "You are the guardrail now: screening, logging, and quotas must be deployed around the model." },
      { layerId: "enterprise", note: "Same catalog entry, owner, and eval evidence as hosted models — no second-class governance." },
    ],
    topRiskIds: ["model-supply-chain", "harmful-content", "unauthorized-access"],
    googleNote:
      "Model Armor is deliberately model-agnostic — the same screening policy covers self-hosted models; SCC AI Protection inventories AI workloads on GKE; Gemma 4 ships under Apache 2.0, which moves usage governance fully to you.",
    googleCapabilityIds: ["model-armor", "scc-aip", "model-garden"],
  },
  {
    id: "single-agent",
    name: "Agent with tools",
    examples: "Coding agents, ops agents, research agents with API access",
    description: "An LLM loop that plans and acts through tools.",
    distinctive:
      "Wrong output becomes wrong action. The Replit incident is the syllabus: environment separation, least privilege, approval gates, independent logs.",
    governanceNotes: [
      { layerId: "agent", note: "Own identity; per-tool scopes; approval gates on irreversible actions; budgets." },
      { layerId: "security", note: "Sandboxed execution; anomaly detection; full action tracing." },
      { layerId: "application", note: "Task scoping and dry-run/planning modes as product features." },
    ],
    topRiskIds: ["agent-autonomy", "prompt-injection", "runaway-cost"],
    googleNote:
      "ADK + Agent Runtime with Agent Identity, gateway-enforced tool scopes, gVisor sandboxing, and OTel traces — SAIF 2.0's three agent principles rendered as products.",
    googleCapabilityIds: ["adk", "agent-runtime", "agent-identity", "agent-gateway", "agent-sandbox"],
  },
  {
    id: "multi-agent",
    name: "Multi-agent systems",
    examples: "Orchestrated agent teams; A2A-connected agents across vendors",
    description: "Agents delegating to agents, possibly across organizational boundaries.",
    distinctive:
      "Failures cascade and authority chains blur: effective permission must be the intersection of the chain, and the audit record must preserve who delegated what to whom.",
    governanceNotes: [
      { layerId: "agent", note: "Delegation-chain records; inter-agent protocol allowlists; per-agent budgets so loops die fast." },
      { layerId: "security", note: "Fleet-level anomaly detection; registry as the single kill switch." },
      { layerId: "enterprise", note: "Autonomy × blast-radius tiering decides which agent teams may exist at all." },
    ],
    topRiskIds: ["agent-autonomy", "runaway-cost", "unauthorized-access"],
    googleNote:
      "A2A v1.0 (Linux Foundation) with signed Agent Cards for cross-vendor trust; Agent Registry and SCC's agent security dashboard watch the fleet; AP2 mandates bound agent-initiated spending.",
    googleCapabilityIds: ["a2a", "agent-registry", "scc-aip", "ap2"],
  },
  {
    id: "embedded-saas",
    name: "AI embedded in SaaS",
    examples: "Copilots inside CRM, HR, ITSM, design, and productivity tools",
    description: "AI features your vendors ship into tools you already run.",
    distinctive:
      "The most-forgotten quadrant: you didn't build it, you can't see inside it, but your data flows through it — and vendor AI incidents (Asana's MCP bug, McHire) become your incidents.",
    governanceNotes: [
      { layerId: "enterprise", note: "Inventory embedded AI per vendor; contract terms on training, retention, sub-processors." },
      { layerId: "data", note: "Data-class mapping per SaaS AI feature; disable-by-default until reviewed." },
      { layerId: "people", note: "Admin toggles and user communication — employees rarely know which copilots are sanctioned." },
    ],
    topRiskIds: ["data-leakage", "shadow-ai", "unauthorized-access"],
    googleNote:
      "This is mostly procurement and inventory discipline. Google-side: SCC AI inventory for cloud-connected AI, Chrome Enterprise for browser-delivered AI features, and the same vendor questions this site's vendor lens teaches.",
    googleCapabilityIds: ["scc-aip", "chrome-enterprise"],
  },
  {
    id: "sovereign",
    name: "Sovereign & air-gapped AI",
    examples: "Government classified, defense, sovereignty-constrained regulated workloads",
    description: "AI where data, models, and operations cannot leave a controlled perimeter — sometimes permanently disconnected.",
    distinctive:
      "The extreme case that proves the model: every governance function must run inside the perimeter, including model serving, evaluation, and audit.",
    governanceNotes: [
      { layerId: "data", note: "Full residency and key custody; provider-access transparency or outright disconnection." },
      { layerId: "enterprise", note: "Assured configurations, personnel controls, accreditation regimes (IL5/IL6-class)." },
      { layerId: "security", note: "In-perimeter screening, logging, and monitoring — no cloud-side dependencies." },
    ],
    topRiskIds: ["regulatory", "data-leakage", "unauthorized-access"],
    googleNote:
      "Google Distributed Cloud air-gapped runs Gemini fully disconnected — authorized for US Secret/Top Secret missions — with Assured Workloads and sovereign partner operation covering the intermediate tiers.",
    googleCapabilityIds: ["gdc-airgapped", "assured-workloads", "cmek", "access-transparency"],
  },
];
