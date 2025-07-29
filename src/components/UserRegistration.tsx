import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { UserRegistration } from '../types';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const UserRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    position: '',
    department: '',
    requestedRole: 'Inputter' as const,
    email: '',
    phone: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const registration: UserRegistration = {
        id: Date.now().toString(),
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storageService.addUserRegistration(registration);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('提交注册申请失败:', error);
      setErrorMessage('提交注册申请失败，请重试');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            用户注册申请
          </h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          请填写以下信息申请系统访问权限
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 成功消息 */}
          {showSuccess && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>注册申请提交成功！管理员将在审核后通知您。</span>
            </div>
          )}

          {/* 错误消息 */}
          {showError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  员工ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  职位 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  部门 <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  <option value="">请选择部门</option>
                  <option value="Risk Management">风险管理</option>
                  <option value="IT & Digital">IT & Digital</option>
                  <option value="Compliance">合规</option>
                  <option value="Procurement">采购</option>
                  <option value="Finance">财务</option>
                  <option value="HR">人力资源</option>
                  <option value="Operations">运营</option>
                  <option value="Other">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  申请角色 <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="form-select"
                  value={formData.requestedRole}
                  onChange={(e) => handleInputChange('requestedRole', e.target.value)}
                >
                  <option value="Inputter">事件录入员 (Inputter)</option>
                  <option value="Approver">审批员 (Approver)</option>
                  <option value="Administrator">管理员 (Administrator)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                申请理由 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                className="form-input"
                placeholder="请详细说明您申请该角色的理由和工作需求..."
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                提交申请
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                返回登录页面
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationForm;