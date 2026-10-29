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

export default function CompactArticleCard({ post }) {
  if (!post) return null;

  return (
    <article className="bg-white rounded-[6px] overflow-hidden flex flex-row h-[106px] sm:h-[114px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-md transition-shadow group">
      {/* Thumbnail Left (approx 42-45%) */}
      <Link
        to={`/health/${post.slug}`}
        className="w-[42%] sm:w-[44%] shrink-0 h-full overflow-hidden block relative"
      >
        <ImageWithFallback
          src={post.featuredImageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content Right */}
      <div className="w-[58%] sm:w-[56%] p-3 sm:p-3.5 flex flex-col justify-between">
        <div>
          <Link to={`/health/${post.slug}`}>
            <h4 className="text-[13px] sm:text-[13.5px] font-semibold text-[#202324] leading-snug line-clamp-2 group-hover:text-black">
              {post.title}
            </h4>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <Link
          to={`/health/${post.slug}`}
          className="inline-flex items-center text-[11.5px] font-medium text-[#202324] hover:text-[#2b7a78] transition-colors mt-1"
        >
          Read More <span className="ml-1 text-[13px]">→</span>
        </Link>
      </div>
    </article>
  );
}
