import API from './api';
import type { Vm } from '@/types/entities/Vm';

export const getAllVms = async (): Promise<Vm[]> => {
    const res = await API.get('/vms');
    return res.data;
  };
  

export const getVmById = async (id: string): Promise<Vm> => {
  const res = await API.get(`/vms/${id}`);
  return res.data;
};

export const createVm = async (data: Partial<Vm>): Promise<Vm> => {
  const res = await API.post('/vms', data);
  return res.data.vm;
};

export const updateVm = async (id: string, data: Partial<Vm>): Promise<Vm> => {
  const res = await API.put(`/vms/${id}`, data);
  return res.data.vm;
};

export const deleteVm = async (id: string): Promise<void> => {
  await API.delete(`/vms/${id}`);
};
