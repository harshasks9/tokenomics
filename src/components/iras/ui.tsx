"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { SRC } from "@/lib/iras/sources";

/* ── IRAS microsite design tokens ─────────────────────────────── */
export const C = {
  blue: "#1A73E8",
  blueDeep: "#174EA6",
  navy: "#0B1F3A",
  navyCard: "#122A4C",
  green: "#188038",
  amber: "#E37400",
  red: "#D93025",
  teal: "#00897B",
  purple: "#7B61FF",
  ink: "#202124",
  muted: "#5F6368",
  border: "#E8EAED",
  surfaceAlt: "#F8F9FA",
};

/* Scroll-triggered reveal wrapper */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Section heading: kicker number + title + one-line takeaway */
export function SectionHeading({
  kicker,
  title,
  takeaway,
  dark = false,
  center = false,
}: {
  kicker: string;
  title: string;
  takeaway: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p
        className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
        style={{ color: C.blue }}
      >
        {kicker}
      </p>
      <h2
        className={`text-3xl lg:text-5xl font-bold tracking-tight leading-[1.1] ${
          dark ? "text-white" : "text-[#202124]"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-base lg:text-lg max-w-2xl leading-relaxed ${
          dark ? "text-white/60" : "text-[#5F6368]"
        } ${center ? "mx-auto" : ""}`}
      >
        {takeaway}
      </p>
    </Reveal>
  );
}

/* Claim-discipline labels */
export function ClaimTag({
  kind,
  dark = false,
}: {
  kind: "illustrative" | "scenario" | "verified";
  dark?: boolean;
}) {
  const label =
    kind === "illustrative"
      ? "Illustrative"
      : kind === "scenario"
        ? "Potential IRAS scenario"
        : "Publicly documented";
  const color =
    kind === "verified" ? C.green : kind === "scenario" ? C.blue : C.amber;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{
        color,
        background: dark ? `${color}22` : `${color}14`,
        border: `1px solid ${color}33`,
      }}
    >
      {label}
    </span>
  );
}

/* Inline citation superscript linking to the sources section.
   Takes stable source keys; numbers resolve from the register order. */
export function Cite({ k, dark = false }: { k: string | string[]; dark?: boolean }) {
  const keys = Array.isArray(k) ? k : [k];
  return (
    <sup className="ml-0.5 whitespace-nowrap">
      {keys.map((key, i) => (
        <a
          key={key}
          href="#iras-sources"
          className="font-semibold hover:underline"
          style={{ color: dark ? "#8AB4F8" : C.blue, fontSize: "0.7em" }}
          aria-label={`Source ${SRC[key] ?? "?"}`}
        >
          {i > 0 && ","}
          [{SRC[key] ?? "?"}]
        </a>
      ))}
    </sup>
  );
}

/* Small pill used for chips throughout */
export function Chip({
  children,
  color = C.blue,
  dark = false,
  active = false,
  onClick,
}: {
  children: ReactNode;
  color?: string;
  dark?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
        onClick ? "cursor-pointer" : ""
      }`}
      style={{
        color: active ? "#fff" : color,
        background: active ? color : dark ? `${color}1f` : `${color}12`,
        border: `1px solid ${active ? color : `${color}33`}`,
      }}
    >
      {children}
    </Tag>
  );
}
