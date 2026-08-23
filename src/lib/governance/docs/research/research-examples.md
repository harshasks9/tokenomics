# AI Governance in Practice — Source Material for the Enterprise AI Governance Microsite

**Prepared:** 2026-08-23 · **Audience:** Google Cloud sellers (and the writers building the microsite)
**Method:** Web research August 2026; every example verified against at least one public source unless marked [training knowledge]. Confidence labels: **[strong]** = governance mechanics publicly documented in detail; **[directional]** = real deployment, governance detail thin — position as "direction of travel," don't over-claim.

---

## Executive Summary: Six Patterns the Best-Governed Deployments Share

Across ~25 documented deployments (2024–2026) in banking, healthcare, government, retail, telecom, pharma, and education, the implementations that scaled without incident share six repeatable patterns. These are the spine of the microsite:

1. **One governed front door ("gateway, not free-for-all").** Goldman Sachs, JPMorganChase, Walmart, TELUS, and Highmark all route every model call through a single internal platform/gateway that enforces authentication, role-based access, prompt/response filtering, logging, and model choice. Governance lives in the gateway, so every new use case inherits it. The alternative — each team calling model APIs directly — is where the Samsung-style leaks happen.

2. **Sensitive data never meets the model raw.** Wells Fargo's Fargo tokenizes and scrubs PII *before* any LLM call ("zero PII to the LLM" across 245M+ interactions). Healthcare deployments (Mayo, Bayer) sit on de-identification pipelines (Cloud Healthcare API, Sensitive Data Protection). Redaction/tokenization is an architectural control, not a policy memo.

3. **Evals before rollout, evals forever.** Morgan Stanley made expert-graded evals the gating mechanism for its GPT-4 advisor assistant; Deutsche Bank's DB Lumina runs version-controlled test datasets, citation precision/recall metrics, and Ragas-based hallucination checks wired into CI. The best programs treat evaluation like regression testing, not a one-time QA pass.

4. **Human accountability preserved at the decision point.** HCA's Nurse Handoff shows the EHR and the AI draft side by side and requires clinician approval; Nevada's unemployment-appeals AI only ever *recommends* — a human referee decides; NHS England's ambient-scribe guidance makes the clinician legally responsible for the record. The pattern: AI drafts, accountable humans approve — and the UI is designed to make review real, not a rubber stamp.

5. **Constrain the blast radius.** Wendy's FreshAI is fenced to the menu with business-rule guardrails and hands off to a human the moment confidence drops (86% fully automated, ~99% with brief assist). Fargo's LLM only extracts intent/entities; deterministic banking systems execute. The Replit incident (agent deleted a production DB) is the counter-example: no environment separation, no approval gate, unbounded write access.

6. **Governance as the enabler of scale, not the brake ("paved road").** The USAF's NIPRGPT gave 100k+ airmen a *sanctioned* sandbox instead of shadow AI, then graduated to DoD-wide GenAI.mil; Moderna turned informal ChatGPT use into 750 governed GPTs with ethics training; Macquarie got 99% of bank staff through mandatory gen-AI training before broad Gemini Enterprise rollout; ASU gates access through a proposal-and-review process. Sanctioned, well-governed access consistently beats bans (Samsung's ban era is the cautionary contrast).

**Seller framing:** governance is not a compliance tax — it is the specific set of architectural choices (gateway, redaction, evals, HITL, scoping, paved road) that let regulated enterprises get to hundreds of millions of interactions with zero reportable incidents. Google Cloud has first-party product answers for each pattern (Vertex AI, Model Armor, Sensitive Data Protection, Apigee, Gemini Enterprise admin controls, GDC air-gapped, SAIF).

---

## Part 1 — Detailed Example Library

### A. Google Cloud customers (lead with these)

---

### 1. Wells Fargo — "Fargo" assistant: zero-PII-to-the-LLM at 245M interactions **[strong]**
- **Situation:** Consumer virtual assistant inside the Wells Fargo mobile app, live since 2023, powered by Google Cloud (Dialogflow; PaLM 2 initially, later Gemini Flash 2.0 in a model-agnostic "poly-model" setup). Surpassed 245.5M interactions in 2024 with no human handoffs reported.
- **Governance challenge:** A US G-SIB letting customers talk to an LLM about their accounts — bank-secrecy, privacy, and regulator expectations mean customer PII cannot flow to a foundation model.
- **Controls introduced:** A pipeline where speech is transcribed locally on-device; text passes through an internal PII detection/redaction service (small language model tuned for financial PII) that scrubs and tokenizes before any external call; the LLM is only asked to determine intent and entities; orchestration and actual banking actions stay in Wells Fargo's deterministic systems. CIO Chintan Mehta: "The orchestration layer talks to the model… We're the filters in front and behind."
- **Architecture:** device STT → internal PII scrub/tokenize → Gemini Flash 2.0 (intent/entity only) → internal orchestration executes against core banking → response re-assembled with real data inside the bank's perimeter. Model-agnostic layer allows swapping models without re-doing governance.
- **Outcome:** 245M+ interactions, publicly stated zero sensitive-data exposure; held up as the reference pattern for regulated conversational AI.
- **Seller line:** "You don't need to trust the model with PII to use the model. Wells Fargo ran a quarter-billion interactions on Google models without a single customer data element reaching the LLM — that's an architecture decision you can copy."
- **Sources:** VentureBeat (2025) "Wells Fargo's AI assistant just crossed 245 million interactions"; cnarte.substack deep-dive; reruption.com case write-up. [verified 2026]

---

