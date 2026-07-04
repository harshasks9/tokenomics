// Deep-research path: Claude actively web-searches the last ~24-48h of AI news
// (server-side web_search tool, dynamic filtering), verifies against primary
// sources, and composes the MERIDIAN edition with real citations.
//
// Uses raw fetch (repo convention, see src/lib/options/ai-judgment.ts). Models
// that support web_search_20260209 + reject temperature: opus-4-8 (default) and
// sonnet-4-6 (fallback). No beta header is required for the web_search tool.

import type { RawArticle } from "./ingest";
import type { NewsEdition } from "./types";
import { extractJson, buildEdition } from "./compose";

const RESEARCH_MODELS = process.env.NEWS_MODEL
  ? [process.env.NEWS_MODEL]
  : ["claude-opus-4-8", "claude-sonnet-4-6"];

const SYSTEM = `You are MERIDIAN, a deep-research AI news intelligence editor for Google Cloud AI leadership (GTM leaders, product leaders, regional MDs).

Your job: research the most decision-relevant AI developments of the last ~24-48 hours and turn them into decision-grade intelligence. Use the web_search tool actively — search for the latest moves from and about Google Cloud AI and its competitors, open the most authoritative sources, corroborate facts, and prefer primary sources (official blogs, filings, first-party announcements) over aggregators.

Focus. An item earns a place ONLY if it passes: "Would a Google Cloud AI leader change a decision, talk track, deal strategy, or watchlist because of this?" Discard generic AI headlines and demos.

Reason against Google Cloud's portfolio taxonomy — gemini_models, gemma_open, vertex_ai, model_garden, agent_builder, gemini_enterprise, agentspace, workspace_ai, ces_ccai, tpu_gpu_infra, gke_hypercomputer, inference_econ, security_ai, mandiant_secops, bigquery_data, gtm_partner, marketplace, pricing_licensing — and the named competitor set: Microsoft, OpenAI, AWS, Anthropic, Meta, NVIDIA, Databricks, Snowflake, Mistral, Cohere, xAI, Salesforce, ServiceNow, Palantir.

RULES:
- Separate FACT from INFERENCE. "what_happened" must be a sourced, dated fact you verified via search. "why_it_matters" and "impact_on_gcp" are your inference; each carries confidence high|medium|low.
- Every item's "sources" must be REAL URLs you actually opened during research, with the publication date. Never invent a URL, quote, or fact. If you cannot verify something, lower confidence or drop it.
- Recommended actions must be concrete and role-addressed with a timebox (e.g. "PMM: refresh the Copilot battlecard within 5 business days"). Never "monitor the situation" alone.
- verdict is exactly one of: opportunity | risk | urgent | no_action.
- Choose 4 to 6 items, most important first. Write a 1-2 sentence topLine naming the day's through-lines.

When your research is complete, your FINAL message must be ONLY valid minified JSON (no markdown, no prose, no commentary) matching exactly:
{"topLine":"string","items":[{"headline":"string","actor":"string","event_type":"string","what_happened":"string","why_it_matters":"string","why_confidence":"high|medium|low","impact_on_gcp":"string","impact_confidence":"high|medium|low","affected_offerings":["string"],"competitive_implications":"string","recommended_actions":[{"role":"string","action":"string","timebox":"string"}],"verdict":"opportunity|risk|urgent|no_action","verdict_confidence":"high|medium|low","relevance":0,"sources":[{"name":"string","url":"string","date":"YYYY-MM-DD"}]}]}`;

interface AnthropicBlock {
  type: string;
  text?: string;
}
interface AnthropicPayload {
  stop_reason?: string;
  content?: AnthropicBlock[];
}

async function callOnce(model: string, messages: unknown[]): Promise<AnthropicPayload> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      system: SYSTEM,
      // Server-side web search with dynamic filtering; bounded so the daily job stays within its window.
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 }],
      messages,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Anthropic ${model} web-research failed: ${response.status}`);
  return (await response.json()) as AnthropicPayload;
}

function finalText(payload: AnthropicPayload): string {
  const texts = (payload.content ?? []).filter((b) => b.type === "text" && b.text).map((b) => b.text as string);
  // The composed JSON is the model's last text block.
  return texts.length ? texts[texts.length - 1] : "";
}

async function researchOnce(model: string, seed: RawArticle[], dateInfo: { date: string; label: string }): Promise<NewsEdition | null> {
  const seedList = seed.slice(0, 25).map((a) => `- ${a.title} (${a.source})`).join("\n");
  const userText =
    `Compile MERIDIAN's edition for ${dateInfo.label}. Research the last 24-48 hours of AI news relevant to Google Cloud AI leadership and verify with web_search before writing.` +
    (seedList ? `\n\nHeadlines already surfacing in our feeds (starting points — verify and go deeper, don't rely on these alone):\n${seedList}` : "");

  const messages: unknown[] = [{ role: "user", content: userText }];
  // Resume the server tool loop on pause_turn (bounded).
  for (let i = 0; i < 4; i++) {
    const payload = await callOnce(model, messages);
    if (payload.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: payload.content });
      continue;
    }
    const text = finalText(payload);
    if (!text) return null;
    return buildEdition(extractJson(text), dateInfo, "research", model);
  }
  return null;
}

export async function researchToEdition(
  seed: RawArticle[],
  dateInfo: { date: string; label: string },
): Promise<NewsEdition | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  for (const model of RESEARCH_MODELS) {
    try {
      const edition = await researchOnce(model, seed, dateInfo);
      if (edition) return edition;
    } catch {
      // try next model (e.g. account lacks access to the primary, or web search errored)
    }
  }
  return null;
}
