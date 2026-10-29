import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, KeyRound, CheckCircle2, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { login, registerAdmin, configuredAdminEmail, isFirebaseConfigured, authError } = useAuth();
  const [email, setEmail] = useState(configuredAdminEmail || 'gopalhitanga@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (email.trim().toLowerCase() !== configuredAdminEmail) {
      setLocalError(`Unauthorized email. Only the administrator (${configuredAdminEmail}) can access the dashboard.`);
      return;
    }

    setLoading(true);
    try {
      if (isRegisterMode) {
        await registerAdmin(email, password);
        setLocalSuccess('Administrator account created successfully! Redirecting to Dashboard...');
      } else {
        await login(email, password);
        setLocalSuccess('Authenticated successfully! Redirecting...');
      }
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 400);
    } catch (err) {
      const msg = err.message || 'Authentication failed. Please verify credentials.';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center items-center px-4 py-12">
      
      {/* Return link */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#202324] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-[8px] border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-7 sm:p-8">
        
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#1C1F21] text-[#80C8C9] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#202324] tracking-tight">
            Admin Dashboard Authentication
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in with Firebase Authentication to create, edit, and delete blogs.
          </p>
        </div>

        {/* Tab Toggle: Sign In vs First-Time Admin Account Setup */}
        <div className="flex bg-gray-100 p-1 rounded-md mb-5 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setLocalError(null);
            }}
            className={`flex-1 py-1.5 rounded transition-all text-center cursor-pointer ${
              !isRegisterMode ? 'bg-white text-[#202324] shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In with Password
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setLocalError(null);
            }}
            className={`flex-1 py-1.5 rounded transition-all text-center cursor-pointer ${
              isRegisterMode ? 'bg-white text-[#202324] shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            First-Time Setup
          </button>
        </div>

        {/* Error Notification */}
        {(localError || authError) && (
          <div className="mb-5 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span>{localError || authError}</span>
              {(localError || authError)?.includes('Invalid email or password') && !isRegisterMode && (
                <div className="mt-2 pt-2 border-t border-rose-200">
                  <p className="text-[11px] text-rose-800 font-medium">
                    Haven't created your administrator password in Firebase yet?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setLocalError(null);
                    }}
                    className="text-[11px] font-bold text-[#202324] underline hover:text-black mt-1"
                  >
                    Click here to create your password now →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {localSuccess && (
          <div className="mb-5 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{localSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Authorized Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9]"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Must match authorized administrator: <strong className="text-gray-600">{configuredAdminEmail}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {isRegisterMode ? 'Choose a New Admin Password' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 pr-10 text-xs sm:text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#80C8C9] focus:ring-1 focus:ring-[#80C8C9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isRegisterMode && (
              <p className="text-[10px] text-gray-400 mt-1">
                Password must be at least 6 characters. This will set your login credentials in Firebase Auth.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded-[4px] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isRegisterMode ? 'Creating Account in Firebase...' : 'Authenticating...'}</span>
              </>
            ) : isRegisterMode ? (
              <>
                <UserPlus className="w-3.5 h-3.5 text-[#80C8C9]" />
                <span>Create Admin Account & Open Dashboard</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-[#80C8C9]" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Security & Access Notice */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
            Protected by Firebase Authentication. Only <strong>{configuredAdminEmail}</strong> is permitted to access administrative tools.
          </p>

          <div className="bg-gray-50 border border-gray-200/80 rounded p-2.5 text-left text-[11px] text-gray-600">
            <span className="font-semibold block text-[#202324] mb-0.5">Firebase Project:</span>
            <code className="text-[10px] text-gray-700">health-8b16d (Cloud Firestore & Auth Active)</code>
          </div>
        </div>

      </div>
    </div>
  );
}
