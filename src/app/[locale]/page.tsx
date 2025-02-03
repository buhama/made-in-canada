"use client"

import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

function App() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputProduct, setInputProduct] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const locale = useLocale();

  const handleLanguageChange = (newLang: string) => {
    router.push(`/${newLang}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: inputProduct, locale: locale }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestion');
      }

      const data = await response.json();
      setResult(data.suggestion);
    } catch (error) {
      setResult('Sorry, there was an error getting your suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MapPin className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="mb-4 flex justify-end">
          <select
            value={locale}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-black text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <p className="text-sm text-gray-600 mb-3">
            {t('locationTip')}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={inputProduct}
                onChange={(e) => setInputProduct(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className="w-full text-black pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputProduct}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-center flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('searching')}
                </>
              ) : (
                t('findAlternative')
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('canadianAlternative')}
            </h2>
            <div className="text-gray-700 space-y-4" dangerouslySetInnerHTML={{ __html: result }} />
            <p className="mt-4 text-sm text-gray-500 italic">
              {t('disclaimer')}
            </p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-black">{t('whyChooseCanadian')}</h3>
            <ul className="space-y-2 text-gray-600">
              <li>{t('benefits.support')}</li>
              <li>{t('benefits.reduce')}</li>
              <li>{t('benefits.quality')}</li>
              <li>{t('benefits.jobs')}</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-black">{t('popularCategories')}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(t.raw('categories')).map((key) => (
                <span key={key} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm">
                  {t(`categories.${key}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;