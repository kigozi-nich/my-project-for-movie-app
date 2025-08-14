import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, addToWatchlist, getWatchlist } from '../modules/apiModule';
import { Movie } from '../types';
import { Star, Clock, Plus, Check } from 'lucide-react';

function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (id) {
        const details = await getMovieDetails(id);
        setMovie(details);
        const watchlist = getWatchlist();
        setInWatchlist(details ? !!watchlist.find((m) => m.id === details.id) : false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  const handleAddToWatchlist = () => {
    if (movie && !inWatchlist) {
      addToWatchlist(movie);
      setInWatchlist(true);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg mb-6 md:mb-0 md:mr-6"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <div className="flex items-center mb-4">
            <Star className="text-gold mr-2" />
            <span>{movie.vote_average.toFixed(1)}</span>
            <Clock className="ml-4 mr-2" />
            <span>{movie.runtime} min</span>
          </div>
          <p className="text-gray-300 mb-4">{movie.overview}</p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Cast</h2>
            <p>{movie.cast.slice(0, 5).join(', ')}</p>
          </div>
          <button
            className={`bg-gold text-gray-900 px-4 py-2 rounded-lg flex items-center transition-colors ${inWatchlist ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
            onClick={handleAddToWatchlist}
            disabled={inWatchlist}
          >
            {inWatchlist ? <Check className="mr-2" /> : <Plus className="mr-2" />}
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;