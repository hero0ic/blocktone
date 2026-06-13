"use client";

import AnimatedScore from "@/components/AnimatedScore";
import {
  buildDailyShareText,
  accuracyEmoji,
} from "@/lib/game-session";
import {
  formatCountdown,
  getEstDateKey,
  getEstNow,
  getMsUntilEstMidnight,
} from "@/lib/daily-challenge";
import type {
  ChallengeCategory,
  GameSummaryData,
  PlayMode,
} from "@/types/challenge";
import { MAX_GAME_SCORE } from "@/types/challenge";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface GameSummaryProps {
  summary: GameSummaryData;
  playMode: PlayMode;
  category: ChallengeCategory;
  onPlayAgain?: () => void;
}

export default function GameSummary({
  summary,
  playMode,
  category,
  onPlayAgain,
}: GameSummaryProps) {
  const [countdown, setCountdown] = useState("");
  const [copied, setCopied] = useState(false);
  const isDaily = playMode === "daily";

  useEffect(() => {
    if (!isDaily) return;
    const update = () => setCountdown(formatCountdown(getMsUntilEstMidnight()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [isDaily]);

  const handleCopy = useCallback(async () => {
    const text = buildDailyShareText(summary, category);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [summary, category]);

  return (
    <div className="animate-fade-in game-panel mx-auto w-full max-w-2xl px-6 py-10 sm:px-10 sm:py-12">
      <p className="text-center font-minecraft text-xs uppercase tracking-[0.2em] text-muted">
        {isDaily ? "Daily Complete" : "Run Complete"}
      </p>

      <p className="mt-4 text-center font-minecraft text-4xl text-accent sm:text-5xl">
        <AnimatedScore value={summary.totalScore} />
        <span className="text-2xl text-muted sm:text-3xl">
          {" "}
          / {MAX_GAME_SCORE}
        </span>
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="rounded-xl border border-border bg-panel-hover p-4">
          <p className="font-body text-xs text-muted">Average Accuracy</p>
          <p className="mt-1 font-minecraft text-xl text-foreground">
            {summary.averageAccuracy}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-panel-hover p-4">
          <p className="font-body text-xs text-muted">Best Round</p>
          <p className="mt-1 font-minecraft text-xl text-foreground">
            {summary.bestRound}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-panel-hover p-4">
          <p className="font-body text-xs text-muted">Worst Round</p>
          <p className="mt-1 font-minecraft text-xl text-foreground">
            {summary.worstRound}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-panel-hover p-4">
          <p className="font-body text-xs text-muted">Rounds</p>
          <p className="mt-1 font-minecraft text-lg text-foreground">
            {summary.rounds.map((r) => accuracyEmoji(r.result.accuracy)).join(" ")}
          </p>
        </div>
      </div>

      {isDaily && (
        <div className="mt-8 text-center">
          <p className="font-body text-xs text-muted">
            Today&apos;s challenge · {getEstDateKey(getEstNow())}
          </p>
          <p className="mt-2 font-minecraft text-sm text-foreground">
            Next Daily Challenge: {countdown}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {isDaily ? (
          <>
            <button
              type="button"
              onClick={handleCopy}
              className="font-minecraft rounded-2xl border border-border bg-panel px-6 py-3 text-sm uppercase tracking-wider text-foreground transition-colors hover:bg-panel-hover"
            >
              {copied ? "Copied!" : "Copy Results"}
            </button>
            <Link
              href="/"
              className="font-minecraft rounded-2xl border border-border bg-panel px-6 py-3 text-center text-sm uppercase tracking-wider text-foreground transition-colors hover:bg-panel-hover"
            >
              Return Home
            </Link>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onPlayAgain}
              className="font-minecraft rounded-2xl bg-accent px-6 py-3 text-sm uppercase tracking-wider text-accent-fg transition-all hover:brightness-110"
            >
              Play Again
            </button>
            <Link
              href="/"
              className="font-minecraft rounded-2xl border border-border bg-panel px-6 py-3 text-center text-sm uppercase tracking-wider text-foreground transition-colors hover:bg-panel-hover"
            >
              Return Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
