import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, User } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', label: 'Home', icon: <Home /> },
    { to: '/search', label: 'Search', icon: <Search /> },
    { to: '/watchlist', label: 'Watchlist', icon: <Bookmark /> },
    { to: '/profile', label: 'Profile', icon: <User /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-800 rounded-full shadow-lg px-4 py-2 flex items-center space-x-4">
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center text-sm text-white ${active ? 'text-gold' : 'opacity-90'}`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="w-6 h-6" aria-hidden>{item.icon}</div>
              <span className="text-xs mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
