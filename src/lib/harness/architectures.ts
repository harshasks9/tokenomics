import type { RefArchitecture } from "./types";

/** Reference architectures (PRD §16, Deliverable 8). Hypothetical enterprise patterns. */
export const ARCHITECTURES: RefArchitecture[] = [
  {
    id: "research-agent",
    name: "Enterprise Research Agent",
    scenario:
      "An analyst asks for a competitive briefing. The agent plans, fans out across web and internal sources, verifies claims, and returns a cited brief.",
    nodes: [
      { id: "user", label: "Analyst", kind: "actor" },
      { id: "app", label: "Research app", kind: "app" },
      { id: "harness", label: "Harness · plan → fan out → verify", kind: "harness" },
      { id: "model", label: "Frontier model (+ fast model for triage)", kind: "model" },
      { id: "tools", label: "Search · browser · internal corpus", kind: "tool" },
      { id: "out", label: "Cited brief", kind: "data" },
    ],
    edges: [
      { from: "user", to: "app", label: "question" },
      { from: "app", to: "harness" },
      { from: "harness", to: "model", label: "route by step" },
      { from: "harness", to: "tools", label: "parallel subagents" },
      { from: "harness", to: "out", label: "grounding-checked" },
    ],
    spotlight: [
      { capabilityId: "orchestration", how: "Planner decomposes; subagents read sources in parallel with isolated context; a synthesizer merges." },
      { capabilityId: "context", how: "Compaction keeps hour-three synthesis aware of hour-one findings without blowing the window." },
      { capabilityId: "evaluation", how: "Every claim in the brief must trace to a fetched source; unverified claims are flagged, not dropped silently." },
      { capabilityId: "economics", how: "Cheap model triages sources; the frontier model only reads what survives triage." },
    ],
    whyItMatters:
      "The deliverable is trust, not text. Without verification and citations this is confident summarizing; with them it replaces days of analyst work.",
  },
  {
    id: "service-agent",
    name: "Customer Service Agent",
    scenario:
      "A customer disputes a charge. The agent resolves identity, reads CRM history, executes the refund workflow within limits, and escalates cleanly past them.",
    nodes: [
      { id: "cust", label: "Customer", kind: "actor" },
      { id: "app", label: "Chat / voice channel", kind: "app" },
      { id: "harness", label: "Harness · policy-bounded workflow", kind: "harness" },
      { id: "model", label: "Conversation model", kind: "model" },
      { id: "tools", label: "CRM · billing · knowledge base", kind: "tool" },
      { id: "human", label: "Human agent (escalation)", kind: "human" },
    ],
    edges: [
      { from: "cust", to: "app" },
      { from: "app", to: "harness" },
      { from: "harness", to: "model" },
      { from: "harness", to: "tools", label: "scoped writes" },
      { from: "harness", to: "human", label: "over-limit → full context" },
    ],
    spotlight: [
      { capabilityId: "identity", how: "The agent acts with delegated authority: this customer, this account, refunds ≤ a hard limit enforced at the tool gateway." },
      { capabilityId: "guardrails", how: "Brand/policy output controls plus injection screening — chat transcripts are untrusted input." },
      { capabilityId: "recovery", how: "Failed workflow steps compensate (void, not orphan, the half-issued credit); escalation hands the human the full trajectory." },
      { capabilityId: "observability", how: "Every action is reconstructable per interaction — the audit answer to 'why did this customer get a refund?'" },
    ],
    whyItMatters:
      "The bar isn't a smarter reply — it's completing transactions safely at scale. Guardrails and recovery are the product; the model is replaceable.",
  },
  {
    id: "coding-agent",
    name: "Coding Agent",
    scenario:
      "A developer files an issue. The agent gathers repo context, plans, edits, runs tests until green, and opens a reviewed pull request.",
    nodes: [
      { id: "dev", label: "Developer", kind: "actor" },
      { id: "app", label: "CLI / IDE / cloud task", kind: "app" },
      { id: "harness", label: "Harness · edit-test-fix loop", kind: "harness" },
      { id: "model", label: "Coding model", kind: "model" },
      { id: "tools", label: "Repo · shell · tests (sandboxed)", kind: "tool" },
      { id: "pr", label: "Pull request", kind: "data" },
    ],
    edges: [
      { from: "dev", to: "app", label: "issue / prompt" },
      { from: "app", to: "harness" },
      { from: "harness", to: "model" },
      { from: "harness", to: "tools", label: "permission-tiered" },
      { from: "harness", to: "pr", label: "tests green" },
    ],
    spotlight: [
      { capabilityId: "evaluation", how: "Tests and linters give the loop free ground truth — the harness iterates until green, not until plausible." },
      { capabilityId: "context", how: "Agentic search over the repo beats stuffing files; instruction files (AGENTS.md-style) carry project memory." },
      { capabilityId: "state", how: "Checkpoints let long refactors rewind a bad path instead of restarting." },
      { capabilityId: "guardrails", how: "OS-level sandboxing and permission modes bound the blast radius of shell access." },
    ],
    whyItMatters:
      "Coding is the existence proof for harness choice: identical models score measurably differently across these loops, and every vendor's best harness engineering shows up here first.",
  },
  {
    id: "process-agent",
    name: "Autonomous Business Process Agent",
    scenario:
      "An invoice-exception event fires. The agent gathers evidence across systems, proposes a resolution, waits days for approval without losing state, executes, and leaves an audit trail.",
    nodes: [
      { id: "event", label: "Event (exception)", kind: "actor" },
      { id: "harness", label: "Harness · durable long-running state", kind: "harness" },
      { id: "model", label: "Reasoning model", kind: "model" },
      { id: "tools", label: "ERP · payments · docs (via gateway)", kind: "tool" },
      { id: "human", label: "Approver", kind: "human" },
      { id: "audit", label: "Audit trail", kind: "data" },
    ],
    edges: [
      { from: "event", to: "harness", label: "trigger" },
      { from: "harness", to: "model" },
      { from: "harness", to: "tools", label: "delegated, least-privilege" },
      { from: "harness", to: "human", label: "approval pause (days)" },
      { from: "harness", to: "audit", label: "every step" },
    ],
    spotlight: [
      { capabilityId: "state", how: "Durable execution: the approval pause can last a week and resume exactly where it stopped, across restarts." },
      { capabilityId: "identity", how: "The agent's own identity, with delegated scopes per system — reconstructable authority for every write." },
      { capabilityId: "guardrails", how: "Transactions above thresholds are structurally impossible without approval — enforced at the gateway, not requested in the prompt." },
      { capabilityId: "observability", how: "The audit trail is a first-class output; compliance reads trajectories, not summaries." },
    ],
    whyItMatters:
      "This is where agents meet ERP-grade expectations. Nearly every harness layer runs at full weight — and model choice is the least risky decision on the diagram.",
  },
];
