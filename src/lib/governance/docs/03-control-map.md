# Deliverable 3 — Governance control map

*Condensed from the canonical data in `../data/layers.ts` (controls, owners, mechanisms,
standards) and `../data/risks.ts` (risk↔layer↔incident mapping). The site renders the
full map at `/governance/stack` and per layer under the L2/L3 views.*

## Layer 1 — Enterprise Governance

**Key risks:** regulatory non-compliance · shadow AI · runaway cost

| Control | Owner | Technical mechanisms | Standards hooks |
|---|---|---|---|
| AI inventory / registry | CAIO/CDAO + platform | Registry tooling, AI asset discovery, intake integration | EU AI Act registration, ISO 42001 A.6, NIST GOVERN |
| Risk-tiered intake (two lanes) | AI governance council | Tiering rubric mirroring EU classes; workflow tooling | EU Art. 6, ISO 42005 |
| Accountable operating model | CEO / board delegate | Charter, RACI per system, council cadence | ISO 42001 leadership, three lines of defense |
| Policy that compiles | Governance + platform | Policy-to-control traceability matrix; platform defaults | Gartner TRiSM, ISO 42001 Annex A |
| Regulatory mapping & evidence | Legal / compliance | Evidence automation, incident-reporting pipeline with clocks | EU/Korea/state laws, ISO 42001 certification |

## Layer 2 — Data Governance

**Key risks:** data leakage · IP & copyright · unauthorized access

| Control | Owner | Technical mechanisms | Standards hooks |
|---|---|---|---|
| Classification before connection | CDO + data owners | Auto-classification, labels, DLP infotypes, IRM exclusions | EU Art. 10, GDPR, ISO 42001 |
| ACL-aware retrieval | Platform team | Permission-trimmed indexes, per-user retrieval contexts | Least privilege, SOC 2 |
| De-identification pipeline | Security + data eng | DLP inspect/de-identify templates, tokenization, redacted logs | HIPAA de-id, GDPR minimization |
| Residency & retention posture | Legal + platform | Regional endpoints, ZDR configuration, vendor DPAs | GDPR, sector residency, sovereignty |
| Provenance & lineage | CDO + ML platform | Catalogs, automatic pipeline lineage, dataset cards | EU GPAI transparency, copyright |

## Layer 3 — Model Governance

**Key risks:** model supply chain · bias & discrimination · hallucination · IP

| Control | Owner | Technical mechanisms | Standards hooks |
|---|---|---|---|
| Approved model catalog | AI platform team | Curated catalog + org-policy allowlists | Supply chain, ISO 42001 A.10 |
| Model due diligence | Second line (AI risk) | Model/system cards, license review, signature verification | EU GPAI transparency, OWASP LLM03 |
| Evaluation gates | Product + eval function | Golden datasets, eval harness in CI, calibrated LLM judges | NIST MEASURE, EU Art. 15 |
| Version & lifecycle management | Platform team | Version pinning, retirement calendars, update-triggered regression | Change management, SR 11-7 lineage |
| Bias & safety testing | Second line + red team | Bias suites, adversarial testing, retained evidence | EEOC exposure, EU high-risk, NIST GAI |

## Layer 4 — Application Governance

**Key risks:** hallucination · unsafe content · prompt injection · data leakage

| Control | Owner | Technical mechanisms | Standards hooks |
|---|---|---|---|
| Grounding & citation discipline | Product team | RAG over curated corpora, grounded-generation APIs, groundedness checks | Hallucination controls, EU transparency |
| Prompt & config change control | Engineering | Prompts in VCS, eval gates in CI, canary + rollback | Change management, NIST MANAGE |
| Output validation & egress | Engineering + security | Response screening, DLP on outputs, link neutralization | OWASP LLM05 |
| Scope fences & human handoff | Product + business owner | Topicality controls, business-rule guards, confidence thresholds | EU Art. 26-shape oversight |
| App identity & entitlements | Platform + security | Per-app identities, scoped entitlements, per-use-case keys | Least privilege, SOC 2 |

## Layer 5 — Agent Governance

**Key risks:** agent autonomy failure · prompt injection · unauthorized access · runaway cost

| Control | Owner | Technical mechanisms | Standards hooks |
|---|---|---|---|
| Agent identity | Security / IAM | SPIFFE-style IDs mapped to IAM, OAuth token exchange | SAIF 2.0, IETF drafts |
| Least-privilege tool scopes | Platform + security | Per-tool allowlists, brokered short-lived credentials, gateway scopes | OWASP Agentic Top 10 |
| Human approval gates | Business owner per agent | Action tiering, approval workflows in the loop | EU oversight shape, SAIF |
| Budgets & mandates | Finance + platform | Token/spend budgets with cutoffs, AP2-style signed mandates | AP2, FinOps for AI |
| Registry & kill switch | AI platform team | Fleet registry, credential revocation, gateway cut-off, sandbox teardown | Inventory-first, Gartner |
| Memory governance | Platform + privacy | TTLs, provenance tags, inspection and erasure APIs | OWASP memory poisoning, GDPR |

## Layer 6 — Runtime Security & Observability

**Key risks:** prompt injection · data leakage · unauthorized access · runaway cost · unsafe content

| Control | Owner | Technical mechanisms | Standards hooks |
|---|---|---|---|
| Runtime screening floor | CISO | Screening service with org floors; gateway + LB integration | TRiSM runtime layer, OWASP LLM01/02 |
| AI security posture management | Security operations | AI-SPM inventory, virtual red teaming, threat detectors | SAIF, MITRE ATLAS |
| End-to-end tracing | Platform + SRE | OTel GenAI conventions, trace viewers, correlated logging | EU logging duties |
| Audit-grade logging | Security + compliance | Immutable admin logs; opt-in content logs with redaction | EU Art. 12 shape, SOC 2 |
| AI incident response | SecOps + governance | AI runbooks, kill switches, reporting templates with deadlines | EU Art. 73 |
| Cost enforcement | FinOps + platform | Gateway token quotas, budgets with cutoffs, anomaly alerts | FinOps for AI |

## Layer 7 — People Governance

**Key risks:** shadow AI · data leakage · hallucination (verification failures)

| Control | Owner | Technical mechanisms | Standards hooks |
|---|---|---|---|
| Sanctioned alternative (paved road) | CIO / workplace team | Enterprise AI workplace, admin controls, agent allowlists, logging | Paved-road pattern |
| Shadow-AI discovery | Security | SASE/CASB discovery, browser telemetry, cloud AI inventory | IBM/Netskope findings |
| Inline coaching & DLP | Security | Paste/upload controls, tenant restrictions, coaching prompts | Measured coaching effect |
| Acceptable use naming behaviors | HR + legal + security | AUP tied to login, attestation, role annexes | EU Art. 4, professional duties |
| Literacy tied to access | HR / enablement | Training gating access tiers, completion telemetry | EU Art. 4, Macquarie pattern |
