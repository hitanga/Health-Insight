import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Clock,
  FolderTree,
  Mail,
  PlusCircle,
  ArrowRight,
  Edit,
  Trash2,
  ExternalLink,
  Database,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getAllPostsAdmin, deletePost } from '../../services/postsService';
import { getCategories, saveCategory } from '../../services/categoriesService';
import { getContactMessages } from '../../services/contactService';
import { createPost } from '../../services/postsService';
import { initialPosts, initialCategories, initialSettings } from '../../data/initialData';
import { updateWebsiteSettings } from '../../services/settingsService';
import { isFirebaseConfigured } from '../../lib/firebase';
import ImageWithFallback from '../../components/common/ImageWithFallback';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function AdminOverviewPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(null);

  const loadData = async () => {
    try {
      const [allPosts, allCats, allMsgs] = await Promise.all([
        getAllPostsAdmin(),
        getCategories(),
        getContactMessages()
      ]);
      setPosts(allPosts);
      setCategories(allCats);
      setMessages(allMsgs);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deletePost(id, true);
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete article: ' + err.message);
      }
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('This will populate the database with initial health categories, settings, and articles. Continue?')) {
      return;
    }

    setSeeding(true);
    setSeedSuccess(null);
    try {
      // 1. Settings
      await updateWebsiteSettings(initialSettings);
      
      // 2. Categories
      for (const cat of initialCategories) {
        await saveCategory(cat);
      }

      // 3. Posts
      for (const p of initialPosts) {
        await createPost(p);
      }

      setSeedSuccess('Successfully seeded initial health articles and categories!');
      await loadData();
    } catch (err) {
      alert('Error seeding database: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const publishedCount = posts.filter(p => p.status === 'published' && !p.deletedAt).length;
  const draftCount = posts.filter(p => p.status === 'draft' && !p.deletedAt).length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
        <p className="text-xs text-gray-500">Loading overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202324] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time management for articles, topics, and reader inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded-[4px] transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#80C8C9]" />
            <span>Add New Post</span>
          </Link>

          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            title="Populate database with initial articles"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded-[4px] transition-colors disabled:opacity-50"
          >
            {seeding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Database className="w-3.5 h-3.5 text-[#80C8C9]" />
            )}
            <span>Seed Health Content</span>
          </button>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{seedSuccess}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Posts */}
        <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Total Posts</span>
            <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-gray-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#202324]">{posts.length}</div>
          <Link to="/admin/posts" className="text-[11px] text-[#2b7a78] hover:underline mt-2 inline-block">
            View all posts →
          </Link>
        </div>

        {/* Published Posts */}
        <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Published</span>
            <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{publishedCount}</div>
          <span className="text-[11px] text-gray-400 mt-2 block">
            Live on public blog
          </span>
        </div>

        {/* Draft Posts */}
        <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Drafts</span>
            <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">{draftCount}</div>
          <span className="text-[11px] text-gray-400 mt-2 block">
            Hidden from public
          </span>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Categories</span>
            <div className="w-7 h-7 rounded bg-teal-50 flex items-center justify-center text-teal-600">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#202324]">{categories.length}</div>
          <Link to="/admin/categories" className="text-[11px] text-[#2b7a78] hover:underline mt-2 inline-block">
            Manage categories →
          </Link>
        </div>

      </div>

      {/* Recent Articles Table */}
      <div className="bg-white rounded-[6px] border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#202324]">Recent Articles</h2>
            <p className="text-xs text-gray-400">Latest publications and drafts in Firestore</p>
          </div>
          <Link
            to="/admin/posts"
            className="text-xs font-semibold text-[#202324] hover:text-[#80C8C9] transition-colors flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-xs">
            No articles in the database yet. Click "Add New Post" or "Seed Health Content" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded overflow-hidden shrink-0 border border-gray-200">
                          <ImageWithFallback
                            src={post.featuredImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-[280px]">
                          <span className="font-semibold text-gray-900 block truncate">
                            {post.title}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate block">
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {post.categoryName || 'General'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/health/${post.slug}`}
                          target="_blank"
                          title="Preview public article"
                          className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          title="Edit article"
                          className="p-1 text-gray-500 hover:text-black transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          title="Delete article"
                          className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
