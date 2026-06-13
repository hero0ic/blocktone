"use client";

import { getChallengeImageUrl, isMobRender } from "@/lib/challenge-image";
import { hsvToCssFilter } from "@/lib/filter";
import type { Challenge, HSV } from "@/types/challenge";
import { useState } from "react";

interface TexturePreviewProps {
  challenge: Challenge;
  hsv?: HSV | null;
  label?: string;
  size?: "hero" | "result";
  className?: string;
}

export default function TexturePreview({
  challenge,
  hsv,
  label,
  size = "hero",
  className = "",
}: TexturePreviewProps) {
  const [imgError, setImgError] = useState(false);
  const [frameCount, setFrameCount] = useState<number | null>(null);
  
  const filter = hsv ? hsvToCssFilter(hsv) : undefined;
  const src = getChallengeImageUrl(challenge);
  const pixelated = !isMobRender(challenge);
  const isHero = size === "hero";

  // Calculates frames based on image dimensions
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const frames = Math.round(img.naturalHeight / img.naturalWidth);
    if (frames > 1) {
      setFrameCount(frames);
    }
  };

// Shared styles across both image modes
const imageStyles: React.CSSProperties = {
  filter,
  imageRendering: pixelated ? "pixelated" : "auto",
};

const imageClasses = isHero
  ? "absolute inset-0 h-full w-auto aspect-square mx-auto object-contain object-center"
  : "h-full w-full aspect-square object-contain object-center";

  return (
    <div
      className={`flex flex-col ${
        isHero ? "h-full w-full shrink-0" : "min-w-0 items-center gap-2"
      } ${className}`}
    >
      <div
        className={
          isHero
            ? "relative h-full w-full shrink-0 overflow-hidden rounded-3xl border-2 border-border bg-preview shadow-2xl transition-[filter] duration-75"
            : "aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl border-2 border-border bg-preview sm:max-w-[200px]"
        }
      >
        {imgError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="font-minecraft text-xs text-muted">
              {challenge.name}
            </span>
            <span className="font-body text-[10px] text-muted/60">
              Add {challenge.render ?? `/images/mobs/${challenge.id}.png`}
            </span>
          </div>
        ) : frameCount !== null ? (
          /* Animated State — Rendered as a CSS background sprite */
          <div
            className={`texture-sprite ${imageClasses}`}
            style={{
              ...imageStyles,
              backgroundImage: `url(${src})`,
              // 0.15s per frame is roughly equivalent to Minecraft's tick speed for animations
              animation: `sprite-scroll ${frameCount * 0.05}s steps(${frameCount - 1}) infinite`,
            }}
          />
        ) : (
          /* Static/Unloaded State — Standard img tags */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={challenge.name}
            draggable={false}
            onLoad={handleLoad}
            onError={() => setImgError(true)}
            className={imageClasses}
            style={imageStyles}
          />
        )}
      </div>
      {label && (
        <p className="mt-2 shrink-0 text-center font-minecraft text-[10px] uppercase tracking-wider text-muted sm:text-xs">
          {label}
        </p>
      )}
    </div>
  );
}