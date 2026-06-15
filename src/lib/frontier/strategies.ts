import type { ModelKey } from "@/lib/pricing";
import type { Tier } from "@/lib/router/tiers";
import { S1, S2, S3, S4 } from "@/lib/scenarios";
import { S4_TRACE } from "@/lib/content";
import { SHOP_S1, SHOP_S2, SHOP_S3, SHOP_S4, SHOP_S4_TRACE } from "@/lib/industries/shopos";
import { HC_S1, HC_S2, HC_S3, HC_S4, HC_S4_TRACE } from "@/lib/industries/pulseai";
import { PS_S1, PS_S2, PS_S3, PS_S4, PS_S4_TRACE } from "@/lib/industries/civicos";
import { FACT_S1, FACT_S2, FACT_S3, FACT_S4, FACT_S4_TRACE } from "@/lib/industries/factoryos";
import { SIG_S1, SIG_S2, SIG_S4, SIG_S4_TRACE } from "@/lib/industries/signalos";

export type WorkflowId = "wealthai" | "shopos" | "pulseai" | "civicos" | "factoryos" | "signalos";
export type Complexity = "low" | "med" | "high";
export type Modality = "text" | "image" | "audio";
export type WorkflowPhase = "build" | "run" | "document" | "agent";

export interface FrontierRequest {
  id: string;
  phase: WorkflowPhase;
  label: string;
  complexity: Complexity;
  modality: Modality;
  inTok: number;
  outTok: number;
  weight: number;
}

export interface FrontierWorkload {
  id: WorkflowId;
  name: string;
  industry: string;
  volumeLabel: string;
  requests: FrontierRequest[];
}

export type CapabilityState = "native" | "assembled" | "absent";
export type GovernanceCapability = "identity" | "audit" | "policy" | "observability" | "evals";

export interface FrontierStrategy {
  id: "A" | "B" | "C" | "D" | "E" | "F";
  name: string;
  shortName: string;
  description: string;
  color: string;
  qualityGate: boolean;
  route: (request: FrontierRequest) => Tier;
  governance: Record<GovernanceCapability, CapabilityState>;
}

const assembledGovernance: Record<GovernanceCapability, CapabilityState> = {
  identity: "assembled",
  audit: "assembled",
  policy: "assembled",
  observability: "assembled",
  evals: "assembled",
};

const nativeGovernance: Record<GovernanceCapability, CapabilityState> = {
  identity: "native",
  audit: "native",
  policy: "native",
  observability: "native",
  evals: "native",
};

const absentGovernance: Record<GovernanceCapability, CapabilityState> = {
  identity: "absent",
  audit: "absent",
  policy: "absent",
  observability: "absent",
  evals: "absent",
};

function hybridRoute(request: FrontierRequest): Tier {
  if (request.complexity === "high") return "opus";
  if (request.complexity === "med") return "geminiPro";
  return "flashLite";
}

export const FRONTIER_STRATEGIES: FrontierStrategy[] = [
  {
    id: "A",
    name: "Cheapest everywhere",
    shortName: "Cheapest",
    description: "Flash Lite receives every request. Lowest spend, but difficult work ships below the quality bar.",
    color: "#9AA0A6",
    qualityGate: false,
    route: () => "flashLite",
    governance: absentGovernance,
  },
  {
    id: "B",
    name: "Single frontier everywhere",
    shortName: "Opus only",
    description: "Opus receives every request. Quality is high, but routine work pays frontier-model cost and latency.",
    color: "#E37400",
    qualityGate: false,
    route: () => "opus",
    governance: assembledGovernance,
  },
  {
    id: "C",
    name: "Competitor-centric",
    shortName: "Claude stack",
    description: "Sonnet handles routine work and Opus handles complex work; platform controls are assembled separately.",
    color: "#B45309",
    qualityGate: false,
    route: (request) => request.complexity === "high" ? "opus" : "sonnet",
    governance: assembledGovernance,
  },
  {
    id: "D",
    name: "Gemini-only",
    shortName: "Gemini family",
    description: "Gemini tiers cover the workload, including native multimodal, with a quality gate inside the model family.",
    color: "#1A73E8",
    qualityGate: true,
    route: (request) => request.complexity === "low" ? "flashLite" : "flash",
    governance: assembledGovernance,
  },
  {
    id: "E",
    name: "Hybrid intelligent routing",
    shortName: "Hybrid router",
    description: "Workload-aware routing combines efficient Gemini tiers with frontier reasoning and quality evaluation.",
    color: "#34A853",
    qualityGate: true,
    route: hybridRoute,
    governance: assembledGovernance,
  },
  {
    id: "F",
    name: "GEAP-optimized",
    shortName: "GEAP",
    description: "The same efficient routing as Hybrid, with orchestration, identity, policy, audit, evals, and operations native to the platform.",
    color: "#188038",
    qualityGate: true,
    route: hybridRoute,
    governance: nativeGovernance,
  },
];

