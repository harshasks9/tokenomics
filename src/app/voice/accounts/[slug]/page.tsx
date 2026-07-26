import { notFound } from "next/navigation";
import { ALL_ACCOUNTS, accountBySlug } from "../index";
import AccountClient from "./client";

export function generateStaticParams() {
  return ALL_ACCOUNTS.map((a) => ({ slug: a.slug }));
}

export default async function AccountPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const account = accountBySlug(slug);
  if (!account) notFound();
  return <AccountClient slug={slug} />;
}
