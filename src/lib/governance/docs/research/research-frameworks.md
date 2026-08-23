# AI Governance Frameworks, Standards, and Regulation — Research Brief

**Prepared:** 2026-08-23 · **Purpose:** source material for an enterprise AI Governance framework aimed at Google Cloud sellers and their customers.
**Verification legend:** [verified 2026] = confirmed via web research in August 2026 against primary or reputable secondary sources. [training knowledge] = well-established fact not re-verified this pass. Legal-status labels: **REGULATION** (binding law) / **STANDARD** (certifiable or auditable) / **FRAMEWORK** (voluntary guidance) / **VENDOR/ANALYST** (commercial guidance).

---

## Executive summary

Across regulators, standards bodies, security researchers, and consultancies, a remarkably consistent picture of what AI governance *is* has emerged by 2026: **a risk-based management system that spans the full AI lifecycle, assigns named human accountability, and is enforced by technical controls at runtime — not just policies on paper.**

Five structural observations dominate the source base:

1. **The stack is converging.** Nearly every serious framework decomposes into the same layers: principles → policies/operating model → risk processes per use case → controls → technical enforcement → assurance/audit. NIST expresses this as four functions (Govern/Map/Measure/Manage); ISO/IEC 42001 as a certifiable management system; Gartner AI TRiSM as four technology layers; CSA as 18 control domains; the EU AI Act as risk tiers with per-tier obligations.
2. **Regulation is real but re-sequenced.** The EU AI Act is in force, with prohibitions, AI literacy, GPAI-model rules, and (since 2 Aug 2026) most transparency obligations applying — but the high-risk regime was deferred by the "Digital Omnibus on AI" (Regulation (EU) 2026/1744, in force 27 July 2026) to **2 December 2027** (Annex III) and **2 August 2028** (Annex I). [verified 2026] The US moved sharply deregulatory in 2025–2026, including a December 2025 executive order attacking state AI laws; states (Colorado, California, Texas) and Korea filled the gap with narrower laws. [verified 2026]
3. **The deployer is now a regulated party.** EU Article 26, Korea's high-impact regime, and state transparency laws all impose duties on enterprises that merely *use* AI — human oversight, input-data governance, monitoring, disclosure, incident escalation. Most enterprise customers are deployers, not providers.
4. **Security frameworks have merged into governance.** OWASP (LLM Top 10 2025; Agentic Top 10, Dec 2025), MITRE ATLAS, CSA's AI Controls Matrix, Google SAIF 2.0/CoSAI, and NIST's COSAiS overlays translate governance intent into named threats and controls — with 2025–2026 attention pivoting hard to **agentic AI** (tool misuse, memory poisoning, identity/privilege abuse, runaway autonomy).
5. **The gap is operationalization.** Consultancy research agrees that most organizations have principles and programs, but very few have governance embedded operationally (Accenture/WEF: <1% fully operational; McKinsey 2026: average trust maturity 2.3 of 4, with agentic governance the weakest dimension). [verified 2026]

For a seller-facing framework, the credible position is: *regulation defines the floor and the vocabulary; ISO 42001 defines the auditable management system; NIST defines the risk process; security frameworks define the technical control set; and the differentiator is runtime enforcement plus evidence generation.*

---

## 1. NIST AI Risk Management Framework (AI RMF 1.0) and its 2025–2026 ecosystem

**Type: FRAMEWORK (voluntary, US-origin, de facto global reference).**

**What it is.** NIST AI RMF 1.0 (NIST AI 100-1), released January 2023, is a voluntary framework for managing risks of AI to individuals, organizations, and society, built around trustworthiness characteristics (valid & reliable; safe; secure & resilient; accountable & transparent; explainable & interpretable; privacy-enhanced; fair with harmful bias managed). [training knowledge]

**Structure/taxonomy.** Four functions, each with categories/subcategories forming a control-like core [training knowledge, structure unchanged as of 2026]:
- **GOVERN** — cross-cutting: policies, accountability structures, culture, workforce, third-party risk.
- **MAP** — establish context: use case, intended purpose, stakeholders, risk identification.
- **MEASURE** — quantitative/qualitative assessment: TEVV (test, evaluation, verification, validation), tracking of trustworthiness characteristics.
- **MANAGE** — prioritize, treat, monitor risks; incident response; third-party management.

**Generative AI Profile (NIST-AI-600-1).** Released **26 July 2024** as the official cross-sectoral companion for generative AI. Defines **12 GAI risk categories** — CBRN information or capabilities; confabulation; dangerous, violent or hateful content; data privacy; environmental impacts; harmful bias and homogenization; human-AI configuration; information integrity; information security; intellectual property; obscene/degrading content; value chain and component integration — with 200+ suggested actions mapped to Govern/Map/Measure/Manage, organized around governance, content provenance, pre-deployment testing, and incident disclosure. [verified 2026]

**2025–2026 status.**
- **America's AI Action Plan (23 July 2025)** directs NIST to revise the AI RMF to "eliminate references to misinformation, Diversity, Equity, and Inclusion, and climate change." The revision is in process as of 2026; the RMF remains voluntary. [verified 2026]
- **Cyber AI Profile:** preliminary draft **NIST IR 8596** released December 2025 (Cybersecurity Framework profile for AI); Workshop #2 held 14 January 2026. [verified 2026]
- **COSAiS — SP 800-53 Control Overlays for Securing AI Systems:** concept paper released August 2025; NIST is developing overlays tailoring SP 800-53 controls to AI use cases — adapting/using generative AI, using and fine-tuning predictive AI, using agentic AI, and (per the concept series) single-agent and multi-agent systems. An annotated discussion draft ("Using and Fine-Tuning Predictive AI") circulated **8 January 2026** with comments due 13 February 2026; overlays remain **in active development (drafts), not final**, as of Aug 2026. NIST also stood up a public Slack community for overlay development. [verified 2026; Slack detail training knowledge]
- **New profile work:** concept note for an AI RMF Profile on Trustworthy AI in Critical Infrastructure released **7 April 2026**. [verified 2026]

