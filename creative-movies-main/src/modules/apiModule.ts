import axios from 'axios';
import { Movie } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const mapMovieData = (data: any): Movie => ({
  id: data.id,
  title: data.title || data.name,
  poster_path: data.poster_path,
  vote_average: data.vote_average ?? data.vote_average,
  overview: data.overview || data.summary || '',
});

export const searchMovies = async (query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> => {
  if (!query) return { results: [], total_pages: 0 };
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query, page },
    });
    return { results: (response.data.results || []).map(mapMovieData), total_pages: response.data.total_pages || 0 };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getRecommendedMovies = async (preferences: string[]): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: { api_key: API_KEY, with_genres: preferences.join(',') },
    });
    return (response.data.results || []).map(mapMovieData);
  } catch (error) {
    console.error('Error getting recommended movies:', error);
    return [];
  }
};

export const fetchTrendingMovies = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: { api_key: API_KEY },
    });
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const fetchGenres = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: API_KEY },
    });
    return response.data.genres || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId: number | string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: { api_key: API_KEY, with_genres: genreId, sort_by: 'popularity.desc' },
    });
    return (response.data.results || []).map(mapMovieData);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};

export const getMovieDetails = async (id: string): Promise<Movie | null> => {
  try {
    const [movieResponse, creditsResponse] = await Promise.all([
      axios.get(`${BASE_URL}/movie/${id}`, { params: { api_key: API_KEY } }),
      axios.get(`${BASE_URL}/movie/${id}/credits`, { params: { api_key: API_KEY } }),
    ]);

    const movieData = movieResponse.data;
    const creditsData = creditsResponse.data;

    return {
      ...mapMovieData(movieData),
      runtime: movieData.runtime,
      genres: movieData.genres,
      cast: (creditsData?.cast || []).slice(0, 5).map((actor: any) => actor.name),
    } as Movie;
  } catch (error) {
    console.error('Error getting movie details:', error);
    return null;
  }
};

export const getWatchlist = (): Movie[] => {
  const data = localStorage.getItem('watchlist');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const addToWatchlist = (movie: Movie) => {
  const current = getWatchlist();
  if (!current.find((m) => m.id === movie.id)) {
    localStorage.setItem('watchlist', JSON.stringify([...current, movie]));
  }
};

export const removeFromWatchlist = (movieId: number) => {
  const current = getWatchlist();
  localStorage.setItem('watchlist', JSON.stringify(current.filter((m) => m.id !== movieId)));
};