"use client";

// APJ opportunity dashboard — research-based priority-account universe.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, TriangleAlert } from "lucide-react";
import { PALETTE, fmtMoney, fmtNum } from "../data";
import { ALL_ACCOUNTS, ALL_EXCLUDED, businessValueScore, readinessScore } from "./index";
import { BVB_META, MARKET_META, PACKAGES, UNIVERSE_DISCLAIMER, type Account, type BuildVsBuy } from "./shared";

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
  const [bvb, setBvb] = useState<string>("all");
  const [q, setQ] = useState("");
  const [showEvidence, setShowEvidence] = useState(false);

  const accounts = ALL_ACCOUNTS;
  const filtered = useMemo(
    () =>
      accounts.filter(
        (a) =>
          (market === "all" || a.market === market) &&
          (tier === 0 || a.tier === tier) &&
          (bvb === "all" || a.buildVsBuy === bvb) &&
          (q === "" || a.name.toLowerCase().includes(q.toLowerCase()) || a.vertical.toLowerCase().includes(q.toLowerCase())),
      ),
    [accounts, market, tier, bvb, q],
  );

  const bvbMix = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of accounts) m[a.buildVsBuy] = (m[a.buildVsBuy] ?? 0) + 1;
    return m;
  }, [accounts]);

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
          <StatTile label="Build-vs-buy mix" value={`${bvbMix["buy-led"] ?? 0}/${bvbMix["partner-led"] ?? 0}/${bvbMix["co-build"] ?? 0}`} sub="Buy-led / Partner-led / Co-build" />
          <StatTile label="Deprioritized builders" value={`${ALL_EXCLUDED.length}`} sub="excluded with evidence — see selection logic" />
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
          <span className="w-px h-5 bg-[#233047]" />
          <button onClick={() => setBvb("all")} className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${bvb === "all" ? "bg-white text-[#0B1220] border-transparent" : "border-[#233047] text-[#9AA0A6] hover:text-white"}`}>All models</button>
          {(Object.keys(BVB_META) as BuildVsBuy[]).filter((k) => k !== "build-led").map((k) => (
            <button key={k} onClick={() => setBvb(k)} className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${bvb === k ? "text-white border-transparent" : "border-[#233047] text-[#9AA0A6] hover:text-white"}`}
              style={bvb === k ? { backgroundColor: BVB_META[k].color } : {}}>
              {BVB_META[k].label}
            </button>
          ))}
        </div>

        {/* Account grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((a) => (
            <Link key={a.slug} href={`/voice/accounts/${a.slug}`} className="group rounded-2xl border border-[#233047] bg-[#0E1526] p-4 hover:border-[#1A73E8] transition-colors block">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-extrabold text-white truncate">{a.name}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="text-[8px] font-bold uppercase tracking-wider rounded-full px-1.5 py-0.5" style={{ backgroundColor: `${BVB_META[a.buildVsBuy].color}22`, color: BVB_META[a.buildVsBuy].color }}>{BVB_META[a.buildVsBuy].label}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5" style={{ backgroundColor: `${TIER_COLORS[a.tier]}22`, color: TIER_COLORS[a.tier] }}>T{a.tier}</span>
                </span>
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

        {/* Selection logic & exclusions */}
        <div className="mt-12">
          <button onClick={() => setShowEvidence(!showEvidence)} className="w-full rounded-2xl border border-[#233047] bg-[#0E1526] px-5 py-4 text-left flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-white">Selection logic — every include and exclude decision, with evidence</div>
              <div className="text-[10px] text-[#9AA0A6] mt-0.5">Final test per account: a material business problem AND a credible reason not to build the full conversational-AI platform internally.</div>
            </div>
            <span className="text-[11px] text-[#8AB4F8] font-bold shrink-0">{showEvidence ? "Hide" : "Show"}</span>
          </button>
          {showEvidence && (
            <div className="mt-3 space-y-4">
              <div className="rounded-2xl border border-[#233047] bg-[#0E1526] overflow-hidden">
                <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#9AA0A6] border-b border-[#233047]">Included — {accounts.length} accounts</div>
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full text-[10px] min-w-[860px]">
                    <thead className="sticky top-0 bg-[#0E1526]">
                      <tr className="text-left text-[#5F6368] uppercase tracking-wider">
                        {["Company", "Market", "Vertical", "Model", "Tier", "Package", "Latest signal", "Entry use case"].map((h) => <th key={h} className="px-3 py-2 font-bold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1B263B]">
                      {accounts.map((a) => (
                        <tr key={a.slug} className="text-[#BDC1C6] hover:bg-[#131F38]">
                          <td className="px-3 py-2 font-bold text-white whitespace-nowrap"><Link href={`/voice/accounts/${a.slug}`} className="hover:text-[#8AB4F8]">{a.name}</Link></td>
                          <td className="px-3 py-2 whitespace-nowrap">{a.market}</td>
                          <td className="px-3 py-2">{a.vertical}</td>
                          <td className="px-3 py-2 whitespace-nowrap"><span className="font-bold" style={{ color: BVB_META[a.buildVsBuy].color }}>{BVB_META[a.buildVsBuy].label}</span></td>
                          <td className="px-3 py-2">T{a.tier}</td>
                          <td className="px-3 py-2">{PACKAGES[a.packageRec].name}</td>
                          <td className="px-3 py-2 max-w-[220px]">{a.earningsSignals[0]?.signal.slice(0, 80)}{(a.earningsSignals[0]?.signal.length ?? 0) > 80 ? "…" : ""}</td>
                          <td className="px-3 py-2">{a.entryWorkflow}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="rounded-2xl border border-[#B3261E]/30 bg-[#0E1526] overflow-hidden">
                <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#F28B82] border-b border-[#233047]">Deprioritized — {ALL_EXCLUDED.length} likely internal builders (transparent exclusion log)</div>
                <div className="divide-y divide-[#1B263B]">
                  {ALL_EXCLUDED.map((e) => (
                    <div key={e.name} className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{e.name}</span>
                        <span className="text-[9px] text-[#9AA0A6]">{e.market} · {e.vertical}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5" style={{ backgroundColor: `${BVB_META[e.classification].color}22`, color: BVB_META[e.classification].color }}>{BVB_META[e.classification].label}</span>
                      </div>
                      <p className="text-[10px] text-[#BDC1C6] mt-1 leading-relaxed"><b className="text-white">Why:</b> {e.rationale}</p>
                      <p className="text-[10px] text-[#9AA0A6] mt-0.5 leading-relaxed"><b>Evidence:</b> {e.evidence}</p>
                      {e.pursueOnlyIf && <p className="text-[10px] text-[#8AB4F8] mt-0.5"><b>Pursue only if:</b> {e.pursueOnlyIf}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 text-[10px] text-[#5F6368] leading-relaxed max-w-3xl">
          Universe reassessed on build-vs-buy first principles: accounts are included only where there is a material communications problem AND a
          credible reason not to build the full stack internally. Estimated recurring consumption and partner delivery capacity are modelled
          per-account from editable assumptions — aggregate figures here are the sum of implementation packages only. Internal GTM concept material.
        </div>
      </div>
    </div>
  );
}
