import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./earnings.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ea-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-ea-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EARNINGS — The State of Model-as-a-Service, Feb–Aug 2026",
  description:
    "Competitive intelligence for Google Cloud AI leadership. Google Cloud +82% to $24.8B, Anthropic at a $47B run-rate, 22B tokens per minute — and a control point migrating from the model to the agent harness and the data platform.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "EARNINGS — The State of Model-as-a-Service",
    description: "The control point is leaving the model. Feb–Aug 2026 competitive intelligence.",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#003153",
  colorScheme: "light",
};

export default function EarningsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${sans.variable} ${serif.variable}`}>{children}</div>;
}
