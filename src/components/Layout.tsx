import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/quests', label: 'Quests' },
  { to: '/media', label: 'Media' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/tiers', label: 'Tiers' },
  { to: '/chat', label: 'Chat' }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAppState();
  const { isMobile, open, toggle, close } = useResponsiveMenu();

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__brand">
          <span aria-label="Adventure Quest Platform logo" role="img">
            🧭
          </span>
          <span>Adventure Quest</span>
        </div>
        {isMobile && (
          <button type="button" onClick={toggle} aria-haspopup="true" aria-label="Menu">
            Menu
          </button>
        )}
        {(open || !isMobile) && (
          <nav className="layout__nav" role="navigation">
            <ul>
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} onClick={close}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {!user && (
                <li>
                  <Link to="/login" onClick={close}>
                    Login
                  </Link>
                </li>
              )}
              {!user && (
                <li>
                  <Link to="/register" onClick={close}>
                    Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">Adventure Quest Platform © {new Date().getFullYear()}</footer>
    </div>
  );
}
