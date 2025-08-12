import { API_CONFIG } from "@/config/api";

class TokenManager {
  private static instance: TokenManager;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  private constructor() {
    // Don't auto-initialize, let AuthProvider handle it
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

    console.log("🔐 TOKENS STORED", {
      access_expires_at: new Date(accessExpiresAt).toLocaleString(),
      refresh_expires_at: new Date(refreshExpiresAt).toLocaleString(),
      time_until_access_expiry:
        Math.round(
          (new Date(accessExpiresAt).getTime() - Date.now()) / 1000 / 60
        ) + " minutes",
      time_until_refresh_expiry:
        Math.round(
          (new Date(refreshExpiresAt).getTime() - Date.now()) / 1000 / 60 / 60
        ) + " hours",
    });

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

  // Check if access token is valid (5 minutes buffer)
  public isAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    const expiresAt = this.getAccessExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    // Refresh 5 minutes before expiry for production
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

    const isValid = expiresAt.getTime() > now.getTime() + bufferTime;

    if (!isValid) {
      console.log("⚠️ ACCESS TOKEN NEAR EXPIRY", {
        expires_at: expiresAt.toLocaleString(),
        current_time: now.toLocaleString(),
        minutes_until_expiry: Math.round(
          (expiresAt.getTime() - now.getTime()) / 1000 / 60
        ),
        buffer_minutes: bufferTime / 1000 / 60,
      });
    }

    return isValid;
  }

  // Check if refresh token is valid
  public isRefreshTokenValid(): boolean {
    const token = this.getRefreshToken();
    const expiresAt = this.getRefreshExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    const now = new Date();
    const isValid = expiresAt.getTime() > now.getTime();

    if (!isValid) {
      console.log("❌ REFRESH TOKEN EXPIRED", {
        expires_at: expiresAt.toLocaleString(),
        current_time: now.toLocaleString(),
      });
    }

    return isValid;
  }

  // Initialize auto-refresh when app starts
  public initializeAutoRefresh(): void {
    const hasTokens = this.getAccessToken() || this.getRefreshToken();

    if (!hasTokens) {
      return; // Don't log errors if no tokens exist yet
    }

    // Check if we have valid tokens
    if (this.isAccessTokenValid()) {
      this.scheduleTokenRefresh();
    } else if (this.isRefreshTokenValid()) {
      this.refreshTokenNow();
    } else {
      this.clearTokens();
    }
  }

  // Schedule auto-refresh before token expires (5 minutes buffer)
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const expiresAt = this.getAccessExpiresAt();
    if (!expiresAt) return;

    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    // Refresh 5 minutes before expiry for production
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 1000);

    this.refreshTimer = setTimeout(() => {
      this.refreshTokenNow();
    }, refreshTime);
  }

  // Refresh token immediately
  public async refreshTokenNow(): Promise<string | null> {
    if (this.isRefreshing) {
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

      console.log("📡 REFRESH RESPONSE", {
        status: response.status,
        success: data.success,
        message: data.message,
      });

      if (data.success && data.data) {
        // Store new tokens
        this.setTokens(
          data.data.access_token,
          data.data.refresh_token,
          data.data.access_expires_at,
          data.data.refresh_expires_at
        );

        console.log("✅ TOKEN REFRESH SUCCESS");

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
      console.error("❌ TOKEN REFRESH FAILED", error);

      // Clear tokens and redirect to login
      this.clearTokens();

      // Notify subscribers with null (failed)
      this.refreshSubscribers.forEach((callback) => callback(null));
      this.refreshSubscribers = [];

      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        console.log("🔀 Redirecting to login...");
        window.location.href = "/login";
      }

      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Get valid access token (with auto-refresh if needed)
  public async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();

    // If no access token exists, don't try to refresh
    if (!accessToken) {
      return null;
    }

    if (this.isAccessTokenValid()) {
      return accessToken;
    }

    console.log("⚠️ Access token invalid, attempting refresh...");

    // Token expired, try to refresh
    if (this.isRefreshTokenValid()) {
      return await this.refreshTokenNow();
    }

    // Both tokens expired
    console.log("❌ Both tokens expired");
    this.clearTokens();
    return null;
  }

  // Debug method to check token status
  public getTokenStatus(): {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    accessTokenValid: boolean;
    refreshTokenValid: boolean;
    accessExpiresAt: Date | null;
    refreshExpiresAt: Date | null;
    minutesUntilAccessExpiry: number | null;
    hoursUntilRefreshExpiry: number | null;
  } {
    const accessExpiresAt = this.getAccessExpiresAt();
    const refreshExpiresAt = this.getRefreshExpiresAt();
    const now = new Date();

    return {
      hasAccessToken: !!this.getAccessToken(),
      hasRefreshToken: !!this.getRefreshToken(),
      accessTokenValid: this.isAccessTokenValid(),
      refreshTokenValid: this.isRefreshTokenValid(),
      accessExpiresAt,
      refreshExpiresAt,
      minutesUntilAccessExpiry: accessExpiresAt
        ? Math.round((accessExpiresAt.getTime() - now.getTime()) / 1000 / 60)
        : null,
      hoursUntilRefreshExpiry: refreshExpiresAt
        ? Math.round(
            (refreshExpiresAt.getTime() - now.getTime()) / 1000 / 60 / 60
          )
        : null,
    };
  }

  // 🔧 TESTING METHOD: Force refresh for testing
  public forceRefresh(): Promise<string | null> {
    console.log("🔧 FORCE REFRESH TRIGGERED FOR TESTING");
    return this.refreshTokenNow();
  }

  // 🔧 TESTING METHOD: Override buffer time for quick testing
  public setTestingMode(bufferSeconds: number = 30): void {
    console.log(
      `🔧 TESTING MODE: Token will refresh ${bufferSeconds} seconds before expiry`
    );

    // Override the isAccessTokenValid method for testing
    this.isAccessTokenValid = () => {
      const token = this.getAccessToken();
      const expiresAt = this.getAccessExpiresAt();

      if (!token || !expiresAt) {
        return false;
      }

      const now = new Date();
      const bufferTime = bufferSeconds * 1000;
      const isValid = expiresAt.getTime() > now.getTime() + bufferTime;

      if (!isValid) {
        console.log("⚠️ ACCESS TOKEN NEAR EXPIRY (TESTING MODE)", {
          expires_at: expiresAt.toLocaleString(),
          current_time: now.toLocaleString(),
          seconds_until_expiry: Math.round(
            (expiresAt.getTime() - now.getTime()) / 1000
          ),
          buffer_seconds: bufferSeconds,
        });
      }

      return isValid;
    };

    // Re-schedule refresh with new buffer
    if (this.getAccessToken()) {
      this.scheduleTokenRefresh();
    }
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Global methods for testing in console
declare global {
  interface Window {
    tokenManager: typeof tokenManager;
    testTokenRefresh: () => Promise<string | null>;
    setTestingMode: (seconds?: number) => void;
  }
}

if (typeof window !== "undefined") {
  window.tokenManager = tokenManager;
  window.testTokenRefresh = () => tokenManager.forceRefresh();
  window.setTestingMode = (seconds = 30) =>
    tokenManager.setTestingMode(seconds);
}
