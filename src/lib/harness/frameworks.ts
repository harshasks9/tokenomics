import type { Approach, Dimension, Exhibit, AssessmentItem, SellerKit } from "./types";

/** Build vs Buy vs Adopt (PRD §9). */
export const APPROACHES: Approach[] = [
  {
    id: "build",
    name: "Build custom",
    subtitle: "Your own orchestration and runtime",
    bestWhen: [
      "The agent IS the product and its behavior is your differentiation",
      "You need control the platforms can't express (custom loops, exotic verification)",
      "You have a platform team ready to own runtime, security and governance for years",
    ],
    tradeoffs: { control: 5, speed: 1, portability: 4, opsBurden: 5, reliability: 3 },
    watchOut:
      "You are signing up to rebuild what AgentCore, Agent Engine and Foundry already sell: sandboxing, durable state, identity, observability. Budget for the harness, not just the agent.",
    examples: ["In-house loops on raw model APIs", "Temporal-backed custom runtimes"],
  },
  {
    id: "framework",
    name: "Open framework",
    subtitle: "LangGraph, ADK, CrewAI, Agent Framework OSS…",
    bestWhen: [
      "You want the loop in code you control, without inventing the primitives",
      "Multi-model or multi-cloud is a hard requirement",
      "Your teams are strong engineers who will own evals and operations",
    ],
    tradeoffs: { control: 4, speed: 3, portability: 4, opsBurden: 4, reliability: 3 },
    watchOut:
      "The framework is ~20% of the harness. State, identity, guardrails and observability still need answers — usually from a cloud runtime, which quietly reintroduces the platform decision.",
    examples: ["LangGraph 1.0 + LangSmith", "ADK 2.0 on Agent Engine", "Agent Framework on Foundry"],
  },
  {
    id: "platform",
    name: "Managed platform",
    subtitle: "An opinionated enterprise agent runtime",
    bestWhen: [
      "Time-to-production and fleet governance outrank bespoke control",
      "You need identity, policy, observability and evals as products, not projects",
      "Dozens of teams will build agents and you want one control plane",
    ],
    tradeoffs: { control: 3, speed: 4, portability: 2, opsBurden: 2, reliability: 4 },
    watchOut:
      "Portability concentrates at the runtime: the loop may be open source, but sessions, memory, identity and policy configs are platform-shaped. Know your exit story before you need one.",
    examples: ["Gemini Enterprise Agent Platform", "Bedrock AgentCore", "Foundry Agent Service", "OpenAI Frontier"],
  },
  {
    id: "specific",
    name: "Application-specific",
    subtitle: "A purpose-built harness for one job",
    bestWhen: [
      "The workload has a mature dedicated harness (coding is the canonical case)",
      "You'd rather adopt years of harness engineering than replicate it",
      "The task's verification loop is built in (tests, compilers, structured checks)",
    ],
    tradeoffs: { control: 2, speed: 5, portability: 2, opsBurden: 1, reliability: 5 },
    watchOut:
      "Excellence is narrow: the coding harness that transforms engineering won't run your claims process. Expect one per workload — then a governance question about the fleet you've accumulated.",
    examples: ["Claude Code / Agent SDK", "Codex", "Antigravity", "Cursor", "Devin"],
  },
];

