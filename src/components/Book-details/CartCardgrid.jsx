// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartBooks, removeBookFromCart } from "../../lib/api/books";
import { placeOrder } from "../../lib/api/books";
import { toast } from "react-toastify";
import { ShoppingCart, Trash2, Package, ArrowRight } from "lucide-react";

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
      // Place order with cart books
      const response = await placeOrder(cartBooks);
      
      // Show success message
      toast.success(response.message || "Order placed successfully!");
      
      // Clear cart and navigate to order history
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchCartBooks}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">
            {cartBooks.length} {cartBooks.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cartBooks.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any books yet. Start exploring our collection!
              </p>
              <button
                onClick={() => navigate("/books")}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold inline-flex items-center gap-2"
              >
                Browse Books
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartBooks.map((book) => (
                <div
                  key={book._id || book.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={book.imageUrl || book.image || "/placeholder-book.jpg"}
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                        {book.language && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {book.language}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-2xl font-bold text-indigo-600">
                          ₹{book.price || 0}
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(book._id || book.id)}
                          disabled={removingBookId === (book._id || book.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {removingBookId === (book._id || book.id)
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Single, Clean Design */}
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
        )}
      </div>
    </div>
  );
};

export default Cart;