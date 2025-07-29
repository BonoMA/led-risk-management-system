import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  FileText,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Database,
  Users,
  Building,
  ChevronDown,
  ChevronRight,
  Shield
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ledMenuOpen, setLedMenuOpen] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const location = useLocation();

  const ledNavigation = [
    { name: '事件列表', href: '/led/incidents', icon: FileText },
    { name: '新建事件', href: '/led/incidents/new', icon: Plus },
    { name: 'IAM管理', href: '/led/iam', icon: Settings },
  ];

  const adminNavigation = [
    { name: '用户管理', href: '/admin/users', icon: Users },
    { name: '业务单位管理', href: '/admin/business-units', icon: Building },
    { name: '数据管理', href: '/admin/data', icon: Database },
  ];

  if (!currentUser) {
    return null;
  }

  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const isLedActive = () => {
    return location.pathname.startsWith('/led');
  };

  const isAdminActive = () => {
    return location.pathname.startsWith('/admin');
  };

  const NavigationItem: React.FC<{ item: any; onClick?: () => void }> = ({ item, onClick }) => (
    <Link
      to={item.href}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        isActive(item.href)
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      <item.icon className="mr-3 h-6 w-6" />
      {item.name}
    </Link>
  );

  const renderNavigation = () => (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {/* 仪表板 */}
      <NavigationItem 
        item={{ name: '仪表板', href: '/dashboard', icon: BarChart3 }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* LED模块 */}
      <div>
        <button
          onClick={() => setLedMenuOpen(!ledMenuOpen)}
          className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
            isLedActive()
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Shield className="mr-3 h-6 w-6" />
          LED模块
          {ledMenuOpen ? (
            <ChevronDown className="ml-auto h-4 w-4" />
          ) : (
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </button>
        
        {ledMenuOpen && (
          <div className="ml-4 mt-1 space-y-1">
            {ledNavigation.map((item) => (
              <NavigationItem 
                key={item.name} 
                item={item}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 管理功能 - 仅管理员可见 */}
      {currentUser?.role === 'Administrator' && (
        <div>
          <button
            onClick={() => setAdminMenuOpen(!adminMenuOpen)}
            className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
              isAdminActive()
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <User className="mr-3 h-6 w-6" />
            管理功能
            {adminMenuOpen ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </button>
          
          {adminMenuOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {adminNavigation.map((item) => (
                <NavigationItem 
                  key={item.name} 
                  item={item}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-gray-900">全面风险管理系统</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          {renderNavigation()}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">全面风险管理系统</h1>
          </div>
          {renderNavigation()}
          
          {/* 用户信息和退出 */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600"
                title="退出登录"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 bg-white border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">全面风险管理系统</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 