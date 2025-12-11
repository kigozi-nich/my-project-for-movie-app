import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setFavorites(userFavorites);
    }
  }, [user]);

  const handleRemove = (id: number) => {
    if (user) {
      const updatedFavorites = favorites.filter((movie: any) => movie.id !== id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-primary font-bold mb-4 text-primary-white">My Favorites</h1>
        <p className="text-primary-white font-secondary">Please login to view your favorites.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-primary font-bold mb-6 text-primary-white">My Favorite Movies</h1>
      {favorites.length === 0 ? (
        <p className="text-primary-white font-secondary">You haven't added any favorites yet. Start adding movies you love!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((movie: any) => (
            <div key={movie.id} className="relative">
              <MovieCard movie={movie} />
              <button
                className="absolute top-2 right-2 bg-accent-red text-primary-white px-2 py-1 rounded hover:bg-red-700 transition-colors font-secondary text-sm"
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
}

export default FavoritesPage;
