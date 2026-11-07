import type { Metadata, Viewport } from "next";
import "./agentify.css";

export const metadata: Metadata = {
  title: "Agentify your Day — Workspace activation (AWT 2.0)",
  description: "Internal: the Q1 FY27 Workspace activation workstream — Gemini agent entitlements, partner-led Agentify your Day workshops, median-usage qualification and accountability.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

// Fonts load at runtime from the stylesheet (no build-time Google Fonts downloads).
export default function AgentifyLayout({ children }: { children: React.ReactNode }) {
  return <div className="ag-root">{children}</div>;
}
