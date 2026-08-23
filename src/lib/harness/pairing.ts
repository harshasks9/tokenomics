/**
 * Section 08 — Model + Harness pairing (Deliverable 6) and the portability
 * question (PRD §13): six forms of portability plus a posture-pair explorer.
 */

export type ModelPosture = {
  id: string;
  name: string;
  desc: string;
};

export type HarnessPosture = {
  id: string;
  name: string;
  desc: string;
};

export const MODEL_POSTURES: ModelPosture[] = [
  {
    id: "single",
    name: "Single frontier model",
    desc: "Standardize on one provider's best model everywhere",
  },
  {
    id: "routed",
    name: "Routed portfolio",
    desc: "Frontier for hard steps, fast/cheap tier for the rest",
  },
  {
    id: "open",
    name: "Open / multi-vendor",
    desc: "Any model per workload, incl. open weights; swap on evals",
  },
];

export const HARNESS_POSTURES: HarnessPosture[] = [
  {
    id: "native",
    name: "Model-native harness",
    desc: "The model vendor's own harness (Claude Agent SDK, Codex, Antigravity)",
  },
  {
    id: "platform",
    name: "Cloud platform harness",
    desc: "Managed runtime + governance (GEAP/Agent Engine, AgentCore, Foundry)",
  },
  {
    id: "framework",
    name: "Open framework harness",
    desc: "Your loop on LangGraph/ADK/CrewAI, deployed where you choose",
  },
];

export type PairVerdict = {
  model: string; // ModelPosture id
  harness: string; // HarnessPosture id
  title: string;
  body: string;
  flags: { text: string; tone: "good" | "warn" | "info" }[];
};

export const PAIR_VERDICTS: PairVerdict[] = [
  {
    model: "single",
    harness: "native",
    title: "Maximum co-optimization, maximum coupling",
    body:
      "This is how the frontier performs best today: vendors tune models inside their own harnesses (home-harness benchmark advantages are measurable), and you inherit years of harness engineering on day one. The price is symmetrical coupling — swapping the model later means swapping the harness too, and re-running every eval.",
    flags: [
      { text: "Best raw capability per workload", tone: "good" },
      { text: "Model + harness swap together", tone: "warn" },
      { text: "Keep evals and tools portable as your hedge", tone: "info" },
    ],
  },
  {
    model: "single",
    harness: "platform",
    title: "One model, governed fleet",
    body:
      "A clean enterprise default: one model relationship, with identity, policy, observability and state as platform services. You give up some home-harness performance on specialized workloads (notably coding) but gain one control plane across every team.",
    flags: [
      { text: "Single governance plane", tone: "good" },
      { text: "Specialized workloads may underperform dedicated harnesses", tone: "warn" },
      { text: "Model swap = re-eval, not re-architecture", tone: "good" },
    ],
  },
  {
    model: "single",
    harness: "framework",
    title: "Portable loop, concentrated model bet",
    body:
      "Your orchestration is yours and travels; your model risk is concentrated in one vendor. Workable if the model bet is deliberate — but you're hand-building the runtime layers (identity, durability, observability) that platforms sell, for a portability you're not using on the model side.",
    flags: [
      { text: "Loop and evals fully owned", tone: "good" },
      { text: "You staff the runtime yourself", tone: "warn" },
      { text: "Ask why model freedom isn't the goal if you're paying for it", tone: "info" },
    ],
  },
  {
    model: "routed",
    harness: "native",
    title: "Fighting the harness's grain",
    body:
      "Model-native harnesses assume their own models; routing portfolios through them ranges from unsupported to awkward. Either accept the native model inside that harness for its workload, or move the routing ambition to a platform or framework harness built for it.",
    flags: [
      { text: "Routing is not what this harness is for", tone: "warn" },
      { text: "Fine per-workload: native harness where it wins, routed elsewhere", tone: "info" },
    ],
  },
  {
    model: "routed",
    harness: "platform",
    title: "The pragmatic enterprise center",
    body:
      "Route cheap steps to fast tiers and hard steps to frontier models, under one identity/policy/observability plane with cost-per-task instrumentation built in. Most large estates land here for the bulk of workloads — with dedicated harnesses carved out where they demonstrably win (coding).",
    flags: [
      { text: "Cost-per-task engineering is native here", tone: "good" },
      { text: "Watch runtime coupling: sessions, memory, policy configs", tone: "warn" },
      { text: "Carve-outs for specialized harnesses are healthy, not failures", tone: "info" },
    ],
  },
  {
    model: "routed",
    harness: "framework",
    title: "Full control of the economics",
    body:
      "The framework loop makes routing explicit and testable; you own every trade-off between cost, latency and quality. Powerful for teams with strong platform engineering — and the configuration surface (which model, which step, which fallback) becomes a codebase you must eval and maintain.",
    flags: [
      { text: "Routing logic under version control and eval", tone: "good" },
      { text: "Complexity compounds: N models × M steps × failures", tone: "warn" },
    ],
  },
  {
    model: "open",
    harness: "native",
    title: "Contradiction in terms",
    body:
      "Open-model strategy through a model-locked harness doesn't compose — the harness's assumptions (context layout, tool style, verification) are tuned to its own models. Choose the posture you actually mean: if the harness's model family is fine, this is the 'single + native' cell in disguise.",
    flags: [
      { text: "Pick one: model freedom or model-native harness", tone: "warn" },
    ],
  },
  {
    model: "open",
    harness: "platform",
    title: "Freedom on a managed floor",
    body:
      "Model gardens with 200+ options under one governance plane make this real: swap models on eval results while identity, tools and observability stay put. The residual coupling is the runtime itself — know what leaves with you (code, evals, MCP tools) and what doesn't (sessions, memory, policy configs).",
    flags: [
      { text: "Model swaps become an eval exercise", tone: "good" },
      { text: "Runtime exit story still needs writing", tone: "info" },
    ],
  },
  {
    model: "open",
    harness: "framework",
    title: "Maximum sovereignty, maximum burden",
    body:
      "Everything is swappable: models, clouds, runtimes. This is the right posture when agents are your product, regulation demands it, or scale justifies a platform team. For everyone else, it converts vendor risk into headcount — the harness layers still have to exist, and now you build them.",
    flags: [
      { text: "No structural lock-in anywhere", tone: "good" },
      { text: "You are the platform team now", tone: "warn" },
      { text: "Protocols (MCP, A2A, OTel) are what make this viable at all", tone: "info" },
    ],
  },
];

