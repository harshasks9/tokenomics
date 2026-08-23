import type { ReactNode } from "react";

/** Standard section scaffold: numbered kicker, serif title, optional lede. */
export function Section({
  id,
  num,
  kicker,
  title,
  lede,
  hue,
  children,
  wide,
}: {
  id?: string;
  num?: string;
  kicker: string;
  title?: ReactNode;
  lede?: ReactNode;
  hue?: string;
  children?: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} className="g-section" data-hue={hue}>
      <div className={wide ? "g-wrap" : "g-wrap"}>
        <div className="g-kicker">
          {num ? <span className="g-kicker-num">{num}</span> : null}
          {kicker}
        </div>
        {title ? <h2 className="g-h2">{title}</h2> : null}
        {lede ? <p className="g-lede">{lede}</p> : null}
        {children ? <div style={{ marginTop: title || lede ? 28 : 0 }}>{children}</div> : null}
      </div>
    </section>
  );
}

/** "Use this in the room" — the seller's discussion aid. */
export function TalkTrack({ points, insight }: { points: ReactNode[]; insight?: ReactNode }) {
  return (
    <div className="g-block">
      <div className="g-block-title">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        In the room — discussion points
      </div>
      {insight ? (
        <p className="g-serif-voice" style={{ fontSize: 15.5, marginBottom: 14 }}>
          {insight}
        </p>
      ) : null}
      <ul className="g-list">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

/** Discovery questions the seller can put to the customer. */
export function DiscoveryQuestions({ questions, title }: { questions: ReactNode[]; title?: string }) {
  return (
    <div className="g-block">
      <div className="g-block-title">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        {title ?? "Questions to ask your organization"}
      </div>
      <ul className="g-list g-list-q">
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>
  );
}

/** Clearly identified Google Cloud point of view, always after the neutral treatment. */
export function GoogleBand({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="g-google-band">
      <div className="g-block-title">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />
        </svg>
        {title ?? "How Google Cloud approaches this"}
      </div>
      {children}
    </div>
  );
}

/** Claim-type badge: regulation / standard / practice / vendor capability / google view. */
export function ClaimBadge({ kind }: { kind: "regulation" | "standard" | "practice" | "vendor" | "google" }) {
  const label = {
    regulation: "Regulation",
    standard: "Standard",
    practice: "Practice",
    vendor: "Vendor capability",
    google: "Google view",
  }[kind];
  const cls = {
    regulation: "reg",
    standard: "standard",
    practice: "practice",
    vendor: "vendor",
    google: "google",
  }[kind];
  return <span className={`g-badge ${cls}`}>{label}</span>;
}

/** One-line stat with label, used in stat rows. */
export function Stat({ value, label, source }: { value: ReactNode; label: ReactNode; source?: ReactNode }) {
  return (
    <div className="g-card">
      <div className="g-stat">{value}</div>
      <div className="g-stat-label">{label}</div>
      {source ? <div className="g-footnote-src">{source}</div> : null}
    </div>
  );
}
