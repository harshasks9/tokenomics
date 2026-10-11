/**
 * ATLAS — documented schema for the AI Intelligence Atlas.
 *
 * Research data lives as JSON in ./data (one file per entity type) and is
 * loaded through ./data.ts; nothing in the UI hard-codes a claim. Every entity
 * has a stable id. Every assertion, relation, event and metric point cites
 * Evidence ids. Research cutoff: 2026-10-11 — nothing after it is used in the
 * historical evaluation; 2027–2030 content lives only in scenarios.
 */

/* ---------- taxonomy ids ---------- */

export type LayerId =
  | "energy" | "semis" | "cloud" | "data" | "architecture" | "training" | "inference"
  | "models" | "platforms" | "agents" | "apps" | "distribution" | "economics" | "society";

export type TopicId =
  | "scaling" | "architecture" | "post-training" | "reasoning" | "data" | "open-weights"
  | "infra-cycle" | "commoditization" | "hyperscalers" | "agents" | "coding" | "app-moats"
  | "enterprise-roi" | "labor" | "agi-timelines" | "safety" | "value-accrual";

export type PeriodId = "p2012" | "p2017" | "p2020" | "p2022" | "p2024" | "p2025" | "p2026";
export type Cohort = "builders" | "researchers" | "investors";

export type Verdict = "correct" | "partial" | "incorrect" | "unresolved";
export type Timing = "early" | "on-time" | "late" | "premature" | "n/a";
export type Confidence = "high" | "medium" | "low";
export type AssertionKind = "prediction" | "opinion" | "aspiration" | "conditional" | "action";
export type Category = "technical" | "economic" | "market" | "adoption" | "governance";

/* ---------- evidence ---------- */

export type Evidence = {
  id: string;
  /** Empty string when no reliable URL could be confirmed (shown as "citation needed"). */
  url: string;
  title: string;
  publisher: string;
  /** ISO date or YYYY-MM / YYYY. */
  date: string;
  /** Thinker id, "outcome", or author/org name. */
  speaker: string;
  type: "paper" | "interview" | "talk" | "essay" | "letter" | "earnings" | "filing" | "testimony"
    | "social" | "book" | "announcement" | "news" | "data";
  /** Primary = the person's own words or acts. */
  primary: boolean;
  /** Exact quote when `verbatim`, otherwise a precise paraphrase. */
  passage: string;
  verbatim: boolean;
  /**
   * fetched = page opened during research; snippet = seen in search results text;
   * recalled = background knowledge not re-confirmed during research (lower trust).
   */
  verification: "fetched" | "snippet" | "recalled";
  note?: string;
};

/* ---------- people ---------- */

export type SelectionScore = [score: number, why: string];

export type Thinker = {
  id: string;
  name: string;
  cohort: Cohort;
  roles: { org: string; title: string; from: string; to: string | null }[];
  bio: string;
  /** Six selection criteria, 1–5 each with justification (transparent methodology). */
  selection: {
    influence: SelectionScore;
    foresight: SelectionScore;
    allocation: SelectionScore;
    contribution: SelectionScore;
    corpus: SelectionScore;
    future: SelectionScore;
  };
  mentalModel: { period: PeriodId; summary: string; evidenceIds: string[]; unverified?: boolean }[];
  reversals: { date: string; from: string; to: string; trigger: string; evidenceIds: string[] }[];
  corpusNotes: string;
};

/* ---------- claims ---------- */

export type Assertion = {
  id: string;
  thinkerId: string;
  date: string;
  claim: string;
  claimIsQuote: boolean;
  kind: AssertionKind;
  category: Category;
  layers: LayerId[];
  topics: TopicId[];
  assumptions: string[];
  predictedOutcome: string;
  horizon: string;
  horizonDate: string | null;
  contextAtTime: string;
  evidenceIds: string[];
  outcome: string;
  outcomeEvidenceIds: string[];
  verdict: Verdict;
  timing: Timing;
  verdictRationale: string;
  confidence: Confidence;
  /** 1–5: 5 = strongly contrarian/novel when made. */
  originality: number;
  /** 1–5: right for the right reasons; null when unresolved. */
  causal: number | null;
  /** 1–5: 5 = precise and falsifiable. */
  specificity: number;
  evolution: string;
  /** Thesis ids this assertion supports (+) or opposes (−). Added in knowledge modeling. */
  theses?: { id: string; stance: "supports" | "opposes" }[];
  /**
   * Set when a claim is shown but excluded from the foresight score, with the reason:
   * self-demonstrated results (announcing your own finished work is not foresight), investments
   * (never proof of belief), advocacy whose outcome the speaker helped cause, governance acts.
   */
  unscored?: string;
  /** Competing readings of the outcome (Prediction Courtroom). */
  interpretations?: string[];
  /** Notes added by the independent audit (stage 6). */
  audit?: string;
};

export type RelationType =
  | "influenced_by" | "agrees_with" | "challenges" | "contradicts" | "invested_in" | "built" | "changed_position";

export type Relation = {
  id: string;
  from: string;
  /** Thinker id, or "org:<name>" / "tech:<name>". */
  to: string;
  type: RelationType;
  date: string;
  note: string;
  evidenceIds: string[];
  inferred: boolean;
};

/* ---------- context ---------- */

