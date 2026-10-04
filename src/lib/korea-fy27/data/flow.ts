import type { Basis, CohortId, MotionId, PlayId, SegmentId, Src } from "../types";

/**
 * The flow version (/korea-fy27/flow): the same plan, re-sequenced to the review
 * outline. Everything numeric comes from the main data files through the model;
 * this file only holds how the flow groups it, plus the few statements the
 * outline needs that the main site does not show (each with its slide).
 */

export type FlowItem = { text: string; basis: Basis; src: Src };

export type FlowVerticalConfig = {
  /** Anchor id on the flow page. */
  id: string;
  num: string;
  /** The outline's own label, e.g. "DN + Acquire". */
  label: string;
  segment: SegmentId;
  motion: MotionId;
  cohort: CohortId;
  sponsor: { text: string; basis: Basis; note: string; src: Src };
  /** Q4 '26 actions the deck states for this vertical, beyond its decisions and top-13 accounts. */
  q4: FlowItem[];
  /** Index into the cohort's decisions of the commercial one (pricing, credits, commits). */
  commercialDecision: number;
  example: { account: string; table: number; display: string; why: string; basis: Basis; src: Src | Src[] };
  /** 7.1 Squad formation: the team the deck sets up for this vertical. */
  squad: { name: string; makeup: string; pod: string; src: Src[] };
};

