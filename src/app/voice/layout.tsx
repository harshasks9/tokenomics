import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gemini Enterprise Frontline — Every conversation, one intelligent frontline",
  description:
    "One intelligent layer for every enterprise conversation: inbound service, outbound sales, collections, and employee support handled by governed agents on Google Cloud.",
  robots: { index: false, follow: false },
};

export default function VoiceLayout({ children }: { children: ReactNode }) {
  return children;
}
