import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center text-2xl font-bold text-gold">
          <Film className="mr-2" />
          MovieMaster
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/watchlist" className="hover:text-gold transition-colors">Watchlist</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;