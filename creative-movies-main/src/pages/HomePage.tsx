import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import UserPreferences from '../components/UserPreferences';
import { searchMovies, getRecommendedMovies } from '../modules/apiModule';
import { Movie } from '../types';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  const handleSearch = async (query: string) => {
    const results = await searchMovies(query);
    setMovies(results);
  };

  const handlePreferencesUpdate = async (preferences: string[]) => {
    const recommendations = await getRecommendedMovies(preferences);
    setRecommendedMovies(recommendations);
  };

  return (
    <div className="space-y-8">
      <SearchBar onSearch={handleSearch} />
      <UserPreferences onUpdate={handlePreferencesUpdate} />
      
      {movies.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {recommendedMovies.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;