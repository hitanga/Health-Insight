import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function ArticleCard({ post }) {
  if (!post) return null;

  return (
    <article className="bg-white rounded-[6px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:shadow-md transition-shadow group h-full">
      {/* Top Image */}
      <Link
        to={`/health/${post.slug}`}
        className="block aspect-[16/10] overflow-hidden relative"
      >
        <ImageWithFallback
          src={post.featuredImageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {post.categoryName && (
          <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#202324] text-[10px] font-medium px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            {post.categoryName}
          </span>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <Link to={`/health/${post.slug}`}>
            <h3 className="font-semibold text-[#202324] text-[15px] sm:text-[15.5px] leading-snug line-clamp-2 group-hover:text-black mb-2">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <div>
          <Link
            to={`/health/${post.slug}`}
            className="inline-flex items-center text-xs font-semibold text-[#202324] hover:text-[#2b7a78] transition-colors"
          >
            Read More <span className="ml-1 text-sm">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
