import { attempt } from "@/lib/asset-factory/engine";
import { PERSONA_USER } from "@/lib/asset-factory/data";
import { noStore, readRequest } from "@/lib/asset-factory/server";
import { buildView } from "@/lib/asset-factory/views";
import type { Action, Event } from "@/lib/asset-factory/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/asset-factory — sync and act.
 *
 * Identity comes from the `af_persona` cookie (the demo's simulated sign-in),
 * never from the action payload. The world is rebuilt from the seed plus the
 * client-held event log, with every event re-authorized; then a new action, if
 * any, is attempted as the signed-in persona; then the result is projected so
 * the response contains only what that persona may see.
 *
 * Body: { events: Event[], signInAs?: PersonaId, action?: Action }
 */
export async function POST(request: Request) {
  const req = await readRequest(request);
  if (!req.ok) return req.response;
  const { body, persona, replayed } = req;
  const { world, events, rejected } = replayed;

  if (body.action && typeof body.action === "object") {
    // The actor is whoever is signed in — a client cannot name a different one.
    const event: Event = { actorId: PERSONA_USER[persona], action: body.action as Action };
    const result = attempt(world, event);
    if (!result.ok) {
      return Response.json({ ok: false, reason: result.reason, persona, events, rejected, view: buildView(world, persona) }, { status: 403, headers: noStore });
    }
    return Response.json({ ok: true, persona, events: [...events, event], rejected, view: buildView(result.world, persona) }, { headers: noStore });
  }

  return Response.json({ ok: true, persona, events, rejected, view: buildView(world, persona) }, { headers: noStore });
}
