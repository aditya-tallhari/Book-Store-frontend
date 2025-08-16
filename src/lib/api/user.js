import axiosInstance from "../../lib/axios";

export const loginUser = async (credentials) => {
  try {
    const res = await axiosInstance.post("/auth/login", credentials, {
      withCredentials: true,
    });
    return res?.data || null; // return data or null if empty
  } catch (error) {
    console.error("Error logging in:", error);
    return null; // fallback to null on error
  }
};

export const signupUser = async (userData) => {
  try {
    // Return full axios response so .status works in component
    return await axiosInstance.post("/auth/signup", userData);
  } catch (error) {
    console.error("Error signing up:", error);
    throw error; // Let component handle error messages
  }
};

export const logoutUser = async () => {
  try {
    return await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Error in Logout:", error);
    throw error;
  }
};

