'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import AskForPriceModal from './AskForPriceModal';

export default function CatalogueCard({ catalogue }) {
  const { addToCart } = useCart();
  // Find the first available price that is not 'ask'
  // Check all items in shopCatalogue to find one with an actual price
  const shopCatalogue = catalogue.shopCatalogue || [];
  
  // Helper to check if a price is valid (not 'ask' and not empty)
  const isValidPrice = (price) => {
    if (!price) return false;
    const priceStr = String(price).trim().toLowerCase();
    return priceStr !== 'ask' && priceStr !== 'ask for price' && priceStr !== '';
  };
  
  // Find first item with a valid price
  const firstPriceItem = shopCatalogue.find(item => item && isValidPrice(item.price));
  const price = firstPriceItem?.price || 'Ask for Price';
  const frontImage = catalogue.frontImage;
  const [imageError, setImageError] = useState(false);
  const isFeatured = catalogue.featured === true;
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    // Pass the full catalogue object (including variantCategories) and null variant
    addToCart(catalogue, null);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };
  
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
  const [showPriceModal, setShowPriceModal] = useState(false);
  
  return (
    <>
      <Link 
        href={`/product/${catalogue._id}`} 
        className="group h-full flex"
        onClick={(e) => {
          // Prevent navigation if modal is open
          if (showPriceModal) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }}
        style={{ pointerEvents: showPriceModal ? 'none' : 'auto' }}
      >
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300 flex flex-col w-full">
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
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
              {catalogue.bodyType?.name || 'Unknown Body Type'}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2 min-h-10 flex-grow">
              {articlePreview}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col mb-3">
                <span className="text-xs text-gray-500">Starting from</span>
                <span className="text-base font-semibold text-gray-900">
                  {price}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 flex items-center gap-1 ${
                    addedToCart
                      ? 'bg-green-500 text-white scale-110 shadow-lg'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Add to cart"
                >
                  <ShoppingCart 
                    className={`h-3 w-3 transition-transform duration-300 ${
                      addedToCart ? 'rotate-12 scale-125' : ''
                    }`} 
                  />
                  {addedToCart ? 'Added!' : 'Add'}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPriceModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ask for Price
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Ask for Price Modal - Outside Link to prevent navigation issues */}
      <AskForPriceModal
        isOpen={showPriceModal}
        onClose={(e) => {
          // Prevent any event propagation that might trigger navigation
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setShowPriceModal(false);
        }}
        catalogue={catalogue}
        variant={null}
      />
    </>
  );
}
