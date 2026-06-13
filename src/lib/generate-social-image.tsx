import {
  SOCIAL_IMAGE_SIZE,
  SocialPreviewImage,
} from "@/lib/social-preview-image";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

let cachedFont: ArrayBuffer | null = null;

async function loadMinecraftFont(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;

  const filePath = join(
    process.cwd(),
    "node_modules/typeface-minecraft/files/minecraft.ttf"
  );
  const buffer = await readFile(filePath);
  cachedFont = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  return cachedFont;
}

export async function generateSocialImage() {
  const font = await loadMinecraftFont();

  return new ImageResponse(<SocialPreviewImage />, {
    width: SOCIAL_IMAGE_SIZE.width,
    height: SOCIAL_IMAGE_SIZE.height,
    fonts: [
      {
        name: "Minecraft",
        data: font,
        style: "normal",
        weight: 400,
      },
    ],
  });
}
