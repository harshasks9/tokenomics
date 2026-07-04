// Fallback path: when deep research (research.ts) is unavailable, summarise the
// ingested RSS candidates with one constrained Anthropic call. Mirrors the fetch
// pattern in src/lib/options/ai-judgment.ts.

import type { RawArticle } from "./ingest";
import type { NewsEdition } from "./types";
import { extractJson, buildEdition } from "./compose";

const SYSTEM = `You are MERIDIAN, an AI news intelligence editor writing for Google Cloud AI leadership (GTM, product, regional MDs).
From the candidate articles provided, SELECT the most decision-relevant developments and DISCARD generic AI headlines.
Every item must pass: "Would a Google Cloud AI leader change a decision, talk track, deal strategy, or watchlist because of this?" If not, drop it.

Reason against Google Cloud's portfolio (gemini_models, gemma_open, vertex_ai, model_garden, agent_builder, gemini_enterprise, agentspace, workspace_ai, ces_ccai, tpu_gpu_infra, gke_hypercomputer, inference_econ, security_ai, mandiant_secops, bigquery_data, gtm_partner, marketplace, pricing_licensing) and the competitor set (Microsoft, OpenAI, AWS, Anthropic, Meta, NVIDIA, Databricks, Snowflake, Mistral, Cohere, xAI, Salesforce, ServiceNow, Palantir).

RULES:
- Separate FACT from INFERENCE. "what_happened" is fact grounded ONLY in the provided articles. "why_it_matters" and "impact_on_gcp" are inference and each carry a confidence (high|medium|low).
- Use ONLY the provided article links as sources. Do not invent URLs, quotes, or facts.
- Recommended actions must be concrete and role-addressed with a timebox. Never "monitor the situation" alone.
- verdict is exactly one of: opportunity | risk | urgent | no_action.
- Choose 4 to 6 items, most important first. Write a 1-2 sentence topLine on the day's through-lines.

Return ONLY valid minified JSON (no markdown, no prose) matching:
{"topLine":"string","items":[{"headline":"string","actor":"string","event_type":"string","what_happened":"string","why_it_matters":"string","why_confidence":"high|medium|low","impact_on_gcp":"string","impact_confidence":"high|medium|low","affected_offerings":["string"],"competitive_implications":"string","recommended_actions":[{"role":"string","action":"string","timebox":"string"}],"verdict":"opportunity|risk|urgent|no_action","verdict_confidence":"high|medium|low","relevance":0,"sources":[{"name":"string","url":"string","date":"YYYY-MM-DD"}]}]}`;

async function callAnthropic(model: string, articles: RawArticle[]): Promise<unknown> {
  const candidates = articles.map((a) => ({ title: a.title, source: a.source, url: a.link, published: a.published, summary: a.summary }));
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
      messages: [{ role: "user", content: `Candidate articles (JSON). Compile today's edition.\n\n${JSON.stringify(candidates)}` }],
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Anthropic ${model} failed: ${response.status}`);
  const payload = await response.json();
  const text = payload?.content?.find?.((p: { type: string }) => p.type === "text")?.text;
  if (!text) throw new Error("Anthropic response had no text content");
  return extractJson(text);
}

export async function analyzeToEdition(
  articles: RawArticle[],
  dateInfo: { date: string; label: string; sourceCount: number },
): Promise<NewsEdition | null> {
  if (!process.env.ANTHROPIC_API_KEY || articles.length === 0) return null;
  let raw: unknown;
  let model = "claude-sonnet-4-6";
  try {
    raw = await callAnthropic(model, articles);
  } catch {
    model = "claude-haiku-4-5";
    raw = await callAnthropic(model, articles);
  }
  return buildEdition(raw, dateInfo, "live", model);
}
