/**
 * MODELCOMP — the verified dataset, hard-coded.
 *
 * Compiled Aug 2, 2026. Every score is on the Artificial Analysis Intelligence
 * Index v4.1 basis: `est: true` means the model was only ever scored on an
 * earlier basis and the number here is a v4.1-equivalent estimate (see the
 * methodology section for how those were anchored). Do not re-derive these
 * numbers — they are the artefact this site exists to publish.
 */

export const LAB_COLORS = {
  Google: "#4285F4",
  OpenAI: "#0D9373",
  Anthropic: "#D97757",
  xAI: "#1F2430",
  DeepSeek: "#7C3AED",
  Moonshot: "#DB2777",
  "Z.ai": "#64748B",
  Meta: "#0866FF",
} as const;

export type Lab = keyof typeof LAB_COLORS;

export const LABS = Object.keys(LAB_COLORS) as Lab[];

/**
 * Secondary, non-colour encoding of lab identity.
 *
 * The brand palette is fixed, and two of its hues — Anthropic #D97757 and
 * OpenAI #0D9373 — separate by only ΔE 3.7 under protanopia. Colour alone
 * therefore cannot carry identity here, so every marker also carries a shape,
 * and the legend, tooltips and ledger all name the lab in text.
 */
export const LAB_SHAPES = {
  Google: "circle",
  OpenAI: "square",
  Anthropic: "diamond",
  xAI: "triangle",
  DeepSeek: "hexagon",
  Moonshot: "cross",
  "Z.ai": "wedge",
  Meta: "pentagon",
} as const;

export type LabShape = (typeof LAB_SHAPES)[Lab];

export type ReleasePoint = {
  /** ISO date, YYYY-MM-DD. */
  d: string;
  /** Model name. */
  m: string;
  lab: Lab;
  /** Intelligence Index on the v4.1 basis. */
  s: number;
  /** True when `s` is a v4.1-equivalent estimate rather than a published score. */
  est?: boolean;
  /** Launch price per 1M input / output tokens. */
  price?: string;
  /** Set the capability frontier on release. */
  frontier?: boolean;
  /** A Google Gemini Pro-line flagship. */
  flagship?: boolean;
  note?: string;
};

