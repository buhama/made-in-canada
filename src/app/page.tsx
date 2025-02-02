"use client"

import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

function App() {
  const [inputProduct, setInputProduct] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: inputProduct }),
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
            Find Canadian Alternatives
          </h1>
          <p className="text-lg text-gray-600">
            Discover high-quality Canadian-made products as alternatives to your everyday items
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={inputProduct}
                onChange={(e) => setInputProduct(e.target.value)}
                placeholder="Enter a product (e.g., coffee, maple syrup)"
                className="w-full text-black pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputProduct}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-center  flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed  gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                'Find Alternative'
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Canadian Alternative
            </h2>
            <p className="text-gray-700">{result}</p>
            <p className="mt-4 text-sm text-gray-500 italic">
              Disclaimer: The suggestions provided are meant to serve as a starting point for your research. 
              Product availability, manufacturing locations, and company information may change over time. 
              We recommend verifying the current information directly with the manufacturers or retailers.
            </p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Why Choose Canadian?</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Support local businesses</li>
              <li>✓ Reduce carbon footprint</li>
              <li>✓ High quality standards</li>
              <li>✓ Create Canadian jobs</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Popular Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['Food & Beverage', 'Clothing', 'Home Goods', 'Beauty', 'Outdoor Gear'].map((category) => (
                <span key={category} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm">
                  {category}
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