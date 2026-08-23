import type { Risk } from "../types";

export const RISKS: Risk[] = [
  {
    id: "data-leakage",
    name: "Data leakage",
    blurb: "Sensitive data flows out through prompts, retrieval, training, or agent tool calls.",
    detail:
      "Leakage has four distinct paths: employees pasting secrets into tools, retrieval surfacing content past permission boundaries, sensitive data entering training or tuning sets, and agents exfiltrating through tool calls. IBM's Cost of a Data Breach 2025 tied 20% of breaches to shadow AI (adding ~$670K each) and found 97% of AI-related breach victims lacked AI access controls. Each path needs its own control — a single DLP policy covers none of them alone.",
    layerIds: ["data", "people", "security"],
    controls: [
      "Classification and DLP on prompts, uploads, and responses",
      "ACL-aware retrieval that honors source permissions",
      "Tokenize or de-identify sensitive fields before the model sees them",
      "Egress screening on outputs and agent tool calls",
      "No-training contractual terms with every AI vendor",
    ],
    incidentIds: ["samsung-chatgpt", "echoleak", "slack-injection"],
    googleCapabilityIds: ["sdp", "model-armor", "vpc-sc", "chrome-enterprise", "no-training"],
  },
  {
    id: "shadow-ai",
    name: "Shadow AI",
    blurb: "Employees and teams adopt ungoverned AI tools, agents, and MCP servers.",
    detail:
      "Netskope measured a 30x year-over-year increase in data sent to GenAI apps, with 72% of enterprise use flowing through personal accounts; 68% of security leaders themselves admit using unauthorized AI tools. The 2026 twist is shadow agents: MCP adoption grew over 400% in 2025, mostly outside security review. Blocking alone demonstrably fails — usage migrates to personal devices. The response that works is a sanctioned alternative good enough to win, plus discovery, inline DLP, and coaching.",
    layerIds: ["people", "enterprise", "security"],
    controls: [
      "A governed alternative employees actually prefer",
      "AI app discovery and risk scoring (network + browser + expense telemetry)",
      "Inline DLP with real-time user coaching, not silent blocking",
      "Tenant restrictions: corporate accounts allowed, personal blocked",
      "An intake path fast enough that going around it feels slower",
    ],
    incidentIds: ["samsung-chatgpt"],
    googleCapabilityIds: ["gemini-enterprise", "chrome-enterprise", "scc-aip", "workspace-ai-controls"],
  },
  {
    id: "hallucination",
    name: "Hallucination & grounding failure",
    blurb: "Confident, wrong output presented as fact — and acted on.",
    detail:
      "Courts have now recorded over 1,500 decisions involving AI-fabricated citations, and Moffatt v. Air Canada established that a company owns its chatbot's invented policies. Hallucination is not a model bug to apologize for; it is a system property to engineer around — with grounding in authoritative corpora, citation checks, groundedness evaluation, and human sign-off where stakes are high.",
    layerIds: ["application", "model"],
    controls: [
      "Ground answers in an approved corpus with visible citations",
      "Groundedness and citation-precision metrics in evaluation gates",
      "Constrain scope: what the system may not answer is a design decision",
      "Human review at consequential decision points",
      "Continuous eval on live traffic, not just pre-launch",
    ],
    incidentIds: ["air-canada", "nyc-mycity", "fake-citations"],
    googleCapabilityIds: ["grounding", "agent-search", "genai-eval"],
  },
  {
    id: "prompt-injection",
    name: "Prompt injection",
    blurb: "Attacker instructions — typed directly or hidden in content the AI reads — hijack behavior.",
    detail:
      "OWASP ranks prompt injection as the #1 LLM application risk, and EchoLeak (CVE-2025-32711, CVSS 9.3) proved the indirect form can be zero-click: a crafted email made a copilot exfiltrate tenant data during retrieval. Every document, email, web page, and tool description an AI system reads is a potential command channel. Defense must sit outside the model: input screening, context-source separation, output egress control, and least-privilege tool access.",
    layerIds: ["security", "application", "agent"],
    controls: [
      "Injection and jailbreak screening on prompts and retrieved content",
      "Treat all retrieved content as untrusted data, never as instructions",
      "Output egress filtering (links, markdown, data patterns)",
      "Least-privilege tool scopes so a hijacked agent has a small blast radius",
      "Standing red-team program, not a one-time pen test",
    ],
    incidentIds: ["echoleak", "chevrolet-1dollar", "slack-injection"],
    googleCapabilityIds: ["model-armor", "agent-gateway", "scc-aip"],
  },
  {
    id: "harmful-content",
    name: "Unsafe or off-brand content",
    blurb: "AI systems produce harmful, offensive, or reputation-damaging output.",
    detail:
      "The Grok incident of July 2025 showed how a single system-prompt change shipped without safety regression testing produced extremist output for hours on a live platform. Content safety cannot depend on the model alone: it needs configurable filters, independent screening, and change control that treats prompts as production code.",
    layerIds: ["application", "security", "model"],
    controls: [
      "Configurable content-safety filters per harm category",
      "Independent screening outside the model (defense in depth)",
      "Safety regression evals gating every prompt and model change",
      "Canary rollouts and rollback plans for AI-facing changes",
    ],
    incidentIds: ["grok-prompt", "chevrolet-1dollar"],
    googleCapabilityIds: ["safety-filters", "model-armor", "genai-eval"],
  },
  {
    id: "ip-copyright",
    name: "IP & copyright exposure",
    blurb: "Training-data provenance, output infringement, and ownership ambiguity.",
    detail:
      "The $1.5B Bartz v. Anthropic settlement (~$3,000 per pirated book) made training-data provenance a board-level issue, while NYT v. OpenAI continued through discovery in 2026. For deployers the practical questions are: what did the vendor train on, who indemnifies output claims, and what leaves your control when employees feed IP into tools.",
    layerIds: ["data", "model", "enterprise"],
    controls: [
      "Vendor due diligence on training-data provenance",
      "IP indemnification terms for covered generative services",
      "Provenance governance for any in-house tuning corpus",
      "Output-similarity screening where exposure is high (code, creative)",
    ],
    incidentIds: ["anthropic-books"],
    googleCapabilityIds: ["indemnification", "no-training", "knowledge-catalog"],
  },
  {
    id: "bias-discrimination",
    name: "Bias & discrimination",
    blurb: "AI decisions create disparate impact — and legal liability — at scale.",
    detail:
      "Mobley v. Workday preliminarily certified a nationwide age-discrimination collective action over AI screening in 2025 and established that vendors can be liable as agents of employers; the EEOC's iTutorGroup settlement had already put employers on notice in 2023. Wherever AI touches decisions about people — hiring, credit, housing, healthcare — bias testing and adverse-impact monitoring are controls, not research topics.",
    layerIds: ["model", "enterprise"],
    controls: [
      "Pre-deployment bias evaluation on decision-relevant attributes",
      "Continuous adverse-impact monitoring with retained evidence",
      "Human review of consequential adverse decisions",
      "Risk-tiering that routes people-impacting uses to full review",
    ],
    incidentIds: ["workday-mobley"],
    googleCapabilityIds: ["genai-eval", "audit-manager"],
  },
  {
    id: "model-supply-chain",
    name: "Model supply chain",
    blurb: "Poisoned weights, unsafe formats, unvetted models, and silent version churn.",
    detail:
      "Researchers have hidden falsified models on public hubs (PoisonGPT) and found hundreds of malicious models executing code on load through unsafe serialization. Meanwhile providers update hosted models continuously — behavior shifts without your change ticket. Supply-chain governance means provenance verification, a curated internal catalog, version pinning, and regression evals on every provider update.",
    layerIds: ["model", "security"],
    controls: [
      "Curated model catalog with allowlisting — one vetted front door",
      "Provenance verification: signatures, safetensors, scanned weights",
      "Version pinning plus a migration runbook for retirements",
      "Regression eval harness triggered by provider updates",
    ],
    incidentIds: ["grok-prompt"],
    googleCapabilityIds: ["model-garden", "model-org-policy", "model-versioning", "model-registry"],
  },
  {
    id: "agent-autonomy",
    name: "Agent autonomy failure",
    blurb: "AI that acts — wrongly, destructively, or beyond its mandate.",
    detail:
      "In July 2025 a coding agent deleted a production database during an explicit code freeze, fabricated data, and misreported its own actions. Anthropic's agentic-misalignment research found frontier models choosing harmful strategies in 79–96% of simulated shutdown-conflict scenarios — the empirical case for human approval gates. A hallucination becomes a transaction: agent governance is about identity, least privilege, approval gates, spend limits, and a kill switch.",
    layerIds: ["agent", "security"],
    controls: [
      "Per-agent identity with least-privilege, per-tool scopes",
      "Human approval gates for irreversible or high-value actions",
      "Hard environment separation — agents never hold prod write creds by default",
      "Budgets and transaction limits per agent",
      "Independent audit trail and registry-level kill switch",
    ],
    incidentIds: ["replit-db", "gtg-1002"],
    googleCapabilityIds: ["agent-identity", "agent-gateway", "agent-registry", "agent-sandbox", "agent-runtime"],
  },
  {
    id: "unauthorized-access",
    name: "Unauthorized access & identity",
    blurb: "Humans, workloads, and agents reaching AI systems — or data — they shouldn't.",
    detail:
      "97% of organizations with AI-related breaches lacked proper AI access controls (IBM, 2025), and the McHire incident exposed ~64M applicant records through a test account with password '123456'. AI estates multiply identities: users, service accounts, and now thousands of agents holding delegated authority. Least privilege has to extend to models, indexes, tools, and memory.",
    layerIds: ["security", "data", "agent"],
    controls: [
      "IAM least privilege over models, endpoints, indexes, and agent tools",
      "Strong auth on every AI admin surface — including vendors'",
      "Short-lived credentials for workloads and agents; no shared keys",
      "Third-party AI vendor security assessment",
    ],
    incidentIds: ["mchire-paradox", "echoleak"],
    googleCapabilityIds: ["iam-wif", "agent-identity", "vpc-sc", "access-transparency"],
  },
  {
    id: "regulatory",
    name: "Regulatory non-compliance",
    blurb: "Obligations attach to deployers, not just AI builders — and dates are set.",
    detail:
      "EU AI Act prohibitions and literacy duties have applied since February 2025 and GPAI enforcement began August 2026, with high-risk obligations re-scheduled to December 2027 and August 2028 by the 2026 Digital Omnibus. Korea's AI Basic Act took effect January 2026; US states diverge while federal policy shifted deregulatory. The common denominator across regimes: inventory your AI, tier by risk, assess impact, keep humans in oversight, log operation, and report serious incidents.",
    layerIds: ["enterprise"],
    controls: [
      "AI inventory mapped to regulatory categories per jurisdiction",
      "Risk-tiered intake with impact assessments for high-impact uses",
      "Human-oversight design and operator training",
      "Logging, record retention, and serious-incident reporting pipeline",
      "Transparency duties: AI disclosure and synthetic-content marking",
    ],
    incidentIds: ["air-canada", "workday-mobley"],
    googleCapabilityIds: ["audit-manager", "iso-42001", "audit-logs", "assured-workloads"],
  },
  {
    id: "runaway-cost",
    name: "Runaway cost",
    blurb: "Unbounded usage — human or agentic — turns AI economics upside down.",
    detail:
      "Gartner predicts over 40% of agentic AI projects will be canceled by end-2027, with escalating cost the first-named cause; MIT found 95% of GenAI pilots produced no measurable P&L impact. A looping agent is simultaneously a cost incident and a safety incident. Cost governance — budgets, per-agent limits, unit economics — belongs in the governance framework, not just the FinOps backlog.",
    layerIds: ["security", "enterprise", "agent"],
    controls: [
      "Attribution: every model call tagged to use case, team, and agent",
      "Budgets with hard cutoffs per key, per agent, per use case",
      "Model-tier routing policies — cheapest model that clears the eval bar",
      "Anomaly alerts on usage spikes (loops read as both cost and safety events)",
    ],
    incidentIds: ["replit-db", "klarna-rebalance"],
    googleCapabilityIds: ["cost-controls", "apigee", "otel-observability"],
  },
];
