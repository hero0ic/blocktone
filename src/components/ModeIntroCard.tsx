"use client";

import PlayModeToggle from "@/components/PlayModeToggle";
import TypewriterText from "@/components/TypewriterText";
import { MODE_INFO } from "@/lib/modes";
import { playSound } from "@/lib/sounds";
import type { ChallengeCategory, PlayMode } from "@/types/challenge";

interface ModeIntroCardProps {
  category: ChallengeCategory;
  playMode: PlayMode;
  dailyLocked?: boolean;
  dailyCompleted?: boolean;
  onPlayModeChange: (mode: PlayMode) => void;
  onPlay: () => void;
  onViewResults?: () => void;
}

export default function ModeIntroCard({
  category,
  playMode,
  dailyLocked = false,
  dailyCompleted = false,
  onPlayModeChange,
  onPlay,
  onViewResults,
}: ModeIntroCardProps) {
  const info = MODE_INFO[category];
  const dailyPlayDisabled = playMode === "daily" && dailyLocked;

  return (
    <div className="animate-fade-in game-panel mx-auto w-full max-w-2xl px-8 py-12 sm:px-14 sm:py-16">
      <TypewriterText
        text={info.title}
        as="h1"
        className="font-minecraft text-4xl text-foreground sm:text-5xl"
        speed={55}
      />

      <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-muted sm:text-lg">
        {info.description}
      </p>

      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <PlayModeToggle mode={playMode} onChange={onPlayModeChange} />
          {dailyPlayDisabled && (
            <div className="flex flex-col gap-2">
              <p className="font-body text-sm text-muted">
                You&apos;ve already attempted today&apos;s daily. Come back
                after midnight EST, or switch to Unlimited.
              </p>
              {dailyCompleted && onViewResults && (
                <button
                  type="button"
                  onClick={onViewResults}
                  className="w-fit font-body text-sm text-foreground underline underline-offset-2 transition-colors hover:text-accent"
                >
                  View today&apos;s results
                </button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={dailyPlayDisabled}
          onClick={() => {
            if (dailyPlayDisabled) return;
            playSound("play");
            onPlay();
          }}
          className="group flex h-16 w-16 shrink-0 items-center justify-center self-end rounded-full border-2 border-border bg-panel transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40 sm:self-auto"
          aria-label="Play"
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5 text-background"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
