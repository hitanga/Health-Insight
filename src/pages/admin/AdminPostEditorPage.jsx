import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  X,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Sparkles
} from 'lucide-react';
import {
  createPost,
  updatePost,
  getPostById,
  generateSlug
} from '../../services/postsService';
import { getCategories } from '../../services/categoriesService';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';

export default function AdminPostEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: null, success: null });
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    categoryId: '',
    categoryName: '',
    authorName: 'Editorial Team',
    featuredImageUrl: '',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    featuredOrder: 1,
    seoTitle: '',
    seoDescription: '',
    tagsString: '',
    readingTime: 4
  });

  // Load categories and existing post if editing
  useEffect(() => {
    async function init() {
      try {
        const cats = await getCategories();
        setCategories(cats);

        if (isEditing) {
          const post = await getPostById(id);
          if (post) {
            setFormData({
              title: post.title || '',
              slug: post.slug || '',
              excerpt: post.excerpt || '',
              body: post.body || '',
              categoryId: post.categoryId || '',
              categoryName: post.categoryName || '',
              authorName: post.authorName || 'Editorial Team',
              featuredImageUrl: post.featuredImageUrl || '',
              socialImageUrl: post.socialImageUrl || '',
              status: post.status || 'published',
              isFeatured: Boolean(post.isFeatured),
              featuredOrder: post.featuredOrder || 1,
              seoTitle: post.seoTitle || '',
              seoDescription: post.seoDescription || '',
              tagsString: Array.isArray(post.tags) ? post.tags.join(', ') : '',
              readingTime: post.readingTime || 4
            });
          } else {
            setFeedback({ error: 'Post not found', success: null });
          }
        } else if (cats.length > 0) {
          // default category for new post
          setFormData(prev => ({
            ...prev,
            categoryId: cats[0].id || cats[0].slug,
            categoryName: cats[0].name
          }));
        }
      } catch (err) {
        console.error('Failed to initialize editor:', err);
        setFeedback({ error: err.message, success: null });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isEditing]);

  // Auto-generate slug when title changes (if creating new post or slug is empty)
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing || !prev.slug ? generateSlug(title) : prev.slug
    }));
  };

  // Recalculate reading time on body change
  const handleBodyChange = (e) => {
    const body = e.target.value;
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setFormData(prev => ({ ...prev, body, readingTime: minutes }));
  };

  // Handle category change
  const handleCategorySelect = (e) => {
    const selectedId = e.target.value;
    const cat = categories.find(c => c.id === selectedId || c.slug === selectedId);
    setFormData(prev => ({
      ...prev,
      categoryId: selectedId,
      categoryName: cat ? cat.name : 'General'
    }));
  };

  // Quick markdown toolbar helper
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('article-body-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end) || 'text';
    const replacement = `${prefix}${selection}${suffix}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setFormData(prev => ({ ...prev, body: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selection.length);
    }, 10);
  };

  // Form submit handler
  const handleSave = async (targetStatus) => {
    setFeedback({ error: null, success: null });

    if (!formData.title.trim()) {
      setFeedback({ error: 'Please enter an article title.', success: null });
      return;
    }

    if (!formData.body.trim()) {
      setFeedback({ error: 'Please enter article body content.', success: null });
      return;
    }

    setSaving(true);
    try {
      const tagsArray = formData.tagsString
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || generateSlug(formData.title),
        excerpt: formData.excerpt.trim(),
        body: formData.body,
        categoryId: formData.categoryId,
        categoryName: formData.categoryName,
        authorName: formData.authorName.trim(),
        featuredImageUrl: formData.featuredImageUrl.trim(),
        socialImageUrl: formData.socialImageUrl.trim() || formData.featuredImageUrl.trim(),
        status: targetStatus || formData.status,
        isFeatured: Boolean(formData.isFeatured),
        featuredOrder: Number(formData.featuredOrder) || 1,
        seoTitle: formData.seoTitle.trim() || formData.title.trim(),
        seoDescription: formData.seoDescription.trim() || formData.excerpt.trim(),
        tags: tagsArray,
        readingTime: formData.readingTime
      };

      if (isEditing) {
        const updated = await updatePost(id, payload);
        if (updated?.firestoreError) {
          const errStr = updated.firestoreError.message || String(updated.firestoreError);
          const isBlocked = errStr.includes('blocked') || errStr.includes('offline') || errStr.includes('timeout');
          const isPerm = errStr.includes('permission-denied') || errStr.includes('insufficient');
          
          if (isBlocked) {
            setFeedback({
              success: 'Article updated & visible immediately on frontend! Note: Brave Shields or AdBlock is blocking firestore.googleapis.com. Toggle Brave Shields OFF to sync with Firebase Cloud.',
              error: null
            });
          } else if (isPerm) {
            setFeedback({
              success: 'Article updated & visible immediately on frontend! Note: Firebase rules returned permission-denied. Please publish Firestore Rules in Firebase Console.',
              error: null
            });
          } else {
            setFeedback({
              success: `Article updated & visible on website! (Cloud sync status: ${errStr})`,
              error: null
            });
          }
        } else {
          setFeedback({ success: 'Article updated successfully in Firebase Firestore Cloud Database!', error: null });
        }
      } else {
        const created = await createPost(payload);
        if (created?.firestoreError) {
          const errStr = created.firestoreError.message || String(created.firestoreError);
          const isBlocked = errStr.includes('blocked') || errStr.includes('offline') || errStr.includes('timeout');
          const isPerm = errStr.includes('permission-denied') || errStr.includes('insufficient');

          if (isBlocked) {
            setFeedback({
              success: 'Article created & visible immediately on frontend! Note: Brave Shields or AdBlock blocked firestore.googleapis.com. Toggle Brave Shields OFF to sync to Firebase Cloud.',
              error: null
            });
          } else if (isPerm) {
            setFeedback({
              success: 'Article created & visible immediately on frontend! Note: Firebase rules returned permission-denied. Please publish Firestore Rules in Firebase Console.',
              error: null
            });
          } else {
            setFeedback({
              success: `Article published and live on frontend! (Cloud sync notice: ${errStr})`,
              error: null
            });
          }
        } else {
          setFeedback({ success: 'Article created successfully in Firebase Firestore Cloud Database!', error: null });
        }
        setTimeout(() => {
          navigate(`/admin/posts/edit/${created.id}`);
        }, 1500);
      }
    } catch (err) {
      setFeedback({ error: err.message || 'Failed to save article.', success: null });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
        <p className="text-xs text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/posts"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#202324] mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Posts</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202324] tracking-tight">
            {isEditing ? 'Edit Health Article' : 'Create New Health Article'}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="px-5 py-2 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#80C8C9]" />
            )}
            <span>{isEditing ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
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

      {/* Editor Form Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Title & Slug Box */}
          <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Understanding Circadian Rhythms & Cellular Repair"
                className="w-full px-3.5 py-2 text-sm sm:text-base font-medium border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[4px] px-2.5 py-1.5 text-xs text-gray-500">
                  <span className="text-gray-400 select-none">/health/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                    className="w-full bg-transparent text-[#202324] focus:outline-none ml-0.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="e.g. Dr. Jane Vance"
                  className="w-full px-3.5 py-1.5 text-xs border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Short Excerpt / Summary
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary displayed on homepage cards and search results..."
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
              />
            </div>
          </div>

          {/* Article Body Editor with Formatting Toolbar & Preview */}
          <div className="bg-white rounded-[6px] border border-gray-200/80 shadow-2xs overflow-hidden">
            
            {/* Toolbar Header */}
            <div className="p-3 bg-gray-50/80 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertMarkdown('## ')}
                  title="Heading 2"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 text-xs font-bold"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('### ')}
                  title="Heading 3"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700 text-xs font-bold"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  title="Bold"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  title="Italic"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('- ')}
                  title="Bullet List"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('1. ')}
                  title="Numbered List"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('> ')}
                  title="Quote"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('[', '](https://example.com)')}
                  title="Insert Link"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('![Image description](', ')')}
                  title="Insert Image URL"
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Toggle: Write / Live Preview */}
              <div className="flex items-center bg-gray-200/80 p-0.5 rounded text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 rounded transition-colors font-medium ${
                    activeTab === 'write' ? 'bg-white text-[#202324] shadow-2xs' : 'text-gray-600'
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded transition-colors font-medium flex items-center gap-1 ${
                    activeTab === 'preview' ? 'bg-white text-[#202324] shadow-2xs' : 'text-gray-600'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Editor Area */}
            {activeTab === 'write' ? (
              <div className="p-4">
                <textarea
                  id="article-body-textarea"
                  required
                  rows={16}
                  value={formData.body}
                  onChange={handleBodyChange}
                  placeholder="Write your article in formatted text or Markdown... Use ## for section headings, - for bullet points, and > for quotes."
                  className="w-full text-xs sm:text-sm text-[#202324] leading-relaxed focus:outline-none resize-y font-mono min-h-[340px]"
                />
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>
                    Word count: {formData.body.trim().split(/\s+/).filter(Boolean).length}
                  </span>
                  <span>
                    Est. reading time: ~{formData.readingTime} min
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white min-h-[360px]">
                <MarkdownRenderer content={formData.body} />
              </div>
            )}
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
              SEO & Social Sharing
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Custom SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder={formData.title || 'Page title in Google search results...'}
                className="w-full px-3.5 py-1.5 text-xs border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder={formData.excerpt || 'Brief description for search engines and social cards...'}
                className="w-full px-3.5 py-1.5 text-xs border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
              />
            </div>
          </div>

        </div>

        {/* Sidebar Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* FEATURED IMAGE URL INPUT & LIVE PREVIEW (CRITICAL REQUIREMENT) */}
          <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">
                Featured Image URL <span className="text-rose-500">*</span>
              </label>
              {formData.featuredImageUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, featuredImageUrl: '' })}
                  className="text-[11px] text-rose-500 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-400 leading-normal">
              Paste a direct image link (e.g., Unsplash, Cloudinary, AWS S3).
            </p>

            <input
              type="url"
              value={formData.featuredImageUrl}
              onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
            />

            {/* Quick Unsplash Helper */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-gray-400">Quick sample:</span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  featuredImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80'
                })}
                className="text-[10px] text-[#2b7a78] hover:underline"
              >
                Longevity
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  featuredImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80'
                })}
                className="text-[10px] text-[#2b7a78] hover:underline"
              >
                Nutrition
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  featuredImageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=80'
                })}
                className="text-[10px] text-[#2b7a78] hover:underline"
              >
                Sleep
              </button>
            </div>

            {/* Live Preview Container */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                <span className="font-medium">Live Image Preview</span>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">16:10 Ratio</span>
              </div>
              <div className="border border-gray-200 rounded-[6px] overflow-hidden bg-gray-50">
                <ImageWithFallback
                  src={formData.featuredImageUrl}
                  alt="Featured Preview"
                  aspectRatio="aspect-[16/10]"
                  fallbackText="Paste a valid image URL to preview"
                  showErrorDetails={true}
                />
              </div>
            </div>
          </div>

          {/* Publishing & Category Box */}
          <div className="bg-white p-5 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Publishing Options
            </h3>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Topic
              </label>
              <select
                value={formData.categoryId}
                onChange={handleCategorySelect}
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
              >
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.id || c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
              >
                <option value="published">Published (Visible publicly)</option>
                <option value="draft">Draft (Private admin only)</option>
              </select>
            </div>

            {/* Featured Article Toggle */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-[#80C8C9] focus:ring-[#80C8C9]"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Feature in Top Showcase
                </span>
              </label>
              <p className="text-[10px] text-gray-400 mt-1 pl-5">
                Displays in the top two-column featured section on the homepage.
              </p>

              {formData.isFeatured && (
                <div className="mt-3 pl-5">
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Featured Position:
                  </label>
                  <select
                    value={formData.featuredOrder}
                    onChange={(e) => setFormData({ ...formData, featuredOrder: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                  >
                    <option value={1}>Position 1: Large Left Hero</option>
                    <option value={2}>Position 2: Top Right Card</option>
                    <option value={3}>Position 3: Middle Right Card</option>
                    <option value={4}>Position 4: Bottom Right Card</option>
                  </select>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                placeholder="Nutrition, Sleep, Habits"
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9]"
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
