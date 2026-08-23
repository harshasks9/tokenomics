"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { num: "01", label: "Overview", path: "" },
  { num: "02", label: "Why now", path: "/why-now" },
  { num: "03", label: "The stack", path: "/stack" },
  { num: "04", label: "Personas", path: "/personas" },
  { num: "05", label: "Risks", path: "/risks" },
  { num: "06", label: "Architectures", path: "/architectures" },
  { num: "07", label: "Vendor lens", path: "/vendors" },
  { num: "08", label: "Google Cloud", path: "/google" },
  { num: "09", label: "Examples", path: "/examples" },
  { num: "10", label: "Readiness", path: "/readiness" },
] as const;

/**
 * The site is served both at /governance on the main host and at the root of
 * governance.aitokenomics.app (the proxy rewrites either shape onto the same
 * routes), so active-state matching strips the prefix before comparing.
 */
function normalizePath(pathname: string): string {
  const stripped = pathname.replace(/^\/governance(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

function isActive(itemPath: string, current: string): boolean {
  if (itemPath === "") return current === "/";
  return current === itemPath || current.startsWith(`${itemPath}/`);
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const current = normalizePath(usePathname() ?? "/");

  return (
    <>
      <a href="#gov-main" className="g-skip">
        Skip to content
      </a>
      <header className="g-topbar">
        <div className="g-topbar-inner">
          <Link href="/governance" className="g-brand" aria-label="AI Governance home">
            <span className="g-brand-mark">AI Governance</span>
            <span className="g-brand-sub">Field Guide</span>
          </Link>
          <nav className="g-nav" aria-label="Site sections">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.num}
                href={`/governance${item.path}`}
                aria-current={isActive(item.path, current) ? "page" : undefined}
              >
                <span className="g-nav-num">{item.num}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="gov-main">{children}</main>
      <footer className="g-footer">
        <div className="g-wrap">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between" }}>
            <div style={{ maxWidth: 560 }}>
              <div className="g-brand-mark" style={{ fontSize: 15 }}>
                AI Governance Field Guide
              </div>
              <p className="g-micro" style={{ marginTop: 10 }}>
                An educational synthesis for customer conversations, prepared for Google Cloud
                sellers. It distinguishes regulation, standards, industry practice, and vendor
                capability, and it is not legal or compliance advice. Product capabilities change
                quickly — verify against current official documentation before relying on any
                statement here. Content snapshot: August 2026.
              </p>
            </div>
            <div style={{ display: "flex", gap: 28 }}>
              <div>
                <div className="g-block-title" style={{ marginBottom: 8 }}>Reference</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
                  <Link href="/governance/sources">Sources &amp; methodology</Link>
                  <Link href="/governance/stack">The framework</Link>
                  <Link href="/governance/readiness">Readiness diagnostic</Link>
                </div>
              </div>
              <div>
                <div className="g-block-title" style={{ marginBottom: 8 }}>Use it live</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
                  <Link href="/governance/personas">Start from a persona</Link>
                  <Link href="/governance/risks">Start from a risk</Link>
                  <Link href="/governance/examples">Start from an example</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