**Implications for deployers.** The RMF is the least politically contested, most mappable skeleton for an enterprise program (ISO 42001, CSA AICM, and the EU AI Act all cross-map to it). Its Govern-Map-Measure-Manage verbs are the best available *process* loop; COSAiS will become the bridge from AI governance to existing FedRAMP/800-53 security programs — relevant to any US public-sector-adjacent customer.

---

## 2. ISO/IEC standards: 42001, 23894, 42005, 42006

**Type: STANDARD (voluntary to adopt; 42001 is certifiable).**

- **ISO/IEC 42001:2023 (AI management systems — AIMS).** Published December 2023; the first certifiable AI management-system standard, structurally analogous to ISO 27001: context, leadership, planning, support, operation (including AI risk assessment, AI impact assessment), performance evaluation, improvement, plus Annex A controls (38 controls in 9 control groups covering policies, internal organization, resources, impact assessment, lifecycle, data, information for interested parties, use, and third parties). [training knowledge; publication date verified 2026]
- **ISO/IEC 23894:2023 (AI risk management).** Guidance (not certifiable, no "shall" requirements) applying ISO 31000:2018's risk-management process to AI: AI-specific risk sources, events, consequences, and treatments. Functions as the risk-process engine inside a 42001 AIMS. [verified 2026]
- **ISO/IEC 42005:2025 (AI system impact assessment).** Published **May 2025**; guidance standard (~39 pages) giving a structured, lifecycle-oriented method for assessing AI system impacts on individuals, groups, and society — the natural template for algorithmic/fundamental-rights impact assessments demanded by EU/Korean/state law. Not certifiable. [verified 2026]
- **ISO/IEC 42006:2025 (requirements for certification bodies).** Published **7 July 2025**; sets accreditation requirements (building on ISO/IEC 17021-1) for bodies auditing and certifying AIMS — the credibility layer that makes 42001 certificates trustworthy and consistent. Accreditation bodies (e.g., Standards Council of Canada) have published transition plans. [verified 2026]

**Adoption status as of 2026.** ISO 42001 has moved from novelty to procurement requirement. Verified certifications include:
- **AWS** — first major cloud provider with accredited certification (announced November 2024); scope includes Amazon Bedrock, Amazon Q Business, Amazon Textract, Amazon Transcribe. [verified 2026]
- **Microsoft** — certified for GitHub Copilot, Microsoft 365 Copilot, Copilot Studio, Security Copilot, and Microsoft Foundry (Azure AI). [verified 2026]
- **Google Cloud** — ISO/IEC 42001:2023 certification covering Google Cloud Platform, Google Workspace, and the Gemini app. [verified 2026]
- **Anthropic** — certified January 2025, among the first frontier labs. [verified 2026]
- **OpenAI** — states ISO/IEC 42001:2023 coverage for consumer and business products on its security/trust page. [verified 2026]
- Third-party trackers list hundreds of certified organizations across industries by 2026, and buyers increasingly ask for 42001 in vendor due-diligence. [verified 2026, secondary sources]

**Implications for deployers.** 42001 is the only *certifiable* claim an enterprise can make about AI governance today, and the EU explicitly anticipates harmonized standards as the compliance route for the (now-deferred) high-risk regime. Pragmatic pattern in the sources: **42001 = the management shell; 23894 = risk process; 42005 = impact-assessment method; 42006 = audit trust.** For Google Cloud sellers: all three hyperscalers now hold 42001, so "certified platform + customer's own AIMS" is the standard shared-responsibility pitch.

---

## 3. EU AI Act — status as of August 2026

**Type: REGULATION (binding; extraterritorial reach to anyone placing systems on the EU market or whose outputs are used in the EU).** Regulation (EU) 2024/1689; entered into force 1 August 2024. [training knowledge]

### 3.1 What is in force now (Aug 2026)

- **2 Feb 2025:** Prohibited practices (Art. 5: social scoring, exploitative manipulation, untargeted facial-image scraping, emotion recognition at work/school, certain predictive policing, most real-time remote biometric ID) and **AI literacy** duty (Art. 4) apply. [training knowledge, consistent with 2026 sources]
- **2 Aug 2025:** GPAI model obligations (Chapter V), governance structures (AI Office, AI Board), and Member-State penalty regimes apply. GPAI models already on the market before 2 Aug 2025 have until **2 Aug 2027** to comply (Art. 111(3)). [verified 2026]
- **2 Aug 2026:** **Commission enforcement powers over GPAI providers begin** (fines up to 3%/€15M), and **most Article 50 transparency obligations apply**: telling people they are interacting with AI (chatbots), marking synthetic content in machine-readable form, disclosing deepfakes, and informing people subject to emotion recognition/biometric categorization. The Digital Omnibus granted a grace period **until 2 December 2026** for machine-readable marking by generative systems already on the market before 2 Aug 2026. [verified 2026]

### 3.2 The Digital Omnibus on AI — the big 2026 change

- The Commission proposed the "Digital Omnibus" package **19 November 2025**; the European Parliament approved the AI portion **16 June 2026** (423–57); adopted as **Regulation (EU) 2026/1744**, published in the Official Journal **24 July 2026**, in force **27 July 2026**. [verified 2026]
- **High-risk obligations deferred with fixed dates (not a conditional "stop-the-clock"):** Annex III standalone high-risk systems → **2 December 2027**; Annex I product-embedded high-risk AI → **2 August 2028**. [verified 2026]
- Other changes [verified 2026]:
  - **Two new prohibited practices** (AI generating non-consensual intimate imagery and CSAM), applying 2 December 2026.
  - **Registration simplification** — providers who conclude an Annex III system is *not* high-risk (narrow/procedural task exemption, Art. 6(3)) face reduced EU-database registration burden.
  - **SME/small-mid-cap (SMC) simplifications** — simplified technical documentation, proportionate penalties; narrowed "safety component" definition.
  - **Grandfathering** — systems already on the market before the new dates avoid full high-risk obligations until substantially modified.
  - **AI literacy softened** — from ensuring a level of literacy to taking measures to *support* literacy.
