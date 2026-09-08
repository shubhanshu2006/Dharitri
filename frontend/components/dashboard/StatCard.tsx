import { Card, CardContent } from "@/components/ui";
import { LucideIcon } from "lucide-react";
import { METRIC_COLORS, type MetricColor } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: MetricColor;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
  trend,
  onClick,
  className,
}: StatCardProps) {
  const colors = METRIC_COLORS[color];

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold font-['Instrument_Sans'] text-gray-900 mb-2">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className={cn("p-3 rounded-lg", colors.bg)}>
              <Icon className={cn("h-6 w-6", colors.icon)} />
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </span>
              {trend.label && (
                <span className="text-sm text-gray-500">{trend.label}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
