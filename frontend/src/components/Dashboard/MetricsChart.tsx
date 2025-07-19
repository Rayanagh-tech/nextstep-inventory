import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";

interface MetricPoint {
  timestamp: string;
  datacenter?: string;
  [key: string]: any;
}

interface MetricsChartProps {
  title: string;
  data: MetricPoint[];
  dataKey: string;
  color?: string;
  unit?: string;
  icon?: React.ReactNode;
  type?: "line" | "area" | "bar";
}

const datacenterColors: Record<string, string> = {
  "Sfax Datacenter": "#00bcd4",
  "Tunis Datacenter": "#8bc34a",
  "Sousse Datacenter": "#ff9800",
};

export function MetricsChart({
  title,
  data,
  dataKey,
  color = "hsl(var(--chart-1))",
  unit = "%",
  icon,
  type = "line",
}: MetricsChartProps) {
  const formatTooltip = (value: any, name: string) => [`${parseFloat(value).toFixed(2)} ${unit}`, name];

  const formatXAxis = (tickItem: string) => {
    const parsed = Date.parse(tickItem);
    return isNaN(parsed)
      ? tickItem
      : new Date(parsed).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        });
  };

  if (!data || data.length === 0) {
    return (
      <Card className="border border-dashed p-4 text-muted-foreground">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm py-16">
            No data available to display.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashboard-border bg-dashboard-surface">
      <CardHeader>
      <CardTitle className="text-xl font-extrabold flex items-center gap-2 tracking-tight">
  <span className="text-2xl">{icon}</span>
  {title}
</CardTitle>

      </CardHeader>
      <CardContent>
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                barCategoryGap={20}
                barSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="datacenter"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={13}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={13} unit="TB" />
                <Tooltip
                  formatter={(value: any, name: string, props) => [`${value} TB`, `Datacenter: ${props.payload.datacenter}`]}
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.85)",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    padding: "12px",
                    fontSize: "0.875rem",
                    backdropFilter: "blur(6px)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                    fontSize: "0.875rem",
                  }}
                />
                <Bar dataKey={dataKey} radius={[10, 10, 0, 0]} isAnimationActive name={undefined}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.datacenter && datacenterColors[entry.datacenter]
                          ? datacenterColors[entry.datacenter]
                          : `hsl(var(--chart-${(index % 6) + 1}))`
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : type === "area" ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="timestamp"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={formatXAxis}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit={unit} />
                <Tooltip
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.85)",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    padding: "12px",
                    fontSize: "0.875rem",
                    backdropFilter: "blur(6px)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                    fontSize: "0.875rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="timestamp"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={formatXAxis}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit={unit} />
                <Tooltip
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.85)",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    padding: "12px",
                    fontSize: "0.875rem",
                    backdropFilter: "blur(6px)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                    fontSize: "0.875rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
