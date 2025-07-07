export type ServerStatus = 'online' | 'offline' | 'maintenance';

export interface Server {
  id: string;
  name: string;
  hostname: string;            // ✅ Corrected: matches backend key
  model?: string;              // ➕ Optional: from backend
  cpu_cores?: number;          // ➕ Optional: from backend
  total_ram_gb?: number;       // ➕ Optional: from backend
  ip_address: string;         // 🛠 match backend key casing
  datacenter_id: string;      // ✅ match foreign key expected by backend
  status: ServerStatus;
  last_backup?: string;       // 🛠 match snake_case if from DB
  manufacturer?: string;
  serial_number?: string;
  cpu_sockets?: number;
  cpu_threads?: number;
  cpu_model?: string;
  cpu_speed_ghz?: number;
  installed_ram_gb?: number;
  cluster_name?: string;
  esxi_version?: string;
  fqdn?: string;
  vsphere_host_id?: string;
  vsphere_connection_status?: string;
  tags?: string[];
  custom_attributes?: Record<string, string>;
}
