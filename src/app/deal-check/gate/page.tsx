import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import GateForm from "@/components/deal-check/GateForm";
import { DEALCHECK_SESSION_COOKIE, isGateConfigured, isSessionValid, safeNextPath } from "@/lib/deal-check/auth";
import { basePathFor, hostnameFrom } from "@/lib/deal-check/routes";

export const metadata: Metadata = {
  title: "Deal Check — Locked",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function GatePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [params, cookieStore, headerList] = await Promise.all([searchParams, cookies(), headers()]);
  const base = basePathFor(hostnameFrom(headerList));
  const home = base || "/";
  const next = params.next ? safeNextPath(params.next, home) : home;

  // Already unlocked — don't make people type it twice.
  if (await isSessionValid(cookieStore.get(DEALCHECK_SESSION_COOKIE)?.value)) redirect(next);

  const configured = isGateConfigured();

  return (
    <main className="dc-gate">
      <div className="dc-card dc-gate-card">
        <h2>Internal · Access required</h2>
        <h1 style={{ fontSize: 22, margin: "4px 0 8px" }}>Deal check</h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-2)" }}>
          AWS MAP 2.0 versus the Google Private Offer for an Anthropic workload. Commercially sensitive; not for external distribution.
        </p>
        {configured ? (
          <GateForm next={next} />
        ) : (
          <div className="dc-change" style={{ marginTop: 18 }}>
            <b>Not configured.</b> DEALCHECK_PASSCODE and a session secret must both be set in the environment before this site will open. Access stays locked until they are.
          </div>
        )}
        <p style={{ marginTop: 22, fontSize: 11.5, color: "var(--muted)" }}>A shared passcode is access friction, not security. Do not place anything here beyond the audience holding it.</p>
      </div>
    </main>
  );
}
