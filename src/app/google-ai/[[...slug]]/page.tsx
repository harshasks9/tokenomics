import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hub from "@/components/google-ai/Hub";
import { todayISO } from "@/lib/google-ai/dates";
import { ANNOUNCEMENT_BY_ID, ENTITY_BY_ID } from "@/lib/google-ai/kb";
import { SECTIONS } from "@/lib/google-ai/sections";

// Rendered per request so "today" is the real date: windows such as "last 7 days" must never be frozen at build time.
export const dynamic = "force-dynamic";

type Params = { slug?: string[] };

function resolve(slug: string[] = []): { title: string } | null {
  const [a, b, c] = slug;
  if (c) return null;
  if (!a) return { title: "Overview" };
  if (a === "entity") return b && ENTITY_BY_ID[b] ? { title: ENTITY_BY_ID[b].name } : null;
  const section = SECTIONS.find((s) => s.slug === a);
  if (!section) return null;
  if (!b) return { title: section.label };
  if (a === "latest") return ANNOUNCEMENT_BY_ID[b] ? { title: ANNOUNCEMENT_BY_ID[b].title } : null;
  return null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = resolve((await params).slug);
  return r ? { title: r.title } : {};
}

export default async function GoogleAiPage({ params }: { params: Promise<Params> }) {
  const { slug = [] } = await params;
  if (!resolve(slug)) notFound();
  return <Hub slug={slug} today={todayISO()} />;
}
