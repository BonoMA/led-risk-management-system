import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Incident } from '../types';
import IncidentForm from './IncidentForm';
import { 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search
} from 'lucide-react';

const IncidentList: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // 从存储服务加载数据
    const loadedIncidents = storageService.getIncidents();
    setIncidents(loadedIncidents);
  }, []);

  // 生成年份选项（从2020年到当前年份+5年）
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear + 5; year++) {
      years.push(year.toString());
    }
    return years;
  };

  // 根据用户角色过滤事件
  const filteredIncidents = incidents.filter(incident => {
    // 年份过滤
    if (selectedYear !== 'all') {
      const incidentYear = new Date(incident.incidentDate).getFullYear().toString();
      if (selectedYear !== incidentYear) return false;
    }

    // 部门过滤
    if (currentUser?.role === 'Inputter' || currentUser?.role === 'Approver') {
      if (incident.businessUnit !== currentUser.department) return false;
    } else if (selectedDepartment !== 'All Departments' && incident.businessUnit !== selectedDepartment) {
      return false;
    }

    // 搜索过滤
    if (searchTerm && !incident.incidentName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleDelete = (incidentId: string) => {
    if (confirm('确定要删除这个事件吗？')) {
      storageService.deleteIncident(incidentId);
      setIncidents(storageService.getIncidents());
    }
  };

  const handleStatusChange = (incidentId: string, newStatus: 'Open' | 'Closed') => {
    const updatedIncidents = incidents.map(incident => 
      incident.id === incidentId 
        ? { ...incident, status: newStatus, updatedAt: new Date().toISOString() }
        : incident
    );
    setIncidents(updatedIncidents);
    storageService.saveIncidents(updatedIncidents);
  };

  const handleReviewStatusChange = (incidentId: string, newReviewStatus: Incident['reviewStatus']) => {
    const updatedIncidents = incidents.map(incident => 
      incident.id === incidentId 
        ? { ...incident, reviewStatus: newReviewStatus, updatedAt: new Date().toISOString() }
        : incident
    );
    setIncidents(updatedIncidents);
    storageService.saveIncidents(updatedIncidents);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Open': { color: 'bg-yellow-100 text-yellow-800', text: '开放' },
      'Closed': { color: 'bg-green-100 text-green-800', text: '已关闭' },
      'Draft': { color: 'bg-gray-100 text-gray-800', text: '草稿' },
      'Pending Approval L1': { color: 'bg-orange-100 text-orange-800', text: '待审批L1' },
      'Pending Approval L2': { color: 'bg-orange-100 text-orange-800', text: '待审批L2' },
      'Approved': { color: 'bg-green-100 text-green-800', text: '已批准' },
      'Rejected': { color: 'bg-red-100 text-red-800', text: '已拒绝' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Draft'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const canEdit = (incident: Incident) => {
    if (currentUser?.role === 'Administrator') return true;
    if (currentUser?.role === 'Inputter' && incident.createdBy.employeeId === currentUser.employeeId) return true;
    return false;
  };

  const canApprove = (incident: Incident) => {
    if (currentUser?.role === 'Administrator' && incident.reviewStatus === 'Pending Approval L2') return true;
    if (currentUser?.role === 'Approver' && incident.reviewStatus === 'Pending Approval L1') return true;
    return false;
  };

  const handleEdit = (incident: Incident) => {
    navigate(`/incidents/edit/${incident.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">事件列表</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理所有操作风险事件
          </p>
        </div>
        <button
          onClick={() => navigate('/incidents/new')}
          className="btn-primary"
        >
          新建事件
        </button>
      </div>

      {/* 筛选器 */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年份
            </label>
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">全部年份</option>
              {generateYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {currentUser?.role === 'Administrator' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                部门
              </label>
              <select
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="All Departments">所有部门</option>
                <option value="Risk Management">风险管理</option>
                <option value="IT & Digital">IT & Digital</option>
                <option value="Compliance">合规</option>
                <option value="Procurement">采购</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              搜索
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                className="form-input pl-10"
                placeholder="搜索事件名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedYear('all');
                setSelectedDepartment('All Departments');
                setSearchTerm('');
              }}
              className="btn-secondary"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* 事件列表 */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            事件列表 ({filteredIncidents.length})
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
                  事件名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事件日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  发现日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  实际损失
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事故原因
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  审批状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.map((incident, index) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {incident.incidentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(incident.incidentDate).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(incident.discoveryDate).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ¥{incident.actualLoss.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {incident.causeOfAccident}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(incident.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(incident.reviewStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedIncident(incident);
                          setShowDetails(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="查看详情"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {canEdit(incident) && (
                        <button
                          onClick={() => handleEdit(incident)}
                          className="text-blue-600 hover:text-blue-900"
                          title="编辑"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      
                      {canEdit(incident) && incident.reviewStatus === 'Draft' && (
                        <button
                          onClick={() => handleDelete(incident.id)}
                          className="text-red-600 hover:text-red-900"
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      {canApprove(incident) && (
                        <button
                          onClick={() => handleReviewStatusChange(incident.id, 'Approved')}
                          className="text-green-600 hover:text-green-900"
                          title="批准"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      
                      {canApprove(incident) && (
                        <button
                          onClick={() => handleReviewStatusChange(incident.id, 'Rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="拒绝"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 事件详情模态框 */}
      {showDetails && selectedIncident && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">事件详情</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <IncidentForm
                incident={selectedIncident}
                mode="view"
                onSubmit={() => {}}
                onCancel={() => setShowDetails(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentList; 