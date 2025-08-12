import React from 'react';

const StatsContent = () => {
  return (
    <div className="md:w-1/2 p-4 text-center md:text-left">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
        Find Your Favorite <br />
        <span className="text-indigo-600">Book Here!</span>
      </h2>
      <p className="text-gray-700 text-lg mb-8 max-w-xl mx-auto md:mx-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo ad non reprehenderit. Reiciendis illo iusto
        incidunt distinctio exercitationem officiis dicta dolores dolorem ea! Non saepe, voluptatum cupiditate beatae
        in dolore!
      </p>

      {/* Statistics */}
      <div className="flex justify-center md:justify-start space-x-8 sm:space-x-12 mb-8 flex-wrap">
        <div className="text-center md:text-left mb-4 sm:mb-0">
          <p className="text-3xl font-bold text-gray-900">800+</p>
          <p className="text-gray-600 text-sm">Book Listing</p>
        </div>
        <div className="text-center md:text-left mb-4 sm:mb-0">
          <p className="text-3xl font-bold text-gray-900">550+</p>
          <p className="text-gray-600 text-sm">Register User</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-3xl font-bold text-gray-900">1,200+</p>
          <p className="text-gray-600 text-sm">Books Sold</p>
        </div>
      </div>

      {/* Explore Now Button */}
      <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                         hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:ring-offset-2 transition duration-300">
        Explore Now
      </button>
    </div>
  );
};

export default StatsContent;
