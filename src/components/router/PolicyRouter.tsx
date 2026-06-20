"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Gauge,
  LockKeyhole,
  Minimize2,
  ShieldCheck,
  Sparkles,
  Waypoints,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fmtUSD } from "@/lib/pricing";
import {
  calculateMetrics,
  policyForScenario,
  route,
  type Policy,
  type PolicyPreset,
} from "@/lib/router/policy";
import {
  REQUESTS,
  SCENARIO_LABELS,
  type AgentRequest,
  type Scenario,
} from "@/lib/router/requests";
import {
  QUALITY_BAR,
  TIERS,
  TIER_LABELS,
  TIER_MODEL_NAMES,
  type Tier,
} from "@/lib/router/tiers";

const PRESET_LABELS: Record<PolicyPreset, string> = {
  balanced: "Balanced",
  costMin: "Cost-min",
  premium: "All-frontier",
};

const TIER_STYLES: Record<Tier, { dot: string; bg: string; border: string; text: string }> = {
  flashLite: {
    dot: "bg-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-300/25",
    text: "text-cyan-200",
  },
  flash: {
    dot: "bg-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-300/25",
    text: "text-blue-200",
  },
  geminiPro: {
    dot: "bg-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-300/25",
    text: "text-emerald-200",
  },
  sonnet: {
    dot: "bg-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-300/25",
    text: "text-violet-200",
  },
  opus: {
    dot: "bg-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-300/25",
    text: "text-amber-200",
  },
};

const TEASER_REQUESTS: AgentRequest[] = [
  REQUESTS.inapp[0],
  REQUESTS.sdlc[4],
  REQUESTS.multimodal[6],
  REQUESTS.agentic[1],
  REQUESTS.sdlc[14],
  REQUESTS.multimodal[8],
];

function requestPills(request: AgentRequest) {
  return [
    request.complexity,
    request.modality,
    request.sensitivity,
    request.latencySLA,
  ];
}

function formatLatency(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function Teaser({ activeIndex, reducedMotion }: { activeIndex: number; reducedMotion: boolean }) {
  const request = TEASER_REQUESTS[activeIndex % TEASER_REQUESTS.length];
  const decision = route(request, policyForScenario("balanced", request.scenario));
  const style = TIER_STYLES[decision.finalTier];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/55 p-4 shadow-2xl shadow-blue-950/25">
      <div className="mb-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
        <span>Live request</span>
        <span>Balanced policy</span>
        <span>Final lane</span>
      </div>
      <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={request.id}
            initial={reducedMotion ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: 18 }}
            transition={{ duration: 0.28 }}
            className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3"
          >
            <p data-testid="teaser-request" className="truncate text-xs font-semibold text-white">{request.label}</p>
            <p className="mt-1 text-[10px] capitalize text-white/40">
              {request.complexity} · {request.modality}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-1 text-blue-300">
          <motion.div
            animate={reducedMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-px w-6 bg-blue-400/60"
          />
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-blue-300/25 bg-blue-400/15">
            <Waypoints size={16} />
          </div>
          <ArrowRight size={14} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${request.id}-${decision.finalTier}`}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            className={`rounded-2xl border px-3 py-3 ${style.bg} ${style.border}`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${style.dot}`} />
              <span className={`text-xs font-bold ${style.text}`}>{TIER_LABELS[decision.finalTier]}</span>
              {decision.locked && <ShieldCheck size={12} className="ml-auto text-emerald-300" />}
            </div>
            <p className="mt-1 text-[10px] text-white/40">
              Q{decision.finalQuality}/5 · {formatLatency(decision.finalLatencyMs)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5" aria-label="Balanced routing destinations">
        {TIERS.map((tier) => (
          <div
            key={tier}
            className={`h-1.5 rounded-full transition-colors ${
              tier === decision.finalTier ? TIER_STYLES[tier].dot : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ZoneLabel({ letter, title, detail }: { letter: string; title: string; detail: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-blue-200">
        Zone {letter}
      </span>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-white/35">{detail}</p>
    </div>
  );
}

function Metric({
  metricKey,
  label,
  value,
  tone = "default",
}: {
  metricKey: string;
  label: string;
  value: string;
  tone?: "default" | "green" | "amber";
}) {
  const valueClass =
    tone === "green" ? "text-emerald-300" : tone === "amber" ? "text-amber-300" : "text-white";
  return (
    <div data-metric-key={metricKey} className="min-w-[132px] flex-1 rounded-2xl border border-white/8 bg-white/[0.045] px-3 py-3">
      <p className={`tabular-nums text-lg font-black tracking-tight ${valueClass}`}>{value}</p>
      <p className="mt-1 text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-white/30">{label}</p>
    </div>
  );
}

export default function PolicyRouter() {
  const reducedMotion = Boolean(useReducedMotion());
  const [expanded, setExpanded] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("sdlc");
  const [preset, setPreset] = useState<PolicyPreset>("balanced");
  const [policy, setPolicy] = useState<Policy>(() => policyForScenario("balanced", "sdlc"));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActiveIndex((index) => index + 1), expanded ? 2600 : 1900);
    return () => window.clearInterval(timer);
  }, [expanded, reducedMotion]);

  const requests = REQUESTS[scenario];
  const metrics = useMemo(() => calculateMetrics(requests, policy), [policy, requests]);
  const decision = metrics.decisions[activeIndex % metrics.decisions.length];

  const selectScenario = (nextScenario: Scenario) => {
    setScenario(nextScenario);
    setPolicy(policyForScenario(preset, nextScenario));
    setActiveIndex(0);
  };

  const selectPreset = (nextPreset: PolicyPreset) => {
    setPreset(nextPreset);
    setPolicy(policyForScenario(nextPreset, scenario));
  };

  const updateRuleTier = (ruleId: string, tier: Tier) => {
    setPolicy((current) => ({
      ...current,
      rules: current.rules.map((rule) =>
        rule.id === ruleId && !rule.locked ? { ...rule, route: tier } : rule,
      ),
    }));
  };

  const moveRule = (ruleId: string, direction: -1 | 1) => {
    setPolicy((current) => {
      const rules = [...current.rules];
      const from = rules.findIndex((rule) => rule.id === ruleId);
      if (from < 0 || rules[from].locked) return current;
      const to = from + direction;
      if (to < 0 || to >= rules.length || rules[to].locked) return current;
      [rules[from], rules[to]] = [rules[to], rules[from]];
      return { ...current, rules };
    });
  };

  return (
    <section
      data-testid="visual-policy-router"
      data-scenario={scenario}
      data-preset={preset}
      data-all-quality-pass={metrics.decisions.every((item) => item.finalQuality >= QUALITY_BAR)}
      data-regulated-governed={metrics.decisions
        .filter((item) => item.request.sensitivity === "regulated")
        .every((item) => item.governed)}
      className="w-full max-w-6xl"
      aria-labelledby="policy-router-title"
    >
      <motion.div
        layout
        transition={{ layout: { type: "spring", stiffness: 180, damping: 24 } }}
        className="overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.065] shadow-2xl shadow-black/25 backdrop-blur-xl"
      >
        <div className="p-5 sm:p-7 lg:p-8">
          <div className={`grid gap-6 ${expanded ? "" : "items-center lg:grid-cols-[0.85fr_1.35fr]"}`}>
            <div className={expanded ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" : ""}>
              <div>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                  <Sparkles size={13} />
                  Visual Policy Router
                </div>
                <h2 id="policy-router-title" className="max-w-2xl text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Right model for every request — automatically.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                  Routing policy turns model choice into an operating system.
                </p>
              </div>

              <button
                type="button"
                data-testid={expanded ? "collapse-router" : "open-router"}
                onClick={() => setExpanded((value) => !value)}
                className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:mt-0"
                aria-expanded={expanded}
              >
                {expanded ? <Minimize2 size={14} /> : <Waypoints size={14} />}
                {expanded ? "Collapse router" : "Open the router"}
              </button>
            </div>

            {!expanded && <Teaser activeIndex={activeIndex} reducedMotion={reducedMotion} />}
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="full-router"
                initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="mt-7 space-y-4">
                  <section data-zone="incoming" className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 sm:p-5">
                    <ZoneLabel letter="A" title="Incoming stream" detail="The policy evaluates request attributes, not brand preference." />
                    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Scenario selector">
                      {(Object.keys(SCENARIO_LABELS) as Scenario[]).map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => selectScenario(item)}
                          data-testid={`scenario-${item}`}
                          aria-pressed={scenario === item}
                          className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                            scenario === item
                              ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30"
                              : "border border-white/10 bg-white/[0.04] text-white/45 hover:text-white/80"
                          }`}
                        >
                          {SCENARIO_LABELS[item]}
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={decision.request.id}
                          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={reducedMotion ? undefined : { opacity: 0, x: 20 }}
                          className="rounded-2xl border border-blue-300/20 bg-blue-400/[0.08] p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-300">Request {decision.request.id}</p>
                              <p className="mt-1 text-sm font-bold text-white">{decision.request.label}</p>
                              <p className="mt-1 text-[11px] text-white/35">Task: {decision.request.taskType}</p>
                            </div>
                            <motion.div
                              animate={reducedMotion ? undefined : { x: [0, 5, 0] }}
                              transition={{ duration: 1.1, repeat: Infinity }}
                              className="hidden text-blue-300 sm:block"
                            >
                              <ArrowRight size={20} />
                            </motion.div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {requestPills(decision.request).map((pill) => (
                              <span key={pill} className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] font-semibold capitalize text-white/55">
                                {pill}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((offset) => {
                          const queued = requests[(activeIndex + offset) % requests.length];
                          return (
                            <div key={queued.id} className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.035] p-3 opacity-60">
                              <p className="truncate text-[10px] font-semibold text-white/70">{queued.label}</p>
                              <p className="mt-2 text-[9px] capitalize text-white/30">{queued.complexity} · {queued.sensitivity}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  <section data-zone="policy" className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 sm:p-5">
                    <ZoneLabel letter="B" title="Policy router + quality gate" detail="First match wins. Governance stays locked. Evaluation can escalate." />
                    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.35fr]">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/15 text-blue-300">
                              <Waypoints size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Matched policy</p>
                              <p className="text-[10px] text-white/35">{decision.reason}</p>
                            </div>
                          </div>
                          {decision.locked && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300">
                              <ShieldCheck size={11} /> Locked
                            </span>
                          )}
                        </div>

                        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <div className={`rounded-2xl border p-3 ${TIER_STYLES[decision.initialTier].bg} ${TIER_STYLES[decision.initialTier].border}`}>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">Selected</p>
                            <p className={`mt-1 text-xs font-black ${TIER_STYLES[decision.initialTier].text}`}>{TIER_LABELS[decision.initialTier]}</p>
                            <p className="mt-1 text-[9px] text-white/35">Q{decision.initialQuality}/5 · {fmtUSD(decision.initialEstimatedCost)}</p>
                          </div>
                          <ArrowRight size={15} className="text-white/25" />
                          <div className={`rounded-2xl border p-3 ${decision.escalated ? "border-amber-300/30 bg-amber-400/10" : "border-emerald-300/25 bg-emerald-400/10"}`}>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">Quality gate</p>
                            <p className={`mt-1 text-xs font-black ${decision.escalated ? "text-amber-200" : "text-emerald-200"}`}>
                              {decision.escalated ? `Escalate +${decision.tiersEscalated}` : "Pass"}
                            </p>
                            <p className="mt-1 text-[9px] text-white/35">
                              {decision.escalated ? `+${fmtUSD(decision.incrementalEscalationCost)}` : `Q${decision.finalQuality} clears ${QUALITY_BAR}`}
                            </p>
                          </div>
                        </div>

                        <div className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] ${decision.escalated ? "border-amber-300/20 bg-amber-400/[0.06] text-amber-200" : "border-emerald-300/20 bg-emerald-400/[0.06] text-emerald-200"}`}>
                          {decision.escalated ? <ArrowUp size={13} /> : <CheckCircle2 size={13} />}
                          {decision.escalated
                            ? `${TIER_LABELS[decision.initialTier]} scored ${decision.initialQuality}/${QUALITY_BAR}; rerouted to ${TIER_LABELS[decision.finalTier]}.`
                            : `${TIER_LABELS[decision.finalTier]} clears the quality bar without escalation.`}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-white">Editable policy</p>
                            <p className="mt-1 text-[10px] text-white/35">Change order or destination; the stream reroutes immediately.</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Policy preset">
                            {(Object.keys(PRESET_LABELS) as PolicyPreset[]).map((item) => (
                              <button
                                key={item}
                                type="button"
                                data-testid={`preset-${item}`}
                                onClick={() => selectPreset(item)}
                                aria-pressed={preset === item}
                                className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold transition-colors ${
                                  preset === item ? "bg-white text-slate-950" : "border border-white/10 text-white/45 hover:text-white/75"
                                }`}
                              >
                                {PRESET_LABELS[item]}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 space-y-2" data-testid="policy-rules">
                          {policy.rules.length === 0 && (
                            <div className="rounded-xl border border-amber-300/20 bg-amber-400/[0.07] p-3 text-[11px] text-amber-100/75">
                              No conditional rules. Every request goes directly to {TIER_LABELS[policy.fallback]}.
                            </div>
                          )}
                          {policy.rules.map((rule, index) => {
                            const active = decision.matchedRuleId === rule.id;
                            const firstEditableIndex = policy.rules.findIndex((item) => !item.locked);
                            return (
                              <motion.div
                                layout
                                key={rule.id}
                                data-rule-id={rule.id}
                                className={`grid items-center gap-2 rounded-xl border p-2.5 sm:grid-cols-[auto_1fr_auto] ${
                                  active
                                    ? "border-blue-300/35 bg-blue-400/10"
                                    : rule.locked
                                      ? "border-emerald-300/20 bg-emerald-400/[0.055]"
                                      : "border-white/8 bg-slate-950/30"
                                }`}
                              >
                                <div className="flex gap-1">
                                  {rule.locked ? (
                                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300" title="Locked governance rule">
                                      <LockKeyhole size={12} />
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        aria-label={`Move ${rule.id} up`}
                                        onClick={() => moveRule(rule.id, -1)}
                                        disabled={index <= firstEditableIndex}
                                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-white/40 disabled:opacity-20"
                                      >
                                        <ChevronUp size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        aria-label={`Move ${rule.id} down`}
                                        onClick={() => moveRule(rule.id, 1)}
                                        disabled={index === policy.rules.length - 1}
                                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-white/40 disabled:opacity-20"
                                      >
                                        <ChevronDown size={12} />
                                      </button>
                                    </>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-[10px] font-bold text-white/80">{rule.reason}</p>
                                  <p className="mt-0.5 truncate text-[9px] text-white/30">
                                    IF {Object.entries(rule.when).map(([key, value]) => `${key}=${value}`).join(" + ")}
                                  </p>
                                </div>
                                <select
                                  aria-label={`Route ${rule.id} to tier`}
                                  value={rule.route}
                                  disabled={rule.locked}
                                  onChange={(event) => updateRuleTier(rule.id, event.target.value as Tier)}
                                  className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-[10px] font-bold text-white outline-none focus:border-blue-300 disabled:cursor-not-allowed disabled:text-emerald-300"
                                >
                                  {TIERS.map((tier) => (
                                    <option key={tier} value={tier}>{TIER_LABELS[tier]}</option>
                                  ))}
                                </select>
                              </motion.div>
                            );
                          })}
                          <div className="flex items-center justify-between rounded-xl border border-dashed border-white/10 px-3 py-2 text-[10px] text-white/35">
                            <span>Otherwise fallback</span>
                            <span className="font-bold text-white/65">{TIER_LABELS[policy.fallback]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section data-zone="tiers" className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 sm:p-5">
                    <ZoneLabel letter="C" title="Tier lanes" detail="Final placement after governance and the quality gate." />
                    <div className="space-y-2">
                      {TIERS.map((tier) => {
                        const style = TIER_STYLES[tier];
                        const isDestination = decision.finalTier === tier;
                        return (
                          <div key={tier} data-tier-lane={tier} className={`relative overflow-hidden rounded-2xl border p-3 ${style.bg} ${style.border}`}>
                            <motion.div
                              className={`absolute inset-y-0 left-0 opacity-10 ${style.dot}`}
                              animate={{ width: `${Math.max(2, metrics.laneShare[tier])}%` }}
                              transition={{ duration: reducedMotion ? 0 : 0.45 }}
                            />
                            <div className="relative grid items-center gap-3 sm:grid-cols-[135px_1fr_auto]">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                                  <p className={`text-xs font-black ${style.text}`}>{TIER_LABELS[tier]}</p>
                                </div>
                                <p className="mt-1 truncate text-[9px] text-white/30">{TIER_MODEL_NAMES[tier]}</p>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                                <motion.div
                                  className={`h-full rounded-full ${style.dot}`}
                                  animate={{ width: `${metrics.laneShare[tier]}%` }}
                                  transition={{ duration: reducedMotion ? 0 : 0.45 }}
                                />
                              </div>
                              <div className="flex min-h-10 min-w-0 items-center justify-end sm:min-w-[330px]">
                                <AnimatePresence mode="wait" initial={false}>
                                  {isDestination ? (
                                    <motion.div
                                      key={`${decision.request.id}-${tier}`}
                                      initial={reducedMotion ? false : { opacity: 0, x: -24 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={reducedMotion ? undefined : { opacity: 0, x: 18 }}
                                      className={`flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-3 py-2 ${
                                        decision.escalated ? "border-amber-300/35 bg-amber-400/10" : "border-white/10 bg-slate-950/45"
                                      }`}
                                    >
                                      <p className="mr-auto truncate text-[10px] font-bold text-white">{decision.request.label}</p>
                                      <span className="text-[9px] text-white/50">{fmtUSD(decision.finalRealizedCost)}</span>
                                      <span className="text-[9px] text-white/50">{formatLatency(decision.finalLatencyMs)}</span>
                                      <span className="text-[9px] text-white/50">Q{decision.finalQuality}/5</span>
                                      {decision.governed && <ShieldCheck size={12} className="text-emerald-300" aria-label="Governed" />}
                                      {decision.escalated && <ArrowUp size={12} className="text-amber-300" aria-label="Escalated" />}
                                    </motion.div>
                                  ) : (
                                    <span key="empty" className="text-[9px] text-white/20">{metrics.laneShare[tier].toFixed(0)}% of scenario traffic</span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section data-testid="router-metrics" className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950/75 to-blue-950/45 p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <BarChart3 size={15} className="text-blue-300" />
                      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-white/70">Deterministic scenario metrics</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Metric metricKey="blended-cost" label="Blended cost / request" value={fmtUSD(metrics.blendedCostPerRequest)} />
                      <Metric metricKey="p50-latency" label="p50 latency" value={formatLatency(metrics.p50LatencyMs)} />
                      <Metric metricKey="p95-latency" label="p95 latency" value={formatLatency(metrics.p95LatencyMs)} />
                      <Metric metricKey="average-quality" label="Average final quality" value={`${metrics.averageFinalQuality.toFixed(2)} / 5`} />
                      <Metric metricKey="percentage-escalated" label="Requests escalated" value={`${metrics.percentageEscalated.toFixed(0)}%`} tone={metrics.percentageEscalated > 0 ? "amber" : "default"} />
                      <Metric
                        metricKey="all-frontier-delta"
                        label="Cost delta vs All-frontier"
                        value={metrics.costDeltaVsAllFrontier >= 0 ? `${metrics.costDeltaPctVsAllFrontier.toFixed(0)}% lower` : `${Math.abs(metrics.costDeltaPctVsAllFrontier).toFixed(0)}% higher`}
                        tone={metrics.costDeltaVsAllFrontier > 0 ? "green" : "default"}
                      />
                      <Metric metricKey="cost-min-failures" label="Cost-min failures before gate" value={String(metrics.wouldHaveShippedQualityFailures)} tone="amber" />
                      <Metric metricKey="active-failures-avoided" label="Active failures avoided" value={String(metrics.qualityFailuresAvoided)} tone={metrics.qualityFailuresAvoided > 0 ? "green" : "default"} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-white/35">
                      <span className="inline-flex items-center gap-1.5"><CircleDollarSign size={12} /> Every cost uses the shared pricing engine.</span>
                      <span className="inline-flex items-center gap-1.5"><Gauge size={12} /> Quality bar: {QUALITY_BAR}/5.</span>
                      <span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} /> Regulated requests require governed tiers.</span>
                      {metrics.wouldHaveShippedQualityFailures > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-200/70"><XCircle size={12} /> Cheapest-only routing would ship failures.</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-200/70"><CheckCircle2 size={12} /> No pre-gate failures in this dataset.</span>
                      )}
                    </div>
                  </section>

                  <p className="px-2 pt-1 text-center text-[11px] leading-relaxed text-white/35">
                    «In an integrated platform this router is a centralized service (one gateway, one policy, audited) — not something you rebuild per agent.»
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
