import axiosInstance from "../axios";

export const getAllBooks = async () => {
  try {
    const res = await axiosInstance.get("/book/get-all-books");
    return res?.data?.data || []; // Always return an array
  } catch (error) {
    console.error("Error fetching books:", error);
    return []; // fallback to empty array on error
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
