# Vendor AI Governance Landscape: Research Brief

**Prepared:** 2026-08-23 · **Scope:** Microsoft/Azure, AWS, OpenAI, Anthropic; secondary coverage of Databricks, Salesforce, IBM, governance-tooling and observability vendors; AI gateway pattern. **Excluded:** Google Cloud (covered separately).
**Method note:** Claims are sourced primarily from 2025–2026 first-party documentation and announcements, re-verified via web research in August 2026. Items marked **[training knowledge]** in the sources section are background facts not re-verified during this pass. This brief separates (a) stated principles, (b) shipping product capabilities, and (c) gaps customers must close themselves.

---

## 1. Executive summary

The vendor governance landscape has consolidated around a common finding: **every major provider now commits to "no training on business customer data by default," holds ISO/IEC 42001 certification for at least part of its AI estate, and ships some form of content guardrail** — so those three items no longer differentiate vendors. What differentiates them is *where in the stack governance is enforced* and *how much of the governance burden is productized versus left to the customer*.

Four distinct architectures have emerged:

- **Microsoft** treats AI governance as an extension of its M365/Entra/Purview compliance estate. Governance follows identity and data classification: sensitivity labels flow into Copilot, DLP policies block AI processing of labeled content, agents get Entra directory identities, and (since Ignite, November 2025) **Agent 365** acts as a tenant-wide agent control plane. Strength: breadth and integration for M365-centric enterprises. Cost: licensing complexity and console sprawl.
- **AWS** ships **composable builder primitives**: Bedrock Guardrails as a standalone, model-agnostic policy service (including a distinctive formal-verification bet — Automated Reasoning checks, GA August 2025), evaluation as a service, AgentCore for agent identity/isolation/observability, and everything logged into the customer's own account. Strength: control and auditability. Cost: nothing is assembled for you; guardrails only govern traffic that is routed through them.
- **OpenAI** is **model-provider-first**: heavy investment in model-level alignment (Model Spec chain of command, deliberative alignment for reasoning models) and workspace-level admin/compliance tooling for ChatGPT Enterprise, but application-layer safety for API builders is delivered as open-source components (AgentKit Guardrails, Agents SDK) the customer runs and operates.
- **Anthropic** is **safety-research-first and policy-level**: governance is embedded in the model itself (Constitutional AI; the full constitution published January 2026), in frontier-risk process (Responsible Scaling Policy, ASL-3 activated May 2025), and in enterprise admin controls — but Anthropic deliberately ships no standalone moderation/guardrails product, relying on model behavior, trust-and-safety enforcement, and cloud distribution partners (e.g., Bedrock Guardrails around Claude) for runtime filtering.

Two cross-cutting shifts matter for any 2026 framework. First, **agent governance became the center of gravity in 2025**: agent identity (Entra Agent ID, AgentCore Identity), agent registries (Agent 365, Credo AI Agent Registry, Unity Catalog), runtime isolation, and MCP security are now table stakes conversations. Second, the **AI gateway has emerged as the de facto enterprise enforcement point** — a place to centralize authentication, model allowlists, cost controls, logging, and "bring your own guardrails" across heterogeneous providers — precisely because no single vendor's controls cover a multi-provider estate.

---

## 2. Microsoft / Azure

### 2.1 Stated philosophy

Microsoft's canonical document is the **Responsible AI Standard, v2** (published June 2022, 27 pages), which operationalizes six principles — fairness, reliability & safety, privacy & security, inclusiveness, transparency, accountability — into concrete requirements (impact assessments, oversight for sensitive uses, fitness-for-purpose, data governance). It is backed by the Office of Responsible AI and the AETHER committee, supplemented by the published Impact Assessment template, the open-source Responsible AI Toolbox, and annual **Responsible AI Transparency Reports** (first published May 2024) [training knowledge for AETHER/report cadence]. Microsoft's framing: principles → internal standard → engineering tooling → customer-facing products.

### 2.2 Product capabilities by governance function

**Data protection.** **Microsoft Purview** is the anchor. **DSPM for AI** (Data Security Posture Management) is a Purview control center that discovers AI usage (M365 Copilot, agents, and third-party consumer AI apps), captures prompts/responses via collection policies, and applies policy: DLP rules can **block Copilot and agents from processing content bearing specified sensitivity labels**, and Copilot-generated output **inherits the sensitivity label** of source material. Purview extends its existing estate — eDiscovery, Data Lifecycle Management, Communication Compliance, Insider Risk — to AI interactions, which is the heart of Microsoft's "governance woven through the compliance estate" story. At Ignite 2025 Purview DLP was expanded so prompts containing sensitive data can be blocked in-line for Copilot and agents.

**Azure OpenAI data handling.** Prompts and completions are **not used to train** Microsoft or OpenAI foundation models, are not shared with OpenAI, and stay within the customer's Azure tenant/geography. **Abuse monitoring** stores flagged prompts/completions up to 30 days in a per-resource, customer-isolated store for human review; customers with sensitive workloads can apply for **modified abuse monitoring** (opt-out of storage/human review) via a Limited Access form. The **EU Data Boundary** was completed 26 February 2025 (final phase covered professional-services/support data), and in November 2025 Microsoft announced in-country processing for M365 Copilot in 15 countries.

**Content safety.** **Azure AI Content Safety** is a standalone API and the default filter on Azure OpenAI endpoints: harm-category classification (hate, sexual, violence, self-harm) with severity levels and configurable thresholds; **Prompt Shields** for direct jailbreak and *indirect* prompt-injection attacks embedded in documents/images; **groundedness detection** (is the response grounded in supplied sources?) including a **correction** mode that rewrites ungrounded claims and a reasoning mode for explainability; protected-material detection; custom categories. "Spotlighting" (2025) enhances Prompt Shields against injections hidden in retrieved data.

