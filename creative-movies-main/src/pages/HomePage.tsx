import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import UserPreferences from '../components/UserPreferences';
import TrendingCarousel from '../components/TrendingCarousel';
import Pagination from '../components/Pagination';
import { searchMovies, getRecommendedMovies } from '../modules/apiModule';
import { Movie } from '../types';
import Wireframe from '../components/Wireframe';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(()=>{
    // simulate initial load network for wireframe demo
    const t = setTimeout(()=> setLoading(false), 700);
    return ()=> clearTimeout(t);
  },[])

  const handleSearch = async (query: string) => {
    setError(null);
    setLoading(true);
    setLastQuery(query);
    setPage(1);
    try{
      // use explicit page 1 for new searches to avoid stale state
      const { results, total_pages } = await searchMovies(query, 1);
      setMovies(results);
      setTotalPages(total_pages);
    } catch(e){
      setError('Failed to search movies. Try again.');
    } finally { setLoading(false) }
  };

  const handlePreferencesUpdate = async (preferences: string[]) => {
    const recommendations = await getRecommendedMovies(preferences);
    setRecommendedMovies(recommendations);
  };

  const onPageChange = async (p: number) => {
    setPage(p);
    if (!lastQuery) return;
    setLoading(true);
    try{
      const { results } = await searchMovies(lastQuery, p);
      setMovies(results);
    } catch(e){ setError('Failed to load page'); }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <TrendingCarousel />
      <SearchBar onSearch={handleSearch} />
      <UserPreferences onUpdate={handlePreferencesUpdate} />
      
      {loading ? (
        <div className="py-6"><LoadingSpinner label="Loading content" /></div>
      ) : error ? (
        <div className="bg-red-600/10 border border-red-600 text-red-200 p-4 rounded">{error}</div>
      ) : movies.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {/* pagination component */}
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
      {/* Pagination area */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default HomePage;