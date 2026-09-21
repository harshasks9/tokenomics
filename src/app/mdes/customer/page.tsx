import type { Metadata } from "next";
import { headers } from "next/headers";
import CustomerView from "@/components/mdes/CustomerView";
import { isMdesHost } from "@/lib/mdes/routes";

export const metadata: Metadata = {
  title: "Gemini Enterprise adoption plan — MDES",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CustomerPage() {
  const h = await headers();
  const raw = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const hostname = raw.split(":")[0].toLowerCase();
  const plannerHref = isMdesHost(hostname) ? "/" : "/mdes";
  return <CustomerView plannerHref={plannerHref} />;
}
