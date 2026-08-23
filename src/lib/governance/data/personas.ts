import type { Persona } from "../types";

export const PERSONAS: Persona[] = [
  {
    id: "board-ceo",
    title: "Board / CEO",
    group: "Executive leadership",
    tagline: "Owns the risk appetite and the accountability question.",
    cares: [
      "Enterprise risk and reputation attached to AI decisions",
      "Value capture: AI investment that survives scrutiny",
      "Regulatory exposure across every operating jurisdiction",
    ],
    nightmares: [
      "A public incident with the company's name on it — the Air Canada precedent says the chatbot's words are yours",
      "Discovering the enterprise runs hundreds of AI systems nobody can list",
      "An AI program canceled at scale after burning two years of budget",
    ],
    decisions: [
      "Name a single accountable executive for AI and put governance on the board calendar",
      "Set risk appetite: which AI uses are encouraged, tolerated, prohibited",
      "Fund governance as part of the AI program, not as a tax on it",
    ],
    questions: [
      "Can management produce our complete AI inventory this week?",
      "Which of our AI uses would a regulator call high-risk — and who owns each?",
      "What did our last AI incident teach us, and would we catch the next one sooner?",
    ],
    layerEmphasis: ["enterprise", "people"],
    firstStops: [
      { label: "The 30-second framework", href: "/governance" },
      { label: "Layer 1 — Enterprise Governance", href: "/governance/stack/enterprise" },
      { label: "Readiness diagnostic", href: "/governance/readiness" },
    ],
  },
  {
    id: "cio-cto",
    title: "CIO / CTO",
    group: "Technology leadership",
    tagline: "Owns the platform strategy that makes governance the easy path.",
    cares: [
      "One governed platform instead of a hundred bespoke AI stacks",
      "Speed: intake and controls that accelerate teams, not stall them",
      "Vendor strategy — model choice without governance fragmentation",
    ],
    nightmares: [
      "Every business unit building its own ungoverned AI pipeline",
      "A platform decision that locks governance to a single vendor's models",
      "Silent provider model updates breaking production behavior",
    ],
    decisions: [
      "Build the paved road: one platform, one gateway, controls inherited by default",
      "Set the multi-model strategy and where policy is enforced across it",
      "Fund evaluation infrastructure as a first-class platform capability",
    ],
    questions: [
      "What fraction of our AI workloads run through the governed platform?",
      "If we swapped model vendors tomorrow, which controls would survive?",
      "How long does the governed path take versus the shadow path?",
    ],
    layerEmphasis: ["application", "model", "enterprise"],
    firstStops: [
      { label: "Architecture patterns", href: "/governance/architectures" },
      { label: "Vendor lens", href: "/governance/vendors" },
      { label: "Layer 4 — Applications", href: "/governance/stack/application" },
    ],
  },
  {
    id: "ciso",
    title: "CISO",
    group: "Security",
    tagline: "Owns the runtime floor: what gets screened, logged, and stopped.",
    cares: [
      "A screening minimum no team can drop below",
      "AI assets inside security posture management, not beside it",
      "Prompt injection, data leakage, and now agentic attackers",
    ],
    nightmares: [
      "A zero-click exfiltration through an AI assistant (the EchoLeak shape)",
      "Shadow AI and shadow agents holding live credentials outside any review",
      "An incident with no reconstructable trace of what the AI did",
    ],
    decisions: [
      "Set the org-wide runtime screening floor and own its change control",
      "Extend posture management, detection, and IR runbooks to AI and agents",
      "Decide the logging posture: what is captured, redacted, retained",
    ],
    questions: [
      "What screening covers apps that never talked to the platform team?",
      "Can we replay any AI interaction end to end for forensics?",
      "Which agents could an attacker reach through content they control?",
    ],
    layerEmphasis: ["security", "agent", "data"],
    firstStops: [
      { label: "Layer 6 — Runtime Security", href: "/governance/stack/security" },
      { label: "Risk: prompt injection", href: "/governance/risks" },
      { label: "Layer 5 — Agents", href: "/governance/stack/agent" },
    ],
  },
  {
    id: "cdo",
    title: "Chief Data Officer / CDAO",
    group: "Data leadership",
    tagline: "Owns what AI is allowed to know — and often the whole AI strategy.",
    cares: [
      "Classification, lineage, and permissions that survive contact with retrieval",
      "Training and grounding data with documented rights",
      "Gartner finds ~70% of CDAOs hold AI strategy — this framework is their map",
    ],
    nightmares: [
      "An assistant surfacing the over-shared folder nobody audited",
      "PII discovered in prompts, logs, or a vendor's retention store",
      "A tuning corpus with rights nobody can prove",
    ],
    decisions: [
      "Set the data-class-to-AI-system access matrix and enforce it at index time",
      "Mandate de-identification pipelines for sensitive domains",
      "Make lineage capture automatic from source to model to output",
    ],
    questions: [
      "Which corpora are indexed for AI, and when were their permissions last reviewed?",
      "Can we trace any AI output back to sources, model version, and training data?",
      "Where does our data physically go — inference, caching, logging — per vendor?",
    ],
    layerEmphasis: ["data", "model", "enterprise"],
    firstStops: [
      { label: "Layer 2 — Data Governance", href: "/governance/stack/data" },
      { label: "Risk: data leakage", href: "/governance/risks" },
      { label: "Example: Wells Fargo zero-PII", href: "/governance/examples" },
    ],
  },
  {
    id: "legal",
    title: "Legal / Compliance / Privacy",
    group: "Second line",
    tagline: "Owns the obligations map — and the evidence that controls ran.",
    cares: [
      "Deployer duties: EU AI Act, Korea's act, state laws, sector rules",
      "Contract posture with AI vendors: training, retention, indemnity",
      "Evidence generation that stands up in audits and litigation",
    ],
    nightmares: [
      "Liability for AI statements and decisions (Air Canada; Mobley v. Workday)",
      "A serious-incident reporting clock discovered after the incident",
      "Marketing claims about AI the controls cannot substantiate",
    ],
    decisions: [
      "Build the jurisdiction-by-jurisdiction obligations calendar with owners",
      "Set contractual red lines for AI procurement",
      "Define the impact-assessment trigger and template (ISO 42005 shape)",
    ],
    questions: [
      "Which systems fall into which regulatory categories — and says who?",
      "What evidence exists that human oversight actually happens?",
      "Do our vendor contracts cover training use, retention, residency, indemnity?",
    ],
    layerEmphasis: ["enterprise", "data", "model"],
    firstStops: [
      { label: "Why now — the regulatory clock", href: "/governance/why-now" },
      { label: "Layer 1 — Enterprise Governance", href: "/governance/stack/enterprise" },
      { label: "Sources & claim types", href: "/governance/sources" },
    ],
  },
  {
    id: "business-leader",
    title: "Business / Product Leader",
    group: "First line",
    tagline: "Accountable owner of each AI use case — and its failures.",
    cares: [
      "Shipping AI value with a risk profile the enterprise can carry",
      "Clear rules: what needs review, what is pre-approved",
      "Customer trust in AI-touched journeys",
    ],
    nightmares: [
      "Being the named owner of the use case in the incident report",
      "A six-week review queue killing a two-week opportunity",
      "Quality decay after launch nobody was measuring (the Klarna lesson)",
    ],
    decisions: [
      "Own the use case in the registry: purpose, tier, human-oversight design",
      "Define outcome-quality metrics beyond deflection and cost",
      "Decide where humans sit in the loop — and make review real work, not a rubber stamp",
    ],
    questions: [
      "What may this AI never do, and where is that enforced?",
      "What does good look like in production, and who watches it weekly?",
      "When the AI is wrong, what does the customer experience?",
    ],
    layerEmphasis: ["application", "people", "enterprise"],
    firstStops: [
      { label: "Customer examples", href: "/governance/examples" },
      { label: "Layer 4 — Applications", href: "/governance/stack/application" },
      { label: "Explore by architecture", href: "/governance/architectures" },
    ],
  },
  {
    id: "developer",
    title: "Developer / Architect",
    group: "Builders",
    tagline: "Builds the pipeline where most controls actually live.",
    cares: [
      "Controls as platform defaults, not per-team homework",
      "Prompts, configs, and evals in the same lifecycle as code",
      "Clear guardrail APIs: screening, grounding, identity, quotas",
    ],
    nightmares: [
      "An indirect injection turning retrieved content into commands",
      "A prompt tweak shipping a behavior change no eval caught",
      "Being handed 'comply with the policy' with no enforcement primitives",
    ],
    decisions: [
      "Structure the pipeline: screen input, ground generation, validate output",
      "Wire eval gates into CI for every prompt/model/retrieval change",
      "Scope every credential — app, tool, agent — to least privilege",
    ],
    questions: [
      "What does the platform give me for free: screening, logging, evals, identity?",
      "Where are the approved patterns for RAG, agents, and tool use?",
      "How do I test against injection and jailbreak before launch?",
    ],
    layerEmphasis: ["application", "agent", "model"],
    firstStops: [
      { label: "Layer 4 — Applications (L3)", href: "/governance/stack/application" },
      { label: "Layer 5 — Agents (L3)", href: "/governance/stack/agent" },
      { label: "Google capability map", href: "/governance/google" },
    ],
  },
  {
    id: "platform-team",
    title: "AI Platform Team",
    group: "Enablers",
    tagline: "Runs the paved road: catalog, gateway, evals, observability.",
    cares: [
      "One front door: catalog, gateway, guardrails inherited by default",
      "Making the governed path measurably faster than the shadow path",
      "Fleet operations for models and agents: versions, budgets, kill switches",
    ],
    nightmares: [
      "Teams bypassing the platform with raw API keys",
      "A model retirement forcing a fleet migration nobody planned",
      "Agent sprawl: hundreds of agents, no registry, no owners",
    ],
    decisions: [
      "Operate the model catalog and allowlist as a product",
      "Enforce guardrail attachment platform-side so bypass is impossible, not discouraged",
      "Stand up the agent registry, identity, and gateway before the fleet grows",
    ],
    questions: [
      "What percentage of AI traffic flows through the governed gateway?",
      "Which controls are defaults versus opt-in — and why?",
      "What is our model-migration runbook for the next retirement?",
    ],
    layerEmphasis: ["model", "agent", "security", "application"],
    firstStops: [
      { label: "Layer 3 — Models", href: "/governance/stack/model" },
      { label: "Google capability map", href: "/governance/google" },
      { label: "Reference architectures", href: "/governance/architectures" },
    ],
  },
  {
    id: "employee",
    title: "Employee / Business User",
    group: "Everyone",
    tagline: "The widest AI surface in the enterprise — and its biggest lever.",
    cares: [
      "Which tools are allowed, and what data may go into them",
      "Getting real work done — with AI that is actually good",
      "Not being the person in the incident report",
    ],
    nightmares: [
      "Pasting something into a chatbot that becomes a headline",
      "Trusting an AI answer that turns out fabricated — with their name on the output",
      "Rules so vague that safe behavior is guesswork",
    ],
    decisions: [
      "Use the sanctioned tools; corporate account, not personal",
      "Verify before relying: AI drafts, humans own the result",
      "Ask when unsure — the policy should make asking easy",
    ],
    questions: [
      "What data classes may I put into which tools?",
      "How do I verify AI output before it goes to a client or a court?",
      "Where do I report an AI mistake or a suspicious behavior?",
    ],
    layerEmphasis: ["people"],
    firstStops: [
      { label: "Layer 7 — People", href: "/governance/stack/people" },
      { label: "Risk: shadow AI", href: "/governance/risks" },
      { label: "Cautionary tales", href: "/governance/examples" },
    ],
  },
];
