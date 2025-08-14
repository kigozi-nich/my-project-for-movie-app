import axios from 'axios';
import { Movie } from '../types';

const API_KEY = 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
      },
    });
    return response.data.results.map(mapMovieData);
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getRecommendedMovies = async (preferences: string[]): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_genres: preferences.join(','),
      },
    });
    return response.data.results.map(mapMovieData);
  } catch (error) {
    console.error('Error getting recommended movies:', error);
    return [];
  }
};

export const getMovieDetails = async (id: string): Promise<Movie | null> => {
  try {
    const [movieResponse, creditsResponse] = await Promise.all([
      axios.get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`${BASE_URL}/movie/${id}/credits`, {
        params: { api_key: API_KEY },
      }),
    ]);

    const movieData = movieResponse.data;
    const creditsData = creditsResponse.data;

    return {
      ...mapMovieData(movieData),
      runtime: movieData.runtime,
      genres: movieData.genres,
      cast: creditsData.cast.slice(0, 5).map((actor: any) => actor.name),
    };
  } catch (error) {
    console.error('Error getting movie details:', error);
    return null;
  }
};

export const getWatchlist = async (): Promise<Movie[]> => {
  // In a real application, this would fetch the user's watchlist from a backend
  // For now, we'll return a mock watchlist
  const mockWatchlist = await searchMovies('popular');
  return mockWatchlist.slice(0, 4);
};

const mapMovieData = (data: any): Movie => ({
  id: data.id,
  title: data.title,
  poster_path: data.poster_path,
  vote_average: data.vote_average,
  overview: data.overview,
});