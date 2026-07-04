// Analysis + composition: one constrained Anthropic call turns candidate
// articles into a MERIDIAN edition. Mirrors the fetch pattern already used by
// src/lib/options/ai-judgment.ts (x-api-key + anthropic-version). Fact and
// inference are separate fields; the model must fill them accordingly.

import type { RawArticle } from "./ingest";
import type { NewsEdition, NewsItem } from "./types";

const SYSTEM = `You are MERIDIAN, an AI news intelligence editor writing for Google Cloud AI leadership (GTM, product, regional MDs).
From the candidate articles provided, SELECT the most decision-relevant developments and DISCARD generic AI headlines.
Every item must pass: "Would a Google Cloud AI leader change a decision, talk track, deal strategy, or watchlist because of this?" If not, drop it.

Reason against Google Cloud's portfolio (gemini_models, gemma_open, vertex_ai, model_garden, agent_builder, gemini_enterprise, agentspace, workspace_ai, ces_ccai, tpu_gpu_infra, gke_hypercomputer, inference_econ, security_ai, mandiant_secops, bigquery_data, gtm_partner, marketplace, pricing_licensing) and the competitor set (Microsoft, OpenAI, AWS, Anthropic, Meta, NVIDIA, Databricks, Snowflake, Mistral, Cohere, xAI, Salesforce, ServiceNow, Palantir).

RULES:
- Separate FACT from INFERENCE. "what_happened" is fact grounded ONLY in the provided articles. "why_it_matters" and "impact_on_gcp" are inference and each carry a confidence (high|medium|low).
- Use ONLY the provided article links as sources. Do not invent URLs, quotes, or facts. If unsure, be conservative and lower confidence.
- Recommended actions must be concrete and role-addressed with a timebox (e.g. "PMM: refresh Copilot battlecard within 5 business days"). Never "monitor the situation" alone.
- verdict is exactly one of: opportunity | risk | urgent | no_action.
- Choose 4 to 6 items, most important first. Write a 1-2 sentence topLine on the day's through-lines.

Return ONLY valid minified JSON (no markdown, no prose) matching:
{"topLine":"string","items":[{"headline":"string","actor":"string","event_type":"string","what_happened":"string","why_it_matters":"string","why_confidence":"high|medium|low","impact_on_gcp":"string","impact_confidence":"high|medium|low","affected_offerings":["string"],"competitive_implications":"string","recommended_actions":[{"role":"string","action":"string","timebox":"string"}],"verdict":"opportunity|risk|urgent|no_action","verdict_confidence":"high|medium|low","relevance":0,"sources":[{"name":"string","url":"string","date":"YYYY-MM-DD"}]}]}`;

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model output");
  return JSON.parse(raw.slice(start, end + 1));
}

async function callAnthropic(model: string, articles: RawArticle[]): Promise<{ raw: unknown; model: string }> {
  const candidates = articles.map((a) => ({
    title: a.title,
    source: a.source,
    url: a.link,
    published: a.published,
    summary: a.summary,
  }));
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4500,
      temperature: 0.2,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Candidate articles (JSON). Compile today's edition.\n\n${JSON.stringify(candidates)}`,
        },
      ],
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Anthropic ${model} failed: ${response.status}`);
  }
  const payload = await response.json();
  const text = payload?.content?.find?.((p: { type: string }) => p.type === "text")?.text;
  if (!text) throw new Error("Anthropic response had no text content");
  return { raw: extractJson(text), model };
}

const CONF = new Set(["high", "medium", "low"]);
const VERDICTS = new Set(["opportunity", "risk", "urgent", "no_action"]);

function coerceItem(x: Record<string, unknown>): NewsItem | null {
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

export async function analyzeToEdition(
  articles: RawArticle[],
  dateInfo: { date: string; label: string; sourceCount: number },
): Promise<NewsEdition | null> {
  if (!process.env.ANTHROPIC_API_KEY || articles.length === 0) return null;

  let result: { raw: unknown; model: string };
  try {
    result = await callAnthropic("claude-sonnet-4-6", articles);
  } catch {
    result = await callAnthropic("claude-haiku-4-5", articles);
  }

  const obj = result.raw as Record<string, unknown>;
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
    mode: "live",
    model: result.model,
    sourceCount: dateInfo.sourceCount,
  };
}
