// MERIDIAN news intelligence — shared types.
// Facts are sourced; inference is labelled with confidence. See public/news/index.html §11.

export type Verdict = "opportunity" | "risk" | "urgent" | "no_action";
export type Confidence = "high" | "medium" | "low";

export interface SourceRef {
  name: string;
  url: string;
  date?: string; // YYYY-MM-DD when known
}

export interface RecommendedAction {
  role: string;
  action: string;
  timebox?: string;
}

export interface NewsItem {
  headline: string;
  actor: string; // canonical actor, e.g. "OpenAI", "Microsoft", "Google/Alphabet"
  event_type: string; // e.g. model_release, pricing_change, partnership...
  what_happened: string; // FACT — sourced only
  why_it_matters: string; // INFERENCE
  why_confidence: Confidence;
  impact_on_gcp: string; // INFERENCE
  impact_confidence: Confidence;
  affected_offerings: string[]; // portfolio taxonomy values
  competitive_implications: string;
  recommended_actions: RecommendedAction[];
  verdict: Verdict;
  verdict_confidence: Confidence;
  sources: SourceRef[];
  relevance?: number; // 0-100, optional
}

export interface NewsEdition {
  date: string; // YYYY-MM-DD (SGT)
  label: string; // e.g. "Saturday, 5 July 2026"
  topLine: string;
  items: NewsItem[];
  itemCount: number;
  generatedAt: string; // ISO timestamp
  mode: "live" | "research" | "fallback";
  model?: string;
  sourceCount?: number;
}

// Lightweight index entry for the history/archive list.
export interface HistoryEntry {
  date: string;
  label: string;
  itemCount: number;
  topLine: string;
  generatedAt: string;
  mode: NewsEdition["mode"];
}
