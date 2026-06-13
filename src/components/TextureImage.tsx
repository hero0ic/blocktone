"use client";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function TextureImage({ src, alt, size = 64, className = "" }: Props) {
  const [frameCount, setFrameCount] = useState<number | null>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const frames = Math.round(img.naturalHeight / img.naturalWidth);
    if (frames > 1) setFrameCount(frames);
  };

  // Animated — render as background-image div
  if (frameCount !== null) {
    return (
      <div
        className={`texture-sprite ${className}`}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${src})`,
          animation: `sprite-scroll ${frameCount * 0.05}s steps(${frameCount}) infinite`,
        }}
      />
    );
  }

  // Static — render as normal img, hidden until load check completes
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onLoad={handleLoad}
      className={className}
      style={{ objectFit: "cover", objectPosition: "top", imageRendering: "pixelated" }}
    />
  );
}