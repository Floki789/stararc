import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';

const Terms: React.FC = () => {
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
            {t('terms.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('terms.subtitle')}
          </p>
        </div>

        {/* Terms Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section1.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>1.1</strong> {t('terms.section1.p1')}</p>
              <p><strong>1.2</strong> {t('terms.section1.p2')}</p>
              <p><strong>1.3</strong> {t('terms.section1.p3')}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section2.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>2.1</strong> {t('terms.section2.p1')}</p>
              <p><strong>2.2</strong> {t('terms.section2.p2')}</p>
              {renderList(getArray('terms.section2.list1'))}
              <p><strong>2.3</strong> {t('terms.section2.p3')}</p>
              {renderList(getArray('terms.section2.list2'))}
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section5.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>5.1</strong> {t('terms.section5.p1')}</p>
              <p><strong>5.2</strong> {t('terms.section5.p2')}</p>
              <p><strong>5.3</strong> {t('terms.section5.p3')}</p>
              <p><strong>5.4</strong> {t('terms.section5.p4')}</p>
              <p><strong>5.5</strong> {t('terms.section5.p5')}</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section6.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>6.1</strong> {t('terms.section6.p1')}</p>
              <p><strong>6.2</strong> {t('terms.section6.p1b')}</p>
              <p><strong>6.3</strong> {t('terms.section6.p2')}</p>
              
              {/* Encrypted Data Categories */}
              <div className="ml-4 space-y-4">
                <div>
                  <p className="font-semibold text-white">{t('terms.section6.encryptedDataCategories.assets')}</p>
                  {renderList(getArray('terms.section6.encryptedDataCategories.assetsList'))}
                </div>
                <div>
                  <p className="font-semibold text-white">{t('terms.section6.encryptedDataCategories.budget')}</p>
                  {renderList(getArray('terms.section6.encryptedDataCategories.budgetList'))}
                </div>
                <div>
                  <p className="font-semibold text-white">{t('terms.section6.encryptedDataCategories.organization')}</p>
                  {renderList(getArray('terms.section6.encryptedDataCategories.organizationList'))}
                </div>
              </div>
              
              <p><strong>6.4</strong> {t('terms.section6.p3')}</p>
              <p><strong>6.5</strong> {t('terms.section6.p4')}</p>
              <p><strong>6.6</strong> {t('terms.section6.p5')}</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section7.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>7.1</strong> {t('terms.section7.p1')}</p>
              <p><strong>7.2</strong> {t('terms.section7.p2')}</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section8.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>8.1</strong> {t('terms.section8.p1')}</p>
              <p><strong>8.2</strong> {t('terms.section8.p2')}</p>
              <p><strong>8.3</strong> {t('terms.section8.p3')}</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section9.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>9.1</strong> {t('terms.section9.p1')}</p>
              <p><strong>9.2</strong> {t('terms.section9.p2')}</p>
              <p><strong>9.3</strong> {t('terms.section9.p3')}</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section10.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>10.1</strong> {t('terms.section10.p1')}</p>
              <p><strong>10.2</strong> {t('terms.section10.p2')}</p>
              <p><strong>10.3</strong> {t('terms.section10.p3')}</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section11.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>11.1</strong> {t('terms.section11.p1')}</p>
              <p><strong>11.2</strong> {t('terms.section11.p2')}</p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('terms.section12.title')}
            </h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>12.1</strong> {t('terms.section12.p1')}</p>
              <p><strong>12.2</strong> {t('terms.section12.p2')}</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;