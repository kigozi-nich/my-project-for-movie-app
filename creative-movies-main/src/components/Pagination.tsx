import React from 'react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

const Pagination: React.FC<Props> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <button onClick={prev} disabled={page === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">
        Prev
      </button>
      <span className="text-sm text-gray-300">Page {page} of {totalPages}</span>
      <button onClick={next} disabled={page === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default Pagination;
