import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import authService from "../services/auth.service";
import type { LoginCredentials, User, AuthResponseData } from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponseData>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on mount
  useEffect(() => {
    try {
      const savedToken = authService.getToken();
      const savedUser = authService.getCurrentUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
    } catch (err) {
      console.error("Failed to restore auth session:", err);
      authService.clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);

      // Validate Admin Role (block buyer/non-admin roles for this admin portal)
      const allowedRoles = ["admin", "superadmin"];
      const userRole = authData.user.role?.toLowerCase();
      if (!allowedRoles.includes(userRole)) {
        throw new Error(
          `Access restricted: Your account has role "${authData.user.role}", but this portal is for administrators only.`
        );
      }

      // Persist session
      authService.saveSession(authData);
      setUser(authData.user);
      setToken(authData.token);

      return authData;
    } finally {
      setIsLoading(false);
    }
  };

  
  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedUser };
      try {
        localStorage.setItem("olarge_admin_user", JSON.stringify(merged));
      } catch (e) {
        console.error("Failed to update user in localStorage", e);
      }
      return merged;
    });
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
