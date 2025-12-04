import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { fetchTrendingMovies } from '../modules/apiModule';
import LoadingSpinner from './LoadingSpinner';

const TrendingCarousel: React.FC = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const results = await fetchTrendingMovies();
        if (mounted) setMovies(results || []);
      } catch (e) {
        console.error('Error loading trending', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  if (loading) return <div className="mb-6"><LoadingSpinner label="Loading trending" /></div>;
  if (!movies.length) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Trending This Week</h2>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex space-x-4 pb-2">
          {movies.map((m: any) => (
            <div key={m.id} className="w-48 flex-shrink-0">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
