import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, AlertCircle, RefreshCw, BookOpen, Users, Target, Lightbulb, TrendingUp } from "lucide-react";
import { getAIBookInsights } from "../lib/api/ai";
import { toast } from 'react-toastify';

const AIBookInsights = ({ bookId, bookTitle, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const resetState = useCallback(() => {
    setInsights(null);
    setError(null);
    setRetryCount(0);
  }, []);

  const fetchInsights = useCallback(async (isRetry = false) => {
    if (!bookId) {
      setError("Invalid book ID provided.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAIBookInsights(bookId);
      
      if (data && Object.keys(data).length > 0) {
        setInsights(data);
        setRetryCount(0);
        
        if (isRetry) {
          toast.success("AI insights loaded successfully!");
        }
      } else {
        throw new Error("AI service returned empty insights for this book.");
      }
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to get insights. Please try again.";
      
      setError(errorMessage);
      
      // Handle different error types
      if (err.response?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else if (err.response?.status === 403) {
        toast.error("Access denied. AI features may not be available for your account.");
      } else if (err.response?.status === 429) {
        toast.error("Too many requests. Please wait a moment before trying again.");
      } else if (err.response?.status === 503) {
        toast.error("AI service is temporarily unavailable. Please try again later.");
      } else if (!isRetry) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast.error("Maximum retry attempts reached. Please try again later.");
      return;
    }

    setRetryCount(prev => prev + 1);
    
    // Add delay for retries to avoid overwhelming the server
    if (retryCount > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
    }
    
    await fetchInsights(true);
  }, [retryCount, fetchInsights]);

  useEffect(() => {
    if (!isOpen || !bookId) {
      resetState();
      return;
    }

    fetchInsights();
  }, [bookId, isOpen, fetchInsights, resetState]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 120,
        mass: 1
      }
    },
    exit: { 
      y: "100vh", 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-12 h-12 text-indigo-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="mt-4 text-lg font-medium text-gray-700">
          Generating AI insights...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Analyzing "{bookTitle}" with advanced AI
        </p>
      </motion.div>
      <motion.div 
        className="mt-6 flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-indigo-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );

  const ErrorState = () => (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        Unable to Generate Insights
      </h4>
      <p className="text-red-600 mb-6 max-w-md leading-relaxed">{error}</p>
      
      {retryCount < MAX_RETRIES && (
        <motion.button
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          onClick={handleRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Retrying...' : `Retry (${retryCount}/${MAX_RETRIES})`}
        </motion.button>
      )}
      
      {retryCount >= MAX_RETRIES && (
        <p className="text-sm text-gray-500 mt-4">
          Please try again later or contact support if the problem persists.
        </p>
      )}
    </motion.div>
  );

  const InsightsContent = () => {
    if (!insights) return null;

    const sections = [
      {
        title: "Summary",
        icon: BookOpen,
        content: insights.summary,
        className: "bg-blue-50 border-blue-200"
      },
      {
        title: "Key Themes",
        icon: Lightbulb,
        content: insights.themes,
        className: "bg-purple-50 border-purple-200",
        isArray: true
      },
      {
        title: "Target Audience",
        icon: Users,
        content: insights.audience,
        className: "bg-green-50 border-green-200"
      },
      {
        title: "Marketing Appeal",
        icon: Target,
        content: insights.marketingBlurb,
        className: "bg-orange-50 border-orange-200",
        isQuote: true
      },
      {
        title: "Similar Books",
        icon: TrendingUp,
        content: insights.similarBooks,
        className: "bg-indigo-50 border-indigo-200",
        isSimilarBooks: true
      }
    ];

    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {sections.map((section, index) => {
          if (!section.content || (Array.isArray(section.content) && section.content.length === 0)) {
            return null;
          }

          const Icon = section.icon;

          return (
            <motion.div
              key={section.title}
              className={`p-4 rounded-xl border-2 ${section.className}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-gray-700" />
                <h4 className="text-lg font-bold text-gray-800">
                  {section.title}
                </h4>
              </div>

              {section.isArray ? (
                <div className="flex flex-wrap gap-2">
                  {section.content.map((theme, idx) => (
                    <motion.span
                      key={idx}
                      className="bg-white/70 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {theme}
                    </motion.span>
                  ))}
                </div>
              ) : section.isSimilarBooks ? (
                <ul className="space-y-2">
                  {section.content.map((book, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-2 p-2 bg-white/50 rounded-lg"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                    >
                      <span className="text-indigo-600 font-medium">•</span>
                      <span className="text-gray-700">
                        <strong>{book.title}</strong> by {book.author}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className={`text-gray-700 leading-relaxed ${
                  section.isQuote ? 'italic font-medium border-l-4 border-orange-300 pl-4' : ''
                }`}>
                  {section.isQuote && '"'}{section.content}{section.isQuote && '"'}
                </p>
              )}
            </motion.div>
          );
        })}

        {/* AI Attribution */}
        <motion.div
          className="text-center pt-4 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Generated by AI • Results may vary
          </p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            variants={contentVariants}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 z-10 flex justify-between items-center p-6 text-white">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-7 h-7" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">AI Book Insights</h3>
                  <p className="text-indigo-200 text-sm truncate max-w-md">
                    {bookTitle || "Analyzing book content"}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close insights"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                {loading && <LoadingState />}
                {error && !loading && <ErrorState />}
                {insights && !loading && !error && <InsightsContent />}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIBookInsights;