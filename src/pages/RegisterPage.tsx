import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validatePassword, validateUsername } from '../utils/validation';

export function RegisterPage() {
  const navigate = useNavigate();
  const { user, profile, signUpWithEmail, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('Ready to explore the unknown!');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && profile?.username) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

  const handleAccountCreation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors: string[] = [];
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    if (!emailResult.valid) validationErrors.push(emailResult.error || 'Invalid email');
    if (!passwordResult.valid) validationErrors.push(passwordResult.error || 'Invalid password');
    if (password !== confirmPassword) validationErrors.push('Passwords do not match');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const error = await signUpWithEmail(email, password, { username });
    setLoading(false);
    if (error) {
      setErrors([error]);
      return;
    }

    setErrors([]);
    setStep(2);
  };

  const handleProfileCompletion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors: string[] = [];
    const usernameResult = validateUsername(username);
    if (!usernameResult.valid) validationErrors.push(usernameResult.error || 'Invalid username');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const currentUser = await refreshProfile();
    setLoading(false);

    if (!currentUser) {
      setErrors(['Unable to load profile']);
      return;
    }

    setErrors([]);
    navigate('/dashboard');
  };

  return (
    <section className="page" aria-labelledby="register-heading">
      <h2 id="register-heading">Create your account</h2>
      {step === 1 && (
        <form className="form" onSubmit={handleAccountCreation}>
          <fieldset>
            <legend>Account</legend>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </fieldset>
        </form>
      )}

      {step === 2 && (
        <div className="onboarding-step">
          <h3>Welcome aboard!</h3>
          <p>Let&apos;s personalize your profile.</p>
          <form className="form" onSubmit={handleProfileCompletion}>
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required />

            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} required />

            <button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Continue'}
            </button>
          </form>
        </div>
      )}

      {errors.length > 0 && (
        <div role="alert" className="errors">
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
