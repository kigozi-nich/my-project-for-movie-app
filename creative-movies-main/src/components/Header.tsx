import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MenuIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        setOpen(false);
      }
      // Basic focus trap: keep tab within panel
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a, button');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    };

    if (open) {
      // focus first link when menu opens
      setTimeout(() => firstLinkRef.current?.focus(), 0);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <header className="bg-primary-light shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center text-2xl font-bold text-primary-white hover:text-accent-green transition-colors">
          <Film className="mr-2" />
          MovieMaster
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-primary-white hover:text-accent-green transition-colors font-secondary">Home</Link>
          <Link to="/watchlist" className="text-primary-white hover:text-accent-green transition-colors font-secondary">Watchlist</Link>
          <Link to="/favorites" className="text-primary-white hover:text-accent-green transition-colors font-secondary">Favorites</Link>
          <Link to="/profile" className="text-primary-white hover:text-accent-green transition-colors font-secondary">Profile</Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-primary-white font-secondary">Welcome, {user.username}</span>
              <button onClick={logout} className="bg-accent-red text-primary-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-secondary">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="bg-accent-green text-primary-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-secondary">Login</Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <div className="block">
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel with backdrop */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            ref={panelRef}
            className="md:hidden fixed top-0 right-0 w-11/12 max-w-xs h-full bg-primary-light text-primary-white shadow-lg z-50 transform transition-transform duration-300 ease-out"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Link to="/" className="flex items-center text-xl font-bold text-primary-white">
                  <Film className="mr-2" /> MovieMaster
                </Link>
                <button onClick={() => setOpen(false)} className="p-2 rounded-md text-primary-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-green" aria-label="Close menu">
                  <X />
                </button>
              </div>

              <nav>
                <ul className="flex flex-col space-y-3">
                  <li>
                    <Link
                      ref={firstLinkRef}
                      to="/"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-green font-secondary"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/watchlist"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-green font-secondary"
                    >
                      Watchlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/favorites"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-green font-secondary"
                    >
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-green font-secondary"
                    >
                      Profile
                    </Link>
                  </li>
                  {user ? (
                    <>
                      <li className="px-3 py-2 text-sm font-secondary">Welcome, {user.username}</li>
                      <li>
                        <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left px-3 py-2 rounded bg-accent-red hover:bg-red-700 font-secondary">Logout</button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded bg-accent-green hover:bg-green-700 font-secondary">Login</Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;