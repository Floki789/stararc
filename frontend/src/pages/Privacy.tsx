import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';

const Privacy: React.FC = () => {
  const { t, language } = useLanguage();

  // Helper function to get array values from translations
  const getArray = (key: string): string[] => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return [];
      }
    }
    
    return Array.isArray(current) ? current : [];
  };

  const renderList = (items: string[]) => (
    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('privacy.subtitle')}
          </p>
        </div>

        {/* Privacy Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section1.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>1.1</strong> {t('privacy.section1.p1')}</p>
              <p className="ml-6 text-gray-400 text-sm">
                {t('privacy.section1.company')}, {t('privacy.section1.person')}, {t('privacy.section1.location')} • {t('privacy.section1.email')}
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section2.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>2.1</strong> {t('privacy.section2.p1')}</p>
              <p><strong>2.2</strong> {t('privacy.section2.p2')}</p>
              <p><strong>2.3</strong> {t('privacy.section2.p3')}</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section3.title')}
            </h2>
            <div className="space-y-6 text-gray-300">
              {/* Registration */}
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t('privacy.section3.registration.title')}
                </h3>
                <p className="mb-2"><strong>{t('privacy.section3.registration.intro')}</strong></p>
                {renderList(getArray('privacy.section3.registration.list'))}
                <p className="mt-4 text-blue-300">{t('privacy.section3.registration.encryption')}</p>
                <p className="mt-2 text-sm text-gray-400">{t('privacy.section3.registration.legal')}</p>
              </div>

              {/* Metadata */}
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t('privacy.section3.metadata.title')}
                </h3>
                <p className="mb-2"><strong>{t('privacy.section3.metadata.intro')}</strong></p>
                {renderList(getArray('privacy.section3.metadata.list'))}
                <p className="mt-2 text-sm text-gray-400">{t('privacy.section3.metadata.legal')}</p>
              </div>

              {/* Payment */}
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t('privacy.section3.payment.title')}
                </h3>
                <p className="mb-2"><strong>{t('privacy.section3.payment.intro')}</strong></p>
                {renderList(getArray('privacy.section3.payment.list'))}
                <p className="mt-2 text-sm text-gray-400">{t('privacy.section3.payment.legal')}</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section4.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>4.1</strong> {t('privacy.section4.p1')}</p>
              <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
                {renderList(getArray('privacy.section4.list'))}
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section5.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>5.1</strong> {t('privacy.section5.p1')}</p>
              <p><strong>5.2</strong> {t('privacy.section5.p2')}</p>
              <p><strong>5.3</strong> {t('privacy.section5.p3')}</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section6.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>6.1</strong> {t('privacy.section6.p1')}</p>
              <p><strong>6.2</strong> {t('privacy.section6.p2')}</p>
              <p><strong>6.3</strong> {t('privacy.section6.p3')}</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section7.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>7.1</strong> {t('privacy.section7.p1')}</p>
              <p><strong>7.2</strong> {t('privacy.section7.p2')}</p>
              <p><strong>7.3</strong> {t('privacy.section7.p3')}</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section8.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>8.1</strong> {t('privacy.section8.p1')}</p>
              <p><strong>8.2</strong> {t('privacy.section8.p2')}</p>
              <p><strong>8.3</strong> {t('privacy.section8.p3')}</p>
              <p><strong>8.4</strong> {t('privacy.section8.p4')}</p>
              <p><strong>8.5</strong> {t('privacy.section8.p5')}</p>
              <p><strong>8.6</strong> {t('privacy.section8.p6')}</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section9.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>9.1</strong> {t('privacy.section9.p1')}</p>
              <p><strong>9.2</strong> {t('privacy.section9.p2')}</p>
              <p><strong>9.3</strong> {t('privacy.section9.p3')}</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section10.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>10.1</strong> {t('privacy.section10.p1')}</p>
              <p><strong>10.2</strong> {t('privacy.section10.p2')}</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section11.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>11.1</strong> {t('privacy.section11.p1')}</p>
              <p><strong>11.2</strong> {t('privacy.section11.p2')}</p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section12.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>12.1</strong> {t('privacy.section12.p1')}</p>
              <p><strong>12.2</strong> {t('privacy.section12.p2')}</p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('privacy.section13.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>13.1</strong> {t('privacy.section13.p1')}</p>
              <p><strong>13.2</strong> {t('privacy.section13.p2')}</p>
            </div>
          </section>

        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm mb-2">
            {language === 'de' 
              ? 'Bei Fragen zu dieser Datenschutzerklärung:' 
              : 'Questions about this privacy policy:'}
          </p>
          <p className="text-gray-300 text-sm">
            <a href="mailto:info@stararc.one" className="text-blue-400 hover:text-blue-300 transition-colors">
              info@stararc.one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;