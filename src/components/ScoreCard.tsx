"use client";

import TexturePreview from "@/components/TexturePreview";
import { computeEffectiveHsv } from "@/lib/filter";
import { getAccuracyLabelStyle } from "@/lib/score-label";
import type { Challenge, HSV, ScoreResult } from "@/types/challenge";
import { useMemo } from "react";

interface ScoreCardProps {
  challenge: Challenge;
  result: ScoreResult;
  distortionHsv: HSV;
  playerHsv: HSV;
}

export default function ScoreCard({
  challenge,
  result,
  distortionHsv,
  playerHsv,
}: ScoreCardProps) {
  const { label, color } = getAccuracyLabelStyle(result.accuracy);
  const effectiveHsv = useMemo(
    () => computeEffectiveHsv(distortionHsv, playerHsv),
    [distortionHsv, playerHsv]
  );

  return (
    <div className="game-panel w-full space-y-6 p-6 sm:p-8">
      <div className="text-center">
        <p className="font-minecraft text-xs uppercase tracking-[0.2em] text-muted">
          Results
        </p>
        <p
          className="mt-2 font-minecraft text-2xl sm:text-3xl"
          style={{ color }}
        >
          {label}
        </p>
        <p className="mt-1 font-minecraft text-lg text-foreground">
          {result.score.toFixed(1)}{" "}
          <span className="font-body text-sm text-muted">
            · {result.accuracy}% accuracy
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <TexturePreview
          challenge={challenge}
          hsv={effectiveHsv}
          label="Your Result"
          size="result"
        />
        <TexturePreview
          challenge={challenge}
          hsv={null}
          label="Original"
          size="result"
        />
      </div>
    </div>
  );
}
