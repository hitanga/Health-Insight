import React, { useState } from 'react';
import { Database, ShieldCheck, X, HelpCircle, Key, Server } from 'lucide-react';
import { isFirebaseConfigured, configuredAdminEmail } from '../../lib/firebase';

export default function FirebaseNotice() {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-[#1C1F21] text-gray-300 text-[11px] py-1.5 px-4 border-b border-gray-800 flex items-center justify-between">
        <div className="max-w-[940px] mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>
              {isFirebaseConfigured ? (
                <span>
                  <strong>Firebase Connected:</strong> Firestore & Authentication active.
                </span>
              ) : (
                <span>
                  <strong>Preview Mode:</strong> Running in local offline sandbox with seed articles.
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="text-[#80C8C9] hover:underline font-medium cursor-pointer"
            >
              Firebase Setup Guide
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-[6px] max-w-lg w-full p-6 shadow-xl border border-gray-200 text-xs text-gray-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-[#202324]">
                <Database className="w-5 h-5 text-[#80C8C9]" />
                <span>Firebase Architecture & Setup Guide</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="leading-relaxed">
              This blog is fully engineered with <strong>Firebase Authentication</strong> and <strong>Cloud Firestore</strong>. All CRUD operations (articles, categories, website branding, contact inquiries, and newsletter subscriptions) write directly to Firestore collections when environment variables are supplied.
            </p>

            <div className="bg-gray-50 p-3.5 rounded border border-gray-200 space-y-2">
              <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#2b7a78]" />
                <span>Required Environment Variables (.env):</span>
              </div>
              <pre className="font-mono text-[10px] bg-white p-2.5 rounded border border-gray-200 overflow-x-auto text-gray-800 leading-normal">
{`VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=${configuredAdminEmail}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-[#202324] mb-1">Administrator Authorization:</h4>
              <p className="text-gray-600 leading-relaxed">
                Only the email matching <code>VITE_ADMIN_EMAIL</code> can access administrative routes. Enforced in both frontend guards and <code>firestore.rules</code>.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 bg-[#202324] text-white rounded text-xs font-medium hover:bg-black"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
