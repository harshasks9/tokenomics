"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, ChevronDown, Download, FileText, History,
  Layers, Printer, Save, Settings2, TriangleAlert, Wand2, X, Copy,
} from "lucide-react";
import { PALETTE, ARCH_LAYERS, fmtMoney, fmtNum } from "../../data";
import {
  BuilderState, CHANNELS, CAPABILITIES, MODULE_ORDER, INDUSTRY_DEFAULTS,
  DEFAULT_RATES, RATE_LABELS, OUTCOME_OPTIONS,
  computeEffort, computeTco, computeRoiModel, computeRecommendation,
  applyScenario, coreCapabilityIds, type Rates,
} from "./builder-data";

const STORAGE_KEY = "voice-solution-builder-v1";
const VERSIONS_KEY = "voice-solution-builder-versions-v1";

const PROVENANCE_STYLE: Record<string, { label: string; color: string }> = {
  customer: { label: "Customer input", color: "#188038" },
  benchmark: { label: "Benchmark", color: "#1A73E8" },
  assumption: { label: "Assumption", color: "#D97706" },
  estimate: { label: "System estimate", color: "#7C3AED" },
};

function defaultState(industry = "fsi"): BuilderState {
  const ind = INDUSTRY_DEFAULTS.find((i) => i.id === industry)!;
  return {
    profile: {
      industry: ind.id, customerName: "", geography: "India", size: "Enterprise (5,000+ employees)",
      monthlyInteractions: ind.monthlyInteractions, costPerInteraction: ind.costPerInteraction,
      ahtMinutes: ind.ahtMinutes, currentContainment: ind.currentContainment, targetContainment: ind.targetContainment,
      languages: ind.languages, residency: "preferred", ccPlatform: "incumbent", cloud: "multi",
      timelineWeeks: 12, outcomes: ["Reduce cost per interaction", "Increase containment"],
    },
    channels: [...ind.channels],
    capabilities: Array.from(new Set([...coreCapabilityIds(), ...ind.capabilities])),
    rates: { ...DEFAULT_RATES },
  };
}

const SECTIONS = [
  { id: "profile", label: "1 · Profile" },
  { id: "channels", label: "2 · Channels" },
  { id: "capabilities", label: "3 · Capabilities" },
  { id: "architecture", label: "4 · Architecture" },
  { id: "tco", label: "5 · TCO" },
  { id: "roi", label: "6 · Value" },
  { id: "recommend", label: "7 · Recommendation" },
  { id: "exports", label: "8 · Exports" },
];

function SectionCard({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-2xl border border-[#E8EAED] bg-white p-5 md:p-7 scroll-mt-28">
      <h2 className="text-lg md:text-xl font-extrabold text-[#202124]">{title}</h2>
      <p className="text-xs text-[#5F6368] mt-1 mb-5 max-w-2xl leading-relaxed">{subtitle}</p>
      {children}
    </section>
  );
}

function Num({ label, value, onChange, step = 1, prefix }: { label: string; value: number; onChange: (n: number) => void; step?: number; prefix?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-[#5F6368]">{label}</span>
      <div className="flex items-center gap-1 mt-1">
        {prefix && <span className="text-xs text-[#9AA0A6]">{prefix}</span>}
        <input
          type="number" value={value} step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full text-sm border border-[#DADCE0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#1A73E8] tabular-nums"
        />
      </div>
    </label>
  );
}

function Sel({ label, value, options, onChange }: { label: string; value: string; options: { v: string; l: string }[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-[#5F6368]">{label}</span>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full text-sm border border-[#DADCE0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#1A73E8]"
      >
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}

export default function SolutionBuilder() {
  const [state, setState] = useState<BuilderState>(defaultState());
  const [hydrated, setHydrated] = useState(false);
  const [scenario, setScenario] = useState<"conservative" | "expected" | "upside">("expected");
  const [showRates, setShowRates] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<{ ts: string; label: string; state: BuilderState }[]>([]);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState(), ...JSON.parse(raw) });
      const vraw = localStorage.getItem(VERSIONS_KEY);
      if (vraw) setVersions(JSON.parse(vraw));
    } catch {}
    setHydrated(true);
  }, []);

  // autosave (debounced)
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    }, 500);
  }, [state, hydrated]);

  const scenarioState = useMemo(() => applyScenario(state, scenario), [state, scenario]);
  const effort = useMemo(() => computeEffort(state), [state]);
  const tco = useMemo(() => computeTco(scenarioState), [scenarioState]);
  const roi = useMemo(() => computeRoiModel(scenarioState, tco), [scenarioState, tco]);
  const rec = useMemo(() => computeRecommendation(state), [state]);
  const ind = INDUSTRY_DEFAULTS.find((i) => i.id === state.profile.industry)!;

  const setProfile = (patch: Partial<BuilderState["profile"]>) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  const setRates = (patch: Partial<Rates>) => setState((s) => ({ ...s, rates: { ...s.rates, ...patch } }));

  const switchIndustry = (id: string) => {
    const fresh = defaultState(id);
    setState((s) => ({ ...fresh, profile: { ...fresh.profile, customerName: s.profile.customerName, geography: s.profile.geography } }));
  };

  const toggleChannel = (id: string) =>
    setState((s) => ({ ...s, channels: s.channels.includes(id) ? s.channels.filter((c) => c !== id) : [...s.channels, id] }));

  const toggleCap = (id: string) =>
    setState((s) => ({ ...s, capabilities: s.capabilities.includes(id) ? s.capabilities.filter((c) => c !== id) : [...s.capabilities, id] }));

  const saveVersion = () => {
    const v = { ts: new Date().toLocaleString(), label: `${ind.name}${state.profile.customerName ? ` · ${state.profile.customerName}` : ""} · ${state.channels.length}ch/${state.capabilities.length}cap`, state };
    const next = [v, ...versions].slice(0, 10);
    setVersions(next);
    try { localStorage.setItem(VERSIONS_KEY, JSON.stringify(next)); } catch {}
  };

  const copyInternalBrief = async () => {
    const md = [
      `# Opportunity brief — ${state.profile.customerName || "(customer)"} (${ind.name}) — INTERNAL`,
      `Pursuit: ${rec.pursuit}. ${rec.pursuitDetail}`,
      `Entry use case: ${rec.entryUseCase}. Pilot: ${rec.pilotScope}.`,
      `Channels: ${state.channels.map((c) => CHANNELS.find((x) => x.id === c)?.name).join(", ")}.`,
      `Capabilities: ${state.capabilities.map((c) => CAPABILITIES.find((x) => x.id === c)?.name).join(", ")}.`,
      `Effort: ~${effort.total} person-weeks. One-time ${fmtMoney(tco.oneTime.total)}, Yr run-rate ${fmtMoney(tco.recurringYr.total + tco.variableYr.total)}, 3-yr TCO ${fmtMoney(tco.threeYearTotal)} (${scenario}).`,
      `Value: gross ${fmtMoney(roi.grossBenefitYr)}/yr, payback ${roi.paybackMonths === Infinity ? "n/a" : roi.paybackMonths.toFixed(1) + " mo"}, NPV ${fmtMoney(roi.npv)}, 3-yr ROI ${roi.threeYearRoi.toFixed(0)}%.`,
      `Partner profile: ${rec.partnerProfile}.`,
      `Warnings: ${rec.warnings.join(" | ") || "none"}.`,
      `Deferred: ${rec.deferred.map((d) => d.name).join(", ") || "none"}.`,
      `Stakeholders: ${rec.stakeholders.join(", ")}. Risks: ${rec.risks.join("; ")}.`,
      `All figures are modelling estimates from editable assumptions — not quotes. Internal only.`,
    ].join("\n\n");
    await navigator.clipboard.writeText(md);
    setCopied("brief"); setTimeout(() => setCopied(null), 2000);
  };

  const selCaps = CAPABILITIES.filter((c) => state.capabilities.includes(c.id));
  const gecxCaps = selCaps.filter((c) => c.owner === "gecx");
  const partnerCaps = selCaps.filter((c) => c.owner === "partner");

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Print styles for the proposal */}
      <style>{`@media print { body * { visibility: hidden !important; } #proposal-doc, #proposal-doc * { visibility: visible !important; } #proposal-doc { position: absolute !important; inset: 0 !important; overflow: visible !important; max-height: none !important; border: none !important; box-shadow: none !important; } }`}</style>

      <header className="sticky top-0 z-40 bg-[#202124] text-white print:hidden">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/voice/internal" className="text-white/60 hover:text-white shrink-0"><ArrowLeft size={16} /></Link>
            <Wand2 size={15} className="text-[#8AB4F8] shrink-0" />
            <span className="text-sm font-bold truncate">Solution Builder</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDD663] text-[#202124] rounded px-2 py-0.5 shrink-0">Internal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] text-white/50">Autosaves locally</span>
            <button onClick={saveVersion} className="text-[11px] font-semibold border border-white/25 rounded-full px-3 py-1.5 hover:bg-white/10 inline-flex items-center gap-1.5"><Save size={11} /> Snapshot</button>
            <button onClick={() => setShowVersions(!showVersions)} className="text-[11px] font-semibold border border-white/25 rounded-full px-3 py-1.5 hover:bg-white/10 inline-flex items-center gap-1.5"><History size={11} /> {versions.length}</button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-5 pb-2 flex gap-3 overflow-x-auto text-[11px] font-medium text-white/60">
          {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} className="hover:text-white whitespace-nowrap">{s.label}</a>)}
        </nav>
      </header>

      {showVersions && versions.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 pt-3 print:hidden">
          <div className="rounded-xl border border-[#E8EAED] bg-white p-3 text-xs">
            <div className="font-bold mb-2">Saved snapshots (this browser)</div>
            {versions.map((v, i) => (
              <button key={i} onClick={() => { setState(v.state); setShowVersions(false); }} className="block w-full text-left px-2 py-1.5 rounded hover:bg-[#F8F9FA] text-[#5F6368]">
                <span className="font-semibold text-[#202124]">{v.ts}</span> — {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 py-6 grid lg:grid-cols-[1fr_290px] gap-6 items-start">
        {/* ── Main column ── */}
        <div className="space-y-6 min-w-0">
          {/* Profile */}
          <SectionCard id="profile" title="Customer profile" subtitle="Industry selection loads sensible defaults for channels, capabilities, and economics — every value below is editable and treated as a customer input once you change it.">
            <div className="flex flex-wrap gap-2 mb-5">
              {INDUSTRY_DEFAULTS.map((i) => (
                <button key={i.id} onClick={() => switchIndustry(i.id)}
                  className={`text-xs font-semibold rounded-full px-4 py-2 border transition-colors ${state.profile.industry === i.id ? "bg-[#1A73E8] text-white border-transparent" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"}`}>
                  {i.name}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-[11px] font-semibold text-[#5F6368]">Customer name</span>
                <input value={state.profile.customerName} onChange={(e) => setProfile({ customerName: e.target.value })} placeholder="e.g., Acme Bank"
                  className="mt-1 w-full text-sm border border-[#DADCE0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#1A73E8]" />
              </label>
              <Sel label="Geography" value={state.profile.geography} onChange={(v) => setProfile({ geography: v })}
                options={["India", "APAC", "EMEA", "Americas", "Global"].map((g) => ({ v: g, l: g }))} />
              <Sel label="Customer size" value={state.profile.size} onChange={(v) => setProfile({ size: v })}
                options={["Mid-market (500–5,000)", "Enterprise (5,000+ employees)", "Large enterprise (50,000+)"].map((g) => ({ v: g, l: g }))} />
              <Num label="Monthly interactions" value={state.profile.monthlyInteractions} onChange={(n) => setProfile({ monthlyInteractions: n })} step={10000} />
              <Num label="Current cost per interaction ($)" value={state.profile.costPerInteraction} onChange={(n) => setProfile({ costPerInteraction: n })} step={0.1} />
              <Num label="Average handling time (min)" value={state.profile.ahtMinutes} onChange={(n) => setProfile({ ahtMinutes: n })} step={0.5} />
              <Num label="Current containment (%)" value={state.profile.currentContainment} onChange={(n) => setProfile({ currentContainment: n })} />
              <Num label="Target containment (%)" value={state.profile.targetContainment} onChange={(n) => setProfile({ targetContainment: n })} />
              <Num label="Languages required" value={state.profile.languages} onChange={(n) => setProfile({ languages: n })} />
              <Sel label="Data residency" value={state.profile.residency} onChange={(v) => setProfile({ residency: v as never })}
                options={[{ v: "none", l: "No constraint" }, { v: "preferred", l: "In-region preferred" }, { v: "mandatory", l: "Mandatory (regulated)" }]} />
              <Sel label="Contact-centre platform" value={state.profile.ccPlatform} onChange={(v) => setProfile({ ccPlatform: v as never })}
                options={[{ v: "none", l: "None / minimal" }, { v: "gecx", l: "Customer Engagement Suite" }, { v: "incumbent", l: "Incumbent (Genesys/NICE/other)" }]} />
              <Sel label="Cloud environment" value={state.profile.cloud} onChange={(v) => setProfile({ cloud: v as never })}
                options={[{ v: "gcp", l: "Google Cloud primary" }, { v: "multi", l: "Multi-cloud" }, { v: "other", l: "Other primary cloud" }]} />
              <Num label="Deployment timeline (weeks)" value={state.profile.timelineWeeks} onChange={(n) => setProfile({ timelineWeeks: n })} />
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-[#5F6368]">Target business outcomes</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {OUTCOME_OPTIONS.map((o) => {
                  const on = state.profile.outcomes.includes(o);
                  return (
                    <button key={o} onClick={() => setProfile({ outcomes: on ? state.profile.outcomes.filter((x) => x !== o) : [...state.profile.outcomes, o] })}
                      className={`text-[11px] font-medium rounded-full px-3 py-1.5 border transition-colors ${on ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"}`}>
                      {on && <Check size={10} className="inline mr-1 -mt-0.5" />}{o}
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          {/* Channels */}
          <SectionCard id="channels" title="Experience channels" subtitle="Select the channels in scope. Each card shows required integrations, dependencies, indicative effort, and what drives ongoing consumption.">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {CHANNELS.map((c) => {
                const on = state.channels.includes(c.id);
                return (
                  <button key={c.id} onClick={() => toggleChannel(c.id)}
                    className={`text-left rounded-xl border p-4 transition-all ${on ? "border-[#1A73E8] bg-[#F8FAFF] shadow-sm" : "border-[#E8EAED] bg-white hover:border-[#DADCE0]"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold">{c.name}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${on ? "bg-[#1A73E8] border-[#1A73E8]" : "border-[#DADCE0]"}`}>
                        {on && <Check size={12} className="text-white" />}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-1.5 py-px" style={{ backgroundColor: c.complexity === 3 ? "#FCE8E6" : c.complexity === 2 ? "#FEF7E0" : "#E6F4EA", color: c.complexity === 3 ? "#B3261E" : c.complexity === 2 ? "#B26A00" : "#188038" }}>
                        {c.complexity === 3 ? "Complex" : c.complexity === 2 ? "Moderate" : "Simple"} · ~{c.effortWeeks}pw
                      </span>
                      {c.interactionTypes.slice(0, 2).map((t) => <span key={t} className="text-[9px] text-[#9AA0A6] border border-[#E8EAED] rounded-full px-1.5 py-px">{t}</span>)}
                    </div>
                    {on && (
                      <div className="mt-3 pt-3 border-t border-[#E8EAED] text-[10px] text-[#5F6368] space-y-1">
                        <p><span className="font-bold text-[#202124]">Integrations:</span> {c.integrations.join(", ")}</p>
                        <p><span className="font-bold text-[#202124]">Products:</span> {c.products.join(", ")}</p>
                        <p><span className="font-bold text-[#202124]">Partner:</span> {c.partnerDeps.join(", ")}</p>
                        <p><span className="font-bold text-[#202124]">Consumption:</span> {c.consumptionDrivers.join(", ")}</p>
                        {c.warning && <p className="text-[#B26A00] font-medium flex gap-1"><TriangleAlert size={11} className="shrink-0 mt-px" />{c.warning}</p>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Capabilities */}
          <SectionCard id="capabilities" title="Capability modules" subtitle="Core capabilities (marked ●) are included in every credible solution. Add modular capabilities per the entry use case; high-complexity items outside the entry use case are flagged for phase 2.">
            <div className="space-y-5">
              {MODULE_ORDER.filter((m) => m !== "Experience channels").map((mod) => (
                <div key={mod}>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">{mod}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {CAPABILITIES.filter((c) => c.module === mod).map((c) => {
                      const on = state.capabilities.includes(c.id);
                      return (
                        <button key={c.id} onClick={() => !c.core && toggleCap(c.id)} title={c.desc}
                          className={`text-[11px] font-medium rounded-full px-3 py-1.5 border transition-colors ${
                            c.core ? "bg-[#202124] text-white border-transparent cursor-default"
                              : on ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"
                          }`}>
                          {c.core ? "● " : on ? <Check size={10} className="inline mr-1 -mt-0.5" /> : "+ "}{c.name}
                          <span className="text-[9px] opacity-60 ml-1">~{c.effortWeeks}pw</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#9AA0A6] mt-4">Experience channels are configured in section 2. Effort figures are partner person-week assumptions — editable via the rate card in the summary panel.</p>
          </SectionCard>

          {/* Architecture */}
          <SectionCard id="architecture" title="Generated architecture" subtitle="Updates live as you add or remove channels and capabilities. Ownership is explicit: Google platform, GECX, partner-built, customer-owned.">
            <div className="space-y-2">
              {/* Channels layer */}
              <div className="rounded-xl border-l-4 border border-[#E8EAED] p-4" style={{ borderLeftColor: "#00838F" }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-sm font-extrabold">Channels</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00838F]">Partner-integrated</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {state.channels.length === 0 && <span className="text-xs text-[#9AA0A6]">No channels selected</span>}
                  {state.channels.map((cid) => {
                    const c = CHANNELS.find((x) => x.id === cid)!;
                    return <span key={cid} className="text-[11px] border border-[#E8EAED] bg-[#F8F9FA] rounded-full px-2.5 py-1">{c.name}</span>;
                  })}
                </div>
              </div>
              {/* Agent layer */}
              <div className="rounded-xl border-l-4 border border-[#E8EAED] p-4" style={{ borderLeftColor: PALETTE.blue }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-sm font-extrabold">Gemini Enterprise Agent Platform</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: PALETTE.blue }}>Google Cloud</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selCaps.filter((c) => c.owner === "google" || c.owner === "joint").map((c) => (
                    <span key={c.id} className="text-[11px] border rounded-full px-2.5 py-1" style={{ borderColor: `${PALETTE.blue}33`, backgroundColor: `${PALETTE.blue}08` }}>{c.name}</span>
                  ))}
                </div>
              </div>
              {/* GECX layer */}
              {(gecxCaps.length > 0 || state.channels.includes("contact-centre")) && (
                <div className="rounded-xl border-l-4 border border-[#E8EAED] p-4" style={{ borderLeftColor: "#D97706" }}>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <span className="text-sm font-extrabold">Customer Engagement Suite / incumbent CC</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">{state.profile.ccPlatform === "gecx" ? "GECX-led" : "Integrate incumbent"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {gecxCaps.map((c) => <span key={c.id} className="text-[11px] border border-[#FDE293] bg-[#FEF7E0] rounded-full px-2.5 py-1">{c.name}</span>)}
                    <span className="text-[11px] border border-[#FDE293] bg-[#FEF7E0] rounded-full px-2.5 py-1">Human-agent desktop &amp; routing</span>
                  </div>
                </div>
              )}
              {/* Partner layer */}
              <div className="rounded-xl border-l-4 border border-[#E8EAED] p-4" style={{ borderLeftColor: "#00838F" }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-sm font-extrabold">Partner-built components</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00838F]">Partner</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {partnerCaps.map((c) => <span key={c.id} className="text-[11px] border border-[#E8EAED] bg-[#F8F9FA] rounded-full px-2.5 py-1">{c.name}</span>)}
                  <span className="text-[11px] border border-[#E8EAED] bg-[#F8F9FA] rounded-full px-2.5 py-1">Telephony / BSP wiring</span>
                  <span className="text-[11px] border border-[#E8EAED] bg-[#F8F9FA] rounded-full px-2.5 py-1">System connectors</span>
                </div>
              </div>
              {/* Customer layer */}
              <div className="rounded-xl border-l-4 border border-[#E8EAED] p-4" style={{ borderLeftColor: "#5F6368" }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-sm font-extrabold">Customer-owned</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368]">Customer</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Systems of record & APIs", "Business rules & offer matrices", "Data, consent & policies", "Escalation teams", `Identity provider`].map((x) => (
                    <span key={x} className="text-[11px] border border-[#E8EAED] bg-white rounded-full px-2.5 py-1 text-[#5F6368]">{x}</span>
                  ))}
                </div>
              </div>
              {/* Trust strip */}
              <div className="rounded-xl border border-dashed border-[#DADCE0] p-3 text-[11px] text-[#5F6368] flex flex-wrap gap-x-4 gap-y-1">
                <span className="font-bold text-[#202124]">Always on:</span>
                <span>IAM &amp; least-privilege tools</span><span>{state.profile.residency !== "none" ? "In-region residency + VPC-SC" : "Regional deployment"}</span>
                <span>100% audit logging</span><span>Continuous evaluation</span>
                <span>Human approvals {state.capabilities.includes("approvals") ? "on above-threshold actions" : "(add the Approvals capability)"}</span>
              </div>
              {rec.warnings.length > 0 && (
                <div className="rounded-xl bg-[#FEF7E0] border border-[#FDE293] p-4 space-y-1.5">
                  {rec.warnings.map((w) => (
                    <p key={w} className="text-[11px] text-[#7A5A00] flex gap-2"><TriangleAlert size={13} className="shrink-0 mt-px text-[#B26A00]" /> {w}</p>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* TCO */}
          <SectionCard id="tco" title="Three-year TCO (modelled)" subtitle="Built from editable assumptions — partner rates, consumption rates, and operations percentages. No fixed pricing; treat outputs as planning estimates, never quotes.">
            <div className="flex items-center gap-1 border border-[#DADCE0] rounded-full p-0.5 bg-white w-fit mb-5">
              {(["conservative", "expected", "upside"] as const).map((s) => (
                <button key={s} onClick={() => setScenario(s)}
                  className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full capitalize ${scenario === s ? "bg-[#202124] text-white" : "text-[#5F6368] hover:bg-[#F1F3F4]"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                ["One-time build", fmtMoney(tco.oneTime.total), "discovery + implementation + change mgmt + contingency"],
                ["Recurring / year", fmtMoney(tco.recurringYr.total), "managed operations + security & observability"],
                ["Variable / year", fmtMoney(tco.variableYr.total), "model + speech + telephony + messaging at your volumes"],
                ["3-year TCO", fmtMoney(tco.threeYearTotal), `cost per interaction ≈ ${tco.costPerInteraction < 0.01 ? "<$0.01" : `$${tco.costPerInteraction.toFixed(2)}`} · per resolved ≈ $${tco.costPerResolved.toFixed(2)}`],
              ].map(([t, v, d]) => (
                <div key={t as string} className="rounded-xl border border-[#E8EAED] bg-[#F8F9FA] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368]">{t}</div>
                  <div className="text-xl font-extrabold tabular-nums mt-1" style={{ color: PALETTE.blue }}>{v}</div>
                  <div className="text-[10px] text-[#9AA0A6] mt-1 leading-snug">{d}</div>
                </div>
              ))}
            </div>
            {/* breakdown bars */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">One-time cost stack</div>
                {[
                  ["Discovery & design", tco.oneTime.discovery],
                  ["Implementation & integration", tco.oneTime.implementation],
                  ["Change management", tco.oneTime.changeMgmt],
                  ["Contingency", tco.oneTime.contingency],
                ].map(([name, val]) => (
                  <div key={name as string} className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] text-[#5F6368] w-44 shrink-0">{name}</span>
                    <div className="flex-1 h-4 bg-[#F1F3F4] rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${Math.min(100, ((val as number) / tco.oneTime.total) * 100)}%`, backgroundColor: PALETTE.blue }} />
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums w-14 text-right">{fmtMoney(val as number)}</span>
                  </div>
                ))}
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#5F6368] mb-2 mt-4">Variable / year</div>
                {[
                  ["Model & speech", tco.variableYr.model],
                  ["Telephony", tco.variableYr.telephony],
                  ["Messaging", tco.variableYr.messaging],
                ].map(([name, val]) => (
                  <div key={name as string} className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] text-[#5F6368] w-44 shrink-0">{name}</span>
                    <div className="flex-1 h-4 bg-[#F1F3F4] rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${tco.variableYr.total ? Math.min(100, ((val as number) / tco.variableYr.total) * 100) : 0}%`, backgroundColor: "#7C3AED" }} />
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums w-14 text-right">{fmtMoney(val as number)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Cost by channel (build + yr-1 variable)</div>
                {tco.byChannel.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[11px] border-b border-[#F1F3F4] py-1.5">
                    <span className="text-[#5F6368]">{c.name}</span>
                    <span className="font-semibold tabular-nums">{fmtMoney(c.oneTime + c.variableYr)}</span>
                  </div>
                ))}
                <details className="mt-3 text-[11px] text-[#5F6368]">
                  <summary className="cursor-pointer font-semibold text-[#202124]">Cost by capability (build)</summary>
                  <div className="mt-1.5 max-h-40 overflow-y-auto">
                    {tco.byCapability.map((c) => (
                      <div key={c.name} className="flex items-center justify-between py-1 border-b border-[#F1F3F4]">
                        <span>{c.name}</span><span className="tabular-nums font-semibold">{fmtMoney(c.oneTime)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </SectionCard>

          {/* ROI */}
          <SectionCard id="roi" title="Business value & ROI (modelled)" subtitle="Value levers activate based on selected capabilities. Provenance is labeled on every lever; the pilot's job is to convert assumptions into customer-verified numbers.">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                ["Gross benefit / year", fmtMoney(roi.grossBenefitYr), PALETTE.green],
                ["Net benefit / year", fmtMoney(roi.netBenefitYr), roi.netBenefitYr >= 0 ? PALETTE.green : PALETTE.red],
                ["Payback", roi.paybackMonths === Infinity ? "—" : `${roi.paybackMonths.toFixed(1)} mo`, PALETTE.ink],
                ["3-yr NPV @ " + state.rates.discountRatePct + "%", fmtMoney(roi.npv), roi.npv >= 0 ? PALETTE.green : PALETTE.red],
              ].map(([t, v, c]) => (
                <div key={t as string} className="rounded-xl border border-[#E8EAED] bg-white p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368]">{t}</div>
                  <div className="text-xl font-extrabold tabular-nums mt-1" style={{ color: c as string }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Value by lever</div>
            {roi.byLever.map((l) => (
              <div key={l.name} className="flex items-center gap-2 mb-2">
                <span className="text-[11px] text-[#5F6368] flex-1">{l.name}</span>
                <span className="text-[9px] font-semibold rounded-full px-1.5 py-px shrink-0" style={{ backgroundColor: `${PROVENANCE_STYLE[l.provenance].color}14`, color: PROVENANCE_STYLE[l.provenance].color }}>{PROVENANCE_STYLE[l.provenance].label}</span>
                <span className="text-[11px] font-bold tabular-nums w-16 text-right">{fmtMoney(l.value)}</span>
              </div>
            ))}
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-[11px]">
              <div className="rounded-lg bg-[#F8F9FA] border border-[#E8EAED] p-3">
                <span className="font-bold text-[#202124]">3-yr ROI:</span> {roi.threeYearRoi.toFixed(0)}%
              </div>
              <div className="rounded-lg bg-[#F8F9FA] border border-[#E8EAED] p-3">
                <span className="font-bold text-[#202124]">Break-even volume:</span> {fmtNum(roi.breakEvenMonthlyVolume)} interactions/mo
              </div>
              <div className="rounded-lg bg-[#F8F9FA] border border-[#E8EAED] p-3">
                <span className="font-bold text-[#202124]">Google Cloud consumption est.:</span> {fmtMoney(tco.variableYr.model)}/yr
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
              {Object.entries(PROVENANCE_STYLE).map(([k, v]) => (
                <span key={k} className="rounded-full px-2 py-0.5 font-semibold" style={{ backgroundColor: `${v.color}14`, color: v.color }}>{v.label}</span>
              ))}
              <span className="text-[#9AA0A6]">— every figure in this builder carries one of these labels; scenario toggle (in TCO) applies to value too.</span>
            </div>
          </SectionCard>

          {/* Recommendation */}
          <SectionCard id="recommend" title="Solution recommendation" subtitle="Rule-based synthesis of the profile and selections — the starting point for the account plan, not a substitute for discovery.">
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: `${PALETTE.blue}0A`, border: `2px solid ${PALETTE.blue}33` }}>
              <div className="text-sm font-extrabold" style={{ color: PALETTE.blue }}>{rec.pursuit}</div>
              <p className="text-xs text-[#202124] mt-1.5 leading-relaxed">{rec.pursuitDetail}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <p><span className="font-bold">Entry use case:</span> {rec.entryUseCase}</p>
                <p><span className="font-bold">Pilot scope:</span> {rec.pilotScope}</p>
                <p><span className="font-bold">Time to value:</span> ~{rec.timeToValueWeeks} weeks to measurable pilot results</p>
                <p><span className="font-bold">Partner profile:</span> {rec.partnerProfile}</p>
                <div>
                  <span className="font-bold">Stakeholders required:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">{rec.stakeholders.map((s) => <span key={s} className="border border-[#E8EAED] rounded-full px-2.5 py-1 text-[#5F6368]">{s}</span>)}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-bold">Defer to phase 2:</span>
                  {rec.deferred.length === 0 ? <span className="text-[#5F6368]"> nothing — scope is lean</span> : (
                    <ul className="mt-1.5 space-y-1 text-[#5F6368]">{rec.deferred.map((d) => <li key={d.name}>· <span className="font-semibold text-[#202124]">{d.name}</span> — {d.reason}</li>)}</ul>
                  )}
                </div>
                <div>
                  <span className="font-bold">Key risks:</span>
                  <ul className="mt-1.5 space-y-1 text-[#5F6368]">{rec.risks.map((r) => <li key={r}>· {r}</li>)}</ul>
                </div>
                <div>
                  <span className="font-bold">Expansion roadmap:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">{rec.expansion.map((e, i) => <span key={e} className="rounded-full px-2.5 py-1" style={{ backgroundColor: `${PALETTE.blue}${i === 0 ? "22" : "10"}`, color: PALETTE.blue }}>{i + 1}. {e}</span>)}</div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Exports */}
          <SectionCard id="exports" title="Reusable outputs" subtitle="The customer proposal automatically strips internal content: pursuit routing, GECX logic, margins, confidence scores, and unapproved assumptions are replaced with customer-safe framing.">
            <div className="grid sm:grid-cols-2 gap-3">
              <button onClick={() => setProposalOpen(true)} className="rounded-xl border-2 border-[#1A73E8] bg-[#F8FAFF] p-4 text-left hover:shadow-md transition-shadow">
                <FileText size={16} className="text-[#1A73E8] mb-2" />
                <div className="text-sm font-extrabold">Customer proposal (PDF)</div>
                <p className="text-[11px] text-[#5F6368] mt-1">Customer-ready solution summary with {state.profile.customerName || "the customer"}&apos;s name — preview, then print / save as PDF and send.</p>
              </button>
              <button onClick={copyInternalBrief} className="rounded-xl border border-[#E8EAED] bg-white p-4 text-left hover:shadow-md transition-shadow">
                {copied === "brief" ? <Check size={16} className="text-[#188038] mb-2" /> : <Copy size={16} className="text-[#5F6368] mb-2" />}
                <div className="text-sm font-extrabold">Internal opportunity brief</div>
                <p className="text-[11px] text-[#5F6368] mt-1">{copied === "brief" ? "Copied to clipboard." : "Markdown brief incl. pursuit, warnings, and economics — for the account plan. Copies to clipboard."}</p>
              </button>
            </div>
            <p className="text-[10px] text-[#9AA0A6] mt-3">Also derivable from this configuration: bill of capabilities (section 3), integration checklist (section 2 cards), risk &amp; governance checklist (sections 4 &amp; 7), and pilot proposal (section 7). The proposal PDF includes the pilot plan and mutual next steps.</p>
          </SectionCard>
        </div>

        {/* ── Summary sidebar ── */}
        <aside className="lg:sticky lg:top-24 space-y-3 print:hidden">
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Live configuration</div>
            <div className="text-sm font-extrabold">{state.profile.customerName || "Unnamed customer"}</div>
            <div className="text-[11px] text-[#5F6368]">{ind.name} · {state.profile.geography} · {fmtNum(state.profile.monthlyInteractions)}/mo</div>
            <div className="mt-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-[#5F6368]">Channels</span><span className="font-bold">{state.channels.length}</span></div>
              <div className="flex justify-between"><span className="text-[#5F6368]">Capabilities</span><span className="font-bold">{state.capabilities.length}</span></div>
              <div className="flex justify-between"><span className="text-[#5F6368]">Effort</span><span className="font-bold">~{effort.total} pw</span></div>
              <div className="flex justify-between"><span className="text-[#5F6368]">One-time</span><span className="font-bold tabular-nums">{fmtMoney(tco.oneTime.total)}</span></div>
              <div className="flex justify-between"><span className="text-[#5F6368]">Run-rate / yr</span><span className="font-bold tabular-nums">{fmtMoney(tco.recurringYr.total + tco.variableYr.total)}</span></div>
              <div className="flex justify-between"><span className="text-[#5F6368]">Gross value / yr</span><span className="font-bold tabular-nums" style={{ color: PALETTE.green }}>{fmtMoney(roi.grossBenefitYr)}</span></div>
              <div className="flex justify-between"><span className="text-[#5F6368]">Payback</span><span className="font-bold">{roi.paybackMonths === Infinity ? "—" : `${roi.paybackMonths.toFixed(1)} mo`}</span></div>
            </div>
            {rec.warnings.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#F1F3F4] text-[10px] text-[#B26A00] flex items-start gap-1.5">
                <TriangleAlert size={12} className="shrink-0 mt-px" /> {rec.warnings.length} warning{rec.warnings.length > 1 ? "s" : ""} — see Architecture
              </div>
            )}
          </div>
          <button onClick={() => setShowRates(!showRates)} className="w-full rounded-2xl border border-[#E8EAED] bg-white p-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] flex items-center gap-1.5"><Settings2 size={12} /> Assumption rate card</span>
              <ChevronDown size={14} className={`text-[#9AA0A6] transition-transform ${showRates ? "rotate-180" : ""}`} />
            </div>
            {showRates && (
              <div className="mt-3 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                {RATE_LABELS.map((r) => (
                  <div key={r.key}>
                    <span className="text-[10px] text-[#5F6368]">{r.label}</span>
                    <input
                      type="number" step={r.format === "money" ? 0.01 : r.format === "share" ? 0.05 : 1}
                      value={state.rates[r.key]}
                      onChange={(e) => setRates({ [r.key]: Number(e.target.value) } as Partial<Rates>)}
                      className="mt-0.5 w-full text-xs border border-[#DADCE0] rounded-lg px-2.5 py-1.5 tabular-nums focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>
                ))}
                <p className="text-[9px] text-[#9AA0A6]">All rates are editable assumptions — never present as Google pricing.</p>
              </div>
            )}
          </button>
          <div className="rounded-2xl border border-dashed border-[#DADCE0] p-4 text-[10px] text-[#9AA0A6] leading-relaxed">
            Estimates only. This tool models scenarios from editable assumptions; it does not quote prices, guarantee outcomes, or replace a formal solution design.
          </div>
        </aside>
      </div>

      {/* ── Proposal modal / print doc ── */}
      {proposalOpen && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-start justify-center overflow-y-auto p-4 md:p-8 print:p-0 print:bg-white print:relative print:overflow-visible">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl print:shadow-none print:rounded-none">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EAED] print:hidden">
              <div className="text-sm font-bold">Customer proposal preview — internal content removed</div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1A73E8] rounded-full px-4 py-2 hover:bg-[#174EA6]">
                  <Printer size={13} /> Print / Save as PDF
                </button>
                <button onClick={() => setProposalOpen(false)} className="p-2 text-[#5F6368] hover:text-[#202124]"><X size={16} /></button>
              </div>
            </div>
            <div id="proposal-doc" className="px-8 py-8 text-[13px] leading-relaxed text-[#202124]">
              <div className="border-b-2 border-[#1A73E8] pb-4 mb-6">
                <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A73E8]">Solution proposal · Prepared {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
                <h1 className="text-2xl font-extrabold mt-2">Agentic Communications for {state.profile.customerName || "your organization"}</h1>
                <p className="text-[#5F6368] mt-1">An enterprise agent layer for {ind.name.toLowerCase()} communications, deployed on Google Cloud{state.profile.residency !== "none" ? " within your controlled environment" : ""}.</p>
              </div>

              <h2 className="text-base font-extrabold mb-2">1 · Where we propose to start</h2>
              <p className="mb-1"><b>Entry use case:</b> {rec.entryUseCase}.</p>
              <p className="mb-4"><b>First deployment:</b> {rec.pilotScope}.</p>

              <h2 className="text-base font-extrabold mb-2">2 · Scope of the solution</h2>
              <p className="mb-1"><b>Channels:</b> {state.channels.map((c) => CHANNELS.find((x) => x.id === c)?.name).join(", ")}.</p>
              <p className="mb-4"><b>Capabilities:</b> {selCaps.map((c) => c.name).join(", ")}.</p>

              <h2 className="text-base font-extrabold mb-2">3 · How it is architected</h2>
              <p className="mb-4">
                Conversations run on the Gemini Enterprise Agent Platform in {state.profile.customerName ? `${state.profile.customerName}'s` : "your"} Google Cloud environment. Agents ground every answer in your governed data, act in your systems through permissioned APIs, and hand off to your teams with full context. {state.profile.residency === "mandatory" ? "Data, models, conversation state, and logs remain in-region under your controls. " : ""}
                Every interaction is logged and evaluated; humans approve above-threshold actions.
              </p>

              <h2 className="text-base font-extrabold mb-2">4 · Indicative investment &amp; value (planning estimates)</h2>
              <table className="w-full text-xs border border-[#E8EAED] mb-2">
                <tbody>
                  <tr className="border-b border-[#E8EAED]"><td className="px-3 py-2 font-semibold">One-time implementation (estimate)</td><td className="px-3 py-2 text-right tabular-nums">{fmtMoney(tco.oneTime.total)}</td></tr>
                  <tr className="border-b border-[#E8EAED]"><td className="px-3 py-2 font-semibold">Annual run-rate at your volumes (estimate)</td><td className="px-3 py-2 text-right tabular-nums">{fmtMoney(tco.recurringYr.total + tco.variableYr.total)}</td></tr>
                  <tr className="border-b border-[#E8EAED]"><td className="px-3 py-2 font-semibold">Modelled gross benefit / year</td><td className="px-3 py-2 text-right tabular-nums">{fmtMoney(roi.grossBenefitYr)}</td></tr>
                  <tr><td className="px-3 py-2 font-semibold">Modelled payback</td><td className="px-3 py-2 text-right tabular-nums">{roi.paybackMonths === Infinity ? "to be established in pilot" : `~${roi.paybackMonths.toFixed(1)} months`}</td></tr>
                </tbody>
              </table>
              <p className="text-[11px] text-[#5F6368] mb-4">
                These figures are planning estimates built from your stated volumes ({fmtNum(state.profile.monthlyInteractions)} interactions/month, ${state.profile.costPerInteraction.toFixed(2)} per interaction, {state.profile.ahtMinutes} min AHT) and editable modelling assumptions — not a quotation. The pilot exists to replace assumptions with your measured results before any scale decision.
              </p>

              <h2 className="text-base font-extrabold mb-2">5 · The pilot we propose</h2>
              <p className="mb-4">
                An {rec.timeToValueWeeks}-week structured pilot: two weeks of framing (baseline metrics, one signed-off use case, security review), four weeks of build with our implementation partner, then live production-like traffic against explicit success thresholds — containment, resolution quality, satisfaction, and cost per interaction — with human fallback throughout and a joint go/no-go at the end.
              </p>

              <h2 className="text-base font-extrabold mb-2">6 · Proposed next steps</h2>
              <ol className="list-decimal pl-5 mb-6 space-y-1">
                <li>Half-day discovery workshop with {rec.stakeholders.slice(0, 3).join(", ")} to baseline today&apos;s metrics</li>
                <li>Architecture &amp; security review session with your platform team</li>
                <li>Pilot scope sign-off and start-date commitment</li>
              </ol>

              <div className="border-t border-[#E8EAED] pt-3 text-[10px] text-[#9AA0A6]">
                Prepared with the Gemini Enterprise Communications solution builder. Estimates are indicative and subject to solution design; no pricing commitment is implied. © Google Cloud GTM concept material.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
