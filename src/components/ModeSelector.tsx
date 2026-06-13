"use client";

import { MODE_INFO } from "@/lib/modes";
import type { ChallengeCategory } from "@/types/challenge";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MODES: { id: ChallengeCategory; href: string; comingSoon?: boolean }[] = [
  { id: "block", href: "/blocks" },
  { id: "item", href: "/items" },
  { id: "mob", href: "#", comingSoon: true },
];

export default function ModeSelector() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-5" aria-label="Game modes">
      {MODES.map((mode) => {
        const info = MODE_INFO[mode.id];
        const isActive =
          pathname === mode.href ||
          (mode.id === "block" && pathname.startsWith("/blocks")) ||
          (mode.id === "item" && pathname.startsWith("/items"));

        if (mode.comingSoon) {
          return (
            <div key={mode.id} className="relative">
              <span
                className="cursor-not-allowed font-body text-sm text-muted sm:text-base"
                title="Mobs mode coming soon"
              >
                {info.label}
              </span>
              <span className="soon-splash" aria-hidden>
                Soon!
              </span>
            </div>
          );
        }

        return (
          <Link
            key={mode.id}
            href={mode.href}
            className={`font-body text-sm transition-colors sm:text-base ${
              isActive
                ? "text-foreground underline decoration-foreground decoration-2 underline-offset-[6px]"
                : "text-muted hover:text-foreground/80"
            }`}
          >
            {info.label}
          </Link>
        );
      })}
    </nav>
  );
}
