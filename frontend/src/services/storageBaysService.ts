import API from './api';
import type { StorageBay } from '@/types/entities/StorageBay';

export const getAllStorageBays = async (): Promise<StorageBay[]> => {
    const res = await API.get('/storage-bays');
    return res.data;
  };
  

export const getStorageBayById = async (id: string): Promise<StorageBay> => {
  const res = await API.get(`/storage-bays/${id}`);
  return res.data;
};

export const createStorageBay = async (data: Partial<StorageBay>): Promise<StorageBay> => {
  const res = await API.post('/storage-bays', data);
  return res.data.storage_bay;
};

export const updateStorageBay = async (id: string, data: Partial<StorageBay>): Promise<StorageBay> => {
  const res = await API.put(`/storage-bays/${id}`, data);
  return res.data.storage_bay;
};

export const deleteStorageBay = async (id: string): Promise<void> => {
  await API.delete(`/storage-bays/${id}`);
};
