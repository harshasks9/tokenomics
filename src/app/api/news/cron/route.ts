import { NextRequest } from "next/server";
import { runNewsPipeline } from "@/lib/news/pipeline";

// Daily pipeline endpoint. Invoked by Vercel Cron at 01:00 UTC (09:00 SGT).
// Protected with CRON_SECRET (same convention as the options cron).
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await runNewsPipeline();
    return Response.json({
      ok: result.ok,
      generatedAt: result.edition?.generatedAt ?? null,
      date: result.edition?.date ?? null,
      items: result.edition?.itemCount ?? 0,
      feeds: `${result.feedsOk}/${result.feedsTotal}`,
      candidates: result.candidates,
      mode: result.edition?.mode ?? "none",
      reason: result.reason,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "pipeline failed" },
      { status: 500 },
    );
  }
}