**Model evaluation.** **Azure AI Foundry** (rebranded **Microsoft Foundry** at Ignite 2025) provides a model catalog (11,000+ models; "Direct from Azure" models carry Microsoft SLAs), evaluation SDK with quality and **risk & safety evaluators** (hateful/unfair, sexual, violent, self-harm content; direct/indirect jailbreak vulnerability; protected material), adversarial simulators and an AI Red Teaming Agent (built on PyRIT) [training knowledge for PyRIT lineage], plus **model safety leaderboards** (June 2025) ranking catalog models by Attack Success Rate using benchmarks like HarmBench — a notable move toward comparative safety transparency at the catalog level.

**Agent governance.** This is Microsoft's biggest 2025–2026 investment: **Entra Agent ID** (announced Build, May 2025) gives each agent a first-class directory identity — inventoried under a new application type, subject to Conditional Access, lifecycle management, and least-privilege — covering agents built in Foundry, Copilot Studio, and third-party tools. **Foundry Agent Service** adds per-agent Entra identities, OpenTelemetry-based tracing into Application Insights, and runtime content filtering. **Agent 365** (announced Ignite, November 2025; reported GA May 2026, included in the new Microsoft 365 E7 SKU or as an E5 add-on) is the tenant control plane: agent **registry**, access control, visualization/observability, interoperability (including MCP support in Windows), and security via Defender/Purview/Entra integration — explicitly covering third-party agents, not just Microsoft's. The **Copilot Control System** in the M365 admin center governs the Copilot/agent app layer: agent access, sharing and publishing policies, connector allow/block, lifecycle approval workflows, and usage observability.

**Security posture.** **Microsoft Defender for Cloud** provides AI security posture management (AI-SPM): discovery of an "AI BOM" (models, SDKs, datasets) across Azure, AWS, and GCP (including Vertex AI), misconfiguration recommendations, and runtime threat protection for AI workloads (jailbreak attempts detected via Prompt Shields signals, data poisoning, credential theft), feeding incidents to Defender XDR.

**Compliance certifications.** **Azure AI Foundry Models (including Azure OpenAI) and Security Copilot achieved ISO/IEC 42001:2023 certification in July 2025**; M365 Copilot has its own ISO 42001 certification (recertified 2026). Standard Azure compliance (SOC, ISO 27001, FedRAMP High for Azure OpenAI in Azure Government) applies [training knowledge for FedRAMP detail].

### 2.3 Enforcement architecture

Enforcement is **multi-layer and identity/data-centric**: sensitivity labels and DLP at the data layer (Purview), Conditional Access at the identity layer (Entra), default-on content filters at the model endpoint (Content Safety on Azure OpenAI), posture and runtime detection at the security layer (Defender), and tenant admin policy at the application layer (Copilot Control System / Agent 365). No other vendor enforces governance at as many distinct layers — but the layers live in different portals with different licenses.

### 2.4 Gaps / customer responsibilities

- **Fragmentation and licensing**: full-stack governance requires Purview, Defender CSPM, Entra P-SKUs, and E5/E7-tier M365 licensing; controls span at least five admin surfaces. Customers must build an operating model across them.
- Purview's AI controls are deepest for **M365 Copilot**; coverage of custom Foundry apps and non-Microsoft AI is newer and partly preview-grade — verify per-scenario.
- Content filters and Prompt Shields require **tuning per use case** (false positives/negatives); groundedness detection requires the customer to architect grounding sources.
- The Responsible AI Standard describes **Microsoft's internal process**; there is no product that runs an impact-assessment/approval workflow for the customer's own AI use cases (this is where Credo AI et al. slot in).
- Agent 365 is young (GA 2026); agent sprawl governance, agent-to-agent trust, and non-Entra agent estates remain customer engineering problems.

---

## 3. AWS

### 3.1 Stated philosophy

AWS frames responsible AI as **eight "core dimensions"**: fairness, explainability, privacy & security, safety, controllability, veracity & robustness, governance, transparency. There is no single normative standard document analogous to Microsoft's; instead AWS publishes **AI Service Cards** (per-service transparency artifacts covering intended use, limitations, and design choices; expanded to Amazon Nova and Titan models in December 2024), a Responsible Use of AI Guide, the Well-Architected **Generative AI Lens** with responsible-AI guidance, and an ISO 42001 implementation whitepaper. The philosophy is *builder-centric*: give customers primitives, transparency artifacts, and certifications; the customer composes the governance system. AWS was the **first major cloud provider to achieve accredited ISO/IEC 42001 certification** (Amazon Bedrock, Q Business, Textract, Transcribe), and completed its first surveillance audit with no findings in November 2025.

### 3.2 Product capabilities by governance function

**Content safety & policy enforcement.** **Amazon Bedrock Guardrails** is a standalone, configurable safeguard service with six policy types: **content filters** (hate, insults, sexual, violence, misconduct, prompt-attack detection; configurable strength; text and image), **denied topics**, word filters, **sensitive information filters** (PII detection with block or mask actions, plus regex), **contextual grounding checks** (hallucination detection: groundedness against a source + relevance to the query, with confidence thresholds), and **Automated Reasoning checks**. Guardrails apply to both prompts and responses, offer safeguard **tiers** (June 2025) trading coverage/language support, added coding-use-case support (November 2025), and — critically — the **ApplyGuardrail API** lets customers apply a guardrail configuration to *any* model, including self-hosted or third-party models outside Bedrock. This makes Guardrails AWS's "bring your own guardrails" play.

