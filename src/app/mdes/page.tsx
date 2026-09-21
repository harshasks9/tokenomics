import { headers } from "next/headers";
import App from "@/components/mdes/App";
import { isMdesHost } from "@/lib/mdes/routes";

export const dynamic = "force-dynamic";

export default async function MdesPage() {
  const h = await headers();
  const raw = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const hostname = raw.split(":")[0].toLowerCase();
  // On the dedicated subdomain the family home is the apex; inside the main site it is "/".
  const mdesHost = isMdesHost(hostname);
  const home = mdesHost ? "https://aitokenomics.app/" : "/";
  const customerHref = mdesHost ? "/customer" : "/mdes/customer";
  return <App home={home} customerHref={customerHref} />;
}