- Amends the AI Act plus the EASA and Machinery Regulations; positioned by the Commission as burden-reduction. EDPB/EDPS issued a critical joint opinion (Jan 2026). [verified 2026]

### 3.3 GPAI regime and the Code of Practice

- GPAI providers (Art. 53): technical documentation (Annex XI), information to downstream providers (Annex XII), a copyright-law compliance policy, and a **public summary of training content** (Commission template published July 2025). Systemic-risk models — presumed at **>10^25 FLOPs** cumulative training compute (Art. 51) — additionally owe evaluations incl. adversarial testing, systemic-risk assessment/mitigation, serious-incident reporting to the AI Office, and cybersecurity protection (Art. 55). Free/open-source GPAI is exempt from some duties but still owes copyright policy and the training-data summary. [verified 2026]
- **GPAI Code of Practice** (final version published 10 July 2025; three chapters: Transparency, Copyright, Safety & Security). Signing creates a presumption-of-conformity "safe harbor." Signatories include **Google, Microsoft, OpenAI, Anthropic, Amazon, IBM, Mistral AI** and ~20+ others; **Meta refused to sign**; **xAI signed only the Safety & Security chapter**. Non-signatories must demonstrate compliance by alternative means — obligations bind regardless. [verified 2026]

### 3.4 Penalties (Art. 99) [verified 2026]

| Violation | Maximum fine |
|---|---|
| Prohibited practices (Art. 5) | €35M or 7% of global annual turnover (whichever higher) |
| Most other obligations, incl. deployer duties (Art. 26), GPAI, transparency (Art. 50) | €15M or 3% |
| Supplying misleading information to authorities | €7.5M or 1% [training knowledge] |
| SMEs/SMCs | proportionate treatment (lower of the amounts) [verified 2026] |

### 3.5 Provider vs deployer — and what deployers must actually do

- **Provider:** develops an AI system/GPAI model and places it on the market under its own name/brand. **Deployer:** uses an AI system under its own authority in a professional context. A deployer *becomes* a provider if it rebrands, substantially modifies a high-risk system, or repurposes a system into high-risk use (Art. 25). [training knowledge; role analyses verified 2026]
- **Deployer duties today (Aug 2026):** stop prohibited uses; support AI literacy; Article 50 duties where applicable (disclose deepfakes; inform people about emotion-recognition systems). **From 2 Dec 2027 (Annex III):** Article 26 — use per provider instructions; assign competent, trained, supported human oversight; ensure relevant, representative input data; monitor operation; retain auto-generated logs (≥6 months); inform workers before workplace use; cooperate with authorities; suspend and escalate on serious risk/incident. Public bodies and some private deployers (credit, insurance) also owe fundamental-rights impact assessments (Art. 27). [verified 2026 for Art. 26 core; Art. 27 detail training knowledge]
- **Supporting guidance status:** Commission draft guidance + template on **serious-incident reporting (Art. 73)** published 26 September 2025 (report within 15 days; 10 days for death; 2 days for critical-infrastructure disruption). Draft **Article 6 high-risk classification guidelines** published **19 May 2026**, consultation closed 23 June 2026 — final guidelines pending as of Aug 2026. [verified 2026]

**Implication:** an enterprise deploying (not building) AI in the EU should already have: an AI inventory screened against Art. 5 prohibitions, chatbot/synthetic-content disclosure in place, literacy measures, contracts capturing provider documentation flows, and an Art. 26-shaped operating model ready for Dec 2027 rather than relying on the deferral.

---

## 4. Other regulation landscape (brief)

**US federal (2026).** Posture is aggressively deregulatory and preemption-focused. EO 14179 (23 Jan 2025) revoked the Biden AI EO; **America's AI Action Plan** (23 July 2025) with ~90 federal actions prioritizes innovation/infrastructure/diplomacy and directs the NIST RMF revision; **OMB M-25-21 and M-25-22** (3 April 2025) govern federal agency AI use and procurement — retaining Chief AI Officers and "high-impact AI" risk practices; EO **"Ensuring a National Policy Framework for Artificial Intelligence" (11 Dec 2025)** created a DOJ **AI Litigation Task Force** to challenge state AI laws and conditions BEAD broadband funds on states not enforcing "onerous" AI rules; a **National AI Policy Framework** followed **20 March 2026** (seven pillars, including preemption of state AI laws). No comprehensive federal AI statute exists; federal preemption remains contested in courts and Congress. [verified 2026]

**Colorado (AIA/SB 24-205).** The landmark 2024 algorithmic-discrimination law never took effect as designed: delayed to 30 June 2026 (SB25B-004, Aug 2025), then **repealed and replaced by SB 26-189 (signed 14 May 2026)** — effective **1 January 2027** — dropping the EU-style duty-of-care/risk-program/impact-assessment model for a narrower **disclosure and transparency regime around automated decision systems**. Frequently attributed in part to White House pressure. [verified 2026]

**California.** **SB 53 (TFAIA)**, signed 29 Sept 2025, effective **1 Jan 2026**: frontier developers (models >10^26 FLOPs; extra duties above $500M revenue) must publish safety frameworks and transparency reports, report critical safety incidents (to Cal OES), with whistleblower protections; AG enforcement up to **$1M per violation**. Companion laws: AB 2013 (training-data disclosure, from 1 Jan 2026), SB 942 (AI content marking), CCPA/CPPA ADMT regulations phasing in from 2027, plus employment ADS regulations (Oct 2025). [verified 2026 for SB 53; companions training knowledge]

**Texas (TRAIGA, HB 149).** Signed 22 June 2025, effective **1 Jan 2026**. Intent-based prohibitions (behavioral manipulation, government social scoring, unlawful discrimination — *intentional* discrimination, disparate impact expressly insufficient; CSAM/deepfakes; biometric capture without consent), government-facing disclosure duties, an AI regulatory sandbox, and an AI advisory council; exclusive AG enforcement, 60-day cure, penalties up to ~$200k per violation ($2k–$40k/day for continuing). [verified 2026; per-day figures training knowledge]

