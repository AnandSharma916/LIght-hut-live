import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('lighthut_admin_token');
      if (!token) {
        setAdmin(null);
        return;
      }
      const data = await authService.getMe();
      if (data && data.success && data.admin) {
        setAdmin(data.admin);
      } else {
        localStorage.removeItem('lighthut_admin_token');
        setAdmin(null);
      }
    } catch (err) {
      localStorage.removeItem('lighthut_admin_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data && data.success && data.admin) {
        setAdmin(data.admin);
        addToast(`Welcome back, ${data.admin.name || 'Administrator'}`, 'success');
        return { success: true };
      }
      const errorMsg = data?.message || 'Login failed';
      addToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Invalid administrative credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('lighthut_admin_token');
      setAdmin(null);
      addToast('Logged out successfully.', 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: Boolean(admin),
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
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
