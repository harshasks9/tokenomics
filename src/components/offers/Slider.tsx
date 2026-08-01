"use client";

import { useId } from "react";

export type Marker = "anchored" | "modelled";

export interface SliderProps {
  label: string;
  /** Right-hand mono readout, e.g. "55%" or "$2,400K". */
  readout: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** CSS colour for the thumb and filled track. */
  accent: string;
  /** ● anchored to the decks, ○ a modelled assumption. Defaults to modelled. */
  marker?: Marker;
  caption?: string;
  /** Spoken value for screen readers, when the readout alone is ambiguous. */
  ariaValueText?: string;
}

export default function Slider({
  label,
  readout,
  value,
  min,
  max,
  step,
  onChange,
  accent,
  marker = "modelled",
  caption,
  ariaValueText,
}: SliderProps) {
  const id = useId();
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="pt-1">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[12.5px] leading-tight">
          <span
            className={`o-marker ${
              marker === "anchored" ? "o-marker-anchored" : "o-marker-modelled"
            } mr-1.5`}
            aria-hidden="true"
          >
            {marker === "anchored" ? "●" : "○"}
          </span>
          {label}
        </label>
        <span
          className="o-mono o-animate-value shrink-0 text-[12px]"
          style={{ color: accent }}
        >
          {readout}
        </span>
      </div>

      <input
        id={id}
        type="range"
        className="o-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={
          { "--thumb": accent, "--fill": fill } as React.CSSProperties
        }
        aria-label={label}
        aria-valuetext={ariaValueText ?? readout}
      />

      {caption ? (
        <p className="o-mono o-faint -mt-1 text-[10px] leading-[1.5]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