export type HistEvent = {
  id: string;
  date: string;
  title: string;
  kind: "research" | "model" | "product" | "infra" | "capital" | "policy" | "market" | "org";
  layers: LayerId[];
  summary: string;
  significance: string;
  magnitude: number;
  evidenceIds: string[];
};

export type LayerState = { state: string; heat: 0 | 1 | 2 | 3 };

export type Period = {
  id: PeriodId;
  label: string;
  range: [string, string];
  boundaryRationale: string;
  consensus: string;
  minorityViews: { view: string; heldBy: string; laterImportance: string }[];
  technologies: string[];
  architectures: string[];
  bottlenecks: { item: string; kind: "technical" | "commercial" | "physical" | "regulatory"; note: string }[];
  perceivedAdvantage: string[];
  actualAdvantage: string[];
  investment: string;
  layers: Record<LayerId, LayerState>;
  commoditized: string[];
  underestimated: string[];
  evidenceIds: string[];
};

export type Metric = {
  id: string;
  label: string;
  unit: string;
  layer: LayerId;
  points: { date: string; value: number; evidenceId: string; note?: string }[];
  caveat: string;
};

/* ---------- knowledge model (authored in stage 2 from the evidence) ---------- */

export type ThesisStatus = "validated" | "partial" | "falsified" | "unresolved" | "contested";

export type Thesis = {
  id: string;
  title: string;
  /** One-line statement of the thesis. */
  statement: string;
  layers: LayerId[];
  topics: TopicId[];
  /** technical vs commercial lens (filter). */
  lens: "technical" | "commercial";
  assumptions: string[];
  /** Thesis ids this one depends on. */
  dependsOn: string[];
  /** Status timeline: what an observer could conclude at each date. */
  statusHistory: { date: string; status: ThesisStatus; note: string; evidenceIds: string[]; eventIds?: string[] }[];
  /** Status as of the cutoff. */
  status: ThesisStatus;
  outcome: string;
  outcomeEvidenceIds: string[];
  supersededBy?: string;
};

export type Debate = {
  id: string;
  title: string;
  question: string;
  layers: LayerId[];
  camps: {
    id: string;
    label: string;
    position: string;
    thinkers: string[];
    assumptions: string[];
    evidenceFor: { text: string; date: string; evidenceIds: string[] }[];
  }[];
  /** Balance of evidence over time: −1 = camp[0] fully favored, +1 = camp[1]. */
  balance: { date: string; value: number; note: string }[];
  bothRight: string;
  status: "resolved" | "leaning" | "unresolved";
  verdictNote: string;
  thesisIds: string[];
};

export type Scenario = {
  id: string;
  name: string;
  tagline: string;
  /** Qualitative confidence band (no calibrated probabilities unless warranted). */
  confidence: "low" | "moderate" | "elevated";
  confidenceNote: string;
  stack: Record<LayerId, { state: string; control: 0 | 1 | 2 | 3; margin: "expanding" | "stable" | "compressing" }>;
  bottlenecks: string[];
  advantage: string[];
  controlPoints: string[];
  winners: { layer: LayerId; who: string }[];
  losers: { layer: LayerId; who: string }[];
  capitalIntensity: string;
  enterprise: string;
  assumptions: string[];
  indicators: { text: string; status: "observed" | "watch" }[];
  invalidators: string[];
  supporters: { thinkerId: string; why: string; assertionIds: string[] }[];
  challengers: { thinkerId: string; why: string; assertionIds: string[] }[];
  thesisIds: string[];
};

export type Implication = {
  id: string;
  lens: "technology" | "economics" | "platforms" | "enterprise" | "investing";
  question: string;
  answer: string;
  strength: "strong" | "moderate" | "weak";
  supporters: string[];
  dissenters: string[];
  basis: string;
  thesisIds: string[];
};

export type Synthesis = {
  questions: { id: string; question: string; answer: string; items?: { title: string; body: string; thinkers?: string[] }[] }[];
  mentalModel: {
    title: string;
    principles: { id: string; title: string; body: string; from: string[]; confidence: Confidence }[];
    discard: { idea: string; heldBy: string[]; why: string }[];
    assumptions: string[];
    uncertainties: string[];
  };
};

/** Per-thinker interpretive judgments used by the scorecard (audit-trailed). */
export type Judgment = {
  thinkerId: string;
  /** 1–5: consistency & intellectual updating. */
  updating: number;
  updatingWhy: string;
  /** Short verdict on whether they were right for the right reasons. */
  rightReasons: string;
  /** The flagship thesis they are most associated with, for the "influential but not held up" ranking. */
  flagshipThesis?: string;
};

/** Technology nodes (Transformer, CUDA/GPUs, RLHF, reasoning models…) linked to builders and events. */
export type Technology = {
  id: string;
  name: string;
  layer: LayerId;
  date: string;
  summary: string;
  /** Thinker ids or "org:<name>" credited with building/popularizing it. */
  builtBy: string[];
  eventIds: string[];
  evidenceIds: string[];
};

/** Methodology record: exclusions, biases, limitations and the stage-6 audit log. */
export type MethodNotes = {
  exclusions: { name: string; cohort: Cohort; why: string }[];
  biases: string[];
  limitations: string[];
  periodRevisions: string[];
  audit: { date: string; finding: string; action: string }[];
};
