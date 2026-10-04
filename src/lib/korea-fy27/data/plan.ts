import type { Figure, Lever, Motion, TopAccountRow } from "../types";

/** The headline economics (slides 1, 3, 4, 9, 12). $M. */
export const headline = {
  fy26Ai: 226,
  fy27Plan: 900,
  growth: 675,
  multipleLabel: "~4x",
  gcpFY25: 316,
  gcpFY26: 534,
  aiFY25: 50,
  aiAddedFY26: 175,
  aiShareOfGcpGrowthStated: 81,
  marketFY26: 1300,
  marketFY27: 2600,
  marketMultiple: 2,
  shareFY26: 17,
  shareFY27: 34,
  shareMultiple: 2,
  accounts: 816,
  cohorts: 8,
  segments: 4,
  motions: 3,
  plays: 6,
  oneLiner: "FY26 proved the demand. FY27 must prove we can grow beyond Samsung and existing accounts.",
  insight: "Demand is not our constraint. Coverage, conversion and stickiness are.",
  fy26Definition: "FY26 = year to date (to 25 Sep) + last-7-days run-rate × 97 days. FY25 = actuals.",
  marketDefinition:
    "Market = Korea AI wallet: frontier-model tokens (any vendor) + enterprise AI seats. Excludes GPU / infrastructure, SI services and consumer subscriptions. Outside-in estimate, mid-points of ranges.",
};

/** The four facts that open the story (slide 3 "Where we are"; slide 2 outline). */
export const facts: (Figure & { headline: string; detail: string })[] = [
  {
    label: "AI is the growth engine",
    headline: "~81%",
    value: "~81%",
    detail: "of FY26 GCP growth came from AI. GCP grew $316M → $534M; AI grew $50M → $226M.",
    basis: "stated",
    src: { part: "main", slides: "3" },
  },
  {
    label: "Growth came from existing accounts",
    headline: "99%",
    value: "99%",
    detail: "of AI growth came from accounts already on AI. New logos contributed ~3%.",
    basis: "stated",
    src: { part: "main", slides: "3, 9" },
  },
  {
    label: "Revenue is concentrated",
    headline: "52%",
    value: "52%",
    detail: "of FY26 growth came from Samsung alone. 10 accounts are 81% of Digital Native AI.",
    basis: "stated",
    src: { part: "main", slides: "3, 9" },
  },
  {
    label: "We are under-indexed",
    headline: "17%",
    value: "17%",
    detail: "share of Korea's AI wallet. Directional intel puts Anthropic at ~$700M in Korea enterprise AI spend, ~3x our $226M.",
    basis: "stated",
    src: { part: "main", slides: "3, 7" },
  },
];

export const fragility = {
  text: "Fragile: model workloads are portable and consumer AI apps churn fast. AutoEver's Claude workload moved to AWS Bedrock (~$2M run-rate vs $13.4M FY26); BabeChat −85% year on year.",
  src: { part: "main" as const, slides: "3" },
};

/** Given · Commit · Stretch · Upside (slide 3, slide 92). */
export const ladder = {
  given: {
    value: 305,
    label: "Given",
    name: "Organic floor (+35%)",
    detail: "FY26 $226M × 1.35 market growth. Covers only ~1/3 of ~$900M.",
  },
  commit: {
    value: 725,
    range: [650, 805] as [number, number],
    multipleRange: "2.9–3.6x",
    label: "Commit",
    name: "Base case",
    detail: "8 cohorts at bridge midpoints across Deepen, Penetrate and Acquire. Range $650–805M.",
  },
  stretch: {
    value: 175,
    label: "Stretch",
    name: "Eight levers",
    detail: "Takes the base case to ~$900M. Half comes from Samsung beyond the cap (+$50M) and take-outs (+$37M).",
  },
  upside: {
    range: [100, 300] as [number, number],
    label: "Upside",
    name: "Whales (upside only)",
    detail: "2–6 GPU / TPU and model-training deals at ~$50M each. Outside the tokens + seats TAM and not needed for ~4x.",
  },
  src: { part: "main" as const, slides: "3, 92" },
};

/** Slide 49: what market growth alone buys, and what share gain must add. */
export const marketVsShare = {
  holdShare: 435,
  marketGrowth: 209,
  shareGain: 465,
  dnShareOfGain: 73,
  note: "\"Market growth\" = FY26 revenue × segment TAM growth (hold today's share). The rest is share gain.",
  src: { part: "A" as const, slides: "45, 49" },
};

