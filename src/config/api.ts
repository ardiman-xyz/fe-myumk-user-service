// src/config/api.ts - Fixed Auto Token Refresh
import axios, {
  type AxiosResponse,
  AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { tokenManager } from "@/utils/tokenManager";

export const API_CONFIG = {
  baseURL: "http://0.0.0.0:8080/api/",
  timeout: 5000,
  enableLogging: true,
};

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // Only try to get token if we already have one stored
    const hasStoredToken = !!tokenManager.getAccessToken();

    if (hasStoredToken) {
      const token = await tokenManager.getValidAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Logging
    if (API_CONFIG.enableLogging) {
      console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
      if (config.data && !config.url?.includes("/auth/")) {
        console.log("Request Data:", config.data);
      }
    }

    return config;
  },
  (error) => {
    if (API_CONFIG.enableLogging) {
      console.error("❌ Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors, token refresh, and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (API_CONFIG.enableLogging) {
      console.log("📥 API Response:", response.status, response.config.url);
      if (response.data && !response.config.url?.includes("/auth/")) {
        console.log("Response Data:", response.data);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;

    // Enhanced error logging
    if (API_CONFIG.enableLogging) {
      console.error("❌ API Error:", {
        status: response?.status,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        message: error.message,
        data: response?.data,
      });
    }

    // Handle 401 Unauthorized - Try token refresh
    if (response?.status === 401 && config) {
      const responseData = response.data as any;

      // Don't retry refresh token endpoint to avoid infinite loop
      if (
        config.url?.includes("/auth/refresh-token") ||
        config.url?.includes("/auth/login")
      ) {
        console.warn("⚠️ Auth endpoint failed, redirecting to login");
        tokenManager.clearTokens();
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      // Only try to refresh if we have a refresh token
      if (
        tokenManager.getRefreshToken() &&
        responseData?.code === "UNAUTHENTICATED"
      ) {
        console.warn("🔄 Token expired, attempting refresh...");

        try {
          // Try to refresh token
          const newToken = await tokenManager.refreshTokenNow();

          if (newToken && config.headers) {
            // Retry original request with new token
            config.headers.Authorization = `Bearer ${newToken}`;
            console.log("🔄 Retrying request with new token...");
            return apiClient.request(config);
          }
        } catch (refreshError) {
          console.error("❌ Token refresh failed:", refreshError);
        }

        // Refresh failed, redirect to login
        tokenManager.clearTokens();
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    // Handle 403 Forbidden errors
    if (response?.status === 403) {
      const responseData = response.data as any;

      if (responseData?.code === "INSUFFICIENT_PRIVILEGES") {
        console.warn(
          "⚠️ INSUFFICIENT_PRIVILEGES: User does not have super admin access"
        );
        tokenManager.clearTokens();
        window.location.href = "/unauthorized";
        return Promise.reject(error);
      }

      if (responseData?.code === "ACCOUNT_INACTIVE") {
        console.warn("⚠️ ACCOUNT_INACTIVE: User account is deactivated");
        tokenManager.clearTokens();
        window.location.href = "/account-inactive";
        return Promise.reject(error);
      }
    }

    // Handle network errors
    if (!response) {
      console.error("🚫 Network Error: Please check if the server is running");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
