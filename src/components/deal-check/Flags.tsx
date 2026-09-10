import type { Result } from "@/lib/deal-check/engine";

const LABEL = { stop: "Stop", warn: "Check", info: "Note" } as const;

export default function Flags({ result }: { result: Result }) {
  const order = { stop: 0, warn: 1, info: 2 };
  const flags = [...result.flags].sort((a, b) => order[a.level] - order[b.level]);
  return (
    <ul className="dc-flags">
      {flags.map((f) => (
        <li key={f.id}><span className={`dc-flag-icon ${f.level}`}>{LABEL[f.level]}</span><span>{f.text}</span></li>
      ))}
    </ul>
  );
}
