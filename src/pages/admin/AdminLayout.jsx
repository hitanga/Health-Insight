import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Settings,
  BookOpen,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isFirebaseConfigured } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'All Posts', path: '/admin/posts', icon: FileText },
    { name: 'Add New Post', path: '/admin/posts/new', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    { name: 'Pages & Policies', path: '/admin/pages', icon: BookOpen },
    { name: 'Contact Messages', path: '/admin/messages', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F6] flex flex-col md:flex-row text-[#202324]">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1C1F21] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#80C8C9]" />
          <span className="font-semibold text-sm tracking-tight">Admin Console</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded hover:bg-gray-800 text-gray-300"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#1C1F21] text-gray-300 flex flex-col z-40 transition-transform duration-200 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand in Sidebar */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#80C8C9]/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#80C8C9]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                {settings.websiteName || 'HealthInsight'}
              </h2>
              <span className="text-[10px] text-gray-400 block -mt-0.5">Admin Dashboard</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#80C8C9] text-[#1C1F21] font-semibold'
                    : 'text-gray-400 hover:bg-gray-800/80 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Quick Actions
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded text-xs text-gray-400 hover:bg-gray-800/80 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>View Website</span>
            </span>
          </Link>
        </nav>

        {/* Admin User & Sign Out Footer */}
        <div className="p-3 border-t border-gray-800 bg-[#16181A]">
          <div className="px-3 py-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Logged in as</p>
            <p className="text-xs text-white truncate font-medium">
              {currentUser?.email || 'Administrator'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200/80 px-6 items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500">Workspace</span>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-semibold text-[#202324]">Content Management</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-black font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Site</span>
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#80C8C9]/30 text-[#1C1F21] text-[10px] font-bold flex items-center justify-center">
                A
              </div>
              <span className="text-xs text-gray-700 font-medium">{currentUser?.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
