import CatalogueCard from './CatalogueCard';

export default function CatalogueGrid({ catalogues }) {
  if (!catalogues || catalogues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {catalogues.map((catalogue) => (
        <CatalogueCard key={catalogue._id} catalogue={catalogue} />
      ))}
    </div>
  );
}
