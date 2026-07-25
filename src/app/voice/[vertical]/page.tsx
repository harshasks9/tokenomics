import { notFound } from "next/navigation";
import { VERTICALS } from "../data";
import VerticalClient from "./client";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export default async function VerticalPage({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  const data = VERTICALS.find((v) => v.slug === vertical);
  if (!data) notFound();
  return <VerticalClient slug={vertical} />;
}
