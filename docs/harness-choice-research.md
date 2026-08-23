# Harness Choice — Research Synthesis

**Research date-stamp: 2026-08-23.** Compiled from four parallel deep-research passes
(primary vendor docs and blogs, arXiv, Linux Foundation press, trade press). Claims that
rest on secondary sources are flagged. This document backs the `/harness` microsite;
the machine-readable versions of the deliverables live in `src/lib/harness/*.ts`.

Deliverable map (PRD §21):
- **D1 Research synthesis** — this file, §1–§4
- **D2 Harness taxonomy** — `src/lib/harness/capabilities.ts` (11 layers) + §2
- **D3 Choice framework** — `src/lib/harness/dimensions.ts`
- **D4 Workload matrix** — `src/lib/harness/workloads.ts`
- **D5 Market landscape** — `src/lib/harness/vendors.ts` + §3
- **D6 Model–harness analysis** — `src/lib/harness/exhibits.ts` + §2
- **D7 Google capability map** — `src/lib/harness/google.ts`
- **D8 Reference architectures** — `src/lib/harness/architectures.ts`
- **D9 Microsite IA** — `docs/harness-choice-microsite.md`
- **D10 Microsite** — `src/app/harness/` + `src/components/harness/`

---

## 1. The emerging discipline of harness engineering

In twelve months (Aug 2025 → Aug 2026) "agent harness" went from informal jargon to a
named product category and research object:

- **Anthropic** renamed the Claude Code SDK to the **Claude Agent SDK** (Sept 2025)
  because "the agent harness that powers Claude Code can power many other types of
  agents"; published *Effective context engineering for AI agents* (2025-09-29) and
  *Effective harnesses for long-running agents* (2025-11-26).
- **OpenAI** published *Unlocking the Codex harness* (2026-02-04) and *Harness
  engineering: leveraging Codex in an agent-first world* (2026-02-11) — naming the
  practice of engineering the environment, tools, abstractions and feedback loops
  around agents rather than writing code or prompts.
- **Microsoft** shipped a literal product called the **Agent Harness** inside Microsoft
  Agent Framework (stable at Build 2026; GA per InfoQ Aug 2026): "the runtime
  scaffolding that turns a language model into an agent that can perform work. It
  drives model and tool calls, manages conversation state and context, applies
  approval policies, and can keep the agent progressing through a multi-step task."
- **Google** reorganized its coding tools around a shared "agent harness"
  (Antigravity 2.0 + Antigravity CLI, I/O 2026) "co-optimized with Gemini models,"
  and began selling harnesses directly as **Managed Agents in the Gemini API**.
- **Academia** produced a 2026 cluster: *Stop Comparing LLM Agents Without Disclosing
  the Harness* (arXiv:2605.23950), *Harness-Bench* (arXiv:2605.27922), *Is Grep All
  You Need?* (arXiv:2605.15184), a survey on agent system and harness design
  (arXiv:2606.20683), and *The Scaffold Effect in Coding Agents* (arXiv:2607.22585).

### Definitions in circulation (and where they disagree)

| Source | Definition (paraphrase) |
|---|---|
| Microsoft Agent Framework docs | Runtime scaffolding: drives model/tool calls, manages state and context, applies approval policies, keeps multi-step tasks progressing. |
| OpenAI (harness engineering) | The full engineered environment: repo structure, CI, linters, instructions, tools — "scaffolding, constraints, and feedback loops" around the agent. |
| Anthropic (agent evals) | "An agent harness (or scaffold) is the system that enables a model to act as an agent... we're evaluating the harness and the model working together." |
| Hugging Face glossary (2026-05-25) | Splits *scaffold* (behavior definition: instructions, tools, formats) from *harness* (execution runtime: loop, retries, timeouts, guardrails). |
| Arize | "The runtime and control layer around a language model" — and: you *assemble* a framework; a *harness ships as a running agent*. |
| Harness-Bench (academic) | "The system layer that manages context, tools, state, constraints, permissions, tracing, and recovery." |

Disagreements worth flagging to customers: (a) harness vs scaffold — synonyms at
Anthropic, distinct layers at Hugging Face; (b) harness vs framework — Arize says
frameworks are assembled and harnesses ship running, while Microsoft ships a harness
*inside* a framework; (c) OpenAI's scope sweeps the entire environment (even CI)
into "harness."

**The microsite's working definition** (synthesized): *the model provides
intelligence; the harness is the system that converts that intelligence into reliable
work — deciding what the model sees, what it can do, how work proceeds across steps,
what it may never do, and how you know it worked.*

## 2. Evidence: harness choice changes outcomes with the model held constant

- **Token economics, same model:** *The Scaffold Effect* (arXiv:2607.22585, Jul 2026)
  ran two models through three open-source harnesses on a Terminal-Bench Pro subset:
  up to **40× difference in tokens per solved task**, while pass-rate deltas stayed
  0–8 pp. Failure "fingerprints" were harness-specific and replicated across models.
- **Success rate, same model:** arXiv:2605.23950 (May 2026) reports a locked-model
  harness swap moving Terminal-Bench 2 pass@1 **69.7% → 77.0%**, and cites
  **11–15 pp scaffold-only variation on SWE-bench Verified**. Its "Binding Constraint
  Thesis": among comparable frontier models, harness configuration governs more
  performance variance than model choice.
