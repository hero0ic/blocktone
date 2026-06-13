export type ScoreTier =
  | "perfect"
  | "excellent"
  | "great"
  | "good"
  | "close"
  | "keepTrying";

export function getScoreTier(accuracy: number): ScoreTier {
  if (accuracy >= 95) return "perfect";
  if (accuracy >= 90) return "excellent";
  if (accuracy >= 85) return "great";
  if (accuracy >= 70) return "good";
  if (accuracy >= 50) return "close";
  return "keepTrying";
}

const TIER_LABELS: Record<ScoreTier, string> = {
  perfect: "Perfect!",
  excellent: "Excellent",
  great: "Great",
  good: "Good",
  close: "Close",
  keepTrying: "Keep Trying",
};

/** Hex / CSS color per tier — applied inline so labels always render correctly. */
const TIER_COLORS: Record<ScoreTier, string> = {
  perfect: "var(--accent)",
  excellent: "var(--accent)",
  great: "var(--accent)",
  good: "#facc15",
  close: "#fb923c",
  keepTrying: "#f87171",
};

export function getAccuracyLabelStyle(accuracy: number): {
  label: string;
  color: string;
} {
  const tier = getScoreTier(accuracy);
  return { label: TIER_LABELS[tier], color: TIER_COLORS[tier] };
}

/** Share / results grid emoji — green ≥85%, yellow 50–84%, red <50%. */
export function accuracyShareEmoji(accuracy: number): string {
  const tier = getScoreTier(accuracy);
  if (tier === "perfect" || tier === "excellent" || tier === "great") {
    return "🟩";
  }
  if (tier === "good" || tier === "close") {
    return "🟨";
  }
  return "🟥";
}
