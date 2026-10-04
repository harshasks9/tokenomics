import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import GateForm from "@/components/korea-fy27/GateForm";
import { DEALCHECK_SESSION_COOKIE, isGateConfigured, isSessionValid, safeNextPath } from "@/lib/deal-check/auth";
import { hostnameFrom } from "@/lib/deal-check/routes";
import { homePathFor, isKoreaHost } from "@/lib/korea-fy27/routes";

export const metadata: Metadata = {
  title: "Access required",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KoreaFy27Gate({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [params, cookieStore, headerList] = await Promise.all([searchParams, cookies(), headers()]);
  const hostname = hostnameFrom(headerList);
  const home = homePathFor(hostname);
  const next = params.next ? safeNextPath(params.next, home) : home;

  // Already unlocked (here or on Deal Check / MDES): go straight in.
  if (await isSessionValid(cookieStore.get(DEALCHECK_SESSION_COOKIE)?.value)) redirect(next);

  const configured = isGateConfigured();
  const saeA = isKoreaHost(hostname) ? "/korea" : "https://korea.aitokenomics.app/korea";

  return (
    <main className="k-gate">
      <div className="k-gate-card">
        <span className="k-conf">Google internal · Access required</span>
        <h1>Team passcode</h1>
        <p>This page is for the Korea AI team. Enter the shared passcode to continue.</p>
        {configured ? (
          <GateForm next={next} />
        ) : (
          <p className="k-gate-note" role="status">
            Access is not configured yet: the passcode and session secret must be set in the environment. The page stays locked until they are.
          </p>
        )}
        <p className="k-gate-note">A shared passcode is access friction, not security.</p>
        <p className="k-gate-alt">
          Looking for the Global Sae-A executive briefing? <a href={saeA}>It is here</a>.
        </p>
      </div>
    </main>
  );
}
