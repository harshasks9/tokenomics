import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SiteChrome } from "@/components/governance/SiteChrome";
import "./governance.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// Editorial voice: the framework's judgment lines wear serif, evidence wears sans.
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://governance.aitokenomics.app"),
  title: {
    default: "AI Governance — what it actually takes to govern AI across an enterprise",
    template: "%s · AI Governance",
  },
  description:
    "A practical framework for enterprise AI governance: seven layers, three depths, mapped to risks, owners, controls, vendor approaches, and Google Cloud capabilities.",
  alternates: { canonical: "https://governance.aitokenomics.app" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "AI Governance — the enterprise framework",
    description:
      "What does it actually take to govern AI across an enterprise? Seven layers, three depths, one coherent mental model.",
    url: "https://governance.aitokenomics.app",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f8fa",
  width: "device-width",
  initialScale: 1,
};

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${serif.variable} gov-root`}>
      <SiteChrome>{children}</SiteChrome>
    </div>
  );
}
