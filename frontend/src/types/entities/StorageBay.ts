export type StorageType = 'SSD' | 'HDD' | 'hybrid' | 'NVMe';
export type StorageStatus = 'active' | 'degraded' | 'offline' | 'maintenance';
export type ProtocolType = 'iSCSI' | 'FC' | 'NFS' | 'SMB' | 'FCoE';
export type BayType = 'SAN' | 'NAS' | 'DAS' | 'vSAN' | 'NFS' | 'VMFS';

export interface StorageBay {
  id: string;
  datacenter_id: string;
  vsphere_datastore_id: string;
  name: string;
  type: BayType;
  protocol: ProtocolType;
  total_capacity_gb: string;
  used_capacity_gb: string;
  free_capacity_gb: string;
  status: StorageStatus;
  storage_type: StorageType;
  last_sync: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
