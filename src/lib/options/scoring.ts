import { SCREEN_CONFIG } from "./config";
import type {
  CandidateInput,
  Classification,
  Fundamentals,
  JudgmentScores,
  OptionContract,
  QuantFactor,
  RepresentativePut,
  ScreenRow,
  ScoreMap,
} from "./types";

const weights = SCREEN_CONFIG.weights;

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sampleStdev(values: number[]) {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function ivRankProxyFromCloses(closes: number[]) {
  if (closes.length < 252) return 50;
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i += 1) {
    if (closes[i - 1] > 0 && closes[i] > 0) {
      returns.push(Math.log(closes[i] / closes[i - 1]));
    }
  }
  if (returns.length < 20) return 50;
  const annualized: number[] = [];
  for (let end = 20; end <= returns.length; end += 1) {
    annualized.push(sampleStdev(returns.slice(end - 20, end)) * Math.sqrt(252));
  }
  if (annualized.length === 0) return 50;
  const current = annualized[annualized.length - 1];
  return (100 * annualized.filter((value) => value <= current).length) / annualized.length;
}

export function scoreBalanceSheet(fundamentals: Pick<Fundamentals, "netDebtToEbitda" | "currentRatio">) {
  const r = fundamentals.netDebtToEbitda;
  let score = 3;
  if (r === null || Number.isNaN(r)) score = 3;
  else if (r <= 0) score = 5;
  else if (r < 1) score = 4.5;
  else if (r < 2) score = 3.5;
  else if (r < 3) score = 2.5;
  else if (r < 4) score = 1.5;
  else score = 1;

  const currentRatio = fundamentals.currentRatio;
  if (currentRatio !== null && !Number.isNaN(currentRatio)) {
    if (currentRatio >= 2) score += 0.3;
    else if (currentRatio < 1) score -= 0.5;
  }
  return clamp(score, 1, 5);
}

export function scoreFcfDurability(fundamentals: Pick<Fundamentals, "fcfMargin">) {
  const m = fundamentals.fcfMargin;
  if (m === null || Number.isNaN(m)) return 3;
  if (m > 0.25) return 5;
  if (m > 0.15) return 4;
  if (m > 0.05) return 3;
  if (m > 0) return 2;
  return 0.5;
}

export function scoreRevenueTrajectory(fundamentals: Pick<Fundamentals, "revenueGrowthYoY">) {
  const g = fundamentals.revenueGrowthYoY;
  if (g === null || Number.isNaN(g)) return 3;
  if (g > 0.20) return 5;
  if (g > 0.10) return 4;
  if (g > 0) return 3;
  if (g > -0.05) return 2;
  return 1;
}

export function scoreValuation(fundamentals: Pick<Fundamentals, "evEbitda" | "evEbitdaMedian5y">) {
  const { evEbitda, evEbitdaMedian5y } = fundamentals;
  if (!evEbitda || !evEbitdaMedian5y || evEbitda <= 0 || evEbitdaMedian5y <= 0) return 3;
  const ratio = evEbitda / evEbitdaMedian5y;
  if (ratio < 0.7) return 5;
  if (ratio < 0.85) return 4;
  if (ratio < 1.0) return 3.3;
  if (ratio < 1.2) return 2;
  return 1;
}

export function scoreOptionLiquidity(put: Pick<RepresentativePut, "spreadPct" | "openInterest" | "volume"> | null) {
  if (!put) return 0;
  const sSpread = put.spreadPct <= 0.02 ? 5 : put.spreadPct <= 0.05 ? 4 : put.spreadPct <= 0.10 ? 2.5 : 1;
  const sOI = put.openInterest >= 5000 ? 5 : put.openInterest >= 2000 ? 4 : put.openInterest >= 1000 ? 3 : put.openInterest >= 500 ? 2 : 1;
  const sVol = put.volume >= 2000 ? 5 : put.volume >= 1000 ? 4 : put.volume >= 500 ? 3 : put.volume >= 100 ? 2 : 1;
  return 0.4 * sSpread + 0.3 * sOI + 0.3 * sVol;
}

