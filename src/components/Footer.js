'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Building2 } from 'lucide-react';
import ContactInquiryModal from './ContactInquiryModal';

//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = 'https://uat-stm-portal-be.stm-asb.co.id/api';

export default function Footer() {
  const [company, setCompany] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${API_URL}/companies/public`, {
          cache: 'no-store',
        });
        
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setCompany(result.data);
          }
        } else {
          console.error('Failed to fetch company info, status:', res.status);
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };

    fetchCompany();
  }, []);

  const handleEmail = () => {
    setShowEmailModal(true);
  };

  const handleWhatsApp = () => {
    if (company?.whatsappLink) {
      window.open(company.whatsappLink, '_blank');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-white">
                {company?.companyName || 'ASB Catalogue'}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Browse our collection of high-quality body types and configurations for your vehicle needs.
            </p>
            {company?.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-600 transition-colors"
              >
                <Globe className="h-4 w-4" />
                Visit our website
              </a>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              {company?.whatsappLink && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400">WhatsApp</div>
                    <button
                      onClick={handleWhatsApp}
                      className="text-sm text-white hover:text-green-400 transition-colors text-left"
                    >
                      {company.phone || 'Click to chat on WhatsApp'}
                    </button>
                  </div>
                </div>
              )}

              {company?.hasEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <button
                      onClick={handleEmail}
                      className="text-sm text-white hover:text-red-600 transition-colors text-left"
                    >
                      Click to send email
                    </button>
                  </div>
                </div>
              )}

              {company?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400">Address</div>
                    <div className="text-sm text-white">{company.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-gray-400 hover:text-red-600 transition-colors"
              >
                Products
              </Link>
              <button
                onClick={() => {
                  // Scroll to top or trigger contact CTA
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="block text-sm text-gray-400 hover:text-red-600 transition-colors text-left"
              >
                Contact Us
              </button>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {company?.companyName || 'ASB'}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Contact Inquiry Modal for Email */}
      <ContactInquiryModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </footer>
  );
}

