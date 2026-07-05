import { readIndex, storeMode } from "@/lib/brief/store";

export const dynamic = "force-dynamic";

// GET /api/brief/archive → list of available briefing dates (newest first).
// `store` reports the active backend ("redis" | "file" | "memory") so a
// misconfigured KV binding is visible: anything but "redis" in production
// means generated briefs don't persist across invocations.
export async function GET() {
  try {
    const index = await readIndex();
    return Response.json({ briefs: index, store: storeMode() });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to load archive." },
      { status: 500 },
    );
  }
}
