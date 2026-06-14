"use client";

import { useState } from "react";
import { tco, INPUTS, type Approach } from "@/lib/economics";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type EstateSize    = "tiny" | "small" | "mid" | "large";
type PlatformEng   = "none" | "some" | "strong";
type Governance    = "low" | "medium" | "high";
type TimePressure  = "flexible" | "moderate" | "urgent";

interface RecommenderInputs {
  estate:     EstateSize;
  platformEng: PlatformEng;
  governance: Governance;
  timePressure: TimePressure;
}

interface Recommendation {
  approach: Approach;
  confidence: "clear" | "marginal";
  headline: string;
  rationale: string;
  caveats: string[];
  alternativeNote?: string;
}

function recommend(inputs: RecommenderInputs): Recommendation {
  const { estate, platformEng, governance, timePressure } = inputs;

  // Map estate to rough N
  const N = { tiny: 3, small: 10, mid: 40, large: 180 }[estate];

  // Score each approach (higher = more suitable)
  const scores: Record<Approach, number> = {
    directApi:          0,
    internalPlatform:   0,
    bestOfBreed:        0,
    integratedPlatform: 0,
  };

  // Estate size signals
  if (N <= 5) {
    scores.directApi          += 4;
    scores.integratedPlatform += 2;
    scores.bestOfBreed        += 1;
    scores.internalPlatform   -= 4; // massively over-built
  } else if (N <= 20) {
    scores.integratedPlatform += 4;
    scores.directApi          += 1;
    scores.bestOfBreed        += 2;
    scores.internalPlatform   -= 2;
  } else if (N <= 80) {
    scores.integratedPlatform += 4;
    scores.bestOfBreed        += 2;
    scores.internalPlatform   += 1;
    scores.directApi          -= 2;
  } else {
    scores.integratedPlatform += 3;
    scores.internalPlatform   += 3;
    scores.bestOfBreed        += 1;
    scores.directApi          -= 4;
  }

  // Platform engineering capability
  if (platformEng === "none") {
    scores.internalPlatform -= 5;
    scores.directApi        -= 1;
  } else if (platformEng === "some") {
    scores.internalPlatform -= 2;
  } else if (platformEng === "strong") {
    scores.internalPlatform += 3;
    scores.bestOfBreed      += 1;
  }

  // Governance intensity
  if (governance === "high") {
    scores.integratedPlatform += 2; // pre-wired controls
    scores.bestOfBreed        -= 1; // multi-vendor governance is hard
    scores.directApi          -= 3; // DIY governance is expensive
  } else if (governance === "low") {
    scores.directApi         += 2;
    scores.bestOfBreed       += 1;
    scores.integratedPlatform -= 1;
  }

  // Time pressure
  if (timePressure === "urgent") {
    scores.integratedPlatform += 3;
    scores.internalPlatform   -= 4;
    scores.bestOfBreed        -= 2;
    scores.directApi          += 1;
  } else if (timePressure === "flexible") {
    scores.internalPlatform += 2;
    scores.bestOfBreed      += 1;
  }

  // Find winner
  const sorted = (Object.entries(scores) as [Approach, number][]).sort((a, b) => b[1] - a[1]);
  const [winner, winnerScore] = sorted[0];
  const [runner, runnerScore] = sorted[1];
  const confidence: "clear" | "marginal" = (winnerScore - runnerScore) >= 3 ? "clear" : "marginal";

  // Build rationale
  const rationales: Record<Approach, string> = {
    directApi:
      `With ${N <= 5 ? "a very small" : "a small"} agent estate, limited governance requirements, and ` +
      (timePressure === "urgent" ? "time pressure, " : "") +
      `direct model APIs are sufficient. The integration cost is manageable at this scale, and the overhead of ` +
      `a full platform isn't justified. Revisit when you exceed 5–10 agents or face audit requirements.`,

    internalPlatform:
      `At ${N}+ agents with ${platformEng === "strong" ? "strong" : "adequate"} platform engineering, ` +
      `a reusable internal platform can achieve lower marginal cost per agent. ` +
      `Budget 40+ weeks to first production agent and a sustained platform team. ` +
      `This wins on long-run economics if you can absorb the upfront investment.`,

    bestOfBreed:
      `Best-of-breed assembly suits your profile when you already own parts of the stack (vector DB, gateway, eval) ` +
      `and have engineering capacity to wire them together. Lower upfront than integrated; ` +
      `watch multi-vendor versioning and the integration tax per new agent.`,

    integratedPlatform:
      `An integrated platform (GEAP or AWS AgentCore or Azure AI Foundry) is rational given your ` +
      (timePressure === "urgent" ? "time pressure, " : "") +
      (governance === "high" ? "governance intensity, " : "") +
      `agent estate of ~${N} and ` +
      (platformEng === "none" ? "limited platform engineering capacity" : "platform engineering profile") +
      `. Fastest time-to-value (6 weeks vs 40 for internal). ` +
      `Note: metered consumption grows with usage; equivalent options on AWS/Azure exist; switching cost is real.`,
  };

  const caveats: Record<Approach, string[]> = {
    directApi: [
      "Each new agent repeats integration work — cost grows linearly.",
      "Governance (audit, identity, policy) must be built per-agent without shared infra.",
      N > 5 ? "At your scale, revisit this decision — TCO is competitive with integrated only below ~5 agents." : "",
    ].filter(Boolean),

    internalPlatform: [
      "40+ weeks to first production agent — high time-to-value risk.",
      "Requires 5–8 dedicated platform engineers to build and sustain.",
      "If eng rate rises or headcount shrinks, the economics erode fast.",
    ],

    bestOfBreed: [
      "Multi-vendor versioning creates ongoing integration maintenance.",
      "No single vendor spans traces + eval + governance — you own the seams.",
      "License stack ($290K+/yr) grows with usage; renegotiate annually.",
    ],

    integratedPlatform: [
      "Metered platform services grow with agent activity — model every usage scenario.",
      "Equivalent hyperscaler platforms (AWS AgentCore, Azure AI Foundry) should be evaluated.",
      "Switching cost is real once billing meters, IAM, and catalog integrations are wired in.",
    ],
  };

  const alternatives: Partial<Record<Approach, string>> = {
    integratedPlatform: runner === "internalPlatform" && N > 100
      ? `At ${N} agents, a reusable internal platform (ranked #2) is also competitive if you have strong platform engineering — worth a build-vs-buy analysis.`
      : runner === "directApi" && N <= 5
      ? "Direct model APIs are nearly as cost-effective at your scale — the integration overhead difference is small."
      : undefined,
    directApi: N >= 5 ? "If governance requirements increase, integrated platform quickly becomes more economic." : undefined,
    internalPlatform: "Validate this estimate with your actual platform-team headcount and fully-loaded cost.",
    bestOfBreed: "Map your existing owned tools against the capability taxonomy to quantify the true integration gap.",
  };

  return {
    approach: winner,
    confidence,
    headline: INPUTS[winner].label,
    rationale: rationales[winner],
    caveats: caveats[winner],
    alternativeNote: alternatives[winner],
  };
}

