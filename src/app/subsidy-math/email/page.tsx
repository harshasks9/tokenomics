import type { Metadata } from "next";
import DocPage from "@/components/subsidy-math/DocPage";
import CopyButton from "@/components/subsidy-math/CopyButton";

export const metadata: Metadata = { title: "Executive email — Subsidy Math", robots: { index: false, follow: false } };

export default function EmailPage() {
  return <DocPage file="executive-email.md" kicker="A · Executive email" title="Note to JAPAC AI leaders" toc={false} actions={<div style={{ marginTop: 18 }}><CopyButton file="/subsidy-math/executive-email.md" /></div>} />;
}
