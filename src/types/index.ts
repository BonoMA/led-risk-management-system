export interface User {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  role: 'Inputter' | 'Approver' | 'Administrator';
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistration {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  requestedRole: 'Inputter' | 'Approver' | 'Administrator';
  email: string;
  phone: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  incidentName: string;
  incidentDate: string;
  discoveryDate: string;
  keyProcess: string;
  incidentDescription: string;
  rootCause: string;
  potentialLoss: number;
  recovery: number;
  actualLoss: number;
  recoverySource: string;
  causeOfAccident: 'People' | 'Process' | 'System' | 'External Factors';
  causeOfAccidentDescription: string;
  involvedParties: 'Internal' | 'External' | 'Both';
  riskMitigation: string;
  actionPlan: string;
  status: 'Open' | 'Closed';
  reviewStatus: 'Draft' | 'Pending Approval L1' | 'Pending Approval L2' | 'Approved' | 'Rejected';
  businessUnit: string;
  attachment?: File;
  createdBy: {
    name: string;
    employeeId: string;
    position: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IAMItem {
  id: string;
  incidentId: string;
  issue: string;
  rootCause: string;
  actionPlan: string;
  targetDate: string;
  pic: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessUnit {
  value: string;
  label: string;
}

export interface DashboardStats {
  totalIncidents: number;
  openIncidents: number;
  closedIncidents: number;
  pendingApprovals: number;
  totalLoss: number;
  averageLoss: number;
  incidentsByMonth: Record<string, number>;
  incidentsByCause: Record<string, number>;
} 