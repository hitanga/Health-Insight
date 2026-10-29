import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, isFirebaseConfigured, configuredAdminEmail, isAuthorizedAdminEmail } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check demo session from localStorage if Firebase not configured
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const userEmail = (user.email || '').toLowerCase().trim();
          const authorized = isAuthorizedAdminEmail(userEmail);
          setCurrentUser(user);
          setIsAdmin(authorized);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Offline / Demo mode check
      const savedDemoAuth = localStorage.getItem('healthinsight_demo_admin');
      if (savedDemoAuth) {
        try {
          const parsed = JSON.parse(savedDemoAuth);
          setCurrentUser(parsed);
          setIsAdmin(true);
        } catch {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    const normalizedEmail = email.toLowerCase().trim();

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        const userEmail = (cred.user.email || '').toLowerCase().trim();
        
        if (!isAuthorizedAdminEmail(userEmail)) {
          await fbSignOut(auth);
          throw new Error(`Unauthorized: ${userEmail} is not configured as the system administrator.`);
        }
        
        setCurrentUser(cred.user);
        setIsAdmin(true);
        return { success: true };
      } catch (err) {
        let message = 'Failed to sign in. Please verify your credentials.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          message = 'Invalid email or password. Please verify your administrator credentials.';
        } else if (err.code === 'auth/too-many-requests') {
          message = 'Access temporarily locked due to many failed attempts. Try again later or reset password.';
        } else if (err.message) {
          message = err.message;
        }
        setAuthError(message);
        throw new Error(message);
      }
    } else {
      // Local demo login
      if (isAuthorizedAdminEmail(normalizedEmail) && password.length >= 6) {
        const mockUser = {
          email: normalizedEmail,
          uid: 'demo-admin-uid-12345',
          displayName: 'Admin User'
        };
        localStorage.setItem('healthinsight_demo_admin', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        setIsAdmin(true);
        return { success: true };
      } else if (!isAuthorizedAdminEmail(normalizedEmail)) {
        const msg = `Email must match the administrator email: ${configuredAdminEmail}`;
        setAuthError(msg);
        throw new Error(msg);
      } else {
        const msg = 'Password must be at least 6 characters.';
        setAuthError(msg);
        throw new Error(msg);
      }
    }
  };

  const registerAdmin = async (email, password) => {
    setAuthError(null);
    const normalizedEmail = email.toLowerCase().trim();

    if (!isAuthorizedAdminEmail(normalizedEmail)) {
      const msg = `Only the configured administrator email (${configuredAdminEmail}) can be registered.`;
      setAuthError(msg);
      throw new Error(msg);
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setAuthError(msg);
      throw new Error(msg);
    }

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        setCurrentUser(cred.user);
        setIsAdmin(true);
        return { success: true };
      } catch (err) {
        let message = 'Failed to create administrator account.';
        if (err.code === 'auth/email-already-in-use') {
          message = 'Account already exists in Firebase. Please sign in with your password.';
        } else if (err.code === 'auth/weak-password') {
          message = 'Password should be at least 6 characters.';
        } else if (err.message) {
          message = err.message;
        }
        setAuthError(message);
        throw new Error(message);
      }
    } else {
      return login(email, password);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    } else {
      localStorage.removeItem('healthinsight_demo_admin');
    }
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email) => {
    if (isFirebaseConfigured && auth) {
      return sendPasswordResetEmail(auth, email);
    } else {
      return Promise.resolve();
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    authError,
    login,
    registerAdmin,
    logout,
    resetPassword,
    isFirebaseConfigured,
    configuredAdminEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
