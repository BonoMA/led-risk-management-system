import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (employeeId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // 从localStorage恢复用户状态
    const savedUser = localStorage.getItem('led_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // 从localStorage恢复认证状态
    return localStorage.getItem('led_is_authenticated') === 'true';
  });

  // 当用户状态改变时，保存到localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('led_current_user', JSON.stringify(currentUser));
      localStorage.setItem('led_is_authenticated', 'true');
    } else {
      localStorage.removeItem('led_current_user');
      localStorage.setItem('led_is_authenticated', 'false');
    }
  }, [currentUser]);

  const login = (employeeId: string) => {
    const user = mockUsers.find(u => u.employeeId === employeeId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      // 如果找不到用户，创建一个默认的Inputter用户
      const defaultUser = {
        id: 'default',
        name: '默认用户',
        employeeId,
        position: '风险分析师',
        department: 'Risk Management',
        role: 'Inputter' as const
      };
      setCurrentUser(defaultUser);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    // 清除localStorage
    localStorage.removeItem('led_current_user');
    localStorage.setItem('led_is_authenticated', 'false');
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 