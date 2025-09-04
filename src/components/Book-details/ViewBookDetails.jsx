import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { getBookById, addBookToFavourite, addBookToCart, deleteBook } from "../../lib/api/books";
import LoaderSVG from "../Loader/Loader";
import { motion } from "framer-motion";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function ViewBookDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // State for user messages
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for image and details content
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  // Animation variants for individual text elements within details
  const textChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Handle adding book to favourites
  const handlefavourite = async () => {
    try {
      const response = await addBookToFavourite(id);
      setMessage({ type: 'success', text: response.message || "Book added to favourites successfully!" });
    } catch (error) {
      console.error("Error adding to favourites:", error);
      const errorMessage = error.response?.data?.message || "Failed to add book to favourites. Please try again.";
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  // Handle adding book to cart
  const handlecart = async () => {
    try {
      const response = await addBookToCart(id);
      setMessage({ type: 'success', text: response.message || "Book added to cart successfully!" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error.response?.data?.message || "Failed to add book to cart. Please try again.";
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  // Handle deleting the book (Admin only)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(book._id);
        setMessage({ type: 'success', text: "Book deleted successfully!" });
        // Redirect to home page after a short delay
        setTimeout(() => navigate('/all-books'), 1000);
      } catch (err) {
        console.error("Error deleting book:", err);
        const errorMessage = err.response?.data?.message || "Failed to delete book. Please try again.";
        setMessage({ type: 'error', text: errorMessage });
      }
    }
  };

  // Handle navigating to the edit page (Admin only)
  const handleEdit = () => {
    // Navigate to a new route for editing
    navigate(`/updatebook/${book._id}`);
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const fetchedBook = await getBookById(id);
        setBook(fetchedBook);
      } catch (err) {
        console.error("Error fetching book details:", err);
        const errorMessage = err.response?.data?.message || "Failed to load book details. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBookDetails();
    } else {
      setLoading(false);
      setError("No book ID provided in URL.");
    }
  }, [id]);

  const placeholderImage = "https://placehold.co/400x600/E0E0E0/333333?text=Book+Cover";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <LoaderSVG size={80} color="#6366F1" />
        <p className="mt-4 text-lg text-gray-700 text-center">Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-xl text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-xl text-gray-700">Book not found.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 text-center text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message.text}
            </motion.div>
          )}
          
          {/* Mobile-first layout that changes to side-by-side on larger screens */}
          <div className="flex flex-col lg:flex-row">
            
            {/* Image Section */}
            <motion.div
              className="relative lg:w-2/5 p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {/* Action buttons container - positioned for both mobile and desktop */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 sm:flex-row sm:gap-2">
                {isLoggedIn === true && role === "user" && (
                  <motion.button 
                    className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg text-red-500 hover:text-red-600 hover:bg-white transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlefavourite}
                  >
                    <FaRegHeart className="w-5 h-5" />
                  </motion.button>
                )}
                {isLoggedIn === true && role === "admin" && (
                  <>
                    <motion.button 
                      className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg text-blue-500 hover:text-blue-600 hover:bg-white transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEdit}
                    >
                      <FaRegEdit className="w-5 h-5" />
                    </motion.button>
                    <motion.button 
                      className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg text-red-500 hover:text-red-600 hover:bg-white transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                    >
                      <MdDeleteOutline className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </div>

              {/* Book Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={book.imageUrl || book.image || placeholderImage}
                  alt={book.title || "Book Cover"}
                  className="w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-xl shadow-2xl transform transition-all duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                />
              </div>
            </motion.div>
            
            {/* Details Section */}
            <motion.div
              className="lg:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col justify-center"
              variants={itemVariants}
            >
              {/* Title and Author */}
              <motion.div variants={textChildVariants} className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {book.title || "Untitled Book"}
                </h1>
                <p className="text-lg sm:text-xl text-indigo-600 font-semibold">
                  by {book.author || "Unknown Author"}
                </p>
              </motion.div>

              {/* Rating and Language */}
              <motion.div 
                className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6" 
                variants={textChildVariants}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < (book.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.292a1 1 0 00.95.69h3.46c.969 0 1.371 1.24.588 1.81l-2.793 2.03a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.793-2.03a1 1 0 00-1.176 0l-2.793 2.03c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.25 8.719c-.783-.57-.381-1.81.588-1.81h3.46a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 font-medium">
                    {book.rating || 4}/5
                  </span>
                </div>
                {book.language && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border">
                    {book.language}
                  </span>
                )}
              </motion.div>

              {/* Description */}
              <motion.div variants={textChildVariants} className="mb-6">
                <p className="text-gray-700 text-base leading-relaxed">
                  {book.desc || 'A detailed description of this book is not available. This book offers a compelling narrative and insightful perspectives that will captivate readers from start to finish. Dive into its pages to explore a world of imagination and knowledge.'}
                </p>
              </motion.div>

              {/* Price and Stock */}
              <motion.div variants={textChildVariants} className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-gray-50 rounded-xl border">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      <span className="text-indigo-600">₹{book.price?.toFixed(2) ?? 'N/A'}</span>
                    </p>
                  </div>
                  {book.stock !== undefined && (
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        book.stock > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              {isLoggedIn === true && role === "user" && (
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4" 
                  variants={textChildVariants}
                >
                  <motion.button
                    className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlecart}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13H5.4M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <span>Add to Cart</span>
                  </motion.button>
                  
                  <motion.button 
                    className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Buy Now
                  </motion.button>
                </motion.div>
              )}

              {isLoggedIn === true && role === "admin" && (
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4" 
                  variants={textChildVariants}
                >
                  <motion.button
                    className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                  >
                    <FaRegEdit className="w-5 h-5" />
                    <span>Edit Book</span>
                  </motion.button>
                  
                  <motion.button 
                    className="flex-1 bg-red-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                  >
                    <MdDeleteOutline className="w-5 h-5" />
                    <span>Delete Book</span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