type TokenShape = { inTok: number; outTok: number };

function buildRows(
  prefix: string,
  total: number,
  parts: Array<{ label: string; complexity: Complexity; tokens: TokenShape; share: number }>,
): FrontierRequest[] {
  return parts.map((part) => ({
    id: `${prefix}-build-${part.complexity}`,
    phase: "build",
    label: part.label,
    complexity: part.complexity,
    modality: "text",
    ...part.tokens,
    weight: total * part.share,
  }));
}

function runRows(
  prefix: string,
  annualQueries: number,
  tokens: TokenShape,
  mix: { flashLitePct: number; flashPct: number; opusPct: number },
): FrontierRequest[] {
  return [
    { id: `${prefix}-run-low`, phase: "run", label: "Routine requests", complexity: "low", modality: "text", ...tokens, weight: annualQueries * mix.flashLitePct },
    { id: `${prefix}-run-med`, phase: "run", label: "Judgment requests", complexity: "med", modality: "text", ...tokens, weight: annualQueries * mix.flashPct },
    { id: `${prefix}-run-high`, phase: "run", label: "Complex requests", complexity: "high", modality: "text", ...tokens, weight: annualQueries * mix.opusPct },
  ];
}

function documentRow(
  prefix: string,
  label: string,
  weight: number,
  inTok: number,
  outTok: number,
  complexity: Complexity = "med",
  modality: Modality = "image",
): FrontierRequest {
  return { id: `${prefix}-document`, phase: "document", label, complexity, modality, inTok, outTok, weight };
}

function agentRows(
  prefix: string,
  scale: number,
  trace: Array<{ id: number; label: string; role: string; inTok: number; outTok: number }>,
): FrontierRequest[] {
  return trace.map((node) => ({
    id: `${prefix}-agent-${node.id}`,
    phase: "agent",
    label: node.label,
    complexity: node.role === "executor" ? "low" : "high",
    modality: "text",
    inTok: node.inTok,
    outTok: node.outTok,
    weight: scale,
  }));
}

const wealthBuildTotal = S1.defaults.devs * S1.tasksPerDevPerSprint * S1.defaults.sprints;
const shopBuildTotal = SHOP_S1.defaults.devs * SHOP_S1.tasksPerDevPerSprint * SHOP_S1.defaults.sprints;
const healthBuildTotal = HC_S1.defaults.devs * HC_S1.tasksPerDevPerSprint * HC_S1.defaults.sprints;
const civicBuildTotal = PS_S1.defaults.devs * PS_S1.tasksPerDevPerSprint * PS_S1.defaults.sprints;
const factoryBuildTotal = FACT_S1.defaults.devs * FACT_S1.tasksPerDevPerSprint * FACT_S1.defaults.sprints;
const signalBuildTotal = SIG_S1.defaults.devs * SIG_S1.tasksPerDevPerSprint * SIG_S1.defaults.sprints;

