import type { CohortStaffing, Pod, ResourcingSnapshot } from "../types";

/**
 * Resourcing (slides 3, 12, 23, 24, 29, 97). The deck carries several
 * snapshots that do not agree; the site shows them side by side instead of
 * picking one.
 */
export const snapshots: ResourcingSnapshot[] = [
  {
    id: "current",
    name: "Current headcount",
    src: { part: "main", slides: "23" },
    aiSs: 9,
    aiCe: 10,
    fde: "14 (3 + 11 pool)",
    vcbd: 0,
    note: "10 AI CE = 6 cohort + 4 specialty pool (2 DN pool, 2 ENT pool).",
  },
  {
    id: "plan",
    name: "Plan allocation",
    src: { part: "main", slides: "12, 97" },
    aiSs: 12,
    aiCe: 10,
    fde: "14 (incl. pool of 11)",
    vcbd: null,
    note: "Team input, 1 Oct. 7 of the 12 AI SS sit on the three biggest cohorts.",
  },
  {
    id: "target",
    name: "Target with asks",
    src: { part: "main", slides: "3, 23, 24" },
    aiSs: 16,
    aiCe: 15,
    fde: "14 (3 anchor + 11 pool)",
    vcbd: 1,
    note: "The latest headline: the executive summary's \"named pod per cohort\". Slide 23 shows 15 dedicated AI CE and one AI SS as a strategic pursuit.",
  },
];

export const fdeModels = [
  { name: "3 anchor + 11 pool", where: "Slides 3, 12, 24, 29, 97", detail: "Named FDEs at Coupang (1) and Samsung (2), with a pool of 11 for sprints." },
  { name: "6 dedicated + 8 pool", where: "Slide 23", detail: "6 dedicated pod FDEs (2 DN · 2 Samsung · 2 ENT) + 8 commit-gated sprint FDEs." },
];

export const fdeConflict =
  "Both models total 14 FDEs but split them differently. The deck does not say which is final, so this site labels it a draft architecture conflict.";

/** Per-cohort staffing across the three snapshots (slides 12, 23, 24, 97). */
export const staffing: CohortStaffing[] = [
  { cohort: "big-ai", current: { aiSs: 2, aiCe: 1 }, plan: { aiSs: 3, aiCe: "1", fde: "1 + pool of 11" }, target: { aiSs: 3, aiCe: 3 } },
  { cohort: "big-gcp", current: { aiSs: 1, aiCe: 1 }, plan: { aiSs: 1, aiCe: "1", fde: "Pooled / partner" }, target: { aiSs: 2, aiCe: 2 } },
  { cohort: "startups", current: { aiSs: 1, aiCe: 1 }, plan: { aiSs: 3, aiCe: "3", fde: "Pooled (top 6)" }, target: { aiSs: 3, aiCe: 3 } },
  { cohort: "samsung", current: { aiSs: 1, aiCe: 1 }, plan: { aiSs: 1, aiCe: "2", fde: "2 dedicated" }, target: { aiSs: 2, aiCe: 2 } },
  { cohort: "flagship", current: { aiSs: 1, aiCe: 1 }, plan: { aiSs: 1, aiCe: "1", fde: "Partner FDEs" }, target: { aiSs: 2, aiCe: 2 } },
  { cohort: "trad-ent", current: { aiSs: 1, aiCe: 1 }, plan: { aiSs: 1, aiCe: "1", fde: "APAC FSI + local" }, target: { aiSs: 2, aiCe: 2 } },
  { cohort: "mid-market", current: { aiSs: 1, aiCe: 0 }, plan: { aiSs: 1, aiCe: "1", fde: "0 (partner-led)" }, target: { aiSs: 1, aiCe: null } },
  { cohort: "public", current: { aiSs: 1, aiCe: 0 }, plan: { aiSs: 1, aiCe: "Shared", fde: "0 (partner-led)" }, target: { aiSs: 1, aiCe: 1 } },
];

export const staffingNotes = [
  "Current: AI CE per cohort sums to 6; the other 4 sit in specialty pools (2 DN, 2 ENT).",
  "Plan: AI CE sums to 10; public sector shares the mid-market AI CE rather than adding one.",
  "Target: slide 24 gives the per-cohort split (16 / 15). Slide 23 shows AI startups with 2 AI SS plus 1 strategic-pursuit AI SS; the VC asks (slide 29) keep the startup pod at 3.",
  "Slides 23–24 also show FY27 adds that do not match the plan (e.g. Samsung +$78M, big GCP spenders +$100M). They look like a swapped working snapshot; this site uses the plan values. See the conflict log.",
];

