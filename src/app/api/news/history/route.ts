import { readHistory } from "@/lib/news/store";

// Public: list of past editions (newest first) for the archive UI.
export async function GET() {
  try {
    const history = await readHistory();
    return Response.json(
      { history },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" } },
    );
  } catch {
    return Response.json({ history: [] });
  }
}
