import React from 'react';
import { Search } from 'lucide-react';

export default function BookBanner() {
  return (
    <div className="w-full bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Text and search */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Find Your Favorite —{' '}
              <span className="text-purple-700">1200+ Books Available</span>
            </h1>
            
            {/* Search bar */}
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
          </div>
          
          {/* Right side - Books illustration */}
          <div className="flex-shrink-0 ml-12 hidden lg:block">
            <div className="relative">
              {/* Stack of books */}
              <div className="flex items-end space-x-2">
                {/* Book 1 - Yellow */}
                <div className="w-16 h-20 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-lg shadow-xl transform -rotate-12 relative">
                  <div className="absolute top-2 left-2 right-2 h-1 bg-yellow-200 rounded-full opacity-60"></div>
                  <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-yellow-500 rounded-full opacity-40"></div>
                </div>
                
                {/* Book 2 - Purple */}
                <div className="w-14 h-24 bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg shadow-xl transform rotate-3 relative z-10">
                  <div className="absolute top-2 left-2 right-2 h-1 bg-purple-300 rounded-full opacity-60"></div>
                  <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-purple-700 rounded-full opacity-40"></div>
                </div>
                
                {/* Book 3 - Pink */}
                <div className="w-15 h-22 bg-gradient-to-b from-pink-300 to-pink-400 rounded-lg shadow-xl transform -rotate-6 relative">
                  <div className="absolute top-2 left-2 right-2 h-1 bg-pink-200 rounded-full opacity-60"></div>
                  <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-pink-500 rounded-full opacity-40"></div>
                </div>
                
                {/* Book 4 - Orange */}
                <div className="w-12 h-20 bg-gradient-to-b from-orange-300 to-orange-400 rounded-lg shadow-xl transform rotate-8 relative">
                  <div className="absolute top-2 left-2 right-2 h-1 bg-orange-200 rounded-full opacity-60"></div>
                  <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-orange-500 rounded-full opacity-40"></div>
                </div>
                
                {/* Book 5 - Yellow (back) */}
                <div className="w-10 h-18 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-lg shadow-xl transform -rotate-3 relative">
                  <div className="absolute top-2 left-2 right-2 h-1 bg-yellow-300 rounded-full opacity-60"></div>
                  <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-yellow-600 rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-sm"></div>
      <div className="absolute bottom-20 right-40 w-16 h-16 bg-white bg-opacity-15 rounded-full blur-sm"></div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white bg-opacity-10 rounded-full blur-sm"></div>
    </div>
  );
}