import { attempt } from "@/lib/agentify/engine";
import { noStore, readRequest } from "@/lib/agentify/server";
import { buildView } from "@/lib/agentify/views";
import type { Action, Event } from "@/lib/agentify/types";

export const dynamic = "force-dynamic";

/** POST /api/agentify — sync and act as the signed-in persona (Deal Check session required). */
export async function POST(request: Request) {
  const req = await readRequest(request);
  if (!req.ok) return req.response;
  const { body, persona, replayed } = req;
  const { world, events, rejected } = replayed;
  if (body.action && typeof body.action === "object") {
    const event: Event = { actor: persona, action: body.action as Action };
    const r = attempt(world, event);
    if (!r.ok) return Response.json({ ok: false, reason: r.reason, persona, events, rejected, view: buildView(world, persona) }, { status: 403, headers: noStore });
    return Response.json({ ok: true, persona, events: [...events, event], rejected, view: buildView(r.world, persona) }, { headers: noStore });
  }
  return Response.json({ ok: true, persona, events, rejected, view: buildView(world, persona) }, { headers: noStore });
}