**Korea (AI Basic Act).** The Act on the Development of AI and Establishment of Trust — passed late 2024 (first comprehensive national AI law after the EU), **effective 22 January 2026**, extraterritorial. Combines industrial promotion with obligations: transparency/labeling for generative AI, safety duties for large-compute models, and for **"high-impact AI"** (healthcare, energy, hiring, credit, education, public safety etc.) risk management, impact assessment, human oversight, documentation; domestic-representative requirement for large foreign providers; modest fines (up to KRW 30M) with a phased enforcement/grace approach through 2026. [verified 2026; fine level training knowledge]

**China.** Vertical, state-led rules rather than one AI act: Interim Measures for Generative AI Services (in force Aug 2023) [training knowledge]; **AI-Generated Content Labeling Measures + mandatory standard GB 45438-2025, effective 1 Sept 2025** — explicit labels visible to users plus implicit metadata labels, duties across providers, app-distribution platforms, and users; supporting standards GB/T 45654-2025 (GenAI security baseline) and GB/T 45652-2025 (training-data security). Also a **Global AI Governance Action Plan (July 2025)**, draft AI ethics rules (Oct 2025), and an updated AI Safety Governance Framework 2.0 (Sept 2025). [verified 2026; Framework 2.0 date training knowledge]

**UK.** Still no horizontal AI statute: a principles-based, sector-regulator approach (five cross-sector principles), with the **AI Safety Institute renamed the AI Security Institute (Feb 2025)** focusing on national-security testing of frontier models. The Labour government has signaled a narrow frontier-AI bill and 2026 plans to set standards for AI deployment, but near-term action is expected via existing regulators (ICO, FCA, CMA/DMCCA, Ofcom under the Online Safety Act) rather than primary legislation. [verified 2026]

---

## 5. OECD AI Principles and the G7 Hiroshima Process

**Type: FRAMEWORK (intergovernmental, voluntary; the shared vocabulary layer).**

- **OECD AI Principles** — first intergovernmental AI standard (2019), **updated at the May 2024 Ministerial Council Meeting** to address generative/general-purpose AI (safety, information integrity, IP, environment). Now adhered to by **47 jurisdictions** including the EU. The **updated OECD definition of an AI system** ("machine-based system that... infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions...") is the interoperability anchor: adopted by the EU AI Act, Council of Europe treaty, US, and UN work. Five value-based principles (inclusive growth; human rights & democratic values incl. fairness/privacy; transparency & explainability; robustness, security & safety; accountability) plus five policy recommendations. [verified 2026; principle list training knowledge]
- **G7 Hiroshima AI Process (HAIP)** — launched May 2023; produced International Guiding Principles and the **International Code of Conduct for Organizations Developing Advanced AI Systems** (11 voluntary actions: risk assessment across lifecycle, incident reporting, transparency reports, security controls, provenance/watermarking, safety research, priority risks, etc.). [training knowledge] The OECD launched the **HAIP Reporting Framework on 7 February 2025** — the first standardized global transparency-reporting mechanism; first submissions published **April 2025** (19–25 organizations incl. Google, Microsoft, OpenAI, Anthropic), with annual updates expected. [verified 2026]
- **Consensus vs divergence.** Genuine international consensus exists at the level of: the OECD AI-system definition; risk-based approach; transparency/accountability/human-centricity principles; safety testing of frontier models; and incident reporting as a norm (OECD common incident-reporting framework work ongoing). Divergence is at the level of *bindingness and mechanism* — the EU codifies, the US (2026) deregulates and litigates against sub-federal rules, China mandates content control and labeling, the UK delegates to regulators. The Council of Europe Framework Convention on AI (signed Sept 2024 by EU, US, UK among others) remains the only binding treaty but is thin on specifics. [training knowledge; US posture verified 2026]

---

## 6. Consulting and analyst framings

**Type: VENDOR/ANALYST guidance.** What matters for taxonomy design is *which dimensions each uses*.

- **Gartner — AI TRiSM (Trust, Risk and Security Management).** Current formulation (2025–2026 Market Guide) defines **four layers of technical capability that enforce AI governance policies**: (1) **AI governance** (inventory, policy, accountability, regulatory alignment), (2) **AI runtime inspection and enforcement** (real-time monitoring/blocking of prompts, outputs, agent actions; drift and policy adherence), (3) **information governance** (data classification, access control, exposure prevention), (4) **infrastructure and stack** security. The earlier four-pillar articulation (explainability/model monitoring; ModelOps; AI application security; privacy) still circulates and is often quoted with "regulatory compliance" as a fifth. Gartner's core message: policies alone fail without runtime technical enforcement. [verified 2026]
- **Forrester — AEGIS (Agentic AI Enterprise Guardrails for Information Security), 2025.** Six domains for securing agentic AI: **GRC (machine-executable policy), identity & access management (agents as hybrid identities, just-in-time privilege), data security & privacy, application security, threat management, Zero Trust** as connective tissue. Frames agent risks as emergent behavior, missing detection surface, intent compromise (prompt injection/goal hijack), and human-oversight decision fatigue. [verified 2026]
- **McKinsey/QuantumBlack.** Responsible-AI principles plus an **AI Trust Maturity Model** scoring five dimensions: strategy; risk management; data & technology; governance; and (added 2026) **agentic AI governance & controls**. 2026 survey (~500 orgs, fielded Dec 2025–Jan 2026): average maturity 2.3/4 (up from 2.0), with governance and agentic controls lagging — "the average enterprise is running agentic AI [but] is not ready to govern it." [verified 2026]
- **BCG.** Responsible AI as CEO-level transformation; five-pillar RAI framework (strategy; governance incl. processes & tools; key processes; technology; culture/people) and the signature **10-20-70 rule** (value comes 10% from algorithms, 20% from tech/data, 70% from people, process, culture); published an AI Code of Conduct template (2025). [verified 2026 at framing level; pillar wording training knowledge]
- **Deloitte — Trustworthy AI™.** **Seven dimensions:** transparent & explainable; fair & impartial; robust & reliable; respectful of privacy; safe & secure; responsible; accountable — applied across the lifecycle (ideation → design → development → deployment → MLOps). [verified 2026]
- **PwC — Responsible AI.** Toolkit organized around focus dimensions: **governance; ethics & regulation; interpretability & explainability; robustness & security; bias & fairness** — delivered as maturity assessment + toolkit rather than a numbered model. [verified 2026]
- **KPMG — Trusted AI.** The formally numbered **10 pillars**: fairness, transparency, explainability, accountability, security, safety, privacy, data integrity, reliability, sustainability — with a published risk-and-controls guide mapping pillar-level risks to control considerations, explicitly aligned to ISO 42001, NIST AI RMF, and the EU AI Act; KPMG claims early ISO 42001 certification/accreditation firsts. [verified 2026; full pillar list assembled from KPMG materials + training knowledge]
- **Accenture.** Responsible AI principles (human by design; fairness; transparency/explainability/accuracy; safety; accountability; compliance/data privacy/cybersecurity; sustainability) operationalized as an enterprise **RAI program blueprint** (principles & governance → risk/policy/controls → tech enablers → workforce/culture); co-authored WEF's "Advancing Responsible AI Innovation" playbook (2025); research headline: **fewer than 1% of companies have fully operationalized responsible AI** despite most having principles/programs. [verified 2026; blueprint layer names training knowledge]

