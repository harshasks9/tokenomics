import type { Metadata, Viewport } from "next";
import "./ctd.css";

export const metadata: Metadata = {
  title: "From Clicks to Delegation — what 30 years of e-commerce reveal about agentic commerce",
  description: "An interactive research report: the 1994–2026 e-commerce transition, the real state of agentic commerce in November 2026, and what history does and does not predict about delegated shopping.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#f7f4ee", width: "device-width", initialScale: 1 };

// Fonts load at runtime from the stylesheet (no build-time Google Fonts downloads).
export default function ClicksToDelegationLayout({ children }: { children: React.ReactNode }) {
  return <div className="ctd-root">{children}</div>;
}
