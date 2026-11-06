import { noStore, readRequest } from "@/lib/asset-factory/server";
import { buildAssetDetail } from "@/lib/asset-factory/views";

export const dynamic = "force-dynamic";

/**
 * POST /api/asset-factory/asset — one package's files, resolved inheritance,
 * lineage and history. Body: { events, assetId } (id or namespace/name).
 * 404 whether the asset is missing or not visible to the signed-in persona.
 */
export async function POST(request: Request) {
  const req = await readRequest(request);
  if (!req.ok) return req.response;
  const id = typeof req.body.assetId === "string" ? req.body.assetId : "";
  const detail = buildAssetDetail(req.replayed.world, req.persona, id);
  if (!detail) return Response.json({ ok: false, reason: "Asset not found or not shared with you." }, { status: 404, headers: noStore });
  return Response.json({ ok: true, persona: req.persona, detail }, { headers: noStore });
}
