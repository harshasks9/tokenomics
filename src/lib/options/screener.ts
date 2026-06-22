import { cacheMode, readCachedScreen, writeCachedScreen } from "./cache";
import { FIXTURE_AS_OF, SCREEN_CONFIG } from "./config";
import { MOCK_CANDIDATES } from "./fixtures";
import { getJudgment } from "./ai-judgment";
import { evaluateCandidate } from "./scoring";
import { fetchFundamentals, fetchHistoricalCloses, fetchOptionChain, fetchStockProfile, fetchUniverse, hasLiveDataKeys } from "./live-data";
import type { CandidateInput, ScreenResult } from "./types";

function cheapGateReasons(candidate: CandidateInput) {
  const reasons: string[] = [];
  const profile = candidate.profile;
  if (!SCREEN_CONFIG.allowedSectors.includes(profile.sector as (typeof SCREEN_CONFIG.allowedSectors)[number])) reasons.push("sector");
  if (!(profile.marketCap > SCREEN_CONFIG.marketCapMoreThan)) reasons.push("market cap");
  const pctBelowHigh = profile.yearHigh > 0 ? 1 - profile.price / profile.yearHigh : 0;
  if (!(pctBelowHigh >= SCREEN_CONFIG.minPctBelowHigh)) reasons.push("% below high");
  return reasons;
}

async function scoreCandidates(candidates: CandidateInput[], asOfDate: Date, aiJudgment: boolean): Promise<ScreenResult> {
  const rows = [];
  for (const candidate of candidates) {
    const judgment = await getJudgment(candidate, aiJudgment && cheapGateReasons(candidate).length === 0);
    rows.push(evaluateCandidate(candidate, asOfDate, judgment));
  }
  rows.sort((a, b) => b.totalScore - a.totalScore);
  return {
    generatedAt: new Date().toISOString(),
    asOfDate: asOfDate.toISOString(),
    mode: hasLiveDataKeys() ? "live" : "mock",
    cacheMode: cacheMode(),
    aiJudgment,
    rows,
    universeCount: candidates.length,
    optionChainFetches: rows.filter((row) => row.chainFetched).length,
    notices: [
      "Not investment advice.",
      "iv_rank* is a realized-vol proxy, not true IV rank.",
      "40% of the score is judgment; neutral by default — enable AI judgment or review manually.",
    ],
    errors: [],
  };
}

async function runMockScreen(aiJudgment: boolean) {
  return scoreCandidates(MOCK_CANDIDATES, new Date(FIXTURE_AS_OF), aiJudgment);
}

async function runLiveScreen(aiJudgment: boolean): Promise<ScreenResult> {
  const errors: string[] = [];
  const asOfDate = new Date();
  const universe = await fetchUniverse();
  const candidates: CandidateInput[] = [];
  let optionChainFetches = 0;

  for (const item of universe) {
    try {
      const profile = await fetchStockProfile(item);
      const [fundamentals, historicalCloses] = await Promise.all([
        fetchFundamentals(profile.ticker),
        fetchHistoricalCloses(profile.ticker),
      ]);
      const cheapCandidate: CandidateInput = { profile, fundamentals, historicalCloses, chainFetched: false };
      if (cheapGateReasons(cheapCandidate).length > 0) {
        candidates.push(cheapCandidate);
        continue;
      }
      const options = await fetchOptionChain(profile.ticker);
      optionChainFetches += 1;
      candidates.push({ ...cheapCandidate, options, chainFetched: true });
    } catch (error) {
      errors.push(`${item.symbol}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const result = await scoreCandidates(candidates, asOfDate, aiJudgment);
  return {
    ...result,
    mode: "live",
    universeCount: universe.length,
    optionChainFetches,
    errors,
  };
}

export async function runFullScreen(options: { aiJudgment?: boolean } = {}) {
  if (hasLiveDataKeys() && cacheMode() === "memory") {
    throw new Error("Persistent KV/Upstash cache is required before live FMP/Polygon screening can run.");
  }
  const aiJudgment = Boolean(options.aiJudgment);
  const result = hasLiveDataKeys() ? await runLiveScreen(aiJudgment) : await runMockScreen(aiJudgment);
  await writeCachedScreen(result);
  return result;
}

export async function getCachedOrRunScreen() {
  const cached = await readCachedScreen();
  if (cached) return cached;
  if (hasLiveDataKeys() && cacheMode() === "memory") {
    const result: ScreenResult = {
      generatedAt: new Date().toISOString(),
      asOfDate: new Date().toISOString(),
      mode: "live",
      cacheMode: "memory",
      aiJudgment: false,
      rows: [],
      universeCount: 0,
      optionChainFetches: 0,
      notices: [
        "Not investment advice.",
        "iv_rank* is a realized-vol proxy, not true IV rank.",
        "40% of the score is judgment; neutral by default — enable AI judgment or review manually.",
      ],
      errors: ["Persistent KV/Upstash cache is required before live FMP/Polygon screening can run."],
    };
    return result;
  }
  return runFullScreen({ aiJudgment: false });
}
