export const SITE_NAME = "BlockTone";

export const SITE_TITLE = "BlockTone — Minecraft Color Guessing Game";

export const SITE_DESCRIPTION =
  "A daily browser game. Restore distorted Minecraft textures using Hue, Saturation, and Brightness.";

/** Public site URL — required for absolute Open Graph image URLs in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://blocktone.app";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
