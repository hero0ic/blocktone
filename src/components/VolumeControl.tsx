"use client";

import { useVolume } from "@/components/VolumeProvider";
import { useState } from "react";

export default function VolumeControl() {
  const { volume, setVolumeLevel } = useVolume();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="utility-btn"
        aria-label="Volume"
        aria-expanded={open}
      >
        {volume === 0 ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-36 rounded-xl border border-border bg-panel p-3 shadow-xl">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => setVolumeLevel(Number(e.target.value) / 100)}
            className="slider-input h-2 w-full cursor-pointer appearance-none rounded-full"
            aria-label="Volume level"
          />
        </div>
      )}
    </div>
  );
}
