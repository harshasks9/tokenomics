import { readLatest, storeMode } from "@/lib/pricing/store";
import { CATALOG_VERSION, CATALOG_DATE } from "@/lib/pricing/catalog";

export const dynamic = "force-dynamic";

/**
 * GET /api/pricing — the live overlay (price overrides + generated news)
 * written by the daily cron. The client merges it over the bundled catalog;
 * an empty overlay means "catalog values are current as of CATALOG_DATE".
 */
export async function GET() {
  try {
    const latest = await readLatest();
    return Response.json(
      {
        ok: true,
        catalogVersion: CATALOG_VERSION,
        catalogDate: CATALOG_DATE,
        store: storeMode(),
        snapshot: latest,
      },
      { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to read pricing snapshot." },
      { status: 500 },
    );
  }
}
