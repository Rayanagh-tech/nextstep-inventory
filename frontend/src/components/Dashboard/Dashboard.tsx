import { useEffect } from "react";
import { useStore } from "@/store";
import { KpiCard } from "./KpiCard";
import { StatusBadge } from "./StatusBadge";
import { ActivityFeed } from "./ActivityFeed";
import { MetricsChart } from "./MetricsChart";
import { ExpandableHeartbeatItem } from "./ExpandableHeartbeatItem";
import { EnhancedActivityFeed } from "./EnhancedActivityFeed";
import { StorageUsageChart } from "./StorageUsageChart";
import { VmMetricsFeed } from "./VmMetricsFeed";


import {
  Server,
  HardDrive,
  Activity,
  Database,
  Cpu,
  MemoryStick,
  TrendingUp,
} from "lucide-react";
import { log } from "console";

export function Dashboard() {
  const {
    datacenterMetrics,
    vmTrends,
    storageUsage,
    recentActivity,
    systemHeartbeats,
    fetchDashboardMetrics,
  } = useStore();

  useEffect(() => {
    fetchDashboardMetrics();
    const interval = setInterval(fetchDashboardMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardMetrics]);

  

  const kpiSummary = {
    totalVms: datacenterMetrics.reduce((sum, d) => sum + d.total_vms, 0),
    totalServers: datacenterMetrics.reduce((sum, d) => sum + d.total_servers, 0),
    storageUsed: datacenterMetrics.reduce((sum, d) => sum + d.storage_used_tb, 0),
    activeDatacenters: datacenterMetrics.length,
    avgCpuUsage:
      datacenterMetrics.length > 0
        ? Math.round(datacenterMetrics.reduce((sum, d) => sum + d.avg_cpu_usage, 0) / datacenterMetrics.length)
        : 0,
    avgRamUsage:
      datacenterMetrics.length > 0
        ? Math.round(datacenterMetrics.reduce((sum, d) => sum + d.avg_ram_usage, 0) / datacenterMetrics.length)
        : 0,
  };

  const storagePercentage = Math.round((kpiSummary.storageUsed / 50) * 100); // Adjust as needed

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Infrastructure Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring and analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total VM"
            value={kpiSummary.totalVms}
            subtitle="Active VMs"
            icon={<Server />}
            status="online"
            trend={{ value: 5, isPositive: true }}
          />
          <KpiCard
            title="Physical Servers"
            value={kpiSummary.totalServers}
            subtitle="In operation"
            icon={<Database />}
            status="online"
          />
          <KpiCard
            title="Storage Used"
            value={`${Number(kpiSummary.storageUsed || 0).toFixed(1)} TB`}
            subtitle={`${storagePercentage}% of capacity`}
            icon={<HardDrive />}
            status={storagePercentage > 80 ? "warning" : "online"}
          />
          <KpiCard
            title="Active Datacenters"
            value={kpiSummary.activeDatacenters}
            subtitle="Operational sites"
            icon={<Activity />}
            status="online"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsChart
            title="CPU Usage Trends"
            data={vmTrends}
            dataKey="cpu_usage"
            color="hsl(var(--chart-1))"
            type="area"
            unit="%"
            icon={<Cpu />}
          />
          <MetricsChart
            title="RAM Usage Trends"
            data={vmTrends}
            dataKey="ram_usage"
            color="hsl(var(--chart-2))"
            type="area"
            unit="%"
            icon={<MemoryStick />}
          />
        </div>

        {/* 📊 Storage and Activity Row */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <MetricsChart
    title="Storage Used Per Datacenter"
    data={storageUsage.map(s => ({
      timestamp: s.logged_at || new Date().toISOString(),
      used: parseFloat((s.used_capacity_gb / 1000).toFixed(2)), // GB → TB
      datacenter: s.datacenter_name
    }))}
    dataKey="used"
    unit="TB"
    type="bar" // 👈 important!
    icon="💾"
    />





  {/* Enhanced VM Activity Feed */}
  <EnhancedActivityFeed logs={recentActivity} />
  </div>

{/* VM Metrics Feed */}
<div className="bg-card rounded-xl p-4 shadow space-y-4">
  <VmMetricsFeed />
</div>



        {/* System Heartbeats */}
<div className="bg-card rounded-xl p-4 shadow space-y-4">
  <h2 className="text-xl font-extrabold text-foreground">❤️ System Heartbeats</h2>
  <div className="space-y-2 max-h-[400px] overflow-y-auto">
    {systemHeartbeats.map((hb) => (
      <ExpandableHeartbeatItem key={hb.id} heartbeat={hb} />
    ))}
  </div>
</div>



      </div>
    </div>
  );
}
