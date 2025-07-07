import API from './api';
import type { Alert } from '@/types/entities/Alert';

// GET all alerts
export const getAllAlerts = async (): Promise<Alert[]> => {
  const response = await API.get('/alerts');
  return response.data;
};

// GET single alert by ID
export const getAlertById = async (id: string): Promise<Alert> => {
  const response = await API.get(`/alerts/${id}`);
  return response.data;
};

// CREATE a new alert
export const createAlert = async (data: Partial<Alert>): Promise<Alert> => {
  const response = await API.post('/alerts', data);
  return response.data;
};

// UPDATE an existing alert
export const updateAlert = async (id: string, data: Partial<Alert>): Promise<Alert> => {
  const response = await API.put(`/alerts/${id}`, data);
  return response.data;
};

// DELETE an alert
export const deleteAlert = async (id: string): Promise<void> => {
  await API.delete(`/alerts/${id}`);
};

