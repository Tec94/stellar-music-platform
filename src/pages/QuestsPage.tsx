import { useState } from 'react';
import { QuestCard } from '../components/QuestCard';
import type { Quest } from '../components/QuestCard';

const mockQuests: Quest[] = [
  {
    id: 'quest-1',
    title: 'Mountain Expedition',
    description: 'Reach the summit of Mount Adventura',
    xpReward: 500,
    difficulty: 'medium',
    completed: false
  },
  {
    id: 'quest-2',
    title: 'Forest Exploration',
    description: 'Discover hidden pathways in the Whispering Woods',
    xpReward: 300,
    difficulty: 'easy',
    completed: false
  },
  {
    id: 'quest-3',
    title: 'Dragon Slayer',
    description: 'Defeat the legendary dragon of Fire Peak',
    xpReward: 3000,
    difficulty: 'legendary',
    completed: false
  }
];

export function QuestsPage() {
  const [quests, setQuests] = useState(mockQuests);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleComplete = async (questId: string) => {
    setQuests((prev) => prev.map((quest) => (quest.id === questId ? { ...quest, completed: true } : quest)));
    return Promise.resolve();
  };

  const openQuest = (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const closeQuest = () => setSelectedQuest(null);

  return (
    <section className="page" aria-labelledby="quests-heading">
      <h2 id="quests-heading">Quests</h2>
      <p>Select a quest to begin your adventure.</p>
      <div className="quests__grid">
        {quests.map((quest) => (
          <button
            key={quest.id}
            type="button"
            className="quest-wrapper"
            onClick={() => openQuest(quest)}
            data-testid={`quest-trigger-${quest.id}`}
          >
            <QuestCard quest={quest} onComplete={handleComplete} />
          </button>
        ))}
      </div>

      {selectedQuest && (
        <div role="dialog" aria-modal="true" className="dialog" onClick={closeQuest}>
          <div className="dialog__content" onClick={(event) => event.stopPropagation()}>
            <h3>{selectedQuest.title}</h3>
            <p>{selectedQuest.description}</p>
            <p>{selectedQuest.xpReward} XP reward</p>
            <button type="button" onClick={closeQuest}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