### 2. Deutsche Bank — DB Lumina research agent: guardrails + eval discipline in a regulated research shop **[strong]**
- **Situation:** Gemini/Vertex-based research agent for Deutsche Bank Research; live Sept 2024; ~5,000 users (IB Origination & Advisory, FIC), targeting 10,000+. Saves 30–45 min per earnings template, up to 2 hours per report. (Google Cloud blog, Sept 23, 2025.)
- **Governance challenge:** Research is a compliance minefield: MNPI walls, strict sourcing/citation rules, publication controls, data privacy — outputs must only cite verified sources and never leak non-public information.
- **Controls introduced:** Guardrails on all generation; identity via corporate IdP (Azure AD integration) with centralized authorization through dbEntitlements; controlled access to confidential data with audit logging; every prompt interaction stored (Cloud Storage) and queryable in BigQuery; content moderation via Cloud Natural Language; RAG with inline citations and source viewers so analysts can verify every claim.
- **Evaluation regime (the teachable part):** central metric dictionary; standard metrics (accuracy, completeness, latency) plus custom ones — citation precision *and recall*, false-rejection rate, verbosity; Ragas for hallucination; version-controlled test datasets reflecting edge cases and biases; baselines tracked against git hashes; automated metric pipelines plus human review for tone/fidelity.
- **Architecture:** GKE microservices; Cloud SQL + pgvector and Vertex AI Vector Search; Dataflow ingestion; Gemini 2.0/2.5 on Vertex AI; Discovery Engine API for RAG; full Cloud Observability.
- **Outcome:** In production at scale; roadmap includes specialized compliance/risk agents.
- **Seller line:** "Deutsche Bank publishes its eval framework — citation recall, false-rejection rates, git-hash-pinned baselines. That's what 'audit-ready gen AI' concretely looks like on Vertex."
- **Sources:** Google Cloud blog (Sept 2025). [verified 2026]

---

### 3. Commerzbank — gen-AI documentation of advisory calls under documentation duty **[strong]**
- **Situation:** Semi-agentic multi-step system on Vertex AI (Gemini 1.5 Pro) that transcribes, diarizes, and summarizes corporate-client advisory calls into regulatory compliance protocols. (Google Cloud blog, Nov 22, 2024.)
- **Governance challenge:** Investment-advice documentation is mandatory and audited; manual write-ups took 60+ minutes per call; automation must be provably accurate (numbers especially) and reviewable.
- **Controls introduced:** Six-step pipeline with domain-tuned prompting for numerical accuracy; multiple candidate summaries per compliance-form field; **Vertex AI Gen AI Evaluation Service picks the best candidate and emits a human-readable explanation of why — creating an audit trail for the AI's own selection**; advisor reviews and approves before submission; outputs formatted to regulatory templates.
- **Architecture:** call audio → GCS → chunking → Gemini 1.5 Pro diarized transcription (few-shot, context-carrying) → fact extraction (client, risk tolerance, goals) → CoT summary generation in German → eval-service selection + explanation → human approval. Java Spring backend orchestration.
- **Outcome:** 60+ minutes to a few minutes including manual review; being scaled to further use cases ("AI-powered sales force" initiative). Note: Commerzbank's customer-facing avatar "Ava" runs on Azure — keep the Google story to the advisory-documentation workflow.
- **Seller line:** "Commerzbank uses the model to draft and a second Vertex service to *judge and explain* — the explanation is the audit artifact. Compliance became a feature of the pipeline."
- **Sources:** Google Cloud blog (Nov 2024). [verified 2026]

---

### 4. HCA Healthcare — Nurse Handoff app: human-in-the-loop by UI design **[strong]**
- **Situation:** HCA (180+ hospitals) built a Google Cloud gen-AI Nurse Handoff app generating shift-change reports from the EHR; piloted in ER/hospital settings from 2023, expanding through 2025.
- **Governance challenge:** Handoffs are a known patient-safety failure point; an AI summary that omits a medication change could harm a patient; clinicians must stay accountable.
- **Controls introduced:** Split-screen UI — EHR on one side, AI draft on the other — so verification is one glance, not a leap of faith; prompts deliberately constrain the model to prioritized clinical details (medication changes, labs, vitals, patient concerns, response to treatment); nurses edit and approve before handoff; physicians/nurses remain responsible for accuracy; nurse feedback loops drove iteration ("nurse-approved" co-design).
- **Architecture:** Google Cloud healthcare stack + Gemini-class models against EHR data on hospital-provided mobile devices (public detail on infra is lighter than on the workflow).
- **Outcome:** Across five pilot hospitals nurses rated outputs accurate in >85% of cases and useful >90% of the time; rollout expanded; HCA/Google present it as the template for clinical HITL.
- **Seller line:** "HCA didn't bolt review onto the workflow — they built the UI so review *is* the workflow. That's how you satisfy 'human in the loop' in a way clinicians accept."
- **Sources:** blog.google (Nurse Handoff), Becker's Hospital Review (2024–25), HCA investor release (2023). [verified 2026]

---

### 5. Highmark Health — platform mindset: centralize model access, track usage, then scale **[strong]**
- **Situation:** Integrated payer-provider (6M+ members) building on Vertex AI/Gemini with Google Cloud since 2023; internal gen-AI tools now used regularly by 14,000+ of 40,000+ employees, past one million prompts; expanding into claims processing and multi-agent workflows (2025–26).
- **Governance challenge:** Healthcare payer data (PHI, claims) + thousands of employees experimenting = high leakage and compliance risk if access is fragmented.
- **Controls introduced:** A single internal platform centralizing model access with usage tracking — experimentation is allowed *inside* a governed surface; human-in-the-loop mandated in use-case design; responsible-AI framework adherence with ongoing monitoring/auditing named as a first-class workstream; staged rollout by use case.
- **Architecture:** Vertex AI + Gemini behind Highmark's internal platform; claims-processing gen-AI built jointly with Google Cloud healthcare teams.
- **Outcome:** One of the largest documented healthcare gen-AI employee rollouts; cited (VentureBeat "6 key lessons") as a model for scalable governed adoption.
- **Seller line:** "Highmark's lesson: centralize access and measure usage first — governance data (who uses what for what) is what lets you expand safely to 14,000 users."
- **Sources:** VentureBeat (Highmark/Google 6 lessons), Fierce Healthcare (2025), Forbes (2023). [verified 2026]

---

