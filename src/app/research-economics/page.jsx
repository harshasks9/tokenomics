"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

/* ============================================================================
   ENTERPRISE RESEARCH ECONOMICS SIMULATOR
   Dark hero, light body. Three real research runs, six orchestration configs (matching the harness).
   Market figures are real (sourced); token/pricing/quality figures are
   illustrative forward-looking demo assumptions for executive scenario modeling.
   ========================================================================== */

const D = { text: "#f3f3f6", muted: "#8b8b95", faint: "#5a5a64", hair: "rgba(255,255,255,0.085)", hair2: "rgba(255,255,255,0.05)" };
const L = { bg: "#f4f5f8", text: "#1a1a1f", muted: "#56565f", faint: "#9a9aa4", hair: "rgba(20,20,40,0.10)", hair2: "rgba(20,20,40,0.055)" };
const A_DARK = "linear-gradient(90deg,#22d3ee,#a78bfa,#fb923c)";
const A_LIGHT = "linear-gradient(90deg,#0891b2,#7c3aed,#ea580c)";

/* ---------- model fleet (real version names; illustrative economics) ---------- */
const MODELS = {
  Opus:           { label: "Opus 4.8",        tier: "Frontier",  rate: 30.0, quality: 98, lat: 1.40, c: "#a78bfa", cL: "#7c3aed" },
  "GPT-5.5":      { label: "GPT-5.5",         tier: "Frontier",  rate: 12.0, quality: 92, lat: 1.20, c: "#22d3ee", cL: "#0891b2" },
  Sonnet:         { label: "Sonnet 4.6",      tier: "Mid",       rate: 6.0,  quality: 80, lat: 1.00, c: "#5eead4", cL: "#0d9488" },
  "Gemini Flash": { label: "Gemini Flash 3.5",tier: "Efficient", rate: 0.6,  quality: 62, lat: 0.50, c: "#fb923c", cL: "#ea580c" },
};

/* ---------- six research stages ---------- */
const STAGES = [
  { key: "planning",     short: "Planning",      name: "Pre-Research Planning",    tokenLabel: "Planning",
    baseTokens: 8000,   baseLat: 12, weight: 0.12, load: "High reasoning · low volume",
    desc: "Decompose the question, design the research plan, and set the evidence bar. Low token volume, high downstream leverage — a weak plan poisons everything after it.",
    activities: ["Scope & success criteria", "Sub-question decomposition", "Source strategy & budget"] },
  { key: "acquisition",  short: "Acquisition",   name: "Information Acquisition",  tokenLabel: "Acquisition",
    baseTokens: 45000,  baseLat: 40, weight: 0.08, load: "Low reasoning · high volume", search: true,
    desc: "Write queries, read sources, judge relevance, extract and de-duplicate. Mechanical and high-volume — reliable retrieval is enough here, so frontier capability adds little.",
    activities: ["Multi-source retrieval", "Relevance & recency filtering", "Source de-duplication"] },
  { key: "analysis",     short: "Deep Research", name: "Deep Research",            tokenLabel: "Analysis",
    baseTokens: 120000, baseLat: 90, weight: 0.34, load: "Very high reasoning · very high volume", search: true,
    desc: "Cross-source reasoning, quantitative modeling, and contradiction resolution. This is the run — the stage where frontier capability matters most.",
    activities: ["Cross-source reasoning", "Quantitative modeling", "Contradiction resolution"] },
  { key: "synthesis",    short: "Synthesis",     name: "Research Synthesis",       tokenLabel: "Synthesis",
    baseTokens: 60000,  baseLat: 35, weight: 0.22, load: "High reasoning · medium volume",
    desc: "Compress findings into a defensible thesis and weight confidence. Where the \u201cso what\u201d comes from — high leverage on the final verdict.",
    activities: ["Thesis construction", "Evidence-to-claim linking", "Confidence weighting"] },
  { key: "presentation", short: "Presentation",  name: "Presentation Generation",  tokenLabel: "Presentation",
    baseTokens: 35000,  baseLat: 25, weight: 0.08, load: "Medium reasoning · medium volume", split: true,
    desc: "The model authors the deck as structured text — slide flow, executive prose, and chart data bindings. The platform then renders and beautifies it deterministically.",
    activities: ["Slide structure & narrative", "Executive summary prose", "Chart data bindings"] },
  { key: "evaluation",   short: "Evaluation",    name: "Post Research Evaluation", tokenLabel: "Evaluation",
    baseTokens: 18000,  baseLat: 15, weight: 0.16, load: "High reasoning · low volume",
    desc: "Fact and citation check, gap detection, and scoring. The quality gate that stops flawed research from shipping — high leverage at low token volume.",
    activities: ["Fact & citation check", "Gap detection", "Quality scoring"] },
];

/* ---------- six orchestration configs — identical to the harness (run.js) ----------
   Reasoning stages (planning, deep research, synthesis, evaluation) take the frontier
   model; mechanical stages (acquisition, presentation) take an efficient model. The
   single-model runs (C1, C4, C5) are baselines — the quality ceiling and cost floor.
   Six explicit model slots, one per stage.
   Stage order: Planning · Acquisition · Deep Research · Synthesis · Presentation · Evaluation */
const ORCH = [
  { id: "C1", name: "Frontier Premium",       blurb: "Opus 4.8 on every stage — the quality ceiling, and the most expensive way to run the task.",
    seq: ["Opus", "Opus", "Opus", "Opus", "Opus", "Opus"] },
  { id: "C2", name: "Balanced Claude",        blurb: "Opus 4.8 on the reasoning stages, Sonnet 4.6 on acquisition and the deck. An all-Claude tiered stack.",
    seq: ["Opus", "Sonnet", "Opus", "Opus", "Sonnet", "Opus"] },
  { id: "C3", name: "Lean Frontier (Claude)", blurb: "Opus 4.8 reasoning, Gemini Flash 3.5 on the routine stages. The recommended balance of cost and quality.",
    seq: ["Opus", "Gemini Flash", "Opus", "Opus", "Gemini Flash", "Opus"] },
  { id: "C4", name: "GPT-5.5 Baseline",       blurb: "GPT-5.5 on every stage — a single-vendor frontier baseline for comparison.",
    seq: ["GPT-5.5", "GPT-5.5", "GPT-5.5", "GPT-5.5", "GPT-5.5", "GPT-5.5"] },
  { id: "C5", name: "Economy Floor",          blurb: "Gemini Flash 3.5 on every stage — the cost floor, included to show what reasoning quality costs you.",
    seq: ["Gemini Flash", "Gemini Flash", "Gemini Flash", "Gemini Flash", "Gemini Flash", "Gemini Flash"] },
  { id: "C6", name: "Lean Frontier (GPT)",    blurb: "GPT-5.5 reasoning, Gemini Flash 3.5 on the routine stages. The same lean pattern with a GPT brain — no Anthropic.",
    seq: ["GPT-5.5", "Gemini Flash", "GPT-5.5", "GPT-5.5", "Gemini Flash", "GPT-5.5"] },
];

