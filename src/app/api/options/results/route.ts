import { NextRequest } from "next/server";
import { isOptionsRequestAuthenticated } from "@/lib/options/auth";
import { getCachedOrRunScreen } from "@/lib/options/screener";

export async function GET(request: NextRequest) {
  if (!(await isOptionsRequestAuthenticated(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(await getCachedOrRunScreen());
}
