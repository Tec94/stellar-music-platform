import { type ReactNode, useRef, type KeyboardEvent } from 'react';
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

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAppState();
  const { isMobile, open, toggle, close } = useResponsiveMenu();
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && isMobile && open) {
      event.preventDefault();
      close();
      menuButtonRef.current?.focus();
    }
  };

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="layout__header">
        <div className="layout__brand">
          <span aria-hidden="true">🧭</span>
          <span>Adventure Quest</span>
        </div>
        {isMobile && (
          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label="Toggle navigation menu"
          >
            Menu
          </button>
        )}
        {(open || !isMobile) && (
          <nav className="layout__nav" id="main-navigation" aria-label="Main navigation" onKeyDown={handleKeyDown}>
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
      <main className="layout__main" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="layout__footer">Adventure Quest Platform © {new Date().getFullYear()}</footer>
    </div>
  );
}
