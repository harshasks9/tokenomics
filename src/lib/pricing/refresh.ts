import { GoogleGenAI } from "@google/genai";
import type { LiveSnapshot, Model, NewsItem, ProviderId } from "./types";
import { CATALOG, CATALOG_VERSION } from "./catalog";
import { PROVIDERS } from "./presets";

/**
 * Daily refresh. Mirrors the brief pipeline: Gemini reads official pricing
 * pages live via the url_context tool and returns a structured extraction.
 * We then apply a deliberately conservative policy:
 *
 *  - Only models already in the catalog can receive price overrides, matched
 *    by exact API identifier; new models surface as news, never as rows.
 *  - An override is applied only when the extraction confidence is "high",
 *    the value is a finite positive number, and it differs from the current
 *    value by more than rounding noise.
 *  - Every applied override generates a news item with the before/after
 *    values and the source URL, so the change log is the audit trail.
 *
 * Without an API key the job writes a "no-op" snapshot stamped with the time
 * so the UI can still show when the last check ran.
 */

const MODEL = process.env.PRICING_GEMINI_MODEL ?? process.env.BRIEF_GEMINI_MODEL ?? "gemini-3.5-flash";

export function pricingApiKey() {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
}

export function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

/** Official pricing pages the refresh reads. Override with PRICING_SOURCES. */
export const DEFAULT_PRICING_SOURCES: { provider: ProviderId; url: string }[] = [
  { provider: "google", url: "https://ai.google.dev/gemini-api/docs/pricing" },
  { provider: "openai", url: "https://platform.openai.com/docs/pricing" },
  { provider: "anthropic", url: "https://platform.claude.com/docs/en/about-claude/pricing" },
  { provider: "deepseek", url: "https://api-docs.deepseek.com/quick_start/pricing" },
  { provider: "mistral", url: "https://mistral.ai/pricing" },
  { provider: "xai", url: "https://docs.x.ai/docs/models" },
  { provider: "alibaba", url: "https://www.alibabacloud.com/help/en/model-studio/models" },
  { provider: "meta", url: "https://www.together.ai/pricing" },
];

function sourcePages() {
  const raw = process.env.PRICING_SOURCES;
  if (!raw) return DEFAULT_PRICING_SOURCES;
  const urls = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("http"));
  return urls.length ? urls.map((url) => ({ provider: "industry" as const, url })) : DEFAULT_PRICING_SOURCES;
}

type Extraction = {
  models: {
    api_id: string;
    input_per_m: number | null;
    output_per_m: number | null;
    cached_input_per_m: number | null;
    batch_discount: number | null;
    confidence: "high" | "medium" | "low";
    source_url: string;
    note: string | null;
  }[];
  news: {
    date: string;
    provider: string;
    kind: "price-cut" | "price-increase" | "new-model" | "deprecation" | "pricing-change" | "note";
    title: string;
    body: string;
    source_url: string;
    confidence: "high" | "medium" | "low";
  }[];
};

const EXTRACTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["models", "news"],
  properties: {
    models: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["api_id", "input_per_m", "output_per_m", "cached_input_per_m", "batch_discount", "confidence", "source_url", "note"],
        properties: {
          api_id: { type: "string", description: "Exact API identifier from the provided catalog list." },
          input_per_m: { type: ["number", "null"], description: "USD per 1M input tokens at the standard (lowest) context tier." },
          output_per_m: { type: ["number", "null"] },
          cached_input_per_m: { type: ["number", "null"], description: "USD per 1M cached input tokens read from cache; null if not offered." },
          batch_discount: { type: ["number", "null"], description: "Fraction off for batch processing, e.g. 0.5; null if none." },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          source_url: { type: "string" },
          note: { type: ["string", "null"] },
        },
      },
    },
    news: {
      type: "array",
      description: "Pricing or catalog changes visible on the pages dated within the last 45 days. Empty if none.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["date", "provider", "kind", "title", "body", "source_url", "confidence"],
        properties: {
          date: { type: "string", description: "ISO date (YYYY-MM-DD)." },
          provider: { type: "string" },
          kind: { type: "string", enum: ["price-cut", "price-increase", "new-model", "deprecation", "pricing-change", "note"] },
          title: { type: "string" },
          body: { type: "string" },
          source_url: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
  },
};

function catalogListForPrompt() {
  return CATALOG.filter((m) => !m.thirdPartyPricing)
    .map((m) => `- ${m.apiId} (${m.name}, ${m.provider}; current: in $${m.pricing.input ?? "n/a"}, out $${m.pricing.output ?? "n/a"})`)
    .join("\n");
}

