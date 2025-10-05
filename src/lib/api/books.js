import axiosInstance from "../axios";

/**
 * Get all books with pagination
 */
export const getAllBooks = async (page = 1, limit = 10) => {
  try {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const isAdmin = localStorage.getItem("role") === "admin"; // assuming you store role in localStorage

    const headers = {
      ...(id && token ? { id, authorization: `Bearer ${token}` } : {}),
    };

    const endpoint = isAdmin ? "/admin/manage-books" : "/book/get-all-books";

    const response = await axiosInstance.get(endpoint, {
      headers,
      params: { page, limit },
    });

    // handle both response shapes
    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};


/**
 * Get recent books (for homepage, etc.)
 */
export const getRecentBooks = async () => {
  try {
    const res = await axiosInstance.get("/book/get-recent-books");
    return res?.data?.data || [];
  } catch (error) {
    console.error("Error fetching recent books:", error);
    return [];
  }
};

/**
 * Get a single book by ID
 */
export const getBookById = async (bookId) => {
  try {
    const res = await axiosInstance.get(`/book/get-by-id/${bookId}`);
    return res?.data?.data || null;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return null;
  }
};

/**
 * Add book to user's favourites
 */
export const addBookToFavourite = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
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
    throw error;
  }
};

/**
 * Get all favourite books
 */
export const getFavouriteBooks = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axiosInstance.get(
      "/favourite/get-favourite-books",
      { headers }
    );
    return response?.data?.favouriteBooks || [];
  } catch (error) {
    console.error("Error fetching favourite books:", error);
    throw error;
  }
};

/**
 * Remove book from favourites
 */
export const removeBookFromFavourites = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
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
    throw error;
  }
};

/**
 * Cart: Get all books
 */
export const getCartBooks = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axiosInstance.get("/cart/get-user-cart", {
      headers,
    });
    return response?.data?.cart || [];
  } catch (error) {
    console.error("Error fetching cart books:", error);
    throw error;
  }
};

/**
 * Cart: Add book
 */
export const addBookToCart = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
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
    throw error;
  }
};

/**
 * Cart: Remove book
 */
export const removeBookFromCart = async (bookId) => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
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
    throw error;
  }
};

/**
 * Place an order
 */
export const placeOrder = async (orderBooks) => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const requestBody = {
      orderItems: orderBooks.map((book) => ({
        bookId: book._id || book.id,
        quantity: book.quantity || 1,
      })),
    };
    const response = await axiosInstance.post(
      "/order/place-order",
      requestBody,
      { headers }
    );
    return response?.data || {};
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

/**
 * Get user's order history
 */
export const getOrderHistory = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axiosInstance.get("/order/get-order-history", {
      headers,
    });
    return response?.data || {};
  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error;
  }
};

/* ======================== ADMIN ========================== */

/**
 * Add a new book (Admin)
 */
export const addBook = async (bookData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Admin token not found.");

    const response = await axiosInstance.post("/book/add-book", bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data?.book || {};
  } catch (error) {
    console.error("Error adding book:", error?.response?.data || error.message);
    throw error;
  }
};
/** Get digital books (Admin)
 */
export const getDigitalBooks = async () => {
  try {
    const response = await axiosInstance.get("/book/get-digital-books");
    return response.data;
  } catch (error) {
    console.error("Error fetching digital books:", error);
    throw error;
  }
};
/**
 * Delete a book (Admin)
 */
export const deleteBook = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Admin token not found.");

    const response = await axiosInstance.delete(`/book/delete-book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data || {};
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

/**
 * Update book (Admin)
 */
export const updateBook = async (bookId, bookData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Admin token not found.");

    const response = await axiosInstance.put(
      `/book/update-book/${bookId}`,
      bookData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

/**
 * Get all orders (Admin)
 */
export const getAllOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Admin token not found.");

    const response = await axiosInstance.get("/order/get-all-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

/**
 * Update order status (Admin)
 */
export const updateStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Admin token not found.");

    const response = await axiosInstance.put(
      `/order/update-status/${orderId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response?.data?.data || {};
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error);
    throw error;
  }
};

/**
 * Get order by ID (Admin)
 */
export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Admin token not found.");

    const response = await axiosInstance.get(`/order/get-order/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response?.data?.data || {};
  } catch (error) {
    console.error(`Error fetching order by ID ${orderId}:`, error);
    throw error;
  }
};