**Common structural elements across consulting/analyst frameworks:** (a) a values/principles layer phrased as trust adjectives; (b) an accountability/operating-model layer (board → CAIO/committee → product teams; three-lines-of-defense); (c) lifecycle process gates (intake/triage → impact assessment → build/test → deploy → monitor → retire); (d) a control catalog mapped to external frameworks; (e) technical enforcement/tooling (the Gartner TRiSM/Forrester AEGIS emphasis); (f) culture/literacy; (g) maturity scoring as the diagnostic device. The 2026-specific addition everywhere is an **agentic AI governance** extension (identity, autonomy limits, action monitoring).

---

## 7. Security-side frameworks shaping AI governance

**Type: FRAMEWORK (community/vendor security guidance) — increasingly cited inside governance regimes.**

- **OWASP Top 10 for LLM Applications 2025** (OWASP GenAI Security Project; 2025 edition published Nov 2024): LLM01 Prompt Injection; LLM02 Sensitive Information Disclosure; LLM03 Supply Chain; LLM04 Data & Model Poisoning; LLM05 Improper Output Handling; LLM06 Excessive Agency; LLM07 System Prompt Leakage; LLM08 Vector & Embedding Weaknesses; LLM09 Misinformation; LLM10 Unbounded Consumption. [verified 2026 for LLM01–08 and edition; LLM09–10 training knowledge] A **2026 edition of the GenAI/LLM Top 10** is listed among OWASP GenAI resources. [verified 2026, content not retrieved]
- **OWASP agentic AI work:** "Agentic AI — Threats and Mitigations" (Feb 2025; threat taxonomy across agent design, memory, planning/autonomy, tool use, deployment/operations); "Securing Agentic Applications Guide 1.0" (July 2025); and the **OWASP Top 10 for Agentic Applications, released 9 December 2025** (100+ contributors; headline risks include Agent Behavior Hijacking, Tool Misuse & Exploitation, Identity & Privilege Abuse). [verified 2026]
- **MITRE ATLAS** — the adversarial TTP knowledge base for AI (ATT&CK-style matrix: tactics → techniques → mitigations → real case studies). As of **v5.1.0 (November 2025): 16 tactics, 84 techniques, 56 sub-techniques, 32 mitigations, 42 case studies**; October 2025 collaboration (with Zenity) added 14 agent-focused techniques (memory/context poisoning, agent-config tampering, exfiltration via tool invocation); further agentic expansion in the first 2026 update. [verified 2026]
- **CSA AI Controls Matrix (AICM)** — released **July 2025** with **243 control objectives across 18 domains** (spanning classic security domains plus model security, supply chain/transparency/accountability); **v1.1 (14 July 2026) expanded to 247 controls**; mapped to ISO 42001, ISO 27001, BSI AIC4, NIST; companion **AI-CAIQ** questionnaire and a **STAR for AI** assurance/certification pathway (self-assessment → third-party). This is the closest thing to a CCM-style audit backbone specifically for AI services. [verified 2026]
- **Google SAIF and CoSAI.** SAIF (2023) established six elements for secure AI (expand secure foundations; extend detection & response; automate defenses; harmonize platform-level controls; adapt controls with feedback loops; contextualize risks in business processes) [training knowledge], plus a SAIF Risk Map/self-assessment. **SAIF 2.0 (2025) extends the framework to AI agents** — an agent risk map covering rogue actions and over-permissioned tools, and three agent principles: **well-defined human controllers, limited powers, observable actions**. [verified 2026] **CoSAI (Coalition for Secure AI)** — OASIS open project launched July 2024 by Google, IBM, Anthropic, Microsoft, NVIDIA, OpenAI and others, now 40+ members; workstreams include software supply chain security for AI, preparing defenders, AI risk governance, **agentic AI security**, and cyber defense. Google donated SAIF data to CoSAI (**16 September 2025**) as the **CoSAI Risk Map (CoSAI-RM)** — signaling convergence toward an industry-neutral AI-security risk map. [verified 2026]

**Why this matters for governance:** the EU AI Act (accuracy/robustness/cybersecurity, Art. 15), NIST (Measure/Manage + COSAiS), ISO 42001 Annex A, and CSA AICM all *require* what these frameworks *specify*. In 2026 the credible chain is: governance obligation → mapped control (AICM/COSAiS/42001) → concrete threat (OWASP/ATLAS) → runtime enforcement (TRiSM/AEGIS/SAIF).

