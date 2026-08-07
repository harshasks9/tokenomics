import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./finops.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fo-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrontierOps — Multi-Cloud AI FinOps",
  description:
    "Are we getting the highest possible AI performance for every dollar we spend? FrontierOps maps every AI workload against the cost-quality Pareto frontier across Google Cloud, AWS, Azure, OpenAI and Anthropic — and shows exactly where the savings are trapped.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "FrontierOps — Multi-Cloud AI FinOps",
    description:
      "Every AI workload mapped against the cost-quality Pareto frontier, with ranked optimization opportunities and a migration simulator.",
    siteName: "aitokenomics",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c5cab",
};

export default function FinOpsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`fo-root ${inter.variable}`}>{children}</div>;
}