const ESTATE_OPTIONS: { value: EstateSize; label: string; sub: string }[] = [
  { value: "tiny",  label: "1–3 agents",   sub: "Pilot / proof-of-concept" },
  { value: "small", label: "4–15 agents",  sub: "Initial production rollout" },
  { value: "mid",   label: "16–80 agents", sub: "Department-wide deployment" },
  { value: "large", label: "80+ agents",   sub: "Enterprise-wide platform" },
];

const ENG_OPTIONS: { value: PlatformEng; label: string; sub: string }[] = [
  { value: "none",   label: "None",   sub: "No dedicated platform / infra team" },
  { value: "some",   label: "Some",   sub: "2–4 engineers, no platform specialty" },
  { value: "strong", label: "Strong", sub: "5+ dedicated platform/SRE engineers" },
];

const GOV_OPTIONS: { value: Governance; label: string; sub: string }[] = [
  { value: "low",    label: "Low",    sub: "Internal tools, no regulatory audit" },
  { value: "medium", label: "Medium", sub: "SOC 2, internal audit requirements" },
  { value: "high",   label: "High",   sub: "Regulated industry, HIPAA/FedRAMP/SOX" },
];

const TIME_OPTIONS: { value: TimePressure; label: string; sub: string }[] = [
  { value: "flexible", label: "Flexible",  sub: "6–12 months to first agent acceptable" },
  { value: "moderate", label: "Moderate",  sub: "3–6 months to production" },
  { value: "urgent",   label: "Urgent",    sub: "6–10 weeks to first production agent" },
];

