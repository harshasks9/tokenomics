import type { Ask, Risk } from "../types";

/** The six highest-risk assumptions inside the ~$900M (slides 3, 9, 12, 32, 35, 92). */
export const risks: Risk[] = [
  {
    rank: 1,
    title: "New logos – AI startups",
    exposure: "~$203M at ~4% line of sight",
    detail: "The largest single bet. FY26 new logos added $0.8M; the plan needs a repeatable acquisition engine that does not exist yet.",
    cohort: "startups",
    src: { part: "B", slides: "92" },
  },
  {
    rank: 2,
    title: "Hyundai AutoEver held flat",
    exposure: "~$11M at risk",
    detail: "Held at $13.4M in the plan but runs ~$2M today after its Claude workload moved to AWS Bedrock.",
    src: { part: "B", slides: "92" },
  },
  {
    rank: 3,
    title: "Samsung beyond the +50% cap",
    exposure: "+$50M lever on the largest account",
    detail: "The base case caps Samsung at +50% ($149M). The plan needs ~2x FY26, ~1.7x today's ~$118M run-rate.",
    cohort: "samsung",
    src: { part: "B", slides: "92" },
  },
  {
    rank: 4,
    title: "Competitor take-outs at Wrtn and Coupang",
    exposure: "+$37M lever; Wrtn's Bedrock workload alone ~$50M",
    detail: "Growth here is displacement, not organic: Wrtn off Bedrock, Coupang off OpenAI / Anthropic.",
    cohort: "big-ai",
    src: { part: "main", slides: "12, 26" },
  },
  {
    rank: 5,
    title: "Flagship groups beyond LG",
    exposure: "+$20M lever; ~12% line of sight",
    detail: "LG Electronics is ~half the target. Two more group-wide wins (SK, Hyundai Motor or Lotte) are required.",
    cohort: "flagship",
    src: { part: "main", slides: "12, 32" },
  },
  {
    rank: 6,
    title: "Public sector repeatability",
    exposure: "~$25M at ~1% line of sight",
    detail: "Scale depends on a repeatable campus deal and on policy fit: CSAP, the AI Basic Act and a sovereign-AI preference in central government.",
    cohort: "public",
    src: { part: "main", slides: "35" },
  },
];

export const riskNotes = {
  levers: "~4x needs no whales, but it needs all eight levers.",
  churn: "Consumer AI workloads churn fast: BabeChat fell from $8.7M to $1.3M (−85%).",
  los: "Line of sight = today's AI run-rate (last 7 days annualised), held flat through FY27, ÷ the ~4x plan.",
};

