// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getAdminAnalytics, getAdminDashboard } from "../lib/api/admin";
import { 
  Users, 
  BookOpen, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, dashboardData] = await Promise.all([
        getAdminAnalytics(),
        getAdminDashboard()
      ]);
      
      setAnalytics(analyticsData);
      setDashboard(dashboardData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: dashboard?.users || 0,
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      label: "Total Books",
      value: dashboard?.books || 0,
      icon: BookOpen,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      label: "Total Orders",
      value: dashboard?.orders || 0,
      icon: ShoppingCart,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      label: "Today's Revenue",
      value: `₹${dashboard?.revenueToday || 0}`,
      icon: DollarSign,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    }
  ];

  const orderStats = [
    {
      label: "Pending Orders",
      value: dashboard?.pendingOrders || 0,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "Delivered Orders",
      value: dashboard?.deliveredOrders || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Cancelled Orders",
      value: dashboard?.cancelledOrders || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Status & Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Status */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {orderStats.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Total Revenue</h3>
            </div>
            <p className="text-4xl font-bold mb-2">₹{analytics?.analytics?.revenue || 0}</p>
            <p className="text-indigo-100 text-sm">From {dashboard?.orders || 0} orders</p>
          </div>
        </div>

        {/* Top Selling Books */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Books</h2>
          {analytics?.analytics?.topSellingBooks && analytics.analytics.topSellingBooks.length > 0 ? (
            <div className="space-y-4">
              {analytics.analytics.topSellingBooks.map((book, index) => (
                <div
                  key={book.bookId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{book.totalSold}</p>
                    <p className="text-sm text-gray-600">sold</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>No sales data available yet</p>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        {dashboard?.lowStockBooks && dashboard.lowStockBooks.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboard.lowStockBooks.map((book) => (
                <div key={book._id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <p className="text-sm font-medium text-yellow-600">
                    Only {book.stock} left in stock
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;