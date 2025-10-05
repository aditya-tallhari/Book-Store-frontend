import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Book, User, DollarSign, Package, Globe, FileText, Link, Check, ArrowLeft, Save } from "lucide-react";
import { updateBook, getBookById } from "../lib/api/books";
import { toast } from "react-toastify";
import LoaderSVG from "../components/Loader/Loader";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    stock: "",
    image: null,
    gutenbergId: "",
    contentUrl: "",
    isDigital: false,
  });

  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Fetch book data on mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBookById(id);
        if (bookData) {
          setFormData({
            title: bookData.title || "",
            author: bookData.author || "",
            price: bookData.price || "",
            desc: bookData.desc || "",
            language: bookData.language || "",
            stock: bookData.stock || "",
            image: null,
            gutenbergId: bookData.gutenbergId || "",
            contentUrl: bookData.contentUrl || "",
            isDigital: bookData.isDigital || false,
          });
          setImagePreviewUrl(bookData.imageUrl || bookData.image || null);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch book data.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBook();
    } else {
      setLoading(false);
      toast.error("No book ID provided for update.");
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFormData((prev) => ({ ...prev, image: file }));
        setImagePreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const { title, author, price, desc, language, stock, isDigital, gutenbergId, contentUrl } = formData;
    
    if (!title || !author || !price || !desc || !language || !stock) {
      toast.error("Please fill out all required fields.");
      return false;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      toast.error("Price must be a positive number.");
      return false;
    }
    if (isNaN(Number(stock)) || Number(stock) < 0) {
      toast.error("Stock cannot be a negative number.");
      return false;
    }
    if (isDigital && (!gutenbergId || !contentUrl)) {
      toast.error("For digital books, please provide Gutenberg ID and Content URL.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoadingUpdate(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("price", formData.price);
    data.append("desc", formData.desc);
    data.append("language", formData.language);
    data.append("stock", formData.stock);
    data.append("isDigital", formData.isDigital);
    
    if (formData.isDigital) {
      data.append("gutenbergId", formData.gutenbergId);
      data.append("contentUrl", formData.contentUrl);
    }
    
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await updateBook(id, data);
      toast.success("Book updated successfully!");
      setTimeout(() => navigate(`/view-details/${id}`), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update book. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/view-details/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <LoaderSVG size={60} color="#6366F1" />
          <p className="text-gray-600 font-medium mt-4">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Details
        </motion.button>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <Save className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Update Book</h1>
          <p className="text-gray-600 text-lg">Modify the book details and save your changes</p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <div className="space-y-8">

              {/* Image Upload Section */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Book Cover Image
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : imagePreviewUrl 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-indigo-400 bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    id="book-image" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden"
                    ref={fileInputRef}
                  />
                  
                  {imagePreviewUrl ? (
                    <div className="p-4 flex items-center gap-4">
                      <img 
                        src={imagePreviewUrl} 
                        alt="Preview" 
                        className="w-32 h-44 object-cover rounded-lg shadow-md border-2 border-white"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Current book cover</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Upload a new image to replace the current one</p>
                        <label 
                          htmlFor="book-image" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Change Image
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label 
                      htmlFor="book-image" 
                      className="flex flex-col items-center justify-center py-12 cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-indigo-600" />
                      </div>
                      <p className="text-base font-medium text-gray-900 mb-1">
                        Drop your image here, or <span className="text-indigo-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </label>
                  )}
                </div>
              </motion.div>

              {/* Title and Author Row */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Book className="w-4 h-4 text-indigo-600" />
                    Title *
                  </label>
                  <input 
                    id="title" 
                    name="title" 
                    type="text" 
                    placeholder="Enter book title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="author" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Author *
                  </label>
                  <input 
                    id="author" 
                    name="author" 
                    type="text" 
                    placeholder="Enter author name" 
                    value={formData.author} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required 
                  />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Description *
                </label>
                <textarea 
                  id="description" 
                  name="desc" 
                  rows={4} 
                  value={formData.desc} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
                  placeholder="Enter a detailed description of the book..."
                  required
                />
              </motion.div>

              {/* Price, Stock, Language Row */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    Price (₹) *
                  </label>
                  <input 
                    id="price" 
                    name="price" 
                    type="number" 
                    placeholder="249" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Package className="w-4 h-4 text-indigo-600" />
                    Stock *
                  </label>
                  <input 
                    id="stock" 
                    name="stock" 
                    type="number" 
                    placeholder="999" 
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="language" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Language *
                  </label>
                  <input 
                    id="language" 
                    name="language" 
                    type="text" 
                    placeholder="English" 
                    value={formData.language} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required 
                  />
                </div>
              </motion.div>

              {/* Digital Book Toggle */}
              <motion.div variants={itemVariants}>
                <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <input 
                    type="checkbox" 
                    id="isDigital" 
                    name="isDigital" 
                    checked={formData.isDigital}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="isDigital" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-900 mb-1">Digital Book (Project Gutenberg)</div>
                    <p className="text-sm text-gray-600">Check this if the book is available digitally through Project Gutenberg</p>
                  </label>
                </div>
              </motion.div>

              {/* Digital Book Fields */}
              <AnimatePresence>
                {formData.isDigital && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl border-2 border-indigo-200 space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Book className="w-5 h-5 text-indigo-600" />
                        Digital Book Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="gutenbergId" className="block text-sm font-semibold text-gray-900 mb-2">
                            Gutenberg ID *
                          </label>
                          <input 
                            id="gutenbergId" 
                            name="gutenbergId" 
                            type="number" 
                            placeholder="e.g., 84" 
                            value={formData.gutenbergId} 
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                            required={formData.isDigital}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="contentUrl" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                            <Link className="w-4 h-4 text-indigo-600" />
                            Content URL *
                          </label>
                          <input 
                            id="contentUrl" 
                            name="contentUrl" 
                            type="url" 
                            placeholder="https://www.gutenberg.org/ebooks/84.html.images" 
                            value={formData.contentUrl} 
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                            required={formData.isDigital}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="pt-4 flex gap-4">
                <motion.button
                  type="button"
                  onClick={handleGoBack}
                  className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loadingUpdate}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  whileHover={{ scale: loadingUpdate ? 1 : 1.01 }}
                  whileTap={{ scale: loadingUpdate ? 1 : 0.99 }}
                >
                  {loadingUpdate ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Update Book</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-500">
          <p>* Required fields must be filled out</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UpdateBook;