/** Sensitivity inputs for the 2x × 2x equation (slides 44, 49). */
export const equationRanges = {
  marketFY26: 1325,
  tamFY27Range: [1845, 3460] as [number, number],
  shareAtPlanRange: [26, 49] as [number, number],
  marketGrowthRange: "1.6–2.2x by segment (net of token deflation)",
  src: { part: "A" as const, slides: "42, 44, 49" },
};

export const motions: Motion[] = [
  {
    id: "deepen",
    name: "Deepen",
    tagline: "Grow where we are already strong.",
    muscle: "Proven muscle",
    quadrant: "High AI spend with us · established on GCP",
    appliesTo: "Big existing AI spenders · Samsung",
    added: 277,
    sharePct: 41,
    fy26: 189,
    fy27: 467,
  },
  {
    id: "penetrate",
    name: "Penetrate",
    tagline: "Turn big GCP spend into AI.",
    muscle: "Under-built",
    quadrant: "Low AI spend with us · established on GCP",
    appliesTo: "Big GCP spenders with low AI · flagship conglomerates",
    added: 142,
    sharePct: 21,
    fy26: 21,
    fy27: 162,
  },
  {
    id: "acquire",
    name: "Acquire",
    tagline: "Win where we are absent.",
    muscle: "No engine",
    quadrant: "Any AI spend · new to GCP",
    appliesTo: "AI startups · traditional enterprises · mid-market · public sector & EDU",
    added: 257,
    sharePct: 38,
    fy26: 15,
    fy27: 272,
  },
];

export const motionMix = {
  fy26DeepenPct: 87,
  penetratePlusAcquirePct: 60,
  deepenPlusAcquirePct: 79,
  acquireSplit: [
    { label: "Already buying AI elsewhere", value: 193, who: "AI startups · Digital Native long tail" },
    { label: "New to AI", value: 64, who: "Traditional enterprises · mid-market · public sector & EDU" },
  ],
  note: "Last year one motion did the work. In FY27, Penetrate and Acquire must deliver ~60% of the growth.",
  src: { part: "main" as const, slides: "11, 91, 94" },
};

export const levers: Lever[] = [
  {
    num: 1,
    name: "Samsung beyond the +50% cap",
    value: 50,
    landsIn: [{ cohort: "samsung", value: 50 }],
    landsInLabel: "Samsung",
    mustBeTrue: "~2x FY26; ~1.7x today's ~$118M run-rate.",
  },
  {
    num: 2,
    name: "Big existing AI spenders to ~3.3x",
    value: 37,
    landsIn: [{ cohort: "big-ai", value: 37 }],
    landsInLabel: "Big existing AI spenders",
    mustBeTrue: "Wrtn off Bedrock; Coupang OpenAI / Anthropic take-outs.",
  },
  {
    num: 3,
    name: "Two more group-wide deals",
    value: 20,
    landsIn: [{ cohort: "flagship", value: 20 }],
    landsInLabel: "Flagship conglomerates",
    mustBeTrue: "Beyond LG, e.g. SK, Hyundai Motor or Lotte.",
  },
  {
    num: 4,
    name: "Organic growth, low-AI accounts",
    value: 20,
    landsIn: [{ cohort: "big-gcp", value: 20 }],
    landsInLabel: "Big GCP spenders, low AI",
    mustBeTrue: "Usage grows on top of the 50% AI mix in the base.",
  },
  {
    num: 5,
    name: "6–8 group seat deals",
    value: 13,
    landsIn: [{ cohort: "trad-ent", value: 13 }],
    landsInLabel: "Traditional enterprises",
    mustBeTrue: "The base case assumed 3–5 group seat deals.",
  },
  {
    num: 6,
    name: "Universities + national AI program",
    value: 15,
    landsIn: [{ cohort: "public", value: 15 }],
    landsInLabel: "Public sector & EDU",
    mustBeTrue: "30–40 universities + national AI program (모두의 AI).",
  },
  {
    num: 7,
    name: "Coding seats at DN platforms (new)",
    value: 10,
    landsIn: [
      { cohort: "big-ai", value: 5 },
      { cohort: "big-gcp", value: 5 },
    ],
    landsInLabel: "Two DN cohorts (+$5M each)",
    mustBeTrue: "Naver, Kakao, Coupang, Nexon and Krafton buy coding seats.",
  },
  {
    num: 8,
    name: "Partner-led long tail at 5x",
    value: 10,
    landsIn: [
      { cohort: "startups", value: 8 },
      { cohort: "mid-market", value: 2 },
    ],
    landsInLabel: "New logos long tail (+$8M) · Mid-market (+$2M)",
    mustBeTrue: "Partner-led accounts reach 5x FY26 AI (base case 3–4x).",
  },
];

