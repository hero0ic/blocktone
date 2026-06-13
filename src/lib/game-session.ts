import {
  getDailyNumber,
} from "@/lib/daily-challenge";
import { accuracyShareEmoji } from "@/lib/score-label";
import type {
  Challenge,
  ChallengeCategory,
  GameSummaryData,
  RoundResult,
} from "@/types/challenge";
import { MAX_GAME_SCORE, ROUNDS_PER_GAME } from "@/types/challenge";

const SHARE_SITE = "blocktone.app";

function dailyCategoryLabel(category: ChallengeCategory): string {
  if (category === "block") return "blocks";
  if (category === "item") return "items";
  return category;
}

export function getUnlimitedRounds(
  pool: Challenge[],
  category: ChallengeCategory
): Challenge[] {
  const filtered = pool.filter((c) => c.category === category);
  if (filtered.length === 0) {
    throw new Error(`No challenges for category: ${category}`);
  }

  const rounds: Challenge[] = [];
  const used = new Set<string>();

  while (rounds.length < ROUNDS_PER_GAME) {
    let available = filtered.filter((c) => !used.has(c.id));
    if (available.length === 0) {
      used.clear();
      available = filtered;
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    rounds.push(pick);
    used.add(pick.id);
  }

  return rounds;
}

export function buildGameSummary(rounds: RoundResult[]): GameSummaryData {
  const accuracies = rounds.map((r) => r.result.accuracy);
  const totalScore = Math.round(
    rounds.reduce((sum, r) => sum + r.result.score, 0)
  );
  const averageAccuracy =
    Math.round(
      (accuracies.reduce((a, b) => a + b, 0) / accuracies.length) * 10
    ) / 10;
  const bestRound = Math.round(Math.max(...accuracies));
  const worstRound = Math.round(Math.min(...accuracies));

  return {
    rounds,
    totalScore: Math.min(totalScore, MAX_GAME_SCORE),
    averageAccuracy,
    bestRound,
    worstRound,
  };
}

export function accuracyEmoji(accuracy: number): string {
  return accuracyShareEmoji(accuracy);
}

export function buildDailyShareText(
  summary: GameSummaryData,
  category: ChallengeCategory
): string {
  const dailyNum = getDailyNumber();
  const emojis = summary.rounds
    .map((r) => accuracyShareEmoji(r.result.accuracy))
    .join("");
  const categoryLabel = dailyCategoryLabel(category);

  return [
    emojis,
    `BlockTone Daily #${dailyNum} (${categoryLabel})`,
    `${summary.averageAccuracy}% (${summary.totalScore}/${MAX_GAME_SCORE})`,
    SHARE_SITE,
  ].join("\n");
}
