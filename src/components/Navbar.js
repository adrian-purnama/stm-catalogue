import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="https://i.imgur.com/83wJQlA.png"
                alt="ASB Catalogue Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent hidden sm:block">
                ASB Catalogue
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
