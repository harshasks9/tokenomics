/**
 * From Clicks to Delegation — structured research layer.
 * Every visible statistic on the site is an object of one of these types and
 * carries `sourceIds` and an evidence `kind`, so the UI can always show where
 * a number came from and how much weight it can bear.
 */

export type SourceType = "government" | "filing" | "academic" | "survey" | "analyst" | "press" | "company-claim";

/**
 * How this research pass reached the source. Primary hosts (census.gov, sec.gov,
 * FRED, Pew…) were blocked by the research environment's network policy, so most
 * sources were read through search-result excerpts; the site shows this honestly.
 */
export type Verification = "primary" | "data-mirror" | "search-excerpt" | "secondary" | "not-accessed" | "prior-knowledge";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  published: string; // YYYY, YYYY-MM or YYYY-MM-DD
  url: string;
  type: SourceType;
  verification: Verification;
  note?: string;
  accessed?: string;
}

/** How much weight a figure can bear. Rendered as a labeled badge everywhere. */
export type EvidenceKind =
  | "measured" // government statistics, filings, measured panels
  | "survey" // stated intent / self-report
  | "company-claim" // company-reported, not independently verified
  | "analyst-estimate"
  | "expert-judgment" // this site's researched judgment
  | "illustrative" // a modeled or hypothetical figure
  | "projection"; // third-party forecast

export type Era = "physical" | "ecommerce" | "agentic";

export type HistPhase = "1994-1999" | "2000-2003" | "2004-2009" | "2010-2015" | "2016-2019" | "2020-2022" | "2023-2026";

export interface HistEvent {
  id: string;
  date: string;
  title: string;
  company?: string;
  market: string;
  phase: HistPhase;
  significance: string;
  sourceIds: string[];
  verification?: "verified" | "unverified";
}

export interface Phase {
  id: HistPhase;
  name: string;
  question: string;
  synthesis: string;
  constraint: string;
  unexpected: string;
  skepticism: { quote: string; who: string; date: string; sourceIds: string[] }[];
}

export type AgentCategory =
  | "discovery" | "assistant" | "browser-agent" | "native-checkout" | "merchant-agent"
  | "consumer-agent" | "payments" | "protocol" | "replenishment" | "policy" | "rollback";

export interface AgentEvent {
  id: string;
  date: string;
  title: string;
  company: string;
  category: AgentCategory;
  significance: string;
  sourceIds: string[];
}

/** 1 Announced · 2 Demonstrated · 3 Limited production · 4 Commercially deployed · 5 Repeat usage · 6 Measurable economic value */
export type Maturity = 1 | 2 | 3 | 4 | 5 | 6;

export interface Initiative {
  id: string;
  company: string;
  name: string;
  what: string;
  launched: string;
  maturity: Maturity;
  maturityEvidence: string;
  companyClaims?: string;
  independentEvidence?: string;
  status2026: string;
  sourceIds: string[];
}

export interface Rollback { date: string; company: string; what: string; sourceIds: string[] }

export type FunnelStage =
  | "access" | "awareness" | "discovery" | "comparison" | "purchase" | "repeat" | "autonomous" | "traffic" | "gmv-share" | "merchant-readiness";

export interface AdoptionMetric {
  id: string;
  stage: FunnelStage;
  label: string;
  geo: string;
  period: string;
  denominator: string;
  definition: string;
  value: string;
  numeric: number | null;
  unit: string;
  kind: EvidenceKind;
  limitations: string;
  sourceIds: string[];
}

export interface SeriesPoint { year: number; pct: number }

export interface CaseStudy {
  id: string;
  name: string;
  market: string;
  archetype: "early-successful" | "early-unsuccessful" | "late-successful" | "late-unsuccessful" | "mixed";
  archetypeWhy: string;
  positionBefore: string;
  thesis: string;
  thesisQuote?: { text: string; who: string; date: string; sourceIds: string[] };
  decision: string;
  immediateBenefit: string;
  hiddenTradeoff: string;
  timeline: { date: string; event: string; sourceIds: string[] }[];
  investments: string;
  anticipatedBehavior: string;
  economics: string;
  outcome: string;
  rootCause: string;
  alternativeInterpretation: string;
  competitorsDidDifferently: string;
  plausibleAlternative: string;
  agenticParallel: string;
  similarity: "strong" | "partial" | "weak";
  similarityWhy: string;
  evidenceFor: string[];
  evidenceAgainst: string[];
  futureConsequence: string;
  lessonTest: string;
  sourceIds: string[];
}

export type AnalogyVerdict = "strong" | "partial" | "weak" | "inversion";

export interface Analogy {
  id: string;
  theme: "discovery" | "trust" | "economics" | "distribution" | "loyalty" | "infrastructure" | "operations";
  historical: string;
  agentic: string;
  question: string;
  changed: string;
  whyMattered: string;
  mechanism: string;
  incomplete: string;
  winners: string;
  losers: string;
  validate: string;
  falsify: string;
  verdict: AnalogyVerdict;
  /** 1–5 each. `differences` is scored so that 5 = differences are small. */
  scores: { evidence: number; mechanism: number; relevance: number; differences: number; predictive: number };
  sourceIds: string[];
}

export interface Paradox { id: string; name: string; claim: string; mechanism: string; hypothesis: string; signal: string }

export interface LadderStage {
  stage: number;
  name: string;
  definition: string;
  ecomEquivalent: string;
  unlockedBy: string;
  whatsNew: string;
  evidence: string;
  sourceIds: string[];
}

export type DelegationLevel = "assist" | "supervised" | "bounded";

export interface DelegationScenario {
  id: string;
  name: string;
  tasks: { task: string; level: DelegationLevel | "human" }[];
  level: DelegationLevel;
  why: string;
  risks: string[];
  commercial: string;
  sourceIds: string[];
}

export interface SurveyFinding {
  id: string;
  finding: string;
  value: string;
  numeric: number | null;
  stage: "research" | "cart" | "approved-purchase" | "autonomous";
  category?: string;
  segment?: string;
  geo: string;
  period: string;
  denominator: string;
  kind: EvidenceKind;
  sourceIds: string[];
}

export interface Category {
  id: string;
  name: string;
  ecomPenetration?: { value: string; geo: string; year: number; sourceIds: string[] };
  traits: Record<"standardization" | "comparability" | "frequency" | "replenishment" | "tactile" | "emotional" | "ticket" | "urgency" | "returns" | "delivery" | "priceTransparency" | "switching", number>;
  ecomEase: number; // 0–100, expert judgment
  agenticSuitability: number; // 0–100, expert judgment
  confidence: "low" | "medium" | "high";
  rationale: string;
  sourceIds: string[];
}

export interface Region {
  id: string;
  name: string;
  ecomHistory: { year: number; pct: number; metric: string; sourceIds: string[] }[];
  indicators: { label: string; value: string; kind: EvidenceKind; sourceIds: string[] }[];
  howEcomDeveloped: string;
  hypotheses: { text: string; for: string; against: string }[];
}

export interface Future {
  id: "assistant" | "delegated" | "autonomous";
  name: string;
  question: string;
  summary: string;
  assumptions: string[];
  prerequisites: string[];
  indicators: string[];
  catalysts: string[];
  constraints: string[];
  winners: string[];
  losers: string[];
  profitability: string;
  welfare: string;
  implications: { data: string; marketing: string; payments: string; distribution: string };
  confidence: "low" | "medium" | "high";
  invalidators: string[];
}

export interface BrokenAnalogy { id: string; title: string; history: string; agentic: string; implication: string }

export interface Counterargument { id: string; claim: string; evidence: string; mattersWhen: string; invalidatedBy: string; strength: "strong" | "moderate" | "weak"; sourceIds: string[] }

export type ClaimStatus = "strong" | "weak" | "contested" | "speculative";
export interface ScoredClaim { id: string; claim: string; status: ClaimStatus; why: string; sourceIds: string[] }

export interface PlayInitiative {
  id: string;
  horizon: 1 | 2 | 3;
  name: string;
  whyNow: string;
  history: string;
  problem: string;
  economicsToday: string;
  mustBeTrue: string;
  builds: string;
  optionality: string;
  dependency: string;
  kpi: string;
  increaseIf: string;
  pauseIf: string;
  /** 1–5: higher = more reversible / cheaper / more optionality / less dependent on consumer adoption */
  matrix: { reversibility: number; cost: number; optionality: number; adoptionIndependence: number };
}

export interface Insight {
  id: string;
  headline: string;
  history: string;
  mechanism: string;
  economics: string;
  counter: string;
  confidence: number; // 0–100
  prediction: string;
  implication: string;
  tests: string; // which hypothesis it tested
  sourceIds: string[];
}

export interface WeakClaim { claim: string; problem: string; action: "strengthened" | "qualified" | "removed"; resolution: string }
