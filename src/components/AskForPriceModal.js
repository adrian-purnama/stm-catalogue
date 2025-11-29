'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { submitPriceInquiry } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function AskForPriceModal({ isOpen, onClose, catalogue, variant, cartItems }) {
  const { clearCart } = useCart();
  // Determine if this is a cart/bundle inquiry
  const isBundleInquiry = cartItems && cartItems.length > 0;
  
  // Load saved customer info from localStorage
  const loadSavedCustomerInfo = () => {
    try {
      const saved = localStorage.getItem('asb_customer_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          inquiryType: parsed.inquiryType || 'personal',
          name: parsed.name || '',
          companyName: parsed.companyName || '',
          gender: parsed.gender || 'Male',
          email: parsed.email || '',
          phone: parsed.phone || '',
          message: ''
        };
      }
    } catch (error) {
      console.error('Error loading saved customer info:', error);
    }
    return {
      inquiryType: 'personal',
      name: '',
      companyName: '',
      gender: 'Male',
      email: '',
      phone: '',
      message: ''
    };
  };

  const [inquiryType, setInquiryType] = useState('personal'); // 'personal' or 'company'
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    gender: 'Male',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load saved customer info when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedInfo = loadSavedCustomerInfo();
      setInquiryType(savedInfo.inquiryType);
      setFormData({
        name: savedInfo.name,
        companyName: savedInfo.companyName,
        gender: savedInfo.gender,
        email: savedInfo.email,
        phone: savedInfo.phone,
        message: ''
      });
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (inquiryType === 'company' && !formData.companyName.trim()) {
        throw new Error('Company name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.phone.trim()) {
        throw new Error('Phone is required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Character count validation
      const messageLength = formData.message.trim().length;
      if (messageLength > 100) {
        throw new Error('Message cannot exceed 100 characters');
      }

      // Prepare items array for bundle inquiry
      const items = isBundleInquiry
        ? cartItems.map(item => ({
            catalogueId: item.catalogueId,
            variantCombinationId: item.variant?.combinationId || null,
            quantity: item.quantity
          }))
        : [{
            catalogueId: catalogue?._id,
            variantCombinationId: variant?.combinationId || null,
            quantity: 1
          }];

      await submitPriceInquiry({
        items, // Array of items for bundle inquiry
        inquiryType,
        name: formData.name.trim(),
        companyName: inquiryType === 'company' ? formData.companyName.trim() : '',
        gender: formData.gender,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim()
      });

      // Save customer info to localStorage for future use
      try {
        const customerInfo = {
          inquiryType,
          name: formData.name.trim(),
          companyName: inquiryType === 'company' ? formData.companyName.trim() : '',
          gender: formData.gender,
          email: formData.email.trim(),
          phone: formData.phone.trim()
        };
        localStorage.setItem('asb_customer_info', JSON.stringify(customerInfo));
      } catch (error) {
        console.error('Error saving customer info:', error);
        // Continue even if saving fails
      }

      // Clear cart if it was a bundle inquiry
      if (isBundleInquiry) {
        clearCart();
      }

      setSuccess(true);
      // Reset form after 2 seconds and close
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (e) => {
    // Prevent event propagation to avoid triggering parent click handlers
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSuccess(false);
    setError('');
    // Don't clear form data, keep saved values for next time
    // Only clear the message field
    setFormData(prev => ({
      ...prev,
      message: ''
    }));
    // Call onClose with event to prevent propagation
    if (e) {
      onClose(e);
    } else {
      onClose();
    }
  };

  // Character counter (100 characters limit)
  const MAX_CHARS = 100;
  const charCount = formData.message.trim().length;
  const charsRemaining = MAX_CHARS - charCount;
  const isOverLimit = charCount > MAX_CHARS;

  if (!isOpen) return null;

  // Helper functions
  const getSizeLabel = (size) => {
    if (!size) return 'Unknown';
    const sizeTypeLabel = size.sizeType?.name || size.sizeType?.shortName || '';
    const sizeCustom = size.sizeCustom || '';
    return sizeTypeLabel + (sizeCustom ? ` - ${sizeCustom}` : '') || sizeCustom || 'Not specified';
  };

  const getChassisLabel = (ch) => {
    if (!ch) return 'Unknown';
    const chassisTypeLabel = ch.chassisType?.name || ch.chassisType?.shortName || '';
    const details = ch.chassisDetails && ch.chassisDetails.length > 0 ? ` (${ch.chassisDetails.join(', ')})` : '';
    return chassisTypeLabel + details || 'Not specified';
  };

  // Single item variant info
  const variantInfo = variant ? (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
      {variant.sizeData && (
        <p className="text-gray-700">
          <span className="font-medium">Size:</span> {getSizeLabel(variant.sizeData)}
        </p>
      )}
      {variant.chassisData && (
        <p className="text-gray-700">
          <span className="font-medium">Chassis:</span> {getChassisLabel(variant.chassisData)}
        </p>
      )}
      {variant.variantSelections && Object.keys(variant.variantSelections).length > 0 && (
        <div className="mt-2">
          {Object.entries(variant.variantSelections).map(([key, value]) => (
            <p key={key} className="text-gray-700">
              <span className="font-medium">{key}:</span> {value}
            </p>
          ))}
        </div>
      )}
    </div>
  ) : null;

  // Cart items list for bundle inquiry
  const cartItemsList = isBundleInquiry ? (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
      <p className="text-sm font-medium text-gray-700 mb-3">
        Items in inquiry ({cartItems.length}):
      </p>
      <div className="space-y-3">
        {cartItems.map((item, index) => (
          <div key={item.id} className="border-b border-gray-200 pb-2 last:border-0">
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">
                {index + 1}. {item.catalogue.bodyType?.name || 'Product'}
              </p>
              <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
            </div>
            {item.variant && (
              <div className="text-xs text-gray-600 space-y-0.5 ml-2">
                {item.variant.sizeData && (
                  <p>Size: {getSizeLabel(item.variant.sizeData)}</p>
                )}
                {item.variant.chassisData && (
                  <p>Chassis: {getChassisLabel(item.variant.chassisData)}</p>
                )}
                {item.variant.variantSelections && Object.keys(item.variant.variantSelections).length > 0 && (
                  <div>
                    {Object.entries(item.variant.variantSelections).map(([key, value]) => (
                      <p key={key}>{key}: {value}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!item.variant && (
              <div className="text-xs text-gray-600 ml-2 space-y-1">
                <p className="font-medium">Available Variant Options:</p>
                {item.catalogue.variantCategories && item.catalogue.variantCategories.length > 0 ? (
                  item.catalogue.variantCategories.map((cat, idx) => (
                    <p key={idx} className="ml-2">
                      <span className="font-medium">{cat.category}:</span> {cat.values?.join(', ') || 'N/A'}
                    </p>
                  ))
                ) : (
                  <p className="ml-2 italic">General product inquiry</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          handleClose(e);
        }
      }}
    >
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity -z-10"
      ></div>

      {/* Modal panel */}
      <div 
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
                {isBundleInquiry ? `Ask for Price (${cartItems.length} items)` : 'Ask for Price'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Inquiry Submitted!</h4>
                <p className="text-sm text-gray-600">We will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {isBundleInquiry ? cartItemsList : (
                  catalogue && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Product:</p>
                      <p className="text-sm text-gray-900">{catalogue.bodyType?.name || 'Product'}</p>
                      {variantInfo}
                    </div>
                  )
                )}

                {/* Inquiry Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is this for personal or company use?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="inquiryType"
                        value="personal"
                        checked={inquiryType === 'personal'}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="mr-2"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">Personal</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="inquiryType"
                        value="company"
                        checked={inquiryType === 'company'}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="mr-2"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">Company</span>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Company Name (only for company) */}
                {inquiryType === 'company' && (
                  <div className="mb-4">
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter company name"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Gender */}
                <div className="mb-4">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Message/Note */}
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message / Note (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                      isOverLimit ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your message or notes..."
                    rows="4"
                    disabled={loading}
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                      {isOverLimit ? 'Exceeds character limit' : 'Optional message to include with your inquiry'}
                    </p>
                    <p className={`text-xs font-medium ${isOverLimit ? 'text-red-600' : charCount > 80 ? 'text-yellow-600' : 'text-gray-500'}`}>
                      {charCount}/{MAX_CHARS} characters
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Inquiry'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
    </div>
  );
}

