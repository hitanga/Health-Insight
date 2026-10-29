import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, ArrowLeft, Share2, Check, BookOpen, AlertCircle } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '../../services/postsService';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import ArticleCard from '../../components/blog/ArticleCard';
import SocialShareBar from '../../components/blog/SocialShareBar';
import { updatePageSEO, resetDefaultSEO } from '../../lib/seo';

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

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const found = await getPostBySlug(slug);
        setPost(found);

        if (found) {
          const allPosts = await getPublishedPosts();
          const related = allPosts
            .filter(p => p.id !== found.id && (p.categoryId === found.categoryId || p.categoryName === found.categoryName))
            .slice(0, 3);
          
          if (related.length < 3) {
            const fallback = allPosts.filter(p => p.id !== found.id && !related.some(r => r.id === p.id)).slice(0, 3 - related.length);
            setRelatedPosts([...related, ...fallback]);
          } else {
            setRelatedPosts(related);
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  // Synchronize browser title and OpenGraph / Twitter meta tags for social sharing
  useEffect(() => {
    if (post) {
      updatePageSEO({
        title: post.title,
        description: post.excerpt || post.seoDescription,
        image: post.featuredImageUrl || post.socialImageUrl,
        url: window.location.href,
        publishedTime: post.publishedAt,
        author: post.authorName
      });
    }
    return () => {
      resetDefaultSEO();
    };
  }, [post]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#80C8C9] rounded-full animate-spin mb-3" />
        <p className="text-xs text-gray-400">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#202324] mb-2">Article Not Found</h1>
        <p className="text-sm text-gray-500 mb-6">
          The health article you are looking for may have been moved, unpublished, or does not exist.
        </p>
        <Link
          to="/health"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#202324] text-white text-xs font-medium rounded-[4px] hover:bg-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Health Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-[780px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-gray-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/health" className="hover:text-gray-700 transition-colors">Health</Link>
        {post.categoryName && (
          <>
            <span>/</span>
            <Link
              to={`/health?category=${post.categoryId || post.categoryName.toLowerCase()}`}
              className="hover:text-gray-700 transition-colors"
            >
              {post.categoryName}
            </Link>
          </>
        )}
      </nav>

      {/* Header Info */}
      <header className="mb-6">
        {post.categoryName && (
          <span className="inline-block bg-[#80C8C9]/25 text-[#1a5b5c] text-[11px] font-semibold px-2.5 py-0.5 rounded tracking-wide uppercase mb-3">
            {post.categoryName}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight leading-tight mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal mb-5">
            {post.excerpt}
          </p>
        )}

        {/* Author & Meta Row */}
        <div className="flex items-center justify-between py-3.5 border-y border-gray-200/80 text-xs text-gray-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-[#202324]">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {post.authorName || 'Editorial Team'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="text-gray-400">
                {post.readingTime} min read
              </span>
            )}
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-black transition-colors p-1"
            title="Copy article link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-gray-500" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImageUrl && (
        <div className="mb-8 rounded-[8px] overflow-hidden shadow-2xs">
          <ImageWithFallback
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full max-h-[440px] object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-10">
        <MarkdownRenderer content={post.body} />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 mt-8 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Tags:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Prominent Social Sharing Section with Live Card Preview */}
      <SocialShareBar post={post} className="mb-8" />

      {/* Medical Info Disclaimer Box */}
      <div className="bg-gray-50 border-l-3 border-[#80C8C9] p-4 rounded-r text-xs text-gray-600 mb-12">
        <strong className="text-[#202324] block mb-0.5">Educational Health Notice</strong>
        This publication provides evidence-based educational insights and does not replace professional medical diagnosis, personalized dietary advice, or prescription treatment plans. Consult your healthcare team regarding symptoms or medical interventions.
      </div>

      {/* Back to Health Link */}
      <div className="mb-14">
        <Link
          to="/health"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#202324] hover:text-[#80C8C9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Health Articles
        </Link>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-[#202324] mb-6 tracking-tight">
            Related Health Publications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedPosts.map((related) => (
              <ArticleCard key={related.id} post={related} />
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
