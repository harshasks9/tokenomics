import type {
  CapabilityAssessment,
  CapabilityDefinition,
  CapabilityLayer,
  Complexity,
  EstateProfile,
  Requirement,
} from "./types";

export const CAPABILITY_LAYERS: CapabilityLayer[] = [
  "Intelligence",
  "Context & action",
  "Runtime",
  "Trust",
  "Operations",
];

export const CAPABILITIES: CapabilityDefinition[] = [
  { id: "models", layer: "Intelligence", name: "Foundation model access", shortName: "Models", customerOutcome: "Provides the reasoning, language, vision, and generation capabilities behind each agent.", example: "A service agent understands a customer request and drafts an accurate response.", reuse: "shared", driver: "usage" },
  { id: "routing", layer: "Intelligence", name: "Model routing and fallback", shortName: "Routing", customerOutcome: "Balances quality, speed, availability, and cost for every request.", example: "A routine order lookup uses a fast model while a complex dispute is sent to a frontier model.", reuse: "shared", driver: "engineering" },
  { id: "orchestration", layer: "Intelligence", name: "Agent workflow orchestration", shortName: "Orchestration", customerOutcome: "Turns a request into a dependable sequence of steps, decisions, and actions.", example: "A claims agent gathers documents, validates coverage, calculates a recommendation, and requests approval.", reuse: "per-agent", driver: "engineering" },
  { id: "a2a", layer: "Intelligence", name: "Agent-to-agent coordination", shortName: "Agent-to-agent", customerOutcome: "Lets specialist agents collaborate on work that spans teams or systems.", example: "A sales agent asks pricing, inventory, and legal agents to assemble a compliant proposal.", reuse: "shared", driver: "runtime" },
  { id: "connectors", layer: "Context & action", name: "Enterprise data and app connectors", shortName: "Connectors", customerOutcome: "Gives agents governed access to the systems where customer and business data lives.", example: "An account agent reads Salesforce history and checks an SAP order without manual re-entry.", reuse: "shared", driver: "licenses" },
  { id: "grounding", layer: "Context & action", name: "Grounding and enterprise search", shortName: "Grounding", customerOutcome: "Keeps answers anchored in current, approved enterprise information.", example: "A policy assistant cites the latest internal policy instead of relying on model memory.", reuse: "shared", driver: "usage" },
  { id: "tools", layer: "Context & action", name: "Tools, MCP, and API integration", shortName: "Tools & APIs", customerOutcome: "Allows agents to complete work, not just recommend what a person should do next.", example: "A support agent issues a refund through an approved commerce API after validating eligibility.", reuse: "per-agent", driver: "engineering" },
  { id: "sessions", layer: "Context & action", name: "Session and state management", shortName: "Sessions", customerOutcome: "Preserves the state of an interaction across multiple steps and channels.", example: "A customer begins a return in chat and completes it later by phone without starting over.", reuse: "shared", driver: "storage" },
  { id: "memory", layer: "Context & action", name: "Long-term memory", shortName: "Memory", customerOutcome: "Enables useful continuity while retaining control over what an agent remembers.", example: "A relationship agent remembers communication preferences and approved portfolio objectives.", reuse: "per-agent", driver: "storage" },
  { id: "runtime", layer: "Runtime", name: "Managed agent execution", shortName: "Runtime", customerOutcome: "Runs multi-step agent work reliably beyond a single model response.", example: "A procurement workflow continues processing while waiting for an approval or supplier response.", reuse: "shared", driver: "runtime" },
  { id: "scaling", layer: "Runtime", name: "Autoscaling and workload isolation", shortName: "Scale & isolation", customerOutcome: "Maintains performance during demand spikes while separating users and workloads.", example: "A retail assistant handles holiday traffic without one tenant affecting another.", reuse: "shared", driver: "runtime" },
  { id: "sandbox", layer: "Runtime", name: "Sandbox and code execution", shortName: "Sandbox", customerOutcome: "Lets agents run code or process files without exposing production environments.", example: "A finance agent analyzes an uploaded spreadsheet inside an isolated execution environment.", reuse: "shared", driver: "runtime" },
  { id: "release", layer: "Runtime", name: "Deployment and release management", shortName: "Release controls", customerOutcome: "Enables controlled launches, versioning, testing, and rollback of agent changes.", example: "A new prompt is released to 10% of users and rolled back automatically if quality drops.", reuse: "shared", driver: "operations" },
  { id: "identity", layer: "Trust", name: "User and agent identity", shortName: "Identity", customerOutcome: "Establishes who is asking, which agent is acting, and who owns each action.", example: "An employee agent signs in through corporate SSO and every action is attributed to that identity.", reuse: "shared", driver: "engineering" },
  { id: "authorization", layer: "Trust", name: "Delegated authorization", shortName: "Authorization", customerOutcome: "Restricts agent access to the permissions granted to the user and the task.", example: "A manager can approve an expense while the agent cannot access unrelated payroll records.", reuse: "shared", driver: "engineering" },
  { id: "policy", layer: "Trust", name: "Policy, safety, and guardrails", shortName: "Policy & safety", customerOutcome: "Enforces business, safety, privacy, and regulatory rules during execution.", example: "A healthcare agent blocks unsupported clinical advice and routes the case to a clinician.", reuse: "shared", driver: "operations" },
  { id: "approval", layer: "Trust", name: "Human approval and escalation", shortName: "Human escalation", customerOutcome: "Keeps people in control of high-impact, uncertain, or exceptional decisions.", example: "A payment above a threshold pauses until an authorized employee approves it.", reuse: "per-agent", driver: "operations" },
  { id: "audit", layer: "Trust", name: "Audit and compliance evidence", shortName: "Audit", customerOutcome: "Creates evidence of what the agent knew, decided, and did.", example: "An auditor can reconstruct the data, policy, model version, and approval behind a decision.", reuse: "shared", driver: "storage" },
  { id: "evals", layer: "Operations", name: "Evaluation and regression testing", shortName: "Evals", customerOutcome: "Measures whether agent quality and safety remain acceptable as the system changes.", example: "A release is blocked when its refund-policy accuracy falls below the approved threshold.", reuse: "per-agent", driver: "operations" },
  { id: "observability", layer: "Operations", name: "Tracing and observability", shortName: "Observability", customerOutcome: "Shows where an agent is slow, expensive, inaccurate, or failing.", example: "Operations traces a delayed answer to a slow CRM connector rather than the model.", reuse: "shared", driver: "licenses" },
  { id: "incident", layer: "Operations", name: "Incident response and rollback", shortName: "Incident response", customerOutcome: "Limits customer impact and restores a safe service when something goes wrong.", example: "A faulty action tool is disabled globally and affected transactions are identified for review.", reuse: "shared", driver: "operations" },
  { id: "registry", layer: "Operations", name: "Agent registry and catalog", shortName: "Registry", customerOutcome: "Makes every agent discoverable with clear ownership, purpose, status, and dependencies.", example: "Security can identify all agents using customer data and contact the accountable owner.", reuse: "shared", driver: "storage" },
  { id: "finops", layer: "Operations", name: "Cost, quota, and usage controls", shortName: "Cost controls", customerOutcome: "Keeps agent spending predictable and attributable to teams, customers, or use cases.", example: "A business unit receives a budget alert before an unexpected traffic spike exceeds its quota.", reuse: "shared", driver: "operations" },
];

