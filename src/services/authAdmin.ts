// src/services/adminAuthService.ts - Updated with Token Refresh
import apiClient from "@/config/api";
import { tokenManager } from "@/utils/tokenManager";
import type { AdminLoginFormData } from "@/types/authAdmin";

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
      is_super_admin: boolean;
      last_login_at?: string;
    };
    access_token: string;
    refresh_token: string;
    token_type: string;
    access_expires_at: string;
    refresh_expires_at: string;
    device_name: string;
  };
  code?: string;
  errors?: Record<string, string[]>;
}

export const adminAuthService = {
  async login(credentials: AdminLoginFormData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        ...credentials,
        device_name: "web-app",
      });

      // If login successful, store tokens
      if (response.data.success && response.data.data) {
        const data = response.data.data;

        // Store tokens using token manager
        tokenManager.setTokens(
          data.access_token,
          data.refresh_token,
          data.access_expires_at,
          data.refresh_expires_at
        );

        // Store user data
        localStorage.setItem("user-data", JSON.stringify(data.user));

        console.log("✅ Login successful, tokens stored");
        console.log(
          `🕐 Access token expires: ${new Date(
            data.access_expires_at
          ).toLocaleString()}`
        );
        console.log(
          `🕐 Refresh token expires: ${new Date(
            data.refresh_expires_at
          ).toLocaleString()}`
        );
      }

      return response.data;
    } catch (error: any) {
      // Handle axios error
      if (error.response?.data) {
        const errorData = error.response.data;

        // Log specific error codes
        if (errorData.code === "INSUFFICIENT_PRIVILEGES") {
          console.warn("⚠️ User does not have super admin privileges");
        } else if (errorData.code === "ACCOUNT_INACTIVE") {
          console.warn("⚠️ User account is inactive");
        } else if (errorData.code === "INVALID_CREDENTIALS") {
          console.warn("⚠️ Invalid login credentials");
        }

        return error.response.data;
      }

      // Handle network error
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post<LoginResponse>(
        "/auth/refresh-token",
        {
          refresh_token: refreshToken,
          device_name: "web-app",
        }
      );

      // If refresh successful, store new tokens
      if (response.data.success && response.data.data) {
        const data = response.data.data;

        tokenManager.setTokens(
          data.access_token,
          data.refresh_token,
          data.access_expires_at,
          data.refresh_expires_at
        );

        // Update user data if provided
        if (data.user) {
          localStorage.setItem("user-data", JSON.stringify(data.user));
        }

        console.log("✅ Token refreshed successfully");
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ Token refresh failed:", error);

      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to refresh token");
    }
  },

  async logout(): Promise<void> {
    try {
      // Call logout endpoint with current access token
      await apiClient.post("/auth/logout");
      console.log("✅ Logout API call successful");
    } catch (error) {
      console.error("❌ Logout API error:", error);
      // Continue with cleanup even if API call fails
    } finally {
      // Always clear tokens and user data
      tokenManager.clearTokens();
      console.log("🧹 Auth data cleared");
    }
  },

  async logoutAll(): Promise<void> {
    try {
      // Call logout all devices endpoint
      await apiClient.post("/auth/logout-all");
      console.log("✅ Logout all devices successful");
    } catch (error) {
      console.error("❌ Logout all devices error:", error);
    } finally {
      // Always clear local data
      tokenManager.clearTokens();
      console.log("🧹 Auth data cleared");
    }
  },

  async getMe(): Promise<LoginResponse> {
    try {
      const response = await apiClient.get<LoginResponse>("/auth/me");

      // Update stored user data if successful
      if (response.data.success && response.data.data?.user) {
        localStorage.setItem(
          "user-data",
          JSON.stringify(response.data.data.user)
        );
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to get user information");
    }
  },

  // Helper methods
  isAuthenticated(): boolean {
    return (
      tokenManager.isAccessTokenValid() || tokenManager.isRefreshTokenValid()
    );
  },

  getCurrentUser(): any | null {
    const userData = localStorage.getItem("user-data");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        return null;
      }
    }
    return null;
  },

  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  async getValidAccessToken(): Promise<string | null> {
    return await tokenManager.getValidAccessToken();
  },

  clearAuthData(): void {
    tokenManager.clearTokens();
  },

  // Check token status for debugging
  getTokenStatus(): {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    accessTokenValid: boolean;
    refreshTokenValid: boolean;
    accessExpiresAt: Date | null;
    refreshExpiresAt: Date | null;
  } {
    return {
      hasAccessToken: !!tokenManager.getAccessToken(),
      hasRefreshToken: !!tokenManager.getRefreshToken(),
      accessTokenValid: tokenManager.isAccessTokenValid(),
      refreshTokenValid: tokenManager.isRefreshTokenValid(),
      accessExpiresAt: tokenManager.getAccessExpiresAt(),
      refreshExpiresAt: tokenManager.getRefreshExpiresAt(),
    };
  },
};
