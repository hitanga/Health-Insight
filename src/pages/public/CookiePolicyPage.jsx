import React from 'react';
import { Cookie, ShieldCheck, CheckCircle2, Lock, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function CookiePolicyPage() {
  const { settings } = useSettings();
  const siteName = settings.websiteName || 'HealthInsight';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-[620px] mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight mb-3">
          Cookie{' '}
          <span className="relative inline-block">
            Policy
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Learn how {siteName} handles browser cookies, local storage, and respects your privacy.
        </p>
        <p className="text-[11px] text-gray-400 mt-2">
          Last Updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        {/* Section 1 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-[#80C8C9]" />
            1. What Are Cookies & Local Storage?
          </h2>
          <p>
            Cookies are small text files stored on your computer or mobile device when you browse websites. Similar technologies include web storage (Local Storage and Session Storage) which allow web applications to maintain your login status, remember your theme preferences, and save form progress between visits.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#80C8C9]" />
            2. How We Use Cookies & Storage
          </h2>
          <p className="mb-3">
            At {siteName}, we believe in transparent, non-invasive digital practices. We do <strong>not</strong> use third-party cross-site advertising networks or behavioral tracking cookies.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-200 text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-800 font-semibold">
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Purpose</th>
                  <th className="p-2.5">Lifespan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                <tr>
                  <td className="p-2.5 font-medium text-gray-800">Essential Authentication</td>
                  <td className="p-2.5">Firebase Auth session tokens used to authenticate administrative editors securely.</td>
                  <td className="p-2.5">Session / Persistent until logout</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-gray-800">Local Content Cache</td>
                  <td className="p-2.5">Caches article categories and public settings to provide instantaneous page rendering.</td>
                  <td className="p-2.5">Persistent in browser storage</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-gray-800">UI State Preferences</td>
                  <td className="p-2.5">Remembers notification dismissals and reader interface preferences.</td>
                  <td className="p-2.5">30 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#80C8C9]" />
            3. How to Control Cookies in Your Browser
          </h2>
          <p className="mb-2">
            You can control or delete cookies through your browser settings. You can set most browsers to prevent any cookies from being stored. However, if you disable all cookies, certain features (like logging in to the admin dashboard) may not function as intended.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
            <li>Google Chrome: Settings &rarr; Privacy and Security &rarr; Cookies and other site data</li>
            <li>Mozilla Firefox: Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data</li>
            <li>Apple Safari: Preferences &rarr; Privacy &rarr; Manage Website Data</li>
            <li>Microsoft Edge: Settings &rarr; Cookies and site permissions</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <p>
            For further information on our data practices, review our{' '}
            <Link to="/privacy-policy" className="text-[#2b7a78] hover:underline font-semibold">Privacy Policy</Link>.
          </p>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-black transition-colors"
          >
            Have Questions? Contact Us
          </Link>
        </section>

      </div>
    </div>
  );
}
