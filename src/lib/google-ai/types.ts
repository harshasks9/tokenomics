/**
 * GOOGLE AI INTELLIGENCE HUB — canonical data model.
 *
 * One versioned knowledge base feeds every page, the search index, the
 * analyst and the time machine. Nothing on the site keeps its own copy of a
 * fact: pages read entities, relationships and records by canonical id.
 *
 * Three rules the types enforce:
 *  1. Every fact carries an evidence label and at least one source id.
 *  2. Every dated fact separates when it was PUBLISHED from when it takes
 *     EFFECT (prices, availability and retirements are routinely announced
 *     ahead of their effective date).
 *  3. How we accessed a source is recorded separately from what the source
 *     is — an official page we could only read through a search index is not
 *     the same evidence as the page fetched directly.
 */

// ───────────────────────── evidence ─────────────────────────

/** The four labels shown on every claim. */
export type EvidenceLabel =
  | "verified-fact" // stated by a primary document for something only that party can decide (a price, an API id, a date)
  | "provider-claim" // the provider's own description of quality, performance, scale or intent
  | "independent-measurement" // measured or reported by a party other than the provider
  | "analyst-interpretation"; // this site's own judgment — never presented as fact

/** How the research or ingestion step actually read the source. */
export type SourceAccess =
  | "primary" // page fetched directly and read
  | "search-excerpt" // read only through search-engine extracts of the page
  | "secondary" // known only from third-party reporting about it
  | "prior-knowledge"; // not re-read during this research cycle

export type VerificationState = "verified" | "partially-verified" | "unverified" | "disputed";
export type Confidence = "high" | "medium" | "low";

export type SourceKind =
  | "pricing-page"
  | "official-docs"
  | "release-notes"
  | "official-blog"
  | "model-card"
  | "paper"
  | "filing"
  | "press"
  | "benchmark"
  | "analyst"
  | "repo"
  | "event";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** ISO date the document was published (or last updated, for living pages). */
  published?: string;
  kind: SourceKind;
  /** True when the publisher is the provider the document describes. */
  firstParty: boolean;
  access: SourceAccess;
  /** ISO date we last read it. */
  lastChecked: string;
}

/** A point-in-time capture of a monitored source (written by the ingestion pipeline). */
export interface SourceSnapshot {
  sourceKey: string;
  url: string;
  fetchedAt: string;
  ok: boolean;
  httpStatus?: number;
  contentHash?: string;
  bytes?: number;
  error?: string;
}

/** One sentence-level fact. The atom of the knowledge base. */
export interface Claim {
  text: string;
  label: EvidenceLabel;
  sourceIds: string[];
  /** ISO date the claim was true as of (defaults to the source's date). */
  asOf?: string;
  confidence?: Confidence;
}

// ───────────────────────── entities (graph nodes) ─────────────────────────

export type LayerId =
  | "infrastructure"
  | "research"
  | "models"
  | "platform"
  | "agents"
  | "enterprise"
  | "consumer"
  | "ecosystem";

export type EntityKind =
  | "provider"
  | "model-family"
  | "model"
  | "product"
  | "component"
  | "infrastructure"
  | "research"
  | "protocol"
  | "plan"
  | "partner";

export type EntityStatus =
  | "ga"
  | "preview"
  | "experimental"
  | "announced"
  | "research"
  | "deprecated"
  | "retired";

export type Modality = "text" | "image" | "audio" | "video" | "pdf" | "code" | "embedding" | "3d" | "action";

export type ModelCategory =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "embedding"
  | "open-weight"
  | "robotics"
  | "world-model"
  | "specialized";

export interface ModelSpec {
  /** Exact identifiers as served. First is the primary. */
  apiIds: string[];
  category: ModelCategory;
  tier?: "flagship" | "mid" | "light" | "specialized";
  modalitiesIn: Modality[];
  modalitiesOut: Modality[];
  contextTokens?: number | null;
  maxOutputTokens?: number | null;
  reasoning?: "always" | "optional" | "none";
  toolUse?: boolean;
  structuredOutput?: boolean;
  openWeights?: boolean;
  license?: string;
  knowledgeCutoff?: string;
  /** Facts we looked for and could not confirm — rendered as gaps, never guessed. */
  unverified?: string[];
}

/** The descriptive parts of a dossier. The rest is derived from records and the graph. */
export type DossierKey =
  | "whyItExists"
  | "problem"
  | "howItWorks"
  | "inputsOutputs"
  | "architecture"
  | "users"
  | "useCases"
  | "differentiators"
  | "limitations"
  | "competitorNotes";

export interface FormerName {
  name: string;
  from?: string;
  to?: string;
  sourceIds: string[];
}

