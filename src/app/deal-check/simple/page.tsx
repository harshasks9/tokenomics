import type { Metadata } from "next";
import SimpleDealCheckApp from "@/components/deal-check/SimpleApp";

export const metadata: Metadata = {
  title: "Deal Check — Simple version",
  robots: { index: false, follow: false },
};

/** One-page view of the same deal: the working state is shared with the full version. */
export default function DealCheckSimplePage() {
  return <SimpleDealCheckApp />;
}
