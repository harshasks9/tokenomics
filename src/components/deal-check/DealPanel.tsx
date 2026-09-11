"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { Inputs, Result } from "@/lib/deal-check/engine";
import { dealFileName, deleteDeal, parseDeal, saveDeal, savedDealsSnapshot, serializeDeal, serverDealsSnapshot, subscribeSavedDeals, toDealFile, type DealFile, type DealMeta } from "@/lib/deal-check/construct";
import example from "@/lib/deal-check/deals/example.deal.json";

export default function DealPanel({ meta, inputs, result, onMeta, onLoad }: {
  meta: DealMeta; inputs: Inputs; result: Result; onMeta: (m: DealMeta) => void; onLoad: (file: DealFile) => void;
}) {
  const saved = useSyncExternalStore(subscribeSavedDeals, savedDealsSnapshot, serverDealsSnapshot);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500); };
  const set = (patch: Partial<DealMeta>) => onMeta({ ...meta, ...patch });

  const save = () => {
    if (!meta.customer.trim()) { flash("Enter a customer name first."); return; }
    saveDeal(toDealFile(meta, inputs, result));
    flash(`Saved "${meta.customer}" in this browser.`);
  };
  const exportFile = () => {
    const file = toDealFile(meta, inputs, result);
    const blob = new Blob([serializeDeal(file)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = dealFileName(meta); a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      const d = parseDeal(await f.text());
      onLoad(d);
      flash(`Loaded "${d.meta.customer || f.name}".`);
    } catch (e) {
      flash(`Could not load: ${e instanceof Error ? e.message : "unknown error"}`);
    }
    if (fileRef.current) fileRef.current.value = "";
  };
  const loadSaved = (key: string) => {
    if (key === "__example") { onLoad(parseDeal(JSON.stringify(example))); flash("Loaded the example template."); return; }
    const d = saved.find((x) => x.meta.customer === key);
    if (d) { onLoad(d); flash(`Loaded "${d.meta.customer}" (saved ${new Date(d.savedAt).toLocaleDateString()}).`); }
  };

  return (
    <div className="dc-card" style={{ marginBottom: 14 }}>
      <h2>Customer</h2>
      <div className="dc-field">
        <div className="lab"><span>Customer</span></div>
        <div className="ctl single"><input className="dc-num" style={{ textAlign: "left" }} value={meta.customer} onChange={(e) => set({ customer: e.target.value })} placeholder="Customer name" aria-label="Customer name" /></div>
      </div>
      <label className="dc-check"><input type="checkbox" checked={meta.onTargetList} onChange={(e) => set({ onTargetList: e.target.checked })} /><span>Confirmed on the 40-account target list</span></label>
      <div className="dc-field">
        <div className="lab"><span>Owner</span></div>
        <div className="ctl single"><input className="dc-num" style={{ textAlign: "left" }} value={meta.owner} onChange={(e) => set({ owner: e.target.value })} placeholder="Account owner" aria-label="Owner" /></div>
      </div>
      <div className="dc-field">
        <div className="lab"><span>Notes</span></div>
        <div className="ctl single"><textarea className="dc-num" style={{ textAlign: "left", minHeight: 48, resize: "vertical" }} value={meta.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Context for whoever revisits this" aria-label="Notes" /></div>
      </div>
      <div className="dc-toolbar" style={{ marginTop: 10 }}>
        <button className="dc-btn primary" onClick={save}>Save</button>
        <button className="dc-btn" onClick={exportFile}>Export file</button>
        <button className="dc-btn" onClick={() => fileRef.current?.click()}>Import file</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => importFile(e.target.files?.[0])} />
      </div>
      <div className="dc-toolbar">
        <select className="dc-select" value="" onChange={(e) => loadSaved(e.target.value)} aria-label="Saved deals">
          <option value="">Revisit a saved deal…</option>
          <option value="__example">Example Co (template)</option>
          {saved.map((d) => <option key={d.meta.customer} value={d.meta.customer}>{d.meta.customer} · saved {new Date(d.savedAt).toLocaleDateString()}</option>)}
        </select>
        {saved.some((d) => d.meta.customer === meta.customer) && (
          <button className="dc-btn" onClick={() => { deleteDeal(meta.customer); flash(`Removed "${meta.customer}" from this browser.`); }}>Delete</button>
        )}
      </div>
      <p className="dc-presetnote">{msg ?? "Save keeps the deal in this browser; Export writes a .deal.json you can review, share and import later."}</p>
    </div>
  );
}
