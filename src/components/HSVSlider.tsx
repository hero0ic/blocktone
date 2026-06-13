"use client";

import type { ReactNode } from "react";

export type SliderKind = "hue" | "saturation" | "brightness";

interface HSVSliderProps {
  kind: SliderKind;
  value: number;
  min: number;
  max: number;
  unit?: string;
  orientation?: "horizontal" | "vertical";
  restoreValue?: number;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
  onInteract?: () => void;
  disabled?: boolean;
}

const SLIDER_META: Record<SliderKind, { tooltip: string; label: string }> = {
  hue: { tooltip: "Hue", label: "Hue adjustment" },
  saturation: { tooltip: "Saturation", label: "Saturation adjustment" },
  brightness: { tooltip: "Brightness", label: "Brightness adjustment" },
};

const RAINBOW_GRADIENT =
  "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)";

function HueIcon() {
  return (
    <span
      className="h-4 w-4 shrink-0 rounded-full border border-border/40 shadow-sm"
      style={{ background: RAINBOW_GRADIENT }}
      aria-hidden
    />
  );
}

function SaturationIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5c-2.5 4-6 7.2-6 11a6 6 0 1 0 12 0c0-3.8-3.5-7-6-11z"
      />
    </svg>
  );
}

function BrightnessIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

const ICONS: Record<SliderKind, () => ReactNode> = {
  hue: HueIcon,
  saturation: SaturationIcon,
  brightness: BrightnessIcon,
};

function SliderIcon({ kind }: { kind: SliderKind }) {
  const meta = SLIDER_META[kind];
  const Icon = ICONS[kind];

  return (
    <div className="group/icon relative flex shrink-0 items-center justify-center">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-opacity ${
          kind === "hue"
            ? "opacity-90 group-hover/icon:opacity-100"
            : "text-foreground/55 group-hover/icon:text-foreground/85"
        }`}
        aria-label={meta.label}
      >
        <Icon />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-panel px-2 py-1 font-body text-[10px] text-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/icon:opacity-100"
      >
        {meta.tooltip}
      </span>
    </div>
  );
}

export default function HSVSlider({
  kind,
  value,
  min,
  max,
  unit = "",
  orientation = "horizontal",
  restoreValue,
  formatValue,
  onChange,
  onInteract,
  disabled = false,
}: HSVSliderProps) {
  const isVertical = orientation === "vertical";
  const meta = SLIDER_META[kind];

  const handleChange = (next: number) => {
    onChange(next);
    onInteract?.();
  };

  const displayText = formatValue
    ? `${formatValue(value)}${unit}`
    : `${value}${unit}`;

  const restorePercent =
    restoreValue !== undefined && max > min
      ? ((restoreValue - min) / (max - min)) * 100
      : null;

  if (isVertical) {
    return (
      <div className="flex w-11 shrink-0 flex-col items-center gap-1.5 sm:w-12">
        <SliderIcon kind={kind} />
        <div className="relative flex h-[150px] w-full shrink-0 items-center justify-center">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 h-[150px] w-2.5 -translate-x-1/2 rounded-full bg-foreground/10"
            aria-hidden
          />
          {restorePercent !== null && (
            <div
              className="pointer-events-none absolute left-1/2 z-[1] h-0.5 w-4 -translate-x-1/2 rounded-full bg-foreground/35"
              style={{ top: `calc(${100 - restorePercent}% - 1px)` }}
              aria-hidden
            />
          )}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
            disabled={disabled}
            className="slider-input slider-vertical relative z-10 h-[150px] shrink-0 cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={meta.label}
          />
        </div>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted">
          {displayText}
        </span>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full shrink-0 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <SliderIcon kind={kind} />
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
          {displayText}
        </span>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-foreground/10"
          aria-hidden
        />
        {restorePercent !== null && (
          <div
            className="pointer-events-none absolute top-1/2 z-[1] h-4 w-0.5 -translate-y-1/2 rounded-full bg-foreground/35"
            style={{ left: `calc(${restorePercent}% - 1px)` }}
            aria-hidden
          />
        )}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          disabled={disabled}
          className="slider-input relative z-10 h-3 w-full max-w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={meta.label}
        />
      </div>
    </div>
  );
}
