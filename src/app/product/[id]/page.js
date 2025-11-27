import { getCatalogueById } from '@/lib/api';
import Link from 'next/link';
import ImageCarousel from '@/components/ImageCarousel';
import ProductFinder from '@/components/ProductFinder';

export default async function ProductPage({ params }) {
  const { id } = await params;
  const catalogue = await getCatalogueById(id);

  if (!catalogue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-500 underline">
            ← Back to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // Get all images (front image + carousel images)
  const allImages = [];
  if (catalogue.frontImage) {
    allImages.push(catalogue.frontImage);
  }
  if (catalogue.carouselImages && Array.isArray(catalogue.carouselImages)) {
    allImages.push(...catalogue.carouselImages.filter(img => img && img.trim()));
  }

  // Get all available variants from shopCatalogue
  const variants = catalogue.shopCatalogue || [];

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-red-600 hover:text-red-500 inline-flex items-center mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalogue
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">{catalogue.bodyType?.name || 'Product'}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Section */}
            <div>
              {allImages.length > 0 ? (
                <ImageCarousel images={allImages} />
              ) : (
                <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                  <span className="text-6xl text-gray-400">📷</span>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div>
              <div className="mb-6">
                {catalogue.article && (
                  <div className="prose prose-sm max-w-none mb-6">
                    <div dangerouslySetInnerHTML={{ __html: catalogue.article }} />
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {catalogue.leadTime && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Lead Time:</span>
                    <span className="ml-2 text-sm text-gray-900">{catalogue.leadTime}</span>
                  </div>
                )}
                {catalogue.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Notes:</span>
                    <p className="mt-1 text-sm text-gray-900">{catalogue.notes}</p>
                  </div>
                )}
              </div>

              {/* Sizes */}
              {catalogue.sizes && catalogue.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {catalogue.sizes.map((size, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {getSizeLabel(size)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Chassis */}
              {catalogue.chassis && catalogue.chassis.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Compatible Chassis</h3>
                  <div className="flex flex-wrap gap-2">
                    {catalogue.chassis.map((ch, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {getChassisLabel(ch)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Finder Section */}
          {variants.length > 0 && (
            <div className="border-t border-gray-200 px-6 lg:px-8 py-6">
              <ProductFinder catalogue={catalogue} variants={variants} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
