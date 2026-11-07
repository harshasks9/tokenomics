import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./modelcomp.css";

const modelcompPlexSans = localFont({
  src: [
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});

const modelcompSpaceGrotesk = localFont({
  src: [
    { path: "../../fonts/space-grotesk.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/space-grotesk.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/space-grotesk.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MODELCOMP — The frontier moved. Gemini didn't follow.",
  description:
    "Twelve months of the AI capability frontier, Aug 2025 – Aug 2026, against the Google flagship available at each moment. Google held or shared #1 for 62 of 366 days; the 3.1 Pro flagship stood still at 46 while the frontier reached 61 — until Google's own 3.7 Flash (Aug 13) closed to 56, 7 behind Opus 5 on AA v4.1.1.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "MODELCOMP — The frontier moved. Gemini didn't follow.",
    description:
      "Every model that set the intelligence frontier in the past 12 months, against the Google flagship available at that moment.",
    siteName: "aitokenomics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MODELCOMP — The frontier moved. Gemini didn't follow.",
    description:
      "Every model that set the intelligence frontier in the past 12 months, against the Google flagship available at that moment.",
  },
};

export const viewport: Viewport = {
  themeColor: "#16324F",
  colorScheme: "light",
};

export default function ModelcompLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`mc-root ${modelcompPlexSans.variable} ${modelcompSpaceGrotesk.variable}`}>{children}</div>
  );
}