/** The outline's "5 Vertical Approach", in the outline's order. */
export const flowVerticals: FlowVerticalConfig[] = [
  {
    id: "dn-acquire",
    num: "5.1",
    label: "DN + Acquire",
    segment: "dn",
    motion: "acquire",
    cohort: "startups",
    sponsor: {
      text: "[to name]",
      basis: "placeholder",
      note: "The deck names no exec sponsor for this cohort. Its Digital Native asks request C-level sponsors only for Wrtn, Coupang, NAVER and Nexon.",
      src: { part: "C", slides: "99" },
    },
    q4: [
      { text: "Name the cohort's 3 AI SS as a dedicated startup pod from Q4 '26 (within the plan's 12).", basis: "stated", src: { part: "main", slides: "29" } },
      {
        text: "Run the VC 90-day plan: Altos targets and the KT kick-off (October), first office hours and 5 funded diagnostics (November), three more investors in talks and the first POC → commit conversions (December).",
        basis: "proposed",
        src: { part: "main", slides: "30" },
      },
    ],
    commercialDecision: 2,
    example: {
      account: "Speak",
      table: 1,
      display: "Speak",
      why: "One of the six breakouts in flight that carry ~$60M of the cohort's FY27. An AI English tutor on real-time voice: lead with GenMedia & Voice, co-approach its US HQ and split its voice load to the Live API. Its account owner is still to be hired.",
      basis: "stated",
      src: { part: "C", slides: "110, 113" },
    },
    squad: {
      name: "Startup pod",
      makeup: "3 AI SS named from Q4 '26 · 3 AI CE + 1 FDE from Q1 '27 · 1 VCBD hire in Q1 '27",
      pod: "DN specialty pod for coding and AI in products; FDE sprints pooled for the top 6",
      src: [{ part: "main", slides: "23, 29" }],
    },
  },
  {
    id: "dn-deepen",
    num: "5.2",
    label: "DN + Deepen",
    segment: "dn",
    motion: "deepen",
    cohort: "big-ai",
    sponsor: {
      text: "C-level sponsors for Wrtn, Coupang and NAVER: [names]",
      basis: "placeholder",
      note: "Requested in the Digital Native asks, which also list Nexon (DN + Penetrate). The deck leaves the names blank.",
      src: { part: "C", slides: "99" },
    },
    q4: [],
    commercialDecision: 2,
    example: {
      account: "Wrtn",
      table: 0,
      display: "Wrtn",
      why: "The cohort's largest account: $41.8M AI run-rate and ~$100M of total AI spend, ~$50M of it on AWS Bedrock to take out. The deck's proof point for the cohort is Wrtn live on Gemini by Q2.",
      basis: "stated",
      src: { part: "C", slides: "103, 104" },
    },
    squad: {
      name: "Top-3 account team",
      makeup: "3 AI SS · 1 AI CE (3 in the target) · 1 dedicated FDE at Coupang + the pool of 11; each of the top 3 gets a named FDE, a bake-off and a commit offer in H1",
      pod: "DN specialty pod",
      src: [{ part: "main", slides: "23, 26" }],
    },
  },
  {
    id: "dn-penetrate",
    num: "5.3",
    label: "DN + Penetrate",
    segment: "dn",
    motion: "penetrate",
    cohort: "big-gcp",
    sponsor: {
      text: "C-level sponsor for Nexon: [name]",
      basis: "placeholder",
      note: "Requested in the Digital Native asks. No sponsor is asked for Kakao or Daangn, the cohort's two direct deals.",
      src: { part: "C", slides: "99" },
    },
    q4: [],
    commercialDecision: 2,
    example: {
      account: "Nexon",
      table: 0,
      display: "Nexon",
      why: "The largest GCP spender on the gaming track: $23M of GCP but $3.2M of AI (14%), with Claude Enterprise as the incumbent. It is one of the 13 top accounts to activate in Q4, sits on the exec-sponsor ask, and its own FY27 plan is a 4x AI target ($12M).",
      basis: "stated",
      src: [{ part: "main", slides: "14" }, { part: "C", slides: "99, 107" }],
    },
    squad: {
      name: "Gaming squad + two direct deals",
      makeup: "One gaming squad (AE + AI SS + AI CE) on all 8 game companies · Kakao and Daangn direct · the other pooled accounts through partners",
      pod: "DN specialty pod; FDEs pooled or partner-led",
      src: [{ part: "C", slides: "107, 108" }],
    },
  },
  {
    id: "ce-deepen",
    num: "5.4",
    label: "Conglomerate + Deepen",
    segment: "ce",
    motion: "deepen",
    cohort: "samsung",
    sponsor: {
      text: "[to name]",
      basis: "placeholder",
      note: "The deck names no exec sponsor for Samsung. Its Q1 staffing target (2 FDEs + 2 CEs) is owned by the AI Sales Director.",
      src: { part: "C", slides: "116, 117" },
    },
    q4: [
      { text: "Start with the supply-chain agent platform in Q4, with an enterprise pod per division.", basis: "stated", src: { part: "C", slides: "117" } },
    ],
    commercialDecision: 2,
    example: {
      account: "MX",
      table: 0,
      display: "Samsung Electronics · MX (Galaxy AI)",
      why: "Samsung is one account group, so the example is its largest unit: MX carries ~$104M of the $118.1M run-rate (est.), with Galaxy AI on-device plus cloud Gemini 4. The business-unit split is the deck's estimate.",
      basis: "estimate",
      src: { part: "C", slides: "118" },
    },
    squad: {
      name: "Samsung pod",
      makeup: "1 AI SS (2 in the target) · 2 AI CE · 2 dedicated FDEs · an enterprise pod per division",
      pod: "Samsung & ENT pods (agents and Gemini Enterprise)",
      src: [{ part: "main", slides: "23, 31" }, { part: "C", slides: "117" }],
    },
  },
  {
    id: "ce-penetrate",
    num: "5.5",
    label: "Conglomerate + Penetrate",
    segment: "ce",
    motion: "penetrate",
    cohort: "flagship",
    sponsor: {
      text: "[to name]",
      basis: "placeholder",
      note: "The deck names no exec sponsor for the flagship groups. The cohort enters through the group IT arms (LG CNS, SK AX, CJ OliveNetworks).",
      src: { part: "C", slides: "119, 120" },
    },
    q4: [],
    commercialDecision: 2,
    example: {
      account: "LG Electronics",
      table: 0,
      display: "LG Electronics",
      why: "About half the cohort's target: $68.4M of GCP at 5% AI. The plan converts that base to ~$36M of AI (ThinQ + seats), co-built with LG CNS beside EXAONE; the cohort build-up uses ~$38M.",
      basis: "stated",
      src: { part: "C", slides: "121" },
    },
    squad: {
      name: "Flagship team with the group IT arms",
      makeup: "1 AI SS + 1 AI CE (2 + 2 in the target) · partner FDEs co-delivering with LG CNS, SK AX and CJ OliveNetworks",
      pod: "Samsung & ENT pods",
      src: [{ part: "main", slides: "23, 32" }, { part: "C", slides: "120" }],
    },
  },
];

