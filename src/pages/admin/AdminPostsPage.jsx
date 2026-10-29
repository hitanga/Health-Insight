import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { getAllPostsAdmin, deletePost } from '../../services/postsService';
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

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, post: null });

  const loadPosts = async () => {
    try {
      const data = await getAllPostsAdmin();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const confirmDelete = async () => {
    if (!deleteModal.post) return;
    try {
      await deletePost(deleteModal.post.id, true);
      setPosts(posts.filter(p => p.id !== deleteModal.post.id));
      setDeleteModal({ open: false, post: null });
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      post.title?.toLowerCase().includes(q) ||
      post.categoryName?.toLowerCase().includes(q) ||
      post.authorName?.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202324] tracking-tight">
            All Blog Posts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your articles, drafts, and publication statuses.
          </p>
        </div>

        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded-[4px] transition-colors shadow-2xs self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#80C8C9]" />
          <span>Add New Post</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-[6px] border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, author..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-[4px] text-xs text-[#202324] focus:outline-none focus:bg-white focus:border-[#80C8C9]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#202324] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[6px] border border-gray-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#80C8C9] animate-spin mb-2" />
            <p className="text-xs text-gray-400">Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No posts found matching the filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Thumbnail</th>
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4 w-16">
                      <div className="w-12 h-9 rounded overflow-hidden border border-gray-200">
                        <ImageWithFallback
                          src={post.featuredImageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 max-w-[280px]">
                      <span className="font-semibold text-gray-900 block truncate">
                        {post.title}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        /{post.slug}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap">
                      {post.categoryName || 'General'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Draft
                        </span>
                      )}
                      {post.isFeatured && (
                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#80C8C9]/25 text-[#1b6466]">
                          Featured
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
                        {post.status === 'published' && (
                          <Link
                            to={`/health/${post.slug}`}
                            target="_blank"
                            title="View on site"
                            className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          title="Edit"
                          className="p-1 text-gray-500 hover:text-black transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, post })}
                          title="Delete"
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

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-[6px] max-w-sm w-full p-6 shadow-xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-sm text-[#202324]">Confirm Article Deletion</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Are you sure you want to delete <strong>"{deleteModal.post?.title}"</strong>? This will remove the article from the public blog.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, post: null })}
                className="px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors cursor-pointer"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
