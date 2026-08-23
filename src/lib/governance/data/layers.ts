import type { Layer } from "../types";

/**
 * The AI Governance Stack — seven layers, each answering one customer
 * question, each carrying the same operating loop: set policy, gate the
 * lifecycle, enforce at runtime, prove it with evidence.
 */
export const LAYERS: Layer[] = [
  {
    id: "enterprise",
    num: "1",
    name: "Enterprise Governance",
    short: "Enterprise",
    question: "Who is accountable for AI — and for which AI?",
    hue: "enterprise",
    summary:
      "The operating model above every AI system: named accountability, an inventory of everything AI in the enterprise, risk-tiered intake, policy that maps to regulation, and the councils and escalation paths that make decisions stick. Every framework — NIST AI RMF, ISO/IEC 42001, the EU AI Act — starts here, because none of the other layers can work if nobody owns them.",
    insight:
      "You cannot govern what you have not inventoried, and you have not governed what nobody owns.",
    executive: {
      stakes: [
        "Regulators now regulate AI users, not just AI builders: EU deployer duties, Korea's AI Basic Act, and US state transparency laws all attach obligations to enterprises that merely deploy AI.",
        "Only 28% of organizations report CEO-level oversight of AI governance (McKinsey, 2025) — accountability gaps are the norm, and they surface in court: Air Canada was held liable for its own chatbot's invented policy.",
        "Ungoverned adoption burns money as well as trust: 95% of GenAI pilots produced no measurable P&L impact (MIT, 2025), and Gartner expects over 40% of agentic projects canceled by end-2027.",
      ],
      riskLine:
        "Without named accountability and a live inventory, every other governance layer is theater.",
      decisions: [
        "Who is the single accountable executive for AI, and what does the board see quarterly?",
        "What is our AI risk appetite — which uses are encouraged, tolerated, and prohibited?",
        "How fast must the governed path be, so teams choose it over going around it?",
      ],
      anchor: {
        value: "28%",
        label: "of organizations report CEO-level oversight of AI governance — McKinsey State of AI, 2025",
      },
    },
    practitioner: {
      controls: [
        {
          control: "AI inventory / registry",
          what: "System of record for every AI use: systems, models, agents, embedded SaaS AI — each with owner, tier, and approval state.",
          owner: "CAIO / CDAO + platform team",
          mechanisms: "Registry tooling, cloud AI asset discovery, intake forms feeding the register",
          standards: "EU AI Act registration, ISO 42001 A.6, NIST GOVERN",
        },
        {
          control: "Risk-tiered intake",
          what: "Two-lane triage: fast lane for low-risk uses on the approved platform (days), full review for high-impact uses (weeks).",
          owner: "AI governance council",
          mechanisms: "Tiering rubric mirroring EU risk classes; workflow tooling; pre-approved patterns",
          standards: "EU AI Act Art. 6, ISO 42005 impact assessment",
        },
        {
          control: "Accountable operating model",
          what: "Accountable executive, cross-functional council (legal, security, privacy, risk, HR, business), three lines of defense adapted for AI.",
          owner: "CEO / board delegate",
          mechanisms: "Charter, RACI per system, council cadence tied to the intake pipeline",
          standards: "ISO 42001 leadership clauses, NIST GOVERN, SR 11-7 lineage",
        },
        {
          control: "Policy that compiles",
          what: "AI policy written so each rule names the technical control that enforces it — no rule without an enforcement point.",
          owner: "Governance function + platform",
          mechanisms: "Policy-to-control traceability matrix; platform defaults implementing policy",
          standards: "Gartner AI TRiSM, ISO 42001 Annex A",
        },
        {
          control: "Regulatory mapping & evidence",
          what: "Obligations tracked per jurisdiction with dates; evidence generated continuously, not assembled before audits.",
          owner: "Legal / compliance",
          mechanisms: "Compliance tooling, audit-evidence automation, incident-reporting pipeline",
          standards: "EU AI Act, Korea AI Basic Act, state laws, ISO 42001 certification",
        },
      ],
      goodLooksLike: [
        "One registry everyone trusts; nothing ships without an entry, and the fast lane is genuinely fast.",
        "The council kills projects — visible evidence that tiering has teeth.",
        "Board reporting shows inventory coverage, incidents, and time-to-approval, not just adoption counts.",
        "Policy statements each name their enforcing control; the ones that can't are labeled aspirational.",
      ],
      operating: [
        "Run intake as a product with an SLA, not a committee queue.",
        "Reuse one intake to serve every regime: EU classes, Korea high-impact, sector rules.",
        "Fold AI incidents into existing incident management with AI-specific severity and reporting clocks.",
      ],
    },
    technical: {
      enforcementPoints: [
        {
          point: "Cloud resource hierarchy",
          what: "Preventive org policies decide what AI services and models can exist at all, inherited org → folder → project.",
          examples: "Org-policy model allowlists, service restrictions, region constraints",
        },
        {
          point: "Registry-integrated pipelines",
          what: "CI/CD refuses to deploy AI systems that lack a registry entry and current approval state.",
          examples: "Deployment gates keyed to registry IDs; drift between registry and reality alarmed",
        },
        {
          point: "Evidence automation",
          what: "Controls emit their own audit evidence continuously into an assessment framework.",
          examples: "Audit Manager assessments, SCC AI inventory feeding the register, immutable audit logs",
        },
      ],
      mechanisms: [
        "AI asset discovery (AI-SPM) reconciled against the declared inventory to surface shadow systems",
        "Org-policy constraints as codified risk appetite — the allowlist is the policy",
        "Tiering rubric encoded in intake tooling, producing a machine-readable risk class per system",
        "Policy-to-control traceability matrix maintained under version control",
        "Serious-incident pipeline with jurisdictional reporting clocks (15 days EU standard; less for critical cases)",
      ],
      monitoring: [
        "Inventory coverage: governed systems ÷ discovered systems, trending to 1.0",
        "Intake latency per lane; approvals expired or overdue for re-review",
        "Incident counts, severities, and time-to-report against regulatory clocks",
      ],
    },
    riskIds: ["regulatory", "shadow-ai", "runaway-cost"],
    googleCapabilityIds: ["scc-aip", "model-org-policy", "audit-manager", "iso-42001", "audit-logs", "indemnification"],
    talkTrack: [
      "Most AI governance programs fail at step zero: nobody can list their AI systems. Discovery plus a registry is the honest starting point.",
      "Regulation now reaches deployers. Even if you build nothing, EU deployer duties, Korea's act, and US state laws already name you.",
      "The fastest governed path wins. If review takes six weeks, your real AI estate is whatever shadow tools your teams adopted in week one.",
      "Ask any vendor — including Google — where policy is enforced, not where it is written.",
    ],
    discovery: [
      "Who is your single accountable executive for AI today?",
      "Could you produce a complete list of AI systems — including agents and AI embedded in SaaS — this week?",
      "How long does it take a low-risk AI use case to get approved?",
      "Which of your AI uses would the EU AI Act or your sector regulator call high-risk?",
      "What evidence could you hand an auditor tomorrow that your controls actually ran?",
    ],
    standardsHooks: [
      { label: "EU AI Act (deployer duties, Art. 26)", kind: "regulation" },
      { label: "ISO/IEC 42001 AI management system", kind: "standard" },
      { label: "NIST AI RMF — GOVERN", kind: "practice" },
      { label: "ISO/IEC 42005 impact assessment", kind: "standard" },
    ],
  },

  {
    id: "data",
    num: "2",
    name: "Data Governance",
    short: "Data",
    question: "What is the AI allowed to know?",
    hue: "data",
    summary:
      "Everything an AI system can read, retrieve, memorize, or learn from: access boundaries, classification and de-identification, residency and retention, lineage from source to model to output, and the provenance of training and grounding data. GenAI turned every document store into potential model input — so data governance became the substrate of AI governance.",
    insight:
      "An AI system inherits every data-governance debt you already have — then exposes it through a chat box.",
    executive: {
      stakes: [
        "Retrieval-augmented AI surfaces whatever permissions allow — including the over-shared folders nobody audited for a decade. The model is rarely the leak; the permissions are.",
        "Training-data provenance is now a balance-sheet issue: the Bartz v. Anthropic settlement priced pirated training books at $1.5B.",
        "Residency and retention promises made to regulators must survive contact with caching, logging, and vendor abuse-monitoring — details most AI contracts never mention.",
      ],
      riskLine:
        "AI turns latent data-governance debt into live exposure at conversational speed.",
      decisions: [
        "Which data classes may reach which AI systems — and which may never (crown jewels, regulated categories)?",
        "What are our residency and retention red lines, contractually and technically?",
        "Do we require no-training terms and IP indemnity from every AI vendor?",
      ],
      anchor: {
        value: "$1.5B",
        label: "Bartz v. Anthropic settlement over pirated training data — provenance is now a board issue",
      },
    },
    practitioner: {
      controls: [
        {
          control: "Classification before connection",
          what: "Data classified and labeled before AI systems index it; crown-jewel classes excluded from retrieval by policy.",
          owner: "CDO + data owners",
          mechanisms: "Auto-classification, sensitivity labels, DLP infotypes, IRM exclusions",
          standards: "EU AI Act Art. 10, GDPR, ISO 42001 data controls",
        },
        {
          control: "ACL-aware retrieval",
          what: "AI answers honor source-document permissions per user; no index becomes a side door around access control.",
          owner: "Platform team",
          mechanisms: "Permission-trimmed indexes, per-user retrieval contexts, access reviews on corpora",
          standards: "Least privilege, SOC 2 access controls",
        },
        {
          control: "De-identification pipeline",
          what: "Sensitive fields tokenized or redacted before model calls; re-identification only inside the trusted perimeter.",
          owner: "Security + data engineering",
          mechanisms: "DLP inspect/de-identify templates, tokenization services, redacted logging",
          standards: "HIPAA de-identification, GDPR minimization",
        },
        {
          control: "Residency & retention posture",
          what: "Where inference runs, what is cached, what is retained and for how long — decided, configured, and contractual.",
          owner: "Legal + platform",
          mechanisms: "Regional endpoints, zero-data-retention configuration, vendor DPAs",
          standards: "GDPR, sector residency rules, sovereign requirements",
        },
        {
          control: "Provenance & lineage",
          what: "Every training and grounding corpus has documented origin, rights, and lineage to the models it fed.",
          owner: "CDO + ML platform",
          mechanisms: "Data catalogs, automatic pipeline lineage, dataset cards",
          standards: "EU AI Act GPAI transparency, copyright compliance",
        },
      ],
      goodLooksLike: [
        "Connecting a data source to AI triggers classification review by default — it is impossible to index unclassified data.",
        "A permissions cleanup precedes every retrieval deployment; over-sharing found is fixed, not indexed.",
        "PII never appears in prompts, logs, or vendor telemetry — verified by sampling, not assumed.",
        "For any AI output, lineage can answer: which sources, which model version, which tuning data.",
      ],
      operating: [
        "Treat 'connect corpus X to AI' as a change with its own review — the AI didn't leak; the corpus was over-shared.",
        "Keep a per-model residency matrix; newest models often launch without regional processing.",
        "Write retention decisions down per system: cache windows, log content, vendor-side storage.",
      ],
    },
    technical: {
      enforcementPoints: [
        {
          point: "Data perimeter",
          what: "Service perimeters and private connectivity around AI APIs prevent exfiltration paths.",
          examples: "VPC Service Controls around platform APIs, private endpoints, egress rules",
        },
        {
          point: "Inline de-identification",
          what: "DLP templates applied to prompts and responses in the request path, with redacted logging.",
          examples: "Sensitive Data Protection templates driven by Model Armor; tokenization services",
        },
        {
          point: "Index build time",
          what: "Classification and permission trimming enforced when corpora are embedded and indexed.",
          examples: "ACL-aware connectors, label-based exclusions (IRM-protected files never retrieved)",
        },
        {
          point: "Key and region control",
          what: "Customer keys and regional endpoints bind data handling to policy.",
          examples: "CMEK on artifacts and agent state, regional inference endpoints, ZDR configuration",
        },
      ],
      mechanisms: [
        "150+ infotype detection with inspect/de-identify templates across prompts, responses, and logs",
        "Permission-aware retrieval contexts resolved per user at query time",
        "Automatic lineage capture from pipelines into a unified catalog spanning data and AI assets",
        "Contractual no-training commitments verified against product data-governance docs",
        "Access Transparency logs for provider-personnel access, with approval gates where supported",
      ],
      monitoring: [
        "DLP hit rates on prompts/responses by system; PII-in-logs sampling audits",
        "Residency conformance per model and endpoint against the declared matrix",
        "Stale-permission and over-shared-corpus findings from periodic access reviews",
      ],
    },
    riskIds: ["data-leakage", "ip-copyright", "unauthorized-access"],
    googleCapabilityIds: ["sdp", "vpc-sc", "cmek", "residency-zdr", "no-training", "knowledge-catalog", "access-transparency", "gdc-airgapped"],
    talkTrack: [
      "The Copilot-era lesson: enterprise search exposes permission debt. Fix sharing before you index, or the AI will audit your ACLs for you — in production.",
      "Wells Fargo ran a quarter-billion assistant interactions with zero PII reaching the LLM — tokenize first is an architecture, and it's copyable.",
      "Ask where inference runs, not just where data is stored. At-rest residency with US inference is a common surprise.",
      "Zero data retention is a configuration, not a default — caching and abuse-monitoring settings decide your real posture.",
    ],
    discovery: [
      "What data could your AI assistants reach today that you would not show a new hire on day one?",
      "When did you last review sharing permissions on the corpora your AI retrieves from?",
      "Can PII reach your model provider — in prompts, logs, or caches — and would you know?",
      "For your most important model: what data trained or tuned it, and could you prove rights to it?",
      "What did you contractually agree about training, retention, and residency with each AI vendor?",
    ],
    standardsHooks: [
      { label: "EU AI Act Art. 10 (data governance)", kind: "regulation" },
      { label: "GDPR / sector privacy rules", kind: "regulation" },
      { label: "ISO/IEC 42001 data controls", kind: "standard" },
      { label: "Google AI/ML Privacy Commitment", kind: "vendor" },
    ],
  },

  {
    id: "model",
    num: "3",
    name: "Model Governance",
    short: "Models",
    question: "Which models do we trust — and how do we know?",
    hue: "model",
    summary:
      "Choosing, validating, and tracking the models themselves: a curated catalog with an approval path, provenance checks on third-party and open weights, evaluation as a repeatable gate rather than a launch ritual, version pinning against silent provider churn, and bias and safety testing proportionate to what the model decides. Classic model risk management supplies the skeleton; GenAI forces it to evaluate behavior distributions, not fixed test vectors.",
    insight:
      "You no longer validate an artifact you built — you continuously evaluate behavior you rent.",
    executive: {
      stakes: [
        "Frontier models are third-party: weights, training data, and alignment process are not inspectable. Trust must come from evaluation, contract, and provenance — not inspection.",
        "Providers update hosted models continuously; behavior shifts with no change ticket on your side. Version pinning and regression evals are the only counterweight.",
        "Where models touch decisions about people, bias liability is live now: courts allowed a nationwide collective action over AI hiring screens and held that vendors can be liable as employers' agents.",
      ],
      riskLine:
        "An unevaluated model in production is an unread contract you signed on behalf of the business.",
      decisions: [
        "Do we run one vetted model catalog with an approval path — or do teams pick models ad hoc?",
        "What evaluation bar must any model clear before production, and who owns the bar?",
        "What is our position on open-weight models, and who governs them once downloaded?",
      ],
      anchor: {
        value: "1,598",
        label: "court decisions involving AI-fabricated citations tracked by mid-2026 — unevaluated output has legal consequences",
      },
    },
    practitioner: {
      controls: [
        {
          control: "Approved model catalog",
          what: "One curated catalog of sanctioned models — first-party, partner, open — with allowlisting enforced platform-side.",
          owner: "AI platform team",
          mechanisms: "Model garden + org-policy allowlists; catalog entries carry risk notes and approved uses",
          standards: "Supply-chain controls, ISO 42001 A.10",
        },
        {
          control: "Model due diligence",
          what: "Third-party and open models assessed for provenance, license, safety posture, and data-handling before listing.",
          owner: "Second line (AI risk)",
          mechanisms: "Model cards, system cards, license review, signature/format verification",
          standards: "EU AI Act GPAI transparency, OWASP LLM03",
        },
        {
          control: "Evaluation gates",
          what: "Golden datasets per use case; accuracy, groundedness, safety, and refusal metrics gate promotion — and rerun on every change.",
          owner: "Product teams + eval function",
          mechanisms: "Eval harness in CI, LLM-as-judge with calibrated judges, human review for high tiers",
          standards: "NIST MEASURE, EU AI Act Art. 15 lineage",
        },
        {
          control: "Version & lifecycle management",
          what: "Version pinning for reproducibility, migration runbooks against published retirements, regression evals on provider updates.",
          owner: "Platform team",
          mechanisms: "Pinned model versions, alias policies, retirement calendars, change-detection evals",
          standards: "Change management, SR 11-7 revalidation adapted",
        },
        {
          control: "Bias & safety testing",
          what: "Adverse-impact testing for people-affecting models; red-teaming proportionate to tier; documented results.",
          owner: "Second line + red team",
          mechanisms: "Bias eval suites, adversarial testing, safety benchmarks, retained evidence",
          standards: "EEOC exposure, EU high-risk requirements, NIST GAI profile",
        },
      ],
      goodLooksLike: [
        "Requesting an unlisted model triggers due diligence with an SLA, not a workaround.",
        "Every production use case has a versioned golden dataset and a current eval baseline tied to a model version.",
        "A provider model update automatically reruns the regression suite before traffic shifts.",
        "Open-weight deployments carry the same catalog entry, owner, and eval evidence as hosted models.",
      ],
      operating: [
        "Treat evals like regression tests: they run on every model, prompt, and retrieval change — not annually.",
        "Calibrate LLM judges against human-labeled samples and pin judge versions; never let a judge be the sole gate for high-tier uses.",
        "Publish the catalog with approved-use notes so teams self-serve the right model.",
      ],
    },
    technical: {
      enforcementPoints: [
        {
          point: "Platform allowlist",
          what: "Org policies restrict which models projects can call; the allowlist is the approved catalog.",
          examples: "vertexai.allowedGenAIModels org-policy constraints at org/folder/project",
        },
        {
          point: "CI/CD eval gates",
          what: "Pipelines block promotion when eval metrics regress against the pinned baseline.",
          examples: "Eval service runs in CI; baselines pinned to model version + prompt hash",
        },
        {
          point: "Registry & lineage",
          what: "Customer models tracked with versions, aliases, and lineage to training data and deployments.",
          examples: "Model registry entries linked to catalog lineage and eval artifacts",
        },
        {
          point: "Weights supply chain",
          what: "Open weights verified and scanned before an internal registry serves them.",
          examples: "Signature checks, safetensors-only policies, malware scanning, internal model proxy",
        },
      ],
      mechanisms: [
        "Pointwise and pairwise LLM-as-judge evaluation with configurable, evaluable judges",
        "Version pinning with published retirement dates and forced-migration runbooks",
        "Statistical behavioral testing over distributions — repeated runs, not single pass/fail vectors",
        "Safety benchmark suites plus jailbreak/adversarial probes per catalog entry",
        "License and provenance metadata carried on every catalog entry, open weights included",
      ],
      monitoring: [
        "Eval-score trends per use case across model versions; alert on regression",
        "Catalog coverage: production calls hitting non-catalog models should be zero",
        "Provider-update calendar vs. migration status; time-to-revalidate after updates",
      ],
    },
    riskIds: ["model-supply-chain", "bias-discrimination", "hallucination", "ip-copyright"],
    googleCapabilityIds: ["model-garden", "model-org-policy", "model-registry", "model-versioning", "genai-eval", "indemnification"],
    talkTrack: [
      "Morgan Stanley's famous move wasn't the chatbot — it was writing the evals before the rollout. Evaluation discipline is the control regulators will ask to see.",
      "One vetted catalog beats per-team model choice: Goldman and Walmart both built exactly this before scaling.",
      "Silent model churn is real: providers update behavior under your feet. Pin versions and make updates rerun your regression suite.",
      "Open models move governance onto you: once weights are downloaded, platform guardrails and logging no longer apply.",
    ],
    discovery: [
      "How many distinct models are in production, and who approved each one?",
      "What evaluation evidence exists for your most business-critical AI use case?",
      "What happens on your side when a provider updates a hosted model?",
      "Do any models influence decisions about people — and when were they last bias-tested?",
      "Who governs open-weight models your teams have downloaded?",
    ],
    standardsHooks: [
      { label: "EU AI Act GPAI transparency (Art. 53)", kind: "regulation" },
      { label: "NIST GenAI Profile (AI 600-1)", kind: "practice" },
      { label: "SR 11-7 model risk lineage", kind: "practice" },
      { label: "ISO/IEC 42001 lifecycle controls", kind: "standard" },
    ],
  },

  {
    id: "application",
    num: "4",
    name: "Application Governance",
    short: "Applications",
    question: "Does the system behave — and can we prove it?",
    hue: "application",
    summary:
      "The governance of AI systems, not just models: grounding and citation discipline, prompts and configurations under change control, output validation and egress handling, application identity and entitlements, release gates with safety regression, and scope fences that decide what the system may not do. The unit of validation moved from the model to the pipeline — retrieval, prompt, model, tools, and UI together.",
    insight:
      "The model is 20% of the system; govern the pipeline that wraps it — that's where incidents actually start.",
    executive: {
      stakes: [
        "Courts hold companies liable for what their AI applications say: Air Canada lost on a policy its chatbot invented; NYC's business bot dispensed illegal advice under official branding for months.",
        "A one-line prompt change is a production change to behavior — the Grok incident shipped extremist output for hours because a prompt edit skipped safety regression.",
        "Scope is the cheapest safety control: Wendy's fenced its drive-thru AI to the menu with confidence-based human handoff and hit 86% autonomous completion at ~99% accuracy with assists.",
      ],
      riskLine:
        "Your customers, courts, and regulators judge the application's words — not the model card behind them.",
      decisions: [
        "Which decisions may AI applications make alone, and which require a human at the point of consequence?",
        "Do prompts and AI configs go through the same change control as code? (They are code.)",
        "What may our customer-facing AI never discuss — price, contract, advice — and where is that enforced?",
      ],
      anchor: {
        value: "86%",
        label: "of Wendy's drive-thru orders completed with no human intervention — scope fences plus handoff design, not model magic",
      },
    },
    practitioner: {
      controls: [
        {
          control: "Grounding & citation discipline",
          what: "High-stakes answers constrained to approved corpora with visible citations; ungrounded claims detected and blocked or flagged.",
          owner: "Product team",
          mechanisms: "RAG over curated sources, grounded-generation APIs, groundedness checks",
          standards: "Hallucination controls, EU transparency duties",
        },
        {
          control: "Prompt & config change control",
          what: "System prompts, retrieval settings, and safety configs versioned, reviewed, and gated by safety regression evals.",
          owner: "Engineering",
          mechanisms: "Prompts in version control; eval gates in CI; canary + rollback",
          standards: "Change management, NIST MANAGE",
        },
        {
          control: "Output validation & egress",
          what: "Responses screened for safety, sensitive data, and injection artifacts before display; links and markdown neutralized.",
          owner: "Engineering + security",
          mechanisms: "Response screening, DLP on outputs, URL/link handling policies",
          standards: "OWASP LLM05 improper output handling",
        },
        {
          control: "Scope fences & handoff",
          what: "Explicit no-go domains, authority limits, and confidence-based escalation to humans built into the product.",
          owner: "Product + business owner",
          mechanisms: "Topicality controls, business-rule guards, confidence thresholds, human queues",
          standards: "Human-oversight requirements (EU Art. 26 shape)",
        },
        {
          control: "App identity & entitlements",
          what: "The application (and each feature) has its own identity and least-privilege access to models, indexes, and tools.",
          owner: "Platform + security",
          mechanisms: "Per-app service identities, scoped API entitlements, per-use-case keys",
          standards: "Least privilege, SOC 2",
        },
      ],
      goodLooksLike: [
        "Every user-visible claim in high-stakes flows carries a citation a reviewer can click.",
        "A prompt edit triggers the same pipeline as a code change: review, eval gate, canary, rollback.",
        "The application can say 'I can't help with that' — and does, verifiably, in red-team transcripts.",
        "Release notes for AI behavior changes exist and match the eval evidence.",
      ],
      operating: [
        "Design review asks 'what must this system never do?' before 'what should it do?'",
        "Keep an incident-response path with a fix-or-kill SLA for AI behavior failures.",
        "Sample production conversations for quality review under privacy controls — deflection metrics alone hide failures (Klarna's lesson).",
      ],
    },
    technical: {
      enforcementPoints: [
        {
          point: "Request path (pre-model)",
          what: "Prompt screening, context assembly rules, and injection defense before the model call.",
          examples: "Model Armor prompt screening, input schemas, retrieval trimming",
        },
        {
          point: "Response path (post-model)",
          what: "Safety, sensitive-data, and groundedness screening before anything reaches the user.",
          examples: "Response filters, DLP on outputs, citation/groundedness validators",
        },
        {
          point: "Release pipeline",
          what: "Eval gates on every prompt/model/retrieval change; canary rollout; rollback.",
          examples: "Eval service in CI, baseline diffs, staged rollouts",
        },
        {
          point: "API gateway",
          what: "Per-consumer authentication, quotas, and policy for every model call the app makes.",
          examples: "Apigee policies (token quotas, Model Armor), per-app keys and budgets",
        },
      ],
      mechanisms: [
        "Grounded generation with citation metadata and answerability thresholds",
        "Safety-filter configuration per harm category, tuned per use case and audience",
        "Structured output contracts (schemas) so downstream systems never parse free text blindly",
        "Red-team suites for injection, jailbreak, and data-extraction run pre-launch and continuously",
        "Content provenance marking where synthetic media is generated (EU Art. 50 shape)",
      ],
      monitoring: [
        "Groundedness/citation-precision rates on sampled production traffic",
        "Safety-filter and screening hit rates; escalation-to-human rates and outcomes",
        "Behavior-change audit: every eval-gate result tied to the release that shipped it",
      ],
    },
    riskIds: ["hallucination", "harmful-content", "prompt-injection", "data-leakage"],
    googleCapabilityIds: ["grounding", "agent-search", "genai-eval", "safety-filters", "model-armor", "apigee", "iam-wif"],
    talkTrack: [
      "Deutsche Bank publishes its eval regime — citation precision and recall, false-rejection rates, git-pinned baselines. That's what audit-ready gen AI concretely looks like.",
      "Treat prompts as production code. Half of the public AI incidents trace to an untested prompt or config change.",
      "The strongest deployments constrain scope first: menu-only, policy-corpus-only, intent-extraction-only. Capability follows trust.",
      "Ask where output validation happens. If the answer is 'the model is aligned', there is no application governance.",
    ],
    discovery: [
      "For your most visible AI application: what may it never say or do, and where is that enforced?",
      "What happens between a prompt edit and production today?",
      "Can users and reviewers see sources for AI answers in high-stakes flows?",
      "How do you sample and review production AI conversations for quality?",
      "Who owns an AI behavior incident at 2am, and what is the kill/fix path?",
    ],
    standardsHooks: [
      { label: "OWASP Top 10 for LLM Applications (2025)", kind: "practice" },
      { label: "EU AI Act Art. 50 transparency", kind: "regulation" },
      { label: "NIST MEASURE / MANAGE", kind: "practice" },
      { label: "Human-oversight design (Art. 26 shape)", kind: "regulation" },
    ],
  },

  {
    id: "agent",
    num: "5",
    name: "Agent Governance",
    short: "Agents",
    question: "What may AI do on its own — and who can stop it?",
    hue: "agent",
    summary:
      "Agents keep every GenAI risk and add action: they hold identities and delegated authority, compose tool calls nobody enumerated, accumulate memory, spend money, and fail in cascades. Governing them means per-agent identity and least-privilege tool scopes, human approval at consequential moments, budgets and transaction mandates, memory rules, a fleet registry with a kill switch, sandboxed execution, and an audit trail that is not the agent's own self-report.",
    insight:
      "Predictive ML governance validated an artifact; GenAI governance evaluates behavior; agent governance authorizes an actor — continuously, with an identity, a budget, and an audit trail.",
    executive: {
      stakes: [
        "A hallucination becomes a transaction: in July 2025 a coding agent deleted a production database during a code freeze, then misreported what it had done.",
        "Enterprises are moving anyway: 62% are experimenting with agents but only 23% are scaling — with security and risk the #1 barrier (McKinsey, 2026). Governance is the unlock, not the brake.",
        "The research is blunt: frontier models under goal conflict chose harmful strategies in 79–96% of simulated scenarios (Anthropic, 2025). Human approval gates are evidence-based, not theater.",
      ],
      riskLine:
        "An agent without its own identity, budget, and kill switch is an unaccountable employee with root access.",
      decisions: [
        "Which action classes may agents take autonomously, and which always require human approval?",
        "Does every agent have a named human owner — and does 'shut it down' have a real mechanism?",
        "What spend, data, and system blast radius are we prepared to delegate per agent tier?",
      ],
      anchor: {
        value: "79–96%",
        label: "of simulated shutdown-conflict scenarios ended with frontier models choosing harmful strategies — Anthropic agentic-misalignment research, 2025",
      },
    },
    practitioner: {
      controls: [
        {
          control: "Agent identity",
          what: "Every agent gets its own identity — never a shared service account or a human's borrowed credentials — with delegation recorded.",
          owner: "Security / IAM team",
          mechanisms: "SPIFFE-style agent IDs mapped to IAM, OAuth token exchange for on-behalf-of",
          standards: "SAIF 2.0 agent principles, emerging IETF drafts",
        },
        {
          control: "Least-privilege tool scopes",
          what: "Permissions scoped per tool binding, deny-by-default; effective permission of a chain is the intersection of the chain.",
          owner: "Platform + security",
          mechanisms: "Per-tool allowlists, short-lived brokered credentials, gateway-enforced scopes",
          standards: "OWASP Agentic Top 10 (tool misuse)",
        },
        {
          control: "Human approval gates",
          what: "Action tiering: reversible actions run free; payments, deletions, external comms, and prod changes pause for approval.",
          owner: "Business owner per agent",
          mechanisms: "Approval workflows in the agent loop, blast-radius classification of tools",
          standards: "EU human-oversight shape, SAIF 'human controllers'",
        },
        {
          control: "Budgets & mandates",
          what: "Per-agent spend and usage limits; agent-initiated payments carry signed intent/cart/payment mandates.",
          owner: "Finance + platform",
          mechanisms: "Token and spend budgets with hard cutoffs, AP2-style signed mandates",
          standards: "AP2, FinOps for AI",
        },
        {
          control: "Registry & kill switch",
          what: "Fleet-wide inventory of every agent — built, bought, embedded — with owner, tier, scopes, and one-click disable.",
          owner: "AI platform team",
          mechanisms: "Agent registry, credential revocation, gateway cut-off, sandbox teardown",
          standards: "Inventory-first principle; Gartner agent-sprawl warnings",
        },
        {
          control: "Memory governance",
          what: "Agent memory scoped, time-bounded, provenance-tagged, inspectable, and erasable — because memory is a poisoning target.",
          owner: "Platform + privacy",
          mechanisms: "Memory TTLs, provenance tags, admin inspection, erasure APIs",
          standards: "OWASP memory poisoning, GDPR erasure",
        },
      ],
      goodLooksLike: [
        "You can list every agent, its owner, its tools, and its last action — today, from one place.",
        "No agent holds production write credentials by default; irreversible actions show a human approval in the trace.",
        "Disabling an agent is one action with an audit entry, and it has been rehearsed.",
        "Agent traces show the full delegation chain: which human, which agent, which tool, which policy fired.",
      ],
      operating: [
        "Tier agents by autonomy × blast radius; governance intensity follows the tier.",
        "Route agent↔tool traffic through a gateway — ad-hoc MCP servers are the new shadow IT.",
        "Rehearse the kill switch quarterly the way you rehearse restores.",
      ],
    },
    technical: {
      enforcementPoints: [
        {
          point: "Identity plane",
          what: "Cryptographic per-agent identity bound to IAM; delegated authority via token exchange, not shared secrets.",
          examples: "Agent Identity (SPIFFE-based) mapped to IAM; short-lived credentials",
        },
        {
          point: "Agent gateway",
          what: "Chokepoint for tool and MCP calls: scope enforcement, payload screening, policy decisions per call.",
          examples: "Agent Gateway with Model Armor inline; MCP allowlists; per-tool scopes",
        },
        {
          point: "Execution sandbox",
          what: "Kernel-isolated environments for agent-generated code and computer use.",
          examples: "gVisor Agent Sandbox on the platform or GKE; snapshot/teardown",
        },
        {
          point: "Registry & runtime",
          what: "Managed runtime with sessions and memory under CMEK; registry enable/disable as the kill switch.",
          examples: "Agent Runtime sessions + Memory Bank; Agent Registry fleet control",
        },
      ],
      mechanisms: [
        "OpenTelemetry GenAI traces spanning user → agent plan → tool call → downstream API",
        "Signed mandates for agent transactions (intent, cart, payment) creating non-repudiable authorization",
        "A2A v1.0 with signed Agent Cards for cross-vendor agent discovery and communication",
        "Memory provenance tags + TTLs; inspection and erasure APIs for accumulated state",
        "Anomaly detection over agent behavior (new tools, unusual sequences, volume spikes)",
      ],
      monitoring: [
        "Per-agent action logs with delegation chain and approval events — independent of agent self-report",
        "Registry coverage vs. discovered agents; orphaned agents (no owner) trending to zero",
        "Budget consumption and anomaly alerts per agent; blocked-action rates at the gateway",
      ],
    },
    riskIds: ["agent-autonomy", "prompt-injection", "unauthorized-access", "runaway-cost"],
    googleCapabilityIds: ["agent-identity", "agent-registry", "agent-gateway", "agent-runtime", "agent-sandbox", "adk", "a2a", "ap2", "agent-evals", "gemini-enterprise"],
    talkTrack: [
      "Agents are actors, not features. The control set is employee-shaped: identity, least privilege, approvals, budgets, audit — plus a kill switch.",
      "The Replit incident is the whole conversation in one story: prod credentials, no environment separation, no approval gate, self-reported logs.",
      "Google's agent stack maps SAIF's three principles to products: human controllers (registry + IAM), limited powers (identity + gateway), observable actions (traces + logs).",
      "Interop is going open — A2A and MCP sit under the Linux Foundation — so agent governance won't have to be single-vendor.",
    ],
    discovery: [
      "How many agents — built, bought, or embedded in SaaS — operate in your enterprise today? Who owns each?",
      "What can your most powerful agent do without a human approving?",
      "If an agent misbehaved right now, who would notice, and how would you stop it?",
      "Do agents hold their own credentials, or are they borrowing humans' and service accounts'?",
      "What limits exist on what an agent can spend — money, tokens, records touched?",
    ],
    standardsHooks: [
      { label: "OWASP Top 10 for Agentic Applications (2025)", kind: "practice" },
      { label: "Google SAIF 2.0 agent principles", kind: "vendor" },
      { label: "A2A / MCP under Linux Foundation", kind: "standard" },
      { label: "MITRE ATLAS agent techniques", kind: "practice" },
    ],
  },

  {
    id: "security",
    num: "6",
    name: "Runtime Security & Observability",
    short: "Runtime",
    question: "What is happening right now — and would we notice?",
    hue: "security",
    summary:
      "The live control plane across every other layer: screening prompts and responses in the request path, detecting injection and leakage as they happen, watching posture across the AI estate, tracing every call end to end, keeping audit-grade logs, and holding the line on cost. This is where Gartner's TRiSM and Google's SAIF converge on the same message — policy that is not enforced at runtime is advice.",
    insight:
      "Paper policies fail at machine speed. Runtime enforcement is where governance becomes real.",
    executive: {
      stakes: [
        "97% of organizations with AI-related breaches lacked proper AI access controls, and 63% had no AI governance policy at all (IBM, 2025) — the gap between stated policy and runtime reality is where breaches live.",
        "Attackers already operate agentically: the first reported AI-orchestrated espionage campaign (disclosed Nov 2025) ran 80–90% of its operation through a jailbroken agent. Defense must run at the same speed.",
        "Auditability is becoming a legal artifact: EU record-keeping duties and incident-reporting clocks assume you can reconstruct what your AI did and when.",
      ],
      riskLine:
        "If you cannot see it in a trace or a log, you cannot govern it, prove it, or stop it.",
      decisions: [
        "What minimum runtime screening applies to every AI call in the enterprise — the floor no team may drop below?",
        "What must be reconstructable after an incident: prompts, sources, tools, approvals — and for how long?",
        "Is AI security posture on the CISO dashboard with the same weight as cloud posture?",
      ],
      anchor: {
        value: "97%",
        label: "of organizations with AI-related breaches lacked AI access controls — IBM Cost of a Data Breach, 2025",
      },
    },
    practitioner: {
      controls: [
        {
          control: "Runtime screening floor",
          what: "Org-wide minimum screening for injection, jailbreak, sensitive data, and unsafe content on prompts and responses — teams can raise it, never lower it.",
          owner: "CISO",
          mechanisms: "Screening service with floor settings at org level; gateway and LB integration",
          standards: "Gartner TRiSM runtime layer, OWASP LLM01/02",
        },
        {
          control: "AI security posture management",
          what: "Continuous discovery of AI assets, misconfigurations, over-privileged access, and attack paths across the estate.",
          owner: "Security operations",
          mechanisms: "AI-SPM: inventory, virtual red teaming, posture findings, threat detectors",
          standards: "SAIF, MITRE ATLAS coverage",
        },
        {
          control: "End-to-end tracing",
          what: "Every AI interaction traceable: user, context, model, tools, policies fired, output — in a vendor-neutral format.",
          owner: "Platform + SRE",
          mechanisms: "OTel GenAI semantic conventions, trace viewers, correlated logging",
          standards: "EU logging duties, audit requirements",
        },
        {
          control: "Audit-grade logging",
          what: "Immutable admin logs always on; data-access and content logging enabled deliberately, with redaction before storage.",
          owner: "Security + compliance",
          mechanisms: "Cloud audit logs, opt-in request/response logging with DLP redaction",
          standards: "EU Art. 12-shape logging, SOC 2",
        },
        {
          control: "AI incident response",
          what: "AI failures managed like security incidents: detection, severity, kill/fix path, regulatory reporting clocks.",
          owner: "SecOps + governance",
          mechanisms: "AI-specific runbooks, kill switches, reporting templates with deadlines",
          standards: "EU Art. 73 serious-incident reporting",
        },
        {
          control: "Cost enforcement",
          what: "Budgets and quotas enforced in the request path; anomalies alarmed as both cost and safety events.",
          owner: "FinOps + platform",
          mechanisms: "Gateway token quotas, billing budgets with cutoffs, anomaly alerts",
          standards: "FinOps for AI",
        },
      ],
      goodLooksLike: [
        "A single dashboard answers: what AI is running, what was blocked today, what looks anomalous.",
        "For any incident, you can replay the interaction: inputs, retrieved sources, tool calls, policies fired.",
        "Screening runs in the network path, so even apps that skipped the SDK are covered.",
        "Red-team findings feed detections; detections feed red-team scope — a loop, not two silos.",
      ],
      operating: [
        "Put the screening floor under CISO change control — developers configure within it, never below it.",
        "Decide content-logging posture explicitly per system: what is logged, redacted, retained, and who can read it.",
        "Run AI incident tabletop exercises including the regulatory reporting clock.",
      ],
    },
    technical: {
      enforcementPoints: [
        {
          point: "Network path",
          what: "Screening chained at the load balancer and gateway so coverage doesn't depend on app code.",
          examples: "Model Armor via LB Service Extensions and Apigee policies; WAF in front",
        },
        {
          point: "Platform inline",
          what: "Prompt/response screening integrated where models are served, with org-level floors.",
          examples: "Model Armor inline on the platform; floor settings at org/folder/project",
        },
        {
          point: "Security operations plane",
          what: "AI posture, threat detection, and virtual red teaming feeding the SOC.",
          examples: "SCC AI Protection detectors, agent anomaly detection, attack-path simulation",
        },
        {
          point: "Telemetry pipeline",
          what: "Traces, metrics, and logs standardized and correlated across models, apps, and agents.",
          examples: "OTel GenAI spans to trace/logging/monitoring; token metrics for cost",
        },
      ],
      mechanisms: [
        "Injection/jailbreak detection tuned per region and language; sensitive-data screening with de-identification",
        "Virtual red teaming: simulated attack permutations over a digital twin of the environment",
        "Immutable admin-activity logs; opt-in data-access and request/response logs with SDP redaction",
        "Per-consumer token quotas and budgets enforced at the gateway; provisioned throughput for priority paths",
        "Detection content mapped to MITRE ATLAS techniques for AI-specific threats",
      ],
      monitoring: [
        "Blocked-prompt/response rates by filter and system; false-positive review loop",
        "Posture findings burn-down; over-privileged AI identities trending to zero",
        "Trace coverage: fraction of AI interactions fully reconstructable end to end",
      ],
    },
    riskIds: ["prompt-injection", "data-leakage", "unauthorized-access", "runaway-cost", "harmful-content"],
    googleCapabilityIds: ["model-armor", "scc-aip", "audit-logs", "otel-observability", "apigee", "cost-controls", "iam-wif", "vpc-sc"],
    talkTrack: [
      "Gartner's TRiSM message in one line: AI governance needs runtime technical enforcement, not just policies. This layer is that enforcement.",
      "Model Armor's floor settings are the CISO's favorite control: an organization-wide minimum no team can drop below — enforced even in the network path.",
      "EchoLeak was zero-click. The defense that would have caught it lives here: treat retrieved content as untrusted, screen egress, watch anomalies.",
      "Ask what percentage of AI interactions are fully reconstructable today. That number is the audit posture.",
    ],
    discovery: [
      "What screening applies to every model call in your enterprise today — including apps that bypassed the platform team?",
      "Could you reconstruct a specific AI interaction from last Tuesday — prompt, sources, tools, output?",
      "Who watches for anomalous AI behavior, and what happened the last time something looked wrong?",
      "Are your AI assets in your security posture tooling, or only your VMs and buckets?",
      "What would a prompt-injection attempt against your flagship AI app look like in your SOC?",
    ],
    standardsHooks: [
      { label: "Gartner AI TRiSM (runtime enforcement)", kind: "practice" },
      { label: "MITRE ATLAS", kind: "practice" },
      { label: "EU AI Act logging & incident duties", kind: "regulation" },
      { label: "Google SAIF / CoSAI", kind: "vendor" },
    ],
  },

  {
    id: "people",
    num: "7",
    name: "People Governance",
    short: "People",
    question: "What are our people doing with AI today?",
    hue: "people",
    summary:
      "The layer most enterprises discover last, and the one already in production everywhere: employees using AI. Sanctioned tools good enough to win, shadow-AI discovery and coaching, acceptable use that names real behaviors, literacy as a legal duty and a control, and access tiers that match trust to training. Every employee is now a model operator; the workforce is the widest AI attack surface and the biggest adoption lever at once.",
    insight:
      "Your employees adopted AI before your governance did — the only question is whether they did it inside or outside your visibility.",
    executive: {
      stakes: [
        "Shadow AI is the default state: data sent to GenAI apps grew 30x year over year, 72% of enterprise use flows through personal accounts (Netskope), and one in five breaches now involves shadow AI at a ~$670K premium (IBM, 2025).",
        "Bans demonstrably fail — Samsung's leak-then-ban arc just moved usage to personal devices. Sanctioned alternatives plus coaching measurably work.",
        "AI literacy is now a legal duty (EU AI Act Art. 4) and a rollout precondition: Macquarie put 99% of employees through mandatory GenAI training around its bank-wide rollout.",
      ],
      riskLine:
        "Ungoverned employee AI use is your largest AI deployment — you just don't operate it.",
      decisions: [
        "Which sanctioned AI tools do we give everyone, and are they good enough to out-compete shadow use?",
        "What is our acceptable-use line on data classes, verification duties, and client work?",
        "Is AI training mandatory, role-based, and tied to access?",
      ],
      anchor: {
        value: "72%",
        label: "of enterprise GenAI use flows through personal accounts — Netskope Cloud & Threat Report, 2025",
      },
    },
    practitioner: {
      controls: [
        {
          control: "Sanctioned alternative",
          what: "An enterprise assistant with no-training terms, SSO, logging, and real capability — the paved road that beats the shadow path.",
          owner: "CIO / workplace team",
          mechanisms: "Enterprise AI workplace with admin controls, agent allowlists, usage logs",
          standards: "Paved-road pattern (USAF, Moderna, JPMorgan arcs)",
        },
        {
          control: "Shadow-AI discovery",
          what: "Continuous visibility into which AI tools are used, by whom, with what data — network, browser, and expense telemetry.",
          owner: "Security",
          mechanisms: "SASE/CASB app discovery, browser DLP telemetry, cloud AI inventory",
          standards: "IBM/Netskope threat findings",
        },
        {
          control: "Inline coaching & DLP",
          what: "Real-time nudges and blocks when sensitive data heads to unsanctioned AI — coaching first, blocking for the long tail.",
          owner: "Security",
          mechanisms: "Browser paste/upload controls, tenant restrictions, coaching prompts",
          standards: "Netskope-measured coaching effect",
        },
        {
          control: "Acceptable use that names behaviors",
          what: "Policy written against real behaviors: what data classes, what verification duties, what disclosure to clients.",
          owner: "HR + legal + security",
          mechanisms: "AUP tied to login, attestation, role-specific annexes",
          standards: "EU Art. 4 literacy, professional-duty rules",
        },
        {
          control: "Literacy tied to access",
          what: "Role-based training as a precondition for AI access tiers; refreshed as capabilities change.",
          owner: "HR / enablement",
          mechanisms: "Mandatory modules gating tool access, role tracks, completion telemetry",
          standards: "EU AI Act Art. 4, Macquarie 99% pattern",
        },
      ],
      goodLooksLike: [
        "The sanctioned assistant's usage grows while personal-account traffic measurably shrinks — you track both.",
        "A paste of source code into a personal chatbot triggers a coaching prompt, not a silent log entry.",
        "Everyone can say what they may and may not put into AI — because the policy names examples, not abstractions.",
        "Access tiers exist: more capability unlocks with more training and need.",
      ],
      operating: [
        "Treat shadow AI as a demand signal: every popular shadow tool is a requirements document.",
        "Measure the paved road like a product: adoption, satisfaction, and what people still go outside for.",
        "Report human-verification failures (fabricated citations, unchecked outputs) as incidents with learning loops.",
      ],
    },
    technical: {
      enforcementPoints: [
        {
          point: "Browser & endpoint",
          what: "DLP over AI sites: paste, upload, print controls; URL filtering; tenant restrictions.",
          examples: "Chrome Enterprise Premium rules on GenAI destinations; managed profiles",
        },
        {
          point: "Identity & access",
          what: "SSO on sanctioned tools; context-aware access gating AI surfaces by device and risk.",
          examples: "Context-aware access on the assistant; group-based feature enablement",
        },
        {
          point: "Workspace admin plane",
          what: "Per-OU AI feature controls, data-retrieval toggles, and label-based exclusions.",
          examples: "Workspace AI control center; IRM-protected files excluded from AI retrieval",
        },
        {
          point: "Usage telemetry",
          what: "Per-user AI activity logged to the SIEM; anomalies and policy hits reviewed.",
          examples: "Assistant usage audit logs to cloud logging; SASE AI app analytics",
        },
      ],
      mechanisms: [
        "Tenant restrictions distinguishing corporate from personal instances of the same AI tool",
        "Real-time user coaching on risky actions, with measured behavior change",
        "Agent allowlisting in the employee AI workplace — employees get governed agents, not raw model access",
        "Role/OU-based enablement so rollout can be staged by risk and training completion",
        "AI usage analytics joined with DLP events for the shadow-AI dashboard",
      ],
      monitoring: [
        "Sanctioned vs. personal-account AI traffic share, trending in the right direction",
        "Coaching-event outcomes: repeat rates per user and team",
        "Training completion vs. access tier conformance; exceptions expiring on schedule",
      ],
    },
    riskIds: ["shadow-ai", "data-leakage", "hallucination"],
    googleCapabilityIds: ["gemini-enterprise", "workspace-ai-controls", "chrome-enterprise", "scc-aip", "no-training"],
    talkTrack: [
      "The Air Force didn't ban shadow AI — it out-competed it with a governed sandbox, then graduated everyone to an enterprise platform. That arc is repeatable.",
      "Blocking failed everywhere it was tried alone: usage just moved to personal accounts. The winning play is paved road + discovery + coaching.",
      "Macquarie's number to quote is 99% — not model accuracy, training completion. Workforce readiness is a control.",
      "Your AI policy is only as real as the browser: if paste-to-personal-chatbot works silently, the policy is a suggestion.",
    ],
    discovery: [
      "What does your network data say about which AI tools employees actually use?",
      "If an engineer pasted source code into a personal chatbot right now, what would happen?",
      "Is your sanctioned assistant genuinely better than what employees use in the shadows?",
      "Who has completed AI training, and does anything unlock — or lock — based on it?",
      "What do client contracts and professional duties say about your teams' AI use — and who checked?",
    ],
    standardsHooks: [
      { label: "EU AI Act Art. 4 (AI literacy)", kind: "regulation" },
      { label: "Shadow-AI threat research (IBM, Netskope)", kind: "practice" },
      { label: "Paved-road adoption pattern", kind: "practice" },
      { label: "Acceptable-use policy discipline", kind: "practice" },
    ],
  },
];
