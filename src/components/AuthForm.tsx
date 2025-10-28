import { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/validation';

export interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  mode: 'login' | 'register';
}

export function AuthForm({ onSubmit, mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Invalid password');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="auth-form">
      <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
      {error && <div role="alert" data-testid="auth-error">{error}</div>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          data-testid="email-input"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          data-testid="password-input"
        />
      </div>
      <button type="submit" disabled={loading} data-testid="submit-button">
        {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Register'}
      </button>
    </form>
  );
}
