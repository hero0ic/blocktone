export type Difficulty = "easy" | "medium" | "hard";

/** Max deviation from restore values (h: 0°, s: 100%, v: 100%). */
export interface HsvLimits {
  hueRange: number;
  satRange: number;
  valRange: number;
}

export const DIFFICULTY_LIMITS: Record<Difficulty, HsvLimits> = {
  easy: { hueRange: 30, satRange: 15, valRange: 15 },
  medium: { hueRange: 60, satRange: 25, valRange: 25 },
  hard: { hueRange: 90, satRange: 40, valRange: 40 },
};

export const DEFAULT_DIFFICULTY: Difficulty = "medium";

export function getHsvLimits(
  difficulty: Difficulty = DEFAULT_DIFFICULTY
): HsvLimits {
  return DIFFICULTY_LIMITS[difficulty];
}

export interface SliderBounds {
  h: { min: number; max: number };
  s: { min: number; max: number };
  v: { min: number; max: number };
}

export function getSliderBounds(limits: HsvLimits): SliderBounds {
  const minS = 100 - limits.satRange;
  const minV = 100 - limits.valRange;

  // Multiplicative cancellation needs higher slider ceilings (e.g. 75% distortion → 133%).
  const maxS = Math.max(
    100 + limits.satRange,
    Math.ceil(10000 / minS)
  );
  const maxV = Math.max(
    100 + limits.valRange,
    Math.ceil(10000 / minV)
  );

  return {
    h: { min: 0, max: 360 },
    s: { min: minS, max: maxS },
    v: { min: minV, max: maxV },
  };
}
