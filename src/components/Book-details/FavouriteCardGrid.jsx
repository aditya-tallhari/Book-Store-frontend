import React from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookCard from "../Home_Components/BookCard";

const FavouriteCardGrid = ({ favouriteBooks, onRemoveFromFavourites, removingBookId }) => {
  const navigate = useNavigate();

  if (favouriteBooks.length === 0) {
    // Empty State
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.292a1 1 0 00.95.69h3.46c.969 0 1.371 1.24.588 1.81l-2.793 2.03a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.793-2.03a1 1 0 00-1.176 0l-2.793 2.03c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.25 8.719c-.783-.57-.381-1.81.588-1.81h3.46a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No favourite books yet
          </h3>
          <p className="text-gray-600 mb-8">
            Start exploring our collection and add books to your favourites to
            see them here!
          </p>
          <button
            onClick={() => navigate("/all-books")}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
              />
            </svg>
            Explore Books
          </button>
        </div>
      </div>
    );
  }

  const handleRemoveFromFavourites = (bookId) => {
    if (onRemoveFromFavourites) {
      onRemoveFromFavourites(bookId);
      // Display a toast notification on successful removal
      toast.info("Book removed from favourites!");
    }
  };

  return (
    <div className="relative">
      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
        {favouriteBooks.map((book, index) => {
          const bookId = book._id || book.id;
          const isRemoving = removingBookId === bookId;
          
          return (
            <div
              key={bookId || `book-${index}`}
              className={`group transform transition-all duration-300 hover:scale-[1.02] relative ${
                isRemoving ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-blue-200 relative">
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromFavourites(bookId)}
                  disabled={isRemoving}
                  className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  title={isRemoving ? "Removing..." : "Remove from favourites"}
                >
                  {isRemoving ? (
                    // Loading spinner
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    // X icon
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>

                {/* Heart Icon (always visible) */}
                <div className="absolute top-2 left-2 z-10 bg-red-100 text-red-500 rounded-full p-2 shadow-sm">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <BookCard
                  book={{
                    _id: book._id,
                    imageUrl: book.imageUrl || book.image,
                    title: book.title,
                    price: book.price,
                    author: book.author,
                    rating: book.rating,
                    language: book.language,
                    description: book.desc,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {favouriteBooks.length}
            </div>
            <div className="text-gray-600 text-sm">Favourite Books</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {new Set(favouriteBooks.map((book) => book.author)).size}
            </div>
            <div className="text-gray-600 text-sm">Unique Authors</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              ₹
              {favouriteBooks
                .reduce((total, book) => total + (book.price || 0), 0)
                .toFixed(2)}
            </div>
            <div className="text-gray-600 text-sm">Total Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavouriteCardGrid;
