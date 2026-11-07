import type { Metadata, Viewport } from "next";
import "./agentify.css";

export const metadata: Metadata = {
  title: "Agentify your Day — Google Workspace",
  description: "See one working day twice — before and after long-running agents in Gmail, Docs, Sheets, Chat and Meet — for FP&A, DevOps, SecOps and RevOps teams, on the Workspace plan you already have.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

// Fonts load at runtime from the stylesheet (no build-time Google Fonts downloads).
export default function AgentifyLayout({ children }: { children: React.ReactNode }) {
  return <div className="ag-root">{children}</div>;
}
