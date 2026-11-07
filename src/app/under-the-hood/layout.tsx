import type { Metadata, Viewport } from "next";
import "./uth.css";

/*
 * Fonts: Inter is already loaded globally (src/app/globals.css). Newsreader is
 * loaded with a CSS @import at the top of uth.css — same pattern as globals.css —
 * so this route adds no build-time font downloads.
 */

export const metadata: Metadata = {
  title: "ANTHROPIC: UNDER THE HOOD — The S-1 Teardown",
  description:
    "What Anthropic's IPO disclosures reveal about the economics and competitive future of AI. An independent, evidence-led teardown of the Oct 26, 2026 S-1 and Nov 2, 2026 S-1/A: growth, compute, $895B of commitments, ~900% NRR, revenue quality, distribution and the competitor's playbook.",
  openGraph: {
    title: "ANTHROPIC: UNDER THE HOOD",
    description: "The S-1 teardown — an independent, evidence-led industry intelligence analysis.",
    siteName: "aitokenomics",
    type: "article",
  },
};

export const viewport: Viewport = { themeColor: "#fbfaf7", colorScheme: "light" };

export default function UnderTheHoodLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
