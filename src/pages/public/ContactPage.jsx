import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { submitContactMessage } from '../../services/contactService';

export default function ContactPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // Spam protection
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Spam honeypot trap
    if (formData.honeypot) {
      console.warn('Bot submission blocked.');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err) {
      setError(err.message || 'Failed to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Title */}
      <div className="text-center max-w-[580px] mx-auto mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202324] tracking-tight mb-3">
          Get in{' '}
          <span className="relative inline-block">
            Touch
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Have an editorial inquiry, scientific question, or partnership suggestion? We welcome your correspondence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Card (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-[6px] p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          <h2 className="text-base font-semibold text-[#202324]">Editorial Office</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Reach out directly to our publishing and research team. We review submissions within 2 business days.
          </p>

          <div className="space-y-4 pt-2 text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#80C8C9] shrink-0 mt-0.5" />
              <span>{settings.contactAddress || 'Jl. Raya Kuta No. 121, Badung - Bali, Indonesia.'}</span>
            </div>

            {settings.contactPhone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#80C8C9] shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
            )}

            {settings.contactEmail && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#80C8C9] shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 leading-relaxed">
            For urgent medical emergencies, please immediately contact your local emergency services or hospital.
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-[6px] p-6 sm:p-8 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-semibold text-[#202324]">Message Received</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. Our editorial team has received your message and will review it promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-[#202324] text-white text-xs font-medium rounded-[4px] hover:bg-black transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam Honeypot (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Question about Sleep Article"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Message Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#202324] hover:bg-black text-white text-xs font-medium rounded-[4px] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
