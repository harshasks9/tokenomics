import { GoogleGenAI } from "@google/genai";
import { buildMockBrief } from "./fixtures";
import type { BriefCategory, DailyBrief, NewsItem, RelatedLink } from "./types";

const MODEL = process.env.BRIEF_GEMINI_MODEL ?? "gemini-3.5-flash";

/**
 * Curated high-signal AI news sources the model reads live via the
 * url_context tool. Google Search grounding requires paid quota on AI Studio
 * keys, so ingestion instead fetches these pages directly — which also
 * matches the product's "prefer primary sources" rule. Override with a
 * comma-separated BRIEF_SOURCES env var.
 */
const DEFAULT_SOURCES = [
  "https://blog.google/technology/ai/",
  "https://openai.com/news/",
  "https://www.anthropic.com/news",
  "https://blogs.microsoft.com/ai/",
  "https://aws.amazon.com/blogs/machine-learning/",
  "https://blogs.nvidia.com/",
  "https://ai.meta.com/blog/",
  "https://techcrunch.com/category/artificial-intelligence/",
  "https://www.theverge.com/ai-artificial-intelligence",
  "https://arstechnica.com/ai/",
];

function newsSources(): string[] {
  const raw = process.env.BRIEF_SOURCES;
  if (!raw) return DEFAULT_SOURCES;
  const urls = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("http"));
  return urls.length > 0 ? urls : DEFAULT_SOURCES;
}

const CATEGORIES: BriefCategory[] = [
  "Models & Research",
  "Infrastructure & Chips",
  "Enterprise & Cloud",
  "Agents & Developer Tools",
  "Policy & Regulation",
  "Security & Trust",
  "Funding & Business",
];

const BRIEF_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["signal_summary", "items", "coverage_note"],
  properties: {
    signal_summary: {
      type: "array",
      description: "3-5 executive bullets summarizing the day's most important AI themes.",
      items: { type: "string" },
    },
    coverage_note: {
      type: ["string", "null"],
      description:
        "Null when 10 high-quality stories were found. Otherwise a short explanation of why fewer than 10 items are included.",
    },
    items: {
      type: "array",
      description: "Up to 10 news items, ranked by importance (rank 1 = most important).",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "rank",
          "headline",
          "summary",
          "why_it_matters",
          "source_name",
          "source_url",
          "published_at",
          "category",
          "confidence_score",
          "reliability_score",
          "google_cloud_interpretation",
          "relevant_google_cloud_products",
          "competitive_implications",
          "field_action",
          "deeper_analysis",
          "related_links",
        ],
        properties: {
          rank: { type: "integer" },
          headline: { type: "string" },
          summary: {
            type: "string",
            description: "2-3 sentences: what happened, factual, sourced.",
          },
          why_it_matters: {
            type: "string",
            description: "1-2 sentences on significance for enterprise AI.",
          },
          source_name: { type: "string" },
          source_url: { type: "string", description: "Full http(s) URL of the primary source." },
          published_at: {
            type: "string",
            description: "ISO 8601 publish date/time of the primary source.",
          },
          category: { type: "string", enum: CATEGORIES },
          confidence_score: {
            type: "number",
            description: "0-1: confidence the story is accurately represented.",
          },
          reliability_score: {
            type: "number",
            description: "0-1: reliability of the primary source.",
          },
          google_cloud_interpretation: {
            type: "string",
            description:
              "What this means for Google Cloud and its customers. Use 'Limited direct Google Cloud implication.' when there is no meaningful connection.",
          },
          relevant_google_cloud_products: {
            type: "array",
            items: { type: "string" },
            description: "Relevant Google Cloud products/platforms; empty when none apply.",
          },
          competitive_implications: {
            type: "string",
            description:
              "Effect on the competitive landscape (Microsoft, AWS, OpenAI, Anthropic, Meta, NVIDIA, etc.).",
          },
          field_action: {
            type: "string",
            description:
              "One practical action for a Google Cloud seller, partner, or customer engineer. Empty string when none applies.",
          },
          deeper_analysis: {
            type: "string",
            description:
              "3-6 sentences of deeper analysis: market, customer, and ecosystem impact; related companies and products.",
          },
          related_links: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "url"],
              properties: {
                title: { type: "string" },
                url: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

function systemPrompt(date: string) {
  return `You are the research engine behind "AI Daily Brief", a five-minute executive briefing on the day's most important AI news, read by enterprise technology leaders and Google Cloud field teams.

Today's date (UTC): ${date}.

## Task
Fetch the source pages listed in the user message with the url_context tool, gather AI news published within roughly the last 24 hours (up to 36 hours to catch time zones), then produce the Top 10 most important items, ranked by importance — not recency alone.

## Method
1. Fetch every listed index page. If a page fails to load, skip it and move on.
2. From the fetched pages, identify candidate stories from the last ~24-36 hours.
3. For the strongest candidates, fetch the individual article URL to confirm the publish date and details before including it. Never include an item whose article page you did not fetch.

## Source standards
The listed sources mix primary sources (company blogs, official announcements) and highly reliable technology/business publications — prefer the most primary source available for each story. Avoid: rumor-only posts, unverified social media threads, duplicative syndications, and articles with no original reporting. Deduplicate overlapping coverage of the same story — one item per story, citing the best source, with alternates in related_links.

## Ranking criteria (in order)
1. Impact on enterprise AI adoption
2. Impact on AI infrastructure, models, chips, platforms, or cloud
3. Impact on regulation, security, privacy, or trust
4. Impact on developers, agents, copilots, productivity, or enterprise workflows
5. Strategic relevance to Google Cloud customers
6. Competitive relevance
7. Novelty and significance

## Content rules
- Every item must be grounded in a source you actually found via search, with a real URL and publish date. Never invent facts, URLs, dates, or Google Cloud positioning.
- summary: 2-3 sentences, plain factual "what happened".
- why_it_matters: 1-2 sentences, enterprise lens.
- deeper_analysis: 3-6 sentences covering market, customer, and ecosystem impact and related companies/products.
- If fewer than 10 stories from the last 24-36 hours meet the quality bar (slow news days, weekends, holidays), you may include the most important items from up to the last 7 days — but you MUST say so in coverage_note (e.g. "Quiet news cycle; includes significant items from the past week."). If even that yields fewer than 10 quality items, return fewer and explain why in coverage_note. Never pad with weak items, and never present older news as breaking.

## Google Cloud interpretation
For each item, interpret through the lens of Google Cloud AI leadership: customer impact, which Google Cloud offerings are relevant (e.g. Gemini, Vertex AI, Agent Builder, Google Agentspace, BigQuery, AlloyDB, TPU, GKE, Cloud Run, Security Command Center, Mandiant, Workspace, Chrome Enterprise, Google Distributed Cloud), competitive implications versus Microsoft, AWS, OpenAI, Anthropic, Meta, NVIDIA, Databricks, Snowflake and major AI startups, and one practical field action.
Do not force a connection: when none exists, set google_cloud_interpretation to "Limited direct Google Cloud implication.", leave relevant_google_cloud_products empty, and keep field_action an empty string.

Work efficiently: fetch the index pages first, then only the article pages for your strongest candidates. Return only the structured JSON result.`;
}

type ParsedBrief = {
  signal_summary: string[];
  coverage_note: string | null;
  items: Array<Omit<NewsItem, "id">>;
};

function extractJson(text: string): ParsedBrief {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as ParsedBrief;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Model response did not contain a JSON object.");
    }
    return JSON.parse(trimmed.slice(start, end + 1)) as ParsedBrief;
  }
}

