import { callCost } from "../pricing";

/**
 * GE for Citizen — $2-per-citizen-per-year unit economics.
 *
 * Every default here is an editable, illustrative assumption. None of it is
 * project data: the reference deployment brief does not publish usage or
 * per-interaction cost, and its commercial terms are confidential.
 *
 * Pricing convention: the government pays per *covered* citizen (everyone the
 * contract makes eligible), not per active citizen. Delivery cost is driven by
 * *usage*. That gap is the whole model — and its main risk.
 */

export type ServiceClass = "inform" | "prepare" | "act";

export const SERVICE_CLASS_LABEL: Record<ServiceClass, string> = {
  inform: "Inform",
  prepare: "Prepare",
  act: "Act (verified)",
};

/**
 * Default cost per interaction (one completed citizen task session, which may
 * span several turns), derived from repo list prices in `@/lib/pricing` plus a
 * flat allowance for retrieval, grounding, tool calls and logging.
 */
export const COST_BASIS: Record<
  ServiceClass,
  { model: "flash" | "flashLite"; inTok: number; outTok: number; overhead: number; note: string }
> = {
  inform: {
    model: "flashLite",
    inTok: 6_000,
    outTok: 500,
    overhead: 0.001,
    note: "Grounded answer from official content — Flash-Lite, ~6K in / 500 out tokens",
  },
  prepare: {
    model: "flash",
    inTok: 18_000,
    outTok: 1_800,
    overhead: 0.003,
    note: "Multi-turn eligibility check or form pre-fill — Flash, ~18K in / 1.8K out tokens",
  },
  act: {
    model: "flash",
    inTok: 14_000,
    outTok: 1_200,
    overhead: 0.006,
    note: "Verified transaction with API calls, confirmation and audit write — Flash, ~14K in / 1.2K out",
  },
};

export const defaultInteractionCost = (c: ServiceClass): number => {
  const b = COST_BASIS[c];
  return callCost(b.model, b.inTok, b.outTok) + b.overhead;
};

export interface EconInputs {
  /** Citizens covered by the contract. */
  population: number;
  /** Share of covered citizens who activate during the year (0–1). */
  activation: number;
  /** Share of activated citizens active in a typical month (0–1). */
  monthlyActive: number;
  /** Task sessions per monthly-active citizen per month. */
  interactions: number;
  /** Hard per-citizen monthly cap on interactions (pooled-quota guardrail). 0 = no cap. */
  cap: number;
  /** Service mix, shares summing to 1. */
  mix: Record<ServiceClass, number>;
  /** Delivery cost per interaction by class, USD. */
  cost: Record<ServiceClass, number>;
  /** Fixed annual run cost: support desk, monitoring, content upkeep, success team. */
  opsAnnual: number;
  /** One-time integration & setup (identity, service APIs, payments, consent ledger). */
  integration: number;
  /** Years over which setup is spread when shown per citizen. */
  contractYears: number;
  /** Headline annual price per covered citizen. */
  price: number;
  /** Government-side value: share of prepare/act sessions that replace an assisted contact. */
  contactSubstitution: number;
  /** Government-side value: fully loaded cost of one assisted contact (call, counter visit). */
  costPerContact: number;
}

export const DEFAULT_INPUTS: EconInputs = {
  population: 1_000_000,
  activation: 0.35,
  monthlyActive: 0.4,
  interactions: 5,
  cap: 60,
  mix: { inform: 0.6, prepare: 0.3, act: 0.1 },
  cost: {
    inform: round4(defaultInteractionCost("inform")),
    prepare: round4(defaultInteractionCost("prepare")),
    act: round4(defaultInteractionCost("act")),
  },
  opsAnnual: 250_000,
  integration: 600_000,
  contractYears: 3,
  price: 2,
  contactSubstitution: 0.25,
  costPerContact: 5,
};

function round4(v: number) {
  return Math.round(v * 10_000) / 10_000;
}

export type FlagLevel = "fail" | "warn" | "ok";
export interface Flag {
  level: FlagLevel;
  title: string;
  detail: string;
}

export interface EconOutputs {
  revenue: number;
  activated: number;
  avgMonthlyActive: number;
  effInteractions: number;
  annualInteractions: number;
  blendedCost: number;
  variableCost: number;
  runCost: number;
  contribution: number;
  margin: number;
  costPerActive: number;
  revenuePerActive: number;
  costPerCovered: number;
  /** Interactions per monthly-active citizen per month at which contribution hits zero. */
  breakEvenInteractions: number;
  setupPerCitizenPerYear: number;
  yearOneAllInPerCitizen: number;
  /** Years of contribution needed to recover setup if the vendor absorbs it. */
  setupPaybackYears: number;
  avoidedContacts: number;
  avoidedContactValue: number;
  flags: Flag[];
}

export function normalizeMix(mix: Record<ServiceClass, number>): Record<ServiceClass, number> {
  const sum = mix.inform + mix.prepare + mix.act;
  if (sum <= 0) return { inform: 1, prepare: 0, act: 0 };
  return { inform: mix.inform / sum, prepare: mix.prepare / sum, act: mix.act / sum };
}

