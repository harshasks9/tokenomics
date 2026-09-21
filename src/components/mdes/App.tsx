"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { evaluate } from "@/lib/mdes/engine";
import { toCsv } from "@/lib/mdes/csv";
import { usePlan, useHydrated } from "@/lib/mdes/plan";
import { deleteScenario, loadSaved, saveScenario, type SavedScenario } from "@/lib/mdes/storage";
import Assumptions from "./Assumptions";
import Kpis from "./Kpis";
import MonthTable from "./MonthTable";
import PrintSummary from "./PrintSummary";
import Scenarios from "./Scenarios";
import SpendChart from "./SpendChart";
import Terms from "./Terms";
import UsersChart from "./UsersChart";

type Tab = "plan" | "scenarios" | "contract" | "method";
const TABS: { id: Tab; label: string }[] = [
  { id: "plan", label: "Plan" },
  { id: "scenarios", label: "Scenarios" },
  { id: "contract", label: "Contract" },
  { id: "method", label: "Method" },
];

// Saved-scenario list as an external store so SSR and first client render agree (empty).
let savedCache: SavedScenario[] | null = null;
const savedListeners = new Set<() => void>();
function savedSnapshot() { if (savedCache === null) savedCache = loadSaved(); return savedCache; }
function savedSubscribe(l: () => void) { savedListeners.add(l); return () => { savedListeners.delete(l); }; }
function setSaved(next: SavedScenario[]) { savedCache = next; for (const l of savedListeners) l(); }
const EMPTY: SavedScenario[] = [];

