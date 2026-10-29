import React from 'react';
import { HeartPulse, ShieldCheck, BookOpen, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Title */}
      <div className="text-center max-w-[620px] mx-auto mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight mb-3">
          About{' '}
          <span className="relative inline-block">
            {settings.websiteName || 'HealthInsight'}
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {settings.tagline || 'Empowering readers with evidence-based wellness guidance and mindful habits.'}
        </p>
      </div>

      {/* Main Mission Card */}
      <div className="bg-white rounded-[6px] p-6 sm:p-10 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-8 mb-10">
        <section>
          <h2 className="text-xl font-bold text-[#202324] mb-3 tracking-tight">
            Our Mission
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {settings.aboutMission ||
              'HealthInsight is an independent digital health journal dedicated to translating nuanced biomedical research, nutrition science, and preventative habits into clear, actionable, and sustainable lifestyle practices.'}
          </p>
        </section>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#80C8C9]/20 flex items-center justify-center text-[#1C1F21]">
              <ShieldCheck className="w-5 h-5 text-[#2b7a78]" />
            </div>
            <h3 className="text-sm font-semibold text-[#202324]">Evidence-Informed</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We prioritize peer-reviewed research, physiological mechanisms, and clinical literature over fleeting marketing trends.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#80C8C9]/20 flex items-center justify-center text-[#1C1F21]">
              <HeartPulse className="w-5 h-5 text-[#2b7a78]" />
            </div>
            <h3 className="text-sm font-semibold text-[#202324]">Preventive Focus</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sustainable healthspan begins with daily foundational practices: restorative sleep, nutrient-dense nutrition, and regular movement.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#80C8C9]/20 flex items-center justify-center text-[#1C1F21]">
              <BookOpen className="w-5 h-5 text-[#2b7a78]" />
            </div>
            <h3 className="text-sm font-semibold text-[#202324]">Clarity & Accessibility</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We present complex physiological principles in lucid, respectful language that empowers readers of all backgrounds.
            </p>
          </div>
        </div>

        {/* Editorial Standards */}
        <section className="pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-[#202324] mb-3 tracking-tight">
            Editorial Standards & Integrity
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            {settings.aboutStandards ||
              'Every article published on HealthInsight undergoes rigorous fact-checking. We clearly cite primary sources and emphasize that individual biology is diverse.'}
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
            <li>Zero sensationalized promises or extreme pseudoscientific shortcuts.</li>
            <li>Transparent disclosure of research limitations and statistical confidence.</li>
            <li>Regular updates when scientific consensus or clinical standards evolve.</li>
          </ul>
        </section>

        {/* Educational Health Disclaimer */}
        <section className="bg-gray-50 rounded p-4 text-xs text-gray-600 leading-relaxed border-l-3 border-[#80C8C9]">
          <strong className="text-[#202324] block mb-1">Educational Platform Notice</strong>
          Content on this platform is published solely for educational and informational illumination. It must never substitute for direct diagnostic evaluation, clinical treatment, or individualized medical counseling from a licensed healthcare practitioner.
        </section>
      </div>

    </div>
  );
}
