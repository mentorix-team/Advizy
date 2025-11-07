import axios from "axios";
import store from "@/Redux/store";
import { refreshToken } from "@/Redux/Slices/authSlice";

// Set BASE_URL depending on environment.
// Prefer an explicit Vite env var `VITE_API_URL` when available (useful in dev).
// import.meta.env.PROD is true in Vite production builds.
const BASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
        ? import.meta.env.VITE_API_URL
        : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD)
            ? 'https://advizy.onrender.com/api/v1'
            : 'http://localhost:5030/api/v1';

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
        const originalRequest = error.config || {};
        const status = error.response?.status;
        const url = originalRequest.url || "";

        // Helpful debug logging to trace which requests are failing in the wild.
        // (Avoid logging sensitive tokens.)
        console.debug('[axios] response error', { status, url, retry: originalRequest._retry });

        // Do not attempt refresh for clearly public endpoints or the refresh endpoint itself
        const isPublicEndpoint = /meeting\/getfeedbackbyexpertid|calendar\/public|expert\/public/i.test(url);
        const isRefreshEndpoint = /user\/refresh-token|auth\/refresh|oauth\/refresh/i.test(url);

        if (!isPublicEndpoint && !isRefreshEndpoint && status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevents infinite loops
            try {
                await store.dispatch(refreshToken()); // Refresh the token via cookies
                return axiosInstance(originalRequest); // Retry the failed request
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
