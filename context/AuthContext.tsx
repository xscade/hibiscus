import React, { createContext, useContext, useState } from 'react';

// API Base URL - uses relative URL in production (Vercel), localhost in development
const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hibiscus_auth') === 'true';
  });
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('hibiscus_auth', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error - trying fallback:', error);
      // Fallback to default credentials if server is not available
      if (username === 'admin' && password === 'hibiscus2025') {
        setIsAuthenticated(true);
        localStorage.setItem('hibiscus_auth', 'true');
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hibiscus_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};