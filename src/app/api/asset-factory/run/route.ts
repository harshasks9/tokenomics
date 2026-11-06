import { rateLimited, runAsset } from "@/lib/asset-factory/run";
import { noStore, readRequest } from "@/lib/asset-factory/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/asset-factory/run — "Try it". Body: { events, assetId, input }.
 * Runs the package's (resolved) instructions on the input with Gemini, or
 * returns its recorded example when no API key is configured.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return Response.json({ ok: false, reason: "Too many runs — try again in a minute." }, { status: 429, headers: noStore });
  const req = await readRequest(request);
  if (!req.ok) return req.response;
  const id = typeof req.body.assetId === "string" ? req.body.assetId : "";
  const input = typeof req.body.input === "string" ? req.body.input : JSON.stringify(req.body.input ?? {});
  const result = await runAsset(req.replayed.world, req.persona, id, input);
  if (!result) return Response.json({ ok: false, reason: "Asset not found or not shared with you." }, { status: 404, headers: noStore });
  return Response.json({ ok: true, result }, { headers: noStore });
}