---

## 8. Synthesis

### 8.1 Where frameworks converge (consensus elements)

1. **Risk-based proportionality** — obligations scale with impact/risk tier (EU tiers; NIST profiles; Korea "high-impact"; OMB "high-impact"; ISO impact assessment). [verified 2026]
2. **Full lifecycle coverage** — governance attaches from design/procurement through operation and retirement, not just at approval (ISO 42001, Deloitte, NIST Map/Manage, EU post-market monitoring).
3. **Named accountability and an operating model** — senior ownership, defined roles, committees; agents/systems traceable to a responsible human (NIST Govern; 42001 leadership clauses; OMB CAIOs; SAIF "well-defined controllers").
4. **AI inventory/registry as precondition** — you cannot govern what you haven't cataloged (EU database registration; OMB use-case inventories; TRiSM governance layer; every consultancy's step 1).
5. **Use-case risk triage + impact assessment** — a documented classification and impact-assessment step (EU Art. 6 + FRIA; ISO 42005; Korea; former Colorado model).
6. **Transparency in two directions** — documentation up/down the supply chain (model/system cards, Annex XI/XII, HAIP reports) and disclosure to affected people (chatbot notice, synthetic-content labeling — EU Art. 50, China labeling, California SB 942).
7. **Human oversight with real authority** — competent, trained humans able to intervene/override (EU Art. 26; OECD accountability; SAIF agent principles; AEGIS).
8. **Data governance and privacy as the substrate** — quality, representativeness, provenance, access control (EU Art. 10; TRiSM information governance; AICM data domains).
9. **Security against AI-specific adversaries** — prompt injection, poisoning, model theft, agent hijacking now standard threat vocabulary (OWASP, ATLAS, COSAiS, Art. 15).
10. **Continuous testing, evaluation, and monitoring** — pre-deployment evals + runtime monitoring for drift, misuse, policy violation (NIST Measure; adversarial testing for systemic-risk GPAI; TRiSM runtime layer).
11. **Incident detection, response, and reporting** — a defined serious-incident pipeline with external reporting duties emerging everywhere (EU Art. 73 & Art. 55; SB 53; Korea; OECD common reporting framework; HAIP).
12. **Third-party/supply-chain management** — provider-deployer contracts, vendor due diligence, model provenance (EU value-chain articles; 42001 Annex A; AICM; LLM03).
13. **Workforce literacy and culture** — EU Art. 4, Korea, and every consultancy treat training/culture as a control, not an HR nicety.

### 8.2 Where they diverge

- **Bindingness and mechanism:** EU = horizontal ex-ante regulation with CE-style conformity; US federal (2026) = deregulation + procurement rules + litigation against state laws; states = narrow transparency/disclosure statutes; UK = regulator-led principles; China = mandatory vertical rules focused on content/labeling/security review; Korea = EU-lite with promotion mandate. [verified 2026]
- **Object of regulation:** model-centric frontier regimes (EU GPAI chapter, California SB 53 at 10^26 FLOPs) vs use-case regimes (EU Annex III, Korea high-impact, ex-Colorado) vs content regimes (China, Art. 50).
- **Fairness/discrimination:** central to EU/OECD/consultancy frameworks; being *removed* from US federal framing (RMF DEI revision; TRAIGA's intent-only discrimination standard; Colorado's repeal of the algorithmic-discrimination duty). This is the sharpest 2026 transatlantic split. [verified 2026]
- **Timelines in motion:** the EU deferred its own high-risk regime (to Dec 2027/Aug 2028) while transparency and GPAI enforcement proceed — "deferred, not cancelled" — creating a compliance-planning fork many US-based frameworks ignore. [verified 2026]
- **Sustainability/environment:** a pillar for KPMG, OECD, EU recitals, NIST GAI profile; absent from most security frameworks and de-emphasized in US policy.
- **Agentic AI:** security/analyst frameworks (OWASP, ATLAS, AEGIS, SAIF 2.0, CoSAI, TRiSM) are 12–18 months ahead of statute; no binding law specifically governs agents yet — governance frameworks must bridge that gap contractually and technically.
- **Assurance model:** ISO (accredited certification via 42006) vs CSA (STAR for AI) vs EU (conformity assessment + notified bodies, deferred) vs US (self-attestation/procurement) — no single accepted audit currency yet.

### 8.3 Candidate taxonomy signals for a clean enterprise framework

The sources triangulate on a **layered stack crossed by a lifecycle**, with three lenses (risk tier, role, and system type):

1. **Principles & policy layer** — trust adjectives translated into enterprise AI policy (OECD/Deloitte/KPMG language; keep to ~5–7 principles).
2. **Accountability & operating-model layer** — board oversight, CAIO/committee, three lines of defense, RACI per system; ISO 42001 is the certifiable expression of this layer.
3. **Inventory & risk-triage layer** — AI registry + tiering rubric (prohibited / high / limited / minimal, mirroring EU + "high-impact" from OMB/Korea) + impact assessment method (ISO 42005).
4. **Lifecycle controls layer** — stage-gated controls for data, model, and application: procurement/build intake → data governance → evaluation & red-teaming → deployment approval → change management (mapped to 42001 Annex A, CSA AICM, COSAiS, NIST GAI actions).
5. **Runtime enforcement & observability layer** — the Gartner/Forrester insight: policy must execute in the platform — guardrails, runtime inspection, agent identity & least privilege, logging/traceability, drift and misuse monitoring. (This is where a cloud provider differentiates: model armor/guardrails, policy engines, agent identity, audit logs.)
6. **Assurance & compliance layer** — evidence generation, internal audit, certification (ISO 42001/STAR for AI), regulatory mapping (EU/state/Korea), incident reporting pipelines, transparency artifacts (model/system cards, Art. 50 disclosures).
7. **Cross-cutting enablers** — AI literacy/culture; third-party & supply-chain management; and an explicit **agentic AI annex** (controllers, limited powers, observable actions).

