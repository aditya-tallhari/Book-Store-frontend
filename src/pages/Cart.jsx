// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartBooks, removeBookFromCart, placeOrder } from "../lib/api/books";
import { toast } from "react-toastify";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingBookId, setRemovingBookId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

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
      await removeBookFromCart(bookId);
      toast.success("Book removed from cart");
      setCartBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId && book.id !== bookId)
      );
    } catch (error) {
      toast.error("Failed to remove book");
      console.error("Error removing book from cart:", error);
    } finally {
      setRemovingBookId(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cartBooks || cartBooks.length === 0) {
      toast.warn("Your cart is empty!");
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await placeOrder(cartBooks);
      toast.success(response.message || "Order placed successfully!");
      setCartBooks([]);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    return cartBooks.reduce((total, book) => total + (book.price || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-50">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchCartBooks}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
          {cartBooks.length > 0 && (
            <p className="text-gray-600">
              {cartBooks.length} {cartBooks.length === 1 ? "item" : "items"} in your cart
            </p>
          )}
        </div>

        {cartBooks.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any books yet. Start exploring our collection!
            </p>
            <button
              onClick={() => navigate("/all-books")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold inline-flex items-center gap-2"
            >
              Browse Books
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Cart Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {cartBooks.map((book) => (
                    <div key={book._id || book.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-6">
                        {/* Book Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={book.imageUrl || book.image || "/placeholder-book.jpg"}
                            alt={book.title}
                            className="w-28 h-36 object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-book.jpg";
                            }}
                          />
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                              {book.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                            {book.language && (
                              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                                {book.language}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="text-2xl font-bold text-indigo-600">
                              ₹{(book.price || 0).toFixed(2)}
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(book._id || book.id)}
                              disabled={removingBookId === (book._id || book.id)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              {removingBookId === (book._id || book.id) ? "Removing..." : "Remove"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cartBooks.length} {cartBooks.length === 1 ? "item" : "items"})</span>
                    <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        ₹{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || cartBooks.length === 0}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {placingOrder ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;