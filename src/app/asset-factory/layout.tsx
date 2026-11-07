import type { Metadata, Viewport } from "next";
import "./asset-factory.css";

// Fonts load at runtime from the stylesheet (Inter is already loaded by the root
// layout; JetBrains Mono is imported in asset-factory.css) so this route adds no
// build-time Google Fonts downloads, which have been failing intermittently on CI.

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
  return <div className="af-root">{children}</div>;
}
