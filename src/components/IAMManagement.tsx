import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { IAMItem, Incident } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Calendar
} from 'lucide-react';

const IAMManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [iamItems, setIAMItems] = useState<IAMItem[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAMItem | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    const loadedIAMItems = storageService.getIAMItems();
    const loadedIncidents = storageService.getIncidents();
    setIAMItems(loadedIAMItems);
    setIncidents(loadedIncidents);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', text: '待处理' },
      'In Progress': { color: 'bg-blue-100 text-blue-800', text: '进行中' },
      'Completed': { color: 'bg-green-100 text-green-800', text: '已完成' },
      'Overdue': { color: 'bg-red-100 text-red-800', text: '已逾期' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEdit = (item: IAMItem) => {
    setSelectedItem(item);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDelete = (itemId: string) => {
    if (confirm('确定要删除这个IAM项目吗？')) {
      storageService.deleteIAMItem(itemId);
      setIAMItems(storageService.getIAMItems());
    }
  };

  const handleSubmit = (formData: Partial<IAMItem>) => {
    if (formMode === 'create') {
      const newItem: IAMItem = {
        id: Date.now().toString(),
        title: formData.title || '',
        description: formData.description || '',
        assignedTo: formData.assignedTo || '',
        dueDate: formData.dueDate || '',
        status: 'Pending',
        priority: formData.priority || 'Medium',
        relatedIncidentId: formData.relatedIncidentId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storageService.addIAMItem(newItem);
      setIAMItems(storageService.getIAMItems());
    } else if (selectedItem) {
      const updatedItem = { ...selectedItem, ...formData, updatedAt: new Date().toISOString() };
      storageService.updateIAMItem(updatedItem);
      setIAMItems(storageService.getIAMItems());
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IAM 管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理问题和行动计划
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary"
        >
          <Plus size={16} className="mr-2" />
          新建IAM项目
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">总项目数</dt>
                <dd className="text-lg font-medium text-gray-900">{iamItems.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">进行中</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {iamItems.filter(item => item.status === 'In Progress').length}
                </dd>
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
                <dt className="text-sm font-medium text-gray-500 truncate">已完成</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {iamItems.filter(item => item.status === 'Completed').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">已逾期</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {iamItems.filter(item => item.status === 'Overdue').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* IAM项目列表 */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            IAM项目列表 ({iamItems.length})
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
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  负责人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  截止日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  优先级
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {iamItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.dueDate).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority === 'High' ? '高' : item.priority === 'Medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="编辑"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {/* IAM表单模态框 */}
      {showForm && (
        <IAMForm
          item={selectedItem}
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          openIncidents={incidents.filter(incident => incident.status === 'Open')}
        />
      )}
    </div>
  );
};

interface IAMFormProps {
  item?: IAMItem | null;
  mode: 'create' | 'edit';
  onSubmit: (data: Partial<IAMItem>) => void;
  onCancel: () => void;
  openIncidents: Incident[];
}

const IAMForm: React.FC<IAMFormProps> = ({ item, mode, onSubmit, onCancel, openIncidents }) => {
  const [formData, setFormData] = useState<Partial<IAMItem>>({
    title: item?.title || '',
    description: item?.description || '',
    assignedTo: item?.assignedTo || '',
    dueDate: item?.dueDate || '',
    status: item?.status || 'Pending',
    priority: item?.priority || 'Medium',
    relatedIncidentId: item?.relatedIncidentId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof IAMItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? '新建IAM项目' : '编辑IAM项目'}
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
                标题 *
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述 *
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                负责人 *
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                截止日期 *
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                优先级
              </label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="Low">低</option>
                <option value="Medium">中</option>
                <option value="High">高</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                关联事件
              </label>
              <select
                className="form-select"
                value={formData.relatedIncidentId}
                onChange={(e) => handleInputChange('relatedIncidentId', e.target.value)}
              >
                <option value="">选择事件</option>
                {openIncidents.map(incident => (
                  <option key={incident.id} value={incident.id}>
                    {incident.incidentName}
                  </option>
                ))}
              </select>
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

export default IAMManagement; 