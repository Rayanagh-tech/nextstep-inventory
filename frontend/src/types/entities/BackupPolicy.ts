// src/types/entities/BackupPolicy.ts
export type BackupStatus = 'active' | 'inactive';

export interface BackupPolicy {
  id: string;
  datacenter_id: string;
  policy_name: string;
  retention_days: number;
  backup_type: 'full' | 'incremental' | 'differential' | 'archive';
  schedule_type: 'hourly' | 'daily' | 'weekly' | 'monthly';
  status: BackupStatus;
  last_run?: string;
  next_run?: string;
  targets?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBackupPolicyDto {
  policy_name: string;
  schedule_type: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retention_days: number;
  backup_type: 'full' | 'incremental' | 'differential' | 'archive';
  datacenter_id: string;
}

export interface UpdateBackupPolicyDto {
  policy_name?: string;
  schedule_type?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retention_days?: number;
  backup_type?: 'full' | 'incremental' | 'differential' | 'archive';
}
