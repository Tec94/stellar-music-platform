import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { formatDate } from '../utils/dateTime';

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

  const startTutorial = () => {
    setShowTutorial(true);
    setCurrentStep(0);
    setTutorialComplete(false);
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
        <button type="button" onClick={startTutorial}>
          Start Tutorial
        </button>
        <Link to="/quests">View quests</Link>
        <Link to="/tiers">Manage tiers</Link>
      </div>

      {tutorialComplete && <div role="status">Tutorial complete!</div>}

      {showTutorial && (
        <div role="dialog" aria-modal="true" className="tutorial">
          <div className="tutorial__content">
            <h3>{tutorialSteps[currentStep].title}</h3>
            <p>{tutorialSteps[currentStep].content}</p>
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
              <button type="button" className="button--ghost" onClick={() => setShowTutorial(false)}>
                Close
              </button>
            </div>
            <p>
              Step {currentStep + 1} of {tutorialSteps.length} — Last updated {formatDate(new Date())}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
