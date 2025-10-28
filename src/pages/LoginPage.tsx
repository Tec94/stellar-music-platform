import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    if (!emailResult.valid) {
      setError(emailResult.error || 'Invalid email');
      return;
    }

    if (!passwordResult.valid) {
      setError(passwordResult.error || 'Invalid password');
      return;
    }

    setError('');
    setLoading(true);
    const result = await signInWithEmail(email, password);
    setLoading(false);

    if (result) {
      setError(result);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="page" aria-labelledby="login-heading">
      <h2 id="login-heading">Sign In</h2>
      {error && <div role="alert">{error}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing In…' : 'Sign In'}
        </button>
      </form>
    </section>
  );
}
