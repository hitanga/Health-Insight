import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import FirebaseNotice from './components/common/FirebaseNotice';

// Public Pages
import HomePage from './pages/public/HomePage';
import HealthPage from './pages/public/HealthPage';
import ArticleDetailPage from './pages/public/ArticleDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminPostEditorPage from './pages/admin/AdminPostEditorPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminPagesPage from './pages/admin/AdminPagesPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] text-[#202324]">
      <FirebaseNotice />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout and Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/health/:slug" element={<ArticleDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Console */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverviewPage />} />
              <Route path="posts" element={<AdminPostsPage />} />
              <Route path="posts/new" element={<AdminPostEditorPage />} />
              <Route path="posts/edit/:id" element={<AdminPostEditorPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="pages" element={<AdminPagesPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
