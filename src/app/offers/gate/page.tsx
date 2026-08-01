import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import GateForm from "@/components/offers/GateForm";
import {
  OFFERS_SESSION_COOKIE,
  isGateConfigured,
  isSessionValid,
  safeNextPath,
} from "@/lib/offers/auth";
import { basePathFor, hostnameFrom } from "@/lib/offers/routes";

export const metadata: Metadata = {
  title: "Offers — Locked",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [params, cookieStore, headerList] = await Promise.all([
    searchParams,
    cookies(),
    headers(),
  ]);

  const base = basePathFor(hostnameFrom(headerList));
  const home = base || "/";
  const next = params.next ? safeNextPath(params.next) : home;

  // Already unlocked — don't make people type it twice.
  if (await isSessionValid(cookieStore.get(OFFERS_SESSION_COOKIE)?.value)) {
    redirect(next);
  }

  const configured = isGateConfigured();

  return (
    <main className="o-gate">
      <div className="relative w-full max-w-[380px]">
        <p className="o-eyebrow">Internal · Access required</p>

        <h1 className="o-h1 mt-4" style={{ fontSize: "2rem" }}>
          Offers
        </h1>

        <p className="o-dim mt-3 text-[13.5px] leading-[1.6]">
          A scenario model for GenAI commercial constructs — GSU, serving tier
          and commitment economics. Commercially sensitive. Not for external
          distribution.
        </p>

        {configured ? (
          <GateForm next={next} />
        ) : (
          <div
            className="o-panel mt-8 p-4"
            style={{ borderColor: "var(--gold)" }}
          >
            <p className="o-mono text-[11px] leading-[1.7]" style={{ color: "var(--gold)" }}>
              NOT CONFIGURED
            </p>
            <p className="o-dim mt-2 text-[12.5px] leading-[1.6]">
              <span className="o-mono">SITE_PASSCODE</span> and{" "}
              <span className="o-mono">SESSION_SECRET</span> must both be set in
              the environment before this site will open. Access stays locked
              until they are.
            </p>
          </div>
        )}

        <div className="o-hairline mt-10 pt-4">
          <p className="o-mono o-faint text-[10px] leading-[1.7]">
            A shared passcode is access friction, not security.
            <br />
            Do not place anything here beyond the audience holding it.
          </p>
        </div>
      </div>
    </main>
  );
}
