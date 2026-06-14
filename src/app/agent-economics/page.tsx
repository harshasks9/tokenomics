import type { Metadata } from "next";
import AgentEconomicsExperience from "@/components/enterprise-lens/AgentEconomicsExperience";

export const metadata: Metadata = {
  title: "Enterprise Agent Economics | AI Tokenomics",
  description: "Define an enterprise agent estate, derive its production capabilities, and compare integrated versus assembled delivery-stack economics.",
};

export default function AgentEconomicsPage() {
  return <AgentEconomicsExperience />;
}
