import { FIXTURE_AS_OF } from "./config";
import type { CandidateInput, Fundamentals, OptionContract, StockProfile } from "./types";

type VolMode = "mid" | "low" | "high";

function addDays(dateIso: string, days: number) {
  const date = new Date(dateIso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function makeCloses(mode: VolMode) {
  let price = 100;
  const closes = [price];
  for (let day = 1; day <= 365; day += 1) {
    const lastWindow = day > 345;
    let amp = 0.013;
    if (mode === "low") amp = lastWindow ? 0.003 : 0.018;
    if (mode === "mid") amp = lastWindow ? 0.014 : day < 170 ? 0.010 : 0.020;
    if (mode === "high") amp = lastWindow ? 0.052 : 0.012;
    const direction = day % 2 === 0 ? 1 : -1;
    const wave = Math.sin(day * 1.7) * amp * 0.35;
    const drift = mode === "high" && lastWindow ? -0.002 : 0.0002;
    price *= Math.exp(direction * amp + wave + drift);
    closes.push(Number(price.toFixed(4)));
  }
  return closes;
}

function profile(
  ticker: string,
  name: string,
  price: number,
  yearHigh: number,
  marketCapB: number,
  sector = "Technology",
  earningsInDays?: number,
): StockProfile {
  return {
    ticker,
    name,
    sector,
    exchange: "NASDAQ",
    price,
    yearHigh,
    marketCap: marketCapB * 1_000_000_000,
    earningsAnnouncement: earningsInDays === undefined ? null : addDays(FIXTURE_AS_OF, earningsInDays),
  };
}

function put(strike: number, delta: number, bid: number, ask: number, openInterest: number, volume: number, dte = 42): OptionContract {
  return {
    strike,
    expirationDate: addDays(FIXTURE_AS_OF, dte),
    bid,
    ask,
    delta,
    impliedVolatility: null,
    openInterest,
    volume,
  };
}

const strong: Fundamentals = {
  netDebtToEbitda: 0.6,
  currentRatio: 2.2,
  fcfMargin: 0.22,
  revenueGrowthYoY: 0.14,
  evEbitda: 10,
  evEbitdaMedian5y: 13,
  revenue: 100_000_000_000,
  ebitda: 30_000_000_000,
};

const average: Fundamentals = {
  netDebtToEbitda: 1.4,
  currentRatio: 1.5,
  fcfMargin: 0.08,
  revenueGrowthYoY: 0.04,
  evEbitda: 11,
  evEbitdaMedian5y: 12,
  revenue: 70_000_000_000,
  ebitda: 15_000_000_000,
};

const soft: Fundamentals = {
  netDebtToEbitda: 1.6,
  currentRatio: 1.2,
  fcfMargin: 0.07,
  revenueGrowthYoY: -0.02,
  evEbitda: 14,
  evEbitdaMedian5y: 12,
  revenue: 45_000_000_000,
  ebitda: 9_000_000_000,
};

const weak: Fundamentals = {
  netDebtToEbitda: 4.8,
  currentRatio: 0.8,
  fcfMargin: -0.03,
  revenueGrowthYoY: -0.12,
  evEbitda: 18,
  evEbitdaMedian5y: 12,
  revenue: 25_000_000_000,
  ebitda: 2_000_000_000,
};

export const MOCK_CANDIDATES: CandidateInput[] = [
  {
    profile: profile("BEST", "Best Systems", 120, 200, 220, "Technology"),
    fundamentals: strong,
    historicalCloses: makeCloses("mid"),
    options: [put(110, -0.19, 3.9, 4.05, 6200, 2400), put(105, -0.14, 2.1, 2.2, 2100, 900)],
    chainFetched: true,
  },
  {
    profile: profile("QUAL", "Quality Cloud", 128, 200, 180, "Technology"),
    fundamentals: strong,
    historicalCloses: makeCloses("low"),
    options: [put(118, -0.21, 2.6, 2.72, 4300, 1600), put(112, -0.15, 1.45, 1.53, 1200, 700)],
    chainFetched: true,
  },
  {
    profile: profile("COMM", "Comm Platform", 103.5, 150, 90, "Communication Services"),
    fundamentals: average,
    historicalCloses: makeCloses("mid"),
    options: [put(96, -0.20, 2.7, 2.82, 2600, 980), put(90, -0.12, 1.1, 1.15, 1200, 580)],
    chainFetched: true,
  },
  {
    profile: profile("MIDQ", "Mid Quality AI", 100.5, 150, 65, "Technology", 20),
    fundamentals: soft,
    historicalCloses: makeCloses("mid"),
    options: [put(92, -0.18, 2.35, 2.45, 3100, 1200), put(88, -0.13, 1.2, 1.25, 1700, 640)],
    chainFetched: true,
  },
  {
    profile: profile("ILQD", "Illiquid Software", 100.5, 150, 40, "Technology"),
    fundamentals: average,
    historicalCloses: makeCloses("mid"),
    options: [put(92, -0.20, 1.8, 2.15, 300, 80), put(90, -0.15, 1.1, 1.35, 220, 60)],
    chainFetched: true,
  },
  {
    profile: profile("DSTR", "Distressed Media", 40.5, 150, 24, "Communication Services"),
    fundamentals: weak,
    historicalCloses: makeCloses("high"),
    options: [put(36, -0.21, 4.9, 5.05, 5100, 2200), put(32, -0.13, 2.7, 2.82, 1800, 900)],
    chainFetched: true,
  },
  {
    profile: profile("TRAP", "Trap Networks", 55.5, 150, 32, "Communication Services"),
    fundamentals: weak,
    historicalCloses: makeCloses("mid"),
    options: [put(50, -0.20, 2.2, 2.3, 3400, 1200), put(46, -0.13, 1.4, 1.47, 1600, 650)],
    chainFetched: true,
  },
  {
    profile: profile("NEAR", "Near High Semis", 176, 200, 260, "Technology"),
    fundamentals: strong,
    historicalCloses: makeCloses("mid"),
    options: undefined,
    chainFetched: false,
  },
];
