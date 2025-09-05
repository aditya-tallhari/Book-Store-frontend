import React, { useState, useEffect } from 'react';
import { Package, Calendar, Eye, Clock, CheckCircle, Truck, Star, BookOpen } from 'lucide-react';
import { getOrderHistory } from '../lib/api/books';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await getOrderHistory();
      setOrders(response.data || []);
      toast.dismiss(); // Dismiss any previous loading toasts
    } catch (error) {
      console.error('Error fetching order history:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch order history';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'order placed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'order placed':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const calculateOrderTotal = (books) => {
    return books.reduce((total, book) => total + (book.price || 0), 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrderHistory}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
            <p className="text-gray-600">Track and manage your book orders</p>
          </div>
          {/* Empty State */}
          <div className="text-center py-12">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
            <button
              onClick={() => navigate('/all-books')}
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your book orders</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="text-2xl font-bold text-indigo-600">{orders.length}</span>
              <span className="text-gray-600 ml-2">Total Orders</span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 font-semibold text-gray-700 text-sm">
              <div className="md:col-span-1">Order #</div>
              <div className="md:col-span-2">Books</div>
              <div className="md:col-span-1">Amount</div>
              <div className="md:col-span-1">Status</div>
              <div className="md:col-span-1">Date</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <div key={order._id} className="hover:bg-gray-50 transition-colors">
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                    {/* Order Number */}
                    <div className="md:col-span-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Books */}
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        {order.book.slice(0, 2).map((book) => (
                          <div key={book._id} className="flex items-center space-x-3">
                            <img
                              src={book.imageUrl || book.coverImage || 'https://placehold.co/40x60/E0E0E0/333333?text=Book'}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/40x60/E0E0E0/333333?text=Book';
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {book.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                by {book.author}
                              </p>
                              <p className="text-xs font-medium text-green-600">
                                ₹{book.price?.toFixed(2)}
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

                    {/* Amount */}
                    <div className="md:col-span-1">
                      <div className="text-lg font-bold text-green-600">
                        ₹{calculateOrderTotal(order.book).toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.book.length} item{order.book.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status || 'Order Placed'}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="md:col-span-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button (Mobile) */}
                  <div className="mt-4 md:hidden">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{selectedOrder === order._id ? 'Hide Details' : 'View Details'}</span>
                    </button>
                    
                    {selectedOrder === order._id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                        <div className="space-y-3">
                          {order.book.map((book) => (
                            <div key={book._id} className="flex items-center space-x-3 p-3 bg-white rounded border">
                              <img
                                src={book.imageUrl || book.coverImage || 'https://placehold.co/40x60/E0E0E0/333333?text=Book'}
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/40x60/E0E0E0/333333?text=Book';
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{book.title}</p>
                                <p className="text-sm text-gray-600">by {book.author}</p>
                                <p className="text-sm font-medium text-green-600">₹{book.price?.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
  );
};

export default OrderHistory;
