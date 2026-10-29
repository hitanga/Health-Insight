import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Copy, Check, ExternalLink, Lock } from 'lucide-react';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for blog posts; authenticated admin can create, edit, delete
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /contactMessages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /newsletterSubscribers/{subscriberId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}`;

export default function AdBlockNotice() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Probe firestore endpoint for Brave Shields / AdBlock detection
    fetch('https://firestore.googleapis.com', { mode: 'no-cors' })
      .then(() => setIsBlocked(false))
      .catch(() => setIsBlocked(true));

    // 2. Check if Firestore security rules are currently rejecting public read with permission-denied
    if (isFirebaseConfigured && db) {
      const testCol = collection(db, 'posts');
      const q = query(testCol, limit(1));
      getDocs(q)
        .then(() => {
          setIsPermissionDenied(false);
        })
        .catch((err) => {
          if (err.code === 'permission-denied' || String(err).includes('insufficient permissions')) {
            setIsPermissionDenied(true);
          } else if (String(err).includes('offline') || String(err).includes('net::ERR_BLOCKED_BY_CLIENT')) {
            setIsBlocked(true);
          }
        });
    }
  }, []);

  const handleCopyRules = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (dismissed || (!isBlocked && !isPermissionDenied)) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6 animate-in fade-in duration-200">
      {/* Banner 1: Brave Shields / AdBlocker detected */}
      {isBlocked && (
        <div className="bg-amber-50 border border-amber-300 rounded-[6px] p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-200/60 flex items-center justify-center shrink-0 text-amber-800">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-xs text-amber-900 space-y-1.5">
                <h4 className="font-bold text-sm text-amber-950">
                  Brave Shields / Ad-Blocker Detected (net::ERR_BLOCKED_BY_CLIENT)
                </h4>
                <p className="leading-relaxed text-amber-800">
                  Your browser (e.g. Brave) is blocking outgoing network requests to <code>firestore.googleapis.com</code>.
                </p>
                <div className="bg-white/80 p-2.5 rounded border border-amber-200 text-amber-900">
                  <span className="font-semibold block mb-0.5">Quick Fix (3 seconds):</span>
                  <span>Click the <strong>orange Lion shield icon</strong> in your browser address bar &rarr; Toggle <strong>Shields DOWN</strong> for this site &rarr; Refresh.</span>
                </div>
                <p className="text-[11px] text-amber-700 italic">
                  Note: All articles you create are safely preserved and visible on your site via local storage cache while offline!
                </p>
              </div>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="text-amber-700 hover:text-amber-950 p-1 cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Banner 2: Firestore Security Rules Locked (permission-denied) */}
      {isPermissionDenied && (
        <div className="bg-sky-50 border border-sky-300 rounded-[6px] p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-200/60 flex items-center justify-center shrink-0 text-sky-800">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs text-sky-950 space-y-2">
                <div>
                  <h4 className="font-bold text-sm text-sky-950">
                    Firestore Database Rules Need 1-Click Publishing
                  </h4>
                  <p className="leading-relaxed text-sky-800 mt-0.5">
                    Your Firebase project (<code>health-8b16d</code>) is currently blocking public reads and writes with <em>permission-denied</em>. Update the Rules in your Firebase Console so blog posts sync to your Cloud Firestore:
                  </p>
                </div>

                <div className="bg-white p-3 rounded border border-sky-200 text-sky-950 space-y-2">
                  <ol className="list-decimal list-inside space-y-1 text-xs text-sky-900">
                    <li>
                      Go to <a href="https://console.firebase.google.com/project/health-8b16d/firestore/rules" target="_blank" rel="noreferrer" className="underline font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-0.5">Firebase Console &gt; Firestore &gt; Rules <ExternalLink className="w-3 h-3" /></a>
                    </li>
                    <li>
                      Replace the existing rules with the code below and click <strong>Publish</strong>:
                    </li>
                  </ol>

                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-2.5 rounded text-[11px] font-mono overflow-x-auto max-h-36">
                      {FIRESTORE_RULES_SNIPPET}
                    </pre>
                    <button
                      type="button"
                      onClick={handleCopyRules}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Rules'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="text-sky-700 hover:text-sky-950 p-1 cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
