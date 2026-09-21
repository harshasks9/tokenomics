import { ORDER_TERMS, TERM_NOTES, type Basis } from "@/lib/mdes/terms";
import { Badge } from "./Assumptions";

const ORDER: Basis[] = ["contract", "assumption", "proposed"];
const HEAD: Record<Basis, string> = {
  contract: "In the Order Form",
  assumption: "Working assumptions (not in the Order Form)",
  proposed: "Proposed flexibility (requires approval)",
};

export default function Terms() {
  return (
    <>
      <section className="mg-card">
        <div className="mg-headrow"><h2>Order Form fee table</h2><Badge basis="contract" /></div>
        <p className="mg-hint">Google Cloud Addendum (Subscription Order Form), 17 Sep 2026, Quote Q-465401. Partner: Human Intelligence Company Limited. Relevant Customer: MDES. SKU D8F8-F694-6AC9, Gemini Enterprise for EDU, monthly in arrears.</p>
        <div className="mg-tablewrap">
          <table className="mg-table">
            <thead><tr><th>Order term start</th><th className="num">Term</th><th className="num">Units (users)</th><th className="num">List</th><th className="num">Discount</th><th className="num">Price / unit</th><th className="num">Fees / month</th><th className="num">Total for term</th></tr></thead>
            <tbody>
              {ORDER_TERMS.map((t) => (
                <tr key={t.start}>
                  <td>{t.start}</td>
                  <td className="num">{t.months} mo</td>
                  <td className="num">{t.units.toLocaleString("en-US")}</td>
                  <td className="num">$5</td>
                  <td className="num">60%</td>
                  <td className="num">$2</td>
                  <td className="num">${t.feesPerMonth.toLocaleString("en-US")}</td>
                  <td className="num">${t.total.toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={2}>Total subscription fees</td><td className="num">5,400,000 user-months</td><td colSpan={4} /><td className="num">$10,800,000</td></tr></tfoot>
          </table>
        </div>
      </section>
      {ORDER.map((b) => (
        <section className="mg-card" key={b}>
          <div className="mg-headrow"><h2>{HEAD[b]}</h2><Badge basis={b} /></div>
          <ul className="mg-terms-list">
            {TERM_NOTES.filter((t) => t.basis === b).map((t) => (
              <li key={t.id}>
                <b>{t.title}</b>
                <p>{t.text}</p>
                <span className="src">{t.source}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
