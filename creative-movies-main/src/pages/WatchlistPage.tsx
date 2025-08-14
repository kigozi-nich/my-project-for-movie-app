import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getWatchlist, removeFromWatchlist } from '../modules/apiModule';
import { Movie } from '../types';

function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);


  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  const handleRemove = (id: number) => {
    removeFromWatchlist(id);
    setWatchlist(getWatchlist());
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty. Start adding movies!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((movie) => (
            <div key={movie.id} className="relative">
              <MovieCard movie={movie} />
              <button
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800 transition-colors"
                onClick={() => handleRemove(movie.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;