/** Section 3: what the evidence means for how we go to market. */
export const takeaways: {
  learned: string;
  gtm: string;
  motions: MotionId[];
  verticals: string[];
  src: Src[];
}[] = [
  {
    learned: "Market growth alone takes us to ~$435M. The other ~$465M has to be won as share, ~73% of it in Digital Natives.",
    gtm: "Take Anthropic workloads first, the largest pool in the market: Claude on Vertex as the bridge, then Gemini.",
    motions: ["deepen", "penetrate"],
    verticals: ["dn-deepen", "dn-penetrate", "ce-deepen", "ce-penetrate"],
    src: [{ part: "A", slides: "45, 49" }, { part: "main", slides: "7" }],
  },
  {
    learned: "Digital Natives carry ~67% of the growth: +$449M of the +$675M.",
    gtm: "Run Digital Natives as three verticals, one per motion. Coverage follows the money: 7 of the 12 AI SS and all named FDEs sit on the three biggest cohorts (big AI spenders, AI startups, Samsung).",
    motions: ["acquire", "deepen", "penetrate"],
    verticals: ["dn-acquire", "dn-deepen", "dn-penetrate"],
    src: [{ part: "main", slides: "13" }, { part: "C", slides: "97, 99" }],
  },
  {
    learned: "FY26 had almost no new-logo engine: 167 new logos added just $0.8M.",
    gtm: "Make investors the sourcing channel. Breakout startups pick a cloud by Series B, and a few investors see most of the pipeline.",
    motions: ["acquire"],
    verticals: ["dn-acquire"],
    src: [{ part: "main", slides: "9, 28" }],
  },
  {
    learned: "Conglomerates are a two-account business for us: Samsung and AutoEver are 93% of our C&E AI, and 8 of 10 major groups already buy from two or more model vendors.",
    gtm: "Deepen Samsung beyond the cap, and enter the other groups through their portals and IT arms (LG CNS, SK AX, Samsung SDS).",
    motions: ["deepen", "penetrate"],
    verticals: ["ce-deepen", "ce-penetrate"],
    src: [{ part: "A", slides: "58–65" }],
  },
  {
    learned: "GCP-heavy accounts barely use our AI: the 19 big GCP spenders run 11% AI on $135M of GCP, and LG Electronics runs 5% on $68.4M.",
    gtm: "Convert GCP spend into AI: a developer wedge (Antigravity), voice lighthouses, and Savings Plan commits written into GCP renewals.",
    motions: ["penetrate"],
    verticals: ["dn-penetrate", "ce-penetrate"],
    src: [{ part: "main", slides: "25" }, { part: "C", slides: "105, 121" }],
  },
  {
    learned: "Revenue is concentrated and portable: 10 accounts are 81% of Digital Native AI, BabeChat fell 85%, and AutoEver's Claude workload moved to AWS Bedrock.",
    gtm: "Make every win sticky: provisioned-throughput and multi-year commits, platform depth, and FDE time gated by production outcomes.",
    motions: ["deepen"],
    verticals: ["dn-deepen", "ce-deepen"],
    src: [{ part: "main", slides: "3, 9" }, { part: "C", slides: "100" }],
  },
];

/** Section 7 opener: what the deck dates to Q4 '26 across the plan. */
export const q4Overview: FlowItem[] = [
  { text: "Activate the 13 top accounts: ~$520M of AI spend, only ~$160M with us today.", basis: "stated", src: { part: "main", slides: "14" } },
  { text: "Take the three decisions on each cohort page in the room: 24 across the eight cohorts.", basis: "stated", src: { part: "C", slides: "102–130" } },
  { text: "Name the three startup AI SS and run the VC 90-day plan with Altos and KT.", basis: "stated", src: { part: "main", slides: "29, 30" } },
  { text: "Start Samsung's supply-chain agent platform, and decide where its two dedicated FDEs go first.", basis: "stated", src: { part: "C", slides: "116, 117" } },
];

/** 7.2 Skilling: which solution deep-dive tracks (slides 19–22) teach each play. */
export const trainingTracks: { play: PlayId; deepDive: string; tracks: number[] }[] = [
  { play: "coding", deepDive: "coding-products", tracks: [0] },
  { play: "products", deepDive: "coding-products", tracks: [1] },
  { play: "agentic", deepDive: "agentic-unified", tracks: [1] },
  { play: "unified", deepDive: "agentic-unified", tracks: [0] },
  { play: "live", deepDive: "live-genmedia", tracks: [0, 1] },
  { play: "security", deepDive: "security", tracks: [0, 1] },
];

