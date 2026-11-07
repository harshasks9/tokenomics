import type { Metadata, Viewport } from "next";
import "./lbl.css";

export const metadata: Metadata = {
  title: "Live by Lunch — Google Workspace",
  description: "A morning workshop with your Google Workspace partner. Bring three recurring tasks; by lunch, agents are running them in your own Gmail, Docs, Sheets and Chat — and you approve every send.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

// Fonts load at runtime from the stylesheet (no build-time Google Fonts downloads).
export default function LiveByLunchLayout({ children }: { children: React.ReactNode }) {
  return <div className="lbl-root">{children}</div>;
}
