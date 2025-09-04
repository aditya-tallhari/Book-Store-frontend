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

export const getUserInformation = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
    };

    const response = await axiosInstance.get(
      "/auth/get-user-information",
      { headers }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error fetching user information:", error);
    throw error; // Re-throw so components can handle it
  }
};

export const updateAddress = async (newAddress) => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
    };

    const response = await axiosInstance.put(
      "/auth/update-address",
      { address: newAddress },
      { headers }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

// ✅ Change Password
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
    };

    const response = await axiosInstance.put(
      "/auth/change-password",
      { oldPassword, newPassword },
      { headers }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// ✅ Delete Account
export const deleteAccount = async () => {
  try {
    const headers = {
      id: localStorage.getItem("id") || "mock-user-id",
      authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
    };

    const response = await axiosInstance.delete(
      "/auth/delete-account",
      { headers }
    );

    return response?.data || {};
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
