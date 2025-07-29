import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { AlertTriangle, User, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId.trim()) {
      setErrorMessage('请输入员工ID');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      // 检查用户是否存在
      const users = storageService.getUsers();
      const user = users.find(u => u.employeeId === employeeId);

      if (user) {
        if (user.isActive) {
          const loginSuccess = login(employeeId);
          if (loginSuccess) {
            navigate('/dashboard');
          } else {
            setErrorMessage('登录失败，请重试');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
          }
        } else {
          setErrorMessage('您的账户已被禁用，请联系管理员');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      } else {
        // 如果用户不存在，检查是否有待审批的注册申请
        const registrations = storageService.getUserRegistrations();
        const pendingRegistration = registrations.find(
          reg => reg.employeeId === employeeId && reg.status === 'Pending'
        );

        if (pendingRegistration) {
          setErrorMessage('您的注册申请正在审核中，请等待管理员审批');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        } else {
          setErrorMessage('用户不存在，请先注册或联系管理员');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      }
    } catch (error) {
      console.error('登录失败:', error);
      setErrorMessage('登录失败，请重试');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleDemoLogin = (demoId: string) => {
    setEmployeeId(demoId);
    const loginSuccess = login(demoId);
    if (loginSuccess) {
      navigate('/dashboard');
    } else {
      setErrorMessage('演示用户登录失败，请重试');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录 全面风险管理系统
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          请输入您的员工ID进行登录
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 错误消息 */}
          {showError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                员工ID
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="请输入员工ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-primary-500 group-hover:text-primary-400" />
                </span>
                登录
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">演示账户</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => handleDemoLogin('EMP001')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                张三 (Inputter) - EMP001
              </button>
              <button
                onClick={() => handleDemoLogin('EMP002')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                李四 (Approver) - EMP002
              </button>
              <button
                onClick={() => handleDemoLogin('EMP003')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                王五 (Administrator) - EMP003
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">新用户</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/register')}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                申请注册
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 