Framing note for customer content: use **Govern → Map → Measure → Manage** as the *process verbs* inside the stack (NIST-native, maps cleanly to ISO clauses and EU duties), and present regulation/standard/framework/vendor-guidance distinctions exactly — enterprises consistently conflate "certifiable" with "required."

---

## 9. Sources (accessed 2026-08-23 via web search)

**EU AI Act & Digital Omnibus**
- EUR-Lex, Regulation (EU) 2026/1744 — https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng
- European Commission, "AI Omnibus enters into force" — https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force
- Jones Walker, "Yes, August 2 Still Matters…" — https://www.joneswalker.com/en/insights/blogs/ai-law-blog/yes-august-2-still-matters-the-eu-approved-a-high-risk-ai-delay-but-most-trans.html
- Gibson Dunn, "EU AI Act Omnibus Agreement" — https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
- CSA Research Note, "EU AI Act's High-Risk Deadline: Deferred, Not Cancelled" — https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-deadline-omnibus-20260/
- White & Case, "EU AI Omnibus enters into force" — https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act
- NicFab, "Digital Omnibus on AI: Regulation (EU) 2026/1744 Published" — https://www.nicfab.eu/en/posts/digital-omnibus-ai-official-journal/
- Hunton, "EU Digital Omnibus on AI Enters Into Force" — https://www.hunton.com/privacy-and-cybersecurity-law-blog/eu-digital-omnibus-on-ai-enters-into-force
- artificialintelligenceact.eu — Article 6, Article 26, Article 73, Article 99, Article 50 practical guide — https://artificialintelligenceact.eu/
- European Commission, GPAI Code of Practice — https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai and https://code-of-practice.ai/
- Commission draft high-risk classification guidelines (19 May 2026) — https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems
- Latham & Watkins, draft Art. 73 incident-reporting guidance — https://www.lw.com/en/insights/european-commission-publishes-draft-guidance-reporting-serious-ai-incidents
- kla.digital, "EU AI Act August 2026: GPAI Enforcement and Article 50" — https://kla.digital/blog/eu-ai-act-august-2026-what-still-applies
- EDPB-EDPS Joint Opinion 1/2026 on the AI Omnibus — https://www.edpb.europa.eu/system/files/2026-01/edpb_edps_jointopinion_202601_proposal_ai-omnibus_en.pdf

**US federal & states**
- White House EO, "Ensuring a National Policy Framework for AI" (11 Dec 2025) — https://www.whitehouse.gov/presidential-actions/2025/12/eliminating-state-law-obstruction-of-national-artificial-intelligence-policy/
- America's AI Action Plan (23 July 2025) — https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf
- Morrison Foerster, "Trump Administration Releases National AI Policy Framework" (Mar 2026) — https://www.mofo.com/resources/insights/260402-trump-administration-releases-national-ai-policy-framework
- Paul Hastings / Latham (EO analyses) — https://www.paulhastings.com/insights/client-alerts/president-trump-signs-executive-order-challenging-state-ai-laws ; https://www.lw.com/en/insights/ai-executive-order-targets-state-laws-and-seeks-uniform-federal-standards
- Wiley / Hunton on OMB M-25-21 & M-25-22 — https://www.wiley.law/alert-Trump-Administration-Revamps-Guidance-on-Federal-Use-and-Procurement-of-AI ; https://www.hunton.com/privacy-and-cybersecurity-law-blog/omb-issues-revised-policies-on-ai-use-and-procurement-by-federal-agencies
- Skadden, "Colorado Repeals and Replaces Its AI Act" (June 2026) — https://www.skadden.com/insights/publications/2026/06/colorado-repeals-and-replaces-its-ai-act
- Hunton, "Colorado AI Act Amended and Effective Date Delayed" — https://www.hunton.com/privacy-and-cybersecurity-law-blog/colorado-ai-act-amended-and-effective-date-delayed
- FPF, "California's SB 53 Explained" — https://fpf.org/blog/californias-sb-53-the-first-frontier-ai-law-explained/
- White & Case, SB 53 alert — https://www.whitecase.com/insight-alert/california-enacts-landmark-ai-transparency-law-transparency-frontier-artificial
- Norton Rose Fulbright, TRAIGA guide — https://www.nortonrosefulbright.com/en/knowledge/publications/c6c60e0c/the-texas-responsible-ai-governance-act
- K&L Gates, TRAIGA signed — https://www.klgates.com/Pared-Back-Version-of-the-Texas-Responsible-Artificial-Intelligence-Governance-Act-Signed-Into-Law-6-24-2025

**Korea, China, UK**
- Cooley, "South Korea's AI Basic Act: Overview" (27 Jan 2026) — https://www.cooley.com/news/insight/2026/2026-01-27-south-koreas-ai-basic-act-overview-and-key-takeaways
- FPF, "South Korea's New AI Framework Act" — https://fpf.org/blog/south-koreas-new-ai-framework-act-a-balancing-act-between-innovation-and-regulation/
- Loeb & Loeb, China AI-labeling measures (eff. 1 Sept 2025) — https://www.loeb.com/en/insights/publications/2025/03/chinas-ai-labeling-measures-and-mandatory-national-standards-take-effect-september-1
- Mayer Brown, China Global AI Governance Action Plan & draft ethics rules — https://www.mayerbrown.com/en/insights/publications/2025/10/artificial-intelligence-a-brave-new-world-china-formulates-new-ai-global--governance-action-plan-and-issues-draft-ethics-rules-and-ai-labelling-rules
- White & Case, AI Watch China tracker — https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-china
- Bird & Bird, "UK government announces plans to set standards for AI deployment" (2026) — https://www.twobirds.com/en/insights/2026/uk/uk-ai-regulation-uk-government-announces-plans-to-set-standards-for-how-ai-is-deployed
- Wikipedia/UK AISI rename — https://en.wikipedia.org/wiki/AI_Security_Institute

