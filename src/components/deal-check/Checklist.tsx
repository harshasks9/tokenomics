import { dealChecklist, type DealMeta } from "@/lib/deal-check/construct";
import type { Inputs, Result } from "@/lib/deal-check/engine";
import EmailActions from "./EmailActions";

export default function Checklist({ meta, inputs, result }: { meta: DealMeta; inputs: Inputs; result: Result }) {
  const c = dealChecklist(meta, inputs, result);
  return (
    <div>
      <ul className="dc-checklist">
        {c.items.map((it) => (
          <li key={it.label} className={it.ok === true ? "ok" : it.ok === false ? "stop" : "warn"}>
            <span className="mark" aria-hidden="true">{it.ok === true ? "✓" : it.ok === false ? "✕" : "!"}</span>
            <span><b>{it.label}</b><span className="detail">{it.detail}</span></span>
          </li>
        ))}
      </ul>
      <div className="dc-numbers">
        {c.numbers.map((n) => (
          <div key={n.label} className="dc-stat"><div className="k">{n.label}</div><div className="v" style={{ fontSize: 20 }}>{n.value}</div><div className="s">{n.note}</div></div>
        ))}
      </div>
      <EmailActions meta={meta} inputs={inputs} result={result} />
    </div>
  );
}
