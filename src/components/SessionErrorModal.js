'use client';

import { useEffect } from 'react';
import { XCircle, AlertTriangle, Key } from 'lucide-react';

export default function SessionErrorModal({ isOpen, onClose, errorMessage }) {
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

  if (!isOpen) return null;

  // Determine error type and icon
  const isExpired = errorMessage?.toLowerCase().includes('expired');
  const isInvalid = errorMessage?.toLowerCase().includes('invalid');
  const isMissing = errorMessage?.toLowerCase().includes('required') || errorMessage?.toLowerCase().includes('missing');

  const getErrorTitle = () => {
    if (isExpired) return 'Session Expired';
    if (isInvalid) return 'Invalid Session';
    if (isMissing) return 'Session Required';
    return 'Access Denied';
  };

  const getErrorDescription = () => {
    if (isExpired) {
      return 'Your session has expired. Please contact the administrator for a new session token.';
    }
    if (isInvalid) {
      return 'The session token is invalid. Please verify you have the correct link or contact the administrator.';
    }
    if (isMissing) {
      return 'A valid session token is required to access the catalogue. Please contact the administrator for access.';
    }
    return errorMessage || 'Please contact the administrator for a valid session token.';
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-labelledby="session-error-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity -z-10"></div>

      {/* Modal panel */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isExpired ? (
                <XCircle className="h-6 w-6 text-red-600" />
              ) : isInvalid ? (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              ) : (
                <Key className="h-6 w-6 text-red-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900" id="session-error-modal-title">
                {getErrorTitle()}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              {getErrorDescription()}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-1">Error Details:</p>
              <p className="text-sm text-gray-700 font-mono break-all">{errorMessage}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Need Help?</strong> Contact your administrator to obtain a valid session token or request access to the catalogue.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}