export const leverNotes = {
  stated: { total: 175, samsungPlusBigAi: 87 },
  soWhat: "~4x needs no whales, but it needs all eight levers.",
  src: { part: "B" as const, slides: "92" },
};

/** Slide 14. $M, rounded as printed. */
export const topAccounts: { rows: TopAccountRow[]; stated: Record<string, number>; notes: string[]; prize: string; coverage: string; source: string } = {
  rows: [
    { motion: "deepen", segment: "dn", accounts: "WRTN, Coupang", count: 2, googleToday: 40, totalAiSpend: 145, googleSharePct: 28, anthropicOpenAi: 90, planBase: 62, planStretch: 112 },
    { motion: "deepen", segment: "ce", accounts: "Samsung", count: 1, googleToday: 99, totalAiSpend: 129, googleSharePct: 77, anthropicOpenAi: 30, planBase: 149, planStretch: 220 },
    { motion: "penetrate", segment: "dn", accounts: "Nexon, Krafton", count: 2, googleToday: 3.8, totalAiSpend: 48, googleSharePct: 8, anthropicOpenAi: 20, planBase: 13, planStretch: 13, footnotes: "³" },
    { motion: "penetrate", segment: "ce", accounts: "SK, Hyundai, CJ", count: 3, googleToday: 15, totalAiSpend: 191, googleSharePct: 8, anthropicOpenAi: 14, planBase: 38, planStretch: 76, footnotes: "¹ ²" },
    { motion: "acquire", segment: "dn", accounts: "Viva Republica (Toss)", count: 1, googleToday: 0.2, totalAiSpend: 4.2, googleSharePct: 5, anthropicOpenAi: 4.0, planBase: 1, planStretch: 3 },
    { motion: "acquire", segment: "ce", accounts: "POSCO, GS, KB Financial, Shinhan", count: 4, googleToday: 1.5, totalAiSpend: 2.1, googleSharePct: 70, anthropicOpenAi: 0.7, planBase: 12, planStretch: 19 },
  ],
  stated: {
    count: 13,
    googleToday: 160,
    totalAiSpend: 519,
    googleSharePct: 31,
    anthropicOpenAi: 158,
    planBase: 274,
    planStretch: 443,
    skGpu: 150,
    totalExSk: 369,
    shareExSk: 43,
    otherVendors: 344,
    otherVendorsInMarket: 194,
    anthropicLead: 150,
    krafton: 25,
    kraftonItemized: 9.8,
  },
  notes: [
    "¹ SK's $150M is on-premises GPUs, outside our market (tokens + seats).",
    "² Hyundai Motor Group + Hyundai GF, including Hyundai AutoEver, which our plan holds flat at $13.4M (account plan $26.8M base, $35.8M stretch).",
    "³ Krafton total entered as $25M vs $9.8M itemized. NCSoft is not in the tracker.",
  ],
  prize: "Biggest prize: ~$344M with other vendors (~$194M in our market), led by Anthropic at ~$150M.",
  coverage: "These 13 plans cover ~30–50% of the ~$900M plan; other cohort accounts and new logos must deliver the rest.",
  source: "Top Account Plan — FY27 Korea Cloud AI Master Intel & Spend Tracker (account teams, Oct 2026). Google AI today = FY26 projection or exit.",
};

/** What must be true (slide 3). */
export const mustBeTrue = [
  { title: "Commercial room in-market", detail: "Korea pricing guardrails agreed with FSM; remove or relax the Marketplace seller revenue recognition cap." },
  { title: "Korea GTM reality", detail: "Startups and groups covered direct; everything else partner-led." },
  { title: "One owner, one number", detail: "A named owner, $ target and quarterly run-rate KPI per cohort; revenue logic behind every hire." },
  { title: "Proof before scale", detail: "Commit-gated 4–6 week sprints; pilot → production tracked monthly." },
  { title: "Stickiness over tokens", detail: "Multi-year commits and platform depth (agents, data) so workloads cannot walk." },
];
