import type { Metadata } from "next";
import SaeAMicrosite from "@/components/korea/SaeAMicrosite";

export const metadata: Metadata = {
  title: "The Allocation Advantage | Global Sae-A and Google Cloud",
  description:
    "Prepared for the executive leadership of Global Sae-A (글로벌세아): what the July 2026 trade reset means for a dual-hemisphere manufacturing footprint, what changes function by function, an open value model, and the plan we propose for the 14 August AX Workshop.",
};

export default function KoreaSaeAPage() {
  return <SaeAMicrosite />;
}
