import React from 'react';
import { Shield, Lock, FileText, Mail } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-[580px] mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202324] tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500">
          Last updated: October 2026 • Effective Date: October 2026
        </p>
      </div>

      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-7 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#80C8C9]" />
            1. Overview & Commitment
          </h2>
          <p>
            {settings.websiteName || 'HealthInsight'} respects your privacy and is committed to protecting your personal data. We do not sell, rent, or trade your personal information to third-party data brokers or marketing agencies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#80C8C9]" />
            2. Information We Collect
          </h2>
          <p className="mb-2">We only collect data that you voluntarily provide to us:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-600">
            <li><strong>Newsletter Subscriptions:</strong> Your email address when you voluntarily subscribe to our publication updates.</li>
            <li><strong>Contact Submissions:</strong> Your name, email, subject, and message content when submitting questions via our contact form.</li>
            <li><strong>Technical Diagnostics:</strong> Standard non-identifying server response logs necessary to deliver web assets reliably.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            3. Cookies & Analytics
          </h2>
          <p>
            This website does not use invasive third-party cross-site advertising trackers or behavioral profiling cookies. Any local session storage utilized is strictly necessary for operational state management (such as user interface preferences and administrative session persistence).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            4. Third-Party Infrastructure (Firebase)
          </h2>
          <p>
            Our web application leverages Google Firebase (Cloud Firestore & Firebase Authentication) for hosting database records and managing encrypted administrative authentication. Data transmitted to Firebase is encrypted in transit using standard HTTPS/TLS and stored on secure enterprise cloud servers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            5. Data Retention & Security
          </h2>
          <p>
            We retain contact messages and newsletter records only for as long as necessary to fulfill editorial communication or until a reader requests removal. We implement Firestore Security Rules to prevent unauthorized public access to administrative data, contact entries, and subscriber rosters.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            6. Your Privacy Rights & Inquiries
          </h2>
          <p className="mb-2">
            You have the right to request access to any personal data we hold about you, request corrections, or request immediate deletion of your newsletter subscription or contact record.
          </p>
          <p className="flex items-center gap-1.5 font-medium text-[#202324]">
            <Mail className="w-3.5 h-3.5 text-[#80C8C9]" />
            Contact: {settings.contactEmail || 'contact@healthinsight.org'}
          </p>
        </section>

        <section className="pt-4 border-t border-gray-100 text-xs text-gray-500">
          <p>
            {settings.privacyPolicy ||
              'We may update this policy periodically to reflect operational, legal, or regulatory modifications. Updates will be reflected on this page with an updated timestamp.'}
          </p>
        </section>

      </div>
    </div>
  );
}
