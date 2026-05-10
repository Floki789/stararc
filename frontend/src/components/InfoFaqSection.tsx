import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface InfoFaqSectionProps {
  dayMode?: boolean;
}

const InfoFaqSection: React.FC<InfoFaqSectionProps> = ({ dayMode = false }) => {
  const { t } = useLanguage();

  const faqs = [
    { q: t('infoFaq.q1'), a: t('infoFaq.a1') },
    { q: t('infoFaq.q2'), a: t('infoFaq.a2') },
    { q: t('infoFaq.q3'), a: t('infoFaq.a3') },
    { q: t('infoFaq.q4'), a: t('infoFaq.a4') },
    { q: t('infoFaq.q5'), a: t('infoFaq.a5') },
    { q: t('infoFaq.q6'), a: t('infoFaq.a6') },
    { q: t('infoFaq.q7'), a: t('infoFaq.a7') },
    { q: t('infoFaq.q8'), a: t('infoFaq.a8') },
    { q: t('infoFaq.q9'), a: t('infoFaq.a9') },
    { q: t('infoFaq.q10'), a: t('infoFaq.a10') },
    { q: t('infoFaq.q11'), a: t('infoFaq.a11') },
    { q: t('infoFaq.q12'), a: t('infoFaq.a12') },
    { q: t('infoFaq.q13'), a: t('infoFaq.a13') },
  ];

  return (
    <section className={`transition-colors duration-700 ${dayMode ? 'bg-slate-50' : 'bg-[#020f0a]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className={`grid grid-cols-1 gap-px rounded-2xl overflow-hidden border ${dayMode ? 'border-slate-200' : 'border-slate-800/60'}`}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`px-8 py-8 sm:px-10 sm:py-10 ${
                dayMode ? 'bg-white' : 'bg-slate-900/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                  dayMode ? 'bg-sky-100 text-sky-600' : 'bg-sky-950/60 text-sky-400'
                }`}>
                  {i + 1}
                </span>
                <div>
                  <h3 className={`font-bold text-base sm:text-lg mb-3 leading-snug ${
                    dayMode ? 'text-slate-900' : 'text-white'
                  }`}>
                    {faq.q}
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                    dayMode ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoFaqSection;


