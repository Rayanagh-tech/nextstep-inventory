// components/StatusBadge.tsx
import { AlertTriangle, Activity } from "lucide-react";
import clsx from "clsx";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const classes = clsx(
    "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
    {
      "bg-green-100 text-green-700": normalized === "online",
      "bg-yellow-100 text-yellow-800": normalized === "warning",
      "bg-red-100 text-red-700": normalized === "offline" || normalized === "critical",
      "bg-gray-200 text-gray-800": !["online", "warning", "offline", "critical"].includes(normalized),
    }
  );

  const icon =
    normalized === "online" ? <Activity size={14} /> : <AlertTriangle size={14} />;

  return <span className={classes}>{icon} {normalized.toUpperCase()}</span>;
}
