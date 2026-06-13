import { getEstDateKey, getEstNow } from "@/lib/daily-challenge";
import type { ChallengeCategory, GameSummaryData } from "@/types/challenge";

const STORAGE_PREFIX = "blocktone-daily";

interface DailyCompletionRecord {
  dateKey: string;
  status: "in_progress" | "completed";
  summary?: GameSummaryData;
}

function storageKey(category: ChallengeCategory): string {
  return `${STORAGE_PREFIX}-${category}`;
}

function readRecord(category: ChallengeCategory): DailyCompletionRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(storageKey(category));
    if (!raw) return null;
    const record = JSON.parse(raw) as DailyCompletionRecord;
    if (record.dateKey !== getEstDateKey(getEstNow())) return null;
    return record;
  } catch {
    return null;
  }
}

function writeRecord(
  category: ChallengeCategory,
  record: DailyCompletionRecord
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(category), JSON.stringify(record));
}

export function isDailyAttemptUsed(category: ChallengeCategory): boolean {
  const record = readRecord(category);
  return record?.status === "in_progress" || record?.status === "completed";
}

export function isDailyCompleted(category: ChallengeCategory): boolean {
  return readRecord(category)?.status === "completed";
}

export function getDailySummary(
  category: ChallengeCategory
): GameSummaryData | null {
  const record = readRecord(category);
  if (record?.status === "completed" && record.summary) {
    return record.summary;
  }
  return null;
}

/** Call when the player starts today's daily — blocks refresh retries. */
export function markDailyStarted(category: ChallengeCategory): void {
  writeRecord(category, {
    dateKey: getEstDateKey(getEstNow()),
    status: "in_progress",
  });
}

/** Call when the player finishes all daily rounds. */
export function markDailyCompleted(
  category: ChallengeCategory,
  summary: GameSummaryData
): void {
  writeRecord(category, {
    dateKey: getEstDateKey(getEstNow()),
    status: "completed",
    summary,
  });
}
