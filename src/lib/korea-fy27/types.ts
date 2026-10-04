/**
 * Korea AI — Path to 4x · FY27. Types for the plan microsite.
 *
 * Every figure on the site comes from the 133-slide deck "Korea AI – Path to
 * 4x · FY27_vFF" (October 2026, Draft · Google internal). Money is USD
 * millions unless a field says otherwise. FY26 = year to date (to 25 Sep) plus
 * the last-7-days run-rate × 97 days, as the deck defines it.
 */

/** Where in the deck a figure lives. */
export type SourcePart = "main" | "A" | "B" | "C";

export type Src = {
  part: SourcePart;
  /** Slide numbers as printed, e.g. "12" or "12–13". */
  slides: string;
};

/**
 * How a figure entered the site. Labels shown to readers come from
 * BASIS_LABEL in format.ts.
 *  - stated: printed in the deck
 *  - derived: computed on this site from stated figures (the formula is shown)
 *  - estimate: marked "est." in the deck
 *  - directional: competitor or field intel, unverified
 *  - wip: the deck marks the slide WIP
 *  - to-confirm: "[to confirm]", "[$ to confirm]", "owner to confirm"
 *  - placeholder: "xx", "[#]", "[name]", "[team to fill]", "not validated"
 *  - proposed: "(proposed) = our suggestion, not yet agreed"
 */
export type Basis =
  | "stated"
  | "derived"
  | "estimate"
  | "directional"
  | "wip"
  | "to-confirm"
  | "placeholder"
  | "proposed";

export type SegmentId = "dn" | "ce" | "mm" | "ps";
export type MotionId = "deepen" | "penetrate" | "acquire";
export type CohortId =
  | "big-ai"
  | "big-gcp"
  | "startups"
  | "samsung"
  | "flagship"
  | "trad-ent"
  | "mid-market"
  | "public";
export type PlayId = "coding" | "live" | "products" | "agentic" | "security" | "unified";
export type PlayState = "lead" | "second" | "none";

/** A labelled number with its provenance. */
export type Figure = {
  label: string;
  value: string;
  note?: string;
  basis?: Basis;
  src?: Src;
};

export type Segment = {
  id: SegmentId;
  name: string;
  short: string;
  /** FY26 / FY27 market, slide 7 chart values ($M). */
  marketFY26: number;
  marketFY27: number;
  /** Appendix A midpoints (slides 44, 48) where they differ from slide 7. */
  midFY26: number;
  midFY27: number | null;
  growthLabel: string;
  tamFY26: [number, number];
  tamFY27: [number, number];
  growthRange: string;
  tokensPct: number;
  seatsPct: number;
  confidence: "High" | "Medium" | "Low";
  buyingPattern: string;
  googleFY26: number;
  shareFY26: number;
  shareRange: [number, number];
  tamGrowth: number;
  sharePlan: number;
  planFY27: number;
  added: number;
  planPctOfTam: string;
  bullets: string[];
  trend: string;
  proof: string;
  rivals: string;
  rivalSignals: string;
  ourPosition: string;
  whatWeDo: string;
};

export type Motion = {
  id: MotionId;
  name: string;
  tagline: string;
  /** Slide 93 label: "Proven muscle" / "Under-built" / "No engine". */
  muscle: string;
  quadrant: string;
  appliesTo: string;
  added: number;
  sharePct: number;
  /** Slide 94: FY26 base and FY27 AI by motion (Deepen includes AutoEver held flat). */
  fy26: number;
  fy27: number;
};

export type BuildStep = {
  label: string;
  value: number;
  basis: Basis;
  note?: string;
};

export type Target = {
  text: string;
  owner?: string;
  basis: Basis;
  src: Src;
};

export type AccountRow = {
  name: string;
  group?: string;
  cells: (string | number | null)[];
  note?: string;
};

export type AccountTable = {
  title: string;
  columns: string[];
  /** Index of numeric columns, for right alignment and tabular figures. */
  numeric: number[];
  rows: AccountRow[];
  total?: AccountRow;
  footnote?: string;
  src: Src;
};

