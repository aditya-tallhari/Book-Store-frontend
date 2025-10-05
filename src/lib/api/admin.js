// src/lib/api/admin.js
import axiosInstance from "../axios";

// Get admin analytics
export const getAdminAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      throw new Error("Unauthorized: Login required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      id: userId,
    };

    const response = await axiosInstance.get("/admin/analytics", { headers });
    return response.data;
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    throw error;
  }
};

// Get admin dashboard data
export const getAdminDashboard = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      throw new Error("Unauthorized: Login required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      id: userId,
    };

    const response = await axiosInstance.get("/admin/dashboard", { headers });
    return response.data;
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    throw error;
  }
};

// Get digital books
export const getDigitalBooks = async () => {
  try {
    const response = await axiosInstance.get("/book/get-digital-books");
    return response.data;
  } catch (error) {
    console.error("Digital Books Error:", error);
    throw error;
  }
};

// Get manage books
export const getManageBooks = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      throw new Error("Unauthorized: Login required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      id: userId,
    };

    const response = await axiosInstance.get("/admin/manage-books", { headers });
    return response.data;
  } catch (error) {
    console.error("Manage Books Error:", error);
    throw error;
  }
};
