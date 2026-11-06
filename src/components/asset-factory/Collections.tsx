"use client";

import { Library, Lock } from "lucide-react";
import { useFactory } from "./state";
import { AssetCard, OrgName, SectionHead } from "./ui";

export default function Collections() {
  const { view } = useFactory();
  if (!view) return null;
  const byId = new Map(view.assets.map((a) => [a.id, a]));
  const ordered = [...view.collections].sort((a, b) => Number(b.mine) - Number(a.mine));
  return (
    <div>
      <div className="af-page-head"><div style={{ flex: 1 }}>
        <div className="af-eyebrow">Collections</div>
        <h1 className="af-h1">Curated solution collections</h1>
        <p className="af-lede">Partner-authored collections showcase repeatable IP. Each viewer sees only the items they&apos;re allowed to — a private asset in a public collection stays private.</p>
      </div></div>
      {ordered.map((c) => {
        const items = c.assetIds.map((id) => byId.get(id)).filter((a): a is NonNullable<typeof a> => Boolean(a));
        const privateCount = items.filter((a) => a.visibility !== "public").length;
        return (
          <section key={c.id} className="af-section">
            <SectionHead
              title={c.name}
              sub={`${c.blurb}`}
              right={<span className="af-row" style={{ gap: 6 }}><Library size={14} /><OrgName org={c.owner} /> · curated by {c.curator}{c.mine && <span className="af-tag p-partner">Yours</span>}</span>}
            />
            {c.mine && privateCount > 0 && <p className="af-muted" style={{ fontSize: 12.5, marginBottom: 8 }}><Lock size={11} /> {privateCount} item(s) are private to {c.owner.name}; other organizations don&apos;t receive them.</p>}
            <div className="af-grid c3">{items.map((a) => <AssetCard key={a.id} a={a} />)}</div>
          </section>
        );
      })}
    </div>
  );
}
