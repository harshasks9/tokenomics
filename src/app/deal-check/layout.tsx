import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./deal-check.css";

const dealCheckInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
    // Up to 900: the global Inter (globals.css) shared this family name on Google Fonts.
    { path: "../../fonts/inter.woff2", weight: "800", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-dc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deal Check — AWS MAP 2.0 vs Google Private Offer",
  description: "Field calculator comparing AWS MAP 2.0 and the Google Private Offer for an Anthropic model workload.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#1c5cab",
};

export default function DealCheckLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`dc-root ${dealCheckInter.variable}`}>{children}</div>;
}
