import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./earnings.css";

const earningsPlexSans = localFont({
  src: [
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ea-sans",
  display: "swap",
});

const earningsSourceSerif = localFont({
  src: [
    { path: "../../fonts/source-serif-4.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/source-serif-4.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/source-serif-4.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ea-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title: "EARNINGS — The State of Model-as-a-Service, Feb–Aug 2026",
  description:
    "Competitive intelligence for Google Cloud AI leadership. Google Cloud +82% to $24.8B, Anthropic at a $47B run-rate, 22B tokens per minute — and a control point migrating from the model to the agent harness and the data platform.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "EARNINGS — The State of Model-as-a-Service",
    description: "The control point is leaving the model. Feb–Aug 2026 competitive intelligence.",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#003153",
  colorScheme: "light",
};

export default function EarningsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${earningsPlexSans.variable} ${earningsSourceSerif.variable}`}>{children}</div>;
}
