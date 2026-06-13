import type { Challenge, ChallengeCategory } from "@/types/challenge";
import { ROUNDS_PER_GAME } from "@/types/challenge";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(category: string, dateKey: string): number {
  const str = `${category}:${dateKey}`;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Current instant interpreted in America/New_York. */
export function getEstNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
}

export function getEstDateKey(date: Date = getEstNow()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** First daily challenge day (EST) — this date is Daily #1. */
export const DAILY_LAUNCH_DATE_KEY = "2026-06-13";

function daysBetweenDateKeys(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const fromUtc = Date.UTC(fy, fm - 1, fd);
  const toUtc = Date.UTC(ty, tm - 1, td);
  return Math.floor((toUtc - fromUtc) / (1000 * 60 * 60 * 24));
}

export function getDailyNumber(date: Date = getEstNow()): number {
  const todayKey = getEstDateKey(date);
  const days = daysBetweenDateKeys(DAILY_LAUNCH_DATE_KEY, todayKey);
  return Math.max(1, days + 1);
}

export function getMsUntilEstMidnight(): number {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);

  const h = get("hour") % 24;
  const m = get("minute");
  const s = get("second");

  return ((23 - h) * 3600 + (59 - m) * 60 + (60 - s)) * 1000;
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}h ${m}m ${s}s`;
}

/** Same 5 rounds for all players on a given EST day + category. */
export function getDailyRounds(
  pool: Challenge[],
  category: ChallengeCategory,
  date: Date = getEstNow()
): Challenge[] {
  const filtered = pool.filter((c) => c.category === category);
  if (filtered.length === 0) {
    throw new Error(`No challenges for category: ${category}`);
  }

  const seed = hashSeed(category, getEstDateKey(date));
  const rng = mulberry32(seed);
  const shuffled = [...filtered];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const rounds: Challenge[] = [];
  for (let i = 0; i < ROUNDS_PER_GAME; i++) {
    rounds.push(shuffled[i % shuffled.length]);
  }
  return rounds;
}
