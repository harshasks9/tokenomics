import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./atlas.css";

const atlasInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
    // Up to 900: the global Inter (globals.css) shared this family name on Google Fonts.
    { path: "../../fonts/inter.woff2", weight: "800", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});
const atlasFraunces = localFont({
  src: [
    { path: "../../fonts/fraunces.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/fraunces.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const atlasJetBrainsMono = localFont({
  src: [
    { path: "../../fonts/jetbrains-mono.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atlas.aitokenomics.app"),
  title: "AI Intelligence Atlas — who saw the future of AI most clearly",
  description:
    "A time-aware knowledge graph of how 30 influential AI builders, researchers and investors understood, predicted and shaped AI from 2012 to October 2026 — with an auditable foresight scorecard, debate maps and 2027–2030 scenarios.",
  alternates: { canonical: "https://atlas.aitokenomics.app" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "AI Intelligence Atlas",
    description: "30 minds, hundreds of dated claims, one evolving AI stack. Who understood how AI actually works — and where its value accrues?",
    url: "https://atlas.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0d1424", width: "device-width", initialScale: 1 };

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${atlasInter.variable} ${atlasFraunces.variable} ${atlasJetBrainsMono.variable} at-root`}>{children}</div>;
}
