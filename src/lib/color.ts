import type { HsvLimits } from "@/lib/difficulty";
import type { HSV } from "@/types/challenge";
import { RESTORE_HSV } from "@/types/challenge";
import { effectiveFilterDistance } from "@/lib/scoring";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN_HUE_OFFSET = 8;
const MIN_SAT_OFFSET = 5;
const MIN_VAL_OFFSET = 5;

function offsetToHue(offset: number): number {
  return ((offset % 360) + 360) % 360;
}

/**
 * Random per-round distortion. At neutral sliders the image shows this HSV;
 * players adjust sliders to cancel it and restore the original look.
 */
export function randomDistortionHsv(
  limits: HsvLimits,
  minDistance = 0.22
): HSV {
  for (let attempt = 0; attempt < 50; attempt++) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    const minHue = Math.min(MIN_HUE_OFFSET, limits.hueRange);
    const h =
      limits.hueRange === 0
        ? 0
        : offsetToHue(sign * randInt(minHue, limits.hueRange));

    const s = pickAwayFrom(
      100 - limits.satRange,
      100 + limits.satRange,
      RESTORE_HSV.s,
      MIN_SAT_OFFSET
    );
    const v = pickAwayFrom(
      100 - limits.valRange,
      100 + limits.valRange,
      RESTORE_HSV.v,
      MIN_VAL_OFFSET
    );

    const candidate: HSV = { h, s, v };
    if (
      effectiveFilterDistance(candidate, RESTORE_HSV, limits) >= minDistance
    ) {
      return candidate;
    }
  }

  return {
    h: offsetToHue(
      limits.hueRange * (Math.random() < 0.5 ? -1 : 1)
    ),
    s: 100 + (Math.random() < 0.5 ? -1 : 1) * limits.satRange,
    v: 100 + (Math.random() < 0.5 ? -1 : 1) * limits.valRange,
  };
}

function pickAwayFrom(
  min: number,
  max: number,
  target: number,
  minOffset: number
): number {
  let value = randInt(min, max);
  let tries = 0;
  while (Math.abs(value - target) < minOffset && tries < 20) {
    value = randInt(min, max);
    tries++;
  }
  return value;
}
