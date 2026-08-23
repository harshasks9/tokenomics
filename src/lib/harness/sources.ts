import type { SourceRef } from "./types";

/** Footer source register — the primary sources behind the site's claims. */
export const RESEARCH_DATE = "2026-08-23";

export const KEY_SOURCES: (SourceRef & { note: string })[] = [
  {
    label: "Microsoft Agent Framework — harness concept docs",
    url: "https://learn.microsoft.com/en-us/agent-framework/concepts/harness",
    date: "2026",
    note: "The first major vendor definition of 'agent harness' as a named product concept.",
  },
  {
    label: "OpenAI — Harness engineering",
    url: "https://openai.com/index/harness-engineering/",
    date: "2026-02",
    note: "Names the discipline: engineering environments, constraints and feedback loops around agents.",
  },
  {
    label: "Anthropic — Effective harnesses for long-running agents",
    url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
    date: "2025-11",
    note: "Harness patterns for multi-session work; harness assumptions go stale as models improve.",
  },
  {
    label: "Anthropic — Effective context engineering for AI agents",
    url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    date: "2025-09",
    note: "Context as the model's 'attention budget'.",
  },
  {
    label: "The Scaffold Effect in Coding Agents (arXiv:2607.22585)",
    url: "https://arxiv.org/abs/2607.22585",
    date: "2026-07",
    note: "Up to 40× tokens-per-solved-task spread across harnesses, same models.",
  },
  {
    label: "Stop Comparing LLM Agents Without Disclosing the Harness (arXiv:2605.23950)",
    url: "https://arxiv.org/abs/2605.23950",
    date: "2026-05",
    note: "69.7%→77.0% pass@1 from a harness swap, model fixed; the Binding Constraint Thesis.",
  },
  {
    label: "Harness-Bench (arXiv:2605.27922)",
    url: "https://arxiv.org/abs/2605.27922",
    date: "2026-05",
    note: "5,194 trajectories: report capability per model-harness configuration.",
  },
  {
    label: "MCP 2026-07-28 specification",
    url: "https://blog.modelcontextprotocol.io/posts/2026-07-28/",
    date: "2026-07",
    note: "Largest revision since launch; stateless core, extensions, hardened auth. Linux Foundation governed.",
  },
  {
    label: "Linux Foundation — Agentic AI Foundation formation",
    url: "https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation",
    date: "2025-12",
    note: "MCP, Goose and AGENTS.md under neutral governance; all major labs as members.",
  },
  {
    label: "A2A protocol — one-year milestone",
    url: "https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year",
    date: "2026-04",
    note: "150+ member organizations; shipped in Google, Microsoft and AWS platforms.",
  },
  {
    label: "Google Cloud Next '26 recap",
    url: "https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26",
    date: "2026-04",
    note: "Gemini Enterprise Agent Platform consolidation: Agent Studio, Registry, Identity, Gateway, Observability.",
  },
  {
    label: "AWS — Bedrock AgentCore GA",
    url: "https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available",
    date: "2025-10",
    note: "The harness unbundled into managed services; Cedar policy at the tool gateway (GA 2026-03).",
  },
  {
    label: "Anthropic — Code execution with MCP",
    url: "https://www.anthropic.com/engineering/code-execution-with-mcp",
    date: "2025-11",
    note: "~150k → ~2k tokens of tool overhead in the published example.",
  },
  {
    label: "LangChain / LangGraph 1.0",
    url: "https://www.langchain.com/blog/langchain-langgraph-1dot0",
    date: "2025-10",
    note: "Durable graph runtime + LangSmith; production users incl. Uber, LinkedIn, Klarna.",
  },
];

export const FRESHNESS_NOTE =
  "The agent ecosystem changes monthly. Product names, GA statuses and benchmark figures on this page were verified against the sources above as of the snapshot date; several leaderboard figures rest on secondary analyses and are flagged inline. Re-verify before quoting externally.";
