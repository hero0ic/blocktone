"use client";

import ChallengeCard from "@/components/ChallengeCard";
import GameSummary from "@/components/GameSummary";
import ModeIntroCard from "@/components/ModeIntroCard";
import ProgressBar from "@/components/ProgressBar";
import { randomDistortionHsv } from "@/lib/color";
import {
  getDailySummary,
  isDailyAttemptUsed,
  markDailyCompleted,
  markDailyStarted,
} from "@/lib/daily-completion";
import { getDailyRounds } from "@/lib/daily-challenge";
import { DEFAULT_DIFFICULTY, getHsvLimits } from "@/lib/difficulty";
import { buildGameSummary, getUnlimitedRounds } from "@/lib/game-session";
import challenges from "@/data/challenges.json";
import type {
  Challenge,
  ChallengeCategory,
  GamePhase,
  GameSummaryData,
  PlayMode,
  RoundResult,
} from "@/types/challenge";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const challengeList = challenges as Challenge[];
const hsvLimits = getHsvLimits(DEFAULT_DIFFICULTY);

interface GameSessionProps {
  category: ChallengeCategory;
}

export default function GameSession({ category }: GameSessionProps) {
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "unlimited" ? "unlimited" : "daily";
  const autoPlay = searchParams.get("play") === "1";

  const [phase, setPhase] = useState<GamePhase>("intro");
  const [playMode, setPlayMode] = useState<PlayMode>(initialMode);
  const [sessionRounds, setSessionRounds] = useState<Challenge[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [roundKey, setRoundKey] = useState(0);
  const [summaryData, setSummaryData] = useState<GameSummaryData | null>(null);
  const [dailyLocked, setDailyLocked] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const challenge = sessionRounds[roundIndex];

  const distortionHsv = useMemo(() => {
    if (!challenge) return { h: 0, s: 100, v: 100 };
    return randomDistortionHsv(hsvLimits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.id, roundKey]);

  useEffect(() => {
    const saved = getDailySummary(category);
    if (saved) {
      setSummaryData(saved);
      setDailyLocked(true);
      setDailyCompleted(true);
      setPlayMode("unlimited");
    } else {
      setDailyLocked(isDailyAttemptUsed(category));
      setDailyCompleted(false);
    }
    setHydrated(true);
  }, [category]);

  const handlePlay = useCallback(() => {
    if (playMode === "daily" && isDailyAttemptUsed(category)) return;

    const rounds =
      playMode === "daily"
        ? getDailyRounds(challengeList, category)
        : getUnlimitedRounds(challengeList, category);

    if (playMode === "daily") {
      markDailyStarted(category);
      setDailyLocked(true);
    }

    setSessionRounds(rounds);
    setRoundIndex(0);
    setRoundResults([]);
    setRoundKey((k) => k + 1);
    setSummaryData(null);
    setPhase("playing");
  }, [playMode, category]);

  const handleRoundComplete = useCallback((data: RoundResult) => {
    setRoundResults((prev) => [...prev, data]);
  }, []);

  const handleContinue = useCallback(() => {
    if (roundIndex >= sessionRounds.length - 1) {
      const summary = buildGameSummary(roundResults);
      if (playMode === "daily") {
        markDailyCompleted(category, summary);
        setDailyLocked(true);
        setDailyCompleted(true);
      }
      setSummaryData(summary);
      setPhase("summary");
      return;
    }
    setRoundIndex((i) => i + 1);
    setRoundKey((k) => k + 1);
  }, [roundIndex, sessionRounds.length, roundResults, playMode, category]);

  const handleViewDailyResults = useCallback(() => {
    const saved = getDailySummary(category);
    if (!saved) return;
    setSummaryData(saved);
    setPlayMode("daily");
    setPhase("summary");
  }, [category]);

  const handlePlayAgain = useCallback(() => {
    const rounds = getUnlimitedRounds(challengeList, category);
    setSessionRounds(rounds);
    setRoundIndex(0);
    setRoundResults([]);
    setRoundKey((k) => k + 1);
    setSummaryData(null);
    setPlayMode("unlimited");
    setPhase("playing");
  }, [category]);

  const autoPlayed = useRef(false);
  useEffect(() => {
    if (!hydrated || autoPlayed.current) return;
    if (autoPlay && phase === "intro") {
      autoPlayed.current = true;
      const rounds = getUnlimitedRounds(challengeList, category);
      setSessionRounds(rounds);
      setRoundIndex(0);
      setRoundResults([]);
      setRoundKey((k) => k + 1);
      setSummaryData(null);
      setPlayMode("unlimited");
      setPhase("playing");
    }
  }, [autoPlay, phase, category, hydrated]);

  if (!hydrated) return null;

  if (phase === "intro") {
    return (
      <ModeIntroCard
        category={category}
        playMode={playMode}
        dailyLocked={dailyLocked}
        dailyCompleted={dailyCompleted}
        onPlayModeChange={setPlayMode}
        onPlay={handlePlay}
        onViewResults={handleViewDailyResults}
      />
    );
  }

  if (phase === "summary" && summaryData) {
    return (
      <GameSummary
        summary={summaryData}
        playMode={playMode}
        category={category}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!challenge) return null;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ProgressBar currentRound={roundIndex + 1} />
      <ChallengeCard
        key={`${challenge.id}-${roundKey}`}
        challenge={challenge}
        distortionHsv={distortionHsv}
        limits={hsvLimits}
        roundNumber={roundIndex + 1}
        isLastRound={roundIndex === sessionRounds.length - 1}
        onRoundComplete={handleRoundComplete}
        onContinue={handleContinue}
      />
    </div>
  );
}
