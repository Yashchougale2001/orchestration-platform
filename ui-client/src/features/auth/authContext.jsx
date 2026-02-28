import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { authService } from "./authService";

/**
 * Auth Context - manages authentication state
 */
export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        // Check if authService and getCurrentUser exist
        if (authService && typeof authService.getCurrentUser === "function") {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } else {
          console.warn("authService.getCurrentUser is not available");
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
