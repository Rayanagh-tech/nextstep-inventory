// frontend/src/components/Dashboard/EnhancedActivityFeed.tsx
import { ActivityLog } from "@/types/entities/DatacenterMetric";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import clsx from "clsx";

const statusIcons = {
  success: <CheckCircle className="text-green-500" size={16} />,
  warning: <AlertTriangle className="text-yellow-500" size={16} />,
  error: <XCircle className="text-red-500" size={16} />,
  info: <Info className="text-blue-500" size={16} />,
};

const statusBg = {
  success: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
};

export function EnhancedActivityFeed({ logs }: { logs: ActivityLog[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-card rounded-xl p-4 shadow text-muted-foreground text-sm">
        No recent activity logs available.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 shadow space-y-4">
      <h2 className="text-xl font-extrabold text-foreground">📝 System Activity Logs</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className={clsx(
              "flex flex-col gap-2 p-3 rounded-md border",
              statusBg[log.type as keyof typeof statusBg] || "bg-muted"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcons[log.type as keyof typeof statusIcons] || statusIcons.info}
                <p className="font-medium text-foreground">{log.source}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(log.logged_at).toLocaleString()}
              </p>
            </div>

            <div className="text-sm text-muted-foreground pl-6">
              {log.message}
            </div>

            <div className="flex justify-end text-xs text-muted-foreground italic pr-2">
              {log.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
