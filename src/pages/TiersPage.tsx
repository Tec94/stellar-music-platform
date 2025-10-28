import { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { getTierFromXp } from '../utils/xp';

const tierDetails = [
  { name: 'Bronze', minXp: 0, price: 0, features: ['Access to basic quests', 'Community chat'] },
  { name: 'Silver', minXp: 1000, price: 9, features: ['10 additional quests', 'Profile customization'] },
  { name: 'Gold', minXp: 2500, price: 19, features: ['Advanced quests', 'Custom badges', 'Priority support'] },
  { name: 'Platinum', minXp: 5000, price: 39, features: ['All quests', 'Analytics dashboard', 'Private channels'] },
  { name: 'Diamond', minXp: 10000, price: 99, features: ['VIP access', 'Exclusive events', 'Unlimited uploads'] }
];

export function TiersPage() {
  const { user, upgradeTier } = useAppState();
  const [showDialog, setShowDialog] = useState(false);
  const currentTier = user ? getTierFromXp(user.xp) : 'Bronze';

  const handleUpgrade = (tier: string, price: number) => {
    if (price === 0) {
      return;
    }
    setShowDialog(false);
    window.location.href = `/checkout?tier=${tier}&price=${price}`;
  };

  return (
    <section className="page" aria-labelledby="tiers-heading">
      <h2 id="tiers-heading">Tiers</h2>
      <p>Your current tier: {currentTier}</p>
      <div className="tiers__list">
        {tierDetails.map((tier) => (
          <article key={tier.name} className={`tier-card ${currentTier === tier.name ? 'tier-card--active' : ''}`}>
            <h3>{tier.name}</h3>
            <p className="tier-card__price">{tier.price === 0 ? 'Free' : `$${tier.price}/month`}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {tier.price > 0 && currentTier !== tier.name && (
              <button type="button" onClick={() => handleUpgrade(tier.name, tier.price)}>
                Upgrade to {tier.name}
              </button>
            )}
            {currentTier === tier.name && <button disabled>Current tier</button>}
          </article>
        ))}
      </div>
      <div className="tiers__requirements">
        <button type="button" onClick={() => setShowDialog(true)}>
          View Requirements
        </button>
        <p>Complete 10 quests and maintain a 7-day login streak to unlock tiers.</p>
      </div>

      {showDialog && (
        <div role="dialog" aria-modal="true" className="dialog">
          <div className="dialog__content">
            <h3>Quest Milestones</h3>
            <p>Reach the following milestones to earn tier upgrades:</p>
            <ul>
              <li>Bronze: No requirements</li>
              <li>Silver: 1,000 XP or 5 quests</li>
              <li>Gold: 2,500 XP or 10 quests</li>
              <li>Platinum: 5,000 XP or 20 quests</li>
              <li>Diamond: 10,000 XP or 40 quests</li>
            </ul>
            <button type="button" onClick={() => setShowDialog(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
