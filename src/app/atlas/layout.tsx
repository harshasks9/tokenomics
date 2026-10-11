import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./atlas.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const serif = Fraunces({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://atlas.aitokenomics.app"),
  title: "AI Intelligence Atlas — who saw the future of AI most clearly",
  description:
    "A time-aware knowledge graph of how 30 influential AI builders, researchers and investors understood, predicted and shaped AI from 2012 to October 2026 — with an auditable foresight scorecard, debate maps and 2027–2030 scenarios.",
  alternates: { canonical: "https://atlas.aitokenomics.app" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "AI Intelligence Atlas",
    description: "30 minds, hundreds of dated claims, one evolving AI stack. Who understood how AI actually works — and where its value accrues?",
    url: "https://atlas.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0d1424", width: "device-width", initialScale: 1 };

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${serif.variable} ${mono.variable} at-root`}>{children}</div>;
}