- **Leaderboards moved to pairs:** Terminal-Bench scores (model, harness) pairs by
  design; vals.ai's Terminal-Bench 2.1 re-runs all models through one reference
  harness (Terminus 2) to isolate the model. Secondary analyses (re-verify before
  print) report e.g. GPT-5.5 at 83.4% in Codex CLI vs 76.4% in Terminus 2 (7 pts);
  home-harness advantages of ~3 pts for Claude models in Claude Code; harness swings
  of ~7–26 pts across third-party harnesses.
- **Caching inverts naive token accounting:** production data (Galileo caching
  playbook, 2026) shows a 67.6k-token/turn agent costing ~2¢/turn while an
  18.5k-token/turn agent costs ~6¢ — cache-hit rate dominates raw token count.
- **Tool plumbing is a cost lever:** Anthropic's *Code execution with MCP*
  (Nov 2025) example cut tool-definition overhead ~150k → ~2k tokens (−98.7%) by
  letting the agent write code against MCP servers instead of loading tool schemas.
- **Models are being tuned to harnesses:** Cursor's Composer and Cognition's SWE-1.5
  are RL-trained inside their own harnesses; Amp removed the model picker entirely;
  Anthropic deliberately publishes SWE-bench with a minimal scaffold to separate
  model claims from harness claims.

Implication: **model benchmarks that don't disclose the harness are quoting a
different test**, and cost-per-token comparisons that ignore harness efficiency can
be wrong by more than an order of magnitude.

## 3. Market landscape (mid-2026, condensed)

- **Anthropic** — the harness lives entirely in the **Claude Agent SDK** (context
  management, permissions, hooks, subagents, sessions, CLAUDE.md memory); no managed
  runtime — deploy it yourself or via partner clouds. Standards power: **MCP**
  (donated to Linux Foundation governance, Dec 2025; 2026-07-28 spec revision) and
  **Agent Skills** (open standard Dec 2025, ~40 adopting products).
- **OpenAI** — Responses API owns hosted tools + state; Agents SDK is a thin
  orchestration layer; **AgentKit's visual Agent Builder was deprecated June 2026**
  (shutdown Nov 2026) while **Frontier** (Feb 2026) targets enterprise agent
  governance, explicitly hosting third-party agents. Codex harness unified across
  surfaces via an App Server protocol.
- **Microsoft** — cleanest three-tier story: Agent Framework (OSS SDK + named Agent
  Harness) → Foundry Agent Service (hosted agents, Entra Agent ID, metered
  per-vCPU-hour) → Copilot Studio/M365. Ships official **Claude Agent SDK and GitHub
  Copilot connectors** — rival harnesses as pluggable components.
- **AWS** — unbundled the harness into managed services: **Bedrock AgentCore**
  (Runtime microVMs, Memory, Gateway→MCP, Identity token vault, Browser, Code
  Interpreter, Observability), plus **Policy** (Cedar at the tool gateway, GA
  Mar 2026) and **Evaluations** (GA Mar 2026). Framework- and model-agnostic;
  Strands Agents is the house SDK.
- **Google** — ADK (code-first, 4 languages; 2.0's graph runtime May 2026) +
  Agent Engine (Sessions, Memory Bank, sandboxed code execution) + **Gemini
  Enterprise** (employee surface) — consolidated at Next '26 into the **Gemini
  Enterprise Agent Platform** (ex-Vertex AI). Distinctive assets: **A2A** protocol
  (Linux Foundation, v1.0 Mar 2026, 150+ orgs), Apigee-as-tool-governance (API specs
  → managed MCP tools), per-agent **Agent Identity** in IAM + Agent Gateway +
  Model Armor.
- **Open source** — LangGraph/LangChain 1.0 (durable graphs + LangSmith), CrewAI,
  LlamaIndex Workflows, Pydantic AI, Vercel AI SDK 6/7, Mastra, Letta (memory),
  **Temporal as the cross-ecosystem durability substrate**. OpenHands/OpenCode/Goose
  as open coding harnesses (Goose donated to Linux Foundation's Agentic AI
  Foundation, Dec 2025, alongside MCP and AGENTS.md).
- **Coding agents** — the model-posture split: model-locked (Claude Code, Codex,
  Jules), model-agnostic (OpenHands, OpenCode, Goose, Copilot CLI, Antigravity), and
  harness-routed own-models (Cursor/Composer, Cognition/SWE-1.5, Amp with no model
  picker). Gemini CLI sunset for individuals June 2026 in favor of Antigravity CLI.

## 4. What enterprises should standardize vs leave workload-specific (house view)

**Standardize (the platform):** tool access via MCP behind a governed gateway; agent
identity and permission policy; observability schema (OTel GenAI conventions); the
evaluation harness and golden-task suites; memory/data governance; cost-per-task
accounting.

**Leave workload-specific (the harness):** orchestration pattern, context strategy,
model choice and routing, verification loops, UI surface. A coding agent and a
customer-service agent should share your identity, tool-governance, observability
and eval planes — and almost nothing else.

This is the microsite's central editorial position; sections 06–09 argue it.
