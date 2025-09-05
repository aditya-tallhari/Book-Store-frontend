import React from 'react';
import { motion } from 'framer-motion';

// --- HeroContent Component ---
// Handles the left column content: heading, subtext, and search bar.
const HeroContent = ({ textVariants, childTextVariants }) => (
  <motion.div
    className="md:w-1/2 text-center md:text-left mb-12 md:mb-0"
    initial="hidden"
    animate="visible"
    variants={textVariants}
  >
    {/* Large bold heading with highlighted text */}
    <motion.h1
      className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
      variants={childTextVariants}
    >
      Discover Your Next Great Read <br />
      <span className="text-indigo-700">for Unbeatable Value</span>
    </motion.h1>
    {/* Subtext paragraph */}
    <motion.p
      className="mt-4 text-lg text-gray-700 max-w-xl mx-auto md:mx-0"
      variants={childTextVariants}
    >
      Dive into a vast collection of new releases and timeless classics. Our curated selection
      ensures you'll always find the perfect story, at prices that let you read more.
    </motion.p>

    {/* Search bar with input and button */}
    <motion.div
      className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
      variants={childTextVariants}
    >
      <input
        type="text"
        placeholder="Search by title, author, or genre..."
        aria-label="Search for books"
        className="w-full sm:w-auto flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-900"
      />
      <button
        type="button"
        aria-label="Search button"
        className="w-full sm:w-auto px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition duration-300 ease-in-out flex items-center justify-center rounded-lg"
      >
        {/* Search Icon (inline SVG for simplicity and consistency) */}
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        Search
      </button>
    </motion.div>
  </motion.div>
);

export default HeroContent;
