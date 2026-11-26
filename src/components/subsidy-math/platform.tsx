import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Platform seam: how the microsite links between its pages and offers its files.
 * The Next.js site uses routes and static files; the stand-alone claude.ai page
 * (scripts/subsidy-math/artifact/) swaps this module for in-page #links and the
 * viewer's downloads capability. Keep the two exports in step.
 */

export type DocName = "memo" | "email" | "claims";

export const HOME_HREF = "/";
export const docHref = (name: DocName) => `/subsidy-math/${name}`;

export function AppLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return <Link href={href} prefetch={false} className={className}>{children}</Link>;
}

export function ModelDownload({ className, children }: { className?: string; children: ReactNode }) {
  return <a className={className} href="/subsidy-math/subsidy-math-model.xlsx" download>{children}</a>;
}
