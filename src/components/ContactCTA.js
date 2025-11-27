'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Mail, X, Phone } from 'lucide-react';
import ContactInquiryModal from './ContactInquiryModal';

//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = 'https://uat-stm-portal-be.stm-asb.co.id/api';

export default function ContactCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/companies/public`, {
          cache: 'no-store',
        });
        
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setCompany(result.data);
          } else {
            console.log('Company data not available:', result);
          }
        } else {
          const errorText = await res.text();
          console.error('Failed to fetch company info, status:', res.status, errorText);
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleWhatsApp = () => {
    if (company?.whatsappLink) {
      window.open(company.whatsappLink, '_blank');
    }
  };

  const handleEmail = () => {
    setIsOpen(false); // Close the contact options modal
    setShowEmailModal(true); // Open the email inquiry modal
  };

  // Always show CTA button, even if still loading or no contact info yet
  // This ensures the button is always visible for quick access
  return (
    <>
      {/* CTA Button - Large Circular Button with Pulse Animation */}
      <div 
        className="fixed bottom-6 right-6 z-50"
        style={{ 
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl hover:shadow-red-600/50 transition-all duration-300 flex items-center justify-center group hover:scale-110"
          aria-label="Contact us"
          style={{
            width: '64px',
            height: '64px',
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MessageSquare className="h-7 w-7 group-hover:scale-110 transition-transform relative z-10" />
        </button>
      </div>

      {/* Contact Options Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-end p-4 pointer-events-none"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 bg-opacity-50 pointer-events-auto" />
          
          {/* Modal Panel */}
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="text-center py-4 text-sm text-gray-500">Loading contact information...</div>
              ) : (
                <>
                  {company?.whatsappLink && (
                    <button
                      onClick={handleWhatsApp}
                      className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left group"
                    >
                      <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">WhatsApp Us</div>
                        <div className="text-xs text-gray-600">Click to open WhatsApp</div>
                      </div>
                    </button>
                  )}

                  {company?.hasEmail && (
                    <button
                      onClick={handleEmail}
                      className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left group"
                    >
                      <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Email Us</div>
                        <div className="text-xs text-gray-600">Click to send email</div>
                      </div>
                    </button>
                  )}

                  {!company?.whatsappLink && !company?.hasEmail && (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500 mb-2">Contact information not available</div>
                      <div className="text-xs text-gray-400">Please check back later</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Inquiry Modal for Email */}
      <ContactInquiryModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </>
  );
}

