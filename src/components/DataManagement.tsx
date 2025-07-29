import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Download, Upload, RefreshCw, AlertTriangle, Database, FileText, Users, Building } from 'lucide-react';

const DataManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');

  // 检查是否为管理员
  if (currentUser?.role !== 'Administrator') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">权限不足</h3>
          <p className="text-gray-500">只有管理员可以访问数据管理功能</p>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    try {
      const data = storageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `led-risk-management-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage('数据导出成功！');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setMessage('数据导出失败，请重试');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = storageService.importData(jsonData);
        
        if (success) {
          setMessage('数据导入成功！页面将在3秒后刷新');
          setShowSuccess(true);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          setMessage('数据导入失败，请检查文件格式');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      } catch (error) {
        setMessage('数据导入失败，请检查文件格式');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    };
    reader.readAsText(file);
    
    // 清除文件输入
    event.target.value = '';
  };

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
      storageService.clearAllData();
      setMessage('数据已重置！页面将在3秒后刷新');
      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const getDataStats = () => {
    const incidents = storageService.getIncidents();
    const iamItems = storageService.getIAMItems();
    const users = storageService.getUsers();
    const registrations = storageService.getUserRegistrations();
    const businessUnits = storageService.getBusinessUnits();

    return {
      incidents: incidents.length,
      iamItems: iamItems.length,
      users: users.length,
      registrations: registrations.length,
      businessUnits: businessUnits.length
    };
  };

  const stats = getDataStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理系统数据的导入、导出和重置
        </p>
      </div>

      {/* 成功/错误消息 */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
          <Download className="h-5 w-5 mr-2" />
          <span>{message}</span>
        </div>
      )}

      {showError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{message}</span>
        </div>
      )}

      {/* 数据统计 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">事件</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.incidents}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">IAM项目</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.iamItems}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">用户</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.users}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">注册申请</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.registrations}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">业务单位</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.businessUnits}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card p-6">
          <div className="text-center">
            <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">导出数据</h3>
            <p className="text-sm text-gray-500 mb-4">
              将所有系统数据导出为JSON文件
            </p>
            <button
              onClick={handleExport}
              className="btn-primary w-full"
            >
              导出数据
            </button>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-center">
            <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">导入数据</h3>
            <p className="text-sm text-gray-500 mb-4">
              从JSON文件导入系统数据
            </p>
            <label className="btn-primary w-full cursor-pointer inline-block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              选择文件
            </label>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">重置数据</h3>
            <p className="text-sm text-gray-500 mb-4">
              清除所有数据并恢复到初始状态
            </p>
            <button
              onClick={handleReset}
              className="btn-danger w-full"
            >
              重置数据
            </button>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">使用说明</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
            <p><strong>导出数据：</strong>将所有系统数据导出为JSON文件，可用于备份或迁移。</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
            <p><strong>导入数据：</strong>从之前导出的JSON文件导入数据，会覆盖当前所有数据。</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
            <p><strong>重置数据：</strong>清除所有数据并恢复到系统初始状态，此操作不可恢复。</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
            <p><strong>注意事项：</strong>导入数据前请确保文件格式正确，建议先备份当前数据。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement; 