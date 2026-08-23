import type { CaseStudy } from "../types";

/**
 * Case studies chosen because they teach a governance mechanism, not because
 * they name-drop. "google" lens = Google Cloud customer story; "market" =
 * instructive non-Google implementation. Confidence "strong" = mechanics
 * publicly documented; "directional" = real deployment, thinner public detail.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "wells-fargo",
    company: "Wells Fargo",
    industry: "Financial Services",
    lens: "google",
    system: "Fargo — consumer virtual assistant (Google Cloud, Gemini Flash)",
    situation:
      "A US G-SIB put an LLM-powered assistant in its mobile app — 245M+ interactions by 2024.",
    challenge:
      "Bank secrecy and privacy expectations mean customer PII must never reach a foundation model.",
    controls: [
      "On-device speech-to-text",
      "Internal PII detection and tokenization before any external call",
      "LLM used only for intent and entity extraction",
      "Deterministic banking systems execute all actions",
      "Model-agnostic orchestration so governance survives model swaps",
    ],
    architecture:
      "Device STT → internal PII scrub/tokenize → Gemini (intent/entity only) → in-perimeter orchestration against core banking → response re-assembled with real data inside the bank. 'We're the filters in front and behind,' per the CIO.",
    outcome:
      "245M+ interactions with zero PII to the LLM publicly claimed — the reference pattern for regulated conversational AI.",
    lessons: [
      "You don't need to trust the model with PII to use the model — that's an architecture decision.",
      "Keeping the LLM to classification while deterministic systems act constrains blast radius structurally.",
    ],
    layerIds: ["data", "application"],
    confidence: "strong",
    sourceIds: ["src-wellsfargo"],
  },
  {
    id: "deutsche-bank",
    company: "Deutsche Bank",
    industry: "Financial Services",
    lens: "google",
    system: "DB Lumina — research agent (Gemini on Google Cloud)",
    situation:
      "A Gemini-based research assistant for Deutsche Bank Research, live since 2024, ~5,000 users and growing.",
    challenge:
      "Research sits in a compliance minefield: MNPI walls, strict sourcing and citation rules, publication controls.",
    controls: [
      "Corporate IdP identity with centralized entitlements (dbEntitlements)",
      "Every prompt interaction stored and queryable in BigQuery",
      "RAG with inline citations and source viewers",
      "Version-controlled test datasets; baselines pinned to git hashes",
      "Custom metrics: citation precision and recall, false-rejection rate; Ragas hallucination checks",
    ],
    architecture:
      "GKE microservices; Vertex AI Vector Search + pgvector; Gemini models on the platform; Discovery Engine RAG; full observability. Evaluation wired into CI as a release gate.",
    outcome:
      "In production at scale, saving 30–45 minutes per earnings template; the bank publishes its eval framework.",
    lessons: [
      "'Audit-ready gen AI' concretely means: metric dictionary, versioned test sets, pinned baselines, logged prompts.",
      "Evals are the compliance artifact — not a quality nicety.",
    ],
    layerIds: ["application", "model", "security"],
    confidence: "strong",
    sourceIds: ["src-dblumina"],
  },
  {
    id: "commerzbank",
    company: "Commerzbank",
    industry: "Financial Services",
    lens: "google",
    system: "Advisory-call documentation pipeline (Gemini on the Agent Platform)",
    situation:
      "Regulatory documentation of investment-advice calls took 60+ minutes of manual write-up per call.",
    challenge:
      "Advice documentation is mandatory and audited; automation must be provably accurate — numbers especially — and reviewable.",
    controls: [
      "Multi-step pipeline with domain-tuned prompting for numerical accuracy",
      "Multiple candidate summaries per compliance-form field",
      "Gen AI evaluation service selects the best candidate and emits a human-readable explanation — the audit artifact",
      "Advisor reviews and approves before submission",
    ],
    architecture:
      "Call audio → Cloud Storage → Gemini diarized transcription → fact extraction → chain-of-thought summary in German → eval-service selection with explanation → human approval, formatted to regulatory templates.",
    outcome: "60+ minutes to a few minutes including human review; being scaled to further use cases.",
    lessons: [
      "Use a second service to judge and explain the model's work — the explanation becomes the audit trail.",
      "Compliance can be a feature of the pipeline, not a review stage bolted on.",
    ],
    layerIds: ["application", "model"],
    confidence: "strong",
    sourceIds: ["src-commerzbank"],
  },
  {
    id: "hca",
    company: "HCA Healthcare",
    industry: "Healthcare",
    lens: "google",
    system: "Nurse Handoff app (Google Cloud gen AI over the EHR)",
    situation:
      "Shift-change handoffs are a known patient-safety failure point across 180+ hospitals.",
    challenge:
      "An AI summary that omits a medication change could harm a patient; clinicians must stay accountable.",
    controls: [
      "Split-screen UI: EHR on one side, AI draft on the other — verification is one glance",
      "Prompts constrain the model to prioritized clinical details",
      "Nurses edit and approve before handoff; clinicians remain responsible",
      "Nurse feedback loops drove iterative design",
    ],
    architecture:
      "Google Cloud healthcare stack with Gemini-class models against EHR data on hospital mobile devices; the workflow is the control.",
    outcome:
      "Across pilot hospitals, nurses rated outputs accurate in over 85% of cases and useful in over 90%; rollout expanded.",
    lessons: [
      "Don't bolt review onto the workflow — design the UI so review is the workflow.",
      "That is how 'human in the loop' passes the clinician-acceptance test.",
    ],
    layerIds: ["application", "people"],
    confidence: "strong",
    sourceIds: ["src-hca"],
  },
  {
    id: "highmark",
    company: "Highmark Health",
    industry: "Healthcare",
    lens: "google",
    system: "Enterprise gen-AI platform (Vertex/Gemini behind an internal surface)",
    situation:
      "A payer-provider with 6M+ members scaling gen AI to 14,000+ of 40,000+ employees, past a million prompts.",
    challenge:
      "PHI and claims data plus thousands of experimenting employees — fragmentation would mean leakage and compliance risk.",
    controls: [
      "A single internal platform centralizing model access",
      "Usage tracking as governance data: who uses what, for what",
      "Human-in-the-loop mandated in use-case design",
      "Staged rollout by use case under a responsible-AI framework",
    ],
    architecture:
      "Vertex AI and Gemini behind Highmark's internal platform; claims-processing gen AI built jointly with Google Cloud.",
    outcome:
      "One of the largest documented healthcare employee gen-AI rollouts, cited as a model for governed scaling.",
    lessons: [
      "Centralize access and measure usage first — governance data is what lets you expand safely.",
      "Experimentation inside a governed surface beats prohibition outside one.",
    ],
    layerIds: ["people", "enterprise", "data"],
    confidence: "strong",
    sourceIds: ["src-highmark"],
  },
  {
    id: "nevada-detr",
    company: "State of Nevada (DETR)",
    industry: "Government",
    lens: "google",
    system: "Unemployment-appeals drafting (Vertex AI RAG over Nevada law)",
    situation:
      "A pandemic-era appeals backlog; Google built a RAG system that drafts eligibility recommendations from hearing transcripts.",
    challenge:
      "Automated adjudication of public benefits raises due-process, bias, hallucination, and transparency concerns — publicly contested.",
    controls: [
      "Retrieval constrained to Nevada unemployment law and prior appeal cases — not the open web",
      "Every AI recommendation reviewed by a human referee who owns the decision",
      "Governance committee: weekly during tuning, quarterly in production, monitoring hallucination and bias",
    ],
    architecture:
      "Vertex AI with a tuned model over a curated legal corpus; drafting time drops from hours to ~5 minutes with human review preserved.",
    outcome:
      "Deployed and delivering backlog relief; remains publicly scrutinized — which is itself the lesson.",
    lessons: [
      "Public-sector AI needs constrained corpora, human decision-makers, and a standing review committee — and a plan to defend all three publicly.",
      "Present it honestly: governed and scrutinized, not solved.",
    ],
    layerIds: ["application", "enterprise"],
    confidence: "strong",
    sourceIds: ["src-nevada"],
  },
  {
    id: "telus",
    company: "TELUS",
    industry: "Telecom",
    lens: "google",
    system: "Fuel iX — enterprise AI platform over Gemini, Claude, and others",
    situation:
      "A telecom giving tens of thousands of employees curated multi-model access, plus customer-facing gen AI.",
    challenge:
      "Privacy-sensitive, regulated market demanding provable trust — not self-attestation.",
    controls: [
      "One guardrail control plane over all model traffic (moderation, hallucination and brand-safety checks)",
      "'Purple teaming' — adversarial plus defensive testing",
      "World-first ISO 31700-1 Privacy by Design certification for its gen-AI support tool (2024, assessed by KPMG)",
    ],
    architecture:
      "Fuel iX gateway over Vertex-hosted Gemini and third-party models; per-interaction moderation; management console.",
    outcome: "Certification achieved; TELUS now sells Fuel iX externally — governance became a product.",
    lessons: [
      "Model choice and governance aren't in tension when the gateway owns the controls.",
      "Third-party certification turns governance into a market asset.",
    ],
    layerIds: ["security", "model", "people"],
    confidence: "strong",
    sourceIds: ["src-telus"],
  },
  {
    id: "wendys",
    company: "Wendy's",
    industry: "Retail / QSR",
    lens: "google",
    system: "FreshAI drive-thru voice ordering (Google Cloud)",
    situation: "Real-time, customer-facing, revenue-touching voice AI at hundreds of locations.",
    challenge: "Instantly visible errors; brand risk from off-menu conversation.",
    controls: [
      "Model fenced to the menu with business-rule guardrails — no open-ended chat",
      "Deterministic POS integration executes the order",
      "Instant human handoff when confidence drops below threshold",
      "Accuracy measured operationally: orders completed without intervention",
    ],
    architecture:
      "Speech recognition → Vertex AI LLM constrained by menu and rules → POS integration, with the handoff path wired into restaurant operations.",
    outcome:
      "86% of orders with no crew intervention, ~99% counting brief assists; scaled across franchises while a rival's unfenced pilot was withdrawn.",
    lessons: [
      "Put a fence around the problem: scope, business rules, and confidence-based handoff are agent governance in a QSR.",
      "Design the handoff before you need it.",
    ],
    layerIds: ["application", "agent"],
    confidence: "strong",
    sourceIds: ["src-wendys"],
  },
  {
    id: "macquarie",
    company: "Macquarie Bank",
    industry: "Financial Services",
    lens: "google",
    system: "Bank-wide Gemini Enterprise rollout (announced Oct 2025)",
    situation: "Gemini Enterprise rolled out to every employee of its Australian retail bank — not just tech staff.",
    challenge: "Bank-wide access by non-technical staff multiplies misuse risk.",
    controls: [
      "99% of employees completed mandatory generative-AI training around the rollout",
      "Structured AI upskilling pathway",
      "Rollout staged on an already-governed Google Cloud data foundation with admin controls underneath",
    ],
    architecture:
      "Gemini Enterprise as the sanctioned employee surface, identity-based access and logging as the substrate.",
    outcome: "Publicly framed as democratized agentic AI with safety framing; control specifics not fully published.",
    lessons: [
      "The number to quote is 99% training completion — workforce readiness is a governance control.",
      "Sequence: data foundation → training → broad access.",
    ],
    layerIds: ["people", "enterprise"],
    confidence: "directional",
    sourceIds: ["src-macquarie"],
  },
  {
    id: "morgan-stanley",
    company: "Morgan Stanley",
    industry: "Financial Services",
    lens: "market",
    system: "Advisor assistant on GPT-4, grounded in ~100k research documents",
    situation: "16,000 advisors giving financial guidance with an AI assistant.",
    challenge: "Wrong answers are a regulatory event; quality had to be proven before enablement.",
    controls: [
      "Evaluation framework as the launch gate: test sets from real advisor questions",
      "Expert human grading of answers and summaries until thresholds cleared",
      "Ongoing evals for every change; zero-data-retention terms with the model vendor",
      "Access restricted to the vetted internal corpus",
    ],
    architecture:
      "RAG over curated research with an evals-first rollout process — the vendor now markets the methodology itself as the case study.",
    outcome: "Over 98% of advisor teams adopted; no attributed compliance breaches publicly reported.",
    lessons: [
      "The famous part isn't the chatbot — it's that the evals were written before the rollout.",
      "Evaluation discipline is portable: the same play runs on any platform.",
    ],
    layerIds: ["model", "application"],
    confidence: "strong",
    sourceIds: ["src-morganstanley"],
  },
  {
    id: "jpmorgan",
    company: "JPMorganChase",
    industry: "Financial Services",
    lens: "market",
    system: "LLM Suite — internal multi-model portal for ~200,000 employees",
    situation: "The most-regulated US bank giving general AI access at workforce scale.",
    challenge: "Frontier models under model-risk-management expectations with SR 11-7 lineage.",
    controls: [
      "Independent Model Risk Governance and Review function (documented in the 10-K)",
      "Cross-functional governance covering vetting, data access, and audit logging",
      "Multi-model sandboxes testing hallucination and bias pre-release",
      "Enterprise-controlled deployment explicitly instead of consumer tools",
    ],
    architecture:
      "A governed internal front door to multiple models behind the firewall, under the same independent risk regime as credit models.",
    outcome: "The largest disclosed bank-wide gen-AI rollout; governed access, not prohibition, as the risk strategy.",
    lessons: [
      "Put gen AI under the same independent review function that governs every other model.",
      "The governed front door is the alternative to a thousand shadow doors.",
    ],
    layerIds: ["enterprise", "model", "people"],
    confidence: "strong",
    sourceIds: ["src-jpm"],
  },
  {
    id: "goldman-walmart",
    company: "Goldman Sachs & Walmart",
    industry: "Cross-industry pattern",
    lens: "market",
    system: "GS AI Platform / Walmart Element — central multi-model gateways",
    situation:
      "Bankers wanted GPT-4, Gemini, Llama, and Claude; Walmart runs hundreds of internal AI apps for 1.5M associates.",
    challenge: "Multi-model demand versus one place to enforce policy, log, and audit.",
    controls: [
      "Single gateway hosting external and internal models inside the network",
      "Firmwide policies for data usage, validation, security, auditability",
      "RBAC, prompt filtering, encryption, audit logs (Goldman); fairness and hallucination monitoring in the platform layer (Walmart)",
      "Model choice per task through the gateway, never around it",
    ],
    architecture:
      "The 'one governed front door' pattern: every application inherits controls from shared infrastructure — governance written once, shipped everywhere.",
    outcome:
      "Goldman: firmwide assistant at over a million prompts/month. Walmart: ~3M daily queries, model-agnostic by design.",
    lessons: [
      "Multi-model and governed are not opposites — the gateway is the control point.",
      "Platform-layer governance is the ROI story: hundreds of apps inherit it for free.",
    ],
    layerIds: ["security", "model", "application"],
    confidence: "strong",
    sourceIds: ["src-goldman", "src-walmart"],
  },
  {
    id: "moderna",
    company: "Moderna",
    industry: "Pharma",
    lens: "market",
    system: "mChat → ChatGPT Enterprise with 750+ governed custom GPTs",
    situation:
      "A GxP-regulated pharma where informal consumer-AI use had outrun policy.",
    challenge: "Close the restriction-vs-reality gap without losing momentum.",
    controls: [
      "Sanctioned platform with security and data-residency requirements",
      "AI ethics modules in mandatory training",
      "Restrictions on sensitive data in custom GPTs",
      "Legal and compliance embedded in the rollout team",
    ],
    architecture:
      "Enterprise tenant with governed self-service creation of custom assistants across legal, research, manufacturing, and commercial.",
    outcome: "80%+ workforce adoption; 750+ custom GPTs within two months; legal at 100% adoption.",
    lessons: [
      "The sequencing is the lesson: sanctioned platform → training → controlled proliferation.",
      "Shadow use is a demand signal to convert, not a behavior to punish.",
    ],
    layerIds: ["people", "enterprise"],
    confidence: "strong",
    sourceIds: ["src-moderna"],
  },
  {
    id: "usaf-niprgpt",
    company: "US Air Force",
    industry: "Government / Defense",
    lens: "market",
    system: "NIPRGPT — sanctioned GenAI sandbox on NIPRNet, later GenAI.mil",
    situation:
      "Preventing DoD personnel from pasting controlled information into public chatbots while policy matured.",
    challenge: "A workforce of hundreds of thousands with real AI demand and hard classification rules.",
    controls: [
      "Closed, accredited environment inside the network — data never leaves to the internet or model training",
      "CAC-based access; explicitly experimental framing",
      "Usage telemetry informing future acquisition; CIO/CDAO-led governance",
    ],
    architecture:
      "A governed sandbox that out-competed shadow AI, then graduated users to a department-wide enterprise platform (GenAI.mil) in 2025.",
    outcome: "Massive voluntary uptake, then institutionalization — the textbook sandbox-to-production governance arc.",
    lessons: [
      "Don't ban shadow AI; out-compete it, measure it, then institutionalize it.",
      "Where isolation is mandatory, air-gapped platforms make the same arc possible (Gemini runs on GDC air-gapped for exactly this).",
    ],
    layerIds: ["people", "enterprise", "data"],
    confidence: "strong",
    sourceIds: ["src-niprgpt"],
  },
  {
    id: "nhs-scribes",
    company: "NHS England",
    industry: "Healthcare / Regulator",
    lens: "market",
    system: "National governance rails for AI ambient scribes (guidance, 2025–2026)",
    situation:
      "Explosive clinician demand for ambient transcription across thousands of independent NHS organizations.",
    challenge: "PHI, medical-device ambiguity, and clinical-safety risk at sector scale.",
    controls: [
      "Mandatory deployer risk assessment (DCB0160) and supplier clinical-safety evidence (DCB0129)",
      "Formal medical-device determination for scribe products",
      "Named Clinical Safety Officer; monitoring obligations",
      "Clinicians retain full responsibility — AI notes checked before entering the record",
    ],
    architecture:
      "Not a system but a governance architecture: sector-wide rails any large federated organization can copy.",
    outcome: "A working template for AI assurance at sector scale, refreshed in 2026 with a supplier registry in progress.",
    lessons: [
      "Federated organizations need governance rails, not per-site heroics.",
      "Assigning clinical (human) responsibility explicitly is what makes scribes deployable.",
    ],
    layerIds: ["enterprise", "application"],
    confidence: "strong",
    sourceIds: ["src-nhs"],
  },
];
