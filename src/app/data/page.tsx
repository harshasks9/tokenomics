import type { Metadata } from "next";
import AirportDataStrategyMicrosite from "@/components/data/AirportDataStrategyMicrosite";

export const metadata: Metadata = {
  title: "Airport Data Strategy for AI and Agentic Operations",
  description:
    "An executive-ready airport and aviation data strategy for operational transformation, advanced analytics, AI, and agentic AI.",
};

export default function AirportDataStrategyPage() {
  return <AirportDataStrategyMicrosite />;
}