/** The three decisions (slides 3, 29, 38). Linked lines come from the cohort pages. */
export const asks: Ask[] = [
  {
    num: 1,
    id: "people",
    name: "People",
    headline: "Staff the cohorts",
    decision: "A named owner and pod for each of the 8 cohorts: 16 AI SS, 15 AI CE, 14 FDE (3 anchor + 11 pool) and 1 VCBD.",
    decisionBasis: "stated",
    items: [
      {
        text: "Name the three startup AI SS as a dedicated pod from Q4 '26 (within the plan's 12).",
        basis: "stated",
        unlocks: "The ~$114M VC-led line inside the ~$203M startup cohort.",
        cohorts: ["startups"],
      },
      {
        text: "Dedicate 3 AI CE + 1 FDE to the VC / CVC engine from Q1 '27 (within the plan's 10 / 14).",
        basis: "stated",
        unlocks: "Office hours, funded diagnostics and POC → production for 50 scaleups and the 1K+ program.",
        cohorts: ["startups"],
      },
      {
        text: "Approve 1 Korea VCBD hire for Q1 '27: the only net-new head in the startup asks.",
        basis: "stated",
        unlocks: "Investor partners from 2 live to 5.",
        cohorts: ["startups"],
      },
      {
        text: "A named owner, $ target and quarterly run-rate KPI for every cohort.",
        basis: "stated",
        unlocks: "\"One owner, one number\" across all eight cohorts. Every cohort owner is still [name] in the deck.",
        cohorts: ["big-ai", "big-gcp", "startups", "samsung", "flagship", "trad-ent", "mid-market", "public"],
      },
    ],
    sourceState: "The general asks slide (38) still lists two placeholder bullets (\"xx\", \"xxx\"). No final wording is invented here.",
  },
  {
    num: 2,
    id: "money",
    name: "Money / commercial",
    headline: "Fund only the gaps",
    decision: "Approve the gap fund and custom market pricing. The deck's decision line reads \"Decisionxxx\" mid-sentence; amounts are [$ to confirm].",
    decisionBasis: "to-confirm",
    items: [
      {
        text: "Custom market pricing for the largest accounts (Samsung, Coupang, Wrtn) [$ to confirm].",
        basis: "to-confirm",
        unlocks: "Samsung beyond the cap (+$50M) and the Wrtn / Coupang take-outs (+$37M): about half of the lever layer.",
        cohorts: ["samsung", "big-ai"],
      },
      {
        text: "Startup credits beyond the standard startup program: a partner credit pool [$ to confirm].",
        basis: "to-confirm",
        unlocks: "The 1K+ logo program and clinic-to-paid conversion in the ~$203M startup cohort.",
        cohorts: ["startups"],
      },
      {
        text: "Public-sector campus marketing fund [$ to confirm].",
        basis: "to-confirm",
        unlocks: "Lever 6 (+$15M): 30–40 universities on ~$3 per seat campus bundles.",
        cohorts: ["public"],
      },
      {
        text: "Korea pricing guardrails agreed with FSM.",
        basis: "stated",
        unlocks: "Commercial room in-market for every cohort's Switch and Commit offers.",
        cohorts: ["big-ai", "big-gcp", "samsung", "flagship", "trad-ent"],
      },
      {
        text: "Remove or relax the Marketplace seller revenue-recognition cap for 3P (\"uncapped Marketplace\").",
        basis: "stated",
        unlocks: "Third-party models (e.g. Claude on Vertex) as the bridge for take-outs.",
        cohorts: ["big-ai", "samsung", "flagship"],
      },
    ],
    sourceState: "Dollar values are [$ to confirm] on slides 29 and 38.",
  },
  {
    num: 3,
    id: "cross-team",
    name: "Cross-team",
    headline: "Open the channels",
    decision: "Name a Google Play owner and partner leads.",
    decisionBasis: "stated",
    items: [
      {
        text: "Google Play: AI app intros to startups (owner to confirm).",
        basis: "to-confirm",
        unlocks: "20 Google Play intros in Q1 and the 1K+ logo program.",
        cohorts: ["startups"],
      },
      {
        text: "Partner and investor leads: Megazone, Bespin, Samsung SDS, LG CNS; Altos and Samsung Ventures portfolios.",
        basis: "stated",
        unlocks: "The long tail and mid-market (partner-led), Samsung SDS co-sell, LG CNS co-build.",
        cohorts: ["startups", "mid-market", "samsung", "flagship"],
      },
      {
        text: "JAPAC pricing: renew throughput tiers and the NAL Pen offer for FY27.",
        basis: "stated",
        unlocks: "Samsung's $30M+ throughput commit and 10K+ seats; group seat offers in flagships and traditional enterprises.",
        cohorts: ["samsung", "big-ai", "flagship", "trad-ent"],
      },
      {
        text: "Enterprise product unblocks.",
        basis: "stated",
        unlocks: "Samsung baseline GE feature / connector asks and LG's GE security approval (deep dive, slide 20).",
        cohorts: ["samsung", "flagship"],
      },
    ],
    sourceState: "The Google Play owner is \"to confirm\"; the executive summary's cross-team list ends mid-list.",
  },
];

export const askClosing = "With these three decisions, the eight cohort plans can start in Q1.";
export const askLinkNote =
  "\"Unlocks\" links each ask to the plan lines the deck's cohort pages tie it to. The deck states the asks; the links are this site's reading of slides 12–35 and 92.";
