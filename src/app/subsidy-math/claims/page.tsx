import type { Metadata } from "next";
import DocPage from "@/components/subsidy-math/DocPage";

export const metadata: Metadata = { title: "Claims audit — Subsidy Math", robots: { index: false, follow: false } };

export default function ClaimsPage() {
  return <DocPage file="claims-audit.md" kicker="D · Claims audit" title="What we can say, what needs a caveat, and what we should not say" />;
}