export interface Entity {
  id: string;
  kind: EntityKind;
  /** Canonical id of the provider entity that owns it. */
  providerId: string;
  name: string;
  /** Search aliases: short names, code names, exact API ids. */
  aliases: string[];
  formerNames?: FormerName[];
  /** Where it sits in the eight-layer view (Google entities only). */
  layer?: LayerId;
  /** Sub-group inside the layer, used to lay the explorer out. */
  group?: string;
  /** Model family for models; parent product for components. */
  parentId?: string;
  /** One or two sentences: what it is. */
  summary: string;
  status: EntityStatus;
  /** ISO date first publicly announced or released. */
  introducedAt?: string;
  /** Set to "month" when only the month of introduction is known (the day in introducedAt is then a placeholder). */
  introducedPrecision?: "day" | "month";
  /** ISO date retired / shut down (when it has happened or is scheduled). */
  retiredAt?: string;
  dossier?: Partial<Record<DossierKey, Claim[]>>;
  model?: ModelSpec;
  verification: VerificationState;
  sourceIds: string[];
  lastCheckedAt: string;
}

// ───────────────────────── relationships (graph edges) ─────────────────────────

export type RelationType =
  | "part-of"
  | "powers" // from model/infra → product that uses it
  | "runs-on"
  | "served-via" // model → serving surface
  | "succeeds" // newer → older
  | "renamed-from"
  | "competes-with"
  | "integrates"
  | "depends-on"
  | "implements" // product → protocol
  | "derived-from" // product ← research
  | "partnered-with";

export interface Relationship {
  id: string;
  from: string;
  to: string;
  type: RelationType;
  note?: string;
  conditions?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  label: EvidenceLabel;
  confidence: Confidence;
  sourceIds: string[];
}

// ───────────────────────── dated records ─────────────────────────

export type PriceSurface =
  | "gemini-api" // Gemini Developer API (AI Studio)
  | "agent-platform" // Google Cloud serving (Gemini Enterprise Agent Platform, formerly Vertex AI)
  | "first-party-api" // a competitor's own API
  | "third-party-host"
  | "subscription"
  | "infrastructure";

export type PriceMeter =
  | "input"
  | "output"
  | "cache-read"
  | "cache-write"
  | "cache-storage-hour"
  | "audio-input"
  | "audio-output"
  | "image-output"
  | "video-output-second"
  | "per-image"
  | "seat-month"
  | "grounding-1k"
  | "compute-hour"
  | "other";

export type PriceUnit = "usd-per-1m-tokens" | "usd-per-image" | "usd-per-second" | "usd-per-user-month" | "usd-per-1k-requests" | "usd-per-hour" | "usd-other";

export type ServiceTier = "standard" | "batch" | "priority" | "flex" | "provisioned";

export interface PriceRecord {
  id: string;
  entityId: string;
  providerId: string;
  surface: PriceSurface;
  meter: PriceMeter;
  unit: PriceUnit;
  price: number;
  tier: ServiceTier;
  /** "global" endpoint vs a regional / non-global endpoint, where priced apart. */
  region?: "global" | "regional";
  /** Applies only to prompts above this many input tokens (long-context tier). */
  aboveContextTokens?: number;
  /** Any other qualifier in the provider's words ("introductory", "annual commitment"). */
  condition?: string;
  publishedAt?: string;
  /** First day this price applies. */
  effectiveFrom: string;
  /** Last day this price applies (inclusive); absent = open-ended. */
  effectiveTo?: string;
  label: EvidenceLabel;
  sourceIds: string[];
  lastCheckedAt: string;
  note?: string;
}

export interface BenchmarkDef {
  id: string;
  name: string;
  measures: string;
  unit: string;
  higherBetter: boolean;
  maintainer: string;
  url: string;
  /** What the number cannot tell you. */
  limitations: string;
}

export interface BenchmarkResult {
  id: string;
  modelId: string;
  benchmarkId: string;
  benchmarkVersion?: string;
  score: number;
  /** ISO date the result was measured or published. */
  date: string;
  reporter: "independent" | "provider";
  /** Exact model version / snapshot evaluated, when stated. */
  modelVersion?: string;
  scaffold?: string;
  reasoningConfig?: string;
  sourceIds: string[];
  limitations?: string;
}

export type AvailabilityStage = "ga" | "preview" | "experimental" | "waitlist" | "announced";

export interface AvailabilityRecord {
  id: string;
  entityId: string;
  /** Where: a canonical entity id (a surface or product) or a plain label. */
  surface: string;
  stage: AvailabilityStage;
  audience?: string;
  regions?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  label: EvidenceLabel;
  sourceIds: string[];
}

export type LifecycleType =
  | "announced"
  | "preview"
  | "ga"
  | "updated"
  | "renamed"
  | "price-change"
  | "deprecated"
  | "retirement-scheduled"
  | "retired";

export interface LifecycleEvent {
  id: string;
  entityId: string;
  type: LifecycleType;
  /** When it was made public. */
  date: string;
  /** When it takes effect, if different (a scheduled retirement or price change). */
  effectiveDate?: string;
  detail: string;
  label: EvidenceLabel;
  sourceIds: string[];
}