/** Harness Choice decision dimensions (PRD §8, Deliverable 3). */
export const DIMENSIONS: Dimension[] = [
  {
    id: "capability",
    name: "Capability",
    question: "Can it actually perform this workload end to end?",
    probes: [
      "Run your golden tasks through it, not the vendor's demos",
      "Test the hard 10%: long tasks, ambiguous inputs, failure paths",
    ],
  },
  {
    id: "reliability",
    name: "Reliability",
    question: "Does it complete complex tasks consistently, not just impressively?",
    probes: ["pass@k over repeated runs, not one-shot demos", "What happens on step 40 of 50 when a tool times out?"],
  },
  {
    id: "model-freedom",
    name: "Model freedom",
    question: "Can you change models without rebuilding the application?",
    probes: [
      "Swap the model in a sandbox; count what breaks",
      "Are prompts, evals and tool schemas model-portable?",
    ],
  },
  {
    id: "tools",
    name: "Tool ecosystem",
    question: "How easily does it reach your enterprise systems?",
    probes: ["MCP support and gateway governance", "What does connecting your ERP actually take — days or quarters?"],
  },
  {
    id: "context",
    name: "Context engineering",
    question: "How sophisticated is context assembly, compression and caching?",
    probes: ["Cache-hit rates under real traffic", "Behavior at context-window limits on long tasks"],
  },
  {
    id: "architecture",
    name: "Agent architecture",
    question: "Single agents, subagents, multi-agent, long-running — which does it truly support?",
    probes: ["Demand a running multi-day task with a restart in the middle", "Subagent context isolation, not just parallel calls"],
  },
  {
    id: "security",
    name: "Security",
    question: "How are identity, permissions and tool access enforced?",
    probes: ["Per-agent identity or shared service accounts?", "Where is the policy enforced — prompt, harness, or gateway?"],
  },
  {
    id: "governance",
    name: "Governance",
    question: "Can the enterprise set policy independently of each application?",
    probes: ["One place to change a data-handling rule for every agent?", "Who can deploy an agent, and who approves its tools?"],
  },
  {
    id: "observability",
    name: "Observability",
    question: "Can you reconstruct what an agent did and why it failed?",
    probes: ["Full trajectory traces incl. context-as-assembled", "OTel GenAI conventions or a proprietary format?"],
  },
  {
    id: "evaluation",
    name: "Evaluation",
    question: "Can teams measure model-harness pairs before and after production?",
    probes: ["Eval suites in CI gating agent changes", "Trajectory evals, not just final-answer scoring"],
  },
  {
    id: "dx",
    name: "Developer experience",
    question: "How fast can teams build, test and deploy?",
    probes: ["Local dev loop and test story", "Time from repo clone to running agent"],
  },
  {
    id: "portability",
    name: "Portability",
    question: "How coupled are you to model, provider, cloud, runtime?",
    probes: ["Enumerate the coupling points in writing", "What survives a runtime exit: code, evals, tools, memory?"],
  },
  {
    id: "economics",
    name: "Economics",
    question: "What does a successful task cost, all-in?",
    probes: ["Tokens per successful task across candidate harnesses", "Cache-hit accounting; retries and human escalations included"],
  },
  {
    id: "operations",
    name: "Enterprise operations",
    question: "Versioning, CI/CD, environments, rollback, monitoring?",
    probes: ["Can you roll back an agent like a service?", "Blue/green for prompts, tools and policies"],
  },
];

/** Evidence exhibits (PRD §7, Deliverable 6). Values chosen to render honestly. */
export const EXHIBITS: Exhibit[] = [
  {
    id: "scaffold-effect",
    title: "Tokens per solved task: up to 40× apart",
    claim:
      "Two models run through three open-source harnesses on a Terminal-Bench Pro subset: pass rates moved 0–8 pp, but tokens per solved task varied by up to 40× — harness choice moved cost an order of magnitude more than success.",
    bars: [
      { label: "Most efficient harness", value: 1, unit: "× tokens/solved task" },
      { label: "Middle harness", value: 8, unit: "× tokens/solved task" },
      { label: "Least efficient harness", value: 40, unit: "× tokens/solved task" },
    ],
    source: { label: "The Scaffold Effect in Coding Agents, arXiv:2607.22585", url: "https://arxiv.org/abs/2607.22585", date: "2026-07" },
    caveat: "Bars are illustrative of the reported spread (up to 40×), not per-harness figures from the paper.",
  },
  {
    id: "tb-swap",
    title: "Same model, +7.3 points from a harness swap",
    claim:
      "With the model held constant, swapping only the harness raised Terminal-Bench 2 pass@1 from 69.7% to 77.0%. The same paper cites 11–15 pp of scaffold-only variation on SWE-bench Verified.",
    bars: [
      { label: "Harness A (same model)", value: 69.7, unit: "% pass@1" },
      { label: "Harness B (same model)", value: 77.0, unit: "% pass@1" },
    ],
    source: { label: "Stop Comparing LLM Agents Without Disclosing the Harness, arXiv:2605.23950", url: "https://arxiv.org/abs/2605.23950", date: "2026-05" },
    caveat: "Position paper; the SWE-bench range cites third-party leaderboard monitoring.",
  },
  {
    id: "home-harness",
    title: "Home-harness advantage on Terminal-Bench",
    claim:
      "Leaderboard analyses report the same frontier models scoring several points higher in their native harnesses than in the neutral Terminus 2 reference harness — e.g. a ~7-point gap for one frontier model between its own CLI and the reference harness.",
    bars: [
      { label: "Native harness", value: 83.4, unit: "% (reported)" },
      { label: "Reference harness (same model)", value: 76.4, unit: "% (reported)" },
    ],
    source: { label: "Terminal-Bench 2.1 analyses (secondary)", url: "https://www.vals.ai/benchmarks/terminal-bench-2-1", date: "2026-06" },
    caveat: "Secondary-source figures; gap size varies by model (0.2–7 pts). Verify against the live leaderboard before quoting.",
  },
  {
    id: "mcp-code-exec",
    title: "Tool plumbing: −98.7% context overhead",
    claim:
      "Anthropic's code-execution-with-MCP pattern — the agent writes code against MCP servers instead of loading every tool schema — cut tool-definition overhead from ~150k tokens to ~2k in their published example.",
    bars: [
      { label: "Direct tool definitions", value: 150, unit: "k tokens" },
      { label: "Code execution over MCP", value: 2, unit: "k tokens" },
    ],
    source: { label: "Anthropic: Code execution with MCP", url: "https://www.anthropic.com/engineering/code-execution-with-mcp", date: "2025-11" },
    caveat: "Vendor example with a large tool surface; savings scale with tool count.",
  },
];

