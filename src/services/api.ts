import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/auth";

export const TOKEN_STORAGE_KEY = "olarge_admin_token";
export const USER_STORAGE_KEY = "olarge_admin_user";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/v1";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token & x-api-key
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey && config.headers) {
      config.headers["x-api-key"] = apiKey;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration & Errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // If 401 Unauthorized occurs on an authenticated route, clear storage and redirect
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes("/auth/login");
      if (!isAuthEndpoint) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.href = "/login?session=expired";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