**Automated Reasoning checks — the formal-verification bet.** Previewed December 2024, **GA 6 August 2025**. Customers encode domain policy (e.g., an HR or lending rulebook) into a formal logic model; at inference, responses are translated into logic and *mathematically checked* against the policy, returning findings (VALID, INVALID, SATISFIABLE, IMPOSSIBLE, TRANSLATION_AMBIGUOUS) with up to a claimed **99% verification accuracy**. This is architecturally distinctive: no other hyperscaler ships formal verification of LLM outputs as a managed guardrail. Honest caveat: it applies to domains that can be captured as rules, requires policy-authoring effort (AWS added natural-language test generation and policy refinement tooling in late 2025), and is not a general hallucination cure.

**Model evaluation.** **Bedrock Evaluations**: automatic metrics, human-evaluation workflows, **LLM-as-a-judge** (GA March 2025), and **RAG evaluation** for Knowledge Bases or custom RAG (GA March 2025) with quality metrics (correctness, completeness, faithfulness) and responsible-AI metrics (harmfulness, answer refusal, stereotyping) plus citation coverage/precision; bring-your-own-inference responses supported.

**Classic ML governance.** The SageMaker trio remains the reference for predictive ML: **Role Manager** (persona-based least-privilege IAM generation), **Model Cards** (intended use, risk rating, training details, evaluation results; auto-populated lineage), **Model Dashboard** (fleet-wide production monitoring with Model Monitor/Clarify integration for drift and bias alerts).

**Agent governance.** **Amazon Bedrock AgentCore** (preview July 2025, **GA 13 October 2025**) is framework- and model-agnostic agent infrastructure: **Runtime** (per-session **complete isolation**, up to 8-hour executions, A2A protocol support), **Identity** (agent identities with OAuth 2.0 flows, secure token vault, identity-aware authorization so agents act on behalf of users or themselves with scoped permissions), **Memory** (managed short/long-term memory with controllable extraction pipelines), **Gateway** (converts APIs/Lambda into MCP-compatible tools; connects existing MCP servers; IAM authorization), **Observability** (OpenTelemetry-based end-to-end tracing into CloudWatch), plus managed Browser and Code Interpreter sandboxes.

**Admin, audit, data handling.** Bedrock **does not use customer prompts/completions to train models and does not share them with model providers**; third-party models run in AWS-managed, provider-inaccessible deployment accounts; data stays in-region, encrypted (KMS CMKs, PrivateLink supported). **Model invocation logging** (opt-in) writes full prompts/responses to the customer's S3/CloudWatch; **CloudTrail** captures all Bedrock API events. **AWS Audit Manager** ships a **generative AI best practices framework (v2, ~110 controls** across governance, data security, incident management, business continuity) that auto-collects evidence for Bedrock and SageMaker usage.

### 3.3 Enforcement architecture

Enforcement is **service-layer and composable**: IAM/SCPs gate who may invoke which models; Guardrails execute at the inference path (attached to invocations, agents, and Knowledge Bases, or invoked standalone via ApplyGuardrail); logging lands in the customer's own account. There is deliberately no tenant-wide "AI console": governance = IAM + Guardrails + Config/CloudTrail + Audit Manager, assembled per organization. The formal-verification capability positions AWS for regulated, rule-bound domains.

### 3.4 Gaps / customer responsibilities

- **Guardrails only govern traffic routed through them.** A developer with `bedrock:InvokeModel` permissions can bypass a guardrail unless the organization enforces guardrail attachment via IAM condition keys/SCPs — a real operational task.
- **Invocation logging is off by default**; audit completeness is a customer decision.
- No first-party **AI use-case registry / approval workflow**, no cross-account AI inventory comparable to Agent 365 or Purview DSPM (Audit Manager collects evidence; it does not govern intake).
- Multi-account sprawl: governance patterns (central gateway account, shared guardrail configs) come from Prescriptive Guidance, not products.
- Responsible-AI program artifacts (impact assessments, risk tiers) are entirely customer-built.

---

## 4. OpenAI

### 4.1 Stated philosophy

Three governing documents. (1) **Usage Policies** — consolidated 29 October 2025 into a **universal policy set** across all products; notable enterprise-relevant prohibitions include provision of licensed-professional advice (legal/medical) "without appropriate involvement by a licensed professional" and "automation of high-stakes decisions in sensitive areas without human review." (2) The **Model Spec** — first released May 2024, substantially updated **12 February 2025** (with further iterations April/September/October/December 2025; CC0-licensed) — specifies intended model behavior and the **chain of command**: platform rules > developer instructions > user instructions, with tool outputs/quoted content carrying **no inherent authority** — effectively a public normative spec of the instruction hierarchy enterprises depend on for prompt-injection resistance. (3) The **Preparedness Framework v2** (15 April 2025) governs frontier risk: tracked categories (Biological & Chemical, Cybersecurity, AI Self-Improvement), two capability thresholds (High/Critical), with deployment gated on safeguards reports. Model-level safety technique of note: **deliberative alignment** — o-series/reasoning models are trained to explicitly reason over the text of safety policies before answering, improving jailbreak robustness while reducing over-refusal.

### 4.2 Product capabilities by governance function

