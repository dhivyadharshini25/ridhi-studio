import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      localStorage.setItem('ridhi_user', JSON.stringify(data.user));
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('ridhi_token');
    if (!token) {
      setLoading(false);
      return;
    }
    refreshUser().finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('ridhi_token', data.token);
    localStorage.setItem('ridhi_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload: { fullName: string; email: string; phone: string; password: string }) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('ridhi_token', data.token);
    localStorage.setItem('ridhi_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('ridhi_token');
    localStorage.removeItem('ridhi_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
