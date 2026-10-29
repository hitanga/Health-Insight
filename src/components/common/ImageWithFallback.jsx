import React, { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

export default function ImageWithFallback({
  src,
  alt = '',
  className = '',
  aspectRatio = 'aspect-[16/10]',
  fallbackText = 'Image not available',
  showErrorDetails = false
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // If no source provided
  if (!src) {
    return (
      <div className={`bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 ${aspectRatio} ${className}`}>
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-10">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      )}

      {error ? (
        <div className={`flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 w-full h-full min-h-[140px]`}>
          <ImageOff className="w-7 h-7 mb-2 text-gray-400" />
          <span className="text-xs text-center font-medium text-gray-500">Image failed to load</span>
          {showErrorDetails && (
            <span className="text-[10px] text-gray-400 text-center mt-1 max-w-[200px] truncate">{src}</span>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
}
