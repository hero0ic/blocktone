import type { HSV } from "@/types/challenge";

export function hsvToCssFilter(hsv: HSV): string {
  return `hue-rotate(${hsv.h}deg) saturate(${hsv.s}%) brightness(${hsv.v}%)`;
}

/**
 * Effective CSS filter applied to the texture.
 * Hue cancels additively; saturation and brightness combine multiplicatively.
 */
export function computeEffectiveHsv(distortion: HSV, player: HSV): HSV {
  return {
    h: ((distortion.h - player.h) % 360 + 360) % 360,
    s: (distortion.s * player.s) / 100,
    v: (distortion.v * player.v) / 100,
  };
}

export function distortionToCssFilter(distortion: HSV, player: HSV): string {
  return hsvToCssFilter(computeEffectiveHsv(distortion, player));
}
