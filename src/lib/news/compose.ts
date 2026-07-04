// Shared: turn a model's JSON output into a validated NewsEdition. Used by both
// the RSS-analysis path (analyze.ts) and the deep-research path (research.ts).

import type { NewsEdition, NewsItem } from "./types";

export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model output");
  return JSON.parse(raw.slice(start, end + 1));
}

const CONF = new Set(["high", "medium", "low"]);
const VERDICTS = new Set(["opportunity", "risk", "urgent", "no_action"]);

export function coerceItem(x: Record<string, unknown>): NewsItem | null {
  const headline = String(x.headline ?? "").trim();
  const what = String(x.what_happened ?? "").trim();
  if (!headline || !what) return null;
  const conf = (v: unknown) => (CONF.has(String(v)) ? (String(v) as NewsItem["why_confidence"]) : "medium");
  const actions = Array.isArray(x.recommended_actions)
    ? x.recommended_actions
        .map((a) => (a && typeof a === "object" ? (a as Record<string, unknown>) : {}))
        .map((a) => ({ role: String(a.role ?? "").trim(), action: String(a.action ?? "").trim(), timebox: a.timebox ? String(a.timebox) : undefined }))
        .filter((a) => a.role && a.action)
    : [];
  const sources = Array.isArray(x.sources)
    ? x.sources
        .map((s) => (s && typeof s === "object" ? (s as Record<string, unknown>) : {}))
        .map((s) => ({ name: String(s.name ?? "source").trim(), url: String(s.url ?? "").trim(), date: s.date ? String(s.date) : undefined }))
        .filter((s) => s.url.startsWith("http"))
    : [];
  return {
    headline,
    actor: String(x.actor ?? "").trim() || "—",
    event_type: String(x.event_type ?? "").trim() || "development",
    what_happened: what,
    why_it_matters: String(x.why_it_matters ?? "").trim(),
    why_confidence: conf(x.why_confidence),
    impact_on_gcp: String(x.impact_on_gcp ?? "").trim(),
    impact_confidence: conf(x.impact_confidence),
    affected_offerings: Array.isArray(x.affected_offerings) ? x.affected_offerings.map(String).slice(0, 6) : [],
    competitive_implications: String(x.competitive_implications ?? "").trim(),
    recommended_actions: actions,
    verdict: VERDICTS.has(String(x.verdict)) ? (String(x.verdict) as NewsItem["verdict"]) : "no_action",
    verdict_confidence: conf(x.verdict_confidence),
    sources,
    relevance: Number.isFinite(Number(x.relevance)) ? Number(x.relevance) : undefined,
  };
}

export function buildEdition(
  raw: unknown,
  dateInfo: { date: string; label: string; sourceCount?: number },
  mode: NewsEdition["mode"],
  model: string,
): NewsEdition | null {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(obj.items) ? obj.items : [];
  const items = rawItems
    .map((it) => coerceItem((it ?? {}) as Record<string, unknown>))
    .filter((it): it is NewsItem => it !== null)
    .slice(0, 6);
  if (items.length === 0) return null;
  return {
    date: dateInfo.date,
    label: dateInfo.label,
    topLine: String(obj.topLine ?? "").trim() || "Today's most decision-relevant AI developments for Google Cloud AI leadership.",
    items,
    itemCount: items.length,
    generatedAt: new Date().toISOString(),
    mode,
    model,
    sourceCount: dateInfo.sourceCount,
  };
}
