import { useState } from 'react';
import { validateUsername } from '../utils/validation';

export interface ProfileFormProps {
  onSave: (payload: { username: string; bio: string }) => Promise<void>;
  initialUsername: string;
  initialBio: string;
}

export function ProfileForm({ onSave, initialUsername, initialBio }: ProfileFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error || 'Invalid username');
      return;
    }

    setSaving(true);
    try {
      await onSave({ username, bio });
      setStatus('Profile updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="profile-form">
      <h2>Profile</h2>
      {error && <div role="alert">{error}</div>}
      {status && <div role="status">{status}</div>}
      <label htmlFor="username">Username</label>
      <input
        id="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        disabled={saving}
        data-testid="username-input"
      />
      <label htmlFor="bio">Bio</label>
      <textarea
        id="bio"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        disabled={saving}
        data-testid="bio-input"
      />
      <button type="submit" disabled={saving} data-testid="save-button">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
