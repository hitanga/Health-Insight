import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import CompactArticleCard from './CompactArticleCard';
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

export default function FeaturedSection({ mainFeatured, compactFeatured = [] }) {
  if (!mainFeatured && (!compactFeatured || compactFeatured.length === 0)) {
    return null;
  }

  return (
    <section className="w-full pt-10 sm:pt-14 pb-8">
      {/* Centered Heading with subtle turquoise underline */}
      <div className="text-center max-w-[620px] mx-auto mb-10 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#202324] tracking-tight leading-tight mb-3">
          Your Guide to Better{' '}
          <span className="relative inline-block">
            Health
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed font-normal">
          Explore evidence-informed perspectives, wellness routines, and actionable insights to nourish your everyday physical and cognitive vitality.
        </p>
      </div>

      {/* Two-Column Featured Container (matches screenshot proportions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* Left Column: Large Featured Card (approx 58% width on desktop = 7 cols) */}
        {mainFeatured ? (
          <div className="lg:col-span-7 h-[360px] sm:h-[400px] lg:h-[380px]">
            <Link
              to={`/health/${mainFeatured.slug}`}
              className="group relative block w-full h-full rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100"
            >
              {/* Cover Image */}
              <ImageWithFallback
                src={mainFeatured.featuredImageUrl}
                alt={mainFeatured.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* Dark Gradient Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-7 text-white">
                {mainFeatured.categoryName && (
                  <span className="inline-block bg-[#80C8C9] text-[#1C1F21] text-[11px] font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider mb-2 self-start">
                    {mainFeatured.categoryName}
                  </span>
                )}
                <h2 className="text-lg sm:text-xl md:text-[22px] font-bold leading-snug mb-2 group-hover:text-gray-100 transition-colors">
                  {mainFeatured.title}
                </h2>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-2.5">
                  <Clock className="w-3.5 h-3.5 text-gray-300" />
                  <span>{formatDate(mainFeatured.publishedAt)}</span>
                </div>

                {mainFeatured.excerpt && (
                  <p className="text-xs sm:text-[13px] text-gray-300 line-clamp-2 leading-relaxed font-light">
                    {mainFeatured.excerpt}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ) : null}

        {/* Right Column: 3 Compact Featured Cards (approx 42% width on desktop = 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3 sm:space-y-4">
          {compactFeatured.map((post) => (
            <CompactArticleCard key={post.id} post={post} />
          ))}
        </div>

      </div>
    </section>
  );
}
