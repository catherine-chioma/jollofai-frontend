import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios, { API_ENDPOINTS } from "../config/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  role?: "user" | "admin" | "moderator";
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Base API URL is now configured in config/api.ts

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios interceptor to include token in requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  // Check for stored user and token on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("jollofai_user");
    const storedToken = localStorage.getItem("jollofai_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        localStorage.removeItem("jollofai_user");
        localStorage.removeItem("jollofai_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Check if we're in offline mode
    const offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true";

    if (offlineMode) {
      // Mock successful login for development
      const mockUser: User = {
        id: "1",
        email: email,
        fullName: "Demo User",
        role: "user",
      };

      const mockToken = "demo_token_" + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem("jollofai_user", JSON.stringify(mockUser));
      localStorage.setItem("jollofai_token", mockToken);

      setIsLoading(false);
      return true;
    }

    try {
      const response = await axios.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      const { user: userInfo, token: authToken } = response.data;

      setUser(userInfo);
      setToken(authToken);
      localStorage.setItem("jollofai_user", JSON.stringify(userInfo));
      localStorage.setItem("jollofai_token", authToken);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    // Check if we're in offline mode
    const offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true";

    if (offlineMode) {
      // Mock successful signup for development
      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
        fullName: fullName,
        role: "user",
      };

      const mockToken = "demo_token_" + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem("jollofai_user", JSON.stringify(mockUser));
      localStorage.setItem("jollofai_token", mockToken);

      setIsLoading(false);
      return true;
    }

    try {
      const response = await axios.post<AuthResponse>("/auth/register", {
        fullName,
        email,
        password,
      });

      const { user: userInfo, token: authToken } = response.data;

      setUser(userInfo);
      setToken(authToken);
      localStorage.setItem("jollofai_user", JSON.stringify(userInfo));
      localStorage.setItem("jollofai_token", authToken);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    const offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true";

    try {
      // Call the logout API endpoint if user is logged in and not in offline mode
      if (token && !offlineMode) {
        await axios.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local storage and state
      setUser(null);
      setToken(null);
      localStorage.removeItem("jollofai_user");
      localStorage.removeItem("jollofai_token");
    }
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
