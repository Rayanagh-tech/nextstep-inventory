// frontend/src/types/entities/DashboardMetrics.ts

export interface DatacenterMetric {
    id: string;
    datacenter_id: string;
    datacenter_name: string;
    total_vms: number;
    total_servers: number;
    avg_cpu_usage: number;
    avg_ram_usage: number;
    storage_used_tb: number;
    recorded_at: string;
    logged_at: string;
    source: string;
    message: string;
  }
  
  export interface StorageUsage {
    datacenter_name: string;
    storage_type: string;
    total_capacity_gb: number;
    used_capacity_gb: number;
    free_capacity_gb: number;
    logged_at: string;
    source: string;
    message: string;
  }
  
  export interface SystemHeartbeat {
    id: string;
    type: string;
    action: string;
    status: string;
    created_at: string;
    logged_at: string;
    source: string;
    message: string;
  }
  
  
  
  export interface VmTrend {
    vm_name: string;
    timestamp: string;
    cpu_usage: number;
    ram_usage: number;
    logged_at: string;
    source: string;
    message: string;
  }
  
  export interface VmMetricLog {
    id: number;
    vm_id: string;
    vm_name: string;
    cpu_usage: string;
    ram_usage: string;
    uptime_percent: string;
    status: string;
    logged_at: string; // from backend (TIMESTAMP)
    message: string;

  }
  

  export interface ActivityLog {
    id: string;
    type: string;           // e.g., "info", "warning", "error"
    action: string;
    status: string;
    created_at: string;
    logged_at: string;
    source: string;
    message: string;
  }

  