"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Grid3x3, Layers, LayoutGrid, Map, Rocket, Target, TrendingUp } from "lucide-react";
import {
  COMPANIES, RANKED_COMPANIES, ALL_USE_CASES, TOP_TEN, heroUseCase, scoreOf, econSplit, audienceSplit,
} from "./index";
import { INSIGHTS } from "./data/archetypes";
import { GROUP_META, AUDIENCE_META, type GroupId } from "./schema";
import { CANVAS, INK, LINE, MUTED, Chip, Fade, ScoreRing, SectionHead, Note } from "./ui";
import { CompanyExplorer } from "./explorer";
import { UseCaseLibrary, OpportunityMatrix } from "./library";
import { TopOpportunities } from "./top";
import { SellerMode } from "./seller";

export type ViewId = "home" | "map" | "companies" | "library" | "matrix" | "top" | "seller";

const NAV: { id: ViewId; label: string; Icon: typeof Map }[] = [
  { id: "home", label: "Home", Icon: LayoutGrid },
  { id: "map", label: "Market map", Icon: Map },
  { id: "companies", label: "Company explorer", Icon: Layers },
  { id: "library", label: "Use case library", Icon: Grid3x3 },
  { id: "matrix", label: "Opportunity matrix", Icon: Target },
  { id: "top", label: "Top opportunities", Icon: TrendingUp },
  { id: "seller", label: "Seller mode", Icon: Rocket },
];

