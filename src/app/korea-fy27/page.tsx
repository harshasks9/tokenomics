import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import KoreaPlanSite from "@/components/korea-fy27/Site";
import { DEALCHECK_SESSION_COOKIE, isSessionValid } from "@/lib/deal-check/auth";
import { hostnameFrom } from "@/lib/deal-check/routes";
import { gatePathFor, homePathFor } from "@/lib/korea-fy27/routes";
import { buildModel } from "@/lib/korea-fy27/model";

export const metadata: Metadata = {
  title: "Korea AI · Path to 4x · FY27",
  description: "Internal plan: from $226M FY26 Google AI revenue in Korea to ~$900M in FY27.",
};

export const dynamic = "force-dynamic";

export default async function KoreaFy27Page() {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);

  // The proxy gates this route already; checking again here keeps the plan
  // data out of any response that reaches the page without a valid session.
  if (!(await isSessionValid(cookieStore.get(DEALCHECK_SESSION_COOKIE)?.value))) {
    const hostname = hostnameFrom(headerList);
    redirect(`${gatePathFor(hostname)}?next=${encodeURIComponent(homePathFor(hostname))}`);
  }

  return <KoreaPlanSite model={buildModel()} />;
}
