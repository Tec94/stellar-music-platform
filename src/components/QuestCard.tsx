import { getTierFromXp } from '../utils/xp';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  completed: boolean;
}

export interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => Promise<void>;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const tierForReward = getTierFromXp(quest.xpReward);

  const handleComplete = async () => {
    if (!quest.completed) {
      await onComplete(quest.id);
    }
  };

  return (
    <div data-testid={`quest-card-${quest.id}`} className={quest.completed ? 'completed' : ''}>
      <h3>{quest.title}</h3>
      <p>{quest.description}</p>
      <div>
        <span data-testid="difficulty">{quest.difficulty}</span>
        <span data-testid="xp-reward">{quest.xpReward} XP</span>
        <span data-testid="tier-indicator">{tierForReward} Tier</span>
      </div>
      <button
        onClick={handleComplete}
        disabled={quest.completed}
        data-testid="complete-button"
      >
        {quest.completed ? 'Completed' : 'Complete Quest'}
      </button>
    </div>
  );
}
