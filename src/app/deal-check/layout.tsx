import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./deal-check.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deal Check — AWS MAP 2.0 vs Google Private Offer",
  description: "Field calculator comparing AWS MAP 2.0 and the Google Private Offer for an Anthropic model workload.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#1c5cab",
};

export default function DealCheckLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`dc-root ${inter.variable}`}>{children}</div>;
}
