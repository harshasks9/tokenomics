import type { GoogleRow } from "./types";

/**
 * Google Cloud capability map (PRD §12, Deliverable 7).
 * Ordered requirement-first: harness need → architectural approach → services.
 * Status notes reflect the 2026-08 research snapshot; product naming is
 * mid-migration (Vertex AI → Gemini Enterprise Agent Platform, Next '26).
 */
export const GOOGLE_ROWS: GoogleRow[] = [
  {
    capabilityId: "context",
    requirement: "Assemble grounded, governed, cache-efficient context",
    approach:
      "Managed retrieval as a service (enterprise search + RAG orchestration), grounding on Google Search and Maps, and native context caching so stable prefixes get ~90% cheaper reads.",
    services: [
      { name: "Vertex AI Search", note: "out-of-box enterprise retrieval ('Agent Search' in current docs)" },
      { name: "RAG Engine", note: "managed RAG orchestration" },
      { name: "Grounding with Google Search", note: "web grounding with citations" },
      { name: "Context caching", note: "implicit + explicit; cached reads ~90% off" },
    ],
    openness: "Retrieval APIs work with any model in Model Garden — including Claude — and with custom harnesses.",
  },
  {
    capabilityId: "memory",
    requirement: "Persist session, user and task memory with governance",
    approach:
      "Memory as a managed runtime service rather than app code: sessions for working state, Memory Bank for topic-extracted long-term memory across sessions.",
    services: [
      { name: "Agent Engine Sessions", note: "managed conversation/task state (GA)" },
      { name: "Agent Engine Memory Bank", note: "cross-session fact extraction and recall (GA)" },
    ],
    openness: "Consumable from ADK, LangGraph or CrewAI agents deployed on Agent Engine.",
  },
  {
    capabilityId: "tools",
    requirement: "Expose enterprise systems as governed tools",
    approach:
      "Treat tools as API products: Apigee converts existing API specs into managed MCP tools with policy attached, and API hub syncs with the Agent Registry so agents discover only cataloged tools. 50+ Google-managed MCP servers cover BigQuery, Maps, databases.",
    services: [
      { name: "Apigee MCP", note: "API specs → governed MCP tools, 30+ policies" },
      { name: "API hub ↔ Agent Registry", note: "managed tool discovery" },
      { name: "Managed MCP servers", note: "BigQuery, AlloyDB, Cloud SQL, Spanner, Maps…" },
    ],
    openness: "MCP end-to-end: tools built here are consumable by any MCP client, including non-Google harnesses.",
  },
  {
    capabilityId: "orchestration",
    requirement: "Deterministic workflows plus agentic freedom, multi-agent ready",
    approach:
      "ADK 2.0's graph-based workflow runtime blends deterministic routing (fan-out/fan-in, loops, retries, human-in-the-loop) with LLM-driven agents and sub-agent hierarchies; A2A handles agent-to-agent interop across vendors.",
    services: [
      { name: "ADK 2.0", note: "open source, Python/Go/Java/TS, graph runtime" },
      { name: "A2A protocol", note: "v1.0 Mar 2026, Linux Foundation, 150+ orgs" },
      { name: "Agent-to-Agent Orchestration (GEAP)", note: "platform-level multi-agent coordination" },
    ],
    openness: "ADK is Apache-licensed and runs anywhere; A2A is vendor-neutral by governance.",
  },
  {
    capabilityId: "state",
    requirement: "Durable, resumable, long-running task state",
    approach:
      "Managed session persistence in the runtime plus sandboxed code execution; long-running work is a platform property, not per-team plumbing.",
    services: [
      { name: "Agent Engine Runtime", note: "autoscaling, session persistence" },
      { name: "Secure Sandboxes / Code Execution", note: "isolated compute for agent work" },
    ],
    openness: "Framework-agnostic deployment (ADK, LangGraph, CrewAI); Temporal-style external engines also integrate with ADK.",
  },
  {
    capabilityId: "identity",
    requirement: "Per-agent identity with delegated, auditable authority",
    approach:
      "Agents get first-class IAM identities — not shared service accounts — with mTLS certificates rotating every 24h and tokens cryptographically bound to them; the Agent Gateway enforces access policy on agent traffic; audit logs record agent and on-behalf-of user.",
    services: [
      { name: "IAM Agent Identity", note: "per-agent principals, bound credentials" },
      { name: "Agent Gateway", note: "IAP-based policy enforcement point" },
      { name: "Context-Aware Access", note: "conditional access for agents" },
    ],
    openness: "Identity plane covers third-party models and custom harnesses running on Google Cloud.",
  },
  {
    capabilityId: "evaluation",
    requirement: "Score model-harness pairs before and during production",
    approach:
      "Evaluation as a service: LLM-judge and custom criteria over final responses and full trajectories, agent simulation for pre-production stress-testing, plus ADK's built-in eval harness for CI.",
    services: [
      { name: "Gen AI evaluation service", note: "judge + criteria, trajectory eval" },
      { name: "Agent Simulation (GEAP)", note: "scaled pre-prod stress tests (newer; verify stage)" },
      { name: "ADK eval", note: "eval sets in the dev loop" },
    ],
    openness: "Evaluates any deployed agent endpoint, including non-Gemini models.",
  },
  {
    capabilityId: "guardrails",
    requirement: "Screen prompts, tools and outputs; contain injections",
    approach:
      "A dedicated screening layer (prompt injection, jailbreak, sensitive data, URLs) applied at the gateway and on MCP traffic, with streaming sanitization — independent of which model runs behind it.",
    services: [
      { name: "Model Armor", note: "v3 filters; streaming sanitization GA; auto-upgrade Aug 2026" },
      { name: "Agent Anomaly Detection", note: "behavioral monitoring (GEAP)" },
      { name: "Safety filters", note: "model-level controls" },
    ],
    openness: "Model Armor screens traffic for any model, including third-party and self-hosted harnesses.",
  },
  {
    capabilityId: "observability",
    requirement: "Reconstructable trajectories and fleet dashboards",
    approach:
      "OpenTelemetry GenAI semantic conventions as the native format: Agent Engine auto-exports traces to Cloud Trace, console shows span DAGs with inputs/outputs, dashboards track token usage and error rates.",
    services: [
      { name: "Agent Observability (GEAP)", note: "trace DAGs, token/error dashboards" },
      { name: "Cloud Trace + OTel", note: "auto-export, standard conventions" },
    ],
    openness: "OTel-standard output ports to any observability backend you already run.",
  },
  {
    capabilityId: "recovery",
    requirement: "Retries, fallbacks, human escalation as designed paths",
    approach:
      "Workflow-level retries and human-in-the-loop confirmation in ADK's runtime; model fallback via Model Garden breadth; escalation surfaces in Gemini Enterprise inboxes.",
    services: [
      { name: "ADK workflow runtime", note: "retries, loops, HITL nodes" },
      { name: "Model Garden routing", note: "fallback across 200+ models" },
    ],
    openness: "Recovery logic lives in open-source ADK code you can take anywhere.",
  },
  {
    capabilityId: "economics",
    requirement: "Engineer cost per successful task, not per token",
    approach:
      "Structural levers: batch at flat −50%, context caching at ~−90% on cached reads, provisioned throughput for committed capacity, and a fast/cheap Flash tier for routing — plus per-trajectory token accounting in observability.",
    services: [
      { name: "Context caching", note: "~90% off cached reads" },
      { name: "Batch API", note: "50% off, ≤24h" },
      { name: "Provisioned Throughput", note: "GSU commitments for steady load" },
      { name: "Flash model tier", note: "routing target for cheap steps" },
    ],
    openness: "Levers apply to Gemini; third-party models carry their providers' pricing on the same billing plane.",
  },
];

export const GOOGLE_POV = {
  headline: "Why build the harness on Google Cloud?",
  points: [
    "Requirement-first coverage: all eleven harness layers have a managed answer, and none of them requires the others — adopt the gateway without the runtime, the evals without the models.",
    "Open seams are structural, not marketing: Claude and 200+ models sell in the garden, ADK is Apache-licensed, MCP is native, and A2A was donated to the Linux Foundation.",
    "The control plane is the differentiator: per-agent IAM identity, Apigee-governed tools, Model Armor screening and OTel-native observability form the most complete agent security story of the major clouds (analyst judgment).",
    "Where you land depends on posture: custom harness on GCE/GKE, open framework on Agent Engine, or fully managed in Gemini Enterprise — all three are supported paths, not workarounds.",
  ],
};
