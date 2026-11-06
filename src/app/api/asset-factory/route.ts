import { cookies } from "next/headers";
import { attempt, replay } from "@/lib/asset-factory/engine";
import { PERSONA_USER } from "@/lib/asset-factory/data";
import { buildView } from "@/lib/asset-factory/views";
import type { Action, Event, PersonaId } from "@/lib/asset-factory/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/asset-factory — the Asset Factory's only data endpoint.
 *
 * Identity comes from the `af_persona` cookie (the demo's simulated sign-in),
 * never from the action payload. The world is rebuilt from the seed plus the
 * client-held event log, with every event re-authorized; then a new action, if
 * any, is attempted as the signed-in persona; then the result is projected so
 * the response contains only what that persona may see.
 *
 * Body: { events: Event[], signInAs?: PersonaId, action?: Action }
 */
const COOKIE = "af_persona";
const PERSONAS: PersonaId[] = ["customer", "google", "partner"];
const MAX_BODY = 200_000;

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return Response.json({ ok: false, reason: "Request too large." }, { status: 413 });

  let body: { events?: unknown; signInAs?: unknown; action?: unknown };
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    return Response.json({ ok: false, reason: "Invalid JSON." }, { status: 400 });
  }

  const jar = await cookies();
  let persona: PersonaId = PERSONAS.includes(jar.get(COOKIE)?.value as PersonaId) ? (jar.get(COOKIE)!.value as PersonaId) : "customer";
  if (typeof body.signInAs === "string") {
    if (!PERSONAS.includes(body.signInAs as PersonaId)) return Response.json({ ok: false, reason: "Unknown persona." }, { status: 400 });
    persona = body.signInAs as PersonaId;
    jar.set(COOKIE, persona, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8 });
  }

  const { world, events, rejected } = replay(Array.isArray(body.events) ? (body.events as Event[]) : []);

  if (body.action && typeof body.action === "object") {
    // The actor is whoever is signed in — a client cannot name a different one.
    const event: Event = { actorId: PERSONA_USER[persona], action: body.action as Action };
    const result = attempt(world, event);
    if (!result.ok) {
      return Response.json(
        { ok: false, reason: result.reason, persona, events, rejected, view: buildView(world, persona) },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
    return Response.json(
      { ok: true, persona, events: [...events, event], rejected, view: buildView(result.world, persona) },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json({ ok: true, persona, events, rejected, view: buildView(world, persona) }, { headers: { "Cache-Control": "no-store" } });
}
