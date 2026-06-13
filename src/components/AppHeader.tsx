"use client";

import HelpModal from "@/components/HelpModal";
import ModeSelector from "@/components/ModeSelector";
import VolumeControl from "@/components/VolumeControl";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { useState } from "react";

interface AppHeaderProps {
  showNav?: boolean;
}

export default function AppHeader({ showNav = true }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <header className="flex w-full items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
          <Link
            href="/"
            className="font-minecraft shrink-0 text-lg text-foreground transition-opacity hover:opacity-80 sm:text-xl"
          >
            BlockTone
          </Link>
          {showNav && <ModeSelector />}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="utility-btn font-minecraft text-base"
            aria-label="Help"
          >
            ?
          </button>
          <VolumeControl />
          <button
            type="button"
            onClick={toggleTheme}
            className="utility-btn"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
