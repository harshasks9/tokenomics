"use client";

// Customer-facing interactive solution economics — the commercial model as four
// integrated components, not SaaS tiers. All rates are indicative and editable;
// provenance is labeled on every figure.

import { useMemo, useState } from "react";
import { Layers3, PhoneCall, Cloud, Wrench } from "lucide-react";
import { fmtMoney, fmtNum, PALETTE } from "./data";

const PROV: Record<string, { label: string; color: string }> = {
  contracted: { label: "Indicative partner rate", color: "#00838F" },
  customer: { label: "Your input", color: "#188038" },
  benchmark: { label: "Benchmark", color: "#1A73E8" },
  assumption: { label: "Assumption", color: "#D97706" },
  estimate: { label: "Estimate", color: "#7C3AED" },
};

const USE_CASES = [
  { id: "collections", label: "Collections & reminders", valuePerResolved: 2.5 },
  { id: "service", label: "Inbound customer service", valuePerResolved: 1.0 },
  { id: "sales", label: "Outbound sales & lead qualification", valuePerResolved: 3.0 },
  { id: "support", label: "Employee / student support", valuePerResolved: 1.5 },
];

function SliderRow({ label, value, min, max, step, format, onChange, prov }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (n: number) => string; onChange: (n: number) => void; prov: keyof typeof PROV;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-semibold text-[#5F6368]">{label}</label>
        <span className="flex items-center gap-1.5">
          <span className="text-[8px] font-semibold rounded-full px-1.5 py-px" style={{ backgroundColor: `${PROV[prov].color}14`, color: PROV[prov].color }}>{PROV[prov].label}</span>
          <span className="text-xs font-bold text-[#202124] tabular-nums">{format(value)}</span>
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#1A73E8]" />
    </div>
  );
}