/** Readiness assessment (PRD §15 — section 12). */
export const ASSESSMENT: AssessmentItem[] = [
  {
    capabilityId: "context",
    prompt: "How does enterprise knowledge reach your models?",
    levels: [
      "Copy-paste and prompt folklore",
      "Basic RAG on one corpus",
      "Governed retrieval + caching strategy",
      "Dynamic assembly, compaction, cache-hit SLOs",
    ],
  },
  {
    capabilityId: "memory",
    prompt: "What persists across sessions today?",
    levels: [
      "Nothing — every chat starts cold",
      "Per-app conversation history",
      "User/task memory with retention rules",
      "Tiered memory with governance and expiry",
    ],
  },
  {
    capabilityId: "tools",
    prompt: "How do agents reach enterprise systems?",
    levels: [
      "They don't (chat only)",
      "Hand-built integrations per app",
      "Shared tool layer, partial MCP",
      "Governed MCP gateway from cataloged APIs",
    ],
  },
  {
    capabilityId: "orchestration",
    prompt: "How does multi-step work happen?",
    levels: [
      "Single prompts, humans glue steps",
      "Scripted chains, no recovery",
      "Workflow + agentic steps, retries",
      "Routing, subagents, parallel execution",
    ],
  },
  {
    capabilityId: "state",
    prompt: "Can a task survive an interruption?",
    levels: [
      "No — restart from zero",
      "Session resume only",
      "Checkpoints for key workflows",
      "Durable execution, multi-day tasks",
    ],
  },
  {
    capabilityId: "identity",
    prompt: "Whose authority does an agent act with?",
    levels: [
      "Shared API keys / service accounts",
      "Per-app service identities",
      "Per-agent identity, scoped delegation",
      "Agent identity + gateway-enforced policy",
    ],
  },
  {
    capabilityId: "evaluation",
    prompt: "How do you know an agent change is safe?",
    levels: [
      "We watch what users say",
      "Manual spot checks",
      "Golden-task suite per agent",
      "Evals in CI, per model-harness pair",
    ],
  },
  {
    capabilityId: "guardrails",
    prompt: "Where are 'must never' rules enforced?",
    levels: [
      "In the prompt",
      "Model safety settings only",
      "Screening service on inputs/outputs",
      "Layered: screening, sandbox, gateway policy",
    ],
  },
  {
    capabilityId: "observability",
    prompt: "Can you reconstruct what an agent did last Tuesday?",
    levels: [
      "No",
      "Raw API logs somewhere",
      "Traces for some agents",
      "Full trajectories, fleet dashboards, cost per task",
    ],
  },
  {
    capabilityId: "recovery",
    prompt: "What happens when an agent fails mid-task?",
    levels: [
      "The user finds out",
      "Blind retry",
      "Retry with feedback + fallback model",
      "Checkpoint restore, compensation, escalation",
    ],
  },
  {
    capabilityId: "economics",
    prompt: "What does a completed task cost?",
    levels: [
      "We see a monthly token bill",
      "Cost per app",
      "Cost per task, sampled",
      "Cost per successful task, per model-harness pair",
    ],
  },
];

