"use client";

import HSVSlider from "@/components/HSVSlider";
import ScoreCard from "@/components/ScoreCard";
import TexturePreview from "@/components/TexturePreview";
import { computeEffectiveHsv } from "@/lib/filter";
import { getSliderBounds, type HsvLimits } from "@/lib/difficulty";
import { computeTargetHsv, scoreAgainstDistortion } from "@/lib/scoring";
import { playScoreResultSound, playSound } from "@/lib/sounds";
import type { Challenge, HSV, RoundResult, ScoreResult } from "@/types/challenge";
import { RESTORE_HSV } from "@/types/challenge";
import { useCallback, useMemo, useState } from "react";

interface ChallengeCardProps {
  challenge: Challenge;
  distortionHsv: HSV;
  limits: HsvLimits;
  roundNumber: number;
  isLastRound: boolean;
  onRoundComplete: (data: RoundResult) => void;
  onContinue: () => void;
}

export default function ChallengeCard({
  challenge,
  distortionHsv,
  limits,
  roundNumber,
  isLastRound,
  onRoundComplete,
  onContinue,
}: ChallengeCardProps) {
  const bounds = useMemo(() => getSliderBounds(limits), [limits]);
  const targetHsv = useMemo(
    () => computeTargetHsv(distortionHsv),
    [distortionHsv]
  );
  const [playerHsv, setPlayerHsv] = useState<HSV>(RESTORE_HSV);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const effectiveHsv = useMemo(
    () => computeEffectiveHsv(distortionHsv, playerHsv),
    [distortionHsv, playerHsv]
  );

  const handleSliderSound = useCallback(() => {
    playSound("slider");
  }, []);

  const handleHueChange = useCallback((h: number) => {
    setPlayerHsv((prev) => ({ ...prev, h }));
  }, []);

  const handleSaturationChange = useCallback((s: number) => {
    setPlayerHsv((prev) => ({ ...prev, s }));
  }, []);

  const handleValueChange = useCallback((v: number) => {
    setPlayerHsv((prev) => ({ ...prev, v }));
  }, []);

  const handleSubmit = () => {
    const scoreResult = scoreAgainstDistortion(playerHsv, distortionHsv, limits);
    setResult(scoreResult);
    setSubmitted(true);
    playScoreResultSound(scoreResult.accuracy);
    onRoundComplete({
      round: roundNumber,
      challenge,
      result: scoreResult,
      distortionHsv: { ...distortionHsv },
      playerHsv: { ...playerHsv },
    });
  };

  const handleContinue = () => {
    playSound("challenge");
    setSubmitted(false);
    setResult(null);
    onContinue();
  };

  if (submitted && result) {
    return (
      <div className="animate-fade-in flex w-full max-w-5xl flex-col items-center gap-8 px-4">
        <ScoreCard
          challenge={challenge}
          result={result}
          distortionHsv={distortionHsv}
          playerHsv={playerHsv}
        />
        <button
          type="button"
          onClick={handleContinue}
          className="font-minecraft w-full max-w-sm rounded-2xl border border-border bg-panel py-4 text-sm uppercase tracking-wider text-foreground transition-all hover:bg-panel-hover active:scale-[0.98]"
        >
          {isLastRound ? "View Summary" : "Next Round"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl px-4">
      <p className="mb-4 text-center font-minecraft text-xl text-foreground sm:mb-6 sm:text-2xl">
        {challenge.name}
      </p>

      <div className="game-panel overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="flex min-h-[min(55vh,480px)] w-full shrink-0 grow-[7] basis-0 p-5 sm:p-8 lg:p-10">
            <TexturePreview
              challenge={challenge}
              hsv={effectiveHsv}
              size="hero"
              className="h-full w-full"
            />
          </div>

          <div className="flex w-full shrink-0 grow-[3] basis-0 flex-col items-center justify-center gap-4 border-t border-border p-5 sm:p-6 lg:min-w-[180px] lg:max-w-[240px] lg:border-l lg:border-t-0 lg:p-6">
            <div className="flex shrink-0 items-end justify-center gap-2 sm:gap-3">
              <HSVSlider
                kind="hue"
                value={playerHsv.h}
                min={bounds.h.min}
                max={bounds.h.max}
                unit="°"
                orientation="vertical"
                restoreValue={targetHsv.h}
                onChange={handleHueChange}
                onInteract={handleSliderSound}
              />
              <HSVSlider
                kind="saturation"
                value={playerHsv.s}
                min={bounds.s.min}
                max={bounds.s.max}
                unit="%"
                orientation="vertical"
                restoreValue={targetHsv.s}
                onChange={handleSaturationChange}
                onInteract={handleSliderSound}
              />
              <HSVSlider
                kind="brightness"
                value={playerHsv.v}
                min={bounds.v.min}
                max={bounds.v.max}
                unit="%"
                orientation="vertical"
                restoreValue={targetHsv.v}
                onChange={handleValueChange}
                onInteract={handleSliderSound}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="font-minecraft w-full shrink-0 rounded-2xl bg-accent py-4 text-sm uppercase tracking-wider text-accent-fg shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
