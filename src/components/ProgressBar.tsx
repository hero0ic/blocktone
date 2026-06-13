"use client";

import { ROUNDS_PER_GAME } from "@/types/challenge";

interface ProgressBarProps {
  currentRound: number;
}

export default function ProgressBar({ currentRound }: ProgressBarProps) {
  const progress = (currentRound / ROUNDS_PER_GAME) * 100;

  return (
    <div className="w-full max-w-6xl px-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-minecraft text-xs text-muted sm:text-sm">
          Round {currentRound} / {ROUNDS_PER_GAME}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
