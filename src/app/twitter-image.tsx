import {
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_SIZE,
  SocialPreviewImage,
} from "@/lib/social-preview-image";
import { ImageResponse } from "next/og";

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<SocialPreviewImage />, {
    width: SOCIAL_IMAGE_SIZE.width,
    height: SOCIAL_IMAGE_SIZE.height,
  });
}
