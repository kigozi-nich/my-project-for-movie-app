import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getWatchlist } from '../modules/apiModule';
import { Movie } from '../types';

const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const list = await getWatchlist();
      setWatchlist(list);
    };
    fetchWatchlist();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty. Start adding movies!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;