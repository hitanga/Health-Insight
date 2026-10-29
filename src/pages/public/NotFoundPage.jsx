import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
      <Compass className="w-14 h-14 text-gray-300 mx-auto mb-4" />
      <span className="text-xs font-semibold uppercase tracking-wider text-[#80C8C9] mb-1 block">
        404 Error
      </span>
      <h1 className="text-3xl font-bold text-[#202324] mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
        The page you are looking for doesn't exist or may have been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#202324] hover:bg-black text-white text-xs font-medium rounded-[4px] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Homepage
      </Link>
    </div>
  );
}
