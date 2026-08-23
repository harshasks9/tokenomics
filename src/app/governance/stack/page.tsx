import type { Metadata } from "next";
import Link from "next/link";
import { LAYERS, RISKS } from "@/lib/governance/data";
import { StackExplorer } from "@/components/governance/StackExplorer";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "The governance stack",
  description:
    "Seven layers of enterprise AI governance — each with its question, risks, owners, controls, and technical enforcement.",
};

export default function StackPage() {
  return (
    <>
      <Section
        num="03"
        kicker="The governance stack"
        title="Seven layers, one operating loop."
        lede="Each layer answers one question, carries its own risks and owners, and runs the same loop: set policy, gate the lifecycle, enforce at runtime, prove it with evidence. Select a layer to preview it, then go as deep as the room requires — every layer has an executive, practitioner, and technical view."
      >
        <StackExplorer layers={LAYERS} risks={RISKS} />
      </Section>

      <Section
        kicker="The control map"
        title="The whole framework on one screen."
        lede="The seller's cheat sheet: what each layer governs, who owns it, and the flagship controls. Every row links to the full treatment."
      >
        <div className="g-table-scroll">
          <table className="g-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Core question</th>
                <th>Risks concentrated here</th>
                <th>Flagship controls</th>
                <th>Primary owners</th>
              </tr>
            </thead>
            <tbody>
              {LAYERS.map((layer) => {
                const layerRisks = RISKS.filter((r) => layer.riskIds.includes(r.id));
                return (
                  <tr key={layer.id}>
                    <td className="lead" data-hue={layer.hue}>
                      <Link href={`/governance/stack/${layer.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <span className="g-dot" />
                        {layer.num}. {layer.short}
                      </Link>
                    </td>
                    <td style={{ minWidth: 180 }}>{layer.question}</td>
                    <td style={{ minWidth: 160 }}>{layerRisks.map((r) => r.name).join(" · ")}</td>
                    <td style={{ minWidth: 220 }}>
                      {layer.practitioner.controls.slice(0, 3).map((c) => c.control).join(" · ")}
                    </td>
                    <td style={{ minWidth: 150 }}>
                      {[...new Set(layer.practitioner.controls.map((c) => c.owner.split(" + ")[0].split(" / ")[0]))]
                        .slice(0, 3)
                        .join(" · ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="g-micro" style={{ marginTop: 12 }}>
          Full control detail — mechanisms, standards hooks, and technical enforcement — lives on each
          layer page under the practitioner and technical views.
        </p>
      </Section>
    </>
  );
}
