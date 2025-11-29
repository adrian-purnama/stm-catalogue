'use client';

import { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import AskForPriceModal from './AskForPriceModal';

export default function ProductFinder({ catalogue, variants }) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);

  const handleAddToCart = (variant) => {
    addToCart(catalogue, variant);
    const itemId = variant?.combinationId || `catalogue-${catalogue._id}`;
    setAddedItemId(itemId);
    setTimeout(() => setAddedItemId(null), 1000);
  };
  // Extract unique chassis options
  const chassisOptions = useMemo(() => {
    const chassisMap = new Map();
    variants.forEach(variant => {
      if (variant.chassisData) {
        // Create a unique key based on chassis type and details
        const chassisTypeId = variant.chassisData.chassisType?._id?.toString() || 'no-type';
        const details = variant.chassisData.chassisDetails && variant.chassisData.chassisDetails.length > 0
          ? variant.chassisData.chassisDetails.sort().join('|')
          : 'no-details';
        const chassisKey = `${chassisTypeId}_${details}`;
        
        const chassisTypeLabel = variant.chassisData.chassisType?.name || 
                                variant.chassisData.chassisType?.shortName || 
                                'Unknown';
        const detailsLabel = variant.chassisData.chassisDetails && variant.chassisData.chassisDetails.length > 0
          ? ` (${variant.chassisData.chassisDetails.join(', ')})`
          : '';
        const label = chassisTypeLabel + detailsLabel;
        
        if (!chassisMap.has(chassisKey)) {
          chassisMap.set(chassisKey, {
            id: chassisKey,
            label: label,
            chassisData: variant.chassisData
          });
        }
      }
    });
    return Array.from(chassisMap.values());
  }, [variants]);

  // Extract unique variant categories and values
  const variantOptions = useMemo(() => {
    const categoriesMap = new Map();
    variants.forEach(variant => {
      const variantSelections = variant.variantSelections || {};
      Object.entries(variantSelections).forEach(([category, value]) => {
        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, new Set());
        }
        categoriesMap.get(category).add(value);
      });
    });
    
    const result = {};
    categoriesMap.forEach((values, category) => {
      result[category] = Array.from(values).sort();
    });
    return result;
  }, [variants]);

  // State for selected filters (using arrays for serializable state)
  const [selectedChassis, setSelectedChassis] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Helper to check if chassis is selected
  const isChassisSelected = (chassisId) => selectedChassis.includes(chassisId);

  // Helper to check if variant is selected
  const isVariantSelected = (category, value) => {
    return selectedVariants[category]?.includes(value) || false;
  };

  // Toggle chassis selection
  const toggleChassis = (chassisId) => {
    setSelectedChassis(prev => {
      if (prev.includes(chassisId)) {
        return prev.filter(id => id !== chassisId);
      } else {
        return [...prev, chassisId];
      }
    });
  };

  // Toggle variant selection
  const toggleVariant = (category, value) => {
    setSelectedVariants(prev => {
      const newVariants = { ...prev };
      if (!newVariants[category]) {
        newVariants[category] = [];
      }
      
      const categoryValues = [...newVariants[category]];
      if (categoryValues.includes(value)) {
        newVariants[category] = categoryValues.filter(v => v !== value);
        if (newVariants[category].length === 0) {
          delete newVariants[category];
        }
      } else {
        newVariants[category] = [...categoryValues, value];
      }
      
      return { ...newVariants };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedChassis([]);
    setSelectedVariants({});
  };

  // Filter variants based on selections
  const filteredVariants = useMemo(() => {
    if (selectedChassis.length === 0 && Object.keys(selectedVariants).length === 0) {
      return variants;
    }

    return variants.filter(variant => {
      // Check chassis filter
      if (selectedChassis.length > 0) {
        const chassisTypeId = variant.chassisData?.chassisType?._id?.toString() || 'no-type';
        const details = variant.chassisData?.chassisDetails && variant.chassisData.chassisDetails.length > 0
          ? variant.chassisData.chassisDetails.sort().join('|')
          : 'no-details';
        const variantChassisKey = `${chassisTypeId}_${details}`;
        
        if (!selectedChassis.includes(variantChassisKey)) {
          return false;
        }
      }

      // Check variant filters
      if (Object.keys(selectedVariants).length > 0) {
        const variantSelections = variant.variantSelections || {};
        for (const [category, selectedValues] of Object.entries(selectedVariants)) {
          const variantValue = variantSelections[category];
          if (!variantValue || !selectedValues.includes(variantValue)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [variants, selectedChassis, selectedVariants]);

  // Helper to get size label
  const getSizeLabel = (size) => {
    if (!size) return 'Unknown';
    const sizeTypeLabel = size.sizeType?.name || size.sizeType?.shortName || '';
    const sizeCustom = size.sizeCustom || '';
    return sizeTypeLabel + (sizeCustom ? ` - ${sizeCustom}` : '') || sizeCustom || 'Not specified';
  };

  // Helper to get chassis label
  const getChassisLabel = (ch) => {
    if (!ch) return 'Unknown';
    const chassisTypeLabel = ch.chassisType?.name || ch.chassisType?.shortName || '';
    const details = ch.chassisDetails && ch.chassisDetails.length > 0 ? ` (${ch.chassisDetails.join(', ')})` : '';
    return chassisTypeLabel + details || 'Not specified';
  };

  // Helper to format price
  const formatPrice = (price) => {
    return price === 'ask' ? 'Ask for Price' : price;
  };

  const hasActiveFilters = selectedChassis.length > 0 || Object.keys(selectedVariants).length > 0;

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Finder</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chassis Filter */}
          {chassisOptions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Available Chassis</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {chassisOptions.map((chassis) => (
                  <label
                    key={chassis.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isChassisSelected(chassis.id)}
                      onChange={() => toggleChassis(chassis.id)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{chassis.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Variant Filters */}
          {Object.keys(variantOptions).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Variants</h4>
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {Object.entries(variantOptions).map(([category, values]) => (
                  <div key={category}>
                    <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase">{category}</h5>
                    <div className="space-y-2">
                      {values.map((value) => {
                        const variantKey = `${category}-${value}`;
                        return (
                          <label
                            key={variantKey}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={isVariantSelected(category, value)}
                              onChange={() => toggleVariant(category, value)}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">{value}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredVariants.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{variants.length}</span> configurations
          </p>
        </div>
      </div>

      {/* Filtered Results Table */}
      {filteredVariants.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Available Configurations</h2>
          </div>
          <div className="overflow-x-auto relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chassis</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVariants.map((variant, index) => {
                  const sizeLabel = getSizeLabel(variant.sizeData);
                  const chassisLabel = getChassisLabel(variant.chassisData);
                  const variantSelections = variant.variantSelections || {};
                  const variantEntries = Object.entries(variantSelections);
                  
                  return (
                    <tr key={variant.combinationId || index} className="group hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sizeLabel}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {chassisLabel}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {variantEntries.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {variantEntries.map(([key, value]) => (
                              <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">No variants</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(variant.price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {variant.baseModel && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Base Model
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center sticky right-0 bg-white group-hover:bg-gray-50 z-10">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(variant);
                            }}
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                              addedItemId === (variant?.combinationId || `catalogue-${catalogue._id}`)
                                ? 'bg-green-500 text-white scale-110'
                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                            }`}
                            title="Add to cart"
                          >
                            <ShoppingCart 
                              className={`h-3 w-3 mr-1 transition-transform duration-300 ${
                                addedItemId === (variant?.combinationId || `catalogue-${catalogue._id}`)
                                  ? 'rotate-12 scale-125'
                                  : ''
                              }`} 
                            />
                            <span className="hidden sm:inline">{addedItemId === (variant?.combinationId || `catalogue-${catalogue._id}`) ? 'Added!' : 'Add'}</span>
                            <span className="sm:hidden">{addedItemId === (variant?.combinationId || `catalogue-${catalogue._id}`) ? '✓' : '+'}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariant(variant);
                              setShowPriceModal(true);
                            }}
                            className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                          >
                            <span className="hidden sm:inline">Ask for Price</span>
                            <span className="sm:hidden">Price</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">No configurations match your selected filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters to see all configurations
          </button>
        </div>
      )}

      {/* Ask for Price Modal */}
      <AskForPriceModal
        isOpen={showPriceModal}
        onClose={() => {
          setShowPriceModal(false);
          setSelectedVariant(null);
        }}
        catalogue={catalogue}
        variant={selectedVariant}
      />
    </div>
  );
}

