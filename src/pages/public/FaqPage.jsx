import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, ShieldCheck, BookOpen, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const FAQ_ITEMS = [
  {
    category: 'About HealthInsight',
    questions: [
      {
        q: 'What is HealthInsight and who runs it?',
        a: 'HealthInsight is an independent digital health journal dedicated to translating nuanced biomedical research, nutrition science, and preventative habits into clear, actionable, and sustainable lifestyle practices for readers worldwide.'
      },
      {
        q: 'Are your articles written or reviewed by medical professionals?',
        a: 'Yes. Our editorial content is created and reviewed by healthcare writers, dietitians, exercise physiologists, and licensed clinicians who consult peer-reviewed biomedical literature (PubMed, JAMA, NEJM, Lancet) before publication.'
      },
      {
        q: 'Is HealthInsight affiliated with any pharmaceutical or supplement company?',
        a: 'No. We maintain strict editorial independence. We do not accept sponsorship or compensation from pharmaceutical brands, and we never endorse unverified health treatments or speculative miracle cures.'
      }
    ]
  },
  {
    category: 'Medical & Clinical Inquiries',
    questions: [
      {
        q: 'Can I ask for personal medical advice or symptom diagnosis?',
        a: 'No. For legal, clinical, and ethical reasons, we cannot provide individualized medical advice, diagnoses, or treatment plans. If you are experiencing symptoms or health concerns, please consult a licensed physician or healthcare provider.'
      },
      {
        q: 'What should I do in a medical emergency?',
        a: 'If you are experiencing acute, urgent, or life-threatening symptoms (such as sudden chest pressure, severe shortness of breath, or neurological deficits), immediately call emergency services (e.g. 911 or your local emergency number) or go to the nearest emergency department.'
      }
    ]
  },
  {
    category: 'Content, Categories & Newsletter',
    questions: [
      {
        q: 'How frequently are new articles published?',
        a: 'Our editorial team regularly publishes new peer-reviewed insights, preventive health updates, and nutrition breakdowns weekly. You can view all articles in our Health section or subscribe to our newsletter.'
      },
      {
        q: 'How can I filter articles by topic?',
        a: 'You can navigate to our Health page and click on specific topic pills such as Nutrition, Fitness, Mental Wellness, Heart Health, or Healthy Lifestyle, or use the search bar to find specific topics.'
      },
      {
        q: 'How do I subscribe or unsubscribe from your health newsletter?',
        a: 'You can subscribe using the newsletter input form in our footer. To unsubscribe, click the unsubscribe link in any newsletter email, or send us a message via our contact form.'
      }
    ]
  },
  {
    category: 'Contributing & Corrections',
    questions: [
      {
        q: 'Can I submit an article or write for HealthInsight?',
        a: 'Yes! We welcome contributions from credentialed physicians, dietitians, researchers, and experienced health journalists. Visit our "Write for Us" page or reach out through our contact form with your credentials and pitch.'
      },
      {
        q: 'How do I report a factual error or request a correction?',
        a: 'We hold ourselves to rigorous fact-checking standards. If you spot a factual or scientific error in any article, please email our editorial team via our Contact page with the article URL and relevant scientific citations.'
      }
    ]
  }
];

export default function FaqPage() {
  const { settings } = useSettings();
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      
      {/* Header */}
      <div className="text-center max-w-[620px] mx-auto mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202324] tracking-tight mb-3">
          Frequently Asked{' '}
          <span className="relative inline-block">
            Questions
            <span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#80C8C9] rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Find answers to common questions about our health publications, medical standards, editorial policies, and newsletter.
        </p>
      </div>

      {/* FAQ Categories & Accordions */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {FAQ_ITEMS.map((group, groupIdx) => (
          <div key={group.category} className="bg-white rounded-[6px] border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#80C8C9]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#202324]">
                {group.category}
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {group.questions.map((item, qIdx) => {
                const isOpen = !!openItems[`${groupIdx}-${qIdx}`];
                return (
                  <div key={item.q} className="p-4 sm:p-5 transition-colors">
                    <button
                      onClick={() => toggleItem(groupIdx, qIdx)}
                      className="w-full flex items-center justify-between text-left gap-4 font-semibold text-xs sm:text-sm text-[#202324] hover:text-[#2b7a78] cursor-pointer"
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in duration-150">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still Have Questions Box */}
        <div className="bg-[#202324] text-white rounded-[6px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-10">
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-1">Still have questions?</h3>
            <p className="text-xs text-gray-300">
              Our team is here to assist with editorial queries, citations, and general feedback.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-[#80C8C9] hover:bg-[#62ADB0] text-[#1C1F21] text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            Contact Our Team
          </Link>
        </div>
      </div>

    </div>
  );
}
