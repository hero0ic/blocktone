export interface HSV {
  /** Hue in degrees (0–360). Meaning depends on context: distortion offset, player adjustment, or effective filter. */
  h: number;
  s: number;
  v: number;
}

export type ChallengeCategory = "block" | "item" | "mob";
export type PlayMode = "daily" | "unlimited";
export type GamePhase = "intro" | "playing" | "summary";

export interface Challenge {
  id: string;
  name: string;
  category: ChallengeCategory;
  texture?: string;
  render?: string;
}

/** Neutral slider position at round start (no player adjustment). */
export const RESTORE_HSV: HSV = { h: 0, s: 100, v: 100 };
export const ROUNDS_PER_GAME = 5;
export const MAX_ROUND_SCORE = 100;
export const MAX_GAME_SCORE = ROUNDS_PER_GAME * MAX_ROUND_SCORE;

export interface ScoreResult {
  score: number;
  accuracy: number;
  distance: number;
}

export interface RoundResult {
  round: number;
  challenge: Challenge;
  result: ScoreResult;
  distortionHsv: HSV;
  playerHsv: HSV;
}

export interface GameSummaryData {
  rounds: RoundResult[];
  totalScore: number;
  averageAccuracy: number;
  bestRound: number;
  worstRound: number;
}
