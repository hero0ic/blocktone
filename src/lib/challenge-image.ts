import type { Challenge } from "@/types/challenge";

const MOB_RENDER_BASE = "/images/mobs";

/**
 * Resolves the display image for a challenge.
 * Blocks/items use texture URLs; mobs use PNG renders from public/images/mobs/.
 */
export function getChallengeImageUrl(challenge: Challenge): string {
  if (challenge.category === "mob") {
    return challenge.render ?? `${MOB_RENDER_BASE}/${challenge.id}.png`;
  }
  return challenge.texture ?? `${MOB_RENDER_BASE}/${challenge.id}.png`;
}

export function isMobRender(challenge: Challenge): boolean {
  return challenge.category === "mob";
}
