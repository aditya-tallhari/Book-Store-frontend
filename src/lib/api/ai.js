import axiosInstance from "../../lib/axios";

export const getAIBookInsights = async (bookId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: Login required to use AI features.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.get(
      `/ai/book/${bookId}/insights`,
      { headers }
    );
    
    return response?.data?.data || null;
  } catch (error) {
    console.error("AI Book Insights Error:", error);
    throw error;
  }
};