/** Main chart: frontier-setters, Gemini flagships and other notable releases. */
export const POINTS: ReleasePoint[] = [
  {
    d: "2025-08-05",
    m: "Claude Opus 4.1",
    lab: "Anthropic",
    s: 30,
    est: true,
    price: "$15 / $75",
  },
  {
    d: "2025-08-07",
    m: "GPT-5",
    lab: "OpenAI",
    s: 35,
    est: true,
    price: "$1.25 / $10",
    frontier: true,
  },
  {
    d: "2025-09-29",
    m: "Claude Sonnet 4.5",
    lab: "Anthropic",
    s: 32,
    est: true,
    price: "$3 / $15",
  },
  {
    d: "2025-11-12",
    m: "GPT-5.1",
    lab: "OpenAI",
    s: 37,
    est: true,
    price: "$1.25 / $10",
    frontier: true,
  },
  {
    d: "2025-11-18",
    m: "Gemini 3 Pro",
    lab: "Google",
    s: 40,
    est: true,
    price: "$2 / $12",
    frontier: true,
    flagship: true,
    note: "Takes #1 on the live index. Held it 6 days.",
  },
  {
    d: "2025-11-24",
    m: "Claude Opus 4.5",
    lab: "Anthropic",
    s: 41,
    est: true,
    price: "$5 / $25",
    frontier: true,
  },
  {
    d: "2025-12-11",
    m: "GPT-5.2",
    lab: "OpenAI",
    s: 43,
    est: true,
    frontier: true,
    note: "The 'Code Red' response, pulled forward after Gemini 3",
  },
  {
    d: "2026-02-05",
    m: "Claude Opus 4.6",
    lab: "Anthropic",
    s: 45,
    est: true,
    price: "$5 / $25",
    frontier: true,
  },
  {
    d: "2026-02-19",
    m: "Gemini 3.1 Pro",
    lab: "Google",
    s: 46,
    est: false,
    price: "$2 / $12 ≤200K",
    frontier: true,
    flagship: true,
    note: "57 on the live index — 4 pts clear of Opus 4.6 at under half the cost. Steps to $4 / $18 above 200K context. Still Google's last flagship.",
  },
  {
    d: "2026-03-05",
    m: "GPT-5.4",
    lab: "OpenAI",
    s: 46,
    est: true,
    note: "Pulls level: 57 on the live index, tied with Gemini 3.1",
  },
  {
    d: "2026-04-16",
    m: "Claude Opus 4.7",
    lab: "Anthropic",
    s: 47,
    est: true,
    price: "$5 / $25",
    frontier: true,
    note: "Noses ahead — 57.3 vs Gemini's 57.0 on the live index",
  },
  {
    d: "2026-04-23",
    m: "GPT-5.5 (Spud)",
    lab: "OpenAI",
    s: 53,
    est: true,
    price: "$5 / $30",
    frontier: true,
    note: "Clear #1 at 60 on the live index — the decisive overtake",
  },
  {
    d: "2026-04-24",
    m: "DeepSeek V4 Pro",
    lab: "DeepSeek",
    s: 48,
    est: true,
    price: "$0.435 / $0.87 · open",
  },
  {
    d: "2026-05-28",
    m: "Claude Opus 4.8",
    lab: "Anthropic",
    s: 56,
    est: false,
    price: "$5 / $25",
    frontier: true,
  },
  {
    d: "2026-06-09",
    m: "Claude Fable 5",
    lab: "Anthropic",
    s: 60,
    est: false,
    price: "$10 / $50",
    frontier: true,
    note: "First Mythos-class model",
  },
  {
    d: "2026-06-30",
    m: "Claude Sonnet 5",
    lab: "Anthropic",
    s: 53,
    est: false,
    price: "$3 / $15",
  },
  {
    d: "2026-07-08",
    m: "Grok 4.5",
    lab: "xAI",
    s: 54,
    est: true,
    price: "$2 / $6",
    note: "Released by SpaceXAI post-merger; xAI claims ~2x token efficiency vs Opus 4.8",
  },
  {
    d: "2026-07-09",
    m: "GPT-5.6 Sol",
    lab: "OpenAI",
    s: 59,
    est: false,
    price: "$5 / $30",
    frontier: true,
    note: "Previewed Jun 26–27, GA Jul 9; GA on Bedrock Jul 13",
  },
  {
    d: "2026-07-16",
    m: "Kimi K3",
    lab: "Moonshot",
    s: 57,
    est: false,
    price: "$3 / $15 · weights Jul 26",
  },
  {
    d: "2026-07-24",
    m: "Claude Opus 5",
    lab: "Anthropic",
    s: 61,
    est: false,
    price: "$5 / $25",
    frontier: true,
  },
];

export type StepPoint = [string, number];

/** Running max of the frontier, stepAfter. */
export const FRONTIER_STEP: StepPoint[] = [
  ["2025-08-07", 35],
  ["2025-11-12", 37],
  ["2025-11-18", 40],
  ["2025-11-24", 41],
  ["2025-12-11", 43],
  ["2026-02-05", 45],
  ["2026-02-19", 46],
  ["2026-04-16", 47],
  ["2026-04-23", 53],
  ["2026-05-28", 56],
  ["2026-06-09", 60],
  ["2026-07-24", 61],
  ["2026-08-06", 61],
];

/** The Google Pro-line flagship available at each moment, stepAfter. */
export const GEMINI_FLAGSHIP_STEP: StepPoint[] = [
  ["2025-08-01", 30],
  ["2025-11-18", 40],
  ["2026-02-19", 46],
  ["2026-08-06", 46],
];

export type FlashPoint = {
  d: string;
  m: string;
  /** null = shipped without a published index score. */
  s: number | null;
  est?: boolean;
  price?: string;
  note?: string;
};

export const FLASH: FlashPoint[] = [
  {
    d: "2025-09-25",
    m: "Gemini 2.5 Flash (Sep)",
    s: 27,
    est: true,
    price: "$0.30 / $2.50",
  },
  {
    d: "2025-12-17",
    m: "Gemini 3 Flash",
    s: 38,
    est: true,
    price: "$0.50 / $3",
    note: "71 on the then-current index — 'most intelligent for its cost.' Default in Search and the Gemini app within days.",
  },
  {
    d: "2026-05-19",
    m: "Gemini 3.5 Flash",
    s: 50,
    est: false,
    price: "$1.50 / $9",
    note: "#5 on the live index at launch (55); led AA's intelligence-vs-speed frontier — at 3× the price of 3 Flash.",
  },
  {
    d: "2026-07-21",
    m: "Gemini 3.6 Flash",
    s: 50,
    est: false,
    note: "GA Jul 21, alongside the Gemini 4 pretraining announcement",
  },
];

