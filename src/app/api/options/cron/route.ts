import { NextRequest } from "next/server";
import { runFullScreen } from "@/lib/options/screener";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  if (!cronSecret && process.env.FMP_API_KEY && process.env.POLYGON_API_KEY) {
    return Response.json({ error: "Set CRON_SECRET before enabling live cron refreshes." }, { status: 428 });
  }
  const result = await runFullScreen({ aiJudgment: false });
  return Response.json({ ok: true, generatedAt: result.generatedAt, rows: result.rows.length, mode: result.mode });
}
