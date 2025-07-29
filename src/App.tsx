import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import UserRegistrationForm from './components/UserRegistration';
import Dashboard from './components/Dashboard';
import IncidentList from './components/IncidentList';
import NewIncident from './components/NewIncident';
import EditIncident from './components/EditIncident';
import IAMManagement from './components/IAMManagement';
import DataManagement from './components/DataManagement';
import UserManagement from './components/UserManagement';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 管理员专用路由组件
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role !== 'Administrator') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// 主应用内容
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={<UserRegistrationForm />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/incidents" element={
        <ProtectedRoute>
          <Layout>
            <IncidentList />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/incidents/new" element={
        <ProtectedRoute>
          <Layout>
            <NewIncident />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/incidents/edit/:id" element={
        <ProtectedRoute>
          <Layout>
            <EditIncident />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/iam" element={
        <ProtectedRoute>
          <Layout>
            <IAMManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/data" element={
        <ProtectedRoute>
          <Layout>
            <DataManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <AdminRoute>
          <Layout>
            <UserManagement />
          </Layout>
        </AdminRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// 主应用组件
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App; 