**Data protection.** **No training on business data by default** across ChatGPT Business/Enterprise/Edu and the API. Enterprise workspace retention is admin-configurable; deleted conversations purge within 30 days (absent legal hold). API: inputs/outputs may be retained up to 30 days for abuse monitoring, with **Zero Data Retention (ZDR)** available for eligible endpoints/qualifying use cases. **Data residency** (announced for Europe February 2025, then expanded): at-rest residency for ChatGPT Enterprise/Edu and API projects in Europe, UK, US, Canada, Japan, South Korea, Singapore, India, Australia, UAE. Important nuance: residency covers **data at rest; inference residency remains US-centric** — a gap versus hyperscaler regional inference.

**Admin & audit.** ChatGPT Enterprise: SAML SSO, **SCIM provisioning**, RBAC with group-level permissions, domain verification, connector and custom-GPT allow/block controls. The **Compliance API / Compliance Platform** (Enterprise/Edu) exposes conversation logs, uploaded files, admin actions, auth events, and agent activity for eDiscovery/DLP/SIEM integration (partner integrations exist with major eDiscovery/DLP vendors). The **Admin API + Audit Logs API** covers the API platform (key creation, membership changes, logins, project changes). SOC 2 Type 2 (API and business products), ISO 27001:2022 and 27701, and an **ISO/IEC 42001 AI management system certification covering consumer and business products** are listed on OpenAI's security page; HIPAA BAAs available for qualifying customers.

**Content safety.** The free multimodal **Moderation API** classifies harmful content; platform-side safety classifiers apply to ChatGPT. For builders, **AgentKit** (DevDay, 6 October 2025) includes **Guardrails** — an **open-source, modular safety layer** (PII masking, jailbreak detection, moderation, hallucination checks) configurable in Agent Builder or code — plus the open-source **Agents SDK** (Python/TS) with input/output guardrail hooks, handoffs, and built-in tracing, and the **Connector Registry** for admin-governed data-source connections across workspaces. An **evals platform** (datasets, trace grading, automated prompt optimization, support for third-party models) covers model/agent evaluation.

**Agent governance.** Agents SDK tracing + AgentKit evals provide observability; the Connector Registry and workspace controls govern data access for ChatGPT-side agents. There is no OpenAI equivalent of directory-integrated agent identity (Entra Agent ID) or isolated agent runtime as a service (AgentCore) — agent identity/isolation is the customer's infrastructure problem.

### 4.3 Enforcement architecture

OpenAI enforces primarily **in the model** (Model Spec-trained behavior, deliberative alignment, safety classifiers) and **at the platform account layer** (usage-policy enforcement, abuse monitoring). ChatGPT Enterprise adds a genuine workspace admin layer. For the **API, the application layer is intentionally left to the customer**: guardrails are open-source components you run, not a managed inline service — the clearest expression of "model-provider-first" architecture.

### 4.4 Gaps / customer responsibilities

- **No managed inline guardrail service** for API traffic (moderation endpoint + OSS Guardrails require self-assembly and self-hosting of enforcement).
- **Inference residency** limited (at-rest residency ≠ in-region processing); no customer-managed encryption keys advertised for business tiers [verify per contract].
- DLP/eDiscovery is **integration-dependent** (Compliance API + third-party tools), versus Purview-style native classification.
- No formal agent identity/registry product; no cross-workspace AI inventory.
- Customers needing EU-only processing typically route via **Azure OpenAI** — worth stating plainly in a seller framework.

---

## 5. Anthropic

### 5.1 Stated philosophy

Anthropic's governance identity is **safety-research-first, enforced at the policy/model level**. Key documents: the **Usage Policy**; **Constitutional AI** (2022 research: models trained against an explicit, inspectable set of principles rather than only implicit human feedback); **Claude's Constitution published in full on 22 January 2026** (84 pages, CC0) — a reasons-based document with a priority ordering (broadly: safety > ethics > Anthropic's guidelines/compliance > helpfulness) intended to let the model generalize rather than pattern-match rules; and the **Responsible Scaling Policy (RSP)** (v1 September 2023; updated through 2025) defining **AI Safety Levels (ASL)**. With Claude Opus 4 (May 2025) Anthropic **activated ASL-3**: a deployment standard (narrowly targeted, classifier-based safeguards against CBRN misuse — "constitutional classifiers") plus a security standard hardening model-weight protection; subsequent frontier models (e.g., Opus 4.1 and later) ship under ASL-3. A public **Transparency Hub** and per-model system cards document capability evaluations. The distinctive governance argument: the constitution makes the *normative layer inspectable* — customers can read the actual document that shaped model behavior.

### 5.2 Product capabilities by governance function

**Data protection.** Under Anthropic's **Commercial Terms**, data from the API (first-party or via AWS Bedrock / Google Vertex), Claude for Work (Team/Enterprise), Claude Gov, and Claude for Education is **not used for model training**. Governance-relevant nuance: in **August–September 2025 Anthropic changed consumer terms** — Free/Pro/Max users choose whether chats may be used for training (with up to 5-year retention if opted in). Enterprises should note the consumer/commercial boundary and use network controls to keep employees on the commercial tenant. Enterprise data controls include custom retention, **customer-managed encryption keys**, and IP allowlisting/network access control (blocking personal Claude instances from corporate networks).

**Admin & audit.** Claude Enterprise: SAML SSO, **domain capture**, **SCIM**, RBAC with groups/roles/capabilities (governing which users get which products and connectors), **audit logs**, a **Compliance API** (programmatic access to activity logs, chats, files, projects for eDiscovery/DLP), Analytics API, and spend controls. **Claude Code** (agentic coding) has enterprise-grade controls unusual for a developer tool: **managed policy settings** (`managed-settings.json` deployed via MDM or the admin console) that developers **cannot override**, enforcing tool permissions, file access, MCP server allowlists, network restrictions, hooks, plus OpenTelemetry usage telemetry and per-user spend limits.

**Content safety.** Enforcement is **model- and platform-level**: constitutional training, trust-and-safety classifiers, ASL-3 constitutional classifiers for CBRN-adjacent content, usage-policy enforcement on accounts, and a jailbreak bug-bounty program [training knowledge for bounty]. Anthropic ships **no standalone moderation/guardrails API product** — a deliberate architectural difference.

**Model evaluation.** System cards and published safety evaluations per model; Console tooling for prompt evaluation exists but there is no managed evaluation service comparable to Bedrock Evaluations or Foundry evals; customers use third-party or cloud-partner tooling.

**Agent governance.** Anthropic created the **Model Context Protocol (MCP)** (November 2024) — now the de facto agent-tool connectivity standard — and **donated it to the Agentic AI Foundation under the Linux Foundation in December 2025** (co-founded with Block and OpenAI). The MCP spec includes an authorization model (OAuth 2.1) and a **security best practices** document (confused-deputy, token passthrough, prompt-injection guidance). Anthropic publishes agent safety guidance and the Claude Agent SDK; runtime isolation/identity for agents is left to the customer or platform partners.

**Compliance certifications.** **ISO/IEC 42001:2023** (announced January 2025 — among the first frontier labs certified), ISO 27001:2022, SOC 2 Type I & II, HIPAA-ready configurations; Trust Center at trust.anthropic.com. **Claude Gov** (June 2025): models for U.S. national-security customers in classified environments, stated to undergo the same safety testing; FedRAMP-relevant deployments typically route via cloud partners [training knowledge].

### 5.3 Enforcement architecture

Policy is enforced **in the model** (constitution/RLAIF training), **at the frontier-risk process level** (RSP gates what ships at all), **at the platform trust-and-safety layer** (classifiers, account enforcement), and **at the workspace/admin layer** (Enterprise controls, Claude Code managed settings). There is intentionally no separate inline-filter product layer; when enterprises need one around Claude, they typically get it from the distribution channel (Bedrock Guardrails, Vertex, or a gateway).

### 5.4 Gaps / customer responsibilities

- **No first-party guardrails/moderation service or managed eval service** — runtime filtering, PII redaction, and structured evaluation are customer-assembled or sourced from cloud partners/third parties.
- **Data residency/inference geography** options are thinner than hyperscalers (US-inference options exist; regional inference depth comes via Bedrock/Vertex).
- Smaller compliance/administrative surface than hyperscalers (no posture management, no DLP engine, no directory service) — by design, Anthropic slots into others' estates.
- Consumer-vs-commercial training-data boundary requires explicit tenant hygiene by the enterprise.

---

## 6. Secondary players and the AI gateway pattern

**Databricks.** Governance anchored in **Unity Catalog** (lineage, permissions, audit for data + models) extended to runtime AI by the **Mosaic AI Gateway, now "Unity AI Gateway"**: service policies, built-in/custom/third-party **guardrails**, PII detection, **payload logging into Delta inference tables** (exact prompts/responses, tokens, latency — SQL-queryable), rate/cost controls, and governance of agents and MCP tool calls under the same permission model as data. Strong fit where the lakehouse is already the governed estate.

**Salesforce.** The **Einstein Trust Layer** wraps every Agentforce/Einstein generative call: **zero-data-retention agreements with external LLM providers**, dynamic grounding, data masking, toxicity detection, and an **audit trail** of prompts, grounding data, and responses stored to Data 360. Agentforce adds topic/action scoping as agent guardrails. Governance is strong but scoped to the Salesforce application boundary.

**IBM watsonx.governance.** The most explicit "governance-of-record" product among incumbents: **AI Factsheets** (auto-captured model/prompt metadata), OpenScale-lineage monitoring, and **OpenPages GRC integration**, with pre-configured frameworks for the **EU AI Act, ISO 42001, NIST AI RMF** and automated risk-category assessment. Notably multi-vendor: it aims to govern models running anywhere.

**Governance-tooling startups.** **Credo AI**: SaaS/on-prem governance platform — central **AI use-case registry** (including an Agent Registry for agent capabilities/autonomy levels), risk assessments, **policy packs** (EU AI Act, NIST AI RMF, Colorado SB21-169), evidence collection and reporting; customers include Microsoft and Mastercard. **Holistic AI**: AI inventory, bias/efficacy audits, EU AI Act readiness — similar category. These fill the intake/approval/registry workflow none of the model vendors productize.

**Observability/eval players.** **LangSmith** (LangChain): deep tracing for LangGraph agents, prompt/eval workflows, agent ops. **Langfuse**: open-source (MIT core), self-hostable — favored where data residency demands it; acquired by ClickHouse (January 2026). **Arize** (AX + open-source Phoenix): production-grade online evals, hallucination tracking, and runtime **Guards** that can block/regenerate responses; enterprise editions add audit logs, RBAC, SCIM, retention policies. These are becoming the evidence layer for AI assurance, not just debugging tools.

**The AI gateway pattern.** Because every provider's controls stop at its own boundary, enterprises increasingly insert a **gateway between all apps and all models**: one endpoint providing credential brokering and virtual keys, **model allowlists**, per-team budgets/rate limits, full request/response logging, failover/routing, and a **pluggable guardrail insertion point**. Representative options: **LiteLLM** (open-source, self-hosted; virtual keys, budgets, guardrail hooks), **Portkey** (managed; governance/guardrails-forward), **Kong AI Gateway** (AI traffic as API traffic; plugins including PII redaction and prompt guarding within mature API management), **Cloudflare AI Gateway** (edge-managed; caching, analytics, DLP integration), plus platform-native gateways (Databricks Unity AI Gateway; Azure API Management GenAI policies as the non-Google Apigee analog [training knowledge for APIM detail]). The complementary **"bring your own guardrails"** pattern — AWS **ApplyGuardrail** as a standalone API, OpenAI's open-source Guardrails, Azure AI Content Safety as a callable service, NVIDIA NeMo Guardrails / Guardrails AI OSS [training knowledge] — lets one guardrail policy ride the gateway across heterogeneous models. For a seller framework: the gateway is where customers *actually* standardize governance in multi-vendor reality.

---

## 7. Comparison synthesis

| Governance challenge | Microsoft | AWS | OpenAI | Anthropic | Architectural note |
|---|---|---|---|---|---|
| Stated principles doc | Responsible AI Standard v2 + Transparency Reports | 8 core dimensions + AI Service Cards | Model Spec + Usage Policies + Preparedness Framework v2 | Constitution (published in full, CC0) + Usage Policy + RSP | MS = internal standard; AWS = per-service transparency; OpenAI/Anthropic = public behavior specs; Anthropic uniquely publishes the full normative document |
| Training on business data | No (Azure OpenAI; incl. no sharing with OpenAI) | No (incl. no sharing with model providers; isolated deployment accounts) | No by default (business tiers + API) | No under Commercial Terms (consumer tiers now opt-in/out) | Converged; differentiation is in *proof*: contractual terms, isolation architecture, certifications |
| Inline content safety | Content Safety default-on at endpoint (+Prompt Shields, groundedness+correction) | Bedrock Guardrails: separate composable service; ApplyGuardrail works on any model | Moderation API + OSS AgentKit Guardrails (customer-run) | None as product; model-level constitution + T&S classifiers | Where enforcement lives: endpoint (MS), attached service (AWS), customer code (OpenAI), model itself (Anthropic) |
| Hallucination controls | Groundedness detection w/ auto-correction | Contextual grounding + **Automated Reasoning (formal verification, GA 8/2025)** | Evals + guardrail checks (OSS) | Model behavior; citations; no service | AWS is alone in shipping formal verification as a managed safeguard |
| Model evaluation | Foundry evals, safety leaderboards, AI red teaming agent | Bedrock Evaluations (LLM-judge, RAG eval GA 3/2025) | Evals platform incl. trace grading | System cards; no managed eval service | MS/AWS productize; OpenAI platform-tied; Anthropic publishes evidence, doesn't sell tooling |
| Agent identity | **Entra Agent ID** (directory-native) + Agent 365 registry | AgentCore Identity (OAuth, token vault, scoped delegation) | None productized | MCP auth spec (standard, not service) | Directory-integrated (MS) vs infra primitive (AWS) vs open standard (Anthropic) vs DIY (OpenAI) |
| Agent runtime isolation | Foundry Agent Service (managed) | AgentCore Runtime (per-session isolation, 8h) | Customer infrastructure | Customer infrastructure / partners | The 2025 dividing line between platform vendors and model vendors |
| Audit / eDiscovery | Purview (native classification, DLP, eDiscovery over Copilot) | CloudTrail + opt-in invocation logging into customer account + Audit Manager (110-control GenAI framework) | Compliance API (Enterprise) + Admin/Audit Logs API | Audit logs + Compliance API (Enterprise) | MS governs content natively; AWS gives raw logs you own; OpenAI/Anthropic expose APIs for your tooling |
| Data residency | EU Data Boundary complete (2/2025); in-country Copilot processing (15 countries) | In-region processing per AWS region; cross-region inference opt-in | At-rest residency in ~10 regions; inference largely US | US-inference options; depth via Bedrock/Vertex | Hyperscalers offer *processing* residency; model vendors mostly *storage* residency |
| ISO/IEC 42001 | Yes — Foundry Models & Security Copilot (7/2025); M365 Copilot | Yes — first major CSP (Bedrock, Q, Textract, Transcribe); clean surveillance audit 11/2025 | Yes — AIMS covering consumer + business products | Yes — announced 1/2025 | Now table stakes; scope-of-certificate is the real question |
| Frontier-risk policy | Defers largely to partners' policies (Frontier Governance via OpenAI/partners) [training knowledge] | Provider-neutral (marketplace) | Preparedness Framework v2 (High/Critical thresholds) | RSP / ASL levels; ASL-3 active since 5/2025 | Only the model labs publish capability-gated deployment policies |
| What customer must still build | Cross-portal operating model; use-case intake; non-MS estate coverage | Assembly: enforce guardrail attachment, turn on logging, build registry/intake | App-layer enforcement, DLP integration, agent infra | Runtime filtering, evals, residency via partners | **Universal gap: AI use-case registry, approval workflow, and cross-vendor policy enforcement → gateways + governance platforms** |

---

## 8. Questions customers should ask any AI vendor

1. Is customer data used to train or improve models by **default**, and is that a contract term or a settings toggle? What happens on the consumer tiers my employees might use?
2. What is retained for **abuse monitoring**, for how long, who can read it, and is there a documented opt-out/ZDR path with eligibility criteria?
3. Where does **inference** physically run — not just where data is stored at rest? Which controls break if I require in-region processing?
4. Where in the stack are safety policies **enforced** — model training, platform classifier, attachable service, or a library I must run? What happens to enforcement if a developer calls the model API directly?
5. Can I apply **my own policy** (denied topics, PII rules, grounding requirements) inline, and can that same policy follow me across models/providers (standalone guardrail API)?
6. What is your **hallucination control** story beyond "the model is good" — groundedness scoring, correction, citation enforcement, formal verification — and what accuracy claims are backed by published methodology?
7. Show me the **audit trail** for one prompt end-to-end: who asked, what context was retrieved, what policy fired, what was answered. Which of that is on by default, and who owns the storage?
8. How do **agents** get identities? Can I inventory every agent in my estate, apply conditional access/least privilege, and revoke one agent without breaking others?
9. How is agent tool access (MCP or otherwise) **authorized and audited**? What protections exist against indirect prompt injection through retrieved content and tool results?
10. What is certified under your **ISO/IEC 42001** certificate — which services, which legal entity — and can I see the scope statement and your SOC 2 under NDA?
11. What **evaluation tooling** ships with the platform (safety evals, red teaming, regression gates), and can it evaluate models/agents that are *not* yours?
12. For frontier models: what published policy gates deployment as capabilities grow (RSP/Preparedness-style), and what triggers would change my product's behavior mid-contract?
13. Which admin controls exist to stop **shadow usage** (personal accounts, unsanctioned models) from corporate networks and devices?
14. What is the **licensing path** to the governance features you just demoed — which SKU/tier actually contains DLP, audit, agent registry, and compliance APIs?
15. When your policy enforcement blocks or rewrites an output, is that event **observable to me** (logged, queryable, alertable), or silent?

---

## 9. Sources

**Microsoft** — all [verified 2026] unless noted:
- Responsible AI Standard v2 (PDF): https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Responsible-AI-Standard-General-Requirements.pdf
- Foundry risk & safety evaluators / transparency note: https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/risk-safety-evaluators ; https://learn.microsoft.com/en-us/azure/foundry/concepts/safety-evaluations-transparency-note
- Azure AI Content Safety (Prompt Shields, groundedness): https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview ; .../concepts/jailbreak-detection ; .../concepts/groundedness
- Purview DSPM for AI / Copilot: https://learn.microsoft.com/en-us/purview/ai-m365-copilot ; https://learn.microsoft.com/en-us/purview/dspm-for-ai-considerations
- Defender for Cloud AI security posture: https://learn.microsoft.com/en-us/azure/defender-for-cloud/ai-security-posture
- Entra Agent ID announcement: https://techcommunity.microsoft.com/blog/microsoft-entra-blog/announcing-microsoft-entra-agent-id-secure-and-manage-your-ai-agents/3827392 ; https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id
- Agent 365: https://learn.microsoft.com/en-us/microsoft-agent-365/ ; Ignite 2025 Book of News: https://news.microsoft.com/ignite-2025-book-of-news/ ; Ignite 2025 CCS updates: https://techcommunity.microsoft.com/blog/microsoft365copilotblog/ignite-2025-copilot-control-system-and-related-updates-for-it-and-security-teams/4469768
- Copilot Control System: https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-control-system/management-controls
- EU Data Boundary completion: https://blogs.microsoft.com/on-the-issues/2025/02/26/microsoft-completes-landmark-eu-data-boundary-offering-enhanced-data-residency-and-transparency/ ; in-country Copilot processing: https://www.microsoft.com/en-us/microsoft-365/blog/2025/11/04/microsoft-offers-in-country-data-processing-to-15-countries-to-strengthen-sovereign-controls-for-microsoft-365-copilot/
- ISO 42001 (Foundry Models, Security Copilot): https://azure.microsoft.com/en-us/blog/microsoft-azure-ai-foundry-models-and-microsoft-security-copilot-achieve-iso-iec-420012023-certification/ ; https://learn.microsoft.com/en-us/compliance/regulatory/offering-iso-42001
- Azure OpenAI abuse monitoring / modified abuse monitoring: Microsoft Learn data-privacy docs (titles verified via search; page fetch blocked in this environment)
- [training knowledge]: AETHER committee; Responsible AI Transparency Report cadence; PyRIT lineage of AI Red Teaming Agent; FedRAMP High for Azure OpenAI in Azure Government; APIM GenAI gateway policies.

**AWS** — all [verified 2026] unless noted:
- Bedrock Guardrails: https://aws.amazon.com/bedrock/guardrails/ ; https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html ; ApplyGuardrail: https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-use-independent-api.html ; tiers: https://aws.amazon.com/about-aws/whats-new/2025/06/amazon-bedrock-guardrails-tiers-content-filters-denied-topics
- Automated Reasoning checks GA: https://aws.amazon.com/about-aws/whats-new/2025/08/automated-reasoning-checks-amazon-bedrock-guardrails ; https://aws.amazon.com/blogs/aws/minimize-ai-hallucinations-and-deliver-up-to-99-verification-accuracy-with-automated-reasoning-checks-now-available/
- Bedrock evaluations / RAG eval GA: https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-bedrock-rag-evaluation-generally-available/ ; https://aws.amazon.com/blogs/aws/new-rag-evaluation-and-llm-as-a-judge-capabilities-in-amazon-bedrock
- AgentCore GA: https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available ; docs: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/
- SageMaker governance: https://aws.amazon.com/sagemaker/ai/ml-governance/ ; https://docs.aws.amazon.com/sagemaker/latest/dg/governance.html
- Bedrock data protection: https://docs.aws.amazon.com/bedrock/latest/userguide/data-encryption.html ; https://aws.amazon.com/bedrock/security-compliance
- Audit Manager GenAI framework v2: https://docs.aws.amazon.com/audit-manager/latest/userguide/aws-generative-ai-best-practices.html
- ISO 42001: https://aws.amazon.com/blogs/machine-learning/aws-achieves-iso-iec-420012023-artificial-intelligence-management-system-accredited-certification ; surveillance audit: https://aws.amazon.com/blogs/security/aws-successfully-completed-its-first-surveillance-audit-for-iso-420012023-with-no-findings
- Responsible AI dimensions / Service Cards: https://aws.amazon.com/about-aws/whats-new/2024/12/aws-ai-service-cards-advance-responsible-generative-ai ; GenAI Lens: https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/responsible-ai.html

**OpenAI** — all [verified 2026] unless noted:
- Enterprise privacy: https://openai.com/enterprise-privacy/ ; Security & privacy (certs incl. ISO 42001): https://openai.com/security-and-privacy/ ; Trust portal: https://trust.openai.com/
- Usage Policies (universal update 10/29/2025): https://openai.com/policies/usage-policies/ ; https://help.openai.com/en/articles/12092907-were-updating-our-usage-policies
- Model Spec versions: https://model-spec.openai.com/2025-02-12.html (and later versions) ; https://openai.com/index/sharing-the-latest-model-spec/
- Preparedness Framework v2: https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf ; https://openai.com/index/updating-our-preparedness-framework/
- Deliberative alignment: https://openai.com/index/deliberative-alignment/ ; https://arxiv.org/abs/2412.16339
- Compliance/admin tooling: https://openai.com/index/new-tools-for-chatgpt-enterprise/ ; https://help.openai.com/en/articles/9261474-openai-compliance-platform-for-enterprise-and-edu-customers ; https://help.openai.com/en/articles/11327494-compliance-api-vs-user-analytics-in-chatgpt-enterpriseedu
- Data residency: https://openai.com/index/introducing-data-residency-in-europe/ ; https://openai.com/index/expanding-data-residency-access-to-business-customers-worldwide/ ; https://help.openai.com/en/articles/9903489-data-residency-and-inference-residency-for-chatgpt
- AgentKit / Guardrails / Agents SDK: https://openai.com/index/introducing-agentkit/ ; https://openai.github.io/openai-agents-python/ ; https://openai.com/index/new-tools-for-building-agents/
- [training knowledge]: OpenAI Charter; Moderation API details; safety evaluations hub.

**Anthropic** — all [verified 2026] unless noted:
- RSP & ASL-3: https://www.anthropic.com/responsible-scaling-policy ; https://www.anthropic.com/news/activating-asl3-protections ; https://www.anthropic.com/rsp-updates ; Transparency Hub: https://www.anthropic.com/transparency
- Claude's Constitution (1/22/2026): https://anthropic.com/news/claude-new-constitution ; PDF: https://www-cdn.anthropic.com/d0636f72a9493d279ed36b33987da3430bcb5911/claudes-constitution_webPDF_26-02.02a.pdf
- Consumer terms change (training opt-in, 5-yr retention): https://www.anthropic.com/news/updates-to-our-consumer-terms ; commercial no-training scope: https://platform.claude.com/docs/en/manage-claude/api-and-data-retention
- Claude Enterprise controls: https://claude.com/solutions/enterprise ; https://claude.com/blog/claude-for-enterprise
- Claude Code admin: https://code.claude.com/docs/en/admin-setup ; https://www.anthropic.com/news/claude-code-on-team-and-enterprise
- Certifications: https://privacy.claude.com/en/articles/10015870-what-certifications-has-anthropic-obtained ; https://trust.anthropic.com/ ; ISO 42001: https://www.anthropic.com/news/anthropic-achieves-iso-42001-certification-for-responsible-ai
- Claude Gov: https://anthropic.com/news/claude-gov-models-for-u-s-national-security-customers
- MCP security / Linux Foundation donation: https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices ; https://en.wikipedia.org/wiki/Model_Context_Protocol
- [training knowledge]: Constitutional AI 2022 paper details; jailbreak bug bounty; Claude Agent SDK; Palantir/AWS defense partnership timing.

**Secondary / gateways** — [verified 2026]:
- Databricks Unity AI Gateway: https://docs.databricks.com/aws/en/ai-gateway/ ; https://www.databricks.com/blog/whats-new-unity-ai-gateway-service-policies-guardrails-observability-and-cost-controls-ai
- Salesforce Einstein Trust Layer / Agentforce: https://developer.salesforce.com/docs/ai/agentforce/guide/trust.html ; Trailhead guardrails modules
- IBM watsonx.governance: https://www.ibm.com/products/watsonx-governance ; https://www.ibm.com/think/insights/eu-ai-act
- Credo AI: https://www.credo.ai/product ; Holistic AI comparisons: https://www.kosmoy.com/resources/blog/credo-ai-vs-holistic-ai/
- Observability: https://langfuse.com/resources/engineering/best-phoenix-arize-alternatives ; https://www.marktechpost.com/2026/08/09/top-llm-observability-and-evaluation-platforms-in-2026-langfuse-langsmith-braintrust-arize-and-more-compared/
- Gateways: https://guptadeepak.com/tools/top-5-ai-gateways-2026/ ; https://contabo.com/blog/litellm-vs-ai-gateways/ ; https://www.braintrust.dev/articles/ai-gateway-comparison-2026
