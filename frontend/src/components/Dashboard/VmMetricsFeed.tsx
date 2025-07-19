import { useEffect } from "react";
import { useStore } from "@/store";
import { Cpu, MemoryStick, Timer } from "lucide-react";
import clsx from "clsx";

export function VmMetricsFeed() {
  const { vmMetricLogs, fetchVmMetricLogs } = useStore();

  useEffect(() => {
    fetchVmMetricLogs();
    const interval = setInterval(fetchVmMetricLogs, 30000);
    return () => clearInterval(interval);
  }, [fetchVmMetricLogs]);

  const statusColors: Record<string, string> = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    critical: "text-red-600",
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg space-y-4 max-w-full md:max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <span role="img" aria-label="magnifier">🔍</span> VM Metrics 
      </h2>

      <ol className="relative border-l border-border pl-6 space-y-4 max-h-[480px] overflow-y-auto pr-4">
        {vmMetricLogs.map((log) => (
          <li key={log.id} className="group relative">
            <span
              className={clsx(
                "absolute left-0 -ml-[7px] h-3 w-3 rounded-full ring-2 ring-background",
                {
                  "bg-green-500": log.status === "success",
                  "bg-yellow-500": log.status === "warning",
                  "bg-red-500": log.status === "error" || log.status === "critical",
                }
              )}
            />

<div className="flex justify-between items-center">
  {/* Dot + Name */}
  <div className="flex items-center gap-2">
    <div
      className={clsx(
        "h-3 w-3 rounded-full shrink-0",
        statusColors[log.status] || "bg-muted"
      )}
    />
    <span className="text-sm font-semibold truncate max-w-[200px] text-foreground">
      {log.vm_name}
    </span>
  </div>

  {/* Status Text */}
  <span className={clsx("text-sm font-medium", statusColors[log.status] || "text-muted")}>
    {log.status?.toUpperCase()}
  </span>
</div>


            <div className="bg-muted px-3 py-2 rounded-md text-sm shadow-sm mt-1">
              <div className="flex flex-wrap gap-3 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <Cpu size={14} /> {log.cpu_usage}% CPU
                </span>
                <span className="flex items-center gap-1">
                  <MemoryStick size={14} /> {log.ram_usage}% RAM
                </span>
                <span className="flex items-center gap-1">
                  <Timer size={14} /> {log.uptime_percent}% Uptime
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Logged at {new Date(log.logged_at).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
