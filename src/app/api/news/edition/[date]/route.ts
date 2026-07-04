import type { NextRequest } from "next/server";
import { readEdition } from "@/lib/news/store";

// Public: fetch one archived edition by date (YYYY-MM-DD).
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/news/edition/[date]">) {
  try {
    const { date } = await ctx.params;
    const edition = await readEdition(date);
    return Response.json(
      { edition },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } },
    );
  } catch {
    return Response.json({ edition: null });
  }
}
