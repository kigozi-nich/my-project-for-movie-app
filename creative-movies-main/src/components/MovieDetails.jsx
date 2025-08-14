import React from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';

const MovieDetails = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <FaTimes size={24} />
          </button>
          <div className="h-[400px] relative">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <h2 className="text-white text-3xl font-bold">{movie.title}</h2>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-white">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 text-lg mb-4">{movie.overview}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Release Date</h3>
                <p>{movie.release_date}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Genres</h3>
                <p>{movie.genres?.map(genre => genre.name).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;