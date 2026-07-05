import { NextRequest } from "next/server";
import { briefApiKey, generateDailyBrief, todayUtc } from "@/lib/brief/generate";
import { readBrief, storeMode, writeBrief } from "@/lib/brief/store";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // web-search research runs take several minutes

async function runJob(force: boolean) {
  const date = todayUtc();

  if (!force) {
    const existing = await readBrief(date);
    if (existing) {
      return Response.json({
        ok: true,
        skipped: true,
        reason: `Brief for ${date} already exists. Pass ?force=1 to regenerate.`,
        date,
      });
    }
  }

  const brief = await generateDailyBrief(date);
  await writeBrief(brief);

  return Response.json({
    ok: true,
    date: brief.date,
    items: brief.items.length,
    mode: brief.mode,
    store: storeMode(),
    generated_at: brief.generated_at,
  });
}

function authorize(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // No secret configured: allow only outside production (local development).
    if (process.env.NODE_ENV === "production" && briefApiKey()) {
      return Response.json(
        { error: "Set CRON_SECRET before enabling live brief generation in production." },
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
      { error: error instanceof Error ? error.message : "Brief generation failed." },
      { status: 500 },
    );
  }
}

// Manual trigger (same auth rules).
export async function POST(request: NextRequest) {
  return GET(request);
}
