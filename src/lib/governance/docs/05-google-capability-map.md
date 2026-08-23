# Deliverable 5 — Google Cloud capability map

*Canonical data: `../data/google.ts` (40 capabilities with status + docs URLs), rendered
interactively at `/governance/google`. Sourced from `research/research-google.md`.
Statuses are an August 2026 snapshot — verify per component in deal cycles.*

## Naming (2025–2026) — get this right in front of customers

| Current | Formerly |
|---|---|
| **Gemini Enterprise Agent Platform** | Vertex AI (builder platform; APIs/IAM unchanged) |
| **Gemini Enterprise** | Agentspace (employee-facing agent workplace, Oct 2025) |
| **Agent Runtime** | Vertex AI Agent Engine |
| **Agent Search** | Vertex AI Search |
| **Knowledge Catalog** | Dataplex Universal Catalog |

## Capabilities by framework layer

**1 · Enterprise** — SCC AI Protection (AI inventory/shadow-AI discovery), model
allowlisting org policies, Audit Manager (evidence automation), ISO/IEC 42001
certification, FedRAMP High + HIPAA eligibility, Assured Workloads & sovereign controls,
generative-AI indemnification, Cloud Audit Logs.

**2 · Data** — AI/ML Privacy Commitment (no training without permission), Sensitive Data
Protection (150+ infotypes, inspect/de-identify), VPC Service Controls, CMEK, data
residency & documented zero-data-retention configuration (24h cache off), Knowledge
Catalog lineage, Access Transparency/Approval, GDC air-gapped (Gemini fully
disconnected).

**3 · Models** — Model Garden (curated 200+ models incl. partner MaaS under one
IAM/VPC-SC perimeter), org-policy model allowlists, Model Registry, version pinning with
published retirement dates, Gen AI evaluation service (LLM-as-judge; agent evals in
preview).

**4 · Applications** — Grounding with Google Search and with enterprise data (Agent
Search, ACL-aware, cited), Gemini safety filters (configurable harm categories), Model
Armor (also here: injection/jailbreak + SDP screening), Apigee AI-gateway policies,
IAM/workload identity, Gen AI evaluation in CI.

**5 · Agents** — ADK (OTel-instrumented), Agent Runtime (Sessions + Memory Bank, CMEK),
**Agent Identity** (SPIFFE-based, IAM-mapped), **Agent Registry** (fleet
enable/disable), **Agent Gateway** (Model Armor on tool/MCP calls), **Agent Sandbox**
(gVisor), A2A v1.0 (Linux Foundation, signed Agent Cards), AP2 payment mandates, agent
evaluation & simulation, Gemini Enterprise as governed distribution. *(The 2026 agent
stack is new — expect Preview labels.)*

**6 · Runtime** — Model Armor with **org-level floor settings** enforced inline, via
Apigee, and via load-balancer Service Extensions; SCC AI Protection detectors + virtual
red teaming + agent security dashboard; Cloud Audit Logs + opt-in redacted
request/response logging; OTel GenAI tracing; budgets/DSQ/Provisioned Throughput for
cost governance.

**7 · People** — Gemini Enterprise (sanctioned agent workplace with admin allowlists +
usage audit logs), Workspace AI control center (per-OU controls, label/IRM exclusions,
context-aware access), Chrome Enterprise Premium (browser DLP over any AI site), SCC
shadow-AI discovery.

## Reference architectures (rendered on the site)

1. **Governed employee AI** — Workspace controls + IRM exclusions + CAA + Gemini
   Enterprise + Chrome Enterprise Premium + usage logs (the Macquarie shape).
2. **Governed custom application** — org-policy allowlist + VPC-SC/CMEK/regional
   endpoints + Model Armor floor with SDP + eval gates in CI + audit/content logging +
   Provisioned Throughput (the Deutsche Bank / Commerzbank shape).
3. **Governed agent fleet** — ADK → agent evals → Agent Runtime + Agent Identity +
   Agent Gateway + Sandbox + Registry + SCC agent dashboard (SAIF 2.0's three agent
   principles as products).
4. **AI gateway over a multi-vendor estate** — Apigee token quotas/caching/routing +
   Model Armor policies + LB Service Extensions + SCC (the Goldman/Walmart pattern with
   managed parts).

## Honest gaps (stated on the site, verbatim spirit)

No turnkey GenAI drift monitoring; allowlisting covers Model Garden only; Gemini safety
filters don't apply to partner models (Model Armor is the cross-model control, with
latency/cost); audit logs never contain prompts (content logging is opt-in + customer-
owned); caching on by default (ZDR is configuration); residency can lag newest models;
aggressive model retirements require migration runbooks; open weights leave the control
plane; EU AI Act conformity remains the deployer's; the agent stack is 2026-new.
