import axiosInstance from "../../lib/axios";

// Get user's library
export const getMyLibrary = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/reading/my-library', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching library:', error);
    throw error.response?.data || { message: 'Failed to fetch library' };
  }
};

export const checkBookOwnership = async (bookId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get(`/reading/check-ownership/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking ownership:', error);
    throw error.response?.data || { message: 'Failed to check ownership' };
  }
};

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get book metadata for reading
 * @param {string} bookId - The ID of the book
 * @returns {Promise<Object>} Book metadata
 */
export const getBookMetadata = async (bookId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axiosInstance.get(`/reading/metadata/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching book metadata:', error);
    throw error.response?.data || { message: error.message || 'Failed to fetch book metadata' };
  }
};

/**
 * Get the book content URL for iframe
 * @param {string} bookId - The ID of the book
 * @returns {Promise<string>} Full URL for iframe with authentication
 */
export const getBookContentUrl = async (bookId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get the base URL from axios instance
    const baseURL = axiosInstance.defaults.baseURL;
    
    // Include token in URL for iframe access
    return `${baseURL}/reading/read/${bookId}?token=${encodeURIComponent(token)}`;
  } catch (error) {
    console.error('Error generating content URL:', error);
    throw error;
  }
}