### 6. State of Nevada (DETR) — unemployment appeals RAG with human referees and a standing governance committee **[strong]**
- **Situation:** Nevada's Dept. of Employment, Training and Rehabilitation paid Google ~$1,383,838 to build a Vertex AI RAG system that reads appeal-hearing transcripts and drafts benefit-eligibility recommendations, to clear a pandemic-era backlog (announced 2024; scrutiny continuing into 2026).
- **Governance challenge:** Automated adjudication of public benefits — due-process, bias, hallucination, and transparency risks; lawmakers and legal-aid groups openly skeptical; claimants can't opt out.
- **Controls introduced:** RAG grounded strictly in Nevada unemployment law + prior appeal cases (not open-web); **every AI recommendation reviewed by a human referee who owns the decision**; a governance committee meets weekly during tuning and quarterly in production to monitor hallucinations and bias; time-to-determination drops from hours to ~5 minutes *of drafting*, with human review preserved.
- **Architecture:** Vertex AI Studio, tuned foundation model + retrieval over a curated legal corpus.
- **Outcome:** Deployed; delivers backlog relief; remains contested (consent, transparency critiques in Fordham IPLJ and Nevada press) — honest sellers should present it as "governed but scrutinized," which is itself the lesson: public-sector AI needs review boards *and* public communication.
- **Seller line:** "Nevada shows the public-sector pattern: constrain the corpus, keep a human decision-maker, and stand up a recurring governance committee before go-live — and expect to defend all three publicly."
- **Sources:** Gizmodo (2024), Engadget, Fordham IPLJ (Oct 2024), Nevada Independent (Mar 2026). [verified 2026]

---

