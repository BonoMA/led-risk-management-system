import { User, Incident, IAMItem, BusinessUnit } from '../types';

export const businessUnits: BusinessUnit[] = [
  { value: 'Anti Fraud', label: 'Anti Fraud' },
  { value: 'APU PPT', label: 'APU PPT' },
  { value: 'Business Offline', label: 'Business Offline' },
  { value: 'Collection', label: 'Collection' },
  { value: 'Customer Complaint', label: 'Customer Complaint' },
  { value: 'Customer Protection', label: 'Customer Protection' },
  { value: 'Credit', label: 'Credit' },
  { value: 'Compliance', label: 'Compliance' },
  { value: 'Finance, Accounting & Tax', label: 'Finance, Accounting & Tax' },
  { value: 'Funding & Treasury', label: 'Funding & Treasury' },
  { value: 'General Affair', label: 'General Affair' },
  { value: 'Human Resource', label: 'Human Resource' },
  { value: 'Internal Audit', label: 'Internal Audit' },
  { value: 'Internal Control', label: 'Internal Control' },
  { value: 'IT Gov&Sec', label: 'IT Gov&Sec' },
  { value: 'IT Product & Delivery', label: 'IT Product & Delivery' },
  { value: 'IT & Digital', label: 'IT & Digital' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Marketing & BD', label: 'Marketing & BD' },
  { value: 'Procurement', label: 'Procurement' },
  { value: 'Productive Loan', label: 'Productive Loan' },
  { value: 'Policy & Procedure', label: 'Policy & Procedure' },
  { value: 'Risk Management', label: 'Risk Management' },
  { value: 'Remedial & Litigation', label: 'Remedial & Litigation' },
  { value: 'Strategic Communication', label: 'Strategic Communication' },
  { value: 'Others', label: 'Others' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    employeeId: 'EMP001',
    position: '风险分析师',
    department: 'Risk Management',
    role: 'Inputter'
  },
  {
    id: '2',
    name: '李四',
    employeeId: 'EMP002',
    position: '部门经理',
    department: 'Risk Management',
    role: 'Approver'
  },
  {
    id: '3',
    name: '王五',
    employeeId: 'EMP003',
    position: '风险总监',
    department: 'Risk Management',
    role: 'Administrator'
  }
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    incidentName: '系统故障导致交易中断',
    incidentDate: '2024-01-15',
    discoveryDate: '2024-01-15',
    keyProcess: '交易处理',
    incidentDescription: '核心交易系统在业务高峰期出现故障，导致交易中断2小时，影响客户体验和业务连续性。',
    rootCause: '系统负载过高，数据库连接池耗尽',
    potentialLoss: 500000,
    recovery: 100000,
    recoverySource: '保险赔付',
    actualLoss: 400000,
    causeOfAccident: 'System',
    causeOfAccidentDescription: '系统架构设计缺陷，缺乏有效的负载均衡机制',
    involvedParties: 'Internal',
    riskMitigation: '实施系统优化，增加负载均衡，建立监控预警机制',
    actionPlan: '1. 升级系统架构\n2. 实施负载均衡\n3. 建立监控体系',
    status: 'Open',
    businessUnit: 'IT & Digital',
    reviewStatus: 'Approved',
    createdBy: {
      name: '张三',
      employeeId: 'EMP001',
      position: '风险分析师'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '2',
    incidentName: '员工操作失误导致数据泄露',
    incidentDate: '2024-01-20',
    discoveryDate: '2024-01-21',
    keyProcess: '数据处理',
    incidentDescription: '员工在处理客户数据时，误将敏感信息发送给错误的收件人，造成数据泄露风险。',
    rootCause: '员工缺乏安全意识，操作流程不规范',
    potentialLoss: 200000,
    recovery: 0,
    recoverySource: '',
    actualLoss: 200000,
    causeOfAccident: 'People',
    causeOfAccidentDescription: '员工培训不足，缺乏安全意识',
    involvedParties: 'Internal',
    riskMitigation: '加强员工培训，完善操作流程，实施数据保护措施',
    actionPlan: '1. 开展安全意识培训\n2. 完善操作流程\n3. 实施数据加密',
    status: 'Open',
    businessUnit: 'Compliance',
    reviewStatus: 'Pending Approval L1',
    createdBy: {
      name: '张三',
      employeeId: 'EMP001',
      position: '风险分析师'
    },
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T09:00:00Z'
  },
  {
    id: '3',
    incidentName: '第三方供应商服务中断',
    incidentDate: '2024-01-25',
    discoveryDate: '2024-01-25',
    keyProcess: '外部服务依赖',
    incidentDescription: '关键第三方供应商服务中断，影响多个业务流程的正常运行。',
    rootCause: '供应商基础设施故障',
    potentialLoss: 300000,
    recovery: 50000,
    recoverySource: '供应商赔偿',
    actualLoss: 250000,
    causeOfAccident: 'External Factors',
    causeOfAccidentDescription: '过度依赖单一供应商，缺乏备用方案',
    involvedParties: 'Both',
    riskMitigation: '建立多供应商策略，制定应急响应计划',
    actionPlan: '1. 评估供应商风险\n2. 建立备用供应商\n3. 制定应急计划',
    status: 'Closed',
    businessUnit: 'Procurement',
    reviewStatus: 'Approved',
    createdBy: {
      name: '张三',
      employeeId: 'EMP001',
      position: '风险分析师'
    },
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-26T16:00:00Z'
  }
];

export const mockIAMItems: IAMItem[] = [
  {
    id: '1',
    incidentId: '1',
    issue: '系统架构设计缺陷',
    rootCause: '缺乏有效的负载均衡和监控机制',
    actionPlan: '升级系统架构，实施负载均衡，建立监控预警机制',
    targetDate: '2024-03-15',
    pic: 'IT团队',
    status: 'In Progress',
    progress: 60,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    incidentId: '2',
    issue: '员工安全意识不足',
    rootCause: '缺乏系统性的安全培训',
    actionPlan: '开展安全意识培训，完善操作流程，实施数据保护措施',
    targetDate: '2024-02-28',
    pic: '人力资源部',
    status: 'Pending',
    progress: 0,
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z'
  }
]; 