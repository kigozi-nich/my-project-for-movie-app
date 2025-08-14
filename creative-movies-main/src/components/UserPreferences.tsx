import React, { useState } from 'react';

interface UserPreferencesProps {
  onUpdate: (preferences: string[]) => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ onUpdate }) => {
  const [preferences, setPreferences] = useState<string[]>([]);
  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance'];

  const handleToggle = (genre: string) => {
    setPreferences((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Your Preferences</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => handleToggle(genre)}
            className={`px-3 py-1 rounded-full text-sm ${
              preferences.includes(genre)
                ? 'bg-gold text-gray-900'
                : 'bg-gray-700 text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="bg-gold text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
      >
        Update Preferences
      </button>
    </form>
  );
};

export default UserPreferences;