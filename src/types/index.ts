export interface User {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  role: 'Inputter' | 'Approver' | 'Administrator';
  email: string;
  phone: string;
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
  businessUnit: string;
  potentialLoss: number;
  recovery: number;
  actualLoss: number;
  recoverySource: string;
  causeOfAccident: string;
  status: 'Open' | 'Closed';
  reviewStatus: 'Draft' | 'Pending Approval L1' | 'Pending Approval L2' | 'Approved' | 'Rejected';
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
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High';
  relatedIncidentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
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