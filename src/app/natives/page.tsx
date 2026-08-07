import type { Metadata } from "next";
import NativesApp from "./app";

export const metadata: Metadata = {
  title: "Agentic Communications Opportunity — India Digital Natives",
  description:
    "Ten of India's largest digital natives, fifty scored agentic communications opportunities, and five repeatable archetypes — a seller-ready opportunity intelligence system.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NativesApp />;
}
