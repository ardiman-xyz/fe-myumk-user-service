import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { adminAuthService } from "@/services/authAdmin";

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
    const accessToken = adminAuthService.getAccessToken();
    const userData = adminAuthService.getCurrentUser();

    if (accessToken && userData) {
      setToken(accessToken);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = (loginData: { access_token: string; user: User }) => {
    setToken(loginData.access_token);
    setUser(loginData.user);
    // Penyimpanan sudah dilakukan oleh adminAuthService.login
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    adminAuthService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
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
