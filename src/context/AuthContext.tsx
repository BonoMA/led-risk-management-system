import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

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
    try {
      // 首先尝试从storageService获取用户
      const users = storageService.getUsers();
      const user = users.find(u => u.employeeId === employeeId);

      if (user && user.isActive) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        // 保存到localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        return true;
      }

      // 如果没有找到用户，检查演示用户
      const demoUsers: Record<string, User> = {
        'EMP001': {
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
        },
        'EMP002': {
          id: '2',
          name: '李四',
          employeeId: 'EMP002',
          position: '风险经理',
          department: 'Risk Management',
          role: 'Approver',
          email: 'lisi@company.com',
          phone: '13800138002',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        'EMP003': {
          id: '3',
          name: '王五',
          employeeId: 'EMP003',
          position: '风险管理总监',
          department: 'Risk Management',
          role: 'Administrator',
          email: 'wangwu@company.com',
          phone: '13800138003',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      };

      const demoUser = demoUsers[employeeId];
      if (demoUser) {
        setCurrentUser(demoUser);
        setIsAuthenticated(true);
        
        // 保存到localStorage
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
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