export function scoreIvAttractiveness(ivRank: number) {
  return Math.min(5, ivRank / 20);
}

export function selectRepresentativePut(options: OptionContract[], asOfDate: Date) {
  const cfg = SCREEN_CONFIG.representativePut;
  const candidates = options
    .map((option) => {
      const expiration = new Date(`${option.expirationDate}T12:00:00.000Z`);
      const dte = Math.ceil((expiration.getTime() - asOfDate.getTime()) / (24 * 60 * 60 * 1000));
      const mid = (option.bid + option.ask) / 2;
      const spreadPct = mid > 0 ? (option.ask - option.bid) / mid : Number.POSITIVE_INFINITY;
      return { ...option, dte, mid, spreadPct };
    })
    .filter((option) => {
      const absDelta = Math.abs(option.delta);
      return option.dte >= cfg.minDte && option.dte <= cfg.maxDte && absDelta >= cfg.minAbsDelta && absDelta <= cfg.maxAbsDelta;
    })
    .sort((a, b) => Math.abs(Math.abs(a.delta) - cfg.targetAbsDelta) - Math.abs(Math.abs(b.delta) - cfg.targetAbsDelta));

  return candidates[0] ?? null;
}

export function defaultJudgment(): JudgmentScores {
  return {
    scores: {
      moat: 3,
      competitive_vs_ai: 3,
      p_drawdown_temporary: 3,
      downside_event_risk: 3,
    },
    drawdownClass: "neutral",
    thesis: "Judgment factors are neutral until reviewed manually or with AI judgment.",
    flag: "judgment=neutral(needs review)",
    source: "neutral",
  };
}

function weighted(score: number, weight: number) {
  return weight * (score / 5);
}

export function buildQuantFactors(fundamentals: Fundamentals, put: RepresentativePut | null, ivRank: number): ScoreMap<QuantFactor> {
  return {
    balance_sheet: scoreBalanceSheet(fundamentals),
    fcf_durability: scoreFcfDurability(fundamentals),
    valuation: scoreValuation(fundamentals),
    revenue_trajectory: scoreRevenueTrajectory(fundamentals),
    option_liquidity: scoreOptionLiquidity(put),
    iv_attractiveness: scoreIvAttractiveness(ivRank),
  };
}

export function classifyCandidate(params: {
  hardGateReasons: string[];
  totalScore: number;
  ivRank: number;
  quantQuality: number;
}): { classification: Classification; detail: string } {
  const { hardGateReasons, totalScore, ivRank, quantQuality } = params;
  if (ivRank >= 80 && quantQuality < 2.5) {
    return { classification: "REJECT", detail: "REJECT (high IV pricing real risk)" };
  }
  if (hardGateReasons.length > 0) {
    return { classification: "REJECT", detail: `REJECT (gate: ${hardGateReasons.join(", ")})` };
  }
  if (totalScore >= 70 && ivRank >= 30) return { classification: "ELIGIBLE", detail: "ELIGIBLE" };
  if (totalScore >= 55) return { classification: "WATCHLIST", detail: "WATCHLIST" };
  return { classification: "REJECT", detail: "REJECT (score)" };
}

function earningsFlag(earningsAnnouncement: string | null | undefined, asOfDate: Date) {
  if (!earningsAnnouncement) return null;
  const earningsDate = new Date(earningsAnnouncement);
  if (Number.isNaN(earningsDate.getTime())) return null;
  const days = Math.ceil((earningsDate.getTime() - asOfDate.getTime()) / (24 * 60 * 60 * 1000));
  if (days >= 0 && days <= 45) return `earnings in ${days}d`;
  return null;
}

