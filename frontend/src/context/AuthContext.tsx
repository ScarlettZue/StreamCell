import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('streamcell_token');
    const savedUser = localStorage.getItem('streamcell_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('streamcell_token');
        localStorage.removeItem('streamcell_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await authService.login(email, pass);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('streamcell_token', data.token);
    localStorage.setItem('streamcell_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('streamcell_token');
    localStorage.removeItem('streamcell_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};
