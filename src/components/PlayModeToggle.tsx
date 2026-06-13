"use client";

import type { PlayMode } from "@/types/challenge";

interface PlayModeToggleProps {
  mode: PlayMode;
  onChange: (mode: PlayMode) => void;
}

const DESCRIPTIONS: Record<PlayMode, string> = {
  daily: "Same 5 rounds for everyone today. Resets at midnight EST.",
  unlimited: "5 random rounds per session. Play as many times as you like.",
};

export default function PlayModeToggle({ mode, onChange }: PlayModeToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mode-toggle" role="group" aria-label="Play mode">
        <button
          type="button"
          onClick={() => onChange("daily")}
          className={`mode-toggle-option ${mode === "daily" ? "mode-toggle-active" : ""}`}
          aria-pressed={mode === "daily"}
        >
          Daily
        </button>
        <button
          type="button"
          onClick={() => onChange("unlimited")}
          className={`mode-toggle-option ${mode === "unlimited" ? "mode-toggle-active" : ""}`}
          aria-pressed={mode === "unlimited"}
        >
          Unlimited
        </button>
        <span
          className="mode-toggle-thumb"
          style={{ transform: mode === "daily" ? "translateX(0%)" : "translateX(100%)" }}
          aria-hidden
        />
      </div>
      <p className="min-h-[2.5rem] font-body text-sm text-muted">
        {DESCRIPTIONS[mode]}
      </p>
    </div>
  );
}
