import type { Metadata } from "next";
import DocPage from "@/components/subsidy-math/DocPage";

export const metadata: Metadata = { title: "Research memo — Subsidy Math", robots: { index: false, follow: false } };

export default function MemoPage() {
  return <DocPage file="research-memo.md" kicker="B · Financial research memo" title="The Economics of AI: Is the Hyperscaler Subsidy Model Sustainable?" />;
}
