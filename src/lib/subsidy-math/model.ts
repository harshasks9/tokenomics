/**
 * Subsidy Math — the economic engine.
 *
 * Unit of analysis: $100 of list-price (rate-card) frontier-model inference that an
 * enterprise consumes in year 1. Every formula here is mirrored cell-for-cell in the
 * Excel workbook (public/subsidy-math/subsidy-math-model.xlsx, built by
 * scripts/subsidy-math/build_model.py); src/lib/subsidy-math/model.test.ts checks
 * the two agree.
 *
 * Two transaction structures, which is the forensic heart of the analysis:
 *  - "agent":     the model provider is principal to the customer and sets the price;
 *                 the cloud collects the money and keeps a distribution (channel) fee.
 *                 Anthropic's S-1/A (p. F-22) says this is how Claude is sold through
 *                 AWS, Google Cloud and Microsoft marketplaces.
 *  - "principal": the cloud sells its own service, books the revenue, pays the
 *                 serving infrastructure and (for a licensed model) a revenue share.
 *                 Azure OpenAI Service and Gemini on Vertex AI work this way.
 */

export type Structure = "agent" | "principal";
export type RouteId = "bedrock-claude" | "azure-openai" | "vertex-gemini" | "vertex-claude";
export type IncentiveType = "one-time" | "recurring" | "consumption" | "commit";

export interface RouteParams {
  structure: Structure;
  /** Negotiated recurring discount off list, fraction. */
  customerDiscount: number;
  /** Agent routes: share of the negotiated discount funded by the model provider. */
  discountFundedByProvider: number;
  /** Agent routes: share of the provider's price the cloud keeps as a distribution fee. */
  channelFee: number;
  /** Agent routes: provider's serving compute as a share of its revenue. */
  providerServingCost: number;
  /** Agent routes: share of that serving compute hosted on this cloud. */
  hostedShare: number;
  /** Agent routes: share of that compute that is incremental to the provider's existing take-or-pay commitment. */
  incrementalComputeShare: number;
  /** Agent routes: the cloud's margin on AI compute it sells. */
  computeMargin: number;
  /** Principal routes: revenue share paid to the model's owner, fraction of the cloud's net revenue. */
  revenueShare: number;
  /** Principal routes: serving infrastructure cost per $ of list price at base utilization. */
  infraCost: number;
  /** Principal routes: utilization actually achieved vs the base assumption. */
  utilization: number;
  baseUtilization: number;
  /** Principal routes: model development (training, research) amortized per $ of net revenue — economic view only. */
  modelDevCost: number;
  /** Support, platform, account-team and partner cost to distribute, fraction of list. */
  distributionCost: number;
}

export interface Incentive {
  /** Incentive size, fraction of list spend (of year 1 for one-time/commit; of each year for recurring; of incremental spend for consumption). */
  pct: number;
  type: IncentiveType;
  /** Share of the incentive funded by a partner (SI, reseller). */
  partnerFunded: number;
  /** Share of the incentive funded by the model provider. */
  providerFunded: number;
}

export interface Lifetime {
  years: number;
  /** Annual growth of the customer's list-price AI spend (already net of price cuts). */
  growth: number;
  /** Probability the customer stays each year. */
  retention: number;
  /** Annual fall in list price per unit of capability. */
  priceDeflation: number;
  /** Annual fall in serving cost per unit (hardware + software efficiency). */
  efficiencyGain: number;
  /** Agent routes: annual change in the channel fee, in fraction points (negative = provider renegotiates it down). */
  channelFeeDrift: number;
  /** Non-AI cloud revenue (storage, database, networking, security) attached per $1 of AI list spend. */
  adjacencyAttach: number;
  /** Share of that adjacent revenue that is genuinely incremental (would not exist without the AI win). */
  adjacencyIncremental: number;
  /** Gross margin on adjacent cloud services. */
  adjacencyMargin: number;
  /** Commit-conditional incentives: extra committed adjacent revenue per $1 of AI spend during the commit term. */
  commitAdjacencyUplift: number;
  commitYears: number;
  /** Consumption incentives: pre-existing spend that does not earn credits, as a share of year-1 spend. */
  baselineShare: number;
  discountRate: number;
  includeAdjacency: boolean;
}