/* ---------- three REAL research runs (figures sourced from market research, 2025-26) ---------- */
const TOPICS = [
  {
    id: "T1", name: "IT Market Spend — Healthcare Tech, Japan", short: "Japan Healthcare IT",
    mult: 1.0, difficulty: 1.0, accent: "#0891b2",
    pres: {
      headline: { value: "$36.1B", label: "Japan healthcare IT market by 2033" },
      unit: "USD B",
      chart: [{ year: "2024", v: 15.6 }, { year: "2027", v: 20.5 }, { year: "2030", v: 27.0 }, { year: "2033", v: 36.1 }],
      stats: [
        { k: "CAGR ’25–’33", v: "9.0%" }, { k: "Population 65+", v: "25%+" },
        { k: "Digital health ’33", v: "$55.8B" }, { k: "Hospital IS CAGR", v: "20.2%" },
      ],
      findings: [
        "An aging population (over a quarter aged 65+) and clinician shortages are pushing EHR, telehealth, and AI adoption across providers.",
        "Government action in 2024 expanded remote care and standardized electronic medical records, accelerating interoperability spend.",
        "Healthcare cybersecurity is a fast-rising line item, growing roughly 18.6% CAGR as sensitive data moves digital.",
        "AI drug discovery and healthcare robotics (incl. NVIDIA-based platforms) emerged as a 2024 growth vector.",
      ],
      sources: ["IMARC Group", "Grand View Research"],
    },
  },
  {
    id: "T2", name: "Open RAN & 5G Network Infrastructure — Global", short: "Open RAN / 5G",
    mult: 1.15, difficulty: 0.96, accent: "#7c3aed",
    pres: {
      headline: { value: "$20.9B", label: "global Open RAN market by 2030" },
      unit: "USD B",
      chart: [{ year: "2024", v: 2.8 }, { year: "2026", v: 5.4 }, { year: "2028", v: 10.6 }, { year: "2030", v: 20.9 }],
      stats: [
        { k: "CAGR ’24–’30", v: "39.4%" }, { k: "NEC", v: "Top-5 vendor" },
        { k: "RIC market CAGR", v: "61%" }, { k: "Fastest segment", v: "Services" },
      ],
      findings: [
        "5G commercialization, vendor diversification, and lower total cost of ownership are the primary adoption drivers.",
        "NEC is a named global leader, having demonstrated multi-vendor Near-RT RIC interoperability at O-RAN PlugFest events.",
        "Asia Pacific is the fastest-growing region, anchored by operators in Japan, India, and China.",
        "Integration cost and multi-vendor complexity remain the leading restraints on carrier-grade scale.",
      ],
      sources: ["MarketsandMarkets", "Grand View Research"],
    },
  },
  {
    id: "T3", name: "Data Center & AI Infrastructure Capex — APAC", short: "APAC Data Centers",
    mult: 1.10, difficulty: 0.98, accent: "#ea580c",
    pres: {
      headline: { value: "$174.8B", label: "APAC data-center investment by 2030" },
      unit: "USD B",
      chart: [{ year: "2024", v: 102.5 }, { year: "2026", v: 122.5 }, { year: "2028", v: 146.4 }, { year: "2030", v: 174.8 }],
      stats: [
        { k: "CAGR ’24–’30", v: "9.3%" }, { k: "China share", v: "~49%" },
        { k: "APAC capacity ’30", v: "57 GW" }, { k: "AI-optimized CAGR", v: "22.7%" },
      ],
      findings: [
        "AI workloads, hyperscaler expansion, and sovereign-AI investment are the dominant capex drivers through 2030.",
        "China leads regional investment (~49%), with Malaysia, India, and Japan rising fast as new hubs.",
        "Energy and grid-connection constraints — plus multi-year equipment lead times — are the top bottlenecks.",
        "Global AI-ready data-center investment is projected near $5.2T by 2030 (McKinsey), with AI ~70% of new demand.",
      ],
      sources: ["Arizton", "Mordor Intelligence", "JLL", "McKinsey"],
    },
  },
];

const RADAR_AXES = [
  { axis: "Coverage",               stages: ["acquisition", "analysis"],  def: "How much of the relevant evidence space the run actually covered." },
  { axis: "Accuracy",               stages: ["analysis", "evaluation"],   def: "Factual correctness of claims after the evaluation pass." },
  { axis: "Depth",                  stages: ["analysis", "synthesis"],    def: "Reasoning depth beyond surface summary — scenarios, second-order effects." },
  { axis: "Coherence",              stages: ["synthesis", "planning"],    def: "Logical flow and internal consistency of the narrative." },
  { axis: "Citation Quality",       stages: ["acquisition", "evaluation"],def: "Source credibility, traceability, and citation integrity." },
  { axis: "Presentation Readiness", stages: ["presentation", "synthesis"],def: "How decision-ready the final artifact is for an executive." },
];

/* ---------- the master prompt shown via "View master prompt" (mirrors the harness) ---------- */
const MASTER_PROMPTS = {
  assumption: "Author: a senior market-intelligence analyst at NEC, producing a decision-grade brief for NEC's Strategy & Investment Committee. The models are never told they are being compared or judged — only the assessor is told it is grading.",
  role: "You are a senior market-intelligence analyst at NEC Corporation, producing a decision-grade brief for NEC's Strategy & Investment Committee, held to top-tier consulting standards: every figure carries unit, currency, and year; every figure is attributed to a named, dated source; actuals are separated from forecasts; the most recent data is used and dated data is flagged; conflicting sources are reconciled with reasoning; no vague qualifiers without a number; missing evidence is stated, never fabricated.",
  stages: [
    { n: "01", key: "planning", name: "Pre-Research Planning", text: "Produce the plan that governs the engagement: the decision to support and success criteria; a working scope definition (what counts as the market, and what's excluded); 5–8 MECE sub-questions, each naming the evidence and unit required; a source strategy with a recency bar; and the main threats to validity and how they're handled." },
    { n: "02", key: "acquisition", name: "Information Acquisition", text: "Execute the source strategy with web search and assemble a clean, attributed evidence set: each data point with value (unit, currency, year), named source, and publication date; covering market size, forecast with base/horizon years and CAGR, segments, demand drivers, and named players. Record conflicts and gaps. Do not analyze yet." },
    { n: "03", key: "analysis", name: "Deep Research", text: "Convert evidence into defensible analysis: reconcile conflicting figures into a point estimate plus range; build the quantitative picture (sizing/triangulation, growth decomposition, segment and vendor structure) showing the arithmetic; search again to close gaps; identify second-order effects and sensitivities." },
    { n: "04", key: "synthesis", name: "Research Synthesis", text: "Compress into a decision-grade thesis: a one-line headline answer with the key number; the 3–5 decision-driving findings, each with its figure and a confidence level and basis; the explicit 'so what' for NEC; and the single largest uncertainty that could overturn the thesis." },
    { n: "05", key: "presentation", name: "Presentation Generation", text: "Author the committee deck as structured text only: a title slide; 4–6 content slides whose headings are claims (not topics), each with tight bullets and the key figure; exact chart specifications (type + data points); and a closing 'Implications for NEC' slide. A downstream renderer turns this into slides." },
    { n: "06", key: "evaluation", name: "Post Research Evaluation", text: "Red-team the brief as a skeptical committee member: spot-check that headline figures trace to credible, dated sources; name the weakest claim, the biggest gap, and any internal inconsistency; and state whether it is decision-ready and what must be fixed. Written critique only — no scores." },
  ],
  judgeIntro: "A separate, impartial assessor (GPT-5.5 — a competitor model, chosen so the grading can't be dismissed as self-scored) receives the mandate and the full multi-stage output, and scores six dimensions 0–100 against fixed definitions and anchors, returning JSON only.",
};

