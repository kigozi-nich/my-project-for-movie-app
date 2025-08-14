import React from 'react';

const GenreList = ({ genres, onGenreSelect, selectedGenre }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <button
        onClick={() => onGenreSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedGenre
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All Movies
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onGenreSelect(genre)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedGenre?.id === genre.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreList;