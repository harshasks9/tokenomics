"use client";

// Guided, outcome-led Solution Builder. Six questions → generated solution.
// Advanced assumptions live behind a collapsed panel; the default experience
// is opinionated, not a configuration console.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, Copy, FileText, Printer,
  Settings2, Sparkles, TriangleAlert, X, RotateCcw,
} from "lucide-react";
import { PALETTE, fmtMoney, fmtNum } from "../../data";
import {
  BuilderState, defaultBuilderState, INDUSTRY_DEFAULTS, OUTCOMES,
  USE_CASES_BY_INDUSTRY, SYSTEM_OPTIONS, CHANNEL_OPTIONS,
  TILICHO_CAPS, GOOGLE_CAPS, RATE_LABELS, PROVENANCE_META,
  computeTco, computeRoi, computeRecommendation, applyScenario, type Rates, type Provenance,
} from "./builder-data";

const STORAGE_KEY = "voice-solution-builder-v2";

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`text-xs font-semibold rounded-full px-3.5 py-2 border transition-all ${on ? "bg-[#1A73E8] text-white border-transparent shadow-sm" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"}`}>
      {on && <Check size={11} className="inline mr-1 -mt-0.5" />}{children}
    </button>
  );
}

function Question({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 md:p-6">
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="w-6 h-6 rounded-full bg-[#0B1220] text-white text-[11px] font-bold flex items-center justify-center">{n}</span>
        <span className="text-sm font-extrabold text-[#202124]">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function SolutionBuilder() {
  const [state, setState] = useState<BuilderState>(defaultBuilderState());
  const [generated, setGenerated] = useState(false);
  const [scenario, setScenario] = useState<"conservative" | "expected" | "upside">("expected");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...defaultBuilderState(parsed.industry ?? "fsi"), ...parsed });
        if (parsed.__generated) setGenerated(true);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, __generated: generated })); } catch {}
    }, 500);
  }, [state, generated, hydrated]);

  const scenarioState = useMemo(() => applyScenario(state, scenario), [state, scenario]);
  const tco = useMemo(() => computeTco(scenarioState), [scenarioState]);
  const roi = useMemo(() => computeRoi(scenarioState, tco), [scenarioState, tco]);
  const rec = useMemo(() => computeRecommendation(state), [state]);
  const ind = INDUSTRY_DEFAULTS.find((i) => i.id === state.industry)!;
  const uc = USE_CASES_BY_INDUSTRY[state.industry].find((u) => u.id === state.useCase);

  const patch = (p: Partial<BuilderState>) => setState((s) => ({ ...s, ...p }));
  const patchRates = (p: Partial<Rates>) => setState((s) => ({ ...s, rates: { ...s.rates, ...p } }));
  const switchIndustry = (id: string) => {
    const fresh = defaultBuilderState(id);
    setState((s) => ({ ...fresh, customerName: s.customerName }));
  };
  const toggle = (key: "channels" | "systems", v: string) =>
    setState((s) => ({ ...s, [key]: s[key].includes(v) ? s[key].filter((x) => x !== v) : [...s[key], v] }));

  const copyBrief = async () => {
    const md = [
      `# Opportunity brief — ${state.customerName || "(customer)"} (${ind.name}) — INTERNAL`,
      `Outcome: ${OUTCOMES.find((o) => o.id === state.outcome)?.label}. Use case: ${uc?.label}.`,
      `Pursuit: ${rec.pursuit}. ${rec.pursuitDetail}`,
      `Pilot: ${rec.pilotScope}.`,
      `Channels: ${state.channels.map((c) => CHANNEL_OPTIONS.find((x) => x.id === c)?.label).join(", ")}. Systems: ${state.systems.join(", ")}.`,
      `Economics (${scenario}): one-time ${fmtMoney(tco.oneTime.total)} · monthly ${fmtMoney(tco.monthly.total)} · annual run rate ${fmtMoney(tco.annualRunRate)} · 3-yr TCO ${fmtMoney(tco.threeYearTco)}.`,
      `Value: gross ${fmtMoney(roi.grossBenefitYr)}/yr · net ${fmtMoney(roi.netBenefitYr)}/yr · payback ${roi.paybackMonths === Infinity ? "n/a" : roi.paybackMonths.toFixed(1) + " mo"} · NPV ${fmtMoney(roi.npv)} · 3-yr ROI ${roi.threeYearRoi.toFixed(0)}%.`,
      `Tilicho usage rate assumption: $${state.rates.tilichoUsagePerMin.toFixed(2)}/call-min (indicative, usage only — carrier/GCP/managed/human ops separate).`,
      `Warnings: ${rec.warnings.join(" | ")}.`,
      `Stakeholders: ${rec.stakeholders.join(", ")}. Risks: ${rec.risks.join("; ")}.`,
      `All figures are modelling estimates from editable, provenance-labeled assumptions — not quotes. Internal only.`,
    ].join("\n\n");
    await navigator.clipboard.writeText(md);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#202124]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`@media print { body * { visibility: hidden !important; } #proposal-doc, #proposal-doc * { visibility: visible !important; } #proposal-doc { position: absolute !important; inset: 0 !important; overflow: visible !important; max-height: none !important; border: none !important; box-shadow: none !important; } }`}</style>

      <header className="sticky top-0 z-40 print:hidden" style={{ background: "linear-gradient(90deg, #0B1220, #14223D)" }}>
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/voice/internal" className="text-white/60 hover:text-white shrink-0"><ArrowLeft size={16} /></Link>
            <Sparkles size={15} className="text-[#8AB4F8] shrink-0" />
            <span className="text-sm font-bold text-white truncate">Solution Builder</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDD663] text-[#202124] rounded px-2 py-0.5 shrink-0">Internal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] text-white/40">Autosaves locally</span>
            <button onClick={() => { setState(defaultBuilderState(state.industry)); setGenerated(false); }} className="text-[11px] font-semibold text-white/70 border border-white/25 rounded-full px-3 py-1.5 hover:bg-white/10 inline-flex items-center gap-1.5">
              <RotateCcw size={11} /> Reset
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* ── Guided questions ── */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-extrabold">Six answers. One recommended solution.</h1>
          <p className="text-xs text-[#5F6368] mt-1 max-w-2xl">Answer what you know from discovery — industry defaults fill the rest. Everything else lives under Advanced settings, already tuned to sensible values.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Question n={1} title="What industry is the customer in?">
            <div className="flex flex-wrap gap-1.5">
              {INDUSTRY_DEFAULTS.map((i) => <Chip key={i.id} on={state.industry === i.id} onClick={() => switchIndustry(i.id)}>{i.name}</Chip>)}
            </div>
            <input
              value={state.customerName} onChange={(e) => patch({ customerName: e.target.value })} placeholder="Customer name (optional — flows into the proposal)"
              className="mt-3 w-full text-sm border border-[#DADCE0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#1A73E8]"
            />
          </Question>

          <Question n={2} title="What outcome are they trying to achieve?">
            <div className="flex flex-wrap gap-1.5">
              {OUTCOMES.map((o) => <Chip key={o.id} on={state.outcome === o.id} onClick={() => patch({ outcome: o.id })}>{o.label}</Chip>)}
            </div>
          </Question>

          <Question n={3} title="What is the primary use case?">
            <div className="flex flex-wrap gap-1.5">
              {USE_CASES_BY_INDUSTRY[state.industry].map((u) => <Chip key={u.id} on={state.useCase === u.id} onClick={() => patch({ useCase: u.id })}>{u.label}</Chip>)}
            </div>
          </Question>

          <Question n={4} title="Which channels are required?">
            <div className="flex flex-wrap gap-1.5">
              {CHANNEL_OPTIONS.map((c) => <Chip key={c.id} on={state.channels.includes(c.id)} onClick={() => toggle("channels", c.id)}>{c.label}</Chip>)}
            </div>
          </Question>

          <Question n={5} title="What is the monthly interaction volume?">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#5F6368]">drag to adjust</span>
              <span className="text-lg font-extrabold tabular-nums" style={{ color: PALETTE.blue }}>{fmtNum(state.monthlyInteractions)}/mo</span>
            </div>
            <input type="range" min={20000} max={10000000} step={20000} value={state.monthlyInteractions}
              onChange={(e) => patch({ monthlyInteractions: Number(e.target.value) })} className="w-full accent-[#1A73E8]" />
          </Question>

          <Question n={6} title="Which enterprise systems need to be connected?">
            <div className="flex flex-wrap gap-1.5">
              {SYSTEM_OPTIONS[state.industry].map((s) => <Chip key={s} on={state.systems.includes(s)} onClick={() => toggle("systems", s)}>{s}</Chip>)}
            </div>
          </Question>
        </div>

        <div className="mt-6 flex justify-center print:hidden">
          <button
            onClick={() => { setGenerated(true); setTimeout(() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="inline-flex items-center gap-2 rounded-full text-white px-8 py-3.5 text-sm font-bold shadow-lg hover:opacity-95"
            style={{ background: "linear-gradient(90deg, #1A73E8, #00838F)" }}
          >
            <Sparkles size={15} /> {generated ? "Regenerate the solution" : "Generate the recommended solution"}
          </button>
        </div>

        {/* ── Generated solution ── */}
        {generated && (
          <div id="solution" className="mt-10 space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg md:text-xl font-extrabold">
                Recommended solution{state.customerName ? ` for ${state.customerName}` : ""} — {uc?.label}
              </h2>
              <div className="flex items-center gap-1 border border-[#DADCE0] rounded-full p-0.5 bg-white">
                {(["conservative", "expected", "upside"] as const).map((s) => (
                  <button key={s} onClick={() => setScenario(s)}
                    className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full capitalize ${scenario === s ? "bg-[#0B1220] text-white" : "text-[#5F6368] hover:bg-[#F1F3F4]"}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* headline economics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                ["One-time implementation", fmtMoney(tco.oneTime.total), PALETTE.ink],
                ["Monthly operating cost", fmtMoney(tco.monthly.total), PALETTE.blue],
                ["Net benefit / year", fmtMoney(roi.netBenefitYr), roi.netBenefitYr >= 0 ? PALETTE.green : PALETTE.red],
                ["Payback", roi.paybackMonths === Infinity ? "—" : `${roi.paybackMonths.toFixed(1)} mo`, PALETTE.ink],
                ["3-yr TCO / ROI", `${fmtMoney(tco.threeYearTco)} · ${roi.threeYearRoi.toFixed(0)}%`, PALETTE.purple],
              ].map(([t, v, c]) => (
                <div key={t as string} className="rounded-2xl border border-[#E8EAED] bg-white p-4">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#5F6368]">{t}</div>
                  <div className="text-lg md:text-xl font-extrabold tabular-nums mt-1 leading-tight" style={{ color: c as string }}>{v}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Solution composition */}
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">Solution composition</div>
                <div className="space-y-3.5 text-[11px]">
                  <div className="border-l-2 pl-3" style={{ borderColor: PALETTE.teal }}>
                    <div className="text-xs font-extrabold" style={{ color: PALETTE.teal }}>Tilicho Labs — communications & implementation</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {TILICHO_CAPS.filter((c) => state.managed || !c.includes("Managed")).map((c) => (
                        <span key={c} className="rounded-full px-2 py-0.5 bg-[#00838F]/8 text-[#00838F] border border-[#00838F]/20">{c}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#9AA0A6] mt-1.5">Capability coverage validated during implementation — unconfirmed items are not presented as production-ready.</p>
                  </div>
                  <div className="border-l-2 pl-3" style={{ borderColor: PALETTE.blue }}>
                    <div className="text-xs font-extrabold" style={{ color: PALETTE.blue }}>Google Cloud — intelligence & governance</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {GOOGLE_CAPS.map((c) => <span key={c} className="rounded-full px-2 py-0.5 bg-[#1A73E8]/8 text-[#1A73E8] border border-[#1A73E8]/20">{c}</span>)}
                    </div>
                  </div>
                  <div className="border-l-2 pl-3 border-[#5F6368]">
                    <div className="text-xs font-extrabold text-[#5F6368]">Customer integrations</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {state.systems.map((s) => <span key={s} className="rounded-full px-2 py-0.5 bg-[#F1F3F4] text-[#5F6368]">{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">Where the money goes ({scenario})</div>
                <div className="text-[11px] font-bold text-[#202124] mb-1.5">One-time · {fmtMoney(tco.oneTime.total)}</div>
                {[
                  ["Discovery & solution design", tco.oneTime.discovery, "assumption"],
                  ["Tilicho integration & deployment", tco.oneTime.tilichoIntegration, "tilicho"],
                  ["Customer-system integrations", tco.oneTime.systemIntegrations, "tilicho"],
                  ["Industry workflow configuration", tco.oneTime.workflowConfig, "tilicho"],
                  ["Security & compliance setup", tco.oneTime.security, "assumption"],
                  ["Testing & evaluation", tco.oneTime.testing, "assumption"],
                  ["Production readiness + change mgmt", tco.oneTime.prodReadiness + tco.oneTime.changeMgmt, "assumption"],
                ].map(([n, v, p]) => (
                  <div key={n as string} className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#5F6368] flex-1 truncate">{n}</span>
                    <span className="text-[8px] font-semibold rounded-full px-1.5 py-px shrink-0" style={{ backgroundColor: `${PROVENANCE_META[p as Provenance].color}14`, color: PROVENANCE_META[p as Provenance].color }}>{PROVENANCE_META[p as Provenance].label}</span>
                    <span className="text-[10px] font-bold tabular-nums w-12 text-right">{fmtMoney(v as number)}</span>
                  </div>
                ))}
                <div className="text-[11px] font-bold text-[#202124] mb-1.5 mt-3">Monthly · {fmtMoney(tco.monthly.total)}</div>
                {[
                  [`Tilicho platform usage (~$${scenarioState.rates.tilichoUsagePerMin.toFixed(2)}/call-min)`, tco.monthly.tilichoUsage, "contracted"],
                  ["Carrier / telephony (billed separately)", tco.monthly.carrier, "assumption"],
                  ["Google Cloud consumption", tco.monthly.gcp, "estimate"],
                  ["Managed service & optimization", tco.monthly.managed, "tilicho"],
                  ["Retained human operations", tco.monthly.retainedHuman, "customer"],
                ].map(([n, v, p]) => (
                  <div key={n as string} className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#5F6368] flex-1 truncate">{n}</span>
                    <span className="text-[8px] font-semibold rounded-full px-1.5 py-px shrink-0" style={{ backgroundColor: `${PROVENANCE_META[p as Provenance].color}14`, color: PROVENANCE_META[p as Provenance].color }}>{PROVENANCE_META[p as Provenance].label}</span>
                    <span className="text-[10px] font-bold tabular-nums w-12 text-right">{fmtMoney(v as number)}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-[#F1F3F4] grid grid-cols-2 gap-2 text-[10px] text-[#5F6368]">
                  <div>Cost per interaction: <b className="text-[#202124]">{tco.costPerInteraction < 0.005 ? "<$0.01" : `$${tco.costPerInteraction.toFixed(2)}`}</b></div>
                  <div>Per resolved: <b className="text-[#202124]">${tco.costPerResolved.toFixed(2)}</b></div>
                  <div>Annual run rate: <b className="text-[#202124]">{fmtMoney(tco.annualRunRate)}</b></div>
                  <div>NPV (3-yr): <b className="text-[#202124]">{fmtMoney(roi.npv)}</b></div>
                </div>
                <p className="text-[9px] text-[#9AA0A6] mt-2">The usage rate covers platform usage only — carrier, Google Cloud, managed support, and retained human operations are modelled separately and shown above.</p>
              </div>
            </div>

            {/* Pilot + roadmap + warnings */}
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Pilot structure · ~{rec.timeToValueWeeks} weeks</div>
                <p className="text-[11px] text-[#202124] leading-relaxed">{rec.pilotScope}</p>
                <div className="mt-3 text-[10px] text-[#5F6368]">
                  <b className="text-[#202124]">Stakeholders:</b> {rec.stakeholders.join(", ")}
                </div>
              </div>
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Expansion roadmap</div>
                <div className="space-y-1.5">
                  {rec.expansion.map((e, i) => (
                    <div key={e} className="flex items-center gap-2 text-[11px]">
                      <span className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: i === 0 ? PALETTE.blue : `${PALETTE.blue}66` }}>{i + 1}</span>
                      {e}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[10px] text-[#5F6368]"><b className="text-[#202124]">Pursuit:</b> {rec.pursuit}</div>
              </div>
              <div className="rounded-2xl border border-[#FDE293] bg-[#FEF7E0] p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#B26A00] mb-2 flex items-center gap-1.5"><TriangleAlert size={11} /> Check before proposing</div>
                <ul className="space-y-1.5 text-[10px] text-[#7A5A00] leading-relaxed">
                  {rec.warnings.map((w) => <li key={w}>· {w}</li>)}
                  {rec.deferredChannels.length > 0 && <li>· Defer to phase 2: {rec.deferredChannels.join(", ")}</li>}
                </ul>
              </div>
            </div>

            {/* Value levers */}
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Value by lever — provenance on every number</div>
              {roi.byLever.map((l) => (
                <div key={l.name} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-[#5F6368] flex-1">{l.name}</span>
                  <span className="text-[8px] font-semibold rounded-full px-1.5 py-px shrink-0" style={{ backgroundColor: `${PROVENANCE_META[l.prov].color}14`, color: PROVENANCE_META[l.prov].color }}>{PROVENANCE_META[l.prov].label}</span>
                  <span className="text-[11px] font-bold tabular-nums w-16 text-right">{fmtMoney(l.value)}</span>
                </div>
              ))}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.values(PROVENANCE_META).map((p) => (
                  <span key={p.label} className="text-[8px] font-semibold rounded-full px-2 py-0.5" style={{ backgroundColor: `${p.color}14`, color: p.color }}>{p.label}</span>
                ))}
              </div>
            </div>

            {/* Advanced settings */}
            <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden print:hidden">
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-sm font-extrabold flex items-center gap-2"><Settings2 size={14} /> Advanced settings & assumptions</span>
                <ChevronDown size={15} className={`text-[#9AA0A6] transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              </button>
              {showAdvanced && (
                <div className="px-5 pb-5 grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368]">Operating assumptions</div>
                    {[
                      { label: "Current cost per interaction ($)", key: "costPerInteraction", step: 0.1 },
                      { label: "Average handling time (min)", key: "ahtMinutes", step: 0.5 },
                      { label: "Current containment (%)", key: "currentContainment", step: 5 },
                      { label: "Target containment (%)", key: "targetContainment", step: 5 },
                      { label: "Human-escalation rate (%)", key: "escalationRate", step: 5 },
                      { label: "Languages", key: "languages", step: 1 },
                    ].map((f) => (
                      <label key={f.key} className="block">
                        <span className="text-[10px] text-[#5F6368]">{f.label}</span>
                        <input type="number" step={f.step} value={state[f.key as keyof BuilderState] as number}
                          onChange={(e) => patch({ [f.key]: Number(e.target.value) } as Partial<BuilderState>)}
                          className="mt-0.5 w-full text-xs border border-[#DADCE0] rounded-lg px-2.5 py-1.5 tabular-nums focus:outline-none focus:border-[#1A73E8]" />
                      </label>
                    ))}
                    <label className="flex items-center gap-2 text-[11px] font-semibold text-[#5F6368]">
                      <input type="checkbox" checked={state.managed} onChange={(e) => patch({ managed: e.target.checked })} className="accent-[#1A73E8]" />
                      Include managed services & optimization
                    </label>
                  </div>
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368]">Rate card (all editable — never present as pricing)</div>
                    {RATE_LABELS.map((r) => (
                      <label key={r.key} className="block">
                        <span className="text-[10px] text-[#5F6368] flex items-center gap-1.5">
                          {r.label}
                          <span className="text-[8px] font-semibold rounded-full px-1.5 py-px" style={{ backgroundColor: `${PROVENANCE_META[r.prov].color}14`, color: PROVENANCE_META[r.prov].color }}>{PROVENANCE_META[r.prov].label}</span>
                        </span>
                        <input type="number" step={0.01} value={state.rates[r.key]}
                          onChange={(e) => patchRates({ [r.key]: Number(e.target.value) } as Partial<Rates>)}
                          className="mt-0.5 w-full text-xs border border-[#DADCE0] rounded-lg px-2.5 py-1.5 tabular-nums focus:outline-none focus:border-[#1A73E8]" />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Exports */}
            <div className="grid sm:grid-cols-2 gap-3 print:hidden">
              <button onClick={() => setProposalOpen(true)} className="rounded-2xl border-2 border-[#1A73E8] bg-white p-5 text-left hover:shadow-md transition-shadow">
                <FileText size={16} className="text-[#1A73E8] mb-2" />
                <div className="text-sm font-extrabold">Customer proposal (PDF)</div>
                <p className="text-[11px] text-[#5F6368] mt-1">Customer-ready summary with {state.customerName || "the customer"}&apos;s name — internal routing, warnings, and rate provenance removed. Preview, then print / save as PDF.</p>
              </button>
              <button onClick={copyBrief} className="rounded-2xl border border-[#E8EAED] bg-white p-5 text-left hover:shadow-md transition-shadow">
                {copied ? <Check size={16} className="text-[#188038] mb-2" /> : <Copy size={16} className="text-[#5F6368] mb-2" />}
                <div className="text-sm font-extrabold">Internal opportunity brief</div>
                <p className="text-[11px] text-[#5F6368] mt-1">{copied ? "Copied to clipboard." : "Markdown for the account plan — includes pursuit, warnings, and full economics."}</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Proposal modal / print doc */}
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
                <h1 className="text-2xl font-extrabold mt-2">Agentic Communications for {state.customerName || "your organization"}</h1>
                <p className="text-[#5F6368] mt-1">
                  {uc?.label} on an enterprise agent layer — intelligence by Google Cloud, communications and implementation by Tilicho Labs.
                </p>
              </div>

              <h2 className="text-base font-extrabold mb-2">1 · Where we propose to start</h2>
              <p className="mb-4">{rec.pilotScope}.</p>

              <h2 className="text-base font-extrabold mb-2">2 · One integrated solution, clear ownership</h2>
              <p className="mb-1"><b>Tilicho Labs</b> provides the communications and voice-AI platform — call handling, telephony, channels, session and routing — plus solution integration and deployment, so nothing is rebuilt from scratch.</p>
              <p className="mb-1"><b>Google Cloud</b> provides Gemini intelligence, enterprise grounding, workflow agents, governed actions in your systems, and evaluation — running in your Google Cloud environment.</p>
              <p className="mb-4"><b>Your organization</b> keeps ownership of data, systems of record, business rules, approvals, and escalation operations.</p>

              <h2 className="text-base font-extrabold mb-2">3 · Scope</h2>
              <p className="mb-1"><b>Channels:</b> {state.channels.map((c) => CHANNEL_OPTIONS.find((x) => x.id === c)?.label).join(", ")}.</p>
              <p className="mb-4"><b>Connected systems:</b> {state.systems.join(", ")}.</p>

              <h2 className="text-base font-extrabold mb-2">4 · Indicative commercial model (planning estimates)</h2>
              <table className="w-full text-xs border border-[#E8EAED] mb-2">
                <tbody>
                  <tr className="border-b border-[#E8EAED]"><td className="px-3 py-2 font-semibold">One-time implementation & integration (estimate)</td><td className="px-3 py-2 text-right tabular-nums">{fmtMoney(tco.oneTime.total)}</td></tr>
                  <tr className="border-b border-[#E8EAED]"><td className="px-3 py-2 font-semibold">Monthly operating cost at your volumes (estimate)</td><td className="px-3 py-2 text-right tabular-nums">{fmtMoney(tco.monthly.total)}</td></tr>
                  <tr className="border-b border-[#E8EAED]"><td className="px-3 py-2 font-semibold">Modelled gross benefit / year</td><td className="px-3 py-2 text-right tabular-nums">{fmtMoney(roi.grossBenefitYr)}</td></tr>
                  <tr><td className="px-3 py-2 font-semibold">Modelled payback</td><td className="px-3 py-2 text-right tabular-nums">{roi.paybackMonths === Infinity ? "established in pilot" : `~${roi.paybackMonths.toFixed(1)} months`}</td></tr>
                </tbody>
              </table>
              <p className="text-[11px] text-[#5F6368] mb-4">
                The commercial model has four components: one-time implementation, usage-based communications, Google Cloud consumption, and optional managed services.
                Figures are planning estimates built from your stated volumes ({fmtNum(state.monthlyInteractions)} interactions/month) and editable assumptions — not a quotation.
                Usage-based communication pricing covers platform usage; carrier charges and cloud consumption are itemized separately. The pilot replaces assumptions with your measured results.
              </p>

              <h2 className="text-base font-extrabold mb-2">5 · The pilot we propose</h2>
              <p className="mb-4">
                A {rec.timeToValueWeeks}-week structured pilot: two weeks of framing (baseline metrics, one signed-off use case, security review), a build phase on
                Tilicho Labs&apos; deployment accelerators, then live production-like traffic against explicit success thresholds — containment, resolution quality,
                satisfaction, and cost per interaction — with human fallback throughout and a joint go/no-go at the end.
              </p>

              <h2 className="text-base font-extrabold mb-2">6 · Proposed next steps</h2>
              <ol className="list-decimal pl-5 mb-6 space-y-1">
                <li>Half-day discovery workshop with {rec.stakeholders.slice(0, 3).join(", ")} to baseline today&apos;s metrics</li>
                <li>Architecture &amp; security review with your platform team</li>
                <li>Pilot scope sign-off and start-date commitment</li>
              </ol>

              <div className="border-t border-[#E8EAED] pt-3 text-[10px] text-[#9AA0A6]">
                Estimates are indicative and subject to solution design; no pricing commitment is implied. © Google Cloud GTM concept material.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
