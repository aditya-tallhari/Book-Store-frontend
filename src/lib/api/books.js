import axiosInstance from "../../lib/axios";

export const getAllBooks = async () => {
  try {
    const res = await axiosInstance.get("/book/get-all-books");
    return res?.data?.data || []; // Always return an array
  } catch (error) {
    console.error("Error fetching books:", error);
    return []; // fallback to empty array on erroar
  }
};

export const getRecentBooks=async()=>{
    try {
        const res=await axiosInstance.get("/book/get-recent-books");
        return res?.data?.data || [];
    } catch (error) {
    console.error("Error fetching books:", error);
    return []; // fallback to empty array on error
    }
}

export const getBookById = async (id) => {
  try {
    const res = await axiosInstance.get(`/book/get-by-id/${id}`);
    return res?.data?.data || null; // null instead of [] since it's a single book
  } catch (error) {
    // console.log("Error in Fetching the Book", error);
    return null;
  }
};

export const addBookToFavourite = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
      bookid: bookId,
    };
    
    const response = await axiosInstance.put(
      "/favourite/add-book-to-favourite", 
      {}, 
      { headers }
    );
    return response?.data || {};
  } catch (error) {
    console.error("Error adding book to favourites:", error);
    throw error; // Re-throw to handle in component
  }
};


/**
 * Get all books in user's cart
 */
export const getCartBooks = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
    };

    const response = await axiosInstance.get(
      "/cart/get-user-cart",
      { headers }
    );
    
    return response?.data?.cart || [];
  } catch (error) {
    console.error("Error fetching cart books:", error);
    throw error; // Re-throw to handle in component
  }
};

/**
 * Add a book to user's cart
 */
export const addBookToCart = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
      bookid: bookId,
    };

    const response = await axiosInstance.put(
      "/cart/add-to-cart",
      {},
      { headers }
    );
    
    return response?.data || {};
  } catch (error) {
    console.error("Error adding book to cart:", error);
    throw error; // Re-throw to handle in component
  }
};

/**
 * Remove a book from user's cart
 */
export const removeBookFromCart = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
      bookid: bookId,
    };

    const response = await axiosInstance.put(
      "/cart/remove-from-cart",
      {},
      { headers }
    );
    
    return response?.data || {};
  } catch (error) {
    console.error("Error removing book from cart:", error);
    throw error; // Re-throw to handle in component
  }
};

export const getFavouriteBooks = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    
    // console.log("Fetching favourite books with headers:", headers);
    
    const response = await axiosInstance.get(
      "/favourite/get-favourite-books",
      { headers }
    );
    
    // console.log("Favourite books response:", response.data);
    return response?.data?.favouriteBooks || [];
    
  } catch (error) {
    console.error("Error fetching favourite books:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const removeBookFromFavourites = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
      bookid: bookId,
    };

    const response = await axiosInstance.put(
      "/favourite/remove-book-from-favourite", 
      {}, 
      { headers }
    );
    return response?.data || {};

  } catch (error) {
    console.error("Error removing book from favourites:", error);
    throw error; // Re-throw to handle in component
  }
}

export const placeOrder = async (orderBooks) => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
    };

    const requestBody = {
      orderItems: orderBooks.map(book => ({
        bookId: book._id || book.id,
        quantity: book.quantity || 1 // make sure quantity is included
      }))
    };

    const response = await axiosInstance.post(
      "/order/place-order", 
      requestBody, 
      { headers }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error placing order:", error);
    throw error; // Re-throw to handle in component
  }
};


export const getOrderHistory = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
    };
    
    const response = await axiosInstance.get(
      "/order/get-order-history", 
      { headers }
    );
    return response?.data || {};
  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error; // Re-throw to handle in component
  }
};

export const addBook = async (bookData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Admin token not found.");

    const response = await axiosInstance.post(
      "/book/add-book",
      bookData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ only this
        },
      }
    );

    return response?.data?.book || {};
  } catch (error) {
    console.error("Error adding book:", error?.response?.data || error.message);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: Admin token not found.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.delete(
      `/book/delete-book/${bookId}`,
      { headers }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error; // Re-throw to handle in component
  }
};

/**
 * @desc Updates a book in the database (Admin)
 * @param {string} bookId - The ID of the book to update
 * @param {object} bookData - The FormData object containing updated book details and the image file
 * @returns {object} The updated book object
 */
export const updateBook = async (bookId, bookData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: Admin token not found.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Crucial for sending files
    };

    const response = await axiosInstance.put(
      `/book/update-book/${bookId}`,
      bookData,
      { headers }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error updating book:", error);
    throw error; // Re-throw to handle in component
  }
};


/**
 * @desc Fetches all orders from the database (Admin only)
 * @returns {Array<object>} An array of all order objects
 */
export const getAllOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: Admin token not found.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.get(
      "/order/get-all-orders",
      { headers }
    );

    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error; // Re-throw to handle in component
  }
};


/**
 * @desc Updates an order's status (Admin only)
 * @param {string} orderId - The ID of the order to update
 * @param {string} newStatus - The new status of the order (e.g., "Shipped")
 * @returns {object} The updated order object
 */
export const updateStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: Admin token not found.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.put(
      `/order/update-status/${orderId}`,
      { status: newStatus },
      { headers }
    );

    return response?.data?.data || {};
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error);
    throw error;
  }
};

/**
 * @desc Fetches a single order by its ID (Admin only)
 * @param {string} orderId - The ID of the order to fetch
 * @returns {object} The order object
 */
export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: Admin token not found.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.get(
      `/order/get-order/${orderId}`,
      { headers }
    );

    return response?.data?.data || {};
  } catch (error) {
    console.error(`Error fetching order by ID ${orderId}:`, error);
    throw error;
  }
};
