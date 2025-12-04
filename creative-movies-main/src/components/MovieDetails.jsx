import React, { useEffect } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';

const MovieDetails = ({ movie, onClose }) => {
  if (!movie) return null;

  useEffect(()=>{
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[onClose]);

  const imgSrc = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/placeholder.png';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e)=>e.stopPropagation()}>
        {/* Close button - visible on all backgrounds */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow hover:opacity-90 z-30"
        >
          <FaTimes size={18} />
        </button>

        <div className="h-[420px] relative bg-gray-200">
          <img
            src={imgSrc}
            alt={movie.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
            <h2 className="text-white text-3xl font-bold">{movie.title}</h2>
            <div className="flex items-center mt-2">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="text-white">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-lg mb-4">{movie.overview}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Release Date</h3>
              <p>{movie.release_date || 'Unknown'}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Genres</h3>
              <p>{movie.genres?.map(genre => genre.name).join(', ') || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;