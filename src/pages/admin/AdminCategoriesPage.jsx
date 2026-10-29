import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getCategories, saveCategory, deleteCategory } from '../../services/categoriesService';
import { getAllPostsAdmin } from '../../services/postsService';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [feedback, setFeedback] = useState({ error: null, success: null });

  const loadData = async () => {
    try {
      const [cats, allPosts] = await Promise.all([
        getCategories(),
        getAllPostsAdmin()
      ]);
      setCategories(cats);
      setPosts(allPosts);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    setFormData(prev => ({ ...prev, name, slug: editingId ? prev.slug : slug }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFeedback({ error: null, success: null });

    if (!formData.name.trim()) {
      setFeedback({ error: 'Category name is required.', success: null });
      return;
    }

    try {
      await saveCategory({
        id: editingId || formData.slug,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim()
      });

      setFeedback({ success: editingId ? 'Category updated!' : 'Category created!', error: null });
      setFormData({ name: '', slug: '', description: '' });
      setEditingId(null);
      await loadData();
    } catch (err) {
      setFeedback({ error: err.message, success: null });
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id || cat.slug);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleDelete = async (cat) => {
    const id = cat.id || cat.slug;
    const assignedCount = posts.filter(p => p.categoryId === id || p.categoryId === cat.slug).length;

    if (assignedCount > 0) {
      alert(`Cannot delete "${cat.name}". There are ${assignedCount} article(s) currently assigned to this category. Please reassign those articles first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      try {
        await deleteCategory(id);
        setFeedback({ success: 'Category deleted.', error: null });
        await loadData();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
        <p className="text-xs text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#202324] tracking-tight">
          Category Topics
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Organize health articles into distinct educational topics and disciplines.
        </p>
      </div>

      {feedback.error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.error}</span>
        </div>
      )}
      {feedback.success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-[6px] border border-gray-200/80 shadow-2xs">
          <h2 className="text-sm font-bold text-[#202324] mb-4">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Gut Health"
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="gut-health"
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of articles in this topic..."
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[6px] border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#202324]">Existing Topics ({categories.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4">Slug</th>
                  <th className="py-2.5 px-4">Articles</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => {
                  const id = cat.id || cat.slug;
                  const count = posts.filter(p => p.categoryId === id || p.categoryId === cat.slug).length;

                  return (
                    <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {cat.name}
                        {cat.description && (
                          <span className="block text-[11px] text-gray-400 font-normal line-clamp-1">
                            {cat.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {count} articles
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(cat)}
                            title="Edit"
                            className="p-1 text-gray-500 hover:text-black transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            title="Delete"
                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
