export interface QuestPerformance {
  baseXp: number;
  completionTimeMinutes: number;
  optionalObjectivesCompleted: number;
  streakDays: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
}

const difficultyMultipliers: Record<QuestPerformance['difficulty'], number> = {
  easy: 1,
  medium: 1.25,
  hard: 1.5,
  legendary: 2
};

const streakBonus = [0, 0.05, 0.1, 0.15, 0.2];

export function calculateQuestXp(performance: QuestPerformance): number {
  const multiplier = difficultyMultipliers[performance.difficulty];
  const optionalBonus = performance.optionalObjectivesCompleted * 25;
  const speedBonus = Math.max(0, 60 - performance.completionTimeMinutes) * 0.5;
  const streakIndex = Math.min(streakBonus.length - 1, Math.floor(performance.streakDays / 7));
  const streakMultiplier = 1 + streakBonus[streakIndex];

  const rawXp = (performance.baseXp + optionalBonus + speedBonus) * multiplier;
  return Math.round(rawXp * streakMultiplier);
}

export function accumulateWeeklyXp(base: number, questsCompleted: number, difficulty: QuestPerformance['difficulty']): number {
  const baseMultiplier = difficultyMultipliers[difficulty];
  const scaling = 1 + questsCompleted * 0.05;
  return Math.round(base * scaling * baseMultiplier);
}

export const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const;

export function getTierFromXp(totalXp: number): typeof tiers[number] {
  if (totalXp >= 10000) return 'Diamond';
  if (totalXp >= 5000) return 'Platinum';
  if (totalXp >= 2500) return 'Gold';
  if (totalXp >= 1000) return 'Silver';
  return 'Bronze';
}

export function xpNeededForNextTier(totalXp: number): { nextTier: typeof tiers[number] | null; xpRemaining: number } {
  const thresholds = [0, 1000, 2500, 5000, 10000];
  for (let i = thresholds.length - 1; i >= 0; i -= 1) {
    if (totalXp >= thresholds[i]) {
      const nextThreshold = thresholds[i + 1];
      if (!nextThreshold) {
        return { nextTier: null, xpRemaining: 0 };
      }
      return { nextTier: tiers[i + 1], xpRemaining: nextThreshold - totalXp };
    }
  }
  return { nextTier: 'Bronze', xpRemaining: 1000 - totalXp };
}
