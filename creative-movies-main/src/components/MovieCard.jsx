import React from 'react';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie, onClick }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => onClick(movie)}
    >
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-96 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white font-bold text-lg">{movie.title}</h3>
        <div className="flex items-center mt-1">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-white">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;