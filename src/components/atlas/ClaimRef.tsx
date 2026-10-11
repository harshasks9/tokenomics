"use client";

import { assertionById } from "@/lib/atlas/data";
import { ClaimLine } from "./Shared";

export function ClaimLineById({ id }: { id: string }) {
  const a = assertionById(id);
  if (!a) return null;
  return <div className="at-ev" style={{ marginTop: 6, background: "#fff" }}><ClaimLine a={a} showPerson={false} /></div>;
}
