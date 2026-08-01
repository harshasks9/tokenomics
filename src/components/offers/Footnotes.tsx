export const FOOTNOTES = [
  {
    id: "tokens-only",
    text: "Deferred Agents API discounts LLM inference tokens only. 1P agent premiums — harness fees — stay at standard rates, which is what the h lever models. A full agent bill never lands at 0.5x.",
  },
  {
    id: "residency",
    text: "Off-peak PayGo and Deferred are global-endpoint only. Workloads under in-country ML processing or data-residency mandates cannot use either tier; screen each workload's residency class before modelling it at 0.5x.",
  },
  {
    id: "non-stacking",
    text: "FSP is non-stacking — the on-demand rate is the ceiling, and FSP draws down the EA rather than compounding with EA-level discounts. The GSU line therefore takes the better of FSP and the GCP commit discount, never both.",
  },
  {
    id: "preview",
    text: "Flex, Deferred, Off-peak and the FSP MVP are preview constructs. Terms and timelines can move before GA; do not write preview terms into a signed contract.",
  },
  {
    id: "windows",
    text: "Off-peak windows follow the US clock: weekdays 3–9 PM PT, weekends Friday 3 PM – Sunday 9 PM PT.",
  },
] as const;

export default function Footnotes() {
  return (
    <footer
      className="border-t px-4 py-8 sm:px-6"
      style={{ borderColor: "var(--line)" }}
    >
      <h2 className="o-eyebrow">Caveats that travel with every number</h2>

      <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {FOOTNOTES.map((note, index) => (
          <li key={note.id} className="flex gap-2.5">
            <span
              className="o-mono shrink-0 text-[10px] leading-[1.8]"
              style={{ color: "var(--gold)" }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="o-faint text-[11.5px] leading-[1.65]">{note.text}</p>
          </li>
        ))}
      </ol>

      <div
        className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5"
        style={{ borderColor: "var(--line)" }}
      >
        <p className="o-mono o-faint text-[10px] leading-[1.7]">
          Internal illustrative modeling. Not a rate card. Not for external
          distribution.
        </p>
        <form action="/api/offers/logout" method="post">
          <button type="submit" className="o-btn">
            Lock
          </button>
        </form>
      </div>
    </footer>
  );
}