export const LIST = 100;

export interface Waterfall {
  list: number;
  discountProvider: number;
  discountCloud: number;
  creditsCloud: number;
  creditsProvider: number;
  creditsPartner: number;
  customerPays: number;
  /** Revenue the model provider recognizes (agent) or receives as revenue share (principal). */
  providerRevenue: number;
  /** What the cloud keeps from the transaction before its own costs (agent: fee less cloud-funded incentives; principal: net revenue). */
  cloudNetRevenue: number;
  revenueSharePaid: number;
  infra: number;
  infraDepreciation: number;
  infraPower: number;
  infraNetwork: number;
  distribution: number;
  computeContribution: number;
  /** The cloud's contribution from this $100. */
  cloudContribution: number;
  /** After amortized model development (principal, first-party only). */
  cloudEconomic: number;
  providerServing: number;
  channelFeePaid: number;
  /** Provider's margin before research and development. */
  providerContribution: number;
}

/** Infra cost split used for display; shares of serving infrastructure cost. */
export const INFRA_SPLIT = { depreciation: 0.62, power: 0.13, network: 0.25 } as const;

/** Year-1 waterfall for $100 of list consumption. `costScale` scales serving-cost ratios (used by the multi-year engine). */
export function waterfall(p: RouteParams, inc: Pick<Incentive, "pct" | "partnerFunded" | "providerFunded">, opts: { costScale?: number; feeShift?: number } = {}): Waterfall {
  const L = LIST;
  const costScale = opts.costScale ?? 1;
  const c = inc.pct;
  const cloudShare = 1 - inc.partnerFunded - inc.providerFunded;
  const creditsCloud = cloudShare * c * L;
  const creditsProvider = inc.providerFunded * c * L;
  const creditsPartner = inc.partnerFunded * c * L;
  const customerPays = L - p.customerDiscount * L - c * L;
  const distribution = p.distributionCost * L;

  if (p.structure === "agent") {
    const discountProvider = p.discountFundedByProvider * p.customerDiscount * L;
    const discountCloud = (1 - p.discountFundedByProvider) * p.customerDiscount * L;
    const providerRevenue = L - discountProvider - creditsProvider;
    const fee = Math.max(0, p.channelFee + (opts.feeShift ?? 0));
    const channelFeePaid = fee * providerRevenue;
    const cloudNetRevenue = channelFeePaid - discountCloud - creditsCloud;
    const providerServing = p.providerServingCost * costScale * providerRevenue;
    const computeContribution = providerServing * p.hostedShare * p.incrementalComputeShare * p.computeMargin;
    const cloudContribution = cloudNetRevenue - distribution + computeContribution;
    return {
      list: L, discountProvider, discountCloud, creditsCloud, creditsProvider, creditsPartner, customerPays,
      providerRevenue, cloudNetRevenue, revenueSharePaid: 0,
      infra: 0, infraDepreciation: 0, infraPower: 0, infraNetwork: 0,
      distribution, computeContribution, cloudContribution, cloudEconomic: cloudContribution,
      providerServing, channelFeePaid,
      providerContribution: providerRevenue - channelFeePaid - providerServing,
    };
  }

  const discountCloud = p.customerDiscount * L;
  const cloudNetRevenue = L - discountCloud - creditsCloud;
  const revenueSharePaid = p.revenueShare * cloudNetRevenue;
  const infra = p.infraCost * costScale * (p.baseUtilization / p.utilization) * L;
  const cloudContribution = cloudNetRevenue - revenueSharePaid - infra - distribution;
  return {
    list: L, discountProvider: 0, discountCloud, creditsCloud, creditsProvider, creditsPartner, customerPays,
    providerRevenue: revenueSharePaid - creditsProvider, cloudNetRevenue, revenueSharePaid,
    infra,
    infraDepreciation: infra * INFRA_SPLIT.depreciation,
    infraPower: infra * INFRA_SPLIT.power,
    infraNetwork: infra * INFRA_SPLIT.network,
    distribution, computeContribution: 0, cloudContribution,
    cloudEconomic: cloudContribution - p.modelDevCost * cloudNetRevenue,
    providerServing: 0, channelFeePaid: 0,
    providerContribution: revenueSharePaid - creditsProvider,
  };
}

