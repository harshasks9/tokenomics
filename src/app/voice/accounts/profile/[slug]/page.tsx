import { notFound } from "next/navigation";
import { ANALYZED_PROFILES, analysisFor, profileBySlug } from "../../index";
import ProfileClient from "./client";

export function generateStaticParams() {
  return ANALYZED_PROFILES().map((p) => ({ slug: p.slug }));
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!profileBySlug(slug) || !analysisFor(slug)) notFound();
  return <ProfileClient slug={slug} />;
}
