import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import { SiteChrome } from "@/components/governance/SiteChrome";
import "./governance.css";

const governanceInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

// Editorial voice: the framework's judgment lines wear serif, evidence wears sans.
const governanceSourceSerif = localFont({
  src: [
    { path: "../../fonts/source-serif-4.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/source-serif-4.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/source-serif-4.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/source-serif-4-italic.woff2", weight: "400", style: "italic" },
    { path: "../../fonts/source-serif-4-italic.woff2", weight: "600", style: "italic" },
    { path: "../../fonts/source-serif-4-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://governance.aitokenomics.app"),
  title: {
    default: "AI Governance — what it actually takes to govern AI across an enterprise",
    template: "%s · AI Governance",
  },
  description:
    "A practical framework for enterprise AI governance: seven layers, three depths, mapped to risks, owners, controls, vendor approaches, and Google Cloud capabilities.",
  alternates: { canonical: "https://governance.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "AI Governance — the enterprise framework",
    description:
      "What does it actually take to govern AI across an enterprise? Seven layers, three depths, one coherent mental model.",
    url: "https://governance.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f8fa",
  width: "device-width",
  initialScale: 1,
};

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${governanceInter.variable} ${governanceSourceSerif.variable} gov-root`}>
      <SiteChrome>{children}</SiteChrome>
    </div>
  );
}
