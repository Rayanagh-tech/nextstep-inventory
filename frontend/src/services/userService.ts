import API from './api';
import { User } from '@/types/store';

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

// Update user profile
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

export const updatePassword = async (userId: string, data: { currentPassword: string; newPassword: string }) => {
  const response = await API.put(`/users/${userId}/password`, data);
  return response.data;
};

export const updateMfaSetting = async (userId: string, data: { mfa_enabled: boolean }) => {
  const response = await API.put(`/users/${userId}/mfa`, data);
  return response.data;
};
// Get all users (for admin dropdowns, etc.)
export const getAllUsers = async (): Promise<User[]> => {
  const res = await API.get('/users'); // ✅ Uses token + base URL
  return res.data;
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};


