"use client";

import { PRESETS, type Preset } from "@/lib/offers/presets";

export default function ScenarioBar({
  activeId,
  note,
  onSelect,
  onDismissNote,
}: {
  activeId: string | null;
  note: Preset | null;
  onSelect: (preset: Preset) => void;
  onDismissNote: () => void;
}) {
  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Scenario presets"
      >
        <span className="o-eyebrow mr-1" style={{ color: "var(--ink-faint)" }}>
          Scenarios
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="o-chip"
            aria-pressed={activeId === preset.id}
            onClick={() => onSelect(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {note ? (
        <div
          className="o-panel o-fade-in mt-3 flex items-start gap-3 px-4 py-3"
          role="status"
        >
          <span
            className="o-marker o-marker-anchored mt-1.5"
            aria-hidden="true"
          >
            ●
          </span>
          <p className="o-dim flex-1 text-[12.5px] leading-[1.6]">
            <span style={{ color: "var(--ink)" }}>{note.label}.</span>{" "}
            {note.note}
          </p>
          <button
            type="button"
            onClick={onDismissNote}
            className="o-mono o-faint shrink-0 text-[11px] leading-none"
            style={{ padding: 4 }}
            aria-label="Dismiss scenario note"
          >
            ✕
          </button>
        </div>
      ) : null}
    </div>
  );
}
