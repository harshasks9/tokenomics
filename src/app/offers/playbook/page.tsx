import type { Metadata } from "next";
import { headers } from "next/headers";
import Footnotes from "@/components/offers/Footnotes";
import Nav from "@/components/offers/Nav";
import TierLadder from "@/components/offers/TierLadder";
import {
  CAVEATS,
  DECISION_TREE,
  FREIGHT_ANALOGY,
  PLAYBOOK_INTRO,
} from "@/lib/offers/content";
import { basePathFor, hostnameFrom } from "@/lib/offers/routes";

export const metadata: Metadata = {
  title: "Offers — Playbook",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t pt-9" style={{ borderColor: "var(--line)" }}>
      <p className="o-eyebrow">{eyebrow}</p>
      <h2 className="o-h2 mt-2.5">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function PlaybookPage() {
  const base = basePathFor(hostnameFrom(await headers()));

  return (
    <>
      <Nav base={base} current="playbook" />

      <main className="mx-auto w-full max-w-[880px] px-4 py-9 sm:px-6 sm:py-12">
        <header className="pb-9">
          <p className="o-eyebrow">Reference · Public construct mechanics</p>
          <h1 className="o-h1 mt-3 max-w-[20ch]">
            Pay for urgency. Get paid for flexibility.
          </h1>
          <p className="o-dim mt-5 max-w-[62ch] text-[14.5px] leading-[1.65]">
            {PLAYBOOK_INTRO}
          </p>
        </header>

        <div className="space-y-11">
          <Section eyebrow="01" title="The price ladder">
            <TierLadder />
          </Section>

          <Section eyebrow="02" title="The freight company">
            <p className="o-dim mb-6 max-w-[62ch] text-[13.5px] leading-[1.65]">
              Buying AI inference is like shipping goods with a logistics
              provider. Every construct maps cleanly — and the mapping is the
              fastest way to explain the whole model without a slide.
            </p>
            <div className="o-panel overflow-x-auto">
              <table className="o-table" style={{ minWidth: 660 }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ width: 230 }}>
                      Logistics concept
                    </th>
                    <th scope="col" style={{ width: 190 }}>
                      Construct
                    </th>
                    <th scope="col">The intuition</th>
                  </tr>
                </thead>
                <tbody>
                  {FREIGHT_ANALOGY.map((row) => (
                    <tr key={row.construct}>
                      <td>{row.logistics}</td>
                      <td style={{ color: "var(--ink)" }}>{row.construct}</td>
                      <td className="text-[12.5px] leading-[1.55]">
                        {row.intuition}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section eyebrow="03" title="Where a workload goes">
            <div className="o-panel overflow-x-auto p-4 sm:p-5">
              <pre
                className="o-mono text-[10.5px] leading-[1.6]"
                style={{ color: "var(--ink-dim)", margin: 0 }}
              >
                {DECISION_TREE}
              </pre>
            </div>
            <p className="o-mono o-faint mt-3 text-[10px] leading-[1.6]">
              Every workload has exactly one home on this tree. A customer
              arguing about price is usually on the wrong branch.
            </p>
          </Section>

          <Section eyebrow="04" title="What has to be said out loud">
            <ol className="grid gap-5 sm:grid-cols-2">
              {CAVEATS.map((caveat, index) => (
                <li key={caveat.title} className="o-panel p-4">
                  <p className="o-mono text-[10px]" style={{ color: "var(--gold)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="o-h3 mt-2" style={{ color: "var(--ink)" }}>
                    {caveat.title}
                  </h3>
                  <p className="o-faint mt-2 text-[11.5px] leading-[1.65]">
                    {caveat.body}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </main>

      <Footnotes />
    </>
  );
}