const complexityRank: Record<Complexity, number> = { assist: 1, act: 2, orchestrate: 3 };
const maxComplexity = (profile: EstateProfile) => Math.max(
  profile.personal.count ? complexityRank[profile.personal.complexity] : 0,
  profile.internal.count ? complexityRank[profile.internal.complexity] : 0,
  profile.customer.count ? complexityRank[profile.customer.complexity] : 0,
);

function requirementFor(id: string, profile: EstateProfile): { status: Requirement; reasons: string[] } {
  const total = profile.personal.count + profile.internal.count + profile.customer.count;
  const enterprise = profile.internal.count + profile.customer.count;
  const max = maxComplexity(profile);
  const acts = max >= 2;
  const orchestrates = max >= 3;
  const customer = profile.customer.count > 0;
  const regulated = profile.sensitivity === "regulated";
  const sensitive = profile.sensitivity !== "standard";
  const highActivity = profile.activity === "high";
  const reasons: string[] = [];
  const result = (status: Requirement, ...why: string[]) => ({ status, reasons: why });

  switch (id) {
    case "models": return result("required", "Every agent requires model access.");
    case "routing": return total > 8 || highActivity ? result("required", "Estate scale or activity makes routing a material reliability and cost control.") : result("recommended", "Routing adds fallback and cost control as usage grows.");
    case "orchestration": return acts ? result("required", "Act and Orchestrate agents execute multi-step workflows.") : result("recommended", "Assist agents still benefit from reusable workflow patterns.");
    case "a2a": return orchestrates ? result("required", "Orchestrate agents coordinate specialists or cross-system work.") : result("optional", "No orchestrated agent workflow is selected.");
    case "connectors": return enterprise > 0 ? result("required", "Enterprise agents must reach governed systems and data.") : result("recommended", "Personal agents gain value from user-approved connectors.");
    case "grounding": return total > 0 ? result("required", "Useful agents need current, customer-specific context.") : result("optional", "No active agents are selected.");
    case "tools": return acts ? result("required", "Act and Orchestrate agents call tools or write to systems.") : result("recommended", "Assist agents may use bounded read-only tools.");
    case "sessions": return total > 0 ? result("required", "Agent interactions require durable session state.") : result("optional", "No active agents are selected.");
    case "memory": return customer || profile.internal.count > 3 || orchestrates ? result("required", "The selected estate needs continuity across users, tasks, or long-running work.") : result("recommended", "Memory improves continuity but can remain bounded for personal assistants.");
    case "runtime": return enterprise > 0 || acts ? result("required", "Production workflows require managed execution beyond a single model call.") : result("recommended", "A lightweight runtime is sufficient for bounded personal assistants.");
    case "scaling": return customer || highActivity ? result("required", "External demand or high activity requires scaling and workload isolation.") : result("recommended", "Shared execution still needs capacity controls.");
    case "sandbox": return orchestrates ? result("required", "Orchestrated work may execute code or untrusted operations.") : acts ? result("recommended", "Action-taking agents benefit from isolated execution.") : result("optional", "Bounded assist use does not require general code execution.");
    case "release": return enterprise > 0 ? result("required", "Enterprise agents need controlled deployment, rollback, and versioning.") : result("recommended", "Personal deployments still benefit from version control.");
    case "identity": return total > 0 ? result("required", "Every agent action must be attributable to a user or workload identity.") : result("optional", "No active agents are selected.");
    case "authorization": return acts || enterprise > 0 ? result("required", "Enterprise or action-taking agents need scoped delegated permissions.") : result("recommended", "Personal assistants need user-scoped access boundaries.");
    case "policy": return customer || sensitive || acts ? result("required", "Audience, data sensitivity, or action-taking requires enforceable policy.") : result("recommended", "Basic safety policy is appropriate for personal assistants.");
    case "approval": return acts || customer ? result("required", "Material actions or customer interactions need approval and escalation paths.") : result("recommended", "A human remains the final decision-maker for assist workflows.");
    case "audit": return regulated || customer || acts ? result("required", "Regulation, external exposure, or system writes require auditable actions.") : result("recommended", "Operational history improves accountability.");
    case "evals": return total > 0 ? result("required", "Production quality must be measured before and after releases.") : result("optional", "No active agents are selected.");
    case "observability": return enterprise > 0 || highActivity ? result("required", "Production scale needs traces, metrics, and failure diagnosis.") : result("recommended", "Basic monitoring is sufficient at personal scale.");
    case "incident": return customer || acts ? result("required", "Action-taking or external agents need rollback and incident ownership.") : result("recommended", "Assist workflows need a lightweight support path.");
    case "registry": return total > 10 || orchestrates ? result("required", "A larger or orchestrated estate needs discovery and lifecycle ownership.") : result("recommended", "A small catalog prevents duplicate agents as adoption grows.");
    case "finops": return highActivity || total > 5 ? result("required", "Usage scale requires quotas, budgets, and cost attribution.") : result("recommended", "Basic usage controls prevent pilot spend from drifting.");
    default: return result("optional", ...reasons);
  }
}

export function deriveCapabilities(profile: EstateProfile): CapabilityAssessment[] {
  return CAPABILITIES.map((capability) => ({
    ...capability,
    ...requirementFor(capability.id, profile),
  }));
}

export function capabilityCounts(capabilities: CapabilityAssessment[]) {
  return capabilities.reduce(
    (counts, capability) => ({ ...counts, [capability.status]: counts[capability.status] + 1 }),
    { required: 0, recommended: 0, optional: 0 },
  );
}

export function estateSummary(profile: EstateProfile) {
  const total = profile.personal.count + profile.internal.count + profile.customer.count;
  const dominant = profile.customer.count > 0
    ? "external reliability, tenant isolation, and escalation"
    : profile.internal.count > 0
      ? "delegated access, auditability, and shared operations"
      : "seat adoption, user controls, and bounded actions";
  return { total, dominant };
}
