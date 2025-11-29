'use client';

import { useRef, useState, useEffect } from 'react';
import SearchBar from './SearchBar';

export default function HeroSection({ onSearch, searchTerm = '' }) {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative text-white overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-vid-2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all duration-200 opacity-60 hover:opacity-100 group"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        )}
      </button>
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">STM - ASB</span>
            <span className="block text-white mt-2 text-sm tracking-wide">TO BE LEADING TRANSPORT & HEAVY-DUTY EQUIPMENT MANUFACTURE IN INDONESIA</span>
          </h1>
          <div className="mt-10 flex justify-center">
            <SearchBar onSearch={onSearch} initialValue={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
}

