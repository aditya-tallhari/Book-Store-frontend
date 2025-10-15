// src/pages/MyLibrary.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Book,
  Calendar,
  CheckCircle,
  Truck,
  Search,
  Eye,
  X,
  BookOpen,
  AlertCircle,
  Loader,
  Lock,
} from "lucide-react";
import { getMyLibrary, checkBookOwnership } from "../lib/api/read";

const MyLibrary = () => {
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyLibrary();
      setLibrary(response.data || []);
    } catch (error) {
      console.error("Error loading library:", error);
      setError(error.message || "Failed to load library. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (item) => {
    setSelectedBook(item);
    setDetailsLoading(true);

    try {
      const details = await checkBookOwnership(item.book._id);
      setBookDetails(details.data || details);
    } catch (error) {
      console.error("Error loading book details:", error);
      setBookDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleReadBook = async (item) => {
    // Check if book is delivered before allowing read
    if (!canReadBook(item.orderStatus)) {
      alert('This book is not yet delivered. You can only read books that have been delivered.');
      return;
    }

    // Validate book ID
    const bookId = item?.book?._id;
    if (!bookId) {
      console.error('Invalid book data:', item);
      alert('Unable to read this book. Book ID is missing.');
      return;
    }

    console.log('Attempting to read book:', bookId, item.book.title);

    // Verify ownership before navigating
    try {
      const ownership = await checkBookOwnership(bookId);
      if (ownership.hasAccess || ownership.data?.hasAccess) {
        console.log('Access verified, navigating to ReadBook page:', bookId);
        
        // Navigate to ReadBook page
        navigate(`/profile/read/${bookId}`);
      } else {
        alert('You do not have access to read this book.');
      }
    } catch (error) {
      console.error('Error verifying book access:', error);
      alert(`Unable to verify book access: ${error.message || 'Please try again.'}`);
    }
  };

  const closeModal = () => {
    setSelectedBook(null);
    setBookDetails(null);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200",
      Shipped: "bg-purple-100 text-purple-800 border-purple-200",
      "Out for Delivery": "bg-indigo-100 text-indigo-800 border-indigo-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          statusStyles[status] || statusStyles["Pending"]
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "-";
    }
  };

  const canReadBook = (orderStatus) => {
    return orderStatus === "Delivered";
  };

  const filteredLibrary = library.filter((item) => {
    const matchesSearch =
      item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.orderStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
          <p className="mt-2 text-gray-600">
            Manage and track your book collection ({library.length} books)
          </p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-full md:w-64">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredLibrary.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Book size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Start building your library by purchasing books"}
            </p>
          </div>
        )}

        {/* Books Table */}
        {filteredLibrary.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLibrary.map((item) => (
                    <tr
                      key={item.purchaseId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.book.imageUrl}
                            alt={item.book.title}
                            className="h-16 w-12 object-cover rounded shadow-sm"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"%3E%3Crect fill="%23ddd" width="100" height="150"/%3E%3Ctext x="50" y="75" font-size="14" text-anchor="middle" fill="%23999"%3EBook%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {item.book.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                              {item.book.desc}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.book.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.book.language}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {formatDate(item.purchasedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.orderStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Eye size={16} className="mr-1" />
                            Details
                          </button>
                          
                          {canReadBook(item.orderStatus) ? (
                            <button
                              onClick={() => handleReadBook(item)}
                              className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                            >
                              <BookOpen size={16} className="mr-1" />
                              Read
                            </button>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
                              title="Book must be delivered to read"
                            >
                              <Lock size={16} className="mr-1" />
                              Locked
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {filteredLibrary.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Book className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Books
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {library.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Delivered
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {library.filter(item => item.orderStatus === "Delivered").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    In Transit
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {library.filter(item => 
                      ["Shipped", "Out for Delivery", "Processing"].includes(item.orderStatus)
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book Details Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Book Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {detailsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="animate-spin h-8 w-8 text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <img
                        src={selectedBook.book.imageUrl}
                        alt={selectedBook.book.title}
                        className="h-48 w-32 object-cover rounded-lg shadow-md flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"%3E%3Crect fill="%23ddd" width="100" height="150"/%3E%3Ctext x="50" y="75" font-size="14" text-anchor="middle" fill="%23999"%3EBook%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedBook.book.title}
                        </h3>
                        <p className="text-lg text-gray-600 mb-4">
                          by {selectedBook.book.author}
                        </p>
                        <div className="mb-4">
                          {getStatusBadge(selectedBook.orderStatus)}
                        </div>
                        <p className="text-gray-700">
                          {selectedBook.book.desc}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Purchase Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Purchase ID</p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedBook.purchaseId}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Language</p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedBook.book.language}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Purchase Date</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(selectedBook.purchasedAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Accessed</p>
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(selectedBook.lastAccessedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {bookDetails && (
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Access Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center">
                            {(bookDetails.hasAccess || bookDetails.data?.hasAccess) ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-green-700 font-medium">
                                  You have access to read this book
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-red-700 font-medium">
                                  Access not available
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Close
                      </button>
                      {canReadBook(selectedBook.orderStatus) && (
                        <button
                          onClick={() => handleReadBook(selectedBook)}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          <BookOpen size={20} className="mr-2" />
                          Read Book
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;