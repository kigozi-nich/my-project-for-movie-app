import React from 'react';

const PosterSkeleton: React.FC = () => (
  <div className="animate-pulse bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg overflow-hidden shadow-lg">
    <div className="bg-gray-600 h-44 sm:h-56 w-full" />
    <div className="p-3">
      <div className="h-3 bg-gray-600 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-600 rounded w-1/3" />
    </div>
  </div>
);

const Wireframe: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  const items = new Array(20).fill(0);
  const gridCols = `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns}`;

  return (
    <section aria-hidden className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-200">Movie Recommendations</h2>
        <div className="hidden sm:block w-80 h-10 rounded-full bg-gray-700 animate-pulse" />
      </div>

      <div className={`grid gap-6 ${gridCols}`}>
        {items.map((_, idx) => (
          <PosterSkeleton key={idx} />
        ))}
      </div>
    </section>
  );
};

export default Wireframe;
