"use client";

import { Bot, BriefcaseBusiness, Users } from "lucide-react";
import type { AgentClass, Complexity, EstateProfile } from "@/lib/agent-economics/types";

export const ESTATE_PRESETS: Record<string, EstateProfile> = {
  personal: {
    personal: { count: 5, complexity: "assist" }, internal: { count: 0, complexity: "assist" }, customer: { count: 0, complexity: "assist" },
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

const DEFAULT_COUNTS: Record<AgentClass, number> = {
  personal: 5,
  internal: 12,
  customer: 5,
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
  const updateClass = (agentClass: AgentClass, patch: Partial<EstateProfile[AgentClass]>) => {
    onChange({ ...profile, [agentClass]: { ...profile[agentClass], ...patch } });
  };
  const toggleClass = (agentClass: AgentClass) => {
    const isActive = profile[agentClass].count > 0;
    updateClass(agentClass, { count: isActive ? 0 : DEFAULT_COUNTS[agentClass] });
  };

  return (
    <section id="define" className="scroll-mt-28">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">01 / Define the estate</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Start with the agents, not the vendor.</h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">Audience and autonomy determine the production stack. A personal assistant and a customer-facing orchestrator are not the same architectural unit.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["personal", "Personal productivity"], ["internal", "Internal automation"],
          ["customer", "Customer operations"], ["mixed", "Mixed enterprise"],
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
          const isActive = value.count > 0;
          return (
            <article key={agentClass} className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition-all ${isActive ? "border-slate-200" : "border-slate-100 opacity-50"}`}>
              <div className="border-b border-slate-100 p-5" style={{ backgroundColor: isActive ? meta.pale : "#F8FAFC" }}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: isActive ? meta.color : "#94A3B8" }}>
                    <Icon size={20} />
                  </div>
                  <button
                    onClick={() => toggleClass(agentClass)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${isActive ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-400 hover:border-slate-400"}`}
                  >
                    {isActive ? "Included" : "Exclude"}
                  </button>
                </div>
                <h3 className="text-base font-bold text-slate-950">{meta.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{meta.description}</p>
              </div>

              {isActive && (
                <div className="p-5">
                  <p className="mb-2 text-xs font-semibold text-slate-600">Highest autonomy level</p>
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
              )}
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
