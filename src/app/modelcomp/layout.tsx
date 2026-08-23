import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./modelcomp.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MODELCOMP — The frontier moved. Gemini didn't follow.",
  description:
    "Twelve months of the AI capability frontier, Aug 2025 – Aug 2026, against the Google flagship available at each moment. Google held or shared #1 for 62 of 366 days; the 3.1 Pro flagship stood still at 46 while the frontier reached 61 — until Google's own 3.7 Flash (Aug 14) closed to 56, 7 behind Opus 5 on AA v4.1.1.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "MODELCOMP — The frontier moved. Gemini didn't follow.",
    description:
      "Every model that set the intelligence frontier in the past 12 months, against the Google flagship available at that moment.",
    siteName: "aitokenomics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MODELCOMP — The frontier moved. Gemini didn't follow.",
    description:
      "Every model that set the intelligence frontier in the past 12 months, against the Google flagship available at that moment.",
  },
};

export const viewport: Viewport = {
  themeColor: "#16324F",
  colorScheme: "light",
};

export default function ModelcompLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`mc-root ${plexSans.variable} ${spaceGrotesk.variable}`}>{children}</div>
  );
}
