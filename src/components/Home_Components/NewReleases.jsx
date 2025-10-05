import React, { useEffect, useState, useRef } from "react";
import { getRecentBooks } from "../../lib/api/books";
import BookCard from "./BookCard";
import LoaderSVG from "../Loader/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewReleases = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 4;
  const booksSectionRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getRecentBooks();
        setBooks(booksData || []);
      } catch (err) {
        setError("Failed to load new release books. Please try again later.");
        console.error("Error fetching new releases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-10">
        <LoaderSVG size={64} color="#6366F1" />
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

  const totalPages = Math.ceil(books.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const scrollToBooks = () => {
    if (booksSectionRef.current) {
      const navbarHeight = 80;
      const elementPosition = booksSectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToBooks();
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToBooks();
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToBooks();
    }
  };

  return (
    <div className="py-12" ref={booksSectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              New Releases
            </h2>
            <p className="text-gray-600 mt-2">
              Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, books.length)} of {books.length} books
            </p>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBooks.map((book) => (
            <BookCard
              key={book._id || book.id}
              book={{
                _id: book._id || book.id,
                imageUrl: book.imageUrl || book.image || "https://placehold.co/100x150?text=Book",
                title: book.title,
                price: book.price,
                author: book.author,
                rating: book.rating,
                language: book.language,
                description: book.desc || book.description || "",
              }}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-500'
              }`}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                const showPage = 
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                const showEllipsis =
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return (
                    <span key={pageNumber} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === pageNumber
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-500'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-500'
              }`}
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReleases;