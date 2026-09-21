import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./mdes.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mg",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MDES × Human Intelligence — Gemini Enterprise commitment planner",
  description: "Internal planning tool for the $10.8M Gemini Enterprise for EDU commitment: ramp, GCP allocation, spending window and scenario comparison.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3d91",
};

export default function MdesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`mg-root ${inter.variable}`}>{children}</div>;
}
