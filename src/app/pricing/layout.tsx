import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./pricing.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
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
  return <div className={`${inter.variable} ${mono.variable} px-root`}>{children}</div>;
}
