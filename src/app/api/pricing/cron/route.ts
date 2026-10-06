import { NextRequest } from "next/server";
import { pricingApiKey, runRefresh, todayUtc } from "@/lib/pricing/refresh";
import { readLatest, storeMode, writeSnapshot } from "@/lib/pricing/store";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // reading ~8 pricing pages via url_context takes a while

async function runJob(force: boolean) {
  const previous = await readLatest();
  const date = todayUtc();

  if (!force && previous && previous.updatedAt.slice(0, 10) === date) {
    return Response.json({
      ok: true,
      skipped: true,
      reason: `Pricing already refreshed on ${date}. Pass ?force=1 to re-run.`,
      updatedAt: previous.updatedAt,
    });
  }

  const snapshot = await runRefresh(previous);
  await writeSnapshot(snapshot);

  return Response.json({
    ok: true,
    updatedAt: snapshot.updatedAt,
    overrides: Object.keys(snapshot.overrides).length,
    confirmed: snapshot.confirmed.length,
    news: snapshot.news.length,
    store: storeMode(),
    note: snapshot.note,
  });
}

function authorize(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // No secret configured: allow only outside production (local development).
    if (process.env.NODE_ENV === "production" && pricingApiKey()) {
      return Response.json(
        { error: "Set CRON_SECRET before enabling live pricing refresh in production." },
        { status: 428 },
      );
    }
    return null;
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// Vercel cron invokes GET with the CRON_SECRET bearer header.
export async function GET(request: NextRequest) {
  const denied = authorize(request);
  if (denied) return denied;
  try {
    return await runJob(request.nextUrl.searchParams.get("force") === "1");
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Pricing refresh failed." },
      { status: 500 },
    );
  }
}

// Manual trigger (same auth rules).
export async function POST(request: NextRequest) {
  return GET(request);
}
