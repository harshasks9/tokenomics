import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./mdes.css";

const mdesInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-mg",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MDES × Human Intelligence — Gemini Enterprise commitment planner",
  description: "Internal planning tool for the $10.8M Gemini Enterprise for EDU commitment: ramp, GCP allocation, spending window and scenario comparison.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3d91",
};

export default function MdesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`mg-root ${mdesInter.variable}`}>{children}</div>;
}
