import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LAYER_MAP, PERSONAS } from "@/lib/governance/data";
import { DiscoveryQuestions } from "@/components/governance/ui";

export function generateStaticParams() {
  return PERSONAS.map((p) => ({ persona: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}): Promise<Metadata> {
  const { persona } = await params;
  const p = PERSONAS.find((x) => x.id === persona);
  return { title: p ? `${p.title} — what AI governance means for you` : "Persona" };
}

export default async function PersonaPage({ params }: { params: Promise<{ persona: string }> }) {
  const { persona } = await params;
  const p = PERSONAS.find((x) => x.id === persona);
  if (!p) notFound();

  const emphases = p.layerEmphasis.map((id) => LAYER_MAP[id]).filter(Boolean);
  const primary = emphases[0];

  return (
    <div data-hue={primary?.hue ?? "neutral"}>
      <section className="g-section" style={{ paddingTop: 48 }}>
        <div className="g-wrap">
          <div className="g-kicker">
            <span className="g-kicker-num">04</span>
            <Link href="/governance/personas" style={{ color: "inherit" }}>Personas</Link>
            <span style={{ color: "var(--faint)" }}>/ {p.group}</span>
          </div>
          <h1 className="g-h1" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>{p.title}</h1>
          <p className="g-serif-voice" style={{ fontSize: 18, marginTop: 10 }}>{p.tagline}</p>
        </div>
      </section>

      <section className="g-section" style={{ paddingTop: 24 }}>
        <div className="g-wrap">
          <div className="g-grid-3">
            <div className="g-card">
              <div className="g-block-title">You are accountable for</div>
              <ul className="g-list">
                {p.cares.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="g-card">
              <div className="g-block-title">What keeps you up at night</div>
              <ul className="g-list">
                {p.nightmares.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
            <div className="g-card">
              <div className="g-block-title">Decisions you own</div>
              <ul className="g-list g-list-check">
                {p.decisions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="g-section">
        <div className="g-wrap">
          <div className="g-grid-2">
            <div>
              <h3 className="g-h3" style={{ marginBottom: 14 }}>Your layers of the stack</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {emphases.map((l) => (
                  <Link key={l.id} href={`/governance/stack/${l.id}`} data-hue={l.hue} className="g-stack-layer" style={{ textDecoration: "none" }}>
                    <span className="g-stack-num">{l.num}</span>
                    <span>
                      <span className="g-stack-name">{l.name}</span>
                      <span className="g-stack-q" style={{ display: "block" }}>{l.question}</span>
                    </span>
                    <svg className="g-stack-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: 18 }}>
                <div className="g-block-title">Where to go first</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.firstStops.map((s) => (
                    <Link key={s.href + s.label} href={s.href} className="g-chip">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <DiscoveryQuestions title="Questions you should be asking" questions={p.questions} />
          </div>
        </div>
      </section>
    </div>
  );
}
