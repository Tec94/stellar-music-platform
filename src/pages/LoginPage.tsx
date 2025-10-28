import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { validateEmail, validatePassword } from '../utils/validation';

export function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAppState();
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
    navigate('/dashboard');
  };

  return (
    <section className="page" aria-labelledby="login-heading">
      <h2 id="login-heading">Sign In</h2>
      {error && <div role="alert">{error}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Sign In</button>
      </form>
    </section>
  );
}
