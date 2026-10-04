import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./earbuds.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Editorial voice for headlines; evidence and data stay in the sans.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Find your best tradeoff — the wireless earbuds Pareto frontier",
  description:
    "No earbud wins at everything. Explore price, noise cancelling, battery and comfort across 14 current earbuds from Apple, Sony, Bose, Samsung, Nothing and more — with every value sourced and every gap disclosed.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Find your best tradeoff",
    description: "An evidence-first Pareto explorer for wireless earbuds — by activity, with hard requirements and sourced notes.",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1,
};

export default function EarbudsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${fraunces.variable} eb-root`}>{children}</div>;
}