/* ---------- economic model ---------- */
const stageModelKey = (seq, idx) => seq[idx];

function computeOrch(orch, topic) {
  const diff = topic.difficulty, mult = topic.mult;
  const stages = STAGES.map((st, i) => {
    const mKey = stageModelKey(orch.seq, i);
    const m = MODELS[mKey];
    const tokens = st.baseTokens * mult;
    const cost = (tokens / 1e6) * m.rate;
    const latency = st.baseLat * m.lat * Math.sqrt(mult);
    const stageQuality = Math.min(100, m.quality * diff);
    return { ...st, modelKey: mKey, model: m, tokens, cost, latency, stageQuality, qContrib: st.weight * stageQuality };
  });
  const totalTokens = stages.reduce((s, x) => s + x.tokens, 0);
  const costPerRun = stages.reduce((s, x) => s + x.cost, 0);
  const runtimeSec = stages.reduce((s, x) => s + x.latency, 0);
  const quality = stages.reduce((s, x) => s + x.qContrib, 0);
  const qByStage = Object.fromEntries(stages.map((s) => [s.key, s.stageQuality]));
  const radar = RADAR_AXES.map((a) => ({
    axis: a.axis, value: Math.round(a.stages.reduce((s, k) => s + qByStage[k], 0) / a.stages.length),
  }));
  const baselineCostPerRun = (totalTokens / 1e6) * MODELS.Opus.rate;
  const insightsPerRun = Math.max(1, Math.round((quality / 100) * 14));
  const costPerInsight = costPerRun / insightsPerRun;
  return { ...orch, stages, totalTokens, costPerRun, runtimeSec, quality, radar, baselineCostPerRun, insightsPerRun, costPerInsight };
}

/* ---------- formatting ---------- */
const NF = new Intl.NumberFormat("en-US");
const fmtInt = (n) => NF.format(Math.round(n));
const fmtUSD = (n, dp = 0) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const fmtTok = (n) => (n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(0) + "K" : fmtInt(n));
const fmtMin = (s) => { const m = Math.floor(s / 60), r = Math.round(s % 60); return m > 0 ? `${m}m ${r}s` : `${r}s`; };

/* ============================ motion primitives ============================ */
function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches); const h = () => setR(mq.matches);
    mq.addEventListener?.("change", h); return () => mq.removeEventListener?.("change", h);
  }, []); return r;
}
function useInView(opts = { threshold: 0.18 }) {
  const ref = useRef(null); const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, opts);
    obs.observe(el); return () => obs.disconnect();
  }, []); return [ref, inView];
}
function useCountUp(target, { duration = 1300, decimals = 0 } = {}, active = true) {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? target : 0);
  const dispRef = useRef(reduced ? target : 0); const raf = useRef();
  useEffect(() => {
    if (!active) return;
    if (reduced) { dispRef.current = target; setVal(target); return; }
    const from = dispRef.current, to = target, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration); const e = 1 - Math.pow(1 - p, 3);
      const cur = from + (to - from) * e; dispRef.current = cur; setVal(cur);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, reduced, duration]);
  return decimals === 0 ? Math.round(val) : Number(val.toFixed(decimals));
}
function Reveal({ children, delay = 0, y = 22, style }) {
  const reduced = useReducedMotion(); const [ref, inView] = useInView(); const on = reduced || inView;
  return (<div ref={ref} style={{
    opacity: on ? 1 : 0, transform: on ? "none" : `translateY(${y}px)`,
    transition: reduced ? "none" : `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}s, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}s`,
    ...style,
  }}>{children}</div>);
}
function ScaleNumber({ value, prefix = "", suffix = "", decimals = 0, accent }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const n = useCountUp(value, { decimals, duration: 1500 }, inView);
  const display = decimals === 0 ? fmtInt(n) : n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (<span ref={ref} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "-0.03em",
    background: accent, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{prefix}{display}{suffix}</span>);
}

/* ============================ shared visuals ============================ */
const glassD = (extra = {}) => ({
  background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))",
  border: `1px solid ${D.hair}`, borderRadius: 18, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px -30px rgba(0,0,0,0.9)", ...extra,
});
const glassL = (extra = {}) => ({
  background: "rgba(255,255,255,0.74)", border: `1px solid ${L.hair}`, borderRadius: 18,
  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 22px 50px -32px rgba(30,30,60,0.35)", ...extra,
});

function Relay({ seq, height = 40, animate = true, dotR = 6, theme = "dark" }) {
  const reduced = useReducedMotion();
  const key = theme === "light" ? "cL" : "c";
  const nodes = STAGES.map((_, i) => MODELS[stageModelKey(seq, i)]);
  const grad = `linear-gradient(90deg, ${nodes.map((n) => n[key]).join(", ")})`;
  const glow = theme === "light" ? 0.5 : 1;
  return (
    <div style={{ position: "relative", height, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", left: dotR, right: dotR, top: "50%", height: 2, transform: "translateY(-50%)",
        background: grad, opacity: theme === "light" ? 0.85 : 0.6, borderRadius: 2 }} />
      {animate && !reduced && (
        <div className="relay-pulse" style={{ position: "absolute", top: "50%", width: 14, height: 14, marginTop: -7, borderRadius: "50%",
          background: theme === "light" ? "radial-gradient(circle, #1a1a1f 0%, rgba(26,26,31,0.2) 50%, transparent 70%)"
            : "radial-gradient(circle, #fff 0%, rgba(255,255,255,0.2) 50%, transparent 70%)", filter: "blur(1px)" }} />
      )}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", width: "100%" }}>
        {nodes.map((n, i) => (
          <div key={i} title={n.label} style={{ width: dotR * 2, height: dotR * 2, borderRadius: "50%", background: n[key],
            boxShadow: `0 0 ${12 * glow}px ${n[key]}, 0 0 2px ${n[key]}`,
            border: theme === "light" ? "1.5px solid rgba(255,255,255,0.9)" : "1.5px solid rgba(0,0,0,0.5)" }} />
        ))}
      </div>
    </div>
  );
}

