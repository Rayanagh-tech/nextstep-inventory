import API from './api';
import type {
  DatacenterMetric,
  StorageUsage,
  SystemHeartbeat,
  ActivityLog,
  VmTrend,
  VmMetricLog
} from '../types/entities/DatacenterMetric';

export const getDatacenterMetrics = async (): Promise<DatacenterMetric[]> => {
  const res = await API.get('/dashboard/datacenter-metrics');

  return res.data.map((item: any) => ({
    id: item.id,
    datacenter_id: item.datacenter_id,
    datacenter_name: item.datacenter_name ?? item.datacenter, // fallback
    total_vms: Number(item.total_vms),
    total_servers: Number(item.total_servers),
    avg_cpu_usage: Number(item.avg_cpu_usage),
    avg_ram_usage: Number(item.avg_ram_usage),
    storage_used_tb: Number(item.storage_used_tb),
    recorded_at: item.recorded_at,
    logged_at: new Date().toISOString(),
    source: 'Dashboard',
    message: 'Datacenter metric snapshot',
  }));
};

// frontend/src/services/dashboard.ts
export const getStorageUsage = async (): Promise<StorageUsage[]> => {
  const res = await API.get('/dashboard/storage-usage');
  return res.data.map((item: any) => ({
    datacenter_name: item.datacenter,
    storage_type: 'aggregate',
    total_capacity_gb: item.total,
    used_capacity_gb: item.used,
    free_capacity_gb: item.total - item.used,
    logged_at: item.hour, // 👈 important
    source: 'Storage',
    message: 'Storage usage overview',
  }));
};



export const getSystemHeartbeats = async (): Promise<SystemHeartbeat[]> => {
  const res = await API.get('/dashboard/heartbeats');
  return res.data.map((log: any) => ({
    id: log.id,
    type: log.type || "heartbeat",
    action: log.action || "heartbeat",
    status: log.status || "info",
    created_at: log.created_at,
    logged_at: log.created_at,
    source: log.source || "System",
    message: log.message || log.action || "Heartbeat received",
  }));
};


export const getRecentActivity = async (): Promise<ActivityLog[]> => {
  const res = await API.get('/dashboard/activity');
  return res.data.map((log: any) => ({
    id: log.id,
    type: log.type || "activity",
    action: log.action || "activity",
    status: log.status || "info",
    created_at: log.created_at,
    logged_at: log.logged_at || log.created_at,
    source: log.source || "System",
    message: log.message || log.action || "Activity logged",
  }));
};

export const getVmTrends = async (): Promise<VmTrend[]> => {
  const res = await API.get('/dashboard/vm-trends');
  return res.data.map((entry: any) => ({
    timestamp: entry.hour,
    cpu_usage: entry.avg_cpu,
    ram_usage: entry.avg_ram,
    logged_at: entry.hour,
    source: entry.vm_name,
    message: 'Average usage',
  }));
};

export const getVmMetricLogs = async (): Promise<VmMetricLog[]> => {
  const res = await API.get("/dashboard/vm-metrics");
  return res.data.map((log: any) => ({
    id: log.id,
    vm_id: log.vm_id,
    vm_name: log.vm_name,
    cpu_usage: log.cpu_usage,
    ram_usage: log.ram_usage,
    uptime_percent: log.uptime_percent,
    status: log.status || "info",
    logged_at: log.logged_at,
    message: `CPU: ${log.cpu_usage}% | RAM: ${log.ram_usage}%`,
  }));
};

