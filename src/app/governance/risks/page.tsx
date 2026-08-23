import type { Metadata } from "next";
import { GOOGLE_CAPABILITIES, INCIDENTS, LAYERS, RISKS } from "@/lib/governance/data";
import { RiskExplorer } from "@/components/governance/RiskExplorer";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "Explore by risk",
  description:
    "Twelve AI risks with documented incidents, mitigating controls, and where each lives in the governance stack.",
};

export default function RisksPage() {
  return (
    <Section
      num="05"
      kicker="Explore by risk"
      title="The risks that keep this conversation honest."
      lede="Every risk here has already happened to someone — most entries carry documented incidents with dates. Filter by layer, open a risk for its controls, and note the pattern: in every case, a policy existed; an enforced control did not."
    >
      <RiskExplorer risks={RISKS} layers={LAYERS} incidents={INCIDENTS} capabilities={GOOGLE_CAPABILITIES} />
    </Section>
  );
}