export default function NativesApp() {
  const [view, setView] = useState<ViewId>("home");
  const [focus, setFocus] = useState<string | null>(null);

  // Deep links: #companies/meesho
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (!h) return;
      const [v, slug] = h.split("/");
      if (NAV.some((n) => n.id === v)) {
        setView(v as ViewId);
        if (slug) setFocus(slug);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const go = (v: ViewId, slug?: string) => {
    setView(v);
    if (slug) setFocus(slug);
    window.history.replaceState(null, "", `#${v}${slug ? `/${slug}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: CANVAS, color: INK, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b backdrop-blur" style={{ borderColor: LINE, backgroundColor: "rgba(255,255,255,0.88)" }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-8">
          <div className="h-14 flex items-center justify-between gap-4">
            <button onClick={() => go("home")} className="flex items-center gap-2.5 shrink-0 text-left">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[11px] font-black" style={{ background: "linear-gradient(135deg,#1A73E8,#7C3AED)" }}>A</span>
              <span className="text-[13px] font-extrabold tracking-tight leading-none">
                Agentic Communications<span className="hidden sm:inline" style={{ color: MUTED }}> · India Digital Natives</span>
              </span>
            </button>
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV.slice(1).map((n) => (
                <button key={n.id} onClick={() => go(n.id)}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={view === n.id ? { backgroundColor: INK, color: "#fff" } : { color: MUTED }}>
                  {n.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="lg:hidden flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                style={view === n.id ? { backgroundColor: INK, color: "#fff" } : { color: MUTED, backgroundColor: "#fff", border: `1px solid ${LINE}` }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === "home" && <Home go={go} />}
      {view === "map" && <MarketMap go={go} />}
      {view === "companies" && <CompanyExplorer focus={focus} setFocus={setFocus} />}
      {view === "library" && <UseCaseLibrary go={go} />}
      {view === "matrix" && <OpportunityMatrix go={go} />}
      {view === "top" && <TopOpportunities go={go} />}
      {view === "seller" && <SellerMode focus={focus} setFocus={setFocus} />}

      <footer className="border-t mt-16" style={{ borderColor: LINE, backgroundColor: "#fff" }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-8">
          <p className="text-[10.5px] leading-relaxed max-w-3xl" style={{ color: MUTED }}>
            Research-based opportunity analysis assembled from public information — company filings, earnings commentary, official
            announcements and reputable financial press. Every claim is labelled <b>Fact</b> (attributable to a public source) or{" "}
            <b>Inference</b> (a reasoned opportunity hypothesis). No internal volumes, costs, architecture or operational processes are
            stated as fact. Scores are analytic judgements for prioritisation, not company data. Flipkart is excluded by scope.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Home ───────────────────────────────────────────────────────────────────

function Home({ go }: { go: (v: ViewId, slug?: string) => void }) {
  const econ = econSplit();
  const aud = audienceSplit();
  const nonCustomer = ALL_USE_CASES.length - (aud.customer ?? 0);

  return (
    <>
      <section className="relative overflow-hidden" style={{ background: "radial-gradient(1200px 520px at 72% -12%, #16243F, #0B1017)" }}>
        <div className="absolute inset-0 opacity-[0.35] pointer-events-none" style={{ backgroundImage: "linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-14 relative">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-[10.5px] font-semibold rounded-full px-3 py-1.5 border" style={{ color: "#8AB4F8", borderColor: "#8AB4F855", backgroundColor: "#8AB4F80D" }}>
              Opportunity intelligence · India digital natives · Flipkart excluded by scope
            </span>
            <h1 className="text-[36px] md:text-[58px] font-extrabold tracking-[-0.03em] leading-[1.02] mt-6 text-white max-w-4xl">
              The next win isn&apos;t deflecting contacts.<br />It&apos;s the conversations nobody is having.
            </h1>
            <p className="text-[15px] md:text-[17px] mt-6 max-w-2xl leading-relaxed" style={{ color: "#9BA6B4" }}>
              India&apos;s largest digital natives already automate support. The unclaimed value sits upstream and sideways — orders about
              to fail, sellers who never finish onboarding, partners disputing earnings, investors who stopped at KYC. Fifty workflows,
              scored on what an agent can actually finish.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 md:gap-5 mt-10 max-w-2xl">
            {[["10", "Companies"], ["50", "Opportunities"], ["5", "Archetypes"]].map(([n, l], i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                className="rounded-2xl px-4 py-4 md:px-6 md:py-5" style={{ backgroundColor: "#ffffff0A", border: "1px solid #ffffff14" }}>
                <div className="text-[32px] md:text-[44px] font-extrabold leading-none text-white tracking-tight">{n}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] mt-1.5" style={{ color: "#8AB4F8" }}>{l}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 mt-8">
            <button onClick={() => go("top")} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white" style={{ backgroundColor: "#1A73E8" }}>
              See the top opportunities <ArrowRight size={14} />
            </button>
            <button onClick={() => go("seller")} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white border" style={{ borderColor: "#ffffff33" }}>
              Seller mode
            </button>
          </div>
        </div>
      </section>

      {/* Thesis in 30 seconds */}
      <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <SectionHead kicker="The thesis in 30 seconds" title="Four findings that change where you point the pitch" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INSIGHTS.map((ins, i) => (
            <Fade key={ins.label} delay={i * 0.06}>
              <div className="rounded-2xl bg-white border p-5 h-full" style={{ borderColor: LINE }}>
                <div className="text-[30px] font-extrabold tracking-tight leading-none" style={{ color: "#1A73E8" }}>{ins.stat}</div>
                <div className="text-[12.5px] font-bold mt-2">{ins.label}</div>
                <p className="text-[11.5px] mt-1.5 leading-relaxed" style={{ color: MUTED }}>{ins.detail}</p>
              </div>
            </Fade>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl bg-white border p-5" style={{ borderColor: LINE }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: MUTED }}>Where the value comes from</div>
            <div className="flex h-3 rounded-full overflow-hidden mb-3">
              <span style={{ width: `${(econ.revenue / 50) * 100}%`, backgroundColor: "#188038" }} />
              <span style={{ width: `${(econ.both / 50) * 100}%`, backgroundColor: "#7C3AED" }} />
              <span style={{ width: `${(econ.cost / 50) * 100}%`, backgroundColor: "#1A73E8" }} />
            </div>
            <div className="space-y-1 text-[11px]">
              {[["Revenue creation", econ.revenue, "#188038"], ["Revenue + cost", econ.both, "#7C3AED"], ["Cost reduction", econ.cost, "#1A73E8"]].map(([l, n, c]) => (
                <div key={l as string} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5" style={{ color: MUTED }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c as string }} />{l}
                  </span>
                  <b>{n as number}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border p-5" style={{ borderColor: LINE }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: MUTED }}>Who the agent talks to</div>
            <div className="space-y-2">
              {Object.entries(aud).sort((a, b) => b[1] - a[1]).map(([k, n]) => {
                const m = AUDIENCE_META[k as keyof typeof AUDIENCE_META];
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span style={{ color: MUTED }}>{m.label}</span><b>{n}</b>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: LINE }}>
                      <div className="h-full rounded-full" style={{ width: `${(n / 50) * 100}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] mt-3 leading-relaxed" style={{ color: MUTED }}>
              {nonCustomer} of 50 opportunities target someone other than the end customer — the merchant, seller, driver or service
              professional. That is where the competitive gap is widest.
            </p>
          </div>

          <div className="rounded-2xl border p-5 text-white" style={{ borderColor: "transparent", background: "linear-gradient(150deg,#16243F,#0B1017)" }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: "#8AB4F8" }}>Strongest single opportunity</div>
            {TOP_TEN[0] && (
              <>
                <div className="text-[13px] font-extrabold leading-snug">{TOP_TEN[0].name}</div>
                <div className="text-[11px] mt-1" style={{ color: "#9BA6B4" }}>{TOP_TEN[0].company.name}</div>
                <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "#B7C0CC" }}>{TOP_TEN[0].agentic.slice(0, 180)}…</p>
                <button onClick={() => go("top")} className="mt-4 text-[11px] font-bold inline-flex items-center gap-1.5" style={{ color: "#8AB4F8" }}>
                  See all ten <ArrowRight size={12} />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Ranked companies teaser */}
      <section className="max-w-[1180px] mx-auto px-5 md:px-8 pb-6">
        <SectionHead kicker="The ten" title="Ranked by average opportunity score" lead="Score blends economic impact, interaction volume, agentic suitability, ease of deployment and strategic differentiation across each company's five workflows." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {RANKED_COMPANIES.map((c, i) => (
            <Fade key={c.slug} delay={i * 0.03}>
              <button onClick={() => go("companies", c.slug)} className="w-full text-left rounded-2xl bg-white border p-4 h-full hover:shadow-md transition-shadow" style={{ borderColor: LINE }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[13px] font-extrabold truncate">{c.shortName}</div>
                    <div className="text-[10px] mt-0.5 truncate" style={{ color: MUTED }}>{c.category}</div>
                  </div>
                  <ScoreRing score={scoreOf(c)} size={38} color={c.color} />
                </div>
                <div className="mt-3 pt-3 border-t text-[10.5px] leading-snug" style={{ borderColor: LINE, color: MUTED }}>
                  <b style={{ color: INK }}>Hero:</b> {heroUseCase(c).name}
                </div>
              </button>
            </Fade>
          ))}
        </div>
        <div className="mt-6">
          <Note>
            Companies were selected on transaction scale, customer or partner base, communication frequency and complexity, growth
            relevance, and the potential economic value of agent-led communications — with deliberate spread across business models so the
            set is not five variations of one company. Flipkart is excluded by scope.
          </Note>
        </div>
      </section>
    </>
  );
}

// ─── Market map ─────────────────────────────────────────────────────────────

function MarketMap({ go }: { go: (v: ViewId, slug?: string) => void }) {
  const groups = Object.keys(GROUP_META) as GroupId[];
  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-12 md:py-16">
      <SectionHead
        kicker="Market map"
        title="Ten companies, seven operating models"
        lead="Grouped by how the business actually runs — because the operating model, not the industry label, decides which agentic workflows matter. Select any company to open its full analysis."
      />
      <div className="space-y-4">
        {groups.filter((g) => COMPANIES.some((c) => c.group === g)).map((g) => {
          const m = GROUP_META[g];
          const list = COMPANIES.filter((c) => c.group === g);
          return (
            <Fade key={g}>
              <div className="rounded-2xl bg-white border overflow-hidden" style={{ borderColor: LINE }}>
                <div className="px-5 py-3 border-b flex flex-wrap items-baseline gap-x-3 gap-y-1" style={{ borderColor: LINE, backgroundColor: `${m.color}08` }}>
                  <span className="text-[12px] font-extrabold" style={{ color: m.color }}>{m.label}</span>
                  <span className="text-[11px]" style={{ color: MUTED }}>{m.blurb}</span>
                </div>
                <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((c) => (
                    <button key={c.slug} onClick={() => go("companies", c.slug)}
                      className="text-left rounded-xl border p-4 hover:shadow-md transition-all group" style={{ borderColor: LINE }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[14px] font-extrabold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
                            {c.shortName}
                          </div>
                          <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: MUTED }}>{c.oneLiner}</p>
                        </div>
                        <ScoreRing score={scoreOf(c)} size={40} color={c.color} />
                      </div>
                      <div className="mt-3 pt-3 border-t flex flex-wrap gap-1.5" style={{ borderColor: LINE }}>
                        {c.useCases.slice(0, 2).map((u) => (
                          <Chip key={u.id} color={MUTED}>{u.name.length > 30 ? `${u.name.slice(0, 29)}…` : u.name}</Chip>
                        ))}
                      </div>
                      <div className="mt-2.5 text-[10.5px] font-bold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: c.color }}>
                        Open analysis <ArrowRight size={11} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Fade>
          );
        })}
      </div>
    </section>
  );
}
