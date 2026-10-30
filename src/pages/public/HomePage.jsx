import React, { useState, useEffect } from 'react';
import FeaturedSection from '../../components/blog/FeaturedSection';
import LatestArticlesSection from '../../components/blog/LatestArticlesSection';
import { getFeaturedPosts, getPublishedPosts } from '../../services/postsService';
import { Loader2 } from 'lucide-react';
import { resetDefaultSEO } from '../../lib/seo';

export default function HomePage() {
  const [featuredData, setFeaturedData] = useState({ mainFeatured: null, compactFeatured: [] });
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetDefaultSEO();
    async function loadData() {
      try {
        const [featured, allPublished] = await Promise.all([
          getFeaturedPosts(),
          getPublishedPosts()
        ]);

        setFeaturedData(featured);

        // Exclude the main featured article from the latest articles list to avoid immediate duplication
        const remaining = allPublished.filter(p => p.id !== featured.mainFeatured?.id);
        setLatestPosts(remaining);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
        <p className="text-xs text-gray-400">Loading health insights...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* Section A: Featured Articles */}
      <FeaturedSection
        mainFeatured={featuredData.mainFeatured}
        compactFeatured={featuredData.compactFeatured}
      />

      {/* Section B: Explore Our Latest Articles */}
      <LatestArticlesSection posts={latestPosts} />
    </div>
  );
}
