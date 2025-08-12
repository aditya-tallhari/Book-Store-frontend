import React from 'react';

const AwardBanner = () => {
  return (
    <section className="bg-yellow-100 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-md max-w-7xl mx-auto my-12 md:my-16 flex flex-col md:flex-row items-center justify-between">
      {/* Left Content Area */}
      <div className="text-center md:text-left md:w-2/3 mb-6 md:mb-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
          2025 National Book Awards for Fiction Shortlist
        </h2>
        <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                           hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           focus:ring-offset-2 transition duration-300">
          Explore Now
        </button>
      </div>

      {/* Right Image Area */}
      <div className="md:w-1/3 flex justify-center md:justify-end">
        <img
          src="https://wpvip.edutopia.org/wp-content/uploads/2025/08/hero_blog_student-voice_literacy_illustration_iStock_2124113400_lerbank_7302c6.jpg?w=2880&quality=85" // Placeholder matching the style
          alt="Trophy on a stack of books"
          className="w-48 h-auto object-contain" // Adjust size as needed
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150?text=Image"; }}
        />
      </div>
    </section>
  );
};

export default AwardBanner;
