import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { LucideIcon } from "lucide-react";
import { METRIC_COLORS, type MetricColor } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";

interface MetricItem {
  label: string;
  value: string | number;
  color?: MetricColor;
  icon?: LucideIcon;
}

interface MetricCardProps {
  title: string;
  metrics: MetricItem[];
  color?: MetricColor;
  className?: string;
}

export function MetricCard({
  title,
  metrics,
  color = "primary",
  className,
}: MetricCardProps) {
  const colors = METRIC_COLORS[color];

  return (
    <Card className={cn("border-l-4", colors.border, className)}>
      <CardHeader>
        <CardTitle className="text-lg font-['Instrument_Sans']">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const itemColors = metric.color
              ? METRIC_COLORS[metric.color]
              : colors;
            const Icon = metric.icon;

            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className={cn("p-2 rounded-lg", itemColors.bg)}>
                      <Icon className={cn("h-4 w-4", itemColors.icon)} />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xl font-bold font-['Instrument_Sans']",
                    itemColors.text
                  )}
                >
                  {metric.value}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
