import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./asset-factory.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://assets.aitokenomics.app"),
  title: "Gemini 10 Asset Factory — the open ecosystem for enterprise AI agents",
  description:
    "One marketplace, three experiences: customers, Google Cloud FDEs and partner FDEs discover, assemble, deploy and contribute reusable Gemini agent blueprints, skills and connectors.",
  alternates: { canonical: "https://assets.aitokenomics.app" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "Gemini 10 Asset Factory",
    description: "Discover. Build. Deploy. Share. Consume. One ecosystem, three audiences, shared IP.",
    url: "https://assets.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function AssetFactoryLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} af-root`}>{children}</div>;
}
