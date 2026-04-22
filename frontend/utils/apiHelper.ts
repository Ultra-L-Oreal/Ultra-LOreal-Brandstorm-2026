import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Request Interceptor: Attach Authorization Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// utils/apiHelper.ts - Add user type detection
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error: Check your connection.");
      return Promise.reject(new Error("Network error: Check your connection."));
    }

    const { status, data } = error.response;
    const errorMessage =
      data?.message || data?.error || "An unexpected error occurred.";

    console.error(`API Error [${status}]:`, errorMessage);

    if (status === 401) {
      // Only redirect if user is not already on a login/auth page
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isAuthPage = currentPath.includes("/auth/");

      if (!isAuthPage) {
        // User's session expired, redirect to login
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_type");
        window.location.href = "/";
      }
      // If already on auth page, just let the error propagate to show error message
    }

    if (status === 403 && data.message?.includes("user type")) {
      // Redirect to appropriate login based on attempted access
      const currentPath = window.location.pathname;
      if (currentPath.includes("/dashboard/onboarding/")) {
        window.location.href = "/auth/careers-login";
      } else {
        window.location.href = "/";
      }
    }

    return Promise.reject(new Error(errorMessage));
  },
);

export default api;
