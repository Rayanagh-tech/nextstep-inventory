// components/StorageUsageChart.tsx
import { MetricsChart } from "./MetricsChart";
import { TrendingUp } from "lucide-react";
import { StorageUsage } from "@/types/entities/DatacenterMetric";

export function StorageUsageChart({ data }: { data: StorageUsage[] }) {
  const formatted = data.map((s) => ({
    datacenter: s.datacenter_name,
    timestamp: s.logged_at,
    used: parseFloat((s.used_capacity_gb / 1024).toFixed(2)), // Convert to TB
  }));

  return (
    <MetricsChart
      title="Storage Usage Over Time"
      data={formatted}
      dataKey="used"
      color="hsl(var(--chart-3))"
      type="line"
      unit=" TB"
      icon={<TrendingUp />}
    />
  );
}
