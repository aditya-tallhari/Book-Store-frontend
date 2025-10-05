import React, { useEffect, useState } from "react";
import { getAllBooks } from "../../lib/api/books";
import LoaderSVG from "../Loader/Loader";

const BookGrid = () => {
  const [bookImages, setBookImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGridBooks = async () => {
      try {
        let allBooks = await getAllBooks();
        // Ensure it's always an array
        if (!Array.isArray(allBooks)) {
          allBooks = allBooks.data || allBooks.books || [];
        }

        const images = allBooks
          .slice(0, 9)
          .map(
            (book) =>
              book.imageUrl ||
              book.image ||
              "https://placehold.co/100x150/E0E0E0/333333?text=Book"
          );

        setBookImages(images);
      } catch (err) {
        console.error("Error fetching book grid images:", err);
        setError("Failed to load book grid images.");
      } finally {
        setLoading(false);
      }
    };

    fetchGridBooks();
  }, []);

  if (loading) {
    return (
      <div className="md:w-1/2 flex flex-col justify-center items-center p-4">
        <LoaderSVG size={64} color="#6366F1" />
        <p className="mt-4 text-gray-700">Loading book covers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:w-1/2 flex justify-center p-4 items-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (bookImages.length === 0) {
    return (
      <div className="md:w-1/2 flex justify-center p-4 items-center">
        <p className="text-gray-700">No book covers available.</p>
      </div>
    );
  }

  return (
    <div className="md:w-1/2 flex justify-center p-4">
      <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto">
        {bookImages.map((src, index) => (
          <div
            key={index}
            className="relative aspect-w-2 aspect-h-3 overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={src}
              alt={`Book cover ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x150?text=Book";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
