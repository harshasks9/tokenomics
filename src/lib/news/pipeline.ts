// Orchestrator: ingest (seed) -> deep research (web search) -> fallback RSS
// analysis -> store. Returns the edition (or null when no LLM key / no material,
// in which case the static baked edition on the page remains the fallback).

import { ingestArticles } from "./ingest";
import { researchToEdition } from "./research";
import { analyzeToEdition } from "./analyze";
import { writeEdition } from "./store";
import type { NewsEdition } from "./types";

// Publish anchor is 09:00 Asia/Singapore (UTC+8). Compute "today" in SGT.
export function todaySGT(now = new Date()): { date: string; label: string } {
  const sgt = new Date(now.getTime() + 8 * 3600 * 1000);
  const date = sgt.toISOString().slice(0, 10); // YYYY-MM-DD in SGT
  const label = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC", // sgt already offset; format its UTC fields
  }).format(sgt);
  return { date, label };
}

export interface PipelineResult {
  ok: boolean;
  edition: NewsEdition | null;
  feedsOk: number;
  feedsTotal: number;
  candidates: number;
  path?: "research" | "fallback";
  reason?: string;
}

export async function runNewsPipeline(): Promise<PipelineResult> {
  // Ingest is best-effort: it seeds the research and backs the fallback path.
  const { articles, feedsOk, feedsTotal } = await ingestArticles();
  const { date, label } = todaySGT();

  // 1) Deep research (Claude actively web-searches + cites). Seeded by feeds.
  let edition = await researchToEdition(articles, { date, label });
  let path: PipelineResult["path"] = "research";

  // 2) Fallback: summarise the ingested candidates directly.
  if (!edition) {
    path = "fallback";
    edition = await analyzeToEdition(articles, { date, label, sourceCount: feedsOk });
  }

  if (!edition) {
    return {
      ok: false,
      edition: null,
      feedsOk,
      feedsTotal,
      candidates: articles.length,
      reason: "no_edition (missing ANTHROPIC_API_KEY, no web access, or no material items)",
    };
  }

  if (edition.sourceCount == null) edition.sourceCount = feedsOk;
  await writeEdition(edition);
  return { ok: true, edition, feedsOk, feedsTotal, candidates: articles.length, path };
}
