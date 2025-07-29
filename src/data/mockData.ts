import { User, Incident, IAMItem, BusinessUnit } from '../types';

export const businessUnits: BusinessUnit[] = [
  { 
    id: '1', 
    name: 'Risk Management', 
    code: 'RM',
    description: '风险管理业务单位',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  { 
    id: '2', 
    name: 'IT & Digital', 
    code: 'ITD',
    description: 'IT与数字化业务单位',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  { 
    id: '3', 
    name: 'Compliance', 
    code: 'COMP',
    description: '合规业务单位',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  { 
    id: '4', 
    name: 'Procurement', 
    code: 'PROC',
    description: '采购业务单位',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    employeeId: 'EMP001',
    position: '风险分析师',
    department: 'Risk Management',
    role: 'Inputter',
    email: 'zhangsan@company.com',
    phone: '13800138001',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: '李四',
    employeeId: 'EMP002',
    position: '风险经理',
    department: 'Risk Management',
    role: 'Approver',
    email: 'lisi@company.com',
    phone: '13800138002',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: '王五',
    employeeId: 'EMP003',
    position: '风险管理总监',
    department: 'Risk Management',
    role: 'Administrator',
    email: 'wangwu@company.com',
    phone: '13800138003',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    incidentName: '系统故障导致数据丢失',
    incidentDate: '2024-01-15',
    discoveryDate: '2024-01-16',
    businessUnit: 'IT & Digital',
    potentialLoss: 50000,
    recovery: 30000,
    recoverySource: '保险赔付',
    actualLoss: 20000,
    causeOfAccident: '系统维护不当',
    status: 'Open',
    reviewStatus: 'Approved',
    createdBy: {
      name: '张三',
      employeeId: 'EMP001',
      position: '风险分析师'
    },
    createdAt: '2024-01-16T10:00:00.000Z',
    updatedAt: '2024-01-16T10:00:00.000Z'
  },
  {
    id: '2',
    incidentName: '供应商违约事件',
    incidentDate: '2024-01-20',
    discoveryDate: '2024-01-21',
    businessUnit: 'Procurement',
    potentialLoss: 100000,
    recovery: 80000,
    recoverySource: '供应商赔偿',
    actualLoss: 20000,
    causeOfAccident: '供应商管理不善',
    status: 'Closed',
    reviewStatus: 'Approved',
    createdBy: {
      name: '李四',
      employeeId: 'EMP002',
      position: '风险经理'
    },
    createdAt: '2024-01-21T14:30:00.000Z',
    updatedAt: '2024-01-21T14:30:00.000Z'
  }
];

export const mockIAMItems: IAMItem[] = [
  {
    id: '1',
    title: '加强系统监控',
    description: '实施更全面的系统监控措施',
    assignedTo: 'IT团队',
    dueDate: '2024-02-15',
    status: 'In Progress',
    priority: 'High',
    relatedIncidentId: '1',
    createdAt: '2024-01-16T11:00:00.000Z',
    updatedAt: '2024-01-16T11:00:00.000Z'
  },
  {
    id: '2',
    title: '供应商评估流程优化',
    description: '建立更严格的供应商评估标准',
    assignedTo: '采购团队',
    dueDate: '2024-02-20',
    status: 'Pending',
    priority: 'Medium',
    relatedIncidentId: '2',
    createdAt: '2024-01-21T15:00:00.000Z',
    updatedAt: '2024-01-21T15:00:00.000Z'
  }
]; 