export const pods: Pod[] = [
  {
    name: "DN specialty pod",
    makeup: "2 dedicated DN FDEs + 2 DN pool AI CEs",
    focus: "Coding and AI in products: repo bake-offs, Antigravity adoption, API gateway migrations; owns DN EAP onboarding.",
    cohorts: "Big existing AI spenders · AI startups · big GCP spenders",
  },
  {
    name: "Samsung & ENT pods",
    makeup: "4 dedicated FDEs (2 Samsung · 2 ENT) + 2 ENT pool CEs",
    focus: "Agent use cases and Gemini Enterprise: custom connectors, domain RAG, agents and seat activation; enterprise EAP.",
    cohorts: "Samsung · flagship conglomerates · traditional enterprises",
  },
  {
    name: "Agile sprint pool & partner factory",
    makeup: "8 commit-gated sprint FDEs + partners",
    focus: "Time-boxed sprints (4–8 weeks on slide 23; 4–6 weeks elsewhere) gated by signed commits: Live Agent, GenMedia, Security and burst migrations. Public and mid-market are 100% partner-led via MSPs and group SIs.",
    cohorts: "All cohorts on demand · mid-market and public sector via partners",
  },
  {
    name: "Specialty pods",
    makeup: "Live Agent & GenMedia (2 AI CE + FDE lead) · Security (1 AI CE + security FDE to be hired + Mandiant)",
    focus: "Strike teams for voice / media launches; CISO gate-clearing and CodeMender.",
    cohorts: "Gaming / media DN, telco / retail, Samsung · flagships, financial services",
  },
];

export const ecosystem = [
  { group: "Investors", names: "Altos, KT (CVC), Samsung Ventures" },
  { group: "Managed-service partners", names: "Megazone, Bespin" },
  { group: "Group IT arms", names: "Samsung SDS, LG CNS, SK AX, CJ OliveNetworks, Lotte Innovate, POSCO DX, AutoEver" },
  { group: "AI boutique partners", names: "To recruit (mid-market)" },
  { group: "Cross-Google", names: "Google Play (AI app intros, gaming co-sell)" },
];

export const modelMotions = {
  keep: "Tokenomics, third-party models, GenMedia, Voice",
  build: "AI Security & Model Armor, group-wide conglomerate platforms",
};

