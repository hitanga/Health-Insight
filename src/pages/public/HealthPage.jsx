import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Loader2, Sparkles, BookOpen } from 'lucide-react';
import ArticleCard from '../../components/blog/ArticleCard';
import { getPublishedPosts } from '../../services/postsService';
import { getCategories } from '../../services/categoriesService';

export default function HealthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    async function loadData() {
      try {
        const [postsData, catsData] = await Promise.all([
          getPublishedPosts(),
          getCategories()
        ]);
        setPosts(postsData);
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to load health articles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update selected category if search param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    setVisibleCount(9);
    if (catSlug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catSlug });
    }
  };

  // Filter and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        post.categoryId === selectedCategory ||
        post.categoryName?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.categoryName?.toLowerCase().includes(q) ||
        (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
      
      {/* Header */}
      <div className="text-center max-w-[620px] mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202324] tracking-tight mb-2">
          Health & Wellness Articles
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Browse our complete collection of medically grounded health publications, preventive habits, and lifestyle guides.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4 mb-8">
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(9);
            }}
            placeholder="Search articles by title, topic, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-[6px] text-xs sm:text-sm text-[#202324] placeholder:text-gray-400 focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9] shadow-2xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#202324] text-white shadow-2xs'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            All Topics ({posts.length})
          </button>
          {categories.map((cat) => {
            const count = posts.filter(p => p.categoryId === cat.id || p.categoryId === cat.slug).length;
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => handleCategoryChange(cat.slug || cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === (cat.slug || cat.id)
                    ? 'bg-[#80C8C9] text-[#1C1F21] font-semibold shadow-2xs'
                    : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100'
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid or Loading / Empty States */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
          <p className="text-xs text-gray-400">Loading articles...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-[6px] border border-gray-200/80 p-12 text-center max-w-md mx-auto my-8">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#202324] mb-1">No articles found</h3>
          <p className="text-xs text-gray-500 mb-4">
            We couldn't find any articles matching your search query or selected topic.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
            }}
            className="px-4 py-2 bg-[#202324] text-white text-xs font-medium rounded-[4px] hover:bg-black transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More Button if remaining */}
          {filteredPosts.length > visibleCount && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-7 py-2.5 rounded-[6px] text-xs font-medium bg-white text-[#202324] border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-2xs cursor-pointer"
              >
                Load More Articles ({filteredPosts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}
