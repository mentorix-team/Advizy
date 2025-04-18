import axios from "axios";
import store from "@/Redux/store";
import { refreshToken } from "@/Redux/Slices/authSlice";

const BASE_URL = "https://advizy.onrender.com/api/v1";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Allows sending cookies
});

// Response Interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevents infinite loops

            try {
                await store.dispatch(refreshToken()); // Refresh the token
                return axiosInstance(originalRequest); // Retry the failed request
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
