import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Health', path: '/health' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <header className="w-full bg-[#F7F7F7] border-b border-gray-200/60 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {settings.logoImageUrl ? (
            <img
              src={settings.logoImageUrl}
              alt={settings.websiteName}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="h-8 max-w-[140px] object-contain"
            />
          ) : null}
          <div>
            <span className="font-semibold text-xl tracking-tight text-[#202324] group-hover:text-black transition-colors">
              {settings.textLogo || settings.websiteName || 'HealthInsight'}
            </span>
            {settings.tagline && (
              <span className="hidden md:block text-[11px] text-gray-500 font-normal tracking-wide -mt-0.5">
                {settings.tagline}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-black ${
                  isActive
                    ? 'text-[#202324] font-semibold border-b-2 border-[#80C8C9] pb-0.5'
                    : 'text-gray-600'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Admin Dashboard Navigation Button */}
          {isAdmin ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#202324] text-white hover:bg-black transition-all shadow-2xs group"
            >
              <Shield className="w-3.5 h-3.5 text-[#80C8C9]" />
              <span>Admin Dashboard</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Logged In" />
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-gray-300 text-[#202324] hover:bg-[#202324] hover:text-white hover:border-[#202324] transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#80C8C9]" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to={isAdmin ? '/admin' : '/admin/login'}
            className="p-1.5 rounded bg-gray-200 text-[#202324] flex items-center gap-1 text-xs font-medium px-2.5"
            title="Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5 text-[#2b7a78]" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-[#202324] hover:bg-gray-200 rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-5 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-[#202324] font-semibold text-[#80C8C9]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-gray-100">
              <Link
                to={isAdmin ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-semibold bg-[#202324] text-white"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#80C8C9]" />
                  {isAdmin ? 'Admin Dashboard' : 'Sign In to Dashboard'}
                </span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
