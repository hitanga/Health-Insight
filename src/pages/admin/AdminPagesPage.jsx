import React, { useState } from 'react';
import { Save, CheckCircle, AlertCircle, Loader2, BookOpen, Shield } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AdminPagesPage() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    aboutMission: settings?.aboutMission || '',
    aboutStandards: settings?.aboutStandards || '',
    privacyPolicy: settings?.privacyPolicy || ''
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: null, success: null });

  React.useEffect(() => {
    if (settings) {
      setFormData({
        aboutMission: settings.aboutMission || '',
        aboutStandards: settings.aboutStandards || '',
        privacyPolicy: settings.privacyPolicy || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ error: null, success: null });

    try {
      await updateSettings(formData);
      setFeedback({ success: 'Pages and policies content updated successfully!', error: null });
    } catch (err) {
      setFeedback({ error: err.message, success: null });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
        <p className="text-xs text-gray-500">Loading pages content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202324] tracking-tight">
            Pages & Policy Content
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage educational mission statements and reader privacy policies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs self-start sm:self-auto"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#80C8C9]" />}
          <span>Save Content</span>
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

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ABOUT US CONTENT */}
        <div className="bg-white p-6 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <BookOpen className="w-4 h-4 text-[#80C8C9]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              About Us Page Content
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mission Statement
            </label>
            <textarea
              rows={4}
              name="aboutMission"
              value={formData.aboutMission}
              onChange={handleChange}
              placeholder="HealthInsight is an independent digital health journal dedicated to translating nuanced biomedical research..."
              className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Editorial Standards & Integrity Statement
            </label>
            <textarea
              rows={4}
              name="aboutStandards"
              value={formData.aboutStandards}
              onChange={handleChange}
              placeholder="Every article published on HealthInsight undergoes rigorous fact-checking..."
              className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
          </div>
        </div>

        {/* PRIVACY POLICY CONTENT */}
        <div className="bg-white p-6 rounded-[6px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Shield className="w-4 h-4 text-[#80C8C9]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Privacy Policy Custom Text
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Policy Summary & Supplementary Terms
            </label>
            <textarea
              rows={5}
              name="privacyPolicy"
              value={formData.privacyPolicy}
              onChange={handleChange}
              placeholder="Your privacy matters to us. We do not sell your personal data..."
              className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#80C8C9]"
            />
          </div>
        </div>

      </form>
    </div>
  );
}
