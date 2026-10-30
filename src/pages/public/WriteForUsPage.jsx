import React from 'react';
import { PenTool, CheckCircle2, Award, BookOpen, Send, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function WriteForUsPage() {
  const { settings } = useSettings();
  const siteName = settings.websiteName || 'HealthInsight';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#80C8C9]/20 text-[#202324] mb-3">
          <PenTool className="w-3.5 h-3.5 text-[#2b7a78]" />
          <span>Contributor & Editorial Opportunities</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight mb-3">
          Write for{' '}
          <span className="relative inline-block">
            {siteName}
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Join our mission to demystify health science and empower readers with clear, evidence-based wellness insights.
        </p>
      </div>

      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-10 text-xs sm:text-sm text-gray-700 leading-relaxed max-w-4xl mx-auto">
        
        {/* Intro */}
        <section>
          <h2 className="text-xl font-bold text-[#202324] mb-3">
            Who We Are Looking For
          </h2>
          <p className="mb-4">
            We are always eager to collaborate with passionate subject-matter experts, clinicians, researchers, and seasoned science communicators who share our dedication to rigorous health journalism.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded border border-gray-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#80C8C9] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#202324]">Healthcare Professionals</h3>
                <p className="text-xs text-gray-500 mt-0.5">MDs, DOs, Nurse Practitioners, Clinical Pharmacists, and Physical Therapists with frontline clinical insight.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded border border-gray-100 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#80C8C9] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#202324]">Nutritionists & Dietitians</h3>
                <p className="text-xs text-gray-500 mt-0.5">Registered Dietitians (RD/RDN) and metabolic researchers passionate about nutritional biochemistry.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded border border-gray-100 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[#80C8C9] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#202324]">Science Communicators</h3>
                <p className="text-xs text-gray-500 mt-0.5">Health journalists who excel at translating complex peer-reviewed papers into engaging, respectful prose.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded border border-gray-100 flex items-start gap-3">
              <Users className="w-5 h-5 text-[#80C8C9] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#202324]">Fitness & Wellness Researchers</h3>
                <p className="text-xs text-gray-500 mt-0.5">Exercise physiologists, ergonomics specialists, and sleep hygiene researchers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Standards for Pitches */}
        <section className="pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-[#202324] mb-3">
            Our Publishing Criteria
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#80C8C9] shrink-0 mt-0.5" />
              <span><strong>100% Original Content:</strong> We do not publish syndicated, previously published, or AI-hallucinated drafts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#80C8C9] shrink-0 mt-0.5" />
              <span><strong>Robust Biomedical Citations:</strong> Claims must reference primary, peer-reviewed clinical studies (PubMed, JAMA, Lancet, NEJM).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#80C8C9] shrink-0 mt-0.5" />
              <span><strong>Actionable & Balanced Tone:</strong> We avoid alarmist headlines or false guarantees. Articles must present nuanced, practical steps.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#80C8C9] shrink-0 mt-0.5" />
              <span><strong>Conflict of Interest Disclosure:</strong> Contributors must disclose any financial ties, advisory positions, or affiliate interests.</span>
            </li>
          </ul>
        </section>

        {/* How to submit pitch */}
        <section className="bg-gray-50 rounded p-6 sm:p-8 border border-gray-100 text-center space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-[#202324]">
            Ready to Pitch an Article?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Please include your professional credentials, a short bio, 2–3 proposed article headlines, and links to your previous health writing samples.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#80C8C9]" />
              <span>Submit Contributor Pitch via Contact Form</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
