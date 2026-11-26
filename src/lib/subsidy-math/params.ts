import raw from "./params.json";
import type { Incentive, Lifetime, RouteId, RouteParams, Structure } from "./model";

export interface ParamMeta { base: number; low: number; high: number; basis: "D" | "R" | "A" | "C"; note: string }

type RawRoute = { label: string; short: string; structure: string; params: Record<string, ParamMeta> };
const routes = raw.routes as unknown as Record<RouteId, RawRoute>;

export const ROUTE_IDS: RouteId[] = ["bedrock-claude", "azure-openai", "vertex-gemini", "vertex-claude"];

export const ROUTE_META: Record<RouteId, { label: string; short: string; structure: Structure; cloud: string; model: string; color: string }> = {
  "bedrock-claude": { label: routes["bedrock-claude"].label, short: routes["bedrock-claude"].short, structure: "agent", cloud: "AWS", model: "Claude", color: "var(--aws)" },
  "azure-openai": { label: routes["azure-openai"].label, short: routes["azure-openai"].short, structure: "principal", cloud: "Microsoft", model: "OpenAI", color: "var(--msft)" },
  "vertex-gemini": { label: routes["vertex-gemini"].label, short: routes["vertex-gemini"].short, structure: "principal", cloud: "Google", model: "Gemini", color: "var(--google)" },
  "vertex-claude": { label: routes["vertex-claude"].label, short: routes["vertex-claude"].short, structure: "agent", cloud: "Google", model: "Claude", color: "var(--google)" },
};

export function routeMeta(id: RouteId, key: keyof RouteParams): ParamMeta | undefined {
  return routes[id].params[key as string];
}

export function baseRoute(id: RouteId, pick: "base" | "low" | "high" = "base"): RouteParams {
  const p = routes[id].params;
  const v = (k: string) => p[k][pick];
  return {
    structure: routes[id].structure as Structure,
    customerDiscount: v("customerDiscount"),
    discountFundedByProvider: v("discountFundedByProvider"),
    channelFee: v("channelFee"),
    providerServingCost: v("providerServingCost"),
    hostedShare: v("hostedShare"),
    incrementalComputeShare: v("incrementalComputeShare"),
    computeMargin: v("computeMargin"),
    revenueShare: v("revenueShare"),
    infraCost: v("infraCost"),
    utilization: p.utilization.base,
    baseUtilization: p.baseUtilization.base,
    modelDevCost: v("modelDevCost"),
    distributionCost: v("distributionCost"),
  };
}

const inc = raw.incentive as Record<string, ParamMeta>;
const lt = raw.lifetime as Record<string, ParamMeta>;
const eq = raw.equity as Record<string, ParamMeta>;

export const INCENTIVE_META = inc;
export const LIFETIME_META = lt;
export const EQUITY_META = eq;

export const BASE_INCENTIVE: Incentive = { pct: inc.pct.base, type: "one-time", partnerFunded: inc.partnerFunded.base, providerFunded: inc.providerFunded.base };

export const BASE_LIFETIME: Lifetime = {
  years: lt.years.base,
  growth: lt.growth.base,
  retention: lt.retention.base,
  priceDeflation: lt.priceDeflation.base,
  efficiencyGain: lt.efficiencyGain.base,
  channelFeeDrift: lt.channelFeeDrift.base,
  adjacencyAttach: lt.adjacencyAttach.base,
  adjacencyIncremental: lt.adjacencyIncremental.base,
  adjacencyMargin: lt.adjacencyMargin.base,
  commitAdjacencyUplift: lt.commitAdjacencyUplift.base,
  commitYears: lt.commitYears.base,
  baselineShare: lt.baselineShare.base,
  discountRate: lt.discountRate.base,
  includeAdjacency: lt.includeAdjacency.base === 1,
};

export const BASE_EQUITY = { stake: eq.stake.base, revenueMultiple: eq.revenueMultiple.base, incrementalToProvider: eq.incrementalToProvider.base };
