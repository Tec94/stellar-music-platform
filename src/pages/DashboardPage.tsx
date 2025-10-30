import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { formatDate } from '../utils/dateTime';
import { useFocusTrap } from '../hooks/useFocusTrap';

const tutorialSteps = [
  {
    title: 'Step 1',
    content: 'Navigate your dashboard overview and key metrics.'
  },
  {
    title: 'Step 2',
    content: 'Create quests and assign XP rewards.'
  },
  {
    title: 'Step 3',
    content: 'Invite players and manage party tiers.'
  },
  {
    title: 'Step 4',
    content: 'Review analytics and reward top performers.'
  }
];

export function DashboardPage() {
  const { user, media, chatMessages } = useAppState();
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const tutorialRef = useRef<HTMLDivElement | null>(null);

  const startTutorial = () => {
    setShowTutorial(true);
    setCurrentStep(0);
    setTutorialComplete(false);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const finishTutorial = () => {
    setShowTutorial(false);
    setTutorialComplete(true);
  };

  useFocusTrap(showTutorial, tutorialRef, { onClose: closeTutorial });

  const tutorialTitleId = `tutorial-step-title-${currentStep}`;
  const tutorialDescriptionId = `tutorial-step-description-${currentStep}`;
  const tutorialMetaId = 'tutorial-step-meta';

  return (
    <section className="page" aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading">Dashboard</h2>
      <p>Welcome back, {user?.username || user?.email || 'explorer'}!</p>
      <div className="dashboard__grid">
        <article>
          <h3>Progress</h3>
          <p>Tier: {user?.tier ?? 'Bronze'}</p>
          <p>XP: {user?.xp ?? 0}</p>
          <p>Quests completed: {user?.questsCompleted ?? 0}</p>
        </article>
        <article>
          <h3>Recent Media</h3>
          {media.length === 0 ? <p>No uploads yet.</p> : <p>{media[0].name}</p>}
          <Link to="/media">Upload Media</Link>
        </article>
        <article>
          <h3>Community Chat</h3>
          {chatMessages.length === 0 ? <p>Be the first to say hello!</p> : <p>{chatMessages.at(-1)?.content}</p>}
          <Link to="/chat">Open Chat</Link>
        </article>
      </div>

      <div className="dashboard__cta">
        <button
          type="button"
          onClick={startTutorial}
          aria-haspopup="dialog"
          aria-controls="dashboard-tutorial-dialog"
          aria-expanded={showTutorial}
        >
          Start Tutorial
        </button>
        <Link to="/quests">View quests</Link>
        <Link to="/tiers">Manage tiers</Link>
      </div>

      {tutorialComplete && (
        <div role="status" aria-live="polite">
          Tutorial complete!
        </div>
      )}

      {showTutorial && (
        <div role="presentation" className="tutorial">
          <div
            id="dashboard-tutorial-dialog"
            ref={tutorialRef}
            className="tutorial__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby={tutorialTitleId}
            aria-describedby={`${tutorialDescriptionId} ${tutorialMetaId}`}
          >
            <h3 id={tutorialTitleId}>{tutorialSteps[currentStep].title}</h3>
            <p id={tutorialDescriptionId}>{tutorialSteps[currentStep].content}</p>
            <div className="tutorial__actions">
              {currentStep < tutorialSteps.length - 1 ? (
                <button type="button" onClick={nextStep}>
                  Next
                </button>
              ) : (
                <button type="button" onClick={finishTutorial}>
                  Finish
                </button>
              )}
              <button type="button" className="button--ghost" onClick={closeTutorial}>
                Close
              </button>
            </div>
            <p id={tutorialMetaId} aria-live="polite">
              Step {currentStep + 1} of {tutorialSteps.length} — Last updated {formatDate(new Date())}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
