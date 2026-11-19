import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./finops.css";

const finopsInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
    // Up to 900: the global Inter (globals.css) shared this family name on Google Fonts.
    { path: "../../fonts/inter.woff2", weight: "800", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-fo-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrontierOps — Multi-Cloud AI FinOps",
  description:
    "Are we getting the highest possible AI performance for every dollar we spend? FrontierOps maps every AI workload against the cost-quality Pareto frontier across Google Cloud, AWS, Azure, OpenAI and Anthropic — and shows exactly where the savings are trapped.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "FrontierOps — Multi-Cloud AI FinOps",
    description:
      "Every AI workload mapped against the cost-quality Pareto frontier, with ranked optimization opportunities and a migration simulator.",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c5cab",
};

export default function FinOpsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`fo-root ${finopsInter.variable}`}>{children}</div>;
}
