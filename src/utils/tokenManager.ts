import { API_CONFIG } from "@/config/api";

class TokenManager {
  private static instance: TokenManager;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  private constructor() {
    // Initialize auto-refresh when class is instantiated
    this.initializeAutoRefresh();
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Storage methods
  public setTokens(
    accessToken: string,
    refreshToken: string,
    accessExpiresAt: string,
    refreshExpiresAt: string
  ): void {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("access_expires_at", accessExpiresAt);
    localStorage.setItem("refresh_expires_at", refreshExpiresAt);

    // Restart auto-refresh timer
    this.scheduleTokenRefresh();
  }

  public getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  public getAccessExpiresAt(): Date | null {
    const expiresAt = localStorage.getItem("access_expires_at");
    return expiresAt ? new Date(expiresAt) : null;
  }

  public getRefreshExpiresAt(): Date | null {
    const expiresAt = localStorage.getItem("refresh_expires_at");
    return expiresAt ? new Date(expiresAt) : null;
  }

  public clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_expires_at");
    localStorage.removeItem("refresh_expires_at");
    localStorage.removeItem("user-data");

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Check if access token is valid
  public isAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    const expiresAt = this.getAccessExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    // Add 5 minute buffer
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    return expiresAt.getTime() > now.getTime() + bufferTime;
  }

  // Check if refresh token is valid
  public isRefreshTokenValid(): boolean {
    const token = this.getRefreshToken();
    const expiresAt = this.getRefreshExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    const now = new Date();
    return expiresAt.getTime() > now.getTime();
  }

  // Initialize auto-refresh when app starts
  public initializeAutoRefresh(): void {
    // Check if we have valid tokens
    if (this.isAccessTokenValid()) {
      this.scheduleTokenRefresh();
    } else if (this.isRefreshTokenValid()) {
      // Access token expired but refresh token still valid
      this.refreshTokenNow();
    } else {
      // Both tokens expired, clear storage
      this.clearTokens();
    }
  }

  // Schedule auto-refresh before token expires
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const expiresAt = this.getAccessExpiresAt();
    if (!expiresAt) return;

    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    // Refresh 30 minutes before expiry (or immediately if less than 30 minutes left)
    const refreshTime = Math.max(timeUntilExpiry - 30 * 60 * 1000, 1000);

    console.log(
      `🔄 Token refresh scheduled in ${Math.round(
        refreshTime / 1000 / 60
      )} minutes`
    );

    this.refreshTimer = setTimeout(() => {
      this.refreshTokenNow();
    }, refreshTime);
  }

  // Refresh token immediately
  public async refreshTokenNow(): Promise<string | null> {
    if (this.isRefreshing) {
      // If already refreshing, wait for the result
      return new Promise((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      console.log("🔄 Refreshing access token...");

      const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
          device_name: "web-app",
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Store new tokens
        this.setTokens(
          data.data.access_token,
          data.data.refresh_token,
          data.data.access_expires_at,
          data.data.refresh_expires_at
        );

        console.log("✅ Token refreshed successfully");

        // Notify all waiting subscribers
        this.refreshSubscribers.forEach((callback) =>
          callback(data.data.access_token)
        );
        this.refreshSubscribers = [];

        return data.data.access_token;
      } else {
        throw new Error(data.message || "Token refresh failed");
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);

      // Clear tokens and redirect to login
      this.clearTokens();

      // Notify subscribers with null (failed)
      this.refreshSubscribers.forEach((callback) => callback(null));
      this.refreshSubscribers = [];

      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Get valid access token (with auto-refresh if needed)
  public async getValidAccessToken(): Promise<string | null> {
    if (this.isAccessTokenValid()) {
      return this.getAccessToken();
    }

    // Token expired, try to refresh
    if (this.isRefreshTokenValid()) {
      return await this.refreshTokenNow();
    }

    // Both tokens expired
    this.clearTokens();
    return null;
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Initialize token manager when module loads
tokenManager.initializeAutoRefresh();
