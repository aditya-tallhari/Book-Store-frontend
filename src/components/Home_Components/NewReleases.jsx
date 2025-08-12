import React, { useEffect, useState, useRef } from "react";
import { getRecentBooks } from "../../lib/api/books"; // Import the specific API for recent books
import BookCard from "./BookCard"; // Reuse the BookCard component
import LoaderSVG from "../Loader/Loader"; // Corrected import path for LoaderSVG

const NewReleases = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getRecentBooks(); // Use the getRecentBooks API
        setBooks(booksData);
      } catch (err) {
        setError("Failed to load new release books. Please try again later.");
        console.error("Error fetching new releases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this runs once on component mount

  // Function to handle scroll updates for pagination dots
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const cardWidthApprox = 270; // Approximate width of a card + gap (adjust if your card/gap sizes change)
      const newIndex = Math.round(scrollLeft / cardWidthApprox);
      setActiveIndex(newIndex);
    }
  };

  // Function to scroll to a specific card group
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidthApprox = 270; // Must match the value used in handleScroll
      scrollContainerRef.current.scrollTo({
        left: index * cardWidthApprox,
        behavior: 'smooth'
      });
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

  // Calculate number of dots needed based on total books and estimated visible cards
  const numDots = Math.ceil(books.length / 2); // Example: show 2 cards per view on small screens

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Heading for the section: "New Releases" */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center">New Releases</h2>

      {/* Scrollable Container for Books */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory pb-6 space-x-6 md:space-x-8 lg:space-x-10 no-scrollbar" // Custom class to hide scrollbar (requires Tailwind plugin)
        onScroll={handleScroll}
      >
        {books.map((book) => (
          <div
            key={book._id}
            className="flex-shrink-0 w-60 sm:w-64 md:w-72 snap-center" // Fixed width for snapping behavior
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
        ))}
      </div>

      {/* Scrolling Dots Pagination */}
      <div className="flex justify-center mt-8 space-x-3">
        {Array.from({ length: numDots }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300
                        ${index === activeIndex ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to new releases slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default NewReleases;
