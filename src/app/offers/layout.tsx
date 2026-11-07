import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./offers.css";

const offersPlexSans = localFont({
  src: [
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "300", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/ibm-plex-sans.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});

const offersPlexMono = localFont({
  src: [
    { path: "../../fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Offers — GenAI commercial scenario model",
  description:
    "Internal illustrative modeling of GSU, serving-tier and commitment economics.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#071E30",
  colorScheme: "dark",
};

export default function OffersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`offers-root ${offersPlexSans.variable} ${offersPlexMono.variable}`}>
      {children}
    </div>
  );
}
