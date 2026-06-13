import { generateSocialImage } from "@/lib/generate-social-image";
import { SOCIAL_IMAGE_ALT, SOCIAL_IMAGE_SIZE } from "@/lib/social-preview-image";

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return generateSocialImage();
}
