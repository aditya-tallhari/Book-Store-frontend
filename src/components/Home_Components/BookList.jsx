import React, { useEffect, useState, useRef } from "react";
import { getAllBooks } from "../../lib/api/books";
import BookCard from "./BookCard";
import LoaderSVG from "../Loader/Loader";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getAllBooks();
        setBooks(booksData || []);
      } catch (err) {
        setError("Failed to load books. Please try again later.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const cardWidthApprox = 270; // Width + gap
      setActiveIndex(Math.round(scrollLeft / cardWidthApprox));
    }
  };

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidthApprox = 270;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidthApprox,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-10">
        <LoaderSVG size={64} color="#6366F1" /> {/* Your custom SVG loader */}
        <p className="mt-4 text-lg text-gray-700">Loading Books...</p>
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
        <p className="text-lg text-gray-700">No books found.</p>
      </div>
    );
  }

  const numDots = Math.ceil(books.length / 2);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Best Seller Books
      </h2>

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory pb-6 space-x-6 md:space-x-8 lg:space-x-10 no-scrollbar"
      >
        {books.map((book) => {
          console.log("Book from API in list component:", book); // <-- ADD THIS LINE
          return (
            <div
              key={book._id}
              className="flex-shrink-0 w-60 sm:w-64 md:w-72 snap-center"
            >
              <BookCard
                book={{
                  _id: book._id, // Ensure this is correctly mapping from your API response
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
      </div>

      {/* Dots pagination */}
      <div className="flex justify-center mt-8 space-x-3">
        {Array.from({ length: numDots }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === activeIndex
                ? "bg-indigo-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;
