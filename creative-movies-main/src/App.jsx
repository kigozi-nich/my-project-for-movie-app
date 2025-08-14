import { useState, useEffect } from 'react';
import { fetchTrendingMovies, searchMovies, getMovieDetails, fetchGenres, fetchMoviesByGenre } from './services/tmdb';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import SearchBar from './components/SearchBar';
import GenreList from './components/GenreList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    loadGenres();
    loadTrendingMovies();
  }, []);

  const loadGenres = async () => {
    try {
      const genreList = await fetchGenres();
      setGenres(genreList || []);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const trendingMovies = await fetchTrendingMovies();
      setMovies(trendingMovies || []);
    } catch (error) {
      console.error('Error loading trending movies:', error);
      setError('Failed to load movies. Please try again later.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = async (genre) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedGenre(genre);
      
      const movieList = genre
        ? await fetchMoviesByGenre(genre.id)
        : await fetchTrendingMovies();
      
      setMovies(movieList || []);
    } catch (error) {
      console.error('Error loading movies by genre:', error);
      setError('Failed to load movies. Please try again later.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedGenre(null);
      const searchResults = await searchMovies(query);
      setMovies(searchResults || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Failed to search movies. Please try again later.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = async (movie) => {
    try {
      const details = await getMovieDetails(movie.id);
      setSelectedMovie(details);
    } catch (error) {
      console.error('Error loading movie details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Movie Recommendations
        </h1>
        
        <SearchBar onSearch={handleSearch} />
        
        <GenreList
          genres={genres}
          onGenreSelect={handleGenreSelect}
          selectedGenre={selectedGenre}
        />

        {error && (
          <div className="text-center text-red-600 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading movies...</div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={handleMovieClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg">
            No movies found. Try a different search or genre.
          </div>
        )}

        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;