export function compute(i: EconInputs): EconOutputs {
  const mix = normalizeMix(i.mix);
  const revenue = i.population * i.price;
  const activated = i.population * i.activation;
  const avgMonthlyActive = activated * i.monthlyActive;
  const effInteractions = i.cap > 0 ? Math.min(i.interactions, i.cap) : i.interactions;
  const annualInteractions = avgMonthlyActive * effInteractions * 12;
  const blendedCost = mix.inform * i.cost.inform + mix.prepare * i.cost.prepare + mix.act * i.cost.act;
  const variableCost = annualInteractions * blendedCost;
  const runCost = variableCost + i.opsAnnual;
  const contribution = revenue - runCost;
  const margin = revenue > 0 ? contribution / revenue : 0;
  const costPerActive = activated > 0 ? runCost / activated : 0;
  const revenuePerActive = activated > 0 ? revenue / activated : 0;
  const costPerCovered = i.population > 0 ? runCost / i.population : 0;
  const perInteractionYear = avgMonthlyActive * 12 * blendedCost;
  const breakEvenInteractions = perInteractionYear > 0 ? Math.max(0, (revenue - i.opsAnnual) / perInteractionYear) : Infinity;
  const setupPerCitizenPerYear = i.population > 0 ? i.integration / i.population / Math.max(1, i.contractYears) : 0;
  const yearOneAllInPerCitizen = i.population > 0 ? i.price + i.integration / i.population : 0;
  const setupPaybackYears = contribution > 0 ? i.integration / contribution : Infinity;
  const avoidedContacts = annualInteractions * (mix.prepare + mix.act) * i.contactSubstitution;
  const avoidedContactValue = avoidedContacts * i.costPerContact;

  const flags: Flag[] = [];
  if (contribution < 0) {
    flags.push({
      level: "fail",
      title: "The model does not work at this price",
      detail: `Delivery costs exceed revenue. Break-even is ${fmtInt(breakEvenInteractions)} sessions per active citizen per month; raise the price, lower the per-interaction cost, or tighten the usage cap.`,
    });
  } else if (margin < 0.2) {
    flags.push({
      level: "warn",
      title: "Thin margin",
      detail: "Contribution is under 20% of revenue — one heavy-usage quarter or a model price change could turn it negative.",
    });
  }
  if (i.activation < 0.1) {
    flags.push({
      level: "warn",
      title: "Low activation undermines the case",
      detail: `Only ${(i.activation * 100).toFixed(0)}% of covered citizens use it. Margins look good, but the government is paying ${fmtMoney(revenuePerActive)} per actual user — a hard renewal conversation.`,
    });
  }
  if (i.population > 0 && i.integration / i.population > i.price) {
    flags.push({
      level: "warn",
      title: "Setup outweighs a year of subscription",
      detail: `One-time setup is ${fmtMoney(i.integration / i.population)} per covered citizen — more than the $${i.price.toFixed(2)} annual price. Fund integration separately or narrow the pilot scope.`,
    });
  }
  if (revenue > 0 && i.opsAnnual / revenue > 0.5) {
    flags.push({
      level: "warn",
      title: "Fixed costs dominate",
      detail: "Fixed run costs exceed half of revenue — the covered population is too small for a per-citizen price. Consider a platform fee or a consortium of municipalities.",
    });
  }
  if (i.cap === 0) {
    flags.push({
      level: "warn",
      title: "No usage cap",
      detail: "Without a per-citizen cap, a small group of heavy users or automated scripts can consume the budget. Set hard caps and alerting.",
    });
  }
  if (flags.length === 0) {
    flags.push({
      level: "ok",
      title: "The model holds under these assumptions",
      detail: `Usage could rise to about ${fmtInt(breakEvenInteractions)} sessions per active citizen per month before contribution reaches zero.`,
    });
  }

  return {
    revenue,
    activated,
    avgMonthlyActive,
    effInteractions,
    annualInteractions,
    blendedCost,
    variableCost,
    runCost,
    contribution,
    margin,
    costPerActive,
    revenuePerActive,
    costPerCovered,
    breakEvenInteractions,
    setupPerCitizenPerYear,
    yearOneAllInPerCitizen,
    setupPaybackYears,
    avoidedContacts,
    avoidedContactValue,
    flags,
  };
}

/** Heavy-usage sensitivity: multiply interactions per active citizen (cap still applies). */
export const USAGE_MULTIPLIERS = [1, 2, 4, 8, 16] as const;

export function sensitivity(i: EconInputs) {
  return USAGE_MULTIPLIERS.map((m) => {
    const o = compute({ ...i, interactions: i.interactions * m });
    return { multiplier: m, interactions: o.effInteractions, contribution: o.contribution, margin: o.margin };
  });
}

export const PRESETS: { id: string; label: string; note: string; patch: Partial<EconInputs> }[] = [
  { id: "base", label: "Base case", note: "Default assumptions", patch: {} },
  {
    id: "light",
    label: "Low adoption",
    note: "15% activate, 25% monthly active, 3 sessions",
    patch: { activation: 0.15, monthlyActive: 0.25, interactions: 3 },
  },
  {
    id: "heavy",
    label: "Heavy usage",
    note: "80% activate, 70% monthly active, 20 sessions, more transactions",
    patch: { activation: 0.8, monthlyActive: 0.7, interactions: 20, mix: { inform: 0.4, prepare: 0.35, act: 0.25 } },
  },
  {
    id: "town",
    label: "Small town",
    note: "60K residents, same fixed costs",
    patch: { population: 60_000 },
  },
];

export function fmtMoney(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const s = v < 0 ? "−" : "";
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${s}$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `${s}$${(a / 1_000).toFixed(0)}K`;
  if (a >= 1_000) return `${s}$${(a / 1_000).toFixed(1)}K`;
  if (a >= 0.1) return `${s}$${a.toFixed(2)}`;
  return `${s}$${a.toFixed(4)}`;
}

export function fmtInt(v: number): string {
  if (!Number.isFinite(v)) return "∞";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000) return `${(v / 1_000).toFixed(0)}K`;
  return Math.round(v).toLocaleString("en-US");
}
