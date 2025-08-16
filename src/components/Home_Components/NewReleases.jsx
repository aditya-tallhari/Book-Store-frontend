import React, { useEffect, useState, useRef } from "react";
import { getRecentBooks } from "../../lib/api/books"; // Import the specific API for recent books
import BookCard from "./BookCard"; // Reuse the BookCard component
import LoaderSVG from "../Loader/Loader"; // Corrected import path for LoaderSVG

const NewReleases = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [infiniteBooks, setInfiniteBooks] = useState([]);
  const scrollContainerRef = useRef(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getRecentBooks(); // Use the getRecentBooks API
        setBooks(booksData || []);
        
        // Create infinite scrolling array (triple the books for seamless loop)
        if (booksData && booksData.length > 0) {
          const tripleBooks = [...booksData, ...booksData, ...booksData];
          setInfiniteBooks(tripleBooks);
        }
      } catch (err) {
        setError("Failed to load new release books. Please try again later.");
        console.error("Error fetching new releases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this runs once on component mount

  useEffect(() => {
    // Start from the middle set to enable infinite scrolling in both directions
    if (infiniteBooks.length > 0 && scrollContainerRef.current && !isScrollingRef.current) {
      const cardWidth = 312;
      const startPosition = books.length * cardWidth;
      scrollContainerRef.current.scrollLeft = startPosition;
    }
  }, [infiniteBooks, books.length]);

  // Function to handle scroll updates for pagination dots
  const handleScroll = () => {
    if (!scrollContainerRef.current || isScrollingRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const cardWidth = 312;
    const totalOriginalWidth = books.length * cardWidth;
    
    // Calculate current position relative to original set
    const currentIndex = Math.round((scrollLeft % totalOriginalWidth) / cardWidth);
    setActiveIndex(currentIndex);
    
    // Handle infinite scroll reset
    if (scrollLeft <= cardWidth) {
      // Near beginning, jump to end of middle set
      isScrollingRef.current = true;
      container.scrollLeft = scrollLeft + totalOriginalWidth;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    } else if (scrollLeft >= scrollWidth - clientWidth - cardWidth) {
      // Near end, jump to beginning of middle set
      isScrollingRef.current = true;
      container.scrollLeft = scrollLeft - totalOriginalWidth;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    }
  };

  // Function to scroll to a specific card group
  const scrollToCard = (index) => {
    if (scrollContainerRef.current && books.length > 0) {
      const cardWidth = 312;
      const totalOriginalWidth = books.length * cardWidth;
      // Always scroll to the middle set + desired index
      const targetPosition = totalOriginalWidth + (index * cardWidth);
      
      isScrollingRef.current = true;
      scrollContainerRef.current.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
      setTimeout(() => { isScrollingRef.current = false; }, 300);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-10">
        <LoaderSVG size={64} color="#6366F1" /> {/* Your custom SVG loader */}
        <p className="mt-4 text-lg text-gray-700">Loading new releases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-gray-700">No new releases found.</p>
      </div>
    );
  }

  const numDots = Math.min(books.length, 5); // Show dots based on actual books, max 5

  return (
    <div className="py-12 relative">
      {/* Add CSS styles directly to the head */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12 text-center">
          New Releases
        </h2>
      </div>

      {/* Container with blur effects */}
      <div className="relative">
        {/* Left blur gradient - only show when scrolled */}
        <div 
          className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none transition-opacity duration-300"
          style={{ opacity: activeIndex > 0 ? 1 : 0 }}
        ></div>
        
        {/* Right blur gradient */}
        <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none"></div>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide pl-6"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {infiniteBooks.map((book, index) => {
            return (
              <div
                key={`${book._id}-${index}`}
                className="flex-shrink-0 w-72 mr-6 snap-start"
                style={{
                  scrollSnapAlign: 'start'
                }}
              >
                <BookCard
                  book={{
                    _id: book._id,
                    imageUrl: book.imageUrl,
                    title: book.title,
                    price: book.price,
                    author: book.author,
                    rating: book.rating,
                    language: book.language,
                    description: book.description,
                  }}
                />
              </div>
            );
          })}
          
          {/* End padding */}
          <div className="flex-shrink-0 w-6"></div>
        </div>
      </div>

      {/* Dots pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: numDots }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-blue-600 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to new releases slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewReleases;