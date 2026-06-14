// Enterprise capabilities taxonomy — functions needed beyond the model call.
// Entitlement legend (use exactly):
//   "seat"     = included in a paid seat entitlement
//   "metered"  = separately metered cloud service
//   "config"   = customer configuration (no extra license)
//   "custom"   = partner or custom build required
//   "license"  = separate product license required

export type Pillar = "Build" | "Scale" | "Govern" | "Optimize";
export type Reuse  = "shared" | "per-agent";
export type Entitlement = "seat" | "metered" | "config" | "custom" | "license" | "seat+config" | "metered+config" | "seat+metered";

export interface Capability {
  id: string;
  pillar: Pillar;
  fn: string;
  essential: boolean;
  reuse: Reuse;
  /** How each approach provides this capability */
  gep: Entitlement;          // Google Enterprise Agent Platform
  directApi: Entitlement;    // Direct model APIs
  internalPlatform: Entitlement;  // Customer-built internal platform
  bestOfBreed: Entitlement;  // Best-of-breed commercial/OSS assembly
  evidenceTag: "VERIFIED" | "ASSUMPTION" | "UNCONFIRMED";
  note: string;
}

export const CAPABILITIES: Capability[] = [
  // ── Build ──────────────────────────────────────────────────────────────
  {
    id: "agentDev",
    pillar: "Build",
    fn: "Agent development & orchestration",
    essential: false,
    reuse: "per-agent",
    gep: "seat+config",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "ASSUMPTION",
    note: "Every approach requires agent orchestration logic; the question is whether a framework is shared or rebuilt per agent.",
  },
  {
    id: "connectors",
    pillar: "Build",
    fn: "Enterprise data & app connectors",
    essential: false,
    reuse: "shared",
    gep: "metered",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "VERIFIED",
    note: "GEAP pre-built connectors billed as metered grounding ($2.50–$45/1K). Custom connectors are engineering work in other approaches.",
  },
  {
    id: "grounding",
    pillar: "Build",
    fn: "Grounding & enterprise search",
    essential: false,
    reuse: "shared",
    gep: "metered",
    directApi: "license",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "VERIFIED",
    note: "Vector/grounding: Pinecone Enterprise $5–15K+/mo. GEAP charges per-query ($2.50–$45/1K depending on source).",
  },
  {
    id: "tools",
    pillar: "Build",
    fn: "Tool & API integration",
    essential: false,
    reuse: "per-agent",
    gep: "config",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "config",
    evidenceTag: "ASSUMPTION",
    note: "Every approach requires per-agent tool wiring. GEAP reduces this via pre-built tool schemas.",
  },
  {
    id: "modelChoice",
    pillar: "Build",
    fn: "Multi-model choice & routing",
    essential: false,
    reuse: "shared",
    gep: "metered",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "ASSUMPTION",
    note: "Model routing (Flash-Lite→Flash→Opus) is a key cost lever; building a shared gateway is an engineering investment in non-GEP approaches.",
  },
  {
    id: "memory",
    pillar: "Build",
    fn: "Memory & context management",
    essential: false,
    reuse: "per-agent",
    gep: "metered",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "VERIFIED",
    note: "GEAP Memory Bank separately billed since Feb 2026. External vector stores are licensed separately in other approaches.",
  },
  // ── Scale ──────────────────────────────────────────────────────────────
  {
    id: "runtime",
    pillar: "Scale",
    fn: "Managed runtime for long-running agents",
    essential: true,
    reuse: "shared",
    gep: "metered",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "custom",
    evidenceTag: "VERIFIED",
    note: "GEAP Agent Runtime: vCPU-hr + GiB-hr, idle unbilled, monthly free tier. Custom runtimes (K8s, Lambda) require significant engineering.",
  },
  {
    id: "catalog",
    pillar: "Scale",
    fn: "Agent catalog, discovery & reuse",
    essential: false,
    reuse: "shared",
    gep: "metered",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "custom",
    evidenceTag: "VERIFIED",
    note: "GEAP Skill Registry billing since Jul 2026. Without a catalog, agents are siloed and can't be discovered or reused across teams.",
  },
  // ── Govern ─────────────────────────────────────────────────────────────
  {
    id: "identity",
    pillar: "Govern",
    fn: "Agent identity & access control",
    essential: true,
    reuse: "shared",
    gep: "seat+config",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "ASSUMPTION",
    note: "Agents acting on behalf of users need scoped identities and delegated access controls. This is an essential governance function for any production deployment.",
  },
  {
    id: "policy",
    pillar: "Govern",
    fn: "Security, policy & compliance",
    essential: true,
    reuse: "shared",
    gep: "metered+config",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "ASSUMPTION",
    note: "Content safety, guardrails, and policy enforcement are required for any production agent that can take real actions. GEAP includes pre-wired controls; others require custom integration (Lakera, Portkey, etc.).",
  },
  {
    id: "audit",
    pillar: "Govern",
    fn: "Audit of agent actions",
    essential: true,
    reuse: "shared",
    gep: "metered",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "ASSUMPTION",
    note: "Regulated enterprises require a tamper-proof log of agent actions for compliance. GEAP routes through Cloud Logging. Custom builds require audit sinks to be wired per agent.",
  },
  // ── Optimize ───────────────────────────────────────────────────────────
  {
    id: "eval",
    pillar: "Optimize",
    fn: "Evaluation, testing & safety",
    essential: true,
    reuse: "per-agent",
    gep: "metered",
    directApi: "custom",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "ASSUMPTION",
    note: "Every production agent needs an evaluation harness (quality, safety, regression). GEAP provides this as a metered service; best-of-breed requires Braintrust/LangSmith/custom; internal platform must build it.",
  },
  {
    id: "observability",
    pillar: "Optimize",
    fn: "Observability & tracing",
    essential: true,
    reuse: "shared",
    gep: "metered",
    directApi: "license",
    internalPlatform: "custom",
    bestOfBreed: "license",
    evidenceTag: "VERIFIED",
    note: "LLM observability: Langfuse Enterprise $2,499/mo; Datadog LLM Observability $500–$3K+/mo. GEAP uses Cloud Trace + Cloud Monitoring (metered). No single OSS tool spans traces + infra + eval + governance without integration work.",
  },
] as const;

export const PILLARS: Pillar[] = ["Build", "Scale", "Govern", "Optimize"];

export const ESSENTIAL_COUNT = CAPABILITIES.filter((c) => c.essential).length;