async function extractWithGemini(): Promise<Extraction> {
  const ai = new GoogleGenAI({ apiKey: pricingApiKey() });
  const pages = sourcePages();
  const prompt = [
    `Today is ${todayUtc()}. You are auditing published API pricing for large language models.`,
    `Read ONLY the official pricing pages below (via url_context) and report the CURRENT list prices for the catalog models named here. Do not infer from memory; if a model is not on the page, omit it. Use the standard (lowest) context tier and first-party pricing only.`,
    ``,
    `Pages:`,
    ...pages.map((p) => `- ${p.url}`),
    ``,
    `Catalog models (match by exact API identifier; current values shown for reference only):`,
    catalogListForPrompt(),
    ``,
    `Also list any pricing changes, new models, or deprecations announced on these pages in the last 45 days as news items.`,
    `Return JSON matching the schema. Prices are USD per 1M tokens as plain numbers.`,
  ].join("\n");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      tools: [{ urlContext: {} }],
      responseMimeType: "application/json",
      responseSchema: EXTRACTION_SCHEMA,
      temperature: 0,
    },
  });
  const text = response.text ?? "{}";
  return JSON.parse(text) as Extraction;
}

const EPS = 0.0005;
const changed = (a: number | null | undefined, b: number | null | undefined) =>
  a != null && b != null && Math.abs(a - b) > EPS;

function providerName(id: string) {
  return PROVIDERS.find((p) => p.id === id)?.name ?? id;
}

function pct(from: number, to: number) {
  return `${to < from ? "−" : "+"}${Math.abs(((to - from) / from) * 100).toFixed(0)}%`;
}

export function applyExtraction(previous: LiveSnapshot | null, ex: Extraction): LiveSnapshot {
  const now = new Date().toISOString();
  const date = now.slice(0, 10);
  const overrides: LiveSnapshot["overrides"] = { ...(previous?.overrides ?? {}) };
  const news: NewsItem[] = [];
  const confirmed: string[] = [];

  const byApiId = new Map<string, Model>(CATALOG.map((m) => [m.apiId, m]));

  for (const row of ex.models) {
    const model = byApiId.get(row.api_id);
    if (!model || row.confidence !== "high") continue;
    const current = { ...model.pricing, ...(overrides[model.id] ?? {}) };
    const patch: Partial<typeof current> = {};
    const lines: string[] = [];

    if (Number.isFinite(row.input_per_m) && row.input_per_m! > 0 && changed(current.input, row.input_per_m)) {
      patch.input = row.input_per_m!;
      lines.push(`input $${current.input} → $${row.input_per_m} (${pct(current.input!, row.input_per_m!)})`);
    }
    if (Number.isFinite(row.output_per_m) && row.output_per_m! > 0 && changed(current.output, row.output_per_m)) {
      patch.output = row.output_per_m!;
      lines.push(`output $${current.output} → $${row.output_per_m} (${pct(current.output!, row.output_per_m!)})`);
    }
    if (row.cached_input_per_m != null && Number.isFinite(row.cached_input_per_m) && changed(current.cachedInput ?? null, row.cached_input_per_m)) {
      patch.cachedInput = row.cached_input_per_m;
      lines.push(`cached input $${current.cachedInput ?? "n/a"} → $${row.cached_input_per_m}`);
    }

    if (lines.length === 0) {
      confirmed.push(model.id);
      continue;
    }

    overrides[model.id] = { ...(overrides[model.id] ?? {}), ...patch, lastVerified: date };
    const down = lines.some((l) => l.includes("−")) && !lines.some((l) => l.includes("+"));
    const up = lines.some((l) => l.includes("+")) && !lines.some((l) => l.includes("−"));
    news.push({
      date,
      title: `${model.name}: ${down ? "price cut" : up ? "price increase" : "pricing change"}`,
      body: `${providerName(model.provider)} list price changed on the official pricing page — ${lines.join("; ")}.${row.note ? ` ${row.note}` : ""}`,
      provider: model.provider,
      kind: down ? "price-cut" : up ? "price-increase" : "pricing-change",
      source: { label: "Official pricing page", url: row.source_url },
      generated: true,
    });
  }

  for (const n of ex.news) {
    if (n.confidence === "low") continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date)) continue;
    const provider = (PROVIDERS.find((p) => p.id === n.provider || p.name.toLowerCase().includes(n.provider.toLowerCase()))?.id ?? "industry") as NewsItem["provider"];
    news.push({
      date: n.date,
      title: n.title,
      body: n.body,
      provider,
      kind: n.kind,
      source: { label: "Source", url: n.source_url },
      generated: true,
    });
  }

  // Merge with previous generated news, de-duplicated by date+title, newest first, capped.
  const prior = previous?.news ?? [];
  const seen = new Set<string>();
  const merged = [...news, ...prior].filter((n) => {
    const k = `${n.date}|${n.title}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  merged.sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    updatedAt: now,
    overrides,
    news: merged.slice(0, 60),
    confirmed,
    note: `Checked ${ex.models.length} catalog rows against ${sourcePages().length} official pages; applied ${news.filter((n) => n.generated && n.source?.label === "Official pricing page").length} override(s). Catalog ${CATALOG_VERSION}.`,
  };
}

export async function runRefresh(previous: LiveSnapshot | null): Promise<LiveSnapshot> {
  if (!pricingApiKey()) {
    return {
      updatedAt: new Date().toISOString(),
      overrides: previous?.overrides ?? {},
      news: previous?.news ?? [],
      confirmed: [],
      note: "No GEMINI_API_KEY configured — refresh ran in no-op mode (catalog values unchanged).",
    };
  }
  const ex = await extractWithGemini();
  return applyExtraction(previous, ex);
}