export const FRONTIER_WORKLOADS: Record<WorkflowId, FrontierWorkload> = {
  wealthai: {
    id: "wealthai",
    name: "WealthAI",
    industry: "Wealth management",
    volumeLabel: "Existing defaults: six-month build plus one year of run and agent activity",
    requests: [
      ...buildRows("wealth", wealthBuildTotal, [
        { label: "Routine SDLC work", complexity: "low", tokens: S1.routineTask, share: S1.defaultMix.routinePct },
        { label: "Complex SDLC work", complexity: "high", tokens: S1.complexTask, share: 1 - S1.defaultMix.routinePct },
      ]),
      ...runRows("wealth", S2.defaults.queriesPerMonth * 12, S2.query, S2.tieredMix),
      documentRow("wealth", "Statement and voice analysis", S3.defaults.interactionsPerYear, S3.visionInput, S3.analysisOut),
      ...agentRows("wealth", S4.defaults.portfoliosPerNight * S4.defaults.nightsPerYear, S4_TRACE),
    ],
  },
  shopos: {
    id: "shopos",
    name: "ShopOS",
    industry: "Retail and commerce",
    volumeLabel: "Existing defaults: six-month build plus one year of assistant, visual search, and agent activity",
    requests: [
      ...buildRows("shop", shopBuildTotal, [
        { label: "Routine commerce SDLC", complexity: "low", tokens: SHOP_S1.routineTask, share: SHOP_S1.defaultMix.routinePct },
        { label: "Integration and feature work", complexity: "med", tokens: SHOP_S1.midTask, share: SHOP_S1.defaultMix.midPct },
        { label: "Complex commerce architecture", complexity: "high", tokens: SHOP_S1.complexTask, share: SHOP_S1.defaultMix.complexPct },
      ]),
      ...runRows("shop", SHOP_S2.defaults.queriesPerMonth * 12, SHOP_S2.query, SHOP_S2.tieredMix),
      documentRow("shop", "Visual product search", SHOP_S3.defaults.interactionsPerYear, SHOP_S3.visionInput, SHOP_S3.analysisOut),
      ...agentRows("shop", SHOP_S4.defaults.skusPerNight * SHOP_S4.defaults.nightsPerYear, SHOP_S4_TRACE),
    ],
  },
  pulseai: {
    id: "pulseai",
    name: "PulseAI",
    industry: "Healthcare",
    volumeLabel: "Existing defaults: six-month build plus one year of clinical assistant, document, and agent activity",
    requests: [
      ...buildRows("health", healthBuildTotal, [
        { label: "Routine healthcare SDLC", complexity: "low", tokens: HC_S1.routineTask, share: HC_S1.defaultMix.routinePct },
        { label: "Clinical and compliance logic", complexity: "high", tokens: HC_S1.complexTask, share: HC_S1.defaultMix.complexPct },
      ]),
      ...runRows("health", HC_S2.defaults.queriesPerMonth * 12, HC_S2.query, HC_S2.tieredMix),
      documentRow("health", "Clinical document analysis", HC_S3.defaults.interactionsPerYear, HC_S3.visionInput, HC_S3.analysisOut, "high"),
      ...agentRows("health", HC_S4.defaults.patientsPerNight * HC_S4.defaults.nightsPerYear, HC_S4_TRACE),
    ],
  },
  civicos: {
    id: "civicos",
    name: "CivicOS",
    industry: "Public sector",
    volumeLabel: "Existing defaults: six-month build plus one year of citizen, document, and agent activity",
    requests: [
      ...buildRows("civic", civicBuildTotal, [
        { label: "Routine government SDLC", complexity: "low", tokens: PS_S1.routineTask, share: PS_S1.defaultMix.routinePct },
        { label: "Integration and migration work", complexity: "med", tokens: PS_S1.midTask, share: PS_S1.defaultMix.midPct },
        { label: "Policy and compliance architecture", complexity: "high", tokens: PS_S1.complexTask, share: PS_S1.defaultMix.complexPct },
      ]),
      ...runRows("civic", PS_S2.defaults.queriesPerMonth * 12, PS_S2.query, PS_S2.tieredMix),
      documentRow("civic", "Government document analysis", PS_S3.defaults.documentsPerYear, PS_S3.visionInput, PS_S3.analysisOut, "high"),
      ...agentRows("civic", PS_S4.defaults.contractsPerRun * PS_S4.defaults.runsPerYear, PS_S4_TRACE),
    ],
  },
  factoryos: {
    id: "factoryos",
    name: "FactoryOS",
    industry: "Manufacturing",
    volumeLabel: "Existing defaults: six-month build plus one year of operations, inspection, and agent activity",
    requests: [
      ...buildRows("factory", factoryBuildTotal, [
        { label: "Routine factory SDLC", complexity: "low", tokens: FACT_S1.routineTask, share: FACT_S1.defaultMix.flashLitePct },
        { label: "Industrial integration work", complexity: "med", tokens: FACT_S1.midTask, share: FACT_S1.defaultMix.flashPct },
        { label: "Safety-critical architecture", complexity: "high", tokens: FACT_S1.complexTask, share: FACT_S1.defaultMix.opusPct },
      ]),
      ...runRows("factory", FACT_S2.defaults.queriesPerMonth * 12, FACT_S2.query, FACT_S2.tieredMix),
      documentRow("factory", "Visual quality inspection", FACT_S3.defaults.inspectionsPerYear, FACT_S3.visionInput, FACT_S3.analysisOut, "high"),
      ...agentRows("factory", FACT_S4.defaults.machinesPerRun * FACT_S4.defaults.runsPerYear, FACT_S4_TRACE),
    ],
  },
  signalos: {
    id: "signalos",
    name: "SignalOS",
    industry: "Telecommunications",
    volumeLabel: "Existing defaults: six-month build plus one year of support, contracts, and network-agent activity",
    requests: [
      ...buildRows("signal", signalBuildTotal, [
        { label: "Routine telecom SDLC", complexity: "low", tokens: SIG_S1.routineTask, share: SIG_S1.defaultMix.flashLitePct },
        { label: "Network integration work", complexity: "med", tokens: SIG_S1.midTask, share: SIG_S1.defaultMix.flashPct },
        { label: "Network and regulatory architecture", complexity: "high", tokens: SIG_S1.complexTask, share: SIG_S1.defaultMix.opusPct },
      ]),
      ...runRows("signal", SIG_S2.defaults.queriesPerMonth * 12, SIG_S2.query, SIG_S2.tieredMix),
      documentRow("signal", "Enterprise contract analysis", 200, 80_000, 4_000, "high", "text"),
      ...agentRows("signal", SIG_S4.defaults.sitesPerRun * SIG_S4.defaults.runsPerDay * SIG_S4.defaults.daysPerYear, SIG_S4_TRACE),
    ],
  },
};

export function isTier(model: ModelKey): model is Tier {
  return model === "flashLite" || model === "flash" || model === "geminiPro" || model === "sonnet" || model === "opus";
}
