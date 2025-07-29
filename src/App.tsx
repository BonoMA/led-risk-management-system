import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IncidentList from './components/IncidentList';
import NewIncident from './components/NewIncident';
import EditIncident from './components/EditIncident';
import IAMManagement from './components/IAMManagement';
import DataManagement from './components/DataManagement';
import UserManagement from './components/UserManagement';
import BusinessUnitManagement from './components/BusinessUnitManagement';
import UserRegistrationForm from './components/UserRegistration';
import ErrorBoundary from './components/ErrorBoundary';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// 管理员路由组件
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role !== 'Administrator') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">权限不足</h3>
          <p className="text-gray-500">只有管理员可以访问此页面</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// 主布局组件
const MainLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App: React.FC = () => {
  // 获取basename，在GitHub Pages上使用仓库名作为basename
  const basename = process.env.NODE_ENV === 'production' ? '/led-risk-management-system' : '';

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router basename={basename}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegistrationForm />} />
            
            {/* 主应用路由 */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* LED模块 - 二级菜单 */}
              <Route path="led">
                <Route path="incidents" element={<IncidentList />} />
                <Route path="incidents/new" element={<NewIncident />} />
                <Route path="incidents/edit/:id" element={<EditIncident />} />
                <Route path="iam" element={<IAMManagement />} />
              </Route>
              
              {/* 管理功能 - 仅管理员 */}
              <Route path="admin">
                <Route path="users" element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                } />
                <Route path="business-units" element={
                  <AdminRoute>
                    <BusinessUnitManagement />
                  </AdminRoute>
                } />
                <Route path="data" element={
                  <AdminRoute>
                    <DataManagement />
                  </AdminRoute>
                } />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 