import { META } from "@/lib/google-ai/kb";
import { FEEDS } from "@/lib/google-ai/ingest/registry";
import { readState } from "@/lib/google-ai/ingest/store";

export const dynamic = "force-dynamic";

/** Public, read-only view of the pipeline: what ran, when, what failed, what is waiting for review. */
export async function GET() {
  try {
    const state = await readState();
    return Response.json({
      dataset: META,
      pipeline: {
        store: state.store,
        durable: state.store !== "memory",
        configured: Boolean(process.env.CRON_SECRET) || process.env.NODE_ENV !== "production",
        lastRun: state.lastRun,
        lastSuccessAt: state.lastSuccessAt,
        sources: FEEDS.map((f) => ({ key: f.key, name: f.name, publisher: f.publisher, url: f.url, category: f.category, format: f.format })),
      },
      // Google's own items first, so a busy competitor feed cannot crowd them out of the response.
      items: [...state.items.filter((i) => i.providerId === "google"), ...state.items.filter((i) => i.providerId !== "google")].slice(0, 150),
      alerts: state.alerts.slice(0, 40),
      digest: state.digest,
    });
  } catch (e) {
    return Response.json({ dataset: META, pipeline: null, items: [], alerts: [], error: e instanceof Error ? e.message : String(e) }, { status: 200 });
  }
}
