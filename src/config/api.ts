import axios, { type AxiosResponse, AxiosError } from "axios";

export const API_CONFIG = {
  baseURL: "http://0.0.0.0:8080/api/", // hardcode sementara
  timeout: 5000,
  enableLogging: true, // set false untuk production
};

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token-user-service");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logging
    if (API_CONFIG.enableLogging) {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
      if (config.data) {
        console.log("Request Data:", config.data);
      }
    }

    return config;
  },
  (error) => {
    if (API_CONFIG.enableLogging) {
      console.error("Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (API_CONFIG.enableLogging) {
      console.log("API Response:", response.status, response.config.url);
      if (response.data) {
        console.log("Response Data:", response.data);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    // Enhanced error logging
    if (API_CONFIG.enableLogging) {
      console.error("API Error:", {
        status: response?.status,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        message: error.message,
        data: response?.data,
      });
    }

    // Handle 403 Forbidden errors
    if (response?.status === 403) {
      const responseData = response.data as any;

      // Check if it's INSUFFICIENT_PRIVILEGES error
      if (responseData?.code === "INSUFFICIENT_PRIVILEGES") {
        console.warn(
          "⚠️ INSUFFICIENT_PRIVILEGES: User does not have super admin access"
        );

        // Clear stored auth data
        localStorage.removeItem("token-user-service");
        localStorage.removeItem("user-data");

        // Redirect to unauthorized page
        window.location.href = "/unauthorized";
        return Promise.reject(error);
      }

      // Handle ACCOUNT_INACTIVE error
      if (responseData?.code === "ACCOUNT_INACTIVE") {
        console.warn("⚠️ ACCOUNT_INACTIVE: User account is deactivated");

        // Clear stored auth data
        localStorage.removeItem("token-user-service");
        localStorage.removeItem("user-data");

        // Redirect to account inactive page
        window.location.href = "/account-inactive";
        return Promise.reject(error);
      }
    }

    // Handle 401 Unauthorized errors
    if (response?.status === 401) {
      const responseData = response.data as any;

      if (responseData?.code === "UNAUTHENTICATED") {
        console.warn("⚠️ UNAUTHENTICATED: Invalid or expired token");

        // Clear stored auth data
        localStorage.removeItem("token-user-service");
        localStorage.removeItem("user-data");

        // Redirect to login page only if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    // Handle network errors
    if (!response) {
      console.error("🚫 Network Error: Please check if the server is running");

      // You can show a toast notification here for network errors
      // toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
