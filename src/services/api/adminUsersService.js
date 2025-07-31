import mockAdminUsers from '@/services/mockData/adminUsers.json';
import { toast } from 'react-toastify';

let adminUsers = [...mockAdminUsers];
let nextId = Math.max(...adminUsers.map(user => user.Id)) + 1;

export const adminUsersService = {
  getAll: () => {
    return Promise.resolve([...adminUsers]);
  },

  getById: (id) => {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return Promise.reject(new Error('Invalid user ID'));
    }
    
    const user = adminUsers.find(u => u.Id === userId);
    if (!user) {
      return Promise.reject(new Error('User not found'));
    }
    
    return Promise.resolve({ ...user });
  },

  create: (userData) => {
    const newUser = {
      ...userData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    adminUsers.push(newUser);
    toast.success('Admin user created successfully');
    return Promise.resolve({ ...newUser });
  },

  update: (id, userData) => {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return Promise.reject(new Error('Invalid user ID'));
    }

    const index = adminUsers.findIndex(u => u.Id === userId);
    if (index === -1) {
      return Promise.reject(new Error('User not found'));
    }

    const updatedUser = {
      ...adminUsers[index],
      ...userData,
      Id: userId // Ensure ID doesn't change
    };

    adminUsers[index] = updatedUser;
    toast.success('Admin user updated successfully');
    return Promise.resolve({ ...updatedUser });
  },

  delete: (id) => {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return Promise.reject(new Error('Invalid user ID'));
    }

    const index = adminUsers.findIndex(u => u.Id === userId);
    if (index === -1) {
      return Promise.reject(new Error('User not found'));
    }

    adminUsers.splice(index, 1);
    toast.success('Admin user deleted successfully');
    return Promise.resolve();
  }
};