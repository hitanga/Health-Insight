import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Read Firebase configuration from environment or project credentials provided
const firebaseConfig = {
    apiKey: "AIzaSyB3ZvmAy2UxJzxu3N9F-qUGYeYyo8LA0JE",
    authDomain: "health-8b16d.firebaseapp.com",
    projectId: "health-8b16d",
    storageBucket: "health-8b16d.firebasestorage.app",
    messagingSenderId: "579836850687",
    appId: "1:579836850687:web:c032af3e6cb66d4291f7ca",
    measurementId: "G-5RJWD5RS9T"
  };

// Check if Firebase is realistically configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your-api-key' &&
  !firebaseConfig.apiKey.includes('placeholder')
);

// Authorized administrator email (configured for gopalhitanga@gmail.com)
export const configuredAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'gopalhitanga@gmail.com').toLowerCase().trim();

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
