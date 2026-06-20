import { NextRequest } from "next/server";
import { getLastManualRefreshAt, setLastManualRefreshAt } from "@/lib/options/cache";
import { SCREEN_CONFIG } from "@/lib/options/config";
import { isOptionsRequestAuthenticated } from "@/lib/options/auth";
import { runFullScreen } from "@/lib/options/screener";

export async function POST(request: NextRequest) {
  if (!(await isOptionsRequestAuthenticated(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = Date.now();
  const last = await getLastManualRefreshAt();
  const remainingMs = SCREEN_CONFIG.manualRefreshWindowMs - (now - last);
  if (remainingMs > 0) {
    return Response.json(
      { error: "Refresh is rate-limited", retryAfterSeconds: Math.ceil(remainingMs / 1000) },
      { status: 429 },
    );
  }
  const body = await request.json().catch(() => ({}));
  await setLastManualRefreshAt(now);
  const result = await runFullScreen({ aiJudgment: Boolean(body.aiJudgment) });
  return Response.json(result);
}