export const FLASH_LITE: FlashPoint[] = [
  {
    d: "2026-03-03",
    m: "Gemini 3.1 Flash-Lite",
    s: null,
    note: "No published index score; release date reported Mar 3 (sources vary)",
  },
  {
    d: "2026-07-21",
    m: "Gemini 3.5 Flash-Lite",
    s: 36,
    est: false,
    note: "360 tok/s budget tier",
  },
];

export type RivalPoint = {
  d: string;
  m: string;
  lab: Lab;
  s: number;
  est?: boolean;
  price?: string;
  note?: string;
};

export const RIVAL_VALUE_TIER: RivalPoint[] = [
  {
    d: "2026-06-13",
    m: "GLM-5.2",
    lab: "Z.ai",
    s: 51,
    est: true,
    price: "open · MIT",
    note: "Released Jun 13; MIT weights Jun 16",
  },
  { d: "2026-06-30", m: "Claude Sonnet 5", lab: "Anthropic", s: 53, price: "$3 / $15" },
  { d: "2026-07-08", m: "Grok 4.5", lab: "xAI", s: 54, est: true, price: "$2 / $6" },
  { d: "2026-07-09", m: "GPT-5.6 Terra", lab: "OpenAI", s: 55, price: "$2.50 / $15 → $2 / $12 (Jul 30)" },
  { d: "2026-07-09", m: "GPT-5.6 Luna", lab: "OpenAI", s: 51, price: "$1 / $6 → $0.20 / $1.20 (Jul 30)" },
  { d: "2026-07-16", m: "Kimi K3", lab: "Moonshot", s: 57, price: "$3 / $15 · open weights" },
  { d: "2026-07-09", m: "Muse Spark 1.1", lab: "Meta", s: 51, price: "$1.25 / $4.25" },
  {
    d: "2026-04-24",
    m: "DeepSeek V4 Flash",
    lab: "DeepSeek",
    s: 50,
    price: "$0.14 / $0.28",
    note: "Shipped alongside V4 Pro; $0.09 / $0.18 is reseller pricing, not DeepSeek's",
  },
];

/** Windows where Gemini led or shared the frontier outright. */
export const LEAD_WINDOWS: Array<[string, string]> = [
  ["2025-11-18", "2025-11-24"],
  ["2026-02-19", "2026-04-16"],
];

/** Only these four rival value-tier models are labelled on the Flash chart. */
export const LABELLED_RIVALS = new Set([
  "Claude Sonnet 5",
  "Grok 4.5",
  "Kimi K3",
  "DeepSeek V4 Flash",
]);

/** Shared x-domain for both charts — the Flash chart aligns to the main one. */
export const X_DOMAIN: [string, string] = ["2025-08-01", "2026-08-06"];

export const Y_DOMAIN_MAIN: [number, number] = [26, 65];
export const Y_DOMAIN_FLASH: [number, number] = [22, 60];

export const COMPILED_ON = "Aug 3, 2026";

export type Inflection = {
  n: number;
  /** Anchor on the chart. */
  d: string;
  /** Which line the marker sits on. */
  on: "frontier" | "gemini";
  title: string;
  when: string;
  body: string;
  /** Nudge the numbered badge off the line so it clears the data. */
  dx: number;
  dy: number;
};

