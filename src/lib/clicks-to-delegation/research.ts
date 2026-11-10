/**
 * Typed access to the curated research streams in ./data (generated from the
 * five research passes; every sourceId resolves in sources.json).
 */
import agenticRaw from "./data/agentic.json";
import casesRaw from "./data/cases.json";
import consumerRaw from "./data/consumer.json";
import economicsRaw from "./data/economics.json";
import historyRaw from "./data/history.json";
import type {
  AdoptionMetric, AgentEvent, CaseStudy, Category, DelegationLevel, HistEvent, Initiative, LadderStage, Phase, Region, Rollback, SurveyFinding,
} from "./types";

type Ref = { sourceIds: string[] };

/* ── History ─────────────────────────────────────────────── */
export interface QuarterPoint { q: string; pct: number }
export const US_ECOM = historyRaw.usEcomShare as unknown as {
  definition: string; sourceIds: string[]; series: QuarterPoint[];
  thresholds: { pct: number; firstQuarter: string; yearsSince1995: number; label?: string; note?: string; sourceIds: string[] }[];
  keyPoints?: unknown; notes: string;
};
/** Quarter string → decimal year at quarter midpoint (1999Q4 → 1999.875). */
export const qToYear = (q: string) => Number(q.slice(0, 4)) + (Number(q.slice(5)) - 1) / 4 + 0.125;
export const HIST_EVENTS = historyRaw.timeline as unknown as HistEvent[];
export const PHASES = historyRaw.phases as unknown as Phase[];
export const US_INTERNET = historyRaw.usInternet as unknown as { metric: string; series: ({ year: number; pct: number; note?: string } & Ref)[] }[];
export const OTHER_MARKETS = historyRaw.otherMarkets as unknown as { geo: string; metric: string; denominator: string; series: ({ year: number; pct: number } & Partial<Ref>)[]; sourceIds?: string[]; limitations?: string }[];
export const AVAIL_VS_ADOPTION = historyRaw.availabilityVsAdoption as unknown as ({ stage: string; date: string; evidence: string; verification?: string } & Ref)[];
export const HIST_CONFLICTS = historyRaw.conflicts as unknown as string[];

/* ── Agentic commerce, 2022–2026 ─────────────────────────── */
export const AGENT_EVENTS = agenticRaw.timeline as unknown as AgentEvent[];
export const INITIATIVES = agenticRaw.initiatives as unknown as Initiative[];
export const ROLLBACKS = agenticRaw.rollbacks as unknown as Rollback[];
export const AGENT_METRICS = (agenticRaw.metrics as unknown as AdoptionMetric[]).map((m) => ({ ...m, label: m.label ?? m.definition }));
export const PROBLEMS = agenticRaw.problems as unknown as ({ id: string; problem: string; evidence: string; whyNew: string } & Ref)[];
export const AGENT_CONFLICTS = agenticRaw.conflicts as unknown as string[];

/* ── Cases ───────────────────────────────────────────────── */
export const CASES = casesRaw.cases as unknown as CaseStudy[];

/* ── Consumer, categories, regions ───────────────────────── */
export const SURVEYS = consumerRaw.delegationSurveys as unknown as SurveyFinding[];
export const TRUST_HISTORY = consumerRaw.trustHistory as unknown as ({ barrier: string; whatResolvedIt: string; date: string } & Ref)[];
export const LADDER = consumerRaw.ladder as unknown as (Omit<LadderStage, "unlockedBy" | "whatsNew"> & Partial<LadderStage>)[];
export const DELEGATION_SCENARIOS = consumerRaw.scenarios as unknown as { id: string; name: string; level: DelegationLevel; why: string; risks: string[]; commercial: string; sourceIds: string[] }[];
export const CATEGORIES = consumerRaw.categories as unknown as (Category & { ecomPenetration?: Category["ecomPenetration"] & { numeric?: number; note?: string } })[];
export const REGIONS = consumerRaw.regions as unknown as (Omit<Region, "indicators"> & { indicators: ({ label: string; value: string; kind?: string } & Ref)[] })[];
export const CONSUMER_GAPS = consumerRaw.gaps as unknown as string[];
export const CONSUMER_CONFLICTS = consumerRaw.conflicts as unknown as string[];

/* ── Economics ───────────────────────────────────────────── */
export type Provenance = "researched" | "assumed" | "illustrative";
export interface ParamDefault { value: number; provenance: Provenance; sourceIds: string[]; note?: string }
export interface SimDefault { model: string; label: string; params: Record<string, ParamDefault> }
export const SIM_DEFAULTS = economicsRaw.simulatorDefaults as unknown as SimDefault[];
export const BENCHMARKS = economicsRaw.benchmarks as unknown as ({ id: string; metric: string; value: string; low: number | null; high: number | null; unit: string; context: string; period: string; kind: string } & Ref)[];
export const AGENT_FEES = economicsRaw.agenticFees as unknown as ({ who: string; what: string; value: string; status: "disclosed" | "reported" | "not-disclosed"; date: string } & Ref)[];
export const VALUE_CAPTURE = economicsRaw.valueCaptureHistory as unknown as ({ finding: string } & Ref)[];
export const ECON_CONFLICTS = economicsRaw.conflicts as unknown as string[];

/** Research-process notes surfaced in the methodology section. */
export const RESEARCH_GAPS = {
  history: (historyRaw.meta as { gaps?: unknown }).gaps,
  consumer: consumerRaw.gaps,
};
