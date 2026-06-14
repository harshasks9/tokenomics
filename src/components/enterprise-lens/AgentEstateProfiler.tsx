"use client";

import { Bot, BriefcaseBusiness, Users, Sparkles } from "lucide-react";
import type { AgentClass, Complexity, EstateProfile } from "@/lib/agent-economics/types";
import { capabilityCounts, deriveCapabilities, estateSummary } from "@/lib/agent-economics/capabilities";
import { weightedAgentUnits } from "@/lib/agent-economics/economics";

export const ESTATE_PRESETS: Record<string, EstateProfile> = {
  personal: {
    personal: { count: 3, complexity: "assist" }, internal: { count: 0, complexity: "assist" }, customer: { count: 0, complexity: "assist" },
    sensitivity: "standard", activity: "low",
  },
  internal: {
    personal: { count: 4, complexity: "assist" }, internal: { count: 12, complexity: "act" }, customer: { count: 0, complexity: "assist" },
    sensitivity: "sensitive", activity: "moderate",
  },
  customer: {
    personal: { count: 0, complexity: "assist" }, internal: { count: 4, complexity: "act" }, customer: { count: 8, complexity: "orchestrate" },
    sensitivity: "regulated", activity: "high",
  },
  mixed: {
    personal: { count: 8, complexity: "assist" }, internal: { count: 14, complexity: "act" }, customer: { count: 3, complexity: "act" },
    sensitivity: "sensitive", activity: "moderate",
  },
};

const CLASS_META: Record<AgentClass, { label: string; description: string; icon: typeof Bot; color: string; pale: string }> = {
  personal: { label: "Personal agents", description: "Individual productivity, research, drafting, and bounded actions.", icon: Users, color: "#7C3AED", pale: "#F5F3FF" },
  internal: { label: "Internal enterprise", description: "Employee workflows connected to governed systems and data.", icon: BriefcaseBusiness, color: "#1A73E8", pale: "#EFF6FF" },
  customer: { label: "Customer-facing", description: "Externally exposed production agents with service-level obligations.", icon: Bot, color: "#E11D48", pale: "#FFF1F2" },
};

const COMPLEXITY_COPY: Record<Complexity, string> = {
  assist: "Recommend; human acts",
  act: "Read and write systems",
  orchestrate: "Long-running, multi-agent",
};

interface Props {
  profile: EstateProfile;
  onChange: (profile: EstateProfile) => void;
}

export default function AgentEstateProfiler({ profile, onChange }: Props) {
  const summary = estateSummary(profile);
  const capabilitySummary = capabilityCounts(deriveCapabilities(profile));
  const workloadUnits = weightedAgentUnits(profile);
  const updateClass = (agentClass: AgentClass, patch: Partial<EstateProfile[AgentClass]>) => {
    onChange({ ...profile, [agentClass]: { ...profile[agentClass], ...patch } });
  };

  return (
    <section id="define" className="scroll-mt-28">
      <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">01 / Define the estate</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Start with the agents, not the vendor.</h2>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">Audience and autonomy determine the production stack. A personal assistant and a customer-facing orchestrator are not the same economic unit.</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 lg:max-w-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-900"><Sparkles size={16} /> {summary.total} production agents</div>
          <p className="mt-1 text-xs leading-relaxed text-blue-700">Dominant requirement: {summary.dominant}.</p>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 bg-blue-600 px-5 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.16em]">Live estate impact</p>
          <p className="text-[11px] text-blue-100">Move any slider and these production requirements recalculate instantly.</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
          <ImpactMetric value={String(summary.total)} label="Production agents" testId="estate-agent-total" />
          <ImpactMetric value={workloadUnits.toFixed(1)} label="Weighted workload" testId="estate-workload" />
          <ImpactMetric value={String(capabilitySummary.required)} label="Required controls" testId="estate-control-total" />
          <ImpactMetric value={String(profile.customer.count)} label="Customer-facing" testId="estate-customer-total" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["personal", "Personal productivity"], ["internal", "Internal automation"], ["customer", "Customer operations"], ["mixed", "Mixed enterprise"],
        ].map(([key, label]) => (
          <button key={key} onClick={() => onChange(ESTATE_PRESETS[key])}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700">
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {(Object.keys(CLASS_META) as AgentClass[]).map((agentClass) => {
          const meta = CLASS_META[agentClass];
          const Icon = meta.icon;
          const value = profile[agentClass];
          return (
            <article key={agentClass} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5" style={{ backgroundColor: meta.pale }}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: meta.color }}><Icon size={20} /></div>
                <h3 className="text-lg font-bold text-slate-950">{meta.label}</h3>
                <p className="mt-1 min-h-10 text-xs leading-relaxed text-slate-600">{meta.description}</p>
              </div>
              <div className="space-y-5 p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-slate-600">Production agents</span><span className="text-xl font-extrabold tabular-nums" style={{ color: meta.color }}>{value.count}</span></div>
                  <input aria-label={`${meta.label} count`} type="range" min={0} max={50} value={value.count}
                    aria-valuetext={`${value.count} ${meta.label.toLowerCase()}`}
                    onInput={(event) => updateClass(agentClass, { count: Number(event.currentTarget.value) })}
                    onChange={(event) => updateClass(agentClass, { count: Number(event.currentTarget.value) })}
                    className="slider-track"
                    style={{ background: `linear-gradient(90deg, ${meta.color} 0%, ${meta.color} ${value.count * 2}%, #E2E8F0 ${value.count * 2}%, #E2E8F0 100%)` }} />
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>0</span><span>50</span></div>
                  <p className="mt-2 text-[10px] font-semibold text-slate-500" aria-live="polite">{value.count === 0 ? "Not in this estate" : `${Math.round((value.count / Math.max(1, summary.total)) * 100)}% of selected agents`}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-600">Highest autonomy</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["assist", "act", "orchestrate"] as Complexity[]).map((complexity) => (
                      <button key={complexity} onClick={() => updateClass(agentClass, { complexity })}
                        className={`rounded-xl border px-2 py-2 text-center transition ${value.complexity === complexity ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"}`}>
                        <span className="block text-[11px] font-bold capitalize">{complexity}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">{COMPLEXITY_COPY[value.complexity]}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
        <SegmentedControl label="Data and regulatory sensitivity" value={profile.sensitivity}
          options={["standard", "sensitive", "regulated"]}
          onChange={(value) => onChange({ ...profile, sensitivity: value as EstateProfile["sensitivity"] })} />
        <SegmentedControl label="Expected activity" value={profile.activity}
          options={["low", "moderate", "high"]}
          onChange={(value) => onChange({ ...profile, activity: value as EstateProfile["activity"] })} />
      </div>
    </section>
  );
}

function ImpactMetric({ value, label, testId }: { value: string; label: string; testId: string }) {
  return <div className="p-4 text-center"><p className="text-2xl font-black tabular-nums text-slate-950" aria-live="polite" data-testid={testId}>{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p></div>;
}

function SegmentedControl({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="grid grid-cols-3 rounded-xl border border-slate-200 bg-white p-1">
        {options.map((option) => <button key={option} onClick={() => onChange(option)}
          className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${value === option ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>{option}</button>)}
      </div>
    </div>
  );
}
