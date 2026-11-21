import { NextRequest } from "next/server";
import { LANGUAGES, type LangId } from "@/lib/google-ai/taxonomy";
import { translateBatch } from "@/lib/google-ai/translate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_TEXTS = 80;
const MAX_CHARS = 24000;

/** POST { lang, texts[] } → { translations[], translated, provider }. English text comes back unchanged when translation fails. */
export async function POST(request: NextRequest) {
  let body: { lang?: unknown; texts?: unknown };
  try {
    body = (await request.json()) as { lang?: unknown; texts?: unknown };
  } catch {
    return Response.json({ error: "Send JSON: { lang, texts }" }, { status: 400 });
  }
  const lang = LANGUAGES.find((l) => l.id === body.lang)?.id as LangId | undefined;
  if (!lang || !Array.isArray(body.texts)) return Response.json({ error: "lang and texts are required" }, { status: 400 });
  const texts = body.texts.filter((t): t is string => typeof t === "string" && t.trim().length > 0).slice(0, MAX_TEXTS);
  if (texts.reduce((n, t) => n + t.length, 0) > MAX_CHARS) return Response.json({ error: "Too much text in one request" }, { status: 413 });
  const result = await translateBatch(texts, lang);
  return Response.json(result);
}
