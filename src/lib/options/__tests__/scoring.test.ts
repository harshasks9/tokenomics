import { describe, expect, it } from "vitest";
import { FIXTURE_AS_OF } from "../config";
import { MOCK_CANDIDATES } from "../fixtures";
import {
  defaultJudgment,
  evaluateCandidate,
  ivRankProxyFromCloses,
  scoreBalanceSheet,
  scoreFcfDurability,
  scoreOptionLiquidity,
  scoreRevenueTrajectory,
  scoreValuation,
} from "../scoring";

describe("IV-rank proxy", () => {
  it("returns neutral 50 with too little history", () => {
    expect(ivRankProxyFromCloses([100, 101, 102])).toBe(50);
  });

  it("distinguishes low, mid, and high realized-vol regimes", () => {
    const byTicker = Object.fromEntries(MOCK_CANDIDATES.map((candidate) => [candidate.profile.ticker, candidate]));
    expect(ivRankProxyFromCloses(byTicker.QUAL.historicalCloses)).toBeLessThan(30);
    expect(ivRankProxyFromCloses(byTicker.BEST.historicalCloses)).toBeGreaterThanOrEqual(30);
    expect(ivRankProxyFromCloses(byTicker.DSTR.historicalCloses)).toBeGreaterThanOrEqual(80);
  });
});

describe("quant sub-scorers", () => {
  it("scores balance sheet according to leverage and current ratio", () => {
    expect(scoreBalanceSheet({ netDebtToEbitda: -0.2, currentRatio: 2.1 })).toBe(5);
    expect(scoreBalanceSheet({ netDebtToEbitda: 1.5, currentRatio: 1.5 })).toBe(3.5);
    expect(scoreBalanceSheet({ netDebtToEbitda: 4.5, currentRatio: 0.8 })).toBe(1);
  });

  it("scores FCF, growth, valuation, and option liquidity", () => {
    expect(scoreFcfDurability({ fcfMargin: 0.30 })).toBe(5);
    expect(scoreFcfDurability({ fcfMargin: -0.01 })).toBe(0.5);
    expect(scoreRevenueTrajectory({ revenueGrowthYoY: 0.12 })).toBe(4);
    expect(scoreRevenueTrajectory({ revenueGrowthYoY: -0.10 })).toBe(1);
    expect(scoreValuation({ evEbitda: 8, evEbitdaMedian5y: 12 })).toBe(5);
    expect(scoreValuation({ evEbitda: 15, evEbitdaMedian5y: 12 })).toBe(1);
    expect(scoreOptionLiquidity({ spreadPct: 0.02, openInterest: 5000, volume: 2000 })).toBe(5);
    expect(scoreOptionLiquidity({ spreadPct: 0.20, openInterest: 100, volume: 50 })).toBe(1);
  });
});

describe("classification fixture parity", () => {
  const rows = MOCK_CANDIDATES.map((candidate) => evaluateCandidate(candidate, new Date(FIXTURE_AS_OF), defaultJudgment()));
  const byTicker = Object.fromEntries(rows.map((row) => [row.ticker, row]));

  it("reproduces the required buckets", () => {
    expect(byTicker.BEST.classificationDetail).toBe("ELIGIBLE");
    expect(byTicker.QUAL.classificationDetail).toBe("WATCHLIST");
    expect(byTicker.COMM.classificationDetail).toBe("WATCHLIST");
    expect(byTicker.MIDQ.classificationDetail).toBe("WATCHLIST");
    expect(byTicker.ILQD.classificationDetail).toContain("REJECT (gate:");
    expect(byTicker.ILQD.classificationDetail).toContain("liquidity");
    expect(byTicker.DSTR.classificationDetail).toBe("REJECT (high IV pricing real risk)");
    expect(byTicker.TRAP.classificationDetail).toBe("REJECT (score)");
    expect(byTicker.NEAR.classificationDetail).toContain("REJECT (gate:");
    expect(byTicker.NEAR.classificationDetail).toContain("% below high");
  });

  it("flags earnings and avoids chain calls for the cheap drawdown reject", () => {
    expect(byTicker.MIDQ.flags).toContain("earnings in 20d");
    expect(byTicker.NEAR.chainFetched).toBe(false);
    expect(byTicker.NEAR.representativePut).toBeNull();
  });
});
