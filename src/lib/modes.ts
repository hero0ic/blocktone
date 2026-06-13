import type { ChallengeCategory } from "@/types/challenge";

export interface ModeInfo {
  id: ChallengeCategory;
  label: string;
  title: string;
  description: string;
}

export const MODE_INFO: Record<ChallengeCategory, ModeInfo> = {
  block: {
    id: "block",
    label: "blocks",
    title: "blocks",
    description:
      "Restore the true colors of iconic Minecraft blocks. Each round starts with a distorted block texture — adjust hue, saturation, and value until it looks just right.",
  },
  item: {
    id: "item",
    label: "items",
    title: "items",
    description:
      "Fine-tune your eye on Minecraft items and tools. Distorted item textures appear with shifted colors — slide your way back to the original look.",
  },
  mob: {
    id: "mob",
    label: "mobs",
    title: "mobs",
    description:
      "Bring Minecraft mobs back to life. Distorted mob renders need your help — restore their natural colors using the HSV controls.",
  },
};