function RadioGroup<T extends string>({
  label, options, value, onChange
}: {
  label: string;
  options: { value: T; label: string; sub: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map((o) => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={`text-left rounded-lg border p-2.5 transition-all ${
              value === o.value
                ? "border-blue-300 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}>
            <p className={`text-xs font-semibold ${value === o.value ? "text-blue-700" : "text-gray-700"}`}>{o.label}</p>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{o.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AgentEconRecommender() {
  const [inputs, setInputs] = useState<RecommenderInputs>({
    estate: "small",
    platformEng: "some",
    governance: "medium",
    timePressure: "moderate",
  });

  const rec = recommend(inputs);
  const approachColor = INPUTS[rec.approach].color;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">What does this mean for you?</h3>
        <p className="text-sm text-gray-500">
          4 inputs → which approach is rational in plain language.
          The recommender is genuinely conditional — it will tell you when direct APIs are enough.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-5">
        <RadioGroup label="Agent estate size" options={ESTATE_OPTIONS}
          value={inputs.estate} onChange={(v) => setInputs({ ...inputs, estate: v })} />
        <RadioGroup label="Platform engineering capacity" options={ENG_OPTIONS}
          value={inputs.platformEng} onChange={(v) => setInputs({ ...inputs, platformEng: v })} />
        <RadioGroup label="Governance intensity" options={GOV_OPTIONS}
          value={inputs.governance} onChange={(v) => setInputs({ ...inputs, governance: v })} />
        <RadioGroup label="Time to first production agent" options={TIME_OPTIONS}
          value={inputs.timePressure} onChange={(v) => setInputs({ ...inputs, timePressure: v })} />
      </div>

      {/* Recommendation */}
      <div className="rounded-2xl border-2 p-5" style={{ borderColor: approachColor + "40", backgroundColor: approachColor + "08" }}>
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 size={20} style={{ color: approachColor }} className="flex-none mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-extrabold" style={{ color: approachColor }}>{rec.headline}</span>
              {rec.confidence === "marginal" && (
                <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-[10px] font-bold">MARGINAL — review alternatives</span>
              )}
              {rec.confidence === "clear" && (
                <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-bold">CLEAR</span>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{rec.rationale}</p>
          </div>
        </div>

        {rec.caveats.length > 0 && (
          <div className="space-y-1.5 ml-8 mb-3">
            {rec.caveats.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertCircle size={12} className="flex-none mt-0.5 text-gray-400" />
                <p className="text-xs text-gray-500">{c}</p>
              </div>
            ))}
          </div>
        )}

        {rec.alternativeNote && (
          <div className="ml-8 flex items-start gap-2 pt-3 border-t" style={{ borderColor: approachColor + "20" }}>
            <Info size={12} className="flex-none mt-0.5 text-gray-400" />
            <p className="text-xs text-gray-500">{rec.alternativeNote}</p>
          </div>
        )}
      </div>

      {/* Time-to-value comparison */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Time to first production agent</p>
        <div className="space-y-2">
          {(["integratedPlatform", "directApi", "bestOfBreed", "internalPlatform"] as Approach[]).map((a) => {
            const m = INPUTS[a];
            const pct = (m.weeksToFirstProd / 40) * 100;
            return (
              <div key={a}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">{m.label}</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: m.color }}>{m.weeksToFirstProd} wks</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: m.color }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-3">[ASSUMPTION] Time estimates at base eng rate. Integrated platform's 6-week estimate assumes existing Workspace/GCP contract.</p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-bold text-blue-700 mb-2">What would change the answer?</p>
        <ul className="space-y-1">
          {[
            "Engineering rate below $10K/mo makes internal platform and best-of-breed more competitive at lower N.",
            "Agent count above 150 makes internal platform competitive with integrated — rerun the TCO chart.",
            "Heavy metered consumption (grounding-intensive, high-memory agents) can push integrated runPerAgentYr to $30K+, shifting the crossover.",
          ].map((line, i) => (
            <li key={i} className="text-xs text-blue-700 flex items-start gap-2">
              <span className="text-blue-400 flex-none">·</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-gray-400 italic">
        The economic unit isn&apos;t a token or a model call — it&apos;s the full lifecycle of delivering, operating, governing,
        and expanding agents. Direct APIs suit a few simple agents; a reusable internal platform can win at large scale
        with strong platform engineering; best-of-breed is rational when you already own the stack; an integrated platform
        usually wins on time-to-value and TCO across most of the range — at the cost of metered consumption and some lock-in.
      </p>
    </div>
  );
}
