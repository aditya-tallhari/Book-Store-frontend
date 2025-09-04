import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { addBook } from "../lib/api/books"; // Import the API function
import LoaderSVG from "../components/Loader/Loader";; // Custom loader

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    stock: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // null, true, false
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  
  // Animation variants for the form's overall container
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  // Animation variants for individual form items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreviewUrl(null);
    }
  };

  const validateForm = () => {
    const { title, author, price, desc, language, stock, image } = formData;
    if (!title || !author || !price || !desc || !language || !stock) {
      setError("Please fill out all fields.");
      return false;
    }
    if (!image) {
      setError("Please upload a book cover image.");
      return false;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
        setError("Price must be a positive number.");
        return false;
    }
    if (isNaN(Number(stock)) || Number(stock) < 0) {
        setError("Stock cannot be a negative number.");
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!validateForm()) return;
    
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("price", formData.price);
    data.append("desc", formData.desc);
    data.append("language", formData.language);
    data.append("stock", formData.stock);
    if (formData.image) {
      data.append("image", formData.image); // The field name must be "image"
    }

    try {
      await addBook(data);
      setSuccess("Book added successfully!");
      // Reset form
      setFormData({ title: "", author: "", price: "", desc: "", language: "", stock: "", image: null });
      setImagePreviewUrl(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add book. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex justify-center bg-gray-50">
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-6 md:p-10 max-w-2xl w-full"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add New Book</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <motion.div variants={itemVariants}>
            <p className="text-base font-medium text-gray-700 mb-2">Book Cover Image</p>
            <div className="flex items-center gap-4 flex-wrap">
                <input 
                    type="file" 
                    id="book-image" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden"
                    ref={fileInputRef}
                />
                <label htmlFor="book-image" className="cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-200 rounded-md py-2 px-4 font-semibold text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 4-4v5z" clipRule="evenodd" /></svg>
                    <span>Upload Image</span>
                </label>
                {imagePreviewUrl && (
                    <img src={imagePreviewUrl} alt="Preview" className="w-24 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm" />
                )}
            </div>
          </motion.div>

          {/* Title and Author */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700" htmlFor="title">Title</label>
              <input id="title" name="title" type="text" placeholder="e.g., The Silent Read" value={formData.title} onChange={handleInputChange} className="outline-none py-2.5 px-3 rounded-md border border-gray-300 focus:border-indigo-500 transition-colors" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700" htmlFor="author">Author</label>
              <input id="author" name="author" type="text" placeholder="e.g., Mark Twain" value={formData.author} onChange={handleInputChange} className="outline-none py-2.5 px-3 rounded-md border border-gray-300 focus:border-indigo-500 transition-colors" required />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="flex flex-col gap-1">
            <label className="text-base font-medium text-gray-700" htmlFor="description">Description</label>
            <textarea id="description" name="desc" rows={4} value={formData.desc} onChange={handleInputChange} className="outline-none py-2.5 px-3 rounded-md border border-gray-300 resize-none focus:border-indigo-500 transition-colors" placeholder="A brief description of the book..." required></textarea>
          </motion.div>

          {/* Price, Stock, and Language */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700" htmlFor="price">Price (₹)</label>
              <input id="price" name="price" type="number" placeholder="9.99" value={formData.price} onChange={handleInputChange} className="outline-none py-2.5 px-3 rounded-md border border-gray-300 focus:border-indigo-500 transition-colors" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700" htmlFor="stock">Stock</label>
              <input id="stock" name="stock" type="number" placeholder="50" value={formData.stock} onChange={handleInputChange} className="outline-none py-2.5 px-3 rounded-md border border-gray-300 focus:border-indigo-500 transition-colors" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700" htmlFor="language">Language</label>
              <input id="language" name="language" type="text" placeholder="e.g., English" value={formData.language} onChange={handleInputChange} className="outline-none py-2.5 px-3 rounded-md border border-gray-300 focus:border-indigo-500 transition-colors" required />
            </div>
          </motion.div>

          {/* Submit Button & Messages */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            {loading && (
              <div className="flex justify-center">
                <LoaderSVG size={40} color="#6366F1" />
              </div>
            )}
            {error && (
              <motion.div
                className="text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                className="text-green-600 text-sm text-center font-medium bg-green-50 p-2 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {success}
              </motion.div>
            )}
            <motion.button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Book"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBook;