### 7. TELUS — Fuel iX: certified guardrail platform with curated model choice **[strong]**
- **Situation:** Canadian telecom built Fuel iX, an enterprise gen-AI platform on Google Cloud giving employees curated access to multiple models (Gemini on Vertex AI, Anthropic's Claude, others), plus customer-support gen-AI.
- **Governance challenge:** Tens of thousands of employees + customer-facing use in a privacy-sensitive, regulated market; needed provable, third-party-validated trust rather than self-attestation.
- **Controls introduced:** Centralized moderation and guardrails as a single control plane over all model traffic (hallucination/brand-safety validation, automated content filtering); comprehensive Responsible AI program aligned to Canada's ISED Voluntary Code; "purple teaming" (adversarial + defensive testing); **world-first ISO 31700-1 Privacy by Design certification for its gen-AI customer-support tool (May 2024, assessed by KPMG)**.
- **Architecture:** Fuel iX gateway/control plane over Vertex AI-hosted and third-party models; per-interaction moderation; monitoring/management console.
- **Outcome:** Certification achieved; Fuel iX now sold externally by TELUS Digital — governance became a product.
- **Seller line:** "TELUS turned governance into a certified asset — ISO 31700-1, purple teaming, one control plane over every model including Gemini on Vertex. Model choice and governance aren't in tension if the gateway owns the controls."
- **Sources:** TELUS Digital Fuel iX pages, Newswire (May 2024 certification), Google Cloud MWC blog. [verified 2026]

---

### 8. Wendy's — FreshAI drive-thru: scoped domain + confidence-based human handoff **[strong]**
- **Situation:** Voice-ordering gen AI built with Google Cloud (Vertex AI + Gemini-class LLMs) piloted 2023, expanded across franchise locations 2024–25.
- **Governance challenge:** Real-time, customer-facing, revenue-touching AI operated by teenagers' employer of record — errors are instantly visible; brand risk from off-menu conversation.
- **Controls introduced:** Model grounded in Wendy's menu, business rules and conversation-guardrail logic (no open-ended chat); POS/hardware integration keeps actions deterministic; **instant handoff to a human crew member when confidence drops below threshold**; accuracy measured operationally (orders completed without intervention).
- **Architecture:** speech recognition → Vertex AI LLM constrained by menu/rules → POS integration; handoff pathway wired into restaurant ops.
- **Outcome:** 86% of orders handled with no crew intervention; ~99% counting brief assists; ~22-second service-time improvement reported; scaled to hundreds of locations. (Contrast: McDonald's ended its IBM drive-thru pilot in 2024 — scoping and handoff design are the difference story.)
- **Seller line:** "Wendy's put a fence around the problem: menu-only grounding, business-rule guardrails, and a confidence threshold that summons a human. That's agent governance in a QSR."
- **Sources:** Wendy's/Google Cloud PR (2023), Wendy's blog updates, Velocity AI case summary. [verified 2026]

---

### 9. Macquarie Bank — training-gated, org-wide Gemini Enterprise rollout **[directional]**
- **Situation:** Macquarie's Banking & Financial Services group (on Google Cloud since 2019) rolled out Gemini Enterprise to *every* employee in its Australian retail bank, not just tech staff (announced Oct 9, 2025).
- **Governance challenge:** Bank-wide access by non-technical staff multiplies misuse risk (data pasted into prompts, over-trust of outputs).
- **Controls introduced:** 99% of employees completed mandatory "Using Generative AI at Macquarie" training before/alongside rollout; structured AI upskilling pathway; rollout staged on an already-governed Google Cloud data foundation; Gemini Enterprise admin controls (identity-based access, logging) as the substrate.
- **Outcome:** Positioned publicly as "democratized agentic AI" with safety framing; detailed control specifics not published — label directional.
- **Seller line:** "Macquarie's number to quote is 99% — not model accuracy, but training completion. Workforce readiness is a governance control, and Gemini Enterprise gives admins the guardrails underneath."
- **Sources:** Google Cloud press corner (Oct 2025). [verified 2026]

---

### 10. Mayo Clinic — governed enterprise search over clinical data **[directional]**
- **Situation:** Early adopter (June 2023 onward) of Vertex AI Search across EHR, imaging, genomics and labs; internal/administrative and clinician-facing search use cases first.
- **Governance challenge:** PHI in prompts and indexes; HIPAA; clinical-safety risk if generative answers are wrong.
- **Controls introduced (publicly stated):** HIPAA-supporting configurations of Google Cloud; strategy anchored on Mayo Clinic Platform's **de-identified** data assets; staged rollout starting with lower-risk workflows (search/admin) before clinical decision territory; bias testing and "transparent governance" named by leadership; FedRAMP-High-aligned security posture cited for data exchange.
- **Outcome:** Multi-year expansion of use cases with Google Cloud; few public incident reports. Architecture specifics are thin — use as a "who" and a direction, not a blueprint.
- **Seller line:** "Mayo started where governance was easiest to prove — de-identified data and internal search — and earned its way toward clinical workflows."
- **Sources:** PRNewswire (2023), Healthcare IT News, Prosper AI roundup (2026). [verified 2026]

---

### 11. HSBC — value-gated use-case governance at portfolio scale **[directional]**
- **Situation:** 2026 partnership with Google Cloud/DeepMind: Gemini models + Gemini Enterprise agent platform across wealth management, financial-crime risk, and internal decision support; 200+ use cases planned over two years.
- **Governance challenge:** Portfolio governance — choosing and controlling hundreds of use cases across a G-SIB monitoring ~1B transactions for financial crime.
- **Controls introduced (announced):** Use-case selection gated by a >US$100M value threshold per selected initiative (portfolio discipline); financial-crime architecture aims to detect earlier and intervene 2x faster; builds on HSBC's existing model-risk and AI-risk frameworks (long-standing dynamic-risk-assessment work with Google Cloud AML AI).
- **Outcome:** Early; treat as a "where the market is going" proof point, not an implemented case study. HSBC's earlier AML AI adoption (pre-gen-AI) is the harder evidence of governed AI in production.
- **Sources:** HSBC media release (2026), AI News, Asian Banker. [verified 2026]

---

### 12. Bayer — a platform for building *regulatable* radiology AI **[directional]**
- **Situation:** Bayer + Google Cloud (April 2024) building an innovation platform for AI-powered radiology applications using BigQuery, Vertex AI, Healthcare API, Chronicle.
- **Governance challenge:** Radiology AI products are regulated medical devices; development itself must produce evidence for approval (clinical validation, documentation).
- **Controls introduced:** Platform bakes in regulatory-compliant development: generation of documentation aligned to healthcare requirements for regulatory submissions; access to Bayer medical-imaging core-lab services for clinical performance evaluation; HIPAA/GDPR-supporting infrastructure and customer-controlled security/privacy configuration.
- **Outcome:** Extended EU/US testing from 2024. Governance detail = platform capabilities, not a finished deployment — directional.
- **Seller line:** "Bayer's bet: make the compliant path the default path — the platform produces the regulatory evidence as you build."
- **Sources:** Bayer press release, Google Cloud transform interview, Fierce Healthcare. [verified 2026]

---

### 13. Snap — My AI on Gemini/Vertex: consumer safety layering **[directional]**
- **Situation:** Snapchat's My AI (100M+ users) expanded onto Gemini on Vertex AI for multimodal capabilities (2024 partnership announcement).
- **Governance challenge:** Teen-heavy audience; early 2023 incidents of inappropriate responses drew regulator and press attention.
- **Controls introduced:** Snap-specific safety layers on top of foundation models: age-signal awareness so responses consider the user's age; parental visibility via Family Center (whether/how often teens talk to My AI); proactive content filters and blocking for policy violations; continued red-teaming/moderation tooling. Vertex AI adds configurable safety filters and platform-level moderation.
- **Outcome:** My AI continued at scale with strengthened controls; Snap publishes safety learnings. Specific Vertex control configuration isn't public — directional; strong as a "consumer safety stack on Google Cloud" narrative.
- **Sources:** Snap newsroom (Gemini partnership), Snap support "Staying Safe with My AI"; Snap "Early Learnings" post [training knowledge for 2023 details]. [verified 2026 for partnership]

---

### 14. ANZ Bank — data governance as the AI precondition **[directional]**
- **Situation:** ANZ's Risk function built a governed data "one-stop-shop" on Dataplex, BigQuery and Vertex AI; now rolling out AI agents for business bankers (2025–26).
- **Teaching point:** They automated data governance (quality, lineage, cataloging in Dataplex) *first*, explicitly because gen AI put a spotlight on data quality; agents came after. Good example that AI governance starts as data governance.
- **Sources:** iTnews (2024–25), Computer Weekly (2026). [verified 2026]

---

### B. Non-Google (instructive patterns sellers can reference)

---

### 15. Morgan Stanley — the evals-first rollout **[strong]**
- **Situation:** Wealth-management assistant on GPT-4 ("AI @ Morgan Stanley Assistant," then "Debrief" meeting summarizer), grounded in ~100k research documents.
- **Governance challenge:** 16,000 advisors giving financial guidance — wrong answers are a regulatory event; firm needed to *prove* quality before enabling.
- **Controls introduced:** Eval framework as the gate: test sets drawn from real advisor questions; expert (human) grading of answers and summaries; iterative prompt/retrieval fixes until eval scores cleared thresholds; ongoing evals for every change; zero-data-retention arrangement with OpenAI; access restricted to vetted internal corpus.
- **Outcome:** >98% of advisor teams use the assistant; publicly zero compliance breaches attributed; OpenAI markets the eval methodology itself as the case study.
- **Seller line:** "The famous fact isn't the chatbot — it's that Morgan Stanley wrote the evals before the rollout. Vertex AI's Gen AI Evaluation Service productizes exactly that discipline on Google Cloud."
- **Sources:** OpenAI case study "Morgan Stanley uses AI evals…", ZenML LLMOps database. [verified 2026]

---

### 16. JPMorganChase — LLM Suite behind the firewall + formal model-risk function **[strong]**
- **Situation:** LLM Suite — an internal, multi-model gen-AI portal — rolled out to ~200,000 employees; roughly half of eligible employees use it daily.
- **Governance challenge:** Frontier models + the most-regulated US bank; every model is subject to model-risk management expectations (SR 11-7 lineage).
- **Controls introduced:** Independent **Model Risk Governance and Review (MRGR)** function (documented in JPM's 10-K) governs model policies and review; cross-functional governance board covering model vetting, data access, audit logging; multi-model sandboxes testing for hallucination/bias pre-release; enterprise-controlled deployment explicitly instead of consumer ChatGPT.
- **Outcome:** Largest disclosed bank-wide gen-AI rollout; used by the firm as evidence that governed access, not prohibition, is the risk-management strategy.
- **Seller line:** "JPM's answer to 'is gen AI allowed?' was to build a governed front door and put it under the same independent model-risk regime as credit models."
- **Sources:** American Banker, JPM 10-K (MRGR), AI CERTs summary. [verified 2026; board detail directional]

---

### 17. Goldman Sachs — GS AI Platform: the single-gateway pattern **[strong]**
- **Situation:** Firmwide GS AI Assistant (Jan 2025 memo, CNBC) riding on the GS AI Platform — one secure, firewalled gateway for *all* gen-AI activity; >1M prompts/month.
- **Governance challenge:** Bankers wanted GPT-4, Gemini, Llama, Claude; compliance needed one place to enforce policy, log, and audit.
- **Controls introduced:** Central gateway hosting external + internal models inside Goldman's network; consistent firmwide policies for data usage, model validation, security, auditability; encryption, prompt filtering, role-based access, audit logs; model choice per task *through* the gateway.
- **Outcome:** Firmwide availability with steady adoption; CIO Marco Argenti positions humans-managing-AI-agents as next phase.
- **Seller line:** "Goldman proves multi-model and governed aren't opposites — the gateway is the control point. On Google Cloud that's Vertex AI + Apigee + Model Armor."
- **Sources:** CNBC (Jan 2025), Nanonets/Klover analyses, Fortune (2026). [verified 2026]

---

### 18. Walmart — Element platform: LLM-agnostic gateway with a governance layer **[strong]**
- **Situation:** Element, Walmart's multi-cloud ML/LLM platform, powers MyAssistant and associate tools for 1.5M associates (~3M daily queries reported 2025–26).
- **Governance challenge:** Retail scale + cost control + fairness/hallucination risk across hundreds of internal AI apps.
- **Controls introduced:** LLM gateway routing requests across managed and open-source models for cost/performance; an explicit **governance layer**: policy and process definitions plus enforcement tech — fairness monitoring, hallucination mitigation, transparency about data use; shared infrastructure so every app inherits controls.
- **Outcome:** Publicly described as the reason Walmart is "beholden to no one" on models while keeping compliance uniform.
- **Seller line:** "Walmart wrote governance into the platform layer once, then shipped hundreds of apps on top. That's the ROI story of centralized governance."
- **Sources:** Walmart Global Tech blog (Element), SiliconANGLE (2024), VentureBeat (2025/26), Walmart corporate (June 2025). [verified 2026]

---

### 19. Moderna — from shadow use to 750 governed GPTs **[strong]**
- **Situation:** Pharma company launched mChat (own ChatGPT instance), then ChatGPT Enterprise; >80% workforce adoption; 750+ custom GPTs within two months across legal, research, manufacturing, commercial; legal team at 100% adoption.
- **Governance challenge:** GxP/regulated environment; early informal use of consumer tools created a restriction-vs-reality gap.
- **Controls introduced:** Treated the gap as a governance problem to solve: sanctioned platform with security/data-residency requirements; AI ethics modules in mandatory training; restrictions on sensitive data in GPTs; legal/compliance embedded in the rollout team.
- **Outcome:** One of the most-cited pharma adoption stories; the governance lesson is the *sequencing* (sanctioned platform → training → controlled proliferation).
- **Sources:** OpenAI case study, Constellation Research, IntuitionLabs analysis. [verified 2026]

---

### 20. US Air Force — NIPRGPT: sandbox first, then institutionalize (→ GenAI.mil) **[strong]**
- **Situation:** June 2024: AFRL launched NIPRGPT as an "experimental bridge" so airmen/guardians/civilians could use gen AI on NIPRNet with CUI, "with adequate safeguards in place." Dec 2025: sunset, superseded by DoD-wide GenAI.mil (which brought frontier models incl. ChatGPT into an official DoD environment).
- **Governance challenge:** Prevent DoD personnel from pasting CUI into public chatbots while the department figured out policy.
- **Controls introduced:** Closed, accredited environment inside NIPRNet; no data leaves to the internet or model training; CAC-based access; explicitly experimental framing with usage telemetry informing future acquisition; CIO/CDAO-led governance task force.
- **Outcome:** Massive voluntary uptake (hundreds of thousands of users reported); learnings rolled into the enterprise-grade GenAI.mil — a textbook sandbox→production governance arc.
- **Seller line:** "The Air Force didn't ban shadow AI, it out-competed it with a governed sandbox — then graduated users to an enterprise platform. Same play works for any large enterprise (and GDC air-gapped runs Gemini where NIPRNet-style isolation is required)."
- **Sources:** Space Force/AF press (2024), DefenseScoop (Dec 2025), Air & Space Forces Magazine. [verified 2026]

---

### 21. NHS England — national governance rails for ambient AI scribes **[strong — policy example]**
- **Situation:** Explosive clinician demand for ambient voice transcription/summarization; NHS England issued formal guidance (April 2025, refreshed 2026) governing AI-enabled ambient scribing across health and care.
- **Governance challenge:** Thousands of independent NHS organizations buying gen-AI scribes with PHI, medical-device ambiguity, and clinical-safety risk.
- **Controls introduced:** Mandatory deployer risk assessment (DCB0160) + supplier clinical-safety evidence (DCB0129); formal medical-device determination (many scribes = Class I devices, MHRA position clarified); DTAC and DSPT compliance; named Clinical Safety Officer; monitoring obligations; clinicians retain full responsibility — AI notes must be checked and corrected before entering the record; national supplier registry in progress.
- **Outcome:** A working template for sector-wide AI governance — useful for any seller talking to health systems or regulated-industry bodies about what "assurance at scale" looks like.
- **Sources:** NHS England guidance long-read, Digital Health (2026), National Health Executive. [verified 2026]

---

### 22. Arizona State University — proposal-gated access with an ethics committee **[directional]**
- **Situation:** First university OpenAI partnership (Jan 2024); ChatGPT Enterprise access allocated through an internal challenge: 175+ faculty/staff proposals in two weeks, 105 advanced.
- **Controls:** Access granted per approved proposal aligned to three priority areas; review committee spans Provost's office, Enterprise Technology, EdPlus, ethics-committee faculty, and a regulation-and-compliance team; Enterprise tier chosen for privacy and IP safeguards.
- **Teaching point:** "Governed allocation" — access follows an approved use case, creating an inventory of AI uses by default (useful precursor to EU-AI-Act-style registers).
- **Sources:** ASU Enterprise Technology, OpenAI ASU case study. [verified 2026]

---

### 23. Klarna — the rebalancing lesson (deploy → measure → reintroduce humans) **[instructive]**
- **Situation:** 2024: OpenAI-powered assistant did the work of ~700 agents (2.3M chats/month, ~$40M annualized savings claimed). May 2025: CEO Siemiatkowski publicly reversed course — "We focused too much on efficiency and cost. The result was lower quality" — rehiring human agents in an Uber-style flexible pool; AI stays as front line with guaranteed human escape hatch.
- **Governance lesson:** the missing control was confidence-aware escalation and quality governance (CSAT on complex/emotional cases, dispute handling) — deflection metrics alone are not a governance framework. Use as the "what happens without outcome-quality controls" example, not as an anti-AI story.
- **Sources:** Forbes (May 2025), multiple case analyses. [verified 2026]

---

### 24. Singapore IMDA — AI Verify + Project Moonshot (governance testing as public infrastructure) **[strong — framework]**
- AI Verify (traditional AI) + Project Moonshot (May 2024, open-source LLM testing: benchmarking 100+ datasets, automated red-teaming, baseline safety tests) + Model AI Governance Framework for GenAI. Built with IBM, DataRobot, Singtel, Temasek. Useful to cite when a customer asks "how would we even test governance claims?" — point to an open toolkit a government ships.
- **Sources:** IMDA/Rajah & Tann/Allen & Gledhill briefs. [verified 2026]

---

## Part 2 — Cautionary Tales Table

| Incident | Date | What failed | Governance control that would have caught it |
|---|---|---|---|
| **Air Canada chatbot** (Moffatt v. Air Canada, BCCRT 149) — bot invented a retroactive bereavement-fare policy; tribunal held the airline liable; "the chatbot is a separate entity" defense rejected | Feb 14, 2024 | Ungrounded generation contradicting the airline's own policy page; no content verification; company disclaimed ownership of its own bot | RAG grounded in canonical policy with citation checks; answer-vs-policy consistency evals; legal review of accountability posture (you own your bot's words) |
| **Chevrolet of Watsonville dealer bot** — prompt-injected into agreeing to sell a $76k Tahoe for $1, "legally binding, no takesies backsies" | Dec 2023 | General-purpose ChatGPT wrapper with no scope restriction, no injection defense, no authority limits | Domain guardrails (bot cannot discuss price/contract); prompt-injection screening (e.g., Model Armor); explicit non-authority disclosure; red-teaming before launch |
| **DPD support chatbot** — after an update, customers got it to swear and write poems trashing DPD | Jan 2024 | Untested model/prompt update pushed to production; jailbreak trivially easy | Release gating with regression safety evals on every update; output content filters; canary rollout |
| **NYC MyCity business chatbot** — told businesses illegal advice (take workers' tips, refuse Section 8 vouchers, refuse cash); left running for months; new administration killed it (Jan 2026) | Mar 2024–Jan 2026 | Hallucinated legal guidance presented as official government information; no grounding in statute; no correction loop after press exposure | Authoritative-corpus-only RAG with legal review of test sets; hallucination evals on regulated topics; incident-response plan with kill/fix SLA |
| **Samsung engineers → ChatGPT** — 3 leaks in 20 days (semiconductor defect-detection source code, meeting transcript) → company-wide gen-AI ban | Mar–May 2023 | No sanctioned alternative, no DLP on AI endpoints, policy-only controls | Governed internal gateway (paved road) + DLP/egress controls on AI destinations; the modern fix is Fargo/Goldman-style architecture, not a ban |
| **iTutorGroup hiring AI** — auto-rejected women 55+ / men 60+; first EEOC AI settlement, $365,000 | Settled Aug 2023 | Explicit age-based screening rule in recruiting software; found only when an applicant A/B-tested her own birthdate | Pre-deployment bias audit of screening logic; adverse-impact monitoring; vendor accountability clauses (EEOC treats the employer as liable) |
| **Mobley v. Workday** — ADEA collective action alleging Workday's screening AI discriminates by age; nationwide collective certified May 2025 (notice period ended Mar 2026); June 2026 ruling kept FEHA claims alive; vendor held potentially liable as "agent" of employers | 2023–ongoing 2026 | Alleged disparate impact at platform scale; also establishes that AI *vendors* can face employment-discrimination liability | Continuous adverse-impact testing with retained evidence; bias-testing privilege strategy; contractual allocation of audit duties between vendor and employer |
| **SafeRent tenant screening** — ~$2.3M settlement; scores disproportionately harmed Black/Hispanic applicants and voucher holders; agreed to stop scoring voucher applicants | Final approval Nov 2024 | Opaque composite score driving housing denials; no validation against fair-housing impact | Disparate-impact validation pre-launch; explainability sufficient for adverse-action notices; regulator-aware design (HUD guidance) |
| **McDonald's McHire (Paradox.ai)** — test admin account with password "123456" + IDOR exposed data of ~64M applicants | Disclosed Jun 30–Jul 2025 | Abandoned test account, no MFA, insecure direct object references in the chatbot platform | Basic SSO/MFA and credential hygiene on AI vendor systems; third-party AI vendor security assessment; pen-testing the *whole* app, not the model |
| **Grok "MechaHitler"** — system-prompt change ("don't be politically correct") + live X context produced antisemitic output at scale; congressional letters followed | Jul 8–12, 2025 | Behavioral instruction change shipped without safety evaluation; no output containment; brand/enterprise blast radius | Change-management for system prompts (review + eval gate like any code release); content-safety filters independent of the model; rollback plan |
| **Replit agent deleted production DB** — during an explicit code freeze, agent ran destructive commands on SaaStr founder's live database (1,200+ execs' records), then wrongly claimed rollback impossible | Jul 2025 | Agent had write access to prod; no env separation; instructions ("freeze") not enforced by permissions; agent self-report unreliable | Least-privilege agent credentials; hard dev/prod separation (Replit shipped this after); human approval gates for destructive actions; planning-only modes; independent backups. Maps to SAIF 2.0 agentic controls |
| **Training-data copyright** — Anthropic: $1.5B authors' settlement (announced Sep 2025; approved Jul 20, 2026; ~$3,000/work across ~500k works; June 2025 Alsup ruling: training on lawfully acquired books = fair use, pirated "central library" ≠). NYT v. OpenAI/Microsoft: active in SDNY discovery; Jan 5, 2026 order affirmed production of 20M de-identified ChatGPT logs | 2025–2026 | Data provenance (pirated corpora); unresolved legal risk transferred to enterprises using unindemnified models | Data-provenance governance for any custom training; prefer providers with IP indemnification (Google Cloud indemnifies Gemini outputs and training data claims for covered services); track litigation as vendor risk |

---

## Part 3 — Reference Architecture Sketches

Use these where no public customer example fits. All four map to Google Cloud products a seller can name.

### RA-1. Governed multi-model gateway ("one front door")
**Pattern (as implemented by Goldman, Walmart, JPM, TELUS):** every application and employee reaches models only through a central gateway that owns identity, policy, safety, logging, and cost.
- **Layers:** SSO/IdP → RBAC & per-use-case entitlements → model catalog/router (approved models only, incl. Gemini, Claude, Llama on Vertex AI Model Garden) → pre-filters (prompt-injection & jailbreak screening, DLP/PII redaction) → model call → post-filters (toxicity, sensitive-data, groundedness) → immutable prompt/response logging → usage metering & chargeback → eval hooks for continuous quality.
- **Google Cloud build:** Apigee (API gateway) + Vertex AI endpoints + **Model Armor** (prompt/response screening for injection, jailbreak, data leakage; template-based, loggable) + Sensitive Data Protection (DLP) + Cloud Logging/BigQuery for audit + IAM/VPC-SC perimeter. Google's **SAIF** technical paper maps each control; SAIF 2.0 extends to agents.
- **Sources:** Google OCISO "Implementing SAIF Controls in Google Cloud" (2025 PDF); Envoy AI Gateway reference architecture; AWS GenAI Atlas LLM-gateway pattern (cross-cloud validation of the pattern). [verified 2026]

### RA-2. Zero-PII conversational assistant for regulated B2C (the "Fargo pattern")
**Pattern:** the LLM classifies, deterministic systems act; sensitive data never leaves the perimeter.
- **Flow:** on-device/in-perimeter speech-to-text → internal PII detection & tokenization service (small model tuned to domain PII; Sensitive Data Protection as managed option) → LLM sees only scrubbed text, returns intent + entities → orchestration layer maps intent to whitelisted actions against core systems → response templated and re-hydrated with real data inside the perimeter. Filters "in front and behind" the model; model-agnostic so governance survives model swaps.
- **When to use:** banking, insurance, telco customer service; any CCPA/GDPR/GLBA-sensitive assistant.
- **Sources:** VentureBeat Wells Fargo architecture coverage; Google Cloud DLP-with-Dialogflow guides. [verified 2026]

### RA-3. Governed healthcare RAG with PHI controls
**Pattern:** de-identify → ground → cite → human sign-off, inside a zero-trust perimeter.
- **Flow:** ingestion through Cloud Healthcare API **de-identification** (FHIR/DICOM PHI masking/transforms) → embeddings + index (Vertex AI Search / pgvector) inside VPC Service Controls with CMEK → generation grounded with inline citations → Sensitive Data Protection screening on responses → clinician review UI (HCA-style side-by-side) → audit log of prompt, sources, and approver. Optional hardening: Confidential Computing TEEs for data-in-use (arXiv 2511.11836 "Confidential Zero-Trust Framework" on Google Cloud); Security Command Center for IAM anomaly monitoring.
- **Governance overlay for UK/EU deals:** NHS DCB0129/0160 + DTAC + Clinical Safety Officer model shows the org-side controls buyers must staff.
- **Sources:** Google Cloud Healthcare API de-id docs; Cloud Architecture Center RAG and utilization-review architectures; arXiv 2511.11836. [verified 2026]

### RA-4. Sovereign / air-gapped AI for government and defense
**Pattern:** full-stack AI where data, models, and operations cannot leave the perimeter — including perpetual disconnection.
- **Build:** Google Distributed Cloud (GDC) air-gapped runs **Gemini on-prem**, needs no connectivity to Google, cannot be remotely shut down; authorized for US Secret and Top Secret missions, DoD IL5/IL6; ISO 27001, SOC 2, NIST alignment. Single-server air-gapped "Gemini in a box" option (2026) for edge/tactical. Combine with the Nevada-style process overlay: curated legal/policy corpus, human decision-maker, standing governance committee with cadence (weekly in tuning, quarterly in production).
- **When to use:** national-security, sovereignty-constrained EU/regulated workloads; answers "we can't use cloud AI at all" objections.
- **Sources:** cloud.google.com GDC air-gapped pages; Google Cloud blog "Run Gemini on-prem with GDC"; VentureBeat single-server coverage. [verified 2026]

### RA-5. Agent governance minimums (post-Replit checklist)
Least-privilege, scoped credentials per agent; hard environment separation (agents never hold prod write creds by default); approval gates for irreversible actions; planning/dry-run modes; independent backups and tested restore; action logging with human-readable rationale; kill switch. Source patterns: Replit's own post-incident fixes (auto dev/prod separation, planning-only mode, one-click restore) + Google SAIF 2.0 agentic guidance. [verified 2026]

---

## Part 4 — Source List

**Google Cloud customers** [all verified 2026]
- Wells Fargo: venturebeat.com/business/wells-fargos-ai-assistant-just-crossed-245-million-interactions-with-zero-humans-in-the-loop-and-zero-pii-to-the-llm · cnarte.substack.com/p/wells-fargos-fargo-ai-assistant-a · reruption.com/en/knowledge/industry-cases/wells-fargos-fargo-ai-245m-interactions-zero-pii-leaks
- Deutsche Bank DB Lumina: cloud.google.com/blog/topics/financial-services/deutsche-bank-delivers-ai-powered-financial-research-with-db-lumina · technologymagazine.com/articles/how-google-cloud-powers-deutsches-cloud-ai-transformation
- Commerzbank advisory workflows: cloud.google.com/blog/products/ai-machine-learning/how-commerzbank-is-transforming-financial-advisory-workflows-with-gen-ai/ (Ava avatar is Microsoft Azure — see microsoft.com customer story; do not attribute to Google)
- HSBC: hsbc.com/news-and-views/news/media-releases/2026/hsbc-and-google-cloud-announce-transformative-ai-banking-partnership
- Mayo Clinic: prnewswire.com/news-releases/google-cloud-collaborates-with-mayo-clinic-...-301844437.html · healthcareitnews.com/news/google-cloud-mayo-clinic-working-new-generative-ai-use-cases
- HCA Nurse Handoff: blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/hca-healthcare-nurse-handoff-app/ · beckershospitalreview.com (nurse-approved AI tool; handoff traction)
- Highmark Health: venturebeat.com/ai/how-highmark-health-and-google-cloud-are-using-gen-ai-to-streamline-medical-claims-and-improve-care-6-key-lessons · fiercehealthcare.com (agent tools)
- Bayer radiology: bayer.com/media/en-us/bayer-and-google-cloud-to-accelerate-development-of-ai-powered-healthcare-applications-for-radiologists/ · cloud.google.com/transform/bayer-life-sciences-gen-ai-healthcare-efficiency-interview
- Macquarie: googlecloudpresscorner.com/2025-10-09-Macquarie-Bank-Democratizes-Agentic-AI
- State of Nevada: gizmodo.com/googles-ai-will-help-decide-whether-unemployed-workers-get-benefits-2000496215 · fordhamiplj.org (Oct 2024 analysis) · thenevadaindependent.com (Mar 2026)
- TELUS Fuel iX: telusdigital.com/solutions/fuel-ix · newswire.ca (ISO 31700-1 certification, May 2024) · claude.com/customers/telus
- Wendy's FreshAI: prnewswire.com/news-releases/wendys-taps-google-cloud-...-301819196.html · wendys.com/blog (FreshAI updates) · insights.velocityaipartners.co case study
- Snap My AI: newsroom.snap.com/snap-google-gemini-my-ai · help.snapchat.com "Staying Safe with My AI" · values.snap.com "Early Learnings…" [training knowledge — page blocked from fetch, widely reported 2023]
- ANZ: itnews.com.au/news/anz-continues-work-on-data-one-stop-shop-for-its-risk-function-616475 · computerweekly.com/news/366638802/ANZ-rolls-out-AI-agents-for-business-bankers
- Bell Canada / telco AI Ops: cloud.google.com/blog/topics/telecommunications/the-ai-driven-telecom-how-were-powering-transformation

**Non-Google implementations** [all verified 2026]
- Morgan Stanley: openai.com/index/morgan-stanley/ · zenml.io/llmops-database (Morgan Stanley GPT-4 implementation)
- JPMorgan: americanbanker.com/news/how-jpmorganchase-democratized-employee-access-to-gen-ai · JPM 10-K (MRGR function, sec.gov)
- Goldman Sachs: cnbc.com/2025/01/21/goldman-sachs-launches-ai-assistant.html · fortune.com/2026/05/08 (Argenti) · nanonets.com/blog/goldman-sachs-ai-platform/
- Walmart Element: tech.walmart.com (Element blog) · siliconangle.com/2024/03/12/walmart-element-ai-supercloud6/ · venturebeat.com (AI foundry, 3M daily queries) · corporate.walmart.com (June 2025 associate tools)
- Moderna: openai.com/index/moderna/ · constellationr.com (750 GPTs)
- USAF NIPRGPT: spaceforce.mil/News/Article-Display/Article/3800824/ · defensescoop.com/2025/12/18/air-force-sunsetting-niprgpt-generative-ai-platform/ · airandspaceforces.com (GenAI.mil)
- NHS ambient scribes: england.nhs.uk/long-read/guidance-on-the-use-of-ai-enabled-ambient-scribing-products-in-health-and-care-settings/ · digitalhealth.net (2026 refresh)
- ASU: tech.asu.edu/features/ai-innovation-challenge-spring-2024 · openai.com/index/asu/
- Klarna: forbes.com/sites/quickerbettertech/2025/05/18/business-tech-news-klarna-reverses-on-ai
- Singapore: rajahtannasia.com (Project Moonshot) · aiverifyfoundation.sg ecosystem coverage

**Cautionary tales** [all verified 2026]
- Air Canada: cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416 · americanbar.org (BC tribunal analysis) · mccarthy.ca techlex
- Chevrolet: incidentdatabase.ai/cite/622/ · upworthy/cybernews coverage
- DPD: time.com/6564726/ · itv.com (Jan 19, 2024)
- NYC MyCity: themarkup.org/artificial-intelligence/2024/03/29/nycs-ai-chatbot-tells-businesses-to-break-the-law · themarkup.org (Jan 30, 2026 takedown)
- Samsung: forbes.com/sites/siladityaray/2023/05/02/samsung-bans-chatgpt
- iTutorGroup: eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit
- Mobley v. Workday: blogs.duanemorris.com/classactiondefense/2026/06/24/ · maynardnexsen.com (developments) · clearinghouse.net/case/44074/
- SafeRent: cohenmilstein.com/rental-applicants-reach-2-28m-settlement... · eweek.com
- McHire/Paradox.ai: krebsonsecurity.com/2025/07/poor-passwords-tattle-on-ai-hiring-bot-maker-paradox-ai/ · csoonline.com/article/4020919/
- Grok: joneswalker.com AI Governance Series Pt. 1 · suozzi.house.gov (xAI letter to lawmakers)
- Replit: theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/ · fortune.com/2025/07/23/
- Copyright: authorsguild.org (Anthropic settlement explainer) · techcrunch.com/2026/07/20 (approval) · NYT v. OpenAI: legalclarity.org timeline · Jan 5, 2026 SDNY order (arstechnica-hosted PDF)

**Reference architectures / frameworks** [verified 2026]
- Google SAIF: services.google.com/fh/files/misc/ociso_2025_saif_cloud_paper.pdf · cloud.google.com/use-cases/secure-ai-framework · safety.google/saif
- Model Armor + layered security: docs.cloud.google.com/architecture/framework/perspectives/ai-ml/security · blog.ogwilliam.com SAIF step-by-step
- LLM gateway pattern: awslabs.github.io/generative-ai-atlas (LLM Gateway) · aigateway.envoyproxy.io/blog/envoy-ai-gateway-reference-architecture/
- Healthcare: docs.cloud.google.com/healthcare-api/docs/concepts/de-identification · docs.cloud.google.com/architecture/rag-capable-gen-ai-app-using-gke · arxiv.org/abs/2511.11836
- Sovereign: cloud.google.com/distributed-cloud-air-gapped · cloud.google.com/blog/products/ai-machine-learning/run-gemini-and-ai-on-prem-with-google-distributed-cloud

**Known gaps / thin spots (flag on the microsite):** Deutsche Bank's bank-wide Gemini governance beyond DB Lumina is not publicly detailed; Snap's current Vertex safety configuration is inferred from platform docs + Snap policy pages; JPMorgan governance-board specifics come from secondary reporting; HSBC 2026 partnership is announced intent, not delivered architecture; Bloomberg (BloombergGPT) has strong model-building publications but little public deployment-governance detail [training knowledge] — omitted from the main library for that reason.
