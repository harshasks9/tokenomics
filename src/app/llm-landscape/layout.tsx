import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./llm-landscape.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://models.aitokenomics.app"),
  title: "LLM Landscape — model evolution & honest Google equivalence",
  description:
    "Snapshot-dated explorer of the model landscape 2022–2026: timeline, family lineage, and workload-keyed Google equivalents with evidence grades and explicit concessions.",
  alternates: { canonical: "https://models.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "LLM Landscape — model evolution & honest Google equivalence",
    description:
      "We run Model X for workload Y today. What is the honest Google equivalent, and where would we be trading down?",
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
  return <div className={`${inter.variable} lls-root`}>{children}</div>;
}
