import type { Metadata } from "next";
import SaeAMicrosite from "@/components/korea/SaeAMicrosite";

export const metadata: Metadata = {
  title: "The Allocation Advantage | Global Sae-A and Google Cloud",
  description:
    "An executive strategy microsite for Global Sae-A (글로벌세아): customer intelligence, executive personas, an AI opportunity map, an open ROI model and the AX programme sequence for the 14 August 2026 workshop.",
};

export default function KoreaSaeAPage() {
  return <SaeAMicrosite />;
}
