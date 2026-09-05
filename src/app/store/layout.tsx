import type { Metadata, Viewport } from "next";
import "./store.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://store.aitokenomics.app"),
  title: "The AI Department Store — Google Cloud",
  description:
    "Don't bet on the winning model. Pick the right store. Google Cloud as the department store for enterprise AI: choose the best capability for every job without rebuilding your architecture every time the market changes.",
  alternates: { canonical: "https://store.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "The AI Department Store",
    description: "Switch the model. Not the architecture.",
    url: "https://store.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  width: "device-width",
  initialScale: 1,
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div className="ds">{children}</div>;
}
