import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import KoreaFlowSite from "@/components/korea-fy27/flow/FlowSite";
import { DEALCHECK_SESSION_COOKIE, isSessionValid } from "@/lib/deal-check/auth";
import { hostnameFrom } from "@/lib/deal-check/routes";
import { flowPathFor, gatePathFor, homePathFor } from "@/lib/korea-fy27/routes";
import { buildModel } from "@/lib/korea-fy27/model";
import { buildFlow } from "@/lib/korea-fy27/flow";

export const metadata: Metadata = {
  title: "Korea AI · Path to 4x · FY27 · Flow",
  description: "Internal plan, in the review flow: market intel, takeaways, three motions, five verticals, the startup engine, the Q4 plan, accountability and asks.",
};

export const dynamic = "force-dynamic";

export default async function KoreaFy27FlowPage() {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  const hostname = hostnameFrom(headerList);

  // Same double check as the full plan: no plan data in a response without a session.
  if (!(await isSessionValid(cookieStore.get(DEALCHECK_SESSION_COOKIE)?.value))) {
    redirect(`${gatePathFor(hostname)}?next=${encodeURIComponent(flowPathFor(hostname))}`);
  }

  const model = buildModel();
  return <KoreaFlowSite model={model} flow={buildFlow(model)} fullHref={homePathFor(hostname)} />;
}
