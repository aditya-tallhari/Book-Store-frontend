import React, { useEffect, useState } from "react";
import { getAllOrders, updateStatus, getOrderById } from "../lib/api/books";
import LoaderSVG from "../components/Loader/Loader";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  User,
  BookOpen,
  Info,
  X,
} from "lucide-react";
import { toast } from "react-toastify"; // Import toast

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ state for popup

  const statusOptions = ["Order placed", "Out for Delivery", "Delivered", "Canceled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    toast.promise(
      updateStatus(orderId, newStatus),
      {
        pending: "Updating order status...",
        success: `Order #${orderId.slice(-6)} status updated to ${newStatus}.`,
        error: "Failed to update status. Please try again.",
      },
      {
        position: toast.POSITION.BOTTOM_RIGHT, // Customize toast position
      }
    ).then(() => {
      fetchOrders(); // Refresh orders after successful update
    }).catch(err => {
      console.error("❌ Failed to update status:", err);
    });
  };

  const handleViewDetails = async (orderId) => {
    try {
      const orderDetails = await getOrderById(orderId);
      setSelectedOrder(orderDetails); // ✅ open popup with details
    } catch (err) {
      console.error("❌ Failed to fetch order details:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch order details.";
      toast.error(errorMessage);
    }
  };

  const closeModal = () => setSelectedOrder(null);

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
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-screen bg-gray-50">
        <LoaderSVG size={80} color="#6366F1" />
        <p className="mt-4 text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-xl text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-screen bg-gray-50">
        <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">No Orders Found</h3>
        <p className="text-gray-600">No one has placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Content */}
      <div className={`min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        selectedOrder ? 'blur-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <div
                  key={order._id}
                  className="px-6 py-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                    {/* Order Number */}
                    <div className="md:col-span-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* User Info */}
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

                    {/* Books */}
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        {order.book.slice(0, 2).map((book) => (
                          <div
                            key={book._id}
                            className="flex items-center space-x-3"
                          >
                            <img
                              src={
                                book.imageUrl ||
                                book.coverImage ||
                                "https://placehold.co/40x60/E0E0E0/333333?text=Book"
                              }
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/40x60/E0E0E0/333333?text=Book";
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
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="md:col-span-1">
                      <div className="text-lg font-bold text-green-600">
                        ₹
                        {order.book
                          .reduce((total, b) => total + (b.price || 0), 0)
                          .toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.book.length} item{order.book.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Status Dropdown */}
                    <div className="md:col-span-1 flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <select
                          value={order.status || "Order placed"}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`block w-full px-2 py-1 text-xs font-semibold rounded-full border focus:outline-none transition-colors ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewDetails(order._id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-300 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Orders are displayed in chronological order, most recent first.</p>
          </div>
        </div>
      </div>

      {/* ✅ Order Details Modal with Blur Background */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order #{selectedOrder._id.slice(-8).toUpperCase()}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Details</h3>
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {selectedOrder.user?.username}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {selectedOrder.user?.email}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Order Info</h3>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Placed On:</span> {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Ordered Books</h3>
                  <div className="space-y-3">
                    {selectedOrder.book.map((book) => (
                      <div key={book._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={
                            book.imageUrl ||
                            book.coverImage ||
                            "https://placehold.co/60x80/E0E0E0/333333?text=Book"
                          }
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/60x80/E0E0E0/333333?text=Book";
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-sm text-gray-600">by {book.author}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">₹{book.price?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{selectedOrder.book.reduce((total, book) => total + (book.price || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedOrder.book.length} item{selectedOrder.book.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
