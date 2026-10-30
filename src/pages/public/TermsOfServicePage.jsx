import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, FileText, Shield, HelpCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function TermsOfServicePage() {
  const { settings } = useSettings();
  const siteName = settings.websiteName || 'HealthInsight';
  const contactEmail = settings.contactEmail || 'contact@healthinsight.org';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-[620px] mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight mb-3">
          Terms of{' '}
          <span className="relative inline-block">
            Service
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Please review the following terms and conditions that govern your access to and use of {siteName}.
        </p>
        <p className="text-[11px] text-gray-400 mt-2">
          Effective Date: October 2026 • Last Updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        {/* Section 1 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#80C8C9]" />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using {siteName} (the &quot;Site&quot;), including reading articles, subscribing to newsletters, or submitting inquiries, you agree to be bound by these Terms of Service and our associated{' '}
            <Link to="/privacy-policy" className="text-[#2b7a78] hover:underline font-medium">Privacy Policy</Link> and{' '}
            <Link to="/disclaimer" className="text-[#2b7a78] hover:underline font-medium">Medical Disclaimer</Link>. If you do not agree to all terms and conditions, please discontinue use of this website immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-amber-50/70 rounded p-4 border-l-4 border-amber-400">
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            2. Educational Purpose & Medical Disclaimer
          </h2>
          <p className="text-gray-700">
            All text, graphics, images, and other materials on {siteName} are provided strictly for general educational and informational purposes. The content is <strong>not intended</strong> to be a substitute for professional medical advice, diagnosis, or clinical treatment.
          </p>
          <p className="text-gray-700 mt-2">
            Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read on this website.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#80C8C9]" />
            3. Intellectual Property Rights
          </h2>
          <p className="mb-2">
            Unless otherwise indicated, all original written editorial articles, logos, graphics, and layout designs on {siteName} are the intellectual property of {siteName} and its authors, protected under applicable international copyright and trademark laws.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-600">
            <li>You may view, download, and print individual pages for personal, non-commercial educational use.</li>
            <li>You may share short excerpts or summaries provided that clear attribution and a direct link back to the original article on {siteName} are included.</li>
            <li>You may not reproduce, republish, or syndicate full-length articles without prior written authorization.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#80C8C9]" />
            4. User Conduct & Acceptable Use
          </h2>
          <p className="mb-2">When interacting with our site, contact forms, or subscription services, you agree not to:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-600">
            <li>Submit false, misleading, fraudulent, or defamatory communications.</li>
            <li>Attempt to bypass security features, compromise administrative endpoints, or flood servers with automated requests.</li>
            <li>Impersonate any person, medical professional, or entity.</li>
            <li>Distribute unauthorized advertising, spam, or promotional material through our contact inquiries.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            5. Third-Party Links & External Resources
          </h2>
          <p>
            Articles on {siteName} may contain links to external scientific registries (such as PubMed, NCBI, and clinical journals) or third-party websites for reference purposes. We have no control over the content, privacy practices, or accuracy of third-party websites and assume no liability for them.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            6. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by applicable law, {siteName}, its authors, editors, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access to or inability to use this website, or reliance on any information provided herein.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            7. Modifications to the Terms
          </h2>
          <p>
            We reserve the right to modify or replace these Terms of Service at any time. When changes occur, the &quot;Last Updated&quot; timestamp at the top of this page will be revised. Your continued use of the website following any changes signifies your acceptance of the updated terms.
          </p>
        </section>

        {/* Section 8 */}
        <section className="pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#80C8C9]" />
            8. Contact & Legal Inquiries
          </h2>
          <p className="mb-2">
            If you have questions, feedback, or legal inquiries regarding these Terms of Service, please contact our editorial and administrative team:
          </p>
          <div className="bg-gray-50 rounded p-4 text-xs text-gray-700 space-y-1 border border-gray-100">
            <p><strong>Editorial & Legal Contact:</strong> {contactEmail}</p>
            {settings.contactAddress && <p><strong>Address:</strong> {settings.contactAddress}</p>}
            <p className="pt-1">
              You may also reach us directly via our <Link to="/contact" className="text-[#2b7a78] hover:underline font-semibold">Contact Page</Link>.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
