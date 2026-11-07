import { noStore, readRequest } from "@/lib/agentify/server";
import { getUseCaseDetail } from "@/lib/agentify/views";

export const dynamic = "force-dynamic";

/** POST /api/agentify/usecase — one use-case package's files. Body: { useCaseId }. */
export async function POST(request: Request) {
  const req = await readRequest(request);
  if (!req.ok) return req.response;
  const d = getUseCaseDetail(typeof req.body.useCaseId === "string" ? req.body.useCaseId : "");
  if (!d) return Response.json({ ok: false, reason: "Not found." }, { status: 404, headers: noStore });
  return Response.json({ ok: true, detail: d }, { headers: noStore });
}
