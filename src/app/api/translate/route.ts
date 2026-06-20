import { NextResponse } from "next/server";

const MAX_TEXTS = 96;
const MAX_TOTAL_CHARACTERS = 40_000;
const CHUNK_SIZE = 850;
const GROUP_SIZE = 720;

const cache = new Map<string, string>();

const protectedTerms = [
  "Gemini Enterprise Agent Platform",
  "Artificial Analysis",
  "Google Cloud",
  "Vertex AI",
  "Flash-Lite",
  "Gemini",
  "Claude",
  "OpenAI",
  "ChatGPT",
  "Sonnet",
  "Opus",
  "Flash",
  "GEAP",
  "WealthAI",
  "ShopOS",
  "PulseAI",
  "CivicOS",
  "FactoryOS",
  "SignalOS",
];

function protectTerms(text: string) {
  const replacements: string[] = [];
  let protectedText = text;

  protectedTerms.forEach((term) => {
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    protectedText = protectedText.replace(pattern, (match) => {
      const token = `ZXQBRAND${replacements.length}QXZ`;
      replacements.push(match);
      return token;
    });
  });

  return {
    text: protectedText,
    restore(translated: string) {
      return replacements.reduce(
        (value, term, index) =>
          value.replace(new RegExp(`ZXQBRAND\\s*${index}\\s*QXZ`, "gi"), term),
        translated,
      );
    },
  };
}

function chunks(text: string) {
  if (text.length <= CHUNK_SIZE) return [text];

  const result: string[] = [];
  let remaining = text;
  while (remaining.length > CHUNK_SIZE) {
    const window = remaining.slice(0, CHUNK_SIZE);
    const breakAt = Math.max(
      window.lastIndexOf("\n"),
      window.lastIndexOf(". "),
      window.lastIndexOf("! "),
      window.lastIndexOf("? "),
      window.lastIndexOf(" "),
    );
    const end = breakAt > CHUNK_SIZE * 0.55 ? breakAt + 1 : CHUNK_SIZE;
    result.push(remaining.slice(0, end));
    remaining = remaining.slice(end);
  }
  if (remaining) result.push(remaining);
  return result;
}

async function translateChunk(text: string) {
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: "ja",
    dt: "t",
    q: text,
  });
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
    { cache: "no-store", signal: AbortSignal.timeout(8_000) },
  );

  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const payload = (await response.json()) as unknown[][];
  const segments = Array.isArray(payload?.[0]) ? payload[0] : [];
  return segments
    .map((segment) => (Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : ""))
    .join("");
}

async function translate(text: string) {
  const cached = cache.get(text);
  if (cached) return cached;

  const protectedValue = protectTerms(text);
  const translated = (
    await Promise.all(chunks(protectedValue.text).map(translateChunk))
  ).join("");
  const restored = protectedValue.restore(translated) || text;
  cache.set(text, restored);
  return restored;
}

function groupTexts(texts: string[]) {
  const groups: string[][] = [];
  let current: string[] = [];
  let currentLength = 0;

  texts.forEach((text) => {
    const nextLength = text.length + 24;
    if (current.length && currentLength + nextLength > GROUP_SIZE) {
      groups.push(current);
      current = [];
      currentLength = 0;
    }
    current.push(text);
    currentLength += nextLength;
  });
  if (current.length) groups.push(current);
  return groups;
}

async function translateGroup(texts: string[]) {
  if (texts.length === 1) return [await translate(texts[0])];

  const combined = texts
    .map((text, index) => `ZXQITEM${index}QXZ\n${text}`)
    .join("\n");
  const protectedValue = protectTerms(combined);
  const translated = protectedValue.restore(await translateChunk(protectedValue.text));
  const markers = [...translated.matchAll(/ZXQITEM\s*(\d+)\s*QXZ/gi)];

  if (markers.length !== texts.length) {
    return Promise.all(texts.map(translate));
  }

  return markers.map((marker, markerIndex) => {
    const index = Number(marker[1]);
    const start = (marker.index ?? 0) + marker[0].length;
    const end = markers[markerIndex + 1]?.index ?? translated.length;
    const value = translated.slice(start, end).trim();
    cache.set(texts[index], value || texts[index]);
    return { index, value: value || texts[index] };
  }).sort((a, b) => a.index - b.index).map((item) => item.value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { texts?: unknown };
    if (!Array.isArray(body.texts)) {
      return NextResponse.json({ error: "texts must be an array" }, { status: 400 });
    }

    const texts = [...new Set(body.texts)]
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, MAX_TEXTS);
    const totalCharacters = texts.reduce((sum, value) => sum + value.length, 0);

    if (totalCharacters > MAX_TOTAL_CHARACTERS) {
      return NextResponse.json({ error: "translation batch is too large" }, { status: 413 });
    }

    const groupedTranslations = await Promise.all(
      groupTexts(texts).map(async (group) => {
        try {
          return await translateGroup(group);
        } catch {
          return group;
        }
      }),
    );
    const translations = groupedTranslations.flat();

    return NextResponse.json(
      { translations },
      { headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } },
    );
  } catch {
    return NextResponse.json({ error: "invalid translation request" }, { status: 400 });
  }
}
