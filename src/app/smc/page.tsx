import type { Metadata } from "next";
import SMCExecutiveBrief from "@/components/smc/SMCExecutiveBrief";

export const metadata: Metadata = {
  title: "SMC Enterprise AI Executive Brief",
  description: "An evidence-led enterprise AI strategy for San Miguel Corporation's banking, infrastructure, food and beverage, and fuel retail businesses.",
};

export default function SMCPage() {
  return <SMCExecutiveBrief />;
}
