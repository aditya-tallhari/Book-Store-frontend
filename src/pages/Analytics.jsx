// src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import { getAdminAnalytics } from "../lib/api/admin";
import {
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Award,
  Loader,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Activity
} from "lucide-react";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminAnalytics();
      setAnalytics(response.analytics);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: analytics?.users || 0,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      lightColor: "bg-blue-100"
    },
    {
      label: "Total Books",
      value: analytics?.books || 0,
      icon: BookOpen,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      lightColor: "bg-purple-100"
    },
    {
      label: "Total Orders",
      value: analytics?.orders || 0,
      icon: ShoppingCart,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      lightColor: "bg-green-100"
    },
    {
      label: "Total Revenue",
      value: `₹${analytics?.revenue || 0}`,
      icon: DollarSign,
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      lightColor: "bg-orange-100"
    }
  ];

  const topBooks = analytics?.topSellingBooks || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h2>
        <p className="text-gray-600">Comprehensive overview of your bookstore performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className={`px-3 py-1 ${stat.lightColor} rounded-full`}>
                  <Activity className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
          </div>
        ))}
      </div>

      {/* Revenue Highlight */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-semibold opacity-90">Total Revenue</h3>
                <p className="text-indigo-100 text-sm">From all orders</p>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-bold">₹{analytics?.revenue || 0}</p>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded-full">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <p className="text-indigo-100 mt-4">
              Generated from <strong>{analytics?.orders || 0}</strong> successful orders
            </p>
          </div>
          <div className="hidden lg:block">
            <BarChart3 className="w-32 h-32 opacity-20" />
          </div>
        </div>
      </div>

      {/* Top Selling Books */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Top Selling Books</h3>
              <p className="text-sm text-gray-600">Best performers in your store</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Top {topBooks.length}</span>
          </div>
        </div>

        {topBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No sales data available yet</p>
            <p className="text-gray-400 text-sm mt-2">Start selling books to see analytics</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topBooks.map((book, index) => {
              const colors = [
                { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", badge: "bg-amber-500" },
                { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", badge: "bg-gray-400" },
                { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", badge: "bg-orange-500" },
                { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", badge: "bg-blue-500" }
              ];
              const color = colors[index] || colors[3];

              return (
                <div
                  key={book.bookId}
                  className={`${color.bg} border ${color.border} rounded-xl p-5 hover:shadow-md transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank Badge */}
                      <div className="relative">
                        <div className={`w-14 h-14 ${color.badge} rounded-full flex items-center justify-center shadow-lg`}>
                          <span className="text-2xl font-bold text-white">#{index + 1}</span>
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1">
                            <Award className="w-6 h-6 text-amber-400 fill-amber-400" />
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 ${color.bg} border ${color.border} rounded-full`}>
                            <span className={`text-xs font-medium ${color.text}`}>
                              Book ID: {book.bookId.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sales Count */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <TrendingUp className={`w-5 h-5 ${color.text}`} />
                        <p className={`text-4xl font-bold ${color.text}`}>{book.totalSold}</p>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {book.totalSold === 1 ? 'copy sold' : 'copies sold'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900">User Growth</h4>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">{analytics?.users || 0}</p>
          <p className="text-sm text-gray-600">Registered users on platform</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Catalog Size</h4>
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-2">{analytics?.books || 0}</p>
          <p className="text-sm text-gray-600">Books available in store</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-gray-900">Order Volume</h4>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">{analytics?.orders || 0}</p>
          <p className="text-sm text-gray-600">Total orders processed</p>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Revenue per Order</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analytics?.orders > 0 ? Math.round(analytics.revenue / analytics.orders) : 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Books per User</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.users > 0 ? (analytics.books / analytics.users).toFixed(1) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;