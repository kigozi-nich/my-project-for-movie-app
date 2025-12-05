import React from 'react';

interface Props {
  size?: number;
  label?: string;
}

const LoadingSpinner: React.FC<Props> = ({ size = 40, label = 'Loading' }) => {
  const s = size;
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center p-4">
      <svg
        width={s}
        height={s}
        viewBox="0 0 50 50"
        className="animate-spin"
        aria-hidden
      >
        <circle cx="25" cy="25" r="20" strokeWidth="5" stroke="#cbd5e1" fill="none" />
        <path d="M45 25a20 20 0 0 1-20 20" strokeWidth="5" stroke="#f59e0b" strokeLinecap="round" fill="none" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
