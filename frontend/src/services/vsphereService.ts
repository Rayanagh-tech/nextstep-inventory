import API from './api';
import type { VsphereConnection } from '@/types/entities/VsphereConnection';
import type { ConnectionTestResult } from '@/types/entities/VsphereConnection';

/**
 * Fetch all vSphere connections
 */

export const getAllConnections = async (): Promise<VsphereConnection[]> => {
  const res: any = await API.get('/vsphere');
  if (!res.data) throw new Error('Failed to fetch vSphere connections');

  return res.data.connections;
};
/**
 * Test vSphere connection (mock or real backend connection test)
 */
export const testConnection = async (params: {
  vcenter_url: string;
  api_username: string;
  api_password: string;
}): Promise<ConnectionTestResult> => {
  const response = await API.post('/vsphere/test', params);
  return response.data;
};
/**
 * Create a new vSphere connection
 */
export const createConnection = async (data: {
  datacenter_id: string;
  api_username: string;
  api_password: string;
  api_version?: string;
  tags?: string[];
}): Promise<VsphereConnection> => {
  const response = await API.post('/vsphere', data);
  return response.data;
};

/**
 * Update an existing vSphere connection
 */
export const updateConnection = async (
  id: string,
  updates: Partial<{
    api_username: string;
    api_password: string;
    api_version: string;
    is_active: boolean;
    last_used_by: string;
    tags?: string[];
  }>
): Promise<VsphereConnection> => {
  const response = await API.put(`/vsphere/${id}`, updates);
  return response.data;
};


/**
 * Delete a vSphere connection
 */
export const deleteConnection = async (id: string): Promise<{ message: string }> => {
  const response = await API.delete(`/vsphere/${id}`);
  return response.data;
};
