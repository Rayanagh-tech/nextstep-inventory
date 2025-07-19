import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "online" | "warning" | "critical" | "offline";
  decimals?: number;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  status,
  decimals = 0,
}: KpiCardProps) {
  const statusColors: Record<NonNullable<KpiCardProps["status"]>, string> = {
    online: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
    offline: "bg-gray-500",
  };

  const statusTooltip: Record<NonNullable<KpiCardProps["status"]>, string> = {
    online: "🟢 Online",
    warning: "🟠 Warning: High usage",
    critical: "🔴 Critical issue",
    offline: "⚫ Offline",
  };

  const statusColor = status ? statusColors[status] : "";

  const isNumeric =
    typeof value === "number" ||
    (!isNaN(Number(value)) && !String(value).includes(" "));

  const displayValue = isNumeric
    ? Number(value).toFixed(decimals)
    : value || "N/A";

  return (
    <Card
      className={cn(
        "relative overflow-hidden border bg-dashboard-surface backdrop-blur-sm transition-colors hover:border-primary/60",
        status === "critical" && "hover:shadow-red-500/30 hover:shadow-lg",
        status === "warning" && "hover:shadow-yellow-400/30 hover:shadow-md"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-muted-foreground" aria-label="icon">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline space-x-2">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-foreground"
          >
            {displayValue}
          </motion.div>

          {status && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full relative",
                      statusColor,
                      "after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-current after:opacity-25"
                    )}
                    aria-label={status}
                  />
                </TooltipTrigger>
                <TooltipContent>{statusTooltip[status]}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <AnimatePresence>
              <motion.div
                key={trend.value}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={cn(
                  "text-xs flex items-center font-medium",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(trend.value).toFixed(1)}%
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
