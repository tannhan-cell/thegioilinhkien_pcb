import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../lib/types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, role?: UserProfile['role']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'tglk_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        id: 'usr-admin-demo',
        name: 'Võ Tấn Nhân (Admin)',
        email: 'nhan.votan@thegioilinhkienpcb.vn',
        phone: '0392733577',
        role: 'admin'
      };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  const login = (email: string, role: UserProfile['role'] = 'customer') => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng',
      email,
      phone: '0392733577',
      role,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
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
