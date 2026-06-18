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
  mandates: [
    { id: "T1", short: "Japan Healthcare IT", text: "Quantify the IT market spend in the healthcare technology sector in Japan: current market size, growth outlook to 2030+, key segments, demand drivers, and major vendors. Use current figures with sources." },
    { id: "T2", short: "Open RAN / 5G", text: "Assess the global Open RAN and 5G network-infrastructure market: size, growth to 2030, leading vendors, adoption drivers, and key restraints. Use current figures with sources." },
    { id: "T3", short: "APAC Data Centers", text: "Analyze data-center and AI-infrastructure capital expenditure across APAC: market size, growth to 2030, country leaders, demand drivers, and constraints. Use current figures with sources." },
  ],
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

/* ===== REAL RUN DATA (15 live runs + 3 estimated) ===== */
const RUN_DATA = {"T1":{"C1":{"quality":75,"dims":{"Coverage":78,"Accuracy":70,"Depth":82,"Coherence":77,"Citation Quality":76,"Presentation Readiness":68},"totalTokens":462756,"inputTokens":428382,"outputTokens":34374,"searchCount":15,"latencyMs":486946,"stages":[{"key":"planning","inTok":669,"outTok":4714,"totTok":5383,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":160182,"outTok":10525,"totTok":170707,"search":8,"providerModel":"claude-opus-4-8"},{"key":"analysis","inTok":193327,"outTok":8749,"totTok":202076,"search":7,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":21917,"outTok":3180,"totTok":25097,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":25318,"outTok":1864,"totTok":27182,"search":0,"providerModel":"claude-opus-4-8"},{"key":"evaluation","inTok":26969,"outTok":5342,"totTok":32311,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"¥302B","label":"Japan vendor-addressable healthcare IT core (clinical systems), FY2024 — within a reconciled ¥380–450B total TAM"},"unit":"JPY B","chart":[{"year":"FY2023","v":297.4},{"year":"FY2024","v":301.8},{"year":"FY2024 TAM (incl. adjacencies)","v":415},{"year":"FY2030 clinic/pharmacy seg.","v":78.8}],"stats":[{"k":"Core CAGR FY23→FY24 (actual)","v":"+1.5%"},{"k":"Blended core CAGR FY24→FY30 (est.)","v":"3–5%"},{"k":"Cloud-EMR penetration (Jul 2025)","v":"18.6% hosp / 27.1% clinic"},{"k":"EMR 100% mandate deadline","v":"31 Dec 2030"}],"findings":["Japan's firm clinical-IT core market reached ¥301.8 billion in FY2024, surpassing ¥300 billion for the first time (Yano Research Institute, 19 Dec 2025); the reconciled vendor-addressable TAM including NEC-relevant adjacencies is ¥380–450 billion (FY2024, analyst reconciliation, medium confidence on the uplift).","Organic growth is low single-digit — +1.5% FY2023→FY2024 actual and a Yano-forecast +3.4% FY2024→FY2030 for clinic/pharmacy ICT (¥64.4B→¥78.8B) — NOT the 20–24% 'digital health' CAGRs (Grand View 23.9%, MRFR 20.0%), which measure service-value throughput and would overstate NEC's bookable opportunity by ~5–7×.","A legally-mandated 100% EMR adoption deadline of 31 Dec 2030 (Medical Care Act amendment enacted 5 Dec 2025) forces ~45% of clinics and ~34% of hospitals to adopt within five years against a low cloud base (18.6% hospitals / 27.1% clinics, Yano Jul 2025), driving an estimated ≥10%/yr cloud-EMR sub-segment.","NEC's differentiated biometric-identity asset maps to the most favorable layer — government health-data infrastructure — publicly subsidized via the Medical Information Digitization Support Fund (≥¥106.8B FY2021 floor) with My Number health-card utilization at 47.26% (MHLW, Oct 2025); this layer sits outside the flat ¥302B core where Fujitsu (~30–35%), NEC and Software Service together hold ~70% of large-hospital EMR (Diamond Oct 2024 / Open Insight Jun 2025).","The structural demand floor is firm and mandate-independent: 65+ population was 29.3% as of 1 Oct 2024 (rising to 34.8% by 2040), and FY2023 national health expenditure was ¥48.09 trillion with 65+ accounting for ~60% (MHLW, 2025) — but the cloud-EMR growth leg is at risk from mandate slippage, given the e-prescription 'all institutions by end-FY2024' target was missed (only 23.3% of clinics, 17.3% of hospitals by Nov 2025)."],"sources":["Yano Research Institute, medical information systems market, press release 19 Dec 2025 (¥301.8B FY2024 core; ¥67.8B small/mid-hospital EMR; cloud penetration)","Yano Research Institute, clinic/pharmacy medical ICT, press release 22 Apr 2025 (¥64.4B FY2024 → ¥78.8B FY2030 forecast)","Yano Research Institute, medical imaging/PACS report, 2024 ed. (¥59.9B FY2023)","MHLW, national health expenditure FY2023 (¥48.09 trillion), via GemMed/Dai-ichi Life Research Institute, 2025","MHLW, Medical Care Act amendment enacted 5 Dec 2025 (100% EMR mandate by 31 Dec 2030); 2023 Medical Facility Survey EMR adoption (clinic ~55% / hospital ~66%); Chuikyo e-prescription & My Number data via GemMed, Dec 2025","MIC/IPSS, population 65+ = 29.3%, 75+ = 16.8% (as of 1 Oct 2024); 2040 projection 34.8%","Diamond (4 Oct 2024) and Open Insight (10 Jun 2025), EMR vendor share estimates (Fujitsu ~30–35%; top-3 ~70%)","NEC IR / mid-term plan FY2024 (group revenue ¥3.4 trillion; ~¥100B 2030 healthcare/life-sciences revenue target)","Grand View Research (May 2025) and Market Research Future (Apr 2026), Japan digital health figures — cited only as service-value context, explicitly NOT used as vendor-IT planning TAM","IMARC Group, Japan telemedicine US$5.2B (2024) — cited as service-value context only"]},"estimated":false},"C2":{"quality":78,"dims":{"Coverage":84,"Accuracy":73,"Depth":86,"Coherence":79,"Citation Quality":74,"Presentation Readiness":72},"totalTokens":420193,"inputTokens":381678,"outputTokens":38515,"searchCount":14,"latencyMs":662751,"stages":[{"key":"planning","inTok":669,"outTok":4582,"totTok":5251,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":123420,"outTok":12799,"totTok":136219,"search":8,"providerModel":"claude-sonnet-4-6"},{"key":"analysis","inTok":163735,"outTok":11869,"totTok":175604,"search":6,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":31793,"outTok":2902,"totTok":34695,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":24867,"outTok":1887,"totTok":26754,"search":0,"providerModel":"claude-sonnet-4-6"},{"key":"evaluation","inTok":37194,"outTok":4476,"totTok":41670,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"¥850B","label":"Japan healthcare IT market by FY2030 (NEC reconciled estimate)"},"unit":"JPY Billion","chart":[{"year":"2023","v":358},{"year":"2024","v":600},{"year":"2025","v":650},{"year":"2027","v":730},{"year":"2030","v":850}],"stats":[{"k":"CAGR 2024→2030","v":"~6% (NEC reconciled; Fuji Keizai domestic primary, Oct 2025)"},{"k":"Hospitals in operating deficit FY2024","v":"89.2% (Teikoku Databank / hospital-association surveys, 2024–25)"},{"k":"My Number health-card utilisation Dec 2025","v":"47.73% (MHLW, Dec 2025) — ~50 pts runway remaining"},{"k":"Cloud EMR growth to 2035","v":"2.2× 2024 level → ¥105.4B (Fuji Keizai, Oct 2025)"}],"findings":["Japan's in-scope healthcare IT market is estimated at ~¥600B (US$4.0B at ¥150/US$, June 2026) for 2024–25, rising to ~¥850B by FY2030 at a ~6% CAGR (2024→2030); this is a NEC-reconciled figure grounded in Yano Research's FY2023 actuals (¥297.4B hospital systems + ¥61.1B clinic/pharmacy ICT, Oct & Apr 2025) and Fuji Keizai's broader ¥781.8B 2025 estimate (Oct 2025), with IMARC's US$15.6B figure rejected as scope-incompatible (~3–4× the reconciled in-scope number).","The market is structurally two-speed: on-premise hospital EMR (~¥230–300B, the largest pool) is forecast by Fuji Keizai (Oct 2025) to peak in 2024 and contract, while cloud EMR, medical secondary-data analytics (Fuji Keizai Mar 2025: →¥267.6B by 2030, +29.2% vs. 2024), and healthcare predictive analytics (Grand View 2025: ~28% CAGR 2024–2030) grow 15–29% annually from a smaller base — the blended ~6% headline masks this bifurcation and should not govern segment-level capital allocation.","Demand is structural and statutory, not subsidy-dependent: the 65+ population reaches 33.3% by 2036 (IPSS/Cabinet Office projection), national medical expenditure for the ≥65 cohort is modelled to rise from ¥26.4T (FY2018) to ¥38.1T (FY2049) (PMC 2022), and Medical Care Act amendments mandating EMR standardisation were enacted 5 December 2025 (International Bar Association, May 2026) — creating a durable, legislatively anchored demand base that subsidy withdrawal would slow but not reverse.","Hospital financial distress is the binding constraint on the on-premise segment and simultaneously accelerates the cloud/platform shift: 89.2% of hospitals ran an operating-income deficit in FY2024 (all-hospital operating margin −7.5%) and 86% of municipal hospitals were in ordinary deficit — the worst since 1973 (Teikoku Databank / hospital-association surveys, 2024–25) — implying a plausible 10–15% deferral of large-hospital IT capex that could shave ¥25–40B/yr from the on-premise core while cash-constrained providers shift to opex-based cloud models they can still afford.","NEC holds a foreign-vendor-proof moat in three high-growth layers — biometric/identity platform (facial-recognition IP + My Number government infrastructure; ~50 percentage points of utilisation runway per MHLW Dec 2025), healthcare cybersecurity (Fuji Keizai Oct 2025: >¥80B by 2027, policy-mandated by FY2027), and AI clinical-documentation overlay (MegaOak/iS generative-AI EMR cutting document-creation time 47%, per NEC 2024) — but is absent from the fast-growing clinic-cloud segment where M3, PHC/Wemex and Medley lead, and ranks #2–4 behind Fujitsu (~30–35% share per trade-press 2024–25) in the saturating large-hospital on-premise market; incremental capital should be directed to the moat layers, not the saturated core or the NEC-absent clinic market."],"sources":["Yano Research Institute (矢野経済研究所), press release via Nikkei, October 15 2024 — FY2023 medical information systems market","Yano Research Institute, press release via Nikkei, April 22 2025 — FY2023–FY2030 clinic and pharmacy medical ICT market","Yano Research Institute, press release, December 19 2025 — FY2024 small-and-medium hospital EMR segment","Yano Research Institute, press release, January 2026 — FY2024 nursing-care (介護) DX market (5 fields)","Fuji Keizai (富士経済), press release, October 3 2025 — 2025 medical/healthcare/pharma DX market aggregate and 2030/2035 forecasts","Fuji Keizai, press release via Nikkei D-CROSS, March 2025 — domestic secondary-use medical data market forecast to 2030","MHLW (厚生労働省), monthly My Number health-card utilisation statistics, December 2025","International Bar Association, Global Insight, May 2026 — Japan Medical Care Act amendments enacted 5 December 2025","Teikoku Databank / Japan hospital-association financial surveys, 2024–25 — hospital operating-deficit ratios FY2024","OECD, Health at a Glance 2025, November 2025 — Japan health spending 10.6% of GDP; physician density 2.6/1,000","IPSS / Cabinet Office, Japan population projections — 65+ reaching 33.3% by 2036","PMC (PubMed Central), 2022 modelling study — Japan medical care expenditure trajectory FY2018–FY2049","Grand View Research, 2025 — Japan healthcare predictive analytics CAGR 28.1% (2024–2030); BI market →US$747M by 2030","DataM Intelligence, March 2026 — Japan EMR market US$494.83M (2024), CAGR 6.3% to 2033; named vendors","Signify Research, within 18 months — Japan population-health-management vendor landscape; foreign-vendor entry barriers","Mordor Intelligence, January 2026 — Japan IT services market; NEC/Fujitsu/NTT DATA vendor positions","IMARC Group, 2025 — Japan healthcare IT US$15.6B (2024) — retained as outer-bound cross-check only; rejected as primary sizing figure","medrxiv preprint, June 2025 (citing MHLW FY2020 survey) — hospital EMR penetration 91.2% at 400+ beds [DATED: FY2020 data]","ScienceDirect academic study (citing MHLW 2015 data) — four-vendor 76% EMR concentration [DATED: 2015 data]","NEC Corporation, MegaOak/iS generative-AI EMR product announcement, 2024 — 47% document-creation time reduction"]},"estimated":false},"C3":{"quality":76,"dims":{"Coverage":81,"Accuracy":64,"Depth":92,"Coherence":80,"Citation Quality":67,"Presentation Readiness":72},"totalTokens":213873,"inputTokens":185722,"outputTokens":28151,"searchCount":16,"latencyMs":447327,"stages":[{"key":"planning","inTok":669,"outTok":3706,"totTok":4375,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":2767,"outTok":5593,"totTok":8360,"search":11,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":119674,"outTok":10092,"totTok":129766,"search":5,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":20951,"outTok":3046,"totTok":23997,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":16530,"outTok":897,"totTok":17427,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":25131,"outTok":4817,"totTok":29948,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"¥301.8B JPY","label":"NEC's Core Addressable Japan Healthcare IT Market Size in FY2024"},"unit":"Billion JPY","chart":[{"year":"2024","v":712.6},{"year":"2025","v":781.8},{"year":"2035","v":1351.1}],"stats":[{"k":"Core IT Growth (FY25-27)","v":"<1.0% CAGR"},{"k":"Cloud EMR Growth (FY24-27)","v":"8.71% CAGR"},{"k":"Broad DX Growth (FY24-35)","v":"5.97% CAGR"},{"k":"Care DX Growth (FY24-30)","v":"16.98% CAGR"}],"findings":["The core institutional healthcare IT market is valued at ¥301.839 billion JPY (approx. $1.973 billion USD at spot ¥153/USD) in FY2024 but is structurally flat at under 1.0% CAGR through FY2027 due to 93.7% EMR penetration in large hospitals (Yano Research, Dec 2025; MHLW, Oct 2023 [dated baseline]).","The clinic segment presents a critical greenfield with approximately 47,202 un-digitized clinics (55.0% EMR penetration in 2023) forced to adopt systems under a December 31, 2030, national legal mandate (MHLW, Oct 2023 [dated baseline] / Dec 2025).","Cloud-type EMRs represent the fastest-growing core segment at an 8.71% CAGR from base year FY2024 to horizon year FY2027, rising to a ¥10.700 billion JPY (approx. $69.9 million USD) market value (Yano Research, Dec 2025).","The adjacent long-term care DX market is projected to reach ¥140.000 billion JPY (approx. $915.0 million USD) by FY2030, representing a rapid 16.98% CAGR from its FY2024 baseline of ¥54.576 billion JPY (approx. $356.7 million USD) (Yano Research, Jan 2026; PwC Japan, mid-2025).","A massive ¥1.3511 trillion JPY (approx. $8.831 billion USD) broad DX market forecast for FY2035 is highly concentrated, with AI drug discovery support driving 31.0% (+¥196.500 billion JPY) of all absolute growth from FY2024 (Fuji Keizai, Oct 2025)."],"sources":["Yano Research Institute, Medical Information System Market Survey, December 19, 2025","Fuji Keizai, Current Status and Future Outlook of Medical, Healthcare, and Pharmaceutical DX-Related Markets, October 3, 2025","Ministry of Health, Labour and Welfare (MHLW), Medical Facility Survey, October 2023 [Dated]","Yano Research Institute, Long-Term Care DX Market Survey 2025, January 13, 2026","PwC Japan, LTC Technology Market Trend Survey Report, mid-2025"]},"estimated":false},"C5":{"quality":63,"dims":{"Coverage":72,"Accuracy":52,"Depth":74,"Coherence":67,"Citation Quality":58,"Presentation Readiness":55},"totalTokens":76996,"inputTokens":57787,"outputTokens":19209,"searchCount":25,"latencyMs":274059,"stages":[{"key":"planning","inTok":442,"outTok":3331,"totTok":3773,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"acquisition","inTok":3771,"outTok":5105,"totTok":8876,"search":17,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":8238,"outTok":6258,"totTok":14496,"search":8,"providerModel":"gemini-3.5-flash"},{"key":"synthesis","inTok":13606,"outTok":1714,"totTok":15320,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"presentation","inTok":15503,"outTok":908,"totTok":16411,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":16227,"outTok":1893,"totTok":18120,"search":0,"providerModel":"gemini-3.5-flash"}],"deck":{"headline":{"value":"¥781.80B JPY","label":"Japan Broad-Scope Healthcare & Medical DX TAM in CY2025"},"unit":"¥ Billion JPY","chart":[{"year":"2024","v":712.6},{"year":"2025","v":781.8},{"year":"2035","v":1351.1}],"stats":[{"k":"Broad DX CAGR (24-35)","v":"5.97%"},{"k":"GenAI CAGR (25-40)","v":"39.46%"},{"k":"Clinic Cloud Share FY25","v":"73.10%"},{"k":"National EMR Target 2030","v":"100.00%"}],"findings":["Japan's Broad-Scope Medical and Healthcare DX Total Addressable Market (TAM) is projected to grow from ¥712.60 billion JPY in CY2024 to ¥1.3511 trillion JPY by CY2035, representing a compound annual growth rate (CAGR) of 5.97% with base year CY2024 and horizon year CY2035 (Fuji Keizai, October 3, 2025).","The Japanese healthcare generative AI market is projected to expand from ¥1.70 billion JPY in CY2025 to ¥251.50 billion JPY by CY2040, a compound annual growth rate (CAGR) of 39.46% with base year CY2025 and horizon year CY2040 driven by 'Physician Work Reform' laws (Fuji Keizai, May 8, 2026).","The Amended Medical Law passed on December 5, 2025, legally mandates a national electronic medical record (EMR) adoption rate of approximately 100.00% across all clinical and hospital facilities in Japan by December 31, 2030.","Cloud-based platforms accounted for 73.10% of new clinic EMR installations in FY2025 (Yano Research, March 12, 2026), while the mid-hospital cloud EMR segment is projected to grow from ¥8.329 billion JPY (12.30% of segment) in FY2024 to ¥10.700 billion JPY (14.60% of segment) by FY2027 (Yano Research, December 19, 2025).","Under the FY2026 Medical Fee Revision, the Ministry of Health, Labour and Welfare (MHLW) introduced a 15-point (¥150 JPY equivalent) interoperability reimbursement add-on, penalizing non-compliant clinics with up to ¥3.60 million JPY in lost annual revenue."],"sources":["Fuji Keizai: 2025 DX-Related Market Outlook (October 3, 2025)","Fuji Keizai: Healthcare Generative AI Analysis (May 8, 2026)","Yano Research Institute: Medical IT Market Report (December 19, 2025)","Yano Research Institute: Primary Clinic Cloud EMR Study (March 12, 2026)","Ministry of Health, Labour and Welfare (MHLW): FY2026 Medical Fee Revision Schedule (April 2026)","The National Diet of Japan: Amended Medical Law (December 5, 2025)"]},"estimated":false},"C6":{"quality":67,"dims":{"Coverage":74,"Accuracy":58,"Depth":78,"Coherence":73,"Citation Quality":62,"Presentation Readiness":56},"totalTokens":203705,"inputTokens":169845,"outputTokens":33860,"searchCount":36,"latencyMs":657687,"stages":[{"key":"planning","inTok":432,"outTok":6382,"totTok":6814,"search":0,"providerModel":"gpt-5.5"},{"key":"acquisition","inTok":6239,"outTok":6833,"totTok":13072,"search":20,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":103312,"outTok":11828,"totTok":115140,"search":16,"providerModel":"gpt-5.5"},{"key":"synthesis","inTok":17836,"outTok":2169,"totTok":20005,"search":0,"providerModel":"gpt-5.5"},{"key":"presentation","inTok":21894,"outTok":780,"totTok":22674,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":20132,"outTok":5868,"totTok":26000,"search":0,"providerModel":"gpt-5.5"}],"deck":{"headline":{"value":"JPY 481.0B","label":"NEC-addressable B2B Japan healthcare IT market size in FY2025"},"unit":"JPY Billion","chart":[{"year":"2025","v":481},{"year":"2027","v":540},{"year":"2030","v":643}],"stats":[{"k":"B2B Market CAGR (FY25-FY30)","v":"5.98%"},{"k":"Core HIS CAGR (FY25-FY30)","v":"0.80%"},{"k":"Cybersecurity CAGR (FY25-FY30)","v":"15.40%"},{"k":"AI & Data CAGR (FY25-FY30)","v":"21.35%"}],"findings":["The core provider clinical and administrative systems segment is the largest spend pool at JPY 304.0 billion in FY2025 (63.2% of total) but is replacement-led, growing at just 0.80% CAGR to JPY 317.0 billion by FY2030, according to Yano Research Institute (December 2025).","Cybersecurity spending represents the fastest near-term urgency, projected to grow at a 15.40% CAGR from JPY 70.0 billion in FY2025 to JPY 143.0 billion in FY2030, driven by MHLW's May 2026 Version 7.0 Safety Management Guidelines mandating two-factor authentication by FY2027.","Clinical-adjacent data-utilization and AI workflows are forecast by Yano Research Institute (November 2025) to grow at a 21.35% CAGR from JPY 18.09 billion in FY2025 to JPY 47.54 billion by FY2030.","The clinic and pharmacy IT market is growing moderately, with Yano Research Institute (April 2025) forecasting expansion from JPY 64.443 billion in FY2024 to JPY 78.824 billion by FY2030, which represents a 3.41% CAGR.","NEC ranks #4 in the domestic hospital EMR operating installed base behind Fujitsu Japan, Software Service, and CSI as of March 31, 2025, according to Software Service Inc. disclosures from the Medical Equipment System White Paper 2026."],"sources":["Yano Research Institute (December 2025, November 2025, April 2025)","IMARC Group (Late 2025 / Early 2026 Report Releases)","Ministry of Health, Labour and Welfare (MHLW) (May 2026 Draft Guidelines, Late 2025 Census)","Software Service Inc. / Medical Equipment System White Paper (March 2025 data, published 2026)"]},"estimated":false},"C4":{"quality":73,"dims":{"Coverage":80,"Accuracy":64,"Depth":82,"Coherence":77,"Citation Quality":69,"Presentation Readiness":61},"totalTokens":308798,"inputTokens":264727,"outputTokens":44327,"searchCount":23,"latencyMs":757147,"stages":[{"key":"planning","inTok":444,"outTok":5652,"totTok":6106,"search":null,"providerModel":""},{"key":"acquisition","inTok":92167,"outTok":14216,"totTok":106266,"search":15,"providerModel":""},{"key":"analysis","inTok":70928,"outTok":12939,"totTok":84219,"search":8,"providerModel":""},{"key":"synthesis","inTok":29276,"outTok":3050,"totTok":32337,"search":null,"providerModel":""},{"key":"presentation","inTok":30703,"outTok":1874,"totTok":32576,"search":null,"providerModel":""},{"key":"evaluation","inTok":32576,"outTok":6327,"totTok":38867,"search":null,"providerModel":""}],"deck":{"headline":{"value":"¥850B","label":"Japan healthcare IT market by FY2030 (NEC reconciled estimate)"},"unit":"JPY Billion","chart":[{"year":"2023","v":358},{"year":"2024","v":600},{"year":"2025","v":650},{"year":"2027","v":730},{"year":"2030","v":850}],"stats":[{"k":"CAGR 2024→2030","v":"~6% (NEC reconciled; Fuji Keizai domestic primary, Oct 2025)"},{"k":"Hospitals in operating deficit FY2024","v":"89.2% (Teikoku Databank / hospital-association surveys, 2024–25)"},{"k":"My Number health-card utilisation Dec 2025","v":"47.73% (MHLW, Dec 2025) — ~50 pts runway remaining"},{"k":"Cloud EMR growth to 2035","v":"2.2× 2024 level → ¥105.4B (Fuji Keizai, Oct 2025)"}],"findings":["Japan's in-scope healthcare IT market is estimated at ~¥600B (US$4.0B at ¥150/US$, June 2026) for 2024–25, rising to ~¥850B by FY2030 at a ~6% CAGR (2024→2030); this is a NEC-reconciled figure grounded in Yano Research's FY2023 actuals (¥297.4B hospital systems + ¥61.1B clinic/pharmacy ICT, Oct & Apr 2025) and Fuji Keizai's broader ¥781.8B 2025 estimate (Oct 2025), with IMARC's US$15.6B figure rejected as scope-incompatible (~3–4× the reconciled in-scope number).","The market is structurally two-speed: on-premise hospital EMR (~¥230–300B, the largest pool) is forecast by Fuji Keizai (Oct 2025) to peak in 2024 and contract, while cloud EMR, medical secondary-data analytics (Fuji Keizai Mar 2025: →¥267.6B by 2030, +29.2% vs. 2024), and healthcare predictive analytics (Grand View 2025: ~28% CAGR 2024–2030) grow 15–29% annually from a smaller base — the blended ~6% headline masks this bifurcation and should not govern segment-level capital allocation.","Demand is structural and statutory, not subsidy-dependent: the 65+ population reaches 33.3% by 2036 (IPSS/Cabinet Office projection), national medical expenditure for the ≥65 cohort is modelled to rise from ¥26.4T (FY2018) to ¥38.1T (FY2049) (PMC 2022), and Medical Care Act amendments mandating EMR standardisation were enacted 5 December 2025 (International Bar Association, May 2026) — creating a durable, legislatively anchored demand base that subsidy withdrawal would slow but not reverse.","Hospital financial distress is the binding constraint on the on-premise segment and simultaneously accelerates the cloud/platform shift: 89.2% of hospitals ran an operating-income deficit in FY2024 (all-hospital operating margin −7.5%) and 86% of municipal hospitals were in ordinary deficit — the worst since 1973 (Teikoku Databank / hospital-association surveys, 2024–25) — implying a plausible 10–15% deferral of large-hospital IT capex that could shave ¥25–40B/yr from the on-premise core while cash-constrained providers shift to opex-based cloud models they can still afford.","NEC holds a foreign-vendor-proof moat in three high-growth layers — biometric/identity platform (facial-recognition IP + My Number government infrastructure; ~50 percentage points of utilisation runway per MHLW Dec 2025), healthcare cybersecurity (Fuji Keizai Oct 2025: >¥80B by 2027, policy-mandated by FY2027), and AI clinical-documentation overlay (MegaOak/iS generative-AI EMR cutting document-creation time 47%, per NEC 2024) — but is absent from the fast-growing clinic-cloud segment where M3, PHC/Wemex and Medley lead, and ranks #2–4 behind Fujitsu (~30–35% share per trade-press 2024–25) in the saturating large-hospital on-premise market; incremental capital should be directed to the moat layers, not the saturated core or the NEC-absent clinic market."],"sources":["Yano Research Institute (矢野経済研究所), press release via Nikkei, October 15 2024 — FY2023 medical information systems market","Yano Research Institute, press release via Nikkei, April 22 2025 — FY2023–FY2030 clinic and pharmacy medical ICT market","Yano Research Institute, press release, December 19 2025 — FY2024 small-and-medium hospital EMR segment","Yano Research Institute, press release, January 2026 — FY2024 nursing-care (介護) DX market (5 fields)","Fuji Keizai (富士経済), press release, October 3 2025 — 2025 medical/healthcare/pharma DX market aggregate and 2030/2035 forecasts","Fuji Keizai, press release via Nikkei D-CROSS, March 2025 — domestic secondary-use medical data market forecast to 2030","MHLW (厚生労働省), monthly My Number health-card utilisation statistics, December 2025","International Bar Association, Global Insight, May 2026 — Japan Medical Care Act amendments enacted 5 December 2025","Teikoku Databank / Japan hospital-association financial surveys, 2024–25 — hospital operating-deficit ratios FY2024","OECD, Health at a Glance 2025, November 2025 — Japan health spending 10.6% of GDP; physician density 2.6/1,000","IPSS / Cabinet Office, Japan population projections — 65+ reaching 33.3% by 2036","PMC (PubMed Central), 2022 modelling study — Japan medical care expenditure trajectory FY2018–FY2049","Grand View Research, 2025 — Japan healthcare predictive analytics CAGR 28.1% (2024–2030); BI market →US$747M by 2030","DataM Intelligence, March 2026 — Japan EMR market US$494.83M (2024), CAGR 6.3% to 2033; named vendors","Signify Research, within 18 months — Japan population-health-management vendor landscape; foreign-vendor entry barriers","Mordor Intelligence, January 2026 — Japan IT services market; NEC/Fujitsu/NTT DATA vendor positions","IMARC Group, 2025 — Japan healthcare IT US$15.6B (2024) — retained as outer-bound cross-check only; rejected as primary sizing figure","medrxiv preprint, June 2025 (citing MHLW FY2020 survey) — hospital EMR penetration 91.2% at 400+ beds [DATED: FY2020 data]","ScienceDirect academic study (citing MHLW 2015 data) — four-vendor 76% EMR concentration [DATED: 2015 data]","NEC Corporation, MegaOak/iS generative-AI EMR product announcement, 2024 — 47% document-creation time reduction"]},"estimated":true}},"T2":{"C1":{"quality":75,"dims":{"Coverage":74,"Accuracy":72,"Depth":86,"Coherence":80,"Citation Quality":68,"Presentation Readiness":72},"totalTokens":486124,"inputTokens":449062,"outputTokens":37062,"searchCount":14,"latencyMs":491017,"stages":[{"key":"planning","inTok":664,"outTok":4597,"totTok":5261,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":201886,"outTok":11922,"totTok":213808,"search":8,"providerModel":"claude-opus-4-8"},{"key":"analysis","inTok":161801,"outTok":11861,"totTok":173662,"search":6,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":25772,"outTok":2894,"totTok":28666,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":28887,"outTok":1378,"totTok":30265,"search":0,"providerModel":"claude-opus-4-8"},{"key":"evaluation","inTok":30052,"outTok":4410,"totTok":34462,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"<$3B","label":"Multi-vendor Open RAN annual revenue through 2030 — the segment NEC's 2021 strategy targeted (Dell'Oro, Feb 2025)"},"unit":"USD B","chart":[{"year":"2022","v":45},{"year":"2023","v":40},{"year":"2024","v":35},{"year":"2029","v":32}],"stats":[{"k":"Total RAN CAGR 25-30","v":"~0% (band -1% to +1%)"},{"k":"Open RAN share of RAN by 2029","v":">25%"},{"k":"Top-5 vendor RAN share 1Q-3Q25","v":"96%"},{"k":"Multi-vendor Open RAN by 2030","v":"<5% / <$3B"}],"findings":["The total RAN equipment market is flat, not growing: ~$35B in 2024 (actual) holding at ~$32-35B/yr to 2030 (~0% CAGR, band -1% to +1%), with Omdia ($45B 2022 → $40B 2023 → $35B 2024) and Dell'Oro ($160B cumulative 2025-2029) converging on both level and contraction magnitude.","Open RAN's growth is pure share-shift, not market expansion: the category grows from ~$2.5-3.5B (2025E) to ~$8-9B (2029E) at a 25-35% CAGR, but single-vendor incumbents capture ~$5-6B of that while genuine multi-vendor Open RAN stays at $2-3B and under 5% of total RAN through 2030 (Dell'Oro, Feb 2025).","Market concentration is at a 10-year high (HHI, Dell'Oro 2025) with the top-5 vendors holding 96% of RAN revenue in 1Q-3Q25 (up from 95% in 2024) — Open RAN was absorbed by incumbents Huawei, Ericsson and Nokia rather than used to displace them.","NEC's 2021 thesis has already failed its own test: the assumed ~¥1.0tn/$7B Open RAN market by 2025 proved ~2x too high (actual ~$3B), the market declined ~40% in 2022-2024, NEC is absent from the top-3 vRAN ranking (Samsung, Rakuten Symphony, 1Finity per Dell'Oro 2Q25), and NEC's Mid-term Plan 2030 (May 2026) now reframes Telecom Infrastructure as 'flat capex, stable profit.'","Open RAN economics are operator-capability-dependent — TCO ranges from -30% (favorable conditions/skilled operator) to +4% (emerging-market Tier-1) versus traditional RAN (Analysys Mason) — structurally favoring well-resourced operators who buy single-vendor from incumbents and undermining the multi-vendor thesis NEC bet on."],"sources":["Dell'Oro Group, RAN & Open RAN market reports (Nov 2025, Feb 2025, Jan 2026 vintages; cumulative 2025-2029 forecast Jul 2025)","Omdia, RAN market share & sizing (FY2023, FY2024; via IEEE ComSoc Nov 2025)","Analysys Mason, Open RAN TCO study (-30% to +4% vs traditional RAN)","GSMA Intelligence, 5G connections (2bn end-2024, 57% of connections by 2030; Nov 2025)","NTIA, Public Wireless Supply Chain Innovation Fund ($1.5B program; May 2025)","NEC Corporation IR (2021 Open RAN 20%-share target; FY2025 segment actuals; Mid-term Management Plan 2030, May 2026)"]},"estimated":false},"C2":{"quality":76,"dims":{"Coverage":78,"Accuracy":68,"Depth":84,"Coherence":80,"Citation Quality":70,"Presentation Readiness":74},"totalTokens":433440,"inputTokens":396931,"outputTokens":36509,"searchCount":12,"latencyMs":632198,"stages":[{"key":"planning","inTok":664,"outTok":4311,"totTok":4975,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":122723,"outTok":13773,"totTok":136496,"search":7,"providerModel":"claude-sonnet-4-6"},{"key":"analysis","inTok":180775,"outTok":11043,"totTok":191818,"search":5,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":31789,"outTok":2312,"totTok":34101,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":24841,"outTok":1518,"totTok":26359,"search":0,"providerModel":"claude-sonnet-4-6"},{"key":"evaluation","inTok":36139,"outTok":3552,"totTok":39691,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"~$38–39B","label":"Global total RAN market by 2030 (1% CAGR, 2025–2030)"},"unit":"USD B","chart":[{"year":"2022","v":45},{"year":"2024","v":35},{"year":"2025","v":35},{"year":"2027","v":36},{"year":"2030","v":39}],"stats":[{"k":"RAN CAGR 2025–30","v":"1% (Dell'Oro, Feb 2026)"},{"k":"Open RAN share 2030E","v":"20–28% of RAN (~$9B, reconciled)"},{"k":"Top-5 RAN vendor share","v":"96% of market (Q1–Q3 2025, Dell'Oro)"},{"k":"NEC global RAN share","v":"0.9% (~$315M, FY2024, Omdia)"}],"findings":["The total RAN market (HW+SW, excl. services) fell ~20% from ~$45B in 2022 to ~$35B in 2024, and Dell'Oro Group (Feb 2026) projects only a 1% CAGR through 2030 (~$38–39B), as rapidly declining LTE capex offsets maturing 5G spending with no meaningful uplift until 6G ramps from ~2029.","Open RAN reached only ~$3.5B (~10% of total RAN) in 2024—missing Dell'Oro's own 2021 forecast of $10B by 2025 by approximately 72%—and reconciles to ~$9B by 2030 (20–28% of RAN) when Dell'Oro's current share guidance is applied to the $38B base; the Tier-3 publisher endpoint of $20.9B (MarketsandMarkets, 2025) requires ~50% Open RAN penetration that no Tier-1 source supports.","Market concentration reached a 10-year high in 2025 (Dell'Oro HHI data, Nov 2025): the top five vendors (Huawei, Ericsson, Nokia, ZTE, Samsung) held 96% of Q1–Q3 2025 RAN revenue, up from 95% in 2024, with Huawei and Ericsson alone controlling nearly two-thirds of the global market—precisely the oligopoly Open RAN was designed to break.","NEC's global 5G revenue fell 17% to JPY 72.6B (~$460M USD) in FY2024, its overseas FY2026 target was cut 64% (JPY 85.4B to as low as JPY 31B) due to Open RAN delays, and NEC exited 4G/5G base-station hardware manufacturing in late 2025—making the legacy aspirational target of 20% Open RAN market share by 2030 (~$1.8B implied) arithmetically implausible at roughly 4× NEC's entire shrinking 5G business.","The defensible capital posture is to ratify NEC's pivot already underway: fund 5G Core software and OREX SAI services (selectively, noting NEC holds only a 34% non-controlling interest vs. NTT DOCOMO's 66%), pursue government-co-funded greenfield deals modelled on the SURGE/Indonesia agreement (4,800 base stations, SURGE USD 3B total investment, OREX SAI targeting USD 1B in orders; The Mobile Network, Nov 2025), and treat 6G R&D as the primary long-dated option for the next capex cycle."],"sources":["Dell'Oro Group, RAN 5-Year Forecast Update, Feb 2026 (CAGR, 2030 size, vendor shares, HHI)","Dell'Oro Group, RAN 2030 Advanced Research Report, Sep 2023 (long-run CAGR context; superseded on 2030 size by Feb 2026 update)","Dell'Oro Group, Quarterly RAN Tracker Q3 2025, Nov 2025 (vendor concentration, HHI, regional trends)","Dell'Oro Group, Private Wireless RAN Forecast, Sep 2024 (21% CAGR private wireless, –2% public RAN)","Omdia (Informa), Global RAN Market Report, Feb 2026 (FY2022–2025 actuals: $45B→$35B; China decline; ex-China outlook)","Omdia, Vendor Market Share Report, Nov 2025 (NEC 0.9%, Fujitsu 0.5%, Samsung 4.8%, top-3 = 77.4%)","Omdia, 5G SA Core Software Forecast, Oct 2025 (8.8% CAGR 2025–2030)","ABI Research, Open RAN Market Assessment, Jan 2024 (6–8% Open RAN share by end-2024)","Téral Research, via IEEE ComSoc Technology Blog, Oct 2024 (Samsung #1, NEC #2, Fujitsu #3 in open vRAN)","MarketsandMarkets, Open RAN Market Report, 2025 [Tier 3 — directional only] ($2.8B base, $20.9B 2030, 39.4% CAGR)","NEC Corporation, FY2024 Full-Year Financial Results and IR Disclosures, 2025 (JPY 72.6B 5G revenue; overseas target cut)","NEC Corporation, Mid-Term Management Plan 2025 / 2030 IR Documents (20% Open RAN share target by 2030)","The Mobile Network / TheFastMode, OREX SAI–SURGE Indonesia Agreement, Nov 2025 (4,800 base stations; USD 3B investment; USD 1B OREX SAI order target)","NTIA (U.S. Dept of Commerce), Public Wireless Supply Chain Innovation Fund announcements, 2021–May 2024 (USD 1.5B authorised; USD 420M May 2024 tranche)","IEEE ComSoc Technology Blog, Open RAN Market Analysis (citing Omdia and Dell'Oro), Aug–Sep 2025"]},"estimated":false},"C3":{"quality":75,"dims":{"Coverage":78,"Accuracy":69,"Depth":84,"Coherence":78,"Citation Quality":72,"Presentation Readiness":70},"totalTokens":275408,"inputTokens":243627,"outputTokens":31781,"searchCount":28,"latencyMs":464226,"stages":[{"key":"planning","inTok":664,"outTok":5114,"totTok":5778,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":3628,"outTok":7124,"totTok":10752,"search":22,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":168606,"outTok":11179,"totTok":179785,"search":6,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":24093,"outTok":2911,"totTok":27004,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":18642,"outTok":777,"totTok":19419,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":27994,"outTok":4676,"totTok":32670,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"$34.0B","label":"Global RAN Market Size in CY2025 as the flat denominator for capital-allocation"},"unit":"USD B","chart":[{"year":"2022","v":45},{"year":"2024","v":35},{"year":"2025","v":34},{"year":"2030","v":36}],"stats":[{"k":"Total RAN CAGR 25-30","v":"1.0%"},{"k":"Reconciled Open RAN Share 25","v":"8.5%"},{"k":"Top-5 RAN Share 1Q-3Q25","v":"96.0%"},{"k":"Multi-Vendor RAN 2030","v":"<5.0%"}],"findings":["The global RAN market contracted by over 22.0% from its 2022 peak of $45.0 billion USD to $35.0 billion USD in 2024, and is projected to grow at a flat 1.0% CAGR to $36.0 billion USD by 2030 (Omdia, Feb 2026; Dell'Oro, Jan 2026).","The actual 2025 Open RAN market is reconciled at $2.9 billion USD (8.5% of total RAN), exposing generalist claims of $3.98 billion USD as an error that misread Dell'Oro's cumulative-since-2019 data as annual (Dell'Oro, Oct 2025).","Supplier concentration hit a ten-year high in 2025 with the top five vendors securing 96.0% of the market, while multi-vendor Open RAN was downgraded to less than 5.0% of total RAN by 2030 (Omdia, Feb 2026; Dell'Oro, Feb 2026).","NEC's exit from hardware-based base stations via a 180.0 billion JPY (~$1.16 billion USD) restructuring charge is validated by the shrinking $1.4 billion USD addressable non-top-5 hardware pool (NEC, Jan 2026; Omdia, Feb 2026).","High-margin software and orchestration pools are growing rapidly off tiny bases, with RAN SMO projected to scale from $18.0 million USD in 2024 to $1.1 billion USD by 2030 at a 99.0% CAGR (Omdia, May 2025)."],"sources":["Omdia Mobile Infrastructure Practice (Feb 2026, May 2025)","Dell’Oro Group RAN Market Tracker & Forecasts (Jan 2026, Feb 2026, Oct 2025)","NEC Corporate Financial Announcement (Jan 2026)","Mitsubishi Research Institute Reports (Dec 2025)"]},"estimated":false},"C4":{"quality":71,"dims":{"Coverage":78,"Accuracy":62,"Depth":82,"Coherence":75,"Citation Quality":68,"Presentation Readiness":58},"totalTokens":335253,"inputTokens":288252,"outputTokens":47001,"searchCount":24,"latencyMs":793038,"stages":[{"key":"planning","inTok":430,"outTok":5709,"totTok":6139,"search":0,"providerModel":"gpt-5.5"},{"key":"acquisition","inTok":116528,"outTok":16417,"totTok":132945,"search":17,"providerModel":"gpt-5.5"},{"key":"analysis","inTok":71457,"outTok":13741,"totTok":85198,"search":7,"providerModel":"gpt-5.5"},{"key":"synthesis","inTok":31530,"outTok":3213,"totTok":34743,"search":0,"providerModel":"gpt-5.5"},{"key":"presentation","inTok":33870,"outTok":1774,"totTok":35644,"search":0,"providerModel":"gpt-5.5"},{"key":"evaluation","inTok":34437,"outTok":6147,"totTok":40584,"search":0,"providerModel":"gpt-5.5"}],"deck":{"headline":{"value":"US$9.0B","label":"NEC base-case global Open RAN product-plus-services market by 2030"},"unit":"USD B","chart":[{"year":"2024","v":2.8},{"year":"2025","v":3.2},{"year":"2030","v":9}],"stats":[{"k":"Open RAN CAGR 2025-2030","v":"23.0%"},{"k":"5G infra. CAGR 2025-2030","v":"11.6%"},{"k":"5G infra. market 2030","v":"US$78.0B"},{"k":"Multi-vendor RAN share 2030","v":"<5% of total RAN"}],"findings":["NEC base-case estimate is that global Open RAN product-plus-services revenue grows from US$3.2 billion in calendar year 2025 to US$9.0 billion in calendar year 2030, equal to a 23.0% CAGR from 2025 to 2030, anchored to Dell’Oro’s 8%–10% Open RAN share indication for 2025 and its less-than-5% multi-vendor RAN forecast for 2030.","The broader active 5G network-infrastructure market is larger but less Open-RAN-specific: NEC estimates US$45.0 billion in calendar year 2025 and US$78.0 billion in calendar year 2030, equal to an 11.6% CAGR from 2025 to 2030, using Omdia’s US$35.0 billion RAN market in 2025 and US$17.4 billion telco network cloud market in 2025 as anchors.","The RAN market remains scale-locked: Omdia reported about US$35.0 billion of global RAN technology revenue in calendar year 2025, and Dell’Oro public reporting in 2026 stated Huawei and Ericsson together held nearly two-thirds of global RAN share in 2025.","Adoption demand is real but capex-constrained: Ericsson reported 3.1 billion 5G subscriptions in Q1 2026 and about 390 commercial 5G service providers by June 2026, while GSMA forecast US$1.2 trillion of global mobile operator capex over 2025–2030 and 57% 5G share of global mobile connections in 2030.","The main restraint is not standards enthusiasm but operator economics: Dell’Oro forecast worldwide telecom capex to decline 2% year over year in calendar year 2026 and grow at only 1% CAGR through calendar year 2030, after reporting Open RAN revenue down 30% year over year in the first three quarters of 2024."],"sources":["NEC Strategy analysis, June 2026, based on sourced market trackers and public filings","Dell’Oro Group via RCR Wireless, 9 February 2026","Dell’Oro Group via Mobile World Live, 11 December 2024; dated under the approximately 18-month recency rule","Omdia via TelecomTV, February 2026","Omdia Telco Network Cloud Market Tracker press release, 27 October 2025","Ericsson Mobility Report / Ericsson press release, June 2026","GSMA Mobile Economy 2026, February 2026","MarketsandMarkets Open RAN press release, 14 August 2024; dated under the approximately 18-month recency rule"]},"estimated":false},"C5":{"quality":53,"dims":{"Coverage":64,"Accuracy":38,"Depth":76,"Coherence":52,"Citation Quality":46,"Presentation Readiness":43},"totalTokens":71810,"inputTokens":54075,"outputTokens":17735,"searchCount":26,"latencyMs":307918,"stages":[{"key":"planning","inTok":439,"outTok":2508,"totTok":2947,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"acquisition","inTok":2945,"outTok":5804,"totTok":8749,"search":18,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":8169,"outTok":4896,"totTok":13065,"search":8,"providerModel":"gemini-3.5-flash"},{"key":"synthesis","inTok":12643,"outTok":1865,"totTok":14508,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"presentation","inTok":14691,"outTok":681,"totTok":15372,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":15188,"outTok":1981,"totTok":17169,"search":0,"providerModel":"gemini-3.5-flash"}],"deck":{"headline":{"value":"$368.0M USD","label":"Global addressable multi-vendor Open RAN software TAM by calendar year 2030"},"unit":"USD B","chart":[{"year":"2024","v":2.92},{"year":"2025","v":3.18},{"year":"2030","v":20}],"stats":[{"k":"Multi-Vendor SW TAM 2030","v":"$368.0M USD"},{"k":"NEC HW Restruct. Charge FY26","v":"JPY 18.0B"},{"k":"BluStellar YoY Growth FY26","v":"30.0%"},{"k":"O-RAN Integration Cost Share","v":"15.0%-25.0%"}],"findings":["The global RAN market is projected to grow at a flat 1.0% CAGR from base-year 2025 to horizon-year 2030, reaching $36.78B USD by calendar year 2030 (Dell’Oro Group, February 2026).","Although the overall Open RAN market is forecast to hit $20.0B USD by calendar year 2030, single-vendor virtualized RAN configurations will capture 95.0% of this value, restricting multi-vendor Open RAN to under 5.0% of the total RAN market (Dell'Oro Group, February 2026).","Following its exit from the mobile base station hardware business on January 29, 2026, which led to a JPY 18.0B ($115.4M USD) restructuring charge in Q3 FY2026, NEC has lost the physical radio footprint required to pull through standalone software (NEC Financial Filings, Q3 FY2026).","Redirecting the proposed $150.0M USD (JPY 23.4B) capital allocation to the domestic NEC BluStellar platform is projected to yield JPY 28.08B ($180.0M USD) in annual revenue and JPY 3.76B ($24.1M USD) in operating profit by FY2028 (NEC Segment Results, May 2026)."],"sources":["Dell'Oro Group (February 2026)","Omdia (May 2026)","Market Intelo (June 2026)","NEC Corporation Financial Results (May 2026 & Q3 FY2026)","Precedence Research (February 2026)"]},"estimated":false},"C6":{"quality":76,"dims":{"Coverage":78,"Accuracy":72,"Depth":84,"Coherence":80,"Citation Quality":70,"Presentation Readiness":72},"totalTokens":197214,"inputTokens":166588,"outputTokens":30626,"searchCount":28,"latencyMs":571945,"stages":[{"key":"planning","inTok":430,"outTok":4690,"totTok":5120,"search":0,"providerModel":"gpt-5.5"},{"key":"acquisition","inTok":4782,"outTok":5228,"totTok":10010,"search":14,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":102464,"outTok":12071,"totTok":114535,"search":14,"providerModel":"gpt-5.5"},{"key":"synthesis","inTok":17384,"outTok":3435,"totTok":20819,"search":0,"providerModel":"gpt-5.5"},{"key":"presentation","inTok":21506,"outTok":894,"totTok":22400,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":20022,"outTok":4308,"totTok":24330,"search":0,"providerModel":"gpt-5.5"}],"deck":{"headline":{"value":"$1.84B","label":"Maximum pure multi-vendor Open RAN addressable revenue pool by 2030 based on a 5.00% deployment ceiling"},"unit":"USD B","chart":[{"year":"2022","v":45},{"year":"2025","v":35},{"year":"2026","v":35},{"year":"2030","v":36.8}],"stats":[{"k":"Global RAN CAGR 2025-2030","v":"1.00%"},{"k":"Strict Open RAN CAGR 25-30","v":"34.80%"},{"k":"Multi-Vendor RAN Share 2030","v":"< 5.00%"},{"k":"NEC Global RAN Share 2024","v":"0.90%"}],"findings":["The global RAN market stabilized at USD 35.00 billion in calendar year 2025 but faces near-term stagnation with a forecasted 1.00% CAGR from base year 2025 to horizon year 2030 to reach USD 36.80 billion, according to Dell'Oro Group (February 2026).","The global Open RAN market is estimated at USD 4.50 billion in calendar year 2025 and is projected to reach USD 20.00 billion by horizon year 2030, representing a 34.80% CAGR, but pure multi-vendor configurations will comprise less than 5.00% of deployments (under USD 1.84 billion) by 2030, according to Dell'Oro Group (February 2026).","NEC remains a subscale RAN hardware challenger, holding a 0.90% global RAN revenue share in calendar year 2024, with its global 5G revenue falling 17.00% year-over-year to JPY 72.60 billion (approximately USD 460.00 million) and generating an operating loss of JPY 10.80 billion (approximately USD 68.00 million) in 2024, per Omdia/Light Reading (March 2026).","The 5G Standalone core network market presents a viable software growth pool for NEC, growing at a 12.00% CAGR from base year 2025 to horizon year 2030 per Dell'Oro Group (January 2026), exemplified by NTT Docomo launching its commercial 5G core on AWS in March 2026 using NEC technology to achieve an 80.00% reduction in deployment time.","Private wireless networks present high-value systems-integration opportunities with GSA (June 2026) reporting 2,003 organizations deploying private networks by end-Q1 2026, representing a 37.00% CAGR from base year 2019 to horizon year 2026, where manufacturing is the largest vertical with 374 deployments (18.70% share)."],"sources":["Dell'Oro Group (February 2026)","Dell'Oro Group (January 2026)","Omdia / Light Reading (March 2026)","GSA (April/June 2026)","Amazon Web Services / NTT Docomo (March 2026)"]},"estimated":false}},"T3":{"C1":{"quality":70,"dims":{"Coverage":76,"Accuracy":62,"Depth":84,"Coherence":70,"Citation Quality":68,"Presentation Readiness":58},"totalTokens":601914,"inputTokens":559260,"outputTokens":42654,"searchCount":15,"latencyMs":577101,"stages":[{"key":"planning","inTok":666,"outTok":5339,"totTok":6005,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":212309,"outTok":14894,"totTok":227203,"search":8,"providerModel":"claude-opus-4-8"},{"key":"analysis","inTok":251027,"outTok":12273,"totTok":263300,"search":7,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":28573,"outTok":3872,"totTok":32445,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":32666,"outTok":1566,"totTok":34232,"search":0,"providerModel":"claude-opus-4-8"},{"key":"evaluation","inTok":34019,"outTok":4710,"totTok":38729,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"$70-75B","label":"NEC's real addressable APAC DC market (ex-China, 2024) — ~30% below the headline figure"},"unit":"USD B","chart":[{"year":"2024","v":102},{"year":"2030","v":175}],"stats":[{"k":"CAGR 24-30 (total APAC)","v":"~9-14%"},{"k":"China share of APAC power capacity","v":"~53%"},{"k":"AI share of incremental CapEx 25-30","v":"~80-90%"},{"k":"APAC subsea SAM 2026 (NEC-relevant)","v":"~$6B/yr"}],"findings":["APAC total DC market is ~US$100-105bn in 2024 [A/E] rising to ~US$150-175bn by 2030 [F], a ~9-14% CAGR; the wide band reflects genuine definitional spread across Arizton (US$102bn 2024 to US$175bn 2030, 9.31% CAGR), Grand View (~US$150bn by 2030, 13.2% CAGR) and Next Move (US$151bn by 2030, 14.07% CAGR).","China commands ~53% of APAC power capacity (Arizton, Mar 2026) and ~US$26-29bn of standalone market (Mordor, 2025) but is structurally closed to NEC, leaving a derived APAC-ex-China TAM of ~US$70-75bn in 2024 — the real ceiling for NEC capital allocation (Low confidence, cross-house subtraction).","Roughly 80-90% of incremental APAC DC CapEx 2025-2030 is AI/accelerated-compute, a layer NEC cannot profitably enter: IEA (2025) shows accelerated-server electricity growing 30%/yr vs. 9%/yr conventional, while NVIDIA captures ~57 cents of every US$1 spent (Q1 FY2027, up from 39 cents four quarters prior).","Operational capacity ranks China 4.6 GW > Japan 1.5 GW > Australia 1.3 GW = India 1.3 GW > Singapore 1.0 GW (Cushman & Wakefield, H1 2025); APAC operational capacity is set to roughly double from ~14 GW (H2 2025) to ~24 GW by 2030 (C&W).","NEC's defensible position is subsea systems — an APAC communications-subsea SAM of ~US$6bn/yr in 2026 growing ~12%/yr (Mordor + 38.6% APAC share) — but the business is currently loss-making (¥10bn one-off expense H1 FY2026), and NEC's ¥100bn / ~US$636m FY26-30 commitment (incl. up to five vessels) is margin-defensive vertical integration, not growth capital."],"sources":["Cushman & Wakefield, Asia Pacific Data Centre Update, H1 2025 & H2 2025 (capacity by status)","Arizton, APAC Data Center Market / Construction Market, Mar 2026 (investment, China power-capacity share)","Grand View Research, May 2025 & Next Move Strategy, Feb 2026 (APAC market size & CAGR)","Mordor Intelligence, China DC Market (Jan 2026) & Submarine Cable Systems (Jan 2026)","IEA, Energy & AI / Electricity 2025 (accelerated vs. conventional server demand, country TWh additions)","TrendForce, AI server outlook, Jan/Oct 2025 & Jan 2026 (AI-server value share, CSP CapEx)","NVIDIA Q1 FY2027 disclosure via AL Capital, May 2026 (capture rate)","Goldman Sachs, Jun 2026 (China vs. US hyperscaler CapEx ratio)","Dell'Oro Group, Mar 2026 & BNEF, Mar 2026 (global DC CapEx control totals)","TeleGeography, Dec 2025 (subsea investment trajectory)","NEC Corporation FY2025 results & integrated disclosures, 2026 (segment revenue, subsea expense, ¥100bn investment)","AEMO / Oxford Economics, 2025 (Australia phantom-demand: 44 GW requests vs. ~6 GW realized)"]},"estimated":false},"C2":{"quality":71,"dims":{"Coverage":78,"Accuracy":64,"Depth":84,"Coherence":74,"Citation Quality":66,"Presentation Readiness":61},"totalTokens":458027,"inputTokens":419787,"outputTokens":38240,"searchCount":13,"latencyMs":643858,"stages":[{"key":"planning","inTok":666,"outTok":4230,"totTok":4896,"search":0,"providerModel":"claude-opus-4-8"},{"key":"acquisition","inTok":153153,"outTok":12704,"totTok":165857,"search":7,"providerModel":"claude-sonnet-4-6"},{"key":"analysis","inTok":174580,"outTok":12943,"totTok":187523,"search":6,"providerModel":"claude-opus-4-8"},{"key":"synthesis","inTok":31039,"outTok":2765,"totTok":33804,"search":0,"providerModel":"claude-opus-4-8"},{"key":"presentation","inTok":24543,"outTok":1433,"totTok":25976,"search":0,"providerModel":"claude-sonnet-4-6"},{"key":"evaluation","inTok":35806,"outTok":4165,"totTok":39971,"search":0,"providerModel":"claude-opus-4-8"}],"deck":{"headline":{"value":"~USD 52B","label":"APAC ex-China data-center CapEx addressable to NEC in 2024 (48% of ~USD 100B total stripped for China inaccessibility)"},"unit":"USD B","chart":[{"year":"2024","v":100},{"year":"2025","v":127},{"year":"2026","v":142},{"year":"2028","v":160},{"year":"2030","v":175}],"stats":[{"k":"Capacity CAGR 2025–30","v":"12% (32 GW → 57 GW, JLL May 2026)"},{"k":"Colo CapEx CAGR 2025–30","v":"17.25% ($19.3B → $50.2B, Arizton Oct 2025)"},{"k":"China share of APAC CapEx","v":"~48% (Arizton Jun 2026: 47.92% in 2025)"},{"k":"NEC-addressable SAM 2024","v":"~USD 8–15B (derived: ex-China, ex-facility-construction, ex-colo-ownership)"}],"findings":["APAC total data-center CapEx reached approximately USD 100 billion in 2024 (range USD 95–105B; Arizton Mar 2026 broad-scope figure of USD 102.45B, anchored by Cushman & Wakefield H2 2025 operational capacity of 13,763 MW times blended USD 8–9M per MW cost, IoT Analytics Nov 2025), growing to approximately USD 175 billion by 2030 at a 9–10% broad-scope CAGR — but the colocation and services layers that NEC can address grow faster at 17–19% CAGR (Arizton Oct 2025; JLL May 2026).","China's 47.92% share of 2025 APAC investment (Arizton Jun 2026) renders approximately USD 52 billion the NEC-relevant 2024 denominator after stripping the inaccessible China market; further stripping facility construction and colo-ownership layers NEC cannot credibly win reduces the addressable SAM to USD 8–15 billion — roughly one-tenth of the USD 100 billion headline TAM.","Malaysia and India together delivered 58% of APAC's new operational IT load in H2 2025, with Johor ranking #1 in Cushman & Wakefield's Maturity Index (Mar 2026), surpassing Tokyo and Beijing; Southeast Asia accounts for 31% of the 19,371 MW under-construction pipeline, making SEA and India the primary flow markets for new engineering and SI contracts — not the mature China/Japan/Singapore stock leaders.","Power availability is the binding constraint, not demand: APAC data-center electricity consumption is projected to rise from 320 TWh in 2024 to 780 TWh by 2030 (+144%, Turner & Townsend via Introl Feb 2026); Tokyo grid interconnection queues run 3–5 years at distribution level and up to 10–12 years at transmission level (Cushman & Wakefield Dec 2025; Digital Edge Mar 2026); Singapore colocation vacancy sits at 1.4% (Arizton/KWM Dec 2024) — supply-constrained markets structurally favor asset-light engineering services over balance-sheet colo ownership.","NEC holds an incumbent, highest-barrier position in exactly one APAC DC layer: submarine cable, where ASN, NEC, and SubCom collectively controlled more than 60% of global wet-plant revenue in 2024 (Mordor Intelligence Jan 2026), with order books filled through 2027 and high entry barriers from deep-sea know-how and type-approval cycles; this oligopoly position is the committee's highest-conviction GO, insulated from a potential hyperscaler CapEx correction that would compress the more cyclical SI and co-investment plays within 2–4 quarters."],"sources":["Arizton Advisory & Intelligence, Asia-Pacific Data Center Market Report, March 2026","Arizton Advisory & Intelligence, APAC Data Center Market Press Release, June 17 2026","Arizton Advisory & Intelligence, APAC Data Center Colocation Market Report, October 2025","Arizton Advisory & Intelligence, APAC Data Center Construction Market Report, April 2025","JLL, 2026 Global Data Center Market Outlook, May 2026","Cushman & Wakefield, APAC Data Center H2 2025 Market Update, March 2026","Cushman & Wakefield, APAC Data Center H1 2025 Market Update (cited in dossier for 12,634 MW operational, 2025)","IoT Analytics, Data Center Spending Report, November 2025","Mordor Intelligence, Submarine Cable System Market Report, January 2026","Turner & Townsend, 2025 Data Center Construction Cost Index (via Introl, February 2026)","MarketsandMarkets, APAC Data Center Colocation Market Report, March 2026","Grand View Research, Asia Pacific Data Center Market Report, May 2025","GMI Research, APAC Data Center Construction Market Report, May 2025","Next Move Strategy Consulting, Asia-Pacific Data Center Market Report, January 2026","NEC Corporation FY2025 Earnings Release and FY2026 Guidance (year ended March 2025)","IDC, Asia/Pacific Cloud Adoption Survey, October 2024","Goldman Sachs, Hyperscaler CapEx Analysis (via Yahoo Finance), June 2026","KWM / Data Center Dynamics, Singapore DC-CFA2 and Jurong Island Analysis, December 2024 – May 2026","TechWire Asia, Malaysia Data Center Market Analysis, March 2026","Moody's, APAC Data Center Market Report, July 2024 (flagged as ~24 months old)"]},"estimated":false},"C5":{"quality":55,"dims":{"Coverage":75,"Accuracy":32,"Depth":70,"Coherence":55,"Citation Quality":60,"Presentation Readiness":38},"totalTokens":78598,"inputTokens":59283,"outputTokens":19315,"searchCount":40,"latencyMs":352526,"stages":[{"key":"planning","inTok":438,"outTok":3075,"totTok":3513,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"acquisition","inTok":3511,"outTok":6166,"totTok":9677,"search":37,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":8803,"outTok":5577,"totTok":14380,"search":3,"providerModel":"gemini-3.5-flash"},{"key":"synthesis","inTok":14143,"outTok":1570,"totTok":15713,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"presentation","inTok":15896,"outTok":779,"totTok":16675,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":16492,"outTok":2148,"totTok":18640,"search":0,"providerModel":"gemini-3.5-flash"}],"deck":{"headline":{"value":"¥100.0B","label":"Recommended NEC capital allocation to bypass Tokyo's 10-year grid queue and capture up to 23% Yield-on-Cost"},"unit":"USD B","chart":[{"year":"2025","v":126.64},{"year":"2028","v":179.85},{"year":"2031","v":255.49}],"stats":[{"k":"CAGR (2025-2031)","v":"12.41%"},{"k":"Tokyo Grid Queue","v":"10 Years"},{"k":"Johor YoY Growth","v":"124.0%"},{"k":"APAC Pre-Leased Rate","v":"78.0%"}],"findings":["The total APAC data-center market is projected to grow from USD 126.64 billion in 2025 to USD 255.49 billion by 2031 at a 12.41% CAGR, driven by active IT hardware and high-density deployments (Arizton, June 2026).","Greater Tokyo's grid queue has expanded to 10 years as of early 2026, making greenfield builds unviable and shifting high-velocity demand to Johor, which grew 124.00% YoY in 2025 to 897 MW (JLL Research, January 2026; Cushman & Wakefield, March 2026).","Direct Liquid Cooling (DLC) retrofits cost USD 2.00 million per MW, enabling NEC to bypass Tokyo grid delays on existing facilities and capture premium lease rates of USD 330.00 to USD 475.00 per kW/month at a 21.00% to 23.00% Yield-on-Cost (Stellarix, May 2026; CBRE, June 2026; Cushman & Wakefield, July 2025).","Leveraging joint ventures in Johor or Mumbai under a 60:40 debt-to-equity structure enables NEC's ¥60.0 billion (USD 400.00 million) allocation to unlock a JPY 150.00 billion pipeline, capturing a 14.00% gross Yield-on-Cost (Cushman & Wakefield, March 2026)."],"sources":["Arizton Advisory & Intelligence (June 2026)","Cushman & Wakefield (February 2026, March 2026)","JLL Research (January 2026, March 2026)","CBRE Research (June 2026)","Stellarix (May 2026)"]},"estimated":false},"C6":{"quality":62,"dims":{"Coverage":64,"Accuracy":56,"Depth":76,"Coherence":66,"Citation Quality":61,"Presentation Readiness":48},"totalTokens":171302,"inputTokens":136115,"outputTokens":35187,"searchCount":28,"latencyMs":583325,"stages":[{"key":"planning","inTok":428,"outTok":6545,"totTok":6973,"search":0,"providerModel":"gpt-5.5"},{"key":"acquisition","inTok":6303,"outTok":6659,"totTok":12962,"search":21,"providerModel":"gemini-3.5-flash"},{"key":"analysis","inTok":62048,"outTok":11076,"totTok":73124,"search":7,"providerModel":"gpt-5.5"},{"key":"synthesis","inTok":19748,"outTok":3267,"totTok":23015,"search":0,"providerModel":"gpt-5.5"},{"key":"presentation","inTok":24900,"outTok":855,"totTok":25755,"search":0,"providerModel":"gemini-3.5-flash"},{"key":"evaluation","inTok":22688,"outTok":6785,"totTok":29473,"search":0,"providerModel":"gpt-5.5"}],"deck":{"headline":{"value":"$398.0B","label":"APAC combined annual data-center and AI-infrastructure capex by 2030 (NEC synthesis, June 2026)"},"unit":"USD B","chart":[{"year":"2025","v":100},{"year":"2026","v":143},{"year":"2030","v":398}],"stats":[{"k":"AI 2030 Capex Share","v":"86.9%"},{"k":"Sovereign AI CAGR 26-32","v":"22.6%"},{"k":"Japan Cost/MW (2025)","v":"USD 13.24M"},{"k":"APAC Capacity 2030","v":"57 GW"}],"findings":["The APAC combined annual capex is projected to reach USD 398.0 billion by 2030, with IT and AI infrastructure representing 86.9% (USD 346.0 billion) of this total in 2030, based on NEC synthesis (June 2026) of IDC (2026) and ResearchAndMarkets (May 2025) data.","Broad APAC data-center capacity is forecast to expand from 32 GW in 2025 to 57 GW by 2030, representing a CAGR of 12.0% (base year 2025, horizon year 2030), according to JLL Research (January 2026).","The APAC Sovereign AI infrastructure segment is projected to grow from USD 11.20 billion in 2025 to USD 46.50 billion by 2032, registering a CAGR of 22.6% (base year 2026, horizon year 2032), based on MarketsandMarkets (May 2026) data.","AWS has committed AUD 20.00 billion (approx. USD 13.20 billion) of capital to Australian data-center infrastructure over the 2025–2029 period, according to the Australian Prime Minister's Office (announced 2024; flagged as older than 18 months).","A 20.0% grid-related delay in JLL's planned 25 GW capacity additions during 2026-2030 would defer USD 46.65 billion in facility capex and an estimated USD 100.0 billion to USD 200.0 billion in IT/AI infrastructure spend beyond 2030, per NEC sensitivity analysis (June 2026) using Cushman & Wakefield unit costs."],"sources":["JLL Research (Global Data Center Outlook, January 2026)","MarketsandMarkets (Sovereign AI Market Forecast, May 2026)","ResearchAndMarkets (APAC Data Center Construction, May 2025)","IDC (APJ AI Infrastructure Tracker, 2026)","Cushman & Wakefield (APAC Data Centre Update, H2 2025 & H2 2024 / Feb 2025)","Australian Prime Minister's Office (AWS Investment Press Release, 2024; flagged as dated)"]},"estimated":false},"C3":{"quality":69,"dims":{"Coverage":76,"Accuracy":58,"Depth":83,"Coherence":71,"Citation Quality":67,"Presentation Readiness":59},"totalTokens":267289,"inputTokens":236673,"outputTokens":30361,"searchCount":24,"latencyMs":451805,"stages":[{"key":"planning","inTok":665,"outTok":4544,"totTok":5213,"search":null,"providerModel":""},{"key":"acquisition","inTok":3946,"outTok":6601,"totTok":11582,"search":20,"providerModel":""},{"key":"analysis","inTok":154812,"outTok":10577,"totTok":165179,"search":4,"providerModel":""},{"key":"synthesis","inTok":22638,"outTok":3095,"totTok":25723,"search":null,"providerModel":""},{"key":"presentation","inTok":18372,"outTok":781,"totTok":19142,"search":null,"providerModel":""},{"key":"evaluation","inTok":26868,"outTok":4722,"totTok":31597,"search":null,"providerModel":""}],"deck":{"headline":{"value":"~USD 52B","label":"APAC ex-China data-center CapEx addressable to NEC in 2024 (48% of ~USD 100B total stripped for China inaccessibility)"},"unit":"USD B","chart":[{"year":"2024","v":100},{"year":"2025","v":127},{"year":"2026","v":142},{"year":"2028","v":160},{"year":"2030","v":175}],"stats":[{"k":"Capacity CAGR 2025–30","v":"12% (32 GW → 57 GW, JLL May 2026)"},{"k":"Colo CapEx CAGR 2025–30","v":"17.25% ($19.3B → $50.2B, Arizton Oct 2025)"},{"k":"China share of APAC CapEx","v":"~48% (Arizton Jun 2026: 47.92% in 2025)"},{"k":"NEC-addressable SAM 2024","v":"~USD 8–15B (derived: ex-China, ex-facility-construction, ex-colo-ownership)"}],"findings":["APAC total data-center CapEx reached approximately USD 100 billion in 2024 (range USD 95–105B; Arizton Mar 2026 broad-scope figure of USD 102.45B, anchored by Cushman & Wakefield H2 2025 operational capacity of 13,763 MW times blended USD 8–9M per MW cost, IoT Analytics Nov 2025), growing to approximately USD 175 billion by 2030 at a 9–10% broad-scope CAGR — but the colocation and services layers that NEC can address grow faster at 17–19% CAGR (Arizton Oct 2025; JLL May 2026).","China's 47.92% share of 2025 APAC investment (Arizton Jun 2026) renders approximately USD 52 billion the NEC-relevant 2024 denominator after stripping the inaccessible China market; further stripping facility construction and colo-ownership layers NEC cannot credibly win reduces the addressable SAM to USD 8–15 billion — roughly one-tenth of the USD 100 billion headline TAM.","Malaysia and India together delivered 58% of APAC's new operational IT load in H2 2025, with Johor ranking #1 in Cushman & Wakefield's Maturity Index (Mar 2026), surpassing Tokyo and Beijing; Southeast Asia accounts for 31% of the 19,371 MW under-construction pipeline, making SEA and India the primary flow markets for new engineering and SI contracts — not the mature China/Japan/Singapore stock leaders.","Power availability is the binding constraint, not demand: APAC data-center electricity consumption is projected to rise from 320 TWh in 2024 to 780 TWh by 2030 (+144%, Turner & Townsend via Introl Feb 2026); Tokyo grid interconnection queues run 3–5 years at distribution level and up to 10–12 years at transmission level (Cushman & Wakefield Dec 2025; Digital Edge Mar 2026); Singapore colocation vacancy sits at 1.4% (Arizton/KWM Dec 2024) — supply-constrained markets structurally favor asset-light engineering services over balance-sheet colo ownership.","NEC holds an incumbent, highest-barrier position in exactly one APAC DC layer: submarine cable, where ASN, NEC, and SubCom collectively controlled more than 60% of global wet-plant revenue in 2024 (Mordor Intelligence Jan 2026), with order books filled through 2027 and high entry barriers from deep-sea know-how and type-approval cycles; this oligopoly position is the committee's highest-conviction GO, insulated from a potential hyperscaler CapEx correction that would compress the more cyclical SI and co-investment plays within 2–4 quarters."],"sources":["Arizton Advisory & Intelligence, Asia-Pacific Data Center Market Report, March 2026","Arizton Advisory & Intelligence, APAC Data Center Market Press Release, June 17 2026","Arizton Advisory & Intelligence, APAC Data Center Colocation Market Report, October 2025","Arizton Advisory & Intelligence, APAC Data Center Construction Market Report, April 2025","JLL, 2026 Global Data Center Market Outlook, May 2026","Cushman & Wakefield, APAC Data Center H2 2025 Market Update, March 2026","Cushman & Wakefield, APAC Data Center H1 2025 Market Update (cited in dossier for 12,634 MW operational, 2025)","IoT Analytics, Data Center Spending Report, November 2025","Mordor Intelligence, Submarine Cable System Market Report, January 2026","Turner & Townsend, 2025 Data Center Construction Cost Index (via Introl, February 2026)","MarketsandMarkets, APAC Data Center Colocation Market Report, March 2026","Grand View Research, Asia Pacific Data Center Market Report, May 2025","GMI Research, APAC Data Center Construction Market Report, May 2025","Next Move Strategy Consulting, Asia-Pacific Data Center Market Report, January 2026","NEC Corporation FY2025 Earnings Release and FY2026 Guidance (year ended March 2025)","IDC, Asia/Pacific Cloud Adoption Survey, October 2024","Goldman Sachs, Hyperscaler CapEx Analysis (via Yahoo Finance), June 2026","KWM / Data Center Dynamics, Singapore DC-CFA2 and Jurong Island Analysis, December 2024 – May 2026","TechWire Asia, Malaysia Data Center Market Analysis, March 2026","Moody's, APAC Data Center Market Report, July 2024 (flagged as ~24 months old)"]},"estimated":true},"C4":{"quality":68,"dims":{"Coverage":77,"Accuracy":56,"Depth":80,"Coherence":70,"Citation Quality":67,"Presentation Readiness":52},"totalTokens":341079,"inputTokens":294932,"outputTokens":45556,"searchCount":25,"latencyMs":750914,"stages":[{"key":"planning","inTok":449,"outTok":5800,"totTok":6255,"search":null,"providerModel":""},{"key":"acquisition","inTok":110256,"outTok":15082,"totTok":125589,"search":20,"providerModel":""},{"key":"analysis","inTok":78674,"outTok":13291,"totTok":92821,"search":6,"providerModel":""},{"key":"synthesis","inTok":30414,"outTok":3282,"totTok":33721,"search":null,"providerModel":""},{"key":"presentation","inTok":32455,"outTok":1626,"totTok":34093,"search":null,"providerModel":""},{"key":"evaluation","inTok":33802,"outTok":6259,"totTok":40050,"search":null,"providerModel":""}],"deck":{"headline":{"value":"$70-75B","label":"NEC's real addressable APAC DC market (ex-China, 2024) — ~30% below the headline figure"},"unit":"USD B","chart":[{"year":"2024","v":102},{"year":"2030","v":175}],"stats":[{"k":"CAGR 24-30 (total APAC)","v":"~9-14%"},{"k":"China share of APAC power capacity","v":"~53%"},{"k":"AI share of incremental CapEx 25-30","v":"~80-90%"},{"k":"APAC subsea SAM 2026 (NEC-relevant)","v":"~$6B/yr"}],"findings":["APAC total DC market is ~US$100-105bn in 2024 [A/E] rising to ~US$150-175bn by 2030 [F], a ~9-14% CAGR; the wide band reflects genuine definitional spread across Arizton (US$102bn 2024 to US$175bn 2030, 9.31% CAGR), Grand View (~US$150bn by 2030, 13.2% CAGR) and Next Move (US$151bn by 2030, 14.07% CAGR).","China commands ~53% of APAC power capacity (Arizton, Mar 2026) and ~US$26-29bn of standalone market (Mordor, 2025) but is structurally closed to NEC, leaving a derived APAC-ex-China TAM of ~US$70-75bn in 2024 — the real ceiling for NEC capital allocation (Low confidence, cross-house subtraction).","Roughly 80-90% of incremental APAC DC CapEx 2025-2030 is AI/accelerated-compute, a layer NEC cannot profitably enter: IEA (2025) shows accelerated-server electricity growing 30%/yr vs. 9%/yr conventional, while NVIDIA captures ~57 cents of every US$1 spent (Q1 FY2027, up from 39 cents four quarters prior).","Operational capacity ranks China 4.6 GW > Japan 1.5 GW > Australia 1.3 GW = India 1.3 GW > Singapore 1.0 GW (Cushman & Wakefield, H1 2025); APAC operational capacity is set to roughly double from ~14 GW (H2 2025) to ~24 GW by 2030 (C&W).","NEC's defensible position is subsea systems — an APAC communications-subsea SAM of ~US$6bn/yr in 2026 growing ~12%/yr (Mordor + 38.6% APAC share) — but the business is currently loss-making (¥10bn one-off expense H1 FY2026), and NEC's ¥100bn / ~US$636m FY26-30 commitment (incl. up to five vessels) is margin-defensive vertical integration, not growth capital."],"sources":["Cushman & Wakefield, Asia Pacific Data Centre Update, H1 2025 & H2 2025 (capacity by status)","Arizton, APAC Data Center Market / Construction Market, Mar 2026 (investment, China power-capacity share)","Grand View Research, May 2025 & Next Move Strategy, Feb 2026 (APAC market size & CAGR)","Mordor Intelligence, China DC Market (Jan 2026) & Submarine Cable Systems (Jan 2026)","IEA, Energy & AI / Electricity 2025 (accelerated vs. conventional server demand, country TWh additions)","TrendForce, AI server outlook, Jan/Oct 2025 & Jan 2026 (AI-server value share, CSP CapEx)","NVIDIA Q1 FY2027 disclosure via AL Capital, May 2026 (capture rate)","Goldman Sachs, Jun 2026 (China vs. US hyperscaler CapEx ratio)","Dell'Oro Group, Mar 2026 & BNEF, Mar 2026 (global DC CapEx control totals)","TeleGeography, Dec 2025 (subsea investment trajectory)","NEC Corporation FY2025 results & integrated disclosures, 2026 (segment revenue, subsea expense, ¥100bn investment)","AEMO / Oxford Economics, 2025 (Australia phantom-demand: 44 GW requests vs. ~6 GW realized)"]},"estimated":true}}};
const PRICE = { Opus:{in:5,out:25}, "GPT-5.5":{in:5,out:30}, Sonnet:{in:3,out:15}, "Gemini Flash":{in:1.5,out:9} }; // USD / 1M tokens, list
const PROVIDER = { Opus:"anthropic", "GPT-5.5":"openai", Sonnet:"anthropic", "Gemini Flash":"google" };
const SEARCH_FEE = { anthropic:0.01, openai:0.01, google:0.035 }; // USD per search, list

function computeOrch(orch, topic) {
  const rd = RUN_DATA[topic.id][orch.id];
  const stages = STAGES.map((st, i) => {
    const mKey = orch.seq[i];
    const m = MODELS[mKey];
    const rs = (rd.stages || []).find((x) => x.key === st.key) || { inTok: 0, outTok: 0, totTok: 0, search: 0 };
    const pr = PRICE[mKey], prov = PROVIDER[mKey];
    const cost = (rs.inTok * pr.in + rs.outTok * pr.out) / 1e6 + (rs.search || 0) * SEARCH_FEE[prov];
    return { ...st, modelKey: mKey, model: m, tokens: rs.totTok, inTok: rs.inTok, outTok: rs.outTok, search: rs.search || 0, cost };
  });
  const totalTokens = rd.totalTokens;
  const costPerRun = stages.reduce((a, x) => a + x.cost, 0);
  const runtimeSec = (rd.latencyMs || 0) / 1000;
  const quality = rd.quality;
  const radar = RADAR_AXES.map((a) => ({ axis: a.axis, value: Math.round(rd.dims[a.axis] != null ? rd.dims[a.axis] : quality) }));
  return { ...orch, stages, totalTokens, costPerRun, runtimeSec, quality, radar, deck: rd.deck, estimated: !!rd.estimated, searchCount: rd.searchCount };
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
                <div style={{ fontSize: 9, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>Cost vs C1</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                  <div style={{ width: 56, height: 6, borderRadius: 3, background: L.hair2, overflow: "hidden" }}>
                    <span style={{ display: "block", height: "100%", width: `${(o.costPerRun / maxCost) * 100}%`, background: A_LIGHT }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: L.muted }}>{Math.round((o.costPerRun / maxCost) * 100)}%</span>
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
function VisualPipeline({ pipeline, onStageClick, neutral = false }) {
  const NEUTRAL = "#0891b2";
  return (
    <div className="pipeflow">
      {pipeline.stages.map((s, i) => {
        const mc = neutral ? NEUTRAL : s.model.cL;
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
              {neutral ? (
                <div style={{ fontSize: 11.5, color: L.muted, lineHeight: 1.4 }}>{s.load}</div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: mc, boxShadow: `0 0 7px ${mc}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: mc }}>{s.model.label}</span>
                </div>
              )}
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

/* the model fleet (Section 03) — the players, before we route them */
function ModelFleet({ detailed }) {
  const fleet = [
    { key: "Opus", price: "$5 / $25", note: "Deep reasoning, judgment, final review." },
    { key: "GPT-5.5", price: "$5 / $30", note: "Frontier alternative; the cross-vendor baseline." },
    { key: "Sonnet", price: "$3 / $15", note: "Capable mid-tier for lighter authoring." },
    { key: "Gemini Flash", price: "$1.50 / $9", note: "Fast, economical execution and retrieval." },
  ];
  const maxRate = Math.max(...fleet.map((f) => MODELS[f.key].rate));
  return (
    <div className="fleet-grid">
      {fleet.map((f) => {
        const m = MODELS[f.key];
        return (
          <div key={f.key} style={glassL({ padding: 0, overflow: "hidden", height: "100%" })}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${m.cL}, transparent)` }} />
            <div style={{ padding: "18px 18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10.5, color: m.cL, border: `1px solid ${m.cL}`, borderRadius: 999, padding: "2px 9px", fontWeight: 600 }}>{m.tier}</span>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: m.cL, boxShadow: `0 0 8px ${m.cL}` }} />
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 600, margin: "12px 0 10px", color: L.text }}>{m.label}</h3>
              {detailed && <p style={{ fontSize: 12.5, color: L.muted, lineHeight: 1.45, margin: "0 0 14px", minHeight: 36 }}>{f.note}</p>}
              <div style={{ fontSize: 10, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>List price · per 1M tokens (in / out)</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: L.text, marginTop: 3 }}>{f.price}</div>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 9.5, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                <span>Relative cost</span><span>Quality /100</span>
              </div>
              <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: L.hair2, overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: `${(m.rate / maxRate) * 100}%`, background: A_LIGHT }} />
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#0d9488" }}>{m.quality}</span>
              </div>
            </div>
          </div>
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
function Presentation({ deck, accent, idKey }) {
  const p = deck, a = accent;
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
                  <linearGradient id={"grad" + idKey} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={a} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={a} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fill: L.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: L.faint, fontSize: 11 }} axisLine={false} tickLine={false} width={38} />
                <Tooltip contentStyle={{ background: "#fff", border: `1px solid ${L.hair}`, borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => [v + " " + (p.unit || ""), "Value"]} cursor={{ stroke: a, strokeOpacity: 0.3 }} />
                <Area type="monotone" dataKey="v" stroke={a} strokeWidth={2.5} fill={"url(#grad" + idKey + ")"} />
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

        {!focused && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>The research mandate — one per experiment (the rest of the prompt is identical across all three)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MASTER_PROMPTS.mandates.map((m) => (
                <div key={m.id} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "10px 13px", borderRadius: 10, background: "rgba(20,20,40,0.025)", border: `1px solid ${L.hair2}` }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#0891b2", flexShrink: 0, paddingTop: 1 }}>{m.id}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: L.text }}>{m.short}</div>
                    <div style={{ fontSize: 12.5, color: L.muted, lineHeight: 1.5, marginTop: 1 }}>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
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
  const [promptPipeline, setPromptPipeline] = useState(null);
  const [mode, setMode] = useState("present");   // "present" = crisp CEO view, "sales" = detailed
  const detailed = mode === "sales";
  const openStagePrompt = (key, pipe = null) => { setFocusKey(key); setPromptPipeline(pipe); setPromptOpen(true); };
  const openFullPrompt = (pipe = null) => { setFocusKey(null); setPromptPipeline(pipe); setPromptOpen(true); };

  /* every (topic, strategy) precomputed */
  const byTopic = useMemo(() => {
    const m = {};
    TOPICS.forEach((t) => { m[t.id] = {}; ORCH.forEach((o) => { m[t.id][o.id] = computeOrch(o, t); }); });
    return m;
  }, []);

  const computedPrimary = ORCH.map((o) => byTopic[selectedTopicId][o.id]); // cards reflect the selected experiment
  const selPipeline = byTopic.T1[selectedId];               // pipeline shown at base complexity
  const topic = TOPICS.find((t) => t.id === selectedTopicId);
  const selRun = byTopic[selectedTopicId][selectedId];      // the actual run shown in section 04

  /* scale economics follow from the SELECTED research run + strategy */
  const c1Run = byTopic[selectedTopicId]["C1"];               // baseline = costliest (all-Opus)
  const savingsPerRun = Math.max(0, c1Run.costPerRun - selRun.costPerRun);
  const savingPct = c1Run.costPerRun > 0 ? Math.round((savingsPerRun / c1Run.costPerRun) * 100) : 0;
  const annualRuns = employees * tasksPerDay * 365;
  const annualCost = annualRuns * selRun.costPerRun;
  const savings = annualRuns * savingsPerRun;                 // vs C1

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
          <Reveal delay={0.2}>
            <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 18, padding: "16px 24px", borderRadius: 16, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)" }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(30px,3.4vw,44px)", lineHeight: 1, background: A_DARK, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", whiteSpace: "nowrap" }}>20–40%</span>
              <span style={{ color: D.muted, fontSize: 14.5, lineHeight: 1.45, maxWidth: 360 }}>
                lower cost per research run — at the same research quality as all-frontier routing, with tiered model orchestration.
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: "10px 26px", fontSize: 13, color: D.faint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
              <span>3 experiments</span><span>·</span><span>6 orchestrators</span><span>·</span><span>4 models · Opus 4.8 / GPT-5.5 / Sonnet 4.6 / Gemini Flash 3.5</span>
            </div>
          </Reveal>
        </div>
        <div className="hero-fade" />
      </header>

      {/* ================= LIGHT BODY ================= */}
      <main style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>

        {/* SECTION 01 — THE RESEARCH PIPELINE (stages, model-neutral) */}
        <Section index="01" kicker="The Research Pipeline" title="How a research run works"
          sub={detailed
            ? "Every research run — whatever the topic — moves through the same six stages, left to right. Click any stage to read the exact brief it's given. Which model runs each stage is set later, by the orchestration strategy."
            : "Every run moves through the same six stages. Click any stage to see its brief."}>
          <Reveal>
            <div style={glassL({ padding: "22px 24px 20px" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: L.text }}>Six stages, start to finish</span>
                <button onClick={() => openFullPrompt()} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 999, cursor: "pointer",
                  fontSize: 12.5, fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.3)",
                }}><span style={{ fontSize: 14 }}>⌕</span> View full master prompt</button>
              </div>
              <VisualPipeline pipeline={selPipeline} onStageClick={(k) => openStagePrompt(k)} neutral />
              {detailed && (
                <div style={{ marginTop: 14, fontSize: 12, color: L.faint, lineHeight: 1.5 }}>
                  Click any stage to see the exact instruction it receives. <strong style={{ color: "#0891b2" }}>Live search</strong> stages query the web during the run; <strong style={{ color: "#ea580c" }}>+ render</strong> means the platform turns the authored text into the deck deterministically (~0 model tokens).
                </div>
              )}
            </div>
          </Reveal>
        </Section>

        {/* SECTION 02 — THE MODELS */}
        <Section index="02" kicker="The Models" title="Four models, three tiers"
          sub={detailed
            ? "The models in play, by capability tier and list price. The orchestrator you pick next decides which of these runs each stage of the pipeline."
            : "The models in play, by tier and price."}>
          <Reveal>
            <ModelFleet detailed={detailed} />
          </Reveal>
        </Section>

        {/* SECTION 03 — THE RESEARCH RUN (pick topic + orchestrator → that run's deck, cost, saving) */}
        <Section index="03" kicker="The Research Run" title="Pick a question and an orchestrator"
          sub={detailed
            ? "Choose a research question, then an orchestrator. Each pairing is a distinct run with its own deck, quality, cost, and saving versus the all-Opus baseline (C1). Everything below is that exact run."
            : "Choose a research question, then an orchestrator. Everything below is that exact run."}>

          {/* selector 1 — research */}
          <Reveal>
            <div style={{ marginBottom: 8, fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>1 · Research question</div>
            <div style={{ marginBottom: 26, display: "flex", flexWrap: "wrap", gap: 8 }}>
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
          </Reveal>

          {/* selector 2 — orchestrator */}
          <Reveal>
            <div style={{ marginBottom: 10, fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>2 · Orchestrator</div>
            <StrategyCards computed={computedPrimary} selectedId={selectedId} onSelect={setSelectedId} recommendedId="C3" detailed={detailed} />
          </Reveal>

          {/* the run: models → result → quality & economics, all for (topic × orchestrator) */}
          <Reveal key={selectedTopicId + selectedId}>
            <div style={glassL({ padding: "26px 28px", overflow: "hidden", marginTop: 26 })}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, color: "#0d9488", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d9488", boxShadow: "0 0 8px #0d9488" }} />Run complete
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", margin: "8px 0 4px", color: L.text }}>{topic.name}</h3>
                  <div style={{ fontSize: 13.5, color: L.muted }}>{selRun.id} · {selRun.name}</div>
                  {selRun.estimated && <div style={{ marginTop: 6, display: "inline-block", fontSize: 10.5, color: "#ea580c", background: "rgba(234,88,12,0.08)", border: "1px solid rgba(234,88,12,0.3)", borderRadius: 999, padding: "2px 9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>ESTIMATED · imputed from completed runs</div>}
                </div>
                <button onClick={() => openFullPrompt(selRun)} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 999, cursor: "pointer",
                  fontSize: 12.5, fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.3)",
                }}><span style={{ fontSize: 14 }}>⌕</span> View master prompt</button>
              </div>

              {/* 3 · models per stage */}
              <div style={{ marginTop: 26 }}>
                <div style={{ fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginBottom: 12 }}>3 · Models per stage</div>
                <VisualPipeline pipeline={selRun} onStageClick={(k) => openStagePrompt(k, selRun)} />
              </div>

              {/* 4 · the result (deck) [+ token bars in sales] */}
              <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${L.hair2}` }}>
                <div style={{ fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginBottom: 14 }}>4 · The result</div>
                <div style={{ fontSize: 11.5, color: L.muted, marginBottom: 16 }}>
                  {selRun.name}'s deck for {topic.short}{selRun.estimated ? " — this run did not complete; metrics are estimated from the other runs and the deck shown is a representative run for this experiment" : ""}.
                </div>
                <div className="run-body" style={{ gridTemplateColumns: detailed ? undefined : "1fr" }}>
                  {detailed && (
                    <div style={{ paddingRight: 8 }}>
                      <div style={{ fontSize: 11, color: L.faint, textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Token usage per stage</div>
                      <TokenBars run={selRun} />
                    </div>
                  )}
                  <div style={detailed ? { borderLeft: `1px solid ${L.hair2}`, paddingLeft: 26 } : {}} className={detailed ? "pres-wrap" : ""}>
                    <Presentation deck={selRun.deck} accent={topic.accent} idKey={selectedTopicId + selectedId} />
                  </div>
                </div>
              </div>

              {/* 5 · quality & economics (incl. scale) */}
              <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${L.hair2}` }}>
                <div style={{ fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.13em", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginBottom: 14 }}>5 · Quality &amp; economics</div>
                <div className="outcome-grid">
                  <button onClick={() => setModalOpen(true)} className="quality-chip" title="See how quality is assessed">
                    <div style={{ fontSize: 10, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>Quality ⓘ</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 600, color: "#0d9488", lineHeight: 1, marginTop: 4 }}>{selRun.quality.toFixed(1)}</div>
                    <div style={{ fontSize: 10.5, color: "#0891b2", marginTop: 4 }}>how it's scored →</div>
                  </button>
                  {[
                    ["Cost / Run", fmtUSD(selRun.costPerRun, 2)],
                    ["Saving vs C1", selectedId === "C1" ? "— baseline" : `${fmtUSD(savingsPerRun, 2)} (${savingPct}%)`],
                    ["Total Tokens", fmtTok(selRun.totalTokens)],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(20,20,40,0.025)", border: `1px solid ${L.hair2}` }}>
                      <div style={{ fontSize: 10, color: L.faint, textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 600, lineHeight: 1, marginTop: 6,
                        background: A_LIGHT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* at enterprise scale */}
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: L.text, marginBottom: 4 }}>At enterprise scale</div>
                  <div style={{ fontSize: 12.5, color: L.muted, marginBottom: 16 }}>The same run, every working day across the workforce — extrapolated from this run, saving vs the C1 all-Opus baseline.</div>
                  <div style={glassL({ padding: "22px 24px", marginBottom: 16 })}>
                    <div className="play-grid">
                      <Slider label="Employees" value={employees} min={1000} max={30000} step={1000} onChange={setEmployees} fmt={fmtInt} accent="linear-gradient(90deg,#0891b2,#7c3aed)" />
                      <Slider label="Tasks Per Employee / Day" value={tasksPerDay} min={1} max={10} step={1} onChange={setTasksPerDay} fmt={(v) => v} accent="linear-gradient(90deg,#7c3aed,#ea580c)" />
                    </div>
                  </div>
                  <div className="scale-grid">
                    {[
                      { k: "Annual Runs", v: annualRuns, accent: A_LIGHT },
                      { k: "Annual Cost", v: annualCost, prefix: "$", accent: "linear-gradient(90deg,#ea580c,#7c3aed)", note: selectedId === "C1" ? "C1 baseline — costliest" : `${savingPct}% lower than C1` },
                      { k: "Annual Saving vs C1", v: savings, prefix: "$", accent: "linear-gradient(90deg,#0d9488,#0891b2)", note: selectedId === "C1" ? "— baseline" : `${savingPct}% of the C1 bill` },
                    ].map((m, i) => (
                      <Reveal key={m.k} delay={i * 0.05}>
                        <div style={glassL({ padding: "24px 24px 22px", height: "100%" })}>
                          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: L.muted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>{m.k}</div>
                          <div style={{ fontSize: "clamp(26px,3vw,40px)", lineHeight: 1 }}>
                            <ScaleNumber value={m.v} prefix={m.prefix || ""} decimals={m.decimals || 0} accent={m.accent} />
                          </div>
                          {m.note && <div style={{ fontSize: 11.5, color: L.faint, marginTop: 11 }}>{m.note}</div>}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  {detailed && (
                    <div style={{ marginTop: 16, fontSize: 12.5, color: L.faint, lineHeight: 1.55, maxWidth: 820 }}>
                      How this is computed: each employee runs the six-stage task <strong style={{ color: L.muted }}>{fmtInt(tasksPerDay)}</strong>×/day, 365 days, on {topic.short} under orchestrator {selRun.id}. Saving compares against the C1 all-Opus baseline on the same workload. Token and pricing figures are illustrative until the live harness numbers replace them.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </Section>

        <footer style={{ borderTop: `1px solid ${L.hair2}`, margin: "70px 0 0", padding: "30px 0 70px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 12, color: L.faint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>ENTERPRISE RESEARCH ECONOMICS · SCENARIO MODEL</span>
          <span style={{ fontSize: 12, color: L.faint, maxWidth: 560, lineHeight: 1.5 }}>
            Token, search, and quality figures are measured from live research runs (judge: GPT-5.5). Cost is computed from those measured tokens and searches at current provider list prices. Market figures and sources come from each run output. 3 of the 18 runs did not complete and are estimated from the others, and marked as such.
          </span>
        </footer>
      </main>

      <QualityModal open={modalOpen} onClose={() => setModalOpen(false)} run={selRun} topic={topic} />
      <MasterPromptModal open={promptOpen} onClose={() => setPromptOpen(false)} focusKey={focusKey} pipeline={promptPipeline} />
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
.fleet-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; align-items: stretch; }
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
  .fleet-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 620px) {
  .timeline, .scale-grid, .outcome-grid { grid-template-columns: 1fr; }
  .pres-stats, .pres-findings { grid-template-columns: 1fr; }
  .weight-row { grid-template-columns: repeat(3, 1fr); row-gap: 16px; }
  .strat-grid { grid-template-columns: 1fr; }
  .fleet-grid { grid-template-columns: 1fr; }
  .pipeflow { flex-direction: column; }
  .pipearrow { flex-basis: 22px; transform: rotate(90deg); }
  .pipenode { min-width: 0; }
}
@media (prefers-reduced-motion: reduce) { .blob, .relay-pulse { animation: none !important; } }
`;
