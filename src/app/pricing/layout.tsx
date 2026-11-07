import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./pricing.css";

const pricingInter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const pricingJetBrainsMono = localFont({
  src: [
    { path: "../../fonts/jetbrains-mono.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/jetbrains-mono.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pricing.aitokenomics.app"),
  title: "AI Model Pricing — which model fits your workload, and what it costs",
  description:
    "Compare frontier and open-weight models on verified token pricing, capabilities and benchmarks. Interactive cost calculator, workload presets, cost-vs-capability scatter and a daily-updated pricing news feed.",
  alternates: { canonical: "https://pricing.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "AI Model Pricing Explorer",
    description:
      "Verified token pricing, capabilities and benchmarks for Google, OpenAI, Anthropic and open-weight models — with a cost calculator that answers 'what will this actually cost?'",
    url: "https://pricing.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  width: "device-width",
  initialScale: 1,
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${pricingInter.variable} ${pricingJetBrainsMono.variable} px-root`}>{children}</div>;
}
