import type { VendorStack } from "./types";

/**
 * Competitive landscape (PRD §11, Deliverable 5) — architectural philosophies,
 * not a checkbox battlecard. Facts carry sources; interpretation and implication
 * are labeled analyst judgment. Snapshot: 2026-08-23.
 */
export const VENDORS: VendorStack[] = [
  {
    id: "google",
    name: "Google Cloud",
    philosophy: "Full stack, open seams — every layer offered, every layer separable.",
    hue: 217,
    layers: {
      models: "Gemini 3.x family + 200-model garden incl. Claude, Llama, Mistral",
      harness: "ADK (Python/Go/Java/TS, graph runtime in 2.0) · Antigravity harness for coding",
      runtime: "Agent Engine (Sessions, Memory Bank, sandboxed code exec) inside Gemini Enterprise Agent Platform",
      protocols: "MCP (50+ managed servers) · A2A (donated to Linux Foundation) · AP2 payments",
    },
    facts: [
      {
        text: "At Cloud Next '26 (Apr 2026), Vertex AI was consolidated into the Gemini Enterprise Agent Platform: Agent Studio, Registry, Identity, Gateway, Observability, Simulation.",
        source: { label: "Google Cloud Next '26 recap", url: "https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26", date: "2026-04" },
      },
      {
        text: "ADK 2.0 (May 2026) replaced the hierarchical executor with a graph-based workflow runtime; ADK ships in four languages with built-in eval and A2A interop.",
        source: { label: "adk.dev 2.0", url: "https://adk.dev/2.0/", date: "2026-05" },
      },
      {
        text: "IAM Agent Identity gives each agent its own trackable identity (mTLS certs rotating every 24h, tokens cryptographically bound); Agent Gateway enforces policy on agent traffic; Model Armor screens prompts and tool traffic.",
        source: { label: "IAM Agent Identity docs", url: "https://docs.cloud.google.com/iam/docs/agent-identity-overview", date: "2026" },
      },
      {
        text: "Apigee converts existing API specs into governed MCP tools and syncs API hub with the Agent Registry, so agents discover only cataloged, policy-wrapped tools.",
        source: { label: "Apigee MCP support", url: "https://cloud.google.com/blog/products/ai-machine-learning/mcp-support-for-apigee", date: "2026" },
      },
    ],
    interpretation:
      "Google is betting that the enterprise control plane — identity, tool governance, observability, data — is the durable layer, and keeps model, framework and runtime swappable around it. Selling Claude in its own model garden and donating A2A are consistent with that bet.",
    implication:
      "Strong fit if you want managed harness infrastructure without committing the application layer to one vendor's models. The naming churn (Vertex AI → GEAP) is real migration work; pin product names in contracts.",
    ownership: {
      context: "platform",
      memory: "platform",
      tools: "shared",
      orchestration: "shared",
      state: "platform",
      identity: "platform",
      evaluation: "platform",
      guardrails: "platform",
      observability: "platform",
      recovery: "shared",
      economics: "shared",
    },
    portability: {
      models: "High — 200+ models incl. Anthropic and open weights on the same plane",
      harness: "Medium — ADK is open source and runs anywhere; Agent Engine services are Google-managed",
      tools: "High — MCP everywhere; Apigee wraps existing APIs without rewrites",
    },
  },
  {
    id: "openai",
    name: "OpenAI",
    philosophy: "API-deep, application-high — own the model, the hosted tools, and the enterprise surface; keep the middle thin.",
    hue: 160,
    layers: {
      models: "GPT-5.x family only",
      harness: "Agents SDK (thin, open source) · Codex harness unified across surfaces via App Server",
      runtime: "Responses API holds state and hosted tools; durability via partners (Temporal integration GA Mar 2026)",
      protocols: "MCP adopted Mar 2025 · AGENTS.md convention originated here",
    },
    facts: [
      {
        text: "Agent Builder (visual canvas, launched Oct 2025) was deprecated June 2026 with a Nov 2026 shutdown; recommended path is code (Agents SDK) or Workspace Agents in ChatGPT.",
        source: { label: "OpenAI deprecation notice", url: "https://community.openai.com/t/deprecation-notice-agent-builder/1382650", date: "2026-06" },
      },
      {
        text: "OpenAI Frontier (Feb 2026) is an enterprise platform for building, deploying and governing agents — explicitly open to third-party agents; early customers include Uber, State Farm, Intuit, Thermo Fisher.",
        source: { label: "Introducing OpenAI Frontier", url: "https://openai.com/index/introducing-openai-frontier/", date: "2026-02" },
      },
      {
        text: "'Harness engineering' (Feb 2026) documents OpenAI's own practice: engineering environments, feedback loops and constraints around Codex rather than writing code directly.",
        source: { label: "Harness engineering", url: "https://openai.com/index/harness-engineering/", date: "2026-02" },
      },
    ],
    interpretation:
      "OpenAI concluded the visual middle tier is a commodity and retreated to the two ends where it is strongest: the model+API below, and the ChatGPT/Frontier enterprise surface above. The harness in between is deliberately thin and increasingly delegated to partners.",
    implication:
      "Fastest path if your workforce already lives in ChatGPT and your workloads fit hosted tools. The state layer (Responses API) is the coupling point: it is excellent, and it is OpenAI-only.",
    ownership: {
      context: "shared",
      memory: "platform",
      tools: "platform",
      orchestration: "developer",
      state: "platform",
      identity: "shared",
      evaluation: "shared",
      guardrails: "platform",
      observability: "shared",
      recovery: "developer",
      economics: "developer",
    },
    portability: {
      models: "Low — the stack assumes OpenAI models",
      harness: "Medium — Agents SDK is open source, but hosted tools and state live in the Responses API",
      tools: "Medium — MCP supported; hosted tools are proprietary conveniences",
    },
  },
  {
    id: "anthropic",
    name: "Anthropic",
    philosophy: "The harness is the product — shipped as an SDK, not a cloud; standards as the moat.",
    hue: 25,
    layers: {
      models: "Claude family only (first-party); Claude also sold via AWS/Google clouds",
      harness: "Claude Agent SDK — the Claude Code harness generalized: context mgmt, permissions, hooks, subagents, sessions",
      runtime: "None managed — deploy the SDK yourself or on partner clouds",
      protocols: "MCP (originated, now Linux Foundation) · Agent Skills open standard (Dec 2025, ~40 products)",
    },
    facts: [
      {
        text: "The Claude Code SDK was renamed Claude Agent SDK (Sept 2025) 'because the agent harness that powers Claude Code can power many other types of agents'; the loop is gather context → take action → verify work.",
        source: { label: "Anthropic engineering blog", url: "https://www.anthropic.com/engineering", date: "2025-09" },
      },
      {
        text: "MCP was donated to Linux Foundation governance (Dec 2025); the 2026-07-28 spec revision is the largest since launch — stateless core, extensions framework, hardened OAuth.",
        source: { label: "MCP spec blog", url: "https://blog.modelcontextprotocol.io/posts/2026-07-28/", date: "2026-07" },
      },
      {
        text: "Microsoft's Agent Framework ships an official Claude Agent SDK connector — a competitor embedding Anthropic's harness as a component.",
        source: { label: "MS Agent Framework at Build 2026", url: "https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-at-build-2026-announce/", date: "2026-04" },
      },
    ],
    interpretation:
      "Anthropic monetizes models and gives the harness away, betting that the best-engineered loop plus neutral standards (MCP, Skills) makes Claude the default engine inside everyone else's platforms — including competitors'.",
    implication:
      "Best-in-class harness ergonomics if Claude models fit; you own deployment, scaling and fleet governance yourself or assemble them from a cloud. Model portability is the explicit trade.",
    ownership: {
      context: "platform",
      memory: "shared",
      tools: "shared",
      orchestration: "platform",
      state: "shared",
      identity: "developer",
      evaluation: "developer",
      guardrails: "shared",
      observability: "developer",
      recovery: "shared",
      economics: "shared",
    },
    portability: {
      models: "Low — the SDK assumes Claude",
      harness: "High-ish — open SDK, runs on any infra incl. via clouds' runtimes",
      tools: "High — MCP-native by construction",
    },
  },
  {
    id: "microsoft",
    name: "Microsoft",
    philosophy: "Name every layer, sell every layer — the only vendor with a product literally called 'Agent Harness'.",
    hue: 205,
    layers: {
      models: "Azure catalog: OpenAI, Anthropic, open weights",
      harness: "Agent Framework (AutoGen+Semantic Kernel successor, 1.0 GA Apr 2026) incl. the named Agent Harness",
      runtime: "Foundry Agent Service — hosted agents, Entra Agent ID, metered per vCPU-hour",
      protocols: "MCP GA across Copilot Studio/VS Code · A2A member · Agent Skills adopter",
    },
    facts: [
      {
        text: "Microsoft's docs define the agent harness as 'the runtime scaffolding that turns a language model into an agent that can perform work' — driving model/tool calls, managing state and context, applying approval policies.",
        source: { label: "Agent Framework harness docs", url: "https://learn.microsoft.com/en-us/agent-framework/concepts/harness", date: "2026" },
      },
      {
        text: "Foundry Hosted Agents are GA with per-vCPU-hour/GiB-hour billing, managed identity via Entra Agent ID, and publishing into Teams and M365 Copilot.",
        source: { label: "Foundry at Build 2026", url: "https://devblogs.microsoft.com/foundry/agent-service-build2026/", date: "2026-05" },
      },
      {
        text: "Copilot Studio's computer-using agents went GA May 2026 with allowlists, DLP and Purview session logging.",
        source: { label: "Copilot Studio blog", url: "https://techcommunity.microsoft.com/blog/copilot-studio-blog/computer-using-agents-in-microsoft-copilot-studio-are-now-generally-available/4519427", date: "2026-05" },
      },
    ],
    interpretation:
      "Microsoft treats even rival harnesses as pluggable (official Claude SDK and Copilot connectors), betting the durable business is runtime + identity + governance + the M365 distribution surface, not the loop itself.",
    implication:
      "The gravity option for M365/Entra estates: identity and compliance come almost free. Watch the seams between Agent Framework, Foundry and Copilot Studio — three products, three teams, one story that occasionally drifts.",
    ownership: {
      context: "shared",
      memory: "platform",
      tools: "shared",
      orchestration: "shared",
      state: "platform",
      identity: "platform",
      evaluation: "platform",
      guardrails: "platform",
      observability: "platform",
      recovery: "shared",
      economics: "shared",
    },
    portability: {
      models: "High — multi-vendor catalog including Anthropic",
      harness: "Medium — Agent Framework is OSS; Foundry runtime and Entra identity are Azure",
      tools: "High — MCP GA across surfaces",
    },
  },
  {
    id: "aws",
    name: "AWS",
    philosophy: "Unbundle the harness into managed primitives; stay neutral on framework and model.",
    hue: 35,
    layers: {
      models: "Bedrock catalog: Anthropic, Nova, Llama, Mistral et al.",
      harness: "Strands Agents SDK (house), but any framework runs — LangGraph, CrewAI, ADK",
      runtime: "Bedrock AgentCore: Runtime (microVMs, 8h sessions), Memory, Gateway, Identity, Browser, Code Interpreter, Observability",
      protocols: "MCP (Gateway turns APIs into MCP tools) · A2A member",
    },
    facts: [
      {
        text: "AgentCore went GA Oct 2025: session-isolated microVM runtime, short/long-term memory, OAuth token-vault identity, and OTel observability, framework- and model-agnostic.",
        source: { label: "AWS What's New", url: "https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available", date: "2025-10" },
      },
      {
        text: "AgentCore Policy (GA Mar 2026) enforces Cedar policies at the tool gateway on every call — natural-language-authored, with budgets, action ordering and approval requirements added mid-2026.",
        source: { label: "AgentCore Policy + Guardrails", url: "https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-bedrock-agentcore-policy-guardrails-generally-available/", date: "2026-06" },
      },
      {
        text: "AgentCore Evaluations went GA Mar 2026 with quality scoring and A/B recommendations.",
        source: { label: "AWS News Blog", url: "https://aws.amazon.com/blogs/aws/amazon-bedrock-agentcore-adds-quality-evaluations-and-policy-controls-for-deploying-trusted-ai-agents/", date: "2026-03" },
      },
    ],
    interpretation:
      "AWS declined to pick a winner in the loop wars and productized everything underneath: the most developed runtime-level permissions story on the market (Cedar at the gateway) is the differentiator, not a harness.",
    implication:
      "Natural fit for infrastructure-first teams that want to bring their own framework and enforce policy below the agent. You assemble more; you're coupled to services, not to a loop.",
    ownership: {
      context: "developer",
      memory: "platform",
      tools: "shared",
      orchestration: "developer",
      state: "platform",
      identity: "platform",
      evaluation: "platform",
      guardrails: "platform",
      observability: "platform",
      recovery: "shared",
      economics: "shared",
    },
    portability: {
      models: "High — Bedrock catalog; bring-your-own endpoints",
      harness: "High — any framework on Runtime; Strands optional",
      tools: "High — Gateway manufactures MCP tools from existing APIs and Lambda",
    },
  },
  {
    id: "oss",
    name: "Open-source ecosystem",
    philosophy: "Own the loop yourself; compose the rest — with the Linux Foundation as the neutral ground.",
    hue: 282,
    layers: {
      models: "Anything — API or open weights",
      harness: "LangGraph/LangChain 1.0, CrewAI, LlamaIndex Workflows, Pydantic AI, Vercel AI SDK, Mastra; Letta for memory",
      runtime: "Self-hosted or vendor platforms (LangGraph Platform, Letta Cloud); Temporal as durability substrate",
      protocols: "MCP, A2A, AGENTS.md, Agent Skills — all under open governance as of Dec 2025",
    },
    facts: [
      {
        text: "LangChain and LangGraph hit 1.0 GA (Oct 2025) with semver stability; LangGraph provides durable graphs, checkpoints and human-in-the-loop interrupts; production users include Uber, LinkedIn, Klarna.",
        source: { label: "LangChain 1.0 announcement", url: "https://www.langchain.com/blog/langchain-langgraph-1dot0", date: "2025-10" },
      },
      {
        text: "The Linux Foundation's Agentic AI Foundation formed Dec 2025 with MCP, Goose and AGENTS.md as founding projects; platinum members include Anthropic, OpenAI, Google, Microsoft, AWS and Block.",
        source: { label: "Linux Foundation press", url: "https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation", date: "2025-12" },
      },
      {
        text: "Temporal became the cross-ecosystem durable-execution layer: GA integration with OpenAI's Agents SDK (Mar 2026) plus Pydantic AI, Vercel AI SDK, Strands and ADK integrations.",
        source: { label: "Temporal blog", url: "https://temporal.io/blog/announcing-openai-agents-sdk-integration", date: "2026-03" },
      },
    ],
    interpretation:
      "Open source owns orchestration and increasingly memory and evals, and outsources durability to Temporal-class engines and runtime to the clouds. The 2025–26 standards consolidation removed the biggest historical risk: proprietary protocol lock-in.",
    implication:
      "Maximum control and portability; you staff the runtime, security and governance layers the platforms would otherwise provide. Best where the agent IS the product and differentiation justifies the operational burden.",
    ownership: {
      context: "developer",
      memory: "shared",
      tools: "shared",
      orchestration: "developer",
      state: "shared",
      identity: "developer",
      evaluation: "shared",
      guardrails: "developer",
      observability: "shared",
      recovery: "developer",
      economics: "developer",
    },
    portability: {
      models: "Maximal — any provider, any weights",
      harness: "Maximal in code; operational lock-in shifts to whatever runtime you choose",
      tools: "High — MCP-native across the ecosystem",
    },
  },
];
