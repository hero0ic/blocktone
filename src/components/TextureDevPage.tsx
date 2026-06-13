"use client";

import HSVSlider from "@/components/HSVSlider";
import TexturePreview from "@/components/TexturePreview";
import { getChallengeImageUrl } from "@/lib/challenge-image";
import {
  DEFAULT_DIFFICULTY,
  getHsvLimits,
  getSliderBounds,
} from "@/lib/difficulty";
import { hsvToCssFilter } from "@/lib/filter";
import challenges from "@/data/challenges.json";
import type { Challenge, HSV } from "@/types/challenge";
import { RESTORE_HSV } from "@/types/challenge";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const challengeList = challenges as Challenge[];
const hsvLimits = getHsvLimits(DEFAULT_DIFFICULTY);
const sliderBounds = getSliderBounds(hsvLimits);

type CategoryFilter = "all" | "block" | "item";

function categoryLabel(category: Challenge["category"]): string {
  return category === "block" ? "Block" : category === "item" ? "Item" : "Mob";
}

function ListThumbnail({
  challenge,
  failed,
  onError,
}: {
  challenge: Challenge;
  failed: boolean;
  onError: () => void;
}) {
  const src = getChallengeImageUrl(challenge);

  return (
    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded border border-border bg-preview">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={32}
        height={32}
        draggable={false}
        onError={onError}
        className="h-full w-full object-contain object-center"
        style={{ imageRendering: "pixelated" }}
      />
      {failed && (
        <span
          className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500"
          aria-label="Failed to load"
        />
      )}
    </div>
  );
}

export default function TextureDevPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selectedId, setSelectedId] = useState(challengeList[0]?.id ?? "");
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [playerHsv, setPlayerHsv] = useState<HSV>(RESTORE_HSV);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return challengeList.filter((c) => {
      if (categoryFilter !== "all" && c.category !== categoryFilter) {
        return false;
      }
      if (q && !c.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [search, categoryFilter]);

  const selected = useMemo(
    () => challengeList.find((c) => c.id === selectedId) ?? null,
    [selectedId]
  );

  useEffect(() => {
    if (filtered.length === 0) return;
    if (!filtered.some((c) => c.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  useEffect(() => {
    setPlayerHsv(RESTORE_HSV);
  }, [selectedId]);

  const markFailed = useCallback((id: string) => {
    setFailedIds((prev) => new Set(prev).add(id));
  }, []);

  const imageUrl = selected ? getChallengeImageUrl(selected) : "";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-body text-sm text-muted transition-colors hover:text-foreground"
          >
            ← Home
          </Link>
          <h1 className="font-minecraft text-lg text-foreground sm:text-xl">
            Texture Dev
          </h1>
        </div>
        <p className="font-body text-xs text-muted">
          {filtered.length} / {challengeList.length}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left — texture browser */}
        <aside className="flex w-full shrink-0 flex-col border-b border-border lg:w-80 lg:border-b-0 lg:border-r xl:w-96">
          <div className="shrink-0 space-y-3 border-b border-border p-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-xl border border-border bg-panel px-3 py-2 font-body text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />

            <div
              className="mode-toggle w-full"
              style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
              role="group"
              aria-label="Category"
            >
              {(
                [
                  { id: "all", label: "All" },
                  { id: "block", label: "Blocks" },
                  { id: "item", label: "Items" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategoryFilter(opt.id)}
                  className={`mode-toggle-option ${
                    categoryFilter === opt.id ? "mode-toggle-active" : ""
                  }`}
                  aria-pressed={categoryFilter === opt.id}
                >
                  {opt.label}
                </button>
              ))}
              <span
                className="mode-toggle-thumb"
                style={{
                  width: "calc(33.333% - 2px)",
                  transform:
                    categoryFilter === "all"
                      ? "translateX(0%)"
                      : categoryFilter === "block"
                        ? "translateX(100%)"
                        : "translateX(200%)",
                }}
                aria-hidden
              />
            </div>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto p-2">
            {filtered.map((challenge) => {
              const isActive = challenge.id === selectedId;
              const failed = failedIds.has(challenge.id);

              return (
                <li key={challenge.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(challenge.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      isActive
                        ? "bg-panel-hover ring-1 ring-accent/40"
                        : "hover:bg-panel-hover"
                    }`}
                  >
                    <ListThumbnail
                      challenge={challenge}
                      failed={failed}
                      onError={() => markFailed(challenge.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm text-foreground">
                        {challenge.name}
                      </p>
                      <p className="font-body text-[10px] uppercase tracking-wider text-muted">
                        {categoryLabel(challenge.category)}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-8 text-center font-body text-sm text-muted">
                No matches
              </li>
            )}
          </ul>
        </aside>

        {/* Right — game round view */}
        <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 sm:p-6 lg:p-8">
          {selected ? (
            <div className="w-full max-w-6xl">
              <p className="mb-4 text-center font-minecraft text-xl text-foreground sm:mb-6 sm:text-2xl">
                {selected.name}
              </p>

              <div className="game-panel overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-stretch">
                  <div className="flex min-h-[min(55vh,480px)] w-full shrink-0 grow-[7] basis-0 flex-col p-5 sm:p-8 lg:p-10">
                    <TexturePreview
                      challenge={selected}
                      hsv={playerHsv}
                      size="hero"
                      className="h-full w-full"
                    />
                    <p className="mt-4 break-all text-center font-mono text-[10px] text-muted sm:text-xs">
                      {imageUrl}
                    </p>
                  </div>

                  <div className="flex w-full shrink-0 grow-[3] basis-0 flex-col items-center justify-center gap-4 border-t border-border p-5 sm:p-6 lg:min-w-[180px] lg:max-w-[240px] lg:border-l lg:border-t-0 lg:p-6">
                    <div className="flex shrink-0 items-end justify-center gap-2 sm:gap-3">
                      <HSVSlider
                        kind="hue"
                        value={playerHsv.h}
                        min={sliderBounds.h.min}
                        max={sliderBounds.h.max}
                        unit="°"
                        orientation="vertical"
                        onChange={(h) =>
                          setPlayerHsv((prev) => ({ ...prev, h }))
                        }
                      />
                      <HSVSlider
                        kind="saturation"
                        value={playerHsv.s}
                        min={sliderBounds.s.min}
                        max={sliderBounds.s.max}
                        unit="%"
                        orientation="vertical"
                        onChange={(s) =>
                          setPlayerHsv((prev) => ({ ...prev, s }))
                        }
                      />
                      <HSVSlider
                        kind="brightness"
                        value={playerHsv.v}
                        min={sliderBounds.v.min}
                        max={sliderBounds.v.max}
                        unit="%"
                        orientation="vertical"
                        onChange={(v) =>
                          setPlayerHsv((prev) => ({ ...prev, v }))
                        }
                      />
                    </div>

                    <div className="w-full space-y-1.5">
                      <p className="text-center font-body text-[10px] uppercase tracking-wider text-muted">
                        Filter preview
                      </p>
                      <div
                        className="h-10 w-full rounded-xl border-2 border-border bg-white shadow-inner"
                        style={{ filter: hsvToCssFilter(playerHsv) }}
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="font-body text-muted">Select a texture</p>
          )}
        </main>
      </div>
    </div>
  );
}