/** 8. Accountability: the operating rhythm the deck sets, grouped by cadence. */
export const cadence: { rhythm: string; items: FlowItem[] }[] = [
  {
    rhythm: "Weekly",
    items: [
      { text: "Digital Native pod review with the DN AI SS: gateway cutovers, token consumption and provisioned-throughput use.", basis: "wip", src: { part: "main", slides: "19" } },
      { text: "Account blockers burned down with Product Engineering and customer IT / CISOs, each with a named owner.", basis: "wip", src: { part: "main", slides: "20" } },
    ],
  },
  {
    rhythm: "Every two weeks",
    items: [
      { text: "Live Agent & GenMedia launch readiness, latency SLAs and throughput sizing, reviewed with the AI SS.", basis: "wip", src: { part: "main", slides: "21" } },
      { text: "Mid-market: pooled technical webinars and partner FDE clinics.", basis: "stated", src: { part: "main", slides: "34" } },
    ],
  },
  {
    rhythm: "Monthly",
    items: [
      { text: "Pilot → production conversion, measured every month rather than at year end.", basis: "stated", src: { part: "main", slides: "3" } },
      { text: "Investor portfolio sync into SFDC and AI CE / FDE office hours at each partner.", basis: "stated", src: { part: "main", slides: "28" } },
    ],
  },
  {
    rhythm: "Quarterly",
    items: [
      { text: "Each cohort's run-rate KPI against its $ target.", basis: "stated", src: { part: "main", slides: "3, 16" } },
      { text: "VC portfolio review, given in return for the startup asks.", basis: "stated", src: { part: "main", slides: "29" } },
      { text: "QBR cadence from the FY27 KPI baseline set in December.", basis: "proposed", src: { part: "main", slides: "30" } },
    ],
  },
  {
    rhythm: "Gates",
    items: [
      { text: "Every FDE sprint is tied to a production cutover or a verified activation.", basis: "stated", src: { part: "main", slides: "23" } },
      { text: "Gemini Enterprise seats: connectors and security sign-off by day 30, BU champions by day 60, a usage audit at day 90 before any expansion.", basis: "wip", src: { part: "main", slides: "20" } },
    ],
  },
];

/** 9. Follow-ups: what the deck leaves open, with where it sits. Nothing here is filled in. */
export const followUps: { item: string; open: string; where: string; src: Src }[] = [
  { item: "Cohort owners", open: "\"Owner: [name]\" on all eight cohort pages.", where: "Accountability", src: { part: "main", slides: "25–35" } },
  { item: "Exec sponsors", open: "C-level sponsors for Wrtn, Coupang, NAVER and Nexon: [names]. None asked for the other verticals.", where: "Five verticals", src: { part: "C", slides: "99" } },
  { item: "Cohort targets", open: "[team to fill] on five cohort pages; Appendix C fills them.", where: "Q4 plans", src: { part: "main", slides: "31–35" } },
  { item: "Money asks", open: "Custom pricing, startup credit pool, campus fund: [$ to confirm].", where: "Commercials", src: { part: "main", slides: "29, 38" } },
  { item: "FDE model", open: "3 anchor + 11 pool, or 6 dedicated + 8 sprint pool. Both total 14.", where: "Resources", src: { part: "main", slides: "3, 23, 97" } },
  { item: "Skilling plan", open: "The deck has no training plan. Its plays and solution deep dives are the material; format, owners and dates are to define.", where: "Skilling", src: { part: "main", slides: "16–22" } },
  { item: "90-day plan", open: "Slide 36, \"90 Plan (FY26 Q4)\", is an empty divider. Only the startup engine has one.", where: "Q4 plan", src: { part: "main", slides: "30, 36" } },
  { item: "Google Play owner", open: "To confirm. It gates 20 Play intros in Q1 for the startup cohort.", where: "Asks", src: { part: "main", slides: "3, 38" } },
  { item: "General asks slide", open: "Placeholders \"xx\", \"xxx\" and \"Decisionxxx\".", where: "Asks", src: { part: "main", slides: "38" } },
];
