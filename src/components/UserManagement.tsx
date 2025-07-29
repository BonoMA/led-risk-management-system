import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { UserRegistration, User } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User as UserIcon,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<UserRegistration | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const loadedRegistrations = storageService.getUserRegistrations();
    const loadedUsers = storageService.getUsers();
    setRegistrations(loadedRegistrations);
    setUsers(loadedUsers);
  }, []);

  const handleApprove = (registration: UserRegistration) => {
    try {
      // 创建新用户
      const newUser: User = {
        id: Date.now().toString(),
        name: registration.name,
        employeeId: registration.employeeId,
        position: registration.position,
        department: registration.department,
        role: registration.requestedRole,
        email: registration.email,
        phone: registration.phone,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 添加用户
      storageService.addUser(newUser);

      // 更新注册申请状态
      const updatedRegistration: UserRegistration = {
        ...registration,
        status: 'Approved',
        reviewedBy: currentUser?.name || 'Administrator',
        reviewedAt: new Date().toISOString(),
        reviewComment: reviewComment || '申请已批准'
      };

      storageService.updateUserRegistration(updatedRegistration);

      // 更新本地状态
      setUsers(storageService.getUsers());
      setRegistrations(storageService.getUserRegistrations());
      setReviewComment('');
      setShowDetails(false);

    } catch (error) {
      console.error('审批失败:', error);
      alert('审批失败，请重试');
    }
  };

  const handleReject = (registration: UserRegistration) => {
    try {
      const updatedRegistration: UserRegistration = {
        ...registration,
        status: 'Rejected',
        reviewedBy: currentUser?.name || 'Administrator',
        reviewedAt: new Date().toISOString(),
        reviewComment: reviewComment || '申请被拒绝'
      };

      storageService.updateUserRegistration(updatedRegistration);
      setRegistrations(storageService.getUserRegistrations());
      setReviewComment('');
      setShowDetails(false);

    } catch (error) {
      console.error('拒绝申请失败:', error);
      alert('操作失败，请重试');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', text: '待审批', icon: Clock },
      'Approved': { color: 'bg-green-100 text-green-800', text: '已批准', icon: CheckCircle },
      'Rejected': { color: 'bg-red-100 text-red-800', text: '已拒绝', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'Inputter': { color: 'bg-blue-100 text-blue-800', text: '录入员' },
      'Approver': { color: 'bg-orange-100 text-orange-800', text: '审批员' },
      'Administrator': { color: 'bg-purple-100 text-purple-800', text: '管理员' }
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const pendingRegistrations = registrations.filter(reg => reg.status === 'Pending');
  const approvedRegistrations = registrations.filter(reg => reg.status === 'Approved');
  const rejectedRegistrations = registrations.filter(reg => reg.status === 'Rejected');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理用户注册申请和系统用户
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="card p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">待审批</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingRegistrations.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">已批准</p>
              <p className="text-2xl font-semibold text-gray-900">{approvedRegistrations.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">已拒绝</p>
              <p className="text-2xl font-semibold text-gray-900">{rejectedRegistrations.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">系统用户</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 待审批申请 */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            待审批申请 ({pendingRegistrations.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  员工ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部门
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                        <div className="text-sm text-gray-500">{registration.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registration.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(registration.requestedRole)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowDetails(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="查看详情"
                      >
                        查看详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 系统用户列表 */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            系统用户 ({users.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  员工ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部门
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注册时间
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '活跃' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 申请详情模态框 */}
      {showDetails && selectedRegistration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">申请详情</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">姓名</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">员工ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.employeeId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">职位</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">部门</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">申请角色</label>
                    <p className="mt-1">{getRoleBadge(selectedRegistration.requestedRole)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">申请时间</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedRegistration.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedRegistration.email}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedRegistration.phone}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">审批意见</label>
                  <textarea
                    rows={3}
                    className="form-input mt-1"
                    placeholder="请输入审批意见..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleReject(selectedRegistration)}
                    className="btn-danger"
                  >
                    拒绝
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRegistration)}
                    className="btn-primary"
                  >
                    批准
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;