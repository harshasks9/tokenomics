import { explain, type Explanation as E } from "@/lib/deal-check/explain";
import type { Result } from "@/lib/deal-check/engine";

export default function Explanation({ result }: { result: Result }) {
  const e: E = explain(result);
  return (
    <div className="dc-explain">
      <p className="lead">{e.opening}</p>
      <div className="dc-two-col">
        <p><b className="aws">AWS MAP.</b> {e.aws}</p>
        <p><b className="google">Google offer.</b> {e.google}</p>
      </div>
      <p>{e.commits}</p>
      <p><b>The result.</b> {e.verdict}</p>
      <h3>What moves the answer</h3>
      <ul>{e.levers.map((l) => <li key={l}>{l}</li>)}</ul>
    </div>
  );
}
