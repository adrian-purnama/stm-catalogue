'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CatalogueCard({ catalogue }) {
  // Find the first available price
  const firstPrice = catalogue.shopCatalogue?.[0];
  const price = firstPrice ? firstPrice.price : 'Ask for Price';
  const frontImage = catalogue.frontImage;
  const [imageError, setImageError] = useState(false);
  const isFeatured = catalogue.featured === true;
  
  // Safely extract text from HTML for preview
  const getTextPreview = (html) => {
    if (!html) return 'No description available';
    // Remove HTML tags and get plain text
    const text = html.replace(/<[^>]*>/g, '').trim();
    if (text.length === 0) return 'No description available';
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };
  
  const articlePreview = catalogue.article ? getTextPreview(catalogue.article) : 'No description available';
  const showPlaceholder = !frontImage || imageError;
  
  return (
    <Link href={`/product/${catalogue._id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300">
        <div className="bg-gray-200 relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {!showPlaceholder && (
            <img
              src={frontImage}
              alt={catalogue.bodyType?.name || 'Product image'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          )}
          {showPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
            {catalogue.bodyType?.name || 'Unknown Body Type'}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2 min-h-10">
            {articlePreview}
          </p>
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Starting from</span>
              <span className="text-base font-semibold text-gray-900">
                {price === 'ask' ? 'Ask for Price' : price}
              </span>
            </div>
            <div className="text-red-600 group-hover:text-red-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