export type Cohort = {
  id: CohortId;
  num: number;
  name: string;
  segment: SegmentId;
  motion: MotionId;
  accounts: string;
  accountsNote?: string;
  fy26: number;
  fy26Precise?: number;
  fy27: number;
  added: number;
  multiple: string;
  assumption: string;
  /** Components of the FY27 number as the deck builds it; they sum to fy27 within rounding. */
  buildUp: BuildStep[];
  buildUpNote?: string;
  /** Current AI run-rate (annualised) and the deck's line-of-sight percentage. */
  runRate: number;
  losPct: number;
  losNote?: string;
  concentration?: string;
  bigMove: string;
  callout: string;
  plays: Record<PlayId, PlayState>;
  /** Lead / second / not-a-focus as printed on the cohort page, where it differs from slide 17. */
  playsOnCohortPage: Record<PlayId, PlayState>;
  tech: string[];
  commercial: string[];
  partner: string[];
  team: { aiSs: string; aiCe: string; fde: string; other?: string };
  coverage: "Direct" | "Direct + partner" | "Partner-led";
  targets: Target[];
  owner: string;
  decisions: string[];
  unresolved: string[];
  leverIds: number[];
  srcMain: Src;
  srcAppendix: Src;
  accountTables: AccountTable[];
};

export type Lever = {
  num: number;
  name: string;
  value: number;
  landsIn: { cohort: CohortId; value: number }[];
  landsInLabel: string;
  mustBeTrue: string;
};

export type TopAccountRow = {
  motion: MotionId;
  segment: SegmentId;
  accounts: string;
  count: number;
  googleToday: number;
  totalAiSpend: number;
  googleSharePct: number;
  anthropicOpenAi: number;
  planBase: number;
  planStretch: number;
  footnotes?: string;
};

export type CompetitorRow = {
  vendor: string;
  spend: [number, number];
  spendLabel: string;
  share: string;
  basis: string;
  confidence: string;
  status: Basis;
  isGoogle?: boolean;
};

export type Play = {
  id: PlayId;
  name: string;
  family: "Model platform business" | "Gemini Enterprise";
  what: string;
  detail: string[];
  leadCount: number;
};

export type Enabler = { name: string; tagline: string; detail: string };

export type Phase = {
  num: number;
  name: string;
  owner: string;
  bullets: string[];
};

export type DeepDive = {
  id: string;
  title: string;
  pod: string;
  cohorts: string;
  wip: boolean;
  tracks: {
    name: string;
    focus: string;
    land: string[];
    build: string[];
    scale: string[];
  }[];
  cadence: string[];
};

export type ResourcingSnapshot = {
  id: string;
  name: string;
  src: Src;
  aiSs: number | null;
  aiCe: number | null;
  fde: string;
  vcbd: number | null;
  note: string;
};

export type CohortStaffing = {
  cohort: CohortId;
  current: { aiSs: number; aiCe: number };
  plan: { aiSs: number; aiCe: string; fde: string };
  target: { aiSs: number; aiCe: number | null };
};

export type Pod = { name: string; makeup: string; focus: string; cohorts: string };

export type Risk = {
  rank: number;
  title: string;
  exposure: string;
  detail: string;
  cohort?: CohortId;
  src: Src;
};

export type AskItem = {
  text: string;
  basis: Basis;
  unlocks: string;
  cohorts: CohortId[];
};

export type Ask = {
  num: number;
  id: "people" | "money" | "cross-team";
  name: string;
  headline: string;
  decision: string;
  decisionBasis: Basis;
  items: AskItem[];
  sourceState: string;
};

export type Conflict = {
  topic: string;
  values: string;
  slides: string;
  treatment: string;
  kind: "conflict" | "rounding" | "wip" | "basis";
};

export type SourceMapRow = { pages: string; content: string };

export type DeepDiveMarket = {
  segment: SegmentId;
  headline: string;
  stats: Figure[];
  methods: { name: string; range: [number, number] }[];
  consensus: [number, number];
  mix: string;
  facts: string[];
  plays: string[];
  soWhat: string;
  src: Src;
};

export type Check = {
  id: string;
  label: string;
  formula: string;
  computed: number;
  stated: number;
  tolerance: number;
  unit: "$M" | "%" | "x" | "count";
  slides: string;
  /** "rounding" when the stated figure is a rounded headline; "exact" otherwise. */
  kind: "exact" | "rounding";
  pass: boolean;
  delta: number;
};
