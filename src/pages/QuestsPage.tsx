import { useRef, useState } from 'react';
import { QuestCard } from '../components/QuestCard';
import type { Quest } from '../components/QuestCard';
import { useFocusTrap } from '../hooks/useFocusTrap';

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
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleComplete = async (questId: string) => {
    setQuests((prev) => prev.map((quest) => (quest.id === questId ? { ...quest, completed: true } : quest)));
    return Promise.resolve();
  };

  const openQuest = (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const closeQuest = () => setSelectedQuest(null);

  useFocusTrap(Boolean(selectedQuest), dialogRef, { onClose: closeQuest });

  const dialogTitleId = selectedQuest ? `quest-dialog-title-${selectedQuest.id}` : undefined;
  const dialogDescriptionId = selectedQuest ? `quest-dialog-description-${selectedQuest.id}` : undefined;

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
            aria-haspopup="dialog"
            aria-expanded={selectedQuest?.id === quest.id}
            aria-controls="quest-dialog"
          >
            <QuestCard quest={quest} onComplete={handleComplete} />
          </button>
        ))}
      </div>

      {selectedQuest && (
        <div role="presentation" className="dialog" onClick={closeQuest}>
          <div
            id="quest-dialog"
            ref={dialogRef}
            className="dialog__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id={dialogTitleId}>{selectedQuest.title}</h3>
            <p id={dialogDescriptionId}>{selectedQuest.description}</p>
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
