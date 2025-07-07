import API from './api';
import type { Datacenter } from '@/types/entities/Datacenter';

// GET all datacenters
export const getAllDatacenters = async (): Promise<Datacenter[]> => {
  const response = await API.get('/datacenters');
  return response.data;
};

// GET single datacenter by ID
export const getDatacenterById = async (id: string): Promise<Datacenter> => {
  const response = await API.get(`/datacenters/${id}`);
  return response.data;
};

// CREATE a new datacenter
export const createDatacenter = async (data: Partial<Datacenter>): Promise<Datacenter> => {
  const response = await API.post('/datacenters', data);
  return response.data;
};

// UPDATE a datacenter
export const updateDatacenter = async (id: string, data: Partial<Datacenter>): Promise<Datacenter> => {
  const response = await API.put(`/datacenters/${id}`, data);
  return response.data;
};

// DELETE a datacenter
export const deleteDatacenter = async (id: string): Promise<void> => {
  await API.delete(`/datacenters/${id}`);
};


