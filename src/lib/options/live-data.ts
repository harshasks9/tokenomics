import { SCREEN_CONFIG } from "./config";
import type { CandidateInput, Fundamentals, OptionContract, StockProfile } from "./types";

const FMP_BASE = "https://financialmodelingprep.com/api/v3";
const POLYGON_BASE = "https://api.polygon.io";

function requireFmpKey() {
  const key = process.env.FMP_API_KEY;
  if (!key) throw new Error("FMP_API_KEY is not configured");
  return key;
}

function requirePolygonKey() {
  const key = process.env.POLYGON_API_KEY;
  if (!key) throw new Error("POLYGON_API_KEY is not configured");
  return key;
}

async function fmpGet<T>(path: string, params: Record<string, string | number | boolean> = {}) {
  const url = new URL(`${FMP_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("apikey", requireFmpKey());
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`FMP ${path} failed: ${response.status} ${await response.text()}`);
  return (await response.json()) as T;
}

async function polygonGet<T>(path: string, params: Record<string, string | number | boolean> = {}) {
  const url = new URL(`${POLYGON_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("apiKey", requirePolygonKey());
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Polygon ${path} failed: ${response.status} ${await response.text()}`);
  return (await response.json()) as T;
}

type ScreenerItem = {
  symbol: string;
  companyName?: string;
  companyNameLong?: string;
  sector?: string;
  marketCap?: number;
  price?: number;
  exchangeShortName?: string;
};

type QuoteItem = {
  symbol: string;
  name?: string;
  price?: number;
  yearHigh?: number;
  marketCap?: number;
  earningsAnnouncement?: string;
};

function median(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  if (valid.length === 0) return null;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
}

function numberOrNull(...values: unknown[]) {
  for (const value of values) {
    const numeric = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
}

export function hasLiveDataKeys() {
  return Boolean(process.env.FMP_API_KEY && process.env.POLYGON_API_KEY);
}

export async function fetchUniverse() {
  const sectors = SCREEN_CONFIG.allowedSectors;
  const results: ScreenerItem[] = [];
  for (const sector of sectors) {
    const rows = await fmpGet<ScreenerItem[]>("/stock-screener", {
      sector,
      marketCapMoreThan: SCREEN_CONFIG.marketCapMoreThan,
      exchange: "nasdaq,nyse",
      isActivelyTrading: true,
      limit: 1000,
    });
    results.push(...rows);
  }
  const unique = new Map<string, ScreenerItem>();
  for (const item of results) {
    if (item.symbol) unique.set(item.symbol, item);
  }
  return Array.from(unique.values());
}

export async function fetchStockProfile(item: ScreenerItem): Promise<StockProfile> {
  const quote = (await fmpGet<QuoteItem[]>(`/quote/${item.symbol}`))[0] ?? {};
  return {
    ticker: item.symbol,
    name: quote.name ?? item.companyName ?? item.companyNameLong ?? item.symbol,
    sector: item.sector ?? "Unknown",
    exchange: item.exchangeShortName,
    price: numberOrNull(quote.price, item.price) ?? 0,
    yearHigh: numberOrNull(quote.yearHigh) ?? 0,
    marketCap: numberOrNull(quote.marketCap, item.marketCap) ?? 0,
    earningsAnnouncement: quote.earningsAnnouncement ?? null,
  };
}

export async function fetchFundamentals(ticker: string): Promise<Fundamentals> {
  const [metrics, ratios, income, evs] = await Promise.all([
    fmpGet<Record<string, unknown>[]>(`/key-metrics-ttm/${ticker}`).catch(() => []),
    fmpGet<Record<string, unknown>[]>(`/ratios-ttm/${ticker}`).catch(() => []),
    fmpGet<Record<string, unknown>[]>(`/income-statement/${ticker}`, { period: "annual", limit: 2 }).catch(() => []),
    fmpGet<Record<string, unknown>[]>(`/enterprise-values/${ticker}`, { period: "annual", limit: 5 }).catch(() => []),
  ]);
  const m = metrics[0] ?? {};
  const r = ratios[0] ?? {};
  const latestIncome = income[0] ?? {};
  const previousIncome = income[1] ?? {};
  const revenue = numberOrNull(latestIncome.revenue);
  const previousRevenue = numberOrNull(previousIncome.revenue);
  const ebitda = numberOrNull(latestIncome.ebitda);
  const netDebt = numberOrNull(m.netDebt, m.netDebtToEBITDA && ebitda ? Number(m.netDebtToEBITDA) * ebitda : null);
  const freeCashFlow = numberOrNull(m.freeCashFlow, latestIncome.freeCashFlow);
  const evEbitdaSeries = evs.map((ev) => numberOrNull(ev.enterpriseValueOverEBITDA, ev.evToEbitda)).filter((value): value is number => value !== null);

  return {
    netDebtToEbitda: numberOrNull(m.netDebtToEBITDA, m.netDebtToEbitda, netDebt !== null && ebitda ? netDebt / ebitda : null),
    currentRatio: numberOrNull(r.currentRatio, m.currentRatio),
    fcfMargin: revenue && freeCashFlow !== null ? freeCashFlow / revenue : numberOrNull(m.freeCashFlowMargin, r.freeCashFlowMargin),
    revenueGrowthYoY: revenue && previousRevenue ? (revenue - previousRevenue) / previousRevenue : numberOrNull(r.revenueGrowth),
    evEbitda: numberOrNull(r.enterpriseValueMultiple, m.enterpriseValueOverEBITDA, evEbitdaSeries[0]),
    evEbitdaMedian5y: median(evEbitdaSeries),
    revenue,
    ebitda,
  };
}

export async function fetchHistoricalCloses(ticker: string) {
  const payload = await fmpGet<{ historical?: Array<{ close?: number }> }>(`/historical-price-full/${ticker}`, { timeseries: 365 });
  const closes = (payload.historical ?? [])
    .map((row) => row.close)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
    .reverse();
  return closes.length >= 2 ? closes : [100, 100];
}

type PolygonContract = {
  details?: { strike_price?: number; expiration_date?: string };
  last_quote?: { bid?: number; ask?: number };
  greeks?: { delta?: number };
  implied_volatility?: number;
  open_interest?: number;
  day?: { volume?: number };
};

export async function fetchOptionChain(ticker: string): Promise<OptionContract[]> {
  const payload = await polygonGet<{ results?: PolygonContract[] }>(`/v3/snapshot/options/${ticker}`, {
    contract_type: "put",
    limit: 250,
  });
  const results = payload.results ?? [];
  const options = results.map((contract) => {
    const option = {
      strike: numberOrNull(contract.details?.strike_price) ?? 0,
      expirationDate: contract.details?.expiration_date ?? "",
      bid: numberOrNull(contract.last_quote?.bid) ?? 0,
      ask: numberOrNull(contract.last_quote?.ask) ?? 0,
      delta: numberOrNull(contract.greeks?.delta) ?? 0,
      impliedVolatility: numberOrNull(contract.implied_volatility),
      openInterest: numberOrNull(contract.open_interest) ?? 0,
      volume: numberOrNull(contract.day?.volume) ?? 0,
    };
    return option;
  });
  const malformed = options.find((option) => !option.expirationDate || !option.strike || !option.bid || !option.ask);
  if (results.length > 0 && malformed) {
    console.error("Polygon option schema differed from expected snapshot fields", JSON.stringify(results[0]).slice(0, 1000));
  }
  return options.filter((option) => option.expirationDate && option.strike > 0 && option.ask > 0);
}

export async function buildLiveCandidate(item: ScreenerItem, chainFetched: boolean): Promise<CandidateInput> {
  const profile = await fetchStockProfile(item);
  const [fundamentals, historicalCloses, options] = await Promise.all([
    fetchFundamentals(profile.ticker),
    fetchHistoricalCloses(profile.ticker),
    chainFetched ? fetchOptionChain(profile.ticker) : Promise.resolve(undefined),
  ]);
  return { profile, fundamentals, historicalCloses, options, chainFetched };
}
