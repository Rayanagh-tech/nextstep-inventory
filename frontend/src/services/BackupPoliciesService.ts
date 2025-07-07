// src/services/BackupPoliciesService.ts
import API from './api';
import type {
  BackupPolicy,
  CreateBackupPolicyDto,
  UpdateBackupPolicyDto
} from '@/types/entities/BackupPolicy';

const BackupPoliciesService = {
  async getAll(): Promise<BackupPolicy[]> {
    const response = await API.get('/backup-policies');
    return response.data.policies;
  },

  async getById(id: string): Promise<BackupPolicy> {
    const response = await API.get(`/backup-policies/${id}`);
    return response.data;
  },

  async create(data: CreateBackupPolicyDto): Promise<BackupPolicy> {
    const response = await API.post('/backup-policies', data);
    return response.data;
  },

  async update(id: string, data: UpdateBackupPolicyDto): Promise<BackupPolicy> {
    const response = await API.put(`/backup-policies/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await API.delete(`/backup-policies/${id}`);
    return response.data;
  }
};

export default BackupPoliciesService;
