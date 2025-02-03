"use client"

import React, { useState } from 'react';
import { Search, MapPin, Loader2, Share2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import ShareModal from '@/components/share-modal';
import posthog from 'posthog-js';

function App() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputProduct, setInputProduct] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const locale = useLocale();

  const provinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Northwest Territories',
    'Nunavut',
    'Yukon'
  ];

  const handleLanguageChange = (newLang: string) => {
    router.push(`/${newLang}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let product = inputProduct;
      if (city && province) {
        product = `${product} in ${city}, ${province}`;
      } else if (city) {
        product = `${product} in ${city}`;
      } else if (province) {
        product = `${product} in ${province}`;
      }
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: product, locale: locale }),
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={inputProduct}
                onChange={(e) =>{
                  if (e.target.value.length > 100) {
                    return;
                  }
                  setInputProduct(e.target.value)
                }}
                placeholder={t('inputPlaceholder')}
                className="w-full text-black pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label htmlFor="city" className="block text-sm text-gray-500 mb-1">
                  {t('City')} <span className="text-gray-400">{t('(Optional)')}</span>
                </label>
                <input
                  type="text"
                  id="city"
                  className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  placeholder={t('Enter your city')}
                  onChange={(e) =>{
                    if (e.target.value.length > 50) {
                      return;
                    }
                    setCity(e.target.value)
                  }}
                  value={city}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="province" className="block text-sm text-gray-500 mb-1">
                  {t('Province')} <span className="text-gray-400">{t('(Optional)')}</span>
                </label>
                <select
                  id="province"
                  className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  onChange={(e) => setProvince(e.target.value)}
                  value={province}
                >
                  <option value="">{t('Select a province')}</option>
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputProduct}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-center flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed gap-2"
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
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('canadianAlternative')}
              </h2>
              <button
                onClick={() => {
                  setIsShareModalOpen(true);
                  posthog.capture('share_result', {
                    prompt: inputProduct
                  });
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
              >
                <Share2 className="h-5 w-5" />
                {t('share')}
              </button>
            </div>
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

        {/* Ko-fi Support Button */}
        <div className="mt-8 text-center">
          <a
            href="https://ko-fi.com/buhama"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200 shadow-sm"
          >
            <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi" className="h-5 w-5" />
            {t('Support this project')}
          </a>
        </div>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          prompt={inputProduct}
          result={result}
        />
      </div>
    </div>
  );
}

export default App;