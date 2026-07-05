"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowDownUp, Download, LockKeyhole, RefreshCw, ShieldAlert } from "lucide-react";
import type { Classification, ScreenResult, ScreenRow } from "@/lib/options/types";

type SortKey =
  | "ticker"
  | "price"
  | "yearHigh"
  | "pctBelowHigh"
  | "marketCap"
  | "ivRank"
  | "putMid"
  | "liquidity"
  | "quantScore"
  | "judgmentScore"
  | "totalScore"
  | "classification";

const classificationOrder: Record<Classification, number> = {
  ELIGIBLE: 3,
  WATCHLIST: 2,
  REJECT: 1,
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function number(value: number, digits = 1) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

function marketCapB(value: number) {
  return number(value / 1_000_000_000, 1);
}

function badgeClass(classification: Classification) {
  if (classification === "ELIGIBLE") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (classification === "WATCHLIST") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function getSortValue(row: ScreenRow, key: SortKey): string | number {
  if (key === "putMid") return row.representativePut?.mid ?? -1;
  if (key === "liquidity") return row.quantFactors.option_liquidity;
  if (key === "classification") return classificationOrder[row.classification];
  return row[key];
}

function csvEscape(value: string | number) {
  const text = String(value);
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

function buildCsv(rows: ScreenRow[]) {
  const headers = [
    "ticker",
    "name",
    "sector",
    "price",
    "yearHigh",
    "pctBelowHigh",
    "marketCapB",
    "ivRankProxy",
    "representativePut",
    "putMid",
    "liquidityScore",
    "quantOutOf60",
    "judgmentOutOf40",
    "total",
    "classification",
    "flags",
  ];
  const body = rows.map((row) => [
    row.ticker,
    row.name,
    row.sector,
    row.price,
    row.yearHigh,
    row.pctBelowHigh,
    row.marketCap / 1_000_000_000,
    row.ivRank,
    row.representativePutLabel,
    row.representativePut?.mid ?? "",
    row.quantFactors.option_liquidity,
    row.quantScore,
    row.judgmentScore,
    row.totalScore,
    row.classificationDetail,
    row.flags.join("; "),
  ]);
  return [headers, ...body].map((line) => line.map(csvEscape).join(",")).join("\n");
}

export default function OptionsDashboard({ initialResult }: { initialResult: ScreenResult }) {
  const [result, setResult] = useState(initialResult);
  const [classification, setClassification] = useState<"ALL" | Classification>("ALL");
  const [sector, setSector] = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("totalScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [aiJudgment, setAiJudgment] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sectors = useMemo(() => Array.from(new Set(result.rows.map((row) => row.sector))).sort(), [result.rows]);
  const filteredRows = useMemo(() => {
    const filtered = result.rows.filter((row) => {
      if (classification !== "ALL" && row.classification !== classification) return false;
      if (sector !== "ALL" && row.sector !== sector) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);
      const direction = sortDir === "asc" ? 1 : -1;
      if (typeof aValue === "number" && typeof bValue === "number") return (aValue - bValue) * direction;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [classification, result.rows, sector, sortDir, sortKey]);

  const counts = useMemo(() => {
    return result.rows.reduce<Record<Classification, number>>(
      (acc, row) => {
        acc[row.classification] += 1;
        return acc;
      },
      { ELIGIBLE: 0, WATCHLIST: 0, REJECT: 0 },
    );
  }, [result.rows]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((value) => (value === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function exportCsv() {
    const blob = new Blob([buildCsv(filteredRows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `options-screener-${new Date(result.generatedAt).toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function refresh() {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch("/api/options/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiJudgment }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.retryAfterSeconds ? `Refresh rate-limited. Try again in ${Math.ceil(payload.retryAfterSeconds / 60)} min.` : payload.error ?? "Refresh failed.");
        return;
      }
      setResult(payload as ScreenResult);
      setMessage("Refresh complete.");
    });
  }

  const th = (key: SortKey, label: string, align = "text-left") => (
    <th className={`px-3 py-3 ${align}`}>
      <button onClick={() => toggleSort(key)} className="inline-flex items-center gap-1 font-black text-slate-500 hover:text-slate-950">
        {label}
        <ArrowDownUp size={12} />
      </button>
    </th>
  );

  return (
    <main className="min-h-screen bg-[#eef5f7] text-slate-950">
      <header className="border-b border-white/10 bg-[#07111f] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.16em] text-cyan-200">
                <LockKeyhole size={14} /> Read-only screener
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-[-.05em] sm:text-5xl lg:text-7xl">
                Cash-secured-put wheel screener
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60 lg:text-base">
                Ranks Technology and Communication Services names that are meaningfully below their 52-week highs and have a representative liquid put. This app never places, sizes, routes, or simulates trades.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[.06] p-5 text-sm backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[.16em] text-white/35">Last refresh</p>
              <p className="mt-2 font-bold">{new Date(result.generatedAt).toLocaleString()}</p>
              <p className="mt-1 text-xs text-white/45">
                {result.mode.toUpperCase()} mode · {result.cacheMode} cache · {result.optionChainFetches} chain fetches
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {result.notices.map((notice) => (
              <div key={notice} className="flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
                <ShieldAlert size={17} className="mt-0.5 shrink-0 text-cyan-200" />
                <p>{notice}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Eligible</p>
            <p className="mt-2 text-4xl font-black text-emerald-700">{counts.ELIGIBLE}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Watchlist</p>
            <p className="mt-2 text-4xl font-black text-amber-700">{counts.WATCHLIST}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Reject</p>
            <p className="mt-2 text-4xl font-black text-slate-500">{counts.REJECT}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Universe</p>
            <p className="mt-2 text-4xl font-black text-cyan-700">{result.universeCount}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="text-xs font-black uppercase tracking-[.14em] text-slate-500">
                Classification
                <select value={classification} onChange={(event) => setClassification(event.target.value as "ALL" | Classification)} className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900">
                  <option value="ALL">All</option>
                  <option value="ELIGIBLE">Eligible</option>
                  <option value="WATCHLIST">Watchlist</option>
                  <option value="REJECT">Reject</option>
                </select>
              </label>
              <label className="text-xs font-black uppercase tracking-[.14em] text-slate-500">
                Sector
                <select value={sector} onChange={(event) => setSector(event.target.value)} className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900">
                  <option value="ALL">All</option>
                  {sectors.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold">
                <input type="checkbox" checked={aiJudgment} onChange={(event) => setAiJudgment(event.target.checked)} />
                AI judgment on refresh
              </label>
              <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black hover:bg-slate-50">
                <Download size={16} /> CSV export
              </button>
              <button onClick={refresh} disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-50">
                <RefreshCw size={16} className={isPending ? "animate-spin" : ""} /> Refresh
              </button>
              <form action="/api/options/logout" method="post">
                <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black hover:bg-slate-50">Logout</button>
              </form>
            </div>
          </div>
          {message && <p className="mt-4 rounded-2xl bg-cyan-50 p-3 text-sm font-semibold text-cyan-900">{message}</p>}
          {result.errors.length > 0 && (
            <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-800">
              <p className="font-black">Live data warnings</p>
              <p className="mt-1">{result.errors.slice(0, 3).join(" | ")}</p>
            </div>
          )}
        </div>

        <div className="mt-5 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-900/5">
          <table className="min-w-[1380px] text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase tracking-[.12em]">
              <tr>
                {th("ticker", "Ticker")}
                <th className="px-3 py-3 text-left">Name</th>
                <th className="px-3 py-3 text-left">Sector</th>
                {th("price", "Price", "text-right")}
                {th("yearHigh", "52wk high", "text-right")}
                {th("pctBelowHigh", "% below", "text-right")}
                {th("marketCap", "Mkt cap $B", "text-right")}
                {th("ivRank", "iv_rank*", "text-right")}
                <th className="px-3 py-3 text-left">Representative put</th>
                {th("putMid", "Put mid", "text-right")}
                {th("liquidity", "Liq", "text-right")}
                {th("quantScore", "Quant/60", "text-right")}
                {th("judgmentScore", "Judg/40", "text-right")}
                {th("totalScore", "Total", "text-right")}
                {th("classification", "Class")}
                <th className="px-3 py-3 text-left">Flags</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.ticker} className="border-b border-slate-100 align-top last:border-0 hover:bg-slate-50/70">
                  <td className="px-3 py-4 font-black">{row.ticker}</td>
                  <td className="max-w-[220px] px-3 py-4">
                    <p className="font-bold">{row.name}</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">{row.thesis}</p>
                  </td>
                  <td className="px-3 py-4 text-slate-600">{row.sector}</td>
                  <td className="px-3 py-4 text-right tabular-nums">{currency(row.price)}</td>
                  <td className="px-3 py-4 text-right tabular-nums">{currency(row.yearHigh)}</td>
                  <td className="px-3 py-4 text-right font-bold tabular-nums">{number(row.pctBelowHigh * 100, 0)}%</td>
                  <td className="px-3 py-4 text-right tabular-nums">{marketCapB(row.marketCap)}</td>
                  <td className="px-3 py-4 text-right font-bold tabular-nums">{number(row.ivRank, 0)}</td>
                  <td className="px-3 py-4 font-semibold">{row.representativePutLabel}</td>
                  <td className="px-3 py-4 text-right tabular-nums">{row.representativePut ? currency(row.representativePut.mid) : "—"}</td>
                  <td className="px-3 py-4 text-right tabular-nums">{number(row.quantFactors.option_liquidity, 1)}</td>
                  <td className="px-3 py-4 text-right font-bold tabular-nums">{number(row.quantScore, 1)}</td>
                  <td className="px-3 py-4 text-right font-bold tabular-nums">{number(row.judgmentScore, 1)}</td>
                  <td className="px-3 py-4 text-right text-base font-black tabular-nums">{number(row.totalScore, 1)}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[.12em] ${badgeClass(row.classification)}`}>
                      {row.classification}
                    </span>
                    <p className="mt-1 max-w-[180px] text-[11px] leading-4 text-slate-500">{row.classificationDetail}</p>
                  </td>
                  <td className="max-w-[240px] px-3 py-4 text-[11px] leading-5 text-slate-500">{row.flags.join(" · ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-6 text-sm leading-7 text-slate-600 shadow-sm shadow-slate-900/5">
          <p className="font-black text-slate-950">Caveats and upgrade path</p>
          <p className="mt-2">
            iv_rank* is computed from realized volatility over one year of daily closes. Upgrade by replacing the proxy with a real one-year ATM-IV series from Polygon historical chains or a provider such as tastytrade&apos;s iv_rank.
            Judgment factors are neutral by default; enable AI judgment only as a review aid, never as execution advice.
          </p>
        </div>
      </section>
    </main>
  );
}
