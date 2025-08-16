import React, { useEffect, useState } from "react";
import { getFavouriteBooks, removeBookFromFavourites } from "../lib/api/books";
import LoaderSVG from "../components/Loader/Loader";
import FavouriteCardGrid from "../components/Book-details/FavouriteCardGrid";

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingBookId, setRemovingBookId] = useState(null);

  useEffect(() => {
    const fetchFavouriteBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        if (!userId || !token) {
          setError("Please log in to view your favourite books.");
          setFavouriteBooks([]);
          return;
        }
        const books = await getFavouriteBooks();
        setFavouriteBooks(Array.isArray(books) ? books : []);
      } catch (err) {
        let errorMessage = "Failed to load favourite books.";
        if (err.response?.status === 401) {
          errorMessage = "Please log in again to view your favourite books.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setFavouriteBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavouriteBooks();
  }, []);

  const handleRemoveFromFavourites = async (bookId) => {
    try {
      setRemovingBookId(bookId);
      
      // Call the API to remove the book from favourites
      await removeBookFromFavourites(bookId);
      
      // Update the local state to remove the book immediately
      setFavouriteBooks(prevBooks => 
        prevBooks.filter(book => book._id !== bookId && book.id !== bookId)
      );
      
      // Optional: Show success message (you can add toast notification here)
      console.log("Book removed from favourites successfully");
      
    } catch (error) {
      console.error("Error removing book from favourites:", error);
      
      // Optional: Show error message to user (you can add toast notification here)
      alert(error.message || "Failed to remove book from favourites. Please try again.");
      
    } finally {
      setRemovingBookId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <LoaderSVG size={64} color="#6366F1" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 flex flex-col justify-center items-center">
        <h3 className="text-lg font-medium text-red-600 mb-2">Oops!</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            My Favourite Books
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and revisit the books that captured your heart
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {favouriteBooks.length} book
              {favouriteBooks.length !== 1 ? "s" : ""} in your collection
            </span>
          </div>
        </div>

        {/* Books Grid + Stats */}
        <FavouriteCardGrid 
          favouriteBooks={favouriteBooks} 
          onRemoveFromFavourites={handleRemoveFromFavourites}
          removingBookId={removingBookId}
        />
      </div>
    </div>
  );
};

export default Favourites;