// ───────────────────────── announcements ─────────────────────────

export type AnnouncementType =
  | "model-launch"
  | "model-update"
  | "pricing"
  | "availability"
  | "deprecation"
  | "product-launch"
  | "product-update"
  | "rename"
  | "infrastructure"
  | "research"
  | "benchmark"
  | "partnership"
  | "customer"
  | "acquisition"
  | "safety-governance"
  | "policy-regulatory"
  | "open-source"
  | "event"
  | "financial";

export type RadarArea =
  | "models"
  | "infrastructure"
  | "developer-platforms"
  | "enterprise-agents"
  | "workspace"
  | "search-consumer"
  | "multimodal"
  | "safety-governance"
  | "research";

/** One canonical development. Many source documents cluster into one of these. */
export interface Announcement {
  id: string;
  title: string;
  /** Date first made public. */
  date: string;
  /** Date it takes effect, when different. */
  effectiveDate?: string;
  providerId: string;
  types: AnnouncementType[];
  areas: RadarArea[];
  layers: LayerId[];
  entityIds: string[];
  /** A. What is confirmed. */
  summary: Claim[];
  /** B. Before and after. */
  beforeAfter?: { before: string; after: string };
  /** C. How it works. */
  technical?: Claim[];
  /** F. Positioning against alternatives. */
  competitive?: Claim[];
  /** G. So what — always analyst interpretation. */
  implications?: Claim[];
  /** H. Pricing and availability. */
  pricingAvailability?: Claim[];
  /** I. What is not known or not confirmed. */
  uncertainty?: string[];
  /** J. What happened next. */
  followUps?: { date: string; note: string; sourceIds: string[] }[];
  /** Editorial weight 1–5 used to rank briefs. An editorial judgment, shown as such. */
  importance: 1 | 2 | 3 | 4 | 5;
  verification: VerificationState;
  sourceIds: string[];
  firstSeenAt: string;
  lastCheckedAt: string;
}

export type TimelineTrack = "macro" | "model" | "platform" | "competitive" | "pricing" | "infrastructure" | "research";

/** Historical milestones older or broader than the announcement feed. */
export interface TimelineEvent {
  id: string;
  date: string;
  precision: "day" | "month" | "year";
  track: TimelineTrack;
  providerId: string;
  title: string;
  detail: string;
  entityIds: string[];
  significance: 1 | 2 | 3;
  label: EvidenceLabel;
  sourceIds: string[];
}

// ───────────────────────── analysis ─────────────────────────

export interface AnalystAssessment {
  id: string;
  /** Entity id or battleground id the assessment is about. */
  subject: string;
  title: string;
  body: string;
  confidence: Confidence;
  date: string;
  sourceIds: string[];
}

export interface Battleground {
  id: string;
  name: string;
  question: string;
  google: Claim[];
  rivals: { providerId: string; position: Claim[] }[];
  /** Entities that carry Google's position here. */
  entityIds: string[];
  assessment: string;
  watch: string[];
}

export interface WorkloadScenario {
  id: string;
  name: string;
  description: string;
  requestsPerMonth: number;
  inputTokens: number;
  outputTokens: number;
  /** Share of input tokens served from cache (0–1). */
  cachedShare: number;
  /** Share of requests that can run in batch (0–1). */
  batchShare: number;
  /** Reasoning tokens as a multiple of visible output tokens. */
  thinkingRatio: number;
  /** Average attempts per completed task (retries, tool loops). */
  attemptsPerTask: number;
}

export interface EnterpriseWorkload {
  id: string;
  name: string;
  industries: string[];
  functions: string[];
  architecture: "assistant" | "rag" | "single-agent" | "multi-agent" | "voice" | "batch-pipeline";
  need: string;
  /** Canonical entity ids forming the reference stack, in order. */
  stack: { entityId: string; role: string }[];
  customer: string;
  sales: string;
  technical: string;
  commercial: string;
  competitive: string;
  execution: string;
  risks: string[];
  /** Editorial rating of business value, 1–5. An analyst judgment, shown as such. */
  value: 1 | 2 | 3 | 4 | 5;
  /** Example workload in the pricing calculator that approximates this one. */
  scenarioId?: string;
  sourceIds: string[];
}

/** Editorial state of an auto-detected item (written by the ingestion pipeline). */
export interface EditorialReview {
  itemId: string;
  state: "detected" | "needs-review" | "published" | "rejected";
  reason?: string;
  reviewedAt?: string;
}

export interface DatasetMeta {
  version: string;
  /** ISO date the curated dataset was last verified end to end. */
  curatedAt: string;
  /** Research window the announcement feed covers. */
  coverageFrom: string;
  coverageTo: string;
  notes: string[];
}
