import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';

export default function LatestArticlesSection({ posts = [] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="w-full pt-10 sm:pt-14 pb-12">
      {/* Horizontal Top Row: Heading on left, Description on right */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#202324] tracking-tight">
            Explore Our Latest{' '}
            <span className="relative inline-block">
              Articles
              <span
                className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
                aria-hidden="true"
              />
            </span>
          </h2>
        </div>

        <div className="md:max-w-[420px]">
          <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
            Discover curated guides, scientific breakthroughs, and daily wellness strategies to cultivate vibrant physical, mental, and nutritional balance.
          </p>
        </div>
      </div>

      {/* 3-Column Article Grid (2 rows = 6 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {posts.slice(0, 6).map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {/* Centered Dark Button Below */}
      <div className="flex justify-center mt-10">
        <Link
          to="/health"
          className="inline-flex items-center justify-center px-7 py-3 rounded-[6px] text-xs sm:text-sm font-medium bg-[#202324] text-white hover:bg-black transition-colors shadow-xs hover:shadow cursor-pointer"
        >
          View all articles
        </Link>
      </div>
    </section>
  );
}
