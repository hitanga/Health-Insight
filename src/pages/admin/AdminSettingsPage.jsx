import React, { useState } from 'react';
import { Save, CheckCircle, AlertCircle, Loader2, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import ImageWithFallback from '../../components/common/ImageWithFallback';

export default function AdminSettingsPage() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: null, success: null });

  // Sync when settings loaded
  React.useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ error: null, success: null });

    try {
      await updateSettings(formData);
      setFeedback({ success: 'Website settings saved and updated across all pages!', error: null });
    } catch (err) {
      setFeedback({ error: err.message || 'Failed to update settings', success: null });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
        <p className="text-xs text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202324] tracking-tight">
            Website Branding & Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Customize logo, titles, contact information, and footer settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 text-[#80C8C9]" />
          )}
          <span>Save Changes</span>
        </button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BRANDING SECTION */}
        <div className="bg-white p-6 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#202324] uppercase tracking-wider text-[11px] pb-2 border-b border-gray-100">
            Brand Identity & Logo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Website Name
              </label>
              <input
                type="text"
                name="websiteName"
                value={formData.websiteName || ''}
                onChange={handleChange}
                placeholder="HealthInsight"
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Text-Based Logo
              </label>
              <input
                type="text"
                name="textLogo"
                value={formData.textLogo || ''}
                onChange={handleChange}
                placeholder="HealthInsight"
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline || ''}
              onChange={handleChange}
              placeholder="Your Guide to Better Health & Sustainable Vitality"
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
          </div>

          {/* Logo Image URL & Live Preview */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                Optional Logo Image URL
              </label>
              {formData.logoImageUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logoImageUrl: '' })}
                  className="text-[11px] text-rose-500 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove Image Logo</span>
                </button>
              )}
            </div>

            <input
              type="url"
              name="logoImageUrl"
              value={formData.logoImageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
            <p className="text-[11px] text-gray-400">
              If left empty or if image fails to load, the header gracefully displays the clean text logo.
            </p>

            {formData.logoImageUrl && (
              <div className="p-3 bg-gray-50 rounded border border-gray-200 flex items-center gap-4">
                <span className="text-xs text-gray-500 font-medium">Header Preview:</span>
                <img
                  src={formData.logoImageUrl}
                  alt="Logo Preview"
                  className="h-8 max-w-[160px] object-contain border border-gray-300 p-1 bg-white rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* CONTACT DETAILS SECTION */}
        <div className="bg-white p-6 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#202324] uppercase tracking-wider text-[11px] pb-2 border-b border-gray-100">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail || ''}
                onChange={handleChange}
                placeholder="contact@healthinsight.org"
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone || ''}
                onChange={handleChange}
                placeholder="(+62)-822-4545-2882"
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Physical / Office Address
            </label>
            <input
              type="text"
              name="contactAddress"
              value={formData.contactAddress || ''}
              onChange={handleChange}
              placeholder="Jl. Raya Kuta No. 121, Badung - Bali, Indonesia."
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                name="socialFacebook"
                value={formData.socialFacebook || ''}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Twitter / X URL</label>
              <input
                type="url"
                name="socialTwitter"
                value={formData.socialTwitter || ''}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">YouTube URL</label>
              <input
                type="url"
                name="socialYoutube"
                value={formData.socialYoutube || ''}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="socialLinkedin"
                value={formData.socialLinkedin || ''}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* FOOTER & COPYRIGHT SECTION */}
        <div className="bg-white p-6 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#202324] uppercase tracking-wider text-[11px] pb-2 border-b border-gray-100">
            Footer Configuration
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Newsletter / Footer Description
            </label>
            <textarea
              rows={2}
              name="footerDescription"
              value={formData.footerDescription || ''}
              onChange={handleChange}
              placeholder="Subscribe to receive our latest evidence-based wellness insights and articles."
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Copyright Notice
            </label>
            <input
              type="text"
              name="copyrightText"
              value={formData.copyrightText || ''}
              onChange={handleChange}
              placeholder="© 2026 HealthInsight Blog. All rights reserved."
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#80C8C9]" />}
            <span>Save All Website Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
