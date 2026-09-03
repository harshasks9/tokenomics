import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./store.css";

/**
 * Two web fonts on this route: Fraunces (display, loaded here) and Inter
 * (body), which the root stylesheet already loads from Google Fonts.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://store.aitokenomics.app"),
  title: "The Department Store for AI",
  description:
    "One store. Every brand. One set of rules. A way to explain Google Cloud AI to the board: the platform as a modern department store.",
  alternates: { canonical: "https://store.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "The Department Store for AI",
    description:
      "Choose the best capability for each job, again and again, without rebuilding the store every time the market moves.",
    url: "https://store.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0F12",
  width: "device-width",
  initialScale: 1,
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${fraunces.variable} ds-root`}>{children}</div>;
}
