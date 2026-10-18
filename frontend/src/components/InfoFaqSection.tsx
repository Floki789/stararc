import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface InfoFaqSectionProps {
  dayMode?: boolean;
}

const renderAnswer = (text: string, dayMode: boolean) => {
  const parts = text.split(/({{hl}}[\s\S]*?{{\/hl}})/);
  return parts.map((part, i) => {
    if (part.startsWith('{{hl}}')) {
      const inner = part.slice(6, -7);
      return (
        <mark
          key={i}
          className={`rounded-sm px-0.5 not-italic font-medium ${
            dayMode
              ? 'bg-yellow-200 text-slate-900'
              : 'bg-yellow-400/25 text-yellow-100'
          }`}
        >
          {inner}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

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
    { q: t('infoFaq.q14'), a: t('infoFaq.a14') },
    { q: t('infoFaq.q15'), a: t('infoFaq.a15') },
  ];

  return (
    <section className={`transition-colors duration-700 font-mono ${dayMode ? 'bg-slate-50' : 'bg-[#020f0a]'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
        <div className={`rounded-lg border overflow-hidden shadow-2xl ${
          dayMode ? 'bg-white border-slate-300' : 'bg-[#0d1117] border-slate-700'
        }`}>
          {/* Terminal title bar */}
          <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${dayMode ? 'bg-slate-100 border-slate-300' : 'bg-[#161b22] border-slate-700'}`}>
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className={`ml-3 text-xs ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>user@stararc:~$ cat faq.log</span>
          </div>

          {/* Terminal body */}
          <div className="divide-y divide-dashed">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`px-6 py-5 sm:px-10 sm:py-6 ${dayMode ? 'divide-slate-200' : 'divide-slate-800'}`}
              >
                <p className={`text-sm mb-2 ${dayMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  <span className={dayMode ? 'text-slate-500' : 'text-slate-500'}>$</span> {faq.q}
                </p>
                <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line pl-4 border-l ${
                  dayMode ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-slate-700'
                }`}>
                  {renderAnswer(faq.a, dayMode)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoFaqSection;