export const INFLECTIONS: Inflection[] = [
  {
    n: 1,
    d: "2025-11-18",
    on: "frontier",
    title: "Gemini 3 Pro takes #1",
    when: "Nov 18",
    body: "Google seizes the frontier; OpenAI reportedly declares an internal “Code Red” and pulls GPT-5.2 forward. Opus 4.5 retakes the top spot in 6 days.",
    dx: -18,
    dy: -46,
  },
  {
    n: 2,
    d: "2026-02-19",
    on: "frontier",
    title: "Gemini 3.1 Pro retakes #1",
    when: "Feb 19",
    body: "57 on the live index vs Opus 4.6's 53, at under half the cost — the strongest Pareto position of the year. Still Google's last flagship release.",
    dx: -6,
    dy: -52,
  },
  {
    n: 3,
    d: "2026-04-16",
    on: "frontier",
    title: "The tie breaks",
    when: "Mar–Apr",
    body: "GPT-5.4 and Opus 4.7 pull level at 57; Opus 4.7 noses ahead Apr 16 (57.3 vs 57.0); GPT-5.5 opens a clear 3-pt gap Apr 23. Google never answers.",
    dx: -10,
    dy: -58,
  },
  {
    n: 4,
    d: "2026-05-19",
    on: "gemini",
    title: "I/O promise slips",
    when: "May 19",
    body: "3.5 Flash ships; Pichai promises 3.5 Pro “next month.” It misses June and slips repeatedly over reliability and coding shortfalls; partner testing only as of Aug 3.",
    dx: -4,
    dy: 44,
  },
  {
    n: 5,
    d: "2026-07-09",
    on: "frontier",
    title: "Frontier sprints, Google pivots",
    when: "Jun–Jul",
    body: "Fable 5, GPT-5.6 Sol and Opus 5 lift the frontier 9 pts in 7 weeks. Jul 21: Google ships Flash models and announces Gemini 4 pretraining instead.",
    dx: -30,
    dy: -44,
  },
];

export const KPIS = [
  {
    figure: "−15",
    unit: "pts",
    label: "Gap to frontier today",
    detail: "Opus 5 at 61 vs Gemini 3.1 Pro at 46",
    tone: "trail" as const,
  },
  {
    figure: "165",
    unit: "days",
    label: "Since Google's last flagship",
    detail: "Gemini 3.1 Pro, Feb 19",
    tone: "neutral" as const,
  },
  {
    figure: "3×",
    unit: "",
    label: "Gemini 3.5 Pro delays",
    detail: "June target → slipped → unshipped",
    tone: "neutral" as const,
  },
  {
    figure: "62",
    unit: "days",
    label: "At or sharing #1",
    detail: "6 in Nov + 56 Feb–Apr",
    tone: "lead" as const,
  },
];

export const FLASH_CHIPS = [
  { figure: "5 vs 1", text: "Flash releases vs flagship releases in 12 months" },
  { figure: "50 > 46", text: "Flash now outscores Google's stalled flagship" },
  { figure: "3×", text: "Flash price step-up: $0.50/$3 → $1.50/$9" },
  { figure: "50–57", text: "Where the rival value tier sits, at or above Flash's 50" },
];

/* ── Ledger ──────────────────────────────────────────────────────────────── */

export type LedgerRow = {
  d: string;
  m: string;
  lab: Lab;
  s: number | null;
  est: boolean;
  price: string | null;
  frontier: boolean;
  note: string | null;
};

/**
 * Every release across all three series, deduped.
 *
 * Sonnet 5, Grok 4.5 and Kimi K3 appear in both the main series and the rival
 * value tier — same date, same score — so the first occurrence wins and the
 * later one only fills in fields the first was missing.
 */
export function buildLedger(): LedgerRow[] {
  const byKey = new Map<string, LedgerRow>();

  const add = (row: LedgerRow) => {
    const key = `${row.d}|${row.m}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, row);
      return;
    }
    existing.price ??= row.price;
    existing.note ??= row.note;
    existing.frontier ||= row.frontier;
  };

  for (const p of POINTS) {
    add({
      d: p.d,
      m: p.m,
      lab: p.lab,
      s: p.s,
      est: p.est === true,
      price: p.price ?? null,
      frontier: p.frontier === true,
      note: p.note ?? null,
    });
  }

  for (const f of [...FLASH, ...FLASH_LITE]) {
    add({
      d: f.d,
      m: f.m,
      lab: "Google",
      s: f.s,
      est: f.est === true,
      price: f.price ?? null,
      frontier: false,
      note: f.note ?? null,
    });
  }

  for (const r of RIVAL_VALUE_TIER) {
    add({
      d: r.d,
      m: r.m,
      lab: r.lab,
      s: r.s,
      est: r.est === true,
      price: r.price ?? null,
      frontier: false,
      note: r.note ?? null,
    });
  }

  return Array.from(byKey.values()).sort((a, b) =>
    a.d === b.d ? a.m.localeCompare(b.m) : a.d.localeCompare(b.d),
  );
}

export const LEDGER = buildLedger();
