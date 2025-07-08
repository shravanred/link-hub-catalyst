import { useState, useEffect } from 'react';
import { AuthState } from '@/types';

const ADMIN_PASSWORD = 'admin123'; // In production, this should be more secure
const AUTH_KEY = 'linkHub_isAuthenticated';

export const useAuth = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  return { isAuthenticated, login, logout };
};