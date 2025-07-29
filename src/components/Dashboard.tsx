import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Incident } from '../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // 从存储服务加载数据
    const loadedIncidents = storageService.getIncidents();
    setIncidents(loadedIncidents);
  }, []);

  // 计算统计数据
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status === 'Open').length;
  const closedIncidents = incidents.filter(i => i.status === 'Closed').length;
  const pendingApprovals = incidents.filter(i => 
    i.reviewStatus === 'Pending Approval L1' || i.reviewStatus === 'Pending Approval L2'
  ).length;
  const totalLoss = incidents.reduce((sum, incident) => sum + incident.actualLoss, 0);
  const averageLoss = totalIncidents > 0 ? totalLoss / totalIncidents : 0;

  // 按月份统计
  const incidentsByMonth = incidents.reduce((acc, incident) => {
    const month = new Date(incident.incidentDate).toLocaleDateString('zh-CN', { month: 'long' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 按原因统计
  const incidentsByCause = incidents.reduce((acc, incident) => {
    acc[incident.causeOfAccident] = (acc[incident.causeOfAccident] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      name: '总事件数',
      value: totalIncidents,
      icon: AlertTriangle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: '开放事件',
      value: openIncidents,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: '已关闭事件',
      value: closedIncidents,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: '待审批',
      value: pendingApprovals,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: '总损失',
      value: `¥${totalLoss.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: '平均损失',
      value: `¥${averageLoss.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <p className="mt-1 text-sm text-gray-500">
          欢迎回来，{currentUser?.name}。这里是您的风险事件概览。
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 按月份统计 */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">事件按月统计</h3>
          <div className="space-y-3">
            {Object.entries(incidentsByMonth).map(([month, count]) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{month}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(incidentsByMonth))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 按原因统计 */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">事件按原因统计</h3>
          <div className="space-y-3">
            {Object.entries(incidentsByCause).map(([cause, count]) => (
              <div key={cause} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{cause}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(incidentsByCause))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 最近事件 */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">最近事件</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {incidents.slice(0, 5).map((incident) => (
            <div key={incident.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{incident.incidentName}</h4>
                  <p className="text-sm text-gray-500">{incident.businessUnit}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    incident.status === 'Open' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {incident.status === 'Open' ? '开放' : '已关闭'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    incident.reviewStatus === 'Approved' 
                      ? 'bg-green-100 text-green-800'
                      : incident.reviewStatus === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {incident.reviewStatus === 'Approved' ? '已批准' :
                     incident.reviewStatus === 'Rejected' ? '已拒绝' :
                     incident.reviewStatus === 'Pending Approval L1' ? '待审批L1' :
                     incident.reviewStatus === 'Pending Approval L2' ? '待审批L2' : '草稿'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 