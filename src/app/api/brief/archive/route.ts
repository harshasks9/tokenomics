import { readIndex } from "@/lib/brief/store";

export const dynamic = "force-dynamic";

// GET /api/brief/archive → list of available briefing dates (newest first)
export async function GET() {
  try {
    const index = await readIndex();
    return Response.json({ briefs: index });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to load archive." },
      { status: 500 },
    );
  }
}
