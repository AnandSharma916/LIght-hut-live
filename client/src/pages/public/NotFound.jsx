import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-[#f8fafc] px-4 text-center">
      <div className="max-w-lg bg-white p-10 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Compass className="w-8 h-8 text-[#DC2626]" />
        </div>
        <span className="text-xs font-mono text-[#DC2626] uppercase tracking-luxury block mb-2 font-bold">
          Error 404 — Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900 tracking-tight mb-4">
          Uncharted Coordinate
        </h1>
        <p className="text-sm text-neutral-600 mb-8 leading-relaxed font-normal">
          The luminaire specification or catalog page you are seeking has either transitioned or does not exist.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-gold px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-luxury inline-flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/catalog"
            className="btn-outline-gold px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-luxury"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};
