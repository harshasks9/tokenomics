"use client";

import { createContext, useCallback, useContext, useState } from "react";

/**
 * One fixed-position tooltip for the whole page. Marks call `show` on
 * pointer/focus with their rows; the tooltip positions itself near the pointer
 * and flips to stay on screen. Content is React nodes built from data, never
 * HTML strings.
 */

export type TipRow = { label: string; value: string; swatch?: string };
export type TipContent = { title: string; rows: TipRow[]; note?: string } | null;

type TipApi = {
  show: (content: TipContent, x: number, y: number) => void;
  move: (x: number, y: number) => void;
  hide: () => void;
};

const TipCtx = createContext<TipApi>({ show: () => {}, move: () => {}, hide: () => {} });

export function useTip() {
  return useContext(TipCtx);
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<TipContent>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const show = useCallback((c: TipContent, x: number, y: number) => {
    setContent(c);
    setPos({ x, y });
  }, []);
  const move = useCallback((x: number, y: number) => setPos({ x, y }), []);
  const hide = useCallback(() => setContent(null), []);

  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const left = pos.x + 14 + 280 > vw ? pos.x - 294 : pos.x + 14;
  const top = pos.y + 14 + 140 > vh ? pos.y - 120 : pos.y + 14;

  return (
    <TipCtx.Provider value={{ show, move, hide }}>
      {children}
      {content && (
        <div className="px-tip" role="tooltip" style={{ left, top }}>
          <div className="t">{content.title}</div>
          {content.rows.map((r) => (
            <div key={r.label} className="r">
              <span>
                {r.swatch && (
                  <span
                    aria-hidden
                    style={{ display: "inline-block", width: 10, height: 3, background: r.swatch, marginRight: 6, verticalAlign: "middle" }}
                  />
                )}
                {r.label}
              </span>
              <strong>{r.value}</strong>
            </div>
          ))}
          {content.note && <div style={{ marginTop: 4, color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{content.note}</div>}
        </div>
      )}
    </TipCtx.Provider>
  );
}
