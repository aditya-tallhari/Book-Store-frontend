// components/Book-details/CartCardGrid.js
import React, { useState } from 'react';
import { ShoppingCart, Trash2, BookOpen, Star, Heart, Sparkles } from 'lucide-react';
import { addBookToFavourite, placeOrder } from '../../lib/api/books'; // Adjust import path as needed

const CartCardGrid = ({ cartBooks, onRemoveFromCart, removingBookId }) => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleProceedToCheckout = async () => {
    if (!cartBooks || cartBooks.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      // Place the order using the API function
      const response = await placeOrder(cartBooks);
      
      // Show success message
      alert(response.message || 'Order placed successfully!');
      
      // Navigate to order history page
      window.location.href = '/profile/orderHistory';
      
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      alert(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cartBooks || cartBooks.length === 0) {
    return (
      <div className="text-center py-12 px-4 sm:py-20 md:py-24"> {/* Adjusted padding for mobile */}
        <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8"> {/* Responsive size for icon container */}
          {/* Animated background circles */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400" /> {/* Responsive icon size */}
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Your cart feels lonely</h3> {/* Responsive font size */}
        <p className="text-gray-600 mb-6 max-w-xs sm:max-w-md mx-auto text-base sm:text-lg"> {/* Responsive font size and max-width */}
          Fill it with amazing books and let the adventure begin! ✨
        </p>
        <button
          onClick={() => window.location.href = '/all-books'}
          className="group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base" /* Responsive padding and font size */
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" /> {/* Responsive icon size */}
          Discover Books
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 opacity-70" /> {/* Responsive icon size */}
        </button>
      </div>
    );
  }

  const totalAmount = cartBooks.reduce((total, book) => total + (book.price || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8"> {/* Adjusted vertical spacing */}
      {/* Enhanced Cart Summary */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 backdrop-blur-sm"> {/* Adjusted padding */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left"> {/* Stack on mobile, row on sm+ */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-0"> {/* Stack info on mobile */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"> {/* Responsive size */}
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-white" /> {/* Responsive icon size */}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Cart Summary</h2> {/* Responsive font size */}
              <p className="text-gray-600 flex items-center justify-center sm:justify-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800 mr-2"> {/* Responsive padding and font size */}
                  {cartBooks.length} item{cartBooks.length !== 1 ? 's' : ''}
                </span>
                Ready for checkout
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right w-full sm:w-auto"> {/* Ensure right side is responsive */}
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4"> {/* Responsive font size */}
              ₹{totalAmount.toFixed(2)}
            </p>
            <button 
              onClick={handleProceedToCheckout}
              disabled={isPlacingOrder}
              className={`group inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base ${
                isPlacingOrder ? 'opacity-70 cursor-not-allowed transform-none' : ''
              }`} /* Responsive padding and font size */
            >
              <span className="mr-2">
                {isPlacingOrder ? 'Placing Order...' : 'Proceed to Checkout'}
              </span>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-300 ${
                isPlacingOrder ? 'animate-spin' : 'group-hover:rotate-180'
              }`}> {/* Responsive size */}
                {isPlacingOrder ? '⟳' : '→'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Cart Items Grid */}
      <div className="space-y-4 sm:space-y-6"> {/* Adjusted vertical spacing */}
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
      // Success alert
      alert(response.message || "Book added to favorites successfully!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      // Error alert
      const errorMessage = error.response?.data?.message || "Failed to add book to favorites. Please try again.";
      alert(errorMessage);
    } finally {
      setIsAddingToFav(false);
    }
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col sm:flex-row" /* Added flex-col sm:flex-row for stacking on mobile */
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex p-4 sm:p-6 w-full sm:w-auto justify-center"> {/* Adjusted padding and width for image section */}
        {/* Enhanced Book Cover */}
        <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          <div className="relative">
            <img
              src={book.imageUrl || book.coverImage || 'https://placehold.co/150x220/E0E0E0/333333?text=Book+Cover'} // Updated placeholder
              alt={book.title || 'Book cover'}
              className="w-28 h-40 sm:w-32 sm:h-44 object-cover rounded-xl shadow-lg" /* Responsive image size */
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
      <div className="flex-1 ml-0 sm:ml-8 p-4 sm:p-6 pt-0 sm:pt-6 flex flex-col justify-between"> {/* Adjusted margins and padding */}
        <div className="flex items-start justify-between h-full flex-col sm:flex-row"> {/* Stack on mobile, row on sm+ */}
          <div className="flex-1 flex flex-col text-center sm:text-left"> {/* Center text on mobile */}
            <div className="mb-2 sm:mb-4"> {/* Adjusted margin */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors"> {/* Responsive font size */}
                {book.title || 'Unknown Title'}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 flex items-center justify-center sm:justify-start"> {/* Responsive font size */}
                <span className="mr-2">by</span>
                <span className="font-semibold text-gray-800">{book.author || 'Unknown Author'}</span>
              </p>
            </div>

            {book.desc && (
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm sm:text-base"> {/* Responsive font size */}
                {book.desc}
              </p>
            )}

            {/* Enhanced Tags */}
            <div className="flex items-center flex-wrap gap-2 mb-4 justify-center sm:justify-start"> {/* Center tags on mobile */}
              {book.language && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"> {/* Responsive padding and font size */}
                  🌐 {book.language}
                </span>
              )}

              {book.category && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200"> {/* Responsive padding and font size */}
                  📚 {book.category}
                </span>
              )}

              {/* Rating if available */}
              {book.rating && (
                <div className="flex items-center px-2.5 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-200 text-xs sm:text-sm"> {/* Responsive padding and font size */}
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current mr-1" /> {/* Responsive icon size */}
                  <span className="font-medium text-yellow-800">{book.rating}</span>
                </div>
              )}
            </div>

            {/* Stock status or additional info */}
            <div className="mt-auto flex justify-center sm:justify-start"> {/* Center on mobile */}
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                In Stock
              </div>
            </div>
          </div>

          {/* Enhanced Price and Actions */}
          <div className="flex flex-col items-center sm:items-end justify-between h-full mt-6 sm:mt-0 ml-0 sm:ml-8 w-full sm:w-auto"> {/* Stack on mobile, align right on sm+ */}
            <div className="text-center sm:text-right mb-4 sm:mb-6"> {/* Center text on mobile */}
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> {/* Responsive font size */}
                ₹{book.price ? book.price.toFixed(2) : '0.00'}
              </p>
            </div>

            <div className="flex flex-col space-y-3 w-full max-w-[180px] sm:max-w-none"> {/* Constrain width on mobile */}
              {/* Quantity selector could go here */}
              <div className="flex items-center justify-center w-full h-10 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-700"> {/* Full width on mobile */}
                Qty: 1
              </div>

              {/* Enhanced Remove Button */}
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className={`group inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${ /* Responsive padding and font size */
                  isRemoving
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 hover:border-red-300 transform hover:scale-105 shadow-sm hover:shadow-md'
                }`}
              >
                <Trash2 className={`w-4 h-4 mr-2 ${isRemoving ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`} />
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>

              {/* Add to favorites button */}
              <button
                onClick={handleAddToFavorites}
                disabled={isAddingToFav}
                className={`group inline-flex items-center justify-center px-4 py-2 rounded-xl border transition-all duration-200 transform hover:scale-105 text-sm ${ /* Responsive padding and font size */
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

// Add CSS animation for fade in effect
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default CartCardGrid;