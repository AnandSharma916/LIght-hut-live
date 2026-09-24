import React from 'react';

/**
 * Studio official logo — Elegant brand icon with sleek styling.
 */
export const LHLogo = ({ className = 'h-10 w-auto' }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/categories/logo.png"
        alt="Lighting Studio"
        className={`${className} object-contain`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/logo.svg';
        }}
      />
    </div>
  );
};

