import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('farmshield_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentFarmer = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setFarmer(res.data.farmer);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentFarmer();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      localStorage.setItem('farmshield_token', res.data.token);
      localStorage.setItem('farmshield_farmer', JSON.stringify(res.data.farmer));
      setToken(res.data.token);
      setFarmer(res.data.farmer);
    }
    return res.data;
  };

  const register = async (name, email, password, confirmPassword, phone) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
      phone,
    });
    if (res.data?.success) {
      localStorage.setItem('farmshield_token', res.data.token);
      localStorage.setItem('farmshield_farmer', JSON.stringify(res.data.farmer));
      setToken(res.data.token);
      setFarmer(res.data.farmer);
    }
    return res.data;
  };

  const updateProfile = async (name, phone) => {
    const res = await api.put('/profile', { name, phone });
    if (res.data?.success) {
      setFarmer(res.data.farmer);
      localStorage.setItem('farmshield_farmer', JSON.stringify(res.data.farmer));
    }
    return res.data;
  };

  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    const res = await api.put('/profile/password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('farmshield_token');
    localStorage.removeItem('farmshield_farmer');
    setToken(null);
    setFarmer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        token,
        isAuthenticated: !!farmer,
        loading,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
