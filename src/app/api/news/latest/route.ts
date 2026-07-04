import { readLatestEdition } from "@/lib/news/store";

// Public: returns the latest published edition (or {edition:null} when the
// pipeline hasn't produced one yet). The static news page fetches this and
// progressively upgrades its baked fallback edition.
export async function GET() {
  try {
    const edition = await readLatestEdition();
    return Response.json(
      { edition },
      {
        headers: {
          // Cache at the edge for 5 min; page still works if slightly stale.
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
        },
      },
    );
  } catch {
    return Response.json({ edition: null });
  }
}
