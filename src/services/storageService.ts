import { Incident, IAMItem, User, UserRegistration, BusinessUnit } from '../types';
import { mockIncidents, mockIAMItems, mockUsers, businessUnits } from '../data/mockData';

class StorageService {
  // Incident related methods
  getIncidents(): Incident[] {
    const stored = localStorage.getItem('incidents');
    if (stored) {
      return JSON.parse(stored);
    }
    // 初始化时加载模拟数据
    localStorage.setItem('incidents', JSON.stringify(mockIncidents));
    return mockIncidents;
  }

  saveIncidents(incidents: Incident[]): void {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }

  addIncident(incident: Incident): void {
    const incidents = this.getIncidents();
    incidents.push(incident);
    this.saveIncidents(incidents);
  }

  updateIncident(updatedIncident: Incident): void {
    const incidents = this.getIncidents();
    const index = incidents.findIndex(i => i.id === updatedIncident.id);
    if (index !== -1) {
      incidents[index] = updatedIncident;
      this.saveIncidents(incidents);
    }
  }

  deleteIncident(incidentId: string): void {
    const incidents = this.getIncidents();
    const filtered = incidents.filter(i => i.id !== incidentId);
    this.saveIncidents(filtered);
  }

  // IAM Item related methods
  getIAMItems(): IAMItem[] {
    const stored = localStorage.getItem('iamItems');
    if (stored) {
      return JSON.parse(stored);
    }
    // 初始化时加载模拟数据
    localStorage.setItem('iamItems', JSON.stringify(mockIAMItems));
    return mockIAMItems;
  }

  saveIAMItems(items: IAMItem[]): void {
    localStorage.setItem('iamItems', JSON.stringify(items));
  }

  addIAMItem(item: IAMItem): void {
    const items = this.getIAMItems();
    items.push(item);
    this.saveIAMItems(items);
  }

  updateIAMItem(updatedItem: IAMItem): void {
    const items = this.getIAMItems();
    const index = items.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveIAMItems(items);
    }
  }

  deleteIAMItem(itemId: string): void {
    const items = this.getIAMItems();
    const filtered = items.filter(i => i.id !== itemId);
    this.saveIAMItems(filtered);
  }

  // User related methods
  getUsers(): User[] {
    const stored = localStorage.getItem('users');
    if (stored) {
      return JSON.parse(stored);
    }
    // 初始化时加载模拟数据
    localStorage.setItem('users', JSON.stringify(mockUsers));
    return mockUsers;
  }

  saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  deleteUser(userId: string): void {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);
  }

  // User Registration related methods
  getUserRegistrations(): UserRegistration[] {
    const stored = localStorage.getItem('userRegistrations');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  }

  saveUserRegistrations(registrations: UserRegistration[]): void {
    localStorage.setItem('userRegistrations', JSON.stringify(registrations));
  }

  addUserRegistration(registration: UserRegistration): void {
    const registrations = this.getUserRegistrations();
    registrations.push(registration);
    this.saveUserRegistrations(registrations);
  }

  updateUserRegistration(updatedRegistration: UserRegistration): void {
    const registrations = this.getUserRegistrations();
    const index = registrations.findIndex(r => r.id === updatedRegistration.id);
    if (index !== -1) {
      registrations[index] = updatedRegistration;
      this.saveUserRegistrations(registrations);
    }
  }

  deleteUserRegistration(registrationId: string): void {
    const registrations = this.getUserRegistrations();
    const filtered = registrations.filter(r => r.id !== registrationId);
    this.saveUserRegistrations(filtered);
  }

  // Business Unit related methods
  getBusinessUnits(): BusinessUnit[] {
    const stored = localStorage.getItem('businessUnits');
    if (stored) {
      return JSON.parse(stored);
    }
    // 初始化时加载模拟数据，转换为新的BusinessUnit格式
    const initialBusinessUnits: BusinessUnit[] = businessUnits.map(unit => ({
      id: unit.id,
      name: unit.name,
      code: unit.code,
      description: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    localStorage.setItem('businessUnits', JSON.stringify(initialBusinessUnits));
    return initialBusinessUnits;
  }

  saveBusinessUnits(units: BusinessUnit[]): void {
    localStorage.setItem('businessUnits', JSON.stringify(units));
  }

  addBusinessUnit(unit: BusinessUnit): void {
    const units = this.getBusinessUnits();
    units.push(unit);
    this.saveBusinessUnits(units);
  }

  updateBusinessUnit(updatedUnit: BusinessUnit): void {
    const units = this.getBusinessUnits();
    const index = units.findIndex(u => u.id === updatedUnit.id);
    if (index !== -1) {
      units[index] = updatedUnit;
      this.saveBusinessUnits(units);
    }
  }

  deleteBusinessUnit(unitId: string): void {
    const units = this.getBusinessUnits();
    const filtered = units.filter(u => u.id !== unitId);
    this.saveBusinessUnits(filtered);
  }

  // Data management methods
  clearAllData(): void {
    localStorage.removeItem('incidents');
    localStorage.removeItem('iamItems');
    localStorage.removeItem('users');
    localStorage.removeItem('userRegistrations');
    localStorage.removeItem('businessUnits');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }

  exportData(): string {
    const data = {
      incidents: this.getIncidents(),
      iamItems: this.getIAMItems(),
      users: this.getUsers(),
      userRegistrations: this.getUserRegistrations(),
      businessUnits: this.getBusinessUnits(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.incidents) this.saveIncidents(data.incidents);
      if (data.iamItems) this.saveIAMItems(data.iamItems);
      if (data.users) this.saveUsers(data.users);
      if (data.userRegistrations) this.saveUserRegistrations(data.userRegistrations);
      if (data.businessUnits) this.saveBusinessUnits(data.businessUnits);
      
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

export const storageService = new StorageService(); 