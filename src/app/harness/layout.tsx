import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./harness.css";

const harnessInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const harnessSpaceGrotesk = localFont({
  src: [
    { path: "../../fonts/space-grotesk.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/space-grotesk.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/space-grotesk.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harness.aitokenomics.app"),
  title: "Harness Choice — the other half of your AI architecture decision",
  description:
    "Models provide intelligence. The harness decides how that intelligence becomes reliable work. A framework for evaluating agent harnesses: capabilities, workloads, vendors, economics, and Google Cloud's architecture.",
  alternates: { canonical: "https://harness.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Harness Choice",
    description:
      "Outcome = Model × Harness × Context × Tools × Environment. A structured framework for the architectural decision enterprises haven't named yet.",
    url: "https://harness.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1220",
  width: "device-width",
  initialScale: 1,
};

export default function HarnessLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${harnessInter.variable} ${harnessSpaceGrotesk.variable} hx-root`}>{children}</div>;
}
