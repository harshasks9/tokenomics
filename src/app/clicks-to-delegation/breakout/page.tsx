import type { Metadata } from "next";
import Breakout from "@/components/clicks-to-delegation/breakout/Breakout";

export const metadata: Metadata = {
  title: "Cloud for Agentic Commerce & Digital Banking — Breakout 1: Agentic Commerce",
  description: "Talk track, slides and discussion plan for the Agentic Commerce breakout with Sea Limited: what has to be true underneath Shopee and Monee's AI vision.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function BreakoutPage() {
  return <Breakout />;
}
