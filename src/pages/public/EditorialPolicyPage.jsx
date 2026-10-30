import React from 'react';
import { BookOpen, CheckCircle2, ShieldCheck, Search, Award, RefreshCw, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function EditorialPolicyPage() {
  const { settings } = useSettings();
  const siteName = settings.websiteName || 'HealthInsight';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-[620px] mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight mb-3">
          Editorial{' '}
          <span className="relative inline-block">
            Policy
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Our editorial guidelines, scientific fact-checking standards, and dedication to health journalistic integrity.
        </p>
      </div>

      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        {/* Section 1: Philosophy */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#80C8C9]" />
            1. Our Editorial Mission
          </h2>
          <p>
            At {siteName}, we believe that reliable, accessible health information is a fundamental right. In an era dominated by clickbait wellness trends and conflicting diet fads, our mission is to deliver evidence-informed, scientifically validated guidance that empowers readers to make proactive health decisions.
          </p>
        </section>

        {/* Section 2: Research & Primary Sourcing */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#80C8C9]" />
            2. Primary Sources & Research Standards
          </h2>
          <p className="mb-2">Every article published on our platform relies on authoritative medical references:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-600">
            <li><strong>Peer-Reviewed Journals:</strong> We prioritize studies indexed in PubMed, JAMA, The Lancet, NEJM, and nature-affiliated medical periodicals.</li>
            <li><strong>Systematic Reviews & Meta-Analyses:</strong> Priority is given to systematic reviews (e.g., Cochrane Library) over isolated preliminary rodent or in-vitro experiments.</li>
            <li><strong>Institutional Guidelines:</strong> We reference clinical standards from reputable organizations such as the WHO, CDC, American Heart Association (AHA), and NIH.</li>
          </ul>
        </section>

        {/* Section 3: Review Process */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#80C8C9]" />
            3. Fact-Checking & Review Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-gray-50 rounded border border-gray-100">
              <span className="text-xs font-bold text-[#202324] block mb-1">Step 1: Literature Review</span>
              <p className="text-[11px] text-gray-500">Writers research clinical trials, biological mechanisms, and consensus recommendations.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded border border-gray-100">
              <span className="text-xs font-bold text-[#202324] block mb-1">Step 2: Editorial Review</span>
              <p className="text-[11px] text-gray-500">Editors evaluate linguistic clarity, objectivity, absence of hyperbole, and citation accuracy.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded border border-gray-100">
              <span className="text-xs font-bold text-[#202324] block mb-1">Step 3: Verification & Updates</span>
              <p className="text-[11px] text-gray-500">Articles are checked regularly to ensure recommendations stay aligned with emerging medical updates.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Corrections & Retractions */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#80C8C9]" />
            4. Corrections & Updates Policy
          </h2>
          <p>
            When substantive factual inaccuracies or outdated medical guidance are identified, we update the article promptly with a clear correction note. Readers who notice potential inaccuracies are encouraged to contact our editorial board.
          </p>
        </section>

        {/* Section 5: Independence */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#80C8C9]" />
            5. Independence & Conflict of Interest
          </h2>
          <p>
            Our editorial judgment is completely independent of advertisers or commercial partners. We do not accept payment to promote unverified health supplements or pharmaceutical products. Any sponsored content, if ever present, is explicitly labeled.
          </p>
        </section>

        {/* Call to action */}
        <section className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <p>Interested in contributing as an author or medical reviewer?</p>
            <p className="font-medium text-[#202324] mt-0.5">Explore our guidelines for health professionals.</p>
          </div>
          <Link
            to="/write-for-us"
            className="px-4 py-2 bg-[#80C8C9] hover:bg-[#62ADB0] text-[#1C1F21] rounded text-xs font-semibold transition-colors self-start sm:self-auto shrink-0"
          >
            Write for HealthInsight
          </Link>
        </section>

      </div>
    </div>
  );
}
