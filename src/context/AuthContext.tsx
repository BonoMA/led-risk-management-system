import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (employeeId: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 从localStorage加载认证状态
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAuth = localStorage.getItem('isAuthenticated');
    
    if (savedUser && savedAuth === 'true') {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (employeeId: string): boolean => {
    // 模拟用户数据
    const defaultUser: User = {
      id: '1',
      name: '张三',
      employeeId: 'EMP001',
      position: '风险分析师',
      department: 'Risk Management',
      role: 'Inputter',
      email: 'zhangsan@company.com',
      phone: '13800138001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    // 根据员工ID设置不同的用户
    let user: User;
    switch (employeeId) {
      case 'EMP001':
        user = defaultUser;
        break;
      case 'EMP002':
        user = {
          ...defaultUser,
          id: '2',
          name: '李四',
          employeeId: 'EMP002',
          position: '风险经理',
          role: 'Approver',
          email: 'lisi@company.com',
          phone: '13800138002'
        };
        break;
      case 'EMP003':
        user = {
          ...defaultUser,
          id: '3',
          name: '王五',
          employeeId: 'EMP003',
          position: '风险管理总监',
          role: 'Administrator',
          email: 'wangwu@company.com',
          phone: '13800138003'
        };
        break;
      default:
        return false;
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // 保存到localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // 清除localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 