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
    console.log("Error in Fetching the Book", error);
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

export const getFavouriteBooks = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    
    console.log("Fetching favourite books with headers:", headers);
    
    const response = await axiosInstance.get(
      "/favourite/get-favourite-books",
      { headers }
    );
    
    console.log("Favourite books response:", response.data);
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