function ModelLegend({ theme = "dark" }) {
  const key = theme === "light" ? "cL" : "c"; const t = theme === "light" ? L : D;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 22px", alignItems: "center" }}>
      {Object.values(MODELS).map((m) => (
        <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: m[key], boxShadow: `0 0 8px ${m[key]}` }} />
          <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{m.label}</span>
          <span style={{ fontSize: 11, color: t.faint, fontFamily: "'JetBrains Mono', monospace" }}>{m.tier}</span>
        </div>
      ))}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, fmt, accent }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <span style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: L.muted, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em",
          background: accent, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="range" aria-label={label}
        style={{ background: `linear-gradient(90deg, #0891b2 0%, #7c3aed ${pct}%, rgba(20,20,40,0.10) ${pct}%)` }} />
    </div>
  );
}

function StrategySwitch({ computed, selectedId, onSelect }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {computed.map((o) => {
        const active = o.id === selectedId;
        return (
          <button key={o.id} onClick={() => onSelect(o.id)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 999, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, letterSpacing: "0.04em",
            color: active ? "#fff" : L.text,
            background: active ? "linear-gradient(90deg,#0891b2,#7c3aed)" : "rgba(255,255,255,0.7)",
            border: `1px solid ${active ? "transparent" : L.hair}`,
            boxShadow: active ? "0 8px 22px -10px #7c3aed" : "none", transition: "all .25s",
          }}>
            <strong style={{ fontWeight: 600 }}>{o.id}</strong>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{o.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* a compact six-segment bar showing the model per stage */
function StageDots({ seq }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {seq.map((k, i) => (
        <span key={i} title={`Stage ${i + 1}: ${MODELS[k].label}`} style={{ flex: 1, height: 6, borderRadius: 3, background: MODELS[k].cL }} />
      ))}
    </div>
  );
}

/* selectable strategy cards (Section 02) */
function StrategyCards({ computed, selectedId, onSelect, recommendedId, detailed }) {
  const maxCost = Math.max(...computed.map((c) => c.costPerRun));
  return (
    <div className="strat-grid">
      {computed.map((o) => {
        const active = o.id === selectedId;
        const rec = o.id === recommendedId;
        return (
          <button key={o.id} onClick={() => onSelect(o.id)} className={`strat-card${active ? " active" : ""}`}>
            {rec && <span style={{ position: "absolute", top: 12, right: 12, fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#fff", background: A_LIGHT, padding: "3px 8px", borderRadius: 999 }}>Recommended</span>}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#0891b2" }}>{o.id}</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16.5, fontWeight: 600, color: L.text }}>{o.name}</span>
            </div>
            {detailed
              ? <p style={{ fontSize: 12, color: L.muted, lineHeight: 1.45, margin: "8px 0 14px", minHeight: 52 }}>{o.blurb}</p>
              : <div style={{ height: 14 }} />}
            <StageDots seq={o.seq} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 9, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>Illustrative cost</div>
                <div style={{ marginTop: 5, width: 70, height: 6, borderRadius: 3, background: L.hair2, overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: `${(o.costPerRun / maxCost) * 100}%`, background: A_LIGHT }} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>Quality /100</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#0d9488", marginTop: 1 }}>{o.quality.toFixed(0)}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* visual, clickable six-stage pipeline (Section 03) — click a stage for its brief */
function VisualPipeline({ pipeline, onStageClick }) {
  return (
    <div className="pipeflow">
      {pipeline.stages.map((s, i) => {
        const mc = s.model.cL;
        return (
          <React.Fragment key={s.key}>
            <button className="pipenode" style={{ borderTopColor: mc }} onClick={() => onStageClick(s.key)} title="Click to see this stage's brief">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: L.faint }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ display: "flex", gap: 5 }}>
                  {s.search && <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0891b2", background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.3)", borderRadius: 999, padding: "2px 7px" }}>live search</span>}
                  {s.split && <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#ea580c", background: "rgba(234,88,12,0.1)", border: "1px solid rgba(234,88,12,0.3)", borderRadius: 999, padding: "2px 7px" }}>+ render</span>}
                </span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: L.text, lineHeight: 1.15 }}>{s.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: mc, boxShadow: `0 0 7px ${mc}`, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: mc }}>{s.model.label}</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: L.hair2, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${Math.min(100, s.weight * 280)}%`, background: mc, opacity: 0.7 }} />
              </div>
              <div className="pipenode-cta" style={{ color: mc }}>View brief →</div>
            </button>
            {i < pipeline.stages.length - 1 && <div className="pipearrow" aria-hidden>→</div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Section({ index, kicker, title, sub, children }) {
  return (
    <section style={{ paddingTop: 100 }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#7c3aed", letterSpacing: "0.1em" }}>{index}</span>
          <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: L.muted, fontFamily: "'JetBrains Mono', monospace" }}>{kicker}</span>
          <span style={{ flex: 1, height: 1, background: L.hair2 }} />
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "-0.03em",
          fontSize: "clamp(28px,3.6vw,42px)", margin: "0 0 12px", lineHeight: 1.08, color: L.text }}>{title}</h2>
        {sub && <p style={{ color: L.muted, fontSize: 16, lineHeight: 1.55, maxWidth: 760, margin: 0 }}>{sub}</p>}
      </Reveal>
      <div style={{ marginTop: 34 }}>{children}</div>
    </section>
  );
}

/* token usage per section (the six stages) */
function TokenBars({ run }) {
  const max = Math.max(...run.stages.map((s) => s.tokens));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      {run.stages.map((s) => (
        <div key={s.key}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, color: L.text }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.model.cL }} />
              {s.tokenLabel}
              <span style={{ color: L.faint, fontSize: 11 }}>· {s.model.label}</span>
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: L.muted }}>{fmtTok(s.tokens)}</span>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: "rgba(20,20,40,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(s.tokens / max) * 100}%`, borderRadius: 4,
              background: `linear-gradient(90deg, ${s.model.cL}, ${s.model.cL}aa)`, transition: "width .7s cubic-bezier(.2,.7,.2,1)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* the embedded research presentation (beautiful, sourced) */
function Presentation({ topic }) {
  const p = topic.pres, a = topic.accent;
  return (
    <div>
      {/* headline + chart */}
      <div className="pres-top">
        <div>
          <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace" }}>Market Outlook</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(40px,5vw,60px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, color: a, marginTop: 6 }}>{p.headline.value}</div>
          <div style={{ fontSize: 14, color: L.muted, marginTop: 8, maxWidth: 260 }}>{p.headline.label}</div>
          <div className="pres-stats">
            {p.stats.map((s) => (
              <div key={s.k} style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(20,20,40,0.025)", border: `1px solid ${L.hair2}` }}>
                <div style={{ fontSize: 10, color: L.faint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.k}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: L.text, marginTop: 3 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Market size · {p.unit}</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={p.chart} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id={"grad" + topic.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={a} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={a} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fill: L.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: L.faint, fontSize: 11 }} axisLine={false} tickLine={false} width={38} />
                <Tooltip contentStyle={{ background: "#fff", border: `1px solid ${L.hair}`, borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => ["$" + v + "B", "Market size"]} cursor={{ stroke: a, strokeOpacity: 0.3 }} />
                <Area type="monotone" dataKey="v" stroke={a} strokeWidth={2.5} fill={"url(#grad" + topic.id + ")"} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* findings */}
      <div style={{ marginTop: 22, paddingTop: 20, borderTop: `1px solid ${L.hair2}` }}>
        <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Key findings</div>
        <div className="pres-findings">
          {p.findings.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: a, fontSize: 14, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontSize: 13.5, color: L.text, lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>Sources</span>
          {p.sources.map((s) => (
            <span key={s} style={{ fontSize: 12, color: L.muted, padding: "3px 10px", borderRadius: 999, background: "rgba(20,20,40,0.03)", border: `1px solid ${L.hair2}` }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* how-quality-is-assessed modal */
function QualityModal({ open, onClose, run, topic }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  const radarData = RADAR_AXES.map((a, i) => ({ axis: a.axis, selected: run.radar[i].value, frontier: Math.round(98 * topic.difficulty) }));
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="How quality is assessed">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'JetBrains Mono', monospace" }}>How quality is assessed</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", margin: "6px 0 0", color: L.text }}>
              {run.name} · {topic.short}
            </h3>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">✕</button>
        </div>

        <p style={{ fontSize: 14, color: L.muted, lineHeight: 1.55, maxWidth: 640, margin: "10px 0 0" }}>
          Each model is benchmarked 0–100 on research tasks. A run's score is the <strong style={{ color: L.text }}>stage-weighted blend</strong> of the
          model assigned to each stage — so routing a weak model into a high-weight stage visibly lowers quality.
        </p>

        <div className="modal-grid">
          {/* radar */}
          <div style={glassL({ padding: "16px 12px 6px", height: 340 })}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="rgba(20,20,40,0.13)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: L.muted, fontSize: 11, fontFamily: "Inter" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: L.faint, fontSize: 9 }} stroke="rgba(20,20,40,0.1)" axisLine={false} />
                <Radar name="All-Frontier" dataKey="frontier" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.07} strokeWidth={1} strokeDasharray="4 4" />
                <Radar name={run.name} dataKey="selected" stroke="#0891b2" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* dimensions */}
          <div>
            <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Six quality dimensions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {RADAR_AXES.map((a, i) => (
                <div key={a.axis} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#0891b2", width: 30, flexShrink: 0, paddingTop: 1 }}>{radarData[i].selected}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: L.text }}>{a.axis}</div>
                    <div style={{ fontSize: 12.5, color: L.muted, lineHeight: 1.45 }}>{a.def}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* stage weighting */}
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${L.hair2}` }}>
          <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Stage weighting — why the model placement matters</div>
          <div className="weight-row">
            {run.stages.map((s) => (
              <div key={s.key} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: L.muted, marginBottom: 6, height: 28 }}>{s.short}</div>
                <div style={{ height: 70, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div style={{ width: 26, height: `${s.weight / 0.34 * 100}%`, borderRadius: "6px 6px 0 0", background: `linear-gradient(180deg, ${s.model.cL}, ${s.model.cL}66)` }} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: L.text, marginTop: 6 }}>{Math.round(s.weight * 100)}%</div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.model.cL }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* the master-prompt viewer: shows the assumption, the six stage prompts, and the judge rubric */
function MasterPromptModal({ open, onClose, focusKey, pipeline }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;

  const modelByKey = {};
  if (pipeline) pipeline.stages.forEach((s) => { modelByKey[s.key] = s.model; });
  const focused = focusKey ? MASTER_PROMPTS.stages.find((s) => s.key === focusKey) : null;
  const focusModel = focused ? modelByKey[focused.key] : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Master prompt">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'JetBrains Mono', monospace" }}>
              {focused ? `Master prompt · Stage ${focused.n}` : "Master prompt"}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", margin: "6px 0 0", color: L.text }}>
              {focused ? focused.name : "Exactly what every model was asked"}
            </h3>
            {focused && focusModel && pipeline && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12.5, color: L.muted }}>In {pipeline.name}, this stage runs on</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: focusModel.cL, border: `1px solid ${focusModel.cL}`, borderRadius: 999, padding: "3px 10px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: focusModel.cL }} />{focusModel.label}
                </span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">✕</button>
        </div>

        {!focused && (
          <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.25)" }}>
            <div style={{ fontSize: 10.5, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Working assumption</div>
            <div style={{ fontSize: 13.5, color: L.text, lineHeight: 1.55 }}>{MASTER_PROMPTS.assumption}</div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Standing instruction (every stage inherits this)</div>
          <div style={{ fontSize: 13, color: L.muted, lineHeight: 1.55 }}>{MASTER_PROMPTS.role}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
            {focused ? "This stage's instruction" : "The six stage prompts"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(focused ? [focused] : MASTER_PROMPTS.stages).map((s) => {
              const m = modelByKey[s.key];
              const hot = focused && s.key === focused.key;
              return (
                <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: hot ? "12px 14px" : 0,
                  borderRadius: hot ? 12 : 0, background: hot && m ? `${m.cL}0e` : "transparent", border: hot && m ? `1px solid ${m.cL}3a` : "none" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: m ? m.cL : "#0891b2", flexShrink: 0, paddingTop: 1 }}>{s.n}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: L.text }}>{s.name}</span>
                      {m && <span style={{ fontSize: 11, fontWeight: 600, color: m.cL }}>{m.label}</span>}
                    </div>
                    <div style={{ fontSize: 12.5, color: L.muted, lineHeight: 1.5, marginTop: 2 }}>{s.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${L.hair2}` }}>
          <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>How it's judged</div>
          <div style={{ fontSize: 12.5, color: L.muted, lineHeight: 1.55, marginBottom: 12 }}>{MASTER_PROMPTS.judgeIntro}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 22px" }}>
            {RADAR_AXES.map((a) => (
              <div key={a.axis} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#0d9488", marginTop: 1 }}>›</span>
                <div><span style={{ fontSize: 13, fontWeight: 600, color: L.text }}>{a.axis}</span>
                  <span style={{ fontSize: 12.5, color: L.muted }}> — {a.def}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ main ============================ */
export default function App() {
  const [employees, setEmployees] = useState(30000);
  const [tasksPerDay, setTasksPerDay] = useState(1);
  const [selectedId, setSelectedId] = useState("C3");
  const [selectedTopicId, setSelectedTopicId] = useState("T1");
  const [modalOpen, setModalOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [focusKey, setFocusKey] = useState(null);
  const [mode, setMode] = useState("present");   // "present" = crisp CEO view, "sales" = detailed
  const detailed = mode === "sales";
  const openStagePrompt = (key) => { setFocusKey(key); setPromptOpen(true); };
  const openFullPrompt = () => { setFocusKey(null); setPromptOpen(true); };

  /* every (topic, strategy) precomputed */
  const byTopic = useMemo(() => {
    const m = {};
    TOPICS.forEach((t) => { m[t.id] = {}; ORCH.forEach((o) => { m[t.id][o.id] = computeOrch(o, t); }); });
    return m;
  }, []);

  const computedPrimary = ORCH.map((o) => byTopic.T1[o.id]); // for switcher chips / pipeline
  const selPipeline = byTopic.T1[selectedId];               // pipeline shown at base complexity
  const topic = TOPICS.find((t) => t.id === selectedTopicId);
  const selRun = byTopic[selectedTopicId][selectedId];      // the actual run shown in section 04

  /* blended across the three real runs, for scale extrapolation */
  const blendedCost = TOPICS.reduce((s, t) => s + byTopic[t.id][selectedId].costPerRun, 0) / TOPICS.length;
  const blendedBaseline = TOPICS.reduce((s, t) => s + byTopic[t.id][selectedId].baselineCostPerRun, 0) / TOPICS.length;
  const blendedInsights = TOPICS.reduce((s, t) => s + byTopic[t.id][selectedId].insightsPerRun, 0) / TOPICS.length;
  const annualRuns = employees * tasksPerDay * 365;
  const annualCost = annualRuns * blendedCost;
  const savings = Math.max(0, annualRuns * blendedBaseline - annualCost);
  const costPerInsight = blendedCost / blendedInsights;

  return (
    <div style={{ background: L.bg, color: L.text, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{styles}</style>
      <div className="light-grid" />

      <a href="/" aria-label="Back to home" style={{ position: "fixed", top: 16, left: 16, zIndex: 200, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", border: `1px solid ${L.hair}`, color: L.text, fontSize: 13, fontWeight: 500, fontFamily: "'Inter', system-ui, sans-serif", textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        ← Home
      </a>

      {/* ============ view-mode toggle (top right) ============ */}
      <div className="mode-toggle" role="tablist" aria-label="View mode">
        {[["present", "Presentation"], ["sales", "Sales"]].map(([m, label]) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
            className={`mode-btn${mode === m ? " active" : ""}`}>{label}</button>
        ))}
      </div>

      {/* ================= HERO (dark, title + subtitle only) ================= */}
      <header className="hero-band">
        <div className="hero-ambient"><div className="blob b1" /><div className="blob b2" /><div className="blob b3" /></div>
        <div className="hero-grid" />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "92px 28px 96px" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: A_DARK, boxShadow: "0 0 24px -4px #a78bfa" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: D.muted }}>
                Research Economics · Executive Simulator
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "-0.035em",
              fontSize: "clamp(40px, 6.4vw, 82px)", lineHeight: 1.01, margin: 0, maxWidth: 1000, color: D.text }}>
              Enterprise Research{" "}
              <span style={{ background: A_DARK, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Economics Simulator</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ color: D.muted, fontSize: "clamp(16px,1.6vw,20px)", lineHeight: 1.55, maxWidth: 680, marginTop: 24 }}>
              {detailed
                ? "Evaluate the cost, token consumption, and research quality of AI-powered knowledge workers operating at enterprise scale — across six orchestration configurations, measured on three real research runs."
                : "The cost, tokens, and quality of AI knowledge work at enterprise scale."}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: "10px 26px", fontSize: 13, color: D.faint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
              <span>3 live research runs</span><span>·</span><span>6 orchestration configs</span><span>·</span><span>4 models · Opus 4.8 / GPT-5.5 / Sonnet 4.6 / Gemini Flash 3.5</span>
            </div>
          </Reveal>
        </div>
        <div className="hero-fade" />
      </header>

      {/* ================= LIGHT BODY ================= */}
      <main style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>

        {/* SECTION 02 — THE PIPELINE */}
        <Section index="02" kicker="Orchestration Strategy" title="Six ways to route the same task"
          sub={detailed
            ? "Each strategy decides which model runs each of the six stages. The single-model runs are baselines — the quality ceiling and the cost floor. The lean strategies put a frontier model on the reasoning and an efficient model on the routine work. Pick one; it drives the rest of the page."
            : "Each strategy routes the six stages differently. Pick one to drive the page."}>
          <Reveal>
            <StrategyCards computed={computedPrimary} selectedId={selectedId} onSelect={setSelectedId} recommendedId="C3" detailed={detailed} />
          </Reveal>
          <Reveal>
            <div style={{ marginTop: 24 }}><ModelLegend theme="light" /></div>
          </Reveal>
        </Section>

        {/* SECTION 03 — VISUAL PIPELINE */}
        <Section index="03" kicker="The Research Pipeline" title="Six stages, one pipeline"
          sub={detailed
            ? "Every run flows through the same six stages, left to right. The strategy you picked decides which model runs each one — click any stage to read the exact brief it's given."
            : "Every run flows through the same six stages. Click any stage to see its brief."}>
          <Reveal>
            <div style={glassL({ padding: "22px 24px 20px" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#0891b2" }}>{selPipeline.id}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 600, letterSpacing: "-0.02em", color: L.text }}>{selPipeline.name}</span>
                </div>
                <button onClick={openFullPrompt} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 999, cursor: "pointer",
                  fontSize: 12.5, fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.3)",
                }}><span style={{ fontSize: 14 }}>⌕</span> View full master prompt</button>
              </div>
              <VisualPipeline pipeline={selPipeline} onStageClick={openStagePrompt} />
              {detailed && (
                <div style={{ marginTop: 14, fontSize: 12, color: L.faint, lineHeight: 1.5 }}>
                  Click any stage to see the exact instruction it receives. <strong style={{ color: "#0891b2" }}>Live search</strong> stages query the web during the run; <strong style={{ color: "#ea580c" }}>+ render</strong> means the platform turns the authored text into the deck deterministically (~0 model tokens).
                </div>
              )}
            </div>
          </Reveal>
        </Section>

        {/* SECTION 04 — SCALE / EMPLOYEE PLAYGROUND */}
        <Section index="04" kicker="Scale Economics" title="What it costs at the enterprise"
          sub={detailed
            ? `Slide the workforce and watch the bill. Extrapolated from the three actual research runs below, using strategy ${selPipeline.id} ${selPipeline.name}, blended across all three use cases.`
            : `Slide the workforce and watch the annual bill, on strategy ${selPipeline.id}.`}>
          <Reveal>
            <div style={glassL({ padding: "26px 30px", marginBottom: 18 })}>
              <div className="play-grid">
                <Slider label="Employees" value={employees} min={1000} max={30000} step={1000} onChange={setEmployees} fmt={fmtInt} accent="linear-gradient(90deg,#0891b2,#7c3aed)" />
                <Slider label="Tasks Per Employee / Day" value={tasksPerDay} min={1} max={10} step={1} onChange={setTasksPerDay} fmt={(v) => v} accent="linear-gradient(90deg,#7c3aed,#ea580c)" />
              </div>
            </div>
          </Reveal>
          <div className="scale-grid">
            {[
              { k: "Employees", v: employees, accent: "linear-gradient(90deg,#0891b2,#7c3aed)" },
              { k: "Tasks / Day", v: tasksPerDay, accent: "linear-gradient(90deg,#7c3aed,#0891b2)" },
              { k: "Annual Runs", v: annualRuns, accent: A_LIGHT },
              { k: "Annual Cost", v: annualCost, prefix: "$", accent: "linear-gradient(90deg,#ea580c,#7c3aed)" },
              { k: "Estimated Savings", v: savings, prefix: "$", accent: "linear-gradient(90deg,#0d9488,#0891b2)", note: "vs. all-frontier (Opus 4.8) routing" },
              { k: "Cost Per Insight", v: costPerInsight, prefix: "$", decimals: 2, accent: "linear-gradient(90deg,#0891b2,#ea580c)", note: `blended across 3 use cases` },
            ].map((m, i) => (
              <Reveal key={m.k} delay={i * 0.05}>
                <div style={glassL({ padding: "28px 28px 26px", height: "100%" })}>
                  <div style={{ fontSize: 12, letterSpacing: "0.13em", textTransform: "uppercase", color: L.muted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{m.k}</div>
                  <div style={{ fontSize: "clamp(30px,3.4vw,46px)", lineHeight: 1 }}>
                    <ScaleNumber value={m.v} prefix={m.prefix || ""} decimals={m.decimals || 0} accent={m.accent} />
                  </div>
                  {m.note && <div style={{ fontSize: 12, color: L.faint, marginTop: 12 }}>{m.note}</div>}
                </div>
              </Reveal>
            ))}
          </div>
          {detailed && (
            <Reveal>
              <div style={{ marginTop: 16, fontSize: 12.5, color: L.faint, lineHeight: 1.55, maxWidth: 780 }}>
                How this is computed: each employee runs the six-stage task <strong style={{ color: L.muted }}>{fmtInt(tasksPerDay)}</strong>×/day, 365 days. Per-run cost is blended across the three use cases for the selected strategy; savings compare against all-frontier (Opus 4.8) routing on the same token volumes. Token and pricing figures are illustrative until the live harness numbers replace them.
              </div>
            </Reveal>
          )}
        </Section>

        {/* SECTION 05 — THE RESEARCH, RUN FOR REAL */}
        <Section index="05" kicker="The Research, Run For Real" title="Three real runs, one strategy"
          sub={detailed
            ? "We actually ran each use case and built its executive presentation. Pick a use case to see its output, its run economics, and exactly where the tokens went. Click the quality score to see how it's assessed — or view the master prompt every model was given."
            : "We ran each use case for real. Pick one to see the deck and its economics."}>

          {detailed && (
            <Reveal>
              <div style={{ marginBottom: 14 }}>
                <button onClick={openFullPrompt} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, cursor: "pointer",
                  fontSize: 13, fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)",
                  border: "1px solid rgba(124,58,237,0.3)", transition: "all .2s",
                }}>
                  <span style={{ fontSize: 14 }}>⌕</span> View master prompt — what every model was asked
                </button>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TOPICS.map((t) => {
                  const active = t.id === selectedTopicId;
                  return (
                    <button key={t.id} onClick={() => setSelectedTopicId(t.id)} style={{
                      padding: "11px 16px", borderRadius: 12, cursor: "pointer", fontSize: 13.5, fontWeight: 600,
                      color: active ? "#fff" : L.text,
                      background: active ? t.accent : "rgba(255,255,255,0.72)",
                      border: `1px solid ${active ? "transparent" : L.hair}`,
                      boxShadow: active ? `0 10px 26px -12px ${t.accent}` : "none", transition: "all .25s",
                    }}>{t.short}</button>
                  );
                })}
              </div>
              <StrategySwitch computed={computedPrimary} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </Reveal>

          <Reveal key={selectedTopicId + selectedId}>
            <div style={glassL({ padding: "26px 28px", overflow: "hidden" })}>
              {/* run header */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, color: "#0d9488", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d9488", boxShadow: "0 0 8px #0d9488" }} />Run complete
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", margin: "8px 0 4px", color: L.text }}>{topic.name}</h3>
                  <div style={{ fontSize: 13.5, color: L.muted }}>Strategy {selRun.id} · {selRun.name}</div>
                </div>
                <div style={{ minWidth: 220, flex: "0 1 320px" }}><Relay seq={selRun.seq} theme="light" /></div>
              </div>

              {/* outcome metrics */}
              <div className="outcome-grid" style={{ marginTop: 22 }}>
                <button onClick={() => setModalOpen(true)} className="quality-chip" title="See how quality is assessed">
                  <div style={{ fontSize: 10, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>Quality ⓘ</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 600, color: "#0d9488", lineHeight: 1, marginTop: 4 }}>{selRun.quality.toFixed(1)}</div>
                  <div style={{ fontSize: 10.5, color: "#0891b2", marginTop: 4 }}>how it's scored →</div>
                </button>
                {[
                  ["Cost / Run", fmtUSD(selRun.costPerRun, 2)],
                  ["Runtime", fmtMin(selRun.runtimeSec)],
                  ["Total Tokens", fmtTok(selRun.totalTokens)],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(20,20,40,0.025)", border: `1px solid ${L.hair2}` }}>
                    <div style={{ fontSize: 10, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 600, lineHeight: 1, marginTop: 6,
                      background: A_LIGHT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* token usage per section + presentation */}
              <div className="run-body" style={{ marginTop: 24, gridTemplateColumns: detailed ? undefined : "1fr" }}>
                {detailed && (
                  <div style={{ paddingRight: 8 }}>
                    <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Token usage per section</div>
                    <TokenBars run={selRun} />
                  </div>
                )}
                <div style={detailed ? { borderLeft: `1px solid ${L.hair2}`, paddingLeft: 26 } : {}} className={detailed ? "pres-wrap" : ""}>
                  <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Generated presentation</div>
                  <div style={{ fontSize: 11.5, color: L.muted, marginBottom: 14 }}>
                    Authored by <strong style={{ color: L.text }}>{selRun.stages[4].model.label}</strong> as structured text · rendered &amp; beautified by the platform
                  </div>
                  <Presentation topic={topic} />
                </div>
              </div>
            </div>
          </Reveal>
        </Section>

        <footer style={{ borderTop: `1px solid ${L.hair2}`, margin: "70px 0 0", padding: "30px 0 70px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 12, color: L.faint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>ENTERPRISE RESEARCH ECONOMICS · SCENARIO MODEL</span>
          <span style={{ fontSize: 12, color: L.faint, maxWidth: 560, lineHeight: 1.5 }}>
            Market figures are sourced from public research (IMARC, Grand View, MarketsandMarkets, Arizton, Mordor, JLL, McKinsey). Token, pricing, and quality figures are illustrative forward-looking assumptions for executive scenario modeling.
          </span>
        </footer>
      </main>

      <QualityModal open={modalOpen} onClose={() => setModalOpen(false)} run={selRun} topic={topic} />
      <MasterPromptModal open={promptOpen} onClose={() => setPromptOpen(false)} focusKey={focusKey} pipeline={selPipeline} />
    </div>
  );
}

/* ---------- global styles ---------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
::selection { background: #7c3aed; color: #fff; }

.light-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: linear-gradient(rgba(20,20,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,40,0.04) 1px, transparent 1px);
  background-size: 56px 56px; }

.hero-band { position: relative; z-index: 1; background: #090909; color: ${D.text}; overflow: hidden; }
.hero-fade { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent); }
.hero-grid { position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, #000 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, #000 30%, transparent 100%); }
.hero-ambient { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.blob { position: absolute; border-radius: 50%; filter: blur(90px); }
.b1 { width: 560px; height: 560px; background: #a78bfa; top: -200px; left: -120px; opacity: 0.32; animation: drift1 24s ease-in-out infinite; }
.b2 { width: 480px; height: 480px; background: #22d3ee; top: 20%; right: -180px; opacity: 0.20; animation: drift2 28s ease-in-out infinite; }
.b3 { width: 420px; height: 420px; background: #fb923c; bottom: -160px; left: 30%; opacity: 0.15; animation: drift3 32s ease-in-out infinite; }
@keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,50px)} }
@keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,40px)} }
@keyframes drift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-40px)} }

.relay-pulse { animation: relayMove 3.4s cubic-bezier(.4,0,.2,1) infinite; left: 0; }
@keyframes relayMove { 0%{left:0;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{left:100%;opacity:0} }

.range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 4px; outline: none; cursor: pointer; }
.range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 3px solid #7c3aed; cursor: pointer; box-shadow: 0 0 12px rgba(124,58,237,0.5), 0 2px 6px rgba(0,0,0,0.2); transition: transform .15s; }
.range::-webkit-slider-thumb:hover { transform: scale(1.18); }
.range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 3px solid #7c3aed; cursor: pointer; box-shadow: 0 0 12px rgba(124,58,237,0.5); }
.range::-moz-range-track { height: 4px; border-radius: 4px; background: transparent; }

button:focus-visible, .range:focus-visible { outline: 2px solid #0891b2; outline-offset: 3px; }

.quality-chip { text-align: left; cursor: pointer; padding: 16px 18px; border-radius: 14px; background: linear-gradient(180deg, rgba(13,148,136,0.10), rgba(8,145,178,0.05)); border: 1px solid rgba(13,148,136,0.35); transition: transform .2s, box-shadow .2s; }
.quality-chip:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -14px rgba(13,148,136,0.6); }

.banner-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; }
.play-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.timeline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items: stretch; }
.scale-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.outcome-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.run-body { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 26px; }
.pres-top { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 28px; align-items: start; }
.pres-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
.pres-findings { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 28px; }

.modal-backdrop { position: fixed; inset: 0; z-index: 50; background: rgba(15,15,25,0.55); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; animation: fadein .25s ease; }
.modal-card { background: #fbfbfd; border: 1px solid ${L.hair}; border-radius: 22px; max-width: 880px; width: 100%; padding: 28px 30px 30px; box-shadow: 0 40px 90px -30px rgba(20,20,50,0.5); animation: pop .3s cubic-bezier(.2,.7,.2,1); }
@keyframes fadein { from{opacity:0} to{opacity:1} }
@keyframes pop { from{opacity:0; transform: translateY(16px) scale(.98)} to{opacity:1; transform:none} }
.modal-close { width: 34px; height: 34px; border-radius: 10px; border: 1px solid ${L.hair}; background: #fff; color: ${L.muted}; cursor: pointer; font-size: 14px; transition: all .2s; }
.modal-close:hover { background: ${L.bg}; color: ${L.text}; }
.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 20px; align-items: start; }
.weight-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }

/* view-mode toggle */
.mode-toggle { position: fixed; top: 18px; right: 20px; z-index: 60; display: flex; gap: 3px; padding: 4px; border-radius: 999px; background: rgba(22,22,32,0.62); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 10px 30px -12px rgba(10,10,30,0.55); }
.mode-btn { padding: 7px 15px; border-radius: 999px; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: 0.04em; font-weight: 600; color: rgba(255,255,255,0.78); background: transparent; transition: all .2s; }
.mode-btn:hover { color: #fff; }
.mode-btn.active { color: #fff; background: linear-gradient(90deg,#0891b2,#7c3aed); box-shadow: 0 6px 16px -8px #7c3aed; }
@media (max-width: 620px) { .mode-toggle { top: 12px; right: 12px; } .mode-btn { padding: 6px 11px; font-size: 10.5px; } }

/* strategy cards */
.strat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.strat-card { position: relative; text-align: left; cursor: pointer; padding: 18px 18px 16px; border-radius: 16px; background: rgba(255,255,255,0.72); border: 1px solid ${L.hair}; transition: transform .2s, box-shadow .2s, border-color .2s; }
.strat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 34px -18px rgba(20,20,50,0.45); }
.strat-card.active { border-color: transparent; background: #fff; box-shadow: 0 18px 40px -16px rgba(124,58,237,0.5); }
.strat-card.active::before { content: ""; position: absolute; inset: 0; border-radius: 16px; padding: 1.5px; background: ${A_LIGHT}; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }

/* visual pipeline */
.pipeflow { display: flex; align-items: stretch; gap: 0; overflow-x: auto; padding: 6px 2px 14px; }
.pipenode { position: relative; flex: 1 1 0; min-width: 150px; text-align: left; cursor: pointer; background: rgba(255,255,255,0.78); border: 1px solid ${L.hair}; border-top: 3px solid; border-radius: 14px; padding: 14px 14px 12px; transition: transform .2s, box-shadow .2s; display: flex; flex-direction: column; gap: 7px; }
.pipenode:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -16px rgba(20,20,50,0.45); z-index: 2; }
.pipearrow { flex: 0 0 26px; display: flex; align-items: center; justify-content: center; color: ${L.faint}; font-size: 18px; }
.pipenode-cta { margin-top: 4px; font-size: 11px; font-weight: 600; opacity: .7; }
.pipenode:hover .pipenode-cta { opacity: 1; }

@media (max-width: 1024px) {
  .play-grid { grid-template-columns: 1fr; gap: 28px; }
  .timeline { grid-template-columns: repeat(2, 1fr); }
  .scale-grid { grid-template-columns: repeat(2, 1fr); }
  .outcome-grid { grid-template-columns: repeat(2, 1fr); }
  .run-body { grid-template-columns: 1fr; }
  .pres-wrap { border-left: none !important; padding-left: 0 !important; border-top: 1px solid ${L.hair2}; padding-top: 22px; }
  .pres-top { grid-template-columns: 1fr; }
  .modal-grid { grid-template-columns: 1fr; }
  .strat-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 620px) {
  .timeline, .scale-grid, .outcome-grid { grid-template-columns: 1fr; }
  .pres-stats, .pres-findings { grid-template-columns: 1fr; }
  .weight-row { grid-template-columns: repeat(3, 1fr); row-gap: 16px; }
  .strat-grid { grid-template-columns: 1fr; }
  .pipeflow { flex-direction: column; }
  .pipearrow { flex-basis: 22px; transform: rotate(90deg); }
  .pipenode { min-width: 0; }
}
@media (prefers-reduced-motion: reduce) { .blob, .relay-pulse { animation: none !important; } }
`;
