import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Incident } from '../types';
import IncidentForm from './IncidentForm';
import { AlertCircle, CheckCircle } from 'lucide-react';

const NewIncident: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (formData: Partial<Incident>) => {
    try {
      // 生成唯一ID
      const newIncident: Incident = {
        id: Date.now().toString(),
        ...formData,
        reviewStatus: 'Pending Approval L1', // 新建事件自动提交L1审批
        createdBy: {
          name: currentUser?.name || '',
          employeeId: currentUser?.employeeId || '',
          position: currentUser?.position || ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Incident;

      // 保存到存储服务
      storageService.addIncident(newIncident);

      // 显示成功消息
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/incidents');
      }, 2000);

    } catch (error) {
      console.error('保存事件失败:', error);
      setErrorMessage('保存事件失败，请重试');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancel = () => {
    navigate('/incidents');
  };

  return (
    <div className="space-y-6">
      {/* 成功消息 */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>事件保存成功并已提交审批！正在跳转到事件列表...</span>
        </div>
      )}

      {/* 错误消息 */}
      {showError && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">新建事件</h1>
          <p className="mt-1 text-sm text-gray-500">
            请填写事件相关信息，所有带 * 的字段为必填项。保存后将自动提交L1审批。
          </p>
        </div>
      </div>

      <IncidentForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default NewIncident; 