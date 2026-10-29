import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Read Firebase configuration from environment or project credentials provided
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3ZvmAy2UxJzxu3N9F-qUGYeYyo8LA0JE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "health-8b16d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "health-8b16d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "health-8b16d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "579836850687",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:579836850687:web:c032af3e6cb66d4291f7ca",
  measurementId: "G-5RJWD5RS9T"
};

// Check if Firebase is realistically configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your-api-key' &&
  !firebaseConfig.apiKey.includes('placeholder')
);

// Validate and sanitize administrator email
function getValidAdminEmail() {
  const envEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase().trim();
  // Ensure the env variable is a valid email, preventing accidental strings like measurement IDs (e.g. G-5RJWD5RS9T)
  if (envEmail && envEmail.includes('@') && envEmail.includes('.')) {
    return envEmail;
  }
  return 'gopalhitanga@gmail.com';
}

export const configuredAdminEmail = getValidAdminEmail();

// Allowlist of valid admin emails
export const allowedAdminEmails = Array.from(new Set([
  'gopalhitanga@gmail.com',
  configuredAdminEmail
].filter(Boolean).map(e => e.toLowerCase().trim())));

export function isAuthorizedAdminEmail(email) {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return allowedAdminEmails.includes(normalized) || normalized === 'gopalhitanga@gmail.com';
}

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize Firebase SDK:', error);
  }
}

export { app, auth, db, firebaseConfig };
