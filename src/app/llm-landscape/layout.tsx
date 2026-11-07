import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./llm-landscape.css";

const llmLandscapeInter = localFont({
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

// Judgment voice: analyst opinion wears serif, evidence wears sans.
const llmLandscapeSourceSerif = localFont({
  src: [
    { path: "../../fonts/source-serif-4.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/source-serif-4.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/source-serif-4-italic.woff2", weight: "400", style: "italic" },
    { path: "../../fonts/source-serif-4-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://models.aitokenomics.app"),
  title: "LLM Landscape — independent model advisory",
  description:
    "Vendor-neutral, snapshot-dated advisory on the model landscape: workload buyer's guides, symmetric head-to-heads, and evidence grades on every claim. No vendor is the house answer.",
  alternates: { canonical: "https://models.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "LLM Landscape — independent model advisory",
    description:
      "What are you choosing a model for? Evidence-graded shortlists, symmetric comparisons, and the trade-offs both ways.",
    url: "https://models.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function LlmLandscapeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${llmLandscapeInter.variable} ${llmLandscapeSourceSerif.variable} lls-root`}>
      {/* meta.json paints the landing; the full universe streams behind it. */}
      <link rel="preload" href="/llm-landscape/meta.json" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/llm-landscape/models.json" as="fetch" crossOrigin="anonymous" />
      {children}
    </div>
  );
}
