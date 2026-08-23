"use client";

import type { ComponentType } from "react";
import {
  BadgeCheck,
  BarChart3,
  CalendarClock,
  CircleDollarSign,
  Code2,
  Database,
  FileSearch,
  Fingerprint,
  GitBranch,
  Headset,
  Lightbulb,
  LifeBuoy,
  ListChecks,
  MessageCircleQuestion,
  Microscope,
  ScanSearch,
  ShieldAlert,
  Telescope,
  Workflow,
  Wrench,
} from "lucide-react";
import type { Lens, SellerKit } from "@/lib/harness/types";
import { SELLER_KITS } from "@/lib/harness/frameworks";

/** Content files reference icons by name so lib stays presentation-free. */
const ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  ScanSearch,
  Database,
  Wrench,
  GitBranch,
  ListChecks,
  Fingerprint,
  BadgeCheck,
  ShieldAlert,
  Telescope,
  LifeBuoy,
  CircleDollarSign,
  Code2,
  FileSearch,
  Headset,
  Microscope,
  BarChart3,
  Workflow,
  CalendarClock,
};

export function Icon({ name, size = 16, strokeWidth = 2 }: { name: string; size?: number; strokeWidth?: number }) {
  const C = ICONS[name];
  return C ? <C size={size} strokeWidth={strokeWidth} /> : null;
}

export const LENS_LABEL: Record<Lens, string> = {
  exec: "Executive",
  architect: "Architect",
  developer: "Developer",
};

export function SectionHeader({
  num,
  label,
  title,
  lede,
}: {
  num: string;
  label: string;
  title: string;
  lede: React.ReactNode;
}) {
  return (
    <>
      <div className="hx-kicker">
        <span className="hx-num">{num}</span>
        <span className="hx-label">{label}</span>
      </div>
      <h2 className="hx-h2">{title}</h2>
      <p className="hx-lede">{lede}</p>
    </>
  );
}

/** Every section carries exactly one central idea (PRD §19). */
export function Idea({ children }: { children: React.ReactNode }) {
  return (
    <div className="hx-idea">
      <span className="hx-idea-tag">
        <Lightbulb size={11} style={{ display: "inline", verticalAlign: "-1px" }} /> Idea
      </span>
      <p>{children}</p>
    </div>
  );
}

/** Seller-mode kit for a section; renders nothing when seller mode is off. */
export function Seller({ sectionId, on }: { sectionId: string; on: boolean }) {
  if (!on) return null;
  const kit: SellerKit | undefined = SELLER_KITS.find((k) => k.sectionId === sectionId);
  if (!kit) return null;
  return (
    <div className="hx-seller">
      <div className="h">
        <MessageCircleQuestion size={13} /> Questions to ask the customer
      </div>
      <ul>
        {kit.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      <div className="tt">
        <strong>Talk track · </strong>
        {kit.talkTrack}
      </div>
    </div>
  );
}

/** Lens-aware depth block. */
export function Depth({ lens, body }: { lens: Lens; body: Record<Lens, string> }) {
  return (
    <div className="hx-depth">
      <div className="who">{LENS_LABEL[lens]} view</div>
      {body[lens]}
    </div>
  );
}
