// components/ExpandableHeartbeatItem.tsx
import { useState } from "react";
import { SystemHeartbeat } from "@/types/entities/DatacenterMetric";
import { StatusBadge } from "./StatusBadge";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ExpandableHeartbeatItem({ heartbeat }: { heartbeat: SystemHeartbeat }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-md bg-muted">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-accent focus:outline-none"
      >
        <div className="flex flex-col">
          <span className="font-medium">{heartbeat.action}</span>
          <span className="text-sm text-muted-foreground">
            {new Date(heartbeat.created_at).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={heartbeat.status} />
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 py-2 text-sm bg-background border-t space-y-1 text-muted-foreground">
          <p><strong>ID:</strong> {heartbeat.id}</p>
          <p><strong>Type:</strong> {heartbeat.type}</p>
          <p><strong>Status:</strong> {heartbeat.status}</p>
          <p><strong>Logged At:</strong> {new Date(heartbeat.logged_at).toLocaleString()}</p>
          <p><strong>Source:</strong> {heartbeat.source}</p>
          <p><strong>Message:</strong> {heartbeat.message || "N/A"}</p>
        </div>
      )}
    </div>
  );
}
