import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./harness.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harness.aitokenomics.app"),
  title: "Harness Choice — the other half of your AI architecture decision",
  description:
    "Models provide intelligence. The harness decides how that intelligence becomes reliable work. A framework for evaluating agent harnesses: capabilities, workloads, vendors, economics, and Google Cloud's architecture.",
  alternates: { canonical: "https://harness.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Harness Choice",
    description:
      "Outcome = Model × Harness × Context × Tools × Environment. A structured framework for the architectural decision enterprises haven't named yet.",
    url: "https://harness.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1220",
  width: "device-width",
  initialScale: 1,
};

export default function HarnessLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${grotesk.variable} hx-root`}>{children}</div>;
}
