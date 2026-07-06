import type { Metadata } from "next";
import PrudentialAgenticInsurerMicrosite from "@/components/prudential/PrudentialAgenticInsurerMicrosite";

export const metadata: Metadata = {
  title: "The Agentic Insurer | Prudential plc and Google Cloud",
  description:
    "A structured executive microsite on how agentic AI can reshape insurance and how Google Cloud can help Prudential plc become an AI-native insurer.",
};

export default function PrudentialAgenticInsurerPage() {
  return <PrudentialAgenticInsurerMicrosite />;
}
