import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestCard } from '../../src/components/QuestCard';

describe('Quest completion flow', () => {
  const mockQuest = {
    id: 'quest-123',
    title: 'Mountain Expedition',
    description: 'Reach the summit',
    xpReward: 500,
    difficulty: 'medium' as const,
    completed: false
  };

  it('renders quest card with details', () => {
    render(<QuestCard quest={mockQuest} onComplete={vi.fn()} />);

    expect(screen.getByText('Mountain Expedition')).toBeInTheDocument();
    expect(screen.getByText('Reach the summit')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty')).toHaveTextContent('medium');
    expect(screen.getByTestId('xp-reward')).toHaveTextContent('500 XP');
  });

  it('completes quest when button clicked', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn().mockResolvedValue(undefined);
    render(<QuestCard quest={mockQuest} onComplete={onComplete} />);

    const button = screen.getByRole('button', { name: /complete quest/i });
    await user.click(button);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith('quest-123');
    });
  });

  it('disables completed quest button', () => {
    const completedQuest = { ...mockQuest, completed: true };
    render(<QuestCard quest={completedQuest} onComplete={vi.fn()} />);

    const button = screen.getByRole('button', { name: /completed/i });
    expect(button).toBeDisabled();
  });

  it('displays tier indicator for rewards', () => {
    const highRewardQuest = { ...mockQuest, xpReward: 3000 };
    render(<QuestCard quest={highRewardQuest} onComplete={vi.fn()} />);

    expect(screen.getByTestId('tier-indicator')).toHaveTextContent('Gold Tier');
  });
});
