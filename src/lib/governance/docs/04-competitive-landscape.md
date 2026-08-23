# Deliverable 4 — Competitive landscape

*Condensed from `research/research-vendors.md` (fully sourced) and canonical in
`../data/vendors.ts`. Rendered at `/governance/vendors` as a challenge-led comparison,
not a feature matrix.*

## The 2026 baseline (no longer differentiating)

Every major provider now: (a) commits to **no training on business customer data by
default**, (b) holds **ISO/IEC 42001** certification for part of its AI estate, and
(c) ships **some content guardrail**. Scope of certificate and proof mechanics differ;
possession does not.

## What actually differentiates: enforcement architecture

| Provider | Where policy is enforced | Signature strengths | Customers must still build |
|---|---|---|---|
| **Google Cloud** | Platform + network: org-policy allowlists, Model Armor inline/gateway/load-balancer with org floors, IAM to agent identity, SCC posture | Model-agnostic screening with floors; the most complete shipped agent stack (Identity, Registry, Gateway, Sandbox, AP2); data-perimeter depth (VPC-SC, CMEK, Access Transparency, air-gapped Gemini); open protocols (A2A/MCP at Linux Foundation) | Use-case intake/registry workflow; GenAI drift monitoring assembly; governance of downloaded open weights; EU AI Act conformity itself |
| **Microsoft/Azure** | Identity + data estate: Purview labels/DLP into Copilot, Entra Conditional Access, Content Safety at endpoints, Defender posture, Agent 365 tenant plane | Deepest M365 compliance integration; directory-native agent identity + tenant agent registry; groundedness detection with auto-correction; EU Data Boundary + in-country Copilot processing | Operating model across 5+ admin surfaces and E5/E7 licensing; coverage beyond the M365 estate; intake/impact-assessment workflow |
| **AWS** | Composable service layer: IAM/SCPs gate models; Guardrails attach to inference (ApplyGuardrail works on any model); logs land in customer account | Automated Reasoning checks (formal verification of outputs, GA 8/2025 — unique); cleanest BYO-guardrails API; AgentCore isolation/identity/gateway; first CSP with accredited ISO 42001 | Enforcing guardrail attachment (bypassable without SCPs); invocation logging off by default; any tenant-wide AI inventory/registry |
| **OpenAI** | In the model (Model Spec chain of command, deliberative alignment) + workspace admin (Enterprise SSO/SCIM/RBAC, Compliance API) | Public, versioned behavior spec; strong ChatGPT Enterprise admin + eDiscovery APIs; evals platform; Preparedness Framework for frontier risk | Managed inline guardrails for API traffic (OSS components self-run); in-region *inference* (residency largely at-rest); agent identity/isolation/registry |
| **Anthropic** | In the model (published constitution, classifiers) + frontier process (RSP/ASL-3 active since 5/2025) + workspace admin | Inspectable normative layer (full constitution, CC0); capability-gated deployment policy; MCP + security spec (donated to Linux Foundation); Claude Code managed settings devs cannot override | Runtime filtering and managed evals (by design via partners/gateways); residency depth via Bedrock/Vertex; consumer-vs-commercial tenant hygiene |

## Meaningful architectural/philosophical differences

1. **Enforcement altitude.** Endpoint-default filters (Microsoft) vs. attachable policy
   service (AWS) vs. platform+network floors (Google) vs. model-internal (OpenAI,
   Anthropic). Determines what happens when a developer calls the model API directly.
2. **The hallucination bet.** Detection (Google groundedness metrics), detection +
   auto-correction (Microsoft), formal verification for rule-encodable domains (AWS),
   model quality + evals (OpenAI/Anthropic).
3. **Agent identity models.** Directory-native (Entra Agent ID / Agent 365) vs.
   infrastructure primitive (AgentCore OAuth vault) vs. open-standard SPIFFE-shaped
   identity mapped to IAM (Google) vs. DIY (OpenAI) vs. protocol spec (Anthropic/MCP).
4. **Residency depth.** Hyperscalers offer *processing* residency; model-first vendors
   mostly *storage* residency (OpenAI inference remains US-centric; EU processing
   typically routes via Azure OpenAI).
5. **Transparency artifacts.** Anthropic publishes the constitution itself; OpenAI the
   Model Spec; Microsoft transparency reports; AWS per-service AI Service Cards; Google
   frameworks (SAIF/FSF) plus model cards.

## The universal gap

No model vendor productizes the customer's **use-case registry, intake/approval
workflow, or cross-vendor policy enforcement**. Hence two market layers: **AI gateways**
(Apigee, APIM, LiteLLM, Portkey, Kong, Cloudflare, Databricks Unity AI Gateway) as the
practical enforcement point across providers, and **governance platforms** (Credo AI,
Holistic AI, IBM watsonx.governance, ServiceNow AI Control Tower) for registry/intake/
regulatory mapping. The microsite teaches the gateway pattern as challenge 7 and gives
15 vendor-agnostic due-diligence questions.
