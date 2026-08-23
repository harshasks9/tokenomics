import type { Challenge, Vendor } from "../types";

/**
 * Vendor governance landscape, August 2026. Deliberately factual: stated
 * philosophy from each vendor's own documents, capabilities from first-party
 * documentation, and honest notes on what customers must still build.
 */
export const VENDORS: Vendor[] = [
  {
    id: "google",
    name: "Google Cloud",
    philosophy:
      "Principles published as frameworks (AI Principles, Frontier Safety Framework, SAIF 2.0 with its three agent rules), then productized as configurable primitives: org-policy model allowlists, Model Armor floors, VPC-SC perimeters, and an agent control plane (identity, registry, gateway, sandbox). Posture: 'shared fate' — secure defaults plus contractual commitments (no training on customer data without permission; generative AI indemnification).",
    philosophyDocs: "AI Principles · Frontier Safety Framework v3 · SAIF 2.0 · AI/ML Privacy Commitment",
    enforcement:
      "Platform and network layer: org policies in the resource hierarchy, Model Armor inline / at the gateway / at the load balancer, IAM down to agent identity, SCC watching posture across it all.",
    strengths: [
      "Model-agnostic runtime screening with org-wide floor settings (Model Armor)",
      "The most complete agent governance stack shipped to date: identity, registry, gateway, sandbox, payments mandates",
      "Data-perimeter depth: VPC-SC, CMEK, Access Transparency, regional ML processing, air-gapped Gemini",
      "Open-protocol posture: A2A and MCP under the Linux Foundation, AP2 for payments",
    ],
    customerMustBuild: [
      "Use-case intake/registry workflow (Audit Manager evidences controls; it doesn't run your approval process)",
      "GenAI drift monitoring — continuous evals must be assembled from the eval service + observability",
      "Governance for open weights once downloaded (deliberately outside the platform control plane)",
      "EU AI Act conformity itself: risk classification, FRIAs, and oversight design stay with the deployer",
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft / Azure",
    philosophy:
      "Governance as an extension of the M365 compliance estate: the Responsible AI Standard v2 internally, and for customers, identity- and data-centric enforcement — sensitivity labels and Purview DLP flow into Copilot, agents get Entra directory identities, and Agent 365 acts as a tenant-wide agent control plane.",
    philosophyDocs: "Responsible AI Standard v2 · Responsible AI Transparency Reports",
    enforcement:
      "Many layers, many consoles: Purview at the data layer, Entra at identity, Content Safety at model endpoints, Defender for posture, Copilot Control System / Agent 365 at the app and agent layer.",
    strengths: [
      "Deepest data-compliance integration for M365 estates: labels, DLP, eDiscovery over Copilot interactions",
      "Directory-native agent identity (Entra Agent ID) plus a tenant agent registry (Agent 365)",
      "Content Safety with Prompt Shields and groundedness detection with auto-correction",
      "EU Data Boundary complete; in-country Copilot processing in 15 countries",
    ],
    customerMustBuild: [
      "An operating model across five-plus admin surfaces and the E5/E7 licensing that unlocks them",
      "Coverage beyond M365: custom-app and non-Microsoft AI governance is newer and partly preview",
      "Use-case intake/impact-assessment workflow (the RAI Standard describes Microsoft's internal process, not a product for yours)",
    ],
  },
  {
    id: "aws",
    name: "AWS",
    philosophy:
      "Builder primitives over bundled suites: eight responsible-AI 'dimensions', per-service AI Service Cards, and composable governance services — Bedrock Guardrails as a standalone policy engine (ApplyGuardrail works on any model), evaluations as a service, AgentCore for agent infrastructure — assembled by the customer, logged in the customer's account.",
    philosophyDocs: "AWS Responsible AI dimensions · AI Service Cards · ISO 42001 whitepaper",
    enforcement:
      "Service layer, composable: IAM/SCPs gate model access; Guardrails execute on the inference path (when attached); CloudTrail and opt-in invocation logs land in the customer's own account.",
    strengths: [
      "The formal-verification bet: Automated Reasoning checks mathematically verify outputs against encoded policy (GA Aug 2025)",
      "ApplyGuardrail: the cleanest bring-your-own-guardrails API across any model, inside or outside Bedrock",
      "AgentCore: per-session isolated runtime, OAuth token vault, MCP gateway, OTel observability",
      "First major cloud with accredited ISO 42001; clean surveillance audit 2025",
    ],
    customerMustBuild: [
      "Enforcement of guardrail attachment (a developer with InvokeModel can bypass unless SCPs force it)",
      "Audit completeness — invocation logging is off by default",
      "Any AI use-case registry, intake, or tenant-wide inventory (no Purview/Agent-365 analog)",
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    philosophy:
      "Model-provider-first: safety invested in the model and its normative spec — the Model Spec's chain of command (platform > developer > user; tool outputs carry no inherent authority), deliberative alignment for reasoning models, the Preparedness Framework for frontier risk — plus a real workspace admin layer for ChatGPT Enterprise. App-layer safety for API builders ships as open-source components the customer runs.",
    philosophyDocs: "Model Spec · Usage Policies (universal, Oct 2025) · Preparedness Framework v2",
    enforcement:
      "In the model (spec-trained behavior, safety classifiers) and at the account/workspace layer (admin controls, Compliance API). API application-layer enforcement is intentionally the customer's code.",
    strengths: [
      "Published behavior spec (Model Spec) — a public, versioned contract for the instruction hierarchy",
      "ChatGPT Enterprise admin depth: SSO/SCIM, RBAC, connector controls, Compliance API for eDiscovery/DLP",
      "Evals platform with trace grading; AgentKit guardrails and Agents SDK as open components",
      "ISO 42001 coverage for consumer and business products",
    ],
    customerMustBuild: [
      "Managed inline guardrails for API traffic (open-source components are self-hosted and self-operated)",
      "In-region inference: residency is largely at-rest; EU-processing needs typically route via Azure OpenAI",
      "Agent identity, isolation, and registry — no directory or runtime product",
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    philosophy:
      "Safety-research-first, enforced in the model and in frontier-risk process: Constitutional AI with the full constitution published (CC0, Jan 2026), the Responsible Scaling Policy with ASL-3 protections active since May 2025, and unusually deep enterprise controls for a lab — including Claude Code managed settings developers cannot override. Deliberately ships no standalone guardrails product; runtime filtering comes from cloud partners or gateways.",
    philosophyDocs: "Claude's Constitution (published in full) · Responsible Scaling Policy · Usage Policy",
    enforcement:
      "In the model (constitutional training, classifiers), at the frontier process level (RSP gates what ships), and at the workspace/admin layer. Inline filtering by design comes from the distribution channel (e.g., guardrails on Bedrock or Vertex, or a gateway).",
    strengths: [
      "The normative layer is inspectable: customers can read the actual constitution that shaped behavior",
      "Capability-gated deployment policy (ASL levels) with published activation — unique among labs with Google/OpenAI variants",
      "MCP created and donated to the Linux Foundation, with a formal security best-practices spec",
      "Enterprise controls beyond its size: managed settings, Compliance API, customer-managed keys",
    ],
    customerMustBuild: [
      "Runtime filtering, PII redaction, and structured evaluation (no first-party guardrail or managed eval service)",
      "Residency depth — regional inference arrives via Bedrock/Vertex distribution",
      "Tenant hygiene separating commercial (never trained on) from consumer tiers (opt-in training since 2025)",
    ],
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: "employee-leakage",
    question: "How do we stop sensitive data leaking through employee AI use?",
    layerIds: ["people", "data"],
    principle:
      "Provide a governed alternative employees prefer, see all AI usage, and put data controls in the path — coaching before blocking.",
    required: [
      "Enterprise AI tool with no-training terms, SSO, and logging",
      "AI app discovery across network and browser",
      "Inline DLP on prompts and uploads with tenant restrictions",
      "Acceptable-use policy tied to training and access",
    ],
    approaches: [
      "Paved road: sanctioned assistant + progressive blocking of the long tail",
      "Endpoint/browser DLP with real-time coaching (measurably reduces personal-account use)",
      "Zero-PII architectures for the highest-sensitivity flows",
    ],
    vendorNotes: {
      google:
        "Gemini Enterprise as the sanctioned surface; Chrome Enterprise Premium browser DLP over any AI site; Workspace AI controls honor labels and IRM; SCC discovers AI assets cloud-side.",
      microsoft:
        "M365 Copilot with Purview DSPM for AI: discovers usage including third-party AI, applies DLP and sensitivity labels inline, extends eDiscovery to AI interactions.",
      aws: "No employee-assistant estate of its own (Q Business aside); relies on network/endpoint tooling; Bedrock terms give the no-training baseline for internal builds.",
      openai:
        "ChatGPT Enterprise workspace controls plus the Compliance API for DLP/eDiscovery integration with third-party tools; consumer-tier leakage remains a network-control problem.",
      anthropic:
        "Claude for Work with admin controls, IP allowlisting to block personal instances, and a Compliance API; browser-level DLP comes from the customer's stack.",
    },
    askVendors: [
      "Can you distinguish and block personal accounts of your own product on our network?",
      "What exactly is retained from employee prompts, and who can read it?",
      "How do your controls extend to AI tools that are not yours?",
    ],
  },
  {
    id: "prompt-injection",
    question: "How do we stop prompt injection and jailbreaks at runtime?",
    layerIds: ["security", "application"],
    principle:
      "Assume every input — and every retrieved document — is adversarial. Screen both directions, outside the model, at a layer attackers cannot prompt away.",
    required: [
      "Input screening for direct and indirect injection",
      "Retrieved-content and tool-output treated as untrusted data",
      "Output egress filtering (links, exfiltration patterns)",
      "Red-team program with injection suites",
    ],
    approaches: [
      "Inline screening service in the request path (model-agnostic)",
      "Gateway or load-balancer enforcement so coverage doesn't depend on app code",
      "Model-level hardening (instruction hierarchies) as one layer, never the only one",
    ],
    vendorNotes: {
      google:
        "Model Armor: injection/jailbreak detection on any model, enforced inline, via Apigee, or in the load balancer path; floor settings set an org minimum; agent/MCP traffic screened at the Agent Gateway.",
      microsoft:
        "Prompt Shields (direct + indirect, with spotlighting for retrieved content) default-on at Azure OpenAI endpoints; Defender correlates jailbreak attempts into incidents.",
      aws: "Bedrock Guardrails prompt-attack filters; applies to any model via ApplyGuardrail — but only to traffic routed through it; enforcement of attachment is on the customer.",
      openai:
        "Model Spec chain of command trains the hierarchy (tool output carries no authority); AgentKit guardrails offer jailbreak checks as open-source the customer operates.",
      anthropic:
        "Constitutional training plus classifier layers harden the model; no standalone screening service — inline defense comes from Bedrock/Vertex guardrails or a gateway.",
    },
    askVendors: [
      "Show me an indirect injection — instructions inside a retrieved document — being caught.",
      "Is screening enforced even for apps that call the model API directly?",
      "When screening blocks something, is the event logged and alertable for my SOC?",
    ],
  },
  {
    id: "hallucination-control",
    question: "How do we control hallucination in high-stakes outputs?",
    layerIds: ["application", "model"],
    principle:
      "Ground answers in approved sources, measure groundedness continuously, and route consequential outputs through humans — 'the model got better' is not a control.",
    required: [
      "Grounding in curated corpora with citations",
      "Groundedness detection/scoring on responses",
      "Evaluation gates with hallucination metrics per use case",
      "Human sign-off where stakes are high",
    ],
    approaches: [
      "RAG with citation enforcement and answerability thresholds",
      "Groundedness checkers (detect), correctors (rewrite), or formal verification (prove) — three maturity points",
      "Continuous evals on production samples, not just pre-launch",
    ],
    vendorNotes: {
      google:
        "Grounding with Google Search and with enterprise data (Agent Search) with citation metadata; Gen AI evaluation service scores groundedness; Model Armor adds topicality fences.",
      microsoft:
        "Groundedness detection with an auto-correction mode that rewrites ungrounded claims, plus reasoning explanations; evals and safety leaderboards in Foundry.",
      aws: "Contextual grounding checks in Guardrails plus the distinctive Automated Reasoning checks — formal logic verification of outputs against encoded policy rules (for rule-encodable domains).",
      openai:
        "Evals platform with trace grading; grounding is the builder's architecture; hallucination checks ship in open-source guardrails.",
      anthropic:
        "Citations feature and model-level candor emphasis; measurement and grounding architecture are the customer's or the platform partner's.",
    },
    askVendors: [
      "What is your groundedness accuracy claim, and where is the methodology published?",
      "Can the system decline to answer when retrieval is insufficient — and is that measured?",
      "How do I detect quality drift on live traffic, not just in pre-launch tests?",
    ],
  },
  {
    id: "model-approval",
    question: "How do we control which models our teams may use?",
    layerIds: ["model", "enterprise"],
    principle:
      "One vetted catalog with platform-enforced allowlisting — model approval is a preventive control, not a wiki page.",
    required: [
      "Curated model catalog with due-diligence notes",
      "Technical allowlist enforcement at the platform boundary",
      "Version pinning and lifecycle/retirement management",
      "Regression evals triggered by provider updates",
    ],
    approaches: [
      "Platform-native allowlists in the resource hierarchy",
      "Gateway-enforced model routing for multi-provider estates",
      "Internal model proxy/registry for open weights",
    ],
    vendorNotes: {
      google:
        "Model Garden as the curated front door; org-policy constraint vertexai.allowedGenAIModels enforces the allowlist org-wide; pinned versions with published retirement dates. Limitation: governs Model Garden models, not arbitrary self-hosted weights.",
      microsoft:
        "Foundry model catalog (11,000+; 'Direct from Azure' models carry Microsoft SLAs) with model safety leaderboards ranking attack success rates — comparative safety transparency at catalog level.",
      aws: "Bedrock model access is account/IAM-governed; SCPs restrict model families; Service Cards document per-model limits; no single org-wide named allowlist primitive — assembled via IAM policy.",
      openai:
        "Workspace model availability controlled at the org level; API model access per project; the catalog question mostly arises when OpenAI models sit inside someone's gateway.",
      anthropic:
        "Model availability per workspace/API keys; enterprises typically govern Claude through Bedrock/Vertex catalogs or their own gateway.",
    },
    askVendors: [
      "Can I technically prevent — not just discourage — use of unapproved models?",
      "What happens to my workloads when you retire a model version? Show me the calendar.",
      "How do I detect production calls to models outside the approved list?",
    ],
  },
  {
    id: "agent-governance",
    question: "How do we give agents identity, permissions, and audit?",
    layerIds: ["agent", "security"],
    principle:
      "Treat agents as actors: their own identity, least-privilege tool scopes, human gates on consequential actions, an inventory with a kill switch, and an audit trail independent of the agent's self-report.",
    required: [
      "Per-agent identity with delegated-authority records",
      "Scoped tool permissions enforced at a gateway",
      "Fleet registry with enable/disable",
      "End-to-end action tracing; sandboxed execution",
    ],
    approaches: [
      "Directory-native agent identity (agents as directory principals)",
      "Infrastructure-primitive identity (workload identity + OAuth token vaults)",
      "Open-standard identity and interop (SPIFFE-shaped IDs, signed A2A Agent Cards)",
    ],
    vendorNotes: {
      google:
        "Agent Identity (SPIFFE-based, IAM-mapped), Agent Registry (fleet kill switch), Agent Gateway (Model Armor on tool/MCP calls), gVisor Agent Sandbox, Agent Runtime with CMEK-protected memory; SCC's agent security dashboard watches the fleet. Newest stack — check GA status per component.",
      microsoft:
        "Entra Agent ID makes agents directory principals under Conditional Access; Agent 365 adds tenant-wide registry, observability, and Defender/Purview integration — including third-party agents.",
      aws: "AgentCore: per-session isolated Runtime, Identity with OAuth token vault, MCP Gateway, OTel Observability — strong primitives; the tenant-wide registry/operating model is yours to assemble.",
      openai:
        "Agents SDK tracing and AgentKit evals/guardrails; connector registry for data access; no directory-grade agent identity or managed isolation — customer infrastructure.",
      anthropic:
        "MCP authorization spec and security best practices (now Linux Foundation); Claude Code managed settings govern agentic coding tightly; runtime identity/isolation come from the platform you deploy on.",
    },
    askVendors: [
      "Show me the inventory of every agent in my tenant — including ones employees built.",
      "Can I revoke one agent's access in one action, and who is notified?",
      "In the audit trail, can I distinguish the user, the agent, and the tool for a given action?",
    ],
  },
  {
    id: "compliance-evidence",
    question: "How do we prove compliance — residency, retention, audit, certification?",
    layerIds: ["enterprise", "data"],
    principle:
      "Evidence should generate continuously from controls, on a platform whose own AI management is independently certified — with residency and retention understood at the inference level, not just at rest.",
    required: [
      "Platform certifications with meaningful scope (ISO 42001, SOC, sector authorizations)",
      "In-region processing options and explicit retention configuration",
      "Immutable audit logs plus content-logging by deliberate choice",
      "Automated evidence collection against frameworks",
    ],
    approaches: [
      "Certified platform + customer AIMS (the standard shared-responsibility split)",
      "Evidence automation against ISO 42001 / NIST AI RMF / EU AI Act mappings",
      "Sovereign envelopes: EU boundaries, partner-operated controls, air-gapped for the extreme case",
    ],
    vendorNotes: {
      google:
        "ISO 42001 covering the platform; FedRAMP High for generative AI; HIPAA-eligible under BAA; regional ML processing commitments; ZDR as documented configuration; Audit Manager automates evidence; GDC air-gapped runs Gemini fully disconnected.",
      microsoft:
        "ISO 42001 for Foundry Models and M365 Copilot; EU Data Boundary complete with in-country Copilot processing in 15 countries; Purview provides audit/eDiscovery over AI interactions; modified abuse-monitoring opt-out exists.",
      aws: "First major cloud ISO 42001 (Bedrock, Q, Textract, Transcribe); Audit Manager's generative-AI framework (~110 controls) auto-collects evidence; in-region processing per region; invocation logging off by default — a decision to make.",
      openai:
        "ISO 42001 for consumer and business products; SOC 2; data residency at rest in ~10 regions but inference remains largely US-based — the gap to probe for EU-processing requirements.",
      anthropic:
        "ISO 42001 (early among labs), SOC 2, HIPAA-ready configurations, customer-managed keys; deeper residency via Bedrock/Vertex distribution.",
    },
    askVendors: [
      "What exactly is in scope of your ISO 42001 certificate — services and legal entity?",
      "Where does inference run for the specific model I'm buying, and is that contractual?",
      "What is retained by default — caches, abuse monitoring, logs — and what can I turn off?",
    ],
  },
  {
    id: "multi-vendor",
    question: "How do we govern a multi-vendor AI estate with one set of rules?",
    layerIds: ["security", "enterprise", "model"],
    principle:
      "Every vendor's controls stop at its own boundary. A governance layer that spans models — gateway plus portable guardrails plus neutral telemetry — is where enterprises actually standardize.",
    required: [
      "An AI gateway as the single front door: authentication, allowlists, budgets, logging",
      "Guardrail policies that follow traffic across providers",
      "Vendor-neutral telemetry (OTel GenAI) for one audit format",
      "A registry and intake process that is vendor-agnostic by design",
    ],
    approaches: [
      "API-gateway pattern (token quotas, semantic caching, routing, guardrail policies inline)",
      "Bring-your-own-guardrails: one policy applied via standalone screening APIs",
      "Independent governance platforms for registry/intake atop it all",
    ],
    vendorNotes: {
      google:
        "Apigee as the AI gateway (token limits, semantic caching, routing) with Model Armor policies inline across Gemini, OpenAI, Anthropic, and self-hosted backends; Model Armor itself is deliberately model- and cloud-agnostic.",
      microsoft:
        "Azure API Management GenAI policies plus Content Safety as a callable service across models; Defender posture spans Azure, AWS, and GCP AI resources.",
      aws: "ApplyGuardrail as the portable guardrail API for any model anywhere; the gateway itself is typically customer-assembled or third-party.",
      openai:
        "Positioned as one provider behind your gateway; open-source guardrails and evals can run against third-party models too.",
      anthropic:
        "Same: a first-class citizen behind gateways and on Bedrock/Vertex; MCP standardization helps tool governance travel across vendors.",
    },
    askVendors: [
      "Which of your controls still work when the model isn't yours?",
      "Do you emit OpenTelemetry GenAI spans I can correlate across vendors?",
      "What breaks if I put you behind my gateway — streaming, tools, caching?",
    ],
  },
];
