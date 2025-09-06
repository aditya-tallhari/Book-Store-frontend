import React, { useEffect, useState } from "react";
import { getAllOrders, updateStatus, getOrderById } from "../lib/api/books";
import LoaderSVG from "../components/Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  User,
  BookOpen,
  Info,
  X,
} from "lucide-react";

// Modal component for displaying order details
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-900">#{order._id?.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Customer</p>
              <p className="font-semibold text-gray-900">{order.user?.username || "N/A"}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status || "Order placed"}</span>
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="font-semibold text-gray-900">
                {order.createdAt ? formatDate(order.createdAt) : "N/A"}
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-800 mb-4">Ordered Books</h4>
            <div className="space-y-4">
              {order.book?.map((book, index) => (
                <div key={book._id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={book.imageUrl || book.image || "https://placehold.co/50x75/E0E0E0/333333?text=Book"}
                    alt={book.title || "Book Cover"}
                    className="w-12 h-18 object-cover rounded shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/50x75/E0E0E0/333333?text=Book";
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{book.title || "N/A"}</p>
                    <p className="text-xs text-gray-500">by {book.author || "N/A"}</p>
                    <p className="text-sm font-semibold text-green-600">₹{book.price?.toFixed(2) || "N/A"}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No books found in this order</p>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{order.book?.reduce((total, b) => total + (b.price || 0), 0).toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper functions moved outside component to prevent recreation on each render
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "order placed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "out for delivery":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "canceled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "order placed":
      return <Clock className="w-4 h-4" />;
    case "out for delivery":
      return <Truck className="w-4 h-4" />;
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "canceled":
      return <X className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const statusOptions = ["Order placed", "Out for Delivery", "Delivered", "Canceled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return;
    
    try {
      setUpdatingOrderId(orderId);
      setMessage({ type: 'info', text: 'Updating order status...' });
      
      await updateStatus(orderId, newStatus);
      
      // Update the order in the local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      setMessage({ 
        type: 'success', 
        text: `Order #${orderId.slice(-6).toUpperCase()} status updated to "${newStatus}".` 
      });
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || "Failed to update status. Please try again." 
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewDetails = async (orderId) => {
    if (!orderId) return;
    
    try {
      const orderDetails = await getOrderById(orderId);
      setSelectedOrder(orderDetails);
    } catch (err) {
      console.error("❌ Failed to fetch order details:", err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || "Failed to fetch order details." 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-screen bg-gray-50">
        <LoaderSVG size={80} color="#6366F1" />
        <p className="mt-4 text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  if (error && (!orders || orders.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-xl text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-screen bg-gray-50">
        <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">No Orders Found</h3>
        <p className="text-gray-600">No customer orders have been placed yet.</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📦 All Orders (Admin)
            </h1>
            <p className="text-gray-600">Manage and track all customer orders</p>
            <div className="mt-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 inline-block">
              <span className="text-2xl font-bold text-indigo-600">
                {orders.length}
              </span>
              <span className="text-gray-600 ml-2">Total Orders</span>
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl text-center mb-6 font-medium ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : message.type === 'error' 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                    <div className="md:col-span-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          #{order._id?.slice(-8).toUpperCase() || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-indigo-500" />
                        <div>
                          <p className="font-medium">{order.user?.username || "N/A"}</p>
                          <p className="text-xs text-gray-500">
                            {order.user?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        {order.book && order.book.length > 0 ? (
                          <>
                            {order.book.slice(0, 2).map((book, bookIndex) => (
                              <div
                                key={book._id || bookIndex}
                                className="flex items-center space-x-3"
                              >
                                <img
                                  src={
                                    book.imageUrl ||
                                    book.image ||
                                    "https://placehold.co/40x60/E0E0E0/333333?text=Book"
                                  }
                                  alt={book.title || "Book Cover"}
                                  className="w-10 h-14 object-cover rounded shadow-sm"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/40x60/E0E0E0/333333?text=Book";
                                  }}
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {book.title || "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    by {book.author || "N/A"}
                                  </p>
                                  <p className="text-xs font-medium text-green-600">
                                    ₹{book.price?.toFixed(2) || "N/A"}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.book.length > 2 && (
                              <p className="text-xs text-gray-500 pl-13">
                                +{order.book.length - 2} more books
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No books found</p>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <div className="text-lg font-bold text-green-600">
                        ₹{order.book && order.book.length > 0 
                          ? order.book.reduce((total, b) => total + (b.price || 0), 0).toFixed(2)
                          : "0.00"
                        }
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.book?.length || 0} item{(order.book?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="md:col-span-1 flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <select
                          value={order.status || "Order placed"}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                          className={`block w-full px-2 py-1 text-xs font-semibold rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(order.status)}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => handleViewDetails(order._id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={!order._id}
                      >
                        <Info className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Orders are displayed in chronological order, most recent first.</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AllOrders;