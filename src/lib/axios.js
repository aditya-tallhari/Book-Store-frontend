// src/api/axios.js
import axios from "axios";

// Use different API URLs for development and production
const BASE_URL =
  import.meta.env.MODE === "Production"
    ? "http://localhost:5002/api" // dev server
    : "https://book-store-backend-project.vercel.app/api"; // production (relative path, works with reverse proxy)

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // include cookies in requests
});

export default axiosInstance;
