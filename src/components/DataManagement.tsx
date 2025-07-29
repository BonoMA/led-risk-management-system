import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';

const DataManagement: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    const data = storageService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `led-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.incidents && data.iamItems) {
          storageService.importData(data);
          alert('数据导入成功！请刷新页面查看更新。');
          window.location.reload();
        } else {
          alert('文件格式不正确，请选择正确的数据文件。');
        }
      } catch (error) {
        alert('文件解析失败，请检查文件格式。');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
      storageService.clearAllData();
      alert('数据已重置，页面将刷新。');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理系统的数据导入、导出和重置功能
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 导出数据 */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Download className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">导出数据</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            将所有事件和IAM项目数据导出为JSON文件，用于备份或迁移。
          </p>
          <button
            onClick={handleExport}
            className="btn-primary w-full"
          >
            导出数据
          </button>
        </div>

        {/* 导入数据 */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Upload className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">导入数据</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            从JSON文件导入数据，将覆盖当前所有数据。
          </p>
          <label className="btn-primary w-full cursor-pointer inline-block text-center">
            选择文件
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* 重置数据 */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <RefreshCw className="h-8 w-8 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">重置数据</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            清除所有数据并恢复到初始状态。此操作不可恢复！
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-danger w-full"
          >
            重置数据
          </button>
        </div>
      </div>

      {/* 数据统计 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">数据统计</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-700">事件数据</h4>
            <p className="text-2xl font-bold text-gray-900">
              {storageService.getIncidents().length} 个事件
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">IAM项目</h4>
            <p className="text-2xl font-bold text-gray-900">
              {storageService.getIAMItems().length} 个项目
            </p>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">使用说明</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">数据备份</p>
              <p>建议定期导出数据作为备份，防止数据丢失。</p>
            </div>
          </div>
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">数据迁移</p>
              <p>可以将数据导出后在其他设备上导入，实现数据迁移。</p>
            </div>
          </div>
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">数据重置</p>
              <p>重置操作将清除所有数据，请谨慎操作。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 确认重置对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">确认重置数据</h3>
              <p className="text-sm text-gray-500 mb-6">
                此操作将清除所有事件和IAM项目数据，且不可恢复。确定要继续吗？
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    handleReset();
                  }}
                  className="btn-danger"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement; 