import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { adminAuthService } from "@/services/authAdmin";
import { tokenManager } from "@/utils/tokenManager";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_super_admin: boolean;
  last_login_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (loginData: { access_token: string; user: User }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Only initialize if we have tokens
        const hasTokens =
          tokenManager.getAccessToken() || tokenManager.getRefreshToken();

        if (hasTokens) {
          // Initialize auto-refresh for existing tokens
          tokenManager.initializeAutoRefresh();

          // Check if we have valid tokens
          const validToken = await tokenManager.getValidAccessToken();
          const userData = adminAuthService.getCurrentUser();

          if (validToken && userData) {
            setToken(validToken);
            setUser(userData);
          } else if (tokenManager.isRefreshTokenValid()) {
            // Try to refresh token
            const response = await adminAuthService.refreshToken();
            if (response.success && response.data) {
              setToken(response.data.access_token);
              setUser(response.data.user);
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear any invalid data
        adminAuthService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (loginData: { access_token: string; user: User }) => {
    setToken(loginData.access_token);
    setUser(loginData.user);

    // Initialize auto-refresh after successful login
    tokenManager.initializeAutoRefresh();
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await adminAuthService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
