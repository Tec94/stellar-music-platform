import { describe, it, expect } from 'vitest';
import {
  calculateQuestXp,
  accumulateWeeklyXp,
  getTierFromXp,
  xpNeededForNextTier,
  tiers
} from '../xp';

describe('XP utilities', () => {
  it('calculates quest XP with multipliers and bonuses', () => {
    const xp = calculateQuestXp({
      baseXp: 200,
      completionTimeMinutes: 45,
      optionalObjectivesCompleted: 2,
      streakDays: 14,
      difficulty: 'hard'
    });
    expect(xp).toBeGreaterThan(300);
    expect(xp % 1).toBe(0);
  });

  it('scales weekly XP by quests and difficulty', () => {
    const xp = accumulateWeeklyXp(500, 6, 'legendary');
    expect(xp).toBeGreaterThan(1000);
  });

  it('maps XP to tiers correctly', () => {
    expect(getTierFromXp(0)).toBe('Bronze');
    expect(getTierFromXp(1500)).toBe('Silver');
    expect(getTierFromXp(2600)).toBe('Gold');
    expect(getTierFromXp(5100)).toBe('Platinum');
    expect(getTierFromXp(20000)).toBe('Diamond');
  });

  it('calculates XP needed for next tier', () => {
    const { nextTier, xpRemaining } = xpNeededForNextTier(1200);
    expect(nextTier).toBe('Gold');
    expect(xpRemaining).toBe(1300);
  });

  it('returns null for next tier when at top tier', () => {
    const result = xpNeededForNextTier(12000);
    expect(result.nextTier).toBeNull();
    expect(result.xpRemaining).toBe(0);
  });

  it('ensures tiers array order integrity', () => {
    expect(tiers).toEqual(['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']);
  });
});