function clamp01(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

function sanitizeLinks(links: unknown): RelatedLink[] {
  if (!Array.isArray(links)) return [];
  return links
    .filter(
      (l): l is RelatedLink =>
        !!l && typeof l.title === "string" && typeof l.url === "string" && l.url.startsWith("http"),
    )
    .slice(0, 5);
}

function normalize(parsed: ParsedBrief, date: string): DailyBrief {
  const items: NewsItem[] = parsed.items
    .filter((item) => item.headline && item.source_url?.startsWith("http"))
    .slice(0, 10)
    .map((item, index) => ({
      ...item,
      id: `${date}-${index + 1}`,
      rank: index + 1,
      category: CATEGORIES.includes(item.category) ? item.category : "Enterprise & Cloud",
      confidence_score: clamp01(item.confidence_score),
      reliability_score: clamp01(item.reliability_score),
      relevant_google_cloud_products: Array.isArray(item.relevant_google_cloud_products)
        ? item.relevant_google_cloud_products.filter((p): p is string => typeof p === "string")
        : [],
      related_links: sanitizeLinks(item.related_links),
    }));

  if (items.length === 0) {
    throw new Error("Model returned no usable news items.");
  }

  const signal = Array.isArray(parsed.signal_summary)
    ? parsed.signal_summary.filter((s): s is string => typeof s === "string").slice(0, 5)
    : [];

  return {
    date,
    generated_at: new Date().toISOString(),
    signal_summary: signal,
    items,
    coverage_note:
      items.length < 10
        ? (parsed.coverage_note ??
          `Only ${items.length} stories met the quality bar for this brief.`)
        : (parsed.coverage_note ?? null),
    mode: "live",
  };
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function briefApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
}

/**
 * Runs the full daily pipeline: live fetch of curated sources (url_context
 * tool) → dedupe/rank (model-side) → structured Top 10 with Google Cloud
 * interpretation. Falls back to clearly marked mock data when no Gemini API
 * key is configured (local development only).
 */
export async function generateDailyBrief(date = todayUtc()): Promise<DailyBrief> {
  const apiKey = briefApiKey();
  if (!apiKey) {
    return buildMockBrief(date);
  }

  const client = new GoogleGenAI({ apiKey });
  const interaction = await client.interactions.create({
    model: MODEL,
    system_instruction: systemPrompt(date),
    input: `Generate the AI Daily Brief for ${date}. Fetch these source pages for AI news from the last 24 hours and return the structured brief:\n${newsSources().join("\n")}`,
    tools: [{ type: "url_context" }],
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: BRIEF_SCHEMA,
    },
    store: false,
  });

  const text = interaction.output_text;
  if (!text) {
    throw new Error(`Gemini returned no text output (status: ${interaction.status ?? "unknown"}).`);
  }

  return normalize(extractJson(text), date);
}
