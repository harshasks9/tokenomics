import type { Approach, CapabilityAssessment, OwnershipState } from "./types";

export const APPROACHES: Approach[] = ["geap", "claude", "openai"];

export const APPROACH_META: Record<Approach, {
  name: string;
  shortName: string;
  color: string;
  pale: string;
  description: string;
  tradeoff: string;
}> = {
  geap: {
    name: "Gemini Enterprise Agent Platform",
    shortName: "GEAP",
    color: "#1A73E8",
    pale: "#E8F0FE",
    description: "Integrated models, runtime, context, governance, evaluation, and operations on one platform.",
    tradeoff: "Lower assembly effort, with platform concentration, metered services, and switching cost.",
  },
  claude: {
    name: "Claude-centered assembled stack",
    shortName: "Claude + stack",
    color: "#B45309",
    pale: "#FFF7ED",
    description: "Anthropic model and agent components combined with cloud runtime and enterprise tooling.",
    tradeoff: "Strong model and SDK capabilities; customer owns more architecture, integration, and operations.",
  },
  openai: {
    name: "OpenAI API-centered assembled stack",
    shortName: "OpenAI + stack",
    color: "#0F766E",
    pale: "#F0FDFA",
    description: "OpenAI API and Agents components combined with cloud runtime and enterprise tooling.",
    tradeoff: "Broad first-party agent building blocks; production platform ownership remains with the customer unless Frontier is contracted.",
  },
};

const GEAP_PLATFORM = new Set([
  "models", "routing", "orchestration", "a2a", "connectors", "grounding", "sessions", "memory",
  "runtime", "scaling", "sandbox", "release", "identity", "authorization", "policy", "audit",
  "evals", "observability", "registry", "finops",
]);
const CLAUDE_FIRST = new Set(["models", "orchestration", "tools", "sandbox"]);
const OPENAI_FIRST = new Set(["models", "routing", "orchestration", "tools", "sessions", "evals"]);
const HYPERSCALER = new Set(["runtime", "scaling", "sessions", "memory", "release", "identity", "audit", "observability"]);
const THIRD_PARTY = new Set(["connectors", "grounding", "policy", "evals", "observability", "registry", "finops"]);
const ACCURACY_CONTROL_IDS = new Set([
  "routing", "grounding", "sessions", "memory", "release", "identity", "authorization",
  "policy", "audit", "evals", "observability",
]);

export function ownershipFor(approach: Approach, capabilityId: string): OwnershipState {
  if (approach === "geap") {
    if (capabilityId === "approval" || capabilityId === "incident") return "Customer build/integration";
    return GEAP_PLATFORM.has(capabilityId) ? "Platform-provided" : "First-party component";
  }

  if (approach === "claude" && CLAUDE_FIRST.has(capabilityId)) return "First-party component";
  if (approach === "openai" && OPENAI_FIRST.has(capabilityId)) return "First-party component";
  if (HYPERSCALER.has(capabilityId)) return "Hyperscaler service";
  if (THIRD_PARTY.has(capabilityId)) return "Third-party product";
  return "Customer build/integration";
}

export function stackSummary(approach: Approach, capabilities: CapabilityAssessment[]) {
  const inScope = capabilities.filter((capability) => capability.status !== "optional");
  const ownership = inScope.map((capability) => ownershipFor(approach, capability.id));
  const platformProvided = ownership.filter((state) => state === "Platform-provided" || state === "First-party component").length;
  const integrationBoundaries = ownership.filter((state) => state === "Customer build/integration").length
    + new Set(ownership.filter((state) => state === "Hyperscaler service" || state === "Third-party product")).size;
  const vendors = approach === "geap"
    ? 1
    : 1 + Number(ownership.includes("Hyperscaler service")) + Number(ownership.includes("Third-party product"));
  const operatingTeams = approach === "geap" ? 2 : Math.min(5, 2 + vendors + Number(integrationBoundaries > 5));
  return { platformProvided, integrationBoundaries, vendors, operatingTeams, total: inScope.length };
}

export function accuracyControlSummary(approach: Approach, capabilities: CapabilityAssessment[]) {
  const controls = capabilities.filter(
    (capability) => capability.status !== "optional" && ACCURACY_CONTROL_IDS.has(capability.id),
  );
  const integrated = controls.filter((capability) => {
    const ownership = ownershipFor(approach, capability.id);
    return ownership === "Platform-provided" || ownership === "First-party component";
  }).length;

  return {
    total: controls.length,
    integrated,
    assemble: controls.length - integrated,
  };
}
