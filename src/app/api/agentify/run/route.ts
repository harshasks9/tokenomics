import { rateLimited, runUseCase } from "@/lib/agentify/run";
import { noStore, readRequest } from "@/lib/agentify/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** POST /api/agentify/run — "Try it" on a use-case package. Body: { useCaseId, input }. */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return Response.json({ ok: false, reason: "Too many runs — try again in a minute." }, { status: 429, headers: noStore });
  const req = await readRequest(request);
  if (!req.ok) return req.response;
  const input = typeof req.body.input === "string" ? req.body.input : JSON.stringify(req.body.input ?? {});
  const result = await runUseCase(typeof req.body.useCaseId === "string" ? req.body.useCaseId : "", input);
  if (!result) return Response.json({ ok: false, reason: "Not found." }, { status: 404, headers: noStore });
  return Response.json({ ok: true, result }, { headers: noStore });
}