/** Six forms of portability (PRD §13) — where coupling actually occurs. */
export const PORTABILITY_FORMS: { id: string; name: string; question: string; reality: string; coupling: "low" | "medium" | "high" }[] = [
  {
    id: "model",
    name: "Model portability",
    question: "Can I move from Gemini to Claude to an open model?",
    reality:
      "APIs converge, behavior doesn't. The swap is cheap at the SDK level and expensive at the behavior level: prompts, tool-call styles and failure modes shift, so real portability = a golden-task eval suite you can re-run per candidate. Frontier vendors RL-tuning models to their own harnesses is widening this gap, not closing it.",
    coupling: "medium",
  },
  {
    id: "harness",
    name: "Harness portability",
    question: "Can the same application move between agent runtimes?",
    reality:
      "The weakest form today. Loops written on open frameworks travel; sessions, memory banks, policy configurations and identity wiring do not. Treat the runtime as the real lock-in decision — it's stickier than the model.",
    coupling: "high",
  },
  {
    id: "tools",
    name: "Tool portability",
    question: "Can tool integrations be reused across agents and vendors?",
    reality:
      "The best news in the stack: MCP made tool servers reusable across effectively every major harness and platform, and gateways (Apigee, AgentCore Gateway) manufacture MCP tools from existing APIs. Build tools once, behind governance, and they outlive any single agent.",
    coupling: "low",
  },
  {
    id: "context",
    name: "Context portability",
    question: "Can enterprise knowledge and retrieval stay independent?",
    reality:
      "Mostly yes, if you keep retrieval behind your own interface. Corpora, embeddings pipelines and search services are model-independent; what couples is per-model context formatting and caching layout — a thin layer worth isolating.",
    coupling: "low",
  },
  {
    id: "protocol",
    name: "Protocol portability",
    question: "What do MCP and A2A actually buy me?",
    reality:
      "Since the Dec 2025 Linux Foundation consolidation (MCP, A2A, AGENTS.md, Goose under open governance), the protocol layer is credibly neutral. Protocols standardize the seams — tools, agent-to-agent, instructions — not the harness internals. Use them at every boundary you may want to cross later.",
    coupling: "low",
  },
  {
    id: "cloud",
    name: "Cloud portability",
    question: "What actually remains portable versus cloud-specific?",
    reality:
      "Portable: framework code, MCP tool servers, eval suites, OTel traces. Cloud-specific: identity planes, policy engines, managed memory/session stores, billing constructs. The pattern mirrors databases: open interfaces, sticky operations.",
    coupling: "medium",
  },
];
