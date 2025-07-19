import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { ScrollArea } from "@/components/UI/scroll-area";
import { Clock, Server, AlertCircle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type?: "info" | "warning" | "error" | "success" | string;
  message?: string;
  timestamp?: string;
  source?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
}

const getActivityIcon = (type: ActivityItem["type"]) => {
  const baseClass = "h-4 w-4";
  switch (type) {
    case "error":
      return <AlertCircle className={cn(baseClass, "text-destructive")} />;
    case "warning":
      return <AlertCircle className={cn(baseClass, "text-yellow-500 animate-pulse")} />;
    case "success":
      return <CheckCircle className={cn(baseClass, "text-green-500")} />;
    default:
      return <Info className={cn(baseClass, "text-blue-500 animate-pulse")} />;
  }
};

const getActivityBadge = (type: ActivityItem["type"]) => {
  const variants = {
    error: "destructive",
    warning: "secondary",
    success: "default",
    info: "outline",
  } as const;

  return variants[type as keyof typeof variants] || "outline";
};

export function ActivityFeed({ activities, title = "Recent Activity" }: ActivityFeedProps) {
  const safeActivities = Array.isArray(activities)
    ? activities.filter((a) => typeof a.type === "string" && a.id)
    : [];

  return (
    <Card className="border-dashboard-border bg-dashboard-surface shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-4">
            {safeActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              safeActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-dashboard-border bg-muted/30 hover:bg-muted/50 backdrop-blur-md transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={getActivityBadge(activity.type)}
                        className={cn(
                          "text-xs",
                          activity.type === "warning" || activity.type === "info"
                            ? "animate-pulse"
                            : ""
                        )}
                      >
                        {typeof activity.type === "string"
                          ? activity.type.toUpperCase()
                          : "UNKNOWN"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {activity.timestamp ?? "—"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{activity.message ?? "No message"}</p>
                    {activity.source && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Source: <span className="font-medium">{activity.source}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
