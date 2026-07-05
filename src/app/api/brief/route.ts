import { NextRequest } from "next/server";
import { readBrief, readLatestBrief } from "@/lib/brief/store";

export const dynamic = "force-dynamic";

// GET /api/brief          → latest daily brief
// GET /api/brief?date=YYYY-MM-DD → a specific day's brief
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
  }

  try {
    const brief = date ? await readBrief(date) : await readLatestBrief();
    if (!brief) {
      return Response.json(
        { error: date ? `No brief found for ${date}.` : "No briefs have been generated yet." },
        { status: 404 },
      );
    }
    return Response.json(brief);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to load brief." },
      { status: 500 },
    );
  }
}
