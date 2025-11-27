'use client';

import { useState, useMemo } from 'react';
import CatalogueGrid from '@/components/CatalogueGrid';
import HeroSection from '@/components/HeroSection';
import { useSearchableCatalogues } from '@/components/SearchableCatalogueGrid';

export default function HomeClient({ initialCatalogues }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Separate featured and regular products
  const featuredProducts = useMemo(() => 
    (initialCatalogues || []).filter(cat => cat.featured === true),
    [initialCatalogues]
  );
  
  // Apply search to all catalogues
  const allFilteredCatalogues = useSearchableCatalogues(initialCatalogues, searchTerm);
  const featuredFilteredProducts = useSearchableCatalogues(featuredProducts, searchTerm);
  
  const handleSearch = (term) => {
    setSearchTerm(term.trim());
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection onSearch={handleSearch} searchTerm={searchTerm} />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Results Header */}
        {searchTerm && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Found {allFilteredCatalogues.length} {allFilteredCatalogues.length === 1 ? 'result' : 'results'} for "{searchTerm}"
                </p>
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}
        
        {/* Featured Products Section */}
        {!searchTerm && featuredFilteredProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <p className="mt-2 text-gray-600">Our most popular and recommended body types</p>
              </div>
            </div>
            <CatalogueGrid catalogues={featuredFilteredProducts} />
          </div>
        )}

        {/* All Products Section */}
        {allFilteredCatalogues && allFilteredCatalogues.length > 0 ? (
          <div>
            {!searchTerm && (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
                  <p className="mt-2 text-gray-600">Browse our complete collection</p>
                </div>
                <div className="text-sm text-gray-500">
                  {initialCatalogues?.length || 0} {initialCatalogues?.length === 1 ? 'product' : 'products'} available
                </div>
              </div>
            )}
            <CatalogueGrid catalogues={allFilteredCatalogues} />
          </div>
        ) : searchTerm ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search terms.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products available</h3>
            <p className="mt-2 text-gray-500">Check back later for new products.</p>
          </div>
        )}
      </div>
    </div>
  );
}

