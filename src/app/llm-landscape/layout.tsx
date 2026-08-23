import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./llm-landscape.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Judgment voice: analyst opinion wears serif, evidence wears sans.
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://models.aitokenomics.app"),
  title: "LLM Landscape — independent model advisory",
  description:
    "Vendor-neutral, snapshot-dated advisory on the model landscape: workload buyer's guides, symmetric head-to-heads, and evidence grades on every claim. No vendor is the house answer.",
  alternates: { canonical: "https://models.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "LLM Landscape — independent model advisory",
    description:
      "What are you choosing a model for? Evidence-graded shortlists, symmetric comparisons, and the trade-offs both ways.",
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
  return (
    <div className={`${inter.variable} ${serif.variable} lls-root`}>
      {/* meta.json paints the landing; the full universe streams behind it. */}
      <link rel="preload" href="/llm-landscape/meta.json" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/llm-landscape/models.json" as="fetch" crossOrigin="anonymous" />
      {children}
    </div>
  );
}
