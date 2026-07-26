"use client";

// APJ opportunity dashboard — research-based priority-account universe.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, TriangleAlert } from "lucide-react";
import { PALETTE, fmtMoney, fmtNum } from "../data";
import { ALL_ACCOUNTS, businessValueScore, readinessScore } from "./index";
import { MARKET_META, PACKAGES, UNIVERSE_DISCLAIMER, type Account } from "./shared";

const TIER_COLORS: Record<number, string> = { 1: "#188038", 2: "#D97706", 3: "#5F6368" };

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[#233047] bg-[#0E1526] p-4">
      <div className="text-[9px] font-bold uppercase tracking-wider text-[#5F6368]">{label}</div>
      <div className="text-xl font-extrabold tabular-nums text-white mt-1">{value}</div>
      {sub && <div className="text-[10px] text-[#9AA0A6] mt-0.5">{sub}</div>}
    </div>
  );
}

export default function AccountsDashboard() {
  const [market, setMarket] = useState<string>("all");
  const [tier, setTier] = useState<number>(0);
  const [q, setQ] = useState("");

  const accounts = ALL_ACCOUNTS;
  const filtered = useMemo(
    () =>
      accounts.filter(
        (a) =>
          (market === "all" || a.market === market) &&
          (tier === 0 || a.tier === tier) &&
          (q === "" || a.name.toLowerCase().includes(q.toLowerCase()) || a.vertical.toLowerCase().includes(q.toLowerCase())),
      ),
    [accounts, market, tier, q],
  );

  const stats = useMemo(() => {
    const byMarket: Record<string, number> = {};
    const byPackage: Record<string, number> = { launch: 0, scale: 0, transform: 0 };
    const byTier: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    let implRevenue = 0;
    let channels = 0;
    const templates: Record<string, number> = {};
    const langs: Record<string, number> = {};
    for (const a of accounts) {
      byMarket[a.market] = (byMarket[a.market] ?? 0) + 1;
      byPackage[a.packageRec] += 1;
      byTier[a.tier] += 1;
      implRevenue += PACKAGES[a.packageRec].price;
      const chSet = new Set(a.workflows.flatMap((w) => w.channels));
      channels += chSet.size;
      templates[a.flowTemplate] = (templates[a.flowTemplate] ?? 0) + 1;
      for (const l of a.languages) langs[l] = (langs[l] ?? 0) + 1;
    }
    const topTemplates = Object.entries(templates).sort((x, y) => y[1] - x[1]).slice(0, 6);
    const topLangs = Object.entries(langs).sort((x, y) => y[1] - x[1]).slice(0, 8);
    return { byMarket, byPackage, byTier, implRevenue, avgChannels: channels / Math.max(1, accounts.length), topTemplates, topLangs };
  }, [accounts]);

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "Inter, system-ui, sans-serif", background: "radial-gradient(1400px 600px at 50% -20%, #14223D, #0B1220)" }}>
      <header className="sticky top-0 z-40 border-b border-[#1B263B] bg-[#0B1220]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/voice/internal" className="text-white/60 hover:text-white shrink-0"><ArrowLeft size={16} /></Link>
            <span className="text-sm font-bold truncate">Gemini Enterprise Frontline · APJ Account Command Centre</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDD663] text-[#202124] rounded px-2 py-0.5 shrink-0">Internal</span>
          </div>
          <span className="hidden md:block text-[10px] text-white/40">{accounts.length} accounts · research-based universe</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="rounded-xl border border-[#FDE293]/30 bg-[#FDD663]/5 px-4 py-3 mb-8 flex gap-2.5 items-start">
          <TriangleAlert size={14} className="text-[#FDD663] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#E8D9A0] leading-relaxed">{UNIVERSE_DISCLAIMER}</p>
        </div>

        {/* Topline */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <StatTile label="Accounts" value={`${accounts.length}`} sub={`${stats.byTier[1]} T1 · ${stats.byTier[2]} T2 · ${stats.byTier[3]} T3`} />
          <StatTile label="Implementation pipeline" value={fmtMoney(stats.implRevenue)} sub="if every account lands its package" />
          <StatTile label="Package mix" value={`${stats.byPackage.launch}/${stats.byPackage.scale}/${stats.byPackage.transform}`} sub="Launch / Scale / Transform" />
          <StatTile label="Avg channels / account" value={stats.avgChannels.toFixed(1)} sub="across recommended workflows" />
          <StatTile label="Markets" value={`${Object.keys(stats.byMarket).length}`} sub="India-led, SEA-heavy" />
          <StatTile label="Avg time to pilot" value="8–12 wks" sub="Launch/Scale packages" />
        </div>

        {/* Matrix + package rationale */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-4 mb-8">
          <div className="rounded-2xl border border-[#233047] bg-[#0E1526] p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#9AA0A6] mb-3">Prioritization matrix — business value × readiness</div>
            <div className="relative h-[320px] border-l border-b border-[#233047] ml-6 mb-6">
              <span className="absolute -left-6 top-1/2 -rotate-90 origin-center text-[9px] font-bold uppercase tracking-wider text-[#5F6368]">Value →</span>
              <span className="absolute left-1/2 -bottom-5 text-[9px] font-bold uppercase tracking-wider text-[#5F6368]">Readiness →</span>
              {accounts.map((a) => {
                const x = ((readinessScore(a) - 1) / 4) * 92 + 3;
                const y = 95 - ((businessValueScore(a) - 1) / 4) * 90;
                return (
                  <Link
                    key={a.slug}
                    href={`/voice/accounts/${a.slug}`}
                    className="absolute group"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={a.name}
                  >
                    <span className="block w-2 h-2 rounded-full transition-transform group-hover:scale-[2]" style={{ backgroundColor: TIER_COLORS[a.tier], boxShadow: a.tier === 1 ? `0 0 8px 2px ${TIER_COLORS[1]}55` : "none" }} />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 hidden group-hover:block text-[9px] font-bold text-white bg-[#1B263B] rounded px-1.5 py-0.5 whitespace-nowrap z-10">{a.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="flex gap-4 text-[10px] text-[#9AA0A6]">
              {[1, 2, 3].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: TIER_COLORS[t] }} /> Tier {t}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#233047] bg-[#0E1526] p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#9AA0A6] mb-3">Package allocation & rationale</div>
              {(["launch", "scale", "transform"] as const).map((p) => (
                <div key={p} className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] font-bold w-24">{PACKAGES[p].name} · {fmtMoney(PACKAGES[p].price)}</span>
                  <div className="flex-1 h-3 rounded bg-[#1B263B] overflow-hidden">
                    <div className="h-full rounded" style={{ width: `${(stats.byPackage[p] / accounts.length) * 100}%`, backgroundColor: PALETTE.blue }} />
                  </div>
                  <span className="text-[11px] font-bold tabular-nums w-8 text-right">{stats.byPackage[p]}</span>
                </div>
              ))}
              <p className="text-[10px] text-[#9AA0A6] mt-2 leading-relaxed">
                Scale dominates by design: most accounts need multi-channel + 2–3 workflows to hit credible economics. Transform is reserved for
                platform-scale operators; Launch for tier-3 or single-workflow proofs. Packages are implementation-only — usage billed separately.
              </p>
            </div>
            <div className="rounded-2xl border border-[#233047] bg-[#0E1526] p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#9AA0A6] mb-3">Repeatable patterns (70–80% standardizable)</div>
              <div className="text-[10px] text-[#9AA0A6] mb-1.5">Most-recommended workflow templates:</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {stats.topTemplates.map(([t, n]) => (
                  <span key={t} className="text-[10px] font-medium rounded-full px-2.5 py-1 bg-[#1A73E8]/15 text-[#8AB4F8]">{t} · {n}</span>
                ))}
              </div>
              <div className="text-[10px] text-[#9AA0A6] mb-1.5">Language coverage to industrialize:</div>
              <div className="flex flex-wrap gap-1.5">
                {stats.topLangs.map(([l, n]) => (
                  <span key={l} className="text-[10px] font-medium rounded-full px-2.5 py-1 border border-[#233047] text-[#BDC1C6]">{l} · {n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-2 bg-[#0E1526] border border-[#233047] rounded-full px-3.5 py-2">
            <Search size={13} className="text-[#5F6368]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search account or vertical" className="bg-transparent text-xs text-white placeholder:text-[#5F6368] focus:outline-none w-44" />
          </div>
          <button onClick={() => setMarket("all")} className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${market === "all" ? "bg-white text-[#0B1220] border-transparent" : "border-[#233047] text-[#9AA0A6] hover:text-white"}`}>All markets</button>
          {Object.keys(MARKET_META).map((m) => (
            <button key={m} onClick={() => setMarket(m)} className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${market === m ? "bg-white text-[#0B1220] border-transparent" : "border-[#233047] text-[#9AA0A6] hover:text-white"}`}>
              {MARKET_META[m as Account["market"]].label}
            </button>
          ))}
          {[0, 1, 2, 3].map((t) => (
            <button key={t} onClick={() => setTier(t)} className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${tier === t ? "bg-white text-[#0B1220] border-transparent" : "border-[#233047] text-[#9AA0A6] hover:text-white"}`}>
              {t === 0 ? "All tiers" : `Tier ${t}`}
            </button>
          ))}
        </div>

        {/* Account grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((a) => (
            <Link key={a.slug} href={`/voice/accounts/${a.slug}`} className="group rounded-2xl border border-[#233047] bg-[#0E1526] p-4 hover:border-[#1A73E8] transition-colors block">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-extrabold text-white truncate">{a.name}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 shrink-0" style={{ backgroundColor: `${TIER_COLORS[a.tier]}22`, color: TIER_COLORS[a.tier] }}>T{a.tier}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#9AA0A6] mb-2">
                <span style={{ color: MARKET_META[a.market].color }}>{MARKET_META[a.market].label}</span>
                <span>·</span><span>{a.vertical}</span>
                <span>·</span><span className="font-bold text-[#8AB4F8]">{PACKAGES[a.packageRec].name}</span>
              </div>
              <p className="text-[11px] text-[#BDC1C6] leading-snug line-clamp-2">{a.heroHeadline}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-[#5F6368]">{a.entryWorkflow}</span>
                <ArrowRight size={12} className="text-[#5F6368] group-hover:text-[#8AB4F8] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center text-sm text-[#5F6368] py-16">No accounts match the filters.</div>}

        <div className="mt-10 text-[10px] text-[#5F6368] leading-relaxed max-w-3xl">
          Estimated recurring consumption, Google Cloud consumption potential, and partner delivery capacity are modelled per-account on each
          account page from editable assumptions — aggregate figures here are the sum of implementation packages only. Internal GTM concept material.
        </div>
      </div>
    </div>
  );
}