/** VC / CVC engine for the AI-startup cohort (slides 27–30, 109–111). */
export const vc = {
  headline: "Investors become a channel, not a contact list.",
  vcLed: 114,
  vcLedParts: [
    { label: "~50 Series A–C scaleups through VC clinics", value: 90 },
    { label: "1K+ logos via the investor / partner program", value: 24 },
  ],
  vcLedPctStated: 59,
  partners: { live: 2, goal: 5, label: "Altos live, KT kicked off · Samsung Ventures + 2 more by Q1 · 3 signed by Q1" },
  why: [
    { title: "The new-logo gap", detail: "FY26 added +$175M of AI, 99% from existing accounts; 167 new logos added $0.8M." },
    { title: "Timing", detail: "Breakouts pick a cloud by Series B; 85%+ of Korean rounds are led by domestic GPs." },
    { title: "Concentration", detail: "82 scaleups ($50M+ raised) hold 67% of the $23.7B raised since 2021, so a few investors see most of the pipeline." },
  ],
  flow: ["Partner portfolio", "Curated targets", "Office hours", "Funded diagnostic", "POC", "First paid spend"],
  flowNote: "Blue steps are partner-led; navy steps are where Google Cloud converts.",
  plays: [
    { title: "Deal-flow sharing", detail: "Monthly portfolio sync into SFDC; a named AI SS per logo." },
    { title: "AI CE / FDE office hours", detail: "Monthly at partner HQ; 1:N themes → 1:1 funded Tokenomics diagnostic." },
    { title: "Partner offer", detail: "Fast-track credits + Google Play / YouTube intros." },
    { title: "Ownership", detail: "VC-sourced logos stay with the startup pod, whatever the DN / CORP coding." },
  ],
  investors: [
    {
      name: "Altos · Series A–B VC",
      status: "Live",
      points: [
        "7th Korea fund ~$400M; ~90 Korean portfolio companies. AWS already assigns an investment manager.",
        "Weeks 1–2: Altos narrows to 50–60 AI-heavy targets + a C-level survey.",
        "1:1 funded diagnostics for top portfolio companies (e.g. Toss, Socar, Scatter Lab).",
        "1:N workshops at Altos HQ + monthly FDE office hours.",
      ],
    },
    {
      name: "KT · CVC",
      status: "Kick-off",
      points: [
        "Strategic CVC tied to KT's AI, B2B and media businesses [to confirm].",
        "Screen the AI / B2B portfolio → joint office hours + demo day.",
        "Co-sell: portfolio solutions on Google Cloud → KT enterprise customers.",
        "Lead with model choice (KT has an AI tie-up with Microsoft).",
      ],
    },
  ],
  funnel: [
    { tier: "6 in flight · breakout ($10M+ exit)", value: 60, basis: "stated" as const },
    { tier: "10 accelerating ($5–10M)", value: 50, basis: "stated" as const },
    { tier: "40 scaling ($1–5M)", value: 40, basis: "estimate" as const },
    { tier: "1K+ VC / partner-led program", value: 24, basis: "estimate" as const },
    { tier: "194-account long tail (~5x via partners)", value: 29, basis: "stated" as const },
  ],
  funnelStated: { named: 174, total: 203 },
  funnelToday:
    "Today: 1 Korea account at $5–10M AI and 10 at $1–5M; FY26 new logos added only $0.8M. 44 accounts moved from <$100K to $100K–1M in FY26.",
  tier1: "23 Tier-1 targets: 7 companions · 8 search & edu · 5 enterprise agents · 3 GenMedia. 9 already show Google AI spend; 2 have no Vector account.",
  capital: [
    { mv: "Consumer AI & companions", funded: "2 → 3", multiple: "1.5x", usd: 126, tier1: 7 },
    { mv: "Search, edu & productivity", funded: "4 → 8", multiple: "2.0x", usd: 35, tier1: 8 },
    { mv: "Enterprise agents & SaaS", funded: "36 → 60", multiple: "1.7x", usd: 221, tier1: 5 },
    { mv: "GenMedia, voice & localization", funded: "8 → 17", multiple: "2.1x", usd: 51, tier1: 3 },
  ],
  capitalNote: "Companies funded Jan–Aug 2025 → 2026 in the four double-down micro-verticals: 50 → 88 (1.8x); ~$433M of 2026 funding (est.). Deep tech (side focus) takes ~76% of 2026 dollars but buys infrastructure, not tokens.",
  benchmark: {
    columns: ["", "AWS Korea", "Microsoft Korea", "Google Cloud Korea"],
    rows: [
      ["Org model", "Startups = global vertical; fast decisions", "Korea DN under Asia DN (China-led)", "No dedicated startup team"],
      ["Headcount", "~40: 8 AM, 4 CSR, 8 SA, 4 investment managers, 2 PDM, 1 marketing", "DN pod: CSA, specialist, AE, ATS", "Cohort plan: 3 AI SS, 3 AI CE"],
      ["VC channel", "A manager per tier-1 VC (Altos, KB, Kakao Ventures, SoftBank, KIP)", "MfS + Corp BD equity tied to Azure commits", "0 VCBD; Altos, KT via AI SS"],
      ["Commercial levers", "VC-granted credits $25K–$200K; migration funding", "Larger credit packages; equity-for-commit", "GFS credits only"],
      ["GenAI motion", "2 GenAI AMs; GPU deals → Bedrock pull-through", "Azure OpenAI; weakened by OpenAI–Kakao tie-up", "Model choice (Gemini, Claude, 200+); Tokenomics"],
      ["Scale / result", "Startup ARR $200M+ (8–9% of AWS Korea)", "DN AI ~$0.5M (Wrtn declining)", "New logos added $0.8M in FY26"],
    ],
    implication: "Match AWS on VC coverage and speed of credits, not on GPU discounts. Win on model choice, Tokenomics and cross-Google GTM.",
    soWhat: "AWS wins on organization, not on product. A named pod + VCBD closes the coverage gap.",
    note: "Competitor figures are field estimates: AWS Korea Startup Organization & AI Strategy Summary (Sep 2026); Microsoft Korea DN & Gaming AI status (Oct 2026).",
  },
  plan90: [
    { month: "October", items: ["Altos: 50–60 targets + C-level survey live", "KT: kick-off and portfolio screen", "Office-hour themes set"] },
    { month: "November", items: ["First monthly office hours at Altos HQ", "5 funded Tokenomics diagnostics", "Pipeline in SFDC with AI SS owners"] },
    { month: "December", items: ["Samsung Ventures + 2 investors in talks", "First POC → commit conversions", "FY27 KPI baseline + QBR cadence"] },
  ],
  status: "Status, Q4 '26: Altos sprint live · KT kicked off · running on borrowed AI SS / CE time. Dedicated AI SS: 0 · dedicated CE / FDE: 0 · VCBD: 0.",
  asks: [
    {
      title: "People · a dedicated startup AI sales pod",
      netNew: 0,
      decision: "Name the cohort's 3 AI SS from Q4 '26 (within the plan's 12), with FY27 quota on new AI logos and AI revenue.",
      today: "Partners are covered on top of a full book.",
      benchmark: "AWS: 8 AMs + 2 GenAI AMs on startups.",
    },
    {
      title: "Technical · a dedicated AI CE + FDE pod",
      netNew: 0,
      decision: "Dedicate 3 AI CE + 1 FDE from Q1 '27, carved from the plan's 10 / 14 (the FDE from the pool of 11).",
      today: "Office hours run on borrowed CE time.",
      benchmark: "AWS: 8 SAs, 3 dedicated to AI.",
    },
    {
      title: "Partner · a Google Cloud VCBD in Korea",
      netNew: 1,
      decision: "Approve 1 VCBD hire for Q1 '27 + a partner credit pool (\"credits beyond the startup program\") [$ to confirm].",
      today: "No Google Cloud VCBD covers Korea.",
      benchmark: "AWS: 4 investment managers, one on Altos.",
    },
  ],
  inReturn: "One net-new hire, two re-allocations. In return: a quarterly VC portfolio review and a committed ~$114M VC-led line in the cohort plan.",
  governance: ["Monthly partner portfolio sync", "A named AI SS per sourced logo", "Monthly office hours", "Funded tokenomics diagnostic for priority companies", "Quarterly portfolio review", "QBR cadence"],
};
