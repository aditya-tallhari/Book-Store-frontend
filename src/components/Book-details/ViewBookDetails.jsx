import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../lib/api/books";

export default function ViewBookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const placeholderImage =
    "https://placehold.co/300x400/E0E0E0/333333?text=Book+Cover";

  useEffect(() => {
    const fetchBook = async () => {
      const bookData = await getBookById(id);
      setBook(bookData);
    };
    if (id) fetchBook();
  }, [id]);

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading book details...</p>
      </div>
    );
  }

  // Safe access after the null check
  const imageUrl = book.imageUrl || book.image || placeholderImage;

  return (
    <div className="max-w-6xl mx-auto py-10 px-5 grid md:grid-cols-2 gap-10">
      {/* Book Cover */}
      <div className="flex justify-center items-center bg-gray-100 rounded-lg p-6">
        <img
          src={imageUrl}
          alt={book.title || "Book"}
          className="max-h-[500px] object-contain rounded-lg shadow-lg"
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4">
          {book.title || "Untitled Book"}
        </h1>
        <p className="text-gray-600 mb-6">
          {book.desc || "No description available."}
        </p>
        <p className="text-lg font-semibold mb-6">
          Price:{" "}
          <span className="text-purple-600">
            ₹{book.price ?? "N/A"}
          </span>
        </p>
        <div className="flex gap-4">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Add to Cart
          </button>
          <button className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
