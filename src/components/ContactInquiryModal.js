'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Mail } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ContactInquiryModal({ isOpen, onClose }) {
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

  // Load saved customer info from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('asb_customer_info');
        if (saved) {
          const parsed = JSON.parse(saved);
          setInquiryType(parsed.inquiryType || 'personal');
          setFormData({
            name: parsed.name || '',
            companyName: parsed.companyName || '',
            gender: parsed.gender || 'Male',
            email: parsed.email || '',
            phone: parsed.phone || '',
            message: '' // Don't restore message
          });
        }
      } catch (error) {
        console.error('Error loading saved customer info:', error);
      }
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
      if (messageLength > 500) {
        throw new Error('Message cannot exceed 500 characters');
      }
      if (messageLength === 0) {
        throw new Error('Please enter your message');
      }

      // Send inquiry to backend
      const res = await fetch(`${API_URL}/companies/contact-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiryType,
          name: formData.name.trim(),
          companyName: inquiryType === 'company' ? formData.companyName.trim() : '',
          gender: formData.gender,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim()
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to send inquiry. Please try again.');
      }

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
      }

      setSuccess(true);
      // Reset form after 2 seconds and close
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    // Don't clear form data, keep saved values for next time
    // Only clear the message field
    setFormData(prev => ({
      ...prev,
      message: ''
    }));
    onClose();
  };

  // Character counter (500 characters limit)
  const MAX_CHARS = 500;
  const charCount = formData.message.trim().length;
  const charsRemaining = MAX_CHARS - charCount;
  const isOverLimit = charCount > MAX_CHARS;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50 transition-opacity -z-10" />

      {/* Modal panel */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
                Contact Us
              </h3>
            </div>
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
              <h4 className="text-lg font-medium text-gray-900 mb-2">Message Sent!</h4>
              <p className="text-sm text-gray-600">We will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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

              {/* Message */}
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                    isOverLimit ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your message or inquiry..."
                  rows="5"
                  required
                  disabled={loading}
                  maxLength={MAX_CHARS}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                    {isOverLimit ? 'Exceeds character limit' : 'Required - please describe your inquiry'}
                  </p>
                  <p className={`text-xs font-medium ${isOverLimit ? 'text-red-600' : charCount > MAX_CHARS * 0.8 ? 'text-yellow-600' : 'text-gray-500'}`}>
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
                    <>
                      <Mail className="h-4 w-4" />
                      Send Message
                    </>
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

