import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./llm-landscape.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
  themeColor: "#0B0E14",
  width: "device-width",
  initialScale: 1,
};

export default function LlmLandscapeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} lls-root`}>
      {children}
    </div>
  );
}
