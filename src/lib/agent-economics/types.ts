export type AgentClass = "personal" | "internal" | "customer";
export type Complexity = "assist" | "act" | "orchestrate";
export type Sensitivity = "standard" | "sensitive" | "regulated";
export type Activity = "low" | "moderate" | "high";
export type Requirement = "required" | "recommended" | "optional";
export type CapabilityLayer = "Intelligence" | "Context & action" | "Runtime" | "Trust" | "Operations";
export type CostDriver = "seats" | "usage" | "runtime" | "storage" | "licenses" | "engineering" | "operations";

export interface AgentClassProfile {
  count: number;
  complexity: Complexity;
}

export interface EstateProfile {
  personal: AgentClassProfile;
  internal: AgentClassProfile;
  customer: AgentClassProfile;
  sensitivity: Sensitivity;
  activity: Activity;
}

export interface CapabilityDefinition {
  id: string;
  layer: CapabilityLayer;
  name: string;
  shortName: string;
  customerOutcome: string;
  example: string;
  reuse: "shared" | "per-agent";
  driver: CostDriver;
}

export interface CapabilityAssessment extends CapabilityDefinition {
  status: Requirement;
  reasons: string[];
}

export type Approach = "geap" | "claude" | "openai";
export type OwnershipState =
  | "Platform-provided"
  | "First-party component"
  | "Hyperscaler service"
  | "Third-party product"
  | "Customer build/integration"
  | "Quote required";

export type CostBucket =
  | "Model inference"
  | "Agent platform & runtime"
  | "Hyperscaler infrastructure"
  | "External products & licenses"
  | "Initial build & integration"
  | "Ongoing governance & operations";

export interface EconomicAssumptions {
  engineeringRateK: number;
  existingToolCredit: number;
  discounts: Record<Approach, number>;
}

export interface CostLine {
  bucket: CostBucket;
  label: string;
  quantity: number;
  unit: string;
  rateK: number;
  annual: boolean;
  amountK: number;
  status: "VERIFIED" | "ASSUMPTION" | "QUOTE REQUIRED";
  formula: string;
}

export interface ApproachEconomics {
  approach: Approach;
  lines: CostLine[];
  yearOneK: number;
  threeYearK: number;
  range: { lowK: number; baseK: number; highK: number };
  weeksToProduction: number;
  vendors: number;
  integrationBoundaries: number;
  operatingTeams: number;
}

export interface DecisionBrief {
  winner: Approach;
  runnerUp: Approach;
  headline: string;
  rationale: string;
  economicDriver: string;
  architectureDriver: string;
  tradeoff: string;
  flipConditions: string[];
}
