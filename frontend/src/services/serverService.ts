import API from './api';
import type { Server } from '@/types/entities/Server';

// GET all servers
export const getAllServers = async (): Promise<Server[]> => {
  const response = await API.get('/servers');
  return response.data;
};

// GET single server by ID
export const getServerById = async (id: string): Promise<Server> => {
  const response = await API.get(`/servers/${id}`);
  return response.data;
};

// CREATE a new server
export const createServer = async (data: Partial<Server>): Promise<Server> => {
  const response = await API.post('/servers', data);
  return response.data;
};

// UPDATE a server
export const updateServer = async (id: string, data: Partial<Server>): Promise<Server> => {
  const response = await API.put(`/servers/${id}`, data);
  return response.data;
};

// DELETE a server
export const deleteServer = async (id: string): Promise<void> => {
  await API.delete(`/servers/${id}`);
};
