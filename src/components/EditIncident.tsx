import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Incident } from '../types';
import IncidentForm from './IncidentForm';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const EditIncident: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      const incidents = storageService.getIncidents();
      const foundIncident = incidents.find(inc => inc.id === id);
      if (foundIncident) {
        setIncident(foundIncident);
      } else {
        setErrorMessage('事件不存在');
        setShowError(true);
      }
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (formData: Partial<Incident>) => {
    try {
      if (!incident) return;

      const updatedIncident: Incident = {
        ...incident,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      // 保存到存储服务
      storageService.updateIncident(updatedIncident);

      // 显示成功消息
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/incidents');
      }, 2000);

    } catch (error) {
      console.error('更新事件失败:', error);
      setErrorMessage('更新事件失败，请重试');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancel = () => {
    navigate('/incidents');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">事件不存在</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 成功消息 */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>事件更新成功！正在跳转到事件列表...</span>
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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/incidents')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编辑事件</h1>
            <p className="mt-1 text-sm text-gray-500">
              事件ID: {incident.id}
            </p>
          </div>
        </div>
      </div>

      <IncidentForm
        incident={incident}
        mode="edit"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditIncident; 