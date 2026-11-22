import type { Metadata } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
// The "<Family> Fallback" faces are the ones the Google loader generated; they now
// live in src/fonts/fallbacks/fsi.css (named with inner single quotes: next/font emits
// the fallback list verbatim, and "Source Serif 4 Fallback" is not valid CSS unquoted).
import localFont from "next/font/local";
import "../../fonts/fallbacks/fsi.css";
import "./fsi.css";

const fsiArchivo = localFont({
  src: [
    { path: "../../fonts/archivo.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/archivo.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/archivo.woff2", weight: "800", style: "normal" },
  ],
  variable: "--fsi-display",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["'Archivo Fallback'"],
});
const fsiInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--fsi-body",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["'Inter Fallback'"],
});
const fsiPlexMono = localFont({
  src: [
    { path: "../../fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/ibm-plex-mono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--fsi-mono",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["'IBM Plex Mono Fallback'"],
});

export const metadata: Metadata = {
  title: "FSI Knowledge Hub — Financial Services AI & Agentic Transformation (Internal)",
  description:
    "Internal evidence register for Google Cloud India FSI field teams: production cases, workflow scoring, competitive map, architecture, regulation. Current as of August 2026.",
  robots: { index: false, follow: false },
};

export default function FsiLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${fsiArchivo.variable} ${fsiInter.variable} ${fsiPlexMono.variable}`}>{children}</div>;
}
