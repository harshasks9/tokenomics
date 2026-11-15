import { NextRequest } from "next/server";
import { runIngestion } from "@/lib/google-ai/ingest/run";
import { storeMode } from "@/lib/google-ai/ingest/store";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorize(request: NextRequest): Response | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Without a secret the job only runs outside production (local development).
    if (process.env.NODE_ENV === "production") {
      return Response.json({ error: "Set CRON_SECRET to enable the ingestion job in production." }, { status: 428 });
    }
    return null;
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const denied = authorize(request);
  if (denied) return denied;
  try {
    const status = await runIngestion();
    return Response.json({
      ok: status.ok,
      store: storeMode(),
      fetched: status.fetched,
      failed: status.failed,
      newItems: status.newItems,
      alerts: status.alerts,
      priceChecks: status.priceChecks.length,
      startedAt: status.startedAt,
      finishedAt: status.finishedAt,
      failures: status.feeds.filter((f) => !f.ok).map((f) => ({ source: f.sourceKey, error: f.error })),
    });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
