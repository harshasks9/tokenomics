import type { Metadata } from "next";
import BriefApp from "@/components/brief/BriefApp";

export const metadata: Metadata = {
  title: "AI Daily Brief — Top 10 AI News, in 5 Minutes",
  description:
    "The day's ten most important AI news items, ranked by importance, with an optional Google Cloud interpretation lens. Built for a five-minute executive read.",
};

export default function BriefPage() {
  return <BriefApp />;
}
