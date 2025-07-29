import { Incident, IAMItem, User, UserRegistration } from '../types';
import { mockIncidents, mockIAMItems } from '../data/mockData';

class StorageService {
  // 事件相关方法
  getIncidents(): Incident[] {
    const stored = localStorage.getItem('led_incidents');
    return stored ? JSON.parse(stored) : [];
  }

  saveIncidents(incidents: Incident[]): void {
    localStorage.setItem('led_incidents', JSON.stringify(incidents));
  }

  addIncident(incident: Incident): void {
    const incidents = this.getIncidents();
    incidents.push(incident);
    this.saveIncidents(incidents);
  }

  updateIncident(updatedIncident: Incident): void {
    const incidents = this.getIncidents();
    const index = incidents.findIndex(inc => inc.id === updatedIncident.id);
    if (index !== -1) {
      incidents[index] = updatedIncident;
      this.saveIncidents(incidents);
    }
  }

  deleteIncident(incidentId: string): void {
    const incidents = this.getIncidents();
    const filtered = incidents.filter(inc => inc.id !== incidentId);
    this.saveIncidents(filtered);
  }

  // IAM项目相关方法
  getIAMItems(): IAMItem[] {
    const stored = localStorage.getItem('led_iam_items');
    return stored ? JSON.parse(stored) : [];
  }

  saveIAMItems(items: IAMItem[]): void {
    localStorage.setItem('led_iam_items', JSON.stringify(items));
  }

  addIAMItem(item: IAMItem): void {
    const items = this.getIAMItems();
    items.push(item);
    this.saveIAMItems(items);
  }

  updateIAMItem(updatedItem: IAMItem): void {
    const items = this.getIAMItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveIAMItems(items);
    }
  }

  deleteIAMItem(itemId: string): void {
    const items = this.getIAMItems();
    const filtered = items.filter(item => item.id !== itemId);
    this.saveIAMItems(filtered);
  }

  // 用户相关方法
  getUsers(): User[] {
    const stored = localStorage.getItem('led_users');
    return stored ? JSON.parse(stored) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem('led_users', JSON.stringify(users));
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  deleteUser(userId: string): void {
    const users = this.getUsers();
    const filtered = users.filter(user => user.id !== userId);
    this.saveUsers(filtered);
  }

  // 用户注册申请相关方法
  getUserRegistrations(): UserRegistration[] {
    const stored = localStorage.getItem('led_user_registrations');
    return stored ? JSON.parse(stored) : [];
  }

  saveUserRegistrations(registrations: UserRegistration[]): void {
    localStorage.setItem('led_user_registrations', JSON.stringify(registrations));
  }

  addUserRegistration(registration: UserRegistration): void {
    const registrations = this.getUserRegistrations();
    registrations.push(registration);
    this.saveUserRegistrations(registrations);
  }

  updateUserRegistration(updatedRegistration: UserRegistration): void {
    const registrations = this.getUserRegistrations();
    const index = registrations.findIndex(reg => reg.id === updatedRegistration.id);
    if (index !== -1) {
      registrations[index] = updatedRegistration;
      this.saveUserRegistrations(registrations);
    }
  }

  deleteUserRegistration(registrationId: string): void {
    const registrations = this.getUserRegistrations();
    const filtered = registrations.filter(reg => reg.id !== registrationId);
    this.saveUserRegistrations(filtered);
  }

  // 数据管理方法
  clearAllData(): void {
    localStorage.removeItem('led_incidents');
    localStorage.removeItem('led_iam_items');
    localStorage.removeItem('led_users');
    localStorage.removeItem('led_user_registrations');
    localStorage.removeItem('led_current_user');
    localStorage.removeItem('led_is_authenticated');
  }

  exportData(): string {
    const data = {
      incidents: this.getIncidents(),
      iamItems: this.getIAMItems(),
      users: this.getUsers(),
      userRegistrations: this.getUserRegistrations(),
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
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

export const storageService = new StorageService(); 