**NIST**
- NIST AI RMF hub — https://www.nist.gov/itl/ai-risk-management-framework
- NIST COSAiS project (FAQs, use cases, concept paper) — https://csrc.nist.gov/Projects/cosais/faqs ; https://csrc.nist.gov/Projects/cosais/use-cases ; https://csrc.nist.gov/csrc/media/Projects/cosais/documents/NIST-Overlays-SecuringAI-concept-paper.pdf
- Crowell & Moring, NIST Cyber AI Profile draft (IR 8596) — https://www.crowell.com/en/insights/client-alerts/nist-releases-draft-framework-for-ai-cybersecurity-solicits-public-comment-what-organizations-using-or-deploying-ai-should-know
- Modulos, NIST AI 600-1 twelve risk categories — https://docs.modulos.ai/frameworks/nist-ai-rmf/generative-ai-profile

**ISO**
- ISO/IEC 42005:2025 — https://www.iso.org/standard/42005 ; Scrut overview — https://www.scrut.io/post/iso-42005
- ISO/IEC 42006:2025 — https://www.iso.org/standard/42006 ; SCC transition bulletin — https://scc-ccn.ca/accreditation/bulletins/transition-isoiec-420062025-bodies-providing-audit-and-certification
- ISO/IEC 23894:2023 — https://www.iso.org/standard/77304.html ; Techné analysis — https://techne.ai/insights/iso-iec-23894-reference/
- Anthropic ISO 42001 announcement — https://www.anthropic.com/news/anthropic-achieves-iso-42001-certification-for-responsible-ai
- AI Provider Trust Registry (42001 holders incl. AWS/Microsoft/Google/OpenAI) — https://aiprovidertrust.com/questions/iso-42001/ ; certified-companies list — https://aicompliancevendors.com/blog/iso-42001-certified-companies-list

**OECD / G7**
- OECD press release, AI Principles update (May 2024) — https://www.oecd.org/en/about/news/press-releases/2024/05/oecd-updates-ai-principles-to-stay-abreast-of-rapid-technological-developments.html
- OECD.AI, 2024 Principles update explainer — https://oecd.ai/en/wonk/evolving-with-innovation-the-2024-oecd-ai-principles-update
- OECD press release, HAIP reporting framework launch (Feb 2025) — https://www.oecd.org/en/about/news/press-releases/2025/02/oecd-launches-global-framework-to-monitor-application-of-g7-hiroshima-ai-code-of-conduct.html
- OECD.AI, initial HAIP submissions (Apr 2025) — https://oecd.ai/en/wonk/initial-submissions-g7-hiroshima-ai-process-reporting-framework ; portal — https://transparency.oecd.ai/

**Consulting / analyst**
- Gartner, "AI Governance Needs More Than Policies" — https://www.gartner.com/en/articles/ai-governance-trism ; Market Guide for AI TRiSM — https://www.gartner.com/en/documents/6185655
- Singulr/Mindgard summaries of TRiSM four layers — https://singulr.ai/resources/buyers-guide/trism ; https://mindgard.ai/blog/gartner-ai-trism-market-guide
- Forrester AEGIS — https://www.forrester.com/technology/aegis-framework/ ; BigID explainer — https://bigid.com/blog/what-is-aegis/
- McKinsey, "State of AI trust in 2026: Shifting to the agentic era" — https://mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/state-of-ai-trust-in-2026-shifting-to-the-agentic-era ; "Trust in the age of agents" — https://www.mckinsey.com/capabilities/risk-and-resilience/our-insights/trust-in-the-age-of-agents
- Deloitte Trustworthy AI — https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/services/ethics-of-ai-framework.html
- KPMG Trusted AI framework & controls guide — https://kpmg.com/xx/en/what-we-do/services/ai/trusted-ai-framework.html ; https://kpmg.com/kpmg-us/content/dam/kpmg/pdf/2025/trusted-ai-controls-matrix-tool-us.pdf
- PwC Responsible AI Toolkit — https://www.pwc.com.au/consulting/data-and-analytics/responsible-ai-toolkit.html
- BCG Responsible AI — https://www.bcg.com/capabilities/artificial-intelligence/responsible-ai ; AI Code of Conduct — https://www.bcg.com/assets/2025/ai-code-of-conduct.pdf
- Accenture Responsible AI — https://www.accenture.com/us-en/services/ai-data/responsible-ai ; WEF/Accenture playbook — https://www.weforum.org/publications/advancing-responsible-ai-innovation-a-playbook/

**Security frameworks**
- OWASP GenAI Security Project, LLM Top 10 2025 — https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/ ; 2026 edition page — https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
- OWASP Top 10 for Agentic Applications (9 Dec 2025) — https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/
- OWASP Securing Agentic Applications Guide 1.0 — https://genai.owasp.org/resource/securing-agentic-applications-guide-1-0/
- MITRE ATLAS — https://atlas.mitre.org/ ; Vectra ATLAS v5.1.0 stats — https://www.vectra.ai/topics/mitre-atlas
- CSA, "Introducing the CSA AI Controls Matrix" (10 July 2025) — https://cloudsecurityalliance.org/blog/2025/07/10/introducing-the-csa-ai-controls-matrix-a-comprehensive-framework-for-trustworthy-ai ; AICM v1.1 (14 July 2026) — https://cloudsecurityalliance.org/blog/2026/07/14/ai-controls-matrix-v1-1-strengthening-the-foundation-for-trustworthy-ai
- Google SAIF — https://safety.google/intl/en/safety/saif/ ; Google AI security strategy / SAIF 2.0 — https://blog.google/innovation-and-ai/technology/safety-security/ai-security-frontier-strategy-tools/
- CoSAI / SAIF donation (16 Sept 2025) — https://www.coalitionforsecureai.org/google-donates-secure-ai-framework-saif-data-to-coalition-for-secure-ai/ ; https://www.oasis-open.org/2025/09/16/google-donates-secure-ai-framework-saif-data-to-coalition-for-secure-ai/
