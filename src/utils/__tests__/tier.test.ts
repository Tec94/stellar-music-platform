import { describe, it, expect } from 'vitest';
import { getTierStatus, canUpgradeTier, recommendActionsForTierUpgrade } from '../tier';

describe('tier helpers', () => {
  it('provides tier status with upgrade eligibility', () => {
    const status = getTierStatus(1000, 6, 7);
    expect(status.currentTier).toBe('Silver');
    expect(status.nextTier).toBe('Gold');
    expect(status.xpRemaining).toBe(1500);
    expect(status.eligible).toBe(false);
  });

  it('identifies upgrade eligibility when requirements met', () => {
    const status = getTierStatus(2500, 10, 14);
    expect(status.currentTier).toBe('Gold');
    expect(status.eligible).toBe(true);
  });

  it('determines upgrade possibility based on quest count and streak', () => {
    expect(canUpgradeTier({ xp: 2400, questsCompleted: 12, consecutiveLoginDays: 15 })).toBe(true);
    expect(canUpgradeTier({ xp: 2400, questsCompleted: 3, consecutiveLoginDays: 5 })).toBe(false);
  });

  it('recommends actions towards next tier', () => {
    const recommendations = recommendActionsForTierUpgrade(1100, 4);
    expect(recommendations[0]).toContain('Gold');
    expect(recommendations.length).toBeGreaterThan(1);
  });

  it('encourages maintenance at top tier', () => {
    const recommendations = recommendActionsForTierUpgrade(15000, 20);
    expect(recommendations[0]).toContain('Diamond');
  });
});