export function formatRepresentativePut(put: RepresentativePut | null) {
  if (!put) return "none";
  return `${Number.isInteger(put.strike) ? put.strike.toFixed(0) : put.strike.toFixed(1)}p ${put.dte}d Δ-${Math.abs(put.delta).toFixed(2)}`;
}

export function evaluateCandidate(input: CandidateInput, asOfDate: Date, judgment: JudgmentScores = defaultJudgment()): ScreenRow {
  const { profile } = input;
  const hardGateReasons: string[] = [];
  if (!SCREEN_CONFIG.allowedSectors.includes(profile.sector as (typeof SCREEN_CONFIG.allowedSectors)[number])) {
    hardGateReasons.push("sector");
  }
  if (!(profile.marketCap > SCREEN_CONFIG.marketCapMoreThan)) {
    hardGateReasons.push("market cap");
  }
  const pctBelowHigh = profile.yearHigh > 0 ? 1 - profile.price / profile.yearHigh : 0;
  if (!(pctBelowHigh >= SCREEN_CONFIG.minPctBelowHigh)) {
    hardGateReasons.push("% below high");
  }

  let representativePut: RepresentativePut | null = null;
  if (input.chainFetched) {
    representativePut = selectRepresentativePut(input.options ?? [], asOfDate);
    if (!representativePut) {
      hardGateReasons.push("representative put");
    } else {
      const cfg = SCREEN_CONFIG.representativePut;
      if (representativePut.openInterest < cfg.minOpenInterest) hardGateReasons.push("liquidity: open interest");
      if (representativePut.volume < cfg.minVolume) hardGateReasons.push("liquidity: volume");
      if (representativePut.spreadPct > cfg.maxSpreadPct) hardGateReasons.push("liquidity: spread");
    }
  }

  const ivRank = ivRankProxyFromCloses(input.historicalCloses);
  const quantFactors = buildQuantFactors(input.fundamentals, representativePut, ivRank);
  const quantScore =
    weighted(quantFactors.balance_sheet, weights.balance_sheet) +
    weighted(quantFactors.fcf_durability, weights.fcf_durability) +
    weighted(quantFactors.valuation, weights.valuation) +
    weighted(quantFactors.revenue_trajectory, weights.revenue_trajectory) +
    weighted(quantFactors.option_liquidity, weights.option_liquidity) +
    weighted(quantFactors.iv_attractiveness, weights.iv_attractiveness);
  const judgmentScore =
    weighted(judgment.scores.moat, weights.moat) +
    weighted(judgment.scores.competitive_vs_ai, weights.competitive_vs_ai) +
    weighted(judgment.scores.p_drawdown_temporary, weights.p_drawdown_temporary) +
    weighted(judgment.scores.downside_event_risk, weights.downside_event_risk);
  const totalScore = quantScore + judgmentScore;
  const quantQuality = (quantFactors.balance_sheet + quantFactors.fcf_durability + quantFactors.valuation) / 3;
  const classification = classifyCandidate({ hardGateReasons, totalScore, ivRank, quantQuality });
  const flags = [judgment.flag].filter(Boolean);
  const upcomingEarnings = earningsFlag(profile.earningsAnnouncement, asOfDate);
  if (upcomingEarnings) flags.push(upcomingEarnings);

  return {
    ticker: profile.ticker,
    name: profile.name,
    sector: profile.sector,
    price: profile.price,
    yearHigh: profile.yearHigh,
    pctBelowHigh,
    marketCap: profile.marketCap,
    earningsAnnouncement: profile.earningsAnnouncement,
    representativePut,
    representativePutLabel: formatRepresentativePut(representativePut),
    ivRank,
    quantFactors,
    judgmentFactors: judgment.scores,
    quantScore,
    judgmentScore,
    totalScore,
    quantQuality,
    classification: classification.classification,
    classificationDetail: classification.detail,
    hardGateReasons,
    flags,
    chainFetched: input.chainFetched,
    drawdownClass: judgment.drawdownClass,
    thesis: judgment.thesis,
  };
}