const noIncentive = { pct: 0, partnerFunded: 0, providerFunded: 0 };

/** Contribution is linear in the incentive, so the break-even incentive is M0 / (M0 − contribution at 100%). */
export function breakEvenIncentive(p: RouteParams, funding: Pick<Incentive, "partnerFunded" | "providerFunded">, economic = false): number {
  const pick = (w: Waterfall) => (economic ? w.cloudEconomic : w.cloudContribution);
  const m0 = pick(waterfall(p, noIncentive));
  const m1 = pick(waterfall(p, { pct: 1, ...funding }));
  if (m0 <= 0) return 0;
  return m0 / (m0 - m1);
}

/** Volume multiple needed to earn the same contribution under a recurring incentive; Infinity if unrecoverable. */
export function requiredVolumeMultiple(p: RouteParams, inc: Pick<Incentive, "pct" | "partnerFunded" | "providerFunded">): number {
  const m0 = waterfall(p, noIncentive).cloudContribution;
  const m = waterfall(p, inc).cloudContribution;
  if (m0 <= 0) return Infinity;
  if (m <= 0) return Infinity;
  return m0 / m;
}

/** Year-2 rise in the customer's effective price when a one-time credit rolls off. */
export function creditCliff(customerDiscount: number, credit: number): number {
  const before = 1 - customerDiscount - credit;
  if (before <= 0) return Infinity;
  return (1 - customerDiscount) / before - 1;
}

export interface YearRow {
  year: number;
  spend: number;
  grossContribution: number;
  incentiveCost: number;
  adjacency: number;
  contribution: number;
  cumulative: number;
  discounted: number;
  customerCredit: number;
}

export interface LifetimeResult {
  rows: YearRow[];
  npv: number;
  cumulative: number;
  /** Months until cumulative gross contribution (+ adjacency) covers incentives booked at the start of each year. Infinity if never within the lifetime. */
  paybackMonths: number;
  /** Customer's view: total credits ÷ total list spend over the lifetime. */
  effectiveCustomerDiscount: number;
}

/**
 * Multi-year engine. Spend is in the same units as LIST: year-1 list spend = 100.
 * Serving-cost ratios move each year by (1 − efficiency) / (1 − price deflation).
 */
export function lifetime(p: RouteParams, inc: Incentive, lt: Lifetime): LifetimeResult {
  const rows: YearRow[] = [];
  let prevSpend = lt.baselineShare * LIST;
  let cum = 0;
  let npv = 0;
  let creditsTotal = 0;
  let spendTotal = 0;
  const costDrift = (1 - lt.efficiencyGain) / (1 - lt.priceDeflation);
  for (let t = 1; t <= lt.years; t += 1) {
    const inCommit = inc.type === "commit" && t <= lt.commitYears;
    const survive = inCommit ? 1 : Math.pow(lt.retention, t - 1);
    const spend = LIST * Math.pow(1 + lt.growth, t - 1) * survive;
    const scale = spend / LIST;
    const opts = { costScale: Math.pow(costDrift, t - 1), feeShift: lt.channelFeeDrift * (t - 1) };
    const base = waterfall(p, noIncentive, opts);
    const full = waterfall(p, { pct: 1, partnerFunded: inc.partnerFunded, providerFunded: inc.providerFunded }, opts);
    const costPerCreditDollar = (base.cloudContribution - full.cloudContribution) / LIST;
    let creditBase = 0;
    if (inc.type === "one-time" || inc.type === "commit") creditBase = t === 1 ? inc.pct * spend : 0;
    else if (inc.type === "recurring") creditBase = inc.pct * spend;
    else creditBase = inc.pct * Math.max(0, spend - prevSpend);
    const grossContribution = base.cloudContribution * scale;
    const incentiveCost = costPerCreditDollar * creditBase;
    const attach = lt.adjacencyAttach * lt.adjacencyIncremental + (inCommit ? lt.commitAdjacencyUplift : 0);
    const adjacency = lt.includeAdjacency ? spend * attach * lt.adjacencyMargin : 0;
    const contribution = grossContribution - incentiveCost + adjacency;
    cum += contribution;
    const discounted = contribution / Math.pow(1 + lt.discountRate, t);
    npv += discounted;
    creditsTotal += creditBase;
    spendTotal += spend;
    rows.push({ year: t, spend, grossContribution, incentiveCost, adjacency, contribution, cumulative: cum, discounted, customerCredit: creditBase });
    prevSpend = spend;
  }
  return { rows, npv, cumulative: cum, paybackMonths: payback(rows), effectiveCustomerDiscount: spendTotal > 0 ? creditsTotal / spendTotal : 0 };
}

