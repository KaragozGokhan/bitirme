import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  subscription_type: string;
  subscription_end_date?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Context için varsayılan değerleri oluşturuyoruz
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
};

// Context'i oluşturuyoruz
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Provider bileşeni
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


  // Sayfa yüklendiğinde kullanıcı durumunu kontrol ediyoruz
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // API'ye istek göndererek token'ın geçerliliğini kontrol ediyoruz
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_URL]);

  // Giriş işlemi
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Giriş sırasında bir hata oluştu"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Kayıt işlemi
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Kayıt sırasında bir hata oluştu"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Kolay kullanım için bir hook oluşturuyoruz
export const useAuth = () => React.useContext(AuthContext);
