import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, HeartPulse, Stethoscope, Mail, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function DisclaimerPage() {
  const { settings } = useSettings();
  const siteName = settings.websiteName || 'HealthInsight';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-[640px] mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Important Health & Clinical Notice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight mb-3">
          Medical{' '}
          <span className="relative inline-block">
            Disclaimer
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Please read this clinical notice carefully before utilizing any wellness protocols, dietary suggestions, or physical routines presented on {siteName}.
        </p>
      </div>

      {/* Emergency Alert Box */}
      <div className="bg-rose-50/90 border-2 border-rose-200 rounded-[6px] p-5 sm:p-6 mb-8 text-rose-900">
        <div className="flex items-start gap-3.5">
          <PhoneCall className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h2 className="font-bold text-rose-950 text-sm sm:text-base">
              Emergency Medical Situations
            </h2>
            <p className="leading-relaxed">
              If you believe you may have a medical emergency, call your local emergency services (such as <strong>911</strong> in the United States, <strong>112</strong> in Europe, or your local emergency dispatch) or proceed immediately to the nearest emergency room.
            </p>
            <p className="text-[11px] text-rose-700 pt-1">
              Never rely on electronic communications or articles on this website for urgent, acute, or life-threatening symptoms.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        {/* Section 1 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#80C8C9]" />
            1. No Medical Advice or Clinical Diagnosis
          </h2>
          <p className="mb-2">
            The content published on {siteName}—including articles, guides, infographics, audio, and reader newsletters—is prepared for general informational, educational, and journalistic purposes only.
          </p>
          <p>
            It is not intended to provide personalized medical diagnosis, prescribe pharmaceutical therapies, replace laboratory diagnostics, or serve as clinical advice. Individual health status, comorbidities, genetics, and medication interactions require personalized clinical evaluation from licensed physicians.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#80C8C9]" />
            2. No Doctor-Patient Relationship
          </h2>
          <p>
            Your access to or use of this website, including sending inquiries through our contact forms or commenting on articles, does not establish a doctor-patient, therapist-client, or other healthcare provider-patient relationship between you and {siteName}, its contributors, or editorial staff.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#80C8C9]" />
            3. Nutrition, Exercise, and Supplement Guidance
          </h2>
          <p className="mb-2">
            Articles discussing dietary strategies (such as intermittent fasting, micronutrient supplementation, or macronutrient balance) and fitness regimens reflect scientific literature reviews and generalized fitness concepts.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-600">
            <li><strong>Supplements:</strong> Dietary supplements are not evaluated or approved by the FDA in the same manner as pharmaceutical drugs. High dosages can interact dangerously with prescription drugs.</li>
            <li><strong>Physical Exercise:</strong> Starting a new exercise program involves physical risk. If you have cardiovascular conditions, joint disorders, or chronic fatigue, obtain medical clearance prior to exertion.</li>
            <li><strong>Pregnancy & Nursing:</strong> Individuals who are pregnant, planning to become pregnant, or nursing must exercise heightened caution and consult an obstetrician before altering diets or taking supplements.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            4. Scientific Evolution & Accuracy of Biomedical Information
          </h2>
          <p>
            Biomedical research and clinical guidelines evolve rapidly. While our editorial team makes every effort to reference current peer-reviewed research and factual evidence, we cannot guarantee that all articles will constantly reflect the newest emergent literature at all moments.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-base font-bold text-[#202324] mb-2">
            5. Independence & Absence of Endorsement
          </h2>
          <p>
            Reference to any specific commercial product, process, diagnostic tool, or service by trade name, trademark, or manufacturer does not constitute an endorsement, recommendation, or clinical sponsorship by {siteName}.
          </p>
        </section>

        {/* Section 6 */}
        <section className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <p>Have an editorial inquiry or spotted an inaccurate statement?</p>
            <p className="font-medium text-[#202324] mt-0.5">
              Contact our editorial team at {settings.contactEmail || 'contact@healthinsight.org'}
            </p>
          </div>
          <Link
            to="/contact"
            className="px-4 py-2 bg-[#202324] text-white rounded text-xs font-semibold hover:bg-black transition-colors self-start sm:self-auto shrink-0"
          >
            Submit Editorial Feedback
          </Link>
        </section>

      </div>
    </div>
  );
}
