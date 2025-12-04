import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie } from '../types';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../modules/apiModule';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(()=>{
    const cur = getWatchlist();
    setInWatchlist(!!cur.find(m=>m.id===movie.id));
  },[movie.id]);

  const toggleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      setInWatchlist(false);
    } else {
      addToWatchlist(movie);
      setInWatchlist(true);
    }
  };

  const CardInner = (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />

        <button
          onClick={toggleWatch}
          aria-pressed={inWatchlist}
          className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none"
          title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {inWatchlist ? '★' : '☆'}
        </button>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="text-gold mr-1" />
              <span>{(movie.vote_average||0).toFixed(1)}</span>
            </div>
            <div className="ml-4">
              {/* Details link always present to satisfy requirement */}
              <a href={`/movie/${movie.id}`} onClick={(e)=>e.stopPropagation()} className="inline-block bg-gold text-gray-900 px-3 py-1 rounded text-sm font-medium hover:opacity-90">
                Details
              </a>
            </div>
          </div>
        </div>
      </div>
  );

  if (onClick) {
    return (
      <div onClick={() => onClick(movie)} role="button" tabIndex={0} className="block cursor-pointer">
        {CardInner}
      </div>
    );
  }

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      {CardInner}
    </Link>
  );
};

export default MovieCard;