export function SolutionEconomics() {
  const [volume, setVolume] = useState(500000);
  const [duration, setDuration] = useState(3.5);
  const [useCase, setUseCase] = useState("service");
  const [languages, setLanguages] = useState(3);
  const [channels, setChannels] = useState(3);
  const [integrations, setIntegrations] = useState(3);
  const [automation, setAutomation] = useState(60);
  const [escalation, setEscalation] = useState(15);
  const [managed, setManaged] = useState(true);
  const [voiceRate, setVoiceRate] = useState(0.15);
  const [humanCostPerInteraction, setHumanCostPerInteraction] = useState(1.6);

  const m = useMemo(() => {
    const uc = USE_CASES.find((u) => u.id === useCase)!;
    // One-time: discovery + integration & deployment + workflow config + security/testing/change mgmt
    const discovery = 30000;
    const integrationFee = 40000 + integrations * 15000 + channels * 8000;
    const workflowConfig = 25000 + (languages > 2 ? (languages - 2) * 5000 : 0);
    const securityTesting = 20000;
    const changeMgmt = 0.12 * (discovery + integrationFee + workflowConfig);
    const oneTime = discovery + integrationFee + workflowConfig + securityTesting + changeMgmt;

    // Recurring monthly
    const voiceShare = channels >= 2 ? 0.5 : 1;
    const automatedVol = volume * (automation / 100);
    const commsUsage = automatedVol * duration * voiceRate * voiceShare + automatedVol * (1 - voiceShare) * 0.03; // messaging-side nominal
    const carrier = automatedVol * duration * voiceShare * 0.01; // telephony NOT in the usage rate
    const gcp = automatedVol * 0.02; // Gemini grounding/agents per interaction (assumption)
    const managedFee = managed ? Math.max(4000, 0.12 * (commsUsage + gcp)) : 0;
    const retainedHuman = volume * (escalation / 100) * humanCostPerInteraction * 0.6;
    const monthly = commsUsage + carrier + gcp + managedFee + retainedHuman;

    // Value
    const baseline = volume * humanCostPerInteraction;
    const newHuman = volume * (1 - automation / 100) * humanCostPerInteraction;
    const grossMonthly = baseline - newHuman - monthly + automatedVol * uc.valuePerResolved * 0.02;
    const payback = grossMonthly > 0 ? oneTime / grossMonthly : Infinity;
    const threeYearTco = oneTime + monthly * 36;
    const threeYearRoi = threeYearTco > 0 ? (((grossMonthly + monthly) * 36 - threeYearTco) / threeYearTco) * 100 : 0;
    const costPerInteraction = volume > 0 ? monthly / volume : 0;
    const costPerResolved = automatedVol > 0 ? monthly / automatedVol : 0;

    return { oneTime, commsUsage, carrier, gcp, managedFee, retainedHuman, monthly, grossMonthly, payback, threeYearTco, threeYearRoi, costPerInteraction, costPerResolved, discovery, integrationFee, workflowConfig, securityTesting, changeMgmt };
  }, [volume, duration, useCase, languages, channels, integrations, automation, escalation, managed, voiceRate, humanCostPerInteraction]);

  const components = [
    { Icon: Wrench, title: "1 · Implementation & integration", who: "Tilicho Labs, one-time", desc: "Solution design, platform integration, industry workflow configuration, security setup, testing, change management.", value: fmtMoney(m.oneTime), sub: "one-time estimate" },
    { Icon: PhoneCall, title: "2 · Usage-based communications", who: "Tilicho Labs platform", desc: `Conversational execution, telephony handling, session and routing — indicative ~$${voiceRate.toFixed(2)}/call-minute (usage rate; carrier charges billed separately).`, value: fmtMoney(m.commsUsage + m.carrier), sub: "per month at your volumes" },
    { Icon: Cloud, title: "3 · Google Cloud consumption", who: "Gemini Enterprise Agent Platform", desc: "Intelligence, grounding, workflow agents, governance, evaluation, and analytics — consumption-based in your tenant.", value: fmtMoney(m.gcp), sub: "per month, estimate" },
    { Icon: Layers3, title: "4 · Managed services (optional)", who: "Tilicho Labs + Google Cloud", desc: "Monitoring, optimization, model/policy tuning, and operational support of the deployed agents.", value: managed ? fmtMoney(m.managedFee) : "—", sub: managed ? "per month" : "not included" },
  ];

  return (
    <div>
      {/* Four components */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {components.map((c) => (
          <div key={c.title} className="rounded-2xl border border-[#E8EAED] bg-white p-5 flex flex-col">
            <c.Icon size={17} style={{ color: PALETTE.blue }} className="mb-3" />
            <div className="text-sm font-extrabold leading-tight">{c.title}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: PALETTE.teal }}>{c.who}</div>
            <p className="text-[11px] text-[#5F6368] mt-2 leading-relaxed flex-1">{c.desc}</p>
            <div className="mt-3 pt-3 border-t border-[#F1F3F4]">
              <span className="text-lg font-extrabold tabular-nums" style={{ color: PALETTE.blue }}>{c.value}</span>
              <span className="text-[10px] text-[#9AA0A6] ml-1.5">{c.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive model */}
      <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          <div className="p-6 space-y-3.5 border-b lg:border-b-0 lg:border-r border-[#E8EAED]">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#1A73E8]">Shape it to your operation</div>
            <div className="flex flex-wrap gap-1.5">
              {USE_CASES.map((u) => (
                <button key={u.id} onClick={() => setUseCase(u.id)}
                  className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${useCase === u.id ? "bg-[#1A73E8] text-white border-transparent" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"}`}>
                  {u.label}
                </button>
              ))}
            </div>
            <SliderRow label="Monthly interactions" value={volume} min={20000} max={5000000} step={20000} format={fmtNum} onChange={setVolume} prov="customer" />
            <SliderRow label="Average call duration (min)" value={duration} min={1} max={10} step={0.5} format={(n) => `${n} min`} onChange={setDuration} prov="customer" />
            <SliderRow label="Automation (containment) rate" value={automation} min={20} max={90} step={5} format={(n) => `${n}%`} onChange={setAutomation} prov="assumption" />
            <SliderRow label="Human-escalation rate" value={escalation} min={5} max={40} step={5} format={(n) => `${n}%`} onChange={setEscalation} prov="assumption" />
            <SliderRow label="Languages" value={languages} min={1} max={10} step={1} format={(n) => `${n}`} onChange={setLanguages} prov="customer" />
            <SliderRow label="Channels" value={channels} min={1} max={6} step={1} format={(n) => `${n}`} onChange={setChannels} prov="customer" />
            <SliderRow label="Enterprise integrations" value={integrations} min={1} max={8} step={1} format={(n) => `${n}`} onChange={setIntegrations} prov="customer" />
            <SliderRow label="Your cost per human-assisted interaction" value={humanCostPerInteraction} min={0.4} max={15} step={0.1} format={(n) => `$${n.toFixed(1)}`} onChange={setHumanCostPerInteraction} prov="customer" />
            <SliderRow label="Communications usage rate ($/call-min)" value={voiceRate} min={0.08} max={0.3} step={0.01} format={(n) => `$${n.toFixed(2)}`} onChange={setVoiceRate} prov="contracted" />
            <label className="flex items-center gap-2 text-[11px] font-semibold text-[#5F6368] pt-1">
              <input type="checkbox" checked={managed} onChange={(e) => setManaged(e.target.checked)} className="accent-[#1A73E8]" />
              Include managed services & optimization
            </label>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#5F6368] mb-4">What this configuration means</div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div><div className="text-2xl font-extrabold tabular-nums text-[#202124]">{fmtMoney(m.oneTime)}</div><div className="text-[11px] text-[#5F6368]">one-time implementation</div></div>
              <div><div className="text-2xl font-extrabold tabular-nums" style={{ color: PALETTE.blue }}>{fmtMoney(m.monthly)}</div><div className="text-[11px] text-[#5F6368]">monthly operating cost</div></div>
              <div><div className="text-2xl font-extrabold tabular-nums" style={{ color: PALETTE.green }}>{fmtMoney(m.grossMonthly)}</div><div className="text-[11px] text-[#5F6368]">modelled net value / month</div></div>
              <div><div className="text-2xl font-extrabold tabular-nums text-[#202124]">{m.payback === Infinity ? "—" : `${m.payback.toFixed(1)} mo`}</div><div className="text-[11px] text-[#5F6368]">payback period</div></div>
            </div>
            <div className="rounded-xl bg-[#F8F9FA] border border-[#E8EAED] p-4 space-y-1.5 text-[11px]">
              {[
                ["Cost per interaction", m.costPerInteraction < 0.005 ? "<$0.01" : `$${m.costPerInteraction.toFixed(2)}`],
                ["Cost per resolved interaction", `$${m.costPerResolved.toFixed(2)}`],
                ["Three-year TCO", fmtMoney(m.threeYearTco)],
                ["Three-year ROI (modelled)", `${m.threeYearRoi.toFixed(0)}%`],
                ["Monthly breakdown", `comms ${fmtMoney(m.commsUsage)} · carrier ${fmtMoney(m.carrier)} · Google Cloud ${fmtMoney(m.gcp)} · retained human ops ${fmtMoney(m.retainedHuman)}${managed ? ` · managed ${fmtMoney(m.managedFee)}` : ""}`],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between gap-4"><span className="text-[#5F6368]">{k}</span><span className="font-bold text-right">{v}</span></div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-[#DADCE0] p-3 text-[10px] text-[#9AA0A6] leading-relaxed">
              The ~$0.15/call-minute communications rate is an <b>indicative usage rate</b>, not a fully-loaded cost — carrier charges, Google Cloud consumption,
              managed support, and retained human operations are modelled separately above. All figures are planning estimates from the labeled inputs;
              a structured pilot replaces assumptions with your measured results before any scale decision.
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {Object.values(PROV).map((p) => (
                <span key={p.label} className="text-[9px] font-semibold rounded-full px-2 py-0.5" style={{ backgroundColor: `${p.color}14`, color: p.color }}>{p.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
