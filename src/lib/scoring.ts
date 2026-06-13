import { computeEffectiveHsv } from "@/lib/filter";
import type { HsvLimits } from "@/lib/difficulty";
import type { HSV, ScoreResult } from "@/types/challenge";

/** Degrees of effective hue error that reach maximum penalty (quadratic curve). */
const HUE_PERCEPTUAL_SCALE = 60;

const SAT_VAL_WEIGHT = 0.4;

function circularHueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

function maxLogFactorDeviation(range: number): number {
  const minFactor = ((100 - range) / 100) ** 2;
  const maxFactor = ((100 + range) / 100) ** 2;
  return Math.max(Math.log(maxFactor), -Math.log(minFactor));
}

/** Quadratic penalty — small hue errors are forgiving, large ones dominate. */
export function huePerceptualPenalty(hueDegrees: number): number {
  const error = circularHueDistance(hueDegrees, 0);
  return Math.min(1, (error / HUE_PERCEPTUAL_SCALE) ** 2);
}

/** Log-space distance from identity (factor 1.0) for multiplicative channels. */
export function multiplicativeFactorPenalty(
  factor: number,
  range: number
): number {
  const scale = maxLogFactorDeviation(range);
  if (scale <= 0) return factor === 1 ? 0 : 1;
  return Math.min(1, Math.abs(Math.log(factor)) / scale);
}

/**
 * Perceptual distance from a fully restored image.
 * Scores the rendered effective filter, not raw slider deltas.
 */
export function effectiveFilterDistance(
  distortion: HSV,
  player: HSV,
  limits: HsvLimits
): number {
  const effective = computeEffectiveHsv(distortion, player);

  const huePenalty = huePerceptualPenalty(effective.h);
  const satPenalty = multiplicativeFactorPenalty(
    effective.s / 100,
    limits.satRange
  );
  const valPenalty = multiplicativeFactorPenalty(
    effective.v / 100,
    limits.valRange
  );

  return Math.min(
    1,
    Math.max(huePenalty, satPenalty * SAT_VAL_WEIGHT, valPenalty * SAT_VAL_WEIGHT)
  );
}

export function calculateScoreFromDistance(distance: number): ScoreResult {
  const accuracy = Math.max(0, (1 - distance) * 100);
  const score = Math.round(accuracy * 10) / 10;

  return {
    score,
    accuracy: Math.round(accuracy * 10) / 10,
    distance: Math.round(distance * 1000) / 1000,
  };
}

/** Slider values that cancel the round's fixed distortion (multiplicative S/V). */
export function computeTargetHsv(distortion: HSV): HSV {
  return {
    h: distortion.h,
    s: 10000 / distortion.s,
    v: 10000 / distortion.v,
  };
}

export function scoreAgainstDistortion(
  player: HSV,
  distortion: HSV,
  limits: HsvLimits
): ScoreResult {
  const distance = effectiveFilterDistance(distortion, player, limits);
  return calculateScoreFromDistance(distance);
}
