import { useRef, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { getTierFromXp } from '../utils/xp';
import { useFocusTrap } from '../hooks/useFocusTrap';

const tierDetails = [
  { name: 'Bronze', minXp: 0, price: 0, features: ['Access to basic quests', 'Community chat'] },
  { name: 'Silver', minXp: 1000, price: 9, features: ['10 additional quests', 'Profile customization'] },
  { name: 'Gold', minXp: 2500, price: 19, features: ['Advanced quests', 'Custom badges', 'Priority support'] },
  { name: 'Platinum', minXp: 5000, price: 39, features: ['All quests', 'Analytics dashboard', 'Private channels'] },
  { name: 'Diamond', minXp: 10000, price: 99, features: ['VIP access', 'Exclusive events', 'Unlimited uploads'] }
];

export function TiersPage() {
  const { user } = useAppState();
  const [showDialog, setShowDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const currentTier = user ? getTierFromXp(user.xp) : 'Bronze';

  const handleUpgrade = (tier: string, price: number) => {
    if (price === 0) {
      return;
    }
    setShowDialog(false);
    setStatusMessage(`Redirecting to checkout for ${tier} tier...`);
    setTimeout(() => {
      window.location.href = `/checkout?tier=${tier}&price=${price}`;
    }, 100);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  useFocusTrap(showDialog, dialogRef, { onClose: closeDialog });

  const dialogTitleId = 'tier-requirements-title';
  const dialogDescriptionId = 'tier-requirements-description';

  return (
    <section className="page" aria-labelledby="tiers-heading">
      <h2 id="tiers-heading">Tiers</h2>
      <p aria-live="polite">Your current tier: {currentTier}</p>
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
              <button
                type="button"
                onClick={() => handleUpgrade(tier.name, tier.price)}
                aria-label={`Upgrade to ${tier.name} tier for \${tier.price} per month`}
              >
                Upgrade to {tier.name}
              </button>
            )}
            {currentTier === tier.name && (
              <button disabled aria-label={`${tier.name} is your current tier`}>
                Current tier
              </button>
            )}
          </article>
        ))}
      </div>
      <div className="tiers__requirements">
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          aria-haspopup="dialog"
          aria-controls="tier-requirements-dialog"
          aria-expanded={showDialog}
        >
          View Requirements
        </button>
        <p>Complete 10 quests and maintain a 7-day login streak to unlock tiers.</p>
      </div>

      {showDialog && (
        <div role="presentation" className="dialog" onClick={closeDialog}>
          <div
            id="tier-requirements-dialog"
            ref={dialogRef}
            className="dialog__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id={dialogTitleId}>Quest Milestones</h3>
            <p id={dialogDescriptionId}>Reach the following milestones to earn tier upgrades:</p>
            <ul>
              <li>Bronze: No requirements</li>
              <li>Silver: 1,000 XP or 5 quests</li>
              <li>Gold: 2,500 XP or 10 quests</li>
              <li>Platinum: 5,000 XP or 20 quests</li>
              <li>Diamond: 10,000 XP or 40 quests</li>
            </ul>
            <button type="button" onClick={closeDialog}>
              Close
            </button>
          </div>
        </div>
      )}

      {statusMessage && (
        <div role="status" aria-live="polite" className="visually-hidden">
          {statusMessage}
        </div>
      )}
    </section>
  );
}