export default function App({ home, customerHref }: { home: string; customerHref: string }) {
  const { inputs, update, set, reset } = usePlan();
  const hydrated = useHydrated();
  const result = useMemo(() => evaluate(inputs), [inputs]);
  const [tab, setTab] = useState<Tab>("plan");
  const saved = useSyncExternalStore(savedSubscribe, savedSnapshot, () => EMPTY);
  const [savedOpen, setSavedOpen] = useState(false);

  const onSave = () => {
    const name = window.prompt("Name this scenario", `Plan ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
    if (name === null) return;
    setSaved(saveScenario(name, inputs));
  };
  const onExport = () => {
    const blob = new Blob([toCsv(result)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mdes-gemini-enterprise-plan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const onReset = () => {
    if (window.confirm("Reset to the contracted baseline? Unsaved edits to the working plan are lost.")) reset();
  };

  return (
    <div className="mg-shell">
      <header className="mg-top">
        <a className="mg-home" href={home} aria-label="Back to aitokenomics.app">← aitokenomics</a>
        <div className="mg-title">
          <h1>MDES × Human Intelligence · Gemini Enterprise commitment planner</h1>
          <span className="mg-sub">$10.8M / 12 months · Gemini Enterprise for EDU · Internal planning tool — proposed flexibility is not approved</span>
        </div>
        <nav className="mg-tabs" role="tablist" aria-label="Sections">
          {TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </nav>
        <div className="mg-actions">
          <div className="mg-menu">
            <button type="button" className="mg-btn" aria-haspopup="menu" aria-expanded={savedOpen} onClick={() => setSavedOpen((o) => !o)}>Saved{hydrated && saved.length > 0 ? ` (${saved.length})` : ""}</button>
            {savedOpen && (
              <div className="mg-menu-list" role="menu">
                {saved.length === 0 && <div className="mg-hint" style={{ padding: "6px 10px" }}>No saved scenarios yet. Saved in this browser only.</div>}
                {saved.map((s) => (
                  <div key={s.id} className="mg-menu-item">
                    <button type="button" role="menuitem" onClick={() => { set(s.inputs); setSavedOpen(false); }}>
                      <b>{s.name}</b><span>{new Date(s.savedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                    </button>
                    <button type="button" className="del" aria-label={`Delete ${s.name}`} onClick={() => setSaved(deleteScenario(s.id))}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="button" className="mg-btn" onClick={onSave}>Save</button>
          <button type="button" className="mg-btn" onClick={onExport}>CSV</button>
          <button type="button" className="mg-btn" onClick={() => window.print()}>Print</button>
          <button type="button" className="mg-btn ghost" onClick={onReset}>Reset baseline</button>
          <a className="mg-btn accent" href={customerHref}>Customer view →</a>
        </div>
      </header>

      <div className="mg-screen">
        <Kpis result={result} />
        <div className="mg-grid">
          <Assumptions inputs={inputs} result={result} update={update} set={set} />
          <main className="mg-results">
            {tab === "plan" && (
              <>
                <section className="mg-card">
                  <div className="mg-headrow"><h2>Monthly billed users</h2><span className="mg-hint">users in K · hover for exact</span></div>
                  <UsersChart result={result} update={update} />
                </section>
                <section className="mg-card">
                  <div className="mg-headrow"><h2>Cumulative consumption vs. commitment</h2><span className="mg-hint">USD in M · hover for exact</span></div>
                  <SpendChart result={result} />
                </section>
                <section className="mg-card">
                  <div className="mg-headrow"><h2>Monthly detail</h2><span className="mg-hint">full precision inside; rounded for display</span></div>
                  <MonthTable result={result} update={update} />
                </section>
              </>
            )}
            {tab === "scenarios" && <Scenarios inputs={inputs} />}
            {tab === "contract" && <Terms />}
            {tab === "method" && <Method />}
          </main>
        </div>
      </div>
      <PrintSummary result={result} />
    </div>
  );
}

function Method() {
  return (
    <section className="mg-card mg-method">
      <h2>How the numbers are built</h2>
      <ol>
        <li><b>Monthly GE spend</b> = billed users × price per user per month. Adoption is an estimate of certified learners; billed users are the licenses actually ordered. They are equal unless you unlink them.</li>
        <li><b>Total consumption</b> = GE spend + eligible GCP spend that you explicitly enter, and only when GCP allocation is switched on. A cap (USD or % of commitment) limits what is counted; eligible spend above the cap is reported but never counted twice.</li>
        <li><b>Remaining commitment</b> = max($10.8M − cumulative consumption, 0). <b>Spend above</b> = max(cumulative consumption − $10.8M, 0).</li>
        <li><b>Commitment ≠ consumption.</b> The Order Form invoices the ordered units monthly in arrears; a shortfall does not reduce what is owed and creates no refund, rollover or extension. The baseline row therefore shows 100% utilization by construction, and the exposure shows up as ordered-but-unadopted licenses.</li>
        <li><b>Validation.</b> The ordered schedule sums to 5,400,000 user-months = 450,000 average billed users; at $2 that is exactly $10.8M. The engine carries full precision; K and M rounding happens only in the display (hover any figure for the exact value).</li>
        <li><b>Price.</b> Any price at or above the $1.85 floor is accepted; below it is rejected. $2 is the Order Form price (list $5 less 60%) and the Maximum Retail Price; any other price is flagged as needing an amended order form.</li>
        <li><b>Solvers.</b> &ldquo;Required Month-12 users&rdquo; bisects on the Month-12 value of the current ramp shape (launch month, pattern, ceiling) until window consumption equals the commitment; when the ceiling or launch timing makes that impossible it says how far short the maximum reachable ramp falls. &ldquo;Flat from launch&rdquo; is the constant billed user count that would do the same.</li>
        <li><b>Extension.</b> Months beyond 12 hold the term-end billed users and GCP spend unless edited. The extension price is a visible assumption. The term-end milestone (650K billed users) is evaluated at the end of the 12-month term in every scenario and never moves. For the as-signed schedule that is M11, the last month with an order term; for a modelled ramp it is M12.</li>
        <li><b>Cases and sensitivity.</b> Low/high cases scale the ramp and shift the launch; the sensitivity grid does the same across a range and reports the unconsumed commitment under the current GCP and window settings.</li>
      </ol>
      <p className="mg-hint">Month 1 is October 2026, the provisioning month. Billing periods run from the 15th to the 14th, so the six order terms cover M1–M11 back-to-back (15 Oct 2026 – 14 Sep 2027) and M12 (September 2027) is the month the final term ends. Nothing here is stored outside this browser.</p>
    </section>
  );
}
