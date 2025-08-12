import React from 'react';
import BookGrid from './BookGrid'; // Adjust path if necessary
import StatsContent from './StatsContent'; // Adjust path if necessary

const FindBookSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:space-x-12">
        {/* Left Column: Book Grid */}
        <BookGrid />

        {/* Right Column: Text Content and Stats */}
        <StatsContent />
      </div>
    </section>
  );
};

export default FindBookSection;
