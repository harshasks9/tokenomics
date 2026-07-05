import type { JUDGMENT_FACTORS, QUANT_FACTORS } from "./config";

export type QuantFactor = (typeof QUANT_FACTORS)[number];
export type JudgmentFactor = (typeof JUDGMENT_FACTORS)[number];
export type ScoreMap<T extends string> = Record<T, number>;
export type Classification = "ELIGIBLE" | "WATCHLIST" | "REJECT";
export type DrawdownClass =
  | "temporary_impairment"
  | "cyclical"
  | "structural_decline"
  | "value_trap"
  | "governance_or_balance_sheet";

export interface StockProfile {
  ticker: string;
  name: string;
  sector: string;
  exchange?: string;
  price: number;
  yearHigh: number;
  marketCap: number;
  earningsAnnouncement?: string | null;
}

export interface Fundamentals {
  netDebtToEbitda: number | null;
  currentRatio: number | null;
  fcfMargin: number | null;
  revenueGrowthYoY: number | null;
  evEbitda: number | null;
  evEbitdaMedian5y: number | null;
  revenue?: number | null;
  ebitda?: number | null;
}

export interface OptionContract {
  strike: number;
  expirationDate: string;
  bid: number;
  ask: number;
  delta: number;
  impliedVolatility?: number | null;
  openInterest: number;
  volume: number;
}

export interface CandidateInput {
  profile: StockProfile;
  fundamentals: Fundamentals;
  historicalCloses: number[];
  options?: OptionContract[];
  chainFetched: boolean;
}

export interface RepresentativePut extends OptionContract {
  dte: number;
  mid: number;
  spreadPct: number;
}

export interface JudgmentScores {
  scores: ScoreMap<JudgmentFactor>;
  drawdownClass: DrawdownClass | "neutral";
  thesis: string;
  flag: string;
  source: "neutral" | "anthropic" | "fallback";
}

export interface ScreenRow {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  yearHigh: number;
  pctBelowHigh: number;
  marketCap: number;
  earningsAnnouncement?: string | null;
  representativePut: RepresentativePut | null;
  representativePutLabel: string;
  ivRank: number;
  quantFactors: ScoreMap<QuantFactor>;
  judgmentFactors: ScoreMap<JudgmentFactor>;
  quantScore: number;
  judgmentScore: number;
  totalScore: number;
  quantQuality: number;
  classification: Classification;
  classificationDetail: string;
  hardGateReasons: string[];
  flags: string[];
  chainFetched: boolean;
  drawdownClass: string;
  thesis: string;
}

export interface ScreenResult {
  generatedAt: string;
  asOfDate: string;
  mode: "mock" | "live";
  cacheMode: "redis" | "memory";
  aiJudgment: boolean;
  rows: ScreenRow[];
  universeCount: number;
  optionChainFetches: number;
  notices: string[];
  errors: string[];
}
