import axios from "axios";
import store from "@/Redux/store";
import { refreshToken } from "@/Redux/Slices/authSlice";

// Set BASE_URL depending on environment
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://advizy.onrender.com/api/v1"
    : "http://localhost:5030/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 400; // Treat 302 as success
  },
});

// Response Interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await store.dispatch(refreshToken()); // refresh the token
        return axiosInstance(originalRequest); // retry request
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
