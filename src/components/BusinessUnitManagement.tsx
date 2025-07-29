import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { BusinessUnit } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Building,
  AlertTriangle
} from 'lucide-react';

const BusinessUnitManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    const loadedUnits = storageService.getBusinessUnits();
    setBusinessUnits(loadedUnits);
  }, []);

  const handleCreate = () => {
    setSelectedUnit(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEdit = (unit: BusinessUnit) => {
    setSelectedUnit(unit);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDelete = (unitId: string) => {
    if (confirm('确定要删除这个业务单位吗？删除后相关的事件数据可能会受到影响。')) {
      storageService.deleteBusinessUnit(unitId);
      setBusinessUnits(storageService.getBusinessUnits());
    }
  };

  const handleSubmit = (formData: Partial<BusinessUnit>) => {
    if (formMode === 'create') {
      const newUnit: BusinessUnit = {
        id: Date.now().toString(),
        name: formData.name || '',
        code: formData.code || '',
        description: formData.description || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storageService.addBusinessUnit(newUnit);
      setBusinessUnits(storageService.getBusinessUnits());
    } else if (selectedUnit) {
      const updatedUnit = { ...selectedUnit, ...formData, updatedAt: new Date().toISOString() };
      storageService.updateBusinessUnit(updatedUnit);
      setBusinessUnits(storageService.getBusinessUnits());
    }
    setShowForm(false);
  };

  // 检查是否为管理员
  if (currentUser?.role !== 'Administrator') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">权限不足</h3>
          <p className="text-gray-500">只有管理员可以访问业务单位管理功能</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">业务单位管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理系统中的业务单位信息
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary"
        >
          <Plus size={16} className="mr-2" />
          新建业务单位
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">总业务单位</dt>
                <dd className="text-lg font-medium text-gray-900">{businessUnits.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">活跃单位</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {businessUnits.filter(unit => unit.isActive).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">停用单位</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {businessUnits.filter(unit => !unit.isActive).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* 业务单位列表 */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            业务单位列表 ({businessUnits.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  序号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  单位代码
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  单位名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {businessUnits.map((unit, index) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {unit.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {unit.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      unit.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {unit.isActive ? '活跃' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(unit.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(unit)}
                        className="text-blue-600 hover:text-blue-900"
                        title="编辑"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 业务单位表单模态框 */}
      {showForm && (
        <BusinessUnitForm
          unit={selectedUnit}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

interface BusinessUnitFormProps {
  unit?: BusinessUnit | null;
  mode: 'create' | 'edit';
  onSubmit: (data: Partial<BusinessUnit>) => void;
  onCancel: () => void;
}

const BusinessUnitForm: React.FC<BusinessUnitFormProps> = ({ unit, mode, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<BusinessUnit>>({
    name: unit?.name || '',
    code: unit?.code || '',
    description: unit?.description || '',
    isActive: unit?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = '业务单位名称为必填项';
    }
    
    if (!formData.code?.trim()) {
      newErrors.code = '业务单位代码为必填项';
    }
    
    if (newErrors.name || newErrors.code) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof BusinessUnit, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? '新建业务单位' : '编辑业务单位'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                业务单位代码 *
              </label>
              <input
                type="text"
                className={`form-input ${errors.code ? 'border-red-500' : ''}`}
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                required
                placeholder="例如：RM"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                业务单位名称 *
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="例如：风险管理"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="业务单位的详细描述"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">启用此业务单位</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {mode === 'create' ? '创建' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessUnitManagement;