import { getTierFromXp, xpNeededForNextTier } from './xp';

export interface TierStatus {
  currentTier: string;
  nextTier: string | null;
  xpRemaining: number;
  eligible: boolean;
}

export function getTierStatus(xp: number, completedQuests: number, consecutiveDays: number): TierStatus {
  const currentTier = getTierFromXp(xp);
  const { nextTier, xpRemaining } = xpNeededForNextTier(xp);
  const eligible = Boolean(nextTier) && completedQuests >= 5 && consecutiveDays >= 7 && xpRemaining === 0;
  return {
    currentTier,
    nextTier,
    xpRemaining,
    eligible
  };
}

export function canUpgradeTier({ xp, questsCompleted, consecutiveLoginDays }: { xp: number; questsCompleted: number; consecutiveLoginDays: number }): boolean {
  const { nextTier, xpRemaining } = xpNeededForNextTier(xp);
  if (!nextTier) return false;
  return xpRemaining <= 0 || (questsCompleted >= 10 && consecutiveLoginDays >= 14);
}

export function recommendActionsForTierUpgrade(xp: number, questsCompleted: number): string[] {
  const { nextTier, xpRemaining } = xpNeededForNextTier(xp);
  if (!nextTier) {
    return ['Maintain current pace to retain Diamond tier'];
  }
  const actions = [`Earn ${xpRemaining} more XP for ${nextTier}`];
  if (questsCompleted < 10) {
    actions.push('Complete additional quests to unlock milestone bonuses');
  }
  actions.push('Engage with community challenges for bonus XP');
  return actions;
}
