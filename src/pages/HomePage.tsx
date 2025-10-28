import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export function HomePage() {
  const { user } = useAppState();

  return (
    <section className="page" aria-labelledby="home-heading">
      <h2 id="home-heading">Embark on Your Adventure</h2>
      <p>
        Adventure Quest Platform helps creators design interactive challenges, reward explorers with XP, and
        gamify community growth.
      </p>
      <div className="home__actions">
        {!user ? (
          <>
            <Link className="button" to="/register">
              Sign Up
            </Link>
            <Link className="button button--ghost" to="/login">
              Sign In
            </Link>
          </>
        ) : (
          <Link className="button" to="/dashboard">
            Continue as {user.username || user.email}
          </Link>
        )}
      </div>
      <dl className="home__stats">
        <div>
          <dt>Creators</dt>
          <dd>4,200+</dd>
        </div>
        <div>
          <dt>Quests completed</dt>
          <dd>1.3M</dd>
        </div>
        <div>
          <dt>Media uploads</dt>
          <dd>890k</dd>
        </div>
      </dl>
    </section>
  );
}
