import React, { useEffect, useState } from "react";
import { getCartBooks, removeBookFromCart } from "../lib/api/books";
import LoaderSVG from "../components/Loader/Loader";
import { toast } from 'react-toastify';
import CartCardGrid from "../components/Book-details/CartCardgrid";
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingBookId, setRemovingBookId] = useState(null);

  const fetchCartBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) {
        setError("Please log in to view your cart.");
        setCartBooks([]);
        return;
      }
      
      const books = await getCartBooks();
      setCartBooks(Array.isArray(books) ? books : []);
    } catch (err) {
      let errorMessage = "Failed to load cart items.";
      
      if (err.response?.status === 401) {
        errorMessage = "Please log in again to view your cart.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setCartBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartBooks();
  }, []);

  const handleRemoveFromCart = async (bookId) => {
    try {
      setRemovingBookId(bookId);
      await toast.promise(removeBookFromCart(bookId), {
        pending: 'Removing book from cart...',
        success: 'Book removed successfully!',
        error: 'Failed to remove book.'
      });
      
      setCartBooks(prevBooks => 
        prevBooks.filter(book => book._id !== bookId && book.id !== bookId)
      );
    } catch (error) {
      console.error("Error removing book from cart:", error);
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
          onClick={fetchCartBooks}
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Your Cart</h1>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="md:col-span-2">
            {cartBooks.length > 0 ? (
              <CartCardGrid
                cartBooks={cartBooks}
                onRemoveFromCart={handleRemoveFromCart}
                removingBookId={removingBookId}
              />
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
                <ShoppingCart className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Your cart is empty</h3>
              </div>
            )}
          </div>
          
          {/* Right: Order Summary */}
          {cartBooks.length > 0 && (
            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({cartBooks.length} items)</span>
                  <span>₹{cartBooks.reduce((total, b) => total + (b.price || 0), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">₹{cartBooks.reduce((total, b) => total + (b.price || 0), 0).toFixed(2)}</span>
                </div>
              </div>
              <button 
                className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                onClick={() => toast.info('Proceeding to checkout...')} // Placeholder for checkout logic
              >
                Proceed to Checkout
              </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
