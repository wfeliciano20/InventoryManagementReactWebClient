import { createContext, useEffect, useState } from "react";
import type { AuthContextType } from "../models";

// Create authentication context with initial undefined value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider component that wraps the application to provide auth context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for authentication token (stored in localStorage)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );

  // State for refresh token (stored in localStorage)
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  // State for user data (name and email)
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );

  // Loading state for initial token validation
  const [isLoading, setIsLoading] = useState(true);

  // Effect to initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRefreshToken = localStorage.getItem("authRefreshToken");
    const storedUserString = localStorage.getItem("authUser");
    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      if (storedUserString) {
        try {
          setUser(JSON.parse(storedUserString));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Login function to set tokens and user data in state and localStorage
  const login = (
    newToken: string,
    newRefreshToken: string,
    userName: string
  ) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authRefreshToken", newRefreshToken);
    localStorage.setItem("authUser", userName);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser({ name: userName });
  };

  // Logout function to clear tokens and user data from state and localStorage
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRefreshToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // Render the context provider with auth values and children
  return (
    <AuthContext.Provider
      value={{ token, refreshToken, user, login, logout, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
