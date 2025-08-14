export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
  cast?: string[];
}