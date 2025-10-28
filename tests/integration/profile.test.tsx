import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from '../../src/components/ProfileForm';

describe('Profile update flow', () => {
  it('shows initial profile data', () => {
    render(<ProfileForm onSave={vi.fn()} initialUsername="hero" initialBio="Ready for quests" />);

    expect(screen.getByDisplayValue('hero')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ready for quests')).toBeInTheDocument();
  });

  it('validates username before saving', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ProfileForm onSave={onSave} initialUsername="hero" initialBio="Ready" />);

    await user.clear(screen.getByLabelText('Username'));
    await user.type(screen.getByLabelText('Username'), 'ab');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/3 characters/i);
    });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('submits valid profile data', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<ProfileForm onSave={onSave} initialUsername="hero" initialBio="Ready" />);

    await user.clear(screen.getByLabelText('Username'));
    await user.type(screen.getByLabelText('Username'), 'questmaster');
    await user.clear(screen.getByLabelText('Bio'));
    await user.type(screen.getByLabelText('Bio'), 'Questing and exploring');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({ username: 'questmaster', bio: 'Questing and exploring' });
      expect(screen.getByRole('status')).toHaveTextContent('Profile updated');
    });
  });

  it('handles save errors gracefully', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockRejectedValue(new Error('Network issue'));
    render(<ProfileForm onSave={onSave} initialUsername="hero" initialBio="Ready" />);

    await user.clear(screen.getByLabelText('Username'));
    await user.type(screen.getByLabelText('Username'), 'questmaster');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network issue');
    });
  });
});
