export interface Vm {
  id: string;
  name: string;
  server_id: string | null;
  datacenter_id: string | null;
  vsphere_id: string;
  guest_hostname?: string;
  ip_address?: string[];
  os_type?: string;
  os_version?: string;
  vcpu_count?: number;
  memory_gb?: number;
  storage_gb?: number;
  power_state?: 'poweredOn' | 'poweredOff' | 'suspended' | 'unknown';
  tools_status?: string;
  tools_version?: string;
  last_backup?: string;
  backup_status?: string;
  owner_email?: string;
  business_unit?: string;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
  tags?: any;
  vsphere_attributes?: any;
  created_at?: string;
  updated_at?: string;
}
