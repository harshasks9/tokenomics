import type { Metadata, Viewport } from "next";
import "./gai.css";

export const metadata: Metadata = {
  title: { default: "Google AI Intelligence Hub", template: "%s · Google AI Intelligence Hub" },
  description: "An independent, source-grounded intelligence system for Google's AI ecosystem: what changed, how it works and why it matters — models, platform, agents, pricing, competitors and history.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Fonts load at runtime from the stylesheet (no build-time Google Fonts downloads).
export default function GoogleAiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
