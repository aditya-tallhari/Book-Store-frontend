import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingCart, Trash2, BookOpen, Star, Heart, Sparkles } from 'lucide-react';
import { addBookToFavourite, placeOrder } from '../../lib/api/books'; // Adjust import path as needed

// It's a best practice to define CSS animations in a separate stylesheet
// or a CSS-in-JS solution. For a production build, dynamically injecting
// a style tag is not ideal. This code assumes the fadeInUp animation
// is defined elsewhere in your project's CSS.

const CartCardGrid = ({ cartBooks, onRemoveFromCart, removingBookId }) => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handleProceedToCheckout = async () => {
    if (!cartBooks || cartBooks.length === 0) {
      // Replaced alert() with toast notification
      toast.warn('Your cart is empty!');
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      // Place the order using the API function
      const response = await placeOrder(cartBooks);
      
      // Replaced alert() with a success toast
      toast.success(response.message || 'Order placed successfully!');
      
      // Navigate to order history page using react-router-dom's useNavigate
      navigate('/profile/orderHistory');
      
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      // Replaced alert() with an error toast
      toast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cartBooks || cartBooks.length === 0) {
    return (
      <div className="text-center py-12 px-4 sm:py-20 md:py-24">
        <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Your cart feels lonely</h3>
        <p className="text-gray-600 mb-6 max-w-xs sm:max-w-md mx-auto text-base sm:text-lg">
          Fill it with amazing books and let the adventure begin! ✨
        </p>
        <button
          onClick={() => navigate('/all-books')}
          className="group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base"
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
          Discover Books
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 opacity-70" />
        </button>
      </div>
    );
  }

  const totalAmount = cartBooks.reduce((total, book) => total + (book.price || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Cart Summary */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Cart Summary</h2>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800 mr-2">
                  {cartBooks.length} item{cartBooks.length !== 1 ? 's' : ''}
                </span>
                Ready for checkout
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right w-full sm:w-auto">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              ₹{totalAmount.toFixed(2)}
            </p>
            <button 
              onClick={handleProceedToCheckout}
              disabled={isPlacingOrder}
              className={`group inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base ${
                isPlacingOrder ? 'opacity-70 cursor-not-allowed transform-none' : ''
              }`}
            >
              <span className="mr-2">
                {isPlacingOrder ? 'Placing Order...' : 'Proceed to Checkout'}
              </span>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-300 ${
                isPlacingOrder ? 'animate-spin' : 'group-hover:rotate-180'
              }`}>
                {isPlacingOrder ? '⟳' : '→'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Cart Items Grid */}
      <div className="space-y-4 sm:space-y-6">
        {cartBooks.map((book, index) => (
          <CartBookCard
            key={book._id || book.id}
            book={book}
            onRemove={onRemoveFromCart}
            isRemoving={removingBookId === (book._id || book.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const CartBookCard = ({ book, onRemove, isRemoving, index }) => {
  const bookId = book._id || book.id;
  const [isAddingToFav, setIsAddingToFav] = useState(false);

  const handleRemove = () => {
    if (!isRemoving && onRemove) {
      onRemove(bookId);
    }
  };

  const handleAddToFavorites = async () => {
    if (isAddingToFav) return;
    
    setIsAddingToFav(true);
    try {
      const response = await addBookToFavourite(bookId);
      console.log(response.message);
      // Replaced alert() with a success toast
      toast.success(response.message || "Book added to favorites successfully!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      // Replaced alert() with an error toast
      const errorMessage = error.response?.data?.message || "Failed to add book to favorites. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsAddingToFav(false);
    }
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col sm:flex-row"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex p-4 sm:p-6 w-full sm:w-auto justify-center">
        {/* Enhanced Book Cover */}
        <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          <div className="relative">
            <img
              src={book.imageUrl || book.coverImage || 'https://placehold.co/150x220/E0E0E0/333333?text=Book+Cover'}
              alt={book.title || 'Book cover'}
              className="w-28 h-40 sm:w-32 sm:h-44 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/150x220/E0E0E0/333333?text=Book+Cover';
              }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Book Details */}
      <div className="flex-1 ml-0 sm:ml-8 p-4 sm:p-6 pt-0 sm:pt-6 flex flex-col justify-between">
        <div className="flex items-start justify-between h-full flex-col sm:flex-row">
          <div className="flex-1 flex flex-col text-center sm:text-left">
            <div className="mb-2 sm:mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {book.title || 'Unknown Title'}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 flex items-center justify-center sm:justify-start">
                <span className="mr-2">by</span>
                <span className="font-semibold text-gray-800">{book.author || 'Unknown Author'}</span>
              </p>
            </div>
            {book.desc && (
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm sm:text-base">
                {book.desc}
              </p>
            )}
            <div className="flex items-center flex-wrap gap-2 mb-4 justify-center sm:justify-start">
              {book.language && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                  🌐 {book.language}
                </span>
              )}
              {book.category && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200">
                  📚 {book.category}
                </span>
              )}
              {book.rating && (
                <div className="flex items-center px-2.5 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-200 text-xs sm:text-sm">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium text-yellow-800">{book.rating}</span>
                </div>
              )}
            </div>
            <div className="mt-auto flex justify-center sm:justify-start">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                In Stock
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end justify-between h-full mt-6 sm:mt-0 ml-0 sm:ml-8 w-full sm:w-auto">
            <div className="text-center sm:text-right mb-4 sm:mb-6">
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹{book.price ? book.price.toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="flex flex-col space-y-3 w-full max-w-[180px] sm:max-w-none">
              <div className="flex items-center justify-center w-full h-10 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-700">
                Qty: 1
              </div>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className={`group inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${
                  isRemoving
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 hover:border-red-300 transform hover:scale-105 shadow-sm hover:shadow-md'
                }`}
              >
                <Trash2 className={`w-4 h-4 mr-2 ${isRemoving ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`} />
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>
              <button
                onClick={handleAddToFavorites}
                disabled={isAddingToFav}
                className={`group inline-flex items-center justify-center px-4 py-2 rounded-xl border transition-all duration-200 transform hover:scale-105 text-sm ${
                  isAddingToFav
                    ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1 transition-all ${
                  isAddingToFav
                    ? 'animate-pulse'
                    : 'group-hover:text-red-500 group-hover:scale-110'
                }`} />
                <span className="font-medium">
                  {isAddingToFav ? 'Adding...' : 'Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCardGrid;
