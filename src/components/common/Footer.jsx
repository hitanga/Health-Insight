import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Linkedin, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { subscribeNewsletter } from '../../services/newsletterService';

export default function Footer() {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const res = await subscribeNewsletter(email);
      setMessage(res.message);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[#1C1F21] text-gray-300 pt-16 pb-12 mt-20 border-t border-gray-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Four Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Contact Information */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold tracking-wide">Contact Information</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              {settings.contactAddress || 'Jl. Raya Kuta No. 121, Badung - Bali, Indonesia.'}
            </p>
            {settings.contactPhone && (
              <p className="text-sm text-gray-400 font-normal">
                {settings.contactPhone}
              </p>
            )}
            {settings.contactEmail && (
              <p className="text-sm text-gray-400 font-normal">
                {settings.contactEmail}
              </p>
            )}

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {settings.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded bg-[#2A2E31] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#80C8C9] hover:text-[#1C1F21] transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialTwitter && (
                <a
                  href={settings.socialTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded bg-[#2A2E31] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#80C8C9] hover:text-[#1C1F21] transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.socialYoutube && (
                <a
                  href={settings.socialYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded bg-[#2A2E31] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#80C8C9] hover:text-[#1C1F21] transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinkedin && (
                <a
                  href={settings.socialLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded bg-[#2A2E31] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#80C8C9] hover:text-[#1C1F21] transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/health" className="hover:text-white transition-colors">Health Articles</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Topics */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold tracking-wide">Our Topics</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/health?category=nutrition" className="hover:text-white transition-colors">Nutrition</Link>
              </li>
              <li>
                <Link to="/health?category=fitness" className="hover:text-white transition-colors">Fitness</Link>
              </li>
              <li>
                <Link to="/health?category=mental-wellness" className="hover:text-white transition-colors">Mental Wellness</Link>
              </li>
              <li>
                <Link to="/health?category=healthy-lifestyle" className="hover:text-white transition-colors">Healthy Lifestyle</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get Latest Update */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold tracking-wide">Get Latest Update</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {settings.footerDescription || 'Subscribe to receive the latest evidence-based wellness insights and articles.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex bg-white rounded-md p-1 shadow-sm focus-within:ring-2 focus-within:ring-[#80C8C9]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  required
                  aria-label="Email address for newsletter"
                  className="w-full px-3 py-1.5 text-xs text-[#202324] bg-transparent focus:outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#80C8C9] hover:bg-[#62ADB0] text-[#1C1F21] px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Subscribe'}
                </button>
              </div>

              {message && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Medical disclaimer note */}
        <div className="pt-6 border-t border-gray-800/80 text-center">
          <p className="text-[11px] text-gray-500 max-w-[700px] mx-auto leading-relaxed mb-4">
            <strong>Medical Disclaimer:</strong> The information provided on this website is for general educational and informational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult a qualified physician or healthcare provider with any medical questions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
            <div>
              {settings.copyrightText || '© 2026 HealthInsight Blog. All rights reserved.'}
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:text-gray-300 transition-colors">
                Contact
              </Link>
              <Link to="/admin/login" className="hover:text-gray-400 text-gray-600 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
