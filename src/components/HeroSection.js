'use client';

import SearchBar from './SearchBar';

export default function HeroSection({ onSearch, searchTerm = '' }) {
  return (
    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">STM - ASB</span>
            <span className="block text-red-200 mt-2 text-sm tracking-wide">TO BE LEADING TRANSPORT & HEAVY-DUTY EQUIPMENT MANUFACTURE IN INDONESIA</span>
          </h1>
          <div className="mt-10 flex justify-center">
            <SearchBar onSearch={onSearch} initialValue={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
}