/** Incentive booked at the start of each year; gross contribution and adjacency accrue evenly by month. */
function payback(rows: YearRow[]): number {
  let cum = 0;
  let wentNegative = false;
  for (const r of rows) {
    cum -= r.incentiveCost;
    const annual = r.grossContribution + r.adjacency;
    if (cum < 0) {
      wentNegative = true;
      if (annual > 0 && -cum <= annual) return (r.year - 1) * 12 + (12 * -cum) / annual;
    }
    cum += annual;
  }
  return wentNegative ? Infinity : 0;
}

/** Adjacent attach ratio (per $1 of AI spend, before the incremental haircut) that makes lifetime NPV zero. */
export function requiredAttach(p: RouteParams, inc: Incentive, lt: Lifetime): number {
  const without = lifetime(p, inc, { ...lt, includeAdjacency: true, adjacencyAttach: 0, commitAdjacencyUplift: 0 }).npv;
  if (without >= 0) return 0;
  const withOne = lifetime(p, inc, { ...lt, includeAdjacency: true, adjacencyAttach: 1, commitAdjacencyUplift: 0 }).npv;
  const slope = withOne - without;
  if (slope <= 0) return Infinity;
  return -without / slope;
}

export const INCENTIVE_LEVELS = [0, 0.1, 0.2, 0.25, 0.35, 0.4, 0.5] as const;

export interface GridRow {
  level: number;
  customerPays: number;
  cloudNetRevenue: number;
  contribution: number;
  contributionPct: number | null;
  volumeMultiple: number;
  paybackMonths: number;
  npv1: number;
  npv3: number;
  npv5: number;
  npvRecurring5: number;
}

export function subsidyGrid(p: RouteParams, funding: Pick<Incentive, "partnerFunded" | "providerFunded">, lt: Lifetime): GridRow[] {
  return INCENTIVE_LEVELS.map((level) => {
    const w = waterfall(p, { pct: level, ...funding });
    const oneTime: Incentive = { pct: level, type: "one-time", ...funding };
    const recurring: Incentive = { pct: level, type: "recurring", ...funding };
    return {
      level,
      customerPays: w.customerPays,
      cloudNetRevenue: w.cloudNetRevenue,
      contribution: w.cloudContribution,
      contributionPct: w.cloudNetRevenue > 0 ? w.cloudContribution / w.cloudNetRevenue : null,
      volumeMultiple: requiredVolumeMultiple(p, { pct: level, ...funding }),
      paybackMonths: lifetime(p, oneTime, { ...lt, years: 5 }).paybackMonths,
      npv1: lifetime(p, oneTime, { ...lt, years: 1 }).npv,
      npv3: lifetime(p, oneTime, { ...lt, years: 3 }).npv,
      npv5: lifetime(p, oneTime, { ...lt, years: 5 }).npv,
      npvRecurring5: lifetime(p, recurring, { ...lt, years: 5 }).npv,
    };
  });
}

/**
 * Strategic (non-operating) value: equity uplift to a cloud that owns part of the model
 * provider, per $100 of list consumption — only for revenue that is incremental to the
 * provider (not shifted from its direct channel or another cloud).
 */
export function equityUplift(stake: number, revenueMultiple: number, incrementalToProvider: number, providerRevenue: number): number {
  return stake * revenueMultiple * incrementalToProvider * providerRevenue;
}
