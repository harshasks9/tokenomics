"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/** A titled section with an optional dark treatment. */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  dark = false,
  className = "",
  children,
  headAside,
}: {
  id: string;
  eyebrow?: string;
  title?: string[];
  lead?: string;
  dark?: boolean;
  className?: string;
  children?: ReactNode;
  headAside?: ReactNode;
}) {
  return (
    <section id={id} className={`ds-section${dark ? " ds-dark" : ""} ${className}`} aria-labelledby={title ? `${id}-title` : undefined}>
      <div className="ds-container">
        {(eyebrow || title || lead) && (
          <div className="ds-head">
            {eyebrow && (
              <Reveal>
                <p className="ds-eyebrow">{eyebrow}</p>
              </Reveal>
            )}
            {title && (
              <Reveal delay={0.05}>
                <h2 id={`${id}-title`} className="ds-h2">
                  {title.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
              </Reveal>
            )}
            {lead && (
              <Reveal delay={0.1}>
                <p className="ds-lead">{lead}</p>
              </Reveal>
            )}
            {headAside}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Fade-and-rise on entering the viewport. Static under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  y = 18,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  y?: number;
  as?: "div" | "li";
}) {
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}

export function Chip({ children, color, className = "" }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span className={`ds-chip ${className}`} style={color ? ({ "--dot": color } as CSSProperties) : undefined}>
      {color && <i className="ds-chip__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function Tag({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="ds-tag" style={color ? ({ "--tag": color } as CSSProperties) : undefined}>
      {children}
    </span>
  );
}

/** Big two-line statement used for the headline moments. */
export function Statement({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <p className={`ds-h2 ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </p>
  );
}