/** Seller kits per section (PRD §19). */
export const SELLER_KITS: SellerKit[] = [
  {
    sectionId: "s01",
    questions: [
      "How many model evaluations has your team run this year — and how many harness evaluations?",
      "If a better model appeared tomorrow, what exactly would you need to rewrite?",
      "Who in your org owns the layer between the model and the application?",
    ],
    talkTrack:
      "Open with the equation, not the products. If they've been debating Gemini vs GPT vs Claude, the reframe is: two teams with identical models are getting different outcomes today — the difference is the harness.",
  },
  {
    sectionId: "s02",
    questions: [
      "Where does your architecture diagram draw the line between model and application?",
      "How many harnesses exist across your company right now — including the ones teams built without calling them that?",
    ],
    talkTrack:
      "Most customers have 5–15 accidental harnesses: every team that wired retrieval + tools + retries around an API call built one. Naming the layer is the first step to governing it.",
  },
  {
    sectionId: "s03",
    questions: [
      "Which of these eleven layers do you have a deliberate answer for today?",
      "Which are re-implemented per team, and which are shared?",
    ],
    talkTrack:
      "Walk the grid left to right and let them self-assess. The usual pattern: strong on context and tools, weak on identity, evaluation and economics — that's where incidents and cost surprises come from.",
  },
  {
    sectionId: "s04",
    questions: [
      "When you compared models, did every candidate run in the same harness?",
      "Would a 7-point success swing or a 40× cost swing change any decision you made last quarter?",
    ],
    talkTrack:
      "This section is the proof. The message isn't 'models don't matter' — it's that un-controlled comparisons mis-attribute harness effects to models, in both directions.",
  },
  {
    sectionId: "s05",
    questions: [
      "Which three workloads are you actually funding next year?",
      "Do your platform standards fit your hardest workload or your average one?",
    ],
    talkTrack:
      "Pull up their top workload and read the weights aloud. The insight to land: workloads disagree about what matters, so one-size-fits-all harness standards either over-constrain or under-protect.",
  },
  {
    sectionId: "s06",
    questions: [
      "Which of these philosophies matches how your organization actually buys?",
      "Where do you want the platform's opinion, and where do you want your own?",
    ],
    talkTrack:
      "Keep it symmetric and factual — the credibility of section 09 depends on the honesty of section 06. The differences are real: unbundled services (AWS) vs named harness product (Microsoft) vs SDK-only (Anthropic) vs thin-middle (OpenAI) vs full-stack-open-seams (Google).",
  },
  {
    sectionId: "s07",
    questions: [
      "What did the last build-vs-buy decision cost you in hindsight?",
      "Who operates your custom harness in year three?",
    ],
    talkTrack:
      "Refuse the false binary. The real question is which layers to build. Most enterprises should build the loop only where it differentiates, and buy identity, observability and policy everywhere.",
  },
  {
    sectionId: "s08",
    questions: [
      "Are your model decisions coupled to your agent architecture — could you actually swap?",
      "Have you ever evaluated a model-harness pair, or only models?",
    ],
    talkTrack:
      "The market is re-fusing model and harness at the frontier (models RL-trained inside their own harnesses) while the middle goes model-agnostic. Their standardization choice should be made knowing that tension.",
  },
  {
    sectionId: "s09",
    questions: [
      "Which of these eleven requirements is unsolved in your current stack?",
      "Where do you need third-party models to be first-class citizens?",
    ],
    talkTrack:
      "Requirement first, product second — never the reverse. The Google story to land: every layer offered, every layer separable; Claude in the model garden and A2A at the Linux Foundation are the proof points of open seams.",
  },
  {
    sectionId: "s10",
    questions: [
      "What is your cost per successful task — not your cost per token?",
      "What's your prompt-cache hit rate under production traffic?",
    ],
    talkTrack:
      "Let them move the sliders. The moment to create: a cheaper-per-token model losing on cost-per-task because the harness retries more and caches worse. That single interaction reframes procurement.",
  },
  {
    sectionId: "s11",
    questions: [
      "Which of these four architectures is closest to your next funded project?",
      "Which boxes on this diagram exist in your environment today?",
    ],
    talkTrack:
      "Use the diagrams to move from concept to statement of work: every highlighted capability is a workstream with an owner and a service behind it.",
  },
  {
    sectionId: "s12",
    questions: [
      "Score yourselves live — where are the twos and threes?",
      "Which gap would hurt first if agent traffic grew 10× next quarter?",
    ],
    talkTrack:
      "End with their profile on screen. The natural close: pick the two weakest layers and scope a working session on each — that's the follow-up meeting.",
  },
];
