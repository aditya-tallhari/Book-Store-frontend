import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const bannerData = [
  {
    heading: (
      <>
        Find Your Favorite —{' '}
        <span className="text-purple-700">1200+ Books Available</span>
      </>
    ),
    subtext: "Explore our vast collection of genres, from fiction to fantasy, and find your next great read.",
    bgColor: "from-purple-200 via-purple-300 to-purple-400",
    illustration: "https://static.vecteezy.com/system/resources/previews/013/313/384/non_2x/book-icon-3d-illustration-vector.jpg",
    ctaLink: "/all-books"
  },
  {
    heading: (
      <>
        Award-Winning Stories Await —{' '}
        <span className="text-pink-700">Explore Our Curated List</span>
      </>
    ),
    subtext: "Dive into a world of literary masterpieces. These books are guaranteed to captivate your imagination.",
    bgColor: "from-pink-200 via-pink-300 to-pink-400",
    illustration: "https://img.freepik.com/premium-vector/3d-winner-medal-with-star-ribbon-pastel-yellow-background-quality-guarantee-product-champion-award-with-cartoon-minimal-style-3d-graphics-medal-rating-icon-vector-rendering-illustration_412828-2695.jpg?semt=ais_hybrid&w=740&q=80",
    ctaLink: "/explore"
  },
  {
    heading: (
      <>
        New Releases —{' '}
        <span className="text-indigo-700">Just In Time For You</span>
      </>
    ),
    subtext: "Be the first to read the most anticipated books of the year. Discover your next obsession today.",
    bgColor: "from-indigo-200 via-indigo-300 to-indigo-400",
    illustration: "https://img.freepik.com/free-photo/3d-render-books-fly-fall-blue-background_107791-17215.jpg?semt=ais_hybrid&w=740&q=80",
    ctaLink: "/new-releases"
  }
];

export default function BookBanner() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(timer);
  }, []);

  const currentBanner = bannerData[currentBannerIndex];

  return (
    <div className={`w-full bg-gradient-to-br ${currentBanner.bgColor} relative overflow-hidden transition-colors duration-1000`}>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBannerIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentBanner.heading}
                </h1>
                <p className="text-lg text-gray-700">{currentBanner.subtext}</p>
                
                <div className="relative max-w-md mt-8">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for Books..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-full border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-700 placeholder-gray-500 text-lg"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex-shrink-0 ml-12 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentBannerIndex}
                src={currentBanner.illustration}
                alt="Book illustration"
                className="w-[400px] h-auto object-contain rounded-xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Dots Pagination */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBannerIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentBannerIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
