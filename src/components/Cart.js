'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import AskForPriceModal from './AskForPriceModal';
import ConfirmModal from './ConfirmModal';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);

  // Trigger animation when cart count increases
  useEffect(() => {
    if (cartCount > prevCartCount && prevCartCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    setPrevCartCount(cartCount);
  }, [cartCount, prevCartCount]);

  const handleAskForPrice = () => {
    if (cartItems.length === 0) return;
    setShowModal(true);
    setIsOpen(false);
  };

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

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 text-gray-700 hover:text-red-600 transition-colors ${
            isAnimating ? 'animate-bounce' : ''
          }`}
          aria-label="Shopping cart"
        >
          <ShoppingCart 
            className={`h-6 w-6 transition-transform duration-300 ${
              isAnimating ? 'scale-125' : ''
            }`} 
          />
          {cartCount > 0 && (
            <span 
              className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 ${
                isAnimating ? 'scale-125 animate-pulse' : ''
              }`}
            >
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        {/* Cart Dropdown */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Price Inquiry Cart ({cartItems.length})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Add products to request pricing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {item.catalogue.bodyType?.name || 'Product'}
                            </h4>
                            {item.variant && (
                              <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                                {item.variant.sizeData && (
                                  <p>Size: {getSizeLabel(item.variant.sizeData)}</p>
                                )}
                                {item.variant.chassisData && (
                                  <p>Chassis: {getChassisLabel(item.variant.chassisData)}</p>
                                )}
                                {item.variant.variantSelections && Object.keys(item.variant.variantSelections).length > 0 && (
                                  Object.entries(item.variant.variantSelections).map(([key, value]) => (
                                    <p key={key}>{key}: {value}</p>
                                  ))
                                )}
                              </div>
                            )}
                            {!item.variant && (
                              <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                                {item.catalogue.variantCategories && item.catalogue.variantCategories.length > 0 ? (
                                  <>
                                    <p className="font-medium">Available Options:</p>
                                    {item.catalogue.variantCategories.map((cat, idx) => (
                                      <p key={idx} className="ml-2">
                                        <span className="font-medium">{cat.category}:</span> {cat.values?.join(', ') || 'N/A'}
                                      </p>
                                    ))}
                                  </>
                                ) : (
                                  <p className="italic">General product inquiry</p>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 ml-2"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium text-gray-700 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={handleAskForPrice}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Ask for Price ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Ask for Price Modal for cart items */}
      {showModal && cartItems.length > 0 && (
        <AskForPriceModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          cartItems={cartItems}
          catalogue={null}
          variant={null}
        />
      )}

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => clearCart()}
        title="Clear Cart"
        message="Are you sure you want to clear all items from your cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </>
  );
}

