"use client";

import TypewriterText from "@/components/TypewriterText";
import { playSound } from "@/lib/sounds";
import Link from "next/link";

const DESCRIPTION =
  "Restore Minecraft textures to their original colors using Hue, Saturation, and Brightness adjustments. Test your memory and Minecraft knowledge across blocks and items.";

export default function HomeCard() {
  return (
    <div className="animate-fade-in game-panel mx-auto w-full max-w-2xl px-8 py-12 sm:px-14 sm:py-16">
      <TypewriterText
        text="BlockTone"
        as="h1"
        className="font-minecraft text-4xl text-foreground sm:text-5xl"
        speed={65}
      />

      <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-muted sm:text-lg">
        {DESCRIPTION}
      </p>

      <div className="mt-10 flex justify-end">
        <Link
          href="/blocks"
          onClick={() => playSound("play")}
          className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-panel transition-transform hover:scale-105 active:scale-95"
          aria-label="Play Blocks mode"
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5 text-background"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
